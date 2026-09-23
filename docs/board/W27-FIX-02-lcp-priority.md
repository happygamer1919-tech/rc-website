# W27-FIX-02 · The roofing page's first picture loads first

Card W27-FIX-02. Branch `w27/w27-fix-02-lcp-priority`, a review fix.

## What the review found

The roofing page's speed score flips between 98 and 92 from run to run, and did before this wave: the
first big tile picture is the page's largest paint, and the browser was not told to fetch it first.

## What this does

One attribute on that picture (`fetchpriority="high"`) on both hub pages. Five runs after: four at
98, one cold run at 92. Nothing on the page moves.

## Gates

Static gates exit 0. CI runs the full 29.
