# W25-21 · The intake the folders were waiting for, and nothing to take in yet

Card W25-21. Branch `w25/w25-21-intake`, stacked on `w25/w25-20-ct80f-and-reuse`. PR only,
stops for the owner.

## What this ships

**`scripts/intake-owner-pics.js`**, and **nothing was taken in**, because both folders hold
only their `README.txt`.

That is the card's actual finding and it is not a failure: the dispatch says *"missing files
are listed, not an error"*. What W25-16 left was two folders, two READMEs and a generated
list, **and no way to take a drop in**. A folder nobody can empty is a folder that fills up.

## The four prompts, verbatim

Reproduced below exactly as `~/Documents/rc-audit-w24/AI-PROMPTS-W25.md` prints them, with
the ratio and the minimum size the dispatch asks for. They are the whole priority batch that
is left: `GARDB-01` to `GARDB-04` left it at W25-18 by being filled.

### `ACOP-01`

- **File to save:** `ACOP-01.png` in `/Users/ivan/RC-pics-ai/`
- **Aspect ratio:** 5 / 6
- **Minimum pixels:** 1000x1200
- **Renders on:** /servicii/acoperisuri/

```
Tigla metalica: un acoperis terminat cu tigla metalica, vedere de ansamblu, format PORTRET (tila inalta a bento-ului). Flat overcast daylight, plain and orderly, nothing staged. No brand marks, no logos, no printed text, no people's faces, no company signage.
```

### `ACOP-02`

- **File to save:** `ACOP-02.png` in `/Users/ivan/RC-pics-ai/`
- **Aspect ratio:** 7 / 2
- **Minimum pixels:** 1750x500
- **Renders on:** /servicii/acoperisuri/

```
Roca vulcanica Novatik: un acoperis cu tigla Novatik, cadru LAT si jos (tila panoramica), cu cer deasupra. Flat overcast daylight, plain and orderly, nothing staged. No brand marks, no logos, no printed text, no people's faces, no company signage.
```

### `ACOP-03`

- **File to save:** `ACOP-03.png` in `/Users/ivan/RC-pics-ai/`
- **Aspect ratio:** 7 / 4
- **Minimum pixels:** 900x520
- **Renders on:** /servicii/acoperisuri/

```
Calcularea pretului: santier de acoperis cu masuratori in curs, ruleta sau plan pe masa. Orizontal. Flat overcast daylight, plain and orderly, nothing staged. No brand marks, no logos, no printed text, no people's faces, no company signage.
```

### `ACOP-04`

- **File to save:** `ACOP-04.png` in `/Users/ivan/RC-pics-ai/`
- **Aspect ratio:** 7 / 4
- **Minimum pixels:** 900x520
- **Renders on:** /servicii/acoperisuri/

```
Reduceri: material de acoperis stivuit in depozit sau pe santier. Orizontal. Fara pret, fara eticheta, fara procent in cadru. Flat overcast daylight, plain and orderly, nothing staged. No brand marks, no logos, no printed text, no people's faces, no company signage.
```

**The four ratios are not the same and each prompt names its own.** A 1750x500 panorama
generated square is unusable, and `ACOP-02` is the one that asks for one.

## The intake

**The filename is the slot id, exactly.** That is the rule both READMEs state and the rule
`docs/OWNER-INTAKE-W25.md` is generated to preserve, and it is the whole matching logic:
`ACOP-02.png` fills `ACOP-02` and nothing else. **A stem that is not a slot id is reported,
never guessed at**, because a guess here puts a photograph of one thing on a card for
another.

**Which folder decides the origin, and the origin decides what is allowed.**

| Folder | Provenance origin | Needs | Allowed where |
|---|---|---|---|
| `RC-pics-real` | R-W client-supplied | `--who "<name>"` | every slot, evidence slots included, because a photograph IS evidence |
| `RC-pics-ai` | W25-R3 generated | `--tool "<name>"` | not on `BA-`, `PROJ-`, `PORT-` (W25-R3), not on a named tile (W25-R2) |

**It writes nothing without `--apply`**, and even then it installs through
`scripts/process-packshot.js`, which is the one thing in this repo that writes into
`public/img/` and the one thing that strips metadata and then ASSERTS the strip. Nothing
here re-encodes an image itself.

**A file lands in a folder named after what it is**: `garduri`, `acoperisuri`, `copertine`,
`before-after`, and `catalog` as the fallback, which is also the truth for every `CAT-` and
`CATEG-` slot. A hub tile filed under `catalog/` is a file nobody finds again.

## Nineteen arms, three of them green

Every branch of the judgement is watched before the script will run at all, and the run
prints the count.

| Arm | What it plants |
|---|---|
| `unknown-slot` | a stem that is no slot |
| `already-filled` | a slot that already has a reviewed picture |
| `not-an-image` | a `.png` that is really an HTML error page |
| `under-floor` | 449 on the longest side |
| `generated-on-evidence` | a generated image on `BA-99-before` |
| `generated-on-tile` | a generated image on `NVK-99` |
| **GREEN** | a generated image on an ordinary product slot |
| **GREEN** | a **real photograph** on an evidence slot |
| **GREEN** | 450 on the longest side, the other side of the floor |
| 10 more | the folder mapping, one per prefix, fallback included |

**The second green arm is the one that matters most.** A real photograph on a `BA-` slot is
exactly what an evidence slot is for, and a script that read the prefix without reading the
folder would have refused it. The arm is the difference between the two being read.

## It was proved, not asserted

The apply path was run end to end on a throwaway copy, with the three paths pointed at a
scratch folder and a scratch ledger by environment, which is the only reason those overrides
exist:

- a planted 900x520 PNG went in as `ACOP-03.png`;
- it installed as `public/img/acoperisuri/ACOP-03.jpg`, 600x346, metadata none;
- the ledger row flipped to `filled`;
- the provenance row was appended, naming the tool and the date;
- **`node build.js` then FAILED**, `slot "ACOP-03" is filled and has no alt text for ro`.

That last one is the design, stated rather than discovered: the script does not write alt
text, `build.js` refuses a `TODO:` string, and **the failing build is the reminder**.

**And `--who "Popescu, Ion"` was watched refuse.** R-W's client-supplied source cell is
`client direct transfer, <name>, DD.MM.YYYY` exactly, so a comma in the name moves the date
into the wrong cell and the provenance gate fails afterwards, on a commit, instead of here,
before one. `--who "Ion Popescu"` was watched pass in the same run.

Everything the proof wrote was removed and the tree is clean.

## Gates

**24 of 24 gate commands exit 0**, from `node scripts/run-gates.js --keep-going`. Nothing
about the built site changed: no image was added, no ledger row moved, and gate 19 reads the
same `283 of 337` W25-20 left.

`docs/OWNER-INTAKE-W25.md` is regenerated. Its second line said *"Nothing has been taken in.
W25-16 prepared the folders and stopped"*, which stopped being the useful sentence the moment
a script existed; it now says what to run. Both `README.txt` files say the same.

## Still waiting, listed rather than failed

**54 slots**, and the run prints every one with its ratio, its minimum and the page it
renders on. The four `ACOP-` above are the priority batch; the rest are the four Novatik
tiles, the four `ACTM-` metal tile models, the copertine hero and cross-sell, the eight
before/after, the eight category tiles and the catalogue remainder.

## Recorded for ratification

1. **The intake reports by default and writes only on `--apply`.** A tool that installs on
   sight is a tool that puts a picture on the site nobody read the provenance of.
2. **A real photograph is allowed on an evidence slot and a generated image is not.** The
   folder is what tells them apart, and a green arm watches it.
3. **The script does not write alt text, and `build.js` refuses `TODO:`.** The failing build
   is the reminder, on purpose.
