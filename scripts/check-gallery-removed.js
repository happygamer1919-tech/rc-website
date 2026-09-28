#!/usr/bin/env node
/* gallery-removed, gate 42, card W29-04 (wave 29), owner ruling R-W29-04: "service gallery stock
   images must not show scenery that reads as non-Moldova". Run by `quality` on every pull request.

   THE CARD'S OWN TEST, verbatim: "committed docs/reports/W29-04-REMOVED.md lists every removed path;
   named test gallery-removed asserts none of those paths is referenced in any page or manifest,
   exit 0." The list is the report, not a copy of it: this reads docs/reports/W29-04-REMOVED.md and
   takes every path in its table, so the report and the test cannot drift apart.

   WHAT A REMOVED PATH COVERS. A picture lives as two files (the full WebP and its 600px thumb), and a
   stock picture before W28 or an owner photograph is a JPEG, so for every listed path the test builds
   its whole family: the full name and the `-t` thumb, each as .webp, .jpg, .jpeg and .png. A page that
   names the JPEG twin of a removed WebP is still showing the removed picture.

   WHAT IT HOLDS, for every path in that family:
     1. no built page in dist/ names it, in either locale (the served form, `/img/galerie/...`);
     2. no other built text file in dist/ (sitemap, llms.txt, manifests, scripts) names it;
     3. no content/*.json, locales/*.json or docs/PHOTO-SLOTS-W24.json names it;
     4. neither docs/images/SOURCES.md nor docs/assets/PROVENANCE.md has a row for it;
     5. the file is gone from public/ and from dist/img/ (build.js copies public/ into dist/ and never
        empties dist/, so a local dist/ built before the removal still holds the old files: rebuild
        from an empty dist/ before reading a failure here as real);
   and for every SOURCE page URL in the report's table: no ledger entry, SOURCES row or PROVENANCE row
   names it again, which is how a removed picture would come back under a new file number.

   IT NEVER PASSES ON NOTHING. It fails on a missing report, a report whose table lists zero paths,
   a table whose row count differs from the report's own `Total: N files` line, a listed path outside
   public/img/galerie/, no dist/, zero pages read in either locale, zero content files read, and a
   missing SOURCES or PROVENANCE manifest.

   ITS SELF-TEST RUNS FIRST (R-AB), on a synthetic tree held in memory: a control that must be clean,
   seven RED arms that must each fire on their own message (a Russian page naming the full picture, a
   ledger naming the thumb, a SOURCES row, a PROVENANCE row for the thumb, the file still on disk, a
   page naming the JPEG twin, the source URL back in the ledger under a new number), one RED arm for an
   empty list, and one GREEN arm that must be accepted (kept pictures whose names share the removed
   ones' digits, `116.webp` and `1.webp` beside a removed `16.webp`, which a rule written too loosely
   as a substring of the number would refuse), then the control again.

   Static, zero dependency: it reads files only, no browser.
   Usage:  node build.js && node scripts/check-gallery-removed.js */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const REPORT = 'docs/reports/W29-04-REMOVED.md';
const PREFIX = 'public/img/galerie/';
const EXTS = ['webp', 'jpg', 'jpeg', 'png'];
const fail = (m) => { console.error(`\nGALLERY REMOVED TEST FAILED: ${m}\n`); process.exit(1); };

/* The report's table: every row that starts with a backticked path. Returns the paths, the source
   URLs named in those rows, and the `Total: N files` the report states about itself. */
function parseReport(text) {
  const rows = text.split('\n').filter((l) => l.startsWith('| `'));
  const paths = [], urls = new Set();
  for (const r of rows) {
    const m = r.match(/^\| `([^`]+)`/);
    if (m) paths.push(m[1]);
    for (const u of r.match(/https:\/\/[^\s|`]+/g) || []) urls.add(u.replace(/[).,]+$/, ''));
  }
  const t = text.match(/^Total: (\d+) files$/m);
  return { paths, urls: [...urls], total: t ? Number(t[1]) : null };
}

/* The family of one removed path: the stem without `-t`, then full and thumb, each extension. */
function family(p) {
  const dir = path.posix.dirname(p);
  const stem = path.posix.basename(p).replace(/\.[a-z]+$/i, '').replace(/-t$/, '');
  const out = [];
  for (const s of [stem, `${stem}-t`]) for (const e of EXTS) out.push(`${dir}/${s}.${e}`);
  return out;
}

/* A path is named in a text when its tail from the gallery folder on is there: `galerie/<g>/<file>`.
   Starting the needle at the folder, with the file name after a slash, is what keeps `16.webp` from
   matching `116.webp`; the extension ends it, so `16.webp` does not match `16-t.webp`. */
const needle = (p) => p.slice(p.indexOf('galerie/'));

/* The check, over data, so the self-test runs the same code on a synthetic tree. */
function check({ report, pages, dataFiles, sources, provenance, exists }) {
  const problems = [];
  const { paths, urls, total } = parseReport(report);
  if (!paths.length) return { problems: [{ id: 'empty-list', msg: `${REPORT} lists zero removed paths, so nothing would be checked` }], counts: {} };
  if (total === null) problems.push({ id: 'no-total', msg: `${REPORT} has no "Total: N files" line to hold its table to` });
  else if (total !== paths.length) problems.push({ id: 'total', msg: `${REPORT} says Total: ${total} files and its table lists ${paths.length}` });
  const bad = paths.filter((p) => !p.startsWith(PREFIX));
  for (const p of bad) problems.push({ id: 'outside', msg: `${p} is not under ${PREFIX}; this test holds gallery removals only` });
  const all = [...new Set(paths.filter((p) => p.startsWith(PREFIX)).flatMap(family))];
  for (const f of all) {
    const n = needle(f);
    for (const pg of pages) if (pg.text.includes(n)) problems.push({ id: 'page', msg: `${pg.where} (${pg.locale}) still names ${f}` });
    for (const d of dataFiles) if (d.text.includes(n)) problems.push({ id: 'data', msg: `${d.where} still names ${f}` });
    if (sources.includes(n)) problems.push({ id: 'sources', msg: `docs/images/SOURCES.md still has a row naming ${f}` });
    if (provenance.includes(n)) problems.push({ id: 'provenance', msg: `docs/assets/PROVENANCE.md still has a row naming ${f}` });
    if (exists(f)) problems.push({ id: 'on-disk', msg: `${f} is still on disk` });
    const built = 'dist/' + f.slice('public/'.length);
    if (exists(built)) problems.push({ id: 'on-disk', msg: `${built} is still in dist/ (rebuild from an empty dist/ if this tree was built before the removal)` });
  }
  for (const u of urls) {
    for (const d of dataFiles) if (d.text.includes(u)) problems.push({ id: 'source-back', msg: `${d.where} names ${u}, the source of a removed picture` });
    if (sources.includes(u)) problems.push({ id: 'source-back', msg: `docs/images/SOURCES.md names ${u}, the source of a removed picture` });
    if (provenance.includes(u)) problems.push({ id: 'source-back', msg: `docs/assets/PROVENANCE.md names ${u}, the source of a removed picture` });
  }
  return { problems, counts: { listed: paths.length, family: all.length, urls: urls.length } };
}

/* --- self-test ------------------------------------------------------------------------------ */
const R1 = 'public/img/galerie/test/16.webp', R2 = 'public/img/galerie/test/16-t.webp', U1 = 'https://www.pexels.com/photo/999001/';
const REP = (rows, total = rows.length) => `# test\n\n| file | source |\n|---|---|\n${rows.map((r) => `| \`${r}\` | ${U1} |`).join('\n')}\n\nTotal: ${total} files\n`;
const KEPT = 'public/img/galerie/test/15.webp';
const tree = (over = {}) => ({
  report: REP([R1, R2]),
  pages: [
    { where: '/servicii/test/', locale: 'RO', text: `<img src="/img/galerie/test/15.webp">` },
    { where: '/ru/servicii/test/', locale: 'RU', text: `<img src="/img/galerie/test/15-t.webp">` },
  ],
  dataFiles: [{ where: 'content/galleries.json', text: JSON.stringify({ photos: [{ full: KEPT, source_url: 'https://www.pexels.com/photo/999002/' }] }) }],
  sources: `| \`${KEPT}\` | /servicii/test/ | https://www.pexels.com/photo/999002/ | Pexels License | kept |`,
  provenance: `| \`${KEPT}\` | https://www.pexels.com/photo/999002/ | stock library | x | 2026-09-28 |`,
  exists: (f) => f === KEPT || f === 'dist/img/galerie/test/15.webp',
  ...over,
});
const withPage = (text) => { const t = tree(); t.pages = [...t.pages, { where: '/ru/servicii/test/', locale: 'RU', text }]; return t; };
const withData = (text) => { const t = tree(); t.dataFiles = [...t.dataFiles, { where: 'content/galleries.json', text }]; return t; };
const ARMS = [
  { arm: 'a Russian page still naming the removed picture', t: withPage('<img src="/img/galerie/test/16.webp">'), want: 'page' },
  { arm: 'the ledger still naming the removed thumb', t: withData('"thumb": "public/img/galerie/test/16-t.webp"'), want: 'data' },
  { arm: 'a SOURCES row left behind', t: tree({ sources: `| \`${R1}\` | /servicii/test/ | x | Pexels License | y |` }), want: 'sources' },
  { arm: 'a PROVENANCE row left for the thumb', t: tree({ provenance: `| \`${R2}\` | x | stock library | x | 2026-09-24 |` }), want: 'provenance' },
  { arm: 'the file still on disk under public/', t: tree({ exists: (f) => f === R1 }), want: 'on-disk' },
  { arm: 'a page naming the JPEG twin of a removed WebP', t: withPage('<img src="/img/galerie/test/16.jpg">'), want: 'page' },
  { arm: 'the removed source back in the ledger under a new number', t: withData(`{"full":"public/img/galerie/test/23.webp","source_url":"${U1}"}`), want: 'source-back' },
  { arm: 'an empty list', t: tree({ report: '# test\n\nTotal: 0 files\n' }), want: 'empty-list' },
  { arm: 'GREEN: kept pictures whose names share the removed digits (116.webp, 1.webp)', t: withPage('<img src="/img/galerie/test/116.webp"><img src="/img/galerie/test/1.webp"><img src="/img/galerie/test/16-x.webp">'), want: null },
];
const control = () => check(tree()).problems;
if (control().length) fail(`self-test control is not clean: ${control().map((p) => p.msg).join(' | ')}`);
for (const a of ARMS) {
  const got = check(a.t).problems;
  if (a.want === null) {
    if (got.length) fail(`self-test GREEN arm "${a.arm}" was refused: ${got.map((p) => `${p.id}: ${p.msg}`).join(' | ')}`);
    continue;
  }
  if (!got.some((p) => p.id === a.want)) fail(`self-test arm "${a.arm}" did not fire "${a.want}"; it reported ${got.length ? got.map((p) => p.id).join(', ') : 'nothing'}.`);
}
if (control().length) fail('self-test control is dirty after the arms.');
console.log(`self-test: ${ARMS.length} arms, ${ARMS.filter((a) => a.want === null).length} GREEN, each on its own message, control clean before and after`);

/* --- the real run --------------------------------------------------------------------------- */
const rel = (f) => path.relative(ROOT, f).split(path.sep).join('/');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
if (!fs.existsSync(path.join(ROOT, REPORT))) fail(`${REPORT} is missing, and the card's test reads its list from it.`);
const DIST = path.join(ROOT, 'dist');
if (!fs.existsSync(DIST)) fail('no dist/, run: node build.js');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const built = walk(DIST);
const pages = built.filter((f) => f.endsWith('.html')).map((f) => {
  const where = '/' + rel(f).replace(/^dist\//, '').replace(/(^|\/)index\.html$/, '$1');
  return { where, locale: where.startsWith('/ru/') ? 'RU' : 'RO', text: fs.readFileSync(f, 'utf8') };
});
const ro = pages.filter((p) => p.locale === 'RO').length, ru = pages.filter((p) => p.locale === 'RU').length;
if (!ro || !ru) fail(`pages read: ${ro} RO and ${ru} RU; both locales must be built.`);
const TEXT = /\.(xml|txt|json|js|css|webmanifest)$/;
const dataFiles = [
  ...built.filter((f) => TEXT.test(f)).map((f) => ({ where: rel(f), text: fs.readFileSync(f, 'utf8') })),
  ...['content', 'locales'].flatMap((d) => fs.readdirSync(path.join(ROOT, d)).filter((f) => f.endsWith('.json')).map((f) => ({ where: `${d}/${f}`, text: read(`${d}/${f}`) }))),
  { where: 'docs/PHOTO-SLOTS-W24.json', text: read('docs/PHOTO-SLOTS-W24.json') },
];
const contentRead = dataFiles.filter((d) => d.where.startsWith('content/')).length;
if (!contentRead) fail('zero content/*.json files read.');
for (const m of ['docs/images/SOURCES.md', 'docs/assets/PROVENANCE.md']) if (!fs.existsSync(path.join(ROOT, m))) fail(`${m} is missing; a manifest that vanished is not one that passed.`);
const { problems, counts } = check({
  report: read(REPORT), pages, dataFiles,
  sources: read('docs/images/SOURCES.md'), provenance: read('docs/assets/PROVENANCE.md'),
  exists: (f) => fs.existsSync(path.join(ROOT, f)),
});
console.log(`removed paths listed in ${REPORT}: ${counts.listed || 0} (${counts.family || 0} names with their thumb and format twins); source URLs: ${counts.urls || 0}`);
console.log(`read: ${ro} RO pages, ${ru} RU pages, ${dataFiles.length} data and built text files (${contentRead} in content/), SOURCES and PROVENANCE`);
if (problems.length) {
  console.error(`\nGALLERY REMOVED TEST FAILED: ${problems.length} problem(s)`);
  for (const p of problems) console.error(`  [${p.id}] ${p.msg}`);
  process.exit(1);
}
console.log('\nno removed gallery picture is named by any built page, manifest or ledger, none is on disk, and no removed source is back.');
