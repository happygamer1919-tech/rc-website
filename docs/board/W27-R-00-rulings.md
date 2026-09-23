# W27-R-00 · The wave 27 rulings, recorded first

Card W27-R-00. Branch `w27/w27-r-00-rulings`, based on `main` with #135 merged and verified live.
This is the first card of the final run, and it is also the test of the merge protocol you wrote.

## What this card does

- **Records your eight rulings, word for word**, in `docs/rulings/W27-R.md`, with my reading under
  each one for you to ratify or overturn in the morning.
- **Confirms the last merge is live and correct**: the site at `e3ba69d` passed the live check,
  53 of 53 pages, exit 0.

## What the preflight found, and what I did about it

**Your main branch has no protection rules at all** (the API says "Branch not protected", and the
rulesets list is empty). So there were no review requirements to remove, and I removed nothing.
Auto-merge is switched on for the repository, as you asked.

**Two things in your merge protocol could not work as written, and here is what happens instead:**

1. GitHub's auto-merge waits for required checks, and there are none, so it would have merged
   before the quality check ran. Instead each PR is watched until `quality` is green, and only then
   merged. Nothing merges on red.
2. Every merge on this repo has been a merge commit, and the repo's own rules say it must stay that
   way. So merges are merge commits, not squashes. One card is still one commit.

## Two things you named that do not exist

- `docs/RC-PROJECT-RULES.md`: never existed. The rules are `docs/CLAUDE.md`, and that is what the run
  follows.
- The two design proposal `.md` files: the repo has only their PDF "why" pages under `design/`. I
  transcribed both in full. The design cards are built from the numbers in your dispatch, which is
  what you said to do if the files were absent.

## What to look at in the morning

- `docs/rulings/W27-R.md`: each reading is open for you to overturn.
- W27-R-04's risk note: the site now states a competitor's prices and shows its product photographs
  for two sections.

## Heights

No page changed. Documents only.

## Gates

**Static gates on this tree exit 0**: build, links, stale docs, merge artifacts, stub count, dashes.
CI runs the full 29 commands on the pull request.
