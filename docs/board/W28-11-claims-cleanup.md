# W28-11 · Claims cleanup, fifteen years, the Google reviews link

Card W28-11. Branch `w28/w28-11-claims-cleanup`, stacked on W28-00 (#168). Under your rulings
R-W28-02 and R-W28-03 and the wave 28 dispatch's "R-X enforcement".

## What this card does

- **Every discount claim is gone, in both languages.** The orange promo bar ("Reducere 10% la orice
  serviciu doar până în 2027"), the "−10% la programări anticipate" line in the hero card and in the
  footer, the discount sentence inside five FAQ answers, and the "Reduceri" tile on the roofing hub,
  which now says "Solicită ofertă" because that is where it takes the visitor. The gate that enforces
  R-X now refuses any discount, percent-off, "until <year>" or early-booking string, so none can
  come back unnoticed.
- **The review score and count are gone**: the "4.9/5 din 250+ recenzii" stat card and the rating
  panel with the stars. The three testimonials stay exactly as they were.
- **"15+ ani de experiență" everywhere** (R-W28-02): the stat card already said it; the "De ce
  Rapid Construct" team line said "10+" and two FAQ answers said "peste zece ani". All say fifteen now,
  in Romanian and Russian.
- **The Google reviews link is live** (R-W28-03), under the three testimonials, "Vezi recenziile pe
  Google" / "Смотреть отзывы в Google", opening in a new tab. Your share link resolved to the
  "Rapid Construct" knowledge panel on google.com rather than to Maps, so per your rule it is used
  as given.

## What to look at

- `https://rapidconstruct.md/` and `/ru/`: no orange bar at the top; three stat cards under the
  hero and three on the dark band; the "De ce Rapid Construct" team line reads "15+"; under "Ce
  spun clienții" the three quotes and then the Google link, which opens your reviews.
- `https://rapidconstruct.md/servicii/acoperisuri/`: the hub's fourth tile reads "Solicită ofertă".
- Any FAQ that used to end in "…se aplică o reducere de zece la sută" now ends at the price sentence.

## Heights

Every page is 44px shorter without the bar; the home pages 29 (RO) and 111 (RU) shorter. All 55
budgets re-measured and moved (R-Y).

## Gates

All 29 gate commands exit 0 locally (`node scripts/run-gates.js --keep-going`); the new discount
arms were watched fail on a planted string and pass on the restored control; the live-check
readiness proof passed all its arms against the live origin. CI runs the full 29 on the pull request.
