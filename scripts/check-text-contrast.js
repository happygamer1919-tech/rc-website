#!/usr/bin/env node
/* Text contrast gate, gate 28, card W26-05a (wave 26). Run by `quality` on every
   pull request.

   WHAT IT CAUGHT BEFORE IT EXISTED. The owner found it on the live site, by eye:
   rocă vulcanică's Compară modelele table printed its model names and its row
   labels WHITE ON WHITE. The table paints its own white ground and sits on a dark
   band; its th set no colour of their own, so they inherited the band's white. The
   td were readable only because they carry --ink-muted. W24-07 shipped it on
   2026-09-20 and it was live for two days, in both locales.
   The same afternoon's sweep found a second one of the same shape: the copertine
   hero's breadcrumb, where `.breadcrumb`, declared later in the stylesheet, beat
   `.cop-hero__crumb` at equal specificity and painted the current page --ink on
   --bg-dark, 1.06:1. W24-08, the same day, also live for two days.

   WHY NO GATE SAW EITHER. Gate 5 runs Lighthouse, whose accessibility audit does
   measure contrast, on TWO pages: the homepages. Gate 18 measures contrast inside
   the header dropdowns and nowhere else. Every other page on the site had never
   had its text contrast read by anything.

   WHAT IT ASSERTS. Every built page in dist/, both locales, found rather than
   listed, at 1440 (desktop) and 390 (phone, mobile emulation): every element that
   directly holds visible text paints it at WCAG 2.2 1.4.3's threshold or better
   against what it is painted on. 4.5:1 for normal text, 3:1 for large text, which
   WCAG defines as 18pt (24px) or 14pt (18.66px) bold. Those are WCAG's numbers,
   quoted as the external standard they are.
   The painted colour is the text colour composited at the element's cumulative
   opacity over its backdrop; the backdrop is every background colour up the tree,
   composited through any translucent layer, down to the first opaque one, and the
   page's white canvas if there is none.

   AT REST. Reveals are applied, reduced motion is emulated, and every finite
   animation is waited out, so nothing is measured mid-transition. The pointer is never moved, and a row whose element
   matches :hover is refused rather than judged. Pages that are only a meta
   refresh (the catalogue redirect pages) are skipped and counted: their refresh
   fires before anything on them can be measured.

   WHAT IT CANNOT READ, stated rather than hidden. The backdrop is read from the
   element's ANCESTORS. Text laid over a photograph by absolute positioning is
   measured against the colour under the photograph, not the photograph. Every row
   whose backdrop chain carries a background image is counted and printed. Text
   shown only on interaction (an open menu, the lead modal, a hover state) is not
   at rest and is not read here; gate 18 reads the dropdowns.
   DECORATION IS NOT JUDGED, and it is named by the one attribute that says so.
   WCAG 1.4.3 excepts text that is "pure decoration". On this site that is text
   under aria-hidden="true": the roofing offer cards' ghost numerals, 01 to 04 in
   --brand at 0.1 opacity (W14-08), which the first run of this gate read at 1.13:1
   and which are meant to be read at 1.13:1. Text a sighted visitor needs is never
   aria-hidden here, because aria-hidden also takes it from a screen reader. The
   count and the faintest ratio are printed every run, so the exception is visible.
   It does not require the Inter webfont, deliberately: a colour and a computed
   font size do not depend on the face, and the other browser gates already fail
   when Inter does not load.

   IT NEVER PASSES ON NOTHING. It fails on zero pages, on either locale having
   none, on a page with no measurable text, on a colour it cannot read, and on
   fewer combinations measured than the matrix holds.

   ITS SELF-TEST RUNS FIRST, twelve arms between two clean controls read immediately
   before and immediately after (R-AB), each asserted by its message id. Both real
   defects are planted back onto the real pages and must fire. Three arms are
   GREEN, shapes the gate must ACCEPT: large text at a colour normal text may not
   use, white-on-white text that is visually hidden or under [hidden], and the
   ghost numeral; the numeral with its aria-hidden removed is the red arm beside
   it. A rule this shape is as likely to be written too tight as too loose.

   Zero dependencies: headless Chrome over the DevTools protocol with node's
   built-in WebSocket, and dist/ served from this process.

   Usage:  node build.js && node scripts/check-text-contrast.js
   Chrome: CHROME_BIN if set, else the usual install paths; never a silent skip. */

const { spawn, execFileSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.resolve(process.argv[2] || path.join(ROOT, 'dist'));
const CDP_PORT = Number(process.env.CONTRAST_CDP_PORT || 9446);
const HTTP_PORT = Number(process.env.CONTRAST_HTTP_PORT || 8756);

/* WCAG 2.2, 1.4.3. */
const MIN_NORMAL = 4.5;
const MIN_LARGE = 3;
const LARGE_PX = 24;
const LARGE_BOLD_PX = 18.66;
const WIDTHS = [{ w: 1440, mobile: false }, { w: 390, mobile: true }];
const SELFTEST = '/__contrast-selftest__/';

const fail = (msg) => { console.error(`\nTEXT CONTRAST GATE FAILED: ${msg}\n`); process.exit(1); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* --- presence of the inputs ------------------------------------------------ */
if (!fs.existsSync(DIST)) fail(`${DIST} does not exist. Run node build.js first.`);
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const urlOf = (f) => '/' + path.relative(DIST, f).split(path.sep).join('/').replace(/(^|\/)index\.html$/, '$1');
const built = walk(DIST).filter((f) => f.endsWith('.html')).sort();
const isRefresh = (f) => /<meta\s+http-equiv="refresh"/i.test(fs.readFileSync(f, 'utf8'));
const redirects = built.filter(isRefresh).map(urlOf);
const PAGES = built.filter((f) => !isRefresh(f)).map(urlOf);
const byLocale = (lc) => PAGES.filter((u) => (lc === 'RU') === u.startsWith('/ru/')).length;
if (PAGES.length === 0) fail('zero built pages to measure. Run node build.js first.');
if (!byLocale('RO') || !byLocale('RU')) fail(`pages to measure: ${byLocale('RO')} RO, ${byLocale('RU')} RU. Both locales must be there.`);
for (const must of ['/servicii/roca-vulcanica/', '/servicii/copertine/']) {
  if (!PAGES.includes(must)) fail(`${must} is not in dist/, and the self-test plants its real defects there.`);
}
console.log(`built pages read: ${built.length}; measured: ${PAGES.length} (${byLocale('RO')} RO, ${byLocale('RU')} RU); skipped as meta-refresh redirects: ${redirects.length}`);
console.log(`widths: ${WIDTHS.map((x) => x.w + (x.mobile ? ' (mobile)' : '')).join(', ')}; combinations expected: ${PAGES.length * WIDTHS.length}`);
console.log(`thresholds: ${MIN_NORMAL}:1 normal text, ${MIN_LARGE}:1 large text (${LARGE_PX}px, or ${LARGE_BOLD_PX}px at weight 700 or more)\n`);

/* --- the self-test's synthetic pages ------------------------------------------ */
const synth = (body) => `<!doctype html><html lang="ro"><head><meta charset="utf-8"><title>t</title><style>
body { margin: 0; padding: 24px; font: 16px/1.5 sans-serif; background: #FFFFFF; color: #1A1A1A; }
.band { background: #141414; color: #FFFFFF; padding: 24px; }
</style></head><body>${body}</body></html>`;
const SYNTH = {
  'control.html': synth('<p>Grosime</p><div class="band"><p>Greutate</p></div>'),
  'normal-under.html': synth('<p style="color: #8A8A8A">Grosime</p>'),
  'large-at-same.html': synth('<p style="color: #8A8A8A; font-size: 24px">Grosime</p><p style="color: #8A8A8A; font-size: 19px; font-weight: 700">Greutate</p>'),
  'translucent.html': synth('<div class="band"><div style="background: rgba(255, 255, 255, 0.85)"><p style="color: #FFFFFF">Grosime</p></div></div>'),
  'opacity.html': synth('<div class="band"><p style="opacity: 0.25">Grosime</p></div>'),
  'hidden.html': synth('<p>Grosime</p><span style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; color: #FFFFFF">ascuns</span><div hidden><p style="color: #FFFFFF">ascuns</p></div>'),
  'decoration.html': synth('<p>Grosime</p><div style="position: relative"><p aria-hidden="true" style="margin: 0; font-size: 92px; font-weight: 800; color: #F65308; opacity: 0.1">01</p></div>'),
  'unreadable.html': synth('<p style="color: color(display-p3 0.1 0.1 0.1)">Grosime</p>'),
  'no-text.html': synth(''),
};

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain' };
function serve() {
  return new Promise((res) => {
    const s = http.createServer((rq, rs) => {
      const u = decodeURIComponent(rq.url.split('?')[0]);
      if (u.startsWith(SELFTEST)) {
        const page = SYNTH[u.slice(SELFTEST.length)];
        if (!page) { rs.writeHead(404); rs.end('not found'); return; }
        rs.writeHead(200, { 'content-type': TYPES['.html'] }); rs.end(page); return;
      }
      let f = path.join(DIST, u);
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

/* Reads every element that directly holds visible text. Visible is judged on the
   TEXT's own boxes, through a Range, so a display: contents parent still counts;
   an ancestor clipped to nothing (the .sr-only pattern) or at visibility other than
   visible hides it. Text resting at a cumulative opacity under 0.1 is counted as
   not shown rather than judged, and the count is printed. */
const PROBE = `(() => {
  document.querySelectorAll('[data-reveal]').forEach((n) => n.classList.add('is-revealed'));
  const parse = (s) => {
    const m = /^rgba?\\(([^)]+)\\)$/.exec(String(s).trim());
    if (!m) return null;
    const v = m[1].split(/[\\s,\\/]+/).filter(Boolean).map(Number);
    return v.length >= 3 && v.every((x) => !Number.isNaN(x)) ? [v[0], v[1], v[2], v.length > 3 ? v[3] : 1] : null;
  };
  const over = (top, a, under) => [0, 1, 2].map((i) => top[i] * a + under[i] * (1 - a));
  const backdrop = (el) => {
    const layers = []; let image = false;
    for (let n = el; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') image = true;
      const c = parse(cs.backgroundColor);
      if (!c) return { error: cs.backgroundColor };
      if (c[3] > 0) layers.push(c);
      if (c[3] >= 1) break;
    }
    let bg = [255, 255, 255];
    for (let i = layers.length - 1; i >= 0; i--) bg = over(layers[i], layers[i][3], bg);
    return { bg, image };
  };
  const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const lum = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const hidden = (el) => {
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.clip === 'rect(0px, 0px, 0px, 0px)' || cs.clipPath === 'inset(50%)') return true;
      if (cs.overflow !== 'visible') { const r = n.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return true; }
    }
    return false;
  };
  const who = (el) => {
    const cls = typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\\s+/).slice(0, 2).join('.') : '';
    const p = el.parentElement;
    const pc = p && typeof p.className === 'string' && p.className.trim() ? '.' + p.className.trim().split(/\\s+/)[0] : '';
    return (p ? p.tagName.toLowerCase() + pc + ' > ' : '') + el.tagName.toLowerCase() + cls;
  };
  const out = { rows: [], errors: [], image: 0, faint: 0, tableCells: 0, decorative: 0, decorativeMin: null };
  for (const el of document.body.querySelectorAll('*')) {
    if (el.closest('svg, script, style, noscript, template')) continue;
    const nodes = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim());
    if (!nodes.length) continue;
    const text = nodes.map((n) => n.textContent).join('').replace(/\\s+/g, ' ').trim();
    const cs = getComputedStyle(el);
    if (cs.visibility !== 'visible') continue;
    const boxed = nodes.some((n) => { const r = document.createRange(); r.selectNodeContents(n); return [...r.getClientRects()].some((b) => b.width > 0 && b.height > 0); });
    if (!boxed || hidden(el)) continue;
    let opacity = 1;
    for (let n = el; n; n = n.parentElement) opacity *= Number(getComputedStyle(n).opacity);
    if (opacity < 0.1) { out.faint++; continue; }
    const fg = parse(cs.webkitTextFillColor || cs.color);
    const bd = backdrop(el);
    if (!fg || bd.error) { out.errors.push('"' + text.slice(0, 40) + '" (' + who(el) + '): ' + (fg ? 'background ' + bd.error : 'text ' + (cs.webkitTextFillColor || cs.color))); continue; }
    if (bd.image) out.image++;
    const paint = over(fg, fg[3] * opacity, bd.bg);
    const a = lum(paint), b = lum(bd.bg);
    if (el.closest('[aria-hidden="true"]')) {
      const q = Math.round(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)) * 100) / 100;
      out.decorative++;
      if (out.decorativeMin === null || q < out.decorativeMin) out.decorativeMin = q;
      continue;
    }
    if (el.closest('th, td, caption')) out.tableCells++;
    const px = parseFloat(cs.fontSize), weight = Number(cs.fontWeight) || 400;
    out.rows.push({
      text: text.slice(0, 40), who: who(el),
      ratio: Math.round(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)) * 100) / 100,
      large: px >= ${LARGE_PX} || (weight >= 700 && px >= ${LARGE_BOLD_PX}),
      fg: paint.map(Math.round).join(','), bg: bd.bg.map(Math.round).join(','),
      hover: el.matches(':hover'),
    });
  }
  return out;
})()`;

/* AT REST MEANS NO TRANSITION RUNNING, and a sleep is not that. The site
   transitions `color` on some text, and reduced motion does not stop a colour
   transition, so a colour read while one runs is a colour on its way somewhere:
   the first version of this gate planted the table defect, read the th 60ms later
   still ink on their way to white, and passed the arm on some runs and not others.
   This waits for every FINITE animation on the page to finish. An infinite one
   (the marquee, which reduced motion stops anyway) never finishes and is not
   waited on. Returns how many are still running when the wait gives up. */
const SETTLE_MS = 3000;
const SETTLE = `(async () => {
  const finite = () => document.getAnimations().filter((a) => a.playState === 'running'
    && a.effect && a.effect.getComputedTiming().endTime !== Infinity);
  const t0 = performance.now();
  while (finite().length && performance.now() - t0 < ${SETTLE_MS}) {
    await Promise.race([Promise.all(finite().map((a) => a.finished.catch(() => 0))), new Promise((r) => setTimeout(r, 250))]);
  }
  return finite().length;
})()`;

/* Every problem carries an id, and the self-test asserts arms by it. */
function judge(where, r) {
  const problems = [];
  for (const e of r.errors) problems.push({ id: 'UNREADABLE', where, msg: `a colour that cannot be read: ${e}` });
  if (!r.rows.length && !r.errors.length) problems.push({ id: 'NO TEXT', where, msg: 'no visible text measured on the page' });
  for (const x of r.rows) {
    if (x.hover) { problems.push({ id: 'NOT AT REST', where, msg: `"${x.text}" (${x.who}) is under the pointer` }); continue; }
    const min = x.large ? MIN_LARGE : MIN_NORMAL;
    if (x.ratio < min) problems.push({ id: 'CONTRAST', where, msg: `"${x.text}" (${x.who}) ${x.ratio}:1 against ${min}:1${x.large ? ' (large text)' : ''}, text ${x.fg} on ${x.bg}` });
  }
  return problems;
}

async function main() {
  const chromeBin = findChrome();
  const server = await serve();
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'rc-text-contrast-'));
  const args = ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`,
    '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--force-device-scale-factor=1'];
  // A CI container user may not be allowed Chrome's sandbox; nothing is untrusted here.
  if (process.env.CI) args.push('--no-sandbox');
  const chrome = spawn(chromeBin, [...args, 'about:blank'], { stdio: 'ignore' });
  const stop = () => { try { chrome.kill(); } catch {} server.close(); };
  /* W25-03b's cleanup, as every browser gate here carries it: the profile is
     removed however the process ends, fail() included, Chrome killed first. */
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
  await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });

  const setWidth = ({ w, mobile }) => cdp.send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile });
  /* The OLD document is stamped before navigating and the wait is for a document
     without the stamp. Polling readyState alone reads the page being left, which is
     already complete: the first version planted an arm's CSS into that page, the
     navigation then replaced it, and the arm "fired nothing" on one run in two.
     Two arms load the same URL as the control before them, so the URL cannot tell
     the two documents apart and the stamp can. */
  let navs = 0;
  const measure = async (url, css, js) => {
    const stamp = `nav${++navs}`;
    await cdp.ev(`(window.__rcContrastNav = ${JSON.stringify(stamp)}, 1)`).catch(() => 0);
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${HTTP_PORT}${url}` });
    let ready = false;
    for (let i = 0; i < 100 && !ready; i++) {
      ready = await cdp.ev(`window.__rcContrastNav !== ${JSON.stringify(stamp)} && document.readyState === "complete"`).catch(() => false);
      if (!ready) await sleep(100);
    }
    if (!ready) { ws.close(); stop(); fail(`${url} never finished loading.`); }
    if (css) await cdp.ev(`(() => { const s = document.createElement('style'); s.textContent = ${JSON.stringify(css)}; document.head.appendChild(s); return 1; })()`);
    if (js) await cdp.ev(`(() => { ${js}; return 1; })()`);
    await cdp.ev(`(document.querySelectorAll('[data-reveal]').forEach((n) => n.classList.add('is-revealed')), 1)`);
    const moving = await cdp.ev(SETTLE);
    if (moving) { ws.close(); stop(); fail(`${url}: ${moving} finite animation(s) still running after ${SETTLE_MS}ms, so nothing on it is at rest.`); }
    return cdp.ev(PROBE);
  };

  /* --- self-test, before any real result -------------------------------------- */
  const CONTROLS = [
    { name: 'control: rocă vulcanică as shipped', url: '/servicii/roca-vulcanica/' },
    { name: 'control: synthetic, dark and light', url: `${SELFTEST}control.html` },
  ];
  const ARMS = [
    { name: 'REAL W24-07: the Compară table th inherit the dark band\'s white', url: '/servicii/roca-vulcanica/', css: '.spec { color: inherit; }', want: 'CONTRAST', names: 'Grosime' },
    { name: 'REAL W24-08: the copertine crumb\'s current page painted --ink on --bg-dark', url: '/servicii/copertine/', css: ".cop-hero .cop-hero__crumb [aria-current='page'] { color: var(--ink); }", want: 'CONTRAST', names: 'Copertine' },
    { name: 'normal text at 3.45:1', url: `${SELFTEST}normal-under.html`, want: 'CONTRAST', names: 'Grosime' },
    { name: 'GREEN: the same colour as large text, 24px and 19px bold', url: `${SELFTEST}large-at-same.html`, want: null },
    { name: 'white text on a translucent white layer over the dark band', url: `${SELFTEST}translucent.html`, want: 'CONTRAST', names: 'Grosime' },
    { name: 'white text at opacity 0.25 on the dark band', url: `${SELFTEST}opacity.html`, want: 'CONTRAST', names: 'Grosime' },
    { name: 'GREEN: white on white, visually hidden and under [hidden]', url: `${SELFTEST}hidden.html`, want: null },
    { name: 'GREEN: an aria-hidden ghost numeral at opacity 0.1, the acoperisuri offer cards\' shape', url: `${SELFTEST}decoration.html`, want: null },
    { name: 'the same numeral with aria-hidden removed', url: `${SELFTEST}decoration.html`, js: "document.querySelectorAll('[aria-hidden]').forEach((n) => n.removeAttribute('aria-hidden'))", want: 'CONTRAST', names: '01' },
    { name: 'a text colour outside sRGB notation', url: `${SELFTEST}unreadable.html`, want: 'UNREADABLE' },
    { name: 'a page with no text', url: `${SELFTEST}no-text.html`, want: 'NO TEXT' },
    { name: 'REAL, at the phone width: the Compară table th', url: '/ru/servicii/roca-vulcanica/', css: '.spec { color: inherit; }', want: 'CONTRAST', names: 'Характеристика', mobile: true },
  ];
  const readControls = async (when) => {
    await setWidth(WIDTHS[0]);
    for (const c of CONTROLS) {
      const p = judge(c.name, await measure(c.url));
      if (p.length) { ws.close(); stop(); fail(`self-test: ${c.name} is not clean ${when} the arms, so no arm can be read: ${p[0].id} ${p[0].msg}`); }
    }
  };
  console.log(`self-test: ${ARMS.length} arms, ${ARMS.filter((a) => a.want === null).length} of them GREEN, between ${CONTROLS.length} controls read before and after`);
  await readControls('before');
  for (const arm of ARMS) {
    await setWidth(arm.mobile ? WIDTHS[1] : WIDTHS[0]);
    const p = judge(arm.name, await measure(arm.url, arm.css, arm.js));
    const ids = [...new Set(p.map((x) => x.id))];
    if (arm.want === null) {
      if (p.length) { ws.close(); stop(); fail(`self-test arm "${arm.name}" must be ACCEPTED and was refused: ${p[0].id} ${p[0].msg}`); }
      console.log(`  accepted  ${arm.name}`);
      continue;
    }
    if (ids.length !== 1 || ids[0] !== arm.want) { ws.close(); stop(); fail(`self-test arm "${arm.name}" should fire ${arm.want} and only it; it fired ${ids.length ? ids.join(', ') : 'nothing'}.`); }
    if (arm.names && !p.some((x) => x.msg.includes(`"${arm.names}`))) { ws.close(); stop(); fail(`self-test arm "${arm.name}" fired ${arm.want} but not on "${arm.names}", which is the text it plants.`); }
    console.log(`  fired     ${arm.name}: ${p.length} x ${arm.want}`);
  }
  await readControls('after');
  console.log('self-test: every arm fired on its own message id, every GREEN arm was accepted, both controls clean before and after\n');

  /* --- the real matrix ---------------------------------------------------------- */
  const problems = [];
  let combos = 0, rowsRead = 0, image = 0, faint = 0, cells = 0, deco = 0, decoMin = null, lowest = null;
  for (const width of WIDTHS) {
    await setWidth(width);
    for (const url of PAGES) {
      const where = `${url} at ${width.w}px`;
      const r = await measure(url);
      const p = judge(where, r);
      problems.push(...p);
      if (p.some((x) => x.id === 'NO TEXT' || x.id === 'UNREADABLE')) continue;
      combos++; rowsRead += r.rows.length; image += r.image; faint += r.faint; cells += r.tableCells;
      deco += r.decorative;
      if (r.decorativeMin !== null && (decoMin === null || r.decorativeMin < decoMin)) decoMin = r.decorativeMin;
      for (const x of r.rows) {
        const margin = x.ratio / (x.large ? MIN_LARGE : MIN_NORMAL);
        if (!lowest || margin < lowest.margin) lowest = { margin, where, ...x };
      }
    }
  }
  ws.close(); stop();

  const expected = PAGES.length * WIDTHS.length;
  console.log(`combinations measured: ${combos} of ${expected}; text elements read: ${rowsRead}, of them in a table cell: ${cells}`);
  console.log(`measured against the colour beneath a background image (the one reading this gate cannot take): ${image}`);
  console.log(`resting at an opacity under 0.1, counted as not shown: ${faint}`);
  console.log(`decoration, under aria-hidden, WCAG's pure-decoration exception, not judged: ${deco}${decoMin === null ? '' : `, the faintest at ${decoMin}:1`}`);
  if (lowest) console.log(`closest to its threshold: "${lowest.text}" (${lowest.who}) ${lowest.ratio}:1${lowest.large ? ' large' : ''}, ${lowest.where}`);
  if (combos !== expected && !problems.length) problems.push({ id: 'PRESENCE', where: 'the matrix', msg: `measured ${combos} of ${expected} combinations` });
  if (problems.length) {
    const ids = [...new Set(problems.map((p) => p.id))];
    console.error(`\nTEXT CONTRAST GATE FAILED: ${problems.length} problem(s), ${ids.join(', ')}`);
    for (const id of ids) {
      const of = problems.filter((x) => x.id === id);
      console.error(`\n  ${id} (${of.length})`);
      for (const p of of.slice(0, 60)) console.error(`    ${p.where}: ${p.msg}`);
      if (of.length > 60) console.error(`    ... and ${of.length - 60} more`);
    }
    console.error('');
    process.exit(1);
  }
  console.log(`\n${combos} of ${expected} combinations: every visible text element at rest paints at ${MIN_NORMAL}:1 or better, ${MIN_LARGE}:1 for large text.`);
}

main().catch((e) => fail(e && e.stack ? e.stack : String(e)));
