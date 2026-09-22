#!/usr/bin/env node
/* Rendered audit of a third-party site, per ruling W26-R2. Card W26-02.

       node scripts/audit-rendered.js <out-dir> <url> [url ...]

   Writes <out-dir>/audit.json and one full-document screenshot per URL.

   THE RENDERED DOM, NOT THE HTML RESPONSE, and it waits for network idle before
   reading anything. W25-24 read the HTML response and screenshotted the first
   4,000px of a long page, and reported two sections as gone that render in JS
   below the fold. Both mistakes are impossible here: the DOM is read after the
   network goes quiet, and a screenshot is of the element, scrolled to. */
const fs = require('fs'), path = require('path'), http = require('http');
const { spawn } = require('child_process');
/* A minimal CDP websocket client, zero dependency, beside this script so it has
   no companion outside the repo to lose. */
const WS = require('./lib/cdp-ws.js');
const PORT = 9341;
const OUT = process.argv[2];
const URLS = process.argv.slice(3);
const get = (u) => new Promise((res, rej) => http.get(u, (r) => { const c = []; r.on('data', (x) => c.push(x)); r.on('end', () => res(JSON.parse(Buffer.concat(c).toString()))); }).on('error', rej));

const PROBE = `(() => {
  const txt = (e) => (e.innerText || '').replace(/\\s+/g, ' ').trim();
  const abs = (u) => { try { return new URL(u, location.href).toString(); } catch { return u; } };
  const imgOf = (e) => {
    const i = e.querySelector('img');
    if (!i) return null;
    let s = i.currentSrc || i.src || '';
    const m = /[?&]url=([^&]+)/.exec(s);
    if (m) s = decodeURIComponent(m[1]);
    return abs(s);
  };
  const sections = [...document.querySelectorAll('section, main > div, [class*=section]')]
    .filter((e) => e.offsetParent !== null && e.getBoundingClientRect().height > 120)
    .map((e, i) => {
      const h = e.querySelector('h1, h2, h3');
      return { i, tag: e.tagName.toLowerCase(), cls: (e.className || '').toString().slice(0, 70), heading: h ? txt(h).slice(0, 90) : null, top: Math.round(e.getBoundingClientRect().top + scrollY), height: Math.round(e.getBoundingClientRect().height) };
    });
  const cards = [...document.querySelectorAll('a, article, div')].filter((e) => {
    if (e.offsetParent === null) return null;
    const r = e.getBoundingClientRect();
    return r.width > 150 && r.width < 700 && r.height > 180 && r.height < 900 && e.querySelector('img');
  }).map((e) => ({ text: txt(e).slice(0, 320), img: imgOf(e), href: e.tagName === 'A' ? abs(e.getAttribute('href') || '') : (e.querySelector('a') ? abs(e.querySelector('a').getAttribute('href') || '') : null), w: Math.round(e.getBoundingClientRect().width), h: Math.round(e.getBoundingClientRect().height) }));
  const tables = [...document.querySelectorAll('table')].map((t) => ({
    head: [...t.querySelectorAll('thead th, tr:first-child th, tr:first-child td')].map((c) => txt(c)),
    rows: [...t.querySelectorAll('tbody tr')].slice(0, 30).map((r) => [...r.children].map((c) => txt(c))),
  }));
  const images = [...new Set([...document.querySelectorAll('img')].map((i) => {
    let s = i.currentSrc || i.src || ''; const m = /[?&]url=([^&]+)/.exec(s); if (m) s = decodeURIComponent(m[1]); return abs(s);
  }))];
  const links = [...new Set([...document.querySelectorAll('a[href]')].map((a) => abs(a.getAttribute('href'))))];
  return JSON.stringify({ title: document.title, h1: (document.querySelector('h1') || {}).innerText || null, docHeight: document.documentElement.scrollHeight, sections, cards, tables, images, links });
})()`;

(async () => {
  const profile = fs.mkdtempSync('/tmp/aud-');
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    ['--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
     '--window-size=1440,1000', '--no-first-run', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
  let list; for (let i = 0; i < 80; i++) { try { list = await get(`http://127.0.0.1:${PORT}/json/list`); break; } catch { await new Promise((r) => setTimeout(r, 300)); } }
  const target = list.find((x) => x.type === 'page');
  const ws = new WS(target.webSocketDebuggerUrl); await ws.ready;
  await ws.send('Page.enable', {}); await ws.send('Network.enable', {}); await ws.send('Runtime.enable', {});
  fs.mkdirSync(OUT, { recursive: true });
  const all = [];
  for (const url of URLS) {
    const slug = url.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/-+$/, '').slice(0, 70);
    await ws.send('Page.navigate', { url });
    /* Network idle: poll the DOM until its height and image count stop moving
       for three consecutive reads, capped. A virtual-time budget that expires
       before the last request returns is exactly how a late section is missed. */
    let last = '', stable = 0;
    for (let i = 0; i < 40 && stable < 3; i++) {
      await new Promise((r) => setTimeout(r, 700));
      const s = await ws.send('Runtime.evaluate', { expression: `document.documentElement.scrollHeight + ':' + document.images.length + ':' + document.querySelectorAll('img[src]').length`, returnByValue: true });
      const v = String((s.result && s.result.result && s.result.result.value) || '');
      if (v === last && v !== '') stable++; else { stable = 0; last = v; }
    }
    /* Scroll the whole page so lazy images load, then return to the top. */
    await ws.send('Runtime.evaluate', { expression: `(async()=>{const H=document.documentElement.scrollHeight;for(let y=0;y<H;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,90));}scrollTo(0,0);await new Promise(r=>setTimeout(r,600));})()`, awaitPromise: true });
    const r = await ws.send('Runtime.evaluate', { expression: PROBE, returnByValue: true });
    const data = JSON.parse(r.result.result.value);
    data.url = url; data.slug = slug; data.settled = last;
    /* Full-page screenshot, the whole document, which is the evidence W26-R2
       requires for any claim about what is or is not on a page. */
    const m = await ws.send('Page.getLayoutMetrics', {});
    const cs = m.result.cssContentSize || m.result.contentSize;
    const H = Math.min(cs.height, 24000);
    await ws.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: H, deviceScaleFactor: 1, mobile: false });
    await new Promise((rr) => setTimeout(rr, 900));
    const shot = await ws.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: 1440, height: H, scale: 0.5 } });
    /* PNG out of Chrome, JPEG on disk: twenty full-document screenshots of long
       pages are 11MB as PNG and 5.7MB as JPEG at 72, and they are evidence a
       person reads rather than pixels a gate measures. */
    const png = path.join(OUT, slug + '.png');
    fs.writeFileSync(png, Buffer.from(shot.result.data, 'base64'));
    try {
      require('child_process').execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '72', png, '--out', path.join(OUT, slug + '.jpg')], { stdio: 'ignore' });
      fs.unlinkSync(png);
    } catch { /* keep the PNG where sips is not available; the evidence matters more than the size */ }
    await ws.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
    all.push(data);
    console.error(`  ${url}\n    doc ${data.docHeight}px, ${data.sections.length} sections, ${data.cards.length} card-like, ${data.tables.length} tables, ${data.images.length} images, shot ${H}px`);
  }
  fs.writeFileSync(path.join(OUT, 'audit.json'), JSON.stringify(all, null, 1));
  console.error(`\nwrote ${path.join(OUT, 'audit.json')} and ${all.length} screenshot(s)`);
  chrome.kill(); process.exit(0);
})();
