# W19-D2 · Between 401px and 768px, the hero photo on the homepage and every service page shrinks to 400px and hangs left

| | |
|---|---|
| Found by | Critic, wave 19 boundary, 2026-09-16 |
| Live build | `47957f3`, `https://rapidconstruct.md` |
| Severity rank | 2 of 5 |
| Mode | Not assigned by the critic |

## What a visitor sees

On a large phone held sideways, or on a small tablet, the photo in the page's
opening block does not fill its column.
- **The homepage:** the building-site photo under the dark "Construim pentru azi"
  card.
- **All nine service pages:** the service photo beside the title.

The photo is 400px wide at the left, with empty space to its right, directly under
elements that span the full width. At 390px and at 900px and up, the same photo
fills its column.

## Why it happens

`src/styles.css`, inside `@media (max-width: 768px)`:

    .media--4x3, .media--3x2 { max-height: 300px; }

The comment says it stops single-column card images ballooning, and that it has "no
effect at the 390px reference width". The service card and project card images
stretch to their column and simply crop to 300px tall. The two hero photo boxes do
not stretch: `.hero-panel-media--photo` and `.svc-hero__art--photo` keep their
`aspect-ratio: 4 / 3`. With the height capped at 300px, their width collapses to
300 × 4/3 = **400px**, wherever the column is wider than that.

## Evidence, measured on the live site

Headless Chrome, `mobile: true`. The width of the element matching
`.hero-panel-media--photo, .svc-hero__art--photo` against the content width of its
parent. Pages: `/`, `/ru/` and the 18 service pages (20 pages, each with a hero
photo, asserted). Widths 420, 480, 600, 700 and 768: **100 combinations read, 80
failing**:

| Width | Failing | Example |
|---|---|---|
| 420 | 0 of 20 | column 388px, photo fills it |
| 480 | 20 of 20 | photo 400px in a 448px column |
| 600 | 20 of 20 | photo 400px in a 568px column |
| 700 | 20 of 20 | photo 400px in a 668px column |
| 768 | 20 of 20 | photo 400px in a 736px column (54%) |

At 390, 900 and 1024px the same box fills its column exactly: 358 of 358, 852 of
852 and 976 of 976, measured with the check below on `/` and on
`/servicii/fatade/`. The cap does not apply there.

## Scope

The two hero photo boxes, `.hero-panel-media--photo` on both homepages and
`.svc-hero__art--photo` on all 18 service pages, at viewport widths from 401px to
768px.

## Fix direction, non-binding

Let the hero photo boxes take their column's full width inside the ≤768px query,
and crop by height the way the card images already do. The cap exists to hold
height down, so keep it. Do not change the card image rule, which is working as its
comment intends.

## Acceptance, machine-checkable

Headless Chrome against a local build, `mobile: true`.

1. For `/`, `/ru/` and the 18 service pages (20 pages), at widths 420, 480, 600, 700
   and 768 (100 combinations, print the count read):
   - exactly one element matches `.hero-panel-media--photo, .svc-hero__art--photo`.
     Fail if none does, rather than skip;
   - its `getBoundingClientRect().width` is within 1px of its parent's
     `getBoundingClientRect().width` minus the parent's horizontal padding.
2. **Unchanged elsewhere.** At 390, 1024 and 1280, the photo's width and height on
   those 20 pages equal `main`'s, within 1px.
3. **No new overflow.** At every width in check 1,
   `document.documentElement.scrollWidth <= document.documentElement.clientWidth`.
4. **Watched failing first.** Check 1 on the current `main` build fails on exactly the
   80 combinations above: all 20 pages at 480, 600, 700 and 768.
5. **Heights.** R-Y's homepage budgets are measured at 1440×900 and the service
   budgets in the wave 7 table at desktop width, so neither should move. Confirm with
   `node scripts/verify-live.js` against the local build: exit 0, every page inside
   budget. All `quality` gates exit 0, each read from its own process.
