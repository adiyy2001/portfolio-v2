# Margines: status

## Done

- [x] Concept, name check (in `PLAN.md`), palette, Caveat checked on the Polish set at 500, 600 and 700 and Lexend at 400, 500 and 700, sheet looked at
- [x] Invented titles searched on 2026-10-07: "Salt on the Windowsill", "Night Shift on Harbour Street", "Lato na Kazimierzu", "Sąsiedzi z trzeciego piętra"; no book or series of these titles found
- [x] Seven UI screens in `screens.mjs` (Dziś, Fiszka przód, Fiszka tył, Dodaj z tekstu, Z twoich notatek, Postęp, Talie) with the mini design system in `theme.css`, data in `sites/src/aso/margines/copy/pl.json` and `en.json`
- [x] App Store set (440 x 956 CSS px at scale 3) and Google Play set (360 x 640 at scale 3), one composition per frame on graph paper with a red double margin rule
- [x] Marker annotations drawn with rough.js at a fixed seed; each one is measured from the UI element it points at after the fonts load (`ink.mjs`), at most three per frame
- [x] Variant B (Z twoich notatek screen with a handwritten notebook page) in both stores and both languages
- [x] Feature graphic PL and EN, icons for both stores plus the Icon Composer layers
- [x] Export as truecolour PNG, validator 0 errors, boards, thumbnails, ZIP, manifest
- [x] Case study page `/wzornik/aso/margines/`, tile on `/wzornik/aso/`, shots at 390 and 1440 px, no horizontal scroll from 320 to 1440 px, no console errors

## Decisions

- Headline 2 (PL) reads "Powtórka w porę, zanim zapomnisz" instead of "Powtórka tuż przed zapomnieniem", and headline 1 (EN) reads "Words that keep their sentence" instead of "Learn words with the sentence attached" (also the EN feature line). At the set's headline size (Caveat 700, 58 CSS px App Store, 38 Play) the planned lines could only break with a one word last line; the benefit of each is unchanged.
- The planned book title "The Long Way Home" exists (several novels), so the PL book deck is "Salt on the Windowsill"; the series is "Night Shift on Harbour Street". The EN set is an English speaker learning Polish with the book "Lato na Kazimierzu", the series "Sąsiedzi z trzeciego piętra" and a trip to Kraków.
- Variant B uses its own screen state, "Z twoich notatek" (a photo of a notebook page turned into nine cards), instead of the Dodaj z tekstu screen of frame 4, so the B frame shows the promise it makes and frame 4 keeps its own job.
- The seventh planned screen (Wymowa, pronunciation) is replaced by that notebook screen; the set uses six screens plus the variant B screen, within the brief's five to eight.
- Small UI text uses darker shades of the marker colours, `#C2302A` and `#1F7A45` (5.6 and 5.4 to 1 on white); the brighter `#E2433B` and `#2E9E5B` are only marker strokes, never text.
- The EN UI keeps Polish words, sentences and diacritics on the cards (it is a Polish course), with the meanings and interface in English.

## Shared change requests

Applied in the foundation (backward compatible, Grań and Szyld re-rendered pixel identical):

- `settle` in `lib/browser.mjs` awaits `window.wzReady` when a page defines it, so a composition can draw after the fonts load (Margines measures the UI elements its marker strokes point at).

## Open issues

None known. R still reviews the set.

Fixed in Q (2026-10-08): the frame 4 double underline crossed the next line, the Play frame 1 circle cut the sentence and the arrow crossed it. See the QA section of `PLAN.md`.

## Review scores

Not reviewed yet.
