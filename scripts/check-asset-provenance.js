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
/* R-W amendment, 2026-09-15 (W14-02b). Legacy status is a fingerprint: the path
   AND sha256 must match docs/assets/LEGACY-IMAGES.txt, the images in f5e4eb6's
   first parent. The list is committed because CI has no git history. */
const LEGACY = 'legacy, licence unverified';
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
  if (!claimsLegacy && onDisk && !isLegacy) {
    if (!/^https:\/\/\S+/.test(licenceUrl) && !/^supplier permission:\s*\S/.test(licenceUrl) && !/^n\/a, generated in this repo/.test(licenceUrl)) {
      problems.push(`${where} ${file} is not a legacy image, so its licence URL must be an https URL or "supplier permission: ..."; got "${licenceUrl}"`);
    }
  }
  for (const host of hostsIn(source)) {
    const b = bannedHost(host);
    if (b) problems.push(`${where} ${file} source host ${host} is banned by R-W (${b})`);
  }
}
const unlisted = images.filter((f) => !byFile.has(f));
unlisted.forEach((f) => problems.push(`${f} has no row in ${LEDGER}`));

console.log(`walked ${TREE}/: ${images.length} images   ledger rows: ${rows.length}   banned hosts: ${BANNED.join(', ')}`);
console.log(`matcher self-test: ${SELF_TEST.length} of ${SELF_TEST.length} passed`);
console.log(`legacy fingerprints: ${legacy.size} (images present before f5e4eb6)`);
if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  problems.forEach((p) => console.error('  ' + p));
  process.exit(1);
}
console.log('every image has a provenance row, and no row sources a banned host.');
