#!/usr/bin/env node
/* Template-literal gate, card W26-04.

       node scripts/check-template-literals.js [file ...]

   A BACKTICK WRITTEN INSIDE A TEMPLATE LITERAL DOES NOT FAIL. It ends the
   literal, the rest of the sentence becomes code, and the next backtick opens a
   new one. The file still parses. `node --check` exits 0 on it. What changes is
   the VALUE: two template literals with an expression between them is a tagged
   template, or a multiplication, and the function quietly returns a string that
   is not the one written, or NaN.

   IT HAS HAPPENED THREE TIMES IN THIS REPO AND EVERY GATE WAS GREEN EACH TIME:

     · W24-09a. A comment inside verify-live.js's PROBE discussed class names in
       backticks. Loading the file threw TypeError. Nineteen gates were green,
       `quality` passed in 6m10s, it reached main, and gate 9's post-merge run
       found it. Gate 21 was written then and guards THAT ONE FILE.
     · W26-04, build.js. An HTML comment inside bentoSection's returned literal
       wrote `.pb__*` in backticks. The function returned NaN, BOTH bentos
       vanished from the roofing page, and the build exited 0. Nothing caught it;
       it was found by looking at the page.
     · W26-04, check-layout-geometry.js. The same sentence, in the browser probe,
       an hour later. "is not a function".

   Twice is a pattern and three times is a gate.

   WHAT IT CHECKS, and why these two rules and not "no backtick in a comment",
   which is unobservable: after the parser has run, a backtick that ended a
   literal early is invisible as a backtick. What it leaves behind is a SEVERED
   COMMENT, and that is visible.

     1. A COMMENT OPENED INSIDE A TEMPLATE LITERAL MUST CLOSE INSIDE IT.
        A literal holding an HTML comment opener with no closer, or a JS block
        opener with no closer, is a comment the literal was cut in half through.
        All three incidents read exactly like that: one literal ends mid-comment
        and the next begins mid-comment. (The four tokens are not written out in
        this comment: a block-comment closer inside a block comment ends it, which
        is the same class of trap one level up, and it cost a run to find.)
     2. A STRING LITERAL IMMEDIATELY FOLLOWED BY A TEMPLATE LITERAL is a tagged
        template whose tag is a string, which is never written on purpose. That is
        W24-09a's precise shape.

   It is deliberately narrow. A looser rule ("no backtick in any comment") fires on
   this file's own prose and on every comment in the repo that quotes a class name,
   and a noisy gate gets worked around (gate 22's lesson).

   Zero dependencies. */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const fail = (m) => { console.error(`\nTEMPLATE LITERAL GATE FAILED: ${m}\n`); process.exit(1); };

/* The scanner. It tracks single and double quoted strings, template literals to
   any depth (a literal can hold an expression that holds another literal), line
   and block comments, and regex literals, because a regex can hold a quote and a
   comment can hold anything. It returns every template literal's own text. */
function scan(src) {
  const lits = [];
  const pairs = [];
  /* ONE PASS, AN EXPLICIT STACK, NO RECURSION. The first version recursed on a
     nested literal and added back how far the RECURSIVE call had got, which was
     the end of the file: everything after the first interpolated literal went
     unread, and the gate reported clean on the very defect it was written for.
     It was caught by planting that defect back into build.js and watching this
     say nothing (R-AB). A scanner that stops early looks exactly like a clean
     file, which is docs/CLAUDE.md section 13's own case.

     Frames are either a template literal collecting its text, or an interpolation
     tracking its brace depth. Strings, comments and regex literals are consumed
     wherever they appear, inside an interpolation as much as at the top. */
  const frames = [];
  const top = () => frames[frames.length - 1];
  const lineAt = (at) => src.slice(0, at).split('\n').length;
  let i = 0;
  let prev = null;
  let prevEnd = -1;

  const inTpl = () => top() && top().kind === 'tpl';
  const add = (t) => { if (inTpl()) top().text += t; };

  const isRegexPos = () => {
    for (let k = i - 1; k >= 0; k--) {
      const c = src[k];
      if (/\s/.test(c)) continue;
      return !/[\w$)\]]/.test(c);
    }
    return true;
  };

  while (i < src.length) {
    if (inTpl()) {
      if (src[i] === '\\') { add(src.slice(i, i + 2)); i += 2; continue; }
      if (src.slice(i, i + 2) === '${') { frames.push({ kind: 'expr', depth: 1 }); i += 2; continue; }
      if (src[i] === '`') {
        const f = frames.pop();
        lits.push({ start: f.start, text: f.text, line: f.line });
        pairs.push({ before: f.before, at: f.start, line: f.line });
        prev = 'template'; prevEnd = i + 1; i++;
        continue;
      }
      add(src[i]); i++;
      continue;
    }

    const c = src[i];
    const two = src.slice(i, i + 2);
    if (two === '//') { const n = src.indexOf('\n', i); i = n === -1 ? src.length : n; continue; }
    if (two === '/*') { const n = src.indexOf('*/', i + 2); i = n === -1 ? src.length : n + 2; continue; }
    if (c === '/' && isRegexPos()) {
      let k = i + 1, cls = false;
      for (; k < src.length; k++) {
        if (src[k] === '\\') { k++; continue; }
        if (src[k] === '[') cls = true;
        else if (src[k] === ']') cls = false;
        else if (src[k] === '/' && !cls) break;
        else if (src[k] === '\n') break;
      }
      i = k + 1; prev = 'other'; prevEnd = i;
      continue;
    }
    if (c === "'" || c === '"') {
      const q = c; let k = i + 1;
      for (; k < src.length; k++) {
        if (src[k] === '\\') { k++; continue; }
        if (src[k] === q || src[k] === '\n') break;
      }
      i = k + 1; prev = 'string'; prevEnd = i;
      continue;
    }
    if (c === '`') {
      frames.push({ kind: 'tpl', text: '', start: i, line: lineAt(i), before: prev });
      i++;
      continue;
    }
    if (top() && top().kind === 'expr') {
      if (c === '{') { top().depth++; i++; prev = 'other'; continue; }
      if (c === '}') {
        top().depth--;
        if (!top().depth) frames.pop();
        i++; prev = 'other';
        continue;
      }
    }
    if (!/\s/.test(c)) { prev = 'other'; prevEnd = i + 1; }
    i++;
  }
  /* An unterminated literal at end of file is a literal all the same, and its
     text is what this gate judges. */
  while (frames.length) {
    const f = frames.pop();
    if (f.kind === 'tpl') { lits.push({ start: f.start, text: f.text, line: f.line }); pairs.push({ before: f.before, at: f.start, line: f.line }); }
  }
  return { lits, pairs };
}

function problems(src, where) {
  const out = [];
  const { lits, pairs } = scan(src);
  for (const lit of lits) {
    const count = (s, n) => s.split(n).length - 1;
    if (count(lit.text, '<!--') !== count(lit.text, '-->')) {
      out.push({ id: 'severed-html-comment', text: `${where}:${lit.line}: a template literal holds ${count(lit.text, '<!--')} "<!--" and ${count(lit.text, '-->')} "-->". A comment opened inside a literal closes inside it; an imbalance means a backtick in that comment ended the literal early.` });
    }
    if (count(lit.text, '/*') !== count(lit.text, '*/')) {
      out.push({ id: 'severed-block-comment', text: `${where}:${lit.line}: a template literal holds ${count(lit.text, '/*')} "/*" and ${count(lit.text, '*/')} "*/". Same defect, in a JS comment.` });
    }
  }
  for (const p of pairs) {
    if (p.before === 'string') {
      out.push({ id: 'string-tagged-template', text: `${where}:${p.line}: a string literal is immediately followed by a template literal, which is a tagged template whose tag is a string. That is W24-09a's shape and it is never written on purpose.` });
    }
  }
  return out;
}

/* --- the self-test, before any real result -------------------------------- */

const ARMS = [
  { arm: 'W26-04, build.js: an HTML comment inside a returned literal, cut by a backtick',
    want: 'severed-html-comment',
    src: 'function f(P) { return `<div>\\n  <!-- the prefix is `.pb__*` and it takes anchors -->\\n  <p class="${P}">x</p>\\n</div>`; }' },
  { arm: 'W24-09a, verify-live.js: a JS comment inside a probe, cut by a backtick',
    want: 'severed-block-comment',
    src: 'const PROBE = `(() => {\\n  /* the classes are `.a` and `.b` */\\n  return 1;\\n})()`;' },
  { arm: 'a string literal immediately followed by a template literal',
    want: 'string-tagged-template',
    src: 'const x = "some prose" `<div>${y}</div>`;' },
  /* GREEN: the shapes it MUST accept. A rule that refuses these is a rule nobody
     can work under, which is the defect a green arm catches (W25-20). */
  { arm: 'GREEN: a balanced HTML comment inside a literal', want: null,
    src: 'const h = `<div>\\n  <!-- a perfectly ordinary comment -->\\n  <p>${x}</p>\\n</div>`;' },
  { arm: 'GREEN: a real tagged template, String.raw', want: null,
    src: 'const re = new RegExp(String.raw`^\\\\s*name:\\\\s*(\\\\d+)`, "gm");' },
  { arm: 'GREEN: a backtick inside a BLOCK COMMENT outside any literal', want: null,
    src: '/* the class is `.hub__tile` and nothing here is a literal */\\nconst a = 1;' },
  { arm: 'GREEN: a literal holding an apostrophe, a quote and a slash', want: null,
    src: "const s = `it's \"quoted\" and a/b <!-- ok --> ${z}`;" },
  { arm: 'GREEN: a nested literal inside an interpolation', want: null,
    src: 'const s = `<a>${items.map((i) => `<b>${i}</b>`).join("")}</a>`;' },
];

let red = 0, green = 0;
for (const t of ARMS) {
  const got = problems(t.src.replace(/\\n/g, '\n'), 'self-test');
  if (t.want === null) {
    if (got.length) fail(`the GREEN arm "${t.arm}" must be accepted and was refused: ${got.map((p) => p.id).join(', ')}. A rule that refuses what it should allow is as broken as one that allows what it should refuse.`);
    green++;
    console.log(`self-test GREEN arm accepted, as it must be: ${t.arm}`);
    continue;
  }
  if (!got.some((p) => p.id === t.want)) {
    fail(`the self-test arm "${t.arm}" did not fire on its own message "${t.want}". It reported: ${got.length ? got.map((p) => p.id).join(', ') : 'nothing'}.`);
  }
  red++;
  console.log(`self-test arm fired on its own message: ${t.arm} -> ${t.want}`);
}
console.log(`self-test: ${red + green} arms, ${green} of them green`);

/* --- the real run --------------------------------------------------------- */

function jsFiles() {
  const out = [];
  const walk = (rel) => {
    for (const e of fs.readdirSync(path.join(ROOT, rel), { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name === '.git' || e.name === 'dist') continue;
      const p = rel ? rel + '/' + e.name : e.name;
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.js')) out.push(p);
    }
  };
  walk('');
  return out.sort();
}

const files = process.argv.slice(2).length ? process.argv.slice(2) : jsFiles();
if (!files.length) fail('no JavaScript files to read, so this gate has concluded nothing (docs/CLAUDE.md section 13)');
const found = [];
let lits = 0;
for (const f of files) {
  const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
  lits += scan(src).lits.length;
  found.push(...problems(src, f));
}
console.log(`files read: ${files.length}   template literals scanned: ${lits}`);
if (!lits) fail('read the files and found no template literal at all, so the scanner is broken');
if (found.length) {
  console.error(`\n${found.length} problem(s):`);
  found.forEach((p) => console.error('  ' + p.text));
  process.exit(1);
}
console.log('no template literal is cut through a comment, and no string tags one.');
