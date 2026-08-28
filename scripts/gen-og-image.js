#!/usr/bin/env node
/* Builds a branded social-share card: the white logo centred on #141414 at
   1200x630, written to public/img/og-image.jpg. Runs automatically as part of
   gen-placeholders. A real photo can overwrite it later like any other slot.

   Decodes the logo PNG in pure Node (zlib is built in), box-downscales it,
   alpha-composites onto the dark field, then hands off to sips for the JPEG. */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { execFileSync } = require('child_process');

const W = 1200, H = 630;
const BG = [0x14, 0x14, 0x14];
const LOGO_WIDTH_FRACTION = 0.52;

// ---- minimal PNG decoder (8-bit, non-interlaced, greyscale/RGB/palette/alpha)
function decodePNG(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('not a PNG');
  let pos = 8, ihdr = null, idat = [], plte = null, trns = null;
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') {
      ihdr = { w: data.readUInt32BE(0), h: data.readUInt32BE(4), depth: data[8],
               color: data[9], interlace: data[12] };
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'PLTE') plte = data;
    else if (type === 'tRNS') trns = data;
    else if (type === 'IEND') break;
    pos += 12 + len;
  }
  if (ihdr.depth !== 8) throw new Error('only 8-bit PNGs supported, got ' + ihdr.depth);
  if (ihdr.interlace) throw new Error('interlaced PNG not supported');

  const CHANNELS = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[ihdr.color];
  const bpp = CHANNELS;
  const stride = ihdr.w * bpp;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const out = Buffer.alloc(stride * ihdr.h);

  const paeth = (a, b, c) => {
    const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
  };

  for (let y = 0; y < ihdr.h; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? out[y * stride + x - bpp] : 0;
      const b = y > 0 ? out[(y - 1) * stride + x] : 0;
      const c = x >= bpp && y > 0 ? out[(y - 1) * stride + x - bpp] : 0;
      let v = line[x];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) v += paeth(a, b, c);
      out[y * stride + x] = v & 0xFF;
    }
  }

  // normalise to RGBA
  const rgba = Buffer.alloc(ihdr.w * ihdr.h * 4);
  for (let i = 0; i < ihdr.w * ihdr.h; i++) {
    let r, g, b, a = 255;
    const o = i * bpp;
    if (ihdr.color === 6) { r = out[o]; g = out[o + 1]; b = out[o + 2]; a = out[o + 3]; }
    else if (ihdr.color === 2) { r = out[o]; g = out[o + 1]; b = out[o + 2]; }
    else if (ihdr.color === 4) { r = g = b = out[o]; a = out[o + 1]; }
    else if (ihdr.color === 0) { r = g = b = out[o]; }
    else { const p = out[o] * 3; r = plte[p]; g = plte[p + 1]; b = plte[p + 2]; if (trns && out[o] < trns.length) a = trns[out[o]]; }
    rgba[i * 4] = r; rgba[i * 4 + 1] = g; rgba[i * 4 + 2] = b; rgba[i * 4 + 3] = a;
  }
  return { w: ihdr.w, h: ihdr.h, rgba };
}

/* Box-average downscale, which keeps thin logo strokes readable where
   nearest-neighbour would break them up. */
function resizeRGBA(src, dw, dh) {
  const out = Buffer.alloc(dw * dh * 4);
  const xr = src.w / dw, yr = src.h / dh;
  for (let y = 0; y < dh; y++) {
    const y0 = Math.floor(y * yr), y1 = Math.max(y0 + 1, Math.floor((y + 1) * yr));
    for (let x = 0; x < dw; x++) {
      const x0 = Math.floor(x * xr), x1 = Math.max(x0 + 1, Math.floor((x + 1) * xr));
      let r = 0, g = 0, b = 0, a = 0, n = 0;
      for (let sy = y0; sy < y1 && sy < src.h; sy++) {
        for (let sx = x0; sx < x1 && sx < src.w; sx++) {
          const o = (sy * src.w + sx) * 4, al = src.rgba[o + 3] / 255;
          r += src.rgba[o] * al; g += src.rgba[o + 1] * al; b += src.rgba[o + 2] * al;
          a += src.rgba[o + 3]; n++;
        }
      }
      const o = (y * dw + x) * 4, aa = a / n;
      const norm = aa > 0 ? (n * 255) / a : 0;
      out[o] = Math.min(255, (r / n) * norm); out[o + 1] = Math.min(255, (g / n) * norm);
      out[o + 2] = Math.min(255, (b / n) * norm); out[o + 3] = aa;
    }
  }
  return { w: dw, h: dh, rgba: out };
}

// ---- PNG encoder (RGB, no alpha) -------------------------------------------
const CRC = (() => { const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c; } return t; })();
const crc32 = (b) => { let c = -1; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xFF] ^ (c >>> 8); return (c ^ -1) >>> 0; };
const chunk = (type, data) => {
  const l = Buffer.alloc(4); l.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const c = Buffer.alloc(4); c.writeUInt32BE(crc32(body));
  return Buffer.concat([l, body, c]);
};

// ---- compose ----------------------------------------------------------------
const ROOT = path.join(__dirname, '..');
const logo = decodePNG(fs.readFileSync(path.join(ROOT, 'public', 'logo-white.png')));

const lw = Math.round(W * LOGO_WIDTH_FRACTION);
const lh = Math.round(logo.h * (lw / logo.w));
const small = resizeRGBA(logo, lw, lh);

const canvas = Buffer.alloc(W * H * 3);
for (let i = 0; i < W * H; i++) { canvas[i * 3] = BG[0]; canvas[i * 3 + 1] = BG[1]; canvas[i * 3 + 2] = BG[2]; }

const ox = Math.round((W - lw) / 2), oy = Math.round((H - lh) / 2);
for (let y = 0; y < lh; y++) {
  for (let x = 0; x < lw; x++) {
    const s = (y * lw + x) * 4, a = small.rgba[s + 3] / 255;
    if (a === 0) continue;
    const d = ((oy + y) * W + (ox + x)) * 3;
    for (let c = 0; c < 3; c++) canvas[d + c] = Math.round(small.rgba[s + c] * a + canvas[d + c] * (1 - a));
  }
}

const raw = Buffer.alloc((W * 3 + 1) * H);
for (let y = 0; y < H; y++) { raw[y * (W * 3 + 1)] = 0; canvas.copy(raw, y * (W * 3 + 1) + 1, y * W * 3, (y + 1) * W * 3); }
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 2;
const png = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);

const tmp = path.join(ROOT, 'public', 'img', 'og-image.png');
const dest = path.join(ROOT, 'public', 'img', 'og-image.jpg');
fs.writeFileSync(tmp, png);
execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '88', tmp, '--out', dest], { stdio: 'ignore' });
fs.unlinkSync(tmp);
console.log(`  write   og-image.jpg  ${W}x${H}  ${(fs.statSync(dest).size / 1024).toFixed(1)} KB  (branded: logo on #141414)`);
