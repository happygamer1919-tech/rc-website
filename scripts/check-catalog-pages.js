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

   W17-02 (RC-133) extends it to the authored prose those pages now carry: a lede
   and two paragraphs per page, each in the page's own locale; no manufacturer
   name from the wave 14 audit anywhere on the page; and, inside the prose only,
   no first-person capability claim and no superlative, matched against the term
   lists below, which are printed on every run so the scope is never implicit.
   The prose-only scope is deliberate: the page's existing header, quote form and
   footer speak in the first person on purpose ("Te sunăm noi") and are not this
   card's copy. Price, currency and manufacturer patterns still scan whole pages.

   W22-01 rules ONE exception, and bounds it. "Preț la cerere" and "Цена по
   запросу" are permitted as EXACT strings, in the page's own locale, and only as
   the whole text of a product card's quote button (RC-149's `.prod__cta`, which
   carries the product's name in data-product). Everywhere else they are refused,
   including as plain text on a category page and anywhere on a service, product
   or other page: that second half is a site-wide scan this gate did not have
   before, because "permitted there and nowhere else" cannot be checked by looking
   only at the place it is permitted.

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
  /* W17-02. Every manufacturer the wave 14 audit names (sections 2.1 to 2.4),
     with its domain and a Cyrillic spelling. Not "Fațade" alone: that is this
     site's own service name, and it is in CLEAN below. */
  {
    id: 'manufacturer', kind: 'manufacturer name',
    re: word('dasterum(?:\\.md)?|imperlux(?:\\.md)?|fa[țţt]ade\\s*3d|fatade3d(?:\\.md)?|дастерум|имперлюкс|фасады\\s*3[dд]|фатаде\\s*3[dд]'),
    yes: ['Dasterum', 'dasterum.md', 'Imperlux', 'IMPERLUX', 'Fațade 3D', 'fatade3d.md', 'Дастерум', 'Имперлюкс', 'Фасады 3D'],
  },
];
const MANUFACTURER_NAMES = ['Dasterum', 'Imperlux', 'Fațade 3D (fatade3d)'];

/* W22-01, the owner's ruling on Q-W21-01. The exact string, per locale, and the
   only shape it may take: the whole text of a product card's quote button. Exact
   means exact: the wave 22 dispatch wrote the Russian with a Latin "u", and that
   spelling is NOT this string and is refused like any other price word. */
const PRICE_ON_REQUEST = { ro: 'Preț la cerere', ru: 'Цена по запросу' };
/* The button RC-149 renders: an anchor to the quote form, carrying the product's
   own name. Text captured so it can be compared with the permitted string. */
const PRODUCT_CTA = /<a\b[^>]*class="[^"]*\bprod__cta\b[^"]*"[^>]*\bdata-product="[^"]*"[^>]*>([^<]*)<\/a>/g;

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
  'Fațade',
  'Fațade și acoperișuri',
  'Фасады',
  'Tencuielile minerale au la bază ciment sau var',
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

/* --- W17-02: the prose term lists ----------------------------------------- */
/* Authored for RC-133 from its FORBIDDEN list. Matched against the three prose
   blocks of each page only, never the chrome (see the header). A trailing * is a
   stem. In RO terms each diacritic also accepts its bare letter, so a claim
   typed without diacritics is still caught. Letter-aware edges throughout, so
   "насколько" is not "нас" and "улучшает" is not "лучш*". */
const TERMS = {
  'capability-ro': [
    // first person
    'noi', 'nouă', 'nostru', 'noastră', 'noastre', 'noștri', 'eu', 'ne',
    'avem', 'oferim', 'livrăm', 'montăm', 'instalăm', 'executăm', 'realizăm', 'garantăm',
    'asigurăm', 'furnizăm', 'lucrăm', 'dispunem', 'deținem', 'aducem', 'vindem',
    'comercializăm', 'distribuim', 'importăm', 'producem', 'fabricăm', 'recomandăm',
    'propunem', 'facem', 'venim', 'măsurăm', 'putem',
    // claims about the company: stock, brands, lead times, warranty, capacity, experience, certification
    'Rapid Construct', 'echip*', 'experienț*', 'garanț*', 'certific*', 'omolog*', 'acredit*',
    'livr*', 'termen de livrare', 'depozit*', 'distribuitor*', 'dealer*', 'partener*',
    'brand*', 'marca', 'mărci*', 'la comandă', 'capacitat*',
  ],
  'capability-ru': [
    // first person
    'мы', 'нас', 'нам', 'нами', 'наш*', 'я', 'меня', 'мне', 'мой', 'моя', 'моё', 'мои',
    'предлагаем', 'поставляем', 'доставляем', 'привозим', 'монтируем', 'устанавливаем',
    'выполняем', 'гарантируем', 'обеспечиваем', 'продаём', 'реализуем', 'работаем', 'имеем',
    'производим', 'изготавливаем', 'рекомендуем', 'сотрудничаем', 'приедем', 'замерим',
    'сделаем', 'подберём', 'можем',
    // claims about the company
    'Rapid Construct', 'Рапид Констракт', 'команд*', 'бригад*', 'опыт*', 'гарант*',
    'сертифи*', 'аккредит*', 'доставк*', 'срок* поставки', 'срок* доставки', 'склад*',
    'дилер*', 'дистрибьют*', 'официальн*', 'партнёр*', 'бренд*', 'торгов* марк*',
    'под заказ', 'мощност*',
  ],
  'superlative-ro': [
    'cel mai', 'cea mai', 'cei mai', 'cele mai', 'lider*', 'unic', 'unică', 'unice', 'unici',
    'excepțional*', 'perfect*', 'ideal*', 'premium', 'nr. 1', 'numărul 1', 'numărul unu', 'top',
  ],
  'superlative-ru': [
    'самый', 'самая', 'самое', 'самые', 'самого', 'самой', 'самых', 'самым', 'самыми',
    'лучш*', 'наилучш*', 'идеальн*', 'уникальн*', 'лидер*', '№ 1', 'номер один',
    'превосходн*', 'непревзойдённ*', 'top',
  ],
};
const RO_FOLD = { 'ă': '[ăa]', 'â': '[âa]', 'î': '[îi]', 'ș': '[șşs]', 'ț': '[țţt]' };
const RU_FOLD = { 'ё': '[ёе]' };
const termRe = (t, fold) => {
  const body = [...t].map((ch) => {
    if (ch === '*') return '\\p{L}*';
    if (ch === ' ') return '\\s+';
    if (fold[ch.toLowerCase()]) return fold[ch.toLowerCase()];
    return ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }).join('');
  return word(body);
};
const TERM_RES = Object.fromEntries(Object.entries(TERMS).map(([list, terms]) =>
  [list, terms.map((t) => ({ term: t, re: termRe(t, list.endsWith('-ro') ? RO_FOLD : RU_FOLD) }))]));

/* Self-test: every term matches itself (a stem also matches itself plus an
   ending), and none matches prose written for these pages that is known clean. */
const PROSE_CLEAN = {
  ro: ['Tencuielile minerale au la bază ciment sau var și sunt permeabile la vapori.', 'Faianța are o absorbție mai mare și se folosește mai ales pe pereții interiori.', 'cele neutre în bucătării', 'contează mai mult decât calitățile unui singur produs', 'Fațade'],
  ru: ['то, насколько фасад открыт дождю', 'улучшает сцепление', 'клеевым составом', 'Совместимость с остальными слоями важнее свойств одного изделия.', 'Фасады'],
};
for (const [list, entries] of Object.entries(TERM_RES)) {
  for (const e of entries) {
    const sample = e.term.replace(/\*/g, list.endsWith('-ro') ? 'ul' : 'ый');
    if (!e.re.test(sample)) fail(`self-test: ${list} term "${e.term}" does not match its own sample "${sample}"`);
    selfTested++;
    for (const s of PROSE_CLEAN[list.slice(-2)]) {
      if (e.re.test(s)) fail(`self-test: ${list} term "${e.term}" matches the clean sample "${s}"`);
      selfTested++;
    }
  }
}
if (!TERM_RES['capability-ro'][0].re.test('Te sunăm noi')) fail('self-test: capability-ro misses "Te sunăm noi"');
if (!TERM_RES['capability-ro'].some((e) => e.re.test('garantie scrisa'))) fail('self-test: capability-ro misses an undiacritised "garantie"');
selfTested += 2;

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

/* --- W17-02: the prose on each page --------------------------------------- */
const PROSE_FIELDS = ['lede', 'p1', 'p2'];
const PROSE_MIN = { lede: 60, p1: 250, p2: 250 };
const decode = (s) => s.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const proseHits = [];
const proseProblems = [];
let proseBlocks = 0;
for (const pg of pages) {
  pg.prose = {};
  for (const f of PROSE_FIELDS) {
    const found = [...pg.text.matchAll(new RegExp(`<(p)\\b[^>]*\\bdata-cat-prose="${f}"[^>]*>([\\s\\S]*?)</\\1>`, 'g'))];
    if (found.length !== 1) { proseProblems.push(`${pg.where}: ${found.length} "${f}" prose block(s), expected exactly 1`); continue; }
    const text = decode(found[0][2]);
    if (text.length < PROSE_MIN[f]) { proseProblems.push(`${pg.where}: "${f}" is ${text.length} characters, under the ${PROSE_MIN[f]} minimum`); continue; }
    const letters = (text.match(/\p{L}/gu) || []).length;
    const cyr = (text.match(/\p{Script=Cyrillic}/gu) || []).length;
    if (pg.locale === 'ro' && (cyr > 0 || !/[ăâîșțĂÂÎȘȚ]/.test(text))) {
      proseProblems.push(`${pg.where}: "${f}" is not Romanian (${cyr} Cyrillic letters, Romanian diacritics ${/[ăâîșț]/i.test(text) ? 'present' : 'absent'})`); continue;
    }
    if (pg.locale === 'ru' && cyr / letters < 0.95) {
      proseProblems.push(`${pg.where}: "${f}" is not Russian (${cyr} of ${letters} letters Cyrillic)`); continue;
    }
    pg.prose[f] = text;
    proseBlocks++;
    for (const list of [`capability-${pg.locale}`, `superlative-${pg.locale}`]) {
      for (const e of TERM_RES[list]) {
        const m = text.match(e.re);
        if (m) proseHits.push(`${pg.where} ${f}  [${list}, "${e.term}"]  ...${text.slice(Math.max(0, m.index - 40), m.index + m[0].length + 40)}...`);
      }
    }
  }
}
for (const loc of ['ro', 'ru']) {
  for (const f of PROSE_FIELDS) {
    const vals = pages.filter((p) => p.locale === loc && p.prose[f]).map((p) => p.prose[f]);
    const dup = vals.filter((v, i) => vals.indexOf(v) !== i);
    if (dup.length) proseProblems.push(`${loc}: ${dup.length} category pages share an identical "${f}"`);
  }
}

/* --- W22-01: the one permitted phrase, and only where it is permitted -------- */
/* A permitted occurrence is blanked (spaces, so every other offset stays true)
   before the patterns run. Anything the patterns then find is by definition not
   the permitted one: the same phrase as plain text on the page still fires. */
let ctaSeen = 0, ctaAllowed = 0;
const ctaProblems = [];
for (const pg of pages) {
  pg.scan = pg.text;
  for (const m of pg.text.matchAll(PRODUCT_CTA)) {
    ctaSeen++;
    const label = m[1];
    if (label.trim() !== PRICE_ON_REQUEST[pg.locale]) {
      /* Not the permitted string. Nothing is blanked, so if it is a price word at
         all the patterns below report it, and a button with ordinary wording is
         simply left alone. */
      continue;
    }
    ctaAllowed++;
    const start = m.index + m[0].indexOf(label);
    pg.scan = pg.scan.slice(0, start) + ' '.repeat(label.length) + pg.scan.slice(start + label.length);
  }
}

/* --- scan ----------------------------------------------------------------- */
const hits = [];
for (const pg of pages) {
  for (const p of PATTERNS) {
    const g = new RegExp(p.re.source, p.re.flags.includes('g') ? p.re.flags : p.re.flags + 'g');
    for (const m of pg.scan.matchAll(g)) {
      const at = Math.max(0, m.index - 50);
      hits.push(`${pg.where}  [${p.kind}, ${p.id}]  ...${pg.text.slice(at, m.index + m[0].length + 50).replace(/\s+/g, ' ')}...`);
    }
  }
}

/* --- W22-01: "and nowhere else", which only a site-wide scan can assert ------ */
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.html') ? [path.join(d, e.name)] : []);
const DIST = path.join(ROOT, 'dist');
if (!fs.existsSync(DIST)) fail('dist/ is missing; run node build.js');
const allPages = walk(DIST);
if (!allPages.length) fail('zero built pages read for the site-wide phrase scan.');
const categoryFiles = new Set(pages.map((p) => path.join(ROOT, p.where)));
const elsewhere = [];
let elsewhereRead = 0;
for (const f of allPages) {
  const text = fs.readFileSync(f, 'utf8');
  elsewhereRead++;
  const isCategory = categoryFiles.has(f);
  let scan = text;
  if (isCategory) {
    /* On a category page the permitted occurrences are blanked first, so what is
       left is an occurrence outside a product card button. */
    const pg = pages.find((p) => path.join(ROOT, p.where) === f);
    scan = pg.scan;
  }
  for (const [locale, phrase] of Object.entries(PRICE_ON_REQUEST)) {
    let i = scan.indexOf(phrase);
    while (i >= 0) {
      elsewhere.push(`${path.relative(ROOT, f)}: "${phrase}" (${locale}) ${isCategory ? 'outside a product card button' : 'on a page that is not a catalog category page'}`);
      i = scan.indexOf(phrase, i + phrase.length);
    }
  }
}

const ro = pages.filter((p) => p.locale === 'ro').length;
const ru = pages.filter((p) => p.locale === 'ru').length;
console.log(`patterns: ${PATTERNS.length}   self-test assertions: ${selfTested}`);
console.log(`scanned: ${pages.length} category pages (${ro} RO, ${ru} RU)`);
console.log(`manufacturer names, whole page: ${MANUFACTURER_NAMES.join(', ')}`);
for (const [list, terms] of Object.entries(TERMS)) console.log(`${list} terms, prose only (${terms.length}): ${terms.join(' | ')}`);
console.log(`prose: ${proseBlocks} blocks found of ${pages.length * PROSE_FIELDS.length} required (a lede and two paragraphs per page, each in its page's locale)`);
console.log(`W22-01: "${PRICE_ON_REQUEST.ro}" / "${PRICE_ON_REQUEST.ru}" permitted only as a product card button's whole text`);
console.log(`  product card buttons read: ${ctaSeen}; carrying the permitted phrase: ${ctaAllowed}; built pages scanned for the phrase anywhere else: ${elsewhereRead}`);
let failed = false;
if (hits.length) {
  console.error(`\n${hits.length} violation(s) on the catalog category pages:`);
  hits.slice(0, 20).forEach((h) => console.error('  ' + h));
  console.error('\nThese pages carry no prices, no stock, no cart, no product records and no manufacturer names.');
  failed = true;
}
if (proseProblems.length) {
  console.error(`\n${proseProblems.length} prose presence problem(s):`);
  proseProblems.slice(0, 20).forEach((h) => console.error('  ' + h));
  failed = true;
}
if (proseHits.length) {
  console.error(`\n${proseHits.length} capability or superlative term(s) in the authored prose:`);
  proseHits.slice(0, 20).forEach((h) => console.error('  ' + h));
  failed = true;
}
if (elsewhere.length) {
  console.error(`\n${elsewhere.length} occurrence(s) of a price-on-request phrase where it is not permitted:`);
  elsewhere.slice(0, 20).forEach((h) => console.error('  ' + h));
  console.error('\nW22-01 permits it as a product card button\'s whole text on a catalog category page, and nowhere else.');
  failed = true;
}
if (proseBlocks === 0) { console.error('\nzero prose blocks read, so the term scan proves nothing'); failed = true; }
if (failed) process.exit(1);
console.log(`zero price strings, zero stock strings, zero cart markup, zero product records, zero manufacturer names; the permitted phrase appears on ${elsewhereRead} built pages only where W22-01 allows it.`);
console.log(`every page has a lede and two paragraphs in its own locale; zero capability or superlative terms in ${proseBlocks} prose blocks.`);
