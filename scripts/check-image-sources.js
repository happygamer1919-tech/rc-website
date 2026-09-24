#!/usr/bin/env node
/* Image sources gate, card W28-15 (wave 28), the named test "image-sources". Run by `quality`.

   THE OWNER'S ACCEPTANCE, verbatim from the wave 28 dispatch: "named test image-sources passes
   (every fatade image source_url hosts on fatade3d.md)".

   WHAT "FATADE IMAGE" MEANS HERE, and why it is scoped. The catalogue's 223 fatade3d.md records
   carry pictures from four origins under standing rulings: the direct-supplier origin (the
   picture from the product's own fatade3d.md page, W25-R14), a manufacturer's own packshot
   (W25-R1), a picture picked by the owner (W25-R20) and a declared reuse of another slot's
   file (W25-R17). W28-15 replaces posters, tables and overlays with plain photographs FROM THE
   FATADE3D.MD PRODUCT PAGE, so the rows it governs are the direct-supplier ones: every such row
   must name a fatade3d.md product page and a fatade3d.md image file, and a row on that licence
   naming any other host is a defect. A manufacturer packshot on a fatade3d record is not
   turned into a defect by this gate, because three rulings permit it; it is COUNTED and printed
   so the split is never implicit. Every fatade3d record must have a filled ledger slot with a
   provenance row, and every direct-supplier row must belong to a fatade3d record.

   Presence, not silence (docs/CLAUDE.md section 13): it prints how many records, rows and
   files it read and fails on zero of any. Zero dependency. */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const fail = (m) => { console.error(`\nIMAGE SOURCES FAILED: ${m}\n`); process.exit(1); };
const problems = [];
const bad = (m) => problems.push(m);

const HOST = 'fatade3d.md';
const DIRECT = 'direct supplier, fatade3d.md';

const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/catalog-products.json'), 'utf8')).products;
const ledger = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/PHOTO-SLOTS-W24.json'), 'utf8')).slots;
const provLines = fs.readFileSync(path.join(ROOT, 'docs/assets/PROVENANCE.md'), 'utf8').split('\n').filter((l) => l.startsWith('| `'));
if (!products.length) fail('zero catalogue records');
if (!ledger.length) fail('zero ledger rows');
if (!provLines.length) fail('zero provenance rows');

const prov = new Map();
for (const l of provLines) {
  const c = l.split('|').map((s) => s.trim());
  const file = c[1].replace(/`/g, '');
  if (prov.has(file)) bad(`provenance names ${file} twice`);
  prov.set(file, { file, source: c[2], licence: c[3], licenceUrl: c[4], date: c[5] });
}
const bySlot = new Map(ledger.map((r) => [r.id, r]));
const f3d = products.filter((p) => p.source && p.source.host === HOST);
if (!f3d.length) fail('zero fatade3d records');

const hostOf = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return null; } };
let direct = 0, manufacturer = 0, reuse = 0, other = 0, filesChecked = 0;
for (const p of f3d) {
  const row = bySlot.get(p.slot);
  if (!row) { bad(`${p.id} (${p.slot}): no ledger row`); continue; }
  if (row.state !== 'filled') { bad(`${p.id} (${p.slot}): ledger row is ${row.state}, every fatade3d record carries a picture since W26-10`); continue; }
  const pr = prov.get(row.provenance);
  if (!pr) { bad(`${p.id} (${p.slot}): provenance path ${row.provenance} has no row`); continue; }
  if (!fs.existsSync(path.join(ROOT, row.provenance))) bad(`${p.id} (${p.slot}): file missing ${row.provenance}`);
  else filesChecked++;
  if (row.reuse_of) { reuse++; continue; }
  if (pr.licence.startsWith(DIRECT)) {
    direct++;
    const parts = pr.source.split(' · ').map((s) => s.trim());
    const page = parts[0], image = parts[1];
    if (hostOf(page) !== HOST) bad(`${p.id} (${p.slot}): direct-supplier row names the page ${page}, not a ${HOST} page`);
    if (!image || hostOf(image) !== HOST) bad(`${p.id} (${p.slot}): direct-supplier row names the image ${image || '(none)'}, not a ${HOST} file`);
    if (hostOf(pr.licenceUrl) !== HOST) bad(`${p.id} (${p.slot}): direct-supplier row's licence URL ${pr.licenceUrl} is not on ${HOST}`);
    if (p.source && p.source.url && page.split('?')[0] !== p.source.url.split('?')[0]) bad(`${p.id} (${p.slot}): the row's page ${page} is not the record's source ${p.source.url}`);
  } else if (/manufacturer|packshot|google_pick|owner/.test(pr.licence)) manufacturer++;
  else other++;
}
for (const [file, pr] of prov) {
  if (!pr.licence.startsWith(DIRECT)) continue;
  const row = ledger.find((r) => r.provenance === file && !r.reuse_of);
  if (!row) { bad(`${file}: a direct-supplier row no ledger slot renders`); continue; }
  const rec = products.find((p) => p.slot === row.id);
  if (!rec || !rec.source || rec.source.host !== HOST) bad(`${file}: a direct-supplier row on slot ${row.id}, which is not a fatade3d record`);
}

console.log(`fatade3d records: ${f3d.length}; files checked: ${filesChecked}; pictures by origin: ${direct} direct-supplier (fatade3d.md page and file), ${manufacturer} manufacturer or owner-picked under W25-R1/W25-R20, ${reuse} declared reuse (W25-R17), ${other} other`);
if (!direct) fail('zero direct-supplier rows read, so the host assertion proved nothing');
if (problems.length) { console.error(`\n${problems.length} problem(s):`); problems.forEach((p) => console.error('  ' + p)); process.exit(1); }
console.log(`every direct-supplier picture names a ${HOST} product page and a ${HOST} image file, matching its record's source; every fatade3d record has a filled slot with a provenance row.`);
