#!/usr/bin/env node
/* Dash gate, gate 30, card W26-13. Run by `quality` on every pull request.

   THE OWNER'S RULE, verbatim from the W26 dispatch: "No em dashes or en dashes anywhere."
   This holds it in four places, and reads each one by its BYTES, because the check that
   came before it did not: a shell grep for an escaped dash expanded to nothing, matched
   nothing, and reported clean on every card of a dispatch (W26-05's card records it).

     1. every text file in the working tree, tracked or new, that git does not ignore;
     2. every file of the built site in dist/, where an HTML entity or a JS or CSS escape
        that paints a dash counts as the dash itself;
     3. this pull request's own commit messages, and its title and body;
     4. the four RECORDS, where only the lines already there may keep theirs (below).

   The characters are the em dash U+2014 and the en dash U+2013, and the two that paint the
   same stroke, the figure dash U+2012 and the horizontal bar U+2015, because a rewrite
   into a lookalike would pass a gate that read two code points. The hyphen and the minus
   sign U+2212 are not dashes and are never judged.

   THE RULING'S TWO EXEMPTIONS, W26-R15 verbatim: "third-party titles quoted verbatim in the
   audit file, and frozen records under R-S". Nothing else is exempt.

   THE RECORDS. DECISIONS.md, docs/QUESTIONS.md, docs/BACKLOG.md and RELEASE-NOTES.md are
   records under R-S: an entry body is immutable, "including to correct an error". Their
   250 dashes were written before the rule and are held, line by line, in
   scripts/fixtures/dash-baseline.json by the SHA-256 of each line's text. A line in a
   record passes only if its exact text is in that baseline, as many times as the baseline
   says. So a NEW entry with a dash fails, an OLD line edited fails, and a baselined line
   that no longer exists is a dead entry and fails too, which is how the baseline can only
   shrink. Its total is held to FROZEN_CEILING below, so it cannot be regenerated larger
   without this file changing in the same pull request. A status field is not frozen (R-S),
   and the one status cell that carried a dash was fixed.

   THE AUDIT FILE is exempt by FIELD, not whole: docs/audit/imperlux/audit.json is parsed,
   and a dash is accepted only inside a string under one of AUDIT_QUOTED, the fields the
   capture copied from imperlux's pages. A dash in any other field, a key, or a file that
   does not parse, fails; so does an audit file with no quoted dash left, as a dead
   exemption. Gate 22's old stylesheet is NOT exempt: its three comment dashes are hyphens
   and gate 22 verifies it against git with exactly that substitution.

   Binary files are recognised by their bytes, not their names, and skipped by kind: a
   JPEG's compressed data holds the dash's three bytes by chance in several photographs
   here. A text file that is not valid UTF-8 fails, because it could not be read.

   IT NEVER PASSES ON NOTHING: zero text files, zero built files, a missing record, a
   missing baseline, and in a pull request zero commits read or fewer than GitHub says it
   has. ITS SELF-TEST RUNS FIRST, between two clean controls (R-AB): fifteen synthetic
   arms, three of them GREEN, and five arms on the shipping files, planted in memory and
   never written: a dash in two of the places this card cleaned, a new record entry with a
   dash, a frozen line edited, and (GREEN) a new record entry with none.

   Zero dependency. It shells out to git only to list the tree and to read commits.

   Usage:  node build.js && node scripts/check-dashes.js
           node scripts/check-dashes.js --print-baseline   (what the baseline would be now) */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const BASELINE_FILE = path.join(ROOT, 'scripts/fixtures/dash-baseline.json');
const fail = (m) => { console.error(`\nDASH GATE FAILED: ${m}\n`); process.exit(1); };

const CODES = [0x2012, 0x2013, 0x2014, 0x2015];
const NAME = { 0x2012: 'figure dash U+2012', 0x2013: 'en dash U+2013', 0x2014: 'em dash U+2014', 0x2015: 'horizontal bar U+2015' };
const DASH = new RegExp(`[${CODES.map((c) => String.fromCodePoint(c)).join('')}]`, 'g');
/* Written by what they paint, so this file holds no dash of its own. */
const ENTITY = /&(?:mdash|ndash|horbar|#0*82(?:10|11|12|13)|#x0*201[2-5]);/gi;
const ESCAPE = /\\u\{?0*201[2-5]\}?|\\0*201[2-5](?![0-9a-f])/gi;

const RECORDS = ['DECISIONS.md', 'docs/QUESTIONS.md', 'docs/BACKLOG.md', 'RELEASE-NOTES.md'];
const FROZEN_CEILING = 250;
const AUDIT = 'docs/audit/imperlux/audit.json';
const AUDIT_QUOTED = ['title', 'h1', 'heading', 'text'];

/* --- reading ------------------------------------------------------------------------- */
const MAGIC = [
  ['jpeg', (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff],
  ['png', (b) => b.slice(0, 4).toString('latin1') === '\x89PNG'],
  ['gif', (b) => b.slice(0, 4).toString('latin1') === 'GIF8'],
  ['webp', (b) => b.slice(0, 4).toString('latin1') === 'RIFF' && b.slice(8, 12).toString('latin1') === 'WEBP'],
  ['pdf', (b) => b.slice(0, 4).toString('latin1') === '%PDF'],
  ['font', (b) => ['wOFF', 'wOF2', 'OTTO', '\x00\x01\x00\x00'].includes(b.slice(0, 4).toString('latin1'))],
  ['isobmff', (b) => b.slice(4, 8).toString('latin1') === 'ftyp'],
  ['ico', (b) => b[0] === 0 && b[1] === 0 && b[2] === 1 && b[3] === 0],
  ['zip', (b) => b.slice(0, 4).toString('latin1') === 'PK\x03\x04'],
];
const decoder = new TextDecoder('utf-8', { fatal: true });
function classify(bytes) {
  for (const [kind, test] of MAGIC) if (bytes.length >= 12 && test(bytes)) return { kind };
  if (bytes.subarray(0, 8192).includes(0)) return { kind: 'binary' };
  try { return { kind: 'text', text: decoder.decode(bytes) }; } catch { return { kind: 'unreadable' }; }
}
/* search() neither reads nor moves lastIndex, which test() on this global pattern does:
   a test() before a matchAll() left the match past the dash and named nothing. */
const has = (t) => t.search(DASH) >= 0;
const lines = (text) => text.split('\n').map((l) => l.replace(/\r$/, ''));
const names = (s) => [...new Set([...s.matchAll(DASH)].map((m) => NAME[m[0].codePointAt(0)]))].join(', ');
const sha = (s) => crypto.createHash('sha256').update(s, 'utf8').digest('hex');
const clip = (s) => {
  const t = s.trim(), at = Math.max(0, t.search(DASH) - 40), part = t.slice(at, at + 90);
  return (at ? '...' : '') + part.replace(DASH, (d) => `<U+${d.codePointAt(0).toString(16).toUpperCase()}>`) + (at + 90 < t.length ? '...' : '');
};

/* --- the rule, on whatever it is handed ------------------------------------------------ */
function scan({ files = [], dist = [], baseline = { files: {} }, commits = [], pr = null }) {
  const problems = [];
  const counts = { text: 0, skipped: {}, frozen: 0, exempt: {} };
  const add = (id, msg) => problems.push({ id, msg });

  for (const f of files) {
    const c = classify(f.bytes);
    if (c.kind === 'unreadable') { add('unreadable', `${f.path} is neither a known binary format nor valid UTF-8, so it could not be read for dashes`); continue; }
    if (c.kind !== 'text') { counts.skipped[c.kind] = (counts.skipped[c.kind] || 0) + 1; continue; }
    counts.text++;
    const hits = lines(c.text).map((t, i) => ({ n: i + 1, t, k: (t.match(DASH) || []).length })).filter((h) => h.k);

    if (f.path === AUDIT) {
      let doc;
      try { doc = JSON.parse(c.text); } catch (e) { add('unreadable', `${f.path} does not parse as JSON, so its quoted fields cannot be told from the rest: ${e.message}`); continue; }
      let quoted = 0;
      const walk = (v, where, key) => {
        if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${where}[${i}]`, key));
        else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { if (has(k)) add('dash-in-file', `${f.path} ${where} has a key carrying ${names(k)}`); walk(x, `${where}.${k}`, k); }
        else if (typeof v === 'string' && has(v)) {
          if (AUDIT_QUOTED.includes(key)) quoted += (v.match(DASH) || []).length;
          else add('dash-in-file', `${f.path} ${where} carries ${names(v)} in a field that is not a quoted third-party title: "${clip(v)}"`);
        }
      };
      walk(doc, '$', null);
      if (!quoted) add('dead-exemption', `${f.path} holds no dash in a quoted title any more; its exemption is dead`);
      counts.exempt[f.path] = quoted;
      continue;
    }
    if (RECORDS.includes(f.path)) {
      const left = new Map();
      for (const e of baseline.files[f.path] || []) left.set(e.sha256, (left.get(e.sha256) || 0) + e.n);
      for (const h of hits) {
        const fp = sha(h.t);
        if (left.get(fp) > 0) { left.set(fp, left.get(fp) - 1); counts.frozen += h.k; continue; }
        add('dash-in-record', `${f.path}:${h.n} carries ${names(h.t)} on a line the baseline does not hold; a new or edited line in a record is written without one: "${clip(h.t)}"`);
      }
      for (const e of baseline.files[f.path] || []) {
        if (left.get(e.sha256) > 0) { add('dead-baseline', `${f.path}: baselined line "${e.preview}" (line ${e.line_at_baseline} when recorded) is no longer in the file; remove it from scripts/fixtures/dash-baseline.json`); left.set(e.sha256, 0); }
      }
      continue;
    }
    for (const h of hits) add('dash-in-file', `${f.path}:${h.n} carries ${names(h.t)}: "${clip(h.t)}"`);
  }

  for (const f of dist) {
    const c = classify(f.bytes);
    if (c.kind === 'unreadable') { add('unreadable', `dist/${f.path} could not be read as UTF-8`); continue; }
    if (c.kind !== 'text') continue;
    lines(c.text).forEach((t, i) => {
      const lit = t.match(DASH), ent = t.match(ENTITY), esc = t.match(ESCAPE);
      if (lit) add('dash-in-build', `dist/${f.path}:${i + 1} paints ${names(t)}: "${clip(t)}"`);
      if (ent) add('dash-in-build', `dist/${f.path}:${i + 1} carries the entity ${ent.join(', ')}, which paints a dash`);
      if (esc) add('dash-in-build', `dist/${f.path}:${i + 1} carries the escape ${esc.join(', ')}, which paints a dash`);
    });
  }

  for (const m of commits) {
    lines(m.message).forEach((t, i) => { if (has(t)) add('dash-in-commit', `commit ${m.sha.slice(0, 7)} message line ${i + 1} carries ${names(t)}: "${clip(t)}"`); });
  }
  if (pr) for (const [part, text] of [['title', pr.title || ''], ['body', pr.body || '']]) {
    lines(text).forEach((t, i) => { if (has(t)) add('dash-in-pr', `the pull request ${part}, line ${i + 1}, carries ${names(t)}: "${clip(t)}"`); });
  }
  return { problems, counts };
}

function baselineOf(files) {
  const out = { files: {} };
  for (const f of files) {
    if (!RECORDS.includes(f.path)) continue;
    const c = classify(f.bytes);
    if (c.kind !== 'text') continue;
    const byFp = new Map();
    lines(c.text).forEach((t, i) => {
      const k = (t.match(DASH) || []).length;
      if (!k) return;
      const fp = sha(t);
      if (byFp.has(fp)) byFp.get(fp).n++;
      else byFp.set(fp, { sha256: fp, n: 1, dashes: k, line_at_baseline: i + 1, preview: clip(t) });
    });
    out.files[f.path] = [...byFp.values()];
  }
  return out;
}
const baselineTotal = (b) => Object.values(b.files).flat().reduce((n, e) => n + e.n * e.dashes, 0);

/* --- self-test ------------------------------------------------------------------------- */
const EM = String.fromCodePoint(0x2014), EN = String.fromCodePoint(0x2013);
const T = (p, s) => ({ path: p, bytes: Buffer.from(s, 'utf8') });
const REC = `# Decisions\n\n## Old entry\n\nWritten before the rule ${EM} and frozen.\nA second ${EN} frozen line.\n`;
const B = baselineOf([T('DECISIONS.md', REC)]);
const jpegWithDash = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 16, 0x4a, 0x46, 0x49, 0x46, 0, 1]), Buffer.from(EM, 'utf8')]);
const CONTROL = () => ({
  files: [T('src/page.html', '<p>Luni-Sâmbătă 08:00-17:00, 5 − 3 = 2</p>\n'), T('DECISIONS.md', REC), T(AUDIT, `[{"title":"Gard ${EM} model","cards":[{"text":"Proiect ${EM} Chișinău","href":"/x"}],"slug":"a"}]`)],
  dist: [T('index.html', '<p>Rapid Construct: a hyphen-joined word</p>')],
  baseline: B,
  commits: [{ sha: 'a'.repeat(40), message: 'W26-13 A title: with a colon\n\nBody, with a hyphen-joined word.\n' }],
  pr: { title: 'W26-13 The dash gate', body: 'Plain text.' },
});
const withArm = (fn) => { const c = CONTROL(); fn(c); return c; };
const ARMS = [
  { arm: 'an em dash in an authored file', input: withArm((c) => c.files.push(T('docs/x.md', `A ${EM} B\n`))), want: 'dash-in-file' },
  { arm: 'an en dash in an authored file', input: withArm((c) => c.files.push(T('locales/ru.json', `{"a":"1${EN}2"}`))), want: 'dash-in-file' },
  { arm: 'a horizontal bar, the lookalike', input: withArm((c) => c.files.push(T('build.js', `// A ${String.fromCodePoint(0x2015)} B\n`))), want: 'dash-in-file', says: 'horizontal bar U+2015' },
  { arm: 'an HTML entity in the built site', input: withArm((c) => c.dist.push(T('ru/index.html', '<p>A &mdash; B</p>'))), want: 'dash-in-build' },
  { arm: 'a numeric entity in the built site', input: withArm((c) => c.dist.push(T('x.html', '<p>1&#8211;2</p>'))), want: 'dash-in-build' },
  { arm: 'a JS escape in a built script', input: withArm((c) => c.dist.push(T('main.js', "var s = ' \\u2014 ';"))), want: 'dash-in-build' },
  { arm: 'a new record entry with a dash', input: withArm((c) => { c.files[1] = T('DECISIONS.md', `${REC}\n## New entry\n\nWritten after ${EM} the rule.\n`); }), want: 'dash-in-record' },
  { arm: 'a frozen record line edited', input: withArm((c) => { c.files[1] = T('DECISIONS.md', REC.replace('and frozen', 'and thawed')); }), want: 'dead-baseline' },
  { arm: 'a commit message with a dash', input: withArm((c) => c.commits.push({ sha: 'b'.repeat(40), message: `W26-13 Fix ${EM} gate\n` })), want: 'dash-in-commit', says: 'em dash U+2014' },
  { arm: 'a pull request title with a dash', input: withArm((c) => { c.pr.title = `W26-13 ${EN} gate`; }), want: 'dash-in-pr' },
  { arm: 'an audit file with no quoted dash left', input: withArm((c) => { c.files[2] = T(AUDIT, '[{"title":"Gard: model"}]'); }), want: 'dead-exemption' },
  { arm: 'a dash in an audit field that is not a quoted title', input: withArm((c) => { c.files[2] = T(AUDIT, `[{"title":"Gard ${EM} model","note":"mine ${EN} here"}]`); }), want: 'dash-in-file' },
  { arm: 'GREEN: a JPEG whose bytes hold the dash', input: withArm((c) => c.files.push({ path: 'public/img/x.jpg', bytes: jpegWithDash })), want: null },
  { arm: 'GREEN: a new record entry with no dash', input: withArm((c) => { c.files[1] = T('DECISIONS.md', `${REC}\n## New entry\n\nWritten after the rule: plainly.\n`); }), want: null },
  { arm: 'GREEN: an escape written as text in a document', input: withArm((c) => c.files.push(T('docs/board/x.md', "`grep -c $'\\u2014'` expands to nothing here.\n"))), want: null },
];
const control = () => scan(CONTROL()).problems;
if (control().length) fail(`self-test control is not clean: ${control().map((p) => p.msg).join(' | ')}`);
if (baselineTotal(B) !== 2) fail(`self-test baseline holds ${baselineTotal(B)} dashes, expected 2.`);
for (const a of ARMS) {
  const got = scan(a.input).problems;
  if (a.want === null) { if (got.length) fail(`self-test GREEN arm "${a.arm}" was refused: ${got.map((p) => `${p.id}: ${p.msg}`).join(' | ')}`); continue; }
  if (!got.some((p) => p.id === a.want)) fail(`self-test arm "${a.arm}" did not fire "${a.want}"; it reported ${got.length ? got.map((p) => p.id).join(', ') : 'nothing'}.`);
  if (a.says && !got.some((p) => p.id === a.want && p.msg.includes(a.says))) fail(`self-test arm "${a.arm}" fired without naming "${a.says}": ${got.map((p) => p.msg).join(' | ')}`);
}

/* --- the tree ---------------------------------------------------------------------------- */
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'buffer', maxBuffer: 1 << 28 });
const listed = git('ls-files', '-z', '--cached', '--others', '--exclude-standard').toString('utf8').split('\0').filter(Boolean);
const present = listed.filter((p) => fs.existsSync(path.join(ROOT, p)) && fs.statSync(path.join(ROOT, p)).isFile());
const files = present.map((p) => ({ path: p, bytes: fs.readFileSync(path.join(ROOT, p)) }));

if (process.argv.includes('--print-baseline')) {
  const b = baselineOf(files);
  process.stdout.write(JSON.stringify({ _note: 'Generated by node scripts/check-dashes.js --print-baseline. See the header of that script.', ...b }, null, 2) + '\n');
  console.error(`baseline total: ${baselineTotal(b)} dashes on ${Object.values(b.files).flat().reduce((n, e) => n + e.n, 0)} lines`);
  process.exit(0);
}

/* Five arms on the shipping files, planted in memory. Each anchors on text that is there
   whether or not the file is clean, and is judged only on what the plant ADDS to the
   unplanted file's own result, so a real dash already in the file is reported by the real
   run below and is never read here as an arm that failed or a GREEN arm refused. */
if (!fs.existsSync(BASELINE_FILE)) fail('scripts/fixtures/dash-baseline.json is missing, so no record line can be judged.');
let baseline;
try { baseline = JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf8')); } catch (e) { fail(`scripts/fixtures/dash-baseline.json does not parse: ${e.message}`); }
const real = (p) => { const f = files.find((x) => x.path === p); if (!f) fail(`${p} is not in the tree, and the self-test plants into it.`); return f.bytes.toString('utf8'); };
const REAL_ARMS = [
  { arm: 'a dash in the header language switch label', file: 'src/template.html', edit: (s) => s.replace('aria-label="RO', `aria-label="RO ${EM}`), want: 'dash-in-file' },
  { arm: 'a dash in the Russian privacy sentence', file: 'locales/ru.json', edit: (s) => s.replace('"cookP": "', `"cookP": "${EM} `), want: 'dash-in-file' },
  { arm: 'a new DECISIONS.md entry with a dash', file: 'DECISIONS.md', edit: (s) => `${s}\n## Planted\n\nA sentence ${EM} with a dash.\n`, want: 'dash-in-record' },
  { arm: 'a frozen DECISIONS.md line edited', file: 'DECISIONS.md', edit: (s) => { const L = s.split('\n'); const i = L.findIndex(has); L[i] = `${L[i]} edited`; return L.join('\n'); }, want: 'dead-baseline' },
  { arm: 'GREEN: a new DECISIONS.md entry with no dash', file: 'DECISIONS.md', edit: (s) => `${s}\n## Planted\n\nA sentence: with none.\n`, want: null },
];
for (const a of REAL_ARMS) {
  const before = real(a.file);
  const after = a.edit(before);
  if (after === before) fail(`self-test real arm "${a.arm}" planted nothing: its anchor text is not in ${a.file} any more.`);
  const had = new Set(scan({ files: [T(a.file, before)], baseline }).problems.map((p) => `${p.id} ${p.msg}`));
  const got = scan({ files: [T(a.file, after)], baseline }).problems.filter((p) => !had.has(`${p.id} ${p.msg}`));
  if (a.want === null) { if (got.length) fail(`self-test GREEN real arm "${a.arm}" was refused: ${got.map((p) => p.msg).join(' | ')}`); continue; }
  if (!got.some((p) => p.id === a.want)) fail(`self-test real arm "${a.arm}" did not fire "${a.want}"; it reported ${got.length ? got.map((p) => p.id).join(', ') : 'nothing'}.`);
}
if (control().length) fail('self-test control is dirty after the arms.');
console.log(`self-test: ${ARMS.length} synthetic arms, ${ARMS.filter((a) => a.want === null).length} GREEN; ${REAL_ARMS.length} on the shipping files, ${REAL_ARMS.filter((a) => a.want === null).length} GREEN; each on its own message, control clean before and after`);

/* --- the real run ---------------------------------------------------------------------- */
for (const r of RECORDS) if (!files.some((f) => f.path === r)) fail(`the record ${r} is not in the tree. A record that vanished is not a record that passed.`);
if (!files.some((f) => f.path === AUDIT)) fail(`the audit file ${AUDIT} is not in the tree; remove its exemption.`);
for (const r of Object.keys(baseline.files || {})) if (!RECORDS.includes(r)) fail(`the baseline holds lines for ${r}, which is not a record.`);
const total = baselineTotal(baseline);
if (total > FROZEN_CEILING) fail(`the baseline holds ${total} dashes and may hold at most ${FROZEN_CEILING}. It can only shrink: a new dash in a record is rewritten, never baselined.`);

let dist = [];
if (!fs.existsSync(DIST)) fail('no dist/, run: node build.js');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
dist = walk(DIST).map((f) => ({ path: path.relative(DIST, f).split(path.sep).join('/'), bytes: fs.readFileSync(f) }));

/* Commits. In a pull request, exactly the commits GitHub counts; on a workstation, this
   branch's own commits past origin/main when that ref exists. */
const envv = (k) => { const v = process.env[k]; return v && !/^\$\{\{/.test(v) ? v : ''; };
let commits = [], commitSource, pr = null;
const read = (range) => git('log', '--format=%H%x1f%B%x1e', ...range).toString('utf8').split('\x1e').map((s) => s.replace(/^\n+/, '')).filter(Boolean).map((s) => { const [h, m] = s.split('\x1f'); return { sha: h, message: m || '' }; });
if (envv('PR_HEAD_SHA')) {
  const n = Number(envv('PR_COMMITS'));
  if (!Number.isInteger(n) || n < 1) fail(`PR_COMMITS reads "${envv('PR_COMMITS')}", so the pull request's commits cannot be counted.`);
  try { git('fetch', '--no-tags', '--quiet', `--depth=${n}`, 'origin', envv('PR_HEAD_SHA')); } catch (e) { fail(`could not fetch the pull request head ${envv('PR_HEAD_SHA')}: ${e.message.split('\n')[0]}`); }
  commits = read(['-n', String(n), envv('PR_HEAD_SHA')]);
  if (commits.length !== n) fail(`read ${commits.length} of the pull request's ${n} commit messages.`);
  pr = { title: process.env.PR_TITLE || '', body: process.env.PR_BODY || '' };
  commitSource = `pull request head ${envv('PR_HEAD_SHA').slice(0, 7)}, ${n} commit(s), and its title and body`;
} else if (process.env.GITHUB_EVENT_NAME === 'pull_request') {
  fail('this is a pull request run and PR_HEAD_SHA is not set, so no commit message would be read.');
} else {
  let base = '';
  try { base = git('rev-parse', '--verify', '--quiet', 'origin/main').toString('utf8').trim(); } catch { base = ''; }
  if (base) { commits = read([`${base}..HEAD`]); commitSource = `this branch past origin/main (${base.slice(0, 7)}), ${commits.length} commit(s)`; }
  else commitSource = 'NOT READ: not a pull request and no origin/main here';
}

const { problems, counts } = scan({ files, dist, baseline, commits, pr });
if (counts.text === 0) fail('zero text files read, so nothing was checked.');
const distText = dist.filter((f) => classify(f.bytes).kind === 'text').length;
if (distText === 0) fail('zero text files in dist/, so the built site was not checked.');

console.log(`tree: ${files.length} files; text read ${counts.text}; skipped by their bytes: ${Object.entries(counts.skipped).map(([k, v]) => `${k} ${v}`).join(', ') || 'none'}`);
console.log(`records: ${RECORDS.join(', ')}; frozen dashes present ${counts.frozen} of the baseline's ${total}; ceiling ${FROZEN_CEILING}`);
console.log(`  exempt by W26-R15: ${AUDIT}, ${counts.exempt[AUDIT] || 0} dash(es), each inside a third-party title quoted verbatim (fields: ${AUDIT_QUOTED.join(', ')})`);
console.log(`built site: ${dist.length} files in dist/, ${distText} read as text`);
console.log(`commit messages: ${commitSource}`);
if (problems.length) {
  console.error(`\nDASH GATE FAILED: ${problems.length} problem(s)`);
  for (const p of problems) console.error(`  [${p.id}] ${p.msg}`);
  process.exit(1);
}
console.log('\nno em dash, en dash or lookalike in any authored file, the built site or these commits; every record line that keeps one is in the baseline.');
