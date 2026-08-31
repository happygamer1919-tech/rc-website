#!/usr/bin/env node
/* Dead-link gate. Walks every HTML file in dist/ and resolves every href and
   src that points inside the site: the file must exist, and a #fragment must
   match a real id on the page it lands on.

   Run after a build:

       node build.js && node scripts/check-links.js

   External links (http, mailto, tel, data) are out of scope: this checks what
   the build controls. Exits non-zero on the first build that breaks a link,
   which is what makes it usable as a gate.

   No dependencies. */

const fs = require('fs');
const path = require('path');

const ROOT = 'dist';
if (!fs.existsSync(ROOT)) {
  console.error(`\nno ${ROOT}/ — run: node build.js\n`);
  process.exit(1);
}

const pages = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name.endsWith('.html')) pages.push(p);
  }
})(ROOT);

const idCache = new Map();
const idsOf = (file) => {
  if (!idCache.has(file)) {
    idCache.set(file, new Set(
      [...fs.readFileSync(file, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idCache.get(file);
};

const EXTERNAL = /^(https?:|mailto:|tel:|data:|#$)/;
const dead = [];
let checked = 0;

for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  for (const m of html.matchAll(/\s(?:href|src)="([^"]*)"/g)) {
    const raw = m[1];
    checked++;
    if (!raw || EXTERNAL.test(raw)) continue;

    const [pathPart, hash] = raw.split('#');
    let target = page;

    if (pathPart) {
      let file = pathPart.startsWith('/')
        ? path.join(ROOT, pathPart)
        : path.join(path.dirname(page), pathPart);
      if (file.endsWith('/')) file = path.join(file, 'index.html');
      if (!fs.existsSync(file) && fs.existsSync(path.join(file, 'index.html'))) {
        file = path.join(file, 'index.html');
      }
      if (!fs.existsSync(file)) { dead.push(`${page}  ->  ${raw}   (no such file)`); continue; }
      target = file;
    }

    if (hash && target.endsWith('.html') && !idsOf(target).has(hash)) {
      dead.push(`${page}  ->  ${raw}   (no element with id="${hash}")`);
    }
  }
}

console.log(`\npages: ${pages.length}   href/src checked: ${checked}   dead: ${dead.length}`);
if (dead.length) {
  console.error('\nDEAD LINKS:');
  dead.forEach((d) => console.error('  · ' + d));
  console.error('');
  process.exit(1);
}
console.log('every internal link and anchor resolves.\n');
