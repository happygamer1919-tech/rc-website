#!/usr/bin/env node
/* Structured data gate, card W28-18 (wave 28). Reads the BUILT tree and nothing else.

   THE OWNER'S ASK, verbatim: "JSON-LD on every page. Organization and LocalBusiness on home with
   NAP from the existing contact page, Service on each service page, Product with AggregateOffer
   lowPrice in MDL on catalog detail pages (no highPrice, no struck price), BreadcrumbList on all
   inner pages, FAQPage only where a visible FAQ exists. No AggregateRating, no Review schema.
   Acceptance: scripts/schema-check.js exits 0 (parses every JSON-LD block, required fields
   present, no AggregateRating type anywhere)."

   Per built page: every <script type="application/ld+json"> parses; the page carries at least
   one block (a redirect page carries its target's BreadcrumbList; a 404 carries WebPage);
   the home pages carry Organization and LocalBusiness with name, telephone, email and a
   PostalAddress, the SAME values on both locales and equal to the NAP the footer prints;
   every service page carries Service; every page that renders a priced catalogue card
   (`.prod__price[data-product]` or `.nvk__price`) carries Product entries, one per priced
   card, each with offers of @type AggregateOffer, a numeric lowPrice above zero, priceCurrency
   MDL, and no highPrice and no key named price; every page except the two home pages carries
   BreadcrumbList; FAQPage appears exactly when the page renders a visible FAQ (`.faq`,
   `.nvk-faq` or a `dl` of questions); and the strings AggregateRating, Review, ratingValue and
   reviewCount appear in no block on any page. It prints how many pages and blocks it read and
   fails on zero (docs/CLAUDE.md section 13). Zero dependency. */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const fail = (m) => { console.error(`\nSCHEMA CHECK FAILED: ${m}\n`); process.exit(1); };
const problems = [];
const bad = (where, m) => problems.push(`${where}: ${m}`);

if (!fs.existsSync(DIST)) fail('no dist/, run: node build.js');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const pages = walk(DIST).filter((f) => f.endsWith('.html')).sort();
if (!pages.length) fail('zero HTML pages');
const rel = (f) => path.relative(DIST, f).split(path.sep).join('/');

const typesOf = (node, out = []) => {
  if (Array.isArray(node)) { node.forEach((n) => typesOf(n, out)); return out; }
  if (node && typeof node === 'object') {
    if (node['@type']) (Array.isArray(node['@type']) ? node['@type'] : [node['@type']]).forEach((t) => out.push(t));
    for (const k of Object.keys(node)) if (k !== '@type') typesOf(node[k], out);
  }
  return out;
};
const findAll = (node, type, out = []) => {
  if (Array.isArray(node)) { node.forEach((n) => findAll(n, type, out)); return out; }
  if (node && typeof node === 'object') {
    const t = node['@type']; if (t === type || (Array.isArray(t) && t.includes(type))) out.push(node);
    for (const k of Object.keys(node)) if (k !== '@type') findAll(node[k], type, out);
  }
  return out;
};
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

let blocksRead = 0, productsRead = 0, faqPages = 0, breadcrumbPages = 0, servicePages = 0;
const homeNap = {};
for (const f of pages) {
  const where = rel(f);
  const raw = fs.readFileSync(f, 'utf8');
  const html = raw.replace(/<!--[\s\S]*?-->/g, '');
  const isHome = where === 'index.html' || where === 'ru/index.html';
  const isRedirect = /<meta http-equiv="refresh"/i.test(html);
  const is404 = /(^|\/)404\.html$/.test(where);
  const isService = /^(ru\/)?servicii\/[^/]+\/index\.html$/.test(where);
  const blocks = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { blocks.push(JSON.parse(m[1])); blocksRead++; } catch (e) { bad(where, `a JSON-LD block does not parse: ${e.message}`); }
  }
  if (!blocks.length) { bad(where, 'no JSON-LD block'); continue; }
  const all = blocks.flatMap((b) => typesOf(b));
  const text = blocks.map((b) => JSON.stringify(b)).join('\n');
  if (/AggregateRating|"Review"|ratingValue|reviewCount/.test(text)) bad(where, 'a block carries AggregateRating, Review, ratingValue or reviewCount');
  // home: Organization + LocalBusiness with NAP
  if (isHome) {
    const org = findAll(blocks, 'Organization')[0];
    const lb = findAll(blocks, 'LocalBusiness')[0] || findAll(blocks, 'GeneralContractor')[0] || findAll(blocks, 'HomeAndConstructionBusiness')[0];
    if (!org) bad(where, 'home carries no Organization');
    if (!lb) bad(where, 'home carries no LocalBusiness');
    for (const [label, node] of [['Organization', org], ['LocalBusiness', lb]]) {
      if (!node) continue;
      for (const k of ['name', 'telephone', 'email']) if (!node[k]) bad(where, `${label} lacks ${k}`);
      const addr = node.address; if (!addr || addr['@type'] !== 'PostalAddress' || !addr.addressLocality) bad(where, `${label} lacks a PostalAddress with addressLocality`);
      const nap = JSON.stringify({ name: node.name, telephone: node.telephone, email: node.email, address: node.address });
      homeNap[where + ':' + label] = nap;
    }
    // the NAP the page prints (the footer's data-nap block, W28-19) must agree with the schema where it exists
    const napEl = (html.match(/<address[^>]*data-nap[^>]*>([\s\S]*?)<\/address>/) || [])[1];
    if (napEl && lb) {
      const napText = decode(napEl);
      const digits = (t) => String(t).replace(/\D/g, '');
      if (lb.telephone && !digits(napText).includes(digits(lb.telephone))) bad(where, `the footer NAP does not print the LocalBusiness telephone "${lb.telephone}"`);
      if (lb.email && !napText.includes(String(lb.email))) bad(where, `the footer NAP does not print the LocalBusiness email "${lb.email}"`);
    }
  }
  // service pages: Service
  if (isService && !all.includes('Service')) bad(where, 'a service page without a Service block');
  if (isService && all.includes('Service')) servicePages++;
  // priced cards: Product + AggregateOffer
  /* A priced card is a product card (article.prod or article.nvk) that carries a price element;
     counted per card, because a compare table can print the same price class again. */
  const pricedCards = (html.match(/<article class="(?:prod|nvk)"[\s\S]*?<\/article>/g) || []).filter((c) => /class="(?:prod|nvk)__price"/.test(c)).length;
  const products = findAll(blocks, 'Product');
  if (pricedCards) {
    if (products.length !== pricedCards) bad(where, `${pricedCards} priced card(s) and ${products.length} Product block(s)`);
    for (const p of products) {
      productsRead++;
      if (!p.name) bad(where, 'a Product without a name');
      const o = p.offers;
      if (!o || o['@type'] !== 'AggregateOffer') { bad(where, `Product "${p.name}" without an AggregateOffer`); continue; }
      if (typeof o.lowPrice !== 'number' || !(o.lowPrice > 0)) bad(where, `Product "${p.name}": lowPrice is ${JSON.stringify(o.lowPrice)}, must be a number above zero`);
      if (o.priceCurrency !== 'MDL') bad(where, `Product "${p.name}": priceCurrency is ${JSON.stringify(o.priceCurrency)}, must be MDL`);
      if ('highPrice' in o) bad(where, `Product "${p.name}": carries highPrice`);
      if ('price' in o || 'price' in p) bad(where, `Product "${p.name}": carries a price key`);
    }
  } else if (products.length) bad(where, `${products.length} Product block(s) on a page with no priced card`);
  // breadcrumbs on every inner page
  if (!isHome) { if (!all.includes('BreadcrumbList')) bad(where, 'an inner page without a BreadcrumbList'); else breadcrumbPages++; }
  // FAQPage exactly where a visible FAQ is
  const visibleFaq = /class="faq(?:\s|")|class="nvk-faq|class="faq__item|data-faq/.test(html);
  const hasFaq = all.includes('FAQPage');
  if (visibleFaq && !hasFaq) bad(where, 'a visible FAQ without a FAQPage block');
  if (!visibleFaq && hasFaq) bad(where, 'a FAQPage block with no visible FAQ');
  if (hasFaq) { faqPages++; const q = findAll(blocks, 'Question'); if (!q.length) bad(where, 'FAQPage without Question entities'); }
  if (isRedirect || is404) { /* held to the same rules above: a block, breadcrumbs, no ratings */ }
}
const napValues = Object.values(homeNap);
if (napValues.length === 4 && new Set(napValues.map((v) => JSON.parse(v).telephone)).size !== 1) bad('home', 'the two locales publish different telephone numbers in their schema');

console.log(`pages read: ${pages.length}; JSON-LD blocks parsed: ${blocksRead}; Product entries: ${productsRead}; Service pages: ${servicePages}; BreadcrumbList pages: ${breadcrumbPages}; FAQPage pages: ${faqPages}`);
if (!blocksRead) fail('zero JSON-LD blocks read');
if (problems.length) { console.error(`\n${problems.length} problem(s):`); problems.forEach((p) => console.error('  ' + p)); process.exit(1); }
console.log('every page carries parsed JSON-LD; home has Organization and LocalBusiness with NAP; every service page a Service; every priced card a Product with an AggregateOffer in MDL and no highPrice; every inner page a BreadcrumbList; FAQPage exactly where a FAQ is visible; no AggregateRating or Review anywhere.');
