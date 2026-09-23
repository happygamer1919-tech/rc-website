# W27-IMPERLUX-MIRROR · the full mirror sweep, 2026-09-22

**Card W27-C-06, ruling W27-R-04.** Every product page under `https://imperlux.md/acoperisuri/` and
`https://imperlux.md/garduri/` was read in headless Chrome, rendered DOM after network idle (W26-R2):
47 pages in the first pass (the six section pages, 31 roofing product pages, the fence list, the fence
calculator and 8 fence model pages) and the 21 metal tile accessory pages in a second pass. The
captures live in the session's scratch; the counts below are read from `content/roofing-sections.json`,
`content/catalog-products.json`, `content/novatik.json` and `content/garduri-modele.json` as this card
leaves them, and "before" from the same files as W27-R-00 left them.

## Per group: Imperlux count, RC before, RC after

| Group | Imperlux | RC before | RC after | What changed |
|---|---|---|---|---|
| `tigla-metalica` | 7 | 4 | 11 (7 Imperlux, 4 Dasterum) | W27-C-03: the seven Imperlux models first; four Dasterum models kept, no name matched |
| `tabla-cutata` | 0 | 0 | 7 (0 Imperlux, 7 Dasterum) | W27-C-02: not on Imperlux; the seven Dasterum sheets in their own group |
| `tigla-ceramica` | 1 | 1 | 1 (1 Imperlux, 0 Dasterum) | W27-C-06: Creaton Rapido aligned (preview, tagline, warranty, colour) |
| `sindrila-bituminoasa` | 2 | 2 | 2 (2 Imperlux, 0 Dasterum) | W27-C-05: both IKO shingles aligned |
| `sisteme-pluviale` | 17 | 18 | 18 (17 Imperlux, 1 Dasterum) | W27-C-06: all 17 aligned; the 11 that folded a Dasterum record take Imperlux's picture and no price, Cot burlan 90 mm (Dasterum only) kept |
| `accesorii-de-acoperis` | 21 | 53 | 66 (20 Imperlux, 46 Dasterum) | W27-C-06: 20 of Imperlux's 21 added (Folie anticondens has no picture at the floor); 46 Dasterum records kept, no exact name matched |
| Rocă vulcanică Novatik (`/servicii/roca-vulcanica/`) | 4 | 4 | 4 | W27-C-04: prices, chips, warranty, previews aligned |
| Garduri, fence models (`/servicii/modele-garduri/`) | 8 | 8 | 8 | already aligned: every price, style, thickness and colour count equals Imperlux's page tonight; pictures are Imperlux's since W25-R15 |
| Hub tiles, roofing | 5 | 4 + 5 | 4 + 5 | ACOP-01, 02, 06, 07 are Imperlux's tile images (W26-R3, W26-R10); ACOP-03, 04, 08 have no Imperlux counterpart and carry the owner's photographs (W26-R11); ACOP-05 the Creaton crop; ACOP-09 the T-12 packshot |
| Hub tiles, fences | 4 | 4 | 4 | GARDB-01 to 04, Imperlux's since W25-R19 |

**Not added, and why.** Folie anticondens: Imperlux publishes only a 260x260 picture, under the 450
floor (W25-R4). The "Accesorii Novatik Natura" (22 tiles) and "Accesorii Creaton" (21 tiles) blocks on
the Novatik and Creaton pages are names and pictures with no page, no price and no spec; they are listed
at the foot and not made into products.

**Prices.** Imperlux publishes a current price for the 7 metal tiles, the 4 Novatik models, the ceramic
tile and the 2 shingles, and none for any rainwater part or accessory ("Solicită prețul"). Under
W27-R-04 the eleven rainwater parts that used to print a folded Dasterum "de la" now ask for a price;
the Dasterum figure stays in each record as `price_folded_not_shown`.

## Every RC record in the six roofing groups, with its source URL

| Slot | Group | Name | Source | URL |
|---|---|---|---|---|
| ACIM-10 | tigla-metalica | Barcelona | imperlux.md | https://imperlux.md/acoperisuri/produse/tigla-metalica/barcelona/ |
| ACIM-11 | tigla-metalica | Madrid | imperlux.md | https://imperlux.md/acoperisuri/produse/tigla-metalica/madrid/ |
| ACIM-12 | tigla-metalica | Bavaria | imperlux.md | https://imperlux.md/acoperisuri/produse/tigla-metalica/bavaria/ |
| ACIM-13 | tigla-metalica | Heta | imperlux.md | https://imperlux.md/acoperisuri/produse/tigla-metalica/heta/ |
| ACIM-14 | tigla-metalica | Zet | imperlux.md | https://imperlux.md/acoperisuri/produse/tigla-metalica/zet/ |
| ACIM-15 | tigla-metalica | Finn | imperlux.md | https://imperlux.md/acoperisuri/produse/tigla-metalica/finn/ |
| ACIM-16 | tigla-metalica | Izi | imperlux.md | https://imperlux.md/acoperisuri/produse/tigla-metalica/izi/ |
| CAT-0224 | tigla-metalica | Țiglă metalică Monterrey | dasterum.md | https://www.dasterum.md/ro/232323/ |
| CAT-0225 | tigla-metalica | Țiglă metalică Valencia | dasterum.md | https://www.dasterum.md/tigla-metalica-valencia/ |
| CAT-0226 | tigla-metalica | Țiglă metalică modulară | dasterum.md | https://www.dasterum.md/igla-metalica-modulara/ |
| CAT-0227 | tigla-metalica | Țiglă metalică Kascad | dasterum.md | https://www.dasterum.md/igla-metalica-kascad/ |
| CAT-0228 | tabla-cutata | Tabla cutată T-12 | dasterum.md | https://www.dasterum.md/tabla-cutata-t-12/ |
| CAT-0229 | tabla-cutata | Tabla cutată VP-20 (ondulată) | dasterum.md | https://www.dasterum.md/tabla-cutata-vp-20-ondulata/ |
| CAT-0230 | tabla-cutata | Tabla cutată PK-20 | dasterum.md | https://www.dasterum.md/ro/profnastil-pk-20-glyancevyj/ |
| CAT-0231 | tabla-cutata | Tabla cutată H-35 | dasterum.md | https://www.dasterum.md/tabla-cutata-h-35/ |
| CAT-0232 | tabla-cutata | Tabla cutată C-15 | dasterum.md | https://www.dasterum.md/tabla-cutata-c-15/ |
| CAT-0233 | tabla-cutata | Tabla cutată С-44 | dasterum.md | https://www.dasterum.md/tabla-cutata-s-44/ |
| CAT-0234 | tabla-cutata | Tabla cutată H-60 | dasterum.md | https://www.dasterum.md/tabla-cutata-h-60/ |
| ACIM-01 | tigla-ceramica | Creaton Rapido | imperlux.md | https://imperlux.md/acoperisuri/produse/tigla-ceramica/creaton-rapido/ |
| ACIM-02 | sindrila-bituminoasa | IKO Cambridge | imperlux.md | https://imperlux.md/acoperisuri/produse/shingle/iko-cambridge/ |
| ACIM-03 | sindrila-bituminoasa | IKO Superglass Hex | imperlux.md | https://imperlux.md/acoperisuri/produse/shingle/iko-hex/ |
| ACIM-17 | sisteme-pluviale | Jgheab | imperlux.md | https://imperlux.md/acoperisuri/produse/sisteme-pluviale/jgheab/ |
| ACIM-18 | sisteme-pluviale | Burlan | imperlux.md | https://imperlux.md/acoperisuri/produse/sisteme-pluviale/burlan/ |
| ACIM-19 | sisteme-pluviale | Colțar interior | imperlux.md | https://imperlux.md/acoperisuri/produse/sisteme-pluviale/coltar-interior/ |
| ACIM-20 | sisteme-pluviale | Colțar exterior | imperlux.md | https://imperlux.md/acoperisuri/produse/sisteme-pluviale/coltar-exterior/ |
| ACIM-21 | sisteme-pluviale | Brățară jgheab | imperlux.md | https://imperlux.md/acoperisuri/produse/sisteme-pluviale/bratara-jgheab/ |
| ACIM-22 | sisteme-pluviale | Capac jgheab | imperlux.md | https://imperlux.md/acoperisuri/produse/sisteme-pluviale/capac-jgheab/ |
| ACIM-23 | sisteme-pluviale | Cârlig jgheab | imperlux.md | https://imperlux.md/acoperisuri/produse/sisteme-pluviale/carlig-jgheab/ |
| ACIM-24 | sisteme-pluviale | Cârlig jgheab lung | imperlux.md | https://imperlux.md/acoperisuri/produse/sisteme-pluviale/carlig-jgheab-lung/ |
| ACIM-04 | sisteme-pluviale | Cârlig pazie universal | imperlux.md | https://imperlux.md/acoperisuri/produse/sisteme-pluviale/carlig-pazie-universal/ |
| ACIM-25 | sisteme-pluviale | Racord jgheab-burlan | imperlux.md | https://imperlux.md/acoperisuri/produse/sisteme-pluviale/racord-jgheab-burlan/ |
| ACIM-05 | sisteme-pluviale | Cot 60° | imperlux.md | https://imperlux.md/acoperisuri/produse/sisteme-pluviale/cot-60/ |
| ACIM-06 | sisteme-pluviale | Prelungitor | imperlux.md | https://imperlux.md/acoperisuri/produse/sisteme-pluviale/prelungitor/ |
| ACIM-26 | sisteme-pluviale | Brățară burlan | imperlux.md | https://imperlux.md/acoperisuri/produse/sisteme-pluviale/bratara-burlan/ |
| ACIM-07 | sisteme-pluviale | Pâlnie colectoare | imperlux.md | https://imperlux.md/acoperisuri/produse/sisteme-pluviale/palnie-colectoare/ |
| ACIM-08 | sisteme-pluviale | Ramificație burlan | imperlux.md | https://imperlux.md/acoperisuri/produse/sisteme-pluviale/ramificatie-burlan/ |
| ACIM-09 | sisteme-pluviale | Element captare | imperlux.md | https://imperlux.md/acoperisuri/produse/sisteme-pluviale/element-captare/ |
| ACIM-27 | sisteme-pluviale | Cot evacuare | imperlux.md | https://imperlux.md/acoperisuri/produse/sisteme-pluviale/cot-evacuare/ |
| CAT-0263 | sisteme-pluviale | Cot burlan 90 mm | dasterum.md | https://www.dasterum.md/ro/koleno-verhnee-90-mm/ |
| ACIM-28 | accesorii-de-acoperis | Coamă Titan | imperlux.md | https://imperlux.md/acoperisuri/produse/accesorii/coama-titan/ |
| ACIM-29 | accesorii-de-acoperis | Coamă semicirculară | imperlux.md | https://imperlux.md/acoperisuri/produse/accesorii/coama-semicirculara/ |
| ACIM-30 | accesorii-de-acoperis | Dolie | imperlux.md | https://imperlux.md/acoperisuri/produse/accesorii/dolie/ |
| ACIM-31 | accesorii-de-acoperis | Capac coamă circulară | imperlux.md | https://imperlux.md/acoperisuri/produse/accesorii/capac-coama-circulara/ |
| ACIM-32 | accesorii-de-acoperis | Coamă de început | imperlux.md | https://imperlux.md/acoperisuri/produse/accesorii/coama-de-inceput/ |
| ACIM-33 | accesorii-de-acoperis | Sort streașină | imperlux.md | https://imperlux.md/acoperisuri/produse/accesorii/sort-streasina/ |
| ACIM-34 | accesorii-de-acoperis | Racord perete | imperlux.md | https://imperlux.md/acoperisuri/produse/accesorii/racord-perete/ |
| ACIM-35 | accesorii-de-acoperis | Bordură fronton | imperlux.md | https://imperlux.md/acoperisuri/produse/accesorii/bordura-fronton/ |
| ACIM-36 | accesorii-de-acoperis | Bordură fronton sub șindrilă | imperlux.md | https://imperlux.md/acoperisuri/produse/accesorii/bordura-fronton-sub-sindrila/ |
| ACIM-37 | accesorii-de-acoperis | Opritor zăpadă | imperlux.md | https://imperlux.md/acoperisuri/produse/accesorii/opritor-zapada/ |
| ACIM-38 | accesorii-de-acoperis | Opritor zăpadă potcoavă | imperlux.md | https://imperlux.md/acoperisuri/produse/accesorii/opritor-zapada-potcoava/ |
| ACIM-40 | accesorii-de-acoperis | Membrana Superdifuzie MDM S | imperlux.md | https://imperlux.md/acoperisuri/produse/accesorii/membrana-superdifuzie-mdm-s/ |
| ACIM-41 | accesorii-de-acoperis | Membrana Superdifuzie MDM M | imperlux.md | https://imperlux.md/acoperisuri/produse/accesorii/membrana-superdifuzie-mdm-m/ |
| ACIM-42 | accesorii-de-acoperis | Membrana Superdifuzie MDM L | imperlux.md | https://imperlux.md/acoperisuri/produse/accesorii/membrana-superdifuzie-mdm-l/ |
| ACIM-43 | accesorii-de-acoperis | Membrana Superdifuzie MDM XL | imperlux.md | https://imperlux.md/acoperisuri/produse/accesorii/membrana-superdifuzie-mdm-xl/ |
| ACIM-44 | accesorii-de-acoperis | Membrana Superdifuzie MDM XXL | imperlux.md | https://imperlux.md/acoperisuri/produse/accesorii/membrana-superdifuzie-mdm-xxl/ |
| ACIM-45 | accesorii-de-acoperis | Banda ventilare coamă MDM Blachvent 175 | imperlux.md | https://imperlux.md/acoperisuri/produse/accesorii/banda-ventilare-coama-blachvent/ |
| ACIM-46 | accesorii-de-acoperis | Banda ventilare streașină cu mustață | imperlux.md | https://imperlux.md/acoperisuri/produse/accesorii/banda-ventilare-streasina-musteata/ |
| ACIM-47 | accesorii-de-acoperis | Banda ventilare streașină cu perforație | imperlux.md | https://imperlux.md/acoperisuri/produse/accesorii/banda-ventilare-streasina-perforatie/ |
| ACIM-48 | accesorii-de-acoperis | Buretă autodezivă pentru dolie | imperlux.md | https://imperlux.md/acoperisuri/produse/accesorii/bureta-autodeziva-dolie/ |
| CAT-0235 | accesorii-de-acoperis | DRIPSTOP, acoperire anticondens pentru tablă profilată | dasterum.md | https://www.dasterum.md/dripstop-acoperire-anticondens-pentru-tabla-profilata/ |
| CAT-0236 | accesorii-de-acoperis | Membrana superdifuză DACHMASTER 100 1,5m*50m | dasterum.md | https://www.dasterum.md/ro/dachmaster-100-15m50m/ |
| CAT-0237 | accesorii-de-acoperis | Eurovent grila Ventilare, RAL 8004. 500*8 cm | dasterum.md | https://www.dasterum.md/eurovent-grila-ventilare-ral-8004.-5008-cm/ |
| CAT-0238 | accesorii-de-acoperis | Eurovent grila Ventilare, RAL 8019. 500*8 cm | dasterum.md | https://www.dasterum.md/eurovent-grila-ventilare-ral-8019.-5008-cm/ |
| CAT-0239 | accesorii-de-acoperis | Membrana pentru acoperiș Eurovent HOME PRO 1,5m*50m | dasterum.md | https://www.dasterum.md/membrana-pentru-acoperis-eurovent-home-pro/ |
| CAT-0240 | accesorii-de-acoperis | Membrana superdifuză DACHMASTER 120 1,5m*50m | dasterum.md | https://www.dasterum.md/ro/dachmaster-120-15m50m/ |
| CAT-0241 | accesorii-de-acoperis | Membrana superdifuză Decora 80 1,5m*50m | dasterum.md | https://www.dasterum.md/ro/decora-80-15m50m/ |
| CAT-0242 | accesorii-de-acoperis | Membrana superdifuză Decora 100 1,5m*50m | dasterum.md | https://www.dasterum.md/ro/decora-100-15m50m/ |
| CAT-0243 | accesorii-de-acoperis | Membrana superdifuză Decora 120 1,5m*50m | dasterum.md | https://www.dasterum.md/ro/decora-120-15m50m/ |
| CAT-0244 | accesorii-de-acoperis | Membrana superdifuză Decora 135 1,5m*50m | dasterum.md | https://www.dasterum.md/ro/decora-135-15m50m/ |
| CAT-0245 | accesorii-de-acoperis | Membrana superdifuză Decora 150 1,5m*50m | dasterum.md | https://www.dasterum.md/ro/decora-150-15m50m/ |
| CAT-0246 | accesorii-de-acoperis | Membrana superdifuză Decora 180 1,5m*50m | dasterum.md | https://www.dasterum.md/ro/decora-180-15m50m/ |
| CAT-0247 | accesorii-de-acoperis | Dachmaster Alu 80 PARAIZOLARE 1,5m*50m | dasterum.md | https://www.dasterum.md/dachmaster-alu-80-paraizolare/ |
| CAT-0248 | accesorii-de-acoperis | Pieptene streasina Eurovent Comb X, RAL 9005 | dasterum.md | https://www.dasterum.md/pieptene-streasina-eurovent-comb-x-ral-9005/ |
| CAT-0249 | accesorii-de-acoperis | Bandă-etanșant Eurovent COMPRI | dasterum.md | https://www.dasterum.md/banda-etansant-eurovent-compri/ |
| CAT-0250 | accesorii-de-acoperis | Eurovent BUTYL banda adeziva dublă | dasterum.md | https://www.dasterum.md/eurovent-butyl-banda-adeziva-dubla/ |
| CAT-0251 | accesorii-de-acoperis | Bandă TOPBAND din polipropilenă cu autoadeziv unilateral | dasterum.md | https://www.dasterum.md/banda-topband-din-polipropilena-cu-autoadeziv-unilateral/ |
| CAT-0252 | accesorii-de-acoperis | BANDĂ AUTOADEZIVĂ EUROVENT PUR | dasterum.md | https://www.dasterum.md/band-autoadeziv-eurovent-pur/ |
| CAT-0253 | accesorii-de-acoperis | Banda autoadezivă Eurovent DUO | dasterum.md | https://www.dasterum.md/banda-autoadeziva-eurovent-duo/ |
| CAT-0254 | accesorii-de-acoperis | Banda FLEXBIT pentru lipirea și etanșarea acoperișurilor | dasterum.md | https://www.dasterum.md/banda-flexbit-pentru-lipirea-si-etansarea-acoperisurilor/ |
| CAT-0255 | accesorii-de-acoperis | Banda coamă ROLL ECCO pentru ventilare | dasterum.md | https://www.dasterum.md/banda-coama-roll-ecco-pentru-ventilare/ |
| CAT-0256 | accesorii-de-acoperis | Banda autocolantă Flex 3D | dasterum.md | https://www.dasterum.md/banda-autocolanta-flex-3d/ |
| CAT-0271 | accesorii-de-acoperis | Opritor de zapadă cilindric | dasterum.md | https://www.dasterum.md/ro/trubchatyj-snegoupor/ |
| CAT-0272 | accesorii-de-acoperis | Coamă dreaptă | dasterum.md | https://www.dasterum.md/coama-dreapta/ |
| CAT-0273 | accesorii-de-acoperis | Coamă semirotundă | dasterum.md | https://www.dasterum.md/coama-semirotunda/ |
| CAT-0274 | accesorii-de-acoperis | Bordura de fronton | dasterum.md | https://www.dasterum.md/bordura-de-fronton-l2000-mm/ |
| CAT-0275 | accesorii-de-acoperis | Reținător de zăpadă | dasterum.md | https://www.dasterum.md/retinator-de-zapada-l2000mm/ |
| CAT-0276 | accesorii-de-acoperis | Dolie de sus | dasterum.md | https://www.dasterum.md/dolie-de-sus-l2000mm/ |
| CAT-0277 | accesorii-de-acoperis | Dolie interioară | dasterum.md | https://www.dasterum.md/dolie-de-jos-l2000mm/ |
| CAT-0278 | accesorii-de-acoperis | Placă de racordare cu margine | dasterum.md | https://www.dasterum.md/ro/planka-primykaniya-so-shtroboj-l2000mm/ |
| CAT-0279 | accesorii-de-acoperis | Placă de racordare fără margine | dasterum.md | https://www.dasterum.md/ro/planka-primykaniya-bez-shtroby-l2000mm/ |
| CAT-0280 | accesorii-de-acoperis | Lacrimar | dasterum.md | https://www.dasterum.md/ro/kapelinik-krovelinyj/ |
| CAT-0281 | accesorii-de-acoperis | Regleta frontală L 150*50mm | dasterum.md | https://www.dasterum.md/ro/lobovaya-l-planka-15050mm/ |
| CAT-0282 | accesorii-de-acoperis | Parapet 100mm | dasterum.md | https://www.dasterum.md/ro/parapet-100mm-l2000mm/ |
| CAT-0283 | accesorii-de-acoperis | Lacrimar de fereastră 200mm | dasterum.md | https://www.dasterum.md/ro/otliv-200mm/ |
| CAT-0284 | accesorii-de-acoperis | Lacrimar de fereastră 150mm | dasterum.md | https://www.dasterum.md/ro/otliv-150mm/ |
| CAT-0285 | accesorii-de-acoperis | Colțar interior 50*50mm | dasterum.md | https://www.dasterum.md/coltar-interior-5050-l2000mm/ |
| CAT-0286 | accesorii-de-acoperis | Colțar interior 100*100mm | dasterum.md | https://www.dasterum.md/coltar-interior-100100-l2000mm/ |
| CAT-0287 | accesorii-de-acoperis | Colțar exterior 50*50mm | dasterum.md | https://www.dasterum.md/coltar-exterior-5050-l2000mm/ |
| CAT-0288 | accesorii-de-acoperis | Colțar exterior 100*100mm | dasterum.md | https://www.dasterum.md/coltar-exterior-100100-l2000mm/ |
| CAT-0289 | accesorii-de-acoperis | Spray vopsea | dasterum.md | https://www.dasterum.md/spray-vopsea/ |
| CAT-0290 | accesorii-de-acoperis | Șurub pentru profil 5,5*32mm, zincat | dasterum.md | https://www.dasterum.md/ro/samorezy-krovelinye-po-shvelleru-5532/ |
| CAT-0291 | accesorii-de-acoperis | Șurub de acoperiș pentru metal 4,8*19mm. | dasterum.md | https://www.dasterum.md/ro/samorezy-krovelinye-po-derevu/n/ |
| CAT-0292 | accesorii-de-acoperis | Fixator pentru Euro-gard cu surub autoforant | dasterum.md | https://www.dasterum.md/ro/kreplenie-dlya-evro-zabora-s-samorezom/ |
| CAT-0293 | accesorii-de-acoperis | Șuruburi de acoperiș pentru lemn 4.8*35 în asortiment | dasterum.md | https://www.dasterum.md/ro/samorezy-krovelinye-po-derevu/ |
| CAT-0294 | accesorii-de-acoperis | Metize 3,5*9,5mm | dasterum.md | https://www.dasterum.md/ro/samorez-3595mm-v-assortimente/ |

## Novatik and fence records

| Record | Name | Source URL |
|---|---|---|
| NVK | Novatik Classic | https://imperlux.md/acoperisuri/produse/tigla-roca-vulcanica/novatik-classic/ |
| NVK | Novatik Slate | https://imperlux.md/acoperisuri/produse/tigla-roca-vulcanica/novatik-slate/ |
| NVK | Novatik Roman | https://imperlux.md/acoperisuri/produse/tigla-roca-vulcanica/novatik-roman/ |
| NVK | Novatik Wood | https://imperlux.md/acoperisuri/produse/tigla-roca-vulcanica/novatik-wood/ |
| GARD | RC12 Metal Plus | https://imperlux.md/garduri/garduri/il12-plus |
| GARD | RC12 Metal PlusDV | https://imperlux.md/garduri/garduri/il12-plusdv |
| GARD | RC30 Metal Plus | https://imperlux.md/garduri/garduri/il30-plus |
| GARD | RC30 Metal PlusDV | https://imperlux.md/garduri/garduri/il30-plusdv |
| GARD | RC100 Metal Plus | https://imperlux.md/garduri/garduri/il100-plus |
| GARD | RC100 Metal PlusDV | https://imperlux.md/garduri/garduri/il100-plusdv |
| GARD | RC40 Metal Plus | https://imperlux.md/garduri/garduri/il40-plus |
| GARD | RC40 Metal PlusDV | https://imperlux.md/garduri/garduri/il40-plusdv |

## Imperlux accessory tiles without a page, listed and not added

**Accesorii Novatik Natura** (22): Coamă rectangulară, Coamă rotundă 3 elemente, Capac coamă rotundă, Șorț de coamă, Șorț picurător, Element racord perete, Racord lateral perete stânga, Racord lateral perete dreapta, Dolie, Șorț de streașină, Pazie, Pazie decupată stânga, Pazie decupată dreapta, Tablă plană, Ventilație de câmp, Ventilație sanitară, Cuie 1.5 kg / cutie, Kit retuș, Bandă etanșare șipcă, Membrană anticondens, Element ventilație și protecție păsări, Suport panou fotovoltaic INOX.

**Accesorii Creaton** (21): Țiglă jumătate, Țiglă OGL, Țiglă dublă ondulată, Țiglă de ventilație, Țiglă fălțuită, Țiglă OGL fălțuită, Țiglă Pultdach, Ventilație SIGA, Ventilație SIGNUM 125, Ventilație SIGNUM 150/160, Trecere antenă, Coamă FIRST, Coamă GRATA, Coamă GRATA rotundă, Element început coamă, Element început Y, Suport opritor zăpadă, Grilă opritor zăpadă, Opritor zăpadă punctual, Clemă furtună, Șurub INOX fixare.

## Near names between the added accessories and the Dasterum records (Q-W27-03)

Matching is by exact name (W26-R5, "one card per model name"), and none matched. These pairs look like
the same part under two spellings and are the owner's to fold:

| Imperlux | Dasterum |
|---|---|
| Coamă semicirculară | Coamă semirotundă (CAT-0273) |
| Bordură fronton | Bordura de fronton (CAT-0274) |
| Opritor zăpadă | Opritor de zapadă cilindric (CAT-0271), Reținător de zăpadă (CAT-0275) |
| Membrana Superdifuzie MDM S to XXL | Membrana superdifuză DACHMASTER 100 and 120, Decora 80 to 180 (CAT-0236, 0240 to 0246) |
| Banda ventilare coamă MDM Blachvent 175 | Banda coamă ROLL ECCO pentru ventilare (CAT-0255) |
| Racord perete | Placă de racordare cu margine, fără margine (CAT-0278, 0279) |
| Dolie | Dolie de sus, Dolie interioară (CAT-0276, 0277) |

Every record above has a `source.url`: 0 Imperlux records and 0 Dasterum roofing records without one.

## Amendments from the fix pass of 2026-09-23

**W27-FIX-03 (ruling W27-R-10).** The "Prices" paragraph above stands as the sweep left things on
2026-09-22 and is superseded on one point: where Imperlux publishes no price and the record folds a
Dasterum grade with one, the card shows that grade's "De la N lei" again. The eleven rainwater parts
(Jgheab, Burlan, Colțar interior, Colțar exterior, Brățară jgheab, Capac jgheab, Cârlig jgheab,
Cârlig jgheab lung, Racord jgheab-burlan, Brățară burlan, Cot evacuare) carry their Dasterum figure
in `price` with a source line; `price_folded_not_shown` is retired. The six parts neither source
prices (Cârlig pazie universal, Cot 60°, Prelungitor, Pâlnie colectoare, Ramificație burlan, Element
captare) still ask for a price. The Sisteme pluviale Compară table has its Preț column back, and the
section's derived line reads "11 modele, de la 33 lei".
