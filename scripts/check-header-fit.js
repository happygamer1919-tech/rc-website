#!/usr/bin/env node
/* Header fit gate, card RC-139 (W18-02). Run by `quality` on every pull request.

   The header pill holds the catalog button, the logo, the desktop nav, the
   phone, the CTA and the language switch in one row. Three waves measured it by
   hand (RC-121, W15-02, W16-03, W17-05) with a scratch harness that was never
   committed, so nothing stopped a later string change from breaking the fit.
   This is that harness, made a gate.

   Two assertions, deliberately distinct, each with its own message:

   1. FIT. No two visible interactive targets in the pill intersect, slack is at
      or above zero, and the page does not scroll sideways. RC-121's definition of
      fitting. Pairwise on purpose: flex children shrink and slide UNDER a
      neighbour without the page's scroll width ever exceeding its client width,
      so an overflow check alone misses the real failure.

   2. MARGIN. Slack at or above SLACK_FLOOR at every tested width, in both
      locales. A header can fit with 1px to spare, and a font rendering
      difference or a one-letter string change then breaks it on a visitor's
      screen. The floor is the owner's (wave 18 dispatch): fail below it, and name
      the locale, the width and the measured value.

   Plus what W17-05 shipped and measured: the Servicii caret present wherever the
   desktop nav shows, and from PHONE_FROM up the phone number visible, inside the
   pill, unclipped and reading as the number.

   SLACK is the pill's inner width minus what its children need. `.nav` is
   flex: 1 1 auto, so it stretches to whatever the pill has left: its scrollWidth
   is the width it was GIVEN, and summing that makes slack exactly 0 at every
   width by construction. The nav's natural width is its own visible children
   plus their gaps, which is what is summed.

   IT NEVER PASSES ON NOTHING. It fails when a page is missing from dist/, when a
   page has no header pill, when the pill yields no targets, when fewer
   combinations were measured than the matrix holds, and when the Inter webfont
   did not load: every width here is a text width, and a fallback font measures a
   different header, so a run without Inter is not a measurement of this site. It
   prints the pages read and the combinations measured before any result.

   Zero dependencies, like every script here: headless Chrome over the DevTools
   protocol with node's built-in WebSocket, and dist/ served from this process.

   Usage:  node build.js && node scripts/check-header-fit.js
   Chrome: CHROME_BIN if set, else the usual install paths; never a silent skip. */

const { spawn, execFileSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const CDP_PORT = Number(process.env.HDR_CDP_PORT || 9431);
const HTTP_PORT = Number(process.env.HDR_HTTP_PORT || 8741);

/* The owner's floor, wave 18 dispatch (RC-139). The px it is set against is
   measured, not chosen, and lives in DECISIONS.md, W17-05 and W18-02. */
const SLACK_FLOOR = 8;
const PHONE_FROM = 1280;
const PHONE_TEXT = '+373 76 837 180';

/* Every width the header has been measured at since W15-02: either side of the
   collapse at 1100px, the 1180px step, and the desktop widths. */
const WIDTHS = [769, 900, 1024, 1099, 1100, 1180, 1280, 1440, 1920];
/* One page per template that carries the header pill, in both locales. */
const PAGES = [
  { template: 'home', locale: 'RO', url: '/' },
  { template: 'home', locale: 'RU', url: '/ru/' },
  { template: 'service', locale: 'RO', url: '/servicii/acoperisuri/' },
  { template: 'service', locale: 'RU', url: '/ru/servicii/acoperisuri/' },
  // W24-07. The rocă vulcanică page uses the product template but is a mirror
  // page with its own sections; measured on its own.
  { template: 'novatik', locale: 'RO', url: '/servicii/roca-vulcanica/' },
  { template: 'novatik', locale: 'RU', url: '/ru/servicii/roca-vulcanica/' },
  // W24-08. The copertine page now carries a dark full-width hero of its own,
  // and the fence models page is a second mirror; both measured on their own.
  { template: 'cop-hero', locale: 'RO', url: '/servicii/copertine/' },
  { template: 'cop-hero', locale: 'RU', url: '/ru/servicii/copertine/' },
  { template: 'gard-modele', locale: 'RO', url: '/servicii/modele-garduri/' },
  { template: 'gard-modele', locale: 'RU', url: '/ru/servicii/modele-garduri/' },
  { template: 'product', locale: 'RO', url: '/servicii/garduri/' },
  { template: 'product', locale: 'RU', url: '/ru/servicii/garduri/' },
  { template: 'category', locale: 'RO', url: '/catalog/termoizolatie/' },
  { template: 'category', locale: 'RU', url: '/ru/catalog/termoizolatie/' },
  // W24-04. One page per template, and wave 24 adds two: the catalogue index and
  // a subcategory page. The subcategory uses the category template but is a level
  // deeper, and a deeper page is where a relative header asset would break.
  { template: 'catalog-index', locale: 'RO', url: '/catalog/' },
  { template: 'catalog-index', locale: 'RU', url: '/ru/catalog/' },
  { template: 'subcategory', locale: 'RO', url: '/catalog/termoizolatie/polistiren-expandat/' },
  { template: 'subcategory', locale: 'RU', url: '/ru/catalog/termoizolatie/polistiren-expandat/' },
  // W24-06. The shared "in construcție" page carries the full header too.
  { template: 'in-constructie', locale: 'RO', url: '/in-constructie/' },
  { template: 'in-constructie', locale: 'RU', url: '/ru/in-constructie/' },
  { template: 'privacy', locale: 'RO', url: '/confidentialitate/' },
  { template: 'privacy', locale: 'RU', url: '/ru/konfidentsialnost/' },
  { template: '404', locale: 'RO', url: '/404.html' },
  { template: '404', locale: 'RU', url: '/ru/404.html' },
];

const fail = (msg) => { console.error(`\nHEADER FIT GATE FAILED: ${msg}\n`); process.exit(1); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* --- presence of the inputs ------------------------------------------------ */
/* W18-03 (RC-140). An empty matrix measured nothing and printed "0 of 0
   combinations", exit 0. This gate shipped with that gap in W18-02. */
if (PAGES.length === 0 || WIDTHS.length === 0) fail(`the matrix is empty (${PAGES.length} pages, ${WIDTHS.length} widths), so nothing would be measured.`);
const distFile = (u) => path.join(DIST, u.endsWith('/') ? path.join(u, 'index.html') : u);
const missing = PAGES.filter((p) => !fs.existsSync(distFile(p.url))).map((p) => p.url);
if (missing.length) fail(`${missing.length} page(s) not in dist/: ${missing.join(', ')}. Run node build.js first.`);
console.log(`pages read: ${PAGES.length} of ${PAGES.length} in dist/ (${[...new Set(PAGES.map((p) => p.template))].join(', ')}; RO and RU)`);
console.log(`widths: ${WIDTHS.join(', ')}; combinations expected: ${PAGES.length * WIDTHS.length}`);
console.log(`slack floor: ${SLACK_FLOOR}px, every width, both locales\n`);

/* --- Chrome, found or failed ------------------------------------------------ */
function findChrome() {
  const tried = [];
  const runs = (bin) => { tried.push(bin); try { execFileSync(bin, ['--version'], { stdio: 'ignore', timeout: 30000 }); return true; } catch { return false; } };
  if (process.env.CHROME_BIN) {
    if (runs(process.env.CHROME_BIN)) return process.env.CHROME_BIN;
    fail(`CHROME_BIN is set to "${process.env.CHROME_BIN}" but it does not run.`);
  }
  for (const bin of ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', 'google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']) {
    if (runs(bin)) return bin;
  }
  fail(`no Chrome found. Tried: ${tried.join(', ')}. Set CHROME_BIN.`);
}

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain' };
function serve() {
  return new Promise((res) => {
    const s = http.createServer((rq, rs) => {
      let f = path.join(DIST, decodeURIComponent(rq.url.split('?')[0]));
      if (f.endsWith('/')) f = path.join(f, 'index.html');
      if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) {
        if (fs.existsSync(path.join(f, 'index.html'))) f = path.join(f, 'index.html');
        else { rs.writeHead(404); rs.end('not found'); return; }
      }
      rs.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(rs);
    });
    s.listen(HTTP_PORT, '127.0.0.1', () => res(s));
  });
}

function rq(url, method = 'GET') {
  return new Promise((res, rej) => {
    const u = new URL(url);
    const r = http.request({ hostname: u.hostname, port: u.port, path: u.pathname + u.search, method },
      (x) => { let b = ''; x.on('data', (c) => (b += c)); x.on('end', () => { try { res(JSON.parse(b)); } catch { res(b); } }); });
    r.on('error', rej); r.end();
  });
}

class CDP {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.p = new Map();
    ws.addEventListener('message', (e) => {
      const m = JSON.parse(e.data);
      if (m.id && this.p.has(m.id)) {
        const { resolve, reject } = this.p.get(m.id); this.p.delete(m.id);
        m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result);
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => { this.p.set(id, { resolve, reject }); this.ws.send(JSON.stringify({ id, method, params })); });
  }
  async ev(expression) {
    const r = await this.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
    return r.result.value;
  }
}

/* Inter arrives through an async stylesheet, so readyState "complete" can come
   before any Inter face has even started loading, and document.fonts.ready then
   resolves at once. Wait for at least one Inter face LOADED and none still
   loading, then settle. Returns the count of loaded Inter faces, 0 on timeout. */
const FONTS = `(async () => {
  const inter = () => [...document.fonts].filter((f) => f.family.replace(/["']/g, '') === 'Inter');
  for (let i = 0; i < 100; i++) {
    const faces = inter();
    if (faces.some((f) => f.status === 'loaded') && !faces.some((f) => f.status === 'loading')) {
      await document.fonts.ready;
      return inter().filter((f) => f.status === 'loaded').length;
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  return 0;
})()`;

/* Visibility by the rendered box, never offsetParent: the header is fixed, where
   offsetParent is unreliable. display:none is a 0x0 rect, which is how the
   desktop nav collapses at 1100px and below. */
const PROBE = `(() => {
  const pill = document.querySelector('.header__pill');
  if (!pill) return { error: 'no .header__pill on the page' };
  const vis = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.opacity !== '0';
  };
  const SEL = [
    ['catalog', '.catalog__toggle'],
    ['logo', '.header__logo'],
    ['nav-link', '.nav > a'],
    ['svc-toggle', '.nav .svcmenu__toggle'],
    ['phone', '.header__phone'],
    ['cta', '.header__actions .btn'],
    ['lang', '.header__actions .lang'],
    ['mobile-btn', '.header__mobile .icon-btn'],
  ];
  const targets = [];
  for (const [kind, s] of SEL) {
    for (const el of pill.querySelectorAll(s)) {
      if (!vis(el)) continue;
      const r = el.getBoundingClientRect();
      const text = (el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 14);
      targets.push({ label: text || kind, l: r.left, t: r.top, rt: r.right, b: r.bottom });
    }
  }
  const hits = [];
  for (let i = 0; i < targets.length; i++) {
    for (let j = i + 1; j < targets.length; j++) {
      const a = targets[i], b = targets[j];
      const ox = Math.min(a.rt, b.rt) - Math.max(a.l, b.l);
      const oy = Math.min(a.b, b.b) - Math.max(a.t, b.t);
      if (ox > 0.5 && oy > 0.5) hits.push(a.label + ' x ' + b.label + ' (' + Math.round(ox) + 'px)');
    }
  }
  const cs = getComputedStyle(pill);
  const gap = parseFloat(cs.columnGap || cs.gap || '0') || 0;
  const natural = (el) => {
    if (!el.classList.contains('nav')) return el.scrollWidth;
    const ns = getComputedStyle(el);
    const ng = parseFloat(ns.columnGap || ns.gap || '0') || 0;
    const kids = Array.from(el.children).filter(vis);
    return kids.reduce((s, c) => s + c.getBoundingClientRect().width, 0) + ng * Math.max(0, kids.length - 1);
  };
  const kids = Array.from(pill.children).filter(vis);
  const needed = kids.reduce((s, k) => s + natural(k), 0) + gap * Math.max(0, kids.length - 1);
  const avail = pill.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const doc = document.documentElement;
  const navEl = pill.querySelector('.nav');
  const navVisible = !!navEl && vis(navEl);
  const caretEl = pill.querySelector('.nav .svcmenu__toggle .svcmenu__caret');
  const caret = caretEl && vis(caretEl) ? Math.round(caretEl.getBoundingClientRect().width) : 0;
  const ph = pill.querySelector('.header__phone');
  const pr = pill.getBoundingClientRect();
  let phone = { visible: false, text: '', inside: false, clipped: null };
  if (ph && vis(ph)) {
    const r = ph.getBoundingClientRect();
    phone = { visible: true, text: (ph.textContent || '').trim().replace(/\\s+/g, ' '),
      inside: r.left >= pr.left - 0.5 && r.right <= pr.right + 0.5, clipped: ph.scrollWidth > ph.clientWidth + 0.5 };
  }
  return { navVisible, caret, phone, targets: targets.length, hits, slack: Math.round(avail - needed),
    hScroll: doc.scrollWidth > doc.clientWidth ? doc.scrollWidth - doc.clientWidth : 0 };
})()`;

async function main() {
  const chromeBin = findChrome();
  const server = await serve();
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'rc-header-fit-'));
  const args = ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`,
    '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--force-device-scale-factor=1'];
  // A CI container user may not be allowed Chrome's sandbox; nothing is untrusted here.
  if (process.env.CI) args.push('--no-sandbox');
  const chrome = spawn(chromeBin, [...args, 'about:blank'], { stdio: 'ignore' });
  const stop = () => { try { chrome.kill(); } catch {} server.close(); };

  let up = null;
  for (let i = 0; i < 80 && !up; i++) { try { up = await rq(`http://127.0.0.1:${CDP_PORT}/json/version`); } catch { await sleep(250); } }
  if (!up) { stop(); fail(`Chrome (${chromeBin}) did not start.`); }
  console.log(`chrome: ${up.Browser}`);

  const target = await rq(`http://127.0.0.1:${CDP_PORT}/json/new?about:blank`, 'PUT');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  const cdp = new CDP(ws);
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable');

  const rows = [];
  const problems = [];
  let interMin = Infinity;
  for (const page of PAGES) {
    for (const w of WIDTHS) {
      await cdp.send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: false });
      await cdp.send('Page.navigate', { url: `http://127.0.0.1:${HTTP_PORT}${page.url}` });
      for (let i = 0; i < 80; i++) { if (await cdp.ev('document.readyState === "complete"').catch(() => false)) break; await sleep(150); }
      const inter = await cdp.ev(FONTS).catch(() => 0);
      interMin = Math.min(interMin, inter);
      await sleep(200);
      const where = `${page.locale} at ${w}px (${page.template}, ${page.url})`;
      // Fail at once: every later width would be measured in the wrong font too.
      if (!inter) { ws.close(); stop(); fail(`the Inter webfont did not load for ${where}, so nothing here would be a measurement of this site. Widths in a fallback font are not evidence.`); }
      const r = await cdp.ev(PROBE);
      if (r.error) { problems.push({ kind: 'PRESENCE', where, msg: r.error }); continue; }
      if (r.targets === 0) { problems.push({ kind: 'PRESENCE', where, msg: 'zero visible targets in the header pill' }); continue; }
      rows.push({ page, w, ...r });
      if (r.hits.length) problems.push({ kind: 'FIT', where, msg: `${r.hits.length} intersecting target pair(s): ${r.hits.slice(0, 3).join('; ')}` });
      if (r.slack < 0) problems.push({ kind: 'FIT', where, msg: `slack ${r.slack}px: the pill cannot hold its children` });
      if (r.hScroll) problems.push({ kind: 'FIT', where, msg: `the page scrolls sideways by ${r.hScroll}px` });
      if (r.slack < SLACK_FLOOR) problems.push({ kind: 'SLACK FLOOR', where, msg: `locale ${page.locale}, width ${w}px, measured slack ${r.slack}px, floor ${SLACK_FLOOR}px` });
      if (r.navVisible && !r.caret) problems.push({ kind: 'CARET', where, msg: 'the desktop nav shows but the Servicii caret is missing' });
      if (w >= PHONE_FROM && !(r.phone.visible && r.phone.inside && !r.phone.clipped && r.phone.text === PHONE_TEXT)) {
        problems.push({ kind: 'PHONE', where, msg: `phone not fully visible (visible ${r.phone.visible}, inside ${r.phone.inside}, clipped ${r.phone.clipped}, text "${r.phone.text}")` });
      }
    }
  }
  ws.close(); stop();

  const expected = PAGES.length * WIDTHS.length;
  console.log(`combinations measured: ${rows.length} of ${expected}; Inter faces loaded on every page (fewest: ${interMin === Infinity ? 0 : interMin})\n`);

  const label = (p) => `${p.template} ${p.locale}`;
  const table = (title, cell) => {
    console.log(title);
    process.stdout.write('page'.padEnd(14)); WIDTHS.forEach((w) => process.stdout.write(String(w).padStart(7))); process.stdout.write('\n');
    for (const p of PAGES) {
      process.stdout.write(label(p).padEnd(14));
      for (const w of WIDTHS) { const r = rows.find((x) => x.page === p && x.w === w); process.stdout.write(String(r ? cell(r) : '?').padStart(7)); }
      process.stdout.write('\n');
    }
    console.log('');
  };
  table(`slack by width (px); the floor is ${SLACK_FLOOR}`, (r) => r.slack);
  table('caret width (px) where the desktop nav shows, "-" where it is collapsed', (r) => (r.navVisible ? r.caret : '-'));
  if (rows.length) {
    const byLocale = ['RO', 'RU'].map((lc) => { const rs = rows.filter((r) => r.page.locale === lc); const m = Math.min(...rs.map((r) => r.slack)); return `${lc} ${m}px at ${[...new Set(rs.filter((r) => r.slack === m).map((r) => r.w))].join('/')}`; });
    console.log(`least slack: ${byLocale.join('; ')}`);
  }

  if (rows.length !== expected && !problems.length) problems.push({ kind: 'PRESENCE', where: 'the matrix', msg: `measured ${rows.length} of ${expected} combinations` });
  if (problems.length) {
    const kinds = [...new Set(problems.map((p) => p.kind))];
    console.error(`\nHEADER FIT GATE FAILED: ${problems.length} problem(s), ${kinds.join(', ')}`);
    for (const k of kinds) {
      console.error(`\n  ${k}`);
      for (const p of problems.filter((x) => x.kind === k)) console.error(`    ${p.where}: ${p.msg}`);
    }
    console.error('');
    process.exit(1);
  }
  console.log(`\n${rows.length} of ${expected} combinations: zero intersections, no sideways scroll, slack at or above the ${SLACK_FLOOR}px floor everywhere, caret wherever the nav shows, phone fully visible from ${PHONE_FROM}px.`);
}

main().catch((e) => fail(e && e.stack ? e.stack : String(e)));
