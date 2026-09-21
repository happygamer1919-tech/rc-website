#!/usr/bin/env node
/* The wave 24 photo slot ledger gate, card W24-01. Run by `quality` on every
   pull request, over the BUILT site.

   Every image wave 24 renders is a placeholder. A separate photo session fills
   them, and docs/PHOTO-SLOTS-W24.json is the list that session is handed. A list
   that does not match what the site renders is worse than no list: it sends a
   photographer out for a photograph nothing will show, and it leaves a box on the
   site that nobody was asked to photograph.

   So the two are held together in BOTH directions:

   1. FORWARD. Every placeholder rendered in dist/ has a row in the ledger.
      A placeholder is `data-photo-slot="<id>"` on the shared .ph component,
      which build.js is the only writer of.
   2. REVERSE. Every row in the ledger is rendered by at least one built page.
      A row nothing renders is an unreviewed line in a request list.

   And each row is checked against what it renders: the ratio the page carries in
   --ph-ratio is the ratio the row states, because the row is the one place a
   ratio is written (docs/CLAUDE.md section 14).

   IT NEVER PASSES ON NOTHING, and it is not trusted on a count alone.
   docs/CLAUDE.md section 13 as amended by W18-03: a gate that reads files says
   how many and fails on none. This prints the pages and the rows it read before
   any result, and fails on zero pages read or a ledger it cannot read.

   THE SELF-TEST IS WHAT MAKES IT A GATE WHILE THE LEDGER IS EMPTY. W24-01 ships
   the component, the ledger and this gate; the first rows arrive with W24-04, so
   on W24-01 both real counts are zero and both assertions would hold vacuously.
   Section 13's corollary is that an assertion nobody has watched fail is not a
   gate, so before any real result this runs both arms against a synthetic page
   and a synthetic ledger: a rendered placeholder with no row, and a row nothing
   renders. If either arm does not fire, the gate fails, because then it has
   proved nothing about the real tree either. Same arrangement as the parser
   self-test in scripts/check-image-metadata.js (gate 17).

   Zero dependencies. Reads HTML as text: the placeholder build.js emits is a
   single-line, attribute-quoted div, which build.js controls.

   Usage:  node build.js && node scripts/check-photo-slots-w24.js */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const LEDGER = path.join(ROOT, 'docs/PHOTO-SLOTS-W24.json');
const fail = (msg) => { console.error(`\nPHOTO SLOT LEDGER GATE FAILED: ${msg}\n`); process.exit(1); };

const attr = (tag, name) => { const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`)); return m ? m[1] : null; };

/* Every .ph placeholder on one page, as { id, ratio, where }. Shared by the real
   run and by the self-test, so the self-test exercises the parser the run uses
   and not a second copy of it. */
/* AMENDED (W25-01): a FILLED slot renders <picture>, not <div>. Matching only
   <div> would have reported every filled slot as rendered by no page, which is
   the reverse assertion firing on a slot that is working. The element name is
   read and carried, because which of the two it is must equal the ledger's
   `state`: a page rendering a box for a slot the ledger calls filled, or an image
   for a slot it calls a placeholder, is a disagreement worth failing on. */
function placeholdersIn(html, rel) {
  const found = [];
  for (const m of html.matchAll(/<(div|picture)\b[^>]*\bdata-photo-slot="[^"]*"[^>]*>/g)) {
    const open = m[0];
    const el = m[1];
    const id = attr(open, 'data-photo-slot');
    const cls = (attr(open, 'class') || '').split(/\s+/);
    const style = attr(open, 'style') || '';
    const ratio = (style.match(/--ph-ratio:\s*([^;"]+)/) || [])[1];
    found.push({
      id,
      ratio: ratio ? ratio.trim() : null,
      variant: cls.includes('ph--dark') ? 'dark' : (cls.includes('ph--light') ? 'light' : null),
      isComponent: cls.includes('ph'),
      el,
      filled: el === 'picture',
      hasImg: el === 'picture' && /<img\b/.test(html.slice(m.index, m.index + 900)),
      alt: (html.slice(m.index, m.index + 900).match(/<img\b[^>]*\salt="([^"]*)"/) || [])[1],
      where: `${rel}: data-photo-slot="${id}"`,
    });
  }
  return found;
}

/* The two assertions, over a set of pages and a set of rows. Returns the list of
   problems, so the self-test can assert that each arm produces its own message
   rather than merely producing one. */
/* W25-01. The forbidden hosts, from R-W as the wave 25 dispatch restates them
   (W25-R2, UNCHANGED). Subdomains included, which is why it is a suffix test. */
const FORBIDDEN_HOSTS = ['fatade3d.md', 'imperlux.md', 'dasterum.md'];

/* The origins R-W approves for a FILLED slot, as amended by W25-R1 and W25-R3.
   A licence cell must contain one of these. They are matched as substrings and
   not as an exact equality, because the manufacturer string is followed by the
   owner's acceptance date and a Caparol row cites its own permission. */
const APPROVED_ORIGINS = [
  'manufacturer packshot, reseller display, licence not verified, owner accepted',
  'AI generated for Rapid Construct',
  'supplier permission',
  'client-supplied original',
  'legacy, licence unverified',
  /* W25-R7 and W25-R14, the direct suppliers. Narrow on purpose: each one names
     the host it belongs to, so neither can be used to launder any other origin. */
  'direct supplier, dasterum.md',
  'direct supplier, fatade3d.md',
  /* W25-R15, the owner override. It is NOT a direct supplier and it is written
     differently so a reader of the ledger never has to guess which permission a
     row is standing on: this one rests on an owner decision over a competitor
     host, and it is held to twelve slot ids below rather than to the host. */
  'owner_override_imperlux',
];

/* W25-R7. `dasterum.md` stays in FORBIDDEN_HOSTS and is lifted for ONE licence.
   A filled slot may name a dasterum.md source only when its provenance row's
   licence is the direct-supplier origin; any other licence on that host is the
   refusal R-W has always been. Lifting the host by exception rather than removing
   it means a row that drifts off the sentence loses the permission. */
const DIRECT_SUPPLIER_HOST = 'dasterum.md';
const DIRECT_SUPPLIER_ORIGIN = 'direct supplier, dasterum.md';
/* AMENDED (W25-R14): the same shape for the second direct supplier, and only for
   the second. The map is host to the exact licence prefix that lifts it, so a row
   naming one host with the other host's licence is refused by both entries. */
const DIRECT_SUPPLIER_ORIGINS = {
  'dasterum.md': 'direct supplier, dasterum.md',
  'fatade3d.md': 'direct supplier, fatade3d.md',
};
/* AMENDED (W25-R15): the override, held to twelve ids. A row naming imperlux.md
   on any other slot fails even with the override licence, which is the executable
   form of "nothing else from imperlux.md, ever". */
const OVERRIDE_HOST = 'imperlux.md';
const OVERRIDE_ORIGIN = 'owner_override_imperlux';
const OVERRIDE_SLOTS = [
  'GARD-01', 'GARD-02', 'GARD-03', 'GARD-04', 'GARD-05', 'GARD-06', 'GARD-07', 'GARD-08',
  'GARDB-01', 'GARDB-02', 'GARDB-03', 'GARDB-04',
];

/* The slot kinds R-W forbids a generated image on: a before/after pair and a
   project or portfolio tile are EVIDENCE, and "a render is never a proof image"
   (W25-R3). Read from the slot id's prefix, which is how every other rule in this
   repo identifies a slot family. */
const EVIDENCE_PREFIXES = ['BA-', 'PROJ-', 'PORT-'];

/* W25-R3's third clause: A FAMILY IMAGE NEVER FILLS A COLOUR-VARIANT CARD.
   Phomi publishes one photograph per family (`Rome Travertine`) and a separate
   swatch per colour (`Kamu Red`), and the shop sells the colours as separate
   products. Putting the family's photograph on its 33 colour cards would show
   one picture as 33 different products, which is the near match W25-R4 forbids
   arriving by a different route. That rule is not about one file, so
   process-packshot.js cannot hold it: it is a property of the LEDGER, read here.
   What is checkable, exactly: two filled slots must not stand on the same
   picture. Both halves are read, because a reuse can be written either way --
   the same file path in two rows, or two files whose provenance rows name the
   same source image URL, which is what a copy of one download looks like.
   The source cell is `<page URL> · <image URL> · <manufacturer>`; the image URL
   is whichever part of it ends in an image extension, and a source cell with no
   image URL in it (the legacy rows, which name no URL at all) is not compared,
   because comparing "origin not recorded" to itself would fail every legacy
   pair at once and say nothing about any picture. */
const IMAGE_URL = /\bhttps?:\/\/\S+\.(?:jpe?g|png|webp|gif|avif|heic|tiff?)\b/i;

/* W25-04. AN ORIGIN A PRODUCT CANNOT HAVE. W25-R1's approved origin for a
   catalogue product is "the manufacturer's official site", and 36 catalogue
   products name no manufacturer at all: 25 outdoor lamps whose names are bare
   OEM codes (`K1207`, `GMD-881F`), plus eleven others. For those there is no
   manufacturer site to be the origin, so a row claiming "manufacturer packshot"
   on one of their slots is claiming something that cannot be true, and the only
   place such a file could have come from is a reseller, which R2 forbids.
   W25-04 is a card whose entire result is "0 of 25 fetchable"; this is the part
   of that result a machine keeps holding after the card is closed. It is not a
   rule about pictures, so it lives here with the ledger and not in the fetcher:
   the fetcher sees one URL and knows nothing about which product it is for. */
const MANUFACTURER_ORIGIN = 'manufacturer packshot';

function check(pages, rows, provenance, brandBySlot) {
  const problems = [];
  const byId = new Map(rows.map((r) => [r.id, r]));
  const prov = provenance || new Map();
  const rendered = new Set();
  const byFile = new Map();      // provenance path -> first filled slot id that named it
  const bySourceImg = new Map(); // source image URL -> first filled slot id that stands on it

  for (const page of pages) {
    for (const ph of placeholdersIn(page.html, page.rel)) {
      if (!ph.isComponent) { problems.push({ id: 'not-component', text: `${ph.where} is not the shared .ph component. Every placeholder is one component.` }); continue; }
      if (!ph.variant) { problems.push({ id: 'no-variant', text: `${ph.where} carries neither ph--light nor ph--dark.` }); continue; }
      const row = byId.get(ph.id);
      if (!row) { problems.push({ id: 'unledgered', text: `${ph.where} has no row in docs/PHOTO-SLOTS-W24.json. A placeholder and its ledger row land in the same commit.` }); continue; }
      rendered.add(ph.id);
      if (ph.ratio !== row.ratio) {
        problems.push({ id: 'ratio', text: `${ph.where} renders --ph-ratio: ${ph.ratio}, and its ledger row states ${row.ratio}. The row is the one place a ratio is written.` });
      }

      /* W25-01. What is painted must equal what the ledger says is painted. */
      const wantFilled = row.state === 'filled';
      if (ph.filled !== wantFilled) {
        problems.push({ id: 'state', text: `${ph.where} renders a <${ph.el}> and its ledger row says state "${row.state}". A filled slot is a <picture>; a placeholder is a <div>.` });
        continue;
      }
      if (!ph.filled) continue;

      if (!ph.hasImg) { problems.push({ id: 'no-img', text: `${ph.where} is a <picture> with no <img> in it, so nothing renders and nothing has alt text.` }); }
      if (!ph.alt || !ph.alt.trim()) { problems.push({ id: 'no-alt', text: `${ph.where} is filled and its <img> has no alt text.` }); }

      /* The provenance half. An image with no row is precisely what R-W exists to
         prevent, and it is checked here rather than only in the provenance gate
         because that gate reads files under public/ and this one reads what a
         PAGE actually renders: an image can exist, have a row, and be wired to
         the wrong slot. */
      if (!row.provenance) {
        problems.push({ id: 'no-provenance', text: `${ph.where} is filled and its ledger row names no provenance. R-W: an image and its row land in the same commit.` });
        continue;
      }
      const prow = prov.get(row.provenance);
      if (!prow) {
        problems.push({ id: 'no-provenance', text: `${ph.where} is filled and names "${row.provenance}", which has no row in docs/assets/PROVENANCE.md.` });
        continue;
      }
      /* W25-R7 widened the leading boundary from [^a-z0-9.-] to [^a-z0-9-], so a
         SUBDOMAIN is caught: `www.dasterum.md` used to slip past because the
         character before the host was a dot, which the old class excluded. R-W's
         own interpretation 3 says hostname matching includes subdomains, and it
         did not. `notdasterum.md` is still not caught, because the character
         before is a letter, and `dasterum.md.example.com` is still not caught,
         because the trailing class still refuses a following dot. */
      const hay = `${prow.source} ${prow.licenceUrl}`.toLowerCase();
      const lic = prow.licence.toLowerCase();
      for (const host of FORBIDDEN_HOSTS) {
        /* W25-R7 and W25-R14: lifted for a row whose licence names THIS host. */
        const supplierOrigin = DIRECT_SUPPLIER_ORIGINS[host];
        if (supplierOrigin && lic.includes(supplierOrigin)) continue;
        /* W25-R15: lifted for a row whose licence names the override AND whose
           slot is one of the twelve. The slot half is the ruling's own limit. */
        if (host === OVERRIDE_HOST && lic.includes(OVERRIDE_ORIGIN) && OVERRIDE_SLOTS.includes(ph.id)) continue;
        if (new RegExp(`(^|[^a-z0-9-])${host.replace(/\./g, '\\.')}([^a-z0-9.-]|$)`, 'i').test(hay)) {
          let why = ` R-W and W25-R2: that host is never an origin.`;
          if (supplierOrigin) why += ` ${host === 'dasterum.md' ? 'W25-R7' : 'W25-R14'} lifts it only for a row whose licence names "${supplierOrigin}"; this row's licence is "${prow.licence}".`;
          if (host === OVERRIDE_HOST) {
            why += lic.includes(OVERRIDE_ORIGIN)
              ? ` W25-R15 overrides it for ${OVERRIDE_SLOTS.join(', ')} and for nothing else; this slot is ${ph.id}.`
              : ` W25-R15 overrides it only for a row whose licence names "${OVERRIDE_ORIGIN}" on one of the twelve Garduri slots; this row's licence is "${prow.licence}".`;
          }
          problems.push({ id: 'forbidden-host', text: `${ph.where} names a provenance row whose source is ${host}.` + why });
        }
      }
      if (!APPROVED_ORIGINS.some((o) => prow.licence.toLowerCase().includes(o.toLowerCase()))) {
        problems.push({ id: 'unapproved-origin', text: `${ph.where} names a provenance row whose licence is "${prow.licence}", which is not one of R-W's approved origins.` });
      }
      if (/ai generated/i.test(prow.licence) && EVIDENCE_PREFIXES.some((p) => ph.id.startsWith(p))) {
        problems.push({ id: 'render-as-proof', text: `${ph.where} is an evidence slot filled with a generated image. W25-R3: a render is never a proof image.` });
      }

      /* W25-04. The origin has to be one this product could have. */
      if (brandBySlot && prow.licence.toLowerCase().includes(MANUFACTURER_ORIGIN)) {
        const brand = brandBySlot.get(ph.id);
        if (brand !== undefined && !brand) {
          problems.push({ id: 'no-manufacturer', text: `${ph.where} is filled from a "${MANUFACTURER_ORIGIN}" and its catalogue record names no manufacturer, so there is no manufacturer site the file could have come from. W25-R1 and W25-R2: a reseller is never an origin.` });
        }
      }

      /* One picture, one card. Recorded per slot id rather than per rendered
         placeholder, because a slot legitimately renders on more than one page. */
      const firstFile = byFile.get(row.provenance);
      if (firstFile && firstFile !== ph.id) {
        problems.push({ id: 'shared-image', text: `${ph.where} and slot ${firstFile} are both filled with ${row.provenance}. W25-R3: one picture never stands as two products, and a family image never fills a colour-variant card.` });
      } else byFile.set(row.provenance, ph.id);

      const m = prow.source.match(IMAGE_URL);
      if (m) {
        const key = m[0].toLowerCase();
        const firstSrc = bySourceImg.get(key);
        if (firstSrc && firstSrc !== ph.id) {
          problems.push({ id: 'shared-image', text: `${ph.where} and slot ${firstSrc} name different files that were downloaded from the same picture, ${m[0]}. W25-R3: one picture never stands as two products.` });
        } else bySourceImg.set(key, ph.id);
      }
    }
  }

  for (const row of rows) {
    if (!rendered.has(row.id)) {
      problems.push({ id: 'unrendered', text: `docs/PHOTO-SLOTS-W24.json row "${row.id}" (${row.page}) is rendered by no built page. A row nothing renders is a request for a photograph nothing will show.` });
    }
  }
  return problems;
}

/* W25-01. docs/assets/PROVENANCE.md as a map keyed by the file path in the first
   cell, which is what a filled slot's `provenance` names. Read as a table rather
   than parsed as Markdown: the file is a table and has been since W14-02. */
function readProvenance(md) {
  const map = new Map();
  for (const line of md.split('\n')) {
    if (!line.startsWith('|')) continue;
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length < 5) continue;
    const file = cells[0].replace(/^`|`$/g, '');
    if (!file.startsWith('public/')) continue;
    map.set(file, { file, source: cells[1], licence: cells[2], licenceUrl: cells[3], date: cells[4] });
  }
  return map;
}

/* --- the self-test, before any real result -------------------------------- */

/* A filled slot, used by the W25-01 arms and by the green filled control. Written
   once so an arm and its control differ only in the thing the arm plants. */
const FILLED_HTML = (id, ratio) => `<picture class="ph ph--filled ph--light" data-photo-slot="${id}" style="--ph-ratio: ${ratio};"><img src="/img/x.jpg" alt="Un produs" width="800" height="800" loading="lazy" decoding="async"></picture>`;
const FILLED_ROW = (id, prov) => ({ id, page: '/somewhere/', ratio: '1 / 1', min_px: '1000x1000', shows: 'nothing', state: 'filled', provenance: prov });
const GOOD_LICENCE = 'manufacturer packshot, reseller display, licence not verified, owner accepted 2026-09-20';

const SELF = [
  {
    arm: 'forward: a rendered placeholder with no ledger row',
    want: 'unledgered',
    pages: [{ rel: 'self-test/a.html', html: '<div class="ph ph--light" data-photo-slot="SELFTEST-01" style="--ph-ratio: 1 / 1;"><span class="ph__id">SELFTEST-01</span></div>' }],
    rows: [],
  },
  {
    arm: 'reverse: a ledger row nothing renders',
    want: 'unrendered',
    pages: [{ rel: 'self-test/b.html', html: '<p>no placeholder here</p>' }],
    rows: [{ id: 'SELFTEST-02', page: '/nowhere/', ratio: '1 / 1', min_px: '1000x1000', shows: 'nothing' }],
  },
  {
    arm: 'a placeholder whose rendered ratio disagrees with its row',
    want: 'ratio',
    pages: [{ rel: 'self-test/c.html', html: '<div class="ph ph--dark" data-photo-slot="SELFTEST-03" style="--ph-ratio: 16 / 9;"><span class="ph__id">SELFTEST-03</span></div>' }],
    rows: [{ id: 'SELFTEST-03', page: '/somewhere/', ratio: '1 / 1', min_px: '1000x1000', shows: 'nothing' }],
  },
  /* W25-01, the filled half. The dispatch names both of these by name. */
  {
    arm: 'a filled slot whose provenance row names a forbidden host',
    want: 'forbidden-host',
    pages: [{ rel: 'self-test/d.html', html: FILLED_HTML('SELFTEST-04', '1 / 1') }],
    rows: [FILLED_ROW('SELFTEST-04', 'public/img/selftest-04.jpg')],
    prov: [{ file: 'public/img/selftest-04.jpg', source: 'https://fatade3d.md/produs/ceva/ \u00b7 https://fatade3d.md/img/x.jpg', licence: GOOD_LICENCE, licenceUrl: 'https://fatade3d.md/produs/ceva/', date: '2026-09-20' }],
  },
  {
    /* W25-R7. The host is lifted by ONE licence and by nothing else, so the arm
       that has to fire is a Dasterum source under an ordinary licence. */
    arm: 'a dasterum.md source on a row that does not carry the direct-supplier licence',
    want: 'forbidden-host',
    pages: [{ rel: 'self-test/ds.html', html: FILLED_HTML('SELFTEST-15', '1 / 1') }],
    rows: [FILLED_ROW('SELFTEST-15', 'public/img/selftest-15.jpg')],
    prov: [{ file: 'public/img/selftest-15.jpg', source: 'https://www.dasterum.md/ro/x/ \u00b7 https://www.dasterum.md/content/catalog/products/x.jpg', licence: GOOD_LICENCE, licenceUrl: 'https://www.dasterum.md/ro/x/', date: '2026-09-21' }],
    brands: [['SELFTEST-15', 'Dasterum']],
  },
  {
    arm: 'a filled slot with no provenance row at all',
    want: 'no-provenance',
    pages: [{ rel: 'self-test/e.html', html: FILLED_HTML('SELFTEST-05', '1 / 1') }],
    rows: [FILLED_ROW('SELFTEST-05', 'public/img/selftest-05.jpg')],
    prov: [],
  },
  {
    arm: 'a filled slot whose provenance licence is not an approved origin',
    want: 'unapproved-origin',
    pages: [{ rel: 'self-test/f.html', html: FILLED_HTML('SELFTEST-06', '1 / 1') }],
    rows: [FILLED_ROW('SELFTEST-06', 'public/img/selftest-06.jpg')],
    prov: [{ file: 'public/img/selftest-06.jpg', source: 'https://example.com/p/ \u00b7 https://example.com/x.jpg', licence: 'found on a search results page', licenceUrl: 'https://example.com/p/', date: '2026-09-20' }],
  },
  {
    arm: 'a generated image on an evidence slot',
    want: 'render-as-proof',
    pages: [{ rel: 'self-test/g.html', html: FILLED_HTML('BA-99-before', '16 / 9') }],
    rows: [{ ...FILLED_ROW('BA-99-before', 'public/img/selftest-07.jpg'), ratio: '16 / 9' }],
    prov: [{ file: 'public/img/selftest-07.jpg', source: 'AI generated for Rapid Construct', licence: 'AI generated for Rapid Construct, tool named by owner, 2026-09-20', licenceUrl: 'n/a', date: '2026-09-20' }],
  },
  /* W25-R3, both halves of "a family image never fills a colour-variant card",
     each planted on its own so neither can pass on the other's account. */
  {
    arm: 'two filled slots standing on the same image file',
    want: 'shared-image',
    pages: [
      { rel: 'self-test/sh-a.html', html: FILLED_HTML('SELFTEST-10', '1 / 1') },
      { rel: 'self-test/sh-b.html', html: FILLED_HTML('SELFTEST-11', '1 / 1') },
    ],
    rows: [FILLED_ROW('SELFTEST-10', 'public/img/selftest-fam.jpg'), FILLED_ROW('SELFTEST-11', 'public/img/selftest-fam.jpg')],
    /* No image URL in the source cell on purpose, so this arm plants the shared
       FILE and nothing else: with a URL there the other half would fire too and
       the arm would no longer be reading one plant. */
    prov: [{ file: 'public/img/selftest-fam.jpg', source: 'client logo asset, delivered with the repo scaffold', licence: 'legacy, licence unverified', licenceUrl: 'legacy, licence unverified', date: '2026-09-20' }],
  },
  {
    arm: 'two filled slots whose two files came from one download',
    want: 'shared-image',
    pages: [
      { rel: 'self-test/sr-a.html', html: FILLED_HTML('SELFTEST-12', '1 / 1') },
      { rel: 'self-test/sr-b.html', html: FILLED_HTML('SELFTEST-13', '1 / 1') },
    ],
    rows: [FILLED_ROW('SELFTEST-12', 'public/img/selftest-12.jpg'), FILLED_ROW('SELFTEST-13', 'public/img/selftest-13.jpg')],
    prov: [
      { file: 'public/img/selftest-12.jpg', source: 'https://caparol.md/a/ \u00b7 https://caparol.md/fam.jpg', licence: GOOD_LICENCE, licenceUrl: 'https://caparol.md/a/', date: '2026-09-20' },
      { file: 'public/img/selftest-13.jpg', source: 'https://caparol.md/b/ \u00b7 https://caparol.md/fam.jpg', licence: GOOD_LICENCE, licenceUrl: 'https://caparol.md/b/', date: '2026-09-20' },
    ],
  },
  {
    /* W25-04. A lamp whose catalogue record names no manufacturer, filled from a
       "manufacturer packshot". There is no such manufacturer, so there was no
       such site. */
    arm: 'a manufacturer packshot on a product that has no manufacturer',
    want: 'no-manufacturer',
    pages: [{ rel: 'self-test/nm.html', html: FILLED_HTML('SELFTEST-14', '1 / 1') }],
    rows: [FILLED_ROW('SELFTEST-14', 'public/img/selftest-14.jpg')],
    prov: [{ file: 'public/img/selftest-14.jpg', source: 'https://caparol.md/p/ \u00b7 https://caparol.md/x.jpg', licence: GOOD_LICENCE, licenceUrl: 'https://caparol.md/p/', date: '2026-09-20' }],
    brands: [['SELFTEST-14', null]],
  },
  {
    arm: 'the ledger says filled and the page renders a placeholder box',
    want: 'state',
    pages: [{ rel: 'self-test/h.html', html: '<div class="ph ph--light" data-photo-slot="SELFTEST-08" style="--ph-ratio: 1 / 1;"><span class="ph__id">SELFTEST-08</span></div>' }],
    rows: [FILLED_ROW('SELFTEST-08', 'public/img/selftest-08.jpg')],
    prov: [{ file: 'public/img/selftest-08.jpg', source: 'x', licence: GOOD_LICENCE, licenceUrl: 'x', date: '2026-09-20' }],
  },
];

/* The control the arms are read against, watched green in this same run and
   immediately before them (R-AB): one page rendering one slot, one row for it. */
/* TWO controls, because there are now two kinds of slot. A filled control watched
   green is what makes the filled arms mean anything: without it, an arm firing
   could be the filled path being broken rather than the plant being caught. */
const CONTROL = {
  pages: [
    { rel: 'self-test/control.html', html: '<div class="ph ph--light" data-photo-slot="SELFTEST-00" style="--ph-ratio: 4 / 3;"><span class="ph__id">SELFTEST-00</span></div>' },
    { rel: 'self-test/control-filled.html', html: FILLED_HTML('SELFTEST-09', '1 / 1') },
  ],
  rows: [
    { id: 'SELFTEST-00', page: '/control/', ratio: '4 / 3', min_px: '1000x750', shows: 'nothing' },
    FILLED_ROW('SELFTEST-09', 'public/img/selftest-09.jpg'),
  ],
  prov: [{ file: 'public/img/selftest-09.jpg', source: 'https://caparol.md/p/ \u00b7 https://caparol.md/x.jpg', licence: GOOD_LICENCE, licenceUrl: 'https://caparol.md/p/', date: '2026-09-20' }],
  /* The filled control names a manufacturer, so the W25-04 arm's plant is the
     absence of one and nothing else. */
  brands: [['SELFTEST-09', 'Caparol']],
};
const provMap = (rows) => new Map((rows || []).map((r) => [r.file, r]));
const brandMap = (pairs) => new Map(pairs || []);

const controlBefore = check(CONTROL.pages, CONTROL.rows, provMap(CONTROL.prov), brandMap(CONTROL.brands));
if (controlBefore.length) fail(`the self-test control is not clean, so its arms prove nothing: ${controlBefore.map((p) => p.text).join(' | ')}`);
console.log('self-test control: clean');

for (const t of SELF) {
  const got = check(t.pages, t.rows, provMap(t.prov), brandMap(t.brands));
  const hit = got.filter((p) => p.id === t.want);
  if (hit.length !== 1) {
    fail(`the self-test arm "${t.arm}" did not fire on its own message "${t.want}". It reported: ${got.length ? got.map((p) => p.id).join(', ') : 'nothing'}. An assertion nobody has watched fail is not a gate.`);
  }
  console.log(`self-test arm fired on its own message: ${t.arm} -> ${t.want}`);
}

const controlAfter = check(CONTROL.pages, CONTROL.rows, provMap(CONTROL.prov), brandMap(CONTROL.brands));
if (controlAfter.length) fail(`the self-test control is dirty after the arms, so the arms left residue: ${controlAfter.map((p) => p.text).join(' | ')}`);
console.log('self-test control, again: clean\n');

/* --- the real run --------------------------------------------------------- */

if (!fs.existsSync(LEDGER)) fail(`docs/PHOTO-SLOTS-W24.json is missing. A file that vanished is not a file that passed.`);
let ledger;
try { ledger = JSON.parse(fs.readFileSync(LEDGER, 'utf8')); } catch (e) { fail(`docs/PHOTO-SLOTS-W24.json does not parse: ${e.message}`); }
if (!Array.isArray(ledger.slots)) fail('docs/PHOTO-SLOTS-W24.json has no "slots" array. An empty ledger is [], never a missing key.');

if (!fs.existsSync(DIST)) fail('no dist/, run: node build.js');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const files = walk(DIST).filter((f) => f.endsWith('.html'));
console.log(`files read: ${files.length} HTML pages in dist/`);
console.log(`ledger rows read: ${ledger.slots.length} in docs/PHOTO-SLOTS-W24.json`);
if (files.length === 0) fail('zero HTML pages read in dist/, so no placeholder was checked.');

const pages = files.map((f) => ({ rel: path.relative(ROOT, f), html: fs.readFileSync(f, 'utf8') }));
const totalRendered = pages.reduce((n, p) => n + placeholdersIn(p.html, p.rel).length, 0);
console.log(`placeholders rendered: ${totalRendered}`);

/* W25-01. The real run reads the real provenance file. A filled slot whose row
   is missing is a failure, so a missing PROVENANCE.md is one too. */
const PROV_FILE = path.join(ROOT, 'docs/assets/PROVENANCE.md');
if (!fs.existsSync(PROV_FILE)) fail('docs/assets/PROVENANCE.md is missing, so no filled slot could be checked against it.');
const provenance = readProvenance(fs.readFileSync(PROV_FILE, 'utf8'));
if (!provenance.size) fail('docs/assets/PROVENANCE.md parsed to zero rows, so a filled slot would pass by finding nothing.');
const filledCount = ledger.slots.filter((r) => r.state === 'filled').length;
console.log(`provenance rows read: ${provenance.size}`);
console.log(`ledger slots filled: ${filledCount} of ${ledger.slots.length}`);

/* W25-04. The brand map, so a filled slot's claimed origin can be checked against
   whether that product HAS a manufacturer. Only catalogue slots appear in it; a
   slot with no entry is not judged, which is every non-catalogue slot. */
const PRODUCTS = path.join(ROOT, 'content/catalog-products.json');
if (!fs.existsSync(PRODUCTS)) fail('content/catalog-products.json is missing, so no filled catalogue slot could be checked against its product record.');
let productJson;
try { productJson = JSON.parse(fs.readFileSync(PRODUCTS, 'utf8')); } catch (e) { fail(`content/catalog-products.json does not parse: ${e.message}`); }
const productRecords = Array.isArray(productJson) ? productJson : (productJson.products || []);
if (!productRecords.length) fail('content/catalog-products.json parsed to zero records, so every catalogue slot would pass by finding nothing.');
const REAL_BRAND = (b) => b !== null && b !== undefined && String(b).trim() !== '';
const brands = new Map(productRecords.filter((r) => r.slot).map((r) => [r.slot, REAL_BRAND(r.brand) && !r.brand_hidden ? String(r.brand) : null]));
const withoutBrand = [...brands.values()].filter((b) => !b).length;
console.log(`catalogue records read: ${brands.size}, of which ${withoutBrand} name no usable manufacturer`);

const problems = check(pages, ledger.slots, provenance, brands);

if (problems.length) {
  console.error(`\n${problems.length} problem${problems.length === 1 ? '' : 's'}:`);
  for (const p of problems) console.error(`  [${p.id}] ${p.text}`);
  fail(`${problems.length} placeholder or ledger row is not matched by the other.`);
}

if (totalRendered === 0 && ledger.slots.length === 0) {
  console.log('\nNo placeholder is rendered and the ledger is empty. That is W24-01\'s stated state:');
  console.log('the component, the ledger and this gate ship first, and the first rows arrive with W24-04.');
  console.log('The self-test above is what this run proves, and it fired on all three arms.');
}

console.log(`\nPHOTO SLOT LEDGER GATE PASSED: ${totalRendered} placeholder${totalRendered === 1 ? '' : 's'} on ${files.length} pages, ${ledger.slots.length} ledger row${ledger.slots.length === 1 ? '' : 's'}, matched both ways.`);
