# W26-05 · Compară modelele, and the live check that failed on a correct site

Card W26-05. Branch `w26/w26-05-compara-tables`, based on `main` at `cfebef8`. PR only.

## Section 12.0 on the sha you merged, and it FAILED

`EXPECT_SHA=cfebef83db26295fef09c48eab403d5805fd2119 node scripts/verify-live.js
https://rapidconstruct.md` → **exit 1. FAIL, 0 unverified, 12 failed.**

**Every failure is one defect and it is this terminal's.** W26-04 regrouped the roofing filter
into five sections and **left `verify-live.js` expecting each catalogue redirect to land on its
own subcategory**. Twelve of sixteen redirect rows read the same way:

> `FAIL redir RO profnastil  /catalog/materiale-acoperis/profnastil/ refreshes to
> /servicii/acoperisuri/#mat-accesorii-de-acoperis, expected /servicii/acoperisuri/#mat-profnastil`

**The site is right and the check was wrong.** Every height was inside budget, every marker
matched, and all sixteen URLs answered 200.

**It is the third time in three waves** that a marker was not moved with the thing it names:
W24-07a's rename left six, W25-24's `bentoLinks` left one, and this leaves twelve. So it is
**coupled rather than remembered**: `build.js` now reads `verify-live.js`'s `REDIRECT_SECTION`
map and refuses to build if it disagrees with the grouping the build emits. **Watched fire on
the real file** between two clean controls: a stale `profnastil` anchor exits 1 naming both
sides.

## The tables, per W26-R6

| Section | Table | Rows | Where the cells come from |
|---|---|---|---|
| Țiglă metalică | **yes** | 4 | the card specs |
| Țiglă ceramică | **no** | 1 | a comparison of one compares nothing |
| Șindrilă bituminoasă | **yes** | 2 | **copied from imperlux.md**, columns and rows |
| Sisteme pluviale | **yes** | 18 | the card specs |
| Accesorii de acoperiș | **no** | 53 | 53 unlike things, not variants of one model |
| `/servicii/modele-garduri/` | **yes** | 8 | the card specs |

**Which sections have a table is DATA**, in `content/roofing-sections.json`, with the reason
written beside each one that does not. A judgement held in code is a judgement nobody can read.

**Imperlux publishes a table for rainwater and every cell of it is empty**: seventeen columns
of "La cerere", "-", "-", "-" and "0". Copying it would publish a table that says nothing, so
that one is built from the card specs and the finding is recorded in the data file.

**Its metal-tile table is about seven models that are not on this page.** This page carries
dasterum.md's four. So that table is built too.

## Products are rows, and that is the one deviation

W26-R6 says "copy it (columns and rows)". **imperlux.md puts a product per COLUMN**, which is
seventeen columns on the rainwater page. Seven already do not fit 360px and this site is held
to no sideways scroll there by gate 14.

**The cells are the ruling's; only the axis moves.** A transposed table holds exactly the same
comparison and grows down, which a phone can do. Each table still sits in a focusable, labelled
scroll region for the narrow case, because a region that scrolls and cannot be reached by
keyboard is a region some visitors cannot read.

## The warranty is off both pages, for two different reasons

**The fence table has no warranty column because you answered**: Q-W25-19, "leave it off". The
source states 20 and 30 years of anticorrosion cover and it stays in `docs/W24-CLAIMS-HELD.md`.

**The roofing tables have none because W26-R6 still holds them**, pending your confirmation.
`Garanție` is real on every dasterum metal-tile record, so leaving it out is a decision taken
on every build rather than an absence.

## Two things the build now refuses

**A declared table with fewer than two products.** A comparison of one is not one, and the
message names the section.

**A column under half real.** Measured per column at build time, so a column that would print
a dash in most of its rows fails naming the column and the count. It is what kept Accesorii de
acoperiș out: `Tip de calitate` is real on 24 of 53 and `Acoperire` on 23 of 53.

## And the spec line is derived, not written twice

The imperlux cards' spec line under the name and their row in the table are **the same cells**,
read from one `specs` object in the order `spec_order` gives. W25-25 settled this shape on the
fence colours: a value stated beside the thing it describes is a second place to be wrong.

**One thing dropped on reading the rendered table**: dasterum writes `* Econom Standart
Premium` with a leading asterisk that footnotes nothing, and the card's own variant line has
printed it without the asterisk since W25-19. The table would otherwise disagree with the card
directly above it. **And the fence table lost its Material column** for the same kind of
reason: the row header is `RC12 Metal Plus`, so a Material column printed half the row header
again in every row.

## Heights

| Page | Before | After | Budget |
|---|---|---|---|
| `/servicii/acoperisuri/` | 18,015 | **19,458** | 18,075 to **19,518** |
| `/ru/servicii/acoperisuri/` | 18,221 | **19,644** | 18,281 to **19,704** |
| `/servicii/modele-garduri/` | 3,820 | **4,309** | 3,880 to **4,369** |
| `/ru/servicii/modele-garduri/` | 3,842 | **4,331** | 3,902 to **4,391** |

**+1,443px for three tables of 4, 2 and 18 rows**, and the eighteen-row one is most of it.
**+489px for one table of 8**, more than eight rows' worth because a Metal Plus row names three
colours with their RAL codes and wraps to two lines at 1440.

**Both pages carry every table as they load**, which is what a visitor lands on and therefore
what a budget is measured in. Pressing a filter hides two of the three, so the roofing page
only gets shorter from there.

## Gates

**26 of 26 gate commands exit 0.**

## Recorded for ratification

1. **Products are rows, not columns.** The cells are the source's; a seventeen-column table
   cannot be put on a phone.
2. **Two sections have no table**, recorded with the reason in the data.
3. **A column under half real fails the build**, and that is what kept Accesorii out.
4. **The redirect map is coupled to the build**, after it failed section 12.0 on a correct site.
5. **No warranty column anywhere**: answered for fences, still held for roofs.

## And the no-dash rule was never machine-checked, which I found by breaking it

The table's "no value" cell shipped as **an em dash**, `U+2014`, in both locales. Your standing
rule is "no em dashes or en dashes anywhere" and **it went onto the built site** before a
proper check caught it. It is a hyphen now.

**The check I had been running every card was hollow.** `grep -c $'\u2014'` in this shell does
not expand that escape, so it matched nothing and reported clean on every card of this
dispatch. Re-run properly, in Python, against the whole tracked tree:

| Where | Dashes | Whose |
|---|---|---|
| `locales/*.json`, the table's empty cell | 2 | **mine, fixed here** |
| `docs/audit/imperlux/audit.json` | 60 | **imperlux.md's own page titles**, quoted verbatim in an audit |
| `locales/ru.json`, five Russian sentences | 5 | **pre-existing, and correct Russian typography** |
| `src/*.html` language switcher `aria-label`s | ~20 | **pre-existing** |
| `DECISIONS.md`, `QUESTIONS.md`, `RELEASE-NOTES.md`, board cards | ~280 | **pre-existing records**, immutable under R-S |

**Two of those are worth your ruling and neither is fixed here.** A quoted source title in an
audit is a record of what the source says, not prose this site wrote. And **a Russian sentence
uses an em dash as grammar**; five do, in copy that predates this dispatch, and stripping them
would make the Russian wrong.

**Recommended, and it is the first thing the next session should do**: a gate that refuses an
em or en dash in **what this repo authors** (locale strings, templates, stylesheets, scripts)
while exempting **what it quotes** (the audit files) and **what it has already recorded**
(DECISIONS, QUESTIONS, RELEASE-NOTES, board cards, which R-S freezes). Without one, the rule
is enforced by whoever remembers it, and this card is the evidence that that fails.
