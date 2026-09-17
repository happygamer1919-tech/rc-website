#!/usr/bin/env node
/* Form wiring gate, card RC-145 (W20-02).

   The wave 19 readiness sweep could not send a form: the send step was blocked
   in the test browser. Nothing else in the repo looks at the forms at all, so a
   template that dropped the access key, posted somewhere else, or shipped
   disarmed would reach production silently. This asserts the WIRING of every
   form in the built site. It does not assert delivery, and it never sends.

   For every <form> in every built page:
     1. method is POST;
     2. action is the configured endpoint, FORM_ENDPOINT_URL, read from its one
        line in build.js (so the gate and the build cannot disagree);
     3. the form is armed (data-armed="1") and carries no demo notice;
     4. exactly one hidden access_key, equal to WEB3FORMS_KEY. The access key is
        what routes a Web3Forms submission to its inbox, so this is the
        RECIPIENT assertion: the recipient the page names is the one in config;
     5. a non-empty hidden subject, the only triage line that reaches the inbox.

   And the inventory, which is what stops a form from disappearing unnoticed:
   every page in dist/sitemap.xml carries exactly one #quote-form, except the two
   privacy pages, which carry none; the two homepages also carry the callback
   popup's #lead-form. It prints every form it read and where each one posts.

   What it cannot assert, stated rather than implied: that the endpoint answers
   2xx. Web3Forms answers 2xx only to a submission it delivers, refuses every
   server-side request without a paid plan (403), and challenges headless
   browsers. See docs/QUESTIONS.md, Q-W20-01.

   IT NEVER PASSES ON NOTHING. It fails with WEB3FORMS_KEY unset (no recipient to
   compare against), with no FORM_ENDPOINT_URL line in build.js, with zero pages
   or zero forms read, and on a sitemap page that is missing from dist/.

   Usage:  WEB3FORMS_KEY=<key> node build.js && WEB3FORMS_KEY=<key> node scripts/check-form-wiring.js [dist]
   quality builds with a stand-in key as its last step; pages.yml runs it on the
   real artifact with the real secret, before anything is published. */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const DIST = path.resolve(process.argv[2] || path.join(ROOT, 'dist'));

const fail = (msg) => { console.error(`\nFORM WIRING GATE FAILED: ${msg}\n`); process.exit(1); };

/* --- the configuration, both halves present or nothing is compared ---------- */
const src = fs.readFileSync(path.join(ROOT, 'build.js'), 'utf8');
const lines = [...src.matchAll(/^const FORM_ENDPOINT_URL = '([^']+)';$/gm)];
if (lines.length !== 1) fail(`build.js must hold exactly one "const FORM_ENDPOINT_URL = '...';" line, found ${lines.length}. The configured endpoint cannot be read.`);
const ENDPOINT = lines[0][1];
const KEY = (process.env.WEB3FORMS_KEY || '').trim();
if (!KEY) fail('WEB3FORMS_KEY is not set, so there is no configured recipient to compare any form against. Build and run this gate with the same key.');
// The key is public in every armed page, but a log never needs more than a fingerprint.
const fp = (v) => (v ? `sha256:${crypto.createHash('sha256').update(v).digest('hex').slice(0, 10)}` : '(empty)');
console.log(`configured endpoint: ${ENDPOINT} (build.js, FORM_ENDPOINT_URL)`);
console.log(`configured recipient: access key ${fp(KEY)} (WEB3FORMS_KEY)`);

/* --- the pages ------------------------------------------------------------- */
if (!fs.existsSync(DIST)) fail(`${DIST} does not exist. Run node build.js first.`);
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.html') ? [path.join(d, e.name)] : []);
const files = walk(DIST).sort();
const shown = path.relative(ROOT, DIST);
console.log(`html files read: ${files.length} in ${shown && !shown.startsWith('..') ? shown : DIST}`);
if (!files.length) fail('zero HTML files read, so no form was checked.');

const attrs = (tag) => {
  const o = {};
  for (const m of tag.matchAll(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g)) {
    o[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? '';
  }
  return o;
};
const urlOf = (f) => '/' + path.relative(DIST, f).split(path.sep).join('/').replace(/index\.html$/, '');

const problems = [];
const forms = [];
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const page = urlOf(f);
  for (const m of html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/g)) {
    const a = attrs(m[1]);
    const hidden = [...m[2].matchAll(/<input\b([^>]*)>/g)].map((x) => attrs(x[1])).filter((x) => (x.type || '').toLowerCase() === 'hidden');
    const keys = hidden.filter((x) => x.name === 'access_key');
    const subject = hidden.find((x) => x.name === 'subject');
    const serviciu = hidden.find((x) => x.name === 'serviciu');
    const form = { page, id: a.id || '(no id)', method: (a.method || 'GET').toUpperCase(), action: a.action ?? '(none)',
      armed: a['data-armed'], demo: 'data-demo' in a, keys: keys.map((k) => k.value), subject: subject ? subject.value : null,
      serviciu: serviciu ? serviciu.value : null };
    forms.push(form);
    const where = `${page} #${form.id}`;
    if (form.method !== 'POST') problems.push(`${where}: method ${form.method}, want POST`);
    if (form.action !== ENDPOINT) problems.push(`${where}: posts to "${form.action}", not the configured endpoint ${ENDPOINT}`);
    if (form.armed !== '1') problems.push(`${where}: data-armed="${form.armed ?? ''}", the form will not post`);
    if (form.demo) problems.push(`${where}: carries a demo notice (data-demo), the build was not armed`);
    if (keys.length !== 1) problems.push(`${where}: ${keys.length} access_key fields, want exactly 1`);
    else if (!keys[0].value.trim()) problems.push(`${where}: the recipient is empty (access_key="")`);
    else if (keys[0].value !== KEY) problems.push(`${where}: the recipient is ${fp(keys[0].value)}, not the configured ${fp(KEY)}`);
    if (!subject || !subject.value.trim()) problems.push(`${where}: no subject, or an empty one`);
  }
}
console.log(`forms read: ${forms.length}`);
if (!forms.length) fail('zero forms read in the built site.');

/* --- the inventory, from the sitemap --------------------------------------- */
const smFile = path.join(DIST, 'sitemap.xml');
if (!fs.existsSync(smFile)) fail('dist/sitemap.xml is missing, so the form inventory cannot be derived.');
const locs = [...fs.readFileSync(smFile, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
console.log(`sitemap pages read: ${locs.length}`);
if (!locs.length) fail('zero pages in dist/sitemap.xml.');
const PRIVACY = new Set(['/confidentialitate/', '/ru/konfidentsialnost/']);
const HOMES = new Set(['/', '/ru/']);
for (const u of locs) {
  if (!fs.existsSync(path.join(DIST, u, 'index.html'))) { problems.push(`${u}: in the sitemap but not in dist/`); continue; }
  const on = (id) => forms.filter((x) => x.page === u && x.id === id).length;
  const wantQuote = PRIVACY.has(u) ? 0 : 1;
  const wantLead = HOMES.has(u) ? 1 : 0;
  if (on('quote-form') !== wantQuote) problems.push(`${u}: ${on('quote-form')} #quote-form, want ${wantQuote}`);
  if (on('lead-form') !== wantLead) problems.push(`${u}: ${on('lead-form')} #lead-form, want ${wantLead}`);
}
for (const x of forms) {
  if (!['quote-form', 'lead-form'].includes(x.id)) problems.push(`${x.page} #${x.id}: a form the inventory does not know. src/main.js only submits #quote-form and #lead-form`);
}

/* --- the table ------------------------------------------------------------- */
console.log('\npage                                  form         method  posts to                              recipient          subject');
for (const x of forms) {
  console.log(`${x.page.padEnd(38)}${('#' + x.id).padEnd(13)}${x.method.padEnd(8)}${String(x.action).padEnd(38)}${(x.keys.length === 1 ? fp(x.keys[0]) : x.keys.length + ' keys').padEnd(19)}${x.subject ?? '(none)'}`);
}

if (problems.length) {
  console.error(`\nFORM WIRING GATE FAILED: ${problems.length} problem(s)`);
  for (const p of problems) console.error(`  ${p}`);
  console.error('');
  process.exit(1);
}
const pages = new Set(forms.map((x) => x.page)).size;
console.log(`\n${forms.length} forms on ${pages} pages: every one POSTs to ${ENDPOINT}, armed, with the configured recipient and a subject; the inventory matches the sitemap (${locs.length} pages). Wiring only: delivery and the endpoint's status are not asserted (Q-W20-01).`);
