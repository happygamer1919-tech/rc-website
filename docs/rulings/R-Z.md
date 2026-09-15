# RULING R-Z · Merge hygiene, and supplier pricing stays out, 2026-09-15

Recorded at the owner's instruction, from the wave 15 dispatch, before any wave
15 card was worked. Shipped as a STOP PR ahead of every other wave 15 card, as
the dispatch directs.

## The ruling, as given

> 1. Conflicts are never resolved in the GitHub web conflict editor. It
>    corrupts append-only tables. Resolve locally, or merge main forward.
>    Enforced by `scripts/check-merge-artifacts.js`, wired into `quality`,
>    failing on conflict markers and on duplicate row keys in `DECISIONS.md`,
>    `BACKLOG.md`, `QUESTIONS.md` and `PROVENANCE.md`.
> 2. Supplier trade pricing, wholesale price lists and supplier cost data are
>    never committed to this repo in any form: not as a file, not as a data
>    source, not as a comment, not as a derived margin figure. Only published
>    retail prices appear in the repo.

## Clause 1 was bought, and the receipt is W14-24a

This is not a precaution. It happened, on this repo, on 2026-09-15, and
`DECISIONS.md` W14-24a records the repair.

`#16` and `#20` were each brought up to date with main through GitHub's conflict
editor (`eb1f4da`, `a1cb191`). The editor **strips the marker characters, leaves
their tails behind as ordinary text, and keeps both sides of every conflict.**
The same damage then reached `#25` when main was merged into it (`05102a3`).
`docs/assets/PROVENANCE.md` came out of it with stray lines, a blank line inside
the table and five files listed twice; main's `quality` check failed with
"table has no rows". **Pages deployed it anyway, because the deploy workflow
does not run the gates.**

**Why the gate needs two arms.** A conflict-marker grep would not have caught
any of it. The editor removes the markers, so the file that reaches the repo is
marker-free and silently carrying one side twice. The visible symptom in an
append-only table is a **duplicated row key**, which is why that is the second
arm and why it is the arm that matters. A grep for markers alone would have
returned clean on all three damaged files.

## Implementation

`scripts/check-merge-artifacts.js`, run by the `quality` workflow on every pull
request, alongside the five gates already there.

**Arm 1, conflict markers.** Four line-start forms (ours, theirs, divider, and
the diff3 base marker) across every tracked text file, not only the four tables.
A marker anywhere is a defect.

**Arm 2, duplicate row keys.** In the four files the ruling names:

| File | Rows counted | Key |
|---|---|---|
| `DECISIONS.md` | `##` section headings | the whole heading |
| `docs/BACKLOG.md` | `\| RC-…` ticket rows | the whole row |
| `docs/QUESTIONS.md` | `## Q-…` question headings | the whole heading |
| `docs/assets/PROVENANCE.md` | `\| \`path\`` rows | the backticked file path |

**Presence, not silence** (`docs/CLAUDE.md` section 13). Every keyed file must
exist and must still yield keys. A file that vanished is not a file that passed,
and a file whose shape changed so that nothing matches is a failure, not a pass.
That second assertion is the one that would have caught W14-24a's PROVENANCE.md
directly.

**Negative-tested before it was trusted**, per `docs/CLAUDE.md` section 13, with
the control arm watched passing first: a planted marker fired arm 1; a planted
duplicate row fired arm 2 and named both line numbers; a keyed file emptied of
its rows failed on the presence assertion; a keyed file deleted failed on the
missing-file assertion. Four failures watched, exit 1 each time.

## Recorded interpretations, each open for ratification

1. **The key is the whole heading or row, never a parsed identifier.** This is
   load-bearing, not cosmetic. `docs/QUESTIONS.md` legitimately carries both
   `## Q-W12-07-LEGAL · …` and `## Q-W12-07-LEGAL, addendum · …`. Keyed on a
   parsed ID those collide, and the gate would fail on current main against a
   correct record. Keyed on the whole line they are two keys, which is what they
   are. A merge duplication reproduces a row verbatim, so the verbatim row is
   also the *right* key, not merely the safe one.
2. **`docs/assets/PROVENANCE.md` duplicates are already caught** by
   `scripts/check-asset-provenance.js`, which has failed on a duplicate row
   since R-W. R-Z covers all four files uniformly rather than carving out the
   one that is covered. This is defence in depth, and it is not novelty: the
   claim here is coverage of the other three.
3. **The scan is of tracked text files**, by extension (`md js json css html yml
   yaml txt sh`), from `git ls-files`. Untracked working-tree files are not
   scanned: they are not what a merge damages.
4. **The script scans itself.** Its marker literals are built by character
   repetition rather than written out, so no line-start marker exists in its own
   source and it needs no exemption from its own gate. That is the difference
   from `scripts/check-stale-docs.js`, which must exempt itself because the list
   of superseded values necessarily contains every superseded value.
5. **The one thing arm 1 cannot distinguish** is a Markdown setext heading
   underline of exactly seven `=` characters, which is byte-identical to a
   conflict divider. There are zero in the repo today, and the house heading
   style is `#`-prefixed, so the collision is theoretical. Stated rather than
   hidden, in the manner of `check-stale-docs.js` stating its own limit.
6. **The deploy workflow still runs no gates.** W14-24a's damage reached
   production because `pages.yml` deploys on push to main without running them,
   and this ruling does not change that. `quality` runs on pull requests, so a
   defect that arrives through a PR is caught before merge; one committed
   straight to main is not. Nothing is committed straight to main
   (`docs/CLAUDE.md` section 10), so the gap is narrow, but it is real and is
   recorded here rather than assumed closed. Closing it is a card, not a ruling.

### Clause 2, and what a gate can and cannot do for it

7. **Clause 2 is enforced by review, not by this gate.** A wholesale price and a
   retail price are the same shape: a number beside a product. No pattern
   distinguishes them, and a gate that claimed to would be the kind of assertion
   `docs/CLAUDE.md` section 13 warns about, reporting silence as approval. The
   prohibition is absolute and is recorded here so that it binds every later
   card; the check on it is that supplier material never enters, which is a
   decision made before a commit, not after.
8. **The metal tile list prices already in `content/tigla-metalica.json` are
   retail and stay.** They were read from the manufacturer's **published**
   listing and product pages, and the file says so. Clause 2 bars trade and
   wholesale pricing and supplier cost data; a published list price is the
   retail figure a customer is quoted, which is the category clause 2 expressly
   permits. Whether those published figures are Rapid Construct's own selling
   prices is a different question and stays open as Q-W14-08(a).
9. **Q-W14-11b is narrowed by this ruling, not closed.** The Dasterum wholesale
   price list the owner supplied is barred from the repo in every form by clause
   2, and it carries no images in any case, so it cannot answer the question it
   was hoped to answer. What is still wanted there is an image pack with written
   permission, never the price list. The question stays open on that basis.
10. **"Not as a derived margin figure"** is read as barring any number computed
    from a supplier cost, including a percentage, a markup, a margin, or a
    retail price presented as "cost plus". A retail price that happens to have
    been *set* with knowledge of cost is not a derived figure; publishing the
    arithmetic is.
