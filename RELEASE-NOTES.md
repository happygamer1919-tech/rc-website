# Release notes

Status of the Rapid Construct site as built. Read this first if you are coming
back to the project cold.

**Last updated:** 2026-08-28
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

### All 21 image slots

Every image on the site is a generated placeholder: a flat `#F2F2F2` JPG at the
manifest's exact pixel size, with the slot ID and aspect ratio printed in the
middle. Nine services, five process steps, six portfolio covers, one og-image.

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
| **Photos** | All 21 slots. Selection session with Mihai still to happen. |
| **Form endpoint** | No Web3Forms key yet. Deliberate until the visual is approved. |
| **Production host** | GitHub Pages is for client review only. Hostinger is the production target. |
| **Privacy / cookie policy** | **Dead links.** The consent checkbox and two footer links point at `#contacte`, which is not a policy. The old site had real pages. See the dead-link audit in `DECISIONS.md`. |
| **Primary button contrast** | White on `#F65308` is 3.41:1, below WCAG AA. Holds Lighthouse accessibility at 96. Fixing means darkening the approved brand fill; awaiting the client's call. |
| **Portfolio lightbox** | Not built. The manifest's 18 optional `port-0N-a/b/c` extras are unused. |

---

## Building

    node build.js                                  # root build, for Hostinger
    BASE_PATH=/rc-website node build.js            # GitHub Pages build

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
- Header opaque and sticky at 72px, nav items never wrap.

## Lighthouse baseline

Measured on the Pages URL, desktop preset, 2026-08-28, with all 21 images still
placeholders. Re-measure after real photos land.

| | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| RO | 100 | 96 | 100 | 100 |
| RU | 100 | 96 | 100 | 100 |

The 96 is entirely white-on-`#F65308` for the primary button and category chip.

See `DECISIONS.md` for where this build departs from the master plan and why.
The short version: `--brand` is `#F65308` and `--ink` is `#1A1A1A`, sampled from
the logo, because the plan predates the logo file.
