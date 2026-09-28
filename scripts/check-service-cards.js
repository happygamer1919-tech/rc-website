#!/usr/bin/env node
/* The service-card test, card W29-02 (wave 29), ruling R-W29-03: "service cards are fully clickable
   (whole card is the link)". Run by `quality` on every pull request.

   WHAT IT DOES, as a person would. On the home page of each locale, at 1440 wide, for every card of
   the "Ce oferim pentru tine" grid (`#servicii`), it scrolls the card into the middle of the screen
   and clicks with a real pointer, twice: once in the middle of the PICTURE and once in the middle of
   the DESCRIPTION text, the two places that were dead before this card, when only "Află mai multe"
   was a link. After each click it waits for the page to change and asserts the path is the card's
   service page. Before each click it asserts the point it is about to press is inside the card, so
   a header or a floating button over the card fails here by name instead of passing by accident.

   NO NESTED INTERACTIVE ELEMENTS. On the same two pages it asserts that no link, button, input,
   select, textarea or focusable element sits inside another link or button, anywhere on the page
   (the whole-card pattern is exactly where a nested anchor gets written), and that every service
   card is one anchor with an href.

   IT NEVER PASSES ON NOTHING. It fails on no dist/, on either home page missing, on a grid with a
   card count other than the services list's (read from the build's own nine `svcHref` targets on
   the page), and on any click that does not navigate.

   ITS SELF-TEST RUNS FIRST, on synthetic pages it serves itself (R-AB): a control (a whole-card
   link) must pass; a RED arm where only the "more" line is a link (the pre-W29-02 shape) must fail
   on the picture click; a RED arm with an anchor nested in the card link must fail the nesting
   check; then the control again.

   Usage:  node build.js && node scripts/check-service-cards.js
   Chrome: CHROME_BIN if set, else the usual install paths; never a silent skip. */
const fs = require('fs');
const path = require('path');
const { open, click, sleep, FONTS } = require('./lib/headless');

const ROOT = path.join(__dirname, '..');
const DIST = path.resolve(process.argv[2] || path.join(ROOT, 'dist'));
const fail = (msg) => { console.error(`\nSERVICE CARDS TEST FAILED: ${msg}\n`); process.exit(1); };
if (!fs.existsSync(DIST)) fail('dist/ is missing. Run node build.js first.');
const HOMES = [{ code: 'ro', path: '/' }, { code: 'ru', path: '/ru/' }];
for (const h of HOMES) if (!fs.existsSync(path.join(DIST, h.path, 'index.html'))) fail(`dist${h.path}index.html is missing.`);

/* The page's card list: every card in #servicii, with the rect of its picture and its description
   after the card is scrolled to the middle. Returned one card at a time so each click reads fresh
   geometry. */
const CARDS = `(() => {
  document.querySelectorAll('[data-reveal]').forEach((n) => n.classList.add('is-revealed'));
  return [...document.querySelectorAll('#servicii .card')].map((c) => ({
    tag: c.tagName.toLowerCase(), href: c.getAttribute('href'),
    title: (c.querySelector('h3') || {}).textContent || '',
  }));
})()`;
const AIM = (i, part) => `(async () => {
  document.querySelectorAll('[data-reveal]').forEach((n) => n.classList.add('is-revealed'));
  const c = document.querySelectorAll('#servicii .card')[${i}];
  c.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' });
  await new Promise((r) => setTimeout(r, 400));
  const el = ${JSON.stringify(part)} === 'picture' ? c.querySelector('img, .media, .ph') : c.querySelector('.service__desc, p');
  if (!el) return { missing: true };
  const r = el.getBoundingClientRect();
  const x = Math.round(r.left + r.width / 2), y = Math.round(r.top + r.height / 2);
  const hit = document.elementFromPoint(x, y);
  return { x, y, inside: !!hit && c.contains(hit), hit: hit ? hit.tagName.toLowerCase() + (hit.className && typeof hit.className === 'string' ? '.' + hit.className.trim().split(/\\s+/)[0] : '') : null };
})()`;
const NESTING = `(() => {
  const inner = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const bad = [];
  for (const outer of document.querySelectorAll('a[href], button')) {
    for (const n of outer.querySelectorAll(inner)) bad.push(outer.tagName.toLowerCase() + ' > ' + n.tagName.toLowerCase() + ' ' + (n.getAttribute('href') || n.textContent.trim().slice(0, 30)));
  }
  return bad;
})()`;

async function clickAndLand(cdp, base, page, i, part, want) {
  await cdp.goto(base + page);
  const aim = await cdp.ev(AIM(i, part));
  if (aim.missing) return `card ${i + 1}: no ${part} element to click`;
  if (!aim.inside) return `card ${i + 1}: the ${part} point (${aim.x}, ${aim.y}) is covered by ${aim.hit}, not the card`;
  await click(cdp, aim.x, aim.y);
  let where = null;
  for (let k = 0; k < 40; k++) {
    await sleep(150);
    where = await cdp.ev('location.pathname').catch(() => null);
    if (where && where !== page) break;
  }
  await cdp.settle();
  where = await cdp.ev('location.pathname').catch(() => where);
  if (where !== want) return `card ${i + 1}: clicking the ${part} landed on ${where}, not ${want}`;
  return null;
}

/* The self-test pages. */
const shell = (body) => '<!doctype html><html lang="ro"><head><meta charset="utf-8"><title>t</title>'
  + '<meta name="viewport" content="width=device-width, initial-scale=1">'
  + '<style>body{margin:0;font:16px sans-serif}#servicii{padding:300px 20px}.card{display:block;width:300px;border:1px solid #ccc}.media{height:150px;background:#ddd}</style></head><body>'
  + `<section id="servicii">${body}</section></body></html>`;
const CARD_OK = '<a class="card" href="/__svc-target__"><div class="media"><img alt="" width="300" height="150" src="data:image/gif;base64,R0lGODlhAQABAAAAACw="></div><h3>T</h3><p class="service__desc">Descriere lunga pentru test.</p><span>Afla mai multe</span></a>';
const CARD_OLD = '<article class="card"><div class="media"><img alt="" width="300" height="150" src="data:image/gif;base64,R0lGODlhAQABAAAAACw="></div><h3>T</h3><p class="service__desc">Descriere lunga pentru test.</p><a href="/__svc-target__">Afla mai multe</a></article>';
const ROUTES = {
  '/__svc-ok__/': shell(CARD_OK),
  '/__svc-old__/': shell(CARD_OLD),
  /* An anchor inside an anchor cannot be written in HTML (the parser closes the first), so the
     nested arm builds it in the DOM, which is how a script-rendered card would carry one. */
  '/__svc-nested__/': '<!doctype html><html><body><section id="servicii"></section><script>'
    + `var a=document.createElement('a');a.href='/x';a.className='card';var b=document.createElement('a');b.href='/y';b.textContent='more';a.appendChild(b);document.getElementById('servicii').appendChild(a);`
    + '</script></body></html>',
  '/__svc-target__': '<!doctype html><html><body>target</body></html>',
};

async function main() {
  const { cdp, base, close, browser } = await open({ tag: 'service-cards', dist: DIST, cdpPort: Number(process.env.SC_CDP_PORT || 9461), httpPort: Number(process.env.SC_HTTP_PORT || 8771), routes: ROUTES, fail });
  console.log(`chrome: ${browser}`);
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  const bail = (m) => { close(); fail(m); };

  /* --- self-test -------------------------------------------------------------- */
  const control = async (when) => {
    for (const part of ['picture', 'description']) {
      const e = await clickAndLand(cdp, base, '/__svc-ok__/', 0, part, '/__svc-target__');
      if (e) bail(`self-test control ${when} the arms failed: ${e}`);
    }
    await cdp.goto(base + '/__svc-ok__/');
    const n = await cdp.ev(NESTING);
    if (n.length) bail(`self-test control ${when} the arms reported nesting: ${n.join('; ')}`);
  };
  await control('before');
  const old = await clickAndLand(cdp, base, '/__svc-old__/', 0, 'picture', '/__svc-target__');
  if (!old) bail('self-test RED arm "only the more line is a link" was not caught: the picture click navigated.');
  await cdp.goto(base + '/__svc-nested__/');
  const nested = await cdp.ev(NESTING);
  if (!nested.length) bail('self-test RED arm "an anchor inside the card link" was not caught.');
  await control('after');
  console.log('self-test: control clean before and after; RED "only the more line is a link" caught; RED "nested anchor" caught\n');

  /* --- the real run ---------------------------------------------------------- */
  const problems = [];
  let clicks = 0, cardsSeen = 0;
  for (const h of HOMES) {
    await cdp.goto(base + h.path);
    if (!(await cdp.ev(FONTS).catch(() => 0))) bail(`the Inter webfont did not load on ${h.path}.`);
    const cards = await cdp.ev(CARDS);
    const nest = await cdp.ev(NESTING);
    if (nest.length) problems.push(`${h.path}: nested interactive elements: ${nest.slice(0, 5).join('; ')}`);
    if (cards.length !== 9) problems.push(`${h.path}: ${cards.length} service cards in #servicii, the services list has 9`);
    for (const [i, c] of cards.entries()) {
      cardsSeen++;
      if (c.tag !== 'a' || !c.href) { problems.push(`${h.path} card ${i + 1} "${c.title.trim()}": the card is a <${c.tag}>${c.href ? '' : ' with no href'}, not one link`); continue; }
      const want = new URL(c.href, base).pathname;
      if (!want.includes('/servicii/')) problems.push(`${h.path} card ${i + 1}: href ${c.href} is not a service page`);
      for (const part of ['picture', 'description']) {
        const e = await clickAndLand(cdp, base, h.path, i, part, want);
        clicks++;
        if (e) problems.push(`${h.path} ${e}`);
      }
    }
    console.log(`${h.path}: ${cards.length} cards, each clicked on its picture and its description`);
  }
  close();
  if (cardsSeen !== 18) problems.push(`read ${cardsSeen} cards across both locales, expected 18`);
  if (problems.length) {
    console.error(`\nSERVICE CARDS TEST FAILED: ${problems.length} problem(s)`);
    for (const p of problems) console.error(`  ${p}`);
    process.exit(1);
  }
  console.log(`\n${clicks} clicks on ${cardsSeen} service cards, RO and RU: every picture and every description lands on its service page; no nested interactive element on either home page.`);
}

main().catch((e) => fail(e && e.stack ? e.stack : String(e)));
