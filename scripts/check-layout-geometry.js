#!/usr/bin/env node
/* Layout geometry gate 20, card W24-09 (wave 24). Run by `quality` on every pull
   request.

   WHY THIS EXISTS. W24-07 shipped the acoperisuri bento with its tiles named
   `.bento__tile`. The garduri page had carried a `.bento` and a `.bento__tile`
   since wave 16 for its chooser tiles. Both declarations are (0,1,0) and the
   wave 16 one is later in the file, so it won. Measured on the built page before
   W24-07a renamed the hub to `.hub__*`: the section became a three-column grid,
   the tiles rendered white on a 10px radius with 24px of padding instead of
   #141414 on 24px, and the tall tile came out 128px wide against an intended 380.

   THE BENTO WAS VISIBLY BROKEN AND EVERY GATE WAS GREEN. Nineteen gates, and not
   one of them reads a layout: they read markup, links, contrast, headings,
   metadata, counts and scores. A collision between two class names is invisible
   to all of them, because the markup is exactly what the template says and only
   the painted result is wrong.

   W24-09's live run found the same blind spot from the other side. `verify-live`
   asserts `bentoTiles: 4` and its probe still read `.bento__tile` after the
   rename, so from W24-07 onwards it counted the garduri chooser and never the
   hub. Six rows came back UNVERIFIED on the first run after #78 to #85 merged,
   none of them a defect on the page and all six a defect in the marker.

   So this gate reads COMPUTED GEOMETRY in a real browser, which is the only
   thing that would have caught either. Class names it takes no view on; it
   measures boxes.

   WHAT IT ASSERTS, at 1440 and at 390, both locales, every page that carries the
   thing being measured, found in dist/ rather than listed:

     the bento hubs (acoperisuri, garduri)
       1. four tiles are visible;
       2. at 1440 the tall tile spans two grid rows, which is read as its height
          against the other tiles' and not from the CSS;
       3. at 1440 the tall tile is between 30 and 38 percent of the grid's width;
       4. at 1440 the wide tile is wider than each of the two bottom tiles;
       5. at 1440 no tile is under 280px wide;
       6. at 390 the hub is one column: every tile shares a left edge.

     the catalogue product grids
       7. four columns at 1440, one at 390, read from the distinct left edges of
          the cards actually painted;
       8. at 390 the grid paints exactly the number of cards the page's own
          `data-prod-step` states, and the reveal button is shown; at 1440 every
          card is painted and the button is not.

   IT NEVER PASSES ON NOTHING. It fails when no page carries a hub, when no page
   carries a product grid, when either locale carries neither, when a page is
   measured at fewer widths than the matrix holds, and when the Inter webfont did
   not load: a geometry measured in a fallback font is not a measurement of this
   site.

   ITS NEGATIVE TEST IS THE WAVE 16 COLLISION ITSELF. Before any real result it
   re-injects the exact declarations that collided, as a stylesheet appended to
   the acoperisuri page, and requires this gate to fail on it. The control is the
   same page unpatched, read clean immediately before and immediately after
   (R-AB). An assertion nobody has watched fail is not a gate, and this one has
   now been watched fail on the defect it was written for.

   Zero dependencies: headless Chrome over the DevTools protocol with node's
   built-in WebSocket, and dist/ served from this process. The Chrome, server and
   protocol code is the header fit gate's, copied, as every script here is
   standalone.

   Usage:  node build.js && node scripts/check-layout-geometry.js
   Chrome: CHROME_BIN if set, else the usual install paths; never a silent skip. */

const { spawn, execFileSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.resolve(process.argv[2] || path.join(ROOT, 'dist'));
const CDP_PORT = Number(process.env.GEO_CDP_PORT || 9436);
const HTTP_PORT = Number(process.env.GEO_HTTP_PORT || 8746);

/* 1440 is where the bento's proportions are specified and where the catalogue
   grid is four columns. 390 is the phone the reveal is specified at. */
const WIDTHS = [{ w: 1440, mobile: false }, { w: 390, mobile: true }];

/* The tall tile's share of the grid width. The hub is three equal columns with a
   16px gap, so one column of 1440 minus the container gutters is a shade under a
   third; the band is the owner's, from the dispatch, and is deliberately wider
   than the nominal so a gutter change does not fail a correct layout. */
const TALL_MIN_PCT = 30, TALL_MAX_PCT = 38;
const MIN_TILE_PX = 280;

const fail = (msg) => { console.error(`\nLAYOUT GEOMETRY GATE FAILED: ${msg}\n`); process.exit(1); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* --- the pages, found in dist/ rather than listed --------------------------- */
/* A listed page is a page that can silently stop carrying the thing it was
   listed for. These are discovered from the built tree, so a hub that stops
   rendering shows up as a count that fell rather than as a row that passed. */
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name === 'index.html') out.push(p);
  }
  return out;
}
if (!fs.existsSync(DIST)) fail(`${DIST} is missing. Run node build.js first.`);
const ALL = walk(DIST);
if (!ALL.length) fail(`no built pages under ${DIST}. Run node build.js first.`);
const urlOf = (f) => '/' + path.relative(DIST, f).replace(/index\.html$/, '').split(path.sep).join('/');
const readsAs = (f, re) => re.test(fs.readFileSync(f, 'utf8'));

const HUB_PAGES = ALL.filter((f) => readsAs(f, /class="hub__grid"/)).map(urlOf).sort();
const GRID_PAGES = ALL.filter((f) => readsAs(f, /data-prod-grid/)).map(urlOf).sort();

const ru = (u) => u.startsWith('/ru/');
if (!HUB_PAGES.length) fail('no built page carries a .hub__grid, so the bento assertions would hold vacuously.');
if (!GRID_PAGES.length) fail('no built page carries a catalogue product grid, so the grid assertions would hold vacuously.');
if (!HUB_PAGES.some(ru) || !HUB_PAGES.some((u) => !ru(u))) fail(`the hub pages are one locale only: ${HUB_PAGES.join(', ')}`);
if (!GRID_PAGES.some(ru) || !GRID_PAGES.some((u) => !ru(u))) fail('the catalogue grid pages are one locale only.');

console.log(`pages read: ${ALL.length} under ${path.relative(ROOT, DIST)}`);
console.log(`bento hubs: ${HUB_PAGES.length} (${HUB_PAGES.join(', ')})`);
console.log(`catalogue grids: ${GRID_PAGES.length}`);
console.log(`widths: ${WIDTHS.map((x) => x.w + (x.mobile ? ' (mobile)' : '')).join(', ')}`);
const EXPECTED = (HUB_PAGES.length + GRID_PAGES.length) * WIDTHS.length;
console.log(`combinations expected: ${EXPECTED}\n`);

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

/* The negative test needs one page served with an extra stylesheet appended and
   everything else byte-identical. `patch` is set by the self-test and cleared
   after it; when it is null the server is an ordinary static server. */
let patch = null;   // { url, css }
function serve() {
  return new Promise((res) => {
    const s = http.createServer((rq, rs) => {
      const url = decodeURIComponent(rq.url.split('?')[0]);
      let f = path.join(DIST, url);
      if (f.endsWith('/')) f = path.join(f, 'index.html');
      if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) {
        if (fs.existsSync(path.join(f, 'index.html'))) f = path.join(f, 'index.html');
        else { rs.writeHead(404); rs.end('not found'); return; }
      }
      if (patch && url === patch.url) {
        const html = fs.readFileSync(f, 'utf8').replace('</head>', `<style>${patch.css}</style></head>`);
        rs.writeHead(200, { 'content-type': TYPES['.html'] });
        rs.end(html);
        return;
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

/* Same Inter wait as gates 11, 14 and 18: a width measured in a fallback font is
   not a measurement of this site, and readyState "complete" can precede the font
   starting to load at all. */
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

/* The probe returns MEASUREMENTS ONLY. Every judgement is made in node, so a
   failure names the number that was read and the band it missed, and so the
   self-test judges patched and unpatched pages through the same code path. */
const PROBE = `(async () => {
  document.querySelectorAll('[data-reveal]').forEach((n) => n.classList.add('is-revealed'));
  await new Promise((r) => setTimeout(r, 900));
  const box = (el) => { const r = el.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) }; };
  const painted = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'; };

  const out = { hub: null, grid: null };

  const hub = document.querySelector('.hub__grid');
  if (hub) {
    const tiles = [...hub.children].filter(painted);
    out.hub = { grid: box(hub), tiles: tiles.map(box), total: hub.children.length };
  }

  const grid = document.querySelector('[data-prod-grid]');
  if (grid) {
    const all = [...grid.querySelectorAll('[data-product-card]')];
    const vis = all.filter(painted);
    const wrap = document.querySelector('[data-prod-more]');
    out.grid = {
      total: all.length,
      visible: vis.length,
      step: parseInt(grid.getAttribute('data-prod-step'), 10),
      /* TRACKS, not painted cards. The column count of a grid is a property of
         the grid, and a category with three products in a four-track grid paints
         three lefts: counting lefts would fail six correct pages, which is what
         the first draft of this gate did. getComputedStyle resolves
         grid-template-columns to the used track sizes, so the track count is
         what it has in it.

         The painted lefts are read too, and judged as min(tracks, cards): that
         is the cross-check that the tracks are actually being filled, which a
         track count alone would not notice if every card landed in column one. */
      tracks: getComputedStyle(grid).gridTemplateColumns.split(/\\s+/).filter(Boolean).length,
      lefts: (() => {
        if (!vis.length) return 0;
        const top = Math.min(...vis.map((c) => Math.round(c.getBoundingClientRect().top)));
        return new Set(vis.filter((c) => Math.round(c.getBoundingClientRect().top) === top)
          .map((c) => Math.round(c.getBoundingClientRect().left))).size;
      })(),
      moreShown: !!(wrap && !wrap.hidden && getComputedStyle(wrap).display !== 'none'),
      moreExists: !!wrap,
    };
  }
  return out;
})()`;

/* --- the judgements, in node ------------------------------------------------ */
/* Each returns problems as { id, text }. The id is what the self-test asserts on,
   so an arm proves it fired on ITS OWN message rather than on any red at all:
   that is the wave 16 lesson recorded in R-AB, where four arms went red on a
   control that was already red for an unrelated reason. */
function judgeHub(r, where, w) {
  const p = [];
  if (!r) { p.push({ id: 'hub-missing', text: `${where}: no .hub__grid on a page whose markup carries one` }); return p; }
  const t = r.tiles;
  if (t.length !== 4) { p.push({ id: 'hub-tiles', text: `${where}: ${t.length} visible tile(s) of ${r.total}, expected 4` }); return p; }

  if (w >= 1024) {
    const byArea = [...t];
    const tall = byArea.reduce((a, b) => (b.h > a.h ? b : a));
    const shortest = Math.min(...t.map((x) => x.h));
    // "Spans two rows" read from the box: the tall tile is about twice a one-row
    // tile plus the 16px gap. Judged as "at least 1.5x the shortest" so a row
    // height change cannot fail a layout that is still two rows tall.
    if (!(tall.h >= shortest * 1.5)) {
      p.push({ id: 'hub-span', text: `${where}: the tall tile is ${tall.h}px against a shortest tile of ${shortest}px, so it does not span two rows` });
    }
    const pct = (tall.w / r.grid.w) * 100;
    if (pct < TALL_MIN_PCT || pct > TALL_MAX_PCT) {
      p.push({ id: 'hub-tall-pct', text: `${where}: the tall tile is ${tall.w}px of a ${r.grid.w}px grid, ${pct.toFixed(1)}%, outside ${TALL_MIN_PCT}-${TALL_MAX_PCT}%` });
    }
    // The wide tile is the widest of the three that are not the tall one; the
    // bottom two are the rest. Identified by geometry, never by class name.
    const rest = t.filter((x) => x !== tall);
    const wide = rest.reduce((a, b) => (b.w > a.w ? b : a));
    const bottom = rest.filter((x) => x !== wide);
    for (const b of bottom) {
      if (!(wide.w > b.w)) p.push({ id: 'hub-wide', text: `${where}: the wide tile is ${wide.w}px and a bottom tile is ${b.w}px, so it is not wider` });
    }
    const narrow = t.filter((x) => x.w < MIN_TILE_PX);
    for (const n of narrow) p.push({ id: 'hub-narrow', text: `${where}: a tile is ${n.w}px wide, under the ${MIN_TILE_PX}px floor` });
  } else {
    const lefts = new Set(t.map((x) => x.x));
    if (lefts.size !== 1) p.push({ id: 'hub-cols', text: `${where}: ${lefts.size} columns, expected 1 on a phone` });
  }
  return p;
}

function judgeGrid(r, where, w) {
  const p = [];
  if (!r) { p.push({ id: 'grid-missing', text: `${where}: no catalogue grid on a page whose markup carries one` }); return p; }
  if (!r.total) { p.push({ id: 'grid-empty', text: `${where}: the grid holds no product cards` }); return p; }
  if (!r.step || r.step < 1) { p.push({ id: 'grid-step', text: `${where}: data-prod-step reads "${r.step}", which is not a count` }); return p; }

  const wantCols = w >= 1024 ? 4 : 1;
  if (r.tracks !== wantCols) p.push({ id: 'grid-cols', text: `${where}: the grid has ${r.tracks} column track(s), expected ${wantCols}` });
  const wantLefts = Math.min(wantCols, r.visible);
  if (r.lefts !== wantLefts) p.push({ id: 'grid-fill', text: `${where}: the first row paints ${r.lefts} card(s) across, expected ${wantLefts} in a ${r.tracks}-track grid showing ${r.visible}` });

  if (w >= 1024) {
    if (r.visible !== r.total) p.push({ id: 'grid-desktop-fold', text: `${where}: ${r.visible} of ${r.total} cards painted; desktop folds nothing` });
    if (r.moreShown) p.push({ id: 'grid-desktop-button', text: `${where}: the reveal button is shown on desktop` });
  } else {
    const want = Math.min(r.step, r.total);
    if (r.visible !== want) p.push({ id: 'grid-phone-fold', text: `${where}: ${r.visible} of ${r.total} cards painted, expected ${want} (data-prod-step ${r.step})` });
    const shouldShow = r.total > r.step;
    if (shouldShow && !r.moreShown) p.push({ id: 'grid-phone-button', text: `${where}: ${r.total} cards fold to ${r.step} and no reveal button is shown` });
    if (!shouldShow && r.moreShown) p.push({ id: 'grid-phone-button', text: `${where}: ${r.total} cards need no reveal button and one is shown` });
  }
  return p;
}

/* --- the self-test arms ----------------------------------------------------- */
/* Arm 1 is the wave 16 collision itself. These are the chooser's declarations,
   verbatim from src/styles.css lines 1619 to 1621, re-aimed at the hub the way
   the collision aimed them: before W24-07a `.bento__tile` named the hub's four
   tiles AND the garduri chooser's five, so the chooser's grid and tile rules,
   being later in the file at equal specificity, landed on the hub. Appended to
   the page, so they win on order exactly as they did then.

   What it does to the geometry, which is what this gate reads: `grid-auto-rows`
   goes back to auto and every tile to `grid-row: auto`, so the tall tile stops
   spanning two rows; `grid-column: auto` puts all four in one row of three equal
   columns, so the wide tile stops being wider than the bottom tiles.

   Arm 2 is the width the collision was MEASURED at. The real page rendered its
   tall tile 128px wide against an intended 380, and arm 1 does not reproduce
   that number: three equal columns of 1440 put the tall tile at about 33%, which
   is inside the band this gate allows. So the collapse is planted directly, and
   it is what puts `hub-tall-pct` and `hub-narrow` under a watched failure. Two
   arms because the defect had two signatures and one arm proves only its own. */
const SELF = [
  {
    arm: 'the wave 16 .bento__tile collision, as it landed on the hub',
    want: ['hub-span', 'hub-wide'],
    css: `
.hub__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--gap); margin-top: 40px; grid-auto-rows: auto; }
.hub__tile { background: var(--bg-light); border: 1px solid var(--line); border-radius: var(--radius-card); padding: 24px; grid-column: auto; grid-row: auto; }
`,
  },
  {
    arm: 'the 128px tall tile the collision was measured at',
    want: ['hub-tall-pct', 'hub-narrow'],
    css: `
.hub__grid { grid-template-columns: 128px minmax(0, 1fr) minmax(0, 1fr); }
`,
  },
  /* Arms 3 and 4 are the catalogue half. A gate whose second family has never
     been watched fail is half a gate, and the two regressions worth planting are
     the two that would actually happen: a breakpoint edited so the desktop grid
     loses a column, and the phone fold escaping into desktop, which is the one
     thing the W24-09 CSS is arranged to make impossible. */
  {
    arm: 'a desktop catalogue grid that lost a column',
    want: ['grid-cols'],
    family: 'grid',
    css: `
.prod-grid { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
`,
  },
  {
    arm: 'the phone fold escaping into desktop',
    want: ['grid-desktop-fold'],
    family: 'grid',
    css: `
.prod-grid[data-prod-grid] .prod--folded { display: none; }
`,
    /* The fold class is only ever ON the cards when main.js has put it there, and
       main.js only does that below 768px. So the arm also forces the class on, the
       way a mistaken JS width test would. */
    js: `document.querySelectorAll('[data-product-card]').forEach((c, i) => { if (i >= 12) c.classList.add('prod--folded'); });`,
  },
];

async function main() {
  const chromeBin = findChrome();
  const server = await serve();
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'rc-layout-geometry-'));
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
  const die = (msg) => { ws.close(); stop(); fail(msg); };

  async function read(url, w, mobile, js) {
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile });
    // A cache-buster, so a page served patched is never answered from the copy
    // read unpatched a moment earlier. Same reason verify-live carries one.
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${HTTP_PORT}${url}?geo=${Date.now()}${Math.random().toString(36).slice(2, 8)}` });
    for (let i = 0; i < 80; i++) { if (await cdp.ev('document.readyState === "complete"').catch(() => false)) break; await sleep(150); }
    const inter = await cdp.ev(FONTS).catch(() => 0);
    if (!inter) die(`the Inter webfont did not load for ${url} at ${w}px, so nothing here would be a measurement of this site.`);
    if (js) await cdp.ev(js);
    await sleep(120);
    return cdp.ev(PROBE);
  }

  /* --- the self-test, before any real result -------------------------------- */
  /* One page per family, each the page the defect was actually found on: the RO
     acoperisuri hub, and the deepest catalogue grid. */
  const HUB_ARM = HUB_PAGES.find((u) => u.includes('/acoperisuri/') && !ru(u)) || HUB_PAGES[0];
  const GRID_ARM = GRID_PAGES.find((u) => u.includes('/placi-ceramice/') && !ru(u)) || GRID_PAGES[0];
  const armPage = (t) => (t.family === 'grid' ? GRID_ARM : HUB_ARM);
  const judgeOf = (t) => (t.family === 'grid' ? judgeGrid : judgeHub);
  const pick = (t, r) => (t.family === 'grid' ? r.grid : r.hub);

  /* The control is BOTH families, read clean in this same run immediately before
     the arms and immediately after them (R-AB): an arm read against a control
     nobody watched green proves nothing, which is how four wave 16 arms were
     reported as firing against a control that was already red. */
  async function control(label) {
    const hub = judgeHub((await read(HUB_ARM, 1440, false)).hub, `${HUB_ARM} at 1440px`, 1440);
    const grid = judgeGrid((await read(GRID_ARM, 1440, false)).grid, `${GRID_ARM} at 1440px`, 1440);
    const bad = [...hub, ...grid];
    if (bad.length) die(`the self-test control is ${label}, so its arms prove nothing: ${bad.map((x) => x.text).join(' | ')}`);
    console.log(`self-test control (${HUB_ARM}, ${GRID_ARM}): clean`);
  }

  await control('not clean');

  for (const t of SELF) {
    const url = armPage(t);
    const where = `${url} at 1440px`;
    patch = { url, css: t.css };
    const got = judgeOf(t)(pick(t, await read(url, 1440, false, t.js)), where, 1440);
    patch = null;
    /* Asserted BY ID, and every id the arm claims. That is what stops an arm
       passing on some unrelated red, which is exactly how four wave 16 arms were
       read as firing against a control that was already failing (R-AB, case 2). */
    const ids = new Set(got.map((x) => x.id));
    for (const want of t.want) {
      if (!ids.has(want)) {
        die(`the self-test arm "${t.arm}" did not fire on "${want}". It reported: ${got.length ? [...ids].join(', ') : 'nothing'}. An assertion nobody has watched fail is not a gate.`);
      }
    }
    console.log(`self-test arm fired on its own messages: ${t.arm} -> ${t.want.join(', ')}`);
    for (const x of got) console.log(`    ${x.text}`);
  }

  await control('dirty after the arms, so the arms left residue');
  console.log('');

  /* --- the real run --------------------------------------------------------- */
  const problems = [];
  let measured = 0, tilesRead = 0, cardsRead = 0;
  for (const { w, mobile } of WIDTHS) {
    for (const url of HUB_PAGES) {
      const r = await read(url, w, mobile);
      measured++;
      if (r.hub) tilesRead += r.hub.tiles.length;
      problems.push(...judgeHub(r.hub, `${url} at ${w}px`, w));
    }
    for (const url of GRID_PAGES) {
      const r = await read(url, w, mobile);
      measured++;
      if (r.grid) cardsRead += r.grid.visible;
      problems.push(...judgeGrid(r.grid, `${url} at ${w}px`, w));
    }
  }
  ws.close(); stop();

  console.log(`combinations measured: ${measured} of ${EXPECTED}; bento tiles read: ${tilesRead}; product cards painted: ${cardsRead}`);
  if (measured !== EXPECTED && !problems.length) {
    problems.push({ id: 'matrix', text: `measured ${measured} of ${EXPECTED} combinations` });
  }
  if (problems.length) {
    const ids = [...new Set(problems.map((p) => p.id))];
    console.error(`\nLAYOUT GEOMETRY GATE FAILED: ${problems.length} problem(s), ${ids.join(', ')}`);
    for (const id of ids) {
      console.error(`\n  ${id}`);
      for (const p of problems.filter((x) => x.id === id)) console.error(`    ${p.text}`);
    }
    console.error('');
    process.exit(1);
  }
  console.log(`\n${measured} of ${EXPECTED} combinations: every bento is four tiles in the specified proportions, and every catalogue grid is 4 columns at 1440 and 1 at 390 with the reveal folding only on a phone.`);
  console.log('The self-test above is what this run proves, and it fired on the wave 16 collision.');
}

main().catch((e) => fail(e && e.stack ? e.stack : String(e)));
