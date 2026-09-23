# W27-FIX-01 · Budgets after the 14px floor

Card W27-FIX-01. Branch `w27/w27-fix-01-budgets`, from `main` with #143 merged.

## What happened

The live check after #143 (the warm tokens card) passed every content check and failed on two page
heights: the metal tile page grew 64px (RO) and 86px (RU) past its budget, because the card raised
the small print on its tiles from 12 and 13px to 14px and the grid gained two lines.

## What this does

Re-measures every one of the 53 budgeted pages on the site as deployed and sets each budget to its
measurement plus 60. Nothing on any page changes.

## Gates

Static gates exit 0. CI runs the full 29.
