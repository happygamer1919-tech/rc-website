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
           node scripts/verify-live.js https://rapidconstruct.md
*/

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ORIGIN = (process.argv[2] || 'https://rapidconstruct.md').replace(/\/$/, '');
const CHROME = process.env.CHROME_BIN
  || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = Number(process.env.CDP_PORT || 9401);
const WIDTH = 1440, HEIGHT = 900;

/* One buster for the whole run. Unique per invocation, so nothing can be served
   from an edge cache populated by a previous run either. */
const BUST = `rp${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

/* W12-23. The SHA the deployed artifact is expected to carry. Content markers
   prove the build has properties; this proves it IS the commit. Override with
   EXPECT_SHA when verifying something other than local HEAD. */
const EXPECT_SHA = (process.env.EXPECT_SHA
  || require('child_process').execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' })).trim();
const bust = (p) => `${ORIGIN}${p}${p.includes('?') ? '&' : '?'}${BUST}=1`;

/* --- the marker sets, per page type -------------------------------------- */
/* R-P requires at least one marker per verification. These are the properties
   that would differ if a stale build were served, so a match is evidence the
   deployed build is the one under test. They are asserted in the SAME page load
   as the height, never in a separate request. */
const MARKERS = {
  home: {
    /* W24-06. The four roofing offers left the homepage for the acoperisuri page.
       Asserting the ZERO is what holds that in place: a build with the section
       back on the homepage fires this rather than passing quietly, the same way
       a category page's areaServed: 0 holds its own decision. */
    roofOffers: 0,
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
  /* W24-05. The case la cheie page, and only that one, carries the before/after
     slider. Its own type rather than an extra marker on `service`, because the
     other five service rows carry no slider and an exact count is what a marker
     is. A build made before this card renders 0, so a stale copy returning
     plausible heights cannot match it. */
  'service-ba': {
    promoBar: 1,
    profileAnchors: 0,
    areaServed: 20,
    baItems: 4,
  },
  /* W24-06. The acoperisuri page, and only that one, carries the four roofing
     offers that were on the homepage. Four offer cards: a build made before this
     card renders 0 here and 4 on the homepage, so neither can pass for the other. */
  'service-roof': {
    promoBar: 1,
    profileAnchors: 0,
    areaServed: 20,
    roofOffers: 4,
    // W24-07. The bento hub: four tiles, exactly three of them links.
    bentoTiles: 4,
    bentoLinks: 3,
  },
  /* W24-07. The rocă vulcanică page: four model cards, and no price anywhere.
     `bentoTiles: 0` is asserted because this page is a bento DESTINATION, not a
     hub: a build that put the hub here instead would fire. */
  novatik: {
    promoBar: 1,
    profileAnchors: 0,
    areaServed: 20,
    bentoTiles: 0,
  },
  /* W24-06. The shared "in construcție" page: header, footer, one line, a link
     back. No form, no coverage list, no offers. */
  inconstructie: {
    promoBar: 1,
    profileAnchors: 0,
    areaServed: 0,
    roofOffers: 0,
  },
  /* W24-08. A product page that carries a bento hub: the garduri page. Four
     tiles, exactly three of them links, the same assertion the roofing hub has. */
  'product-hub': {
    promoBar: 1,
    profileAnchors: 0,
    areaServed: 20,
    bentoTiles: 4,
    bentoLinks: 3,
  },
  // W14-13. The three product pages carry the service page's site-wide parts.
  product: {
    promoBar: 1,
    profileAnchors: 0,
    areaServed: 20,
    // W24-08. A plain product page carries no hub. The zero holds that.
    bentoTiles: 0,
  },
  // W18-01 (RC-138). The tile page is a product page that now carries one
  // profile diagram per model. A tile page built before W18-01 carries 0, so a
  // stale copy returning plausible heights cannot match this.
  tigla: {
    promoBar: 1,
    profileAnchors: 0,
    areaServed: 20,
    tileDiagrams: 4,
  },
  privacy: {
    profileAnchors: 0,
    promoBar: 1,
  },
  // W16-02. The category pages carry no JSON-LD at all: a materials category is
  // not a Service and there is no catalog index page for a BreadcrumbList to
  // name. areaServed is therefore 0 BY DESIGN, and asserting the zero is what
  // holds that decision in place: if a later card adds a schema block, this
  // fires rather than passing quietly.
  category: {
    promoBar: 1,
    profileAnchors: 0,
    areaServed: 0,
    // W17-03 (RC-134). The lede and two paragraphs W17-02 added. A category page
    // built before the prose carries 0, so a stale copy cannot match this.
    catProse: 3,
    // W24-04. A category page rolls up its subcategories' products, so every one
    // of the seven renders at least one card. A build made before wave 24 carries
    // 0, so a stale copy returning plausible heights cannot match this.
    productCards: 'atLeast1',
  },
  // W24-04. A subcategory page: breadcrumb, heading, grid. No authored prose, so
  // the zero is asserted on purpose the way the category page's areaServed is: a
  // later card repeating the parent's paragraphs here fires this rather than
  // passing quietly.
  subcategory: {
    promoBar: 1,
    profileAnchors: 0,
    areaServed: 0,
    catProse: 0,
    productCards: 'atLeast1',
  },
  // W24-04. The catalogue index: seven tiles, no prose, no product card.
  index: {
    promoBar: 1,
    profileAnchors: 0,
    areaServed: 0,
    catProse: 0,
    productCards: 0,
    catTiles: 7,
  },
};

const PAGES = [
  // Homepage and product page budgets: ruling R-Y (docs/rulings/R-Y.md, W14-13;
  // product pages as amended by the wave 14 tail; the tile page as amended by
  // W18-01, RC-138, with its profile diagrams, and confirmed under R-P on the live
  // domain by W19-01, RC-141).
  { path: '/',                             type: 'home',    label: 'homepage RO',    budget: 9195 },
  { path: '/ru/',                          type: 'home',    label: 'homepage RU',    budget: 9436 },
  /* W24-05. The before/after slider moved onto this page, so these two rows leave
     the shared 6,000px service budget that RELEASE-NOTES's wave 7 acceptance
     holds and take their own, measured plus 60, under W24-R4. The other four
     service rows are untouched and stay on 6,000. docs/rulings/R-Y.md carries the
     measurement each one came from. */
  { path: '/in-constructie/',              type: 'inconstructie', label: 'in constr RO', budget: 1182 },
  { path: '/ru/in-constructie/',           type: 'inconstructie', label: 'in constr RU', budget: 1182 },
  { path: '/servicii/case-la-cheie/',      type: 'service-ba', label: 'svc RO case', budget: 6436 },
  { path: '/servicii/fatade/',             type: 'service', label: 'svc RO fatade',  budget: 6000 },
  { path: '/ru/servicii/case-la-cheie/',   type: 'service-ba', label: 'svc RU case', budget: 6543 },
  { path: '/ru/servicii/fatade/',          type: 'service', label: 'svc RU fatade',  budget: 6000 },
  /* W24-06. The four roofing offers moved onto this page, so it leaves the shared
     6,000px service budget and takes its own, measured plus 60, under W24-R4. */
  { path: '/servicii/acoperisuri/',        type: 'service-roof', label: 'svc RO acoper', budget: 7658 },
  { path: '/ru/servicii/acoperisuri/',     type: 'service-roof', label: 'svc RU acoper', budget: 7796 },
  /* W24-07. The rocă vulcanică mirror page. */
  { path: '/servicii/roca-vulcanica/',     type: 'novatik', label: 'novatik RO',  budget: 4348 },
  { path: '/ru/servicii/roca-vulcanica/',  type: 'novatik', label: 'novatik RU',  budget: 4446 },
  { path: '/ru/servicii/finisaje/',        type: 'service', label: 'svc RU finis',   budget: 6000 },
  { path: '/servicii/tigla-metalica/',     type: 'tigla',   label: 'tigla RO',       budget: 4000 },
  { path: '/ru/servicii/tigla-metalica/',  type: 'tigla',   label: 'tigla RU',       budget: 4033 },
  { path: '/servicii/copertine/',          type: 'product', label: 'copertine RO',   budget: 6615 },
  { path: '/ru/servicii/copertine/',       type: 'product', label: 'copertine RU',   budget: 6691 },
  /* W24-08. The garduri page gained the fence bento; the copertine page gained a
     dark hero and a cross-sell row; modele de garduri is new. All under W24-R4. */
  { path: '/servicii/garduri/',            type: 'product-hub', label: 'garduri RO',  budget: 5728 },
  { path: '/ru/servicii/garduri/',         type: 'product-hub', label: 'garduri RU',  budget: 5750 },
  { path: '/servicii/modele-garduri/',     type: 'product', label: 'gard modele RO', budget: 3780 },
  { path: '/ru/servicii/modele-garduri/',  type: 'product', label: 'gard modele RU', budget: 3802 },
  // ~~W16-02, RC-129. The seven catalog category pages.~~
  // AMENDED (W24-04): thirty pages, and every budget re-measured. The catalogue
  // index at /catalog/ is new (it answered 404), every subcategory has a page of
  // its own (F-03), and every page now renders the product grid, so the old
  // 2,952 to 3,187 figures are all superseded. Each budget below is the settled
  // height measured at 1440px on this branch plus 60, which is ruling W24-R4;
  // docs/rulings/R-Y.md carries the measurement each one came from.
  // The 1,400px section cap does not apply to a catalogue grid (W24-R4), which is
  // why a category page rolling up 88 products is 12,613px and inside budget.
  { path: '/catalog/',                                      type: 'index',         label: 'idx RO',           budget: 3619 },
  { path: '/ru/catalog/',                                   type: 'index',         label: 'idx RU',           budget: 3644 },
  { path: '/catalog/termoizolatie/',                        type: 'category',      label: 'cat RO termo',     budget: 6797 },
  { path: '/ru/catalog/termoizolatie/',                     type: 'category',      label: 'cat RU termo',     budget: 6714 },
  { path: '/catalog/termoizolatie/polistiren-expandat/',    type: 'subcategory',   label: 'sub RO eps',       budget: 3543 },
  { path: '/ru/catalog/termoizolatie/polistiren-expandat/',  type: 'subcategory',   label: 'sub RU eps',       budget: 3460 },
  { path: '/catalog/termoizolatie/polistiren-extrudat/',    type: 'subcategory',   label: 'sub RO xps',       budget: 3020 },
  { path: '/ru/catalog/termoizolatie/polistiren-extrudat/',  type: 'subcategory',   label: 'sub RU xps',       budget: 3064 },
  { path: '/catalog/termoizolatie/vata-minerala/',          type: 'subcategory',   label: 'sub RO vata',      budget: 3500 },
  { path: '/ru/catalog/termoizolatie/vata-minerala/',       type: 'subcategory',   label: 'sub RU vata',      budget: 3502 },
  { path: '/catalog/termoizolatie/adezivi-si-mase-de-spaclu/',  type: 'subcategory',   label: 'sub RO adez',      budget: 4017 },
  { path: '/ru/catalog/termoizolatie/adezivi-si-mase-de-spaclu/',  type: 'subcategory',   label: 'sub RU adez',      budget: 3940 },
  { path: '/catalog/termoizolatie/alte-produse/',           type: 'subcategory',   label: 'sub RO altep',     budget: 2993 },
  { path: '/ru/catalog/termoizolatie/alte-produse/',        type: 'subcategory',   label: 'sub RU altep',     budget: 2952 },
  { path: '/catalog/tencuieli-decorative/',                 type: 'category',      label: 'cat RO tencu',     budget: 5246 },
  { path: '/ru/catalog/tencuieli-decorative/',              type: 'category',      label: 'cat RU tencu',     budget: 5352 },
  { path: '/catalog/placi-ceramice/',                       type: 'category',      label: 'cat RO placi',     budget: 12665 },
  { path: '/ru/catalog/placi-ceramice/',                    type: 'category',      label: 'cat RU placi',     budget: 13548 },
  { path: '/catalog/elemente-decorative/',                  type: 'category',      label: 'cat RO elem',      budget: 10482 },
  { path: '/ru/catalog/elemente-decorative/',               type: 'category',      label: 'cat RU elem',      budget: 10917 },
  { path: '/catalog/vopsele/',                              type: 'category',      label: 'cat RO vopsele',   budget: 4240 },
  { path: '/ru/catalog/vopsele/',                           type: 'category',      label: 'cat RU vopsele',   budget: 4335 },
  { path: '/catalog/vopsele/vopsele-de-exterior/',          type: 'subcategory',   label: 'sub RO vopext',    budget: 3000 },
  { path: '/ru/catalog/vopsele/vopsele-de-exterior/',       type: 'subcategory',   label: 'sub RU vopext',    budget: 3022 },
  { path: '/catalog/vopsele/vopsele-de-interior/',          type: 'subcategory',   label: 'sub RO vopint',    budget: 3022 },
  { path: '/ru/catalog/vopsele/vopsele-de-interior/',       type: 'subcategory',   label: 'sub RU vopint',    budget: 3068 },
  { path: '/catalog/sisteme-iluminare/',                    type: 'category',      label: 'cat RO ilumin',    budget: 6254 },
  { path: '/ru/catalog/sisteme-iluminare/',                 type: 'category',      label: 'cat RU ilumin',    budget: 6198 },
  { path: '/catalog/alte-materiale/',                       type: 'category',      label: 'cat RO alte',      budget: 3643 },
  { path: '/ru/catalog/alte-materiale/',                    type: 'category',      label: 'cat RU alte',      budget: 3643 },
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
    catProse: q('[data-cat-prose]'),
    productCards: q('[data-product-card]'),
    baItems: q('[data-ba-item]'),
    roofOffers: q('#acoperisuri .offer'),
    bentoTiles: q('.bento__tile'),
    bentoLinks: q('a.bento__tile'),
    catTiles: q('.cat-tile'),
    tileDiagrams: q('[data-tile-diagram]'),
  };
  const facts = {
    sameAsProfile: biz ? biz.sameAs.includes('https://maps.google.com/?cid=1981309119616115698') : null,
    ratingMarkup: /aggregateRating|ratingValue|reviewCount|"@type"\\s*:\\s*"Review"/.test(
      [...document.querySelectorAll('script[type="application/ld+json"]')].map(s=>s.textContent).join(' ')),
    todoVisible: (document.body.innerText.match(/TODO/gi) || []).length,
    robots: (document.querySelector('meta[name="robots"]') || {}).content || '',
    buildSha: (document.querySelector('meta[name="build-sha"]') || {}).content || null,
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

  /* W18-03 (RC-140). An empty PAGES list used to verify nothing and print
     "PASS — 0 unverified, 0 failed", exit 0. */
  if (PAGES.length === 0) { chrome.kill(); console.error('\nFAIL — zero pages to verify, so nothing was measured.\n'); process.exit(1); }
  console.log(`R-P live verification of ${ORIGIN}`);
  console.log(`pages to read: ${PAGES.length}`);
  console.log(`cache-buster for this run: ?${BUST}=1`);
  console.log(`expected build-sha:        ${EXPECT_SHA}\n`);

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
    /* W24-04. A marker is an exact count, except where the count is data: a
       catalogue page renders as many product cards as its category holds, and
       restating 88 here would be a measurement copied into a second place, which
       is what section 14 forbids. `atLeast1` asserts the section is present and
       non-empty, which is what a stale copy would fail; the exact figure lives in
       content/catalog-products.json and is asserted by build.js and by gate 19.
       It is not a skip: 0 fails it. */
    const bad = Object.entries(want).filter(([k, v]) =>
      (v === 'atLeast1' ? !(r.markers[k] >= 1) : r.markers[k] !== v));

    /* Identity is part of whether the page is VERIFIED, not a note under it.
       ABSENCE is a failure, never a skip: an assertion that disables itself when
       its input is missing is the defect that lost cache-busting and that let a
       deleted privacy section read as completeness. */
    const shaProblem = r.facts.buildSha === null
      ? 'no build-sha meta tag served'
      : (r.facts.buildSha !== EXPECT_SHA
          ? `build-sha mismatch\n               served   ${r.facts.buildSha}\n               expected ${EXPECT_SHA}`
          : null);

    const ok = bad.length === 0 && !shaProblem;
    if (!ok) unverified++;
    const within = r.height < page.budget;
    if (!within) failures++;
    seen.push({ page, r, ok, within });
    console.log(`${ok ? 'VERIFIED  ' : 'UNVERIFIED'} ${page.label.padEnd(16)} ${String(r.height).padStart(5)}px / ${page.budget}  ${within ? 'inside' : 'OVER'}`);
    if (shaProblem) console.log(`             ${shaProblem}`);
    bad.forEach(([k, v]) => console.log(`             marker mismatch: ${k} expected ${v}, got ${r.markers[k]}`));
    if (r.facts.ratingMarkup) { console.log('             RATING MARKUP PRESENT — R-K violated'); failures++; }
    if (page.type === 'home' && r.facts.sameAsProfile !== true) { console.log('             sameAs profile URL MISSING'); failures++; }
    if (r.facts.todoVisible) { console.log(`             ${r.facts.todoVisible} visible TODO`); failures++; }
    /* Identity. ABSENCE is a failure, never a skip: an assertion that disables
       itself when its input is missing is the defect that lost cache-busting
       and that let a deleted privacy section read as completeness. */
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
  console.log(`\npages read: ${seen.length} of ${PAGES.length}; reachable URLs crawled: ${reach.size}`);
  if (seen.length !== PAGES.length || seen.length === 0) { console.log(`FAIL — ${seen.length} pages read for ${PAGES.length} listed`); failures++; }
  if (reach.size === 0) { console.log('FAIL — the crawl reached zero URLs'); failures++; }
  console.log(`\n${failures === 0 && unverified === 0 ? 'PASS' : 'FAIL'} — ${unverified} unverified, ${failures} failed`);
  process.exit(failures === 0 && unverified === 0 ? 0 : 1);
}
main().catch((e) => { console.error(e); process.exit(1); });
