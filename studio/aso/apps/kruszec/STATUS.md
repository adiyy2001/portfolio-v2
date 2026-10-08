# Kruszec: status

## Done

- [x] Concept, name check (in `PLAN.md`), palette, Instrument Serif regular and italic and Manrope 400, 500, 600 and 700 checked on the Polish set, sheet looked at
- [x] Seven UI screens in `screens.mjs` (Majątek, Budżet, Poduszka, Alokacja, Cel, Raport, Konta) and six two column tablet dashboards built from the same modules, mini design system in `theme.css`, data in `sites/src/aso/kruszec/copy/pl.json` and `en.json`
- [x] App Store set (440 x 956 CSS px at scale 3), Google Play set (360 x 640 at scale 3) and the iPad 13" set (1032 x 1376 at scale 2, 2064 x 2752 files), one composition per frame, glass cards in front of the devices
- [x] Variant B (Konta screen, the accounts float out as glass cards) in both stores and both languages
- [x] Feature graphic PL and EN, icons for both stores plus the Icon Composer layers
- [x] Export as JPEG (quality 90, 4:4:4), validator 0 errors, boards, thumbnails, ZIP 8.2 MB, published folder 9.7 MB, manifest
- [x] Case study page `/wzornik/aso/kruszec/`, tile on `/wzornik/aso/`, shots at 390 and 1440 px, no horizontal scroll from 320 to 1440 px, no console errors

## Decisions

- JPEG at quality 90 with 4:4:4 chroma instead of PNG: the PNG set with glows, blur and the iPad files came to a 42 MB ZIP (cap 15 MB); the JPEG ZIP is 8.2 MB with clean text edges at 100 percent.
- The net worth line of frame 1 leaves the phone: the page measures two markers on the chart inside the screen after the fonts load and draws the earlier months (from October 2021) out to the frame edge in the same scale, so it joins the screen chart exactly in both languages and both stores, and on the iPad. The render fails if the line starts too far from the edge.
- Every headline has one accent phrase in Instrument Serif italic and sage (`accent` in the copy file); all twelve planned headlines are used as written.
- The EN set is a British saver written anew: pounds, Stocks and Shares ISA, workplace pension, gilts and easy access savings instead of IKE, IKZE and Polish bonds. No institution, fund or ticker is named anywhere.
- No rate of return, gain or yield anywhere. Goals and the safety net are counted from deposits only ("licząc same wpłaty, bez założenia wzrostu"), the allocation note is arithmetic against the user's own plan ("Do twojego planu brakuje 14 400 zł w obligacjach"). The copy check bans zysk, zarob, zwrot, stopa zwrotu, rentown, return, profit, earn, gain, yield; a unit test checks that every account, group, budget and goal number adds up.
- Every screen carries the "Dane przykładowe" / "Sample data" chip; the feature graphic shows it under the number.
- The iPad screens are laid out at 900 x 1200 points and scaled into the drawn tablet, so the type stays readable in the 2064 x 2752 files; the tablet frame is drawn in the app folder (`compose.mjs`), not in the shared kit.
- Frame 5 shows the past deposits as filled dots and the remaining ones as hollow dots up to the goal (May 2028 in PL, October 2028 in EN), counted from deposits only.

## Shared change requests

None. No foundation file was changed, so the earlier sets were not re-rendered.

## Open issues

None known. Q and R still review the set.

## Review scores

Not reviewed yet.
