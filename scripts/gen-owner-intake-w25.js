#!/usr/bin/env node
/* Writes docs/OWNER-INTAKE-W25.md, the two lists the owner drops files against.
   Card W25-16.

       node scripts/gen-owner-intake-w25.js [--check]

   GENERATED, for the reason every list in this repo is: a slot id typed by hand
   is a file the intake will not find, and the intake matches on the filename
   being the slot id exactly. The model names come from
   content/garduri-modele.json and the tile labels from the BUILT pages, so a
   label here is the label a visitor reads rather than a description of it.

   `--check` fails if the committed file and the data have drifted apart, and
   `quality` runs it. Zero dependency. */

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'docs/OWNER-INTAKE-W25.md');
const REAL = '/Users/ivan/RC-pics-real/';
const AI = '/Users/ivan/RC-pics-ai/';
const die = (m) => { console.error(`\nOWNER INTAKE FAILED: ${m}\n`); process.exit(1); };
const read = (p) => { const f = path.join(ROOT, p); if (!fs.existsSync(f)) die(`${p} is missing.`); return fs.readFileSync(f, 'utf8'); };

const ledger = JSON.parse(read('docs/PHOTO-SLOTS-W24.json'));
const models = JSON.parse(read('content/garduri-modele.json')).models;
const rows = new Map(ledger.slots.map((r) => [r.id, r]));

/* (a) the fence model cards. The id is positional in build.js: GARD-01 is
   models[0], which is the one thing about these slots that is not in the ledger,
   so it is read from the same place build.js reads it.

   AMENDED (W25-18, under W25-R15). The owner override filled all eight from
   imperlux.md, so the fence list is EMPTY and `RC-pics-real` is no longer waiting
   on them. The list is still built the same way and still refuses a gap: what
   changed is that a filled slot now drops OFF the list instead of failing it,
   and the count is asserted against the ledger rather than against the number 8.
   A hard 8 would have turned the owner's own decision into a red gate. */
const fenceAll = models.map((m, i) => {
  const id = `GARD-${String(i + 1).padStart(2, '0')}`;
  const row = rows.get(id);
  if (!row) die(`${id} has no ledger row, so build.js could not be rendering it.`);
  return { id, name: `${m.designation} ${m.material}`, page: row.page, ratio: row.ratio, min_px: row.min_px, filled: row.state === 'filled' };
});
if (fenceAll.length !== 8) die(`expected 8 fence model slots in the data, found ${fenceAll.length}.`);
const fence = fenceAll.filter((f) => !f.filled);

/* (b) the hub tiles. The LABEL is lifted from the built page, so it is the words
   a visitor reads. A tile whose slot renders on no built page is a failure, not a
   blank cell. */
const DIST = path.join(ROOT, 'dist');
if (!fs.existsSync(DIST)) die('no dist/, run: node build.js');
const HUBS = [
  { prefix: 'ACOP-', file: 'dist/servicii/acoperisuri/index.html' },
  { prefix: 'GARDB-', file: 'dist/servicii/garduri/index.html' },
];
const hub = [];
let hubSeen = 0;
for (const h of HUBS) {
  const html = read(h.file);
  const ids = [...new Set([...html.matchAll(new RegExp(`data-photo-slot="(${h.prefix}\\d+)"`, 'g'))].map((m) => m[1]))].sort();
  if (!ids.length) die(`no ${h.prefix} slot renders on ${h.file}.`);
  hubSeen += ids.length;
  for (const id of ids) {
    const row = rows.get(id);
    if (!row) die(`${id} renders on ${h.file} and has no ledger row.`);
    if (row.state === 'filled') continue;
    /* The label is the first heading or label text after the slot on the page. */
    const at = html.indexOf(`data-photo-slot="${id}"`);
    const after = html.slice(at, at + 2600);
    /* AMENDED (W26-04): `.pb__label` too. W26-R5 adds a SECOND bento on the roofing
       page whose four tiles are ACOP-05 to ACOP-08, and it carries its own prefix
       on purpose (see build.js). Reading only the hub's label class made this
       generator die on the first of them, which is the right failure: a slot with
       no label beside it is a slot the owner cannot be told what to photograph. */
    const m = after.match(/class="(?:hub|pb)__label"[^>]*>([\s\S]*?)</) || after.match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
    const label = m ? m[1].replace(/<[^>]+>/g, '').trim() : null;
    if (!label) die(`${id} renders on ${h.file} and no label could be read beside it.`);
    hub.push({ id, label, page: row.page, ratio: row.ratio, min_px: row.min_px });
  }
}
/* AMENDED (W25-18): the same change, for the same reason. GARDB-01 to GARDB-04
   are filled under W25-R15, so four hub tiles wait and not eight. What is still
   asserted is that the generator SAW both hub families: a prefix that renders on
   no page is a failure above, and a list that is empty because the walk broke
   would be indistinguishable from one that is empty because the work is done. */
/* AMENDED (W26-11): everything IS filled now, and this is where that is stated
   deliberately rather than inferred from silence. Both lists empty is accepted
   only when the walk demonstrably saw what it walks (all eight fence cards and
   every hub tile both pages render) AND the whole ledger reads filled. Anything
   less is still the broken walk this line always refused. */
const ALL_FILLED = !hub.length && !fence.length;
if (ALL_FILLED) {
  const empty = ledger.slots.filter((r) => r.state !== 'filled').map((r) => r.id);
  if (empty.length) die(`both lists are empty and ${empty.length} ledger row(s) are not filled (${empty.slice(0, 8).join(', ')}), so the walk missed them.`);
  if (hubSeen !== 13) die(`both lists are empty and the walk saw ${hubSeen} hub tiles, not the 13 the two hubs render (9 roofing since W27-C-02, 4 fence).`);
}

const L = [];
L.push('# Owner intake, wave 25');
L.push('');
L.push('Generated by `node scripts/gen-owner-intake-w25.js` from `docs/PHOTO-SLOTS-W24.json`,');
L.push('`content/garduri-modele.json` and the built pages. Not typed: a slot id typed by hand is');
L.push('a file the intake will not find, because it matches on the filename being the slot id');
L.push('exactly. `--check` fails if this file and the data have drifted apart.');
L.push('');
/* AMENDED (W25-21): W25-16 prepared the folders and had nothing to take them in
   with. There is a script now, so this says what to run rather than that nothing
   happened, which stopped being the useful sentence the moment one existed. */
L.push('**To take a drop in:** `node scripts/intake-owner-pics.js` reports what is waiting and');
L.push('writes nothing. Add `--apply` plus `--who "<name>"` for a photograph or `--tool "<name>"`');
L.push('for a generated image, and it installs, fills the ledger row and appends the provenance');
L.push('row. It refuses a stem that is no slot id, a slot already filled, a file that is not an');
L.push('image by its bytes, anything under the 450 floor, and a generated image where W25-R3 or');
L.push('W25-R2 forbids one. **A missing file is listed, never an error.**');
L.push('');
L.push('## The rule, once');
L.push('');
L.push(`- **The filename is the slot id**, plus an extension. \`GARD-01.jpg\`, \`ACOP-02.png\`.`);
L.push('- **Longest side 450 pixels or more.** Nothing is ever enlarged, so a smaller file is');
L.push('  refused rather than stretched.');
L.push(`- **A real photograph goes in \`${REAL}\`.** A generated one goes in \`${AI}\`.`);
L.push('  They take different provenance rows, and a generated image is forbidden on some slots');
L.push('  while a real one never is.');
L.push('');
L.push(`## (a) Fence model cards, ${fence.length}, real photographs`);
L.push('');
if (!fence.length) {
  L.push(`**Nothing is waiting here, and \`${REAL}\` is not expected to receive a fence.**`);
  L.push('All eight model cards were filled at W25-18 from `imperlux.md` under the owner override');
  L.push('W25-R15. A real photograph of one of these fences from the owner\'s own project set is');
  L.push('still the better picture and would replace the override file, but nothing is blocked on');
  L.push('it and no card is waiting for it.');
} else {
  L.push(`Drop these in \`${REAL}\`. Their reason in the review list is already "real photo from`);
  L.push('owner project set", and they are deliberately left out of the AI prompt pack so nothing');
  L.push('generates a fence a real photograph is coming for.');
  L.push('');
  L.push('| File to save | Model | Page |');
  L.push('|---|---|---|');
  for (const f of fence) L.push(`| \`${f.id}.jpg\` | ${f.name} | ${f.page} |`);
  L.push('');
  L.push(`All ${fence.length} are PORTRAIT, ratio \`${fence[0].ratio}\`, minimum ${fence[0].min_px}.`);
  L.push('Photograph the fence square-on and dead level, so the slat profile and the gap between');
  L.push('slats read. That is what the card exists to show.');
}
L.push('');
L.push(`## (b) Hub tiles, ${hub.length}, the PRIORITY BATCH`);
L.push('');
if (!hub.length) {
  L.push(`**Nothing is waiting here.** All ${hubSeen} hub tiles on the two hubs are filled.`);
  if (ALL_FILLED) {
    L.push('');
    L.push(`**And nothing is waiting anywhere: all ${ledger.slots.length} ledger rows are filled** (W26-11). A`);
    L.push('real photograph from the owner\'s own work is still the better picture for any tile that');
    L.push('holds a supplier or library image, and the intake still takes one, but no slot is empty.');
  }
} else {
  L.push(`Drop these in \`${AI}\`. They are the first block in`);
  L.push('`~/Documents/rc-audit-w24/AI-PROMPTS-W25.md`, each with its own prompt.');
  L.push('');
  L.push('| File to save | Tile | Page | Ratio | Minimum |');
  L.push('|---|---|---|---|---|');
  for (const t of hub) L.push(`| \`${t.id}.png\` | ${t.label} | ${t.page} | ${t.ratio} | ${t.min_px} |`);
  L.push('');
  L.push(`These ${hub.length} ratios are not all the same, and the prompt for each names its own.`);
}
L.push('');

const text = L.join('\n');
if (process.argv.includes('--check')) {
  if (!fs.existsSync(OUT)) die('docs/OWNER-INTAKE-W25.md is missing. Run: node scripts/gen-owner-intake-w25.js');
  if (fs.readFileSync(OUT, 'utf8') !== text) die('docs/OWNER-INTAKE-W25.md does not match the data.\n  Run: node scripts/gen-owner-intake-w25.js');
  console.log(`owner intake check: ${fence.length} fence cards, ${hub.length} hub tiles, file matches the data.`);
  process.exit(0);
}
fs.writeFileSync(OUT, text);
console.log(`wrote docs/OWNER-INTAKE-W25.md: ${fence.length} fence model cards, ${hub.length} hub tiles.`);
