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

## The five "Cum lucrăm" step photos, W10-01, 2026-09-01

All five process slots are filled. The section no longer shows labelled
placeholders.

**Where they were found.** `dist/img/Cum Lucram/`, named in Romanian
(`Fundatie.jpeg`, `Structura si ziduri.jpeg`, `Acoperis.jpeg`, `Fatada.jpeg`,
`Finisaje si predare.jpeg`). They map one-to-one onto the five slots and the
content matches the step copy exactly: a foundation slab with rebar, brick
columns going up, a finished tiled roof, façade work with a worker on a ladder,
and a finished house. Copied into `photos-raw/` under their slot IDs.

**`dist/` is build output.** It is gitignored and regenerated, so files left
there are not in the repo and would be lost by a clean checkout. `photos-raw/`
is the pipeline's front door and is where drops belong. The originals now live
in both places on this Mac and in neither in git, which is by design — the
`photos-raw/README.md` says the processed output in `public/img/` is what ships.

### Minimum long edge for the five step slots: 1600 -> 900, PROVISIONAL

Every one of the five is under the manifest's 1600px floor, so it is the same
kind of ruling as W7-02 (service cards, 1200) and W8-03 (hero panel, 720).
**Only the five step slots moved.** All 54 project covers remain at 1600.

| Slot | Supplied | Long edge | Orientation |
|---|---|---|---|
| `step-01-fundatie` | 1136x852 | 1136 | landscape, **already exactly 4:3** |
| `step-02-structura` | 736x981 | 981 | **portrait** |
| `step-03-acoperis` | 1365x768 | 1365 | landscape |
| `step-04-fatada` | 864x1152 | 1152 | **portrait** |
| `step-05-predare` | 896x1194 | 1194 | **portrait** |

### The 1600 floor is the wrong test for this slot, and that is the real finding

A step card renders at **209x157 CSS px**. At retina that is 418x314 device
pixels. The smallest source, `step-02` at 736px wide, therefore supplies **176%
of what a retina screen can show**. These are not marginal images at their
display size; they are comfortably oversupplied.

That is the opposite of the hero panel, which supplies 64% of its box. The 1600
floor was written for large slots and is simply not the right bar for a card
this small.

### Three are portrait, and the centre crop survived it

`process-photos.js` warned on all three, correctly. Reviewed frame by frame
against the sources:

| Slot | Crop | Verdict |
|---|---|---|
| `step-01` | 1136x852 -> unchanged | Already 4:3. Nothing discarded. |
| `step-02` | 736x981 -> 736x552, **44% of height gone** | Fine, arguably better. The brick corner and rebar fill the frame; only sky and part of the base were lost. |
| `step-03` | 1365x768 -> 1024x768, **25% of width gone** | Fine. The house centres better than in the wide original. |
| `step-04` | 864x1152 -> 864x648, **44% of height gone** | Fine. The worker on the ladder and the render work are both kept. |
| `step-05` | 896x1194 -> 896x672, **44% of height gone** | Acceptable, the tightest of the five. The roofline now sits close to the top edge; the house is still whole and readable. |

Nothing important was cut in any of the five. That was not a given with three
portrait sources and it is worth re-checking if any of them is ever replaced.

### Cost: RU performance is at the floor, 95, for the first time

| | Before | After |
|---|---|---|
| Homepage RO | 8,505px, perf 98 | **8,505px, perf 99** |
| Homepage RU | 8,775px, perf 100 | **8,775px, perf 95** |
| Total page weight | ~1,670KB | **~2,735KB** |

Heights did not move: the slot boxes are aspect-ratio driven, so a real photo
replacing a placeholder changes nothing in layout. CLS 0.002 / 0.012.

**RU at 95 clears the floor with nothing to spare, and that should not be left
without a stated remedy.** The five photos add 2,734KB across ten files, of
which **1,698KB is the `@2x` set**.

**Those `@2x` files are pure waste at this slot.** The box needs 418 device
pixels at retina and the 1x is already 900px, more than double. A retina browser
fetches the 1800px file and gains nothing visible, and four of the five 1800px
files are upscales of sources smaller than 1365px, so there is no extra detail
in them to gain.

**Recommendation, not applied:** set `retina: false` on the five step slots and
drop the `srcset` from those five `<img>` tags. That removes about 1,698KB with
no visible quality loss at any device pixel ratio, and would put RU back near
100. It was not applied because the card was "upload these five", and removing
image variants and editing the template is a different change.

---

## W9-04 · Portfolio content from the real photo set (owner rulings R-A to R-G)

Forty-six photographs arrived in `Services_real images/`, nine folders, one per
service. Every folder mapped to a service slug; none was unmatched. The set
broke three standing rules at once, so the owner ruled on all of them together.
The seven rulings below are his, verbatim in substance, and this section records
what each one cost and what it bought.

### R-A · Provisional `minLongEdge` of 900 for project slots

Thirty-six of the forty-six sources were under the manifest's 1600px floor, the
worst at 350x350. The floor stays in `slots.js` as the default; project cover
slots lower their own bar to 900, the same device already used by W7-02 (1200),
W8-03 (720) and W10-01 (900).

**Interim, not a judgement that 900 is enough.** It is to be raised when better
originals arrive.

### R-B · Never upscale, and it overrides target sizes

A generated variant may not exceed what its source actually contains. Applied
strictly: the bar is the **cropped** source, not the raw long edge, because the
crop happens first and a 600x900 portrait cropped to 4:3 holds 600x450 real
pixels no matter what its long edge says.

Implemented in `process-photos.js` as a clamp inside `render()`, so it holds for
every slot rather than only for the ones added by this card.

**This is retroactive, and it caught nineteen variants already shipped.** The
existing files were generated before the rule existed and several are largely
invented pixels:

| Variant | Was | Real content | Upscale |
|---|---|---|---|
| `hero-panel@2x` | 2800x2100 | 720x540 | **3.89x** |
| `hero-panel` | 1400x1050 | 720x540 | 1.94x |
| `step-02-structura@2x` | 1800x1350 | 736x552 | 2.45x |
| `step-05-predare@2x` | 1800x1350 | 896x672 | 2.01x |
| `step-04-fatada@2x` | 1800x1350 | 864x648 | 2.08x |
| `step-03-acoperis@2x` | 1800x1350 | 1024x768 | 1.76x |
| `step-01-fundatie@2x` | 1800x1350 | 1136x852 | 1.58x |
| `step-02`, `step-04`, `step-05` at 1x | 900x675 | 736-896 wide | 1.00-1.22x |
| `svc-*@2x`, all nine | 1600x1200 | 1448x1086 | 1.10x |

**No layout moved.** The clamp preserves the crop, and the crop is already at
the slot's ratio, so every clamped file keeps 4:3 exactly. The `width`/`height`
attributes in the template still describe the right ratio, so CLS is unchanged.
What changed is that the files stopped claiming detail they never had, and the
page got lighter for free.

### R-C · Project covers move from 3:2 to 4:3

Thirty-one of the forty-two survivors are portrait. At 3:2 a 896x1195 portrait
keeps 50% of its height; at 4:3 it keeps 56%. The ratio change is worth about
six percentage points of every portrait frame, and it aligns project covers with
the service cards and the step photos, which were already 4:3.

Cost: `media--3x2` is now used by nothing. It is left in `styles.css` rather
than deleted, on the same reasoning as the retained fallback SVGs.

### R-D · Four files struck from the set

| File | Reason |
|---|---|
| `Finisaje` 350x350 | Too small. Below any usable crop. |
| `Finisaje` 1200x800 | Fails master plan section 7, "real Rapid Construct work only". Studio-lit, staged, a model in unmarked painter's whites. Reads as stock. |
| `Construcții industriale` 1200x1200 | Fails the same rule. Timber and bamboo propping, eucalyptus, dress not consistent with a Moldovan site. |
| `Reparatii` `image (73).png` | A two-panel before/after composite, not a photograph, and its provenance is unconfirmed. |

Forty-two remain. **The rule that six invented projects never reached `dist/`
is the same rule that struck these four**; it now applies to photographs as well
as to copy.

### R-E · One file moves service

`Instalații` 1200x1600 shows a galvanised metal frame for a suspended ceiling.
That is finishing work, not utilities. Moved to `finisaje`. Finisaje therefore
carries four covers and instalatii four.

### R-F · One image, one project cover. No gallery processing

`build.js` renders `p.cover` and nothing else. The `gallery` arrays exist in the
data and `process-photos.js` accepts the slot IDs, but **no template outputs a
gallery image anywhere on the site.** Processing into gallery slots would have
written eighty-odd files no visitor could ever reach.

So each photograph becomes one project cover. Forty-two photographs, forty-two
renderable projects, six slots per service and five or fewer used in every
service, so nothing overflows.

### R-G · The homepage portfolio picks one project per service

`build.js` took `.slice(0, 6)` in file order. With five real projects that
happened to yield five different services. With forty-two it would have yielded
**six `case-la-cheie` cards**, and the category chip under each card would have
read the same word six times.

Replaced with a first-per-service pick over `SERVICE_SLUGS`, capped at six. The
six cards are now six different services by construction, in the same order as
the services grid above them.

### The sizes, derived rather than chosen

At a 1440 viewport the container is capped at 1200px with a 24px gutter, so the
row is 1152px. A `grid--3` at a 24px gap gives 368px columns, and the card's 1px
border leaves the media box at **366px**. The service page gallery uses the same
`grid--3` and the same `.card`, so both boxes are identical: **366 x 275** at
4:3.

| | Target | Covers |
|---|---|---|
| 1x | **400 x 300** | the 366px box natively, plus the 2-column tablet break |
| 2x | **800 x 600** | 366 at device-pixel-ratio 2 (732), with headroom |

**Deliberately smaller than the `svc-*` convention of 800/1600**, which fills
the same 366px box. There are forty-two of these and nine of those; at this
count the weight matters more than the headroom does, and W10-01 already
recorded that the 1800px step variants were "pure waste at this slot".

Against the forty-two sources under R-B:

- **1x 400px: native for all 42.** The smallest 4:3 crop in the set is 600x450,
  half again larger than the 1x needs.
- **2x 800px: 29 files at full size, 13 clamped to their own crop** — one at
  600, one at 676, nine at 736, one at 780, one at 789.
- **Files requiring any upscale: zero.**

### Crop anchor, per project

A centre crop is wrong for a roof and wrong for a foundation. `process-photos.js`
gained a `cropAnchor` of `top`, `centre` or `bottom`, applied through the
`--cropOffset` flag that `sips` has carried since macOS 13, and every project
carries the anchor chosen from what actually matters in its frame. Roofs and
ceilings anchor top, excavation and screed anchor bottom, everything else
centres.

### Descriptions describe the work, not the photograph

Owner instruction, and it is the right one. No description opens with "imagine",
"vedere" or "fotografiat", and none contains "in prim-plan". Each leads with
what was built or done. The nine approved A-02 samples were rewritten to the
same standard rather than kept as they were.

**Nothing was invented.** No client, no surname, no locality, no year, no square
metres, no duration, no cost, no warranty, no brand. `location` is empty on all
forty-two: the owner has not supplied a locality list, and under master plan
section 6 an unsourced field is omitted, never filled. `year`, `area_sqm`,
`duration`, `main_materials` and `challenge` are empty for the same reason.

Two things were left out rather than guessed. A legible manufacturer name on the
excavator in the terasamente set: described as "excavator pe pneuri", because
the brand is not the work. Two small red fittings on a wall in the ceiling-frame
photograph: omitted entirely, because they could not be identified with
confidence and naming them would have been a spec nobody sourced.

---

## W9-05 · Form delivery: the subject line, and a quoting bug it uncovered

### The wiring was already correct, and needed no code change

`.github/workflows/pages.yml` already passes `WEB3FORMS_KEY: ${{ secrets.WEB3FORMS_KEY }}`
into the build step. `build.js` reads it, sets `FORM_ARMED`, and switches the
form `action` from `#oferta` to `https://api.web3forms.com/submit`. **Adding the
repo secret arms the form on the next push and nothing else has to happen.**

A honeypot was also already in place on all three forms — the homepage form, the
service-page form and the lead modal. It is Web3Forms' own `botcheck` field,
wrapped in `.honeypot`, which is `position: absolute; left: -9999px` inside a
1x1 `overflow: hidden` box, `aria-hidden="true"` and `tabindex="-1"`. Measured in
a real browser: the input sits at x = -9995 and is off screen, unreachable by
keyboard and invisible to assistive technology. Nothing to add.

### The subject line did not identify the locale, only the language

It read `{{form.h2}} — rapidconstruct.md`, which is a localised string, so an RO
lead and an RU lead were told apart only by which alphabet the heading was in.
That is a thing a human has to decode rather than scan, and it says nothing at
all about which page produced the lead.

Now every form emits an explicit tag and the exact source path:

| Form | Subject |
|---|---|
| Homepage, RO | `[RO] Solicită ofertă gratuită — /` |
| Homepage, RU | `[RU] Запросите бесплатную оферту — /ru/` |
| Lead modal, RO | `[RO] Te sunăm noi — /` |
| Service page, RO | `[RO] Acoperișuri — /servicii/acoperisuri/` |
| Service page, RU | `[RU] Земляные работы и выемка грунта — /ru/servicii/terasamente/` |

**The path carries no host on purpose.** `SITE_URL` is the GitHub Pages origin
in CI today and the production domain has not landed, so a hostname in the
subject would be wrong for one of the two. A path is true under either, and the
`from_name` already says Rapid Construct.

### The demo notice is now absent when armed, not merely hidden

It was emitted as `data-demo="..."` on every build and only *displayed* when
`data-armed !== "1"`. The string therefore sat in the HTML of a live, armed
site. `build.js` now emits the whole attribute or nothing.

**That change failed the first time, and the failure is worth recording.** The
new variable holds an attribute, ` data-demo="..."`, not an attribute value, and
the template substitution escapes every value it inserts unless the key is in
`RAW_KEYS`. So the quotes became `&quot;` and the browser parsed
`data-demo=&quot;Formularul` as an empty attribute followed by a stray one. The
notice truncated at its first space and read **"Formularul"**.

Nothing in the build caught it: the HTML was well-formed, `check-links.js` was
clean, and the placeholder guard in the workflow only looks for surviving `{{`.
**It was caught by submitting the form in a headless browser and reading the
message back**, which is the only check that was ever going to find it. The key
is now in both `RAW_KEYS` and `SVC_RAW_KEYS`, and its inner text is escaped
where it is built.

### Verified in a browser, both paths, both locales

| | Disarmed | Armed |
|---|---|---|
| `data-armed` | `0` | `1` |
| Network | **nothing posted** | `POST https://api.web3forms.com/submit` |
| RO message | "Formularul se activează la publicarea site-ului." | "Nu am putut trimite mesajul. Sună-ne la +373 76 837 180." |
| RU message | "Форма будет активирована при публикации сайта." | "Не удалось отправить сообщение. Позвоните нам: +373 76 837 180." |

The armed run used an all-zero key, so Web3Forms rejected it and the **error**
state is what is shown above. Success and failure are the same branch, split on
`data.success`, so the success path is reached the moment a valid key is used.

### The access key does not leak

With a key set, it appears **only** in `<input type="hidden" name="access_key">`
— the field Web3Forms requires — twice on each homepage (form plus modal) and
once on each service page. Nowhere else in any page, in `main.js`, or in any
data attribute.

### Still owed: the two live submissions

B-01 asks for one real submission from the live RO site and one from the live RU
site, with the arriving subject lines reported. **Not done, and it cannot be
done from here.** It needs two things that are not mine to do: the real
`WEB3FORMS_KEY` present in repo secrets, which is not readable from a checkout,
and a merge to `main`, which is a publish. See QUESTIONS Q-W9-06.

---

## W9-08 · Extractable structure on the service pages (C-02, C-03)

### FAQ: written once, read by both

Four questions per service page, eighteen pages, seventy-two answers. The
visible FAQ and the `FAQPage` JSON-LD are generated from **the same locale
strings**, so they cannot drift; a check across all eighteen pages confirms the
schema text is character for character the text on the page, which is also what
Google requires of the markup. There is no second copy of anything written for
an answer engine, and nothing is chunked into fragments: ordinary `h3` plus `p`.

**No fact in any answer is new.** Each one is assembled from the service's own
one-liner, the six `trust` items, the five `process` steps, `band.coverageLine`,
the two hero price lines, and the thirty-four project descriptions written in
W9-04 — which is what makes the answers differ from service to service instead
of nine copies of the same guarantee paragraph.

### The Russian answers are 31 to 39 words, not 40 to 60

C-02 asks for 40 to 60 words. **Every Romanian answer is inside that range. No
Russian one is**, and that is not an oversight.

Russian carries the same content in roughly a fifth fewer words: no articles,
and none of the `de`/`la`/`în` chains Romanian needs. A faithful translation of
a 47-word Romanian answer lands near 37. The two instructions in play — 40 to 60
words, and "faithful translations, not rewrites" — cannot both hold, and padding
the Russian to reach 40 would produce exactly the rewrite the second one forbids.

Faithfulness won. The Russian answers say everything the Romanian ones say.
Padding them is a mechanical change if the count matters more.

### Tables on six services, and none invented for the other three

C-03 says one table per service page **where the content already supports one**,
and not to fabricate one to have one. Six do: case-la-cheie (the five process
steps, which are literally this service), acoperisuri, fatade, finisaje,
instalatii and terasamente, each built from its own projects and one-liner.

Three do not, and were left without:

| Service | Why there is no table |
|---|---|
| `reparatii` | Two projects. The one-liner names two endpoints, demolition and finishing. Three thin rows would be a table for the sake of having one. |
| `proiectare-3d` | The one-liner yields two rows, 3D views and paper plans. Not a table. |
| `industrial` | No projects at all, and the page is `noindex`. Nothing to tabulate. |

Every table scrolls inside its own `overflow-x` box, so a long row can never be
the reason the page body scrolls sideways. Checked at 1440, 1024, 768 and 390.

### "Actualizat" is a content date, not the wall clock

C-03 says the visible date should be driven by build time. It is driven by the
**same git content date the sitemap `lastmod` uses**, and that is a deliberate
departure.

A visible "Actualizat" that moves on every deploy — including a deploy that
changed nothing on that page — is worth less than no date at all, and it would
contradict the `lastmod` the same build writes for the same URL. One of the two
would be lying. Now they agree, and both move only when something that renders
into that page actually changes. Switching to literal build time is one
expression if that is preferred.

### The hero lede is now the direct answer

C-03 asks each service page to open with a direct 40 to 60 word answer to what
the service is and what it includes, **before any marketing**. The hero
previously opened on the service one-liner, which ends on a claim
("Montate corect, ca să nu curgă niciodată"). The answer replaced it there.

**The one-liner is not deleted.** It still carries the meta description, the
og:description, the homepage service card and the `Service` schema. What changed
is that the page no longer *opens* on it.

### Sibling links, from the order the work actually happens

Every service page carries exactly two contextual links to sibling services, in
a sentence, not a footer list. The pairs come from the `process` order —
terasamente to fundație to structură to acoperiș to fațadă to finisaje — so the
sentence says something true about sequence rather than "you may also like".
Verified: eighteen pages, two links each, none pointing at itself.

### The height budget was the binding constraint, and what paid for it

Adding two sections cost roughly 384px of section padding alone, and ten of the
eighteen service pages went over 6,000px, the worst by 333px. What was cut:

- Both new sections run at `--band-pad` (56px) rather than `--section-pad`
  (96px). They are supporting content around the projects, not bands of their
  own. **160px.**
- Project descriptions on the service page clamp to six lines, as the homepage
  ones clamp to four. Eleven to thirteen lines of text in a 366px card is not a
  card. **270 to 380px**, and the full summary stays in the DOM for a screen
  reader and a crawler *and* is the `description` of that project's ImageObject
  in the page's own JSON-LD, so nothing is hidden from anything that reads.
- FAQ gaps 24 to 18px, table cell padding 16 to 13px. **~110px.**

Result: the worst page is now 5,685px against 6,000, and the largest single
service page fell from 6,333px to 5,685px while gaining a table and four
questions.

### A build failure that a gate did not catch, and why

`svcFaqSection` called `lastmodOf` before its definition — the lastmod helpers
sat in the static-assets block, which runs after the service-page loop. `node
build.js` died with a `ReferenceError` and wrote nothing.

`node scripts/check-links.js` then reported **zero dead links**, because it was
reading the `dist/` from the previous successful build. That is not a defect in
check-links, it is what CLAUDE.md section 9 already prescribes against by
writing the gate as `node build.js && node scripts/check-links.js`: the `&&` is
load-bearing. It was missed here because the build output was piped through
`grep`, which made the shell see grep's exit status instead of node's.

**Piping `node build.js` through anything discards its exit code.** Run the two
commands chained with `&&` and unpiped, exactly as section 9 writes them.
