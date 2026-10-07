# Szyld: status

## Done

- [x] Concept, name check (in `PLAN.md`), palette, Mona Sans checked on the Polish set at 400, 600 and 700 (width 100) and 800 and 900 (width 125), sheet looked at
- [x] Shop names searched on 2026-10-07 (Piekarnia Na Zakręcie, Warzywniak Pod Kasztanem, Śrubka i Syn, Kwiaciarnia Kalina, Księgarnia Dwie Półki): no business of these names found
- [x] Seven UI screens in `screens.mjs` (Gotowe, W okolicy, Koszyk, Godzina odbioru, Kod odbioru, Stałe zamówienie, Sklep) with the mini design system in `theme.css`, data in `sites/src/aso/szyld/copy/pl.json` and `en.json`
- [x] App Store set (440 x 956 CSS px at scale 3) and Google Play set (360 x 640 at scale 3), one composition per frame, phones and screen cards in CSS 3D perspective, grainy duotones
- [x] Variant B (Sklep screen, the hold badge popping out of the screen) in both stores and both languages
- [x] Feature graphic PL and EN, icons for both stores plus the Icon Composer layers
- [x] Export as JPEG (quality 90, 4:4:4), validator 0 errors, boards, thumbnails, ZIP 13 MB, manifest
- [x] Case study page `/wzornik/aso/szyld/`, tile on `/wzornik/aso/`, shots at 390 and 1440 px, no horizontal scroll from 320 to 1440 px, no console errors

## Decisions

- Screenshot 1 shows the Gotowe screen (three shops on one walk home, each with its pickup state) instead of the Koszyk screen, so the Koszyk screen appears once (frame 3, with the route) and the first frame shows the promise itself: ordered from the street, collected on the way.
- Headline 4 (PL) reads "Godzina odbioru, jaka ci pasuje" instead of "Odbiór o godzinie, którą wybierasz", headline 5 (PL) reads "Pokaż kod, zakupy w ręku" instead of "Kod przy ladzie i po sprawie", headline 2 (EN) reads "Your street's shops on one map" instead of "Every shop on your street, mapped". At the set's headline size (48 CSS px App Store, 31 Play, Mona Sans width 125 weight 900) the planned lines could only break with a one word last line; the benefit of each is unchanged.
- One layout per frame for both languages. The only per language values are decorative: the outlined pickup time behind frame 4 ("17:30" in PL, "5:30" in EN, sized so each fills the frame) and the giant word behind frame 6 ("SOBOTA" and "SATURDAY", fitted to the same width).
- The EN set keeps the Poznań world (Jeżyce, the shop names, prices in zł) written for an English speaking resident: prices with a dot, 12 hour times, kaiser roll for kajzerka.
- Prices are ordinary prices of goods (rye loaf 14,50 zł, basket 74,75 zł); no discount, promotion or app price. A unit test checks that the basket and the standing order add up.
- The pickup code is a drawn circular dot pattern with a bag in the middle, not a QR code.
- JPEG at quality 90 (not the foundation's 92): grain makes JPEG the heavy part, and 90 keeps the ZIP at 13 MB under the 15 MB cap with no visible loss at 100 percent.
- Map pins on frame 2 stand above the tilted screen as 2D labels placed on points projected from the 3D screen, because a `preserve-3d` scene made Chromium rasterise the tilted screen at low resolution and hid one pin behind the screen plane.

## Shared change requests

Applied in the foundation (kept backward compatible, Grań re-rendered pixel identical):

- `kit.phone` and `kit.card` take `box` (default `fg`) and `transform` (overrides `rotate`), so a device can bleed off the frame (`box: 'device'`) and take a 3D transform.
- `collectBoxes` reads lines from left to right for a headline marked `data-vertical` (a headline rotated by -90 degrees).
- `flattenImage` takes `quality`; `export.mjs` passes `app.jpegQuality` (default 92).

## Open issues

None known. Q and R still review the set.

## Review scores

Not reviewed yet.
