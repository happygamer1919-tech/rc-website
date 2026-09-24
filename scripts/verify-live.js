#!/usr/bin/env node
/* Live verification under ruling R-P (docs/CLAUDE.md section 12).

   A live measurement is valid ONLY when taken with a cache-buster AND with
   content markers asserted in the same pass. Height alone is never evidence: a
   stale edge copy returns a perfectly plausible number, and during wave 12 one
   did: a post-deploy reading returned the exact pre-deploy heights and was
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

/* W25-19. The base path the site is served under, read off the origin rather
   than guessed: an origin with a path (a preview build under /preview/x/) serves
   every absolute href with that prefix, and the redirect targets are absolute. */
/* Defensive, and for a reason that bit immediately: `--self-check` arrives as
   argv[2], so ORIGIN is that flag on a self-check run and is never a URL. The
   self-check must load this module without a network and without an origin. */
const BASE_PATH = (() => {
  try { return new URL(`${ORIGIN}/`).pathname.replace(/\/$/, ''); } catch { return ''; }
})();

/* W25-19. A plain cache-busted GET, no browser. Used only by the redirect check:
   those pages move a browser on before anything can be measured, so what is
   asserted about them is their bytes. Follows nothing: a redirect page must be
   the thing that answers, not something that forwards at the HTTP layer. */
function fetchText(url, depth = 0) {
  return new Promise((resolve, reject) => {
    if (depth > 3) return reject(new Error('too many HTTP redirects'));
    require('https').get(url, { headers: { 'cache-control': 'no-cache', pragma: 'no-cache' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return resolve(fetchText(new URL(res.headers.location, url).toString(), depth + 1));
      }
      const c = [];
      res.on('data', (x) => c.push(x));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(c).toString('utf8') }));
    }).on('error', reject);
  });
}

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
    /* W25-23. TWO cards in the product strip, Copertine and Garduri. The count is
       asserted for the same reason `roofOffers: 0` is: a build that put the
       Acoperisuri card back fires this rather than passing quietly, and so does
       one that lost a second card. It is the strip's own class, not a link count,
       because what moved is a card and not a link. */
    teaserTiles: 2,
    ratingPanel: 0,        // W28-11: the R-N review panel is gone with its claim
    portfolioTiles: 7,     // six project cards plus the W12-05 closing tile
    profileAnchors: 1,     // W28-11, R-W28-03: the reviews link under the testimonials
    promoBar: 0,           // W12-02 static strip
    statTiles: 6,          // W28-11: three in the hero, three in the dark band (the review stat is gone)
    areaServed: 20,        // W12-09 coverage list
  },
  service: {
    promoBar: 0,
    profileAnchors: 0,
    areaServed: 20,
  },
  /* W24-05. The case la cheie page, and only that one, carries the before/after
     slider. Its own type rather than an extra marker on `service`, because the
     other five service rows carry no slider and an exact count is what a marker
     is. A build made before this card renders 0, so a stale copy returning
     plausible heights cannot match it. */
  'service-ba': {
    promoBar: 0,
    profileAnchors: 0,
    areaServed: 20,
    baItems: 4,
  },
  /* W24-06. The acoperisuri page, and only that one, carries the four roofing
     offers that were on the homepage. Four offer cards: a build made before this
     card renders 0 here and 4 on the homepage, so neither can pass for the other. */
  'service-roof': {
    promoBar: 0,
    profileAnchors: 0,
    areaServed: 20,
    roofOffers: 4,
    /* ~~W24-07. The bento hub: four tiles, exactly three of them links.~~
       CORRECTED (W26-01). W25-24 gave every hub tile a destination under ruling
       W25-R24 and LEFT THIS MARKER AT 3. Section 12.0 on a8d819e failed for it:
       four rows UNVERIFIED, every one on `bentoLinks expected 3, got 4`, every
       height inside budget. Nothing was wrong with the site.

       It is the defect docs/CLAUDE.md section 12 already records from W24-07a,
       in the same component: *a marker that is not renamed with the thing it
       names is not a marker*. W25-24 changed what the thing IS and did not come
       here. The count is four because a hub of four tiles now has four links,
       which is the whole point of W25-R24. */
    bentoTiles: 4,
    bentoLinks: 4,
    /* W25-19. The consolidated roofing catalogue. 75 cards: 71 roofing records
       plus the four metal tile models. The EXACT count is asserted here and not
       `atLeast1`, unlike a catalogue page, because this section is not "whatever
       the category holds": it is the whole roofing catalogue in one place, and a
       build that lost a group would still render a grid. A stale copy made before
       this card renders 0 and cannot pass for it.
       `roofFilters: 8` is Toate plus the seven groups, and `roofOff: 0` is the
       page as it loads with no filter chosen: a build that shipped a filter
       already applied would hide cards from a visitor who asked for none. */
    /* AMENDED (W25-26, ruling W25-R21): ~~75~~ ~~**71**~~. The four metal tile model
       cards left this section for /servicii/tigla-metalica/, so the count is the
       71 roofing records and nothing else.
       AMENDED AGAIN (W26-04, ruling W26-R5): **78**. The restructure adds the
       twenty imperlux.md models the ruling puts first, folds thirteen dasterum
       records into eleven of them as grades, and leaves one dasterum record whose
       model name imperlux does not carry. 71 - 13 + 20 = 78, and the arithmetic is
       written out because a count nobody can reproduce is a number, not a marker. */
    /* AMENDED (W27-C-03, ruling W27-R-04): **85**. The seven imperlux.md metal tile
       models, first in their section; no dasterum name matched, so none folded. 78 + 7. */
    /* AMENDED (W27-C-06, ruling W27-R-04): **105**. Twenty metal tile accessories from
       imperlux.md (twenty-one on its pages, one with no picture at the floor). 85 + 20. */
    /* AMENDED (W27-FIX-05, ruling W27-R-12): **99**. Six dasterum accessory records fold into
       five imperlux near-twins (Coamă semirotundă, Bordura de fronton, Reținător de zăpadă, Dolie
       interioară, and the two Plăci de racordare) and render nowhere. 105 - 6. */
    /* AMENDED (W28-13): ZERO. The catalogue moved to /catalog/materiale-acoperis/ (see the
       roofcatalog set); the service page carries six link cards to it instead. */
    productCards: 0,
    /* AMENDED (W26-04): ~~8~~ **6**. Toate plus FIVE sections, not the seven
       catalogue subcategories the bar was built from. The seven catalogue pages
       still answer and still redirect here; what changed is what a visitor filters
       by. */
    /* AMENDED (W27-C-02, ruling W27-R-06): ~~6~~ **7**. Tabla cutata is its own
       section, so Toate plus SIX. */
    roofFilters: 0,
    roofOff: 0,
    foldedCards: 0,
    linkCards: 6,
    /* W26-04. The SECOND bento, four product tiles, all four of them anchors into
       the section below. It carries its own prefix (build.js says why), so
       `bentoTiles` above still counts the hub and only the hub, and a build that
       gave the product bento the hub's class would move BOTH numbers at once. */
    /* AMENDED (W27-C-02, ruling W27-R-06): ~~4~~ **5**. A ninth tile on the page,
       Tabla cutata, as a third row of the product bento; the hub above stays four. */
    pbTiles: 0,
    /* W26-05. Three Compara tables, one per section that has one. The two that do
       not are recorded in content/roofing-sections.json with the reason, so a
       build that quietly grew a fourth is a build that took a decision nobody
       wrote down. */
    /* AMENDED (W27-C-02): ~~3~~ **4**. Tabla cutata declares a table of its own. */
    cmpTables: 0,
  },
  /* W24-07. The rocă vulcanică page: four model cards, and no price anywhere.
     `bentoTiles: 0` is asserted because this page is a bento DESTINATION, not a
     hub: a build that put the hub here instead would fire. */
  novatik: {
    promoBar: 0,
    profileAnchors: 0,
    areaServed: 20,
    bentoTiles: 0,
    /* W26-04: this page is not a product-bento page, and the zero holds that. */
    pbTiles: 0,
    cmpTables: 0,
  },
  /* W24-06. The shared "in construcție" page: header, footer, one line, a link
     back. No form, no coverage list, no offers. */
  inconstructie: {
    promoBar: 0,
    profileAnchors: 0,
    areaServed: 0,
    roofOffers: 0,
  },
  /* W24-08. A product page that carries a bento hub: the garduri page. Four
     tiles, exactly three of them links, the same assertion the roofing hub has. */
  'product-hub': {
    promoBar: 0,
    profileAnchors: 0,
    areaServed: 20,
    bentoTiles: 4,
    bentoLinks: 4,  // W26-01: see the note on the service-roof set above.
    /* W26-04: this page is not a product-bento page, and the zero holds that. */
    pbTiles: 0,
    cmpTables: 0,
    linkCards: 1,          // W28-13: the card to the fence models catalogue
  },
  // W14-13. The three product pages carry the service page's site-wide parts.
  product: {
    promoBar: 0,
    profileAnchors: 0,
    areaServed: 20,
    // W24-08. A plain product page carries no hub. The zero holds that.
    bentoTiles: 0,
  },
  /* W26-12, ruling W26-R14. The fence gallery page: a product page whose block is the
     owner's thirteen fence photographs. `galSlides` counts the lightbox's slides, so a
     build made before this card, which has no such page and no lightbox, cannot match. */
  gallery: {
    promoBar: 0,
    profileAnchors: 0,
    areaServed: 20,
    bentoTiles: 0,
    /* AMENDED (W27-FIX-12, owner instruction W27-R-18): **12**. One photograph, a roofing gable,
       refused from the fence gallery by the owner; the ledger and the page agree at twelve. */
    galSlides: 12,
  },
  // W18-01 (RC-138). The tile page is a product page that now carries one
  // profile diagram per model. A tile page built before W18-01 carries 0, so a
  // stale copy returning plausible heights cannot match this.
  tigla: {
    promoBar: 0,
    profileAnchors: 0,
    areaServed: 20,
    tileDiagrams: 4,
    /* W27-FIX-08 (W27-R-14): the seven imperlux metal tile models render on this page too,
       as product cards above the four Dasterum tile cards. */
    productCards: 7,
  },
  privacy: {
    profileAnchors: 0,
    promoBar: 0,
  },
  // W16-02. The category pages carry no JSON-LD at all: a materials category is
  // not a Service and there is no catalog index page for a BreadcrumbList to
  // name. areaServed is therefore 0 BY DESIGN, and asserting the zero is what
  // holds that decision in place: if a later card adds a schema block, this
  // fires rather than passing quietly.
  category: {
    promoBar: 0,
    profileAnchors: 0,
    areaServed: 0,
    // W17-03 (RC-134). The lede and two paragraphs W17-02 added. A category page
    // built before the prose carries 0, so a stale copy cannot match this.
    catProse: 3,
    // W24-09. Nothing is folded at the width this runs at. See the probe.
    foldedCards: 0,
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
    promoBar: 0,
    profileAnchors: 0,
    areaServed: 0,
    catProse: 0,
    productCards: 'atLeast1',
    foldedCards: 0,
  },
  // W24-04. The catalogue index: no prose, no product card.
  // AMENDED (W25-09): ~~seven tiles~~ **EIGHT**. Acoperișuri is the eighth
  // category, 71 Dasterum products in seven subcategories. The count is asserted
  // rather than relaxed, so a build made before this card cannot match it.
  // AMENDED (W26-06, W26-R5): ~~EIGHT~~ **SEVEN** again. Acoperișuri carries
  // listed: false in content/catalog.json and is off the index; its products live
  // on /servicii/acoperisuri/ and its catalogue pages are redirects there.
  index: {
    promoBar: 0,
    profileAnchors: 0,
    areaServed: 0,
    catProse: 0,
    productCards: 0,
    /* AMENDED (W27-FIX-15, W27-R-21): **9**. The roofing category is listed again and the fence
       entry is new (a tile that opens the fence models page). 7 + 2. */
    /* AMENDED (W28-14): **10**. The copertine group joins the index as an external tile that
       opens the copertine page. 9 + 1. */
    catTiles: 10,
  },
  /* W27-FIX-15 (W27-R-21). The roofing catalogue page: the hub bento (four tiles, four links)
     and the product bento, no prose, no product cards. `bentoTiles` counts the hub only. */
  roofcatalog: {
    promoBar: 0,
    profileAnchors: 0,
    areaServed: 0,
    catProse: 0,
    /* AMENDED (W28-13): the WHOLE roofing catalogue is here: the hub, the product bento
       (five tiles, same-page anchors), Toate plus six filters, the four compare tables and
       the 99 cards that were on the service page (their arithmetic is in the service-roof
       comment above and does not change by moving). */
    productCards: 99,
    roofFilters: 7,
    roofOff: 0,
    foldedCards: 0,
    bentoTiles: 4,
    bentoLinks: 4,
    pbTiles: 5,
    cmpTables: 4,
  },
};

const PAGES = [
  // Homepage and product page budgets: ruling R-Y (docs/rulings/R-Y.md, W14-13;
  // product pages as amended by the wave 14 tail; the tile page as amended by
  // W18-01, RC-138, with its profile diagrams, and confirmed under R-P on the live
  // domain by W19-01, RC-141).
  /* W25-23. The Acoperisuri card left the product strip, so these fall with the
     measurement: R-Y's own rule is that removing an element's cost drops the
     budget by that cost, and a budget left high is a ceiling to hide under. */
  { path: '/',                             type: 'home',    label: 'homepage RO',    budget: 9401 },
  { path: '/ru/',                          type: 'home',    label: 'homepage RU',    budget: 9560 },
  /* W24-05. The before/after slider moved onto this page, so these two rows leave
     the shared 6,000px service budget that RELEASE-NOTES's wave 7 acceptance
     holds and take their own, measured plus 60, under W24-R4. The other four
     service rows are untouched and stay on 6,000. docs/rulings/R-Y.md carries the
     measurement each one came from.
     AMENDED (W26-14, W26-R16 "budgets re-measured plus 60"): the three service rows
     still on the shared 6,000 take their own too, so no row here is a ceiling to
     hide under. */
  { path: '/in-constructie/',              type: 'inconstructie', label: 'in constr RO', budget: 1161 },
  { path: '/ru/in-constructie/',           type: 'inconstructie', label: 'in constr RU', budget: 1161 },
  { path: '/servicii/case-la-cheie/',      type: 'service-ba', label: 'svc RO case', budget: 6539 },
  { path: '/servicii/fatade/',             type: 'service', label: 'svc RO fatade',  budget: 5401 },
  { path: '/ru/servicii/case-la-cheie/',   type: 'service-ba', label: 'svc RU case', budget: 6644 },
  { path: '/ru/servicii/fatade/',          type: 'service', label: 'svc RU fatade',  budget: 5617 },
  /* W24-06. The four roofing offers moved onto this page, so it leaves the shared
     6,000px service budget and takes its own, measured plus 60, under W24-R4. */
  /* W25-19, ruling W25-R18. The roofing catalogue moved onto this page, so the
     old figures stopped being budgets and became stale numbers. These are the
     page as it ships, measured at 1440 with every reveal applied and settled,
     PLUS 60, which is the same derivation W24-R4 gave every other row here.
     docs/rulings/R-Y.md carries the measurement and the reason beside it, and
     W25-R18 requires the figure to be re-measured on the deployed sha after the
     merge and corrected there if the live page differs. */
  /* AMENDED (W25-26): four cards left this section for the tile page, so the
     figures fall with the measurement. */
  /* AMENDED (W27-C-02): a fifth product tile on a third bento row and a fourth Compara
     table; measured 20,180 / 20,318 at 1440, settled, plus 60 (W24-R4), in R-Y. */
  /* AMENDED (W27-C-03): seven imperlux metal tile cards, two more grid rows and the
     derived "de la" lines; measured 21,643 / 21,802 at 1440, settled, plus 60, in R-Y. */
  /* AMENDED (W27-C-05): the two shingle cards gain a tagline, chips and a facts line;
     measured 21,725 / 21,883 at 1440, settled, plus 60, in R-Y. */
  /* AMENDED (W27-C-06): twenty accessory cards, five more grid rows; measured 24,172 /
     24,393 at 1440, settled, plus 60, in R-Y. */
  /* AMENDED (W27-FIX-03, ruling W27-R-10): the eleven rainwater prices return and with them the
     section's "de la" line, one line; measured 24,782 / 25,003 at 1440, settled, plus 60, in R-Y. */
  /* AMENDED (W27-FIX-05, ruling W27-R-12): six accessory cards fold away, two grid rows fewer;
     measured 23,873 / 24,094 at 1440, settled, plus 60, in R-Y. */
  { path: '/servicii/acoperisuri/',        type: 'service-roof', label: 'svc RO acoper', budget: 8166 },
  { path: '/ru/servicii/acoperisuri/',     type: 'service-roof', label: 'svc RU acoper', budget: 8331 },
  /* W24-07. The rocă vulcanică mirror page. */
  /* AMENDED (W27-C-04): chips, a warranty row and a price on each card, a derived "de la"
     line under the heading; measured 4,369 / 4,439 at 1440, settled, plus 60, in R-Y. */
  /* AMENDED (W27-FIX-04, ruling W27-R-11): the "+N" chip on Roman and Wood makes the chip row
     wrap once; measured 4,541 / 4,585 at 1440, settled, plus 60, in R-Y. */
  { path: '/servicii/roca-vulcanica/',     type: 'novatik', label: 'novatik RO',  budget: 4557 },
  { path: '/ru/servicii/roca-vulcanica/',  type: 'novatik', label: 'novatik RU',  budget: 4601 },
  { path: '/ru/servicii/finisaje/',        type: 'service', label: 'svc RU finis',   budget: 5564 },
  /* W25-09. Both rows take +39: this page gained one link-arrow to the new
     catalogue category, measured on the branch at 3979 RO and 4012 RU against
     3940 and 3973 with the link removed as a control. Budget is measured plus 60
     under W24-R4. The acoperisuri hub gained the same link and did NOT move: its
     section's bottom padding absorbed it, measured 7499 RO and 7637 RU with and
     without, so those two budgets are untouched. */
  /* AMENDED (W25-26): the four model cards gained a picture each, so these rise. */
  /* AMENDED (W27-FIX-08, W27-R-14): the seven imperlux model cards above the four tile cards,
     two more grid rows; measured 5,463 / 5,538 at 1440, settled, plus 60, in R-Y. */
  { path: '/servicii/tigla-metalica/',     type: 'tigla',   label: 'tigla RO',       budget: 5479 },
  { path: '/ru/servicii/tigla-metalica/',  type: 'tigla',   label: 'tigla RU',       budget: 5554 },
  /* AMENDED (W26-12): the gallery section, one card and its lightbox, +629 in both
     locales, measured 7184 / 7260. Budget measured plus 60 (W24-R4), R-Y. */
  { path: '/servicii/copertine/',          type: 'product', label: 'copertine RO',   budget: 8165 },
  { path: '/ru/servicii/copertine/',       type: 'product', label: 'copertine RU',   budget: 8242 },
  /* W24-08. The garduri page gained the fence bento; the copertine page gained a
     dark hero and a cross-sell row; modele de garduri is new. All under W24-R4. */
  /* W26-03: 5728 held since W24-08 while the page fell to 5,547. See R-Y's
     2026-09-22 block: a budget may never stay still while its page moves. */
  { path: '/servicii/garduri/',            type: 'product-hub', label: 'garduri RO',  budget: 6085 },
  { path: '/ru/servicii/garduri/',         type: 'product-hub', label: 'garduri RU',  budget: 6106 },
  /* W25-11. Both rows DROP. The "Preț la cerere" line became a "De la ... lei/m2"
     price, and the new line is shorter because it does not carry the catalogue
     card's shared 44px flex min-height: measured 3686 RO and 3707 RU against 3720
     and 3742 before, so the budget falls with it. R-Y: a budget is measured plus
     60, not a ceiling to hide under. */
  /* W25-25. Each of the eight cards gained its colour NAMES beside the count, so
     one fact line became three or four wrapped lines on a 4-column card.
     Measured plus 60, under W24-R4, and recorded in docs/rulings/R-Y.md. */
  { path: '/servicii/modele-garduri/',     type: 'product', label: 'gard modele RO', budget: 4525 },
  { path: '/ru/servicii/modele-garduri/',  type: 'product', label: 'gard modele RU', budget: 4547 },
  /* W26-12. The fence gallery page, measured 3967 in both locales; plus 60 (W24-R4). */
  /* AMENDED (W27-FIX-12, W27-R-18): twelve thumbnails, one grid row fewer; measured 3,750 / 3,750
     at 1440, settled, plus 60, in R-Y. */
  { path: '/servicii/galerie-garduri/',    type: 'gallery', label: 'gal garduri RO', budget: 3766 },
  { path: '/ru/servicii/galerie-garduri/', type: 'gallery', label: 'gal garduri RU', budget: 3766 },
  // ~~W16-02, RC-129. The seven catalog category pages.~~
  // AMENDED (W24-04): thirty pages, and every budget re-measured. The catalogue
  // index at /catalog/ is new (it answered 404), every subcategory has a page of
  // its own (F-03), and every page now renders the product grid, so the old
  // 2,952 to 3,187 figures are all superseded. Each budget below is the settled
  // height measured at 1440px on this branch plus 60, which is ruling W24-R4;
  // docs/rulings/R-Y.md carries the measurement each one came from.
  // The 1,400px section cap does not apply to a catalogue grid (W24-R4), which is
  // why a category page rolling up 88 products is 12,613px and inside budget.
  { path: '/catalog/',                                      type: 'index',         label: 'idx RO',           budget: 4087 },
  { path: '/ru/catalog/',                                   type: 'index',         label: 'idx RU',           budget: 4112 },
  /* W27-FIX-15 (W27-R-21): the roofing catalogue page, both locales; budgets measured plus 60. */
  { path: '/catalog/materiale-acoperis/',                   type: 'roofcatalog',   label: 'cat RO acoper',    budget: 19440 },
  { path: '/ru/catalog/materiale-acoperis/',                type: 'roofcatalog',   label: 'cat RU acoper',    budget: 19523 },
  { path: '/catalog/termoizolatie/',                        type: 'category',      label: 'cat RO termo',     budget: 6904 },
  { path: '/ru/catalog/termoizolatie/',                     type: 'category',      label: 'cat RU termo',     budget: 6820 },
  { path: '/catalog/termoizolatie/polistiren-expandat/',    type: 'subcategory',   label: 'sub RO eps',       budget: 3647 },
  { path: '/ru/catalog/termoizolatie/polistiren-expandat/',  type: 'subcategory',   label: 'sub RU eps',       budget: 3564 },
  { path: '/catalog/termoizolatie/polistiren-extrudat/',    type: 'subcategory',   label: 'sub RO xps',       budget: 3124 },
  { path: '/ru/catalog/termoizolatie/polistiren-extrudat/',  type: 'subcategory',   label: 'sub RU xps',       budget: 3104 },
  { path: '/catalog/termoizolatie/vata-minerala/',          type: 'subcategory',   label: 'sub RO vata',      budget: 3606 },
  { path: '/ru/catalog/termoizolatie/vata-minerala/',       type: 'subcategory',   label: 'sub RU vata',      budget: 3607 },
  { path: '/catalog/termoizolatie/adezivi-si-mase-de-spaclu/',  type: 'subcategory',   label: 'sub RO adez',      budget: 4123 },
  { path: '/ru/catalog/termoizolatie/adezivi-si-mase-de-spaclu/',  type: 'subcategory',   label: 'sub RU adez',      budget: 4045 },
  { path: '/catalog/termoizolatie/alte-produse/',           type: 'subcategory',   label: 'sub RO altep',     budget: 3096 },
  { path: '/ru/catalog/termoizolatie/alte-produse/',        type: 'subcategory',   label: 'sub RU altep',     budget: 3055 },
  { path: '/catalog/tencuieli-decorative/',                 type: 'category',      label: 'cat RO tencu',     budget: 5352 },
  { path: '/ru/catalog/tencuieli-decorative/',              type: 'category',      label: 'cat RU tencu',     budget: 5429 },
  { path: '/catalog/placi-ceramice/',                       type: 'category',      label: 'cat RO placi',     budget: 12847 },
  { path: '/ru/catalog/placi-ceramice/',                    type: 'category',      label: 'cat RU placi',     budget: 13786 },
  { path: '/catalog/elemente-decorative/',                  type: 'category',      label: 'cat RO elem',      budget: 10239 },
  { path: '/ru/catalog/elemente-decorative/',               type: 'category',      label: 'cat RU elem',      budget: 10674 },
  { path: '/catalog/vopsele/',                              type: 'category',      label: 'cat RO vopsele',   budget: 4344 },
  { path: '/ru/catalog/vopsele/',                           type: 'category',      label: 'cat RU vopsele',   budget: 4440 },
  { path: '/catalog/vopsele/vopsele-de-exterior/',          type: 'subcategory',   label: 'sub RO vopext',    budget: 3104 },
  { path: '/ru/catalog/vopsele/vopsele-de-exterior/',       type: 'subcategory',   label: 'sub RU vopext',    budget: 3126 },
  { path: '/catalog/vopsele/vopsele-de-interior/',          type: 'subcategory',   label: 'sub RO vopint',    budget: 3126 },
  { path: '/ru/catalog/vopsele/vopsele-de-interior/',       type: 'subcategory',   label: 'sub RU vopint',    budget: 3172 },
  { path: '/catalog/sisteme-iluminare/',                    type: 'category',      label: 'cat RO ilumin',    budget: 6356 },
  { path: '/ru/catalog/sisteme-iluminare/',                 type: 'category',      label: 'cat RU ilumin',    budget: 6300 },
  { path: '/catalog/alte-materiale/',                       type: 'category',      label: 'cat RO alte',      budget: 3745 },
  { path: '/ru/catalog/alte-materiale/',                    type: 'category',      label: 'cat RU alte',      budget: 3745 },
  /* W25-09. The eighth catalogue category and its seven subcategories, 71
     Dasterum products under W25-R7. Every budget below is measured on the branch
     at 1280px with every reveal applied and settled, plus 60, under W24-R4.
     docs/rulings/R-Y.md carries the measurement each one came from. */
  /* W25-19. The eight roofing catalogue routes, times two locales, LEFT THIS
     LIST. They are redirect pages now and they are not pages to measure: their
     refresh fires before anything settles, so a browser measuring one reports the
     height of /servicii/acoperisuri/ with a filter applied, which is a
     measurement of a different page wearing this one's label. Deleting the rows
     and saying nothing would have left sixteen live URLs nothing checks, so what
     replaces them is `REDIRECTS` below: a plain cache-busted fetch of each one,
     asserting the 200 the dispatch asks for and that all three of the page's
     mechanisms name the same destination. It needs no browser and costs
     milliseconds. */
];

/* W25-19. The sixteen URLs that must keep answering. Built from the same two
   facts the build is: the eight roofing routes and the two locale roots. Listing
   them by hand would be a second copy of the catalogue's shape. */
/* CORRECTED (W26-05). W26-04 regrouped the filter into five sections and left
   THIS FILE expecting each redirect to aim at its own subcategory. Section 12.0 on
   cfebef8 failed for it: 12 of 16 redirect rows FAILED, every one of them reading
   "refreshes to #mat-accesorii-de-acoperis, expected #mat-profnastil", and nothing
   was wrong with the site. It is the third time in three waves that a marker was
   not moved with the thing it names: W24-07a's rename, W25-24's bentoLinks, and
   this. The route list stays what it always was, the eight catalogue URLs that
   must keep answering; what moves with the page is the ANCHOR each one lands on,
   and it is written once, here, as the map the build uses. */
/* AMENDED (W27-FIX-15, W27-R-21): the parent route is a real page again (its own PAGES row
   below); the seven children are the redirect pages. */
const REDIRECT_ROUTES = ['tigla-metalica/', 'profnastil/', 'hidroizolatie/',
  'sistem-de-scurgere/', 'elemente-suplimentare/', 'elemente-de-siguranta/', 'elemente-de-fixare/'];
const REDIRECT_SECTION = {
  'tigla-metalica': 'tigla-metalica',
  'sistem-de-scurgere': 'sisteme-pluviale',
  profnastil: 'tabla-cutata',
  hidroizolatie: 'accesorii-de-acoperis',
  'elemente-suplimentare': 'accesorii-de-acoperis',
  'elemente-de-siguranta': 'accesorii-de-acoperis',
  'elemente-de-fixare': 'accesorii-de-acoperis',
};
const REDIRECTS = [];
/* AMENDED (W28-13): the children redirect to the catalogue page itself, one directory up. */
for (const [loc, root, dest] of [['RO', '/catalog/', '/catalog/materiale-acoperis/'], ['RU', '/ru/catalog/', '/ru/catalog/materiale-acoperis/']]) {
  for (const r of REDIRECT_ROUTES) {
    const child = r.replace(/\/$/, '');
    const section = REDIRECT_SECTION[child];
    if (section === undefined) throw new Error(`verify-live: the roofing route "${r}" has no section to land on. W26-R5 folded the subcategories into five sections and this map has to move with them.`);
    REDIRECTS.push({
      path: `${root}materiale-acoperis/${r}`,
      target: `${dest}#mat-${section}`,
      label: `redir ${loc} ${(r === '' ? 'parent' : child).slice(0, 10)}`,
    });
  }
}


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
    profileAnchors: q('a[data-reviews="google"]'),
    promoBar: q('.promo'),
    statTiles: q('.stat'),
    areaServed: area ? area.areaServed.length : 0,
    catProse: q('[data-cat-prose]'),
    productCards: q('[data-product-card]'),
    baItems: q('[data-ba-item]'),
    roofOffers: q('#acoperisuri .offer'),
    /* CORRECTED (W24-09). These probed the OLD bento tile class and were left
       behind by W24-07a, which renamed the hub's classes to hub__* precisely
       because bento__tile already belonged to the garduri chooser. The markers
       kept counting the old name, so from W24-07 onwards they measured the
       chooser and never the hub: the acoperisuri pages reported 0 tiles where 4
       render, the garduri pages reported the chooser's 5 where the hub's 4 were
       expected, and the copertine page reported 5 where 0 were expected. Six rows
       UNVERIFIED on the first run after the merge of #78 to #85, none of them a
       real defect on the page and all six a defect here.
       A marker that is not renamed with the thing it names is not a marker.
       NO BACKTICK IN THIS COMMENT, and none anywhere else inside PROBE: this
       whole block is a template literal, so a backtick here ends the string and
       the file stops parsing. W24-09 shipped exactly that and broke this script
       on main; W24-09a is the correction. See the guard at the bottom. */
    bentoTiles: q('.hub__tile'),
    galSlides: q('.lbx__slide'),
    bentoLinks: q('a.hub__tile'),
    catTiles: q('.cat-tile'),
    /* W24-09. This run measures at 1440, where the phone reveal folds nothing.
       The ZERO is the assertion: the fold is a class main.js adds, and the rule
       that paints it lives inside a max-width 768px query, so a desktop card
       carrying it would be a regression this catches on the live tree. Counted on
       every catalogue page, so a build that shipped the fold to desktop fires on
       thirty rows rather than passing quietly. */
    foldedCards: q('.prod--folded'),
    tileDiagrams: q('[data-tile-diagram]'),
    /* W25-19. The roofing filter bar, and how many cards it is hiding. */
    pbTiles: q('.pb__tile'),
    linkCards: q('.lk-card'),
    cmpTables: q('[data-roof-table]'),
    roofFilters: q('[data-roof-filter]'),
    roofOff: q('.roof--off'),
    /* W25-23. The homepage product strip. */
    teaserTiles: q('.teasers > .teaser'),
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

/* W25-R11, the ROOT FIX. The gate used to measure a page as soon as readyState
   was complete and the fonts had settled, and on 2026-09-21 that read one page in
   67 at 900px with promoBar 0 and productCards 0: a page measured BEFORE its
   stylesheet applied. The page was fine and the reading was not.

   This waits for two things that are true of every page this gate reads, and it
   is not a sleep:

     1. THE STYLESHEET HAS APPLIED. The site's design tokens are custom properties
        declared on :root in src/styles.css, so --brand resolving to a non-empty
        value IS the stylesheet having applied, by definition rather than by
        guess. Nothing else in the document can set it.
     2. ~~THE PROMO BAR IS PRESENT.~~ AMENDED (W28-11, wave 28): the promo bar is gone
        with its discount string (every marker set now expects promoBar 0), so the
        second condition is the site header, which every page this gate reads renders
        from its template, and which the false red would equally have missed.

   It returns how long it waited and whether both became true, so a page that is
   genuinely missing its header still reports UNVERIFIED rather than hanging:
   the loop is bounded and a timeout returns ready false, which lets the marker
   assertion do its job.

   NO BACKTICK ANYWHERE INSIDE, for the W24-09 reason. */
const READY = `(async () => {
  const tokenSet = () => {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--brand');
    return !!(v && v.trim());
  };
  const header = () => document.querySelectorAll('header.header, .site-header, header').length > 0;
  const t0 = Date.now();
  for (let i = 0; i < 120; i++) {
    if (document.readyState === 'complete' && tokenSet() && header()) {
      return { ready: true, waitedMs: Date.now() - t0, token: true, header: true };
    }
    await new Promise(r => setTimeout(r, 100));
  }
  return { ready: false, waitedMs: Date.now() - t0, token: tokenSet(), header: header() };
})()`;

async function main() {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'rp-verify-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`, `--window-size=${WIDTH},${HEIGHT}`, '--no-first-run',
    '--no-default-browser-check', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--disk-cache-size=1', 'about:blank'], { stdio: 'ignore' });

  /* W25-03b. The profile directory is removed however this process ends. This
     script created one per run and removed none: 125 rp-verify directories had
     accumulated, and a verify-live profile is a full Chrome profile. `exit`
     covers the thrown paths and the explicit exits alike. */
  process.on('exit', () => {
    try { chrome.kill(); } catch {}
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
  });

  let up = null;
  for (let i = 0; i < 80 && !up; i++) { try { up = await rq(`http://127.0.0.1:${PORT}/json/version`); } catch { await sleep(250); } }
  if (!up) { chrome.kill(); throw new Error('chrome did not start'); }

  /* W18-03 (RC-140). An empty PAGES list used to verify nothing and print
     "PASS: 0 unverified, 0 failed", exit 0. */
  if (PAGES.length === 0) { chrome.kill(); console.error('\nFAIL: zero pages to verify, so nothing was measured.\n'); process.exit(1); }
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

  /* W25-R11. `--no-wait-ready` exists so the fix can be watched NOT working: it
     restores the old behaviour exactly, and the card's proof runs the same page
     with it and without it. It is a debug flag and nothing in CI passes it. */
  const WAIT_READY = !process.argv.includes('--no-wait-ready');
  let notReady = 0;

  /* W25-R11. `--slow <ms>` holds the top-level DOCUMENT and every stylesheet back
     by that many milliseconds, which reproduces the defect on demand instead of
     waiting years for it.

     THE DOCUMENT, NOT ONLY THE STYLESHEET, and the difference is the diagnosis.
     A slow stylesheet alone changes nothing, measured: a render-blocking <link>
     also delays the load event, so readyState stays "loading" and the old poll
     waited anyway. What the old poll could not survive is a slow DOCUMENT:
     Page.navigate returns before the new document commits, so the poll reads
     `document.readyState` on the PREVIOUS page, finds "complete" immediately, and
     the probe measures a document that is not the one it asked for. The first
     page of a run measures about:blank, whose scrollHeight in this window is
     exactly 900 and whose marker counts are all 0. That is the row that appeared
     on 2026-09-21, to the pixel.

     `--only <substring>` limits the run to pages whose label or path matches, so
     the proof takes seconds rather than minutes.
     All three are debug flags. Nothing in CI passes any of them, and
     `--self-check` does not read them. */
  const slowIdx = process.argv.indexOf('--slow');
  const SLOW_CSS = slowIdx > -1 ? Number(process.argv[slowIdx + 1] || 0) : 0;
  let slowHeld = 0;
  if (SLOW_CSS > 0) {
    ws.addEventListener('message', (e) => {
      let m; try { m = JSON.parse(e.data); } catch { return; }
      if (m.method !== 'Fetch.requestPaused') return;
      const u = (m.params.request && m.params.request.url) || '';
      const hold = /\.css(\?|$)/i.test(u) || m.params.resourceType === 'Document';
      (async () => {
        if (hold) { slowHeld++; await sleep(SLOW_CSS); }
        try { await cdp.send('Fetch.continueRequest', { requestId: m.params.requestId }); } catch {}
      })();
    });
    await cdp.send('Fetch.enable', { patterns: [{ urlPattern: '*', requestStage: 'Request' }] });
    console.log(`DEBUG: the document and every stylesheet held back by ${SLOW_CSS}ms (--slow)`);
  }
  if (!WAIT_READY) console.log('DEBUG: the W25-R11 readiness wait is DISABLED (--no-wait-ready)');

  const load = async (url) => {
    await cdp.send('Page.navigate', { url });
    for (let i = 0; i < 80; i++) { if (await cdp.ev('document.readyState === "complete"').catch(() => false)) break; await sleep(200); }
    await cdp.ev('document.fonts ? document.fonts.ready.then(()=>1) : 1').catch(() => {});
    if (WAIT_READY) {
      const st = await cdp.ev(READY).catch(() => ({ ready: false, waitedMs: -1, token: false, header: false }));
      if (!st.ready) {
        notReady++;
        console.log(`             NOT READY after ${st.waitedMs}ms: stylesheet applied ${st.token}, header present ${st.header}`);
      }
      return st;
    }
    await sleep(400);
    return { ready: null, waitedMs: 0 };
  };

  let failures = 0, unverified = 0, retried = 0, retrySaved = 0;
  const seen = [];

  /* W25-R11. One reading of one page, as a function, so a re-read is literally
     the same measurement and not a second, laxer one. */
  let readPage = async (page) => {
    await load(bust(page.path));
    const r = await cdp.ev(PROBE);
    const want = MARKERS[page.type];
    const bad = Object.entries(want).filter(([k, v]) =>
      (v === 'atLeast1' ? !(r.markers[k] >= 1) : r.markers[k] !== v));
    const shaProblem = r.facts.buildSha === null
      ? 'no build-sha meta tag served'
      : (r.facts.buildSha !== EXPECT_SHA
          ? `build-sha mismatch\n               served   ${r.facts.buildSha}\n               expected ${EXPECT_SHA}`
          : null);
    return { r, bad, shaProblem, ok: bad.length === 0 && !shaProblem };
  };

  /* W25-R11, THE PROOF. `--prove` watches the readiness probe fail, watches it
     wait, and watches the re-read fire, each between readings that are clean.
     It runs in seconds and needs one real page.

     It exists because the obvious proof did not work, and that is recorded
     rather than hidden: `--slow 4000` held the document and all 47 stylesheets
     back on a real run, 94 responses, and the row still read 3,464px VERIFIED.
     A render-blocking stylesheet also delays the load event, and CDP's
     Runtime.evaluate waits for the new execution context, so the old poll
     survived both. Whatever produced the 900px row on 2026-09-21, it is not
     reproducible by making the network slow, and this proof therefore tests the
     PROBE rather than a guess at the cause. */
  if (process.argv.includes('--prove')) {
    let bad = 0;
    const say = (okFlag, what, detail) => { console.log(`  ${okFlag ? 'ok  ' : 'FAIL'} ${what}${detail ? '  ' + detail : ''}`); if (!okFlag) bad++; };
    const put = async (html) => {
      await cdp.send('Page.navigate', { url: 'about:blank' });
      await sleep(300);
      await cdp.ev(`document.open();document.write(${JSON.stringify(html)});document.close();1`);
    };

    console.log('W25-R11 proof: the readiness probe, and the re-read\n');

    /* Control: a document that is ready the moment it is written. */
    await put('<style>:root{--brand:#F65308}</style><header>x</header><p>control</p>');
    let st = await cdp.ev(READY);
    say(st.ready === true && st.waitedMs < 1000, 'control, tokens and header present at once', `ready ${st.ready}, waited ${st.waitedMs}ms`);

    /* Arm 1: no stylesheet token and no header. It must NOT report ready, and
       it must come back rather than hang. */
    await put('<p>no tokens, no header</p>');
    st = await cdp.ev(READY);
    say(st.ready === false && st.token === false && st.header === false, 'arm 1, neither token nor header: refuses to report ready', `ready ${st.ready}, waited ${st.waitedMs}ms`);

    /* Arm 2: both arrive late. It must WAIT for them, which is the whole fix. */
    await put('<p>late</p><script>setTimeout(function(){document.documentElement.style.setProperty("--brand","#F65308");var d=document.createElement("header");document.body.appendChild(d);},1200)<\/script>');
    st = await cdp.ev(READY);
    say(st.ready === true && st.waitedMs >= 1100, 'arm 2, both arrive after 1200ms: waits for them', `ready ${st.ready}, waited ${st.waitedMs}ms`);

    /* Arm 3: the stylesheet applies but the header never does. Half ready is
       not ready, which is what makes the marker assertion still do its job. */
    await put('<style>:root{--brand:#F65308}</style><p>token only</p>');
    st = await cdp.ev(READY);
    say(st.ready === false && st.token === true && st.header === false, 'arm 3, token but no header: half ready is not ready', `token ${st.token}, header ${st.header}`);

    /* Control again, after the arms (R-AB). */
    await put('<style>:root{--brand:#F65308}</style><header>x</header><p>control</p>');
    st = await cdp.ev(READY);
    say(st.ready === true, 'control again, after the arms', `ready ${st.ready}, waited ${st.waitedMs}ms`);

    /* Arm 4: the re-read. One page is read three times with a marker set that
       cannot match, so the row stays unverified and the run must exit 1 with
       RETRIED printed and counted. Bounded at two re-reads, which is the ruling. */
    const probe = PAGES[0];
    console.log(`\n  arm 4: ${probe.label} read with an impossible marker, to watch RETRIED and the bound`);
    const savedType = probe.type;
    MARKERS.__prove = Object.assign({}, MARKERS[savedType], { promoBar: 999 });
    probe.type = '__prove';
    const out = [];
    const realLog = console.log;
    console.log = (...a) => { out.push(a.join(' ')); realLog(...a); };
    let reads = 0;
    const orig = readPage;
    // eslint-disable-next-line no-func-assign
    readPage = async (pg) => { reads++; return orig(pg); };
    await runOne(probe);
    readPage = orig;
    console.log = realLog;
    probe.type = savedType;
    const retriedLine = out.find((l) => l.startsWith('RETRIED'));
    say(reads === 3, 'arm 4, exactly one read plus two re-reads', `reads ${reads}`);
    say(!!retriedLine, 'arm 4, RETRIED printed with both readings', retriedLine ? retriedLine.slice(0, 96) : 'no RETRIED line');
    say(retried === 1 && retrySaved === 0, 'arm 4, counted in the summary', `retried ${retried}, saved ${retrySaved}`);

    ws.close(); chrome.kill();
    console.log(`\n${bad === 0 ? 'PROOF PASSED' : 'PROOF FAILED'}: ${bad} arm(s) did not behave.\n`);
    process.exit(bad === 0 ? 0 : 1);
  }

  const onlyIdx = process.argv.indexOf('--only');
  const ONLY = onlyIdx > -1 ? String(process.argv[onlyIdx + 1] || '') : null;
  const RUN = ONLY ? PAGES.filter((p) => p.label.includes(ONLY) || p.path.includes(ONLY)) : PAGES;
  if (ONLY) {
    if (!RUN.length) { console.error(`\nFAIL: --only "${ONLY}" matched no page.\n`); process.exit(1); }
    console.log(`DEBUG: --only "${ONLY}" limits this run to ${RUN.length} of ${PAGES.length} pages\n`);
  }

  for (const page of RUN) await runOne(page);

  async function runOne(page) {
    let read = await readPage(page);
    const first = read;
    const extra = [];

    /* W25-R11, THE FALLBACK, bounded in three directions.
       ONLY an unverified row, NEVER a failed one, and at most TWICE.
       A failure is a measurement about the site. An unverified row can be a
       measurement about the instrument, and only that kind may be read again.
       A row that is over budget, or carries rating markup or a visible TODO, has
       failed, and re-reading it would be reading until it agrees. */
    const rowFailed = () => (read.r.height >= page.budget)
      || read.r.facts.ratingMarkup
      || (page.type === 'home' && read.r.facts.sameAsProfile !== true)
      || !!read.r.facts.todoVisible;

    if (!read.ok && !rowFailed()) {
      for (let attempt = 1; attempt <= 2 && !read.ok; attempt++) {
        const again = await readPage(page);
        extra.push(again);
        read = again;
        if (read.ok) break;
      }
      if (extra.length) {
        retried++;
        if (read.ok) retrySaved++;
        console.log(`RETRIED    ${page.label.padEnd(16)} ${extra.length} re-read(s); read 1 ${first.ok ? 'VERIFIED' : 'UNVERIFIED'} ${first.r.height}px`
          + extra.map((e, i) => `, read ${i + 2} ${e.ok ? 'VERIFIED' : 'UNVERIFIED'} ${e.r.height}px`).join(''));
        if (!first.ok) first.bad.forEach(([k, v]) => console.log(`             read 1 marker mismatch: ${k} expected ${v}, got ${first.r.markers[k]}`));
        if (first.shaProblem) console.log(`             read 1 ${first.shaProblem}`);
      }
    }

    const { r, bad, shaProblem } = read;
    const want = MARKERS[page.type];
    /* W24-04. A marker is an exact count, except where the count is data: a
       catalogue page renders as many product cards as its category holds, and
       restating 88 here would be a measurement copied into a second place, which
       is what section 14 forbids. `atLeast1` asserts the section is present and
       non-empty, which is what a stale copy would fail; the exact figure lives in
       content/catalog-products.json and is asserted by build.js and by gate 19.
       It is not a skip: 0 fails it. */
    /* Identity is part of whether the page is VERIFIED, not a note under it.
       ABSENCE is a failure, never a skip: an assertion that disables itself when
       its input is missing is the defect that lost cache-busting and that let a
       deleted privacy section read as completeness. `want` is read above and is
       kept so the marker names printed below are this page's own. */
    void want;
    const ok = read.ok;
    if (!ok) unverified++;
    const within = r.height < page.budget;
    if (!within) failures++;
    seen.push({ page, r, ok, within });
    console.log(`${ok ? 'VERIFIED  ' : 'UNVERIFIED'} ${page.label.padEnd(16)} ${String(r.height).padStart(5)}px / ${page.budget}  ${within ? 'inside' : 'OVER'}`);
    if (shaProblem) console.log(`             ${shaProblem}`);
    bad.forEach(([k, v]) => console.log(`             marker mismatch: ${k} expected ${v}, got ${r.markers[k]}`));
    if (r.facts.ratingMarkup) { console.log('             RATING MARKUP PRESENT: R-K violated'); failures++; }
    if (page.type === 'home' && r.facts.sameAsProfile !== true) { console.log('             sameAs profile URL MISSING'); failures++; }
    if (r.facts.todoVisible) { console.log(`             ${r.facts.todoVisible} visible TODO`); failures++; }
    /* Identity. ABSENCE is a failure, never a skip: an assertion that disables
       itself when its input is missing is the defect that lost cache-busting
       and that let a deleted privacy section read as completeness. */
  }


  /* --- W25-19, the sixteen redirect URLs ---------------------------------- */
  /* The dispatch's own words are "every URL still answers 200", so that is what
     is asserted, plus the three mechanisms agreeing on one destination. No
     browser: a refresh fires before a measurement settles, which is exactly why
     these left PAGES. Cache-busted like everything else here, and the build sha
     is read off each one, because a redirect page served from a stale edge copy
     would point at a section that build did not have. */
  console.log('\nredirect pages (W25-19): 200, noindex, refresh, canonical and link agreeing...');
  let redirOk = 0;
  for (const rd of REDIRECTS) {
    let res;
    try { res = await fetchText(bust(rd.path)); } catch (e) { console.log(`  FAIL ${rd.label}: ${e.message}`); failures++; continue; }
    const problems = [];
    if (res.status !== 200) problems.push(`answered HTTP ${res.status}, not 200`);
    const refresh = /<meta http-equiv="refresh" content="0; url=([^"]+)">/.exec(res.body);
    if (!refresh) problems.push('carries no meta refresh');
    else if (refresh[1] !== BASE_PATH + rd.target) problems.push(`refreshes to ${refresh[1]}, expected ${BASE_PATH + rd.target}`);
    if (!/<meta name="robots" content="noindex, follow">/.test(res.body)) problems.push('is not noindex, follow');
    if (refresh && !res.body.includes(`href="${refresh[1]}"`)) problems.push(`has no visible link to ${refresh[1]}`);
    const sha = /<meta name="build-sha" content="([^"]*)">/.exec(res.body);
    if (!sha) problems.push('carries no build-sha');
    else if (sha[1] !== EXPECT_SHA) problems.push(`build-sha ${sha[1].slice(0, 12)} is not the expected ${EXPECT_SHA.slice(0, 12)}`);
    if (problems.length) { console.log(`  FAIL ${rd.label.padEnd(20)} ${rd.path}`); problems.forEach((x) => console.log(`         ${x}`)); failures++; }
    else { redirOk++; console.log(`  OK   ${rd.label.padEnd(20)} 200 -> ${rd.target}`); }
  }
  console.log(`  ${redirOk} of ${REDIRECTS.length} redirect URLs answer 200 and agree on their destination`);

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
  console.log(`\npages read: ${seen.length} of ${RUN.length}; reachable URLs crawled: ${reach.size}`);
  /* W25-R11. Counted in the summary, so a run that leaned on the fallback says
     so. A re-read nobody can see is indistinguishable from a gate that passes on
     the second try. */
  if (SLOW_CSS > 0) console.log(`DEBUG: responses held back: ${slowHeld}`);
  console.log(`rows retried: ${retried}${retried ? ` (${retrySaved} verified on a re-read, ${retried - retrySaved} still unverified)` : ''}; pages that never became ready: ${notReady}`);
  if (seen.length !== RUN.length || seen.length === 0) { console.log(`FAIL: ${seen.length} pages read for ${RUN.length} listed`); failures++; }
  if (reach.size === 0) { console.log('FAIL: the crawl reached zero URLs'); failures++; }
  console.log(`\n${failures === 0 && unverified === 0 ? 'PASS' : 'FAIL'}: ${unverified} unverified, ${failures} failed`);
  process.exit(failures === 0 && unverified === 0 ? 0 : 1);
}
/* --- W24-09a, the self-check ------------------------------------------------
   `node scripts/verify-live.js --self-check` loads this file, asserts that every
   string it evaluates in the browser is real JavaScript, and exits. It touches no
   network and starts no Chrome, so `quality` can run it on every pull request.

   IT EXISTS BECAUSE W24-09 BROKE THIS FILE AND SHIPPED IT. A comment written
   inside PROBE, which is a template literal, put backticks around the class names
   it discussed. Two of them closed and reopened the template, which turned the
   surrounding expression into a TAGGED TEMPLATE whose tag was a string. The file
   still PARSED (`node --check` exits 0 on it, and so would any parse gate) and
   it threw `TypeError: "(async () => {` the moment it was loaded.

   Nineteen gates were green and `quality` passed, because this script measures the
   DEPLOYED site and therefore cannot run before a deploy: nothing in CI ever
   loaded it. A script CI never loads is a script whose load-time errors are found
   after the merge, which is exactly when this one was found.

   So the check is LOADING, not parsing. Reaching this line at all is most of the
   assertion; compiling the probe strings is the rest, and would catch a probe
   broken in a way that only shows when it is evaluated in the page.

   NO BACKTICK MAY APPEAR INSIDE PROBE. That is what this guards. */
if (process.argv.includes('--self-check')) {
  const strings = { PROBE, READY, FONTS: typeof FONTS === 'string' ? FONTS : null };
  let checked = 0;
  for (const [name, src] of Object.entries(strings)) {
    if (src == null) continue;
    if (/`/.test(src)) {
      console.error(`\nVERIFY-LIVE SELF-CHECK FAILED: ${name} contains a backtick, which ends the template literal it lives in. That is the W24-09 defect.\n`);
      process.exit(1);
    }
    try { new Function(`return (${src});`); } catch (e) {
      console.error(`\nVERIFY-LIVE SELF-CHECK FAILED: ${name} is not valid JavaScript: ${e.message}\n`);
      process.exit(1);
    }
    checked++;
  }
  if (!checked) { console.error('\nVERIFY-LIVE SELF-CHECK FAILED: no probe strings were checked, so nothing was asserted.\n'); process.exit(1); }
  if (!PAGES.length) { console.error('\nVERIFY-LIVE SELF-CHECK FAILED: PAGES is empty.\n'); process.exit(1); }
  const noMarkers = PAGES.filter((p) => !MARKERS[p.type]);
  if (noMarkers.length) {
    console.error(`\nVERIFY-LIVE SELF-CHECK FAILED: ${noMarkers.length} page(s) name a type with no marker set: ${[...new Set(noMarkers.map((p) => p.type))].join(', ')}\n`);
    process.exit(1);
  }
  const noBudget = PAGES.filter((p) => !(p.budget > 0));
  if (noBudget.length) {
    console.error(`\nVERIFY-LIVE SELF-CHECK FAILED: ${noBudget.length} page(s) carry no budget: ${noBudget.map((p) => p.label).join(', ')}\n`);
    process.exit(1);
  }
  console.log(`verify-live self-check: the module loads, ${checked} probe string(s) compile and carry no backtick, ${PAGES.length} pages each have a marker set and a budget.`);
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
