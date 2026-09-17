#!/usr/bin/env node
/* Lighthouse gate, docs/CLAUDE.md section 11 gate 5, card RC-131 (W16-04).

   Gate 5 has been in the list since wave 1 and has NEVER executed: there was no
   binary and the repo has no dependencies. Every card that reported it reported
   it as NOT RUN. A gate nobody has watched fail is not a gate (section 13), so
   it either runs or it goes. This makes it run.

   NO DEPENDENCY IS ADDED. The repo still has no package.json, no lockfile and
   nothing vendored, which is a documented property of this build (section 1,
   master plan section 8). Lighthouse is invoked through `npx` at a PINNED
   version, fetched at run time and never committed.

   IT NEVER SKIPS. If lighthouse cannot be invoked, if the report will not parse,
   if the run reports a runtimeError, or if a category score is missing rather
   than low, this FAILS. A gate that goes green because it could not measure is
   the exact failure section 13 exists to prevent, and is how gate 5 spent its
   whole life until now.

   THREE RUNS PER PAGE, AND THE MEDIAN IS WHAT IS JUDGED (W21-02, RC-147). Wave
   20 took two false reds on the RO homepage's performance, 88 and 93 against the
   95 floor, while the same commit read 99 on the re-run and 99 on 8 of 8 local
   runs with identical metrics. A single audit on a cold CI runner is noisy, and a
   gate that cries wolf gets ignored, which is the failure mode section 16 warns
   about. So each page is audited three times and the MEDIAN of each category is
   compared with the floor: one bad run cannot fail the build, and two agreeing
   bad runs still do.

   THE FLOOR IS NOT LOWERED, and this file must not lower it. If the median
   breaches it, the run fails and prints all three readings and their spread, so
   the report says whether the cause is the build or the runner. Every run prints
   the spread whether it passes or fails, and says so when the spread is wide
   enough to be worth reading.

   Usage:  node build.js && node scripts/check-lighthouse.js
   Override the binary with CHROME_PATH if Chrome is not where lighthouse looks. */

const { execFileSync, spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PORT = Number(process.env.LH_PORT || 8731);
const LH_VERSION = '13.4.1';

const fail = (msg) => { console.error(`\nLIGHTHOUSE GATE FAILED: ${msg}\n`); process.exit(1); };

/* The floors are owned by docs/CLAUDE.md section 4, which is the one place they
   are chosen. They are restated here because a script cannot read prose, the
   same way scripts/verify-live.js restates R-Y's budgets and R-Y names it as the
   place they are enforced. Section 4 carries the reciprocal pointer: change one
   and the other must change with it. */
const FLOORS = { performance: 0.95, accessibility: 1.0 };

/* RC-147. Three is the card's number: the smallest odd count that has a median,
   and one outlier short of changing it. WIDE_SPREAD is only a reporting
   threshold, never a pass or fail: 3 points is where wave 20's noise sat. */
const RUNS = 3;
const WIDE_SPREAD = 0.03;

/* The median of an odd-length list of scores. Asserted below on known vectors,
   printed every run: a statistic nobody has watched work is not evidence. */
const median = (xs) => [...xs].sort((a, b) => a - b)[(xs.length - 1) / 2];
const MEDIAN_VECTORS = [
  { in: [0.88, 0.99, 0.99], want: 0.99 },   // wave 20's first false red, twice agreed against
  { in: [0.93, 0.99, 0.99], want: 0.99 },   // wave 20's second
  { in: [0.99, 0.93, 0.88], want: 0.93 },   // two low readings: the median is low too
  { in: [0.94, 0.94, 0.99], want: 0.94 },   // under the floor on two of three
  { in: [1, 1, 1], want: 1 },
];
for (const v of MEDIAN_VECTORS) {
  if (median(v.in) !== v.want) fail(`the median is wrong: median(${v.in.join(', ')}) returned ${median(v.in)}, want ${v.want}.`);
}
console.log(`median asserted on ${MEDIAN_VECTORS.length} known vectors, including wave 20's two false reds (${MEDIAN_VECTORS.map((v) => `[${v.in.map((x) => Math.round(x * 100)).join(' ')}]->${Math.round(v.want * 100)}`).join(', ')})`);

/* Section 4: both locales, desktop preset. */
const PAGES = [
  { path: '/', label: 'homepage RO' },
  { path: '/ru/', label: 'homepage RU' },
];

const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain' };

function serve() {
  return new Promise((res) => {
    const s = http.createServer((rq, rs) => {
      let f = path.join(DIST, decodeURIComponent(rq.url.split('?')[0]));
      if (f.endsWith('/')) f = path.join(f, 'index.html');
      if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) {
        if (fs.existsSync(f + '/index.html')) f = f + '/index.html';
        else { rs.writeHead(404); rs.end('not found'); return; }
      }
      rs.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(rs);
    });
    s.listen(PORT, '127.0.0.1', () => res(s));
  });
}

/* How lighthouse is found, in order, with no silent fallback at the end.

   --yes is deliberately NOT used. Measured on 2026-09-16: `npx --yes
   lighthouse@13.4.1` hung past a 300s timeout, while the same audit through the
   cached binary finished in 10.7s. --yes sends npx down an install path; every
   rung below uses a binary that is already there.

   CI has no npx cache, so quality.yml installs lighthouse globally at the pinned
   version first and rung 2 picks it up off PATH. Locally rung 3 finds the cached
   copy. If no rung works the gate FAILS: it does not skip. */
function resolveRunner() {
  const probe = (cmd, pre) => {
    try {
      execFileSync(cmd, [...pre, '--version'], { stdio: 'ignore', timeout: 60000 });
      return { cmd, pre };
    } catch { return null; }
  };
  if (process.env.LIGHTHOUSE_BIN) {
    const r = probe(process.env.LIGHTHOUSE_BIN, []);
    if (r) return r;
    fail(`LIGHTHOUSE_BIN is set to "${process.env.LIGHTHOUSE_BIN}" but it does not run.`);
  }
  return probe('lighthouse', [])
    || probe('npx', ['--no-install', 'lighthouse'])
    || fail('lighthouse is not available: not on PATH, and no cached copy for npx.\n'
          + '  CI installs it in a prior step; locally, run: npm i -g lighthouse@' + LH_VERSION + '\n'
          + '  This gate does not skip. An unavailable binary is a finding, not a pass.');
}
const RUNNER = resolveRunner();

/* Why this is async, and must stay async.

   The static server above runs IN THIS PROCESS. execFileSync blocks the Node
   event loop for its whole duration, so while it waited, the server could not
   answer a single request: lighthouse sat waiting for a page that could never
   arrive and the sync call burned its entire timeout. Measured 2026-09-16: the
   identical command against a server in a SEPARATE process finished in 10.7s,
   while in-process it timed out at 300s and again at 180s.

   spawn keeps the loop free, so the server serves while lighthouse audits. */
function runOnce(cmd, args, ms) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
    let err = '';
    child.stderr.on('data', (d) => { err += d.toString(); });
    const timer = setTimeout(() => { child.kill('SIGKILL'); reject(new Error(`timed out after ${ms}ms`)); }, ms);
    child.on('error', (e) => { clearTimeout(timer); reject(e); });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) resolve();
      else reject(new Error(`exited ${code}${err ? ': ' + err.trim().slice(0, 400) : ''}`));
    });
  });
}

async function runLighthouse(url, outFile) {
  const args = [
    ...RUNNER.pre, url,
    '--preset=desktop',
    '--only-categories=performance,accessibility',
    '--output=json', `--output-path=${outFile}`,
    '--quiet',
    '--chrome-flags=--headless=new --hide-scrollbars --no-first-run --no-default-browser-check',
  ];
  try {
    // 180s per page against a measured 10.7s: generous for a cold CI runner,
    // short enough that a hang is reported rather than waited on.
    await runOnce(RUNNER.cmd, args, 180000);
  } catch (e) {
    const detail = e.message;
    fail(`lighthouse could not be run for ${url}.\n  ${detail}\n\n  This gate does not skip. If lighthouse is unavailable here, that is a\n  finding about the environment, not a pass.`);
  }
  if (!fs.existsSync(outFile)) fail(`lighthouse produced no report for ${url}`);
  let report;
  try { report = JSON.parse(fs.readFileSync(outFile, 'utf8')); } catch (e) { fail(`lighthouse report for ${url} did not parse: ${e.message}`); }
  if (report.runtimeError && report.runtimeError.code !== 'NO_ERROR') {
    fail(`lighthouse reported a runtime error for ${url}: ${report.runtimeError.code} ${report.runtimeError.message || ''}`);
  }
  return report;
}

async function main() {
  if (!fs.existsSync(DIST)) fail('no dist/, run: node build.js');
  /* W18-03 (RC-140). An empty PAGES list used to audit nothing and print "both
     locales at or above the section 4 floors", exit 0. */
  if (PAGES.length === 0) fail('zero pages to audit, so no floor was checked.');
  for (const p of PAGES) {
    const f = path.join(DIST, p.path === '/' ? 'index.html' : path.join(p.path, 'index.html'));
    if (!fs.existsSync(f)) fail(`${path.relative(ROOT, f)} is missing, so a locale was not built`);
  }

  console.log(`files read: ${PAGES.length} of ${PAGES.length} pages in dist/ (${PAGES.map((p) => p.label).join(', ')})`);
  console.log(`runs per page: ${RUNS}; the median of each category is what the floor judges\n`);
  const server = await serve();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rc-lh-'));
  const rows = [];
  let bad = 0;
  let reports = 0;

  try {
    for (const p of PAGES) {
      const url = `http://127.0.0.1:${PORT}${p.path}`;
      const row = { label: p.label, runs: [], scores: {}, spread: {} };
      for (let i = 1; i <= RUNS; i++) {
        const out = path.join(tmp, `${p.label.replace(/\W+/g, '-')}-${i}.json`);
        const report = await runLighthouse(url, out);
        reports++;
        const run = {};
        for (const cat of Object.keys(FLOORS)) {
          const c = report.categories && report.categories[cat];
          if (!c) fail(`${p.label}, run ${i} of ${RUNS}: lighthouse returned no "${cat}" category`);
          if (typeof c.score !== 'number') {
            fail(`${p.label}, run ${i} of ${RUNS}: "${cat}" has no numeric score (got ${JSON.stringify(c.score)}).\n  A missing score is not a pass.`);
          }
          run[cat] = c.score;
        }
        row.runs.push(run);
        console.log(`  ${p.label}, run ${i} of ${RUNS}: ${Object.keys(FLOORS).map((cat) => `${cat} ${Math.round(run[cat] * 100)}`).join(', ')}`);
      }
      /* Presence, not silence: a page with fewer readings than RUNS has no median
         anybody may judge, so it fails rather than being judged on what arrived. */
      if (row.runs.length !== RUNS) fail(`${p.label}: ${row.runs.length} of ${RUNS} runs produced a score, so there is no median to compare.`);
      for (const cat of Object.keys(FLOORS)) {
        const xs = row.runs.map((r) => r[cat]);
        row.scores[cat] = median(xs);
        row.spread[cat] = Math.max(...xs) - Math.min(...xs);
        if (row.scores[cat] + 1e-9 < FLOORS[cat]) bad++;
      }
      rows.push(row);
    }
  } finally {
    server.close();
  }

  console.log(`lighthouse ${LH_VERSION} via ${RUNNER.cmd}${RUNNER.pre.length ? ' ' + RUNNER.pre.join(' ') : ''}, desktop preset, floors from docs/CLAUDE.md section 4\n`);
  const pc = (x) => `${Math.round(x * 100)}`;
  console.log('\npage'.padEnd(17) + 'performance'.padStart(13) + 'accessibility'.padStart(15) + '   median of the three runs, then the three runs');
  for (const r of rows) {
    const line = r.label.padEnd(16)
      + pc(r.scores.performance).padStart(13)
      + pc(r.scores.accessibility).padStart(15)
      + `   perf [${r.runs.map((x) => pc(x.performance)).join(' ')}] a11y [${r.runs.map((x) => pc(x.accessibility)).join(' ')}]`;
    const under = Object.keys(FLOORS).filter((c) => r.scores[c] + 1e-9 < FLOORS[c]);
    console.log(line + (under.length ? `   UNDER FLOOR: ${under.join(', ')}` : ''));
  }
  console.log('\nspread of the three runs, per page and category (max minus min):');
  for (const r of rows) {
    console.log(`  ${r.label.padEnd(16)}${Object.keys(FLOORS).map((cat) => `${cat} ${pc(r.spread[cat])}`).join(', ')}`
      + (Object.keys(FLOORS).some((cat) => r.spread[cat] + 1e-9 >= WIDE_SPREAD) ? `   WIDE: ${WIDE_SPREAD * 100} points or more between runs on this page, so a single-run reading here is not evidence` : ''));
  }
  console.log(`\nfloors: performance ${FLOORS.performance * 100}, accessibility ${FLOORS.accessibility * 100} (docs/CLAUDE.md section 4; this gate never lowers them)`);
  console.log(`reports read: ${reports} of ${PAGES.length * RUNS}; pages with a median: ${rows.length} of ${PAGES.length}`);
  if (reports !== PAGES.length * RUNS) fail(`${reports} lighthouse reports read for ${PAGES.length} pages at ${RUNS} runs each.`);
  if (rows.length !== PAGES.length) fail(`${rows.length} pages produced a median for ${PAGES.length} pages.`);

  if (bad) {
    console.error(`\n${bad} MEDIAN category score(s) below the section 4 floors.`);
    console.error('  The median of three runs is below the floor, so this is not one noisy run.');
    console.error('  Read the three readings and the spread above: a wide spread with one reading');
    console.error('  far from the others points at the runner, a tight spread at the build. Report');
    console.error('  the spread and recommend; the floor is section 4\'s and is not lowered here.');
    process.exit(1);
  }
  console.log('both locales at or above the section 4 floors, on the median of three runs each.');
}

main().catch((e) => { console.error(e); process.exit(1); });
