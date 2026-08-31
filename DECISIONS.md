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
