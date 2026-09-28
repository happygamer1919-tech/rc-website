/* W29-02. The headless Chrome harness the wave 29 browser tests share: find Chrome (CHROME_BIN,
   else the usual install paths, never a silent skip), serve dist/ from this process, start Chrome
   with a throwaway profile, open one page target, and talk to it over node's built-in WebSocket.
   The Chrome, server and protocol code is gate 35's (scripts/check-viewport-320.js), lifted into
   one place so the new tests do not each carry a fourth copy. Zero dependencies.

   A test calls `open({ tag, cdpPort, httpPort, routes })` and gets `{ cdp, base, close }`.
   `routes` maps a path to an HTML string the server answers with, which is how a test serves the
   synthetic pages of its self-test. `cdp.ev(expr)` evaluates in the page and returns the value;
   `cdp.goto(url)` navigates and waits for load; `cdp.on(event, fn)` listens. */
const { spawn, execFileSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain', '.woff2': 'font/woff2' };

function findChrome(fail) {
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

function serve(dist, port, routes) {
  return new Promise((res, rej) => {
    const s = http.createServer((rq, rs) => {
      const u = decodeURIComponent(rq.url.split('?')[0]);
      if (routes && Object.prototype.hasOwnProperty.call(routes, u)) {
        const body = typeof routes[u] === 'function' ? routes[u]() : routes[u];
        rs.writeHead(200, { 'content-type': TYPES['.html'] }); rs.end(body); return;
      }
      let f = path.join(dist, u);
      if (f.endsWith('/')) f = path.join(f, 'index.html');
      if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) {
        if (fs.existsSync(path.join(f, 'index.html'))) f = path.join(f, 'index.html');
        else { rs.writeHead(404); rs.end('not found'); return; }
      }
      rs.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(rs);
    });
    s.on('error', rej);
    s.listen(port, '127.0.0.1', () => res(s));
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
    this.ws = ws; this.id = 0; this.p = new Map(); this.listeners = new Map();
    ws.addEventListener('message', (e) => {
      const m = JSON.parse(e.data);
      if (m.id && this.p.has(m.id)) {
        const { resolve, reject } = this.p.get(m.id); this.p.delete(m.id);
        m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result);
      } else if (m.method && this.listeners.has(m.method)) {
        for (const fn of this.listeners.get(m.method)) fn(m.params);
      }
    });
  }
  on(method, fn) { if (!this.listeners.has(method)) this.listeners.set(method, []); this.listeners.get(method).push(fn); }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => { this.p.set(id, { resolve, reject }); this.ws.send(JSON.stringify({ id, method, params })); });
  }
  async ev(expression) {
    const r = await this.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
    return r.result.value;
  }
  async goto(url) {
    await this.send('Page.navigate', { url });
    await this.settle();
  }
  async settle() {
    for (let i = 0; i < 100; i++) { if (await this.ev('document.readyState === "complete"').catch(() => false)) return true; await sleep(150); }
    return false;
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

async function open({ tag, dist, cdpPort, httpPort, routes, fail }) {
  const chromeBin = findChrome(fail);
  const server = await serve(dist, httpPort, routes);
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), `rc-${tag}-`));
  const args = ['--headless=new', `--remote-debugging-port=${cdpPort}`, `--user-data-dir=${profile}`,
    '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--force-device-scale-factor=1'];
  if (process.env.CI) args.push('--no-sandbox');
  const chrome = spawn(chromeBin, [...args, 'about:blank'], { stdio: 'ignore' });
  let ws = null;
  const close = () => { try { ws && ws.close(); } catch {} try { chrome.kill(); } catch {} server.close(); };
  process.on('exit', () => {
    try { chrome.kill(); } catch {}
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
  });
  let up = null;
  for (let i = 0; i < 80 && !up; i++) { try { up = await rq(`http://127.0.0.1:${cdpPort}/json/version`); } catch { await sleep(250); } }
  if (!up) { close(); fail(`Chrome (${chromeBin}) did not start.`); }
  const target = await rq(`http://127.0.0.1:${cdpPort}/json/new?about:blank`, 'PUT');
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  const cdp = new CDP(ws);
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
  return { cdp, base: `http://127.0.0.1:${httpPort}`, close, browser: up.Browser };
}

/* A real pointer click at page coordinates: move, press, release, as a person's mouse does. */
async function click(cdp, x, y) {
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
  await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
}

module.exports = { open, click, sleep, FONTS, TYPES };
