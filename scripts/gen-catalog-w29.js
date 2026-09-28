#!/usr/bin/env node
/* W29-01, rulings R-W29-01 and R-W29-02. The catalogue data, generated from the capture.

   WHAT IT READS. docs/catalog/FATADE-CAPTURE-W29.json (the fatade3d.md catalogue as rendered on
   2026-09-28, one record per product per placement, in rendered order), content/catalog-ru-w29.json
   (the Russian fatade lacks, translated here) and the current content/catalog-products.json.

   WHAT IT WRITES.
   1. content/catalog-products.json: every fatade-group record takes the capture's name, variant
      line, price as shown, description, variants and specifications in both languages, its picture
      sources, and its placement in the same category, sub-category and ORDER as fatade3d.md. The
      61 hidden single-colour plates the Store API lists and the rendered catalogue does not (each
      answers 301 to its parent with the colour preselected) leave the catalogue: fatade3d.md shows
      27 plates, so this one does. Every other record (the Dasterum roofing group) is untouched.
   2. content/catalog.json: the category and sub-category labels, both languages, as fatade3d.md
      prints them (Placi flexibile becomes Placi ceramice), and the sub-category tile data (picture
      source, TOP badge).
   3. docs/catalog/FATADE-PARITY.json: the list the catalog-parity test holds the rendered site to.

   THE RULES IT APPLIES, each one a line in the dispatch or a standing rule:
   - Price as shown; a range whose low end is "0,00 lei" shows only the high value (W29-01).
   - "FATADE 3D" in a product name or text is dropped with the separator before it: docs/CLAUDE.md
     section 5 (W17-02) refuses the supplier's name as text on a catalogue page, and R-W29-01 lifts
     the rule for pictures only. Every such change is printed and listed in the parity file.
   - A description line that is only a URL (fatade embeds video links) is dropped.
   - RU from the capture where fatade has it; from content/catalog-ru-w29.json otherwise; a product
     with neither fails the run.

   Usage:  node scripts/gen-catalog-w29.js          write the three files
           node scripts/gen-catalog-w29.js --check  fail if the committed files differ from the output */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CHECK = process.argv.includes('--check');
const P = (f) => path.join(ROOT, f);
const fail = (m) => { console.error(`\nGEN-CATALOG-W29 FAILED: ${m}\n`); process.exit(1); };
const read = (f) => { try { return JSON.parse(fs.readFileSync(P(f), 'utf8')); } catch (e) { fail(`${f}: ${e.message}`); } };

const CAP = read('docs/catalog/FATADE-CAPTURE-W29.json');
const RU = read('content/catalog-ru-w29.json');
const DATA = read('content/catalog-products.json');
const CATALOG = read('content/catalog.json');
if (!Array.isArray(CAP.products) || !CAP.products.length) fail('the capture holds no products.');

/* fatade's category and sub-category names to this site's slugs. The slugs are the site's
   existing URLs, which do not move (the one rename is a label, Placi ceramice already had the
   slug placi-ceramice). */
const CAT = {
  'Sisteme de termoizolație': { slug: 'termoizolatie', i: 0, subs: {
    'Polistiren expandat': 'polistiren-expandat', 'Polistiren extrudat': 'polistiren-extrudat', 'Vată minerală': 'vata-minerala',
    'Adezivi și mase de șpaclu': 'adezivi-si-mase-de-spaclu', 'Alte produse': 'alte-produse' } },
  'Tencuieli decorative': { slug: 'tencuieli-decorative', i: 1 },
  'Plăci ceramice': { slug: 'placi-ceramice', i: 2 },
  'Elemente decorative': { slug: 'elemente-decorative', i: 3 },
  'Vopsele': { slug: 'vopsele', i: 4, subs: { 'Vopsele de exterior': 'vopsele-de-exterior', 'Vopsele de interior': 'vopsele-de-interior' } },
  'Sisteme de iluminare': { slug: 'sisteme-iluminare', i: 5 },
  'Alte materiale de construcții': { slug: 'alte-materiale', i: 6 },
};

const log = [];
const MARK = /\s*[-,]?\s*(?<![\w./])FA[ȚŢT]ADE\s*3\s*D\b(?!\.md)/gi;
const scrub = (s, where) => {
  if (s == null) return s;
  let t = String(s);
  if (MARK.test(t)) { const before = t; t = t.replace(MARK, ''); log.push({ where, before, after: t, why: 'supplier name refused as text on a catalogue page (docs/CLAUDE.md section 5, W17-02)' }); }
  MARK.lastIndex = 0;
  return t;
};
const noUrlLines = (s) => (s == null ? s : String(s).split('\n').filter((ln) => !/^\s*https?:\/\/\S+\s*$/.test(ln)).join('\n').replace(/\n{3,}/g, '\n\n').trim());
const txt = (s) => (s == null || String(s).trim() === '' ? null : String(s).trim());

/* The price: the source's string, with the one rule the dispatch adds. */
const priceOf = (shown) => {
  if (!txt(shown)) return null;
  const s = shown.trim();
  const m = s.match(/^0,00\s*lei\s*-\s*(.+)$/i);
  const render = m ? m[1].trim() : s;
  const nums = [...render.matchAll(/(\d{1,3}(?:\.\d{3})*,\d{2})/g)].map((x) => x[1]);
  return { shown: s, render, min: nums[0] || null, max: nums[nums.length - 1] || null };
};
const ruPrice = (roRender, ruShown) => {
  if (txt(ruShown)) { const p = priceOf(ruShown); return p.render; }
  return roRender.replace(/^De la\s+/i, 'от ').replace(/\s*\/\s*bucata\s*$/i, ' / шт.');
};

const byId = new Map(DATA.products.map((r) => [r.id, r]));
const placements = {};          // slug -> [ids] in rendered order
const parity = [];
const seen = new Set();
const ruOnlyUsed = new Set();

for (const c of CAP.products) {
  const cat = CAT[c.category_ro];
  if (!cat) fail(`the capture names a category this site does not have: "${c.category_ro}".`);
  let slug = cat.slug;
  if (c.subcategory_ro) {
    const sub = cat.subs && cat.subs[c.subcategory_ro];
    if (!sub) fail(`the capture names a sub-category "${c.subcategory_ro}" under "${c.category_ro}" this generator does not map.`);
    slug = `${cat.slug}/${sub}`;
  } else if (cat.subs) fail(`"${c.name_ro}" sits directly on "${c.category_ro}", which shows sub-category tiles only.`);
  const id = `f3d-${c.api_id}`;
  const r = byId.get(id);
  if (!r) fail(`${id} "${c.name_ro}" is in the capture and has no record; a new product needs a slot, add it by hand.`);
  (placements[slug] = placements[slug] || []).push(id);

  const where = `${id} ${c.name_ro}`;
  const ruOwn = RU.products[String(c.api_id)] || {};
  if (!txt(c.name_ru) && !txt(ruOwn.name) && c.category_ro !== 'Plăci ceramice') fail(`${where}: no Russian name on fatade3d.md and none in content/catalog-ru-w29.json.`);
  if (!txt(c.name_ru) && txt(ruOwn.name)) ruOnlyUsed.add(String(c.api_id));
  const nameRo = scrub(c.name_ro, `${where} name.ro`);
  const nameRu = scrub(txt(c.name_ru) || txt(ruOwn.name) || c.name_ro, `${where} name.ru`);
  const price = priceOf(c.price_text_ro);

  if (!seen.has(id)) {
    seen.add(id);
    r.name = { ro: nameRo, ru: nameRu };
    const vro = txt(c.variants_line_ro);
    const vru = txt(c.variants_line_ru) || txt(ruOwn.variant) || vro;
    if (vro) r.variant = { ro: vro, ru: vru }; else delete r.variant;
    if (price) {
      r.price = { min: price.min, max: price.max, source_display: price.shown, render: { ro: price.render, ru: ruPrice(price.render, c.price_text_ru_card) } };
    } else r.price = { min: null, max: null, source_display: null, render: null };
    const dro = scrub(noUrlLines(txt(c.description_ro) || txt(c.short_description_ro)), `${where} description.ro`);
    const druRaw = txt(c.description_ru) || txt(c.short_description_ru) || txt(ruOwn.description);
    const dru = scrub(noUrlLines(druRaw), `${where} description.ru`);
    if (dro && !dru) fail(`${where}: a Romanian description and no Russian one.`);
    if (dro) r.description = { ro: dro, ru: dru }; else delete r.description;
    /* Variants and specifications are stored per language as fatade3d.md prints each one: the
       Russian page often lists a different set (Dalmatina shows one size select in RU and two in
       RO), and pairing them by position would put a Russian label on the wrong value. Where the
       Russian page has none, the Romanian list is translated label by label. */
    const tAttr = (a) => { const t = RU.attributes[a]; if (!t) fail(`${where}: no Russian label for the variant attribute "${a}".`); return t; };
    const tSpec = (n) => { const t = RU.spec_names[n]; if (!t) fail(`${where}: no Russian label for the specification "${n}".`); return t; };
    const clean = (n) => String(n).replace(/:\s*$/, '').trim();
    const vRo = (c.variants || []).map((v) => ({ name: v.attribute, options: v.options }));
    const vRu = (c.variants_ru || []).length
      ? c.variants_ru.map((v) => ({ name: v.attribute, options: v.options }))
      : vRo.map((v) => ({ name: tAttr(v.name), options: v.options }));
    if (vRo.length) r.variants = { ro: vRo, ru: vRu }; else delete r.variants;
    const sRo = (c.specs_ro || []).map((x) => ({ name: clean(x.name), value: scrub(x.value, `${where} spec`) }));
    const sRu = (c.specs_ru || []).length
      ? c.specs_ru.map((x) => ({ name: clean(x.name), value: scrub(x.value, `${where} spec.ru`) }))
      : (c.specs_ro || []).map((x) => ({ name: clean(tSpec(x.name)), value: scrub(RU.spec_values[x.value] || x.value, `${where} spec.ru`) }));
    if (sRo.length) r.specs = { ro: sRo, ru: sRu }; else delete r.specs;
    /* The logo fatade prints on the card, when it prints one and it is a manufacturer's: the
       supplier's own "Fatade3D" logo would put its name on the card, which section 5 refuses. */
    if (txt(c.brand_logo) && !/fatade/i.test(c.brand || '')) r.brand_logo_src = c.brand_logo; else delete r.brand_logo_src;
    const imgs = [c.card_image, ...(c.images || [])].filter(Boolean);
    r.images_src = [...new Set(imgs)];
    r.source = { host: 'fatade3d.md', id: c.api_id, url: c.url_ro, ru_url: c.url_ru || null, name: c.name_ro, ru_name: c.name_ru || null, brand: c.brand || null, captured: '2026-09-28' };
    r.categories = [slug];
    /* The page URL takes fatade's slug, less the supplier's name where fatade put it in (section 5). */
    if (/-?fatade-3d\b/.test(r.slug)) { const before = r.slug; r.slug = r.slug.replace(/-?fatade-3d\b/g, '').replace(/--+/g, '-').replace(/^-|-$/g, ''); log.push({ where: `${where} slug`, before, after: r.slug, why: 'supplier name dropped from the page URL (docs/CLAUDE.md section 5)' }); }
  } else {
    r.categories.push(slug);
  }
  parity.push({
    order: c.order, category: c.category_ro, subcategory: c.subcategory_ro || null, slug,
    name: c.name_ro, ...(nameRo !== c.name_ro ? { name_rc: nameRo, name_rc_reason: 'supplier name dropped from the product name (docs/CLAUDE.md section 5, W17-02)' } : {}),
    price_shown: c.price_text_ro || null, price_rc: price ? price.render : null,
    image_source_url: c.card_image || null, fatade_url: c.url_ro, id,
  });
}

/* The edits content/catalog-ru-w29.json lists, each with its reason: a phrase the catalogue's standing
   prohibitions refuse (a stock or availability claim) or that only reads like one. Each must match
   exactly once, so an edit that stops applying fails rather than lingering. */
for (const e of RU.edits || []) {
  const r = byId.get(e.id);
  const [f, lc] = e.field.split('.');
  const cur = r && r[f] && r[f][lc];
  if (!cur || cur.split(e.from).length !== 2) fail(`the edit on ${e.id} ${e.field} does not match "${e.from}" exactly once.`);
  r[f][lc] = cur.replace(e.from, e.to);
  log.push({ where: `${e.id} ${e.field}`, before: e.from, after: e.to, why: e.why });
}

/* The parents with sub-categories list the union of their children in tile order, for the counts. */
for (const cat of Object.values(CAT)) {
  if (!cat.subs) continue;
  const u = [];
  for (const sub of Object.values(cat.subs)) for (const id of placements[`${cat.slug}/${sub}`] || []) if (!u.includes(id)) u.push(id);
  placements[cat.slug] = u;
}

/* The records that leave: in the fatade group and in no placement. */
const dropped = DATA.products.filter((r) => r.source && r.source.host === 'fatade3d.md' && !seen.has(r.id));
const keepIds = new Set(DATA.products.filter((r) => !dropped.includes(r)).map((r) => r.id));
const OUT = JSON.parse(JSON.stringify(DATA));
OUT.products = DATA.products.filter((r) => keepIds.has(r.id));
const fatadeSlugs = new Set(Object.values(CAT).flatMap((c) => [c.slug, ...Object.values(c.subs || {}).map((s) => `${c.slug}/${s}`)]));
for (const k of Object.keys(OUT.categories)) if (fatadeSlugs.has(k)) delete OUT.categories[k];
const ordered = {};
for (const k of [...fatadeSlugs]) ordered[k] = placements[k] || [];
OUT.categories = { ...ordered, ...OUT.categories };
OUT.capture = { ...DATA.capture, w29: { source: 'fatade3d.md', date: '2026-09-28', method: 'docs/catalog/FATADE-CAPTURE-W29.json, generated by scripts/gen-catalog-w29.js', ruling: 'R-W29-01, R-W29-02', products: seen.size, placements: parity.length, dropped: dropped.length } };

/* content/catalog.json: the labels, as fatade prints them, and the tile data. */
const tree = CAP.tree.menu;
const CAT_OUT = JSON.parse(JSON.stringify(CATALOG));
for (const t of tree) {
  const cat = CAT[t.name_ro];
  if (!cat) fail(`the captured menu names "${t.name_ro}", which this generator does not map.`);
  const e = CAT_OUT.categories[cat.i];
  e.label = { ro: t.name_ro, ru: t.name_ru };
  e.fatade = { url: t.url_ro, ru_url: t.url_ru, image_src: t.image, top: /^top$/i.test(t.badge || '') };
  for (const s of t.subcategories || []) {
    const sub = cat.subs && cat.subs[s.name_ro];
    if (!sub) fail(`the captured menu names the sub-category "${s.name_ro}" under "${t.name_ro}", unmapped.`);
    const kid = (e.children || []).find((k) => k.href && k.href.ro === `/catalog/${cat.slug}/${sub}/`);
    if (!kid) fail(`content/catalog.json has no child /catalog/${cat.slug}/${sub}/.`);
    kid.label = { ro: s.name_ro, ru: s.name_ru };
    kid.fatade = { url: s.url_ro, ru_url: s.url_ru, image_src: s.image, top: /^top$/i.test(s.badge || ''), order: s.tile_order };
  }
  const want = Object.values(cat.subs || {});
  const have = (e.children || []).map((k) => k.href.ro.split('/')[3]);
  if (JSON.stringify(want) !== JSON.stringify(have)) fail(`${cat.slug}: sub-category order ${have.join(', ')} is not fatade's ${want.join(', ')}.`);
}

const PAR = {
  _note: 'W29-01. What the catalog-parity test (scripts/check-catalog-parity.js) holds the rendered catalogue to: every product fatade3d.md renders in its Catalog, in the same category, sub-category and order, with the price as shown and the price this site shows under the dispatch rule, and the picture source. Generated by scripts/gen-catalog-w29.js from docs/catalog/FATADE-CAPTURE-W29.json; never typed. A name this site prints differently carries name_rc and the reason.',
  captured: CAP.captured, source: 'fatade3d.md', placements: parity.length, products: seen.size,
  /* Re-runnable: on a run over data this script already wrote, the dropped records are gone from it,
     so the list carries over from the committed parity file rather than silently emptying. */
  dropped_from_this_site: (() => {
    const prev = fs.existsSync(P('docs/catalog/FATADE-PARITY.json')) ? (read('docs/catalog/FATADE-PARITY.json').dropped_from_this_site || []) : [];
    const now = dropped.map((r) => ({ id: r.id, name: r.name.ro, why: 'hidden single-colour product on fatade3d.md (301 to its parent with the colour preselected), not in the rendered catalogue' }));
    const ids = new Set(now.map((d) => d.id));
    return [...now, ...prev.filter((d) => !ids.has(d.id))];
  })(),
  items: parity,
};

/* content/plate-brand-settlement.json holds one row per plate (gate 23); the plates that left the
   catalogue take their rows with them, so the settlement and the records keep agreeing. */
const SETTLE = read('content/plate-brand-settlement.json');
const plateSlots = new Set(OUT.products.filter((r) => (r.categories || []).includes('placi-ceramice')).map((r) => r.slot));
const settledBefore = SETTLE.settled.length;
SETTLE.settled = SETTLE.settled.filter((x) => plateSlots.has(x.slot));
console.log(`plate settlement: ${SETTLE.settled.length} rows kept of ${settledBefore}`);

const outs = [
  ['content/plate-brand-settlement.json', JSON.stringify(SETTLE, null, 2) + '\n'],
  ['content/catalog-products.json', JSON.stringify(OUT, null, 2) + '\n'],
  ['content/catalog.json', JSON.stringify(CAT_OUT, null, 2) + '\n'],
  ['docs/catalog/FATADE-PARITY.json', JSON.stringify(PAR, null, 1) + '\n'],
];
let stale = 0;
for (const [f, body] of outs) {
  const cur = fs.existsSync(P(f)) ? fs.readFileSync(P(f), 'utf8') : null;
  if (CHECK) { if (cur !== body) { stale++; console.error(`  stale: ${f}`); } }
  else fs.writeFileSync(P(f), body);
}
console.log(`capture: ${CAP.products.length} placements, ${seen.size} products; dropped ${dropped.length} records; RU from content/catalog-ru-w29.json for ${ruOnlyUsed.size} products`);
for (const [k, v] of Object.entries(ordered)) console.log(`  ${k}: ${v.length}`);
console.log(`text changes under section 5: ${log.length}`);
for (const x of log) console.log(`  ${x.where}: "${x.before.slice(0, 80)}" -> "${x.after.slice(0, 80)}"`);
if (CHECK && stale) fail(`${stale} file(s) differ from what the capture generates. Run node scripts/gen-catalog-w29.js.`);
