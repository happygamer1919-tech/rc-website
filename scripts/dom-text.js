#!/usr/bin/env node
/* dom-text: the rendered text of built pages, from a real browser, for acceptance greps.
   Card W28-11 (wave 28). Zero dependency, same Chrome and CDP shape as the browser gates.

   WHY. Wave 28's acceptance lines read "headless Chrome rendered DOM of ... grep ... returns 0".
   A grep over dist/*.html reads markup, comments, JSON-LD and scripts as well as copy, and a
   grep over locales reads strings that never render. Neither is the DOM a visitor gets. This
   serves dist/ locally, opens each page in headless Chrome, waits for the stylesheet (the
   --brand token resolving, as verify-live does), applies the reveals, and prints
   document.body.innerText, which is what a visitor can read: hidden elements are excluded by
   the browser itself. Stdout carries only the text (so a pipe into grep is clean); counts and
   the pages read go to stderr, and it exits 1 on zero pages read (docs/CLAUDE.md section 13).

       node scripts/dom-text.js / /ru/ /servicii/garduri/      the named pages
       node scripts/dom-text.js --all                           every built page
       node scripts/dom-text.js --all --no-spec                 with every <table> removed first,
                                                                which is "outside product spec tables"
       node scripts/dom-text.js --count 'a.btn' / /ru/          prints "<path> <n>" per page instead

   Each page is printed as a line "## <path>" followed by its text. The path line carries no
   digit-plus-sign or percent, so the acceptance greps never count it. */

const fs = require('fs');
const path = require('path');
const os = require('os');
const http = require('http');
const { spawn, execFileSync } = require('child_process');
const WS = require('./lib/cdp-ws.js');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const err = (m) => process.stderr.write(m + '\n');
const fail = (m) => { err(`\nDOM-TEXT FAILED: ${m}\n`); process.exit(1); };

const argv = process.argv.slice(2);
const ALL = argv.includes('--all');
const NO_SPEC = argv.includes('--no-spec');
const countAt = argv.indexOf('--count');
const COUNT_SEL = countAt >= 0 ? argv[countAt + 1] : null;
const paths = argv.filter((a, i) => !a.startsWith('--') && !(countAt >= 0 && i === countAt + 1));

if (!fs.existsSync(DIST)) fail('no dist/, run: node build.js');
if (COUNT_SEL === undefined) fail('--count needs a selector');

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const urlOf = (f) => '/' + path.relative(DIST, f).split(path.sep).join('/').replace(/index\.html$/, '');
const PAGES = ALL ? walk(DIST).filter((f) => f.endsWith('.html')).sort().map(urlOf) : paths;
if (!PAGES.length) fail('no pages named: pass paths like / or /ru/servicii/garduri/, or --all');

function findChrome() {
  const runs = (bin) => { try { execFileSync(bin, ['--version'], { stdio: 'ignore', timeout: 30000 }); return true; } catch { return false; } };
  if (process.env.CHROME_BIN) { if (runs(process.env.CHROME_BIN)) return process.env.CHROME_BIN; fail(`CHROME_BIN "${process.env.CHROME_BIN}" does not run`); }
  for (const bin of ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', 'google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']) if (runs(bin)) return bin;
  fail('no Chrome found; set CHROME_BIN');
}
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json', '.txt': 'text/plain', '.xml': 'text/xml', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((rq, rs) => {
  let p = decodeURIComponent(rq.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(DIST, p);
  if (!f.startsWith(DIST) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.writeHead(404); rs.end(); return; }
  rs.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(rs);
});
const get = (u) => new Promise((res, rej) => http.get(u, (r) => { const c = []; r.on('data', (x) => c.push(x)); r.on('end', () => { try { res(JSON.parse(Buffer.concat(c).toString())); } catch (e) { rej(e); } }); }).on('error', rej));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const freePort = () => new Promise((res) => { const s = http.createServer(); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => res(p)); }); });

/* No backtick anywhere inside (W24-09a, gate 27). */
const PROBE = (noSpec, countSel) => `(async () => {
  const tokenSet = () => { const v = getComputedStyle(document.documentElement).getPropertyValue('--brand'); return !!(v && v.trim()); };
  for (let i = 0; i < 100 && !(document.readyState === 'complete' && tokenSet()); i++) await new Promise(r => setTimeout(r, 100));
  document.querySelectorAll('[data-reveal]').forEach(n => n.classList.add('is-revealed'));
  await new Promise(r => setTimeout(r, 300));
  if (${JSON.stringify(countSel)}) return { count: document.querySelectorAll(${JSON.stringify(countSel)}).length, ready: tokenSet() };
  let tables = 0;
  if (${noSpec ? 'true' : 'false'}) { document.querySelectorAll('table').forEach(t => { t.remove(); tables++; }); }
  return { text: document.body.innerText, tables, ready: tokenSet() };
})()`;

(async () => {
  const chromeBin = findChrome();
  const HTTP_PORT = await freePort(); const CDP_PORT = await freePort();
  await new Promise((r) => server.listen(HTTP_PORT, '127.0.0.1', r));
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'rc-dom-text-'));
  const args = ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--force-device-scale-factor=1', '--window-size=1440,900'];
  if (process.env.CI) args.push('--no-sandbox');
  const chrome = spawn(chromeBin, [...args, 'about:blank'], { stdio: 'ignore' });
  process.on('exit', () => { try { chrome.kill(); } catch {} try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} });
  let list = null;
  for (let i = 0; i < 80 && !list; i++) { try { list = await get(`http://127.0.0.1:${CDP_PORT}/json/list`); } catch { await sleep(250); } }
  if (!list) fail('Chrome did not start');
  const ws = new WS(list.find((x) => x.type === 'page').webSocketDebuggerUrl); await ws.ready;
  await ws.send('Page.enable', {}); await ws.send('Runtime.enable', {});
  await ws.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  let read = 0, notReady = 0, tablesRemoved = 0;
  for (const p of PAGES) {
    const file = path.join(DIST, p.endsWith('/') ? p + 'index.html' : p);
    if (!fs.existsSync(file)) fail(`no built page at ${p} (${path.relative(ROOT, file)})`);
    await ws.send('Page.navigate', { url: `http://127.0.0.1:${HTTP_PORT}${p}` });
    await sleep(150);
    const r = await ws.send('Runtime.evaluate', { expression: PROBE(NO_SPEC, COUNT_SEL), awaitPromise: true, returnByValue: true });
    const inner = r && r.result && (r.result.result || r.result);
    const v = inner && inner.value;
    if (!v) fail(`no result from ${p}: ${JSON.stringify(r).slice(0, 300)}`);
    if (!v.ready) notReady++;
    read++;
    if (COUNT_SEL) { process.stdout.write(`${p} ${v.count}\n`); continue; }
    tablesRemoved += v.tables;
    process.stdout.write(`## ${p}\n${v.text}\n\n`);
  }
  err(`pages read: ${read}${NO_SPEC ? `, tables removed: ${tablesRemoved}` : ''}${COUNT_SEL ? `, selector: ${COUNT_SEL}` : ''}${notReady ? `, NOT READY: ${notReady}` : ''}`);
  try { ws.sock.destroy(); } catch {}
  server.close(); chrome.kill();
  if (read === 0) fail('zero pages read');
  process.exit(notReady ? 1 : 0);
})().catch((e) => fail(e && e.stack || String(e)));
