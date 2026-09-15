#!/usr/bin/env node
/* Origin gate, W14-17 (RC-117). rapidconstruct.md is the site's origin.

   Fails when the retired origin, rapidconstructmd.com, appears anywhere in the
   built site, and when the real origin is missing from any place the card names:
   canonical, hreflang, og:url, og:image, sitemap.xml, robots.txt, JSON-LD url and
   sameAs, and CNAME.

   Presence, not silence (docs/CLAUDE.md section 13): absence of the old host is
   not enough, because a build that emitted no canonical at all would also
   contain zero of it. Every named place must positively carry the new origin,
   dist/ must hold the pages it expects, and the matcher proves itself first.

   Usage:  node build.js && node scripts/check-origin.js
   No dependencies. */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const ORIGIN = 'https://rapidconstruct.md';
const RETIRED = 'rapidconstructmd.com';
const fail = (msg) => { console.error(`\nORIGIN CHECK FAILED: ${msg}\n`); process.exit(1); };

/* The retired host must be caught however it is written. It must not be caught
   inside the e-mail address rapidconstructmd@gmail.com, which is a mailbox, not a
   host, and is correct. */
const RETIRED_RE = /rapidconstructmd\.com/i;
for (const [s, want] of [['https://rapidconstructmd.com/', true], ['//RAPIDCONSTRUCTMD.COM/ru/', true], ['rapidconstructmd@gmail.com', false], ['https://rapidconstruct.md/', false]]) {
  if (RETIRED_RE.test(s) !== want) fail(`matcher self-test on "${s}"`);
}

if (!fs.existsSync(DIST)) fail('no dist/, run: node build.js');
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(html|xml|txt|json|webmanifest|css|js)$/.test(e.name) || e.name === 'CNAME') files.push(p);
  }
})(DIST);
const rel = (p) => path.relative(ROOT, p);
const read = (p) => fs.readFileSync(p, 'utf8');
const html = files.filter((f) => f.endsWith('.html') && !rel(f).includes('/review/') && !/404\.html$/.test(f));
if (html.length < 20) fail(`dist/ holds only ${html.length} indexable pages; the build is incomplete`);

const problems = [];
for (const f of files) {
  const t = read(f);
  const m = t.match(new RegExp(RETIRED_RE.source, 'gi'));
  if (m) problems.push(`${rel(f)} carries ${RETIRED} ${m.length} time(s)`);
}

const pick = (t, re) => { const m = t.match(re); return m ? m[1] : null; };
const counts = { canonical: 0, hreflang: 0, ogUrl: 0, ogImage: 0, jsonLdUrl: 0, sameAs: 0 };
for (const f of html) {
  const t = read(f);
  if (/<meta name="robots" content="noindex/.test(t) && !/rel="canonical"/.test(t)) continue;
  const canonical = pick(t, /<link rel="canonical" href="([^"]+)"/);
  if (canonical !== null) { counts.canonical++; if (!canonical.startsWith(ORIGIN + '/')) problems.push(`${rel(f)} canonical is ${canonical}`); }
  for (const m of t.matchAll(/<link rel="alternate" hreflang="[^"]+" href="([^"]+)"/g)) {
    counts.hreflang++; if (!m[1].startsWith(ORIGIN + '/')) problems.push(`${rel(f)} hreflang is ${m[1]}`);
  }
  const ogUrl = pick(t, /<meta property="og:url" content="([^"]+)"/);
  if (ogUrl !== null) { counts.ogUrl++; if (!ogUrl.startsWith(ORIGIN + '/')) problems.push(`${rel(f)} og:url is ${ogUrl}`); }
  const ogImage = pick(t, /<meta property="og:image" content="([^"]+)"/);
  if (ogImage !== null) { counts.ogImage++; if (!ogImage.startsWith(ORIGIN + '/')) problems.push(`${rel(f)} og:image is ${ogImage}`); }
  for (const m of t.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let j; try { j = JSON.parse(m[1]); } catch { problems.push(`${rel(f)} has JSON-LD that does not parse`); continue; }
    if (typeof j.url === 'string') { counts.jsonLdUrl++; if (!j.url.startsWith(ORIGIN + '/')) problems.push(`${rel(f)} JSON-LD url is ${j.url}`); }
    if (Array.isArray(j.sameAs)) { counts.sameAs++; if (j.sameAs.some((u) => RETIRED_RE.test(u))) problems.push(`${rel(f)} JSON-LD sameAs names ${RETIRED}`); }
  }
}
for (const [k, v] of Object.entries(counts)) if (v === 0) problems.push(`no ${k} found in any page, so nothing was checked for it`);

const sitemap = path.join(DIST, 'sitemap.xml');
if (!fs.existsSync(sitemap)) problems.push('dist/sitemap.xml is missing');
else {
  const locs = [...read(sitemap).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (locs.length === 0) problems.push('sitemap.xml has no <loc>');
  locs.filter((u) => !u.startsWith(ORIGIN + '/')).forEach((u) => problems.push(`sitemap.xml lists ${u}`));
}
const robots = path.join(DIST, 'robots.txt');
if (!fs.existsSync(robots)) problems.push('dist/robots.txt is missing');
else if (!read(robots).includes(`Sitemap: ${ORIGIN}/sitemap.xml`)) problems.push(`robots.txt does not point at ${ORIGIN}/sitemap.xml`);
const cname = path.join(DIST, 'CNAME');
if (!fs.existsSync(cname)) problems.push('dist/CNAME is missing');
else if (read(cname).trim() !== 'rapidconstruct.md') problems.push(`dist/CNAME is "${read(cname).trim()}"`);

console.log(`scanned ${files.length} built files, ${html.length} pages   origin ${ORIGIN}`);
console.log(`checked: ${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(', ')}, sitemap, robots.txt, CNAME`);
if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  problems.slice(0, 40).forEach((p) => console.error('  ' + p));
  process.exit(1);
}
console.log(`zero ${RETIRED} in the built site; every named place carries ${ORIGIN}.`);
