#!/usr/bin/env node
/* Takes the owner's own pictures in, from the two folders W25-16 prepared.
   Card W25-21.

       node scripts/intake-owner-pics.js               report what is waiting
       node scripts/intake-owner-pics.js --apply --who "Mihai"     real photographs
       node scripts/intake-owner-pics.js --apply --tool "Midjourney v7"   generated
       node scripts/intake-owner-pics.js --self-test   run the arms and stop

   THE FILENAME IS THE SLOT ID, exactly. That is the rule both READMEs state and
   the rule docs/OWNER-INTAKE-W25.md is generated to preserve, and it is the whole
   matching logic here: `ACOP-02.png` fills `ACOP-02` and nothing else. A file
   whose stem is not a slot id is REPORTED, never guessed at, because a guess here
   installs a photograph of one thing on a card for another.

   MISSING IS NOT AN ERROR. The dispatch says so in as many words: a slot with no
   file is listed and the run carries on. This is an intake, not a gate; it
   asserts nothing about what the owner has or has not sent.

   WHICH FOLDER DECIDES THE ORIGIN, and the origin decides what is allowed:

     RC-pics-real  a real photograph. Provenance takes the R-W client-supplied
                   origin, which needs a NAME (`--who`) and is the one origin that
                   needs no licence URL. Allowed on every slot, including the
                   evidence slots, because a photograph IS evidence.
     RC-pics-ai    a generated image. Provenance takes the W25-R3 origin, which
                   needs the TOOL (`--tool`). Refused on an evidence slot (BA-,
                   PROJ-, PORT-) and on a named tile product, which are W25-R3's
                   and W25-R2's own limits.

   WHAT IT REFUSES, each one a thing that would otherwise reach the site:
     · a stem that is not a slot id in docs/PHOTO-SLOTS-W24.json;
     · a slot that is already filled, because overwriting a reviewed picture
       silently is how a card loses one;
     · a file that is not an image by its BYTES, whatever its name says;
     · a longest side under the 450 floor, which is W25-R12 and is final;
     · a generated image where W25-R3 or W25-R2 forbids one;
     · `--apply` without the name or the tool the provenance row needs.

   It does not write anything without `--apply`, and even with it, it installs
   through scripts/process-packshot.js, which is the one thing in this repo that
   writes into public/img/ and the one thing that strips and then ASSERTS the
   strip. Nothing here re-encodes an image itself.

   Zero dependencies. */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
/* The three paths are overridable by environment, and only so the apply path can
   be PROVED on a throwaway copy rather than asserted. W25-21 ran it end to end
   that way: a planted 900x520 file, taken in, installed, ledger and provenance
   written, and every gate green on the result. Unset, they are the real ones. */
const REAL_DIR = process.env.RC_INTAKE_REAL || '/Users/ivan/RC-pics-real';
const AI_DIR = process.env.RC_INTAKE_AI || '/Users/ivan/RC-pics-ai';
const LEDGER = process.env.RC_INTAKE_LEDGER || path.join(ROOT, 'docs/PHOTO-SLOTS-W24.json');
const PROVENANCE = process.env.RC_INTAKE_PROVENANCE || path.join(ROOT, 'docs/assets/PROVENANCE.md');
const FLOOR = 450;

/* W25-R3 and W25-R2, the two limits on a GENERATED image, held here rather than
   described: an evidence slot is a proof image and a render is never one, and a
   named tile product is sold by its exact appearance. Gate 19 holds the first
   over the built tree; this stops it at the door, which is where the owner finds
   out. */
const EVIDENCE_PREFIXES = ['BA-', 'PROJ-', 'PORT-'];
const TILE_PREFIXES = ['NVK-', 'ACTM-'];

/* Which folder under public/img/ a slot's file lands in. Named after what is in
   it, so a hub tile does not end up filed under `catalog/` where nothing about
   the path says what it is. `catalog` is the fallback and is also the truth for
   every CAT- and CATEG- slot, which is most of them. */
const FOLDERS = [
  [/^GARDB?-/, 'garduri'],
  [/^(ACOP|ACTM|NVK)-/, 'acoperisuri'],
  [/^(COPX-|COPM-|COP-HERO)/, 'copertine'],
  [/^BA-/, 'before-after'],
];
const folderFor = (id) => (FOLDERS.find(([re]) => re.test(id)) || [null, 'catalog'])[1];

const die = (m) => { console.error(`\nINTAKE FAILED: ${m}\n`); process.exit(1); };
const flag = (name) => process.argv.includes(`--${name}`);
const value = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : null;
};

/* An image by its bytes, the same magic table process-packshot.js uses, because
   a file named .jpg that is an HTML error page must not reach that script as if
   it were a photograph. */
function magicOf(buf) {
  const h = buf.subarray(0, 16);
  if (h[0] === 0xff && h[1] === 0xd8) return 'jpeg';
  if (h.subarray(0, 8).toString('hex') === '89504e470d0a1a0a') return 'png';
  if (h.subarray(0, 4).toString() === 'RIFF' && h.subarray(8, 12).toString() === 'WEBP') return 'webp';
  if (h.subarray(4, 8).toString() === 'ftyp') return 'heic';
  if (h.subarray(0, 2).toString() === 'II' || h.subarray(0, 2).toString() === 'MM') return 'tiff';
  return null;
}

/* Dimensions from the bytes, not from `sips`: gate 24 shipped a version that
   shelled out to sips and failed in CI on Linux on its first run, and that lesson
   belongs to every script in here, not only to that one. PNG is the IHDR chunk;
   JPEG is a walk of the segments to a start-of-frame marker. */
function dimsOf(buf) {
  const m = magicOf(buf);
  if (m === 'png') {
    if (buf.length < 24 || buf.subarray(12, 16).toString() !== 'IHDR') return null;
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  }
  if (m === 'jpeg') {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) };
      }
      const len = buf.readUInt16BE(i + 2);
      if (len < 2) break;
      i += 2 + len;
    }
    return null;
  }
  return null;
}

/* --- the judgement, pure, so the self-test can watch every branch ---------- */

function judge({ stem, dir, buf, rows }) {
  const row = rows.find((r) => r.id === stem);
  if (!row) return { id: 'unknown-slot', text: `${stem}: no slot with that id is in the ledger. The filename is the slot id, exactly.` };
  if (row.state === 'filled') return { id: 'already-filled', text: `${stem}: that slot is already filled with ${row.provenance}. Nothing is overwritten here; delete the row first if it is meant to be replaced.` };
  const magic = magicOf(buf);
  if (!magic) return { id: 'not-an-image', text: `${stem}: the file is not an image by its bytes, whatever its name says.` };
  const d = dimsOf(buf);
  if (!d) return { id: 'unreadable-size', text: `${stem}: the file is a ${magic} whose size could not be read from its bytes.` };
  if (Math.max(d.w, d.h) < FLOOR) return { id: 'under-floor', text: `${stem}: ${d.w}x${d.h}, and its longest side is under the ${FLOOR}px floor W25-R12 made final. Nothing is ever enlarged.` };
  if (dir === 'ai') {
    if (EVIDENCE_PREFIXES.some((p) => stem.startsWith(p))) {
      return { id: 'generated-on-evidence', text: `${stem}: W25-R3 forbids a generated image on a project, portfolio or before/after slot. A render is never a proof image. Put a real photograph in RC-pics-real instead.` };
    }
    if (TILE_PREFIXES.some((p) => stem.startsWith(p))) {
      return { id: 'generated-on-tile', text: `${stem}: W25-R2 forbids a generated image on a named tile product, because a tile is sold by its exact appearance.` };
    }
  }
  return { id: null, row, magic, dims: d };
}

/* --- the self-test, so no branch above is an assertion nobody has watched --- */

const SELF_ROWS = [
  { id: 'SELF-EMPTY', state: 'placeholder' },
  { id: 'SELF-FULL', state: 'filled', provenance: 'public/img/x.jpg' },
  { id: 'BA-99-before', state: 'placeholder' },
  { id: 'NVK-99', state: 'placeholder' },
];
const png = (w, h) => {
  const b = Buffer.alloc(24);
  Buffer.from('89504e470d0a1a0a', 'hex').copy(b, 0);
  b.write('IHDR', 12);
  b.writeUInt32BE(w, 16); b.writeUInt32BE(h, 20);
  return b;
};
const SELF = [
  { arm: 'a stem that is no slot', want: 'unknown-slot', in: { stem: 'SELF-NOPE', dir: 'ai', buf: png(600, 600) } },
  { arm: 'a slot that is already filled', want: 'already-filled', in: { stem: 'SELF-FULL', dir: 'ai', buf: png(600, 600) } },
  { arm: 'a file that is not an image by its bytes', want: 'not-an-image', in: { stem: 'SELF-EMPTY', dir: 'ai', buf: Buffer.from('<html>404</html>') } },
  { arm: 'a source under the 450 floor', want: 'under-floor', in: { stem: 'SELF-EMPTY', dir: 'ai', buf: png(449, 449) } },
  { arm: 'a generated image on an evidence slot', want: 'generated-on-evidence', in: { stem: 'BA-99-before', dir: 'ai', buf: png(600, 600) } },
  { arm: 'a generated image on a named tile product', want: 'generated-on-tile', in: { stem: 'NVK-99', dir: 'ai', buf: png(600, 600) } },
  /* GREEN arms. A permission nobody has watched succeed is as untested as an
     assertion nobody has watched fail (W25-20). Both of these are shapes this
     script MUST take in, and the second is the one the first two red arms would
     wrongly catch if the folder were ignored: a real PHOTOGRAPH on an evidence
     slot is exactly what an evidence slot is for. */
  { arm: 'GREEN: a generated image on an ordinary product slot', want: null, in: { stem: 'SELF-EMPTY', dir: 'ai', buf: png(450, 600) } },
  { arm: 'GREEN: a real photograph on an evidence slot', want: null, in: { stem: 'BA-99-before', dir: 'real', buf: png(600, 600) } },
];
let armsRun = 0;
for (const t of SELF) {
  const got = judge({ ...t.in, rows: SELF_ROWS });
  if (got.id !== t.want) {
    die(`self-test arm "${t.arm}" expected "${t.want}" and got "${got.id}". An assertion nobody has watched fail is not a gate, and a permission nobody has watched succeed is not a permission.`);
  }
  armsRun++;
}
/* The floor is a boundary, so both sides of it are watched: 449 fails above and
   450 passes here, which is what stops an off-by-one from quietly moving it. */
if (judge({ stem: 'SELF-EMPTY', dir: 'ai', buf: png(450, 100), rows: SELF_ROWS }).id !== null) die('self-test: 450 on the longest side must pass the floor.');
armsRun++;
/* The folder mapping, watched rather than assumed: a slot filed in the wrong
   folder is a file nobody finds again, and the fallback must be the fallback. */
for (const [id, want] of [['GARD-01', 'garduri'], ['GARDB-02', 'garduri'], ['ACOP-03', 'acoperisuri'],
  ['ACTM-01', 'acoperisuri'], ['NVK-04', 'acoperisuri'], ['COPX-01', 'copertine'], ['COP-HERO', 'copertine'],
  ['BA-01-before', 'before-after'], ['CAT-0001', 'catalog'], ['CATEG-08', 'catalog']]) {
  if (folderFor(id) !== want) die(`self-test: ${id} maps to public/img/${folderFor(id)}/, expected ${want}.`);
  armsRun++;
}
console.log(`self-test: ${armsRun} arms, ${SELF.filter((t) => t.want === null).length + 1} of them green`);
if (flag('self-test')) process.exit(0);

/* --- the run -------------------------------------------------------------- */

if (!fs.existsSync(LEDGER)) die(`${LEDGER} is missing.`);
const ledger = JSON.parse(fs.readFileSync(LEDGER, 'utf8'));
if (!Array.isArray(ledger.slots) || !ledger.slots.length) die('the ledger has no slots.');

const APPLY = flag('apply');
const WHO = value('who');
const TOOL = value('tool');
const TODAY = new Date().toISOString().slice(0, 10);
const DDMMYYYY = TODAY.split('-').reverse().join('.');

const found = [];
for (const [dir, key] of [[REAL_DIR, 'real'], [AI_DIR, 'ai']]) {
  if (!fs.existsSync(dir)) { console.log(`${dir} does not exist.`); continue; }
  for (const name of fs.readdirSync(dir).sort()) {
    if (name.startsWith('.') || name === 'README.txt') continue;
    const file = path.join(dir, name);
    if (!fs.statSync(file).isFile()) continue;
    found.push({ file, name, stem: path.basename(name, path.extname(name)), dir: key });
  }
}

console.log(`\nRC-pics-real: ${found.filter((f) => f.dir === 'real').length} file(s)   RC-pics-ai: ${found.filter((f) => f.dir === 'ai').length} file(s)`);

const ok = [], refused = [];
for (const f of found) {
  const verdict = judge({ ...f, buf: fs.readFileSync(f.file), rows: ledger.slots });
  if (verdict.id) refused.push({ ...f, ...verdict });
  else ok.push({ ...f, ...verdict });
}

for (const r of refused) console.log(`  REFUSED  ${r.name}: ${r.text}`);
for (const g of ok) console.log(`  READY    ${g.name} -> ${g.row.id}  ${g.magic} ${g.dims.w}x${g.dims.h}  (${g.dir === 'ai' ? 'generated' : 'photograph'})  into public/img/${folderFor(g.row.id)}/`);

/* MISSING IS NOT AN ERROR. Listed, in the order the ledger has them, so the owner
   can see what a next drop would fill. */
const waiting = ledger.slots.filter((r) => r.state !== 'filled' && !ok.some((g) => g.row.id === r.id));
console.log(`\nstill waiting, and this is a list rather than a failure: ${waiting.length} slot(s)`);
for (const r of waiting.slice(0, 40)) console.log(`  ${r.id.padEnd(14)} ${String(r.ratio).padEnd(8)} ${String(r.min_px).padEnd(10)} ${r.page}`);
if (waiting.length > 40) console.log(`  ... and ${waiting.length - 40} more`);

if (!ok.length) { console.log('\nnothing to take in.'); process.exit(0); }
if (!APPLY) { console.log('\nnothing written. Re-run with --apply, plus --who <name> for a photograph or --tool <name> for a generated image.'); process.exit(0); }

if (ok.some((g) => g.dir === 'real') && !WHO) die('a real photograph takes the R-W client-supplied origin, which names the person who sent it. Pass --who "<name>".');
if (ok.some((g) => g.dir === 'ai') && !TOOL) die('a generated image takes the W25-R3 origin, which names the tool. Pass --tool "<name>".');
/* The client-supplied source cell is held to an EXACT shape by R-W and by
   scripts/check-asset-provenance.js: "client direct transfer, <name>, DD.MM.YYYY".
   A comma in the name moves the date into the name's cell and the gate fails
   afterwards, on a commit, instead of here, before one. The name may be several
   words; it may not carry a comma. */
if (WHO && (WHO.includes(',') || !WHO.trim())) die(`--who "${WHO}" carries a comma or is empty. R-W's client-supplied source is "client direct transfer, <name>, DD.MM.YYYY" exactly, and a comma in the name moves the date.`);

const provRows = [];
for (const g of ok) {
  const outDir = folderFor(g.row.id);
  execFileSync('node', [path.join(ROOT, 'scripts/process-packshot.js'), g.file, g.row.id, '--dir', outDir],
    { cwd: ROOT, stdio: ['ignore', 'inherit', 'inherit'] });
  const rel = `public/img/${outDir}/${g.row.id}.jpg`;
  g.row.state = 'filled';
  g.row.provenance = rel;
  g.row.alt = g.row.alt || { ro: 'TODO: alt text', ru: 'TODO: alt text' };
  provRows.push(g.dir === 'real'
    ? `| \`${rel}\` | client direct transfer, ${WHO}, ${DDMMYYYY} | owned by Rapid Construct, supplied for site use | n/a, client-supplied original | ${TODAY} |`
    : `| \`${rel}\` | AI generated for Rapid Construct, ${TOOL}, ${TODAY} | AI generated for Rapid Construct, tool named by owner, ${TODAY} | n/a, generated in this repo | ${TODAY} |`);
}
fs.writeFileSync(LEDGER, JSON.stringify(ledger, null, 2) + '\n');
fs.appendFileSync(PROVENANCE, provRows.join('\n') + '\n');
console.log(`\ninstalled ${ok.length}, ledger updated, ${provRows.length} provenance row(s) appended.`);
/* build.js REFUSES a "TODO:" string, so a slot filled here does not build until a
   person has written its alt text. That is deliberate and it is stated rather
   than discovered: the build failing is the reminder. */
console.log('\nALT TEXT IS NOT WRITTEN BY THIS SCRIPT. Every row it filled carries "TODO: alt text",');
console.log('and `node build.js` REFUSES that string, so the site does not build until a person has');
console.log('written the Romanian and the Russian. The failing build is the reminder, on purpose.');
