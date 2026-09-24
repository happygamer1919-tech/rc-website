# W28-FATADE-IMAGES · every fatade3d.md catalogue picture, what it was and what it is now

**Card W28-15, wave 28, 2026-09-24.** Every catalogue picture whose provenance row names fatade3d.md (110 of the 223 fatade3d records; the other 113 stand on a manufacturer's packshot, an owner-picked picture or a declared reuse under W25-R1, W25-R20 and W25-R17 and are outside this card) was looked at by two independent viewers, its product page's own gallery was fetched and every gallery picture looked at, and the picture was replaced where the page publishes a plain photograph. **66 replaced, 44 kept (already a plain photograph), 0 with no plain photograph at the source (Q-W28-03), 0 refused by the intake.** Every new file came through `scripts/fetch-packshot.js --fatade3d` and `scripts/process-packshot.js` (floor 450, or 300 on the slots W26-R13 names; never upscaled; metadata stripped); no Google image result was used.

## Reviewer checklist

For each row marked "replaced", open the catalogue page named in the last column and find the card:

- [ ] the picture shows the product itself, not a poster, a table, a flyer or a screenshot;
- [ ] no product code, dimension figure or slogan is burned into it (a small maker mark or the FATADE 3D watermark is allowed);
- [ ] it is the same product as the card's name (open the source URL in the row to compare);
- [ ] it is sharp at card size (nothing under the 450px floor was installed except the slots W26-R13 names, at 300).

`node scripts/check-image-sources.js` (the named test) holds every direct-supplier row to a fatade3d.md page and file matching its record; `node scripts/check-photo-slots-w24.js` and `node scripts/check-asset-provenance.js` hold the ledger and the rows.


## The second look, adversarial

After the 66 files were installed, six more viewers, each told to REFUTE, looked at every installed
file against its product record (name, slug, category): is it a plain photograph or clean render with
no burned-in text, table or poster layout, and does it show the named product. **66 accepted,
0 refuted** (66 files looked at: 65 of the 66 replacements plus CAT-0038, which the list
carried by mistake and which was kept; the 66th replacement, CAT-0222, the reinforcing mesh, was looked
at by the terminal: a roll of grey mesh with the maker's own FATADE print woven into it, no overlay,
accepted under W27-R-13's maker's-mark allowance). The viewers also matched each installed moulding
render to its page's `red_NN_render.jpg` by pixel difference (mean difference about 1 against 4 or more
for the nearest other product), so a picture installed under the wrong record would have been named.
One caution recorded by a viewer on CAT-0184 (RED 69) is quoted in the notes below and changes nothing.

## Every fatade3d record, one row each

| Record | Product | Was | Old image | New image | Status | Source URL |
|---|---|---|---|---|---|---|
| CAT-0004 | Polistiren expandat STOP FIRE | plain photo | https://fatade3d.md/wp-content/uploads/2025/06/photo_transparent_1-1226x1080.png | unchanged | kept | https://fatade3d.md/produs/polistiren-expandat-stop-fire/ |
| CAT-0006 | Polistiren Penoplex | plain photo | https://fatade3d.md/wp-content/uploads/2025/06/IMG_6001.jpg | unchanged | kept | https://fatade3d.md/produs/polistiren-penoplex/ |
| CAT-0007 | Polistiren Tehnoplex XPS Carbon | plain photo | https://fatade3d.md/wp-content/uploads/2025/06/IMG_6009.png | unchanged | kept | https://fatade3d.md/produs/polistiren-tehnoplex-xps-carbon/ |
| CAT-0009 | Vată minerală OBIO 165 | plain photo | https://fatade3d.md/wp-content/uploads/2025/06/IMG_6016-2.webp | unchanged | kept | https://fatade3d.md/produs/vata-minerala-obio-165/ |
| CAT-0012 | Vată minerală Novoterm | plain photo | https://fatade3d.md/wp-content/uploads/2025/11/photo_2025-11-20-10.35.01.jpeg | unchanged | kept | https://fatade3d.md/produs/vata-minerala-novoterm/ |
| CAT-0020 | Meșterul Dibaci Universal - Adeziv pentru plăci ceramice | plain photo | https://fatade3d.md/wp-content/uploads/2025/06/dc0e504f075a2c1d0be47c2bbf40e022.png | unchanged | kept | https://fatade3d.md/produs/mesterul-dibaci-universal-adeziv-pentru-placi-ceramice/ |
| CAT-0024 | Diblu din plastic LTX | plain photo | https://fatade3d.md/wp-content/uploads/2025/06/IMG_6022.jpg | unchanged | kept | https://fatade3d.md/produs/diblu-din-plastic-ltx/ |
| CAT-0025 | Diblu din oțel LGX | plain photo | https://fatade3d.md/wp-content/uploads/2025/06/IMG_6024.jpg | unchanged | kept | https://fatade3d.md/produs/diblu-din-otel-lgx/ |
| CAT-0027 | Baumit DuoTop Tencuială decorativă acrilică | plain photo | https://fatade3d.md/wp-content/uploads/2025/06/im0024568.png | unchanged | kept | https://fatade3d.md/produs/baumit-duotop-tencuiala-decorativa-acrilica/ |
| CAT-0034 | Tencuială decorativă siliconică STICKY | plain photo | https://fatade3d.md/wp-content/uploads/2025/06/5fda1397b14a8_20201216040303.jpg | unchanged | kept | https://fatade3d.md/produs/tencuiala-decorativa-siliconica-sticky/ |
| CAT-0037 | Tencuială de cuarţ colorat DURAZIV Clima Protect® cu Kauciuc® | plain photo | https://fatade3d.md/wp-content/uploads/2025/06/DURAZIV-Clima-Protect-cu-Kauciuc-TENCUIALA-DE-CUART-COLORAT-3-390-70261.jpeg | unchanged | kept | https://fatade3d.md/produs/tencuiala-de-cuart-colorat-duraziv-clima-protect-cu-kauciuc/ |
| CAT-0038 | Tencuială decorativă mozaicată Omitka Rokomozaikova | plain photo | https://fatade3d.md/wp-content/uploads/2025/06/mozaika-kybl_etiketa-02.png | unchanged | kept | https://fatade3d.md/produs/tencuiala-decorativa-mozaicata-omitka-rokomozaikova/ |
| CAT-0051 | Placă Elsa Black Grey | plain photo | https://fatade3d.md/wp-content/uploads/2026/01/Agean-White.png | unchanged | kept | https://fatade3d.md/produs/placa-ceramica-elsa-black-grey/ |
| CAT-0060 | Placă Sandstorm | plain photo | https://fatade3d.md/wp-content/uploads/2025/08/nk-Dyed-1.png | unchanged | kept | https://fatade3d.md/produs/placa-ceramica-sandstorm/ |
| CAT-0077 | Placă H06 | plain photo | https://fatade3d.md/wp-content/uploads/2026/01/Veil-Grey.png | unchanged | kept | https://fatade3d.md/produs/placa-ceramica-h06/ |
| CAT-0110 | Polished Concrete Wall | plain photo | https://fatade3d.md/wp-content/uploads/2026/01/Ink-Dyed.png | unchanged | kept | https://fatade3d.md/produs/polished-concrete-wall/ |
| CAT-0112 | Polish Concrete Wall | plain photo | https://fatade3d.md/wp-content/uploads/2025/11/Medium-Grey.jpg | unchanged | kept | https://fatade3d.md/produs/polish-concrete-wall/ |
| CAT-0127 | Element decorativ RED 01 | render with code | https://fatade3d.md/wp-content/uploads/2025/07/red_01.jpg | https://fatade3d.md/wp-content/uploads/2025/07/red_01_render.jpg | replaced | https://fatade3d.md/produs/bagheta-decorativa-fatada-red01/ |
| CAT-0128 | Element decorativ RED 02 | render with code | https://fatade3d.md/wp-content/uploads/2025/07/red_02.jpg | https://fatade3d.md/wp-content/uploads/2025/07/red_02_render.jpg | replaced | https://fatade3d.md/produs/bagheta-decorativa-fatada-red02/ |
| CAT-0129 | Element decorativ RED 03 | render with code | https://fatade3d.md/wp-content/uploads/2025/07/red_03.jpg | https://fatade3d.md/wp-content/uploads/2025/07/red_03_render.jpg | replaced | https://fatade3d.md/produs/bagheta-decorativa-fatada-red03/ |
| CAT-0130 | Element decorativ RED 04 | render with code | https://fatade3d.md/wp-content/uploads/2025/07/red_04.jpg | https://fatade3d.md/wp-content/uploads/2025/07/red_04_render.jpg | replaced | https://fatade3d.md/produs/bagheta-decorativa-fatada-red04/ |
| CAT-0131 | Element decorativ RED 05 | render with code | https://fatade3d.md/wp-content/uploads/2025/07/red_05.jpg | https://fatade3d.md/wp-content/uploads/2025/07/red_05_render.jpg | replaced | https://fatade3d.md/produs/bagheta-decorativa-fatada-red-05/ |
| CAT-0132 | Element decorativ RED 06 | render with code | https://fatade3d.md/wp-content/uploads/2025/07/red_06.jpg | https://fatade3d.md/wp-content/uploads/2025/07/red_06_render.jpg | replaced | https://fatade3d.md/produs/bagheta-decorativa-fatada-red-01/ |
| CAT-0133 | Element decorativ RED 07 | render with code | https://fatade3d.md/wp-content/uploads/2025/07/red_07.jpg | https://fatade3d.md/wp-content/uploads/2025/07/red_07_render.jpg | replaced | https://fatade3d.md/produs/bagheta-decorativa-fatada-red-07/ |
| CAT-0134 | Element decorativ RED 08 | render with code | https://fatade3d.md/wp-content/uploads/2025/07/red_08.jpg | https://fatade3d.md/wp-content/uploads/2025/07/red_08_render.jpg | replaced | https://fatade3d.md/produs/bagheta-decorativa-fatada-red-08/ |
| CAT-0135 | Element decorativ RED 09 | render with code | https://fatade3d.md/wp-content/uploads/2025/07/red_09.jpg | https://fatade3d.md/wp-content/uploads/2025/07/red_09_render.jpg | replaced | https://fatade3d.md/produs/bagheta-decorativa-fatada-red-09/ |
| CAT-0136 | Element decorativ RED 10 | render with code | https://fatade3d.md/wp-content/uploads/2025/07/red_10.jpg | https://fatade3d.md/wp-content/uploads/2025/07/red_10_render.jpg | replaced | https://fatade3d.md/produs/bagheta-decorativa-fatada-red-10/ |
| CAT-0137 | Element decorativ RED 12 | render with code | https://fatade3d.md/wp-content/uploads/2025/07/red_12.jpg | https://fatade3d.md/wp-content/uploads/2025/07/red_12_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-12/ |
| CAT-0138 | Element decorativ RED 14 | render with code | https://fatade3d.md/wp-content/uploads/2025/07/red_14.jpg | https://fatade3d.md/wp-content/uploads/2025/07/red_14_render-scaled.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-14/ |
| CAT-0139 | Element decorativ RED 15 | render with code | https://fatade3d.md/wp-content/uploads/2025/07/red_15.jpg | https://fatade3d.md/wp-content/uploads/2025/07/red_15_render-scaled.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-15/ |
| CAT-0140 | Element decorativ RED 17 | render with code | https://fatade3d.md/wp-content/uploads/2025/07/red_17.jpg | https://fatade3d.md/wp-content/uploads/2025/07/red_17_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-17/ |
| CAT-0141 | Element decorativ RED 18 | render with code | https://fatade3d.md/wp-content/uploads/2025/07/red_18.jpg | https://fatade3d.md/wp-content/uploads/2025/07/red_18_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-18/ |
| CAT-0142 | Element decorativ RED 19 | render with code | https://fatade3d.md/wp-content/uploads/2025/07/red_19.jpg | https://fatade3d.md/wp-content/uploads/2025/07/red_19_render-scaled.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-19/ |
| CAT-0143 | Element decorativ RED 20 | render with code | https://fatade3d.md/wp-content/uploads/2025/07/red_20.jpg | https://fatade3d.md/wp-content/uploads/2025/07/red_20_render-scaled.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-20/ |
| CAT-0144 | Element decorativ RED 21 | render with code | https://fatade3d.md/wp-content/uploads/2025/07/red_21.jpg | https://fatade3d.md/wp-content/uploads/2025/07/red_21_render-scaled.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-21/ |
| CAT-0145 | Element decorativ RED 22 | render with code | https://fatade3d.md/wp-content/uploads/2025/07/red_22.jpg | https://fatade3d.md/wp-content/uploads/2025/07/red_22_render-scaled.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-22/ |
| CAT-0146 | Element decorativ RED 23 | render with code | https://fatade3d.md/wp-content/uploads/2025/07/red_23.jpg | https://fatade3d.md/wp-content/uploads/2025/07/red_23_render-scaled.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-23/ |
| CAT-0147 | Element decorativ RED 24 | render with code | https://fatade3d.md/wp-content/uploads/2025/07/red_24.jpg | https://fatade3d.md/wp-content/uploads/2025/07/red_24_render-scaled.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-24/ |
| CAT-0148 | Element decorativ RED 25 | parameter table | https://fatade3d.md/wp-content/uploads/2025/07/red_25.jpg | https://fatade3d.md/wp-content/uploads/2025/07/red_25_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-25/ |
| CAT-0149 | Element decorativ RED 26 | parameter table | https://fatade3d.md/wp-content/uploads/2025/07/red_26.jpg | https://fatade3d.md/wp-content/uploads/2025/07/red_26_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-26/ |
| CAT-0150 | Element decorativ RED 27 | parameter table | https://fatade3d.md/wp-content/uploads/2025/07/red_27.jpg | https://fatade3d.md/wp-content/uploads/2025/07/red_27_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-27/ |
| CAT-0151 | Element decorativ RED 28 | parameter table | https://fatade3d.md/wp-content/uploads/2025/07/red_28.jpg | https://fatade3d.md/wp-content/uploads/2025/07/red_28_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-28/ |
| CAT-0152 | Element decorativ RED 29 | parameter table | https://fatade3d.md/wp-content/uploads/2025/07/red_29.jpg | https://fatade3d.md/wp-content/uploads/2025/07/red_29_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-29/ |
| CAT-0153 | Element decorativ RED 30 | parameter table | https://fatade3d.md/wp-content/uploads/2025/08/red_30.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_30_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-30/ |
| CAT-0154 | Element decorativ RED 31 | parameter table | https://fatade3d.md/wp-content/uploads/2025/08/red_31.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_31_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-31/ |
| CAT-0155 | Element decorativ RED 32 | parameter table | https://fatade3d.md/wp-content/uploads/2025/08/red_32.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_32_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-32/ |
| CAT-0156 | Element decorativ RED 33 | parameter table | https://fatade3d.md/wp-content/uploads/2025/08/red_33.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_33_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-33/ |
| CAT-0157 | Element decorativ RED 34 | parameter table | https://fatade3d.md/wp-content/uploads/2025/08/red_34.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_34_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-34/ |
| CAT-0158 | Element decorativ RED 35 | parameter table | https://fatade3d.md/wp-content/uploads/2025/08/red_35.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_35_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-35/ |
| CAT-0159 | Element decorativ RED 37 | parameter table | https://fatade3d.md/wp-content/uploads/2025/08/red_37.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_37_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-37/ |
| CAT-0160 | Element decorativ RED 38 | parameter table | https://fatade3d.md/wp-content/uploads/2025/08/red_38.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_38_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-38/ |
| CAT-0161 | Element decorativ RED 39 | parameter table | https://fatade3d.md/wp-content/uploads/2025/08/red_39.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_39_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-39/ |
| CAT-0162 | Element decorativ RED 41 | render with code | https://fatade3d.md/wp-content/uploads/2025/08/red_41.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_41_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-41/ |
| CAT-0163 | Element decorativ RED 42 | render with code | https://fatade3d.md/wp-content/uploads/2025/08/red_42.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_42_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-42/ |
| CAT-0164 | Element decorativ RED 43 | render with code | https://fatade3d.md/wp-content/uploads/2025/08/red_43.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_43_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-43/ |
| CAT-0165 | Element decorativ RED 44 | render with code | https://fatade3d.md/wp-content/uploads/2025/08/red_44.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_44_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-44/ |
| CAT-0166 | Element decorativ RED 45 | render with code | https://fatade3d.md/wp-content/uploads/2025/08/red_45.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_45_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-45/ |
| CAT-0167 | Element decorativ RED 46 | render with code | https://fatade3d.md/wp-content/uploads/2025/08/red_46.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_46_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-46/ |
| CAT-0168 | Element decorativ RED 47 | render with code | https://fatade3d.md/wp-content/uploads/2025/08/red_47.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_47_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-47/ |
| CAT-0169 | Element decorativ RED 49 | render with code | https://fatade3d.md/wp-content/uploads/2025/08/red_49.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_49_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-49/ |
| CAT-0170 | Element decorativ RED 50 | render with code | https://fatade3d.md/wp-content/uploads/2025/08/red_50.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_50_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-50/ |
| CAT-0171 | Element decorativ RED 53 | render with code | https://fatade3d.md/wp-content/uploads/2025/08/red_53.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_53_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-53/ |
| CAT-0172 | Element decorativ RED 55 | render with code | https://fatade3d.md/wp-content/uploads/2025/08/red_55.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_55_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-55/ |
| CAT-0173 | Element decorativ RED 56 | render with code | https://fatade3d.md/wp-content/uploads/2025/08/red_56.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_56_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-56/ |
| CAT-0174 | Element decorativ RED 57 | render with code | https://fatade3d.md/wp-content/uploads/2025/08/red_57.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_57_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-57/ |
| CAT-0175 | Element decorativ RED 58 | render with code | https://fatade3d.md/wp-content/uploads/2025/08/red_58.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_58_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-58/ |
| CAT-0176 | Element decorativ RED 61 | render with code | https://fatade3d.md/wp-content/uploads/2025/08/red_61.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_61_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-61/ |
| CAT-0177 | Element decorativ RED 62 | render with code | https://fatade3d.md/wp-content/uploads/2025/08/red_62.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_62_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-62/ |
| CAT-0178 | Element decorativ RED 63 | render with code | https://fatade3d.md/wp-content/uploads/2025/08/red_63.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_63_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-63/ |
| CAT-0179 | Element decorativ RED 64 | render with code | https://fatade3d.md/wp-content/uploads/2025/08/red_64.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_64_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-64/ |
| CAT-0180 | Element decorativ RED 65 | render with code | https://fatade3d.md/wp-content/uploads/2025/08/red_65.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_65_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-65/ |
| CAT-0181 | Element decorativ RED 66 | render with code | https://fatade3d.md/wp-content/uploads/2025/08/red_66.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_66_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-66/ |
| CAT-0182 | Element decorativ RED 67 | render with code | https://fatade3d.md/wp-content/uploads/2025/08/red_67.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_67_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-67/ |
| CAT-0183 | Element decorativ RED 68 | render with code | https://fatade3d.md/wp-content/uploads/2025/08/red_68.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_68_render.jpg | replaced | https://fatade3d.md/produs/elemente-decorativ-red-68/ |
| CAT-0184 | Element decorativ RED 69 | render with code | https://fatade3d.md/wp-content/uploads/2025/08/red_69.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_69_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-69/ |
| CAT-0185 | Element decorativ RED 70 | render with code | https://fatade3d.md/wp-content/uploads/2025/08/red_70.jpg | https://fatade3d.md/wp-content/uploads/2025/08/red_70_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-70/ |
| CAT-0186 | Element decorativ RED 73 | render with code | https://fatade3d.md/wp-content/uploads/2025/09/red_73.jpg | https://fatade3d.md/wp-content/uploads/2025/09/red_73_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-73/ |
| CAT-0187 | Element decorativ RED 74 | render with code | https://fatade3d.md/wp-content/uploads/2025/09/red_74.jpg | https://fatade3d.md/wp-content/uploads/2025/09/red_74_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-74/ |
| CAT-0188 | Element decorativ RED 76 | render with code | https://fatade3d.md/wp-content/uploads/2025/09/red_76.jpg | https://fatade3d.md/wp-content/uploads/2025/09/red_76_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-76/ |
| CAT-0189 | Element decorativ RED 77 | render with code | https://fatade3d.md/wp-content/uploads/2025/09/red_77.jpg | https://fatade3d.md/wp-content/uploads/2025/09/red_77_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-77/ |
| CAT-0190 | Element decorativ RED 78 | render with code | https://fatade3d.md/wp-content/uploads/2025/09/red_78.jpg | https://fatade3d.md/wp-content/uploads/2025/09/red_78_render.jpg | replaced | https://fatade3d.md/produs/element-decorativ-red-78/ |
| CAT-0194 | Ultrapal - Vopsea universală | plain photo | https://fatade3d.md/wp-content/uploads/2025/06/0070559.png | unchanged | kept | https://fatade3d.md/produs/ultrapal-vopsea-universala/ |
| CAT-0196 | Lampă GMD-881F | plain photo | https://fatade3d.md/wp-content/uploads/2025/05/2.png | unchanged | kept | https://fatade3d.md/produs/lampa-gmd-881f/ |
| CAT-0197 | Lampă GMD-881Y | plain photo | https://fatade3d.md/wp-content/uploads/2025/06/3.png | unchanged | kept | https://fatade3d.md/produs/lampa-gmd-881y/ |
| CAT-0198 | Lampă GMD-F841F-2 | plain photo | https://fatade3d.md/wp-content/uploads/2025/06/1.png | unchanged | kept | https://fatade3d.md/produs/lampa-gmd-f841f-2/ |
| CAT-0199 | Lampă K1207 | plain photo | https://fatade3d.md/wp-content/uploads/2025/06/7.png | unchanged | kept | https://fatade3d.md/produs/lampa-k1207/ |
| CAT-0200 | Lampă K1212S | plain photo | https://fatade3d.md/wp-content/uploads/2025/06/9.png | unchanged | kept | https://fatade3d.md/produs/lampa-k1212s/ |
| CAT-0201 | Lampă K1213M | plain photo | https://fatade3d.md/wp-content/uploads/2025/06/13.png | unchanged | kept | https://fatade3d.md/produs/lampa-k1213m/ |
| CAT-0202 | Lampă K1241 | plain photo | https://fatade3d.md/wp-content/uploads/2025/06/10.png | unchanged | kept | https://fatade3d.md/produs/lampa-k1241/ |
| CAT-0203 | Lampă K1247 | plain photo | https://fatade3d.md/wp-content/uploads/2025/06/11.png | unchanged | kept | https://fatade3d.md/produs/lampa-k1247/ |
| CAT-0204 | Lampă K2148 | plain photo | https://fatade3d.md/wp-content/uploads/2025/06/14.png | unchanged | kept | https://fatade3d.md/produs/lampa-k2148/ |
| CAT-0205 | Lampă K2276 | plain photo | https://fatade3d.md/wp-content/uploads/2025/06/15.png | unchanged | kept | https://fatade3d.md/produs/lampa-k2276/ |
| CAT-0206 | Lampă K5014 | plain photo | https://fatade3d.md/wp-content/uploads/2025/06/4.png | unchanged | kept | https://fatade3d.md/produs/lampa-k5014/ |
| CAT-0207 | Lampă K5016 | plain photo | https://fatade3d.md/wp-content/uploads/2025/06/5.png | unchanged | kept | https://fatade3d.md/produs/lampa-k5016/ |
| CAT-0208 | Lampă K41041 | plain photo | https://fatade3d.md/wp-content/uploads/2025/06/12.png | unchanged | kept | https://fatade3d.md/produs/lampa-k41041/ |
| CAT-0209 | Lampă K41047 | plain photo | https://fatade3d.md/wp-content/uploads/2025/06/17.png | unchanged | kept | https://fatade3d.md/produs/lampa-k41047/ |
| CAT-0210 | Lampă K41059 | plain photo | https://fatade3d.md/wp-content/uploads/2025/06/16.png | unchanged | kept | https://fatade3d.md/produs/lampa-k41059/ |
| CAT-0211 | Lampă K41061 | plain photo | https://fatade3d.md/wp-content/uploads/2025/06/18.png | unchanged | kept | https://fatade3d.md/produs/lampa-k41061/ |
| CAT-0212 | Lampă K45015 | plain photo | https://fatade3d.md/wp-content/uploads/2025/06/6.png | unchanged | kept | https://fatade3d.md/produs/lampa-k45015/ |
| CAT-0213 | Lampă K1247 | plain photo | https://fatade3d.md/wp-content/uploads/2026/05/100618_59694.jpg | unchanged | kept | https://fatade3d.md/produs/lampa-k1247-2/ |
| CAT-0214 | Lampă K2146 | plain photo | https://fatade3d.md/wp-content/uploads/2026/05/img.webp | unchanged | kept | https://fatade3d.md/produs/lampa-k2146/ |
| CAT-0215 | Lampă K2880 | plain photo | https://fatade3d.md/wp-content/uploads/2026/05/095059_11476.jpg | unchanged | kept | https://fatade3d.md/produs/lampa-k2880/ |
| CAT-0216 | Lampă K2088L | plain photo | https://fatade3d.md/wp-content/uploads/2026/05/omni-881e6b9e-aa37-4c5b-8bd2-60aaa312d042.jpg | unchanged | kept | https://fatade3d.md/produs/lampa-k2088l/ |
| CAT-0217 | Lampă K2222 | plain photo | https://fatade3d.md/wp-content/uploads/2026/05/omni-bdd7520b-6498-4bd5-80c0-8974ca73763d-1.png | unchanged | kept | https://fatade3d.md/produs/lampa-k2222/ |
| CAT-0218 | Lampă K2841 | plain photo | https://fatade3d.md/wp-content/uploads/2026/05/am_nevoie_de_imagini_mai_calitative_pentru_acest_felinarfelinarul_din_prima_poza_sa_fie_in_asa_form_ednw2ra2841bknlrjibc_0.png | unchanged | kept | https://fatade3d.md/produs/5437/ |
| CAT-0219 | Lampă K2842 | plain photo | https://fatade3d.md/wp-content/uploads/2026/05/omni-0081965d-7abe-4016-90a5-6f2d0a054465.png | unchanged | kept | https://fatade3d.md/produs/lampa-k2842/ |
| CAT-0220 | Lampă K1823 | plain photo | https://fatade3d.md/wp-content/uploads/2026/05/omni-efc90a7b-29f0-4aa3-a776-0caae4f0157f.png | unchanged | kept | https://fatade3d.md/produs/lampa-k1823/ |
| CAT-0221 | Membrana de DIFUZIE pentru acoperișuri | plain photo | https://fatade3d.md/wp-content/uploads/2025/06/IMG_5609.png | unchanged | kept | https://fatade3d.md/produs/membrana-de-difuzie-pentru-acoperisuri/ |
| CAT-0222 | Plasă de armare | poster or flyer | https://fatade3d.md/wp-content/uploads/2025/06/Screenshot-2025-06-25-at-00.36.34.png | https://fatade3d.md/wp-content/uploads/2025/06/IMG_8629.jpg | replaced | https://fatade3d.md/produs/plasa-de-armare/ |
| CAT-0223 | Colțar PVC | poster or flyer | https://fatade3d.md/wp-content/uploads/2025/06/Screenshot-2025-06-25-at-00.56.13.png | https://fatade3d.md/wp-content/uploads/2025/06/IMG_8667.png | replaced | https://fatade3d.md/produs/coltar-pvc-fatade-3d/ |

## Notes from the run

- CAT-0051: the row's page https://fatade3d.md/produs/rome-travertine/?attribute_pa_culoare=portoro set to the record's own page https://fatade3d.md/produs/placa-ceramica-elsa-black-grey/ (the picture is unchanged)
- CAT-0060: the row's page https://fatade3d.md/produs/concrete-pouring-slab/?attribute_pa_culoare=sandstorm set to the record's own page https://fatade3d.md/produs/placa-ceramica-sandstorm/ (the picture is unchanged)
- CAT-0077: the row's page https://fatade3d.md/produs/rough-surface/?attribute_pa_culoare=h06 set to the record's own page https://fatade3d.md/produs/placa-ceramica-h06/ (the picture is unchanged)
- CAT-0184, second look: Pixel match (MAD 1.38) to red_69_render.jpg on the RED 69 page and the flat coved board matches the coded RED-69 profile; CAUTION the file is byte-identical to CAT-0185 because fatade3d.md serves the same render (sha256 c42cd290) on both the RED 69 and RED 70 pages, so two cards will show one picture.
- CAT-0184 and CAT-0185 (RED 69 and RED 70): fatade3d.md publishes the same render (sha256 c42cd290...) on both product pages, so the two cards show one picture, exactly as the supplier's own pages do. Both files were installed from their own page's URL and stand on their own rows; a declared reuse (W25-R17) would be the owner's call and is noted in Q-W28-03.
