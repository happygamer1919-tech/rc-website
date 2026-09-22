# CLAUDE.md — Rapid Construct website

Standing rules for the `rc-website` repo. **Rules only, never state.** Anything
that changes as the build progresses (what has shipped, what is measured today,
what is still open) lives in the four files under *Ground truth* below.

Every rule here is derived from something already committed. The **Source**
column says where, so a rule can always be checked against the thing that
created it rather than against this file.

---

## 1. Motion

> Motion never delays or captures scroll. It fires once. It runs under 400ms
> and travels under 20px. It animates opacity and transform only. Nothing above
> the fold animates. It is fully disabled under `prefers-reduced-motion`. There
> is no animation library.

That is the whole rule. What satisfies each clause today:

| Clause | How it is met | Source |
|---|---|---|
| Never delays or captures scroll | No `wheel`, `touchmove` or `scroll` handler calls `preventDefault`. Both scroll listeners are registered `{ passive: true }`, so they cannot block scrolling even in principle | `src/main.js`, RELEASE-NOTES "Motion (phase 2)" |
| Fires once | `IntersectionObserver` with `unobserve` on first fire. Reveals never repeat on scroll back up | `src/main.js` |
| Under 400ms | Every duration is a token, and the tokens are the only place they are written | `--reveal-dur`, `--hover-dur`, `[data-stagger]` in `src/styles.css` |
| Under 20px travel | Travel distances are set where the rules are | `[data-reveal]` and `:hover` rules in `src/styles.css` |
| Opacity and transform only | `[data-reveal]` transitions `opacity` and `transform`. Nothing animates layout, colour or size | `src/styles.css` |
| Nothing above the fold | Nothing in the header or the hero animates. The header is `position: fixed` and `<body>` carries a **constant** spacer for it, so the pill's compression on scroll is purely visual and never shortens the document. A sticky header keeps its box in flow; compressing it shunted every section up mid-scroll, which is why it is fixed | RELEASE-NOTES "Motion (phase 2)", `src/styles.css` |
| Fully disabled under reduced motion | Reveals render final, hover travel removed, marquee stopped dead, header does not animate, modal has no entrance | `@media (prefers-reduced-motion: reduce)` at the foot of `src/styles.css` |
| No animation library | The repo has no `package.json` and no dependencies at all | Master plan section 8 |

**The stricter parent rule still holds:** zero *scroll-driven* motion. No
parallax, no scroll sequences, no count-up numerals, no auto-advancing
carousels. The predecessor build was rejected over a scroll-driven section whose
measured height is recorded in the master plan, and it is deleted, not reworked.
*Source: master plan sections 1 and 10.*

A pause on hover or focus is a state change on an existing animation, not new
motion, and is allowed. It must stay pure CSS `animation-play-state` so that no
handler exists to interfere with scrolling.
*Source: DECISIONS.md, W6-01.*

---

## 2. Height budgets

Measured at a desktop width, settled, with every reveal applied.

| Page | Budget lives in |
|---|---|
| Homepage RO and RU | ~~DECISIONS.md, ruling R-J~~ **AMENDED (W14-13): `docs/rulings/R-Y.md`, ruling R-Y** |
| Țiglă metalică, copertine and garduri pages, either locale | **`docs/rulings/R-Y.md`, ruling R-Y** |
| Catalog category pages, either locale | **`docs/rulings/R-Y.md`, ruling R-Y**, its latest dated block for those pages |
| Service pages, either locale | **RELEASE-NOTES.md, wave 7 acceptance** |

The homepage budgets are **derived, not chosen**: a corrected baseline plus the
measured cost of each element above the fold plus a stated headroom term. R-J
carries the derivation, the current figures, and the revert values for when the
promo bar or the 100+ tile is removed by data. Read them there. **AMENDED
(W14-13): R-J keeps the method; the current figures and the revert values are
now ruling R-Y's, which also holds the three product pages.**

They have been superseded three times, by R-I, then by R-J, then by R-Y, and this file has
already carried a stale copy once. Per R-Q it now carries the pointer only.

**Measure it the same way every time.** An unrevealed `[data-reveal]` is
translated down by its travel token, which inflates `scrollHeight` until it
fires, and measuring before the reveals settle reads high by roughly the sum of
those offsets:

    document.querySelectorAll('[data-reveal]').forEach(n => n.classList.add('is-revealed'));
    // wait ~1.5s for the staggered transitions, then:
    document.documentElement.scrollHeight

No section may exceed 1,400px, with ~~two~~ **three** standing exceptions: the services grid
and the portfolio grid, which are the same object and cannot fit nine and six
cards respectively under the cap.
*Source: master plan section 10, DECISIONS.md "Approved exceptions".*

**AMENDED (W24-R4, wave 24): the catalogue grid is the third exception.** A catalogue
category page renders every product in its category, which is as many as 64 cards, and
no cap can be met by a grid whose length is data. The cap still holds on every other
section. **And every page changed or created in wave 24 takes a new budget of measured
plus 60 at ship**, recorded in `docs/rulings/R-Y.md` with the measurement it came from.
*Source: DECISIONS.md, W24-R, ruling R4.*

---

## 3. Colour

**Ten values. Adding an eleventh is a change to this file, not a change to a
stylesheet.**

| # | Value | Token | Use |
|---|---|---|---|
| 1 | `#F65308` | `--brand` | Primary buttons, active states, numerals, focus rings |
| 2 | `#B23C08` | `--brand-dark` | Eyebrows, link hover, the category chip fill |
| 3 | `#1A1A1A` | `--ink` | Body and heading text on light |
| 4 | `#5A5A5A` | `--ink-muted` | Secondary text, captions, form hints |
| 5 | `#FFFFFF` | `--bg-light` | Section background A, white tiles, text on dark |
| 6 | `#F2F2F2` | `--bg-grey` | Image placeholder fill only, never a section |
| 7 | `#141414` | `--bg-dark` | Section background B, white text on it |
| 8 | `#E2E2E2` | `--line` | Card borders, dividers |
| 9 | `#25D366` | — | WhatsApp's own colour, floating button only |
| 10 | `#1EBE5A` | — | WhatsApp's own hover, floating button only |

Values 9 and 10 are WhatsApp's brand colours, not the site's, and are confined
to the floating contact button.

**`--brand` is `#F65308` and `--ink` is `#1A1A1A`.** The master plan's `#F26419`
and `#1C1C1C` predate the logo file and lose to these.
*Source: DECISIONS.md "The master plan is stale on two token values".*

**Background rule, non-negotiable.** Sections alternate `#FFFFFF` and `#141414`
with hard edges. No gradients, no fades, no fourth off-white, no translucent
overlay that creates an in-between shade. `--bg-grey` survives only as the
image-placeholder fill.
*Source: master plan section 4, phase 2 amendment in `src/styles.css`.*

**What is not a colour value**, and does not count against the ten:

- `#000` inside a `mask-image` gradient. A mask stop is an alpha channel, not a
  paint. It never renders.
- `rgba(255, 255, 255, x)` hairlines, dividers and icon-button hovers **on the
  dark band**. These sit on `#141414` and read as one lighter line, not as a
  new background.
- `rgba(0, 0, 0, 0.08)` and `rgba(0, 0, 0, 0.12)` card and header shadows.
- Product colour swatches inside the metal tile grid colour chips, and nowhere
  else. They depict a product finish, so they are data, not palette. Each value
  is an approximation authored in this repo against the 15-code legend in the
  wave 14 audit, and reproduces no standards body's published colour data.
  **One component only: no other element may use them.**
  *Source: owner ratification of wave 14 deviation 9, DECISIONS.md, W14
  ratifications; the values corrected and the claim removed at W15-04.*
- `rgba(0, 0, 0, 0.6)`, the lead-capture modal scrim. **The single permitted
  translucency on the site: an overlay, not a section.**
  *Source: `src/styles.css` comment at `.modal`.*

Adding a translucent overlay to a *section* is forbidden, and has already been
refused once: the `form-bg` slot was struck for needing exactly that.
*Source: DECISIONS.md "Approved exceptions".*

### 3.1 CSS namespaces: one block owns one prefix (W24-09)

**A component's class prefix is its own, and no second component may take it.**
`.bento__*` belongs to the garduri chooser, which has carried it since wave 16.
`.hub__*` belongs to the bento hub. `.prod__*` belongs to the catalogue card,
`.cat-*` to the catalogue category page, `.nvk-*` to the Novatik grid,
`.xsell-*` to the cross-sell row.

**Before writing a new block's first rule, grep `src/styles.css` for its prefix.**
If anything comes back, the prefix is taken and the new block gets a different
one. This is a thirty-second check and it is not optional, because the failure it
prevents is silent.

**Why it is a rule and not a preference.** W24-07 named the bento hub's tiles
`.bento__tile`. The chooser had owned that name since wave 16. Both declarations
are (0,1,0), so specificity settles nothing and the later one in the file wins;
the chooser's was later. Measured on the built page: the hub became a
three-column grid, its tiles rendered white on a 10px radius with 24px of
padding instead of `#141414` on 24px, and the tall tile came out **128px wide
against an intended 380**. It shipped that way and **all nineteen gates were
green**, because not one of them read a painted box. W24-07a renamed it to
`.hub__*` and W24-09 added gate 20, which measures geometry.

**A rename is not finished until every reader of the old name has been renamed
with it.** W24-07a renamed the CSS and left `scripts/verify-live.js` probing
`.bento__tile`. From that point the live markers counted the chooser and never
the hub: six rows came back UNVERIFIED on the first run after wave 24 merged,
none of them a defect on the page and all six a defect in the marker. Grep the
whole repo for the old prefix, not just the stylesheet.
**AMENDED (W24-09b): it happened a SECOND time in the same commit, and that one was
not found by eye.** W24-07 also added a bare `.faq` block for the rocă vulcanică page.
The service pages had owned `.faq` since wave 14, for a different shape: a div of
`.faq__item`s rather than a `dl` of `dt`/`dd` pairs. Same (0,1,0), same later-wins, and
`.faq > div` (0,1,1) beat `.faq__item` (0,1,0) on top of it. **All twenty service pages
grew by exactly 99px and it was live for two days.** Nobody saw it, because a 99px
change to a page with slack looks like nothing; it surfaced only as case la cheie
breaching the budget W24-05 had just given it, by 39px.

**Two lessons, and the second is the one that cost more.** A prefix nobody else uses is
not enough: `.faq` was a perfectly good name and the problem was that it was already
taken. And **the damage from a collision is not always visible**, so "it looks right" is
not a check. Gate 22 is the check, and it reads the stylesheet rather than the page.

*Source: DECISIONS.md, the W24 ratification block and W24-09b; `src/styles.css` at
`.hub__h` and `.nvk-faq`; gates 20 and 22.*

---

## 4. Lighthouse floors

| Category | Floor |
|---|---|
| Performance | **95** |
| Accessibility | **100** |

Both locales, desktop preset. Best practices and SEO are not floored but have
been 100 since 2026-08-28 and a drop should be explained.

**Enforced by `scripts/check-lighthouse.js` since W16-04**, run by `quality` on
every pull request. The two figures above are restated in that script because a
script cannot read prose, the same arrangement `scripts/verify-live.js` has with
R-Y's budgets: change one and the other must change with it.

**A floor is judged on the median of three runs (W21-02, RC-147), not on one.**
The floor is the same number; what changed is how many readings stand behind the
reading it judges. A single audit of the RO homepage on a cold CI runner read 88
and 93 twice in wave 20 while the same commit read 99 on a re-run and on 8 of 8
local runs. The floors here are never lowered to accommodate a runner: a breach
of the median is reported with its three readings and their spread.

One expected exception: a service page scores SEO ~69 while it is `noindex`.
That is the indexability gate working, not a regression — the page carries
`noindex, nofollow` until one of its projects has a real cover photograph, and
clears itself when one lands.
*Source: DECISIONS.md W3-02, RELEASE-NOTES "Lighthouse baseline".*

Accessibility 100 is held by two decisions that must not be quietly undone:
button text sized to clear the WCAG large-text threshold, so white on `--brand`
is judged against 3:1 rather than 4.5:1; and the category chip filled with
`--brand-dark`. The sizes and the measured ratios are in the DECISIONS.md entry.
3:1 and 4.5:1 are WCAG's thresholds, not ours, and are quoted as the external
standard they are.
*Source: DECISIONS.md "Contrast, resolved 2026-08-28".*

---

## 5. Copy

**No copy is ever invented.** Not a service, not a figure, not a guarantee, not
a price, not a locality, not a year, not a testimonial name.

The copy source is the predecessor build at `rapidconstruct-web.vercel.app`.
Permitted edits: shortening a sentence, converting a heading to uppercase,
splitting a paragraph into a card. Not permitted: inventing anything.
*Source: master plan section 6.*

**AMENDED (W24-04): the authored prose belongs to a CATEGORY page, and only to one.**
Each of the seven categories carries its lede and two paragraphs in each locale. A
SUBCATEGORY page, of which wave 24 adds seven, carries the breadcrumb, the heading and
the product grid and **no authored prose at all**: repeating the parent's paragraphs
would be the same copy on eight pages, which the gate's own no-duplicate rule refuses.
The catalogue index at `/catalog/` carries the category tiles and no prose either. All
three kinds are scanned whole for every prohibition; what differs is only what each must
carry, and the gate fails a page of any kind that carries none of its own thing.
*Source: W24-04, and the W24 dispatch's specification of the subcategory page.*

**AMENDED (W17-02): one authorized exception, the catalog category pages.** Their
lede and two paragraphs are authored general trade knowledge, written at the
owner's instruction in RC-133: what the material is, what it is for, how it is
applied, how its subcategories differ, what a buyer should weigh. They carry **no
claim about Rapid Construct**: not its stock, brands, prices, lead times,
warranties, capacity or experience, no superlative, no certification, no
manufacturer name. `scripts/check-catalog-pages.js` enforces the prohibitions on
the built pages and prints its term lists. **The exception is that scope only.**
Every other page still takes copy from a source or omits it.
*Source: DECISIONS.md W17-02, closing Q-W16-01.*

**AMENDED (W18 ratifications): the boundary, as the owner ratified it.** The
exception covers **category-page material description only**, meaning what a
material is, what it is used for and how it is chosen. The RC-133 list above sits
inside those three: how a material is applied is part of what it is used for, and
how its subcategories differ and what a buyer should weigh are part of how it is
chosen. **It does not extend to service pages, to product pages, or to any claim
about Rapid Construct**, on any page, including the category pages themselves.
*Source: DECISIONS.md, W18 ratifications, ratifying wave 17 deviation 4 with scope.*

**A catalogue product card may ask for a price, in two exact strings, and nowhere
else may they appear (W22-01, ruling on Q-W21-01).** "Preț la cerere" and "Цена по
запросу", each in its page's own locale, are permitted **only as the whole text of a
product card's quote button** on a catalog category page. Not as prose on that page,
not on a service page, not on a product page, not anywhere else. Every other price
word, and any figure, stays refused on the category pages exactly as before.
`scripts/check-catalog-pages.js` holds both halves: it blanks a permitted button
before its price patterns run, and it scans **every** built page for the two strings
outside that one place. Exact means exact: a near spelling is not the permitted
string and is refused.
*Source: DECISIONS.md, W22 ratifications and W22-01; the question is Q-W21-01.*

**AMENDED (W24-R3, wave 24): a catalogue card shows the price, and the phrase is left
for the case where there is none.** The owner's ruling, verbatim in DECISIONS.md block
W24-R: "catalogue cards show the fatade3d price. 'Pret la cerere' / 'Цена по запросу'
appears only where no price exists." So a figure is permitted **only as the whole text of
a `.prod__price` element carrying its own product in `data-product`, on a catalogue
page**, which is the same shape W22-01 gave the quote button. Everywhere a price was
refused before it is refused still, including inside a `.prod__price` on a page that is
not a catalogue page. The relaxation is by KIND: cart markup, a stock claim, a product
record and a manufacturer name all still fire inside a price element, so it cannot be
used as a hiding place. The two permitted strings keep their exactness and gain one more
permitted shape, a `.prod__ask` element in the place the price would have taken; a card
carries exactly one of the two, never both and never neither.
`scripts/check-catalog-pages.js` holds all of it and was negative-tested on thirteen
arms, each firing on its own message between two controls watched clean in the same run.
**No cart, no SKU, no `schema.org` `Offer`.**
*Source: DECISIONS.md, W24-R ruling R3, and W24-04.*

**AMENDED (W24-R7, wave 24): the two phrases are permitted by their SHAPE, not by the
page.** The owner's ruling: "Imperlux prices are not published. Slots render 'Preț la
cerere'." The mirrored pages W24-07 and W24-08 create are product pages, not catalogue
pages, so the phrase needed a permitted place off the catalogue. What travels with it is
the shape: **the whole text of a `.prod__ask` element carrying its own product in
`data-product`**, which is the same shape W22-01 gave the quote button and W24-R3 gave the
price. A loose phrase on a mirrored page is refused exactly as it is on a catalogue page,
and a page carrying neither shape still has no permitted place at all. Negative-tested on
four arms: the phrase as plain prose on a mirrored page, the phrase on a page that is not
mirrored, a `.prod__ask` with no `data-product`, and the Russian phrase on a Romanian
page. Each fired on its own message between two clean controls.
*Source: DECISIONS.md, W24-R ruling R7, and W24-07.*

When there is no source for a value, **mark it or omit it — never fill it**:

- `TODO: <what is missing>` in a locale file or in `content/projects.json`.
- `""` in `content/projects.json`.

Both mean the same thing to `build.js`, which treats them identically through
`REAL()` and **never prints either**. A field with no source renders as nothing
at all, not as a placeholder a visitor can see.
*Source: DECISIONS.md W6-02, `content/projects.json` `_note`.*

This rule has teeth already: six invented portfolio projects, three invented
testimonial names and a set of invented service two-liners were all built by the
design files and none of them reached `dist/`.
*Source: DECISIONS.md "Everything the design files invented, and did not ship".*

TODO markers gate their own pages. The privacy policy is `noindex` and out of
the sitemap while its legal-identity fields are unfilled.
*Source: `build.js`, DECISIONS.md 2026-08-28.*

---

## 6. Projects

**A project renders only when its `title` and `summary` are both real, in that
locale.** Real means neither empty nor `TODO:`-prefixed. Without both, the
project is invisible everywhere: not on its service page, not in the homepage
portfolio, not in the sitemap.

That is what makes an empty project safe to commit. ~~44 of the 54 projects~~ **16
of the 54 projects** in `content/projects.json` are stubs and none of them reaches
a visitor. **AMENDED (W20-01, RC-144): 44 was the W6-02 count and stopped being true
as projects were written. 16 in each locale, counted on 2026-09-17 by
`docs/audits/wave-19-readiness.md` section 3 and re-counted by RC-144; the count
moves whenever a stub gains its title and summary, and the build is what decides
it.**

Every other field — `location`, `year`, `work_type`, `area_sqm`, `duration`,
`main_materials`, `challenge` — is optional and drops out of the render **on its
own**. A project with a real location and no year prints the location alone.

**`location` is permanently empty and that is the finished state, not a gap.**
Filling it would need the client to identify the locality of each photograph,
which is not obtainable, and mapping the coverage list onto projects to fill it
would be inventing copy under section 5. No card reopens this unless the client
supplies per-project localities unprompted. **Coverage claims live in
`areaServed`, `band.coverageLine` and `llms.txt`, and are never mapped onto
projects.**
*Source: ruling R-U, DECISIONS.md, W12-34, closing Q-W9-05.*

A project that renders must have a cover file. `build.js` refuses to build
otherwise and names both the missing file and the command that fixes it.
*Source: DECISIONS.md W6-02.*

---

## 7. Images

Photo slots are defined in one place, `scripts/slots.js`, which both
`gen-placeholders.js` and `process-photos.js` read. Adding a slot there and to
the template is all it takes.

**A slot with an SVG fallback decides per slot, never globally.** The first
service to get a real photograph renders a photograph while the other eight
still render SVGs. A fallback SVG is retained, never deleted, when its photo
lands.
*Source: DECISIONS.md W6-03.*

Photos are dropped into `photos-raw/` named by slot ID and processed with
`node scripts/process-photos.js`. The pipeline rejects any filename that matches
no slot and tells you what it nearly matched. **Nothing is ever skipped
silently.**

~~Real Rapid Construct work only. No stock.~~ **AMENDED, proof slots only
(DECISIONS.md W14-18).** Before/after, portfolio, testimonial and team slots take
real Rapid Construct work only, never stock. Product and explanation slots (the
roofing offer cards, the metal tile profiles, the carport images) may take licensed
stock or visualisations, each file with its R-W provenance row. **If a slot has
no permitted image, the slot is removed rather than filled.**
*Source: master plan section 7, amended by W14-18.*

**AMENDED (W24-01, wave 24): a wave 24 slot renders a placeholder and waits.** Every
image wave 24 renders is the shared `.ph` placeholder component, because the photographs
are taken in a separate session after the layouts exist. It is not a third answer beside
"fill it" and "remove it": the slot is declared, sized and visible, and
`docs/PHOTO-SLOTS-W24.json` is the list the session is handed. Gate 19 holds every
placeholder and every row to each other in both directions, and `build.js` refuses a
placeholder whose slot id has no row. **No image, logo or asset from `fatade3d.md`,
`imperlux.md` or `dasterum.md` enters the repo** (W24-R2); their pages are fetched to read
text and measure layout, and nothing else crosses.
*Source: DECISIONS.md, W24-R, rulings R2 and the W24-01 card.*

---

## 8. Both locales, always

RO and RU must stay in sync. A string added to one is added to the other **in
the same commit**. `build.js` refuses to write output if the two locale files
disagree on keys, or if any string is empty.
*Source: master plan section 10, `build.js`.*

---

## 9. Links

Every internal `href` and `src` must resolve to a real file, and every
`#fragment` to a real `id` on the page it lands on.

    node build.js && node scripts/check-links.js

Exits non-zero, so it is a gate rather than a habit.

A link must also mean what it says. A dead-link audit is not enough: the 2026-08-28
audit found zero broken anchors and four genuinely misleading ones. A
privacy-policy link pointing at the footer is a defect even though it resolves.
*Source: DECISIONS.md "Dead-link audit".*

---

## 10. Git

- **Feature branches only.** `<wave-or-area>/<ticket-id>-<short-slug>`, for
  example `w6/rc-032-supplier-marquee`.
- **Nothing is ever committed directly to `main`.** Every change on `main`
  arrives through a `--no-ff` merge commit. `git log --no-merges --first-parent`
  on `main` should return only the initial scaffold commit.
- One card, one commit.
- Conflicts in `DECISIONS.md`, `QUESTIONS.md` or `BACKLOG.md` are resolved by
  **union**: keep every entry from both sides in chronological order. Never
  discard a side.
- **Never in the GitHub web conflict editor.** Resolve locally, or merge main
  forward. The editor strips the marker characters, leaves their tails behind as
  text, and keeps both sides, so the file that lands is marker-free and silently
  carrying one side twice. It has already damaged three files on this repo and
  reached production, because the deploy workflow runs no gates. Enforced by
  `scripts/check-merge-artifacts.js`.
  *Source: ruling R-Z, `docs/rulings/R-Z.md`; the incident is DECISIONS.md W14-24a.*
- `main` deploys to GitHub Pages on push. Pushing `main` is a publish.

---

## 11. Gates before a card is done

1. `node build.js` clean.
2. `node scripts/check-links.js` clean.
3. `node scripts/check-stale-docs.js` clean. Enforces sections 14 and 15: no
   known-superseded value appears in a governing document without an amendment
   beside it. See section 16.
4. Heights inside the section 2 budgets, measured settled.
5. Lighthouse at or above the section 4 floors, both locales. **Executes since
   W16-04**: `node scripts/check-lighthouse.js`, run by `quality`. It never
   skips. If lighthouse cannot be run, or a category score is missing rather than
   low, it fails: for its whole life before W16-04 this gate was reported NOT RUN
   by every card, which is the condition section 13 exists to forbid.
   **AMENDED (W21-02, RC-147): each page is audited three times and the MEDIAN of
   each category is what the floor judges.** One noisy run cannot fail the build
   and two agreeing bad runs still do. Every run prints all three readings and
   their spread, passing or failing. The floors do not move: they are section 4's,
   and a breach is reported with its spread, never accommodated. It fails when
   fewer than three reports arrive for a page, because then there is no median.
6. No new colour value.
7. `prefers-reduced-motion` still disables every effect.
8. `DECISIONS.md` appended, `BACKLOG.md` status updated, and any question the
   card raised written to `QUESTIONS.md` with a shipped default.
9. After any deploy, `node scripts/verify-live.js` exits 0. A live figure quoted
   without it is unverified, per section 12.
10. `node scripts/check-merge-artifacts.js` clean. Ruling R-Z: no conflict
    marker anywhere in the tracked text files, and no duplicate row key in
    `DECISIONS.md`, `docs/BACKLOG.md`, `docs/QUESTIONS.md` or
    `docs/assets/PROVENANCE.md`.
11. `node scripts/check-header-fit.js` clean. **Since W18-02 (RC-139)**, run by
    `quality`. The header pill in every template that carries it, both locales,
    at every width the header has been measured at: no two targets intersecting,
    no sideways scroll, the Servicii caret wherever the nav shows, the phone number
    whole from 1280px, and **slack at or above the owner's floor**, which lives in
    the script as `SLACK_FLOOR` and fails naming the locale, the width and the
    measured value. The fit and the floor are separate assertions with separate
    messages: a header can fit with nothing to spare. It fails, never skips, when
    the Inter webfont does not load, because a width measured in a fallback font
    is not a measurement of this site.
12. `node scripts/check-svg-a11y.js` clean. **Since W19-02 (RC-142)**, run by
    `quality` after the catalog page gate. Every inline `<svg>` on every built
    page is either decorative, `aria-hidden="true"` inside a control that already
    names itself, or an image, `role="img"` with a non-empty `aria-label`. Every
    diagram (the carport structures, the tile profiles) is an image, never
    decorative, and carries a description: an `aria-describedby` naming a
    non-empty `<desc>` inside it. Any text a diagram draws takes the tile
    treatment. It fails, never passes vacuously, on no pages, no svg, or no
    diagram of either family.
13. `WEB3FORMS_KEY=<key> node scripts/check-form-wiring.js` clean, against a build
    made with the same key. **Since W20-02 (RC-145)**, run by `quality` as its last
    step with a stand-in key, and by `pages.yml` on the real artifact with the real
    secret before anything is published. Every form on every built page POSTs to
    `FORM_ENDPOINT_URL`, which the gate reads from its one line in `build.js`; is
    armed; carries exactly one access key equal to `WEB3FORMS_KEY`, which is the
    recipient, since the key picks the inbox; and has a subject. Every sitemap page
    carries its `#quote-form` except the privacy pages, and the homepages also carry
    `#lead-form`. **Wiring, not delivery:** it never sends, and it does not assert
    the endpoint's status, which Web3Forms answers 2xx only to a delivered
    submission (Q-W20-01). It fails with no key set, with no endpoint line, and on
    zero pages or zero forms.
    **AMENDED (W21 ratifications), the owner's standing rule answering Q-W20-01:**
    the gate asserts wiring, and **a person sends one real lead per locale after any
    change to a form** and confirms both arrive. Delivery is never asserted by a
    machine here: Web3Forms answers 2xx only to a submission it delivers, refuses
    server-side clients without a paid plan, and challenges headless browsers. A card
    that touches a form carries that step in its PR checklist.
14. `node scripts/check-heading-fit.js` clean. **Since W19-D1 (wave 20)**, run by
    `quality` after gate 11 and before gate 13. Every page in the sitemap and both
    404 pages, at 360px with mobile emulation and at 1280px: the page does not
    scroll sideways, and no visible `h1`, `h2` or `h3` is wider inside than its own
    box, which is how a word that cannot wrap shows itself even where the page does
    not scroll. It fails, never skips, when Inter does not load, when the sitemap is
    missing or empty, when a page shows no heading, and when fewer combinations were
    measured than the matrix holds.
15. `node scripts/check-stub-count.js` clean. **Since W21-03 (RC-148)**, run by
    `quality`. **A stub count is data, not a ruling-held measurement**, so section
    16's staleness gate never covered it, and W6-02's count survived in four
    documents while the data moved to 16. This measures the count
    from `content/projects.json` with `build.js`'s own rule, per locale, and holds
    every stub count stated in the scanned documents to it: forward, by reading the
    number each stub sentence states, and backward, by refusing a known stale count
    near the word "stub". A value struck under R-R is history and is passed over.
    `DECISIONS.md`, the audits and the board cards are records and are not scanned;
    `docs/QUESTIONS.md` is scanned in its headings only. It fails when the data
    cannot be read or is empty, when a scanned document is missing, when the locales
    disagree so that no single number can be true, when no document states the
    current count, and when a named exception matches nothing.
16. `node scripts/gen-catalog-image-slots.js --check` clean. **Since W21-05
    (RC-150)**, run by `quality`. `docs/assets/CATALOG-IMAGE-SLOTS.md` is the
    request list a supplier is sent, and it is **generated** from
    `content/catalog-products.json` rather than typed, so it cannot drift from the
    records the site builds. The check fails when the committed file and the data
    disagree, when the file is absent, when a record has no id, name or
    manufacturer, and when a category slug has no catalog category.
17. `node scripts/check-image-metadata.js` clean. **Since W23-01 (wave 23)**, run by
    `quality`; corrected by W23-01a. **No committed image carries GPS**, anywhere under
    `public/`: a GPS tag on a photograph of a client's house publishes where that client
    lives. A file is an image by its bytes, not its name, so a HEIC renamed `.jpg` is read
    as a HEIC. JPEG, PNG and WebP are walked segment by segment, a TIFF by its first IFD,
    and every image of every format is also scanned for any TIFF structure pointing to a
    GPS IFD (an Exif block is one in every container) and any XMP GPS property; that scan
    is what reads HEIC, AVIF and GIF, and an SVG is read for the rasters it embeds. **An
    image whose provenance row names the client-supplied origin carries no metadata at
    all**, which is the condition the R-W amendment of 2026-09-18 puts on that origin; the
    rows are read from `docs/assets/PROVENANCE.md`. It is deliberately not "no Exif
    anywhere": about 128 images already on `main` carry an Exif block, none carries GPS,
    and stripping them would rewrite the bytes `docs/assets/LEGACY-IMAGES.txt` matches,
    which is what their legacy licence status rests on. The Exif count is printed every run
    so the gap stays visible. Zero dependency, so CI needs no exiftool; exiftool is what a
    workstation verifies a strip with. It fails when its parser self-test misses a planted
    GPS tag, on zero images read, on a file with an image extension that is no known
    format, on an Exif block it cannot read, when a provenance row naming the origin does
    not parse, and when a client-supplied file is one it did not read or is in a format it
    reads for GPS only (HEIC, AVIF, GIF), since that cannot be shown stripped.
18. `node scripts/check-nav-contrast.js` clean. **Since W23-06 (wave 23)**, run by
    `quality`. **Every header dropdown is read open, at rest.** The Servicii panel shipped
    at W15-02 with every row white on its white panel, visible only under the pointer,
    and stayed live for four days behind green gates: Lighthouse audits a page as it
    loads, when the panel is closed and holds no text to audit. This opens the Servicii
    panel and the Catalog panel, and each category's sub-list in turn, by the toggle's own
    `click()` with the pointer parked outside the header, and refuses a measurement if
    anything in the panel matches `:hover`. Every element in an open panel that holds
    visible text must paint at 4.5:1 or better against the background it sits on,
    composited through any translucent layer, and must rest fully opaque. 4.5:1 is WCAG's
    normal-text threshold, quoted as the external standard it is. Every built page that
    carries a dropdown is measured at 1280px, found in `dist/` rather than listed, and one
    page per template that carries them also at 1101px and 1440px. It fails when a panel
    does not open, when an open panel shows no text, when a colour cannot be read, when a
    template page carries no dropdown, when either locale carries none, and when fewer
    combinations were measured than the matrix holds.

19. `node scripts/check-photo-slots-w24.js` clean. **Since W24-01 (wave 24)**, run by
    `quality`. **Every image wave 24 renders is a placeholder**, and
    `docs/PHOTO-SLOTS-W24.json` is the list the photo session is handed. The two are held
    together in both directions over the built tree: every rendered placeholder has a
    ledger row, and every ledger row is rendered by at least one page. A row nothing
    renders sends a photographer out for a photograph nothing will show; a placeholder
    with no row leaves a box on the site nobody was asked to photograph. The rendered
    ratio must equal the row's, because the row is the one place a ratio is written
    (section 14). `build.js` holds the same forward rule at build time and refuses to
    render a placeholder whose slot id has no row. It fails on zero HTML pages read, on a
    ledger that is missing or does not parse, and on a `slots` key that is not an array.
    **AMENDED (W25-01, W25-03c, W25-04): the filled half.** A filled slot is a `<picture>`
    with alt text, its ledger row names a provenance row, that row's host is not one R-W
    forbids and its licence names an approved origin, and a generated image never lands on
    an evidence slot. **W25-03c: two filled slots must not stand on the same picture**,
    read both as a shared file path and as a shared source image URL, which is W25-R3's "a
    family image never fills a colour-variant card" in the only form a machine can hold.
    **W25-04: a filled slot whose catalogue record names no manufacturer may not claim a
    "manufacturer packshot" origin**, because there is no such manufacturer and so no such
    site, and the only place the file could have come from is a reseller, which W25-R2
    forbids. It is deliberately not "may never be filled": W25-R3 permits an owner-generated
    image on a product slot, and the rule refuses a false claim about origin, not a
    generated picture. The gate therefore reads `content/catalog-products.json` as well,
    and judges only slots that appear in it.
    **Its ~~three~~ ~~ELEVEN~~ EIGHTEEN-arm self-test is what makes it a gate while the ledger is still filling**:
    W24-01 ships the component, the ledger and the gate together, so both real counts are
    zero on that card and both assertions would hold vacuously. Before any real result it
    runs a planted unledgered placeholder, a planted unrendered row and a planted ratio
    disagreement against synthetic pages, each between two controls watched clean in the
    same run, and fails if any arm does not fire on its own message. **The filled half adds
    eight more arms** (W25-01's five, W25-03c's two and W25-04's one), against a second,
    filled control, so an arm firing cannot be the filled path being broken rather than the
    plant being caught. Same arrangement as
    gate 17's parser self-test, and the same reason: an assertion nobody has watched fail
    is not a gate (section 13).
    **AMENDED (W25-20): six more arms, and one of them is GREEN.** W25-R17 permits one
    picture on several records of the same product, declared on the later slot as
    `reuse_of` with a `reuse_reason`. Five red arms watch the declaration be refused: a
    slot the ledger does not have, a slot still a placeholder, a slot holding a different
    picture, a declaration with no reason, and a shared picture whose declaration points
    elsewhere. The sixth is a new kind here: `want: null`, a shape the gate **must
    accept**. *A permission nobody has watched succeed is as untested as an assertion
    nobody has watched fail*, and a green arm catches the opposite defect to every red
    one, a rule written so tightly that the thing the owner permitted is refused. The
    green arm and the first red arm are the same two slots on the same file and differ
    only by the declaration.
    **The arm count above is the number the run prints**, not a remembered one: it was
    three, then eleven, and the eleven was already stale when this line was read. Run it.

20. `node scripts/check-layout-geometry.js` clean. **Since W24-09 (wave 24)**, run by
    `quality`. **The nineteen gates above do not read a layout.** W24-07 shipped a
    bento whose tiles were named `.bento__tile`, which the garduri chooser had owned
    since wave 16; the later declaration won, the section became three equal columns,
    and the tall tile rendered 128px wide against an intended 380. It was visibly
    broken on the built page and every gate was green, because they read markup,
    links, contrast, headings, metadata, counts and scores, and none of them reads a
    painted box. This measures **computed geometry in a real browser** at 1440 and
    390, both locales, on every page that carries the thing measured, found in
    `dist/` rather than listed. For each bento hub: four tiles visible; at 1440 the
    tall tile spans two rows, sits between 30 and 38 percent of the grid's width and
    the wide tile is wider than each bottom tile, and no tile is under 280px; at 390
    the hub is one column. For each catalogue grid: four column tracks at 1440 and
    one at 390, read from the grid's own used tracks rather than from how many cards
    happen to fill them, cross-checked against the cards actually painted; and the
    W24-09 phone reveal paints exactly the page's own `data-prod-step` with its
    button shown at 390, and every card with no button at 1440. Class names it takes
    no view on: it measures boxes, which is the only thing that would have caught
    either the collision or the stale `verify-live` marker it left behind.
    **Its four-arm self-test is the wave 16 collision itself**: the chooser's
    declarations are re-injected onto the hub page and the gate must fail on them,
    the 128px collapse is planted so the width band and the 280px floor are watched
    fail too, and two catalogue arms plant a lost desktop column and the phone fold
    escaping into desktop. Each arm is asserted **by message id**, and the control —
    both families — is read clean immediately before the arms and immediately after
    (R-AB, whose second case is four arms read against a control that was already
    red). It fails on zero hub pages, zero grid pages, either family in one locale
    only, fewer combinations than the matrix holds, and when Inter does not load.

21. `node scripts/verify-live.js --self-check` clean. **Since W24-09a (wave 24)**, run by
    `quality` as its FIRST build-ish step. **Gate 9's script is the one script `quality`
    never loaded.** It measures the deployed site, so it cannot run before a deploy, and
    nothing else in CI imports it. W24-09 edited it and shipped it broken: a comment
    written inside `PROBE`, which is a template literal, put backticks around the class
    names it discussed, two of them closed and reopened the template, and the surrounding
    expression became a **tagged template whose tag was a string**. The file still parsed
    — `node --check` exits 0 on it, so a parse gate would not have caught it either — and
    it threw `TypeError` on load. Nineteen gates were green and `quality` passed in 6m10s.
    It reached `main` and was found by the post-merge run that gate 9 owes.
    **The check is LOADING, not parsing**: reaching the assertion at all is most of it.
    It then refuses any backtick inside a probe string, compiles each probe with
    `new Function`, and requires every page in `PAGES` to carry a marker set and a budget.
    No network and no Chrome, so it costs milliseconds. It fails on zero probe strings
    checked and on an empty `PAGES`. Negative-tested on the shipped-broken file itself,
    which exits non-zero, and on a backtick planted in an intact probe, with the shipping
    file watched clean immediately before and after (R-AB).

22. `node scripts/check-css-collisions.js` clean. **Since W24-09b (wave 24)**, run by
    `quality` with the other static checks. **Wave 24 shipped the same class collision
    twice, in one commit, and every gate was green both times.** `.bento__tile` is
    recorded at gate 20. The second was `.faq`: W24-07 added a bare `.faq` block for the
    rocă vulcanică page, the service pages had owned `.faq` since wave 14 for a different
    shape, the later declaration won, and **all twenty service pages silently grew by
    exactly 99px**. It was live for two days. It surfaced only because case la cheie had
    just taken a budget of its own at W24-05 and breached it by 39px; the other eighteen
    sit under a shared 6,000px budget with room to hide in, and gate 20 does not look at
    a FAQ list. So this one is static and general: in `src/styles.css`, no class used as
    a **bare** selector may be declared twice, more than 25 rules apart, setting the same
    property to different values. Shorthands are expanded, which is what makes
    `margin-top: 28px` against `margin: 40px 0 0` a clash rather than a miss.
    **It is narrow on purpose.** Three looser rules were measured against the clean
    stylesheet first: "declared far apart" gives 9 false positives, "bare class declared
    twice" gives 12, this gives 0. A noisy gate gets worked around. It fails on a missing
    stylesheet, on zero rules parsed and on zero bare class selectors.
    **Its self-test is both real defects**: `src/styles.css` as it stood at `3392bb4`,
    which carried both collisions at once, and this gate must name `.faq` AND
    `.bento__tile`, with the shipping stylesheet watched clean immediately before and
    after (R-AB). That stylesheet is **vendored** at
    `scripts/fixtures/styles-at-3392bb4.css`. The first version read it from git and
    `quality` failed in five seconds, because `actions/checkout` makes a shallow clone: a
    gate that depends on the clone depth of whoever runs it does not run everywhere, and
    `fetch-depth: 0` would fetch 35MB of history on every run to serve one self-test.
    The fixture is a historical snapshot, so it cannot drift; and **where the commit IS
    reachable, it is verified byte-for-byte against git before use**, so a workstation
    proves the fixture honest and CI trusts the proof. A missing fixture is a failure,
    never a skip.

23. `node scripts/check-plate-brands.js` clean. **Since W25-03d (wave 25)**, run by
    `quality` with the other static checks. **Which manufacturer a product really comes
    from is research, and research held in prose is not state.** The site stated for two
    days that Phomi makes 70 products Phomi does not make; the count was then corrected to
    37, and the full catalogue walk settles it at 3. Each of those numbers lived in a board
    card, and nothing in the repo could disagree with a wrong one while
    `content/catalog-products.json` went on printing a brand line. The settlement is now
    data, `content/plate-brand-settlement.json`: one row per plate in `placi-ceramice`,
    naming the manufacturer, the exact catalogue name it matched, the tier it matched at
    and the catalogue page. This holds the records to it in both directions. Every plate
    has a row and every row is a plate; a row naming a manufacturer requires `brand` to
    equal it and forbids `brand_hidden`; **a row naming none requires `brand_hidden`, which
    is W25-R3's "apply `brand_hidden` only to plates unmatched after all three
    catalogues"**; and a settled row must name what it matched, at a declared tier, with a
    URL. It fails on a missing or unparseable file, on zero plates, on an empty settlement,
    on no declared tiers and on fewer than three catalogues named, because W25-R3 settles
    brand against three. **It does not visit a catalogue**, and says so: re-doing the
    research is a card, not a gate. What it stops is the records and the settlement
    drifting apart silently, which is exactly how the wrong claim survived. Its **nine-arm
    self-test** plants each message in turn between two controls (R-AB), and both real
    defects were watched fire on the shipping files: `brand_hidden` removed from
    `CAT-0060`, and `CAT-0105`'s brand changed to Kordeko.

24. `node scripts/gen-photo-review-w25.js --check` clean. **Since W25-12 (wave 25)**, run by
    `quality` with the other static checks. `docs/PHOTO-REVIEW-W25.md` is the list the owner
    reads when reviewing images by hand, and **two rulings make a flag in it part of the
    permission to use a picture at all**: W25-R5 permits a photograph with a burned-in
    product name on condition each one is flagged there, and W25-R7 permits a Dasterum image
    on condition its watermark stays as published. A list that could drift from the ledger
    would make both permissions unverifiable. It is generated from
    `docs/PHOTO-SLOTS-W24.json`, `docs/assets/PROVENANCE.md`,
    `content/catalog-products.json` and `content/plate-brand-settlement.json`, and no flag is
    typed: "labelled swatch" is the settlement's `level` being `variant`, "watermark" is the
    licence being the direct-supplier origin, "low confidence" is the tier not being
    `A-exact`. It fails on a missing file, on a filled slot whose provenance row is absent,
    and on any difference between the committed file and the data. **Its dimensions come
    from each file's own bytes**, the PNG IHDR chunk or a walk of the JPEG segments to a
    start-of-frame marker: the first version shelled out to `sips` and failed in CI on its
    first run, which is gate 22's lesson arriving where the dependency was the operating
    system rather than the clone depth.

25. `node scripts/gen-owner-intake-w25.js --check` clean. **Since W25-16 (wave 25)**, run by
    `quality` with the other static checks. `docs/OWNER-INTAKE-W25.md` is the list the owner
    drops photographs against, and **the intake matches on the filename being the slot id
    exactly**, so a slot id that drifts in that document is a file nothing will ever find. It
    is generated from the ledger, `content/garduri-modele.json` and the **built** pages, so a
    tile's label is the words a visitor reads rather than a description of them. It fails
    when a listed slot has no ledger row, when a slot is already filled and therefore does
    not belong on a waiting list, when a hub slot renders on no built page or with no label
    beside it, and when either list is not the eight it must be.

26. `node scripts/check-hub-tile-links.js` clean. **Since W25-24 (wave 25)**, ruling W25-R24,
    run by `quality` with the other static checks. **Every hub tile on
    `/servicii/acoperisuri/` and `/servicii/garduri/`, both locales, has an href that
    resolves**: a path this build emits a page for, or an id that exists on the page named.
    Sixteen tiles. It reads the built tree, so it needs neither a browser nor a network: the
    site is static and a path answers 200 exactly when `dist` holds the file, and asking the
    live site would test the last deploy rather than this build.
    **It is a gate of its own rather than a clause of gate 20**, which measures painted boxes
    and takes no view on hrefs; an href assertion inside it would be a second thing in a box
    labelled one thing.
    **It says out loud that it would not have caught the defect that created it.** The Garduri
    hub's first tile pointed at `#garduri`, which resolved, on both locales, live and local:
    what was wrong was that a tile the size of a photograph moved a visitor a little way down
    the page they were already on, and no resolution check can see that. Its first version
    refused a same-page anchor by kind and thereby refused two tiles the owner had just been
    given, which is a rule written tighter than the ruling it enforces. So a same-page anchor
    that resolves is PERMITTED and every one is printed, named and counted on every run.
    **Its seven-arm self-test** plants a tile with no href, a dead path, a dead fragment on
    another page, a dead fragment on its own page, an href that is not a site path and a hub
    with the wrong tile count, between two clean controls (R-AB), and **two of the seven are
    GREEN**: a cross-page fragment that resolves, and a same-page anchor that resolves. The
    second green arm is the one the first version got wrong.

27. `node scripts/check-template-literals.js` clean. **Since W26-04 (wave 26)**, run by
    `quality` as its FIRST step, before the build. **A backtick written inside a template
    literal does not fail.** It ends the literal, the rest of the sentence becomes code, the
    next backtick opens a new one, and the file still parses: `node --check` exits 0 on it.
    What changes is the VALUE. **It has happened three times in this repo and every gate was
    green each time.** W24-09a: a comment inside `verify-live.js`'s probe discussed class names
    in backticks, loading the file threw, nineteen gates were green and `quality` passed in
    6m10s; gate 21 was written then and guards that one file. W26-04, `build.js`: an HTML
    comment inside the bento's returned literal did the same, the function returned **NaN**,
    **both bentos vanished from the roofing page**, and the build exited 0. W26-04,
    `check-layout-geometry.js`: the same sentence in the browser probe, an hour later.
    **It checks two things, and deliberately not "no backtick in a comment"**, which is
    unobservable after parsing and would fire on every comment in the repo that quotes a class
    name: a comment OPENED inside a template literal must CLOSE inside it, in both the HTML and
    the JS form, because a literal cut in half through a comment is what all three incidents
    leave behind; and a string literal immediately followed by a template literal, which is a
    tagged template whose tag is a string and is W24-09a's precise shape.
    **Its eight-arm self-test is five green**, because a rule this shape is far likelier to
    refuse something legitimate than to miss something broken: a balanced comment inside a
    literal, `String.raw`, a backtick in a block comment outside any literal, a literal holding
    an apostrophe and a quote and a slash, and a nested literal inside an interpolation all
    have to be accepted. **And all three real defects were planted back into the shipping files
    and watched fire**, between two clean controls (R-AB). The first version of the scanner
    recursed on a nested literal and skipped the rest of the file, so it reported the shipping
    tree clean and said nothing about `build.js`'s real defect; that is why the real-file arms
    exist and not only the synthetic ones. It fails on zero files and on zero literals read.

28. `node scripts/check-text-contrast.js` clean. **Since W26-05a (wave 26)**, run by `quality`
    after gate 18 and before gate 13. **The owner found this one on the live site, by eye.**
    Rocă vulcanică's Compară modelele table printed its model names and row labels **white on
    white**: the table paints its own white ground on a dark band, its `th` set no colour, and
    they inherited the band's. The same sweep found the copertine hero's breadcrumb painting the
    current page `--ink` on `--bg-dark`, 1.06:1, because `.breadcrumb` sits later in the
    stylesheet than `.cop-hero__crumb` at equal specificity. **Both shipped on 2026-09-20 and
    were live for two days behind green gates**, because gate 5's Lighthouse reads contrast on
    the two homepages only and gate 18 reads the dropdowns only. No other page had ever had its
    text contrast read.
    **Every built page, found in `dist/`, both locales, at 1440 and at 390 with mobile
    emulation**: every element that directly holds visible text paints at WCAG 1.4.3's 4.5:1,
    or 3:1 for large text, against its backdrop composited up the tree, with the element's
    cumulative opacity applied to the text. Those two figures are WCAG's, quoted as the
    external standard they are. **At rest**: reveals applied, reduced motion emulated, the
    pointer never moved, and **every finite animation waited out**, because the site
    transitions `color` and reduced motion does not stop a colour transition; the first
    version read a planted defect mid-transition and passed its own arm on some runs.
    Meta-refresh redirect pages are skipped and counted.
    **Decoration is not judged, and it is named by `aria-hidden="true"`**, which is WCAG's
    pure-decoration exception in the one form a machine can read: the roofing offer cards'
    ghost numerals sit at 1.13:1 on purpose (W14-08). The count and the faintest ratio print
    every run. **What it cannot read, it says**: a backdrop is read from ancestors, so text
    laid over a photograph is measured against the colour beneath it, and every such row is
    counted; text shown only on interaction is gate 18's or no gate's.
    **Its twelve-arm self-test runs first and three arms are GREEN**: both real defects are
    planted back onto the real pages and must fire, at desktop and at phone width; a translucent
    layer and an opacity each must be composited; an unreadable colour and a page with no text
    must fail as presence; and large text at a colour normal text may not use, white-on-white
    text that is visually hidden, and the ghost numeral must all be ACCEPTED, with the numeral
    stripped of `aria-hidden` as the red arm beside it. Two clean controls are read before and
    after (R-AB). **Watched fail on `main` as deployed at `2397634`: exit 1, 40 problems, the 36
    `th` and the 4 crumbs, and nothing else.** It fails on zero pages, either locale missing, a
    page with no text, an unreadable colour, an animation that never settles, and fewer
    combinations than the matrix holds. It does not need Inter: a colour and a computed size do
    not depend on the face.

**This list is appended to, never renumbered.** Recorded entries cite gates by
number — Q-W14-03 was found "at gate 9" — and those bodies are immutable under
R-S, so renumbering would falsify them. A gate added later takes the next number
even where that puts it out of running order.

**What `quality` runs on every pull request**, in order: gate 10 first (it names
the damage precisely), then gates 1, 2 and 3, then
`scripts/check-asset-provenance.js` (R-W), `scripts/check-scarcity.js` (R-X) and
`scripts/check-origin.js` (W14-17). **AMENDED (W18-02):** gate 11 runs last,
after `check-origin.js`. `scripts/check-catalog-pages.js` (W16-02) and gate 5
(W16-04) also run, between `check-scarcity.js` and `check-origin.js`; the
sentence above predates both. Those last three enforce rulings that
postdate this list and were never given numbers; they are gates in every sense,
and are named here so the numbered list is not read as the complete set.
**AMENDED (W20-02):** gate 13 runs after gate 11, as the very last step, because it
rebuilds `dist/` armed with a stand-in key that no earlier gate may measure.
**AMENDED (W19-D1, wave 20):** gate 14 runs between gate 11 and gate 13.
**AMENDED (W21-03):** gate 15 runs before gate 14, with the other static checks.
**AMENDED (W21-05):** gate 16 runs beside gate 15, and is static too.
**AMENDED (W23-01):** gate 17 runs before gate 15. It is numbered after 16 because this
list is appended to, never renumbered, and it runs before them because it is the cheapest.
**AMENDED (W23-06):** gate 18 runs after gate 14 and before gate 13, with the other
browser gates, because gate 13 rebuilds `dist/` armed.
**AMENDED (W24-01):** gate 19 runs before gate 15, with the other static checks.
**AMENDED (W24-09):** gate 20 runs after gate 14 and before gate 18, with the other
browser gates, and like them before gate 13, which rebuilds `dist/` armed.
**AMENDED (W24-09a):** gate 21 runs before gate 1. It needs no build and no browser, and
it guards the script gate 9 runs after the deploy, so it should fail before anything
expensive does.
**AMENDED (W24-09b):** gate 22 runs after gate 1 and before gate 2, with the other static
checks. It reads the source stylesheet, not the build, so it needs neither.
**AMENDED (W25-03d):** gate 23 runs before gate 15, with the other static checks. It reads
two data files and nothing else, so it needs no build and no browser.
**AMENDED (W25-12):** gate 24 runs before gate 15, with the other static checks.
**AMENDED (W25-16):** gate 25 runs beside gate 24. It reads the built pages, so it runs after
gate 1.
**AMENDED (W26-04):** gate 27 runs FIRST, before gate 1. It reads source text only, needs
neither a build nor a browser, and it guards the file the build is written in.
**AMENDED (W26-05a):** gate 28 runs after gate 18 and before gate 13, with the other browser
gates, because gate 13 rebuilds `dist/` armed.

**The count, so it stops drifting (W25-03c).** ~~This list numbers **25** gates.~~
~~**AMENDED (W25-24): 26**, and `quality` runs **25** commands.~~
~~**AMENDED (W26-04): 27**, and `quality` runs **26** commands.~~
**AMENDED (W26-05a): 28**, and `quality` runs **27** commands. The number to report is the one
`node scripts/run-gates.js` prints, never this sentence. Five of them
are not scripts and `quality` cannot run them: gate 4 (heights measured settled), gate 6 (no
new colour), gate 7 (reduced motion), gate 8 (the three documents updated) and **gate 9,
which section 12.0 runs against the deployed sha after the merge**. Eighteen numbered gates
are scripts, and `quality` runs four more that were never numbered, named two paragraphs
above. **AMENDED (W25-16): twenty numbered gates are scripts and `quality` runs 24
commands.** Four wave 25 cards reported "19 of 19",
which was the count before gates 21 and 22 landed and was never updated; the branches were
checked, the reports were not true.

**The local runner is `node scripts/run-gates.js` (W25-03d), and it READS this workflow.**
There is no second list to go stale: it parses `quality.yml`'s `steps:`, skips the runner
actions and the pinned Lighthouse install by name and prints what it skipped and why, and
runs every remaining command as its own process with its own exit code. It fails rather
than guesses on a shape it cannot read, because a silent partial read would report "0 of 0
green" and reproduce the defect it exists to stop. `--list` prints the list and runs
nothing; `--keep-going` reports every failure instead of stopping at the first.
**A card reports the number this prints.**

---

## 12. Live verification

### 12.0 A card is not complete until the deployed build passes (W24-10)

**Recorded at the owner's instruction, W24-10 dispatch, 2026-09-20.**

> A card is complete only when `verify-live.js` passes against the deployed sha after its
> merge. The terminal runs it after every owner merge without being asked and reports the
> process and exit code (R-AB).

**What this changes.** Gate 9 already said "after any deploy, `verify-live` exits 0", and
it was read as something owed by the next card. It is not. **The card that merged owes
it, and the run is unprompted**: nobody has to ask, and no card is reported complete
before it.

**What "against the deployed sha" means, exactly**, because each half has already gone
wrong once:

1. Wait for the Pages deploy to finish, then **wait for the edge to actually serve the
   new sha** before measuring anything. Fetch the homepage with a cache-buster until its
   `build-sha` equals the merge commit. Deploy success is not propagation.
2. Pass the **full forty-character sha**. `EXPECT_SHA` is compared by equality, not by
   prefix. W24-09 passed a short sha and got 51 spurious `build-sha mismatch` rows, which
   is a false red that costs as much trust as a false green.
3. Report the **process and its own exit code** (R-AB). Not "it looked fine".

**Why the owner asked for it, in one wave's evidence.** Wave 24's post-merge runs found
three things that every pre-merge gate had passed: `verify-live.js` itself shipped in a
state where loading it threw (W24-09a), a `.faq` class collision that had silently added
99px to all twenty service pages (W24-09b), and, before those, six markers left stale by
W24-07a's rename. **None of them could have been found before a deploy**, and two were
found only because the run happened at all.

**AMENDED (W25-R11, 2026-09-21): the run waits before it measures, and re-reads only as a
fallback.** A page is measured only once its **stylesheet has applied and its promo bar is
present**. Neither is a sleep: the site's design tokens are custom properties declared on
`:root` in `src/styles.css`, so `--brand` resolving non-empty **is** the stylesheet having
applied, and all ten marker sets expect `promoBar: 1`, so the promo bar is on every page this
gate reads. A page that never becomes ready is reported, not waited on forever.

**The re-read is the fallback and is bounded in three directions**: at most two, only for a
row that came back UNVERIFIED, and **never for a row that FAILED**. A failure is a
measurement about the site; an unverified row can be a measurement about the instrument.
Every re-read prints `RETRIED` with **all** the readings and the summary counts them, because
a re-read nobody can see is indistinguishable from a gate that passes on the second try.
**R-AB holds: the exit code is the result.**

`--prove` watches all of it: the probe refusing a document with no tokens and no promo bar,
waiting 1,216ms for one where both arrive late, refusing one that is half ready, and the
re-read firing exactly twice and being counted, each between two clean controls.

**And the run is where a wrong diagnosis gets caught.** W24-09 read one of those failures
as a budget set too early and recommended moving the budget; the real cause was a
collision on twenty pages, and moving the budget would have written the defect into a
ruling. The rule is therefore not only "run it" but **"when it fails, find the cause by
measurement before proposing a fix"**.

---

> A live measurement is valid only when taken with a cache-buster **and** with
> content markers asserted in the same pass. Height alone is never sufficient
> evidence, because a stale page returns a plausible number. Every live
> verification asserts at least one marker proving the deployed build is the one
> being measured. A measurement without markers is reported as **unverified**,
> never as passed.
*Source: ruling R-P, DECISIONS.md, W12-22.*

**This rule was bought.** During wave 12 a post-deploy reading returned the exact
pre-deploy heights, RO 8,843 and RU 9,002, from a stale edge copy. It was inside
budget and entirely plausible, and it was caught only because the numbers were
suspiciously identical to the previous build. Every other live reading that wave
was taken the same way and none of them can be reproduced as evidence.

**`node scripts/verify-live.js [origin]`** is the implementation. It cache-busts
every request with a token unique to the run, disables the browser cache, reads
markers and the settled height in a **single page evaluation** so they cannot come
from different responses, and exits non-zero when any marker mismatches.

**The marker sets live in `scripts/verify-live.js`, in the `MARKERS` constant.**
They are counts of things on the page, so they change whenever the page does, and
a copy of them here would go stale the first time a card added a section. Read
them there; the script is the only place they are written.

Alongside the markers each page is checked for rating markup, the `sameAs`
profile URL, visible `TODO`, `robots` and `canonical`; and a cache-busted crawl
follows every visible anchor to confirm no visitor-reachable `TODO`.

**A marker set proves the build has certain properties, not that it is a
specific commit.** Two builds sharing all six markers are indistinguishable to
it. The stronger form is a deployment fingerprint emitted into every page and
asserted by the verifier; that is not built, and is recorded as a recommendation
in QUESTIONS.md rather than assumed.

**Two things about this environment read as broken output and are not: the
Russian 404 under `curl`, and the cancelled deploy runs after a stack of merges.
Section 18 has both, with how to verify each properly.**

**Prove the assertions fire.** They were negative-tested against a build with the
review panel removed: three markers mismatched and the run exited 1, while the
heights it reported were inside budget and looked correct. An assertion nobody
has watched fail is not a gate.

---

## 13. What a gate may conclude

> A gate asserts the **presence of what it requires**, never the absence of a
> complaint about it. Absent evidence is not positive evidence.
*Source: ruling recorded with R-P, DECISIONS.md, W12-22 and W12-25.*

Three incidents in one wave, all the same shape:

| Incident | What the check looked for | What it concluded |
|---|---|---|
| The privacy gate | a `TODO:` marker in `privacy.*` | the section was **deleted**, so no marker was found, so the page was declared publishable and the links were released |
| A live height reading | a plausible number | a **stale edge copy** returned one, and it was inside budget, so the deploy was nearly reported as passing |
| A card reporting done | a status field | **evidence null** was read as nothing-to-report rather than nothing-was-checked |

In each case the checker asked "is anything complaining?", got silence, and read
silence as approval. The three fixes are the same fix: assert what must be there.

- The privacy gate now requires `privacy.opName` and `privacy.opIdno` to be
  **present and real**, so deleting them fails exactly as marking them TODO does.
- `scripts/verify-live.js` requires a `build-sha` tag to be **present and equal**
  to the expected commit. A missing tag is `UNVERIFIED` and exit 1, never a skip.
- A gate whose evidence is missing reports **unverified**, never passed.
- **AMENDED (W18-03): a gate that reads files says how many, and fails on
  none.** Every acceptance script prints the number of files or pages it read
  before any result, and exits non-zero when that number is zero. Where a gate
  reads a fixed list, an emptied list is the zero case and fails the same way. A
  scan that read nothing has concluded nothing, and ruling R-AB makes reporting it
  as a pass non-evidence. Six scripts lacked it until W18-03, including the deploy
  workflow's own placeholder grep.

The corollary is what makes this operational: **an assertion nobody has watched
fail is not a gate.** Every assertion added under R-P and W12-23 was
negative-tested against a build that should fail it, and the failure observed,
before it was trusted.

---

## 15. When the master plan wins, and when it does not

> The master plan wins by default **only where no later ruling addresses the
> point.** Any master plan value superseded by a ruling carries an inline
> amendment naming that ruling, at the point of the stale value. A value with no
> amendment is presumed current. An un-amended stale value is therefore a defect
> in the amendment, not in the card that obeyed it.
*Source: ruling R-R, DECISIONS.md, W12-27.*

**The last sentence is the point of the rule.** "The master plan wins by default"
is an instruction to trust the document. A card that trusts it and is wrong has
obeyed correctly; the fault is that nobody marked the value. Blame follows the
amendment, which is the only way the instruction stays safe to give.

**The standard is the pattern already at master plan line 121**, where the header
height carries its amendment inline naming the wave that changed it. Amend in
place.

    | `--brand` | ~~`#F26419`~~ **`#F65308`** | … **AMENDED: DECISIONS.md, "…". ** |

**Strike the value, do not remove it — where the value has documentary purpose.**
A design spec with its numbers taken out is not a spec, and a reader who needs to
know what the plan used to say has nowhere else to look. **Where it has no
documentary purpose, removal is correct and is the R-Q-clean answer.** A
stylesheet comment is the clear case: nobody reads it for the figure, and a dead
number left sitting in one is how it gets copied again. The amendment still names
the superseding ruling either way; only the corpse is optional.
*Source: ruling R-T, DECISIONS.md, W12-33, ratifying W12-31.*

Three documents were amended under this ruling on 2026-09-07: the master plan's
`--brand` and `--ink` rows, the photo manifest's 1600px long-edge minimum (not
universal: W7-02 and W8-03 lower it per slot group), and
the backlog's W12-03 budgets. Details in DECISIONS.md, W12-27.

---

## 14. Governing documents do not restate measurements

> Governing documents name the ruling that holds a measured value and never
> repeat the value. A number lives in exactly one place: the ruling that set it.
*Source: ruling R-Q, DECISIONS.md, W12-24.*

**A stale pointer is visible on reading. A stale number is not.** That asymmetry
is the whole argument, and it was paid for three times:

| Instance | Cost |
|---|---|
| The 8,504 / 8,774 homepage baseline | wrong for four waves; advertised 196px of RO headroom where 54px existed, and is most of why wave 12 went over budget |
| R-I's stated budgets | did not match R-I's own derivation, by −1 and +35, and the +35 was a round number the same ruling forbade |
| Section 2 of this file | carried budgets that R-I and then R-J had superseded, 151px too tight on RO |

What this file may still state: **rules and thresholds it owns** — "under 400ms",
"under 20px", the ten colour values, the Lighthouse floors, the 1,400px section
cap. Those are chosen here, so here is their one place.

What it may not state: **anything measured or derived elsewhere** — height
budgets, contrast ratios, animation durations, marker counts. Those live in the
ruling, the stylesheet token, or the script, and this file names the holder.

Where the two are quoted together, the external standard is marked as such:
WCAG's 3:1 and 4.5:1 are not ours to hold.

---

## Ground truth

This file holds rules. Everything else lives in exactly one of these:

| File | Holds |
|---|---|
| `docs/RC-WEBSITE-MASTER-PLAN.md` | Product scope, section spec, locked decisions. **Wins by default.** Where it and a chat instruction conflict, ask before deviating. |
| `DECISIONS.md` (repo root) | Every departure from the master plan and why. Append-only. The master plan loses only where this file says it does. |
| `docs/BACKLOG.md` | Tickets and their status. |
| `docs/QUESTIONS.md` | Open questions for the owner, each with the default that shipped. Append-only; answered items are marked, never deleted. |

Two more that are reference rather than rule: `docs/RC-PHOTO-MANIFEST.md` (the
slot inventory) and `RELEASE-NOTES.md` (what each wave changed, and the current
measurements).

**Never guess a product decision.** Write the question to `docs/QUESTIONS.md`
with full context and a recommended default, ship the default, mark the ticket
blocked if it cannot proceed, and move to the next unblocked one. A blocked
ticket stops one branch of the graph, never the whole run.

---

## 16. The staleness gate

> A value copied into a governing document has no mechanism that notices when the
> ruling behind it changes. Section 14 stops new copies being made and section 15
> makes the existing ones visible. Neither detects the next one.
*Source: W12-29, DECISIONS.md. Opened as the closing note of Q-W12-11.*

    node scripts/check-stale-docs.js

**`scripts/check-stale-docs.js` is the implementation**, run as a gate the way
`check-links.js` is, exiting non-zero on a hit. It carries a list of
known-superseded values, each with the authority that superseded it, and fails
when one appears with no amendment within three lines.

**It reads the governing documents whole, and the source files' comments only**
(W12-31). Comments, not whole source files, and the distinction is what makes
the extension safe rather than noisy: `MIN_LONG_EDGE = 1600` in `slots.js` is the
correct implementation of a rule, and `setTimeout(r, 1600)` in
`verify-live.js` is a delay in milliseconds. A gate that flags its own correct
implementation trains people to ignore it. Neither is a comment, so neither is
read. The comments are extracted by a character scanner that tracks strings,
template literals to any depth and regex literals, because a regex cannot tell
`//` in a line comment from `//` in `https://` and `build.js` is full of both.

**The list, the exempt files and the enumerated exceptions live in the script.**
They are the one place each is written, per section 14, and the script prints all
three on every run so the scope is never implicit.

**Adding a value to that list is part of recording a ruling that supersedes a
measurement**, not a follow-up card. That obligation is written into R-Q.

Three things fail that would ordinarily be treated as housekeeping, because all
three are how a gate stops being one:

- **A named exception that no longer matches anything.** It has outlived the
  occurrence it excused and is now an unreviewed licence sitting inside a gate.
- **A scanned document that has gone missing.** A file that vanished is not a
  file that passed.
- **A template in `src/` that is not in the scan list.** Asserted by count, in
  this gate and in `scripts/check-scarcity.js`, the other scan that reads the
  templates. `src/product.html` went unscanned by both from W14-16 until RC-135.

**Its limit, stated plainly.** It is a value search with a proximity rule. It
catches a superseded value arriving with nothing beside it, which is every
instance found in wave 12. It cannot tell a value quoted as dead from one quoted
as live when a marker happens to sit within three lines, and it reads only the
files named in its two scan lists. It does not read code, by design, so a
superseded figure written into a string or a variable name is invisible to it.

**Negative-tested before it was trusted**, per section 13, and again when the
source-comment scan was added in W12-31: four values planted in comments of four
different kinds all fired, and six planted in code fired nothing, which is the
arm that proves the scan is reading comments rather than files. Four superseded
values were reintroduced into a scratch copy — R-I's budgets restated as live in this
file, the struck line 121 heuristic restored to the master plan, `#F26419` (dead;
`#F65308` is live) added
to the photo manifest, the never-true baseline added to the backlog — and all
four were reported with the superseding authority named, exit 1. The
dead-exception and missing-file arms were each watched failing too. The first
version of the gate did **not** catch the first of those four, and the window was
tightened from six lines to three until it did.

---

## 17. What "append-only" protects, and what it does not

> In an append-only record, **entry bodies are immutable and status metadata is
> not.** A status marker may be updated in place. Nothing inside a recorded body
> is ever edited, including to correct an error: the correction is a subsequent
> entry that names the one it corrects.
*Source: ruling R-S, DECISIONS.md, W12-32.*

**The two halves are what makes the rule usable.** "Append-only" read absolutely
would freeze a question's heading at OPEN forever, so nothing could say what is
still live, and a reader would have to reconstruct status from the whole file.
Read loosely it licenses editing the record, which is how a wrong figure survives
four waves with nothing marking it. The line between them is body and status.

| May be updated in place | May never be edited |
|---|---|
| A question's status in its heading: `OPEN` → `ANSWERED <date>, <what>` | Anything inside the question's body — the context, the options, the figures as they stood |
| A superseded-by marker added to a dated section | The dated section's own text |
| A backlog ticket's status field | What the backlog entry said when it was written |

**A record of a moment stays a record of that moment.** `DECISIONS.md`,
`docs/QUESTIONS.md` and the dated wave sections of `RELEASE-NOTES.md` are all
records: each states what was true and known when it was written. That is exactly
why they carry superseded figures, and why the staleness gate holds an enumerated
exception list rather than a licence to correct them.

**Current figures live in the handoff**, at the foot of `RELEASE-NOTES.md`, which
is the one section written to be replaced. Everything above it is dated and
stays as written.

**Ratified at W12-32:** the four question headings W12-30 moved from `OPEN` to
answered — Q-W12-06, Q-W12-09, Q-W12-10 and Q-W12-11 — are status metadata and
stand. No entry body was touched in doing it.

An error inside a recorded body is corrected by the next entry, not by the pen.
The record then shows both what was believed and what replaced it, which is
strictly more than the corrected version would have shown.

### R-S governs snapshots. A ruling is not a snapshot.

> **A ruling body may carry appended amendment blocks.** Each is dated, names the
> card that added it, and alters no existing sentence.
*Source: ruling R-T, DECISIONS.md, W12-33, answering Q-W12-13.*

**The distinction is what the document is for.** A question entry and a dated
wave record state what was believed at a moment; they are read backward, as
evidence, and editing them destroys the only thing they carry. A ruling is
standing authority and is **read forward** — a card consults R-J to find out what
the budget is *now*. An amendment that lives anywhere but inside the ruling means
a card can read the whole ruling, act on it, and be wrong.

That is R-R's argument exactly, one level up: an amendment sits at the point of
the thing it amends, and a ruling is a value.

The two blocks that already exist — R-J's, added by W12-10, and R-Q's, added by
W12-29 — stand, and are the pattern. **R-J's in-place corrections of figures in
`DECISIONS.md` are regularised by R-T** and need no correcting entry.

What is still forbidden inside a ruling: editing a sentence that is already
there. An amendment is added below, dated and attributed. Nothing above it moves.

**AMENDED (W18 ratifications): an R-R strike is not an edit in that sense.**
Striking a superseded value in place, with the amendment naming its authority
beside it, is R-R conduct. R-R permits it wherever the value has documentary
purpose, inside a ruling as anywhere else, and it is not an exception to R-T. The
struck value stays readable; no sentence is rewritten.
*Source: DECISIONS.md, W18 ratifications, reclassifying wave 17 deviation 6.*


---

## 18. What the environment does that looks like a defect

> Two behaviours of the hosting and the deploy have already been mistaken for
> broken output, once each. Neither is a defect, and neither is fixable in this
> repo. **Check this section before reporting either as one.**
*Source: card RC-151 (W22-02), from the live checks of RC-146, DECISIONS.md W21-01.*

### 18.1 The Russian 404 cannot be verified from the command line

**`curl` on a `/ru/` path that does not exist returns the ROMANIAN page, and that
is correct.** A static host serves **one 404 body for the whole origin**, the file
at `/404.html`. There is no per-directory error page to serve. W19-D9's fix runs
**in the page**: the root 404 carries a script that, for a path under `/ru/`,
replaces the location with `/ru/404.html` and puts the broken address back in the
bar. A client that does not run JavaScript never reaches that step.

| Client | What it gets on `/ru/nu-exista/` | Reading |
|---|---|---|
| `curl` | 404, the Romanian body, `lang="ro"` | **expected**, not a defect |
| any real browser | 404 first, then the Russian page, `lang="ru"`, button to `/ru/`, the typed address kept | the fix working |

**Verify it in a browser, never with `curl` alone.** The RC-146 live check is the
pattern: request the path, read the first response's status, then read the
rendered `h1`, `documentElement.lang` and the primary button's `href`. A
`curl`-only check of this page reports a failure that is not there, and a
`curl`-only check that *passes* would mean the script had stopped running.

The same is true of the Apache deploy path, and of `/rus/` or `/ruta/`: a path
that merely starts with the letters "ru" stays Romanian in the browser too.

### 18.2 The publish workflow keeps only the last run

**`pages.yml` runs on every push to `main` under `concurrency: pages` with
`cancel-in-progress: true`.** Merging a stack of pull requests in quick
succession therefore leaves a row of **cancelled** deploy runs and one that
publishes. That is the workflow working as configured: one publish, from the
final tree.

Wave 21 saw it plainly: eleven merges inside one minute, ten runs cancelled, run
35255945622 (`c37e9ec`) succeeded, and for the minute in between the live
`build-sha` was an intermediate merge, which is a rollout in progress and not a
stale edge copy.

**So verify live against the final merge only.** Take the sha of the last merge
commit on `main`, wait for its deploy run to report success, then run
`EXPECT_SHA=<that sha> node scripts/verify-live.js https://rapidconstruct.md`.
Verifying against an intermediate merge fails on the `build-sha` assertion and
proves nothing about the deploy. A cancelled run in the list is not a failed
deploy and needs no investigation; a **failed** one does.
