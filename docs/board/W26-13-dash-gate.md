# W26-13 · No long dashes anywhere, and the gate that keeps it so

Card W26-13. Branch `w26/w26-13-dash-gate`, stacked on W26-12 (#133). PR only.

## The numbers you asked for

**Found: 547 long dashes in 43 files. Fixed: 237, in 40 files.**

**310 remain, all under the two exemptions your ruling names, and none is on the site:**

| Where | Left | Why |
|---|---|---|
| `DECISIONS.md`, `QUESTIONS.md`, `RELEASE-NOTES.md` (old sections), `BACKLOG.md` | 250 | "frozen records under R-S": old entries are never edited |
| the imperlux audit capture | 60 | "third-party titles quoted verbatim": every one is inside imperlux's own titles |

Also left: **15 dashes in 9 old commit messages already on `main`**. Changing them needs a force
push, which is off limits. Every new commit is checked.

## What changed on the site

- **Russian text, five sentences.** In Russian the dash replaces the word "is", so a colon would
  read wrong. Each was rewritten: the privacy page, the turnkey page, two 3D design answers, the
  earthworks page.
- **The RO / RU switch label** read by screen readers now uses a colon. Nobody sees it.
- **The email subjects of your quote forms** now use " - " instead of the long dash, like the
  catalogue forms already did. **If you filter these emails by subject, update the filter.**

## The gate (gate 30)

**It reads the actual bytes**, because the old check did not: it searched for an escape the shell
never expanded, found nothing, and said "clean" on every card.

It checks **every file, the built site, and each pull request's commit messages, title and body.**
The old record entries may keep the exact lines they have, and nothing more: a new entry with a
dash fails, an edited old line fails, and the list can only shrink. In the audit file, a dash is
accepted **only inside imperlux's titles**, nowhere else in that file.

**Watched fail**: I put a dash back into the Russian privacy text and added a dash to a new
decision entry. It failed with three problems, each named: the source line, the built page, and
the record line. Clean again after restoring.

## Two things I had recorded wrong, corrected

When I wrote down your ruling I added a third exemption for an old stylesheet kept as test
evidence. **Your ruling has two exemptions, not three.** Its three dashes are now hyphens, and the
gate that uses it still proves it matches the original file. I had also written that R-Y's two
dashes would be "struck"; a struck dash is still a dash, so they were **replaced with brackets**.

## Heights

Every page the same, except **Russian earthworks +27px** (still inside its budget) and **Russian
privacy +25px on a phone**.

## Gates

**29 of 29 gate commands exit 0.** 30 numbered gates.
