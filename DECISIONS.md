# Decisions

Where this build departs from `docs/RC-WEBSITE-MASTER-PLAN.md`, and why. The
master plan wins by default; every exception below was approved by Ivan.

## The master plan is stale on two token values

Both were written before the logo file existed. The values below are sampled
from the logo and are what the approved mockup renders.

| Token | Master plan | Built | Why |
|---|---|---|---|
| `--brand` | `#F26419` | `#F65308` | Sampled from `public/logo-full.png`. Approved mockup uses it. |
| `--ink` | `#1C1C1C` | `#1A1A1A` | Same. |

These are the only two places the master plan loses.

## Approved exceptions

- **Services grid may exceed the 1,400px section cap.** Nine 4:3 photo cards in
  a 3x3 grid cannot fit under 1,400px at 96px section padding. It is the same
  object as the portfolio grid, so it is a second permitted grid exception.
  Measured 1,830px (RO) / 1,909px (RU). Desktop page total still clears 9,000px.
- **`form-bg` slot struck.** A darkened photo behind the form needs a fourth
  background value and a translucent overlay. Both are forbidden. See the
  manifest.

## Forced by the real copy

The predecessor build at rapidconstruct-web.vercel.app is the copy source. Where
the design files invented content, the real copy wins.

- Service names are the live ones: `Instalații` not "Rețele inginerești",
  `Renovări la cheie` not "Reparații la cheie", `Lucrări de terasament și
  excavare` not "Terasamente", `Construcție case la cheie` not "Case la cheie".
- Portfolio filter is `Renovări`, not the design's "Reparații".
- Ten work types in the form select, including `Altceva`. The design had nine.
- **Portfolio cards have no location line.** The master plan's card spec lists
  one, but the live site carries no per-project location and inventing one is
  not permitted. Card is photo, category chip, title, one-line description.
- **Process step titles come from the master plan, not the live site.** Section
  5.4 names the five steps explicitly and the manifest locks the slot IDs
  (`step-04-fatada`, `step-05-predare`). The live site's old scroll section used
  a different step 4 ("Ferestre și uși") and step 5 ("Ultimele detalii"). Steps
  1, 2, 3 and 5 reuse the live one-liners verbatim. Step 4 has no matching live
  stage line, so it uses the real `Fațade` service sentence, shortened, which is
  a permitted edit.

## Everything the design files invented, and did not ship

None of this reached `dist/`:

- Testimonials from Andrei Ciobanu, Maria Rusu and Victor Munteanu. The real
  three are Ion Miron, Maria Oprea and Andrei Condrea.
- Six invented portfolio projects with fabricated m², durations and locations
  (Durlești, Stăuceni, Ialoveni, Bubuieci, "240 m²", "unsprezece luni").
- Invented service two-liners.

## Build choices

- Hero is variant B (centred). Variant A dropped.
- Heading family is behind `--font-heading` in `src/styles.css`. Both Inter and
  Unbounded are already in the font link, so the pending A/B is a one-value
  change and no font bytes are downloaded for the family that is not used.
- Image placeholders are generated JPGs at the manifest's pixel size, not CSS
  backgrounds, so `<img>` alt text survives for Romanian-language SEO and no
  broken-image icon is ever possible. See `scripts/gen-placeholders.js`.
- Form posts to Web3Forms. Access key comes from `WEB3FORMS_KEY` at build time.

## Dead-link audit, 2026-08-28

Every `href` in the built page resolves to a real target: there are no broken
anchors. The problem is semantic, links whose destination does not match their
promise. Findings and recommendations:

| Link | Count | Currently | Verdict |
|---|---|---|---|
| Consent "politicii de confidențialitate" | 1 | `#contacte` | **Genuinely misleading.** A privacy-policy link pointing at the footer. Legally meaningful. |
| Footer "Politica de confidențialitate" / "Politica cookie" | 2 | `#contacte` | Same problem. |
| "Vezi tot portofoliul" | 1 | `#oferta` | **Misleading.** "See the whole portfolio" opening a quote form. All six projects are already on screen, so the button is also redundant. |
| Nine "Află mai multe" on service cards | 9 | `#oferta` | Weak. "Learn more" delivering a form. Defensible for a contractor, but it is not what the label says. |
| Six footer service links | 6 | `#servicii` | Weak. All six land on the same section rather than their own service. |
| Nav "Despre noi" | 1 | `#despre` | **Fine.** That section is the about-us content. |
| Nav "Contacte" | 1 | `#contacte` | **Fine.** Footer carries address, phone, email, hours. |

Recommendation, pending Ivan's decision:

1. Privacy and cookie links: remove the anchor and leave the consent sentence as
   plain text until real policy pages exist. Do not point them at a section.
2. "Vezi tot portofoliul": remove the button. The grid is the whole portfolio.
3. "Află mai multe": relabel to "Cere ofertă" so the label matches `#oferta`.
   Cheaper and more honest than building nine sub-pages.
4. Footer service links: point each at `#servicii` but keep them, they are
   navigational rather than promissory. No change.

**Resolved 2026-08-28, all approved by Ivan:**

1. `Vezi tot portofoliul` deleted.
2. Nine `Află mai multe` relabelled `Cere ofertă`.
3. Cookie-policy link deleted. The site sets no cookies, so the document would
   describe nothing. It returns if analytics are ever added, with a real banner.
4. Footer service links unchanged.
5. Privacy policy: real pages built at `/confidentialitate/` and
   `/ru/konfidentsialnost/` rather than stripping the anchor. The form collects
   name, phone and locality and the consent checkbox references a policy;
   under Law 133/2011 consent pointing at nothing is worse than no link.
   Legal identity fields are visible `TODO:` placeholders, never invented, and
   the build keeps the pages out of the index until they are filled.

## Contrast, resolved 2026-08-28

`#F65308` is sampled from the logo and approved on screen, so it was fixed from
the other side rather than darkened:

- **Buttons**: text raised 17px -> 19px. WCAG treats >=18.66px bold as large
  text, where AA asks 3:1 rather than 4.5:1. White on `--brand` is 3.41:1, so it
  passes. The fill is untouched.
- **Category chip**: 13px uppercase cannot reach that threshold without
  wrecking the card, so the chip fill alone moves to `--brand-dark`, giving
  5.93:1. It reads as a deliberate darker member of the brand family.

Lighthouse accessibility went 96 -> 100 on both locales.

## Phase 1 snapshot, 2026-08-28

Phase 1 is preserved as a standing comparison artefact, the same way the
rejected build is kept at `rapidconstruct-web.vercel.app`.

| | |
|---|---|
| Tag | `phase1-approved` -> `1c4e37ab74de9e3d7340e2140f0a0470e8b30471` |
| Tagged commit | "Merge site/rc-008: contrast, dead links, privacy pages" |
| Approved by | Mihai, 2026-08-28 |
| Repo | `happygamer1919-tech/rc-website-v1`, public |
| Live | https://happygamer1919-tech.github.io/rc-website-v1/ |
| Current build | https://happygamer1919-tech.github.io/rc-website/ |

**Why both exist.** Master plan section 9 rule 4: keep the comparison artefact
live, because when Mihai wavers the answer is to show him old against new side
by side. Phase 1 is what he signed off; the current build carries the phase 2
motion work and the wave 1 changes on top. Having both on stable URLs means an
approval can always be re-grounded against the thing that was approved.

The v1 repo is a snapshot of the tag with exactly two edits: `BASE_PATH` set to
`/rc-website-v1` in the Pages workflow, and one line in its README marking it
unmaintained. It is not maintained and takes no further commits.

All local feature branches were pushed to origin at the same time, so the
history is no longer local-only. Before that push only `main` existed remotely;
16 branches were added.

## Price figure scope on service pages — PROVISIONAL, 2026-08-28

**This is provisional pending a client ruling and is built to be easy to
reverse.**

`hero.priceTitle` ("160 lei/m² preț înghețat pentru 2026") and
`hero.priceLine1` ("−10% la programări anticipate") render on five service
pages only:

| Shown | Not shown |
|---|---|
| case-la-cheie | proiectare-3d |
| acoperisuri | instalatii |
| fatade | industrial |
| reparatii | terasamente |
| finisaje | |

`hero.priceLine2` ("Rate 0% la acoperiș") stays confined to acoperisuri, since
the copy names roofing itself.

**Why provisional.** Nobody has told us which services the per-m² figure
actually covers. A square-metre price is natural for building, roofing,
façades, renovation and finishing; it is not obviously meaningful for design
work, engineering installations, industrial builds or earthworks. That is a
commercial judgement, not a copy judgement, so it is flagged rather than
settled.

**To reverse.** One array in `build.js`: `PRICED_SLUGS`. Add a slug to show the
block, remove one to hide it. Nothing else changes.

**The homepage hero is unaffected.** The price box there was deleted in W1-02
and the figure now reaches the homepage only through `footer.offer`, which is
the site-wide standing offer and is not scoped per service.

## Supplier marquee, W6-01, 2026-08-31

Eight placeholder chips became twelve named brands on white logo tiles.

**The tile grew sideways, not downwards.** 160x80 became 200x80. A logo wants
width; the homepage has under 200px of headroom against the 8,700px cap, so
height is the expensive axis and buys nothing here. Measured cost of the whole
card: **0px**. RO stayed 8,504px and RU stayed 8,774px.

**One asset per brand, no greyscale twin.** The default grey state is
`filter: grayscale(100%); opacity: 0.6` on the colour file. Hover and keyboard
focus remove it. A second greyscale export would be a file to keep in sync for
no gain.

**The filter stays off the tile and off the text.** Applied to the tile in phase
1 it dimmed the placeholder label to 2.74:1. The rule is now scoped to
`.supplier__logo`, so the text fallback renders full-strength `--ink` on
`#FFFFFF`: **17.40:1**.

**Fallback is per brand, resolved at build time.** `build.js` looks for
`public/img/suppliers/<slug>.svg` then `.png`. Found: an `<img>`, with width and
height read out of the file (PNG IHDR, SVG viewBox) so it can never shift
layout. Not found: the brand name as text in the same tile. The first logo to
land renders as a logo while the other eleven stay text.

**Only the first twelve tiles are reachable.** The track carries the list twice
so the `-50%` keyframe lands on a seam. The second copy is `aria-hidden="true"`
and carries no `tabindex`, so a screen reader reads twelve brands and a keyboard
user gets twelve tab stops, not twenty-four. Under `prefers-reduced-motion` the
duplicate is `display: none`: with no loop it is just twelve repeated tiles.

**Keyboard focus does what hover does, and one thing hover does not.** Pause is
`:hover, :focus-within` on the viewport; colour restore is `:hover,
:focus-visible` on the tile. Both are pure CSS state on an animation, so nothing
registers a wheel, touch or scroll handler and scrolling cannot be delayed,
captured or hijacked. Verified with real keyboard input: 12 tab stops, a 2px
`--brand` ring, `animation-play-state: paused`, page scroll unmoved.

The one thing focus does that hover does not is scroll the viewport sideways.
An `overflow: hidden` box is still a scroll container, so Chrome scrolls it to
keep the focused tile visible — measured at 997px. That is the behaviour we
want, it is what keeps the focus ring on screen. Two things make it safe:

1. `.marquee__viewport { scroll-behavior: auto; }`. `html` sets
   `scroll-behavior: smooth`, which is inherited, and an animated sideways
   scroll then outran the reset below and won the race.
2. A `focusout` listener in `main.js` returns `scrollLeft` to 0 once focus
   leaves the region, so the offset never survives into the running loop. It
   does nothing under reduced motion, where the box is a real scroll region the
   reader drives and their position is theirs to keep.

**Colour audit.** One value removed (`#1F1F1F`, the old dark chip), none added.
Tiles are `var(--bg-light)`, which is `#FFFFFF`.

**Speed unchanged.** The track travels half its own width per cycle. 24 tiles is
5,352px, so 72s gives 37px/s, the same as phase 1's 16 tiles in 40s.

## Project model scale-up, W6-02, 2026-08-31

Ten projects became **54**: six per service across nine services. The card asked
for 5 to 7; six is the midpoint and divides evenly. Logged as Q-02.

**Nothing was invented.** The 44 new projects are stubs: a slot ID, a service,
and empty strings. Only `title` and `summary` gate a project, and without both
it renders nowhere — not on its service page, not in the homepage portfolio, not
in the sitemap. That is what makes 44 empty records safe to commit. The site is
byte-identical: 6 homepage cards before, 6 after; 8,504px RO and 8,774px RU
before and after.

**Seven new fields, each optional on its own.** `location`, `year`, `work_type`,
`area_sqm`, `duration`, `main_materials`, `challenge`. The first five render as
chips in the existing meta row, in that order; `area_sqm` gets `m²` added on
render so the number is stored bare. `main_materials` and `challenge` are
sentences, not chips, so they render as two labelled lines under the row. Every
one is tested individually: a project with a location and no year prints the
location alone, verified both ways.

**One emptiness rule, two spellings.** The seeded projects use `TODO: ...`
markers and the stubs use `""`. `REAL()` in `build.js` treats both as "no source
yet" and neither is ever printed. Previously the check was
`startsWith('TODO:')`, which would have let an empty-string title through and
rendered a card with no heading.

**Stubs reserve a cover slot and no gallery slots.** Manifest rule D-6 already
says a project with fewer than three usable gallery photos ships as cover only,
and a project with no content has no photos at all. Three reserved gallery slots
per stub would have added 132 unshootable slots and taken the manifest from 95 to
216. Logged as Q-03.

**Stub covers get no placeholder JPG either.** `scripts/slots.js` sets
`placeholder: false` for any cover whose project has no title, the same device
the gallery slots already use, so the repo does not carry 88 generated files
nothing points at. The four seeded covers whose projects still have `TODO:`
titles (`proiectare-3d-01`, `instalatii-01`, `industrial-01`, `terasamente-01`)
had their placeholders deleted for the same reason: nothing rendered them.

That opened a way to ship a broken `<img>`: fill in a title, forget to run the
placeholder generator, and the card points at a file that does not exist. So
`build.js` now refuses to build when a renderable project has no cover file, and
names the file and the command that fixes it. Proven by giving a stub a title:
the build fails with the path.

**W3-02 indexability gate re-verified at the new scale.** Still 0/9 indexable
with 54 projects. Dropping one real photo onto `proj-acoperisuri-01-cover.jpg`
flips exactly one service to `index, follow` and adds exactly that pair to the
sitemap; the other eight stay `noindex, nofollow`. The gate reads through
`renderableProjects`, so 44 stubs are invisible to it.

**Slot count: 51 -> 95.** 54 covers + 35 gallery + 5 process + 1 social. The
shooting plan does not change: 11 photographs are still the whole critical path
(6 covers of projects that have content, plus 5 process stages).

## Image slot type changes, W6-03, 2026-08-31

`hero-panel` and the nine service illustrations become photo slots. The SVGs are
not deleted: they become fallbacks.

| Slot | Ratio | 1x | 2x, the source to supply |
|---|---|---|---|
| `hero-panel` | 4:3 | 1400x1050 | **2800x2100** |
| `svc-<slug>` x9 | 4:3 | 800x600 | **1600x1200** |

The card gave the source sizes (2800px for the hero, 1600x1200 for the cards)
and the pipeline writes a 1x and a 2x per slot, so the 1x is half of each. That
is why the slot dimensions are not the numbers in the card: the numbers in the
card are the 2x, which is the file to hand over.

**The fallback is per slot, decided at build time, and it is a different box.**
`slotHasRealPhoto()` asks whether `public/img/<slot>.jpg` exists and is not a
generated placeholder — the same test the W3-02 indexability gate already used,
generalised from covers to any slot. No photo: the SVG in a
`media--illustration` box, contained on a grey field with 24px of padding. Photo:
a `media--card` box, `object-fit: cover`, edge to edge, with a `srcset`. An
illustration wants padding and a photograph wants none, so the swap changes the
box and not only the `src`.

Verified by processing one service photo and the hero photo and rebuilding:
`svc-fatade` rendered a jpg on the homepage card **and** on its own service page
hero while the other eight rendered SVGs, and no layout moved. All nine service
media boxes measured 366x275 with the photo in place, and the page stayed at
8,504px.

**A real hero photo is not lazy.** It sits beside the hero claim and is the
likely LCP element, so with the jpg present the build drops `loading="lazy"` and
sets `fetchpriority="high"`. The SVG keeps `loading="lazy"`; it is 1KB.

**The nine cards moved out of the template into `build.js`.** They were nine
hardcoded `<img>` tags, which cannot express a per-slot decision. The service
page's `{{svc.slot}}.svg` went the same way and `svc.slot` was deleted.

**`process-photos.js` needed no change.** It reads `scripts/slots.js`, so the
ten new IDs were accepted the moment they were added there: dry run wrote
`hero-panel` at 1400x1050 and 2800x2100 and `svc-fatade` at 800x600 and
1600x1200, and strict rejection still fired on a near-miss filename
(`svc-fatadex` -> "did you mean svc-fatade").

**Currently on fallback: all 10.** `build.js` prints the list on every build, so
this number is never guessed. Slot count 95 -> 105.

## Service card minimum long edge: 1600 -> 1200, W7-02, 2026-08-31

**Owner ruling.** The nine service card slots accept a source with a long edge
of **1200px**, not the manifest default of 1600. The approved artwork is
1448x1086 and the ruling was made to take it.

The floor is **per slot**, not global. `scripts/slots.js` carries `minLongEdge`
on those nine slots and `process-photos.js` warns against a slot's own value
where it has one, the manifest default where it does not. Every other slot,
including all 54 project covers and the 5 process stages, still stands at 1600.

**Why it is safe here, and would not be everywhere.** A service card renders at
366px wide, so the 1x at 800x600 is already more than double the display size
and 1448 covers it four times over. The cost is confined to the 2x, which is
interpolated up from 1448 to 1600 — a 10% upscale, on an image that only serves
retina screens at 366 CSS px. A project cover, which renders at 366px but is
also the largest image on a service page, keeps the 1600 floor.

1448x1086 is exactly 4:3, so the centre crop discarded nothing.

## Nine service card images routed, W7-02, 2026-08-31

All nine slots filled from the approved artwork. Every card now renders a
photograph and **`slots on SVG fallback` is down to 1/10**, the hero panel.

**The nine SVGs are retained, not deleted.** They sit at
`public/img/services/svc-*.svg` and are referenced **zero** times in `dist/`.
They are the fallback if a jpg is ever pulled, which is the whole point of the
W6-03 per-slot design: nothing had to be edited to switch nine cards from
illustrations to photographs except dropping nine files into `photos-raw/`.

**Zero layout movement**, which is what the per-slot design promised:

| | Before | After |
|---|---|---|
| Homepage RO | 8,504px | **8,504px** |
| Homepage RU | 8,774px | **8,774px** |
| Services section | 1,830px | **1,830px** |
| Every service media box | 366x275 | **366x275** |

Confirmed against an independent renderer: Lighthouse's own headless Chrome
reports a full-page height of 8,504 RO and 8,774 RU, and CLS 0.002 RO / 0.012 RU.

**Weight.** 3,852KB added to `public/img` across 18 files. A visitor does not
pay that: the nine 1x files total **878KB** and are all lazy and below the fold,
and the 2,938KB of 2x files are fetched only by retina screens. Lighthouse total
byte weight is 1,352KB RO / 1,377KB RU with performance still 100 and LCP 0.7s,
because the LCP element is hero text, not an image.

**These are illustrative product artwork, not documentary photographs of Rapid
Construct's own work.** That is not a breach of master plan section 7. The "real
Rapid Construct work only, never stock" rule governs the slots that make a claim
about work performed — project covers, project galleries and process stages —
and all of those are still on placeholders. Service card slots have been
illustrations since phase 2 and were SVG line drawings until today.

**The raw sources are not committed.** They went to `photos-raw/`, which carries
a `.gitignore` of `*` and has always been out of the repo by design. The
processed output in `public/img/` is what ships.

## Supplier logos fetched, W7-03, 2026-08-31

**Nine of twelve landed. Three stayed as the text fallback**, each for a
different reason, none of them a decision I was entitled to make alone.

### Landed, with the source of every file

Source order was the card's: the brand's own press kit or media centre first,
the brand's own website second, Wikimedia Commons SVG third. **No file came from
a distributor, retailer or logo-aggregator site.**

| Slug | File | Source | Kind |
|---|---|---|---|
| `baumit` | `baumit.png` | `https://int.baumit.com/files/com/press/logo/Baumit-Logo.zip` -> `Baumit-Logo/Baumit_logo_frame-01.png` | **Official press kit**, from Baumit's own press-releases page |
| `technonicol` | `technonicol.svg` | `https://www.technonicol.com/local/media/img/logo_eng.svg` | Brand's own site. Latin-script variant, which suits an RO/RU site better than the Cyrillic one |
| `bilka` | `bilka.svg` | `https://www.bilka.ro/svg/logo-ro.svg` | Brand's own site |
| `novatik` | `novatik.png` | `https://www.novatik.ro/themes/frontend/site/assets/images/logo_21.png` | Brand's own site. PNG with alpha; no SVG published |
| `iko` | `iko.svg` | `https://www.iko.com/wp-content/uploads/2025/07/Logo.svg` | Brand's own site |
| `knauf` | `knauf.svg` | `https://upload.wikimedia.org/wikipedia/commons/2/2c/KNAUF_Logo_2024.svg` | Wikimedia Commons, **public domain** |
| `swisspor` | `swisspor.svg` | `https://upload.wikimedia.org/wikipedia/commons/b/b4/Swisspor_Holding_Logo.svg` | Wikimedia Commons, **public domain** |
| `ytong` | `ytong.svg` | `https://upload.wikimedia.org/wikipedia/commons/4/49/Ytong.svg` | Wikimedia Commons, **public domain** |
| `holcim` | `holcim.svg` | `https://upload.wikimedia.org/wikipedia/commons/5/50/Holcim_logo.svg` | Wikimedia Commons, **public domain** |

Seven SVG, two PNG. `baumit.png` has no alpha channel, but its background is
pure `#FFFFFF` (verified by decoding the first pixel) and the tile is `#FFFFFF`,
so it is visually identical to a transparent one. It was downscaled from
1765x1777 to 397x400; nothing else about any file was altered.

Every SVG was checked for `<script>`, `onload`, `onclick` and `javascript:`
before being committed. All nine are clean. They are referenced from `<img src>`,
where SVG script execution is blocked regardless.

### Stayed as text, and why

**`bosch` — usage terms forbid it.** Bosch's own legal notice states *"You agree
not to copy, use or otherwise infringe upon these marks and design elements"*
and that content *"may not be copied, disseminated, altered or made accessible
to third parties for commercial purposes."*
Source: `https://us.bosch-press.com/pressportal/us/en/imprint/legal-notice.html`.
This is the case the card named: terms visibly forbid third-party display, so
the brand is skipped and reported rather than decided on the owner's behalf.

**`ceresit` — no full-colour asset exists at a permitted source.** Henkel's own
DAM serves the Ceresit wordmark **in white on transparent**
(`https://dm.henkel-dam.com/is/image/henkel/ceresit-logo_638x148` and
`.../ceresit-logo`), which is invisible on a white tile. Confirmed by rendering
both on `#141414`, where the wordmark appears, and on `#FFFFFF`, where the tile
is blank. The card asks for a **full-colour** logo, and a white variant is not
one. Ceresit is not on Wikimedia Commons. Every colour version findable is on a
logo-aggregator site, which the source rule excludes. Recolouring someone's
trademark to fit our tile is not something to do unasked.

**`weber` — the brand does not publish a Weber mark.** The only logo
`https://www.ro.weber/` serves is `saint-gobain-logo.svg`, the Saint-Gobain
corporate logo, because Saint-Gobain has consolidated Weber under the masterbrand.
Putting the Saint-Gobain logo in a tile captioned "Weber" would misrepresent it.
`uk.weber`, `de.weber` and `fr.weber` all return 403. Not on Commons either.

### Two near-misses that were rejected

Wikimedia name collisions, both caught before download:

- **"Bilka"** on Commons is `File:Bilka (Unternehmen) logo.svg`, the **Danish
  hypermarket chain** owned by Salling Group, not the Romanian steel roofing
  manufacturer. The file that shipped is from `bilka.ro` and carries the
  Romanian tagline *sisteme pentru acoperișuri*.
- **"IKO"** on Commons is `File:Nichi-iko logo.svg`, a **Japanese
  pharmaceutical company**. The file that shipped is from `iko.com`, the
  roofing and waterproofing group.

A logo search matching the right word is not the same as matching the right
company. Both were caught by reading the file description before downloading.

### Verified at the real tile size

All twelve were rendered at exactly 200x80 in the production `.supplier` tile,
using the production stylesheet, in **both** states — greyscale at 60% opacity
and full colour — and screenshotted with headless Chrome. All nine logos are
legible in both states and all three fallbacks render as the styled brand name.

One note for the record: **Knauf is the faintest in the default state.** Its
`#00A0E6` blue greyscales to a light grey which, at 60% opacity on white, is
washed out. It is still legible and it goes to full colour on hover and focus.
If it ever reads as broken, the fix is to raise the default opacity for that one
file, not to alter the logo.

**Ytong is a filled orange block by design**, not a rendering fault. Its SVG
carries a full-canvas `#FDB813` polygon with the wordmark knocked out in black.
That is the real Ytong logo.

### Colour set unchanged

Brand logos are image assets, not CSS colour values. `src/styles.css` was not
touched by this card and the approved set stands at the same **10** values.

### Weight

92KB for all nine, the largest being `bilka.svg` at 31KB. Lighthouse stayed
100/100/100/100 on both locales; page heights are unchanged at 8,504px RO and
8,774px RU.

## Hero panel minimum long edge: 1600 -> 720, PROVISIONAL, W8-03, 2026-09-01

**This is provisional and is built to be raised again.** It exists only to let
one interim file through and is not a judgement that 720px is enough for a hero
image.

| | |
|---|---|
| Slot | `hero-panel`, 4:3, 1x 1400x1050, 2x 2800x2100 |
| Manifest asks for | a **2800px** source |
| Enforced floor before | **1600**, the global default (the slot had no override) |
| Enforced floor now | **720**, per-slot, provisional |
| File supplied | 720x540, exactly 4:3, already cropped, 144KB |

**Nothing else moved.** Only `hero-panel` carries this floor. The nine service
card slots stay at their own 1200 (W7-02) and every other slot, including all
**54 of 54** project covers and the 5 process stages, stays at 1600.

**To raise it:** delete `minLongEdge: 720` from the `hero-panel` entry in
`scripts/slots.js`, drop the real 2800px file into `photos-raw/`, and re-run the
pipeline. One line.

### Upscale, measured

| Variant | Written | From | Linear upscale | Area |
|---|---|---|---|---|
| `hero-panel.jpg` | 1400x1050 | 720x540 | **1.94x** | 3.8x |
| `hero-panel@2x.jpg` | 2800x2100 | 720x540 | **3.89x** | **15.1x** |

The source was not re-cropped: it is already exactly 4:3, so the pipeline's
centre crop was 720x540 -> 720x540 and discarded nothing.

### Honest read: acceptable at 1440 retina, but only just, and the @2x is waste

The panel renders in a 564x423 CSS px box. On a 1440 retina screen that box is
**1128x846 device pixels**, and the file carries **720px** of real detail. So
the image is supplying **64%** of the detail the display can show.

- **At DPR 1 it is fine.** 720px of detail into a 564px box is a surplus.
- **At DPR 2 it is visibly soft**, but not broken. Hard edges — scaffold poles,
  helmet rims, the lettering on the vest — lose their crispness, and the vest
  text is not readable. The photograph's own dust and haze hide much of it; on a
  clean, sharp subject the same upscale would look far worse.
- **Verdict: it ships, but it is not good.** It reads as a slightly soft photo
  rather than a defect, and it will not embarrass the page. A client looking
  closely on a MacBook will see it is not crisp. Replace it with the original
  when it arrives.

**The `@2x` file earns nothing and should probably not be written.** It is 369KB
of a 3.89x interpolation carrying no detail the 1x does not already have, and
the compressor had to walk all the way down to **quality 32** — the bottom of
the ladder — to fit it under the 400KB budget, which adds visible mottling to
the flat orange areas. Rendered side by side at 3x magnification, the q32 2x and
the q80 1x are near-indistinguishable; if anything the 1x is cleaner in flat
colour.

**Recommendation, not applied:** set `retina: false` on `hero-panel` until the
real source lands. Retina screens would then get the 1400x1050 at q80, which
looks the same or slightly better, and the page sheds 369KB. It was not applied
because the card asked for the file to be processed into the slot, and dropping
a variant is a change beyond that. It is a one-word change when wanted.

### Cost to the page

Performance went **100 -> 97** on the RO homepage, still clear of the 95 floor.
LCP went **0.7s -> 1.2s** and the LCP element is now this photograph, because
W6-03 renders a real hero photo eagerly with `fetchpriority="high"` precisely
because it is the LCP candidate. Total page weight went 1,352KB -> 1,763KB.

`public/img/hero-panel.svg` is **retained** (3,431 bytes) and is referenced
**zero** times in `dist/`.

## The hero panel alt text is now wrong, W8-03, 2026-09-01

Swapping the SVG for a photograph left the alt text describing the SVG. It is
wrong twice over and it was **not** changed here, because one half of the fix is
a product claim only the owner can make. Raised as Q-09.

| | |
|---|---|
| RO | `Ilustrație: casă la cheie construită de Rapid Construct` |
| RU | `Иллюстрация: дом под ключ, построенный Rapid Construct` |

1. It says **"Ilustrație" / "Иллюстрация"** — illustration. The slot now holds a
   photograph.
2. It says **a turnkey house built by Rapid Construct**. The photograph shows
   three workers in hi-vis vests on scaffolding around rebar in a dusty
   interior. It is not a finished house, and whether Rapid Construct built it is
   not something the repo knows.

A screen reader user currently receives a description of an image that is not
there. Fixing clause 1 needs no product knowledge; clause 2 does, so neither was
touched. See `docs/QUESTIONS.md` Q-09.

## The header pill is ratified; the master plan loses, W8-04, 2026-09-01

**Owner ruling on Q-06.** The header as built stands. The master plan's locked
decision was wrong, not the build, and the master plan has been corrected so the
contradiction no longer exists anywhere in the repo.

| | |
|---|---|
| The plan said | "White bar with accent. Solid, opaque, sticky. Not transparent, **not a floating dark pill**." Height 72px. |
| The build does | A `#FFFFFF` bar, 96px desktop / 80px mobile, opaque, fixed, 1px `--line` bottom border, carrying a `#141414` pill at `border-radius: 999px` that holds the nav, phone, CTA and language switcher. The pill is 64px, compressing to 56px on scroll. |
| Ruling | **The build wins. 96px stands.** |

**Why the build was right.** The clause the plan was protecting is met: the
header is opaque, so nothing overlaps section headings on scroll, which was
defect 4 in the plan's own list of reasons the first build was rejected. It is
also not *floating* — it is fixed with a constant `<body>` spacer, which is what
keeps document height stable during compression. What the plan ruled out was a
transparent or detached header; a dark pill sitting inside a solid white bar is
neither. Mihai approved this header in the phase 1 snapshot on 2026-08-28.

**What was changed in the plan**, both amendments marked inline with the date
and the reason, and neither deleting the original wording without recording it:

1. Section 3, locked decisions, the `Header` row: rewritten to describe the bar
   and the pill, and to note what the row used to say.
2. Section 5.1: height 72px corrected to 96px desktop / 80px mobile, with the
   pill's 64px -> 56px compression stated.

This is the first time the master plan has been edited rather than overridden by
a `DECISIONS.md` entry. It is the right instrument here: a stale *locked
decision* actively misleads the next executor, who is told to boot from the plan
and would read "not a floating dark pill" as a live instruction to go and
"fix" a header nobody asked them to touch. An override entry buried in this file
would not have prevented that.

## Bosch dropped from the supplier list, W8-04, 2026-09-01

**Owner ruling on Q-07.** Twelve brands become **eleven**. Bosch is removed
entirely: its tile, both locale entries, and its manifest row.

The reason is the one recorded in W7-03: Bosch's own legal notice states third
parties *"agree not to copy, use or otherwise infringe upon these marks"*, so no
logo could ever legitimately land in that slot. A permanently empty tile is
worse than no tile.

`ceresit` and `weber` stay as text fallbacks and Q-07 remains open for those two
only. Neither is blocked by terms: Ceresit has no full-colour asset at a
permitted source, and Saint-Gobain publishes no Weber mark. Both are resolvable
by asking a supplier rep for a brand pack.

**The marquee loop was retuned, not just shortened.** Eleven brands rendered
twice is 22 tiles at 4,904px, so the duration moves 72s -> **66s** to hold the
same 37px/s the loop has run at since phase 1. The `-50%` seam is
count-independent — it lands on the boundary whatever the brand count — so
dropping a brand cannot open a gap or cause a jump; only the apparent speed
would have drifted, and that is now corrected.

## Q-02, Q-03, Q-05 and Q-08 closed, W8-04, 2026-09-01

- **Q-02 ratified**: six projects per service, 54 total. No change.
- **Q-03 ratified**: stub projects carry a cover slot and no gallery slots. No
  change. This is what holds the manifest at 105 slots instead of 216.
- **Q-05 resolved by W7-02**: the nine root `svc-*.png` were the service card
  artwork; they were processed and all nine cards now render photographs.
- **Q-08 confirmed**: the supplier list is real, and is now the eleven brands
  remaining after Bosch was dropped. This also closes Q-01.

**Q-04 stays open**: the 44 stub projects still have no content, and they stay
invisible until they do.

## The marquee has jumped 12px every cycle since phase 1, W8-04, 2026-09-01

Found while verifying the wave 8 acceptance line "marquee still loops cleanly at
eleven brands, no gap, no jump". It did not loop cleanly, and the brand count had
nothing to do with it.

**The bug.** `.marquee__track` used `gap: 24px`. Flexbox puts **n-1** gaps
between n tiles, but the `-50%` keyframe assumes the second copy of the list
begins at exactly half the track width, which needs a **trailing** gap after the
first copy. It was always short by half a gap:

| Brands | Tiles | Track width | -50% lands at | First duplicate sits at | Jump |
|---|---|---|---|---|---|
| 8 (phase 1) | 16 | 2,920px | 1,460 | 1,472 | **12px** |
| 12 (wave 6) | 24 | 5,352px | 2,676 | 2,688 | **12px** |
| 11 (wave 8, before fix) | 22 | 4,904px | 2,452 | 2,464 | **12px** |

Always `gap / 2`. Every 66 seconds the row snapped sideways by 12px. Subtle
enough to survive three waves of review, including mine.

**The fix.** `gap: 24px` on the track becomes `margin-right: 24px` on
`.supplier`. That gives n gaps including a trailing one, so half the width falls
exactly on the first duplicate. Measured after the change: track 4,928px, -50%
lands at 2,464, first duplicate at 2,464, **mismatch 0.0px**.

**Why it is now count-independent.** With a trailing margin the track is always
`2n x (tile + margin)` and half of that is always `n x (tile + margin)`, which is
the offset of tile n. Adding or dropping a brand can never reopen the jump.

Duration moved 72s -> 66s in the same change to hold the loop at ~37px/s with
eleven brands rather than twelve.

## Two suppliers swapped: Ceresit -> CAT, Weber -> Heidelberg Materials, W9-01, 2026-09-01

Owner request. The list stays at **eleven**.

| Out | In | Logo |
|---|---|---|
| `ceresit` | `cat` (CAT) | **None. Text fallback.** |
| `weber` | `heidelberg-materials` (Heidelberg Materials) | `heidelberg-materials.svg`, from the brand's own site |

**Heidelberg Materials landed.** Sourced from
`https://www.heidelbergmaterials.com/sites/default/files/logo/HeidelbergMaterials.svg`
— the brand's own website, which outranks Wikimedia under the W7-03 source
order. Clean SVG, 986.5x283.5, green `#004E2B` / `#00DD39` on white, no script
or event handlers. Their imprint states no restriction on third-party use of
their marks, only a general copyright line.

**The name has changed and the tile uses the current one.** The request said
"HeidelbergCement AG". That company **renamed itself Heidelberg Materials in
September 2022**; the logo it publishes reads *Heidelberg Materials*, and the
legal entity is Heidelberg Materials AG. The tile is labelled **Heidelberg
Materials** so that the visible logo, the `alt` text and the accessible name all
agree. Labelling it "HeidelbergCement AG" over a logo reading something else
would mislead a screen reader user and show a retired brand. One word to change
back if that is wrong.

**CAT could not land, and it is the same blocker that removed Bosch.**
Caterpillar's standard trademark notice reads:

> "CAT, CATERPILLAR, BUILT FOR IT, Olympian, their respective logos,
> 'Caterpillar Yellow,' and the 'Power Edge' trade dress, as well as corporate
> and product identity used herein, are trademarks of Caterpillar and **may not
> be used without permission**."

`cat.com` and `caterpillar.com` both return `403 Access Denied` to automated
requests, so the notice was confirmed from a Caterpillar dealer page that
reproduces it verbatim. Under the standing rule — terms visibly forbid
third-party display, so skip, keep the text fallback and report rather than
decide for the owner — CAT ships as text.

**Net effect on the marquee: it went from two text tiles to one.** Ceresit and
Weber were both text; CAT is text and Heidelberg Materials is a logo. Ten of
eleven tiles now carry a logo.

The 22-tile loop is unchanged and the seam stays exact: with the W8-04
trailing-margin fix the track is `2n x (tile + margin)` for any n, so swapping
brands cannot reopen the 12px jump.

## Social profiles in the footer bar, W9-02, 2026-09-01

Instagram, Facebook and TikTok, added to the **footer bar** — the bottom strip
that already carries the copyright and the privacy link.

| Platform | Profile | Verified |
|---|---|---|
| Instagram | `rapid.construct` | `200` |
| Facebook | `rapidconstructofficial` | Renders `<title>Rapid Construct \| Facebook</title>` |
| TikTok | `@rapid.construct` | `200` |

Facebook answers `400` to automated requests whether or not a page exists — a
deliberately nonexistent handle returns `400` too — so the status code proves
nothing and the profile was confirmed by rendering it in headless Chrome.

**Why the bar and not the contact column.** The contact column was the obvious
home and it was built there first, then moved. Measured: in the column the row
cost **70px** of page height; in the bar it costs **1px**. The bar was already
62px tall with about 700px of unused width, and a negative block margin lets the
44x44 targets overlap its existing padding instead of growing it. The homepage
had 196px of headroom against the 8,700px cap, so 70px was a third of it for a
row of three icons. RO went 8,504 -> **8,505px**.

**44x44 targets** clear the WCAG 2.5.8 minimum with room to spare, and the
negative margin does not shrink the hit area, only the space it claims in flow.

**Monochrome, and deliberately so.** The icons are drawn in `currentColor`,
white on `#141414`, hover and focus moving to `--brand`. Instagram, Facebook and
TikTok brand colours would have added at least three values to a palette fixed
at ten. WhatsApp's green is in the set as a documented exception for the
floating button; three more would stop being exceptions and start being a
second palette. **Colour count after this card: still ten.**

The wrapper is a `<nav>` carrying the localised label, not a `<div>`: an
`aria-label` on a generic `div` with no role is not exposed to assistive
technology, so as a `div` the label would have been dead markup.

Links are `target="_blank" rel="noopener noreferrer"`, matching the existing
outbound pattern used by the WhatsApp button and the Google review link.

## CAT replaced with Liebherr; every tile now carries a logo, W9-03, 2026-09-01

Owner authorised choosing a comparable brand, on the condition that it comes
with a logo like the rest. **Liebherr.** The marquee now has **zero text
fallbacks for the first time**: eleven brands, eleven logos.

**Source:** `https://upload.wikimedia.org/wikipedia/commons/6/66/Liebherr_logo.svg`,
Wikimedia Commons, **public domain**, described as the logo of the
Switzerland-based German equipment manufacturer. 1,772 bytes, 600x81, no script
or event handlers.

**Terms checked before shipping.** Liebherr's legal notice at
`liebherr.com/en/gbr/legal-notice/legal-notice.html` states **no restriction**
on third-party use of its marks. That is the same posture as Heidelberg
Materials, Baumit and the rest of the list, and the opposite of Bosch and
Caterpillar.

### Why Liebherr and not JCB or Komatsu

All three were downloaded, rendered at the real 200x80 tile in both states, and
checked. All three are public domain on Commons and all three are credible
peers. The deciding factor was **which company's terms I could actually read**:

| | Fit | Terms |
|---|---|---|
| **Liebherr** | Top-three global heavy equipment maker alongside Caterpillar and Komatsu. Excavators, wheel loaders, dozers, cranes **and concrete technology**, so it covers both the earthworks and the structural side of what Rapid Construct does. European, like the rest of the list | **Legal notice located and read. No restriction stated.** |
| JCB | Visually the closest to CAT — yellow livery, backhoes and excavators, very common in Eastern Europe. The most dramatic hover reveal of the three | **Could not verify.** `jcb.com` terms pages 404. The one legal page that exists is a fraud notice about people misusing the JCB name, which signals an actively policed mark |
| Komatsu | Credible global peer, clean blue wordmark | Not pursued once Liebherr cleared |

Two brands have already had to be dropped for exactly this reason, so between
two otherwise equal candidates the one whose terms are verified wins. JCB was
the more striking tile and it was not chosen on that basis alone.

**A name collision worth recording.** Searching JCB's terms returns
**JCB Co., Ltd.**, the Japanese *credit card* company — `global.jcb`,
`account.jcb.com`, `jcbusa.com` are all the payment brand, not
J.C. Bamford Excavators. `jcbusa.com` in particular reads like a construction
site and is not one. Same trap as the Commons "Bilka" being a Danish
hypermarket and "IKO" a Japanese pharmaceutical company.

**Liebherr's mark is monochrome**, so its hover state goes light grey to solid
black rather than grey to colour. It is a clear, visible change and it reads as
deliberate next to the coloured tiles.

**Colour set unchanged at ten.** A logo is an image asset, not a CSS value.
