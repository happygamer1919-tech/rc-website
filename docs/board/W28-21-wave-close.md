# W28-21 · Wave close: Lighthouse, W28-FINAL-RUN, the review, W28-RUN

Card W28-21. Branch `w28/w28-21-wave-close`, stacked on W28-19. Under the wave 28 dispatch.

## What this card does

Closes wave 28 with three reports and no page change. `docs/reports/W28-FINAL-RUN.md` lists every
card with its pull request, merge sha and live verification, the 33 gate commands with their exit
codes, and Lighthouse on the five pages the dispatch names in both locales (the contact page is the
home footer). `docs/reports/W28-REVIEW.md` is the critic pass in the W27-REV-01 shape: every gate,
a rendered crawl of all 83 pages at 1440, 768 and 390, Lighthouse, a taste list; it found one defect
(the hero stat labels at 13px on phones, W28-22's rule) and made it the wave's single fix card,
W28-FIX-01. `docs/reports/W28-RUN.md` lists every pull request, the three blocked questions with
their exact model and page lists, and every deviation from the dispatch, D1 to D18.

## Measured

- Gates: 33 of 33 exit 0 on the tree byte-identical to `main` at `36669bd`.
- Crawl: 0 dead links, 0 missing images, 0 console errors, 0 sideways scroll, 14 of 14 redirects,
  30 of 30 forms; 60 text nodes under 14px (36 known SVG labels, 24 the stat labels); 43 empty alts
  in the three known groups.
- Lighthouse desktop, median of three: performance 99 / 99 / 97 / 97 / 99 / 99 / 97 / 97 on home,
  acoperisuri, garduri and catalog in RO and RU; accessibility, best practices and SEO 100 on all.

## Acceptance

- `test -f docs/reports/W28-FINAL-RUN.md && test -f docs/reports/W28-REVIEW.md && test -f docs/reports/W28-RUN.md`: exit 0.
- `node scripts/run-gates.js --keep-going`: 33 of 33 exit 0 on the final tree, the count printed.
- The board artifact republished with W28-21 and W28-FIX-01 on it.

## Owner action

One real lead in Romanian and one in Russian through the quote form after the merge (the W21 standing
rule); not a terminal step.
