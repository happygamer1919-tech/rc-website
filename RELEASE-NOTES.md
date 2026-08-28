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

---

## Constraints that must not drift

From `docs/RC-WEBSITE-MASTER-PLAN.md`. The previous build was rejected for
breaking the first two.

- Desktop page height under 9,000px. Currently **8,080px RO / 8,296px RU**.
  The rejected build was 13,312px.
- Exactly three background values: `#FFFFFF`, `#F2F2F2`, `#141414`. `#141414`
  appears exactly twice, on the stats band and the footer. No gradients, no
  fourth off-white, no translucent overlays.
- Zero motion. No scroll animation, parallax, fade-in, count-up numerals or
  auto-advancing carousels.
- No section over 1,400px except the services and portfolio grids, which are
  agreed exceptions.
- Header opaque at 72px (64px compressed), nav items never wrap.

## Motion (phase 2)

Motion is permitted but never touches scroll. The rules, all enforced:

- No wheel, touchmove or scroll handler ever calls `preventDefault`. Both scroll
  listeners are registered `{ passive: true }`, so they cannot block scrolling
  even in principle.
- Reveals use `IntersectionObserver` and `unobserve` on first fire, so they
  never repeat on scroll back up.
- Reveal 320ms / 16px, hover 200ms / 4px, stagger capped at 6 items (360ms).
- Nothing in the header or hero animates.
- The header is `position: fixed` with a constant 72px spacer on `<body>`.
  It was sticky, but a sticky header keeps its box in flow, so compressing it
  72px -> 64px shortened the document and shunted every section up 8px
  mid-scroll. Fixed makes the compression purely visual.
- `prefers-reduced-motion: reduce` disables every effect. Reveals render final,
  hover travel is removed, the marquee stops dead, the header does not animate.

## Lighthouse baseline

Measured on the Pages URL, desktop preset, 2026-08-28, with all 21 images still
placeholders. Re-measure after real photos land.

| | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| RO | 100 | 100 | 100 | 100 |
| RU | 100 | 100 | 100 | 100 |

Accessibility reached 100 by raising button text to 19px (clearing the WCAG
large-text threshold, so 3:1 applies) and darkening the category chip fill to
`--brand-dark`. The approved `#F65308` is untouched on buttons.

See `DECISIONS.md` for where this build departs from the master plan and why.
The short version: `--brand` is `#F65308` and `--ink` is `#1A1A1A`, sampled from
the logo, because the plan predates the logo file.
