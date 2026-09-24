#!/usr/bin/env node
/* Stock picture intake, cards W28-23 and W28-24 (wave 28), rulings R-W28-06 and R-W28-07.

   WHAT IT DOES. Reads a plan (JSON) of pictures already chosen and viewed, and for each one:
   fetches the file from the stock site's file host, checks its bytes are an image, encodes it
   to WebP at most 1600 wide with scripts/webp-encode.js (the Chrome the gates run; the canvas
   drops every metadata block), writes it under public/img/, and records it in the three places
   the gates read: docs/assets/PROVENANCE.md (R-W's row: file, source URL, licence, licence URL,
   date), docs/images/SOURCES.md (the owner's manifest: file, page, source URL, licence, subject)
   and the ledger the picture belongs to (docs/PHOTO-SLOTS-W24.json for a catalogue slot,
   content/galleries.json for a gallery). The plan carries the alt text in both locales that the
   viewer who accepted the picture wrote.

   TWO KINDS OF ITEM.
   - kind "catalog": { slot, type, origin_slot|null, site, id, page_url, image_url, download_url,
     licence, licence_url, subject, alt:{ro,ru} }. An item with origin_slot null is the type's
     origin: the picture is fetched and the slot's old file is replaced. An item with origin_slot
     set is a reuse under R-W28-06: no fetch, the slot takes the origin's file and declares
     reuse_of. Every other ledger row that stood on the replaced file (a category tile) follows it.
   - kind "gallery": { page, site, id, page_url, image_url, download_url, licence, licence_url,
     subject, alt:{ro,ru} }. Appended after the owner's photographs in content/galleries.json as
     full (1600) and thumb (600) WebP; a page listed under empty_folders gains its gallery.

   WHAT IT REFUSES. A licence that is not in R-W28-06's allowed set; a file host that is not the
   site's own; bytes that are not JPEG, PNG or WebP; a plan item for a catalogue slot that is not
   a fatade-group record (source.host fatade3d.md) or a tile standing on one; a gallery page the
   site does not build. Report only without --apply. Zero dependency. */

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');
const os = require('os');
const { encodeWebp, webpSize } = require('./webp-encode');

const ROOT = path.join(__dirname, '..');
const APPLY = process.argv.includes('--apply');
const PLAN = process.argv.filter((a) => !a.startsWith('--'))[2];
if (!PLAN) { console.error('usage: node scripts/intake-stock.js <plan.json> [--apply]'); process.exit(2); }
const die = (m) => { console.error(`\nINTAKE REFUSED: ${m}\n`); process.exit(1); };

const ALLOWED_LICENCES = {
  'Pexels License': { url: 'https://www.pexels.com/license/', hosts: ['images.pexels.com'], pages: ['www.pexels.com'] },
  'Unsplash License': { url: 'https://unsplash.com/license', hosts: ['images.unsplash.com', 'unsplash.com'], pages: ['unsplash.com'] },
  'Pixabay Content License': { url: 'https://pixabay.com/service/license-summary/', hosts: ['cdn.pixabay.com', 'pixabay.com'], pages: ['pixabay.com'] },
  'CC0 1.0': { url: 'https://creativecommons.org/publicdomain/zero/1.0/', hosts: ['upload.wikimedia.org'], pages: ['commons.wikimedia.org'] },
  'Public domain': { url: 'https://commons.wikimedia.org/wiki/Commons:Licensing#Material_in_the_public_domain', hosts: ['upload.wikimedia.org'], pages: ['commons.wikimedia.org'] },
};
const TODAY = new Date().toISOString().slice(0, 10);
/* Gate 30 reads bytes and escapes alike, so the four dash code points are built, not written. */
const DASH = new RegExp('[' + String.fromCharCode(0x2012) + '-' + String.fromCharCode(0x2015) + ']');
const STAGE = path.join(os.tmpdir(), 'rc-stock-stage');
fs.mkdirSync(STAGE, { recursive: true });
const hostOf = (u) => { try { return new URL(u).hostname; } catch { return null; } };

const plan = JSON.parse(fs.readFileSync(PLAN, 'utf8'));
const items = plan.items || [];
if (!items.length) die('the plan has no items');

const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/catalog-products.json'), 'utf8')).products;
const bySlot = new Map(products.map((p) => [p.slot, p]));
const ledgerPath = path.join(ROOT, 'docs/PHOTO-SLOTS-W24.json');
const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
const rowById = new Map(ledger.slots.map((r) => [r.id, r]));
const galPath = path.join(ROOT, 'content/galleries.json');
const galleries = JSON.parse(fs.readFileSync(galPath, 'utf8'));
const provPath = path.join(ROOT, 'docs/assets/PROVENANCE.md');
let prov = fs.readFileSync(provPath, 'utf8');
const srcPath = path.join(ROOT, 'docs/images/SOURCES.md');
const SRC_HEADER = '# Image sources · the owner\'s manifest of every stock picture (R-W28-06)\n\nOne row per picture file installed from the allowed stock set (Pexels, Unsplash, Pixabay, Wikimedia Commons CC0 or public domain). Written by `scripts/intake-stock.js`, held by gate 32 (`scripts/check-image-sources.js`): every stock picture under the fatade group and every stock gallery picture has a row here whose licence is in the allowed set. The same file also has its R-W row in `docs/assets/PROVENANCE.md`.\n\n| file | page | source URL | licence | subject |\n|---|---|---|---|---|\n';
let sources = fs.existsSync(srcPath) ? fs.readFileSync(srcPath, 'utf8') : SRC_HEADER;

const fetchBytes = (url, hops = 0) => new Promise((res, rej) => {
  if (hops > 5) return rej(new Error('too many redirects'));
  https.get(url, { headers: { 'user-agent': 'Mozilla/5.0 (rc-website intake; W28-23)' } }, (r) => {
    if ([301, 302, 303, 307, 308].includes(r.statusCode) && r.headers.location) { r.resume(); return res(fetchBytes(new URL(r.headers.location, url).href, hops + 1)); }
    if (r.statusCode !== 200) { r.resume(); return rej(new Error(`HTTP ${r.statusCode}`)); }
    const c = []; r.on('data', (x) => c.push(x)); r.on('end', () => res(Buffer.concat(c))); r.on('error', rej);
  }).on('error', rej);
});
const kindOf = (b) => (b[0] === 0xff && b[1] === 0xd8) ? 'jpg' : (b.readUInt32BE(0) === 0x89504e47) ? 'png' : (b.toString('latin1', 0, 4) === 'RIFF' && b.toString('latin1', 8, 12) === 'WEBP') ? 'webp' : null;
const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const sizeOf = (f) => { const s = webpSize(fs.readFileSync(f)); return s ? `${s.width}x${s.height}` : 'unreadable'; };
const provRow = (file, item, extra) => `| \`${file}\` | ${item.page_url} · ${item.image_url} · ${item.site} | stock library, ${item.licence}, R-W28-06, fetched from the site's own file host, viewed by independent viewers (no logo, brand, text, watermark, livery or identifiable face), encoded to WebP at most 1600 wide by scripts/webp-encode.js${extra || ''}, recorded in docs/images/SOURCES.md | ${item.licence_url} | ${TODAY} |`;
const srcRow = (file, page, item) => `| \`${file}\` | ${page} | ${item.page_url} · ${item.image_url} | ${item.licence} | ${(item.subject || '').replace(/\|/g, '/')} |`;
const removeProvRow = (file) => { const before = prov.length; prov = prov.split('\n').filter((l) => !l.startsWith('| `' + file + '`')).join('\n'); return prov.length !== before; };
const esc = (s) => String(s || '').replace(/\|/g, '/');

/* validation first, all of it, before anything is fetched or written */
const problems = [];
for (const it of items) {
  const lic = ALLOWED_LICENCES[it.licence];
  if (!lic) { problems.push(`${it.slot || it.page}: licence "${it.licence}" is not in the allowed set`); continue; }
  if (it.licence_url !== lic.url) problems.push(`${it.slot || it.page}: licence URL ${it.licence_url} is not ${lic.url}`);
  if (it.kind === 'catalog') {
    const rec = bySlot.get(it.slot); const row = rowById.get(it.slot);
    if (!row) problems.push(`${it.slot}: no ledger row`);
    if (!rec || !rec.source || rec.source.host !== 'fatade3d.md') problems.push(`${it.slot}: not a fatade-group record (R-W28-06 permits a stock picture on the fatade group only)`);
    if (!it.alt || !it.alt.ro || !it.alt.ru) problems.push(`${it.slot}: alt text missing in a locale`);
    if (it.origin_slot) { const o = items.find((x) => x.kind === 'catalog' && x.slot === it.origin_slot && !x.origin_slot); if (!o) problems.push(`${it.slot}: origin_slot ${it.origin_slot} is not an origin item of this plan`); }
    else { if (!it.download_url || !lic.hosts.includes(hostOf(it.download_url))) problems.push(`${it.slot}: download host ${hostOf(it.download_url)} is not the site's file host`); if (!lic.pages.includes(hostOf(it.page_url))) problems.push(`${it.slot}: page host ${hostOf(it.page_url)} is not the site`); }
  } else if (it.kind === 'gallery') {
    const g = galleries.galleries.find((x) => x.page === it.page); const e = galleries.empty_folders.find((x) => x.page === it.page);
    if (!g && !e) problems.push(`${it.page}: no gallery and no empty folder of that page in content/galleries.json`);
    if (!it.alt || !it.alt.ro || !it.alt.ru) problems.push(`${it.page} ${it.id}: alt text missing in a locale`);
    if (!it.download_url || !lic.hosts.includes(hostOf(it.download_url))) problems.push(`${it.page} ${it.id}: download host ${hostOf(it.download_url)} is not the site's file host`);
    if (!lic.pages.includes(hostOf(it.page_url))) problems.push(`${it.page} ${it.id}: page host ${hostOf(it.page_url)} is not the site`);
  } else problems.push(`item without a kind: ${JSON.stringify(it).slice(0, 80)}`);
  for (const s of [it.alt && it.alt.ro, it.alt && it.alt.ru, it.subject]) if (DASH.test(s || '')) problems.push(`${it.slot || it.page}: a dash in the alt or subject`);
}
if (problems.length) { console.error(`${problems.length} problem(s) in the plan:`); problems.forEach((p) => console.error('  ' + p)); process.exit(1); }

const catalog = items.filter((i) => i.kind === 'catalog'); const origins = catalog.filter((i) => !i.origin_slot); const reuses = catalog.filter((i) => i.origin_slot);
const gal = items.filter((i) => i.kind === 'gallery');
console.log(`plan: ${origins.length} catalogue origins, ${reuses.length} catalogue reuses, ${gal.length} gallery pictures${APPLY ? '' : ' (report only; --apply installs)'}`);
if (!APPLY) process.exit(0);

(async () => {
  /* 1. fetch and stage every picture that needs a file */
  const toEncode = []; const staged = new Map();
  for (const it of [...origins, ...gal]) {
    const key = `${it.site}-${it.id}`; let f = path.join(STAGE, key + '.bin');
    if (!fs.existsSync(f) || fs.statSync(f).size === 0) { let b; try { b = await fetchBytes(it.download_url); } catch (e) { die(`${key}: fetch failed: ${e.message}`); } if (!kindOf(b)) die(`${key}: bytes are not JPEG, PNG or WebP`); if (b.length > 25 * 1024 * 1024) die(`${key}: over 25MB`); fs.writeFileSync(f, b); }
    staged.set(key, f);
  }
  /* 2. encode: catalogue at most 1200 wide (the card paints 800), gallery full 1600 and thumb 600 */
  const enc = [];
  for (const it of origins) { const out = `public/img/catalog/${it.slot}.webp`; enc.push({ it, inp: staged.get(`${it.site}-${it.id}`), out, maxw: 1200, q: 0.82, role: 'catalog' }); }
  const nextIndex = {};
  for (const g of galleries.galleries) nextIndex[g.page] = g.photos.length;
  for (const e of galleries.empty_folders) nextIndex[e.page] = 0;
  for (const it of gal) { nextIndex[it.page] += 1; const n = String(nextIndex[it.page]).padStart(2, '0'); it._n = n; const full = `public/img/galerie/${it.page}/${n}.webp`, thumb = `public/img/galerie/${it.page}/${n}-t.webp`; enc.push({ it, inp: staged.get(`${it.site}-${it.id}`), out: full, maxw: 1600, q: 0.82, role: 'full' }); enc.push({ it, inp: staged.get(`${it.site}-${it.id}`), out: thumb, maxw: 600, q: 0.72, role: 'thumb' }); }
  for (const group of [[1200, 0.82], [1600, 0.82], [600, 0.72]]) {
    const batch = enc.filter((e) => e.maxw === group[0] && e.q === group[1]);
    if (!batch.length) continue;
    const rs = await encodeWebp(batch.map((e) => [e.inp, path.join(ROOT, e.out)]), { maxw: group[0], quality: group[1], quiet: true });
    rs.forEach((r, i) => { if (!r.ok) die(`${batch[i].out}: ${r.error}`); batch[i].result = r; });
  }
  /* 3. catalogue: replace the file, the ledger row, the provenance row; tiles follow */
  const replaced = [];
  for (const it of origins) {
    const row = rowById.get(it.slot); const old = row.provenance; const now = `public/img/catalog/${it.slot}.webp`;
    if (old !== now && fs.existsSync(path.join(ROOT, old))) { fs.unlinkSync(path.join(ROOT, old)); removeProvRow(old); }
    for (const r2 of ledger.slots) if (r2.id !== it.slot && r2.provenance === old) { r2.provenance = now; delete r2.watermark; }
    row.provenance = now; row.alt = { ro: it.alt.ro, ru: it.alt.ru }; delete row.watermark; delete row.label; delete row.reuse_of; delete row.reuse_reason;
    row.shows = `Fotografie generica de tip "${it.type}" (R-W28-06): ${it.subject}. A stat pe fatade3d.md pana la W28-23 (${old}).`;
    removeProvRow(now); prov = prov.trimEnd() + '\n' + provRow(now, it) + '\n';
    sources = sources.trimEnd() + '\n' + srcRow(now, row.page, it) + '\n';
    replaced.push({ slot: it.slot, old, now, ...it });
  }
  for (const it of reuses) {
    const o = origins.find((x) => x.slot === it.origin_slot); const row = rowById.get(it.slot); const old = row.provenance; const now = `public/img/catalog/${o.slot}.webp`;
    if (old !== now && fs.existsSync(path.join(ROOT, old)) && !ledger.slots.some((r2) => r2.id !== it.slot && r2.provenance === old)) { fs.unlinkSync(path.join(ROOT, old)); removeProvRow(old); }
    for (const r2 of ledger.slots) if (r2.id !== it.slot && r2.provenance === old && r2.reuse_of === it.slot) { r2.provenance = now; delete r2.watermark; }
    row.provenance = now; row.alt = { ro: it.alt.ro, ru: it.alt.ru }; delete row.watermark; delete row.label;
    row.reuse_of = o.slot; row.reuse_reason = `R-W28-06: a generic photograph of the product type "${it.type}" stands on every record of that type; the origin is ${o.slot}.`;
    row.shows = `Fotografie generica de tip "${it.type}" (R-W28-06), aceeasi ca ${o.slot}: ${o.subject}. A stat pe fatade3d.md pana la W28-23 (${old}).`;
    replaced.push({ slot: it.slot, old, now, ...it });
  }
  /* 4. galleries: append after the owner's photographs; an empty folder becomes a gallery */
  for (const it of gal) {
    let g = galleries.galleries.find((x) => x.page === it.page);
    if (!g) { const e = galleries.empty_folders.find((x) => x.page === it.page); g = { folder: e.folder, page: e.page, render_on: e.page, found: 0, installed: 0, preview: 1, photos: [], duplicates_skipped: [], refused: [] }; galleries.galleries.push(g); galleries.empty_folders = galleries.empty_folders.filter((x) => x.page !== it.page); }
    const full = `public/img/galerie/${it.page}/${it._n}.webp`, thumb = `public/img/galerie/${it.page}/${it._n}-t.webp`;
    g.photos.push({ source: `${it.site}:${it.id}`, sha256: sha(path.join(ROOT, full)), full, thumb, source_size: (() => { const r = enc.find((e) => e.it === it && e.role === 'full').result; return `${r.sourceWidth}x${r.sourceHeight}`; })(), size: sizeOf(path.join(ROOT, full)), thumb_size: sizeOf(path.join(ROOT, thumb)), origin: 'stock', licence: it.licence, licence_url: it.licence_url, source_url: it.page_url, image_url: it.image_url, subject: it.subject, alt: { ro: it.alt.ro, ru: it.alt.ru } });
    g.installed = g.photos.length;
    for (const f of [full, thumb]) { removeProvRow(f); prov = prov.trimEnd() + '\n' + provRow(f, it, f === thumb ? ' (the 600px thumbnail of the same picture)' : '') + '\n'; }
    sources = sources.trimEnd() + '\n' + srcRow(full, `/servicii/${it.page}/`, it) + '\n';
  }
  /* 5. write everything */
  fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2) + '\n');
  fs.writeFileSync(galPath, JSON.stringify(galleries, null, 1) + '\n');
  fs.writeFileSync(provPath, prov);
  fs.mkdirSync(path.dirname(srcPath), { recursive: true }); fs.writeFileSync(srcPath, sources);
  fs.writeFileSync(path.join(STAGE, 'last-run.json'), JSON.stringify({ date: TODAY, replaced, galleries: gal.map((i) => ({ page: i.page, n: i._n, id: i.id })) }, null, 1));
  console.log(`installed: ${origins.length} catalogue pictures (${reuses.length} reuses declared), ${gal.length} gallery pictures; provenance and sources rows written; ledger and galleries updated. Run: node build.js && node scripts/check-photo-slots-w24.js && node scripts/check-galleries.js && node scripts/check-image-sources.js && node scripts/gen-photo-review-w25.js && node scripts/check-asset-provenance.js`);
})().catch((e) => die(e.stack || e.message));
