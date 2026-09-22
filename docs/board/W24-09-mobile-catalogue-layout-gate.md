# W24-09 · The phone catalogue reveal, gate 20, and the wave 24 ratifications

| | |
|---|---|
| Dispatched | Wave 24, second dispatch, 2026-09-20 |
| Rulings in force | R-V, R-W, R-X, R-Y as amended by W24-R4, R-Z, R-AA, R-AB, and the W24 ratifications |
| Depends on | W24-01 to W24-08, all merged as #78 to #85 |
| Opens | Q-W24-04, Q-W24-05 |
| Closes | Q-W24-01, and parts 1 and 2 of Q-W24-03 |
| Fixes | F-22 (the owed live run), and the stale `verify-live` markers W24-07a left behind |

## The precondition, before any work

`main` checked out, pulled, and `origin/main` confirmed to carry the merges of **#78 to
#85**. All eight are there; the head is `2ab3a4b`. Nothing was blocked.

`node scripts/verify-live.js https://rapidconstruct.md` was then run against that sha, as
owed since F-22. **It exited 1: 6 unverified, 2 failed.** Both results are real and
neither is W24-09's page:

- **2 hard failures.** `/servicii/case-la-cheie/` 6,475px against a 6,436 budget in RO and
  6,582 against 6,543 in RU. Both over by exactly 39px, which is what says one cause: the
  W24-05 slider grew the page and its budget was taken before it settled. **Q-W24-05.**
- **6 unverified.** `bentoTiles` and `bentoLinks` on the acoperisuri, garduri and copertine
  pages, both locales. **Not a defect on any page.** W24-07a renamed the hub's classes to
  `.hub__*` and left `scripts/verify-live.js` probing `.bento__tile`, which after the
  rename belongs to the garduri chooser. From W24-07 the markers counted the chooser and
  never the hub. Corrected here.

The first run mismatched on `build-sha` for a different reason worth recording: it was
given a **short** sha as `EXPECT_SHA`, and the comparison is an equality, not a prefix. A
short sha is not a sha here. Re-run with the full 40 characters, every row matched.

## 1 · The phone catalogue reveal

At 768px and below a catalogue grid paints its first **12** cards and one full-width
button that reveals 12 more per press.

**Every card is in the HTML on every width.** Nothing is sliced out of the array and
nothing is fetched. The fold is a class `main.js` puts on the cards past the step, and the
rule that acts on it lives inside a `max-width: 768px` query in `src/styles.css`. Three
things follow, and each is why it is built this way:

- a crawler reads the whole grid, because the whole grid is in the markup;
- **with no JS nothing is folded**, so every card shows. Measured with script execution
  disabled: `/catalog/placi-ceramice/` paints **88 of 88**, 0 folded, no button;
- **desktop cannot regress**, because the folding rule does not exist above 768px. It is
  held by CSS, not by a width test in JS that could be wrong.

The button is `hidden` in the markup and `main.js` unhides it only once it has actually
folded something, so neither a no-JS visitor nor a desktop visitor is shown a control that
would do nothing. `matchMedia`, not `innerWidth`, so a rotation re-runs it and keeps the
revealed count.

The step is emitted onto the grid as `data-prod-step`, so `build.js` holds the number
once, `main.js` reads it from the markup, and **gate 20 asserts the painted count against
the number the page itself states** rather than against a second copy.

### What it did, measured at 390px with mobile emulation, on load

`origin/main` at `2ab3a4b` was built into a worktree for the before column.

| Page | RO before | RO after | RU before | RU after |
|---|---|---|---|---|
| `/catalog/placi-ceramice/` | 47,917 | **10,189** | 49,963 | **10,760** |
| `/catalog/elemente-decorative/` | 37,820 | **10,306** | 38,067 | **10,552** |
| `/catalog/termoizolatie/` | 17,543 | **10,778** | 17,357 | **10,902** |
| `/catalog/sisteme-iluminare/` | 16,844 | **10,383** | 16,685 | **10,450** |
| `/catalog/tencuieli-decorative/` | 11,338 | **10,885** | 11,573 | **11,121** |

A page with 12 or fewer products is unchanged: `/catalog/vopsele/` reads 6,884 then 6,908
in RO, and the 24px is the moved button, not the reveal.

The button was pressed in a real browser: 12, 24, 36, 48, 60, 72, 84, 88, then the button
goes. Focus lands on the first card revealed by that press, so a keyboard visitor is not
dropped back at the top of the page when the button disappears.

### The target is missed, and the arithmetic is in the open

**The dispatch asks for under 9,000px at 390 and specifies twelve cards. Both cannot be
true.** Below 512px the grid is one column; the card's image is a `1 / 1` placeholder,
which is what `docs/PHOTO-SLOTS-W24.json` specifies for all 223 catalogue slots, so it is
square by decision and stays square when the photographs land. Twelve cards measure
**6,181px**, and the rest of the page (header, hero, prose, offer button, form, footer)
is **4,008px**. 6,181 + 4,008 = **10,189**.

Nine and eight were built and measured rather than derived: **8,696px** and **8,198px**.
It is one number, `PROD_STEP` in `build.js`. **Twelve is what the dispatch specifies, so
twelve shipped**, and **Q-W24-04** carries the choice with all three measurements.

## 2 · Gate 20, the layout gate

`scripts/check-layout-geometry.js`, run by `quality`, **64 of 64 combinations, exit 0.**

It reads **computed geometry** in a real browser at 1440 and 390, both locales, on every
page that carries the thing measured, found in `dist/` rather than listed. It takes no view
on class names: it measures boxes, which is the only thing that would have caught either
the W24-07 collision or the stale marker W24-07a left behind.

Bento hubs (4 pages): four tiles visible; at 1440 the tall tile spans two rows, sits
between 30 and 38 percent of the grid width, the wide tile is wider than each bottom tile,
and no tile is under 280px; at 390 the hub is one column.

Catalogue grids (28 pages): **four column tracks at 1440 and one at 390**, read from the
grid's own used tracks and not from how many cards happen to fill them. The first draft
counted painted lefts and failed six correct pages whose categories hold two or three
products. Cross-checked against the cards actually painted. And the reveal: the page's own
`data-prod-step` at 390 with its button shown, every card and no button at 1440.

### The self-test: four arms, each on its own message

The control is **both families**, read clean immediately before the arms and immediately
after (R-AB, whose second case is four arms read against a control that was already red).

| Arm | Fires on | What it plants |
|---|---|---|
| The wave 16 collision, as it landed on the hub | `hub-span`, `hub-wide` | the chooser's `.bento`/`.bento__tile` declarations re-aimed at `.hub__*` |
| The 128px tall tile it was measured at | `hub-tall-pct`, `hub-narrow` | a 128px first column |
| A desktop grid that lost a column | `grid-cols` | `repeat(3, …)` at 1440 |
| The phone fold escaping into desktop | `grid-desktop-fold` | the fold class forced on above 768px |

Arm 2 exists because arm 1 does not reproduce the measured number: three equal columns of
1440 put the tall tile at about 33 percent, **inside** the band this gate allows. The
first draft demanded `hub-tall-pct` from arm 1 and the gate failed its own self-test,
correctly. The collapse is therefore planted directly, and the arm reports *"the tall tile
is 128px of a 1152px grid, 11.1%, outside 30-38%"*, the defect's own number.

## 3 · The five typos (Q-W24-03 part 1, owner's (b))

| id | slot | RO before | RO after | RU |
|---|---|---|---|---|
| `f3d-4853` | CAT-0079 | PLacă Fawn Grey | **Placă Fawn Grey** | Плитка Fawn Grey |
| `f3d-4864` | CAT-0080 | PLacă Fog | **Placă Fog** | Плитка Fog |
| `f3d-4875` | CAT-0081 | PLacă Dark Brown | **Placă Dark Brown** | Плитка Dark Brown |
| `f3d-4886` | CAT-0082 | PLacă Dark Grey | **Placă Dark Grey** | Плитка Dark Grey |
| `f3d-4897` | CAT-0083 | PLacă Ink-Dyed | **Placă Ink-Dyed** | Плитка Ink-Dyed |

**The dispatch asks for the fix "in RO and RU". There is no typo in RU**, and none was
invented: the Russian name is `Плитка`, which never carried the capitalisation. The RO
column is the whole change, and it is five characters.

`source.name` keeps the source's spelling verbatim on all five, which is what option (b)
specifies. The file now holds 5 occurrences of `PLac`, all of them in `source.name`.
`docs/assets/CATALOG-IMAGE-SLOTS.md` is generated, so it regenerated: 5 lines.

## 4 · RedConstruct (Q-W24-03 part 2, owner's (b))

**64 products kept, 0 removed. No brand line renders on any of them.** The brand stays in
the record and a new `brand_hidden: true` sits beside it, so the value is still there for
anyone reading the data and nothing reaches the page.

All 64 are in Elemente decorative. `.prod__brand` on that page: **64 before, 0 after**,
both locales. That is also the only budget in this card that went **down**: the page lost
281px of RO and 300px of RU.

One flag, one condition in `build.js`. If the owner answers (a) or (c) instead it is that
one flag either way, exactly as the question promised.

## 5 · The backlog (F-23 again)

**37 rows corrected, not 23.** 23 read `PR open, awaiting owner`; the other 14 read
`PR #78 open, awaiting owner`, `STOP PR #39, awaiting owner` or `PR #35, awaiting owner`,
which are the same staleness in a different wording. Leaving 14 known-stale rows because
the dispatch counted 23 would be writing the miscount into the file.

Every row was resolved against `gh pr list --state all --limit 200`: **all 85 pull requests
on this repository are MERGED, none open, none closed unmerged.** Each row now reads
`merged #NN` with the merge commit's short sha where `git log --merges` carries one, and
every sha printed was resolved back to its own PR before it was written.

## 6 · `/review/`

Already `noindex, nofollow` and already out of `dist/sitemap.xml`; confirmed, not assumed.
`Disallow: /review/` added, **to every group, not only `User-agent: *`**. A robots.txt
group is matched, never merged: a crawler that finds a group naming its own token obeys
that group and ignores the wildcard entirely, so a single Disallow under `*` would have
left all six named answer engines with a bare `Allow: /`. The page is not deleted.

## 7 · The section order the owner asked for

Reported on the screenshot of `/catalog/vopsele/`: the description and the *Solicită
ofertă gratuită* button were the first things on the page and the products came third.

Now, on all 14 category pages and the index: **breadcrumb, eyebrow, H1, lede, then the
product grid**, then the prose block, then the offer button, then the form. The button
keeps its `#oferta` target. It is a `div`, not a `section`: one button and no heading, and
an unnamed `<section>` would add an unnamed region. `.cat-offer` takes no top padding, so
moving it costs **+64px** on a category page rather than a full section pad's 160.

The template comment written for this change tripped `check-catalog-pages.js`, which scans
comments **on purpose** and which `src/category.html`'s own header warns about. Reworded.
That is the gate working, and it is recorded rather than quietly fixed.

## Gates

Every gate its own process, its own exit code read (R-AB):

| Gate | Exit |
|---|---|
| `check-merge-artifacts.js` · `build.js` · `check-links.js` · `check-stale-docs.js` | 0 · 0 · 0 · 0 |
| `check-asset-provenance.js` · `check-scarcity.js` · `check-catalog-pages.js` | 0 · 0 · 0 |
| `check-svg-a11y.js` · `check-origin.js` · `check-image-metadata.js` | 0 · 0 · 0 |
| `check-photo-slots-w24.js` · `check-stub-count.js` · `gen-catalog-image-slots.js --check` | 0 · 0 · 0 |
| `check-header-fit.js` · `check-heading-fit.js` · `check-nav-contrast.js` | 0 · 0 · 0 |
| **`check-layout-geometry.js` (gate 20)** | **0**, 64 of 64 |
| `check-lighthouse.js` (gate 5) | 0, 99/100 and 99/100 on the median of three, spread 0 |

`check-catalog-pages.js` and `gen-catalog-image-slots.js --check` each exited 1 once, for
the two reasons recorded above, and both are green on the tree that ships.
