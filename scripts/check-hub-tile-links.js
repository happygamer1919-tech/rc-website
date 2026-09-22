#!/usr/bin/env node
/* Hub tile link gate, ruling W25-R24. Card W25-24.

       node build.js && node scripts/check-hub-tile-links.js [tree]

   EVERY HUB TILE ON EVERY HUB PAGE, IN BOTH LOCALES, HAS AN HREF THAT ANSWERS.

   WHY THIS EXISTS RATHER THAN BEING A FIX. The Garduri hub's first tile pointed
   at `#garduri`, a section on the SAME page, and `scripts/check-links.js` passed
   it because the anchor resolves: it is a valid link to somewhere a visitor
   already is. A tile the size of a photograph that moves you a little way down
   the page you are on is not a broken link and it is not a working one either,
   and nothing in this repo could tell the difference. This can: a hub tile's href
   is held to being a PAGE, not a position on this one.

   WHAT "ANSWERS 200" MEANS HERE, and why no network is involved. The site is
   static and every URL it serves is a file this build wrote, so a path href
   answers 200 exactly when `dist` holds the file. Asking the live site would test
   the last deploy rather than this build, which is the wrong thing to hold a pull
   request to; section 12.0's verify-live is what tests the deploy.

   THE FOUR THINGS IT REFUSES:
     · a tile with no href at all, which is what an inert tile was;
     · an href naming a path this build emits no page for;
     · an href naming a fragment that no id answers, whether the destination is
       another page or this one;
     · a hub page where the count of tiles is not the four the component builds,
       or a locale where a hub is missing entirely.

   WHAT IT DOES NOT REFUSE, and this is the honest part. A SAME-PAGE ANCHOR THAT
   RESOLVES IS ALLOWED. W25-R24 says "an href that answers 200", and the page a
   same-page anchor sits on answers 200. Refusing them by kind was this gate's
   first version and it refused two tiles the owner has just been given, which is
   a rule written tighter than the ruling it enforces.

   IT FOLLOWS THAT THIS GATE WOULD NOT HAVE CAUGHT THE DEFECT THAT CREATED IT, and
   that is stated rather than glossed: `#garduri` resolved, on both locales, live
   and local. What was wrong with it was not resolution, it was that a tile the
   size of a photograph moved a visitor a little way down the page they were on.
   No resolution check can see that. So every same-page anchor is PRINTED, named
   and counted on every run, which is the most a machine can honestly do: the
   owner reads four lines and decides.

   Per docs/CLAUDE.md section 13 it asserts what it requires before concluding
   anything: both hubs, both locales, four tiles each, and every arm of its own
   self-test watched fire between two clean controls (R-AB).

   Zero dependencies. */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TREE = process.argv[2] || 'dist';
const fail = (m) => { console.error(`\nHUB TILE LINK GATE FAILED: ${m}\n`); process.exit(1); };

/* The hub pages, by the path each is served at. Listed rather than discovered:
   a hub that stopped rendering would vanish from a discovery walk and the gate
   would pass on nothing, which is section 13's own case. */
const HUBS = [
  'servicii/acoperisuri/index.html',
  'ru/servicii/acoperisuri/index.html',
  'servicii/garduri/index.html',
  'ru/servicii/garduri/index.html',
];
const TILES_PER_HUB = 4;

const TILE = /<(a|div)\b([^>]*\bclass="[^"]*\bhub__tile\b[^"]*"[^>]*)>/g;
const HREF = /\bhref="([^"]*)"/;
const idsOf = (html) => new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));

/* The page a path href resolves to, as a file in the tree. A directory URL is
   served by its index.html, which is how this site is published. */
function fileFor(href) {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean.startsWith('/')) return null;
  const rel = clean.replace(/^\/+/, '');
  return rel.endsWith('/') || rel === '' ? path.join(rel, 'index.html') : rel;
}

const samePage = [];
function check(pages) {
  const problems = [];
  for (const pg of pages) {
    const tiles = [...pg.html.matchAll(TILE)];
    if (tiles.length !== TILES_PER_HUB) {
      problems.push({ id: 'tile-count', text: `${pg.where}: ${tiles.length} hub tile(s), expected ${TILES_PER_HUB}.` });
    }
    for (const t of tiles) {
      const attrs = t[2];
      const m = HREF.exec(attrs);
      const label = (pg.html.slice(t.index, t.index + 1200).match(/class="hub__label">([^<]*)</) || [null, '?'])[1];
      if (!m || !m[1].trim()) {
        problems.push({ id: 'no-href', text: `${pg.where}: the tile "${label}" has no href. W25-R24: every hub tile has one.` });
        continue;
      }
      const href = m[1].trim();
      if (href.startsWith('#')) {
        const frag = href.slice(1);
        if (!frag || !idsOf(pg.html).has(frag)) {
          problems.push({ id: 'dead-fragment', text: `${pg.where}: the tile "${label}" points at "${href}" and the page carries no id="${frag}".` });
        } else {
          samePage.push(`${pg.where}: "${label}" -> ${href}`);
        }
        continue;
      }
      const file = fileFor(href);
      if (!file) {
        problems.push({ id: 'not-a-path', text: `${pg.where}: the tile "${label}" points at "${href}", which is neither a site path nor a fragment.` });
        continue;
      }
      const dest = pg.pages.get(file);
      if (dest === undefined) {
        problems.push({ id: 'dead-href', text: `${pg.where}: the tile "${label}" points at "${href}" and this build emits no ${file}.` });
        continue;
      }
      const frag = href.includes('#') ? href.split('#')[1] : null;
      if (frag && !idsOf(dest).has(frag)) {
        problems.push({ id: 'dead-fragment', text: `${pg.where}: the tile "${label}" points at "${href}" and ${file} carries no id="${frag}".` });
      }
    }
  }
  return problems;
}

/* --- the self-test, before any real result -------------------------------- */

const tileHtml = (href, label) => href === null
  ? `<div class="hub__tile hub__tile--1 hub__tile--inert" aria-disabled="true"><span class="hub__label">${label}</span></div>`
  : `<a class="hub__tile hub__tile--1" href="${href}"><span class="hub__label">${label}</span></a>`;
const hub = (hrefs) => `<html><body><h2 id="here">a section on this page</h2>${hrefs.map((h, i) => tileHtml(h, 'Tile ' + (i + 1))).join('')}</body></html>`;
const DEST = new Map([['servicii/x/index.html', '<html><body><h2 id="ok">x</h2></body></html>']]);
const GOOD = ['/servicii/x/', '/servicii/x/#ok', '/servicii/x/', '/servicii/x/'];
const CONTROL = [{ where: 'self-test/control.html', html: hub(GOOD), pages: DEST }];

const SELF = [
  { arm: 'a tile with no href at all', want: 'no-href', hrefs: [null, ...GOOD.slice(1)] },
  { arm: 'a tile pointing at an anchor its own page does not carry', want: 'dead-fragment', hrefs: ['#somewhere', ...GOOD.slice(1)] },
  { arm: 'a tile pointing at a page this build does not emit', want: 'dead-href', hrefs: ['/servicii/nope/', ...GOOD.slice(1)] },
  { arm: 'a tile pointing at an anchor the destination does not carry', want: 'dead-fragment', hrefs: ['/servicii/x/#missing', ...GOOD.slice(1)] },
  { arm: 'a tile pointing at something that is not a site path', want: 'not-a-path', hrefs: ['mailto:x@y.z', ...GOOD.slice(1)] },
  { arm: 'a hub with the wrong number of tiles', want: 'tile-count', hrefs: GOOD.slice(0, 3) },
  /* GREEN (W25-20's arm kind): the shapes the gate MUST accept, so a rule written
     too tightly is caught too. A cross-page fragment is the one at risk: it looks
     like the same-page fragment the gate exists to refuse, and it is the opposite. */
  { arm: 'GREEN: four tiles, one of them a cross-page fragment that resolves', want: null, hrefs: GOOD },
  /* The second green arm is the one the first version of this gate got wrong. */
  { arm: 'GREEN: a same-page anchor that resolves, which W25-R24 permits', want: null, hrefs: ['#here', ...GOOD.slice(1)] },
];

const controlBefore = check(CONTROL);
if (controlBefore.length) fail(`the self-test control is not clean, so its arms prove nothing: ${controlBefore.map((p) => p.text).join(' | ')}`);
console.log('self-test control: clean');
for (const t of SELF) {
  const got = check([{ where: 'self-test/arm.html', html: hub(t.hrefs), pages: DEST }]);
  if (t.want === null) {
    if (got.length) fail(`the self-test GREEN arm "${t.arm}" must be accepted and was refused: ${got.map((p) => p.id).join(', ')}. A rule that refuses what it should allow is as broken as one that allows what it should refuse.`);
    console.log(`self-test GREEN arm accepted, as it must be: ${t.arm}`);
    continue;
  }
  if (got.filter((p) => p.id === t.want).length !== 1) {
    fail(`the self-test arm "${t.arm}" did not fire on its own message "${t.want}". It reported: ${got.length ? got.map((p) => p.id).join(', ') : 'nothing'}. An assertion nobody has watched fail is not a gate.`);
  }
  console.log(`self-test arm fired on its own message: ${t.arm} -> ${t.want}`);
}
const controlAfter = check(CONTROL);
if (controlAfter.length) fail(`the self-test control is dirty after the arms: ${controlAfter.map((p) => p.text).join(' | ')}`);
console.log('self-test control, again: clean');

/* --- W26-01: the live markers must agree with what this gate measures ------ */

/* WHY THIS IS HERE. `scripts/verify-live.js` asserts `bentoTiles` and
   `bentoLinks` on the deployed hub pages. W25-24 gave every tile a destination
   and left `bentoLinks: 3`, so section 12.0 failed on the merge with four rows
   UNVERIFIED and nothing wrong with the site. **The same component did it at
   W24-07a**, which is where docs/CLAUDE.md section 12 records the rule: a marker
   that is not renamed with the thing it names is not a marker.

   Twice is a pattern, so the two files are coupled rather than trusted: the
   marker is read out of verify-live.js and compared with what this gate counts
   on the built pages. A marker left behind now fails in `quality`, before the
   merge, instead of in section 12.0 after it.

   It reads the file as TEXT and requires to find exactly one value per marker
   per locale-independent set. Finding a different number of them is a failure,
   not a skip: a refactor that moves those constants must come here too, and
   saying so loudly is the entire point of the check. */
function markerValues(src, name) {
  return [...src.matchAll(new RegExp(String.raw`^\s*` + name + String.raw`:\s*(\d+)\s*,`, 'gm'))].map((m) => Number(m[1]));
}

/* A bento marker is either a HUB's count or an explicit ZERO. The zeros are
   deliberate and are asserted elsewhere for their own reason: the Novatik and
   copertine pages are bento DESTINATIONS, not hubs, and `bentoTiles: 0` is what
   catches a build that put a hub on one of them. So a value is legal when it is
   0 or when it equals what this gate just measured, and at least TWO must equal
   the measurement, which is the two hub sets. Anything else is a marker that was
   left behind. */
function checkMarkers(verifySrc, measured) {
  const problems = [];
  for (const [name, actual] of Object.entries(measured)) {
    const vals = markerValues(verifySrc, name);
    if (!vals.length) {
      problems.push({ id: 'marker-shape', text: `scripts/verify-live.js declares no numeric ${name}. If that constant moved, this check has to move with it.` });
      continue;
    }
    const hubs = vals.filter((v) => v === actual).length;
    const stale = vals.filter((v) => v !== actual && v !== 0);
    for (const v of stale) {
      problems.push({ id: 'marker-stale', text: `scripts/verify-live.js expects ${name}: ${v} and the built hub pages carry ${actual}. A marker that is not changed with the thing it names is not a marker (docs/CLAUDE.md section 12, W24-07a, and again at W25-24).` });
    }
    if (hubs < 2) {
      problems.push({ id: 'marker-shape', text: `scripts/verify-live.js has ${hubs} ${name} marker(s) equal to the measured ${actual}; the two hub marker sets must both carry it.` });
    }
  }
  return problems;
}

/* Watched, both ways, before it means anything. */
(() => {
  const M = { bentoTiles: 4, bentoLinks: 4 };
  const line = (n, v) => `    ${n}: ${v},\n`;
  /* Two hub sets plus the two deliberate zeros, which is the shipping shape. */
  const good = line('bentoTiles', 4) + line('bentoLinks', 4) + line('bentoTiles', 0)
    + line('bentoTiles', 4) + line('bentoLinks', 4) + line('bentoTiles', 0);
  const stale = good.replace(line('bentoLinks', 4), line('bentoLinks', 3));
  const oneHub = line('bentoTiles', 4) + line('bentoLinks', 4) + line('bentoTiles', 0);
  const none = line('bentoTiles', 0);
  if (checkMarkers(good, M).length) fail('marker self-test: the shipping shape, two hub sets and two zeros, must pass.');
  if (!checkMarkers(stale, M).some((p) => p.id === 'marker-stale')) fail('marker self-test: a stale marker must fire.');
  if (!checkMarkers(oneHub, M).some((p) => p.id === 'marker-shape')) fail('marker self-test: only one hub set carrying the count must fire.');
  if (!checkMarkers(none, M).some((p) => p.id === 'marker-shape')) fail('marker self-test: no bentoLinks at all must fire.');
  console.log('marker self-test: 4 arms, 1 of them green (the shipping shape, zeros included)');
})();

/* --- the real run --------------------------------------------------------- */

const dist = path.join(ROOT, TREE);
if (!fs.existsSync(dist)) fail(`${TREE}/ is missing; run node build.js`);
const emitted = new Map();
(function walk(rel) {
  for (const e of fs.readdirSync(path.join(dist, rel), { withFileTypes: true })) {
    const p = rel ? rel + '/' + e.name : e.name;
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) emitted.set(p, fs.readFileSync(path.join(dist, p), 'utf8'));
  }
})('');
if (!emitted.size) fail(`walked ${TREE}/ and found no HTML, so the walk itself is broken`);

const pages = [];
for (const h of HUBS) {
  const html = emitted.get(h);
  if (html === undefined) fail(`${TREE}/${h} is missing, so a hub page this gate must read does not exist`);
  pages.push({ where: `${TREE}/${h}`, html, pages: emitted });
}
const ro = pages.filter((p) => !p.where.includes('/ru/')).length;
const ru = pages.length - ro;
if (!ro || !ru) fail(`read ${ro} RO and ${ru} RU hub page(s); a gate that saw one locale proves nothing about the other`);

samePage.length = 0;
const problemsReal = check(pages);

/* The live markers, held to what was just measured. Every hub page carries the
   same four tiles, so one reading stands for all four pages, and a page that
   disagreed would already have failed the tile-count check above. */
const linkedTiles = [...pages[0].html.matchAll(TILE)].filter((t) => /<a\b/i.test(t[0])).length;
const verifyPath = path.join(ROOT, 'scripts/verify-live.js');
if (!fs.existsSync(verifyPath)) fail('scripts/verify-live.js is missing, so its markers cannot be held to anything.');
problemsReal.push(...checkMarkers(fs.readFileSync(verifyPath, 'utf8'), { bentoTiles: TILES_PER_HUB, bentoLinks: linkedTiles }));
console.log(`pages read: ${emitted.size} in ${TREE}/   hub pages: ${pages.length} (${ro} RO, ${ru} RU)   tiles asserted: ${pages.length * TILES_PER_HUB}`);
for (const pg of pages) {
  const hrefs = [...pg.html.matchAll(TILE)].map((t) => (HREF.exec(t[2]) || [null, 'NONE'])[1]);
  console.log(`  ${pg.where.replace(TREE + '/', '')}  ${hrefs.join('  ')}`);
}
/* Printed, named and counted, because a resolution check cannot see the defect
   this gate was created for and saying so is the only honest handling of it. */
console.log(`same-page anchors: ${samePage.length} of ${pages.length * TILES_PER_HUB} tiles. They resolve and W25-R24 permits them; no machine can tell one that is useful from one that is not.`);
samePage.forEach((x) => console.log('  ' + x));
if (problemsReal.length) {
  console.error(`\n${problemsReal.length} problem(s):`);
  problemsReal.forEach((p) => console.error('  ' + p.text));
  process.exit(1);
}
console.log(`live markers: verify-live.js expects bentoTiles ${TILES_PER_HUB} and bentoLinks ${linkedTiles}, which is what the built pages carry.`);
console.log('every hub tile has an href, and every href resolves to a page this build emits or an id that exists.');
