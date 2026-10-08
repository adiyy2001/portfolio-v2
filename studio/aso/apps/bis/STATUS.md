# Bis: status

## Done

- [x] Concept, name check (in `PLAN.md`), palette, Modak 400 and Quicksand 500, 600 and 700 checked on the Polish set, sheet looked at
- [x] Invented artists and venues searched on 2026-10-08: Mira Szum, Brokat Express, Pola Ołówek, Lisie Radio, Szklane Kolano, Ola Ćma, Tygrys z Kartonu, Neon Babci; clubs Przelot, Scena Bąbel, Strych Mewa. None found as a band or a club
- [x] Seven UI screens in `screens.mjs` (W okolicy, Odkrywaj, Koncert, Znajomi, Kalendarz, Kolekcja, Podgląd) with the mini design system in `theme.css`, covers and avatars drawn from shapes in `art.mjs`, data in `sites/src/aso/bis/copy/pl.json` and `en.json`
- [x] App Store set (440 x 956 CSS px at scale 3) and Google Play set (360 x 640 at scale 3), one composition per frame, chrome words measured and drawn after the fonts load
- [x] Variant B (Podgląd screen, a 30 second preview of a band that plays nearby on Friday) in both stores and both languages
- [x] Feature graphic PL and EN, icons for both stores plus the Icon Composer layers
- [x] Export as JPEG (quality 90, 4:4:4), validator 0 errors, boards, thumbnails, ZIP 10.3 MB, published folder 12.4 MB, manifest
- [x] Case study page `/wzornik/aso/bis/`, tile on `/wzornik/aso/` (6 of 6), shots at 390 and 1440 px, no horizontal scroll from 320 to 1440 px, no console errors

## Decisions

- All fourteen planned headlines (six per language plus variant B) are used as written. App Store headlines are Modak at 48 CSS px, Play at 37; the last two words of every headline are joined with a no-break space, so no headline ends with a one word line.
- Only the key words are chrome (`accent` in the copy file). The page measures each of them after the fonts load and draws four SVG layers on top: a Grafit shadow, a dark Atrament edge under the fill (so the inner contours of Modak never show), and a gradient with sky, horizon and warm ground reflections. A new language with a longer word gets its chrome in the right place without layout work. No `-webkit-text-stroke`.
- Hala Pogłos from the plan was dropped: a real Warsaw club is called Pogłos. Zorza i Psy was dropped too, because a Polish band called Zørza exists. The clubs are Przelot, Scena Bąbel and Strych Mewa.
- The EN set stays in Warsaw with the same artists, clubs and track titles (they are proper names), written anew for an English speaker: 8 pm, Sat 17 Oct, "Ticket release". Distances stay in kilometres because the city is Warsaw.
- No ticket prices anywhere and no streaming service named: "artists you listen to" come from "your library". A unit test checks that the week list, the calendar, the friends screen and the counts agree.
- Variant B uses its own screen, Podgląd (the 30 second preview player), instead of the Odkrywaj screen of frame 2, so the A and B frames show different screens.
- The feature graphic keeps the centre free of text: the chrome name sits left, the promise right, and the centre holds a chrome sparkle on a holo disc where Google may place the play button. This differs from the plan, which put the name in the centre.
- Album covers are compositions of circles, stars, stripes and zigzags; the cassette, disco ball and planet are generic shapes, not real releases.

## Shared change requests

None. No foundation file was changed, so the earlier sets were not re-rendered.

## Open issues

None known. R still reviews the set.

Fixed in Q (2026-10-08): the frame 4 orbit covered the friends list, chrome words were weak at thumbnail size. See the QA section of `PLAN.md`.

## Review scores

Not reviewed yet.
