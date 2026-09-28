#!/usr/bin/env node
/* catalog-structure, card W29-01 (wave 29), rulings R-W29-01 and R-W29-02. Run by `quality`.

   THE OWNER'S TREE, verbatim from the dispatch: "Sisteme de termoizolatie -> Polistiren expandat,
   Polistiren extrudat, Vata minerala, Adezivi si mase de spaclu, Alte produse; Tencuieli decorative;
   Placi ceramice (rename our Placi flexibile to this); Elemente decorative; Vopsele -> Vopsele de
   exterior, Vopsele de interior; Sisteme de iluminare; Alte materiale de constructii; plus our
   Acoperisuri and Garduri. Hub tile count stays 9." The names are held as the site prints them, with
   their diacritics, and the Russian names as fatade3d.md's own language switcher prints them
   (docs/catalog/FATADE-CAPTURE-W29.json).

   WHAT IT READS, both locales, from the built tree (static, no browser):
   1. The Catalog menu in the header of the catalogue index: the seven fatade categories in the
      owner's order (Acoperisuri and Garduri may sit anywhere among them, Q-W29-05), each with its
      sub-categories in order under it, and nothing else.
   2. The catalogue index: nine tiles, the same nine names.
   3. Each parent with sub-categories: its sub-category tiles in order, each opening its own page,
      and no product grid (level b). Each category without sub-categories: a product grid.
   4. Each sub-category page: the breadcrumb Acasa / Catalog / Category / Sub-category and a grid.
   5. "Placi flexibile" appears on no built page as a name (the rename); the category's authored
      paragraphs, which describe the material, are not a name and are not read for it.

   IT NEVER PASSES ON NOTHING: it fails on no dist/, a missing page and a menu it cannot find. Its
   self-test runs first on synthetic pages (R-AB): a control, a sub-category missing from the menu,
   two tiles in the wrong order, a wrong Russian label, and the old name left on a page; each arm
   must fail on its own message. Usage: node build.js && node scripts/check-catalog-structure.js */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.resolve(process.argv[2] || path.join(ROOT, 'dist'));
const fail = (m) => { console.error(`\nCATALOG STRUCTURE FAILED: ${m}\n`); process.exit(1); };

const TREE = [
  { slug: 'termoizolatie', ro: 'Sisteme de termoizolație', ru: 'Системы теплоизоляции', subs: [
    { slug: 'polistiren-expandat', ro: 'Polistiren expandat', ru: 'Вспененный полистирол' },
    { slug: 'polistiren-extrudat', ro: 'Polistiren extrudat', ru: 'Экструдированный полистирол' },
    { slug: 'vata-minerala', ro: 'Vată minerală', ru: 'Минеральная вата' },
    { slug: 'adezivi-si-mase-de-spaclu', ro: 'Adezivi și mase de șpaclu', ru: 'Клеи и шпатлевочные массы' },
    { slug: 'alte-produse', ro: 'Alte produse', ru: 'Другие продукты' }] },
  { slug: 'tencuieli-decorative', ro: 'Tencuieli decorative', ru: 'Декоративные штукатурки', subs: [] },
  { slug: 'placi-ceramice', ro: 'Plăci ceramice', ru: 'Керамическая плитка', subs: [] },
  { slug: 'elemente-decorative', ro: 'Elemente decorative', ru: 'Декоративные элементы', subs: [] },
  { slug: 'vopsele', ro: 'Vopsele', ru: 'Краски', subs: [
    { slug: 'vopsele-de-exterior', ro: 'Vopsele de exterior', ru: 'Краски для наружных работ' },
    { slug: 'vopsele-de-interior', ro: 'Vopsele de interior', ru: 'Краски для интерьера' }] },
  { slug: 'sisteme-iluminare', ro: 'Sisteme de iluminare', ru: 'Системы освещения', subs: [] },
  { slug: 'alte-materiale', ro: 'Alte materiale de construcții', ru: 'Другие строительные материалы', subs: [] },
];
const OURS = [{ ro: 'Acoperișuri', ru: 'Кровля' }, { ro: 'Garduri', ru: 'Заборы' }];
const ROOTS = { ro: '/catalog/', ru: '/ru/catalog/' };
const OLD_NAME = /Plăci flexibile|Гибкая плитка/;

const decode = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();

/* The menu, read as a tree: a small nesting-aware walk over ul, li and a tags from the top list, so
   a row's sub-list is whatever ul sits inside that row's li (the title row, which repeats the
   category's name as the flyout heading, is left out). */
function readMenu(html) {
  const a = html.indexOf('class="catalog__list catalog__list--top"');
  if (a < 0) return null;
  const start = html.lastIndexOf('<ul', a);
  const tok = /<(\/?)(ul|li|a)\b([^>]*)>|([^<]+)/g;
  tok.lastIndex = start;
  const root = { kids: [], cls: 'root' };
  const stack = [root];
  let inA = null, depthUl = 0, m;
  while ((m = tok.exec(html))) {
    const [, close, tag, attrs, text] = m;
    const top = stack[stack.length - 1];
    if (text != null) { if (inA) inA.text += text; continue; }
    if (tag === 'a') { if (close) { inA = null; } else { const node = { tag: 'a', href: (attrs.match(/href="([^"]*)"/) || [])[1], text: '' }; top.a = top.a || node; inA = node; } continue; }
    if (!close) { const node = { tag, cls: (attrs.match(/class="([^"]*)"/) || [])[1] || '', kids: [] }; top.kids.push(node); stack.push(node); if (tag === 'ul') depthUl++; }
    else { stack.pop(); if (tag === 'ul') { depthUl--; if (depthUl === 0) break; } }
  }
  const topUl = root.kids[0];
  if (!topUl) return null;
  const subOf = (li) => { const ul = []; const find = (n) => n.kids.forEach((k) => { if (k.tag === 'ul') ul.push(k); else find(k); }); find(li); return ul[0] ? ul[0].kids.filter((x) => x.tag === 'li' && !/catalog__row--title/.test(x.cls)).map((x) => ({ href: x.a && x.a.href, name: decode(x.a ? x.a.text : '') })) : []; };
  return topUl.kids.filter((x) => x.tag === 'li').map((li) => ({ href: li.a && li.a.href, name: decode(li.a ? li.a.text : ''), sub: subOf(li) }));
}
const readSubTiles = (html) => [...html.matchAll(/<a class="subcat__link" href="([^"]+)">[\s\S]*?<h3 class="subcat__name">([^<]*)<\/h3>/g)].map((m) => ({ href: m[1], name: decode(m[2]) }));
const hasGrid = (html) => /class="prod-grid"/.test(html) && /data-product-card/.test(html);
const crumbs = (html) => { const m = html.match(/<nav class="breadcrumb"[^>]*>([\s\S]*?)<\/nav>/); return m ? [...m[1].matchAll(/<(?:a|span)[^>]*>([^<]+)<\/(?:a|span)>/g)].map((x) => decode(x[1])).filter((t) => t !== '/') : []; };

function check(read) {
  const problems = [];
  for (const lc of ['ro', 'ru']) {
    const root = ROOTS[lc];
    const idx = read(root);
    if (!idx) { problems.push(`${lc}: the catalogue index ${root} is missing`); continue; }
    const menu = readMenu(idx);
    if (!menu) { problems.push(`${lc}: no Catalog menu on ${root}`); continue; }
    const fatadeRows = menu.filter((r) => TREE.some((t) => t[lc] === r.name));
    const want = TREE.map((t) => t[lc]);
    if (JSON.stringify(fatadeRows.map((r) => r.name)) !== JSON.stringify(want)) problems.push(`${lc}: menu order ${fatadeRows.map((r) => r.name).join(' | ')} is not ${want.join(' | ')}`);
    for (const o of OURS) if (!menu.some((r) => r.name === o[lc])) problems.push(`${lc}: the menu has no ${o[lc]} row`);
    const extra = menu.filter((r) => !TREE.some((t) => t[lc] === r.name) && !OURS.some((o) => o[lc] === r.name));
    if (extra.length) problems.push(`${lc}: the menu carries rows the tree does not name: ${extra.map((r) => r.name).join(', ')}`);
    for (const t of TREE) {
      const row = menu.find((r) => r.name === t[lc]);
      if (!row) continue;
      const got = row.sub.map((s) => s.name);
      const exp = t.subs.map((s) => s[lc]);
      if (JSON.stringify(got) !== JSON.stringify(exp)) problems.push(`${lc}: menu sub-categories of ${t[lc]} are ${got.join(' | ') || 'none'}, not ${exp.join(' | ') || 'none'}`);
      row.sub.forEach((s, k) => { const w = `${root}${t.slug}/${t.subs[k] ? t.subs[k].slug : '?'}/`; if (t.subs[k] && s.href !== w) problems.push(`${lc}: menu row ${s.name} opens ${s.href}, not ${w}`); });
    }
    const hubNames = [...idx.matchAll(/class="cat-tile__label"[^>]*>([\s\S]*?)<\/(?:h2|h3|span|p)>/g)].map((m) => decode(m[1]));
    if (hubNames.length !== 9) problems.push(`${lc}: the catalogue index shows ${hubNames.length} tiles, not 9`);
    for (const n of [...TREE.map((t) => t[lc]), ...OURS.map((o) => o[lc])]) if (hubNames.length && !hubNames.includes(n)) problems.push(`${lc}: no hub tile named ${n}`);
    for (const t of TREE) {
      const page = read(`${root}${t.slug}/`);
      if (!page) { problems.push(`${lc}: ${root}${t.slug}/ is missing`); continue; }
      if (t.subs.length) {
        const tiles = readSubTiles(page);
        const exp = t.subs.map((s) => s[lc]);
        if (JSON.stringify(tiles.map((x) => x.name)) !== JSON.stringify(exp)) problems.push(`${lc}: ${t.slug} shows the tiles ${tiles.map((x) => x.name).join(' | ') || 'none'}, not ${exp.join(' | ')}`);
        tiles.forEach((x, k) => { const w = `${root}${t.slug}/${t.subs[k] ? t.subs[k].slug : '?'}/`; if (t.subs[k] && x.href !== w) problems.push(`${lc}: the tile ${x.name} opens ${x.href}, not ${w}`); });
        if (hasGrid(page)) problems.push(`${lc}: ${t.slug} has sub-categories and still renders the product grid`);
        for (const s of t.subs) {
          const sp = read(`${root}${t.slug}/${s.slug}/`);
          if (!sp) { problems.push(`${lc}: ${root}${t.slug}/${s.slug}/ is missing`); continue; }
          const c = crumbs(sp);
          const wantC = [lc === 'ro' ? 'Acasă' : 'Главная', 'Catalog', t[lc], s[lc]];
          if (c.length !== 4 || c[1] !== wantC[1] && c[1] !== 'Каталог' || c[2] !== wantC[2] || c[3] !== wantC[3]) problems.push(`${lc}: the breadcrumb of ${t.slug}/${s.slug} reads ${c.join(' / ')}`);
          if (!hasGrid(sp)) problems.push(`${lc}: ${t.slug}/${s.slug} renders no product grid`);
        }
      } else if (!hasGrid(page)) problems.push(`${lc}: ${t.slug} has no sub-categories and renders no product grid`);
    }
  }
  return problems;
}

/* --- self-test on synthetic pages ---------------------------------------------------------- */
function synth(mut) {
  const pages = {};
  for (const lc of ['ro', 'ru']) {
    const root = ROOTS[lc];
    const rows = [...TREE.slice(0, 1).map((t) => ({ t, parent: true })), ...OURS.map((o) => ({ o })), ...TREE.slice(1).map((t) => ({ t, parent: t.subs.length > 0 }))];
    const menu = rows.map((x) => {
      if (x.o) return `<li class="catalog__row"><a class="catalog__link" href="/x/">${x.o[lc]}</a></li>`;
      const t = x.t;
      if (!x.parent) return `<li class="catalog__row"><a class="catalog__link" href="${root}${t.slug}/">${t[lc]}</a></li>`;
      let subs = t.subs.map((s) => `<li class="catalog__row"><a class="catalog__link" href="${root}${t.slug}/${s.slug}/">${mut.label && lc === 'ru' && s.slug === 'vata-minerala' ? 'Вата' : s[lc]}</a></li>`);
      if (mut.dropSub && t.slug === 'vopsele') subs = subs.slice(0, 1);
      return `<li class="catalog__row catalog__row--parent">\n<a class="catalog__link" href="${root}${t.slug}/">${t[lc]}</a><div class="catalog__sub"><ul class="catalog__list"><li class="catalog__row catalog__row--title"><a class="catalog__link" href="${root}${t.slug}/">${t[lc]}</a></li>\n${subs.join('\n')}</ul></div></li>`;
    }).join('\n');
    const hub = [...TREE.map((t) => t[lc]), ...OURS.map((o) => o[lc])].map((n) => `<h3 class="cat-tile__label">${n}</h3>`).join('');
    pages[root] = `<ul class="catalog__list catalog__list--top">${menu}</ul>\n      </div>${hub}${mut.oldName && lc === 'ro' ? '<p>Plăci flexibile</p>' : ''}`;
    const grid = '<div class="prod-grid"><article class="prod" data-product-card></article></div>';
    for (const t of TREE) {
      let subs = t.subs.slice();
      if (mut.swap && t.slug === 'termoizolatie') subs = [subs[1], subs[0], ...subs.slice(2)];
      pages[`${root}${t.slug}/`] = t.subs.length ? subs.map((s) => `<a class="subcat__link" href="${root}${t.slug}/${s.slug}/"><h3 class="subcat__name">${s[lc]}</h3></a>`).join('') : grid;
      for (const s of t.subs) pages[`${root}${t.slug}/${s.slug}/`] = `<nav class="breadcrumb" aria-label="x"><a href="/">${lc === 'ro' ? 'Acasă' : 'Главная'}</a><span>/</span><a href="${root}">Catalog</a><span>/</span><a href="#">${t[lc]}</a><span>/</span><span aria-current="page">${s[lc]}</span></nav>${grid}`;
    }
  }
  return pages;
}
const withOld = (pages) => (u) => pages[u] || null;
const ARMS = [
  { arm: 'a sub-category missing from the menu', mut: { dropSub: true }, want: /menu sub-categories of (Vopsele|Краски) are/ },
  { arm: 'two tiles in the wrong order', mut: { swap: true }, want: /termoizolatie shows the tiles/ },
  { arm: 'a wrong Russian label', mut: { label: true }, want: /ru: menu sub-categories of Системы теплоизоляции/ },
];
const control = (when) => { const p = check(withOld(synth({}))); if (p.length) fail(`self-test control ${when} the arms failed: ${p.join(' | ')}`); };
control('before');
for (const a of ARMS) { const p = check(withOld(synth(a.mut))); if (!p.some((x) => a.want.test(x))) fail(`self-test arm "${a.arm}" did not fire: ${p.join(' | ') || 'nothing'}`); }
{ const pages = synth({ oldName: true }); const hits = Object.values(pages).filter((h) => OLD_NAME.test(h)); if (!hits.length) fail('self-test arm "the old name left on a page" did not fire'); }
control('after');
console.log(`self-test: control clean before and after; ${ARMS.length + 1} arms each fired`);

/* --- the real run ---------------------------------------------------------------------------- */
if (!fs.existsSync(DIST)) fail(`${DIST} is missing. Run node build.js first.`);
const read = (u) => { const f = path.join(DIST, u, 'index.html'); return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null; };
const problems = check(read);
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const html = walk(DIST).filter((f) => f.endsWith('.html'));
if (!html.length) fail('dist/ holds no page.');
/* The rename is of the LABEL: the category's own authored paragraphs (data-cat-prose, W17-02) describe
   the material, which is a flexible plate, and are not a name. Everything else on every page is read. */
for (const f of html) if (OLD_NAME.test(fs.readFileSync(f, 'utf8').replace(/<!--[\s\S]*?-->/g, '').replace(/<p [^>]*data-cat-prose="p[12]"[^>]*>[\s\S]*?<\/p>/g, ''))) problems.push(`${path.relative(DIST, f)} still prints the old name "Plăci flexibile"`);
console.log(`read ${html.length} built pages; tree: ${TREE.length} fatade categories, ${TREE.reduce((n, t) => n + t.subs.length, 0)} sub-categories, plus ${OURS.length} of ours, both locales`);
if (problems.length) { console.error(`\nCATALOG STRUCTURE FAILED: ${problems.length} problem(s)`); problems.forEach((p) => console.error('  ' + p)); process.exit(1); }
console.log('the menu, the nine hub tiles, the sub-category tiles and the sub-category pages carry the owner\'s tree in both locales; the old name is gone.');
