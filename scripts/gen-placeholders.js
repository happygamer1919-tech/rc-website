#!/usr/bin/env node
/* Generates one placeholder JPG per image slot in docs/RC-PHOTO-MANIFEST.md.
   Each is a real file at the manifest's pixel size: #F2F2F2 field, 1px #E2E2E2
   border, slot ID and ratio centred in #5A5A5A. Because the file always exists,
   the page never shows a broken-image icon and the <img> alt text survives.

   Dropping in a real photo is a plain overwrite of public/img/<slot-id>.jpg.
   Re-running this script will NOT clobber a real photo: any file whose size no
   longer matches the recorded placeholder size is left alone.

   No dependencies. PNG is written with the built-in zlib, then converted to
   JPEG with sips (ships with macOS).                                        */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { execFileSync } = require('child_process');

const OUT = path.join(__dirname, '..', 'public', 'img');
const LEDGER = path.join(OUT, 'PLACEHOLDERS.json');
const FORCE = process.argv.includes('--force');

const BG = [0xF2, 0xF2, 0xF2];
const BORDER = [0xE2, 0xE2, 0xE2];
const TEXT = [0x5A, 0x5A, 0x5A];

// ---- slots, straight from the manifest --------------------------------------
const SLOTS = [
  ...['svc-case-la-cheie', 'svc-acoperisuri', 'svc-fatade', 'svc-reparatii', 'svc-finisaje',
      'svc-proiectare-3d', 'svc-retele', 'svc-industrial', 'svc-terasamente']
    .map((id) => ({ id, w: 1200, h: 900, ratio: '4:3' })),
  ...['step-01-fundatie', 'step-02-structura', 'step-03-acoperis', 'step-04-fatada', 'step-05-predare']
    .map((id) => ({ id, w: 900, h: 675, ratio: '4:3' })),
  ...['port-01', 'port-02', 'port-03', 'port-04', 'port-05', 'port-06']
    .map((id) => ({ id, w: 1400, h: 933, ratio: '3:2' })),
  { id: 'og-image', w: 1200, h: 630, ratio: '1200x630' },
];

// ---- 5x7 bitmap font, column-encoded, bit 0 = top row ------------------------
const F = {
  '0': [0x3E,0x51,0x49,0x45,0x3E], '1': [0x00,0x42,0x7F,0x40,0x00], '2': [0x42,0x61,0x51,0x49,0x46],
  '3': [0x21,0x41,0x45,0x4B,0x31], '4': [0x18,0x14,0x12,0x7F,0x10], '5': [0x27,0x45,0x45,0x45,0x39],
  '6': [0x3C,0x4A,0x49,0x49,0x30], '7': [0x01,0x71,0x09,0x05,0x03], '8': [0x36,0x49,0x49,0x49,0x36],
  '9': [0x06,0x49,0x49,0x29,0x1E],
  a: [0x20,0x54,0x54,0x54,0x78], b: [0x7F,0x48,0x44,0x44,0x38], c: [0x38,0x44,0x44,0x44,0x20],
  d: [0x38,0x44,0x44,0x48,0x7F], e: [0x38,0x54,0x54,0x54,0x18], f: [0x08,0x7E,0x09,0x01,0x02],
  g: [0x0C,0x52,0x52,0x52,0x3E], h: [0x7F,0x08,0x04,0x04,0x78], i: [0x00,0x44,0x7D,0x40,0x00],
  j: [0x20,0x40,0x44,0x3D,0x00], k: [0x7F,0x10,0x28,0x44,0x00], l: [0x00,0x41,0x7F,0x40,0x00],
  m: [0x7C,0x04,0x18,0x04,0x78], n: [0x7C,0x08,0x04,0x04,0x78], o: [0x38,0x44,0x44,0x44,0x38],
  p: [0x7C,0x14,0x14,0x14,0x08], q: [0x08,0x14,0x14,0x18,0x7C], r: [0x7C,0x08,0x04,0x04,0x08],
  s: [0x48,0x54,0x54,0x54,0x20], t: [0x04,0x3F,0x44,0x40,0x20], u: [0x3C,0x40,0x40,0x20,0x7C],
  v: [0x1C,0x20,0x40,0x20,0x1C], w: [0x3C,0x40,0x30,0x40,0x3C], x: [0x44,0x28,0x10,0x28,0x44],
  y: [0x0C,0x50,0x50,0x50,0x3C], z: [0x44,0x64,0x54,0x4C,0x44],
  ' ': [0,0,0,0,0], '-': [0x08,0x08,0x08,0x08,0x08], ':': [0x00,0x36,0x36,0x00,0x00],
  '.': [0x00,0x60,0x60,0x00,0x00], '·': [0x00,0x00,0x18,0x00,0x00], '×': [0x00,0x28,0x10,0x28,0x00],
};
const GLYPH_W = 5, GLYPH_H = 7, ADVANCE = 6;

// ---- raster helpers ----------------------------------------------------------
function raster(w, h) {
  const px = Buffer.alloc(w * h * 3);
  for (let i = 0; i < w * h; i++) { px[i * 3] = BG[0]; px[i * 3 + 1] = BG[1]; px[i * 3 + 2] = BG[2]; }
  const put = (x, y, c) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const o = (y * w + x) * 3;
    px[o] = c[0]; px[o + 1] = c[1]; px[o + 2] = c[2];
  };
  for (let x = 0; x < w; x++) { put(x, 0, BORDER); put(x, h - 1, BORDER); }
  for (let y = 0; y < h; y++) { put(0, y, BORDER); put(w - 1, y, BORDER); }
  return { px, put };
}

function drawText(img, text, w, h, scale) {
  const chars = [...text.toLowerCase()];
  const textW = chars.length * ADVANCE * scale - scale;
  const x0 = Math.round((w - textW) / 2);
  const y0 = Math.round((h - GLYPH_H * scale) / 2);
  chars.forEach((ch, ci) => {
    const glyph = F[ch] || F['-'];
    for (let col = 0; col < GLYPH_W; col++) {
      for (let row = 0; row < GLYPH_H; row++) {
        if (!(glyph[col] & (1 << row))) continue;
        const bx = x0 + (ci * ADVANCE + col) * scale;
        const by = y0 + row * scale;
        for (let dy = 0; dy < scale; dy++) for (let dx = 0; dx < scale; dx++) img.put(bx + dx, by + dy, TEXT);
      }
    }
  });
}

// ---- minimal PNG encoder ------------------------------------------------------
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
const crc32 = (buf) => {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
};
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}
function encodePNG(px, w, h) {
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 3 + 1)] = 0;
    px.copy(raw, y * (w * 3 + 1) + 1, y * w * 3, (y + 1) * w * 3);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---- run ----------------------------------------------------------------------
fs.mkdirSync(OUT, { recursive: true });
const ledger = fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, 'utf8')) : {};
const next = {};
let made = 0, kept = 0;

for (const slot of SLOTS) {
  const jpg = path.join(OUT, slot.id + '.jpg');
  if (!FORCE && fs.existsSync(jpg)) {
    const size = fs.statSync(jpg).size;
    if (ledger[slot.id] !== size) {
      console.log(`  keep    ${slot.id}.jpg  (real photo, ${(size / 1024).toFixed(0)} KB)`);
      next[slot.id] = ledger[slot.id] ?? -1;
      kept++;
      continue;
    }
  }

  const label = `${slot.id} · ${slot.ratio}`;
  const scale = Math.max(2, Math.floor((slot.w * 0.62) / (label.length * ADVANCE)));
  const img = raster(slot.w, slot.h);
  drawText(img, label, slot.w, slot.h, scale);

  const png = path.join(OUT, slot.id + '.png');
  fs.writeFileSync(png, encodePNG(img.px, slot.w, slot.h));
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '80', png, '--out', jpg], { stdio: 'ignore' });
  fs.unlinkSync(png);

  next[slot.id] = fs.statSync(jpg).size;
  made++;
  console.log(`  write   ${slot.id}.jpg  ${slot.w}x${slot.h}  ${(next[slot.id] / 1024).toFixed(1)} KB`);
}

fs.writeFileSync(LEDGER, JSON.stringify(next, null, 2) + '\n');
console.log(`\n${made} placeholder(s) written, ${kept} real photo(s) left untouched. ${SLOTS.length} slots total.`);
