# W26-10 · The last fifteen empty products, at floor 300

Card W26-10. Branch `w26/w26-10-last-slots`, stacked on W26-07 (#130). PR only.

## Attempted 15, filled 15

**Every catalogue product now has a picture.** What is still empty on the site is the roofing
page: six tiles and nine product cards, which W26-11 fills.

| Where the picture came from | Slots |
|---|---|
| the product's own Fatade 3D page | 11 |
| the maker's own site (Fawori, Novatik) | 2 |
| found by search (`google_pick`) | 2 |

**Four are under the site's normal 450px floor** and are flagged `low_res` in your review list:
Penoplex (400), the LGX dowel (400x266), Baumit DuoTop (400) and ROKO Omitka (423). Nothing
larger of those four exists; the makers' own sites serve the same size or smaller.

## Seven were never missing

Seven of these products had a good picture, 600 to 1200px, **on their own supplier page all
along**. An earlier pass missed them, and the card after it searched other shops and wrote "no
stockist found". That was wrong, and those recorded reasons are removed with the fills.

## How they were found

Eight researchers worked in parallel, one or two products each, following your sourcing rule in
order: the product's own page, then the maker, then any site except Russian ones. Each was told
to refuse a shop watermark, a shop logo, a face, printed claims and a near match. **I looked at
every file again before installing it.** Refused on the way:

- a supplier image with a **FLAGMA marketplace watermark** (OBIO 165's second picture);
- a **pasted-logo composite** posing as the Fawori product;
- a **colour chart** where the ROKO product photo should be.

## For your review

1. **Baumit DuoTop's bucket label has a small model's face printed on it** by Baumit. It is the
   maker's own packaging and the only picture of this product anywhere, Baumit's sites included.
2. **ROKO's maker says a 4 kg pack**; our record, copied from the supplier, says 20 kg. That is a
   data question, not a picture one, and nothing was changed.
3. **The Mesterul Dibaci adhesive** came from its maker's own site but is recorded as found by
   search, because its record names no manufacturer.

## The rule is in the tool

`process-packshot.js --floor-300` works **only for the fifteen slots your ruling covers** and is
refused for any other, so 450 stays the rule everywhere else. Watched: refused on an unlisted
slot, refused at 400px without the flag, accepted with it. `low_res` is read from each file's
own size, so it cannot be forgotten.

## Heights and slots

**Heights identical to the pixel.** Photo ledger **332 of 347 filled** (was 317).

## Gates

**27 of 27 gate commands exit 0.**
