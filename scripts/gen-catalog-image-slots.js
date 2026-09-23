#!/usr/bin/env node
/* Catalog image slot manifest generator, card RC-150 (W21-05).

   RC-149 gives every catalog product record a place for one image, and forbids
   filling it until an approved source exists. This writes the request list that
   goes to the suppliers: one row per product record, with the product, the
   brand, the category and the aspect the site will render it at.

   IT IS GENERATED, NEVER TYPED. The list is derived from
   content/catalog-products.json, so it cannot drift from the records the site
   builds, which is how the stub count drifted for thirteen waves (RC-148).

       node scripts/gen-catalog-image-slots.js           writes the manifest
       node scripts/gen-catalog-image-slots.js --check   fails if it is stale

   `--check` is what `quality` runs: a request list that disagrees with the data
   would send someone shopping for the wrong photographs.

   FACTS ONLY, as the card says. The aspect, the pixel sizes and the file naming
   are not chosen here: they are the treatment the site already uses for a card
   image (`media media--4x3 media--card`, a 400x300 img with a 2x file), read off
   the built pages. Nothing in this file states a price, a stock level or an
   availability. */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'content/catalog-products.json');
const OUT = path.join(ROOT, 'docs/assets/CATALOG-IMAGE-SLOTS.md');
const CHECK = process.argv.includes('--check');

const fail = (msg) => { console.error(`\nCATALOG IMAGE SLOTS ${CHECK ? 'CHECK' : 'GENERATOR'} FAILED: ${msg}\n`); process.exit(1); };

if (!fs.existsSync(DATA)) fail(`${path.relative(ROOT, DATA)} is missing, so there is nothing to list.`);
let raw;
try { raw = JSON.parse(fs.readFileSync(DATA, 'utf8')); } catch (e) { fail(`content/catalog-products.json did not parse: ${e.message}`); }
if (!raw.categories || typeof raw.categories !== 'object') fail('content/catalog-products.json has no categories object.');

/* The category labels are the site's own, from content/catalog.json, so the list
   names a category the way the site and the supplier will both recognise. */
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/catalog.json'), 'utf8'));
const labelFor = {};
for (const c of catalog.categories) {
  const slug = c.href.ro.replace(/^\/catalog\//, '').replace(/\/$/, '');
  labelFor[slug] = c.label.ro;
}

/* AMENDED (W24-03). The data changed shape: `categories` now maps a slug to a
   list of record ids and `products` holds the records, because ten product names
   are used by two products each on the source and a name cannot be the key. A
   subcategory slug is written parent/child, so the catalogue label lookup reads
   the last segment's own category where the whole path has none.

   And a brand is now optional. RC-150 failed the whole run on a record with no
   manufacturer; 9 of the 223 records carry no brand on the source and 27 carry
   one W17-02 refuses on a catalogue page, which build.js nulls. A slot with no
   brand is a slot that has to be requested by product, so it is listed with the
   brand column reading "not stated" rather than being fatal. What is still fatal
   is a record with no id or no name: that slot cannot be named at all. */
if (!Array.isArray(raw.products)) fail('content/catalog-products.json has no products array.');
const byId = new Map(raw.products.filter((r) => r && r.id).map((r) => [r.id, r]));

/* The request list is written by top-level category, which is how a supplier
   reads it, and a top-level list is already rolled up over its subcategories. So
   the subcategory slugs are walked past here, not dropped: the count assertion
   below fails if rolling up ever stops covering every record. */
const all = Object.keys(raw.categories);
if (!all.length) fail('no categories in content/catalog-products.json.');
const labelOf = (s) => labelFor[s] || null;
const slugs = all.filter((s) => labelOf(s));
const orphan = all.filter((s) => !labelOf(s) && !slugs.some((p) => s.startsWith(p + '/')));
if (orphan.length) fail(`${orphan.length} category slug(s) with no catalog category and no parent that has one: ${orphan.join(', ')}.`);
/* W27-FIX-15 (W27-R-21): an EXTERNAL category (Garduri, a tile and a menu row that open the fence
   models page) carries no records by design, so it is not counted against the data's slugs. */
const withRecords = catalog.categories.filter((c) => c.external !== true).length;
if (slugs.length !== withRecords) fail(`${slugs.length} top-level slugs in the data for ${withRecords} catalog categories that carry records.`);

/* One row per product, in catalogue order, never one per membership: a product in
   two categories needs one photograph, not two. Its first category names it. */
const rows = [];
const seen = new Set();
for (const slug of slugs) {
  const ids = raw.categories[slug] || [];
  ids.forEach((id, i) => {
    const r = byId.get(id);
    if (!r) fail(`${slug} entry ${i} names ${id}, which no record has, so its image cannot be requested.`);
    const name = r.name && r.name.ro;
    if (!name || !r.id) fail(`${slug} record ${i} has no id or name, so its image cannot be requested.`);
    if (seen.has(r.id)) return;
    seen.add(r.id);
    rows.push({
      slug, category: labelOf(slug), product: name,
      brand: r.brand || 'not stated',
      slot: r.slot || 'not assigned',
      file: `catalog-${slug.replace(/\//g, '-')}-${r.id}`,
    });
  });
}

/* Presence, not silence: every record the data holds must have been named by one
   of the top-level lists, or the request list is short and nobody can see it. */
const unlisted = raw.products.filter((r) => r && r.id && !seen.has(r.id));
if (unlisted.length) fail(`${unlisted.length} record(s) are in no top-level category, so no image would be requested for them: ${unlisted.slice(0, 5).map((r) => r.id).join(', ')}${unlisted.length > 5 ? ' ...' : ''}.`);

const today = new Date().toISOString().slice(0, 10);
const counts = slugs.map((s) => `${labelOf(s)} ${raw.categories[s].length}`).join(', ');

const body = `# Catalog product image slots

**Generated by \`node scripts/gen-catalog-image-slots.js\` from
\`content/catalog-products.json\`. Do not edit by hand:** \`quality\` runs the
generator with \`--check\` and fails when this file and the data disagree.

Card RC-150 (W21-05). This is the request list for suppliers: one row per catalog
product record, naming the product, its brand, its category and the aspect the site
renders a card image at. **Facts only.** No price, no stock, no availability.

## What each slot needs

| Property | Value | Where it comes from |
|---|---|---|
| Aspect | **1:1**, square | AMENDED (W24-03): the catalogue card the wave 24 dispatch specifies has a square image area on top, not the 4:3 the site's other cards use |
| Rendered size | 600 x 600 CSS px | the largest a catalogue card is rendered at, 306px wide at 1400px and above, taken at 2x |
| Files | \`<name>.jpg\` and \`<name>@2x.jpg\` (1200 x 1200) | every card image on the site ships a 1x and a 2x file |
| Photo slot | the \`Slot\` column, which is the same id \`docs/PHOTO-SLOTS-W24.json\` carries | W24-01: the placeholder on the card prints that id, so a supplier photograph and a session photograph fill the same named slot |
| Location | \`public/img/\` | where \`build.js\` reads image files from |
| Provenance | one row in \`docs/assets/PROVENANCE.md\`, in the same commit, with a real licence or supplier permission | ruling R-W |
| Permitted sources | a supplier's own product photograph, or licensed stock: a product slot is not a proof slot | master plan section 7 as amended by W14-18 |

**Until a slot has an approved source, nothing renders in its place.** RC-149 ships no
image markup on a product card at all, rather than an empty box.

## The slots

Product records today: **${rows.length}** (${counts}).

${rows.length === 0
  ? `**No slot is requestable yet, because no product record exists.** The catalog product
list is blocked: \`docs/QUESTIONS.md\` Q-W21-01 records why, and what a record needs. This
file fills itself from the data as soon as records land, and \`quality\` fails if it does
not.`
  : `| # | Slot | Category | Product | Brand | File name | Aspect | Size |
|---|---|---|---|---|---|---|---|
${rows.map((r, i) => `| ${i + 1} | \`${r.slot}\` | ${r.category} | ${r.product} | ${r.brand} | \`${r.file}.jpg\` + \`${r.file}@2x.jpg\` | 1:1 | 600 x 600 (1200 x 1200 at 2x) |`).join('\n')}`}

---

Generated ${today} from ${slugs.length} categories and ${rows.length} product records, of ${raw.products.length} in the data.
`;

if (CHECK) {
  if (!fs.existsSync(OUT)) fail(`${path.relative(ROOT, OUT)} does not exist. Run: node scripts/gen-catalog-image-slots.js`);
  const on_disk = fs.readFileSync(OUT, 'utf8');
  /* The trailing "Generated <date>" line moves with the calendar and not with the
     data, so it is compared by shape, not by value: everything above it must match
     byte for byte. */
  const strip = (s) => s.replace(/\nGenerated \d{4}-\d{2}-\d{2} from /, '\nGenerated <date> from ');
  if (strip(on_disk) !== strip(body)) {
    fail(`${path.relative(ROOT, OUT)} does not match content/catalog-products.json.\n  Run: node scripts/gen-catalog-image-slots.js\n  The request list and the records a supplier would be asked about must not disagree.`);
  }
  console.log(`catalog image slots: ${rows.length} slot(s) from ${slugs.length} categories; ${path.relative(ROOT, OUT)} matches the data.`);
  process.exit(0);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, body);
console.log(`wrote ${path.relative(ROOT, OUT)}: ${rows.length} slot(s) from ${slugs.length} categories (${counts}).`);
