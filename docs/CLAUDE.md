# CLAUDE.md — Rapid Construct website

Standing rules for the `rc-website` repo. **Rules only, never state.** Anything
that changes as the build progresses (what has shipped, what is measured today,
what is still open) lives in the four files under *Ground truth* below.

Every rule here is derived from something already committed. The **Source**
column says where, so a rule can always be checked against the thing that
created it rather than against this file.

---

## 1. Motion

> Motion never delays or captures scroll. It fires once. It runs under 400ms
> and travels under 20px. It animates opacity and transform only. Nothing above
> the fold animates. It is fully disabled under `prefers-reduced-motion`. There
> is no animation library.

That is the whole rule. What satisfies each clause today:

| Clause | How it is met | Source |
|---|---|---|
| Never delays or captures scroll | No `wheel`, `touchmove` or `scroll` handler calls `preventDefault`. Both scroll listeners are registered `{ passive: true }`, so they cannot block scrolling even in principle | `src/main.js`, RELEASE-NOTES "Motion (phase 2)" |
| Fires once | `IntersectionObserver` with `unobserve` on first fire. Reveals never repeat on scroll back up | `src/main.js` |
| Under 400ms | Reveal 320ms, hover 200ms, stagger capped at 6 items so a nine-card grid completes in 360ms | `--reveal-dur`, `--hover-dur`, `[data-stagger]` in `src/styles.css` |
| Under 20px travel | Reveal 16px, hover 4px | `[data-reveal]` and `:hover` rules in `src/styles.css` |
| Opacity and transform only | `[data-reveal]` transitions `opacity` and `transform`. Nothing animates layout, colour or size | `src/styles.css` |
| Nothing above the fold | Nothing in the header or the hero animates. The header is `position: fixed` and `<body>` carries a **constant** spacer for it, so the pill's compression on scroll is purely visual and never shortens the document. A sticky header keeps its box in flow; compressing it shunted every section up mid-scroll, which is why it is fixed | RELEASE-NOTES "Motion (phase 2)", `src/styles.css` |
| Fully disabled under reduced motion | Reveals render final, hover travel removed, marquee stopped dead, header does not animate, modal has no entrance | `@media (prefers-reduced-motion: reduce)` at the foot of `src/styles.css` |
| No animation library | The repo has no `package.json` and no dependencies at all | Master plan section 8 |

**The stricter parent rule still holds:** zero *scroll-driven* motion. No
parallax, no scroll sequences, no count-up numerals, no auto-advancing
carousels. The predecessor build was rejected over a 5,081px scroll-driven
section and it is deleted, not reworked.
*Source: master plan sections 1 and 10.*

A pause on hover or focus is a state change on an existing animation, not new
motion, and is allowed. It must stay pure CSS `animation-play-state` so that no
handler exists to interfere with scrolling.
*Source: DECISIONS.md, W6-01.*

---

## 2. Height budgets

Measured at a desktop width, settled, with every reveal applied.

| Page | Budget | Source |
|---|---|---|
| Homepage RO | under **8,700px** | Wave 6 acceptance |
| Homepage RU | under **9,000px** | Master plan section 10 |
| Service pages, either locale | under **6,000px** | Wave 7 acceptance |

**Measure it the same way every time.** An unrevealed `[data-reveal]` is
translated 16px down, which inflates `scrollHeight` until it fires. Measuring
before the reveals settle reads about 150px high on the homepage:

    document.querySelectorAll('[data-reveal]').forEach(n => n.classList.add('is-revealed'));
    // wait ~1.5s for the staggered transitions, then:
    document.documentElement.scrollHeight

No section may exceed 1,400px, with two standing exceptions: the services grid
and the portfolio grid, which are the same object and cannot fit nine and six
cards respectively under the cap.
*Source: master plan section 10, DECISIONS.md "Approved exceptions".*

---

## 3. Colour

**Ten values. Adding an eleventh is a change to this file, not a change to a
stylesheet.**

| # | Value | Token | Use |
|---|---|---|---|
| 1 | `#F65308` | `--brand` | Primary buttons, active states, numerals, focus rings |
| 2 | `#B23C08` | `--brand-dark` | Eyebrows, link hover, the category chip fill |
| 3 | `#1A1A1A` | `--ink` | Body and heading text on light |
| 4 | `#5A5A5A` | `--ink-muted` | Secondary text, captions, form hints |
| 5 | `#FFFFFF` | `--bg-light` | Section background A, white tiles, text on dark |
| 6 | `#F2F2F2` | `--bg-grey` | Image placeholder fill only, never a section |
| 7 | `#141414` | `--bg-dark` | Section background B, white text on it |
| 8 | `#E2E2E2` | `--line` | Card borders, dividers |
| 9 | `#25D366` | — | WhatsApp's own colour, floating button only |
| 10 | `#1EBE5A` | — | WhatsApp's own hover, floating button only |

Values 9 and 10 are WhatsApp's brand colours, not the site's, and are confined
to the floating contact button.

**`--brand` is `#F65308` and `--ink` is `#1A1A1A`.** The master plan's `#F26419`
and `#1C1C1C` predate the logo file and lose to these.
*Source: DECISIONS.md "The master plan is stale on two token values".*

**Background rule, non-negotiable.** Sections alternate `#FFFFFF` and `#141414`
with hard edges. No gradients, no fades, no fourth off-white, no translucent
overlay that creates an in-between shade. `--bg-grey` survives only as the
image-placeholder fill.
*Source: master plan section 4, phase 2 amendment in `src/styles.css`.*

**What is not a colour value**, and does not count against the ten:

- `#000` inside a `mask-image` gradient. A mask stop is an alpha channel, not a
  paint. It never renders.
- `rgba(255, 255, 255, x)` hairlines, dividers and icon-button hovers **on the
  dark band**. These sit on `#141414` and read as one lighter line, not as a
  new background.
- `rgba(0, 0, 0, 0.08)` and `rgba(0, 0, 0, 0.12)` card and header shadows.
- `rgba(0, 0, 0, 0.6)`, the lead-capture modal scrim. **The single permitted
  translucency on the site: an overlay, not a section.**
  *Source: `src/styles.css` comment at `.modal`.*

Adding a translucent overlay to a *section* is forbidden, and has already been
refused once: the `form-bg` slot was struck for needing exactly that.
*Source: DECISIONS.md "Approved exceptions".*

---

## 4. Lighthouse floors

| Category | Floor |
|---|---|
| Performance | **95** |
| Accessibility | **100** |

Both locales, desktop preset. Best practices and SEO are not floored but have
been 100 since 2026-08-28 and a drop should be explained.

One expected exception: a service page scores SEO ~69 while it is `noindex`.
That is the indexability gate working, not a regression — the page carries
`noindex, nofollow` until one of its projects has a real cover photograph, and
clears itself when one lands.
*Source: DECISIONS.md W3-02, RELEASE-NOTES "Lighthouse baseline".*

Accessibility 100 is held by two decisions that must not be quietly undone:
button text at 19px, which clears the WCAG large-text threshold so white on
`--brand` needs 3:1 rather than 4.5:1; and the category chip filled with
`--brand-dark` for 5.93:1.
*Source: DECISIONS.md "Contrast, resolved 2026-08-28".*

---

## 5. Copy

**No copy is ever invented.** Not a service, not a figure, not a guarantee, not
a price, not a locality, not a year, not a testimonial name.

The copy source is the predecessor build at `rapidconstruct-web.vercel.app`.
Permitted edits: shortening a sentence, converting a heading to uppercase,
splitting a paragraph into a card. Not permitted: inventing anything.
*Source: master plan section 6.*

When there is no source for a value, **mark it or omit it — never fill it**:

- `TODO: <what is missing>` in a locale file or in `content/projects.json`.
- `""` in `content/projects.json`.

Both mean the same thing to `build.js`, which treats them identically through
`REAL()` and **never prints either**. A field with no source renders as nothing
at all, not as a placeholder a visitor can see.
*Source: DECISIONS.md W6-02, `content/projects.json` `_note`.*

This rule has teeth already: six invented portfolio projects, three invented
testimonial names and a set of invented service two-liners were all built by the
design files and none of them reached `dist/`.
*Source: DECISIONS.md "Everything the design files invented, and did not ship".*

TODO markers gate their own pages. The privacy policy is `noindex` and out of
the sitemap while its legal-identity fields are unfilled.
*Source: `build.js`, DECISIONS.md 2026-08-28.*

---

## 6. Projects

**A project renders only when its `title` and `summary` are both real, in that
locale.** Real means neither empty nor `TODO:`-prefixed. Without both, the
project is invisible everywhere: not on its service page, not in the homepage
portfolio, not in the sitemap.

That is what makes an empty project safe to commit. 44 of the 54 projects in
`content/projects.json` are stubs and none of them reaches a visitor.

Every other field — `location`, `year`, `work_type`, `area_sqm`, `duration`,
`main_materials`, `challenge` — is optional and drops out of the render **on its
own**. A project with a real location and no year prints the location alone.

A project that renders must have a cover file. `build.js` refuses to build
otherwise and names both the missing file and the command that fixes it.
*Source: DECISIONS.md W6-02.*

---

## 7. Images

Photo slots are defined in one place, `scripts/slots.js`, which both
`gen-placeholders.js` and `process-photos.js` read. Adding a slot there and to
the template is all it takes.

**A slot with an SVG fallback decides per slot, never globally.** The first
service to get a real photograph renders a photograph while the other eight
still render SVGs. A fallback SVG is retained, never deleted, when its photo
lands.
*Source: DECISIONS.md W6-03.*

Photos are dropped into `photos-raw/` named by slot ID and processed with
`node scripts/process-photos.js`. The pipeline rejects any filename that matches
no slot and tells you what it nearly matched. **Nothing is ever skipped
silently.**

Real Rapid Construct work only. No stock. **If a slot has no real photo, the
slot is removed rather than filled.**
*Source: master plan section 7.*

---

## 8. Both locales, always

RO and RU must stay in sync. A string added to one is added to the other **in
the same commit**. `build.js` refuses to write output if the two locale files
disagree on keys, or if any string is empty.
*Source: master plan section 10, `build.js`.*

---

## 9. Links

Every internal `href` and `src` must resolve to a real file, and every
`#fragment` to a real `id` on the page it lands on.

    node build.js && node scripts/check-links.js

Exits non-zero, so it is a gate rather than a habit.

A link must also mean what it says. A dead-link audit is not enough: the 2026-08-28
audit found zero broken anchors and four genuinely misleading ones. A
privacy-policy link pointing at the footer is a defect even though it resolves.
*Source: DECISIONS.md "Dead-link audit".*

---

## 10. Git

- **Feature branches only.** `<wave-or-area>/<ticket-id>-<short-slug>`, for
  example `w6/rc-032-supplier-marquee`.
- **Nothing is ever committed directly to `main`.** Every change on `main`
  arrives through a `--no-ff` merge commit. `git log --no-merges --first-parent`
  on `main` should return only the initial scaffold commit.
- One card, one commit.
- Conflicts in `DECISIONS.md`, `QUESTIONS.md` or `BACKLOG.md` are resolved by
  **union**: keep every entry from both sides in chronological order. Never
  discard a side.
- `main` deploys to GitHub Pages on push. Pushing `main` is a publish.

---

## 11. Gates before a card is done

1. `node build.js` clean.
2. `node scripts/check-links.js` clean.
3. Heights inside the section 2 budgets, measured settled.
4. Lighthouse at or above the section 4 floors, both locales.
5. No new colour value.
6. `prefers-reduced-motion` still disables every effect.
7. `DECISIONS.md` appended, `BACKLOG.md` status updated, and any question the
   card raised written to `QUESTIONS.md` with a shipped default.

---

## Ground truth

This file holds rules. Everything else lives in exactly one of these:

| File | Holds |
|---|---|
| `docs/RC-WEBSITE-MASTER-PLAN.md` | Product scope, section spec, locked decisions. **Wins by default.** Where it and a chat instruction conflict, ask before deviating. |
| `DECISIONS.md` (repo root) | Every departure from the master plan and why. Append-only. The master plan loses only where this file says it does. |
| `docs/BACKLOG.md` | Tickets and their status. |
| `docs/QUESTIONS.md` | Open questions for the owner, each with the default that shipped. Append-only; answered items are marked, never deleted. |

Two more that are reference rather than rule: `docs/RC-PHOTO-MANIFEST.md` (the
slot inventory) and `RELEASE-NOTES.md` (what each wave changed, and the current
measurements).

**Never guess a product decision.** Write the question to `docs/QUESTIONS.md`
with full context and a recommended default, ship the default, mark the ticket
blocked if it cannot proceed, and move to the next unblocked one. A blocked
ticket stops one branch of the graph, never the whole run.
