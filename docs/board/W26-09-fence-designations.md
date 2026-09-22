# W26-09 · The last competitor model code on the site, replaced by ours

Card W26-09. Branch `w26/w26-09-fence-designations`, stacked on
`w26/w26-08-before-after`. PR only, stops for the owner.

**Inserted at the owner's request mid-dispatch**, outside the W26-01 to W26-07 list.

## What ships

**The four fence models render `RC12`, `RC30`, `RC40` and `RC100`.** They read `IL12`,
`IL30`, `IL40` and `IL100`, which are `imperlux.md`'s designations, taken with the rest of
the model facts under W24-R6 and the owner override W25-R15.

**Zero competitor model codes remain anywhere in `dist/`.** Measured, not assumed.

## This is not new policy, it is the policy finally applied here

**`content/copertine.json` was de-badged at W14-23**, where the source's `IL301` to `IL311`
became `C-01` to `C-12`, and `build.js` has refused an IL code in that file ever since with
the message *"Models use Rapid Construct designations"*. **The fence file was the last place
one of those codes rendered**, and nothing in the repo stopped it.

So the card ships the guard too, and the guard is the substance:

```
if (/\bIL\s?\d{2,3}\b/i.test(JSON.stringify({ models, palette }))) die(...)
```

**Two digits or three.** The copertine guard reads `\d{3}`, and against this file that
would have let `IL12`, `IL30` and `IL40` straight back in and caught only `IL100`. A guard
copied without reading the data it is copied onto is worse than no guard: it reports clean.

**It reads the models and the palette, never the `_note` or the `source` block.** Those name
the source on purpose, and the amendment in the note names the old codes so a reader can see
what changed. A guard that fired on its own documentation would be switched off within a
week.

### Watched fire, and watched permit

| Arm | Result |
|---|---|
| CONTROL before | exit 0, clean |
| A two-digit designation, `IL12` | exit 1, the guard's own message |
| A three-digit designation, `IL301` | exit 1 |
| An IL code hiding in a **style label** | exit 1 |
| An IL code hiding in a **palette colour name** | exit 1 |
| **GREEN: the `_note` naming `IL12` and `IL301`** | **exit 0, permitted** |
| CONTROL after | exit 0, clean |

The two hiding arms are the point of testing the serialised object rather than the
designation field: a code can arrive in any string in the file. The green arm is the one
that proves the rule is not written tighter than the ruling, which is the defect gate 26's
first version shipped.

## RP or RC, and why RC

The instruction said **RP** and both worked examples said **RC12**. **Shipped RC**, logged as
**Q-W26-01** with the shipped default named. Two tokens to one, RC is Rapid Construct, RP is
an abbreviation of nothing here, and `build.js`'s own existing message already says
"Rapid Construct designations". If RP was meant it is four values and eight ids, and the guard
and this card do not change.

## What did NOT change, and one of them is worth a decision

**The material names are still the source's.** `Metal Plus` and `Metal PlusDV` render exactly
as before, now beside our designation, because the owner asked about the initials and not
about these. **Recommended in Q-W26-01: rename those too**, so a card reads as one product
family rather than half ours and half theirs.

**The order is still the source's**, `RC12, RC30, RC100, RC40`, not numeric. W24-08 copied it
rather than tidying it and that reasoning is untouched.

**The pictures are still Imperlux's.** GARD-01 to GARD-08 are `imperlux.md` renders under
override W25-R15, and each now sits under a Rapid Construct designation. Flagged in Q-W26-01,
not blocking: `RC-pics-real/` still takes `GARD-01.jpg` to `GARD-08.jpg` and one real
installation photograph per model ends it.

**Every record that quotes an IL code is untouched**, under R-S. `DECISIONS.md`,
`docs/BACKLOG.md`, `docs/W24-CLAIMS-HELD.md` rows 36 to 39, `docs/audits/wave-14-competitor-structure.md`
and the W25 board cards all state what the source published when they were written, and that
is still what it published.

## Where the change is recorded rather than silent

- **`content/garduri-modele.json`'s `_note`** carries an `AMENDED (W26-09)` block: the
  designation is no longer the source's, every other field still is.
- **`build.js`'s W24-08 comment** strikes the old codes in place, R-R style, and says the
  order is still the source's.
- **All eight ledger rows** carry `AMENDED W26-09` in `shows`, each naming the code it was and
  the code it is, and stating that **the picture is unchanged**.

## Heights

Measured settled at 1440, both locales.

| Page | Before | Now | Budget |
|---|---|---|---|
| `/servicii/modele-garduri/` | 3,820 | **3,820** | 3,880 |
| `/ru/servicii/modele-garduri/` | 3,842 | **3,842** | 3,902 |

**Unchanged to the pixel**, which is what a two-character swap of the same width should do,
and is measured rather than assumed because R-Y's rule is that the number is read every time.

## Gates

**25 of 25 gate commands exit 0.**

## Recorded for ratification

1. **RC, not RP**, on the two worked examples against the one abstract token. Q-W26-01.
2. **The IL guard now covers the fence file**, at two digits or three.
3. **The material names and the pictures are still the source's**, and the recommendation is
   to change both.
