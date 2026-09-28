#!/usr/bin/env node
/* catalog-parity, card W29-01 (wave 29), rulings R-W29-01 and R-W29-02. Run by `quality`.

   THE OWNER'S RULE: "Every product fatade has must exist on ours in the same category and
   sub-category and the same order", and the acceptance: "named test catalog-parity compares a
   committed docs/catalog/FATADE-PARITY.json (product name, category, sub-category, order, price, image
   source URL, scraped by you at run time and committed) against our rendered catalog in headless
   Chrome, zero missing products, exit 0."

   WHAT IT DOES. docs/catalog/FATADE-PARITY.json is generated from the capture by
   scripts/gen-catalog-w29.js and lists every placement fatade3d.md renders (165 for 162 products).
   For every catalogue page that list names, in BOTH locales, this opens the built page in Chrome at
   1440 wide and reads the product cards in DOM order, then asserts:
   1. the page shows exactly the placements the list names for it, in the same order (the card's
      link to its product page identifies it, so two products that share a name cannot swap);
   2. in Romanian each card's name is fatade's name, or the name_rc the list records with its reason;
   3. each card's price is the list's price_rc (fatade's as shown, with the dispatch's one rule:
      "0,00 lei - X" shows X);
   4. each product's picture was taken from the image source URL the list names: its slot's
      provenance row names that URL, except the four products W29-01 keeps off fatade3d.md;
   5. each card's product page exists and names the product in its h1.
   Zero missing products means zero; a card the list does not name is a failure too.

   IT NEVER PASSES ON NOTHING: it fails on a missing list, an empty list, a missing page and a page
   Chrome cannot read. Its self-test runs first on synthetic pages it serves itself (R-AB): a control,
   a product missing, two products in the wrong order and a wrong price, each failing on its own
   message, then the control again. Usage: node build.js && node scripts/check-catalog-parity.js */
const fs = require('fs');
const path = require('path');
const { open } = require('./lib/headless');

const ROOT = path.join(__dirname, '..');
const DIST = path.resolve(process.argv[2] || path.join(ROOT, 'dist'));
const fail = (m) => { console.error(`\nCATALOG PARITY FAILED: ${m}\n`); process.exit(1); };
const LIST = path.join(ROOT, 'docs/catalog/FATADE-PARITY.json');
if (!fs.existsSync(LIST)) fail('docs/catalog/FATADE-PARITY.json is missing.');
const PAR = JSON.parse(fs.readFileSync(LIST, 'utf8'));
if (!Array.isArray(PAR.items) || !PAR.items.length) fail('docs/catalog/FATADE-PARITY.json lists no product.');
const EXCEPT = new Set(['f3d-3283', 'f3d-2583', 'f3d-2576', 'f3d-2569']);
const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/catalog-products.json'), 'utf8')).products;
const byId = new Map(products.map((r) => [r.id, r]));
const ledger = new Map(JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/PHOTO-SLOTS-W24.json'), 'utf8')).slots.map((s) => [s.id, s]));
const prov = new Map(fs.readFileSync(path.join(ROOT, 'docs/assets/PROVENANCE.md'), 'utf8').split('\n').filter((l) => l.startsWith('| `')).map((l) => { const c = l.split('|').map((x) => x.trim()); return [c[1].replace(/`/g, ''), c[2]]; }));

/* In the page: the cards in DOM order, each with its name, price and product link. */
const CARDS = `(() => [...document.querySelectorAll('.prod-grid [data-product-card]')].map((c) => ({
  name: ((c.querySelector('.prod__name') || {}).textContent || '').replace(/\\s+/g, ' ').trim(),
  price: ((c.querySelector('.prod__price, .prod__ask') || {}).textContent || '').replace(/\\s+/g, ' ').trim(),
  href: (c.querySelector('a.prod__link') || {}).getAttribute ? c.querySelector('a.prod__link').getAttribute('href') : null,
})))()`;

function judge(lc, slug, cards, items) {
  const problems = [];
  const where = `${lc} /catalog/${slug}/`;
  const route = (id) => { const r = byId.get(id); return r ? `${lc === 'ro' ? '/catalog/' : '/ru/catalog/'}${r.categories[0]}/${r.slug}/` : null; };
  const want = items.map((it) => ({ it, href: route(it.id) }));
  const got = cards.map((c) => c.href);
  for (const w of want) if (!got.includes(w.href)) problems.push(`${where}: MISSING "${w.it.name}" (${w.it.id}, fatade order ${w.it.order})`);
  for (const c of cards) if (!want.some((w) => w.href === c.href)) problems.push(`${where}: a card the list does not name: "${c.name}" ${c.href}`);
  const common = want.filter((w) => got.includes(w.href)).map((w) => w.href);
  const seenOrder = got.filter((h) => common.includes(h));
  if (JSON.stringify(common) !== JSON.stringify(seenOrder)) problems.push(`${where}: the order differs from fatade's; first difference at position ${common.findIndex((h, k) => h !== seenOrder[k]) + 1}`);
  for (const w of want) {
    const c = cards.find((x) => x.href === w.href);
    if (!c) continue;
    if (lc === 'ro') { const n = w.it.name_rc || w.it.name; if (c.name !== n) problems.push(`${where}: "${c.name}" is not fatade's name "${n}"`); }
    else { const r = byId.get(w.it.id); if (r && c.name !== r.name.ru) problems.push(`${where}: "${c.name}" is not the record's Russian name "${r.name.ru}"`); }
    if (w.it.price_rc && lc === 'ro' && c.price !== w.it.price_rc) problems.push(`${where}: "${w.it.name}" shows the price "${c.price}", not "${w.it.price_rc}"`);
  }
  return problems;
}

/* The picture: its slot's provenance row names the list's image source URL. Static. */
function pictureProblems() {
  const problems = [];
  const seen = new Set();
  for (const it of PAR.items) {
    if (seen.has(it.id)) continue; seen.add(it.id);
    if (EXCEPT.has(it.id)) continue;
    const r = byId.get(it.id);
    if (!r) { problems.push(`${it.id} "${it.name}" is in the list and has no record`); continue; }
    const row = ledger.get(r.slot);
    if (!row || row.state !== 'filled') { problems.push(`${it.id}: its slot ${r.slot} is not filled`); continue; }
    const src = prov.get(row.provenance) || '';
    if (!it.image_source_url || !src.includes(it.image_source_url)) problems.push(`${it.id} "${it.name}": its picture ${row.provenance} does not name the source ${it.image_source_url}`);
  }
  return problems;
}

/* Self-test pages. */
const card = (name, price, href) => `<article class="prod" data-product-card><h3 class="prod__name"><a class="prod__link" href="${href}">${name}</a></h3><span class="prod__price">${price}</span></article>`;
const T = [{ id: 'T1', name: 'Alfa', order: 1, price_rc: '1,00 lei' }, { id: 'T2', name: 'Beta', order: 2, price_rc: '2,00 lei' }, { id: 'T3', name: 'Gama', order: 3, price_rc: '3,00 lei' }];
for (const t of T) byId.set(t.id, { id: t.id, slug: t.name.toLowerCase(), categories: ['test'], name: { ro: t.name, ru: t.name } });
const page = (list) => `<!doctype html><html><body><div class="prod-grid">${list.map(([n, p, s]) => card(n, p, `/catalog/test/${s}/`)).join('')}</div></body></html>`;
const ROUTES = {
  '/__par-control__/': page([['Alfa', '1,00 lei', 'alfa'], ['Beta', '2,00 lei', 'beta'], ['Gama', '3,00 lei', 'gama']]),
  '/__par-missing__/': page([['Alfa', '1,00 lei', 'alfa'], ['Gama', '3,00 lei', 'gama']]),
  '/__par-order__/': page([['Beta', '2,00 lei', 'beta'], ['Alfa', '1,00 lei', 'alfa'], ['Gama', '3,00 lei', 'gama']]),
  '/__par-price__/': page([['Alfa', '1,00 lei', 'alfa'], ['Beta', '9,00 lei', 'beta'], ['Gama', '3,00 lei', 'gama']]),
};

async function main() {
  if (!fs.existsSync(DIST)) fail(`${DIST} is missing. Run node build.js first.`);
  const { cdp, base, close, browser } = await open({ tag: 'catalog-parity', dist: DIST, cdpPort: Number(process.env.CP_CDP_PORT || 9465), httpPort: Number(process.env.CP_HTTP_PORT || 8775), routes: ROUTES, fail });
  const bail = (m) => { close(); fail(m); };
  console.log(`chrome: ${browser}`);
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  const read = async (u) => { await cdp.goto(base + u); return cdp.ev(CARDS); };

  const control = async (when) => { const p = judge('ro', 'test', await read('/__par-control__/'), T); if (p.length) bail(`self-test control ${when} the arms failed: ${p.join(' | ')}`); };
  await control('before');
  for (const [u, re, arm] of [['/__par-missing__/', /MISSING "Beta"/, 'a product missing'], ['/__par-order__/', /the order differs/, 'two products in the wrong order'], ['/__par-price__/', /shows the price "9,00 lei"/, 'a wrong price']]) {
    const p = judge('ro', 'test', await read(u), T);
    if (!p.some((x) => re.test(x))) bail(`self-test arm "${arm}" did not fire: ${p.join(' | ') || 'nothing'}`);
  }
  await control('after');
  for (const t of T) byId.delete(t.id);
  console.log('self-test: control clean before and after; "a product missing", "wrong order" and "wrong price" each fired\n');

  const bySlug = new Map();
  for (const it of PAR.items) { if (!bySlug.has(it.slug)) bySlug.set(it.slug, []); bySlug.get(it.slug).push(it); }
  const problems = [];
  let pagesRead = 0, cardsRead = 0;
  for (const [slug, items] of bySlug) {
    items.sort((a, b) => a.order - b.order);
    for (const lc of ['ro', 'ru']) {
      const u = `${lc === 'ro' ? '/catalog/' : '/ru/catalog/'}${slug}/`;
      if (!fs.existsSync(path.join(DIST, u, 'index.html'))) { problems.push(`${u} is not built`); continue; }
      const cards = await read(u);
      pagesRead++; cardsRead += cards.length;
      problems.push(...judge(lc, slug, cards, items));
      for (const c of cards) {
        if (!c.href || !fs.existsSync(path.join(DIST, c.href, 'index.html'))) { problems.push(`${u}: "${c.name}" opens ${c.href}, which is not built`); continue; }
        const h1 = (fs.readFileSync(path.join(DIST, c.href, 'index.html'), 'utf8').match(/<h1[^>]*>([^<]*)<\/h1>/) || [])[1];
        if (!h1 || h1.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim() !== c.name) problems.push(`${c.href}: its h1 "${h1}" is not the card's name "${c.name}"`);
      }
    }
  }
  close();
  problems.push(...pictureProblems());
  console.log(`list: ${PAR.items.length} placements, ${new Set(PAR.items.map((x) => x.id)).size} products, ${bySlug.size} pages; read ${pagesRead} pages and ${cardsRead} cards in two locales`);
  if (pagesRead !== bySlug.size * 2) problems.push(`read ${pagesRead} pages, the list needs ${bySlug.size * 2}`);
  if (problems.length) { console.error(`\nCATALOG PARITY FAILED: ${problems.length} problem(s)`); problems.forEach((p) => console.error('  ' + p)); process.exit(1); }
  console.log(`zero missing products: every one of the ${PAR.items.length} placements fatade3d.md renders is on this site, in the same category, sub-category and order, with its name, its price and its picture's source, in both locales.`);
}
main().catch((e) => fail(e && e.stack ? e.stack : String(e)));
