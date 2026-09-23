# W28-12 · The quote button after the portfolio

Card W28-12. Branch `w28/w28-12-home-cta`, stacked on W28-11 (#169). Under the wave 28 dispatch.

## What this card does

A full-width orange "Solicită ofertă" / "Запросить предложение" button at the foot of the
"Proiecte recente" section on the home page, in both languages, in the same style as the header's
button. It scrolls to the quote form.

## What to look at

`https://rapidconstruct.md/` and `/ru/`: scroll past the six project cards and the "100+" tile;
the orange button spans the width and opens the form.

## A note on the count

The page has five links to the form now (the header button, its copy in the phone menu, the
button in the hero card, this one, and the footer's). The three the card counts are the
section-level ones you named: header, after portfolio, footer. The hero card's button and the
phone menu's copy were there before and are not touched.

## Heights

Home pages 80px taller in both languages; two budgets move (R-Y).

## Gates

All 29 gate commands exit 0 locally (`node scripts/run-gates.js --keep-going`). CI runs the full 29
on the pull request.
