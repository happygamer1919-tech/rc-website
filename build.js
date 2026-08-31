#!/usr/bin/env node
// Reads src/template.html, substitutes strings from locales/*.json, writes dist.
// Fails loudly if the two locales disagree on keys, or if any placeholder survives.

const fs = require('fs');
const path = require('path');

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
  'portfolioCards', 'googleLink', 'supplierChips', 'heroPanelMedia',
  ...Array.from({ length: 9 }, (_, i) => `svcMedia${i}`),
]);
// Same idea for the service-page template.
const SVC_RAW_KEYS = new Set([
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
// the homepage 3x3 grid and the hero of the service page itself.
function serviceMedia(l, base, i, variant) {
  const slot = SLOT_FOR_SLUG[SERVICE_SLUGS[i]];
  const alt = esc(l.strings[`services.items.${i}.alt`]);
  const box = variant === 'hero' ? 'svc-hero__art media media--4x3' : 'media media--illustration';
  if (onFallback(slot)) {
    return `<div class="${box}"><img src="${base}/img/services/${slot}.svg" alt="${alt}" width="400" height="300" loading="lazy" decoding="async"></div>`;
  }
  const photoBox = variant === 'hero' ? 'svc-hero__art svc-hero__art--photo media media--4x3' : 'media media--4x3 media--card';
  return `<div class="${photoBox}"><img src="${base}/img/${slot}.jpg" srcset="${base}/img/${slot}.jpg 1x, ${base}/img/${slot}@2x.jpg 2x" alt="${alt}" width="800" height="600" loading="lazy" decoding="async"></div>`;
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
        <div class="media media--3x2 media--card"><img src="${vars.base}/img/${p.cover}.jpg" alt="${esc(p.title[l.code])}" width="1400" height="933" loading="lazy" decoding="async"></div>
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
    privacyHref: BASE + PRIVACY_PATH[l.code],
    servicesHref: BASE + l.home + '#servicii',
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
  const featured = PROJECTS.filter((p) => REAL(p.title[l.code]) && REAL(p.summary[l.code])).slice(0, 6);
  vars.supplierChips = renderSupplierChips(l, BASE);
  vars.heroPanelMedia = heroPanelMedia(l, BASE);
  SERVICE_SLUGS.forEach((_, i) => { vars[`svcMedia${i}`] = serviceMedia(l, BASE, i, 'card'); });
  vars.portfolioCards = '<div class="grid grid--3" id="portfolio-grid">\n' +
    featured.map((p, i) => {
      const href = BASE + SERVICES_ROOT[l.code] + p.service + '/#project-' + p.id;
      const cat = l.strings[`services.items.${SERVICE_SLUGS.indexOf(p.service)}.title`];
      return `      <article class="card project" data-cat="${p.service}" data-reveal data-stagger="${Math.min(i, 6)}">
        <a href="${href}" class="project__link">
          <div class="media media--3x2 media--card project__media">
            <img src="${BASE}/img/${p.cover}.jpg" alt="${esc(p.title[l.code])}" width="1400" height="933" loading="lazy" decoding="async">
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
// robots + sitemap, generated so they always carry the right origin and base
fs.writeFileSync('dist/robots.txt',
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE}${BASE}/sitemap.xml\n`);

const pages = [{ loc: SITE + BASE + '/', lang: 'ro' }, { loc: SITE + BASE + '/ru/', lang: 'ru' }];
const extraPages = privacyIncomplete ? [] : [
  { loc: SITE + BASE + PRIVACY_PATH.ro, lang: 'ro' },
  { loc: SITE + BASE + PRIVACY_PATH.ru, lang: 'ru' },
];
// The 18 service pages, paired ro/ru by slug so each carries both alternates.
const servicePairs = SERVICE_SLUGS
  .filter((sg) => loaded.some((l) => renderableProjects(l, sg).some((p) => coverIsRealPhoto(p.cover))))
  .map((sg) => ({
    ro: SITE + BASE + SERVICES_ROOT.ro + sg + '/',
    ru: SITE + BASE + SERVICES_ROOT.ru + sg + '/',
  }));
fs.writeFileSync('dist/sitemap.xml',
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
  pages.concat(extraPages).map((p) => '  <url>\n' +
    `    <loc>${p.loc}</loc>\n` +
    pages.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.loc}"/>\n`).join('') +
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${pages[0].loc}"/>\n` +
    '    <changefreq>monthly</changefreq>\n  </url>\n').join('') +
  servicePairs.flatMap((pair) => ['ro', 'ru'].map((lang) => '  <url>\n' +
    `    <loc>${pair[lang]}</loc>\n` +
    `    <xhtml:link rel="alternate" hreflang="ro" href="${pair.ro}"/>\n` +
    `    <xhtml:link rel="alternate" hreflang="ru" href="${pair.ru}"/>\n` +
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${pair.ro}"/>\n` +
    '    <changefreq>monthly</changefreq>\n  </url>\n')).join('') +
  '</urlset>\n');

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
