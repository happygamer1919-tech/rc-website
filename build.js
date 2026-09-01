#!/usr/bin/env node
// Reads src/template.html, substitutes strings from locales/*.json, writes dist.
// Fails loudly if the two locales disagree on keys, or if any placeholder survives.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const SITE = (process.env.SITE_URL || 'https://rapidconstruct.md').replace(/\/$/, '');
// Sub-path the site is served from. Empty for a domain root (Hostinger);
// '/rc-website' for GitHub Pages. Every asset and inter-locale link uses it.
const BASE = (process.env.BASE_PATH || '').replace(/\/+$/, '');
const FORM_KEY = (process.env.WEB3FORMS_KEY || '').trim();
// Single flag for the Google review mark and outbound link. The profile URL is
// not available yet, so both stay hidden until GOOGLE_REVIEWS_URL is set.
const GOOGLE_REVIEWS_URL = (process.env.GOOGLE_REVIEWS_URL || '').trim();
const FORM_ARMED = FORM_KEY.length > 0;
const FORM_ENDPOINT = FORM_ARMED ? FORM_KEY : 'WEB3FORMS_ACCESS_KEY_PLACEHOLDER';

const LOCALES = [
  { code: 'ro', file: 'locales/ro.json', out: 'dist/index.html', home: '/', alt: '/ru/' },
  { code: 'ru', file: 'locales/ru.json', out: 'dist/ru/index.html', home: '/ru/', alt: '/' },
];

// Each page template rendered once per locale. 404 goes to the site root as
// well as /ru/, because a static host serves one 404 for the whole origin.
const PRIVACY_PATH = { ro: '/confidentialitate/', ru: '/ru/konfidentsialnost/' };
const SERVICES_ROOT = { ro: '/servicii/', ru: '/ru/servicii/' };
// The city already named in meta.title, band.coverageLine and areaServed.
const PRIMARY_CITY = { ro: 'Chișinău', ru: 'Кишинёве' };

// Nine service slugs, matching the delivered SVG filenames and the order of
// services.items.N in the locale files.
const SERVICE_SLUGS = [
  'case-la-cheie', 'acoperisuri', 'fatade', 'reparatii', 'finisaje',
  'proiectare-3d', 'instalatii', 'industrial', 'terasamente',
];
// PROVISIONAL, pending a client ruling: the per-m2 figure and the early-booking
// discount are shown only on these five. See DECISIONS.md.
const PRICED_SLUGS = ['case-la-cheie', 'acoperisuri', 'fatade', 'reparatii', 'finisaje'];

const SLOT_FOR_SLUG = {
  'case-la-cheie': 'svc-case-la-cheie', 'acoperisuri': 'svc-acoperisuri', 'fatade': 'svc-fatade',
  'reparatii': 'svc-reparatii', 'finisaje': 'svc-finisaje', 'proiectare-3d': 'svc-proiectare-3d',
  'instalatii': 'svc-instalatii', 'industrial': 'svc-industrial', 'terasamente': 'svc-terasamente',
};
const PROJECTS = JSON.parse(fs.readFileSync('content/projects.json', 'utf8')).projects;

// Supplier logos. One full-colour file per brand, dropped at
// public/img/suppliers/<slug>.<ext>. There is no second greyscale asset: the
// default grey state is a CSS filter on the colour file. A brand with no file
// falls back to its name as text inside the same white tile, per brand, so the
// first logo to land renders as a logo while the rest stay text.
const SUPPLIER_LOGO_DIR = 'public/img/suppliers';
// SVG and PNG only: a logo on a white tile needs a transparent background, and
// both are sizeable at build time, which keeps width/height on every <img>.
const SUPPLIER_LOGO_EXT = ['svg', 'png'];

// Intrinsic size of a logo file, so the <img> can carry width and height and
// never shift layout. PNG: the IHDR header. SVG: viewBox, else width/height.
function logoSize(file) {
  const buf = fs.readFileSync(file);
  if (file.endsWith('.png')) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  const svg = buf.toString('utf8').slice(0, 2000);
  const box = svg.match(/viewBox\s*=\s*["']\s*[-\d.]+[,\s]+[-\d.]+[,\s]+([\d.]+)[,\s]+([\d.]+)/);
  if (box) return { w: Math.round(Number(box[1])), h: Math.round(Number(box[2])) };
  const w = svg.match(/\bwidth\s*=\s*["']([\d.]+)(?:px)?["']/);
  const h = svg.match(/\bheight\s*=\s*["']([\d.]+)(?:px)?["']/);
  return w && h ? { w: Math.round(Number(w[1])), h: Math.round(Number(h[1])) } : null;
}

function supplierLogo(slug) {
  for (const ext of SUPPLIER_LOGO_EXT) {
    const file = `${SUPPLIER_LOGO_DIR}/${slug}.${ext}`;
    if (!fs.existsSync(file)) continue;
    return { ext, file, size: logoSize(file) };
  }
  return null;
}

// The twelve tiles, then the same twelve again so the -50% keyframe lands on a
// seam. Only the first copy is reachable: the second is aria-hidden and carries
// no tabindex, so a screen reader reads twelve brands and a keyboard user gets
// twelve tab stops, not twenty-four.
function renderSupplierChips(l, base) {
  const brands = [];
  for (let i = 0; `suppliers.${i}.id` in l.strings; i++) {
    brands.push({ slug: l.strings[`suppliers.${i}.id`], name: l.strings[`suppliers.${i}.name`] });
  }
  const tile = (b, dup) => {
    const logo = supplierLogo(b.slug);
    const inner = logo
      ? `<img class="supplier__logo" src="${base}/img/suppliers/${b.slug}.${logo.ext}"` +
        ` alt="${dup ? '' : esc(b.name)}"` +
        (logo.size ? ` width="${logo.size.w}" height="${logo.size.h}"` : '') +
        ' loading="lazy" decoding="async">'
      : `<span class="supplier__label">${esc(b.name)}</span>`;
    return `        <div class="supplier"${dup ? ' aria-hidden="true"' : ' tabindex="0"'}>${inner}</div>`;
  };
  return [false, true].flatMap((dup) => brands.map((b) => tile(b, dup))).join('\n');
}

const PAGES = [
  { template: 'src/template.html', out: (l) => l.out },
  { template: 'src/404.html', out: (l) => (l.code === 'ro' ? 'dist/404.html' : 'dist/ru/404.html') },
  { template: 'src/privacy.html', out: (l) => 'dist' + PRIVACY_PATH[l.code] + 'index.html' },
];

// Keys whose value is already HTML built by this file. Everything else is
// escaped on substitution.
const RAW_KEYS = new Set([
  // demoAttr is a whole attribute, ` data-demo="..."`, not an attribute value:
  // it is either present or absent. Its inner text is escaped where it is
  // built, so what lands here is already safe. Escaping it again turned the
  // quotes into &quot; and truncated the notice at its first space.
  'demoAttr',
  'portfolioCards', 'googleLink', 'supplierChips', 'heroPanelMedia',
  ...Array.from({ length: 9 }, (_, i) => `svcMedia${i}`),
]);
// Same idea for the service-page template.
const SVC_RAW_KEYS = new Set([
  'demoAttr', 'svc.imageObjects', 'svc.answer', 'svc.table', 'svc.faqSection', 'svc.faqSchema',
  'svc.gallerySection', 'svc.priceSection', 'svc.footerLinks', 'svc.priceExtra', 'svc.media',
]);

const die = (msg) => { console.error('\nBUILD FAILED: ' + msg + '\n'); process.exit(1); };

const flatten = (obj, prefix = '') => Object.entries(obj).reduce((acc, [k, v]) => {
  if (v && typeof v === 'object' && !Array.isArray(v)) Object.assign(acc, flatten(v, prefix + k + '.'));
  else acc[prefix + k] = String(v);
  return acc;
}, {});

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// --- load and cross-check locales -------------------------------------------
const loaded = LOCALES.map((l) => ({ ...l, strings: flatten(JSON.parse(fs.readFileSync(l.file, 'utf8'))) }));
const [a, b] = loaded;
const onlyA = Object.keys(a.strings).filter((k) => !(k in b.strings));
const onlyB = Object.keys(b.strings).filter((k) => !(k in a.strings));
if (onlyA.length || onlyB.length) {
  die(`locale key sets differ.\n  only in ${a.code}: ${onlyA.join(', ') || '(none)'}\n  only in ${b.code}: ${onlyB.join(', ') || '(none)'}`);
}
const empty = loaded.flatMap((l) => Object.entries(l.strings).filter(([, v]) => !v.trim()).map(([k]) => `${l.code}:${k}`));
if (empty.length) die(`empty strings: ${empty.join(', ')}`);

// --- has the privacy page still got TODO placeholders in it? -----------------
const privacyTodos = loaded.flatMap((l) =>
  Object.entries(l.strings).filter(([k, v]) => k.startsWith('privacy.') && /TODO:/.test(v))
    .map(([k]) => `${l.code}:${k}`));
const privacyIncomplete = privacyTodos.length > 0;

const servicePages = [];

// --- render ------------------------------------------------------------------
// ---------------------------------------------------------------------------

/* W9-06. lastmod for the sitemap, from the last commit that actually touched
   each source file.

   The obvious implementation is the file's mtime, and it is wrong in CI: git
   does not record mtimes, so a fresh checkout stamps every file with the moment
   the runner cloned. Every lastmod would then read "whenever we last deployed",
   which tells a crawler nothing and is a reason to distrust the whole file.

   `git log -1 --format=%cI` gives the real date the content last changed, and
   it is identical on this machine and on the runner. mtime is kept only as the
   fallback for a checkout with no git history (a tarball download). */
const gitDate = (() => {
  const cache = new Map();
  return (file) => {
    if (cache.has(file)) return cache.get(file);
    let iso = null;
    try {
      const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', file],
        { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
      if (out) iso = out;
    } catch { /* no git, or the file is untracked */ }
    if (!iso && fs.existsSync(file)) iso = fs.statSync(file).mtime.toISOString();
    cache.set(file, iso);
    return iso;
  };
})();

// The newest of the files that decide a page's content. A page is "modified"
// when anything that renders into it is, which is what a crawler is asking.
const lastmodOf = (...files) => {
  const dates = files.filter(Boolean).map(gitDate).filter(Boolean).sort();
  return dates.length ? dates[dates.length - 1].slice(0, 10) : null;
};
const localeFiles = LOCALES.map((l) => l.file);
const HOME_SOURCES = ['src/template.html', 'content/projects.json', 'build.js', ...localeFiles];
const SVC_SOURCES = ['src/service.html', 'content/projects.json', 'build.js', ...localeFiles];
// A service page also moves when one of its own cover photographs is replaced.
const coversFor = (slug) => PROJECTS.filter((p) => p.service === slug)
  .map((p) => `public/img/${p.cover}.jpg`).filter((f) => fs.existsSync(f));

/* W9-08. The four blocks C-03 asks a service page to open and close with.

   All of it is ordinary headings and paragraphs. Nothing is chunked into
   fragments for a machine and there is no second copy of anything written for
   an answer engine: the FAQ a crawler reads through FAQPage is character for
   character the FAQ a visitor reads on the page, which is also what Google
   requires of the markup. */
const RELATED = require('./content/related-services.json');

// The direct answer. Replaces the service one-liner as the hero lede: the
// one-liner ends on a claim ("ca să nu curgă niciodată") and C-03 wants the
// page to open on what the service IS. The one-liner is not lost — it still
// carries the meta description, og:description, the homepage card and the
// Service schema.
const svcAnswer = (l, slug) => esc(l.strings[`svcContent.${slug}.answer`]);

/* A specification table, only where the page's own content already supports
   one. Six services have one; reparatii, proiectare-3d and industrial do not,
   and none was fabricated to fill the gap. It scrolls inside its own box so a
   long row can never push the page into a horizontal scroll. */
function svcTable(l, slug) {
  const cap = l.strings[`svcContent.${slug}.table.caption`];
  if (!cap) return '';
  const rows = [];
  for (let i = 0; l.strings[`svcContent.${slug}.table.rows.${i}.k`] !== undefined; i++) {
    rows.push(`        <tr><th scope="row">${esc(l.strings[`svcContent.${slug}.table.rows.${i}.k`])}</th>` +
              `<td>${esc(l.strings[`svcContent.${slug}.table.rows.${i}.v`])}</td></tr>`);
  }
  return `<section class="section section--light section--divided section--compact" id="ce-include">
  <div class="container">
    <h2 data-reveal>${esc(cap)}</h2>
    <div class="table-wrap" data-reveal>
      <table class="spec">
        <tbody>
${rows.join('\n')}
        </tbody>
      </table>
    </div>
  </div>
</section>`;
}

const svcFaqItems = (l, slug) => {
  const out = [];
  for (let i = 0; l.strings[`svcContent.${slug}.faq.${i}.q`] !== undefined; i++) {
    out.push({ q: l.strings[`svcContent.${slug}.faq.${i}.q`],
               a: l.strings[`svcContent.${slug}.faq.${i}.a`] });
  }
  return out;
};

/* The FAQ, plus the contextual links to two sibling services and the updated
   date, in one closing section.

   The date is the same content date the sitemap uses, not the wall clock at
   build time. A visible "Actualizat" that moves on every deploy, including one
   that changed nothing on this page, is worth less than no date at all, and it
   would contradict the page's own lastmod. See DECISIONS.md. */
function svcFaqSection(l, slug, updated) {
  const items = svcFaqItems(l, slug);
  if (!items.length) return '';
  const dl = items.map((it, i) => `      <div class="faq__item" data-reveal data-stagger="${Math.min(i, 6)}">
        <h3 class="faq__q">${esc(it.q)}</h3>
        <p class="faq__a">${esc(it.a)}</p>
      </div>`).join('\n');

  const pair = RELATED[slug].map((sg) => {
    const i = SERVICE_SLUGS.indexOf(sg);
    return `<a href="${BASE + SERVICES_ROOT[l.code] + sg + '/'}">${esc(l.strings[`services.items.${i}.title`])}</a>`;
  });
  const sentence = esc(l.strings[`svcContent.${slug}.related.sentence`])
    .replace('{0}', pair[0]).replace('{1}', pair[1]);

  return `<section class="section section--light section--divided section--compact" id="intrebari">
  <div class="container">
    <h2 data-reveal>${esc(l.strings['servicePage.faqH'])}</h2>
    <div class="faq" data-reveal>
${dl}
    </div>
    <p class="svc-related" data-reveal>${sentence}</p>
    <p class="svc-updated muted" data-reveal>${esc(l.strings['servicePage.updated'])}: <time datetime="${updated}">${updated}</time></p>
  </div>
</section>`;
}

// FAQPage, mirroring the visible FAQ exactly.
function svcFaqSchema(l, slug) {
  const items = svcFaqItems(l, slug);
  if (!items.length) return '';
  return '\n<script type="application/ld+json">\n' + JSON.stringify({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question', name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  }, null, 2) + '\n</script>';
}

/* W9-07. Per-page title, description and social image for a service page.

   Titles and descriptions were `<service> · Rapid Construct` and the service's
   own one-liner. Unique already, but the title said nothing about where the
   work happens and the description ran well under what a result snippet will
   show. Both are now built from strings that already exist: the service title,
   its description, and `band.coverageLine`, which is the sourced list of places
   Rapid Construct has actually built.

   Nothing is padded to hit a length. The coverage sentence is appended only
   when the result still fits 155 characters, so a service with a long
   description simply keeps its description and no more. */
const BRAND = ' · Rapid Construct';
const TITLE_MAX = 60, DESC_MAX = 155;

function serviceHeadVars(l, slug, i) {
  const title = l.strings[`services.items.${i}.title`];
  const desc = l.strings[`services.items.${i}.desc`];
  const inCity = l.code === 'ro' ? ` în ${PRIMARY_CITY.ro}` : ` в ${PRIMARY_CITY.ru}`;

  // Longest form that still fits, never a truncation mid-word.
  const candidates = [title + inCity + BRAND, title + BRAND, title];
  const metaTitle = candidates.find((c) => c.length <= TITLE_MAX) || candidates[2];

  const coverage = l.strings['band.coverageLine'];
  const withCoverage = `${desc} ${coverage}`;
  const metaDesc = withCoverage.length <= DESC_MAX ? withCoverage : desc;

  // og:image is this service's own first real cover, not the site fallback.
  // A social card wants the work, not the logo.
  const own = renderableProjects(l, slug).find((p) => coverIsRealPhoto(p.cover));
  if (!own) {
    return {
      'svc.metaTitle': metaTitle, 'svc.metaDesc': metaDesc,
      'svc.ogImage': SITE + BASE + '/img/og-image.jpg',
      'svc.ogImageW': '1200', 'svc.ogImageH': '630',
      'svc.ogImageAlt': l.strings['meta.ogImageAlt'],
      'svc.imageObjects': '',
    };
  }
  const big = `public/img/${own.cover}@2x.jpg`;
  const file = fs.existsSync(big) ? big : `public/img/${own.cover}.jpg`;
  const dim = jpegSize(file) || { w: 800, h: 600 };

  return {
    'svc.metaTitle': metaTitle,
    'svc.metaDesc': metaDesc,
    'svc.ogImage': SITE + BASE + '/img/' + path.basename(file),
    'svc.ogImageW': String(dim.w), 'svc.ogImageH': String(dim.h),
    'svc.ogImageAlt': own.title[l.code],
    'svc.imageObjects': serviceImageObjects(l, slug),
  };
}

/* Read a JPEG's real pixel size out of its SOF marker. The R-B clamp means a
   cover's @2x is whatever its source allowed, between 600 and 800 wide, so a
   hardcoded 800x600 in og:image:width would be a lie for thirteen of them. */
function jpegSize(file) {
  const b = fs.readFileSync(file);
  let o = 2;
  while (o < b.length) {
    if (b[o] !== 0xFF) { o++; continue; }
    const m = b[o + 1];
    if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC) {
      return { h: b.readUInt16BE(o + 5), w: b.readUInt16BE(o + 7) };
    }
    o += 2 + b.readUInt16BE(o + 2);
  }
  return null;
}

/* An ImageObject per project cover on this service page. Each one carries the
   project's real title and summary, so a crawler that indexes the image also
   gets what the photograph shows rather than a filename. */
function serviceImageObjects(l, slug) {
  const mine = renderableProjects(l, slug).filter((p) => coverIsRealPhoto(p.cover));
  if (!mine.length) return '';
  return ',\n  "image": [\n' + mine.map((p) => {
    const big = `public/img/${p.cover}@2x.jpg`;
    const file = fs.existsSync(big) ? big : `public/img/${p.cover}.jpg`;
    const d = jpegSize(file) || { w: 800, h: 600 };
    return '    ' + JSON.stringify({
      '@type': 'ImageObject',
      contentUrl: SITE + BASE + '/img/' + path.basename(file),
      url: SITE + BASE + SERVICES_ROOT[l.code] + slug + '/#project-' + p.id,
      name: p.title[l.code],
      description: p.summary[l.code],
      width: d.w, height: d.h,
      creator: { '@type': 'Organization', name: 'Rapid Construct' },
    });
  }).join(',\n') + '\n  ]';
}

// Service page rendering. One page per slug per locale, 18 in all.
const serviceTemplate = fs.readFileSync('src/service.html', 'utf8');

// A field carries real content only when it is neither empty nor a TODO marker.
// Stubs use "" and the seeded projects use "TODO: ...": both mean "no source
// for this yet", and neither is ever printed. Every optional field is tested on
// its own, so a project with a real location and no year prints the location.
const REAL = (v) => typeof v === 'string' && v.trim() !== '' && !v.trim().startsWith('TODO:');

// A project is renderable only when the two fields it cannot do without are
// real. The other seven are optional and drop out individually.
function renderableProjects(l, slug) {
  return PROJECTS.filter((p) => p.service === slug
    && REAL(p.title[l.code]) && REAL(p.summary[l.code]));
}

// Has a real photograph landed in this slot? gen-placeholders records the byte
// size of every file it writes; a file whose size no longer matches that ledger
// is a real photo someone dropped in. Two things read this: the indexability
// gate on the service pages, and the per-slot fallback below.
const PLACEHOLDER_LEDGER = (() => {
  const f = 'public/img/PLACEHOLDERS.json';
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {};
})();
function slotHasRealPhoto(id) {
  const file = `public/img/${id}.jpg`;
  if (!fs.existsSync(file)) return false;
  const recorded = PLACEHOLDER_LEDGER[id];
  return recorded === undefined || recorded !== fs.statSync(file).size;
}
const coverIsRealPhoto = slotHasRealPhoto;

// W6-03: hero-panel and the nine service illustrations are photo slots whose
// fallback is an SVG. The decision is per slot, never global: the first service
// to get a jpg renders a photo while the other eight still render SVGs.
const FALLBACK_SLOTS = ['hero-panel', ...SERVICE_SLUGS.map((sg) => SLOT_FOR_SLUG[sg])];
const onFallback = (id) => !slotHasRealPhoto(id);

// The hero panel box. 4:3 either way, so the box never changes size.
function heroPanelMedia(l, base) {
  const alt = esc(l.strings['hero.panelAlt']);
  if (onFallback('hero-panel')) {
    return `<div class="hero-panel-media media media--4x3">
        <img src="${base}/img/hero-panel.svg" alt="${alt}" width="800" height="600" loading="lazy" decoding="async">
      </div>`;
  }
  // A real hero photograph is the likely LCP element, so it is not lazy.
  return `<div class="hero-panel-media hero-panel-media--photo media media--4x3">
        <img src="${base}/img/hero-panel.jpg" srcset="${base}/img/hero-panel.jpg 1x, ${base}/img/hero-panel@2x.jpg 2x" alt="${alt}" width="1400" height="1050" decoding="async" fetchpriority="high">
      </div>`;
}

// One service card's media box. `variant` picks the two places it is used:
// the homepage 3x3 grid, where the card is far below the fold and lazy is
// right, and the hero of the service page itself, where the image sits beside
// the h1 and is the LCP candidate, so it must not be lazy.
function serviceMedia(l, base, i, variant) {
  const hero = variant === 'hero';
  const slot = SLOT_FOR_SLUG[SERVICE_SLUGS[i]];
  const alt = esc(l.strings[`services.items.${i}.alt`]);
  const load = hero ? '' : ' loading="lazy"';
  if (onFallback(slot)) {
    const box = hero ? 'svc-hero__art media media--4x3' : 'media media--illustration';
    return `<div class="${box}"><img src="${base}/img/services/${slot}.svg" alt="${alt}" width="400" height="300"${load} decoding="async"></div>`;
  }
  const box = hero ? 'svc-hero__art svc-hero__art--photo media media--4x3' : 'media media--4x3 media--card';
  const prio = hero ? ' fetchpriority="high"' : '';
  return `<div class="${box}"><img src="${base}/img/${slot}.jpg" srcset="${base}/img/${slot}.jpg 1x, ${base}/img/${slot}@2x.jpg 2x" alt="${alt}" width="800" height="600"${load} decoding="async"${prio}></div>`;
}

// A renderable project always points at a cover file that exists. Stub covers
// get no placeholder, so filling in a title without either dropping a photo or
// re-running gen-placeholders would ship a broken <img>. Caught here instead.
function assertCoversExist() {
  const missing = [...new Set(loaded.flatMap((l) => SERVICE_SLUGS
    .flatMap((slug) => renderableProjects(l, slug))
    .filter((p) => !fs.existsSync(`public/img/${p.cover}.jpg`))
    .map((p) => p.cover)))];
  if (missing.length) {
    die(`${missing.length} renderable project(s) have no cover file:\n` +
      missing.map((c) => `  · public/img/${c}.jpg`).join('\n') +
      '\n\n  Drop the real photo in, or run: node scripts/gen-placeholders.js');
  }
}
assertCoversExist();

function renderGallerySection(l, slug, vars) {
  const mine = renderableProjects(l, slug);
  if (!mine.length) return '';          // section, heading and all, simply absent
  const cards = mine.map((p, i) => {
    // Short facts as chips, in reading order. Each is omitted on its own.
    const chip = (v) => `<span class="review__tag">${esc(v)}</span>`;
    const meta = [];
    if (REAL(p.location[l.code])) meta.push(chip(p.location[l.code]));
    if (REAL(String(p.year))) meta.push(chip(String(p.year)));
    if (REAL(p.work_type[l.code])) meta.push(chip(p.work_type[l.code]));
    if (REAL(String(p.area_sqm))) meta.push(chip(`${String(p.area_sqm).trim()} m²`));
    if (REAL(p.duration[l.code])) meta.push(chip(p.duration[l.code]));
    // Two facts too long to be chips. Same rule: absent when empty.
    const fact = (label, v) => REAL(v)
      ? `<p class="project__fact"><span>${esc(l.strings[label])}</span> ${esc(v)}</p>` : '';
    const facts = fact('projectMeta.materials', p.main_materials[l.code])
                + fact('projectMeta.challenge', p.challenge[l.code]);
    return `      <article class="card project" id="project-${p.id}" data-reveal data-stagger="${Math.min(i, 6)}">
        <div class="media media--4x3 media--card"><img src="${vars.base}/img/${p.cover}.jpg" srcset="${vars.base}/img/${p.cover}.jpg 1x, ${vars.base}/img/${p.cover}@2x.jpg 2x" alt="${esc(p.title[l.code])}" width="400" height="300" loading="lazy" decoding="async"></div>
        <div class="card__body">
          <h3>${esc(p.title[l.code])}</h3>
          <p class="project__desc">${esc(p.summary[l.code])}</p>
          ${meta.length ? `<span class="review__tags">${meta.join('')}</span>` : ''}
          ${facts}
        </div>
      </article>`;
  }).join('\n');
  return `<section class="section section--light section--divided" id="proiecte">
  <div class="container">
    <p class="eyebrow" data-reveal>${esc(l.strings['servicePage.galleryH'])}</p>
    <h2 data-reveal>${esc(l.strings['portfolio.h2'])}</h2>
    <div class="grid grid--3" style="margin-top: 40px;">
${cards}
    </div>
  </div>
</section>`;
}

for (const l of loaded) {
  const vars = {
    ...l.strings,
    formEndpoint: FORM_ENDPOINT,
    formArmed: FORM_ARMED ? '1' : '0',
    // With no key the form must not post anywhere: it validates, then says so.
    formAction: FORM_ARMED ? 'https://api.web3forms.com/submit' : '#oferta',
    base: BASE,
    homeHref: BASE + l.home,
    hrefRo: BASE + '/',
    hrefRu: BASE + '/ru/',
    canonical: SITE + BASE + l.home,
    ogUrl: SITE + BASE + l.home,
    ogImage: SITE + BASE + '/img/og-image.jpg',
    urlRo: SITE + BASE + '/',
    urlRu: SITE + BASE + '/ru/',
    logoUrl: SITE + BASE + '/logo-full.png',
    // W9-05. The subject line is the only thing that reaches Mihai's inbox
    // before he opens the mail, so it carries BOTH facts he needs to triage:
    // the locale, as an explicit [RO]/[RU] tag rather than "whichever alphabet
    // this is", and the exact page the lead came from. The path is written
    // without a host, because SITE_URL is the GitHub Pages origin today and the
    // production domain has not landed; a path is true under either.
    // The demo notice is not merely hidden when the key lands, it is not emitted
    // at all. A disarmed build carries the attribute, an armed build does not,
    // so "the notice is gone" is true of the HTML and not only of the screen.
    demoAttr: FORM_ARMED ? '' : ` data-demo="${esc(l.strings['form.demoNotice'])}"`,
    subjectMain: `[${l.code.toUpperCase()}] ${l.strings['form.h2']} — ${l.home}`,
    subjectPopup: `[${l.code.toUpperCase()}] ${l.strings['popup.h2']} — ${l.home}`,
    privacyHref: BASE + PRIVACY_PATH[l.code],
    servicesHref: BASE + l.home + '#servicii',
    // JSON-LD `item` must be an absolute URL. servicesHref is a path, correct
    // for an <a href> and invalid inside the BreadcrumbList.
    servicesUrl: SITE + BASE + l.home + '#servicii',
    portfolioHref: BASE + l.home + '#portofoliu',
    aboutHref: BASE + l.home + '#despre',
    contactHref: BASE + l.home + '#contacte',
    ...Object.fromEntries(SERVICE_SLUGS.map((sg, i) =>
      [`svcHref${i}`, BASE + SERVICES_ROOT[l.code] + sg + '/'])),
    privacyUrlRoPath: BASE + PRIVACY_PATH.ro,
    privacyUrlRuPath: BASE + PRIVACY_PATH.ru,
    privacyCanonical: SITE + BASE + PRIVACY_PATH[l.code],
    privacyUrlRo: SITE + BASE + PRIVACY_PATH.ro,
    privacyUrlRu: SITE + BASE + PRIVACY_PATH.ru,
    // The privacy page ships with TODO legal-identity fields. Until they are
    // filled it must not be indexed and must stay out of the sitemap.
    privacyRobots: privacyIncomplete ? 'noindex, nofollow' : 'index, follow',
    // With no URL the anchor is not rendered at all. href="#" was a dead link
    // and an <a> without href fails Lighthouse's crawlable-anchors audit, so
    // the whole element is conditional.
    googleLink: GOOGLE_REVIEWS_URL
      ? `<a class="link-arrow" href="${GOOGLE_REVIEWS_URL}" target="_blank" rel="noopener noreferrer">${esc(l.strings['reviews.google'])}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>`
      : '',
    googleHidden: GOOGLE_REVIEWS_URL ? '' : 'hidden',
  };
  // Homepage portfolio: six cards straight off projects.json, each linking to
  // its project anchor on the relevant service page. Only projects with a real
  // title are shown; a TODO title must never reach the homepage.
  // W9-04 R-G. This was `.slice(0, 6)` over projects.json in file order, which
  // was six different services only by luck: five projects happened to sit in
  // five services. With thirty-four the first six are all `case-la-cheie`, and
  // the category chip under each card reads the same word six times. Take the
  // first renderable project of each service instead, in the order the services
  // grid uses, so the six cards are six services by construction.
  const featured = SERVICE_SLUGS
    .map((slug) => PROJECTS.find((p) => p.service === slug
      && REAL(p.title[l.code]) && REAL(p.summary[l.code])))
    .filter(Boolean)
    .slice(0, 6);
  vars.supplierChips = renderSupplierChips(l, BASE);
  vars.heroPanelMedia = heroPanelMedia(l, BASE);
  SERVICE_SLUGS.forEach((_, i) => { vars[`svcMedia${i}`] = serviceMedia(l, BASE, i, 'card'); });
  vars.portfolioCards = '<div class="grid grid--3" id="portfolio-grid">\n' +
    featured.map((p, i) => {
      const href = BASE + SERVICES_ROOT[l.code] + p.service + '/#project-' + p.id;
      const cat = l.strings[`services.items.${SERVICE_SLUGS.indexOf(p.service)}.title`];
      return `      <article class="card project" data-cat="${p.service}" data-reveal data-stagger="${Math.min(i, 6)}">
        <a href="${href}" class="project__link">
          <div class="media media--4x3 media--card project__media">
            <img src="${BASE}/img/${p.cover}.jpg" srcset="${BASE}/img/${p.cover}.jpg 1x, ${BASE}/img/${p.cover}@2x.jpg 2x" alt="${esc(p.title[l.code])}" width="400" height="300" loading="lazy" decoding="async">
            <span class="chip">${esc(cat)}</span>
          </div>
          <div class="card__body">
            <h3>${esc(p.title[l.code])}</h3>
            <p class="project__desc">${esc(p.summary[l.code])}</p>
          </div>
        </a>
      </article>`;
    }).join('\n') + '\n    </div>';

  // --- 18 service pages -----------------------------------------------------
  for (let i = 0; i < SERVICE_SLUGS.length; i++) {
    const slug = SERVICE_SLUGS[i];
    const out = 'dist' + SERVICES_ROOT[l.code] + slug + '/index.html';
    const svcVars = {
      ...vars,
      'svc.title': l.strings[`services.items.${i}.title`],
      'svc.desc': l.strings[`services.items.${i}.desc`],
      'svc.alt': l.strings[`services.items.${i}.alt`],
      ...serviceHeadVars(l, slug, i),
      'svc.answer': svcAnswer(l, slug),
      'svc.table': svcTable(l, slug),
      'svc.faqSection': svcFaqSection(l, slug, lastmodOf(...SVC_SOURCES, ...coversFor(slug))),
      'svc.faqSchema': svcFaqSchema(l, slug),
      'svc.subject': `[${l.code.toUpperCase()}] ${l.strings['services.items.' + i + '.title']} — ${SERVICES_ROOT[l.code]}${slug}/`,
      'svc.canonical': SITE + BASE + SERVICES_ROOT[l.code] + slug + '/',
      'svc.urlRo': SITE + BASE + SERVICES_ROOT.ro + slug + '/',
      'svc.urlRu': SITE + BASE + SERVICES_ROOT.ru + slug + '/',
      'svc.pathRo': BASE + SERVICES_ROOT.ro + slug + '/',
      'svc.pathRu': BASE + SERVICES_ROOT.ru + slug + '/',
      // priceLine2 is roofing-specific ("Rate 0% la acoperis"), so it appears
      // only on that service. The other two lines are the site-wide offer.
      'svc.priceExtra': slug === 'acoperisuri' ? ' · ' + l.strings['hero.priceLine2'] : '',
      'svc.priceSection': PRICED_SLUGS.includes(slug) ? `<section class="section section--dark section--compact">
  <div class="container">
    <p class="eyebrow" data-reveal>${esc(l.strings['servicePage.priceH'])}</p>
    <h2 data-reveal>${esc(l.strings['hero.priceTitle'])}</h2>
    <p class="lede" data-reveal style="color: #FFFFFF; opacity: 0.75;">${esc(l.strings['hero.priceLine1'])}${slug === 'acoperisuri' ? ' · ' + esc(l.strings['hero.priceLine2']) : ''}</p>
  </div>
</section>` : '',
      // Indexable only when this service has at least one renderable project
      // whose cover is a real photograph rather than a generated placeholder.
      // Same shape as the privacy-page gate: it clears itself.
      'svc.robots': renderableProjects(l, slug).some((p) => coverIsRealPhoto(p.cover))
        ? 'index, follow' : 'noindex, nofollow',
    };
    svcVars['svc.media'] = serviceMedia(l, BASE, i, 'hero');
    svcVars['svc.gallerySection'] = renderGallerySection(l, slug, vars);
    svcVars['svc.footerLinks'] = SERVICE_SLUGS.slice(0, 6).map((sg, k) =>
      `<a href="${BASE}${SERVICES_ROOT[l.code]}${sg}/">${esc(l.strings[`services.items.${k}.title`])}</a>`).join('');

    const missing = new Set();
    const html = serviceTemplate.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (_, key) => {
      if (key in svcVars) {
        // pre-rendered HTML fragments must not be escaped again
        return SVC_RAW_KEYS.has(key) ? svcVars[key] : esc(svcVars[key]);
      }
      missing.add(key); return `{{${key}}}`;
    });
    if (missing.size) die(`src/service.html references unknown keys for ${l.code}/${slug}: ${[...missing].join(', ')}`);
    if (html.includes('{{')) die(`unsubstituted placeholder survived in ${out}`);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html);
    servicePages.push({ loc: SITE + BASE + SERVICES_ROOT[l.code] + slug + '/', lang: l.code });
  }

  for (const page of PAGES) {
    const template = fs.readFileSync(page.template, 'utf8');
    const out = page.out(l);
    const missing = new Set();
    const html = template.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (_, key) => {
      if (!(key in vars)) { missing.add(key); return `{{${key}}}`; }
      return RAW_KEYS.has(key) ? vars[key] : esc(vars[key]);
    });
    if (missing.size) die(`${page.template} references unknown keys for locale ${l.code}: ${[...missing].join(', ')}`);
    if (html.includes('{{')) die(`unsubstituted placeholder survived in ${out}`);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html);
    console.log(`wrote ${out}  (${(html.length / 1024).toFixed(1)} KB)`);
  }
}

// --- static assets ------------------------------------------------------------

/* robots.txt. The six answer engines are named and allowed EXPLICITLY, not left
   to `User-agent: *`.

   `Allow: /` under `*` already permits them, so this block changes no crawler's
   behaviour. It is here as a statement of intent that survives someone later
   tightening the wildcard: blocking these is the same as deciding the site may
   not be cited in an AI answer, and that decision should have to be made on
   purpose rather than as a side effect. Google-Extended is the odd one out --
   it governs Gemini and AI Overviews grounding only, never Google Search
   ranking, so allowing it costs nothing in ordinary search either way. */
const AI_AGENTS = ['GPTBot', 'OAI-SearchBot', 'PerplexityBot', 'ClaudeBot', 'Google-Extended', 'CCBot'];
fs.writeFileSync('dist/robots.txt',
  'User-agent: *\nAllow: /\n\n' +
  '# Answer engines, allowed explicitly. Blocking these means the site cannot be\n' +
  '# cited in an AI answer; that is a decision to take on purpose, not by default.\n' +
  AI_AGENTS.map((a) => `User-agent: ${a}\nAllow: /\n`).join('\n') +
  `\nSitemap: ${SITE}${BASE}/sitemap.xml\n`);

const homeLastmod = lastmodOf(...HOME_SOURCES);
const pages = [{ loc: SITE + BASE + '/', lang: 'ro', lastmod: homeLastmod },
               { loc: SITE + BASE + '/ru/', lang: 'ru', lastmod: homeLastmod }];
const extraPages = privacyIncomplete ? [] : [
  { loc: SITE + BASE + PRIVACY_PATH.ro, lang: 'ro', lastmod: lastmodOf('src/privacy.html', ...localeFiles) },
  { loc: SITE + BASE + PRIVACY_PATH.ru, lang: 'ru', lastmod: lastmodOf('src/privacy.html', ...localeFiles) },
];
// The 18 service pages, paired ro/ru by slug so each carries both alternates.
const servicePairs = SERVICE_SLUGS
  .filter((sg) => loaded.some((l) => renderableProjects(l, sg).some((p) => coverIsRealPhoto(p.cover))))
  .map((sg) => ({
    ro: SITE + BASE + SERVICES_ROOT.ro + sg + '/',
    ru: SITE + BASE + SERVICES_ROOT.ru + sg + '/',
    lastmod: lastmodOf(...SVC_SOURCES, ...coversFor(sg)),
  }));
fs.writeFileSync('dist/sitemap.xml',
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
  pages.concat(extraPages).map((p) => '  <url>\n' +
    `    <loc>${p.loc}</loc>\n` +
    pages.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.loc}"/>\n`).join('') +
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${pages[0].loc}"/>\n` +
    (p.lastmod ? `    <lastmod>${p.lastmod}</lastmod>\n` : '') +
    '    <changefreq>monthly</changefreq>\n  </url>\n').join('') +
  servicePairs.flatMap((pair) => ['ro', 'ru'].map((lang) => '  <url>\n' +
    `    <loc>${pair[lang]}</loc>\n` +
    `    <xhtml:link rel="alternate" hreflang="ro" href="${pair.ro}"/>\n` +
    `    <xhtml:link rel="alternate" hreflang="ru" href="${pair.ru}"/>\n` +
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${pair.ro}"/>\n` +
    (pair.lastmod ? `    <lastmod>${pair.lastmod}</lastmod>\n` : '') +
    '    <changefreq>monthly</changefreq>\n  </url>\n')).join('') +
  '</urlset>\n');

/* W9-06. /llms.txt — what the site is, what it offers and where, in the flat
   markdown an answer engine can lift without parsing a page.

   Facts only, and every one of them is already on the site: the service names
   and their one-line descriptions come from the locale files, the localities
   from `band.coverageLine`, the phone and email from the footer. The service
   lines are each description's FIRST sentence, which is the factual enumeration
   of what the service covers; the second, where there is one, is a claim about
   how well it is done and has no place here. */
{
  const ro = loaded.find((l) => l.code === 'ro');
  const ru = loaded.find((l) => l.code === 'ru');
  const firstSentence = (t) => {
    const i = t.indexOf('. ');
    return (i === -1 ? t : t.slice(0, i + 1)).replace(/\.$/, '');
  };
  const lines = [
    '# Rapid Construct',
    '',
    '> Antreprenor general de construcții din Chișinău, Republica Moldova.',
    '> Construcții noi, renovări și lucrări de specialitate pentru locuințe și',
    '> spații comerciale. Site bilingv, română și rusă.',
    '',
    `Строительная компания из Кишинёва, Молдова. Сайт на румынском и русском.`,
    '',
    '## Servicii / Услуги',
    '',
  ];
  // Same gate as the sitemap: a service page with no real cover is noindex, and
  // pointing an answer engine at a page that asks not to be indexed is working
  // against yourself. The service reappears here the moment a photograph lands.
  SERVICE_SLUGS.forEach((slug, i) => {
    if (!loaded.some((l) => renderableProjects(l, slug).some((pr) => coverIsRealPhoto(pr.cover)))) return;
    const url = SITE + BASE + SERVICES_ROOT.ro + slug + '/';
    lines.push(`- [${ro.strings[`services.items.${i}.title`]}](${url}): ` +
      `${firstSentence(ro.strings[`services.items.${i}.desc`])}. ` +
      `RU: ${ru.strings[`services.items.${i}.title`]}, ` +
      `${SITE}${BASE}${SERVICES_ROOT.ru}${slug}/`);
  });
  lines.push('',
    '## Zonă deservită / Зона обслуживания', '',
    ro.strings['band.coverageLine'],
    ru.strings['band.coverageLine'], '',
    '## Contact', '',
    `- Telefon: ${ro.strings['footer.phone'] || '+373 76 837 180'}`,
    `- Email: ${ro.strings['footer.email'] || 'rapidconstructmd@gmail.com'}`,
    `- Program: ${ro.strings['form.hours']}`,
    '',
    '## Limbi / Языки', '',
    `- Română: ${SITE}${BASE}/`,
    `- Русский: ${SITE}${BASE}/ru/`,
    '');
  fs.writeFileSync('dist/llms.txt', lines.join('\n'));
}

fs.writeFileSync('dist/site.webmanifest', JSON.stringify({
  name: 'Rapid Construct',
  short_name: 'Rapid Construct',
  start_url: BASE + '/',
  scope: BASE + '/',
  display: 'standalone',
  background_color: '#FFFFFF',
  theme_color: '#F65308',
  icons: [
    { src: BASE + '/favicon-180.png', sizes: '180x180', type: 'image/png' },
    { src: BASE + '/favicon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
  ],
}, null, 2) + '\n');

// Hostinger runs Apache, which needs to be told where the 404 lives.
// GitHub Pages ignores this file and finds /404.html on its own.
fs.writeFileSync('dist/.htaccess',
  `ErrorDocument 404 ${BASE}/404.html\n` +
  'AddDefaultCharset UTF-8\n\n' +
  '<IfModule mod_expires.c>\n' +
  '  ExpiresActive On\n' +
  '  ExpiresByType image/jpeg "access plus 1 year"\n' +
  '  ExpiresByType image/png "access plus 1 year"\n' +
  '  ExpiresByType text/css "access plus 1 year"\n' +
  '  ExpiresByType application/javascript "access plus 1 year"\n' +
  '  ExpiresByType text/html "access plus 1 hour"\n' +
  '</IfModule>\n');

fs.copyFileSync('src/styles.css', 'dist/styles.css');
fs.copyFileSync('src/main.js', 'dist/main.js');
fs.cpSync('public', 'dist', { recursive: true, filter: (src) => !src.endsWith('PLACEHOLDERS.json') });
console.log('copied styles.css, main.js and public/ into dist/');
console.log('generated robots.txt, sitemap.xml, site.webmanifest');

console.log(`base path: ${BASE || '(root)'}    site: ${SITE}`);
console.log(`google reviews link: ${GOOGLE_REVIEWS_URL || 'HIDDEN (set GOOGLE_REVIEWS_URL to reveal)'}`);
{
  const indexable = SERVICE_SLUGS.filter((sg) =>
    loaded.some((l) => renderableProjects(l, sg).some((p) => coverIsRealPhoto(p.cover))));
  console.log(`service pages indexable: ${indexable.length}/9` +
    (indexable.length ? ` (${indexable.join(', ')})` : ' — all noindex until a real cover photo lands'));
}
{
  const fallback = FALLBACK_SLOTS.filter(onFallback);
  console.log(`slots on SVG fallback: ${fallback.length}/${FALLBACK_SLOTS.length}` +
    (fallback.length ? `\n  · ` + fallback.join('\n  · ') : ' — every slot has a real photo'));
}
if (privacyIncomplete) {
  console.log(`\nPRIVACY PAGE INCOMPLETE: ${privacyTodos.length} TODO field(s) still unfilled.`);
  privacyTodos.forEach((t) => console.log('  · ' + t));
  console.log('  -> the page is noindex and excluded from sitemap.xml until they are filled.');
}
console.log(FORM_ARMED
  ? '\nform: ARMED, posts to Web3Forms.'
  : '\nform: DEMO MODE. No WEB3FORMS_KEY set, so the form validates and then shows\n'
    + '      the inline notice instead of posting. Set WEB3FORMS_KEY to arm it.');
