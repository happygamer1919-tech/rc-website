#!/usr/bin/env node
/* Header dropdown contrast gate, card W23-06 (wave 23). Run by `quality` on every
   pull request.

   The Servicii dropdown shipped at W15-02 with every row white on its white
   panel. `.nav a`, the bar's own link colour, also matched the panel's links,
   which sit inside .nav, and outranked .svcmenu__link. The rows appeared only
   under the pointer, because hover turned them orange. It reached the live site
   and stayed there for four days while every gate was green, because nothing
   measured the panel open: Lighthouse audits the page as it loads, and a closed
   panel has no text to audit.

   So this opens every header dropdown, in the resting state, and measures every
   piece of text inside it. For each element that directly holds visible text:
   its painted colour against the background it is painted on, composited up the
   tree through any translucent layer, must be at least 4.5:1. That is WCAG's
   threshold for normal text, quoted as the external standard it is; every row in
   these panels is normal text.

   THE RESTING STATE. A panel is opened by the element's own click(), which moves
   no pointer, and the pointer is then parked outside the header. Nothing in a
   panel may match :hover when it is measured, or the measurement is refused. The
   effective opacity of every text element must be 1.

   THE PANELS. The Servicii panel, and the Catalog panel with each category's
   sub-list opened in turn, since a sub-list is the same panel one level down.
   THE PAGES. Every built page that carries either panel, found in dist/ rather
   than listed, both locales, at 1280px. One page per template that carries them
   is also measured at the collapse edge, 1101px, and at 1440px, and those pages
   must be among the ones found, so a build that lost its dropdowns fails rather
   than measuring nothing. The privacy and 404 templates carry a header with no
   nav and no catalog, so they have no dropdown to open.

   IT NEVER PASSES ON NOTHING. It fails when a page is missing from dist/, when a
   panel does not open, when an open panel shows no text, when a colour cannot be
   read, when fewer combinations were measured than the matrix holds, and when a
   category sub-list shows nothing. It prints what it read before any result.

   Zero dependencies, like every script here: headless Chrome over the DevTools
   protocol with node's built-in WebSocket, and dist/ served from this process.

   Usage:  node build.js && node scripts/check-nav-contrast.js [--shots <dir>]
           --shots writes a PNG of each open Servicii panel at rest.
   Chrome: CHROME_BIN if set, else the usual install paths; never a silent skip. */

const { spawn, execFileSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const CDP_PORT = Number(process.env.NAV_CDP_PORT || 9441);
const HTTP_PORT = Number(process.env.NAV_HTTP_PORT || 8751);
const SHOTS = (() => { const i = process.argv.indexOf('--shots'); return i > -1 ? path.resolve(process.argv[i + 1]) : null; })();

/* WCAG 2.2, 1.4.3, normal text. */
const MIN_RATIO = 4.5;
/* The desktop nav shows above 1100px, where the header collapses. Every page
   is measured at ALL_AT; the template pages at every width. */
const WIDTHS = [1101, 1280, 1440];
const ALL_AT = 1280;
/* One page per template that carries the dropdowns, the header fit gate's pages
   for those templates. */
const TEMPLATE_PAGES = [
  { template: 'home', locale: 'RO', url: '/' },
  { template: 'home', locale: 'RU', url: '/ru/' },
  { template: 'service', locale: 'RO', url: '/servicii/acoperisuri/' },
  { template: 'service', locale: 'RU', url: '/ru/servicii/acoperisuri/' },
  { template: 'product', locale: 'RO', url: '/servicii/garduri/' },
  { template: 'product', locale: 'RU', url: '/ru/servicii/garduri/' },
  { template: 'category', locale: 'RO', url: '/catalog/termoizolatie/' },
  { template: 'category', locale: 'RU', url: '/ru/catalog/termoizolatie/' },
];

const fail = (msg) => { console.error(`\nNAV CONTRAST GATE FAILED: ${msg}\n`); process.exit(1); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* --- presence of the inputs ------------------------------------------------ */
if (TEMPLATE_PAGES.length === 0 || WIDTHS.length === 0) fail(`the matrix is empty (${TEMPLATE_PAGES.length} template pages, ${WIDTHS.length} widths), so nothing would be measured.`);
if (!fs.existsSync(DIST)) fail('dist/ does not exist. Run node build.js first.');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const built = walk(DIST).filter((f) => f.endsWith('.html')).sort();
const urlOf = (f) => '/' + path.relative(DIST, f).split(path.sep).join('/').replace(/(^|\/)index\.html$/, '$1');
const found = built.filter((f) => /id="(svcmenu|catalog)-panel"/.test(fs.readFileSync(f, 'utf8'))).map(urlOf);
const missing = TEMPLATE_PAGES.filter((p) => !found.includes(p.url)).map((p) => p.url);
if (missing.length) fail(`${missing.length} template page(s) carry no dropdown in dist/, or are not there: ${missing.join(', ')}. Run node build.js first.`);
const tpl = new Map(TEMPLATE_PAGES.map((p) => [p.url, p.template]));
const PAGES = found.map((url) => ({ url, locale: url.startsWith('/ru/') ? 'RU' : 'RO', template: tpl.get(url) || null }));
const MATRIX = PAGES.flatMap((p) => (p.template ? WIDTHS : [ALL_AT]).map((w) => ({ page: p, w })));
const byLocale = (lc) => PAGES.filter((p) => p.locale === lc).length;
if (!byLocale('RO') || !byLocale('RU')) fail(`pages carrying a dropdown: ${byLocale('RO')} RO, ${byLocale('RU')} RU. Both locales must carry them.`);
console.log(`built pages read: ${built.length}; carrying a dropdown: ${PAGES.length} (${byLocale('RO')} RO, ${byLocale('RU')} RU)`);
console.log(`template pages at ${WIDTHS.join(', ')}: ${TEMPLATE_PAGES.map((p) => `${p.template} ${p.locale}`).join(', ')}; every other page at ${ALL_AT}`);
console.log(`combinations expected: ${MATRIX.length}`);
console.log(`threshold: ${MIN_RATIO}:1 for every text element in an open panel, at rest\n`);

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

/* Measures one open panel. Every visible element that directly holds text is
   read: its painted colour (-webkit-text-fill-color, which is what paints, and
   which equals color unless something set it) composited over its background,
   and that background composited up the tree until an opaque layer, the page's
   white canvas if none. Returns rows, or { error } when a colour cannot be read. */
const MEASURE = `((panelId) => {
  const panel = document.getElementById(panelId);
  if (!panel) return { error: 'no #' + panelId + ' on the page' };
  const parse = (s) => {
    const m = /^rgba?\\(([^)]+)\\)$/.exec(s.trim());
    if (!m) return null;
    const v = m[1].split(/[\\s,\\/]+/).filter(Boolean).map(Number);
    return v.length >= 3 && v.every((x) => !Number.isNaN(x)) ? [v[0], v[1], v[2], v.length > 3 ? v[3] : 1] : null;
  };
  const over = (top, under) => [0, 1, 2].map((i) => top[i] * top[3] + under[i] * (1 - top[3]));
  const backdrop = (el) => {
    const layers = [];
    for (let n = el; n; n = n.parentElement) {
      const c = parse(getComputedStyle(n).backgroundColor);
      if (!c) return null;
      if (c[3] > 0) layers.push(c);
      if (c[3] >= 1) break;
    }
    let bg = [255, 255, 255];
    for (let i = layers.length - 1; i >= 0; i--) bg = over(layers[i], bg);
    return bg;
  };
  const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const lum = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const opacity = (el) => { let o = 1; for (let n = el; n; n = n.parentElement) o *= Number(getComputedStyle(n).opacity); return o; };
  const visible = (el) => {
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility === 'visible' && !el.closest('[hidden]');
  };
  const rows = [];
  for (const el of panel.querySelectorAll('*')) {
    const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').replace(/\\s+/g, ' ').trim();
    if (!own || !visible(el)) continue;
    const cs = getComputedStyle(el);
    const fg = parse(cs.webkitTextFillColor || cs.color);
    const bg = backdrop(el);
    if (!fg || !bg) return { error: 'a colour that cannot be read, on "' + own.slice(0, 40) + '": ' + (cs.webkitTextFillColor || cs.color) };
    const paint = over(fg, bg);
    const a = lum(paint), b = lum(bg);
    rows.push({ text: own.slice(0, 40), fg: paint.map(Math.round).join(','), bg: bg.map(Math.round).join(','),
      ratio: Math.round(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)) * 100) / 100,
      opacity: Math.round(opacity(el) * 1000) / 1000, hover: el.matches(':hover') || !!el.querySelector(':hover') });
  }
  return { rows };
})`;

/* Opens a panel by its toggle's own click(), which moves no pointer, then parks
   the pointer at the bottom-left corner of the viewport, well below the header. */
const openPanel = (toggleId, panelId) => `(() => {
  const t = document.getElementById('${toggleId}'), p = document.getElementById('${panelId}');
  if (!t || !p) return { error: 'no #${toggleId} or #${panelId} on the page' };
  if (p.hidden) t.click();
  return { open: !p.hidden && t.getAttribute('aria-expanded') === 'true' };
})()`;
const closeAll = `(() => { for (const id of ['svcmenu-toggle', 'catalog-toggle']) { const t = document.getElementById(id); if (t && t.getAttribute('aria-expanded') === 'true') t.click(); } })()`;

async function main() {
  const chromeBin = findChrome();
  const server = await serve();
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'rc-nav-contrast-'));
  const args = ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`,
    '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--force-device-scale-factor=1'];
  // A CI container user may not be allowed Chrome's sandbox; nothing is untrusted here.
  if (process.env.CI) args.push('--no-sandbox');
  const chrome = spawn(chromeBin, [...args, 'about:blank'], { stdio: 'ignore' });
  const stop = () => { try { chrome.kill(); } catch {} server.close(); };
  /* W25-03b. The profile directory is removed however this process ends, the
     fail() path included. Every browser gate here created one and none removed
     it: 727 had accumulated to 28.9GB before anyone looked, and each one is a
     whole Chrome profile. `exit` fires on a normal return AND on process.exit,
     which is what fail() calls, so the one path that leaked most is covered.
     Chrome is killed first, because a live Chrome writes the directory back. */
  process.on('exit', () => {
    try { chrome.kill(); } catch {}
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
  });


  let up = null;
  for (let i = 0; i < 80 && !up; i++) { try { up = await rq(`http://127.0.0.1:${CDP_PORT}/json/version`); } catch { await sleep(250); } }
  if (!up) { stop(); fail(`Chrome (${chromeBin}) did not start.`); }
  console.log(`chrome: ${up.Browser}`);

  const target = await rq(`http://127.0.0.1:${CDP_PORT}/json/new?about:blank`, 'PUT');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  const cdp = new CDP(ws);
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
  if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });

  const problems = [];
  const combos = [];
  let measured = 0;
  const park = (h) => cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 2, y: h - 2 });
  const judge = (where, panel, r) => {
    if (r.error) { problems.push({ kind: 'PRESENCE', where, msg: `${panel}: ${r.error}` }); return null; }
    if (!r.rows.length) { problems.push({ kind: 'PRESENCE', where, msg: `${panel}: the open panel shows no text` }); return null; }
    const hovered = r.rows.filter((x) => x.hover);
    if (hovered.length) { problems.push({ kind: 'NOT AT REST', where, msg: `${panel}: ${hovered.length} element(s) under the pointer, so this is not the resting state` }); return null; }
    for (const x of r.rows) {
      if (x.ratio < MIN_RATIO) problems.push({ kind: 'CONTRAST', where, msg: `${panel}: "${x.text}" ${x.ratio}:1, text ${x.fg} on ${x.bg}` });
      if (x.opacity < 1) problems.push({ kind: 'OPACITY', where, msg: `${panel}: "${x.text}" rests at opacity ${x.opacity}` });
    }
    measured += r.rows.length;
    return Math.min(...r.rows.map((x) => x.ratio));
  };

  for (const { page, w } of MATRIX) {
    {
      const h = 900;
      await cdp.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
      await cdp.send('Page.navigate', { url: `http://127.0.0.1:${HTTP_PORT}${page.url}` });
      for (let i = 0; i < 80; i++) { if (await cdp.ev('document.readyState === "complete"').catch(() => false)) break; await sleep(150); }
      await cdp.ev('document.fonts.ready.then(() => 1)').catch(() => 0);
      await park(h);
      const where = `${page.locale} at ${w}px (${page.url})`;
      const combo = { page, w, svc: null, cat: null, subs: 0 };

      /* The Servicii panel. */
      const o1 = await cdp.ev(openPanel('svcmenu-toggle', 'svcmenu-panel'));
      if (o1.error || !o1.open) { problems.push({ kind: 'PRESENCE', where, msg: `Servicii: ${o1.error || 'the panel did not open'}` }); continue; }
      await park(h); await sleep(150);
      combo.svc = judge(where, 'Servicii', await cdp.ev(`${MEASURE}('svcmenu-panel')`));
      if (SHOTS && combo.svc !== null && (w === 1280 || w === 1440) && page.template === 'home') {
        const box = await cdp.ev(`(() => { const r = document.getElementById('svcmenu-panel').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; })()`);
        const shot = await cdp.send('Page.captureScreenshot', { format: 'png', clip: { x: Math.max(0, box.x - 160), y: 0, width: box.w + 320, height: Math.min(h, box.y + box.h + 24), scale: 1 } });
        fs.writeFileSync(path.join(SHOTS, `servicii-${page.locale}-${w}.png`), Buffer.from(shot.data, 'base64'));
      }
      await cdp.ev(closeAll);

      /* The Catalog panel, then each category's sub-list in turn. */
      const o2 = await cdp.ev(openPanel('catalog-toggle', 'catalog-panel'));
      if (o2.error || !o2.open) { problems.push({ kind: 'PRESENCE', where, msg: `Catalog: ${o2.error || 'the panel did not open'}` }); continue; }
      await park(h); await sleep(150);
      const top = judge(where, 'Catalog', await cdp.ev(`${MEASURE}('catalog-panel')`));
      const parents = await cdp.ev(`document.querySelectorAll('#catalog-panel .catalog__list--top > .catalog__row--parent').length`);
      if (!parents) problems.push({ kind: 'PRESENCE', where, msg: 'Catalog: no category with a sub-list' });
      let subMin = Infinity;
      for (let k = 0; k < parents; k++) {
        const opened = await cdp.ev(`(() => {
          const row = document.querySelectorAll('#catalog-panel .catalog__list--top > .catalog__row--parent')[${k}];
          const sub = row.querySelector('.catalog__sub');
          if (sub.hidden) row.querySelector('.catalog__expand').click();
          return { open: !sub.hidden, name: (row.querySelector('.catalog__link') || {}).textContent || '' };
        })()`);
        if (!opened.open) { problems.push({ kind: 'PRESENCE', where, msg: `Catalog: the sub-list of "${opened.name.trim()}" did not open` }); continue; }
        await park(h); await sleep(100);
        const m = judge(where, `Catalog > ${opened.name.trim()}`, await cdp.ev(`${MEASURE}('catalog-panel')`));
        if (m !== null) { subMin = Math.min(subMin, m); combo.subs++; }
      }
      await cdp.ev(closeAll);
      combo.cat = top === null ? null : Math.min(top, subMin);
      combos.push(combo);
    }
  }
  ws.close(); stop();

  const expected = MATRIX.length;
  const complete = combos.filter((c) => c.svc !== null && c.cat !== null).length;
  console.log(`combinations measured: ${complete} of ${expected}; text elements measured: ${measured}; category sub-lists opened: ${combos.reduce((s, c) => s + c.subs, 0)}\n`);
  console.log(`lowest ratio per panel on the template pages (:1); the threshold is ${MIN_RATIO}`);
  process.stdout.write('page'.padEnd(14)); WIDTHS.forEach((w) => process.stdout.write(`   svc ${w}`.padStart(12) + `   cat ${w}`.padStart(12))); process.stdout.write('\n');
  for (const p of PAGES.filter((x) => x.template)) {
    process.stdout.write(`${p.template} ${p.locale}`.padEnd(14));
    for (const w of WIDTHS) {
      const c = combos.find((x) => x.page === p && x.w === w);
      process.stdout.write(String(c && c.svc !== null ? c.svc : '?').padStart(12) + String(c && c.cat !== null ? c.cat : '?').padStart(12));
    }
    process.stdout.write('\n');
  }
  const rest = combos.filter((c) => !c.page.template && c.svc !== null && c.cat !== null);
  if (rest.length) console.log(`every other page at ${ALL_AT}px (${rest.length}): lowest Servicii ${Math.min(...rest.map((c) => c.svc))}, lowest Catalog ${Math.min(...rest.map((c) => c.cat))}`);
  if (SHOTS) console.log(`\nscreenshots of the open Servicii panel at rest: ${SHOTS}`);

  if (complete !== expected && !problems.length) problems.push({ kind: 'PRESENCE', where: 'the matrix', msg: `measured ${complete} of ${expected} combinations` });
  if (problems.length) {
    const kinds = [...new Set(problems.map((p) => p.kind))];
    console.error(`\nNAV CONTRAST GATE FAILED: ${problems.length} problem(s), ${kinds.join(', ')}`);
    for (const k of kinds) {
      const of = problems.filter((x) => x.kind === k);
      console.error(`\n  ${k} (${of.length})`);
      for (const p of of.slice(0, 40)) console.error(`    ${p.where}: ${p.msg}`);
      if (of.length > 40) console.error(`    ... and ${of.length - 40} more`);
    }
    console.error('');
    process.exit(1);
  }
  console.log(`\n${complete} of ${expected} combinations: every text element in the Servicii panel and in the Catalog panel and its ${combos.reduce((s, c) => s + c.subs, 0)} opened sub-lists rests at ${MIN_RATIO}:1 or better, fully opaque, with nothing under the pointer.`);
}

main().catch((e) => fail(e && e.stack ? e.stack : String(e)));
