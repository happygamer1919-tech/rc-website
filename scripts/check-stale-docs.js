#!/usr/bin/env node
/* Staleness gate, W12-29. Enforces R-Q and R-R.

   R-Q stopped new copies of a measured value being made. R-R made the copies
   that already exist visible, by requiring an inline amendment naming the ruling
   that superseded the value. Neither detects the NEXT one. Four
   document-staleness findings in three cards (W12-24, W12-27, W12-28) were all
   the same shape: a value copied into a governing document has no mechanism that
   notices when the ruling behind it changes. This is the mechanism.

   Run it the way check-links.js is run — it exits non-zero, so it is a gate
   rather than a habit:

       node scripts/check-stale-docs.js

   It takes a root directory so it can be pointed at a scratch copy, which is how
   it gets negative-tested:

       node scripts/check-stale-docs.js /tmp/scratch-tree

   WHAT IT ASSERTS, and the wording matters, per CLAUDE.md section 13. It does
   not look for a complaint and pass on silence. For every occurrence of a
   known-superseded value it requires the PRESENCE of a marker naming the
   authority that superseded it, within WINDOW lines. An occurrence with no
   marker is a hit and the run fails. Absence of a marker is never read as
   "probably fine".

   Two things are deliberately NOT silent:

   · Exempt files are printed with the ruling that exempts them, every run. A
     file dropped out of scope quietly is how a gate stops being one.
   · A KNOWN exception that no longer matches anything is itself a FAILURE. An
     exception list that rots is the same disease this gate exists to catch, one
     level up.

   Adding a value here is part of recording any ruling that supersedes a
   measurement. That obligation is written into R-Q, DECISIONS.md.

   This file is not in its own scan list, and could not be: the list of
   superseded values necessarily contains every superseded value. The scan list
   is documents.

   IT CAUGHT ITS OWN DOCUMENTATION during W12-29, when section 16 of CLAUDE.md
   named #F26419 without the live value beside it. That is the gate working, and
   the fix was to write the live value in, not to widen the rule.

   No dependencies. */

const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] || path.resolve(__dirname, '..');

/* How far from the value a marker may sit and still count as adjacent. Six
   lines is a paragraph in these documents: it reaches the amendment sentence
   that follows a struck value and the table row above one, and not much else. */
const WINDOW = 3;

/* --- the values ----------------------------------------------------------- */
/* Each entry is a measurement some ruling has superseded, the authority that
   superseded it, and the pattern that must appear nearby for an occurrence to be
   considered marked. `clear` is the POSITIVE assertion: naming the superseding
   authority, or stating the live value in its place, or carrying the R-R
   amendment marker. Seeded with every value found in wave 12. */
const SUPERSEDED = [
  {
    id: 'baseline-ro',
    find: /8,504/g,
    ruling: 'R-J (DECISIONS.md, W12-04)',
    what: 'the RO homepage baseline, 8,504px. Never true; the real figure is in R-J',
    clear: /R-J|Corrected 2026-09-03|were wrong|never true/,
  },
  {
    id: 'baseline-ru',
    find: /8,774/g,
    ruling: 'R-J (DECISIONS.md, W12-04)',
    what: 'the RU homepage baseline, 8,774px. Never true; the real figure is in R-J',
    clear: /R-J|Corrected 2026-09-03|were wrong|never true/,
  },
  {
    id: 'budget-ro-ri',
    find: /8,744/g,
    ruling: 'R-J (DECISIONS.md, W12-04, amended by W12-10)',
    what: "R-I's RO budget, 8,744px",
    clear: /R-J|AMENDED|then-current|do not budget/,
  },
  {
    id: 'budget-ru-ri',
    find: /9,044/g,
    ruling: 'R-J (DECISIONS.md, W12-04, amended by W12-10)',
    what: "R-I's RU budget, 9,044px",
    clear: /R-J|AMENDED|then-current|do not budget/,
  },
  {
    id: 'revert-ro',
    find: /8,700/g,
    ruling: 'R-J (DECISIONS.md, W12-04)',
    what: "the flat 8,700px RO cap and R-I's revert value. R-J's revert is derived and carries the headroom term",
    clear: /R-J|AMENDED/,
  },
  {
    id: 'revert-ru',
    find: /9,000/g,
    ruling: 'R-J (DECISIONS.md, W12-04)',
    what: "the flat 9,000px cap, R-I's revert value, and the over-build heuristic W12-28 struck. RU exceeds it by design",
    clear: /R-J|AMENDED/,
  },
  {
    id: 'brand-colour',
    find: /#F26419/gi,
    ruling: 'DECISIONS.md, "The master plan is stale on two token values"',
    what: '--brand as #F26419. It predates the logo file and never shipped; the live value is #F65308',
    clear: /#F65308|AMENDED|stale on two token values/,
  },
  {
    id: 'ink-colour',
    find: /#1C1C1C/gi,
    ruling: 'DECISIONS.md, "The master plan is stale on two token values"',
    what: '--ink as #1C1C1C. It predates the logo file and never shipped; the live value is #1A1A1A',
    clear: /#1A1A1A|AMENDED|stale on two token values/,
  },
  {
    id: 'photo-min',
    find: /1600px|minimum 1600|1600 long edge|global 1600/gi,
    ruling: 'W7-02, the step-slot ruling, and W8-03',
    what: 'the 1600px long-edge minimum stated as universal. Three rulings lower it per slot group; slots.js holds the per-slot floors',
    clear: /AMENDED|W7-02|W8-03|not universal|default for every slot/,
  },
];

/* --- what is scanned ------------------------------------------------------ */
/* The governing and reference documents. R-Q's subject is documents that
   instruct, so those are what this enforces. */
const SCAN = [
  'docs/CLAUDE.md',
  'docs/RC-WEBSITE-MASTER-PLAN.md',
  'docs/BACKLOG.md',
  'docs/RC-PHOTO-MANIFEST.md',
  'docs/SHOOT-SHEET.md',
  'RELEASE-NOTES.md',
  'README.md',
];

/* Source files, added by W12-31 closing Q-W12-12. Only their COMMENTS are
   scanned. That distinction is the whole reason the extension is safe: the
   values here collide with live code that is entirely correct — `MIN_LONG_EDGE
   = 1600` in slots.js is the implementation of the rule, and `setTimeout(r,
   1600)` in verify-live.js is a delay in milliseconds. A gate that flags its own
   correct implementation trains people to ignore it. Neither is a comment, so
   neither is read.

   `scripts/check-stale-docs.js` is absent and must stay absent: the list of
   superseded values necessarily contains every superseded value. */
const SCAN_SOURCE = [
  'src/styles.css',
  'src/template.html',
  'src/service.html',
  'src/privacy.html',
  'src/404.html',
  'build.js',
  'scripts/check-links.js',
  'scripts/gen-og-image.js',
  'scripts/gen-placeholders.js',
  'scripts/gen-service-svgs.js',
  'scripts/process-photos.js',
  'scripts/slots.js',
  'scripts/verify-live.js',
];

/* Exempt, by ruling, and printed every run so the scope is never implicit. */
const EXEMPT = [
  {
    file: 'DECISIONS.md',
    reason: 'the ruling record. R-Q puts a number\'s one home in the ruling that set it, so a superseded value inside its own ruling is the record, not a copy.',
  },
  {
    file: 'docs/QUESTIONS.md',
    reason: 'a record of snapshots. Each entry states what was true when the question was raised; answered entries are marked. Ratified under R-R and again by the owner at W12-28: rewriting the snapshots destroys the record.',
  },
];

/* --- occurrence-level exceptions ------------------------------------------ */
/* Each names a file, a value, a snippet that must be on the line, and a reason.
   These are occurrences that are legitimately historical and cannot carry the
   superseding authority beside them without falsifying the record they are.
   An exception that matches nothing is a FAILURE, not a skip. */
const KNOWN = [
  {
    file: 'RELEASE-NOTES.md',
    id: 'revert-ro',
    contains: 'Homepage RO under 8,700px',
    reason: 'wave 6 and wave 8 gate tables, left as recorded by an explicit decision stated in the "Constraints that must not drift" section. Correcting a dated gate table would rewrite what was measured, not what is true.',
  },
  {
    file: 'RELEASE-NOTES.md',
    id: 'revert-ru',
    contains: 'Homepage RU under 9,000px',
    reason: 'the same two gate tables, same reason.',
  },
  {
    file: 'RELEASE-NOTES.md',
    id: 'budget-ro-ri',
    contains: 'Homepage RO under 8,744px',
    reason: "wave 12 first-half gate table. R-I's budgets are what that wave was measured against and the table is the record of it.",
  },
  {
    file: 'RELEASE-NOTES.md',
    id: 'budget-ru-ri',
    contains: 'Homepage RU under 9,044px',
    reason: 'the same table, same reason.',
  },
  {
    file: 'RELEASE-NOTES.md',
    id: 'revert-ro',
    contains: "Wave 6's cap was tighter still",
    reason: 'a dated sentence that declares itself historical in its own words. It states what wave 6 measured against, beside the rejected build\'s 13,312px, and is not a budget anyone could act on.',
  },
  {
    file: 'docs/RC-WEBSITE-MASTER-PLAN.md',
    id: 'ink-colour',
    contains: 'Four near-identical light background values are in use',
    reason: 'line 22 lists #1C1C1C among the REJECTED build\'s four off-whites. It is a description of what was wrong, not a spec value, so there is nothing to amend. Checked and declared not a finding twice, under R-R (W12-27) and again at W12-28.',
  },
];

/* --- comment extraction ---------------------------------------------------- */
/* A regex cannot do this. `https://` is not a line comment, a `//` inside a
   template literal is not a line comment, and build.js is full of both. So this
   walks the file character by character and returns the text of the comments
   only, with every non-comment character replaced by a space.

   Blanking rather than deleting is deliberate: it preserves every byte offset,
   so a hit still reports the true line number in the real file.

   States tracked: line comment, block comment, the three string forms, template
   `${}` interpolation to any depth, and regex literals. Regex literals matter
   because `/\/\//` would otherwise look like a comment opening. Whether a `/`
   starts a regex or divides is decided by the previous significant character,
   which is the standard heuristic and is exact for this codebase. */
function commentsOnly(src, kind) {
  const out = new Array(src.length).fill(' ');
  const keep = (i) => { if (src[i] !== '\n') out[i] = src[i]; };
  let i = 0;

  if (kind === 'css' || kind === 'html') {
    const open = kind === 'css' ? '/*' : '<!--';
    const close = kind === 'css' ? '*/' : '-->';
    while (i < src.length) {
      const a = src.indexOf(open, i);
      if (a < 0) break;
      let b = src.indexOf(close, a + open.length);
      if (b < 0) b = src.length; else b += close.length;
      for (let k = a; k < b; k++) keep(k);
      i = b;
    }
    for (let k = 0; k < src.length; k++) if (src[k] === '\n') out[k] = '\n';
    return out.join('');
  }

  /* JavaScript. */
  let prevSig = '';                       // last significant char, for regex vs divide
  const stack = [];                       // '`' for template, '{' for ${ } inside one
  while (i < src.length) {
    const c = src[i], d = src[i + 1];

    if (c === '/' && d === '/') {         // line comment
      while (i < src.length && src[i] !== '\n') { keep(i); i++; }
      continue;
    }
    if (c === '/' && d === '*') {         // block comment
      const b = src.indexOf('*/', i + 2);
      const end = b < 0 ? src.length : b + 2;
      for (; i < end; i++) keep(i);
      continue;
    }
    if (c === '"' || c === "'") {         // string
      i++;
      while (i < src.length && src[i] !== c) { if (src[i] === '\\') i++; i++; }
      i++; prevSig = 'x'; continue;
    }
    if (c === '`') {                      // template literal, possibly nested
      i++;
      while (i < src.length) {
        if (src[i] === '\\') { i += 2; continue; }
        if (src[i] === '`') { i++; break; }
        if (src[i] === '$' && src[i + 1] === '{') { stack.push('`'); i += 2; break; }
        i++;
      }
      prevSig = 'x'; continue;
    }
    if (c === '}' && stack.length && stack[stack.length - 1] === '`') {
      stack.pop(); i++;                   // close ${ }, resume the template
      while (i < src.length) {
        if (src[i] === '\\') { i += 2; continue; }
        if (src[i] === '`') { i++; break; }
        if (src[i] === '$' && src[i + 1] === '{') { stack.push('`'); i += 2; break; }
        i++;
      }
      prevSig = 'x'; continue;
    }
    if (c === '/' && /[=(,:[!&|?{;+\-*%~^<>]/.test(prevSig)) {   // regex literal
      i++;
      let cls = false;
      while (i < src.length) {
        if (src[i] === '\\') { i += 2; continue; }
        if (src[i] === '[') cls = true;
        else if (src[i] === ']') cls = false;
        else if (src[i] === '/' && !cls) { i++; break; }
        else if (src[i] === '\n') break;
        i++;
      }
      prevSig = 'x'; continue;
    }
    if (!/\s/.test(c)) prevSig = c;
    i++;
  }
  for (let k = 0; k < src.length; k++) if (src[k] === '\n') out[k] = '\n';
  return out.join('');
}

const kindOf = (rel) => rel.endsWith('.css') ? 'css' : rel.endsWith('.html') ? 'html' : 'js';

/* -------------------------------------------------------------------------- */

const rx = (r) => new RegExp(r.source, r.flags.replace('g', ''));
const pad = (s, n) => String(s).padEnd(n);

let hits = [];
let marked = 0;
let excepted = 0;
const usedException = new Set();
const perValue = new Map(SUPERSEDED.map((v) => [v.id, 0]));
const missingFiles = [];

console.log('\nstaleness gate — R-Q and R-R, seeded W12-29');
console.log(`root:   ${ROOT}`);
console.log(`window: ${WINDOW} lines either side\n`);

console.log('exempt, by ruling:');
for (const e of EXEMPT) {
  const exists = fs.existsSync(path.join(ROOT, e.file));
  console.log(`  · ${pad(e.file, 22)} ${exists ? '' : '(ABSENT) '}${e.reason}`);
}
console.log('');

function scan(rel, isSource) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) { missingFiles.push(rel); return; }
  const raw = fs.readFileSync(file, 'utf8');

  /* Documents are read whole. Source files are read as their COMMENTS ONLY,
     with every other character blanked. Offsets survive the blanking, so a hit
     still reports the true line and the real line is what gets printed. */
  const searched = (isSource ? commentsOnly(raw, kindOf(rel)) : raw).split('\n');
  const actual = raw.split('\n');

  searched.forEach((line, i) => {
    for (const v of SUPERSEDED) {
      if (!rx(v.find).test(line)) continue;
      perValue.set(v.id, perValue.get(v.id) + 1);

      /* The window is drawn from the SAME text that was searched. In a source
         file that means a comment must carry its own marker: a mention of the
         ruling in nearby code does not excuse it. */
      const window = searched.slice(Math.max(0, i - WINDOW), i + WINDOW + 1).join('\n');
      if (v.clear.test(window)) { marked++; continue; }

      const ex = KNOWN.find((k) => k.file === rel && k.id === v.id && line.includes(k.contains));
      if (ex) {
        excepted++;
        usedException.add(`${ex.file}|${ex.id}|${ex.contains}`);
        continue;
      }

      hits.push({ rel, line: i + 1, text: actual[i].trim(), v, isSource });
    }
  });
}

SCAN.forEach((rel) => scan(rel, false));
SCAN_SOURCE.forEach((rel) => scan(rel, true));

/* A file that vanished is not a pass. */
if (missingFiles.length) {
  console.error('SCANNED FILE MISSING — the scan list names a file that is not there:');
  missingFiles.forEach((f) => console.error(`  · ${f}`));
  console.error('');
}

/* An exception that matches nothing has outlived the occurrence it excused, and
   is now an unreviewed licence sitting in a gate. Fail on it. */
const deadExceptions = KNOWN.filter((k) => !usedException.has(`${k.file}|${k.id}|${k.contains}`));

console.log('values checked:');
for (const v of SUPERSEDED) {
  console.log(`  · ${pad(v.id, 14)} ${pad(perValue.get(v.id) + ' found', 10)} superseded by ${v.ruling}`);
}
console.log(`\n${SCAN.length} documents + ${SCAN_SOURCE.length} source files (comments only), ${missingFiles.length} missing   marked: ${marked}   known exceptions used: ${excepted}   unmarked: ${hits.length}`);

if (hits.length) {
  console.error('\nSTALE VALUES WITH NO ADJACENT AMENDMENT:\n');
  for (const h of hits) {
    console.error(`  ${h.rel}:${h.line}${h.isSource ? '   (in a comment)' : ''}`);
    console.error(`    value:      ${h.v.what}`);
    console.error(`    superseded: ${h.v.ruling}`);
    console.error(`    line:       ${h.text.length > 140 ? h.text.slice(0, 137) + '…' : h.text}`);
    console.error('');
  }
  console.error('Fix: amend in place per R-R — keep the value, strike it, and name the');
  console.error('superseding ruling beside it. Do NOT restate the live measurement: R-Q');
  console.error('forbids a governing document holding a number, which is what created');
  console.error('every one of these.\n');
}

if (deadExceptions.length) {
  console.error('KNOWN EXCEPTIONS THAT MATCH NOTHING — remove them:\n');
  deadExceptions.forEach((k) => console.error(`  · ${k.file}  ${k.id}  "${k.contains}"`));
  console.error('');
}

const failed = hits.length + deadExceptions.length + missingFiles.length;
if (failed) { console.error(`FAIL — ${hits.length} unmarked, ${deadExceptions.length} dead exceptions, ${missingFiles.length} missing files\n`); process.exit(1); }
console.log('every known-superseded value is amended, excepted or absent.\n');
