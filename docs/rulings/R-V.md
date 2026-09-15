# RULING R-V · Wave 14 autonomy, 2026-09-15

Recorded at the owner's instruction, from the wave 14 dispatch, before any wave
14 card was worked.

## The ruling, as given

> Self-merge on green `quality` is permitted for cards marked SELF in the board.
> Cards marked STOP open a PR and halt that card only.
>
> STOP set: SITE_URL, canonical, hreflang, og, sitemap, robots, JSON-LD on
> LocalBusiness or Organization, src/privacy.html, docs/rulings.
>
> Work cards in dependency order. A blocked card is marked blocked with its
> question and the run moves to the next card immediately. The run ends only
> when every card is shipped, blocked or skipped.

The board is `docs/BACKLOG.md`, section "Wave 14". It carries the SELF or STOP
mark on every card.

## Scope

Wave 14 only, cards RC-101 to RC-114. It does not carry into wave 15.

## What self-merge means in this repo

`main` deploys to GitHub Pages on push (`docs/CLAUDE.md` section 10), so a
self-merge is a publish to rapidconstructmd.com. R-V authorises that publish for
SELF cards. The other gates in `docs/CLAUDE.md` section 11 still apply before a
card is done.

## Recorded interpretations, each open for ratification

The dispatch was written against facts that differ from the repo on four
points. Each is resolved the way stated here, and each is flagged in the wave 14
report.

1. **There was no `quality` check.** The only workflow was `pages.yml`, which
   runs on push to `main` and never on a pull request. No PR had ever been
   opened on this repo; every change landed as a local `--no-ff` merge. RC-102
   creates `.github/workflows/quality.yml` with a job named `quality`, running
   on pull requests. Until that PR merges, no card can self-merge.
2. **`docs/rulings` did not exist.** Rulings R-A to R-U live inside
   `DECISIONS.md`. This file creates `docs/rulings/`. From R-V onward a ruling
   lives in its own file there. R-A to R-U stay where they are, unmoved: R-S
   makes their bodies immutable, and moving them would split each from the
   surrounding record that explains it.
3. **What the STOP path `docs/rulings` covers.** Any file under
   `docs/rulings/`. A W14 decision-log entry appended to `DECISIONS.md` is not a
   ruling record and does not make a card STOP. A card that needs a new ruling
   (R-W for RC-102, R-X for RC-114) ships its code under SELF and records the
   ruling in a separate STOP PR.
4. **"JSON-LD on LocalBusiness or Organization".** The homepage node is
   `@type: GeneralContractor`, a schema.org subtype of LocalBusiness. It is in
   the STOP set. The service pages' `FAQPage` and `BreadcrumbList` nodes are
   not.
