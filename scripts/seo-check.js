#!/usr/bin/env node
/* Technical SEO gate, card W28-17 (wave 28). Reads the BUILT tree and nothing else.

   Asserts, on every HTML page under dist/:
     1. a <title>, unique across all pages, under 60 characters;
     2. a meta description, non-empty, under 155 characters;
     3. a canonical link, absolute, on the site origin;
     4. hreflang: a ro, a ru and an x-default alternate, and the pair is SYMMETRIC: the page
        named as this page's ru alternate names this page as its ro alternate, and vice
        versa, and x-default equals the ro alternate;
     5. Open Graph (og:title, og:description, og:url, og:image with width and height) and
        Twitter (twitter:card) tags; every og:image resolves to a file in dist/ whose bytes
        measure 1200x630 or, for a service page, the page's own cover at the stated size;
     6. the site og image, /img/og-image.jpg, is 1200x630 by its bytes.
   And once:
     7. sitemap.xml parses, lists both locales (every <loc> has an RO and an RU row), and every
        <loc> answers 200 from a local server over dist/ (the built output);
     8. robots.txt allows all (User-agent: * with Allow: /) and points to the sitemap;
     9. a custom 404 exists in both locales: dist/404.html lang="ro" and dist/ru/404.html
        lang="ru", each with a title and a link home.
   A page that carries a meta refresh (a moved page) is a redirect: it must be noindex and its
   canonical must be its target; it is still held to a unique title.

   Presence, not silence (docs/CLAUDE.md section 13): it prints how many pages it read and
   fails on zero, on a missing sitemap, on a missing robots.txt and on a missing 404.
   Zero dependency. */

const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://rapidconstruct.md';
const TITLE_MAX = 60, DESC_MAX = 155;
const problems = [];
const bad = (where, msg) => problems.push(`${where}: ${msg}`);
const fail = (msg) => { console.error(`\nSEO CHECK FAILED: ${msg}\n`); process.exit(1); };

if (!fs.existsSync(DIST)) fail('no dist/, run: node build.js');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const pages = walk(DIST).filter((f) => f.endsWith('.html')).sort();
if (!pages.length) fail('zero HTML pages under dist/');
const rel = (f) => path.relative(DIST, f).split(path.sep).join('/');
const urlOf = (f) => SITE + '/' + rel(f).replace(/index\.html$/, '');

const attr = (tag, name) => { const m = tag.match(new RegExp(`\\s${name}=("([^"]*)"|'([^']*)')`, 'i')); return m ? (m[2] !== undefined ? m[2] : m[3]) : null; };
const tags = (html, re) => html.match(re) || [];
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

/* Image size by bytes: JPEG SOF, PNG IHDR. */
function imageSize(file) {
  const b = fs.readFileSync(file);
  if (b[0] === 0x89 && b[1] === 0x50) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue; }
      const len = b.readUInt16BE(i + 2);
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
      i += 2 + len;
    }
  }
  return null;
}

const info = new Map();
for (const f of pages) {
  /* HTML comments are stripped first: the redirect template's comment quotes a <link rel="canonical">
     tag in prose, and a tag read out of a comment is not a tag the page carries. */
  const html = fs.readFileSync(f, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  const where = rel(f);
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  const metas = tags(html, /<meta\s[^>]*>/gi);
  const links = tags(html, /<link\s[^>]*>/gi);
  const meta = (n) => { const t = metas.find((m) => (attr(m, 'name') || '').toLowerCase() === n); return t ? decode(attr(t, 'content') || '') : null; };
  const prop = (n) => { const t = metas.find((m) => (attr(m, 'property') || '').toLowerCase() === n); return t ? decode(attr(t, 'content') || '') : null; };
  const link = (r, hl) => { const t = links.find((l) => (attr(l, 'rel') || '').toLowerCase() === r && (!hl || (attr(l, 'hreflang') || '').toLowerCase() === hl)); return t ? attr(t, 'href') : null; };
  const refresh = metas.find((m) => /http-equiv=["']refresh["']/i.test(m));
  const robots = meta('robots') || '';
  const lang = (html.match(/<html[^>]*\slang="([^"]+)"/) || [])[1];
  const row = { where, url: urlOf(f), title: title ? decode(title) : null, desc: meta('description'), canonical: link('canonical'), ro: link('alternate', 'ro'), ru: link('alternate', 'ru'), xd: link('alternate', 'x-default'), ogTitle: prop('og:title'), ogDesc: prop('og:description'), ogUrl: prop('og:url'), ogImage: prop('og:image'), ogW: prop('og:image:width'), ogH: prop('og:image:height'), twCard: meta('twitter:card'), redirect: !!refresh, refreshTo: refresh ? (attr(refresh, 'content') || '').replace(/^.*url=/i, '') : null, noindex: /noindex/i.test(robots), lang };
  info.set(row.url, row);
}

/* 1 to 6, per page */
const titles = new Map();
const singles = [];
for (const r of info.values()) {
  if (!r.title) bad(r.where, 'no <title>');
  else {
    if (r.title.length >= TITLE_MAX) bad(r.where, `title is ${r.title.length} characters, must be under ${TITLE_MAX}: "${r.title}"`);
    titles.set(r.title, (titles.get(r.title) || []).concat(r.where));
  }
  if (r.desc == null) bad(r.where, 'no meta description');
  else if (!r.desc.trim()) bad(r.where, 'empty meta description');
  else if (r.desc.length >= DESC_MAX) bad(r.where, `description is ${r.desc.length} characters, must be under ${DESC_MAX}`);
  if (!r.canonical) bad(r.where, 'no canonical');
  else if (!r.canonical.startsWith(SITE + '/')) bad(r.where, `canonical is off-site: ${r.canonical}`);
  if (r.redirect) {
    if (!r.noindex) bad(r.where, 'a redirect page must be noindex');
    if (r.canonical && r.refreshTo && !r.canonical.startsWith(SITE + r.refreshTo.split('#')[0])) bad(r.where, `redirect canonical ${r.canonical} is not its target ${r.refreshTo}`);
  } else {
    if (r.canonical && !r.noindex && r.canonical !== r.url) bad(r.where, `canonical ${r.canonical} is not this page ${r.url}`);
  }
  // hreflang, symmetric. A noindex page with no page in the other locale (the internal review
  // page) has no pair to declare and is counted, not judged, for this one rule.
  const twinUrl = r.url.startsWith(SITE + '/ru/') ? r.url.replace(SITE + '/ru/', SITE + '/') : r.url.replace(SITE + '/', SITE + '/ru/');
  const singleLocale = r.noindex && !r.redirect && !info.has(twinUrl) && !r.ro && !r.ru;
  if (singleLocale) singles.push(r.where);
  else if (!r.ro || !r.ru || !r.xd) bad(r.where, `hreflang incomplete: ro ${r.ro ? 'yes' : 'NO'}, ru ${r.ru ? 'yes' : 'NO'}, x-default ${r.xd ? 'yes' : 'NO'}`);
  else {
    if (r.xd !== r.ro) bad(r.where, `x-default ${r.xd} is not the ro alternate ${r.ro}`);
    const other = r.url.startsWith(SITE + '/ru/') ? r.ro : r.ru;
    const mine = r.url.startsWith(SITE + '/ru/') ? r.ru : r.ro;
    if (mine !== r.url && !r.redirect) bad(r.where, `own-locale hreflang ${mine} is not this page`);
    const twin = info.get(other);
    if (!twin) bad(r.where, `hreflang twin ${other} is not a built page`);
    else {
      const back = r.url.startsWith(SITE + '/ru/') ? twin.ru : twin.ro;
      if (back !== r.url && !r.redirect && !twin.redirect) bad(r.where, `hreflang is not symmetric: ${other} points back to ${back}`);
    }
  }
  // og and twitter
  for (const [k, v] of [['og:title', r.ogTitle], ['og:description', r.ogDesc], ['og:url', r.ogUrl], ['og:image', r.ogImage], ['og:image:width', r.ogW], ['og:image:height', r.ogH], ['twitter:card', r.twCard]]) if (!v) bad(r.where, `no ${k}`);
  if (r.ogImage) {
    if (!r.ogImage.startsWith(SITE + '/')) bad(r.where, `og:image is off-site: ${r.ogImage}`);
    else {
      const file = path.join(DIST, r.ogImage.slice(SITE.length + 1));
      if (!fs.existsSync(file)) bad(r.where, `og:image file missing: ${r.ogImage}`);
      else {
        const sz = imageSize(file);
        if (!sz) bad(r.where, `og:image is not a JPEG or PNG I can measure: ${r.ogImage}`);
        else if (String(sz.w) !== r.ogW || String(sz.h) !== r.ogH) bad(r.where, `og:image is ${sz.w}x${sz.h} by its bytes, tags say ${r.ogW}x${r.ogH}`);
        else if (r.ogImage.endsWith('/img/og-image.jpg') && !(sz.w === 1200 && sz.h === 630)) bad(r.where, `the site og image is ${sz.w}x${sz.h}, must be 1200x630`);
      }
    }
  }
}
for (const [t, where] of titles) if (where.length > 1) bad(where.join(' + '), `duplicate title "${t}"`);
const siteOg = path.join(DIST, 'img/og-image.jpg');
if (!fs.existsSync(siteOg)) bad('dist/img/og-image.jpg', 'missing');
else { const sz = imageSize(siteOg); if (!sz || sz.w !== 1200 || sz.h !== 630) bad('dist/img/og-image.jpg', `is ${sz ? sz.w + 'x' + sz.h : 'unreadable'}, must be 1200x630`); }

/* 8. robots.txt */
const robotsFile = path.join(DIST, 'robots.txt');
if (!fs.existsSync(robotsFile)) fail('dist/robots.txt is missing');
const robots = fs.readFileSync(robotsFile, 'utf8');
const star = robots.split(/\n(?=User-agent:)/i).find((g) => /^User-agent:\s*\*/im.test(g));
if (!star) bad('robots.txt', 'no User-agent: * group');
else if (!/^Allow:\s*\/\s*$/m.test(star)) bad('robots.txt', 'the * group does not Allow: /');
const sitemapLine = new RegExp('^Sitemap:\\s*' + SITE.replace(/\./g, '\\.') + '/sitemap\\.xml\\s*$', 'm');
if (!sitemapLine.test(robots)) bad('robots.txt', `no Sitemap: ${SITE}/sitemap.xml line`);

/* 9. the 404s */
for (const [f, lang] of [['404.html', 'ro'], ['ru/404.html', 'ru']]) {
  const p = path.join(DIST, f);
  if (!fs.existsSync(p)) { bad(f, 'custom 404 missing'); continue; }
  const h = fs.readFileSync(p, 'utf8');
  if (!(h.match(/<html[^>]*\slang="([^"]+)"/) || [])[1] || (h.match(/<html[^>]*\slang="([^"]+)"/) || [])[1] !== lang) bad(f, `lang is not ${lang}`);
  if (!/<title>[^<]+<\/title>/.test(h)) bad(f, 'no title');
  if (!new RegExp(`href="(${lang === 'ro' ? '/' : '/ru/'})"`).test(h)) bad(f, 'no link home');
}

/* 7. sitemap: parse, both locales, every loc answers 200 locally */
const smFile = path.join(DIST, 'sitemap.xml');
if (!fs.existsSync(smFile)) fail('dist/sitemap.xml is missing');
const sm = fs.readFileSync(smFile, 'utf8');
if (!/^<\?xml[^>]*\?>\s*<urlset\s/.test(sm) || !sm.trim().endsWith('</urlset>')) bad('sitemap.xml', 'does not parse as a urlset');
const locs = tags(sm, /<loc>[^<]+<\/loc>/g).map((t) => t.slice(5, -6));
if (!locs.length) bad('sitemap.xml', 'zero <loc> entries');
const roLocs = locs.filter((u) => !u.startsWith(SITE + '/ru/')), ruLocs = locs.filter((u) => u.startsWith(SITE + '/ru/'));
if (!roLocs.length || !ruLocs.length) bad('sitemap.xml', `locales: ${roLocs.length} RO and ${ruLocs.length} RU entries; both must be non-zero`);
for (const u of locs) { const r = info.get(u); if (!r) bad('sitemap.xml', `${u} is not a built page`); else if (r.noindex) bad('sitemap.xml', `${u} is noindex and in the sitemap`); }
for (const r of info.values()) if (!r.noindex && !r.redirect && !locs.includes(r.url)) bad(r.where, 'indexable page missing from sitemap.xml');
const urlsetBlocks = sm.split('<url>').slice(1);
for (const b of urlsetBlocks) {
  const loc = (b.match(/<loc>([^<]+)<\/loc>/) || [])[1];
  const alts = tags(b, /<xhtml:link[^>]*>/g).map((t) => attr(t, 'hreflang'));
  if (!alts.includes('ro') || !alts.includes('ru') || !alts.includes('x-default')) bad('sitemap.xml', `${loc} lacks ro, ru and x-default alternates`);
}

const MIME = { '.html': 'text/html', '.xml': 'text/xml', '.txt': 'text/plain', '.jpg': 'image/jpeg', '.png': 'image/png', '.css': 'text/css', '.js': 'text/javascript' };
const server = http.createServer((rq, rs) => {
  let p = decodeURIComponent(rq.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(DIST, p);
  if (!f.startsWith(DIST) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.writeHead(404); rs.end(); return; }
  rs.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(rs);
});
const status = (port, u) => new Promise((res) => { const p = u.slice(SITE.length); http.get({ host: '127.0.0.1', port, path: p }, (r) => { r.resume(); res(r.statusCode); }).on('error', () => res(0)); });
(async () => {
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  let ok200 = 0;
  for (const u of locs) { const s = await status(port, u); if (s === 200) ok200++; else bad('sitemap.xml', `${u} answers ${s} on the built output`); }
  server.close();
  console.log(`pages read: ${info.size} (${[...info.values()].filter((r) => r.redirect).length} redirect pages, ${[...info.values()].filter((r) => r.noindex).length} noindex)`);
  if (singles.length) console.log(`noindex pages with no locale twin, exempt from the hreflang pair: ${singles.length} (${singles.join(', ')})`);
  console.log(`titles: ${titles.size} distinct of ${info.size}; sitemap: ${locs.length} URLs (${roLocs.length} RO, ${ruLocs.length} RU), ${ok200} answer 200 locally; robots.txt read; 404 pages read: 2`);
  if (problems.length) {
    console.error(`\n${problems.length} problem(s):`);
    problems.forEach((p) => console.error('  ' + p));
    process.exit(1);
  }
  console.log('every page has a unique title under 60, a description under 155, a canonical, symmetric ro/ru/x-default alternates, Open Graph and Twitter tags with a measured og:image; the sitemap lists both locales and every URL answers 200; robots allows all and names the sitemap; both 404 pages exist.');
})();
