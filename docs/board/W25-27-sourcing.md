# W25-27 · The fallback origin, applied, and the file that was a shop's logo

Card W25-27. Branch `w25/w25-27-sourcing`, stacked on `w25/w25-26-tigla-merge`. PR only,
stops for the owner.

## What this ships

**W25-R20 applied to every empty product slot it reaches. 25 attempted, 12 filled**, and the
ledger goes from **287 to 299 of 337**.

## A correction to W25-R20's record, made before acting on it

The register's reading of that ruling said W25-R2's refusals were untouched, so "never a
retailer's or marketplace's own product listing" still held. **That narrowed the ruling to
nothing.** The owner's words are *"from any site except Russian domains"*, and a search for a
building product in this region returns retailers almost exclusively, so a rule that still
refused a retailer's page would have left every one of these slots grey and **the fallback
would never once have applied**.

The register's own header says the prose under a quote is this terminal's reading and open for
ratification while the quote is not, so the reading is struck and corrected there.

**What genuinely survives is about the PICTURE, not the host**, which is the half no host rule
ever covered: a watermark, a retailer's logo and a person's face. That is what a person looks
for, and this card is why that matters.

## `--google-pick`, and the one exception that is not lifted

`scripts/fetch-packshot.js` takes the flag, and it does exactly two things: it lifts the SHOPS
refusal for a run that says so, and it **adds the Russian-domain refusal** the ruling names,
which applies with or without the flag. Four arms watched:

```
penoplex.ru, no flag        REFUSED: on a Russian domain
emag.ro, no flag            REFUSED: looks like a retailer ... pass --google-pick
emag.ro, --google-pick      allowed past the guard
shop.penoplex.su, flag set  REFUSED: on a Russian domain
```

## Attempted and filled, per slot

**Filled, 12.** Nine by search (`google_pick`), three from the manufacturer's own site.

| Slot | Product | Origin | Where from |
|---|---|---|---|
| `CAT-0008` | Vată minerală Thermowool Fas Efect | google_pick | domic.md |
| `CAT-0016` | Adeziv Kreisel 215 | google_pick | domic.md |
| `CAT-0017` | Adeziv Baumit Bianco Alb | google_pick | domic.md |
| `CAT-0018` | Adeziv DuoContact Baumit | google_pick | domic.md |
| `CAT-0019` | Baumit Pro Contact | google_pick | domic.md |
| `CAT-0023` | Mesterul dibaci VATĂ MINERALĂ | google_pick | tehnoizol.md |
| `CAT-0026` | Baumit SilikonTop | google_pick | dedeman.ro |
| `CAT-0032` | Duraziv Standard TDS cu silicon | google_pick | muralshop.ro |
| `CAT-0192` | Isomat Flexcoat | google_pick | dedeman.ro |
| `NVK-01` | Novatik Classic | manufacturer official site | novatik.ro |
| `NVK-03` | Novatik Roman | manufacturer official site | novatik.ro |
| `NVK-04` | Novatik Wood | manufacturer official site | novatik.ro |

**Attempted and not filled, 13**, each with the reason it failed rather than a shrug:

| Slot | Product | Why not |
|---|---|---|
| `CAT-0006` | Polistiren Penoplex | its only source is `penoplex.ru`, and the Russian-domain refusal is the one exception W25-R20 keeps |
| `CAT-0007` | Tehnoplex XPS Carbon | stocked by neither shop that carries the rest of this list |
| `CAT-0009` | Vată minerală OBIO 165 | both shops carry OBIO at other densities and a different Izovat line. **W25-R4: never a near match** |
| `CAT-0011` | Vată minerală FAWORI | no stockist found |
| `CAT-0012` | Vată minerală Novoterm | no stockist found |
| `CAT-0027` | Baumit DuoTop | not at either shop |
| `CAT-0037` | Duraziv Clima Protect | not at either shop |
| `CAT-0038` | ROKO Omitka Rokomozaikova | no stockist found |
| `CAT-0194` | Stancolac Ultrapal | no stockist found |
| `CAT-0003` | Polistiren expandat EPS-50 to 200 | a generic description, no single product to search for |
| `CAT-0022` | Mesterul dibaci POLISTIREN | the shop that had its mineral-wool twin lists only that one |
| `CAT-0025` | Diblu din oțel LGX | no stockist found |
| `NVK-02` | Novatik Slate | its own maker publishes a 749x200 banner and an installation diagram, neither a picture of the tile on a roof |

## Two Novatik images were refused for what was printed on them

`classic-mat.png` and `wood-mat.png` are 1,295px and clear the floor. **Both carry
`20 ANI GARANȚIE ESTETICĂ` and `30 ANI GARANȚIE TEHNICĂ` burned into the picture.**

W24-R6 holds every warranty sentence until the owner ticks it, and Q-W25-19 is open on exactly
this for the fences. **An image can publish a held claim as surely as a sentence can**, and
nothing in this repo reads text inside a photograph. They were refused by eye.

## And one file was a shop's logo

`CAT-0026` was installed from `cdn.dedeman.ro/.../5000354.jpg`, which is the same URL shape as
every other product on that CDN. **It is the Dedeman logo on a white ground.** The product
photo is at `5000354_1.jpg`; the bare SKU is a fallback the CDN serves when there is no
primary image at that path.

It was caught on the contact sheet, which is the step `fetch-packshot.js` prints a reminder
about on every single run: *"A PERSON MUST LOOK AT THIS FILE: no check here sees a watermark,
a retailer logo, a face or another seller's branding."* **A guessed URL shape reached the
repo and a person's eye is what stopped it.** Refetched from the right path and looked at
again.

## The review list

**Nine rows carry a `google_pick` flag**, derived from the origin so it cannot be forgotten on
a row, with the source URL beside it. That is W25-R20's other half: *"Owner reviews and
corrects afterwards"*, and the owner cannot review a row they cannot see.

## Q-W25-20: both libraries the secondary-image ruling names refuse us

`COP-HERO`, `COPX-01` and `COPX-02` are not filled and the reason is not the products.
**W25-R23 names Unsplash and Pexels, and both refuse automated access**: Unsplash answers 307,
Pexels 403, and the Pexels API 401 without a key. A free key would work and is a new vendor
credential, which needs the owner's word. Four options in the question; the fastest is the
owner choosing the pictures and dropping them in `RC-pics-real/`.

## Slots and gates

**287 to 299 of 337.** No height moved: a filled slot takes the placeholder's own box from the
same `--ph-ratio`, so no budget changed. **25 of 25 gate commands exit 0.**

## Recorded for ratification

1. **W25-R20's recorded reading is corrected, not worked around.** The struck text is left
   visible in the register beside the correction.
2. **An image can publish a held claim.** Two Novatik files were refused for the warranty
   printed on them.
3. **A guessed CDN URL shape served a logo.** Look at every file; the fetch tool says so on
   every run and this is the run that proved it.
