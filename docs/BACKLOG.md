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
| W25-03b | Packshot rerun under the 500px floor, and a correction to W25-03 | `w25/w25-03b-packshots-rerun` | PR open, awaiting owner: **0 filled**; **28.87GB and 727 temp dirs reclaimed** after verifying every one matched this repo's own mkdtemp pattern and was owned by this user, zero foreign, and **all six browser gates now clean up on exit** (the leak was `fail()` calling process.exit so `stop()` never ran), proved on a passing and a deliberately failing run; floor implemented at 500/600 with **499 refused** as ruled and nothing ever upscaled; **W25-03's central finding was WRONG** — 51 of the 88 plates are Phomi products, not 17, because I matched category listings instead of the colour variants inside them, so no `brand_hidden` was applied and Q-W25-06 asks you to re-rule; and the corrected 51 still fill nothing, the 18 family images being 459px and the 33 variants carrying their English names burned into the picture; **the 500 floor unlocks nothing**, the measured population being 343 to 492 with ROKO short by 8px (Q-W25-07 recommends 450) |
| W25-03 | Packshots: plăci ceramice | `w25/w25-03-packshots-placi` | PR open, awaiting owner: **0 filled of 88**, two independent blocks both measured; **the 800px floor now confirmed on the manufacturer carrying 88 products** (`phomi.com`'s own tile faces are 459x398, clean and correct in every other way), making Q-W25-02 the single decision gating the largest card in the wave; and **70 of the 88 are not Phomi products at all**, matched name by name against the manufacturer's own catalogue, with the source's own URLs disagreeing with its own names (`elysee-pure-white` displayed as "Kamu Yellow"), so the site currently states a manufacturer for 70 products that manufacturer does not make; Q-W25-04 recommends hiding those brand lines; worked directly without agents after W25-02's 11-of-14 stall |
| W25-03c | The floor moves to 450, and twenty-six slots fill | `w25/w25-03c-intake-450` | PR open, awaiting owner: **slots filled 1 of 261 before, 27 of 261 after**; 25 Phomi families at 459x398 and `CAT-0033` ROKO AquaMix at 492x400, every one from the manufacturer's own site and looked at by a person; **the full Phomi walk moved the family count from 18 to 25** and caught `CAT-0111` "Rusty Slab", which Phomi's product page calls "Rusty Stone" and only its category card names our way; **60 colour variants stay placeholders on a measurement**, the smallest crop that removes the burned-in English name leaving 650x320 or 350x450, both short; `CAT-0038` short by 27px at 423x400 and DURAZIV short by 107px at 343x335, re-measured; floor 450 with **8 arms** watched including `--label` with no `--crop`, and the crop proved directional; gate 19 gains the one-picture-one-card rule with **2 new arms**, 10 in all; **21 of 21 gates exit 0** and the note names why four cards said 19; Q-W25-05 written down at last, Q-W25-08 and Q-W25-09 opened |
| W25-03d | Three catalogues walked, and the brand of all 88 plates settled | `w25/w25-03d-brand-settlement` | PR open, awaiting owner: **settled counts Phomi 85, Ecofasad 0, Kordeko 0, `brand_hidden` 3**; the false-attribution count went 70 then 37 then **3**, and it is data now in `content/plate-brand-settlement.json` with the matched name, tier and catalogue page per plate; 10 of 10 sampled matches verified against the name **Phomi burns into its own swatch**, including `Y001-01-02` exactly, which is what settles the code-like names; **Ecofasad names none of its 102 textures** (`rock-1808`, `marble-1801`) so no plate name can match one, reported not attempted; Kordeko's 22 named flexible tiles hold none of the three residuals; **no Russian domain found, so none fetched**; new **gate 23** `check-plate-brands.js` holds the records to the settlement both ways with **9 arms** and both real defects watched fire on the shipping files; **`scripts/run-gates.js` shipped** reading `quality.yml` itself after the hand-written runner went stale a second time inside one session, 3 arms watched; **22 of 22 gates exit 0**; Q-W25-10 and Q-W25-11 opened |
| W25-04 | Packshots: sisteme de iluminare | `w25/w25-04-packshots-iluminat` | PR open, awaiting owner: **0 filled of 25**, re-derived today, 0 of the 25 name a manufacturer and none has gained one; **attempted, not assumed**, which is W25-02's lesson: three source pages read for text carry no manufacturer field at all, and `K1207` and `GMD-881` searched as model codes return unrelated catalogues, so they are OEM codes and a confident guess would put a different lamp on the card; all 25 handed to W25-05 by name; **gate 19 gains the rule the card's number cannot keep**, a filled slot whose record names no manufacturer may not claim a manufacturer packshot origin, watched fire synthetically and on the shipping files, 11 arms; 103 catalogue products now have no usable manufacturer; **22 of 22 gates exit 0** |
| W25-05 | The AI prompt pack, written outside the repo | `w25/w25-05-ai-prompts` | PR open, awaiting owner: **126 prompts written, 135 rows held with a reason each**, to `~/Documents/rc-audit-w24/AI-PROMPTS-W25.md` outside the repo; **generated by `scripts/gen-ai-prompts-w25.js` from the ledger and the records**, not typed, so it shrinks by itself as slots fill; the biggest held group is **67 named tile products** (63 ceramic plates and the 4 Novatik tiles) on W25-R2, which is the rule that kept 60 plates grey at W25-03c and would be walked around by generating them; 8 evidence slots held on W25-R3, 33 held as packshot work, 27 already filled; the style block's first rule is no text, for the same reason; unbranded materials prompted as the MATERIAL never a package, so no card invents a manufacturer's sack; **89 of the 126 are products whose appearance the records do not describe** and every one is marked, Q-W25-12 recommends splitting; **Q-W25-10's option (a) withdrawn** as contradicting W25-R2; 22 of 22 gates exit 0 |
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
