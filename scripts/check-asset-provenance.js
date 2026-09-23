#!/usr/bin/env node
/* Asset provenance gate, ruling R-W (docs/rulings/R-W.md).

   Every image the site serves has a row in docs/assets/PROVENANCE.md saying
   where it came from and under what licence. This walks public/ on disk and
   fails on:

     - an image file with no row
     - a row naming a file that does not exist
     - a duplicate row
     - an empty cell, or a date that is not YYYY-MM-DD
     - "unrecorded before R-W" on a row dated on or after R-W
     - a source URL whose hostname is a competitor's, subdomains included

   It walks the filesystem, not the git index, so an image copied into public/
   and not yet committed fails too.

   Per docs/CLAUDE.md section 13 it asserts what it needs before it concludes
   anything: the ledger must exist and parse to rows, the walk must find images,
   and the hostname matcher must pass its own self-test. A run that saw nothing
   fails; it never reads silence as a pass.

   R-W amendment (W14-02b): "legacy, licence unverified" only for a file whose
   path and sha256 match docs/assets/LEGACY-IMAGES.txt; every other image needs an
   https licence URL or "supplier permission: ...".

   Usage:  node scripts/check-asset-provenance.js
   No dependencies. */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TREE = 'public';
const LEDGER = 'docs/assets/PROVENANCE.md';
const IMAGE_EXT = /\.(png|jpe?g|webp|gif|svg|avif|ico|bmp|tiff?|heic)$/i;
const BANNED = ['fatade3d.md', 'imperlux.md', 'dasterum.md'];
/* R-W amendment, 2026-09-21 (W25-R7). `dasterum.md` stays in BANNED and is
   allowed on ONE condition, which is the shape the ruling has: the owner states
   the client buys directly from Dasterum and accepts the use of their product
   data, public prices and images, with the watermark left exactly as published.
   So a row whose licence is the direct-supplier sentence, character for
   character, may name dasterum.md, and nothing else may. Keeping the host banned
   by default and lifting it only for that exact licence is deliberate: a row that
   drifts one word from the sentence loses the permission and fails. */
const DIRECT_SUPPLIER_HOST = 'dasterum.md';
const DIRECT_SUPPLIER_LICENCE = 'direct supplier, dasterum.md, owner buys directly and accepts use of their product data and images, watermark as published, owner accepted 2026-09-21';
/* R-W amendment, 2026-09-21 (W25-R14). The same permission, the same shape, one
   more host: the owner states the client buys catalogue goods directly from
   Fatade 3D, on the same four conditions, for PRODUCT IMAGES ONLY. Held exactly
   the same way, so a row that drifts one word loses the permission and fails. */
const DIRECT_SUPPLIER_LICENCES = {
  'dasterum.md': DIRECT_SUPPLIER_LICENCE,
  'fatade3d.md': 'direct supplier, fatade3d.md, owner buys catalogue goods directly and accepts use of their product data and product images, watermark as published, owner accepted 2026-09-21',
};
/* R-W amendment, 2026-09-21 (W25-R15). NOT a direct supplier and deliberately not
   written like one. imperlux.md is a competitor, the owner has decided to take
   twelve pictures from it anyway, and the row says so in those words. The
   permission is attached to the twelve slot ids the ruling names; this gate walks
   files rather than slots, so it holds the FILE NAME half of that, and gate 19
   holds the slot half over the built tree. */
/* AMENDED (W26-R3, W26-03): a SECOND override, for the four roofing hub tiles, and
   deliberately not a widening of the first. Each ruling has its own exact licence
   sentence and its own file list, so a W26-R3 licence on a fence file and a W25-R15
   licence on a roofing file are both refused. The new sentence records the CROP,
   which W26-R3 permits and W25-R15 never mentioned: every one of these tiles carries
   a burned-in Romanian headline and a model count above the product, and the crop is
   what keeps them off the page. */
const OVERRIDE_HOST = 'imperlux.md';
const OVERRIDES = [
  {
    ruling: 'W25-R15',
    licence: 'owner_override_imperlux, competitor origin taken by owner decision W25-R15, no upscale, source URL per file, owner accepted 2026-09-21',
    files: [
      'GARD-01', 'GARD-02', 'GARD-03', 'GARD-04', 'GARD-05', 'GARD-06', 'GARD-07', 'GARD-08',
      'GARDB-01', 'GARDB-02', 'GARDB-03', 'GARDB-04',
    ],
  },
  {
    ruling: 'W26-R3',
    licence: 'owner_override_imperlux, competitor origin taken by owner decision W26-R3, cropped to remove burned-in text, no upscale, source URL per file, owner accepted 2026-09-22',
    files: ['ACOP-01', 'ACOP-02', 'ACOP-03', 'ACOP-04'],
  },
  /* AMENDED (W26-R10, W26-11): a THIRD override, the whole roofing page, with its
     own sentence and its own list again. "Cropped where burned-in text or branding
     sat" is the condition the three category tiles and the two IKO shingles were
     installed under: the headline, the model count and imperlux's orange mark are
     all outside the crop. ACOP-05 is listed and has no file of its own: it is a
     declared reuse of ACIM-01's picture. */
  {
    ruling: 'W26-R10',
    licence: 'owner_override_imperlux, competitor origin taken by owner decision W26-R10, cropped where burned-in text or branding sat, no upscale, source URL per file, owner accepted 2026-09-22',
    files: [
      'ACOP-05', 'ACOP-06', 'ACOP-07',
      /* W27-C-05: ACIM-02 and ACIM-03 moved to the W27-R-04 entry below, because their
         pictures are now the untouched previews and this sentence says "cropped". */
      /* W27-C-06: ACIM-01 moved below too; ACOP-05 keeps the W26-11 crop as its own file. */
      'ACIM-04', 'ACIM-05', 'ACIM-06', 'ACIM-07', 'ACIM-08', 'ACIM-09',
    ],
  },
  /* AMENDED (W27-R-04, W27-C-03): a FOURTH override, imperlux.md as the source of record
     for everything under Acoperisuri and Garduri, with its own sentence: "Same images,
     same numbers. Image intake rules from W25 stand: source URL per file, no upscale,
     watermark untouched, flagged imperlux." So these files are the preview images AS
     PUBLISHED, uncropped, and the sentence says so. A file already listed above may move
     here when its picture is replaced by the untouched preview. */
  {
    ruling: 'W27-R-04',
    licence: 'owner_override_imperlux, source of record by owner decision W27-R-04, the preview image as imperlux.md publishes it, watermark untouched, no upscale, source URL per file, owner accepted 2026-09-22',
    files: [
      /* W27-FIX-06 (W27-R-13): ACIM-10 to ACIM-16 moved to the fifth entry below (the maker's
         own render, no mark); ACIM-01, ACIM-02 and ACIM-03 left the overrides altogether, their
         pictures are the makers' own (swissporTON, IKO) under the manufacturer-packshot origin. */
      'NVK-01', 'NVK-02', 'NVK-03', 'NVK-04',
      'ACOP-09',
      /* W27-C-06: the rainwater parts and the metal tile accessories. */
      'ACIM-17', 'ACIM-18', 'ACIM-19', 'ACIM-20', 'ACIM-21', 'ACIM-22', 'ACIM-23', 'ACIM-24', 'ACIM-25', 'ACIM-26', 'ACIM-27', 'ACIM-28', 'ACIM-29', 'ACIM-30', 'ACIM-31', 'ACIM-32', 'ACIM-33', 'ACIM-34', 'ACIM-35', 'ACIM-36', 'ACIM-37', 'ACIM-38', 'ACIM-39', 'ACIM-40', 'ACIM-41', 'ACIM-42', 'ACIM-43', 'ACIM-44', 'ACIM-45', 'ACIM-46', 'ACIM-47', 'ACIM-48',
    ],
  },
  /* AMENDED (W27-R-13, W27-FIX-06): a FIFTH override, with its own sentence. Imperlux is the
     maker of its seven metal tile models (every page: brand Imperlux, ArcelorMittal steel), so
     "the manufacturer's own packshot" for them is Imperlux's own gallery render of the sheet,
     which carries neither its orange mark nor the burned-in name the preview did. The sentence
     records the 4:3 crop the card takes and that the decision is a strategy default the owner
     may overturn. Seven files, by name; nothing else may stand on this sentence. */
  {
    ruling: 'W27-R-13',
    licence: "owner_override_imperlux, the maker's own packshot by owner decision W27-R-13 (strategy default, owner may overturn), imperlux.md's gallery render of the model without its mark or name, cropped to 4:3, no upscale, source URL per file, 2026-09-23",
    files: ['ACIM-10', 'ACIM-11', 'ACIM-12', 'ACIM-13', 'ACIM-14', 'ACIM-15', 'ACIM-16'],
  },
];
const OVERRIDE_FILES = OVERRIDES.flatMap((o) => o.files);
/* R-W amendment, 2026-09-15 (W14-02b). Legacy status is a fingerprint: the path
   AND sha256 must match docs/assets/LEGACY-IMAGES.txt, the images in f5e4eb6's
   first parent. The list is committed because CI has no git history. */
const LEGACY = 'legacy, licence unverified';
/* R-W amendment, 2026-09-18 (wave 23). The client's own files are an approved
   origin and are the ONE origin that needs no licence URL. It is held exactly, so
   it cannot become a way to skip a URL for anything else: the source cell must
   name the origin and a date, and the licence cell must be the ruling's own
   sentence, character for character. The stripping half of the amendment is
   scripts/check-image-metadata.js. The name may be several words ("Ion
   Popescu"), and may not be empty or hold a comma, which would move the date. */
const CLIENT_SOURCE = /^client direct transfer,\s*[^,\s][^,]*,\s*\d{2}\.\d{2}\.\d{4}$/;
const CLIENT_LICENCE = 'owned by Rapid Construct, supplied for site use';
const RETIRED = 'unrecorded before R-W';
const LEGACY_LIST = 'docs/assets/LEGACY-IMAGES.txt';
const LEGACY_COUNT = 149;
const crypto = require('crypto');
const HEADER = ['file', 'source url', 'licence', 'licence url', 'date'];

const fail = (msg) => { console.error(`\nPROVENANCE CHECK FAILED: ${msg}\n`); process.exit(1); };

/* Every hostname-like token in a cell, with or without a scheme. A bare
   "dasterum.md/tigla" is caught the same as a full URL. */
function hostsIn(cell) {
  const hosts = [];
  for (const m of cell.matchAll(/(?:[a-z][a-z0-9+.-]*:\/\/)?((?:[a-z0-9-]+\.)+[a-z]{2,})(?=[\/:?#)\s`]|$)/gi)) {
    hosts.push(m[1].toLowerCase().replace(/\.$/, ''));
  }
  return hosts;
}
const bannedHost = (host) => BANNED.find((b) => host === b || host.endsWith('.' + b)) || null;

/* --- self-test: the matcher must fire before its silence means anything --- */
const SELF_TEST = [
  ['https://dasterum.md/tigla-metalica/', 'dasterum.md'],
  ['https://www.imperlux.md/garduri/', 'imperlux.md'],
  ['cdn.fatade3d.md/img/a.jpg', 'fatade3d.md'],
  ['see `https://WWW.DASTERUM.MD`', 'dasterum.md'],
  ['https://dasterum.md.example.com/x', null],
  ['https://notimperlux.md/x', null],
  ['https://upload.wikimedia.org/wikipedia/commons/2/2c/KNAUF_Logo_2024.svg', null],
  ['client-supplied, Services_real images/Fatade', null],
];
for (const [cell, want] of SELF_TEST) {
  const got = hostsIn(cell).map(bannedHost).find(Boolean) || null;
  if (got !== want) fail(`matcher self-test: "${cell}" gave ${got}, expected ${want}`);
}
/* The client-supplied source shape, held the same way (W23-01a). */
const CLIENT_SELF_TEST = [
  ['client direct transfer, Mihai, 18.09.2026', true],
  ['client direct transfer, Ion Popescu, 18.09.2026', true],
  ['client direct transfer, Mihai', false],
  ['client direct transfer, , 18.09.2026', false],
  ['client direct transfer, Mihai, 2026-09-18', false],
];
for (const [cell, want] of CLIENT_SELF_TEST) {
  if (CLIENT_SOURCE.test(cell) !== want) fail(`client-source self-test: "${cell}" gave ${!want}, expected ${want}`);
}

/* --- the ledger ----------------------------------------------------------- */
const ledgerPath = path.join(ROOT, LEDGER);
if (!fs.existsSync(ledgerPath)) fail(`${LEDGER} is missing`);
const lines = fs.readFileSync(ledgerPath, 'utf8').split('\n');
const cells = (line) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());

const headerAt = lines.findIndex((l) => l.trim().startsWith('|')
  && cells(l).map((c) => c.toLowerCase()).join('|') === HEADER.join('|'));
if (headerAt === -1) fail(`${LEDGER} has no table with the header | ${HEADER.join(' | ')} |`);

const rows = [];
for (let i = headerAt + 2; i < lines.length && lines[i].trim().startsWith('|'); i++) {
  rows.push({ line: i + 1, c: cells(lines[i]) });
}
if (rows.length === 0) fail(`${LEDGER} table has no rows`);

/* --- the tree ------------------------------------------------------------- */
const images = [];
(function walk(rel) {
  for (const e of fs.readdirSync(path.join(ROOT, rel), { withFileTypes: true })) {
    const p = rel + '/' + e.name;
    if (e.isDirectory()) walk(p);
    else if (IMAGE_EXT.test(e.name)) images.push(p);
  }
})(TREE);
if (images.length === 0) fail(`walked ${TREE}/ and found no images, so the walk itself is broken`);

/* --- the legacy fingerprint list ------------------------------------------ */
const legacyPath = path.join(ROOT, LEGACY_LIST);
if (!fs.existsSync(legacyPath)) fail(`${LEGACY_LIST} is missing`);
const legacy = new Map(fs.readFileSync(legacyPath, 'utf8').trim().split('\n').map((l) => { const [sha, file] = l.split(/\s+/); return [file, sha]; }));
if (legacy.size !== LEGACY_COUNT) fail(`${LEGACY_LIST} lists ${legacy.size} images, expected ${LEGACY_COUNT}. The list is frozen; it never grows.`);
const sha256 = (rel) => crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, rel))).digest('hex');

/* --- checks --------------------------------------------------------------- */
const problems = [];
const byFile = new Map();
for (const { line, c } of rows) {
  const where = `${LEDGER}:${line}`;
  if (c.length !== HEADER.length) { problems.push(`${where} has ${c.length} cells, expected ${HEADER.length}`); continue; }
  const [fileCell, source, licence, licenceUrl, date] = c;
  const file = fileCell.replace(/^`|`$/g, '');
  c.forEach((v, k) => { if (!v) problems.push(`${where} empty "${HEADER[k]}"`); });
  if (byFile.has(file)) problems.push(`${where} duplicate row for ${file} (first at line ${byFile.get(file)})`);
  byFile.set(file, line);
  if (!fs.existsSync(path.join(ROOT, file))) problems.push(`${where} names ${file}, which does not exist`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) problems.push(`${where} date "${date}" is not YYYY-MM-DD`);
  if ([source, licence, licenceUrl].some((v) => v.includes(RETIRED))) {
    problems.push(`${where} ${file} uses the retired value "${RETIRED}"; legacy rows say "${LEGACY}"`);
  }
  const claimsLegacy = [licence, licenceUrl].some((v) => v.includes(LEGACY));
  const onDisk = fs.existsSync(path.join(ROOT, file));
  const isLegacy = onDisk && legacy.has(file) && legacy.get(file) === sha256(file);
  if (claimsLegacy && !isLegacy) {
    problems.push(`${where} ${file} says "${LEGACY}" but is not a legacy image with its original bytes (${legacy.has(file) ? 'bytes changed since f5e4eb6' : 'not in ' + LEGACY_LIST})`);
  }
  /* The client-supplied origin: source and licence must both be exact, and only
     then is the licence URL allowed to say that none is required. */
  const claimsClient = licence === CLIENT_LICENCE || /client direct transfer/i.test(source);
  if (claimsClient) {
    if (!CLIENT_SOURCE.test(source)) {
      problems.push(`${where} ${file} claims the client-supplied origin but its source is "${source}"; the R-W amendment reads "client direct transfer, <name>, DD.MM.YYYY"`);
    }
    if (licence !== CLIENT_LICENCE) {
      problems.push(`${where} ${file} claims the client-supplied origin but its licence is "${licence}"; the R-W amendment reads "${CLIENT_LICENCE}"`);
    }
  }
  if (!claimsLegacy && !claimsClient && onDisk && !isLegacy) {
    if (!/^https:\/\/\S+/.test(licenceUrl) && !/^supplier permission:\s*\S/.test(licenceUrl) && !/^n\/a, generated in this repo/.test(licenceUrl)) {
      problems.push(`${where} ${file} is not a legacy image, so its licence URL must be an https URL or "supplier permission: ..."; got "${licenceUrl}"`);
    }
  }
  /* W25-R7 and W25-R14: one host, one exact sentence, and the sentence names the
     host, so the fatade3d licence cannot lift dasterum.md or the other way round. */
  const supplierHost = Object.keys(DIRECT_SUPPLIER_LICENCES).find((h) => licence === DIRECT_SUPPLIER_LICENCES[h]) || null;
  /* The licence names its ruling and the ruling names its files, so the pair has to
     agree: a row carrying one ruling's sentence on the other ruling's file is not an
     override at all. */
  const overrideEntry = OVERRIDES.find((o) => licence === o.licence) || null;
  const override = overrideEntry !== null;
  const overrideFileOk = override && overrideEntry.files.some((id) => path.basename(file).startsWith(id + '.'));
  for (const host of hostsIn(source)) {
    const b = bannedHost(host);
    if (!b) continue;
    if (supplierHost && b === supplierHost) continue;
    if (override && b === OVERRIDE_HOST && overrideFileOk) continue;
    let why = `${where} ${file} source host ${host} is banned by R-W (${b})`;
    if (DIRECT_SUPPLIER_LICENCES[b]) why += `. ${b === DIRECT_SUPPLIER_HOST ? 'W25-R7' : 'W25-R14'} allows it only on a row whose licence is exactly the direct-supplier sentence for ${b}; this row's is "${licence}"`;
    if (b === OVERRIDE_HOST) {
      /* AMENDED (W26-03): the message names THE RULING THE LICENCE CLAIMS and the
         files that ruling covers, not the union of both lists. The first version
         printed all sixteen and so read "this file is in the list" back at someone
         whose real mistake was using W25-R15's sentence on a W26-R3 file. */
      why += override
        ? `. ${overrideEntry.ruling} overrides it for ${overrideEntry.files.join(', ')} and for nothing else; this file is ${path.basename(file)}. The other override is ${OVERRIDES.filter((o) => o !== overrideEntry).map((o) => `${o.ruling} for ${o.files.join(', ')}`).join('; ')}`
        : `. It is overridden only on a row whose licence is exactly one ruling's own sentence: ${OVERRIDES.map((o) => `${o.ruling} for ${o.files.join(', ')}`).join('; ')}. This row's licence is "${licence}"`;
    }
    problems.push(why);
  }
  if (supplierHost && !hostsIn(source).some((h) => bannedHost(h) === supplierHost)) {
    problems.push(`${where} ${file} carries the ${supplierHost} direct-supplier licence and its source names no ${supplierHost} URL. W25-R7 and W25-R14: the ledger records the source URL per file.`);
  }
  if (override && !hostsIn(source).some((h) => bannedHost(h) === OVERRIDE_HOST)) {
    problems.push(`${where} ${file} carries the owner-override licence and its source names no ${OVERRIDE_HOST} URL. W25-R15: the ledger records the source URL per file.`);
  }
}
const unlisted = images.filter((f) => !byFile.has(f));
unlisted.forEach((f) => problems.push(`${f} has no row in ${LEDGER}`));

console.log(`walked ${TREE}/: ${images.length} images   ledger rows: ${rows.length}   banned hosts: ${BANNED.join(', ')}`);
console.log(`matcher self-test: ${SELF_TEST.length} of ${SELF_TEST.length} passed`);
console.log(`client-source self-test: ${CLIENT_SELF_TEST.length} of ${CLIENT_SELF_TEST.length} passed`);
console.log(`legacy fingerprints: ${legacy.size} (images present before f5e4eb6)`);
if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  problems.forEach((p) => console.error('  ' + p));
  process.exit(1);
}
console.log('every image has a provenance row, and no row sources a banned host.');
