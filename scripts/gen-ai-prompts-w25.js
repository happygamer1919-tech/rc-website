#!/usr/bin/env node
/* Writes the wave 25 AI prompt pack. Card W25-05.

       node scripts/gen-ai-prompts-w25.js [output-path]

   Default output: ~/Documents/rc-audit-w24/AI-PROMPTS-W25.md, OUTSIDE the repo,
   because W25-R3 makes a generated image the owner's own asset and its prompt is
   working material, not a governing document. Nothing this writes enters the
   repo, so no gate reads it and this script generates rather than a person types:
   126 entries built by hand from 261 ledger rows would be wrong somewhere.

   WHAT DECIDES WHETHER A SLOT GETS AN ENTRY, in the order the rules were given:
     · W25-R3: a generated image is allowed ONLY on a product, hub, hero or
       cross-sell slot, and NEVER on a project, portfolio or before/after slot,
       which are evidence. The `BA-` slots are held on that.
     · W25-R2: no generated image on a NAMED TILE PRODUCT. The 88 ceramic plates
       are held on that, and so are the four Novatik roof tiles, which are named
       tiles by the same words.
     · A slot already filled with a real photograph is not asked for again.
     · A product that HAS a manufacturer is packshot work and not prompt work: the
       manufacturer publishes a photograph of it and W25-R1 prefers that.
   Every held slot is listed in the pack with its reason. A pack that silently
   dropped 135 of 261 rows would read as "everything is covered".

   THE ONE THING THE OWNER HAS TO DECIDE, and it is stated in the pack rather than
   buried: for some products the records carry no description of what the product
   LOOKS like. A lamp called `K1207` and a moulding called `RED 17` are a code and
   a price per metre. A generated picture of those is illustrative of the type and
   is not a portrait of that item. W25-R3 permits it on a product slot, so the
   pack produces the entry and marks it, rather than deciding for the owner. */

const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.join(__dirname, '..');
const OUT = process.argv[2] || path.join(os.homedir(), 'Documents/rc-audit-w24/AI-PROMPTS-W25.md');
const INTAKE = '/Users/ivan/RC-pics-ai/';
const die = (m) => { console.error(`\nPROMPT PACK FAILED: ${m}\n`); process.exit(1); };

const ledger = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/PHOTO-SLOTS-W24.json'), 'utf8'));
const productJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/catalog-products.json'), 'utf8'));
const products = Array.isArray(productJson) ? productJson : (productJson.products || []);
if (!Array.isArray(ledger.slots) || !ledger.slots.length) die('the ledger has no slots.');
if (!products.length) die('content/catalog-products.json parsed to zero records.');

const bySlot = new Map(products.filter((p) => p.slot).map((p) => [p.slot, p]));
const REAL = (b) => b !== null && b !== undefined && String(b).trim() !== '';

/* --- who is in and who is held ------------------------------------------- */

const HELD_REASONS = {
  filled: 'already filled with a real photograph',
  evidence: 'an evidence slot: W25-R3 forbids a generated image on a project, portfolio or before/after slot, because a render is never a proof image',
  tile: 'a named tile product: W25-R2 forbids a generated image on one, because a tile is sold by its exact appearance',
  manufacturer: 'the product names a manufacturer, so it is packshot work under W25-R1 and not prompt work',
  /* W25-R9 closes Q-W25-12 at option (d). W25-05 wrote 126 prompts and marked 89
     of them "appearance: not in the records"; the owner refuses those outright,
     including the 25 lamps this terminal recommended generating. An illustrative
     lamp is still not a picture of K1207. */
  unknown: 'the records do not describe what this product looks like: W25-R9 forbids a generated image there, and it waits on the client',
  /* W25-12. Real photographs exist for these and are coming from the owner's own
     project set, so a generated one would be replaced the day they arrive. */
  ownerphoto: 'a real photograph from the owner project set is coming for this slot (W25-12)',
};

/* W25-12. The owner's priority is Catalog, Acoperisuri and Garduri, and the two
   hub pages are the largest visible gap left in the last two. These eight go
   first, in their own batch at the top of the pack, so the owner generating five
   minutes' worth generates the five minutes that matter. */
const PRIORITY_ALL = ['ACOP-01', 'ACOP-02', 'ACOP-03', 'ACOP-04', 'GARDB-01', 'GARDB-02', 'GARDB-03', 'GARDB-04'];
/* AMENDED (W25-18): a batch slot leaves the batch by being FILLED, and by nothing
   else. `GARDB-01` to `GARDB-04` were filled from imperlux.md under W25-R15, so
   they are no longer asked for. Deleting them from the constant instead would
   have removed the assertion along with them, and the assertion is the point: a
   slot that is still empty and has quietly fallen out of the pack must still be a
   failure. The ledger decides; this list stays whole. */
const PRIORITY = PRIORITY_ALL.filter((id) => {
  const row = ledger.slots.find((r) => r.id === id);
  if (!row) die(`the priority batch names ${id}, which has no ledger row.`);
  return row.state !== 'filled';
});

const entries = [];
const held = [];
for (const row of ledger.slots) {
  const p = bySlot.get(row.id);
  const push = (why) => held.push({ id: row.id, why, name: p ? p.name.ro : null });
  if (row.state === 'filled') { push('filled'); continue; }
  if (row.id.startsWith('BA-')) { push('evidence'); continue; }
  if (row.id.startsWith('NVK-')) { push('tile'); continue; }
  if (row.id.startsWith('GARD-')) { push('ownerphoto'); continue; }
  if (p) {
    if ((p.categories || []).includes('placi-ceramice')) { push('tile'); continue; }
    if (REAL(p.brand) && !p.brand_hidden) { push('manufacturer'); continue; }
  }
  if (!appearanceKnown(row, p || null)) { push('unknown'); continue; }
  entries.push({ row, product: p || null });
}
if (!entries.length) die('zero entries, so the pack would say the work is done.');

/* --- the prompt for one slot --------------------------------------------- */

/* Written per group rather than per slot. A group's sentence says what the thing
   IS; the record supplies what it is CALLED and any size or variant line it
   carries. Nothing invents a brand, a logo or a finished Rapid Construct job. */

const strip = (s) => String(s || '').replace(/\s+/g, ' ').trim();

function promptFor(row, p) {
  const id = row.id;
  const v = p && p.variant && p.variant.ro ? strip(p.variant.ro) : '';
  const n = p ? strip(p.name.ro) : '';

  if (id.startsWith('CATEG-')) {
    const what = strip(row.shows).replace(/^Categoria\s*/, '').replace(/^"(.*?)".*$/, '$1');
    return `A tight, honest product group shot representing the building-materials category "${what}". Show the materials themselves, arranged simply on a plain light grey studio surface against a seamless light background. No packaging with readable branding, no logos, no printed text of any kind, no people, no hands, no tools in use, no building in the background.`;
  }
  if (id === 'COP-HERO') {
    return 'A modern metal carport canopy over one parked car, photographed from the front three-quarter on the right, outdoors in flat overcast daylight. The canopy is plain powder-coated steel with a simple flat or single-slope roof. Leave clear, uncluttered space along the left third of the frame for text. No brand marks, no company name, no signage, no people, no licence plate, no house in sharp focus.';
  }
  if (id.startsWith('COPX-')) {
    const what = strip(row.shows).replace(/:.*$/, '');
    return `An illustrative wide shot for a cross-sell card: ${what.toLowerCase()}. Outdoors or in a clean storage yard, flat overcast daylight, plain and orderly. No brand marks, no logos, no printed text, no people, no company signage.`;
  }
  if (id.startsWith('GARD-')) {
    const model = (strip(row.shows).match(/"([^"]+)"/) || [])[1] || id;
    return `A metal slatted fence panel, model "${model}", photographed square-on and dead level in PORTRAIT orientation, filling the frame, outdoors in flat overcast daylight. The picture exists to show the slat profile and the gap between slats, so keep the camera perpendicular to the fence and the slats parallel to the frame edges. Plain, uncluttered background behind the fence. No house, no garden furniture, no people, no brand marks, no printed text.`;
  }
  if (id.startsWith('GARDB-') || id.startsWith('ACOP-')) {
    return `${strip(row.shows)} Flat overcast daylight, plain and orderly, nothing staged. No brand marks, no logos, no printed text, no people's faces, no company signage.`;
  }
  if (id.startsWith('CAT-') && p && (p.categories || []).includes('sisteme-iluminare')) {
    return `A single outdoor wall lantern for a house facade, product photography on a seamless white background, lit softly and evenly from the front left, the whole fixture in frame with a little space around it. Plain contemporary design: a metal body in matt black or dark bronze with clear or frosted glass. Straight-on three-quarter view. One lamp only. No wall, no bracket cut off at the frame edge, no people, no text, no logo, no brand mark, no watermark.${v ? ` Colour temperature stated on the record: ${v}.` : ''}`;
  }
  if (id.startsWith('CAT-') && p && (p.categories || []).includes('elemente-decorative')) {
    return `A single facade decorative moulding, one straight length of profiled trim, photographed at a three-quarter angle so the profile of the cut end is clearly visible, on a seamless white background with soft even studio light. Plain white primed finish, no paint colour, no gilding. One piece only, nothing stacked. No wall, no house, no people, no text, no logo, no measuring tape, no brand mark.${v ? ` The record describes it as: ${v}.` : ''}`;
  }
  if (id.startsWith('CAT-') && p) {
    /* The unbranded building materials. The MATERIAL, never a package: the record
       carries a trade name on some of these and a generated bag wearing it would
       be a manufacturer's packaging that does not exist. */
    const material = n.toLowerCase();
    if (/polistiren/.test(material)) return `Several boards of expanded polystyrene insulation stacked neatly on a plain light studio background, photographed at a three-quarter angle so the board edge and the bead texture are both visible. The material itself, unwrapped, with no printed film, no label, no brand mark, no text of any kind, no people.${v ? ` Thicknesses on the record: ${v}.` : ''}`;
    if (/adeziv|mase de spaclu|dibaci/.test(material)) return `A neat cone of grey cement-based adhesive powder poured on a plain light studio surface, with a clean steel notched trowel laid beside it. The material itself, never a sack: no printed packaging, no label, no brand mark, no text of any kind, no people, no hands.`;
    if (/tencuial/.test(material)) return `A flat sample board of decorative silicone render in a neutral off-white, photographed straight on and filling the frame, lit from a low side angle so the grain texture reads clearly. The finished surface only: no bucket, no packaging, no label, no brand mark, no text, no people.${v ? ` Grain sizes on the record: ${v}.` : ''}`;
    if (/diblu/.test(material)) return `A small loose group of facade insulation fixings, plastic-sleeved anchors with wide round heads, laid flat on a seamless white background and photographed from slightly above. Clean, unbranded, no packaging, no label, no text, no logo, no people.${v ? ` Lengths on the record: ${v}.` : ''}`;
    if (/membran/.test(material)) return `A part-unrolled roll of grey roofing diffusion membrane on a seamless white background, photographed at a three-quarter angle so both the roll and the unrolled sheet are visible. The material only: no printed logo, no brand mark, no printed text on the sheet, no label, no people.${v ? ` Roll size on the record: ${v}.` : ''}`;
    if (/plas[ăa] de armare/.test(material)) return `A part-unrolled roll of white fibreglass reinforcing mesh on a seamless white background at a three-quarter angle, the square weave clearly visible in the unrolled part. No printed branding on the mesh, no label, no text, no people.${v ? ` Roll size on the record: ${v}.` : ''}`;
    if (/col[țt]ar/.test(material)) return `A few lengths of white PVC corner bead with fibreglass mesh wings, laid together on a seamless white background and photographed at a three-quarter angle so the angle profile reads. No packaging, no label, no text, no logo, no people.${v ? ` Length on the record: ${v}.` : ''}`;
    return `A plain, honest product photograph of the building material "${n}" on a seamless white background, soft even studio light, the material itself rather than its packaging. No label, no brand mark, no printed text, no logo, no people.${v ? ` The record adds: ${v}.` : ''}`;
  }
  return `${strip(row.shows)} Plain, honest, flat overcast daylight or soft studio light. No brand marks, no logos, no printed text, no people's faces.`;
}

/* Does the record describe what the product LOOKS like, or only name it? */
function appearanceKnown(row, p) {
  if (!p) return true;                                   // service and hub slots are described by the ledger
  if ((p.categories || []).includes('sisteme-iluminare')) return false;
  if ((p.categories || []).includes('elemente-decorative')) return false;
  return true;
}

/* --- the pack ------------------------------------------------------------- */

const groupOf = (id, p) => {
  if (id.startsWith('CATEG-')) return 'Catalogue category tiles';
  if (id === 'COP-HERO') return 'Copertine hero';
  if (id.startsWith('COPX-')) return 'Cross-sell cards';
  if (id.startsWith('GARD-')) return 'Fence model cards';
  if (id.startsWith('GARDB-')) return 'Garduri hub tiles';
  if (id.startsWith('ACOP-')) return 'Acoperisuri hub tiles';
  if (p && (p.categories || []).includes('sisteme-iluminare')) return 'Sisteme de iluminare';
  if (p && (p.categories || []).includes('elemente-decorative')) return 'Elemente decorative';
  return 'Unbranded building materials';
};

const GROUP_ORDER = ['Catalogue category tiles', 'Acoperisuri hub tiles', 'Garduri hub tiles', 'Copertine hero', 'Cross-sell cards', 'Fence model cards', 'Unbranded building materials', 'Sisteme de iluminare', 'Elemente decorative'];

const byGroup = new Map();
for (const e of entries) {
  const g = groupOf(e.row.id, e.product);
  if (!byGroup.has(g)) byGroup.set(g, []);
  byGroup.get(g).push(e);
}
for (const g of byGroup.keys()) if (!GROUP_ORDER.includes(g)) die(`group "${g}" has no place in GROUP_ORDER, so entries would be dropped from the pack.`);

const unknown = entries.filter((e) => !appearanceKnown(e.row, e.product)).length;
if (unknown) die(`${unknown} entr(y/ies) whose appearance is not in the records survived into the pack. W25-R9 forbids them.`);
const priority = entries.filter((e) => PRIORITY.includes(e.row.id));
const rest = entries.filter((e) => !PRIORITY.includes(e.row.id));
const missingPriority = PRIORITY.filter((id) => !entries.some((e) => e.row.id === id));
const priorityFilled = PRIORITY_ALL.filter((id) => !PRIORITY.includes(id));

/* One entry, written once so the priority batch and the groups cannot drift. */
const L = [];
function entry(e) {
  const { row, product } = e;
  L.push(`#### ${row.id}`);
  L.push('');
  L.push(`- **File to save:** \`${row.id}.png\` in \`${INTAKE}\``);
  L.push(`- **Aspect ratio:** ${row.ratio}`);
  L.push(`- **Minimum pixels:** ${row.min_px}`);
  L.push(`- **Renders on:** ${row.page}`);
  if (product) L.push(`- **Product:** ${strip(product.name.ro)}${product.variant && product.variant.ro ? ` (${strip(product.variant.ro)})` : ''}`);
  L.push('');
  L.push('```');
  L.push(promptFor(row, product));
  L.push('```');
  L.push('');
}
L.push('# AI prompt pack, wave 25');
L.push('');
L.push(`Generated by \`node scripts/gen-ai-prompts-w25.js\` from \`docs/PHOTO-SLOTS-W24.json\` and`);
L.push('`content/catalog-products.json`. Not typed, so it cannot disagree with the ledger.');
L.push('Re-run it after any card that fills a slot and it shrinks by itself.');
L.push('');
L.push(`**${entries.length} images to generate.** ${held.length} of the ledger's ${ledger.slots.length} rows are held, each with its reason, at the foot of this file.`);
L.push('');
L.push('## How to use it');
L.push('');
L.push(`1. Generate each image with the shared style block **plus** the entry's own prompt.`);
L.push(`2. Save it as the entry's filename, which is the slot id with \`.png\`. The name is how the slot is found; it is not cosmetic.`);
L.push(`3. Put every file in \`${INTAKE}\`. W25-06 takes them from there.`);
L.push('4. Anything you skip stays a grey placeholder, which is a fine outcome (W25-R4).');
L.push('');
L.push('## What W25-R9 removed from this pack, and what happened to it');
L.push('');
L.push('The wave 25 pack used to carry 126 entries, 89 of them marked "appearance: not in the');
L.push('records": the 25 outdoor lamps and the 64 facade mouldings, which the data described only');
L.push('by a shop code and a price. **W25-R9 forbids a generated image on any product card whose');
L.push('appearance is not in the records**, so they left this pack and waited on the client.');
L.push('');
L.push('**They no longer wait.** W25-R14 extended the `direct_supplier` origin to `fatade3d.md`,');
L.push('and W25-17 filled 89 of those 89 slots with the supplier\'s own product photographs. They');
L.push('are held below as `filled`, not as "waiting". Nothing in this pack is a guess at what a');
L.push('product looks like, and nothing was generated to stand in for one.');
L.push('');
L.push('## Shared style block, put it in front of every prompt');
L.push('');
L.push('```');
L.push('Photographic, not illustration. One coherent set: the same soft, even, neutral studio light,');
L.push('the same clean white or light grey seamless background, the same restrained realism throughout.');
L.push('Sharp focus across the subject, natural material texture, true neutral colour, no colour cast.');
L.push('No text, no lettering, no numbers, no watermark, no logo, no brand mark, no packaging label.');
L.push('No people, no faces, no hands. No company name or signage anywhere in frame.');
L.push('Nothing that implies a completed job by any particular builder.');
L.push('No heavy vignette, no lens flare, no artificial bokeh, no dramatic colour grade, no HDR look.');
L.push('```');
L.push('');
L.push('**Why the "no text" line is first among equals.** W25-R2 refuses a photograph with a');
L.push('product name burned into it, and that refusal is what keeps 60 ceramic plates grey today.');
L.push('A generated image that invents lettering fails the same rule.');
L.push('');
L.push('## Entries');
L.push('');

/* W25-12. The priority batch, first and labelled, so the owner can stop after it. */
if (missingPriority.length) die(`the priority batch names ${missingPriority.length} slot(s) this pack does not carry: ${missingPriority.join(', ')}. A batch that quietly loses a slot is worse than no batch.`);
if (priority.length) {
  L.push(`## PRIORITY BATCH (${priority.length})`);
  L.push('');
  L.push(`**Generate these ${priority.length} first.** They are the hub tiles still empty on the pages the`);
  L.push('owner named as the priority after the catalogue. They are the largest visible gap left on');
  L.push('the page they sit on, and a visitor meets them before anything else on it.');
  if (priorityFilled.length) {
    L.push('');
    L.push(`**${priorityFilled.length} left this batch by being filled**, not by being dropped: `
      + priorityFilled.map((id) => '`' + id + '`').join(', ')
      + '. W25-18 filled them from `imperlux.md` under the owner override W25-R15. The batch is'
      + ' still the whole list in the generator, and a slot that is still empty and falls out of'
      + ' the pack is still a failure.');
  }
  L.push('');
  for (const e of priority) entry(e);
}

for (const g of GROUP_ORDER) {
  const list = (byGroup.get(g) || []).filter((e) => !PRIORITY.includes(e.row.id));
  if (!list.length) continue;
  L.push(`### ${g} (${list.length})`);
  L.push('');
  for (const e of list) entry(e);
}

L.push('## Held, with the reason for each');
L.push('');
L.push(`${held.length} of the ledger's ${ledger.slots.length} rows are not in this pack. They are listed because a pack that`);
L.push('quietly dropped them would read as covering everything.');
L.push('');
const heldByReason = new Map();
for (const h of held) {
  if (!heldByReason.has(h.why)) heldByReason.set(h.why, []);
  heldByReason.get(h.why).push(h);
}
for (const [why, list] of heldByReason) {
  L.push(`### ${list.length}: ${HELD_REASONS[why]}`);
  L.push('');
  L.push(list.map((h) => `\`${h.id}\``).join(' · '));
  L.push('');
}
L.push('## The tiles, said once more because it is the biggest group');
L.push('');
L.push('**63 ceramic plates and 4 Novatik roof tiles are held and no prompt exists for them.**');
L.push('W25-R2: "no AI image on any named tile product", because a tile is sold by its exact');
L.push('appearance and a render of one is an invented appearance under a real product name.');
L.push('That rule is why 60 Phomi colour variants stayed grey rather than taking a photograph');
L.push('with the wrong name printed on it, and generating them here would walk straight around it.');
L.push('');

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, L.join('\n'));
console.log(`wrote ${OUT}`);
console.log(`entries: ${entries.length}   held: ${held.length}   ledger rows: ${ledger.slots.length}`);
for (const [why, list] of heldByReason) console.log(`  held ${String(list.length).padStart(3)}  ${why}`);
console.log(`entries whose appearance is not in the records: ${unknown}`);
