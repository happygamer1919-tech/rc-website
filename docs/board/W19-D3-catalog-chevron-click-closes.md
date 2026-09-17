# W19-D3 · Desktop catalog: clicking a category's chevron closes the subcategories it is meant to open

| | |
|---|---|
| Found by | Critic, wave 19 boundary, 2026-09-16 |
| Live build | `47957f3`, `https://rapidconstruct.md` |
| Severity rank | 1 of 5 |
| Mode | Not assigned by the critic |

## What a visitor sees

On a desktop or laptop with a mouse, a visitor opens **Catalog**, moves to
"Sisteme de termoizolație" (or "Vopsele") and clicks the **›** chevron. The
subcategory list vanishes. A second click brings it back. The one visible control
for "show subcategories" hides them on the first click.

## Why it happens

`src/main.js`, the W14-06 catalog block. A parent row opens its subcategories on
`mouseenter` wherever `(hover: hover) and (min-width: 769px)` matches. The
chevron's `click` handler toggles: if the list is visible, it closes it. A mouse
cannot reach the chevron without first entering its row, so by the time the click
lands the hover has already opened the list, and the click closes it.

## Evidence, measured on the live site

Headless Chrome, real `Input.dispatchMouseEvent` moves and clicks, the first parent
row, `matchMedia('(hover: hover) and (min-width: 769px)').matches === true`:

| Page, width | Pointer on row | Pointer on chevron | Click chevron | Click again |
|---|---|---|---|---|
| `/` at 1280 | open, 6 links | open, 6 links | **closed, 0 links** | open, 6 links |
| `/ru/` at 1920 | open, 6 links | open, 6 links | **closed, 0 links** | open, 6 links |
| `/servicii/garduri/` at 1024 | open, 6 links | open, 6 links | **closed, 0 links** | open, 6 links |

Not affected, and must stay that way:

- **Keyboard.** Focus on the chevron, Enter: opens (`aria-expanded="true"`). Enter
  again: closes.
- **Phone.** At 390px the chevron opens the drill-down and "Înapoi" / "Назад"
  returns to the 7 categories, both locales.

## Scope

The catalog panel on every template that carries it, both locales, viewports wider
than 768px with a hover-capable pointer.

## Fix direction, non-binding

A chevron click on a row whose list is already showing should leave it showing.
Closing stays available the ways it already works: moving to another row, Escape,
clicking outside, and the keyboard toggle.

## Acceptance, machine-checkable

Run in headless Chrome against a local build (`node build.js`, `dist/` served at the
site root), mouse events via CDP, `mobile: false`. For each combination of pages
`/`, `/ru/`, `/servicii/garduri/`, `/ru/catalog/vopsele/` and widths 1024, 1280 and
1920:

1. **Precondition, asserted, never assumed:**
   `matchMedia('(hover: hover) and (min-width: 769px)').matches === true`. If
   false, the run is invalid and fails, because the hover path was not exercised.
2. Click `#catalog-toggle`. Assert `#catalog-panel` has no `hidden` attribute.
3. For **each** `.catalog__row--parent` in the top list:
   - move the pointer to the row's label centre, then to the centre of its
     `.catalog__expand`;
   - click `.catalog__expand` once.
   - Assert: that button's `aria-expanded === "true"`, its `.catalog__sub` has no
     `hidden` attribute, and at least one `.catalog__sub a` has a non-zero
     bounding box.
4. **Keyboard, unchanged.** Pointer parked outside the panel (for example at the
   bottom-right corner). Focus the first `.catalog__expand` and press Enter with
   `text: "\r"`. Assert `aria-expanded === "true"`. Press Enter again. Assert
   `"false"`.
5. **Phone, unchanged.** At 390px with `mobile: true`, on `/` and `/ru/`:
   - tap the first `.catalog__expand` and assert its `.catalog__sub` is visible;
   - tap its `.catalog__back` and assert 7 top-level category links are visible.
6. **Watched failing first.** Steps 1 to 3 run against the current `main` build must
   fail at step 3, with `aria-expanded === "false"` after the click. A run that has
   never failed on `main` is not evidence (ruling R-AB, section 13).
7. All `quality` gates exit 0, each read from its own process.

Every one of the 12 page and width combinations, and every parent row, must pass.
The report names each combination with its result.
