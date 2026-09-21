# W25-11 · Eight fence models get a price, and the page gets shorter

Card W25-11. Branch `w25/w25-11-garduri-prices`, stacked on `w25/w25-10-dasterum-images`.
PR only, stops for the owner. **Text only. No Imperlux image file was fetched**: W25-R7
lifted the image ban for `dasterum.md` and for nothing else.

## What is published

`/servicii/modele-garduri/` showed "Preț la cerere" on all eight model cards. It now shows
the **de la** figure the `imperlux.md` garduri page publishes, read on 2026-09-21:

| Model | Material | Published |
|---|---|---|
| IL12 | Metal Plus | **De la 500 lei/m²** |
| IL12 | Metal PlusDV | **De la 680 lei/m²** |
| IL30 | Metal Plus | **De la 668 lei/m²** |
| IL30 | Metal PlusDV | **De la 822 lei/m²** |
| IL40 | Metal Plus | **De la 749 lei/m²** |
| IL40 | Metal PlusDV | **De la 926 lei/m²** |
| IL100 | Metal Plus | **De la 906 lei/m²** |
| IL100 | Metal PlusDV | **De la 1128 lei/m²** |

All eight, both locales. RU reads "От", which is the catalogue's own wording for the same
thing.

## What that page also carries, and what was left there

The `imperlux.md` garduri page carries three things **W25-R8 forbids copying and R-X's gate
refuses on this site**, and none of them is here:

- **struck prices** beside the current one (`602 lei - 102 lei/m²`, `742 lei - 74 lei/m²`);
- **percent badges** (`- 15 %`);
- a **limited-offer banner** ("OFERTE LIMITATE, 4 modele exclusive de gard la preț
  accesibil").

`scripts/check-scarcity.js` is green, which is the same line held from the other side.

**Nothing from an invoice is here either.** These are the supplier's public list prices,
which is what the ruling permits and all it permits.

## The price replaces the ask, and why not both

A card showing "De la 500 lei/m²" and "Preț la cerere" contradicts itself, so the price
takes the line. **A model with no `price_from` still falls back to the ask label**, so the
page cannot go silent if a price is ever removed from the data.

## The class, and the gate that caught the first attempt

The price line was first written as `.prod__price`, the catalogue card's own class, on the
reasoning that reusing a class is safer than inventing one. **Gate RC-129 took that red at
once**: it confines the price-on-request markup and `.prod__price` to a catalogue category
page and counts them anywhere else, and it reported 8 elements on each locale's fence page.

The class is now **`.nvk__price`**, this component's own prefix, grepped free across
`src/styles.css`, `build.js`, `src/main.js` and every script before it was written, which is
what rule 3.1 asks for. Gate 22 is green on the stylesheet.

**Worth recording because it cuts against the instinct**: rule 3.1 says a new prefix is a
risk, and here reusing an existing one was the risk, because a class can carry a rule as
well as a look.

## The page got shorter, and the budget went with it

| Page | Before | After |
|---|---|---|
| `/servicii/modele-garduri/` | 3,720 | **3,686** |
| `/ru/servicii/modele-garduri/` | 3,742 | **3,707** |

**34px shorter.** `.nvk__price` does not carry the 44px flex min-height that `.prod__price`
and `.prod__ask` share on a catalogue card, where a price sits beside a 44px button. There
is no button here.

**The budgets fall with the measurement**, 3,780 to 3,746 and 3,802 to 3,767, and
`docs/rulings/R-Y.md` records both. R-Y's own rule is that removing an element's cost drops
the budget by that cost: a budget left high is a ceiling to hide under.

## Gates

**22 of 22 exit 0**, from `node scripts/run-gates.js`.

## Recorded for ratification

1. **The price replaces "Preț la cerere" on this page**, rather than sitting beside it.
2. **`.nvk__price` is a new class.** The first attempt reused `.prod__price` and gate RC-129
   refused it.
3. **Two budgets were lowered**, which is the first time this build has lowered one.
