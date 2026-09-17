# W19-D8 · The homepage quote form cannot name three of the services the site sells: metal tile, carports and fences

| | |
|---|---|
| Found by | Critic, wave 19 boundary, second pass, 2026-09-17 |
| Live build | `ff102c6`, `https://rapidconstruct.md` |
| Severity rank | 3 of 5 in this pass |
| Mode | Not assigned by the critic |

## What a visitor sees

On `/`, the quote form asks **"Tipul lucrării"**. Its list offers nine services
and "Altceva". The Servicii menu at the top of the same page offers twelve. A
visitor who came for a fence, a carport or metal tile cannot pick it. They have to
choose "Altceva" ("something else"). The owner then receives a lead that says
"something else" for a product with its own page on the site.

The same holds on `/ru/`: "Тип работ" has no Металлочерепица, Навесы or Заборы.

## Why it happens

`src/template.html` hardcodes the list as `form.options.0` to `form.options.9`.
Wave 14 added the three product pages, `/servicii/tigla-metalica/`,
`/servicii/copertine/` and `/servicii/garduri/`, and wave 15 (RC-126) added them to
the Servicii menu. The form list was never extended, and nothing checks that the
two agree. It is the same shape as W19-D5, the portfolio chips.

The forms on the three product pages are fine. They have no list, and they send a
hidden `serviciu` field naming the page ("Garduri" and so on). Only the homepage
form is affected.

## Evidence, measured on the live HTML

`/` and `/ru/`, fetched with a cache-buster. Options read excludes the
`value=""` placeholder.

| Page | Options read | Servicii menu links to a `/servicii/<slug>/` page | Menu services with no option of the same name |
|---|---|---|---|
| `/` | 10 | 12 | Țiglă metalică, Copertine, Garduri |
| `/ru/` | 10 | 12 | Металлочерепица, Навесы, Заборы |

The other nine option labels are identical, character for character, to the
menu's labels in both locales. The three missing labels are therefore existing
strings, not new copy.

## Scope

`#f-type` in the quote form on `/` and `/ru/`.

## Fix direction, non-binding

Add the three services to the list using the menu's own labels, with "Altceva" /
"Другое" kept last. Alternatively, render the options from the same source as the
Servicii menu, so a fourth product page cannot repeat this. Order is the owner's
call. A reasonable default is the menu's order.

If the owner rules that the list is deliberately the nine construction services,
record that in `DECISIONS.md` and close this card with no code change.

## Acceptance, machine-checkable

1. **Built-site assertion**, on `dist/index.html` and `dist/ru/index.html`:
   - read every `a.svcmenu__link` whose `href` is a `/servicii/<slug>/` page (RU:
     `/ru/servicii/<slug>/`). Fail if zero are read;
   - read every `#f-type option` except the `value=""` placeholder. Fail if zero are
     read;
   - fail if any menu label has no option with identical trimmed text;
   - print the menu labels and the options.
2. **Watched failing first.** The assertion on the current `main` build fails naming
   Țiglă metalică, Copertine and Garduri on `/`, and Металлочерепица, Навесы and
   Заборы on `/ru/`.
3. **A negative arm**, in a scratch copy: removing any one option makes the
   assertion fail on that label.
4. RO and RU have the same number of options, and "Altceva" / "Другое" is the last
   one. Both locale files change in the same commit (`docs/CLAUDE.md` section 8).
5. **The value is sent.** Headless Chrome, `/` and `/ru/`, at 390 and 1280. Replace
   `window.fetch` in the page with a stub that records its `FormData` and resolves
   `{ success: true }`, so nothing leaves the page. Fill the name and phone, tick
   the consent box, choose "Garduri" / "Заборы" and submit. Assert that the recorded
   `tip_lucrari` equals the chosen label, and that the success message is shown.
6. **If the owner keeps the list as it is**, checks 1 to 5 are replaced by a
   `DECISIONS.md` entry quoting the ruling.
7. `node scripts/check-links.js` exits 0, and all `quality` gates exit 0, each read
   from its own process.
