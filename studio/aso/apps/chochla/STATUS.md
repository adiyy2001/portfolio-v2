# Chochla: status

## Done

- [x] Concept, name check (in `PLAN.md`), palette, Bangers 400 and Figtree 500, 700 and 800 checked on the Polish set, sheet looked at
- [x] Seven UI screens in `screens.mjs` (Tydzień, Zakupy, Z lodówki, Przepis, Gotowanie, Kolekcje, Dziś) with the mini design system in `theme.css`, data in `sites/src/aso/chochla/copy/pl.json` and `en.json`
- [x] Food characters and Memphis patterns drawn from circles, triangles and zigzags in `art.mjs`, flat palette colours with black outlines and halftone dots, no photos
- [x] App Store set (440 x 956 CSS px at scale 3) and Google Play set (360 x 640 at scale 3), one composition per frame, speech bubbles measured around the set headline after the fonts load
- [x] Variant B (Dziś screen, a pot asks no more questions) in both stores and both languages
- [x] Feature graphic PL and EN, icons for both stores plus the Icon Composer layers
- [x] Export as truecolour PNG, validator 0 errors, boards, thumbnails, ZIP 10.6 MB, published folder 12.3 MB, manifest
- [x] Case study page `/wzornik/aso/chochla/`, tile on `/wzornik/aso/`, shots at 390 and 1440 px, no horizontal scroll from 320 to 1440 px, no console errors

## Decisions

- All twelve planned headlines are used as written; at Bangers 44 CSS px (App Store) and 29 (Play) none ends with a one word line.
- Variant B gets its own screen state, "Dziś" (tonight's dinner with everything at home, then tomorrow and Saturday), instead of the Tydzień screen of frame 1, so the B frame shows the answer to "co na obiad" and the A and B frames do not show the same screen.
- Frame 6 puts the headline in a yellow narration box instead of a bubble, and frames 2 and 6 are split into comic panels, so the set does not repeat one bubble skeleton six times. Frame 3 is the only centred phone.
- Speech bubbles are drawn in the page after the fonts load, around the measured text, with the tail aimed at the speaking character. Confetti is placed from seeded candidates and the page drops any piece that would touch a bubble. A layout check fails the render if a pattern enters the 16 px margin around a phone (12 px in Play) or a bubble or character touches a phone.
- The palette has no green: the tomato calyx, the courgette and the onion sprout use Turkus.
- No prices anywhere: the shopping list shows quantities and which dinners need them; a unit test checks that the week plan, the list counts and the cooking steps add up.
- The EN set is a British home kitchen written anew (courgette fritters, lentil chilli, Grandma Rose, trolley), not a translation of the Polish dinners.

## Shared change requests

None. No foundation file was changed, so Grań, Szyld and Margines were not re-rendered.

## Open issues

None known. Q and R still review the set.

## Review scores

Not reviewed yet.
