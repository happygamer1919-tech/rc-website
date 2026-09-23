# W27-FIX-10 · "Calculează prețul acoperișului" opens the "in construcție" page

Card W27-FIX-10. Branch `w27/w27-fix-10-roof-calc-tile`, from `main` after #161.

## What this does

Your instruction: the roofing hub's "Calculează prețul acoperișului" tile opened the metal tile
models. It now opens the "În construcție" page, the same page the fence calculator tile opens.
Nothing else on the hub changes.

## What to look at

`https://rapidconstruct.md/servicii/acoperisuri/`, third tile: lands on "În construcție". Same on
the Russian page.

## Heights

None move.

## Gates

Static gates and the hub tile link gate exit 0. CI runs the full 29.
