#!/usr/bin/env node
/* Turns a downloaded or generated image into the exact file a filled slot needs.
   Card W25-01.

       node scripts/process-packshot.js <source-file> <SLOT-ID> [--dir catalog]

   It writes `public/img/<dir>/<SLOT-ID>.jpg`, sized so the longest side is at most
   600px and never larger than the source,
   with every scrap of metadata gone, and prints the line to paste into
   `docs/assets/PROVENANCE.md`. It does not touch the ledger: filling a slot is a
   deliberate edit, and a tool that flips `state` to "filled" on its own would let
   an image reach the site without anyone reading its provenance.

   WHAT IT REFUSES, and why each refusal is here rather than in a review:
     · a source whose longest side is under the 500px floor (W25-R2);
     · a source that is not an image by its BYTES, whatever its name says;
     · an output that still carries Exif or GPS after the strip, which is gate
       17's rule and is asserted here rather than trusted.

   METADATA. The strip is the re-encode: sips rebuilds the JPEG from decoded
   pixels and the source's tags do not survive that. (`sips -d all` is not
   available here; it answers "Cannot do --deleteProperty all on file", error 13.)
   Where exiftool is installed it runs as a second pass, because a packshot from a
   manufacturer routinely carries a photographer, a copyright string and sometimes
   a GPS block from the studio. Neither is trusted: the bytes are read back and
   the install is refused if anything survived.

   NO WEBP, TODAY. The dispatch asks for WebP plus a JPEG fallback and this writes
   JPEG only. This machine cannot encode WebP: `sips -s format webp` exits 13,
   macOS 26.6.2's ImageIO lists public.jpeg, public.png and public.jpeg-2000 as
   its writable destination types and not WebP, and there is no cwebp, no
   ImageMagick, and no npm package in a repo that has no package.json by design.
   Adding one is a new dependency and needs the owner's word: Q-W25-01. `build.js`
   already emits a <source type="image/webp"> the moment a .webp sits beside the
   .jpg, so the day that question is answered this script gains one line and
   nothing else in the repo changes.

   Uses sips, which ships with macOS, exactly as scripts/process-photos.js does.
   Zero dependencies. */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
/* W25-R2, the owner's answer to Q-W25-02. The floor was 800 and it was rejecting
   correct images from three manufacturers in four: DURAZIV publishes at 343x335,
   ROKO at 492x400, Phomi at 459x398, each one the manufacturer's own packshot of
   the right product on a plain ground. A catalogue card's image box is about
   264px wide at 1440, so 528px at 2x, and 800 was an OUTPUT target that had
   become an INPUT floor.

   SOURCE_FLOOR is what a source must have. OUTPUT is the longest side written.
   NOTHING IS EVER UPSCALED: a source between the floor and the output is written
   at its own size, because enlarging a packshot invents detail that was never
   photographed and a soft product photo reads as a cheap one. */
const SOURCE_FLOOR = 500;
const OUTPUT = 600;
const MAX_BYTES = 220 * 1024;

const die = (msg) => { console.error(`\nPACKSHOT FAILED: ${msg}\n`); process.exit(1); };

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const flag = (name, dflt) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : dflt;
};
if (args.length < 2) die('usage: node scripts/process-packshot.js <source-file> <SLOT-ID> [--dir catalog]');
const [SRC, SLOT] = args;
const DIR = flag('dir', 'catalog');
if (!/^[A-Z0-9-]+$/.test(SLOT)) die(`"${SLOT}" is not a slot id. Uppercase, digits and hyphens only.`);
if (!fs.existsSync(SRC)) die(`${SRC} does not exist.`);

const sips = (a) => execFileSync('sips', a, { stdio: ['ignore', 'pipe', 'pipe'] }).toString();

/* An image by its bytes, not by its name, which is gate 17's rule applied at the
   door: a HEIC renamed .jpg is a HEIC, and a downloaded "packshot" that is really
   an HTML error page is neither. */
const head = fs.readFileSync(SRC).subarray(0, 16);
const magic = (() => {
  if (head[0] === 0xff && head[1] === 0xd8) return 'jpeg';
  if (head.subarray(0, 8).toString('hex') === '89504e470d0a1a0a') return 'png';
  if (head.subarray(0, 4).toString() === 'RIFF' && head.subarray(8, 12).toString() === 'WEBP') return 'webp';
  if (head.subarray(4, 8).toString() === 'ftyp') return 'heic';
  if (head.subarray(0, 2).toString() === 'II' || head.subarray(0, 2).toString() === 'MM') return 'tiff';
  return null;
})();
if (!magic) die(`${SRC} is not an image by its bytes. A downloaded file that is really an error page reads like this.`);

let w, h;
try {
  const g = sips(['-g', 'pixelWidth', '-g', 'pixelHeight', SRC]);
  w = Number((g.match(/pixelWidth:\s*(\d+)/) || [])[1]);
  h = Number((g.match(/pixelHeight:\s*(\d+)/) || [])[1]);
} catch (e) { die(`sips could not read ${SRC}: ${e.message.split('\n')[0]}`); }
if (!(w > 0 && h > 0)) die(`sips read no dimensions from ${SRC}.`);
console.log(`source: ${SRC}  ${magic}  ${w}x${h}`);

if (Math.max(w, h) < SOURCE_FLOOR) {
  die(`the source is ${w}x${h} and its longest side is under the ${SOURCE_FLOOR}px floor. Find a larger file or leave the slot a placeholder (W25-R4).`);
}
/* Never upscale. A 520px source is written at 520, not stretched to 600. */
const target = Math.min(OUTPUT, Math.max(w, h));
if (target < OUTPUT) console.log(`source is ${Math.max(w, h)}px on its longest side, under the ${OUTPUT}px output; writing at ${target}px rather than upscaling`);

const outDir = path.join(ROOT, 'public', 'img', DIR);
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${SLOT}.jpg`);
const rel = path.relative(ROOT, out);

const tmp = path.join(require('os').tmpdir(), `packshot-${process.pid}.jpg`);
/* Re-encoding through sips rebuilds the JPEG from decoded pixels, which is what
   drops the source's metadata: `sips -d all` is NOT available on this macOS
   (it answers "Cannot do --deleteProperty all on file", error 13), so the strip
   is the re-encode plus the optional exiftool pass, and the assertion below is
   what actually decides. */
sips(['-s', 'format', 'jpeg', '-s', 'formatOptions', '88', SRC, '--out', tmp]);
sips(['-Z', String(target), tmp]);

/* Second pass where exiftool is installed. Not required: the assertion below is
   what decides, and it runs either way. */
try {
  execFileSync('exiftool', ['-all=', '-overwrite_original', tmp], { stdio: 'ignore' });
  console.log('exiftool: second metadata pass run');
} catch { console.log('exiftool: not installed, sips strip only (the assertion below still decides)'); }

/* Compress down until it fits, the way process-photos.js does. */
let quality = 88;
while (fs.statSync(tmp).size > MAX_BYTES && quality > 40) {
  quality -= 8;
  sips(['-s', 'format', 'jpeg', '-s', 'formatOptions', String(quality), tmp, '--out', tmp]);
}

/* THE ASSERTION, not the trust. Gate 17 refuses a committed image carrying GPS,
   and an image that reaches the repo dirty is a gate failure at the worst moment.
   Read the written bytes back and refuse to install them if any Exif survived. */
const bytes = fs.readFileSync(tmp);
const exif = bytes.includes(Buffer.from('Exif\0\0', 'binary'));
const gps = /GPS(Latitude|Longitude|Position)/.test(bytes.toString('latin1'));
if (exif || gps) {
  fs.unlinkSync(tmp);
  die(`metadata survived the strip on ${SRC} (exif=${exif}, gps=${gps}). It is not installed. Strip it by hand and re-run.`);
}

fs.copyFileSync(tmp, out);
fs.unlinkSync(tmp);
const g2 = sips(['-g', 'pixelWidth', '-g', 'pixelHeight', out]);
const fw = (g2.match(/pixelWidth:\s*(\d+)/) || [])[1];
const fh = (g2.match(/pixelHeight:\s*(\d+)/) || [])[1];
const kb = (fs.statSync(out).size / 1024).toFixed(0);

console.log(`\nwrote ${rel}  ${fw}x${fh}  ${kb}KB  quality ${quality}  metadata: none`);
console.log(`\nLedger, in docs/PHOTO-SLOTS-W24.json on slot ${SLOT}:`);
console.log(`  "state": "filled",`);
console.log(`  "provenance": "${rel}",`);
console.log(`  "alt": { "ro": "...", "ru": "..." }`);
console.log(`\nProvenance, one row in docs/assets/PROVENANCE.md:`);
console.log(`| \`${rel}\` | <source page URL> · <image URL> · <manufacturer> | manufacturer packshot, reseller display, licence not verified, owner accepted 2026-09-20 | <source page URL> | ${new Date().toISOString().slice(0, 10)} |`);
console.log(`\nR-W: the image and its row land in the SAME commit. R2: never a retailer, a marketplace, a watermark, a logo, a face or another seller's branding.`);
