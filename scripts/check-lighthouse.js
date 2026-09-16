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
  for (const p of PAGES) {
    const f = path.join(DIST, p.path === '/' ? 'index.html' : path.join(p.path, 'index.html'));
    if (!fs.existsSync(f)) fail(`${path.relative(ROOT, f)} is missing, so a locale was not built`);
  }

  const server = await serve();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rc-lh-'));
  const rows = [];
  let bad = 0;

  try {
    for (const p of PAGES) {
      const url = `http://127.0.0.1:${PORT}${p.path}`;
      const out = path.join(tmp, `${p.label.replace(/\W+/g, '-')}.json`);
      const report = await runLighthouse(url, out);

      const row = { label: p.label, scores: {} };
      for (const cat of Object.keys(FLOORS)) {
        const c = report.categories && report.categories[cat];
        if (!c) fail(`${p.label}: lighthouse returned no "${cat}" category`);
        if (typeof c.score !== 'number') {
          fail(`${p.label}: "${cat}" has no numeric score (got ${JSON.stringify(c.score)}).\n  A missing score is not a pass.`);
        }
        row.scores[cat] = c.score;
        if (c.score + 1e-9 < FLOORS[cat]) bad++;
      }
      rows.push(row);
    }
  } finally {
    server.close();
  }

  console.log(`lighthouse ${LH_VERSION} via ${RUNNER.cmd}${RUNNER.pre.length ? ' ' + RUNNER.pre.join(' ') : ''}, desktop preset, floors from docs/CLAUDE.md section 4\n`);
  console.log('page'.padEnd(16) + 'performance'.padStart(13) + 'accessibility'.padStart(15));
  for (const r of rows) {
    const line = r.label.padEnd(16)
      + `${Math.round(r.scores.performance * 100)}`.padStart(13)
      + `${Math.round(r.scores.accessibility * 100)}`.padStart(15);
    const under = Object.keys(FLOORS).filter((c) => r.scores[c] + 1e-9 < FLOORS[c]);
    console.log(line + (under.length ? `   UNDER FLOOR: ${under.join(', ')}` : ''));
  }
  console.log(`\nfloors: performance ${FLOORS.performance * 100}, accessibility ${FLOORS.accessibility * 100}`);

  if (bad) {
    console.error(`\n${bad} category score(s) below the section 4 floors.`);
    process.exit(1);
  }
  console.log('both locales at or above the section 4 floors.');
}

main().catch((e) => { console.error(e); process.exit(1); });
