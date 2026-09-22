# W24-10 · Nine cards on a phone, the wave 24 close, and the two owner sheets

| | |
|---|---|
| Dispatched | Wave 24, third dispatch, 2026-09-20 |
| Rulings in force | R-V, R-W, R-X, R-Y as amended by W24-R4, R-Z, R-AA, R-AB, the W24 ratifications, and the new section 12.0 |
| Depends on | W24-09, W24-09a, W24-09b, all merged as #86, #87, #88 |
| Closes | Q-W24-02, Q-W24-03, Q-W24-04. With Q-W24-01 and Q-W24-05 already closed, **wave 24 has no open question.** |

## The precondition, run before anything else

`main` pulled, #88 confirmed MERGED as `c3d6b6b`. The Pages run for that sha succeeded,
the edge was polled until it served it, and then:

    node scripts/verify-live.js https://rapidconstruct.md     exit 0
    PASS - 0 unverified, 0 failed          51 of 51 pages

**The first fully clean live run of wave 24.** Case la cheie reads 6,376 against 6,436 and
6,483 against 6,543, which is W24-09b's `.faq` fix confirmed on the deployed tree rather
than on a workstation.

## 1 · Nine cards

`PROD_STEP` in `build.js` is **9**, the owner's answer to Q-W24-04.

| Page | RO at 12 | RO at 9 | RU at 12 | RU at 9 |
|---|---|---|---|---|
| `/catalog/placi-ceramice/` | 10,189 | **8,696** | 10,760 | **9,182** |
| `/catalog/elemente-decorative/` | 10,306 | **8,793** | 10,552 | **9,039** |
| `/catalog/sisteme-iluminare/` | 10,383 | **8,870** | 10,450 | **8,937** |
| `/catalog/termoizolatie/` | 10,778 | **9,197** | 10,902 | **9,324** |
| `/catalog/tencuieli-decorative/` | 10,885 | **9,241** | 11,003 | **9,477** |

**The target is met on the page it named**: 8,696px, and it is the figure Q-W24-04
predicted before the question was asked.

**NO DESKTOP BUDGET MOVES.** A budget in R-Y is a 1440px measurement and nothing folds at
1440. All five reveal pages were re-measured there to prove it rather than argue it, and
every one is identical to W24-09's figure.

**Two things recorded because they are true rather than because they are tidy.** The RU
copy of the named page is 9,182px, over 9,000; the target named one path, and shaving a
locale to a number nobody set would be inventing a requirement. And **three pages are now
longer than placi ceramice**, which was the longest page on the site an hour ago:
tencuieli decorative is 9,241 on thirteen products against placi ceramice's 8,696 on
eighty-eight. With the grid capped at nine, **a catalogue page's length is no longer its
data**; it is the prose block, the form and the footer, about 4,000px shared by all of
them. The next reduction is not a catalogue change.

### Two numbers that would have drifted, removed

**The button's accessible name said "12" in words.** `catalogProducts.moreAria` read
"Arată încă 12 produse"; at nine cards it would have spoken a number the page does not do.
It now carries `{n}` and `build.js` substitutes `PROD_STEP`, and the build **refuses a
locale string that lost the placeholder**. A number that appears twice is a number that
drifts.

**Gate 20's fold arm carried its own `12`.** It would still have fired at nine, which is
worse than failing: it would have fired for the wrong reason. It now reads
`data-prod-step` off the page. Gate 20 stays green, 64 of 64, with all four arms firing,
and the fold arm now reports "9 of 88".

## 2 · `CLAIMS-MIHAI.md`, outside the repo

`~/Documents/rc-audit-w24/CLAIMS-MIHAI.md`. Romanian, read aloud to the client, ticked on
the spot.

**54 source rows to 29 questions. 15 excluded as prices, reductions or instalments, 39
carried into the 29.** Verified independently against `docs/W24-CLAIMS-HELD.md` by parsing
both files: 39 + 15 = 54, **no overlap, none missing, none invented**, numbering contiguous
1 to 29, every question closed and ending "Da / Nu", and no price or instalment wording
anywhere in a question body.

Grouped by the three mirrored pages. **The question-to-row map is in an appendix headed
"numai pentru uz intern, nu se citește clientului"**, not on the question lines: a marker
like `(rânduri 1, 7, 9, 28)` points at a file the client has never seen and the owner is
reading this aloud.

**Four things the adversarial pass caught in the first draft**, recorded because they were
real: three source rows were cited but only half asked (the Voestalpine steel spec, who
*mounts* as against who *manufactures*, and the concealed fixing system), one question was
double-barrelled so a client could truthfully answer both yes and no, the preamble said
"three new pages" when copertine already existed and gained only a hero, and one question
had narrowed "cea mai mare din industrie" to "de pe piața din Moldova", a territory the
client could honestly agree to while the site published something wider.

## 3 · `PHOTO-SESSION-W24.md`, outside the repo

`~/Documents/rc-audit-w24/PHOTO-SESSION-W24.md`. Ordered so a shortened day is cut from
the tail, not the middle.

| Part | What | Slots |
|---|---|---|
| 1 | The hub bentos, acoperișuri and garduri | 8 |
| 2 | Copertine hero | 1 |
| 3 | Before / after, case la cheie | 8 |
| 4 | Catalogue index tiles | 7 |
| 5 | The remaining service pages | 14 |
| 6 | Catalogue products, one table by category | 223 |
| | **Total** | **261** |

**Parts 1 to 5 are 38 photographs**, one long day of fieldwork; part 6 is separate studio
work. Verified against `docs/PHOTO-SLOTS-W24.json`: **0 of 261 slots missing**, every part
total re-derived from the ledger, and every `shows` string reproduced verbatim rather than
paraphrased.

**The dispatch says "3 hub bentos". There are two.** `build.js` defines exactly two,
acoperișuri and garduri, four tiles each, which is the 8 slots above; gate 20 finds four
hub PAGES because each is built in both locales, and that is probably where the three came
from. `/servicii/copertine/` is not a hub: its `COPX-01` and `COPX-02` are cross-sell
cards. The sheet is written to the ledger, not to the dispatch's count.

## 4 · The wave 24 close

`DECISIONS.md`, block **W24 closing**. W24-09, W24-09a and W24-09b ratified with their
deviations. Q-W24-02 closed with the header state final and its own `-7px` figure
reproduced by measurement rather than quoted. Q-W24-03 closed on the owner's decision,
which is the shipped default, so no change follows. Q-W24-04 closed at nine.

**New doctrine, `docs/CLAUDE.md` section 12.0**: a card is complete only when
`verify-live.js` passes against the deployed sha after its merge; the terminal runs it
unprompted and names the process and its exit code. It carries the two traps this wave
already paid for (poll the edge until it serves the merge sha, and pass the full
forty-character sha) and the harder half: **when it fails, find the cause by measurement
before proposing a fix.**

## Gates

Every gate its own process, its own exit code read (R-AB). **19 of 19 exit 0**, gates 20,
21 and 22 included.
