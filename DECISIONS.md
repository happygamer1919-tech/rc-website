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
