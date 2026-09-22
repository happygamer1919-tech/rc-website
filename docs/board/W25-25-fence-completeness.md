# W25-25 · Eight model pages walked, one field missing, one field held

Card W25-25. Branch `w25/w25-25-fence-completeness`, stacked on `w25/w25-24-hub-tiles`.
PR only, stops for the owner.

## The walk

**Every fence page on `imperlux.md` was walked, not sampled.** The fence sub-app's own
internal links were harvested from four entry pages, which is how the model pages were found:
they are not in the sitemap, which lists five URLs for the whole site.

| Found | Count |
|---|---|
| **Model pages**, `/garduri/garduri/il{12,30,40,100}-{plus,plusdv}` | **8** |
| Price pages, `/garduri/preturi/*` | 10 |
| City pages, `/garduri/garduri-metalice/*` | 12 |
| Project pages, `/garduri/lucrari/*` | 22 |
| Service pages, `/garduri/servicii/*` | 4 |
| Other (calculator, blog, contact, despre-noi, personalizate, diaspora, de-ce-imperlux, cookies) | 8 |

**Models walked: 8. On this site before: 8. On this site after: 8.** No model is missing and
none was added, and that is a result rather than an absence of work: the source states it
itself, in one line on its catalogue page, *"4 modele: IL12, IL30, IL100, IL40 · fiecare în
Metal Plus și Metal PlusDV"*.

**`IL102`, `IL101`, `IL41` and `IL02` appear on the source and are not models.** They occur
only in the titles of finished-project pages, 23 mentions between them against 97 to 109 each
for the four real designations. A walk that counted designations rather than model pages would
have invented four cards.

## The field diff, per model

| Field the source states | On our card before | Now |
|---|---|---|
| Name (`IL12 Metal Plus`) | yes | yes |
| "de la" price per m² | yes, W25-11 | yes |
| Thickness | yes | yes |
| Colour count | yes | yes |
| **Colour names** | **no** | **yes, this card** |
| Picture | yes, W25-18 | yes |
| Warranty line | no | **held, Q-W25-19** |

Two fields the source states are deliberately not taken: its **description sentence**, which is
its marketing copy and not a product fact, and its **struck price, percent badge and
"Economisești" figure**, which R-X forbids here and W25-R8 forbids copying.

## The colour names

A card read `Culori 3`. It reads `Culori 3: Antracit (RAL 7016), Maro Wenge (RAL 8019), Negru
profund (RAL 9005)`. Metal PlusDV offers two, Antracit and Maro Wenge.

**The names are the source's own**, read from two places that agree: the "Culori disponibile"
line on each model page, and the `alt` text on each swatch image, which on `il12/7016.webp`
names `IL12 Metal PlusDV` and then `Antracit`. (The separator in that alt text is an em dash,
described rather than quoted here, because this repo's copy carries none.)

**That alt text also confirms W25-18 by accident.** W25-18 paired Metal Plus with RAL 9005 and
Metal PlusDV with 7016, deduced from counting how often each code appeared on the catalogue
page. The source labels `9005` "Metal Plus" and `7016`/`8019` "Metal PlusDV" in its own alt
attributes. Two independent readings, same answer.

**The palette lives once**, keyed by RAL code in `content/garduri-modele.json`, and a model
names the codes it offers. So **the count is derived, not stated beside the list**: `build.js`
refuses a model whose `colours` disagrees with its `colour_rals` length, and a colour renamed
is renamed on every card at once.

**The RAL code is printed beside the name** because `imperlux.md` publishes **no Russian page**
(`/garduri/ru/garduri` answers 404), so the Russian name is authored in this repo while the
code is the source's. A colour name translated is not a claim; the code is what a buyer
matches against.

## The warranty line is held, and the reason is now three-deep

The source states `Garanție: 20 ani anticoroziune` on Metal Plus and `30 ani` on PlusDV.
**Not rendered.** Q-W25-19 carries it:

1. **W24-R6** says a warranty sentence is not rendered until the owner ticks it, and it is
   written in `docs/W24-CLAIMS-HELD.md` at **rows 33, 40 and 44**, row 44 being "the spec
   strip, all eight".
2. **Question 21 of `CLAIMS-MIHAI.md`** asks the owner's own fence warranty and is unanswered.
3. **W25-22 shipped the site's written warranty as 5 years.** A visitor told `5 ani garanție
   scrisă` on the homepage and `20 ani` on a fence card will conclude one is wrong. They are
   different warranties, one on the work and one on the coating, and **nothing on either page
   says so**.

Recommended in the question: answer question 21 and render the owner's own number.

## The budget rises

| Page | Before | After | Budget |
|---|---|---|---|
| `/servicii/modele-garduri/` | 3,686 | **3,820** | 3,746 to **3,880** |
| `/ru/servicii/modele-garduri/` | 3,707 | **3,842** | 3,767 to **3,902** |

One definition line became three or four wrapped ones on a four-column card, and the grid is
one row, so the tallest card sets it. **R-Y's rule runs in this direction too**: it fell at
W25-11 when a line got shorter and it rises here because a line got longer. What it may never
do is stay still while the page moves.

## Gates

**25 of 25 gate commands exit 0.**

## Recorded for ratification

1. **The colour count is derived from the colour list**, and the build refuses a disagreement.
2. **The RAL code ships beside every colour name**, because the Russian name is ours and the
   code is not.
3. **The warranty line is held**, on W24-R6 and on the collision with the five years.
