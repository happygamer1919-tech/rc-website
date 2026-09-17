#!/usr/bin/env node
/* Stub count gate, card RC-148 (W21-03).

   "44 of the 54 projects are stubs" was written at W6-02 and stayed in four
   documents while the data moved: 16 on 2026-09-17. RC-144 corrected one of
   them, the readiness audit found the rest, and nothing in the repo noticed
   either time. Section 16 built exactly this mechanism for values a ruling
   supersedes; a stub count is not ruling-held, it is DATA, so it gets its own
   check: the number the documents state must equal the number the data holds.

   MEASURED, NEVER TRANSCRIBED. The count comes from content/projects.json with
   build.js's own rule: a project renders when its title and summary are both
   real (neither empty nor TODO:-prefixed) in that locale, so a stub is a project
   that renders in neither... and the count is taken per locale. If the two
   locales ever disagree, no single number can be true, and this fails saying so
   rather than picking one.

   WHAT COUNTS AS A CLAIM, and the two directions it is checked in.

   FORWARD, so a new phrasing is held: in every sentence that mentions a stub,
   the CLAIM patterns below read the number that quantifies the stubs -- "16
   stubs", "16 stub projects", "the other 16 are stubs", "16 of the covers belong
   to stub projects", "16 of the 54 projects ... are stubs", "none of the 16
   reaches". Each one read must equal the measured count, or be named in ALLOWED
   with its reason. Numbers that are not about stubs are not claims: the slot
   totals, "3 gallery slots per stub", a status row's own figures.

   BACKWARD, so the value that actually drifted cannot come back: any KNOWN_STALE
   count appearing in a stub sentence fails, whatever the phrasing around it,
   unless it is struck. That is the check-stale-docs model, for a value that is
   data rather than ruling-held.

   STRUCK VALUES ARE DEAD BY CONSTRUCTION. R-R's ~~44~~ **16** marks the old
   figure as history in place, so the strike is removed before any pattern reads
   the sentence, and struck values are counted and printed rather than judged.

   IT NEVER PASSES ON NOTHING. It fails when projects.json cannot be read or
   holds no projects, when a scanned document is missing, when no sentence about
   stubs is found at all, and when an ALLOWED entry matches nothing, which would
   be an unreviewed licence sitting inside a gate (section 16's own rule).

   DECISIONS.md is not scanned: it is the record, and its dated entries state
   what was true when they were written (R-S). docs/QUESTIONS.md is scanned in
   its HEADINGS only, for the same reason: a heading is status metadata and a
   body is a snapshot.

   Usage:  node scripts/check-stub-count.js [root]  */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const WINDOW = 3;

const fail = (msg) => { console.error(`\nSTUB COUNT GATE FAILED: ${msg}\n`); process.exit(1); };

/* --- the measurement -------------------------------------------------------- */
const projectsFile = path.join(ROOT, 'content/projects.json');
if (!fs.existsSync(projectsFile)) fail(`${projectsFile} is missing, so nothing was measured.`);
let projects;
try { projects = JSON.parse(fs.readFileSync(projectsFile, 'utf8')); } catch (e) { fail(`content/projects.json did not parse: ${e.message}`); }
const list = Array.isArray(projects) ? projects : (projects.projects || Object.values(projects).find(Array.isArray));
if (!Array.isArray(list) || !list.length) fail('content/projects.json holds no projects, so the count would be vacuous.');
// build.js's REAL(): neither empty nor TODO:-prefixed.
const REAL = (v) => typeof v === 'string' && v.trim() !== '' && !v.trim().startsWith('TODO:');
const LOCALES = ['ro', 'ru'];
const stubs = {};
for (const lc of LOCALES) {
  stubs[lc] = list.filter((p) => !(REAL(p.title && p.title[lc]) && REAL(p.summary && p.summary[lc]))).length;
}
const TOTAL = list.length;
console.log(`measured from content/projects.json: ${TOTAL} projects; stubs ${LOCALES.map((lc) => `${lc.toUpperCase()} ${stubs[lc]}`).join(', ')}`);
const distinct = [...new Set(LOCALES.map((lc) => stubs[lc]))];
if (distinct.length !== 1) fail(`the locales disagree (${LOCALES.map((lc) => `${lc} ${stubs[lc]}`).join(', ')}), so no document can state one stub count. Say both, or fix the data.`);
const STUBS = distinct[0];

/* --- what is scanned -------------------------------------------------------- */
const SCAN = [
  'docs/CLAUDE.md',
  'docs/RC-WEBSITE-MASTER-PLAN.md',
  'docs/RC-PHOTO-MANIFEST.md',
  'docs/SHOOT-SHEET.md',
  'docs/BACKLOG.md',
  'RELEASE-NOTES.md',
  'README.md',
];
const HEADINGS_ONLY = 'docs/QUESTIONS.md';
const NOT_SCANNED = [
  ['DECISIONS.md', 'the record. Its dated entries state what was true when written (R-S), including the counts that were true then.'],
  ['docs/audits/', 'dated audits, records of a measurement on a day.'],
  ['docs/board/', 'defect cards, records of what a critic measured.'],
  ['content/, scripts/, src/', 'not prose. The count lives in the data, and this gate reads it there.'],
];

/* Occurrence-level exceptions: a number in a stub sentence that is not a stub
   count. Each names the file, a snippet that must be on the line, and why. An
   entry that matches nothing FAILS: it has outlived what it excused. */
const ALLOWED = [
  {
    file: 'RELEASE-NOTES.md',
    contains: 'The 44 new',
    numbers: [44],
    reason: 'the dated wave 6 record, 2026-08-31: "10 projects became 54. The 44 new ones are stubs with empty fields". It states what W6-02 did on the day, which stays true; a dated record is a snapshot (R-S), not a claim about the data today.',
  },
];

/* --- the scan --------------------------------------------------------------- */
/* Each pattern captures the number that quantifies the stubs. They are listed
   here rather than inferred, and every one of them is printed with how many
   times it matched, so a phrasing that stops matching is visible. */
const CLAIMS = [
  /* "stubs", or "stub project(s)". NOT a bare singular "stub" followed by another
     noun: "71 stub sentences read" counts sentences, and a gate that reads that as
     a stub count is a gate people learn to ignore. */
  { id: 'N stubs | N stub projects', re: /(\d{1,3})\s+(?:new\s+|remaining\s+|seeded\s+)?(?:stubs\b|stub projects?\b)/gi },
  { id: 'the other N are stubs', re: /the other\s+(\d{1,3})\s+(?:are|remain)\s+stubs?\b/gi },
  { id: 'N of the [M] covers|projects ... stubs', re: /(\d{1,3})\s+of the\s+(?:\d{1,3}\s+)?(?:covers|projects)[^.|]{0,80}?\bstubs?\b/gi },
  { id: 'none of the N reaches', re: /none of the\s+(\d{1,3})\s+reaches/gi },
];
/* Counts this repo has stated and has since corrected. Appending to this list is
   part of correcting a stub count, the way R-Q makes the staleness list part of
   recording a ruling. */
const KNOWN_STALE = [{ value: 44, was: "W6-02's count of 2026-08-31, corrected at RC-148 on 2026-09-17" }];
/* A known stale count is refused only when it sits within this many characters of
   the stub word it would be quantifying. A wave 19 status row says "Lighthouse 44
   of 44 runs" 80 characters away from "16 stub projects" in the same row, and that
   44 is a Lighthouse run count. */
const NEAR = 60;
/* Digits that are not quantities. Blanked before any pattern reads the sentence. */
const SKIP = [
  { re: /\b\d{4}-\d{2}-\d{2}\b/g, what: 'dates' },
  { re: /\bW\d+(?:-\d+)*[a-z]?\b/gi, what: 'card ids such as W6-02 and W21-03' },
  { re: /\bRC-\d+\b/gi, what: 'ticket ids' },
  { re: /\bQ-[A-Z0-9-]+\b/gi, what: 'question ids such as Q-04' },
  { re: /\bR-[A-Z]+\b/g, what: 'ruling ids' },
  { re: /\b\d{4,}\b/g, what: 'four-digit and longer numbers' },
];

console.log(`accepted as a stub count: the measured ${STUBS} (or an ALLOWED entry). Struck values (~~44~~) are history and are counted, not judged.`);
console.log(`claim patterns: ${CLAIMS.map((c) => c.id).join('; ')}`);
console.log(`known stale counts, refused within ${NEAR} characters of a stub unless struck: ${KNOWN_STALE.map((k) => `${k.value} (${k.was})`).join('; ')}`);
console.log(`skipped as not quantities: ${SKIP.map((x) => x.what).join('; ')}`);
for (const [f, why] of NOT_SCANNED) console.log(`  not scanned: ${f} — ${why}`);

const files = [...SCAN, HEADINGS_ONLY];
const missing = files.filter((f) => !fs.existsSync(path.join(ROOT, f)));
if (missing.length) fail(`${missing.length} scanned document(s) missing: ${missing.join(', ')}. A file that vanished is not a file that passed.`);

const used = new Set();
const problems = [];
const perPattern = Object.fromEntries(CLAIMS.map((c) => [c.id, 0]));
let sentences = 0, claims = 0, struckSeen = 0;

const a_key = (a) => `${a.file}|${a.contains}`;

/* Markdown wraps a sentence across lines, and one of this card's own corrections
   ("16 of the covers belong to / stub projects") straddles a line break, so a
   line-by-line scan would not have read it. Each paragraph is flowed into one
   string with its newlines turned into spaces, and the line number of every hit
   is recovered from the offset. Sentences still break at . ! ? and |, so table
   rows flowed together do not bleed into each other. */
function paragraphs(text) {
  const out = [];
  let line = 1, i = 0;
  for (const part of text.split(/\n\s*\n/)) {
    out.push({ text: part.replace(/\n/g, ' '), firstLine: line, raw: part });
    line += part.split('\n').length + 1;
    i += part.length;
  }
  return out;
}

for (const f of files) {
  const text = fs.readFileSync(path.join(ROOT, f), 'utf8');
  for (const para of paragraphs(text)) {
    for (const m of para.text.matchAll(/[^.!?|]*\bstubs?\b[^.!?|]*/gi)) {
      const sentence = m[0];
      if (f === HEADINGS_ONLY && !/(^|\s)#{1,6}\s/.test(para.raw.split('\n')[0]) ) {
        // headings only: the paragraph must itself be a heading line
        if (!para.raw.startsWith('#')) continue;
      }
      sentences++;
      const struck = [...sentence.matchAll(/~~([^~]*)~~/g)];
      for (const st of struck) for (const n of st[1].matchAll(/\b\d{1,3}\b/g)) struckSeen++;
      /* Ids and dates carry digits and quantify nothing: "W21-03 Stub count" must
         not read as "3 stubs". Blanked, not deleted, so offsets stay true. */
      let live = sentence.replace(/~~[^~]*~~/g, (x) => ' '.repeat(x.length)).replace(/\*\*/g, '  ').replace(/`/g, ' ');
      for (const sk of SKIP) live = live.replace(sk.re, (x) => ' '.repeat(x.length));
      const before = para.text.slice(0, m.index);
      const where = `${f}:${para.firstLine + (before.match(/ /g) ? 0 : 0)}`;
      const lineNo = para.firstLine + countLinesBefore(para.raw, sentence);
      const at = `${f}:${lineNo}`;
      for (const c of CLAIMS) {
        for (const n of live.matchAll(c.re)) {
          const value = Number(n[1]);
          perPattern[c.id]++;
          const allow = ALLOWED.find((a) => a.file === f && para.raw.includes(a.contains) && a.numbers.includes(value));
          if (value === STUBS) { claims++; continue; }
          if (allow) { used.add(a_key(allow)); continue; }
          problems.push({ where: at, value, why: `stated as a stub count by "${c.id}"`, text: live.trim().slice(0, 110) });
        }
      }
      const stubAt = [...live.matchAll(/\bstubs?\b/gi)].map((x) => x.index);
      for (const k of KNOWN_STALE) {
        for (const hit of live.matchAll(new RegExp(`\\b${k.value}\\b`, 'g'))) {
          if (!stubAt.some((sa) => Math.abs(sa - hit.index) <= NEAR)) continue;
          const allow = ALLOWED.find((a) => a.file === f && para.raw.includes(a.contains) && a.numbers.includes(k.value));
          if (allow) { used.add(a_key(allow)); continue; }
          problems.push({ where: at, value: k.value, why: `a known stale count, ${k.was}, unstruck within ${NEAR} characters of "stub"`, text: live.trim().slice(0, 110) });
        }
      }
    }
  }
}

/* The line a sentence starts on, counted inside its paragraph. */
function countLinesBefore(rawParagraph, sentence) {
  const needle = sentence.trim().split(/\s+/).slice(0, 4).join(' ');
  const flat = rawParagraph.replace(/\n/g, ' ');
  const idx = flat.indexOf(needle);
  if (idx < 0) return 0;
  let seen = 0, count = 0;
  for (const l of rawParagraph.split('\n')) {
    if (seen + l.length + 1 > idx) break;
    seen += l.length + 1; count++;
  }
  return count;
}

console.log(`\nclaim patterns matched: ${CLAIMS.map((c) => `${c.id} ${perPattern[c.id]}`).join('; ')}`);
console.log(`documents read: ${files.length} (${SCAN.length} whole, 1 headings only); sentences mentioning a stub: ${sentences}`);
console.log(`stub counts read and equal to the measured ${STUBS}: ${claims}; struck historical values passed over: ${struckSeen}`);
for (const a of ALLOWED) console.log(`  allowed: ${a.file}, ${a.numbers.join(', ')} where "${a.contains}" — ${a.reason}`);

/* Everything that went wrong is reported together, most specific first: a stale
   figure is the finding, and "nothing was verified" is a finding too. Reporting
   only the first would hide the other. */
const report = [];
if (problems.length) {
  report.push(`${problems.length} stale stub count(s). The data says ${STUBS}.`);
  for (const p of problems) report.push(`  ${p.where}: ${p.value}, ${p.why}\n      "${p.text}"`);
  report.push(`  Correct it under R-R (strike the old value, state ${STUBS} beside it, name the card),`);
  report.push('  or add an ALLOWED entry if the number is not a stub count.');
}
const unusedAllowed = ALLOWED.filter((a) => !used.has(a_key(a)));
if (unusedAllowed.length) {
  report.push(`${unusedAllowed.length} ALLOWED entry that matches nothing, which is an unreviewed licence inside a gate:`);
  for (const a of unusedAllowed) report.push(`  ${a.file}: "${a.contains}" (${a.numbers.join(', ')}) — ${a.reason}`);
}
if (!sentences) report.push('no sentence about stubs was found in any scanned document, so this gate checked nothing.');
else if (!claims) report.push(`no document states the current stub count (${STUBS}), so nothing was verified. Every document that states a count must be corrected when the data moves.`);

if (report.length) {
  console.error(`\nSTUB COUNT GATE FAILED:`);
  for (const line of report) console.error(line.startsWith(' ') ? line : `  ${line}`);
  console.error('');
  process.exit(1);
}
console.log(`\nevery stub count stated in ${files.length} documents equals the measured ${STUBS}.`);
