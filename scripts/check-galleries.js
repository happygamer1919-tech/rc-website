#!/usr/bin/env node
/* Gallery gate, gate 29, card W26-12, ruling W26-R14. Run by `quality` on every pull
   request.

   THE RULING'S OWN TEST, verbatim: "Gate: gallery count on page equals file count in the
   ledger." The ledger is content/galleries.json, which scripts/intake-galleries.js writes
   from the owner's folders and nothing types. This holds every built page to it, in both
   locales, in both directions:

     1. every gallery in the ledger renders on its page, RO and RU, as exactly one lightbox
        whose photographs are the ledger's, the same count, the same files, in the same
        order, and whose `data-gal-count` says so;
     2. every lightbox has at least one opener, and a service or product page's card shows
        the photograph the ledger names as its preview;
     3. the fence gallery's page grid holds one thumbnail per photograph, in order;
     4. no page carries a lightbox the ledger does not have, and no empty folder has one.

   Order is asserted because "all photos of that folder" read as a set would pass a
   lightbox that shows one photograph twice and drops another.

   IT NEVER PASSES ON NOTHING: zero galleries, zero pages read, a missing page, a ledger
   that does not parse. ITS SELF-TEST RUNS FIRST on synthetic pages against a synthetic
   ledger, six red arms and one GREEN between two clean controls (R-AB): a photograph
   missing, one extra, two swapped, a count attribute that lies, a lightbox with no opener,
   and a lightbox for a gallery the ledger does not have. The GREEN arm is a correct page
   with two openers, which must be accepted.

   Static, zero dependency: it reads dist/ and the ledger, so it needs no browser.

   Usage:  node build.js && node scripts/check-galleries.js */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const LEDGER = path.join(ROOT, 'content/galleries.json');
const fail = (m) => { console.error(`\nGALLERY GATE FAILED: ${m}\n`); process.exit(1); };
const ROOTS = { RO: '/servicii/', RU: '/ru/servicii/' };

/* One page against the galleries that should be on it. Returns problems with ids. */
function checkPage(html, where, expected, allIds) {
  const problems = [];
  const boxes = [...html.matchAll(/<div class="lbx" id="lbx-([a-z0-9-]+)"[^>]*data-gal-count="(\d+)"[^>]*>([\s\S]*?)<\/ul>/g)];
  for (const b of boxes) {
    if (!allIds.has(b[1])) problems.push({ id: 'unknown-gallery', msg: `${where} carries lightbox lbx-${b[1]}, which the ledger has no gallery for` });
  }
  for (const g of expected) {
    const mine = boxes.filter((b) => b[1] === g.render_on);
    if (mine.length !== 1) { problems.push({ id: 'lightbox-count', msg: `${where} carries ${mine.length} lightbox(es) for ${g.render_on}, expected 1` }); continue; }
    const [, , attr, inner] = mine[0];
    const srcs = [...inner.matchAll(/<li class="lbx__slide"><img src="([^"]+)"/g)].map((m) => m[1].replace(/^\/?/, ''));
    const want = g.photos.map((p) => p.full.replace(/^public\//, ''));
    if (Number(attr) !== want.length) problems.push({ id: 'count-attr', msg: `${where} lbx-${g.render_on} says data-gal-count="${attr}" and the ledger has ${want.length}` });
    if (srcs.length !== want.length) problems.push({ id: 'photo-count', msg: `${where} lbx-${g.render_on} shows ${srcs.length} photograph(s) and the ledger has ${want.length}` });
    else {
      const off = want.findIndex((w, i) => srcs[i] !== w);
      if (off >= 0) problems.push({ id: 'photo-order', msg: `${where} lbx-${g.render_on} photograph ${off + 1} is ${srcs[off]}, the ledger's is ${want[off]}` });
    }
    const openers = [...html.matchAll(new RegExp(`data-gal-open="lbx-${g.render_on}"`, 'g'))].length;
    if (!openers) problems.push({ id: 'no-opener', msg: `${where} carries lbx-${g.render_on} and nothing opens it` });
    if (g.grid) {
      const grid = [...html.matchAll(/class="gal-grid__item"[^>]*><img src="([^"]+)"/g)].map((m) => m[1].replace(/^\/?/, ''));
      const wantT = g.photos.map((p) => p.thumb.replace(/^public\//, ''));
      if (grid.length !== wantT.length || grid.some((s, i) => s !== wantT[i])) problems.push({ id: 'grid', msg: `${where} gallery page grid holds ${grid.length} thumbnail(s), not the ledger's ${wantT.length} in order` });
    } else {
      const card = html.match(new RegExp(`class="card gal-card"[^>]*data-gal-open="lbx-${g.render_on}"[\\s\\S]*?<img src="([^"]+)"`));
      const wantP = g.photos[g.preview - 1].thumb.replace(/^public\//, '');
      if (!card) problems.push({ id: 'no-card', msg: `${where} has no gallery card for ${g.render_on}` });
      else if (card[1].replace(/^\/?/, '') !== wantP) problems.push({ id: 'preview', msg: `${where} card shows ${card[1]}, the ledger's preview is ${wantP}` });
    }
  }
  return problems;
}

/* --- self-test ------------------------------------------------------------------- */
const T = { render_on: 'test', preview: 2, grid: false, photos: [1, 2, 3].map((n) => ({ full: `public/img/galerie/test/0${n}.jpg`, thumb: `public/img/galerie/test/0${n}-t.jpg` })) };
const slide = (n) => `<li class="lbx__slide"><img src="/img/galerie/test/0${n}.jpg" alt="x"></li>`;
const page = ({ slides = [1, 2, 3], count = 3, openers = 1, id = 'test', preview = 2 } = {}) => `
<a class="card gal-card" href="#lbx-${id}" data-gal-open="lbx-${id}" data-gal-index="1"><div class="media"><img src="/img/galerie/test/0${preview}-t.jpg" alt=""></div></a>
${'<a data-gal-open="lbx-' + id + '"></a>'.repeat(Math.max(0, openers - 1))}
<div class="lbx" id="lbx-${id}" data-gal-box data-gal-count="${count}" role="dialog" hidden>
  <ul class="lbx__track">
${slides.map(slide).join('\n')}
  </ul>
</div>`;
const noOpener = (h) => h.replace(/ data-gal-open="lbx-test"/g, '');
const ARMS = [
  { arm: 'a photograph missing', html: page({ slides: [1, 2], count: 3 }), want: 'photo-count' },
  { arm: 'one photograph too many', html: page({ slides: [1, 2, 3, 3], count: 3 }), want: 'photo-count' },
  { arm: 'two photographs swapped', html: page({ slides: [1, 3, 2] }), want: 'photo-order' },
  { arm: 'a count attribute that lies', html: page({ count: 4 }), want: 'count-attr' },
  { arm: 'a lightbox nothing opens', html: noOpener(page()), want: 'no-opener' },
  { arm: 'a lightbox for a gallery the ledger does not have', html: page() + page({ id: 'ghost' }), want: 'unknown-gallery' },
  { arm: 'GREEN: a correct page with two openers', html: page({ openers: 2 }), want: null },
];
const ids = new Set(['test']);
const control = () => checkPage(page(), 'control', [T], ids);
if (control().length) fail(`self-test control is not clean: ${control().map((p) => p.msg).join(' | ')}`);
for (const a of ARMS) {
  const got = checkPage(a.html, `self-test (${a.arm})`, [T], ids);
  if (a.want === null) {
    if (got.length) fail(`self-test GREEN arm "${a.arm}" was refused: ${got.map((p) => p.id + ': ' + p.msg).join(' | ')}`);
    continue;
  }
  if (!got.some((p) => p.id === a.want)) fail(`self-test arm "${a.arm}" did not fire "${a.want}"; it reported ${got.length ? got.map((p) => p.id).join(', ') : 'nothing'}.`);
}
if (control().length) fail('self-test control is dirty after the arms.');
console.log(`self-test: ${ARMS.length} arms, ${ARMS.filter((a) => a.want === null).length} GREEN, each on its own message, control clean before and after`);

/* --- the real run ------------------------------------------------------------------ */
if (!fs.existsSync(LEDGER)) fail('content/galleries.json is missing.');
let ledger;
try { ledger = JSON.parse(fs.readFileSync(LEDGER, 'utf8')); } catch (e) { fail(`content/galleries.json does not parse: ${e.message}`); }
const galleries = ledger.galleries || [];
if (!galleries.length) fail('the ledger holds zero galleries, so nothing would be checked.');
if (!fs.existsSync(DIST)) fail('no dist/, run: node build.js');
const allIds = new Set(galleries.map((g) => g.render_on));
const gridPages = new Set(['galerie-garduri']);
for (const g of galleries) g.grid = gridPages.has(g.render_on);

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const pages = walk(DIST).filter((f) => f.endsWith('.html'));
const problems = [];
let checked = 0, photos = 0;
for (const f of pages) {
  const html = fs.readFileSync(f, 'utf8');
  const url = '/' + path.relative(DIST, f).split(path.sep).join('/').replace(/(^|\/)index\.html$/, '$1');
  const expected = galleries.filter((g) => url === `${ROOTS.RO}${g.render_on}/` || url === `${ROOTS.RU}${g.render_on}/`);
  if (!expected.length && !/data-gal-box/.test(html)) continue;
  problems.push(...checkPage(html, url, expected, allIds));
  checked++; photos += expected.reduce((n, g) => n + g.photos.length, 0);
}
for (const g of galleries) for (const [lc, root] of Object.entries(ROOTS)) {
  if (!fs.existsSync(path.join(DIST, root, g.render_on, 'index.html'))) problems.push({ id: 'missing-page', msg: `${lc} ${root}${g.render_on}/ is not in dist/, and the ledger's ${g.folder} gallery renders there` });
}
for (const e of ledger.empty_folders || []) {
  for (const root of Object.values(ROOTS)) {
    const f = path.join(DIST, root, e.page, 'index.html');
    if (fs.existsSync(f) && /data-gal-box/.test(fs.readFileSync(f, 'utf8'))) problems.push({ id: 'empty-folder', msg: `${root}${e.page}/ carries a lightbox and its folder ${e.folder} is empty` });
  }
}
console.log(`galleries in the ledger: ${galleries.length} (${galleries.map((g) => `${g.render_on} ${g.photos.length}`).join(', ')}); empty folders: ${(ledger.empty_folders || []).length}; unmatched: ${(ledger.unmatched_folders || []).length}`);
console.log(`built pages read: ${pages.length}; pages carrying a gallery: ${checked}; photographs matched: ${photos}`);
if (checked === 0) fail('zero pages carry a gallery, so nothing was checked.');
if (problems.length) {
  console.error(`\nGALLERY GATE FAILED: ${problems.length} problem(s)`);
  for (const p of problems) console.error(`  [${p.id}] ${p.msg}`);
  process.exit(1);
}
console.log(`\nevery gallery renders on its page in both locales with exactly the ledger's photographs, in order, and something opens it.`);
