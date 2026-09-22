# W26-04 · The roofing restructure, and a defect that made two sections vanish in silence

Card W26-04. Branch `w26/w26-04-roofing-restructure`, based on `main` at `18b98ce`. PR only,
stops for the owner.

## What ships

**Five sections replace seven catalogue subcategories**, a **second four-tile bento** sits
above them, and **twenty imperlux.md models** join the section, merged with dasterum.md's
records the way W26-R5 sets out.

| Section | Cards | Made of |
|---|---|---|
| Țiglă metalică | 4 | dasterum.md, unchanged |
| **Țiglă ceramică** | **1** | imperlux.md Creaton Rapido |
| **Șindrilă bituminoasă** | **2** | imperlux.md IKO Cambridge, IKO Superglass Hex |
| **Sisteme pluviale** | **18** | 17 imperlux models, 11 of them carrying folded dasterum grades, plus 1 dasterum-only |
| **Accesorii de acoperiș** | **53** | profnastil, hidroizolație, elemente suplimentare, siguranță and fixare, folded into one |

**78 cards, and the arithmetic is written out because a count nobody can reproduce is a number
rather than a marker: 71 - 13 + 20 = 78.**

## The merge, and the reading it rests on

W26-R5: *"Imperlux products first; Dasterum products added only where the model name is
absent; one card per model name, de la price = lowest grade, grades listed as variants in the
card."*

**Read literally, "Jgheab scurgere 125x2000 mm" is a model name imperlux.md does not carry, so
it would be added as its own card** beside imperlux's "Jgheab". That reading gives 31 rainwater
cards, seventeen of them with no price, no specs and no picture, and the same part on the page
twice under two names.

**Read as one rule, the three clauses fit together**: a dasterum record whose part is an
imperlux model at a size is a **grade** of it, so it is a variant line, the card carries the
cheapest grade's price, and "one card per model name" holds. **That is the reading taken**, and
it is the one that makes "de la price = lowest grade, grades listed as variants" mean anything
at all.

**Every match is data, not a rule in the code.** `content/roofing-sections.json` carries, per
model, the dasterum slots folded into it, a **tier** and a **reason**. That is W25-03d's
shape, and its lesson: research held in prose is research nobody can check, and this repo has
already published a wrong manufacturer claim for two days because of it.

| Tier | Models | Meaning |
|---|---|---|
| `same-part-different-length` | 2 | dasterum sells it in two lengths; both are variants, the cheaper sets the price |
| `same-part-one-size` | 9 | dasterum publishes one size |
| `imperlux-only` | 9 | nothing in dasterum's roofing catalogue is this part |

**One near match was refused on purpose.** imperlux's **"Cot 60°"** and dasterum's **"Cot
burlan 90 mm"** look like a pair and are not: **the 90 is a diameter in millimetres and the 60
is an angle in degrees.** W25-R4 refuses a near match, so they are two cards, and the reason is
written in the row rather than left to be rediscovered.

**Two ledger rows leave the ledger.** `CAT-0268` and `CAT-0265` are the 125x4000 gutter and
the 90x3000 downpipe, which are now variant lines on Jgheab and Burlan. Nothing renders them,
and **gate 19 states the rule in its own words: a row nothing renders sends a photographer out
for a photograph nothing will show.** Their image files and their provenance rows stay exactly
where they are; only the photo-session list loses two entries it could not have used.

## What was NOT taken from imperlux.md, and why each one

| Not taken | Why |
|---|---|
| Every image | W24-R2, and the override is held to sixteen named slots (W26-R3) |
| The description sentence under each name | it is marketing, not a product fact. W25-25 refused the same thing on the fence cards |
| The struck price and the percent badge | W26-R5 says "de la only", and R-X refuses both anyway |
| **The warranty** | **W26-R6 holds the roof warranty rows** until the owner confirms them |

**The warranty exclusion is worth stating plainly, because this page is now inconsistent and
that is not new.** The dasterum cards have rendered "Garanție: 1 an" inside their spec line
since W25-19, copied verbatim from the source. The imperlux cards render none. **Both are
following their own rule and the page reads as though one supplier gives no warranty.**
Reported here rather than fixed: unpicking it is W26-R6's business and the owner has not
answered it yet.

## The second bento, and why it does not wear the hub's class

W26-R5 asks for a second four-tile bento whose tiles open sections of the same page. W26-R4
says a **hub** tile opens a page. The ruling's own note says gate 26 has to be scoped so both
can be true.

**The scope is a different class prefix, and that is stronger than scoping the gate.**
`.hub__tile` carries more than a look: `verify-live.js` counts it as a marker, gate 20
measures its geometry and gate 26 holds its href to a page URL. **A product tile wearing that
class would be counted, measured and refused as a hub**, and the refusal would come from a
gate that must not see it at all. So the product bento is `.pb__*`, grepped free first
(rule 3.1).

**The look cannot drift, because there is only one rule body.** Every hub declaration now
carries `.pb__*` in its selector list rather than being copied. Gate 22 is satisfied for the
same reason: one class, one declaration.

**`bentoSection` builds both**, and each kind refuses what the other requires: a hub tile with
an anchor fails the build, and a product tile **without** one fails it too.

## The defect that made both bentos vanish, on a build that exited 0

**Writing this card broke the roofing page in complete silence, twice, and a third time in a
gate.**

An HTML comment inside the bento's returned template literal discussed the new class in
backticks. **A backtick inside a template literal ends it.** The rest of the sentence became
code, the next backtick opened a new literal, and the expression became `literal .pb__ *
literal`: a member access and a multiplication. **`bentoSection` returned NaN.** Both bentos
rendered as nothing, `node build.js` exited 0, and `node --check` would have exited 0 too.

**It is W24-09a exactly**, which shipped to `main` in wave 24 with nineteen gates green and was
found by the post-merge run. Gate 21 was written then and guards **one file**. An hour later
the same sentence went into `check-layout-geometry.js`'s browser probe and that file stopped
loading; the run after it, a nested `${}` in the same comment was substituted by **this file's**
scope before the browser ever saw it.

**Three times in one card is a gate.** `scripts/check-template-literals.js`, gate 27, runs
**first** in `quality`, before the build, because it needs no build and it guards the file the
build is written in.

**It checks the symptom, not the cause**, and says why: after parsing, a backtick that ended a
literal early is invisible **as a backtick**. What it leaves behind is a **severed comment**,
and that is visible. A comment opened inside a template literal must close inside it, in both
the HTML and the JS form. Plus a string literal immediately followed by a template literal,
which is a tagged template whose tag is a string and is W24-09a's precise shape.

**It is narrow on purpose.** "No backtick in a comment" would fire on this repo's own prose in
almost every file, and a noisy gate gets worked around, which is gate 22's recorded lesson.

**Eight arms, five of them GREEN**, because a rule this shape is far likelier to refuse
something legitimate than to miss something broken: a balanced comment inside a literal,
`String.raw`, a backtick in a block comment **outside** any literal, a literal holding an
apostrophe and a quote and a slash, and a nested literal inside an interpolation all have to
be accepted.

**And all three real defects were planted back into the shipping files and watched fire**,
between two clean controls. That is not ceremony: **the first scanner reported the whole tree
clean and said nothing about `build.js`'s actual defect**, because it recursed on a nested
literal and added back how far the recursive call had got, which was the end of the file. It
looked exactly like a clean repo. The real-file arms are what caught it.

## Everything else that had to move with the regrouping

- **The eight redirect pages still answer**, and each now aims at the section its subcategory
  was folded into. `from_catalog` is that map, it is **data**, and the build asserts it covers
  every catalogue child **exactly once**: a child in none would redirect to an anchor that is
  not on the page, and a child in two would put a number on a filter button that no press
  could produce.
- **A roofing record must land in exactly one section**, asserted rather than assumed. Five
  records sit in two catalogue subcategories and today both of each pair fold into the same
  section. The day one does not, the card would be ordered under one and counted under two.
- **Gate 20 measures every bento on a page**, not the first. It used `querySelector`, so it
  would have measured the hub and walked past the new one: a new grid with no geometry gate is
  the exact hole gate 20 was created to fill. Bento tiles read went from 32 to **48**.
- **The owner intake list learned the second bento's label class**, and died on the first tile
  until it did. That is the right failure: a slot with no label beside it is a slot the owner
  cannot be told what to photograph.
- **`prodCard` takes a record with no price object at all.** Every catalogue record has one
  whose `render` may be null; an imperlux model that folds nothing publishes no price and has
  no object. Both land on the ask element.
- **The live markers move with the page**: `productCards` 71 to **78**, `roofFilters` 8 to
  **6**, and a new `pbTiles`, which is **4** on the roofing pages and asserted **0** on the
  bento destinations. A build that gave the product bento the hub's class would move two
  markers at once.

## Thirteen new empty slots, and all of them are one question

**ACOP-05 to ACOP-08** are the second bento's tiles and **ACIM-01 to ACIM-09** are the imperlux
models no dasterum record covers. **Three of the four tile pictures were fetched during W26-03
and are sitting ready**, and they are not used, because W26-R3 says the override "does not
widen" and ACOP-05 is not one of the sixteen ids it names. **A rule you cannot break for your
own convenience is the only kind worth having.** Q-W26-04 asks for the word.

## Heights

| Page | Before | After | Budget |
|---|---|---|---|
| `/servicii/acoperisuri/` | 16,470 | **18,015** | 16,530 to **18,075** |
| `/ru/servicii/acoperisuri/` | 16,608 | **18,221** | 16,668 to **18,281** |

**+1,545px, and it separates cleanly**: the second bento is the same component as the hub, so
the same 504px plus its heading and margins, and seven more cards in a four-column grid is two
more rows. **A merge that had added all twenty imperlux models as new cards would have cost
five rows instead of two.**

## The ledger

**348 rows, 315 filled, 33 empty.** Two rows removed, thirteen added.

## Gates

**26 of 26 gate commands exit 0**, and 26 is what `run-gates.js` prints now that gate 27 exists.

## Recorded for ratification

1. **The merge reading**: a dasterum part that is an imperlux model at a size is a **grade**,
   not a second card. Every decision is data with a tier and a reason.
2. **"Cot 60°" is not "Cot burlan 90 mm."** An angle is not a diameter.
3. **Two ledger rows removed** because nothing renders them; their files and provenance stay.
4. **The product bento carries its own class prefix**, sharing one rule body, because
   `.hub__tile` carries three gates' rules as well as a look.
5. **Gate 27 exists** and runs first.
6. **Thirteen slots are empty and three of their pictures are ready.** Q-W26-04.
7. **The warranty line is on the dasterum cards and not the imperlux ones**, and the page reads
   inconsistently until W26-R6 is answered.
