# RULING R-AB · A gate's result is its own exit code and its own output, 2026-09-16

Recorded at the owner's instruction, from the wave 17 dispatch, before any wave 17
card was worked. Shipped as a STOP PR ahead of every other card, as the dispatch
directs.

## The ruling, as given

> A gate's result is its own exit code and its own output. A wrapper's exit code,
> a background job's status, a control that was never watched green, and the
> absence of a complaint are all non-evidence. Any check reported as passed must
> name the process whose exit code was read.

## The cases that motivated it

Both happened on this repo, in wave 16, on 2026-09-16, in this executor's own run.
Both were caught before anything shipped on them, and both only because someone
went back and read the gate's own output. Nothing in the process required it.

### Case 1: a wrapper's exit code was read as the gate's

Card RC-131. The first real run of the draft Lighthouse gate was started as a
background job, from a scratch copy, with this as its last two lines:

    node /tmp/lh-test/scripts/check-lighthouse.js; echo "exit=$?"

The harness reported the job **"completed (exit code 0)"**, and it was reported in
the run as the gate having run end to end and passed. **The gate had failed.** Its
own output said so:

    LIGHTHOUSE GATE FAILED: lighthouse could not be run for http://127.0.0.1:8731/.
      spawnSync npx ETIMEDOUT
    exit=1

The 0 belonged to `echo`, the last command in the job. The gate's exit code was
printed on the line above it, and nobody read that line before the report.

**What it would have cost.** RC-131's only open decision was whether gate 5 could
run in this environment at all. A false "passed" would have decided it as
implemented on no evidence, and would have hidden the two real bugs the gate later
found in itself: `npx --yes` hanging past a 300s timeout, and the gate blocking its
own in-process server with `execFileSync`. Both are recorded at W16-04. The
correction was made in the run, in plain words, and carried into the wave 16 report
as the first of three mistakes.

### Case 2: negative arms read against a control that was never green

Card RC-129. The new catalog page gate was negative-tested in one chained command:
the control, then four arms (a planted price, a planted cart button, a missing
locale of pages, a planted `data-sku`), then the control again. Every arm printed
`exit=1 (want 1)`.

**The control was red, and the arms ran anyway.** It reported 28 violations, two on
each of the fourteen pages (`price-word` and `cart`), and every one of them was the
new template's own header comment, which read "No prices, no product records, no
stock, no cart". The restore control at the end was red the same way.

So arms 1, 2 and 4 "failed as required" **for the wrong reason**. The lines each
arm printed were comment hits, not what had been planted, and each would have
exited 1 with nothing planted at all. Only the missing-locale arm failed on its own
message. The round was declared invalid, the comment reworded (not stripped from
the scan, which would have left a place for a real price to hide), the control
watched green, and five arms re-run, each checked to fire on **its own pattern
id**. W16-02 records it.

**The two cases are the same failure at two levels.** In case 1 the process whose
exit code was read was the wrong process. In case 2 it was the right process, but
nothing had established what its exit code meant. Both produced a plausible
"passed" that was not evidence of anything.

## How it relates to what is already ruled

R-P and `docs/CLAUDE.md` section 13 already hold that **absent evidence is not
positive evidence** and that **an assertion nobody has watched fail is not a
gate**. R-AB does not restate those. It closes the gap between them and a report:
a gate can be correct, watched failing, and wired into `quality`, and a run can
still report the wrong number for it. Section 13 governs what a gate may conclude.
R-AB governs what a report may say about a gate.

The "absence of a complaint" clause is R-P's, carried in so the list of
non-evidence is complete in one place.

## What the ruling requires in practice

- **Read the gate's own exit code, from the gate's own process.** Capture it on
  the line immediately after the gate runs, before any other command can overwrite
  `$?`: `node scripts/check-links.js; echo "check-links exit=$?"`. Report the
  printed `exit=` line, never the status of the job, shell, loop or tool call that
  contained it.
- **A pipe hides the exit code.** `node gate.js | tail -5` reports `tail`'s status.
  Run the gate unpiped, or read `pipestatus` (zsh) or `PIPESTATUS` (bash) for the
  gate's element.
- **A gate that ran in the background is not reported until its output is read.**
  The completion notice is the wrapper's status, which is case 1 exactly.
- **A negative arm is evidence only against a control watched green in the same
  run**, immediately before it, and again after the last arm so the arms are shown
  to have left no residue. Each arm must fail on **its own** message or pattern id,
  not merely exit non-zero.
- **A report names the process.** "Links pass" is not a report. "`node
  scripts/check-links.js` exit 0" is.
- **In CI, the step is the process.** Each `quality` step runs one gate as its own
  process, and GitHub records that step's conclusion from that process's exit code.
  A gate reported as passed in CI names the step and the run, read per step from
  `gh run view <run> --json jobs`, not from the PR's check rollup.

## Implementation: there is no gate, and that is the finding

**This ruling cannot be gated in this repo, and a gate that cannot fail is worse
than no gate.** Its subject is reports: what a run says about a gate, in a terminal,
in a PR body, in a decision entry. None of that is a file `quality` can execute
against with a meaningful failure. A scanner over `DECISIONS.md` for gate claims
that name no process would read free prose and pass or fail on phrasing, and its
immutable bodies (R-S) hold years of entries it would either flag forever or exempt
wholesale.

R-Z set the precedent in its clause 2, enforced by review and saying so, and R-AA
followed it. **R-AB is recorded as a practice ruling**: it binds how a run gathers
and reports evidence, and it is enforced by conduct and by this record. Saying so
is the point. A ruling that implies a check it does not have is the failure
section 13 exists to prevent, and it would be this ruling's own case 2.

## Recorded interpretations, each open for ratification

1. **The merge authority is unchanged.** A SELF card still self-merges on a green
   `quality` check, as the wave's dispatch grants. That is a policy about when a
   merge is permitted, not a report that a named gate passed. When a run reports
   **which** gates passed in CI, it reads and names the steps, per the last bullet
   above.
2. **"Its own output" is read as required, not optional.** An exit 0 with output
   saying the gate did not measure (a skip line, a zero count where a count is
   required) is not a pass. The exit code and the output must agree, and where they
   disagree the run reports the disagreement.
3. **A gate not read is reported NOT RUN**, never passed and never omitted. This is
   how gate 5 was reported before W16-04, and it is the correct form.
4. **"Watched green" means in the same run, on the same tree.** A control that was
   green yesterday, or on another branch, or before a rebuild, is not the control
   for today's arms.
5. **This ruling binds the executor, not the repo.** Nothing in the shipped site
   changes and no gate is added. The only artifacts are this file and the decision
   record.
