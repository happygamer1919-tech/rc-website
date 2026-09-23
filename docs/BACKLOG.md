# Backlog

Ticket status for the `rc-website` build. One card, one commit, one branch named
`<wave>/<ticket-id>-<short-slug>`.

Status values: `todo` · `in progress` · `blocked` · `shipped`.

Waves 1 to 5 predate this file; their tickets are reconstructed from the git
history and are all `shipped`. `RELEASE-NOTES.md` carries what each one changed.

## Wave 25

Dispatch of 2026-09-20. **Product pictures.** #89 was merged by the owner and verified
before any card was worked: `origin/main` is `9de1fb4`, and section 12.0's first
application returned `node scripts/verify-live.js` **exit 0, PASS, 0 unverified and 0
failed across 51 pages** against the deployed sha. Every card opens a pull request and
stops (R-V as amended at wave 19), branches are stacked, and the owner merges them in
order. **After each merge the terminal runs verify-live on the deployed sha unprompted and
names the process and its exit code** (section 12.0).

The four owner rulings W25-R1 to W25-R4 ride the first pull request, recorded verbatim in
`DECISIONS.md` as block **W25-R**, with the `public/` consequences amended into
`docs/rulings/R-W.md`.

**R-W gains two approved origins this wave**: the manufacturer's official site, and owner
AI generated. The three forbidden hosts are unchanged, and a generated image is refused on
project, portfolio and before/after slots, which are evidence slots. **W25-R4 decides how
the wave reads: a slot with no compliant image stays a placeholder.** Every empty slot is
reported with its reason; a near match is never installed.

| Ticket | Card | Branch | Status |
|---|---|---|---|
| W25-01 | The image pipeline: a filled slot, its provenance, and the gate that holds them | `w25/w25-01-image-pipeline` | PR open, awaiting owner: one component renders a placeholder box or a real `<picture>`, decided by the ledger and by nothing at the call site; ledger gains `state`, `provenance` and `alt`, all 261 slots ship `placeholder`; gate 19 extended to the filled half with **8 arms**, including the dispatch's two by name (a fatade3d URL, a missing row) plus an unapproved licence, a render on an evidence slot and a state disagreement, against **two** controls; `scripts/process-packshot.js` refuses a non-image, an undersized source and surviving metadata, all three watched firing; gate 20 gains the W24-R5 gradient assertion on filled tiles; **proof run filled two real slots end to end**, found a doubled `/img/img/` path and fixed it, measured the hub label at **6.77:1** over a photograph, then reverted; **WebP is not shipped and Q-W25-01 says why** |
| W25-02 | Packshots: termoizolație, tencuieli, vopsele, alte materiale | `w25/w25-02-packshots-termo` | PR open, awaiting owner: **1 filled of 35 fetchable**, 46 in scope with 11 carrying no manufacturer; `CAT-0010` ROCKWOOL Rockton Super 800x600 from the manufacturer's own brand portal, looked at by a person, **the first real photograph on the site**, rendering with no layout shift; **the 800px source floor is what is emptying the catalogue** (DURAZIV 343x335, ROKO 492x400, all otherwise correct) and Q-W25-02 recommends lowering it; **11 of 14 research agents stalled** so Caparol (15), Baumit (5) and six others are unattempted, not absent, both national sites confirmed live by hand; 2 of 3 agent-claimed image URLs were unusable and only the fetch guard caught them; Q-W25-03 raises a .ru origin and a brand-portal host for your call |
| W25-03b | Packshot rerun under the 500px floor, and a correction to W25-03 | `w25/w25-03b-packshots-rerun` | PR open, awaiting owner: **0 filled**; **28.87GB and 727 temp dirs reclaimed** after verifying every one matched this repo's own mkdtemp pattern and was owned by this user, zero foreign, and **all six browser gates now clean up on exit** (the leak was `fail()` calling process.exit so `stop()` never ran), proved on a passing and a deliberately failing run; floor implemented at 500/600 with **499 refused** as ruled and nothing ever upscaled; **W25-03's central finding was WRONG**: 51 of the 88 plates are Phomi products, not 17, because I matched category listings instead of the colour variants inside them, so no `brand_hidden` was applied and Q-W25-06 asks you to re-rule; and the corrected 51 still fill nothing, the 18 family images being 459px and the 33 variants carrying their English names burned into the picture; **the 500 floor unlocks nothing**, the measured population being 343 to 492 with ROKO short by 8px (Q-W25-07 recommends 450) |
| W25-03 | Packshots: plăci ceramice | `w25/w25-03-packshots-placi` | PR open, awaiting owner: **0 filled of 88**, two independent blocks both measured; **the 800px floor now confirmed on the manufacturer carrying 88 products** (`phomi.com`'s own tile faces are 459x398, clean and correct in every other way), making Q-W25-02 the single decision gating the largest card in the wave; and **70 of the 88 are not Phomi products at all**, matched name by name against the manufacturer's own catalogue, with the source's own URLs disagreeing with its own names (`elysee-pure-white` displayed as "Kamu Yellow"), so the site currently states a manufacturer for 70 products that manufacturer does not make; Q-W25-04 recommends hiding those brand lines; worked directly without agents after W25-02's 11-of-14 stall |
| W25-03c | The floor moves to 450, and twenty-six slots fill | `w25/w25-03c-intake-450` | PR open, awaiting owner: **slots filled 1 of 261 before, 27 of 261 after**; 25 Phomi families at 459x398 and `CAT-0033` ROKO AquaMix at 492x400, every one from the manufacturer's own site and looked at by a person; **the full Phomi walk moved the family count from 18 to 25** and caught `CAT-0111` "Rusty Slab", which Phomi's product page calls "Rusty Stone" and only its category card names our way; **60 colour variants stay placeholders on a measurement**, the smallest crop that removes the burned-in English name leaving 650x320 or 350x450, both short; `CAT-0038` short by 27px at 423x400 and DURAZIV short by 107px at 343x335, re-measured; floor 450 with **8 arms** watched including `--label` with no `--crop`, and the crop proved directional; gate 19 gains the one-picture-one-card rule with **2 new arms**, 10 in all; **21 of 21 gates exit 0** and the note names why four cards said 19; Q-W25-05 written down at last, Q-W25-08 and Q-W25-09 opened |
| W25-03d | Three catalogues walked, and the brand of all 88 plates settled | `w25/w25-03d-brand-settlement` | PR open, awaiting owner: **settled counts Phomi 85, Ecofasad 0, Kordeko 0, `brand_hidden` 3**; the false-attribution count went 70 then 37 then **3**, and it is data now in `content/plate-brand-settlement.json` with the matched name, tier and catalogue page per plate; 10 of 10 sampled matches verified against the name **Phomi burns into its own swatch**, including `Y001-01-02` exactly, which is what settles the code-like names; **Ecofasad names none of its 102 textures** (`rock-1808`, `marble-1801`) so no plate name can match one, reported not attempted; Kordeko's 22 named flexible tiles hold none of the three residuals; **no Russian domain found, so none fetched**; new **gate 23** `check-plate-brands.js` holds the records to the settlement both ways with **9 arms** and both real defects watched fire on the shipping files; **`scripts/run-gates.js` shipped** reading `quality.yml` itself after the hand-written runner went stale a second time inside one session, 3 arms watched; **22 of 22 gates exit 0**; Q-W25-10 and Q-W25-11 opened |
| W25-04 | Packshots: sisteme de iluminare | `w25/w25-04-packshots-iluminat` | PR open, awaiting owner: **0 filled of 25**, re-derived today, 0 of the 25 name a manufacturer and none has gained one; **attempted, not assumed**, which is W25-02's lesson: three source pages read for text carry no manufacturer field at all, and `K1207` and `GMD-881` searched as model codes return unrelated catalogues, so they are OEM codes and a confident guess would put a different lamp on the card; all 25 handed to W25-05 by name; **gate 19 gains the rule the card's number cannot keep**, a filled slot whose record names no manufacturer may not claim a manufacturer packshot origin, watched fire synthetically and on the shipping files, 11 arms; 103 catalogue products now have no usable manufacturer; **22 of 22 gates exit 0** |
| W25-05 | The AI prompt pack, written outside the repo | `w25/w25-05-ai-prompts` | PR open, awaiting owner: **126 prompts written, 135 rows held with a reason each**, to `~/Documents/rc-audit-w24/AI-PROMPTS-W25.md` outside the repo; **generated by `scripts/gen-ai-prompts-w25.js` from the ledger and the records**, not typed, so it shrinks by itself as slots fill; the biggest held group is **67 named tile products** (63 ceramic plates and the 4 Novatik tiles) on W25-R2, which is the rule that kept 60 plates grey at W25-03c and would be walked around by generating them; 8 evidence slots held on W25-R3, 33 held as packshot work, 27 already filled; the style block's first rule is no text, for the same reason; unbranded materials prompted as the MATERIAL never a package, so no card invents a manufacturer's sack; **89 of the 126 are products whose appearance the records do not describe** and every one is marked, Q-W25-12 recommends splitting; **Q-W25-10's option (a) withdrawn** as contradicting W25-R2; 22 of 22 gates exit 0 |
| W25-07 | Install the Phomi labelled swatches on their variant cards | `w25/w25-07-phomi-swatches` | PR open, awaiting owner: **slots filled 27 of 261 before, 74 of 261 after**; ceramic plates **25 of 88 to 72 of 88**; 47 Phomi colour swatches at 600x415, each flagged as carrying a burned-in name per W25-R5; **looking at them verified the brand settlement a second time, 47 of 47 labels agreeing** including every non-exact tier (Loki Mountain, Romam/Roman, Agean/Aegean, Y001-01-02 printed exactly); the six rulings recorded as **W25-R5 to W25-R10** in the new `docs/rulings/W25-R.md`, the next free id being R5 because R4 is in use, with the pre-existing W25-R2/W25-R3 block-name collision resolved by reading not renumbering; `--label` now records instead of refusing, the crop floor unchanged and re-watched; **11 slots held by the one-picture-one-card rule**, which fired on real data for the first time and is refusing a CORRECT install because Phomi publishes one swatch per colour and our records are the same face in different sheet sizes (Q-W25-13 recommends comparing the product, not the file); 2 more held as a family name with no colour; **22 of 22 gates exit 0** |
| W25-08 | Manufacturer packshots for every remaining branded catalogue product | `w25/w25-08-manufacturer-packshots` | PR open, awaiting owner (Q-W25-08 approved as W25-R10): **slots filled 74 of 261 before, 89 of 261 after**; **33 attempted, 15 filled**, and a measured reason for each of the 18: Caparol 14 of 15, Ceresit 1 of 1, **Baumit 0 of 5 at 400x400 on `.md`, `.ro` and `.com` alike**, DURAZIV 0 of 2 at 343x335, ISOMAT 0 of 1 at 270x270, **STANCOLAC publishes no packshot at all, only interior room scenes**, ROKO mozaika short by 27px, Penoplex `.ru` only, and KREISEL, IZOVAT, FAWORI, NOVOTERM not findable (Q-W25-14); **`CAT-0036` would have been the wrong bucket**, Caparol publishing a PutzGrund and a separate ProjektGrund and our record naming the second; **Caparol rows carry the W25-R1 string and not the W23-04 permission**, because W23-04 is the media-database permission and needs a registered account and forbids modifying the file, and this pipeline re-encodes every image; Ceresit's page had to be rendered headless to find the asset URL, which then went through the guard like everything else; **22 of 22 gates exit 0** |
| W25-09 | Dasterum data: seven roofing categories, walked and copied | `w25/w25-09-dasterum-data` | PR open, awaiting owner: **76 listings walked, 76 copied, 71 distinct products** across all seven categories, none skipped, none empty or 404; **eight new catalogue pages in both locales** on the W24 template, parent at `/catalog/materiale-acoperis/` because `acoperisuri` is the service page's slug and `build.js` refuses a collision (label unchanged, all existing URLs kept); linked from the acoperisuri hub and the tigla metalica page, both reusing `.link-arrow` under rule 3.1; **prices per W25-R8**, the current figure only, 6 listings' old prices and percent badges refused; **Dasterum publishes no RU product page at all** (11 `/ru/` URLs in its sitemap, none a product, all 71 checked), so names are kept verbatim in both locales and no copy is invented; the records carry **no brand**, Dasterum being the supplier and W17-02 refusing the name on a catalogue page; 72 placeholder ledger rows land here because `build.js` will not render a placeholder without one; budgets measured plus 60 in R-Y, the parent at 11,857px, and the tigla page **re-measured against a control** (+39) while the acoperisuri hub did not move; `catTiles` 7 to **8**; **22 of 22 gates exit 0** |
| W25-10 | Dasterum product images, under the direct_supplier ruling | `w25/w25-10-dasterum-images` | PR open, awaiting owner: **slots filled 89 of 333 before, 160 of 333 after**; all **71 Dasterum products pictured**, every image 488x488 and written at 488 with no upscaling, **watermark left exactly as published** and nothing cropped or inpainted; the direct_supplier origin implemented as fixed text that names its own host, lifted by exception in three places rather than by removing `dasterum.md` from any ban list, so a row that drifts off the sentence loses the permission; `fetch-packshot.js` needs an explicit `--dasterum` and still refuses fatade3d and imperlux with it; **writing the self-test arm found a real defect in R-W interpretation 3**, gate 19's host pattern never matched a SUBDOMAIN, so `www.dasterum.md` had always slipped past, now fixed with both of interpretation 3's own counter-examples still holding; gate 19 at **12 arms**; **22 of 22 gates exit 0** |
| W25-11 | Garduri prices on the models page, from the supplier's public page | `w25/w25-11-garduri-prices` | PR open, awaiting owner: **all 8 models priced**, both locales, the `de la` figure imperlux.md publishes (IL12 500/680, IL30 668/822, IL40 749/926, IL100 906/1128 lei/m2); **text only, no Imperlux image fetched**; the three things W25-R8 and R-X forbid are on that page and none is copied, struck prices, `- 15 %` badges and a limited-offer banner, with `check-scarcity.js` green from the other side; the price REPLACES `Preț la cerere` with a fallback if a price is ever removed; **the first attempt reused `.prod__price` and gate RC-129 refused it**, because that class carries a rule as well as a look, so the class is `.nvk__price`, grepped free per rule 3.1; **the page got 34px SHORTER and both budgets were lowered**, 3780 to 3746 and 3802 to 3767, the first lowering this build has done; **22 of 22 gates exit 0** |
| W25-12 | The photo review list, and the priority batch | `w25/w25-12-photo-review` | PR open, awaiting owner: **`docs/PHOTO-REVIEW-W25.md`, 160 rows installed and 162 empty** across Catalog, Acoperisuri and Garduri; **generated, not typed, and held by new gate 24**, because W25-R5 and W25-R7 each make a flag in this list part of the permission to use the picture at all, so a list that can drift makes a permission unverifiable; no flag is typed, each traces to the settlement's level, the licence or the tier; 47 labelled swatches, 71 watermarks, 7 low-confidence matches, 42 plain; **table two gives every empty slot a reason that traces to a card or a ruling**, the 8 GARD model cards reading "real photo from owner project set"; the prompt pack **loses 89 entries to W25-R9** including the 25 lamps this terminal had recommended generating, and gains a **PRIORITY BATCH of 8 hub tiles** at the top, with the generator dying rather than warning on either; pack 126 entries to **30**; **23 of 23 gates exit 0** |
| W25-13 | Gate 9 waits before it measures, plus a bounded logged re-read | `w25/w25-13-verify-live-ready` | PR open, awaiting owner: W25-R11 to W25-R13 recorded first; **root fix, not a sleep**, a page is measured only once `--brand` resolves (which IS the stylesheet having applied, it being a custom property in `src/styles.css`) and `.promo` is present (all ten marker sets expect promoBar 1); the wait is bounded and a never-ready page reports `NOT READY` with which half is missing; **re-read bounded three ways**, max 2, unverified only, never a failed row, every reading printed as `RETRIED` and counted in the summary, R-AB exit code unchanged; **`--prove` runs 8 assertions between two controls**, all pass, including waiting 1,216ms for a document whose token and promo arrive at 1,200ms; **the forced slow run proved nothing and that is recorded**, 94 responses held 4,000ms each and the row still read 3,464px VERIFIED, because a render-blocking link also delays the load event and `Runtime.evaluate` waits for the new context, so the 900px row is NOT reproducible by making the network slow; **23 of 23 gates exit 0** |
| W25-14 | Second pass on the nine under-floor products | `w25/w25-14-underfloor-second-pass` | PR open, awaiting owner: **9 attempted, 0 filled**, under W25-R12 which forbids an exception; every one now has TWO independent sources measured on the manufacturer's own domain; **Baumit publishes 400x400 and nothing else** on `.md`, `.ro` and `.com`, `?w=1200` is ignored, three alternate path shapes 404, and **the five datasheet PDFs its own technical-documents page links 404 on two of its domains** while `int.baumit.com` did not answer in ten minutes; **DURAZIV's own datasheets embed the same small packshot**, 345x359 and 343x335; **ISOMAT's datasheet has no packshot at all**, two JPEGs at 393x104 and 126x89, a logo and a mark; **ROKO's material is a leaflet**, a 1654x310 banner and two 1867x1320 brochure spreads with body copy, a logo and a dealer box, which W25-R2 refuses; new `scripts/extract-pdf-images.js` lifts a DCTDecode stream **verbatim**, no re-encode and no resize, which is what makes the PDF an origin at all; **nothing changed in the tree**; **23 of 23 gates exit 0** |
| W25-15 | CT80F duplicate, per the duplicate ruling | `w25/w25-15-ct80f-duplicate` | **BLOCKED on the owner, Q-W25-16.** W25-R13 drops a record only when name, unit and price are identical and blocks otherwise; **all three differ**: `Polistiren expandat CT80F` against `CT 80 F - Polistiren expandat`, RU unit `1000 x 500 mm` twice against `1000x500x30 мм`, and **7,62 to 76,20 lei against 6,50 to 65,00 lei**, about 15 percent apart. The RO variant lines are the same ten thicknesses, which reads as one product; the RU line names a single 30mm board, which reads as two. The data supports both and picking one would decide what the shop sells. Q-W25-16 quotes both rows in full with four ways out. **Nothing changed in the tree**; 23 of 23 gates exit 0 |
| W25-16 | Owner intake prep: two folders, two lists, nothing taken in | `w25/w25-16-owner-intake-prep` | PR open, awaiting owner: **`/Users/ivan/RC-pics-real/` created**, and **`RC-pics-ai/` too**, which the dispatch did not name but which the prompt pack has pointed at since W25-05 and which did not exist; each carries a `README.txt` with the naming rule and the floor; **`docs/OWNER-INTAKE-W25.md` holds both lists**, generated and held by new **gate 25**, because the intake matches on the filename being the slot id EXACTLY so a hand-typed id is a file nothing finds; the 8 GARD model names come from `content/garduri-modele.json` and the 8 hub tile labels from the BUILT pages, so a label is what a visitor reads; **the four hub ratios are not all the same** (5/6, 7/2, 7/4); gate 25 refuses a slot already filled, a hub slot with no label, and either list not being eight; **nothing taken in**; **24 of 24 gates exit 0** |
| W25-06 | AI intake | `w25/w25-06-ai-intake` | **blocked on the owner**: waits for files in `/Users/ivan/RC-pics-ai/` |

**A brand-hidden product is skipped by W25-02 to W25-04 and goes to W25-05.** The 64
RedConstruct records carry `brand_hidden` and have no manufacturer to fetch from.

## Wave 24

Dispatch of 2026-09-19. #71 to #77 were merged by the owner and verified before any card
was worked: `origin/main` is `7ab06dd`, and local `main` was stale at `5e4050d` and was
fast-forwarded first. Every card opens a pull request and stops (R-V as amended at wave
19), branches are stacked, and the owner merges them in order. Skip, never halt.

The nine owner rulings W24-R1 to W24-R9 ride the first pull request, recorded verbatim in
`DECISIONS.md` as block **W24-R**. ~~The eight board cards are~~ **AMENDED (W24-09): nine
board cards**, `docs/board/W24-01-placeholder-system.md` through
`docs/board/W24-09-mobile-catalogue-layout-gate.md`.

**Second dispatch, 2026-09-20.** #78 to #85 were merged by the owner, and `origin/main` is
`2ab3a4b` with all eight wave 24 cards on it, confirmed before W24-09 was worked. The owed
F-22 live verification was run against that sha and is reported on the W24-09 card: it
found **2 real budget breaches** (Q-W24-05) and **6 markers left stale by W24-07a's
rename**, which W24-09 corrects. The strategy ratification of every wave 24 deviation is
recorded in `DECISIONS.md` as block **W24 ratifications**.

**Every image in this wave is a placeholder.** A separate photo session fills them. No
card sources, downloads or requests an image, and nothing from `fatade3d.md`,
`imperlux.md` or `dasterum.md` enters the repo as a file (W24-R2).

| Ticket | Card | Branch | Status |
|---|---|---|---|
| W24-01 | The shared placeholder component and the photo slot ledger | `w24/w24-01-placeholder-system` | merged #78 `9b9f25d`: one `.ph` component, `docs/PHOTO-SLOTS-W24.json` and gate 19 holding them to each other in both directions; the ledger ships empty on purpose and the gate's three-arm self-test is what makes it a gate meanwhile; W24-R recorded verbatim; the seven wave 23 backlog rows corrected (F-23); the wave index moved to the session memory folder (F-28, Q-W24-01) |
| W24-02 | The Catalog button moves next to the logo, in every header copy | `w24/w24-02-header-catalog-button` | merged #79 `71f9646`: the control moved right of the logo in all four templates and took `.btn--primary`'s paint; white on `--brand` is 3.41:1 so the label went to 19px/700 with the colour, which cost 15px RO and 16px RU and took the fit gate red; **one fix**, the nav gap 20px to 14px, returns 18px and leaves RO 22px / RU 9px, 108 of 108 green; on a phone the label is `--ink` at 14px, 5.10:1; 8 browser readings, 0 failing; Q-W24-02 |
| W24-03 | Every fatade3d product, extracted into the repo's own records | `w24/w24-03-catalogue-data` | merged #80 `ed7dac4`: **223 products**, 14 categories, all six control samples matched; `content/catalog-products.json` reshaped to `products` plus a category index because ten names are used by two products each; **one bad record now fails that record with a named error, not the build**, watched on four arms; 27 brands withheld and 2 names rendered with a refused manufacturer removed (W17-02); 37 RU names reuse RO under W24-R9 and are listed; `docs/CATALOG-SOURCE-W24.md`; nothing rendered yet, W24-04 builds the card; Q-W24-03 |
| W24-04 | The catalogue gets a card, a grid, a page per subcategory and an index | `w24/w24-04-catalogue-layout` | merged #81 `4962eb4`: **30 catalogue pages** where there were 14, all 223 products rendered, 512 cards over the two locales; a page per subcategory (**F-03**) and a `/catalog/` index (**the live 404**); the price gate re-scoped under W24-R3 to `.prod__price` carrying its own `data-product`, **13 negative arms each firing on its own message between two clean controls**; the prose requirement scoped to the 7 parent pages and a grid required of every subcategory; 230 ledger rows; 30 new height budgets in R-Y, measured plus 60; `src/catalog-index.html` registered in both template-count gates; no new colour value |
| W24-05 | The before/after slider is turned on, with placeholders that prove it moves | `w24/w24-05-before-after` | merged #82 `07bee6b`: the slider moves off the homepage (where it had never rendered) onto the case la cheie page, both locales; 4 projects, 8 placeholder slots, before light and after dark so the drag is visibly working with no photographs; **20 of 20 browser assertions pass in both locales**, drag, keyboard, arrows and no auto-advance; two new height budgets, the page leaving the shared 6,000px service budget under W24-R4; the ledger's slot id rule relaxed to match the dispatch's own `BA-01-before` |
| W24-06 | The roof offers leave the homepage, and tigla metalica becomes a child of acoperisuri | `w24/w24-06-homepage-ia` | merged #83 `939960a`: **the homepage loses 1,312px RO / 1,371px RU**, the four roofing offers now render on the acoperisuri page; the first teaser becomes ACOPERIȘURI from the service's own shipped strings; tigla metalica takes a three-level breadcrumb, leaves the header's top-level list and **keeps its URL**; new shared `/in-constructie/` page, noindex, out of the sitemap, both locales; five new height budgets, the homepage's going DOWN for the first time; `verify-live.js` asserts roofOffers 0 on the homepage and 4 on the roofing page so neither can pass for the other |
| W24-07 | Acoperisuri becomes a hub, with a bento at the top and a new Novatik page | `w24/w24-07-acoperisuri-hub` | merged #84 `ee52010`: the bento is the first section after the header, 4 tiles, the Reduceri tile **is a div and not a link**, aria-disabled, no hover, no pointer; new `/servicii/roca-vulcanica/` mirroring the imperlux hub under R6 and R7; **32 company facts and every price held**, listed in `docs/W24-CLAIMS-HELD.md` with page and position; three whole sections render nothing and are absent rather than empty; the W22-01 phrase widened to its SHAPE not to a page, 4 negative arms; 2 new height budgets; `verify-live` asserts 4 tiles of which exactly 3 are links; **corrected by W24-07a**: the bento classes collided with the garduri page's and the tall tile rendered 128px wide against an intended 373, with all eighteen gates green, because no gate reads a layout |
| W24-08 | Garduri gets the same bento, and copertine gets a hero and a cross-sell row | `w24/w24-08-garduri-copertine` | merged #85 `2ab3a4b`: the fence bento on the garduri page, the Preturi si oferte tile inert; new `/servicii/modele-garduri/`, 8 cards; the copertine dark hero with a two-line H1 and **one of three facts surviving R6**, the other two held; a **two-card** cross-sell row because RC has no soffit page; all 5 product pages in the phone menu (**F-02**); `docs/W24-CLAIMS-HELD.md` complete at **54 claims** across three source pages; 6 new height budgets |
| W24-09 | The phone catalogue reveal, gate 20, and the wave 24 ratifications | `w24/w24-09-mobile-catalogue-layout-gate` | PR open, awaiting owner: **`/catalog/placi-ceramice/` goes 47,917px to 10,189px at 390** and the RU copy 49,963 to 10,760, twelve cards then a full-width reveal, every card still in the HTML and **all 88 shown with JS off**; new **gate 20** `check-layout-geometry.js` reads computed geometry in a real browser, 64 of 64, **4 arms including the wave 16 collision re-injected**, control clean either side; the five `PLacă` typos corrected in RO with `source.name` left verbatim (RU never had them); RedConstruct withheld on 64 records, none removed; **37 stale backlog rows** corrected from `gh`, not 23; `/review/` disallowed in every robots group; the parent-href build rule removed; `verify-live`'s bento markers corrected after W24-07a, which is what made 6 rows UNVERIFIED; 30 budgets re-measured; Q-W24-04 and Q-W24-05 opened |
| W24-09a | **DEFECT**: W24-09 shipped `verify-live.js` in a state where loading it threw | `fix/w24-09a-verify-live-backticks` | PR open, awaiting owner: backticks in a comment **inside** the probe template literal made the expression a tagged template with a string tag, so the file **parsed** (`node --check` exits 0) and threw `TypeError` on load; `quality` never loads this script because it measures the deployed site, so nineteen gates were green on a file that could not run; found by the post-merge run gate 9 itself owes; new **gate 21** `verify-live.js --self-check` loads the module and compiles its probes, no network, no browser, **negative-tested on the shipped-broken file itself** plus a planted backtick, control clean either side; a parse gate was written first and thrown away because it would have passed this file; **live run on `dac281d` now 0 unverified**, down from 6, with all 30 new budgets confirmed to the pixel, and the 2 known `case-la-cheie` breaches left to Q-W24-05 |
| W24-09b | **DEFECT**: W24-07's second class collision, `.faq`, moved all twenty service pages | `fix/w24-09b-faq-class-collision` | PR open, awaiting owner: W24-07 added a bare `.faq` for the roca vulcanica page and the service pages had owned `.faq` since wave 14; later-wins plus `.faq > div` (0,1,1) beating `.faq__item` (0,1,0) added **exactly 99px to all 20 service pages, live for two days**; surfaced only as case la cheie breaching the budget W24-05 had just given it, the other 18 having slack to hide it; **W24-09's attribution to W24-05 was wrong and Q-W24-05's recommendation to re-budget would have written the defect into a ruling** -- bisected across #82 to #86 by measurement; renamed to `.nvk-faq`, every service page back to its pre-W24-07 height **delta 0**, no budget moves, roca vulcanica 4,288 to 4,234 which is what W24-07 specified; new **gate 22** `check-css-collisions.js`, self-tested on **both** wave 24 collisions from git and proven to fail `origin/main`; Q-W24-05 closed |
| W24-10 | Nine cards on a phone, the wave 24 close, and the two owner sheets | `w24/w24-10-prod-step-and-owner-sheets` | PR open, awaiting owner: `PROD_STEP` 9 per Q-W24-04, **`/catalog/placi-ceramice/` reads 8,696px at 390, inside the dispatch's phone target**, and the RU copy 9,182 is recorded rather than acted on; **no desktop budget moves** and all five reveal pages re-measured at 1440 to prove it; the step is now substituted into the button's accessible name so the spoken count cannot drift from the behaviour, and gate 20's fold arm reads the count off the page instead of carrying its own 12; **new doctrine, `docs/CLAUDE.md` section 12.0**: a card is complete only when verify-live passes against the deployed sha after its merge, run unprompted, process and exit code named; W24 closing block with Q-W24-02, Q-W24-03 and Q-W24-04 closed, so **all five wave 24 questions are now closed**; two owner sheets written OUTSIDE the repo, `CLAIMS-MIHAI.md` (54 rows to 29 Romanian yes/no questions, 15 excluded as prices, 39 + 15 = 54 with no overlap and none missing) and `PHOTO-SESSION-W24.md` (261 slots, 0 missing, highest-impact first; **the dispatch's "3 hub bentos" is 2**, eight slots) |

## Wave 23

Dispatch of 2026-09-18. #68, #69 and #70 were merged by the owner and verified as
ancestors of `origin/main` (`d756298`) before any card was worked: `7c7654d`, `fb938fc`,
`d756298`. Every card opens a pull request and stops (R-V as amended at wave 19). The
wave 23 rulings (the R-W amendment for client-supplied originals, and Q-SUPPLIERS) and
the five board cards ride the first PR.

| Ticket | Card | Branch | Status |
|---|---|---|---|
| W23-01 | Photo batch 2 intake: inventory, strip, review, map, provenance | `w23/w23-01-photo-intake` | merged #71 `d011449`: 22 files read, **1 published** (F-PORT-6), 21 held with reasons; no GPS in the originals or the tree; new gate 17 `check-image-metadata.js`, 6 arms; Q-W23-01 opened; **corrected by W23-01a**: gate 17 reads every image by its bytes, in every format, with a parser self-test; nine review findings closed; 13 new arms each passed W23-01's gate and fail this one |
| W23-02 | Before/after: pair, check the angle, publish only what passes | `w23/w23-02-before-after` | merged #72 `b3af2e8`: 4 pairs read and looked at, **4 rejected**, every one because its "after" is a 3D visualisation and a before/after slot is a proof slot (pair 3 also fails the same-angle test); no data or page change, the slider stays off; one real photograph of a finished house turns it on |
| W23-03 | Portfolio roofs, team portrait, garduri photos | `w23/w23-03-portfolio-team-garduri` | merged #73 `6b97d26`: **6 of 63** filled, one new (F-PORT-6, committed in W23-01); the other 21 files have no empty hosted slot, 49 manifest slots still have no host component; no locality taken, the names carry none and R-U keeps `location` empty; `acoperisuri-06` waits on a title and summary (Q-04) |
| W23-04 | Supplier record, and a per-brand licence scan | `w23/w23-04-supplier-licence-scan` | merged #74 `5c89b4c`: the answer recorded verbatim with its ruling; all 20 brands scanned, **1 permitted** (Caparol, with conditions and a licence URL), 6 editorial or press only, 3 reserved, 10 with nothing published; no image downloaded; two rows record a page that could not be read (Ruukki certificate expired, Creaton 404) |
| W23-05 | Catalogue draft, not rendered | `w23/w23-05-catalogue-draft` | merged #75 `5e4050d`: `docs/CATALOG-DRAFT.md`, **3 candidates in 2 of 7 categories, none complete, no category reaching three**; every drafted value carries a manufacturer source URL and every unsourced line reads NOT PUBLISHED; three categories have no candidate because no listed brand makes those products and none makes lighting; zero price or currency strings; nothing rendered |

**Second dispatch, 2026-09-19.** #71 to #75 were merged by the owner and verified before
either card was worked: `origin/main` is `5e4050d`, and `quality` run 35441684157 on it
is green, every step read. The W23 ratifications ride the first PR.

| Ticket | Card | Branch | Status |
|---|---|---|---|
| W23-06 | DEFECT: the Servicii dropdown's rows are invisible until hover | `w23/w23-06-dropdown-contrast` | merged #76 `801dfe7`: reproduced live on `5e4050d`, 13 of 13 rows 1:1 white on white in RO and RU at 1280 and 1440; cause `.nav a` (0,1,1) outranking `.svcmenu__link` (0,1,0), present since W15-02; fixed as `.nav > a`, rows now 17.4:1; new gate 18 `check-nav-contrast.js`, 56 combinations on 40 pages, 5 arms each red on its own message between two green controls; the rows' built type restored too, so the panel is taller (Q-W23-02 opened) |
| W23-07 | The RO nav label "Despre" becomes "Despre noi" | `w23/w23-07-despre-noi` | merged #77 `7ab06dd`: one string, `header.navAbout` in RO; RU unchanged; header fit green at every width, RO least slack 47px to 19px against the 8px floor, no type or spacing touched; "Despre noi" in the nav of 20 of 20 RO pages that carry one (three RO pages carry no nav); the phone menu and footer read it too, being the same string |

## Wave 22

Dispatch of 2026-09-17. #63 to #67 were merged by the owner and verified as ancestors of
`origin/main` (`b6ff0a7`) before any card was worked: `c7cecbe`, `76261a8`, `be91c39`,
`9ae19cb`, `b6ff0a7`. Every card opens a pull request and stops (R-V as amended at wave
19). The wave 21 ratifications and the owner's ruling on Q-W21-01 ride the first PR.

| Ticket | Card | Branch | Status |
|---|---|---|---|
| W22-01 | The Q-W21-01 ruling: the price-on-request phrase, permitted on a product card and nowhere else | `w22/w22-01-price-on-request-ruling` | merged #68 `7c7654d`: permitted only as a product card button's whole text, blanked before the price patterns run; a new site-wide scan of all 45 built pages refuses it anywhere else; 8 arms fired, including the dispatch's Latin-u spelling and a real price inside a permitted button; the dispatch's RU string is corrected to its Cyrillic spelling |
| RC-151 | W22-02 Two environment facts a future terminal will find | `w22/rc-151-environment-facts` | merged #69 `fb938fc`: `docs/CLAUDE.md` section 18, with both facts, how to verify each properly and the inverse trap; pointers from section 12 and from the RELEASE-NOTES reading list |
| RC-152 | W22-03 Catalogue readiness: the form the product list is filled into | `w22/rc-152-catalogue-readiness` | merged #70 `d756298`: `docs/CATALOG-PRODUCT-FORM.md`, nine fields per product with their rules, the minimum viable record (all nine), the measured behaviour at 0, 1, 2, 3 and 4 to 6 records with a recommended default, a block to copy per product, and what happens after; no product named, no count restated |

**The dispatch assigned no RC number to the ruling card**, so it is tracked by its wave
id, the way the critic's defect cards were in wave 20.

## Wave 21

Dispatch of 2026-09-17. #52 to #62 were merged by the owner in order and verified as
ancestors of `origin/main` (`c37e9ec`) before any card was worked: `d5d89b7`, `910d82c`,
`646c5b9`, `77fa01c`, `292639e`, `051edc0`, `5f0cbc4`, `9cc8310`, `dfa0df0`, `92e4096`,
`c37e9ec`. Every card opens a pull request and stops (R-V as amended at wave 19). The
wave 20 ratifications and the standing rule answering Q-W20-01 ride RC-146.

| Ticket | Card | Branch | Status |
|---|---|---|---|
| RC-146 | W21-01 The owed live checks, and the wave 20 ratifications | `w21/rc-146-live-checks` | merged #63 `c7cecbe`: live `build-sha` equals `origin/main`; W19-D6 12 of 12 at 1280 in both locales; a timestamped `/ru/` path answers 404 and renders the Russian 404 with its address kept; RC-145's step green in deploy run 35255945622 with the real secret (42 forms); `verify-live` 28 of 28 VERIFIED; Q-W20-01 answered as a standing rule |
| RC-147 | W21-02 Lighthouse gate stability: the median of three runs | `w21/rc-147-lighthouse-median` | merged #64 `76261a8`: three runs per page, the median judged, floors unchanged at 95 and 100; every run prints its three readings and the spread, 3 points or more labelled WIDE; median asserted on 5 vectors including wave 20's two false reds; 5 arms fired (a11y 96, perf 59, one forced 88 tolerated with an 11-point spread, a missing category, a wrong median); local spread 0 |
| RC-148 | W21-03 Stub count drift corrected, and a check that holds it | `w21/rc-148-stub-count-drift` | merged #65 `be91c39`: five live statements corrected under R-R (four in the photo manifest, one in the handoff) plus the Q-04 heading; new gate 15 `check-stub-count.js` measures 54 projects and 16 stubs per locale and holds every stated count to it, forward by claim pattern and backward by known stale value; every stated count read and equal, 7 struck values passed over, 1 named exception; 7 arms fired |
| RC-149 | W21-04 Catalogue product records, structure only | `w21/rc-149-catalog-product-records` | merged #66 `9ae19cb`, **blocked on the product list**: the wave 14 audit fills 0 of the 14 pages (38 rows, 3 of the 4 families another company's, and the tile family has no catalog category), so the section ships rendering nowhere; structure, quote wiring, build refusals and styles in place; fixture proof 12 of 12 submits send the card's own product name; the card's CTA label collides with the standing no-price gate, Q-W21-01 opened with a recommendation |
| RC-150 | W21-05 Image slot manifest for the catalogue | `w21/rc-150-image-slot-manifest` | merged #67 `b6ff0a7`: `docs/assets/CATALOG-IMAGE-SLOTS.md` generated from the records, 0 slots today because RC-149 is blocked; the slot requirements (4:3, 400x300 plus 2x, naming, R-W provenance) are read off the site's existing card treatment; new gate 16 fails when the list and the data disagree; 4 arms fired |

**The W21 numbers follow the dispatch's order.**

## Wave 20

Dispatch of 2026-09-17. #48, #49, #50 and #51 were merged by the owner and verified
as ancestors of `origin/main` before any card was worked: `27bf5f5`, `00006b8`,
`ff102c6` and `207ddf0`.

**The whole defect backlog, W19-D1 to W19-D10.** D1 to D5 came from the first critic
pass and were never worked; the second pass re-measured them as still live. Every
card opens a pull request and stops for the owner (R-V as amended at wave 19).
**The order is by client impact, as dispatched**, not by card number: D6, D8, D9, D7,
D10, then D1 to D5 in their recorded rank order (D3, D2, D1, D4, D5). RC-144 rides the
first PR. RC-145 follows D8, the other form card.

**Every PR is stacked on the one before it, and each targets `main`.** Merge them in
the table's order; a merged PR shrinks the next one's diff with no rebase. W19-D3 and
W19-D10 both change `src/main.js` and are worked in sequence, never in parallel.

The critic's cards carry no RC number, and none was assigned by the dispatch, so they
are tracked by their card IDs.

| Ticket | Card | Branch | Status |
|---|---|---|---|
| RC-144 | W20-01 Document drift: the stub count in `docs/CLAUDE.md` section 6, and three question headings | `w20/w19-d6-quote-cta-popup` (rides the first PR) | merged #52 `d5d89b7`: section 6 struck under R-R, 44 to 16, re-counted from `content/projects.json` (RO 16, RU 16); Q-W14-08(a), Q-W9-06 and Q-W12-07-LEGAL closed in their headings with a pointer each, no body edited; Q-W9-06 recorded as settled in part |
| W19-D6 | The quote buttons land on the form with the callback popup covering it, both homepages | `w20/w19-d6-quote-cta-popup` | merged #52 `d5d89b7`: a click on any quote button, or focus entering the form, stands the popup down as a submit did; check 1 24 of 24 on the branch, 24 of 24 failing on `main` with focus on `#lead-phone`; 31s of typing uninterrupted, 77 of 77 characters; popup unchanged for other visitors, 6 of 6 on both builds; live repeat owed after deploy |
| W19-D8 | Țiglă metalică, Copertine and Garduri in the "Tipul lucrării" list, both locales | `w20/w19-d8-work-type-list` | merged #53 `910d82c`: the list is rendered from the Servicii menu's own sources, 13 options per locale with Altceva / Другое last; built-site assertion fails `main` naming the three in each locale, passes the branch, 2 negative arms fired; a stubbed submit sends Garduri / Заборы at 390 and 1280, 4 of 4; of 42 forms on the site only the two homepage quote forms carry a list |
| RC-145 | W20-02 Form wiring gate: every form posts to the configured endpoint | `w20/rc-145-form-wiring-gate` | merged #54 `646c5b9`: gate 13 `check-form-wiring.js`, run last by `quality` and before upload by `pages.yml`; live, 42 forms on 40 pages all POST to `https://api.web3forms.com/submit` with one recipient key; 8 negative arms fired, including a wrong endpoint and an emptied recipient; **the endpoint's 2xx is not asserted**: Web3Forms answers 2xx only to a delivered submission, Q-W20-01 opened |
| W19-D9 | The Russian 404 is never served | `w20/w19-d9-ru-404` | merged #55 `77fa01c`: the root 404 sends a `/ru/` path to the Russian 404, which puts the broken address back; 14 of 14 on the branch against a GitHub-Pages-like server, `main` failed exactly the 6 RU combinations; first response 404 and `noindex` in all 14; back, reload and 4 hostile `from` values checked; live repeat owed after deploy |
| W19-D7 | The spec table is cut on phones | `w20/w19-d7-spec-table-phones` | merged #56 `292639e`: below 512px each row stacks, label over description; 120 of 120 on the branch, `main` failed exactly 84 (12 pages at 320 to 480) with the card's figures; cell text identical on all 12 pages; desktop table boxes identical at 1280 and 1920, delta 0; 0 of 754 words broken; 58 row headers and 58 cells in the accessibility tree, as on `main` |
| W19-D10 | Landscape phones cannot reach the last catalog categories | `w20/w19-d10-landscape-catalog` | merged #57 `051edc0`: wider than 768px and at most 500px tall, the catalog is the phone's scrolling sheet, starting at the header's bottom edge; 40 of 40 on the branch, `main` failed exactly the card's 16 naming its categories; 48 subcategory lists and 216 links reachable; 32 desktop and portrait boxes identical to `main` |
| W19-D3 | The desktop catalog chevron click closes what hover opened | `w20/w19-d3-catalog-chevron` | merged #58 `5f0cbc4`: a chevron click on a list hover opened keeps it open, the next click toggles; 24 of 24 parent rows on 12 page and width combinations, `main` 0 of 24 with `aria-expanded="false"`; keyboard toggle and phone drill-down unchanged on both builds; worked after W19-D10 on its branch, whose acceptance still passes, 40 of 40 |
| W19-D2 | The hero photo shrinks to 400px between 401 and 768px | `w20/w19-d2-hero-photo-width` | merged #59 `9cc8310`: the two hero boxes take their column's width under the 300px cap; 100 of 100 on the branch, `main` failed exactly 80 (20 pages at 480 to 768); no sideways scroll; at 390, 1024 and 1280 all 60 boxes identical to `main` |
| W19-D1 | Long one-word headings overflow; the RU privacy page scrolls sideways | `w20/w19-d1-heading-overflow` | merged #60 `dfa0df0`, **corrected by W19-D1a**: every heading breaks a word that cannot fit, and h1 and h2 hyphenate words of 14+ characters; 264 of 264 on the branch, `main` failed exactly the card's 6; wrapping of all 3,306 headings that fit on `main` unchanged word by word (W19-D1 as first committed changed 31 h3); new gate 14 `check-heading-fit.js` in `quality`, 88 combinations, 5 failing arms and 1 passing arm with invented long words |
| W19-D4 | The empty "Preț și condiții" band on five service pages | `w20/w19-d4-empty-price-band` | merged #61 `92e4096`: the band removed, with its two strings in both locales and the dead `PRICED_SLUGS`; the card's rule finds 0 sections on the branch and exactly its 10 on `main`; the band title on 0 of 45 pages; the footer discount line on 18 of 18 service pages; 2 negative arms fired |
| W19-D5 | The homepage portfolio has no chip for the 3D project | `w20/w19-d5-portfolio-3d-chip` | merged #62 `c37e9ec`: chips rendered from the cards actually shown, existing labels only, the first six byte-identical to `main`; the assertion fails `main` naming `proiectare-3d` in both locales and passes here; 2 negative arms fired; 28 of 28 real chip presses; homepage heights equal `main`'s |

## Wave 19

Dispatch of 2026-09-17. #44, #45 and #46 were merged by the owner and verified as
ancestors of `origin/main` before any card was worked: `fd25d5d`, `a48a034` and
`47957f3`. #47, the wave 19 critic's cards (docs only), was also merged, as
`b6f4a7d`.

**Ruling R-V is amended: self-merge is withdrawn.** Every card opens a pull request
and stops for the owner. This table therefore has no Mode column; SELF and STOP no
longer differ. The amendment and the wave 18 ratifications ride RC-141.

| Ticket | Card | Branch | Status |
|---|---|---|---|
| RC-141 | W19-01 Live tile budgets under R-P | `w19/rc-141-live-tile-budgets` | merged #48 `27bf5f5`: 3 live R-P runs of 28 pages, identical, 28 of 28 VERIFIED against the deployed build-sha; live equals local on all 28, delta 0; tile budgets unchanged; W18-01's LOCAL label struck and a W19-01 block added to R-Y; two negative arms fired |
| RC-142 | W19-02 Diagram accessibility parity | `w19/rc-142-diagram-a11y` | merged #49 `00006b8`: the 7 carport diagrams (34 instances) are named, described images, and the 4 tile diagrams gained descriptions; drawings pixel-identical; gate 12 `check-svg-a11y.js` failed main with 76 problems, 8 arms each fired on its own message; AX tree 130 of 130; Lighthouse 100/100 on both diagram pages in both locales |
| RC-143 | W19-03 Pre-review sweep, `docs/audits/wave-19-readiness.md` | `w19/rc-143-readiness-sweep` | merged #50 `ff102c6`: 42 of 42 sitemap URLs return 200; Lighthouse 44 of 44 runs, all 100 except RO homepage performance 99 and 404 SEO 66; 4 hidden sections plus 16 stub projects; 58 of 63 photo slots unfilled; 10 open questions, oldest 13 waves |

**The W19 numbers follow the dispatch's order.** The critic's cards W19-D1 to W19-D5
in `docs/board/` are a separate series and carry no RC number yet.

## Wave 18

Dispatch of 2026-09-16. No ruling this wave. #39 (R-AB) and #43 (RC-134) were both
merged by the owner before this run and verified as ancestors of `origin/main`
before any card was worked: #39 as `1cb075c`, #43 as `41ec827`. The owner's
rulings on wave 17 are recorded in DECISIONS.md, W18 ratifications, and ride the
first wave 18 PR, as wave 17's rode R-AB.

| Ticket | Card | Mode | Branch | Status |
|---|---|---|---|---|
| RC-138 | W18-01 Tile profile diagrams, closes Q-W14-11b | SELF | `w18/rc-138-tile-profiles` | shipped: four original inline SVG profiles, four distinct by mapping and by geometry, widths drawn from the audit on three and none on the modular tile; zero image files; swatches byte-identical; 264 of 264 rendered assertions; 5 build arms, 2 harness arms, 2 marker arms; tile page RO 3,940 / RU 3,973, R-Y extended (LOCAL) |
| RC-139 | W18-02 Header slack floor, 8px | SELF | `w18/rc-139-header-slack-floor` | shipped: no header check existed in the repo, so the wave 17 harness became `scripts/check-header-fit.js`, run by `quality`; fit and floor asserted separately; reproduced W17-05's matrix 108 of 108; one RU letter took slack to 0 and only the floor fired; fails if Inter does not load |
| RC-140 | W18-03 Acceptance-grep integrity | SELF | `w18/rc-140-grep-integrity` | shipped: 11 acceptance checks audited by running each against zero inputs; 6 lacked it and passed having read nothing (check-links, check-stale-docs, check-lighthouse, verify-live, W18-02's own check-header-fit, and the deploy workflow's placeholder grep); all 6 now print their count and fail on zero, each watched failing; 5 already had it, shown by their own zero arms |

**The W18 numbers follow the dispatch's order.**

## Wave 17

Dispatch of 2026-09-16. **Ruling R-AB** (`docs/rulings/R-AB.md`) ships first, as a
STOP PR, ahead of every other card. #35 (R-AA) was merged by the owner before this
run and verified as an ancestor of `main` before any card was worked: `8f786ad`.

| Ticket | Card | Mode | Branch | Status |
|---|---|---|---|---|
| RC-137 | W17-01 Ruling R-AB, a gate's result is its own exit code and its own output | STOP | `w17/rc-137-ruling-rab` | merged #39 `1cb075c` |
| RC-133 | W17-02 Category page prose, closes Q-W16-01 | SELF | `w17/rc-133-category-prose` | shipped: 42 strings, a lede and two paragraphs on each of 14 pages in its own locale; zero prices, lei, manufacturer names, capability or superlative terms; gate extended and negative-tested on 9 arms; R-Y amended (LOCAL); meta description is now the lede |
| RC-134 | W17-03 Upgrade the R-Y category budgets from LOCAL to R-P | STOP | `w17/rc-134-ry-live-budgets` | merged #43 `41ec827`: 4 live R-P runs on the #42 deploy, 28 of 28 VERIFIED and identical; category figures equal W17-02's, no budget changes; `catProse` marker added and negative-tested; LOCAL labels struck |
| RC-135 | W17-04 Close the scan gap, `src/product.html` | SELF | `w17/rc-135-scan-gap` | shipped: both template scans carry it, 6 of 6 asserted by count in each; it fails nothing; main's scans shown missing a plant; 4 arms negative-tested |
| RC-136 | W17-05 Header caret, Q-W15-01 option (c) | SELF | `w17/rc-136-header-caret` | shipped: pill gap 24 to 20px, 14px caret; 108 of 108 matrix combinations across six templates, caret present wherever the nav shows, phone fully visible 36 of 36 from 1280px; RU slack 15 to 9; 3 arms and 64 behaviour assertions; heights unmoved |

**RC-137 is this executor's numbering.** The dispatch named R-AB without a ticket
id; RC-133 to RC-136 are the dispatch's own, so R-AB took the next free number. The
W17 numbers follow the dispatch's order, not the order the cards are worked in.

**This section is added by whichever wave 17 card merges first.** RC-137 and RC-134
are STOP and wait for the owner, so the SELF cards reach `main` ahead of them and
carry it in. Each open STOP branch then takes `main` forward by merge and resolves
this section by union, locally, per `docs/CLAUDE.md` section 10 and R-Z.

## Wave 16

Dispatch of 2026-09-16. **Ruling R-AA** (`docs/rulings/R-AA.md`) ships first, as a
STOP PR, ahead of every other card. #25 and #31 were both merged by the owner
before this run and verified as ancestors of `main` before any card was worked:
#25 as `29fd10b`, #31 as `47f967f`.

| Ticket | Card | Mode | Branch | Status |
|---|---|---|---|---|
| RC-132 | W16-01 Ruling R-AA, destructive git commands and worktree hygiene | STOP | `w16/rc-132-ruling-raa` | merged #35 `8f786ad` |
| RC-129 | W16-02 Catalog category pages, seven pages both locales | SELF | `w16/rc-129-category-pages` | shipped: 14 pages, 14 sitemap URLs, 8 gates green, budgets added to R-Y (local) and 14 rows to verify-live; descriptive prose omitted as unsourced (Q-W16-01); a standing gate added beyond the card, for ratification |
| RC-130 | W16-03 Repoint the catalog menu, closes Q-W15-01 | SELF | `w16/rc-130-repoint-catalog` | shipped: 14 rows repointed, zero to a service page, build-time mapping assertion negative-tested on two arms; header unchanged, all three candidates measured and none fits RU (cheapest misses by 1px), 72 of 72 matrix combinations pass |
| RC-131 | W16-04 Lighthouse gate: make gate 5 execute or delete it | SELF | `w16/rc-131-lighthouse-gate` | shipped: IMPLEMENTED, gate 5 executes via a pinned npx/PATH ladder with no silent fallback and no repo dependency; negative-tested on three arms; RO/RU performance 99-100, accessibility 100 against floors 95/100; the gate found two bugs in itself, both surfaced by its refusal to skip |

**RC-132 is this executor's numbering.** The dispatch named R-AA without a ticket
id; RC-129 to RC-131 are the dispatch's own, so R-AA took the next free number.

**This section is added by whichever wave 16 card merges first.** RC-132 is STOP
and waits for the owner, so the SELF cards reach `main` ahead of it and carry it
in. PR #35 adds the same section on its own branch; when `main` is merged forward
into it, the two are resolved by union, locally, per `docs/CLAUDE.md` section 10
and rulings R-Z and R-AA.

## Wave 15

Dispatch of 2026-09-15. **Ruling R-Z** (`docs/rulings/R-Z.md`) ships first, as a
STOP PR, ahead of every other card, as the dispatch directs.

**R-V's autonomy did not carry.** R-V scopes itself to wave 14, cards RC-101 to
RC-114, and says so in as many words. The wave 15 dispatch grants SELF per card
instead, and the three content cards carry it; R-Z is STOP because it is a
ruling, which is the one path `docs/rulings/` has always taken.

| Ticket | Card | Mode | Branch | Status |
|---|---|---|---|---|
| RC-125 | W15-01 Ruling R-Z, merge hygiene and supplier pricing | STOP | `w15/rc-125-ruling-rz` | merged by the owner, #31 (`47f967f`) |
| RC-126 | W15-02 Servicii dropdown, closes Q-W14-15 | SELF | `w15/rc-126-servicii-dropdown` | shipped: 13 destinations, 54 of 54 header-fit combinations, 76 of 76 behaviour assertions, heights unmoved; slack unchanged RO 53 / RU 15 at 1280px and up; no caret and no RC-121 revert, both refused by measurement (Q-W15-01) |
| RC-127 | W15-03 Two missing carport diagrams | SELF | `w15/rc-127-carport-diagrams` | shipped: inclined and architectural drawn, C-10, C-11, C-12 and the Arhitecturală tile remapped, 56 of 56 assertions, heights unmoved, zero image files; the depiction is for ratification |
| RC-128 | W15-04 Swatch provenance correction | SELF | `w15/rc-128-swatch-provenance` | shipped: 15 legend values reauthored as ours, source URLs and the ral field removed and now refused by the build, 52 of 52 assertions, heights unmoved; three premise corrections and Q-W15-02 recorded |

**RC-125 is this executor's numbering.** The dispatch named R-Z without a ticket
id and RC-124 was the last one used, so R-Z took the next. RC-126, RC-127 and
RC-128 are the dispatch's own numbers.

**This section is added by whichever wave 15 card merges first.** RC-125 is STOP
and waits for the owner, so the SELF cards reach `main` ahead of it and carry it
in. PR #31 adds the same section on its own branch; when `main` is merged forward
into it the two are resolved by union, locally, per `docs/CLAUDE.md` section 10
and ruling R-Z itself.

## Wave 14

Dispatch of 2026-09-15. **Ruling R-V** (`docs/rulings/R-V.md`): a SELF card
self-merges on a green `quality` check; a STOP card opens a PR and halts that
card only. From R-V onward a ruling lives in its own file under `docs/rulings/`.

Worked in dependency order, not number order: R-V first, then RC-102 (nothing
can self-merge until `quality` exists), RC-101, RC-114 (the R-X gate lands before
any new content), RC-106 to RC-112, and RC-105 last so its STOP PR is cut from
the final `main` and stays mergeable.

| Ticket | Card | Mode | Branch | Status |
|---|---|---|---|---|
| RC-101 | W14-01a Ruling R-V, wave autonomy | STOP | `w14/rc-101-ruling-rv` | merged #1 |
| RC-101 | W14-01 Land the competitor structure audit | SELF | `w14/rc-101-audit` | shipped |
| RC-102 | W14-02a Ruling R-W, asset provenance | STOP | `w14/rc-102-ruling-rw` | merged #2 |
| RC-102 | W14-02 Asset provenance gate, and the `quality` check | SELF | `w14/rc-102-asset-provenance` | shipped |
| RC-103 | W14-03 Section 1 copy, RO | SELF | none | **blocked**, Q-W14-02 |
| RC-104 | W14-04 Section 1 copy, RU parity | SELF | none | **blocked** on RC-103 |
| RC-105 | W14-05 Remove the frozen price | STOP | `w14/rc-105-frozen-price` | merged at the owner's instruction with W14-05b |
| RC-106 | W14-06 Catalog mega-menu, S-01 | SELF | `w14/rc-106-catalog-menu` | **blocked**, PR #7 open, not merged: Q-W14-04, Q-W14-05 |
| RC-107 | W14-07 Social row, S-07 | SELF | `w14/rc-107-social-row` | shipped, URLs to confirm: Q-W14-06 |
| RC-108 | W14-08 Acoperișuri offer cards, S-02 | SELF | `w14/rc-108-offer-cards` | shipped without images (Q-W14-07); homepage over R-J until RC-113 |
| RC-109 | W14-09 Before/after slider, S-03 | SELF | `w14/rc-109-before-after` | shipped, empty until client before/after pairs exist |
| RC-110 | W14-10 Țiglă metalică grid, S-04 | SELF | `w14/rc-110-tigla-grid` | shipped without images (Q-W14-07); prices to confirm (Q-W14-08) |
| RC-111 | W14-11 Copertine, S-06 | SELF | `w14/rc-111-copertine` | shipped without images (Q-W14-07); homepage 53% over R-J |
| RC-112 | W14-12 Garduri, S-05, component only | SELF | `w14/rc-112-garduri` | **blocked**, Q-W14-09; component and empty data file merged |
| RC-113 | W14-13 Height re-measure, new budget ruling | STOP | none | carried into the close-out board below |
| RC-114 | W14-14a Ruling R-X, no pressure selling | STOP | `w14/rc-114-ruling-rx` | merged #3 |
| RC-114 | W14-14 Scarcity gate | SELF | `w14/rc-114-scarcity-gate` | shipped |

**Close-out dispatch, 2026-09-15.** Ratifications recorded (DECISIONS.md, W14
ratifications); PRs #1, #2, #3 merged at the owner's instruction.

| Ticket | Card | Mode | Branch | Status |
|---|---|---|---|---|
| RC-102 | W14-02b R-W amendment: legacy status, approved origins | STOP | `w14/rc-102-rw-amendment` | merged by the owner, #16 |
| RC-115 | W14-15 Header breakpoint to 1100px | SELF | `w14/rc-115-header-breakpoint` | shipped, closes Q-W14-05 |
| RC-107 | W14-07b Fix: hero photo overflow after the social row | SELF | `w14/rc-107-hero-overflow-fix` | shipped |
| RC-116 | W14-16 Page split: tigla-metalica, copertine, garduri | SELF | `w14/rc-116-page-split` | shipped |
| RC-117 | W14-17 Origin cutover to rapidconstruct.md | STOP | `w14/rc-117-origin-cutover` | merged by the owner, #20; verified live and tagged `wave-14-cutover` (RC-124) |
| RC-105 | W14-05b The 160 lei/m² figure leaves meta and price field, folded into #14 | owner-ordered merge | `w14/rc-105-frozen-price` | shipped with #14 |
| RC-106 | W14-06b Catalog menu, unblocked, audit 1.2 data | SELF | `w14/rc-106-catalog-menu` | merged, #7 (RC-106b, after RC-121) |
| RC-103 | W14-03 Section 1 copy, RO, strings supplied | SELF | `w14/rc-103-copy-ro` | shipped, closes Q-W14-02 |
| RC-104 | W14-04 Section 1 copy, RU parity | SELF | `w14/rc-104-copy-ru` | shipped |
| RC-118 | W14-18 Product and visualisation images | SELF | `w14/rc-118-images` | shipped: four offer card images (RC-108); tile renders and RAL chips **blocked** (Q-W14-11); carport images **blocked** (Q-W14-12) |
| RC-119 | W14-19 Real-photo placeholders and pending manifest | SELF | `w14/rc-119-pending-photos` | manifest shipped (`docs/assets/PENDING-PHOTOS.md`); placeholders **blocked**, no host section exists for them (Q-W14-14) |
| RC-113 | W14-13 Re-measure, per-page budgets ruling | STOP | `w14/rc-113-remeasure` | merged by the owner, #25 (`29fd10b`) |
| RC-112 | W14-12 Garduri data | SELF | none | **blocked**, Q-W14-09 |

**Tail dispatch, 2026-09-15.** Ratifications recorded (DECISIONS.md, W14 tail
ratifications). #16 and #20 were merged by the owner before the run; #25 was not.

| Ticket | Card | Mode | Branch | Status |
|---|---|---|---|---|
| RC-124 | W14-24 Post-cutover verification and tag | owner-ordered | `w14/rc-124-cutover-verify` | shipped: verified live, tagged `wave-14-cutover`; main repaired (W14-24a) |
| RC-121 | W14-21 Header fit, unblocks #7 | SELF | `w14/rc-121-header-fit` | shipped: ladder step 3; with the catalog, slack at 1280px and up RO 52px, RU 15px |
| RC-106b | W14-06b Merge the catalog menu | SELF | `w14/rc-106-catalog-menu` | shipped: 67 of 67, data 16 of 16, header fit 116 of 116 with the catalog; #7 merged |
| RC-120 | W14-20 Garduri service page, closes Q-W14-09 | SELF | `w14/rc-120-garduri-page` | shipped: page rebuilt, 34 of 34; the header nav link **blocked** (Q-W14-15) |
| RC-122 | W14-22 Tile colour swatches, closes Q-W14-11 | SELF | `w14/rc-122-tile-swatches` | shipped: swatches on every chip, 12 of 12; Dasterum renders still open (Q-W14-11b); the values shipped as RAL figures and were reauthored as our own approximations at W15-04 |
| RC-123 | W14-23 Carport diagrams, closes Q-W14-12 | SELF | `w14/rc-123-carport-diagrams` | shipped: five line diagrams on 5 tiles and 12 models, 22 of 22, zero image files |

## Wave 13

| Ticket | Card | Branch | Status |
|---|---|---|---|
| RC-085 | W13-01 Logo survey, reported, stopped on raster | — | reported |
| RC-085 | W13-02 Mark to brand orange by channel rewrite | `w13/rc-085-logo-orange` | shipped |
| RC-086 | W13-03 Enlarge the mark in the header pill and footer | `w13/rc-086-logo-size` | shipped |

## Wave 12

| Ticket | Card | Branch | Status |
|---|---|---|---|
| RC-050 | W12-01 Portfolio end tile, 100+ | `w12/rc-050-portfolio-end-tile` | shipped |
| RC-051 | W12-02 Static promo bar, data-driven | `w12/rc-051-promo-bar` | shipped |
| RC-052 | W12-03 Rulings R-H and R-I, heights measured | `w12/rc-052-wave12-docs` | shipped |
| RC-053 | W12-05 Adopt the full-width tile | `w12/rc-053-full-width-tile` | shipped |
| RC-054 | W12-06 Promo bar on every public page | `w12/rc-054-promo-site-wide` | shipped |
| RC-055 | W12-08 Google profile sameAs, resolved | `w12/rc-055-google-sameas` | shipped |
| RC-056 | W12-09 Coverage, 20 localities, one source | `w12/rc-056-coverage` | **built, HELD** |
| RC-060 | W12-04 R-J, R-K, baseline corrections, docs | `w12/rc-060-wave12b-docs` | shipped |
| RC-059 | Custom domain root + CNAME in the artifact | `fix/rc-059-custom-domain-base-path` | **merged 2026-09-06, live** |
| RC-077 | W12-28 Amend master plan lines 121, 245, 200 under R-R | `w12/rc-077-amend-master-plan-heuristic` | shipped |
| RC-061 | W12-10 R-J amended: the derivation governs, not the stated figures | `w12/rc-060-wave12b-docs` | shipped |
| RC-062 | W12-11 Ruling R-L, locality names verified against the CUATM | `w12/rc-062-cuatm-verify` | shipped |
| RC-063 | W12-12 Arm GOOGLE_REVIEWS_URL with the resolved canonical | `w12/rc-063-live-figures` | shipped |
| RC-064 | W12-13 Remove the 4.9/250+ review claim, both locales | `w12/rc-064-remove-review-claim` | shipped |
| RC-065 | W12-13b The removed claim was still shipping in an HTML comment | `w12/rc-065-comment-fix` | shipped |
| RC-066 | W12-14 SITE_URL defaults to the domain the client controls | `w12/rc-066-site-url-default` | shipped |
| RC-067 | W12-15 Ruling R-M, the Russian locale follows usage | `w12/rc-066-site-url-default` | shipped |
| RC-068 | W12-16 Wave 12 close, live figures, the 8px RO headroom | `docs/rc-068-wave12-close` | shipped |
| RC-069 | W12-17 Unlink the privacy pages while they render TODO | `w12/rc-069-unlink-privacy` | shipped |
| RC-070 | W12-18 to W12-20 Ruling R-N restore, R-O profile is sameAs only | `w12/rc-070-review-restore` | shipped |
| RC-071 | W12-21, W12-21b Privacy draft naming no operator; gate fix | `w12/rc-073-verify-live-doctrine` | shipped |
| RC-073 | W12-22 Ruling R-P, the live-measurement verifier | `w12/rc-073-verify-live-doctrine` | shipped |
| RC-074 | W12-23 to W12-25 build-sha identity marker, R-Q, the gate rule | `w12/rc-074-sha-and-rq` | shipped |
| RC-072 | W12-26 Publish the fallback privacy page on an explicit switch | `w12/rc-072-privacy-fallback` | shipped |
| RC-076 | W12-27 Ruling R-R, three documents amended in place | `w12/rc-076-ruling-rr` | shipped |
| RC-078 | W12-29 Staleness gate, `check-stale-docs.js`, negative-tested | `w12/rc-078-stale-docs-gate` | shipped |
| RC-079 | W12-30 Close wave 12: handoff, open questions, production tag | `w12/rc-079-close-wave-12` | shipped |
| RC-080 | W12-31 Amend the two stylesheet comments; gate reads source comments | `w12/rc-080-source-comment-gate` | shipped |
| RC-081 | W12-32 Ruling R-S, handoff final figures, re-tag | `w12/rc-081-ruling-rs` | shipped |
| RC-082 | W12-33 Ruling R-T, amendment blocks and strike-through scope | `w12/rc-082-ruling-rt` | shipped |
| RC-083 | W12-34 Five owner answers, ruling R-U, hero alt and RO title | `w12/rc-083-owner-answers` | shipped |
| RC-084 | W12-35 Close: final handoff, deploy, verify, tag | `w12/rc-084-close` | shipped |

**The docs branch was rebuilt off W12-08, not off W12-09.** RC-057 originally sat
on top of the coverage commit, so merging it would have dragged the held card in.
RC-060 is the same docs commit cherry-picked onto `w12/rc-055-google-sameas`, so
the held card is not in its ancestry. RC-057 is abandoned, not merged.
| RC-058 | W12-07 Legal identity from the client PDF | — | **BLOCKED, awaiting confirmation** |

**The form gate is released.** `WEB3FORMS_KEY` is set and a real browser
submission landed at 08:57 on 2026-09-06. Q-W10-01 and W10-02 are closed on that
evidence.

**Two things are still held, and they are not the same hold:**

- **RC-056 (W12-09)** is built and must not merge until the client confirms
  Bălți, Ungheni and Cahul. Those three are also three of the four names in the
  new `meta.description`, so a "no" changes more than the list.
- **RC-058 (W12-07)** is not built at all. The two strings were extracted from
  the client PDF and reported for confirmation, which the card requires before
  anything is written. See Q-W12-07 and the report.

## Wave 6

| Ticket | Card | Branch | Status |
|---|---|---|---|
| RC-031 | Wave 6 tracking files (this file + QUESTIONS.md) | `docs/rc-031-wave6-tracking` | shipped |
| RC-032 | W6-01 Supplier marquee: 12 named slots, white logo tiles | `w6/rc-032-supplier-marquee` | shipped |
| RC-033 | W6-02 Project model scale-up: 5 to 7 per service | `w6/rc-033-project-model-scale` | shipped |
| RC-034 | W6-03 Image slot type changes: hero-panel + 9 service photos | `w6/rc-034-image-slot-types` | shipped |
| RC-035 | W6-03b Service page hero art eager, not lazy | `w6/rc-035-svc-hero-eager` | shipped |
| RC-036 | Dead-link gate script + wave 6 release notes | `docs/rc-036-wave6-gates` | shipped |

## Wave 10

| Ticket | Card | Branch | Status |
|---|---|---|---|
| RC-046 | W10-01 Process the five "Cum lucrăm" step photos | `w10/rc-046-process-steps` | shipped |

## Wave 9

| Ticket | Card | Branch | Status |
|---|---|---|---|
| RC-043 | W9-01 Swap Ceresit -> CAT and Weber -> Heidelberg Materials | `w9/rc-043-supplier-swap` | shipped |
| RC-044 | W9-02 Social profiles in the footer bar | `w9/rc-044-social-links` | shipped |
| RC-045 | W9-03 CAT -> Liebherr, every tile now has a logo | `w9/rc-045-cat-replacement` | shipped |

## Wave 8

| Ticket | Card | Branch | Status |
|---|---|---|---|
| RC-040 | W8-03 Hero panel photo on a provisional 720px floor | `w8/rc-040-hero-panel-photo` | shipped |
| RC-041 | W8-04 Close questions, drop bosch, ratify the header | `w8/rc-041-close-questions` | shipped |
| RC-042 | Wave 8 release notes, live measurements | `docs/rc-042-wave8-notes` | shipped |

W8-01 (deploy wave 7 and verify live) and W8-02 (reconcile duplicate artwork)
carried no code change. W8-02's premise did not hold: no duplicate set exists.

## Wave 7

| Ticket | Card | Branch | Status |
|---|---|---|---|
| RC-037 | W7-01 docs/CLAUDE.md, standing rules | `w7/rc-037-claude-md` | shipped |
| RC-038 | W7-02 Route the nine service images | `w7/rc-038-service-images` | shipped |
| RC-039 | W7-03 Supplier logos: 9 of 12 landed | `w7/rc-039-supplier-logos` | shipped |

## Shipped, waves 1 to 5

| Ticket | What | Wave |
|---|---|---|
| RC-001 … RC-010 | Initial build, form demo mode, base path and Pages, photo pipeline, Lighthouse, a11y and privacy pages, phase 2 motion | pre-wave |
| RC-011 … RC-018 | Intake, header, hero, marquee, reviews, manifest v2, phase 1 snapshot, hero CTA | 1 |
| RC-019 … RC-023 | Content model, 18 service pages, wiring, SEO, crawlable-anchor fix | 2 |
| RC-024 … RC-027 | Never render a TODO marker, noindex gate, price scope, hero fit | 3 |
| RC-028 | 51-slot pipeline, dress rehearsal, shoot sheet | 4 |
| RC-029, RC-030 | Hero spacing, mobile hero gap | 5 |

## W9-04 · Portfolio content from the real photo set
**Status: DONE** (2026-09-01, branch `w9/rc-047-portfolio-content`)

Owner rulings R-A to R-G recorded in DECISIONS.md. 46 photographs inventoried,
12 struck for failing master plan section 7 (4 by R-D, 8 by Q-W9-04), 34 written
into `content/projects.json` with bilingual descriptions and per-project crop
anchors. `process-photos.js` gained the R-B no-upscale clamp and `--cropOffset`
anchoring; project covers moved to 4:3 at 400/800.

Sitemap 2 -> 18 URLs. 16 of 18 service pages cleared the W3-02 noindex gate;
`industrial` is the exception and has no real photograph. Open: Q-W9-04
(provenance rulings, and a photograph for `industrial`), Q-W9-05 (localities).

## W9-05 · Form delivery (B-01)
**Status: DONE except the live test** (2026-09-01)

Workflow wiring and honeypot were already correct. Subject lines now carry an
explicit [RO]/[RU] tag and the source path; the demo notice is emitted only when
disarmed. Verified in a headless browser, both locales, both paths. The two live
submissions are blocked on the secret being present and a merge to main, which
is a publish. See Q-W9-06.

## W9-06 · SEO foundations (C-01, C-04, part of C-02)
**Status: DONE** (2026-09-01)

sitemap lastmod from git content dates, six answer engines allowed explicitly in
robots.txt, generated /llms.txt, sameAs, absolute breadcrumb, ImageObject per
project cover, per-service og:image with real dimensions, unique title and
description on all 24 pages. Open: Q-W9-07 (two RO homepage fields over their
limits, plus a coverage-list contradiction), Q-W9-08 (SITE_URL is set, not
unset; answered).

## W9-08 · Extractable structure (C-02 FAQ, C-03)
**Status: DONE** (2026-09-01)

Direct 40-60 word answer opening all 18 service pages, spec tables on the six
services whose content supports one, four FAQ questions per page with matching
FAQPage schema, two contextual sibling links per page, content-dated
"Actualizat". All 20 pages inside the height budgets. Open deviation recorded in
DECISIONS.md: Russian answers run 31-39 words, not 40-60, to stay faithful
translations.

## W10-01 · Publish wave 9
**Status: DONE** (2026-09-01). Merged `w9/rc-047-portfolio-content` to main as
`b4bf763`, deployed. Verified live, not local: 18 sitemap URLs each with a
lastmod, 16 of 18 service pages indexable, industrial the only noindex pair,
homepage portfolio six different services in both locales, 68 cover files all
HTTP 200, zero slots on SVG fallback, 212 images across 20 pages all decode,
zero dead internal links, zero upscaled variants against source.

## W10-02 · Live form test
**Status: BLOCKED, not started.** `WEB3FORMS_KEY` does not exist. Deploy log says
DEMO MODE, the secrets API returns zero for the repo and both environments, and
the live HTML carries `data-armed="0"`. See Q-W10-01 for the three-step fix.

## W10-03 · Restore images
**Status: HELD** pending the owner confirming the set, as instructed.

## W10-04 · Title and description
**Status: DONE** (2026-09-01). RO title 62 -> 60, description 176 -> 155, no
claim dropped. Deployed as `7b136d0` and verified live. All 24 pages within both
limits. RU unchanged at 60 and 155.

## W11-01 · Restore the four industrial photographs
**Status: DONE** (2026-09-02). Only four of the eight on the brief were ever
held; the other four shipped in W9-04 and were live. Correction recorded in
DECISIONS.md. industrial cleared the noindex gate: 18 of 18 service pages
indexable, sitemap 20 URLs, 38 renderable projects, zero upscales.

## W11-02 · Unlisted review page
**Status: DONE** (2026-09-02). /review/ renders the five held photographs at
full size with filename, reason and service, no descriptions. noindex nofollow,
absent from the sitemap, zero links to it from any other page. One mislabel was
caught and fixed before publishing: selecting by dimension picked the published
reparatii-01 for the 1200x1600 slot because that folder holds two files at that
size. Selection is now by exact filename with an asserted dimension check.

## W11-03 · Deploy and verify live
**Status: DONE** (2026-09-02). Deployed as f179951. All acceptance criteria met
live. The deploy log still reports DEMO MODE: WEB3FORMS_KEY is still absent, so
Q-W10-01 remains open and W10-02 remains blocked.

## W12-01 · Portfolio end tile
**Status: BUILT, HELD** (2026-09-03). Seventh cell after the six cards, `100+`
over a one-line caption, project-card box, no link and nothing focusable, and
outside the filter selector so filters leave it alone. Labelled not hidden:
numeral `aria-hidden`, sentence exposed, confirmed on the accessibility tree.
Costs 193px, which is the whole of the wave's budget overage. See Q-W12-01.

## W12-02 · Promo bar
**Status: BUILT, HELD** (2026-09-03). Static in-flow strip, 44/36px hard cap,
`--ink` on `--brand` at 5.10:1, one line unclipped from 320px to 1440px, zero
animation, zero CLS measured against a control. Data-driven with `promo.endDate`
as the removal switch. Homepage only — Q-W12-03 asks whether to extend it to the
service pages. Costs exactly 44px and stays inside budget on its own.

## W12-03 · Heights
**Status: REPORTED, OVER BUDGET** (2026-09-03). RO 8,883 against 8,744, RU 9,096
against 9,044. Not trimmed, per the card. **AMENDED: those budgets are R-I's and
were superseded by R-J on 2026-09-06, which set 8,851 and 9,065. The figures here
are the then-current ones this card was measured against, kept as the record of
what was reported; do not budget against them.** **AMENDED again 2026-09-15: R-J's figures are themselves superseded by ruling R-Y (W14-13).** Also corrected a 142px error in the
recorded baseline that had stood since wave 8. See W12-03 in DECISIONS.md.

## W12-05 · Full-width tile
**Status: DONE** (2026-09-06). 193px -> 101px. Accessibility treatment
re-verified against the accessibility tree after the layout change, not carried
over on trust. RO 8,791 / RU 9,005 at this point in the wave.

## W12-06 · Promo bar site-wide
**Status: DONE** (2026-09-06). 24 of 25 pages; `/review/` excluded and why is
recorded. Tallest service page 5,729px against 6,000, 271px of headroom.

## W12-07 · Legal identity
**Status: BLOCKED, reported not written** (2026-09-06). The PDF was located and
two strings extracted. The company name in it is **not** "Rapid Construct", and
the document is a bank payment advice rather than a registration certificate, so
both facts were reported for confirmation before any write. Privacy pages remain
`noindex` and out of the sitemap. See Q-W12-07.

## W12-08 · Google Business Profile
**Status: DONE** (2026-09-06). Shortlink resolved to a tracking-laden Search URL
and was NOT used; the Maps CID URL was used instead. Zero rating markup, audited.

## W12-09 · Coverage
**Status: BUILT, HELD** (2026-09-06). 20 localities from one source; prose,
both `areaServed` blocks and `llms.txt` verified identical. `location` still
empty on all 38 renderable projects. Q-W9-05 explicitly NOT closed.

## W12-10 to W12-27 · the second half of wave 12

**Status: all shipped** (2026-09-06 and 2026-09-07). Rows added at the wave close,
W12-30: the ticket table above stopped being updated after W12-09 and eighteen
cards merged without one. The branch column is reconstructed from
`git log --first-parent` on `main` and two cards share a branch where a docs
commit was cherry-picked onto its predecessor, which is recorded above for
RC-060.

Six rulings landed in that stretch — R-L and R-M on place names, R-N and R-O on
the review claim and the profile link, R-P on live measurement, R-Q and R-R on
what a governing document may restate. Each is in `DECISIONS.md` under its own
heading.

## W12-28 · Master plan amendments
**Status: DONE** (2026-09-07). Lines 121, 245 and 200 amended under R-R.
Line 121 was a false rule rather than a stale value: it declared that exceeding
9,000px meant something had been over-built, which RU does by design under R-J. Resolves
Q-W12-11.

## W12-29 · Staleness gate
**Status: DONE** (2026-09-07). `scripts/check-stale-docs.js`, gate 3 in
CLAUDE.md section 11, seeded with every value the wave found. Negative-tested on
a scratch copy before it was trusted, and the first version failed that test:
it missed a superseded budget restated as live in a section that discussed the
superseding ruling four lines away. R-Q amended to make the list part of
recording a ruling. Q-W12-12 logged: two `src/styles.css` comments are the same
defect and are out of the scan's scope.

## W12-30 · Close the wave
**Status: DONE** (2026-09-07). Production verified under R-P with the SHA
assertion and tagged. Handoff written at the foot of `RELEASE-NOTES.md`: budgets
by ruling reference, the open questions with what unblocks each, and the exact
W12-07 reversal step.

## W12-31 · The last known stale value
**Status: DONE** (2026-09-07). The two `src/styles.css` comments quoting the cap
R-J superseded are amended, naming R-J and stating no figure. `check-stale-docs.js`
now reads source comments as well as documents: `src/*.css`, `src/*.html`,
`build.js`, `scripts/*.js`, comments only, extracted by a character scanner
rather than a regex. Negative-tested on both arms - four values planted in four
comment forms all fired, six planted in code fired nothing. Resolves Q-W12-12.

## W12-32 · Ruling R-S
**Status: DONE** (2026-09-07). Bodies are immutable, status metadata is not.
CLAUDE.md section 17. Ratifies the four question headings W12-30 moved from OPEN
to answered, and settles that RELEASE-NOTES dated wave records stay as written
while current figures live in the handoff. Closes the in-place correction method
R-J used without reversing R-J. Q-W12-13 logged: two rulings carry amendment
blocks appended inside their bodies, which R-S as worded does not clearly permit;
default shipped is that the next one is its own entry.

## W12-33 · Ruling R-T
**Status: DONE** (2026-09-07). Answers Q-W12-13 with (a): a ruling body may carry
appended amendment blocks, because a ruling is standing authority read forward
and R-S governs snapshots read backward. The blocks in R-J and R-Q stand, and
R-J's in-place figure corrections are regularised, so the irregularity W12-32
left open is closed with no correcting entry owed. Recorded alongside R-R: the
strike-through requirement holds where the superseded value has documentary
purpose, so W12-31's removal from two stylesheet comments is the standard.

## W12-34 · Owner answers and ruling R-U
**Status: DONE** (2026-09-07). Q-09 hero alt rewritten in both locales from the
photograph itself; the provenance half dissolves because the new text claims
nothing. Q-W9-07 title shortened 60 to 51 by deleting two words, and this card
corrects that question's stale figures - the description half stays open and was
not touched. Q-W12-02 accepted as built, no scheduler, reasoning recorded.
Q-W12-05 closed by R-M. Ruling R-U closes Q-W9-05: `location` is permanently
empty, verified 0 of 54 and 0 of the 20 coverage names anywhere in projects.json.

## W12-35 · Close
**Status: DONE** (2026-09-07). Final handoff: four live questions with whose they
are and what unblocks each, R-U flagged as required reading before touching
projects.json, and the four-step W12-07 reversal carried forward unchanged.
Production verified under R-P with the SHA assertion and tagged `wave-12-closed`.
Tags are added, never moved.

## W13-01 · Logo survey
**Status: REPORTED, STOPPED** (2026-09-07). Every logo asset is raster; no vector
source exists in the repo. Reported per the card's stop condition rather than
recolouring by filter or tint. The survey found one asset, `logo-white.png`, that
is a single-colour alpha mask and therefore exactly recolourable in data.

## W13-02 · Mark to brand orange
**Status: DONE** (2026-09-08). RGB channel rewritten to `#F65308`, taken from
CLAUDE.md section 3 and not from the master plan's struck row. Verified on the
written file: 1 distinct RGB equal to the target, alpha identical across all
875,856 bytes with a matching sha256. Renamed `logo-white.png` to `logo-mono.png`
and updated nine references. og:image regenerated on `#141414`, 5.40:1 on every
surface the mark renders on. Q-W13-01 logged for the three assets that need a
client-supplied source.

## W13-03 · Logo size
**Status: DONE** (2026-09-08). CSS only, no image files touched. Mark 32 to 48px
in the 64px pill, derived from the CTA button's existing 8px clearance rather
than chosen; 40px scrolled, 40px mobile, 36px mobile scrolled, all at the same
8px. Mobile had no rule and was inheriting the desktop 32px into a 56px pill.
Footer 44 to 66px, the same 1.5x factor. The real finding: the PNG carries 76px
of transparent margin at the top and 24px at the bottom, so a 32px box was only
26.4px of ink sitting low - which is why it read smaller than its CSS said.
Header bar 96px and pill 64px both unchanged. Zero height impact, measured
before deploying. Largest rendered width 179.2px against a 1542px source.

## W25-17 · Fatade 3D product images
**Status: MERGED #108** (opened 2026-09-21). 103 slots attempted, **99 filled**, 4 refused by the 450
floor and reported with their measured sizes. Catalog 160 to 259 of 333. W25-R14 to W25-R18
recorded first. `fetch-packshot.js` gains `--fatade3d`; the imperlux override ships unused,
held to twelve slot ids. 24 of 24 gate commands exit 0.

## W25-18 · Garduri images under the owner override
**Status: MERGED #109** (opened 2026-09-21). All 12 Garduri slots filled from `imperlux.md` under
W25-R15, held to twelve slot ids rather than to the host. Ledger 259 to 271 of 333. Three
hub tile `shows` lines corrected to the picture that landed, each saying so. RC-pics-real no
longer expects a fence; the intake list and the prompt batch shrink by the ledger, not by
deletion. 24 of 24 gate commands exit 0.

## W25-19 · Acoperisuri consolidation
**Status: MERGED #110** (opened 2026-09-21). The roofing catalogue moves onto `/servicii/acoperisuri/`:
a filter bar of 8 and **75 cards**. The 8 `/catalog/materiale-acoperis/*` URLs become
redirect pages that still answer 200 and land on the matching filter, and leave the sitemap.
The fold was taught about the filter. RC-129 gains a `redirect` page kind; verify-live swaps
16 measured rows for a 16-URL fetch assertion. Budget 7,658 to **16,964** under W25-R18.
Q-W25-17 logged. 24 of 24 gate commands exit 0.

## W25-20 · CT80F and the declared reuse
**Status: MERGED #111** (opened 2026-09-22). W25-R16 and W25-R17 applied: **12 slots filled from
pictures already on the site**, ledger 271 to 283 of 337. `reuse_of` and `reuse_reason` are
ledger fields and gate 19 checks them against the ledger; six new self-test arms, five red
and **one GREEN**, which is a new kind of arm here. 13 were held and 12 could be filled:
`CAT-0110` and `CAT-0112` have no picture on either record, and their reason is corrected to
the measured one. Question 30 added to CLAIMS-MIHAI.md quoting both CT 80 F rows. 24 of 24
gate commands exit 0.

## W25-21 · Owner intake
**Status: MERGED #113** (opened 2026-09-22). `scripts/intake-owner-pics.js` ships; **nothing was taken
in**, because both folders hold only their README, which the dispatch says is a list and not
an error. The filename is the slot id exactly, the folder decides the origin, and a real
photograph is allowed on an evidence slot where a generated image is not. **19 self-test
arms, 3 of them green.** The apply path was proved end to end on a throwaway copy, including
`build.js` refusing the `TODO:` alt text. The four `ACOP-` prompts are reproduced verbatim in
the card. 54 slots still waiting. 24 of 24 gate commands exit 0.

## W25-22 · Written warranty, 30 years to 5
**Status: MERGED #112** (opened 2026-09-22). Owner instruction. **8 strings, 4 per locale**, on the two
homepages; a grep of the built tree confirms nothing else said thirty. Romanian grammar
changes with the number (`30 de ani` but `5 ani`), so the strings were rewritten, not
substituted. The figure has one home, `warranty.years`, and `build.js` asserts both
directions over the four strings, with both failure shapes watched fire. `warranty-30`
registered in the staleness gate and the master plan amended beside the struck value.
**Heights identical at 30 and at 5**, measured with a control, so no budget moves. 24 of 24
gate commands exit 0.

## W25-23 · Homepage product strip
**Status: MERGED #114** (opened 2026-09-22). W25-R19 to W25-R24 recorded first. The Acoperișuri card
leaves the homepage product strip; Copertine and Garduri remain as two equal columns. The
strip's length is asserted against `TOP_LEVEL_PRODUCT_PAGES`, never a literal. Budgets 9,195
to **9,141** and 9,436 to **9,354**, measured plus 60: the saving is column width, not a row.
`teaserTiles: 2` added to the live markers. W25-R18 discharged on `c05ce0e`. 24 of 24 gate
commands exit 0.

## W25-24 · Hub tiles and gate 26
**Status: MERGED #115, image half filled at W26-03 and W26-11** (opened 2026-09-22). All 16 hub tiles have a destination; the
Garduri "tip jaluzele" tile opens the models page; `.hub__tile--inert` and its render branch
deleted. **Gate 26** `check-hub-tile-links.js`, 7 arms, 2 of them green. **The 8 tile images
are blocked: Q-W25-18**, because W25-R19's premise is gone, both imperlux 4-tile sections have
been rebuilt and neither exists. 25 of 25 gate commands exit 0.

## W25-25 · Fence catalogue completeness
**Status: MERGED #116, warranty line off by W26-R9** (opened 2026-09-22). Every imperlux fence page walked via
its own internal links: **8 model pages** found (not in its sitemap), plus 10 price, 12 city,
22 project, 4 service and 8 other pages. **Walked 8, on site before 8, after 8**; IL102, IL101,
IL41 and IL02 are project titles, not models. The one missing field, **colour names**, is
added: palette keyed by RAL once, count derived from the list, RAL code printed because
imperlux has no RU page. The source's alt text independently confirms W25-18's colour pairing.
**Warranty line held, Q-W25-19**: W24-R6 rows 33/40/44, CLAIMS question 21 unanswered, and it
collides with the 5 years W25-22 shipped. Budgets 3,746 to **3,880** and 3,767 to **3,902**.
25 of 25 gate commands exit 0.

## W25-26 · Tigla merge
**Status: MERGED #117** (opened 2026-09-22). W25-R21 applied: one card per model name, the roofing section
**75 to 71**. **The ruling's premise was wrong and the card says so**: both sets are Dasterum,
the wave 14 audit section that created the tile data is titled `dasterum.md`, and imperlux
publishes Monterrey, Valencia and Kascad zero times. The two prices are the same supplier's
Econom and Standart grades. The 4 ACTM slots moved to `/servicii/tigla-metalica/` and were
filled **from Dasterum by W25-R20's first step, with no fetch**, under W25-R17 declared reuse,
matched by model name because CAT-0226 is the modular tile and CAT-0227 is Kascad. The legacy
`public/img/tigla-<id>.jpg` path is deleted. Slots **283 to 287 of 337**. 25 of 25 gate
commands exit 0.

## W25-27 · The sourcing rule applied
**Status: MERGED #118, copertine at W26-07** (opened 2026-09-22). W25-R20 applied: **25 attempted, 12
filled**, ledger 287 to **299 of 337**. 9 `google_pick`, 3 manufacturer. **The ruling's
recorded reading was corrected first**: it had kept W25-R2's retailer refusal, which narrowed
"any site" to nothing. `--google-pick` lifts the shop refusal and adds the Russian-domain one,
4 arms watched. **Two Novatik files refused for warranty text burned into the picture**
(W24-R6). **CAT-0026 first landed as the Dedeman logo**: a guessed CDN URL shape, caught by
looking. 13 attempted-not-filled, each with its reason. **Q-W25-20**: Unsplash 307 and Pexels
403/401 refuse automated access, so the 3 copertine slots wait. 25 of 25 gate commands exit 0.

## W25-28 · Catalogue category tiles
**Status: MERGED #119** (opened 2026-09-22). All 8 `CATEG-` tiles filled under W25-R22, each a declared
reuse of an installed product image of its own category. **No image file added.** No crop file:
the tile's own `object-fit: cover` is the crop, and a cut file would fall under the floor on 3
of the 8 (every Dasterum roofing image is 488x488). **Gate 19's shared-picture rule was
order-dependent and is now a group rule**: the tile had become the "owner" of a product's
photograph because `dist/catalog/` is walked first. Two new arms, one GREEN. Slots **299 to 307
of 337**. 25 of 25 gate commands exit 0.

## W25-29 · Secondary images and polish
**Status: MERGED #120, photographs unblocked by W26-R8, not yet scheduled** (opened 2026-09-22). **Polish shipped**: `--radius-card-lg`
replaces 20px written three times and a stray 32px on `.xsell`; a resting `--shadow-card` on
seven card families; the wave 6 hover lift extended to six of them, with the reduced-motion
list extended in the same commit. **Six pages measured before and after, identical to the
pixel**, so no budget moved. **All three photograph placements blocked on Q-W25-20**: W25-R23
names Unsplash and Pexels and both refuse automated access. Nothing was substituted: the site's
own project covers are 400x300 and read `legacy, licence unverified`. **Spacing rhythm
deferred**: it is the one polish item that is layout. 25 of 25 gate commands exit 0.

## W26-01 · Roof section
**Status: MERGED #121, ratified 2026-09-22** (opened 2026-09-22). **Section 12.0 on `a8d819e` FAILED, exit 1, 4 unverified**,
and the cause was this terminal's: W25-24 made every hub tile a link and left `bentoLinks: 3`.
Corrected, and **gate 26 now couples the two files** so a stale marker fails in `quality`
instead of after a merge; watched on the real file. W26-R1 to W26-R8 recorded in a new
`docs/rulings/W26-R.md`. The four owner roof photographs installed **uncropped** (no edits;
the box is portrait and they are 4:3), mapped to cards by name with the mapping asserted,
metadata assertion fired once on `sips -Z` and was fixed. Origin recorded as R-W's
client-supplied, which is stricter. Caption check: 0 ownership claims. Q-W25-19 closed at
"leave it off". 25 of 25 gate commands exit 0.

## W26-02 · Rendered audit of imperlux.md
**Status: MERGED #122, ratified 2026-09-22** (opened 2026-09-22). 20 pages read from the **rendered DOM** with network idle
polled to stability and full-document screenshots. **Counts match the owner's screenshots five
of five**: 7, 4, 1, 2, 17, total 31 roofing products. **Q-W25-18 closed by measurement.**
W25-24's finding was wrong and the method was the error: it grepped the HTML response for
client-side labels and screenshotted the first 4,000px of a 12,535px page. `scripts/audit-rendered.js`
committed because W26-R2 is standing. Four of five sections publish a Compară modelele table.
25 of 25 gate commands exit 0.

## W26-08 · Before/after slots filled with the owner's photographs
**Status: MERGED #123, ratified 2026-09-22** (opened 2026-09-22). Inserted at the owner's request mid-dispatch. **All eight
evidence slots filled** from `/Users/ivan/Before:After`, chosen from three candidate folders by
contents. Ledger **307 to 315 of 337**, 22 empty and **none of them an evidence slot**. No Exif
or GPS in the originals; stripped and asserted anyway. **Three of the four subjects are not what
the slots asked for** (three turnkey builds and one exterior renovation, no interior pair), so
four titles and eight alt texts were corrected to the photographs under W25-18's precedent, with
the owner invited to rename them. BA-02 to BA-04 get **no @2x rather than an upscale**. **Gate 19
learned the slider's bare `<img>` rendering**, which it had been reading as "rendered by no
page", plus R-W's `owned by Rapid Construct, supplied for site use` origin; 2 new arms, 1 GREEN.
Budgets unchanged. 25 of 25 gate commands exit 0.

## W26-09 · Fence designations IL to RC
**Status: MERGED #124, ratified 2026-09-22** (opened 2026-09-22). Inserted at the owner's request mid-dispatch. The four fence
models render **RC12, RC30, RC40 and RC100** in place of imperlux.md's IL codes, and **zero
competitor model codes remain in `dist/`**. **Not new policy**: `content/copertine.json` was
de-badged at W14-23 and `build.js` has refused an IL code in that file ever since; the fence
file was the last place one rendered. The guard now covers it **at two digits or three**, since
the copertine guard's `\d{3}` would have let IL12, IL30 and IL40 back in. Seven arms, two
controls, **one GREEN** (the `_note` naming the old codes is permitted). **RP vs RC**: the
instruction said RP and both examples said RC; shipped RC, logged **Q-W26-01**. Material names,
card order and the Imperlux pictures are unchanged and flagged with a recommendation. Heights
unchanged to the pixel. 25 of 25 gate commands exit 0.

## W26-03 · Hub tiles, tile links, gate 26
**Status: MERGED #125, ratified 2026-09-22** (opened 2026-09-22). **Section 12.0 on `18b98ce`: exit 0, PASS, 0 unverified, 0
failed, 0 retried.** W26-R3 measured: imperlux.md's roofing hub carries **six tile images and
two answer to our four tiles**. `ACOP-01` and `ACOP-02` **filled**, cropped to drop burned-in
Romanian text and a **model count that is Imperlux's range** (ink bands measured, crops start
below the last inked row); `ACOP-03` has **no counterpart**; `ACOP-04` **refused**, its only
candidate carries the IMPERLUX logo and a free-offer CTA. No screenshot-crop needed, all six
fetch at 200. GARDB-01 to 04 were already filled at W25-18. The provenance override went to
16 by **getting narrower**: one exact licence per ruling, so the two cannot be crossed; 3 arms,
2 controls. **W26-R4 applied: 0 same-page anchors on 16 tiles**, refused in `build.js` and in
gate 26, which now rejects by kind and is **scoped to `data-hub-grid`** so W26-R5's product
bento can exist; 9 arms, 1 GREEN. Both repointed tiles are logged as **Q-W26-02** (two roofing
tiles now go to in-construcție, three fence tiles share one page). **`/servicii/garduri/`'s
budget lowered 121px** to 5,607/5,629: it had stayed still since W24-08 while the page moved.
317 of 337 filled. Heights identical before and after. 25 of 25 gate commands exit 0.

## W26-04 · Roofing restructure
**Status: MERGED #126, ratified 2026-09-22** (opened 2026-09-22). **Five sections replace seven catalogue subcategories**, a
**second four-tile bento** sits above them, and **twenty imperlux.md models** join the section:
**71 - 13 + 20 = 78 cards**. The merge reading is recorded: a dasterum part that is an imperlux
model at a size is a **grade**, so it is a variant line and the card takes the cheapest grade's
price and picture. Every match is data with a **tier and a reason**; **"Cot 60°" is not "Cot
burlan 90 mm"**, an angle is not a diameter. Two ledger rows removed because nothing renders
them; their files and provenance stay. **Not taken**: every image, the description sentence,
the struck price and the percent badge, and **the warranty, which W26-R6 holds** and which now
leaves the page reading inconsistently against the dasterum cards. The product bento carries
its **own class prefix** sharing one rule body, because `.hub__tile` carries three gates' rules
as well as a look. **A backtick inside a template literal made BOTH bentos vanish on a build
that exited 0**, twice more in the same card: **gate 27** now catches the severed comment it
leaves behind, 8 arms, 5 GREEN, all three real defects planted back and watched fire. Gate 20
measures **every** bento, not the first (32 to 48 tiles). Budgets **18,075 / 18,281**, +1,545px.
348 rows, 315 filled, 33 empty. **26 of 26 gate commands exit 0.**

## W26-05 · Compară modelele tables
**Status: MERGED #127, ratified 2026-09-22** (opened 2026-09-22). **Section 12.0 on `cfebef8` FAILED, exit 1, 12 of 16 redirect
rows**, and the defect was W26-04's: the regrouped sections were not carried into
`verify-live.js`'s redirect expectations. The site was correct. **Third time in three waves**
that a marker was left behind, so the map is now **coupled to the build** and watched firing.
**Four tables ship**: Țiglă metalică (4), Șindrilă bituminoasă (2, copied from imperlux),
Sisteme pluviale (18), and the fence models page (8). **Two sections have none and the reason
is data**: one model, and 53 unlike things. **Products are rows, not columns**, the one
deviation, because seventeen columns cannot go on a phone and gate 14 holds this site to no
sideways scroll at 360. **No warranty column**: answered for fences, still held for roofs. The
build refuses a table under two products and a column under half real. Budgets **19,518 /
19,704** and **4,369 / 4,391**. 26 of 26 gate commands exit 0.

## W26-05a · Text contrast and gate 28
**Status: MERGED #128, section 12.0 exit 0 on `38c8acf`** (opened 2026-09-22). Inserted at the owner's request from two screenshots.
**Section 12.0 on `2397634`: exit 0, PASS, 51 of 51, 16 of 16 redirects, 0 retried.** Rocă
vulcanică's Compară table rendered every `th` **white on white** (inherited from the dark band),
RO and RU, since W24-07. **A sweep of every visible text element on every page** (15,423 on 67
pages, 1440 and 390) found **exactly one more**: the copertine crumb's page name at 1.06:1, since
W24-08. Both fixed in two rules, no new colour, heights identical to the pixel. **Gate 28**
reads every page's text contrast: exit 1 on `main` with 40 problems (36 `th`, 4 crumbs), exit 0
here; 12 arms, 3 GREEN; it waits out colour transitions and treats `aria-hidden` text as
decoration. **27 of 27 gate commands exit 0.**

## W26-06 · Plăci flexibile, and Acoperișuri off the catalogue
**Status: MERGED #129, section 12.0 exit 0 on `c8125af`** (opened 2026-09-22). W26-R9 to W26-R16 recorded first, with the dispatch's
ratifications; six question headings and twenty backlog statuses moved in place. Label **"Plăci
flexibile" / "Гибкая плитка"**, URL unchanged; **the category text rewritten** because it described
fired floor tile (W17-02 scope, 0 prohibited terms, for ratification). Acoperișuri carries
**`listed: false`**: off the index and the header panel, every page and data use kept. `CATEG-08`
removed from the ledger (a reuse, no file): **347 rows, 314 filled**. Index heights identical;
Plăci flexibile +54 / +109, re-budgeted 12,783 / 13,721.

## W26-07 · Copertine: three library images
**Status: MERGED #130, section 12.0 exit 0 on `9954fac`, the merge after it** (opened 2026-09-22). W26-R8 applied directly: **headless Chrome gets both libraries'
search and photo pages at 200**, where Q-W25-20's `curl` got 307/403/401, so no Google fallback
was needed. `COP-HERO` Unsplash carport at dusk, `COPX-01` Pexels metal tile with its screw,
`COPX-02` Pexels slatted metal fence with louvre gate (a profiled-sheet fence was replaced because
the card says "lamele metalice"). Licence read on each photo page; cropped, downscaled, stripped.
**Gate 19 approves `licence-free library` held to these three slots**, 2 arms, 1 GREEN. Review list
gains a Copertine section. Heights identical. **317 of 347 filled.**

## W26-10 · The last empty products at floor 300
**Status: MERGED #131, section 12.0 exit 0 on `9954fac`** (opened 2026-09-22). W26-R13 applied: **15 attempted, 15 filled**, every catalogue
product slot now has a picture (the 9 roofing `ACIM-` cards are W26-11's). `--floor-300` in `process-packshot.js` held to the 15 ids and
refused elsewhere (watched three ways); `low_res` derived from the file's bytes, **4 rows**.
11 from the product's own Fatade 3D page, 2 from the maker, 2 `google_pick`. **Seven were on
their own supplier page all along** at 600 to 1200px, missed by W25-17. Refused by eye: a FLAGMA
watermark, a pasted-logo composite, a colour chart. **332 of 347 filled.** Heights identical.

## W26-11 · Roofing hub completion
**Status: MERGED #132, section 12.0 exit 0 on `7610bc0`, 51 of 51** (opened 2026-09-22). **6 of 6 tiles and 9 of 9 cards filled; 0 placeholders on the
roofing page; ledger 347 of 347.** W26-R10 imperlux crops clear of headlines, model counts and the
orange mark; Creaton Rapido taken from imperlux's clean category image, not its branded hero;
`ACOP-05` a declared reuse. W26-R11 owner photos for the calculator, discounts and accessories
tiles. Override 16 to 28 in all three lists (fetch tool caught up), watched on planted rows.
Links: `#preturi`, and two cross-page fragments logged as **Q-W26-05**. Counts 4 / 1 / 2 / 18 / 53.
`sips` zero-offset crop fault caught by eye; `ffmpeg` crops, W26-07's re-checked identical.

## W26-12 · Galleries and gate 29
**Status: MERGED #133, section 12.0 exit 0 on `e221ebc`, the merge after it, 53 of 53** (opened 2026-09-22). W26-R14 on all 11 folders: **95 found, 89 installed** (Garduri's
6 byte-identical duplicates once), **9 galleries, 2 empty folders, 0 unmatched**, matched by the
site's own titles after NFC. "Deschide galeria" card after the described projects; Copertine gets a
section; **new page `/servicii/galerie-garduri/`** for "Garduri tip jaluzele". Lightbox: scroll-snap
track (native swipe, no touch handler), keys, Escape, focus trap and return, reduced motion. Two
defects found by driving it and fixed. **Gate 29** 7 arms, 1 GREEN, watched on a real page.
Service pages identical; Copertine +629; gallery page 3,967. **Q-W26-06**: 8 photographs to confirm.

## W26-13 · The dash gate, gate 30
**Status: MERGED #134, section 12.0 exit 0 on `e221ebc`, 53 of 53** (opened 2026-09-22). W26-R15 applied. **547 dashes in 43 files found by a byte
scan; 237 rewritten in 40 files.** Left, as the ruling exempts: 250 in the four R-S records, held
line by line in a SHA-256 baseline that can only shrink, and 60 in imperlux titles quoted in the
audit file, exempt by field. Gate 22's old stylesheet was not exempt: its three comment dashes are
hyphens and gate 22 now verifies it against git with that substitution. **Gate 30** reads bytes in
the tree, the built site (entities and escapes too) and the pull request's commits, title and body;
20 arms, 4 GREEN; watched fail on the real tree, three problems on three messages. Five Russian
sentences rewritten, not repunctuated. RU terasamente +27 (inside 6,000), RU privacy +25 at 390.

## W26-14 · The design pass
**Status: MERGED #135, section 12.0 exit 0 on `e3ba69d`, 53 of 53** (opened 2026-09-22). W26-R16 applied after a rendered study of linear.app,
stripe.com and apple.com/macbook-air/; `docs/design/PRINCIPLES-W26.md` holds ten principles.
Tokens: card 20px, hero 24px, pill buttons, 6% hairline (fields keep `--line`), two-layer shadow,
250ms hover with image 1.03, light sections alternate white and `#F7F5F2` (the eleventh value,
dirty-screen history flagged), phone sections 64px, headings -0.01em. **Found and fixed: no
revealed card ever lifted**, the reveal's `transform: none` outranked it; the lift is `translate`
now. 634 focus stops, every one ringed. 49 of 53 heights identical, none grew; seven budgets
re-measured plus 60. Screenshots in `docs/design/W26/`.

## W27-R-00 · The wave 27 rulings, and the self-merge preflight
**Status: MERGED #136, section 12.0 exit 0** (opened 2026-09-22). The eight owner rulings W27-R-01 to W27-R-08 recorded
verbatim in `docs/rulings/W27-R.md` before any card acted on them. **Preflight measured, not
assumed:** `main` carried **no branch protection** (404) and **no rulesets**, so nothing was deleted
and there was no required check to preserve; auto-merge enabled on the repository. Two protocol
deviations recorded: the merge waits on `gh pr checks --watch` because GitHub's auto-merge has no
required check to wait for, and it is a **merge commit, not a squash**, per `docs/CLAUDE.md`
section 10. **`docs/RC-PROJECT-RULES.md` does not exist**; the rules are `docs/CLAUDE.md`. The two
design proposals exist only as PDFs under `design/`, and their "why" pages were transcribed; the
find-and-replace files they refer to are not in the repo, so the design cards build from the
dispatch's numbers. Section 12.0 on `e3ba69d` (#135): **exit 0, PASS, 53 of 53, 0 retried.**

## W27-C-01 · The eight gallery photographs, owner confirmed
**Status: MERGED #137, section 12.0 exit 0** (opened 2026-09-22). W27-R-03 applied: Q-W26-06's eight photographs (terasamente
02, 04, 05, 10, 13, 14, 16 and finisaje 04) are the owner's own work. **The confirmation is data now**:
each of the eight carries a `review` record in `content/galleries.json` naming the flag, the question,
the ruling and the date, and **`scripts/intake-galleries.js` carries it across a re-run by the source
file's sha256**, so a re-numbered folder keeps the mark on the same picture; before this the next
`--apply` would have wiped it. Nothing on any page changes: no photograph moves, no provenance row
changes, gate 29 reads no flag. Q-W26-06 heading moved to ANSWERED in place.

## W27-C-02 · Tablă cutată, its own group and a ninth roofing tile
**Status: MERGED #138, section 12.0 exit 0** (opened 2026-09-22). W27-R-06 applied. **The seven profiled sheets** (T-12, VP-20,
PK-20, H-35, C-15, C-44, H-60) leave Accesorii for a group of their own with a filter chip, a section
and a Compară table; DRIPSTOP, a coating, stays in Accesorii. **Chips: Toate 78 = 4 + 7 + 1 + 2 + 18 +
46.** A **fifth product tile** on a third bento row, `ACOP-09`, a declared reuse of the T-12 packshot
cropped by the tile itself; hub grids stay at four, so 4 + 5 = **9 tiles** on the page. Gate 20 judges the
fifth on its own two facts; the profnastil redirect lands on `#mat-tabla-cutata`, coupled at build;
verify-live markers 7 chips, 5 pb tiles, 4 tables. Budgets **20,240 / 20,378** (R-Y). Q-W27-01 asks for
a real photograph for the strip tile. **Static gates, gate 20 and gate 14 exit 0 locally.**

## W27-C-03 · Țiglă metalică from Imperlux: the seven models
**Status: MERGED #139, section 12.0 exit 0** (opened 2026-09-22). W27-R-04 and W27-R-05 applied. **Barcelona, Madrid, Bavaria,
Heta, Zet, Finn, Izi**, in imperlux order, first in the section, each with the imperlux preview image
as published (burned-in model name, flagged `label`, W25-R5), the tagline, `De la N lei/buc` with the
current figure only, the named colour chips, and a facts line "N ani garanție · 4,5 kg/m² · N culori"
derived from the specs. **No dasterum name matched**, so all four dasterum models stay after them:
78 + 7 = **85 cards**. The Compară table takes imperlux's columns minus the held warranty row (W26-R6).
A derived **"7 modele, de la 179 lei/buc"** line under each table heading, RU too. RU chips through the
repo's own colour dictionary (Antracit only; Maro, Negru, Ciocolată keep RO, as the dispatch says).
The imperlux override grows by name to 40 slots under a W27-R-04 sentence. Rendered: 0 percent signs
in price blocks, 0 "Popular". Budgets **21,703 / 21,862**. Q-W27-02 on the brand mark and the fourth
colour. **Static gates exit 0**; gates 20 and 28 run before the PR.

## W27-C-04 · Rocă vulcanică Novatik from Imperlux
**Status: MERGED #140, section 12.0 exit 0** (opened 2026-09-22). W27-R-04 and W27-R-05 applied to `/servicii/roca-vulcanica/`.
**The four "Preț la cerere" cards now price**: Classic **De la 207.06 lei/buc**, Slate, Roman and Wood
**227.59**, verified on the rendered page, current figure only. Each card: Imperlux's preview picture
(model name printed in it, flagged `label`; no orange mark on these four), the tagline it already had,
the named colour chips (Earth, Moon, Grey; Moon, Earth, Rossa; Maro, Gri, Negru), **Garanție 60 ani**
as a fact row, kg/m² and the colour count. The comparison table's price row prints the same figures;
its warranty row stays held (W26-R6, claims-held rows 7 and 9 amended). A derived "4 modele, de la
207.06 lei/buc" line under the heading. The four novatik.ro packshots are replaced; 0 `.prod__ask`,
0 percent, 0 "Popular" on the page. Budgets **4,429 / 4,499**. **Static gates exit 0**; gate 28 run
before the PR.

## W27-C-05 · Șindrilă bituminoasă from Imperlux
**Status: MERGED #141, section 12.0 exit 0** (opened 2026-09-22). W27-R-04 applied to the two IKO shingles the section already
had: **IKO Cambridge De la 357 lei/m²** and **IKO Superglass Hex De la 260 lei/m²**, re-verified on the
rendered page; each card gains the tagline, the colour code chips (52, 53, 54; 01, 27, 23), the
warranty line exactly as printed ("25 ani (total) / 15 ani (Platinum) garanție") and kg/m². **The
W26-11 corner crops are replaced by the previews as published**, which carry the category, the model
name and Imperlux's orange mark (Q-W27-02); flagged `label`, and their two ids move to the W27-R-04
override entry because the W26-R10 sentence says "cropped". The section's derived line reads "2 modele,
de la 260 lei/m²". Budgets **21,785 / 21,943**. **Static gates exit 0**; gate 28 run before the PR.

## W27-C-06 · The full Imperlux mirror sweep
**Status: MERGED #142, section 12.0 exit 0** (opened 2026-09-22). W27-R-04 across the six roofing groups, the Novatik page and
the fence models, from a 47-page rendered crawl plus the 21 accessory pages. **Report:
`docs/reports/W27-IMPERLUX-MIRROR.md`**, per group with Imperlux count, RC before, RC after and a source
URL on every record. **Sisteme pluviale**: all 17 aligned; the 11 that folded a Dasterum record now
carry Imperlux's product photo and, since Imperlux publishes no rainwater price, **ask for a price**
(the Dasterum figure stays in the record, unshown); their 11 Dasterum ledger rows are removed as
orphaned. **Țiglă ceramică**: the preview as published, tagline, 50 ani, one named colour; the tile
ACOP-05 keeps the old crop as its own file. **Accesorii**: 20 of Imperlux's 21 added first in the
section (Folie anticondens has no picture at the floor), 46 Dasterum records kept, near names in
Q-W27-03. **Garduri**: already equal on every field. **105 cards**: 11 + 7 + 1 + 2 + 18 + 66. Budgets
**24,232 / 24,453**. **Static gates exit 0**; gates 20 and 28 run before the PR.

## W28-01 · Warm tokens, one motion curve, outlines, quieter orange, 14px floor
**Status: MERGED #143, section 12.0 FAILED on `ff8a922` (two budgets), corrected by #147** (opened 2026-09-22). Design cards W27-01 to W27-05 as the dispatch numbers them,
CSS and one JS colour literal only, no copy, no markup. **Tokens**: `--ink` and `--bg-dark` share
`#1C1917`, `--ink-muted #57534E`, `--line #E6E1DA`, new `--outline #9C9388` (field and filter edges
only), `--hairline` 10%. **Motion**: `--hover-dur` 320ms, `--reveal-dur` 380ms, every transition on
`--ease-out`, buttons lift 1px with a soft shadow, none under reduced motion. **Orange**: the four 4px
top stripes gone (hero price box, offers, tiles, teasers); the promo stripe is a warm ribbon with an
orange dot. Dark-band dividers at 12% white; supplier logos 80%; **every 12 and 13px size is 14px**
(26 rules); `scroll-padding-top: 112px` so an anchor lands under the fixed header. **Palette stays at
eleven**: section 3 amended, the master plan struck in five places, and **`check-stale-docs.js` gains
the four retired values** with three dated-record exceptions. **Static gates, gates 11, 18 and 28 exit
0.** Screenshots `docs/design/W27/w28-01-*`.

## W28-02 · The floating header
**Status: MERGED #144, section 12.0 exit 0** (opened 2026-09-22). Approved under W27-R-07, owner may overturn. **The white strip
and its bottom line are gone**: the band is transparent and lets the pointer through, the pill is 72px
(64 on a phone, 60 scrolled) and floats on a two-layer shadow, the page scrolls behind it. The body
spacer keeps the band's height, so nothing below moves (section 1). The language switch's tracking is
0.04em site-wide, which gives gate 11 back the slack the 14px floor took (least RU slack 8px at 1280+
after W28-01, 10px now). Master plan header row and section 3's shadow list amended. **Static gates,
gates 11, 18 and 28 exit 0.** Screenshots `docs/design/W27/w28-02-*`.
## W27-FIX-01 · Budgets after the 14px floor
**Status: MERGED #147, section 12.0 exit 0** (opened 2026-09-22). **Section 12.0 on `ff8a922` (#143) failed**: `/servicii/tigla-metalica/`
4,347 against 4,283 and RU 4,402 against 4,316, both OVER; every marker verified. Cause measured: the
14px floor grew the tile grid's small print by two lines. **All 53 budgets re-measured on the deployed
tree plus 60**, generated into R-Y; `scripts/verify-live.js` carries them. No page changes.

## W28-03 · Cream ground, white alternate, no section lines, 24/28px corners
**Status: MERGED #145, section 12.0 exit 0** (opened 2026-09-22). W27-R-02 applied: **`--bg-warm` is `#FAF6F0`** and is the page
ground and the default light section; an even light section is white; `.section--divided` draws no
line; `--radius-card` 24px, `--radius-hero` 28px. W26-14's `#F7F5F2` is retired (struck in section 3,
added to `check-stale-docs.js` with the W26-14 ticket body excepted). Still exactly one off-white
beside white, so the palette count holds. **Static gates, gates 20 and 28 exit 0.** Screenshots
`docs/design/W27/w28-03-*`.

## W27-FIX-02 · fetchpriority on the first hub tile, the roofing page's largest paint
**Status: MERGED #152, section 12.0 exit 0** (opened 2026-09-22). W27-REV-01 found the roofing page's Lighthouse performance
**bimodal**, as W26-14 had recorded: LCP is the first hub tile's picture, 1.15s (98) or 1.9s (92).
Lighthouse's LCP discovery insight named the one hint it lacked, `fetchpriority=high`; the first tile of
each hub grid carries it now (build.js, one attribute). Five runs after: **98, 98, 98, 98 and one cold
92** (LCP 1.13 to 1.15s, one at 1.9s); three runs before: 92, 98, 92. No page changes shape.
## W28-04 · Headings: 64 and 48, weight 800, tight, sentence case
**Status: MERGED #146, section 12.0 exit 0** (opened 2026-09-22). Approved under W27-R-07, owner may overturn. **h1 64px at
-0.035em, h2 48px at -0.03em, weight 800, no capitals** (52 and 36 on smaller screens, 30 for h2 on
a phone); the catalogue h1 too. **Eyebrows keep their capitals and gain a 24px orange rule** before
the text. **No locale string changes**: none was stored in capitals, the capitals were CSS. The
master plan's type table struck in place. **All 53 budgets re-measured plus 60** (R-Y table,
generated). **Static gates, gates 14, 20 and 28 exit 0.** Screenshots `docs/design/W27/w28-04-*`.

## W28-05 · Buttons: a dark label on the orange, 17px
**Status: MERGED #148, section 12.0 exit 0** (opened 2026-09-22). **`--ink` on `--brand` at 17px, 5.3:1**, which passes WCAG at any
size, so the 19px large-text allowance that held white-on-orange (section 4) is no longer what holds
it; the catalogue toggle and the card arrow take the same dark label; hover goes darker with a white
label. Section 4 amended. Gate 11 gains slack from the smaller label (least RU slack recorded in the
card). **Static gates, gates 11, 18 and 28 exit 0.** Budgets re-measured. Screenshots
`docs/design/W27/w28-05-*`.

## W28-06 · The form: cream fields with a visible edge, a full-width submit, the aside as a list
**Status: MERGED #149, section 12.0 exit 0** (opened 2026-09-22). **CSS only**: fields fill `--bg-warm` with a `--outline` edge,
56px tall, 14px corners; labels 16px, sentence case, ink; the submit is full width; the contact aside
loses its two boxes and reads as a list on hairlines (the big orange phone, the hours, the note; no
address string exists in the aside, so none is shown). The filter buttons take the `--outline` edge
W28-01 listed. Field names, action, hidden inputs untouched: **gate 13 (form wiring) 64 forms on 62
pages exits 0.** Gates 20 and 28 exit 0. Budgets re-measured. Screenshots `docs/design/W27/w28-06-*`.

## W28-07 · The stats band as four dark cards, and the hero claim card
**Status: MERGED #150, section 12.0 exit 0** (opened 2026-09-22). **Four `#232323` cards on the `#1C1917` band**, left-aligned,
huge orange figure over a white label; the hero claim card takes the same `#232323`. **`#232323` is the
twelfth value**, added to section 3 with its use, never a section ground. Gate 28 exits 0 (white on
`#232323` 15.7:1). Budgets re-measured. Screenshots `docs/design/W27/w28-07-*`.

## W28-08 · Product cards, bento labels, a quiet footer, zebra tables
**Status: MERGED #151, section 12.0 exit 0** (opened 2026-09-22). CSS only. **Product cards** in the fixed order packshot, name,
one line, orange price, soft-filled chips, hairline, facts (the facts pinned to the foot; a card with
no chips keeps its price row at the foot); `.nvk__price` orange too. **Bento labels 32px** (24 on a
phone), and the tile gradient 55% so a two-line label stays covered (gate 20 caught the 40% at
ACOP-03). **Footer**: grey uppercase column heads (`--outline`, 5.2:1 on the band), 17px white links,
no rules. **Tables**: cells 16x24, a dark header row where a table has one, zebra rows on `--bg-warm`;
gate 28's phone arm on the Compară table now watches the row label, because the header row it
planted on is dark on purpose. **W28-T is skipped** (optional, W27-R-08): a two-tone split needs a
generator change, and the card allows CSS and locale strings only. **Static gates, gates 14, 20 and
28 exit 0.** Budgets re-measured. Screenshots `docs/design/W27/w28-08-*`.

## W27-REV-01 · The full site review, and the final run report
**Status: MERGED #153, section 12.0 exit 0** (opened 2026-09-23). On `main` at `a944714` after #152: **29 of 29 gate commands exit
0**; a rendered crawl of 83 pages at three widths in both locales finds **0 dead links, 0 missing images,
0 console errors, 0 sideways scroll, 0 hub anchors**, 16 redirects intact, the form on every service page;
Lighthouse 99/99/100/100/99/99 on six main pages and the roofing page bimodal (RO 92 [98 92 91], RU 98
[92 98 98]), a pre-existing condition recorded, not a fix card. `docs/reports/W27-REVIEW.md` and
`docs/reports/W27-FINAL-RUN.md`; the final screenshot set `docs/design/W27/final-*`. Seventeen statuses
above moved to MERGED with their PR numbers, read from GitHub.


## W27-FIX-00 · The fix-pass rulings, recorded first
**Status: MERGED #154, section 12.0 exit 0** (opened 2026-09-23). The five owner rulings W27-R-09 to W27-R-13 appended
verbatim to `docs/rulings/W27-R.md` with a reading under each, before any fix card acted on them;
the dispatch's self-merge framing recorded with them. Preflight: `main` at `383cf8a` live and
verified, no open pull request, `main` unprotected. Q-W27-02 and Q-W27-03 answered in their
headings. Documents only; no page changes.

## W27-FIX-03 · The eleven rainwater prices, back
**Status: MERGED #155, section 12.0 exit 0** (opened 2026-09-23). W27-R-10 applied: the eleven rainwater parts show their
Dasterum "De la N lei" again (`price`, with a source line; `price_folded_not_shown` retired); the
Sisteme pluviale table's Preț column and the section's "11 modele, de la 33 lei" line are back.
Rendered: 18 cards, 12 priced, 6 asking, the six being the parts no source prices; 0 "Preț la cerere"
against a Dasterum price. Roofing page +32px both locales; budgets 24,842 / 25,063 (R-Y).

## W27-FIX-04 · Russian chip names, and the "+N" chip
**Status: MERGED #156, section 12.0 exit 0** (opened 2026-09-23). Q-W27-02 part 3 and W27-R-11 applied: a third colour
dictionary source (`colour_names` in `content/roofing-sections.json`: Maro, Negru, Ciocolată, plus
Maro închis and Gri); the Russian roofing, Novatik and metal tile pages read 0 for each of the four
Romanian words. A colour counted and not named renders "+N" on the roofing model cards and the
Novatik cards: five tiles "+1", Creaton "+3", IKO Cambridge "+1", Novatik Roman "+2", Wood "+1".
Novatik page +34px both locales; budgets 4,601 / 4,645 (R-Y).

## W27-FIX-05 · Five near-twin pairs fold, three held, one grid measured
**Status: MERGED #157, section 12.0 exit 0** (opened 2026-09-23). W27-R-12 applied with "same physical item" as the test:
Coamă semicirculară, Bordură fronton, Opritor zăpadă, Racord perete (two grades) and Dolie fold
their Dasterum twins (CAT-0273, 0274, 0275, 0278, 0279, 0277), show the folded grade's price, keep
both URLs; six ledger rows orphaned, generated docs regenerated. The membranes, the ridge band and
Folie anticondens held in Q-W27-04. Measured: 1 grid, 99 cards, 60 of 60 accessories in it, chips
sum to Toate, 0 duplicate names. Roofing page 23,873 / 24,094, budgets 23,933 / 24,154 (R-Y).

## W27-FIX-06 · The ten marked previews replaced by the makers' own packshots
**Status: MERGED #158, section 12.0 exit 0** (opened 2026-09-23). W27-R-13 applied: the seven Imperlux tiles take Imperlux's
own mark-free 1080x1080 gallery renders (Imperlux is their maker), under a fifth override sentence
naming the ruling; the two IKO shingles take IKO's own colour swatches from iko.eu; Creaton Rapido
takes the maker's (swissporTON, the former CREATON works) dark-brown render. Every file fetched
through the intake, cropped to 4:3, looked at. A 76-picture sweep found no other overlaid mark;
the factory stamps found (BILKA, mdm VAXO, the Novatik caption, Dasterum's watermark) are recorded.
0 budgets move.

## W27-FIX-07 · The fix-pass report, the backlog statuses and the board
**Status: PR OPEN** (opened 2026-09-23). `docs/reports/W27-FIX-PASS.md`, generated from the run's own
logs: five cards merged and verified live (#154 to #158), none skipped, one partial by its ruling's
test (FIX-05, three folds held in Q-W27-04); 29 of 29 gates on the final tree; Lighthouse on the
roofing page in both locales; the kept-imperlux list; the deviations; the five-line morning list.
Five statuses above moved to MERGED with their section 12.0 exit codes.

## W27-FIX-08 · The seven Imperlux tiles on the metal tile page
**Status: PR OPEN** (opened 2026-09-23). Owner instruction W27-R-14: `/servicii/tigla-metalica/`
renders the seven Imperlux model cards (the roofing page's card, one shared record builder) above
the four Dasterum tile cards; the build refuses a name in both lists. The "Acoperișuri" arrow link at
the foot of the section is the catalogue link the owner asked about, unchanged. Tile page 5,463 /
5,538, budgets 5,523 / 5,598 (R-Y); `productCards: 7` asserted live.
