#!/usr/bin/env node
/* Merge-artifact gate, ruling R-Z (docs/rulings/R-Z.md).

   Conflicts are never resolved in the GitHub web conflict editor. This gate is
   what makes that rule detectable rather than merely stated, and it has two
   arms because the web editor fails in two different ways.

   ARM 1, conflict markers. The ordinary failure: a marker block committed as
   content. Scanned across every tracked text file, not only the four tables,
   because a marker anywhere is a defect.

   ARM 2, duplicate row keys. The failure that arm 1 cannot see. The GitHub web
   conflict editor STRIPS the marker lines when it saves, leaving both sides'
   text behind as ordinary content. A marker grep then reports a clean file that
   is silently carrying one side twice. In an append-only table that shows up as
   a duplicated row key, so that is what this looks for, in the four files whose
   rows are keys: DECISIONS.md, docs/BACKLOG.md, docs/QUESTIONS.md and
   docs/assets/PROVENANCE.md.

   Per docs/CLAUDE.md section 13 it asserts the presence of what it requires
   before concluding anything: every keyed file must exist and must still yield
   keys (a file whose shape changed so that nothing matches is a failure, not a
   pass), the tracked-file walk must find files, and every pattern must pass its
   own self-test. A run that saw nothing fails.

   The marker literals below are built by character repetition rather than
   written out, so this file does not itself contain a line-start marker and
   needs no exemption from its own scan. It is scanned like every other file.

   Usage:  node scripts/check-merge-artifacts.js
   No dependencies. */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const fail = (msg) => { console.error(`\nMERGE ARTIFACT CHECK FAILED: ${msg}\n`); process.exit(1); };

/* --- arm 1: conflict markers ---------------------------------------------- */
/* Built from repeated characters so the literals never appear in this source.
   Anchored at line start, which is where git writes them. */
const M_LT = '<'.repeat(7);
const M_GT = '>'.repeat(7);
const M_EQ = '='.repeat(7);
const M_BASE = '|'.repeat(7);

const MARKERS = [
  { id: 'ours', re: new RegExp(`^${M_LT} `), yes: [`${M_LT} HEAD`, `${M_LT} main`] },
  { id: 'theirs', re: new RegExp(`^${M_GT} `), yes: [`${M_GT} feature-branch`] },
  { id: 'divider', re: new RegExp(`^${M_EQ}$`), yes: [M_EQ] },
  { id: 'base', re: new RegExp(`^\\${M_BASE[0]}{7} `), yes: [`${M_BASE} merged common ancestors`] },
];

/* Lines that must never be flagged. The six-character runs are the near misses
   a careless pattern catches; the rest are real content from this repo. */
const CLEAN_LINES = [
  '<'.repeat(6),
  '>'.repeat(6),
  '='.repeat(6),
  '> A gate asserts the presence of what it requires, never the absence of a complaint.',
  '| RC-126 | W15-02 Servicii dropdown | SELF | `w15/rc-126-servicii-dropdown` | shipped |',
  '## W14-23 · Carport diagrams: one line drawing per structure, no photographs, 2026-09-15',
  `a line that mentions ${M_LT} in the middle of a sentence`,
];

/* --- arm 2: the keyed files ------------------------------------------------ */
/* Each key is the WHOLE heading or row, never a parsed identifier. That is not
   cosmetic: docs/QUESTIONS.md legitimately carries both
   "## Q-W12-07-LEGAL · ..." and "## Q-W12-07-LEGAL, addendum · ...", which a
   parsed-ID key collides into a false duplicate. A merge duplication reproduces
   a row verbatim, so the verbatim row is the right key. */
const KEYED = [
  {
    file: 'DECISIONS.md',
    what: 'section headings',
    match: (line) => /^## /.test(line),
    key: (line) => line.trim(),
  },
  {
    file: 'docs/BACKLOG.md',
    what: 'ticket rows',
    match: (line) => /^\| RC-/.test(line),
    key: (line) => line.trim(),
  },
  {
    file: 'docs/QUESTIONS.md',
    what: 'question headings',
    match: (line) => /^## Q-/.test(line),
    key: (line) => line.trim(),
  },
  {
    file: 'docs/assets/PROVENANCE.md',
    what: 'provenance rows',
    match: (line) => /^\| `/.test(line),
    key: (line) => (line.match(/^\| `([^`]+)`/) || [, line.trim()])[1],
  },
];

/* --- self-test ------------------------------------------------------------- */
/* An assertion nobody has watched fail is not a gate (docs/CLAUDE.md section
   13). Every pattern matches its own samples and none matches the clean ones,
   and the duplicate finder is run against a planted duplicate and a planted
   near miss, before any real file is read. */
let selfTested = 0;
for (const p of MARKERS) {
  for (const s of p.yes) {
    if (!p.re.test(s)) fail(`self-test: marker pattern ${p.id} does not match its own sample ${JSON.stringify(s)}`);
    selfTested++;
  }
  for (const s of CLEAN_LINES) {
    if (p.re.test(s)) fail(`self-test: marker pattern ${p.id} matches the clean line ${JSON.stringify(s)}`);
    selfTested++;
  }
}

const findDuplicates = (keys) => {
  const seen = new Map();
  const dups = [];
  for (const { key, line } of keys) {
    if (seen.has(key)) dups.push({ key, first: seen.get(key), again: line });
    else seen.set(key, line);
  }
  return dups;
};

{
  const planted = [
    { key: 'Q-W12-07-LEGAL · the original', line: 1 },
    { key: 'Q-W12-07-LEGAL, addendum · the addendum', line: 2 },
    { key: 'Q-W12-07-LEGAL · the original', line: 3 },
  ];
  const d = findDuplicates(planted);
  if (d.length !== 1) fail(`self-test: the duplicate finder reported ${d.length} duplicates in a set with exactly one`);
  if (d[0].first !== 1 || d[0].again !== 3) fail('self-test: the duplicate finder named the wrong lines');
  selfTested += 2;
  if (findDuplicates(planted.slice(0, 2)).length !== 0) fail('self-test: the duplicate finder flagged a near miss as a duplicate');
  selfTested++;
}

/* --- inputs ---------------------------------------------------------------- */
const TEXT = /\.(md|js|json|css|html|yml|yaml|txt|sh)$/i;
let tracked;
try {
  tracked = execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' }).trim().split('\n').filter(Boolean);
} catch (e) {
  fail(`could not list tracked files: ${e.message}`);
}
if (tracked.length === 0) fail('git ls-files returned nothing, so nothing was scanned');
const textFiles = tracked.filter((f) => TEXT.test(f) && fs.existsSync(path.join(ROOT, f)));
if (textFiles.length === 0) fail('no tracked text files were found, so nothing was scanned');

/* --- scan ------------------------------------------------------------------ */
const problems = [];

let linesScanned = 0;
for (const f of textFiles) {
  const lines = fs.readFileSync(path.join(ROOT, f), 'utf8').split('\n');
  linesScanned += lines.length;
  lines.forEach((line, i) => {
    for (const p of MARKERS) {
      if (p.re.test(line)) problems.push(`${f}:${i + 1}  conflict marker [${p.id}]  ${JSON.stringify(line.slice(0, 60))}`);
    }
  });
}

const keyCounts = [];
for (const spec of KEYED) {
  const abs = path.join(ROOT, spec.file);
  if (!fs.existsSync(abs)) fail(`${spec.file} is missing; a file that vanished is not a file that passed`);
  const lines = fs.readFileSync(abs, 'utf8').split('\n');
  const keys = [];
  lines.forEach((line, i) => { if (spec.match(line)) keys.push({ key: spec.key(line), line: i + 1 }); });
  if (keys.length === 0) {
    fail(`${spec.file} yielded zero ${spec.what}. Either the file lost its rows or its shape changed; neither is a pass.`);
  }
  keyCounts.push(`${spec.file} ${keys.length} ${spec.what}`);
  for (const d of findDuplicates(keys)) {
    problems.push(`${spec.file}:${d.again}  duplicate row key (first at line ${d.first})  ${JSON.stringify(String(d.key).slice(0, 70))}`);
  }
}

/* --- report ---------------------------------------------------------------- */
console.log(`self-test assertions: ${selfTested}`);
console.log(`scanned: ${textFiles.length} tracked text files, ${linesScanned} lines, for ${MARKERS.length} marker forms`);
console.log(`row keys: ${keyCounts.join('   ')}`);
if (problems.length) {
  console.error(`\n${problems.length} R-Z violation(s):`);
  problems.forEach((p) => console.error('  ' + p));
  console.error('\nResolve the conflict locally, or merge main forward. Never in the GitHub web conflict editor.');
  process.exit(1);
}
console.log('zero conflict markers, zero duplicate row keys in the four append-only tables.');
