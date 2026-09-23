#!/usr/bin/env node
// Reads src/template.html, substitutes strings from locales/*.json, writes dist.
// Fails loudly if the two locales disagree on keys, or if any placeholder survives.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// W14-17. The fallback is the site's real origin, rapidconstruct.md. W12-14 had
// made it rapidconstructmd.com, and GitHub Pages was later moved to
// rapidconstruct.md, so every canonical named a host that returned 404 (Q-W14-03).
// The owner ruled rapidconstruct.md the real domain on 2026-09-15.
// scripts/check-origin.js fails the build output if the retired host reappears.
const SITE = (process.env.SITE_URL || 'https://rapidconstruct.md').replace(/\/$/, '');
// Sub-path the site is served from. Empty for a domain root (Hostinger);
// '/rc-website' for GitHub Pages. Every asset and inter-locale link uses it.
const BASE = (process.env.BASE_PATH || '').replace(/\/+$/, '');
const FORM_KEY = (process.env.WEB3FORMS_KEY || '').trim();
// Single flag for the Google review mark and outbound link. The profile URL is
// not available yet, so both stay hidden until GOOGLE_REVIEWS_URL is set.
const GOOGLE_REVIEWS_URL = (process.env.GOOGLE_REVIEWS_URL || '').trim();

/* W12-23. The commit this artifact was built from, emitted into every page as a
   meta tag so a live check can assert IDENTITY rather than properties.

   Content markers under R-P prove the deployed build has certain properties.
   Two builds that share those properties are indistinguishable to them, so a
   docs-only or copy-only change could go out and a stale copy would still pass.
   A SHA turns that into an identity check.

   GITHUB_SHA in CI, `git rev-parse HEAD` locally. A checkout with no git history
   yields 'unknown', which verify-live.js treats as a FAILURE rather than a skip:
   an assertion that quietly disables itself when its input is missing is the
   same defect as the privacy gate reading a deleted section as completeness. */
const BUILD_SHA = (() => {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA.trim();
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch { return 'unknown'; }
})();
const FORM_ARMED = FORM_KEY.length > 0;
const FORM_ENDPOINT = FORM_ARMED ? FORM_KEY : 'WEB3FORMS_ACCESS_KEY_PLACEHOLDER';
/* RC-145. Where every form on the site posts when armed, written once. Despite
   its name, FORM_ENDPOINT above is the Web3Forms access key, which is what picks
   the inbox a submission lands in; this is the URL. scripts/check-form-wiring.js
   reads this exact line, so the gate and the build cannot hold two values. */
const FORM_ENDPOINT_URL = 'https://api.web3forms.com/submit';

const LOCALES = [
  { code: 'ro', file: 'locales/ro.json', out: 'dist/index.html', home: '/', alt: '/ru/' },
  { code: 'ru', file: 'locales/ru.json', out: 'dist/ru/index.html', home: '/ru/', alt: '/' },
];

// Each page template rendered once per locale. 404 goes to the site root as
// well as /ru/, because a static host serves one 404 for the whole origin.
const PRIVACY_PATH = { ro: '/confidentialitate/', ru: '/ru/konfidentsialnost/' };
const SERVICES_ROOT = { ro: '/servicii/', ru: '/ru/servicii/' };
// W16-02. The catalog category pages sit on their own root: they are materials,
// not services, and /servicii/ would both misdescribe them and risk colliding
// with a service slug.
const CATALOG_ROOT = { ro: '/catalog/', ru: '/ru/catalog/' };
// The city already named in meta.title, band.coverageLine and areaServed.
const PRIMARY_CITY = { ro: 'Chișinău', ru: 'Кишинёве' };

// Nine service slugs, matching the delivered SVG filenames and the order of
// services.items.N in the locale files.
const SERVICE_SLUGS = [
  'case-la-cheie', 'acoperisuri', 'fatade', 'reparatii', 'finisaje',
  'proiectare-3d', 'instalatii', 'industrial', 'terasamente',
];
// W19-D4. PRICED_SLUGS is gone with the price band it chose pages for. W14-05
// removed the band's price, and the early-booking line it kept is in every
// service page's footer already (footer.offer). See DECISIONS.md, W19-D4.

const SLOT_FOR_SLUG = {
  'case-la-cheie': 'svc-case-la-cheie', 'acoperisuri': 'svc-acoperisuri', 'fatade': 'svc-fatade',
  'reparatii': 'svc-reparatii', 'finisaje': 'svc-finisaje', 'proiectare-3d': 'svc-proiectare-3d',
  'instalatii': 'svc-instalatii', 'industrial': 'svc-industrial', 'terasamente': 'svc-terasamente',
};
const PROJECTS = JSON.parse(fs.readFileSync('content/projects.json', 'utf8')).projects;

// Supplier logos. One full-colour file per brand, dropped at
// public/img/suppliers/<slug>.<ext>. There is no second greyscale asset: the
// default grey state is a CSS filter on the colour file. A brand with no file
// falls back to its name as text inside the same white tile, per brand, so the
// first logo to land renders as a logo while the rest stay text.
const SUPPLIER_LOGO_DIR = 'public/img/suppliers';
// SVG and PNG only: a logo on a white tile needs a transparent background, and
// both are sizeable at build time, which keeps width/height on every <img>.
const SUPPLIER_LOGO_EXT = ['svg', 'png'];

// Intrinsic size of a logo file, so the <img> can carry width and height and
// never shift layout. PNG: the IHDR header. SVG: viewBox, else width/height.
function logoSize(file) {
  const buf = fs.readFileSync(file);
  if (file.endsWith('.png')) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  const svg = buf.toString('utf8').slice(0, 2000);
  const box = svg.match(/viewBox\s*=\s*["']\s*[-\d.]+[,\s]+[-\d.]+[,\s]+([\d.]+)[,\s]+([\d.]+)/);
  if (box) return { w: Math.round(Number(box[1])), h: Math.round(Number(box[2])) };
  const w = svg.match(/\bwidth\s*=\s*["']([\d.]+)(?:px)?["']/);
  const h = svg.match(/\bheight\s*=\s*["']([\d.]+)(?:px)?["']/);
  return w && h ? { w: Math.round(Number(w[1])), h: Math.round(Number(h[1])) } : null;
}

function supplierLogo(slug) {
  for (const ext of SUPPLIER_LOGO_EXT) {
    const file = `${SUPPLIER_LOGO_DIR}/${slug}.${ext}`;
    if (!fs.existsSync(file)) continue;
    return { ext, file, size: logoSize(file) };
  }
  return null;
}

// The twelve tiles, then the same twelve again so the -50% keyframe lands on a
// seam. Only the first copy is reachable: the second is aria-hidden and carries
// no tabindex, so a screen reader reads twelve brands and a keyboard user gets
// twelve tab stops, not twenty-four.
function renderSupplierChips(l, base) {
  const brands = [];
  for (let i = 0; `suppliers.${i}.id` in l.strings; i++) {
    brands.push({ slug: l.strings[`suppliers.${i}.id`], name: l.strings[`suppliers.${i}.name`] });
  }
  const tile = (b, dup) => {
    const logo = supplierLogo(b.slug);
    const inner = logo
      ? `<img class="supplier__logo" src="${base}/img/suppliers/${b.slug}.${logo.ext}"` +
        ` alt="${dup ? '' : esc(b.name)}"` +
        (logo.size ? ` width="${logo.size.w}" height="${logo.size.h}"` : '') +
        ' loading="lazy" decoding="async">'
      : `<span class="supplier__label">${esc(b.name)}</span>`;
    return `        <div class="supplier"${dup ? ' aria-hidden="true"' : ' tabindex="0"'}>${inner}</div>`;
  };
  return [false, true].flatMap((dup) => brands.map((b) => tile(b, dup))).join('\n');
}

const PAGES = [
  { template: 'src/template.html', out: (l) => l.out },
  { template: 'src/404.html', out: (l) => (l.code === 'ro' ? 'dist/404.html' : 'dist/ru/404.html') },
  { template: 'src/privacy.html', out: (l) => 'dist' + PRIVACY_PATH[l.code] + 'index.html' },
];

// Keys whose value is already HTML built by this file. Everything else is
// escaped on substitution.
const RAW_KEYS = new Set(['mobileProducts', 'catalogMenu', 'serviciiMenu', 'productTeaser', 'socialRow',
  // demoAttr is a whole attribute, ` data-demo="..."`, not an attribute value:
  // it is either present or absent. Its inner text is escaped where it is
  // built, so what lands here is already safe. Escaping it again turned the
  // quotes into &quot; and truncated the notice at its first space.
  'demoAttr',
  'portfolioCards', 'portfolioFilters', 'googleLink', 'supplierChips', 'heroPanelMedia', 'promoBar',
  'privacyLinkOpen', 'privacyLinkClose', 'privacyFooterLegal',
  'areaServedJson', 'workTypeOptions', 'notFoundLocale',
  ...Array.from({ length: 9 }, (_, i) => `svcMedia${i}`),
]);
// Same idea for the service-page template.
const SVC_RAW_KEYS = new Set(['mobileProducts', 'catalogMenu', 'serviciiMenu',
  'demoAttr', 'svc.imageObjects', 'svc.answer', 'svc.table', 'svc.faqSection', 'svc.faqSchema',
  'svc.gallerySection', 'svc.footerLinks', 'svc.media',
  // W24-05. The before/after slider, on the case la cheie page only.
  'svc.beforeAfter',
  // W24-06. The four roofing offers, on the acoperisuri page only.
  'svc.roofOffers',
  // W24-07. The bento hub, the first section after the header on its page.
  'svc.bento',
  // W26-04. The second, product bento, on the acoperisuri page only.
  'svc.productBento',
  // W25-19. The consolidated roofing catalogue, on the acoperisuri page only.
  'svc.roofProducts',
  // W12-06. The bar is site-wide, so the service template needs it raw too.
  'promoBar',
  // W12-09. Generated JSON-LD fragment, must not be escaped.
  'areaServedJson',
  // W12-17. Anchor fragments and a bare attribute.
  'privacyLinkOpen', 'privacyLinkClose', 'privacyFooterLegal',
]);

const die = (msg) => { console.error('\nBUILD FAILED: ' + msg + '\n'); process.exit(1); };

const flatten = (obj, prefix = '') => Object.entries(obj).reduce((acc, [k, v]) => {
  if (v && typeof v === 'object' && !Array.isArray(v)) Object.assign(acc, flatten(v, prefix + k + '.'));
  else acc[prefix + k] = String(v);
  return acc;
}, {});

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// --- load and cross-check locales -------------------------------------------
const loaded = LOCALES.map((l) => ({ ...l, strings: flatten(JSON.parse(fs.readFileSync(l.file, 'utf8'))) }));
const [a, b] = loaded;
const onlyA = Object.keys(a.strings).filter((k) => !(k in b.strings));
const onlyB = Object.keys(b.strings).filter((k) => !(k in a.strings));
if (onlyA.length || onlyB.length) {
  die(`locale key sets differ.\n  only in ${a.code}: ${onlyA.join(', ') || '(none)'}\n  only in ${b.code}: ${onlyB.join(', ') || '(none)'}`);
}
const empty = loaded.flatMap((l) => Object.entries(l.strings).filter(([, v]) => !v.trim()).map(([k]) => `${l.code}:${k}`));
if (empty.length) die(`empty strings: ${empty.join(', ')}`);

/* --- W25-22, the written warranty --------------------------------------- */

/* THE FIGURE HAS ONE HOME, `warranty.years`, and every string that states it is
   held to it. It was thirty, in four strings per locale, in four different
   grammatical shapes, and the owner corrected it to five. Four shapes in two
   languages is exactly the arrangement in which one of them survives a change,
   and the survivor is the one on the homepage hero.

   WHAT IS ASSERTED, both ways, because either alone is half a check:
     · every one of the four strings STATES the figure. A string that lost it is
       a claim that stopped being about the warranty at all;
     · none of them states a DIFFERENT figure beside a years word. That is what
       catches the survivor: the old figure left standing in one of the four
       while the other three moved. The old figure is deliberately NOT written
       out here. scripts/check-stale-docs.js scans source comments as well as
       documents, and it caught this comment quoting it, which is the second time
       in one session that a comment explaining a rule tripped the gate enforcing
       it (src/moved.html was the first, at W25-19).

   It is not "no 30 anywhere": `stats.0.n` is 500 and a description may carry any
   number. The pattern reads a number that is immediately followed by a years
   word, in either locale, which is the only shape a warranty claim takes here.

   Romanian counts from 20 take "de": 30 de ani, 5 ani. The strings carry their
   own grammar and this reads both forms, so correcting the figure without
   correcting the grammar leaves the string stating the figure and is not caught
   here; it is caught by a person reading four lines, which is what four lines are
   for. */
/* Local, because the module's own REAL is declared below this point and an
   empty string here must be a named failure rather than a crash. */
const REAL_STR = (v) => typeof v === 'string' && v.trim() !== '' && !v.trim().startsWith('TODO:');
const WARRANTY_KEYS = ['meta.description', 'hero.claim.line1', 'stats.2.n', 'trust.items.0.title'];
const YEARS_WORD = String.raw`(?:de\s+)?(?:ani|лет|года|год|years?)`;
(() => {
  const problems = [];
  for (const l of loaded) {
    const years = l.strings['warranty.years'];
    if (!REAL_STR(years)) { problems.push(`${l.code}: warranty.years is not set, so no string can be held to it.`); continue; }
    if (!/^\d{1,2}$/.test(years)) { problems.push(`${l.code}: warranty.years is "${years}", which is not one or two digits.`); continue; }
    for (const k of WARRANTY_KEYS) {
      const v = l.strings[k];
      if (!REAL_STR(v)) { problems.push(`${l.code}: ${k} is empty, and it is one of the strings that states the warranty.`); continue; }
      const stated = [...v.matchAll(new RegExp(String.raw`(\d{1,2})\s+` + YEARS_WORD, 'gi'))].map((m) => m[1]);
      const bare = k.endsWith('.n') ? [v.trim()] : [];
      const all = stated.length ? stated : bare;
      if (!all.length) {
        problems.push(`${l.code}: ${k} states no number of years, and it is one of the strings that states the warranty: "${v}"`);
      }
      const wrong = all.filter((n) => n !== years);
      if (wrong.length) {
        problems.push(`${l.code}: ${k} states ${wrong.join(', ')} year(s) and warranty.years is ${years}: "${v}"`);
      }
    }
  }
  if (problems.length) {
    die(`the written warranty figure and the strings that state it disagree:\n  ${problems.join('\n  ')}\n\n  The figure lives once, in warranty.years, in each locale file.`);
  }
  console.log(`warranty: ${loaded.map((l) => l.code + ' ' + l.strings['warranty.years']).join(', ')} year(s), stated by ${WARRANTY_KEYS.length} string(s) per locale and held to the figure`);
})();

// --- has the privacy page still got TODO placeholders in it? -----------------
const privacyTodos = loaded.flatMap((l) =>
  Object.entries(l.strings).filter(([k, v]) => k.startsWith('privacy.') && /TODO:/.test(v))
    .map(([k]) => `${l.code}:${k}`));

/* W12-21. The operator identity is ABSENT from the fallback page rather than
   marked TODO, so a TODO scan alone would report the page complete and release
   the W12-17 link suppression. Absence is not completeness: a policy that never
   names an operator is exactly as unlinkable as one that says TODO.

   RATIFIED, and the reason generalises. The build was inferring COMPLETENESS
   FROM MISSING EVIDENCE: it looked for a marker of incompleteness, did not find
   one because the whole section had been deleted, and concluded the page was
   ready to publish. That is the same failure class as a card reporting SHIPPED
   with its evidence field null, and as R-P's stale page returning a plausible
   height: in each case absent evidence was read as positive evidence.

   The rule that falls out of it: a gate must assert the presence of what it
   requires, never the absence of a complaint about it.

   Both conditions are checked, so the page counts as incomplete while the
   operator fields are missing OR still marked. The reversal is unchanged in
   substance: add privacy.opName and privacy.opIdno with real values to both
   locale files and the links, indexability and sitemap entries return together. */
const OPERATOR_KEYS = ['privacy.opName', 'privacy.opIdno'];
// REAL() is defined further down and would be in its temporal dead zone here,
// so the same predicate is written out.
const operatorPresent = (v) => typeof v === 'string' && v.trim() !== '' && !v.trim().startsWith('TODO:');
const privacyMissingOperator = loaded.flatMap((l) =>
  OPERATOR_KEYS.filter((k) => !operatorPresent(l.strings[k])).map((k) => `${l.code}:${k} (absent or TODO)`));
/* W12-26, 2026-09-07. The fallback page is published and linked WITHOUT an
   operator section, on the owner's explicit instruction: the registry extract
   has not arrived, and a linked page with no operator beats an unreachable one.

   This does NOT revert W12-21b. That fix stands: absence must never SILENTLY
   release the gate. What it needed was an explicit second key, so the release is
   a decision someone made rather than a consequence of a deletion nobody
   noticed. Delete the operator fields with this constant false and the links
   stay off, which is exactly the property W12-21b bought.

   Filling privacy.opName and privacy.opIdno closes the gate on evidence and
   makes this flag irrelevant. */
const PRIVACY_PUBLISHABLE_WITHOUT_OPERATOR = true;

/* Placeholders remain absolute: a page rendering "TODO:" is never linkable,
   whatever the flag says. The flag governs the operator branch only. */
const privacyIncomplete = privacyTodos.length > 0
  || (privacyMissingOperator.length > 0 && !PRIVACY_PUBLISHABLE_WITHOUT_OPERATOR);

const servicePages = [];

// --- render ------------------------------------------------------------------
// ---------------------------------------------------------------------------

/* W9-06. lastmod for the sitemap, from the last commit that actually touched
   each source file.

   The obvious implementation is the file's mtime, and it is wrong in CI: git
   does not record mtimes, so a fresh checkout stamps every file with the moment
   the runner cloned. Every lastmod would then read "whenever we last deployed",
   which tells a crawler nothing and is a reason to distrust the whole file.

   `git log -1 --format=%cI` gives the real date the content last changed, and
   it is identical on this machine and on the runner. mtime is kept only as the
   fallback for a checkout with no git history (a tarball download). */
const gitDate = (() => {
  const cache = new Map();
  return (file) => {
    if (cache.has(file)) return cache.get(file);
    let iso = null;
    try {
      const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', file],
        { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
      if (out) iso = out;
    } catch { /* no git, or the file is untracked */ }
    if (!iso && fs.existsSync(file)) iso = fs.statSync(file).mtime.toISOString();
    cache.set(file, iso);
    return iso;
  };
})();

// The newest of the files that decide a page's content. A page is "modified"
// when anything that renders into it is, which is what a crawler is asking.
const lastmodOf = (...files) => {
  const dates = files.filter(Boolean).map(gitDate).filter(Boolean).sort();
  return dates.length ? dates[dates.length - 1].slice(0, 10) : null;
};
const localeFiles = LOCALES.map((l) => l.file);
const HOME_SOURCES = ['src/template.html', 'content/projects.json', 'build.js', ...localeFiles];
const SVC_SOURCES = ['src/service.html', 'content/projects.json', 'build.js', ...localeFiles];
// A service page also moves when one of its own cover photographs is replaced.
const coversFor = (slug) => PROJECTS.filter((p) => p.service === slug)
  .map((p) => `public/img/${p.cover}.jpg`).filter((f) => fs.existsSync(f));

/* W9-08. The four blocks C-03 asks a service page to open and close with.

   All of it is ordinary headings and paragraphs. Nothing is chunked into
   fragments for a machine and there is no second copy of anything written for
   an answer engine: the FAQ a crawler reads through FAQPage is character for
   character the FAQ a visitor reads on the page, which is also what Google
   requires of the markup. */
const RELATED = require('./content/related-services.json');

// The direct answer. Replaces the service one-liner as the hero lede: the
// one-liner ends on a claim ("ca să nu curgă niciodată") and C-03 wants the
// page to open on what the service IS. The one-liner is not lost: it still
// carries the meta description, og:description, the homepage card and the
// Service schema.
// W14-03. An answer may hold several lines (T-08, T-09); each renders as its own
// paragraph. A one-line answer renders exactly as before.
const svcAnswer = (l, slug) => l.strings[`svcContent.${slug}.answer`].split('\n')
  .map((line) => line.trim()).filter(Boolean)
  .map((line) => `<p class="hero__sub svc-answer__p">${esc(line)}</p>`).join('\n        ');

/* A specification table, only where the page's own content already supports
   one. Six services have one; reparatii, proiectare-3d and industrial do not,
   and none was fabricated to fill the gap. It scrolls inside its own box so a
   long row can never push the page into a horizontal scroll. */
function svcTable(l, slug) {
  const cap = l.strings[`svcContent.${slug}.table.caption`];
  if (!cap) return '';
  const rows = [];
  for (let i = 0; l.strings[`svcContent.${slug}.table.rows.${i}.k`] !== undefined; i++) {
    rows.push(`        <tr><th scope="row">${esc(l.strings[`svcContent.${slug}.table.rows.${i}.k`])}</th>` +
              `<td>${esc(l.strings[`svcContent.${slug}.table.rows.${i}.v`])}</td></tr>`);
  }
  return `<section class="section section--light section--divided section--compact" id="ce-include">
  <div class="container">
    <h2 data-reveal>${esc(cap)}</h2>
    <div class="table-wrap" data-reveal>
      <table class="spec">
        <tbody>
${rows.join('\n')}
        </tbody>
      </table>
    </div>
  </div>
</section>`;
}

const svcFaqItems = (l, slug) => {
  const out = [];
  for (let i = 0; l.strings[`svcContent.${slug}.faq.${i}.q`] !== undefined; i++) {
    out.push({ q: l.strings[`svcContent.${slug}.faq.${i}.q`],
               a: l.strings[`svcContent.${slug}.faq.${i}.a`] });
  }
  return out;
};

/* The FAQ, plus the contextual links to two sibling services and the updated
   date, in one closing section.

   The date is the same content date the sitemap uses, not the wall clock at
   build time. A visible "Actualizat" that moves on every deploy, including one
   that changed nothing on this page, is worth less than no date at all, and it
   would contradict the page's own lastmod. See DECISIONS.md. */
function svcFaqSection(l, slug, updated) {
  const items = svcFaqItems(l, slug);
  if (!items.length) return '';
  const dl = items.map((it, i) => `      <div class="faq__item" data-reveal data-stagger="${Math.min(i, 6)}">
        <h3 class="faq__q">${esc(it.q)}</h3>
        <p class="faq__a">${esc(it.a)}</p>
      </div>`).join('\n');

  const pair = RELATED[slug].map((sg) => {
    const i = SERVICE_SLUGS.indexOf(sg);
    return `<a href="${BASE + SERVICES_ROOT[l.code] + sg + '/'}">${esc(l.strings[`services.items.${i}.title`])}</a>`;
  });
  const sentence = esc(l.strings[`svcContent.${slug}.related.sentence`])
    .replace('{0}', pair[0]).replace('{1}', pair[1]);

  return `<section class="section section--light section--divided section--compact" id="intrebari">
  <div class="container">
    <h2 data-reveal>${esc(l.strings['servicePage.faqH'])}</h2>
    <div class="faq" data-reveal>
${dl}
    </div>
    <p class="svc-related" data-reveal>${sentence}</p>
    <p class="svc-updated muted" data-reveal>${esc(l.strings['servicePage.updated'])}: <time datetime="${updated}">${updated}</time></p>
  </div>
</section>`;
}

// FAQPage, mirroring the visible FAQ exactly.
function svcFaqSchema(l, slug) {
  const items = svcFaqItems(l, slug);
  if (!items.length) return '';
  return '\n<script type="application/ld+json">\n' + JSON.stringify({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question', name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  }, null, 2) + '\n</script>';
}

/* W9-07. Per-page title, description and social image for a service page.

   Titles and descriptions were `<service> · Rapid Construct` and the service's
   own one-liner. Unique already, but the title said nothing about where the
   work happens and the description ran well under what a result snippet will
   show. Both are now built from strings that already exist: the service title,
   its description, and `band.coverageLine`, which is the sourced list of places
   Rapid Construct has actually built.

   Nothing is padded to hit a length. The coverage sentence is appended only
   when the result still fits 155 characters, so a service with a long
   description simply keeps its description and no more. */
const BRAND = ' · Rapid Construct';
const TITLE_MAX = 60, DESC_MAX = 155;

function serviceHeadVars(l, slug, i) {
  const title = l.strings[`services.items.${i}.title`];
  const desc = l.strings[`services.items.${i}.desc`];
  const inCity = l.code === 'ro' ? ` în ${PRIMARY_CITY.ro}` : ` в ${PRIMARY_CITY.ru}`;

  // Longest form that still fits, never a truncation mid-word.
  const candidates = [title + inCity + BRAND, title + BRAND, title];
  const metaTitle = candidates.find((c) => c.length <= TITLE_MAX) || candidates[2];

  // W14-05b. band.coverageLine left the locale files at W12-09 and is composed by
  // coverageLine(l); reading it from l.strings returned undefined, and 18 live
  // service descriptions ended in the word "undefined".
  const withCoverage = `${desc} ${coverageLine(l)}`;
  const metaDesc = withCoverage.length <= DESC_MAX ? withCoverage : desc;
  if (/\bundefined\b/.test(metaDesc)) die(`meta description for ${slug} (${l.code}) contains "undefined": ${metaDesc}`);

  // og:image is this service's own first real cover, not the site fallback.
  // A social card wants the work, not the logo.
  const own = renderableProjects(l, slug).find((p) => coverIsRealPhoto(p.cover));
  if (!own) {
    return {
      'svc.metaTitle': metaTitle, 'svc.metaDesc': metaDesc,
      'svc.ogImage': SITE + BASE + '/img/og-image.jpg',
      'svc.ogImageW': '1200', 'svc.ogImageH': '630',
      'svc.ogImageAlt': l.strings['meta.ogImageAlt'],
      'svc.imageObjects': '',
    };
  }
  const big = `public/img/${own.cover}@2x.jpg`;
  const file = fs.existsSync(big) ? big : `public/img/${own.cover}.jpg`;
  const dim = jpegSize(file) || { w: 800, h: 600 };

  return {
    'svc.metaTitle': metaTitle,
    'svc.metaDesc': metaDesc,
    'svc.ogImage': SITE + BASE + '/img/' + path.basename(file),
    'svc.ogImageW': String(dim.w), 'svc.ogImageH': String(dim.h),
    'svc.ogImageAlt': own.title[l.code],
    'svc.imageObjects': serviceImageObjects(l, slug),
  };
}

/* Read a JPEG's real pixel size out of its SOF marker. The R-B clamp means a
   cover's @2x is whatever its source allowed, between 600 and 800 wide, so a
   hardcoded 800x600 in og:image:width would be a lie for thirteen of them. */
function jpegSize(file) {
  const b = fs.readFileSync(file);
  let o = 2;
  while (o < b.length) {
    if (b[o] !== 0xFF) { o++; continue; }
    const m = b[o + 1];
    if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC) {
      return { h: b.readUInt16BE(o + 5), w: b.readUInt16BE(o + 7) };
    }
    o += 2 + b.readUInt16BE(o + 2);
  }
  return null;
}

/* An ImageObject per project cover on this service page. Each one carries the
   project's real title and summary, so a crawler that indexes the image also
   gets what the photograph shows rather than a filename. */
function serviceImageObjects(l, slug) {
  const mine = renderableProjects(l, slug).filter((p) => coverIsRealPhoto(p.cover));
  if (!mine.length) return '';
  return ',\n  "image": [\n' + mine.map((p) => {
    const big = `public/img/${p.cover}@2x.jpg`;
    const file = fs.existsSync(big) ? big : `public/img/${p.cover}.jpg`;
    const d = jpegSize(file) || { w: 800, h: 600 };
    return '    ' + JSON.stringify({
      '@type': 'ImageObject',
      contentUrl: SITE + BASE + '/img/' + path.basename(file),
      url: SITE + BASE + SERVICES_ROOT[l.code] + slug + '/#project-' + p.id,
      name: p.title[l.code],
      description: p.summary[l.code],
      width: d.w, height: d.h,
      creator: { '@type': 'Organization', name: 'Rapid Construct' },
    });
  }).join(',\n') + '\n  ]';
}

// Service page rendering. One page per slug per locale, 18 in all.
const serviceTemplate = fs.readFileSync('src/service.html', 'utf8');

// A field carries real content only when it is neither empty nor a TODO marker.
// Stubs use "" and the seeded projects use "TODO: ...": both mean "no source
// for this yet", and neither is ever printed. Every optional field is tested on
// its own, so a project with a real location and no year prints the location.
const REAL = (v) => typeof v === 'string' && v.trim() !== '' && !v.trim().startsWith('TODO:');

// --- W12-09, the coverage list ----------------------------------------------

/* Twenty localities, client-supplied, PROVISIONAL pending confirmation on
   Balti, Ungheni and Cahul. See DECISIONS.md W12-09.

   ONE source, three surfaces. Q-W9-07 found the site giving two different
   answers to "where do you work": meta.description named four localities and
   band.coverageLine named six, and only two appeared in both. The second list
   also fed areaServed and llms.txt, so the contradiction was in the structured
   data as well as the prose.

   That cannot recur by construction now. `band.localities` in each locale file
   is the only list; the coverage sentence, the areaServed block on both
   templates and the llms.txt section are all derived from it here. There is no
   second copy anywhere to fall out of step. meta.description is necessarily
   shorter than 20 names and states four plus "and other localities", so it is a
   subset of the list rather than a rival to it. */
/* R-M, W12-15. The Russian list is in the USAGE register, not the classifier's.
   CUATM is authoritative for the Romanian forms and is not authoritative for the
   Russian locale, which addresses Russian-speaking customers rather than the
   state. The classifier form is recorded here so the divergence is documented
   next to the data rather than only in DECISIONS.md.

     #   Romanian (CUATM)   Russian (usage, shipped)   Russian (CUATM)
     1   Chișinău           Кишинёв                    Кишинэу
     2   Codru              Кодру                      Кодру
     3   Durlești           Дурлешты                   Дурлешть
     4   Sîngera            Сынджера                   Сынджера
     5   Ialoveni           Яловены                    Яловень
     6   Strășeni           Страшены                   Стрэшень
     7   Anenii Noi         Анений-Ной                 Анений Ной
     8   Criuleni           Криулень                   Криулень
     9   Coșnița            Кошница                    Кошница
    10   Dubăsari           Дубоссары                  Дубэсарь
    11   Orhei              Орхей                      Орхей
    12   Călărași           Калараш                    Кэлэрашь
    13   Hîncești           Хынчешты                   Хынчешть
    14   Căinari            Каинары                    Кэинарь
    15   Costești           Костешты                   Костешть
    16   Sociteni           Сочитены                   Сочитень
    17   Cahul              Кагул                      Кахул
    18   Ungheni            Унгены                     Унгень
    19   Bălți              Бельцы                     Бэлць
    20   Vadul lui Vodă     Вадул-луй-Водэ             Вадул луй Водэ

   Six agree in both registers. Fourteen diverge. */
const localities = (l) => {
  const out = [];
  for (let i = 0; `band.localities.${i}` in l.strings; i++) out.push(l.strings[`band.localities.${i}`]);
  if (!out.length) die(`no band.localities.N in ${l.code}`);
  return out;
};

/* The connective is "Inclusiv:" / "Включая:", NOT the previous "Am construit
   în" / "Наши объекты". That is a deliberate correction, not a rewrite.

   "Am construit în X" asserts a completed project in X. The client confirmed
   where the company WORKS, not which project was built where (Q-W9-05 is
   explicitly not closed by this list), so carrying the old verb into twenty
   localities would have invented thirty-eight project locations in one edit.
   "Inclusiv" claims coverage, which is what was actually confirmed. */
const coverageLine = (l) => `${l.strings['band.coverageLead']} ${localities(l).join(', ')}.`;

// areaServed for the two templates that carry a schema block. Indented to sit
// inside the JSON-LD exactly where the hand-written array used to.
const areaServedJson = (l, indent) => localities(l)
  .map((n) => `${indent}{ "@type": "City", "name": ${JSON.stringify(n)} }`)
  .join(',\n');

// --- W12-02, the promo bar --------------------------------------------------

/* A static, fixed-height offer strip that sits in flow directly under the fixed
   header and scrolls away with the page. Nothing about it moves: no marquee, no
   transition, no transform. See DECISIONS.md ruling R-H.

   It is data, not markup. Two fields in each locale file drive it, and the
   `endDate` is the removal switch: the bar is emitted only while that date is
   still in the future at build time. Setting `promo.endDate` to a past date
   pulls the bar from both locales with no edit to the template, the stylesheet
   or this file.

   Why an end date and not an empty string: `build.js` already refuses to build
   on any empty locale string, so `"text": ""` would fail the build rather than
   remove the bar. The date is the switch that the existing gates allow.

   The claim carries its own expiry for a reason. "doar pana in 2027" stops
   being true on 2027-01-01, and a discount bar that outlives its own deadline
   is exactly the kind of invented fact CLAUDE.md section 5 forbids. The one
   caveat, recorded in QUESTIONS.md: expiry is evaluated when the site is BUILT,
   so the bar survives past its date until something triggers a rebuild. */
function promoBar(l) {
  const text = l.strings['promo.text'];
  const endDate = (l.strings['promo.endDate'] || '').trim();
  if (!REAL(text) || !REAL(endDate)) return '';

  if (!/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
    die(`promo.endDate in ${l.code} is "${endDate}", which is not an ISO YYYY-MM-DD date.`);
  }
  // Compared as UTC midnight against UTC midnight, so the switch does not flip
  // an hour early or late depending on the runner's timezone.
  const ends = Date.parse(endDate + 'T00:00:00Z');
  const today = Date.parse(new Date().toISOString().slice(0, 10) + 'T00:00:00Z');
  if (!(ends > today)) return '';

  // No data-reveal: this sits above the fold, where CLAUDE.md section 1 allows
  // nothing to animate. It is plain markup with a hard-capped height, so it
  // costs no CLS either.
  return `<div class="promo">
  <p class="promo__text">${esc(text)}</p>
</div>
`;
}

// --- W24-01, the wave 24 photo placeholder -----------------------------------

/* Every image wave 24 renders is a placeholder. One component renders all of
   them, and docs/PHOTO-SLOTS-W24.json is the ledger the photo session is handed.

   The two are held together in both directions. Here, at build time: a
   placeholder whose slot id has no ledger row fails the build, naming the id and
   the file. And in scripts/check-photo-slots-w24.js, over the built tree: every
   rendered placeholder has a row, and every row is rendered.

   Presence, not silence (docs/CLAUDE.md section 13): a ledger file that is
   missing, unparseable, or has no `slots` array fails the build rather than
   reading as "no placeholders to check". An empty array is a real, stated state
   and is written [], never omitted.

   The ratio lives in the ledger row and nowhere else (docs/CLAUDE.md section
   14). The stylesheet reads it through --ph-ratio. */
const PHOTO_SLOTS_FILE = 'docs/PHOTO-SLOTS-W24.json';
const PHOTO_SLOTS = JSON.parse(fs.readFileSync(PHOTO_SLOTS_FILE, 'utf8'));
if (!Array.isArray(PHOTO_SLOTS.slots)) {
  die(`${PHOTO_SLOTS_FILE} has no "slots" array. An empty ledger is [], never a missing key.`);
}
const PHOTO_SLOT_IDS = new Set();
PHOTO_SLOTS.slots.forEach((s, i) => {
  for (const f of ['id', 'page', 'ratio', 'min_px', 'shows']) {
    if (!REAL(s[f])) die(`${PHOTO_SLOTS_FILE}: slots[${i}] has no real "${f}".`);
  }
  /* Letters, digits and hyphens. ~~Uppercase only~~: the dispatch's own examples
     are `CAT-0042` and `BA-01-before`, and the second is the shape a paired slot
     wants, so the case is not the rule. What the rule is for is that a slot id
     goes into a filename, a URL and an attribute, so it carries no space and no
     punctuation. */
  if (!/^[A-Za-z0-9-]+$/.test(s.id)) die(`${PHOTO_SLOTS_FILE}: slots[${i}].id "${s.id}" is not letters, digits and hyphens.`);
  if (PHOTO_SLOT_IDS.has(s.id)) die(`${PHOTO_SLOTS_FILE}: slot id "${s.id}" appears twice. One row per slot.`);
  PHOTO_SLOT_IDS.add(s.id);
});

/* variant is 'light' or 'dark'. Nothing else: the two are the section rhythm's
   own two backgrounds and a third would be a new colour value. */
/* W25-01. ONE call site, two outcomes. Every caller in this file asks for a slot by
   id and gets back either the placeholder box it has always got, or a real
   <picture>, decided by the LEDGER and by nothing at the call site. That is the
   whole design: the eighteen places that render an image do not learn about
   images, and a slot flips from empty to filled by one field in one JSON file.

   A filled slot needs `provenance` and `alt` (the schema says so, and this
   refuses to render without them), because an image with no provenance row is
   exactly what R-W exists to prevent, and an image with no alt is a hole in the
   page for anyone not looking at it.

   THE FRAME DOES NOT MOVE. The <picture> takes the same box the placeholder had,
   from the same `--ph-ratio`, so filling a slot changes no layout and no height
   budget. `object-fit: contain` on white is what a packshot needs: a tall bottle
   and a square tile both sit inside the square without being cropped, and a
   cropped packshot is a different product.

   `width` and `height` are emitted explicitly so the box is reserved before the
   bytes arrive; the ratio still comes from the ledger, and these are derived from
   it rather than written a second time (section 14).

   WEBP IS EMITTED WHEN THE FILE EXISTS AND NOT OTHERWISE. The dispatch asks for
   WebP plus a JPEG fallback. This machine cannot encode WebP: `sips` exits 13,
   macOS 26.6.2's ImageIO lists public.jpeg, public.png and public.jpeg-2000 as
   its writable types and not WebP, and there is no cwebp, no ImageMagick and no
   npm package in a repo that has no package.json by design. Adding one is a new
   dependency, which needs the owner's word (Q-W25-01). So the markup is written
   to carry a <source type="image/webp"> the day a .webp sits beside the .jpg, and
   to leave it out until then. No call site and no template changes when it does. */
function slotImage(id, opts = {}) {
  const row = PHOTO_SLOTS.slots.find((s) => s.id === id);
  if (!row) {
    die(`placeholder: slot "${id}" has no row in ${PHOTO_SLOTS_FILE}. A placeholder and its ledger row land in the same commit.`);
  }
  const variant = opts.variant || 'light';
  if (variant !== 'light' && variant !== 'dark') {
    die(`placeholder: slot "${id}" asks for variant "${variant}". Only "light" and "dark" exist.`);
  }
  const extra = opts.className ? ' ' + opts.className : '';

  if (row.state !== 'filled') {
    if (row.state !== 'placeholder') die(`slot "${id}" has state "${row.state}". Only "placeholder" and "filled" exist.`);
    return `<div class="ph ph--${variant}${extra}" data-photo-slot="${esc(id)}" style="--ph-ratio: ${esc(row.ratio)};"><span class="ph__id">${esc(id)}</span></div>`;
  }

  if (!REAL(row.provenance)) die(`slot "${id}" is filled and names no provenance row. R-W: an image and its row land in the same commit.`);
  const alt = row.alt && row.alt[opts.locale || 'ro'];
  if (!REAL(alt)) die(`slot "${id}" is filled and has no alt text for ${opts.locale || 'ro'}.`);
  /* `provenance` is the repo path, `public/img/...`. The site serves public/ at
     the root, so the URL is BASE + the path with `public/` removed. Written this
     way rather than as BASE + '/img/' + name, which was the first version and
     emitted /img/img/... for every filled slot: the path already carries its own
     img/ and a second one was pasted in front of it. */
  const rel = row.provenance.replace(/^public\//, '');
  if (!fs.existsSync(path.join('public', rel))) die(`slot "${id}" is filled and names ${row.provenance}, which does not exist.`);
  const webpRel = rel.replace(/\.jpe?g$/i, '.webp');
  const hasWebp = fs.existsSync(path.join('public', webpRel));

  /* The box, from the ledger's ratio, so the frame is reserved before the bytes
     land and nothing reflows. min_px is the delivery floor, not the render size. */
  const [rw, rh] = String(row.ratio).split('/').map((n) => Number(n.trim()));
  if (!(rw > 0 && rh > 0)) die(`slot "${id}" has ratio "${row.ratio}", which is not two positive numbers.`);
  const W = 800, H = Math.round((800 * rh) / rw);

  /* W25-01. The first row of a catalogue grid is above the fold on a phone and
     must not be lazy; everything after it is. The caller says which, because only
     the caller knows where in a list it is. */
  const loading = opts.eager ? 'eager' : 'lazy';
  /* W27-FIX-02. The first hub tile's picture is the roofing page's largest contentful paint,
     and Lighthouse's LCP discovery insight named the one hint it lacked: fetchpriority=high.
     The caller says which slot is that picture; nothing else changes. */
  const priority = opts.priority ? ' fetchpriority="high"' : '';
  const sources = hasWebp ? `<source type="image/webp" srcset="${BASE}/${esc(webpRel)}">` : '';
  return `<picture class="ph ph--filled ph--${variant}${extra}" data-photo-slot="${esc(id)}" style="--ph-ratio: ${esc(row.ratio)};">${sources}<img src="${BASE}/${esc(rel)}" alt="${esc(alt)}" width="${W}" height="${H}" loading="${loading}"${priority} decoding="async"></picture>`;
}

/* The name every call site has used since W24-01. Kept, because renaming it would
   touch eighteen call sites to say the same thing, and because a slot that is
   still empty IS a placeholder. */
const placeholder = slotImage;

// --- W24-07, the bento hub section (W24-R5, W24-R8) --------------------------

/* A heading whose second part is muted, then four tiles: one tall on the left
   spanning both rows and about a third of the width, one wide at the top right,
   and two equal below it. Large radius, the label bottom left in white, and each
   tile a --bg-dark placeholder carrying its slot id.

   GEOMETRY IS COPIED AND NOTHING ELSE IS (W24-R8). The reference's own numbers,
   measured: 3 equal columns at 1024px and above, rows of a fixed 244px, a 16px
   gap both ways, a 24px tile radius, the label bottom left at 24px of padding,
   and one column below 1024px with the tall tile first. Its colours and its type
   are not copied and no eleventh colour value is added.

   THE GRADIENT IS PERMITTED HERE AND ONLY HERE (W24-R5): a bottom gradient
   INSIDE a tile, for the label to be legible over a photograph once one lands.
   The section-level overlay ban is untouched, and this is not a section
   background: it is 40% of one tile, it paints over an image rather than over a
   band, and it creates no fourth off-white.

   A TILE THAT IS NOT A LINK IS NOT A LINK. The dispatch gives each bento one
   tile that goes nowhere: it renders as a <div>, not an <a>, carries
   aria-disabled, and takes no hover and no pointer cursor. A disabled <a> with an
   href is still a link to a keyboard and to a screen reader, which is why it is
   not one. */
/* W26-04, ruling W26-R5. THE SAME COMPONENT, TWICE ON ONE PAGE, UNDER TWO RULES.

   A HUB bento's tiles open pages (W26-R4). A PRODUCT bento's tiles open sections
   of the page they are on, which is their whole purpose: the filter bar stays and
   the tile presses it. So `kind` is a property of the bento, not of a tile, and
   each kind refuses what the other requires.

   THE CLASS PREFIX IS DIFFERENT AND THAT IS DELIBERATE. `.hub__tile` carries more
   than a look: `verify-live.js` counts it as a marker, gate 20 measures its
   geometry and gate 26 holds its href to a page. A second component wearing that
   class would be counted, measured and RULED as a hub, which is how a tile that
   must be an anchor would be refused by the gate that must not see it. So the
   product bento is `.pb__*`, grepped free across the stylesheet, build.js, main.js
   and every script before its first rule was written (rule 3.1), and the
   stylesheet gives the two prefixes ONE rule body through a selector list rather
   than two declarations that could drift. */
function bentoSection(l, cfg) {
  const need = (v, where) => { if (!REAL(v)) die(`bento ${cfg.id}: ${where} is not real for ${l.code}.`); return v; };
  /* W27-C-02 (W27-R-06): a bento is four tiles unless its config says how many. Only the
     roofing product bento says five, for the Tabla cutata tile on a third row; every hub
     grid stays at four, and gate 20 measures both shapes. */
  const wantTiles = cfg.tileCount || 4;
  if (!Array.isArray(cfg.tiles) || cfg.tiles.length !== wantTiles) die(`bento ${cfg.id}: ${(cfg.tiles || []).length} tiles, expected exactly ${wantTiles}.`);
  const hub = cfg.kind !== 'product';
  const P = hub ? 'hub' : 'pb';
  /* AMENDED (W25-24, ruling W25-R24): every hub tile has a destination. The old
     assertion required EXACTLY ONE inert tile, which was the dispatch's design at
     W24-07 and is now the thing the ruling forbids. It is inverted rather than
     deleted: a tile with no destination is a photograph that is not a link, and
     scripts/check-hub-tile-links.js holds the other half over the built pages. */
  const inert = cfg.tiles.filter((x) => !x.page && !x.inConstructie && !x.anchor && !x.home).length;
  if (inert !== 0) die(`bento ${cfg.id}: ${inert} tile(s) with no destination. W25-R24: every hub tile has an href.`);
  for (const x of cfg.tiles) {
    if (x.page && !PRODUCT_PAGES.some((p) => p.slug === x.page) && !SERVICE_SLUGS.includes(x.page)) {
      die(`bento ${cfg.id}: tile "${x.label}" opens /${x.page}/, which this build emits no page for.`);
    }
    /* W26-R4, card W26-03: A HUB TILE OPENS A PAGE. The owner's words: "a hub tile
       href must be a page URL, never a same-page anchor". W25-24 gave two tiles an
       anchor when they stopped being inert, under a reading of W25-R24 that the
       owner has now closed. This is the build-time half; gate 26 holds the built
       tree. It is refused HERE rather than silently rewritten, because a tile whose
       destination does not exist is a product decision, not a substitution.
       IT IS SCOPED TO THE HUB, and the product bento is held to the MIRROR of it
       (W26-04): its tiles open a section of this page and nothing else, because a
       product tile that left the page would leave the filter bar behind. */
    if (hub && x.anchor) {
      die(`bento ${cfg.id}: tile "${x.label}" points at "#${x.anchor}". W26-R4: a hub tile opens a page, never a same-page anchor.`);
    }
    if (!hub && !x.anchor) {
      die(`bento ${cfg.id}: tile "${x.label}" is a product tile and names no anchor. W26-R5: a product tile opens a section on the same page.`);
    }
  }

  const tiles = cfg.tiles.map((x, i) => {
    const label = esc(need(l.strings[x.label], x.label));
    /* W26-03: the anchor branch is gone with W26-R4. A tile opens a product or
       service page, or the "in construcție" page, and the assertion above refuses
       anything else before rendering is reached. */
    /* W26-11, ruling W26-R12: "A fragment on a different page is allowed; same-page
       anchors stay banned." So a page tile may name a `fragment` on the page it
       opens, and a tile may open the homepage (`home`), with or without one. Gate
       26 resolves every fragment against the built page it names. */
    if (x.fragment && !/^[a-z0-9-]+$/.test(x.fragment)) die(`bento ${cfg.id}: tile "${x.label}" names the fragment "${x.fragment}", which is not an id.`);
    if (x.fragment && !x.page && !x.home) die(`bento ${cfg.id}: tile "${x.label}" names a fragment and no page to find it on.`);
    const frag = x.fragment ? `#${x.fragment}` : '';
    x = { ...x, href: x.page ? `${BASE}${SERVICES_ROOT[l.code]}${x.page}/${frag}`
      : (x.home ? `${BASE}${l.home}${frag}`
        : (x.inConstructie ? BASE + IN_CONSTRUCTIE[l.code] : (x.anchor ? `#${x.anchor}` : null))) };
    const ph = placeholder(x.slot, { variant: 'dark', className: `${P}__ph`, locale: l.code, eager: i < 2, priority: hub && i === 0 });
    const body = `${ph}<span class="${P}__grad" aria-hidden="true"></span><span class="${P}__label">${label}</span>`;
    const cls = `${P}__tile ${P}__tile--${i + 1}`;
    /* W25-24. There is no non-link branch any more. The assertion above refuses a
       tile with no destination, so `href` is always set, and a branch that can
       never be taken is markup the stylesheet would have to keep a rule for.
       `.hub__tile--inert` is deleted with it. */
    if (!x.href) die(`bento ${cfg.id}: tile "${x.label}" reached rendering with no href.`);
    return `      <a class="${cls}" href="${x.href}" data-reveal data-stagger="${i}">${body}</a>`;
  }).join('\n');

  /* NO BACKTICK INSIDE THE LITERAL BELOW, and this warning lives HERE rather than
     in the markup because a comment in the markup ships to every visitor.
     W26-04 wrote one into that HTML comment and this function returned NaN: the
     backtick closed the template literal, the expression became a tagged template
     whose tag was a string, and both bentos rendered as nothing on a build that
     exited 0. It is W24-09a's defect exactly, in a second file. */
  return `<section class="section section--light section--divided ${P}" id="${cfg.id}" aria-labelledby="${cfg.id}-h">
  <div class="container">
    <h2 id="${cfg.id}-h" class="${P}__h" data-reveal>${esc(need(l.strings[cfg.head], cfg.head))}<span class="${P}__h-muted">${esc(need(l.strings[cfg.headMuted], cfg.headMuted))}</span></h2>
    <div class="${P}__grid"${hub ? ' data-hub-grid="1"' : ''}>
${tiles}
    </div>
  </div>
</section>
`;
}

// --- W14-06, the catalog mega-menu (S-01) ------------------------------------

/* Data-driven from content/catalog.json, taxonomy shape from the wave 14 audit
   section 1.2: categories, some with subcategories, two levels deep and never
   three. While `categories` is empty this returns '' and neither the button nor
   the panel exists on any page. That is the shipped state until Q-W14-04 names
   the labels and the page each row opens.

   Presence, not silence (docs/CLAUDE.md section 13): a file without a
   `categories` array fails the build rather than reading as an empty menu. So
   does a label that is not real in both locales, a row with no target, and a
   third level, which is refused rather than flattened. */
const CATALOG_FILE = 'content/catalog.json';
const CATALOG = JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf8'));
if (!Array.isArray(CATALOG.categories)) die(`${CATALOG_FILE} has no "categories" array. An empty menu is [], never a missing key.`);
/* W26-06, rulings W26-R5 and W26-R7's dispatch: a category can be LISTED or not.
   An unlisted category still builds its pages (the roofing redirect pages stand
   under W26-R5), still feeds every data consumer, and is simply absent from the
   two places a visitor browses the catalogue from: the /catalog/ index tiles and
   the header Catalog panel. It is a flag in the data rather than a slug in this
   file because whether a category is on offer is a decision, and a decision held
   in code is one nobody can read. Absent means listed; anything but a boolean is
   refused, so a typo cannot hide a category. */
CATALOG.categories.forEach((c, i) => {
  if ('listed' in c && typeof c.listed !== 'boolean') die(`${CATALOG_FILE}: categories[${i}].listed is ${JSON.stringify(c.listed)}; it must be true or false.`);
});
const catalogListed = (c) => c.listed !== false;
if (!CATALOG.categories.some(catalogListed)) die(`${CATALOG_FILE}: every category is unlisted, so the catalogue index and menu would be empty.`);

function catalogField(entry, field, l, where) {
  const v = entry[field] && entry[field][l.code];
  if (!REAL(v)) die(`${CATALOG_FILE}: ${where} has no real ${field} for ${l.code}.`);
  return v;
}
const catalogHref = (entry, l, where) => {
  const h = catalogField(entry, 'href', l, where);
  return /^https?:\/\//.test(h) ? h : BASE + h;
};

/* W25-09. One link-arrow to a catalogue category page, built from
   content/catalog.json's own label and href. Used by the service and product
   pages that the dispatch asks to reach the new roofing category. It dies rather
   than guessing if the slug is not in the file, because a silently missing link
   is exactly the orphan this exists to prevent. */
function catalogLinkArrow(l, slug) {
  const i = CATALOG.categories.findIndex((c) => (c.href && c.href.ro) === `/catalog/${slug}/`);
  if (i < 0) die(`catalogLinkArrow: no category in ${CATALOG_FILE} opens /catalog/${slug}/.`);
  const where = `${CATALOG_FILE}: categories[${i}]`;
  const label = esc(catalogField(CATALOG.categories[i], 'label', l, where));
  /* W25-19. The roofing category's page only forwards to the section now, so a
     link to it would cost the visitor a page load to arrive where this link was
     already sending them. The LABEL is unchanged and still comes from
     content/catalog.json: only the destination moves. Both call sites are roofing
     ones, the tile page and the offers block, and both are what the dispatch
     means by "add a link to the section". */
  const href = slug === ROOF_CATEGORY
    ? `${BASE}${ROOF_SECTION_PATH(l)}#${roofAnchor(ROOF_ALL)}`
    : catalogHref(CATALOG.categories[i], l, where);
  return `
    <a class="link-arrow" href="${href}" data-reveal style="margin-top: 16px;">${label}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>`;
}

function catalogMenu(l) {
  if (CATALOG.categories.length === 0) return '';
  const chevron = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 6 15 12 9 18"></polyline></svg>';
  const back = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 6 9 12 15 18"></polyline></svg>';
  const rows = CATALOG.categories.map((c, i) => {
    /* W26-06. An unlisted category has no row. `i` stays the data index, so a
       sub-list keeps its id when a category above it is unlisted. */
    if (!catalogListed(c)) return null;
    const where = `categories[${i}]`;
    const label = esc(catalogField(c, 'label', l, where));
    const href = catalogHref(c, l, where);
    const kids = c.children || [];
    if (kids.length === 0) {
      return `          <li class="catalog__row"><a class="catalog__link" href="${href}">${label}</a></li>`;
    }
    const sub = kids.map((k, j) => {
      const w = `${where}.children[${j}]`;
      if (k.children) die(`${CATALOG_FILE}: ${w} has children. The menu is two levels deep, never three.`);
      return `                <li class="catalog__row"><a class="catalog__link" href="${catalogHref(k, l, w)}">${esc(catalogField(k, 'label', l, w))}</a></li>`;
    }).join('\n');
    return `          <li class="catalog__row catalog__row--parent">
            <a class="catalog__link" href="${href}">${label}</a>
            <button class="catalog__expand" type="button" aria-expanded="false" aria-controls="catalog-sub-${i}" aria-label="${label}: ${esc(l.strings['header.catalogExpand'])}">${chevron}</button>
            <div class="catalog__sub" id="catalog-sub-${i}" hidden>
              <button class="catalog__back" type="button">${back}<span>${esc(l.strings['header.catalogBack'])}</span></button>
              <ul class="catalog__list">
                <li class="catalog__row catalog__row--title"><a class="catalog__link" href="${href}">${label}</a></li>
${sub}
              </ul>
            </div>
          </li>`;
  }).filter(Boolean).join('\n');
  return `<div class="catalog">
      <button class="catalog__toggle" type="button" id="catalog-toggle" aria-expanded="false" aria-controls="catalog-panel"><svg class="catalog__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg><span class="catalog__label">${esc(l.strings['header.catalog'])}</span></button>
      <div class="catalog__panel" id="catalog-panel" hidden>
        <p class="catalog__heading" id="catalog-heading">${esc(l.strings['header.catalogHeading'])}</p>
        <ul class="catalog__list catalog__list--top" aria-labelledby="catalog-heading">
${rows}
        </ul>
      </div>
    </div>
    `;
}

// --- W15-02, the Servicii dropdown (RC-126) ----------------------------------

/* Q-W14-15 asked how the fences page reaches the desktop header when a fifth
   flat nav link does not fit at any width in either locale. It does not: the
   Servicii link becomes a disclosure listing every service and product page, so
   the header gains a destination list without gaining a target.

   Same interaction model as the catalog menu: a button, click to open, never
   hover. One level deep, so no expand chevron per row and no back button.

   No copy is invented. The toggle reuses header.navServices, the first row
   reuses it again as the overview link (the catalog's --title row pattern), and
   every other row reuses a page title that already ships.

   Presence, not silence (docs/CLAUDE.md section 13): every label must be real
   and the row count must be the overview plus every service plus every product
   page, so a page added or dropped in data fails the build rather than quietly
   leaving the header. That assertion is what "every service page reachable from
   the desktop header" rests on. */
function serviciiMenu(l) {
  const need = (v, where) => {
    if (!REAL(v)) die(`serviciiMenu: ${where} is not real for ${l.code}.`);
    return v;
  };
  const row = (href, text, cls) =>
    `          <li class="svcmenu__row${cls ? ' ' + cls : ''}"><a class="svcmenu__link" href="${href}">${esc(text)}</a></li>`;
  const items = [
    row(BASE + l.home + '#servicii', need(l.strings['header.navServices'], 'header.navServices'), 'svcmenu__row--title'),
    ...SERVICE_SLUGS.map((sg, i) => row(
      `${BASE}${SERVICES_ROOT[l.code]}${sg}/`,
      need(l.strings[`services.items.${i}.title`], `services.items.${i}.title`))),
    /* W24-06: the top-level product pages only. Tigla metalica is a child of
       acoperisuri and is reached from that page, not from this list. */
    ...TOP_LEVEL_PRODUCT_PAGES.map((p) => row(
      `${BASE}${SERVICES_ROOT[l.code]}${p.slug}/`,
      need(l.strings[`pages.${p.key}.title`], `pages.${p.key}.title`))),
  ];
  const expected = 1 + SERVICE_SLUGS.length + TOP_LEVEL_PRODUCT_PAGES.length;
  if (items.length !== expected) die(`serviciiMenu: ${items.length} rows, expected ${expected}.`);
  const label = esc(l.strings['header.navServices']);
  return `<div class="svcmenu">
      <button class="svcmenu__toggle" type="button" id="svcmenu-toggle" aria-expanded="false" aria-controls="svcmenu-panel">${label}<svg class="svcmenu__caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
      <div class="svcmenu__panel" id="svcmenu-panel" hidden>
        <ul class="svcmenu__list" aria-label="${label}">
${items.join('\n')}
        </ul>
      </div>
    </div>`;
}

// --- W19-D8, the quote form's "Tipul lucrării" list -------------------------

/* The homepage quote form asks which service the lead is for. Its list was
   hardcoded as ten locale strings, the nine services and "Altceva", and wave 14
   added three product pages that the list never gained: a visitor who came for a
   fence, a carport or metal tile had to pick "Altceva", and the owner received a
   lead that said "something else" for a page the site sells.

   So the options are the Servicii menu's own rows, from the same two sources in
   the same order (SERVICE_SLUGS, then PRODUCT_PAGES), with "Altceva" last. The
   value sent as `tip_lucrari` is the label itself, identical to the menu's, so
   a product page added to PRODUCT_PAGES reaches the list with no second edit.
   Presence, not silence: every label must be real, and the count must be every
   service plus every product page plus the catch-all. */
function workTypeOptions(l) {
  const need = (v, where) => {
    if (!REAL(v)) die(`workTypeOptions: ${where} is not real for ${l.code}.`);
    return v;
  };
  const labels = [
    ...SERVICE_SLUGS.map((_, i) => need(l.strings[`services.items.${i}.title`], `services.items.${i}.title`)),
    ...PRODUCT_PAGES.filter((p) => !p.formless).map((p) => need(l.strings[`pages.${p.key}.title`], `pages.${p.key}.title`)),
    need(l.strings['form.optionOther'], 'form.optionOther'),
  ];
  const expected = SERVICE_SLUGS.length + PRODUCT_PAGES.filter((p) => !p.formless).length + 1;
  if (labels.length !== expected) die(`workTypeOptions: ${labels.length} options, expected ${expected}.`);
  return labels.map((t) => `            <option>${esc(t)}</option>`).join('\n');
}

// --- W19-D9, the Russian 404 ---------------------------------------------------

/* A static host answers every unknown path on the origin with the ONE root
   /404.html, so a broken link under /ru/ showed the Romanian page, and
   dist/ru/404.html was never served. The host cannot choose a 404 by directory,
   so the page does, before it paints:

   - the root 404 (RO), for a path under /ru/, replaces the location with the
     Russian 404, carrying the broken path along. It is the first script in
     <head>, ahead of every stylesheet, so nothing Romanian renders first. A path
     that merely starts with the letters "ru" (/rus/, /ruta/) is not Russian.
   - the Russian 404 puts the broken path back in the address bar with
     history.replaceState, so the visitor still sees what they asked for. It
     accepts only a path under /ru/, which also keeps the value on this origin.

   The broken URL's own response stays 404; both pages stay noindex. Without
   JavaScript the Romanian page shows, as before. The script is emitted into the
   two 404 pages only. */
function notFoundLocale(l) {
  const ruRoot = `${BASE}/ru/`;
  const ruPage = `${BASE}/ru/404.html`;
  if (l.code === 'ro') {
    return `<script>
(function () {
  var p = location.pathname;
  if (p.indexOf(${JSON.stringify(ruRoot)}) !== 0 || p === ${JSON.stringify(ruPage)}) return;
  location.replace(${JSON.stringify(ruPage)} + '?from=' + encodeURIComponent(p + location.search + location.hash));
})();
</script>`;
  }
  return `<script>
(function () {
  var m = /[?&]from=([^&#]*)/.exec(location.search);
  if (!m || !history.replaceState) return;
  var from;
  try { from = decodeURIComponent(m[1]); } catch (e) { return; }
  if (from.indexOf(${JSON.stringify(ruRoot)}) !== 0) return;
  history.replaceState(null, '', from);
})();
</script>`;
}

// --- W21-04 (RC-149), catalog product records, structure only -----------------

/* The category pages describe a material and ask for a quote. This adds the
   place a PRODUCT RECORD goes when the owner supplies one: a card with the
   product's name, its manufacturer, how it is packed or how far it goes, one
   key specification, and a button that asks for a price rather than printing
   one. No price, no stock, no availability, no cart, no image: those are the
   category pages' standing prohibitions (scripts/check-catalog-pages.js) and
   this card does not touch them.

   THE SECTION RENDERS ONLY WHERE THERE ARE RECORDS, which today is nowhere:
   content/catalog-products.json ships with seven empty arrays because the card
   is blocked on the product list and the only products any repo file records
   belong to three other companies. That is the same shape as the before/after
   slider and the specification table: data absent, section absent.

   The button carries the product's own name in data-product. src/main.js copies
   it into the quote form's hidden `serviciu` field before the page jumps to the
   form, so a lead says which product it is about. Nothing else about the form
   changes. */
/* W24-04. The catalogue product grid, mirroring the reference site's GEOMETRY and
   none of its colour or type (W24-R8): a white card with a large radius, a square
   image area on top, a small brand line, the name in bold over two to three lines,
   the variant line in muted text, and a bottom row with the price bold on the left
   and a square brand-orange icon button on the right.

   THE IMAGE AREA IS THE W24-01 PLACEHOLDER. Every image wave 24 renders is one,
   and every one has a row in docs/PHOTO-SLOTS-W24.json that gate 19 holds it to.

   THE PRICE IS THE SOURCE'S, inside .prod__price and nowhere else. W24-R3 amends
   Q-W21-01: a card shows the price, and the W22-01 phrase is left for the one case
   where the source publishes none. scripts/check-catalog-pages.js is re-scoped to
   match: a price is permitted only inside a .prod__price that carries its own
   product name, and is refused everywhere it was refused before.

   NO CART, NO SKU, NO schema.org Offer. The button opens the existing quote form
   with the product name already in it, which is what src/main.js already does with
   data-product, and it carries the record id too so two products that share a name
   do not send an identical lead line. */
/* W24-09. How many cards a phone shows before the first press, and how many each
   press adds. One number, because the dispatch specifies one. It is emitted onto
   the grid as `data-prod-step` so main.js reads it from the markup rather than
   carrying a second copy, and so the layout gate can assert the rendered count
   against the number the page states.

   ~~the first twelve, then twelve more per press.~~
   AMENDED (W24-10, the owner's answer to Q-W24-04): NINE. Twelve could not reach
   the dispatch's target of under 9,000px at 390 -- twelve one-column cards on a
   ledgered 1/1 placeholder are 6,181px and the rest of the page is 4,008 -- and
   nine was measured at 8,696px before the question was opened. The owner took
   nine. Changing this constant is the whole change: the CSS, main.js, gate 20 and
   the live markers all read the count off the markup.

   IT IS ALSO SUBSTITUTED INTO THE BUTTON'S ACCESSIBLE NAME below, because the
   first version of that string said "12" in words and would have quietly lied the
   moment this number moved. A number that appears twice is a number that drifts. */
const PROD_STEP = 9;

/* W25-19. The card, lifted out of catalogProducts unchanged, because the
   consolidated roofing section on /servicii/acoperisuri/ renders the SAME card
   and a second copy of this markup would be a second thing to keep in step. The
   only addition is `extra`, an attribute string the caller puts on the
   <article>: the roofing section uses it to carry which filter groups a record
   belongs to, and nothing else uses it. */
function prodLabel(l, k) {
  const v = l.strings[`catalogProducts.${k}`];
  if (!REAL(v)) die(`catalogProducts.${k} must be real in ${l.code}.`);
  return v;
}
/* W27-C-03 (W27-R-04). THE COLOUR DICTIONARY IS THE ONE THE REPO ALREADY HAS: the fence
   palette in content/garduri-modele.json and the metal tile legend in
   content/tigla-metalica.json, matched on the exact Romanian name, case-insensitively.
   A name neither file carries keeps its Romanian form on the Russian page, which is
   what the dispatch said to do ("missing entries keep RO"); nothing is translated by
   guesswork here. Built once, read by the imperlux model cards. */
const COLOUR_RU = (() => {
  const m = new Map();
  try {
    const gard = JSON.parse(fs.readFileSync('content/garduri-modele.json', 'utf8'));
    for (const v of Object.values(gard.palette || {})) if (v && REAL(v.ro) && REAL(v.ru)) m.set(v.ro.toLowerCase(), v.ru);
    const tig = JSON.parse(fs.readFileSync('content/tigla-metalica.json', 'utf8'));
    for (const e of tig.legend || []) if (e.name && REAL(e.name.ro) && REAL(e.name.ru)) m.set(e.name.ro.toLowerCase(), e.name.ru);
    /* AMENDED (W27-FIX-04, Q-W27-02 part 3): a THIRD source, the bare colour words the
       imperlux model cards and the Novatik page print and neither file above carries (Maro,
       Negru, Ciocolata, Maro inchis, Gri). They live in content/roofing-sections.json under
       `colour_names`, authored the way the fence palette's Russian names are, and a name still
       missing after all three keeps its Romanian form as before. */
    const roof = JSON.parse(fs.readFileSync('content/roofing-sections.json', 'utf8'));
    for (const [ro, v] of Object.entries(roof.colour_names || {})) if (REAL(ro) && v && REAL(v.ru)) m.set(ro.toLowerCase(), v.ru);
  } catch (e) { die(`colour dictionary: ${e.message}`); }
  if (!m.size) die('colour dictionary: no entries read from the fence palette or the tile legend.');
  return m;
})();
const colourName = (l, ro) => (l.code === 'ru' && COLOUR_RU.has(String(ro).toLowerCase()) ? COLOUR_RU.get(String(ro).toLowerCase()) : ro);
/* "3 culori" / "3 цвета": Russian counts a noun three ways, Romanian two. */
const colourWord = (l, n) => {
  const k = n === 1 ? 'coloursOne' : (l.code === 'ru' && (n % 10 >= 2 && n % 10 <= 4 && !(n % 100 >= 12 && n % 100 <= 14)) || (l.code === 'ro' && n > 1)) ? 'coloursFew' : 'coloursMany';
  const v = l.strings[`roofProducts.${k}`];
  if (!REAL(v)) die(`roofProducts.${k} must be real in ${l.code}.`);
  return v;
};
const PROD_ARROW = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';

function prodCard(l, r, i, extra = '') {
  const label = (k) => prodLabel(l, k);
  const arrow = PROD_ARROW;
  {
    const name = r.name[l.code];
    const variant = r.variant && r.variant[l.code];
    /* The price is the source's own string for this locale, unit included. It is
       not recomposed from the bounds: 100 of the 223 products state a unit after
       the figure ("129,00 lei / m"), and a price printed without its unit is a
       different price. The two locales can disagree, because the source
       disagrees with itself on some records; each is copied as that locale shows
       it, and docs/CATALOG-SOURCE-W24.md lists every disagreement. */
    /* AMENDED (W26-04): `price` may be absent altogether, not merely unrendered.
       Every catalogue record carries a price object whose `render` can be null;
       an imperlux.md roofing model that folds no dasterum record carries NO price
       object, because the source publishes none. Both land on the ask element. */
    const price = (r.price && r.price.render && r.price.render[l.code]) || null;
    /* The lead line names the product and RAPID CONSTRUCT'S OWN slot id, never the
       source's record id. Ten names are used by two products each, so something
       must disambiguate them or two products send an identical lead; `f3d-3004`
       would do that, and would also publish the source's own identifier in the
       markup of 223 cards and in every lead email. CAT-0042 is this repo's id for
       the same product, it is unique, and it is the id the photo session already
       uses. */
    const lead = `${name} (${r.slot})`;
    const parts = [];
    parts.push(`        <div class="prod__media">${placeholder(r.slot, { variant: 'light', className: 'prod__ph', locale: l.code, eager: i < 4 })}</div>`);
    parts.push('        <div class="prod__body">');
    /* W24-09, the owner's answer to Q-W24-03 part 2. `brand_hidden` withholds the
       brand LINE while the brand itself stays in the record, which is how the 27
       refused-name records already behave. The 64 Elemente decorative products
       carry RedConstruct, the source's own house brand, and printing another
       company's house brand on this catalogue reads as reselling their range.
       The products are kept; only the line is withheld. One flag, so the owner's
       other answer is a one-flag change either way. */
    if (REAL(r.brand) && !r.brand_hidden) parts.push(`          <p class="prod__brand">${esc(r.brand)}</p>`);
    parts.push(`          <h3 class="prod__name">${esc(name)}</h3>`);
    /* W27-C-03 (W27-R-04): the imperlux model card's tagline, colour chips and facts line.
       The chip names go through the colour dictionary for RU and keep their RO name
       where it has no entry, which is what the dispatch asked for. */
    if (r.tagline && REAL(r.tagline[l.code])) parts.push(`          <p class="prod__tag">${esc(r.tagline[l.code])}</p>`);
    if (REAL(variant)) parts.push(`          <p class="prod__variant">${esc(variant)}</p>`);
    if (Array.isArray(r.colours) && r.colours.length) {
      const chips = r.colours.map((c) => `<li class="prod__chip">${esc(colourName(l, c))}</li>`).join('');
      /* W27-FIX-04 (ruling W27-R-11): a colour the count includes and the list does not name
         renders as one more chip, "+N", as imperlux's own card prints it. Derived from the count
         the record states (specs.Culori) and the names it carries, never typed as a chip, so a
         model that later names its colour loses the "+N" by itself. The count itself is unchanged. */
      const count = r.specs && r.specs.Culori && Number(r.specs.Culori[l.code]);
      const more = Number.isInteger(count) && count > r.colours.length ? `<li class="prod__chip" data-more="${count - r.colours.length}">+${count - r.colours.length}</li>` : '';
      parts.push(`          <ul class="prod__chips" aria-label="${esc(l.strings['roofProducts.coloursAria'] || '')}">${chips}${more}</ul>`);
    }
    if (REAL(r.facts)) parts.push(`          <p class="prod__facts">${esc(r.facts)}</p>`);
    parts.push('          <div class="prod__foot">');
    parts.push(price == null
      ? `            <span class="prod__ask" data-product="${esc(lead)}">${esc(label('ask'))}</span>`
      : `            <span class="prod__price" data-product="${esc(lead)}">${esc(price)}</span>`);
    /* The button's accessible name has to tell two cards apart, and two cards can
       carry the same product name: the source uses ten names twice, so nine
       buttons on the ceramic plates page would otherwise share a name while
       leading to different outcomes.
       It names the slot, not the price. A price in an aria-label is a price
       outside .prod__price, which W24-R3 refuses and the catalogue gate reports:
       it was written that way first and the gate caught it, on 1,230 hits. The
       slot id is this repo's own unique handle for the product, it is printed on
       the card's placeholder, and it is what the photo session uses. */
    parts.push(`            <a class="prod__cta" href="#oferta" data-product="${esc(lead)}" aria-label="${esc(label('ctaAria'))}: ${esc(lead)}">${arrow}</a>`);
    parts.push('          </div>');
    parts.push('        </div>');
    return `      <article class="prod" data-product-card${extra} data-reveal data-stagger="${Math.min(i, 6)}">\n${parts.join('\n')}\n      </article>`;
  }
}

function catalogProducts(l, slug) {
  const records = CATALOG_PRODUCTS[slug] || [];
  if (!records.length) return '';
  const label = (k) => prodLabel(l, k);
  const cards = records.map((r, i) => prodCard(l, r, i));

  /* The dispatch specifies the page as breadcrumb, heading and grid, with no
     visible section heading. A card's name is an h3, so without an h2 between
     them the page runs h1 straight to h3, which is a heading-order defect: a
     screen reader reports a level that was never opened. The section heading is
     therefore present and visually hidden, in the .sr-only the before/after
     slider already uses for exactly this, and it reuses catalogProducts.h2,
     which the site already ships. Nothing new is written and nothing is shown. */
  /* W24-09. The phone reveal. A catalogue grid is one column below 768px, so
     placi-ceramice ran 88 cards deep and the page was 33,000px long: a visitor
     who wants the fourth product scrolls past none of them, and one who wants
     the last scrolls past 87.

     EVERY CARD IS IN THE HTML, always, on every width. Nothing here is rendered
     conditionally and nothing is fetched: the fold is a class that main.js puts
     on the cards past the first PROD_STEP, and the rule that acts on it lives
     inside a max-width media query. Three things follow, and each is the reason
     it is built this way rather than by slicing the array:

       · a crawler reads the whole grid, because the whole grid is in the markup;
       · with no JS nothing is folded, so every card shows, which is the
         no-dependency behaviour the card asks for;
       · desktop cannot regress, because the folding rule does not exist above
         768px. It is held by CSS, not by a width test in JS that could be wrong.

     The button is `hidden` in the markup and main.js unhides it only when it has
     actually folded something. So a visitor with no JS is never shown a control
     that would do nothing, and neither is a desktop visitor. */
  /* {n} is PROD_STEP, substituted here so the spoken label and the behaviour
     cannot disagree. A locale string that states the count in words would have to
     be edited in two files every time the count moves, and would be wrong in the
     window between them. The build refuses a string that lost its placeholder. */
  const ariaRaw = label('moreAria');
  if (!ariaRaw.includes('{n}')) die(`catalogProducts.moreAria for ${l.code} has no {n} placeholder, so the reveal button's accessible name cannot state the count.`);
  const ariaLabel = ariaRaw.replace('{n}', String(PROD_STEP));
  const more = cards.length > PROD_STEP
    ? `
    <div class="prod-more" data-prod-more hidden>
      <button class="btn btn--outline prod-more__btn" type="button" data-prod-more-btn aria-controls="produse-grid" aria-label="${esc(ariaLabel)}">${esc(label('more'))}</button>
    </div>`
    : '';
  return `<section class="section section--light section--divided" id="produse" aria-labelledby="produse-h">
  <div class="container">
    <h2 class="sr-only" id="produse-h">${esc(label('h2'))}</h2>
    <div class="prod-grid" id="produse-grid" data-prod-grid data-prod-step="${PROD_STEP}">
${cards.join('\n')}
    </div>${more}
  </div>
</section>`;
}

/* W24-04. The /catalog/ index, which 404'd on the live site: every menu row opened
   a category page and the root of the catalogue opened nothing. Seven tiles, one
   per category, each a W24-01 placeholder with its label and its product count. */
/* NO PRODUCT COUNT ON A TILE, and no lede on this page. Both were written in the
   first draft of this card and both were wrong.

   The count needed a plural, and a two-form rule produced bad Russian on five of
   the seven tiles ("25 товара" where Russian needs "товаров") and dropped the
   Romanian "de" on four ("25 produse" where Romanian needs "25 de produse"). A
   correct rule is a grammar table for a number nobody asked for: the dispatch
   specifies the index as seven category tiles.

   The lede was worse. It read "Categoriile de materiale pe care le livram si le
   punem in opera", which is a first-person capability claim about Rapid Construct
   that no source states: invented copy, refused by docs/CLAUDE.md section 5. The
   catalogue gate would have caught the same sentence one directory down, in a
   category page's lede, on the term "livram"; it is blind to it here only because
   an index page carries no data-cat-prose block. A gate being unable to see a
   thing is not permission to write it.

   The tile carries the category's own label and nothing else. The eyebrow above
   the grid already says what the page lists, from header.catalogHeading. */
function catalogIndexTiles(l) {
  /* W26-06. Only listed categories get a tile. The slot id is the category's DATA
     position, not its position on this page, so CATEG-01 to CATEG-07 keep their
     photographs and ledger rows whatever is unlisted after them. */
  return PARENT_CATEGORIES.filter((c) => catalogListed(CATALOG.categories[c.i])).map((c, i) => {
    const label = categoryLabel(l, c);
    /* W25-19. The roofing tile opens the consolidated section rather than a page
       that now only forwards to it. AMENDED (W26-06): roofing is unlisted, so this
       branch renders nothing today; it stays so that listing it again is the one
       data flag and not a second edit here. */
    const href = c.slug === ROOF_CATEGORY
      ? `${BASE}${ROOF_SECTION_PATH(l)}#${roofAnchor(ROOF_ALL)}`
      : `${BASE}${CATALOG_ROOT[l.code]}${c.slug}/`;
    /* The tile's name is the category, stated. Without it the accessible name is
       assembled from the contents and opens with the placeholder's own slot id,
       so a screen-reader user hears "CATEG-01" before every category, seven times
       a page. */
    return `      <a class="cat-tile" href="${href}" aria-label="${esc(label)}" data-reveal data-stagger="${Math.min(i, 6)}">
        ${placeholder(`CATEG-${String(c.i + 1).padStart(2, '0')}`, { variant: 'dark', className: 'cat-tile__ph', locale: l.code, eager: i < 4 })}
        <span class="cat-tile__body"><span class="cat-tile__label">${esc(label)}</span></span>
      </a>`;
  }).join('\n');
}

// --- W19-D5, the homepage portfolio filter chips ------------------------------

/* The chips were six hardcoded buttons, "Toate" and five categories, while the
   cards come from content/projects.json: the first renderable project of each
   service, six cards. The sixth became a proiectare-3d project and no chip could
   show it. The chip row is now rendered from the cards actually rendered, in their
   order, so every card has its chip by construction.

   Labels are existing strings only (docs/CLAUDE.md section 5). The five categories
   that had a chip keep their short portfolio.filters label exactly; any other
   takes its service title, services.items.N.title, which the site already prints
   for that service. */
const FILTER_LABEL_KEY = {
  'case-la-cheie': 'portfolio.filters.case',
  acoperisuri: 'portfolio.filters.acoperis',
  fatade: 'portfolio.filters.fatade',
  reparatii: 'portfolio.filters.renovari',
  finisaje: 'portfolio.filters.finisaje',
};
function portfolioFilters(l, featured) {
  const need = (v, where) => {
    if (!REAL(v)) die(`portfolioFilters: ${where} is not real for ${l.code}.`);
    return v;
  };
  const cats = [...new Set(featured.map((p) => p.service))];
  const chip = (value, label, pressed) =>
    `      <button class="filter" type="button" data-filter="${value}" aria-pressed="${pressed}">${esc(label)}</button>`;
  const rows = [chip('all', need(l.strings['portfolio.filters.all'], 'portfolio.filters.all'), 'true')];
  for (const slug of cats) {
    const i = SERVICE_SLUGS.indexOf(slug);
    const key = FILTER_LABEL_KEY[slug] || `services.items.${i}.title`;
    rows.push(chip(slug, need(l.strings[key], key), 'false'));
  }
  if (rows.length !== cats.length + 1) die(`portfolioFilters: ${rows.length} chips for ${cats.length} categories.`);
  return rows.join('\n');
}

// --- W14-07, the social row on the hero card (S-07) --------------------------

/* Three profile links under the hero claim's CTA, read from content/social.json,
   which is the one place their hrefs are written for this row. The icons are the
   footer's own inline SVGs, so no image file and no icon library is added: the
   repo has neither, and has no dependencies at all.

   Presence, not silence (docs/CLAUDE.md section 13): a file without a links
   array fails the build rather than rendering an empty row, and so does an icon
   id this function has no drawing for. */
const SOCIAL_FILE = 'content/social.json';
const SOCIAL = JSON.parse(fs.readFileSync(SOCIAL_FILE, 'utf8'));
if (!Array.isArray(SOCIAL.links)) die(`${SOCIAL_FILE} has no "links" array.`);
const SOCIAL_ICONS = {
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.2" cy="6.8" r="1.1"></circle>',
  tiktok: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5c.34 0 .68.05 1 .15"></path><path d="M14 3.5c.4 2.6 2.4 4.6 5 4.9"></path>',
};
function socialRow(l) {
  if (SOCIAL.links.length === 0) return '';
  const items = SOCIAL.links.map((s, i) => {
    if (!SOCIAL_ICONS[s.id]) die(`${SOCIAL_FILE}: links[${i}] id "${s.id}" has no icon in build.js.`);
    if (!REAL(s.label)) die(`${SOCIAL_FILE}: links[${i}] has no label.`);
    if (!/^https:\/\//.test(s.href || '')) die(`${SOCIAL_FILE}: links[${i}] href "${s.href}" is not an https URL.`);
    return `          <li><a href="${esc(s.href)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(s.label)}"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SOCIAL_ICONS[s.id]}</svg></a></li>`;
  }).join('\n');
  return `<ul class="hero-claim__social" aria-label="${esc(l.strings['footer.socialHeading'])}">
${items}
        </ul>`;
}

// --- W14-08, the acoperișuri offer cards (S-02) ------------------------------

/* Four roofing jobs as cards, anatomy from the wave 14 audit section 3.2: a
   brand orange top border, a ghost numeral 01 to 04 top right, the image left at
   0.81:1, a description, a bold options label and bulleted list on cards 01 and
   03 only, and the CTA at the foot of the right column.

   The offer set and the three metal tile origins are the dispatch's. Every other
   claim restates copy the site already carries on the roofing service page: what
   is fitted, over new and existing structures, with which coverings.

   Images are per card and only ever real files. A card whose image file is not
   in public/img/ renders without the image column rather than with a
   placeholder (master plan section 7: a slot with no photo is removed, not
   filled). Any file that does land is already held to R-W by the provenance
   gate, which fails on an image without a row. */
const ROOF_OFFER_COUNT = 4;
const ROOF_OFFERS_WITH_OPTIONS = [0, 2];

function roofOfferImage(i, alt) {
  const id = `offer-roof-0${i + 1}`;
  if (!fs.existsSync(`public/img/${id}.jpg`)) return '';
  if (!REAL(alt)) die(`public/img/${id}.jpg exists but roofOffers.items.${i}.alt is not real. An image that lands brings its alt text in both locales.`);
  const retina = fs.existsSync(`public/img/${id}@2x.jpg`)
    ? ` srcset="${BASE}/img/${id}.jpg 1x, ${BASE}/img/${id}@2x.jpg 2x"` : '';
  return `<div class="offer__media"><img src="${BASE}/img/${id}.jpg"${retina} alt="${esc(alt)}" width="600" height="740" loading="lazy" decoding="async"></div>`;
}

function roofOffers(l) {
  const s = (k) => l.strings[`roofOffers.${k}`];
  const cards = Array.from({ length: ROOF_OFFER_COUNT }, (_, i) => {
    const n = String(i + 1).padStart(2, '0');
    const media = roofOfferImage(i, s(`items.${i}.alt`));
    const options = ROOF_OFFERS_WITH_OPTIONS.includes(i)
      ? `
            <p class="offer__options-label">${esc(s('optionsLabel'))}</p>
            <ul class="offer__options">
              <li>${esc(s('options.0'))}</li>
              <li>${esc(s('options.1'))}</li>
              <li>${esc(s('options.2'))}</li>
            </ul>` : '';
    return `      <article class="offer${media ? ' offer--media' : ''}" data-reveal data-stagger="${i}">
        <p class="offer__n" aria-hidden="true">${n}</p>
        <h3 class="offer__title">${esc(s(`items.${i}.title`))}</h3>
        <div class="offer__body">
          ${media}
          <div class="offer__text">
            <p class="offer__desc">${esc(s(`items.${i}.desc`))}</p>${options}
            <a class="btn btn--primary offer__cta" href="#oferta">${esc(l.strings['header.cta'])}</a>
          </div>
        </div>
      </article>`;
  }).join('\n');
  /* W24-06. The section moved off the homepage onto the acoperisuri service page,
     where the dispatch puts it: four roofing offers belong on the roofing page.

     It carries a link to the tile page, which is the same card's other half: tigla
     metalica became a child of this page and left the header's top-level list, so
     something here has to reach it or the sitemap advertises an orphan. W24-07
     replaces this link with the bento tile the dispatch specifies. */
  const tigla = PRODUCT_PAGES.find((p) => p.parent === 'acoperisuri');
  const toTigla = tigla ? `
    <a class="link-arrow" href="${BASE}${SERVICES_ROOT[l.code]}${tigla.slug}/" data-reveal style="margin-top: 32px;">${esc(l.strings[`pages.${tigla.key}.title`])}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>` : '';
  /* W25-09. And a second link, to the roofing materials in the catalogue. The
     dispatch asks for the seven new pages to be reachable from this hub, and
     until now nothing here opened the catalogue at all. Label and href both come
     from content/catalog.json, so no string is invented and the link cannot
     disagree with the menu. `.link-arrow` is reused deliberately: rule 3.1 says a
     new prefix is a risk and this needs no new block. */
  const toCatalog = catalogLinkArrow(l, 'materiale-acoperis');
  return `<section class="section section--light section--divided" id="acoperisuri" aria-labelledby="acoperisuri-h">
  <div class="container">
    <p class="eyebrow" data-reveal>${esc(s('eyebrow'))}</p>
    <h2 id="acoperisuri-h" data-reveal>${esc(s('h2'))}</h2>
    <p class="lede" data-reveal>${esc(s('lede'))}</p>
    <div class="offers">
${cards}
    </div>${toTigla}${toCatalog}
  </div>
</section>
`;
}

// --- W14-09, the before/after slider (S-03) ----------------------------------

/* One project visible at a time, from content/before-after.json. With an empty
   list this returns '' and the section does not exist: no heading, no padding,
   no gap on the page. That is the shipped state until the client supplies
   before/after pairs, which can only honestly be their own site photographs
   (audit 5.1 classifies every pair as "RC photo only").

   Component per audit 3.3: the after image underneath, the before image on top
   clipped by `clip-path: inset()` driven by a `--position` custom property, a
   full-height handle with a centred pill and grip bars, labels fixed to the
   frame corners, arrow buttons in the header row that wrap at both ends.

   Presence, not silence (docs/CLAUDE.md section 13): a file without a
   `projects` array fails the build, and so does a project whose title or either
   alt is not real in both locales, or whose image files are missing. */
const BA_FILE = 'content/before-after.json';
const BEFORE_AFTER = JSON.parse(fs.readFileSync(BA_FILE, 'utf8'));
if (!Array.isArray(BEFORE_AFTER.projects)) die(`${BA_FILE} has no "projects" array. No projects is [], never a missing key.`);
/* W24-05. The one page the slider renders on. A before and after belongs beside
   the work it is a before and after OF, and the dispatch names this page. */
const BEFORE_AFTER_SLUG = 'case-la-cheie';
/* W24-06. The page the four roofing offers render on, and the page tigla metalica
   is a child of. One constant, so the two cannot drift apart. */
const ROOF_OFFERS_SLUG = 'acoperisuri';

/* W24-07. The bento hubs, by the page each is the first section of. One table, so
   a tile's destination, its label key and its photo slot are written once.

   Every href must be a page this build emits, which is asserted below: the
   dispatch's tiles point at the tile page, a new page, the shared "in
   construcție" page, and nowhere. */
const BENTOS = {
  acoperisuri: {
    id: 'acoperisuri-hub',
    head: 'bento.roofH',
    headMuted: 'bento.roofHMuted',
    tiles: [
      { label: 'bento.roofTigla', slot: 'ACOP-01', page: 'tigla-metalica' },
      { label: 'bento.roofNovatik', slot: 'ACOP-02', page: 'roca-vulcanica' },
      /* AMENDED (W26-11, ruling W26-R12): "no roofing tile links to /in-constructie/".
         This site has no price calculator, and inventing one would be inventing
         prices. The nearest true destination is the metal tile page's "Modele și
         prețuri", where the four models carry their prices per m². A cross-page
         fragment, which the ruling allows. Logged as Q-W26-05. */
      { label: 'bento.roofCalc', slot: 'ACOP-03', page: 'tigla-metalica', fragment: 'tigla-metalica' },
      /* AMENDED (W25-24, under W25-R24): every hub tile has a destination now.
         This one had none and rendered inert. "Reduceri" opens the four roofing
         offers, which are a section of this same page (`#acoperisuri`), so the
         tile finally does what it says.
         AMENDED AGAIN (W26-03, under W26-R4): that anchor is exactly what the
         ruling now forbids, and THIS SITE HAS NO DISCOUNTS PAGE for it to open
         instead. The four offers are authored prose rendered on this page and
         nowhere else, and the site's actual discount is the promo bar's "-10% la
         orice serviciu", which is on every page and is not a destination either.
         Inventing a page or relabelling the tile are both product decisions, so
         neither is taken: it opens the "in construcție" page, which is this site's
         own honest answer for a destination that does not exist yet and is already
         where two other tiles go. Logged as Q-W26-02 with the recommendation. */
      /* AMENDED (W26-11, ruling W26-R12): no longer "in construcție". The only
         discount this site states is the promo bar's 10% on any service, and it
         is claimed by asking for an offer, so the tile opens the homepage offer
         form. Not this page's own form, which would be the same-page anchor the
         ruling keeps banned. Logged as Q-W26-05. */
      { label: 'bento.roofOffers', slot: 'ACOP-04', home: true, fragment: 'oferta' },
    ],
  },
  /* W24-08. The same component, the same four slots, different data. The source
     proves the reuse: its two bentos are byte-for-byte the same markup.
     Tile 1 opens the garduri page's own content, which is this page, so it is an
     in-page anchor rather than a link to somewhere else. */
  garduri: {
    id: 'garduri-hub',
    head: 'bento.fenceH',
    headMuted: 'bento.fenceHMuted',
    tiles: [
      /* AMENDED (W25-24), at the owner's instruction. This tile was an in-page
         anchor to `#garduri`, the "Cum alegi gardul" section 3.5KB further down
         the SAME page a visitor is already on. It is not a broken link and never
         was; it is a tile the size of a photograph that moves you a little way
         down. It opens the models now.
         NOTE, reported rather than fixed here: tile 3 already opens that page, so
         the hub now has two tiles with one destination. Repointing tile 3 is a
         product decision and is the owner's. */
      /* AMENDED (W26-12, ruling W26-R12): "Garduri tip jaluzele opens the fence gallery
         page". */
      { label: 'bento.fenceJaluzele', slot: 'GARDB-01', page: 'galerie-garduri' },
      { label: 'bento.fenceCalc', slot: 'GARDB-02', inConstructie: true },
      { label: 'bento.fenceModele', slot: 'GARDB-03', page: 'modele-garduri' },
      /* AMENDED (W25-24, under W25-R24): was inert. "Prețuri și oferte" opens the
         quote form on this page, which is where a price is asked for.
         AMENDED AGAIN (W26-03, under W26-R4): that anchor is forbidden now, and
         unlike the roofing twin this one has a true page to open. W25-11 published
         a "de la" price on all eight fence model cards, so /servicii/modele-garduri/
         IS where the prices are, and the link means what its label says (section 9).
         NOTE, reported rather than fixed: tiles 1 and 3 already open that page, so
         three of this hub's four tiles now share one destination. Repointing one of
         them is the product decision W25-24 already put to the owner. */
      /* AMENDED (W26-11, ruling W26-R12, verbatim): "Preturi si oferte opens
         /servicii/modele-garduri/#preturi". `#preturi` is the Compară modelele
         table there, whose last column is the price. */
      { label: 'bento.fencePreturi', slot: 'GARDB-04', page: 'modele-garduri', fragment: 'preturi' },
    ],
  },
};
if (!SERVICE_SLUGS.includes(BEFORE_AFTER_SLUG)) die(`the before/after slider names the service "${BEFORE_AFTER_SLUG}", which is not a service page.`);

function beforeAfter(l) {
  const projects = BEFORE_AFTER.projects;
  if (projects.length === 0) return '';
  const t = (k) => esc(l.strings[`beforeAfter.${k}`]);
  /* AMENDED (W24-05): a slot with no photograph renders the W24-01 placeholder
     rather than failing the build. Every image wave 24 renders is a placeholder
     and a separate photo session fills them; the slot decides for itself, per
     docs/CLAUDE.md section 7, so the first real pair renders photographs while
     the other three still render boxes.

     THE BEFORE IS THE LIGHT VARIANT AND THE AFTER THE DARK ONE, which is not
     decoration: with two identical boxes the drag would move nothing visible and
     nobody could tell the component works before a single photograph exists. The
     dispatch asks for exactly that.

     A placeholder is not draggable and takes no pointer of its own, the same as
     the img it stands in for. */
  const img = (id, alt, cls, variant) => {
    if (fs.existsSync(`public/img/${id}.jpg`)) {
      const retina = fs.existsSync(`public/img/${id}@2x.jpg`) ? ` srcset="${BASE}/img/${id}.jpg 1x, ${BASE}/img/${id}@2x.jpg 2x"` : '';
      /* W26-08. `data-photo-slot` on the img, because this IS the rendering of
         that slot and gate 19 walks the built tree for exactly that attribute.
         Without it a filled before/after slot reads as a row nothing renders,
         which is the shape the gate exists to refuse. The slider clips the image
         itself, so it cannot be wrapped in the <picture> the placeholder
         component emits; the gate learned this third shape instead. */
      return `<img class="${cls}" data-photo-slot="${esc(id)}" src="${BASE}/img/${id}.jpg"${retina} alt="${esc(alt)}" width="1180" height="664" loading="lazy" decoding="async" draggable="false">`;
    }
    return placeholder(id, { variant, className: `${cls} ba__ph`, locale: l.code, eager: true });
  };
  const items = projects.map((p, i) => {
    const where = `projects[${i}]`;
    for (const f of ['title', 'alt_before', 'alt_after']) {
      if (!p[f] || !REAL(p[f][l.code])) die(`${BA_FILE}: ${where}.${f} is not real for ${l.code}.`);
    }
    return `      <figure class="ba__item" data-ba-item${i === 0 ? '' : ' hidden'}>
        <h3 class="sr-only">${esc(p.title[l.code])}</h3>
        <div class="ba__compare" style="--position: 50%;">
          ${img(p.after, p.alt_after[l.code], 'ba__after', 'dark')}
          <div class="ba__before">${img(p.before, p.alt_before[l.code], 'ba__before-img', 'light')}</div>
          <div class="ba__handle" role="slider" tabindex="0" aria-label="${t('handle')}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50">
            <span class="ba__pill" aria-hidden="true"><span></span><span></span><span></span></span>
          </div>
          <span class="ba__label ba__label--before" aria-hidden="true">${t('before')}</span>
          <span class="ba__label ba__label--after" aria-hidden="true">${t('after')}</span>
        </div>
      </figure>`;
  }).join('\n');
  const chevron = (points) => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="${points}"></polyline></svg>`;
  // One project needs no navigation, so the arrows render only for two or more.
  const nav = projects.length > 1 ? `
      <div class="ba__nav">
        <button class="ba__arrow" type="button" data-ba-prev aria-label="${t('prev')}">${chevron('15 6 9 12 15 18')}</button>
        <button class="ba__arrow" type="button" data-ba-next aria-label="${t('next')}">${chevron('9 6 15 12 9 18')}</button>
      </div>` : '';
  return `<section class="section section--light section--divided ba" id="inainte-dupa" aria-labelledby="ba-h" data-ba>
  <div class="container">
    <div class="ba__head">
      <div>
        <p class="eyebrow" data-reveal>${t('eyebrow')}</p>
        <h2 id="ba-h" data-reveal>${t('h2')}<span class="ba__h-line">${t('h2Line2')}</span></h2>
      </div>${nav}
    </div>
    <div class="ba__stage">
${items}
    </div>
  </div>
</section>
`;
}

// --- W14-10, the metal tile grid (S-04) --------------------------------------

/* Standart and Premium metal tile, one card per model, from
   content/tigla-metalica.json. Every value comes from the wave 14 audit 2.1 and
   the file says so; nothing is derived or rounded here except the decimal
   separator, which follows the locale.

   Ruling R-X: list prices only. No discount badge, no percentage, no struck
   price, and the scarcity gate would fail the build's output if one appeared.

   Colour chips carry the code, the finish and the colour's name as text, and
   since W14-22 a swatch: the tile grid exception to docs/CLAUDE.md section 3.
   Since W15-04 the swatch value is an approximation authored in this repo, not
   a figure taken from anyone's published colour table. A matt code's swatch is flat; a gloss
   code's carries a highlight. A line under the swatches says screen colour is
   indicative and the physical sample decides.

   Presence, not silence: a missing models array or legend fails the build, as
   does a grade other than standart or premium (Econom is excluded by the
   dispatch, and a third grade must not slip in by data), a colour code that is
   not in the legend, and a required field that is empty. */
const TIGLA_FILE = 'content/tigla-metalica.json';
const TIGLA = JSON.parse(fs.readFileSync(TIGLA_FILE, 'utf8'));
if (!Array.isArray(TIGLA.models) || !Array.isArray(TIGLA.legend)) die(`${TIGLA_FILE} needs both a "models" and a "legend" array.`);
const TIGLA_LEGEND = new Map(TIGLA.legend.map((c) => [c.code, c]));
/* W15-04. Every legend entry must carry its base code (the code without the matt
   M), a #RRGGBB value, and nothing presenting that value as a standards body's
   published colour data. The value is an approximation authored in this repo.
   A code and its matt twin must agree, because the finish is shown by the swatch
   surface and not by a different colour. A missing or malformed value fails the
   build; a swatch is never guessed.

   The source and ral fields are REFUSED rather than ignored. W14-22 sourced each
   value to a third-party colour page, which both claimed a provenance we did not
   have and pointed at data its owner says needs a licence. A field reintroducing
   either fails the build, so the claim cannot come back by data. No host is named
   here on purpose: the repo carries no such URL at all, in code or in comment. */
for (const [i, c] of TIGLA.legend.entries()) {
  const where = `${TIGLA_FILE}: legend[${i}] ${c.code}`;
  if (c.base !== String(c.code).replace(/M$/, '') || !/^\d{4}$/.test(c.base)) die(`${where} has base "${c.base}", expected its code without the M.`);
  if (!/^#[0-9A-F]{6}$/.test(c.hex || '')) die(`${where} has no #RRGGBB hex.`);
  if ('source' in c) die(`${where} carries a source field. W15-04 removed it: these values are ours, and a URL here would claim otherwise.`);
  if ('ral' in c) die(`${where} carries a ral field. W15-04 renamed it to base: the code is the manufacturer's, and the value is ours.`);
  const twin = TIGLA_LEGEND.get(String(c.code).endsWith('M') ? c.base : `${c.base}M`);
  if (twin && twin.hex !== c.hex) die(`${where} and ${twin.code} are one colour but carry ${c.hex} and ${twin.hex}.`);
}
const TIGLA_GRADES = ['standart', 'premium'];

/* W18-01 (RC-138). Original profile diagrams, one per tile model, drawn in this
   repo. Closes Q-W14-11b: the supplier renders are abandoned, so nothing is
   photographed, traced or copied, and no image file exists for them.

   Each is a transverse section through the sheet: the profile's repeating
   section drawn twice or three times, a break mark where the sheet continues,
   and under it the two widths as drawn dimensions. Schematic, not to scale: no
   wave pitch, wave height or wave count is claimed, only the shape family. The
   ONLY figures on a diagram are total and working width, read from the model's
   own data, which takes them from the wave 14 audit. A model the audit gives no
   widths (the modular tile, sold by the piece) shows its profile and no
   dimension at all.

   Drawn to W14-23's conventions, so the tile page and the carport page read as
   one hand: the 160 by 100 frame, one stroke weight of 2 held by vector-effect,
   round caps and joins, no fill on any line, and exactly one accent element, the
   profile itself, through the d-accent class. Everything else is currentColor.
   One departure the card requires: dimensions are text, so each diagram carries
   its two labels, and because they carry figures the diagram is an image with a
   label, not decoration.

   Presence, not silence: the build fails if a model has no diagram, if a diagram
   is defined and used by no model, if two models share a diagram, if two
   diagrams draw the same profile under different names, or if a model's widths
   are missing, partial, disagree between its grades, or put working above total. */
const TIGLA_X0 = 12, TIGLA_X1 = 148, TIGLA_BASE = 40;
const tiglaN = (v) => Number(v.toFixed(2));
/* One repeat, from the valley at (x, TIGLA_BASE) to the next valley p along.
   A cubic whose two control points sit 4/3 h above the base peaks at exactly h. */
const TIGLA_PROFILES = {
  // Monterrey: tall round arches over a short, narrow valley.
  rounded: { p: 22, h: 14, left: 2, right: 3,
    rep: (x, p, b, h) => `L${tiglaN(x + p * 0.14)} ${b}C${tiglaN(x + p * 0.17)} ${tiglaN(b - h * 4 / 3)} ${tiglaN(x + p * 0.97)} ${tiglaN(b - h * 4 / 3)} ${tiglaN(x + p)} ${b}` },
  // Valencia: a broad, shallow, even wave.
  broad: { p: 30, h: 8, left: 2, right: 2,
    rep: (x, p, b, h) => `C${tiglaN(x + p * 0.25)} ${b} ${tiglaN(x + p * 0.25)} ${b - h} ${tiglaN(x + p * 0.5)} ${b - h}C${tiglaN(x + p * 0.75)} ${b - h} ${tiglaN(x + p * 0.75)} ${b} ${tiglaN(x + p)} ${b}` },
  // Kascad: a wide flat top between short straight flanks and a narrow valley.
  flat: { p: 24, h: 10, left: 2, right: 3,
    rep: (x, p, b, h) => `L${tiglaN(x + p * 0.12)} ${b}L${tiglaN(x + p * 0.24)} ${b - h}L${tiglaN(x + p * 0.76)} ${b - h}L${tiglaN(x + p * 0.88)} ${b}L${tiglaN(x + p)} ${b}` },
  // The modular tile: a flat pan, then a rounded roll.
  roll: { p: 28, h: 12, left: 2, right: 2,
    rep: (x, p, b, h) => `L${tiglaN(x + p * 0.4)} ${b}C${tiglaN(x + p * 0.44)} ${tiglaN(b - h * 4 / 3)} ${tiglaN(x + p * 0.96)} ${tiglaN(b - h * 4 / 3)} ${tiglaN(x + p)} ${b}` },
};
const TIGLA_MODEL_DIAGRAM = { monterrey: 'rounded', valencia: 'broad', kascad: 'flat', modulara: 'roll' };
const tiglaLine = (x1, y1, x2, y2) => `<line x1="${tiglaN(x1)}" y1="${tiglaN(y1)}" x2="${tiglaN(x2)}" y2="${tiglaN(y2)}" vector-effect="non-scaling-stroke"/>`;
/* The profile as ONE path element with two subpaths, the left run and the right
   run, so the accent stays a single element across the break. */
function tiglaProfilePath(key) {
  const { p, h, left, right, rep } = TIGLA_PROFILES[key];
  const b = TIGLA_BASE;
  const run = (x0, n) => `M${x0} ${b}` + Array.from({ length: n }, (_, i) => rep(x0 + i * p, p, b, h)).join('');
  const xa = TIGLA_X0 + left * p, xb = TIGLA_X1 - right * p;
  if (xb - xa < 12) die(`tile diagram ${key}: ${left} + ${right} repeats of ${p} leave no room for the break.`);
  return { d: run(TIGLA_X0, left) + run(xb, right), xa, xb, h };
}
/* A drawn dimension: the line, a tick at each end, the label centred above. */
const tiglaDim = (x1, x2, y, label) => tiglaLine(x1, y, x2, y) + tiglaLine(x1, y - 4, x1, y + 4) + tiglaLine(x2, y - 4, x2, y + 4)
  + `<text x="${tiglaN((x1 + x2) / 2)}" y="${y - 5}" text-anchor="middle" fill="currentColor" stroke="none" font-size="9">${esc(label)}</text>`;
function tiglaDiagram(l, m, widths) {
  const t = (k) => l.strings[`tigla.${k}`];
  const key = TIGLA_MODEL_DIAGRAM[m.id];
  const { d, xa, xb, h } = tiglaProfilePath(key);
  const cx = (xa + xb) / 2, b = TIGLA_BASE;
  const brk = tiglaLine(cx - 5, b + 4, cx - 1, b - h - 4) + tiglaLine(cx + 1, b + 4, cx + 5, b - h - 4);
  let dims = '';
  let label = `${t('profile')}: ${m.name[l.code]}`;
  // W19-02 (RC-142). A description of the profile's form, as the carport diagrams carry.
  const desc = t(`diagrams.${key}.desc`);
  if (!REAL(desc)) die(`tile diagram "${key}" needs a real tigla.diagrams.${key}.desc in ${l.code}.`);
  if (widths) {
    const lc = (s) => s.charAt(0).toLocaleLowerCase(l.code) + s.slice(1);
    const total = Number(widths.total), working = Number(widths.working);
    // The overlap is drawn in proportion, from the left edge: the one place the
    // two audit figures meet the drawing.
    const xw = TIGLA_X0 + (TIGLA_X1 - TIGLA_X0) * (total - working) / total;
    dims = tiglaDim(xw, TIGLA_X1, 64, `${t('workingWidth')} ${widths.working} ${t('mm')}`)
      + tiglaDim(TIGLA_X0, TIGLA_X1, 88, `${t('totalWidth')} ${widths.total} ${t('mm')}`);
    label += `, ${lc(t('totalWidth'))} ${widths.total} ${t('mm')}, ${lc(t('workingWidth'))} ${widths.working} ${t('mm')}`;
  }
  return `
        <div class="tile-diagram" data-tile-diagram="${key}"><svg class="tile-diagram__svg" viewBox="0 0 160 100" width="160" height="100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="${esc(label)}" aria-describedby="tile-diagram-desc-${m.id}" focusable="false"><desc id="tile-diagram-desc-${m.id}">${esc(desc)}</desc><path class="d-accent" d="${d}" vector-effect="non-scaling-stroke"/>${brk}${dims}</svg></div>`;
}
(() => {
  const unmapped = TIGLA.models.filter((m) => !TIGLA_PROFILES[TIGLA_MODEL_DIAGRAM[m.id]]).map((m) => m.id);
  if (unmapped.length) die(`${TIGLA_FILE}: no profile diagram for ${unmapped.join(', ')}.`);
  const byKey = new Map();
  for (const m of TIGLA.models) {
    const k = TIGLA_MODEL_DIAGRAM[m.id];
    if (byKey.has(k)) die(`${TIGLA_FILE}: ${byKey.get(k)} and ${m.id} share the profile diagram "${k}". Every tile model draws its own profile.`);
    byKey.set(k, m.id);
  }
  const unused = Object.keys(TIGLA_PROFILES).filter((k) => !byKey.has(k));
  if (unused.length) die(`tile profile diagrams defined but used by no model: ${unused.join(', ')}.`);
  const byPath = new Map();
  for (const k of Object.keys(TIGLA_PROFILES)) {
    const { d } = tiglaProfilePath(k);
    if (byPath.has(d)) die(`tile profile diagrams "${byPath.get(d)}" and "${k}" draw the same profile. Every tile model draws its own profile.`);
    byPath.set(d, k);
  }
})();
/* A model's widths for its diagram: total from the model, working from its
   grades, which must all agree. Both or neither. */
function tiglaWidths(m, where) {
  const working = [...new Set(m.variants.map((v) => v.working_width_mm).filter(REAL))];
  const partial = m.variants.some((v) => REAL(v.working_width_mm)) && m.variants.some((v) => !REAL(v.working_width_mm));
  if (partial || working.length > 1) die(`${TIGLA_FILE}: ${where} grades disagree on working_width_mm (${m.variants.map((v) => v.working_width_mm || 'none').join(', ')}).`);
  const hasTotal = REAL(m.total_width_mm);
  if (!working.length && !hasTotal) return null;
  if (!working.length || !hasTotal) die(`${TIGLA_FILE}: ${where} has ${hasTotal ? 'total_width_mm but no working_width_mm' : 'working_width_mm but no total_width_mm'}. Its diagram draws both widths or neither.`);
  if (!/^\d+$/.test(m.total_width_mm) || !/^\d+$/.test(working[0]) || Number(working[0]) >= Number(m.total_width_mm)) {
    die(`${TIGLA_FILE}: ${where} widths must be whole millimetres with working below total (total ${m.total_width_mm}, working ${working[0]}).`);
  }
  return { total: m.total_width_mm, working: working[0] };
}

function tiglaGrid(l) {
  if (TIGLA.models.length === 0) return '';
  const t = (k) => l.strings[`tigla.${k}`];
  const dec = (v) => (l.code === 'ro' || l.code === 'ru') ? String(v).replace('.', ',') : String(v);
  const cards = TIGLA.models.map((m, i) => {
    const where = `models[${i}]`;
    if (!m.name || !REAL(m.name[l.code])) die(`${TIGLA_FILE}: ${where}.name is not real for ${l.code}.`);
    if (!Array.isArray(m.variants) || m.variants.length === 0) die(`${TIGLA_FILE}: ${where} has no variants.`);
    /* W25-26. The four `ACTM-` slots live HERE now, on the page that publishes
       these four models, and not on a catalogue card in the roofing section.

       This replaces a pre-W24-01 mechanism: the card rendered an image only if
       `public/img/tigla-<id>.jpg` happened to exist, with no ledger row, no
       provenance and no gate. Four files could have appeared there and nothing in
       this repo would have known where they came from. The placeholder component
       is the one call site for every image the site renders, and these four join
       it. */
    const media = `\n        <div class="tile__media">${placeholder(`ACTM-0${i + 1}`, { variant: 'light', className: 'tile__ph', locale: l.code, eager: i < 2 })}</div>`;
    const variants = m.variants.map((v, j) => {
      const w = `${where}.variants[${j}]`;
      if (!TIGLA_GRADES.includes(v.grade)) die(`${TIGLA_FILE}: ${w}.grade "${v.grade}" is not standart or premium.`);
      for (const f of ['thickness_mm', 'warranty_years', 'unit', 'list_price_lei']) {
        if (!REAL(v[f])) die(`${TIGLA_FILE}: ${w}.${f} is empty.`);
      }
      if (!['m2', 'piece'].includes(v.unit)) die(`${TIGLA_FILE}: ${w}.unit "${v.unit}" is not m2 or piece.`);
      if (v.unit === 'piece' && !REAL(v.piece_area_m2)) die(`${TIGLA_FILE}: ${w} is sold by the piece but has no piece_area_m2.`);
      if (!Array.isArray(v.colours) || v.colours.length === 0) die(`${TIGLA_FILE}: ${w} has no colours.`);
      const unknown = v.colours.filter((c) => !TIGLA_LEGEND.has(c));
      if (unknown.length) die(`${TIGLA_FILE}: ${w} lists colour codes not in the legend: ${unknown.join(', ')}.`);
      const chips = (matt) => v.colours.filter((c) => c.endsWith('M') === matt).map((c) => {
        const e = TIGLA_LEGEND.get(c);
        return `<li class="tile__colour"><span class="tile__swatch${matt ? ' tile__swatch--matt' : ''}" style="background-color: ${e.hex};" data-code="${e.base}" aria-hidden="true"></span><span class="tile__code">${esc(c)}</span> ${esc(e.name[l.code])}</li>`;
      }).join('');
      const group = (matt) => {
        const html = chips(matt);
        return html ? `
              <p class="tile__finish">${esc(t(matt ? 'matt' : 'gloss'))}</p>
              <ul class="tile__colours">${html}</ul>` : '';
      };
      const unit = v.unit === 'm2' ? t('perM2') : t('perPiece');
      const rows = [
        [t('thickness'), `${dec(v.thickness_mm)} ${t('mm')}`],
        REAL(v.working_width_mm) ? [t('workingWidth'), `${v.working_width_mm} ${t('mm')}`] : null,
        v.unit === 'piece' ? [t('pieceArea'), `${dec(v.piece_area_m2)} ${t('m2')}`] : null,
        // Romanian counts from 20 take "de": 10 ani, 20 de ani. yearsMany carries it.
        [t('warranty'), `${v.warranty_years} ${Number(v.warranty_years) >= 20 ? t('yearsMany') : t('years')}`],
      ].filter(Boolean).map(([k, val]) => `
              <div><dt>${esc(k)}</dt><dd>${esc(val)}</dd></div>`).join('');
      return `
          <div class="tile__variant tile__variant--${v.grade}">
            <h4 class="tile__grade">${esc(t(v.grade))}</h4>
            <p class="tile__price"><span class="tile__amount">${esc(v.list_price_lei)}</span> ${esc(unit)}</p>
            <dl class="tile__specs">${rows}
            </dl>
            <div class="tile__palette">
              <p class="tile__palette-h">${esc(t('colours'))}</p>${group(true)}${group(false)}
              <p class="tile__swatch-note">${esc(t('swatchNote'))}</p>
            </div>
          </div>`;
    }).join('');
    return `      <article class="tile" data-reveal data-stagger="${Math.min(i, 6)}">${tiglaDiagram(l, m, tiglaWidths(m, where))}
        <h3 class="tile__name">${esc(m.name[l.code])}</h3>${media}${variants}
      </article>`;
  }).join('\n');
  /* W25-09. This page shows the tile MODELS. The catalogue now also carries the
     roofing materials, including the tiles Dasterum supplies, and the dispatch
     asks for that page to be reachable from here. Same `.link-arrow`, same
     source of truth: content/catalog.json. */
  const toCatalog = catalogLinkArrow(l, 'materiale-acoperis');
  /* W27-FIX-08 (owner instruction W27-R-14): the seven imperlux.md metal tile models render
     HERE too, first, as the same product card the roofing page shows them on (picture, tagline,
     colour chips, facts, "De la N lei/buc"), read from content/roofing-sections.json; the four
     Dasterum models keep their tile cards below. One card per model name still holds: no name
     is in both lists (W25-26 settled that both sets differ). The grid is the catalogue grid, so
     the phone fold and gate 20 read it as one. */
  const imp = ROOF_SECTIONS.products.filter((p) => p.group === 'tigla-metalica');
  if (imp.length === 0) die(`${ROOF_SECTIONS_FILE}: no product in the tigla-metalica group, so the metal tile page would render no imperlux model.`);
  const dup = imp.map((p) => p.name[l.code]).filter((n) => TIGLA.models.some((m) => m.name[l.code] === n));
  if (dup.length) die(`${TIGLA_FILE} and ${ROOF_SECTIONS_FILE} both carry ${dup.join(', ')}: one card per model name (W25-R21).`);
  const impCards = imp.map((p, i) => prodCard(l, imperluxCardRecord(l, p, i), i)).join('\n');
  return `<section class="section section--light section--divided" id="tigla-metalica" aria-labelledby="tigla-h">
  <div class="container">
    <p class="eyebrow" data-reveal>${esc(t('eyebrow'))}</p>
    <h2 id="tigla-h" data-reveal>${esc(t('h2'))}</h2>
    <div class="prod-grid" id="tigla-imperlux" data-prod-grid data-prod-step="${PROD_STEP}">
${impCards}
    </div>
    <div class="tiles">
${cards}
    </div>${toCatalog}
  </div>
</section>
`;
}

// --- W14-11, carports (S-06) -------------------------------------------------

/* Three sections from content/copertine.json and the copertine.* strings,
   structure from the wave 14 audit 4.2: a chooser of five structural families,
   the twelve models on the dark band, and the four-step process from
   measurement to installation. No prices: a carport is quoted after a site
   measurement, which is also what the steps say.

   No photographs (W14-23): every family tile and every model card shows an
   original line diagram of its structure, defined below.

   Presence, not silence: missing arrays fail the build, and so does a model in
   no family or in two, a family naming a model that does not exist, a duplicate
   designation, any field not real in both locales, and any competitor model code
   surviving anywhere in the data. */
const COP_FILE = 'content/copertine.json';
const COP = JSON.parse(fs.readFileSync(COP_FILE, 'utf8'));
if (!Array.isArray(COP.families) || !Array.isArray(COP.models)) die(`${COP_FILE} needs "families" and "models" arrays.`);
if (/\bIL\s?\d{3}\b/i.test(JSON.stringify({ families: COP.families, models: COP.models }))) {
  die(`${COP_FILE} still carries a competitor model code (IL followed by three digits). Models use Rapid Construct designations.`);
}
(() => {
  const ids = new Set(COP.models.map((m) => m.id));
  const seen = new Map();
  const designations = new Set();
  for (const m of COP.models) {
    if (designations.has(m.designation)) die(`${COP_FILE}: designation ${m.designation} is used twice.`);
    designations.add(m.designation);
  }
  for (const f of COP.families) {
    for (const id of f.models) {
      if (!ids.has(id)) die(`${COP_FILE}: family ${f.id} names model ${id}, which does not exist.`);
      if (seen.has(id)) die(`${COP_FILE}: model ${id} is in both ${seen.get(id)} and ${f.id}.`);
      seen.set(id, f.id);
    }
  }
  const orphans = COP.models.filter((m) => !seen.has(m.id)).map((m) => m.id);
  if (orphans.length) die(`${COP_FILE}: models in no family: ${orphans.join(', ')}.`);
})();

/* W14-23. Original line diagrams, one per structural family, drawn in this repo.
   Shared frame 160x100 with the ground at y 88; one stroke weight (2, held by
   vector-effect at any size); no fill; no text. The roof line carries the brand
   accent through the d-accent class; every other line is currentColor, so a
   diagram reads on the light chooser and the dark model band alike.

   W19-02 (RC-142). No longer decorative. Each diagram is an image with an
   accessible name and a description of the structural form it draws, both from
   the locale files (copertine.diagrams.<key>.name and .desc), the same standard
   as the tile profiles. The drawing itself is unchanged: COP_DIAGRAMS holds only
   the geometry, and copDiagram wraps it per locale. No label is drawn, because
   no carport has a measured dimension to draw; a label added later takes the
   tile treatment, which scripts/check-svg-a11y.js enforces. */
const copLine = (x1, y1, x2, y2, accent) => `<line${accent ? ' class="d-accent"' : ''} x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" vector-effect="non-scaling-stroke"/>`;
const copSvg = (body) => `${body}${copLine(8, 88, 152, 88)}`;
const COP_DIAGRAMS = {
  // A flat roof on a post at each end.
  posts: copSvg(copLine(18, 34, 142, 34, true) + copLine(30, 34, 30, 88) + copLine(130, 34, 130, 88)),
  // Posts on one side only; the roof runs out past them, held by a brace.
  cantilever: copSvg(copLine(26, 34, 146, 34, true) + copLine(40, 34, 40, 88) + copLine(40, 56, 78, 34)),
  // A wall carries the roof, with a brace and no posts.
  wall: copSvg(copLine(20, 12, 20, 88) + copLine(20, 34, 146, 40, true) + copLine(20, 62, 72, 37)),
  // Two posts under a roof pitched both ways.
  gable: copSvg('<polyline class="d-accent" points="16,50 80,22 144,50" vector-effect="non-scaling-stroke"/>' + copLine(30, 44, 30, 88) + copLine(130, 44, 130, 88)),
  // Two posts under a curved roof.
  arched: copSvg('<path class="d-accent" d="M16 50 Q80 2 144 50" vector-effect="non-scaling-stroke"/>' + copLine(30, 44, 30, 88) + copLine(130, 44, 130, 88)),
  // Raked posts, each foot outside its head, under a roof that runs past both.
  inclined: copSvg(copLine(12, 34, 148, 34, true) + copLine(40, 34, 28, 88) + copLine(120, 34, 132, 88)),
  // A deep roof slab on two off-centre posts: 42px of overhang left, 22 right.
  architectural: copSvg('<polyline class="d-accent" points="10,36 10,26 150,26 150,36" vector-effect="non-scaling-stroke"/>' + copLine(52, 36, 52, 88) + copLine(128, 36, 128, 88)),
};
/* Which diagram each card shows. A model takes its structural category from the
   wave 14 audit 2.3, matched model for model to C-01 to C-12: C-04 drains both
   sides, so it is the gable.

   W15-03 draws the two structures that had no drawing of their own. Until it,
   C-10, C-11, C-12 and the Arhitecturală family all showed the posts drawing,
   which was recorded as a deviation at W14-23 rather than left implicit. C-10
   is "Stâlpi înclinați" and now shows inclined; C-11 and C-12 are
   "Arhitecturală" and now show architectural, as does that family's tile.

   A model takes its own category, which is not always its family's structure:
   C-10 sits in the stalpi family because that is how the range is sold, so the
   family tile still shows posts while C-10's own card shows inclined. Each card
   is labelled by its own heading, so each agrees with what it says.

   Every family and model must be mapped and every diagram used, or the build
   fails. The posts drawing is still used, by C-01, C-05, C-08 and the family
   tile. */
const COP_MODEL_DIAGRAM = { c01: 'posts', c02: 'cantilever', c03: 'wall', c04: 'gable', c05: 'posts', c06: 'arched', c07: 'arched', c08: 'posts', c09: 'cantilever', c10: 'inclined', c11: 'architectural', c12: 'architectural' };
const COP_FAMILY_DIAGRAM = { stalpi: 'posts', consola: 'cantilever', perete: 'wall', arcuita: 'arched', arhitecturala: 'architectural' };
(() => {
  const unmapped = [...COP.models.filter((m) => !COP_DIAGRAMS[COP_MODEL_DIAGRAM[m.id]]).map((m) => m.id), ...COP.families.filter((f) => !COP_DIAGRAMS[COP_FAMILY_DIAGRAM[f.id]]).map((f) => f.id)];
  if (unmapped.length) die(`${COP_FILE}: no diagram for ${unmapped.join(', ')}.`);
  const used = new Set([...Object.values(COP_MODEL_DIAGRAM), ...Object.values(COP_FAMILY_DIAGRAM)]);
  const unused = Object.keys(COP_DIAGRAMS).filter((k) => !used.has(k));
  if (unused.length) die(`carport diagrams defined but used by no card: ${unused.join(', ')}.`);
})();
/* uid makes the description's id unique on the page: a family id or a model id,
   which never collide (stalpi, consola ... against c01 ... c12). */
const copDiagram = (l, key, uid) => {
  const name = l.strings[`copertine.diagrams.${key}.name`];
  const desc = l.strings[`copertine.diagrams.${key}.desc`];
  if (!REAL(name) || !REAL(desc)) die(`carport diagram "${key}" needs a real copertine.diagrams.${key}.name and .desc in ${l.code}.`);
  const id = `cop-diagram-desc-${uid}`;
  return `<div class="cop-diagram" data-diagram="${key}"><svg class="cop-diagram__svg" viewBox="0 0 160 100" width="160" height="100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="${esc(name)}" aria-describedby="${id}" focusable="false"><desc id="${id}">${esc(desc)}</desc>${COP_DIAGRAMS[key]}</svg></div>`;
};

function copertine(l) {
  if (COP.models.length === 0) return '';
  const t = (k) => esc(l.strings[`copertine.${k}`]);
  const txt = (o, where) => {
    if (!o || !REAL(o[l.code])) die(`${COP_FILE}: ${where} is not real for ${l.code}.`);
    return esc(o[l.code]);
  };
  const byId = new Map(COP.models.map((m) => [m.id, m]));

  const tiles = COP.families.map((f, i) => {
    const w = `families[${i}]`;
    const media = copDiagram(l, COP_FAMILY_DIAGRAM[f.id], f.id);
    const chips = f.models.map((id) => `<li class="model-chip">${esc(byId.get(id).designation)}</li>`).join('');
    return `      <article class="bento__tile${i === 0 ? ' bento__tile--wide' : ''}" data-reveal data-stagger="${Math.min(i, 6)}">
        ${media}<h3 class="bento__title">${txt(f.title, `${w}.title`)}</h3>
        <p class="bento__text">${txt(f.text, `${w}.text`)}</p>
        <ul class="bento__chips">${chips}</ul>
      </article>`;
  }).join('\n');

  const models = COP.models.map((m, i) => {
    const w = `models[${i}]`;
    const media = copDiagram(l, COP_MODEL_DIAGRAM[m.id], m.id);
    return `      <article class="model" data-reveal data-stagger="${Math.min(i, 6)}">
        ${media}<p class="model__cat">${txt(m.category, `${w}.category`)}</p>
        <h3 class="model__name">${esc(m.designation)}</h3>
        <p class="model__desc">${txt(m.descriptor, `${w}.descriptor`)}</p>
      </article>`;
  }).join('\n');

  const steps = [0, 1, 2, 3].map((i) => `      <li class="csteps__step" data-reveal data-stagger="${i}">
        <span class="csteps__n" aria-hidden="true">${i + 1}</span>
        <h3 class="csteps__title">${t(`steps.${i}.title`)}</h3>
        <p class="csteps__text">${t(`steps.${i}.text`)}</p>
      </li>`).join('\n');

  return `<section class="section section--light section--divided" id="copertine" aria-labelledby="copertine-h">
  <div class="container">
    <p class="eyebrow" data-reveal>${t('eyebrow')}</p>
    <h2 id="copertine-h" data-reveal>${t('chooserH2')}</h2>
    <p class="lede" data-reveal>${t('chooserLede')}</p>
    <div class="bento">
${tiles}
    </div>
  </div>
</section>
<section class="section section--dark" id="copertine-modele" aria-labelledby="copertine-modele-h">
  <div class="container">
    <p class="eyebrow" data-reveal>${t('eyebrow')}</p>
    <h2 id="copertine-modele-h" data-reveal>${t('modelsH2')}</h2>
    <p class="lede cop-lede--dark" data-reveal>${t('modelsLede')}</p>
    <div class="models">
${models}
    </div>
  </div>
</section>
<section class="section section--light" id="copertine-pasi" aria-labelledby="copertine-pasi-h">
  <div class="container">
    <p class="eyebrow" data-reveal>${t('eyebrow')}</p>
    <h2 id="copertine-pasi-h" data-reveal>${t('stepsH2')}</h2>
    <ol class="csteps">
${steps}
    </ol>
  </div>
</section>
${gallerySectionAlone(l, 'copertine', galNeed(l.strings['pages.copertine.title'], 'pages.copertine.title'))}
`;
}

// --- W14-20, the fences page (S-05) ----------------------------------------

/* The fences page on the carport pattern (audit 4.2): a chooser by site
   constraint, the materials and finish on the dark band, four steps that end in a
   fixed price after measurement, and a FAQ, then the product page's quote form.
   Every string is a garduri.* locale key. RC-112's empty data file and model
   component are gone: there are no models to list.

   RC-120 forbids model codes, prices, thicknesses, warranty years and any
   supplier or manufacturer name on this page. The build refuses a garduri string
   carrying any form it can recognise: IL and two or three digits, lei/m², a
   thickness in mm, a warranty stated in years, in either locale. A name cannot be
   pattern-matched; W14-20 lists every string for review. */
const GARD_COUNTS = { chooser: 5, materials: 3, steps: 4, faq: 5 };
const GARD_FORBIDDEN = [/\bIL\s?\d{2,3}\b/i, /lei\s*\/\s*m²/i, /\bani\s+(de\s+)?garanți/i, /\d\s*mm\b/i, /лет\s+гарант/i, /лей\s*\/\s*м²/i, /гаранти\S*\s+\d/i];
function gardList(l, group, fields) {
  for (const [k, v] of Object.entries(l.strings)) {
    if (!k.startsWith('garduri.')) continue;
    for (const re of GARD_FORBIDDEN) if (re.test(v)) die(`${k} (${l.code}) carries a form RC-120 forbids on the fences page: ${re}`);
  }
  return Array.from({ length: GARD_COUNTS[group] }, (_, i) => Object.fromEntries(fields.map((f) => {
    const v = l.strings[`garduri.${group}.${i}.${f}`];
    if (!REAL(v)) die(`garduri.${group}.${i}.${f} is not real in ${l.code}.`);
    return [f, v];
  })));
}

function gardPage(l) {
  const t = (k) => esc(l.strings[`garduri.${k}`]);
  const tiles = gardList(l, 'chooser', ['title', 'text']).map((c, i) => `      <article class="bento__tile${i === 0 ? ' bento__tile--wide' : ''}" data-reveal data-stagger="${Math.min(i, 6)}">
        <h3 class="bento__title">${esc(c.title)}</h3>
        <p class="bento__text">${esc(c.text)}</p>
      </article>`).join('\n');
  const materials = gardList(l, 'materials', ['title', 'text']).map((m, i) => `      <article class="model" data-reveal data-stagger="${Math.min(i, 6)}">
        <h3 class="model__name">${esc(m.title)}</h3>
        <p class="model__desc">${esc(m.text)}</p>
      </article>`).join('\n');
  const steps = gardList(l, 'steps', ['title', 'text']).map((s, i) => `      <li class="csteps__step" data-reveal data-stagger="${i}">
        <span class="csteps__n" aria-hidden="true">${i + 1}</span>
        <h3 class="csteps__title">${esc(s.title)}</h3>
        <p class="csteps__text">${esc(s.text)}</p>
      </li>`).join('\n');
  const faq = gardList(l, 'faq', ['q', 'a']).map((f, i) => `      <div class="faq__item" data-reveal data-stagger="${Math.min(i, 6)}">
        <h3 class="faq__q">${esc(f.q)}</h3>
        <p class="faq__a">${esc(f.a)}</p>
      </div>`).join('\n');
  return `<section class="section section--light section--divided" id="garduri" aria-labelledby="garduri-h">
  <div class="container">
    <p class="eyebrow" data-reveal>${t('eyebrow')}</p>
    <h2 id="garduri-h" data-reveal>${t('chooserH2')}</h2>
    <p class="lede" data-reveal>${t('chooserLede')}</p>
    <div class="bento">
${tiles}
    </div>
  </div>
</section>
<section class="section section--dark" id="garduri-materiale" aria-labelledby="garduri-materiale-h">
  <div class="container">
    <p class="eyebrow" data-reveal>${t('eyebrow')}</p>
    <h2 id="garduri-materiale-h" data-reveal>${t('materialsH2')}</h2>
    <p class="lede cop-lede--dark" data-reveal>${t('materialsLede')}</p>
    <div class="models">
${materials}
    </div>
  </div>
</section>
<section class="section section--light" id="garduri-pasi" aria-labelledby="garduri-pasi-h">
  <div class="container">
    <p class="eyebrow" data-reveal>${t('eyebrow')}</p>
    <h2 id="garduri-pasi-h" data-reveal>${t('stepsH2')}</h2>
    <ol class="csteps">
${steps}
    </ol>
  </div>
</section>
<section class="section section--light section--divided section--compact" id="intrebari" aria-labelledby="garduri-faq-h">
  <div class="container">
    <h2 id="garduri-faq-h" data-reveal>${esc(l.strings['servicePage.faqH'])}</h2>
    <div class="faq" data-reveal>
${faq}
    </div>
  </div>
</section>
`;
}

// FAQPage for the fences page, mirroring its visible FAQ exactly.
function gardFaqSchema(l) {
  return '\n<script type="application/ld+json">\n' + JSON.stringify({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: gardList(l, 'faq', ['q', 'a']).map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }, null, 2) + '\n</script>';
}

// --- W14-16, the product pages and the homepage teaser ------------------------

/* Owner ruling on wave 14 deviation 4: the metal tile grid, the carports and the
   fences leave the homepage for pages of their own, under the services root, in
   both locales. Each page is src/product.html: breadcrumb, H1, one line, the
   block, the quote form. The block renderers are the same functions the homepage
   used; nothing about the blocks changes except where they render.

   The homepage keeps the offer cards and the before/after slot, plus a compact
   row of three links to these pages. All six URLs go in the sitemap, which the
   owner's card asks for; the fences page is listed while its block is still
   empty (Q-W14-09), because the card says all three. */
/* W16-02, RC-129. One page per top-level catalog category.

   `i` indexes content/catalog.json, which is the single source of both labels
   and subcategories in both locales, so nothing is restated here. `service` is
   the service whose shipped description says what Rapid Construct does with the
   material; it is the association the catalog menu already encoded before
   RC-130 repointed the rows, and it is the only prose on the page that is not a
   label. Nothing here is invented: every string on a category page comes from
   content/catalog.json or from an existing services.items entry. */
const PARENT_CATEGORIES = [
  { slug: 'termoizolatie',        i: 0, service: 'fatade' },
  { slug: 'tencuieli-decorative', i: 1, service: 'fatade' },
  { slug: 'placi-ceramice',       i: 2, service: 'finisaje' },
  { slug: 'elemente-decorative',  i: 3, service: 'fatade' },
  { slug: 'vopsele',              i: 4, service: 'finisaje' },
  { slug: 'sisteme-iluminare',    i: 5, service: 'instalatii' },
  { slug: 'alte-materiale',       i: 6, service: 'case-la-cheie' },
  /* W25-09. The eighth category, and the first whose records come from a direct
     supplier rather than the reference site: Dasterum's seven roofing groups,
     71 products, under W25-R7. Its service is `acoperisuri`, which is the page
     that already says what Rapid Construct does with them.
     ITS SLUG IS NOT `acoperisuri`: that is taken by the service page, and a
     category slug that collided with a service or product slug would write one
     page over another silently, which build.js refuses. The LABEL is
     "Acoperișuri"; only the URL segment differs. */
  { slug: 'materiale-acoperis',   i: 7, service: 'acoperisuri' },
];

/* W24-04, finding F-03. Every subcategory gets a real page of its own, under its
   parent, so a menu row stops landing on the parent page's top. The slug is
   parent/child, which is the URL, and the label, the RU label and the order all
   come from content/catalog.json's children: nothing about a subcategory is
   restated here except which parent page it sits under, which is the file's own
   nesting read back.

   A subcategory page carries the breadcrumb, the H1 and the grid, and no authored
   prose. W17-02 authorised authored material description on a CATEGORY page and
   the dispatch specifies the subcategory page as breadcrumb, heading and grid; a
   subcategory that repeated its parent's three paragraphs would also break the
   gate's own no-duplicate-prose rule. scripts/check-catalog-pages.js holds each
   kind to what it must carry: a parent to its lede and two paragraphs, a
   subcategory to a product grid. */
const SUB_CATEGORIES = PARENT_CATEGORIES.flatMap((p) => {
  const kids = CATALOG.categories[p.i].children || [];
  return kids.map((k, ki) => {
    const href = k.href && k.href.ro;
    if (!REAL(href)) die(`${CATALOG_FILE}: categories[${p.i}].children[${ki}] has no RO href.`);
    const m = href.match(/^\/catalog\/([^/]+)\/([^/]+)\/$/);
    if (!m) die(`${CATALOG_FILE}: categories[${p.i}].children[${ki}] href "${href}" is not /catalog/<parent>/<child>/.`);
    if (m[1] !== p.slug) die(`${CATALOG_FILE}: "${k.label.ro}" opens ${href}, which is not under its parent ${p.slug}.`);
    return { slug: `${p.slug}/${m[2]}`, i: p.i, ki, parent: p.slug, service: p.service };
  });
});

const CATEGORIES = [...PARENT_CATEGORIES, ...SUB_CATEGORIES];
const CATEGORY_ROUTES = new Set(CATEGORIES.map((c) => c.slug));

(() => {
  if (PARENT_CATEGORIES.length !== CATALOG.categories.length) {
    die(`PARENT_CATEGORIES has ${PARENT_CATEGORIES.length} entries but ${CATALOG_FILE} has ${CATALOG.categories.length} top-level categories.`);
  }
  const kids = CATALOG.categories.reduce((n, c) => n + (c.children || []).length, 0);
  if (SUB_CATEGORIES.length !== kids) die(`SUB_CATEGORIES has ${SUB_CATEGORIES.length} entries but ${CATALOG_FILE} has ${kids} subcategories.`);
  if (CATEGORIES.length === 0) die(`no catalogue pages would be built from ${CATALOG_FILE}.`);
  const bad = CATEGORIES.filter((c) => !SERVICE_SLUGS.includes(c.service));
  if (bad.length) die(`category page maps to an unknown service: ${bad.map((c) => c.slug + ' -> ' + c.service).join(', ')}`);
  const dupes = CATEGORIES.map((c) => c.slug).filter((s, i, a) => a.indexOf(s) !== i);
  if (dupes.length) die(`duplicate category slug: ${dupes.join(', ')}`);
})();

/* W16-03, RC-130. Every catalog menu row opens its own category page, and a
   subcategory row opens its parent's. Zero rows resolve to a service page.

   This is the acceptance of the card that overturned the RC-106b mapping, and it
   is asserted here rather than inspected: a row repointed at a service page by a
   later data edit fails the build. It runs after CATEGORIES is validated, so the
   set of legal destinations is already known to be sound. */
(() => {
  /* The legal set is computed from the pages this build actually emits, so a row
     can never point at a page that does not exist, and the assertion cannot go
     stale when a category is added.
     AMENDED (W24-04): a subcategory row used to be required to open its PARENT's
     page, which is finding F-03 written into a gate. It now opens its own page,
     and what is asserted is that its page sits under its parent's.
     ~~and what is asserted is that its page sits under its parent's.~~
     AMENDED (W24-09 ratification): **the parent-href rule is REMOVED.** It
     required a child row's href to begin with its parent row's href, which makes
     the URL path carry the menu's shape: a subcategory could not be moved or
     re-parented in the menu without also moving its page, and a category reached
     from two parents could not exist at all. The owner's ratification removes it.
     What survives is the assertion that MATTERS and was never the same thing:
     every row, at every depth, opens a category page this build actually emits.
     That is the `legal` set below, and it is untouched. */
  const legal = new Set();
  for (const c of CATEGORIES) {
    legal.add(`${CATALOG_ROOT.ro}${c.slug}/`);
    legal.add(`${CATALOG_ROOT.ru}${c.slug}/`);
  }
  if (legal.size !== CATEGORIES.length * 2) die(`the catalogue menu's legal destination set is ${legal.size} for ${CATEGORIES.length} pages in two locales.`);
  const bad = [];
  const walk = (list) => {
    list.forEach((row) => {
      for (const code of ['ro', 'ru']) {
        const href = row.href && row.href[code];
        if (!legal.has(href)) bad.push(`${row.label && row.label.ro} [${code}] -> ${href}`);
      }
      if (row.children) walk(row.children);
    });
  };
  walk(CATALOG.categories);
  if (bad.length) die(`${CATALOG_FILE}: ${bad.length} menu row(s) do not open a category page this build emits:\n  ${bad.join('\n  ')}`);
})();

/* W17-02, RC-133. The authored copy for one category page: a lede for the hero
   and two paragraphs for the block, from locales catalogPages.items.N, where N
   is the category's position in content/catalog.json. General trade knowledge
   only, under the permitted and forbidden lists recorded in DECISIONS.md W17-02.
   A page without all three, real, in its own locale, does not build. */
/* W24-04. A page's own label: a parent's is the category's, a subcategory's is
   its own row's in content/catalog.json. One place, so a heading, a breadcrumb,
   a meta title and a form subject cannot disagree. */
function categoryLabel(l, c) {
  const entry = CATALOG.categories[c.i];
  if (c.parent == null) return catalogField(entry, 'label', l, `${CATALOG_FILE}: categories[${c.i}]`);
  const kid = (entry.children || [])[c.ki];
  if (!kid) die(`${CATALOG_FILE}: categories[${c.i}] has no children[${c.ki}], needed by ${c.slug}.`);
  return catalogField(kid, 'label', l, `${CATALOG_FILE}: categories[${c.i}].children[${c.ki}]`);
}

/* W17-02's authored paragraphs belong to a CATEGORY. A subcategory page carries
   the breadcrumb, the heading and the grid, and no prose: see SUB_CATEGORIES. */
function categoryProse(l, c) {
  if (c.parent != null) die(`categoryProse called for the subcategory ${c.slug}; a subcategory carries no authored prose.`);
  const k = `catalogPages.items.${c.i}`;
  const prose = { lede: l.strings[`${k}.lede`], p1: l.strings[`${k}.p1`], p2: l.strings[`${k}.p2`] };
  const missing = Object.keys(prose).filter((f) => !REAL(prose[f]));
  if (missing.length) die(`${k}.{${missing.join(', ')}} must be real in ${l.code}, needed by category ${c.slug}.`);
  return prose;
}

/* The category page body. The two authored paragraphs open it (W17-02). Labels
   and subcategory names come from catalog.json; the sentence about the work is
   the related service's own shipped description, followed by a link to that
   service page labelled with the service's own title.

   There are no section headings, deliberately: no sourced heading exists for
   any block. Each prose paragraph carries data-cat-prose so that
   scripts/check-catalog-pages.js can find it on the built page. */
function categoryBlock(l, c) {
  const entry = CATALOG.categories[c.i];
  const where = `${CATALOG_FILE}: categories[${c.i}]`;
  const kids = Array.isArray(entry.children) ? entry.children : [];
  const si = SERVICE_SLUGS.indexOf(c.service);
  const svcTitle = l.strings[`services.items.${si}.title`];
  const svcDesc = l.strings[`services.items.${si}.desc`];
  if (!REAL(svcTitle) || !REAL(svcDesc)) die(`services.items.${si} is not real for ${l.code}, needed by category ${c.slug}.`);
  const prose = categoryProse(l, c);

  /* W24-04. The subcategories were listed as plain text, because until this card
     they had no page of their own to open. They do now, and a visitor on the
     parent page had no way to reach one except the header menu. */
  const subs = kids.length ? `
    <ul class="cat-subs">
${kids.map((k, j) => {
    const w = `${where}.children[${j}]`;
    return `      <li><a href="${catalogHref(k, l, w)}">${esc(catalogField(k, 'label', l, w))}</a></li>`;
  }).join('\n')}
    </ul>` : '';

  return `<section class="section section--light section--divided">
  <div class="container">
    <p class="lede" data-cat-prose="p1" data-reveal style="margin-top: 0;">${esc(prose.p1)}</p>
    <p class="lede" data-cat-prose="p2" data-reveal>${esc(prose.p2)}</p>${subs}
    <p class="lede" data-reveal style="margin-top: 32px;">${esc(svcDesc)}</p>
    <a class="link-arrow" href="${BASE}${SERVICES_ROOT[l.code]}${c.service}/" data-reveal>${esc(svcTitle)}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>
  </div>
</section>`;
}

/* Meta for a category page. The title ladder is the one every other page type
   uses. The description is the page's own lede (W17-02), which Q-W16-01 named
   as what the meta description most wanted. It is not prefixed with the title:
   several ledes open on the category's own word. The W16-02 composition of the
   category label and the related service's description stays as the fallback
   rungs. coverageLine is not used here: "Inclusiv:" plus twenty localities is far
   over DESC_MAX on its own. */
function categoryHeadVars(l, c) {
  const title = categoryLabel(l, c);
  const inCity = l.code === 'ro' ? ` în ${PRIMARY_CITY.ro}` : ` в ${PRIMARY_CITY.ru}`;
  const metaTitle = [title + inCity + BRAND, title + BRAND, title].find((s) => s.length <= TITLE_MAX) || title;
  const si = SERVICE_SLUGS.indexOf(c.service);
  const desc = l.strings[`services.items.${si}.desc`];
  /* A subcategory has no lede of its own, so its description falls to the next
     rung of the same ladder: its own label and the related service's shipped
     description. Nothing is invented for it. */
  const lede = c.parent == null ? categoryProse(l, c).lede : null;
  const metaDesc = [lede, `${title}. ${desc}`, desc, title].filter(Boolean).find((s) => s.length <= DESC_MAX) || title;
  if (/\bundefined\b/.test(metaDesc)) die(`meta description for category ${c.slug} (${l.code}) contains "undefined"`);
  return { title, metaTitle, metaDesc };
}

/* ~~RC-149. Product records per category slug, structure only.~~
   AMENDED (W24-03): the records are real and there are 223 of them, copied from
   fatade3d.md under ruling W24-R1, which reverses the wave 21 drop for text data
   only. The file's own _note carries the shape; docs/CATALOG-SOURCE-W24.md carries
   the method, the counts and every field that could not be read.

   ONE BAD RECORD FAILS THAT RECORD, NOT THE BUILD. That is the dispatch's own
   words, and it is the change from RC-149, where `need()` called die() on the
   first record missing a field and took 222 good ones with it. A record that does
   not validate is skipped, named, with the field that failed it, and the count of
   skipped records is printed every run. The build still fails on the things that
   are not one record's problem: a missing or unparseable file, a missing
   `products` array or `categories` map, a category slug with no catalogue
   category, a duplicate id, and an id a category names that no record has.

   The manufacturer names the catalog gate refuses are restated here so the build
   refuses a record before the gate has to: change one and the other must change
   with it, the same arrangement check-lighthouse.js has with the floors. W24-R1
   authorises copying product names, variant lines, prices and the category
   structure. It does not touch W17-02, so a refused name never renders, and a
   record whose rendered fields still carry one is skipped here rather than left
   for the gate to find in dist/. */
const CATALOG_FORBIDDEN_MANUFACTURERS = ['dasterum', 'imperlux', 'fațade 3d', 'fatade 3d', 'fatade3d'];
const CATALOG_FORBIDDEN_RE = /(dasterum(?:\.md)?|imperlux(?:\.md)?|fa[țţt]ade\s*3\s*d|fatade\s*3\s*d|fatade3d(?:\.md)?|дастерум|имперлюкс|фасады\s*3[dд]|фатаде\s*3[dд])/i;

const CATALOG_DATA = (() => {
  const f = 'content/catalog-products.json';
  if (!fs.existsSync(f)) die(`${f} is missing.`);
  let raw;
  try { raw = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { die(`${f} did not parse: ${e.message}`); }
  if (!raw.categories || typeof raw.categories !== 'object') die(`${f} has no categories object.`);
  if (!Array.isArray(raw.products)) die(`${f} has no products array. An empty catalogue is [], never a missing key.`);

  const byId = new Map();
  const skipped = [];
  const skip = (id, why) => skipped.push(`${id}: ${why}`);

  for (const [i, r] of raw.products.entries()) {
    const where = r && r.id ? r.id : `products[${i}]`;
    if (!r || typeof r !== 'object') { skip(where, 'is not an object'); continue; }
    if (!REAL(r.id)) { skip(where, 'has no id'); continue; }
    if (byId.has(r.id)) { skip(where, 'has an id another record already used'); continue; }
    if (!REAL(r.slot)) { skip(where, 'has no slot id, so its placeholder cannot be ledgered'); continue; }
    let bad = null;
    for (const lc of ['ro', 'ru']) {
      if (!REAL(r.name && r.name[lc])) { bad = `has no real name for ${lc}`; break; }
      if (CATALOG_FORBIDDEN_RE.test(r.name[lc])) { bad = `names a manufacturer W17-02 refuses on a catalogue page, in its ${lc} name`; break; }
    }
    if (!bad && r.brand != null && (!REAL(r.brand) || CATALOG_FORBIDDEN_RE.test(r.brand))) bad = 'has a brand that is empty or that W17-02 refuses on a catalogue page';
    if (!bad && !Array.isArray(r.categories)) bad = 'has no categories array';
    if (!bad && !r.price) bad = 'has no price object';
    if (!bad && r.price.render != null) {
      for (const lc of ['ro', 'ru']) {
        if (!REAL(r.price.render[lc])) { bad = `has no real price.render for ${lc}; a price that does not exist is null for the whole record, never "" for one locale`; break; }
      }
    }
    if (bad) { skip(where, bad); continue; }
    byId.set(r.id, r);
  }

  const missing = [];
  const index = {};
  for (const [slug, ids] of Object.entries(raw.categories)) {
    if (!Array.isArray(ids)) die(`${f}: categories.${slug} is not an array of ids.`);
    index[slug] = ids.filter((id) => {
      if (byId.has(id)) return true;
      if (!raw.products.some((p) => p && p.id === id)) missing.push(`${slug} names ${id}, which no record has`);
      return false;
    });
  }
  if (missing.length) die(`${f}: ${missing.length} category entry/entries name a record that does not exist:\n  ${missing.join('\n  ')}`);

  console.log(`catalog records: ${byId.size} of ${raw.products.length} read from ${f}` + (skipped.length ? `, ${skipped.length} skipped` : ''));
  for (const s of skipped) console.log(`  SKIPPED ${s}`);
  if (raw.products.length && byId.size === 0) die(`${f} holds ${raw.products.length} records and not one of them validated.`);

  return { byId, index };
})();
/* Kept as the name every call site already uses: a category slug to its records. */
const CATALOG_PRODUCTS = Object.fromEntries(
  Object.entries(CATALOG_DATA.index).map(([slug, ids]) => [slug, ids.map((id) => CATALOG_DATA.byId.get(id))]));

/* W24-04. Deferred to here on purpose: CATEGORIES is declared above and the
   records are loaded here, so this is the first point at which the two can be
   held to each other. Every category slug the records name must be a page this
   build emits, and every page must have an entry: a record list with nowhere to
   render is a silent drop, and a page with no entry is a grid that renders
   nothing without saying so. */
(() => {
  const orphanData = Object.keys(CATALOG_DATA.index).filter((s) => !CATEGORY_ROUTES.has(s));
  if (orphanData.length) die(`content/catalog-products.json names ${orphanData.length} category slug(s) this build emits no page for: ${orphanData.join(', ')}.`);
  const orphanPage = CATEGORIES.map((c) => c.slug).filter((s) => !(s in CATALOG_DATA.index));
  if (orphanPage.length) die(`${orphanPage.length} catalogue page(s) have no entry in content/catalog-products.json: ${orphanPage.join(', ')}.`);
  /* An entry that is present and EMPTY is the silent case: the page still builds,
     renders a heading and no grid, and every gate passes on it. A catalogue page
     with no product is a page with nothing on it, so it fails here and names
     itself. Presence, not silence (docs/CLAUDE.md section 13). */
  const emptyPage = CATEGORIES.map((c) => c.slug).filter((s) => (CATALOG_DATA.index[s] || []).length === 0);
  if (emptyPage.length) die(`${emptyPage.length} catalogue page(s) would render an empty grid: ${emptyPage.join(', ')}. A category with no product is not a page.`);
})();

/* --- W25-19, the consolidated roofing section ------------------------------ */

/* The roofing catalogue moves onto `/servicii/acoperisuri/`, the page that already
   says what Rapid Construct does with these materials, and the eight catalogue
   URLs become redirect pages that still answer 200 and land on the matching
   filter. A visitor who wanted a gutter was three clicks and two page loads from
   one; now they are on the page that sells the roof.

   THE FILTER IS THE SUBCATEGORY LIST, read from content/catalog.json, so the
   groups, their labels and their order are the menu's own and nothing is typed
   here. A record can belong to more than one group, and three do, so a card
   carries a SPACE-SEPARATED list of groups and appears once in the DOM under
   every filter that matches it. Duplicating the card per group would have put the
   same picture on two cards, which gate 19 forbids for good reason.

   THE CARD IS `prodCard`, the catalogue's own, so the quote button, the price
   element and the placeholder behave exactly as they do on a catalogue page, and
   the phone fold is the same `data-prod-step` main.js already reads.

   THE PREFIX IS `.roof-*` and rule 3.1 was checked before the first rule was
   written: `grep '\.roof' src/styles.css` returned nothing. */
const ROOF_CATEGORY = 'materiale-acoperis';
const ROOF_SECTION_PATH = (l) => `${SERVICES_ROOT[l.code]}acoperisuri/`;

/* The groups, and the ids the redirect pages and the menu aim at. `mat-<slug>` is
   on the filter BUTTON, so a hash lands on the control it names and main.js has
   the button in hand without a second lookup.

   AMENDED (W26-04, ruling W26-R5). THE FILTER GROUPS ARE NO LONGER THE CATALOGUE'S
   SUBCATEGORIES. W25-19 derived seven filters from the seven roofing children of
   content/catalog.json, which was right while the section was a mirror of one
   supplier's catalogue. The restructure regroups them into FIVE sections that are
   what a roof is bought in, and two of those sections have no catalogue
   subcategory at all because dasterum.md sells neither ceramic tile nor shingle.

   THE OLD ROUTES DO NOT MOVE. W26-R5 keeps all eight /catalog/materiale-acoperis/
   pages as redirects, so the seven children still exist and each one now aims at
   the group it was folded into. `from_catalog` is that mapping, it is data rather
   than a branch in this file, and it is asserted to cover every child exactly
   once: a child in no group would send its redirect page to an anchor that is not
   on the page, and a child in two would make the count on the filter button a
   number no set of cards adds up to. */
const ROOF_SECTIONS_FILE = 'content/roofing-sections.json';
const ROOF_SECTIONS = JSON.parse(fs.readFileSync(ROOF_SECTIONS_FILE, 'utf8'));
const SPEC_ORDER = ROOF_SECTIONS.spec_order || [];
if (!SPEC_ORDER.length) die(`${ROOF_SECTIONS_FILE} has no spec_order, so a card's spec line would have no order to be written in.`);
const roofGroups = (() => {
  const cat = CATALOG.categories[PARENT_CATEGORIES.findIndex((c) => c.slug === ROOF_CATEGORY)];
  const kids = (cat && cat.children) || [];
  if (kids.length !== 7) die(`the roofing category has ${kids.length} subcategories in ${CATALOG_FILE}; the redirect pages are built from them and expect 7.`);
  const children = kids.map((k, ki) => {
    const href = k.href && k.href.ro;
    const m = /^\/catalog\/materiale-acoperis\/([^/]+)\/$/.exec(href || '');
    if (!m) die(`${CATALOG_FILE}: roofing child ${ki} href "${href}" is not /catalog/materiale-acoperis/<child>/.`);
    return m[1];
  });
  const groups = ROOF_SECTIONS.groups;
  /* W26-R5 named five; W27-R-06 (W27-C-02) makes Tabla cutata a sixth, its own group. */
  if (!Array.isArray(groups) || groups.length !== 6) die(`${ROOF_SECTIONS_FILE}: W26-R5 and W27-R-06 name six roofing sections, found ${(groups || []).length}.`);
  const seen = new Map();
  for (const g of groups) {
    if (!REAL(g.id) || !g.label || !REAL(g.label.ro) || !REAL(g.label.ru)) die(`${ROOF_SECTIONS_FILE}: group "${g.id}" needs an id and a label in both locales.`);
    for (const c of g.from_catalog || []) {
      if (!children.includes(c)) die(`${ROOF_SECTIONS_FILE}: group "${g.id}" takes catalogue child "${c}", which ${CATALOG_FILE} does not have.`);
      if (seen.has(c)) die(`${ROOF_SECTIONS_FILE}: catalogue child "${c}" is in both "${seen.get(c)}" and "${g.id}". A child lands in exactly one section.`);
      seen.set(c, g.id);
    }
  }
  const unplaced = children.filter((c) => !seen.has(c));
  if (unplaced.length) die(`${ROOF_SECTIONS_FILE}: catalogue child(ren) in no section: ${unplaced.join(', ')}. Their redirect pages would aim at an anchor that does not exist.`);
  return groups.map((g) => ({ child: g.id, slug: `${ROOF_CATEGORY}/${g.id}`, label: g.label, from: g.from_catalog || [] }));
})();
/* Which section a catalogue child was folded into, for the redirect pages. */
const ROOF_GROUP_OF_CHILD = new Map();
for (const g of roofGroups) for (const c of g.from) ROOF_GROUP_OF_CHILD.set(c, g.child);
/* W26-05. THE LIVE CHECK'S MAP IS HELD TO THIS ONE, at build time, beside the
   thing it protects. `scripts/verify-live.js` asserts where each of the eight
   catalogue redirects lands; W26-04 regrouped the sections and did not move it,
   and section 12.0 on cfebef8 came back with 12 of 16 redirect rows FAILED and
   nothing wrong with the site. That is the third time in three waves that a marker
   was left behind by the thing it names, so this is coupled rather than
   remembered: a grouping changed without the map changing fails HERE, at the
   author's desk, instead of after a merge. */
(() => {
  const vlPath = 'scripts/verify-live.js';
  if (!fs.existsSync(vlPath)) die(`${vlPath} is missing, so its redirect map cannot be held to this one.`);
  const src = fs.readFileSync(vlPath, 'utf8');
  const block = src.match(/const REDIRECT_SECTION = \{([\s\S]*?)\};/);
  if (!block) die(`${vlPath} declares no REDIRECT_SECTION. If that constant moved, this assertion has to move with it.`);
  const map = new Map();
  for (const m of block[1].matchAll(/'?([a-z-]+)'?\s*:\s*'([a-z-]+)'/g)) map.set(m[1], m[2]);
  for (const [child, section] of ROOF_GROUP_OF_CHILD) {
    if (map.get(child) !== section) {
      die(`${vlPath} sends /catalog/materiale-acoperis/${child}/ to "#mat-${map.get(child) || 'nothing'}" and this build sends it to "#mat-${section}". A live check that expects the old anchor fails on a site that is correct.`);
    }
  }
  const extra = [...map.keys()].filter((k) => k !== '' && !ROOF_GROUP_OF_CHILD.has(k));
  if (extra.length) die(`${vlPath} maps roofing route(s) this build does not emit: ${extra.join(', ')}.`);
})();
const ROOF_ALL = 'toate';
/* The eight routes that stop being catalogue pages and become redirect pages.
   Derived, never listed: the parent plus its own children, so adding a roofing
   subcategory to content/catalog.json adds its redirect page too. */
const ROOF_MOVED_ROUTES = new Set();
const MOVED_RAW_KEYS = new Set(['promoBar']);
const roofAnchor = (child) => `mat-${child}`;
ROOF_MOVED_ROUTES.add(ROOF_CATEGORY);
/* AMENDED (W26-04): the routes are the CATALOGUE's seven children, which is what
   they always were; before the regrouping the two lists happened to be the same
   list and the code took the wrong one of the two. W26-R5 keeps every one of
   these pages answering, so they are derived from catalog.json and never from the
   new sections, two of which have no catalogue page and never had one. */
for (const c of ROOF_GROUP_OF_CHILD.keys()) ROOF_MOVED_ROUTES.add(`${ROOF_CATEGORY}/${c}`);
if (ROOF_MOVED_ROUTES.size !== 8) die(`W25-19 expects 8 roofing routes to become redirect pages, derived ${ROOF_MOVED_ROUTES.size}.`);
/* W26-04, ruling W26-R5: the SECOND bento on /servicii/acoperisuri/, under the hub.
   Four product sections, each tile pressing its own filter button on the same page.
   The four slots are ACOP-05 to ACOP-08 and all four are EMPTY: imperlux.md
   publishes a tile image for three of them, and W26-R3 holds its override to
   ACOP-01 to ACOP-04 in terms, so taking them would be widening a permission the
   ruling says does not widen. Q-W26-04 asks for the four ids. */
const PRODUCT_BENTOS = {
  acoperisuri: {
    id: 'sectiuni-acoperis',
    kind: 'product',
    head: 'pbento.roofH',
    headMuted: 'pbento.roofHMuted',
    /* W27-C-02 (W27-R-06): a FIFTH tile, Tabla cutata, on a third row across the grid;
       the hub grids stay at four. */
    tileCount: 5,
    tiles: [
      { label: 'pbento.ceramica', slot: 'ACOP-05', anchor: roofAnchor('tigla-ceramica') },
      { label: 'pbento.sindrila', slot: 'ACOP-06', anchor: roofAnchor('sindrila-bituminoasa') },
      { label: 'pbento.pluviale', slot: 'ACOP-07', anchor: roofAnchor('sisteme-pluviale') },
      { label: 'pbento.accesorii', slot: 'ACOP-08', anchor: roofAnchor('accesorii-de-acoperis') },
      { label: 'pbento.tablaCutata', slot: 'ACOP-09', anchor: roofAnchor('tabla-cutata') },
    ],
  },
};


/* W25-19 built four catalogue cards from `content/tigla-metalica.json` for the
   Tigla metalica filter. **W25-26 removed them**, under ruling W25-R21, and the
   function that made them is gone with them rather than left unreferenced. The
   four `ACTM-` slots it created survive: they render on
   `/servicii/tigla-metalica/`, beside the models they are pictures of. */

/* W27-FIX-08 (owner instruction W27-R-14). THE IMPERLUX MODEL CARD RECORD IS BUILT IN ONE PLACE,
   because two pages render it now: the roofing page's product grid (every group) and the
   metal tile page (the seven Țiglă metalică models, above the four Dasterum tile cards). The
   record is what prodCard() takes; the two die checks on group and picture stay at the
   roofing call site, which is the one that walks every product. */
function imperluxCardRecord(l, p, i) {
  const s = (k) => {
    const v = l.strings[`roofProducts.${k}`];
    if (!REAL(v)) die(`roofProducts.${k} must be real in ${l.code}.`);
    return v;
  };
  /* W26-05. THE VARIANT LINE IS DERIVED FROM THE SPECS, not written beside them.
     W25-25 settled the same shape on the fence colours: a count stated next to
     the list it counts is a second place to be wrong. Here the line under the
     name and the row in the Compara table are the same cells, in the order
     `spec_order` gives, so a spec corrected in one place is corrected in both. */
  const specLine = (SPEC_ORDER
    .filter((k) => p.specs && p.specs[k] && REAL(p.specs[k][l.code]))
    .map((k) => p.specs[k][l.code])).join(' · ');
  /* W27-C-03 (W27-R-04). A model card carries the imperlux tagline, the named colour
     chips and a FACTS line, "15 ani garanție · 4,5 kg/m² · 3 culori", derived from the
     specs and the chip list rather than typed beside them. The count is the count the
     page prints (specs.Culori); the chips are the names it prints, which can be fewer
     ("+1" names nothing), never more. A card with a tagline takes this shape; a card
     without one keeps the spec line. */
  const hasTagline = p.tagline && REAL(p.tagline[l.code]);
  let facts = null;
  if (hasTagline) {
    const parts = [];
    const sp = p.specs || {};
    if (sp['Garanție'] && REAL(sp['Garanție'][l.code])) parts.push(`${sp['Garanție'][l.code]} ${s('factWarranty')}`);
    if (sp.Greutate && REAL(sp.Greutate[l.code])) parts.push(sp.Greutate[l.code]);
    if (sp.Culori && REAL(sp.Culori[l.code])) {
      const n = Number(sp.Culori[l.code]);
      if (!Number.isInteger(n) || n < 1) die(`${ROOF_SECTIONS_FILE}: products[${i}] "${p.slug}" has a colour count "${sp.Culori[l.code]}" that is not a count.`);
      if ((p.colours || []).length > n) die(`${ROOF_SECTIONS_FILE}: products[${i}] "${p.slug}" names ${p.colours.length} colours and counts ${n}.`);
      parts.push(`${n} ${colourWord(l, n)}`);
    }
    /* A card with a tagline and none of the three facts keeps the spec line (the rainwater
       parts' Dimensiuni) as its facts line, so the size is not lost to the new shape. */
    facts = parts.length ? parts.join(' · ') : (specLine || null);
  }
  return {
    slot: p.slot || p.folds[0],
    name: p.name,
    tagline: hasTagline ? p.tagline : null,
    colours: hasTagline ? (p.colours || []) : null,
    facts,
    variant: !hasTagline && specLine ? { [l.code]: specLine } : null,
    price: p.price,
    specs: p.specs || {},
    _imperlux: true,
  };
}

function roofSection(l) {
  const records = CATALOG_PRODUCTS[ROOF_CATEGORY] || [];
  if (!records.length) die('the roofing category has no records, so W25-19 would render an empty section.');
  const label = (k) => prodLabel(l, k);
  const s = (k) => {
    const v = l.strings[`roofProducts.${k}`];
    if (!REAL(v)) die(`roofProducts.${k} must be real in ${l.code}.`);
    return v;
  };
  /* The count the status line prints is substituted from ONE string, here and in
     main.js, so the server-rendered "75 produse afisate" and the number the
     filter writes after a press cannot say it two different ways. A string that
     lost its placeholder would leave the live region printing a literal {n}. */
  if (!s('showing').includes('{n}')) die(`roofProducts.showing for ${l.code} has no {n} placeholder, so the filter's live count cannot be written.`);

  /* Which section each record is in, read from the record's own catalogue
     subcategory and then through W26-R5's mapping, so a card cannot claim a
     section the data does not put it in. */
  const groupsFor = (r) => [...new Set((r.categories || [])
    .filter((c) => c.startsWith(`${ROOF_CATEGORY}/`))
    .map((c) => ROOF_GROUP_OF_CHILD.get(c.split('/')[1]))
    .filter(Boolean))];
  const orphan = records.filter((r) => !groupsFor(r).length);
  if (orphan.length) die(`${orphan.length} roofing record(s) belong to no section, so no filter would ever show them: ${orphan.map((r) => r.slot).join(', ')}.`);
  /* EXACTLY ONE SECTION, and it is asserted rather than assumed. Five records sit
     in two catalogue subcategories, and today both of each pair fold into the same
     section. The moment one did not, the card would be ordered under one section
     and counted under two, so the filter button would promise a number no press
     could produce. That is a silent defect, so it is a build failure instead. */
  const split = records.filter((r) => groupsFor(r).length > 1);
  if (split.length) die(`${split.length} roofing record(s) land in two sections, so their filter counts could not both be true: ${split.map((r) => `${r.slot} (${groupsFor(r).join(', ')})`).join('; ')}.`);

  /* AMENDED (W25-26, ruling W25-R21): ONE CARD PER MODEL NAME. W25-19 put eight
     cards in this group under four names, four from `content/tigla-metalica.json`
     and four catalogue records. The four extra cards are gone.

     Q-W25-17 asked the owner to choose between "two suppliers, two prices" and
     merging. The premise was wrong and the walk that closed it is in the W25-26
     card: BOTH SETS ARE DASTERUM. The wave 14 audit's section 2.1 is titled
     "dasterum.md: Țiglă metalică" and names Dasterum as the manufacturer on every
     row, so `tigla-metalica.json` was never an Imperlux listing; `imperlux.md`
     publishes Monterrey, Valencia and Kascad zero times and sells Barcelona,
     Madrid and Bavaria instead. There were never two suppliers and there are no
     Imperlux-only models to keep. */
  /* W26-04, ruling W26-R5: IMPERLUX PRODUCTS FIRST, then the dasterum.md records
     its model names do not already cover, section by section.

     A FOLDED RECORD IS NOT A CARD. Eleven of the seventeen rainwater models exist
     on both sites, differing only by the size in the name, so the imperlux name is
     the card, the dasterum sizes are its variants, and the card carries the
     CHEAPEST grade's price and that grade's picture. Rendering both would put the
     same part on the page twice under two names, which is what "one card per model
     name" forbids. The decision per model, with its tier and its reason, is data in
     content/roofing-sections.json rather than a rule in this file, because it is
     research and research held in code is research nobody can check. */
  const folded = new Set(ROOF_SECTIONS.products.flatMap((p) => p.folds || []));
  const impBySection = new Map(roofGroups.map((g) => [g.child, []]));
  ROOF_SECTIONS.products.forEach((p, i) => {
    if (!impBySection.has(p.group)) die(`${ROOF_SECTIONS_FILE}: products[${i}] "${p.slug}" is in section "${p.group}", which is not one of the six.`);
    if (!REAL(p.slot) && !(p.folds || []).length) die(`${ROOF_SECTIONS_FILE}: products[${i}] "${p.slug}" folds no record and has no slot of its own, so it has no picture to render.`);
    /* ~~A product with both a slot and folds dies: the folded record's slot IS its picture.~~
       AMENDED (W27-C-06, ruling W27-R-04): imperlux.md is the source of record for the
       picture too, so a product may carry its own slot AND fold the dasterum records it
       stands for; the slot is the picture, the folds render nowhere. */
    impBySection.get(p.group).push(imperluxCardRecord(l, p, i));
  });
  for (const f of folded) {
    if (!records.some((r) => r.slot === f)) die(`${ROOF_SECTIONS_FILE}: a product folds ${f}, which is not a roofing record.`);
  }

  /* Section by section, imperlux first. The grid is one list and the filter hides
     the rest of it, so the ORDER inside a section is the order a visitor reads. */
  const ordered = [];
  for (const g of roofGroups) {
    ordered.push(...impBySection.get(g.child));
    ordered.push(...records.filter((r) => !folded.has(r.slot) && groupsFor(r)[0] === g.child)
      .map((r) => ({ ...r, _groups: groupsFor(r) })));
  }
  const groupOf = (r) => (r._imperlux ? null : r._groups);
  const sectionOf = (r, i) => {
    if (!r._imperlux) return r._groups;
    for (const g of roofGroups) if (impBySection.get(g.child).includes(r)) return [g.child];
    return [];
  };
  const cards = ordered.map((r, i) => prodCard(l, r, i, ` data-roof-groups="${esc(sectionOf(r, i).join(' '))}"`));

  /* W26-05, ruling W26-R6: COMPARA MODELELE, one table per section that has one.

     WHICH SECTIONS HAVE ONE IS DATA, not a rule here, because it is a judgement
     about the products and a judgement in code is a judgement nobody can read.
     `tables_declined` carries the two that do not and why, in the same file.

     PRODUCTS ARE ROWS, NOT COLUMNS, and that is the one deliberate deviation from
     "copy it (columns and rows)". imperlux.md lays its tables out with a product
     per COLUMN, which is seventeen columns on the rainwater page. Seven columns
     already do not fit 360px, and this site is held to no sideways scroll at 360
     by gate 14. The CELLS are the ruling's; the axis is the only thing that moves,
     and a transposed table holds exactly the same comparison.

     THE WARRANTY ROW IS NOT HERE. W26-R6 holds the roof warranty until the owner
     confirms it, and `Garantie` is real on every dasterum metal-tile record, so
     leaving it out is a decision taken each build rather than an absence. */
  const tableFor = (g) => {
    const spec = (ROOF_SECTIONS.tables || []).find((t) => t.group === g.child);
    if (!spec) return '';
    const rows = ordered.filter((r) => sectionOf(r).includes(g.child));
    if (rows.length < 2) die(`${ROOF_SECTIONS_FILE}: a Compara table is declared for "${g.child}" and it has ${rows.length} product(s). A comparison of fewer than two compares nothing.`);
    const cell = (r, key) => {
      if (key === 'price') return (r.price && r.price.render && r.price.render[l.code]) || null;
      if (key === 'colours') {
        /* An imperlux model's count is the count its page prints (W27-C-03); a dasterum
           record's is the length of the colour list it publishes. */
        if (r._imperlux) return (r.specs && r.specs.Culori && r.specs.Culori[l.code]) || null;
        const n = (r.source && r.source.colours || []).length;
        return n ? String(n) : null;
      }
      if (key.startsWith('spec:')) {
        const k = key.slice(5);
        if (r._imperlux) return (r.specs && r.specs[k] && r.specs[k][l.code]) || null;
        /* dasterum.md writes "* Econom Standart Premium" with a leading asterisk
           that footnotes nothing on its own page and would footnote nothing here.
           Dropping it is section 5's permitted shortening, and the card's own
           variant line has printed it without the asterisk since W25-19, so the
           table would otherwise disagree with the card above it. */
        const raw = (r.source && r.source.specs && r.source.specs[k]) || null;
        return raw == null ? null : String(raw).replace(/^\s*\*\s*/, '');
      }
      die(`${ROOF_SECTIONS_FILE}: table "${g.child}" names an unknown column key "${key}".`);
      return null;
    };
    /* A COLUMN MOSTLY EMPTY IS A COLUMN THAT MISLEADS. Half is the floor, it is
       asserted at build time rather than eyeballed, and the message names the
       column and the count so the fix is either the data or the declaration. */
    for (const c of spec.columns) {
      const real = rows.filter((r) => REAL(cell(r, c.key))).length;
      if (real * 2 < rows.length) die(`${ROOF_SECTIONS_FILE}: table "${g.child}" declares the column "${c.key}" and only ${real} of ${rows.length} products have it. A column under half real is a column that misleads.`);
    }
    const head = [s('tableProduct'), ...spec.columns.map((c) => {
      const lab = c.label && c.label[l.code];
      if (!REAL(lab)) die(`${ROOF_SECTIONS_FILE}: table "${g.child}" column "${c.key}" has no ${l.code} label.`);
      return lab;
    })];
    const body = rows.map((r) => {
      const tds = spec.columns.map((c) => {
        const v = cell(r, c.key);
        return `<td>${REAL(v) ? esc(v) : esc(s('tableNone'))}</td>`;
      }).join('');
      return `          <tr><th scope="row">${esc(r.name[l.code])}</th>${tds}</tr>`;
    }).join('\n');
    /* W27-C-03: the section's "de la" line, DERIVED: the lowest current price among the
       section's imperlux models, in their unit, and how many models there are. It sits
       inside the table block so the filter shows and hides it with the section. Nothing
       is typed: a "de la" written beside the cards it summarises is a second place to be
       wrong (W26-05). Sections whose imperlux models have no price, or mixed units, get
       no line. */
    const imp = rows.filter((r) => r._imperlux && r.price && r.price.render && REAL(r.price.render[l.code]));
    let fromLine = '';
    if (imp.length) {
      const parsed = imp.map((r) => {
        const m = /(\d+(?:[.,]\d+)?)\s*(lei(?:\/\S+)?)/.exec(r.price.render[l.code]);
        return m ? { n: Number(m[1].replace(',', '.')), unit: m[2], text: r.price.render[l.code] } : null;
      });
      const units = new Set(parsed.map((x) => x && x.unit));
      if (parsed.every(Boolean) && units.size === 1) {
        const low = parsed.reduce((a, b) => (b.n < a.n ? b : a));
        const tpl = s('groupFrom');
        if (!tpl.includes('{n}') || !tpl.includes('{price}')) die(`roofProducts.groupFrom must carry {n} and {price} in ${l.code}.`);
        /* The figure with its unit, without the source's own "De la" / "От": the template
           carries the words. Russian counts "model" three ways, so the noun is a key too. */
        const priceOnly = low.text.slice(low.text.search(/\d/));
        const nModels = imp.length;
        const modelsKey = nModels === 1 ? 'modelsOne' : (l.code === 'ru' && (nModels % 10 >= 2 && nModels % 10 <= 4 && !(nModels % 100 >= 12 && nModels % 100 <= 14))) || (l.code === 'ro' && nModels > 1) ? 'modelsFew' : 'modelsMany';
        if (!tpl.includes('{models}')) die(`roofProducts.groupFrom must carry {models} in ${l.code}.`);
        fromLine = `\n        <p class="roof-cmp__from">${esc(tpl.replace('{n}', String(nModels)).replace('{models}', s(modelsKey)).replace('{price}', priceOnly))}</p>`;
      }
    }
    return `      <div class="roof-cmp" data-roof-table data-roof-groups="${esc(g.child)}">
        <h3 class="roof-cmp__h">${esc(s('tableH'))} ${esc(g.label[l.code])}</h3>${fromLine}
        <div class="roof-cmp__scroll" tabindex="0" role="region" aria-label="${esc(s('tableH'))} ${esc(g.label[l.code])}">
        <table class="roof-cmp__t">
          <thead><tr>${head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead>
          <tbody>
${body}
          </tbody>
        </table>
        </div>
      </div>`;
  };
  const tables = roofGroups.map(tableFor).filter(Boolean).join('\n');
  if (!tables) die(`${ROOF_SECTIONS_FILE} declares no Compara table, so W26-R6 would render nothing.`);

  const counts = new Map(roofGroups.map((g) => [g.child,
    ordered.filter((r) => sectionOf(r).includes(g.child)).length]));
  const total = cards.length;

  const btn = (id, text, n, active) =>
    `        <button class="roof-filter__btn" type="button" id="${esc(roofAnchor(id))}" data-roof-filter="${esc(id)}"`
    + ` aria-pressed="${active ? 'true' : 'false'}">${esc(text)} <span class="roof-filter__n">${n}</span></button>`;
  const bar = [btn(ROOF_ALL, s('all'), total, true), ...roofGroups.map((g) => btn(g.child, g.label[l.code], counts.get(g.child), false))];

  const ariaRaw = label('moreAria');
  if (!ariaRaw.includes('{n}')) die(`catalogProducts.moreAria for ${l.code} has no {n} placeholder.`);
  const more = total > PROD_STEP
    ? `
    <div class="prod-more" data-prod-more hidden>
      <button class="btn btn--outline prod-more__btn" type="button" data-prod-more-btn aria-controls="produse-grid" aria-label="${esc(ariaRaw.replace('{n}', String(PROD_STEP)))}">${esc(label('more'))}</button>
    </div>`
    : '';

  /* `aria-live="polite"` on the count, because pressing a filter changes what is
     on the page and nothing else announces it. The count is also the no-JS
     fallback's honest state: with no script every card is shown, and the bar
     reads the total. */
  return `<section class="section section--light section--divided" id="produse" aria-labelledby="produse-h">
  <div class="container">
    <p class="eyebrow" data-reveal>${esc(s('eyebrow'))}</p>
    <h2 id="produse-h" data-reveal>${esc(s('h2'))}</h2>
    <p class="lede" data-reveal>${esc(s('lede'))}</p>
    <div class="roof-filter" role="group" aria-label="${esc(s('filterAria'))}" data-roof-bar>
${bar.join('\n')}
    </div>
    <p class="roof-filter__status muted" data-roof-status data-roof-showing="${esc(s('showing'))}" aria-live="polite">${esc(s('showing').replace('{n}', String(total)))}</p>
${tables}
    <div class="prod-grid" id="produse-grid" data-prod-grid data-roof-grid data-prod-step="${PROD_STEP}">
${cards.join('\n')}
    </div>${more}
  </div>
</section>`;
}

/* W24-06. `parent` names the service page a product page sits under. Only the
   tile page has one: the dispatch makes tigla metalica a child of acoperisuri,
   because a metal tile is a roof and the page reads as one of several roofing
   answers rather than as a service of its own.

   A page with a parent takes a three-level breadcrumb and LEAVES THE TOP-LEVEL
   LIST in the header's Servicii panel. Its URL does not move: GitHub Pages serves
   no redirects, so a moved URL is a dead link, and the dispatch says so.

   It must still be reachable, or it is an orphan the sitemap advertises: the
   section this card moves onto the acoperisuri page carries a link to it, and
   W24-07 replaces that link with the bento tile the dispatch specifies. */
/* W24-07, the rocă vulcanică page. Mirrors the imperlux.md hub section by
   section under W24-R6 and W24-R7. What is rendered is PRODUCT fact: a model
   name, a profile description, a thickness, a weight, a colour count, and four
   of the source's five questions. What is not rendered is every company fact and
   every price, all 32 of them listed in docs/W24-CLAIMS-HELD.md with the page and
   the position each came from.

   Three of the source's eight sections render nothing and are therefore absent,
   not empty: the benefit bento, the portfolio and the "De ce Imperlux" stat wall
   are company facts end to end. A section with nothing in it is a heading over a
   gap, and this repo already refuses that shape for the before/after slider and
   the specification table. */
const NOVATIK_FILE = 'content/novatik.json';
const NOVATIK = JSON.parse(fs.readFileSync(NOVATIK_FILE, 'utf8'));
for (const k of ['models', 'compare', 'faq']) {
  if (!Array.isArray(NOVATIK[k])) die(`${NOVATIK_FILE} has no "${k}" array.`);
  if (NOVATIK[k].length === 0) die(`${NOVATIK_FILE}: "${k}" is empty, so its section would be a heading over a gap.`);
}

function novatikPage(l) {
  const s = (k) => {
    const v = l.strings[`novatik.${k}`];
    if (!REAL(v)) die(`novatik.${k} must be real in ${l.code}.`);
    return esc(v);
  };
  /* W24-R7: an imperlux price is not published, and the slot renders the W22-01
     phrase. It takes THE SAME SHAPE the catalogue card uses, a .prod__ask
     carrying its own product, because that shape is what
     scripts/check-catalog-pages.js permits the phrase in; a loose phrase on a
     page is refused here exactly as it is on a catalogue page. */
  const ask = (product) => {
    const v = l.strings['catalogProducts.ask'];
    if (!REAL(v)) die(`catalogProducts.ask must be real in ${l.code}.`);
    return `<span class="prod__ask" data-product="${esc(product)}">${esc(v)}</span>`;
  };
  const need = (v, where) => { if (!REAL(v)) die(`${NOVATIK_FILE}: ${where} is not real for ${l.code}.`); return v; };

  /* Model cards. ~~The price slot carries the W22-01 phrase, which is what W24-R7
     leaves for a price this site does not publish.~~ AMENDED (W27-C-04, rulings
     W27-R-04 and W27-R-05): imperlux.md is the source of record and publishes a
     price for every model, so the card carries it as "De la N lei/buc" in the fence
     page's own price shape (`.nvk__price`, W25-11), never a struck figure or a badge.
     The named colours are chips, the warranty figure joins the facts list, and the
     W22-01 phrase is kept as the fallback for a model whose record has no price. */
  const price = (m, i) => (m.price && m.price.render && REAL(m.price.render[l.code]))
    ? `<span class="nvk__price" data-product="${esc(m.name)}">${esc(m.price.render[l.code])}</span>`
    : ask(m.name);
  /* W27-FIX-04 (ruling W27-R-11): the same "+N" chip as the roofing model cards, for a colour
     the count includes and the list does not name (Roman counts five and names three, Wood four
     and three). One rule, every writer. */
  const moreChip = (m) => {
    const n = Number(m.colours) - m.colour_names.length;
    return n > 0 ? `<li class="nvk__chip" data-more="${n}">+${n}</li>` : '';
  };
  const chips = (m) => (Array.isArray(m.colour_names) && m.colour_names.length)
    ? `\n          <ul class="nvk__chips" aria-label="${esc(l.strings['roofProducts.coloursAria'] || '')}">${m.colour_names.map((c) => `<li class="nvk__chip">${esc(colourName(l, c))}</li>`).join('')}${moreChip(m)}</ul>`
    : '';
  const warrantyRow = (m, i) => (m.warranty && REAL(m.warranty[l.code]))
    ? `\n            <div><dt>${s('warranty')}</dt><dd>${esc(m.warranty[l.code])}</dd></div>`
    : '';
  for (const [i, m] of NOVATIK.models.entries()) {
    if (Array.isArray(m.colour_names) && m.colour_names.length > Number(m.colours)) die(`${NOVATIK_FILE}: models[${i}] names ${m.colour_names.length} colours and counts ${m.colours}.`);
  }
  const cards = NOVATIK.models.map((m, i) => `      <article class="nvk" data-reveal data-stagger="${Math.min(i, 6)}">
        <div class="nvk__media">${placeholder(`NVK-${String(i + 1).padStart(2, '0')}`, { variant: 'light', className: 'nvk__ph', locale: l.code, eager: i < 2 })}</div>
        <div class="nvk__body">
          <h3 class="nvk__name">${esc(need(m.name, `models[${i}].name`))}</h3>
          <p class="nvk__desc">${esc(need(m.desc && m.desc[l.code], `models[${i}].desc`))}</p>${chips(m)}
          <dl class="nvk__facts">${warrantyRow(m, i)}
            <div><dt>${s('thickness')}</dt><dd>${esc(need(m.thickness, `models[${i}].thickness`))}</dd></div>
            <div><dt>${s('weight')}</dt><dd>${esc(need(m.weight, `models[${i}].weight`))}</dd></div>
            <div><dt>${s('colours')}</dt><dd>${esc(need(m.colours, `models[${i}].colours`))}</dd></div>
          </dl>
          <p class="nvk__pricebox">${price(m, i)}</p>
        </div>
      </article>`).join('\n');

  /* W27-C-04: the section's derived "de la" line, the lowest current price across the
     models, the same derivation the roofing page's tables carry (W27-C-03). */
  let fromLine = '';
  {
    const parsed = NOVATIK.models.map((m) => {
      const t = m.price && m.price.render && m.price.render[l.code];
      const mm = t && /(\d+(?:[.,]\d+)?)\s*(lei(?:\/\S+)?)/.exec(t);
      return mm ? { n: Number(mm[1].replace(',', '.')), unit: mm[2], text: t } : null;
    });
    if (parsed.every(Boolean) && new Set(parsed.map((x) => x.unit)).size === 1) {
      const low = parsed.reduce((a, b) => (b.n < a.n ? b : a));
      const tpl = l.strings['roofProducts.groupFrom'];
      const nM = NOVATIK.models.length;
      const key = nM === 1 ? 'modelsOne' : (l.code === 'ru' && (nM % 10 >= 2 && nM % 10 <= 4 && !(nM % 100 >= 12 && nM % 100 <= 14))) || (l.code === 'ro' && nM > 1) ? 'modelsFew' : 'modelsMany';
      if (REAL(tpl) && REAL(l.strings[`roofProducts.${key}`])) {
        fromLine = `\n    <p class="nvk-from" data-reveal>${esc(tpl.replace('{n}', String(nM)).replace('{models}', l.strings[`roofProducts.${key}`]).replace('{price}', low.text.slice(low.text.search(/\d/))))}</p>`;
      }
    }
  }

  const head = NOVATIK.models.map((m) => `<th scope="col">${esc(m.name)}</th>`).join('');
  const rows = NOVATIK.compare.map((r, i) => `          <tr><th scope="row">${esc(need(r.label && r.label[l.code], `compare[${i}].label`))}</th>${NOVATIK.models.map((m) => `<td>${esc(m[r.key])}</td>`).join('')}</tr>`).join('\n');
  /* The price row prints the same "De la" figure the card does; the warranty row stays
     held (W26-R6), so the table has no such row and the figure lives on the card. */
  const priceRow = `          <tr><th scope="row">${s('priceRow')}</th>${NOVATIK.models.map((m, i) => `<td>${price(m, i)}</td>`).join('')}</tr>`;

  const faq = NOVATIK.faq.map((f, i) => `        <div><dt>${esc(need(f.q && f.q[l.code], `faq[${i}].q`))}</dt><dd>${esc(need(f.a && f.a[l.code], `faq[${i}].a`))}</dd></div>`).join('\n');

  return `<section class="section section--light section--divided" id="modele" aria-labelledby="modele-h">
  <div class="container">
    <h2 id="modele-h" data-reveal>${s('modelsH2')}</h2>${fromLine}
    <div class="nvk-grid">
${cards}
    </div>
  </div>
</section>
<section class="section section--dark section--divided" id="comparatie" aria-labelledby="comparatie-h">
  <div class="container">
    <h2 id="comparatie-h" data-reveal>${s('compareH2')}</h2>
    <div class="table-wrap" data-reveal>
      <table class="spec">
        <thead><tr><th scope="col">${s('specCol')}</th>${head}</tr></thead>
        <tbody>
${rows}
${priceRow}
        </tbody>
      </table>
    </div>
  </div>
</section>
<section class="section section--light section--divided" id="intrebari" aria-labelledby="intrebari-h">
  <div class="container">
    <h2 id="intrebari-h" data-reveal>${s('faqH2')}</h2>
    <dl class="nvk-faq" data-reveal>
${faq}
    </dl>
  </div>
</section>
`;
}

/* W24-08, the fence models page. Mirrors imperlux.md/garduri/garduri under
   W24-R6 and W24-R7. Eight cards, four designations in two materials, exactly as
   the source lays them out and in the source's own order, which is ~~IL12, IL30,
   IL100, IL40~~ RC12, RC30, RC100, RC40: not numeric, and copied rather than
   tidied.

   AMENDED (W26-09, owner instruction 2026-09-22): THE DESIGNATION IS OURS NOW.
   The source's IL12, IL30, IL40 and IL100 render as RC12, RC30, RC40 and RC100,
   which is the same de-badging content/copertine.json took at W14-23, where
   IL301 to IL311 became C-01 to C-12. The ORDER above is still the source's and
   is still not tidied. Every other field is still the source's, including the
   material names Metal Plus and Metal PlusDV.

   Rendered: the designation, the material, the style label, the sheet thickness,
   the colour count. Held and listed in docs/W24-CLAIMS-HELD.md: every price, every
   struck price, every discount badge, the anticorrosion warranty in years, the
   hidden-fixing claim and the local-production claim. GARD_FORBIDDEN is untouched
   (W24-R7). */
const GARD_MODELE_FILE = 'content/garduri-modele.json';
const GARD_MODELE = JSON.parse(fs.readFileSync(GARD_MODELE_FILE, 'utf8'));
if (!Array.isArray(GARD_MODELE.models) || GARD_MODELE.models.length === 0) {
  die(`${GARD_MODELE_FILE} has no "models", so its grid would be a heading over a gap.`);
}
/* W26-09. The same refusal content/copertine.json has carried since W14-23, now that
   this file's designations are ours too. It reads the MODELS and the PALETTE only,
   never the _note or the source block, because those name the source on purpose and
   a guard that fired on its own documentation would be turned off. Two digits or
   three: the fence codes were IL12, IL30, IL40 and IL100, so the copertine guard's
   three-digit shape would have let two of them straight back in. */
if (/\bIL\s?\d{2,3}\b/i.test(JSON.stringify({ models: GARD_MODELE.models, palette: GARD_MODELE.palette }))) {
  die(`${GARD_MODELE_FILE} still carries a competitor model code (IL followed by two or three digits). Models use Rapid Construct designations.`);
}

function gardModelePage(l) {
  const s = (k) => {
    const v = l.strings[`gardModele.${k}`];
    if (!REAL(v)) die(`gardModele.${k} must be real in ${l.code}.`);
    return esc(v);
  };
  const askLabel = l.strings['catalogProducts.ask'];
  if (!REAL(askLabel)) die(`catalogProducts.ask must be real in ${l.code}.`);
  const need = (v, where) => { if (!REAL(v)) die(`${GARD_MODELE_FILE}: ${where} is not real for ${l.code}.`); return v; };

  /* W25-11. The owner's instruction: publish the "de la" price per model, as
     shown on the imperlux.md garduri page, under W25-R8. That page also carries
     struck prices, percent badges and a limited-offer banner; none of those is
     copied, and R-X's gate refuses all three on this site anyway.

     The price REPLACES "Preț la cerere" on a model that has one: showing both a
     figure and "price on request" would contradict itself. A model with no
     `price_from` still falls back to the ask label, so the page cannot go silent
     if a price is ever removed from the data. It does NOT reuse `.prod__price`:
     that class belongs to the catalogue card and gate RC-129 confines it to a
     catalogue category page, so borrowing it here took that gate red. The class
     is `.nvk__price`, which is this component's own prefix and was grepped free
     across the stylesheet, build.js, main.js and every script before it was
     written, which is what rule 3.1 asks for. */
  const priceFrom = l.strings['gardModele.priceFrom'];
  if (!REAL(priceFrom)) die(`gardModele.priceFrom must be real in ${l.code}.`);
  const priceLine = (m, i) => {
    const p = m.price_from;
    if (!p) return `<p class="nvk__ask"><span class="prod__ask" data-product="${esc(`${m.designation} ${m.material}`)}">${esc(askLabel)}</span></p>`;
    if (!REAL(p.amount) || !REAL(p.unit)) die(`${GARD_MODELE_FILE}: models[${i}].price_from needs a real amount and unit.`);
    return `<p class="nvk__ask"><span class="nvk__price">${esc(priceFrom)} ${esc(p.amount)} ${esc(p.unit)}</span></p>`;
  };

  /* W25-25. The colour NAMES, which the source publishes on every one of its eight
     model pages under "Culori disponibile" and again in the alt text of each
     swatch. The count alone told a visitor there were three and not which three.

     THE PALETTE LIVES ONCE, in the data file, keyed by RAL code, and a model names
     the codes it offers. So a colour renamed is renamed everywhere, and the count
     stops being a second place to be wrong: it is asserted against the list below
     rather than trusted.

     THE RAL CODE IS PRINTED BESIDE THE NAME because imperlux.md publishes no RU
     page, so the Russian name is authored here while the code is the source's.
     A colour name translated is not a claim; the code is what a buyer matches. */
  const palette = GARD_MODELE.palette || {};
  const colourText = (m, i) => {
    const rals = m.colour_rals;
    if (!Array.isArray(rals) || !rals.length) die(`${GARD_MODELE_FILE}: models[${i}] has no colour_rals.`);
    if (String(m.colours) !== String(rals.length)) {
      die(`${GARD_MODELE_FILE}: models[${i}] says ${m.colours} colours and lists ${rals.length} (${rals.join(', ')}). The count is derived from the list, never stated beside it.`);
    }
    return rals.map((r) => {
      const entry = palette[r];
      if (!entry || !REAL(entry[l.code])) die(`${GARD_MODELE_FILE}: palette has no ${l.code} name for RAL ${r}, named by models[${i}].`);
      return `${entry[l.code]} (RAL ${r})`;
    }).join(', ');
  };

  const cards = GARD_MODELE.models.map((m, i) => {
    const name = `${need(m.designation, `models[${i}].designation`)} ${need(m.material, `models[${i}].material`)}`;
    return `      <article class="nvk" data-reveal data-stagger="${Math.min(i, 6)}">
        <div class="nvk__media">${placeholder(`GARD-${String(i + 1).padStart(2, '0')}`, { variant: 'light', className: 'nvk__ph', locale: l.code, eager: i < 2 })}</div>
        <div class="nvk__body">
          <h3 class="nvk__name">${esc(m.designation)} <span class="nvk__material">${esc(m.material)}</span></h3>
          <p class="nvk__desc">${esc(need(m.style && m.style[l.code], `models[${i}].style`))}</p>
          <dl class="nvk__facts">
            <div><dt>${s('thickness')}</dt><dd>${esc(need(m.thickness, `models[${i}].thickness`))}</dd></div>
            <div><dt>${s('colours')}</dt><dd>${esc(need(m.colours, `models[${i}].colours`))}: ${esc(colourText(m, i))}</dd></div>
          </dl>
          ${priceLine(m, i)}
        </div>
      </article>`;
  }).join('\n');

  /* W26-05, ruling W26-R6: the fence page's Compara table. imperlux.md publishes
     NONE on any of its eight model pages, which W25-25 measured, so this one is
     built from the card specs.

     THE WARRANTY COLUMN IS NOT HERE, and this time because the owner said so:
     Q-W25-19 is answered "leave it off". The source states 20 and 30 years of
     anticorrosion cover; it stays in docs/W24-CLAIMS-HELD.md and off the page.

     THE CELLS ARE THE CARD'S OWN, read from the same records in the same order,
     so a table that disagreed with the card above it cannot be built. */
  const gardTable = (() => {
    /* NO MATERIAL COLUMN. The row header is the designation AND the material,
       "RC12 Metal Plus", so a Material column would print half the row header
       again in every row. Written out because the column was there first and was
       removed after reading the rendered table. */
    const cols = [
      { key: 'thickness', label: s('tableThickness') },
      { key: 'colours',   label: s('tableColours') },
      { key: 'price',     label: s('tablePrice') },
    ];
    const cell = (m, i, key) => {
      if (key === 'thickness') return m.thickness;
      if (key === 'colours') return `${m.colours}: ${colourText(m, i)}`;
      return m.price_from ? `${priceFrom} ${m.price_from.amount} ${m.price_from.unit}` : askLabel;
    };
    const body = GARD_MODELE.models.map((m, i) =>
      `          <tr><th scope="row">${esc(`${m.designation} ${m.material}`)}</th>${cols.map((c) => `<td>${esc(cell(m, i, c.key))}</td>`).join('')}</tr>`).join('\n');
    return `    <div class="roof-cmp" id="preturi" style="margin-top: 48px;">
      <h3 class="roof-cmp__h">${s('tableH')}</h3>
      <div class="roof-cmp__scroll" tabindex="0" role="region" aria-label="${s('tableH')}">
      <table class="roof-cmp__t">
        <thead><tr><th scope="col">${s('tableModel')}</th>${cols.map((c) => `<th scope="col">${c.label}</th>`).join('')}</tr></thead>
        <tbody>
${body}
        </tbody>
      </table>
      </div>
    </div>`;
  })();

  return `<section class="section section--light section--divided" id="modele" aria-labelledby="modele-h">
  <div class="container">
    <h2 id="modele-h" data-reveal>${s('h2')}</h2>
    <p class="lede" data-reveal>${s('lede')}</p>
    <div class="nvk-grid nvk-grid--4" style="margin-top: 40px;">
${cards}
    </div>
${gardTable}
  </div>
</section>
`;
}

/* W24-08, the copertine hero and its cross-sell row. Mirrors
   imperlux.md/acoperisuri/copertine/ under W24-R6 and W24-R7.

   THE HERO IS DARK AND FULL WIDTH, which is the one place on this site a section
   carries an image behind text, so it carries a gradient for the same reason a
   bento tile does and under the same ruling (W24-R5): the gradient is inside the
   hero, over an image, and creates no fourth off-white.

   THREE DOT-SEPARATED FACTS, "only if they survive R6", and one of the three
   does. "Măsurători gratuite" is a free service claimed about the company and
   "Toată Moldova" is a coverage claim; both are held and listed. The material
   list is a product fact and renders.

   THE SECONDARY CTA SCROLLS TO THE EXISTING TWELVE MODELS. It is an in-page
   anchor to the section content/copertine.json already builds, not a new list. */
function copertineHero(l) {
  const s = (k) => {
    const v = l.strings[`copHero.${k}`];
    if (!REAL(v)) die(`copHero.${k} must be real in ${l.code}.`);
    return esc(v);
  };
  const down = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>';
  return `<section class="cop-hero">
  ${placeholder('COP-HERO', { variant: 'dark', className: 'cop-hero__ph', locale: l.code, eager: true })}
  <span class="cop-hero__grad" aria-hidden="true"></span>
  <div class="container cop-hero__inner">
    <nav class="breadcrumb cop-hero__crumb" aria-label="${esc(l.strings['servicePage.breadcrumbAria'])}">
      <a href="${BASE + l.home}">${esc(l.strings['servicePage.home'])}</a>
      <span aria-hidden="true">/</span>
      <span aria-current="page">${esc(l.strings['pages.copertine.title'])}</span>
    </nav>
    <h1 class="cop-hero__h1">${s('h1a')}<span class="cop-hero__line">${s('h1b')}</span></h1>
    <p class="cop-hero__lede">${s('lede')}</p>
    <ul class="cop-hero__facts">
      <li>${s('fact1')}</li>
    </ul>
    <div class="cop-hero__cta">
      <a class="btn btn--primary" href="#oferta">${s('ctaPrimary')}</a>
      <a class="cop-hero__more" href="#copertine">${s('ctaSecondary')}${down}</a>
    </div>
  </div>
</section>
`;
}

/* W24-08. The cross-sell row at the foot of the copertine page. The source has
   three cards; this has TWO, because the middle one is "Soffit metalic" and Rapid
   Construct has no soffit page. A card linking to a page that does not exist is a
   404 with a photograph on it, so it is omitted and named in the report, which is
   what the dispatch's "only if RC has such a page else omit" asks for.

   Each card's body is Rapid Construct's OWN existing teaser for the page it opens.
   The source's third body reads "produse în atelier propriu", an own-workshop
   claim, and is held. */
const CROSS_SELL = [
  { key: 'acoperisuri', service: 'acoperisuri', slot: 'COPX-01' },
  { key: 'garduri', product: 'garduri', slot: 'COPX-02' },
];
function copertineCrossSell(l) {
  const s = (k) => {
    const v = l.strings[`copHero.${k}`];
    if (!REAL(v)) die(`copHero.${k} must be real in ${l.code}.`);
    return esc(v);
  };
  const arrow = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 5 16 12 9 19"></polyline></svg>';
  const cards = CROSS_SELL.map((c, i) => {
    let href, title, body;
    if (c.service) {
      const si = SERVICE_SLUGS.indexOf(c.service);
      if (si < 0) die(`cross-sell: "${c.service}" is not a service page.`);
      href = `${BASE}${SERVICES_ROOT[l.code]}${c.service}/`;
      title = l.strings[`services.items.${si}.title`];
      body = l.strings[`services.items.${si}.desc`];
    } else {
      const p = PRODUCT_PAGES.find((x) => x.slug === c.product);
      if (!p) die(`cross-sell: "${c.product}" is not a product page.`);
      href = `${BASE}${SERVICES_ROOT[l.code]}${p.slug}/`;
      title = l.strings[`pages.${p.key}.title`];
      body = l.strings[`pages.${p.key}.teaser`];
    }
    if (!REAL(title) || !REAL(body)) die(`cross-sell card ${i} has no real title or body for ${l.code}.`);
    return `      <a class="xsell" href="${href}" data-reveal data-stagger="${i}">
        <div class="xsell__media">${placeholder(c.slot, { variant: 'light', className: 'xsell__ph', locale: l.code })}</div>
        <div class="xsell__body">
          <h3 class="xsell__title">${esc(title)}</h3>
          <p class="xsell__text">${esc(body)}</p>
          <span class="xsell__more">${s('crossLink')}${arrow}</span>
        </div>
      </a>`;
  }).join('\n');
  return `<section class="section section--light section--divided" id="alte-materiale" aria-labelledby="alte-materiale-h">
  <div class="container">
    <h2 id="alte-materiale-h" data-reveal>${s('crossH2')}</h2>
    <div class="xsell-row">
${cards}
    </div>
  </div>
</section>
`;
}

/* W26-12, ruling W26-R14: THE GALLERIES. One per owner folder whose name is a page's
   title, read from content/galleries.json, which scripts/intake-galleries.js writes from
   the folders and nothing types. Gate 29 holds every page to it.

   WHAT A PAGE GETS. A service page with described projects gets ONE MORE CARD after them,
   "Deschide galeria", showing the photograph the ledger names as `preview`; a page with no
   project section gets a section holding that card alone; the fence gallery gets a page of
   its own (W26-R12), which shows every photograph as a grid. Every one of them opens the
   same component: a full-screen lightbox holding all the folder's photographs.

   THE LIGHTBOX IS A HORIZONTAL SCROLLER, and that is what makes it respect the motion rule
   (docs/CLAUDE.md section 1) rather than fight it. Swipe is the browser's own touch
   scrolling of a scroll-snap track, so there is no touch handler at all and nothing can
   capture or delay a gesture. The buttons and the arrow keys scroll the same track, smoothly
   only when reduced motion is off. The images carry real `src` and `loading="lazy"` inside a
   container that is `hidden` until opened, so none of them costs a byte on page load.

   NO CAPTIONS, per the ruling. Each image still has alt text, which is not a caption: the
   page's title and the photograph's place in the set, so a screen reader hears where it is.
   The images are the owner's own, stripped by the intake; the palette is --bg-dark and
   --bg-light, no new colour. Prefixes `.gal-` and `.lbx-` grepped free (3.1). */
const GALLERY_FILE = 'content/galleries.json';
const galNeed = (v, where) => { if (!REAL(v)) die(`gallery: ${where} is not real.`); return v; };
const GALLERIES = JSON.parse(fs.readFileSync(GALLERY_FILE, 'utf8'));
if (!Array.isArray(GALLERIES.galleries)) die(`${GALLERY_FILE} has no "galleries" array.`);
GALLERIES.galleries.forEach((g, i) => {
  const where = `${GALLERY_FILE}: galleries[${i}] (${g.folder})`;
  if (!Array.isArray(g.photos) || !g.photos.length) die(`${where} has no photographs. An empty folder is listed under empty_folders, never as a gallery.`);
  if (!Number.isInteger(g.preview) || g.preview < 1 || g.preview > g.photos.length) die(`${where}: preview ${g.preview} is not one of its ${g.photos.length} photographs.`);
  for (const p of g.photos) {
    for (const f of [p.full, p.thumb]) if (!fs.existsSync(f)) die(`${where}: ${f} does not exist. Run scripts/intake-galleries.js --apply.`);
  }
});
const galleryFor = (slug) => GALLERIES.galleries.find((g) => g.render_on === slug) || null;

function galleryAlt(l, title, i, n) {
  const t = l.strings['gallery.alt'];
  if (!REAL(t) || !t.includes('{title}') || !t.includes('{i}') || !t.includes('{n}')) die(`gallery.alt for ${l.code} needs {title}, {i} and {n}.`);
  return t.replace('{title}', title).replace('{i}', String(i)).replace('{n}', String(n));
}

/* The lightbox, once per gallery per page. */
function galleryLightbox(l, g, title) {
  const s = (k) => esc(galNeed(l.strings[`gallery.${k}`], `gallery.${k}`));
  const n = g.photos.length;
  const slides = g.photos.map((p, i) => {
    const [w, h] = String(p.size).split('x').map(Number);
    return `        <li class="lbx__slide"><img src="${BASE}/${esc(p.full.replace(/^public\//, ''))}" alt="${esc(galleryAlt(l, title, i + 1, n))}" width="${w}" height="${h}" loading="lazy" decoding="async"></li>`;
  }).join('\n');
  const chevron = (pts) => `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="${pts}"></polyline></svg>`;
  return `<div class="lbx" id="lbx-${esc(g.render_on)}" data-gal-box data-gal-count="${n}" role="dialog" aria-modal="true" aria-label="${s('dialogAria')}: ${esc(title)}" hidden>
  <div class="lbx__bar">
    <p class="lbx__count" aria-live="polite">1 / ${n}</p>
    <button class="lbx__close" type="button" aria-label="${s('close')}"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18"></line><line x1="18" y1="6" x2="6" y2="18"></line></svg></button>
  </div>
  <ul class="lbx__track" tabindex="0" aria-label="${s('trackAria')}">
${slides}
  </ul>
  <button class="lbx__nav lbx__nav--prev" type="button" aria-label="${s('prev')}">${chevron('15 6 9 12 15 18')}</button>
  <button class="lbx__nav lbx__nav--next" type="button" aria-label="${s('next')}">${chevron('9 6 15 12 9 18')}</button>
</div>`;
}

/* The card. It is a link to the lightbox's own id, so without JavaScript it is a
   fragment that resolves (check-links holds that) and with it main.js opens the
   lightbox at `data-gal-index`. Its accessible name says which gallery it opens,
   because "Deschide galeria" alone, twice on no page but repeated site-wide,
   would not tell a screen reader whose. */
function galleryCard(l, g, title, stagger) {
  const p = g.photos[g.preview - 1];
  const [w, h] = String(p.thumb_size).split('x').map(Number);
  const aria = galNeed(l.strings['gallery.cardAria'], 'gallery.cardAria');
  if (!aria.includes('{title}')) die(`gallery.cardAria for ${l.code} needs {title}.`);
  return `      <a class="card gal-card" href="#lbx-${esc(g.render_on)}" data-gal-open="lbx-${esc(g.render_on)}" data-gal-index="${g.preview - 1}" aria-haspopup="dialog" aria-label="${esc(aria.replace('{title}', title))}" data-reveal data-stagger="${Math.min(stagger, 6)}">
        <div class="media media--4x3 media--card gal-card__media"><img src="${BASE}/${esc(p.thumb.replace(/^public\//, ''))}" alt="" width="${w}" height="${h}" loading="lazy" decoding="async"></div>
        <div class="card__body"><h3>${esc(galNeed(l.strings['gallery.open'], 'gallery.open'))}</h3></div>
      </a>`;
}

/* A page with no project section gets its gallery card in a section of its own. */
function gallerySectionAlone(l, slug, title) {
  const g = galleryFor(slug);
  if (!g) return '';
  return `<section class="section section--light section--divided" id="galerie" aria-labelledby="galerie-h">
  <div class="container">
    <h2 id="galerie-h" data-reveal>${esc(galNeed(l.strings['gallery.sectionH'], 'gallery.sectionH'))}</h2>
    <div class="grid grid--3" style="margin-top: 40px;">
${galleryCard(l, g, title, 0)}
    </div>
  </div>
</section>
${galleryLightbox(l, g, title)}`;
}

/* W26-12, ruling W26-R12: the fence gallery's own page. Every photograph is on it as a
   thumbnail in the page's reading order, and each opens the lightbox at itself. */
function galleryPage(l, slug) {
  const g = galleryFor(slug);
  if (!g) die(`the gallery page /servicii/${slug}/ has no gallery in ${GALLERY_FILE}.`);
  const title = galNeed(l.strings['pages.galerieGarduri.title'], 'pages.galerieGarduri.title');
  const items = g.photos.map((p, i) => {
    const [w, h] = String(p.thumb_size).split('x').map(Number);
    return `      <li><a class="gal-grid__item" href="#lbx-${esc(g.render_on)}" data-gal-open="lbx-${esc(g.render_on)}" data-gal-index="${i}" aria-haspopup="dialog"><img src="${BASE}/${esc(p.thumb.replace(/^public\//, ''))}" alt="${esc(galleryAlt(l, title, i + 1, g.photos.length))}" width="${w}" height="${h}" loading="${i < 6 ? 'eager' : 'lazy'}" decoding="async"></a></li>`;
  }).join('\n');
  return `<section class="section section--light section--divided" id="galerie" aria-labelledby="galerie-h">
  <div class="container">
    <h2 id="galerie-h" class="sr-only">${esc(galNeed(l.strings['gallery.gridAria'], 'gallery.gridAria'))}</h2>
    <ul class="gal-grid" data-gal-grid>
${items}
    </ul>
  </div>
</section>
${galleryLightbox(l, g, title)}`;
}

const PRODUCT_PAGES = [
  { slug: 'tigla-metalica', key: 'tigla', parent: 'acoperisuri', block: (l) => tiglaGrid(l), sources: ['content/tigla-metalica.json'] },
  { slug: 'roca-vulcanica', key: 'novatik', parent: 'acoperisuri', block: (l) => novatikPage(l), sources: ['content/novatik.json'] },
  { slug: 'copertine', key: 'copertine', block: (l) => copertine(l), sources: ['content/copertine.json'] },
  { slug: 'garduri', key: 'garduri', block: (l) => gardPage(l), faqSchema: (l) => gardFaqSchema(l), sources: [] },
  { slug: 'modele-garduri', key: 'gardModele', parent: 'garduri', block: (l) => gardModelePage(l), sources: ['content/garduri-modele.json'] },
  /* W26-12, ruling W26-R12: the fence gallery, a page of its own that the Garduri hub's
     "Garduri tip jaluzele" tile opens. `formless`: a gallery is not a kind of work, so it
     is not an option in the quote form's "Tip lucrări"; it IS in the mobile menu, which
     lists every product page so none is unreachable on a phone (F-02). */
  { slug: 'galerie-garduri', key: 'galerieGarduri', parent: 'garduri', block: (l) => galleryPage(l, 'galerie-garduri'), sources: ['content/galleries.json'], formless: true },
];
const TOP_LEVEL_PRODUCT_PAGES = PRODUCT_PAGES.filter((p) => !p.parent);
/* The title of a page another page is a child of, from whichever list holds it. */
function parentTitle(l, slug) {
  const i = SERVICE_SLUGS.indexOf(slug);
  if (i >= 0) return l.strings[`services.items.${i}.title`];
  const p = PRODUCT_PAGES.find((x) => x.slug === slug);
  if (!p) die(`parentTitle: "${slug}" is neither a service nor a product page.`);
  return l.strings[`pages.${p.key}.title`];
}
(() => {
  /* AMENDED (W24-08): a parent may be a service page OR another product page.
     Modele de garduri is a child of the garduri page, which is itself a product
     page, so the chain is two deep and the breadcrumb reads
     Acasă / Garduri / Modele de garduri. A parent that is itself parented would
     make it three, which the breadcrumb has no room for and nothing needs. */
  const isService = (s) => SERVICE_SLUGS.includes(s);
  const isProduct = (s) => PRODUCT_PAGES.some((p) => p.slug === s);
  const bad = PRODUCT_PAGES.filter((p) => p.parent && !isService(p.parent) && !isProduct(p.parent));
  if (bad.length) die(`product page parent is neither a service nor a product page: ${bad.map((p) => p.slug + ' -> ' + p.parent).join(', ')}`);
  const deep = PRODUCT_PAGES.filter((p) => p.parent && isProduct(p.parent)
    && PRODUCT_PAGES.find((x) => x.slug === p.parent).parent);
  if (deep.length) die(`product page parent is itself parented, which would be three levels: ${deep.map((p) => p.slug).join(', ')}`);
  if (TOP_LEVEL_PRODUCT_PAGES.length === PRODUCT_PAGES.length) die('W24-06 makes one product page a child; none is marked.');
})();
/* W16-02. Deferred to here on purpose: PRODUCT_PAGES is declared immediately
   above, so this check cannot live in the CATEGORIES block, which evaluates
   earlier and would read it in its temporal dead zone. A category slug that
   collided with a product or service slug would write one page over another
   silently, so the check is kept rather than dropped. */
(() => {
  const collide = CATEGORIES.filter((c) => SERVICE_SLUGS.includes(c.slug) || PRODUCT_PAGES.some((p) => p.slug === c.slug));
  if (collide.length) die(`category slug collides with a service or product slug: ${collide.map((c) => c.slug).join(', ')}`);
})();
const PROD_RAW_KEYS = new Set(['mobileProducts', 'catalogMenu', 'serviciiMenu',
  'demoAttr', 'promoBar', 'areaServedJson', 'privacyLinkOpen', 'privacyLinkClose', 'privacyFooterLegal',
  'prod.block', 'prod.footerLinks', 'prod.faqSchema',
  // W24-08. The garduri bento, and the copertine hero and cross-sell row.
  'prod.bento', 'prod.hero', 'prod.crossSell', 'prod.heroHidden',
  // W24-06. Three levels on a parented product page, two on the others.
  'prod.breadcrumb',
]);
const productTemplate = fs.readFileSync('src/product.html', 'utf8');
const CAT_RAW_KEYS = new Set(['mobileProducts', 'catalogMenu', 'serviciiMenu',
  'demoAttr', 'promoBar', 'privacyLinkOpen', 'privacyLinkClose', 'privacyFooterLegal',
  'cat.block', 'cat.products', 'cat.footerLinks',
  // W24-04. Built here because a parent page and a subcategory page differ in
  // both: a parent has three breadcrumb levels and an authored lede, a
  // subcategory has four and none.
  'cat.breadcrumb', 'cat.ledeBlock',
  // W24-04. The catalogue index's seven tiles.
  'cat.tiles',
]);
const categoryTemplate = fs.readFileSync('src/category.html', 'utf8');
/* W25-19. The redirect page the eight roofing catalogue URLs become. */
const movedTemplate = fs.readFileSync('src/moved.html', 'utf8');
const catalogIndexTemplate = fs.readFileSync('src/catalog-index.html', 'utf8');
const inConstructieTemplate = fs.readFileSync('src/in-constructie.html', 'utf8');
/* W24-06. The shared "not yet" page the calculate-a-price tiles land on. */
const IN_CONSTRUCTIE = { ro: '/in-constructie/', ru: '/ru/in-constructie/' };
const CAT_SOURCES = ['src/category.html', 'build.js', CATALOG_FILE, 'content/catalog-products.json', ...LOCALES.map((l) => l.file)];
const PROD_SOURCES = ['src/product.html', 'build.js', ...LOCALES.map((l) => l.file)];

function productTeaser(l) {
  const t = (k) => esc(l.strings[`pages.${k}`]);
  const arrow = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
  /* W24-06. The first teaser was ȚIGLĂ METALICĂ and is now ACOPERIȘURI, opening
     the roofing service page. The tile page became a child of it, so a teaser
     that skipped the parent and went straight to one of its children was the
     wrong door; and the four roofing offers moved to that page in the same card,
     so the teaser now leads somewhere that has something to show.

     NO COPY IS INVENTED (docs/CLAUDE.md section 5). The title and the line are
     the service's own shipped strings, services.items.N.title and .desc, which
     the homepage services grid already prints. */
  /* AMENDED (W25-23): the Acoperisuri card is GONE from this strip, and the two
     that remain are the two TOP-LEVEL PRODUCT PAGES, which is what the strip was
     for before a service card was put in front of them.

     It was there because the roofing service page had nothing else pointing at it
     from the homepage. It has since: the homepage services grid carries
     Acoperisuri like every other service, the header's Servicii panel lists it,
     and W25-19 made that page the home of the whole roofing catalogue, which the
     /catalog/ roofing tile and the catalogue menu now both open. Three routes,
     none of them this card. A fourth that duplicates the services grid one row
     above it is a strip that says the same thing twice.

     THE COUNT IS ASSERTED AGAINST THE LIST, not against a number. `expected` is
     TOP_LEVEL_PRODUCT_PAGES.length, so a third top-level product page reaches
     this strip without an edit here, and a page dropped from that list cannot
     leave a silent gap. Writing `!== 2` would have been the same defect this
     repo has already met twice: a count remembered instead of derived. */
  const need = (v, where) => { if (!REAL(v)) die(`productTeaser: ${where} is not real for ${l.code}.`); return v; };
  void need;
  const tiles = TOP_LEVEL_PRODUCT_PAGES.map((p) => ({
    href: `${BASE}${SERVICES_ROOT[l.code]}${p.slug}/`,
    title: t(`${p.key}.title`),
    line: t(`${p.key}.teaser`),
  }));
  if (tiles.length !== TOP_LEVEL_PRODUCT_PAGES.length || !tiles.length) {
    die(`productTeaser: ${tiles.length} tiles for ${TOP_LEVEL_PRODUCT_PAGES.length} top-level product page(s).`);
  }
  const items = tiles.map((x, i) => `      <a class="teaser" href="${x.href}" data-reveal data-stagger="${i}">
        <h3 class="teaser__title">${x.title}</h3>
        <p class="teaser__line">${x.line}</p>
        <span class="teaser__more">${esc(l.strings['services.linkLabel'])}${arrow}</span>
      </a>`).join('\n');
  return `<section class="section section--light section--divided section--teaser" aria-label="${t('teaserAria')}">
  <div class="container">
    <div class="teasers">
${items}
    </div>
  </div>
</section>
`;
}

function productHeadVars(l, p) {
  const title = l.strings[`pages.${p.key}.title`];
  const lede = l.strings[`pages.${p.key}.lede`];
  const inCity = l.code === 'ro' ? ` în ${PRIMARY_CITY.ro}` : ` в ${PRIMARY_CITY.ru}`;
  const metaTitle = [title + inCity + BRAND, title + BRAND, title].find((c) => c.length <= TITLE_MAX) || title;
  const withCoverage = `${lede} ${coverageLine(l)}`;
  const metaDesc = withCoverage.length <= DESC_MAX ? withCoverage : lede;
  if (/\bundefined\b/.test(metaDesc)) die(`meta description for ${p.slug} (${l.code}) contains "undefined"`);
  return { metaTitle, metaDesc };
}

// --- W12-01, the portfolio end tile -----------------------------------------

/* The seventh cell of the homepage portfolio grid. It is not a project and not
   a link: no href, no tabindex, nothing focusable inside it. Filters ignore it
   because it does not carry the `project` class that `main.js` selects on, so
   it stays put while the six cards above it come and go.

   Accessibility: it is LABELLED, not hidden. The tile carries a real fact, and
   hiding the whole thing behind aria-hidden would tell a sighted visitor
   something a screen-reader user never hears. Only the big numeral is hidden,
   because "100+" is a visual restatement of the sentence below it; without that
   the tile would announce as "100+ and over 100 other completed projects". What
   is read is the one sentence, exactly as printed. See DECISIONS.md W12-01.

   The 100+ figure is not invented. `stats.0` has claimed "500+ proiecte
   finalizate" since wave 1, and six shown plus a hundred more is entailed by
   it, a strictly weaker claim than the one already on the page. */
function portfolioEndTile(l) {
  const n = l.strings['portfolio.more.n'];
  const line = l.strings['portfolio.more.line'];
  if (!REAL(n) || !REAL(line)) return '';
  return `      <div class="card card--more">
        <p class="more__n" aria-hidden="true">${esc(n)}</p>
        <p class="more__line">${esc(line)}</p>
      </div>`;
}

// A project is renderable only when the two fields it cannot do without are
// real. The other seven are optional and drop out individually.
function renderableProjects(l, slug) {
  return PROJECTS.filter((p) => p.service === slug
    && REAL(p.title[l.code]) && REAL(p.summary[l.code]));
}

// Has a real photograph landed in this slot? gen-placeholders records the byte
// size of every file it writes; a file whose size no longer matches that ledger
// is a real photo someone dropped in. Two things read this: the indexability
// gate on the service pages, and the per-slot fallback below.
const PLACEHOLDER_LEDGER = (() => {
  const f = 'public/img/PLACEHOLDERS.json';
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {};
})();
function slotHasRealPhoto(id) {
  const file = `public/img/${id}.jpg`;
  if (!fs.existsSync(file)) return false;
  const recorded = PLACEHOLDER_LEDGER[id];
  return recorded === undefined || recorded !== fs.statSync(file).size;
}
const coverIsRealPhoto = slotHasRealPhoto;

// W6-03: hero-panel and the nine service illustrations are photo slots whose
// fallback is an SVG. The decision is per slot, never global: the first service
// to get a jpg renders a photo while the other eight still render SVGs.
const FALLBACK_SLOTS = ['hero-panel', ...SERVICE_SLUGS.map((sg) => SLOT_FOR_SLUG[sg])];
const onFallback = (id) => !slotHasRealPhoto(id);

// The hero panel box. 4:3 either way, so the box never changes size.
function heroPanelMedia(l, base) {
  const alt = esc(l.strings['hero.panelAlt']);
  if (onFallback('hero-panel')) {
    return `<div class="hero-panel-media media media--4x3">
        <img src="${base}/img/hero-panel.svg" alt="${alt}" width="800" height="600" loading="lazy" decoding="async">
      </div>`;
  }
  // A real hero photograph is the likely LCP element, so it is not lazy.
  return `<div class="hero-panel-media hero-panel-media--photo media media--4x3">
        <img src="${base}/img/hero-panel.jpg" srcset="${base}/img/hero-panel.jpg 1x, ${base}/img/hero-panel@2x.jpg 2x" alt="${alt}" width="1400" height="1050" decoding="async" fetchpriority="high">
      </div>`;
}

// One service card's media box. `variant` picks the two places it is used:
// the homepage 3x3 grid, where the card is far below the fold and lazy is
// right, and the hero of the service page itself, where the image sits beside
// the h1 and is the LCP candidate, so it must not be lazy.
function serviceMedia(l, base, i, variant) {
  const hero = variant === 'hero';
  const slot = SLOT_FOR_SLUG[SERVICE_SLUGS[i]];
  const alt = esc(l.strings[`services.items.${i}.alt`]);
  const load = hero ? '' : ' loading="lazy"';
  if (onFallback(slot)) {
    const box = hero ? 'svc-hero__art media media--4x3' : 'media media--illustration';
    return `<div class="${box}"><img src="${base}/img/services/${slot}.svg" alt="${alt}" width="400" height="300"${load} decoding="async"></div>`;
  }
  const box = hero ? 'svc-hero__art svc-hero__art--photo media media--4x3' : 'media media--4x3 media--card';
  const prio = hero ? ' fetchpriority="high"' : '';
  return `<div class="${box}"><img src="${base}/img/${slot}.jpg" srcset="${base}/img/${slot}.jpg 1x, ${base}/img/${slot}@2x.jpg 2x" alt="${alt}" width="800" height="600"${load} decoding="async"${prio}></div>`;
}

// A renderable project always points at a cover file that exists. Stub covers
// get no placeholder, so filling in a title without either dropping a photo or
// re-running gen-placeholders would ship a broken <img>. Caught here instead.
function assertCoversExist() {
  const missing = [...new Set(loaded.flatMap((l) => SERVICE_SLUGS
    .flatMap((slug) => renderableProjects(l, slug))
    .filter((p) => !fs.existsSync(`public/img/${p.cover}.jpg`))
    .map((p) => p.cover)))];
  if (missing.length) {
    die(`${missing.length} renderable project(s) have no cover file:\n` +
      missing.map((c) => `  · public/img/${c}.jpg`).join('\n') +
      '\n\n  Drop the real photo in, or run: node scripts/gen-placeholders.js');
  }
}
assertCoversExist();

function renderGallerySection(l, slug, vars) {
  const mine = renderableProjects(l, slug);
  /* W26-12: a folder of the owner's photographs adds one card after the described
     projects, and the section renders for it even with no project to describe. */
  const gal = galleryFor(slug);
  if (!mine.length && !gal) return '';  // section, heading and all, simply absent
  const svcTitle = gal ? galNeed(l.strings[`services.items.${SERVICE_SLUGS.indexOf(slug)}.title`], `services.items (${slug}).title`) : null;
  const cards = mine.map((p, i) => {
    // Short facts as chips, in reading order. Each is omitted on its own.
    const chip = (v) => `<span class="review__tag">${esc(v)}</span>`;
    const meta = [];
    if (REAL(p.location[l.code])) meta.push(chip(p.location[l.code]));
    if (REAL(String(p.year))) meta.push(chip(String(p.year)));
    if (REAL(p.work_type[l.code])) meta.push(chip(p.work_type[l.code]));
    if (REAL(String(p.area_sqm))) meta.push(chip(`${String(p.area_sqm).trim()} m²`));
    if (REAL(p.duration[l.code])) meta.push(chip(p.duration[l.code]));
    // Two facts too long to be chips. Same rule: absent when empty.
    const fact = (label, v) => REAL(v)
      ? `<p class="project__fact"><span>${esc(l.strings[label])}</span> ${esc(v)}</p>` : '';
    const facts = fact('projectMeta.materials', p.main_materials[l.code])
                + fact('projectMeta.challenge', p.challenge[l.code]);
    return `      <article class="card project" id="project-${p.id}" data-reveal data-stagger="${Math.min(i, 6)}">
        <div class="media media--4x3 media--card"><img src="${vars.base}/img/${p.cover}.jpg" srcset="${vars.base}/img/${p.cover}.jpg 1x, ${vars.base}/img/${p.cover}@2x.jpg 2x" alt="${esc(p.title[l.code])}" width="400" height="300" loading="lazy" decoding="async"></div>
        <div class="card__body">
          <h3>${esc(p.title[l.code])}</h3>
          <p class="project__desc">${esc(p.summary[l.code])}</p>
          ${meta.length ? `<span class="review__tags">${meta.join('')}</span>` : ''}
          ${facts}
        </div>
      </article>`;
  }).join('\n');
  return `<section class="section section--light section--divided" id="proiecte">
  <div class="container">
    <p class="eyebrow" data-reveal>${esc(l.strings['servicePage.galleryH'])}</p>
    <h2 data-reveal>${esc(l.strings['portfolio.h2'])}</h2>
    <div class="grid grid--3" style="margin-top: 40px;">
${cards}${gal ? '\n' + galleryCard(l, gal, svcTitle, mine.length) : ''}
    </div>
  </div>
</section>${gal ? '\n' + galleryLightbox(l, gal, svcTitle) : ''}`;
}

for (const l of loaded) {
  const vars = {
    ...l.strings,
    formEndpoint: FORM_ENDPOINT,
    formArmed: FORM_ARMED ? '1' : '0',
    // With no key the form must not post anywhere: it validates, then says so.
    formAction: FORM_ARMED ? FORM_ENDPOINT_URL : '#oferta',
    base: BASE,
    buildSha: BUILD_SHA,
    homeHref: BASE + l.home,
    hrefRo: BASE + '/',
    hrefRu: BASE + '/ru/',
    canonical: SITE + BASE + l.home,
    ogUrl: SITE + BASE + l.home,
    ogImage: SITE + BASE + '/img/og-image.jpg',
    urlRo: SITE + BASE + '/',
    urlRu: SITE + BASE + '/ru/',
    logoUrl: SITE + BASE + '/logo-full.png',
    // W9-05. The subject line is the only thing that reaches Mihai's inbox
    // before he opens the mail, so it carries BOTH facts he needs to triage:
    // the locale, as an explicit [RO]/[RU] tag rather than "whichever alphabet
    // this is", and the exact page the lead came from. The path is written
    // without a host, because SITE_URL is the GitHub Pages origin today and the
    // production domain has not landed; a path is true under either.
    // The demo notice is not merely hidden when the key lands, it is not emitted
    // at all. A disarmed build carries the attribute, an armed build does not,
    // so "the notice is gone" is true of the HTML and not only of the screen.
    demoAttr: FORM_ARMED ? '' : ` data-demo="${esc(l.strings['form.demoNotice'])}"`,
    subjectMain: `[${l.code.toUpperCase()}] ${l.strings['form.h2']} - ${l.home}`,
    subjectPopup: `[${l.code.toUpperCase()}] ${l.strings['popup.h2']} - ${l.home}`,
    privacyHref: BASE + PRIVACY_PATH[l.code],
    /* W12-17. While the privacy page still carries TODO markers, nothing links
       to it. A visitor who followed the footer link read "TODO: denumirea
       juridică completă" in bold, which is worse than no policy page: it
       advertises that the operator is undeclared.

       Gated on privacyIncomplete, the SAME flag that already sets noindex and
       excludes the page from the sitemap. That makes the reversal exactly one
       change: fill privacy.opName and privacy.opIdno in both locale files and
       the links, the footer entry, the indexability and the sitemap entry all
       come back together. No markup edit, no second switch to remember.

       The pages themselves stay published and reachable by typing the URL, so
       nothing 404s and no existing link outside our control breaks. */
    privacyLinkOpen: privacyIncomplete ? '' : `<a href="${BASE + PRIVACY_PATH[l.code]}">`,
    privacyLinkClose: privacyIncomplete ? '' : '</a>',
    // The footer entry is the link and nothing else, so an unlinked label would
    // be a dead word in the legal row. The whole element is omitted rather than
    // hidden: `hidden` keeps the href in the HTML, where a crawler can still
    // follow it to a page advertising that the operator is undeclared.
    privacyFooterLegal: privacyIncomplete ? ''
      : `<div class="footer__legal"><a href="${BASE + PRIVACY_PATH[l.code]}">${esc(l.strings['footer.privacy'])}</a></div>`,
    servicesHref: BASE + l.home + '#servicii',
    // W24-04. The catalogue index. It is a real page now, so the footer and the
    // phone menu can reach it; before this card the root of the catalogue was the
    // one thing on the site nothing linked to, because nothing was there.
    catalogHref: BASE + CATALOG_ROOT[l.code],
    /* W24-08, finding F-02. Every product page is in the phone menu. Four of the
       five were reachable on a phone only through the Servicii panel, and
       W24-06 took the tile page out of that panel's top level, so on a phone it
       had become reachable from the acoperisuri page alone. A page in the sitemap
       that a phone cannot navigate to is the defect F-02 names.
       The count is asserted, not assumed: every product page this build emits has
       a row, so a page added later is in the menu or the build fails. */
    mobileProducts: (() => {
      const rows = PRODUCT_PAGES.map((p) => {
        const title = l.strings[`pages.${p.key}.title`];
        if (!REAL(title)) die(`mobileProducts: pages.${p.key}.title is not real for ${l.code}.`);
        return `  <a class="mobile-nav-link mobile-nav-link--sub" href="${BASE}${SERVICES_ROOT[l.code]}${p.slug}/">${esc(title)}</a>`;
      });
      if (rows.length !== PRODUCT_PAGES.length) die(`mobileProducts: ${rows.length} rows for ${PRODUCT_PAGES.length} product pages.`);
      return rows.join('\n');
    })(),
    // JSON-LD `item` must be an absolute URL. servicesHref is a path, correct
    // for an <a href> and invalid inside the BreadcrumbList.
    servicesUrl: SITE + BASE + l.home + '#servicii',
    portfolioHref: BASE + l.home + '#portofoliu',
    aboutHref: BASE + l.home + '#despre',
    contactHref: BASE + l.home + '#contacte',
    ...Object.fromEntries(SERVICE_SLUGS.map((sg, i) =>
      [`svcHref${i}`, BASE + SERVICES_ROOT[l.code] + sg + '/'])),
    privacyUrlRoPath: BASE + PRIVACY_PATH.ro,
    privacyUrlRuPath: BASE + PRIVACY_PATH.ru,
    privacyCanonical: SITE + BASE + PRIVACY_PATH[l.code],
    privacyUrlRo: SITE + BASE + PRIVACY_PATH.ro,
    privacyUrlRu: SITE + BASE + PRIVACY_PATH.ru,
    // The privacy page ships with TODO legal-identity fields. Until they are
    // filled it must not be indexed and must stay out of the sitemap.
    privacyRobots: privacyIncomplete ? 'noindex, nofollow' : 'index, follow',
    // With no URL the anchor is not rendered at all. href="#" was a dead link
    // and an <a> without href fails Lighthouse's crawlable-anchors audit, so
    // the whole element is conditional.
    /* W12-20, R-O. These two are still COMPUTED and deliberately not rendered.
       GOOGLE_REVIEWS_URL stays armed in the data layer so the value is present
       and correct the moment a ruling lets the anchor back; only the markup that
       consumed them was removed. Nothing else reads the variable: sameAs carries
       the profile URL as a literal in src/template.html, so the structured-data
       connection does not depend on this at all. */
    googleLink: GOOGLE_REVIEWS_URL
      ? `<a class="link-arrow" href="${GOOGLE_REVIEWS_URL}" target="_blank" rel="noopener noreferrer">${esc(l.strings['reviews.google'])}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>`
      : '',
    googleHidden: GOOGLE_REVIEWS_URL ? '' : 'hidden',
  };
  // Homepage portfolio: six cards straight off projects.json, each linking to
  // its project anchor on the relevant service page. Only projects with a real
  // title are shown; a TODO title must never reach the homepage.
  // W9-04 R-G. This was `.slice(0, 6)` over projects.json in file order, which
  // was six different services only by luck: five projects happened to sit in
  // five services. With thirty-four the first six are all `case-la-cheie`, and
  // the category chip under each card reads the same word six times. Take the
  // first renderable project of each service instead, in the order the services
  // grid uses, so the six cards are six services by construction.
  const featured = SERVICE_SLUGS
    .map((slug) => PROJECTS.find((p) => p.service === slug
      && REAL(p.title[l.code]) && REAL(p.summary[l.code])))
    .filter(Boolean)
    .slice(0, 6);
  vars.supplierChips = renderSupplierChips(l, BASE);
  vars.heroPanelMedia = heroPanelMedia(l, BASE);
  vars.promoBar = promoBar(l);
  vars.catalogMenu = catalogMenu(l);
  vars.serviciiMenu = serviciiMenu(l);
  vars.workTypeOptions = workTypeOptions(l);
  vars.notFoundLocale = notFoundLocale(l);
  vars.productTeaser = productTeaser(l);
  vars.socialRow = socialRow(l);
  // Overrides nothing: band.coverageLine is no longer a locale key, it is
  // composed here so the sentence and the schema cannot disagree.
  vars['band.coverageLine'] = coverageLine(l);
  vars.areaServedJson = areaServedJson(l, '    ');
  SERVICE_SLUGS.forEach((_, i) => { vars[`svcMedia${i}`] = serviceMedia(l, BASE, i, 'card'); });
  vars.portfolioFilters = portfolioFilters(l, featured);
  vars.portfolioCards = '<div class="grid grid--3" id="portfolio-grid">\n' +
    featured.map((p, i) => {
      const href = BASE + SERVICES_ROOT[l.code] + p.service + '/#project-' + p.id;
      const cat = l.strings[`services.items.${SERVICE_SLUGS.indexOf(p.service)}.title`];
      return `      <article class="card project" data-cat="${p.service}" data-reveal data-stagger="${Math.min(i, 6)}">
        <a href="${href}" class="project__link">
          <div class="media media--4x3 media--card project__media">
            <img src="${BASE}/img/${p.cover}.jpg" srcset="${BASE}/img/${p.cover}.jpg 1x, ${BASE}/img/${p.cover}@2x.jpg 2x" alt="${esc(p.title[l.code])}" width="400" height="300" loading="lazy" decoding="async">
            <span class="chip">${esc(cat)}</span>
          </div>
          <div class="card__body">
            <h3>${esc(p.title[l.code])}</h3>
            <p class="project__desc">${esc(p.summary[l.code])}</p>
          </div>
        </a>
      </article>`;
    }).join('\n') + '\n' + portfolioEndTile(l) + '\n    </div>';

  // --- 18 service pages -----------------------------------------------------
  for (let i = 0; i < SERVICE_SLUGS.length; i++) {
    const slug = SERVICE_SLUGS[i];
    const out = 'dist' + SERVICES_ROOT[l.code] + slug + '/index.html';
    const svcVars = {
      ...vars,
      'svc.title': l.strings[`services.items.${i}.title`],
      'svc.desc': l.strings[`services.items.${i}.desc`],
      'svc.alt': l.strings[`services.items.${i}.alt`],
      ...serviceHeadVars(l, slug, i),
      'svc.answer': svcAnswer(l, slug),
      'svc.table': svcTable(l, slug),
      'svc.faqSection': svcFaqSection(l, slug, lastmodOf(...SVC_SOURCES, ...coversFor(slug))),
      'svc.faqSchema': svcFaqSchema(l, slug),
      'svc.subject': `[${l.code.toUpperCase()}] ${l.strings['services.items.' + i + '.title']} - ${SERVICES_ROOT[l.code]}${slug}/`,
      'svc.canonical': SITE + BASE + SERVICES_ROOT[l.code] + slug + '/',
      'svc.urlRo': SITE + BASE + SERVICES_ROOT.ro + slug + '/',
      'svc.urlRu': SITE + BASE + SERVICES_ROOT.ru + slug + '/',
      'svc.pathRo': BASE + SERVICES_ROOT.ro + slug + '/',
      'svc.pathRu': BASE + SERVICES_ROOT.ru + slug + '/',
      // Indexable only when this service has at least one renderable project
      // whose cover is a real photograph rather than a generated placeholder.
      // Same shape as the privacy-page gate: it clears itself.
      'svc.robots': renderableProjects(l, slug).some((p) => coverIsRealPhoto(p.cover))
        ? 'index, follow' : 'noindex, nofollow',
    };
    svcVars['svc.media'] = serviceMedia(l, BASE, i, 'hero');
    /* W24-05. The slider goes on the case la cheie page and nowhere else, which
       is where the dispatch places it. It was on the homepage, where it had never
       rendered because the data was empty. */
    svcVars['svc.beforeAfter'] = slug === BEFORE_AFTER_SLUG ? beforeAfter(l) : '';
    /* W24-06. "Patru lucrări de acoperiș" was on the homepage. It is roofing, so
       it is on the roofing page. W24-07 puts the bento above it. */
    svcVars['svc.roofOffers'] = slug === ROOF_OFFERS_SLUG ? roofOffers(l) : '';
    /* W24-07. The bento is the FIRST section after the header on its page, which
       the dispatch is explicit about, so it renders above the hero block rather
       than below it. W24-08 adds the garduri one from the same table. */
    svcVars['svc.bento'] = BENTOS[slug] ? bentoSection(l, BENTOS[slug]) : '';
    /* W26-04, W26-R5. The product bento sits directly above the section its tiles
       filter, because a tile that presses a control the visitor cannot see when
       they land is a tile that appears to do nothing. */
    svcVars['svc.productBento'] = PRODUCT_BENTOS[slug] ? bentoSection(l, PRODUCT_BENTOS[slug]) : '';
    /* W25-19. The same one-page rule the roofing offers already follow. */
    svcVars['svc.roofProducts'] = slug === ROOF_OFFERS_SLUG ? roofSection(l) : '';
    svcVars['svc.gallerySection'] = renderGallerySection(l, slug, vars);
    svcVars['svc.footerLinks'] = SERVICE_SLUGS.slice(0, 6).map((sg, k) =>
      `<a href="${BASE}${SERVICES_ROOT[l.code]}${sg}/">${esc(l.strings[`services.items.${k}.title`])}</a>`).join('');

    const missing = new Set();
    const html = serviceTemplate.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (_, key) => {
      if (key in svcVars) {
        // pre-rendered HTML fragments must not be escaped again
        return SVC_RAW_KEYS.has(key) ? svcVars[key] : esc(svcVars[key]);
      }
      missing.add(key); return `{{${key}}}`;
    });
    if (missing.size) die(`src/service.html references unknown keys for ${l.code}/${slug}: ${[...missing].join(', ')}`);
    if (html.includes('{{')) die(`unsubstituted placeholder survived in ${out}`);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html);
    servicePages.push({ loc: SITE + BASE + SERVICES_ROOT[l.code] + slug + '/', lang: l.code });
  }

  // --- W24-06, the shared "in construcție" page ------------------------------
  {
    const out = 'dist' + IN_CONSTRUCTIE[l.code] + 'index.html';
    const title = l.strings['inConstructie.title'];
    for (const k of ['title', 'line', 'back']) {
      if (!REAL(l.strings[`inConstructie.${k}`])) die(`inConstructie.${k} must be real in ${l.code}.`);
    }
    const icVars = {
      ...vars,
      'ic.metaTitle': title + BRAND,
      'ic.metaDesc': l.strings['inConstructie.line'],
      'ic.canonical': SITE + BASE + IN_CONSTRUCTIE[l.code],
      'ic.urlRo': SITE + BASE + IN_CONSTRUCTIE.ro,
      'ic.urlRu': SITE + BASE + IN_CONSTRUCTIE.ru,
      'ic.pathRo': BASE + IN_CONSTRUCTIE.ro,
      'ic.pathRu': BASE + IN_CONSTRUCTIE.ru,
      'ic.footerLinks': SERVICE_SLUGS.slice(0, 6).map((sg, k) =>
        `<a href="${BASE}${SERVICES_ROOT[l.code]}${sg}/">${esc(l.strings[`services.items.${k}.title`])}</a>`).join(''),
    };
    const missing = new Set();
    const html = inConstructieTemplate.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (_, key) => {
      if (key in icVars) return CAT_RAW_KEYS.has(key) || key === 'ic.footerLinks' ? icVars[key] : esc(icVars[key]);
      missing.add(key); return `{{${key}}}`;
    });
    if (missing.size) die(`src/in-constructie.html references unknown keys for ${l.code}: ${[...missing].join(', ')}`);
    if (html.includes('{{')) die(`unsubstituted placeholder survived in ${out}`);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html);
  }

  // --- W24-04, the catalog index at /catalog/ -------------------------------
  {
    const out = 'dist' + CATALOG_ROOT[l.code] + 'index.html';
    const title = l.strings['catalogIndex.title'];
    if (!REAL(title)) die(`catalogIndex.title must be real in ${l.code}.`);
    const inCity = l.code === 'ro' ? ` în ${PRIMARY_CITY.ro}` : ` в ${PRIMARY_CITY.ru}`;
    /* The description is the seven category labels, which are data and not copy,
       trimmed to the same limit every other page's is. Nothing is invented for
       it and nothing is claimed by it. */
    /* AMENDED (W26-06): the listed categories only, the same set the tiles show. */
    const labels = PARENT_CATEGORIES.filter((c) => catalogListed(CATALOG.categories[c.i])).map((c) => categoryLabel(l, c)).join(', ');
    const idxVars = {
      ...vars,
      'cat.title': title,
      'cat.metaTitle': [title + inCity + BRAND, title + BRAND, title].find((s) => s.length <= TITLE_MAX) || title,
      'cat.metaDesc': [`${title}: ${labels}`, labels, title].find((s) => s.length <= DESC_MAX) || title,
      'cat.canonical': SITE + BASE + CATALOG_ROOT[l.code],
      'cat.urlRo': SITE + BASE + CATALOG_ROOT.ro,
      'cat.urlRu': SITE + BASE + CATALOG_ROOT.ru,
      'cat.pathRo': BASE + CATALOG_ROOT.ro,
      'cat.pathRu': BASE + CATALOG_ROOT.ru,
      'cat.subject': `[${l.code.toUpperCase()}] ${title} - ${CATALOG_ROOT[l.code]}`,
      'cat.tiles': catalogIndexTiles(l),
      'cat.footerLinks': SERVICE_SLUGS.slice(0, 6).map((sg, k) =>
        `<a href="${BASE}${SERVICES_ROOT[l.code]}${sg}/">${esc(l.strings[`services.items.${k}.title`])}</a>`).join(''),
    };
    const missing = new Set();
    const html = catalogIndexTemplate.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (_, key) => {
      if (key in idxVars) return CAT_RAW_KEYS.has(key) ? idxVars[key] : esc(idxVars[key]);
      missing.add(key); return `{{${key}}}`;
    });
    if (missing.size) die(`src/catalog-index.html references unknown keys for ${l.code}: ${[...missing].join(', ')}`);
    if (html.includes('{{')) die(`unsubstituted placeholder survived in ${out}`);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html);
  }

  // --- ~~W16-02, the seven catalog category pages~~ --------------------------
  // AMENDED (W24-04): fourteen, seven categories and seven subcategories, each
  // with a page of its own. F-03 was a subcategory menu row landing on the top of
  // its parent's page; it now opens its own.
  for (const c of CATEGORIES) {
    const out = 'dist' + CATALOG_ROOT[l.code] + c.slug + '/index.html';
    const head = categoryHeadVars(l, c);
    /* W25-19. The roofing category and its seven children are REDIRECT PAGES now.
       They keep their URLs and answer 200, and land on the matching filter in the
       consolidated section. The rest of this loop is untouched: a page that is
       not roofing is built exactly as it was. */
    if (ROOF_MOVED_ROUTES.has(c.slug)) {
      /* W26-04: a child's redirect aims at the SECTION it was folded into, not at
         its own slug, which is no longer a filter. The parent still aims at the
         "toate" button. */
      const child = c.parent == null ? null : c.slug.split('/')[1];
      const anchorFor = child === null ? ROOF_ALL : ROOF_GROUP_OF_CHILD.get(child);
      if (anchorFor === undefined) die(`${c.slug} is a moved roofing route with no section to redirect to.`);
      const target = BASE + ROOF_SECTION_PATH(l) + '#' + roofAnchor(anchorFor);
      const movedVars = {
        ...vars,
        'moved.target': target,
        'moved.canonical': SITE + BASE + ROOF_SECTION_PATH(l),
        'moved.eyebrow': head.title,
        'moved.metaTitle': head.metaTitle,
        'moved.metaDesc': head.metaDesc,
      };
      const missingMoved = new Set();
      const movedHtml = movedTemplate.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (_, key) => {
        if (key in movedVars) return MOVED_RAW_KEYS.has(key) ? movedVars[key] : esc(movedVars[key]);
        missingMoved.add(key); return `{{${key}}}`;
      });
      if (missingMoved.size) die(`src/moved.html references unknown keys for ${l.code}/${c.slug}: ${[...missingMoved].join(', ')}`);
      if (movedHtml.includes('{{')) die(`unsubstituted placeholder survived in ${out}`);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, movedHtml);
      continue;
    }
    const parent = c.parent == null ? null : PARENT_CATEGORIES.find((x) => x.slug === c.parent);
    if (c.parent != null && !parent) die(`${c.slug} names the parent ${c.parent}, which is not a category page.`);
    const crumb = (href, text) => `      <a href="${href}">${esc(text)}</a>\n      <span aria-hidden="true">/</span>`;
    const catVars = {
      ...vars,
      'cat.title': head.title,
      'cat.eyebrow': parent ? categoryLabel(l, parent) : l.strings['header.catalogHeading'],
      'cat.breadcrumb': [
        crumb(BASE + l.home, l.strings['servicePage.home']),
        crumb(BASE + CATALOG_ROOT[l.code], l.strings['header.catalog']),
        parent ? crumb(BASE + CATALOG_ROOT[l.code] + parent.slug + '/', categoryLabel(l, parent)) : '',
        `      <span aria-current="page">${esc(head.title)}</span>`,
      ].filter(Boolean).join('\n'),
      'cat.ledeBlock': c.parent != null ? ''
        : `<p class="hero__sub" data-cat-prose="lede" style="margin: 16px 0 0;">${esc(categoryProse(l, c).lede)}</p>`,
      'cat.metaTitle': head.metaTitle,
      'cat.metaDesc': head.metaDesc,
      'cat.canonical': SITE + BASE + CATALOG_ROOT[l.code] + c.slug + '/',
      'cat.urlRo': SITE + BASE + CATALOG_ROOT.ro + c.slug + '/',
      'cat.urlRu': SITE + BASE + CATALOG_ROOT.ru + c.slug + '/',
      'cat.pathRo': BASE + CATALOG_ROOT.ro + c.slug + '/',
      'cat.pathRu': BASE + CATALOG_ROOT.ru + c.slug + '/',
      'cat.subject': `[${l.code.toUpperCase()}] ${head.title} - ${CATALOG_ROOT[l.code]}${c.slug}/`,
      'cat.block': c.parent == null ? categoryBlock(l, c) : '',
      'cat.products': catalogProducts(l, c.slug),
      'cat.footerLinks': SERVICE_SLUGS.slice(0, 6).map((sg, k) =>
        `<a href="${BASE}${SERVICES_ROOT[l.code]}${sg}/">${esc(l.strings[`services.items.${k}.title`])}</a>`).join(''),
    };
    const missing = new Set();
    const html = categoryTemplate.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (_, key) => {
      if (key in catVars) return CAT_RAW_KEYS.has(key) ? catVars[key] : esc(catVars[key]);
      missing.add(key); return `{{${key}}}`;
    });
    if (missing.size) die(`src/category.html references unknown keys for ${l.code}/${c.slug}: ${[...missing].join(', ')}`);
    if (html.includes('{{')) die(`unsubstituted placeholder survived in ${out}`);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html);
  }

  // --- W14-16, the three product pages --------------------------------------
  for (const p of PRODUCT_PAGES) {
    const out = 'dist' + SERVICES_ROOT[l.code] + p.slug + '/index.html';
    const title = l.strings[`pages.${p.key}.title`];
    if (!REAL(title) || !REAL(l.strings[`pages.${p.key}.lede`])) die(`pages.${p.key}.title and .lede must be real in ${l.code}.`);
    const head = productHeadVars(l, p);
    const prodVars = {
      ...vars,
      'prod.title': title,
      /* W24-06. A parented product page reads Acasă / <parent> / <page>. The
         middle crumb is the parent SERVICE page, not the services overview, which
         is what makes the page a child of it rather than a sibling. */
      /* The middle crumb names the parent, whether that is a service page or
         another product page: W24-08 makes modele de garduri a child of the
         garduri product page. */
      'prod.breadcrumb': p.parent
        ? `      <a href="${BASE + l.home}">${esc(l.strings['servicePage.home'])}</a>\n      <span aria-hidden="true">/</span>\n      <a href="${BASE}${SERVICES_ROOT[l.code]}${p.parent}/">${esc(parentTitle(l, p.parent))}</a>\n      <span aria-hidden="true">/</span>\n      <span aria-current="page">${esc(title)}</span>`
        : `      <a href="${BASE + l.home}">${esc(l.strings['servicePage.home'])}</a>\n      <span aria-hidden="true">/</span>\n      <a href="${BASE + l.home}#servicii">${esc(l.strings['servicePage.all'])}</a>\n      <span aria-hidden="true">/</span>\n      <span aria-current="page">${esc(title)}</span>`,
      'prod.lede': l.strings[`pages.${p.key}.lede`],
      'prod.metaTitle': head.metaTitle,
      'prod.metaDesc': head.metaDesc,
      'prod.canonical': SITE + BASE + SERVICES_ROOT[l.code] + p.slug + '/',
      'prod.urlRo': SITE + BASE + SERVICES_ROOT.ro + p.slug + '/',
      'prod.urlRu': SITE + BASE + SERVICES_ROOT.ru + p.slug + '/',
      'prod.pathRo': BASE + SERVICES_ROOT.ro + p.slug + '/',
      'prod.pathRu': BASE + SERVICES_ROOT.ru + p.slug + '/',
      'prod.subject': `[${l.code.toUpperCase()}] ${title} - ${SERVICES_ROOT[l.code]}${p.slug}/`,
      'prod.block': p.block(l),
      /* W24-08. The garduri bento is the first section after the header on its
         page; the copertine hero replaces that page's standard hero and its
         cross-sell row closes the page. Empty on every other product page. */
      'prod.bento': BENTOS[p.slug] ? bentoSection(l, BENTOS[p.slug]) : '',
      'prod.hero': p.slug === 'copertine' ? copertineHero(l) : '',
      'prod.crossSell': p.slug === 'copertine' ? copertineCrossSell(l) : '',
      /* A page with its own hero does not also render the standard one. The
         attribute is hidden rather than the section being removed from the
         template, so the two heroes stay side by side in one file and a reader
         can see that exactly one of them shows. */
      'prod.heroHidden': p.slug === 'copertine' ? ' hidden' : '',
      'prod.faqSchema': p.faqSchema ? p.faqSchema(l) : '',
      'prod.footerLinks': SERVICE_SLUGS.slice(0, 6).map((sg, k) =>
        `<a href="${BASE}${SERVICES_ROOT[l.code]}${sg}/">${esc(l.strings[`services.items.${k}.title`])}</a>`).join(''),
    };
    const missing = new Set();
    const html = productTemplate.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (_, key) => {
      if (!(key in prodVars)) { missing.add(key); return `{{${key}}}`; }
      return PROD_RAW_KEYS.has(key) ? prodVars[key] : esc(prodVars[key]);
    });
    if (missing.size) die(`src/product.html references unknown keys for ${l.code}/${p.slug}: ${[...missing].join(', ')}`);
    if (html.includes('{{')) die(`unsubstituted placeholder survived in ${out}`);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html);
    console.log(`wrote ${out}  (${(html.length / 1024).toFixed(1)} KB)`);
  }

  for (const page of PAGES) {
    const template = fs.readFileSync(page.template, 'utf8');
    const out = page.out(l);
    const missing = new Set();
    const html = template.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (_, key) => {
      if (!(key in vars)) { missing.add(key); return `{{${key}}}`; }
      return RAW_KEYS.has(key) ? vars[key] : esc(vars[key]);
    });
    if (missing.size) die(`${page.template} references unknown keys for locale ${l.code}: ${[...missing].join(', ')}`);
    if (html.includes('{{')) die(`unsubstituted placeholder survived in ${out}`);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html);
    console.log(`wrote ${out}  (${(html.length / 1024).toFixed(1)} KB)`);
  }
}

// --- static assets ------------------------------------------------------------

/* robots.txt. The six answer engines are named and allowed EXPLICITLY, not left
   to `User-agent: *`.

   `Allow: /` under `*` already permits them, so this block changes no crawler's
   behaviour. It is here as a statement of intent that survives someone later
   tightening the wildcard: blocking these is the same as deciding the site may
   not be cited in an AI answer, and that decision should have to be made on
   purpose rather than as a side effect. Google-Extended is the odd one out --
   it governs Gemini and AI Overviews grounding only, never Google Search
   ranking, so allowing it costs nothing in ordinary search either way. */
const AI_AGENTS = ['GPTBot', 'OAI-SearchBot', 'PerplexityBot', 'ClaudeBot', 'Google-Extended', 'CCBot'];
/* W24-09. `/review/` is the internal photo-review page. It already carries
   `noindex, nofollow` and it has never been in the sitemap, so nothing indexes
   it; this stops it being CRAWLED as well, which is a different thing. The page
   itself stays: the owner reviews held photographs on it.

   THE LINE IS REPEATED IN EVERY GROUP, and that repetition is the whole point. A
   robots.txt group is matched, not merged: a crawler that finds a group naming
   its own token obeys that group and ignores `User-agent: *` entirely. Putting
   Disallow only under `*` would therefore have left all six named answer engines
   with a bare `Allow: /` and free to crawl the page, which is the opposite of
   what this change is for. */
const DISALLOW = `${BASE}/review/`;
const group = (agent) => `User-agent: ${agent}\nAllow: /\nDisallow: ${DISALLOW}\n`;
fs.writeFileSync('dist/robots.txt',
  group('*') + '\n' +
  '# Answer engines, allowed explicitly. Blocking these means the site cannot be\n' +
  '# cited in an AI answer; that is a decision to take on purpose, not by default.\n' +
  '# Each repeats the Disallow: a group is matched, never merged with the wildcard.\n' +
  AI_AGENTS.map(group).join('\n') +
  `\nSitemap: ${SITE}${BASE}/sitemap.xml\n`);

const homeLastmod = lastmodOf(...HOME_SOURCES);
const pages = [{ loc: SITE + BASE + '/', lang: 'ro', lastmod: homeLastmod },
               { loc: SITE + BASE + '/ru/', lang: 'ru', lastmod: homeLastmod }];
const extraPages = privacyIncomplete ? [] : [
  { loc: SITE + BASE + PRIVACY_PATH.ro, lang: 'ro', lastmod: lastmodOf('src/privacy.html', ...localeFiles) },
  { loc: SITE + BASE + PRIVACY_PATH.ru, lang: 'ru', lastmod: lastmodOf('src/privacy.html', ...localeFiles) },
];
// The 18 service pages, paired ro/ru by slug so each carries both alternates.
const servicePairs = SERVICE_SLUGS
  .filter((sg) => loaded.some((l) => renderableProjects(l, sg).some((p) => coverIsRealPhoto(p.cover))))
  .map((sg) => ({
    ro: SITE + BASE + SERVICES_ROOT.ro + sg + '/',
    ru: SITE + BASE + SERVICES_ROOT.ru + sg + '/',
    lastmod: lastmodOf(...SVC_SOURCES, ...coversFor(sg)),
  }));
// W14-16. The three product pages, always listed, per the owner's card.
const productPairs = PRODUCT_PAGES.map((p) => ({
  ro: SITE + BASE + SERVICES_ROOT.ro + p.slug + '/',
  ru: SITE + BASE + SERVICES_ROOT.ru + p.slug + '/',
  lastmod: lastmodOf(...PROD_SOURCES, ...p.sources),
}));
servicePairs.push(...productPairs);
// W16-02. The seven category pages, always listed: they carry no data that can
// make them empty, so there is no condition under which they should drop out.
/* W24-04. The catalogue index first, then every category and subcategory page.
   The index was never in the sitemap because it did not exist; it answered 404 on
   the live site while fourteen pages under it were indexed. */
const categoryPairs = [
  {
    ro: SITE + BASE + CATALOG_ROOT.ro,
    ru: SITE + BASE + CATALOG_ROOT.ru,
    lastmod: lastmodOf(...CAT_SOURCES, 'src/catalog-index.html'),
  },
  /* W25-19. The eight roofing routes are redirect pages now, `noindex, follow`,
     and a sitemap that advertises a noindex page asks a crawler to index what the
     page tells it not to. They keep their URLs and still answer 200; they just
     stop being advertised. The page they land on, /servicii/acoperisuri/, is
     already in the sitemap as a service page. */
  ...CATEGORIES.filter((c) => !ROOF_MOVED_ROUTES.has(c.slug)).map((c) => ({
    ro: SITE + BASE + CATALOG_ROOT.ro + c.slug + '/',
    ru: SITE + BASE + CATALOG_ROOT.ru + c.slug + '/',
    lastmod: lastmodOf(...CAT_SOURCES),
  })),
];
servicePairs.push(...categoryPairs);
fs.writeFileSync('dist/sitemap.xml',
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
  pages.concat(extraPages).map((p) => '  <url>\n' +
    `    <loc>${p.loc}</loc>\n` +
    pages.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.loc}"/>\n`).join('') +
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${pages[0].loc}"/>\n` +
    (p.lastmod ? `    <lastmod>${p.lastmod}</lastmod>\n` : '') +
    '    <changefreq>monthly</changefreq>\n  </url>\n').join('') +
  servicePairs.flatMap((pair) => ['ro', 'ru'].map((lang) => '  <url>\n' +
    `    <loc>${pair[lang]}</loc>\n` +
    `    <xhtml:link rel="alternate" hreflang="ro" href="${pair.ro}"/>\n` +
    `    <xhtml:link rel="alternate" hreflang="ru" href="${pair.ru}"/>\n` +
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${pair.ro}"/>\n` +
    (pair.lastmod ? `    <lastmod>${pair.lastmod}</lastmod>\n` : '') +
    '    <changefreq>monthly</changefreq>\n  </url>\n')).join('') +
  '</urlset>\n');

/* W9-06. /llms.txt: what the site is, what it offers and where, in the flat
   markdown an answer engine can lift without parsing a page.

   Facts only, and every one of them is already on the site: the service names
   and their one-line descriptions come from the locale files, the localities
   from `band.coverageLine`, the phone and email from the footer. The service
   lines are each description's FIRST sentence, which is the factual enumeration
   of what the service covers; the second, where there is one, is a claim about
   how well it is done and has no place here. */
{
  const ro = loaded.find((l) => l.code === 'ro');
  const ru = loaded.find((l) => l.code === 'ru');
  const firstSentence = (t) => {
    const i = t.indexOf('. ');
    return (i === -1 ? t : t.slice(0, i + 1)).replace(/\.$/, '');
  };
  const lines = [
    '# Rapid Construct',
    '',
    '> Antreprenor general de construcții din Chișinău, Republica Moldova.',
    '> Construcții noi, renovări și lucrări de specialitate pentru locuințe și',
    '> spații comerciale. Site bilingv, română și rusă.',
    '',
    `Строительная компания из Кишинёва, Молдова. Сайт на румынском и русском.`,
    '',
    '## Servicii / Услуги',
    '',
  ];
  // Same gate as the sitemap: a service page with no real cover is noindex, and
  // pointing an answer engine at a page that asks not to be indexed is working
  // against yourself. The service reappears here the moment a photograph lands.
  SERVICE_SLUGS.forEach((slug, i) => {
    if (!loaded.some((l) => renderableProjects(l, slug).some((pr) => coverIsRealPhoto(pr.cover)))) return;
    const url = SITE + BASE + SERVICES_ROOT.ro + slug + '/';
    lines.push(`- [${ro.strings[`services.items.${i}.title`]}](${url}): ` +
      `${firstSentence(ro.strings[`services.items.${i}.desc`])}. ` +
      `RU: ${ru.strings[`services.items.${i}.title`]}, ` +
      `${SITE}${BASE}${SERVICES_ROOT.ru}${slug}/`);
  });
  lines.push('',
    '## Zonă deservită / Зона обслуживания', '',
    coverageLine(ro),
    coverageLine(ru), '',
    '## Contact', '',
    `- Telefon: ${ro.strings['footer.phone'] || '+373 76 837 180'}`,
    `- Email: ${ro.strings['footer.email'] || 'rapidconstructmd@gmail.com'}`,
    `- Program: ${ro.strings['form.hours']}`,
    '',
    '## Limbi / Языки', '',
    `- Română: ${SITE}${BASE}/`,
    `- Русский: ${SITE}${BASE}/ru/`,
    '');
  fs.writeFileSync('dist/llms.txt', lines.join('\n'));
}

/* W11-02. /review/: an unlisted page for the owner to rule on the five
   photographs that were held back.

   Four of them carry another party's mark inside the frame, and one is simply
   too small. They are shown at full size with the filename, the reason and the
   service they came from, and nothing else: no description is written for a
   photograph that may never be published, and writing one would be work thrown
   away plus a temptation to talk the picture up.

   Deliberately outside the locale system. The page is Romanian only, and
   build.js refuses to build when the two locale files disagree on keys, so
   RO-only strings in locales/ro.json would break the build for every other
   page. It is written here instead.

   noindex, nofollow, absent from sitemap.xml, and nothing anywhere links to it.
   Reachable by typing the URL and no other way. */
{
  const HELD = [
    { file: 'held-1-fatade-600x900.jpg', orig: 'Fatade / WhatsApp Image 2026-09-01 at 10.33.39 AM (5).jpeg',
      w: 600, h: 900, service: 'Fațade', reason: 'Filigran dreamstime vizibil pe imagine.' },
    { file: 'held-2-reparatii-1200x1600.jpg', orig: 'Reparatii / WhatsApp Image 2026-09-01 at 10.33.59 AM (3).jpeg',
      w: 1200, h: 1600, service: 'Renovări la cheie', reason: 'Vestele echipei poartă inscripția MITCHELL ROMÁN.' },
    { file: 'held-3-reparatii-736x981.jpg', orig: 'Reparatii / WhatsApp Image 2026-09-01 at 10.33.59 AM.jpeg',
      w: 736, h: 981, service: 'Renovări la cheie', reason: 'Sigla de studio G6 aplicată pe compoziția înainte-după.' },
    { file: 'held-4-terasamente-1200x1500.jpg', orig: 'Lucrări de terasament și excavare / WhatsApp Image 2026-09-01 at 10.36.24 AM (1).jpeg',
      w: 1200, h: 1500, service: 'Lucrări de terasament și excavare', reason: 'Banner de recrutare AllFinishConcrete.com în imagine.' },
    { file: 'held-5-finisaje-350x350.jpg', orig: 'Finisaje / WhatsApp Image 2026-09-01 at 10.34.32 AM (3).jpeg',
      w: 350, h: 350, service: 'Finisaje', reason: '350x350, prea mică pentru publicare.' },
  ];
  const items = HELD.map((h, i) => `      <article class="held">
        <p class="eyebrow">${i + 1} / ${HELD.length}</p>
        <div class="held__media"><img src="${BASE}/review/${h.file}" alt="" width="${h.w}" height="${h.h}" loading="lazy" decoding="async"></div>
        <dl class="held__meta">
          <dt>Fișier</dt><dd><code>${esc(h.orig)}</code></dd>
          <dt>Dimensiune</dt><dd>${h.w} x ${h.h} px</dd>
          <dt>Serviciu</dt><dd>${esc(h.service)}</dd>
          <dt>Motivul reținerii</dt><dd><strong>${esc(h.reason)}</strong></dd>
        </dl>
      </article>`).join('\n');

  const html = `<!doctype html>
<html lang="ro" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Fotografii reținute · Rapid Construct</title>
<meta name="description" content="Pagină internă. Cele cinci fotografii reținute de la publicare, cu motivul fiecăreia.">
<meta name="robots" content="noindex, nofollow">\n<meta name="build-sha" content="${BUILD_SHA}">
<meta name="theme-color" content="#F65308">
<link rel="stylesheet" href="${BASE}/styles.css">
<style>
  .held { padding: 40px 0; border-top: 1px solid var(--line); }
  .held:first-of-type { border-top: 0; }
  .held__media { background: var(--bg-grey); display: flex; justify-content: center; margin: 16px 0 24px; }
  .held__media img { width: auto; height: auto; max-width: 100%; display: block; }
  .held__meta { display: grid; grid-template-columns: 180px minmax(0, 1fr); gap: 8px 24px; margin: 0; max-width: 760px; }
  .held__meta dt { font-weight: 700; }
  .held__meta dd { margin: 0; color: var(--ink-muted); }
  .held__meta code { font-size: 14px; word-break: break-word; }
  @media (max-width: 768px) { .held__meta { grid-template-columns: minmax(0, 1fr); gap: 2px 0; } .held__meta dd { margin-bottom: 12px; } }
</style>
</head>
<body>
<main id="continut">
  <section class="section section--light">
    <div class="container">
      <p class="eyebrow">Pagină internă</p>
      <h1>Fotografii reținute de la publicare</h1>
      <p class="lede">Cinci fotografii din setul primit nu au fost publicate. Patru dintre ele
      poartă în cadru marca altcuiva, iar una este prea mică. Fiecare este afișată mai jos la
      mărime reală, cu fișierul, motivul și serviciul din care provine.</p>
      <p class="muted" style="margin-top: 16px;">Pagina nu este indexată, nu apare în sitemap și nu
      este legată din nicio altă pagină. Nu s-a scris nicio descriere pentru aceste fotografii.</p>
${items}
    </div>
  </section>
</main>
</body>
</html>
`;
  fs.mkdirSync('dist/review', { recursive: true });
  fs.writeFileSync('dist/review/index.html', html);
  console.log(`wrote dist/review/index.html  (${HELD.length} held photographs, noindex, not in sitemap, unlinked)`);
}

fs.writeFileSync('dist/site.webmanifest', JSON.stringify({
  name: 'Rapid Construct',
  short_name: 'Rapid Construct',
  start_url: BASE + '/',
  scope: BASE + '/',
  display: 'standalone',
  background_color: '#FFFFFF',
  theme_color: '#F65308',
  icons: [
    { src: BASE + '/favicon-180.png', sizes: '180x180', type: 'image/png' },
    { src: BASE + '/favicon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
  ],
}, null, 2) + '\n');

// Hostinger runs Apache, which needs to be told where the 404 lives.
// GitHub Pages ignores this file and finds /404.html on its own.
fs.writeFileSync('dist/.htaccess',
  `ErrorDocument 404 ${BASE}/404.html\n` +
  'AddDefaultCharset UTF-8\n\n' +
  '<IfModule mod_expires.c>\n' +
  '  ExpiresActive On\n' +
  '  ExpiresByType image/jpeg "access plus 1 year"\n' +
  '  ExpiresByType image/png "access plus 1 year"\n' +
  '  ExpiresByType text/css "access plus 1 year"\n' +
  '  ExpiresByType application/javascript "access plus 1 year"\n' +
  '  ExpiresByType text/html "access plus 1 hour"\n' +
  '</IfModule>\n');

/* CNAME, and why build.js emits it rather than leaving it to Settings.

   A Pages site deployed from Actions serves whatever the uploaded artifact
   contains. If that artifact carries no CNAME, a deploy can drop the custom
   domain and the site falls back to the github.io host; Settings is where the
   domain is configured, but the artifact is what makes it durable. The CNAME in
   the repository root is not enough either: only `dist/` is uploaded, and the
   repository root is not part of it.

   Exactly the domain, no trailing content. GitHub trims whitespace when it
   reads the file, but there is no reason to write any. */
const CUSTOM_DOMAIN = 'rapidconstruct.md';

/* The CNAME and the canonical host must never disagree: a page canonicalised to
   one origin and served from another is worse than either mistake alone. When
   SITE_URL is set explicitly, which is what CI does, its hostname must be the
   domain being written. A local build that leaves SITE_URL unset skips the
   check and still gets a CNAME, which is harmless because a local build is
   never uploaded. */
if (process.env.SITE_URL) {
  const host = new URL(SITE).hostname;
  if (host !== CUSTOM_DOMAIN) {
    die(`SITE_URL host is "${host}" but the CNAME would say "${CUSTOM_DOMAIN}".\n` +
        '  These must match, or the deployed site canonicalises to an origin it is not served from.\n' +
        `  Either set SITE_URL to https://${CUSTOM_DOMAIN}, or change CUSTOM_DOMAIN in build.js.`);
  }
}
fs.writeFileSync('dist/CNAME', CUSTOM_DOMAIN);

fs.copyFileSync('src/styles.css', 'dist/styles.css');
fs.copyFileSync('src/main.js', 'dist/main.js');
fs.cpSync('public', 'dist', { recursive: true, filter: (src) => !src.endsWith('PLACEHOLDERS.json') });
console.log('copied styles.css, main.js and public/ into dist/');
console.log(`generated robots.txt, sitemap.xml, site.webmanifest, CNAME (${CUSTOM_DOMAIN})`);

console.log(`base path: ${BASE || '(root)'}    site: ${SITE}`);
console.log(`google reviews link: ${GOOGLE_REVIEWS_URL || 'HIDDEN (set GOOGLE_REVIEWS_URL to reveal)'}`);
{
  const indexable = SERVICE_SLUGS.filter((sg) =>
    loaded.some((l) => renderableProjects(l, sg).some((p) => coverIsRealPhoto(p.cover))));
  console.log(`service pages indexable: ${indexable.length}/9` +
    (indexable.length ? ` (${indexable.join(', ')})` : ', all noindex until a real cover photo lands'));
}
{
  const fallback = FALLBACK_SLOTS.filter(onFallback);
  console.log(`slots on SVG fallback: ${fallback.length}/${FALLBACK_SLOTS.length}` +
    (fallback.length ? `\n  · ` + fallback.join('\n  · ') : ', every slot has a real photo'));
}
if (privacyIncomplete) {
  const reasons = [...privacyTodos, ...privacyMissingOperator];
  console.log(`\nPRIVACY PAGE INCOMPLETE: ${reasons.length} field(s) unresolved.`);
  reasons.forEach((t) => console.log('  · ' + t));
  console.log('  -> nothing on the site links to the privacy pages (W12-17).');
  console.log('  -> the page is noindex and excluded from sitemap.xml until they are filled.');
} else if (privacyMissingOperator.length) {
  console.log('\nPRIVACY PAGE PUBLISHED WITHOUT AN OPERATOR SECTION (W12-26).');
  privacyMissingOperator.forEach((t) => console.log('  · ' + t));
  console.log('  -> linked, indexable and in the sitemap. No placeholder text renders.');
  console.log('  -> fill the fields when the registry extract lands; the flag in');
  console.log('     build.js then becomes irrelevant.');
}
console.log(FORM_ARMED
  ? '\nform: ARMED, posts to Web3Forms.'
  : '\nform: DEMO MODE. No WEB3FORMS_KEY set, so the form validates and then shows\n'
    + '      the inline notice instead of posting. Set WEB3FORMS_KEY to arm it.');
