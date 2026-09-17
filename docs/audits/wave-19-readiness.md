# Wave 19 readiness · Live status, Lighthouse, hidden sections, pending photos, open questions

Card RC-143 (W19-03), 2026-09-17. **Facts only, no recommendations.** This is the
CRITIC's input for wave 19 and the owner's demo checklist.

**What was measured:** the live site `https://rapidconstruct.md`, serving `build-sha`
`b6f4a7d` (`b6f4a7dc3b000f72dc24145774ab0b2c197cae44`), which is `origin/main` at the time of measurement.

**Open pull requests at the time of measurement, not reflected in anything live below:**

| PR | Card | What it changes on the site |
|---|---|---|
| #48 | RC-141 | Nothing rendered. Records, rulings and a script comment |
| #49 | RC-142 | Accessibility attributes on the diagrams of `/servicii/copertine/` and `/servicii/tigla-metalica/`, both locales; no visual change |
| this PR | RC-143 | Nothing rendered. This report |

## 1. Every sitemap URL, with its live status code

Fetched 2026-09-17T11:56:02Z with `curl`, one GET per URL, redirects not followed. The
sitemap is the live `/sitemap.xml`: **42 URLs, 42 returning 200.**

| URL | Status | Content type | Bytes |
|---|---|---|---|
| `/` | 200 | text/html; charset=utf-8 | 74135 |
| `/ru/` | 200 | text/html; charset=utf-8 | 83598 |
| `/confidentialitate/` | 200 | text/html; charset=utf-8 | 7234 |
| `/ru/konfidentsialnost/` | 200 | text/html; charset=utf-8 | 9093 |
| `/servicii/case-la-cheie/` | 200 | text/html; charset=utf-8 | 41352 |
| `/ru/servicii/case-la-cheie/` | 200 | text/html; charset=utf-8 | 49278 |
| `/servicii/acoperisuri/` | 200 | text/html; charset=utf-8 | 40965 |
| `/ru/servicii/acoperisuri/` | 200 | text/html; charset=utf-8 | 48361 |
| `/servicii/fatade/` | 200 | text/html; charset=utf-8 | 41010 |
| `/ru/servicii/fatade/` | 200 | text/html; charset=utf-8 | 49885 |
| `/servicii/reparatii/` | 200 | text/html; charset=utf-8 | 34416 |
| `/ru/servicii/reparatii/` | 200 | text/html; charset=utf-8 | 40273 |
| `/servicii/finisaje/` | 200 | text/html; charset=utf-8 | 38910 |
| `/ru/servicii/finisaje/` | 200 | text/html; charset=utf-8 | 46353 |
| `/servicii/proiectare-3d/` | 200 | text/html; charset=utf-8 | 40287 |
| `/ru/servicii/proiectare-3d/` | 200 | text/html; charset=utf-8 | 48433 |
| `/servicii/instalatii/` | 200 | text/html; charset=utf-8 | 39142 |
| `/ru/servicii/instalatii/` | 200 | text/html; charset=utf-8 | 46519 |
| `/servicii/industrial/` | 200 | text/html; charset=utf-8 | 38578 |
| `/ru/servicii/industrial/` | 200 | text/html; charset=utf-8 | 46572 |
| `/servicii/terasamente/` | 200 | text/html; charset=utf-8 | 39284 |
| `/ru/servicii/terasamente/` | 200 | text/html; charset=utf-8 | 46685 |
| `/servicii/tigla-metalica/` | 200 | text/html; charset=utf-8 | 47331 |
| `/ru/servicii/tigla-metalica/` | 200 | text/html; charset=utf-8 | 52003 |
| `/servicii/copertine/` | 200 | text/html; charset=utf-8 | 41704 |
| `/ru/servicii/copertine/` | 200 | text/html; charset=utf-8 | 45306 |
| `/servicii/garduri/` | 200 | text/html; charset=utf-8 | 32010 |
| `/ru/servicii/garduri/` | 200 | text/html; charset=utf-8 | 36321 |
| `/catalog/termoizolatie/` | 200 | text/html; charset=utf-8 | 25511 |
| `/ru/catalog/termoizolatie/` | 200 | text/html; charset=utf-8 | 28622 |
| `/catalog/tencuieli-decorative/` | 200 | text/html; charset=utf-8 | 25446 |
| `/ru/catalog/tencuieli-decorative/` | 200 | text/html; charset=utf-8 | 28598 |
| `/catalog/placi-ceramice/` | 200 | text/html; charset=utf-8 | 25213 |
| `/ru/catalog/placi-ceramice/` | 200 | text/html; charset=utf-8 | 28220 |
| `/catalog/elemente-decorative/` | 200 | text/html; charset=utf-8 | 25339 |
| `/ru/catalog/elemente-decorative/` | 200 | text/html; charset=utf-8 | 28441 |
| `/catalog/vopsele/` | 200 | text/html; charset=utf-8 | 25187 |
| `/ru/catalog/vopsele/` | 200 | text/html; charset=utf-8 | 28150 |
| `/catalog/sisteme-iluminare/` | 200 | text/html; charset=utf-8 | 25320 |
| `/ru/catalog/sisteme-iluminare/` | 200 | text/html; charset=utf-8 | 28199 |
| `/catalog/alte-materiale/` | 200 | text/html; charset=utf-8 | 25292 |
| `/ru/catalog/alte-materiale/` | 200 | text/html; charset=utf-8 | 28290 |

Not in the sitemap, fetched the same way:

| URL | Status | Content type | Bytes |
|---|---|---|---|
| `/404.html` | 200 | text/html; charset=utf-8 | 4324 |
| `/ru/404.html` | 200 | text/html; charset=utf-8 | 4706 |
| an unknown path, `/nu-exista-<timestamp>/` | 404 | | |

## 2. Lighthouse, four categories, every page, both locales

Lighthouse 13.4.1, `--preset=desktop` (the preset gate 5 uses), the four
categories, run against the live URLs one at a time, **one run per page**.
Window: 2026-09-17, runs started between 11:55:54 and 12:03:50 UTC. Scores ×100.

Key: P is performance, A is accessibility, BP is best practices.

| Page | RO P | RO A | RO BP | RO SEO | RU P | RU A | RU BP | RU SEO |
|---|---|---|---|---|---|---|---|---|
| `/` | 99 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| `/confidentialitate/` | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| `/servicii/case-la-cheie/` | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| `/servicii/acoperisuri/` | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| `/servicii/fatade/` | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| `/servicii/reparatii/` | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| `/servicii/finisaje/` | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| `/servicii/proiectare-3d/` | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| `/servicii/instalatii/` | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| `/servicii/industrial/` | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| `/servicii/terasamente/` | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| `/servicii/tigla-metalica/` | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| `/servicii/copertine/` | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| `/servicii/garduri/` | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| `/catalog/termoizolatie/` | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| `/catalog/tencuieli-decorative/` | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| `/catalog/placi-ceramice/` | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| `/catalog/elemente-decorative/` | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| `/catalog/vopsele/` | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| `/catalog/sisteme-iluminare/` | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| `/catalog/alte-materiale/` | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| `/404.html` | 100 | 100 | 100 | 66 | 100 | 100 | 100 | 66 |

**44 of 44 runs read.** Runs with a runtime error or a non-zero exit: 0.
Runs with any category under 100: 3.

| URL | Category scores (P, A, BP, SEO) | Binary audits failing |
|---|---|---|
| `/` | 99, 100, 100, 100 | none; the score is from weighted metrics |
| `/404.html` | 100, 100, 100, 66 | `is-crawlable` |
| `/ru/404.html` | 100, 100, 100, 66 | `is-crawlable` |

Both 404 pages serve `<meta name="robots" content="noindex">` live, which is what `is-crawlable` reads.

## 3. Sections currently hidden because their data is empty

Read from `build.js`: every render path that returns nothing when its data is empty
or absent. The current values come from the data files, and the rendered or absent
state from a build of `main`'s content and from the live HTML.

### Absent now

| Section | Pages | Data it depends on | Current value | On the page |
|---|---|---|---|---|
| Before/after slider | `/`, `/ru/` | `content/before-after.json`, `projects` | `[]`, 0 projects | absent |
| Specification table (`section#ce-include`) | `/servicii/reparatii/`, `/servicii/proiectare-3d/`, `/servicii/industrial/`, and their RU pages | `svcContent.<slug>.table.*` keys in `locales/ro.json` and `locales/ru.json` | no such keys for these 3 services | absent (the other 6 services render one) |
| Product photo per tile model (`.tile__media`) | `/servicii/tigla-metalica/`, `/ru/servicii/tigla-metalica/` | `public/img/tigla-<model>.jpg` | 0 of 4 files exist | absent on all 4 models |
| Operator identity on the privacy page | `/confidentialitate/`, `/ru/konfidentsialnost/` | `privacy.opName`, `privacy.opIdno` in both locale files | absent in both locales | absent. The page is published without it under the W12-26 flag (`PRIVACY_PUBLISHABLE_WITHOUT_OPERATOR = true`); the build prints "PRIVACY PAGE PUBLISHED WITHOUT AN OPERATOR SECTION (W12-26)" |

Not a section, but content that data keeps off every page:

| Content | Data it depends on | Current value | On the site |
|---|---|---|---|
| Stub projects | `content/projects.json`: `title` and `summary` real in the locale | 54 projects; 38 renderable in RO and 38 in RU; 16 stubs in each | the 16 stubs render nowhere (not on a service page, not in the homepage portfolio, not in the sitemap) |

### Rendered now, for completeness

Each of these would be absent if its data were empty. It is not.

| Section | Pages | Data | Current value |
|---|---|---|---|
| Project gallery ("Proiecte recente") | the 9 service pages, both locales | renderable projects in `content/projects.json` per service | case-la-cheie 5, acoperisuri 5, fatade 5, reparatii 2, finisaje 4, proiectare-3d 5, instalatii 4, industrial 4, terasamente 4 |
| Homepage portfolio | `/`, `/ru/` | `content/projects.json` | 6 cards, plus the "100+" end tile |
| FAQ | the 9 service pages, both locales | `svcContent.<slug>` FAQ keys | 4 questions on each |
| Catalog menu and category pages | every page except the privacy and 404 pages; 14 category pages | `content/catalog.json` | 7 categories |
| Social row | `/`, `/ru/` | `content/social.json` | 3 links |
| Roofing offer images | `/`, `/ru/` | `public/img/offer-roof-01.jpg` to `04.jpg` | 4 of 4 |
| Tile grid | `/servicii/tigla-metalica/`, RU | `content/tigla-metalica.json` | 4 models, 15 legend entries |
| Carport chooser and models | `/servicii/copertine/`, RU | `content/copertine.json` | 5 families, 12 models |
| Promo bar | every page | `promo.text`, `promo.endDate` | present, `endDate` in 2027 |
| Photo slots with an SVG fallback (`scripts/slots.js`) | the pages those slots sit on | a real photograph per slot in `public/img/` | the build reports "slots on SVG fallback: 0/10 — every slot has a real photo" |

**Live form state, for the demo:** the quote form on `/`, `/ru/` and
`/servicii/fatade/`, and the callback form on `/` and `/ru/`, carry
`data-armed="1"` in the live HTML. The live pages carry no link to the Google
profile.

## 4. Placeholder slots from `docs/assets/PENDING-PHOTOS.md`, by page

The manifest lists the slots the wave 14 audit classes **RC photo only**: 63 slots
plus the roofing galleries. Both locales render the same image files, so each slot
applies to the RO page and its RU counterpart.

"Host" is the manifest's own column: whether a component exists on the site to show
the photo.

### `/` and `/ru/`, the homepage: 22 slots, 0 filled

| Slots | Count | Host on the site | Must show |
|---|---|---|---|
| F-BA-1A, F-BA-1B, F-BA-2A, F-BA-2B, F-BA-3A, F-BA-3B, F-BA-4A, F-BA-4B | 8 | the before/after slider, absent while `content/before-after.json` is empty (section 3) | four jobs, each an after and a before from the same point |
| F-TEST-01 to F-TEST-13 | 13 | none; the reviews are text only | video, a named client speaking at their house |
| F-CONS-1 | 1 | none | a named crew member holding a roof sample |

### `/servicii/acoperisuri/` and RU: 8 counted slots plus galleries, 5 filled

| Slots | Count | Host on the site | State |
|---|---|---|---|
| F-HERO-V1 | 1 | none | not filled; video of the crew at a client house |
| F-PORT-1 to F-PORT-5 | 5 | project covers | **filled**, rendering as `proj-acoperisuri-01-cover` to `05-cover` |
| F-PORT-6 | 1 | project cover `proj-acoperisuri-06-cover`, on a stub project, not rendered | not filled; the project also needs a title and summary |
| F-PORT-7 | 1 | none; no seventh roofing project exists | not filled |
| F-PORT-GAL | uncounted | project gallery slots, not rendered | not filled |

### `/servicii/garduri/` and RU: 30 slots, 0 filled, no host for any

| Slots | Count | Must show |
|---|---|---|
| I-G-HERO-1 | 1 | the real team with a louvre panel |
| I-G-PORT-01 to I-G-PORT-24 | 24 | a finished louvre fence at a client house, one per job |
| I-G-HOW-V1 | 1 | video, a fence being installed by the crew |
| I-G-MGR-1 | 1 | a named staff member with a panel sample |
| I-G-VID-1 to I-G-VID-3 | 3 | video, a client interviewed at their fence |

### `/servicii/copertine/` and RU: 3 slots, 0 filled, no host for any

| Slots | Count | Must show |
|---|---|---|
| I-C-X-1 | 1 | aerial of a finished metal tile roof |
| I-C-X-2 | 1 | close-up of a finished soffit |
| I-C-X-3 | 1 | a finished louvre fence with its gate |

### `/servicii/tigla-metalica/`: no RC-photo-only slot

### Totals

| | Slots |
|---|---|
| In the manifest | 63, plus the roofing galleries |
| Filled | 5 (F-PORT-1 to F-PORT-5) |
| Not filled | 58 |
| Not filled, with a host component on the site | 9: the 8 before/after slots, and F-PORT-6's stub project cover |
| Not filled, with no host component | 49 |

## 5. Every open question in `docs/QUESTIONS.md`, with its age in waves

**What counts as open.** A question is listed when its heading records it as OPEN,
in whole or in part. A question whose heading records no status at all is listed when
the `Status:` line in its own body says it is not answered. Headings are status
metadata under R-S, and bodies are as written.

**Age** is the current wave, 19, minus the wave the question was opened in. The
opening wave is read from the card ID each heading or body gives.

**"Later records"** quotes what a later entry in `DECISIONS.md` or `docs/BACKLOG.md`
says about the question, where one does. Where it contradicts the question's own
status, both are stated and neither is resolved here.

| Question | Status as recorded in the question | Opened | Age in waves | Later records |
|---|---|---|---|---|
| **Q-04** · Real content for 44 stub projects | heading: OPEN | 2026-08-31, W6-02 | **13** | `DECISIONS.md`: "Q-04 stays open". `content/projects.json` now holds 16 stubs, not 44 (section 3) |
| **Q-W9-04** · Nine more photographs fail the "real Rapid Construct work" rule | no heading status; body: "shipped a default, needs an owner ruling" | 2026-09-01, W9-04 | **10** | `DECISIONS.md`: the slot is "owned by Q-W9-04, which stays open" |
| **Q-W9-06** · The two live form submissions are blocked on a publish | no heading status; body: "blocked, not failed" | 2026-09-01, W9-05 | **10** | `docs/BACKLOG.md`, wave 12: "a real browser submission landed at 08:57 on 2026-09-06. Q-W10-01 and W10-02 are closed on that evidence." Live forms carry `data-armed="1"` |
| **Q-W9-07** · The RO homepage title and description exceed their limits | heading: "TITLE ANSWERED ... DESCRIPTION STILL OPEN" | 2026-09-01, W9-06 | **10** | `DECISIONS.md`: "The description half of Q-W9-07 is NOT closed and the question stays open." |
| **Q-W12-07-LEGAL** · The privacy pages are unlinked until the registry extract arrives | heading: OPEN | 2026-09-06, W12-17 and W12-21 | **7** | `docs/BACKLOG.md`: RC-072, "W12-26 Publish the fallback privacy page on an explicit switch", shipped (commit `8c3b9ce`). The live privacy pages are linked and `index, follow`, without an operator section; `privacy.opName` and `privacy.opIdno` are absent in both locales (section 3) |
| **Q-W13-01** · Three logo assets still need a client-supplied source | heading: OPEN | 2026-09-08, W13-02 | **6** | none beyond its opening |
| **Q-W14-01** · No licence was ever recorded for most shipped images | heading: OPEN | 2026-09-15, W14-02 | **5** | none beyond its opening |
| **Q-W14-06** · The social row links to the three profiles the site already names; confirm them | heading: OPEN | 2026-09-15, W14-07 | **5** | none beyond its opening |
| **Q-W14-08** · The metal tile prices are a manufacturer's published list prices | heading: "PART (b) ANSWERED ... (a) OPEN" | 2026-09-15, W14-10 | **5** | `DECISIONS.md`, W16 ratifications (the owner's rulings on wave 15): "Dasterum is the confirmed tile supplier. Q-W14-08(a) is closed." The heading was not updated |
| **Q-W14-14** · Where the RC photo only placeholders go, when their sections do not exist on the site | heading: OPEN | 2026-09-15, W14-19 | **5** | none beyond its opening |

**10 questions listed.** By age: 13 waves (1), 10 waves (3), 7 waves (1), 6 waves (1),
5 waves (4).

**Headings that record part of a question open, but are not listed:**
- **Q-W14-11** says "PART ANSWERED ... the renders carried as Q-W14-11b". Q-W14-11b is
  ANSWERED 2026-09-16.
- **Q-W9-08** has no heading status; its body says "answered, no action needed yet".
