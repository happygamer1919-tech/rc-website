# W19-D10 · On a phone held sideways, the catalog list runs off the bottom of the screen and its last categories cannot be reached

| | |
|---|---|
| Found by | Critic, wave 19 boundary, second pass, 2026-09-17 |
| Live build | `ff102c6`, `https://rapidconstruct.md` |
| Severity rank | 5 of 5 in this pass |
| Mode | Not assigned by the critic |

## What a visitor sees

A visitor turns their phone sideways and taps **Catalog**. The list of seven
categories opens under the header and runs past the bottom of the screen.
Scrolling does not help: the page behind the list moves, and the list stays where it
is. "Alte materiale de construcții" / "Другие строительные материалы" cannot be
tapped. On the narrowest landscape phones, "Sisteme de iluminare" / "Системы
освещения" cannot be tapped either.

A real browser's address bar takes more height than the emulated viewports below,
so on a real phone the cut is at least this large.

## Why it happens

`src/styles.css`, the W14-06 catalog block. Above 768px, `.catalog__panel` is
`position: absolute` inside the fixed `.header`, with no height limit and no
scrolling of its own. Its bottom edge sits 447px from the top of the viewport. The
phone treatment (a fixed full-height sheet with `overflow-y: auto`) applies only at
`max-width: 768px`. A landscape phone is wider than 768px but only 375 to 430px
tall, so it gets the desktop panel on a screen shorter than the panel.

Portrait phones and tablets get the scrolling sheet and are fine. So are laptops and
desktops, because their screens are taller than the panel.

## Evidence, measured on the live site

Headless Chrome, `mobile: true` with touch below 1280. Catalog opened by a tap or a
click. For each of the seven top-level `.catalog__link`: `scrollIntoView({ block:
'nearest', behavior: 'instant' })`, then `elementFromPoint` at the link's centre
must be the link and inside the viewport. Pages `/`, `/ru/`, `/servicii/garduri/`
and `/ru/catalog/vopsele/`. **40 combinations read, 16 failing.**

| Viewport | Typical device, landscape | Result on all 4 pages | Categories that cannot be tapped |
|---|---|---|---|
| 812×375 | iPhone X to 13 mini | fail | Sisteme de iluminare; Alte materiale de construcții |
| 844×390 | iPhone 12 to 14 | fail | Alte materiale de construcții |
| 896×414 | iPhone XR, 11 | fail | Alte materiale de construcții |
| 915×412 | Pixel 7 | fail | Alte materiale de construcții |
| 932×430 | iPhone 14 Pro Max | pass | |
| 1024×600 | small tablet | pass | |
| 390×844, 768×1024 | portrait phone, tablet | pass (scrolling sheet) | |
| 1280×720, 1920×960 | laptop, desktop | pass | |

The RU pages fail on the same rows, with the RU labels. A landscape phone narrower
than 769px, such as 740×360, gets the phone sheet instead. Its last two rows also
start below the fold there, but the sheet scrolls them into reach, which is the
behaviour the wider landscape phones lack.

## Scope

The catalog panel on every template that carries it, both locales, on viewports
wider than 768px and shorter than the panel.

**W19-D3 touches the same block of `src/main.js`**, the chevron click on desktop.
The two cards should not be worked in parallel branches.

## Fix direction, non-binding

Either limit the panel, and an open subcategory list, to the height left under the
header, with its own vertical scrolling, or give short touch viewports the phone
sheet. The desktop flyout at 1280×720 and up must not change, and neither must the
portrait sheet.

## Acceptance, machine-checkable

Headless Chrome against a local build.

1. **Every category is reachable.** Viewports 812×375, 844×390, 896×414, 915×412,
   932×430, 1024×600, 390×844, 768×1024, 1280×720 and 1920×960. `mobile: true` and
   touch below 1280, mouse at 1280 and up. Pages `/`, `/ru/`, `/servicii/garduri/`
   and `/ru/catalog/vopsele/`. **40 combinations**; print the count and fail if fewer.
   - Open `#catalog-toggle` by tap or click, and assert `#catalog-panel` has no
     `hidden` attribute.
   - For every top-level `.catalog__link`: `scrollIntoView({ block: 'nearest',
     behavior: 'instant' })`. Assert its centre is inside the viewport and
     `document.elementFromPoint` there returns the link or a descendant.
2. **Every subcategory is reachable**, at the six viewports from 812×375 to
   1024×600. Tap each `.catalog__expand`, then apply check 1's assertion to every
   link in that row's `.catalog__sub`.
3. **Nothing else moved.** At 1280×720 and 1920×960, the bounding box of
   `#catalog-panel`, and of each `.catalog__sub` opened by hover, equals `main`'s
   within 1px. At 390×844 and 768×1024, the sheet's bounding box equals `main`'s.
4. **Watched failing first.** Check 1 on the current `main` build fails on exactly
   the 16 combinations in the table above, naming those categories.
5. All `quality` gates exit 0, each read from its own process, including
   `node scripts/check-header-fit.js`.
