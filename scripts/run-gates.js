#!/usr/bin/env node
/* Runs every gate `quality` runs, locally, by READING `.github/workflows/quality.yml`.
   Card W25-03c opened Q-W25-09; this is its option (b), shipped.

   WHY IT EXISTS. The list of gate commands a terminal runs locally had never been
   committed. It was retyped from `quality.yml` each session, it went stale when
   gates 21 and 22 landed, and four wave 25 cards then reported "19 of 19" while
   `quality` ran 21 commands. The branches were fine, because CI ran the real list.
   The reports were not true. A second copy of a list is what went stale, so this
   deletes the second copy: there is one list, `quality.yml` owns it, and this
   executes it.

       node scripts/run-gates.js              run them all, stop at the first failure
       node scripts/run-gates.js --keep-going run them all, report every failure
       node scripts/run-gates.js --list       print the list and run nothing

   WHAT IT IS NOT. Not a YAML parser. It reads the one shape `quality.yml` is
   written in, which is a flat `steps:` list of `- name:` / `run:` / `env:`, and
   it FAILS rather than guesses if that shape stops holding: no steps, a `run:`
   block it cannot read, or a step with a `run` and no `name`. A silent partial
   read here would reproduce the exact defect it exists to stop.

   `uses:` steps are skipped and counted out loud, because `actions/checkout` and
   `setup-node` are the runner's job and not a gate. So is the pinned Lighthouse
   install: it is a dependency step, and the gate is the `check-lighthouse.js`
   line after it. Anything skipped is printed with its reason, never dropped.

   Each command is its own process and its own exit code is read and printed
   (R-AB). Zero dependency. */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const WF = path.join(ROOT, '.github/workflows/quality.yml');
const die = (msg) => { console.error(`\nRUN-GATES FAILED: ${msg}\n`); process.exit(1); };

if (!fs.existsSync(WF)) die('.github/workflows/quality.yml is missing, and it is the only list of gates there is.');
const lines = fs.readFileSync(WF, 'utf8').split('\n');

/* The shape: under `steps:`, each item starts at `- ` and its keys are indented
   two further. A `run:` is either one line or a `|` block whose body is indented
   past the key. Comments and blank lines inside a block belong to the block. */
const steps = [];
let i = lines.findIndex((l) => /^\s*steps:\s*$/.test(l));
if (i < 0) die('quality.yml has no `steps:` key, so nothing could be read from it.');

let cur = null;
const flush = () => { if (cur) steps.push(cur); cur = null; };
for (i += 1; i < lines.length; i++) {
  const line = lines[i];
  if (/^\S/.test(line) && line.trim()) break;                    // left the job
  const m = line.match(/^(\s*)- (.*)$/);
  if (m && m[1].length <= 6) {                                   // a new step
    flush();
    cur = { name: null, run: null, uses: null, env: {} };
    const rest = m[2];
    const kv = rest.match(/^(name|run|uses):\s*(.*)$/);
    if (kv) cur[kv[1]] = kv[2].trim();
    continue;
  }
  if (!cur) continue;
  const kv = line.match(/^\s{6,}(name|run|uses):\s*(.*)$/);
  if (kv) {
    const [, key, val] = kv;
    if (key === 'run' && (val.trim() === '|' || val.trim() === '|-')) {
      const body = [];
      const indent = line.match(/^(\s*)/)[1].length + 2;
      for (let j = i + 1; j < lines.length; j++) {
        const b = lines[j];
        if (b.trim() === '') { body.push(''); continue; }
        if (b.match(/^(\s*)/)[1].length < indent) break;
        body.push(b.slice(indent));
        i = j;
      }
      cur.run = body.join('\n').trim();
      if (!cur.run) die(`the \`run: |\` block for step "${cur.name}" read as empty. A step this cannot read is not a step it may skip.`);
    } else cur[key] = val.trim();
    continue;
  }
  const ev = line.match(/^\s{8,}([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
  if (ev && cur.env) cur.env[ev[1]] = ev[2].trim().replace(/^["']|["']$/g, '');
}
flush();

if (!steps.length) die('quality.yml parsed to zero steps. An empty list would report "0 of 0 green", which is the failure this script exists to prevent.');

const skipped = [];
const gates = [];
for (const s of steps) {
  if (s.uses) { skipped.push({ what: s.uses, why: 'a runner action, not a gate' }); continue; }
  if (!s.run) { skipped.push({ what: s.name || '(unnamed)', why: 'no run: command' }); continue; }
  if (!s.name) die('a step has a `run:` and no `name:`. This reads names to report them, so an unnamed gate would be run and reported as nothing.');
  if (/^npm install -g /.test(s.run)) { skipped.push({ what: s.name, why: 'a dependency install, and the gate is the step that follows it' }); continue; }
  gates.push(s);
}

console.log(`read ${steps.length} steps from .github/workflows/quality.yml`);
for (const s of skipped) console.log(`  skipped: ${s.what}  (${s.why})`);
console.log(`gate commands to run: ${gates.length}\n`);
if (!gates.length) die('zero gate commands found, so a clean run would mean nothing.');

if (process.argv.includes('--list')) {
  for (const g of gates) console.log(`${g.name}\n    ${g.run.replace(/\n/g, '\n    ')}`);
  process.exit(0);
}

const keepGoing = process.argv.includes('--keep-going');
const failed = [];
for (const g of gates) {
  const started = process.hrtime.bigint();
  const r = spawnSync('bash', ['-c', g.run], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], env: Object.assign({}, process.env, g.env) });
  const secs = Number((process.hrtime.bigint() - started) / 1000000n) / 1000;
  const code = r.status === null ? 1 : r.status;
  console.log(`${code === 0 ? 'ok  ' : 'FAIL'}  exit ${String(code).padEnd(3)} ${secs.toFixed(1).padStart(6)}s  ${g.name}`);
  if (code !== 0) {
    failed.push(g.name);
    const out = `${r.stdout || ''}${r.stderr || ''}`.trim().split('\n').slice(-25).join('\n');
    console.error(`\n${out}\n`);
    if (!keepGoing) break;
  }
}

console.log(`\n${gates.length - failed.length} of ${gates.length} gate commands exit 0.`);
if (failed.length) {
  console.error(`failing: ${failed.join(', ')}`);
  process.exit(1);
}
