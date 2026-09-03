# Release notes

Status of the Rapid Construct site as built. Read this first if you are coming
back to the project cold.

**Last updated:** 2026-08-28 (phase 2)
**State:** ready for client review. Not production.

---

## What is real

All page copy. Every string in `locales/ro.json` and `locales/ru.json` was
pulled from the previous build at `rapidconstruct-web.vercel.app` (`/ro` and
`/ru`) and re-laid-out. Nothing was written from scratch.

That covers: nine service descriptions, six portfolio entries, three
testimonials, six trust points, the four stats, all ten work types in the form
including `Altceva`, the standing offer line, the coverage line and full contact
details. Both locales, 209 keys each, key sets identical by construction.

The three testimonials are the real ones: **Ion Miron, Maria Oprea, Andrei
Condrea**. The design files shipped by Claude Design invented three others
(Andrei Ciobanu, Maria Rusu, Victor Munteanu) and six fabricated portfolio
projects. None of that is in the repo, let alone the build.

Logos and favicons are real files in `public/`.

---

## What is a placeholder

### Supplier logos (marquee)

Eight placeholder tiles under the hero. To add a real one:

1. Drop the logo at `public/img/suppliers/<id>.svg` (or `.png`), sized to fit a
   160x80 tile. SVG preferred.
2. In **both** locale files, set `suppliers.<n>.name` to the supplier's name and
   `suppliers.<n>.id` to the filename stem.
3. Rebuild. The tile renders the image instead of the label.

The strip duplicates the list to loop seamlessly, so the template renders each
entry twice. Adding an entry means adding it to the array only; the duplication
is automatic in the template.

### Service card illustrations (9)

Not photographs and not in the photo manifest. Drop each finished SVG at
`public/img/services/<id>.svg`, overwriting the placeholder. IDs are the nine
`svc-*` names. `node scripts/gen-service-svgs.js` regenerates placeholders and
will not overwrite a real illustration.

### All 13 photo slots

Every photo on the site is a generated placeholder: a flat `#F2F2F2` JPG at the
manifest's exact pixel size, with the slot ID and aspect ratio printed in the
middle. One hero panel, five process steps, six portfolio covers, one og-image.
The count went 21 -> 13 in phase 2: the nine `svc-*` photo slots became SVG
illustrations and `hero-panel` was added.

**To swap in a real photo:** drop the raw file into `photos-raw/` named by slot
ID, at any size, then:

    node scripts/process-photos.js && node build.js

That centre-crops to the slot's ratio, writes a 1x and a 2x into `public/img/`,
compresses each under 400KB, warns about anything below the 1600px long-edge
minimum or shot in portrait, and lists which slots are still on placeholders.
It exits non-zero if a file could not be squeezed under budget. No code
changes: the `<img>` tag, its `srcset`, its dimensions and its alt text are
already in place.

A pre-cropped file can also just be dropped straight into
`public/img/<slot-id>.jpg`, but then you owe it an `@2x` too, or the browser
requests one that does not exist.

`node scripts/gen-placeholders.js` regenerates placeholders if a slot is added.
It will **not** overwrite a real photo: it compares each file against the size
recorded in `public/img/PLACEHOLDERS.json` and skips anything that no longer
matches. Pass `--force` only if you actually want to blow away real photos.
The generator needs macOS (`sips`); CI never runs it, because placeholders are
committed.

Photo specs and the shot list are in `docs/RC-PHOTO-MANIFEST.md`. Selection
happens against the finished layout, with Mihai, per master plan section 7.

### The form is not wired

The markup is complete and looks finished, but with no `WEB3FORMS_KEY` set at
build time the form is in **demo mode**: it validates name, phone and consent,
then shows an inline notice ("Formularul se activează la publicarea
site-ului.") and posts nowhere. Verified with network spies: zero outbound
requests. This is deliberate, a failed POST in front of the client is worse than
an honest placeholder.

**To arm it:** sign up at web3forms.com with `rapidconstructmd@gmail.com`, then
either `WEB3FORMS_KEY=<key> node build.js` locally, or add `WEB3FORMS_KEY` as a
GitHub Actions secret and the Pages build picks it up on the next push. The
build prints which mode it used.

---

## What is pending

| Item | State |
|---|---|
| **Heading font** | **Resolved: Inter stays.** Unbounded is no longer loaded. `--font-heading` remains a variable, so a future family swap is still one value in `src/styles.css` plus adding it to the font link. |
| **Photos** | All 13 photo slots. Selection session with Mihai still to happen. |
| **Service illustrations** | Nine SVGs from Claude Design, placeholders in place. |
| **Hero panel illustration** | `hero-panel`, Ivan is producing it. |
| **Supplier logos** | Eight placeholder tiles, real logos after the client meeting. |
| **Form endpoint** | No Web3Forms key yet. Deliberate until the visual is approved. |
| **Production host** | GitHub Pages is for client review only. Hostinger is the production target. |
| **Privacy page legal fields** | `/confidentialitate/` and `/ru/konfidentsialnost/` exist and are linked, but the registered company name, IDNO and retention period are visible `TODO:` placeholders. **While any remain, both pages are `noindex` and excluded from `sitemap.xml` automatically.** Fill them in the `privacy` block of both locale files and the flags clear themselves. |
| **Production domain** | `SITE_URL` defaults to `https://rapidconstruct.md`. If the real domain differs, canonical, hreflang, sitemap and og: URLs are all wrong. Confirm before the Hostinger move. |
| **Portfolio lightbox** | Not built. The manifest's 18 optional `port-0N-a/b/c` extras are unused. |

---

## Building

    node build.js                                  # root build, for Hostinger
    BASE_PATH=/rc-website node build.js            # GitHub Pages build

Pages built, per locale: the landing page, a 404, and the privacy policy.
`dist/.htaccess` carries `ErrorDocument 404` and cache lifetimes for Apache;
GitHub Pages ignores it and finds `/404.html` itself.

`BASE_PATH` prefixes every asset, stylesheet, script and inter-locale link.
Default is empty, which is what a domain root wants. The Pages workflow sets it
automatically; you never set it by hand for production.

`build.js` refuses to write output if the two locales disagree on keys, if any
string is empty, if the template references a key that does not exist, or if a
`{{ }}` placeholder survives.

Preview locally:

    node build.js && cd dist && python3 -m http.server 8000
    # then open http://localhost:8000/  (RO)  and  http://localhost:8000/ru/

Check every internal link and anchor resolves:

    node build.js && node scripts/check-links.js

24 pages, 1,368 hrefs and srcs, 0 dead. Exits non-zero if that stops being
true, so it can be used as a gate.

---

## Constraints that must not drift

From `docs/RC-WEBSITE-MASTER-PLAN.md`. The previous build was rejected for
breaking the first two.

- Desktop page height under 9,000px. Currently **8,646px RO / 8,860px RU**
  on `main`, and **8,883px RO / 9,096px RU** on the unmerged wave 12 branch.
  The rejected build was 13,312px. Wave 6's cap was tighter still, 8,700px RO,
  and all three cards landed at 0px.

  **Corrected 2026-09-03.** This line read "8,504px RO / 8,774px RU" from wave 8
  until wave 12, and both figures were wrong by 142px and 86px. It is not drift
  from waves 9 to 11: rebuilding `b4bf763`, the wave 9 merge, and measuring it
  the same way gives 8,646 / 8,860 as well. The error mattered — it advertised
  196px of RO headroom where there were 54px, which is most of why wave 12
  finished over budget. The wave 6 and wave 8 gate tables below are left as they
  were recorded; only this current-state line is corrected.

  Measure it the same way every time or the number moves by 154px:
  settled height, all reveals applied. An unrevealed `[data-reveal]` is
  translated 16px down, which inflates `scrollHeight` until it fires.

  The number is width-invariant across the desktop range — identical at 1280,
  1350, 1440, 1512, 1600 and 1920 — because the container caps at 1200px. What
  changes it is measuring before the reveals settle, not the window size.

      // in the console, at a desktop width
      document.querySelectorAll('[data-reveal]').forEach(n => n.classList.add('is-revealed'));
      // wait ~1.5s for the staggered transitions, then:
      document.documentElement.scrollHeight
- Exactly three background values: `#FFFFFF`, `#F2F2F2`, `#141414`. `#141414`
  appears exactly twice, on the stats band and the footer. No gradients, no
  fourth off-white, no translucent overlays.
- Zero motion. No scroll animation, parallax, fade-in, count-up numerals or
  auto-advancing carousels.
- No section over 1,400px except the services and portfolio grids, which are
  agreed exceptions.
- Header opaque, nav items never wrap. The outer bar is 96px desktop / 80px
  mobile and the inner pill is 64px, compressing to 56px on scroll (52px
  mobile). `<body>` carries a matching constant spacer.
  (Corrected 2026-08-31: this line read "72px (64px compressed)", which was
  stale by three numbers.)

## Motion (phase 2)

Motion is permitted but never touches scroll. The rules, all enforced:

- No wheel, touchmove or scroll handler ever calls `preventDefault`. Both scroll
  listeners are registered `{ passive: true }`, so they cannot block scrolling
  even in principle.
- Reveals use `IntersectionObserver` and `unobserve` on first fire, so they
  never repeat on scroll back up.
- Reveal 320ms / 16px, hover 200ms / 4px, stagger capped at 6 items (360ms).
- Nothing in the header or hero animates.
- The header is `position: fixed` with a constant spacer on `<body>` (96px
  desktop, 80px mobile). It was sticky, but a sticky header keeps its box in
  flow, so compressing the pill 64px -> 56px shortened the document and shunted
  every section up mid-scroll. Fixed makes the compression purely visual.
  (Corrected 2026-08-31: the spacer and the compression figures were stale.)
- `prefers-reduced-motion: reduce` disables every effect. Reveals render final,
  hover travel is removed, the marquee stops dead, the header does not animate.

## Lighthouse baseline

Re-measured 2026-08-31 after wave 6, locally against `dist/` on the desktop
preset, with every photo slot still on a placeholder or an SVG fallback:

    node build.js && cd dist && python3 -m http.server 8765
    npx lighthouse@12 http://localhost:8765/ --preset=desktop \
      --chrome-flags="--headless=new"

| | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| RO homepage | **98** | 100 | 100 | 100 |
| RU homepage | **100** | 100 | 100 | 100 |
| Service page | 100 | 100 | 100 | 69 |

Re-measured **live** on the Pages URL after wave 8, 2026-09-01. RO dropped 100 ->
98 when the hero panel became a photograph: it is now the LCP element, and LCP
went 0.7s -> 1.0s. Still clear of the 95 floor. It should recover when the real
2800px hero source replaces the 720px interim file, which is currently upscaled
3.89x. See DECISIONS.md, W8-03.

The service page's SEO 69 is the W3-02 gate working: `is-crawlable` fails
because the page is deliberately `noindex` until one of its projects has a real
cover photograph. It clears itself when a photo lands.

The 2026-08-28 baseline on the Pages URL was 100 across the board on both
homepages, unchanged.

Accessibility reached 100 by raising button text to 19px (clearing the WCAG
large-text threshold, so 3:1 applies) and darkening the category chip fill to
`--brand-dark`. The approved `#F65308` is untouched on buttons.

See `DECISIONS.md` for where this build departs from the master plan and why.
The short version: `--brand` is `#F65308` and `--ink` is `#1A1A1A`, sampled from
the logo, because the plan predates the logo file.

---

## Wave 6, 2026-08-31

Three cards, RC-032 to RC-034, plus one follow-up fix. Every gate green.

**W6-01 · Supplier marquee.** Eight placeholder chips became twelve named
brands (TechnoNICOL, Bilka, Novatik, IKO, Swisspor, Knauf, Baumit, Ceresit,
Weber, Ytong, Holcim, Bosch) on white `#FFFFFF` logo tiles, 200x80. One
full-colour file per brand goes at `public/img/suppliers/<slug>.svg` or `.png`;
until one lands the tile shows the brand name as text, per brand. Hover and
keyboard focus both restore full colour and pause the loop, in pure CSS. The
duplicate half of the track is `aria-hidden` with no `tabindex`, so it is 12 tab
stops rather than 24. Text on the white tile is 17.40:1.

**W6-02 · Project model.** 10 projects became 54, six per service. The 44 new
ones are stubs with empty fields and render nowhere, so the site is unchanged.
Seven new optional fields per project (`location`, `year`, `work_type`,
`area_sqm`, `duration`, `main_materials`, `challenge`), each omitted on its own.
`build.js` now refuses to build if a project that renders has no cover file.

**W6-03 · Image slots.** `hero-panel` and the nine service illustrations became
photo slots, 4:3. The SVGs stay as per-slot fallbacks: the first service to get
a jpg shows a photo while the other eight still show SVGs. Every build prints
which slots are on fallback. All 10 today.

| Gate | Result |
|---|---|
| Homepage RO under 8,700px | **8,504px** |
| Homepage RU under 9,000px | **8,774px** |
| Lighthouse performance >=95, both locales | **100 / 100** |
| Lighthouse accessibility 100, both locales | **100 / 100** |
| Marquee hover pause does not touch scroll | Pure CSS `animation-play-state`. No wheel, touch or scroll handler exists |
| `prefers-reduced-motion` disables every effect | Animation none, transform none, logos full colour, duplicate tiles hidden |
| No new colour values beyond `#FFFFFF` tiles | One removed (`#1F1F1F`), none added |
| Dead links across all pages | **0**, over 24 pages and 1,368 hrefs and srcs |

Photo manifest: 51 slots -> 105. The shooting plan is unchanged at 11
photographs on the critical path; the growth is reserved slots on projects that
have no content yet.

---

## Wave 8, 2026-09-01

Wave 7 deployed and verified live; two cards of new work; one long-standing bug
found and fixed. Everything below is measured **on the live Pages URL**.

**W8-01 · Wave 7 deployed.** All nine service cards serve photographs on both
homepages and on all 18 service pages, every asset 200. Zero SVG service
illustrations referenced anywhere.

**W8-02 · No duplicate artwork exists.** The premise did not hold, so nothing was
changed. Exactly nine `svc-*.png` exist on the machine, all in `photos-raw/`,
where W7-02 moved them.

**W8-03 · Hero panel photograph**, on a **provisional** 720px floor for that one
slot. Upscaled 1.94x to the 1x and 3.89x to the 2x. Soft at retina but it ships.
The `@2x` is 369KB of interpolation at quality 32 and earns nothing; dropping it
is a one-word change. `hero-panel.svg` retained, referenced zero times.

**W8-04 · Eleven brands, header ratified, seam fixed.** Bosch dropped entirely.
The master plan's locked header decision was corrected rather than overridden.

**The marquee had jumped 12px every cycle since phase 1.** Flex `gap` gives n-1
gaps but the `-50%` keyframe needs a trailing one, so the seam was always short
by `gap / 2` — 12px at 8, 12 and 11 brands alike. Replaced with a trailing
`margin-right` on the tile. Verified live: track 4,928px, `-50%` lands at 2,464,
first duplicate at 2,464, **mismatch 0px**, and now exact at any brand count.

| Gate | Live result |
|---|---|
| Homepage RO under 8,700px | **8,504px** |
| Homepage RU under 9,000px | **8,774px** |
| Lighthouse performance >=95 | **98 RO / 100 RU** |
| Lighthouse accessibility 100 | **100 / 100** |
| Nine service images add no layout movement | CLS **0.002 RO / 0.013 RU** |
| Marquee loops cleanly at eleven brands | Seam mismatch **0px** |
| `prefers-reduced-motion` disables every effect | 5 blocks live; marquee stopped, logos full colour, duplicates hidden |
| Scroll never delayed, captured or hijacked | 2 listeners, both `{ passive: true }`; zero `preventDefault` on wheel, touchmove or scroll |
| No new colour values | **10**, unchanged |
| Dead links across all pages | **0**, over 24 pages and 1,404 hrefs and srcs |

One thing ships knowingly wrong: the hero panel alt text still describes an
illustration of a finished house while the photograph shows workers on
scaffolding. Half that fix is a provenance claim only the owner can make. See
`docs/QUESTIONS.md` Q-09.

---

## Wave 12 — promo bar and portfolio end tile (BUILT, NOT MERGED)

**Held on two gates.** The owner's gate: the wave does not merge until the
contact form is ARMED and verified by a real browser submission, which is still
blocked on `WEB3FORMS_KEY` (Q-W10-01, unchanged since wave 10). And a second one
this wave produced itself: both locales finish over the R-I budgets, which needs
a ruling (Q-W12-01).

**W12-01 · Portfolio end tile.** A seventh cell after the six project cards:
`100+` in `--brand` over a one-line caption, in the project card's own box.
Not a link, no `href`, nothing focusable, and it does not carry the `project`
class so the category filters leave it alone. Labelled rather than hidden: the
numeral is `aria-hidden` as a restatement, the sentence is exposed, confirmed on
the accessibility tree. The figure is entailed by the existing "500+ proiecte
finalizate" stat, not invented.

**W12-02 · Promo bar.** A static, in-flow strip beneath the fixed header and
above the hero, 44px desktop / 36px mobile as a hard cap, dark on `--brand`.
Data-driven from `promo.text` and `promo.endDate` in each locale file; the bar
is emitted only while the end date is in the future, so it is removed by editing
data rather than markup. Nothing animates, nothing is sticky, zero CLS.

**Rulings recorded:** R-H (a static strip above the fold is permitted, the
motion rules are unchanged) and R-I (budgets +44px while the bar is live).

| Gate | Result |
|---|---|
| Homepage RO under 8,744px | **8,883px — 139px OVER** |
| Homepage RU under 9,044px | **9,096px — 52px OVER** |
| Lighthouse performance >=95, both locales | **99 RO / 99–100 RU** |
| Lighthouse accessibility 100, both locales | **100 / 100** |
| Best practices / SEO | **100 / 100**, both locales |
| Promo bar contrast, shipped (`--ink` on `--brand`) | **5.10:1**, AA normal PASS |
| Promo bar contrast, white on `--brand` (not shipped) | **3.41:1**, AA normal FAIL |
| Promo bar height | **44px** desktop, **36px** mobile, exact |
| One line, unclipped, 320px to 1440px | **yes**, both locales, via `clamp(11px, 3.4vw, 13px)` |
| No animation on the bar, any viewport or motion preference | `animation-name: none`, `transition-duration: 0s`, `transform: none`, `position: static` |
| Promo bar CLS contribution | **zero** — 0.0022 RO unchanged vs control, 0.0126 → 0.0118 RU |
| Scroll never delayed, captured or hijacked | unchanged; no handler added |
| New colour values | **zero** — no hex or `rgba()` in the diff |
| Dead links | **0** of 1,524 checked across 25 pages |
| Upscaled variants | **zero**, unchanged |

Heights were measured at 1440px CSS, settled, against a control build of `main`
at `d2c2023` on the same machine and server, so the cost of each card is
attributed rather than inferred: the bar is 44px, the end tile is 193px, and the
bar alone would have left both locales inside budget at 8,690 / 8,904.

**A measurement note worth keeping.** Lighthouse performance first read 69 on
this build. It reads 99 on an untouched `main` served the same way. The cause is
`python3 -m http.server`, which is single-threaded and serialises the ~30 image
requests; a threaded server scores both builds at 99–100. The recipe recorded
under "Lighthouse baseline" above predates the real photographs and will
under-report now. Use a threaded server, and always measure a control.
