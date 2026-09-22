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

## Q-04 · Real content for ~~44~~ **16** stub projects — OPEN, opened 2026-08-31 (W6-02) · still open at wave 8 · **count AMENDED (W21-03, RC-148): 16 on 2026-09-17, measured from `content/projects.json` and held by `scripts/check-stub-count.js`; 44 was the W6-02 count**

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

## Q-09 · The hero panel alt text describes an illustration that is gone — **ANSWERED 2026-09-07, both locales rewritten** (opened 2026-09-01, W8-03; answered W12-34)

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

## Q-W9-05 · The locality list was never supplied — **CLOSED 2026-09-07 by ruling R-U: empty is the final state** (opened 2026-09-01, W9-04; closed W12-34)

`location` is empty on all thirty-four projects. A-03 said the list would be
supplied and it was not. Under master plan section 6 an unsourced field is
omitted, never filled, so the chip simply does not render. Supplying the list
later is a data-only change: no template, no build, no photo reprocessing.

---

## Q-W9-06 · The two live form submissions are blocked on a publish — **CLOSED 2026-09-17 (W20-01, RC-144), settled by Q-W10-01, CLOSED 2026-09-06 (W12-04): the key is set and a real browser submission landed at 08:57 on 2026-09-06; the same evidence is in `docs/BACKLOG.md`, wave 12. The wave 12 handoff in `RELEASE-NOTES.md` still records one of the two per-locale submissions as remaining; closed at the owner's instruction on the Q-W10-01 evidence, with form wiring now asserted by RC-145** (opened 2026-09-01, W9-05)

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

## Q-W9-07 · The RO homepage title and description exceed their limits — **TITLE ANSWERED AND SHORTENED 2026-09-07; DESCRIPTION STILL OPEN** (opened 2026-09-01, W9-06; title answered W12-34, which also corrects this entry's figures)

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

## Q-W10-01 · WEB3FORMS_KEY is not set. The live form test cannot run. — **CLOSED 2026-09-06** (W12-04)

**Closed by the owner.** `WEB3FORMS_KEY` is set as a repository secret and a real
browser submission landed in the inbox at 08:57 on 2026-09-06. That submission is
the evidence; nothing in the repo needed to change, which is what this entry
predicted.

**The DEMO MODE line in a local build is correct behaviour, not a leftover.**
`build.js` reads `WEB3FORMS_KEY` from the environment, a workstation build has no
secret, so it prints DEMO MODE and emits `data-armed="0"`. Only the CI build,
which the workflow passes the secret to, is armed. A local build reporting DEMO
MODE after this date is the gate working and must not be read as a regression.
The check that means something is the deploy log line `form: ARMED, posts to
Web3Forms.`

**W10-02 is unblocked and done by the same evidence.**

*Original entry follows, unedited.*

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

---

## Q-W12-01 · The RO homepage is 139px over budget, and the end tile is why — **ANSWERED 2026-09-06 by R-J and W12-05** (opened 2026-09-03, W12-01/W12-03)

**Answered with a combination of options 1 and 2, not either alone.** The owner
took the full-width tile (option 2), which cut the tile from 193px to 101px, and
raised the budgets (option 1) to RO 8,850 and RU 9,100 under ruling R-J. Measured
result: RO 8,818 and RU 9,032, both inside. Option 3, dropping the tile, was not
taken.

*Original entry follows, unedited.*

**Shipped default: the tile as the card specified it, both locales over budget,
wave held. Nothing was trimmed to hide it.**

R-I raised the homepage budgets by 44px for the promo bar. The bar costs exactly
44px and stays inside. The **portfolio end tile costs a further 193px**, which
R-I did not fund, and that is the entire overage:

| | RO | RU |
|---|---|---|
| Baseline (`main`) | 8,646 | 8,860 |
| Promo bar only | 8,690 ✓ | 8,904 ✓ |
| **Both, as shipped** | **8,883** | **9,096** |
| Budget (R-I) | 8,744 | 9,044 |
| Over by | **139px** | **52px** |

The 193px is structural, not styling slack: a seventh item in a three-column
grid opens a third row that only the tile occupies. Shrinking the tile's padding
buys tens of pixels, not hundreds.

**Three ways out. A recommendation, not a menu:**

1. **Raise the RO budget to 8,900 and the RU budget to 9,100** and keep the tile
   as specified. *Recommended.* The tile is content the owner asked for, and
   R-I's own principle is that approved content is not tightened to fund
   something added later — which cuts both ways: the tile should not be starved
   to fit a budget that was set before it existed. This is the smallest change
   and it keeps the card as written.
2. **Take the full-width variant**, a single-line closing strip spanning all
   three columns. Measured on this build at **RO 8,791 / RU 9,005**: it saves
   92px, brings RU inside its budget, and still leaves RO 47px over, so it does
   not remove the decision, only shrinks it. It also arguably looks better — a
   lone third-width tile on a row of its own reads as a missing seventh card.
3. **Drop the tile and ship W12-02 alone.** Both locales then sit comfortably
   inside the amended budgets at 8,690 and 8,904. Cheapest, and loses the card.

There is no fourth option that keeps a card-shaped tile and the 8,744 budget.

**Related and worth knowing regardless of the answer:** the recorded 8,504 /
8,774 baseline in the docs was wrong by 142 / 86px. Real headroom on `main`
before this wave was 54px RO, not 196px. See W12-03 in DECISIONS.md.

---

## Q-W12-02 · The promo bar expires at build time, not in the browser — **ACCEPTED AS BUILT 2026-09-07, no scheduler** (opened 2026-09-03, W12-02; closed W12-34)

**Shipped default: build-time expiry, `endDate` 2027-01-01.**

The bar is emitted only while `promo.endDate` is in the future **when the site is
built**. GitHub Pages rebuilds on a push to `main`, so if nobody pushes after the
date the bar keeps claiming a discount that has ended.

Two things the owner may want to decide:

1. **Is 2027-01-01 the right date?** "doar până în 2027" reads most naturally as
   *until 2027 arrives*, so the offer ends as 2026 does, and that is what
   shipped. If it actually means *through the whole of 2027*, the date should be
   2028-01-01. One-character fix in both locale files.
2. **Should expiry be enforced without a push?** Options, cheapest first: do
   nothing and remember to change the data; add a scheduled workflow run so the
   site rebuilds itself periodically; or expire it client-side, which is
   refused by default because it puts JavaScript in charge of an above-the-fold
   box and risks the zero-CLS property the card demanded.

Recommendation: leave it build-time and add a monthly `schedule:` trigger to
`pages.yml` when the wave merges. It costs three lines and no risk.

---

## Q-W12-03 · Should the promo bar appear on the service pages too? — **ANSWERED 2026-09-06, YES** (opened 2026-09-03, W12-02)

Answered by W12-06: extended to all 24 public pages. Tallest service page after
the change is 5,729px against 6,000. `/review/` is excluded and why is recorded
in DECISIONS.md.

*Original entry follows, unedited.*

**Shipped default: homepage only.**

The card said "beneath the header, above the hero" and the wave's acceptance
measures the homepage only, so the bar went into `src/template.html` and not
`src/service.html`. But the offer is site-wide ("la orice serviciu"), and a
visitor who lands on `/servicii/acoperisuri/` from search — which is what the
whole of W9-06 and W9-08 was for — never sees it.

Extending it is one `{{promoBar}}` placeholder in `src/service.html`; the
renderer, the styles and the locale data are already shared. The cost is 44px on
each of the eighteen service pages against a 6,000px budget whose worst page is
currently 5,685px, so there is room. It was not done unasked because this wave's
rulings amended the homepage budgets only.

Recommendation: extend it. The bar is worth least on the page a visitor is
least likely to land on.

---

## Q-W12-04 · R-J's stated budgets do not match R-J's own derivation — **ANSWERED 2026-09-06, the derivation governs** (W12-10)

**Budgets are RO under 8,851 and RU under 9,065.** The owner confirmed 8,850 and
9,100 were an arithmetic error and that 9,100 violated the ruling's own
prohibition on round numbers. R-J amended in place. Nothing rebuilt or trimmed:
the measured heights passed under both readings.

The corrected budgets are exact. Live, with W12-09 held, the homepage measures RO
8,791 and RU 9,005 — baseline + 44 + 101 — leaving each locale 60px inside, which
is the headroom term and nothing else. The old 9,100 gave RU 95px while claiming 60.

*Original entry follows, unedited.*

**Shipped default: the stated budgets govern. Nothing was spent on the gap.**

R-J states the budgets and also states how they are derived, and the two do not
agree:

| | Baseline | +bar | +tile | +headroom | Derived | Stated | Difference |
|---|---|---|---|---|---|---|---|
| RO | 8,646 | +44 | +101 | +60 | **8,851** | **8,850** | −1 |
| RU | 8,860 | +44 | +101 | +60 | **9,065** | **9,100** | +35 |

The same ruling says budgets "derive from measured element costs plus stated
headroom" and are "never rounded to a convenient number". RO misses by 1px,
which reads as arithmetic. RU misses by 35px, and 9,100 is precisely a
convenient round number.

**Nothing is blocked.** Measured heights are RO 8,818 and RU 9,032, inside both
the derived and the stated figure in both locales, so the wave passes either
way. This is a question about which number the next card budgets against.

**Recommendation: correct RU to 9,065 and RO to 8,851, and let the derivation
be the budget.** It is what the ruling's own principle asks for, it costs
nothing today, and it stops 35px of unexplained slack being treated as spendable
headroom by a later card that has not measured anything. If instead the 60px
headroom term was meant to be larger for RU, say so and the derivation changes
rather than the budget floating free of it.

---

## Q-W12-05 · Locality spelling — **CLOSED 2026-09-07, settled by R-M** (opened 2026-09-06, W12-09; verified W12-11; closed W12-34)

**Verified against the official CUATM (Biroul Național de Statistică). 15 of the
40 forms were wrong. The full paired list is in DECISIONS.md under W12-11.**

**Romanian: closed.** One correction, `Sângera` → `Sîngera`. The classifier uses
`î` in both Sîngera and Hîncești, so the convention was uniform and following the
client's unaccented letters was the wrong method. The other 18 confirmed.

**Russian: 14 corrected, but the REGISTER is a decision you have to make.**

Moldovan official Russian transliterates rather than using Soviet exonyms, and
the classifier is unambiguous about the forms. But official sources disagree on
register, and `statistica.gov.md/ru` uses both on one page:

| Source | Capital |
|---|---|
| CUATM classifier | **Кишинэу** |
| Moldpres, state news agency | **Кишинёва** |
| Presidency | **Кишиневе** |
| statistica.gov.md/ru front page | **Кишинэу** ×2 and **Кишинев** ×1 |

The held branch now carries the classifier register in the coverage list while
**nine other RU strings carry the exonym**: `meta.title`, `meta.description`,
`meta.ogTitle`, `footer.description`, `footer.region`, `form.phCity` and two
review fields. One page cannot say both.

**Recommendation: the exonym register, and convert the list back.** Not because
the classifier is wrong — it is the more official of the two — but because this
is a marketing site whose Russian-speaking customer types "Кишинёв" into Google,
the state press writes it that way in prose, and the title, description and
footer already do. Changing nine strings to `Кишинэу` to match twenty would trade
the site's search term for a classifier convention.

If you take that, I need one more thing before shipping: the exonyms for the
other 19 are **not** verified by any official source I could find, so I would be
back to supplying them. `Бельцы`, `Кагул`, `Дубоссары`, `Оргеев` are standard
Russian, but standard is not verified, and W12-11 says do not ship an unverified
form. Tell me the register and I will either keep the classifier list as it
stands, or go and verify the exonym set properly against Moldovan Russian-language
press before shipping it.

**Two of the exonyms already on the site are wrong even as exonyms:** `Кэйнары`
and `Костешты` have been in `locales/ru.json` since wave 1 and match neither
register cleanly. They need fixing whichever way you rule.

*Original entry follows, unedited.*

**Shipped default: the list as written below. It is on a held branch, so nothing
is public.**

The client supplied 20 localities **without diacritics**, and only in Romanian.
Two kinds of guess went into making that a bilingual list, and both should be
checked by someone who knows the places.

**1. Romanian diacritics restored from an unaccented source.** Mostly
unambiguous, two are not. The client's own letter choices were followed:

| Supplied | Written as | Note |
|---|---|---|
| `Sangera` | **Sângera** | client wrote `a`, so `â`. Moldova's official register uses **Sîngera** |
| `Hincesti` | **Hîncești** | client wrote `i`, so `î`. Romanian standard would be **Hâncești** |

The two are inconsistent with each other — one `â`, one `î` — because the
client's spellings were inconsistent and following the source seemed better than
imposing a rule the client did not use. Say which convention you want and both
become consistent.

**2. The Russian names are mine, not the client's.** Six already existed on the
site and are unchanged (Кишинёв, Кодру, Кошница, Костешты, Кэйнары, Сочитень).
The other fourteen I supplied as the standard Russian toponyms:

Дурлешты, Сынжера, Яловены, Страшены, Анений Ной, Криулень, Дубоссары, Орхей,
**Кэлэраши**, Хынчешты, Кагул, **Унгены**, Бельцы, Вадул-луй-Водэ.

Two worth a second look: **Кэлэраши** (also written Кэлэрашь) and **Унгены**
(also Унгень). Both forms are in use.

These names are visible copy in the RU locale and they are `areaServed` values
in the structured data, so a wrong one is wrong in two places at once.

---

## Q-W12-06 · The Google profile URL could also arm the reviews link — **ANSWERED 2026-09-06, armed** (opened 2026-09-06, W12-08; answered W12-12)

**Shipped default: not armed. W12-08 added the URL to `sameAs` only.**

`GOOGLE_REVIEWS_URL` is still unset, so the "reviews on Google" link and mark in
the reviews section render as nothing at all — the anchor is not emitted, which
is the W3-02 crawlable-anchor fix working. The canonical profile URL resolved in
W12-08 is exactly what that variable wants:

    GOOGLE_REVIEWS_URL=https://maps.google.com/?cid=1981309119616115698

Setting it in the workflow reveals an outbound link to the profile. That is
visible page content pointing at Google, not review markup, so **R-K permits it**
— it adds no `aggregateRating` and no `Review`.

Recommendation: set it. It was left unset because W12-08 authorised a `sameAs`
entry and nothing else, and arming a visible link is a separate change to what
a visitor sees.

---

## Q-W12-07 · The 4.9/250+ claim — **RESOLVED 2026-09-06, claim removed** (W12-13)

**Removed from the homepage in both locales, and the investigation found nothing
that would support restoring it.**

Searched Google Maps three ways for a second listing:

| Search | Result |
|---|---|
| Phone `+373 76 837 180` | resolves directly to ONE place, no results list |
| `Rapid Construct`, zoomed out over the whole region | the same single place |
| `Nicolae Zelinski 24` address | a results list: one Rapid Construct, plus a post office, an apartment building and a software company |

**Exactly one profile exists:** CID `1981309119616115698` (`0x1b7f062598f5e3f2`),
KG mid `/g/11xrn6_nk5`, **5.0 from 7 reviews**, Nicolae Zelinski St 24,
`rapidconstruct.md`, +373 768 37 180.

**The other site is the same entity, not a second listing.** `rapidconstruct.md`
embeds a Maps URL whose place segment carries `0x1b7f062598f5e3f2` — the identical
CID. The other id in that URL, `/g/11c4mnb1fc`, is the geocoded street address,
not a business.

So no listing anywhere supports 4.9, and none supports 250+. Per the card,
nothing is restored.

**Still worth asking the client what the 250+ counted.** If it was jobs, or
reviews across Facebook and Instagram, that is a real number that could be stated
honestly as what it is. If nobody can say, it should stay off the site.

*Original entry follows, unedited.*

**Shipped default: the link is armed, as instructed. The rating copy is
untouched, because it is not this card's to change.**

W12-12 armed a visible link to the Google Business Profile. The profile,
verified in a browser during W12-08, shows **5.0 from 7 Google reviews**. The
site says, in three places:

| Where | Claim |
|---|---|
| `stats.3` (hero and dark band) | **4.9/5**, `din 250+ recenzii` |
| `reviews.score` / `reviews.count` | **4.9**, `250+ recenzii` |
| the link now beside them | "Vezi recenziile pe Google" → 7 reviews |

Both numbers can be true — 250+ reviews across every channel, 7 of them on
Google — but the link now invites the comparison, and a visitor who clicks
lands on a page that appears to contradict the figure they just read.

This is not a W12-12 defect. The 4.9/250+ copy predates every wave here and came
from the predecessor build under master plan section 6. R-K is satisfied: none
of it is marked up, `aggregateRating` and `Review` are still zero everywhere.

**Three options.**

1. **Leave it.** Cheapest, and the numbers are not actually inconsistent.
2. **Qualify the count** so the two obviously measure different things, e.g.
   `250+ recenzii` → a phrase meaning "across all channels". Needs the client to
   say what the 250+ actually counts, which nobody in this repo knows.
3. **Unarm the link** until the profile has more reviews.

Recommendation: **1, and ask the client what 250+ counts.** The claim is theirs
and predates us; the honest fix is knowing its source, not quietly softening it.
If the client cannot say where 250+ comes from, that is a section 5 problem
about the existing copy and much bigger than this link.

---

## Q-W12-07-LEGAL · The privacy pages are unlinked until the registry extract arrives — ~~OPEN~~ **CLOSED 2026-09-17 (W20-01, RC-144), settled by W12-26 (RC-072, commit `8c3b9ce`): the fallback page was published and linked on an explicit switch, `PRIVACY_PUBLISHABLE_WITHOUT_OPERATOR` in `build.js`, without waiting for the extract. The operator section itself is still absent (`docs/audits/wave-19-readiness.md` section 3); the addendum below is how to add it when the extract arrives** · opened 2026-09-06 (W12-17, W12-21)

**UPDATED 2026-09-06 by W12-21.** A fallback policy page is drafted on
`w12/rc-072-privacy-fallback`, unmerged and awaiting review. It names no legal
entity and carries no placeholder text.

**The reversal step changed shape, and this is the important part.** The gate was
`privacyIncomplete`, computed by scanning `privacy.*` for `TODO:`. The fallback
page OMITS the operator fields rather than marking them, so that scan found
nothing and reported the page complete — which silently restored all three link
sites, `index, follow` and the sitemap entry. Caught before merge.

The gate now treats **absence and TODO alike**: a page that never names an
operator is exactly as unlinkable as one that says TODO.

**Reversal, unchanged in substance:** add `privacy.opName` and `privacy.opIdno`
with real values to both locale files, and restore the operator section to
`src/privacy.html`. The links, the footer entry, `index, follow` and the sitemap
entries all return together.

*Original entry follows, unedited.*

**State: the pages are published, `noindex`, out of the sitemap, and NOTHING on
the site links to them.** They are reachable only by typing the URL.

**Why.** The client launches tomorrow and both privacy pages still render their
placeholders as bold body text a reader hits directly:

| Locale | What a visitor read |
|---|---|
| RO | *Câmpurile marcate TODO se completează înainte de publicarea site-ului.* |
| RO | Denumire juridică — **TODO: denumirea juridică completă, de completat înainte de publicare** |
| RO | IDNO — **TODO: numărul IDNO, de completat înainte de publicare** |
| RU | *Поля, помеченные TODO, будут заполнены до публикации сайта.* |
| RU | Юридическое наименование — **TODO: полное юридическое наименование, заполнить до публикации** |
| RU | IDNO — **TODO: номер IDNO, заполнить до публикации** |

A policy page that announces its own operator is undeclared is worse than no
linked policy: it tells a visitor, in bold, that the company behind the form has
not been identified.

### THE REVERSAL, and it is one change

**Fill `privacy.opName` and `privacy.opIdno` in both locale files. That is all.**

Do not edit a template, a stylesheet or `build.js`. The links are gated on
`privacyIncomplete`, the same flag that has always driven the `noindex` and the
sitemap exclusion, so filling the four strings restores, together and
automatically:

1. the footer legal entry on all 24 pages,
2. the consent-checkbox link in both forms,
3. the popup fine-print link,
4. `index, follow` on both privacy pages,
5. both pages back into `sitemap.xml`.

**Verified, not assumed.** The two strings were filled with placeholders, the
site rebuilt, and all five came back: 3 links on the homepage, 2 on a service
page, footer entry present, `index, follow`, 1 sitemap entry. Then reverted.

### What is still blocked

W12-07. The client answered "Rapid Construct", which is a brand and not a
registered entity with a legal form and an IDNO. **The bank payment advice is
not evidence** — `Beneficiar` on a payment advice identifies who received a
payment. The registry extract is expected. Nothing is written until then, and
the company name and the two 13-digit codes remain absent from the repo.

---

## Q-W12-08 · The restore exceeds the height budget — **RESOLVED 2026-09-06 by R-O** (W12-18, W12-19, W12-20)

**Resolved by a fourth option none of the three listed below anticipated: remove
the visible anchor entirely rather than move it, raise the budget or trim.**

R-O rules the profile connection is `sameAs` only. The anchor carried no search
value; `sameAs` carries the entity connection and stays. With the anchor gone the
restore measures **RO 8,818 and RU 9,032, inside R-J by 33px each**, three
identical runs, live-calibrated.

Nothing was trimmed, the link was not moved back into the panel, and no budget
was raised. The restored panel is exactly as W12-18 committed it.

*Original entry follows, unedited.*

**STOPPED, not shipped. Nothing trimmed, no budget raised.** W12-19 says to stop
and report if RO exceeds 8,851, and it does, by 67px. RU exceeds too, by 66px.

Measured three times, identical every run:

| | Measured | Budget | Result |
|---|---|---|---|
| RO | **8,918** | 8,851 | **67px OVER** |
| RU | **9,131** | 9,065 | **66px OVER** |

**These are live figures.** Local and live were calibrated on the same commit
first and came out identical to the pixel — `main` measures RO 8,843 / RU 9,002
both locally and on rapidconstructmd.com — so the local reading of the restore
is the live reading. The restore has NOT been deployed, because deploying is what
would make it shipped and the card says stop before that.

### The cause is one instruction, not the claim

W12-18 says restore the panel; it also says the Google link stays below the
cards and must not move back beside the panel. **Those two together are the
overage.** Before W12-13 the link lived inside the panel and cost nothing extra;
now the page carries the panel *and* a separate link row that did not exist
before the wave.

Measured both ways on the same build:

| Layout | RO | RU |
|---|---|---|
| Link below the cards, **as instructed** | 8,918 ✗ | 9,131 ✗ |
| Link inside the panel, **informational only** | **8,826 ✓** | **9,032 ✓** |
| `main` today, claim removed | 8,843 | 9,002 |

Putting the link back in the panel fits both locales with 25px and 33px to
spare. **I did not do it, because the card forbids it.**

### The three ways out, none of which are mine to take

1. **Let the link go back inside the panel.** Fits immediately, no other change,
   and it is where it lived until this wave. Costs the deliberate separation
   W12-13 introduced.
2. **Raise the budgets** to about RO 8,930 and RU 9,150. R-J's own principle
   says a budget is derived from measured element costs plus stated headroom, so
   this would be a derivation with a new term rather than a round number.
3. **Trim something else** on the homepage to pay for the link row.

Recommendation: **1.** It is reversible, it needs no ruling, and the link's
position below the cards was a side effect of removing the panel rather than a
decision about where the link belongs. Option 2 is defensible but spends a
budget on layout rather than content, one day before launch.

**Until this is answered, the branch `w12/rc-070-restore-review-claim` holds the
restore, committed and unmerged.** The homepage on production still has no review
claim.

---

## Q-W12-07-LEGAL, addendum · Exactly what to add when the extract arrives — 2026-09-06 (W12-21)

The page is structured so the operator identity is an **addition**, not a
rewrite. Two files, and nothing else moves.

**1. `locales/ro.json` and `locales/ru.json`, key `privacy`.** Add four keys.
Order inside the block does not matter; `build.js` reads them by name.

    "opH":          RO "Cine este operatorul de date"   RU "Кто является оператором данных"
    "opP":          RO "Datele trimise prin acest site sunt prelucrate de:"
                    RU "Данные, отправленные через этот сайт, обрабатывает:"
    "opNameLabel":  RO "Denumire juridică"              RU "Юридическое наименование"
    "opName":       the registered name from the extract
    "opIdnoLabel":  RO "IDNO"                           RU "IDNO"
    "opIdno":       the IDNO from the extract

**2. `src/privacy.html`.** Insert one block immediately before the
`{{privacy.colH}}` heading:

    <h2>{{privacy.opH}}</h2>
    <p>{{privacy.opP}}</p>
    <dl class="prose__dl">
      <div><dt>{{privacy.opNameLabel}}</dt><dd>{{privacy.opName}}</dd></div>
      <div><dt>{{privacy.opIdnoLabel}}</dt><dd>{{privacy.opIdno}}</dd></div>
    </dl>

**Nothing else changes, and that is deliberate.** The section ordinals used to be
typed into the heading strings, so inserting a section at the top renumbered all
five headings — a rewrite of ten strings across two locale files. They are now a
CSS counter (`.prose h2::before` in `src/styles.css`), so the new section becomes
1 and the rest renumber themselves.

Adding `opName` and `opIdno` with real values also releases the W12-17 link
suppression automatically: the links, footer entry, `index, follow` and both
sitemap entries return with no further edit.
## Q-W12-09 · Markers prove properties, a fingerprint would prove identity — **ANSWERED 2026-09-06, the fingerprint shipped** (opened 2026-09-06, W12-22; answered W12-23)

**Shipped default: content markers, as R-P specifies. No fingerprint.**

`scripts/verify-live.js` asserts six markers on the homepage. That catches the
stale copy which bought R-P, and it was negative-tested doing exactly that. But
it proves the deployed build *has certain properties*, not that it *is the commit
just pushed*. Two builds that share all six markers are indistinguishable to it —
a docs-only change, a copy tweak, a colour fix, would all pass while stale.

**The stronger form is one line of build output.** Emit the commit SHA into every
page as a meta tag, have the verifier read the expected SHA from `git rev-parse
HEAD` and assert equality. That converts a property check into an identity check
and closes the gap completely.

Cost: a `<meta name="build" content="…">` on 25 pages, zero height, zero CLS, and
a `GITHUB_SHA` already available in the workflow environment.

Recommendation: **do it.** The only reason it is not in this card is that R-P
specified markers and adding a fingerprint changes what every page emits, which
is a decision about the artifact rather than about the verifier. One line of
instruction and it ships.

---

## Q-W12-10 · Three governing docs restate values that rulings have superseded — **ANSWERED 2026-09-07, all three amended in place** (opened 2026-09-06, W12-24; answered W12-27 under R-R)

**Reported, not changed.** W12-24 limited the fix to CLAUDE.md. These are the
others, worst first.

**1. The master plan gives the wrong brand colours.** `docs/RC-WEBSITE-MASTER-PLAN.md`
lines 76 and 78 still say `--brand: #F26419` and `--ink: #1C1C1C`. The real values
are `#F65308` and `#1A1A1A`.

This is the one to fix first, and not because of the colours. CLAUDE.md tells a
card that the master plan **"wins by default"** and to ask before deviating. A
card that followed that instruction literally would paint the site wrong and
believe it was being obedient. The correction exists in DECISIONS and in CLAUDE.md
section 3, so nothing is unrecorded — but the plan contradicts both.

**2. The photo manifest states a minimum three rulings have overridden.**
`docs/RC-PHOTO-MANIFEST.md` line 20: "Every file: minimum 1600px long edge."
Overridden to 1200px for service cards (W7-02), 900px for the five step slots,
and 720px for the hero panel (W8-03). The manifest notes two of them lower down;
the headline still reads as universal.

**3. The backlog quotes superseded budgets.** `docs/BACKLOG.md` lines 196-197 use
8,744 and 9,044, which are R-I's figures, superseded by R-J's 8,851 and 9,065.
Defensible as a dated status record, but nothing marks it as historical.

**Recommendation: option (b), the cheap one.** The master plan already
demonstrates it at line 121, where the header height carries an inline amendment
naming the wave that changed it:

  (a) Replace each value with a pointer to the ruling. Strictly R-Q, but the
      master plan is a design spec and stripping its numbers would gut it.
  (b) **Leave the value and add an inline amendment naming the ruling that
      supersedes it.** Keeps the spec readable, makes staleness visible on
      reading, and matches what line 121 already does.
  (c) Nothing, and rely on CLAUDE.md section 3 winning. Rejected: it requires
      every future card to know the plan is wrong before reading it.

For the backlog, one word — "then-current" — is enough.

---

## Q-W12-11 · The master plan's height heuristic is now false by design — **ANSWERED 2026-09-07, all three amended in place** (opened 2026-09-07, W12-27; answered W12-28)

**Reported, not amended.** W12-27 limited amendment to values already reported.
These three surfaced during its sweep, all in `docs/RC-WEBSITE-MASTER-PLAN.md`.

| Line | Text | Superseded by |
|---|---|---|
| **121** | "Target total page height 7,000 to 8,000px desktop. **If the build exceeds 9,000px, something has been over-built.**" | R-I, then R-J |
| 245 | "Page under 9,000px desktop" | R-I, then R-J |
| 200 | "Minimum 1600px on the long edge" | W7-02, the step-slot ruling, W8-03 |

**Line 121 is the one that matters, and not because of the number.** It states a
*heuristic*: exceeding 9,000px means something has been over-built. That is now
false by design — the Russian homepage measures 9,032px and every pixel of it was
ruled in, most recently the twenty-locality coverage list. A card applying the
heuristic would go looking for something to cut that a ruling had already
approved.

Recommended amendment, same inline pattern:

    **AMENDED: superseded by R-J. The live budgets are RO under 8,851px and RU
    under 9,065px, derived from measured element costs plus headroom. RU exceeds
    9,000px by design. Do not treat 9,000px as an over-build signal.**

Lines 245 and 200 are ordinary stale values and take the same treatment as the
three amended in W12-27.

One word of scope: this is the fourth document-staleness finding in two cards.
The pattern is not that these documents are badly written — it is that a value
copied into a governing document has **no mechanism** that notices when the
ruling behind it changes. R-Q stops new copies being made and R-R makes existing
ones visible; neither detects the next one. A grep for known-superseded values,
run as a gate the way `check-links.js` is, would.

---

## Q-W12-12 · The staleness gate reads documents, and two stale values are in a stylesheet — **ANSWERED 2026-09-07, option (a) and (b) both taken** (opened 2026-09-07, W12-29; answered W12-31)

**Shipped default: documents only. The two source-file occurrences are reported
here, not fixed, and not silently ignored.**

`scripts/check-stale-docs.js` scans the seven governing and reference documents.
It does not scan source files. Two comments in `src/styles.css` quote a value R-J
superseded:

    src/styles.css:727   "…of headroom against the 8,700px cap, and a logo needs
                          width, not height."
    src/styles.css:772   "…against the 8,700px cap."

Both are the same class of defect as the ones amended in W12-27 and W12-28: a
card reading either comment would budget against a cap R-J replaced, and against
a flat figure where the live budgets are per locale and derived.

**Why they were not fixed in W12-29.** The card scoped the gate to documents. A
stylesheet comment is deployed content: `src/styles.css` is copied into `dist/`,
so editing a comment changes the bytes GitHub Pages serves and turns the last
docs card of a wave into a production redeploy. That is a poor trade on the last
card of a wave for zero visitor-visible benefit, so it is logged rather than
taken.

**Why the scan was not simply widened to `src/` and `scripts/`.** It was tried.
The seeded `1600px` pattern hits `scripts/slots.js`, where `MIN_LONG_EDGE = 1600`
is the *implementation* of the rule and correct, and `scripts/verify-live.js`
line 139, where `1600` is a millisecond delay. A gate that flags its own correct
implementation and a coincidental timeout trains people to ignore it. Widening
the scan needs per-file patterns, which is a card, not a constant.

  (a) **Fix the two comments in a source card**, where a redeploy is expected
      anyway, and leave the scan on documents. **Recommended.** It is two
      comments; the honest form names R-J and states no figure.
  (b) Widen the scan to `src/` and `scripts/` with per-file value patterns.
      More thorough, and the false-positive work above is the cost.
  (c) Nothing. Rejected: the comments are wrong now, and one of them carries the
      54px headroom figure R-J corrected.

---

## Q-W12-13 · Does an appended amendment block count as editing a body? — **ANSWERED 2026-09-07 by R-T, option (a): it is an append** (opened 2026-09-07, W12-32; answered W12-33)

**Shipped default: no more of them.** A future amendment to a ruling becomes its
own dated entry naming the ruling it amends. The two that already exist stay.

R-S says nothing inside a recorded body is ever edited. Two rulings in
`DECISIONS.md` carry amendment blocks appended **inside** them:

    RULING R-J → "### Amended 2026-09-06 by W12-10, answering Q-W12-04"
    RULING R-Q → "### Amended 2026-09-07 by W12-29 · the list is part of
                  recording a ruling"

Both are dated, attributed, and change no existing sentence. Both are also inside
a body. Whether that is an append or an edit is genuinely unsettled by R-S as
worded, and it matters because the next ruling amendment has to go somewhere.

**Neither is removed, and that is not a preference.** Removing them would itself
be an edit to a body, which R-S forbids more clearly than it forbids their
existence. Both are load-bearing: without W12-10's block, R-J states the
arithmetic error rather than the derived budgets; without W12-29's, the staleness
list is not part of recording a ruling and the gate rots.

  (a) **An appended, dated block inside an entry is an append, not an edit.**
      Permitted, and the two existing ones are the pattern. Cheapest, and it
      keeps an amendment beside the thing it amends, which is R-R's own argument
      for amending the master plan in place.
  (b) **It is an edit.** A future amendment is its own entry, cross-referenced
      both ways. Strictest reading of R-S, and it costs a reader one jump to
      find out that a ruling was later changed — which is the failure mode R-Q
      exists to prevent, so it is not free.
  (c) Permit it only for rulings, not for cards. Rejected as a distinction with
      no principle behind it.

**Recommendation: (a).** R-R already ruled that an amendment belongs at the point
of the value it amends, and a ruling is a value. But (b) shipped as the default
because R-S is the newer instruction and reading it strictly costs nothing until
the next amendment is actually needed.

---

## Q-W13-01 · Three logo assets still need a client-supplied source — OPEN, opened 2026-09-08 (W13-02)

**Shipped default: they stay exactly as they are.** The visible mark is orange as
of W13-02. Three assets are not, and cannot be made so from anything in the repo.

| Asset | Why it cannot be recoloured here |
|---|---|
| `public/logo-full.png` | 1542×568, **12,194 distinct RGB values**. The full-colour wordmark: black "Rapid" over orange "CONSTRUCT" and roof line. Only used as the JSON-LD `"logo"` on `/` and `/ru/`; never rendered visibly |
| `public/favicon-180.png` | 180×180, **875 distinct RGB values**. `apple-touch-icon`, all 25 pages |
| `public/favicon-512.png` | 512×512, **4,551 distinct RGB values**. `rel="icon"` and the webmanifest, all 25 pages |

`logo-mono.png` could be recoloured because it was a single-colour alpha mask.
These three are anti-aliased multi-colour rasters, and there is no exact
operation that turns one into a different brand colour. Filtering or tinting them
is refused, per the W13-01 instruction and on the merits: it would produce a
colour that is not `#F65308` and would be a new value against the ten.

**Exactly what to ask the client for.**

  (a) **An SVG of the mark. Strongly preferred.** It makes this recolour and
      every future one a data edit, and it removes the whole class of problem:
      the repo has now hit it twice in two waves. One file replaces all four
      raster assets, since the favicons and the full-colour logo can all be
      generated from it.
  (b) **Failing that, four PNGs**, at the dimensions already in use so nothing
      in the templates or `slots.js` has to move:
      - `1542x568` full-colour wordmark
      - `1542x568` single-colour, on transparency — this one is a drop-in
        replacement for `logo-mono.png`
      - `180x180` favicon
      - `512x512` favicon

**Worth telling the client explicitly:** the wordmark is currently two-tone,
black "Rapid" above orange "CONSTRUCT". "The logo in orange" does not say whether
"Rapid" becomes orange too. The single-colour mask now on the site makes the
whole wordmark orange, which is one answer; the full-colour file still says the
other. They should confirm which they meant before producing files.

**What is inconsistent in the meantime, stated plainly:** the visible mark is
orange, the favicon in the browser tab is the older orange-red mark, and the
structured-data logo is still black-and-orange. No visitor sees the last of
those. The favicon is visible and does not match, and that is the cost of
shipping the half that could be done exactly.

## Q-W14-01 · No licence was ever recorded for most shipped images · OPEN, opened 2026-09-15 (W14-02)

**Shipped default: every such row says `unrecorded before R-W`.** The R-W gate
accepts that value only on rows dated before 2026-09-15, so the gap cannot grow.
Nothing was removed from the site.

Compiled from `docs/assets/PROVENANCE.md`:

| Group | Files | What is missing |
|---|---|---|
| Client project photographs, `public/img/proj-*`, `public/review/` | 81 | a written statement that the client owns them and consents to publication |
| Nine service card images, `public/img/svc-*.jpg` | 18 | who made them, and on what terms. Recorded only as "approved artwork" (W7-02) |
| Ten SVG illustrations | 10 | who made them. Recorded only as "delivered" (W1-00) |
| Five step photos, `public/img/step-*` | 10 | origin. They were found in `dist/img/Cum Lucram/` (W10-01) |
| Interim hero panel, `public/img/hero-panel*.jpg` | 2 | origin (W8-03) |
| Six supplier logos from brand websites | 6 | terms of use |
| Client logo and favicons | 4 | a written licence |

**Recommended:** one message to the client asking them to confirm, in writing,
that the photographs, the service artwork and the logo are theirs to publish.
The step photos and the hero panel need their origin named first. Supplier logos
used only to name a supplier are the lowest risk and can wait.

## Q-W14-02 · RC-103 strings T-02 to T-09 are not in the dispatch · ANSWERED 2026-09-15, strings supplied in the close-out dispatch · opened 2026-09-15 (W14-03)

**No default ships, and none can.** RC-103 says: "Apply T-02 through T-09
exactly as given in `docs/audits/wave-14-copy-delta.md`, which you author first
from the strings in this dispatch." The dispatch contains no T-numbered strings.
"Exactly as given" rules out writing them, and `docs/CLAUDE.md` section 5 rules
out inventing copy in any case.

**Blocks three cards:** RC-103, RC-104 (the RU parity of RC-103), and RC-113
(which measures only after RC-103 to RC-111 are merged).

**What unblocks it:** the eight RO strings, T-02 to T-09, each with the element
it replaces (a locale key such as `hero.h1`, or the visible current text). With
the target named, the delta file maps one-to-one and RC-104 can follow at once.

## Q-W14-03 · The site now serves from rapidconstruct.md, and every canonical still names rapidconstructmd.com · ANSWERED 2026-09-15, rapidconstruct.md is the real domain (RC-117) · opened 2026-09-15 (found at W14-02, gate 9)

**Shipped default: nothing changed.** Every value involved (`SITE_URL`, the
CNAME, canonical, hreflang, og:url, the sitemap, the GeneralContractor JSON-LD)
is in the R-V STOP set. This entry records what was measured.

**What was measured on 2026-09-15, after the W14-02 deploy:**

| Probe | Result |
|---|---|
| `https://rapidconstructmd.com/`, `/ru/`, `/servicii/acoperisuri/` | **HTTP 404, "Site not found · GitHub Pages"** |
| `https://www.rapidconstructmd.com/` | HTTP 404 |
| `https://rapidconstruct.md/` and `/ru/` | HTTP 200, `build-sha` f5e4eb6, the W14-02 merge |
| `https://www.rapidconstruct.md/` | 301 to `https://rapidconstruct.md/` |
| GitHub Pages settings, `cname` | **`rapidconstruct.md`**, certificate approved for `rapidconstruct.md` and `www.rapidconstruct.md`, expiring 2026-12-09 |
| `node scripts/verify-live.js https://rapidconstruct.md` | PASS, 8 of 8 VERIFIED, heights identical to the wave 12 handoff |
| The same against `https://rapidconstructmd.com` | FAIL, 8 of 8 UNVERIFIED, every page a blank 900px GitHub 404 |

**So the site is up, on a different domain from the one it declares.** GitHub
serves the repo only on the settings domain. Every page still canonicalises to
`https://rapidconstructmd.com/...`, the sitemap lists that host, and hreflang
and og:url point there, so search engines are being told the real address of
each page is one that returns 404. The artifact's `dist/CNAME` still says
`rapidconstructmd.com`; with a workflow deploy GitHub ignores it, which is why
the W14-02 and W14-01 deploys did not flip the setting back.

**This reverses W12-14 without a record.** W12-14 made `rapidconstructmd.com`
the default because the client controls it, and `build.js` line 10 says
`rapidconstruct.md` is a domain the client does NOT control. The settings change
is not in the repo. A 90-day certificate expiring 2026-12-09 was issued on or
about 2026-09-10, which matches the manual re-run of the W13-03 deploy that day.

**Options, one decision, the owner's:**

  (a) **`rapidconstruct.md` is now the real domain.** One STOP PR changes
      `SITE_URL` in `pages.yml`, `CUSTOM_DOMAIN` and the default in `build.js`,
      and the `verify-live.js` default origin, then re-verifies. `W12-14` gets a
      superseding ruling.
  (b) **`rapidconstructmd.com` stays the real domain.** Set the Pages custom
      domain back to it in Settings, wait for the certificate, re-verify. No
      code change.
  (c) Both, with one redirecting to the other. GitHub Pages serves one custom
      domain per repo, so the redirect has to live at the DNS or registrar level
      for the second domain.

**Recommended: decide (a) or (b) today.** Every day the canonical points at a
404 costs indexing. Until then, wave 14's live verifications run against
`https://rapidconstruct.md`, because that is where the deployed build is.

## Q-W14-04 · What the catalog menu lists, and where each row goes · ANSWERED 2026-09-15, the audit 1.2 taxonomy (RC-106b) · opened 2026-09-15 (W14-06)

**Shipped default: the menu is built and switched off.** `content/catalog.json`
holds `"categories": []`, and while it is empty neither the Catalog button nor
its panel exists on any page. Filling it is a data edit with no code change;
`build.js` validates the file on every build.

**Why it shipped empty.** RC-106 gives the taxonomy as audit section 1.2: 7
top-level categories, 2 with children, 7 subcategories. Those are fatade3d's
product categories (thermal insulation systems, decorative plasters, ceramic
tiles, decorative elements, paints, lighting systems, other building materials).
Two things are missing, and neither is mine to fill:

1. **The labels.** Copying fatade3d's categories would list products Rapid
   Construct is not shown selling anywhere on the site, which `docs/CLAUDE.md`
   section 5 forbids ("not a service").
2. **The target of every row.** No page on the site corresponds to any of those
   categories. A menu row that opens nothing is a dead link, and `docs/CLAUDE.md`
   section 9 requires a link to mean what it says.

**Options:**

  (a) **Rapid Construct's own catalog, pointing at pages that exist.** For
      example: Acoperișuri, with Țiglă metalică and Copertine as children, once
      RC-108, RC-110 and RC-111 put those sections on the page, each row linking
      to its section anchor; plus the service pages as the remaining rows.
  (b) **The audit 1.2 taxonomy verbatim**, which needs a destination page per
      category first. That is new pages, not a menu.
  (c) Keep the menu off.

**Recommended: (a).** It is honest about what the company sells, every row lands
somewhere real, and the file format already takes it. Send the rows as label
RO, label RU, and target, and the menu is live in one commit.

**Filling the file is not enough on its own, and this is measured.** A local
build carrying the audit's 7/2/7 shape was driven in headless Chrome. The
interaction passes: click-only open, hover flyout, orange active row, keyboard,
Escape, the mobile drill-down, and the pill fits at 390, 360 and 320px. **The
desktop header does not fit the toggle.** At 1440 the toggle and its gap cost
115px (RO) and 119px (RU), and the first nav link slides under the wordmark by
24px and 37px, which Lighthouse reports as a target-size failure (accessibility
97 against the floor of 100). Tightening the header's own gaps and nav type
fixed RO at 1280 and above but left RU overlapping at every desktop width, so
that tuning was not shipped.

**So switching the menu on needs one more decision, about the header:** what
gives up its room. Candidates, none measured yet: drop the "Acasă" nav link (the
wordmark already links home), hide the phone number text on desktop as it
already is at 1024px and below, or move the whole desktop header to the
hamburger below a wider breakpoint (see Q-W14-05). RC-106 is marked blocked on
this question and on the labels above; its PR is open and not merged.

## Q-W14-05 · The live header overlaps itself between 769 and 1100px · ANSWERED 2026-09-15, collapse at 1100px (RC-115) · opened 2026-09-15 (found at W14-06)

**Shipped default: nothing changed.** This is a defect already on `main`, found
while testing RC-106. No wave 14 card covers the header breakpoints, and where
the header switches to the hamburger is a design decision.

**Measured on the live site**, `https://rapidconstruct.md`, build-sha 2ebedfb,
cache-busted, every visible link and button in the header pill checked pairwise
for intersecting boxes:

| Width | RO | RU |
|---|---|---|
| 1440, 1180, 1024 | clean | clean |
| 1100 | wordmark covers "Acasă" by 17px; "Contacte" runs 17px into the phone link | 28px and 28px |
| 1025 | 52px and 54px | 66px and 66px |
| 900 | 14px and 14px | 25px and 18px |
| 800 | 49px; "Contacte" also 34px into "Solicită ofertă" | 66px; 45px into "Получить смету" |
| 769 | 49px, plus "Servicii" 10px under the wordmark; "Contacte" 49px into the CTA | 66px; "Услуги" 5px; 61px into the CTA |

**Why nothing caught it.** The nav is `flex: 1 1 auto; min-width: 0`, so it
shrinks and its links slide under their neighbours while the pill's
`scrollWidth` never grows: an overflow check reads clean. Lighthouse runs at
1440 on the desktop preset, which is clean. The overlap shows only between the
768px mobile switch and the widths the desktop layout was designed for.

**What a visitor sees at, say, a 1024 to 1100px laptop or a landscape tablet:**
nav labels printed on top of the logo and the phone number, and a tap on one
target can land on the other.

**Options:**

  (a) **Switch to the hamburger header at 1100px instead of 768px.** One
      breakpoint change; the mobile header is already built and tested.
  (b) Keep the desktop header down to 769px and make room: hide the phone
      number text (already done at 1024 and below), shorten the gaps, and drop
      the nav font a step, re-measured at every width in the table.
  (c) Leave it.

**Recommended: (a).** It removes the whole band of widths rather than tuning
pixels inside it, and it does not change the desktop header anyone has approved.

## Q-W14-06 · The social row links to the three profiles the site already names; confirm them · OPEN, opened 2026-09-15 (W14-07)

**Shipped default: the three URLs the site has linked since wave 1**, not
placeholders.

RC-107 says "URLs blocked pending Ivan. Ship with the row present and hrefs set
to a placeholder constant in one file." The row reads its hrefs from one file,
`content/social.json`, as asked. The values in it are not placeholders, and that
is a deviation, for two reasons:

1. **A placeholder is a dead link on the live page.** `href="#"` goes nowhere
   and fails `docs/CLAUDE.md` section 9, and `build.js` already records that an
   anchor without a real href fails Lighthouse's crawlable-anchors audit. The row
   sits in the hero, above the fold, on both homepages.
2. **The URLs were not unknown.** The footer has linked these three since the
   first build, and the homepage JSON-LD `sameAs` carries the same three:

| Platform | URL |
|---|---|
| Facebook | `https://www.facebook.com/rapidconstructofficial` |
| Instagram | `https://www.instagram.com/rapid.construct/` |
| TikTok | `https://www.tiktok.com/@rapid.construct` |

**What to send:** "confirmed", or the correct URLs. A change is one edit to
`content/social.json`. If a URL is wrong, the footer and `sameAs` are wrong too:
the footer is a SELF edit, `sameAs` is in the R-V STOP set.

## Q-W14-07 · The wave 14 image slots have no permitted source · ANSWERED 2026-09-15, approved origins added to R-W; offer card images shipped (RC-118); tile renders and carport images carried as Q-W14-11 and Q-W14-12 · opened 2026-09-15 (W14-08)

**Resolution, W14-18 (RC-118).** The close-out dispatch answered all three blockers
below: it directs RC-108 and RC-111 to licensed stock or visualisations (section 7
is amended in place for product slots, R-R), it approves Unsplash, Pexels, Pixabay
and four supplier packs as origins (R-W amendment, PR #16), and the banned hosts
stay banned. The four offer cards now carry Unsplash photographs, each with its
row. The metal tile renders and RAL swatches are not sourced (Q-W14-11), and no
licensed image honestly shows the carport families (Q-W14-12). The text below is
the question as it was asked.

**Shipped default: every such slot ships without its image.** The acoperișuri
offer cards render their text column only. Their four image slots are
registered in `scripts/slots.js` (`offer-roof-01` to `04`, 0.81:1), so a file
dropped into `photos-raw/` goes through the pipeline and, the moment it lands in
`public/img/`, the card switches to the two-column layout with no code change.
The build refuses an image that arrives without alt text in both locales, and
R-W refuses one without a provenance row.

**Why no image was sourced.** RC-108 asks for "stock-type roofing scenes, R-W
provenance required"; RC-110 for manufacturer profile renders; RC-111 for
architectural visualisations. Three things stand in the way, and none is mine to
waive:

1. **The master plan forbids it.** Section 7: "Real Rapid Construct work only.
   If a slot has no real photo, the slot is removed rather than filled with
   stock." The dispatch conflicts with that rule, and `docs/CLAUDE.md` says to
   ask before deviating from the master plan. No ruling amends section 7.
2. **No source is approved.** A stock library is a new vendor, which needs your
   sign-off, and its licence terms would need recording per R-W.
3. **The obvious sources are banned.** The audit's own images come from
   fatade3d.md, imperlux.md and dasterum.md, which R-W now fails outright. The
   metal tile renders in audit 5.4 are also watermarked.

**Options, per slot group:**

| Slot group | Card | Honest source | What it needs from you |
|---|---|---|---|
| Offer cards, four roofing jobs | RC-108 | **the client's own photos** of a slate replacement and a new roof | the photos; no ruling needed, section 7 already allows them |
| Metal tile profiles | RC-110 | **the manufacturer**, with written permission | the supplier's name, and their render files or a permission email |
| Carport models | RC-111 | a visualisation licensed for commercial use, or the client's photos | approval of a source, and a ruling amending section 7 for this group |

**Recommended:** ask the client for real photos for the offer cards first. They
depict work the company does, so a real photo is both allowed and more
convincing than stock. Treat stock as a last resort for the carport group only,
under an explicit ruling.

## Q-W14-08 · The metal tile prices are a manufacturer's published list prices; confirm they are ours, and whether chips may show colour · PART (b) ANSWERED 2026-09-15, RAL swatches permitted in the tile grid; (a) ~~OPEN~~ **CLOSED 2026-09-16, settled by `DECISIONS.md`, W16 ratifications: "Dasterum is the confirmed tile supplier. Q-W14-08(a) is closed." Heading updated 2026-09-17 (W20-01, RC-144)** · opened 2026-09-15 (W14-10)

**Shipped default: the grid as the dispatch specified it,** with every value from
the wave 14 audit section 2.1, Standart and Premium only, list prices only, and
colour chips as text.

**(a) Whose prices these are.** The audit read them on 2026-09-15 from the
manufacturer's own listing and product pages. The grid now shows them on Rapid
Construct's homepage as Rapid Construct's list prices:

| Model | Standart | Premium |
|---|---|---|
| Monterrey | 184 lei/m² | 207 lei/m² |
| Valencia | 184 lei/m² | 207 lei/m² |
| Kascad | 189 lei/m² | 213 lei/m² |
| Țiglă metalică modulară | not offered | 188 lei/bucată |

The dispatch named the fields and the source, so this shipped. But nothing in the
repo says Rapid Construct buys from that manufacturer, sells at those prices, or
offers those warranties, and `docs/CLAUDE.md` section 5 says a price is never
invented. Two things need confirming, in writing:

1. **The supplier.** Is this the manufacturer Rapid Construct buys metal tile
   from? The same answer unblocks the product images (Q-W14-07), which can only
   come from the supplier with permission.
2. **The prices and warranties.** Are these the figures Rapid Construct quotes? If
   the company sells at a different price or installs at an all-in rate, the
   list price field is wrong for this site and should be replaced or removed.

**(b) Colour chips without colour.** Each chip reads its code, finish and name,
for example "7016M Gri antracit", with no swatch. A swatch is a colour value, and
`docs/CLAUDE.md` section 3 allows ten on the whole site; the fifteen-code legend
would add up to fifteen more. Options:

  (a) **Keep text chips.** Honest, and within section 3.
  (b) **Allow product swatches as data, not palette.** Add a named exception to
      section 3 for colour chips that depict a product's finish, with the values
      taken from the manufacturer, never estimated.

**Recommended:** confirm or correct (a) first; it decides whether the section
stays. For (b), keep text chips until the supplier supplies its own swatch
values, then take option (b) with those values.

## Q-W14-09 · Which fabricator supplies louvre fence panels to Rapid Construct · ANSWERED 2026-09-15, the page is built without any supplier-specific fact (RC-120, W14-20) · opened 2026-09-15 (W14-12)

**Asked as the dispatch worded it.** RC-112 is blocked on this question.

**Shipped default: the component, with nothing in it.** `content/garduri.json`
holds `"models": []`, so no section renders, nothing links to it and the sitemap
does not mention it. The component deliberately has no field for a model code, a
price, a thickness or a warranty: the dispatch forbids writing any of those until
the supplier is known, and a field that exists invites a value.

**Why the supplier decides the content.** Every figure the audit recorded for
louvre fences (audit 2.2: model codes, a 0.50 mm thickness, a ZnMg 140 g/m²
coating, 20 and 30 year warranties, prices per m²) belongs to one competitor's
own production. None of it transfers to a panel made by someone else. The
supplier's name is what tells us which specifications and warranties Rapid
Construct can actually stand behind.

**What to send:** the fabricator's name, and ideally their product sheet for the
panels Rapid Construct installs. With that, the fields the sheet vouches for are
added to the component and the data filled in one commit, and the product images
can be requested from the same source (Q-W14-07).

## Q-W14-10 · The 160 lei/m² figure is still in the meta description and the JSON-LD price range · ANSWERED 2026-09-15, the figure is removed (RC-105b) · opened 2026-09-15 (W14-05)

**Shipped default in the RC-105 PR: both left as they are.** RC-105 says to delete
every occurrence of the string "preț înghețat 160 lei/m² pentru 2026" and its RU
counterpart, "in body copy, meta description, og:description and any JSON-LD
offer or price field". It was deleted everywhere it occurs. Two places carry the
figure **without** that string, so they were not touched and are reported here:

| Where | RO | RU |
|---|---|---|
| `meta.description`, which also fills `og:description` and the JSON-LD `description` | "... Garanție scrisă până la 30 de ani, **de la 160 lei/m²**." | "... Письменная гарантия до 30 лет, **от 160 лей/м²**." |
| Homepage JSON-LD `GeneralContractor`, `priceRange` | `"160 MDL/m²"` | same node |

Both are in the R-V STOP set.

**The question is whether 160 lei/m² is a price or the offer.** "From 160 lei/m²"
as a standing starting price is a different claim from "160 lei/m² frozen for
2026". If the figure existed only as the frozen offer, removing the offer and
keeping the figure leaves a price with nothing behind it.

**Options:**

  (a) **160 lei/m² is still a real starting price.** Nothing to change; close this.
  (b) **It was only the offer.** A follow-up STOP PR removes ", de la 160 lei/m²"
      and its RU counterpart from `meta.description`, and removes `priceRange` or
      replaces it with a figure the client confirms.

**Recommended:** confirm with the client which it is before merging RC-105, so both
changes land together if (b).

## Q-W14-11 · Metal tile profile renders and RAL swatch values for the tile grid · PART ANSWERED 2026-09-15: swatches from published RAL reference values (RC-122, W14-22); the renders carried as Q-W14-11b · opened 2026-09-15 (W14-18)

**Shipped default: the tile grid as it is,** text colour chips and no profile
image. RC-110's share of RC-118 is blocked on two missing inputs.

**1. The renders.** RC-118 asks for Dasterum profile renders, unwatermarked. The
only Dasterum file available to this run is a price list,
`dasterum-pret-2026-08-07.xlsx`, with no images in it. The renders the audit saw
(audit 5.4) are watermarked and sit on dasterum.md, which R-W fails outright. A
supplier pack is an approved origin under the R-W amendment, but there is no pack
to take them from.

**2. The swatch values.** The ratified amendment to deviation 9 permits RAL chips in
the tile grid, "sourced from the 15-code legend in the wave 14 audit". The legend
holds a code and a name per entry, for example 7016M Gri antracit, and **no colour
value**. RAL publishes no free official screen values; every hex value found online
is someone's approximation, and Q-W14-08 (b) set the rule that swatch values are
taken from the manufacturer, never estimated. A chip painted from an approximation
would show a customer a colour the product may not have.

**What to send:** Dasterum's product pack for Monterrey, Valencia, Kascad and the
modular tile (unwatermarked profile images, 1:1, at least 960px), with written
permission to use them, and the screen colour values Dasterum uses for its fifteen
finishes. Both can be asked for in one message.

**Options for the swatches, if Dasterum has no values:**

  (a) **Keep text chips.** Honest, already live.
  (b) **Approve a named approximation table** for the fifteen codes, recorded as
      approximate in DECISIONS.md, and accept that screen colour is indicative.

**Recommended:** ask Dasterum for both; keep (a) until they answer.

## Q-W14-12 · No licensed image honestly shows the carport families · ANSWERED 2026-09-15, original line diagrams instead of images (RC-123, W14-23) · opened 2026-09-15 (W14-18)

**Shipped default: the carport page stays text-only,** as before. RC-111's share of
RC-118 is blocked because no licensed image found shows what the page describes.

**What was searched.** Unsplash, free licence only, for carport, car shelter,
polycarbonate carport, cantilever carport, arched carport, metal carport, modern
carport and carport house. The results are mostly garages, timber pergolas under
clay tile, and carports built into a brick house. The best near match is a flat
steel carport on posts in a garden, with a car's maker badge in frame. Nothing
shows a cantilever, a wall-anchored, an arched polycarbonate or an architectural
carport. The one steel parking shelter found stands in a commercial car park and
carries a company logo. Pexels and Pixabay were not searched: both need a browser
session or an API key for search, which this run does not have.

**Why stock does not fit here.** The page is organised by structure: five families
(on posts, cantilever, wall-anchored, arched, architectural) and twelve models,
each named for a configuration. An image under "Consolă" that shows posts on both
sides tells the customer the wrong thing about the product. Filling one family and
leaving four empty would also break the grid.

**Options:**

  (a) **Rapid Construct's own visualisations.** The company sells photoreal 3D
      visualisation as a service; five family renders, 8:5, at least 1600px wide,
      in one consistent scene. Provenance: produced by Rapid Construct.
  (b) **The carport fabricator's renders,** with written permission, recorded as a
      supplier pack under R-W.
  (c) **Stock for the post-supported family only,** leaving the other four as text.

**Recommended: (a).** It shows exactly the five structures, in one visual style, and
it is the company's own work.

## Q-W14-13 · The desktop header cannot fit the Catalog button without giving something up · ANSWERED 2026-09-15, the owner's header ladder, fixed at step 3 (RC-121, W14-21) · opened 2026-09-15 (W14-06b)

**Shipped default: #7 stays open and unmerged,** so the live site has no Catalog
button. The branch is current with main and carries the real menu data; everything
but the desktop fit passes.

**The measurement.** From 1200px up the header pill is 1152px wide. With the
Catalog button it needs 1,249px in RO and 1,275px in RU (DECISIONS.md W14-06b has
the breakdown). Tightening every gap and the nav text as far as the header already
goes at 1180px recovers about 84px; RU is still short at every desktop width.

**Options:**

  (a) **Phone as an icon on desktop, on pages with the menu.** The icon still dials
      the number, and the number stays written in the footer, the contact section
      and the phone-width header. Saves about 140px, enough for both locales with
      today's spacing. The header switches to the hamburger layout about 30px
      earlier than 1100px.
  (b) **Catalog button as an icon.** The grid icon only, with its name kept for
      screen readers, plus tighter spacing at every desktop width. Keeps the phone
      number; the button loses its visible word, and the hamburger layout starts
      at about 1180px.
  (c) **A wider header than the page, 1280px, on pages with the menu.** Keeps
      every word visible; the wordmark no longer lines up with the page content's
      left edge, and spacing still tightens below about 1330px.

**Recommended: (a).** A phone icon is a familiar control and one tap still calls.
The Catalog button is new to the site and needs its word to be found.

## Q-W14-14 · Where the RC photo only placeholders go, when their sections do not exist on the site · OPEN, opened 2026-09-15 (W14-19)

**Shipped default: the manifest only,** `docs/assets/PENDING-PHOTOS.md`, and no
placeholder on any page.

RC-119 asks for a neutral branded placeholder in every slot the audit classes RC
photo only, with the slot ID in a data attribute, while before/after and portfolio
data stay empty so those sections do not render. This is what the site has for
those slots:

| Group | Slots | On rapidconstruct.md today |
|---|---|---|
| Before/after | 8 | the section exists, empty by design; the card keeps it hidden |
| Roofing portfolio | 7, plus galleries | exists; 5 already show client photos |
| Roofing hero video | 1 | no such section |
| Video testimonials | 13 | no such section; reviews are text |
| Crew portrait | 1 | no such section |
| Fences: portfolio, video, reviews, team, manager | 30 | no such sections; the fence page shows nothing yet (Q-W14-09) |
| Carport cross-sell | 3 | no such section |

Every slot is in a hidden section, already filled, or in a section that does not
exist. A placeholder therefore needs its section built first: a heading, a layout,
and on the fence page 30 grey tiles on an otherwise empty page. The headings would
be new copy, and a placeholder a visitor can see reverses master plan section 7.

**Options:**

  (a) **Manifest only** (shipped). Each section is built when its photos arrive.
  (b) **Visible placeholder sections** on the live pages, with a heading you supply
      for each section.
  (c) **One unlisted review page** (noindex, linked from nowhere, like the held
      photos under /review/) that shows every pending slot as a branded
      placeholder tile with its slot ID, for the photographer as a visual brief.

**Recommended: (a),** with (c) if the photographer wants to see the shapes.

## Q-W14-15 · The fences page cannot take a header nav link without breaking the header fit · ANSWERED 2026-09-15, the Servicii dropdown puts every service page in the header without a fifth nav link (RC-126, W15-02) · opened 2026-09-15 (W14-20)

**Shipped default: no header nav link.** The fences page is linked from the
homepage teaser row and listed in the sitemap, as it has been since W14-16.

**The measurement (W14-21).** With the catalog button present and RC-121's step 3
applied, a fifth nav link, "Garduri" or "Заборы", leaves the nav short by 24px in
RO and 65px in RU at every width from 1280px, and RU's targets overlap. The ladder's
step 4 (phone as an icon) only acts below 1280px, and the phone number must stay
visible from 1280px up. So RC-120's "link it from the nav" and RC-121's acceptance
cannot both hold.

**Options:**

  (a) **No header link** (shipped). The teaser row, the sitemap, and the page's
      own place under Servicii carry it.
  (b) **Link it from the mobile menu and the footer only,** where width is not the
      constraint. The desktop header stays as RC-121 left it.
  (c) **Replace a desktop nav item** with Garduri, for example Portofoliu, which the
      homepage already reaches by scrolling.

**Recommended: (b).** It puts the page one tap away on phones, where most visitors
are, without reopening the desktop header.

## Q-W14-11b · Metal tile profile renders from Dasterum · ANSWERED 2026-09-16, the renders are abandoned; each model gets an original profile diagram instead (RC-138, W18-01) · opened 2026-09-15 (W14-22)

Carried from Q-W14-11, whose swatch half the owner answered in the tail dispatch.

**Shipped default: no profile image in the tile grid.** The grid shows text and
swatches only. The renders RC-118 asked for (Dasterum profile renders, unwatermarked)
still have no source in this repo: the only Dasterum file available is a price list,
and the images the audit saw are watermarked and sit on dasterum.md, which R-W fails.

**What to send:** Dasterum's product pack for Monterrey, Valencia, Kascad and the
modular tile, unwatermarked, square, at least 960px, with written permission. The
grid already renders `public/img/tigla-<model>.jpg` when the file and its alt text
exist, and R-W's supplier-pack origin covers the provenance row.

## Q-W14-11b, addendum · The wholesale price list is barred, and could not have answered this · 2026-09-15 (W15-01, under R-Z)

**The question stays OPEN and its shipped default is unchanged:** no profile image
in the tile grid, text and swatches only.

R-Z clause 2 bars supplier trade pricing, wholesale price lists and supplier cost
data from this repo in every form. The Dasterum price list the owner supplied is
therefore barred. It also carries no images, so it could not have answered this
question even had it been permitted: the two facts are independent, and either one
alone closes that route.

**What to send is narrowed to exactly one thing:** the product image pack for
Monterrey, Valencia, Kascad and the modular tile, unwatermarked, square, at least
960px, with written permission. Never the price list. R-W's supplier-pack origin
covers the provenance row, and the grid already renders
`public/img/tigla-<model>.jpg` the moment the file and its alt text exist.
## Q-W15-01 · The Servicii disclosure has no caret, because a caret does not fit · ANSWERED 2026-09-16, option (c): the owner reopened it and authorized 4px off the header pill's gap; the caret ships with RU at 9px slack (RC-136, W17-05). Earlier answered by measurement at RC-130 (W16-03) · opened 2026-09-15 (W15-02)

**Shipped default: no caret.** The toggle is exactly as wide as the link it
replaced, so the menu costs no width and the header fits at every width in both
locales.

**The measurement.** A 14px caret with a 4px gap adds 18px to the nav. RU had 15px
of slack at 1280px and up before RC-126, so the caret put the header 3px over at
1280, 1440 and 1920px on all three templates. It was built that way first and
measured failing; the caret came out.

**What this costs.** A nav item that opens a panel now looks exactly like a nav item
that navigates. Clicking Servicii no longer jumps to the services section, it opens
a list whose first row is that same destination. There is no visual signal of the
change. The catalog button does not have this problem because it sits in its own
bordered pill.

**Options, each measured:**

  (a) **No caret** (shipped). Costs nothing. RU keeps its 15px.
  (b) **An 8px CSS caret**, a border triangle rather than an SVG, with a 2px gap:
      12px, leaving RU 3px. It fits, but 3px is inside the noise of a font
      fallback or a future string change, and RU is the locale that breaks first.
  (c) **Take 4px off the header pill's own 24px gap** between its four children,
      recovering 12px, and spend it on a proper 14px caret. This fits comfortably
      in both locales. It edits a value outside the RC-121 ladder the owner fixed
      at step 3, which is why it was not done without asking.

**Recommended: (c)** if the caret is wanted, (a) if the header spacing is not to be
touched. Not (b): it fits only until the next string changes.

**Related:** RC-121's ladder cannot be reverted either, for the same reason. The nav
gap alone costs 24px against RU's 15px. See DECISIONS.md W15-02.

## Q-W15-02 · Four customer-facing strings still say "paleta RAL" · ANSWERED 2026-09-16, the four strings stay exactly as shipped (W16 ratifications) · opened 2026-09-15 (W15-04)

**Shipped default: unchanged.** All four strings stay exactly as they are.

W15-04 removed every claim that **our swatch values** are a standards body's
published data. It deliberately did not touch these four, two per locale, in the
tile page copy: one process step and one FAQ answer.

> Alegi culoarea din paleta RAL, în finisaj mat sau lucios. Pe ecran culoarea e
> orientativă; decide mostra fizică.

> Цвет выбирается по палитре RAL, матовый или глянцевый. Цвет на экране
> ориентировочный; решает физический образец.

**Why they were kept.** They are the indicative-colour lines the card explicitly
says to keep in both locales. And they describe **the palette a customer chooses a
product from**, which is a fact about the product, not a claim about the hex values
this repo draws. The wave 14 audit records that the manufacturer's codes are
RAL-style four-digit numbers and that the competitor's own site prints them without
the RAL prefix.

**Why it still deserves a ruling.** A visitor who reads "paleta RAL" and then looks
at our swatches may reasonably take the swatches to be RAL colours, which is the
impression W15-04 exists to remove. The copy and the swatch now say slightly
different things.

**Options:**

  (a) **Leave them** (shipped). Correct if the product genuinely is sold as a RAL
      palette.
  (b) **Delete the two words.** "Alegi culoarea în finisaj mat sau lucios" and the
      Russian equivalent. A deletion, not invented copy, and the indicative
      sentence is untouched.
  (c) **Keep RAL and attribute it**, saying the codes are the manufacturer's
      reference. This needs new copy and needs to know who the manufacturer is,
      which is Q-W14-08(a), still open.

**Recommended: (b)** unless the product really is sold from the RAL palette, in
which case (a). This is a product fact this executor does not have.

## Q-W16-01 · The category pages have no descriptive copy, because none exists · ANSWERED 2026-09-16, option (b): a lede and two paragraphs per page, authored as general trade knowledge under the owner's permitted and forbidden lists (RC-133, W17-02) · opened 2026-09-16 (W16-02)

**Shipped default: the pages carry sourced content only, and no invented prose.**

RC-129 asks each category page to say **what the category covers** and **what Rapid
Construct does with the material**, plus the one-line lede every other page type
carries. None of that text exists anywhere in this repo. The wave 14 audit section
1.2 is the only source for this taxonomy and it holds **labels and counts only**.
Writing the prose would be inventing copy, which `docs/CLAUDE.md` section 5 forbids.

**What the pages therefore carry today,** all of it sourced: the category name as
the H1, its subcategory names as content where it has any, the related service's
own shipped description with a link to that service, and the standard quote form.

**What is wanted, if you want it:** per category, in **both** locales, so seven of
each in RO and seven in RU:

1. a **lede**, one line under the H1, roughly 90 to 120 characters;
2. a short paragraph on **what the category covers**;
3. a short paragraph on **what Rapid Construct does with the material**.

That is 14 ledes and 28 paragraphs in total. Supplying only item 1 is a useful
half-step: the lede is what the meta description and the page hero most want.

**Options:**

  (a) **Leave them as they are** (shipped). Honest, thin, and five of the seven
      categories have no subcategory list either, so those pages are H1 plus one
      sourced sentence plus the form.
  (b) **Supply all three pieces per category.** The pages then read like the
      product pages do.
  (c) **Supply the lede only.** Restores the hero line and gives each page a
      written meta description rather than a composed one.

**Recommended: (c) first, then (b) if these pages are meant to rank.** All fourteen
are in the sitemap, as the card directs, so they are indexable today; thin pages in
a sitemap are a real cost, and (a) accepts it knowingly rather than by oversight.

## Q-W20-01 · "The endpoint returns 2xx" cannot be asserted without sending a real lead · ~~OPEN~~ **ANSWERED 2026-09-17 (W21 ratifications), option (b) and now a standing rule: Web3Forms answers 2xx only to a real send, so gate 13 asserts wiring and a person sends one real lead per locale after any form change. The rule is `docs/CLAUDE.md` section 11, gate 13** · opened 2026-09-17 (W20-02, RC-145)

**Shipped default: the gate asserts wiring only, and says so in its own output.**
`scripts/check-form-wiring.js` (gate 13) holds every form to the configured endpoint,
the configured recipient (the access key) and the page inventory. It does not assert
the endpoint's HTTP status.

**Why the status half could not be built as dispatched.** RC-145 asks for three
assertions: every form posts to the configured endpoint, **the endpoint returns 2xx**,
and the recipient matches config, "wiring, not delivery". Measured on 2026-09-17,
against `https://api.web3forms.com/submit`, with no submission sent:

| Request | Answer |
|---|---|
| `curl` GET, HEAD and OPTIONS | 403, JSON: "This method is not allowed. Use our API in client side or contact support with server IP address (Pro plan is required)" |
| the same with a desktop Chrome user agent | 403, a Cloudflare "Just a moment..." challenge page |
| headless Chrome 153, a `fetch` POST with **no access key** (so it could not reach any inbox) | the request left the browser and no response reached the page: "Failed to fetch" |

Web3Forms' API reference documents two endpoints, both submission POSTs, and no route
that validates a key or tests a form. Its own caveat: "Server side usage requires paid
plan + server IP whitelisting". So the only request it answers 2xx is a submission it
delivers, from a real browser. That is delivery, which the card rules out, and it
matches the readiness sweep's finding that the send step was blocked in the test
browser.

**Options:**

  (a) **Wiring only** (shipped). Automated on every PR and on every deploy. A template
      that drops the key, posts elsewhere, or ships disarmed fails. A revoked key, a
      full Web3Forms quota or a bouncing inbox is not caught.
  (b) **Wiring, plus a real submission per locale done by hand** after any deploy
      that touches a form, with the subjects `[RO] ... — /` and `[RU] ... — /ru/`
      checked in the inbox. This also closes the half of Q-W9-06 the record never
      held: one submission is recorded, locale unknown.
  (c) **An automated delivery probe.** Web3Forms Pro, plus a fixed egress IP for the
      runner, since GitHub-hosted runners have no stable IP; or a self-hosted runner.
      A new paid tier and new infrastructure, and every run lands a real email in the
      inbox.

**Recommended: (b).** (a) is already shipped, and (b) costs a minute per form change and
catches the failures (a) cannot. (c) buys automation at a recurring cost and an inbox
full of probe mail, for a site whose forms change rarely.

## Q-W21-01 · The catalogue has no product list, and the CTA label the card names collides with the no-price gate · ~~OPEN~~ **PART 2 RULED 2026-09-17 (W22-01), option (a): "Preț la cerere" and "Цена по запросу" are permitted as exact strings on catalogue product cards only, and the gate now allows them there and refuses them everywhere else. PART 1, the product list itself, STAYS OPEN: no product record exists and no card renders.** · opened 2026-09-17 (W21-04, RC-149)

**Shipped default: the structure, with no product records.** `content/catalog-products.json`
carries the seven categories with empty arrays, `build.js` renders the section only
where a category has records, and nothing renders today. Two things are needed before a
card can appear.

### 1. The product list itself

RC-149 restricts the executor to "products already recorded in the wave 14 audit" and
forbids browsing, inventing or remembering any. Measured against that audit
(`docs/audits/wave-14-competitor-structure.md`), **the audit can fill 0 of the 14
category pages**:

| Audit section | Records | Whose products | Category page they could fill |
|---|---|---|---|
| 2.1 Dasterum metal tile | 10 | Dasterum, **Rapid Construct's confirmed tile supplier** (W16 ratifications) | none: roofing has no catalog category, and these already render on `/servicii/tigla-metalica/` |
| 2.2 Imperlux louvre fences | 12 | Imperlux, a competitor with its own plant | none |
| 2.3 Imperlux carports | 12 | Imperlux | none |
| 2.4 Fațade 3D diffusion membrane | 4 | fatade3d.md's own brand | "Alte materiale de construcții" is where **that site** files it |
| 1.2 Taxonomy | 7 categories, 7 subcategories | — | already built as the 14 pages (W16-02) |

**38 product records in the audit, 0 of them Rapid Construct's to list.** Three of the
four families are another company's goods, and `scripts/check-catalog-pages.js` already
refuses the names Dasterum, Imperlux and Fațade 3D anywhere on a category page (W17-02).
`build.js` now refuses such a record too, so the prohibition fails the build rather than
the gate.

**What a record needs, per category:** product name (RO and RU), manufacturer, pack size
or coverage (RO and RU), one key specification (RO and RU). No price, no stock, no
availability, no discount, no image. **Sixteen fields per product**, and the file's
`_note` carries the shape.

### 2. The CTA label

The card specifies **"Preț la cerere" / "Цена по запросу"**. Measured on a fixture build
with three synthetic cards: `scripts/check-catalog-pages.js` fails on every page that
carries one, because its `price-word` pattern refuses `preț` and `цена` on these pages,
and its own self-test sample list contains "цена по запросу". The same fixture cards with
a neutral label pass the gate, so the collision is the wording alone and nothing else in
the card.

**Options:**

  (a) **Allow the exact phrase, both locales, as a named occurrence exception in the
      gate.** It is the absence of a price, not a price. Every other price word still
      fails, and a figure still fails.
  (b) **Use a label from the site's existing vocabulary**, for example "Cere ofertă
      pentru acest produs" / "Запросить смету на этот товар". No gate change; the label
      is longer and says the same thing.
  (c) Drop the label to the plain quote wording already on the page,
      "Solicită ofertă gratuită" / "Получить бесплатную смету".

**Recommended: (a).** The phrase is what a buyer looks for, and the gate exists to keep
figures off these pages, not the word. If you prefer no gate change, (b) ships as it
stands.

**Until this is answered, no product card renders.** The structure, the quote wiring and
the gate are in place and were proven on a fixture: 12 of 12 submits sent the card's own
product name.

## Q-W23-01 · Batch 2: four "after" images are visualisations and two roof frames are watermarked · OPEN · opened 2026-09-18 (W23-01)

**Shipped default: one file of twenty-two published, twenty-one held.** Nothing was
deleted; the source folder is untouched and every held file is listed with its reason in
`docs/audits/wave-23-photo-intake.md`.

Three things need an answer from Mihai, and the first two are the reason the before/after
slider is still empty.

### 1. The four "after" images are 3D visualisations

`After_1` to `After_4` are renders, not photographs: rendered planting and paving, dusk
lighting with no shadow noise, catalogue furniture and cars, no trace of the building
site their own "before" frame shows. Three carry `Software: Picasa`.

A before/after slot is a proof slot (master plan section 7, as amended by W14-18): real
Rapid Construct work only, never stock and never a visualisation. Publishing a render as
the "after" of a real house claims a finished job the batch does not evidence.

**What unblocks it:** a photograph of each finished house, taken from the same point as
its "before". One pair is enough to turn the section on.

### 2. Two roof frames carry someone else's watermark

`Acoperisuri/…4.19.47 AM (1).jpeg` and `…4.19.48 AM.jpeg` carry a translucent wordmark
in the sky. The R-W amendment of 2026-09-18 makes the client's own files an approved
origin, and says in its own words that the licence line describes the origin, not the
content: a watermarked frame is somebody else's and cannot be published as ours.

**What unblocks it:** confirmation of where those two files came from, and a licence if
they are a supplier's or a photographer's.

### 3. Twelve files have nowhere to go on the site

Six garduri photos, `echipa.jpeg`, four roof frames and the "before" halves map to slots
that **have no host component**: the garduri page renders no photo gallery, the site has
no team section, and the roof covers 01 to 05 are filled. This is not a photo problem.

**Options:**

  (a) **Hold them** (shipped). They stay in the batch folder, listed and reasoned.
  (b) **Build the hosts**, which is a card each: a fence gallery on `/servicii/garduri/`,
      a team block, further roof projects in `content/projects.json`.
  (c) Fill the remaining roof project, `acoperisuri-06`, which already has its cover from
      this batch but stays invisible until it has a title and a summary (Q-04).

**Recommended: (c) first**, because the cover is already in place and two sentences from
Mihai turn a held photo into a visible project. Then (b), one card per host, if the fence
and team photographs are meant to be seen.

## Q-W23-02 · On a window shorter than 713px, the last rows of the Servicii panel cannot be reached · OPEN · opened 2026-09-19 (W23-06)

**Shipped default: (a), the panel as it was built, with no scrolling of its own.**

W23-06 fixed the rule that painted the Servicii panel's rows white. The same rule had also
given them the nav bar's 16px type on one line with a line height of 1, so the panel was
534px tall, its bottom sat 618px down the window, and four rows ran past its right edge
unseen: "Lucrări de terasament și excavare" by 8px, and in RU three rows by 4, 30 and
40px. With the rule scoped, the rows take the treatment the panel was built with at W15-02,
the Catalog panel's: 15px, line height 1.35, wrapping. Nothing runs past the edge now, two
RU rows wrap to a second line, and the panel's bottom sits at **673px in RO and 713px in
RU**, measured at 1280 and 1440px wide.

The header is fixed, so the panel does not move when the page scrolls. **In a browser
window whose page area is shorter than that, the last rows are below the window and cannot
be scrolled to.** A 1366×768 laptop screen leaves less than 713px once the browser's own
bars are drawn. Before W23-06 the same was true below 618px, though then no row could be
read at any height.

**Options:**

  (a) **Leave it** (shipped).
  (b) **Let the panel scroll inside itself** when the window is short: a maximum height of
      the window below the panel's top, and the rest scrolls within the panel. No new
      colour or shape. The Catalog already becomes a scrolling sheet on a short landscape
      phone (W19-D10).
  (c) Tighten the rows, with smaller type or line height. Not shipped: it changes type
      the owner has not asked to change.

**Recommended: (b)**, one small card: every row reachable at any window height.

## Q-W24-01 · What "move the wave index line into the repo memory folder" names · ~~OPEN~~ **CLOSED 2026-09-20 by the W24 ratification: the shipped default stands. See `DECISIONS.md`, "W24 ratifications". No body below is edited (R-S)** · opened 2026-09-19 (W24-01)

**Shipped default: (a). The current-wave state now lives in the session memory folder for
this repo, and the governing documents keep only what they own.**

The wave 24 dispatch asks W24-01 to "move the wave index line into the repo memory folder
(F-28)". F-23 and F-28 are findings from an audit the owner holds and that this repo does
not carry, so neither the exact line nor the exact destination is written anywhere the
executor can read. F-23 was unambiguous and is done: the seven wave 23 rows in
`docs/BACKLOG.md` said "PR open, awaiting owner" and every one of those pull requests is
merged, so each row now names its number and its merge sha.

F-28 is not unambiguous, on two points.

**Which line.** There is no line anywhere in the repo that calls itself a wave index.
`grep -ri "wave index"` over `docs/`, `DECISIONS.md`, `RELEASE-NOTES.md` and `README.md`
returns nothing. What does exist, and is the only thing that behaves like one, is the
per-wave dispatch paragraph at the head of each wave section in `docs/BACKLOG.md`: which
pull requests were verified merged, what `origin/main` was, which rulings ride the first
pull request. That is **state**, and `docs/CLAUDE.md` opens by saying this repo's rule
files hold "rules only, never state".

**Which folder.** The repo has no folder named `memory`. It has no root `CLAUDE.md`
either. What does exist is the session memory folder this executor is given for this repo,
`~/.claude/projects/-Users-ivan-Documents-Projects-rc-website/memory/`, which was empty
before this card.

**Options:**

  (a) **Read it as the current-wave state, and the session memory folder as the
      destination** (shipped). A `wave-index` memory now holds which wave is live, what
      `origin/main` was at dispatch, and the branch stack, with a pointer line in that
      folder's `MEMORY.md`. `docs/BACKLOG.md` keeps its per-wave dispatch paragraphs,
      because they are the dated record of what was true when each wave opened and R-S
      makes those bodies immutable.
  (b) **Read it as a folder inside the repo**, `docs/memory/` or `.claude/memory/`, and
      move the dispatch paragraphs there. Not shipped: it would move an append-only record
      out of the file that indexes it, and it creates a fourth place a reader has to look.
  (c) **A line the owner can point at.** If F-28 names a specific line this reading missed,
      the fix is one edit and the memory file is harmless either way.

**Recommended: (a), and the owner names the line if it was a different one.** The shipped
default costs nothing if it is wrong: the memory file is outside the repo and the backlog
is unchanged.

## Q-W24-02 · The Catalog button could not take the hero button's paint at its old size, and one fix was needed · ~~OPEN~~ **CLOSED 2026-09-20 by the W24 closing ratification: the shipped header state is FINAL** (option (a), the nav gap at 14px). Re-measured on the W24-09 tree by reverting the fix and restoring it: with the 20px gap RO 4px and RU **-7px**, 90 of 216 red; as shipped RO 22px and RU 9px, 216 of 216 green. See `DECISIONS.md`, "W24 closing". No body below is edited (R-S) · opened 2026-09-19 (W24-02)

**Shipped default: the one fix proposed below. The dispatch asked for it to be proposed,
and it is shipped so the card is not left half-done. Say the word if you want a different
one and it is a one-line change either way.**

The dispatch said: "Button background = the exact token of the hero 'Solicita oferta'
button, same text colour, same hover. Header-fit gate green in RO and RU. RU has 9px
slack: if it fails, stop and propose one fix, never shrink type."

It failed. Here is exactly why, and what was done.

**The paint cannot be worn at the old size.** The hero button is `--brand` with a white
label and `--brand-dark` on hover. Measured:

| Pairing | Ratio | Verdict |
|---|---|---|
| white on `--brand` | 3.41:1 | passes WCAG AA only above the large-text threshold, 18.66px bold |
| white on `--brand-dark` | 5.93:1 | passes at any size |
| `--ink` on `--brand` | 5.10:1 | passes at any size |
| `--ink` on `--brand-dark` | 2.94:1 | fails at every size, large text included |

So **no single label colour is legible in both states at the old 15px.** White fails at
rest, `--ink` fails on hover. The site already resolved this for every other primary
button: `docs/CLAUDE.md` section 4 records that button text is sized to clear the
large-text threshold so white on `--brand` is judged against 3:1. Wearing the paint means
wearing the size: 19px/700, which is `.btn`'s own.

**That cost the header 15px in RO and 16px in RU**, and the fit gate went from RO 19px /
RU 9px of slack to **RO 4px / RU -7px**, red on both the floor and the fit, 36 of 108
combinations.

**The one fix: the nav gap goes from 20px to 14px.** Four nav items have three gaps
between them, so six pixels off each returns eighteen, which is more than the type cost.
No type was shrunk. Measured after: **RO 22px, RU 9px, 108 of 108 green.** RU is left with
exactly the slack it had before this card.

**A second, smaller thing came out of the same measurement.** Below 768px the toggle's
label is 14px and there is no room to raise it: a 19px label measured at 375px leaves RO
8px and RU 3px against the same 8px floor, where 14px leaves RO 23px and RU 19px. So on a
phone the label is `--ink` on `--brand`, 5.10:1, and the fill is the same `--brand` as
everywhere. Only the label colour moves, and only where the size is fixed. Eight readings
in a real browser, RO and RU, 1440 and 375, at rest and open: all eight pass.

**Options, if the shipped fix is not the one you want:**

  (a) **Nav gap 20px to 14px** (shipped). Costs nothing visible; the nav items sit six
      pixels closer.
  (b) **Toggle padding 16px to 8px.** Returns exactly the 16px, and leaves RU at 9px too.
      Not shipped: a filled pill with 19px/700 text and 8px of side padding looks wrong
      beside a site whose buttons use 28px.
  (c) **Keep the label at 15px and use `--ink` at every width.** Costs no header width at
      all and needs no nav change, but the button then reads as the promo bar's pairing
      rather than as the site's primary CTA, which is the opposite of what the card asks
      for.
  (d) **Lower the 8px slack floor.** Refused: the floor is yours, and the gate is written
      so it is never lowered to accommodate a measurement.

**Recommended: (a), as shipped.**

## Q-W24-03 · Five product names carry a typo on the source, and a competitor's house brand is on 64 records · ~~OPEN~~ **CLOSED 2026-09-20 by the W24 closing ratification.** Owner decision: keep the 64 RedConstruct records with the brand line hidden, which is the `brand_hidden` default W24-09 shipped, so no change follows. Parts 1 and 2 were answered 2026-09-20 (W24-09): the owner took **(b)** on both. The five names are corrected in `name.ro` with `source.name` left verbatim, and the 64 RedConstruct records are kept with their brand line withheld behind `brand_hidden`. Part 3 ~~OPEN~~ stays OPEN, shipped default (a) stands · opened 2026-09-19 (W24-03)

**Shipped defaults: the typos are copied verbatim, and the house brand is stored and will
render. Both are reversible in one line.**

W24-03 copied all 223 products from `fatade3d.md` under W24-R1. Three things in that data
need a word from you, and none of them blocked the card.

### 1. Five names carry a capitalisation typo on the source

`f3d-4853`, `f3d-4864`, `f3d-4875`, `f3d-4886` and `f3d-4897` are spelled **`PLacă`**
rather than `Placă` on the live source, in the middle of a category where every other row
is spelled correctly.

The dispatch says "variant line exactly as shown" and "exact name with diacritics", so
they are stored and will render exactly as the source spells them. That also means
**Rapid Construct's site would carry a competitor's typo five times.**

  (a) **Copy verbatim** (shipped). "Exactly as shown" read literally.
  (b) **Correct the capitalisation** and record the correction in
      `docs/CATALOG-SOURCE-W24.md` beside the verbatim source string, which is already
      stored in `source.name`. A spelling fix is not inventing copy under
      `docs/CLAUDE.md` section 5, but it is a deviation from "exactly as shown", which is
      why it is not shipped without a word from you.

**Recommended: (b).** Five characters, and nobody wants a typo on their own site.

### 2. Sixty-four records carry the brand "RedConstruct"

Every product in **Elemente decorative** carries it. It looks like the source's own house
brand for that range, not a third-party manufacturer. It is not on the refused list, so
`build.js` and the catalogue gate both allow it, and it will render as a small brand line
on each of those 64 cards.

W23 ruled that a brand may be named as a product's manufacturer because you state you
supply it. That ruling was made about the twenty brands you answered on, and
**RedConstruct is not one of the twenty.**

  (a) **Render it** (shipped). It is the brand the source states, and the dispatch says to
      copy the data.
  (b) **Withhold the brand line on those 64**, the same way the 27 records whose brand is
      a refused name are handled: the value stays in `source.brand`, nothing renders.
  (c) Add RedConstruct to the refused list, which would also keep it out of any later card.

**Recommended: (b) unless you supply RedConstruct.** Printing another company's house
brand on your own catalogue reads as reselling their range, which is a claim about the
business rather than a product fact.

### 3. Two products' names carry a refused manufacturer, and are rendered with it removed

`f3d-2576` and `f3d-2583` are named with **FAȚADE 3D** in the name itself. W17-02 refuses
that name on a catalogue page and W24-R1 does not touch W17-02, so the names render as
`Plasă de armare`, `Армирующая сетка`, `Colțar PVC` and `ПВХ уголок`, with the untouched
source string kept in `source.name`.

  (a) **Render with the name removed** (shipped). Shortening is permitted under section 5;
      the refused name is the only thing taken out.
  (b) **Hold both records** and list them instead. Two fewer products.

**Recommended: (a), as shipped.**

## Q-W24-04 · Twelve cards on a phone cannot reach the dispatch's 9,000px target, and the gap is one number · ~~OPEN~~ **CLOSED 2026-09-20 by the W24 closing ratification: NINE, option (b).** Implemented by W24-10; `PROD_STEP` in `build.js` is 9. Measured on the shipped tree: `/catalog/placi-ceramice/` reads **8,696px** at 390, under the target, which is the figure this question predicted. The RU copy reads 9,182 and is recorded in `docs/rulings/R-Y.md` rather than acted on, the target having named one path. No body below is edited (R-S) · opened 2026-09-20 (W24-09)

**Shipped default: twelve, exactly as the dispatch specifies. `/catalog/placi-ceramice/`
measures 10,189px at 390px on load, against a stated target of under 9,000px.**

The W24-09 dispatch asks for two things that cannot both be true:

> every catalogue grid shows the first 12 cards, then one full-width button "Arata mai
> multe" ... Target: /catalog/placi-ceramice/ under 9,000px at 390 on load.

**The arithmetic, all of it measured rather than estimated.** Below 512px the catalogue
grid is one column. A card's image is a placeholder at a `1 / 1` ratio, which is what
`docs/PHOTO-SLOTS-W24.json` specifies for all 223 catalogue slots, so it is square by
decision and will stay square when the photographs land. On a 390px viewport that makes a
card plus its gap **515px**, and twelve of them **6,181px**.

The rest of the page is **4,008px**: header 80, promo bar 36, hero 323, the prose block
750, the moved offer button 104, the quote form 1,461, the footer 1,254. None of it is
this card's, and none of it is unreasonable.

6,181 + 4,008 = **10,189**.

**What each first-screen count measures.** Every row below was built and read in a real
browser at 390px with mobile emulation, not derived from the card height:

| First-screen cards | `/catalog/placi-ceramice/` at 390 |
|---|---|
| 12 (shipped) | 10,189px |
| 9 | **8,696px** |
| 8 | **8,198px** |

**It is one number.** `PROD_STEP` in `build.js` sets both the first-screen count and the
step per press. Changing it to 9 or 8 reaches the target and needs nothing else: the CSS,
the JS, gate 20 and the live markers all read the count off the markup rather than
carrying their own copy.

  (a) **Twelve** (shipped). The dispatch's own number, read literally. Misses the target
      by 1,189px.
  (b) **Nine.** Reaches the target with the least movement from what was asked.
  (c) **Eight.** Reaches it with more headroom, and eight is two full rows at the 2-column
      regime between 512 and 768px, where twelve is six rows.
  (d) **Keep twelve on the first screen but reveal more per press.** Does not touch the
      target, which is an on-load measurement.

**Recommended: (b).** The target is the thing the owner can see and the twelve is an
implementation number. But it is the owner's call, and it was not worth blocking the card
over: the change from 47,917px to 10,189px is 98 percent of the win either way.

## Q-W24-05 · The case la cheie page is over its height budget in both locales, and ~~W24-05 is the cause~~ · ~~OPEN~~ **CLOSED 2026-09-20 by W24-09b, and its recommendation was WRONG.** The cause is not W24-05 and not the budget: W24-07's `.faq` class collision added 99px to all twenty service pages, and case la cheie was the only one with a budget tight enough to show it. W24-05's measurement was correct, the budget does not move, and re-budgeting as recommended below would have written a defect into a ruling. See `DECISIONS.md`, W24-09b. No body below is edited (R-S) · opened 2026-09-20 (W24-09)

**No default shipped. This is not W24-09's page and W24-09 did not touch it.**

The live verification owed since F-22, run on `2ab3a4b` with all eight wave 24 cards
merged, returned two hard budget failures:

| Page | Measured live | Budget | Over by |
|---|---|---|---|
| `/servicii/case-la-cheie/` | 6,475px | 6,436 | 39px |
| `/ru/servicii/case-la-cheie/` | 6,582px | 6,543 | 39px |

Both are over by exactly 39px, which is what says it is one cause and not two.

**The cause is W24-05**, which turned the before/after slider on, on this page and only
this page. The page grew and **its budget was not re-measured with it**. W24-05's own R-Y
amendment took the page out of the shared service-page budget and gave it one of its own;
that figure was taken before the slider settled at its final height.

  (a) **Re-measure and re-budget under W24-R4**, measured plus 60, as every other wave 24
      page was. One R-Y amendment and two numbers in `scripts/verify-live.js`.
  (b) **Find the 39px on the page** and keep the budget where it is.

**Recommended: (a).** The budget is wrong, not the page: 39px on a 6,475px page is the
slider being measured before it settled, and a budget that was never a measurement of the
shipped page is not a budget worth defending.

## Q-W25-01 · WebP cannot be encoded on this machine, and every route to it is a new dependency · ANSWERED 2026-09-21 (W25-R2): JPEG only, no new dependency · opened 2026-09-20 (W25-01)

**Shipped default: JPEG only, with the markup already written to carry WebP the day one
exists. No dependency was added, because adding one needs your word.**

The wave 25 dispatch asks for "WebP plus JPEG fallback" on every filled slot. The JPEG half
ships. The WebP half does not, and the reason is not a preference.

**Every built-in route was tried and each is recorded rather than summarised:**

| Route | Result |
|---|---|
| `sips -s format webp` | **exit 13**, no file written |
| macOS ImageIO writable types | `public.jpeg`, `public.png`, `public.jpeg-2000`. **No WebP.** Read support exists; write support does not |
| `cwebp` | not installed |
| ImageMagick (`magick`, `convert`) | not installed |
| `sharp` or any npm package | **this repo has no `package.json`, no lockfile and no `node_modules`**, which is a documented property of the build |

macOS 26.6.2. So WebP needs something new on the machine or in the repo, and
`docs/CLAUDE.md` is explicit: **no new third-party dependency or vendor without asking
first.** That is why this is a question and not a decision.

**What the JPEG-only cost actually is.** A 800px packshot at quality 88 lands around
200KB. WebP at visually equal quality is typically 25 to 35 percent smaller. On a
catalogue page showing nine cards on a phone that is roughly 500KB against 700KB. It is a
real saving and it is not a correctness problem: every browser renders the JPEG.

**Nothing has to be rebuilt when you answer.** `build.js` already emits
`<source type="image/webp">` the moment a `.webp` sits beside the `.jpg`, and leaves it
out when one does not. No template, no call site and no gate changes.

  (a) **JPEG only** (shipped). Nothing installed, nothing to maintain, pages a third
      heavier than they could be.
  (b) **Install `cwebp`** (the Google `webp` package, via Homebrew). One binary, one line
      in `scripts/process-packshot.js`. It is a workstation tool, not a repo dependency:
      CI never converts, because converted files are committed. **This is the smallest
      change that gets the saving.**
  (c) **Add `sharp` and a `package.json`.** Rejected unless you want it for other reasons:
      it would end the repo's zero-dependency property, which several gates and the CI
      workflow are written around, to solve one conversion step.
  (d) **Ask the manufacturers for WebP.** Not realistic; packshots come as JPEG or PNG.

**Recommended: (b).** It is one binary on one machine, it changes no property of the repo,
and it is reversible by deleting a line. If you would rather not install anything, (a) is
perfectly serviceable and the site is correct either way.

## Q-W25-02 · The 800px source floor is what is emptying the catalogue, not the absence of manufacturer pages · ANSWERED 2026-09-21 (W25-R2): floor 500, then 450 and final at W25-R3 · opened 2026-09-21 (W25-02)

**Shipped default: the floor stands at 800px and every product under it stays a
placeholder. W25-02 filled 1 slot of 35. This is the one number that changes that.**

The dispatch asks for packshots at "longest side 800px". `scripts/process-packshot.js`
therefore refuses a source under 800px, because upscaling a 343px image to 800 invents
detail that was never photographed. That refusal is doing almost all of the rejecting.

**Measured, on the manufacturers' own official pages:**

| Manufacturer | Product | Their own packshot | Verdict |
|---|---|---|---|
| ROCKWOOL | Rockton Super | **800 x 600** | **filled** |
| DURAZIV | Standard cu Silicon TDS | 343 x 335 | refused, too small |
| DURAZIV | Clima Protect cu Kauciuc | 343 x 335 | refused, too small |
| ROKO AquaMix | Omítka Silikon | 492 x 400 | refused, too small |
| ROKO AquaMix | Omítka Rokomozaiková | under floor | refused, too small |

**In every one of those cases the image was correct in every other way**: the
manufacturer's own site, the right product, the right pack size, the product alone on a
plain background, no watermark, no retailer logo, no face. They were refused on pixels
alone. DURAZIV publishes no larger original: the same 343px file is reused across its
category and campaign pages and its media API is closed.

**What 800px is actually for.** At 1440px the catalogue grid is four columns in a
1,152px container, so a card's image box is about 264px wide. At 2x device pixel ratio
that is 528px. **800 is generous, and 528 would be indistinguishable on the devices this
site is read on.** The 800 in the dispatch is an output target that became an input floor.

  (a) **Keep 800** (shipped). The safest pixels, and most of the catalogue stays grey.
  (b) **Lower the source floor to 500px and keep the 800px output**, letting a 500px
      source upscale by 1.6x. Slightly soft at 2x on a large screen; invisible at 1x.
  (c) **Lower the floor to 500px AND the output to 600px.** Nothing is upscaled at all,
      files get smaller, and the box still has more pixels than it paints at 2x.
  (d) **Case by case**, with each undersized image looked at before it is accepted.

**Recommended: (c).** It is the only option that fills the slots without inventing a
single pixel, and the arithmetic above says the site cannot show the difference. It is a
two-constant change in one script.

**This does not touch any other rule.** R2's forbidden hosts, the never-origins, and
W25-R4's "never a near match" are untouched: this is about the size of a correct image,
not about accepting a wrong one.

---

## Q-W25-03 · Two things about the research that you should decide, not me · ANSWERED 2026-09-21 (W25-R2): no Russian-domain source, brand-portal subdomains approved · opened 2026-09-21 (W25-02)

**1. Penoplex is a Russian domain.** The only official source for `CAT-0006`
(`Polistiren Penoplex`) is `penoplex.ru`. **R2 does not forbid it** and it is genuinely
the manufacturer. But this is a Moldovan company's public site in Romanian and Russian,
and whether to host an image fetched from a `.ru` domain is a business decision about
your market, not a technical one. **Nothing was fetched from it** (the URL returned HTML
rather than an image anyway). Say the word either way.

**2. ROCKWOOL's packshot came from `brandportal.rockwool.com`, not `www.rockwool.com`.**
That is ROCKWOOL's own brand asset portal on their own registrable domain, which R1
allows, and it is where their product pages serve images from. Recorded here because the
provenance row names a host that is not the one a reader would expect from the source page
URL, and that should be a decision you saw rather than one you discover.

## Q-W25-04 · Seventy of the 88 ceramic plates carry a manufacturer whose catalogue does not have them · ANSWERED 2026-09-21 (W25-R2), then **VOID** 2026-09-21 (W25-R3): the count it ruled on was wrong and was never applied · opened 2026-09-21 (W25-03)

**No default shipped. Nothing was filled and nothing was changed: this is a question about
the data, and answering it wrongly would put the wrong photograph on 70 cards.**

All 88 products in `placi-ceramice` carry `brand: "Phomi"`, copied from the source by
W24-03, which was correct: it is what the source states. **Phomi's own catalogue does not
contain most of those names.**

Measured against `phomi.com`, the manufacturer's own site, category by category:

| | Count |
|---|---|
| Our products attributed to Phomi | **88** |
| Names that exist in Phomi's catalogue, exactly | **17** |
| Names that match with a suffix difference (`Polished Wood 4.0` vs `Polished Wood`) | 1 |
| **Names that do not exist in Phomi's catalogue at all** | **70** |

The 17 are unmistakably Phomi: `Rome Travertine`, `Ghana Travertine`, `Oceanic Travertine`,
`Rough Surface`, `Skyline`, `Mount Celestial`, `Stone Alpes`, `Marble`, `Rusty Slab`,
`Rammed Earth Wall`, `Polished Stone`, `35 Piece Stone`, `Bush Hammered`,
`Devine Mushroom Stone`, `Original Wood`, `Spliced Wood`, `Poly Wood`.

The 70 are names like `Kamu Red`, `Tunguska Yellow`, `Castol Grey`, `Veil White`,
`Elsa Black Grey`, `Y001-01-02`, `HY001`. Phomi organises its range by surface
(Travertine, Nature Stone, Art Stone, Wood, Brick, Weaving, Leather) and publishes no such
colour names anywhere on its site.

**The source's own data disagrees with itself, which is the strongest evidence here.**
Read the URLs W24-03 captured beside the names it captured:

| Source URL slug | Name the source displayed |
|---|---|
| `placa-ceramica-elysee-pure-red` | Placă **Kamu Red** |
| `placa-ceramica-elysee-pure-white` | Placă **Kamu Yellow** |
| `placa-ceramica-baroque-white` | Placă **White Sesame** |

A product whose own address says `pure-white` is displayed as **Yellow**. Whatever those
70 records are, the source's naming is not reliable, and **W24-03 was right to copy it
verbatim rather than tidy it.**

**What this means for pictures.** Under W25-R4 a slot with no compliant image stays a
placeholder, and "compliant" starts with being the right product. **I cannot fetch a
picture of `Kamu Red` from Phomi, because Phomi does not make anything called Kamu Red.**
Any image chosen would be a different product wearing this one's name.

  (a) **Leave all 70 as placeholders** and let W25-05 generate them from their own names
      and colours. Costs nothing, claims nothing, and the AI prompt pack already exists to
      do exactly this.
  (b) **Tell me the real manufacturer**, if you know who actually makes them. Then they
      become ordinary W25-02 work.
  (c) **Strike the Phomi attribution on those 70** and render them with no brand line, the
      way the 64 RedConstruct records already work via `brand_hidden`. One flag each.
      **This is the only option that also fixes what the SITE currently says**, which is
      that Phomi makes 70 products Phomi does not make.
  (d) Hold the 70 records and shorten the catalogue. Not recommended: they are products
      you sell.

**Recommended: (c) plus (a).** The brand line is a factual claim about a manufacturer and
it is currently wrong on 70 cards; `brand_hidden` already exists and costs one flag. Then
W25-05 covers the pictures. **(b) beats both if you know the answer** and it is one
sentence from you.

**The 17 real Phomi products are a separate matter and are blocked only on Q-W25-02**: the
images exist, on Phomi's own domain, and measure about 459 x 398px.

## Q-W25-05 · The real manufacturer of the ceramic plates Phomi does not make · ANSWERED 2026-09-21 (W25-R3): Ecofasad and Kordeko · opened 2026-09-21 (W25-03), written down 2026-09-21 (W25-03c)

**This heading is late and that is the entry.** W25-R2 ordered "open Q-W25-05 'real
manufacturer of the 70 plates', blocked on client". W25-03b did not write it, so a question
the owner had asked for existed only inside another question's body for a day. It is
written here at its own number, with its answer, rather than back-dated into silence.

**The question.** Some of the 88 products in `placi-ceramice` carry `brand: "Phomi"` copied
from the source, and are not in Phomi's catalogue. Who makes them?

**The answer, from the owner, 2026-09-21:** the non-Phomi flexible ceramic plates come from
**Ecofasad** and **Kordeko**. Both are treated as manufacturer official sites under W25-R1,
and a Russian domain is reported rather than fetched, unchanged from Q-W25-03.

**What it does not settle.** How many plates are theirs. That is measured against their own
catalogues by W25-03d, after the full Phomi walk, and the settled counts per brand are
reported there. The residual after all three catalogues is what takes `brand_hidden`, and
nothing else does.

## Q-W25-06 · I was wrong in W25-03: 51 of the 88 plates ARE Phomi products, not 17 · ANSWERED 2026-09-21 (W25-R3): the stop is ratified, option (b); walk all three catalogues, then rule once · opened 2026-09-21 (W25-03b)

**Nothing was changed on the strength of this. `brand_hidden` was NOT applied to any
plate, because W25-R2 ruled on a count I got wrong and the corrected count may still move.**

### What I reported, and what is true

W25-03 told you that 17 of the 88 ceramic plates exist in Phomi's catalogue and **70 do
not**, and you ruled on that: `brand_hidden` on the 70, they stay placeholders, and
Q-W25-05 opened for their real manufacturer.

**I matched against Phomi's category LISTING pages, which show product families and not
the colour variants inside them.** Harvested properly from the product pages themselves,
Phomi publishes **129 distinct variant names**, and the match is:

| | W25-03 said | Actually |
|---|---|---|
| In Phomi's catalogue | 17 | **51** (33 colour variants, 18 families) |
| Not in Phomi's catalogue | **70** | **37** |

The matches are exact, not approximate. `Kamu Red` is a Phomi colour called **Kamu Red**.
So are `Tunguska Yellow`, `Castol Grey`, `Veil White`, `Dandy Grey`, `Blue Grey`,
`Ash Grey`, `Stellar Red`, `Plain White`. **Those are the very names I told you did not
exist.** The source's `elysee-pure-white` slug is still inconsistent with its own
displayed name, but that was the wrong thing to conclude a manufacturer from.

### Why this still fills nothing

Both halves of the corrected 51 are refused, for two different reasons, both measured:

| Phomi image | Size | Verdict |
|---|---|---|
| Family images (18 plates) | 459 x 398 | **under the 500px floor**, by 41px |
| Colour variants (33 plates) | 650 x 450 | passes the floor, **but every one carries its English name burned into the picture** |

The variant swatches read `Kamu Red`, `Tunguska Yellow` and so on in black type across the
bottom left. The catalogue card already prints the product name underneath, in Romanian.
Using them would print the name twice, in two languages, one of them baked into the
photograph and unfixable. W25-R2's own rule for generated images is "no text"; these are
photographs with text in them.

### What I need from you

  (a) **Re-rule the `brand_hidden` set as the 37**, and I apply it. It is the ruling you
      already made, on corrected facts.
  (b) **Hold all of it** until the 37 is confirmed too. **It may still shrink**: I
      harvested 22 of Phomi's product pages, and it has brick, weaving and leather ranges
      I did not walk. Some of the 37 (`Y001-01-02`, `HY001`, `H06`) look like product
      codes rather than names and may well be Phomi's.
  (c) **Accept the text-bearing swatches** for the 33 and I fill them today.
  (d) **Lower the floor to 450** and the 18 clean family images fill. Nothing else in the
      whole catalogue is unlocked by it; see Q-W25-07.

**Recommended: (b) then (a).** Let me finish walking Phomi's catalogue so the 37 is a
number you can rule on once, rather than a third count. I do not recommend (c): a
photograph with another language's text burned into it is not a product photograph of
this shop's product.

---

## Q-W25-07 · The 500px floor unlocks nothing; the real population sits at 343 to 492 · ANSWERED 2026-09-21 (W25-R3): option (c), 450, FINAL · opened 2026-09-21 (W25-03b)

**Shipped default: the floor is 500 and the output 600, exactly as W25-R2 rules, with the
499 negative test passing. It is correctly implemented and it changes no outcome.**

W25-R2 lowered the floor from 800 to 500 to unblock the packshots W25-02 and W25-03
refused on pixels. **Re-measured directly, every one of them is still refused:**

| Manufacturer | Products | Longest side | Short of 500 by |
|---|---|---|---|
| DURAZIV | 2 | 343 | 157px |
| Phomi, family images | 18 | 459 | 41px |
| ROKO AquaMix | 2 | 492 | **8px** |

ROKO misses by eight pixels. DURAZIV by a third of the floor.

**The floor moved from 800 to 500 and the measured population is 343 to 492**, so it
passed over the whole group. That is not an argument for any particular number; it is the
reason the number should be chosen from the measurements rather than from the output size.

  (a) **Keep 500** (shipped). Correct, tested, and it unlocks nothing measured so far.
  (b) **340.** Everything measured clears it. A 343px source shown in a 264px box is
      sharp at 1x and soft on a high-resolution screen.
  (c) **450.** Clears Phomi's 18 families and ROKO's 2, leaves DURAZIV's 2 as placeholders.
  (d) Keep 500 and accept that these stay grey until the manufacturers publish larger.

**Recommended: (c).** It is the largest floor that unlocks anything, it clears 20 products
rather than 2, and 450 into a 264px box is still above 1x. **Never upscaling is what makes
any of these safe**: the pipeline writes a 459px source at 459, not stretched to 600.

## Q-W25-08 · Ten manufacturers were never attempted, and they are 29 catalogue products · OPEN · opened 2026-09-21 (W25-03c)

**Nothing is blocked on this and nothing was done about it.** It is scope, not a decision
about the data, and it is raised because it is the largest remaining block of empty slots
in the catalogue and it is not in any card's work order.

W25-02 ran fourteen research agents, one per manufacturer, and **eleven stalled**. Three
finished. The stall has never been retried, and the METHOD ruling at W25-R2 says sourcing
is direct rather than by agents, so retrying it means a person-paced card.

| Manufacturer | Products | State |
|---|---|---|
| Caparol | 15 | unattempted; `www.caparol.md` answers 200, and W23-04 already records a permission for Caparol |
| Baumit | 5 | unattempted; `baumit.md` answers 200 |
| FAWORI, NOVOTERM, KREISEL, Ceresit, ISOMAT, STANCOLAC | 1 each | unattempted |
| SWEETONDALE | 2 | attempted, host failed TLS certificate verification |
| IZOVAT | 1 | unattempted |

That is **29 products**, counted from `content/catalog-products.json` with the filled, the
measured-and-refused and the Russian-domain ones taken out. Caparol alone is 15 and
carries its own permission already. At the rate this card measured, most of them will clear a 450px floor.

  (a) **A card, W25-03e, after the wave's current order.** Recommended. It is ordinary
      W25-02 work at the settled floor, direct and unagented, and it is the biggest single
      block of catalogue slots left.
  (b) **Fold it into W25-05** and generate them instead. Not recommended: these
      manufacturers publish real pack shots, and W25-R2 already prefers a photograph.
  (c) **Leave them.** They stay grey.

**Recommended: (a).** No default is shipped; nothing here changed the tree.

## Q-W25-09 · The gate runner lives in a scratch directory, which is why the count went stale · **DEFAULT SHIPPED at W25-03d, option (b)** · OPEN for ratification · opened 2026-09-21 (W25-03c)

**Shipped: `scripts/run-gates.js`, which READS `.github/workflows/quality.yml` and runs
exactly the steps it finds.** Option (b) below. It was written after the habit failed a
second time inside one session: W25-03c's card wrote the runner out in full, and the very
next card's attempt to add gate 23 to it silently did not apply, and the run reported 21
when `quality` carried 22. A list that is copied is a list that goes stale, so the copy is
gone.

Three arms watched: a planted failing step takes the runner to exit 1 and names it; a
`quality.yml` whose `steps:` key it cannot find exits 1 rather than reporting "0 of 0";
and the real workflow is clean immediately before and after both (R-AB).

**It is still open, for your ratification only**: it is a new script that no ruling asked
for, and it decides by itself that `actions/checkout`, `setup-node` and the pinned
Lighthouse install are not gates. It prints each of those skips with its reason on every
run rather than dropping them quietly.

The full note is on the card. The short of it: the list of gate commands a terminal runs
locally has never been committed. It is retyped from `quality.yml` each session, it went
stale when gates 21 and 22 landed, and a board card then asserted coverage it did not have.

  (a) **Commit `scripts/run-gates.sh`**, generated from nothing and maintained by hand
      beside `quality.yml`. Cheap, and it can drift from `quality.yml` in the same way.
  (b) **Commit `scripts/run-gates.js` that READS `quality.yml`** and runs exactly the
      steps it finds, in order, each its own process, printing the count. It cannot drift,
      because there is one list and CI owns it. It parses a small, fixed shape of YAML with
      no dependency, which this repo has done before for other formats.
  (c) **Leave it.** The card writes out its runner and the owner reads the count.

**Recommended: (b).** The defect was a second copy of a list going stale, and (b) deletes
the second copy. It also makes "N of N" a number the repo computes rather than one a
terminal remembers.

## Q-W25-10 · Three ceramic plates are in none of the three catalogues · OPEN · opened 2026-09-21 (W25-03d)

**Shipped default: they carry `brand_hidden`, so the site names no manufacturer for them.**
That is W25-R3's rule applied, and it is the safe state: the site has stopped making a
claim it cannot support. They stay placeholders under W25-R4.

You answered Q-W25-05 with "Ecofasad and Kordeko". That answer was given when the residual
looked like 37 plates. The finished walk puts the residual at **3**, and none of the three
is in either catalogue:

| Slot | Name | Phomi | Ecofasad | Kordeko |
|---|---|---|---|---|
| `CAT-0051` | Elsa Black Grey | no, "Elsa" appears nowhere on the site | no, Ecofasad names nothing | no |
| `CAT-0060` | Sandstorm | no, Phomi has "Sandstone", a different word | no | no |
| `CAT-0077` | H06 | no, Phomi has H01, H02, H05, HB01, HB06 and no H06 | no | no |

**Ecofasad is a special case and it is not a miss.** Ecofasad publishes 102 flexible stone
and marble textures and gives none of them a name: they are `rock-1808`, `marble-1801`,
numbers with a material prefix. No plate name can match one, in either direction. Matching
by eye would mean comparing a photograph of a plate we have no photograph of.

  (a) **Leave them hidden and send them to W25-05** to be generated from their own names
      and colours. Recommended. Three cards, no claim made, and the AI prompt pack already
      exists for exactly this.
  (b) **Tell me who makes them**, if the client knows. Then they are ordinary packshot work.
  (c) **Ask the client to identify them by picture.** They are three products; a photograph
      of each from the shop would settle both the manufacturer and the packshot at once.
  (d) Drop the three records. Not recommended: they are products you sell.

**Recommended: (a), with (c) worth one message to the client.** Nothing is blocked either
way: the default is already shipped and the site is no longer claiming a manufacturer it
cannot support.

**AMENDED (W25-05, 2026-09-21): option (a) is not available and I was wrong to offer it.**
W25-R2 rules that **no AI image goes on any named tile product**, and these three are named
tile products. W25-05's prompt pack therefore holds all 63 remaining ceramic plates,
including these, and generates nothing for them. The live options are **(b)** and **(c)**,
and (c) is the one that settles the picture and the manufacturer in the same message. Until
then they stay grey with no brand line, which is still the shipped default and is still
correct.

## Q-W25-11 · Kordeko sells exactly what the 64 `elemente-decorative` records are · OPEN · opened 2026-09-21 (W25-03d)

**Nothing was done about this and nothing is blocked on it.** It is an observation from
walking Kordeko for a different reason, and it is worth one line of your time because it is
64 empty slots.

`elemente-decorative` holds 64 records named "Element decorativ RED 01" through "RED 64",
branded `RedConstruct` with `brand_hidden` already set. W25-05 currently owns them on the
grounds that they have no manufacturer to fetch from.

**Kordeko's catalogue is 59 cornices, mouldings, window cornices and post caps**, the CL,
CR, M, Z and Kub series, each with its own photograph on `kordeko.com`. That is the same
product family, from a Moldovan manufacturer, at the size the 450 floor accepts.

**Why I did not act on it.** The records are named "RED 01", which matches nothing by name,
and matching a moulding profile by eye across 59 candidates is a judgement about which
product the shop actually sells. That is yours, not mine, and W25-R4 forbids a near match.

  (a) **Ask the client whether the RED elements are Kordeko**, and if so for the mapping.
      Recommended: one question, potentially 64 slots.
  (b) **A card that puts the 59 Kordeko photographs in front of you** beside the 64 records,
      for you to pair by eye. More of your time, no client needed.
  (c) **Leave them to W25-05** and generate them.

**Recommended: (a).** If the answer is no, (c) stands and nothing is lost.

## Q-W25-12 · 89 of the 126 prompts are for products whose appearance is not in the records · **ANSWERED 2026-09-21 (W25-R9): option (d), no AI image where the appearance is not in the records** · opened 2026-09-21 (W25-05)

**Shipped default: the prompts are written and every one of the 89 is marked `appearance:
not in the records` in the pack.** Nothing is generated and nothing is installed by this
card, so the default costs nothing and decides nothing.

W25-R3 permits a generated image on a product slot, and W25-05 wrote 126 prompts on that
permission. For 37 of them the ledger row or the record describes what the thing is: a
metal slatted fence, a roll of diffusion membrane, a cone of adhesive powder. **For 89 it
does not.**

| Group | Entries | What the records actually carry |
|---|---|---|
| Elemente decorative | 64 | a shop code (`RED 17`), "pentru fațadă", and a price per metre. 45 distinct prices and **no profile, no dimension, no shape** |
| Sisteme de iluminare | 25 | a bare OEM code (`K1207`, `GMD-881F`) and sometimes a colour temperature. No shape, no material, no finish |

**Why this is a question and not a decision I should take.** A moulding and a lamp are both
chosen by how they look. A generated picture of `RED 17` is a picture of **a** moulding, not
of that one, and a buyer could order the wrong profile from it. That is the harm W25-R4
guards against for photographs. W25-R3 permits it for generated images on product slots, so
the owner has already ruled that the trade is acceptable in principle; what he has not seen
is that it applies to 89 of 126 entries rather than a few.

  (a) **Generate all 89 anyway.** Fills the most slots fastest. Each card then shows an
      illustrative picture of the right kind of product.
  (b) **Photograph them in the shop.** They are 89 physical items you stock. A phone
      photograph on a plain surface clears the 450 floor easily, it is the real product, and
      W25-R1's origin problem does not arise because it is your own photograph. Slower, and
      it needs a person and an hour.
  (c) **Split it.** Generate the 25 lamps, where a generic outdoor lantern is close enough
      to be useful, and photograph the 64 mouldings, where the profile IS the product.
  (d) **Leave all 89 grey** and generate only the 37 the records describe.

**Recommended: (c).** The 64 mouldings are the case where a wrong picture actively misleads
a buyer, and they are also the group Q-W25-11 may solve outright if they turn out to be
Kordeko, who photographs all 59 of theirs. The 25 lamps are the case where an illustrative
picture is honest enough, because a plain outdoor wall lantern is what the customer is
buying.

## Q-W25-13 · One Phomi picture is the correct picture for eleven more cards, and the rule you ratified this morning forbids it · OPEN · opened 2026-09-21 (W25-07)

**Shipped default: the picture went on the first record of each group and the other eleven
cards stay grey.** Nothing wrong is published. Eleven cards are simply as they were.

Gate 19 holds "two filled slots must not stand on the same picture", which you ratified
today. It is the machine form of "a family image never fills a colour-variant card", and it
has now decided something on real data for the first time.

**What it caught, and why it is not what the rule was written for.** Ten Phomi swatches are
each the correct picture for more than one of our records, because **the records are the
same tile face in different sheet sizes**:

| Phomi picture | Our records | Sizes and prices |
|---|---|---|
| Loki Mountain Light Grey | `CAT-0044`, `CAT-0045`, `CAT-0086` | 1200x600 at 669 lei, 1200x600 at 529 lei, 2700x1200 at 3.486 lei |
| Portoro | `CAT-0069`, `CAT-0099` | de la 680 lei, and 2400x1200 at 3.806 lei |
| Medium Grey | `CAT-0056`, `CAT-0078` | 1200x600 at 683 lei, and de la 602 lei |
| Blue Grey | `CAT-0046`, `CAT-0070` | 1200x600 at 632 lei, and de la 998 lei |
| Ink Dyed, Sunis White, Andes Yellow, Veil Dark Grey, Sairo Off White, Roman Red | two records each | |

**Phomi publishes one swatch per colour, not one per size.** A 1200x600 sheet of Portoro and
a 2400x1200 sheet of Portoro are the same surface photographed once. So the same picture
genuinely is the right picture for both, and the rule is refusing a correct install.

The rule was written to stop a FAMILY image standing in for 33 different colours. It cannot
currently tell that case apart from this one, because it compares files rather than
products.

  (a) **Let gate 19 compare the product, not the file.** Two filled slots may share a
      picture when their catalogue records carry the same product name and differ only in
      the size variant; otherwise the refusal stands exactly as now. Eleven cards fill
      today. **Recommended.** It keeps the rule doing the job it was written for and stops
      it doing a job it was not.
  (b) **Merge the eleven records into their siblings** as size variants of one product.
      Cleaner catalogue, and the price line becomes "de la" across sizes. It is a product
      decision about what you sell and how, so it is yours, and it is a bigger change than
      it looks: eleven records, eleven slots and eleven prices.
  (c) **Leave them grey.** The rule stays absolute and eleven cards stay as they are.

**Recommended: (a).** It is one condition on an existing assertion, it is testable, and it
is the difference between "one picture, several products" and "one picture, one product in
several sizes". (b) is worth doing eventually and is not urgent.

## Q-W25-14 · Four manufacturers cannot be found, and one is Russian-owned with a .com site · OPEN · opened 2026-09-21 (W25-08)

**Shipped default: all six products stay placeholders.** Nothing wrong is published and
nothing is blocked; this is about six catalogue cards.

### The four that cannot be found

| Product | Brand | What was tried |
|---|---|---|
| `CAT-0011` Vată minerală FAWORI | FAWORI | `fawori.com.tr` and `www.fawori.com.tr` do not answer |
| `CAT-0012` Vată minerală Novoterm | NOVOTERM | `novoterm.md` and `novoterm.ro` do not answer |
| `CAT-0016` Adeziv Kreisel 215 | KREISEL | `kreisel.md` does not answer; `kreisel.pl` answers but has no page for Kreisel 215 |
| `CAT-0009` Vată minerală OBIO 165 | IZOVAT | `izovat.ua` answers; its product pages return 404 |

**These are attempted and not found, which is not the same as absent.** Each brand may have
a site under a name I do not know, and you may know it in one line.

  (a) **Tell me the site for any of them** and they become ordinary packshot work.
  (b) **Ask the client**, who buys from them and will have a contact.
  (c) **Photograph them in the shop**, which is also Q-W25-12's answer for the lamps.
  (d) Leave them grey.

**Recommended: (b) then (c).** Four products, one message.

### The one that is a decision, not a search

`CAT-0007` Polistiren Tehnoplex XPS Carbon and `CAT-0008` Vată minerală Thermowool Fas
Efect carry the brand **SWEETONDALE**, which is a trade name of **TechnoNICOL**, a Russian
group. Its international site is `technonicol.com`, a `.com`, and it lists an XPS CARBON
range.

**Two separate reasons I did not install from it, and you should rule on both:**

1. **W25-R6 forbids "Russian domains".** `technonicol.com` is not a Russian domain by its
   name, and it is the site of a Russian company. The rule's words and the rule's intent
   point different ways here, and it is your call, not mine. The same question decided
   `CAT-0006` Penoplex, which stays grey because `penoplex.ru` is unambiguous.
2. **The product identity is not established.** Our records say "Tehnoplex XPS Carbon" and
   "Thermowool Fas Efect". TechnoNICOL's catalogue has a TECHNOPLEX family and a CARBON
   family and I could not establish that either of ours is a specific one of them. Under
   W25-R4 that is a near match and it stays a placeholder whatever the domain rule says.

  (a) **Both stay grey.** Recommended while (2) is unresolved, whatever you decide on (1).
  (b) **Rule that a `.com` site of a Russian company is allowed**, and I go back and settle
      the product identity first. If it settles, two cards fill.
  (c) **Rule that it is not allowed** and they join Penoplex permanently.

**Recommended: (a) now, and (c) if you want it closed.** Nothing fills today either way,
because the identity question stands on its own.

## Q-W25-15 · One row in 67 came back unrendered, and gate 9 has no median · OPEN · opened 2026-09-21 (W25-12)

**Shipped default: nothing. The site is fine and this is about the instrument.**

Section 12.0's run on `2df8033`, after #98 to #102 merged, was executed three times:

| Run | Result | `sub RU eps` |
|---|---|---|
| 1 | **FAIL, 1 unverified, 0 failed** | **UNVERIFIED, 900px, promoBar 0, productCards 0** |
| 2 | PASS, 0 unverified, 0 failed | VERIFIED, 3,464px |
| 3 | PASS, 0 unverified, 0 failed | VERIFIED, 3,464px |

**The page is not broken.** `/ru/catalog/termoizolatie/polistiren-expandat/` answers 200 with
37,555 bytes of the right template on the edge, its RO twin passed in all three runs, and
the two clean runs agree to the pixel. A 900px page with no promo bar and no product card is
what a page measures **before its stylesheet has applied**: the read happened early, once.

**Why it matters anyway.** Gate 9 is the gate the owner asked for by name, and it is the one
that finds what the other twenty-three cannot. **A single run can produce a false red on one
row in 67**, and a false red costs as much trust as a false green. W24-09 already learned
that with 51 spurious `build-sha mismatch` rows from a short sha.

**Gate 5 has already solved this exact shape.** W21-02 made Lighthouse audit each page three
times and judge the MEDIAN of each category, because one noisy run could fail the build and
two agreeing bad runs still should. `verify-live.js` reads each page once.

  (a) **Re-read only a page that comes back unverified**, up to twice, and report all
      readings. Cheap: it costs nothing on a clean run, which is almost every run, and it
      cannot hide a real failure because a real failure reproduces. **Recommended.**
  (b) **Read every page three times and judge the median**, exactly as gate 5 does.
      Strictly better evidence and roughly three times the wall clock on 67 pages.
  (c) **Leave it** and re-run by hand when a single row comes back odd, which is what
      happened here.

**Recommended: (a).** It is the smallest change that removes the false red, and it keeps the
run honest by printing every reading rather than the best one. (b) is right if gate 9 ever
starts failing for reasons nobody can reproduce.

## Q-W25-16 · The two CT80F records are not identical, so W25-R13 blocks the card · OPEN · opened 2026-09-21 (W25-15)

**Nothing was changed. W25-R13 says so.**

> Duplicate records: if name, unit and price are identical, drop one record and keep the URL
> of the older id. If anything differs, block with a question quoting both rows.

**Three of the three differ.** Both rows, quoted in full from
`content/catalog-products.json`:

### `CAT-0002`, id `f3d-1858`, slug `polistiren`

| Field | Value |
|---|---|
| name.ro | `Polistiren expandat CT80F` |
| name.ru | `Экструдированный пенополистирол КТ80Ф` |
| brand | `Caparol` |
| variant.ro | `10mm, 20mm, 30mm, 40mm, 50mm, 60mm, 70mm, 80mm, 90mm, 100mm` |
| variant.ru | `1000 x 500 mm, 1000 x 500 mm` |
| price | `7,62 lei - 76,20 lei` |
| source | `https://fatade3d.md/produs/polistiren/`, captured 2026-09-19 |
| picture | **filled** at W25-08, from `caparol.md` |

### `CAT-0005`, id `f3d-3283`, slug `ct-80-f-polistiren-expandat`

| Field | Value |
|---|---|
| name.ro | `CT 80 F - Polistiren expandat` |
| name.ru | `CT 80 F - Пенополистирол` |
| brand | `Caparol` |
| variant.ro | `10 mm, 20 mm, 30 mm, 40 mm, 50 mm, 60 mm, 70 mm, 80 mm, 90 mm, 100 mm` |
| variant.ru | `1000x500x30 мм` |
| price | `6,50 lei - 65,00 lei` |
| source | `https://fatade3d.md/produs/ct-80-f-polistiren-expandat/`, captured 2026-09-19 |
| picture | **grey**, held by the one-picture-one-card rule |

### What differs, precisely

| | `CAT-0002` | `CAT-0005` | Same? |
|---|---|---|---|
| **Name** | Polistiren expandat CT80F | CT 80 F - Polistiren expandat | **no**, the same product written two ways |
| **Unit** | RU says `1000 x 500 mm` twice | RU says `1000x500x30 мм` | **no**, and the second names a thickness |
| **Price** | **7,62 to 76,20 lei** | **6,50 to 65,00 lei** | **no**, about 15 percent apart |

**The price is the one that matters.** The site currently shows the same insulation board at
two prices on the same page, and I cannot tell you which is right: the RO variant lines are
the same ten thicknesses, so they are not obviously two different pack sizes, but the RU
line on `CAT-0005` names a single 30mm board, which would explain a different price and
would mean these are **two products, not one**.

  (a) **They are one product. Keep `CAT-0002`** (the older id, per the ruling) with its price
      and its picture, and drop `CAT-0005`. The lower price disappears from the site.
  (b) **They are one product, but the price to publish is `6,50 to 65,00`.** Keep the older
      id and its URL, move the price across, drop `CAT-0005`. The ruling says keep the older
      id's URL, and it does not say which price is current; you do.
  (c) **They are two products**: one sold by the sheet in ten thicknesses, one a 30mm board.
      Then nothing is dropped, and `CAT-0005` needs its own name so a visitor can tell them
      apart, and its own picture.
  (d) Tell me the current price list and I re-derive both rows from it.

**Recommended: (b) if there is one product, (c) if there are two, and I cannot tell which
from the data.** That is precisely why the ruling says to stop here. **One sentence from you
closes it.**

**Nothing is blocked behind this.** W25-15 stops, W25-16 continues, and the site is
unchanged.


## Q-W25-17 · Four metal tile models and four Dasterum tiles carry the same four names

**Raised W25-19, 2026-09-21. Nothing is blocked: the dispatch names both sets and both are
on the page. This records what a visitor now sees, so the decision is made against it.**

The dispatch specifies the Tigla metalica filter as **"Imperlux models plus Dasterum
tigla"**, and both are there. They are the same four profile names from two suppliers:

| Card | Source of the record | Price it prints |
|---|---|---|
| Monterrey (`ACTM-01`) | `content/tigla-metalica.json`, the tile page's own models | De la 184 lei/m² |
| Țiglă metalică Monterrey (`CAT-0224`) | Dasterum, under W25-R7 | De la 110 lei |
| Valencia (`ACTM-02`) | the tile page's models | De la 184 lei/m² |
| Țiglă metalică Valencia (`CAT-0225`) | Dasterum | De la 110 lei |
| Kascad (`ACTM-03`) | the tile page's models | De la 189 lei/m² |
| Țiglă metalică Kascad (`CAT-0227`) | Dasterum | De la 110 lei |
| Țiglă metalică modulară (`ACTM-04`) | the tile page's models | De la 188 lei/m² |
| Țiglă metalică modulară (`CAT-0226`) | Dasterum | De la 169 lei |

**Monterrey, Valencia, Kascad and modulară are generic profile names** that every metal tile
maker in the region uses, so two suppliers publishing the same four names is ordinary. What
a visitor sees on one filter is **two prices for what reads as the same tile**, 184 against
110, and nothing on the card says why.

  (a) **Leave it.** Eight cards, two suppliers, and the difference is grade: the tile page's
      models are Standart and Premium at 0,45 and 0,50mm with a 10 or 20 year warranty, and
      the Dasterum rows state no grade at all. A visitor who presses either card gets a
      quote and a person answers it. **This is what ships.**
  (b) **Name the supplier on the card.** Puts a brand line on eight cards. The tile page's
      models have no published supplier in this repo (Q-W14-08 has been open since wave 14),
      so this needs that answer first.
  (c) **Drop one set from the filter.** Either the four model cards, leaving the filter as
      the Dasterum four, or the four Dasterum rows. One supplier's range disappears.
  (d) **Merge them into four cards** with both prices. Needs a card shape that does not
      exist and a rule about which price leads.

**Recommended: (a) until Q-W14-08 is answered, then (b).** A supplier name is the thing that
makes two prices legible, and this repo cannot print one for the tile page's models yet.

**Shipped default: (a).**

## Q-W25-18 · W25-R19's premise is gone: imperlux.md has no 4-tile sections any more

**Raised W25-24, 2026-09-22. BLOCKS the image half of that card. Everything else in it
shipped.**

W25-R19 says the eight hub tiles are to be filled with *"the exact images imperlux.md shows on
its Acoperisuri and Garduri 4-tile sections"*. **Both of those sections have been rebuilt since
the wave 14 audit and neither exists today.** Measured on 2026-09-22 by fetching and rendering
both pages:

| Our tile label | Times it appears on the matching imperlux page |
|---|---|
| Țiglă metalică | 1, inside a meta description |
| Rocă vulcanică | 0 |
| Calculează prețul acoperișului | 0 |
| Reduceri | 1, inside a promo line |
| Garduri tip jaluzele | 1, as the page's `h1` |
| Calculează prețul gardului | 1, as a calculator heading |
| Modele de garduri | 0 |
| Prețuri și oferte | 0 |

**What is there instead.** `/acoperisuri/` now has a **five**-tile product section, "Produsele
noastre": Țiglă metalică, Țiglă cu rocă vulcanică, Țiglă ceramică, Șindrilă bituminoasă,
Sisteme pluviale. `/garduri/` has a hero, a three-card "Lucrări realizate" strip and an
"OFERTE LIMITATE" block of four model cards.

**Two of our eight have an obvious counterpart and six do not.** `ACOP-01` matches
`images/categories/tigla-metalica.png` and `ACOP-02` matches
`images/categories/roca-vulcanica.png`. There is no tile image for a price calculator, for
discounts, for fence models or for fence prices, on either page.

**And the fence block is a section this site may not copy from.** "OFERTE LIMITATE" carries a
live countdown, `-17%` and `-10%` badges, struck prices and "Stoc limitat: doar 3 modele la
preț promoțional". R-X forbids every one of those here and `scripts/check-scarcity.js` gates
it; W25-R8 forbids copying the struck figure. The images inside those cards are the same
1296x1600 louvre renders W25-18 already installed on the eight `GARD-` model cards, so taking
them again would also be one picture on two slots.

  (a) **Take the two that match and leave six grey.** `ACOP-01` and `ACOP-02` from the
      category tiles, under `owner_override_imperlux`, and the other six wait. Honest, and
      keeps the ruling's "exact image" condition intact for the two it can be met for.
  (b) **Widen the ruling to "an image imperlux.md publishes for that subject"** and let this
      terminal choose eight, each named in the review file. Fills all eight; the choice is
      this terminal's, which is the thing W25-R19 was worded to prevent.
  (c) **Send the six to the prompt pack**, which is where they were before W25-R19, and take
      the two that match. Then `ACOP-03`, `ACOP-04`, `GARDB-01` to `GARDB-04` are generated
      images and the four `ACOP-` prompts are already written.
  (d) **Apply W25-R20 to them**: these are not product pictures, but the same order would
      work, a search for the subject at 450 or more, flagged `google_pick`.

**Recommended: (a) now, then (c) for the six.** The two that match are unambiguous and cost
nothing to be wrong about. For the other six, a generated tile was the plan before this
dispatch, the prompts exist, and a tile is decoration where an invented picture is allowed:
W25-R3 permits a generated image on a hub slot by name.

**Shipped default: nothing.** All eight stay grey until you answer, and no image was taken
from either page. **Nothing else in W25-24 is blocked**: the tile links, the tile audit and
the new gate all shipped.
