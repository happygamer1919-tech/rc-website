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

### Amended 2026-09-20 by W24-05 · the case la cheie page leaves the shared service budget

Added under R-T; nothing above this block was edited.

The before/after slider moved off the homepage, where it had never rendered because
`content/before-after.json` was empty, onto the **case la cheie** service page, which is
where the wave 24 dispatch places it. Four projects, eight placeholder slots.

**That page therefore leaves the shared 6,000px service budget** that RELEASE-NOTES's
wave 7 acceptance holds for all eighteen service pages, and takes its own under W24-R4.
The other service pages are untouched and stay on 6,000.

| Page | RO measured | RO budget | RU measured | RU budget |
|---|---|---|---|---|
| `/servicii/case-la-cheie/` | 6,376 | **6,436** | 6,483 | **6,543** |

Measured the section 2 way: 1440px, every `[data-reveal]` applied and settled, Inter
loaded and asserted loaded, in the workstation's own Chrome. Local, not live: R-P's
confirmation is owed after the deploy.

**The homepage did not move**, 10,447 RO and 10,747 RU, identical to before the card. The
slot it lost had never rendered anything, so removing it cost nothing, and the identical
figures are the evidence that the move changed no other page.

**The slider's own height is the frame's aspect ratio, 1180 by 664**, so it does not grow
when the photographs land: a placeholder and a photograph occupy the same box. That is
why these two budgets are safe to set before the photo session rather than after it.

### Amended 2026-09-20 by W24-06 · the homepage loses a section, the roofing page gains it

Added under R-T; nothing above this block was edited.

**"Patru lucrări de acoperiș" moved off the homepage onto the acoperisuri service page**,
where the dispatch puts it. Both pages therefore take new budgets under W24-R4, and the
homepage's are the first figures in this ruling to go DOWN.

| Page | RO measured | RO budget | RU measured | RU budget |
|---|---|---|---|---|
| `/` | 9,135 | **9,195** | 9,376 | **9,436** |
| `/servicii/acoperisuri/` | 6,708 | **6,768** | 6,846 | **6,906** |
| `/in-constructie/` | 1,122 | **1,182** | 1,122 | **1,182** |

**The homepage lost 1,312px in RO and 1,371px in RU**, which is what the section cost. The
old figures, 10,507 and 10,807, are superseded and are registered in
`scripts/check-stale-docs.js` so nothing can quote them again. R-J's derivation and its
revert values are about the promo bar and the 100+ tile and are untouched by this: what
changed is that a whole section left, not that a term in the derivation moved.

**The acoperisuri page leaves the shared 6,000px service budget** that RELEASE-NOTES's wave
7 acceptance holds, exactly as the case la cheie page did at W24-05 and for the same
reason: a page that gains a section is no longer the page that figure was measured on. The
remaining service rows stay on 6,000.

**`/in-constructie/` is new**: a shared page the calculate-a-price tiles of W24-07 and
W24-08 land on until a calculator exists. It is `noindex` and out of the sitemap, so it is
not measured by gate 14, which reads the sitemap; `scripts/verify-live.js` lists it with
its own marker set, and `scripts/check-header-fit.js` measures its header, because it
carries one.

Measured the section 2 way: 1440px, every `[data-reveal]` applied and settled, Inter loaded
and asserted loaded. Local, not live: R-P's confirmation is owed after the deploy.

### Amended 2026-09-20 by W24-07 · the acoperisuri bento, and a new mirror page

Added under R-T; nothing above this block was edited.

The bento hub became the first section after the header on the acoperisuri page, and
`/servicii/roca-vulcanica/` is new: the rocă vulcanică page, mirroring the `imperlux.md`
hub section by section under W24-R6 and W24-R7.

| Page | RO measured | RO budget | RU measured | RU budget |
|---|---|---|---|---|
| `/servicii/acoperisuri/` | 7,598 | **7,658** | 7,736 | **7,796** |
| `/servicii/roca-vulcanica/` | 4,288 | **4,348** | 4,386 | **4,446** |

The acoperisuri figure is the third this wave: 5,313 before wave 24, 6,708 when W24-06
moved the roofing offers onto it, and 7,598 now that the bento sits above them.

**7,598 is the second measurement.** The first read 7,684 on a bento whose tiles were
rendering with the wrong stylesheet rules, because its classes collided with the garduri
page's; the correction below reports it. Only the
last is live; the other two are superseded within the wave and are recorded here so the
sequence is readable rather than inferred.

**The bento's own height is fixed by its geometry**, two rows of 244px and a 16px gap, so
it does not grow when the photographs land: a placeholder and a photograph occupy the same
tile. The mirror page's four model cards are the same.

`scripts/verify-live.js` asserts four bento tiles of which exactly three are links, which
is what holds the inert tile inert: a build that made the fourth a link would fire.

**Corrected within the card.** The bento's classes were written as `.bento__*`, and the
garduri page has carried `.bento` and `.bento__tile` since W16 for its chooser tiles. Both
declarations are (0,1,0) and the garduri one is later in the stylesheet, so it won.
Measured on the built page: the section itself became a three-column grid, the tiles
rendered white on a 10px radius with 24px of padding instead of `#141414` on 24px, and the
tall tile came out **128px wide against an intended 373**. Renamed to `.hub__*`. Every
gate was green throughout, because no gate reads a layout, and the figures in the table
above are from after the rename.

### Amended 2026-09-20 by W24-08 · the garduri bento, the copertine hero, and a second mirror page

Added under R-T; nothing above this block was edited.

The garduri page gained the fence bento as its first section, the copertine page gained a
dark full-width hero and a cross-sell row, and `/servicii/modele-garduri/` is new.

| Page | RO measured | RO budget | RU measured | RU budget |
|---|---|---|---|---|
| `/servicii/garduri/` | 5,668 | **5,728** | 5,690 | **5,750** |
| `/servicii/modele-garduri/` | 3,720 | **3,780** | 3,742 | **3,802** |
| `/servicii/copertine/` | 6,555 | **6,615** | 6,631 | **6,691** |

The copertine figure moved by 1,062px in RO: the dark hero replaces the standard light one
rather than sitting above it, so the growth is the hero's extra padding plus the
cross-sell row, not a whole second hero.

**The copertine page's twelve SVG models are untouched**, and the secondary CTA in the new
hero is an in-page anchor to them.

`scripts/verify-live.js` asserts four bento tiles of which exactly three are links on the
garduri page, the same assertion the roofing hub has, and **zero** on a plain product page,
which is what keeps a hub from appearing where none belongs.

This is the last amendment of wave 24. Eleven pages in this ruling now carry a budget set
under W24-R4, and every one is measured plus 60 on the tree that shipped.

### Amended 2026-09-20 by W24-09 · the phone reveal, the catalogue section order, and a brand line withheld

Added under R-T; nothing above this block was edited. **The line in the W24-08 block
calling itself "the last amendment of wave 24" is superseded by this one.**

Three W24-09 changes move a catalogue page's height, and all three move it in the same
direction on a phone and a small one on the desktop:

1. **The hero's quote button and the prose block moved below the product grid**, so the
   cards are what a visitor meets first. The button left the hero, where it carried
   `margin-top: 32px`, and landed in a `.cat-offer` wrapper with no top padding. Net on
   the desktop measurement: **+64px on a category page**, and nothing on a subcategory
   page, which renders no prose block.
2. **The RedConstruct brand line is withheld on 64 records** (Q-W24-03 part 2, the owner's
   default). Sixty-four `.prod__brand` lines left the elemente decorative page and took
   **281px of RO and 300px of RU** with them.
3. **The phone reveal**, which changes no desktop measurement at all and is the reason
   this card exists. It is recorded below in its own table, because a budget in this
   ruling is a desktop figure and these are not budgets.

#### The budgets, measured at 1440px settled, plus 60 under W24-R4

| Page | RO measured | RO budget | RU measured | RU budget |
|---|---|---|---|---|
| `/catalog/` | 3,623 | **3,683** | 3,648 | **3,708** |
| `/catalog/termoizolatie/` | 6,801 | **6,861** | 6,718 | **6,778** |
| `/catalog/termoizolatie/polistiren-expandat/` | 3,547 | **3,607** | 3,464 | **3,524** |
| `/catalog/termoizolatie/polistiren-extrudat/` | 3,024 | **3,084** | 3,068 | **3,128** |
| `/catalog/termoizolatie/vata-minerala/` | 3,504 | **3,564** | 3,506 | **3,566** |
| `/catalog/termoizolatie/adezivi-si-mase-de-spaclu/` | 4,021 | **4,081** | 3,944 | **4,004** |
| `/catalog/termoizolatie/alte-produse/` | 2,997 | **3,057** | 2,956 | **3,016** |
| `/catalog/tencuieli-decorative/` | 5,250 | **5,310** | 5,356 | **5,416** |
| `/catalog/placi-ceramice/` | 12,669 | **12,729** | 13,552 | **13,612** |
| `/catalog/elemente-decorative/` | 10,141 | **10,201** | 10,576 | **10,636** |
| `/catalog/vopsele/` | 4,244 | **4,304** | 4,339 | **4,399** |
| `/catalog/vopsele/vopsele-de-exterior/` | 3,004 | **3,064** | 3,026 | **3,086** |
| `/catalog/vopsele/vopsele-de-interior/` | 3,026 | **3,086** | 3,072 | **3,132** |
| `/catalog/sisteme-iluminare/` | 6,258 | **6,318** | 6,202 | **6,262** |
| `/catalog/alte-materiale/` | 3,647 | **3,707** | 3,647 | **3,707** |

Every figure above supersedes the W24-04 block's for the same page. The elemente
decorative pair is the only one that FELL, and it fell by exactly the 64 brand lines.

#### What the phone reveal did, measured at 390px with mobile emulation, on load

**These are measurements, not budgets.** Section 2 defines a budget as a desktop figure
and this ruling holds desktop figures; these are recorded here so the next card does not
have to re-measure them to know what moved.

Every figure in this table was read in a real browser on both trees: `origin/main` at
`2ab3a4b` built into a worktree for the "before" column, and this branch for the "after",
both at 390px with mobile emulation, every reveal applied and settled.

| Page | RO before | RO after | RU before | RU after |
|---|---|---|---|---|
| `/catalog/placi-ceramice/` | 47,917 | **10,189** | 49,963 | **10,760** |
| `/catalog/elemente-decorative/` | 37,820 | **10,306** | 38,067 | **10,552** |
| `/catalog/termoizolatie/` | 17,543 | **10,778** | 17,357 | **10,902** |
| `/catalog/sisteme-iluminare/` | 16,844 | **10,383** | 16,685 | **10,450** |
| `/catalog/tencuieli-decorative/` | 11,338 | **10,885** | 11,573 | **11,121** |

The RU ceramic plates page was the longest page on the site at **49,963px**, which is
about 128 screens of a 390px phone. It is now 10,760.

A page with 12 or fewer products is unchanged, because nothing folds: `/catalog/vopsele/`
reads 6,884 before and 6,908 after in RO, 7,102 and 7,126 in RU, and the 24px both times
is the moved button, not the reveal.

**Tencuieli decorative is the page this helps least**, 11,573 to 11,121 in RU, because 13
products fold to 12 and the one card removed is all the reveal can take. Its length is its
prose block and its form, not its grid.

**The dispatch's target of under 9,000px at 390 is NOT met, and cannot be met at twelve
cards.** The arithmetic is in the open: below 512px the grid is one column, the card's
media is a ledgered `1 / 1` placeholder, and twelve cards measure 6,181px on a 390px
viewport. The rest of the page (header, hero, prose block, offer button, quote form and
footer) is 4,008px, and none of it is this card's. 6,181 + 4,008 = 10,189. Reaching 9,000
needs the first-screen count at **nine** or **eight**, which is one number in `build.js`
(`PROD_STEP`). Both were built and measured rather than derived: nine reads **8,696px** and
eight reads **8,198px**. Twelve is what the dispatch specifies, so twelve shipped.
**Q-W24-04** carries the question with all three figures.

The reveal is held by gate 20, which asserts the painted count equals the page's own
`data-prod-step` at 390 and equals every card at 1440.

### Amended 2026-09-20 by W24-09b · the service page budgets were never breached; a collision moved the pages

Added under R-T; nothing above this block was edited. **This block RESTORES figures
rather than setting new ones.**

W24-09's live run reported `/servicii/case-la-cheie/` at 6,475px against the 6,436 budget
this ruling gave it at W24-05, and W24-09 recorded that as W24-05 having measured before
the slider settled. **That attribution was wrong, and it was corrected by measuring rather
than by argument.**

The page was built and measured at each wave 24 merge in turn:

| Tree | `/servicii/case-la-cheie/` RO |
|---|---|
| #82, W24-05, where the budget was set | 6,376 |
| #83, W24-06 | 6,376 |
| **#84, W24-07** | **6,475** |
| #85, #86 | 6,475 |

**W24-05's measurement was correct.** W24-07 moved the page, and it moved every other
service page by the same 99px: fațade 5,284 to 5,383, finisaje 5,339 to 5,438, instalații
5,340 to 5,439, terasamente 5,487 to 5,586. The cause is the `.faq` class collision
recorded in `DECISIONS.md` at W24-09b, not a budget taken too early.

With the collision corrected, every service page returns to its pre-W24-07 height
**exactly**, delta 0 on each one measured, and case la cheie reads **6,376 RO and 6,483
RU**: the figures W24-05 recorded, inside the budgets W24-05 set.

| Page | RO measured | RO budget | RU measured | RU budget |
|---|---|---|---|---|
| `/servicii/case-la-cheie/` | 6,376 | **6,436** (unchanged, W24-05's) | 6,483 | **6,543** (unchanged, W24-05's) |

**No budget moves.** The other eighteen service pages stay on the shared 6,000px wave 7
acceptance, which they never breached, having had enough slack to absorb 99px invisibly.

**One figure in this ruling IS superseded.** `/servicii/roca-vulcanica/` was measured at
4,288 RO for the W24-07 block, and that measurement was taken while the page was receiving
the wave 14 `.faq` rules by accident: `display: flex` and an 18px gap it was never meant
to have. With its own `.nvk-faq` prefix it measures **4,234**, which is the rendering
W24-07 specified. It is inside its 4,348 budget either way, so the budget does not move;
the measurement beside it is corrected here under R-R.

**What this says about height budgets generally**, recorded because it is the useful part:
a budget caught this, but only on the one page of twenty that happened to have a tight one.
A budget is a good alarm and a poor detector. Gate 22 is the detector.

### Amended 2026-09-20 by W24-10 · the phone reveal moves to nine cards; no desktop budget changes

Added under R-T; nothing above this block was edited.

The owner answered Q-W24-04 with **nine**. `PROD_STEP` in `build.js` is 9.

**NO BUDGET IN THIS RULING MOVES.** A budget here is a measurement at 1440px, and at
1440px nothing folds: every catalogue page paints every card at every step value. The
five pages with a reveal were re-measured at 1440 to prove it rather than to assume it,
and every one is identical to the W24-09 figure: placi ceramice 12,669, elemente
decorative 10,141, termoizolație 6,801, sisteme iluminare 6,258, tencuieli decorative
5,250. The thirty budgets set by W24-09 stand unchanged.

#### What changed, measured at 390px with mobile emulation, on load

These are measurements, not budgets, for the reason the W24-09 block gives.

| Page | RO at 12 | RO at 9 | RU at 12 | RU at 9 |
|---|---|---|---|---|
| `/catalog/placi-ceramice/` | 10,189 | **8,696** | 10,760 | **9,182** |
| `/catalog/elemente-decorative/` | 10,306 | **8,793** | 10,552 | **9,039** |
| `/catalog/sisteme-iluminare/` | 10,383 | **8,870** | 10,450 | **8,937** |
| `/catalog/termoizolatie/` | 10,778 | **9,197** | 10,902 | **9,324** |
| `/catalog/tencuieli-decorative/` | 10,885 | **9,241** | 11,003 | **9,477** |

**The dispatch's target is met on the page it named.** `/catalog/placi-ceramice/` reads
**8,696px**, under 9,000, and it is the figure Q-W24-04 predicted from the measurement
taken before the question was opened.

**Two things that are true and less tidy, recorded because they are true.**

**The RU copy of that page is 9,182px**, over 9,000. The target names one path and that
path is the Romanian one; the Russian page carries the same nine cards and a longer
header, heading and prose, and it is 486px longer. Nothing was done about it: the owner's
answer was a card count, not a per-locale target, and shaving a locale to a number nobody
set would be inventing a requirement.

**Three pages are now LONGER than placi ceramice**, which was the longest page on the
site by a wide margin an hour ago: tencuieli decorative reads 9,241 RO against placi
ceramice's 8,696, on thirteen products against eighty-eight. **With the grid capped at
nine cards, a catalogue page's length is no longer its data.** It is the prose block, the
quote form and the footer, which are the same on every one of them and total about
4,000px. That is where the next reduction has to come from, and it is not a catalogue
change.

---

## AMENDED (W25-09, wave 25): the eighth catalogue category and its seven subcategories

**Under W24-R4**: every page created in this card takes a budget of **measured plus 60**.
Measured on the branch at 1280px, with every `[data-reveal]` given `is-revealed` and 1.8s
to settle, which is the method `docs/CLAUDE.md` section 2 records.

| Page | Measured | Budget |
|---|---|---|
| `/catalog/materiale-acoperis/` | 11,857 | **11,917** |
| `/ru/catalog/materiale-acoperis/` | 11,884 | **11,944** |
| `/catalog/materiale-acoperis/tigla-metalica/` | 2,997 | **3,057** |
| `/ru/catalog/materiale-acoperis/tigla-metalica/` | 2,997 | **3,057** |
| `/catalog/materiale-acoperis/profnastil/` | 3,494 | **3,554** |
| `/ru/catalog/materiale-acoperis/profnastil/` | 3,494 | **3,554** |
| `/catalog/materiale-acoperis/hidroizolatie/` | 5,270 | **5,330** |
| `/ru/catalog/materiale-acoperis/hidroizolatie/` | 5,270 | **5,330** |
| `/catalog/materiale-acoperis/sistem-de-scurgere/` | 4,303 | **4,363** |
| `/ru/catalog/materiale-acoperis/sistem-de-scurgere/` | 4,303 | **4,363** |
| `/catalog/materiale-acoperis/elemente-suplimentare/` | 4,963 | **5,023** |
| `/ru/catalog/materiale-acoperis/elemente-suplimentare/` | 4,963 | **5,023** |
| `/catalog/materiale-acoperis/elemente-de-siguranta/` | 2,972 | **3,032** |
| `/ru/catalog/materiale-acoperis/elemente-de-siguranta/` | 2,972 | **3,032** |
| `/catalog/materiale-acoperis/elemente-de-fixare/` | 3,457 | **3,517** |
| `/ru/catalog/materiale-acoperis/elemente-de-fixare/` | 3,457 | **3,517** |

**The parent page is the tallest thing in the catalogue**, at 11,857px, because a category
page rolls up every subcategory's products and this one has 71. That is the third standing
exception in `docs/CLAUDE.md` section 2, already recorded at W24-R4: a catalogue grid's
length is data, and no cap can be met by it.

### Two existing pages, one of which did not move

| Page | Before | After | Budget |
|---|---|---|---|
| `/servicii/tigla-metalica/` | 3,940 | 3,979 | 4,000 to **4,039** |
| `/ru/servicii/tigla-metalica/` | 3,973 | 4,012 | 4,033 to **4,072** |
| `/servicii/acoperisuri/` | 7,499 | 7,499 | **7,658, unchanged** |
| `/ru/servicii/acoperisuri/` | 7,637 | 7,637 | **7,796, unchanged** |

Both pages gained the same link to the new category. **The tile page grew by 39px and the
roofing hub did not grow at all**, because the hub's section already had bottom padding the
link fits inside. The "before" column is a control: the same build with the two link
insertions removed, measured the same way in the same run. A budget was raised only where a
measurement said to raise it.

---

## AMENDED (W25-11, wave 25): the fence models page gets prices, and its budget falls

| Page | Before | After | Budget |
|---|---|---|---|
| `/servicii/modele-garduri/` | 3,720 | **3,686** | 3,780 to **3,746** |
| `/ru/servicii/modele-garduri/` | 3,742 | **3,707** | 3,802 to **3,767** |

The "Preț la cerere" line on each of the eight model cards became a "De la ... lei/m²"
price. **The page got 34px shorter**, because the new line is `.nvk__price` and does not
carry the 44px flex min-height that `.prod__price` and `.prod__ask` share on a catalogue
card, where a price sits beside a 44px button.

**The budget falls with the measurement.** R-Y's own rule is that removing an element's
cost drops the budget by that cost; a budget left high is a ceiling to hide under, not a
measurement.

---

## AMENDED (W25-19, wave 25): the roofing catalogue moves onto the acoperisuri hub

**Ruling W25-R18:** *"Height budget for /servicii/acoperisuri/ is re-measured plus 60 after
the merge and recorded with the reason."*

| Page | Before | After | Budget |
|---|---|---|---|
| `/servicii/acoperisuri/` | 7,598 | **16,904** | 7,658 to **16,964** |
| `/ru/servicii/acoperisuri/` | 7,736 | **17,064** | 7,796 to **17,124** |

**The reason, stated because the figure is otherwise unexplainable.** The page gained the
whole roofing catalogue: a filter bar and **75 product cards**, the 71 roofing records plus
the four metal tile models. At 1440 that is a four-column grid nineteen rows deep. The
eight `/catalog/materiale-acoperis/*` pages that used to carry those cards, whose budgets
ran from 3,032 to 11,917, are redirect pages now and carry nothing.

**It is a measurement, not a ceiling.** Measured at 1440 with every `[data-reveal]` applied
and settled for 1,600ms, which is section 2's own recipe and the one
`scripts/verify-live.js` runs, plus the 60px headroom term every row in this ruling uses
(W24-R4).

**The 1,400px section cap does not bite and never did here.** A catalogue product grid has
been outside it since W24-04: `/catalog/placi-ceramice/` renders 88 cards in one section.
What the cap governs is a section of prose or chrome, and this is the same grid that was
already exempt, on a different page.

**Sixteen budgets leave this ruling with the pages they measured.** The `cat RO acop`,
`cat RU acop` and fourteen `sub` rows are gone from `scripts/verify-live.js`: a redirect
page's refresh fires before anything settles, so measuring one reports the height of the
page it forwards to. What replaces them is an assertion that each of the sixteen URLs still
answers 200 and that its refresh, its canonical and its visible link agree on one
destination.

**W25-R18 requires this to be re-measured on the deployed sha after the merge.** The
figures above are the local build measured with the deployed recipe; if the live page
differs, this block is corrected there and the correction says so.

---

## AMENDED (W25-23, wave 25): the Acoperisuri card leaves the homepage product strip

| Page | Before | After | Budget |
|---|---|---|---|
| `/` | 9,135 | **9,081** | 9,195 to **9,141** |
| `/ru/` | 9,376 | **9,294** | 9,436 to **9,354** |

**The reason, and it is not the card's own height.** The strip is one grid row, so removing
one of three cards does not remove a row. What changed is the COLUMN WIDTH: two cards across
the same container are wider than three, each line of the teaser text holds more words, and
the tallest card in the row loses a line. RO drops 54px and RU 82px, and RU drops more
because Russian sets longer.

**The budget falls with the measurement**, which is this ruling's standing rule: removing an
element's cost drops the budget by that cost, and a budget left high is a ceiling to hide
under.

Measured at 1440 with every `[data-reveal]` applied and settled for 1,600ms, plus the 60px
headroom term (W24-R4). The before column is the same build with the card still in it,
measured in the same way in the same session.

## CONFIRMED (W25-23) on the deployed sha: the W25-19 acoperisuri budget

W25-R18 requires the acoperisuri figure to be re-measured on the deployed sha after the merge.
Section 12.0 on `c05ce0e589da98b1a97c660537882388feff7a0e` read
**`svc RO acoper 16904px / 16964 inside`** and **`svc RU acoper 17064px / 17124 inside`**.

**The live page measures exactly what the local build did**, 16,904 and 17,064, so the
budgets set at W25-19 stand unchanged and no correction is owed. The requirement is
discharged, and it is recorded here rather than only in a card because that is where the
figure lives.

---

## AMENDED (W25-25, wave 25): the fence model cards state which colours, not how many

| Page | Before | After | Budget |
|---|---|---|---|
| `/servicii/modele-garduri/` | 3,686 | **3,820** | 3,746 to **3,880** |
| `/ru/servicii/modele-garduri/` | 3,707 | **3,842** | 3,767 to **3,902** |

**The reason.** Each of the eight cards read `Culori 3`. It now reads
`Culori 3: Antracit (RAL 7016), Maro Wenge (RAL 8019), Negru profund (RAL 9005)`, which on a
four-column card is one definition line becoming three or four wrapped ones. RO grows 134px
and RU 135px, and the grid is one row of four, so the tallest card sets both rows.

**The budget rises with the measurement**, which is this ruling's standing rule in the
direction it is less often used: it fell at W25-11 when a line got shorter and it rises here
because a line got longer. What it may never do is stay where it was while the page moves.

**The RAL codes are part of the cost and are kept on purpose.** They are the source's own,
they are language-neutral, and `imperlux.md` publishes no Russian page, so the code is the
only part of a colour name here that is not authored in this repo.

Measured at 1440 with every `[data-reveal]` applied and settled for 1,600ms, plus 60 (W24-R4).

---

## AMENDED (W25-26, wave 25): the tile models leave the roofing section for their own page

| Page | Before | After | Budget |
|---|---|---|---|
| `/servicii/acoperisuri/` | 16,904 | **16,470** | 16,964 to **16,530** |
| `/ru/servicii/acoperisuri/` | 17,064 | **16,608** | 17,124 to **16,668** |
| `/servicii/tigla-metalica/` | 3,979 | **4,223** | 4,039 to **4,283** |
| `/ru/servicii/tigla-metalica/` | 4,010 | **4,256** | 4,072 to **4,316** |

**Two budgets fall and two rise, for one change.** Ruling W25-R21 leaves one card per model
name in the Tigla metalică group, so the four cards built from `content/tigla-metalica.json`
left the roofing section: 75 cards became 71, and a four-column grid loses a row. The four
`ACTM-` slots those cards carried moved to `/servicii/tigla-metalica/`, where the same four
models are published, and each model card gained a square picture it did not have.

**The roofing page loses more than the tile page gains**, 434px against 244px, because a card
in a four-column grid of 71 costs a nineteenth of a row while a picture on a tile card costs
its own height on a page of four.

Measured at 1440 with every `[data-reveal]` applied and settled for 1,600ms, plus 60 (W24-R4).

---

## AMENDED (W26-03, wave 26): a budget that stayed still while its page moved

| Page | Budget held | Measured today | Budget now |
|---|---|---|---|
| `/servicii/garduri/` | 5,728 | **5,547** | **5,607** |
| `/ru/servicii/garduri/` | 5,750 | **5,569** | **5,629** |

**This is not W26-03's change.** W26-03 repoints one tile on this page and fills no slot on
it, and the page measures the same before and after, to the pixel. The drift was found while
taking that before reading.

**W24-08 measured 5,668 and 5,690 on 2026-09-20** and set the budgets at measured plus 60. The
page reads **121px shorter** today in both locales, and no block between then and now records
it. Some card in wave 25 shortened `/servicii/garduri/` and left the budget where it was.

**R-Y's own words are the reason this is repaired rather than noted**: *"What it may never do
is stay still while the page moves."* A budget 181px above the page is not a budget; it is
181px of unexamined room for the next change to hide in, which is the failure the ruling
exists to stop, running in the direction nobody watches. W25-11 lowered a budget for the same
reason and that is the precedent.

**The number is measured three ways and they agree**: locally on this branch, locally on the
branch this one is stacked on, and on the deployed site by `verify-live.js` against
`18b98cec9bb2b729785c9f2e8bf548df130f53f6`, which read `garduri RO 5547px / 5728 inside` and
`garduri RU 5569px / 5750 inside`. A single local reading would not have been enough to move a
budget on.

**What it does NOT do is find the card that shrank it.** That is a bisection over wave 25 and
it is not this card's work; what matters for the gate is that the budget now follows the page.

Measured at 1440 with every `[data-reveal]` applied and settled for 1,600ms, plus 60 (W24-R4).

---

## AMENDED (W26-04, wave 26): the roofing restructure

| Page | Before | After | Budget |
|---|---|---|---|
| `/servicii/acoperisuri/` | 16,470 | **18,015** | 16,530 to **18,075** |
| `/ru/servicii/acoperisuri/` | 16,608 | **18,221** | 16,668 to **18,281** |

**+1,545px in RO and +1,613px in RU, and the two parts of it are separable.** Ruling W26-R5
adds a **second four-tile bento** above the product section, which is the same component as
the hub and therefore the same 504px plus its heading and margins, and it adds **seven cards**
to a four-column grid, which is two more rows.

**Seven cards, not twenty.** The ruling puts twenty imperlux.md models first and folds thirteen
dasterum records into eleven of them as grades: 71 - 13 + 20 = 78. A merge that had added all
twenty as new cards would have cost five rows instead of two.

**RU is 68px taller than RO for the same reason it always is**: the Russian labels on the new
filter buttons and the new bento wrap one line sooner.

Measured at 1440 with every `[data-reveal]` applied and settled for 1,600ms, plus 60 (W24-R4).

---

## AMENDED (W26-05, wave 26): the Compară modelele tables

| Page | Before | After | Budget |
|---|---|---|---|
| `/servicii/acoperisuri/` | 18,015 | **19,458** | 18,075 to **19,518** |
| `/ru/servicii/acoperisuri/` | 18,221 | **19,644** | 18,281 to **19,704** |
| `/servicii/modele-garduri/` | 3,820 | **4,309** | 3,880 to **4,369** |
| `/ru/servicii/modele-garduri/` | 3,842 | **4,331** | 3,902 to **4,391** |

**+1,443px on the roofing page for three tables of 4, 2 and 18 rows**, and the eighteen-row
one is most of it: a table row is about 45px and the rainwater section has eighteen.

**+489px on the fence page for one table of 8 rows.** More than 8 x 45 because the colour
cells wrap: a Metal Plus row names three colours with their RAL codes and takes two lines at
1440.

**Both pages carry every table at once as they load**, which is the state a visitor lands on
and therefore the state a budget is measured in. Pressing a filter on the roofing page hides
two of the three, so the page only ever gets shorter from here.

Measured at 1440 with every `[data-reveal]` applied and settled for 1,600ms, plus 60 (W24-R4).

## AMENDED (W26-06, wave 26): Plăci flexibile gets text that describes it

| Page | Before | After | Budget |
|---|---|---|---|
| `/catalog/placi-ceramice/` | 12,669 | **12,723** | 12,729 to **12,783** |
| `/ru/catalog/placi-ceramice/` | 13,552 | **13,661** | 13,612 to **13,721** |
| `/catalog/`, `/ru/catalog/` | 3,623 / 3,648 | **3,623 / 3,648** | unchanged, 3,683 / 3,708 |

**The category was renamed (W26-R7) and its lede and two paragraphs were rewritten**, because
they described fired, glazed floor tile, porcelain stoneware and wall faience, which is not what
the 88 records are. The new text describes flexible stone and clay sheets. **+54px RO, +109px
RU**: the Russian text is the longer of the two by about a line per paragraph.

**The index did not move**: seven tiles fill the same three rows of three that eight did, and the
row that lost a tile is the last.

Measured at 1440 with every `[data-reveal]` applied and settled for 1,600ms, plus 60 (W24-R4).

## AMENDED (W26-12, wave 26): the galleries

| Page | Before | After | Budget |
|---|---|---|---|
| `/servicii/copertine/` | 6,555 | **7,184** | 6,615 to **7,244** |
| `/ru/servicii/copertine/` | 6,631 | **7,260** | 6,691 to **7,320** |
| `/servicii/galerie-garduri/` | new | **3,967** | **4,027** |
| `/ru/servicii/galerie-garduri/` | new | **3,967** | **4,027** |

**Copertine +629 in both locales**: it has no project section, so its gallery card sits in a
section of its own, which is a section's padding, a heading and one card. **Every service page is
identical to the pixel**: the gallery card is one more card in a grid that already had room in
its last row (5, 4, 4 and 2 described projects before it).

Measured at 1440 with every `[data-reveal]` applied and settled for 1,600ms, plus 60 (W24-R4).

## AMENDED (W26-13, wave 26): punctuation only

**Two em dashes in the W24-10 block above were replaced by a pair of parentheses** around the
same aside ("header, hero, prose block, offer button, quote form and footer"), under W26-R15,
which bans the dash in every authored file and names rulings among them. No word, figure or budget
changed. The sentence was repunctuated rather than struck because a struck dash is still a dash in
the file; this block records the change where it was made (R-T).

## AMENDED (W26-14, wave 26): the design pass

W26-R16: "budgets re-measured plus 60 with reasons". **All 53 budgeted pages were measured before
and after at 1440**, settled, with every `[data-reveal]` applied. **49 are identical to the pixel
and none grew.** Four shrank, and three sat on the shared 6,000px service budget; all seven take
measured plus 60:

| Page | Before | After | Budget |
|---|---|---|---|
| `/servicii/case-la-cheie/` | 6,376 | **6,351** | 6,436 to **6,411** |
| `/servicii/acoperisuri/` | 19,458 | **19,436** | 19,518 to **19,496** |
| `/ru/servicii/acoperisuri/` | 19,644 | **19,622** | 19,704 to **19,682** |
| `/ru/catalog/tencuieli-decorative/` | 5,356 | **5,326** | 5,416 to **5,386** |
| `/servicii/fatade/` | 5,284 | **5,284** | shared 6,000 to **5,344** |
| `/ru/servicii/fatade/` | 5,491 | **5,491** | shared 6,000 to **5,551** |
| `/ru/servicii/finisaje/` | 5,411 | **5,411** | shared 6,000 to **5,471** |

**Why they shrank**: headings are tracked at -0.01em, which was 0 on `h3` and on five component
titles, so a few card titles that wrapped to three lines now fit on two. **Why nothing grew**: the
spec's desktop section spacing, 96px, is what `--section-pad` already was, and the radius, border,
shadow and colour changes move no box. **The three service pages** had 500 to 700px of headroom
under a budget shared with pages they no longer resemble, which is a ceiling to hide under. The
other 46 budgets were already their page's measurement plus 60 and stand.

**On a phone the pages are taller**, because the spec's 64px replaces 56px of section padding:
homepage +88, roofing +128, turnkey +58, catalogue +72 at 390 (RO). Phone heights carry no budget.

## AMENDED (W27-C-02, wave 27): Tablă cutată, a ninth roofing tile and a fourth table

W27-R-06 makes Tablă cutată its own group. The roofing page gains a third row in the product
bento (244px plus the 16px gap), a seventh filter chip and a fourth Compară table. Measured at
1440 with every `[data-reveal]` applied and settled for 1,600ms, on the same instrument that
reproduces the W26-14 figures above to the pixel (19,436 and 19,622 re-read before measuring):

| Page | Before | After | Budget |
|---|---|---|---|
| `/servicii/acoperisuri/` | 19,436 | **20,180** | 19,496 to **20,240** |
| `/ru/servicii/acoperisuri/` | 19,622 | **20,318** | 19,682 to **20,378** |

Plus 60 (W24-R4). No other page moved: the seven records changed group, not page, and the
profnastil redirect page is the same size with a different anchor.

## AMENDED (W27-C-03, wave 27): the seven imperlux metal tile models

W27-R-04 and W27-R-05: seven model cards first in the Țiglă metalică section, each taller than a
catalogue card by a tagline, a chip row and a facts line, and a derived "de la" line under each
Compară heading. Same instrument, same method as the W27-C-02 block above:

| Page | Before | After | Budget |
|---|---|---|---|
| `/servicii/acoperisuri/` | 20,180 | **21,643** | 20,240 to **21,703** |
| `/ru/servicii/acoperisuri/` | 20,318 | **21,802** | 20,378 to **21,862** |

Plus 60 (W24-R4). No other page moved.

## AMENDED (W27-C-04, wave 27): the Novatik page takes Imperlux's prices, chips and pictures

W27-R-04 and W27-R-05 on `/servicii/roca-vulcanica/`: each card gains three colour chips, a
warranty row and a price line in place of "Preț la cerere", and a derived "4 modele, de la 207.06
lei/buc" line sits under the heading. Same instrument and method as the blocks above:

| Page | Before | After | Budget |
|---|---|---|---|
| `/servicii/roca-vulcanica/` | 4,288 | **4,369** | 4,348 to **4,429** |
| `/ru/servicii/roca-vulcanica/` | 4,386 | **4,439** | 4,446 to **4,499** |

Plus 60 (W24-R4). "Before" is the budget less 60, the way the budget was set.

## AMENDED (W27-C-05, wave 27): the two shingle cards

W27-R-04: IKO Cambridge and IKO Superglass Hex gain a tagline, colour code chips and a facts line.

| Page | Before | After | Budget |
|---|---|---|---|
| `/servicii/acoperisuri/` | 21,643 | **21,725** | 21,703 to **21,785** |
| `/ru/servicii/acoperisuri/` | 21,802 | **21,883** | 21,862 to **21,943** |

Plus 60 (W24-R4). Same instrument as the blocks above.

## AMENDED (W27-C-06, wave 27): the mirror sweep

W27-R-04: twenty Imperlux accessories join the Accesorii section (five more grid rows), the eleven
rainwater parts and the ceramic tile take Imperlux's pictures and taglines. Same instrument and method:

| Page | Before | After | Budget |
|---|---|---|---|
| `/servicii/acoperisuri/` | 21,725 | **24,172** | 21,785 to **24,232** |
| `/ru/servicii/acoperisuri/` | 21,883 | **24,393** | 21,943 to **24,453** |

Plus 60 (W24-R4). The section cap of 1,400px (`docs/CLAUDE.md` section 2) does not hold the
catalogue grid, the third standing exception (W24-R4).

## AMENDED (W28-04, wave 27): headings at 64 and 48, every budget re-measured

W28-04 (under W27-R-07) sets h1 to 64px and h2 to 48px in sentence case. Every page grows by a few
lines of heading, so **all 53 budgeted pages were re-measured at 1440**, settled, with every
`[data-reveal]` applied, on the instrument the W27-C-02 block describes, and every budget is its
page's measurement plus 60 (W24-R4). The table is generated from the measurement, not typed:

| Page | Before (budget minus 60) | After | Budget |
|---|---|---|---|
| `/` | 9,081 | **9,186** | 9,141 to **9,246** |
| `/ru/` | 9,294 | **9,400** | 9,354 to **9,460** |
| `/in-constructie/` | 1,122 | **1,136** | 1,182 to **1,196** |
| `/ru/in-constructie/` | 1,122 | **1,136** | 1,182 to **1,196** |
| `/servicii/case-la-cheie/` | 6,351 | **6,447** | 6,411 to **6,507** |
| `/servicii/fatade/` | 5,284 | **5,343** | 5,344 to **5,403** |
| `/ru/servicii/case-la-cheie/` | 6,483 | **6,579** | 6,543 to **6,639** |
| `/ru/servicii/fatade/` | 5,491 | **5,558** | 5,551 to **5,618** |
| `/servicii/acoperisuri/` | 24,172 | **24,261** | 24,232 to **24,321** |
| `/ru/servicii/acoperisuri/` | 24,393 | **24,482** | 24,453 to **24,542** |
| `/servicii/roca-vulcanica/` | 4,369 | **4,431** | 4,429 to **4,491** |
| `/ru/servicii/roca-vulcanica/` | 4,439 | **4,502** | 4,499 to **4,562** |
| `/ru/servicii/finisaje/` | 5,411 | **5,478** | 5,471 to **5,538** |
| `/servicii/tigla-metalica/` | 4,223 | **4,373** | 4,283 to **4,433** |
| `/ru/servicii/tigla-metalica/` | 4,256 | **4,428** | 4,316 to **4,488** |
| `/servicii/copertine/` | 7,184 | **7,298** | 7,244 to **7,358** |
| `/ru/servicii/copertine/` | 7,260 | **7,374** | 7,320 to **7,434** |
| `/servicii/garduri/` | 5,547 | **5,633** | 5,607 to **5,693** |
| `/ru/servicii/garduri/` | 5,569 | **5,655** | 5,629 to **5,715** |
| `/servicii/modele-garduri/` | 4,309 | **4,355** | 4,369 to **4,415** |
| `/ru/servicii/modele-garduri/` | 4,331 | **4,377** | 4,391 to **4,437** |
| `/servicii/galerie-garduri/` | 3,967 | **4,004** | 4,027 to **4,064** |
| `/ru/servicii/galerie-garduri/` | 3,967 | **4,004** | 4,027 to **4,064** |
| `/catalog/` | 3,623 | **3,660** | 3,683 to **3,720** |
| `/ru/catalog/` | 3,648 | **3,685** | 3,708 to **3,745** |
| `/catalog/termoizolatie/` | 6,801 | **6,843** | 6,861 to **6,903** |
| `/ru/catalog/termoizolatie/` | 6,718 | **6,758** | 6,778 to **6,818** |
| `/catalog/termoizolatie/polistiren-expandat/` | 3,547 | **3,586** | 3,607 to **3,646** |
| `/ru/catalog/termoizolatie/polistiren-expandat/` | 3,464 | **3,503** | 3,524 to **3,563** |
| `/catalog/termoizolatie/polistiren-extrudat/` | 3,024 | **3,062** | 3,084 to **3,122** |
| `/ru/catalog/termoizolatie/polistiren-extrudat/` | 3,068 | **3,042** | 3,128 to **3,102** |
| `/catalog/termoizolatie/vata-minerala/` | 3,504 | **3,544** | 3,564 to **3,604** |
| `/ru/catalog/termoizolatie/vata-minerala/` | 3,506 | **3,546** | 3,566 to **3,606** |
| `/catalog/termoizolatie/adezivi-si-mase-de-spaclu/` | 4,021 | **4,061** | 4,081 to **4,121** |
| `/ru/catalog/termoizolatie/adezivi-si-mase-de-spaclu/` | 3,944 | **3,984** | 4,004 to **4,044** |
| `/catalog/termoizolatie/alte-produse/` | 2,997 | **3,034** | 3,057 to **3,094** |
| `/ru/catalog/termoizolatie/alte-produse/` | 2,956 | **2,993** | 3,016 to **3,053** |
| `/catalog/tencuieli-decorative/` | 5,250 | **5,290** | 5,310 to **5,350** |
| `/ru/catalog/tencuieli-decorative/` | 5,326 | **5,367** | 5,386 to **5,427** |
| `/catalog/placi-ceramice/` | 12,723 | **12,786** | 12,783 to **12,846** |
| `/ru/catalog/placi-ceramice/` | 13,661 | **13,724** | 13,721 to **13,784** |
| `/catalog/elemente-decorative/` | 10,141 | **10,177** | 10,201 to **10,237** |
| `/ru/catalog/elemente-decorative/` | 10,576 | **10,612** | 10,636 to **10,672** |
| `/catalog/vopsele/` | 4,244 | **4,283** | 4,304 to **4,343** |
| `/ru/catalog/vopsele/` | 4,339 | **4,378** | 4,399 to **4,438** |
| `/catalog/vopsele/vopsele-de-exterior/` | 3,004 | **3,042** | 3,064 to **3,102** |
| `/ru/catalog/vopsele/vopsele-de-exterior/` | 3,026 | **3,064** | 3,086 to **3,124** |
| `/catalog/vopsele/vopsele-de-interior/` | 3,026 | **3,064** | 3,086 to **3,124** |
| `/ru/catalog/vopsele/vopsele-de-interior/` | 3,072 | **3,110** | 3,132 to **3,170** |
| `/catalog/sisteme-iluminare/` | 6,258 | **6,295** | 6,318 to **6,355** |
| `/ru/catalog/sisteme-iluminare/` | 6,202 | **6,238** | 6,262 to **6,298** |
| `/catalog/alte-materiale/` | 3,647 | **3,683** | 3,707 to **3,743** |
| `/ru/catalog/alte-materiale/` | 3,647 | **3,683** | 3,707 to **3,743** |
## AMENDED (W27-FIX-01, wave 27): the 14px floor, and a section 12.0 failure on `ff8a922`

**Section 12.0 on `ff8a922` (#143, W28-01) FAILED: exit 1, 0 unverified, 2 failed.** Every marker
verified; `/servicii/tigla-metalica/` read **4,347 against 4,283** and its RU twin **4,402 against
4,316**, OVER by 64 and 86px. **The cause, by measurement**: W28-01's 14px floor raised the metal
tile grid's small print (the grade, finish, colour and swatch-note lines, 12 and 13px before) and
the grid grew by two lines of it. W28-01 had measured the four main pages and the header, not this
one. So every one of the 53 budgets is re-measured on the deployed tree, settled at 1440, and set to
measured plus 60 (W24-R4), generated:

| Page | Before (budget minus 60) | After | Budget |
|---|---|---|---|
| `/` | 9,081 | **9,108** | 9,141 to **9,168** |
| `/ru/` | 9,294 | **9,322** | 9,354 to **9,382** |
| `/in-constructie/` | 1,122 | **1,127** | 1,182 to **1,187** |
| `/ru/in-constructie/` | 1,122 | **1,127** | 1,182 to **1,187** |
| `/servicii/case-la-cheie/` | 6,351 | **6,378** | 6,411 to **6,438** |
| `/servicii/fatade/` | 5,284 | **5,308** | 5,344 to **5,368** |
| `/ru/servicii/case-la-cheie/` | 6,483 | **6,510** | 6,543 to **6,570** |
| `/ru/servicii/fatade/` | 5,491 | **5,516** | 5,551 to **5,576** |
| `/servicii/acoperisuri/` | 24,172 | **24,193** | 24,232 to **24,253** |
| `/ru/servicii/acoperisuri/` | 24,393 | **24,414** | 24,453 to **24,474** |
| `/servicii/roca-vulcanica/` | 4,369 | **4,390** | 4,429 to **4,450** |
| `/ru/servicii/roca-vulcanica/` | 4,439 | **4,460** | 4,499 to **4,520** |
| `/ru/servicii/finisaje/` | 5,411 | **5,437** | 5,471 to **5,497** |
| `/servicii/tigla-metalica/` | 4,223 | **4,347** | 4,283 to **4,407** |
| `/ru/servicii/tigla-metalica/` | 4,256 | **4,402** | 4,316 to **4,462** |
| `/servicii/copertine/` | 7,184 | **7,210** | 7,244 to **7,270** |
| `/ru/servicii/copertine/` | 7,260 | **7,286** | 7,320 to **7,346** |
| `/servicii/garduri/` | 5,547 | **5,573** | 5,607 to **5,633** |
| `/ru/servicii/garduri/` | 5,569 | **5,595** | 5,629 to **5,655** |
| `/servicii/modele-garduri/` | 4,309 | **4,330** | 4,369 to **4,390** |
| `/ru/servicii/modele-garduri/` | 4,331 | **4,351** | 4,391 to **4,411** |
| `/servicii/galerie-garduri/` | 3,967 | **3,988** | 4,027 to **4,048** |
| `/ru/servicii/galerie-garduri/` | 3,967 | **3,988** | 4,027 to **4,048** |
| `/catalog/` | 3,623 | **3,644** | 3,683 to **3,704** |
| `/ru/catalog/` | 3,648 | **3,669** | 3,708 to **3,729** |
| `/catalog/termoizolatie/` | 6,801 | **6,827** | 6,861 to **6,887** |
| `/ru/catalog/termoizolatie/` | 6,718 | **6,743** | 6,778 to **6,803** |
| `/catalog/termoizolatie/polistiren-expandat/` | 3,547 | **3,569** | 3,607 to **3,629** |
| `/ru/catalog/termoizolatie/polistiren-expandat/` | 3,464 | **3,486** | 3,524 to **3,546** |
| `/catalog/termoizolatie/polistiren-extrudat/` | 3,024 | **3,046** | 3,084 to **3,106** |
| `/ru/catalog/termoizolatie/polistiren-extrudat/` | 3,068 | **3,090** | 3,128 to **3,150** |
| `/catalog/termoizolatie/vata-minerala/` | 3,504 | **3,527** | 3,564 to **3,587** |
| `/ru/catalog/termoizolatie/vata-minerala/` | 3,506 | **3,529** | 3,566 to **3,589** |
| `/catalog/termoizolatie/adezivi-si-mase-de-spaclu/` | 4,021 | **4,045** | 4,081 to **4,105** |
| `/ru/catalog/termoizolatie/adezivi-si-mase-de-spaclu/` | 3,944 | **3,967** | 4,004 to **4,027** |
| `/catalog/termoizolatie/alte-produse/` | 2,997 | **3,017** | 3,057 to **3,077** |
| `/ru/catalog/termoizolatie/alte-produse/` | 2,956 | **2,977** | 3,016 to **3,037** |
| `/catalog/tencuieli-decorative/` | 5,250 | **5,275** | 5,310 to **5,335** |
| `/ru/catalog/tencuieli-decorative/` | 5,326 | **5,352** | 5,386 to **5,412** |
| `/catalog/placi-ceramice/` | 12,723 | **12,770** | 12,783 to **12,830** |
| `/ru/catalog/placi-ceramice/` | 13,661 | **13,708** | 13,721 to **13,768** |
| `/catalog/elemente-decorative/` | 10,141 | **10,161** | 10,201 to **10,221** |
| `/ru/catalog/elemente-decorative/` | 10,576 | **10,597** | 10,636 to **10,657** |
| `/catalog/vopsele/` | 4,244 | **4,267** | 4,304 to **4,327** |
| `/ru/catalog/vopsele/` | 4,339 | **4,363** | 4,399 to **4,423** |
| `/catalog/vopsele/vopsele-de-exterior/` | 3,004 | **3,026** | 3,064 to **3,086** |
| `/ru/catalog/vopsele/vopsele-de-exterior/` | 3,026 | **3,048** | 3,086 to **3,108** |
| `/catalog/vopsele/vopsele-de-interior/` | 3,026 | **3,048** | 3,086 to **3,108** |
| `/ru/catalog/vopsele/vopsele-de-interior/` | 3,072 | **3,094** | 3,132 to **3,154** |
| `/catalog/sisteme-iluminare/` | 6,258 | **6,279** | 6,318 to **6,339** |
| `/ru/catalog/sisteme-iluminare/` | 6,202 | **6,223** | 6,262 to **6,283** |
| `/catalog/alte-materiale/` | 3,647 | **3,668** | 3,707 to **3,728** |
| `/ru/catalog/alte-materiale/` | 3,647 | **3,668** | 3,707 to **3,728** |

## AMENDED (W28-05, wave 27): 17px button labels, budgets re-measured

W28-05 sets every button label to 17px, dark on the orange. Buttons are a fixed height, so almost
nothing moves; the 53 budgets are re-measured all the same, plus 60, generated:

| Page | Before (budget minus 60) | After | Budget |
|---|---|---|---|
| `/` | 9,186 | **9,186** | 9,246 to **9,246** |
| `/ru/` | 9,400 | **9,400** | 9,460 to **9,460** |
| `/in-constructie/` | 1,136 | **1,136** | 1,196 to **1,196** |
| `/ru/in-constructie/` | 1,136 | **1,136** | 1,196 to **1,196** |
| `/servicii/case-la-cheie/` | 6,447 | **6,447** | 6,507 to **6,507** |
| `/servicii/fatade/` | 5,343 | **5,343** | 5,403 to **5,403** |
| `/ru/servicii/case-la-cheie/` | 6,579 | **6,579** | 6,639 to **6,639** |
| `/ru/servicii/fatade/` | 5,558 | **5,558** | 5,618 to **5,618** |
| `/servicii/acoperisuri/` | 24,261 | **24,261** | 24,321 to **24,321** |
| `/ru/servicii/acoperisuri/` | 24,482 | **24,482** | 24,542 to **24,542** |
| `/servicii/roca-vulcanica/` | 4,431 | **4,431** | 4,491 to **4,491** |
| `/ru/servicii/roca-vulcanica/` | 4,502 | **4,502** | 4,562 to **4,562** |
| `/ru/servicii/finisaje/` | 5,478 | **5,478** | 5,538 to **5,538** |
| `/servicii/tigla-metalica/` | 4,373 | **4,373** | 4,433 to **4,433** |
| `/ru/servicii/tigla-metalica/` | 4,428 | **4,428** | 4,488 to **4,488** |
| `/servicii/copertine/` | 7,298 | **7,298** | 7,358 to **7,358** |
| `/ru/servicii/copertine/` | 7,374 | **7,374** | 7,434 to **7,434** |
| `/servicii/garduri/` | 5,633 | **5,633** | 5,693 to **5,693** |
| `/ru/servicii/garduri/` | 5,655 | **5,655** | 5,715 to **5,715** |
| `/servicii/modele-garduri/` | 4,355 | **4,355** | 4,415 to **4,415** |
| `/ru/servicii/modele-garduri/` | 4,377 | **4,377** | 4,437 to **4,437** |
| `/servicii/galerie-garduri/` | 4,004 | **4,004** | 4,064 to **4,064** |
| `/ru/servicii/galerie-garduri/` | 4,004 | **4,004** | 4,064 to **4,064** |
| `/catalog/` | 3,660 | **3,660** | 3,720 to **3,720** |
| `/ru/catalog/` | 3,685 | **3,685** | 3,745 to **3,745** |
| `/catalog/termoizolatie/` | 6,843 | **6,843** | 6,903 to **6,903** |
| `/ru/catalog/termoizolatie/` | 6,758 | **6,758** | 6,818 to **6,818** |
| `/catalog/termoizolatie/polistiren-expandat/` | 3,586 | **3,586** | 3,646 to **3,646** |
| `/ru/catalog/termoizolatie/polistiren-expandat/` | 3,503 | **3,503** | 3,563 to **3,563** |
| `/catalog/termoizolatie/polistiren-extrudat/` | 3,062 | **3,062** | 3,122 to **3,122** |
| `/ru/catalog/termoizolatie/polistiren-extrudat/` | 3,042 | **3,042** | 3,102 to **3,102** |
| `/catalog/termoizolatie/vata-minerala/` | 3,544 | **3,544** | 3,604 to **3,604** |
| `/ru/catalog/termoizolatie/vata-minerala/` | 3,546 | **3,546** | 3,606 to **3,606** |
| `/catalog/termoizolatie/adezivi-si-mase-de-spaclu/` | 4,061 | **4,061** | 4,121 to **4,121** |
| `/ru/catalog/termoizolatie/adezivi-si-mase-de-spaclu/` | 3,984 | **3,984** | 4,044 to **4,044** |
| `/catalog/termoizolatie/alte-produse/` | 3,034 | **3,034** | 3,094 to **3,094** |
| `/ru/catalog/termoizolatie/alte-produse/` | 2,993 | **2,993** | 3,053 to **3,053** |
| `/catalog/tencuieli-decorative/` | 5,290 | **5,290** | 5,350 to **5,350** |
| `/ru/catalog/tencuieli-decorative/` | 5,367 | **5,367** | 5,427 to **5,427** |
| `/catalog/placi-ceramice/` | 12,786 | **12,786** | 12,846 to **12,846** |
| `/ru/catalog/placi-ceramice/` | 13,724 | **13,724** | 13,784 to **13,784** |
| `/catalog/elemente-decorative/` | 10,177 | **10,177** | 10,237 to **10,237** |
| `/ru/catalog/elemente-decorative/` | 10,612 | **10,612** | 10,672 to **10,672** |
| `/catalog/vopsele/` | 4,283 | **4,283** | 4,343 to **4,343** |
| `/ru/catalog/vopsele/` | 4,378 | **4,378** | 4,438 to **4,438** |
| `/catalog/vopsele/vopsele-de-exterior/` | 3,042 | **3,042** | 3,102 to **3,102** |
| `/ru/catalog/vopsele/vopsele-de-exterior/` | 3,064 | **3,064** | 3,124 to **3,124** |
| `/catalog/vopsele/vopsele-de-interior/` | 3,064 | **3,064** | 3,124 to **3,124** |
| `/ru/catalog/vopsele/vopsele-de-interior/` | 3,110 | **3,110** | 3,170 to **3,170** |
| `/catalog/sisteme-iluminare/` | 6,295 | **6,295** | 6,355 to **6,355** |
| `/ru/catalog/sisteme-iluminare/` | 6,238 | **6,238** | 6,298 to **6,298** |
| `/catalog/alte-materiale/` | 3,683 | **3,683** | 3,743 to **3,743** |
| `/ru/catalog/alte-materiale/` | 3,683 | **3,683** | 3,743 to **3,743** |

## AMENDED (W28-06, wave 27): the form fields at 56px, budgets re-measured

W28-06 makes every field 56px tall with a 16px label, on every page that carries the quote form,
and the contact aside a list. All 53 budgets re-measured plus 60, generated:

| Page | Before (budget minus 60) | After | Budget |
|---|---|---|---|
| `/` | 9,186 | **9,234** | 9,246 to **9,294** |
| `/ru/` | 9,400 | **9,448** | 9,460 to **9,508** |
| `/in-constructie/` | 1,136 | **1,136** | 1,196 to **1,196** |
| `/ru/in-constructie/` | 1,136 | **1,136** | 1,196 to **1,196** |
| `/servicii/case-la-cheie/` | 6,447 | **6,484** | 6,507 to **6,544** |
| `/servicii/fatade/` | 5,343 | **5,379** | 5,403 to **5,439** |
| `/ru/servicii/case-la-cheie/` | 6,579 | **6,616** | 6,639 to **6,676** |
| `/ru/servicii/fatade/` | 5,558 | **5,595** | 5,618 to **5,655** |
| `/servicii/acoperisuri/` | 24,261 | **24,297** | 24,321 to **24,357** |
| `/ru/servicii/acoperisuri/` | 24,482 | **24,518** | 24,542 to **24,578** |
| `/servicii/roca-vulcanica/` | 4,431 | **4,441** | 4,491 to **4,501** |
| `/ru/servicii/roca-vulcanica/` | 4,502 | **4,512** | 4,562 to **4,572** |
| `/ru/servicii/finisaje/` | 5,478 | **5,515** | 5,538 to **5,575** |
| `/servicii/tigla-metalica/` | 4,373 | **4,410** | 4,433 to **4,470** |
| `/ru/servicii/tigla-metalica/` | 4,428 | **4,464** | 4,488 to **4,524** |
| `/servicii/copertine/` | 7,298 | **7,334** | 7,358 to **7,394** |
| `/ru/servicii/copertine/` | 7,374 | **7,411** | 7,434 to **7,471** |
| `/servicii/garduri/` | 5,633 | **5,670** | 5,693 to **5,730** |
| `/ru/servicii/garduri/` | 5,655 | **5,692** | 5,715 to **5,752** |
| `/servicii/modele-garduri/` | 4,355 | **4,392** | 4,415 to **4,452** |
| `/ru/servicii/modele-garduri/` | 4,377 | **4,414** | 4,437 to **4,474** |
| `/servicii/galerie-garduri/` | 4,004 | **4,041** | 4,064 to **4,101** |
| `/ru/servicii/galerie-garduri/` | 4,004 | **4,041** | 4,064 to **4,101** |
| `/catalog/` | 3,660 | **3,697** | 3,720 to **3,757** |
| `/ru/catalog/` | 3,685 | **3,722** | 3,745 to **3,782** |
| `/catalog/termoizolatie/` | 6,843 | **6,879** | 6,903 to **6,939** |
| `/ru/catalog/termoizolatie/` | 6,758 | **6,795** | 6,818 to **6,855** |
| `/catalog/termoizolatie/polistiren-expandat/` | 3,586 | **3,622** | 3,646 to **3,682** |
| `/ru/catalog/termoizolatie/polistiren-expandat/` | 3,503 | **3,539** | 3,563 to **3,599** |
| `/catalog/termoizolatie/polistiren-extrudat/` | 3,062 | **3,099** | 3,122 to **3,159** |
| `/ru/catalog/termoizolatie/polistiren-extrudat/` | 3,042 | **3,079** | 3,102 to **3,139** |
| `/catalog/termoizolatie/vata-minerala/` | 3,544 | **3,581** | 3,604 to **3,641** |
| `/ru/catalog/termoizolatie/vata-minerala/` | 3,546 | **3,582** | 3,606 to **3,642** |
| `/catalog/termoizolatie/adezivi-si-mase-de-spaclu/` | 4,061 | **4,098** | 4,121 to **4,158** |
| `/ru/catalog/termoizolatie/adezivi-si-mase-de-spaclu/` | 3,984 | **4,020** | 4,044 to **4,080** |
| `/catalog/termoizolatie/alte-produse/` | 3,034 | **3,071** | 3,094 to **3,131** |
| `/ru/catalog/termoizolatie/alte-produse/` | 2,993 | **3,030** | 3,053 to **3,090** |
| `/catalog/tencuieli-decorative/` | 5,290 | **5,327** | 5,350 to **5,387** |
| `/ru/catalog/tencuieli-decorative/` | 5,367 | **5,404** | 5,427 to **5,464** |
| `/catalog/placi-ceramice/` | 12,786 | **12,822** | 12,846 to **12,882** |
| `/ru/catalog/placi-ceramice/` | 13,724 | **13,761** | 13,784 to **13,821** |
| `/catalog/elemente-decorative/` | 10,177 | **10,214** | 10,237 to **10,274** |
| `/ru/catalog/elemente-decorative/` | 10,612 | **10,649** | 10,672 to **10,709** |
| `/catalog/vopsele/` | 4,283 | **4,319** | 4,343 to **4,379** |
| `/ru/catalog/vopsele/` | 4,378 | **4,415** | 4,438 to **4,475** |
| `/catalog/vopsele/vopsele-de-exterior/` | 3,042 | **3,079** | 3,102 to **3,139** |
| `/ru/catalog/vopsele/vopsele-de-exterior/` | 3,064 | **3,101** | 3,124 to **3,161** |
| `/catalog/vopsele/vopsele-de-interior/` | 3,064 | **3,101** | 3,124 to **3,161** |
| `/ru/catalog/vopsele/vopsele-de-interior/` | 3,110 | **3,147** | 3,170 to **3,207** |
| `/catalog/sisteme-iluminare/` | 6,295 | **6,331** | 6,355 to **6,391** |
| `/ru/catalog/sisteme-iluminare/` | 6,238 | **6,275** | 6,298 to **6,335** |
| `/catalog/alte-materiale/` | 3,683 | **3,720** | 3,743 to **3,780** |
| `/ru/catalog/alte-materiale/` | 3,683 | **3,720** | 3,743 to **3,780** |

## AMENDED (W28-07, wave 27): the stats band as four cards, budgets re-measured

W28-07 gives the band's four stats a card each with 24px of padding, so the two homepages grow by
a card's padding. All 53 budgets re-measured plus 60, generated:

| Page | Before (budget minus 60) | After | Budget |
|---|---|---|---|
| `/` | 9,234 | **9,282** | 9,294 to **9,342** |
| `/ru/` | 9,448 | **9,523** | 9,508 to **9,583** |
| `/in-constructie/` | 1,136 | **1,136** | 1,196 to **1,196** |
| `/ru/in-constructie/` | 1,136 | **1,136** | 1,196 to **1,196** |
| `/servicii/case-la-cheie/` | 6,484 | **6,484** | 6,544 to **6,544** |
| `/servicii/fatade/` | 5,379 | **5,379** | 5,439 to **5,439** |
| `/ru/servicii/case-la-cheie/` | 6,616 | **6,616** | 6,676 to **6,676** |
| `/ru/servicii/fatade/` | 5,595 | **5,595** | 5,655 to **5,655** |
| `/servicii/acoperisuri/` | 24,297 | **24,297** | 24,357 to **24,357** |
| `/ru/servicii/acoperisuri/` | 24,518 | **24,518** | 24,578 to **24,578** |
| `/servicii/roca-vulcanica/` | 4,441 | **4,468** | 4,501 to **4,528** |
| `/ru/servicii/roca-vulcanica/` | 4,512 | **4,539** | 4,572 to **4,599** |
| `/ru/servicii/finisaje/` | 5,515 | **5,515** | 5,575 to **5,575** |
| `/servicii/tigla-metalica/` | 4,410 | **4,410** | 4,470 to **4,470** |
| `/ru/servicii/tigla-metalica/` | 4,464 | **4,464** | 4,524 to **4,524** |
| `/servicii/copertine/` | 7,334 | **7,334** | 7,394 to **7,394** |
| `/ru/servicii/copertine/` | 7,411 | **7,411** | 7,471 to **7,471** |
| `/servicii/garduri/` | 5,670 | **5,670** | 5,730 to **5,730** |
| `/ru/servicii/garduri/` | 5,692 | **5,692** | 5,752 to **5,752** |
| `/servicii/modele-garduri/` | 4,392 | **4,392** | 4,452 to **4,452** |
| `/ru/servicii/modele-garduri/` | 4,414 | **4,414** | 4,474 to **4,474** |
| `/servicii/galerie-garduri/` | 4,041 | **4,041** | 4,101 to **4,101** |
| `/ru/servicii/galerie-garduri/` | 4,041 | **4,041** | 4,101 to **4,101** |
| `/catalog/` | 3,697 | **3,697** | 3,757 to **3,757** |
| `/ru/catalog/` | 3,722 | **3,722** | 3,782 to **3,782** |
| `/catalog/termoizolatie/` | 6,879 | **6,879** | 6,939 to **6,939** |
| `/ru/catalog/termoizolatie/` | 6,795 | **6,795** | 6,855 to **6,855** |
| `/catalog/termoizolatie/polistiren-expandat/` | 3,622 | **3,622** | 3,682 to **3,682** |
| `/ru/catalog/termoizolatie/polistiren-expandat/` | 3,539 | **3,539** | 3,599 to **3,599** |
| `/catalog/termoizolatie/polistiren-extrudat/` | 3,099 | **3,099** | 3,159 to **3,159** |
| `/ru/catalog/termoizolatie/polistiren-extrudat/` | 3,079 | **3,079** | 3,139 to **3,139** |
| `/catalog/termoizolatie/vata-minerala/` | 3,581 | **3,581** | 3,641 to **3,641** |
| `/ru/catalog/termoizolatie/vata-minerala/` | 3,582 | **3,582** | 3,642 to **3,642** |
| `/catalog/termoizolatie/adezivi-si-mase-de-spaclu/` | 4,098 | **4,098** | 4,158 to **4,158** |
| `/ru/catalog/termoizolatie/adezivi-si-mase-de-spaclu/` | 4,020 | **4,020** | 4,080 to **4,080** |
| `/catalog/termoizolatie/alte-produse/` | 3,071 | **3,071** | 3,131 to **3,131** |
| `/ru/catalog/termoizolatie/alte-produse/` | 3,030 | **3,030** | 3,090 to **3,090** |
| `/catalog/tencuieli-decorative/` | 5,327 | **5,327** | 5,387 to **5,387** |
| `/ru/catalog/tencuieli-decorative/` | 5,404 | **5,404** | 5,464 to **5,464** |
| `/catalog/placi-ceramice/` | 12,822 | **12,822** | 12,882 to **12,882** |
| `/ru/catalog/placi-ceramice/` | 13,761 | **13,761** | 13,821 to **13,821** |
| `/catalog/elemente-decorative/` | 10,214 | **10,214** | 10,274 to **10,274** |
| `/ru/catalog/elemente-decorative/` | 10,649 | **10,649** | 10,709 to **10,709** |
| `/catalog/vopsele/` | 4,319 | **4,319** | 4,379 to **4,379** |
| `/ru/catalog/vopsele/` | 4,415 | **4,415** | 4,475 to **4,475** |
| `/catalog/vopsele/vopsele-de-exterior/` | 3,079 | **3,079** | 3,139 to **3,139** |
| `/ru/catalog/vopsele/vopsele-de-exterior/` | 3,101 | **3,101** | 3,161 to **3,161** |
| `/catalog/vopsele/vopsele-de-interior/` | 3,101 | **3,101** | 3,161 to **3,161** |
| `/ru/catalog/vopsele/vopsele-de-interior/` | 3,147 | **3,147** | 3,207 to **3,207** |
| `/catalog/sisteme-iluminare/` | 6,331 | **6,331** | 6,391 to **6,391** |
| `/ru/catalog/sisteme-iluminare/` | 6,275 | **6,275** | 6,335 to **6,335** |
| `/catalog/alte-materiale/` | 3,720 | **3,720** | 3,780 to **3,780** |
| `/ru/catalog/alte-materiale/` | 3,720 | **3,720** | 3,780 to **3,780** |

## AMENDED (W28-08, wave 27): product cards, bento labels, footer, tables; budgets re-measured

W28-08 pads every table cell to 16x24 and sets the bento labels at 32px, so the roofing page and
the pages with a specification table grow. All 53 budgets re-measured plus 60, generated:

| Page | Before (budget minus 60) | After | Budget |
|---|---|---|---|
| `/` | 9,282 | **9,290** | 9,342 to **9,350** |
| `/ru/` | 9,523 | **9,531** | 9,583 to **9,591** |
| `/in-constructie/` | 1,136 | **1,145** | 1,196 to **1,205** |
| `/ru/in-constructie/` | 1,136 | **1,145** | 1,196 to **1,205** |
| `/servicii/case-la-cheie/` | 6,484 | **6,523** | 6,544 to **6,583** |
| `/servicii/fatade/` | 5,379 | **5,412** | 5,439 to **5,472** |
| `/ru/servicii/case-la-cheie/` | 6,616 | **6,655** | 6,676 to **6,715** |
| `/ru/servicii/fatade/` | 5,595 | **5,628** | 5,655 to **5,688** |
| `/servicii/acoperisuri/` | 24,297 | **24,750** | 24,357 to **24,810** |
| `/ru/servicii/acoperisuri/` | 24,518 | **24,971** | 24,578 to **25,031** |
| `/servicii/roca-vulcanica/` | 4,468 | **4,507** | 4,528 to **4,567** |
| `/ru/servicii/roca-vulcanica/` | 4,539 | **4,551** | 4,599 to **4,611** |
| `/ru/servicii/finisaje/` | 5,515 | **5,548** | 5,575 to **5,608** |
| `/servicii/tigla-metalica/` | 4,410 | **4,419** | 4,470 to **4,479** |
| `/ru/servicii/tigla-metalica/` | 4,464 | **4,473** | 4,524 to **4,533** |
| `/servicii/copertine/` | 7,334 | **7,343** | 7,394 to **7,403** |
| `/ru/servicii/copertine/` | 7,411 | **7,420** | 7,471 to **7,480** |
| `/servicii/garduri/` | 5,670 | **5,679** | 5,730 to **5,739** |
| `/ru/servicii/garduri/` | 5,692 | **5,701** | 5,752 to **5,761** |
| `/servicii/modele-garduri/` | 4,392 | **4,509** | 4,452 to **4,569** |
| `/ru/servicii/modele-garduri/` | 4,414 | **4,531** | 4,474 to **4,591** |
| `/servicii/galerie-garduri/` | 4,041 | **4,050** | 4,101 to **4,110** |
| `/ru/servicii/galerie-garduri/` | 4,041 | **4,050** | 4,101 to **4,110** |
| `/catalog/` | 3,697 | **3,706** | 3,757 to **3,766** |
| `/ru/catalog/` | 3,722 | **3,731** | 3,782 to **3,791** |
| `/catalog/termoizolatie/` | 6,879 | **6,888** | 6,939 to **6,948** |
| `/ru/catalog/termoizolatie/` | 6,795 | **6,804** | 6,855 to **6,864** |
| `/catalog/termoizolatie/polistiren-expandat/` | 3,622 | **3,631** | 3,682 to **3,691** |
| `/ru/catalog/termoizolatie/polistiren-expandat/` | 3,539 | **3,548** | 3,599 to **3,608** |
| `/catalog/termoizolatie/polistiren-extrudat/` | 3,099 | **3,108** | 3,159 to **3,168** |
| `/ru/catalog/termoizolatie/polistiren-extrudat/` | 3,079 | **3,088** | 3,139 to **3,148** |
| `/catalog/termoizolatie/vata-minerala/` | 3,581 | **3,590** | 3,641 to **3,650** |
| `/ru/catalog/termoizolatie/vata-minerala/` | 3,582 | **3,591** | 3,642 to **3,651** |
| `/catalog/termoizolatie/adezivi-si-mase-de-spaclu/` | 4,098 | **4,107** | 4,158 to **4,167** |
| `/ru/catalog/termoizolatie/adezivi-si-mase-de-spaclu/` | 4,020 | **4,029** | 4,080 to **4,089** |
| `/catalog/termoizolatie/alte-produse/` | 3,071 | **3,080** | 3,131 to **3,140** |
| `/ru/catalog/termoizolatie/alte-produse/` | 3,030 | **3,039** | 3,090 to **3,099** |
| `/catalog/tencuieli-decorative/` | 5,327 | **5,336** | 5,387 to **5,396** |
| `/ru/catalog/tencuieli-decorative/` | 5,404 | **5,413** | 5,464 to **5,473** |
| `/catalog/placi-ceramice/` | 12,822 | **12,831** | 12,882 to **12,891** |
| `/ru/catalog/placi-ceramice/` | 13,761 | **13,770** | 13,821 to **13,830** |
| `/catalog/elemente-decorative/` | 10,214 | **10,223** | 10,274 to **10,283** |
| `/ru/catalog/elemente-decorative/` | 10,649 | **10,658** | 10,709 to **10,718** |
| `/catalog/vopsele/` | 4,319 | **4,328** | 4,379 to **4,388** |
| `/ru/catalog/vopsele/` | 4,415 | **4,424** | 4,475 to **4,484** |
| `/catalog/vopsele/vopsele-de-exterior/` | 3,079 | **3,088** | 3,139 to **3,148** |
| `/ru/catalog/vopsele/vopsele-de-exterior/` | 3,101 | **3,110** | 3,161 to **3,170** |
| `/catalog/vopsele/vopsele-de-interior/` | 3,101 | **3,110** | 3,161 to **3,170** |
| `/ru/catalog/vopsele/vopsele-de-interior/` | 3,147 | **3,156** | 3,207 to **3,216** |
| `/catalog/sisteme-iluminare/` | 6,331 | **6,340** | 6,391 to **6,400** |
| `/ru/catalog/sisteme-iluminare/` | 6,275 | **6,284** | 6,335 to **6,344** |
| `/catalog/alte-materiale/` | 3,720 | **3,729** | 3,780 to **3,789** |
| `/ru/catalog/alte-materiale/` | 3,720 | **3,729** | 3,780 to **3,789** |


## AMENDED (W27-FIX-03, wave 27 fix pass): the eleven rainwater prices return, two budgets move

Added 2026-09-23 by card W27-FIX-03, under ruling W27-R-10. Nothing above this line moves.

The eleven rainwater parts print their Dasterum "de la" again and the Sisteme pluviale section
regains its derived "de la" line under the Compară heading, one line of text. All 53 budgets
re-measured at 1440, settled (reveals applied, 1,600ms), on the card's built tree; two move to
measured plus 60 (W24-R4) and the other 51 read identical to their W28-08 measurement:

| Page | Before (budget minus 60) | After | Budget |
|---|---|---|---|
| `/servicii/acoperisuri/` | 24,750 | **24,782** | 24,810 to **24,842** |
| `/ru/servicii/acoperisuri/` | 24,971 | **25,003** | 25,031 to **25,063** |

`scripts/verify-live.js` carries the two new figures; section 12.0 on the merge sha is what checks
them.

## AMENDED (W27-FIX-04, wave 27 fix pass): the "+N" chip, two Novatik budgets move

Added 2026-09-23 by card W27-FIX-04, under ruling W27-R-11. Nothing above this line moves.

A colour the count includes and the list does not name renders as a "+N" chip after the named
chips, on the roofing model cards and the Novatik cards alike. On the roofing page the chip fits
the existing row on every card, and the page reads identical to its W27-FIX-03 measurement; on the
Novatik page the row wraps once on Roman ("+2") and Wood ("+1"). All 53 budgets re-measured at
1440, settled (reveals applied, 1,600ms), on the card's built tree; two move to measured plus 60
(W24-R4) and the other 51 read identical:

| Page | Before (budget minus 60) | After | Budget |
|---|---|---|---|
| `/servicii/roca-vulcanica/` | 4,507 | **4,541** | 4,567 to **4,601** |
| `/ru/servicii/roca-vulcanica/` | 4,551 | **4,585** | 4,611 to **4,645** |

## AMENDED (W27-FIX-05, wave 27 fix pass): six accessory cards fold away, two budgets move

Added 2026-09-23 by card W27-FIX-05, under ruling W27-R-12. Nothing above this line moves.

Six Dasterum accessory records fold into five Imperlux near-twins and render nowhere, so the
roofing page's grid loses two rows in each locale. All 53 budgets re-measured at 1440, settled
(reveals applied, 1,600ms), on the card's built tree; two move to measured plus 60 (W24-R4) and the
other 51 read identical:

| Page | Before (budget minus 60) | After | Budget |
|---|---|---|---|
| `/servicii/acoperisuri/` | 24,782 | **23,873** | 24,842 to **23,933** |
| `/ru/servicii/acoperisuri/` | 25,003 | **24,094** | 25,063 to **24,154** |

## AMENDED (W27-FIX-08, wave 27 fix pass): the seven Imperlux tiles on the metal tile page, two budgets move

Added 2026-09-23 by card W27-FIX-08, under owner instruction W27-R-14. Nothing above this line moves.

`/servicii/tigla-metalica/` gains the seven Imperlux model cards above the four Dasterum tile
cards, two grid rows. All 53 budgets re-measured at 1440, settled (reveals applied, 1,600ms), on the
card's built tree; two move to measured plus 60 (W24-R4) and the other 51 read identical:

| Page | Before (budget minus 60) | After | Budget |
|---|---|---|---|
| `/servicii/tigla-metalica/` | 4,419 | **5,463** | 4,479 to **5,523** |
| `/ru/servicii/tigla-metalica/` | 4,473 | **5,538** | 4,533 to **5,598** |

## AMENDED (W27-FIX-12, wave 27 fix pass): the fence gallery loses one photograph, two budgets move

Added 2026-09-23 by card W27-FIX-12, under owner instruction W27-R-18. Nothing above this line moves.

The fence gallery grid drops from thirteen thumbnails to twelve, one row fewer. All 53 budgets
re-measured at 1440, settled (reveals applied, 1,600ms), on the card's built tree; two move to
measured plus 60 (W24-R4) and the other 51 read identical:

| Page | Before (budget minus 60) | After | Budget |
|---|---|---|---|
| `/servicii/galerie-garduri/` | 4,050 | **3,750** | 4,110 to **3,810** |
| `/ru/servicii/galerie-garduri/` | 4,050 | **3,750** | 4,110 to **3,810** |

## AMENDED (W27-FIX-15, wave 27 fix pass): the roofing catalogue page, two new budgets

Added 2026-09-23 by card W27-FIX-15, under owner instruction W27-R-21. Nothing above this line moves.

`/catalog/materiale-acoperis/` is a page again, the roofing service page's two bentos and the quote
form; it takes a budget of its own in each locale. The catalogue index gained two tiles and did
not grow (nine tiles fill the same three rows as seven did). All 55 budgeted pages measured at
1440, settled (reveals applied, 1,600ms), on the card's built tree; the two new rows are measured
plus 60 (W24-R4) and the other 53 read identical:

| Page | Measured | Budget |
|---|---|---|
| `/catalog/materiale-acoperis/` | 4,261 | **4,321** |
| `/ru/catalog/materiale-acoperis/` | 4,261 | **4,321** |


## AMENDED (W28-11, wave 28): the promo bar and the review claim leave every page, all 55 budgets move

Added 2026-09-23 by card W28-11, under owner rulings R-W28-02 and R-W28-03 and the wave 28
dispatch (R-X enforcement). Nothing above this line moves.

The promo bar (the site's only discount string) renders on no page any more, so every page is
44px shorter; the home pages also lose the hero highlight line, the fourth stat card and the
rating panel and gain the reviews link; the case la cheie and fațade pages lose a FAQ sentence
each. All 55 budgeted pages re-measured at 1440, settled (reveals applied, 1,600ms), on the
card's built tree; every budget is measured plus 60 (W24-R4):

| Page | Before (budget minus 60) | After | Budget |
|---|---|---|---|
| `/` | 9,290 | **9,261** | 9,350 to **9,321** |
| `/ru/` | 9,531 | **9,420** | 9,591 to **9,480** |
| `/in-constructie/` | 1,145 | **1,101** | 1,205 to **1,161** |
| `/ru/in-constructie/` | 1,145 | **1,101** | 1,205 to **1,161** |
| `/servicii/case-la-cheie/` | 6,523 | **6,479** | 6,583 to **6,539** |
| `/servicii/fatade/` | 5,412 | **5,341** | 5,472 to **5,401** |
| `/ru/servicii/case-la-cheie/` | 6,655 | **6,584** | 6,715 to **6,644** |
| `/ru/servicii/fatade/` | 5,628 | **5,557** | 5,688 to **5,617** |
| `/servicii/acoperisuri/` | 23,873 | **23,802** | 23,933 to **23,862** |
| `/ru/servicii/acoperisuri/` | 24,094 | **24,050** | 24,154 to **24,110** |
| `/servicii/roca-vulcanica/` | 4,541 | **4,497** | 4,601 to **4,557** |
| `/ru/servicii/roca-vulcanica/` | 4,585 | **4,541** | 4,645 to **4,601** |
| `/ru/servicii/finisaje/` | 5,548 | **5,504** | 5,608 to **5,564** |
| `/servicii/tigla-metalica/` | 5,463 | **5,419** | 5,523 to **5,479** |
| `/ru/servicii/tigla-metalica/` | 5,538 | **5,494** | 5,598 to **5,554** |
| `/servicii/copertine/` | 7,343 | **7,299** | 7,403 to **7,359** |
| `/ru/servicii/copertine/` | 7,420 | **7,376** | 7,480 to **7,436** |
| `/servicii/garduri/` | 5,679 | **5,635** | 5,739 to **5,695** |
| `/ru/servicii/garduri/` | 5,701 | **5,657** | 5,761 to **5,717** |
| `/servicii/modele-garduri/` | 4,509 | **4,465** | 4,569 to **4,525** |
| `/ru/servicii/modele-garduri/` | 4,531 | **4,487** | 4,591 to **4,547** |
| `/servicii/galerie-garduri/` | 3,750 | **3,706** | 3,810 to **3,766** |
| `/ru/servicii/galerie-garduri/` | 3,750 | **3,706** | 3,810 to **3,766** |
| `/catalog/` | 3,706 | **3,662** | 3,766 to **3,722** |
| `/ru/catalog/` | 3,731 | **3,687** | 3,791 to **3,747** |
| `/catalog/materiale-acoperis/` | 4,261 | **4,217** | 4,321 to **4,277** |
| `/ru/catalog/materiale-acoperis/` | 4,261 | **4,217** | 4,321 to **4,277** |
| `/catalog/termoizolatie/` | 6,888 | **6,844** | 6,948 to **6,904** |
| `/ru/catalog/termoizolatie/` | 6,804 | **6,760** | 6,864 to **6,820** |
| `/catalog/termoizolatie/polistiren-expandat/` | 3,631 | **3,587** | 3,691 to **3,647** |
| `/ru/catalog/termoizolatie/polistiren-expandat/` | 3,548 | **3,504** | 3,608 to **3,564** |
| `/catalog/termoizolatie/polistiren-extrudat/` | 3,108 | **3,064** | 3,168 to **3,124** |
| `/ru/catalog/termoizolatie/polistiren-extrudat/` | 3,088 | **3,044** | 3,148 to **3,104** |
| `/catalog/termoizolatie/vata-minerala/` | 3,590 | **3,546** | 3,650 to **3,606** |
| `/ru/catalog/termoizolatie/vata-minerala/` | 3,591 | **3,547** | 3,651 to **3,607** |
| `/catalog/termoizolatie/adezivi-si-mase-de-spaclu/` | 4,107 | **4,063** | 4,167 to **4,123** |
| `/ru/catalog/termoizolatie/adezivi-si-mase-de-spaclu/` | 4,029 | **3,985** | 4,089 to **4,045** |
| `/catalog/termoizolatie/alte-produse/` | 3,080 | **3,036** | 3,140 to **3,096** |
| `/ru/catalog/termoizolatie/alte-produse/` | 3,039 | **2,995** | 3,099 to **3,055** |
| `/catalog/tencuieli-decorative/` | 5,336 | **5,292** | 5,396 to **5,352** |
| `/ru/catalog/tencuieli-decorative/` | 5,413 | **5,369** | 5,473 to **5,429** |
| `/catalog/placi-ceramice/` | 12,831 | **12,787** | 12,891 to **12,847** |
| `/ru/catalog/placi-ceramice/` | 13,770 | **13,726** | 13,830 to **13,786** |
| `/catalog/elemente-decorative/` | 10,223 | **10,179** | 10,283 to **10,239** |
| `/ru/catalog/elemente-decorative/` | 10,658 | **10,614** | 10,718 to **10,674** |
| `/catalog/vopsele/` | 4,328 | **4,284** | 4,388 to **4,344** |
| `/ru/catalog/vopsele/` | 4,424 | **4,380** | 4,484 to **4,440** |
| `/catalog/vopsele/vopsele-de-exterior/` | 3,088 | **3,044** | 3,148 to **3,104** |
| `/ru/catalog/vopsele/vopsele-de-exterior/` | 3,110 | **3,066** | 3,170 to **3,126** |
| `/catalog/vopsele/vopsele-de-interior/` | 3,110 | **3,066** | 3,170 to **3,126** |
| `/ru/catalog/vopsele/vopsele-de-interior/` | 3,156 | **3,112** | 3,216 to **3,172** |
| `/catalog/sisteme-iluminare/` | 6,340 | **6,296** | 6,400 to **6,356** |
| `/ru/catalog/sisteme-iluminare/` | 6,284 | **6,240** | 6,344 to **6,300** |
| `/catalog/alte-materiale/` | 3,729 | **3,685** | 3,789 to **3,745** |
| `/ru/catalog/alte-materiale/` | 3,729 | **3,685** | 3,789 to **3,745** |

## AMENDED (W28-12, wave 28): the quote button after the portfolio, two budgets move

Added 2026-09-23 by card W28-12, under the wave 28 dispatch. Nothing above this line moves.

The home pages gain a full-width quote button at the foot of the portfolio section. All 55
budgeted pages re-measured at 1440, settled (reveals applied, 1,600ms), on the card's built
tree; two move to measured plus 60 (W24-R4) and the other 53 read identical:

| Page | Before (budget minus 60) | After | Budget |
|---|---|---|---|
| `/` | 9,261 | **9,341** | 9,321 to **9,401** |
| `/ru/` | 9,420 | **9,500** | 9,480 to **9,560** |

## AMENDED (W28-13, wave 28): the roofing catalogue moves to its catalogue page, six budgets move

Added 2026-09-23 by card W28-13, under the wave 28 dispatch ("services versus catalog"). Nothing
above this line moves.

The product bento, the filter bar with its counts, the four compare tables and the 99 cards leave
`/servicii/acoperisuri/` for `/catalog/materiale-acoperis/`; the service page gains six link
cards, the fence page one. All 55 budgeted pages re-measured at 1440, settled (reveals applied,
1,600ms), on the card's built tree; six move to measured plus 60 (W24-R4) and the other 49 read
identical:

| Page | Before (budget minus 60) | After | Budget |
|---|---|---|---|
| `/servicii/acoperisuri/` | 23,802 | **8,106** | 23,862 to **8,166** |
| `/ru/servicii/acoperisuri/` | 24,050 | **8,271** | 24,110 to **8,331** |
| `/servicii/garduri/` | 5,635 | **6,025** | 5,695 to **6,085** |
| `/ru/servicii/garduri/` | 5,657 | **6,046** | 5,717 to **6,106** |
| `/catalog/materiale-acoperis/` | 4,217 | **19,380** | 4,277 to **19,440** |
| `/ru/catalog/materiale-acoperis/` | 4,217 | **19,463** | 4,277 to **19,523** |

## AMENDED (W28-14, wave 28): photographs on the twelve copertine models and a tenth catalogue tile, four budgets move

Added 2026-09-24 by card W28-14, under the wave 28 dispatch. Nothing above this line moves.

The copertine page's twelve model cards carry a 4:3 photograph each, the group chip and its
status line; the catalogue index gains a tenth tile, a fourth row. All 55 budgeted pages
re-measured at 1440, settled (reveals applied, 1,600ms), on the card's built tree; four move to
measured plus 60 (W24-R4) and the other 51 read identical:

| Page | Before (budget minus 60) | After | Budget |
|---|---|---|---|
| `/servicii/copertine/` | 7,299 | **8,105** | 7,359 to **8,165** |
| `/ru/servicii/copertine/` | 7,376 | **8,182** | 7,436 to **8,242** |
| `/catalog/` | 3,662 | **4,027** | 3,722 to **4,087** |
| `/ru/catalog/` | 3,687 | **4,052** | 3,747 to **4,112** |

## AMENDED (W28-19, wave 28): one NAP block in every footer and the Despre facts on home, all 55 budgets move

Added 2026-09-24 by card W28-19, under the wave 28 dispatch. Nothing above this line moves.

Every page's footer gains the `<address data-nap>` block (name, street, locality, phone, e-mail,
the same bytes on all 85 pages), and the two home pages gain the Despre facts paragraph in
`#despre`. All 55 budgeted pages re-measured at 1440, settled (reveals applied, 1,600ms), on the
card's built tree; all 55 move to measured plus 60 (W24-R4), 54 up by 19 to 145 pixels and `/ru/servicii/acoperisuri/` down by 7 (a
rewritten FAQ answer is shorter):

| Page | Before (budget minus 60) | After | Budget |
|---|---|---|---|
| `/` | 9,341 | **9,458** | 9,401 to **9,518** |
| `/ru/` | 9,500 | **9,645** | 9,560 to **9,705** |
| `/in-constructie/` | 1,101 | **1,121** | 1,161 to **1,181** |
| `/ru/in-constructie/` | 1,101 | **1,121** | 1,161 to **1,181** |
| `/servicii/case-la-cheie/` | 6,479 | **6,498** | 6,539 to **6,558** |
| `/servicii/fatade/` | 5,341 | **5,361** | 5,401 to **5,421** |
| `/ru/servicii/case-la-cheie/` | 6,584 | **6,603** | 6,644 to **6,663** |
| `/ru/servicii/fatade/` | 5,557 | **5,576** | 5,617 to **5,636** |
| `/servicii/acoperisuri/` | 8,106 | **8,126** | 8,166 to **8,186** |
| `/ru/servicii/acoperisuri/` | 8,271 | **8,264** | 8,331 to **8,324** |
| `/servicii/roca-vulcanica/` | 4,497 | **4,517** | 4,557 to **4,577** |
| `/ru/servicii/roca-vulcanica/` | 4,541 | **4,560** | 4,601 to **4,620** |
| `/ru/servicii/finisaje/` | 5,504 | **5,524** | 5,564 to **5,584** |
| `/servicii/tigla-metalica/` | 5,419 | **5,439** | 5,479 to **5,499** |
| `/ru/servicii/tigla-metalica/` | 5,494 | **5,514** | 5,554 to **5,574** |
| `/servicii/copertine/` | 8,105 | **8,125** | 8,165 to **8,185** |
| `/ru/servicii/copertine/` | 8,182 | **8,201** | 8,242 to **8,261** |
| `/servicii/garduri/` | 6,025 | **6,044** | 6,085 to **6,104** |
| `/ru/servicii/garduri/` | 6,046 | **6,066** | 6,106 to **6,126** |
| `/servicii/modele-garduri/` | 4,465 | **4,485** | 4,525 to **4,545** |
| `/ru/servicii/modele-garduri/` | 4,487 | **4,506** | 4,547 to **4,566** |
| `/servicii/galerie-garduri/` | 3,706 | **3,725** | 3,766 to **3,785** |
| `/ru/servicii/galerie-garduri/` | 3,706 | **3,725** | 3,766 to **3,785** |
| `/catalog/` | 4,027 | **4,047** | 4,087 to **4,107** |
| `/ru/catalog/` | 4,052 | **4,072** | 4,112 to **4,132** |
| `/catalog/materiale-acoperis/` | 19,380 | **19,400** | 19,440 to **19,460** |
| `/ru/catalog/materiale-acoperis/` | 19,463 | **19,483** | 19,523 to **19,543** |
| `/catalog/termoizolatie/` | 6,844 | **6,864** | 6,904 to **6,924** |
| `/ru/catalog/termoizolatie/` | 6,760 | **6,780** | 6,820 to **6,840** |
| `/catalog/termoizolatie/polistiren-expandat/` | 3,587 | **3,607** | 3,647 to **3,667** |
| `/ru/catalog/termoizolatie/polistiren-expandat/` | 3,504 | **3,524** | 3,564 to **3,584** |
| `/catalog/termoizolatie/polistiren-extrudat/` | 3,064 | **3,084** | 3,124 to **3,144** |
| `/ru/catalog/termoizolatie/polistiren-extrudat/` | 3,044 | **3,063** | 3,104 to **3,123** |
| `/catalog/termoizolatie/vata-minerala/` | 3,546 | **3,565** | 3,606 to **3,625** |
| `/ru/catalog/termoizolatie/vata-minerala/` | 3,547 | **3,567** | 3,607 to **3,627** |
| `/catalog/termoizolatie/adezivi-si-mase-de-spaclu/` | 4,063 | **4,083** | 4,123 to **4,143** |
| `/ru/catalog/termoizolatie/adezivi-si-mase-de-spaclu/` | 3,985 | **4,005** | 4,045 to **4,065** |
| `/catalog/termoizolatie/alte-produse/` | 3,036 | **3,055** | 3,096 to **3,115** |
| `/ru/catalog/termoizolatie/alte-produse/` | 2,995 | **3,015** | 3,055 to **3,075** |
| `/catalog/tencuieli-decorative/` | 5,292 | **5,312** | 5,352 to **5,372** |
| `/ru/catalog/tencuieli-decorative/` | 5,369 | **5,388** | 5,429 to **5,448** |
| `/catalog/placi-ceramice/` | 12,787 | **12,807** | 12,847 to **12,867** |
| `/ru/catalog/placi-ceramice/` | 13,726 | **13,745** | 13,786 to **13,805** |
| `/catalog/elemente-decorative/` | 10,179 | **10,198** | 10,239 to **10,258** |
| `/ru/catalog/elemente-decorative/` | 10,614 | **10,633** | 10,674 to **10,693** |
| `/catalog/vopsele/` | 4,284 | **4,304** | 4,344 to **4,364** |
| `/ru/catalog/vopsele/` | 4,380 | **4,399** | 4,440 to **4,459** |
| `/catalog/vopsele/vopsele-de-exterior/` | 3,044 | **3,063** | 3,104 to **3,123** |
| `/ru/catalog/vopsele/vopsele-de-exterior/` | 3,066 | **3,086** | 3,126 to **3,146** |
| `/catalog/vopsele/vopsele-de-interior/` | 3,066 | **3,086** | 3,126 to **3,146** |
| `/ru/catalog/vopsele/vopsele-de-interior/` | 3,112 | **3,132** | 3,172 to **3,192** |
| `/catalog/sisteme-iluminare/` | 6,296 | **6,316** | 6,356 to **6,376** |
| `/ru/catalog/sisteme-iluminare/` | 6,240 | **6,259** | 6,300 to **6,319** |
| `/catalog/alte-materiale/` | 3,685 | **3,704** | 3,745 to **3,764** |
| `/ru/catalog/alte-materiale/` | 3,685 | **3,704** | 3,745 to **3,764** |

## AMENDED (W28-25, wave 28): the hub tiles leave the two service pages for the Catalog, six budgets move

Added 2026-09-24 by card W28-25, under R-W28-08. Nothing above this line moves.

The roofing hub leaves `/servicii/acoperisuri/` (it stays on `/catalog/materiale-acoperis/`) and
the fence hub leaves `/servicii/garduri/` for the fence models page. All 55 budgeted pages
re-measured at 1440, settled (reveals applied, 1,600ms), on the card's built tree; six move to
measured plus 60 (W24-R4) and the other 49 read identical:

| Page | Before (budget minus 60) | After | Budget |
|---|---|---|---|
| `/servicii/acoperisuri/` | 8,126 | **7,326** | 8,186 to **7,386** |
| `/ru/servicii/acoperisuri/` | 8,264 | **7,464** | 8,324 to **7,524** |
| `/servicii/garduri/` | 6,044 | **5,245** | 6,104 to **5,305** |
| `/ru/servicii/garduri/` | 6,066 | **5,267** | 6,126 to **5,327** |
| `/servicii/modele-garduri/` | 4,485 | **5,284** | 4,545 to **5,344** |
| `/ru/servicii/modele-garduri/` | 4,506 | **5,306** | 4,566 to **5,366** |

## AMENDED (W28-24, wave 28): ten stock pictures join the fence gallery page, two budgets move

Added 2026-09-24 by card W28-24, under R-W28-07. Nothing above this line moves.

Every gallery gains stock pictures after the owner's photographs. On the service pages the
gallery is one card that opens a lightbox, so the page does not grow and the new heading
"Exemple de lucrări și soluții" / "Примеры работ и решений" takes the old heading's line. The fence
gallery page shows every picture as a thumbnail, so it grows by the ten new ones and gains a
visible heading. All 55 budgeted pages re-measured at 1440, settled (reveals applied, 1,600ms), on
the card's built tree; two move to measured plus 60 (W24-R4) and the other 53 read identical:

| Page | Before (budget minus 60) | After | Budget |
|---|---|---|---|
| `/servicii/galerie-garduri/` | 3,725 | **4,981** | 3,785 to **5,041** |
| `/ru/servicii/galerie-garduri/` | 3,725 | **4,981** | 3,785 to **5,041** |

## AMENDED (W28-29, wave 28): a button on every copertine model card, two budgets move

Added 2026-09-24 by card W28-29, under R-W28-14. Nothing above this line moves.

Each of the twelve copertine model cards trades its one-line ask for a button to the contact form,
which is taller, so the model grid grows by one button height per row. All 55 budgeted pages
re-measured at 1440, settled (reveals applied, 1,600ms), on the card's built tree; two move to
measured plus 60 (W24-R4) and the other 53 read identical:

| Page | Before (budget minus 60) | After | Budget |
|---|---|---|---|
| `/servicii/copertine/` | 8,125 | **8,157** | 8,185 to **8,217** |
| `/ru/servicii/copertine/` | 8,201 | **8,233** | 8,261 to **8,293** |

## AMENDED (W28-30, wave 28): copertine leaves the Catalog, four budgets move

Added 2026-09-24 by card W28-30, the fifth dispatch. Nothing above this line moves.

The copertine group leaves the Catalog: its tile goes from the Catalog index (a row of tiles fewer),
and its group chip and status line go from the copertine page, whose twelve cards now sit below the
gallery. All 55 budgeted pages re-measured at 1440, settled (reveals applied, 1,600ms), on the card's
built tree; four move to measured plus 60 (W24-R4) and the other 51 read identical:

| Page | Before (budget minus 60) | After | Budget |
|---|---|---|---|
| `/servicii/copertine/` | 8,157 | **8,053** | 8,217 to **8,113** |
| `/ru/servicii/copertine/` | 8,233 | **8,129** | 8,293 to **8,189** |
| `/catalog/` | 4,047 | **3,682** | 4,107 to **3,742** |
| `/ru/catalog/` | 4,072 | **3,706** | 4,132 to **3,766** |
