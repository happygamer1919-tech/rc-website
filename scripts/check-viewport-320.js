#!/usr/bin/env node
/* The 320 gate, gate 35, card W28-28 (wave 28), owner ruling R-W28-13: "320px is the minimum
   supported viewport. Acceptance for every page: rendered in headless Chrome at 320 wide,
   document scrollWidth equals 320, both locales." Run by `quality` on every pull request.

   WHY A GATE AND NOT A ONE-OFF SWEEP. Gate 11 measures the header from 769px, gate 14 and the
   review crawl measure pages at 360 and 390, and nothing measured 320: the Russian home page
   scrolled 17px sideways there from the header pill for as long as anyone can date it (found by
   W28-FIX-01, Q-W28-04). A width no gate reads is a width that regresses silently.

   WHAT IT READS. Every .html file in dist/, found by walking the directory, not listed, so a new
   page is measured the day it is built. Meta-refresh redirect pages are counted and skipped: they
   replace themselves before anyone could scroll them. For each page, at 320 wide with mobile
   emulation, reveals applied and the Inter webfont loaded: document.documentElement.scrollWidth
   must equal 320. On a failure it names up to five of the elements that stick out furthest past
   the right edge (the box, or the content that spills out of it), which is where the fix goes.

   IT NEVER PASSES ON NOTHING. It fails on no dist/, zero pages read, either locale missing, Inter
   not loading on a page that asks for it (a width measured in a fallback font is not this site's
   width), every page lacking Inter, and fewer pages measured than it read. A page that never asks
   for Inter (the internal /review/ page) is measured in its own font and named on every run.

   ITS SELF-TEST RUNS FIRST, on a synthetic page this gate serves itself, so it does not depend on
   the site being clean: a control read clean, three RED arms (a fixed 400px box, a long word with
   no break opportunity, an image wider than the screen) that must each fire, and two GREEN arms
   that must be accepted (a wide table inside its own horizontal scroll box, a wide element clipped
   by an overflow-hidden parent), then the control read clean again (R-AB).

   Zero dependencies: headless Chrome over the DevTools protocol with node's built-in WebSocket,
   dist/ served from this process; the Chrome, server and protocol code is gate 14's, copied.
   Usage:  node build.js && node scripts/check-viewport-320.js
   Chrome: CHROME_BIN if set, else the usual install paths; never a silent skip. */
const { spawn, execFileSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.resolve(process.argv[2] || path.join(ROOT, 'dist'));
const CDP_PORT = Number(process.env.VP_CDP_PORT || 9456);
const HTTP_PORT = Number(process.env.VP_HTTP_PORT || 8766);
const WIDTH = 320;
const fail = (msg) => { console.error(`\n320 GATE FAILED: ${msg}\n`); process.exit(1); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* --- presence of the inputs ------------------------------------------------ */
if (!fs.existsSync(DIST)) fail(`${DIST} is missing. Run node build.js first.`);
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const files = walk(DIST).filter((f) => f.endsWith('.html'));
const toUrl = (f) => '/' + path.relative(DIST, f).split(path.sep).join('/').replace(/(^|\/)index\.html$/, '$1');
const redirects = [], PAGES = [], NO_WEBFONT = new Set();
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  if (/<meta[^>]+http-equiv=["']?refresh/i.test(html)) { redirects.push(toUrl(f)); continue; }
  PAGES.push(toUrl(f));
  /* A page that never asks for Inter (the internal /review/ page) is measured in the font it
     does ask for; the wait for Inter applies to the pages that load it. */
  if (!/family=Inter/.test(html)) NO_WEBFONT.add(toUrl(f));
}
PAGES.sort();
if (!PAGES.length) fail('dist/ holds no page to measure.');
const ru = PAGES.filter((p) => p.startsWith('/ru/')).length;
if (!ru || ru === PAGES.length) fail(`both locales must be measured; read ${PAGES.length - ru} Romanian and ${ru} Russian page(s).`);
console.log(`pages read: ${files.length} html files; measured: ${PAGES.length} (${PAGES.length - ru} RO, ${ru} RU); redirect pages skipped: ${redirects.length}`);
if (NO_WEBFONT.size) console.log(`pages that load no Inter webfont, measured in their own font: ${[...NO_WEBFONT].join(', ')}`);
if (NO_WEBFONT.size === PAGES.length) fail('no page loads the Inter webfont, so the site stylesheet is not what was built.');
console.log(`width: ${WIDTH} (mobile emulation); the rule: document.documentElement.scrollWidth equals ${WIDTH}\n`);

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

/* The self-test page. Plain HTML with the site's own viewport line; each arm adds its plant. */
const SELFTEST = (plant) => '<!doctype html><html lang="ro"><head><meta charset="utf-8">'
  + '<meta name="viewport" content="width=device-width, initial-scale=1">'
  + '<style>body{margin:0;font:16px sans-serif}p{margin:16px}</style></head><body>'
  + '<p>Pagina de control, un paragraf obisnuit care se rupe pe mai multe randuri la 320 de pixeli.</p>'
  + plant + '</body></html>';
const ARMS = [
  { arm: 'a fixed box 400px wide', plant: '<div style="width:400px;height:20px;background:#ccc"></div>', want: 'red' },
  { arm: 'a long word with no break opportunity', plant: '<p style="font-size:28px">Konfidentsialnostkonfidentsialnost</p>', want: 'red' },
  { arm: 'an image wider than the screen', plant: '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" width="480" height="10" alt="">', want: 'red' },
  { arm: 'GREEN: a wide table inside its own horizontal scroll box', plant: '<div style="overflow-x:auto"><table style="width:700px"><tr><td>a</td><td>b</td></tr></table></div>', want: 'green' },
  { arm: 'GREEN: a wide element clipped by an overflow-hidden parent', plant: '<div style="overflow:hidden"><div style="width:900px;height:10px;background:#ccc"></div></div>', want: 'green' },
];
let plant = '';

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain', '.woff2': 'font/woff2' };
function serve() {
  return new Promise((res) => {
    const s = http.createServer((rq, rs) => {
      const u = decodeURIComponent(rq.url.split('?')[0]);
      if (u === '/__viewport-320-selftest__') { rs.writeHead(200, { 'content-type': TYPES['.html'] }); rs.end(SELFTEST(plant)); return; }
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

/* Gate 14's font wait: at least one Inter face loaded and none still loading. */
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

/* The measurement, and the culprits: elements whose box ends past the right edge, widest first,
   leaves preferred (an element whose child sticks out further is named through the child). */
const PROBE = `(() => {
  document.querySelectorAll('[data-reveal]').forEach((n) => n.classList.add('is-revealed'));
  const d = document.documentElement;
  const vw = d.clientWidth;
  const out = [];
  if (d.scrollWidth > vw) {
    for (const el of document.body.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden') continue;
      /* The box, or what spills out of it: a word with no break opportunity overflows its own
         box as text, and the box alone ends inside the screen. */
      const spill = cs.overflowX === 'visible' ? r.left + el.scrollWidth : r.right;
      const right = Math.max(r.right, spill);
      if (right <= vw + 0.5) continue;
      /* Clipped inside an ancestor that scrolls or hides its own overflow and itself fits the
         screen (the supplier marquee): it cannot widen the page, so it is not a culprit. */
      let clipped = false;
      for (let a = el.parentElement; a && a !== d; a = a.parentElement) {
        const acs = getComputedStyle(a);
        if (acs.overflowX !== 'visible' && a.getBoundingClientRect().right <= vw + 0.5) { clipped = true; break; }
      }
      if (clipped) continue;
      const cls = typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\\s+/).slice(0, 2).join('.') : '';
      out.push({ el, what: el.tagName.toLowerCase() + cls, right: Math.round(right), text: (el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 40) });
    }
  }
  /* The deepest offenders only: a wrapper that stretched because a child is too wide is named
     through the child. */
  const leaves = out.filter((o) => !out.some((x) => x !== o && o.el.contains(x.el)));
  out.length = 0; for (const o of leaves) { delete o.el; out.push(o); }
  out.sort((a, b) => b.right - a.right);
  return { sw: d.scrollWidth, cw: vw, culprits: out.slice(0, 5) };
})()`;

async function measure(cdp, url, needInter) {
  await cdp.send('Page.navigate', { url });
  for (let i = 0; i < 80; i++) { if (await cdp.ev('document.readyState === "complete"').catch(() => false)) break; await sleep(150); }
  if (needInter) { const inter = await cdp.ev(FONTS).catch(() => 0); if (!inter) return { noInter: true }; }
  await sleep(150);
  return cdp.ev(PROBE);
}

async function main() {
  const chromeBin = findChrome();
  const server = await serve();
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'rc-viewport-320-'));
  const args = ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`,
    '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--force-device-scale-factor=1'];
  if (process.env.CI) args.push('--no-sandbox');
  const chrome = spawn(chromeBin, [...args, 'about:blank'], { stdio: 'ignore' });
  const stop = () => { try { chrome.kill(); } catch {} server.close(); };
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
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: WIDTH, height: 640, deviceScaleFactor: 1, mobile: true });

  /* --- self-test ------------------------------------------------------------- */
  const selfUrl = `http://127.0.0.1:${HTTP_PORT}/__viewport-320-selftest__`;
  const control = async (when) => { plant = ''; const r = await measure(cdp, selfUrl, false); if (r.sw !== WIDTH) { ws.close(); stop(); fail(`self-test control read ${r.sw}px ${when} the arms, not ${WIDTH}.`); } };
  await control('before');
  for (const a of ARMS) {
    plant = a.plant;
    const r = await measure(cdp, selfUrl, false);
    const red = r.sw !== WIDTH;
    if (a.want === 'red' && !red) { ws.close(); stop(); fail(`self-test arm "${a.arm}" was not caught: scrollWidth ${r.sw}.`); }
    if (a.want === 'red' && !r.culprits.length) { ws.close(); stop(); fail(`self-test arm "${a.arm}" was caught but no element was named.`); }
    if (a.want === 'green' && red) { ws.close(); stop(); fail(`self-test GREEN arm "${a.arm}" was refused: scrollWidth ${r.sw}.`); }
  }
  await control('after');
  console.log(`self-test: ${ARMS.length} arms, ${ARMS.filter((a) => a.want === 'green').length} GREEN, each as expected, control ${WIDTH} before and after\n`);

  /* --- the real run ---------------------------------------------------------- */
  const problems = [];
  let measured = 0;
  for (const page of PAGES) {
    const r = await measure(cdp, `http://127.0.0.1:${HTTP_PORT}${page}`, !NO_WEBFONT.has(page));
    if (r.noInter) { ws.close(); stop(); fail(`the Inter webfont did not load for ${page}, so nothing here would be a measurement of this site.`); }
    measured++;
    if (r.sw !== WIDTH) problems.push({ page, sw: r.sw, culprits: r.culprits });
  }
  ws.close(); stop();

  console.log(`pages measured: ${measured} of ${PAGES.length}`);
  if (measured !== PAGES.length) fail(`measured ${measured} of ${PAGES.length} pages.`);
  if (problems.length) {
    console.error(`\n320 GATE FAILED: ${problems.length} page(s) wider than ${WIDTH}`);
    for (const p of problems) {
      console.error(`  ${p.page}: scrollWidth ${p.sw} (+${p.sw - WIDTH}px)`);
      for (const c of p.culprits) console.error(`      ${c.what} ends at ${c.right}px${c.text ? ` "${c.text}"` : ''}`);
    }
    console.error('');
    process.exit(1);
  }
  console.log(`\n${measured} of ${PAGES.length} pages, both locales: document scrollWidth equals ${WIDTH} on every one.`);
}

main().catch((e) => fail(e && e.stack ? e.stack : String(e)));
