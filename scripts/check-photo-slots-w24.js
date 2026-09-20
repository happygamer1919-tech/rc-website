#!/usr/bin/env node
/* The wave 24 photo slot ledger gate, card W24-01. Run by `quality` on every
   pull request, over the BUILT site.

   Every image wave 24 renders is a placeholder. A separate photo session fills
   them, and docs/PHOTO-SLOTS-W24.json is the list that session is handed. A list
   that does not match what the site renders is worse than no list: it sends a
   photographer out for a photograph nothing will show, and it leaves a box on the
   site that nobody was asked to photograph.

   So the two are held together in BOTH directions:

   1. FORWARD. Every placeholder rendered in dist/ has a row in the ledger.
      A placeholder is `data-photo-slot="<id>"` on the shared .ph component,
      which build.js is the only writer of.
   2. REVERSE. Every row in the ledger is rendered by at least one built page.
      A row nothing renders is an unreviewed line in a request list.

   And each row is checked against what it renders: the ratio the page carries in
   --ph-ratio is the ratio the row states, because the row is the one place a
   ratio is written (docs/CLAUDE.md section 14).

   IT NEVER PASSES ON NOTHING, and it is not trusted on a count alone.
   docs/CLAUDE.md section 13 as amended by W18-03: a gate that reads files says
   how many and fails on none. This prints the pages and the rows it read before
   any result, and fails on zero pages read or a ledger it cannot read.

   THE SELF-TEST IS WHAT MAKES IT A GATE WHILE THE LEDGER IS EMPTY. W24-01 ships
   the component, the ledger and this gate; the first rows arrive with W24-04, so
   on W24-01 both real counts are zero and both assertions would hold vacuously.
   Section 13's corollary is that an assertion nobody has watched fail is not a
   gate, so before any real result this runs both arms against a synthetic page
   and a synthetic ledger: a rendered placeholder with no row, and a row nothing
   renders. If either arm does not fire, the gate fails, because then it has
   proved nothing about the real tree either. Same arrangement as the parser
   self-test in scripts/check-image-metadata.js (gate 17).

   Zero dependencies. Reads HTML as text: the placeholder build.js emits is a
   single-line, attribute-quoted div, which build.js controls.

   Usage:  node build.js && node scripts/check-photo-slots-w24.js */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const LEDGER = path.join(ROOT, 'docs/PHOTO-SLOTS-W24.json');
const fail = (msg) => { console.error(`\nPHOTO SLOT LEDGER GATE FAILED: ${msg}\n`); process.exit(1); };

const attr = (tag, name) => { const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`)); return m ? m[1] : null; };

/* Every .ph placeholder on one page, as { id, ratio, where }. Shared by the real
   run and by the self-test, so the self-test exercises the parser the run uses
   and not a second copy of it. */
function placeholdersIn(html, rel) {
  const found = [];
  for (const m of html.matchAll(/<div\b[^>]*\bdata-photo-slot="[^"]*"[^>]*>/g)) {
    const open = m[0];
    const id = attr(open, 'data-photo-slot');
    const cls = (attr(open, 'class') || '').split(/\s+/);
    const style = attr(open, 'style') || '';
    const ratio = (style.match(/--ph-ratio:\s*([^;"]+)/) || [])[1];
    found.push({
      id,
      ratio: ratio ? ratio.trim() : null,
      variant: cls.includes('ph--dark') ? 'dark' : (cls.includes('ph--light') ? 'light' : null),
      isComponent: cls.includes('ph'),
      where: `${rel}: data-photo-slot="${id}"`,
    });
  }
  return found;
}

/* The two assertions, over a set of pages and a set of rows. Returns the list of
   problems, so the self-test can assert that each arm produces its own message
   rather than merely producing one. */
function check(pages, rows) {
  const problems = [];
  const byId = new Map(rows.map((r) => [r.id, r]));
  const rendered = new Set();

  for (const page of pages) {
    for (const ph of placeholdersIn(page.html, page.rel)) {
      if (!ph.isComponent) { problems.push({ id: 'not-component', text: `${ph.where} is not the shared .ph component. Every placeholder is one component.` }); continue; }
      if (!ph.variant) { problems.push({ id: 'no-variant', text: `${ph.where} carries neither ph--light nor ph--dark.` }); continue; }
      const row = byId.get(ph.id);
      if (!row) { problems.push({ id: 'unledgered', text: `${ph.where} has no row in docs/PHOTO-SLOTS-W24.json. A placeholder and its ledger row land in the same commit.` }); continue; }
      rendered.add(ph.id);
      if (ph.ratio !== row.ratio) {
        problems.push({ id: 'ratio', text: `${ph.where} renders --ph-ratio: ${ph.ratio}, and its ledger row states ${row.ratio}. The row is the one place a ratio is written.` });
      }
    }
  }

  for (const row of rows) {
    if (!rendered.has(row.id)) {
      problems.push({ id: 'unrendered', text: `docs/PHOTO-SLOTS-W24.json row "${row.id}" (${row.page}) is rendered by no built page. A row nothing renders is a request for a photograph nothing will show.` });
    }
  }
  return problems;
}

/* --- the self-test, before any real result -------------------------------- */

const SELF = [
  {
    arm: 'forward: a rendered placeholder with no ledger row',
    want: 'unledgered',
    pages: [{ rel: 'self-test/a.html', html: '<div class="ph ph--light" data-photo-slot="SELFTEST-01" style="--ph-ratio: 1 / 1;"><span class="ph__id">SELFTEST-01</span></div>' }],
    rows: [],
  },
  {
    arm: 'reverse: a ledger row nothing renders',
    want: 'unrendered',
    pages: [{ rel: 'self-test/b.html', html: '<p>no placeholder here</p>' }],
    rows: [{ id: 'SELFTEST-02', page: '/nowhere/', ratio: '1 / 1', min_px: '1000x1000', shows: 'nothing' }],
  },
  {
    arm: 'a placeholder whose rendered ratio disagrees with its row',
    want: 'ratio',
    pages: [{ rel: 'self-test/c.html', html: '<div class="ph ph--dark" data-photo-slot="SELFTEST-03" style="--ph-ratio: 16 / 9;"><span class="ph__id">SELFTEST-03</span></div>' }],
    rows: [{ id: 'SELFTEST-03', page: '/somewhere/', ratio: '1 / 1', min_px: '1000x1000', shows: 'nothing' }],
  },
];

/* The control the arms are read against, watched green in this same run and
   immediately before them (R-AB): one page rendering one slot, one row for it. */
const CONTROL = {
  pages: [{ rel: 'self-test/control.html', html: '<div class="ph ph--light" data-photo-slot="SELFTEST-00" style="--ph-ratio: 4 / 3;"><span class="ph__id">SELFTEST-00</span></div>' }],
  rows: [{ id: 'SELFTEST-00', page: '/control/', ratio: '4 / 3', min_px: '1000x750', shows: 'nothing' }],
};

const controlBefore = check(CONTROL.pages, CONTROL.rows);
if (controlBefore.length) fail(`the self-test control is not clean, so its arms prove nothing: ${controlBefore.map((p) => p.text).join(' | ')}`);
console.log('self-test control: clean');

for (const t of SELF) {
  const got = check(t.pages, t.rows);
  const hit = got.filter((p) => p.id === t.want);
  if (hit.length !== 1) {
    fail(`the self-test arm "${t.arm}" did not fire on its own message "${t.want}". It reported: ${got.length ? got.map((p) => p.id).join(', ') : 'nothing'}. An assertion nobody has watched fail is not a gate.`);
  }
  console.log(`self-test arm fired on its own message: ${t.arm} -> ${t.want}`);
}

const controlAfter = check(CONTROL.pages, CONTROL.rows);
if (controlAfter.length) fail(`the self-test control is dirty after the arms, so the arms left residue: ${controlAfter.map((p) => p.text).join(' | ')}`);
console.log('self-test control, again: clean\n');

/* --- the real run --------------------------------------------------------- */

if (!fs.existsSync(LEDGER)) fail(`docs/PHOTO-SLOTS-W24.json is missing. A file that vanished is not a file that passed.`);
let ledger;
try { ledger = JSON.parse(fs.readFileSync(LEDGER, 'utf8')); } catch (e) { fail(`docs/PHOTO-SLOTS-W24.json does not parse: ${e.message}`); }
if (!Array.isArray(ledger.slots)) fail('docs/PHOTO-SLOTS-W24.json has no "slots" array. An empty ledger is [], never a missing key.');

if (!fs.existsSync(DIST)) fail('no dist/, run: node build.js');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const files = walk(DIST).filter((f) => f.endsWith('.html'));
console.log(`files read: ${files.length} HTML pages in dist/`);
console.log(`ledger rows read: ${ledger.slots.length} in docs/PHOTO-SLOTS-W24.json`);
if (files.length === 0) fail('zero HTML pages read in dist/, so no placeholder was checked.');

const pages = files.map((f) => ({ rel: path.relative(ROOT, f), html: fs.readFileSync(f, 'utf8') }));
const totalRendered = pages.reduce((n, p) => n + placeholdersIn(p.html, p.rel).length, 0);
console.log(`placeholders rendered: ${totalRendered}`);

const problems = check(pages, ledger.slots);

if (problems.length) {
  console.error(`\n${problems.length} problem${problems.length === 1 ? '' : 's'}:`);
  for (const p of problems) console.error(`  [${p.id}] ${p.text}`);
  fail(`${problems.length} placeholder or ledger row is not matched by the other.`);
}

if (totalRendered === 0 && ledger.slots.length === 0) {
  console.log('\nNo placeholder is rendered and the ledger is empty. That is W24-01\'s stated state:');
  console.log('the component, the ledger and this gate ship first, and the first rows arrive with W24-04.');
  console.log('The self-test above is what this run proves, and it fired on all three arms.');
}

console.log(`\nPHOTO SLOT LEDGER GATE PASSED: ${totalRendered} placeholder${totalRendered === 1 ? '' : 's'} on ${files.length} pages, ${ledger.slots.length} ledger row${ledger.slots.length === 1 ? '' : 's'}, matched both ways.`);
