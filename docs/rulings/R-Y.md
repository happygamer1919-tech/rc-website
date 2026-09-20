# RULING R-Y · Per-page height budgets after wave 14, 2026-09-15

Recorded at the owner's instruction, from the wave 14 close-out dispatch (card
RC-113). **Supersedes R-J's figures. R-J's method stands.**

## The ruling, as given

> After everything above is merged, measure RO and RU under R-P for the homepage
> and each new service page. Author a ruling holding the new per-page budgets and
> apply R-R inline amendments to the superseded R-J values.

## How the figures were measured

Under R-P, on the live domain `https://rapidconstruct.md`, at 1440x900, after the
last close-out merge (#24). Every request cache-busted; the `build-sha` meta tag
asserted in the same page load as the height, and it matched on every page; every
`[data-reveal]` applied and settled before reading `scrollHeight`. Two full runs,
identical to the pixel. `scripts/verify-live.js`, run against the same commit,
reported every page VERIFIED.

`git rev-parse` of the merge commit of #24 is the SHA these figures belong to.
It is not restated here, for the reason the wave 12 handoff gives: a SHA copied
into prose is the same class of thing as a budget copied into prose.

## The method, carried from R-J

**A budget is a measured baseline, plus the measured cost of each element, plus a
stated headroom term. It is never rounded.** The headroom term is R-J's, 60px, not
re-derived.

## Homepage

| Term | RO | RU |
|---|---|---|
| Last verified run under R-J, tag `wave-12-closed`. Already includes the promo bar, the portfolio end tile and the coverage list | 8,818 | 9,032 |
| Roofing offer cards with their four images (W14-08, W14-18), measured as the section | +1,340 | +1,398 |
| Product teaser row (W14-16), measured as the section | +263 | +290 |
| Every other wave 14 change, net, measured as the remainder: the guarantee card and social row (W14-07), the section 1 copy (W14-03, W14-04), the header (W14-15), the frozen price removed (W14-05), and the tile grid, carports and fences moved to their own pages (W14-16) | +26 | +27 |
| **Measured** | **10,447** | **10,747** |
| Headroom | +60 | +60 |
| **Budget, under** | **10,507** | **10,807** |

**Removing an element by data drops the budget by that element's cost,**
re-measured for this ruling by taking the element out of the live page and reading
the settled height again. Both costs are unchanged from R-J.

| Removed by data | Cost | RO budget | RU budget |
|---|---|---|---|
| Promo bar | 44 | 10,463 | 10,763 |
| Portfolio end tile | 101 | 10,406 | 10,706 |
| Both | 145 | 10,362 | 10,662 |

## Product pages

Measured total plus the 60px headroom term. Each page is the product page
template: header, promo bar, a hero with breadcrumb, H1 and one line, the product
block, the quote form and the footer.

| Page | Product block as measured | RO measured | RO budget, under | RU measured | RU budget, under |
|---|---|---|---|---|---|
| `/servicii/tigla-metalica/` | the tile grid, text chips, no renders | 3,647 | **3,707** | 3,698 | **3,758** |
| `/servicii/copertine/` | chooser, twelve models, four steps, no images | 4,587 | **4,647** | 4,663 | **4,723** |
| `/servicii/garduri/` | empty, no models | 2,298 | **2,358** | 2,298 | **2,358** |

Promo bar removed by data: each product page budget drops by 44.

## What moves a budget

Each of these adds height when it lands, and each needs a measurement and an
amendment block appended to this ruling (R-T) in the same PR:

- Metal tile profile renders in the tile grid (Q-W14-11).
- Carport family and model images (Q-W14-12).
- Fence models in `content/garduri.json` (Q-W14-09). **The fences budget above is
  the empty page's.**
- Before/after pairs in `content/before-after.json`: the homepage section is
  absent today and costs nothing.

The catalog menu (#7) lives in the header and the origin cutover (#20) changes no
markup height; neither moves a budget.

**Service pages are not held here.** They stay under the wave 7 acceptance table
in `RELEASE-NOTES.md`.

## Where it is enforced

- `scripts/verify-live.js`, `PAGES`: the two homepage budgets and the six product
  page rows, with a `product` marker set.
- `scripts/check-stale-docs.js`: R-J's 8,851 and 9,065 are superseded values, per
  R-Q as amended at W12-29. Every governing document carrying them, or pointing to
  R-J for the current figures, carries an R-R amendment naming this ruling.

## Recorded interpretations, each open for ratification

1. **The baseline is the last R-J-verified run, not R-J's corrected baseline.**
   Wave 12 spent 33px of R-J's headroom on each locale before it closed. Starting
   from the verified run folds that into the baseline, so the headroom is a full
   60px again rather than 27.
2. **The remainder term is measured as a remainder,** not card by card. Several
   wave 14 cards moved the page in both directions (the page split removed more
   than 3,000px), so a per-card figure would need each card reverted in turn.
3. **"Each new service page" is read as the three product pages** RC-116 created.
   No service page was added in wave 14.
4. **The fences budget is set on an empty page** because that is what is live.
   It is expected to move when Q-W14-09 is answered.

### Amended 2026-09-15 by the wave 14 tail (W14-20, W14-22, W14-23) · the three product pages filled

Added under R-T; nothing above this block was edited. The tail dispatch filled all
three product pages, which is what "What moves a budget" said would happen. Measured
the same way as the ruling: on the live domain after the last tail merge, cache-busted,
`build-sha` asserted in the same load and matching on every page, reveals settled,
two identical runs. Each budget is again the measured height plus the 60px headroom
term.

| Page | Product block now | RO measured | RO budget, under | RU measured | RU budget, under |
|---|---|---|---|---|---|
| `/servicii/tigla-metalica/` | the tile grid with RAL swatches and the indicative-colour line (W14-22) | 3,781 | **3,841** | 3,815 | **3,875** |
| `/servicii/copertine/` | chooser, twelve models and four steps, each card with its line diagram (W14-23) | 5,433 | **5,493** | 5,509 | **5,569** |
| `/servicii/garduri/` | chooser, materials and finish, four steps, FAQ (W14-20) | 4,756 | **4,816** | 4,778 | **4,838** |

These supersede the product page budgets in the table above. The homepage measured
10,447 RO and 10,747 RU, unchanged: the catalog button (#7) sits in the
header and moves no height, so the homepage budgets and their revert figures stand.
Promo bar removed by data: each product page budget still drops by 44.

The fences budget is no longer the empty page's. Metal tile renders (Q-W14-11b) would
still move the tile grid budget.

### Amended 2026-09-16 by W16-02 (RC-129) · the seven catalog category pages

Added under R-T; nothing above this block was edited. RC-129 created seven
category pages in each locale, on their own root `/catalog/`. They are new pages
needing budgets. **Nothing existing moved:** the ten pages this ruling already
holds were re-measured in the same run and every one was identical.

**These figures are ~~LOCAL~~, and that is stated rather than glossed.** **AMENDED 2026-09-16 (W17-03): never read under R-P. W17-02 replaced them before any live reading was recorded, and W17-03 below confirms W17-02's figures under R-P.** R-Y's other
budgets are R-P readings taken on the live domain after a deploy. These pages are
not deployed yet, so an R-P reading of them cannot exist before this merges. They
were measured on a local build at 1440x900, every `[data-reveal]` applied and
settled per `docs/CLAUDE.md` section 2, with each page's markers asserted in the
same pass: promo bar present, zero profile anchors, no horizontal overflow, a
non-empty H1 in that locale. **They are proposed budgets**, and the first live
verification after this merges confirms or corrects them under R-P. Wave 15 found
local and live agreeing to the pixel on every page the two shared, which is why a
local figure is worth proposing rather than leaving fourteen pages unbudgeted.

Each budget is the measured height plus the **60px headroom term**, R-J's, not
re-derived.

| Page | RO measured | RO budget, under | RU measured | RU budget, under |
|---|---|---|---|---|
| `/catalog/termoizolatie/` | 2,687 | **2,747** | 2,714 | **2,774** |
| `/catalog/tencuieli-decorative/` | 2,502 | **2,562** | 2,529 | **2,589** |
| `/catalog/placi-ceramice/` | 2,502 | **2,562** | 2,529 | **2,589** |
| `/catalog/elemente-decorative/` | 2,502 | **2,562** | 2,529 | **2,589** |
| `/catalog/vopsele/` | 2,605 | **2,665** | 2,633 | **2,693** |
| `/catalog/sisteme-iluminare/` | 2,502 | **2,562** | 2,502 | **2,562** |
| `/catalog/alte-materiale/` | 2,502 | **2,562** | 2,502 | **2,562** |

**Why they differ at all.** Every category page is the same template: header,
promo bar, hero with breadcrumb and H1, the block, the quote form, footer. The
only variable is the block. Five categories have no subcategories and measure the
floor, 2,502 RO. Termoizolație carries five subcategory names (+185) and Vopsele
two (+103). That is the entire spread.

**No promo-bar revert figure is stated for these pages.** R-Y's method is that a
revert value is *measured* by taking the element out and reading the height again,
never assumed from another page type. That measurement was not taken here, so the
figure is absent rather than guessed. If the promo bar is removed by data, these
fourteen budgets need a re-measure.

**Where they are enforced:** `scripts/verify-live.js`, `PAGES`, fourteen rows with
a `category` marker set. That marker set asserts `areaServed: 0`, because these
pages carry no JSON-LD by design.

### Amended 2026-09-16 by W17-02 (RC-133) · the category pages with their authored prose

Added under R-T; nothing above this block was edited. RC-133 gave each of the
fourteen category pages a lede under the H1 and two paragraphs opening the block,
which is what "What moves a budget" requires a measurement for. **These budgets
supersede the ones in the W16-02 block above.** Nothing else moved: the eight
other pages this ruling holds, both homepages and the six product pages, were
re-measured in the same run and each was identical to its current figure above.

**Still ~~LOCAL~~, and stated as such.** **AMENDED 2026-09-16 (W17-03): confirmed under R-P on the live domain, identical to the pixel on all fourteen pages; the W17-03 block below holds the R-P reading.** The prose is not deployed until this merges,
so an R-P reading cannot exist yet. Measured by `scripts/verify-live.js` against a
local server of this branch's `dist/`, at 1440x900: every request cache-busted,
`build-sha` asserted in the same page load and matching on all 28 pages, markers
asserted, every `[data-reveal]` applied and settled before `scrollHeight` was read.
Two full runs over all 28 pages the script holds, identical to the pixel. RC-134 re-measures them live
under R-P and replaces this label.

Each budget is the measured height plus the **60px headroom term**, R-J's, not
re-derived.

| Page | RO measured | RO budget, under | RU measured | RU budget, under |
|---|---|---|---|---|
| `/catalog/termoizolatie/` | 3,072 | **3,132** | 3,127 | **3,187** |
| `/catalog/tencuieli-decorative/` | 2,974 | **3,034** | 3,028 | **3,088** |
| `/catalog/placi-ceramice/` | 2,892 | **2,952** | 2,974 | **3,034** |
| `/catalog/elemente-decorative/` | 2,919 | **2,979** | 3,001 | **3,061** |
| `/catalog/vopsele/` | 2,991 | **3,051** | 3,018 | **3,078** |
| `/catalog/sisteme-iluminare/` | 2,947 | **3,007** | 2,947 | **3,007** |
| `/catalog/alte-materiale/` | 2,919 | **2,979** | 2,919 | **2,979** |

**What the prose cost**, measured minus the W16-02 figure: RO 385 to 472px, RU 385
to 499px. The spread is paragraph length at the 720px measure, not layout: every
page carries exactly one lede and two paragraphs.

**Still no promo-bar revert figure**, for the reason the W16-02 block gives: it was
not measured, so it is absent rather than guessed.

**Where they are enforced:** `scripts/verify-live.js`, `PAGES`, the same fourteen
rows, figures replaced. The W16-02 figures are now known-superseded values in
`scripts/check-stale-docs.js` (`budget-cat-w16`), per R-Q.

### Amended 2026-09-16 by W17-03 (RC-134) · the category budgets confirmed under R-P

Added under R-T. The two LOCAL labels above are struck in place under R-R, at the
owner's direction; ~~no other sentence above this block was edited~~. **AMENDED
2026-09-16 (W18 ratifications): the strike is R-R conduct, not an exception to R-T.
R-R permits striking a value in place where it has documentary purpose, so the two
strikes edited no sentence in R-T's sense, and nothing else above this block changed.**

**Measured under R-P on the live domain `https://rapidconstruct.md`**, after the
last wave 17 merge that changes a page (#42), with the deployed commit's
`build-sha` asserted equal to that merge commit on every page, in the same page
load as the height. Every request cache-busted with a token unique to the run;
browser cache disabled; 1440x900; every `[data-reveal]` applied and settled before
`scrollHeight` was read. The merge commit is not restated here, for the reason the
ruling gives at the top.

**A content marker unique to the prose build was added for this reading.** The
category marker set now also asserts three `data-cat-prose` blocks per page. A
category page built before W17-02 carries none, so a stale copy returning plausible
heights cannot pass it. Watched failing: with four blocks expected, all fourteen
category pages reported UNVERIFIED on that marker and the run exited 1.

**Four full runs, identical to the pixel on all 28 pages the script holds.** One
before the marker was added and three with it, the last taken after the negative
arm as its control. Every page VERIFIED, every page inside budget, and the
reachability crawl found zero visible TODO across 33 URLs.

| Page | RO measured, R-P | RO budget, under | RU measured, R-P | RU budget, under |
|---|---|---|---|---|
| `/catalog/termoizolatie/` | 3,072 | **3,132** | 3,127 | **3,187** |
| `/catalog/tencuieli-decorative/` | 2,974 | **3,034** | 3,028 | **3,088** |
| `/catalog/placi-ceramice/` | 2,892 | **2,952** | 2,974 | **3,034** |
| `/catalog/elemente-decorative/` | 2,919 | **2,979** | 3,001 | **3,061** |
| `/catalog/vopsele/` | 2,991 | **3,051** | 3,018 | **3,078** |
| `/catalog/sisteme-iluminare/` | 2,947 | **3,007** | 2,947 | **3,007** |
| `/catalog/alte-materiale/` | 2,919 | **2,979** | 2,919 | **2,979** |

**Identical to W17-02's LOCAL figures on every page, so no budget changes.** Local
and live agreeing to the pixel is what wave 15 found too. Identical figures are
also exactly what a stale edge copy returns, which is why identity rests on the
`build-sha` and the prose marker read in the same load, not on the numbers.

The eight other pages this ruling holds read the same live as their current
figures above: homepage 10,447 RO and 10,747 RU; tile 3,781 and 3,815; carports
5,433 and 5,509; fences 4,756 and 4,778.

**Still no promo-bar revert figure for the category pages.** Not measured, so not
stated.

### Amended 2026-09-16 by W18-01 (RC-138) · the tile page with its profile diagrams

Added under R-T; nothing above this block was edited. RC-138 put an original
profile diagram above each of the four models in the tile grid, closing Q-W14-11b
in place of the renders "What moves a budget" named. The drawings are inline SVG:
no image file, and no request. **These budgets supersede the tile page row of the
wave 14 tail block above.** Nothing else moved: the other 26 pages `scripts/verify-live.js` holds,
service pages included, were re-measured in the same run and each was identical to
its current figure.

**These figures are ~~LOCAL~~, and stated as such.** **AMENDED 2026-09-17 (W19-01): confirmed under R-P on the live domain, identical to the pixel on both tile pages; the W19-01 block below holds the R-P reading.** The diagrams are not deployed
until this merges, so an R-P reading cannot exist yet. Measured by
`scripts/verify-live.js` against a local server of this branch's `dist/`, at
1440x900: every request cache-busted, `build-sha` asserted in the same page load and
matching on all 28 pages, markers asserted, every `[data-reveal]` applied and settled
before `scrollHeight` was read. **A marker unique to this build was added first**:
the tile page asserts four `[data-tile-diagram]` elements, which a tile page built
before RC-138 cannot carry. Two full runs, identical to the pixel.

Each budget is the measured height plus the **60px headroom term**, R-J's, not
re-derived.

| Page | Product block now | RO measured | RO budget, under | RU measured | RU budget, under |
|---|---|---|---|---|---|
| `/servicii/tigla-metalica/` | the tile grid, a profile diagram above each model (W18-01), swatches unchanged | 3,940 | **4,000** | 3,973 | **4,033** |

**4,000 is a sum, not a rounding.** 3,940 measured plus 60 headroom. It is stated
here because a round-looking budget is exactly what this method exists to rule out.

**What the diagrams cost**, measured minus the wave 14 tail figure: RO +159, RU
+158. One grid row, so one diagram's height plus its margin; the four cards share
the row and the tallest sets it.

Promo bar removed by data: the tile page budget still drops by 44, a figure this
card did not re-measure. The diagrams sit inside the grid, below the promo bar, and
change nothing above it.

**Where they are enforced:** `scripts/verify-live.js`, `PAGES`, the two tile rows,
now of type `tigla`, whose marker set adds `tileDiagrams: 4`. The tail's 3,841 and
3,875 are known-superseded values in `scripts/check-stale-docs.js`
(`budget-tigla-w14`), per R-Q.

### Amended 2026-09-17 by W19-01 (RC-141) · the tile budgets confirmed under R-P

Added under R-T. The LOCAL label in the W18-01 block above is struck in place under
R-R, with an inline amendment naming W19-01. That strike is R-R conduct, not an edit
in R-T's sense (`docs/CLAUDE.md` section 17, as amended at the W18 ratifications).
No other sentence above this block was edited.

**Measured under R-P on the live domain `https://rapidconstruct.md`**, after #44
(RC-138) deployed. The build measured is the latest deployed commit, which contains
#44 and changes no page after it: #45 and #46 changed scripts and workflows, #47
added documents. The deployed commit's `build-sha` was asserted equal to the
expected commit on every page, in the same page load as the height. Every request
was cache-busted with a token unique to the run; the browser cache was disabled;
1440x900; every `[data-reveal]` was applied and settled before `scrollHeight` was
read. The commit is not restated here, for the reason the ruling gives at the top.

**Three clean runs, identical to the pixel on all 28 pages the script holds.** Every
page was VERIFIED and inside budget, 28 of 28 read, and the reachability crawl found
zero visible TODO across 33 URLs. The third run was the control after two negative
arms, each failing on its own message:
- expecting `tileDiagrams: 5`, both tile pages reported UNVERIFIED on
  `marker mismatch: tileDiagrams expected 5, got 4`;
- expecting the commit before the deployed one, all 28 pages reported UNVERIFIED on
  `build-sha mismatch`.

| Page | RO measured, R-P | RO budget, under | RU measured, R-P | RU budget, under |
|---|---|---|---|---|
| `/servicii/tigla-metalica/` | 3,940 | **4,000** | 3,973 | **4,033** |

**Identical to W18-01's LOCAL figures, so no budget changes.** Identical figures are
also exactly what a stale edge copy returns. Identity rests on the `build-sha` and
the four `[data-tile-diagram]` markers read in the same load, not on the numbers.

**Every other page this ruling holds also read live exactly as its last local reading,
delta 0 on all 28:**
- homepage 10,447 RO and 10,747 RU;
- carports 5,433 and 5,509;
- fences 4,756 and 4,778;
- the fourteen category pages as in the W17-03 block.
The six service page rows `scripts/verify-live.js` also checks read the same, under
their wave 7 budget.

**Still no promo-bar revert figure measured for the tile page's current state.** The
44 stated in the wave 14 tail block was measured before the diagrams, and was not
re-measured here.

### Amended 2026-09-19 by W24-04 · every catalogue page re-measured, and thirty budgets

Added under R-T; nothing above this block was edited.

**Ruling W24-R4, as the owner gave it:**

> R-Y amended: pages changed or created in W24 get new height budgets = measured +
> 60 at ship. The 1400px section cap does not apply to catalogue grids. Record each
> new number.

**What changed under the catalogue's feet.** Until this card a catalogue category
page carried a hero, two authored paragraphs, a subcategory list and a quote form,
and its product section was absent because there were no records: the W17-02
budgets, 2,952 to 3,187, are heights of a page with no products on it. W24-03 put
223 records in, W24-04 renders them, every subcategory gained a page of its own
(finding F-03), and `/catalog/` became a real page instead of a 404. **All fourteen
old figures are superseded and sixteen more are new, thirty in all.**

**Measured the way section 2 requires**: 1440px, every `[data-reveal]` applied and
settled for 1.6s before `scrollHeight` was read, Inter loaded and asserted loaded on
every page, in the workstation's own Chrome over CDP against the built tree. These
are LOCAL measurements on this branch, not live readings: R-P's live confirmation is
owed after the deploy and is recorded as owed, not as taken.

| Page | Category | RO measured | RO budget | RU measured | RU budget |
|---|---|---|---|---|---|
| `/catalog/` | Catalogue index | 3,559 | **3,619** | 3,584 | **3,644** |
| `/catalog/termoizolatie/` | Sisteme de termoizolatie | 6,737 | **6,797** | 6,654 | **6,714** |
| `/catalog/termoizolatie/polistiren-expandat/` | Polistiren expandat | 3,483 | **3,543** | 3,400 | **3,460** |
| `/catalog/termoizolatie/polistiren-extrudat/` | Polistiren extrudat | 2,960 | **3,020** | 3,004 | **3,064** |
| `/catalog/termoizolatie/vata-minerala/` | Vata minerala | 3,440 | **3,500** | 3,442 | **3,502** |
| `/catalog/termoizolatie/adezivi-si-mase-de-spaclu/` | Adezivi si mase de spaclu | 3,957 | **4,017** | 3,880 | **3,940** |
| `/catalog/termoizolatie/alte-produse/` | Alte produse | 2,933 | **2,993** | 2,892 | **2,952** |
| `/catalog/tencuieli-decorative/` | Tencuieli decorative | 5,186 | **5,246** | 5,292 | **5,352** |
| `/catalog/placi-ceramice/` | Placi ceramice | 12,605 | **12,665** | 13,488 | **13,548** |
| `/catalog/elemente-decorative/` | Elemente decorative | 10,422 | **10,482** | 10,857 | **10,917** |
| `/catalog/vopsele/` | Vopsele | 4,180 | **4,240** | 4,275 | **4,335** |
| `/catalog/vopsele/vopsele-de-exterior/` | Vopsele de exterior | 2,940 | **3,000** | 2,962 | **3,022** |
| `/catalog/vopsele/vopsele-de-interior/` | Vopsele de interior | 2,962 | **3,022** | 3,008 | **3,068** |
| `/catalog/sisteme-iluminare/` | Sisteme de iluminare | 6,194 | **6,254** | 6,138 | **6,198** |
| `/catalog/alte-materiale/` | Alte materiale de constructii | 3,583 | **3,643** | 3,583 | **3,643** |

**The 1,400px section cap does not apply to a catalogue grid.** `docs/CLAUDE.md`
section 2 carries the amendment: the grid is the third standing exception beside the
services grid and the portfolio grid. Placi ceramice rolls up 88 products and Elemente
decorative 64, and no cap can be met by a section whose length is data. The cap still
holds on every other section of these pages.

**The widest gap between the locales is `/catalog/placi-ceramice/`, 883px**, because the Russian
product names are longer and more of them wrap to a third line. The narrowest is `/catalog/alte-materiale/`,
0px.

**These are the second measurement, not the first.** The first draft of this card was
reviewed before it was committed and twenty-two defects were confirmed in it, four of
which changed a page's height: the catalogue index lost an invented lede, the card's
price gained the unit the source states after it, the product name stopped absorbing the
row's slack, and the foot stopped wrapping. Every figure above was re-measured after
those changes, on the tree that is committed.

`scripts/verify-live.js` restates these thirty budgets, which is the arrangement
section 4 already has with the Lighthouse floors: change one and the other must
change with it.
