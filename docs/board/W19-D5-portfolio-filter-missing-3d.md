# W19-D5 · Homepage portfolio: the 3D project has no filter chip, so no filter can show it

| | |
|---|---|
| Found by | Critic, wave 19 boundary, 2026-09-16 |
| Live build | `47957f3`, `https://rapidconstruct.md` |
| Severity rank | 5 of 5 |
| Mode | Not assigned by the critic |

## What a visitor sees

"Proiecte recente" / "Недавние проекты" shows six project cards and a row of
filter chips. The sixth card is **"Randare 3D, hol cu tavan în trepte"**, labelled
"Proiectare și vizualizare 3D". **There is no chip for that category.** Every chip
except "Toate" / "Все" hides it. A filter bar that cannot select one of the cards
it filters does not behave as it looks.

## Why it happens

The chips are hardcoded in `src/template.html` with six `data-filter` values: `all`,
`case-la-cheie`, `acoperisuri`, `fatade`, `reparatii` and `finisaje`. The cards are
rendered from `content/projects.json`, and the data now includes a `proiectare-3d`
project the template never gained a chip for. Nothing checks that the two agree.

## Evidence, measured on the live site

- **Live HTML.** On each homepage: 6 `article.project` cards read, with categories
  `case-la-cheie`, `acoperisuri`, `fatade`, `reparatii`, `finisaje` and
  `proiectare-3d`. The chips cover `all` plus five of them. **Missing on `/` and
  `/ru/`: `proiectare-3d`.**
- **Headless Chrome, real clicks, both locales.** Each of the six chips was clicked.
  Each category chip shows exactly 1 card, "Toate" / "Все" shows 6, and no chip
  shows the 3D card except "Toate" / "Все".

## Scope

The portfolio filter on `/` and `/ru/`.

## Fix direction, non-binding

Give every rendered project category a chip, either by adding one or by generating
the chip row from the categories actually rendered. The chip label must come from an
existing string, not new copy (`docs/CLAUDE.md` section 5): both locales already name
this service, "Proiectare și vizualizare 3D" / "Проектирование и 3D-визуализация".

## Acceptance, machine-checkable

1. **Build-time or built-site assertion**, on `dist/index.html` and
   `dist/ru/index.html`:
   - read every `article.project` and its `data-cat`;
   - fail if zero cards are read, or if any card has no `data-cat`;
   - fail if any `data-cat` value has no `button.filter` with the same `data-filter`.
   - Print the cards read, the categories and the chips.
2. **Watched failing first.** The assertion run on the current `main` build fails
   naming `proiectare-3d` on both pages.
3. **A negative arm**, in a scratch copy: a project with a new category and no chip
   makes the assertion fail on that category's name.
4. **Browser, both locales, at 390 and 1280**, with real clicks on each chip:
   - `Toate` / `Все` shows every card;
   - every other chip shows at least 1 card;
   - `#portfolio-empty` stays hidden;
   - the `proiectare-3d` chip shows the 3D card.
5. RO and RU carry the same number of chips (`docs/CLAUDE.md` section 8). All
   `quality` gates exit 0, each read from its own process.
