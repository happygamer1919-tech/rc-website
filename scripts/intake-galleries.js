#!/usr/bin/env node
/* Takes the owner's gallery folders in, card W26-12, ruling W26-R14.

       node scripts/intake-galleries.js            report only, writes nothing
       node scripts/intake-galleries.js --apply    install, write the ledger and the provenance rows

   THE RULING, verbatim in docs/rulings/W26-R.md: "source /Users/ivan/RC-webpics_v2/<folder>/.
   Map folder to service page by name ... Intake: JPEG, resize to 1600 wide max, strip EXIF and
   GPS, no captions, no upscale. Folders with no matching service page are listed as a question,
   not created."

   BY NAME, and the names are the site's own. A folder matches the page whose Romanian title in
   locales/ro.json is the folder name, compared after Unicode NFC (macOS stores these names
   decomposed, so "ACOPERIȘURI" from the disk and from the locale file are different byte
   strings until both are normalised) and without case. Nothing is typed twice: a service
   renamed in the locale file moves its gallery with it, and a folder that names no page is
   reported, never guessed at.

   A FILE IS AN IMAGE BY ITS BYTES. The folders hold `.jpeg`, `.jpe` and `copy.jpe` names for the
   same kind of file, and one is spelled "WhatsApp Iage". The extension decides nothing.

   DUPLICATES ARE INSTALLED ONCE. The Garduri folder holds six byte-identical pairs; a lightbox
   showing the same photograph twice is not "all photos of that folder", it is the same one
   twice. Each skipped file is recorded in the ledger beside the file it duplicates.

   WHAT IS WRITTEN, per photograph: `public/img/galerie/<page>/NN.jpg`, at most 1600px wide and
   never wider than the source, and `NN-t.jpg`, 600px wide and lighter, for a card and the page grid, both
   re-encoded so no source metadata survives, then stripped again by exiftool where installed,
   and READ BACK: an install carrying Exif or GPS bytes is refused, which is gate 17's rule
   applied at the door. The ledger is `content/galleries.json`; gate 29 holds every page to it.

   The source folder is on the owner's machine and not in the repo, so CI never runs this.
   Uses sips (macOS) as scripts/process-packshot.js does. Zero dependencies. */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SRC = '/Users/ivan/RC-webpics_v2';
const LEDGER = path.join(ROOT, 'content/galleries.json');
const PROV = path.join(ROOT, 'docs/assets/PROVENANCE.md');
const APPLY = process.argv.includes('--apply');
const FULL_W = 1600;
const THUMB_W = 600;
const DATE = '22.09.2026';
const die = (m) => { console.error(`\nGALLERY INTAKE FAILED: ${m}\n`); process.exit(1); };
const nfc = (s) => s.normalize('NFC');
const key = (s) => nfc(s).toLocaleLowerCase('ro');

/* The one page that is not the folder's own page: W26-R12 gives the fence gallery a page of
   its own, and the Garduri tile opens it. The folder still matches "Garduri" by name. */
const RENDER_ON = { garduri: 'galerie-garduri' };

if (!fs.existsSync(SRC)) die(`${SRC} does not exist.`);
const ro = JSON.parse(fs.readFileSync(path.join(ROOT, 'locales/ro.json'), 'utf8'));
const build = fs.readFileSync(path.join(ROOT, 'build.js'), 'utf8');
const slugBlock = (build.match(/const SERVICE_SLUGS = \[([^\]]*)\]/) || [])[1];
if (!slugBlock) die('build.js has no SERVICE_SLUGS list to read the service pages from.');
const slugs = [...slugBlock.matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]);
const titles = new Map();
slugs.forEach((s, i) => titles.set(key(ro.services.items[i].title), s));
for (const [k, v] of Object.entries(ro.pages || {})) {
  const m = build.match(new RegExp(`\\{ slug: '([a-z0-9-]+)', key: '${k}'`));
  if (m && v && v.title) titles.set(key(v.title), m[1]);
}

const magicJpeg = (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
const sips = (a) => execFileSync('sips', a, { stdio: ['ignore', 'pipe', 'pipe'] }).toString();
const dims = (f) => { const g = sips(['-g', 'pixelWidth', '-g', 'pixelHeight', f]); return [Number(g.match(/pixelWidth:\s*(\d+)/)[1]), Number(g.match(/pixelHeight:\s*(\d+)/)[1])]; };
const natural = (a, b) => a.localeCompare(b, 'en', { numeric: true });

function write(src, out, width, quality) {
  const tmp = path.join(require('os').tmpdir(), `gal-${process.pid}.jpg`);
  sips(['-s', 'format', 'jpeg', '-s', 'formatOptions', String(quality), src, '--out', tmp]);
  const [w] = dims(tmp);
  if (w > width) sips(['--resampleWidth', String(width), tmp]);
  try { execFileSync('exiftool', ['-all=', '-overwrite_original', tmp], { stdio: 'ignore' }); } catch { /* the read-back below decides */ }
  const bytes = fs.readFileSync(tmp);
  if (bytes.includes(Buffer.from('Exif\0\0', 'binary')) || /GPS(Latitude|Longitude|Position)/.test(bytes.toString('latin1'))) {
    fs.unlinkSync(tmp); die(`metadata survived on ${src}; nothing installed for it.`);
  }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.copyFileSync(tmp, out); fs.unlinkSync(tmp);
  return dims(out);
}

const galleries = [], empty = [], unmatched = [];
for (const dir of fs.readdirSync(SRC).sort(natural)) {
  const abs = path.join(SRC, dir);
  if (!fs.statSync(abs).isDirectory()) continue;
  const page = titles.get(key(dir));
  const files = fs.readdirSync(abs).filter((f) => !f.startsWith('.') && fs.statSync(path.join(abs, f)).isFile()).sort(natural);
  if (!page) { unmatched.push({ folder: nfc(dir), files: files.length }); continue; }
  if (!files.length) { empty.push({ folder: nfc(dir), page }); continue; }
  const on = RENDER_ON[page] || page;
  const seen = new Map(), photos = [], skipped = [], refused = [];
  for (const f of files) {
    const b = fs.readFileSync(path.join(abs, f));
    if (!magicJpeg(b)) { refused.push({ file: nfc(f), why: 'not a JPEG by its bytes' }); continue; }
    const sha = crypto.createHash('sha256').update(b).digest('hex');
    if (seen.has(sha)) { skipped.push({ file: nfc(f), same_as: seen.get(sha) }); continue; }
    seen.set(sha, nfc(f));
    photos.push({ source: nfc(f), sha256: sha, abs: path.join(abs, f) });
  }
  photos.forEach((p, i) => {
    const n = String(i + 1).padStart(2, '0');
    p.full = `public/img/galerie/${on}/${n}.jpg`;
    p.thumb = `public/img/galerie/${on}/${n}-t.jpg`;
    const [sw, sh] = dims(p.abs);
    p.source_size = `${sw}x${sh}`;
    if (APPLY) {
      const [fw, fh] = write(p.abs, path.join(ROOT, p.full), FULL_W, 82);
      const [tw, th] = write(p.abs, path.join(ROOT, p.thumb), THUMB_W, 70);
      p.size = `${fw}x${fh}`; p.thumb_size = `${tw}x${th}`;
    }
    delete p.abs;
  });
  galleries.push({ folder: nfc(dir), page, render_on: on, found: files.length, installed: photos.length, preview: 1, photos, duplicates_skipped: skipped, refused });
}

for (const g of galleries) console.log(`${g.folder.padEnd(36)} -> /servicii/${g.render_on}/  found ${g.found}, unique ${g.installed}, duplicates ${g.duplicates_skipped.length}, refused ${g.refused.length}`);
for (const e of empty) console.log(`${e.folder.padEnd(36)} -> /servicii/${e.page}/  EMPTY, no gallery`);
for (const u of unmatched) console.log(`${u.folder.padEnd(36)} -> no page of that name: a question, not a page`);
if (!APPLY) { console.log('\nreport only; --apply installs.'); process.exit(0); }

/* Keep a preview choice already made by hand in the ledger; everything else is recomputed. */
const prev = fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, 'utf8')) : null;
for (const g of galleries) {
  const old = prev && prev.galleries.find((x) => x.folder === g.folder);
  if (old && Number.isInteger(old.preview) && old.preview >= 1 && old.preview <= g.installed) g.preview = old.preview;
}
const ledger = {
  _note: 'W26-12, ruling W26-R14. Written by scripts/intake-galleries.js from /Users/ivan/RC-webpics_v2, never typed. One gallery per folder whose name is a page title; `preview` is the 1-based photo the card shows and is the one field chosen by hand. Gate 29 (scripts/check-galleries.js) holds every page to this file: the lightbox shows exactly these photos, in this order.',
  source_root: SRC,
  galleries, empty_folders: empty, unmatched_folders: unmatched,
};
fs.writeFileSync(LEDGER, JSON.stringify(ledger, null, 2) + '\n');

/* Provenance, one row per installed file, R-W's client-supplied origin in its own words. */
const prov = fs.readFileSync(PROV, 'utf8');
const rows = [];
for (const g of galleries) for (const p of g.photos) for (const f of [p.full, p.thumb]) {
  if (prov.includes(`| \`${f}\` |`)) continue;
  rows.push(`| \`${f}\` | client direct transfer, owner folder RC-webpics_v2 ${g.folder}, ${DATE} | owned by Rapid Construct, supplied for site use | not required, client-supplied original | 2026-09-22 |`);
}
if (rows.length) fs.appendFileSync(PROV, rows.join('\n') + '\n');
console.log(`\nwrote ${path.relative(ROOT, LEDGER)}: ${galleries.length} galleries, ${galleries.reduce((n, g) => n + g.installed, 0)} photographs; ${rows.length} provenance rows appended.`);
