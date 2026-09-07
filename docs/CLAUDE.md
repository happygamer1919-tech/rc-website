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
| Under 400ms | Every duration is a token, and the tokens are the only place they are written | `--reveal-dur`, `--hover-dur`, `[data-stagger]` in `src/styles.css` |
| Under 20px travel | Travel distances are set where the rules are | `[data-reveal]` and `:hover` rules in `src/styles.css` |
| Opacity and transform only | `[data-reveal]` transitions `opacity` and `transform`. Nothing animates layout, colour or size | `src/styles.css` |
| Nothing above the fold | Nothing in the header or the hero animates. The header is `position: fixed` and `<body>` carries a **constant** spacer for it, so the pill's compression on scroll is purely visual and never shortens the document. A sticky header keeps its box in flow; compressing it shunted every section up mid-scroll, which is why it is fixed | RELEASE-NOTES "Motion (phase 2)", `src/styles.css` |
| Fully disabled under reduced motion | Reveals render final, hover travel removed, marquee stopped dead, header does not animate, modal has no entrance | `@media (prefers-reduced-motion: reduce)` at the foot of `src/styles.css` |
| No animation library | The repo has no `package.json` and no dependencies at all | Master plan section 8 |

**The stricter parent rule still holds:** zero *scroll-driven* motion. No
parallax, no scroll sequences, no count-up numerals, no auto-advancing
carousels. The predecessor build was rejected over a scroll-driven section whose
measured height is recorded in the master plan, and it is deleted, not reworked.
*Source: master plan sections 1 and 10.*

A pause on hover or focus is a state change on an existing animation, not new
motion, and is allowed. It must stay pure CSS `animation-play-state` so that no
handler exists to interfere with scrolling.
*Source: DECISIONS.md, W6-01.*

---

## 2. Height budgets

Measured at a desktop width, settled, with every reveal applied.

| Page | Budget lives in |
|---|---|
| Homepage RO and RU | **DECISIONS.md, ruling R-J** |
| Service pages, either locale | **RELEASE-NOTES.md, wave 7 acceptance** |

The homepage budgets are **derived, not chosen**: a corrected baseline plus the
measured cost of each element above the fold plus a stated headroom term. R-J
carries the derivation, the current figures, and the revert values for when the
promo bar or the 100+ tile is removed by data. Read them there.

They have been superseded twice, by R-I and then by R-J, and this file has
already carried a stale copy once. Per R-Q it now carries the pointer only.

**Measure it the same way every time.** An unrevealed `[data-reveal]` is
translated down by its travel token, which inflates `scrollHeight` until it
fires, and measuring before the reveals settle reads high by roughly the sum of
those offsets:

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
button text sized to clear the WCAG large-text threshold, so white on `--brand`
is judged against 3:1 rather than 4.5:1; and the category chip filled with
`--brand-dark`. The sizes and the measured ratios are in the DECISIONS.md entry.
3:1 and 4.5:1 are WCAG's thresholds, not ours, and are quoted as the external
standard they are.
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

**`location` is permanently empty and that is the finished state, not a gap.**
Filling it would need the client to identify the locality of each photograph,
which is not obtainable, and mapping the coverage list onto projects to fill it
would be inventing copy under section 5. No card reopens this unless the client
supplies per-project localities unprompted. **Coverage claims live in
`areaServed`, `band.coverageLine` and `llms.txt`, and are never mapped onto
projects.**
*Source: ruling R-U, DECISIONS.md, W12-34, closing Q-W9-05.*

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
3. `node scripts/check-stale-docs.js` clean. Enforces sections 14 and 15: no
   known-superseded value appears in a governing document without an amendment
   beside it. See section 16.
4. Heights inside the section 2 budgets, measured settled.
5. Lighthouse at or above the section 4 floors, both locales.
6. No new colour value.
7. `prefers-reduced-motion` still disables every effect.
8. `DECISIONS.md` appended, `BACKLOG.md` status updated, and any question the
   card raised written to `QUESTIONS.md` with a shipped default.
9. After any deploy, `node scripts/verify-live.js` exits 0. A live figure quoted
   without it is unverified, per section 12.

---

## 12. Live verification

> A live measurement is valid only when taken with a cache-buster **and** with
> content markers asserted in the same pass. Height alone is never sufficient
> evidence, because a stale page returns a plausible number. Every live
> verification asserts at least one marker proving the deployed build is the one
> being measured. A measurement without markers is reported as **unverified**,
> never as passed.
*Source: ruling R-P, DECISIONS.md, W12-22.*

**This rule was bought.** During wave 12 a post-deploy reading returned the exact
pre-deploy heights, RO 8,843 and RU 9,002, from a stale edge copy. It was inside
budget and entirely plausible, and it was caught only because the numbers were
suspiciously identical to the previous build. Every other live reading that wave
was taken the same way and none of them can be reproduced as evidence.

**`node scripts/verify-live.js [origin]`** is the implementation. It cache-busts
every request with a token unique to the run, disables the browser cache, reads
markers and the settled height in a **single page evaluation** so they cannot come
from different responses, and exits non-zero when any marker mismatches.

**The marker sets live in `scripts/verify-live.js`, in the `MARKERS` constant.**
They are counts of things on the page, so they change whenever the page does, and
a copy of them here would go stale the first time a card added a section. Read
them there; the script is the only place they are written.

Alongside the markers each page is checked for rating markup, the `sameAs`
profile URL, visible `TODO`, `robots` and `canonical`; and a cache-busted crawl
follows every visible anchor to confirm no visitor-reachable `TODO`.

**A marker set proves the build has certain properties, not that it is a
specific commit.** Two builds sharing all six markers are indistinguishable to
it. The stronger form is a deployment fingerprint emitted into every page and
asserted by the verifier; that is not built, and is recorded as a recommendation
in QUESTIONS.md rather than assumed.

**Prove the assertions fire.** They were negative-tested against a build with the
review panel removed: three markers mismatched and the run exited 1, while the
heights it reported were inside budget and looked correct. An assertion nobody
has watched fail is not a gate.

---

## 13. What a gate may conclude

> A gate asserts the **presence of what it requires**, never the absence of a
> complaint about it. Absent evidence is not positive evidence.
*Source: ruling recorded with R-P, DECISIONS.md, W12-22 and W12-25.*

Three incidents in one wave, all the same shape:

| Incident | What the check looked for | What it concluded |
|---|---|---|
| The privacy gate | a `TODO:` marker in `privacy.*` | the section was **deleted**, so no marker was found, so the page was declared publishable and the links were released |
| A live height reading | a plausible number | a **stale edge copy** returned one, and it was inside budget, so the deploy was nearly reported as passing |
| A card reporting done | a status field | **evidence null** was read as nothing-to-report rather than nothing-was-checked |

In each case the checker asked "is anything complaining?", got silence, and read
silence as approval. The three fixes are the same fix: assert what must be there.

- The privacy gate now requires `privacy.opName` and `privacy.opIdno` to be
  **present and real**, so deleting them fails exactly as marking them TODO does.
- `scripts/verify-live.js` requires a `build-sha` tag to be **present and equal**
  to the expected commit. A missing tag is `UNVERIFIED` and exit 1, never a skip.
- A gate whose evidence is missing reports **unverified**, never passed.

The corollary is what makes this operational: **an assertion nobody has watched
fail is not a gate.** Every assertion added under R-P and W12-23 was
negative-tested against a build that should fail it, and the failure observed,
before it was trusted.

---

## 15. When the master plan wins, and when it does not

> The master plan wins by default **only where no later ruling addresses the
> point.** Any master plan value superseded by a ruling carries an inline
> amendment naming that ruling, at the point of the stale value. A value with no
> amendment is presumed current. An un-amended stale value is therefore a defect
> in the amendment, not in the card that obeyed it.
*Source: ruling R-R, DECISIONS.md, W12-27.*

**The last sentence is the point of the rule.** "The master plan wins by default"
is an instruction to trust the document. A card that trusts it and is wrong has
obeyed correctly; the fault is that nobody marked the value. Blame follows the
amendment, which is the only way the instruction stays safe to give.

**The standard is the pattern already at master plan line 121**, where the header
height carries its amendment inline naming the wave that changed it. Amend in
place.

    | `--brand` | ~~`#F26419`~~ **`#F65308`** | … **AMENDED: DECISIONS.md, "…". ** |

**Strike the value, do not remove it — where the value has documentary purpose.**
A design spec with its numbers taken out is not a spec, and a reader who needs to
know what the plan used to say has nowhere else to look. **Where it has no
documentary purpose, removal is correct and is the R-Q-clean answer.** A
stylesheet comment is the clear case: nobody reads it for the figure, and a dead
number left sitting in one is how it gets copied again. The amendment still names
the superseding ruling either way; only the corpse is optional.
*Source: ruling R-T, DECISIONS.md, W12-33, ratifying W12-31.*

Three documents were amended under this ruling on 2026-09-07: the master plan's
`--brand` and `--ink` rows, the photo manifest's 1600px long-edge minimum (not
universal: W7-02 and W8-03 lower it per slot group), and
the backlog's W12-03 budgets. Details in DECISIONS.md, W12-27.

---

## 14. Governing documents do not restate measurements

> Governing documents name the ruling that holds a measured value and never
> repeat the value. A number lives in exactly one place: the ruling that set it.
*Source: ruling R-Q, DECISIONS.md, W12-24.*

**A stale pointer is visible on reading. A stale number is not.** That asymmetry
is the whole argument, and it was paid for three times:

| Instance | Cost |
|---|---|
| The 8,504 / 8,774 homepage baseline | wrong for four waves; advertised 196px of RO headroom where 54px existed, and is most of why wave 12 went over budget |
| R-I's stated budgets | did not match R-I's own derivation, by −1 and +35, and the +35 was a round number the same ruling forbade |
| Section 2 of this file | carried budgets that R-I and then R-J had superseded, 151px too tight on RO |

What this file may still state: **rules and thresholds it owns** — "under 400ms",
"under 20px", the ten colour values, the Lighthouse floors, the 1,400px section
cap. Those are chosen here, so here is their one place.

What it may not state: **anything measured or derived elsewhere** — height
budgets, contrast ratios, animation durations, marker counts. Those live in the
ruling, the stylesheet token, or the script, and this file names the holder.

Where the two are quoted together, the external standard is marked as such:
WCAG's 3:1 and 4.5:1 are not ours to hold.

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

---

## 16. The staleness gate

> A value copied into a governing document has no mechanism that notices when the
> ruling behind it changes. Section 14 stops new copies being made and section 15
> makes the existing ones visible. Neither detects the next one.
*Source: W12-29, DECISIONS.md. Opened as the closing note of Q-W12-11.*

    node scripts/check-stale-docs.js

**`scripts/check-stale-docs.js` is the implementation**, run as a gate the way
`check-links.js` is, exiting non-zero on a hit. It carries a list of
known-superseded values, each with the authority that superseded it, and fails
when one appears with no amendment within three lines.

**It reads the governing documents whole, and the source files' comments only**
(W12-31). Comments, not whole source files, and the distinction is what makes
the extension safe rather than noisy: `MIN_LONG_EDGE = 1600` in `slots.js` is the
correct implementation of a rule, and `setTimeout(r, 1600)` in
`verify-live.js` is a delay in milliseconds. A gate that flags its own correct
implementation trains people to ignore it. Neither is a comment, so neither is
read. The comments are extracted by a character scanner that tracks strings,
template literals to any depth and regex literals, because a regex cannot tell
`//` in a line comment from `//` in `https://` and `build.js` is full of both.

**The list, the exempt files and the enumerated exceptions live in the script.**
They are the one place each is written, per section 14, and the script prints all
three on every run so the scope is never implicit.

**Adding a value to that list is part of recording a ruling that supersedes a
measurement**, not a follow-up card. That obligation is written into R-Q.

Two things fail that would ordinarily be treated as housekeeping, because both
are how a gate stops being one:

- **A named exception that no longer matches anything.** It has outlived the
  occurrence it excused and is now an unreviewed licence sitting inside a gate.
- **A scanned document that has gone missing.** A file that vanished is not a
  file that passed.

**Its limit, stated plainly.** It is a value search with a proximity rule. It
catches a superseded value arriving with nothing beside it, which is every
instance found in wave 12. It cannot tell a value quoted as dead from one quoted
as live when a marker happens to sit within three lines, and it reads only the
files named in its two scan lists. It does not read code, by design, so a
superseded figure written into a string or a variable name is invisible to it.

**Negative-tested before it was trusted**, per section 13, and again when the
source-comment scan was added in W12-31: four values planted in comments of four
different kinds all fired, and six planted in code fired nothing, which is the
arm that proves the scan is reading comments rather than files. Four superseded
values were reintroduced into a scratch copy — R-I's budgets restated as live in this
file, the struck line 121 heuristic restored to the master plan, `#F26419` (dead;
`#F65308` is live) added
to the photo manifest, the never-true baseline added to the backlog — and all
four were reported with the superseding authority named, exit 1. The
dead-exception and missing-file arms were each watched failing too. The first
version of the gate did **not** catch the first of those four, and the window was
tightened from six lines to three until it did.

---

## 17. What "append-only" protects, and what it does not

> In an append-only record, **entry bodies are immutable and status metadata is
> not.** A status marker may be updated in place. Nothing inside a recorded body
> is ever edited, including to correct an error: the correction is a subsequent
> entry that names the one it corrects.
*Source: ruling R-S, DECISIONS.md, W12-32.*

**The two halves are what makes the rule usable.** "Append-only" read absolutely
would freeze a question's heading at OPEN forever, so nothing could say what is
still live, and a reader would have to reconstruct status from the whole file.
Read loosely it licenses editing the record, which is how a wrong figure survives
four waves with nothing marking it. The line between them is body and status.

| May be updated in place | May never be edited |
|---|---|
| A question's status in its heading: `OPEN` → `ANSWERED <date>, <what>` | Anything inside the question's body — the context, the options, the figures as they stood |
| A superseded-by marker added to a dated section | The dated section's own text |
| A backlog ticket's status field | What the backlog entry said when it was written |

**A record of a moment stays a record of that moment.** `DECISIONS.md`,
`docs/QUESTIONS.md` and the dated wave sections of `RELEASE-NOTES.md` are all
records: each states what was true and known when it was written. That is exactly
why they carry superseded figures, and why the staleness gate holds an enumerated
exception list rather than a licence to correct them.

**Current figures live in the handoff**, at the foot of `RELEASE-NOTES.md`, which
is the one section written to be replaced. Everything above it is dated and
stays as written.

**Ratified at W12-32:** the four question headings W12-30 moved from `OPEN` to
answered — Q-W12-06, Q-W12-09, Q-W12-10 and Q-W12-11 — are status metadata and
stand. No entry body was touched in doing it.

An error inside a recorded body is corrected by the next entry, not by the pen.
The record then shows both what was believed and what replaced it, which is
strictly more than the corrected version would have shown.

### R-S governs snapshots. A ruling is not a snapshot.

> **A ruling body may carry appended amendment blocks.** Each is dated, names the
> card that added it, and alters no existing sentence.
*Source: ruling R-T, DECISIONS.md, W12-33, answering Q-W12-13.*

**The distinction is what the document is for.** A question entry and a dated
wave record state what was believed at a moment; they are read backward, as
evidence, and editing them destroys the only thing they carry. A ruling is
standing authority and is **read forward** — a card consults R-J to find out what
the budget is *now*. An amendment that lives anywhere but inside the ruling means
a card can read the whole ruling, act on it, and be wrong.

That is R-R's argument exactly, one level up: an amendment sits at the point of
the thing it amends, and a ruling is a value.

The two blocks that already exist — R-J's, added by W12-10, and R-Q's, added by
W12-29 — stand, and are the pattern. **R-J's in-place corrections of figures in
`DECISIONS.md` are regularised by R-T** and need no correcting entry.

What is still forbidden inside a ruling: editing a sentence that is already
there. An amendment is added below, dated and attributed. Nothing above it moves.

