#!/usr/bin/env node
/* Turns raw photos into the exact files the site needs.

   Drop files into photos-raw/ named by slot ID (proj-acoperisuri-01-cover.jpg,
   step-01-fundatie.heic, ...) at any size, then:

       node scripts/process-photos.js

   For each one it centre-crops to the slot's ratio, writes a 1x and a 2x into
   public/img/, and compresses until the file is under 400KB. Slots with no
   input keep their placeholder. Nothing else in the repo needs to change.

   Uses sips, which ships with macOS. No dependencies.                        */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { SLOTS, MAX_BYTES, MIN_LONG_EDGE } = require('./slots');

const ROOT = path.join(__dirname, '..');
const RAW = path.join(ROOT, 'photos-raw');
const OUT = path.join(ROOT, 'public', 'img');
const LEDGER = path.join(OUT, 'PLACEHOLDERS.json');
const DRY = process.argv.includes('--dry-run');

// sips reads all of these natively on macOS, HEIC included.
const ACCEPTED = /\.(jpe?g|png|heic|heif|webp|tiff?)$/i;

// Levenshtein, so an unmatched filename can be told what it nearly matched.
function distance(a, b) {
  const m = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) m[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1,
        m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return m[a.length][b.length];
}
const nearest = (name, ids) => ids
  .map((id) => [id, distance(name, id)])
  .sort((x, y) => x[1] - y[1])
  .slice(0, 3)
  .map(([id]) => id);

const KB = (b) => (b / 1024).toFixed(0) + ' KB';
const sips = (args) => execFileSync('sips', args, { stdio: ['ignore', 'pipe', 'pipe'] }).toString();

function dimensions(file) {
  const out = sips(['-g', 'pixelWidth', '-g', 'pixelHeight', file]);
  return {
    w: Number((out.match(/pixelWidth:\s*(\d+)/) || [])[1]),
    h: Number((out.match(/pixelHeight:\s*(\d+)/) || [])[1]),
  };
}

/* Crop to `ratio`, resample, then walk JPEG quality down until the file fits
   the budget. Returns the final size in bytes.

   Two rules live here.

   R-B, never upscale: the requested w x h is a CEILING, not a promise. The bar
   is the CROPPED source, not its raw long edge, because the crop runs first and
   a 600x900 portrait cut to 4:3 holds 600x450 real pixels however long its long
   edge is. Asking for more than that would fabricate detail, so the output is
   clamped to the crop. The ratio is preserved by the clamp, so no layout moves.

   `anchor` picks which part of the frame survives the crop: 'top', 'bottom' or
   'centre' (the default). A centre crop is wrong for a roof and wrong for a
   foundation. sips has carried --cropOffset since macOS 13.                  */
function render(src, dest, w, h, anchor) {
  const { w: sw, h: sh } = dimensions(src);
  const target = w / h;

  // largest w*h-ratio rectangle that fits inside the source
  let cw = sw, ch = Math.round(sw / target);
  if (ch > sh) { ch = sh; cw = Math.round(sh * target); }

  // R-B: clamp the output to what the crop actually contains, ratio intact.
  let ow = w, oh = h;
  if (ow > cw) { ow = cw; oh = Math.round(cw / target); }

  // Offsets into the source. sips takes y then x, measured from the top left.
  // Clamped, because sips PADS WITH BLACK rather than clamping when an offset
  // runs past the edge, and a black band is not a visible error until someone
  // looks at the card.
  const clamp = (v, hi) => Math.max(0, Math.min(v, hi));
  const offY = clamp(anchor === 'top' ? 0 : anchor === 'bottom' ? sh - ch : Math.round((sh - ch) / 2), sh - ch);
  const offX = clamp(Math.round((sw - cw) / 2), sw - cw);

  const tmp = dest + '.tmp.jpg';
  sips(['-s', 'format', 'jpeg', src, '--out', tmp]);
  sips(['-c', String(ch), String(cw), '--cropOffset', String(offY), String(offX), tmp]);
  sips(['-z', String(oh), String(ow), tmp]);

  for (const q of [88, 80, 72, 64, 56, 48, 40, 32]) {
    sips(['-s', 'formatOptions', String(q), tmp, '--out', dest]);
    const size = fs.statSync(dest).size;
    if (size <= MAX_BYTES) { fs.unlinkSync(tmp); return { size, quality: q, cw, ch, sw, sh, ow, oh }; }
  }
  const size = fs.statSync(dest).size;
  fs.unlinkSync(tmp);
  return { size, quality: 32, cw, ch, sw, sh, ow, oh, over: true };
}

// ---------------------------------------------------------------------------
if (!fs.existsSync(RAW)) {
  fs.mkdirSync(RAW, { recursive: true });
  console.log(`created ${path.relative(ROOT, RAW)}/ — drop photos there, named by slot ID.`);
}

const inputs = new Map();
for (const f of fs.readdirSync(RAW)) {
  if (f.startsWith('.') || !ACCEPTED.test(f)) continue;
  inputs.set(path.parse(f).name.toLowerCase(), path.join(RAW, f));
}

const ledger = fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, 'utf8')) : {};
const known = new Set(SLOTS.map((s) => s.id));
const unknown = [...inputs.keys()].filter((k) => !known.has(k));
const warnings = [], oversize = [], clamps = [], done = [];

console.log(`\nphotos-raw/: ${inputs.size} file(s)   slots: ${SLOTS.length}\n`);

for (const slot of SLOTS) {
  const src = inputs.get(slot.id);
  if (!src) continue;

  const { w: sw, h: sh } = dimensions(src);
  // A slot may carry its own floor; without one the manifest default applies.
  const floor = slot.minLongEdge || MIN_LONG_EDGE;
  if (Math.max(sw, sh) < floor) {
    warnings.push(`${slot.id}: ${sw}x${sh}, long edge under ${floor}px (minimum for this slot)`);
  }
  if (sh > sw) {
    warnings.push(`${slot.id}: ${sw}x${sh} is portrait. The manifest requires landscape; the crop will discard a lot.`);
  }

  const variants = [{ name: slot.id, w: slot.w, h: slot.h }]
    .concat(slot.retina ? [{ name: slot.id + '@2x', w: slot.w * 2, h: slot.h * 2 }] : []);

  for (const v of variants) {
    const dest = path.join(OUT, v.name + '.jpg');
    if (DRY) { console.log(`  would write  ${v.name}.jpg  ${v.w}x${v.h}  from ${sw}x${sh}`); continue; }
    const r = render(src, dest, v.w, v.h, slot.cropAnchor);
    delete ledger[v.name];                       // no longer a placeholder
    if (r.over) oversize.push(`${v.name}.jpg is ${KB(r.size)} at quality 32, over the 400KB budget`);
    const clamped = r.ow !== v.w;
    if (clamped) clamps.push(`${v.name}: asked ${v.w}x${v.h}, source holds ${r.ow}x${r.oh}`);
    console.log(`  ${r.over ? '!!' : 'ok'}  ${v.name}.jpg  ${r.ow}x${r.oh}${clamped ? ` (R-B clamp from ${v.w}x${v.h})` : ''}  q${r.quality}  ${KB(r.size)}` +
                `   (source ${sw}x${sh} -> crop ${r.cw}x${r.ch}${slot.cropAnchor ? ' @' + slot.cropAnchor : ''})`);
  }
  done.push(slot.id);
}

if (!DRY) fs.writeFileSync(LEDGER, JSON.stringify(ledger, null, 2) + '\n');

const missing = SLOTS.filter((s) => !inputs.has(s.id)).map((s) => s.id);

console.log(`\n${'-'.repeat(70)}`);
console.log(`processed: ${done.length}/${SLOTS.length} slots`);

if (warnings.length) { console.log(`\nWARNINGS (${warnings.length}):`); warnings.forEach((w) => console.log('  ! ' + w)); }
if (oversize.length) { console.log(`\nOVER BUDGET (${oversize.length}):`); oversize.forEach((w) => console.log('  ! ' + w)); }
if (clamps.length) { console.log(`\nR-B CLAMPED, never upscaled (${clamps.length}):`); clamps.forEach((c) => console.log('  · ' + c)); }
if (missing.length) {
  console.log(`\nSTILL ON PLACEHOLDERS (${missing.length}):`);
  missing.forEach((m) => console.log('  · ' + m));
} else {
  console.log('\nAll slots filled with real photos.');
}

console.log(`\n${'='.repeat(70)}`);
console.log(`SUMMARY   slots filled: ${done.length}/${SLOTS.length}` +
            `   still placeholder: ${missing.length}` +
            `   files unmatched: ${unknown.length}`);
console.log('='.repeat(70));

if (unknown.length) {
  console.error(`\nREJECTED: ${unknown.length} file(s) in photos-raw/ match no slot ID.`);
  console.error('Nothing was skipped silently. Rename them or remove them, then re-run.\n');
  unknown.forEach((u) => {
    console.error(`  ${u}  ->  did you mean:`);
    nearest(u, SLOTS.map((s) => s.id)).forEach((n) => console.error(`      ${n}`));
  });
  console.error('');
}
if (oversize.length || unknown.length) process.exit(1);
console.log('\nNext: node build.js\n');
