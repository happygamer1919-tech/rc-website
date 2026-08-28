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
const SLOT_FOR_SLUG = {
  'case-la-cheie': 'svc-case-la-cheie', 'acoperisuri': 'svc-acoperisuri', 'fatade': 'svc-fatade',
  'reparatii': 'svc-reparatii', 'finisaje': 'svc-finisaje', 'proiectare-3d': 'svc-proiectare-3d',
  'instalatii': 'svc-instalatii', 'industrial': 'svc-industrial', 'terasamente': 'svc-terasamente',
};
const PROJECTS = JSON.parse(fs.readFileSync('content/projects.json', 'utf8')).projects;

const PAGES = [
  { template: 'src/template.html', out: (l) => l.out },
  { template: 'src/404.html', out: (l) => (l.code === 'ro' ? 'dist/404.html' : 'dist/ru/404.html') },
  { template: 'src/privacy.html', out: (l) => 'dist' + PRIVACY_PATH[l.code] + 'index.html' },
];

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

function renderProjects(l, slug, vars) {
  const mine = PROJECTS.filter((p) => p.service === slug);
  if (!mine.length) return `<p class="lede" data-reveal>${esc(l.strings['servicePage.galleryEmpty'])}</p>`;
  const cards = mine.map((p, i) => {
    const title = p.title[l.code];
    const summary = p.summary[l.code];
    const loc = p.location[l.code];
    // A TODO field is rendered as a visible marker, never silently filled.
    const meta = [];
    if (!loc.startsWith('TODO:')) meta.push(`<span class="review__tag">${esc(loc)}</span>`);
    if (!String(p.year).startsWith('TODO:')) meta.push(`<span class="review__tag">${esc(String(p.year))}</span>`);
    return `      <article class="card project" id="project-${p.id}" data-reveal data-stagger="${Math.min(i, 6)}">
        <div class="media media--3x2 media--card"><img src="${vars.base}/img/${p.cover}.jpg" alt="${esc(title)}" width="1400" height="933" loading="lazy" decoding="async"></div>
        <div class="card__body">
          <h3>${esc(title)}</h3>
          <p class="project__desc">${esc(summary)}</p>
          ${meta.length ? `<span class="review__tags">${meta.join('')}</span>` : ''}
        </div>
      </article>`;
  }).join('\n');
  return `<div class="grid grid--3" style="margin-top: 40px;">\n${cards}\n    </div>`;
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
    privacyUrlRoPath: BASE + PRIVACY_PATH.ro,
    privacyUrlRuPath: BASE + PRIVACY_PATH.ru,
    privacyCanonical: SITE + BASE + PRIVACY_PATH[l.code],
    privacyUrlRo: SITE + BASE + PRIVACY_PATH.ro,
    privacyUrlRu: SITE + BASE + PRIVACY_PATH.ru,
    // The privacy page ships with TODO legal-identity fields. Until they are
    // filled it must not be indexed and must stay out of the sitemap.
    privacyRobots: privacyIncomplete ? 'noindex, nofollow' : 'index, follow',
    googleReviewsUrl: GOOGLE_REVIEWS_URL || '#',
    googleHidden: GOOGLE_REVIEWS_URL ? '' : 'hidden',
  };
  // --- 18 service pages -----------------------------------------------------
  for (let i = 0; i < SERVICE_SLUGS.length; i++) {
    const slug = SERVICE_SLUGS[i];
    const out = 'dist' + SERVICES_ROOT[l.code] + slug + '/index.html';
    const svcVars = {
      ...vars,
      'svc.title': l.strings[`services.items.${i}.title`],
      'svc.desc': l.strings[`services.items.${i}.desc`],
      'svc.alt': l.strings[`services.items.${i}.alt`],
      'svc.slot': SLOT_FOR_SLUG[slug],
      'svc.canonical': SITE + BASE + SERVICES_ROOT[l.code] + slug + '/',
      'svc.urlRo': SITE + BASE + SERVICES_ROOT.ro + slug + '/',
      'svc.urlRu': SITE + BASE + SERVICES_ROOT.ru + slug + '/',
      'svc.pathRo': BASE + SERVICES_ROOT.ro + slug + '/',
      'svc.pathRu': BASE + SERVICES_ROOT.ru + slug + '/',
      // priceLine2 is roofing-specific ("Rate 0% la acoperis"), so it appears
      // only on that service. The other two lines are the site-wide offer.
      'svc.priceExtra': slug === 'acoperisuri' ? ' · ' + l.strings['hero.priceLine2'] : '',
    };
    svcVars['svc.projects'] = renderProjects(l, slug, vars);
    svcVars['svc.footerLinks'] = SERVICE_SLUGS.slice(0, 6).map((sg, k) =>
      `<a href="${BASE}${SERVICES_ROOT[l.code]}${sg}/">${esc(l.strings[`services.items.${k}.title`])}</a>`).join('');

    const missing = new Set();
    const html = serviceTemplate.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (_, key) => {
      if (key in svcVars) {
        // pre-rendered HTML fragments must not be escaped again
        return (key === 'svc.projects' || key === 'svc.footerLinks' || key === 'svc.priceExtra')
          ? svcVars[key] : esc(svcVars[key]);
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
      return esc(vars[key]);
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
fs.writeFileSync('dist/sitemap.xml',
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
  pages.concat(extraPages).map((p) => '  <url>\n' +
    `    <loc>${p.loc}</loc>\n` +
    pages.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.loc}"/>\n`).join('') +
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${pages[0].loc}"/>\n` +
    '    <changefreq>monthly</changefreq>\n  </url>\n').join('') +
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
if (privacyIncomplete) {
  console.log(`\nPRIVACY PAGE INCOMPLETE: ${privacyTodos.length} TODO field(s) still unfilled.`);
  privacyTodos.forEach((t) => console.log('  · ' + t));
  console.log('  -> the page is noindex and excluded from sitemap.xml until they are filled.');
}
console.log(FORM_ARMED
  ? '\nform: ARMED, posts to Web3Forms.'
  : '\nform: DEMO MODE. No WEB3FORMS_KEY set, so the form validates and then shows\n'
    + '      the inline notice instead of posting. Set WEB3FORMS_KEY to arm it.');
