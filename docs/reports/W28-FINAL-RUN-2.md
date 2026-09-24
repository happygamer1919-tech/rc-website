SELF-MERGE

# W28-FINAL-RUN-2 · wave 28, the third dispatch, 2026-09-24 (evening, UTC)

**Mode: SELF-MERGE under R-W28-01.** Branch protection on `main` requires the `quality` check (strict,
no reviewers). Every pull request below merged with a merge commit after its `quality` run passed, and
was verified live on its merge sha with `EXPECT_SHA=<sha> node scripts/verify-live.js
https://rapidconstruct.md` (exit code recorded). Dispatch received 2026-09-24 about 18:14 UTC; report
written 2026-09-24 19:05 UTC.

## Read this first: what to look at in a browser

1. **A service page, both locales**: `https://rapidconstruct.md/servicii/acoperisuri/` and `/ru/...`.
   The projects section is headed "Exemple de lucrări și soluții" / "Примеры работ и решений". The
   gallery card opens 25 pictures: your 15 first, then 10 stock examples.
2. **The two new galleries**: `/servicii/industrial/` and `/servicii/proiectare-3d/`, 10 pictures each.
3. **The fence gallery page**: `/servicii/galerie-garduri/` shows 22 thumbnails, your 12 first, under
   the same heading, which is now visible there.
4. **The home page** is unchanged: Portofoliu still reads "Proiecte recente" and shows your projects
   only.
5. **The board**: https://claude.ai/artifact/JrELJq3JM8Ub8pmLkdvatk, drawn from the board file on
   `main` (it prints the commit it was drawn from).

## The dispatch, step by step

| Step | Result |
|---|---|
| Rulings R-W28-09 and R-W28-10 | Recorded as **R-W28-10** and **R-W28-11**: #184 had already used R-W28-09 for your message about the two refused pictures. |
| Board JSON synced to the artifact, one PR, before anything else | **#185**, merged and verified. The JSON names #184; the artifact is drawn only from `main` from now on. |
| #183 merged and live | Merged 17:43:27Z as `b95c4b9`, verified live at 17:46:48Z. Checked again for this dispatch, see below. |
| W28-24 as written | **#186**, merged and verified. Every number in the card holds on the live site. |
| Close: this report, board JSON and artifact in sync | This pull request. The artifact is republished from `main` after it merges. |

## Pull requests in this run

| PR | What | Merge sha | quality | Live verify |
|---|---|---|---|---|
| #185 | W28-R3: R-W28-10, R-W28-11, the board synced (documents only) | `07256ee` | pass, 6m51s | PASS: EXIT=0, 18:34:09Z |
| #186 | W28-24: service galleries | `97e56bb` | pass, 6m56s | PASS: EXIT=0, 18:58:05Z |
| this | W28-R4: this report and the closing board sync (documents only) | after merge | | |

Earlier the same day, before this dispatch reached the terminal: #183 (W28-23, merged 17:43:27Z as
`b95c4b9`, EXIT=0) and #184 (W28-26, your own photographs for the membrane and the corner bead,
merged 18:10:11Z as `86e2ca3`, EXIT=0). Zero failed merges and zero failed verifications.

## #183 on the live site

Read with `curl -sSf` from `https://rapidconstruct.md`, which served `86e2ca3` at the time:

| Page | curl exit | Pictures | WebP | "fatade" in a file name | FATADE or fatade3d in an alt |
|---|---|---|---|---|---|
| `/catalog/elemente-decorative/` | 0 | 66 | 64 | 0 | 0 |
| `/ru/catalog/elemente-decorative/` | 0 | 66 | 64 | 0 | 0 |
| `/catalog/alte-materiale/` | 0 | 5 | 3 | 0 | 0 |
| `/ru/catalog/alte-materiale/` | 0 | 5 | 3 | 0 | 0 |

The alt check reads the supplier's mark (`fatade3d`, `fatade 3d`, `FATADE`), not the common noun
"fațadă", as recorded under R-W28-06.

## W28-24 on the live site

Read from the live site at `97e56bb`. For each page: the heading counted as an `h2`, and the lightbox
slides counted against the ledger:

| Gallery | Pictures (yours + stock) | RO heading, slides | RU heading, slides |
|---|---|---|---|
| acoperisuri | 25 (15 + 10) | 1, 25 | 1, 25 |
| case-la-cheie | 12 (2 + 10) | 1, 12 | 1, 12 |
| copertine | 12 (2 + 10) | 1, 12 | 1, 12 |
| fatade | 19 (4 + 15) | 1, 19 | 1, 19 |
| finisaje | 15 (5 + 10) | 1, 15 | 1, 15 |
| galerie-garduri | 22 (12 + 10) | 1, 22 | 1, 22 |
| instalatii | 15 (5 + 10) | 1, 15 | 1, 15 |
| terasamente | 26 (16 + 10) | 1, 26 | 1, 26 |
| reparatii | 37 (27 + 10) | 1, 37 | 1, 37 |
| industrial | 10 (0 + 10) | 1, 10 | 1, 10 |
| proiectare-3d | 10 (0 + 10) | 1, 10 | 1, 10 |

The home page's Portofoliu section holds 6 pictures in each locale, none of them stock and none from a
gallery. Manifest: `docs/images/SOURCES.md` has 193 rows, the 78 catalogue pictures and all 115 gallery
pictures, every one with a licence from the allowed set (gate 32). Alt text is per picture, in both
locales, written by the viewer that accepted it.

## Lighthouse, the 18 service pages

Desktop preset, three runs per page, median reported, on the W28-24 tree served locally (the method
W28-21 used). Performance floor for this card: 90.

| Page | Performance, three runs | Median | A11y | BP | SEO | LCP ms | CLS |
|---|---|---|---|---|---|---|---|
| `/servicii/case-la-cheie/` | 100, 100, 100 | **100** | 100 | 100 | 100 | 782 | 0.031 |
| `/ru/servicii/case-la-cheie/` | 100, 100, 100 | **100** | 100 | 100 | 100 | 802 | 0 |
| `/servicii/acoperisuri/` | 100, 100, 100 | **100** | 100 | 100 | 100 | 782 | 0 |
| `/ru/servicii/acoperisuri/` | 100, 100, 100 | **100** | 100 | 100 | 100 | 802 | 0 |
| `/servicii/fatade/` | 100, 100, 100 | **100** | 100 | 100 | 100 | 764 | 0 |
| `/ru/servicii/fatade/` | 100, 100, 100 | **100** | 100 | 100 | 100 | 762 | 0 |
| `/servicii/reparatii/` | 100, 100, 100 | **100** | 100 | 100 | 100 | 742 | 0 |
| `/ru/servicii/reparatii/` | 100, 100, 100 | **100** | 100 | 100 | 100 | 742 | 0 |
| `/servicii/finisaje/` | 100, 100, 100 | **100** | 100 | 100 | 100 | 721 | 0.002 |
| `/ru/servicii/finisaje/` | 100, 100, 100 | **100** | 100 | 100 | 100 | 702 | 0 |
| `/servicii/proiectare-3d/` | 100, 100, 100 | **100** | 100 | 100 | 100 | 742 | 0 |
| `/ru/servicii/proiectare-3d/` | 100, 100, 100 | **100** | 100 | 100 | 100 | 742 | 0 |
| `/servicii/instalatii/` | 100, 100, 100 | **100** | 100 | 100 | 100 | 762 | 0 |
| `/ru/servicii/instalatii/` | 100, 100, 100 | **100** | 100 | 100 | 100 | 762 | 0 |
| `/servicii/industrial/` | 100, 100, 100 | **100** | 100 | 100 | 100 | 761 | 0 |
| `/ru/servicii/industrial/` | 100, 100, 100 | **100** | 100 | 100 | 100 | 761 | 0 |
| `/servicii/terasamente/` | 100, 100, 100 | **100** | 100 | 100 | 100 | 782 | 0 |
| `/ru/servicii/terasamente/` | 100, 100, 100 | **100** | 100 | 100 | 100 | 781 | 0 |

**18 of 18 at or above 90** (all at 100). The two other gallery pages, measured the same way:
copertine 93 in both locales (LCP 1,802ms; the LCP element is the page's hero photograph
`COP-HERO.jpg`, and the page requests no gallery file on load) and the fence gallery page 98 in both
locales. Read from the Lighthouse network log: a service page requests one gallery file on load, the
card's thumbnail, and none of the lightbox pictures, so the new pictures do not weigh on a service
page's first load.

## Gates

| Tree | Command | Result |
|---|---|---|
| #185 (`973f0d2`) | `node scripts/run-gates.js --keep-going` | 33 of 33 exit 0 |
| #186 (`e4e0870`) | `node scripts/run-gates.js --keep-going` | 33 of 33 exit 0 (run again after the last edit) |
| #186 | `node scripts/check-galleries.js` | exit 0, 406 photographs matched on 22 pages |
| #186 | `node scripts/check-image-sources.js` (the image-sources test) | exit 0, 115 stock gallery pictures, 193 SOURCES rows |
| #185, #186 | CI `quality` | pass, pass |
| `07256ee`, `97e56bb` | `verify-live.js` on the merge sha | EXIT=0, EXIT=0 |
| this (the closing tree) | `node scripts/run-gates.js --keep-going` | 33 of 33 exit 0 |

## The membrane (R-W28-11)

The ruling allows a Google Images Creative Commons find only under three conditions, and otherwise
keeps the placeholder. It arrived after you had supplied your own photograph of the roll (R-W28-09,
installed by #184), so **no Google find was used and no placeholder remains**. Your file is 225 by 225
pixels, below the 450-pixel floor every other catalogue picture meets, so the card paints it soft. A
larger copy of the same photograph fixes it in one run.

## Deviations, flagged

1. **Ids renumbered a third time.** The dispatch's R-W28-09 and R-W28-10 are recorded as R-W28-10 and
   R-W28-11, each quoting the dispatch, because #184 had used R-W28-09.
2. **A board sync is not a card.** A card's pull request cannot record its own merge, which is why the
   JSON lagged. The rule now in the register and the JSON: the artifact is drawn only from `main`
   after a merge, a card's merged state lands in the next pull request, and a run ends with a
   documents-only sync listed under `board_syncs`. #185 and this pull request are the two syncs.
3. **The heading on two more surfaces.** The card names the service pages. The copertine gallery and
   the fence gallery page gained stock pictures too, so they carry the same heading. On the fence
   gallery page the heading was screen-reader only and is now visible.
4. **Two intake fixes the card needed.** The stock intake looked up a gallery by folder page only, and
   the fence folder's page is `garduri` while its gallery lives on `galerie-garduri`. It now looks up
   the page a gallery renders on. The folder intake, which rewrites the gallery ledger, now keeps the
   stock pictures on a re-run.
5. **The folder intake was tested on synthetic folders.** Your `RC-webpics_v2` folders are no longer on
   this machine. The source can now be pointed elsewhere with `RC_GALLERY_SRC`. A dry run against
   synthetic folders carried all 115 over, refused a missing folder, and wrote nothing.
6. **No new browser gathering.** The 115 pictures were chosen and viewed twice during the W28-23
   harvest. The Chrome route was ratified for W28-23 only and was not used again.
7. **Two stray lines removed.** Earlier union merges left two stray lines in `DECISIONS.md` and
   `docs/BACKLOG.md`, and two contradicting W28-23 status lines in the backlog. #185 removed them.

## Taste notes, no action taken

- One finishing picture and one renovation picture come from the same photo shoot (the same man, the
  same room).
- Two installation pictures are weak on subject: two red junction boxes on a white wall, and a tiled
  wall with one socket.
- The turnkey-house examples show timber-frame houses in the North American style. Your own houses
  are masonry.
- Copertine is the slowest gallery page at 93, because of its hero photograph.

## Still open, waiting on you

- **Q-W28-01**: the Search Console tag's content value (W28-20).
- **Q-W28-02**: copertine prices (Imperlux publishes none), and two model pictures that read as renders.
- **Q-W28-03**: three plate colours; RED 69 and RED 70 share one picture.
- **Q-W28-04**: is 320px a supported width? The Russian header spills 17px there (W28-FIX-02).
- **The membrane photograph** at 225px: a larger copy, if you have one.
