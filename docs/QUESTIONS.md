# Open questions for the owner

Append only. Never delete an entry; mark it answered and keep it.
Every entry carries a recommended default, and the build ships that default so
nothing is blocked waiting for an answer.

---

## Q-01 · Supplier logo files — ANSWERED 2026-09-01, closed by Q-08 (opened 2026-08-31, W6-01)

Twelve brands are now named in the marquee: technonicol, bilka, novatik, iko,
swisspor, knauf, baumit, ceresit, weber, ytong, holcim, bosch.

**Needed:** one full-colour logo file per brand, dropped at
`public/img/suppliers/<slug>.svg` (preferred) or `.png`. Transparent background.
No second greyscale asset: the grey default state is a CSS filter.

**Default shipped:** a chip with no logo file renders the brand name as text in
the white tile. The fallback is per brand, so the first logo to land shows as a
logo while the other eleven stay text.

**Also needs a ruling:** are all twelve brands actually used by Rapid Construct?
The marquee is a public claim about suppliers. The names came from the card, not
from the site copy, so they are treated as the owner's input rather than
invented, but nobody has confirmed the list against the business.

---

## Q-02 · Projects per service — ANSWERED 2026-09-01, default ratified (opened 2026-08-31, W6-02)

The card asks for 5 to 7 projects per service across 9 services (45 to 63).

**Default shipped:** 6 per service, 54 total. Mid-range, and it divides evenly.

---

## Q-03 · Gallery slots on stub projects — ANSWERED 2026-09-01, default ratified (opened 2026-08-31, W6-02)

The manifest's project shape is 1 cover + 3 to 4 gallery photos. Applying it to
44 new stub projects would put 132 unshootable gallery slots into the shoot plan.

**Default shipped:** stub projects carry a cover slot only. Gallery slots are
added to a project when it has real content and real photographs, which is what
manifest rule D-6 already says ("a project with fewer than three usable gallery
photos ships as cover only"). The 10 existing projects keep their galleries.

Cost of the alternative, for comparison: 216 photo slots instead of 89.

---

## Q-04 · Real content for 44 stub projects — OPEN, opened 2026-08-31 (W6-02) · still open at wave 8

Every stub ships with empty fields and is invisible on the site: `build.js`
drops any project without a real title and summary. They become visible only
when someone fills them.

**Needed per project:** title, summary, and optionally location, year,
work_type, area_sqm, duration, main_materials, challenge. Nothing is invented.

---

## Answered

Rulings from the owner, wave 8, 2026-09-01. **No question text above was
deleted**; only the status token in each heading changed. The reasoning that
produced each default is preserved exactly as it was written.

| Q | Ruling | Effect |
|---|---|---|
| **Q-01** | Closed by Q-08 | The supplier list is confirmed, so the standing "is this list right?" half of Q-01 is settled. The per-brand logo files it asked for are tracked in Q-07. |
| **Q-02** | **Default ratified: six projects per service** | No change. `content/projects.json` keeps 54 projects, 6 per service across 9 services. |
| **Q-03** | **Default ratified: stubs carry a cover slot only** | No change. The manifest stays at 105 slots rather than the 216 that reserving three gallery slots per stub would have produced. |
| **Q-05** | **Resolved by W7-02** | The nine root `svc-*.png` were the service card artwork. They were moved into `photos-raw/`, processed, and all nine cards now render photographs. Nothing remains at the repo root. |
| **Q-06** | **RATIFIED: the header pill stands** | The master plan loses. Its locked-decisions row and section 5.1 were both amended in W8-04 so the contradiction no longer exists in the repo. 96px height stands. See DECISIONS.md. |
| **Q-07** | **Partial: bosch dropped entirely** | Twelve brands become **eleven**. Bosch's tile, locale entries and manifest row are gone. `ceresit` and `weber` stay as text fallbacks and Q-07 **remains open for those two only**. |
| **Q-08** | **CONFIRMED by the owner** | The supplier list is real. With bosch removed it is the eleven remaining brands. |

**Still open: Q-04** (real content for the 44 stub projects) and the
`ceresit` / `weber` half of **Q-07**.

---

## Q-05 · Nine `svc-*.png` files in the repo root — ANSWERED 2026-09-01, resolved by W7-02 (opened 2026-08-31, W6-03)

Nine untracked files sit in the repo root: `svc-case-la-cheie.png`,
`svc-acoperisuri.png`, `svc-fatade.png`, `svc-reparatii.png`, `svc-finisaje.png`,
`svc-proiectare-3d.png`, `svc-instalatii.png`, `svc-industrial.png`,
`svc-terasamente.png`. Each is 1448x1086 (4:3) and 1.7 to 2.2MB, timestamped
15:10 to 15:14 on 2026-08-31, which is before this session started. They were
not created by W6-03.

They match the nine service card slots by name and by ratio, which is very
likely what they are for.

**Nothing was done with them.** They are untouched, unstaged and uncommitted,
because moving or committing someone else's files is not this card's call.

**If they are the service card artwork**, the route in is:

    mv svc-*.png photos-raw/          # rename any .png to .jpg first, or keep .png
    node scripts/process-photos.js    # writes 800x600 and 1600x1200 into public/img
    node build.js                     # each card flips from SVG to photo on its own

One warning to expect: 1448px on the long edge is under the manifest's 1600px
minimum, so the pipeline will accept them and say so. The 2x would be upscaled
from 1448 to 1600. If better originals exist, they are worth finding first.

**If they are not**, they should be deleted or moved out of the repo root.

---

## Q-06 · The header contradicts a locked master-plan decision — ANSWERED 2026-09-01, RATIFIED (opened 2026-08-31, W7-01)

Found while deriving `docs/CLAUDE.md` from committed material, not while
looking for it.

Master plan section 3, in the **Locked decisions** table:

> **Header** — White bar with accent. Solid, opaque, sticky. Not transparent,
> **not a floating dark pill.**

What is built (`src/styles.css`): a white `#FFFFFF` bar, 96px, opaque, fixed,
1px `--line` bottom border — containing a **`#141414` pill with
`border-radius: 999px`** that holds the nav, phone, CTA and language switcher.

**`DECISIONS.md` says nothing about the header.** Not one entry. That file
exists to record every departure from the master plan, and this departure is
from a decision the plan marks as locked and specifically warns against.

**In fairness to the build**, it honours most of the clause: the bar is white,
solid, opaque, and not floating (it is fixed with a constant body spacer). It is
a dark pill *inside* a white bar, not a floating dark pill. Whether that is the
thing the plan ruled out is a judgement, and that is exactly why it should be
recorded and is not.

The master plan also specifies header height 72px; the built bar is 96px
desktop and 80px mobile.

**Nothing was changed.** The header is not this wave's card, it was approved by
Mihai in the phase 1 snapshot on 2026-08-28, and reversing an approved visual on
my own reading of an older document would be guessing a product decision.

**Options:**

1. **Ratify it.** The pill shipped, it was approved, it looks deliberate. Add a
   `DECISIONS.md` entry saying the master plan loses here and why. One paragraph,
   no code. **Recommended.**
2. **Revert to the plan.** Drop the pill, put the nav on the white bar in
   `--ink`. This is a visible change to something Mihai has already signed off,
   and it would need re-approval.
3. Leave both documents contradicting each other. Not recommended: the next
   executor booting from the master plan reads "not a floating dark pill" as a
   live rule and may "fix" a header nobody asked them to touch.

**Default shipped:** option 3 by inaction, which is why this question exists.
No code changed and the contradiction is now at least written down.

**Related, already fixed:** `RELEASE-NOTES.md` carried three stale header
numbers (a "72px spacer" and a "72px -> 64px" compression; the real values are a
96px spacer and 64px -> 56px). Corrected in the W7-01 commit, since
`docs/CLAUDE.md` cites that file as a source and citing a wrong source is worse
than not citing one.

---

## Q-07 · Three supplier tiles have no logo — SUPERSEDED 2026-09-01 by W9-01; see Q-10 (opened 2026-08-31, W7-03)

Nine of the twelve brands now show a logo. Three still show the brand name as
text. Each needs a different decision from you, and none of them is mine to make.

**Bosch — blocked by usage terms.** Bosch's legal notice says third parties
agree *"not to copy, use or otherwise infringe upon these marks"*. The card said
to skip a brand whose terms visibly forbid display, so it was skipped.
**To resolve:** ask Bosch for written permission, or leave it as text. If Bosch
is not actually a supplier you want to name, dropping it from the twelve is the
cheapest answer.

**Ceresit — no full-colour asset at a permitted source.** Henkel publishes only
a white-on-transparent Ceresit wordmark, which is invisible on a white tile.
**To resolve:** ask your Ceresit or Henkel rep for the colour logo. A supplier
will usually send a brand pack on request, and that lands it in the top-priority
source category.

**Weber — no Weber mark is published.** Saint-Gobain has folded Weber into the
masterbrand, so `ro.weber` serves the Saint-Gobain corporate logo. Putting that
in a tile captioned "Weber" would misrepresent it.
**To resolve, three options:** relabel the tile "Saint-Gobain Weber" and use the
Saint-Gobain logo; ask your Weber rep for the product-brand mark if one is still
issued; or leave it as text.

**Default shipped:** all three render as the styled brand name, which is the
designed fallback and looks deliberate rather than broken. Nothing is blocked.

---

## Q-08 · Are all twelve brands really your suppliers? — ANSWERED 2026-09-01, CONFIRMED by the owner (opened 2026-08-31, W7-03)

This was raised in Q-01 and has not been answered. It matters more now that nine
of them appear as real logos rather than placeholder text.

The marquee sits under the heading *Materiale și utilaje* with the line
*materials and equipment we usually work with*. With logos rendered, that reads
as a supplier claim about the business, not as decoration. The twelve names came
from the wave 6 card, so they are your input, not invented — but nobody has
confirmed the list against what Rapid Construct actually buys and installs.

**Recommended:** confirm the list before the site goes in front of clients, and
drop any brand you do not actually work with. A wrong logo here is the kind of
detail a competitor or a supplier rep notices.

---

## Q-09 · The hero panel alt text describes an illustration that is gone — OPEN, opened 2026-09-01 (W8-03)

W8-03 replaced the hero panel SVG with a photograph. The alt text still
describes the SVG, and it is wrong twice over.

| | Current value |
|---|---|
| RO | `Ilustrație: casă la cheie construită de Rapid Construct` |
| RU | `Иллюстрация: дом под ключ, построенный Rapid Construct` |

1. **It says "illustration".** The slot now holds a photograph. Fixing this half
   needs no product knowledge.
2. **It says a turnkey house built by Rapid Construct.** The photograph shows
   three workers in hi-vis vests on scaffolding around rebar in a dusty
   interior. It is not a finished house, and **whether Rapid Construct built it
   is not something the repo knows.**

A screen reader user is currently told about an image that is not on the page.

**Nothing was changed**, because clause 2 is a provenance claim only you can
make, and inventing a description would break the standing rule that no copy is
ever invented.

**Two things are needed from you:**

- **Is this photograph Rapid Construct's own work?** If it is not, the alt must
  not claim it is, and master plan section 7's "real Rapid Construct work only"
  rule may mean the photo should not be in a hero slot at all.
- **Approve replacement alt text.** Recommended, describing only what is
  visible and claiming nothing:
  - RO: `Echipă pe schelă, în timpul lucrărilor de structură`
  - RU: `Бригада на лесах во время работ по конструкции`

**Default shipped:** the wrong alt text, unchanged. This is the one thing in
wave 8 that ships knowingly incorrect, and it is a two-string fix once you rule.

---

## Q-10 · CAT has no logo, and the same terms blocked Bosch — ANSWERED 2026-09-01, resolved by W9-03 (opened 2026-09-01, W9-01)

W9-01 replaced two brands: `ceresit` -> `cat` and `weber` -> `heidelberg-materials`.

**Heidelberg Materials landed a logo** from its own website. That closes the
`weber` half of Q-07, and `ceresit` left the list entirely, so Q-07 is
superseded rather than left hanging.

**CAT did not, and cannot without permission.** Caterpillar's trademark notice
says its logos "may not be used without permission" — the identical wording that
took Bosch off the list in W8-04. One text tile out of eleven.

**Three ways to resolve, yours to pick:**

1. **Ask Caterpillar, or your Cat dealer.** Dealers routinely hold co-branding
   packs and permission for a supplier listing is a normal request. This is the
   one that ends with a logo on the tile.
2. **Leave it as text.** It renders as a styled brand name, consistent with the
   other tiles, and nobody will read it as broken.
3. **Drop CAT** the way Bosch was dropped, taking the list to ten.

**Default shipped:** option 2, the text fallback.

**RESOLVED 2026-09-01 (W9-03), by a fourth option the owner authorised:**
replace CAT with a comparable brand that comes with a logo. **Liebherr** was
chosen — a top-three global heavy equipment maker alongside Caterpillar and
Komatsu, covering excavators, loaders, dozers, cranes and concrete technology,
and European like the rest of the list. Its legal notice states no restriction
on third-party use. JCB was the closer visual match to CAT but its terms pages
404 and its only legal page is a trademark-misuse warning, so the brand whose
terms could actually be verified was taken.

**The marquee now has zero text fallbacks: eleven brands, eleven logos.**

**Worth knowing:** the two brands that came off the list, Ceresit and Weber,
were both text tiles, and one of the two replacements carries a logo. The
marquee went from two text tiles to one.

---

## Q-11 · "HeidelbergCement AG" is a retired name — ANSWERED 2026-09-01 by the rename itself (opened 2026-09-01, W9-01)

The request named the brand **HeidelbergCement AG**. That company renamed itself
**Heidelberg Materials** in September 2022. The logo it publishes today reads
*Heidelberg Materials*, and the legal entity is Heidelberg Materials AG.

**Shipped as "Heidelberg Materials"**, so the visible logo, the `alt` text and
the accessible name all agree. Labelling the tile with the retired name over a
logo that reads something else would both mislead a screen reader user and put a
dead brand on the page.

Recorded as answered rather than open because the rename is a verifiable fact,
not a product decision. **If you want the old name shown anyway, it is one word
in `locales/ro.json` and `locales/ru.json`.**

---

## Q-W9-04 · Nine more photographs fail the "real Rapid Construct work" rule

**Raised:** W9-04, 2026-09-01. **Status:** shipped a default, needs an owner ruling.

R-D struck four files. Viewing all forty-two at full size found **nine more**
that fail master plan section 7 the same way, four of them with proof visible
in the frame. They were dropped rather than published, and any of them is one
line in `content/projects.json` away from coming back.

### Struck on visible evidence, four files

| Project slot | What is visible in the frame |
|---|---|
| `fatade-05` (600x900) | A **`dreamstime` stock-library watermark** printed across the middle of the image. |
| `reparatii-03` (1200x1600) | Three workers in branded vests reading **`MITCHELL ROMÁN`**, legible on two of them. Another contractor's crew. |
| `reparatii-04` (736x981) | A before/after composite carrying a **`G6` studio logo** top centre. Same class as the `image (73).png` already struck by R-D. |
| `terasamente-04` (1200x1500) | A site banner reading **`NOW HIRING · AllFinishConcrete.com · Foremen, Finishers, Wall & Flatwork Laborers`**, beside a MACK truck. A United States concrete contractor. |

Publishing any of these puts another company's mark, or a stock library's
watermark, on Rapid Construct's portfolio. That is not a judgement call and it
was not treated as one.

### Struck on the owner's own R-D reasoning, four files

All four remaining `Construcții industriale` photographs: `industrial-01`,
`industrial-02`, `industrial-03`, `industrial-04`. R-D already struck the fifth
file from that folder for failing the real-work rule. `industrial-01` is the
**same site, same day** as the struck one. The other three are a Turkish
apartment block and two arid low-rise sites. Keeping four while striking their
sibling would have applied the owner's ruling inconsistently.

**Consequence, and it is visible to a visitor:** `industrial` now has zero
renderable projects, so **`/servicii/industrial/` and `/ru/servicii/industrial/`
are the only two service pages still carrying `noindex`**. The W3-02 gate is
working exactly as designed; the service simply has no real photograph yet.

### Kept, but the owner should look

`case-la-cheie-01`, `fatade-02` and `fatade-03` are architecturally
inconsistent with Moldova (arid ground, flat parapet roofs, decorative metal
grille doors). **Style is not proof**, no mark is visible in any of them, and no
sibling in either folder was struck by R-D, so there was no ruling to apply.
They shipped. `finisaje-02`, `reparatii-01` and `instalatii-04` are likewise
unremarkable but unplaceable.

**Recommended default, shipped:** publish the thirty-four that carry no visible
third-party mark and no struck sibling. **What is needed:** one word per flagged
file, keep or strike, and a replacement photograph for `industrial` if that page
is to be indexable before launch.

---

## Q-W9-05 · The locality list was never supplied

`location` is empty on all thirty-four projects. A-03 said the list would be
supplied and it was not. Under master plan section 6 an unsourced field is
omitted, never filled, so the chip simply does not render. Supplying the list
later is a data-only change: no template, no build, no photo reprocessing.

---

## Q-W9-06 · The two live form submissions are blocked on a publish

**Raised:** W9-05, 2026-09-01. **Status:** blocked, not failed.

B-01 asks for one real submission from the live RO site and one from the live RU
site, reporting the subject lines that arrive. Everything up to that point is
done and verified in a browser, both locales, both the armed and the disarmed
path. The live test needs two things this session cannot supply:

1. **The real `WEB3FORMS_KEY` in repo secrets.** A secret is not readable from a
   checkout, so whether it has actually been added cannot be confirmed from
   here. The workflow already references it correctly.
2. **A merge to `main`, which is a publish.** CLAUDE.md section 10: "Pushing
   `main` is a publish." That is owner-confirmable and was not done unasked.

**What unblocks it:** confirm the secret is set, then authorise the merge. The
build log prints `form: ARMED, posts to Web3Forms.` when the key is present and
`form: DEMO MODE.` when it is not, so the deploy log answers question 1 by
itself. After that the two submissions take a minute and the subjects to expect
are exactly `[RO] Solicită ofertă gratuită — /` and
`[RU] Запросите бесплатную оферту — /ru/`.

---

## Q-W9-07 · The RO homepage title and description exceed their limits

**Raised:** W9-06, 2026-09-01. **Status:** reported, not changed.

Across 24 pages, every title and every description is unique and inside its
limit **except two**, both existing approved copy on the Romanian homepage:

| Field | Now | Limit |
|---|---|---|
| `meta.title` | 62 characters | 60 |
| `meta.description` | 176 characters | 155 |

The Russian equivalents are 60 and 155, exactly at the line. Nothing was
rewritten: master plan section 6 says copy is not invented or edited beyond
shortening, and shortening approved homepage copy is the owner's call.

**Recommended, if he wants them fixed.** Title, dropping two words and keeping
the meaning: `Construcții și renovări în Chișinău · Rapid Construct` (53).
Description, cutting the trailing price clause, which the hero already states:
`Acoperișuri, fațade, renovări complete și finisaje în Chișinău, Orhei, Cahul și
Costești. Garanție scrisă până la 30 de ani, materiale certificate UE.` (152).

**A separate inconsistency worth a decision.** `meta.description` says the work
happens in "Chișinău, Orhei, Cahul și Costești"; `band.coverageLine` says
"Chișinău, Codru, Coșnița, Costești, Căinari și Sociteni", and that second list
is what feeds `areaServed` in the structured data and `llms.txt`. Two different
answers to "where do you work" are live on the same page. Only Chișinău and
Costești appear in both. This predates the wave and was not touched.

---

## Q-W9-08 · SITE_URL, and what actually breaks when the domain lands

**Raised:** W9-06, 2026-09-01. **Status:** answered, no action needed yet.

C-01 assumed `SITE_URL` is unset and that every canonical, hreflang and og:url
is therefore wrong. **It is set, and they are correct.**

`.github/workflows/pages.yml` sets `SITE_URL: https://happygamer1919-tech.github.io`
with `BASE_PATH: /rc-website`, so the deployed pages carry canonicals and
hreflang for the origin they are actually served from. Unset only applies to a
local build, which falls back to `https://rapidconstruct.md`.

**Already correct, nothing to redo later:** canonical, both hreflang pairs and
x-default, og:url, og:image, the JSON-LD `@id` and every `url` in it, the
`Sitemap:` line in robots.txt, every `<loc>` in sitemap.xml, every URL in
llms.txt, and the breadcrumb items. All eighteen derive from `SITE`.

**What the domain change costs: one environment variable.** The string
`rapidconstruct.md` appears exactly once in the whole repo, as the fallback on
`build.js:8`. Nothing else hardcodes a host, including the form subject lines
added in W9-05, which deliberately carry a path and no host so they stay true
under either origin.

**What breaks at cutover, and it is not the markup:** the GitHub Pages site and
the custom-domain site will briefly both be live and serving identical
canonicals unless the old origin redirects. Set `SITE_URL` and `BASE_PATH` in
the workflow in the same commit that points DNS, and treat the github.io origin
as retired the moment it is.

---

## Q-W10-01 · WEB3FORMS_KEY is not set. The live form test cannot run.

**Raised:** W10-02, 2026-09-01. **Status:** BLOCKED on the owner. Nothing to build.

W10-02 states the key is present as a repo secret. **It is not.** Three
independent checks, all against the live repository:

1. The deploy that just published `b4bf763` logged
   `form: DEMO MODE. No WEB3FORMS_KEY set, so the form validates and then shows
   the inline notice instead of posting.`
2. `GET /repos/happygamer1919-tech/rc-website/actions/secrets` returns
   `{"total_count": 0, "secrets": []}`. Both environments, `github-pages` and
   `Production`, also return zero. The repo is user-owned, so there is no
   organisation scope to inherit from either.
3. The live HTML at `/rc-website/` carries `data-armed="0"` and still emits the
   `data-demo` attribute, which an armed build does not.

**The wiring is not the problem.** `.github/workflows/pages.yml` already passes
`WEB3FORMS_KEY: ${{ secrets.WEB3FORMS_KEY }}` into the build step, and a secret
that does not exist expands to an empty string, which is exactly what
`build.js` reports. Nothing in the repo needs to change.

Submitting the live form now would only reproduce the demo notice. It would not
test delivery, no mail would reach `rapidconstructmd@gmail.com`, and reporting a
subject line from it would be reporting a thing that never happened.

**What unblocks it, in order:**

1. Create the Web3Forms access key at web3forms.com for
   `rapidconstructmd@gmail.com`, if one does not exist yet.
2. Add it at Settings → Secrets and variables → Actions → New repository secret,
   named exactly `WEB3FORMS_KEY`. A repository secret, not an environment
   secret: the `build` job declares no `environment:`, so an environment secret
   would still expand empty and the symptom would look identical.
3. Push any commit to `main`, or run the workflow by hand. **The deploy log
   answers whether it worked before anyone opens a browser**: it prints
   `form: ARMED, posts to Web3Forms.` when the key is present.

The two live submissions then take a minute. The subjects to expect are
`[RO] Solicită ofertă gratuită — /` and `[RU] Запросите бесплатную оферту — /ru/`.
