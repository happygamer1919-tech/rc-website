# W25-20 · One picture, several records of the same product

Card W25-20. Branch `w25/w25-20-ct80f-and-reuse`, stacked on
`w25/w25-19-acoperisuri-consolidation`. PR only, stops for the owner.

## What this ships

**Twelve slots filled with a picture that is already on the site**, under **W25-R16** and
**W25-R17**. The ledger goes from 271 to **283 of 337**, Catalog from 259 to **271 of 294**.

Not one byte of image was downloaded. Every one of the twelve stands on a file another card
already fetched, reviewed and installed.

## The rule, and why it is declared rather than inferred

W25-R3 said "one picture never stands as two products", and gate 19 held it as a hard refusal
on a shared file path or a shared source image URL. That refusal was right and it was also
too wide: the catalogue lists one Phomi product under two records, so the one swatch of it
could fill only one of them, and **thirteen ceramic plates stayed grey for a reason that was
about the catalogue's shape and not about the product**.

W25-R17 narrows it. The second half stands untouched: **a picture never fills a different
product.** What is lifted is the first half's accidental reach.

**A machine cannot see that two catalogue records are the same product. A person can.** So
the permission is DECLARED, on the later slot:

    "reuse_of": "CAT-0044",
    "reuse_reason": "W25-R17: the same Phomi product under two catalogue records;
                     both settle to \"Loki Mountain Light Grey\"."

Everything undeclared fails exactly as it did before.

## The declaration is checked, not trusted

Gate 19 gains five refusals and one acceptance. A `reuse_of` may not name a slot the ledger
does not have, a slot that is still a placeholder, or a slot holding a different picture; a
declaration with no reason fails; and a shared picture whose declaration points somewhere
else is still `shared-image`.

**Each of the five was watched fire, and the acceptance was watched pass.** The sixth arm is
new in kind: `want: null`, a GREEN arm, a shape the gate MUST accept.

> A permission nobody has watched succeed is as untested as an assertion nobody has watched
> fail. A green arm catches the opposite defect to every red one: a rule written so tightly
> that the thing the owner permitted is refused.

The green arm and the first red arm are the same two slots on the same file and differ only
by the declaration, so what the arm reads is the declaration and nothing else.

## What the twelve are

**`CAT-0005`, under W25-R16.** The owner closed Q-W25-16 at "two products, same picture on
both". W25-15 had blocked on it and the block was right: name, unit and price all differ, so
W25-R13's "identical on all three" branch did not apply and its other branch says ask.

**Eleven ceramic plates, under W25-R17.** Each takes the picture already on another record
of the same product, and `matched_as` in `content/plate-brand-settlement.json` is what says
they are the same product: it is the catalogue name each record matched to, settled at
W25-03d against three catalogues, and it is data rather than a judgement made here.

| Slot | Takes the picture from | Both settle to |
|---|---|---|
| `CAT-0005` | `CAT-0002` | (W25-R16, the owner's ruling) |
| `CAT-0045` | `CAT-0044` | Loki Mountain Light Grey |
| `CAT-0086` | `CAT-0044` | Loki Mountain Light Grey |
| `CAT-0070` | `CAT-0046` | Blue Grey |
| `CAT-0078` | `CAT-0056` | Medium Grey |
| `CAT-0083` | `CAT-0061` | Ink Dyed |
| `CAT-0084` | `CAT-0072` | Sunis White |
| `CAT-0085` | `CAT-0073` | Andes Yellow |
| `CAT-0087` | `CAT-0071` | Veil Dark Grey |
| `CAT-0091` | `CAT-0076` | Sairo Off White |
| `CAT-0095` | `CAT-0089` | Roman Red |
| `CAT-0099` | `CAT-0069` | Portoro |

**`CAT-0086` is the case the ruling was written for.** Its own name is "Placă Loki Mountain
Light Grey" and `CAT-0044`'s is "Placă Mountain Light Grey". The two card titles disagree;
the settlement says they matched the same Phomi product, and it names it.

## Thirteen held, twelve filled, and the two that could not be

The review list held **thirteen**. Only twelve are here, and the arithmetic is not a slip:
`CAT-0110` "Polished Concrete Wall" and `CAT-0112` "Polish Concrete Wall" both settle to
"Polish Concrete Wall", **and neither of them was ever filled**. They were held as "the same
picture already fills another record", which was never true of this pair: there is no
picture on either, so there is nothing to reuse.

Their `empty_reason` now says that, measured: *"no record of this product holds a Phomi
picture, so there is none to reuse"*. A reason that is wrong is worse than no reason, because
it stops anyone looking again.

## The review list

**Twelve rows now carry a `reuse of <slot>` flag.** That is W25-R17's other half, in the same
shape W25-R5 and W25-R7 already have: the permission is conditional on the owner being able
to see it. A reused picture that was invisible in the review list would be a picture on two
cards that nobody checked were the same product.

## The owner's question

`~/Documents/rc-audit-w24/CLAIMS-MIHAI.md` gains **question 30**, on a new page 4, quoting
both CT 80 F rows in a table: the two names, the ten thicknesses, the two Russian lines and
the two prices. It is one yes/no, and the answer does not move the picture: it decides
whether the second row stays. If the answer is no, the price to keep is written on the line
and the older id keeps its URL, which is W25-R13's own rule.

## Gates

**24 of 24 gate commands exit 0**, from `node scripts/run-gates.js --keep-going`. Gate 19
reads `ledger slots filled: 283 of 337` and runs **18 self-test arms**, seventeen red and one
green, each printed by name on every run. Gate 24 reads `283 installed, 43 empty, file matches the data`.

**No height moved and no image was added.** Every one of the twelve names a file that is
already in `public/` with a provenance row of its own, so `public/` is unchanged and R-W's
walk reads the same 430 images it read before.

## Recorded for ratification

1. **`reuse_of` and `reuse_reason` are ledger fields**, declared by a person, and gate 19
   checks the declaration against the ledger rather than believing it.
2. **A GREEN self-test arm is a new kind of arm here.** `want: null` asserts a shape the gate
   must accept, which is the only way to test that a permission actually landed.
3. **`CAT-0110` and `CAT-0112` stay grey**, and their reason is corrected to the measured
   one. Thirteen were held; twelve could be filled.
