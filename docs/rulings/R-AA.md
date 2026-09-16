# RULING R-AA · Destructive git commands and worktree hygiene, 2026-09-16

Recorded at the owner's instruction, from the wave 16 dispatch, before any wave 16
card was worked. Shipped as a STOP PR ahead of every other card, as the dispatch
directs.

## The ruling, as given

> 1. `git reset --hard` is never reachable by shell fall-through. Any reset is an
>    explicit, single, guarded command naming its target ref.
> 2. Leftover worktrees are removed at the end of every run. A run that finds a
>    worktree it did not create reports it before working.

## Clause 1 was bought, and the receipt is wave 15

This is not a precaution. It happened, on this repo, on 2026-09-15, in this
executor's own run, and it is recorded in the wave 15 report.

The command was the ordinary-looking

    git checkout X 2>/dev/null || git checkout -b X origin/X
    git reset --hard origin/X

**Both** the checkout and its fallback failed: `X` was `w14/rc-113-remeasure`,
which was checked out in another worktree, so `checkout` refused with "already
used by worktree" and `checkout -b` refused with "already exists". The shell
carried on. The `reset --hard` then ran **on the branch that was still checked
out**, moving the local `w15/rc-125-ruling-rz` label onto the other branch's
commit.

**It was recoverable only by luck of sequencing.** That branch had already been
pushed, so `origin` still held the real commit and PR #31 was untouched. Nothing
was lost. The next such accident need not be so lucky.

**The two clauses are one incident.** Clause 2 is not a tidiness rule bolted on:
the leftover worktree is *why* the branch would not check out, and therefore why
the fall-through happened at all. Removing leftover worktrees removes the
condition that produced the failure.

## Clause 2: the worktree found, and removed

Reported before any wave 16 card was worked, as the clause requires.

| | |
|---|---|
| Path | `/private/tmp/claude-501/-Users-ivan/87a213fe-fce4-4d19-9dd1-40c2809f9539/scratchpad/wt-113` |
| Held | `w14/rc-113-remeasure` at `d0b8729` |
| Created by | an earlier session, not this run. The session id in its path is not this run's |
| Disposition | removed |

It was removed under four guards, each checked and each able to refuse: the path
matched the one reported; the branch it held matched; its commit was verified an
ancestor of `origin/main`, so nothing unmerged was discarded; and its tree carried
zero uncommitted changes. Then one explicit `git worktree remove` naming that
path, followed by `git worktree prune`. One worktree remains, the clone itself.

## Implementation: there is no gate, and that is the finding

**Neither clause can be gated in this repo, and a gate that cannot fail is worse
than no gate.** `docs/CLAUDE.md` section 13 is explicit that an assertion nobody
has watched fail is not a gate, and section 16 treats a named exception matching
nothing as a defect rather than housekeeping. R-Z set the precedent in its own
clause 2: supplier pricing is enforced by review, and the ruling says so rather
than implying a coverage it does not have.

- **Clause 1 has nothing to scan.** The repo contains **zero tracked shell
  scripts** and **zero tracked files containing `reset --hard`**; every script
  under `scripts/` is `.js`. A scanner would pass vacuously on every run, for
  ever, while the behaviour it names happens in a terminal it cannot see.
- **Clause 2 cannot fail where it would run.** `quality` runs on a GitHub runner
  that checks out exactly one fresh worktree. A worktree check there is green by
  construction.

So R-AA is a **practice ruling**: it binds how a run is conducted, and it is
enforced by conduct and by this record, not by `quality`. Writing that down is the
point. A ruling that quietly implies an automated check it does not have is the
failure mode section 13 exists to prevent.

## What clause 1 means in practice

- Assert the precondition before anything destructive:
  `test "$(git rev-parse --abbrev-ref HEAD)" = "<branch>" || exit 1`.
- Prefer `git switch`, which fails loudly, over `git checkout`.
- Keep a destructive command in its own call, never chained behind `||` or `;`
  after something whose success was not asserted.
- Push before risky branch work, so `origin` is a recovery point.
- When a branch refuses to check out, run `git worktree list` before forcing
  anything. That is the diagnostic that would have prevented the wave 15 incident.

## Recorded interpretations, each open for ratification

1. **Neither clause is wired into `quality`, deliberately**, for the reasons
   above. If the owner wants a gate regardless, the honest form is a local
   convenience script that a human runs, not a CI step that is green by
   construction.
2. **"Reachable by shell fall-through" is read broadly.** It covers `||`, `;`,
   and any chain where a destructive command runs without its precondition
   asserted, not only the `||` form that caused the incident. The test is whether
   the command can execute after its intended target failed to be established.
3. **"Removed at the end of every run" is read with a precondition.** The run that
   created a worktree removes it. A run that finds one it did not create reports
   it first, then removes it **only** once its branch is merged or its tree is
   clean, and refuses otherwise. A leftover worktree may be the only copy of
   unpushed work, and clause 2 must not become a licence to discard it.
4. **`git worktree remove` without `--force` is the required form.** It refuses on
   a dirty tree by itself, which is the guard doing its job rather than the
   operator remembering.
5. **This ruling binds the executor, not the repo.** Nothing in the shipped site
   changes, no gate is added, and the only artifacts are this file and the
   decision record.
