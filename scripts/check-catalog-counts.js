#!/usr/bin/env node
/* Catalogue counts, card W28-13 (wave 28), the named test "catalog-counts". Run by `quality`.

   THE OWNER'S ACCEPTANCE, verbatim from the wave 28 dispatch: "catalog roofing card count
   equals 99 and garduri count equals pre-change count recorded in the card; named test
   catalog-counts passes." The pre-change counts were MEASURED on the built tree at 5751d2c
   before the move and recorded on the board: 99 roofing cards, 9 tiles (4 hub + 5 product
   bento), 7 filter buttons (Toate plus six groups) on the roofing page, 8 fence model cards.

   Two kinds of number, held to each other (a-gate-count-is-not-a-remembered-number):
     - the DATA count, derived from the content files the way the build derives it: the fence
       models are content/garduri-modele.json models.length; the roofing filter buttons are
       content/roofing-sections.json groups.length plus Toate; the tiles are the two bento
       configurations' sizes read off the page's own hub and product grids; the roofing cards
       are the page's own "Toate" filter count, which the build writes from the records it
       rendered (the Toate button's own .roof-filter__n);
     - the RECORDED count, the number the owner's card names (99, 9, 8), so a change to the
       data that moves the number is reported by name and not absorbed.
   Both locales must agree with each other. It exits non-zero on any miss and prints every
   number it read; it fails on zero pages, a missing data file, or a page it cannot find
   (docs/CLAUDE.md section 13).

       node scripts/check-catalog-counts.js          the four assertions
       node scripts/check-catalog-counts.js --llms   W28-19: every catalogue group URL in dist/llms.txt

   W28-14: the copertine group: the twelve model cards on /servicii/copertine/ (both locales)
   equal content/copertine.json models carrying an image, and the page's own chip count says
   the same number.
   AMENDED (W28-30, the fifth dispatch: "the 12 copertine cards with no price must not sit under
   Catalog"): the copertine group left the Catalog. The copertine page carries its twelve cards,
   each with one button to #oferta, and NO group chip; and no page under /catalog/, either locale,
   carries a copertine card, a Catalog tile to the copertine page, or a Catalog menu row to it (the
   Catalog menu is on every page, so every built page is read for the menu row). Zero dependency. */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const fail = (m) => { console.error(`\nCATALOG COUNTS FAILED: ${m}\n`); process.exit(1); };
const problems = [];
const bad = (m) => problems.push(m);

/* The recorded numbers, from the board card W28-13 (docs/board/W28-board.json). */
const RECORDED = { roofingCards: 99, roofingTiles: 9, roofingFilters: 7, fenceCards: 8, copertineCards: 12 };
const ROOF_PAGE = { ro: 'catalog/materiale-acoperis/index.html', ru: 'ru/catalog/materiale-acoperis/index.html' };
const FENCE_PAGE = { ro: 'servicii/modele-garduri/index.html', ru: 'ru/servicii/modele-garduri/index.html' };
const COP_PAGE = { ro: 'servicii/copertine/index.html', ru: 'ru/servicii/copertine/index.html' };
const SERVICE_PAGES = ['servicii/acoperisuri/index.html', 'ru/servicii/acoperisuri/index.html', 'servicii/garduri/index.html', 'ru/servicii/garduri/index.html'];

if (!fs.existsSync(DIST)) fail('no dist/, run: node build.js');
const read = (rel) => { const f = path.join(DIST, rel); if (!fs.existsSync(f)) fail(`built page missing: dist/${rel}`); return fs.readFileSync(f, 'utf8'); };
const count = (html, re) => (html.match(re) || []).length;

const sections = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/roofing-sections.json'), 'utf8'));
const fences = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/garduri-modele.json'), 'utf8'));
const cop = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/copertine.json'), 'utf8'));
const copWithImage = (cop.models || []).filter((m) => m.image && m.image.slot).length;
if (!copWithImage) fail('content/copertine.json has no model with an image slot');
if (!Array.isArray(sections.groups) || !sections.groups.length) fail('content/roofing-sections.json has no groups');
if (!Array.isArray(fences.models) || !fences.models.length) fail('content/garduri-modele.json has no models');

let pagesRead = 0;
const out = [];
for (const loc of ['ro', 'ru']) {
  const roof = read(ROOF_PAGE[loc]); pagesRead++;
  const cards = count(roof, /<article class="prod"[^>]*data-product-card/g);
  const hubTiles = count(roof, /<a class="hub__tile /g);
  const pbTiles = count(roof, /<a class="pb__tile /g);
  const filters = count(roof, /data-roof-filter="/g);
  const toate = roof.match(/id="mat-toate"[^>]*>[^<]*<span class="roof-filter__n">(\d+)<\/span>/);
  const toateCount = toate ? Number(toate[1]) : null;
  out.push(`${loc} roofing catalogue: ${cards} cards, ${hubTiles} hub + ${pbTiles} product tiles, ${filters} filters, Toate count ${toateCount === null ? 'MISSING' : toateCount}`);
  if (toateCount === null) bad(`${ROOF_PAGE[loc]}: the Toate filter carries no count, so the page's own count cannot be read`);
  else if (cards !== toateCount) bad(`${ROOF_PAGE[loc]}: ${cards} cards rendered but the Toate filter says ${toateCount}`);
  if (cards !== RECORDED.roofingCards) bad(`${ROOF_PAGE[loc]}: ${cards} roofing cards, the card records ${RECORDED.roofingCards}`);
  if (hubTiles + pbTiles !== RECORDED.roofingTiles) bad(`${ROOF_PAGE[loc]}: ${hubTiles + pbTiles} tiles (${hubTiles} hub + ${pbTiles} product bento), the card records ${RECORDED.roofingTiles}`);
  if (filters !== sections.groups.length + 1) bad(`${ROOF_PAGE[loc]}: ${filters} filter buttons, the data has ${sections.groups.length} groups plus Toate`);
  if (filters !== RECORDED.roofingFilters) bad(`${ROOF_PAGE[loc]}: ${filters} filter buttons, the card records ${RECORDED.roofingFilters}`);
  const fence = read(FENCE_PAGE[loc]); pagesRead++;
  const nvk = count(fence, /<article class="nvk"/g);
  out.push(`${loc} fence models: ${nvk} cards, data has ${fences.models.length}`);
  if (nvk !== fences.models.length) bad(`${FENCE_PAGE[loc]}: ${nvk} fence cards, content/garduri-modele.json has ${fences.models.length}`);
  if (nvk !== RECORDED.fenceCards) bad(`${FENCE_PAGE[loc]}: ${nvk} fence cards, the card records ${RECORDED.fenceCards}`);
  const cp = read(COP_PAGE[loc]); pagesRead++;
  const copCards = count(cp, /<article class="model"[^>]*data-product-card/g);
  const copButtons = count(cp, /<a class="btn btn--primary model__cta" href="#oferta"/g);
  const copChip = count(cp, /data-roof-filter="copertine"/g);
  out.push(`${loc} copertine: ${copCards} model cards, ${copButtons} buttons to #oferta, ${copChip} group chip(s), data has ${copWithImage} with a picture`);
  if (copChip) bad(`${COP_PAGE[loc]}: carries the copertine group chip, which left with the Catalog group (W28-30)`);
  if (copButtons !== copCards) bad(`${COP_PAGE[loc]}: ${copButtons} buttons to #oferta for ${copCards} cards`);
  if (copCards !== copWithImage) bad(`${COP_PAGE[loc]}: ${copCards} model cards, content/copertine.json has ${copWithImage} models with a picture`);
  if (copCards !== RECORDED.copertineCards) bad(`${COP_PAGE[loc]}: ${copCards} copertine cards, the card records ${RECORDED.copertineCards}`);
}
/* W28-30: nothing copertine under the Catalog. */
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const allPages = walk(DIST).filter((f) => f.endsWith('.html'));
const catalogPages = allPages.filter((f) => /[\\/]catalog[\\/]/.test(path.relative(DIST, f)) || path.relative(DIST, f).startsWith('catalog'));
if (!catalogPages.some((f) => path.relative(DIST, f).startsWith('ru'))) fail('no Russian catalogue page found under dist/ru/catalog/');
if (!catalogPages.length) fail('no catalogue page found under dist/catalog/');
let copUnderCatalog = 0, copTiles = 0, copMenuRows = 0;
for (const f of catalogPages) {
  const html = fs.readFileSync(f, 'utf8'); const rel = path.relative(DIST, f);
  const cards = count(html, /data-roof-groups="copertine"/g) + count(html, /<article class="model"/g);
  const tiles = count(html, /class="cat-tile" href="[^"]*\/servicii\/copertine\//g);
  copUnderCatalog += cards; copTiles += tiles;
  if (cards) bad(`dist/${rel}: ${cards} copertine card(s) on a Catalog page (W28-30)`);
  if (tiles) bad(`dist/${rel}: a Catalog tile opens the copertine page (W28-30)`);
}
let phoneMenus = 0, phoneOk = 0;
for (const f of allPages) {
  const html = fs.readFileSync(f, 'utf8');
  const n = count(html, /class="catalog__link" href="[^"]*\/servicii\/copertine\//g);
  copMenuRows += n;
  if (n) bad(`dist/${path.relative(DIST, f)}: the Catalog menu carries a copertine row (W28-30)`);
  /* W28-FIX-04: on a phone the menu is one list, and a row indented after "Catalog" reads as a
     Catalog entry. The copertine row must appear once, after "Servicii" and before "Catalog". */
  const i = html.indexOf('id="mobile-panel"');
  if (i < 0) continue;
  phoneMenus++;
  const seg = html.slice(i, html.indexOf('</div>', i));
  const svc = seg.search(/class="mobile-nav-link" href="[^"]*#servicii"/);
  const cat = seg.search(/class="mobile-nav-link" href="[^"]*\/catalog\/"/);
  const rows = [...seg.matchAll(/mobile-nav-link--sub" href="[^"]*\/servicii\/copertine\/"/g)];
  if (rows.length === 1 && svc >= 0 && cat > svc && rows[0].index > svc && rows[0].index < cat) phoneOk++;
  else bad(`dist/${path.relative(DIST, f)}: the phone menu has ${rows.length} copertine row(s)${rows.length === 1 ? ', not between "Servicii" and "Catalog"' : ''} (W28-FIX-04)`);
}
if (!phoneMenus) fail('no built page carries the phone menu, so the W28-FIX-04 rule read nothing');
pagesRead += allPages.length;
out.push(`Catalog pages read: ${catalogPages.length}; copertine cards on them: ${copUnderCatalog}; copertine Catalog tiles: ${copTiles}; copertine Catalog menu rows on ${allPages.length} pages: ${copMenuRows}`);
out.push(`phone menus read: ${phoneMenus}; with the copertine row once, under Servicii and before Catalog: ${phoneOk}`);

for (const rel of SERVICE_PAGES) {
  const html = read(rel); pagesRead++;
  const cards = count(html, /<article class="prod"[^>]*data-product-card/g) + count(html, /<article class="nvk"/g);
  const prices = count(html, /\bprod__price\b/g) + count(html, /\bnvk__price\b/g);
  out.push(`${rel}: ${cards} product cards, ${prices} price elements`);
  if (cards || prices) bad(`${rel}: a service page carries ${cards} product card(s) and ${prices} price element(s); W28-13 says none`);
}

/* W28-FIX-05: the copertine page left the Catalog group list at W28-30, so it must be listed with
   the services in dist/llms.txt, both locale URLs, under the Servicii heading. */
{
  const llmsFile = path.join(DIST, 'llms.txt');
  if (!fs.existsSync(llmsFile)) fail('dist/llms.txt is missing');
  const llmsTxt = fs.readFileSync(llmsFile, 'utf8');
  const svcSection = (llmsTxt.split(/^## /m).find((sec) => sec.startsWith('Servicii')) || '');
  const ok = svcSection.includes('https://rapidconstruct.md/servicii/copertine/') && svcSection.includes('https://rapidconstruct.md/ru/servicii/copertine/');
  out.push(`llms.txt: the copertine page ${ok ? 'is' : 'is NOT'} listed under Servicii, both locales`);
  if (!ok) bad('dist/llms.txt does not list the copertine page under Servicii in both locales (W28-FIX-05)');
}

/* W28-19: every catalogue group URL is in dist/llms.txt. */
if (process.argv.includes('--llms')) {
  const llms = path.join(DIST, 'llms.txt');
  if (!fs.existsSync(llms)) fail('dist/llms.txt is missing');
  const txt = fs.readFileSync(llms, 'utf8');
  const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/catalog.json'), 'utf8'));
  const urls = catalog.categories.map((c) => c.href && c.href.ro).filter(Boolean);
  if (urls.length < 9) bad(`content/catalog.json lists ${urls.length} top-level catalogue URLs, expected at least 9`);
  let found = 0;
  for (const u of urls) { if (txt.includes(`https://rapidconstruct.md${u}`)) found++; else bad(`llms.txt lacks the catalogue group URL ${u}`); }
  out.push(`llms.txt: ${found} of ${urls.length} catalogue group URLs present`);
}

console.log(`pages read: ${pagesRead}`);
out.forEach((l) => console.log('  ' + l));
if (problems.length) { console.error(`\n${problems.length} problem(s):`); problems.forEach((p) => console.error('  ' + p)); process.exit(1); }
console.log(`roofing cards ${RECORDED.roofingCards}, tiles ${RECORDED.roofingTiles}, filters ${RECORDED.roofingFilters}, fence cards ${RECORDED.fenceCards}, copertine cards ${RECORDED.copertineCards}, both locales, and no product card or price on a service page.`);
