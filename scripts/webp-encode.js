#!/usr/bin/env node
/* WebP encoder with no dependency, card W28-23 (wave 28), ruling R-W28-06.

   THE PROBLEM IT SOLVES. The owner's rule says "convert to webp, max 1600px wide". This
   machine has no WebP encoder: sips cannot write the format, there is no cwebp, no
   ImageMagick, no npm (Q-W25-01 closed at "JPEG only, no new dependency"). The Chrome the
   gates already run (gates 5, 11, 14, 18, 20, 28) can: an image drawn on a canvas and
   exported with toDataURL('image/webp') is encoded by Chrome's own libwebp. Drawing it on
   a canvas also drops every metadata block (Exif, XMP, GPS), which gate 17 wants gone.

   WHAT IT DOES. For each (input, output) pair: serve the input file to a headless Chrome
   over loopback, load it into an Image, draw it on a canvas at most MAXW wide (never
   upscaled, aspect kept), export image/webp at QUALITY, and write the bytes. It refuses
   an export that is not a RIFF/WEBP container. Exit 1 on any failure.

   Usage: node scripts/webp-encode.js [--maxw 1600] [--quality 0.82] <in> <out> [<in> <out> ...]
   Module: const { encodeWebp } = require('./webp-encode'); await encodeWebp([[in, out]], { maxw, quality })
   Prints one line per file: in -> out WxH bytes. */

const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const CHROME = process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif', '.bmp': 'image/bmp' };

const get = (u) => new Promise((res, rej) => http.get(u, (r) => { const c = []; r.on('data', (x) => c.push(x)); r.on('end', () => res(JSON.parse(Buffer.concat(c).toString()))); }).on('error', rej));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const freePort = () => new Promise((res) => { const s = http.createServer(); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => res(p)); }); });

async function encodeWebp(pairs, opts = {}) {
  const MAXW = opts.maxw || 1600; const Q = opts.quality || 0.82; const quiet = !!opts.quiet;
  const WS = require(path.join(__dirname, 'lib', 'cdp-ws.js'));
  const byToken = new Map(); pairs.forEach(([i], n) => byToken.set('f' + n, path.resolve(i)));
  const server = http.createServer((rq, rs) => {
    const t = rq.url.slice(1).split('?')[0];
    if (t === '') { rs.writeHead(200, { 'content-type': 'text/html' }); rs.end('<!doctype html><title>webp</title>'); return; }
    const f = byToken.get(t); if (!f) { rs.writeHead(404); rs.end(); return; }
    rs.writeHead(200, { 'content-type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream', 'access-control-allow-origin': '*' });
    fs.createReadStream(f).pipe(rs);
  });
  const HP = await freePort(), CP = await freePort();
  await new Promise((r) => server.listen(HP, '127.0.0.1', r));
  const profile = fs.mkdtempSync(path.join(require('os').tmpdir(), 'webp-'));
  const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${CP}`, `--user-data-dir=${profile}`, '--no-first-run', 'about:blank'], { stdio: 'ignore' });
  const results = [];
  try {
    let list; for (let i = 0; i < 80; i++) { try { list = await get(`http://127.0.0.1:${CP}/json/list`); break; } catch { await sleep(300); } }
    if (!list) throw new Error('Chrome did not answer on its debugging port');
    const ws = new WS(list.find((x) => x.type === 'page').webSocketDebuggerUrl); await ws.ready;
    await ws.send('Page.enable', {}); await ws.send('Runtime.enable', {});
    await ws.send('Page.navigate', { url: `http://127.0.0.1:${HP}/` }); await sleep(300);
    for (let n = 0; n < pairs.length; n++) {
      const [inp, out] = pairs[n];
      const r = await ws.send('Runtime.evaluate', { awaitPromise: true, returnByValue: true, expression: `(async () => {
        const img = new Image(); img.crossOrigin = 'anonymous'; img.src = 'http://127.0.0.1:${HP}/f${n}';
        await new Promise((res, rej) => { img.onload = res; img.onerror = () => rej(new Error('decode failed')); });
        const s = Math.min(1, ${MAXW} / img.naturalWidth); const w = Math.round(img.naturalWidth * s), h = Math.round(img.naturalHeight * s);
        const c = document.createElement('canvas'); c.width = w; c.height = h; const ctx = c.getContext('2d'); ctx.imageSmoothingQuality = 'high'; ctx.drawImage(img, 0, 0, w, h);
        const data = c.toDataURL('image/webp', ${Q});
        return JSON.stringify({ w, h, sw: img.naturalWidth, sh: img.naturalHeight, data: data.split(',')[1], mime: data.slice(5, data.indexOf(';')) });
      })()` });
      const inner = r && r.result && (r.result.result || r.result);
      if (!inner || typeof inner.value !== 'string') { results.push({ inp, out, ok: false, error: 'no result from the browser: ' + JSON.stringify(r).slice(0, 300) }); continue; }
      const v = JSON.parse(inner.value);
      if (v.mime !== 'image/webp') { results.push({ inp, out, ok: false, error: `browser returned ${v.mime}, not webp` }); continue; }
      const buf = Buffer.from(v.data, 'base64');
      if (buf.slice(0, 4).toString() !== 'RIFF' || buf.slice(8, 12).toString() !== 'WEBP') { results.push({ inp, out, ok: false, error: 'not a RIFF WEBP container' }); continue; }
      fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true }); fs.writeFileSync(path.resolve(out), buf);
      results.push({ inp, out, ok: true, width: v.w, height: v.h, sourceWidth: v.sw, sourceHeight: v.sh, bytes: buf.length });
      if (!quiet) console.log(`${path.basename(inp)} -> ${path.basename(out)} ${v.w}x${v.h} ${buf.length} bytes`);
    }
    try { ws.sock.destroy(); } catch {}
  } finally {
    chrome.kill(); server.close(); try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
  }
  return results;
}

/* Reads the pixel size of a WebP file from its header: VP8 (lossy), VP8L (lossless) and
   VP8X (extended) chunks, per the container spec. Returns null when it is not a WebP. */
function webpSize(buf) {
  if (buf.length < 30 || buf.toString('latin1', 0, 4) !== 'RIFF' || buf.toString('latin1', 8, 12) !== 'WEBP') return null;
  const chunk = buf.toString('latin1', 12, 16);
  if (chunk === 'VP8X') return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
  if (chunk === 'VP8L') { const b = buf.readUInt32LE(21); return { width: 1 + (b & 0x3fff), height: 1 + ((b >> 14) & 0x3fff) }; }
  if (chunk === 'VP8 ') { return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff }; }
  return null;
}

module.exports = { encodeWebp, webpSize };

if (require.main === module) {
  const args = process.argv.slice(2); let maxw = 1600, quality = 0.82;
  for (let i = 0; i < args.length; i++) { if (args[i] === '--maxw') { maxw = Number(args[i + 1]); args.splice(i, 2); i--; } else if (args[i] === '--quality') { quality = Number(args[i + 1]); args.splice(i, 2); i--; } }
  if (args.length < 2 || args.length % 2) { console.error('usage: node scripts/webp-encode.js [--maxw N] [--quality Q] <in> <out> [...]'); process.exit(2); }
  const pairs = []; for (let i = 0; i < args.length; i += 2) pairs.push([args[i], args[i + 1]]);
  encodeWebp(pairs, { maxw, quality }).then((rs) => { const bad = rs.filter((r) => !r.ok); bad.forEach((b) => console.error(`${b.inp}: ${b.error}`)); process.exit(bad.length ? 1 : 0); }).catch((e) => { console.error(e.message); process.exit(1); });
}
