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

   The copertine group (W28-14) is added by that card. Zero dependency. */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const fail = (m) => { console.error(`\nCATALOG COUNTS FAILED: ${m}\n`); process.exit(1); };
const problems = [];
const bad = (m) => problems.push(m);

/* The recorded numbers, from the board card W28-13 (docs/board/W28-board.json). */
const RECORDED = { roofingCards: 99, roofingTiles: 9, roofingFilters: 7, fenceCards: 8 };
const ROOF_PAGE = { ro: 'catalog/materiale-acoperis/index.html', ru: 'ru/catalog/materiale-acoperis/index.html' };
const FENCE_PAGE = { ro: 'servicii/modele-garduri/index.html', ru: 'ru/servicii/modele-garduri/index.html' };
const SERVICE_PAGES = ['servicii/acoperisuri/index.html', 'ru/servicii/acoperisuri/index.html', 'servicii/garduri/index.html', 'ru/servicii/garduri/index.html'];

if (!fs.existsSync(DIST)) fail('no dist/, run: node build.js');
const read = (rel) => { const f = path.join(DIST, rel); if (!fs.existsSync(f)) fail(`built page missing: dist/${rel}`); return fs.readFileSync(f, 'utf8'); };
const count = (html, re) => (html.match(re) || []).length;

const sections = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/roofing-sections.json'), 'utf8'));
const fences = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/garduri-modele.json'), 'utf8'));
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
}
for (const rel of SERVICE_PAGES) {
  const html = read(rel); pagesRead++;
  const cards = count(html, /<article class="prod"[^>]*data-product-card/g) + count(html, /<article class="nvk"/g);
  const prices = count(html, /\bprod__price\b/g) + count(html, /\bnvk__price\b/g);
  out.push(`${rel}: ${cards} product cards, ${prices} price elements`);
  if (cards || prices) bad(`${rel}: a service page carries ${cards} product card(s) and ${prices} price element(s); W28-13 says none`);
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
console.log(`roofing cards ${RECORDED.roofingCards}, tiles ${RECORDED.roofingTiles}, filters ${RECORDED.roofingFilters}, fence cards ${RECORDED.fenceCards}, both locales, and no product card or price on a service page.`);
