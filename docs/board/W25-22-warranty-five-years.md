# W25-22 · The written warranty is five years, not thirty

Card W25-22. Branch `w25/w25-22-warranty-five-years`, stacked on `w25/w25-21-intake`.
PR only, stops for the owner.

**Owner instruction, 2026-09-22:** *"change the text everywhere on the website where it is
about 30 years waranty, should be changed to 5 years waranty everywhere"*

## What this ships

**Eight strings, four per locale, and the figure now has one home.** Nothing else on the site
said thirty years, which was checked rather than assumed: after the change, `grep` over the
whole built tree for `30 ani`, `30 de ani`, `30 лет` and `30 years` returns **nothing**.

| Key | Was | Now |
|---|---|---|
| `meta.description` RO | ... Garanție scrisă până la **30 de ani**. | ... Garanție scrisă până la **5 ani**. |
| `hero.claim.line1` RO | **30 de ani** de garanție, direct în contract. | **5 ani** de garanție, direct în contract. |
| `stats.2.n` RO | **30** ani garanție scrisă | **5** ani garanție scrisă |
| `trust.items.0.title` RO | Garanție **30 de ani** în contract | Garanție **5 ani** în contract |
| `meta.description` RU | ... Письменная гарантия до **30 лет**. | ... Письменная гарантия до **5 лет**. |
| `hero.claim.line1` RU | **30 лет** гарантии, прямо в договоре. | **5 лет** гарантии, прямо в договоре. |
| `stats.2.n` RU | **30** лет письменной гарантии | **5** лет письменной гарантии |
| `trust.items.0.title` RU | Гарантия **30 лет** в договоре | Гарантия **5 лет** в договоре |

They render on the two homepages and nowhere else. `meta.description` also fills
`og:description` and the JSON-LD `description`, so those move with it.

## The Romanian grammar changes with the number, and that is the point

**Romanian counts from 20 take "de": `30 de ani`, but `5 ani`.** Three of the four Romanian
strings carry the number inline, so a find-and-replace of "30" with "5" would have left
"5 de ani de garanție" on the homepage hero. Each string was rewritten, not substituted.

Russian is unaffected: both 5 and 30 take `лет`.

`build.js` already knew this rule, at the metal tile grid, where it picks `de ani` at 20 and
above and `ani` below. That is where the check was read from rather than guessed.

## The figure has one home, and the strings are held to it

`warranty.years` is now a locale key, `"5"` in both, and `build.js` asserts **both
directions** over the four strings:

- every one of them **states** the figure, because a string that lost it is a claim that
  stopped being about the warranty;
- **none of them states a different one**, which is what catches the real failure mode here:
  four strings in two languages in four grammatical shapes is exactly the arrangement in
  which one survives a change, and the survivor would be the homepage hero.

It is deliberately not "no 30 anywhere": `stats.0.n` is 500 and a description may carry any
number. The pattern reads a number immediately followed by a years word, in either locale,
which is the only shape a warranty claim takes here.

**Both failure shapes were watched fire**, on the shipping file, with the control clean
before and after:

```
plant: the old figure left in one of the four
  BUILD FAILED: ro: hero.claim.line1 states 30 year(s) and warranty.years is 5

plant: one of the four no longer states a figure at all
  BUILD FAILED: ro: trust.items.0.title states no number of years, and it is one of
                the strings that states the warranty: "Garanție în contract"
```

## The documents are held too, by the gate that exists for it

`build.js` reads the locales; it does not read the master plan, and **the master plan
specified the stat row and the trust grid with thirty in them**. A plan that still says
thirty is a plan someone builds from.

So `warranty-30` is registered in `scripts/check-stale-docs.js` and both master plan lines
carry a struck value and an `AMENDED (W25-22)` beside them, which is how every superseded
value in this repo is recorded.

**It does not touch the audits or `docs/W24-CLAIMS-HELD.md`.** Those record a COMPETITOR's
thirty-year anticorrosion warranty and are correct as they stand: they are records of
someone else's claim, not instructions, and they are not in the gate's scanned set.

## The same trap, twice in one session

The staleness gate **caught this card's own comment**. The comment in `build.js` explaining
what the assertion catches quoted the old string as its example, and the gate scans source
comments. That is the second time in this session that a comment explaining a rule tripped
the gate enforcing it: `src/moved.html` did it at W25-19, against the catalogue gate.

The comment now describes the shape instead of quoting it, and says why.

## Heights did not move, and that is a measurement with a control

| Page | With 30 | With 5 | Budget |
|---|---|---|---|
| `/` | 9,135 | **9,135** | 9,195 |
| `/ru/` | 9,376 | **9,376** | 9,436 |

The same build was measured twice at 1440 with every reveal settled, once with each figure,
changing nothing else. **Every one of the four strings fits on its existing line at both
figures**, so no line wraps and no budget moves. R-Y is untouched, which is a result and not
an omission: had the copy got shorter by a line, the budget would have had to come down with
it.

## Gates

**24 of 24 gate commands exit 0.** Lighthouse, heading fit and header fit all read the new
copy, which is where a shorter string would have shown up if it had changed a box.

## One thing the owner should know

**The stat tile now reads a single digit.** `500+`, `15+`, `5`, `4.9/5`, and the third is the
warranty. It is correct and it is quieter than it was; the label beside it,
"ani garanție scrisă", is unchanged and still carries the meaning. Nothing was done about it,
because the instruction was about the figure and the figure is now right.
