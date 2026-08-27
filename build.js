#!/usr/bin/env node
// Reads src/template.html, substitutes strings from locales/*.json, writes dist.
// Fails loudly if the two locales disagree on keys, or if any placeholder survives.

const fs = require('fs');
const path = require('path');

const SITE = process.env.SITE_URL || 'https://rapidconstruct.md';
const FORM_KEY = (process.env.WEB3FORMS_KEY || '').trim();
const FORM_ARMED = FORM_KEY.length > 0;
const FORM_ENDPOINT = FORM_ARMED ? FORM_KEY : 'WEB3FORMS_ACCESS_KEY_PLACEHOLDER';

const LOCALES = [
  { code: 'ro', file: 'locales/ro.json', out: 'dist/index.html', home: '/', alt: '/ru/' },
  { code: 'ru', file: 'locales/ru.json', out: 'dist/ru/index.html', home: '/ru/', alt: '/' },
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
const template = fs.readFileSync('src/template.html', 'utf8');

for (const l of loaded) {
  const vars = {
    ...l.strings,
    formEndpoint: FORM_ENDPOINT,
    formArmed: FORM_ARMED ? '1' : '0',
    // With no key the form must not post anywhere: it validates, then says so.
    formAction: FORM_ARMED ? 'https://api.web3forms.com/submit' : '#oferta',
    homeHref: l.home,
    altHref: l.alt,
    canonical: SITE + l.home,
    ogUrl: SITE + l.home,
    ogImage: SITE + '/img/og-image.jpg',
    urlRo: SITE + '/',
    urlRu: SITE + '/ru/',
  };
  const missing = new Set();
  const html = template.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (_, key) => {
    if (!(key in vars)) { missing.add(key); return `{{${key}}}`; }
    return esc(vars[key]);
  });
  if (missing.size) die(`template references unknown keys for locale ${l.code}: ${[...missing].join(', ')}`);
  if (html.includes('{{')) die(`unsubstituted placeholder survived in ${l.out}`);
  fs.mkdirSync(path.dirname(l.out), { recursive: true });
  fs.writeFileSync(l.out, html);
  console.log(`wrote ${l.out}  (${(html.length / 1024).toFixed(1)} KB)`);
}

// --- static assets ------------------------------------------------------------
fs.copyFileSync('src/styles.css', 'dist/styles.css');
fs.copyFileSync('src/main.js', 'dist/main.js');
fs.cpSync('public', 'dist', { recursive: true, filter: (src) => !src.endsWith('PLACEHOLDERS.json') });
console.log('copied styles.css, main.js and public/ into dist/');

console.log(FORM_ARMED
  ? '\nform: ARMED, posts to Web3Forms.'
  : '\nform: DEMO MODE. No WEB3FORMS_KEY set, so the form validates and then shows\n'
    + '      the inline notice instead of posting. Set WEB3FORMS_KEY to arm it.');
