# W19-D6 · On both homepages, the "Solicită ofertă" buttons land on the quote form with the callback popup covering it

| | |
|---|---|
| Found by | Critic, wave 19 boundary, second pass, 2026-09-17 |
| Live build | `ff102c6`, `https://rapidconstruct.md` |
| Severity rank | 1 of 5 in this pass |
| Mode | Not assigned by the critic |

## What a visitor sees

A visitor on `/` or `/ru/` clicks **"Solicită ofertă"** / **"Получить смету"**. The
button can be in the header, the hero card, one of the four roofing offer cards, or
the phone menu. The page scrolls down to the quote form. On arrival, a different
popup, **"Te sunăm noi"** / its RU twin, opens on top of that form. The cursor
moves into the popup's phone field. The visitor asked for the form, and has to
close a popup before they can use it.

On a phone the popup covers the form's first fields completely.

## Why it happens

`src/main.js`, block 5 (the lead capture modal). The popup opens on the first of
three triggers: 30 seconds, **50% scroll depth**, or desktop exit intent. On both
homepages the quote form (`#oferta`) sits at 87% to 89% of the scrollable height. A
jump to it therefore crosses 50%, and the depth listener opens the popup when the
scroll arrives.

The code already suppresses the popup for a visitor who is converting, but only
after the main form is **submitted** ("Suppress permanently once the main form has
been submitted"). A click on a button whose only purpose is to reach that form is
not treated the same way.

The popup exists only on the two homepages. `src/service.html`, `src/product.html`,
`src/category.html` and the privacy and 404 templates carry no `#lead-modal`, so
the "Solicită ofertă" buttons on those pages are not affected.

## Evidence, measured on the live site

Headless Chrome, build `ff102c6`. `sessionStorage` was cleared before each load, so
the popup was armed as for a first-time visitor. Each homepage carries 8
`a[href="#oferta"]`. The table covers the 6 visible at each width, excluding the
footer one, because scrolling the footer into view crosses 50% before any click.
Before every click, the link was brought into view with an instant scroll and the
popup was asserted closed.

**24 combinations read, 24 failing.**

| Width | Page | Buttons clicked | Popup open on arrival | Focus |
|---|---|---|---|---|
| 1280 | `/` | header, hero, 4 offer cards | 6 of 6 | `#lead-phone` |
| 1280 | `/ru/` | header, hero, 4 offer cards | 6 of 6 | `#lead-phone` |
| 390 (touch) | `/` | phone menu, hero, 4 offer cards | 6 of 6 | `#lead-phone` |
| 390 (touch) | `/ru/` | phone menu, hero, 4 offer cards | 6 of 6 | `#lead-phone` |

In every run the form itself arrived correctly, with its top at the header's bottom
edge (96px at 1280, 80px at 390). Only the popup is wrong. The same was seen at
1920×1080 from the header button.

**Context, not in scope.** The header's "Portofoliu", "Despre" and "Contacte" jumps
also open the popup on arrival (depth 0.57, 0.75 and 1.0). That is the 50% trigger
working as designed, and whether a paying client wants an auto-opening popup at all
is already recorded as theirs to decide: report item 3 of the first pass in
`docs/audits/wave-19-critic-taste.md`. This card does not change it.

## Scope

The popup's trigger handling in `src/main.js`, on `/` and `/ru/`. Only the paths
where the visitor has asked for the quote form.

## Fix direction, non-binding

Treat reaching for the quote form as the same signal that submitting it already is.
For example, a click on any `a[href="#oferta"]`, or focus entering `#quote-form`,
tears the triggers down the way the submit handler does. The 30-second, 50% depth
and exit intent triggers stay as they are for every other visitor.

## Acceptance, machine-checkable

Headless Chrome against a local build (`node build.js`, `dist/` served at the site
root). Clear `sessionStorage` before every load.

1. **The form paths.** `/` and `/ru/`, at 1280×800 (`mobile: false`, mouse events)
   and 390×844 (`mobile: true`, touch events). The links are the `a[href="#oferta"]`
   in the header (1280) or the phone menu (390), in the hero card, and in the four
   roofing offer cards: 6 per page and width, **24 combinations**. The footer's is
   excluded, because reaching it crosses 50% depth before any click. Print the count,
   and fail if fewer than 24 are read. For each:
   - bring the link into view with `scrollIntoView({ block: 'center', behavior:
     'instant' })`, and open the phone menu first for the menu's link;
   - **precondition:** `#lead-modal` has the `hidden` attribute. If not, the
     combination is invalid and fails;
   - click or tap its centre, then wait 2.5s;
   - assert `#lead-modal` is still `hidden`, `document.activeElement.id !==
     'lead-phone'`, and `#oferta`'s top lies between 0 and the `.header` height
     plus 2px.
2. **Typing is not interrupted.** At 1280 on `/`, click the hero's
   `a[href="#oferta"]`, focus `#f-name`, and type one character every 400ms for 31
   seconds. Assert that `#lead-modal` never loses `hidden` and that `#f-name` holds
   every character typed.
3. **The popup is unchanged for everyone else.** Both homepages, 1280×800, a fresh
   session each time:
   - with no click, an instant scroll to 60% depth opens `#lead-modal` within 1s;
   - with no click and no scroll, it opens after 31s;
   - once it has been closed, a click on a quote button does not reopen it.
4. **Watched failing first.** Check 1 on the current `main` build fails on all 24
   combinations, with focus on `#lead-phone` (measured above on live `ff102c6`).
   Check 3 passes on `main`.
5. `node scripts/verify-live.js` against the local build exits 0, and all `quality`
   gates exit 0, each read from its own process. After deploy, check 1 at 1280 is
   repeated on the live site with a cache-buster (R-P).
