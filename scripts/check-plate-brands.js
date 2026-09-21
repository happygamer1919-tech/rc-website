#!/usr/bin/env node
/* Gate 23. Card W25-03d.

   WHAT THIS EXISTS FOR. The site told visitors for two days that Phomi makes 70
   products Phomi does not make, and then told the owner that 70 was the number,
   and then that 37 was, and then that 3 is. Each of those was a research result
   held in prose, and prose is not state: nothing in the repo could disagree with
   a wrong one. `content/catalog-products.json` carries the brand line the site
   prints, and until now the only thing standing behind it was a sentence on a
   board card.

   So the settlement is DATA now, in `content/plate-brand-settlement.json`: one
   row per plate, naming the manufacturer, the exact catalogue name it matched,
   how it matched and the catalogue page. This holds the records to it.

   WHAT IT CHECKS, in both directions:
     · every plate in `placi-ceramice` has a settlement row, and every row is a
       plate (a row for a product that no longer exists is a settlement nobody
       can check);
     · a row naming a manufacturer: the record's `brand` equals it, and the
       record does NOT carry `brand_hidden`. Hiding the brand of a plate whose
       maker is settled is throwing away a fact the site is allowed to state;
     · a row naming no manufacturer: the record DOES carry `brand_hidden`
       (W25-R3: `brand_hidden` is applied only to a plate unmatched after all
       three catalogues), and nothing else may carry it;
     · every row naming a manufacturer names the catalogue name it matched, at a
       tier the file itself declares, with a catalogue URL. A row that matched
       "somehow" is the prose this file replaces.

   WHAT IT CANNOT CHECK, said plainly. It does not visit phomi.com. A settlement
   row is a record of research, and re-doing the research is a card, not a gate.
   What this stops is the records and the settlement drifting apart silently,
   which is exactly how the 70 survived: the brand line was edited by one card
   and the claim about it lived in another.

   Zero dependency, no browser, no network. */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PRODUCTS = path.join(ROOT, 'content/catalog-products.json');
const SETTLEMENT = path.join(ROOT, 'content/plate-brand-settlement.json');
const CATEGORY = 'placi-ceramice';

const fail = (msg) => { console.error(`\nPLATE BRAND GATE FAILED: ${msg}\n`); process.exit(1); };

/* --- the rule, as a pure function so the self-test can plant into it --------- */

function check(records, settled, tiers) {
  const problems = [];
  const plates = records.filter((r) => (r.categories || []).includes(CATEGORY));
  const bySlot = new Map(plates.map((r) => [r.slot, r]));
  const rowFor = new Map();

  for (const row of settled) {
    if (rowFor.has(row.slot)) {
      problems.push({ id: 'duplicate-row', text: `the settlement has two rows for ${row.slot}. One plate, one settlement.` });
      continue;
    }
    rowFor.set(row.slot, row);
    const rec = bySlot.get(row.slot);
    if (!rec) {
      problems.push({ id: 'orphan-row', text: `the settlement has a row for ${row.slot}, which is not a product in ${CATEGORY}. A settlement nobody can check is not a settlement.` });
      continue;
    }
    if (row.brand) {
      if (rec.brand !== row.brand) {
        problems.push({ id: 'brand-disagrees', text: `${row.slot} "${row.ours}": the settlement says ${row.brand} and the record says ${rec.brand === undefined ? 'no brand' : `"${rec.brand}"`}. The brand line is a factual claim about a manufacturer.` });
      }
      if (rec.brand_hidden) {
        problems.push({ id: 'hidden-but-settled', text: `${row.slot} "${row.ours}" carries brand_hidden and the settlement names ${row.brand} as its maker, matched as "${row.matched_as}". W25-R3: brand_hidden is for a plate unmatched after all three catalogues.` });
      }
      if (!row.matched_as || !String(row.matched_as).trim()) {
        problems.push({ id: 'no-matched-name', text: `${row.slot} "${row.ours}" is settled as ${row.brand} and names no catalogue name it matched.` });
      }
      if (!row.catalogue_url) {
        problems.push({ id: 'no-catalogue-url', text: `${row.slot} "${row.ours}" is settled as ${row.brand} and names no catalogue page.` });
      }
      if (!tiers[row.tier]) {
        problems.push({ id: 'unknown-tier', text: `${row.slot} "${row.ours}" matched at tier "${row.tier}", which the settlement file does not declare.` });
      }
    } else {
      if (!rec.brand_hidden) {
        problems.push({ id: 'unmatched-not-hidden', text: `${row.slot} "${row.ours}" is in none of the three catalogues and does not carry brand_hidden, so the site still names a manufacturer for it.` });
      }
    }
  }

  for (const rec of plates) {
    if (!rowFor.has(rec.slot)) {
      problems.push({ id: 'unsettled-plate', text: `${rec.slot} is a product in ${CATEGORY} with no settlement row, so nothing in the repo says which manufacturer it comes from.` });
    }
  }
  return problems;
}

/* --- the self-test, before any real result --------------------------------- */

const TIERS = { 'A-exact': 'x', unmatched: 'x' };
const REC = (slot, extra) => Object.assign({ slot, categories: [CATEGORY], brand: 'Phomi', name: { ro: 'Placă X', ru: 'Плитка X' } }, extra || {});
const ROW = (slot, extra) => Object.assign({ slot, ours: 'X', brand: 'Phomi', matched_as: 'X', level: 'family', tier: 'A-exact', catalogue_url: 'https://phomi.com/x/' }, extra || {});

const CONTROL = { records: [REC('SELF-01'), REC('SELF-02', { brand_hidden: true })], settled: [ROW('SELF-01'), ROW('SELF-02', { brand: null, matched_as: null, tier: 'unmatched', catalogue_url: null })] };

const SELF = [
  { arm: 'a plate in the category with no settlement row', want: 'unsettled-plate',
    records: [REC('SELF-01'), REC('SELF-03')], settled: [ROW('SELF-01')] },
  { arm: 'a settlement row for a product that does not exist', want: 'orphan-row',
    records: [REC('SELF-01')], settled: [ROW('SELF-01'), ROW('SELF-04')] },
  { arm: 'the record names a different manufacturer from the settlement', want: 'brand-disagrees',
    records: [REC('SELF-01', { brand: 'Kordeko' })], settled: [ROW('SELF-01')] },
  { arm: 'brand_hidden on a plate whose maker is settled', want: 'hidden-but-settled',
    records: [REC('SELF-01', { brand_hidden: true })], settled: [ROW('SELF-01')] },
  { arm: 'a plate in no catalogue that still shows a manufacturer', want: 'unmatched-not-hidden',
    records: [REC('SELF-01')], settled: [ROW('SELF-01', { brand: null, matched_as: null, tier: 'unmatched', catalogue_url: null })] },
  { arm: 'a settled row that names no catalogue name', want: 'no-matched-name',
    records: [REC('SELF-01')], settled: [ROW('SELF-01', { matched_as: '' })] },
  { arm: 'a settled row that names no catalogue page', want: 'no-catalogue-url',
    records: [REC('SELF-01')], settled: [ROW('SELF-01', { catalogue_url: null })] },
  { arm: 'a settled row at a tier the file does not declare', want: 'unknown-tier',
    records: [REC('SELF-01')], settled: [ROW('SELF-01', { tier: 'vibes' })] },
  { arm: 'two settlement rows for one plate', want: 'duplicate-row',
    records: [REC('SELF-01')], settled: [ROW('SELF-01'), ROW('SELF-01')] },
];

const before = check(CONTROL.records, CONTROL.settled, TIERS);
if (before.length) fail(`the self-test control is not clean, so its arms prove nothing: ${before.map((p) => p.text).join(' | ')}`);
console.log('self-test control: clean');

for (const t of SELF) {
  const got = check(t.records, t.settled, TIERS);
  const hit = got.filter((p) => p.id === t.want);
  if (hit.length !== 1) {
    fail(`the self-test arm "${t.arm}" did not fire on its own message "${t.want}". It reported: ${got.length ? got.map((p) => p.id).join(', ') : 'nothing'}. An assertion nobody has watched fail is not a gate.`);
  }
  console.log(`self-test arm fired on its own message: ${t.arm} -> ${t.want}`);
}

const after = check(CONTROL.records, CONTROL.settled, TIERS);
if (after.length) fail(`the self-test control is dirty after the arms, so the arms left residue: ${after.map((p) => p.text).join(' | ')}`);
console.log('self-test control, again: clean\n');

/* --- the real run ---------------------------------------------------------- */

for (const f of [PRODUCTS, SETTLEMENT]) {
  if (!fs.existsSync(f)) fail(`${path.relative(ROOT, f)} is missing. A file that vanished is not a file that passed.`);
}
let products, settlement;
try { products = JSON.parse(fs.readFileSync(PRODUCTS, 'utf8')); } catch (e) { fail(`content/catalog-products.json does not parse: ${e.message}`); }
try { settlement = JSON.parse(fs.readFileSync(SETTLEMENT, 'utf8')); } catch (e) { fail(`content/plate-brand-settlement.json does not parse: ${e.message}`); }

const records = Array.isArray(products) ? products : (products.products || []);
if (!records.length) fail('content/catalog-products.json parsed to zero records.');
if (!Array.isArray(settlement.settled)) fail('content/plate-brand-settlement.json has no "settled" array.');
if (!settlement.settled.length) fail('the settlement is empty, so every plate would pass by finding nothing.');
if (!settlement._tiers || !Object.keys(settlement._tiers).length) fail('the settlement declares no tiers, so no row could be checked against one.');
if (!Array.isArray(settlement._catalogues) || settlement._catalogues.length < 3) {
  fail(`the settlement names ${Array.isArray(settlement._catalogues) ? settlement._catalogues.length : 0} catalogues. W25-R3 settles brand against three: Phomi, Ecofasad, Kordeko.`);
}

const plates = records.filter((r) => (r.categories || []).includes(CATEGORY));
if (!plates.length) fail(`zero products in ${CATEGORY}, so nothing was checked.`);

const problems = check(records, settlement.settled, settlement._tiers);

const counts = {};
for (const row of settlement.settled) { const k = row.brand || 'no manufacturer (brand_hidden)'; counts[k] = (counts[k] || 0) + 1; }
const tierCounts = {};
for (const row of settlement.settled) tierCounts[row.tier] = (tierCounts[row.tier] || 0) + 1;

console.log(`plates in ${CATEGORY}: ${plates.length}`);
console.log(`settlement rows: ${settlement.settled.length}`);
console.log(`catalogues walked: ${settlement._catalogues.map((c) => c.name).join(', ')}`);
console.log(`settled per brand: ${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(', ')}`);
console.log(`by tier: ${Object.entries(tierCounts).map(([k, v]) => `${k} ${v}`).join(', ')}`);
const hiddenElsewhere = records.filter((r) => r.brand_hidden && !(r.categories || []).includes(CATEGORY)).length;
console.log(`brand_hidden outside ${CATEGORY}: ${hiddenElsewhere} (not this gate's business, printed so the number stays visible)`);

if (problems.length) {
  console.error(`\n${problems.length} problem${problems.length === 1 ? '' : 's'}:`);
  for (const p of problems) console.error(`  [${p.id}] ${p.text}`);
  fail(`${problems.length} plate or settlement row disagrees with the other.`);
}

console.log(`\nPLATE BRAND GATE PASSED: ${plates.length} plates, ${settlement.settled.length} settlement rows, matched both ways.`);
