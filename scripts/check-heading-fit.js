#!/usr/bin/env node
/* Heading fit gate, card W19-D1 (wave 20). Run by `quality` on every pull request.

   A heading set in uppercase Inter 800 at 32, 44 or 56px cannot wrap inside a
   word. Only Russian produces words long enough to matter, and two did: the RU
   privacy h1 ("КОНФИДЕНЦИАЛЬНОСТИ") pushed the page sideways on phones and stuck
   25px out of its column on desktop, and the RU tile page h1 stuck 14px out at
   360px. src/styles.css now lets h1, h2 and h3 hyphenate a word of 14 characters
   or more, and break any word that still cannot fit. This gate is what notices
   the next long word, in either locale, before it ships.

   For every page in dist/sitemap.xml plus both 404 pages, at 360px (phone,
   mobile emulation) and 1280px (desktop), with every reveal applied:
     1. the page does not scroll sideways;
     2. no visible h1, h2 or h3 is wider inside than its own box
        (scrollWidth > clientWidth + 1), which is what a word that cannot wrap
        does, and what an overflow check on the page alone misses: at 1280px
        the privacy h1 overflowed its column by 25px with the page not scrolling.
   360 and 1280 are where the two kinds of failure were measured; the W19-D1
   acceptance also ran 375, 390, 768 and 1920 and they add nothing here.

   IT NEVER PASSES ON NOTHING. It fails when the sitemap is missing or empty,
   when a page is missing from dist/, when a page shows no heading at all, when
   fewer combinations were measured than the matrix holds, and when the Inter
   webfont did not load: a width measured in a fallback font is not a
   measurement of this site. It prints the pages read and the combinations
   measured before any result.

   Zero dependencies: headless Chrome over the DevTools protocol with node's
   built-in WebSocket, and dist/ served from this process. The Chrome, server
   and protocol code is the header fit gate's, copied, as every script here is
   standalone.

   Usage:  node build.js && node scripts/check-heading-fit.js
   Chrome: CHROME_BIN if set, else the usual install paths; never a silent skip. */

const { spawn, execFileSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.resolve(process.argv[2] || path.join(ROOT, 'dist'));
const CDP_PORT = Number(process.env.HEAD_CDP_PORT || 9432);
const HTTP_PORT = Number(process.env.HEAD_HTTP_PORT || 8742);

const WIDTHS = [{ w: 360, mobile: true }, { w: 1280, mobile: false }];

const fail = (msg) => { console.error(`\nHEADING FIT GATE FAILED: ${msg}\n`); process.exit(1); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* --- presence of the inputs ------------------------------------------------ */
const smFile = path.join(DIST, 'sitemap.xml');
if (!fs.existsSync(smFile)) fail(`${smFile} is missing. Run node build.js first.`);
const PAGES = [...[...fs.readFileSync(smFile, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname), '/404.html', '/ru/404.html'];
if (PAGES.length <= 2) fail('dist/sitemap.xml lists no pages, so nothing would be measured.');
const distFile = (u) => path.join(DIST, u.endsWith('/') ? path.join(u, 'index.html') : u);
const missing = PAGES.filter((p) => !fs.existsSync(distFile(p)));
if (missing.length) fail(`${missing.length} page(s) not in dist/: ${missing.join(', ')}. Run node build.js first.`);
console.log(`pages read: ${PAGES.length} (${PAGES.length - 2} from dist/sitemap.xml, plus both 404 pages)`);
console.log(`widths: ${WIDTHS.map((x) => x.w + (x.mobile ? ' (mobile)' : '')).join(', ')}; combinations expected: ${PAGES.length * WIDTHS.length}\n`);

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

/* Visibility by the rendered box. Reveals are applied first, so a heading waiting
   for its entrance is measured where it will sit. */
const PROBE = `(() => {
  document.querySelectorAll('[data-reveal]').forEach((n) => n.classList.add('is-revealed'));
  const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden'; };
  const heads = [...document.querySelectorAll('h1, h2, h3')].filter(vis);
  const over = heads.filter((h) => h.scrollWidth > h.clientWidth + 1)
    .map((h) => h.tagName.toLowerCase() + ' +' + (h.scrollWidth - h.clientWidth) + 'px "' + h.textContent.trim().replace(/\\s+/g, ' ').slice(0, 48) + '"');
  const d = document.documentElement;
  return { heads: heads.length, over, hScroll: Math.max(0, d.scrollWidth - d.clientWidth) };
})()`;

async function main() {
  const chromeBin = findChrome();
  const server = await serve();
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'rc-heading-fit-'));
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

  const problems = [];
  let measured = 0, headsRead = 0;
  for (const { w, mobile } of WIDTHS) {
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile });
    for (const page of PAGES) {
      await cdp.send('Page.navigate', { url: `http://127.0.0.1:${HTTP_PORT}${page}` });
      for (let i = 0; i < 80; i++) { if (await cdp.ev('document.readyState === "complete"').catch(() => false)) break; await sleep(150); }
      const inter = await cdp.ev(FONTS).catch(() => 0);
      const where = `${page} at ${w}px`;
      if (!inter) { ws.close(); stop(); fail(`the Inter webfont did not load for ${where}, so nothing here would be a measurement of this site.`); }
      await sleep(150);
      const r = await cdp.ev(PROBE);
      if (r.heads === 0) { problems.push({ kind: 'PRESENCE', where, msg: 'no visible h1, h2 or h3 on the page' }); continue; }
      measured++; headsRead += r.heads;
      if (r.hScroll) problems.push({ kind: 'PAGE SCROLLS SIDEWAYS', where, msg: `by ${r.hScroll}px` });
      for (const o of r.over) problems.push({ kind: 'HEADING WIDER THAN ITS BOX', where, msg: o });
    }
  }
  ws.close(); stop();

  const expected = PAGES.length * WIDTHS.length;
  console.log(`combinations measured: ${measured} of ${expected}; visible headings read: ${headsRead}`);
  if (measured !== expected && !problems.length) problems.push({ kind: 'PRESENCE', where: 'the matrix', msg: `measured ${measured} of ${expected} combinations` });
  if (problems.length) {
    const kinds = [...new Set(problems.map((p) => p.kind))];
    console.error(`\nHEADING FIT GATE FAILED: ${problems.length} problem(s), ${kinds.join(', ')}`);
    for (const k of kinds) {
      console.error(`\n  ${k}`);
      for (const p of problems.filter((x) => x.kind === k)) console.error(`    ${p.where}: ${p.msg}`);
    }
    console.error('');
    process.exit(1);
  }
  console.log(`\n${measured} of ${expected} combinations: no page scrolls sideways, and no heading is wider than its box.`);
}

main().catch((e) => fail(e && e.stack ? e.stack : String(e)));
