# W25-24 · Every hub tile opens something, and a gate that says what it cannot see

Card W25-24. Branch `w25/w25-24-hub-tiles`, stacked on `w25/w25-23-homepage-teaser`. PR only,
stops for the owner.

## What this ships, and what it does not

**Shipped:** every one of the sixteen hub tiles now has a destination, the Garduri "tip
jaluzele" tile opens the models page, `.hub__tile--inert` is gone, and **gate 26** holds all
of it.

**Not shipped, and blocked on the owner: the eight tile images.** W25-R19's premise is gone.
**Q-W25-18** carries the measurement and four options. Nothing was taken from `imperlux.md`
for those slots.

## W25-R19's premise, measured

The ruling says the eight tiles take *"the exact images imperlux.md shows on its Acoperisuri
and Garduri 4-tile sections"*. **Both sections have been rebuilt and neither exists today.**
Fetched and rendered on 2026-09-22:

| Our tile label | On the matching imperlux page |
|---|---|
| Țiglă metalică | 1 hit, inside a meta description |
| Rocă vulcanică | 0 |
| Calculează prețul acoperișului | 0 |
| Reduceri | 1 hit, inside a promo line |
| Garduri tip jaluzele | 1 hit, as the page's `h1` |
| Calculează prețul gardului | 1 hit, a calculator heading |
| Modele de garduri | 0 |
| Prețuri și oferte | 0 |

`/acoperisuri/` now carries a **five**-tile product section; `/garduri/` carries a hero, a
three-card works strip and an "OFERTE LIMITATE" block. **Two of our eight have an obvious
counterpart** and six have none.

**And the fence block is one this site may not copy from anyway.** It carries a live
countdown, `-17%` and `-10%` badges, struck prices and "Stoc limitat: doar 3 modele la preț
promoțional". R-X forbids every one of those here and `check-scarcity.js` gates it. Its images
are also the same 1296x1600 louvre renders W25-18 already put on the eight `GARD-` cards, so
taking them again would be one picture on two slots.

Filling eight slots with pictures this terminal chose is exactly what W25-R19's wording
forbids, so the card stops there and asks.

## The "dead" tile was not a broken link

`bento.fenceJaluzele` pointed at `#garduri`. **That anchor resolves**, in both locales, in the
local build and on the live site: `id="garduri"` is the "Cum alegi gardul" section, 3.5KB
further down the same page. `scripts/check-links.js` passed it and was right to.

What was wrong with it is not something a link checker can see: **a tile the size of a
photograph moved a visitor a little way down the page they were already on.** It opens
`/servicii/modele-garduri/` now, in both locales, as instructed.

**Reported rather than fixed: tile 3 already opens that page**, so the Garduri hub now has two
tiles with one destination. Repointing tile 3 is a product decision and is the owner's; the
PR checklist carries it.

## The two inert tiles got destinations

W25-R24 says every hub tile has an href. Two had none and rendered as a `<div>`:

| Tile | Now opens |
|---|---|
| `ACOP-04` Reduceri | `#acoperisuri`, the four roofing offers, which are what "Reduceri" means on this page |
| `GARDB-04` Prețuri și oferte | `#oferta`, the quote form, which is where a price is asked for |

**`bentoSection`'s assertion is inverted, not deleted.** It required *exactly one* inert tile,
which was W24-07's design and is now the thing the ruling forbids; it requires *zero*.

**`.hub__tile--inert` is deleted, and so is the branch that emitted it.** The class set
`cursor: default`, the only thing that ever told a visitor a tile was not a link. A rule
waiting for a state the build now refuses is a rule that styles nothing, and a render branch
that can never be taken is markup the stylesheet has to keep a rule for.

## Gate 26, and the thing it says it cannot see

`node scripts/check-hub-tile-links.js`. Sixteen tiles, four pages, both locales. A path href
must be a page this build emits; a fragment must name an id that exists on the page it lands
on. No browser and no network: the site is static, so a path answers 200 exactly when `dist`
holds the file, and asking the live site would test the last deploy rather than this build.

**It is its own gate rather than a clause of gate 20**, which measures painted boxes and takes
no view on hrefs.

**Its first version refused a same-page anchor by kind, and thereby refused two tiles the
owner had just been given.** That is a rule written tighter than the ruling it enforces:
W25-R24 says "an href that answers 200", and the page a same-page anchor sits on answers 200.
So they are permitted, and every one is **printed, named and counted on every run**:

    same-page anchors: 4 of 16 tiles. They resolve and W25-R24 permits them; no machine
    can tell one that is useful from one that is not.

**Which means gate 26 would not have caught the defect that created it**, and it says so in
its own header rather than leaving that to be discovered. `#garduri` resolved. Four lines of
output, and the owner decides.

**Seven arms, two of them GREEN**, between two clean controls: no href, a dead path, a dead
fragment on another page, a dead fragment on its own page, an href that is not a site path, a
hub with the wrong tile count; and the two greens, a cross-page fragment that resolves and a
same-page anchor that resolves. **The second green arm is the one the first version got
wrong.**

## Gates

**25 of 25 gate commands exit 0**, up from 24: gate 26 is new. `docs/CLAUDE.md` numbers 26
gates now and says to report the number `run-gates.js` prints.

**No height moved.** `/servicii/garduri/` reads 5,547 against its 5,728 budget and
`/servicii/acoperisuri/` 16,904 against 16,964, both unchanged: an href is not geometry, and
the only thing `.hub__tile--inert` carried was a cursor.

## Recorded for ratification

1. **Gate 26 permits a same-page anchor and prints every one.** Refusing them by kind was
   stricter than W25-R24 and refused two tiles this card had just been told to create.
2. **A gate that cannot see the defect that created it should say so**, in its own header.
3. **The Garduri hub has two tiles opening one page**, by instruction. Tile 3 is the one to
   move if that is wrong.
