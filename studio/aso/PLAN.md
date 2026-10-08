# ASO: plan (phase 1)

Brief: `/home/adrian/root/side_projects/briefs/wzornik-aso.md`. Run rules: `/home/adrian/root/side_projects/briefs/agent-runs/wzornik-common.md` and `wzornik-run2.md` (base branch `main`). Recon, store specifications, tooling, folder layout, file names, validator and the parallel build rules: `NOTES.md`. Mode: autonomous, no checkpoint; every decision worth Adrian's review is under "Decisions for Adrian" at the end. Written on 2026-10-07.

```
- [x] F foundation, with the first brand end to end (B1 Grań)
- [x] B2 Szyld
- [x] B3 Margines
- [x] B4 Chochla
- [x] B5 Kruszec
- [x] B6 Bis
- [x] Q quality control
- [ ] R independent review, every rubric score at least 4
- [ ] P publication and final report
```

Every app agent writes status and decisions to `studio/aso/apps/<slug>/STATUS.md`. The merge step ticks the lines above and copies the decisions into this file.

## The six apps

| Order | App      | Slug       | Style (brief id)                          | Category                                             | Export format            | Port        | Case study URL           |
| ----- | -------- | ---------- | ----------------------------------------- | ---------------------------------------------------- | ------------------------ | ----------- | ------------------------ |
| B1    | Grań     | `gran`     | illustrated panorama (S1)                 | mountain trails in the Sudety                        | PNG                      | 4330 / 4331 | `/wzornik/aso/gran/`     |
| B2    | Szyld    | `szyld`    | strong gradients with tilted devices (S2) | local shops, order and pick up in person             | JPEG                     | 4332        | `/wzornik/aso/szyld/`    |
| B3    | Margines | `margines` | hand drawn annotations, doodle (S3)       | language flashcards                                  | PNG                      | 4333        | `/wzornik/aso/margines/` |
| B4    | Chochla  | `chochla`  | Memphis and pop art (S4)                  | recipes and meal planning                            | PNG                      | 4334        | `/wzornik/aso/chochla/`  |
| B5    | Kruszec  | `kruszec`  | dark premium glass (S5)                   | personal budget and investing, plus the iPad 13" set | PNG, JPEG if over budget | 4335        | `/wzornik/aso/kruszec/`  |
| B6    | Bis      | `bis`      | Y2K holographic chrome (S6)               | music discovery and concerts                         | JPEG                     | 4336        | `/wzornik/aso/bis/`      |

Why B1 is Grań: it stresses the most links of the chain at once. Its six screenshots are cut from one strip six frames wide, so the foundation has to solve strip rendering, exact slicing, the seam guard and the 400 percent seam review, on top of what every app needs (fonts, phone frame, two stores, two languages, variant B, feature graphic, icons, validator, ZIP, page). Flat vector art also proves the truecolour PNG path. The JPEG path is built and unit tested in the foundation and first used by Szyld.

Why Kruszec gets the iPad set: a budget and portfolio dashboard is the one app of the six that people really use on a tablet, and a wide net worth chart shows what the bigger canvas adds.

## Distinctness at a glance

|          | Ground                                   | Colour family                                           | Type                                  | Composition principle                               | Device treatment                                        | Signature element                                                        |
| -------- | ---------------------------------------- | ------------------------------------------------------- | ------------------------------------- | --------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------ |
| Grań     | layered landscape, cream sky             | cool layered blue greens, one trail red                 | Overpass (signpost grotesk)           | one continuous panorama, frames are windows into it | phones stand in the landscape, partly behind hills      | the trail line crossing all six frames                                   |
| Szyld    | grainy duotone gradients                 | bottle green, lime, grapefruit                          | Mona Sans expanded 900                | diagonal, off-centre, huge type, motion             | phones tilted in 3D perspective, bleeding off the edges | grain plus perspective, type larger than the phone                       |
| Margines | graph paper                              | navy ink, red and green marker, yellow highlighter      | Caveat (handwriting) and Lexend       | phone plus pulled out UI pieces with notes          | flat phone, slightly turned, taped cards beside it      | marker arrows and circles, each pointing at a UI element                 |
| Chochla  | cream with Memphis patterns at the edges | tomato, mustard, cobalt, turquoise, pink, black outline | Bangers (comic lettering) and Figtree | comic panels and speech bubbles                     | flat phone with a thick outline, no shadow              | food drawn from circles, triangles and zigzags that "speak" the headline |
| Kruszec  | deep navy                                | navy, sage, ice blue, platinum, no saturation           | Instrument Serif and Manrope          | the chart leaves the phone and spans the frame      | graphite phone, frosted glass cards floating in depth   | a calm net worth line with a soft glow                                   |
| Bis      | brushed silver                           | iridescent pink, cyan, lime, peach on silver            | Modak (bubble) chrome and Quicksand   | collage of stickers and cards around the phone      | glossy chrome phone, 2D tilt only                       | chrome bubble letters and four point sparkles                            |

How the set stays clear of the other 12 styles: no white iOS flat look (A1), no giant kinetic type on black (A2; Szyld's type is large but static, on colour, with 3D devices), no dark neon or monospace (A3; Kruszec has no neon, no outline glow, no mono), no matte pastel inflated shapes (A4; Bis is glossy metal and iridescence, Chochla is flat with outlines), no pixels (A5), no isometric (A6; Grań is a side view panorama). Against the identity brands: Skibka's grain and paper are absent from Margines (clean graph paper, no texture) and Szyld's grain sits on saturated digital gradients, not on paper; Klamra's flat lemon, pink, mint and sky with hard offset shadows are absent from Chochla (warm Memphis palette, patterns, halftone instead of shadows, comic panels); Cuvée's ivory, black and brass are absent from Kruszec (cold navy, sage, platinum, a condensed modern serif instead of a Didone); Wolnobieg's 1970s orange and mustard bands are absent from Grań (cool layered blues, flat vector depth). Nobody copies Trzask's dark roast stencil look.

## Rules shared by the six

- Copy rules, fonts, footer, no real brands, one letter words and line endings: `NOTES.md`, "Rules that apply to every agent". Headline at most 6 words, one benefit, matching the screen under it. The validator counts the words.
- Text over colour: every text pair at least 4.5:1 below 24 CSS px (18.66 px bold), at least 3:1 for headlines and UI parts. The palettes below give the measured pairs; tune lightness, keep hue.
- Each app has a mini design system in `studio/aso/apps/<slug>/theme.css`: colour tokens, a type scale, radius, spacing, and the components its screens use (buttons, chips, list rows, cards, tab bar, sheet). The 5 to 8 screens are HTML components fed by `copy/<lang>.json`; nothing is hard coded in a composition.
- UI data is realistic, complete and made up, separately written for PL and EN (EN uses the same world, written for an English speaker, not translated word for word). Status bar time `9:30`.
- Composition: the six frames of a set never repeat one skeleton, and "phone in the middle with a caption above" may appear at most once per set. Each app's compositions are listed below; Play compositions are separate designs at 9:16 with the screen as a frameless card and the headline box within 20 percent of the area.
- Subtitles are optional, at most 8 words, never repeat the headline.
- Variant B replaces screenshot 1 only, in both stores and both languages, with a different promise and the hypothesis written on the page.
- Feature graphic: no device, app name and promise inside the central 80 percent, the centre circle (about 140 by 140 px) free of text, no pure white, black or dark grey background.
- Icons: the same artwork for both stores, no text, App Store as an opaque square 1024 PNG, Play as an opaque full square 512 PNG (mask and shadow are added by Google), separate background and foreground layers for Icon Composer.
- The page sections follow the brief (hero strip, client and task, direction, sequence story, search results mock, PL and EN switch, A and B side by side, feature graphic and icons, what the client gets with the ZIP, CTA and footer), plus the language argument: the PL and EN text files shown side by side, "a new language is one new file". Each page is styled in its app's style; the shared parts are data and unstyled primitives, the skeleton of the six pages must differ.

## B1 Grań: illustrated panorama, mountain trails in the Sudety

**Name.** Candidates: Grań, Przełęcz, Kopa. Searches: `"Grań" aplikacja szlaki górskie`, `"Przełęcz" app szlaki Sudety aplikacja`, `"Kopa" aplikacja turystyczna szlaki`, and an App Store and Google Play query. No app of these names in the hiking or maps category. Apps that do exist and whose names are avoided: Mapa Turystyczna, Szlaki, Górska Korona, Traseo, Mapy.cz, PeakVisor, Polskie Szlaki, Hiking Map Poland, Awesome Giant Mountains. `Kopa` is also the name of many real Sudety summits, which would confuse search. Chosen: **Grań** (a ridge; the Main Sudety Trail runs along ridges, and the panorama is literally a ridge walked across six frames).

**Concept.**

- Problem: weekend hikers in the Sudety (Karkonosze, Góry Stołowe, Góry Sowie, Masyw Śnieżnika) plan with a paper map or a generic app, lose signal in valleys and misjudge how long a loop takes, so they come down in the dark.
- User: hikers from Wrocław, Poznań and Opole, 25 to 55, often with a friend or children, one or two trips a month.
- Key features: (1) routes on marked trails with walking times counted like the signposts and adjusted to your own pace; (2) offline maps of whole ranges; (3) a turnaround alarm from sunset and your pace. Also: elevation profile, wind and visibility on the ridge (sample data), a summit logbook.
- Store category: App Store "Nawigacja / Navigation", Google Play "Mapy i nawigacja / Maps & Navigation".
- Data: real geography (Śnieżka 1603 m, Szrenica 1362 m, Śnieżnik 1425 m, Wielka Sowa 1015 m, Szczeliniec Wielki 919 m, Karpacz, Karłów, Międzygórze), trail colours as on Polish signposts (red, blue, green, yellow, black). Mountain huts and businesses stay unnamed. Example route: Karpacz, Biały Jar to Śnieżka, 6.8 km, up 790 m, 3 h 10 min at your pace; offline maps Karkonosze 182 MB, Góry Stołowe 96 MB.

**Palette** (contrast measured).

- Mgła `#F5EBDD` sky and ground; Świt `#F4CDA5` warm sky band; Dal `#AFC3CB` far ridge; Grzbiet `#6E8F9B` mid ridge; Las `#2E5446` forest and primary buttons; Głąb `#17302A` ink; Łąka `#A7BF73` meadow; Znak `#C8352B` trail red; Słońce `#F2A93B` sun; Biel `#FFFDF8` marker white and UI surface.
- Pairs: Głąb on Mgła 11.9, Biel on Las 8.4, Głąb on Dal 7.7, Głąb on Łąka 6.9, Znak on Biel 5.2 (small UI text allowed), Znak on Mgła 4.5 (labels only at 18 px bold and up), Biel on Grzbiet 3.4 (large only).

**Fonts.** Overpass (variable, OFL; derived from the Highway Gothic road signs, so it reads like a trail signpost) at 400, 600, 800 and 900, tabular figures for times and heights. Polish check: pass at all four weights, sheet looked at.

**UI screens** (mini design system: cream surfaces, forest green buttons, trail colour chips shaped like the painted stripe marks, 14 px radius).

1. Mapa: the trail map with coloured trails and segment times between junctions.
2. Trasa: the route plan with total time, distance, ascent, the pace setting and the junction list.
3. Mapy offline: ranges to download with sizes and the downloaded state.
4. Powrót przed zmrokiem: sunset time, turnaround time, the alarm switch.
5. Profil: elevation profile of the route with the steep sections marked.
6. Na grani: wind, gusts, visibility and cloud base for the ridge (sample data).
7. Dziennik: summits climbed with date, height and route.

**Sequence** (App Store, the panorama runs left to right as one day on the ridge).

| #   | PL                                   | EN                                    | Screen                | Composition in the panorama                                                                                                                                                                |
| --- | ------------------------------------ | ------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Szlaki Sudetów z czasem przejścia    | Sudety trails with real walking times | Mapa                  | Valley at dawn. Headline top left over the sky. Phone large, bottom right, half sunk behind the meadow layer; the trail on the landscape runs into the trail on the map at the phone edge. |
| 2   | Mapa działa tam, gdzie brak zasięgu  | Maps that work with no signal         | Mapy offline          | Forest climb. Phone smaller and high on the mid ridge, headline at the bottom in Biel on the forest band.                                                                                  |
| 3   | Wrócisz na dół przed zmrokiem        | Get down before dark                  | Powrót przed zmrokiem | Open slope. Phone leaning 6 degrees against a rock, the sun lower right; headline in the upper third.                                                                                      |
| 4   | Każde podejście widać przed wyjściem | See every climb before you go         | Profil                | Summit (the Śnieżka like cone peaks in this frame). Phone turned to landscape on the summit; the profile on screen traces the ridge silhouette behind it.                                  |
| 5   | Wiatr i widoczność na grani          | Wind and visibility on the ridge      | Na grani              | Ridge in cloud. Wind lines and a cloud layer drift across, phone at the top, headline in the middle band.                                                                                  |
| 6   | Zdobyte szczyty w jednym dzienniku   | Every summit in one logbook           | Dziennik              | Descent at sunset, warm sky band. Phone bottom left in the meadow, headline top right.                                                                                                     |

Story: the first three answer "what is it" for a hiker skimming search results (trails with times, works offline, safe return), the fourth to sixth show depth on the day itself (the climb, the ridge, the memory). The trail line is the thread: it enters at the bottom of frame 1, climbs through 2 and 3, peaks in 4, crosses the ridge in 5 and comes down in 6.

**Variant B** (screenshot 1): "Szlak dobrany do twojego tempa" / "Trails matched to your pace", the Trasa screen with the pace setting open. Hypothesis: first time Sudety visitors who doubt their fitness install more often when the first frame promises a route that fits them than when it promises precise times.

**Google Play set.** Its own strip, 6 x 360 = 2160 CSS px, redrawn for 9:16 (lower ridge line, less sky). Screens as frameless cards with a neutral status bar. Headline boxes in the sky band, at most 20 percent of the area.

**Feature graphic.** A wide crop of the ridge at sunset with the trail line, the name Grań and "Szlaki Sudetów z czasem przejścia" in the centre; no phone.

**Icon.** Three flat ridge layers (Dal, Grzbiet, Las) on Mgła with a short red and white trail stripe across the front ridge.

**Risks.** Seams: anything in the foreground that crosses a frame edge must be drawn in the strip, not per frame; the seam guard checks the declared boxes and the seams are reviewed at 400 percent. Flat vector can look like stock clip art: keep a restrained palette, real ridge shapes and the trail as the only red. Overpass at 900 is wide: check the longest Polish headline ("Każde podejście widać przed wyjściem") at 440 px.

**How it differs from the other five.** The only set where the six images are one picture: a landscape you pan across, with depth from layered ridges and phones that stand inside the scene instead of floating on a background. Cool blue greens and cream with a single red, against the duotone gradients of Szyld, the paper of Margines, the patterned cream of Chochla, the navy of Kruszec and the silver of Bis. A signpost grotesk at moderate size; the headline lives in the sky and never fights the picture.

## B2 Szyld: strong gradients with tilted devices, local shops with pickup

**Name.** Candidates: Szyld, Kram, Witryna. Searches: `"Szyld" aplikacja zakupy lokalne sklepy odbiór osobisty`, `"Kram" app lokalne sklepy zamów odbierz`, `"Witryna" aplikacja click and collect lokalne sklepy`, plus the store query. No app called Szyld or Witryna in shopping. `Kram` is one letter from the Kramp app (agricultural parts ordering), rejected; `Witryna` is the everyday word for a website, which hurts search. Existing apps in the category, avoided: Moje Sklepy, Zakupy u Swoich, Zado, blisko.pl, the Żabka app. Chosen: **Szyld** (the shop sign over a door; short, local, a strong word for big type).

**Concept.**

- Problem: small neighbourhood shops (bakery, greengrocer, hardware shop, florist, bookshop) lose customers to delivery platforms; people would buy local but do not want to queue or find the bread sold out.
- User: residents of Poznań's Jeżyce and Łazarz, 25 to 45, walking or cycling home from work.
- Key features: (1) one basket across several shops on your street, with a pickup route; (2) a pickup time you choose and a code at the counter; (3) standing orders (Saturday bread). Also: a map of shops nearby, shop pages with real stock.
- Store category: App Store "Zakupy / Shopping", Google Play "Zakupy / Shopping".
- Data: invented shops with unusual names (for example Piekarnia Na Zakręcie, Warzywniak Pod Kasztanem, Śrubka i Syn, Kwiaciarnia Kalina, Księgarnia Dwie Półki; the app agent searches each name before use), real street grid of Jeżyce allowed, normal prices of goods shown as app content (rye loaf 14,50 zł), never a discount, a promotion or the app's price.

**Palette** (contrast measured).

- Butelka `#0B4A3D` bottle green; Limonka `#D5F25C` lime; Grejpfrut `#FF5A36` grapefruit; Mleko `#F7F4EA` milk; Smoła `#0E1E1A` ink; neutrals `#DCE3DF`, `#5E6B66`.
- Duotones: Butelka to Limonka (frames 1, 3, 5), Grejpfrut to Limonka (frames 2, 4, 6), always with SVG grain at low opacity. No purple, no blue.
- Pairs: Mleko on Butelka 9.3, Smoła on Limonka 13.7, Smoła on Grejpfrut 5.6, Butelka on Limonka 8.1, Smoła on Mleko 15.7, `#5E6B66` on Mleko 5.1. Not allowed: Mleko on Grejpfrut (2.8).

**Fonts.** Mona Sans (variable, OFL) at width 125 and weights 800 and 900 for headlines, at width 100 and weights 400, 600 and 700 for UI. Polish check: pass at all five instances, sheet looked at.

**UI screens** (mini design system: milk surfaces, ink text, lime as the action colour, chunky 20 px radius, bold numbers).

1. W okolicy: map of shops with open now badges.
2. Sklep: a shop page with today's stock and a pickup hold time.
3. Koszyk: one basket split by shop, with the route order.
4. Godzina odbioru: time slots per shop.
5. Kod odbioru: the pickup code and the shop's counter note (a drawn 2D code pattern, not a real QR).
6. Stałe zamówienie: Saturday bread, every week, pause or skip.
7. Gotowe: status of each shop ("czeka na półce").

**Sequence.**

| #   | PL                                     | EN                                 | Screen            | Composition                                                                                                                                                            |
| --- | -------------------------------------- | ---------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Zamów z ulicy, odbierz po drodze       | Order local, collect on your way   | Koszyk            | Headline over three lines across the top, larger than the phone; phone turned about 18 degrees on Y and 6 on Z, cut by the right and bottom edges. Butelka to Limonka. |
| 2   | Sklepy z twojej okolicy na mapie       | Every shop on your street, mapped  | W okolicy         | Phone lying back about 35 degrees on X like on a table; shop pins lifted off the screen in 3D. Headline at the bottom.                                                 |
| 3   | Jeden koszyk, trzy sklepy, jedna trasa | One basket, three shops, one route | Koszyk with route | Three shop tags fly out of the phone along motion lines; headline set vertically along the left edge.                                                                  |
| 4   | Odbiór o godzinie, którą wybierasz     | Pick up when it suits you          | Godzina odbioru   | Phone tilted the other way and cut by the left edge; a huge "17:30" in outline type behind it.                                                                         |
| 5   | Kod przy ladzie i po sprawie           | Show your code at the counter      | Kod odbioru       | Phone almost frontal but rolled; the code card leaves the screen and comes forward.                                                                                    |
| 6   | Sobotni chleb zamówi się sam           | Saturday bread that orders itself  | Stałe zamówienie  | Phone rising from the bottom edge; a giant "SOBOTA" / "SATURDAY" partly behind it.                                                                                     |

Story: frames 1 to 3 say what it is (local shops, pickup, many shops in one go), 4 and 5 remove the two fears (timing, the queue), 6 turns it into a habit.

**Variant B** (screenshot 1): "Sklep odłoży, ty odbierzesz" / "They set it aside for you", the Sklep screen with the hold time. Hypothesis: the fear that fresh bread or flowers sell out moves more people than the convenience of a route, so a reservation promise converts better.

**Google Play set.** Separate 9:16 compositions with the tilted screen cards (no device hardware), the same duotone rhythm, headline boxes within 20 percent.

**Feature graphic.** Butelka to Limonka with grain, "Szyld" in Mona Sans expanded 900 and the promise, a row of three shop tags in perspective; no phone.

**Icon.** A hanging shop sign on a bracket in Limonka on Butelka, a small paper bag cut out of the sign.

**Risks.** Grain makes files heavy: JPEG with mozjpeg, grain at low amplitude and coarse scale, budget checked by the validator. 3D tilt can make UI unreadable: the visible part of the screen stays readable in the 200 px thumbnail, tilt at most 25 degrees on Y. Gradient banding: grain also dithers it.

**How it differs from the other five.** The only set built on energy and perspective: phones in 3D leaving the frame, headlines bigger than the device, grainy two colour gradients. Bottle green, lime and grapefruit are found in none of the other five (Chochla's colours are flat primaries, Bis is silver and pastel iridescence, Kruszec is navy). An expanded heavy grotesk instead of the signpost grotesk of Grań or any hand or display face.

## B3 Margines: hand drawn annotations, language flashcards

**Name.** Candidates: Margines, Ściąga, Bazgroł. Searches: `"Margines" aplikacja fiszki nauka języków`, `"Ściąga" app fiszki słówka angielski aplikacja`, `"Bazgroł" aplikacja`, plus the store query. No app of these names in education. Existing apps avoided: Fiszkoteka, iFiszki, Memause, Flexi, Cram, Fiszki na Zegarek, English Academy, Repeat Learn. `Ściąga` (a cheat sheet) sends the wrong signal for a learning app; `Bazgroł` (a scribble) undersells it. Chosen: **Margines** (the margin of a notebook, where the notes and doodles live).

**Concept.**

- Problem: learners meet new words in books, series and on trips, write them down and forget them; generic word lists lose the context that made the word memorable.
- User: adults learning a language on their own, 20 to 45, who read in the language or watch series with subtitles.
- Key features: (1) cards keep the sentence the word came from; (2) reviews scheduled just before you would forget (spaced repetition); (3) draw your own hint on the back of a card. Also: add a word by selecting it in a pasted text, decks from books, series and trips, a daily set measured in minutes.
- Store category: App Store "Edukacja / Education", Google Play "Edukacja / Education".
- Data: PL version is a Polish speaker learning English (deck "Z książki: The Long Way Home", invented title checked by the agent) and Spanish (deck "Wyjazd do Walencji"); EN version is an English speaker learning Polish (cards like "szczęście", "spóźnić się" with Polish context sentences), which also shows off the diacritics. Counts: 18 cards today, about 6 minutes, 412 words known.

**Palette** (contrast measured).

- Papier `#FBF8F0` paper; Kratka `#CFE0EE` grid lines (decorative); Atrament `#1E2A5E` navy ink, UI text; Flamaster `#E2433B` red marker; Zakreślacz `#FFE45E` highlighter; Zieleń `#2E9E5B` green marker; Ołówek `#6B7080` pencil grey; sticker mint `#B8EBD0`.
- Pairs: Atrament on Papier 12.8, Atrament on Zakreślacz 10.7, Atrament on Kratka 10.1, Ołówek on Papier 4.7, Flamaster on Papier 3.9 and Zieleń on Papier 3.2 (handwritten notes at 24 px and up only).

**Fonts.** Caveat (variable, OFL) at 500, 600 and 700 for headlines and notes; Lexend (variable, OFL, made for reading ease, fitting for a learning app) at 400, 500 and 700 for the UI. Polish check: pass at all six instances, sheet looked at. Neither has `→`: arrows are SVG.

**UI screens** (mini design system: paper white cards with a red margin rule, navy ink text, rounded 12 px, a single green "Pamiętam" and red "Jeszcze raz").

1. Dziś: today's review set with the number of cards and minutes.
2. Fiszka, przód: the word and its context sentence.
3. Fiszka, tył: meaning, the sentence translated, the user's drawn hint.
4. Dodaj z tekstu: a pasted paragraph with a word selected.
5. Talie: decks from a book, a series, a trip.
6. Postęp: words known, the next reviews on a small calendar.
7. Wymowa: listen and record yourself.

**Sequence.** Every annotation points at a specific UI element; nothing is decoration.

| #   | PL                                     | EN                                     | Screen         | Composition                                                                                                                                                             |
| --- | -------------------------------------- | -------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Słówka zapamiętane razem ze zdaniem    | Learn words with the sentence attached | Fiszka, przód  | Phone right, turned 4 degrees; the context sentence circled in red with an arrow to a handwritten note; sticker "EN / PL" on the corner. Headline handwritten top left. |
| 2   | Powtórka tuż przed zapomnieniem        | Review right before you forget         | Dziś           | Phone left; "18 kart, 6 min" highlighted in yellow; a hand drawn forgetting curve in the margin points to the next review date.                                         |
| 3   | Narysuj skojarzenie, zostanie w głowie | Draw a hint, make it stick             | Fiszka, tył    | The card leaves the phone, enlarged and taped to the grid with washi tape; the user's doodle on it; a short arrow back to the phone.                                    |
| 4   | Dodaj słowo prosto z tekstu            | Save words straight from the text      | Dodaj z tekstu | Phone centred low; the selected word underlined twice in marker and a "+" sticker; headline above. The one centred frame of the set.                                    |
| 5   | Dzienna porcja na sześć minut          | A daily set in six minutes             | Postęp         | Phone right; a pencil bar chart in the margin echoes the chart on screen; "6 min" circled in green.                                                                     |
| 6   | Talie z książek, seriali i podróży     | Decks from books, shows and trips      | Talie          | Three paper deck cards fanned out of the phone with doodled book, screen and plane icons.                                                                               |

Story: 1 to 3 explain the method (context, timing, your own hint), 4 shows how words get in, 5 how little time it takes, 6 the variety.

**Variant B** (screenshot 1): "Fiszki z twoich własnych notatek" / "Flashcards from your own notes", the Dodaj z tekstu screen. Hypothesis: people who already keep a vocabulary notebook respond more to "your own notes" than to the context promise.

**Google Play set.** 9:16 compositions on the same paper, screen cards without hardware, the margin notes kept outside the 20 percent headline box (the notes are labels of UI, the headline box is only the headline).

**Feature graphic.** Graph paper, "Margines" handwritten with a red underline, one flashcard with a doodle, an arrow; no phone.

**Icon.** A paper card with the red margin rule and a small navy doodled star, on Papier with a hint of grid.

**Risks.** Chaos: at most three annotations per frame, each tied to one element, none over text in the UI. Rough strokes must be deterministic (rough.js with a fixed seed, or our own jitter), drawn as SVG paths. Caveat at small sizes is weak: handwritten text at 22 CSS px and up only.

**How it differs from the other five.** The only set that looks made by hand on paper: a graph paper ground, marker strokes that wobble, a handwriting face. Navy ink and marker colours on white paper, no gradients, no patterns, no glass, no chrome. Its compositions are about explaining the UI (pulled out pieces and notes), where Grań shows a scene, Szyld shows motion, Chochla tells a comic, Kruszec stages one chart and Bis builds a collage.

## B4 Chochla: Memphis and pop art, recipes and meal planning

**Name.** Candidates: Chochla, Rondel, Miska. Searches: `"Chochla" aplikacja przepisy planowanie posiłków`, `"Rondel" app przepisy aplikacja kulinarna`, `"Miska" recipe meal planner app`, plus the store query. `Miska` exists on the App Store in Food and Drink (a poke bowl delivery app), rejected. No app called Chochla or Rondel found. Existing apps avoided: Przepisy.pl, Cooklet, Gastronauci, Paprika, Mealime, Plan to Eat, Happie. Chosen: **Chochla** (a ladle; funny, round, Polish, and a great shape for the icon).

**Concept.**

- Problem: households decide dinner every evening, shop without a list, buy twice and throw food away.
- User: couples and families of three to five, 28 to 45, cooking at home four to six times a week.
- Key features: (1) a week of dinners planned by dragging recipes into days; (2) the shopping list builds itself, grouped by shop aisle; (3) recipes from what is already in the fridge. Also: portions scaled for two to six, cook mode with steps and timers, family recipes.
- Store category: App Store "Jedzenie i picie / Food & Drink", Google Play "Jedzenie i napoje / Food & Drink".
- Data: Polish home cooking in the PL set (zupa pomidorowa z ryżem, pierogi ruskie, leczo z kaszą, placki z cukinii, gulasz wołowy z kopytkami), a mixed English kitchen in the EN set (tomato soup, lentil chilli, shakshuka, potato and cheese pierogi). Food drawn only from shapes: a tomato is a circle with a star, pierogi are half circles with zigzag edges, pasta is zigzags, carrots are triangles. No photos.

**Palette** (contrast measured).

- Krem `#FFF3DD` ground; Pomidor `#EE4B2B` tomato; Musztarda `#F6B400` mustard; Kobalt `#2547C8` cobalt; Turkus `#19B3A3` turquoise; Róż `#F7A8C9` pink; Kontur `#1A1714` outline and text; speech bubble white `#FFFFFF`.
- Pairs: Kontur on Krem 16.3, Kontur on Musztarda 9.7, Kontur on Róż 9.7, Kontur on Turkus 6.8, Krem on Kobalt 6.8, Kontur on Pomidor 4.8, white on Pomidor 3.7 (large only).
- Patterns: squiggles, dot grids, confetti triangles and zigzag bands, Ben-Day halftone for shading. Patterns live in the frame border and the background only, never over the UI.

**Fonts.** Bangers (OFL, comic book lettering) for headlines in speech bubbles; Figtree (variable, OFL) at 500, 700 and 800 for the UI. Polish check: pass at all four instances, sheet looked at. Bangers' accents on capitals stand tall: line height at least 1.2 and top padding inside the bubble. Bangers has no `→`: arrows are SVG.

**UI screens** (mini design system: cream surfaces, 2.5 px black outlines on cards and buttons, flat fills, chunky 16 px radius, no shadows).

1. Tydzień: the week plan with a dinner per day.
2. Zakupy: the shopping list grouped by aisle, ticked items.
3. Z lodówki: pick what you have, matching recipes.
4. Przepis: ingredients with the portion stepper.
5. Gotowanie: step 3 of 6 with a running timer.
6. Kolekcje: family recipes and favourites.

**Sequence.**

| #   | PL                                 | EN                               | Screen    | Composition                                                                                                                      |
| --- | ---------------------------------- | -------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Obiady na cały tydzień zaplanowane | A whole week of dinners, sorted  | Tydzień   | Phone left of centre with a thick outline; a tomato character top right speaks the headline in a big bubble; zigzag band behind. |
| 2   | Lista zakupów pisze się sama       | The shopping list writes itself  | Zakupy    | Two comic panels: the top panel is the bubble, the bottom panel holds the phone.                                                 |
| 3   | Ugotuj z tego, co masz             | Cook with what you've got        | Z lodówki | Phone centred; egg, zucchini, cheese and onion shapes around it point in; bubble from the egg.                                   |
| 4   | Porcje dla dwojga albo piątki      | Portions for two or five         | Przepis   | Phone right; a big halftone "x2" and "x5" in circles on the left; bubble from a pierog.                                          |
| 5   | Krok po kroku, z minutnikiem       | Step by step, timers included    | Gotowanie | Phone tilted 5 degrees in 2D; a pop art burst behind the timer area; bubble from a pan.                                          |
| 6   | Rodzinne przepisy w jednym miejscu | Family recipes, all in one place | Kolekcje  | Three comic panels in a row of recipe cards, the phone in the last one.                                                          |

Story: 1 to 3 cover the evening problem end to end (plan, shop, cook with what is there), 4 and 5 the cooking itself, 6 the reason to stay.

**Variant B** (screenshot 1): "Koniec z pytaniem, co na obiad" / "Never ask what's for dinner again", the Tydzień screen. Hypothesis: naming the daily pain in the first frame hooks more than naming the planning feature.

**Google Play set.** 9:16 compositions with the screen as an outlined card, the comic panel grid adapted to the shorter frame, bubbles within the 20 percent box.

**Feature graphic.** Cream with a confetti border, a big bubble "Chochla" plus the promise, a row of shape food characters; no phone.

**Icon.** A cobalt ladle with a black outline on tomato red, three mustard dots.

**Risks.** Decoration over UI: patterns stay out of the phone area and its 16 px margin. Outlines at 3 x scale must stay crisp (draw in SVG, not with CSS borders on transformed elements). Bangers is caps only and condensed: check the longest Polish headline for wrapping inside the bubble.

**How it differs from the other five.** The only set told as a comic: speech bubbles, panels, characters made of shapes, halftone dots, Memphis patterns framing the scene. Flat warm primaries with black outlines and no gradients, no grain, no glass, no 3D. Bangers is the only lettering face of the six; Margines also feels hand made, but with ink notes on graph paper, not printed pop colour.

## B5 Kruszec: dark premium glass, personal budget and investing

**Name.** Candidates: Kruszec, Zapas, Grosz. Searches: `"Kruszec" aplikacja budżet finanse osobiste`, `"Zapas" app budżet domowy oszczędzanie aplikacja`, `"Grosz" aplikacja budżet inwestowanie`, plus the store query. `Grosz` is too close to 4grosze, an existing Polish envelope budgeting app, rejected. No app called Kruszec or Zapas found; `Zapas` is a very common word. Existing apps avoided: Freenance, YNAB, Wallet by BudgetBakers, Monefy, Moje Finanse, 4grosze, Money Manager Ex. Chosen: **Kruszec** (precious metal ore; calm, valuable, not a promise of anything).

**Concept.**

- Problem: people with savings, an IKE or IKZE account and a few ETFs keep the budget in one app and the investments in a spreadsheet, and never see the whole picture.
- User: 28 to 50, salaried or self employed, saving every month, investing passively.
- Key features: (1) net worth over time on one chart; (2) what is safe to spend today, from the month's budget; (3) the safety net counted in months of expenses. Also: allocation against your own target, goals funded by deposits, a calm monthly report.
- Store category: App Store "Finanse / Finance", Google Play "Finanse / Finance".
- Data: sample data only, and every frame says "Dane przykładowe" / "Sample data" in the UI. No rate of return, no gain promise, no named bank, broker or fund; account types are generic (konto osobiste, oszczędnościowe, IKE, IKZE, obligacje skarbowe, ETF na indeks światowy). Example: net worth 186 420 zł, safe to spend today 142 zł, safety net 5.2 months, target allocation 70 / 20 / 10.

**Palette** (contrast measured).

- Głębia `#0A1020` ground; Granat `#131D33` surface; glass `rgba(255,255,255,0.06)` over Granat (about `#1F283C`) with a `rgba(255,255,255,0.14)` edge; Tekst `#EDF1F7`; Tekst 2 `#9AA7BB`; Szałwia `#8FD4B6` chart line; Lód `#B8CBE6` second series; Platyna `#DCE1E8` headline accent; Koral `#E8998B` for the rare negative value.
- Pairs: Tekst on Głębia 16.7, Szałwia on Głębia 11.1, Lód on Granat 10.2, Platyna on glass 11.2, Tekst 2 on Granat 6.9, Tekst 2 on glass 6.0, Koral on Granat 7.5.
- Glow: one soft radial light in Szałwia at about 12 percent behind the chart; no neon edges, no saturated colour anywhere.

**Fonts.** Instrument Serif (OFL) regular and italic for headlines and big numbers on the marketing layer; Manrope (variable, OFL) at 400, 500, 600 and 700 with tabular figures for all UI. Polish check: pass at all six instances, sheet looked at. Instrument Serif has no `→`: arrows are SVG.

**UI screens** (mini design system: navy surfaces, frosted glass cards with 1 px light edges, 22 px radius, one line weight for charts, numbers always tabular).

1. Majątek: the net worth chart with range switch (rok, 3 lata, wszystko).
2. Budżet: the month, safe to spend today, categories as thin bars.
3. Poduszka: months of expenses covered, with the target.
4. Alokacja: a ring of the portfolio against the target, with a rebalance note.
5. Cel: "wkład własny", deposits on a timeline (no growth assumed).
6. Raport: the month in three sentences and three numbers.
7. Konta: accounts, entered by hand or imported from CSV.

**Sequence.**

| #   | PL                                      | EN                                   | Screen   | Composition                                                                                                                   |
| --- | --------------------------------------- | ------------------------------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 1   | Cały majątek na jednym wykresie         | Your net worth on one chart          | Majątek  | The chart line leaves the phone and runs across the whole frame with a soft glow; phone lower right; serif headline top left. |
| 2   | Wiesz, ile możesz dziś wydać            | Know what's safe to spend            | Budżet   | Phone high and centred left; the "142 zł" card floats out in front, sharper than the phone.                                   |
| 3   | Poduszka finansowa liczona w miesiącach | Your safety net, counted in months   | Poduszka | A large glass gauge card in front, the phone behind it slightly blurred, depth of field.                                      |
| 4   | Portfel trzyma się twojego planu        | Keep your portfolio on plan          | Alokacja | The allocation ring enlarged as a glass ring around the phone.                                                                |
| 5   | Każda wpłata przybliża cel              | Every deposit brings the goal closer | Cel      | A horizontal glass timeline crosses the frame behind the phone, deposits as dots.                                             |
| 6   | Miesiąc w jednym spokojnym raporcie     | Your month in one calm report        | Raport   | Two phones overlapping, the report in front.                                                                                  |

Story: 1 to 3 cover the whole picture, the day and the safety (what it is and why it is calm), 4 and 5 the investing side without promises, 6 the ritual.

**Variant B** (screenshot 1): "Budżet i inwestycje w jednym miejscu" / "Budget and investments in one place", the Konta screen. Hypothesis: people who juggle a budget app and a portfolio spreadsheet respond more to "one place" than to the chart.

**iPad 13" set.** Six frames at 2064 x 2752 (canvas 1032 x 1376 at scale 2), PL and EN, the same headlines; the screens become a two column dashboard (chart and accounts side by side). Only the App Store needs it.

**Google Play set.** 9:16 compositions, glass screen cards without hardware, headline boxes within 20 percent.

**Feature graphic.** Navy with one glowing net worth line across, "Kruszec" in Instrument Serif and the promise, "Dane przykładowe" small; no phone.

**Icon.** A frosted glass square on navy with a single calm sage line; no arrow, no rising stairs.

**Risks.** A finance chart reads as a promise: the line is calm with dips, the axis says "przykładowe dane", no percentages of return anywhere, and the validator blocks the gain words. Blur and glow make heavy PNGs: measure, then JPEG at quality 90 or more with 4:4:4 if the app goes over budget. Dark images can look muddy in the thumbnail: test the first three at 200 px.

**How it differs from the other five.** The only dark set: deep navy with frosted glass in depth, no texture, no pattern, almost no colour. The hero is a data line, not a device or a character. An elegant condensed serif for the marketing layer, against the grotesks of Grań and Szyld, the handwriting of Margines, the comic lettering of Chochla and the bubble face of Bis.

## B6 Bis: Y2K holographic chrome, music discovery and concerts

**Name.** Candidates: Bis, Błysk, Supernowa. Searches: `"Bis" aplikacja koncerty odkrywanie muzyki`, `"Błysk" app muzyka koncerty`, `"Supernowa" aplikacja muzyka koncerty`, plus an App Store and Google Play query. `Supernowa` collides with the Supernova Festival in Poland and the Supernova Music Player, rejected. No app called Bis or Błysk found; `Błysk` is a generic word and returns stock footage. Existing apps avoided: Bandsintown, Shazam, Biletomat, eventseeker, CrowdMate, Unknown Band, FlashBeats, ONSTAGE. Chosen: **Bis** (an encore; three letters, perfect in chrome bubble letters).

**Concept.**

- Problem: fans miss concerts by small artists in their own city and hear about them after the tickets are gone; discovery feels the same everywhere.
- User: 18 to 35, Warszawa, goes to two or three concerts a month in clubs, listens a lot.
- Key features: (1) concerts by the artists you listen to, nearby; (2) new artists playing near you, with 30 second previews; (3) a reminder before ticket sales open. Also: friends who are going, the month in a calendar, tickets kept as stickers after the show.
- Store category: App Store "Muzyka / Music", Google Play "Muzyka i audio / Music & Audio".
- Data: invented artists and venues only (for example Mira Szum, Brokat Express, Zorza i Psy, Pola Ołówek; clubs Przelot and Hala Pogłos; the app agent searches every name before use and drops any that exist). Covers are compositions of shapes and gradients. No streaming service is named; "artists you listen to" comes from "your library". No ticket prices.

**Palette** (contrast measured).

- Chrom jasny `#EEF1F6` ground; Chrom `#AAB2C0`; Grafit `#3B4250`; Atrament `#111217` text; Holo róż `#FF8AD0`; Holo cyjan `#72EFFF`; Holo limonka `#D7FF63`; Holo brzoskwinia `#FFC7A0`.
- Iridescence: conic and radial blends of the four holo colours over silver, kept to blobs and stickers; the ground stays silver, so the set never reads as a purple to blue gradient.
- Pairs: Atrament on Chrom jasny 16.5, on Holo limonka 16.4, on Holo cyjan 13.8, on Holo róż 8.7, on Chrom 8.8; Grafit on Chrom jasny 8.9.

**Fonts.** Modak (OFL, a puffy bubble face) for the chrome words and headlines; Quicksand (variable, OFL, rounded) at 500, 600 and 700 for the UI. Polish check: pass at all four instances, sheet looked at. Modak has very tall vertical metrics: set line height explicitly. Neither has `→`: arrows are SVG. Chrome letters are SVG text or paths with layered gradients and a dark edge; no `-webkit-text-stroke` (it shows inner contours).

**UI screens** (mini design system: silver surfaces, Atrament text, holo gradients only on artwork and the active tab, pill buttons, 24 px radius).

1. Odkrywaj: a stack of artist cards with shape covers and a preview button.
2. W okolicy: concerts near you this week, with date, club and distance.
3. Koncert: details, start time, "przypomnij o biletach".
4. Znajomi: who is going (shape avatars, invented first names).
5. Kalendarz: the month with concert days marked.
6. Kolekcja: past tickets as stickers.
7. Podgląd: the 30 second preview player.

**Sequence.**

| #   | PL                                        | EN                                | Screen    | Composition                                                                                                                     |
| --- | ----------------------------------------- | --------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Koncerty artystów, których słuchasz       | Gigs by the artists you play      | W okolicy | Chrome bubble headline across the top; phone tilted 7 degrees in 2D; three shape covers as glossy stickers around it; sparkles. |
| 2   | Świeże brzmienia grają tuż obok           | Fresh sounds playing near you     | Odkrywaj  | Artist cards fan out of the phone like holo trading cards.                                                                      |
| 3   | Przypomnimy, zanim ruszy sprzedaż biletów | Heads-up before ticket sales open | Koncert   | The reminder notification enlarged as a chrome bubble beside the phone, a chrome bell sticker.                                  |
| 4   | Zobacz, kto ze znajomych idzie            | See which friends are going       | Znajomi   | Avatar bubbles orbit the phone.                                                                                                 |
| 5   | Cały miesiąc grania w kalendarzu          | A month of gigs, one calendar     | Kalendarz | Phone left; calendar days as holo tiles on the right.                                                                           |
| 6   | Każdy bilet zostaje jako naklejka         | Every ticket becomes a sticker    | Kolekcja  | A sticker collage of ticket stubs around a small phone at the bottom.                                                           |

Story: 1 to 3 say what it is (your artists live, new ones nearby, never miss the sale), 4 and 5 the plan with friends, 6 the memory.

**Variant B** (screenshot 1): "Poznaj zespół, zanim zagra u ciebie" / "Meet the band before they play", the Odkrywaj screen. Hypothesis: listeners who come for discovery convert better on a discovery promise than on "artists you already play".

**Google Play set.** 9:16 compositions, chrome edged screen cards without hardware, headline boxes within 20 percent; chrome words get a dark edge so they stay readable at 200 px.

**Feature graphic.** Silver with holo blobs at the edges, "Bis" in chrome bubble letters in the centre and the promise; sparkles; no phone.

**Icon.** A chrome four point sparkle over a holo disc on silver.

**Risks.** Chrome text is hard to read small: only key words are chrome, the rest of the headline is solid Atrament. Iridescence can drift into the purple and blue AI look: lilac stays out of the palette, the ground is silver. Real artists: every invented name is searched by the agent.

**How it differs from the other five.** The only glossy, metallic set: chrome letters with highlights, iridescent stickers, sparkles, a silver ground. Bubble type, collage compositions with many small glossy objects, 2D tilts only (3D perspective belongs to Szyld). Bright but light, against the dark navy of Kruszec and the flat printed colour of Chochla.

## Phase 2 scope (foundation, built on Grań)

1. `studio/aso/package.json` and its lock file; `lib/convention.mjs` (names), `lib/browser.mjs`, `lib/export.mjs` (sharp, PNG and JPEG paths), `lib/zip.mjs`, `lib/manifest.mjs`; `kit/` with the generic phone frame (App Store), the frameless screen card (Play), both status bars, the composition harness (a page per store and language that renders one frame or a whole strip, waits for fonts and declares headline and foreground boxes).
2. Scripts: `render.mjs`, `export.mjs`, `validate.mjs`, `board.mjs`, `thumbs.mjs`, `seams.mjs`, `web.mjs`, `zip.mjs`, `manifest.mjs`, `screens.mjs`, `distinct.mjs`, `guard.mjs` and `pipeline.mjs <slug> [--from step] [--only a,b] [--skip a,b]`, with unit tests for the libs (`node --test`).
3. The site side: `sites/src/aso/apps.ts` with all six apps, `sites/src/aso/shared/` (Shell, SampleLine with "zmyślona aplikacja", StoreStrip, SearchMock without any store logo, LangSwitch island, AbPair, Downloads, manifest reader, TileStub), `sites/src/pages/aso/index.astro` with six cells (an app's own `Tile.astro` when it exists, a stub otherwise).
4. Grań end to end: screens, App Store and Play strips, variant B, feature graphic, icons, export, validation, boards, thumbnails, seams at 400 percent, ZIP, manifest, the case study page, page screenshots and the scroll probe. Then `yarn --cwd sites run check`, `yarn --cwd sites test`, `yarn --cwd sites build`, the guard, and the commit.
5. A "How to build an app" section appended to `NOTES.md` with the order of steps and the lessons from Grań.

## Quality gates (from the brief, repeated for the agents)

Validator green for every file of every set; every board looked at (alignment, text against UI, orphans, consistency between frames); the first three at about 200 px wide readable with the benefit clear in 3 seconds; Grań seams at 400 percent; PL and EN boards compared, nothing cut or squeezed; page shots at 390 and 1440 px looked at and fixed, no console errors, no horizontal scroll from 320 to 1440 px; the distinctness board of the first three of all six, and if two sets look like one template in other colours the weaker one is rebuilt; an independent reviewer with no knowledge of the process scores the rubric (readability in the thumbnail, clarity of the benefit in the first three, story of the sequence, fidelity to the style, UI quality, compliance with the specs, quality of the EN version, sales value of the page, distinctness from the other five), and everything below 4 is fixed and scored again.

## Quality control (Q, 2026-10-08)

Checked on all six sets, both languages, both stores, the iPad set and the index:

- Validator: 0 errors for all six (dimensions, RGB without alpha, truecolour PNG or JPEG, file sizes, Play aspect, counts, ZIP against the manifest, headline word counts, banned words, Play headline box under 20 percent, seam margins). Studio unit tests 19 of 19.
- Every board looked at (App Store, Play, A and B, feature graphics, icons, iPad), PL against EN, the thumbnails of the first three at 200 px, the distinctness board of all six (no two sets read as one template) and all 24 Grań seams (column check passes, crops looked at at 400 percent).
- Pages: slices at 390 and 1440 px of the six case studies and the index looked at; scroll width equal to the viewport at 320, 360, 390, 768, 1024, 1280 and 1440 px; no console errors. In the deploy layout (Gatsby build plus `sites/dist` in `public/wzornik`, `gatsby serve` on 4330): every page at 320, 390, 768, 1024 and 1440 px without horizontal scroll, console errors, failed requests, font errors or broken images; fonts and favicons load (the index uses the portfolio's fonts and favicon, which 404 only in the standalone sites server); no running animation with reduced motion; the PL and EN and store switch swaps the whole set on all six; all six ZIPs, `/wzornik/` and `/dla-klienta/` resolve.
- Content: no real brands, invented names as listed, nothing about Adrian beyond the footer line, no en or em dash.
- Size: `sites/public/aso` is 72 MB (largest file the Szyld ZIP, 13.7 MB), well under 300 MB and 50 MB per file.

Fixed:

1. Kruszec iPad: the six tablet dashboards were half empty and account names ended in an ellipsis. Every dashboard now fills both columns with real modules (net worth chart across the full width on frame 1, accounts by group, allocation, goal, cushion, budget, report), and names and sublines wrap on the tablet instead of being cut. The net worth chip on iPad frame 1 moved next to the end of the line, clear of the device.
2. Kruszec frame 4 (all stores): the allocation pills sat on the ring and over the phone. They are now two line glass tags placed clear of the device and the ring, the right one anchored to the frame edge so longer names grow inward.
3. Kruszec variant B: the account chips covered the row labels of the screen behind them; the phone moved right and the chips are smaller.
4. Margines App Store frame 4: the double marker underline crossed the next line of the sentence (line height raised, Polish one letter words glued in the EN set too). Play frame 1: the circle cut the first and last letters of the sentence and touched the source line, and the arrow ran over the text; the circle is wider and flatter, the source line has more room and the arrow ends at the circle's edge.
5. Bis frame 4: the friends orbit and its bubbles covered the list of friends on the screen; the orbit sits lower and wider, so the bubbles circle the phone below the list.
6. Bis chrome words were hard to read at thumbnail size (white top band on a silver ground); the letter gradient is darker in its upper half and the dark edge thicker, using only palette colours.
7. Pages: the PL and EN file excerpts were cut on the right at 390 px; they now wrap on all six pages.

Final results: validator 0 errors for all six; `yarn --cwd sites run check` 0 errors, 0 warnings, Prettier clean; `yarn --cwd sites test` 127 files, 1334 tests passed; `yarn --cwd sites build` 192 pages; root `yarn install --frozen-lockfile` passed on the second try (the first stopped with yarn's ECOMPROMISED mutex error), root `yarn.lock` unchanged; `yarn gatsby clean && yarn build` exit 0; deploy layout check green. Not changed: Bis keeps chrome only on the key words, so the thumbnail reads through the ink words; the reviewer may still mark the chrome words as the weakest point of thumbnail readability.

## Directory structure and URLs

The tree, ownership, file names, the validator and the budgets are in `NOTES.md` ("Parallel build", "Folder layout", "Deliverables and file names per app", "Validator"). URLs:

- `/wzornik/aso/` index of the six, each tile with the first three screenshots of its set
- `/wzornik/aso/<slug>/` case study of an app: `gran`, `szyld`, `margines`, `chochla`, `kruszec`, `bis`
- `/wzornik/aso/<slug>/<file>`: `web/`, `icons/`, `feature/`, `fonts/`, `og.png`, `favicon.svg`, `<slug>-aso.zip`, `manifest.json`
- links from `#wzornik` on `/dla-klienta/` and `#swatch-book` on `/en/for-clients/` as one block "Screenshoty do sklepów" / "App store screenshots" (the English text says the pages are in Polish, while every set switches between PL and EN), and one link from the `/wzornik/` index, added in the publication step only.

## Decisions for Adrian

Taken without asking, in the autonomous mode. App agents add their own to `STATUS.md`; the merge step copies them here.

1. **Names.** Grań, Szyld, Margines, Chochla, Kruszec, Bis. Each was searched with its category in Polish and English and in the two stores on 2026-10-07; no app of the same name in the same category turned up. Rejected for a real or near conflict: Kram (Kramp app), Miska (a food delivery app on the App Store), Grosz (4grosze), Supernowa (Supernova Festival and Supernova Music Player); rejected as too generic: Witryna, Zapas, Błysk, Kopa. The search tool is US based and thin for Polish apps, so this is evidence of absence, not a legal clearance.
2. **URLs under `/wzornik/aso/`**, next to `/wzornik/identyfikacja/`, so no app name can collide with a site or brand slug.
3. **B1 is Grań**, the set that stresses the most links of the chain (strip render, exact slicing, seam guard). **Kruszec gets the iPad 13" set**, because a finance dashboard is the most natural tablet app of the six.
4. **One iPhone size.** Apple's page now requires the "iPhone with Dynamic Island (medium display)" slot (1206 x 2622), but fills it by scaling from the largest size provided; 1320 x 2868 (accepted under "large display") is exported and covers every iPhone. No separate 1206 x 2622 set.
5. **Play compositions show the screen, not a device.** Google's preview asset guidance says to avoid device imagery; App Store sets keep the generic drawn phone, Play sets use a frameless screen card (Szyld tilts the card in 3D), feature graphics have no device at all. Showing both treatments side by side is also a selling point on the page.
6. **Play headline boxes stay within 20 percent of the image**, Google's recommendation for promotion formats; App Store headlines can be larger. The validator checks the declared box.
7. **Icons.** App Store: flat 1024 PNG, opaque, square corners. Play: 512 PNG with an alpha channel but fully opaque, full square, no shadow or rounding (Google adds a 30 percent radius mask and the shadow). Because iOS icons are now layered (Liquid Glass, dark, clear and tinted appearances), the ZIP also carries the background and foreground layers for Icon Composer; the `.icon` file itself is not produced.
8. **Export format per app.** Flat sets (Grań, Margines, Chochla) are truecolour PNG; Szyld and Bis are JPEG (grain and iridescence would make 5 to 8 MB PNGs); Kruszec starts as PNG and switches to JPEG only if it breaks the budget. Store files are never palette PNG. Budget: 20 MB published per app (hard cap 25 MB), ZIP up to 15 MB, all of ASO up to 130 MB.
9. **Separate studio package.** `studio/aso/package.json` with its own lock file, because the app-preview branch changes `studio/package.json` at the same time. The root `yarn.lock` and `sites/package.json` stay unchanged; rough.js, if used, runs in the studio and the page gets static SVG.
10. **Registry in `sites/src/aso/apps.ts`**, not in `sites/src/shared/sites.ts`, and generated JSON is written through Prettier instead of adding `public/aso` to `sites/.prettierignore`, so the ASO branch does not touch files the app-preview branch also edits.
11. **One text file per language** (`sites/src/aso/<slug>/copy/pl.json`, `en.json`) feeds both the images and the page; the ZIP carries both files and a CSV of headlines, subtitles and alt texts. A new language is one new file, and the page shows that.
12. **Real geography, made up everything else.** Grań uses real Sudety peaks, towns and the trail colour system, with mountain huts left unnamed; Szyld's shops, Bis's artists and clubs, Margines' book title and every person are invented and searched before use; Kruszec shows sample data, marked in every frame, with generic account types (IKE, IKZE, ETF) and no named institution.
13. **Prices.** Szyld shows ordinary prices of goods because they are app content; no discount, promotion or app price anywhere. Chochla and Bis show no prices.
14. **Margines EN teaches Polish**: the English set is an English speaker learning Polish words (which also shows the diacritics), the Polish set learns English and Spanish.
15. **Fonts** (all OFL, all pass the Polish check at every instance used, none used anywhere else in the portfolio): Overpass; Mona Sans; Caveat and Lexend; Bangers and Figtree; Instrument Serif and Manrope; Modak and Quicksand. Rejected after a look: Rubik Bubbles (noisy outline), DynaPuff and Gluten (overlapping `Ł` contours), Titan One (too close to Modak); seven more families miss Polish letters. Arrows are SVG because six of the ten families have no `→`.
16. **Status bars** show `9:30`, full signal, Wi-Fi and battery, no carrier, no logos; App Store images never show Android UI (App Review 2.3.10).
17. **Variant B** is rendered for both stores and both languages (4 files per app) and maps to Product Page Optimization and Play store listing experiments, which the page names.
18. **Case study pages are Polish**, `noindex`, like the other Wzornik pages; the screenshot sets on them switch between PL and EN.
19. **Publishing** happens only in phase P: one block in `#wzornik` and `#swatch-book`, one link on the `/wzornik/` index, plus `static/llms.txt`, `sites/README.md` and `REBRAND.md`. The branch is merged into `main` by the merge agent; nothing is pushed by a Wzornik agent.
20. **Grań headline 4 (PL)** is "Każde podejście widać już w domu" instead of "Każde podejście widać przed wyjściem": the planned line could only break with a one word last line at the set's headline size. The benefit is unchanged. App Store headlines are two lines at 41 CSS px in both languages, with no per language layout overrides.
21. **Grań has one sun**, low over the open slope of frame 3. The six frames are one picture, so the sunset of frame 6 is a warm sky band, not a second sun.
22. **The seam check is numeric as well as visual**: for every seam (and variant B against frame 2) the colour step across the cut is compared with the step between neighbouring columns; a ledge cut by the front layer in the Play strip was caught this way and fixed. Crops at 400 percent are in `studio/out/aso/gran/seams/`.
23. **Cloud session tooling**: the studio runs on Node 22 (`engines` lowered to `>=22`, installs use `--ignore-engines`), Chromium falls back to `/opt/pw-browsers/chromium`, and `capped.sh` now caps the Node heap instead of calling `systemd-run`, which the cloud container lacks. Fonts are fetched from the public `google/fonts` repository without `gh`.
24. **Case study page sections** follow the brief, plus a palette and type card in "Kierunek", the variant B pair for Google Play next to the App Store pair, the masked icon previews and a "Połącz kadry w panoramę" switch in the PL and EN island, which shows that the six files are cut from one picture.
25. **Szyld screenshot 1** shows the Gotowe screen (three shops on one walk home) instead of the Koszyk screen, so the basket appears once (frame 3, with the route) and the first frame shows the promise itself.
26. **Szyld headlines rephrased** so no line ends with one word at the set's size (48 CSS px App Store, 31 Play, Mona Sans width 125 weight 900): PL 4 "Godzina odbioru, jaka ci pasuje" (was "Odbiór o godzinie, którą wybierasz"), PL 5 "Pokaż kod, zakupy w ręku" (was "Kod przy ladzie i po sprawie"), EN 2 "Your street's shops on one map" (was "Every shop on your street, mapped"). The only per language layout values are the decorative giant time ("17:30" and "5:30") and word ("SOBOTA" and "SATURDAY"), sized to fill the frame.
27. **Szyld exports JPEG at quality 90** with 4:4:4 chroma (the foundation default stays 92): the ZIP is 13 MB, under the 15 MB cap, with no visible loss at 100 percent. The EN set keeps the Poznań world (shop names, Jeżyce, prices in zł) written for an English speaking resident; five invented shop names were searched on 2026-10-07 and none exists.
28. **Foundation additions during B2**, backward compatible and checked by re-rendering Grań pixel for pixel: `box` and `transform` options on the kit phone and card (a device may bleed off the frame and take a 3D transform), vertical headlines (`data-vertical`) in the line check, and `jpegQuality` in `app.json`.
29. **Margines headlines rephrased** so no line ends with one word at the set's size (Caveat 700, 58 CSS px App Store, 38 Play): PL 2 "Powtórka w porę, zanim zapomnisz" (was "Powtórka tuż przed zapomnieniem"), EN 1 and the EN feature line "Words that keep their sentence" (was "Learn words with the sentence attached"). The benefit of each is unchanged.
30. **Margines invented titles**: "The Long Way Home" exists (several novels), so the PL book deck is "Salt on the Windowsill", the series "Night Shift on Harbour Street"; the EN set (an English speaker learning Polish) uses "Lato na Kazimierzu", "Sąsiedzi z trzeciego piętra" and a trip to Kraków. All four were searched on 2026-10-07 and none was found. Variant B gets its own screen state ("Z twoich notatek", a photographed notebook page turned into nine cards) in place of the planned Wymowa screen, so the B frame shows its own promise.
31. **Margines annotations are measured, not placed by hand**: each marker stroke (rough.js, fixed seed) is drawn in the page after the fonts load, from the box of the UI element it points at, so a new language with longer text gets a bigger circle without layout work. Foundation change for this: `settle` awaits `window.wzReady` when a page defines it; Grań and Szyld re-rendered pixel identical. UI text uses darker shades of the marker colours (`#C2302A`, `#1F7A45`), the bright ones are strokes only.
32. **Chochla variant B** gets its own screen state, "Dziś" (tonight's dinner, everything at home), instead of the Tydzień screen of frame 1, so the A and B frames show different screens and B shows the answer to "co na obiad". All twelve planned headlines are used unchanged.
33. **Chochla bubbles and confetti are laid out in the page**: each speech bubble is drawn around the measured headline after the fonts load and aimed at its character, confetti drops any piece that would touch a bubble, and the render fails if a pattern enters the 16 px margin around a phone or a bubble or character touches it. Frame 6 uses a narration box and frames 2 and 6 comic panels, so the six frames do not repeat one bubble skeleton.
34. **Chochla content**: no prices (the shopping list shows quantities and the dinners that need them); the palette has no green, so Turkus draws the tomato calyx and the courgette; the EN set is a British home kitchen written anew (courgette fritters, lentil chilli, Grandma Rose).
35. **Kruszec exports JPEG** at quality 90 with 4:4:4 chroma: the PNG set (glows, blur, the twelve iPad files) made a 42 MB ZIP; the JPEG ZIP is 8.2 MB and the published folder 9.7 MB.
36. **Kruszec EN is a British saver** written anew (pounds, Stocks and Shares ISA, workplace pension, gilts) instead of IKE and IKZE; no institution, fund or ticker is named in either language. Goals and the safety net are projected from deposits only, the allocation note is arithmetic against the user's own plan, every screen carries "Dane przykładowe" / "Sample data", and the copy check bans gain and return words in both languages.
37. **Kruszec frame 1 line is measured**: the page reads two markers on the in-screen chart after the fonts load and draws the earlier months out to the frame edge in the same scale, so the line joins the screen chart in every language and store. Headlines carry one italic sage accent phrase (`accent` in the copy file); all twelve planned headlines are used unchanged.
38. **Bis chrome words are measured, not set as images**: the headline is real text, and after the fonts load the page draws four SVG layers on each key word (shadow, dark edge under the fill, the chrome gradient), so a new language needs no layout work and the line checks still read the text. The last two words of every Bis headline are joined, so no line ends with one word; all fourteen planned headlines are used as written.
39. **Bis names**: Hala Pogłos (a real Warsaw club is called Pogłos) and Zorza i Psy (the Polish band Zørza exists) were dropped; the clubs are Przelot, Scena Bąbel and Strych Mewa, the artists Mira Szum, Brokat Express, Pola Ołówek, Lisie Radio, Szklane Kolano, Ola Ćma, Tygrys z Kartonu and Neon Babci, all searched on 2026-10-08. The EN set stays in Warsaw with the same names, written anew (8 pm, Sat 17 Oct, kilometres).
40. **Bis variant B and feature graphic**: variant B gets its own screen, the 30 second preview player, instead of repeating the Odkrywaj screen; the feature graphic puts the chrome name left and the promise right and keeps the centre for a sparkle without text, instead of the planned centred name, so the play button never covers the name.
41. **Kruszec tablet dashboards are fuller than the phone screens**: the iPad set shows the whole app in two columns (accounts, allocation, goal, cushion, budget, report around the hero module of each frame) instead of the phone modules alone, because a half empty tablet undersold the larger canvas. Account names wrap on the tablet instead of being cut.
42. **Kruszec allocation tags** sit beside the ring as two line glass tags (name, then current and planned share) instead of pills on the ring, so they never cover the ring or the phone in any store or language.
43. **Bis chrome letters are darker** (a sky band from pale ice to steel, the dark horizon line, then palette pink and peach) with a thicker ink edge, so the chrome words hold at thumbnail size; the icon and the feature graphic keep the brighter chrome.
44. **Bis first three frames without chrome on the key word** (review round 1): the key word of frames 1 to 3 and variant B sits in ink on a holographic sticker, because chrome, light or dark, turns to a blur at 120 px. Chrome stays on frames 4 to 6, the feature graphic name and the icon.
45. **Frame 2 changed in two sets**, Bis (cards above, headline in the middle, phone below) and Kruszec (one large glass budget card and no phone), to break the shared frame 2 skeleton. Margines and Szyld keep their frame 2: Margines' headline cannot become a margin note beside the phone without a one word last line, and Szyld's lifted map needs the top of the frame.
46. **Szyld vertical headline on frame 4** instead of frame 3, so all three search frames read without tilting the head.
47. **Copy changes after review**: Kruszec EN 4 "Keep your portfolio on track"; Kruszec variant B "Budżet i inwestycje obok siebie" / "Spending and investments side by side" (the hypothesis now names this promise); Szyld variant B EN "Kept behind the counter for you"; Bis 2 "Nowi wykonawcy grają tuż obok" / "Bands you've never heard, playing nearby" ("new" is on the banned word list, so the EN line names the benefit without it); Bis PL 4 "Zobacz, którzy znajomi idą".
48. **Grań Play compositions have no terrain in front of the screens**, so every Play screen shows its tab bar; the App Store set keeps the forest in front of frame 2 only.
49. **Kruszec iPad frame 6 shows the iPad alone** (the report on the tablet), without the phone in front.
