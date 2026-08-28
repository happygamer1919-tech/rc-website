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

/* Centre-crop to `ratio`, resample to exactly w x h, then walk JPEG quality
   down until the file fits the budget. Returns the final size in bytes. */
function render(src, dest, w, h) {
  const { w: sw, h: sh } = dimensions(src);
  const target = w / h;

  // largest w*h-ratio rectangle that fits inside the source, centred
  let cw = sw, ch = Math.round(sw / target);
  if (ch > sh) { ch = sh; cw = Math.round(sh * target); }

  const tmp = dest + '.tmp.jpg';
  sips(['-s', 'format', 'jpeg', src, '--out', tmp]);
  sips(['-c', String(ch), String(cw), tmp]);       // sips takes height then width
  sips(['-z', String(h), String(w), tmp]);

  for (const q of [88, 80, 72, 64, 56, 48, 40, 32]) {
    sips(['-s', 'formatOptions', String(q), tmp, '--out', dest]);
    const size = fs.statSync(dest).size;
    if (size <= MAX_BYTES) { fs.unlinkSync(tmp); return { size, quality: q, cw, ch, sw, sh }; }
  }
  const size = fs.statSync(dest).size;
  fs.unlinkSync(tmp);
  return { size, quality: 32, cw, ch, sw, sh, over: true };
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
const warnings = [], oversize = [], done = [];

console.log(`\nphotos-raw/: ${inputs.size} file(s)   slots: ${SLOTS.length}\n`);

for (const slot of SLOTS) {
  const src = inputs.get(slot.id);
  if (!src) continue;

  const { w: sw, h: sh } = dimensions(src);
  if (Math.max(sw, sh) < MIN_LONG_EDGE) {
    warnings.push(`${slot.id}: ${sw}x${sh}, long edge under ${MIN_LONG_EDGE}px (manifest minimum)`);
  }
  if (sh > sw) {
    warnings.push(`${slot.id}: ${sw}x${sh} is portrait. The manifest requires landscape; the crop will discard a lot.`);
  }

  const variants = [{ name: slot.id, w: slot.w, h: slot.h }]
    .concat(slot.retina ? [{ name: slot.id + '@2x', w: slot.w * 2, h: slot.h * 2 }] : []);

  for (const v of variants) {
    const dest = path.join(OUT, v.name + '.jpg');
    if (DRY) { console.log(`  would write  ${v.name}.jpg  ${v.w}x${v.h}  from ${sw}x${sh}`); continue; }
    const r = render(src, dest, v.w, v.h);
    delete ledger[v.name];                       // no longer a placeholder
    if (r.over) oversize.push(`${v.name}.jpg is ${KB(r.size)} at quality 32, over the 400KB budget`);
    console.log(`  ${r.over ? '!!' : 'ok'}  ${v.name}.jpg  ${v.w}x${v.h}  q${r.quality}  ${KB(r.size)}` +
                `   (source ${sw}x${sh} -> crop ${r.cw}x${r.ch})`);
  }
  done.push(slot.id);
}

if (!DRY) fs.writeFileSync(LEDGER, JSON.stringify(ledger, null, 2) + '\n');

const missing = SLOTS.filter((s) => !inputs.has(s.id)).map((s) => s.id);

console.log(`\n${'-'.repeat(70)}`);
console.log(`processed: ${done.length}/${SLOTS.length} slots`);

if (warnings.length) { console.log(`\nWARNINGS (${warnings.length}):`); warnings.forEach((w) => console.log('  ! ' + w)); }
if (oversize.length) { console.log(`\nOVER BUDGET (${oversize.length}):`); oversize.forEach((w) => console.log('  ! ' + w)); }
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
