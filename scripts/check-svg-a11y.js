#!/usr/bin/env node
/* Inline SVG accessibility gate, card RC-142 (W19-02). Run by `quality` on every
   pull request, over the BUILT site.

   Every inline <svg> on every built page is exactly one of two things, and this
   gate fails on anything else:

   1. DECORATIVE. `aria-hidden="true"`, and no role. An icon inside a link or
      button whose own text or aria-label already says what it does: the phone
      glyph, the menu bars, the caret. Naming these would make a screen reader
      announce the control twice, so they are hidden on purpose, and the gate
      holds them to that.
   2. AN IMAGE. `role="img"` with a non-empty `aria-label`, not hidden.

   A DIAGRAM (the carport structures and the tile profiles) must be an image,
   never decorative, and must also carry a description: an `aria-describedby`
   naming a non-empty <desc> inside that same svg. And any text a diagram draws
   takes the tile treatment (W18-01): fill currentColor, stroke none, font-size 9.
   A diagram with no drawn label passes that rule vacuously; a label added later
   is held to it.

   IT NEVER PASSES ON NOTHING. It fails when dist/ holds no HTML, when the pages
   hold no svg at all, and when either diagram family is absent from the site, and
   it prints the files and svgs read before any result (W18-03, docs/CLAUDE.md
   section 13).

   Zero dependencies. Reads HTML as text: the svg opening tags this build emits
   are single-line and attribute-quoted, which build.js controls.

   Usage:  node build.js && node scripts/check-svg-a11y.js */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const fail = (msg) => { console.error(`\nSVG ACCESSIBILITY GATE FAILED: ${msg}\n`); process.exit(1); };

/* The diagram families, by the class build.js puts on each diagram's svg. */
const DIAGRAMS = { 'cop-diagram__svg': 'carport structure', 'tile-diagram__svg': 'tile profile' };
/* The tile label treatment, W18-01. */
const LABEL = { fill: 'currentColor', stroke: 'none', 'font-size': '9' };

if (!fs.existsSync(DIST)) fail('no dist/, run: node build.js');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const files = walk(DIST).filter((f) => f.endsWith('.html'));
console.log(`files read: ${files.length} HTML pages in dist/`);
if (files.length === 0) fail('zero HTML pages read in dist/, so no svg was checked.');

const attr = (tag, name) => { const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`)); return m ? m[1] : null; };
const decode = (s) => s.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim();

const problems = [];
let svgs = 0, decorative = 0, images = 0;
const diagramCount = Object.fromEntries(Object.keys(DIAGRAMS).map((k) => [k, 0]));

for (const file of files) {
  const rel = path.relative(ROOT, file);
  const html = fs.readFileSync(file, 'utf8');
  for (const m of html.matchAll(/<svg\b[^>]*>([\s\S]*?)<\/svg>/g)) {
    svgs++;
    const open = m[0].slice(0, m[0].indexOf('>') + 1);
    const body = m[1];
    const cls = attr(open, 'class') || '';
    const kind = Object.keys(DIAGRAMS).find((k) => cls.split(/\s+/).includes(k));
    const hidden = attr(open, 'aria-hidden') === 'true';
    const role = attr(open, 'role');
    const label = attr(open, 'aria-label');
    const where = `${rel}: <svg${cls ? ` class="${cls}"` : ''}>`;

    if (hidden) {
      decorative++;
      if (role) problems.push(`${where} is aria-hidden but also carries role="${role}"; a hidden svg is decorative and has no role`);
    } else if (role === 'img' && label && label.trim()) {
      images++;
    } else {
      problems.push(`${where} is neither decorative (aria-hidden="true") nor a named image (role="img" with a non-empty aria-label): role=${role || 'none'}, aria-label=${label === null ? 'none' : `"${label}"`}`);
    }

    if (!kind) continue;
    diagramCount[kind]++;
    if (hidden) problems.push(`${where} is a ${DIAGRAMS[kind]} diagram hidden from assistive technology; a diagram is an image, never decorative`);
    const described = attr(open, 'aria-describedby');
    if (!described) {
      problems.push(`${where} is a ${DIAGRAMS[kind]} diagram with no aria-describedby, so it has no description`);
    } else {
      const desc = body.match(new RegExp(`<desc\\s+id="${described.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>([\\s\\S]*?)</desc>`));
      if (!desc) problems.push(`${where} is described by "${described}", which is not a <desc> inside that svg`);
      else if (!decode(desc[1])) problems.push(`${where} is described by an empty <desc id="${described}">`);
    }
    for (const t of body.matchAll(/<text\b[^>]*>/g)) {
      const bad = Object.entries(LABEL).filter(([k, v]) => attr(t[0], k) !== v).map(([k, v]) => `${k} ${attr(t[0], k) === null ? 'missing' : `"${attr(t[0], k)}"`}, want "${v}"`);
      if (bad.length) problems.push(`${where} draws a label off the tile treatment: ${bad.join('; ')}`);
    }
  }
}

console.log(`svgs read: ${svgs} (${decorative} decorative, ${images} named images)`);
console.log(`diagrams read: ${Object.entries(diagramCount).map(([k, n]) => `${n} ${DIAGRAMS[k]}`).join(', ')}`);
if (svgs === 0) fail('zero svg read across the built pages, so the rules were checked against nothing.');
for (const [k, n] of Object.entries(diagramCount)) {
  if (n === 0) problems.push(`zero ${DIAGRAMS[k]} diagrams (svg.${k}) in the built site; the diagram rules would pass on nothing`);
}

if (problems.length) {
  console.error(`\nSVG ACCESSIBILITY GATE FAILED: ${problems.length} problem(s)`);
  problems.slice(0, 40).forEach((p) => console.error(`  ${p}`));
  if (problems.length > 40) console.error(`  ... and ${problems.length - 40} more`);
  process.exit(1);
}
console.log('every svg is decorative or a named image; every diagram is a named, described image; every drawn label takes the tile treatment.');
