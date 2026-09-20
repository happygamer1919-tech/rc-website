#!/usr/bin/env node
/* CSS collision gate 22, card W24-09b (wave 24). Run by `quality` with the other
   static checks.

   WHY THIS EXISTS. Wave 24 shipped the SAME DEFECT TWICE, in one card, and both
   times every gate was green.

     · W24-07 named the bento hub's tiles `.bento__tile`. The garduri chooser had
       owned that name since wave 16. Both declarations are (0,1,0), the chooser's
       is later in the file, so it won: the hub's tall tile rendered 128px wide
       against an intended 380. Found by eye, corrected by W24-07a.

     · The same commit added a second bare `.faq` block for the roca vulcanica
       page. The service pages had owned `.faq` since wave 14 for a different
       shape. Same specificity, same later-wins, and **every one of the twenty
       service pages silently grew by exactly 99px**. It was live for two days.
       It surfaced only because ONE of those pages, case la cheie, had just been
       given a budget of its own by W24-05 and breached it by 39px; the other
       eighteen sit under a shared 6,000px budget with room to hide in.

   The second one is why this gate is static and not another browser gate. Gate 20
   reads geometry, and it would not have caught it either: it measures bentos and
   catalogue grids, and nothing told it to look at a FAQ list on a service page. A
   height budget caught one page of twenty, by luck of that page having a tight
   budget. **What both defects have in common is not a rendered box. It is two
   bare declarations of one class, far apart in the file, disagreeing about a
   property.** That is what this reads.

   WHAT IT ASSERTS. In `src/styles.css`, for every class used as a BARE selector
   (the whole selector is `.thing`, not `.a .thing` and not `.thing--x`): no two
   such declarations, separated by more than ADJACENT rules, may set the same
   property to different values. Shorthands are expanded, so `margin-top` against
   `margin` is a clash and not a miss, which is exactly the `.faq` case.

   WHY IT IS NARROW ON PURPOSE. A looser rule is a noisy rule and a noisy gate
   gets worked around. Three looser versions were tried against the CURRENT clean
   stylesheet first:
     · any class declared far apart            -> 9 false positives
     · any bare class declared twice           -> 12 false positives
     · this rule                               -> 0
   The site legitimately declares a component's base rules and then its rules in
   some later context; it does not legitimately contradict itself about one
   property in two distant bare blocks. Adjacent declarations are skipped for the
   same reason: `.prod__price` and `.prod__ask` sharing a rule and then differing
   is the ordinary base-then-variant pattern.

   IT NEVER PASSES ON NOTHING. It fails when the stylesheet is missing, when it
   parses to no rules, and when it finds no bare class selectors at all.

   ITS SELF-TEST IS BOTH REAL DEFECTS. Before any real result it runs the
   stylesheet as it stood at W24-07 (`3392bb4`), which carries both collisions,
   and requires this gate to report each of them by class name. The control is the
   stylesheet that ships, read clean immediately before and immediately after
   (R-AB). Neither arm is invented: each is a thing this repo actually shipped.

   That stylesheet is VENDORED at `scripts/fixtures/styles-at-3392bb4.css`, and
   where the commit is reachable it is verified byte-for-byte against git first.
   See the comment at ARM_SHA for why it is committed rather than read from git.

   Zero dependencies, no browser, no build.

   Usage:  node scripts/check-css-collisions.js [stylesheet] */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const CSS = path.resolve(process.argv[2] || path.join(ROOT, 'src', 'styles.css'));

/* Two bare declarations this close together are the ordinary pattern of a base
   rule followed by its variants, not a collision between two components. */
const ADJACENT = 25;

const fail = (msg) => { console.error(`\nCSS COLLISION GATE FAILED: ${msg}\n`); process.exit(1); };

/* A shorthand and its longhands are the same property for this purpose. That is
   the whole `.faq` case: `margin-top: 28px` in one block and `margin: 40px 0 0`
   in another is a contradiction that a plain name comparison reads as two
   unrelated properties. */
const LONGHAND = {
  margin: ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'],
  padding: ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
  border: ['border-width', 'border-style', 'border-color'],
  'border-radius': ['border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius'],
  background: ['background-color', 'background-image'],
  font: ['font-size', 'font-weight', 'font-family', 'line-height'],
  flex: ['flex-grow', 'flex-shrink', 'flex-basis'],
  gap: ['row-gap', 'column-gap'],
  inset: ['top', 'right', 'bottom', 'left'],
};
const family = (p) => {
  const out = new Set([p]);
  if (LONGHAND[p]) LONGHAND[p].forEach((x) => out.add(x));
  for (const [short, longs] of Object.entries(LONGHAND)) if (longs.includes(p)) out.add(short);
  return out;
};

/* Top-level rules only. An @media block's contents are deliberately not read:
   redeclaring a property inside a breakpoint is the point of a breakpoint. */
function topLevelRules(css) {
  const src = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const out = [];
  let depth = 0, sel = '', body = '';
  for (const ch of src) {
    if (ch === '{') {
      depth++;
      if (depth === 1) { out.push({ sel: sel.trim(), body: '' }); sel = ''; } else body += ch;
      continue;
    }
    if (ch === '}') {
      depth--;
      if (depth === 0) { out[out.length - 1].body = body; body = ''; } else body += ch;
      continue;
    }
    if (depth === 0) sel += ch; else body += ch;
  }
  return out.filter((r) => r.sel && !r.sel.startsWith('@'));
}

function declarations(body) {
  const m = {};
  for (const d of body.split(';')) {
    const i = d.indexOf(':');
    if (i < 0) continue;
    const k = d.slice(0, i).trim(), v = d.slice(i + 1).trim();
    if (!/^[a-z-]+$/.test(k) || !v) continue;
    m[k] = v;
  }
  return m;
}

function collisions(css) {
  const rules = topLevelRules(css);
  if (!rules.length) return { rules: 0, bare: 0, problems: [] };

  const owners = new Map();
  rules.forEach((r, i) => {
    for (const part of r.sel.split(',')) {
      const m = part.trim().match(/^\.([A-Za-z0-9_-]+)$/);
      if (!m) continue;
      if (!owners.has(m[1])) owners.set(m[1], []);
      owners.get(m[1]).push(i);
    }
  });

  const problems = [];
  for (const [cls, idxs] of owners) {
    for (let a = 0; a < idxs.length; a++) {
      for (let b = a + 1; b < idxs.length; b++) {
        if (idxs[b] - idxs[a] < ADJACENT) continue;
        const first = declarations(rules[idxs[a]].body);
        const later = declarations(rules[idxs[b]].body);
        const clash = [];
        for (const [k, v] of Object.entries(later)) {
          for (const kin of family(k)) {
            if (first[kin] !== undefined && first[kin] !== v) clash.push(`${kin}: ${first[kin]}   then   ${k}: ${v}`);
          }
        }
        if (clash.length) problems.push({ cls, a: idxs[a], b: idxs[b], clash: [...new Set(clash)] });
      }
    }
  }
  return { rules: rules.length, bare: owners.size, problems };
}

/* --- the self-test, before any real result -------------------------------- */
/* The control is the stylesheet that ships, read clean here and again after the
   arms: an arm read against a control nobody watched green proves nothing, which
   is the second case recorded in R-AB. */
if (!fs.existsSync(CSS)) fail(`${path.relative(ROOT, CSS)} is missing.`);
/* The control is ALWAYS the stylesheet this repo ships, never the file named on
   the command line. Passing another file is how a historical tree is checked, and
   a dirty subject must not be reported as a broken self-test: the self-test is
   about this gate working, the real run is about the file under test. */
const SHIP = path.join(ROOT, 'src', 'styles.css');
if (!fs.existsSync(SHIP)) fail('src/styles.css is missing, so the self-test has no control.');
const shipping = fs.readFileSync(SHIP, 'utf8');
const subject = fs.readFileSync(CSS, 'utf8');

const controlBefore = collisions(shipping);
if (controlBefore.problems.length) {
  fail(`the self-test control is not clean, so its arms prove nothing: ${controlBefore.problems.map((p) => '.' + p.cls).join(', ')}`);
}
console.log(`self-test control (${path.relative(ROOT, SHIP)}): clean`);

/* The arm is this repo's own stylesheet at W24-07, which carried both collisions at
   once. It is neither invented nor curated: it is that commit's file, whole.

   IT IS VENDORED, not read from git at run time. The first version of this gate
   ran `git show 3392bb4:src/styles.css`, and `quality` failed in five seconds:
   `actions/checkout` makes a shallow clone, so the commit is not there. The gate
   failed loudly rather than skipping, which was the right behaviour and is why
   this comment can be written at all -- but a gate that depends on the clone
   depth of whoever runs it is a gate that does not run everywhere. Setting
   `fetch-depth: 0` would have fixed it by making every CI run fetch 35MB of
   history to serve one self-test, which is the tail wagging the dog.

   So the file is committed. It is a historical snapshot, so it cannot drift by
   definition; and WHERE THE COMMIT IS REACHABLE, which is any full clone, the
   fixture is checked byte-for-byte against git before it is used. A workstation
   proves the fixture is honest; CI trusts the proof. */
const ARM_SHA = '3392bb4';
const ARM_WANT = ['faq', 'bento__tile'];
const ARM_FILE = path.join(__dirname, 'fixtures', `styles-at-${ARM_SHA}.css`);
if (!fs.existsSync(ARM_FILE)) {
  fail(`the self-test fixture ${path.relative(ROOT, ARM_FILE)} is missing. An assertion nobody has watched fail is not a gate.`);
}
const armCss = fs.readFileSync(ARM_FILE, 'utf8');
try {
  // stderr piped, not inherited: in a shallow clone git prints "invalid object
  // name" and that is an expected condition here, not something to show the reader.
  const fromGit = execFileSync('git', ['show', `${ARM_SHA}:src/styles.css`], { cwd: ROOT, encoding: 'utf8', maxBuffer: 8 << 20, stdio: ['ignore', 'pipe', 'pipe'] });
  if (fromGit !== armCss) {
    fail(`the self-test fixture does not match src/styles.css at ${ARM_SHA}. The fixture is supposed to BE that file; regenerate it with:\n  git show ${ARM_SHA}:src/styles.css > ${path.relative(ROOT, ARM_FILE)}`);
  }
  console.log(`self-test fixture verified byte-for-byte against ${ARM_SHA}`);
} catch (e) {
  if (/does not match/.test(e.message)) throw e;
  // A shallow clone cannot reach the commit. The fixture is still used; it is the
  // verification that is unavailable here, not the arm.
  console.log(`self-test fixture used as committed (${ARM_SHA} not reachable in this clone, so it could not be re-verified here)`);
}
const arm = collisions(armCss);
const armClasses = new Set(arm.problems.map((p) => p.cls));
for (const want of ARM_WANT) {
  if (!armClasses.has(want)) {
    fail(`the self-test arm (src/styles.css at ${ARM_SHA}, which shipped both wave 24 collisions) did not report ".${want}". It reported: ${armClasses.size ? [...armClasses].map((c) => '.' + c).join(', ') : 'nothing'}.`);
  }
}
console.log(`self-test arm fired on both shipped collisions at ${ARM_SHA}: ${[...armClasses].map((c) => '.' + c).join(', ')}`);
for (const p of arm.problems) for (const c of p.clash) console.log(`    .${p.cls}  ${c}`);

const controlAfter = collisions(shipping);
if (controlAfter.problems.length) fail('the self-test control is dirty after the arms, so the arms left residue.');
console.log('self-test control, again: clean\n');

/* --- the real run --------------------------------------------------------- */
const result = collisions(subject);
if (CSS !== SHIP) console.log(`subject: ${path.relative(ROOT, CSS)}`);
if (!result.rules) fail(`${path.relative(ROOT, CSS)} parsed to no top-level rules.`);
if (!result.bare) fail(`${path.relative(ROOT, CSS)} has no bare class selectors, so nothing would be compared.`);
console.log(`top-level rules read: ${result.rules}; classes used as a bare selector: ${result.bare}`);

if (result.problems.length) {
  console.error(`\nCSS COLLISION GATE FAILED: ${result.problems.length} class(es) declared twice with contradicting properties`);
  for (const p of result.problems) {
    console.error(`\n  .${p.cls}  (top-level rules ${p.a} and ${p.b})`);
    for (const c of p.clash) console.error(`    ${c}`);
    console.error(`    One of these two blocks belongs to another component. Give it its own prefix (docs/CLAUDE.md section 3.1).`);
  }
  console.error('');
  process.exit(1);
}
console.log(`\nno class is declared twice with contradicting properties, across ${result.bare} bare class selectors in ${result.rules} top-level rules.`);
console.log(`The self-test above is what this run proves, and it fired on both collisions wave 24 shipped.`);
