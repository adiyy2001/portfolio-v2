# Identyfikacja: plan (phase 1)

Brief: `/home/adrian/root/side_projects/briefs/wzornik-identyfikacja.md`. Run rules: `/home/adrian/root/side_projects/briefs/agent-runs/wzornik-common.md`. Recon, tooling and the parallel build rules: `NOTES.md`. Mode: autonomous, no checkpoint, every decision worth Adrian's review is under "Decisions for Adrian" below. Written on 2026-10-06.

```
- [x] F foundation, with the first brand end to end (B1 Skibka)
- [ ] B2 Nośna
- [ ] B3 Rzut
- [ ] B4 Klamra
- [ ] B5 Cuvée
- [ ] B6 Wolnobieg
- [ ] Q quality control
- [ ] R independent review, every rubric score at least 4
- [ ] P publication and final report
```

Every brand agent writes status and decisions to `studio/identyfikacja/brands/<slug>/STATUS.md`. The merge step ticks the lines above and copies the decisions into this file.

## The six brands

| Order | Brand | Slug | Style (brief id) | Trade and city | Port | Case study URL |
|---|---|---|---|---|---|---|
| B1 | Skibka | `skibka` | organic craft (I3) | sourdough bakery, Kraków | 4310 / 4311 | `/wzornik/identyfikacja/skibka/` |
| B2 | Nośna | `nosna` | generative dynamic identity (I6) | festival of new media art and electronic music, Łódź | 4312 | `/wzornik/identyfikacja/nosna/` |
| B3 | Rzut | `rzut` | Swiss modernism (I1) | architecture studio, Wrocław | 4313 | `/wzornik/identyfikacja/rzut/` |
| B4 | Klamra | `klamra` | neobrutalism (I2) | online programming school | 4314 | `/wzornik/identyfikacja/klamra/` |
| B5 | Cuvée | `cuvee` | luxury editorial (I4) | boutique hotel with a vineyard, Lower Silesia | 4315 | `/wzornik/identyfikacja/cuvee/` |
| B6 | Wolnobieg | `wolnobieg` | retro 1970s (I5) | bicycle service and shop, Gdańsk | 4316 | `/wzornik/identyfikacja/wolnobieg/` |

Why B1 is Skibka: it is the brand that stresses the most links of the chain at once. Its mark is a stamp with irregular edges from noise, its paper texture comes from `feTurbulence` (the hardest thing for PNG export, for PDF print files and for video frames), its display face is a static font with a quirky `a`, and its typical application is a printed paper bag. If the chain handles filters in SVG, PNG, PDF and MP4 for Skibka, the five simpler pipelines of the other brands are covered. Nośna carries the heaviest page code (generator, export), so it starts first among the parallel five and has its own port with the most headroom.

## Distinctness at a glance

| | Ground | Colour family and chroma | Type | Layout principle | Surface and motion | Interactive element |
|---|---|---|---|---|---|---|
| Skibka | flour, off white | muted earth: rye brown, crust, kraft, grey olive (chroma about 0.09) | Young Serif, Karla | one soft column, tilted paper cards, irregular edges | paper grain, ink bleed, a stamp that lands | click to stamp, every imprint a little different |
| Nośna | bone | ink plus one signal colour per festival day (vermilion, teal, magenta) | Syne 800 wide, Martian Mono | programme columns by day, 3 by 4 variant grid | generated lines, no texture | the generator with SVG export |
| Rzut | white | black, white, one cobalt blue, nothing else | Instrument Sans, one family | visible 12 column grid, asymmetry, index numbers in the margin | none, motion only snaps to the grid | grid and module switch, clear space tester |
| Klamra | white | four flat saturated colours: lemon, pink, mint, sky | Epilogue 900, JetBrains Mono | stacked boxes with thick borders, rough frames | hard offset shadows, stickers | draggable stickers on a laptop |
| Cuvée | ivory and warm black | ivory, warm black, one brass | Noto Serif Display light, Source Serif 4 | one narrow column in huge margins, hairlines | stillness, slow reveals | label composer for a cuvée of grape varieties |
| Wolnobieg | cream | saturated 1970s: burnt orange, mustard, brown, avocado (chroma about 0.17) | Rammetto One, Baloo 2 | curved bands, badges, rounded containers | parallel stripes in arcs, light wear | stripe composer |

## Rules shared by the six

- Footer sentence, noindex, `lang="pl"`, skip link, canonical, Open Graph image 1200x630, `theme-color` of the brand: as in `NOTES.md` and as Trzask does.
- Contrast: every text and background pair used anywhere in the system (page, brand book, applications) is computed by script from `brand.json` and is at least 4.5:1 for text below 24 px (or 18.66 px bold) and 3:1 for larger text and for user interface parts. Decorative elements are the only exception and each one is named in the table. The palettes below are starting values: tune lightness, keep hue.
- Logo: SVG without `<text>`, correct `viewBox`, under 10 KB, readable at 16, 24 and 48 px. The sign alone (sygnet) must work as a favicon.
- All fonts were checked on `ąćęłńóśźż ĄĆĘŁŃÓŚŹŻ` at every weight and width used, by `fonts-check.mjs` and `fonts-verify.mjs` (results per brand below, all green).
- Fictional contact data: `.example` e-mails, `+48 xx 000 00 0x` phones, invented street names. No awards, reviews, sales numbers or media logos.
- Application mockups are flat or isometric drawings in code, no photographs: business card 85x55 mm front and back as print PDF 91x61 mm with 3 mm bleed, A4 letterhead, avatar and three social posts 1080x1350, one trade specific application (named per brand), e-mail signature in HTML.
- Logo animation 2 to 4 seconds in SVG with CSS or WAAPI, exported as MP4 and WebM 1080x1080, static logo under `prefers-reduced-motion`.
- Brand book: PDF 16:9, pages 1920x1080 px, 20 to 30 pages, from HTML through Playwright, fonts embedded as pinned instances, and the same content on the case study page.
- Case study page sections (brief): hero, client and task, direction, process with two rejected directions, system, applications, what the client gets (file list with sizes and one ZIP), CTA to `/dla-klienta/` and footer. The skeleton of the six pages must differ; the shared part is the data contract, not the markup.

## B1 Skibka: organic craft, sourdough bakery, Kraków

**Name.** Candidates: Skibka, Kromka, Zakwasownia. Check by web search: `Skibka` no bakery or shop of that name found in Poland (only the surname Skiba in unrelated firms); `Kromka` no bakery found, but it is a generic word that many small shops use; `Zakwasownia` exists (a Gdańsk based sourdough and fermented food maker with shops in several cities), rejected. Also seen and avoided: a Kraków bakery called Zaczyn, Piekarnia Niedziela, Chlebiańska, Świeżo Upieczona. Chosen: **Skibka** (a slice of bread; short, warm, easy to stamp).

**Strategy.**
- Audience: neighbours in Kazimierz and Podgórze who buy bread two or three times a week and want to know what is in it, plus cafés that order loaves in the morning.
- Values: wolno (slow, a loaf takes 36 hours), z mąki i wody (flour, water, salt and nothing else), po sąsiedzku (neighbourly).
- Personality: ciepła, uczciwa, trochę niedoskonała (warm, honest, a little imperfect). Avoids: perfect geometry, shiny tech, neon, anything that looks like a chain.
- Positioning: Skibka piecze chleb na własnym zakwasie w małym piecu na Podgórzu, wolno i bez dodatków, dla ludzi, którzy lubią wiedzieć, co jedzą.

**Palette** (starting values; contrast measured on flour `#F2EDE2`).
- Primary: Żyto (rye, ink) `#3A3128` 10.9:1, Skórka (crust) `#8F5530` 5.1:1.
- Accent: Łan (field green) `#4F5B33` 6.3:1 for text, `#6B7A4A` as a fill; Kraft (paper) `#C9AD83`, dark text on it 5.9:1.
- Neutral scale, 7 steps: `#FAF7F0`, `#F2EDE2` (Mąka, ground), `#E4D7BC`, `#C9AD83`, `#A08B6D`, `#6A5D4D` (5.5:1), `#3A3128`.
- Not used: orange. Chroma stays low so Wolnobieg's saturated orange cannot be confused with it.

**Fonts.** Display Young Serif 400 (static) checked at its only weight. Text Karla variable 200 to 800, used at 400, 500, 700 and italic 400. Polish glyph check: all pass at each used instance. Both OFL. Neither has `→`, so arrows are SVG.

**Keywords:** wolno, zakwas, mąka.

**Logo directions.**
1. Stempel: a round stamp with irregular ink edges, a loaf with three scoring cuts in the middle, ring text SKIBKA · PIEKARNIA NA ZAKWASIE · KRAKÓW converted to paths. The wordmark in Young Serif sits beside it. Recommended: the brief asks for a stamp, and it works as a sygnet, a favicon and a bag print.
2. Skibka as a slice: the sign is a bread slice silhouette with a noise wobbly crust line, the letter S cut out of it.
3. Kłos: three hand cut strokes forming a rye ear above the wordmark.

**Typical application:** a paper bread bag with the stamp, a window label with the day's loaves.
**Animation:** the stamp lands, the ink spreads (displacement from `feTurbulence`), the edge settles.
**Hero:** the stamp pressed on a kraft bag, flour dust, two loaves as flat drawn shapes.
**Interactive element:** click to stamp. Every imprint comes from a seed made from the imprint number, so the rim is a little different each time and a given number always gives the same result.
**Risks:** filters in PDF print files are rasterised by Chromium (set a high resolution, or draw the irregular edge as plain paths and keep `feTurbulence` for screen only); video frames with a heavy filter can render slowly; "organic" can drift into rustic clichés (wheat, checked cloth), so keep the drawing restrained.
**How it differs from the other five.** The only brand with a physical, imperfect surface: grain, bleed and irregular edges come from noise, there is no straight rule or true circle anywhere. Muted earth colours with low chroma and a grey olive, against the saturated oranges of Wolnobieg and the cold neutrals of Rzut and Klamra. A soft single column of tilted paper cards instead of grids, boxes or bands, and a serif with a quirky `a` instead of the high contrast Didone of Cuvée.

## B2 Nośna: generative dynamic identity, festival of new media art and electronic music, Łódź

**Name.** Candidates: Nośna, Interferencje, Faza. Check: `Nośna` no festival or event of that name found (searched with Łódź, new media and electronic music; only the existing (Dis)Connect, Musica Moderna, Musica Electronica Nova and NInA Wersja Beta festivals came up, so those names are avoided); `Interferencje` and `Faza` no festival found but both are common words. Chosen: **Nośna**. It is "fala nośna", the carrier wave: a fixed carrier that gets modulated is exactly the identity system (a constant element plus a generated part).

**Strategy.**
- Audience: 20 to 40 year olds from Łódź, Warsaw and Berlin who go to concerts and exhibitions, plus artists and sound designers applying to the programme.
- Values: sygnał (signal over noise), eksperyment, miasto z włókna (a city of textiles: threads, weaving, factories).
- Personality: precyzyjna, eksperymentalna, otwarta. Avoids: dark neon and cyber (a taken style), club flyers, randomness without rules.
- Positioning: Nośna to trzydniowy festiwal sztuki nowych mediów i muzyki elektronicznej w dawnej fabryce w Łodzi, w którym każdy dzień, scena i tempo ma swój wygenerowany znak.

**System (the core of the case study).** Constant: the wordmark Nośna in Syne 800 and a carrier line with a small ring (the receiver), always in the same position. Generated part: a modulation field around the carrier built from three parameters. Day (Piątek, Sobota, Niedziela) sets the colour and the phase; stage sets the shape family (4 stages named after textile finishing, Przędzalnia, Tkalnia, Farbiarnia, Wykończalnia); tempo (BPM 60 to 180) sets density and frequency. The seed is a hash of day, stage and tempo (a small seeded generator such as `mulberry32` over a string hash), so a variant always renders identically. 3 days x 4 stages = the grid of 12 variants that read as one brand.
Page generator: three controls (day, stage, tempo slider), live SVG, a button "Pobierz SVG" that exports the current mark as a plain SVG with no script, and the seed shown as text. Plain SVG export has no `<text>` (wordmark as paths).

**Palette.** Bone `#E9E6DE` (ground), Atrament `#0E0E12` (ink, 15.4:1). Day colours as fills: Piątek vermilion `#FF3D1F` (ink on it 5.5:1), Sobota teal `#00B3A4` (ink on it 7.3:1), Niedziela magenta `#FF2D95` (ink on it 5.6:1). Colours as text on bone use the darker pair `#B02A0B`, `#00695F`, `#A8005C` (5.3, 5.3, 6.0). Neutral scale, 7 steps from `#0E0E12` to `#F6F4EF`. No dark neon: the ground is light, the colour is flat.

**Fonts.** Syne variable 400 to 800 used at 500, 700 and 800 (a wide display face). Martian Mono variable (weight 100 to 800, width 75 to 112.5) used at 400, 500 and 700 for parameters, times and seeds. Both OFL, Polish glyph check passes at every used instance, both have all typographic glyphs including `→`.

**Keywords:** sygnał, nić, modulacja.

**Logo directions.**
1. Carrier and field (recommended): fixed wordmark with the carrier line and ring, a generated modulation field above it. Works as a system and gives the 12 variants.
2. Cztery nitki: four horizontal threads, one per stage, whose interference makes the generated part.
3. Akcent: the acute on the ś is the variable element, a generated glyph that changes shape; weaker as a system because the field is too small to carry 12 variants.

**Typical application:** a festival pass on a lanyard and the day poster set (a poster per day, 3 sizes).
**Animation:** the carrier is steady while the modulation sweeps through the three days in 3 seconds and settles.
**Hero:** a full width live generated field, the constant wordmark on it, the three controls as part of the page.
**Risks:** the generator must not look random (rules per parameter, document them on the page); the export SVG must stay under 10 KB or have a "lite" mode; mono and wide display together can look like a tech startup, so keep the colour per day strong and the layout like a printed programme.
**How it differs from the other five.** The only logo that is a system: twelve valid marks instead of one. Programme columns by day, colour changes by day, no texture, no image, light ground with flat colour. Wide extra bold grotesk and monospace instead of a serif, and it is not a grid by the rules of Rzut: the lines are generated and curved.

## B3 Rzut: Swiss modernism, architecture studio, Wrocław

**Name.** Candidates: Rzut, Rastr, Rygiel. Check: `Rzut` searched with "pracownia architektoniczna" and Wrocław and with "biuro projektowe Polska", no studio found under that name (results were only floor plans and other studios: PAPS, Studio EL, SRDK, Gowin&Siuta, Kwadrat); `Rastr` and `Rygiel` also found nothing. Chosen: **Rzut** (floor plan, projection; short and technical).

**Strategy.**
- Audience: private investors, developers and municipalities in Lower Silesia who commission houses, offices and public buildings and want a studio that explains its decisions.
- Values: porządek (order), dokładność (precision), czytelność (every drawing explains itself).
- Personality: rzeczowa, spokojna, dokładna. Avoids: ornament, rounded corners, gradients, illustrations, anything decorative.
- Positioning: Rzut to pracownia architektoniczna z Wrocławia, która projektuje domy i budynki publiczne na siatce, w której każdy wymiar ma uzasadnienie.

**Palette.** Black `#0A0A0A`, white `#FFFFFF` (19.8:1), signal cobalt `#1F4BFF` (6.0:1 on white). Grey scale, 7 steps: `#F4F4F2`, `#E6E6E3`, `#BDBDB9`, `#8A8A86` (decorative only, 3.5:1), `#5A5A57` (6.9:1), `#2B2B2A`, `#0A0A0A`. The signal is blue, not the usual Swiss red, on purpose (Rozwaga already owns black, white and red).

**Fonts.** One family: Instrument Sans variable, width 75 to 100, weight 400 to 700, used at 400, 500, 700 at width 100 and at 400, 700 at width 75 (condensed for numbers and captions). Has `tnum` for tabular figures. OFL, Polish check passes at every used instance, all typographic glyphs present.

**Keywords:** siatka, moduł, rzut.

**Logo directions.**
1. Moduł (recommended): a cobalt square, one module of the grid, flush left to the wordmark Rzut, with a tiny coordinate caption (51.1° N) under it; the sign alone is the square with the notch of a doorway.
2. Indeks: the wordmark followed by a bold tabular numeral (Rzut 01) as the project counter.
3. Oś: a thin vertical axis line through the z of the wordmark with a blue point.

**Typical application:** a construction site board (tablica na budowie) with the project name, number, investor, permit data and the studio mark, drawn on the grid.
**Animation:** the grid draws itself in 1 second, the square snaps to its module, the wordmark and the index numbers align one after another.
**Hero:** a Swiss poster: a very large index numeral, the logo on a module, ragged right text, the 12 column grid visible as thin lines.
**Interactive element:** grid tester: switch the grid on and off, change the module (4, 8, 12 columns), see the logo lockups snap, and a clear space and minimum size tester with sizes in px and mm.
**Risks:** a pure grid layout can look like a template, so the asymmetry needs real decisions (text columns of unequal width, hanging numbers); only one colour, so the contrast table is short and exact; avoid ornament even in the brand book.
**How it differs from the other five.** The only strictly geometric, grid driven brand. No texture, no illustration, no shadow, no rounded corner; ragged right text flush left; one cobalt on black and white; one type family at several widths. Where Nośna's lines are generated and curved, Rzut's are straight and fixed, and where Cuvée spreads in margins, Rzut fills the modules.

## B4 Klamra: neobrutalism, online programming school

**Name.** Candidates: Klamra, Pętla, Nawias. Check: searched each with "szkoła programowania" and online courses; no school or bootcamp with these names found in Poland (Kodilla, Coders Lab, Giganci Programowania, Codecool, Kodland, Klub Młodego Programisty came up instead). Chosen: **Klamra** (the curly brace `{ }`, also a clasp that holds things together).

**Strategy.**
- Audience: adults who want to switch to programming, and school leavers who prefer working with a mentor online to studying for years.
- Values: robisz, nie oglądasz (you build, you do not watch), małe grupy (small groups), uczciwa cena (clear price).
- Personality: bezpośrednia, żywa, trochę szalona. Avoids: luxury, pastel softness, soft shadows, startup gloss.
- Positioning: Klamra to szkoła programowania online, w której w małej grupie, w cztery miesiące i na prawdziwym projekcie przechodzisz od zera do pierwszej pracy w kodzie.

**Palette.** Ink `#111111`, white `#FFFFFF` (18.9:1), lemon `#FFE14A` (ink on it 14.5:1), pink `#FF5FA8` (6.7:1), mint `#3DDC97` (10.7:1), sky `#5CC8FF` (10.0:1). Neutral scale, 6 steps: `#FFFFFF`, `#F2F2F2`, `#D9D9D9`, `#8F8F8F`, `#4A4A4A` (8.9:1), `#111111`. White text only on ink. Flat fills, no tints.

**Fonts.** Display Epilogue variable 100 to 900 used at 700, 800, 900. Mono and labels JetBrains Mono variable 100 to 800 used at 400, 700, 800. OFL, Polish check passes at every used instance, `→` present in both.

**Keywords:** klamra, commit, surowo.

**Logo directions.**
1. Klamra { } (recommended): two thick braces in ink with a hard offset shadow and the wordmark Klamra in Epilogue 900; a die cut sticker version with a white border for the app and laptops.
2. K klamra: a K whose arms are made of the brace shape.
3. Terminal: the wordmark with a blinking block cursor and a brace; weaker as a favicon.

**Typical application:** a sheet of laptop stickers and the course completion certificate.
**Animation:** the braces slam in with the hard shadow offset, the wordmark types in letter by letter, a cursor blinks twice.
**Hero:** a raw browser window frame with thick borders and a hard shadow, stickers stuck across its edge, a headline in Epilogue 900.
**Interactive element:** a laptop lid with draggable stickers (pointer events, keyboard accessible with arrow keys), a button "Wymieszaj" that scatters them.
**Risks:** brutalism can tip into noise; keep one grid of boxes and a fixed set of 4 colours; every colour block needs ink text; stickers must not hide text; focus rings must be thick and visible.
**How it differs from the other five.** Loud and flat: thick ink outlines, hard offset shadows without blur, four saturated flat colours on white, labels and stickers as ornaments, rough frames. Everything else is quieter: Skibka is soft and tactile, Rzut is thin and controlled, Cuvée is hushed, Wolnobieg is warm and curved, Nośna is light and generative. Typographically a heavy grotesk with a monospace, where Rzut uses one light family.

## B5 Cuvée: luxury editorial, boutique hotel with a vineyard, Lower Silesia

**Name.** Candidates: Cuvée, Vendange, Grona. Check: `Cuvée` and `Vendange` searched with "hotel winnica Dolny Śląsk" and "hotel butikowy Polska": no hotel of that name found (only Hotel Niemcza Wino & Spa, Winnica Anna and Folwark Stara Winiarnia in the region; "cuvée" appears only in names of wines); `Grona` collides with Gronie Ski & Bike in Szczyrk. Chosen: **Cuvée** (a blend of wines, from the vineyard to the room).

**Strategy.**
- Audience: couples and small groups of 30 to 55 year olds from Wrocław, Berlin and Prague who book a weekend for quiet, wine and food and read the hotel like a magazine.
- Values: spokój (calm), ziemia (land and vineyard), czas (the harvest sets the rhythm).
- Personality: powściągliwa, elegancka, cicha. Avoids: loud colours, icons as decoration, rounded corners, effects, discounts.
- Positioning: Cuvée to dwanaście pokoi i cztery hektary winnicy pod Ślężą, hotel dla gości, którzy wolą ciszę i dobre wino od atrakcji.

**Palette.** Warm black `#15110E`, ivory `#F3ECDD` (16.0:1), one brass accent `#B08D57` (on warm black 6.1:1; on ivory only 2.6:1, so for text on ivory use the dark brass `#7A5A2A`, 5.4:1) and a champagne tint `#D7BE8D` on warm black (10.4:1). Neutral scale, 7 steps: `#FAF6EC`, `#F3ECDD`, `#E5DCC8`, `#C9BFA8`, `#8C8472` (decorative only), `#4A443A` (8.2:1), `#15110E`. The metallic accent is only a colour, no gradient and no foil effect.

**Fonts.** Display Noto Serif Display variable (weight 100 to 900, width 62.5 to 100) used at 200, 300, 400, 500, regular and italic 300 and 400, with `smcp` and `c2sc` for letter spaced small caps. Text Source Serif 4 variable (optical size 8 to 60) used at 400 and 600, italic 400. OFL, Polish check passes at every used instance. `→` missing in Noto Serif Display, so arrows are SVG; Source Serif 4 has it.

**Keywords:** cisza, winnica, kontrast.

**Logo directions.**
1. Wersalik (recommended): CUVÉE in letter spaced Didone capitals with the accent kept, a hairline rule, and HOTEL · WINNICA in small caps under it; the sign alone is a monogram C in a thin ring.
2. Kursywa: lowercase italic cuvée with a brass dot.
3. Jedna linia: a single hairline that draws a leaf and a cluster; against the "no icons" rule, so rejected as the main direction.

**Typical application:** a wine label for the house cuvée and a door hanger ("Nie przeszkadzać" and the breakfast card).
**Animation:** hairlines draw in, letter spacing relaxes from wide to final, fade only, 3 seconds.
**Hero:** a dark cover like a magazine front page: the wordmark in ivory on warm black, one hairline, a lot of empty space.
**Interactive element:** a label composer: pick two or three grape varieties grown in the region (Solaris, Johanniter, Regent, Pinot Noir, Riesling), set the vintage, and the label updates its text and proportion line; no price, no cart.
**Risks:** icons are listed under "avoid" by the brief but the brief also asks for 12 icons, so they are drawn as fine wayfinding pictograms (hairline stroke, square caps, used only in the brand book and on the room card, never as decoration); metallic accents tend to turn into gold gradients, so keep it flat; huge margins and thin hairlines fail on small screens unless the 390 px version is designed on its own.
**How it differs from the other five.** The only dark first brand, with the least on the page: ivory and warm black, one brass, huge margins, hairlines, a high contrast serif in light weights and letter spaced small caps. Where Skibka is serif and tactile, Cuvée is serif and untouched; where Rzut fills a grid, Cuvée leaves it empty; its motion is the slowest and has no bounce at all.

## B6 Wolnobieg: retro 1970s, bicycle service and shop, Gdańsk

**Name.** Candidates: Wolnobieg, Szprycha, Korba. Check: searched with "serwis rowerowy" and Gdańsk, and Poland wide with "rowery serwis sklep"; no bicycle shop or service found under `Wolnobieg`, `Szprycha` or `Korba` (results were Decathlon, Centrum Rowerowe, House of Bikes and others). Note: *wolnobieg* is also the Polish word for a freewheel, a common bicycle part, not a brand. Chosen: **Wolnobieg** (freewheel: you stop pedalling and keep rolling; the slogan writes itself).

**Strategy.**
- Audience: people in Gdańsk who ride to work and for pleasure, from students to families, who want a bike fixed on the same day, and buyers of used and city bikes.
- Values: naprawiamy, nie wymieniamy (we repair, we do not replace), jedź wolno (ride slowly), po sąsiedzku.
- Personality: ciepła, wesoła, solidna. Avoids: cold blues, minimalism, photorealism, sports aggression.
- Positioning: Wolnobieg to serwis i sklep rowerowy w Gdańsku, w którym naprawiamy rowery miejskie na miejscu, a sprzedajemy te, które sami chcielibyśmy jeździć.

**Palette** (starting values; measured on cream `#F6E8C8`). Cream `#F6E8C8`, brown `#5B2F14` (9.3:1) and darker `#3F2411` (11.8:1), burnt orange `#E4681B` (fill; dark brown text on it 4.3:1, cream text on `#8F3E0C` 6.0:1; as text on cream use `#B4500F`, 4.2:1, large text only), mustard `#E9A81D` (dark brown text on it 6.9:1), avocado `#7C8A2B` (fill only, 3.1:1). Tan neutral scale, 7 steps: `#FBF3DF`, `#F6E8C8`, `#EAD7AE`, `#CDB27F`, `#9A7447`, `#6B4528`, `#3F2411`. Saturation is high (chroma 0.17) so it differs from Skibka's muted earth.

**Fonts.** Display Rammetto One 400 (static, one weight). Text Baloo 2 variable 400 to 800 used at 400, 600, 800. OFL, Polish check passes at every used instance. `→` missing in Rammetto One, so arrows are SVG; Baloo 2 has it.

**Keywords:** wolno, pasy, korba.

**Logo directions.**
1. Pasy i koło (recommended): the wordmark in Rammetto One set on a slight slope, three parallel stripes in orange, mustard and brown running in an arc under it; the sign alone is a round badge of concentric stripes that reads as a wheel or a freewheel cog.
2. Odznaka: a round badge with ring text WOLNOBIEG · SERWIS I SKLEP · GDAŃSK converted to paths.
3. Wstęga: a ribbon w made only of stripes.

**Typical application:** a shop sign over the workshop door and a service tag (przywieszka serwisowa) tied to the handlebar.
**Animation:** the stripes sweep in along their arcs and the wordmark rolls in like a wheel, 3 seconds.
**Hero:** cream ground with big stripes sweeping across the page in arcs, a round badge, a bicycle wheel drawn only from circles and spokes.
**Interactive element:** a stripe composer: number of stripes (2 to 5), colour of each from the palette, curvature and a light wear switch; it draws the arcs live and copies the SVG.
**Risks:** the wear texture (speckle from `feTurbulence`) is a filter and has the same print problem as Skibka, so it is optional and light; rounded fat type loses detail at 16 px, so the sign must be the badge and not the wordmark; orange on cream needs care with contrast.
**How it differs from the other five.** Warm, saturated and rounded: parallel stripes in arcs, badges, a fat rounded display face, cream paper with slight wear. Compare Skibka (muted, organic, irregular edges, no stripes) and Klamra (also loud, but in flat blocks with outlines and hard shadows, not curved and soft). The motion is a sweep along arcs.

## Phase 2 scope (foundation, built on Skibka)

The foundation agent builds the chain on Skibka first and proves each link, then writes the file conventions into `NOTES.md`.

1. Shared parts: `sites/src/identyfikacja/shared/` (types for `brand.ts` and the manifest, manifest reader, head and footer parts built on `SampleNote`, download list helper) and the index `sites/src/pages/identyfikacja/index.astro` (six tiles found by `import.meta.glob`, each tile drawn by the brand's own `Tile.astro`, with a short framing text about what an identity delivers and a CTA to `/dla-klienta/`). `.prettierignore` gets `public/identyfikacja`.
2. Scripts in `studio/identyfikacja/scripts/` and `lib/`: text to path (`fontkit`, kerning, manual kerning pairs, features), font subsetting with pinned instances, SVG optimise and check (no `<text>`, `viewBox`, under 10 KB), PNG export 512, 1024, 2048 with alpha, favicon (SVG, ICO with 16, 32, 48 as PNG, `apple-touch-icon` 180), colour tables (HEX, RGB, OKLCH, approximate CMYK marked as approximate, no Pantone), contrast table by script from `brand.json`, PDF from HTML (brand book, business card with bleed, letterhead) with the embedded fonts check, logo animation capture (WAAPI frames through Playwright, `ffmpeg` to MP4 H.264 and WebM VP9, 1080x1080, under 1.5 MB), ZIP, manifest, validation of everything (`validate.mjs --brand <slug>`), page screenshots at 390 and 1440 px with console errors collected, the distinctness board, the dash and comment guard.
3. Skibka end to end: all eleven deliverables of the brief, the case study page, validation, screenshots at 390 and 1440 viewed by the agent, then one commit.

## Quality gates (from the brief, repeated for the agents)

Visual review (full page screenshots at 390 and 1440 px, open every PNG, list defects, fix, repeat). Logo at 16, 24, 48 and 512 px. SVG: no `<text>`, valid `viewBox`, under 10 KB. PDF: `pdffonts` lists embedded fonts, page sizes right, three random pages rendered and looked at; business card 91x61 mm with bleed. Contrast: every pair at least AA. Distinctness: the six heroes and the six brand book pages on one board; if two look like one template in other colours, rebuild the weaker. Independent reviewer gets only screenshots, files and the rubric: fidelity to the style (recognisable without a signature), craft (type, kerning, spacing, detail), system coherence, fit to trade and audience, legibility and accessibility, sales value of the page, distinctness from the other five. Each scored 1 to 5, everything below 4 is fixed and scored again, at most two rounds.

## Directory structure and URLs

The tree and the ownership rules are in `NOTES.md`, section "Parallel build". URLs:

- `/wzornik/identyfikacja/` index of the six
- `/wzornik/identyfikacja/<slug>/` case study page of a brand
- `/wzornik/identyfikacja/<slug>/<file>` published files (`favicon.svg`, `og.png`, `logo/`, `fonts/`, `social/`, `mockups/`, `print/`, `animation/`, `brandbook.pdf`, `<slug>-identyfikacja.zip`, `manifest.json`)
- links from `#wzornik` on `/dla-klienta/` and `#swatch-book` on `/en/for-clients/` (the case studies are in Polish, the English page says so, like Trzask) and one link from the `/wzornik/` index, added in the publication step only.

## Decisions for Adrian

Taken without asking, in the autonomous mode. Brand agents add their own to `STATUS.md`; the merge step copies them here.

1. **Names.** Skibka, Nośna, Rzut, Klamra, Cuvée, Wolnobieg. The check is a real web search for each name together with its trade and city, plus a Poland wide query; no firm of the same name in the same trade turned up. The search tool is US based and thin for small Polish firms, so this is evidence of absence, not a legal clearance. Rejected for a real conflict: Zakwasownia (an existing sourdough maker) and a bakery named Zaczyn in Kraków, and Grona (Gronie Ski & Bike). Wolnobieg is also a common bicycle part name.
2. **URLs under `/wzornik/identyfikacja/`**, not next to the nine sample websites, so no brand name can collide with a site slug or with a name in the other two briefs.
3. **B1 is Skibka**, the brand that exercises the most links of the chain (see above).
4. **Cobalt instead of Swiss red for Rzut**, because Rozwaga already has black, white and red.
5. **Nośna has a light ground**, because dark neon and cyber is a taken style. Colour comes only from the three festival days.
6. **Fonts (all OFL, all pass the Polish glyph check at every weight used):** Young Serif and Karla; Syne and Martian Mono; Instrument Sans; Epilogue and JetBrains Mono; Noto Serif Display and Source Serif 4; Rammetto One and Baloo 2. None is used by the nine existing sample websites (Bodoni Moda, Bricolage Grotesque, Outfit, Newsreader, Unbounded, Gloock, Big Shoulders, Chivo, Archivo, Besley).
7. **PDF fonts are pinned instances**, not variable fonts, so `pdffonts` shows embedded TrueType and not Type 3.
8. **Arrows are always SVG**, because four of the chosen fonts have no `→`.
9. **Cuvée gets 12 fine wayfinding pictograms** although the brief says to avoid icons for this style: the brief also demands 12 icons for every brand, so they are as quiet as possible and never decorative.
10. **Animations are WAAPI plus frame capture with `ffmpeg`**, not Remotion, so no licence question arises.
11. **Size budget:** about 12 MB published per brand, 16 MB hard cap, so the extension stays well under 300 MB with the other two briefs.
12. **Case studies are Polish only** and `noindex`, like Trzask. The English client page links to them and says they are in Polish.
13. **Publishing:** the six case studies are linked from `#wzornik` as one block "Identyfikacja wizualna" and from the `/wzornik/` index, in the publication step only. The run stops after the local merge into `rebrand-2026`; nothing is pushed because a push deploys the public site.
14. **Files carry the slug**: `logo/skibka-primary.svg`, not `logo/primary.svg`, so a download from any brand is recognisable outside its folder. The brand book is `<slug>-brandbook.pdf` and the package `<slug>-identyfikacja.zip`.
15. **Logo lockups.** `primary` is the stamp with the name below, `symbol` the stamp alone, `horizontal` and `vertical` the two arrangements of symbol and wordmark, `mono-black` the one colour print version, `negative` the version for dark grounds.
16. **Skibka ring text is Karla 700**, not Young Serif: the serif outlines on a small ring were too heavy and ran together; the wordmark still uses Young Serif. The B to K spacing in the ring is slightly wide and was left.
17. **Skibka is 15.3 MB published** (budget 12 MB, cap 16 MB). The ZIP is 6.0 MB of it. Social and og PNGs go through `lib/png.mjs` (`quantizePng`, 128 colours, ffmpeg palette), mockups are JPEG at quality 80, and the brand book is flat vector (3.3 MB) after a grain overlay made it 36 MB. The other brands should aim for 12 MB or less.
18. **Print PDFs are flat**: no filters or blend modes, texture on screen files only.
19. **Studio tests**: `yarn --cwd studio test` runs `node --test` on the libs (8 tests); the page logic is tested by vitest in `sites/`.
