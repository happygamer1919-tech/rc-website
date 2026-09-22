# W25-23 · The homepage said Acoperișuri twice

Card W25-23. Branch `w25/w25-23-homepage-teaser`, on `main` at `c05ce0e` after #108 to #113
merged. PR only, stops for the owner.

## What this ships

**The Acoperișuri card leaves the homepage product strip.** Copertine and Garduri remain, as
two equal columns, in both locales.

**And the six rulings of this dispatch, recorded first**, `W25-R19` to `W25-R24` in
`docs/rulings/W25-R.md`. The next free id was `W25-R19`. This card acts on none of them; they
belong to W25-24 through W25-29.

## Why the card went, beyond being asked

The strip is three cards and one of them was a SERVICE card among two product-page cards. It
was there because the roofing service page had nothing else pointing at it from the homepage.
It has since, three times over:

- the homepage **services grid**, one section above, carries Acoperișuri like every other
  service;
- the header's **Servicii** panel lists it;
- **W25-19** made that page the home of the whole roofing catalogue, so the `/catalog/`
  roofing tile and the catalogue menu both open it.

A fourth route, one row under the services grid, is a strip that says the same thing twice.

## The count is derived, not written

The strip is now exactly `TOP_LEVEL_PRODUCT_PAGES`, and the assertion is against that list's
length rather than against the number 2. A third top-level product page would reach the strip
with no edit here, and a page dropped from that list cannot leave a silent gap.

`if (tiles.length !== 3)` was the old line and `!== 2` would have been the same defect this
repo has already met twice: **a count remembered instead of derived**.

The CSS follows the same rule. `repeat(auto-fit, minmax(260px, 1fr))` rather than a hard two,
so the columns stay equal at whatever the list holds.

## The budget falls, and the reason is not the card's own height

| Page | Before | After | Budget |
|---|---|---|---|
| `/` | 9,135 | **9,081** | 9,195 to **9,141** |
| `/ru/` | 9,376 | **9,294** | 9,436 to **9,354** |

**The strip is one grid row, so removing one of three cards does not remove a row.** What
changed is the column width: two cards across the same container are wider than three, each
line of teaser text holds more words, and the tallest card in the row loses a line. RO drops
54px, RU drops 82px, and **RU drops more because Russian sets longer**.

Measured at 1440 with every reveal applied and settled, plus 60, which is W24-R4's term. The
before column is the same build with the card still in it, measured the same way in the same
session. `docs/rulings/R-Y.md` carries it.

## A live marker, so it cannot quietly come back

`teaserTiles: 2` joins the homepage marker set, and the probe counts `.teasers > .teaser`. It
is asserted for the same reason `roofOffers: 0` is: a build that puts the Acoperișuri card
back fires this rather than passing quietly, and so does one that loses a second card.

## W25-R18 is discharged

The ruling required the W25-19 acoperisuri budget re-measured on the deployed sha. Section
12.0 on `c05ce0e589da98b1a97c660537882388feff7a0e` read **`svc RO acoper 16904px / 16964
inside`** and **`svc RU acoper 17064px / 17124 inside`**: the live page measures exactly what
the local build did, so the budgets set at W25-19 stand and no correction is owed. Recorded in
`docs/rulings/R-Y.md`, where the figure lives.

## Section 12.0 on `c05ce0e`, owed by #108 to #113

Run unprompted before this card started, full forty-character `EXPECT_SHA`, edge polled with a
cache-buster until it served that sha. `node scripts/verify-live.js https://rapidconstruct.md`:
**exit 0, PASS, 0 unverified, 0 failed, 51 of 51 pages, 0 rows retried, 0 pages that never
became ready.** 39 reachable URLs crawled, 0 with a visible TODO, and **16 of 16 redirect URLs
answered 200** with their refresh, canonical and visible link agreeing.

## Gates

**24 of 24 gate commands exit 0.**

## Recorded for ratification

1. **The strip's length is asserted against `TOP_LEVEL_PRODUCT_PAGES`**, never against a
   literal.
2. **The budget fell** because the measurement did, which is R-Y's standing rule.
