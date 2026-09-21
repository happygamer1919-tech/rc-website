# W25-08 · Thirty-three attempted, fifteen filled, and a reason for each of the eighteen

Card W25-08. Branch `w25/w25-08-manufacturer-packshots`, stacked on
`w25/w25-07-phomi-swatches`. PR only, stops for the owner. **Q-W25-08 approved as W25-R10.**

## The headline

**Catalog slots filled: 74 of 261 before, 89 of 261 after.**

Every one of the 33 branded catalogue products without a picture was attempted. **Not one
was reported absent without being looked for**, which is the whole point of the card:
W25-02 reported eleven manufacturers as unattempted after its agents stalled, and that was
nearly read as "they have nothing".

## Attempted against filled, per manufacturer

| Manufacturer | In scope | Attempted | **Filled** | Why the rest are not |
|---|---|---|---|---|
| **Caparol** | 15 | 15 | **14** | `CAT-0005` is the same CT80F board as `CAT-0002`, two records of one product |
| **Ceresit** | 1 | 1 | **1** | |
| Baumit | 5 | 5 | 0 | **400x400**, short of the floor by 50px, on `.md`, `.ro` and `.com` alike |
| DURAZIV | 2 | 2 | 0 | **343x335**, short by 107px, re-measured on `duraziv.ro` today |
| SWEETONDALE | 2 | 2 | 0 | the maker is TechnoNICOL; held on origin and identity, Q-W25-14 |
| ISOMAT | 1 | 1 | 0 | **270x270**, short by 180px; `isomat.eu` publishes no larger file |
| STANCOLAC | 1 | 1 | 0 | **publishes no packshot at all**, only interior room scenes |
| ROKO AquaMix | 1 | 1 | 0 | **423x400**, short by 27px |
| Penoplex | 1 | 1 | 0 | only `penoplex.ru`, which W25-R6 forbids |
| KREISEL | 1 | 1 | 0 | no reachable product page for Kreisel 215 |
| IZOVAT | 1 | 1 | 0 | `izovat.ua` answers, its product pages do not |
| FAWORI | 1 | 1 | 0 | no reachable official site |
| NOVOTERM | 1 | 1 | 0 | no reachable official site |
| **Total** | **33** | **33** | **15** | |

## The one that would have been a wrong product

`CAT-0036` is "Projekt Grund pentru tencuieli decorative". The obvious page on `caparol.md`
is **PutzGrund**, and the packshot was already fetched from it. **Caparol publishes a
separate ProjektGrund**, at
`/produse/grunduri/grunduirea/pigmentabile-diluabile-cu-apa/projektgrund/`, and that is the
one our record names. The wrong bucket was replaced before anything was installed. Two
products, one syllable apart, and W25-R4 forbids exactly that near match.

## The Caparol licence, and why the rows do not cite W23-04

R-W says "Caparol rows cite the W23-04 permission instead". **These rows carry W25-R1's
fixed string instead, and that is deliberate**, because the W23-04 permission is the
**media database** permission and these files did not come from the media database. Its two
conditions are ones this build does not meet:

1. It is granted to a **registered user** of the media database. W23-04's own ratification
   note says "No account is claimed".
2. It permits **no modification of the files**. `scripts/process-packshot.js` re-encodes and
   resizes every image it installs.

**Citing a permission whose conditions are not met would be worse than citing a string that
says plainly that no licence was verified.** These 14 came from Caparol Moldova's ordinary
public product pages, which is what W25-R1 approves and W25-R6 widens by naming Caparol
Moldova. Recorded for ratification below.

## Where the images came from

Every file came from the manufacturer's own domain: `caparol.md` (14) and, for Ceresit,
`dm.henkel-dam.com`, which is Henkel's own asset domain and Henkel owns Ceresit. The page
that published it was `ceresit.md`. Both hosts passed the fetch guard.

**Discovery used search, which W25-R6 now allows**, and the download still went through
`scripts/fetch-packshot.js`, which is the only thing in this repo that reaches the network
for an image. Nothing was downloaded from a page a search found without that guard seeing
the host first.

Two pages needed a real browser to read at all: Ceresit's product page builds its image
list in JavaScript and serves nothing in the HTML. It was rendered headless to find the
asset URL, and the URL was then fetched through the guard like every other.

## Looked at, all fifteen

No watermark, no retailer logo, no face, no other seller's branding on any of them. The
brand lettering on a bag or a bucket is the product's own label, not a mark laid over the
photograph, which is the same reading W25-07 recorded for ROKO and ROCKWOOL.

**`CAT-0002` sits on a pale blue ground** rather than white, which is how Caparol publishes
that one file. It is the only one that is not on white and it is noted rather than
corrected, because correcting it would mean editing a manufacturer's photograph.

## Gates

**22 of 22 exit 0**, reported by `node scripts/run-gates.js`. Gate 19 reads `ledger slots
filled: 89 of 261`.

## Recorded for ratification

1. **Caparol rows carry the W25-R1 string, not the W23-04 permission.** Reasoning above.
2. **`CAT-0005` was left grey** as the second record of one Caparol product, the same
   situation Q-W25-13 describes for the Phomi plates. It is counted in that question's
   scope.
3. **Ceresit's image comes from `dm.henkel-dam.com`**, which is Henkel's own domain rather
   than `ceresit.md`. Henkel owns Ceresit, and the publishing page is `ceresit.md`.
