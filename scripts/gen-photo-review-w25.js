#!/usr/bin/env node
/* Writes docs/PHOTO-REVIEW-W25.md, the list the owner reads when reviewing by
   hand. Card W25-12.

       node scripts/gen-photo-review-w25.js [--check]

   GENERATED, NOT TYPED, for the same reason every other list in this repo is:
   133 rows copied by hand from three cards would be wrong somewhere, and a
   review list that disagrees with the ledger is worse than none. It is built
   from docs/PHOTO-SLOTS-W24.json, docs/assets/PROVENANCE.md and
   content/catalog-products.json, and `--check` fails if the committed file and
   the data have drifted apart.

   WHAT THE FLAGS MEAN, and where each one comes from rather than from memory:
     · labelled swatch  the provenance row's image is a Phomi colour swatch with
       the product name burned into it (W25-R5). Read from the source host and
       the slot being a ceramic plate, not from a list.
     · watermark        the file came from dasterum.md under W25-R7, which
       requires the watermark to stay exactly as published.
     · low confidence   the plate's brand settlement matched at a tier that is
       not an exact string match: B-spelling, C-contained or D-read. Read from
       content/plate-brand-settlement.json.
   A row with no flag is an ordinary manufacturer packshot.

   Zero dependency. */

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'docs/PHOTO-REVIEW-W25.md');
const die = (m) => { console.error(`\nPHOTO REVIEW FAILED: ${m}\n`); process.exit(1); };
const read = (p) => { const f = path.join(ROOT, p); if (!fs.existsSync(f)) die(`${p} is missing.`); return fs.readFileSync(f, 'utf8'); };

const ledger = JSON.parse(read('docs/PHOTO-SLOTS-W24.json'));
const products = (() => { const j = JSON.parse(read('content/catalog-products.json')); return Array.isArray(j) ? j : (j.products || []); })();
const settlement = JSON.parse(read('content/plate-brand-settlement.json')).settled;
if (!Array.isArray(ledger.slots) || !ledger.slots.length) die('the ledger has no slots.');

/* PROVENANCE.md as a map, the same read gate 19 does. */
const prov = new Map();
for (const line of read('docs/assets/PROVENANCE.md').split('\n')) {
  if (!line.startsWith('|')) continue;
  const c = line.split('|').slice(1, -1).map((x) => x.trim());
  if (c.length < 5) continue;
  const file = c[0].replace(/^`|`$/g, '');
  if (!file.startsWith('public/')) continue;
  prov.set(file, { file, source: c[1], licence: c[2], licenceUrl: c[3], date: c[4] });
}
if (!prov.size) die('docs/assets/PROVENANCE.md parsed to zero rows.');

const bySlot = new Map(products.filter((p) => p.slot).map((p) => [p.slot, p]));
const tierBySlot = new Map(settlement.map((r) => [r.slot, r.tier]));

/* THE SECTIONS. A slot belongs to exactly one, and the order is the owner's
   priority: Catalog, Acoperisuri, Garduri. Anything else is out of scope for
   this list and is counted at the foot rather than dropped. */
const ACOP_FIRST = 224, ACOP_LAST = 294;
const catNum = (id) => { const m = id.match(/^CAT-(\d+)$/); return m ? Number(m[1]) : null; };
function section(id) {
  const n = catNum(id);
  if (n !== null) return (n >= ACOP_FIRST && n <= ACOP_LAST) ? 'Acoperisuri' : 'Catalog';
  if (id.startsWith('CATEG-')) return 'Catalog';
  /* W25-19. `ACTM-` is the four metal tile model cards the consolidated roofing
     section added. They are Acoperisuri slots and they belong in this list: a
     slot the owner's own review list cannot see is a slot nobody reviews. */
  /* AMENDED (W26-11): `ACIM-` too, the nine imperlux-only cards W26-04 added. They
     were invisible to this list, filled or empty, until W26-R10 filled them. */
  if (id.startsWith('ACOP-') || id.startsWith('NVK-') || id.startsWith('ACTM-') || id.startsWith('ACIM-')) return 'Acoperisuri';
  if (id.startsWith('GARD-') || id.startsWith('GARDB-')) return 'Garduri';
  /* W26-07. The three copertine secondary images are the first library pictures
     on the site, and a picture the owner's review list cannot see is a picture
     nobody reviews: every row of this section carries the library flag. */
  /* W28-14: the twelve model photographs, COPM-01 to COPM-12, imperlux override rows. */
  if (id === 'COP-HERO' || id.startsWith('COPX-') || id.startsWith('COPM-')) return 'Copertine';
  return null;
}
const SECTIONS = ['Catalog', 'Acoperisuri', 'Garduri', 'Copertine'];

const imageUrl = (source) => (source.match(/\bhttps?:\/\/\S+\.(?:jpe?g|png|webp|gif|avif|heic|tiff?)\b/i) || [null])[0];
const pageUrl = (source) => (source.match(/\bhttps?:\/\/\S+/) || [null])[0];

/* Dimensions from the file's OWN BYTES, with no external binary.

   The first version shelled out to `sips`, which is macOS only. It passed on a
   workstation and failed in CI on the first run, because on Linux every call
   threw and every row read "unreadable", so the generated text differed from the
   committed one. That is gate 22's lesson in a new place: a gate that depends on
   the environment of whoever runs it does not run everywhere.

   JPEG: walk the segments to a start-of-frame marker, which carries height then
   width as big-endian 16-bit. PNG: the IHDR chunk, at a fixed offset. Those are
   the only two formats `public/img/` holds, and an unknown one says so rather
   than guessing. */
function dims(file) {
  const f = path.join(ROOT, file);
  if (!fs.existsSync(f)) return 'file missing';
  const b = fs.readFileSync(f);
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47 && b.toString('latin1', 12, 16) === 'IHDR') {
    return `${b.readUInt32BE(16)}x${b.readUInt32BE(20)}`;
  }
  /* W28-23 (R-W28-06): the stock pictures are WebP; the size sits in the first chunk header. */
  if (b.length > 30 && b.toString('latin1', 0, 4) === 'RIFF' && b.toString('latin1', 8, 12) === 'WEBP') {
    const s = require('./webp-encode').webpSize(b);
    return s ? `${s.width}x${s.height}` : 'unreadable';
  }
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m === 0xd8 || m === 0x01 || (m >= 0xd0 && m <= 0xd7)) { i += 2; continue; }
      const len = b.readUInt16BE(i + 2);
      /* SOF0..SOF15, excluding the four that are not frame headers. */
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
        return `${b.readUInt16BE(i + 7)}x${b.readUInt16BE(i + 5)}`;
      }
      if (len < 2) break;
      i += 2 + len;
    }
    return 'unreadable';
  }
  return 'not a jpeg or png';
}

function originClass(licence) {
  const l = licence.toLowerCase();
  /* W25-R14 and W25-R15. Each origin names its own host, because "which
     permission is this row standing on" is the first thing the reviewer needs and
     a shared label would hide it. */
  if (l.includes('direct supplier, dasterum.md')) return 'direct_supplier dasterum.md';
  if (l.includes('direct supplier, fatade3d.md')) return 'direct_supplier fatade3d.md';
  if (l.includes('owner_override_imperlux')) return 'owner_override_imperlux';
  /* W25-R20. Checked BEFORE the manufacturer origin, because a search pick may
     well land on a manufacturer's own page and the thing the owner needs to see
     is that a search chose it. */
  if (l.includes('google_pick')) return 'google_pick';
  /* W25-R23 and W26-R8, named by library so the reviewer sees which one. */
  if (l.includes('licence-free library')) return l.includes('unsplash') ? 'licence-free library, Unsplash' : 'licence-free library, Pexels';
  /* R-W28-06 (W28-23): the stock set on the fatade group, named by site so the reviewer sees which. */
  if (l.includes('stock library')) return 'stock library (R-W28-06), ' + (l.includes('unsplash') ? 'Unsplash' : l.includes('pixabay') ? 'Pixabay' : l.includes('cc0') || l.includes('public domain') ? 'Wikimedia Commons' : 'Pexels');
  if (l.includes('manufacturer packshot')) return 'manufacturer official site';
  if (l.includes('ai generated')) return 'owner AI generated';
  if (l.includes('supplier permission')) return 'supplier permission';
  if (l.includes('client-supplied')) return 'client supplied';
  if (l.includes('legacy')) return 'legacy';
  return licence;
}

const filled = [], empty = [];
for (const row of ledger.slots) {
  const sec = section(row.id);
  if (!sec) continue;
  if (row.state !== 'filled') { empty.push({ row, sec }); continue; }
  const p = prov.get(row.provenance);
  if (!p) die(`${row.id} is filled and names "${row.provenance}", which has no provenance row.`);
  const rec = bySlot.get(row.id);
  const origin = originClass(p.licence);
  const flags = [];
  /* Dasterum watermarks every file it publishes, so the flag is derived from the
     origin. Fatade 3D does not: three of its files carry the supplier's mark and
     the rest do not, so that one is DECLARED on the ledger row by the person who
     looked at it, exactly as W25-R5's label flag is. A derived flag that fired on
     all 99 would tell the reviewer nothing. */
  if (origin === 'direct_supplier dasterum.md' || row.watermark === true) flags.push('watermark');
  /* W25-R5, declared. The 64 Fatade 3D moulding renders carry their own product
     code burned in, which is the same condition the Phomi swatches are installed
     under, and no data file can see it. */
  if (row.label === true) flags.push('labelled swatch');
  /* W25-R17. Reuse is declared on the later slot and flagged here, which is the
     other half of the permission: a reused picture must not be invisible to the
     person reviewing the images by hand. */
  if (row.reuse_of) flags.push(`reuse of ${row.reuse_of}`);
  /* W25-R20's other half: "log the source URL, flag google_pick in the review
     file. Owner reviews and corrects afterwards." Derived from the origin, so it
     cannot be forgotten on a row. */
  if (origin === 'google_pick') flags.push('google_pick');
  if (origin.startsWith('licence-free library')) flags.push('library');
  if (origin === 'manufacturer official site' && /phomi\.com/i.test(p.source) && (rec && (rec.categories || []).includes('placi-ceramice'))) {
    const tier = tierBySlot.get(row.id);
    if (tier && tier !== 'A-exact') flags.push('low confidence match');
    /* A Phomi COLOUR swatch carries the burned-in name; a family card image does
       not. The two are told apart by the image path, which is how Phomi files
       them: a swatch lives under /uploads/2025/08 or later with a colour name,
       a family card under /uploads/2025/07 with the range's Chinese name. The
       settlement's own level is the honest discriminator and it is used here. */
    const s = settlement.find((x) => x.slot === row.id);
    if (s && s.level === 'variant') flags.push('labelled swatch');
  }
  /* W26-R13: "flag low_res in the review file". Derived from the installed file's
     own bytes, not declared, so it cannot be forgotten on a row: nothing is ever
     upscaled, so a file whose longest side is under 450 came from a source under
     the site's normal floor, which only W26-R13's fifteen slots may do. */
  const d = dims(row.provenance);
  const long = Math.max(...(d.match(/^(\d+)x(\d+)$/) || [0, 0, 0]).slice(1).map(Number));
  if (long > 0 && long < 450) flags.push('low_res');
  filled.push({ row, sec, p, rec, origin, flags, dims: d });
}

const esc = (s) => String(s == null ? '' : s).replace(/\|/g, '\\|');
const name = (row, rec) => rec ? rec.name.ro : row.id;

const L = [];
L.push('# Photo review, wave 25');
L.push('');
L.push('Generated by `node scripts/gen-photo-review-w25.js` from `docs/PHOTO-SLOTS-W24.json`,');
L.push('`docs/assets/PROVENANCE.md`, `content/catalog-products.json` and');
L.push('`content/plate-brand-settlement.json`. Not typed, so it cannot disagree with the ledger.');
L.push('`--check` fails if the committed file and the data have drifted apart, and `quality` runs it.');
L.push('');
L.push('**This is the list the owner reads.** W25-R5 permits a photograph with a burned-in');
L.push('product name on condition that each one is flagged here; W25-R7 permits a Dasterum');
L.push('image on condition that its watermark stays as published. Both flags are below, per row.');
L.push('');
L.push(`**${filled.length} images to review, across ${SECTIONS.slice(0, -1).join(', ')} and ${SECTIONS[SECTIONS.length - 1]}.**`);
L.push('');
L.push('The dispatch asked for a row per image installed by IT. This lists **every filled slot**');
L.push(`in those ${SECTIONS.length} sections, which is that set plus the 27 installed by the dispatch before`);
L.push('it (W25-02, W25-03c). Those 27 have never been through a review list either, and leaving');
L.push('them out would mean the owner reviews a list that is not all of it. The flag columns tell');
L.push('them apart: nothing from the earlier dispatch is a labelled swatch or carries a watermark.');
L.push('');
const fl = (k) => filled.filter((f) => f.flags.includes(k)).length;
L.push('| Flag | Rows | What to look for |');
L.push('|---|---|---|');
L.push(`| labelled swatch | ${fl('labelled swatch')} | the product name or code is printed into the photograph, and the card prints it again underneath |`);
L.push(`| watermark | ${fl('watermark')} | a supplier mark on the picture or on the product. It is there on purpose and must not be cropped |`);
L.push(`| reuse | ${filled.filter((f) => f.flags.some((x) => x.startsWith('reuse of'))).length} | one picture filling a second record of the same product (W25-R17). Check the two cards are the same product |`);
L.push(`| google_pick | ${fl('google_pick')} | found by search because the product's own source publishes nothing at the 450 floor (W25-R20). Check it is the right product, and correct it if not |`);
L.push(`| library | ${fl('library')} | a licence-free stock photograph from Unsplash or Pexels (W25-R23, W26-R8), decoration only. Check it suits the page |`);
L.push(`| low_res | ${fl('low_res')} | the longest side is under the site's 450 floor, installed under W26-R13's floor of 300 for the last empty products. Replace it when a larger picture exists |`);
L.push(`| low confidence match | ${fl('low confidence match')} | the plate matched Phomi at a tier that is not an exact string match. Check the name in the picture against the name on the card |`);
L.push(`| no flag | ${filled.filter((f) => !f.flags.length).length} | an ordinary manufacturer packshot |`);
L.push('');
L.push(`## Table one: every image on the site in these ${SECTIONS.length} sections`);
L.push('');
for (const sec of SECTIONS) {
  const rows = filled.filter((f) => f.sec === sec);
  if (!rows.length) continue;
  L.push(`### ${sec} (${rows.length})`);
  L.push('');
  L.push('| Slot | Product | Page | Source | Origin | Size | Flags |');
  L.push('|---|---|---|---|---|---|---|');
  for (const f of rows) {
    L.push(`| \`${f.row.id}\` | ${esc(name(f.row, f.rec))} | ${esc(f.row.page)} | ${esc(imageUrl(f.p.source) || pageUrl(f.p.source) || f.p.source)} | ${f.origin} | ${f.dims} | ${f.flags.join(', ') || 'none'} |`);
  }
  L.push('');
}

L.push('## Table two: every slot still empty, with its reason');
L.push('');
for (const sec of SECTIONS) {
  const rows = empty.filter((e) => e.sec === sec);
  if (!rows.length) { L.push(`### ${sec}: none`); L.push(''); continue; }
  L.push(`### ${sec} (${rows.length})`);
  L.push('');
  L.push('| Slot | Product | Page | Reason |');
  L.push('|---|---|---|---|');
  for (const e of rows) {
    L.push(`| \`${e.row.id}\` | ${esc(name(e.row, bySlot.get(e.row.id)))} | ${esc(e.row.page)} | ${esc(reasonFor(e.row, bySlot.get(e.row.id)))} |`);
  }
  L.push('');
}
L.push('---');
L.push('');
L.push(`Slots outside these ${SECTIONS.length} sections are not in this list: ${ledger.slots.filter((r) => !section(r.id)).length} rows, counted here rather than dropped.`);
L.push('');

/* --- the reasons, each traceable to a card or a ruling ---------------------- */
function reasonFor(row, rec) {
  /* A reason MEASURED on this card beats a reason derived from the record's
     shape. W25-17 attempted every one of these and four came back under the
     floor, which the derived branches below cannot know and would describe
     wrongly as "no manufacturer site". The field carries the measurement. */
  if (row.empty_reason) return row.empty_reason;
  if (row.id.startsWith('GARD-')) return 'real photo from owner project set';
  if (row.id.startsWith('GARDB-') || row.id.startsWith('ACOP-')) return 'hub tile, PRIORITY BATCH at the top of AI-PROMPTS-W25.md (W25-12)';
  if (row.id.startsWith('NVK-')) return 'named tile product: W25-R2 forbids a generated image, and no Novatik packshot was sourced';
  if (row.id.startsWith('CATEG-')) return 'catalogue category tile, in AI-PROMPTS-W25.md';
  if (!rec) return 'no catalogue record';
  const cats = rec.categories || [];
  if (cats.includes('placi-ceramice')) {
    const s = settlement.find((x) => x.slot === row.id);
    if (s && !s.brand) return 'in none of the three catalogues, brand_hidden (W25-03d); W25-R2 forbids a generated image on a named tile product';
    if (s && s.matched_as) return `the same Phomi picture already fills another record of this product; held by the one-picture-one-card rule (Q-W25-13)`;
    return 'no single Phomi image is this product (W25-07)';
  }
  if (!rec.brand || rec.brand_hidden) {
    if (cats.includes('sisteme-iluminare')) return 'no manufacturer, and W25-R9 forbids a generated image where the appearance is not in the records';
    if (cats.includes('elemente-decorative')) return 'no manufacturer, and W25-R9 forbids a generated image where the appearance is not in the records';
    return 'no manufacturer named, so there is no manufacturer site to be the origin (W25-R1)';
  }
  return `manufacturer publishes nothing that clears the 450 floor, or nothing at all (W25-08)`;
}

const text = L.join('\n');
if (process.argv.includes('--check')) {
  if (!fs.existsSync(OUT)) die('docs/PHOTO-REVIEW-W25.md is missing. Run: node scripts/gen-photo-review-w25.js');
  const on = fs.readFileSync(OUT, 'utf8');
  if (on !== text) die('docs/PHOTO-REVIEW-W25.md does not match the ledger.\n  Run: node scripts/gen-photo-review-w25.js\n  A review list that disagrees with the ledger is worse than none.');
  console.log(`photo review check: ${filled.length} installed, ${empty.length} empty, file matches the data.`);
  process.exit(0);
}
fs.writeFileSync(OUT, text);
console.log(`wrote docs/PHOTO-REVIEW-W25.md: ${filled.length} installed, ${empty.length} still empty, across ${SECTIONS.join(', ')}.`);
