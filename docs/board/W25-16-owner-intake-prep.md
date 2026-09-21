# W25-16 · Two folders, two lists, and nothing taken in

Card W25-16. Branch `w25/w25-16-owner-intake-prep`, stacked on
`w25/w25-15-ct80f-duplicate`. PR only, stops for the owner.

**Nothing was taken in.** The dispatch says to prepare and stop, and that is what happened.

## The folders

| Folder | State | For |
|---|---|---|
| `/Users/ivan/RC-pics-real/` | **created** | a real photograph, taken by the owner or from the project set |
| `/Users/ivan/RC-pics-ai/` | **created** | an image generated from the prompt pack |

**The second was not in the dispatch and was absent.** The prompt pack has named
`/Users/ivan/RC-pics-ai/` as its intake folder since W25-05 and the dispatch says the owner
will drop AI images there, so it existing is the difference between that instruction working
and not. Recorded for ratification below.

Each carries a `README.txt` with the naming rule, the floor, which folder is which and what
is waiting for it, so the rule is beside the files rather than only in the repo.

## The two lists

`docs/OWNER-INTAKE-W25.md`, generated and held by **gate 25**. It is generated for the
reason that matters here: **the intake matches on the filename being the slot id exactly**,
so a slot id typed by hand into that document is a file nothing will ever find. The model
names come from `content/garduri-modele.json` and the tile labels from the **built** pages,
so a label is the words a visitor reads rather than a description of them.

### (a) Fence model cards, 8, real photographs

| File | Model | Page |
|---|---|---|
| `GARD-01.jpg` | IL12 Metal Plus | `/servicii/modele-garduri/` |
| `GARD-02.jpg` | IL12 Metal PlusDV | `/servicii/modele-garduri/` |
| `GARD-03.jpg` | IL30 Metal Plus | `/servicii/modele-garduri/` |
| `GARD-04.jpg` | IL30 Metal PlusDV | `/servicii/modele-garduri/` |
| `GARD-05.jpg` | IL100 Metal Plus | `/servicii/modele-garduri/` |
| `GARD-06.jpg` | IL100 Metal PlusDV | `/servicii/modele-garduri/` |
| `GARD-07.jpg` | IL40 Metal Plus | `/servicii/modele-garduri/` |
| `GARD-08.jpg` | IL40 Metal PlusDV | `/servicii/modele-garduri/` |

All eight portrait, ratio `4 / 5`, minimum 1000x1250.

### (b) Hub tiles, 8, the priority batch

| File | Tile | Page | Ratio | Minimum |
|---|---|---|---|---|
| `ACOP-01.png` | Țiglă metalică | `/servicii/acoperisuri/` | 5 / 6 | 1000x1200 |
| `ACOP-02.png` | Rocă vulcanică Novatik | `/servicii/acoperisuri/` | 7 / 2 | 1750x500 |
| `ACOP-03.png` | Calculează prețul acoperișului | `/servicii/acoperisuri/` | 7 / 4 | 900x520 |
| `ACOP-04.png` | Reduceri | `/servicii/acoperisuri/` | 7 / 4 | 900x520 |
| `GARDB-01.png` | Garduri tip jaluzele | `/servicii/garduri/` | 5 / 6 | 1000x1200 |
| `GARDB-02.png` | Calculează prețul gardului | `/servicii/garduri/` | 7 / 2 | 1750x500 |
| `GARDB-03.png` | Modele de garduri | `/servicii/garduri/` | 7 / 4 | 900x520 |
| `GARDB-04.png` | Prețuri și oferte | `/servicii/garduri/` | 7 / 4 | 900x520 |

**The four ratios are not all the same**, and each prompt in the pack names its own. A
1750x500 panorama generated square is a picture that cannot be used.

## Gate 25, and what it refuses

It fails when a listed slot has no ledger row, when a slot is **already filled** and
therefore does not belong on a waiting list, when a hub slot renders on no built page or
with no label beside it, and when either list is not the eight it must be. Those are the
ways this document could become quietly wrong while still looking right.

## Gates

**24 of 24 exit 0**, from `node scripts/run-gates.js`. Gate 25 is new and reads
`8 fence cards, 8 hub tiles, file matches the data`.

## Recorded for ratification

1. **`/Users/ivan/RC-pics-ai/` was created too.** The dispatch names only `RC-pics-real`, and
   the AI folder the prompt pack has been pointing at since W25-05 did not exist.
2. **Both folders carry a `README.txt`.** Nothing reads them; they are for the person
   standing in the folder rather than in the repo.
