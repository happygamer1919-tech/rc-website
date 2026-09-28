#!/usr/bin/env node
/* catalog-images, card W29-01 (wave 29), ruling R-W29-02. Run by `quality`.

   THE OWNER'S RULE: "named test catalog-images asserts every fatade-group product image src maps to a
   SOURCES.md row with the fatade licence string, and the 4 exceptions are exactly as specified". The
   licence string, byte for byte from R-W29-02: "permission Fatade 3D via owner 2026-09-28". The
   exceptions, from W29-01: "CT 80 F - Polistiren expandat": a placeholder (the neutral EPS board the
   site already showed); Colțar PVC, Plasă de armare and Membrana de DIFUZIE: "keep our current images
   exactly as they are, no change".

   WHAT IT READS (static, no browser): every built catalogue page, both locales. On each, every picture
   inside a product card whose name links to a fatade-group product page, every picture of a product
   page (the main frame and its thumbnails), and every category and sub-category tile picture. For each
   picture, every URL it names (src and each srcset entry):
   1. is a file under public/;
   2. maps to a docs/images/SOURCES.md row (the row is keyed by the picture's .jpg or .png, and names
      its .webp and -600.webp siblings) whose licence is exactly the string above, and to a
      docs/assets/PROVENANCE.md row per file;
   3. for the four exceptions, is exactly the file named below, whose bytes hash to the value recorded
      from `main` before this card (so "no change" is a measurement, not a promise), and carries no
      fatade licence row.
   It also asserts every fatade-group product was seen on a card and on its own page, in both
   locales. It fails on zero pages, zero pictures and a missing manifest. Its self-test runs first on
   synthetic data (R-AB): a control, a picture with no SOURCES row, a SOURCES row with another
   licence, and an exception whose file changed, each failing on its own message.
   Usage: node build.js && node scripts/check-catalog-images.js */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const DIST = path.resolve(process.argv[2] || path.join(ROOT, 'dist'));
const fail = (m) => { console.error(`\nCATALOG IMAGES FAILED: ${m}\n`); process.exit(1); };
const LICENCE = 'permission Fatade 3D via owner 2026-09-28';
/* The four exceptions: record id, name, the one file each shows, and its sha256 on main at 00b260a. */
const EXCEPT = {
  'f3d-3283': { name: 'CT 80 F - Polistiren expandat', file: 'public/img/catalog/CAT-0002.jpg', sha: '4e3af62dd5a78f60d99577d59e6cc61225aa44123e738bac81d6572111a88d64' },
  'f3d-2583': { name: 'Colțar PVC', file: 'public/img/catalog/CAT-0223.webp', sha: '0e90c491d93c298dd6ef289b912b7c5354600ffa8f5971a29f443662e217f0d1' },
  'f3d-2576': { name: 'Plasă de armare', file: 'public/img/catalog/CAT-0222.webp', sha: 'e64efc7729d6f8f3274ba3d27368a689215d45029be80dd9c39ca59b0e1202a1' },
  'f3d-2569': { name: 'Membrana de DIFUZIE pentru acoperișuri', file: 'public/img/catalog/CAT-0221.webp', sha: '5c96e7992c4bfd9cd49a994d9fb21ae9511a15ddc53d9e0e42fb5184e0584a32' },
};

const rows = (f) => fs.readFileSync(f, 'utf8').split('\n').filter((l) => l.startsWith('| `')).map((l) => { const c = l.split('|').map((x) => x.trim()); return { file: c[1].replace(/`/g, ''), cells: c.slice(2) }; });
/* A picture's key in SOURCES: its fallback file. `x.webp` and `x-600.webp` belong to `x.jpg` or `x.png`. */
const keyOf = (file, has) => {
  if (has(file)) return file;
  const b = file.replace(/-600\.webp$/, '').replace(/\.webp$/, '');
  for (const e of ['.jpg', '.png']) if (has(b + e)) return b + e;
  return null;
};

function check({ pics, sources, prov, exists, sha, seen, products }) {
  const problems = [];
  const src = new Map(sources.map((r) => [r.file, { licence: r.cells[2], source: r.cells[1] }]));
  const pv = new Set(prov.map((r) => r.file));
  const counts = { pictures: 0, urls: 0, fatade: 0, exceptions: 0 };
  for (const p of pics) {
    counts.pictures++;
    for (const u of p.urls) {
      counts.urls++;
      const file = 'public' + u;
      const where = `${p.page}: ${p.what} ${u}`;
      if (!exists(file)) { problems.push(`${where}: no such file under public/`); continue; }
      if (!pv.has(file)) problems.push(`${where}: no docs/assets/PROVENANCE.md row`);
      const ex = p.id && EXCEPT[p.id];
      if (ex) {
        counts.exceptions++;
        if (file !== ex.file) problems.push(`${where}: exception "${ex.name}" must show exactly ${ex.file}`);
        else if (sha(file) !== ex.sha) problems.push(`${where}: exception "${ex.name}" changed; ${ex.file} no longer hashes to its value on main`);
        const k = keyOf(file, (f) => src.has(f));
        if (k && src.get(k).licence === LICENCE) problems.push(`${where}: exception "${ex.name}" carries the fatade licence row`);
        continue;
      }
      const k = keyOf(file, (f) => src.has(f));
      if (!k) { problems.push(`${where}: no docs/images/SOURCES.md row`); continue; }
      if (src.get(k).licence !== LICENCE) { problems.push(`${where}: its SOURCES row's licence is "${src.get(k).licence}", not "${LICENCE}"`); continue; }
      if (!/fatade3d\.md\//.test(src.get(k).source)) problems.push(`${where}: its SOURCES row names no fatade3d.md source URL`);
      counts.fatade++;
    }
  }
  for (const r of products) for (const lc of ['ro', 'ru']) for (const kind of ['card', 'page']) if (!seen.has(`${r.id}|${lc}|${kind}`)) problems.push(`${r.id} "${r.name.ro}": no picture read on its ${kind === 'card' ? 'card' : 'own page'} in ${lc}`);
  return { problems, counts };
}

/* --- self-test ------------------------------------------------------------------------------ */
{
  const base = { sources: [{ file: 'public/images/catalog/t/a.jpg', cells: ['/catalog/t/', 'https://fatade3d.md/x.jpg', LICENCE, 'alt'] }], prov: [{ file: 'public/images/catalog/t/a.jpg' }, { file: 'public/images/catalog/t/a.webp' }, { file: 'public/img/catalog/CAT-0222.webp' }], exists: () => true, seen: new Set(), products: [] };
  const good = { ...base, pics: [{ page: 't', what: 'card', id: 'x', urls: ['/images/catalog/t/a.jpg', '/images/catalog/t/a.webp'] }, { page: 't', what: 'card', id: 'f3d-2576', urls: ['/img/catalog/CAT-0222.webp'] }], sha: (f) => (f.endsWith('CAT-0222.webp') ? EXCEPT['f3d-2576'].sha : 'x') };
  const run = (d) => check(d).problems;
  const c0 = run(good); if (c0.length) fail(`self-test control failed: ${c0.join(' | ')}`);
  const arms = [
    ['a picture with no SOURCES row', { ...good, pics: [{ page: 't', what: 'card', id: 'x', urls: ['/images/catalog/t/b.jpg'] }] }, /no docs\/images\/SOURCES\.md row/],
    ['a SOURCES row with another licence', { ...good, sources: [{ file: 'public/images/catalog/t/a.jpg', cells: ['/c/', 'https://fatade3d.md/x.jpg', 'Pexels License', 'alt'] }] }, /licence is "Pexels License"/],
    ['an exception whose file changed', { ...good, sha: () => 'changed' }, /changed; public\/img\/catalog\/CAT-0222\.webp/],
  ];
  for (const [arm, d, re] of arms) { const p = run(d); if (!p.some((x) => re.test(x))) fail(`self-test arm "${arm}" did not fire: ${p.join(' | ') || 'nothing'}`); }
  if (run(good).length) fail('self-test control after the arms failed');
  console.log(`self-test: control clean before and after; ${arms.length} arms each fired`);
}

/* --- the real run --------------------------------------------------------------------------- */
if (!fs.existsSync(DIST)) fail(`${DIST} is missing. Run node build.js first.`);
const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/catalog-products.json'), 'utf8')).products.filter((r) => r.source && r.source.host === 'fatade3d.md' && r.source.captured === '2026-09-28');
if (!products.length) fail('no fatade-group record carries the 2026-09-28 capture.');
const route = new Map();
for (const r of products) { route.set(`/catalog/${r.categories[0]}/${r.slug}/`, { r, lc: 'ro' }); route.set(`/ru/catalog/${r.categories[0]}/${r.slug}/`, { r, lc: 'ru' }); }
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const pages = [...walk(path.join(DIST, 'catalog')), ...walk(path.join(DIST, 'ru', 'catalog'))].filter((f) => f.endsWith('index.html'));
if (!pages.length) fail('no catalogue page is built.');
const urlsOf = (pic) => {
  const out = [];
  for (const m of pic.matchAll(/\s(?:src|srcset)="([^"]+)"/g)) for (const part of m[1].split(',')) { const u = part.trim().split(/\s+/)[0]; if (u.startsWith('/')) out.push(u); }
  return [...new Set(out)];
};
const pics = [];
const seen = new Set();
for (const f of pages) {
  const html = fs.readFileSync(f, 'utf8');
  const pageUrl = '/' + path.relative(DIST, f).split(path.sep).join('/').replace(/index\.html$/, '');
  if (/http-equiv=["']?refresh/i.test(html)) continue;
  /* Product cards that open a fatade-group product page. */
  for (const m of html.matchAll(/<article class="prod"[\s\S]*?<\/article>/g)) {
    const card = m[0];
    const link = (card.match(/class="prod__link" href="([^"]+)"/) || [])[1];
    const hit = link && route.get(link);
    if (!hit) continue;
    const pic = (card.match(/<picture class="ph[\s\S]*?<\/picture>/) || [])[0];
    if (!pic) continue;
    pics.push({ page: pageUrl, what: `card of ${hit.r.id}`, id: hit.r.id, urls: urlsOf(pic) });
    seen.add(`${hit.r.id}|${hit.lc}|card`);
  }
  /* A product page: the main frame and its thumbnails. */
  const own = route.get(pageUrl);
  if (own) {
    const main = (html.match(/<div class="pd__main"[\s\S]*?<\/picture>/) || [])[0];
    if (main) { pics.push({ page: pageUrl, what: 'main picture', id: own.r.id, urls: urlsOf(main) }); seen.add(`${own.r.id}|${own.lc}|page`); }
    for (const t of html.matchAll(/<button class="pd__thumb"[^>]*data-pd-webp="([^"]+)" data-pd-jpg="([^"]+)"[\s\S]*?<img src="([^"]+)"/g)) pics.push({ page: pageUrl, what: 'thumbnail', id: own.r.id, urls: [t[1], t[2], t[3]] });
  }
  /* Category and sub-category tiles (R-W29-02: every picture from fatade3d.md). */
  for (const m of html.matchAll(/<picture class="ph[^"]*(?:subcat__ph|cat-tile__ph)[^"]*"[^>]*data-photo-slot="(CATEG-0[1-7]|CATSUB-\d+)"[\s\S]*?<\/picture>/g)) pics.push({ page: pageUrl, what: `tile ${m[1]}`, id: null, urls: urlsOf(m[0]) });
}
const sources = rows(path.join(ROOT, 'docs/images/SOURCES.md'));
const prov = rows(path.join(ROOT, 'docs/assets/PROVENANCE.md'));
const shaCache = new Map();
const sha = (f) => { if (!shaCache.has(f)) shaCache.set(f, crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, f))).digest('hex')); return shaCache.get(f); };
const { problems, counts } = check({ pics, sources, prov, exists: (f) => fs.existsSync(path.join(ROOT, f)), sha, seen, products });
console.log(`catalogue pages read: ${pages.length}; fatade-group products: ${products.length}; pictures: ${counts.pictures}; picture URLs: ${counts.urls}, of which ${counts.fatade} on the fatade licence and ${counts.exceptions} on the four exceptions`);
if (!counts.pictures || !counts.fatade) fail('zero pictures read, so nothing was proved.');
if (problems.length) { console.error(`\nCATALOG IMAGES FAILED: ${problems.length} problem(s)`); [...new Set(problems)].slice(0, 60).forEach((p) => console.error('  ' + p)); process.exit(1); }
console.log(`every fatade-group picture maps to a SOURCES row licensed "${LICENCE}"; the four exceptions show exactly their files, unchanged since main.`);
