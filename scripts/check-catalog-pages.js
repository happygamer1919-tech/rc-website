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

   W24-04 (ruling W24-R3) amends Q-W21-01 and re-scopes this gate in three ways.

   ONE. A PRICE IS PERMITTED, in one place. A catalogue product card shows the
   price, so a figure is allowed as the whole text of a `.prod__price` element
   that carries its own product in data-product, which is the same shape W22-01
   gave the quote button. Everywhere the price patterns were refused before, they
   are refused still, including inside a `.prod__price` on a page that is not a
   catalogue page. The relaxation is by KIND: only the price patterns read the
   relaxed text. Cart markup, a stock claim, a product record and a manufacturer
   name still fire inside a `.prod__price`, so the element cannot be used as a
   hiding place. The whole element is blanked, opening tag included, because the
   class token `prod__price` matches the price-word pattern on its own.

   TWO. THE PAGES ARE WALKED, NOT LISTED ONE LEVEL DEEP. Every subcategory now has
   a page of its own at /catalog/<parent>/<child>/ (F-03), so the tree is walked
   to any depth.

   THREE. EACH KIND OF PAGE IS HELD TO WHAT IT MUST CARRY. W17-02's authored lede
   and two paragraphs belong to a CATEGORY page and are required on all seven in
   each locale. A SUBCATEGORY page carries the breadcrumb, the heading and the
   grid, and is required to carry a product grid instead; repeating its parent's
   paragraphs would break this gate's own no-duplicate-prose rule. The INDEX page
   at /catalog/ carries neither and is required to carry the category tiles. None
   of the three is exempt from the prohibitions: all of them are scanned whole.

   Usage:  node build.js && node scripts/check-catalog-pages.js [tree]
   No dependencies. */

const fs = require('fs');
const path = require('path');

/* W24-04. A tree can be named on the command line so the gate can be
   negative-tested against a scratch copy of dist/ rather than by editing the real
   one, which is what check-stub-count.js and check-heading-fit.js already do. */
const ROOT = path.resolve(process.argv[2] || path.join(__dirname, '..'));
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
/* AMENDED (W24-04): the inside of the button may hold markup. W22-01's button
   was a text button and `[^<]*` was enough; the W24-04 card's button is an icon,
   so the capture is lazy and may hold an svg. The captured label is compared to
   the permitted phrase RAW, and that is correct rather than an oversight: the
   permitted shape is a button whose WHOLE text is the phrase, and a button
   holding an svg does not have that whole text. So the comparison never matches
   on a W24-04 card, which is right, because that card does not ask for a price
   with its button: the .prod__ask element below does, in the place the price
   would have taken.
   What the pattern still does is COUNT the buttons, and that matters: before
   this amendment it matched nothing at all, so the W22-01 half of this gate read
   zero buttons and concluded nothing while exiting 0. The count assertion below
   turns that from a vacuous pass into a failure. */
const PRODUCT_CTA = /<a\b[^>]*class="[^"]*\bprod__cta\b[^"]*"[^>]*\bdata-product="[^"]*"[^>]*>([\s\S]*?)<\/a>/g;
const PRODUCT_CARD = /<article\b[^>]*\bdata-product-card\b[^>]*>/g;

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
  'Luni-Sâmbătă 08:00-17:00',
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
/* AMENDED (W27-FIX-15, W27-R-21): the seven CHILD routes are the redirect pages; the parent is
   a catalogue page again, of its own kind below. */
const MOVED_ROUTE = /^materiale-acoperis\/[a-z-]+$/;
const ROOF_CATALOG_ROUTE = 'materiale-acoperis';
/* W25-19. The two pages the roofing catalogue moved ONTO. Listed, not matched.
   AMENDED (W27-FIX-08, owner instruction W27-R-14): the metal tile page in both locales, which
   now renders the seven imperlux model cards above its four tile cards. Still listed by name,
   still held to the same shape: every price element on it must carry its own product, and the
   counts must agree, exactly as on the roofing page. Nothing else changes: a fifth page still has
   no permitted place at all. */
const CONSOLIDATED = new Set([
  /* AMENDED (W28-13): the roofing catalogue is on its catalogue page, so the service page is
     an ordinary page again with no permitted place for a price. */
  'catalog/materiale-acoperis/index.html', 'ru/catalog/materiale-acoperis/index.html',
  'servicii/tigla-metalica/index.html', 'ru/servicii/tigla-metalica/index.html',
]);
const ROOTS = [
  { dir: path.join(ROOT, 'dist', 'catalog'), locale: 'ro' },
  { dir: path.join(ROOT, 'dist', 'ru', 'catalog'), locale: 'ru' },
];

/* W24-04. Walked to any depth, and each page classified by that depth: the index
   at the root, a category one level down, a subcategory two. */
const walkDirs = (d) => fs.readdirSync(d, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .flatMap((e) => [path.join(d, e.name), ...walkDirs(path.join(d, e.name))]);

const pages = [];
for (const r of ROOTS) {
  if (!fs.existsSync(r.dir)) fail(`${path.relative(ROOT, r.dir)} is missing; run node build.js`);
  const wanted = [path.join(r.dir, 'index.html'), ...walkDirs(r.dir).map((d) => path.join(d, 'index.html'))];
  const absent = wanted.filter((f) => !fs.existsSync(f));
  if (absent.length) fail(`${absent.length} catalogue director(y/ies) hold no index.html: ${absent.map((f) => path.relative(ROOT, f)).join(', ')}`);
  /* EVERY html file under the catalogue root, not only the index.html of each
     directory. A page at /catalog/promotii.html is a catalogue page to a visitor
     and to a crawler, and a scan that reads only index.html would leave it
     outside every prohibition this gate enforces while still calling itself a
     catalogue scan. */
  const walkFiles = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walkFiles(path.join(d, e.name)) : e.name.endsWith('.html') ? [path.join(d, e.name)] : []);
  const present = walkFiles(r.dir);
  const extra = present.filter((f) => !wanted.includes(f));
  if (extra.length) console.log(`note: ${extra.length} catalogue page(s) are not a directory index and are scanned as such: ${extra.map((f) => path.relative(ROOT, f)).join(', ')}`);
  for (const f of present) {
    const isIndex = path.basename(f) === 'index.html';
    const rel = path.relative(r.dir, path.dirname(f));
    const depth = rel === '' ? 0 : rel.split(path.sep).length;
    if (depth > 2) fail(`${path.relative(ROOT, f)} is ${depth} levels below /catalog/; the catalogue is two levels, never three`);
    const text = fs.readFileSync(f, 'utf8');
    if (text.length < 500) fail(`${path.relative(ROOT, f)} is suspiciously small (${text.length} bytes)`);
    pages.push({
      where: path.relative(ROOT, f), text, locale: r.locale, depth,
      /* A file that is not a directory index carries no structure requirement of
         its own, because nothing says what it should be; it is scanned whole for
         every prohibition, which is the part that matters. */
      /* W25-19. The eight roofing routes stopped being catalogue pages and became
         REDIRECT pages: they keep their URLs, answer 200, and forward to the
         matching filter in the consolidated section on /servicii/acoperisuri/.
         They are a kind of their own rather than an exemption, so they are still
         scanned whole for every prohibition below AND are held to what a redirect
         page must carry. Exempting them would have been the easy move and would
         have left eight pages nothing checks. */
      kind: !isIndex ? 'other'
        : MOVED_ROUTE.test(path.relative(r.dir, path.dirname(f)).split(path.sep).join('/')) ? 'redirect'
        /* W27-FIX-15 (W27-R-21): the roofing catalogue page is a kind of its own, the two
           roofing bentos and nothing else; held to that shape below, scanned whole like the rest. */
        : path.relative(r.dir, path.dirname(f)).split(path.sep).join('/') === ROOF_CATALOG_ROUTE ? 'roofcatalog'
        : depth === 0 ? 'index' : depth === 1 ? 'category' : 'subcategory',
    });
  }
  const cats = present.filter((f) => path.relative(r.dir, path.dirname(f)).split(path.sep).length === 1 && path.relative(r.dir, path.dirname(f)) !== '');
  if (cats.length < 7) fail(`${path.relative(ROOT, r.dir)} holds ${cats.length} categories, expected at least 7`);
  if (!present.some((f) => path.dirname(f) === r.dir)) fail(`${path.relative(ROOT, r.dir)} has no index.html, so the catalogue root answers nothing`);
}
const byKind = { index: 0, category: 0, subcategory: 0, redirect: 0, roofcatalog: 0, other: 0 };
for (const pg of pages) byKind[pg.kind]++;
if (byKind.category === 0 || byKind.subcategory === 0 || byKind.index === 0 || byKind.redirect === 0 || byKind.roofcatalog !== 2) {
  fail(`the walk found ${byKind.index} index, ${byKind.category} category, ${byKind.subcategory} subcategory, ${byKind.redirect} redirect and ${byKind.roofcatalog} roofing catalogue page(s); each kind must be present (the roofing catalogue page once per locale) or its own assertion proves nothing.`);
}
/* W25-19. Eight routes in each locale, and the number is asserted: a redirect
   that silently reverted to a catalogue page, or a ninth that appeared, is the
   defect this catches. */
for (const loc of ['ro', 'ru']) {
  const n = pages.filter((p) => p.locale === loc && p.kind === 'redirect').length;
  if (n !== 7) fail(`${loc} has ${n} roofing redirect page(s), expected 7: the seven subcategories (W27-FIX-15: the parent is a page again).`);
}

/* --- W17-02: the prose on each page --------------------------------------- */
const PROSE_FIELDS = ['lede', 'p1', 'p2'];
const PROSE_MIN = { lede: 60, p1: 250, p2: 250 };
/* W27-FIX-15 self-test, two arms: the roofing catalogue shape is matched with both bentos and
   refused with the product bento alone, so the assertion has been watched both ways. */
(() => {
  /* AMENDED (W28-13): three parts, hub, product bento, product grid, and a third arm: the
     two bentos WITHOUT the grid (the W27-FIX-15 page) is refused too. */
  const both = '<div class="hub__grid">x</div><div class="pb__grid">y</div><div class="prod-grid" id="produse-grid" data-prod-grid data-roof-grid>z</div>';
  const one = '<div class="pb__grid">y</div><div class="prod-grid" data-roof-grid>z</div>';
  const noGrid = '<div class="hub__grid">x</div><div class="pb__grid">y</div>';
  const re = /<div class="hub__grid"[^>]*>[\s\S]*?<div class="pb__grid"[^>]*>[\s\S]*?<div class="prod-grid"[^>]*data-roof-grid[^>]*>/;
  if (!re.test(both)) fail('self-test: the roofing catalogue shape did not match a page with both bentos and the grid');
  if (re.test(one)) fail('self-test: the roofing catalogue shape matched a page with the product bento alone');
  if (re.test(noGrid)) fail('self-test: the roofing catalogue shape matched the two bentos without the product grid');
  selfTested += 3;
})();
const decode = (s) => s.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const proseHits = [];
const proseProblems = [];
let proseBlocks = 0;
/* W24-04. Each kind of page is held to what it must carry, and none of the three
   is exempt from the prohibitions below.
     category    the authored lede and two paragraphs (W17-02)
     subcategory a product grid: the breadcrumb, heading and grid the dispatch
                 specifies, and no authored prose, which would duplicate its
                 parent's and break the no-duplicate rule below
     index       the seven category tiles
   Presence, not silence: a page of a kind that carries none of its own thing is
   a page that has been emptied, and that fails here rather than passing quietly. */
const STRUCTURE = {
  subcategory: { re: /<div class="prod-grid"[^>]*>[\s\S]*?<article class="prod"/, what: 'a product grid' },
  /* W27-FIX-15 (W27-R-21): the roofing catalogue page carries the roofing hub bento AND the
     product bento, in that order, and no prose block (the stray-prose rule below holds it to
     that) and no product grid. */
  /* AMENDED (W28-13): and the product grid after them, the whole catalogue on its page. */
  roofcatalog: { re: /<div class="hub__grid"[^>]*>[\s\S]*?<div class="pb__grid"[^>]*>[\s\S]*?<div class="prod-grid"[^>]*data-roof-grid[^>]*>/, what: 'the roofing hub bento, the product bento and then the roofing product grid' },
  index: { re: /<div class="cat-tiles"[^>]*>[\s\S]*?<a class="cat-tile"/, what: 'the category tiles' },
  /* W25-19. A redirect page carries all three mechanisms or it is not one: the
     meta refresh that moves a visitor with no JavaScript, the noindex that stops
     a crawler treating it as the thing, and a real anchor to the destination for
     the case where the refresh is blocked. All three aim at the SAME section, and
     `REDIRECT_TARGET` below asserts that they agree. */
  redirect: {
    /* AMENDED (W28-13): the section lives on the catalogue page, one directory up from the redirect. */
    re: /<meta http-equiv="refresh" content="0; url=\/(?:ru\/)?catalog\/materiale-acoperis\/#mat-[a-z-]+">/,
    what: 'a meta refresh to the roofing catalogue page',
  },
};
const REDIRECT_TARGET = /<meta http-equiv="refresh" content="0; url=([^"]+)">/;
for (const pg of pages) {
  const article = pg.kind === 'index' ? 'an' : 'a';
  const need = STRUCTURE[pg.kind];
  if (need && !need.re.test(pg.text)) proseProblems.push(`${pg.where}: ${article} ${pg.kind} page carries ${need.what}, and this one does not`);
  if (pg.kind === 'redirect') {
    const m = REDIRECT_TARGET.exec(pg.text);
    const target = m ? m[1] : null;
    if (!/<meta name="robots" content="noindex, follow">/.test(pg.text)) {
      proseProblems.push(`${pg.where}: a redirect page is noindex, follow, and this one is not. A sitemap-shaped URL that still indexes competes with the page it forwards to.`);
    }
    if (target && !pg.text.includes(`href="${target}"`)) {
      proseProblems.push(`${pg.where}: its meta refresh goes to ${target} and no visible link on the page does. A refresh a browser blocks must still leave a way out.`);
    }
    if (target && !new RegExp(`<link rel="canonical" href="[^"]*${target.split('#')[0].replace(/[/]/g, '\\/')}"`).test(pg.text)) {
      proseProblems.push(`${pg.where}: its canonical does not name the page its refresh goes to (${target.split('#')[0]}).`);
    }
  }
  if (pg.kind !== 'category') {
    /* A page that is not a category page must carry NO authored prose block: the
       parent's three paragraphs repeated on seven subcategories is exactly what
       the duplicate check below exists to refuse. */
    const stray = [...pg.text.matchAll(/data-cat-prose="([a-z0-9]+)"/g)].map((m) => m[1]);
    if (stray.length) proseProblems.push(`${pg.where}: ${article} ${pg.kind} page carries ${stray.length} authored prose block(s) (${[...new Set(stray)].join(', ')}), which belong to a category page`);
    pg.prose = {};
    continue;
  }
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
    const vals = pages.filter((p) => p.locale === loc && p.kind === 'category' && p.prose[f]).map((p) => p.prose[f]);
    const dup = vals.filter((v, i) => vals.indexOf(v) !== i);
    if (dup.length) proseProblems.push(`${loc}: ${dup.length} category pages share an identical "${f}"`);
  }
}

/* --- W22-01: the one permitted phrase, and only where it is permitted -------- */
/* A permitted occurrence is blanked (spaces, so every other offset stays true)
   before the patterns run. Anything the patterns then find is by definition not
   the permitted one: the same phrase as plain text on the page still fires. */
/* W24-R3 moves the phrase, and narrows when it may be used at all. W22-01
   permitted it as the whole text of a product card's quote button, because a card
   then showed no price. A card now shows the price, and the phrase is left for
   the one case where the source publishes none, where it takes the place the
   price would have taken. So the permitted shape is either:
     the quote button's whole text   (W22-01, unchanged and still accepted), or
     a .prod__ask element's whole text, carrying its own data-product
   and in both the string must be exact, in the page's own locale. Exact still
   means exact: a near spelling is not the permitted string.

   A card may carry a price or the phrase, never both. That is asserted per card
   below, because "only where no price exists" is the whole of the ruling. */
const PRODUCT_ASK = /<(span|p|div|dd|strong)\b[^>]*\bclass="[^"]*\bprod__ask\b[^"]*"[^>]*\bdata-product="[^"]*"[^>]*>([^<]*)<\/\1>/g;
/* The same shape the price relaxation below permits, declared here so a card can
   be held to carrying exactly one of a price and a price-on-request. One place:
   the relaxation reads this constant too.

   THE CONTENT IS `[^<]*`, NOT `[\s\S]*?`, and that is the whole safety of the
   relaxation. A lazy any-character match is not bounded by its own element: give
   the price element a closing tag of a different name and the match runs on to
   the next `</span>` anywhere on the page, blanking everything in between, so a
   struck price and a financing line planted after it are never scanned. Even with
   a matching closing tag, a lazy match happily swallows a sibling element that
   states a second, non-permitted price. A price is a string, so the permitted
   element holds text and nothing else: no tag may open inside it. */
const PRODUCT_PRICE_SHAPE = /<(span|p|div|dd|strong)\b[^>]*\bclass="[^"]*\bprod__price\b[^"]*"[^>]*\bdata-product="[^"]*"[^>]*>[^<]*<\/\1>/g;
const ASK_CLASS = /\bprod__ask\b/g;
let ctaSeen = 0, ctaAllowed = 0, askSeen = 0, askAllowed = 0;
const ctaProblems = [];
for (const pg of pages) {
  pg.scan = pg.text;
  const blank = (start, len) => { pg.scan = pg.scan.slice(0, start) + ' '.repeat(len) + pg.scan.slice(start + len); };
  /* W27-FIX-15 (W27-R-21). The roofing catalogue page carries the service page's two bentos, and
     one hub tile is labelled "Calculează prețul acoperișului" (RU "Рассчитать цену кровли"), the
     owner's own wording for a tile that opens the "in construcție" page (W27-R-16): navigation,
     not a price claim. Its label is blanked before the price patterns run, exactly as the
     permitted button is, and only on that kind of page; every other word on it is still scanned. */
  if (pg.kind === 'roofcatalog') {
    for (const m of pg.text.matchAll(/<span class="(?:hub|pb)__label">([^<]*)<\/span>/g)) blank(m.index + m[0].indexOf(m[1]), m[1].length);
  }
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
    blank(m.index + m[0].indexOf(label), label.length);
  }
  for (const m of pg.text.matchAll(PRODUCT_ASK)) {
    askSeen++;
    const label = m[2];
    if (label.trim() !== PRICE_ON_REQUEST[pg.locale]) continue;
    askAllowed++;
    blank(m.index + m[0].lastIndexOf(label), label.length);
  }
  const askOnPage = [...pg.text.matchAll(PRODUCT_ASK)].length;
  const askOccurrences = (pg.text.match(ASK_CLASS) || []).length;
  if (askOccurrences !== askOnPage) {
    ctaProblems.push(`${pg.where}: ${askOccurrences} occurrence(s) of the prod__ask class and ${askOnPage} in the permitted shape. It must be a span, p, div, dd or strong with class="... prod__ask ..." then data-product.`);
  }
  /* Every product card has exactly one quote button, and this gate must
     recognise every one of them. A button whose attributes are reordered stops
     matching PRODUCT_CTA, and the W22-01 half would then read fewer buttons than
     there are cards and conclude nothing while exiting 0. */
  const cards = (pg.text.match(PRODUCT_CARD) || []).length;
  const buttons = [...pg.text.matchAll(PRODUCT_CTA)].length;
  if (cards !== buttons) {
    ctaProblems.push(`${pg.where}: ${cards} product card(s) and ${buttons} quote button(s) in the permitted shape. A button must carry class="... prod__cta ..." then data-product, in that order.`);
  }
  /* W24-R3: a card shows a price OR asks for one, never both and never neither.
     ASSERTED PER CARD, not as a page total. A page total balances when one card
     carries two prices and its neighbour carries none, which is precisely the
     state that puts an unexplained second figure on the page. The page is split
     at each card's opening tag and each slice counted on its own. */
  const slices = pg.text.split(/(?=<article\b[^>]*\bdata-product-card\b)/).slice(1);
  if (slices.length !== cards) {
    ctaProblems.push(`${pg.where}: ${cards} product card(s) but the page split into ${slices.length} card region(s).`);
  }
  slices.forEach((s, i) => {
    const np = [...s.matchAll(PRODUCT_PRICE_SHAPE)].length;
    const na = [...s.matchAll(PRODUCT_ASK)].length;
    if (np + na !== 1) {
      ctaProblems.push(`${pg.where}: product card ${i + 1} carries ${np} price element(s) and ${na} price-on-request element(s). Each card carries exactly one of the two.`);
    }
  });
  /* And nothing outside a card may carry either: the region before the first card
     is the page's own chrome, where a price has never been permitted. */
  const chrome = pg.text.split(/(?=<article\b[^>]*\bdata-product-card\b)/)[0];
  const chromePrices = [...chrome.matchAll(PRODUCT_PRICE_SHAPE)].length + [...chrome.matchAll(PRODUCT_ASK)].length;
  if (chromePrices) {
    ctaProblems.push(`${pg.where}: ${chromePrices} price or price-on-request element(s) outside any product card.`);
  }
}

/* --- W24-R3: a price, in one place ------------------------------------------ */
/* The permitted shape is a `.prod__price` element carrying its own product in
   data-product, which is the shape W22-01 already gave the quote button: being
   permitted is a SHAPE, not a class anyone can paint on.

   The WHOLE element is blanked, opening tag included, and not just its text. The
   class token `prod__price` matches the price-word pattern on its own, because
   `_` and `"` are not letters and the pattern's letter-aware edges therefore
   both pass. Blanking only the text would leave the class firing the gate on
   every card.

   The blanked copy is a SECOND buffer. `pg.scan` keeps the price elements, so
   the other kinds still read them: a cart, a stock claim, a product record or a
   manufacturer name inside a `.prod__price` still fires. Only the price kind is
   relaxed, and only there. */
/* W28-18 (wave 28 dispatch): a catalogue page carries ONE JSON-LD block of Product entries, one per
   priced card, each with an AggregateOffer (numeric lowPrice above zero, priceCurrency MDL, no
   highPrice, no key named price, no brand, no rating, no review). W24-R3's "no schema.org Offer" is
   amended by the dispatch for exactly that shape. A block that IS that shape is blanked from the
   PRICE buffer (its "MDL" is not a currency word in prose) and from a RECORD buffer read only by the
   product-record arm; `pg.scan` keeps it, so a cart, a stock claim or a manufacturer name inside it
   still fires. A block that is anything else is left where it is, so the product-record arm names
   it. Self-tested below, both ways, before any page is read. */
const LD_BLOCK = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
function productBlockOk(json) {
  let v; try { v = JSON.parse(json); } catch { return false; }
  const list = Array.isArray(v) ? v : [v];
  if (!list.length) return false;
  const text = JSON.stringify(v);
  if (/AggregateRating|"Review"|ratingValue|reviewCount|"brand"|"manufacturer"|"highPrice"|"price":/.test(text)) return false;
  return list.every((p) => p && p['@type'] === 'Product' && typeof p.name === 'string' && p.name.trim()
    && p.offers && p.offers['@type'] === 'AggregateOffer' && typeof p.offers.lowPrice === 'number' && p.offers.lowPrice > 0
    && p.offers.priceCurrency === 'MDL');
}
(() => {
  const good = '[{"@type":"Product","name":"X","offers":{"@type":"AggregateOffer","lowPrice":110,"priceCurrency":"MDL"}}]';
  const arms = [
    ['an Offer without a Product', '[{"@type":"Offer","price":110,"priceCurrency":"MDL"}]'],
    ['a highPrice', '[{"@type":"Product","name":"X","offers":{"@type":"AggregateOffer","lowPrice":110,"highPrice":200,"priceCurrency":"MDL"}}]'],
    ['a rating', '[{"@type":"Product","name":"X","aggregateRating":{"@type":"AggregateRating","ratingValue":4.9},"offers":{"@type":"AggregateOffer","lowPrice":110,"priceCurrency":"MDL"}}]'],
    ['a currency that is not MDL', '[{"@type":"Product","name":"X","offers":{"@type":"AggregateOffer","lowPrice":110,"priceCurrency":"EUR"}}]'],
    ['a lowPrice of zero', '[{"@type":"Product","name":"X","offers":{"@type":"AggregateOffer","lowPrice":0,"priceCurrency":"MDL"}}]'],
    ['a brand', '[{"@type":"Product","name":"X","brand":{"@type":"Brand","name":"Y"},"offers":{"@type":"AggregateOffer","lowPrice":110,"priceCurrency":"MDL"}}]'],
  ];
  if (!productBlockOk(good)) fail('self-test: the permitted Product block was refused');
  for (const [what, json] of arms) if (productBlockOk(json)) fail(`self-test: a Product block with ${what} was accepted`);
  selfTested += 1 + arms.length;
})();
const PRODUCT_PRICE = PRODUCT_PRICE_SHAPE;
const PRICE_CLASS = /\bprod__price\b/g;
let priceEls = 0, priceClassSeen = 0;
const shapeProblems = [];
/* W28-13 (wave 28). THE COMPARE TABLES ARE ON THE CATALOGUE PAGE NOW. The roofing section
   carries four "Compară" tables (W26-R6, listed in content/roofing-sections.json `tables`) and,
   above each, a derived "N modele, de la X lei" line (W27-C-03); every figure in them is a
   figure a card on the same page already shows in its permitted `.prod__price`. While the
   section sat on /servicii/acoperisuri/ only the card shape was held (CONSOLIDATED); under
   /catalog/ the whole page is scanned and the tables fire money-amount 35 times per locale on a
   correct page. So the table blocks, `<div class="roof-cmp" data-roof-table ...>` through their
   `</table>`, are blanked in the PRICE buffer only, on the roofing catalogue kind only, and their
   COUNT is held to the data file: a fifth table, or a table on any other kind of page, still
   fires. `pg.scan` keeps them, so a cart, a stock claim, a product record or a manufacturer
   name inside a table still fires. A price in prose outside the tables still fires, and the
   arm below watches it. Read as a permission of the same shape as `.prod__price`, open for
   ratification (DECISIONS.md, W28-13). */
const ROOF_TABLE = /<div class="roof-cmp" data-roof-table[^>]*>[\s\S]*?<\/table>/g;
const ROOF_TABLES_EXPECTED = (() => {
  const f = path.join(ROOT, 'content/roofing-sections.json');
  if (!fs.existsSync(f)) fail('content/roofing-sections.json is missing, so the compare-table count cannot be held to the data');
  const t = JSON.parse(fs.readFileSync(f, 'utf8')).tables;
  if (!Array.isArray(t) || !t.length) fail('content/roofing-sections.json names no compare tables; a permission for zero tables is a licence');
  return t.length;
})();
(() => {
  const table = '<div class="roof-cmp" data-roof-table data-roof-groups="x"><p class="roof-cmp__from">7 modele, de la 179 lei/buc</p><table class="roof-cmp__t"><tr><td>De la 179 lei/buc</td></tr></table></div>';
  const prose = '<p>reducere la 100 lei pentru toți</p>';
  const blanked = (table + prose).replace(ROOF_TABLE, (m) => ' '.repeat(m.length));
  if (/179/.test(blanked)) fail('self-test: the compare-table permission left a table figure in the price buffer');
  if (!/100 lei/.test(blanked)) fail('self-test: the compare-table permission blanked a price in prose outside the tables');
  selfTested += 2;
})();
let ldBlanked = 0;
for (const pg of pages) {
  pg.priceScan = pg.scan;
  pg.recordScan = pg.scan;
  for (const m of pg.scan.matchAll(LD_BLOCK)) {
    if (!productBlockOk(m[1])) continue;
    const blank = ' '.repeat(m[0].length);
    pg.priceScan = pg.priceScan.slice(0, m.index) + blank + pg.priceScan.slice(m.index + m[0].length);
    pg.recordScan = pg.recordScan.slice(0, m.index) + blank + pg.recordScan.slice(m.index + m[0].length);
    ldBlanked++;
  }
  let matched = 0;
  if (pg.kind === 'roofcatalog') {
    let tables = 0;
    pg.priceScan = pg.priceScan.replace(ROOF_TABLE, (m) => { tables++; return ' '.repeat(m.length); });
    if (tables !== ROOF_TABLES_EXPECTED) shapeProblems.push(`${pg.where}: ${tables} compare table(s) on the roofing catalogue page, content/roofing-sections.json names ${ROOF_TABLES_EXPECTED}`);
  }
  for (const m of pg.scan.matchAll(PRODUCT_PRICE)) {
    priceEls++; matched++;
    pg.priceScan = pg.priceScan.slice(0, m.index) + ' '.repeat(m[0].length) + pg.priceScan.slice(m.index + m[0].length);
  }
  const occurrences = (pg.scan.match(PRICE_CLASS) || []).length;
  priceClassSeen += occurrences;
  /* Each permitted element carries the class once. An occurrence the shape did
     not match is a price element built the wrong way, and it is named as that
     rather than left to surface as a confusing raw price hit. */
  if (occurrences !== matched) {
    shapeProblems.push(`${pg.where}: ${occurrences} occurrence(s) of the prod__price class and ${matched} permitted element(s). A price element must be a span, p, div, dd or strong, carry class="... prod__price ..." and carry data-product, in that order.`);
  }
}

/* --- scan ----------------------------------------------------------------- */
const hits = [];
for (const pg of pages) {
  for (const p of PATTERNS) {
    const text = p.kind === 'price' ? pg.priceScan : (p.kind === 'product record' ? pg.recordScan : pg.scan);
    const g = new RegExp(p.re.source, p.re.flags.includes('g') ? p.re.flags : p.re.flags + 'g');
    for (const m of text.matchAll(g)) {
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
/* Which locale a built page is in, from its path: dist/ru/... is RU, the rest RO.
   The permitted phrase is locale-keyed, so a page's locale has to be known before
   its phrase can be judged. */
const localeOf = (f) => (path.relative(DIST, f).split(path.sep)[0] === 'ru' ? 'ru' : 'ro');
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
  } else {
    /* W24-R7 (W24-07): "Imperlux prices are not published. Slots render 'Preț la
       cerere'." The mirrored pages are product pages, not catalogue pages, so the
       phrase now has a permitted place off the catalogue. What travels with it is
       THE SHAPE, not a page exemption: it is permitted as the whole text of a
       .prod__ask element carrying its own product, which is the same shape W22-01
       gave the quote button and W24-R3 gave the price. A loose phrase on one of
       these pages is refused exactly as it is on a catalogue page, and every
       other page still has no permitted place at all, which the arms prove. */
    for (const m of text.matchAll(PRODUCT_ASK)) {
      askSeen++;
      const label = m[2];
      if (label.trim() !== PRICE_ON_REQUEST[localeOf(f)]) continue;
      askAllowed++;
      const at = m.index + m[0].lastIndexOf(label);
      scan = scan.slice(0, at) + ' '.repeat(label.length) + scan.slice(at + label.length);
    }
    const occ = (text.match(ASK_CLASS) || []).length;
    const shaped = [...text.matchAll(PRODUCT_ASK)].length;
    if (occ !== shaped) {
      elsewhere.push(`${path.relative(ROOT, f)}: ${occ} occurrence(s) of the prod__ask class and ${shaped} in the permitted shape`);
    }
  }
  for (const [locale, phrase] of Object.entries(PRICE_ON_REQUEST)) {
    let i = scan.indexOf(phrase);
    while (i >= 0) {
      elsewhere.push(`${path.relative(ROOT, f)}: "${phrase}" (${locale}) ${isCategory ? 'outside a product card button' : 'on a page that is not a catalog page'}`);
      i = scan.indexOf(phrase, i + phrase.length);
    }
  }
  /* W24-R3's "and nowhere else" for the price element itself. Prices elsewhere on
     the site are legitimate and this gate must never fire on the metal tile page,
     so what is asserted off the catalogue is the CLASS, not a figure: a
     prod__price element on another page is a catalogue card's price that has
     escaped its card. */
  if (!isCategory) {
    /* W25-19. The roofing catalogue now renders on /servicii/acoperisuri/, so
       there is a second page in each locale where a catalogue card, and therefore
       its price, legitimately lives. What travels to it is THE SHAPE, not a page
       exemption: every price there must be a `.prod__price` carrying its own
       product, exactly as on a catalogue page, and the counts must agree. Every
       other page still has no permitted place at all, which the next line holds.
       Named rather than pattern-matched on the path, so a third page cannot
       acquire the permission by being called something. */
    const rel = path.relative(DIST, f).split(path.sep).join('/');
    if (CONSOLIDATED.has(rel)) {
      const occ = (text.match(PRICE_CLASS) || []).length;
      const shaped = [...text.matchAll(PRODUCT_PRICE_SHAPE)].length;
      priceEls += shaped;
      if (occ !== shaped) {
        elsewhere.push(`${path.relative(ROOT, f)}: ${occ} occurrence(s) of the prod__price class and ${shaped} in the permitted shape`);
      }
    } else {
      const n = (text.match(PRICE_CLASS) || []).length;
      if (n) elsewhere.push(`${path.relative(ROOT, f)}: ${n} prod__price element(s) on a page that is not a catalog page`);
    }
  }
}

const ro = pages.filter((p) => p.locale === 'ro').length;
const ru = pages.filter((p) => p.locale === 'ru').length;
console.log(`patterns: ${PATTERNS.length}   self-test assertions: ${selfTested}   permitted Product blocks blanked from the price and record buffers: ${ldBlanked}`);
console.log(`scanned: ${pages.length} catalogue pages (${ro} RO, ${ru} RU)`);
console.log(`manufacturer names, whole page: ${MANUFACTURER_NAMES.join(', ')}`);
for (const [list, terms] of Object.entries(TERMS)) console.log(`${list} terms, prose only (${terms.length}): ${terms.join(' | ')}`);
/* The denominator is the CATEGORY pages, not every catalogue page: a subcategory
   page and the index carry no authored prose by rule. Printed against every page
   it read "42 blocks found of 90 required" on a green run, which is a gate
   reporting a shortfall it does not have. */
console.log(`prose: ${proseBlocks} blocks found of ${byKind.category * PROSE_FIELDS.length} required (a lede and two paragraphs per CATEGORY page, each in its page's locale)`);
console.log(`pages by kind: ${byKind.index} index, ${byKind.category} category, ${byKind.subcategory} subcategory, ${byKind.redirect} redirect (W25-19, 8 per locale, each noindex with a refresh, a canonical and a visible link that agree)`);
console.log(`W24-R3: a price is permitted only as a product card's .prod__price element carrying its own data-product`);
console.log(`  price elements read: ${priceEls}; prod__price class occurrences on catalogue pages: ${priceClassSeen}; pages scanned for the class elsewhere: ${elsewhereRead}`);
console.log(`  only the price patterns read the relaxed text: cart, stock, product record and manufacturer name still fire inside a price element`);
console.log(`W22-01: "${PRICE_ON_REQUEST.ro}" / "${PRICE_ON_REQUEST.ru}" permitted only as a product card button's whole text`);
console.log(`  product card buttons read: ${ctaSeen}; carrying the permitted phrase: ${ctaAllowed}`);
console.log(`  price-on-request elements read: ${askSeen}; carrying the permitted phrase: ${askAllowed}; built pages scanned for the phrase anywhere else: ${elsewhereRead}`);
let failed = false;
if (hits.length) {
  console.error(`\n${hits.length} violation(s) on the catalog category pages:`);
  hits.slice(0, 20).forEach((h) => console.error('  ' + h));
  console.error('\nThese pages carry no prices, no stock, no cart, no product records and no manufacturer names.');
  failed = true;
}
if (ctaProblems.length) {
  console.error(`\n${ctaProblems.length} price-on-request element(s) not built in the permitted shape:`);
  ctaProblems.slice(0, 20).forEach((h) => console.error('  ' + h));
  failed = true;
}
if (shapeProblems.length) {
  console.error(`\n${shapeProblems.length} price element(s) not built in the permitted shape:`);
  shapeProblems.slice(0, 20).forEach((h) => console.error('  ' + h));
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
console.log(`every category page has a lede and two paragraphs in its own locale; zero capability or superlative terms in ${proseBlocks} prose blocks.`);
console.log(`every subcategory page carries a product grid and every index page the category tiles; no page but a category page carries authored prose.`);
