#!/usr/bin/env node
/* Image sources gate, the named test "image-sources". Gate 32, run by `quality`.
   Written at W28-15 (wave 28) and REVERSED at W28-23 under ruling R-W28-06.

   THE OWNER'S RULE, verbatim (second wave 28 dispatch): "Extend scripts/image-sources test:
   every image under the fatade group and every gallery image has a manifest row whose
   licence is in the allowed set, and no fatade product image source host is fatade3d.md."
   The allowed set: "Pexels, Unsplash, Pixabay, Wikimedia Commons with CC0 or public domain,
   and Google Images only with usage-rights filter Creative Commons and the licence verified
   on the landing page. No attribution-required licences, no editorial-only."

   WHAT THE FATADE GROUP IS. The catalogue has no category or field named fatade; the one
   definition the data carries is `source.host === 'fatade3d.md'` in content/catalog-products.json
   (223 records). Their pictures come from two kinds of origin now: the STOCK set above, installed
   by W28-23 through scripts/intake-stock.js with a row in docs/images/SOURCES.md (the owner's
   manifest) and a row in docs/assets/PROVENANCE.md (R-W's); and the manufacturer's own packshot
   or an owner-picked picture under W25-R1 and W25-R20, which the owner has not ruled on
   (Q-W28-05) and which this gate COUNTS and prints, never licences as stock and never refuses.

   WHAT IT HOLDS.
   1. No fatade-group picture's provenance row names a fatade3d.md host, page or image. The
      W28-15 version of this gate asserted the opposite; R-W28-06 reversed it.
   2. Every fatade-group picture on the stock origin ("stock library" in its licence cell) has a
      docs/images/SOURCES.md row for its file whose licence is one of the allowed strings, and
      its source URLs are on that site's own hosts.
   3. Every gallery photograph with origin "stock" in content/galleries.json: its full and thumb
      files exist, both have a PROVENANCE row on the stock origin, and the full file has a
      SOURCES row with an allowed licence.
   4. Every SOURCES row names a file that exists and a licence in the allowed set; a SOURCES row
      for a file with no PROVENANCE row is a defect (the two manifests are written together).
   5. Every fatade-group record has a filled ledger slot with a provenance row and its file on
      disk; a declared reuse (W25-R17, R-W28-06) inherits its origin's row.

   Presence, not silence (docs/CLAUDE.md section 13): it prints how many records, rows and files
   it read, fails on zero fatade records, zero stock rows and a missing SOURCES manifest, and runs
   a six-arm self-test (two green) on synthetic rows before the real run. Zero dependency. */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const fail = (m) => { console.error(`\nIMAGE SOURCES FAILED: ${m}\n`); process.exit(1); };

const HOST = 'fatade3d.md';
const STOCK = 'stock library';
/* Q-W28-06 (W28-23): a fatade-group slot with no mark-free photograph in the allowed set waits as a
   placeholder; it is named here with its question so the exception is visible and counted, never silent. */
const PLACEHOLDER_WAITING = {}; /* CAT-0221 waited under Q-W28-06 until the owner's own photograph landed (W28-26) */
const ALLOWED = {
  'Pexels License': ['pexels.com', 'images.pexels.com'],
  'Unsplash License': ['unsplash.com', 'images.unsplash.com'],
  'Pixabay Content License': ['pixabay.com', 'cdn.pixabay.com'],
  'CC0 1.0': ['commons.wikimedia.org', 'upload.wikimedia.org'],
  'Public domain': ['commons.wikimedia.org', 'upload.wikimedia.org'],
  'CC0 1.0 (Google Images, licence verified on the landing page)': null,
};
const hostOf = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return null; } };
const parseRows = (text) => text.split('\n').filter((l) => l.startsWith('| `')).map((l) => { const c = l.split('|').map((s) => s.trim()); return { file: c[1].replace(/`/g, ''), cells: c.slice(2) }; });

/* The check, over data, so the self-test can run it on synthetic rows. */
function check({ products, ledger, prov, sources, galleries, exists }) {
  const problems = [];
  const bySlot = new Map(ledger.map((r) => [r.id, r]));
  const provBy = new Map(); for (const r of prov) { if (provBy.has(r.file)) problems.push(`provenance names ${r.file} twice`); provBy.set(r.file, { file: r.file, source: r.cells[0], licence: r.cells[1], licenceUrl: r.cells[2], date: r.cells[3] }); }
  const srcBy = new Map(); for (const r of sources) { if (srcBy.has(r.file)) problems.push(`SOURCES names ${r.file} twice`); srcBy.set(r.file, { file: r.file, page: r.cells[0], source: r.cells[1], licence: r.cells[2], subject: r.cells[3] }); }
  const f3d = products.filter((p) => p.source && p.source.host === HOST);
  const counts = { records: f3d.length, stock: 0, packshot: 0, reuse: 0, other: 0, galleryStock: 0, sourcesRows: sources.length, filesChecked: 0 };
  const stockRowOk = (file, licenceCell, sourceCell, where) => {
    const src = srcBy.get(file);
    if (!src) { problems.push(`${where}: a stock picture with no docs/images/SOURCES.md row (R-W28-06: every image gets a row)`); return; }
    if (!Object.prototype.hasOwnProperty.call(ALLOWED, src.licence)) { problems.push(`${where}: SOURCES licence "${src.licence}" is not in the allowed set (${Object.keys(ALLOWED).join('; ')})`); return; }
    if (!licenceCell.includes(src.licence)) problems.push(`${where}: the PROVENANCE licence "${licenceCell}" does not name the SOURCES licence "${src.licence}"`);
    const hosts = ALLOWED[src.licence];
    if (hosts) for (const u of String(sourceCell).split(' · ').map((s) => s.trim()).filter((s) => /^https?:/.test(s))) { const h = hostOf(u); if (!hosts.includes(h)) problems.push(`${where}: source URL host ${h} is not ${src.licence}'s own (${hosts.join(', ')})`); }
    for (const u of String(src.source).split(' · ').map((s) => s.trim()).filter((s) => /^https?:/.test(s))) { const h = hostOf(u); if (hosts && !hosts.includes(h)) problems.push(`${where}: SOURCES URL host ${h} is not ${src.licence}'s own`); if (h === HOST || (h && h.endsWith('.' + HOST))) problems.push(`${where}: SOURCES names a ${HOST} URL`); }
  };
  for (const p of f3d) {
    const row = bySlot.get(p.slot); const where = `${p.id} (${p.slot})`;
    if (!row) { problems.push(`${where}: no ledger row`); continue; }
    if (row.state === 'placeholder' && PLACEHOLDER_WAITING[p.slot]) { counts.waiting = (counts.waiting || 0) + 1; continue; }
    if (row.state !== 'filled') { problems.push(`${where}: ledger row is ${row.state}`); continue; }
    const pr = provBy.get(row.provenance);
    if (!pr) { problems.push(`${where}: provenance path ${row.provenance} has no row`); continue; }
    if (!exists(row.provenance)) problems.push(`${where}: file missing ${row.provenance}`); else counts.filesChecked++;
    /* rule 1, on every fatade-group record, reuse or not: the row it stands on names no fatade3d.md */
    for (const u of [pr.source, pr.licenceUrl].join(' · ').split(' · ').map((s) => s.trim()).filter((s) => /^https?:/.test(s))) { const h = hostOf(u); if (h === HOST || (h && h.endsWith('.' + HOST))) { problems.push(`${where}: its picture ${row.provenance} stands on a ${HOST} row (${u}). R-W28-06: no fatade product image source host is ${HOST}.`); break; } }
    if (row.reuse_of) { counts.reuse++; continue; }
    if (pr.licence.includes(STOCK)) { counts.stock++; stockRowOk(row.provenance, pr.licence, pr.source, where); }
    else if (/owned by Rapid Construct/.test(pr.licence)) counts.owner = (counts.owner || 0) + 1;
    else if (/manufacturer|packshot|google_pick|owner/.test(pr.licence)) counts.packshot++;
    else { counts.other++; problems.push(`${where}: licence "${pr.licence}" is neither the stock set nor a manufacturer or owner-picked origin`); }
  }
  /* rule 3, the galleries */
  for (const g of galleries) for (const ph of g.photos || []) {
    if (ph.origin !== 'stock') continue;
    counts.galleryStock++;
    const where = `gallery ${g.render_on || g.page} ${path.basename(ph.full || '?')}`;
    for (const f of [ph.full, ph.thumb]) {
      if (!f) { problems.push(`${where}: a stock photograph without a ${f === ph.full ? 'full' : 'thumb'} path`); continue; }
      if (!exists(f)) problems.push(`${where}: file missing ${f}`); else counts.filesChecked++;
      const pr = provBy.get(f);
      if (!pr) problems.push(`${where}: ${f} has no PROVENANCE row`);
      else if (!pr.licence.includes(STOCK)) problems.push(`${where}: ${f} is a stock photograph whose PROVENANCE licence is "${pr.licence}"`);
      else for (const u of pr.source.split(' · ').map((s) => s.trim()).filter((s) => /^https?:/.test(s))) { const h = hostOf(u); if (h === HOST) problems.push(`${where}: ${f} stands on a ${HOST} URL`); }
    }
    if (ph.full) { const pr = provBy.get(ph.full); stockRowOk(ph.full, pr ? pr.licence : '', pr ? pr.source : '', where); }
    if (!ph.alt || !ph.alt.ro || !ph.alt.ru) problems.push(`${where}: a stock photograph without alt text in both locales (R-W28-06)`);
  }
  /* rule 4, every SOURCES row is real */
  for (const [file, s] of srcBy) {
    if (!exists(file)) problems.push(`SOURCES row for ${file}: file missing`);
    if (!Object.prototype.hasOwnProperty.call(ALLOWED, s.licence)) problems.push(`SOURCES row for ${file}: licence "${s.licence}" is not in the allowed set`);
    if (!provBy.has(file)) problems.push(`SOURCES row for ${file}: no PROVENANCE row (the two manifests are written together)`);
  }
  return { problems, counts };
}

/* --- self-test, before any real result -------------------------------------- */
const REC = (slot, host = HOST) => ({ id: 'r-' + slot, slot, source: { host, url: `https://${host}/p/${slot}/` } });
const ROW = (id, prov, extra) => ({ id, state: 'filled', provenance: prov, ...extra });
const STOCK_PROV = (file, n) => ({ file, cells: [`https://www.pexels.com/photo/${n}/ · https://images.pexels.com/photos/${n}/x.jpeg · Pexels`, 'stock library, Pexels License, R-W28-06, viewed', 'https://www.pexels.com/license/', '2026-09-24'] });
const SRC = (file, lic = 'Pexels License', n = 1) => ({ file, cells: ['/catalog/x/', `https://www.pexels.com/photo/${n}/ · https://images.pexels.com/photos/${n}/x.jpeg`, lic, 'a thing'] });
const PACK_PROV = (file) => ({ file, cells: ['https://caparol.md/p/ · https://caparol.md/x.jpg · Caparol', 'manufacturer packshot, reseller display, licence not verified, owner accepted 2026-09-20', 'https://caparol.md/p/', '2026-09-20'] });
const F3D_PROV = (file) => ({ file, cells: ['https://fatade3d.md/produs/x/ · https://fatade3d.md/wp-content/uploads/x.jpg · Fatade 3D', 'direct supplier, fatade3d.md, owner buys catalogue goods directly and accepts use of their product data and product images, watermark as published, owner accepted 2026-09-21', 'https://fatade3d.md/produs/x/', '2026-09-21'] });
const ARMS = [
  { arm: 'GREEN: a stock picture on a fatade-group record with both rows', want: null, data: { products: [REC('CAT-9001')], ledger: [ROW('CAT-9001', 'public/img/catalog/CAT-9001.webp')], prov: [STOCK_PROV('public/img/catalog/CAT-9001.webp', 1)], sources: [SRC('public/img/catalog/CAT-9001.webp')], galleries: [] } },
  { arm: 'GREEN: a manufacturer packshot on a fatade-group record is counted, not refused (Q-W28-05)', want: null, data: { products: [REC('CAT-9002')], ledger: [ROW('CAT-9002', 'public/img/catalog/CAT-9002.jpg')], prov: [PACK_PROV('public/img/catalog/CAT-9002.jpg')], sources: [], galleries: [] } },
  { arm: 'a fatade-group picture still standing on a fatade3d.md row', want: /stands on a fatade3d\.md row/, data: { products: [REC('CAT-9003')], ledger: [ROW('CAT-9003', 'public/img/catalog/CAT-9003.jpg')], prov: [F3D_PROV('public/img/catalog/CAT-9003.jpg')], sources: [], galleries: [] } },
  { arm: 'a stock picture with no SOURCES row', want: /no docs\/images\/SOURCES\.md row/, data: { products: [REC('CAT-9004')], ledger: [ROW('CAT-9004', 'public/img/catalog/CAT-9004.webp')], prov: [STOCK_PROV('public/img/catalog/CAT-9004.webp', 4)], sources: [], galleries: [] } },
  { arm: 'a SOURCES licence outside the allowed set (CC BY requires attribution)', want: /^r-CAT-9005 \(CAT-9005\): SOURCES licence "CC BY 4\.0" is not in the allowed set/, data: { products: [REC('CAT-9005')], ledger: [ROW('CAT-9005', 'public/img/catalog/CAT-9005.webp')], prov: [STOCK_PROV('public/img/catalog/CAT-9005.webp', 5)], sources: [SRC('public/img/catalog/CAT-9005.webp', 'CC BY 4.0', 5)], galleries: [] } },
  { arm: 'a stock gallery photograph whose thumb has no PROVENANCE row', want: /has no PROVENANCE row/, data: { products: [REC('CAT-9006')], ledger: [ROW('CAT-9006', 'public/img/catalog/CAT-9006.webp')], prov: [STOCK_PROV('public/img/catalog/CAT-9006.webp', 6), STOCK_PROV('public/img/galerie/x/09.webp', 7)], sources: [SRC('public/img/catalog/CAT-9006.webp', 'Pexels License', 6), SRC('public/img/galerie/x/09.webp', 'Pexels License', 7)], galleries: [{ render_on: 'x', photos: [{ origin: 'stock', full: 'public/img/galerie/x/09.webp', thumb: 'public/img/galerie/x/09-t.webp', alt: { ro: 'a', ru: 'b' } }] }] } },
];
let green = 0;
for (const a of ARMS) {
  const { problems } = check({ ...a.data, exists: () => true });
  if (a.want === null) { if (problems.length) fail(`self-test GREEN arm "${a.arm}" was refused: ${problems.join(' | ')}`); green++; console.log(`self-test GREEN arm accepted, as it must be: ${a.arm}`); continue; }
  const hit = problems.filter((p) => a.want.test(p));
  if (hit.length !== 1) fail(`self-test arm "${a.arm}" did not fire once on its own message; it reported: ${problems.length ? problems.join(' | ') : 'nothing'}`);
  console.log(`self-test arm fired on its own message: ${a.arm}`);
}
console.log(`self-test: ${ARMS.length} arms, ${green} of them green`);

/* --- the real run ---------------------------------------------------------- */
const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/catalog-products.json'), 'utf8')).products;
const ledger = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/PHOTO-SLOTS-W24.json'), 'utf8')).slots;
const prov = parseRows(fs.readFileSync(path.join(ROOT, 'docs/assets/PROVENANCE.md'), 'utf8'));
const srcPath = path.join(ROOT, 'docs/images/SOURCES.md');
if (!fs.existsSync(srcPath)) fail('docs/images/SOURCES.md is missing. R-W28-06: every stock picture gets a row there, and a manifest that vanished is not one that passed.');
const sources = parseRows(fs.readFileSync(srcPath, 'utf8'));
const galleries = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/galleries.json'), 'utf8')).galleries || [];
if (!products.length) fail('zero catalogue records'); if (!ledger.length) fail('zero ledger rows'); if (!prov.length) fail('zero provenance rows');
const { problems, counts } = check({ products, ledger, prov, sources, galleries, exists: (f) => fs.existsSync(path.join(ROOT, f)) });
console.log(`fatade-group records: ${counts.records}; files checked: ${counts.filesChecked}; pictures by origin: ${counts.stock} stock (R-W28-06), ${counts.packshot} manufacturer or owner-picked under W25-R1/W25-R20 (Q-W28-05, counted), ${counts.reuse} declared reuse, ${counts.owner || 0} the owner's own photographs (client direct transfer, W28-26), ${counts.other} other, ${counts.waiting || 0} waiting as a placeholder; stock gallery photographs: ${counts.galleryStock}; SOURCES rows: ${counts.sourcesRows}`);
if (!counts.records) fail('zero fatade-group records read');
if (!counts.stock) fail('zero stock pictures on the fatade group, so the manifest assertion proved nothing (W28-23 installs 110)');
if (problems.length) { console.error(`\n${problems.length} problem(s):`); problems.forEach((p) => console.error('  ' + p)); process.exit(1); }
console.log(`no fatade-group picture stands on a ${HOST} row; every stock picture on the fatade group and in the galleries has a SOURCES row licensed from the allowed set and a PROVENANCE row; the manufacturer packshots are counted.`);
