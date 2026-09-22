# W26-05a · The Compară table's white labels, the copertine crumb, and gate 28

Card W26-05a. Branch `w26/w26-05a-table-contrast`, based on `main` at `2397634`. PR only.
Inserted at the owner's request, from two screenshots of the live site.

## Section 12.0 on the sha you merged: PASS

`EXPECT_SHA=2397634eae25ebde5643d7b6dcda06c249b12d16 node scripts/verify-live.js
https://rapidconstruct.md` → **exit 0. PASS, 0 unverified, 0 failed, 51 of 51 pages, 16 of 16
redirect URLs, 0 retried.** W26-05 is complete.

## What you saw, and why

**Rocă vulcanică's "Compară modelele" table printed its model names and its row labels white
on white**, in both locales, at every width. The table paints its own white card on a dark
band. Its header cells set no text colour of their own, so they took the band's, which is
white. The values were readable only because they carry the grey text colour of their own.

**It shipped on 2026-09-20 with W24-07 and was live for two days.**

## "All of them": every text element on every page, measured

I did not stop at that table. **Every visible text element on every built page, both
locales, at desktop and phone width: 15,423 elements on 67 pages, 134 combinations.** It
found exactly two defects:

| Where | What | Contrast | Fixed |
|---|---|---|---|
| `/servicii/roca-vulcanica/`, RO and RU | 9 header cells per table, white on white | **1:1** | yes |
| `/servicii/copertine/`, RO and RU | the breadcrumb's current page, near-black on the dark hero | **1.06:1** | yes |

**No other table is affected.** There are 24 tables on 16 pages: the rest sit on white
sections, where the inherited colour happens to be the right one.

**The breadcrumb is the same shape of defect.** The copertine hero sets its crumb white, but
the general breadcrumb rule sits later in the stylesheet at the same strength and won, so the
page name rendered near-black on near-black. Also W24-08, also 2026-09-20.

## The fix

Two stylesheet rules, no new colour, no layout change:

1. **A table that paints its own white ground sets its own ink.** One line on `.spec`.
2. **The copertine crumb is written two classes deep**, so the general rule cannot outrank it.
   Its link hover is set to the brand orange for the same reason.

**Heights identical to the pixel** on all four affected pages, and equal to the live figures:
4,234 / 4,332 and 6,555 / 6,631.

## Gate 28, so this fails in CI next time

**Why no gate saw it.** Lighthouse measures contrast, but gate 5 runs it on the two homepages
only. Gate 18 measures contrast inside the header menus only. **No other page had ever had its
text contrast read by anything.**

`scripts/check-text-contrast.js` reads every built page, both locales, at 1440 and 390, and
holds every visible text element to WCAG's 4.5:1, or 3:1 for large text.

- **Watched fail on `main` as deployed: exit 1, 40 problems**, the 36 header cells and the 4
  breadcrumbs, and nothing else. **On this branch: exit 0.**
- **Twelve self-test arms run first, three of them GREEN.** Both real defects are planted back
  onto the real pages and must fire, at desktop and at phone width.
- **Decoration is not judged.** The roofing offer cards' big faint "01" to "04" numerals are
  meant to be faint, and they carry `aria-hidden`, which is how this site marks decoration.
  WCAG exempts decoration. 316 such elements, counted every run.

### It caught its own first version

The first version passed its own planted defect on some runs and failed it on others. **The
site animates colour changes**, so right after the defect was planted the cells were still
fading from dark to white, and a reading 60ms later caught them halfway. The gate now waits
for every animation to finish before it reads anything. Five runs after that: every arm fired
every time.

## Gates

**27 of 27 gate commands exit 0.** 28 numbered gates.

## Recorded for ratification

1. **Gate 28**: every visible text element, every page, WCAG 1.4.3, at rest.
2. **`aria-hidden` text is treated as decoration and not judged**, counted every run.
