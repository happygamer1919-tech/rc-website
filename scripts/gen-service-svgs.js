#!/usr/bin/env node
/* Placeholder SVGs for the nine service cards, one per illustration ID.
   Flat #F2F2F2 field, 1px #E2E2E2 border, the ID and ratio in #5A5A5A, at the
   card's 4:3 box. A real illustration from Claude Design simply overwrites the
   file; nothing in the template changes.

   Kept separate from the photo placeholder generator because these are not
   photographs and are not in the photo manifest. */

const fs = require('fs');
const path = require('path');
const { SERVICE_ILLUSTRATIONS } = require('./slots');

const OUT = path.join(__dirname, '..', 'public', 'img', 'services');
const LEDGER = path.join(OUT, 'PLACEHOLDERS.json');
const FORCE = process.argv.includes('--force');
const W = 400, H = 300;

const svg = (id) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${id}">
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" fill="#F2F2F2" stroke="#E2E2E2" stroke-width="1" rx="10"/>
  <text x="${W / 2}" y="${H / 2 - 4}" fill="#5A5A5A" font-family="Inter, Arial, sans-serif" font-size="17" text-anchor="middle">${id}</text>
  <text x="${W / 2}" y="${H / 2 + 20}" fill="#5A5A5A" font-family="Inter, Arial, sans-serif" font-size="14" text-anchor="middle">illustration &#183; 4:3</text>
</svg>
`;

fs.mkdirSync(OUT, { recursive: true });
const ledger = fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, 'utf8')) : {};
const next = {};
let made = 0, kept = 0;

for (const id of SERVICE_ILLUSTRATIONS) {
  const file = path.join(OUT, id + '.svg');
  if (!FORCE && fs.existsSync(file)) {
    const size = fs.statSync(file).size;
    if (ledger[id] !== size) {
      console.log(`  keep    services/${id}.svg  (real illustration, ${(size / 1024).toFixed(1)} KB)`);
      next[id] = ledger[id] ?? -1;
      kept++;
      continue;
    }
  }
  fs.writeFileSync(file, svg(id));
  next[id] = fs.statSync(file).size;
  made++;
  console.log(`  write   services/${id}.svg  ${W}x${H}  ${(next[id] / 1024).toFixed(1)} KB`);
}

fs.writeFileSync(LEDGER, JSON.stringify(next, null, 2) + '\n');
console.log(`\n${made} placeholder SVG(s) written, ${kept} real illustration(s) left untouched. ${SERVICE_ILLUSTRATIONS.length} total.`);
