#!/usr/bin/env node
/* Catalog category page gate, card RC-129 (W16-02).

   The seven category pages exist to describe a material category and ask for a
   quote. They carry NO product records, NO prices, NO stock and NO cart, which
   is the constraint the card that created them set out.

   That constraint is standing, not one-off. R-X already gates the neighbouring
   prohibitions site-wide (countdowns, scarcity, financing, struck prices) but
   says nothing about a plain price, so without this a later card could put a
   figure on these pages and nothing would notice.

   Scope: only the built category pages, dist/catalog/** and dist/ru/catalog/**.
   Prices are legitimate elsewhere. The metal tile page carries published list
   prices on purpose, and this gate must never fire on it.

   Per docs/CLAUDE.md section 13 it asserts what it requires before concluding
   anything: at least seven pages in each locale, each non-empty, and every
   pattern passing its own self-test against samples it must catch and samples it
   must not. A run that saw nothing fails.

   Usage:  node build.js && node scripts/check-catalog-pages.js
   No dependencies. */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const fail = (msg) => { console.error(`\nCATALOG PAGE CHECK FAILED: ${msg}\n`); process.exit(1); };

/* Letter-aware word edges, the same helper check-scarcity.js uses: \b is
   ASCII-only and would split a word at its first diacritic. */
const L = '\\p{L}';
const word = (body) => new RegExp(`(?<![${L}])(?:${body})(?![${L}])`, 'iu');

const PATTERNS = [
  {
    id: 'money-amount', kind: 'price',
    re: new RegExp(`(?<![${L}\\d])\\d[\\d\\s.,]*\\s*(?:lei|mdl|€|\\$|руб|лей)(?![${L}])`, 'iu'),
    yes: ['160 lei/m²', '1 200 lei', '188 MDL', '250 лей'],
  },
  { id: 'currency-word', kind: 'price', re: word('lei|mdl|лей'), yes: ['preț în lei', 'цена в лей'] },
  { id: 'price-word', kind: 'price', re: word('pre[țt]|pre[țt]uri|price|prices|цен[аыуе]|стоимост[а-я]*'), yes: ['preț de listă', 'prețuri', 'цена по запросу', 'стоимость', 'цены'] },
  { id: 'cart', kind: 'cart', re: word('co[șs]|cart|корзин[а-я]*|basket'), yes: ['adaugă în coș', 'add to cart', 'в корзину', 'корзина'] },
  { id: 'stock', kind: 'stock', re: word('stoc|stocuri|налич[а-я]*|in stock'), yes: ['în stoc', 'нет в наличии', 'in stock', 'наличие'] },
  { id: 'product-record', kind: 'product record', re: /data-(?:sku|price|product-id)|itemprop="price"|"@type":\s*"(?:Product|Offer)"/i, yes: ['data-sku="X1"', 'itemprop="price"', '"@type": "Product"'] },
];

/* Phrases that are ON these pages, or near misses a careless pattern catches.
   If one of these ever matches, the pattern is wrong, not the page. */
const CLEAN = [
  '+373 76 837 180',
  'Nicolae Zelinski 24',
  'Solicită ofertă gratuită',
  'Получить бесплатную смету',
  'Categorii de produse',
  'Категории товаров',
  'Sisteme de termoizolație',
  'Системы теплоизоляции',
  'Alte materiale de construcții',
  'Другие строительные материалы',
  'Reducere 10% la orice serviciu doar până în 2027',
  'Luni–Sâmbătă 08:00–17:00',
  'Adezivi și mase de șpaclu',
  'Клеи и шпаклёвочные смеси',
];

let selfTested = 0;
for (const p of PATTERNS) {
  for (const s of p.yes) {
    if (!p.re.test(s)) fail(`self-test: pattern ${p.id} does not match its own sample "${s}"`);
    selfTested++;
  }
  for (const s of CLEAN) {
    if (p.re.test(s)) fail(`self-test: pattern ${p.id} matches the clean sample "${s}"`);
    selfTested++;
  }
}

/* --- inputs --------------------------------------------------------------- */
const ROOTS = [
  { dir: path.join(ROOT, 'dist', 'catalog'), locale: 'ro' },
  { dir: path.join(ROOT, 'dist', 'ru', 'catalog'), locale: 'ru' },
];

const pages = [];
for (const r of ROOTS) {
  if (!fs.existsSync(r.dir)) fail(`${path.relative(ROOT, r.dir)} is missing; run node build.js`);
  const slugs = fs.readdirSync(r.dir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);
  if (slugs.length < 7) fail(`${path.relative(ROOT, r.dir)} holds ${slugs.length} categories, expected at least 7`);
  for (const s of slugs) {
    const f = path.join(r.dir, s, 'index.html');
    if (!fs.existsSync(f)) fail(`${path.relative(ROOT, f)} is missing`);
    const text = fs.readFileSync(f, 'utf8');
    if (text.length < 500) fail(`${path.relative(ROOT, f)} is suspiciously small (${text.length} bytes)`);
    pages.push({ where: path.relative(ROOT, f), text, locale: r.locale });
  }
}

/* --- scan ----------------------------------------------------------------- */
const hits = [];
for (const pg of pages) {
  for (const p of PATTERNS) {
    const g = new RegExp(p.re.source, p.re.flags.includes('g') ? p.re.flags : p.re.flags + 'g');
    for (const m of pg.text.matchAll(g)) {
      const at = Math.max(0, m.index - 50);
      hits.push(`${pg.where}  [${p.kind}, ${p.id}]  ...${pg.text.slice(at, m.index + m[0].length + 50).replace(/\s+/g, ' ')}...`);
    }
  }
}

const ro = pages.filter((p) => p.locale === 'ro').length;
const ru = pages.filter((p) => p.locale === 'ru').length;
console.log(`patterns: ${PATTERNS.length}   self-test assertions: ${selfTested}`);
console.log(`scanned: ${pages.length} category pages (${ro} RO, ${ru} RU)`);
if (hits.length) {
  console.error(`\n${hits.length} violation(s) on the catalog category pages:`);
  hits.slice(0, 20).forEach((h) => console.error('  ' + h));
  console.error('\nThese pages carry no prices, no stock, no cart and no product records.');
  process.exit(1);
}
console.log('zero price strings, zero stock strings, zero cart markup, zero product records.');
