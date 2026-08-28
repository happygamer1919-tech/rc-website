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
const FORM_ARMED = FORM_KEY.length > 0;
const FORM_ENDPOINT = FORM_ARMED ? FORM_KEY : 'WEB3FORMS_ACCESS_KEY_PLACEHOLDER';

const LOCALES = [
  { code: 'ro', file: 'locales/ro.json', out: 'dist/index.html', home: '/', alt: '/ru/' },
  { code: 'ru', file: 'locales/ru.json', out: 'dist/ru/index.html', home: '/ru/', alt: '/' },
];

// Each page template rendered once per locale. 404 goes to the site root as
// well as /ru/, because a static host serves one 404 for the whole origin.
const PAGES = [
  { template: 'src/template.html', out: (l) => l.out },
  { template: 'src/404.html', out: (l) => (l.code === 'ro' ? 'dist/404.html' : 'dist/ru/404.html') },
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

// --- render ------------------------------------------------------------------
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
  };
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
fs.writeFileSync('dist/sitemap.xml',
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
  pages.map((p) => '  <url>\n' +
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

fs.copyFileSync('src/styles.css', 'dist/styles.css');
fs.copyFileSync('src/main.js', 'dist/main.js');
fs.cpSync('public', 'dist', { recursive: true, filter: (src) => !src.endsWith('PLACEHOLDERS.json') });
console.log('copied styles.css, main.js and public/ into dist/');
console.log('generated robots.txt, sitemap.xml, site.webmanifest');

console.log(`base path: ${BASE || '(root)'}    site: ${SITE}`);
console.log(FORM_ARMED
  ? '\nform: ARMED, posts to Web3Forms.'
  : '\nform: DEMO MODE. No WEB3FORMS_KEY set, so the form validates and then shows\n'
    + '      the inline notice instead of posting. Set WEB3FORMS_KEY to arm it.');
