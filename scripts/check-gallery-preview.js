#!/usr/bin/env node
/* gallery-preview-distinct, card W29-03 (wave 29), ruling R-W29-03: "Gallery preview image must differ
   from every described-item image in the same gallery." Run by `quality` on every pull request.

   WHAT IT READS. Every built service page, both locales, found by walking dist/servicii/ and
   dist/ru/servicii/, not listed, so a new service page is read the day it is built. On each page
   that carries the "Deschide galeria" card (`.gal-card`), the preview picture is compared with every
   DESCRIBED card in the same grid: a card with a heading and a description (a project), which is
   everything in that grid except the gallery card itself.

   TWO ASSERTIONS, and the second is the one that matters.
   1. The preview's `src` is not the `src` of any described card. This is the dispatch's wording.
   2. The preview is not the same PHOTOGRAPH as any described card. A project cover and a gallery
      photograph are separate files cut from the same original by two different pipelines
      (`process-photos.js` and `intake-galleries.js`), so the same picture arrives under two names at
      two crops and sizes, and a comparison of names never sees it: on `main` before W29-03 the
      Terasamente preview was the "Radier armat" cover's own photograph under another file. Chrome
      draws both pictures in grey, looks for one inside the other as a window at twelve scales and
      289 positions, and takes the best normalised correlation; at or above SAME they are one
      photograph. Calibrated on every gallery photograph against every cover on 2026-09-28: the
      identical pairs read 0.96 to 0.99, different photographs of different subjects 0.27 to 0.80.
      A second SHOT of the same facade (Fatade photo 3 against the "placi mari de piatra" cover, 0.84)
      sits under SAME on purpose: it is a judgement a person makes, recorded in DECISIONS.md W29-03,
      and a machine floor set that low would also fire on unrelated roofs photographed from a drone.

   THE BUTTON. The same card must read as a button (W29-03's first half): an orange filled body with
   white bold text, a gallery icon, the photo count, the whole card one link, and a darker fill on
   hover. Each of those is read from computed style, so a class renamed away from the rule fails here.

   IT NEVER PASSES ON NOTHING. It fails on no dist/, on either locale with no service page, on zero
   gallery cards, on a preview image that does not load, and on a page count that differs between the
   locales.

   ITS SELF-TEST RUNS FIRST (R-AB), on synthetic pages it serves itself using real pictures from
   public/img: a control (preview and covers all different photographs) must pass; a RED arm with the
   preview's src equal to a cover's src must fail assertion 1; a RED arm with the real pair this card
   fixed (the Terasamente gallery photograph 07 against the `proj-terasamente-03-cover` file, one
   photograph through two pipelines at two crops) must fail assertion 2 and not assertion 1; then the
   control again.

   Usage:  node build.js && node scripts/check-gallery-preview.js [--report]
   --report prints every page's preview, its closest described picture and the distance, pass or fail.
   Chrome: CHROME_BIN if set, else the usual install paths; never a silent skip. */
const fs = require('fs');
const path = require('path');
const { open, sleep } = require('./lib/headless');

const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2);
const REPORT = args.includes('--report');
const DIST = path.resolve(args.find((a) => !a.startsWith('--')) || path.join(ROOT, 'dist'));
const SAME = 0.9;  // normalised correlation at or above which two pictures are one photograph; see the header
const fail = (msg) => { console.error(`\nGALLERY PREVIEW TEST FAILED: ${msg}\n`); process.exit(1); };
if (!fs.existsSync(DIST)) fail(`${DIST} is missing. Run node build.js first.`);

const pagesUnder = (rel) => {
  const d = path.join(DIST, rel);
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d, { withFileTypes: true }).filter((e) => e.isDirectory() && fs.existsSync(path.join(d, e.name, 'index.html')))
    .filter((e) => !/http-equiv=["']?refresh/i.test(fs.readFileSync(path.join(d, e.name, 'index.html'), 'utf8')))
    .map((e) => `/${rel}/${e.name}/`.replace(/\/+/g, '/'));
};
const RO = pagesUnder('servicii'), RU = pagesUnder('ru/servicii');
if (!RO.length || !RU.length) fail(`service pages read: ${RO.length} RO, ${RU.length} RU; both locales must have some.`);
if (RO.length !== RU.length) fail(`${RO.length} RO service pages against ${RU.length} RU; the locales must match.`);
const PAGES = [...RO, ...RU];

/* In the page: the gallery card's preview and the described cards of its grid, each scored. */
const PROBE = `(async () => {
  document.querySelectorAll('[data-reveal]').forEach((n) => n.classList.add('is-revealed'));
  const gal = document.querySelector('.gal-card');
  if (!gal) return { none: true };
  const grid = gal.parentElement;
  const described = [...grid.children].filter((c) => c !== gal && c.querySelector('h3') && c.querySelector('p') && c.querySelector('img'));
  const load = (src) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });
  /* The same photograph cut two ways. Each picture is drawn once in grey (A at 256 wide, B at 32
     wide), B's whole frame is looked for inside A as a window of B's aspect at twelve scales and
     seventeen by seventeen positions, sampled from A's grey copy, and the best normalised
     correlation of the window against B is the score; both directions are tried, because either
     file can be the tighter crop. 1 is the same pixels, a different photograph scores low. */
  const grey = (im, W) => {
    const H = Math.max(8, Math.round(W * im.naturalHeight / im.naturalWidth));
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d', { willReadFrequently: true });
    x.filter = 'grayscale(1)'; x.drawImage(im, 0, 0, W, H);
    const d = x.getImageData(0, 0, W, H).data, v = new Float32Array(W * H);
    for (let k = 0; k < W * H; k++) v[k] = d[k * 4];
    return { v, W, H };
  };
  const norm = (v) => { let m = 0; for (const t of v) m += t; m /= v.length; let q = 0; for (let k = 0; k < v.length; k++) { v[k] -= m; q += v[k] * v[k]; } q = Math.sqrt(q) || 1; for (let k = 0; k < v.length; k++) v[k] /= q; return v; };
  const find = (A, B) => {
    const a = grey(A, 256), b = grey(B, 32), bv = norm(b.v), ar = b.W / b.H, win = new Float32Array(b.W * b.H);
    /* An integral image of A, so each window pixel is the MEAN of the cell of A it covers, the way
       a canvas scales a picture down; a single sample per cell reads the same photograph as noise. */
    const I = new Float64Array((a.W + 1) * (a.H + 1));
    for (let y = 0; y < a.H; y++) { let row = 0; for (let x = 0; x < a.W; x++) { row += a.v[y * a.W + x]; I[(y + 1) * (a.W + 1) + x + 1] = I[y * (a.W + 1) + x + 1] + row; } }
    const box = (x0, y0, x1, y1) => {
      const X0 = Math.max(0, Math.floor(x0)), Y0 = Math.max(0, Math.floor(y0));
      const X1 = Math.min(a.W, Math.max(X0 + 1, Math.round(x1))), Y1 = Math.min(a.H, Math.max(Y0 + 1, Math.round(y1)));
      const W1 = a.W + 1;
      return (I[Y1 * W1 + X1] - I[Y0 * W1 + X1] - I[Y1 * W1 + X0] + I[Y0 * W1 + X0]) / ((X1 - X0) * (Y1 - Y0));
    };
    let best = -1;
    for (let s = 1; s >= 0.44; s -= 0.05) {
      let w = a.W * s, h = w / ar;
      if (h > a.H * s) { h = a.H * s; w = h * ar; }
      const cw = w / b.W, ch = h / b.H;
      for (let i = 0; i <= 16; i++) for (let j = 0; j <= 16; j++) {
        const x0 = (a.W - w) * i / 16, y0 = (a.H - h) * j / 16;
        for (let yy = 0; yy < b.H; yy++) for (let xx = 0; xx < b.W; xx++) {
          win[yy * b.W + xx] = box(x0 + xx * cw, y0 + yy * ch, x0 + (xx + 1) * cw, y0 + (yy + 1) * ch);
        }
        const wv = norm(win);
        let c = 0; for (let k = 0; k < wv.length; k++) c += wv[k] * bv[k];
        if (c > best) best = c;
      }
    }
    return best;
  };
  const same = (A, B) => Math.round(Math.max(find(A, B), find(B, A)) * 1000) / 1000;
  const pimg = gal.querySelector('img');
  const cs = getComputedStyle(gal), body = gal.querySelector('.card__body') || gal;
  const bcs = getComputedStyle(body), h = gal.querySelector('h3, .gal-card__label') || body;
  const hcs = getComputedStyle(h);
  const out = {
    preview: { src: pimg ? pimg.currentSrc || pimg.src : null, loaded: false },
    described: [],
    button: {
      tag: gal.tagName.toLowerCase(), href: gal.getAttribute('href'),
      bodyBg: bcs.backgroundColor, cardBg: cs.backgroundColor, color: hcs.color, weight: hcs.fontWeight,
      icon: !!gal.querySelector('svg'), text: (gal.textContent || '').replace(/\\s+/g, ' ').trim(),
      nested: gal.querySelectorAll('a[href], button').length,
    },
  };
  const P = pimg ? await load(pimg.currentSrc || pimg.src) : null;
  out.preview.loaded = !!(P && P.naturalWidth);
  for (const c of described) {
    const im = c.querySelector('img');
    const src = im.currentSrc || im.src;
    const D = await load(src);
    const ok = !!(D && D.naturalWidth);
    out.described.push({ title: c.querySelector('h3').textContent.trim().slice(0, 50), src, loaded: ok, n: ok && out.preview.loaded ? same(P, D) : null });
  }
  return out;
})()`;
const HOVER = `(() => { const g = document.querySelector('.gal-card'); const b = g.querySelector('.card__body') || g; return getComputedStyle(b).backgroundColor; })()`;
const file = (u) => { try { return new URL(u).pathname; } catch { return u; } };

function judge(page, r) {
  const errs = [];
  if (!r.preview.src) { errs.push('the gallery card has no preview picture'); return { errs }; }
  if (!r.preview.loaded) errs.push(`the preview ${file(r.preview.src)} did not load`);
  let closest = null;
  for (const d of r.described) {
    if (file(d.src) === file(r.preview.src)) errs.push(`the preview ${file(r.preview.src)} is the same file as the described card "${d.title}"`);
    if (!d.loaded) { errs.push(`the described picture ${file(d.src)} did not load`); continue; }
    if (r.preview.loaded) {
      const n = d.n;
      if (!closest || n > closest.n) closest = { n, d };
      if (n >= SAME) errs.push(`the preview ${file(r.preview.src)} is the same photograph as "${d.title}" (${file(d.src)}), correlation ${n}, at or above ${SAME}`);
    }
  }
  return { errs, closest };
}

/* Self-test pages, built from real files so the comparison runs on photographs. */
const REAL_PAIR = { preview: '/img/galerie/terasamente/07-t.jpg', cover: '/img/proj-terasamente-03-cover.jpg' };
const OTHERS = ['/img/galerie/acoperisuri/02-t.jpg', '/img/galerie/instalatii/03-t.jpg', '/img/galerie/finisaje/03-t.jpg'];
for (const f of [REAL_PAIR.preview, REAL_PAIR.cover, ...OTHERS]) if (!fs.existsSync(path.join(DIST, f))) fail(`the self-test needs ${f} in the built tree.`);
const shell = (preview, covers) => '<!doctype html><html lang="ro"><head><meta charset="utf-8"><title>t</title></head><body><div class="grid">'
  + covers.map((c, i) => `<article class="card"><img src="${c}" alt=""><h3>Proiect ${i + 1}</h3><p>Descriere.</p></article>`).join('')
  + `<a class="card gal-card" href="#lbx"><img src="${preview}" alt=""><div class="card__body"><h3>Deschide galeria</h3></div></a></div></body></html>`;
const ROUTES = {
  '/__gp-control__/': () => shell(REAL_PAIR.preview, OTHERS),
  '/__gp-same-src__/': () => shell(OTHERS[0], [OTHERS[0], OTHERS[1]]),
  '/__gp-same-photo__/': () => shell(REAL_PAIR.preview, [REAL_PAIR.cover, OTHERS[1]]),
};

async function main() {
  const { cdp, base, close, browser } = await open({ tag: 'gallery-preview', dist: DIST, cdpPort: Number(process.env.GP_CDP_PORT || 9463), httpPort: Number(process.env.GP_HTTP_PORT || 8773), routes: ROUTES, fail });
  const bail = (m) => { close(); fail(m); };
  console.log(`chrome: ${browser}`);
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

  /* --- self-test -------------------------------------------------------------- */
  const run = async (u) => { await cdp.goto(base + u); return cdp.ev(PROBE); };
  const control = async (when) => { const r = judge('control', await run('/__gp-control__/')); if (r.errs.length) bail(`self-test control ${when} the arms failed: ${r.errs.join('; ')}`); return r.closest.n; };
  const c0 = await control('before');
  const s1 = judge('same-src', await run('/__gp-same-src__/'));
  if (!s1.errs.some((e) => /same file/.test(e))) bail('self-test RED arm "preview src equals a cover src" was not caught.');
  const s2 = judge('same-photo', await run('/__gp-same-photo__/'));
  if (!s2.errs.some((e) => /same photograph/.test(e))) bail(`self-test RED arm "same photograph, different file" was not caught (closest ${s2.closest && s2.closest.n}).`);
  if (s2.errs.some((e) => /same file/.test(e))) bail('self-test RED arm "same photograph, different file" fired on the file name, so assertion 2 was not what caught it.');
  await control('after');
  console.log(`self-test: control clean before and after (closest different photograph ${c0}); RED "same src" caught; RED "same photograph, different file" caught at ${s2.closest.n}\n`);

  /* --- the real run ---------------------------------------------------------- */
  const problems = [], rows = [];
  let withGallery = 0;
  for (const page of PAGES) {
    const r = await run(page);
    if (r.none) { rows.push({ page, note: 'no gallery card' }); continue; }
    withGallery++;
    const j = judge(page, r);
    for (const e of j.errs) problems.push(`${page}: ${e}`);
    /* The button half of the card. */
    const b = r.button;
    if (b.tag !== 'a' || !b.href) problems.push(`${page}: the gallery card is a <${b.tag}>${b.href ? '' : ' with no href'}, not one link`);
    if (b.nested) problems.push(`${page}: the gallery card holds ${b.nested} interactive element(s) inside its link`);
    if (b.bodyBg !== 'rgb(246, 83, 8)') problems.push(`${page}: the gallery card's label is on ${b.bodyBg}, not the brand orange rgb(246, 83, 8)`);
    if (b.color !== 'rgb(255, 255, 255)') problems.push(`${page}: the gallery card's label is ${b.color}, not white`);
    if (Number(b.weight) < 700) problems.push(`${page}: the gallery card's label weight is ${b.weight}, not bold`);
    if (!b.icon) problems.push(`${page}: the gallery card carries no icon`);
    const n = await cdp.ev(`document.querySelectorAll('.lbx__slide').length`).catch(() => 0);
    const m = b.text.match(/\((\d+)\s/);
    if (!m) problems.push(`${page}: the gallery card shows no photo count "(N ...)": "${b.text}"`);
    else if (n && Number(m[1]) !== n) problems.push(`${page}: the card says ${m[1]} photographs, the gallery holds ${n}`);
    /* Hover: a real pointer over the card, and the fill must darken. */
    const at = await cdp.ev(`(() => { const g = document.querySelector('.gal-card'); g.scrollIntoView({ block: 'center', behavior: 'instant' }); const r = g.getBoundingClientRect(); return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) }; })()`);
    await sleep(300);
    await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: at.x, y: at.y });
    await sleep(450);
    const hov = await cdp.ev(HOVER);
    await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 1, y: 1 });
    const lum = (s) => { const v = (s.match(/\d+(\.\d+)?/g) || []).slice(0, 3).map(Number); return v.length === 3 ? 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2] : null; };
    if (!(lum(hov) < lum(b.bodyBg))) problems.push(`${page}: on hover the gallery card's fill is ${hov}, not darker than ${b.bodyBg}`);
    rows.push({ page, preview: file(r.preview.src), closest: j.closest ? `${j.closest.n} to "${j.closest.d.title}"` : 'no described card in the grid', described: r.described.length });
  }
  close();
  if (REPORT || problems.length) for (const r of rows) console.log(`  ${r.page}  ${r.note || `preview ${r.preview}; ${r.described} described; closest ${r.closest}`}`);
  if (!withGallery) fail('no service page carries a gallery card, so nothing was compared.');
  if (problems.length) {
    console.error(`\nGALLERY PREVIEW TEST FAILED: ${problems.length} problem(s)`);
    for (const p of problems) console.error(`  ${p}`);
    process.exit(1);
  }
  console.log(`\n${PAGES.length} service pages read (${RO.length} RO, ${RU.length} RU), ${withGallery} with a gallery card: every preview is a different file and a different photograph from every described card, and every card reads as an orange button with its count.`);
}

main().catch((e) => fail(e && e.stack ? e.stack : String(e)));
