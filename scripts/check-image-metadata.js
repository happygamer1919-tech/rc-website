#!/usr/bin/env node
/* Image metadata gate, card W23-01 (wave 23), corrected by W23-01a.

   The R-W amendment of 2026-09-18 admits a new origin, the client's own files,
   and puts one condition on it: "All EXIF and GPS stripped before commit,
   verified by exiftool showing no GPS tags." exiftool proves it on a
   workstation; this proves it on every pull request, with no dependency, so the
   condition holds for the next batch as well as this one.

   TWO ASSERTIONS, and they are deliberately different strengths.

   1. NO GPS, in any committed image. A GPS tag in a photograph of a client's
      house publishes where that client lives. Every file under public/ is read,
      and a file is an image by its bytes, not its name: a HEIC renamed .jpg is
      read as what it is. Any GPS IFD, or any XMP GPS property, fails the run.

   2. NO METADATA AT ALL, in an image whose provenance row says it came through
      the client-supplied origin. That is the amendment's own condition, so it is
      held exactly: no Exif, no IPTC, no XMP, no comment. The rows are read from
      docs/assets/PROVENANCE.md, so a file joins this set by being recorded, not
      by being listed twice.

   HOW EACH FORMAT IS READ. JPEG, PNG and WebP are walked segment by segment or
   chunk by chunk, and a TIFF by its first IFD, so assertion 2 can be answered for
   them. Under that, every image of every format is also scanned byte by byte for
   any TIFF structure, which is what an Exif block is in every container, and for
   any XMP GPS property. That scan is what reads HEIC, AVIF, GIF, BMP and ICO, whose
   containers are not walked; it answers assertion 1 for them, not assertion 2. An
   SVG is read for the rasters it embeds as data URIs, and each is read in turn.

   WHY NOT "NO EXIF ANYWHERE". Measured on 2026-09-18: 128 images already on main
   carry an Exif block, and three carry IPTC. Stripping them would rewrite files
   whose bytes docs/assets/LEGACY-IMAGES.txt matches, which is what their legacy
   licence status rests on (R-W). None of them carries GPS. So the corpus is held
   to assertion 1 and the new origin to assertion 2, and the gap is reported
   rather than silently accepted: the count of images carrying Exif is printed on
   every run.

   IT NEVER PASSES ON NOTHING, OR ON WHAT IT COULD NOT READ. It fails when:
     - the parsers miss a planted GPS tag in their own self-test, run first
     - zero images are read
     - a file with an image extension is no image format this gate knows
     - an Exif block, or a segment or chunk around it, cannot be read
     - a row of the provenance table names the client-supplied origin but does
       not parse to a file and that source, which is how a changed table shape
       would otherwise leave assertion 2 holding nothing
     - a client-supplied row names a file that was not read, or one in a format
       whose metadata is read for GPS only, so it cannot be shown stripped

   Usage:  node scripts/check-image-metadata.js [root]  */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

/* A root argument, so the arms below can run against a scratch tree, the same
   way check-stub-count.js takes one. */
const ROOT = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const PUBLIC = path.join(ROOT, 'public');
const PROVENANCE = path.join(ROOT, 'docs/assets/PROVENANCE.md');
/* The source cell the R-W amendment prescribes for this origin. */
const CLIENT_ORIGIN = 'client direct transfer';
/* check-asset-provenance.js's IMAGE_EXT, kept identical: a file it holds to a
   provenance row as an image, this reads as one, or fails. */
const IMAGE_EXT = /\.(png|jpe?g|webp|gif|svg|avif|ico|bmp|tiff?|heic)$/i;
/* The formats whose metadata is walked, so assertion 2 can be answered. */
const WALKED = new Set(['JPEG', 'PNG', 'WebP', 'TIFF']);

const fail = (msg) => { console.error(`\nIMAGE METADATA GATE FAILED: ${msg}\n`); process.exit(1); };

const GPS_IFD = 0x8825, EXIF_IFD = 0x8769, XMP_TAG = 0x02BC, IPTC_TAG = 0x83BB;
const TIFF_MAGIC = [Buffer.from('II*\0', 'latin1'), Buffer.from('MM\0*', 'latin1')];
const XMP_GPS = /GPS(Latitude|Longitude|Altitude|DestLatitude|DestLongitude)/;

const blank = (format) => ({ format, exif: false, iptc: false, xmp: false, comment: false, gps: new Set(), unreadable: [] });

/* The tag ids in IFD0 of a TIFF structure (an Exif block is one), or null when
   the header, IFD0 or any entry's type is not valid TIFF. A GPS IFD pointer in
   IFD0 is how Exif carries GPS. */
function ifd0Tags(t) {
  if (t.length < 8) return null;
  const order = t.toString('latin1', 0, 2);
  if (order !== 'II' && order !== 'MM') return null;
  const le = order === 'II';
  const u16 = (o) => (le ? t.readUInt16LE(o) : t.readUInt16BE(o));
  const u32 = (o) => (le ? t.readUInt32LE(o) : t.readUInt32BE(o));
  if (u16(2) !== 42) return null;
  const ifd0 = u32(4);
  if (ifd0 < 8 || ifd0 + 2 > t.length) return null;
  const n = u16(ifd0);
  if (ifd0 + 2 + n * 12 > t.length) return null;
  const tags = [];
  for (let k = 0; k < n; k++) {
    const e = ifd0 + 2 + k * 12;
    const type = u16(e + 2);
    if (type < 1 || type > 13) return null;
    tags.push(u16(e));
  }
  return tags;
}

/* An Exif block found where a walk expects one: it must read, and it is GPS if
   IFD0 points to a GPS IFD. */
function readExif(t, out, where) {
  out.exif = true;
  const tags = ifd0Tags(t);
  if (!tags) out.unreadable.push(`${where}: an Exif block whose TIFF header or IFD0 cannot be read`);
  else if (tags.includes(GPS_IFD)) out.gps.add(`${where}: GPS IFD`);
}

/* The backstop under every walk: any TIFF structure anywhere in the bytes that
   points to a GPS IFD, and any XMP GPS property. A hit that does not read as TIFF
   is not a TIFF structure and is passed over. Returns how many TIFF structures
   read, which is how an unwalked container shows it carries Exif. */
function scanBytes(buf, out, where) {
  let found = 0;
  for (const magic of TIFF_MAGIC) {
    for (let i = buf.indexOf(magic); i !== -1; i = buf.indexOf(magic, i + 1)) {
      const tags = ifd0Tags(buf.subarray(i));
      if (!tags) continue;
      found++;
      if (tags.includes(GPS_IFD)) out.gps.add(`${where}GPS IFD at byte ${i}`);
    }
  }
  const m = buf.toString('latin1').match(XMP_GPS);
  if (m) out.gps.add(`${where}XMP ${m[0]}`);
  return found;
}

/* JPEG segment walk, up to the start of scan. Any run of 0xFF fill bytes may
   precede a marker (T.81 B.1.1.2), so they are skipped before the marker is read;
   reading one as a marker would take a length from padding and jump past the
   segment that carries the Exif block. */
function jpegMeta(buf, out) {
  let i = 2;
  for (;;) {
    if (i + 1 >= buf.length) { out.unreadable.push('JPEG ends before its image data'); return; }
    if (buf[i] !== 0xFF) { out.unreadable.push(`JPEG has no marker at byte ${i}`); return; }
    while (buf[i + 1] === 0xFF && i + 2 < buf.length) i++;
    const m = buf[i + 1];
    if (m === 0x01 || (m >= 0xD0 && m <= 0xD8)) { i += 2; continue; }   // markers with no length
    if (m === 0xDA || m === 0xD9) return;                                 // image data, or the end
    if (i + 4 > buf.length) { out.unreadable.push(`JPEG segment at byte ${i} is cut off`); return; }
    const len = buf.readUInt16BE(i + 2);
    if (len < 2 || i + 2 + len > buf.length) { out.unreadable.push(`JPEG segment at byte ${i} runs past the end of the file`); return; }
    const body = buf.subarray(i + 4, i + 2 + len);
    if (m === 0xFE) out.comment = true;
    if (m === 0xED) out.iptc = true;                                      // APP13, where IPTC lives
    if (m === 0xE1) {
      const head = body.toString('latin1', 0, 35);
      if (head.startsWith('Exif')) readExif(body.subarray(6), out, 'JPEG APP1 Exif');
      else if (head.startsWith('http://ns.adobe.com/xap/1.0/') || head.startsWith('http://ns.adobe.com/xmp/extension/')) out.xmp = true;
    }
    i += 2 + len;
  }
}

/* PNG text chunks: a keyword, then text that zTXt always and iTXt optionally
   compresses. ImageMagick writes a whole Exif block into one, hex encoded, as
   "Raw profile type exif", and XMP travels in iTXt, so the text is decoded and
   read rather than only noticed. */
function pngText(type, data, out) {
  const nul = data.indexOf(0);
  if (nul < 1) { out.unreadable.push(`PNG ${type} chunk without a keyword`); return; }
  const keyword = data.toString('latin1', 0, nul);
  let text;
  try {
    if (type === 'tEXt') text = data.subarray(nul + 1);
    else if (type === 'zTXt') text = zlib.inflateSync(data.subarray(nul + 2));
    else {
      const lang = data.indexOf(0, nul + 3);
      const translated = lang === -1 ? -1 : data.indexOf(0, lang + 1);
      if (translated === -1) throw new Error('cut off');
      const rest = data.subarray(translated + 1);
      text = data[nul + 1] ? zlib.inflateSync(rest) : rest;
    }
  } catch (e) { out.unreadable.push(`PNG ${type} chunk "${keyword}" cannot be decoded`); return; }
  out.comment = true;
  if (keyword === 'XML:com.adobe.xmp') out.xmp = true;
  if (/^Raw profile type (exif|APP1)$/i.test(keyword)) {
    const hex = text.toString('latin1').replace(/^\s*\S+\s+\d+\s+/, '').replace(/\s+/g, '');
    const raw = Buffer.from(hex, 'hex');
    readExif(raw.toString('latin1', 0, 4) === 'Exif' ? raw.subarray(6) : raw, out, `PNG ${type} "${keyword}"`);
  }
  scanBytes(text, out, `PNG ${type} "${keyword}": `);
}

/* PNG chunk walk: the eXIf chunk PNG gained in 2017 is a bare TIFF structure,
   read like the one inside a JPEG's APP1. */
function pngMeta(buf, out) {
  let i = 8;
  while (i + 12 <= buf.length) {
    const len = buf.readUInt32BE(i);
    const type = buf.toString('latin1', i + 4, i + 8);
    if (i + 12 + len > buf.length) { out.unreadable.push(`PNG chunk ${type} runs past the end of the file`); return; }
    const data = buf.subarray(i + 8, i + 8 + len);
    if (type === 'eXIf') readExif(data, out, 'PNG eXIf');
    if (type === 'tEXt' || type === 'zTXt' || type === 'iTXt') pngText(type, data, out);
    if (type === 'IEND') return;
    i += 12 + len;
  }
  out.unreadable.push('PNG ends without an IEND chunk');
}

/* WebP is RIFF: little-endian chunk sizes, each chunk padded to an even length.
   Its EXIF chunk is a TIFF structure, sometimes behind an "Exif\0\0" header. */
function webpMeta(buf, out) {
  let i = 12;
  while (i + 8 <= buf.length) {
    const type = buf.toString('latin1', i, i + 4);
    const len = buf.readUInt32LE(i + 4);
    if (i + 8 + len > buf.length) { out.unreadable.push(`WebP chunk ${type} runs past the end of the file`); return; }
    const data = buf.subarray(i + 8, i + 8 + len);
    if (type === 'EXIF') readExif(data.toString('latin1', 0, 4) === 'Exif' ? data.subarray(6) : data, out, 'WebP EXIF');
    if (type === 'XMP ') out.xmp = true;
    i += 8 + len + (len & 1);
  }
}

/* A TIFF file is itself the structure an Exif block is. */
function tiffMeta(buf, out) {
  const tags = ifd0Tags(buf);
  if (!tags) { out.unreadable.push('TIFF whose IFD0 cannot be read'); return; }
  if (tags.includes(GPS_IFD)) out.gps.add('TIFF: GPS IFD');
  if (tags.includes(EXIF_IFD)) out.exif = true;
  if (tags.includes(XMP_TAG)) out.xmp = true;
  if (tags.includes(IPTC_TAG)) out.iptc = true;
}

/* A format by its first bytes. An SVG is text, so it is taken at its name and
   must then hold an <svg> element. */
function sniff(buf, name) {
  const h = buf.toString('latin1', 0, 12);
  if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return 'JPEG';
  if (h.startsWith('\x89PNG\r\n\x1a\n')) return 'PNG';
  if (h.startsWith('RIFF') && h.slice(8, 12) === 'WEBP') return 'WebP';
  if (h.startsWith('II*\0') || h.startsWith('MM\0*')) return 'TIFF';
  if (h.slice(4, 8) === 'ftyp') return 'HEIF/AVIF';
  if (h.startsWith('GIF8')) return 'GIF';
  if (h.startsWith('BM')) return 'BMP';
  if (h.startsWith('\0\0\x01\0')) return 'ICO';
  if (/\.svg$/i.test(name) && /<svg[\s>]/i.test(buf.toString('utf8'))) return 'SVG';
  return null;
}

function readImage(buf, name, depth = 0) {
  const out = blank(sniff(buf, name));
  if (out.format === 'JPEG') jpegMeta(buf, out);
  else if (out.format === 'PNG') pngMeta(buf, out);
  else if (out.format === 'WebP') webpMeta(buf, out);
  else if (out.format === 'TIFF') tiffMeta(buf, out);
  else if (out.format === 'SVG' && depth < 2) {
    let k = 0;
    for (const m of buf.toString('utf8').matchAll(/data:image\/[\w.+-]+;base64,([A-Za-z0-9+/=\s]+)/g)) {
      const where = `embedded raster ${++k}`;
      const inner = readImage(Buffer.from(m[1].replace(/\s+/g, ''), 'base64'), where, depth + 1);
      if (!inner.format) { out.unreadable.push(`${where}: no image format this gate knows`); continue; }
      for (const g of inner.gps) out.gps.add(`${where}, ${inner.format}: ${g}`);
      for (const u of inner.unreadable) out.unreadable.push(`${where}, ${inner.format}: ${u}`);
      if (inner.exif) out.exif = true;
    }
  }
  if (out.format && scanBytes(buf, out, '') && !WALKED.has(out.format)) out.exif = true;
  return out;
}

/* --- self-test: the parsers must find a planted GPS tag before their silence
   means anything. Every case is built here, so this runs with no fixture. --- */
function tiff(tag, le = false) {
  const t = Buffer.alloc(26);
  t.write(le ? 'II' : 'MM', 0, 'latin1');
  const w16 = (v, o) => (le ? t.writeUInt16LE(v, o) : t.writeUInt16BE(v, o));
  const w32 = (v, o) => (le ? t.writeUInt32LE(v, o) : t.writeUInt32BE(v, o));
  w16(42, 2); w32(8, 4); w16(1, 8);
  w16(tag, 10); w16(4, 12); w32(1, 14); w32(26, 18); w32(0, 22);
  return t;
}
const seg = (m, body) => { const h = Buffer.from([0xFF, m, 0, 0]); h.writeUInt16BE(body.length + 2, 2); return Buffer.concat([h, body]); };
const exifApp1 = (t) => seg(0xE1, Buffer.concat([Buffer.from('Exif\0\0', 'latin1'), t]));
const SOS_EOI = Buffer.from([0xFF, 0xDA, 0, 2, 0xFF, 0xD9]);
const jpeg = (...segs) => Buffer.concat([Buffer.from([0xFF, 0xD8]), ...segs, SOS_EOI]);
const chunk = (type, data) => { const h = Buffer.alloc(8); h.writeUInt32BE(data.length, 0); h.write(type, 4, 'latin1'); return Buffer.concat([h, data, Buffer.alloc(4)]); };
const png = (...chunks) => Buffer.concat([Buffer.from('\x89PNG\r\n\x1a\n', 'latin1'), chunk('IHDR', Buffer.alloc(13)), ...chunks, chunk('IEND', Buffer.alloc(0))]);
const rawProfile = (t) => { const hex = Buffer.concat([Buffer.from('Exif\0\0', 'latin1'), t]).toString('hex'); return `\nexif\n${String(hex.length / 2).padStart(8)}\n${hex}\n`; };
const webp = (t) => { const c = Buffer.alloc(8); c.write('EXIF', 0, 'latin1'); c.writeUInt32LE(t.length, 4); const h = Buffer.alloc(12); h.write('RIFF', 0, 'latin1'); h.writeUInt32LE(4 + c.length + t.length, 4); h.write('WEBP', 8, 'latin1'); return Buffer.concat([h, c, t]); };
const heif = (t) => Buffer.concat([Buffer.from('\0\0\0\x18ftypheic\0\0\0\0mif1heic', 'latin1'), Buffer.from('\0\0\0\x06Exif\0\0', 'latin1'), t]);
const svg = (raster) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg"><image href="data:image/jpeg;base64,${raster.toString('base64')}"/></svg>`);
const ORIENTATION = 0x0112;

const SELF_TEST = [
  ['JPEG, GPS in its Exif block', jpeg(exifApp1(tiff(GPS_IFD))), true],
  ['JPEG, GPS, little-endian Exif', jpeg(exifApp1(tiff(GPS_IFD, true))), true],
  ['JPEG, fill bytes before the Exif marker', Buffer.concat([Buffer.from([0xFF, 0xD8, 0xFF, 0xFF, 0xFF]), exifApp1(tiff(GPS_IFD)), SOS_EOI]), true],
  ['JPEG, Exif without GPS', jpeg(exifApp1(tiff(ORIENTATION))), false],
  ['JPEG, XMP GPS property', jpeg(seg(0xE1, Buffer.from('http://ns.adobe.com/xap/1.0/\0<exif:GPSLatitude>47,1N</exif:GPSLatitude>', 'latin1'))), true],
  ['PNG, GPS in eXIf', png(chunk('eXIf', tiff(GPS_IFD))), true],
  ['PNG, eXIf without GPS', png(chunk('eXIf', tiff(ORIENTATION))), false],
  ['PNG, GPS in a compressed raw Exif profile', png(chunk('zTXt', Buffer.concat([Buffer.from('Raw profile type exif\0\0', 'latin1'), zlib.deflateSync(rawProfile(tiff(GPS_IFD)))]))), true],
  ['PNG, XMP GPS in compressed iTXt', png(chunk('iTXt', Buffer.concat([Buffer.from('XML:com.adobe.xmp\0\x01\0\0\0', 'latin1'), zlib.deflateSync('<exif:GPSLongitude>28,8E</exif:GPSLongitude>')]))), true],
  ['WebP, GPS in EXIF', webp(tiff(GPS_IFD)), true],
  ['TIFF, GPS in IFD0', tiff(GPS_IFD), true],
  ['HEIC, GPS in its Exif item', heif(tiff(GPS_IFD)), true],
  ['HEIC, Exif item without GPS', heif(tiff(ORIENTATION)), false],
  ['SVG, embedding a JPEG with GPS', svg(jpeg(exifApp1(tiff(GPS_IFD)))), true],
];
for (const [name, buf, gps] of SELF_TEST) {
  const got = readImage(buf, name.startsWith('SVG') ? 'self-test.svg' : 'self-test');
  if (!got.format || got.unreadable.length || (got.gps.size > 0) !== gps) {
    fail(`parser self-test: "${name}" read as ${got.format}, GPS ${got.gps.size > 0}, unreadable [${got.unreadable.join('; ')}]; expected GPS ${gps}`);
  }
}

/* --- the tree ------------------------------------------------------------- */
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);

if (!fs.existsSync(PUBLIC)) fail('public/ does not exist.');
const images = new Map(), notImages = [];
for (const f of walk(PUBLIC).sort()) {
  const meta = readImage(fs.readFileSync(f), f);
  if (meta.format) images.set(f, meta);
  else if (IMAGE_EXT.test(f)) notImages.push(path.relative(ROOT, f));
}
if (!images.size) fail('zero images under public/, so nothing was checked.');

/* Which files came through the client-supplied origin, read from their rows.
   Every table row that names the origin anywhere is counted, so a row the
   parse below cannot read fails instead of leaving assertion 2 holding less. */
if (!fs.existsSync(PROVENANCE)) fail('docs/assets/PROVENANCE.md is missing.');
const provenance = fs.readFileSync(PROVENANCE, 'utf8');
const clientRows = [];
let clientMentions = 0;
for (const line of provenance.split('\n')) {
  if (!line.startsWith('|')) continue;
  if (line.toLowerCase().includes(CLIENT_ORIGIN)) clientMentions++;
  const cells = line.split('|').map((c) => c.trim());
  if (cells.length < 4) continue;
  const file = (cells[1].match(/`([^`]+)`/) || [])[1];
  if (!file) continue;
  if (cells[2].toLowerCase().includes(CLIENT_ORIGIN)) clientRows.push(file);
}
const clientFiles = new Set(clientRows.map((file) => path.join(ROOT, file)));

const withGps = [], dirtyClient = [], withExif = [], unreadable = [], unread = [];
for (const [f, meta] of images) {
  const rel = path.relative(ROOT, f);
  if (meta.gps.size) withGps.push(`${rel}: ${[...meta.gps].join('; ')}`);
  if (meta.exif) withExif.push(rel);
  if (meta.unreadable.length) unreadable.push(`${rel}: ${meta.unreadable.join('; ')}`);
}
for (const f of clientFiles) {
  const rel = path.relative(ROOT, f);
  const meta = images.get(f);
  if (!meta) { unread.push(`${rel}: not read as an image under public/`); continue; }
  if (!WALKED.has(meta.format)) { unread.push(`${rel}: a ${meta.format}, whose metadata this gate reads for GPS only; publish it as JPEG through scripts/process-photos.js`); continue; }
  const found = [meta.exif && 'Exif', meta.iptc && 'IPTC', meta.xmp && 'XMP', meta.comment && 'a comment'].filter(Boolean);
  if (found.length) dirtyClient.push(`${rel}: ${found.join(', ')}`);
}

const byFormat = {};
for (const meta of images.values()) byFormat[meta.format] = (byFormat[meta.format] || 0) + 1;
console.log(`parser self-test: ${SELF_TEST.length} of ${SELF_TEST.length} passed`);
console.log(`images read: ${images.size} under public/ (${Object.entries(byFormat).map(([k, v]) => `${v} ${k}`).join(', ')})`);
console.log(`client-supplied origin ("${CLIENT_ORIGIN}") rows in PROVENANCE.md: ${clientRows.length}`);
console.log(`images carrying an Exif block: ${withExif.length} (legacy corpus; assertion 2 holds only the client-supplied origin, see this file's header)`);
console.log(`images carrying GPS: ${withGps.length}`);

const problems = [];
if (withGps.length) problems.push(`${withGps.length} image(s) carry GPS, which publishes where a client lives:\n    ${withGps.join('\n    ')}`);
if (dirtyClient.length) problems.push(`${dirtyClient.length} client-supplied image(s) still carry metadata, which the R-W amendment of 2026-09-18 forbids:\n    ${dirtyClient.join('\n    ')}`);
if (unread.length) problems.push(`${unread.length} client-supplied row(s) name a file this gate cannot show stripped:\n    ${unread.join('\n    ')}`);
if (clientMentions !== clientRows.length) problems.push(`${clientMentions} row(s) of PROVENANCE.md name the client-supplied origin, but ${clientRows.length} parse to a file with that source; the table's shape has changed, and a row that does not parse is a file assertion 2 never checks.`);
if (notImages.length) problems.push(`${notImages.length} file(s) named as images are no image format this gate knows, so they were not checked:\n    ${notImages.join('\n    ')}`);
if (unreadable.length) problems.push(`${unreadable.length} image(s) have metadata this gate cannot read, so their GPS cannot be ruled out:\n    ${unreadable.join('\n    ')}`);

if (problems.length) fail(problems.join('\n  '));
console.log(`\nno image carries GPS, and all ${clientFiles.size} client-supplied image(s) are stripped clean.`);
