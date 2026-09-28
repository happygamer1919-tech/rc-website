#!/usr/bin/env node
/* W29-01, rulings R-W29-01 and R-W29-02. The catalogue pictures, taken from fatade3d.md.

   THE OWNER'S RULE: "Download every product, sub-category and category image from fatade3d.md at the
   largest resolution served, convert to webp plus fallback, store under
   public/images/catalog/<category>/<sub>/. Manifest row per image per R-W29-02. Replace all current
   fatade-group images on our side." And R-W29-02: "Each image gets a SOURCES.md row: source URL,
   licence "permission Fatade 3D via owner 2026-09-28", alt RO and RU. Exceptions listed in W29-01."

   THE FOUR EXCEPTIONS, taken from nowhere: "CT 80 F - Polistiren expandat" keeps the neutral EPS board
   picture the site already showed for it (public/img/catalog/CAT-0002.jpg, a mark-free board render),
   now as its own file rather than a reuse; Colțar PVC, Plasă de armare and Membrana de DIFUZIE keep
   their current pictures exactly (ledger rows, files and manifest rows untouched).

   WHAT IT DOES, re-runnable:
   1. Reads the picture sources from content/catalog-products.json (`images_src`, written by
      scripts/gen-catalog-w29.js from the capture) and content/catalog.json (`fatade.image_src`).
   2. Downloads each one once into a cache outside the repo (FATADE_IMG_CACHE, default the system
      temp directory), with a user agent naming this project and its repository and nothing else.
   3. Encodes it in the headless Chrome the gates already run: a picture drawn on a canvas and
      exported by Chrome's own encoders, which drops every metadata block (gate 17). Products and
      tiles are flattened on white (the cards are white) into `<name>.jpg` (the fallback, at most
      1200 wide), `<name>.webp` (at most 1600) and `<name>-600.webp` (the card size); a brand logo
      keeps its transparency as `<name>.png` and `<name>.webp`, at most 400 wide. Never upscaled.
   4. Writes the ledger rows (docs/PHOTO-SLOTS-W24.json), one R-W row per file
      (docs/assets/PROVENANCE.md) and one SOURCES row per picture (docs/images/SOURCES.md), and
      writes content/catalog-images-w29.json, the list the build reads for the detail page galleries
      and the brand logos.
   5. Removes every fatade-group picture file the catalogue no longer shows, and its rows, except the
      four exceptions; removes the ledger rows of the records scripts/gen-catalog-w29.js dropped.

   Usage:  node scripts/intake-catalog-w29.js [--no-fetch]   (--no-fetch uses the cache only) */
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const { spawn, execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const P = (f) => path.join(ROOT, f);
const fail = (m) => { console.error(`\nINTAKE-CATALOG-W29 FAILED: ${m}\n`); process.exit(1); };
const NO_FETCH = process.argv.includes('--no-fetch');
const CACHE = process.env.FATADE_IMG_CACHE || path.join(os.tmpdir(), 'rc-fatade-img-cache');
const UA = 'rc-website https://github.com/happygamer1919-tech/rc-website';
const TODAY = '2026-09-28';
const LICENCE = 'permission Fatade 3D via owner 2026-09-28';
/* Exactly the sentence scripts/check-asset-provenance.js holds; the per-file facts go in the source cell. */
const PROV_LICENCE = `direct supplier, fatade3d.md, ${LICENCE} (R-W29-01, R-W29-02)`;
const BASE_DIR = 'public/images/catalog';

const readJson = (f) => JSON.parse(fs.readFileSync(P(f), 'utf8'));
const DATA = readJson('content/catalog-products.json');
const CATALOG = readJson('content/catalog.json');
const LEDGER = readJson('docs/PHOTO-SLOTS-W24.json');
const PREV = fs.existsSync(P('content/catalog-images-w29.json')) ? readJson('content/catalog-images-w29.json') : null;

/* The exceptions, by record id. Held to their names so a data change cannot silently move one. */
const EXCEPT = {
  'f3d-3283': { name: 'CT 80 F - Polistiren expandat', keep: 'public/img/catalog/CAT-0002.jpg', how: 'the neutral EPS board picture, as its own file (W29-01 exception 1)' },
  'f3d-2583': { name: 'Colțar PVC', how: 'current picture kept exactly (W29-01 exception 2)' },
  'f3d-2576': { name: 'Plasă de armare', how: 'current picture kept exactly (W29-01 exception 3)' },
  'f3d-2569': { name: 'Membrana de DIFUZIE pentru acoperișuri', how: 'current picture kept exactly (W29-01 exception 4)' },
};

const w29 = DATA.products.filter((r) => r.source && r.source.host === 'fatade3d.md' && r.source.captured === '2026-09-28');
if (w29.length !== 162) fail(`expected the 162 fatade-group records the capture holds, read ${w29.length}. Run scripts/gen-catalog-w29.js first.`);
for (const [id, e] of Object.entries(EXCEPT)) {
  const r = w29.find((x) => x.id === id);
  if (!r) fail(`exception ${id} (${e.name}) is not in the catalogue.`);
  if (r.name.ro.normalize('NFC').toLowerCase() !== e.name.normalize('NFC').toLowerCase()) fail(`exception ${id} is named "${r.name.ro}", not "${e.name}".`);
}

/* --- the jobs ---------------------------------------------------------------- */
const slugify = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const jobs = [];          // { key, url, base, kind: 'photo'|'logo', page, alt: {ro,ru}, slot?, use }
const galleries = {};     // record id -> [base, ...] (extra pictures after the slot's own)
const logos = {};         // brand -> base
const catImages = {};     // category slug (or parent/child) -> { slot, base }
const catImagesByBase = {}; // base -> the catImages entry, so a reused tile can point at its origin's files
const pageOf = (r) => `/catalog/${r.categories[0]}/`;
for (const r of w29) {
  if (EXCEPT[r.id]) continue;
  const dir = `${BASE_DIR}/${r.categories[0]}`;
  const srcs = r.images_src || [];
  if (!srcs.length) fail(`${r.id} ${r.name.ro} has no picture source in the capture.`);
  srcs.forEach((url, k) => {
    const base = `${dir}/${r.slug}${k ? '-' + (k + 1) : ''}`;
    const alt = k === 0
      ? { ro: `${r.name.ro}, fotografia produsului`, ru: `${r.name.ru}, фотография товара` }
      : { ro: `${r.name.ro}, fotografia ${k + 1}`, ru: `${r.name.ru}, фотография ${k + 1}` };
    jobs.push({ key: `${r.id}#${k}`, url, base, kind: 'photo', page: pageOf(r), alt, slot: k === 0 ? r.slot : null, fatadePage: r.source.url });
    if (k) (galleries[r.id] = galleries[r.id] || []).push(base);
  });
  if (r.brand_logo_src && r.brand) {
    const b = slugify(r.brand);
    if (!logos[r.brand]) {
      logos[r.brand] = `${BASE_DIR}/brands/${b}`;
      jobs.push({ key: `logo:${r.brand}`, url: r.brand_logo_src, base: logos[r.brand], kind: 'logo', page: pageOf(r), alt: { ro: `Sigla ${r.brand}`, ru: `Логотип ${r.brand}` }, fatadePage: r.source.url });
    }
  }
}
/* Category and sub-category tiles: the hub's CATEG-0N rows and a new CATSUB-NN per sub-category. */
let subN = 0;
CATALOG.categories.forEach((c, i) => {
  if (!c.fatade) return;
  const slug = c.href.ro.split('/')[2];
  const slot = `CATEG-0${i + 1}`;
  catImages[slug] = { slot, base: `${BASE_DIR}/${slug}/category` };
  catImagesByBase[catImages[slug].base] = catImages[slug];
  jobs.push({ key: `cat:${slug}`, url: c.fatade.image_src, base: catImages[slug].base, kind: 'photo', page: '/catalog/', alt: { ro: `${c.label.ro}, fotografia categoriei`, ru: `${c.label.ru}, фотография категории` }, slot, fatadePage: c.fatade.url });
  for (const k of c.children || []) {
    if (!k.fatade) continue;
    subN += 1;
    const s = k.href.ro.replace(/^\/catalog\//, '').replace(/\/$/, '');
    const sslot = `CATSUB-${String(subN).padStart(2, '0')}`;
    catImages[s] = { slot: sslot, base: `${BASE_DIR}/${s}/subcategory` };
    catImagesByBase[catImages[s].base] = catImages[s];
    jobs.push({ key: `sub:${s}`, url: k.fatade.image_src, base: catImages[s].base, kind: 'photo', page: c.href.ro, alt: { ro: `${k.label.ro}, fotografia subcategoriei`, ru: `${k.label.ru}, фотография подкатегории` }, slot: sslot, fatadePage: k.fatade.url });
  }
});
/* One source file, one set of files: fatade shows the same picture on a category tile and a
   sub-category tile (or a product) in a few places. The first slot to use a picture is its origin; a
   later slot declares reuse_of it (W25-R17's shape, which gate 19 holds), and nothing is encoded twice. */
const firstByUrl = new Map();
for (const j of jobs) {
  if (j.kind !== 'photo') continue;
  const first = firstByUrl.get(j.url);
  if (!first) { firstByUrl.set(j.url, j); continue; }
  j.reuseOf = first;
}
const encodeJobs = jobs.filter((j) => !j.reuseOf);
const urls = new Set(jobs.map((j) => j.url));
console.log(`jobs: ${jobs.length} pictures (${jobs.filter((j) => j.kind === 'logo').length} brand logos, ${Object.keys(catImages).length} category and sub-category tiles) from ${urls.size} distinct source files`);
for (const j of jobs) if (!/^https:\/\/(www\.)?fatade3d\.md\//.test(j.url)) fail(`${j.key}: source ${j.url} is not on fatade3d.md.`);

/* --- fetch -------------------------------------------------------------------- */
fs.mkdirSync(CACHE, { recursive: true });
const cacheFile = (u) => path.join(CACHE, u.replace(/^https?:\/\//, '').replace(/[^a-zA-Z0-9._-]+/g, '_'));
let fetched = 0;
for (const u of urls) {
  const f = cacheFile(u);
  if (fs.existsSync(f) && fs.statSync(f).size > 0) continue;
  if (NO_FETCH) fail(`--no-fetch and ${u} is not cached.`);
  try {
    execFileSync('curl', ['-sSfL', '--retry', '3', '--max-time', '120', '-A', UA, '-o', f, u], { stdio: ['ignore', 'ignore', 'pipe'] });
  } catch (e) { fail(`download failed: ${u}: ${String(e.stderr || e.message).trim()}`); }
  fetched++;
  execFileSync('sleep', ['0.3']);
}
console.log(`fetched ${fetched} new file(s); cache: ${CACHE}`);

/* --- encode in Chrome --------------------------------------------------------- */
const CHROME = process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif' };
const get = (u) => new Promise((res, rej) => http.get(u, (r) => { const c = []; r.on('data', (x) => c.push(x)); r.on('end', () => res(JSON.parse(Buffer.concat(c).toString()))); }).on('error', rej));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const freePort = () => new Promise((res) => { const s = http.createServer(); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => res(p)); }); });
const sniff = (buf) => (buf[0] === 0xff && buf[1] === 0xd8 ? 'image/jpeg' : buf.slice(0, 8).toString('hex') === '89504e470d0a1a0a' ? 'image/png' : buf.slice(0, 4).toString() === 'RIFF' && buf.slice(8, 12).toString() === 'WEBP' ? 'image/webp' : buf.slice(0, 3).toString() === 'GIF' ? 'image/gif' : null);

async function encodeAll(list) {
  const WS = require(path.join(__dirname, 'lib', 'cdp-ws.js'));
  const files = new Map(list.map((j, n) => ['f' + n, cacheFile(j.url)]));
  const server = http.createServer((rq, rs) => {
    const t = rq.url.slice(1).split('?')[0];
    if (t === '') { rs.writeHead(200, { 'content-type': 'text/html' }); rs.end('<!doctype html><title>enc</title>'); return; }
    const f = files.get(t); if (!f) { rs.writeHead(404); rs.end(); return; }
    const buf = fs.readFileSync(f);
    rs.writeHead(200, { 'content-type': sniff(buf) || MIME[path.extname(f).toLowerCase()] || 'application/octet-stream', 'access-control-allow-origin': '*' });
    rs.end(buf);
  });
  const HP = await freePort(), CP = await freePort();
  await new Promise((r) => server.listen(HP, '127.0.0.1', r));
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'enc-'));
  const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${CP}`, `--user-data-dir=${profile}`, '--no-first-run', 'about:blank'], { stdio: 'ignore' });
  const out = [];
  try {
    let lst; for (let i = 0; i < 80; i++) { try { lst = await get(`http://127.0.0.1:${CP}/json/list`); break; } catch { await sleep(300); } }
    if (!lst) throw new Error('Chrome did not answer on its debugging port');
    const ws = new WS(lst.find((x) => x.type === 'page').webSocketDebuggerUrl); await ws.ready;
    await ws.send('Page.enable', {}); await ws.send('Runtime.enable', {});
    await ws.send('Page.navigate', { url: `http://127.0.0.1:${HP}/` }); await sleep(400);
    for (let n = 0; n < list.length; n++) {
      const j = list[n];
      const outs = j.kind === 'logo'
        ? [{ ext: '.png', type: 'image/png', maxw: 400, flat: false }, { ext: '.webp', type: 'image/webp', maxw: 400, q: 0.9, flat: false }]
        : [{ ext: '.jpg', type: 'image/jpeg', maxw: 1200, q: 0.86, flat: true }, { ext: '.webp', type: 'image/webp', maxw: 1600, q: 0.82, flat: true }, { ext: '-600.webp', type: 'image/webp', maxw: 600, q: 0.8, flat: true }];
      const r = await ws.send('Runtime.evaluate', { awaitPromise: true, returnByValue: true, expression: `(async () => {
        const img = new Image(); img.crossOrigin = 'anonymous'; img.src = 'http://127.0.0.1:${HP}/f${n}';
        await new Promise((res, rej) => { img.onload = res; img.onerror = () => rej(new Error('decode failed')); });
        const res = [];
        for (const o of ${JSON.stringify(outs)}) {
          const s = Math.min(1, o.maxw / img.naturalWidth); const w = Math.round(img.naturalWidth * s), h = Math.round(img.naturalHeight * s);
          const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.imageSmoothingQuality = 'high';
          if (o.flat) { x.fillStyle = '#ffffff'; x.fillRect(0, 0, w, h); }
          x.drawImage(img, 0, 0, w, h);
          res.push({ ext: o.ext, w, h, data: c.toDataURL(o.type, o.q) });
        }
        return { nw: img.naturalWidth, nh: img.naturalHeight, res };
      })()` });
      /* scripts/lib/cdp-ws.js resolves with the whole protocol message: { id, result: { result, exceptionDetails } }. */
      const rr = r.result || {};
      if (rr.exceptionDetails || !rr.result || !rr.result.value) throw new Error(`${j.key} ${j.url}: ${JSON.stringify(rr.exceptionDetails || r.error || r).slice(0, 300)}`);
      const v = rr.result.value;
      const written = [];
      for (const o of v.res) {
        const [head, b64] = o.data.split(',');
        const buf = Buffer.from(b64, 'base64');
        const want = o.ext.endsWith('.webp') ? 'image/webp' : o.ext === '.png' ? 'image/png' : 'image/jpeg';
        if (!head.includes(want) || sniff(buf) !== want) throw new Error(`${j.key}: Chrome did not export ${want} for ${o.ext}`);
        const f = j.base + o.ext;
        fs.mkdirSync(P(path.dirname(f)), { recursive: true });
        fs.writeFileSync(P(f), buf);
        written.push({ file: f, w: o.w, h: o.h, bytes: buf.length });
      }
      out.push({ job: j, natural: `${v.nw}x${v.nh}`, written });
      if ((n + 1) % 25 === 0) console.log(`  encoded ${n + 1} of ${list.length}`);
    }
    ws.close();
  } finally { try { chrome.kill(); } catch {} server.close(); try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} }
  return out;
}

/* --- the manifests ------------------------------------------------------------ */
const provPath = P('docs/assets/PROVENANCE.md');
const srcPath = P('docs/images/SOURCES.md');
const rowFile = (l) => { const m = l.match(/^\| `([^`]+)`/); return m ? m[1] : null; };

(async () => {
  const done = await encodeAll(encodeJobs);
  const newFiles = new Set(done.flatMap((d) => d.written.map((w) => w.file)));

  /* Which old files go: every file a fatade-group ledger row or reuse pointed at before this run,
     plus the files of the dropped records, minus what the exceptions keep. Found from the ledger
     and the provenance rows, never by a pattern on disk. */
  const keep = new Set(Object.values(EXCEPT).map((e) => e.keep).filter(Boolean));
  const w29Slots = new Set(w29.map((r) => r.slot));
  const exceptSlots = new Set(w29.filter((r) => EXCEPT[r.id]).map((r) => r.slot));
  for (const s of exceptSlots) { const row = LEDGER.slots.find((x) => x.id === s); if (row && row.provenance) keep.add(row.provenance); }
  const droppedIds = new Set((readJson('docs/catalog/FATADE-PARITY.json').dropped_from_this_site || []).map((d) => d.id));
  const oldFiles = new Set();
  for (const row of LEDGER.slots) {
    const catSlot = /^CATEG-0[1-7]$/.test(row.id);
    if ((w29Slots.has(row.id) && !exceptSlots.has(row.id)) || catSlot) {
      if (row.provenance && !keep.has(row.provenance)) { oldFiles.add(row.provenance); oldFiles.add(row.provenance.replace(/\.jpe?g$/i, '.webp')); }
    }
  }
  /* The dropped records' slots: their ids are in the parity file, their slots in the ledger by page. */
  const droppedSlots = new Set();
  const oldData = JSON.parse(execFileSync('git', ['show', 'HEAD:content/catalog-products.json'], { cwd: ROOT, maxBuffer: 64 << 20 }).toString());
  for (const r of oldData.products) if (droppedIds.has(r.id)) droppedSlots.add(r.slot);
  for (const row of LEDGER.slots) if (droppedSlots.has(row.id) && row.provenance && !keep.has(row.provenance)) { oldFiles.add(row.provenance); oldFiles.add(row.provenance.replace(/\.jpe?g$/i, '.webp')); }
  /* A file another, untouched row still stands on is not removed. */
  for (const row of LEDGER.slots) if (!w29Slots.has(row.id) && !droppedSlots.has(row.id) && !/^CATEG-0[1-7]$/.test(row.id) && row.provenance) { oldFiles.delete(row.provenance); oldFiles.delete(row.provenance.replace(/\.jpe?g$/i, '.webp')); }
  for (const f of keep) { oldFiles.delete(f); oldFiles.delete(f.replace(/\.jpe?g$/i, '.webp')); }
  /* Earlier runs of this script: its own files that are no longer produced. */
  if (PREV) for (const f of PREV.files || []) if (!newFiles.has(f)) oldFiles.add(f);
  for (const f of newFiles) oldFiles.delete(f);
  let removed = 0;
  for (const f of oldFiles) if (fs.existsSync(P(f))) { fs.unlinkSync(P(f)); removed++; }

  /* Ledger. */
  const slotRow = new Map(LEDGER.slots.map((s) => [s.id, s]));
  LEDGER.slots = LEDGER.slots.filter((s) => !droppedSlots.has(s.id));
  for (const d of done) {
    const j = d.job;
    if (!j.slot) continue;
    const jpg = d.written.find((w) => w.file.endsWith('.jpg'));
    let row = slotRow.get(j.slot);
    if (!row) { row = { id: j.slot, page: j.page, ratio: '4 / 3', min_px: '800x600', shows: '' }; LEDGER.slots.push(row); slotRow.set(j.slot, row); }
    row.page = j.page;
    row.state = 'filled';
    row.provenance = jpg.file;
    row.alt = j.alt;
    row.shows = `Imaginea fatade3d.md pentru "${j.alt.ro.split(',')[0]}", la rezolutia cea mai mare publicata (${d.natural}), R-W29-01 si R-W29-02.`;
    delete row.reuse_of; delete row.reuse_reason; delete row.label;
  }
  /* A slot whose picture another slot already carries: the origin's file, declared as a reuse. */
  for (const j of jobs.filter((x) => x.reuseOf && x.slot)) {
    const origin = done.find((d) => d.job === j.reuseOf);
    if (!origin || !j.reuseOf.slot) throw new Error(`${j.key} reuses ${j.reuseOf.key}, which carries no slot`);
    let row = slotRow.get(j.slot);
    if (!row) { row = { id: j.slot, page: j.page, ratio: '4 / 3', min_px: '800x600', shows: '' }; LEDGER.slots.push(row); slotRow.set(j.slot, row); }
    row.page = j.page; row.state = 'filled'; row.alt = j.alt;
    row.provenance = origin.written.find((w) => w.file.endsWith('.jpg')).file;
    row.reuse_of = j.reuseOf.slot;
    row.reuse_reason = 'R-W29-02: fatade3d.md shows this same picture here and on the origin slot; one picture, one set of files.';
    row.shows = `Aceeasi imagine fatade3d.md ca slotul ${j.reuseOf.slot} (R-W29-02).`;
    delete row.label;
    if (j.base in catImagesByBase) catImagesByBase[j.base].base = j.reuseOf.base;
  }
  /* CT 80 F: its own file now, not a reuse of a slot whose picture moved. */
  const ct = w29.find((r) => r.id === 'f3d-3283');
  const ctRow = slotRow.get(ct.slot);
  ctRow.provenance = EXCEPT['f3d-3283'].keep; delete ctRow.reuse_of; delete ctRow.reuse_reason;
  ctRow.shows = 'W29-01 exceptia 1: placa EPS neutra, imaginea pe care site-ul o arata deja, fara nicio marca; nu se ia de pe fatade3d.md.';
  ctRow.alt = { ro: 'CT 80 F - Polistiren expandat, placă EPS', ru: 'CT 80 F - Пенополистирол, плита EPS' };
  fs.writeFileSync(P('docs/PHOTO-SLOTS-W24.json'), JSON.stringify(LEDGER, null, 2) + '\n');

  /* PROVENANCE: drop the rows of removed files, add one per new file. */
  const provLines = fs.readFileSync(provPath, 'utf8').split('\n');
  const provKept = provLines.filter((l) => { const f = rowFile(l); return !f || (!oldFiles.has(f) && !newFiles.has(f)); });
  const provNew = [];
  for (const d of done) for (const w of d.written) {
    provNew.push(`| \`${w.file}\` | ${d.job.url} · ${d.job.fatadePage} · Fatade 3D, source ${d.natural}, written ${w.w}x${w.h} by scripts/intake-catalog-w29.js at the largest resolution served | ${PROV_LICENCE} | https://fatade3d.md/ | ${TODAY} |`);
  }
  const lastRow = provKept.map((l, i) => (rowFile(l) ? i : -1)).filter((i) => i >= 0).pop();
  provKept.splice(lastRow + 1, 0, ...provNew);
  fs.writeFileSync(provPath, provKept.join('\n'));

  /* SOURCES: one row per picture, keyed by its fallback file, naming the other two files. */
  const srcLines = fs.readFileSync(srcPath, 'utf8').split('\n');
  const srcKept = srcLines.filter((l) => { const f = rowFile(l); return !f || (!oldFiles.has(f) && !newFiles.has(f)); });
  const srcNew = done.map((d) => {
    const key = d.written[0].file;
    const others = d.written.slice(1).map((w) => '`' + path.basename(w.file) + '`').join(' and ');
    return `| \`${key}\` | ${d.job.page} | ${d.job.url} · ${d.job.fatadePage} | ${LICENCE} | alt RO: ${d.job.alt.ro} · alt RU: ${d.job.alt.ru} · with ${others} |`;
  });
  const lastSrc = srcKept.map((l, i) => (rowFile(l) ? i : -1)).filter((i) => i >= 0).pop();
  srcKept.splice(lastSrc + 1, 0, ...srcNew);
  fs.writeFileSync(srcPath, srcKept.join('\n'));

  /* The build's list. */
  const byBase = new Map(done.map((d) => [d.job.base, d]));
  const dims = (base) => { const d = byBase.get(base); const w = d && d.written.find((x) => x.file.endsWith('.webp') && !x.file.endsWith('-600.webp')); return w ? `${w.w}x${w.h}` : null; };
  const IMG = {
    _note: 'W29-01. Written by scripts/intake-catalog-w29.js, never typed. `gallery` is each product\'s extra pictures after its ledger slot\'s own, as bases (the build adds .jpg, .webp and -600.webp); `logos` is the manufacturer logo per brand name, as a base (.png and .webp); `tiles` is the category and sub-category tile slots; `exceptions` names the four products W29-01 keeps off fatade3d.md; `files` is every file this script wrote, so a re-run can remove what it no longer writes.',
    /* A gallery picture another job already encoded points at that job's files. */
    gallery: Object.fromEntries(Object.entries(galleries).map(([id, bs]) => [id, bs.map((b) => { const j = jobs.find((x) => x.base === b); const o = j && j.reuseOf ? j.reuseOf.base : b; return { base: o, size: dims(o) }; })])),
    logos: Object.fromEntries(Object.entries(logos).map(([b, base]) => [b, { base, size: (byBase.get(base).written[0] || {}).w ? `${byBase.get(base).written[0].w}x${byBase.get(base).written[0].h}` : null }])),
    tiles: catImages,
    exceptions: Object.fromEntries(Object.entries(EXCEPT).map(([id, e]) => [id, e.how])),
    files: [...newFiles].sort(),
  };
  fs.writeFileSync(P('content/catalog-images-w29.json'), JSON.stringify(IMG, null, 2) + '\n');

  const bytes = done.reduce((n, d) => n + d.written.reduce((m, w) => m + w.bytes, 0), 0);
  console.log(`encoded ${done.length} pictures into ${newFiles.size} files, ${(bytes / 1048576).toFixed(1)} MB; removed ${removed} old file(s); ledger slots dropped with their records: ${droppedSlots.size}`);
  const small = done.filter((d) => d.job.kind === 'photo' && Number(d.natural.split('x')[0]) < 600);
  if (small.length) { console.log(`pictures under 600 wide at the source (served as published, never upscaled): ${small.length}`); for (const s of small) console.log(`  ${s.job.key} ${s.natural} ${s.job.url}`); }
})().catch((e) => fail(e && e.stack ? e.stack : String(e)));
