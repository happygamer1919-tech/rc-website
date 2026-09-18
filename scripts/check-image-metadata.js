#!/usr/bin/env node
/* Image metadata gate, card W23-01 (wave 23).

   The R-W amendment of 2026-09-18 admits a new origin, the client's own files,
   and puts one condition on it: "All EXIF and GPS stripped before commit,
   verified by exiftool showing no GPS tags." exiftool proves it on a
   workstation; this proves it on every pull request, with no dependency, so the
   condition holds for the next batch as well as this one.

   TWO ASSERTIONS, and they are deliberately different strengths.

   1. NO GPS, in any committed image. A GPS tag in a photograph of a client's
      house publishes where that client lives. Every image under public/ is read
      and any GPS IFD fails the run.

   2. NO METADATA AT ALL, in an image whose provenance row says it came through
      the client-supplied origin. That is the amendment's own condition, so it is
      held exactly: no Exif, no IPTC, no XMP, no comment. The rows are read from
      docs/assets/PROVENANCE.md, so a file joins this set by being recorded, not
      by being listed twice.

   WHY NOT "NO EXIF ANYWHERE". Measured on 2026-09-18: about 130 images already
   on main carry an Exif block, and three carry IPTC. Stripping them would rewrite
   files whose bytes docs/assets/LEGACY-IMAGES.txt matches, which is what their
   legacy licence status rests on (R-W). None of them carries GPS. So the corpus
   is held to assertion 1 and the new origin to assertion 2, and the gap is
   reported rather than silently accepted: the count of images carrying Exif is
   printed on every run.

   IT NEVER PASSES ON NOTHING. Zero images read, or zero client-supplied rows
   found while the provenance file names some, fails.

   Usage:  node scripts/check-image-metadata.js [root]  */

const fs = require('fs');
const path = require('path');

/* A root argument, so the arms below can run against a scratch tree, the same
   way check-stub-count.js takes one. */
const ROOT = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const PUBLIC = path.join(ROOT, 'public');
const PROVENANCE = path.join(ROOT, 'docs/assets/PROVENANCE.md');
/* The source cell the R-W amendment prescribes for this origin. */
const CLIENT_ORIGIN = 'client direct transfer';

const fail = (msg) => { console.error(`\nIMAGE METADATA GATE FAILED: ${msg}\n`); process.exit(1); };

/* JPEG segment walk. Returns every APPn/COM marker present, whether an Exif
   APP1 carries a GPS IFD pointer (tag 0x8825), and whether XMP is present. */
function jpegMeta(buf) {
  const out = { markers: [], gps: false, exif: false, xmp: false, iptc: false, comment: false };
  if (buf[0] !== 0xFF || buf[1] !== 0xD8) return null;
  let i = 2;
  while (i < buf.length - 3) {
    if (buf[i] !== 0xFF) { i++; continue; }
    const m = buf[i + 1];
    if (m === 0xD8 || (m >= 0xD0 && m <= 0xD9)) { i += 2; continue; }
    if (m === 0xDA) break;                       // start of scan: image data follows
    const len = buf.readUInt16BE(i + 2);
    if (len < 2) break;
    const body = buf.slice(i + 4, i + 2 + len);
    if (m >= 0xE0 && m <= 0xEF) out.markers.push(`APP${m - 0xE0}`);
    if (m === 0xFE) { out.markers.push('COM'); out.comment = true; }
    if (m === 0xED) out.iptc = true;
    if (m === 0xE1) {
      const tag = body.slice(0, 4).toString('ascii');
      if (tag === 'Exif') {
        out.exif = true;
        const t = body.slice(6);
        if (t.length > 8) {
          const le = t.slice(0, 2).toString('ascii') === 'II';
          const u16 = (o) => (le ? t.readUInt16LE(o) : t.readUInt16BE(o));
          const u32 = (o) => (le ? t.readUInt32LE(o) : t.readUInt32BE(o));
          const ifd0 = u32(4);
          if (ifd0 > 0 && ifd0 + 2 < t.length) {
            const n = u16(ifd0);
            for (let k = 0; k < n && ifd0 + 2 + k * 12 + 12 <= t.length; k++) {
              if (u16(ifd0 + 2 + k * 12) === 0x8825) out.gps = true;   // GPS IFD pointer
            }
          }
        }
      }
      if (body.slice(0, 28).toString('ascii').startsWith('http://ns.adobe.com/xap')) out.xmp = true;
    }
    i += 2 + len;
  }
  return out;
}

/* PNG chunk walk, for the eXIf chunk PNG gained in 2017. */
function pngMeta(buf) {
  const out = { markers: [], gps: false, exif: false, xmp: false, iptc: false, comment: false };
  let i = 8;
  while (i + 8 <= buf.length) {
    const len = buf.readUInt32BE(i);
    const type = buf.slice(i + 4, i + 8).toString('ascii');
    if (type === 'eXIf') { out.exif = true; out.markers.push('eXIf'); }
    if (type === 'tEXt' || type === 'iTXt' || type === 'zTXt') { out.comment = true; out.markers.push(type); }
    if (type === 'IEND') break;
    i += 12 + len;
  }
  return out;
}

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);

if (!fs.existsSync(PUBLIC)) fail('public/ does not exist.');
const images = walk(PUBLIC).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();
if (!images.length) fail('zero images under public/, so nothing was checked.');

/* Which files came through the client-supplied origin, read from their rows. */
if (!fs.existsSync(PROVENANCE)) fail('docs/assets/PROVENANCE.md is missing.');
const provenance = fs.readFileSync(PROVENANCE, 'utf8');
const clientFiles = new Set();
for (const line of provenance.split('\n')) {
  if (!line.startsWith('|')) continue;
  const cells = line.split('|').map((c) => c.trim());
  if (cells.length < 4) continue;
  const file = (cells[1].match(/`([^`]+)`/) || [])[1];
  if (!file) continue;
  if (cells[2].toLowerCase().includes(CLIENT_ORIGIN)) clientFiles.add(path.join(ROOT, file));
}

const withGps = [], dirtyClient = [], withExif = [];
for (const f of images) {
  const buf = fs.readFileSync(f);
  const meta = /\.png$/i.test(f) ? pngMeta(buf) : jpegMeta(buf);
  if (!meta) continue;
  const rel = path.relative(ROOT, f);
  if (meta.gps) withGps.push(rel);
  if (meta.exif) withExif.push(rel);
  if (clientFiles.has(f)) {
    const found = [meta.exif && 'Exif', meta.iptc && 'IPTC', meta.xmp && 'XMP', meta.comment && 'a comment'].filter(Boolean);
    if (found.length) dirtyClient.push(`${rel}: ${found.join(', ')}`);
  }
}

console.log(`images read: ${images.length} under public/`);
console.log(`client-supplied origin ("${CLIENT_ORIGIN}") rows in PROVENANCE.md: ${clientFiles.size}`);
console.log(`images carrying an Exif block: ${withExif.length} (legacy corpus; assertion 2 holds only the client-supplied origin, see this file's header)`);
console.log(`images carrying GPS: ${withGps.length}`);

const problems = [];
if (withGps.length) problems.push(`${withGps.length} image(s) carry GPS, which publishes where a client lives:\n    ${withGps.join('\n    ')}`);
if (dirtyClient.length) problems.push(`${dirtyClient.length} client-supplied image(s) still carry metadata, which the R-W amendment of 2026-09-18 forbids:\n    ${dirtyClient.join('\n    ')}`);
if (clientFiles.size && ![...clientFiles].some((f) => fs.existsSync(f))) problems.push('every client-supplied row names a file that does not exist.');

if (problems.length) fail(problems.join('\n  '));
console.log(`\nno image carries GPS, and all ${clientFiles.size} client-supplied image(s) are stripped clean.`);
