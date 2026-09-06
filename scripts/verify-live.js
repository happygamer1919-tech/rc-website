#!/usr/bin/env node
/* Live verification under ruling R-P (docs/CLAUDE.md section 12).

   A live measurement is valid ONLY when taken with a cache-buster AND with
   content markers asserted in the same pass. Height alone is never evidence: a
   stale edge copy returns a perfectly plausible number, and during wave 12 one
   did — a post-deploy reading returned the exact pre-deploy heights and was
   nearly reported as passing.
 
   So every request here carries a unique query string, and every page asserts
   markers that prove the build being measured is the one expected. A page whose
   markers do not match is reported UNVERIFIED and the run exits non-zero. It is
   never reported as passed.
 
   Zero dependencies, same as every other script here: it drives a headless
   Chrome over the DevTools protocol using node's built-in WebSocket.
 
   Usage:  node scripts/verify-live.js [origin]
           node scripts/verify-live.js https://rapidconstructmd.com
*/

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ORIGIN = (process.argv[2] || 'https://rapidconstructmd.com').replace(/\/$/, '');
const CHROME = process.env.CHROME_BIN
  || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = Number(process.env.CDP_PORT || 9401);
const WIDTH = 1440, HEIGHT = 900;

/* One buster for the whole run. Unique per invocation, so nothing can be served
   from an edge cache populated by a previous run either. */
const BUST = `rp${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
const bust = (p) => `${ORIGIN}${p}${p.includes('?') ? '&' : '?'}${BUST}=1`;

/* --- the marker sets, per page type -------------------------------------- */
/* R-P requires at least one marker per verification. These are the properties
   that would differ if a stale build were served, so a match is evidence the
   deployed build is the one under test. They are asserted in the SAME page load
   as the height, never in a separate request. */
const MARKERS = {
  home: {
    ratingPanel: 1,        // the R-N review panel is present
    portfolioTiles: 7,     // six project cards plus the W12-05 closing tile
    profileAnchors: 0,     // R-O: no visible anchor to the Google profile
    promoBar: 1,           // W12-02 static strip
    statTiles: 8,          // four in the hero, four in the dark band
    areaServed: 20,        // W12-09 coverage list
  },
  service: {
    promoBar: 1,
    profileAnchors: 0,
    areaServed: 20,
  },
  privacy: {
    profileAnchors: 0,
    promoBar: 1,
  },
};

const PAGES = [
  { path: '/',                             type: 'home',    label: 'homepage RO',    budget: 8851 },
  { path: '/ru/',                          type: 'home',    label: 'homepage RU',    budget: 9065 },
  { path: '/servicii/case-la-cheie/',      type: 'service', label: 'svc RO case',    budget: 6000 },
  { path: '/servicii/fatade/',             type: 'service', label: 'svc RO fatade',  budget: 6000 },
  { path: '/ru/servicii/case-la-cheie/',   type: 'service', label: 'svc RU case',    budget: 6000 },
  { path: '/ru/servicii/fatade/',          type: 'service', label: 'svc RU fatade',  budget: 6000 },
  { path: '/ru/servicii/acoperisuri/',     type: 'service', label: 'svc RU acoper',  budget: 6000 },
  { path: '/ru/servicii/finisaje/',        type: 'service', label: 'svc RU finis',   budget: 6000 },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
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

/* Read markers and the settled height in ONE evaluation, so they cannot come
   from different responses. The reveal settling is the documented recipe from
   RELEASE-NOTES: apply every [data-reveal], wait for the staggered transitions. */
const PROBE = `(async () => {
  const q = (s) => document.querySelectorAll(s).length;
  const ld = [...document.querySelectorAll('script[type="application/ld+json"]')]
    .map(s => { try { return JSON.parse(s.textContent); } catch { return null; } }).filter(Boolean);
  const biz = ld.find(d => d.sameAs) || null;
  const area = ld.find(d => d.areaServed) || null;
  const markers = {
    ratingPanel: q('.rating__score'),
    portfolioTiles: q('#portfolio-grid > *'),
    profileAnchors: q('a[href*="maps.google.com"]'),
    promoBar: q('.promo'),
    statTiles: q('.stat'),
    areaServed: area ? area.areaServed.length : 0,
  };
  const facts = {
    sameAsProfile: biz ? biz.sameAs.includes('https://maps.google.com/?cid=1981309119616115698') : null,
    ratingMarkup: /aggregateRating|ratingValue|reviewCount|"@type"\\s*:\\s*"Review"/.test(
      [...document.querySelectorAll('script[type="application/ld+json"]')].map(s=>s.textContent).join(' ')),
    todoVisible: (document.body.innerText.match(/TODO/gi) || []).length,
    robots: (document.querySelector('meta[name="robots"]') || {}).content || '',
    canonical: (document.querySelector('link[rel="canonical"]') || {}).href || '',
  };
  document.querySelectorAll('[data-reveal]').forEach(n => n.classList.add('is-revealed'));
  await new Promise(r => setTimeout(r, 1600));
  return { markers, facts, height: document.documentElement.scrollHeight, width: innerWidth };
})()`;

async function main() {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'rp-verify-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`, `--window-size=${WIDTH},${HEIGHT}`, '--no-first-run',
    '--no-default-browser-check', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--disk-cache-size=1', 'about:blank'], { stdio: 'ignore' });

  let up = null;
  for (let i = 0; i < 80 && !up; i++) { try { up = await rq(`http://127.0.0.1:${PORT}/json/version`); } catch { await sleep(250); } }
  if (!up) { chrome.kill(); throw new Error('chrome did not start'); }

  console.log(`R-P live verification of ${ORIGIN}`);
  console.log(`cache-buster for this run: ?${BUST}=1\n`);

  const target = await rq(`http://127.0.0.1:${PORT}/json/new?about:blank`, 'PUT');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  const cdp = new CDP(ws);
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: false });

  const load = async (url) => {
    await cdp.send('Page.navigate', { url });
    for (let i = 0; i < 80; i++) { if (await cdp.ev('document.readyState === "complete"').catch(() => false)) break; await sleep(200); }
    await cdp.ev('document.fonts ? document.fonts.ready.then(()=>1) : 1').catch(() => {});
    await sleep(400);
  };

  let failures = 0, unverified = 0;
  const seen = [];
  for (const page of PAGES) {
    await load(bust(page.path));
    const r = await cdp.ev(PROBE);
    const want = MARKERS[page.type];
    const bad = Object.entries(want).filter(([k, v]) => r.markers[k] !== v);
    const ok = bad.length === 0;
    if (!ok) unverified++;
    const within = r.height < page.budget;
    if (!within) failures++;
    seen.push({ page, r, ok, within });
    console.log(`${ok ? 'VERIFIED  ' : 'UNVERIFIED'} ${page.label.padEnd(16)} ${String(r.height).padStart(5)}px / ${page.budget}  ${within ? 'inside' : 'OVER'}`);
    if (!ok) bad.forEach(([k, v]) => console.log(`             marker mismatch: ${k} expected ${v}, got ${r.markers[k]}`));
    if (r.facts.ratingMarkup) { console.log('             RATING MARKUP PRESENT — R-K violated'); failures++; }
    if (page.type === 'home' && r.facts.sameAsProfile !== true) { console.log('             sameAs profile URL MISSING'); failures++; }
    if (r.facts.todoVisible) { console.log(`             ${r.facts.todoVisible} visible TODO`); failures++; }
  }

  /* Reachability crawl, also cache-busted: follow every visible anchor a
     visitor could click and read the rendered text of each destination. */
  console.log('\ncrawling for visitor-reachable TODO markers...');
  const seeds = ['/', '/ru/', '/servicii/acoperisuri/', '/ru/servicii/acoperisuri/', '/404.html'];
  const reach = new Set();
  for (const s of seeds) {
    await load(bust(s));
    const hrefs = await cdp.ev(`[...document.querySelectorAll('a[href]')]
      .filter(a => a.offsetParent !== null || getComputedStyle(a).position === 'fixed')
      .map(a => a.href).filter(h => h.startsWith('${ORIGIN}'))`);
    hrefs.forEach((h) => reach.add(h.split('#')[0].replace(ORIGIN, '')));
    seeds.includes(s) && reach.add(s);
  }
  let todoPages = 0, privacyLinks = 0;
  for (const p of reach) {
    if (/confidentialitate|konfidentsialnost/.test(p)) privacyLinks++;
    await load(bust(p));
    const n = await cdp.ev('(document.body.innerText.match(/TODO/gi)||[]).length');
    if (n) { todoPages++; console.log(`  TODO on ${p} (${n})`); failures++; }
  }
  console.log(`  ${reach.size} reachable URLs, ${todoPages} with a visible TODO, ${privacyLinks} privacy pages reachable by link`);

  ws.close(); chrome.kill();
  console.log(`\n${failures === 0 && unverified === 0 ? 'PASS' : 'FAIL'} — ${unverified} unverified, ${failures} failed`);
  process.exit(failures === 0 && unverified === 0 ? 0 : 1);
}
main().catch((e) => { console.error(e); process.exit(1); });
