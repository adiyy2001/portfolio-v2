# App preview: plan (phase 1)

Brief: `/home/adrian/root/side_projects/briefs/wzornik-app-preview.md`. Run rules: `/home/adrian/root/side_projects/briefs/agent-runs/wzornik-common.md` and `wzornik-run2.md` (base branch `main`, yarn mutex, root `yarn.lock` frozen). Recon, specs, license and tool findings: `NOTES.md`. Mode: autonomous, no checkpoint; every decision worth Adrian's review is under "Decisions for Adrian" at the end. Written on 2026-10-07.

```
- [x] F foundation, with the first brand end to end (B1 Kasownik)
- [ ] B2 Sztanga
- [ ] B3 Rygiel
- [ ] B4 Kiełek
- [ ] B5 Poziomka
- [ ] B6 Południe
- [ ] Q quality control
- [ ] R independent review, every rubric score at least 4
- [ ] P publication and final report
```

Every app agent writes status and decisions to `studio/app-preview/apps/<slug>/STATUS.md`, never to this file. The merge step ticks the lines above and copies the decisions into "Decisions for Adrian".

## The six apps

| Order | App      | Slug       | Style (brief id)                 | Category                            | Store cut        | Port        | Case study URL                   |
| ----- | -------- | ---------- | -------------------------------- | ----------------------------------- | ---------------- | ----------- | -------------------------------- |
| B1    | Kasownik | `kasownik` | native iOS, light and clean (A1) | city transit tickets, Poznań        | 23 s, 690 frames | 4320 / 4321 | `/wzornik/app-preview/kasownik/` |
| B2    | Sztanga  | `sztanga`  | kinetic typography (A2)          | strength training log               | 22 s, 660 frames | 4322        | `/wzornik/app-preview/sztanga/`  |
| B3    | Rygiel   | `rygiel`   | dark neon and cyber (A3)         | password manager with breach alerts | 24 s, 720 frames | 4323        | `/wzornik/app-preview/rygiel/`   |
| B4    | Kiełek   | `kielek`   | pastel claymorphism (A4)         | houseplant care                     | 21 s, 630 frames | 4324        | `/wzornik/app-preview/kielek/`   |
| B5    | Poziomka | `poziomka` | 8-bit pixel art (A5)             | gamified habit tracker              | 20 s, 600 frames | 4325        | `/wzornik/app-preview/poziomka/` |
| B6    | Południe | `poludnie` | isometric data dashboard (A6)    | home solar, battery and power use   | 25 s, 750 frames | 4326        | `/wzornik/app-preview/poludnie/` |

Index: `/wzornik/app-preview/`. Ports 4327 to 4329: distinctness board, publication, final verification.

Why B1 is Kasownik: it carries the parts every other app reuses and the strictest polish bar. It needs a mini design system (tokens, type scale, list rows, cards, sheets, tab bar), spring physics, a shared element transition across two screens, store overlays, the launch screen ending, the loop bridge, the phone frame and camera moves in three formats, and a page with the curve lab. If the chain renders Kasownik pixel clean in all formats and passes validation, the five others only add their own look. The two outliers keep their special parts inside their own folders: the bitmap font and integer scaling (Poziomka), and the variable width axis animation (Sztanga). The foundation's font loader must already accept variable axes (`wdth`) and static files, so neither needs a shared change.

## Distinctness at a glance

|          | Ground                 | Colour                                             | Type                                               | Motion signature                                           | Rhythm and structure                                             | Marketing frame and camera                                                      | Curve lab on the page                        |
| -------- | ---------------------- | -------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------- |
| Kasownik | white                  | one tram green on white and light greys            | Onest 400 to 800                                   | damped springs, sheets, shared element card to full screen | calm, continuous; one gesture leads into the next                | clean light grey frame, slow dolly in, the ticket breaks out of the screen once | spring versus iOS ease, a sheet rising       |
| Sztanga  | pure black             | white plus one signal orange                       | Anybody 900 with the width axis animated 50 to 150 | slams, hard cuts, width stretch, inversions                | 120 BPM grid, a cut every 15 frames, no crossfades               | black frame cut in and out on beats, zoom punches                               | slam versus linear against a metronome       |
| Rygiel   | blue black with a grid | neon cyan, alert pink red, amber on black          | Azeret Mono, Oxanium                               | scramble decrypt, scan sweeps, glow pulse                  | tense, top to bottom sweeps, alert first                         | outlined neon frame, slow push through grid planes                              | scramble speed and glow pulse curves         |
| Kiełek   | warm peach             | warm pastels: pistachio, butter, blush, terracotta | M PLUS Rounded 1c 500 to 900                       | bouncy springs with overshoot, squash and stretch, puffs   | playful, beats land on bounces                                   | chunky clay phone, floating clay props, layered parallax                        | bouncy versus stiff spring on a falling drop |
| Poziomka | sky blue pixel world   | 16 colour custom palette                           | Jersey 10 and Tiny5 as bitmap fonts                | stepped frames at 7.5 fps, whole pixel moves, no easing    | game loop: quest, reward, level up                               | pixel art phone frame, camera pans in whole pixels                              | smooth versus `steps()` on a sprite          |
| Południe | cool light grey        | amber sun, green battery, blue home, slate grid    | Archivo, normal and condensed                      | path draw on, count ups, flowing dashes                    | one fact per shot, measured camera moves between isometric parts | the isometric house grows out of the phone, pans along the 30° axes             | path draw ease in out versus linear          |

Against the six identity brands in `sites/src/pages/identyfikacja/`: no serif anywhere (Skibka, Cuvée), no Syne or generated lines (Nośna), no visible Swiss grid or cobalt (Rzut), no thick borders, hard offset shadows or stickers (Klamra), no 1970s stripes or cream (Wolnobieg). Against the ASO styles: no glass or blur (Rygiel stays opaque), no tilted devices with gradients (all phone frames stay upright and flat), no memphis patterns or doodles. None looks like Trzask (no green black with lime).

## Rules shared by the six

- Interface: 5 to 7 screens per app as React components in Remotion, with a mini design system in `tokens.ts` (colour, type scale, spacing, radii, shadows, motion presets). Design canvas 443x960 CSS px, rendered at scale 2 to 886x1920. Poziomka's art pixel is 2 canvas px (4 output px), see its section.
- Status bar: generic, drawn by us (time from the story, e.g. "7:48", never "9:41"; generic signal, wifi and battery glyphs). No notch shapes or islands copied from Apple; the marketing phone frame has a small round punch hole camera and generic side buttons.
- Store cut, 886x1920, 30 fps, H.264 High@4.0, `yuv420p` limited range, BT.709, about 11.5 Mbps CBR, `.mp4`, silent stereo AAC 256 kbps 48 kHz track. Interface only, full screen, no frame, no hands. Overlays: at most 6 words, each on screen for at least 45 frames, at most 4 per cut, kept out of the top 120 px and the bottom 160 px. It ends on the app's own launch screen (icon and name). Poster frame named per app (App Store Connect default is 5 s; the plan names the frame to choose).
- Marketing cut: one Remotion composition per app with a `format` prop (`9x16` 1080x1920, `1x1` 1080x1080, `16x9` 1920x1080) set through `calculateMetadata`, each layout written per format, not scaled. Own phone frame, brand typography and background, camera moves. 9:16 keeps text clear of the platform UI: nothing important in the top 220 px, the bottom 380 px or the right 140 px.
- Web versions: WebM (VP9) and MP4 (H.264, `+faststart`, no audio), each at most 4 MB, seamless loop, JPG poster. On the page `autoplay muted loop playsinline`; under `prefers-reduced-motion: reduce` only the poster (no `autoplay`, no source loading). Loops are rendered from the same composition with `loop: true`, which appends a 10 to 20 frame bridge back to the state of frame 0; the store master has no bridge. Validation compares the first and last frame.
- Storyboard: shots with frame ranges in `storyboard.ts` (one source for the render, the overlay checks, the key frame board PNG and the page table). Hook in the first 1 to 2 s and a first frame that sells, 2 to 3 key features, end on icon and name, 20 to 25 s.
- Motion: no linear easing in interface motion (the only linear things are continuous flows such as Południe's dashes and Rygiel's grid drift, named as such). Never everything at once: stagger and hierarchy. Text stays on screen long enough to read (rule of thumb: 0.3 s per word plus 0.7 s, at least 1.5 s for overlays).
- Icon: 1024x1024 PNG, RGB without alpha, square without rounded corners (stores mask it), drawn in SVG by code; a rounded 512 preview for the page.
- Content: Polish, concrete, invented but plausible data, consistent across screens (times, sums, percentages add up). No real brands, operators, banks, services or people. Domains, where they appear, end in `.example`.
- Fonts: OFL only, local files. In Remotion through `FontFace` with `delayRender` and `continueRender` (or `@remotion/fonts` `loadFont` with local `staticFile`), never `@remotion/google-fonts`. On the page as woff2 subsets with the OFL text next to them.
- Contrast: every text pair at least 4.5:1 below 24 px (3:1 large text and UI parts). Glow and decoration never carry text. Palettes below are starting values checked with `culori`; tune lightness, keep hue.
- Pages: every page follows the brief's nine sections in that order (hero loop, client and task, direction, storyboard, motion rules with the live curve lab, screens gallery, store cut next to the social formats, what the client gets, CTA and footer) and looks like its app. No horizontal scroll at 320, 390, 768, 1024 and 1440 px; no one word last lines in headings; nothing overlaps.

## B1 Kasownik: native iOS light, city transit tickets

**Name.** Candidates: Kasownik, Przesiadka, Ważny. Web search on 2026-10-07: no app called Kasownik (the word is the validator device; the ticket apps found were moBilet, mPay, SkyCash, zBiletem, Jakdojade, GoPay, iKO); no app called Przesiadka (only articles on transfer tickets); no app called Ważny. Chosen: **Kasownik**, because the hero moment is validation (kasowanie) and the noun is instantly understood. The searches are no-match results, not a legal clearance.

**Concept.** Problem: at a stop you have seconds to pick the right ticket, pay and validate before the doors close, and later prove to an inspector that the ticket is valid. User: Poznań commuters and visitors, 18 to 60, phone in one hand. Key features: (1) the suggested ticket for the trip you are on, bought in two taps; (2) validation that makes the ticket "alive" (moving band, animated code, ticking clock), so a screenshot cannot pass as a ticket; (3) the transfer view with the time left on the ticket. City Poznań with real stop names (Rondo Kaponiera, Most Teatralny, Fredry, Rynek Jeżycki, Ogrody, Górczyn, Rondo Śródka, Baraniaka); routes and prices invented, no operator named. Tickets (zone A, invented): 15 min 3,00 zł, 45 min 4,60 zł, 90 min 6,40 zł, 24 h 15,00 zł, ulgowe 50%.

**Icon.** White ticket shape with a punched round hole and a short check, on the brand green, flat.

**Palette.**

| Role                                           | HEX                           |
| ---------------------------------------------- | ----------------------------- |
| brand (tram green), buttons, live band         | `#00864F` (4.64:1 on white)   |
| brand deep (pressed, small text on tint)       | `#006B3F`                     |
| brand tint (selected rows, live ticket ground) | `#E3F4EC`                     |
| ink                                            | `#101418`                     |
| secondary text                                 | `#5B6470` (5.44:1 on grouped) |
| tertiary, placeholders (large only)            | `#8A929C`                     |
| separator                                      | `#E4E7EB`                     |
| grouped background                             | `#F2F4F6`                     |
| surface                                        | `#FFFFFF`                     |

One brand colour, nothing else saturated. No gradients except the sheet scrim (black at 0 to 30%).

**Type.** Onest (OFL, `onest/Onest[wght].ttf`), instances 400, 500, 600, 700, 800, all with every Polish glyph and `„”’…·×→°€` (fonts-verify, 2026-10-07). Large title 34/41 800, title 22/28 700, body 17/22 400, callout 16/21 500, caption 13/18 500, ticket clock 56 tabular (`tnum`) 700.

**Screens.**

1. Bilety (home): large title collapsing on scroll, city chip "Poznań, strefa A", card "Proponowany na teraz: 45 min, 4,60 zł", list of ticket types, tab bar (Bilety, Moje, Trasa, Konto).
2. Zakup (bottom sheet): normalny or ulgowy segmented control, quantity stepper, card "•••• 4417", button "Zapłać 4,60 zł" morphing into a check.
3. Moje bilety: stacked cards, the new one on top with "Gotowy do skasowania".
4. Kasowanie: hold to validate, a ring filling for 1 s, "Przytrzymaj, aby skasować".
5. Bilet ważny (live): band sliding in brand green, animated 2D code (a real QR of a dummy string), "Ważny do 8:33:10" counting, "Strefa A, normalny, 45 min".
6. Trasa: line 16 then 5, transfer at Rondo Kaponiera, pill "Zdążysz: zostało 27 min biletu", timeline rows.
7. Kontrola: code enlarged, screen brightened, clock large.
   Plus the launch screen (icon and name) for the ending.

**Motion presets.**

| Name    | Use                                              | Value                                                                                            |
| ------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `push`  | navigation push and pop                          | spring mass 1, stiffness 300, damping 32 (no visible overshoot), about 380 ms                    |
| `sheet` | bottom sheets                                    | spring mass 1, stiffness 260, damping 28; scrim `cubic-bezier(0.32, 0.72, 0, 1)` 400 ms          |
| `hero`  | card to full screen live ticket (shared element) | spring mass 1, stiffness 220, damping 26, slight overshoot under 2%                              |
| `press` | button and row press                             | scale 0.97, `cubic-bezier(0.25, 0.1, 0.25, 1)` 120 ms in, spring back                            |
| `fade`  | text and secondary content                       | `cubic-bezier(0.25, 0.1, 0.25, 1)` 250 ms, stagger 40 ms per row                                 |
| `live`  | band slide and code shimmer on the live ticket   | band 2.4 s per cycle, code wave from the centre over 20 frames, `cubic-bezier(0.45, 0, 0.55, 1)` |

**Storyboard, store cut (23 s, 690 frames).**

| Shot         | Frames     | Seconds      | What happens                                                                                                    | Overlay                                                |
| ------------ | ---------- | ------------ | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| 1 hook       | 0 to 59    | 0.0 to 2.0   | Already live ticket full screen, band sliding, clock ticking 8:33:10, code shimmer passes once                  | "Skasowany bilet. Widać, że ważny." (5 words, 6 to 59) |
| 2 home       | 60 to 134  | 2.0 to 4.5   | Home appears; scroll collapses the large title; the suggested card is highlighted                               | none                                                   |
| 3 buy        | 135 to 224 | 4.5 to 7.5   | Tap the card, sheet rises (`sheet`), pay, button turns into a check, sheet leaves                               | "Dwa stuknięcia, bez kolejki" (4, 140 to 200)          |
| 4 my tickets | 225 to 314 | 7.5 to 10.5  | New card lands on the stack, hold to validate, ring fills for 30 frames                                         | none                                                   |
| 5 alive      | 315 to 419 | 10.5 to 14.0 | Shared element: card grows into the live ticket, code comes alive in a wave, band starts, clock begins at 45:00 | "Kasujesz przy wejściu" (3, 330 to 390)                |
| 6 transfer   | 420 to 539 | 14.0 to 18.0 | Trasa sheet, line 16 then 5, rows stagger, pill counts down                                                     | "Przesiadka? Zostało 27 minut" (4, 430 to 490)         |
| 7 inspector  | 540 to 614 | 18.0 to 20.5 | "Pokaż kontrolerowi", code enlarges, brightness bloom                                                           | none                                                   |
| 8 end        | 615 to 689 | 20.5 to 23.0 | Launch screen: icon scales in on `hero`, name below                                                             | none                                                   |

Poster frame: 12.0 s (frame 360, the live ticket with the full code). The 5 s default frame (the sheet with "Zapłać 4,60 zł") must also read well. Loop bridge (web only): the icon on the launch screen grows into the green band of frame 0.

**Marketing cut.** Light grey stage `#F2F4F6`, upright phone frame in light grey aluminium tone, no tilt. Large Onest 800 headlines next to the phone carry the same three beats ("Kup w dwa stuknięcia.", "Skasuj przy wejściu.", "Zdąż na przesiadkę."). Camera: slow dolly in (scale 1 to 1.06 over each beat) and a lateral glide between beats. Signature: at validation the ticket card leaves the phone and fills the frame for 1.5 s, then returns. 16:9 phone on the right third, text left; 1:1 phone large and cropped at the bottom, text on top; 9:16 text on top, phone below. Tile loop: 5 s of the alive moment.

**Page.** White iOS grouped lists, large title header, details opening in sheets, hero loop in a rounded card. Curve lab: one card rising as a sheet with the `sheet` spring next to the same card on `cubic-bezier(0.25, 0.1, 0.25, 1)`; slider for damping.

**Different from the other five.** Kasownik is the only quiet one: white space, one colour, no decoration, and motion that imitates physical objects (springs with almost no overshoot, a card that becomes a screen). Sztanga cuts hard on a beat and Poziomka steps without easing; Kasownik never cuts inside the interface, every change is continuous. Rygiel and Sztanga live on black, Kiełek on warm pastel, Poziomka in a pixel sky, Południe in grey isometric volumes; Kasownik is flat white cards and sheets. It is the only one whose signature move is a shared element transition.

## B2 Sztanga: kinetic typography, strength training log

**Name.** Candidates: Sztanga, Seria, Podejście. Web search on 2026-10-07: no app called Sztanga (the gym apps found were Gymlify, GymBook, Gravitus, Strive, Hevy, StrongLifts, GymRun, JEFIT), no app called Seria, no app called Podejście. Chosen: **Sztanga** (barbell; a word that looks heavy in type and owns the category better than the generic "Seria").

**Concept.** Problem: between heavy sets you cannot read small text, do plate maths or remember last week's numbers. User: intermediate lifters on a percentage based program, three or four sessions a week. Key features: (1) today's plan with the plates per side worked out; (2) a rest timer you can read from the bench; (3) automatic records with an estimated one rep max (Epley). Data (invented, consistent): week 3 of 4, day B. Przysiad 3×5 at 140 kg (85%), per side 25 + 25 + 10 on a 20 kg bar. Wyciskanie leżąc 5×5 at 92,5 kg, per side 25 + 10 + 1,25. Wiosłowanie sztangą 4×8 at 70 kg. Rest 3:00. Record: Martwy ciąg 185 kg × 2, szacowane 1RM 197 kg (185 × (1 + 2/30) = 197,3).

**Icon.** Black square, a barbell drawn as two tall orange plates and a white bar, flat, heavy.

**Palette.**

| Role                                         | HEX                                                  |
| -------------------------------------------- | ---------------------------------------------------- |
| ground                                       | `#000000`                                            |
| raised surface                               | `#141414`                                            |
| divider                                      | `#2A2A2A`                                            |
| secondary text                               | `#8C8C8C` (6.25:1 on black)                          |
| primary text                                 | `#FFFFFF`                                            |
| signal (the one electric colour), inversions | `#FF5A00` (6.71:1 on black; black on it also 6.71:1) |

Nothing else. Inversions swap black and orange for single beats.

**Type.** Anybody (OFL, `anybody/Anybody[wdth,wght].ttf`), instances wght 900 at wdth 50, 100 and 150, wght 700 at wdth 75, wght 600 and 500 at wdth 100: every Polish glyph present at every instance; `→` missing, arrows are drawn in SVG. Numbers use `tnum`. Hero numbers 300 to 520 px on the 443 canvas scale, set tight (line height 0.82), width axis animated.

**Screens.**

1. Seria (active set): giant "140", "KG", "SERIA 3/5", "PRZYSIAD", button "Zaliczona".
2. Plan dnia: three lifts as huge stacked lines with sets × reps and load.
3. Talerze: plates per side as orange and white blocks with numbers.
4. Przerwa: giant countdown "3:00", next set preview.
5. Rekord: "REKORD", "MARTWY CIĄG", "185 × 2", "1RM ≈ 197 KG".
6. Historia: last 8 weeks of the squat as a bar of numbers rising.
   Plus launch screen.

**Motion presets.**

| Name      | Use                              | Value                                                                            |
| --------- | -------------------------------- | -------------------------------------------------------------------------------- |
| `beat`    | grid for every cut and entry     | 15 frames (120 BPM at 30 fps); every shot starts on a multiple of 15             |
| `slam`    | words and numbers entering       | 8 frames, `cubic-bezier(0.9, 0, 0.1, 1)`, from 140% scale and 0 to full, no fade |
| `stretch` | width axis                       | wdth 50 to 150 over 12 frames, `cubic-bezier(0.16, 1, 0.3, 1)`, on the beat      |
| `punch`   | camera zoom on beats (marketing) | scale 1 to 1.12 in 4 frames, back in 10, `cubic-bezier(0.2, 0.9, 0.1, 1)`        |
| `invert`  | colour inversion on accents      | hard cut for exactly 15 frames                                                   |
| `count`   | timer digits                     | each digit cuts, no tween; time lapse runs 0.1 s per frame                       |

**Storyboard, store cut (22 s, 660 frames, 44 beats).**

| Shot         | Frames     | Seconds      | What happens                                                                                                      | Overlay                                         |
| ------------ | ---------- | ------------ | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| 1 hook       | 0 to 59    | 0.0 to 2.0   | Active set: "140" fills the screen at frame 0, stretches on beats 2 and 3, "KG" and "SERIA 3/5" slam in on beat 4 | "Liczby, które widać z ławki" (5, 6 to 59)      |
| 2 plan       | 60 to 179  | 2.0 to 6.0   | Plan: one lift per beat pair, then plates per side build block by block                                           | none                                            |
| 3 set done   | 180 to 299 | 6.0 to 10.0  | "Zaliczona": 3/5 cuts to 4/5, rest timer "3:00" appears, digits cut each second                                   | "Przerwa liczona za ciebie" (4, 190 to 250)     |
| 4 time lapse | 300 to 419 | 10.0 to 14.0 | Timer runs fast to 0:00, "SERIA 5/5" in orange on the beat                                                        | none                                            |
| 5 record     | 420 to 569 | 14.0 to 19.0 | Deadlift set saved, screen inverts to orange, "REKORD" stacks letter by letter on beats, "1RM ≈ 197 KG"           | "Nowy rekord? Sztanga zauważy." (4, 450 to 510) |
| 6 end        | 570 to 659 | 19.0 to 22.0 | Launch screen: "SZTANGA" squeezes from wdth 150 to 100, icon cuts in on the last beat                             | none                                            |

Poster frame: 15.0 s (frame 450, orange "REKORD"). The 5 s frame (plates per side) also reads. Loop bridge: the icon's orange plate cuts to the "140" of frame 0 on the beat.

**Marketing cut.** Black stage. Giant words outside the phone own the frame ("CIĘŻAR", "SERIE", "PRZERWA", "REKORD"), the phone frame (matte black, orange side button) cuts in and out on beats, never slides. Camera `punch` on every fourth beat. 16:9: words run across the full width, phone small at the right; 1:1: one word per beat filling the square; 9:16: words stacked, phone in the lower half. Tile loop: 4 s (8 beats) of "140" stretching.

**Page.** Black, huge Anybody headings with the width axis tied to the viewport width (not to scroll position), orange used once per screen height. Curve lab: a metronome at 120 BPM with two bars entering, one on `slam`, one on linear, so the visitor sees why the slam lands on the beat.

**Different from the other five.** Sztanga is the only one built on a musical grid: every change is a cut on a 15 frame beat, there is no crossfade and no spring wobble. Type is the image; the interface itself is typographic, so the store cut still looks like the brand. Kasownik moves continuously and calmly, Kiełek bounces, Poziomka steps at 7.5 fps, Rygiel sweeps and scrambles, Południe draws and counts; Sztanga slams and stretches. Colour: pure black with one orange, unlike Rygiel's blue black with neon, and the width axis animation appears nowhere else.

## B3 Rygiel: dark neon and cyber, password manager with breach alerts

**Name.** Candidates: Rygiel, Klucznik, Szyfr. Web search on 2026-10-07: no password manager called Rygiel, Klucznik or Szyfr (the market results were NordPass, Proton Pass, Bitwarden, 1Password, Dashlane, Keeper, LastPass, KeePass, Kaspersky Password Manager). Chosen: **Rygiel** (door bolt: short, physical, says "locked" without saying "password").

**Concept.** Problem: people reuse passwords and learn about a breach months later from the news. User: careful but busy adults with 150 to 250 logins. Key features: (1) breach alerts within hours, with what leaked and what to do; (2) a generator that replaces the leaked password in one flow; (3) vault health with a score and the list of weak and reused passwords. Data (invented): vault of 214 entries; alert "Twój adres e-mail pojawił się w wycieku z Forum Wędkarskie Mazury", leak dated 2 października 2026, detected 6 października 2026 at 07:12, leaked: e-mail, nick, password hash. New password "k7#Vq2!rTz9pL$w4Hn8e", 20 characters, about 131 bits. Health 68/100 (9 weak, 4 reused, 1 in a breach) rising to 96/100.

**Icon.** Black square, a door bolt drawn with a 2 px cyan line and a soft outer glow, the bolt slid shut.

**Palette.**

| Role                             | HEX                         |
| -------------------------------- | --------------------------- |
| void (ground)                    | `#05070B`                   |
| panel                            | `#0A1018`                   |
| grid lines                       | `#12303A`                   |
| outline dim                      | `#1D4A57`                   |
| neon cyan (safe, focus, primary) | `#2CF6FF` (15.1:1 on void)  |
| text                             | `#D9FBFF` (18.4:1)          |
| muted text                       | `#7FA6B0` (7.26:1 on panel) |
| alert (breach)                   | `#FF3D71` (5.9:1 on void)   |
| warning (weak, reused)           | `#FFB547` (10.9:1 on panel) |

Glow is a blurred copy of an outline in the same hue at 35 to 60% opacity, never behind body text. No purple, no gradients across hues, no glass or blur on panels.

**Type.** Azeret Mono (OFL, `azeretmono/AzeretMono[wght].ttf`) 400, 500, 700 for everything in the interface, all Polish glyphs and `„”’…·×→°€` present. Oxanium (OFL, `oxanium/Oxanium[wght].ttf`) 600 and 800 for the wordmark and big numbers, all Polish glyphs present, `→` missing (arrows in SVG).

**Screens.**

1. Alert wycieku: red pink framed card with the service, the dates, what leaked, button "Zmień hasło teraz".
2. Szczegóły wycieku: timeline (leak, detection, your action), affected entry.
3. Generator: length slider 20, character classes, password scrambling into place, strength segments.
4. Sejf (locked then unlocked): list of entries decrypting top down, search field.
5. Zdrowie sejfu: ring score, counts of weak, reused and breached, list to fix.
6. Wpis: one entry with username, password masked then revealed by scramble, last change date.
   Plus launch screen.

**Motion presets.**

| Name       | Use                          | Value                                                                                                                                                                    |
| ---------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `scramble` | revealing text               | each character cycles random glyphs from its class for 6 to 10 frames, then settles; left to right, 2 frame offset per character; final text readable for at least 1.5 s |
| `scan`     | unlock and alert sweeps      | a 2 px cyan line with glow travelling top to bottom in 30 frames, `cubic-bezier(0.65, 0, 0.35, 1)`; content below the line is revealed with a clip                       |
| `pulse`    | alert ring and focus glow    | opacity 0.35 to 0.6, 36 frame period, sine                                                                                                                               |
| `draw`     | outlines and the bolt        | stroke dash draw in 18 frames, `cubic-bezier(0.33, 1, 0.68, 1)`                                                                                                          |
| `step`     | list rows                    | 3 frame stagger, rows enter by `scramble`, never by slide                                                                                                                |
| `drift`    | background grid (continuous) | 1 px per 4 frames, constant, the one linear motion                                                                                                                       |

**Storyboard, store cut (24 s, 720 frames).**

| Shot           | Frames     | Seconds      | What happens                                                                                                  | Overlay                                       |
| -------------- | ---------- | ------------ | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| 1 hook         | 0 to 59    | 0.0 to 2.0   | Alert card readable at frame 0, a `scan` passes over it, the alert ring pulses                                | "Wiesz o wycieku pierwszy" (4, 6 to 59)       |
| 2 details      | 60 to 179  | 2.0 to 6.0   | Details: timeline draws, "wykryty 6.10.2026, 07:12", what leaked highlighted                                  | none                                          |
| 3 new password | 180 to 329 | 6.0 to 11.0  | "Zmień hasło teraz", generator: the 20 characters scramble into place, segments fill, "ok. 131 bitów"         | "Nowe hasło w trzy sekundy" (5, 190 to 260)   |
| 4 vault        | 330 to 479 | 11.0 to 16.0 | Lock screen, unlock, `scan` reveals the vault, rows decrypt top down, the forum entry marked "zmienione dziś" | none                                          |
| 5 health       | 480 to 629 | 16.0 to 21.0 | Health ring counts 68 to 96, issues strike through one by one                                                 | "Sejf zdrowy w jeden wieczór" (5, 500 to 570) |
| 6 end          | 630 to 719 | 21.0 to 24.0 | Launch screen: the bolt draws and slides shut, "RYGIEL" scrambles into place                                  | none                                          |

Poster frame: 1.0 s (frame 30, the alert after the scan). The 5 s frame (details) also reads. Loop bridge: the bolt's glow line becomes the scan line that reveals frame 0.

**Marketing cut.** Void stage with two layers of grid planes drifting at different speeds (flat layers, no 3D tilt of the phone). Phone frame drawn as a cyan outline with a dim inner bezel, no body fill. Mono headlines scramble in beside the phone ("Wyciek wykryty.", "Hasło zmienione.", "Sejf zdrowy."). Camera: slow push through the grid layers with parallax. 16:9 phone centre right with a log column on the left; 1:1 phone centred, headline top; 9:16 headline top, phone lower. Tile loop: 5 s of the alert scan and the password scramble.

**Page.** Dark grid page, neon outlines on cards, mono everywhere, alert colour only for the breach story. The scramble runs once when a heading enters the viewport and never on body text; under reduced motion text is static. Curve lab: the scramble speed (frames per character) and the glow pulse plotted live, with two presets side by side ("czytelny" and "za szybki").

**Different from the other five.** Rygiel is the only dark interface with light as material: outlines glow, text decrypts, a scan line reveals content. Its motion is top to bottom and character by character; nothing bounces (Kiełek), nothing slams to a beat (Sztanga), nothing steps on a pixel grid (Poziomka). Sztanga is also dark, but pure black with one flat orange and giant type; Rygiel is blue black with a grid, thin neon lines, mono text and two signal colours. It is opaque and flat, never glass, which keeps it away from the ASO dark glass style.

## B4 Kiełek: pastel claymorphism, houseplant care

**Name.** Candidates: Kiełek, Podlewka, Doniczka. Web search on 2026-10-07: no plant app called Kiełek (found: Plantis, Kronen, Zielone Pogotowie, Plant Parent); no app called Podlewka; Doniczka is used by a smart planter product (Veritable Doniczka Connect), rejected. Chosen: **Kiełek** (sprout; it is also the mascot's name).

**Concept.** Problem: plants die from too much water more often than from too little, and care depends on the species, the window and the season. User: city flat owners with 5 to 20 plants, first plants or a growing jungle. Key features: (1) a watering plan per plant that adapts to the season; (2) leaf diagnosis by symptom; (3) rooms with light and humidity, so each plant stands in the right place. Data (invented, plausible): Monstera "Zdzisia" 400 ml every 7 days in summer, every 12 in winter; Calathea 250 ml every 5 days, standing water, likes 60% humidity; Epipremnum 300 ml every 7 days; Sansewieria 150 ml every 3 weeks; Zamiokulkas every 2 to 3 weeks. Rooms: Salon (west window), Sypialnia (north window, humidity 41%), Kuchnia (east). Diagnosis: yellow lower leaves plus wet soil means overwatering: "Odstaw konewkę na 10 dni i sprawdź otwory w doniczce."

**Icon.** Peach square, a clay pot with the sprout mascot (two round leaves, two dot eyes), soft shading.

**Palette.**

| Role                                     | HEX                         |
| ---------------------------------------- | --------------------------- |
| ground (peach)                           | `#FFE6D6`                   |
| card                                     | `#FFF5EE`                   |
| pistachio (healthy, leaves)              | `#BFE29A`                   |
| leaf deep (mascot leaves, small accents) | `#7DBE5A`                   |
| butter (today, highlights)               | `#FFE07A`                   |
| blush (needs attention)                  | `#FFC2CC`                   |
| terracotta (pots)                        | `#E8896B`                   |
| water (drops, warm leaning aqua)         | `#AEE3D3`                   |
| ink (plum brown)                         | `#4A2C2A` (10.4:1 on peach) |
| ink soft                                 | `#7A5650` (5.97:1 on card)  |

Clay look from layered CSS shadows: a light inner highlight top left (white at 70%), an inner shade bottom right (ink at 12%), an outer soft shadow (ink at 18%, 24 px blur, offset 8 px). No sharp corners (radius 20 px and up), no cool greys.

**Type.** M PLUS Rounded 1c (OFL, `mplusrounded1c/`), static Medium (500), ExtraBold (800) and Black (900), every Polish glyph and `„”’…·×→°€` present. The family folder in google/fonts has no `OFL.txt`; take it from the upstream repo `coz-m/MPLUS_FONTS` (OFL.txt) when publishing. Subset hard (the TTF is 3.5 MB per weight because of Japanese).

**Screens.**

1. Dziś: mascot greeting, "Dziś podlej 3 rośliny", clay cards with amounts and a "Podlane" button.
2. Roślina: Monstera Zdzisia with a watering ring, next date, light and humidity needs.
3. Kalendarz: week of clay pills, drops on days, season note "Zimą rzadziej".
4. Diagnoza: symptom chips ("Żółte dolne liście", "Brązowe końcówki", "Opadające liście"), answer card.
5. Pokoje: rooms as clay tiles with light and humidity values.
6. Dodaj roślinę: species search with clay results.
   Plus launch screen.

**Motion presets.**

| Name      | Use                          | Value                                                                        |
| --------- | ---------------------------- | ---------------------------------------------------------------------------- |
| `bounce`  | cards, buttons, mascot entry | spring mass 1, stiffness 180, damping 12 (clear overshoot, about 12%)        |
| `squash`  | landings                     | scaleY 0.88 and scaleX 1.1 for 4 frames on contact, back on `bounce`         |
| `puff`    | chips and checks appearing   | scale 0 to 1 on spring stiffness 260, damping 14, with a 6 frame shadow grow |
| `drop`    | water drops                  | fall with `cubic-bezier(0.55, 0, 1, 0.45)` 14 frames, then `squash`          |
| `wiggle`  | leaves idle                  | rotate ±4° on spring loops every 50 frames                                   |
| `stagger` | lists                        | 5 frames between items, each on `bounce`                                     |

**Storyboard, store cut (21 s, 630 frames).**

| Shot        | Frames     | Seconds      | What happens                                                                                                                        | Overlay                                        |
| ----------- | ---------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| 1 hook      | 0 to 59    | 0.0 to 2.0   | Mascot already in its pot at frame 0, hops with `squash`, blinks; today card "Dziś podlej 3 rośliny" puffs in                       | "Rośliny podlane na czas" (4, 6 to 59)         |
| 2 today     | 60 to 209  | 2.0 to 7.0   | Three cards bounce in; tap "Podlane" on Monstera: a clay drop falls, squashes, the card turns pistachio with a check; mascot cheers | none                                           |
| 3 calendar  | 210 to 329 | 7.0 to 11.0  | Week pills, drops land on days with `stagger`, note "Zimą: co 12 dni"                                                               | "Plan dopasowany do pory roku" (5, 220 to 290) |
| 4 diagnosis | 330 to 479 | 11.0 to 16.0 | Tap "Żółte dolne liście", answer card inflates, mascot looks worried, then nods                                                     | "Podpowie, co dolega liściom" (4, 345 to 410)  |
| 5 rooms     | 480 to 569 | 16.0 to 19.0 | Rooms tiles, Sypialnia 41% wilgotności, Calathea flagged "lubi 60%"                                                                 | none                                           |
| 6 end       | 570 to 629 | 19.0 to 21.0 | Launch screen: the icon inflates with `bounce`, "Kiełek" below                                                                      | none                                           |

Poster frame: 1.0 s (frame 30, mascot mid hop with the today card). The 5 s frame (green check on Monstera) also reads. Loop bridge: the icon's sprout hops out and lands in the pot of frame 0.

**Marketing cut.** Peach stage with floating clay props (pots, drops, two leaves) on layered parallax planes. The phone frame is a chunky clay phone (thick rounded body in blush with the same shadow stack). The mascot climbs out of the screen onto the frame edge at the watering moment. Camera: gentle drift and a slow 2D orbit illusion through layer offsets. 16:9 phone left of centre with props around and headline right; 1:1 phone centre with the mascot on top; 9:16 headline top, phone below. Tile loop: 5 s of the drop falling and the mascot cheering.

**Page.** Peach page with clay cards, rounded type, the mascot in the hero. Curve lab: a clay drop falling on two springs (`bounce` and a stiff no overshoot spring) side by side, with damping and stiffness sliders and the squash shown.

**Different from the other five.** Kiełek is the only soft and three dimensional looking one: inflated shapes with layered shadows, warm pastels and a character. Its motion overshoots and squashes on purpose, where Kasownik's springs barely overshoot and Sztanga, Rygiel and Poziomka do not overshoot at all. It is the only warm light palette (Kasownik white, Południe cool grey, Poziomka saturated pixel sky) and the only one with a mascot that acts.

## B5 Poziomka: 8-bit pixel art, gamified habit tracker

**Name.** Candidates: Poziomka, Passa, Codzień. Web search on 2026-10-07: no habit app called Poziomka, Passa or Codzień (found: Loop Habit Tracker, Habitica, Habitify, Streaks, Daylio, Habitly). Chosen: **Poziomka** (wild strawberry, and "poziom" means level: the pun is the game).

**Concept.** Problem: habit trackers become a chore after two weeks. User: people 16 to 35 who grew up with games and want small daily wins. Key features: (1) daily habits as quests with XP; (2) levels and a streak (passa) that grows a pixel strawberry garden; (3) a weekly summary as a pixel bar chart. Data (invented): habits "Szklanka wody po przebudzeniu" +10 XP, "20 minut spaceru" +30 XP, "15 stron książki" +20 XP, "Telefon odłożony o 22:30" +40 XP. Level 7, 1 160 / 1 200 XP, level 8 after the walk. Passa 21 dni. Garden stages: nasionko, listek, sadzonka, kwiat, owoc. Unlock "Miedziana konewka".

**Icon.** 32×32 art pixel strawberry on sky blue, scaled ×32 to 1024 with nearest neighbour.

**Palette (16 colours, custom).**

| #   | HEX       | Role                 |
| --- | --------- | -------------------- |
| 0   | `#140C1C` | ink, outlines, text  |
| 1   | `#3B2440` | plum, panels on dark |
| 2   | `#6B3E5E` | dusk                 |
| 3   | `#A23B4E` | berry deep           |
| 4   | `#E0474F` | strawberry           |
| 5   | `#FF8F8F` | berry light          |
| 6   | `#F7C873` | gold, XP coins       |
| 7   | `#FFF3C4` | cream, panels        |
| 8   | `#2D5A3A` | forest               |
| 9   | `#4FA34A` | leaf                 |
| 10  | `#A6DE5C` | sprout               |
| 11  | `#2B4C8C` | blue deep            |
| 12  | `#4F8FE0` | sky mid              |
| 13  | `#9ED8FF` | sky light, ground    |
| 14  | `#8A7F86` | stone                |
| 15  | `#FFFFFF` | white                |

Ink on cream 17.2:1, ink on sky light 12.5:1. No gradients: shading by dithering patterns only.

**Grid.** Art pixel = 2 canvas px = 4 output px. The store canvas is 221 art columns by 480 art rows (884x1920); 886 is 2 × 443, so no chunky integer grid fills it exactly, and the 2 spare px (1 each side) are filled with colour 0. Marketing formats divide cleanly at 4 px (270×480, 270×270, 480×270 art pixels). Every position, size and move is a whole art pixel; layers are rendered on a canvas at art resolution and scaled by an integer with `image-rendering: pixelated` (or drawn as `<rect>` with `shape-rendering: crispEdges`). Validation samples frames and checks that every 4×4 block is one colour from the palette (tolerance only for the codec, judged on the lossless master).

**Type.** Jersey 10 (OFL, `jersey10/Jersey10-Regular.ttf`, true pixel grid of 75 units, no curves) for headings and big numbers, and Tiny5 (OFL, `tiny5/Tiny5-Regular.ttf`, 8 px em, 128 unit grid, no curves) for labels and body. Both have every Polish glyph; Tiny5 also has `„”’…·×→°€`, Jersey 10 lacks `→`. Rejected after the glyph check: Silkscreen and DotGothic16 (no Polish), Press Start 2P (Polish `ą` and `ę` badly drawn in 8×8, and a cliché), Micro 5 (`ż` unreadable), Pixelify Sans and VT323 (not on a pixel grid). Both chosen fonts are converted to bitmap atlases by sampling their outlines on the pixel grid (one bitmap per glyph at its native size) and drawn as pixels, so text is never antialiased in the video. Derivative bitmap fonts are allowed by the OFL; neither has a Reserved Font Name; ship them as "Poziomka Pixel" and "Poziomka Mini" with the OFL texts. Any glyph that looks wrong at native size is fixed by hand in the atlas.

**Screens.**

1. Poziom w górę: "POZIOM 8!", XP bar full, strawberry jumping.
2. Zadania na dziś: four quests with checkboxes, XP values, coins popping.
3. Passa: calendar of 21 days as pixel tiles with strawberries.
4. Ogródek: the garden with the plant at its stage and unlocked items.
5. Tydzień: pixel bar chart of 7 days and a best streak.
6. Nowy nawyk: picker with pixel icons and an XP slider.
   Plus launch screen.

**Motion presets.** No easing curves: holds and steps.

| Name    | Use                    | Value                                                                                                  |
| ------- | ---------------------- | ------------------------------------------------------------------------------------------------------ |
| `tick`  | sprite animation rate  | a new pose every 4 frames (7.5 fps)                                                                    |
| `walk`  | strawberry jump cycle  | 4 poses × 4 frames, rise and fall in whole art pixels (0, 3, 5, 3)                                     |
| `pop`   | coins and +XP          | 3 poses, then the number rises 1 art pixel per 2 frames for 16 frames and disappears in 2 dither steps |
| `fill`  | XP bar                 | 1 art pixel per frame, no tween                                                                        |
| `blink` | selection and level up | on 6 frames, off 6 frames, 3 times                                                                     |
| `wipe`  | screen changes         | a 16 art pixel tall checker wipe in 8 steps of 2 frames                                                |

**Storyboard, store cut (20 s, 600 frames).**

| Shot     | Frames     | Seconds      | What happens                                                                                          | Overlay (bitmap text)                          |
| -------- | ---------- | ------------ | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| 1 hook   | 0 to 59    | 0.0 to 2.0   | "POZIOM 8!" banner already up at frame 0, strawberry jumping on `walk`, XP bar blinking full          | "Nawyki, za które rośnie poziom" (5, 6 to 59)  |
| 2 quests | 60 to 209  | 2.0 to 7.0   | `wipe` to quests: check "Szklanka wody" +10 XP, "20 minut spaceru" +30 XP, coins `pop`, XP bar `fill` | none                                           |
| 3 streak | 210 to 329 | 7.0 to 11.0  | Passa: 21 tiles flip one by one every 4 frames, "PASSA: 21 DNI"                                       | "Passa 21 dni i rośnie" (5, 220 to 290)        |
| 4 garden | 330 to 479 | 11.0 to 16.0 | Garden: the plant goes from kwiat to owoc in 3 poses, "Miedziana konewka" unlock box opens            | "Ogródek rośnie z każdą passą" (5, 345 to 410) |
| 5 week   | 480 to 539 | 16.0 to 18.0 | Week chart bars grow 1 art pixel per frame                                                            | none                                           |
| 6 end    | 540 to 599 | 18.0 to 20.0 | Launch screen: pixel icon, "POZIOMKA" types in letter per `tick`                                      | none                                           |

Poster frame: 1.0 s (frame 30, the level up banner). The 5 s frame (quests with a coin popping) also reads. Loop bridge: the launch screen's strawberry jumps into the banner of frame 0 through one `wipe`.

**Marketing cut.** A pixel world: sky gradient replaced by three dithered bands of sky colours, clouds moving 1 art pixel per 8 frames, a grass strip with the garden. The phone frame is pixel art too (chunky, 2 art pixel outline, generic punch hole). Camera pans in whole art pixels across the garden and up to the phone. 16:9 phone right, garden left; 1:1 phone centre over the grass; 9:16 sky with the headline in pixel type on top, phone below. Tile loop: 4 s of the jump and the coins.

**Page.** Sky blue page, pixel panels with 2 px outlines, headings in the bitmap fonts at integer sizes (Tiny5 at 16, 24, 32 px; Jersey 10 at multiples of its grid), body text in Tiny5 at 16 px or larger, real text for accessibility. Curve lab: the same strawberry jump on a smooth `ease-in-out` and on `steps()` with 7.5 fps side by side, showing why the stepped one reads as a game.

**Different from the other five.** Poziomka is the only one with no easing at all: everything moves in steps on a 7.5 fps tick and in whole pixels, with no antialiasing anywhere. It is the only one with a fixed 16 colour palette and dithering instead of shading, and the only game loop structure (quest, reward, level). Kiełek also has a character, but soft and smooth; Poziomka's strawberry is a 4 pose sprite.

## B6 Południe: isometric data dashboard, home solar with battery

**Name.** Candidates: Południe, Promyk, Bilans. Web search on 2026-10-07: no solar or energy app called Południe, Promyk or Bilans (found: Foton Home, Solis Home, Fronius Solar.web, Zeversolar, KOSTAL Solar App, EasySolar). Chosen: **Południe** (noon, when the roof produces most, and south, where the panels face).

**Concept.** Problem: owners of a solar roof with a battery see raw inverter numbers and still run the washing machine at night. User: families in a detached house with 6 to 10 kWp and net billing. Key features: (1) the energy flow right now (roof, battery, house, grid); (2) the day profile of production and use; (3) a tip when to run heavy appliances, with the month balance in złoty. Data (invented, consistent, prices labelled "przykładowe"): house near Opole, 8,2 kWp (20 × 410 W), hybrid inverter 8 kW, battery 10,2 kWh. 14 maja 2026, sunny: production 47,8 kWh, peak 6,4 kW at 13:10; use 15,6 kWh. Production split: 6,8 kWh straight into the house, 8,4 kWh into the battery, 32,6 kWh to the grid (6,8 + 8,4 + 32,6 = 47,8). Use split: 6,8 from the roof, 7,6 from the battery, 1,2 from the grid (= 15,6). Self sufficiency (15,6 − 1,2) / 15,6 = 92%. Battery 34% at 9:00, 100% at 13:40, 22% at 6:00 next day. Prices: buy 1,08 zł/kWh with distribution, sell (net billing) 0,24 zł/kWh average in May. Day value: 14,4 kWh not bought × 1,08 = 15,55 zł plus 32,6 × 0,24 = 7,82 zł, together 23,37 zł. Tip: "Pralka: 12:30 do 14:00, nadwyżka 4,1 kW".

**Icon.** Light square with an isometric cube whose top face holds an amber sun disc and whose right face shows panel cells.

**Palette.**

| Role             | HEX                                                                                                                              |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| ground           | `#EEF2F6`                                                                                                                        |
| top faces, cards | `#FFFFFF`                                                                                                                        |
| left faces       | `#DCE3EB`                                                                                                                        |
| right faces      | `#C3CEDA`                                                                                                                        |
| ink              | `#15202B`                                                                                                                        |
| secondary text   | `#4E5D6C` (6.0:1 on ground)                                                                                                      |
| sun (production) | `#F2A100` for fills and strokes only (2.1:1 on white, always next to a labelled value), text variant `#965E00` (5.39:1 on white) |
| battery          | `#2E9F5B`, text variant `#1F7A43` (5.35:1 on white)                                                                              |
| home (use)       | `#3A6FD8` (4.72:1 on white)                                                                                                      |
| grid             | `#6B7C8F` for lines, `#5F6F82` for text (5.14:1 on white)                                                                        |
| panels           | `#2A3F5A`                                                                                                                        |

One data colour per shot leads; the others sit at 40% until their shot.

**Type.** Archivo (OFL, `archivo/Archivo[wdth,wght].ttf`), instances 400, 500 and 700 at wdth 100, 600 at 87.5 and 800 at 75 (condensed numbers), every Polish glyph and `„”’…·×→°€` present. Numbers with `tnum` and `lnum`.

**Screens.**

1. Teraz: isometric house with the four flows and one big number.
2. Magazyn: battery level, charge rate, time to full.
3. Dzień: production and use curves with the surplus area.
4. Kiedy włączyć: appliance tips with time windows.
5. Miesiąc: kWh from the roof, self sufficiency, value in złoty.
6. Instalacja: system data (8,2 kWp, 20 panels, inverter, battery).
   Plus launch screen.

**Motion presets.**

| Name    | Use                                        | Value                                                                                                                           |
| ------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `flow`  | dashes along the energy paths (continuous) | dash 8, gap 10, speed proportional to power (1 kW = 1 px per frame), constant: the one linear motion, because it encodes a rate |
| `draw`  | chart lines and paths                      | `pathLength` 0 to 1 over 40 frames, `cubic-bezier(0.65, 0, 0.35, 1)`                                                            |
| `count` | numbers                                    | 30 frames, `cubic-bezier(0.22, 1, 0.36, 1)`, final value held at least 45 frames                                                |
| `rise`  | isometric blocks and cards                 | translate along the iso vertical 12 px with spring stiffness 200, damping 24                                                    |
| `track` | camera between parts of the scene          | 24 frames along the iso axes (30°), `cubic-bezier(0.45, 0, 0.55, 1)`                                                            |
| `focus` | one fact per shot                          | the leading colour at 100%, the rest fades to 40% over 12 frames                                                                |

**Storyboard, store cut (25 s, 750 frames).**

| Shot      | Frames     | Seconds      | What happens                                                                                    | Overlay                                         |
| --------- | ---------- | ------------ | ----------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| 1 hook    | 0 to 74    | 0.0 to 2.5   | House at frame 0 with flows running, "6,4 kW z dachu" big, sun flow highlighted                 | "Słońce z dachu, prąd w domu" (6, 6 to 74)      |
| 2 battery | 75 to 224  | 2.5 to 7.5   | `track` to the battery, it fills 34% to 80%, "Magazyn 8,2 z 10,2 kWh"                           | none                                            |
| 3 day     | 225 to 374 | 7.5 to 12.5  | Day chart: production bell `draw`, use line `draw`, surplus area fills, "Szczyt 6,4 kW o 13:10" | "Cały dzień na jednym wykresie" (5, 240 to 310) |
| 4 tip     | 375 to 524 | 12.5 to 17.5 | "Kiedy włączyć": washing machine card `rise`, window 12:30 to 14:00 marked on the curve         | "Pralka wtedy, gdy świeci" (4, 390 to 460)      |
| 5 balance | 525 to 674 | 17.5 to 22.5 | "Samowystarczalność dziś 92%" ring `count`, then "23,37 zł" for the day (ceny przykładowe)      | none                                            |
| 6 end     | 675 to 749 | 22.5 to 25.0 | Launch screen: the icon cube rises, sun disc fills, "Południe"                                  | none                                            |

Poster frame: 1.5 s (frame 45, the house with flows and the big number). The 5 s frame (battery filling) also reads. Loop bridge: the icon's cube becomes the house roof of frame 0.

**Marketing cut.** Ground stage with the isometric house large outside the phone; the energy paths run from the roof into the phone screen, where the same numbers appear. Upright phone frame in white with a grey band. Camera `track` moves along the isometric axes, one part of the house per shot. 16:9 house left, phone right; 1:1 house big with the phone inset bottom right; 9:16 house top, phone bottom. Tile loop: 5 s of the flows and the battery filling.

**Page.** Cool grey page, white isometric cards, small charts drawing in on view, numbers in condensed Archivo. Curve lab: a path drawn with `draw` next to the same path drawn linearly, and a counter with `count` against a linear counter.

**Different from the other five.** Południe is the only data story: one fact per shot, numbers that add up, charts that draw themselves and an isometric world the camera travels through. Its motion is measured and informative (draw on, count up, flow speed tied to power), never playful like Kiełek or Poziomka and never percussive like Sztanga. It is the only isometric and the only multi colour data palette, on cool grey, which keeps it apart from Kasownik's flat white.

## Folder layout and URLs

Everything an app owns is under its slug, so five app branches merge without conflicts.

```
studio/app-preview/NOTES.md, PLAN.md                       SHARED
studio/app-preview/package.json, yarn.lock, tsconfig.json  SHARED  own package (Remotion 4.0.534 exact, React 19, TypeScript); not studio/package.json
studio/app-preview/remotion.config.ts                      SHARED  browser executable (Playwright headless shell 1243), concurrency 4, public dir
studio/app-preview/src/index.ts, src/Root.tsx              SHARED  registers every app's compositions from src/apps/*/index.ts
studio/app-preview/src/shared/                             SHARED  formats, PhoneFrame, StatusBar, HomeIndicator, Overlay (word and duration rules),
                                                                    fonts loader (static and variable axes), storyboard types and Sequence helpers,
                                                                    beat grid, loop bridge, motion preset types (bezier, spring, steps)
studio/app-preview/src/apps/<slug>/                        app     index.ts (compositions), tokens.ts, content.ts, storyboard.ts, screens/, components/,
                                                                    Store.tsx, Marketing.tsx, Tile.tsx, Icon.tsx, LaunchScreen.tsx
studio/app-preview/scripts/, lib/                          SHARED  fonts.mjs, fonts-verify.mjs, render.mjs, encode.mjs, sheets.mjs, validate.mjs,
                                                                    manifest.mjs, screens.mjs (page screenshots), distinct.mjs, pipeline.mjs;
                                                                    lib/convention.mjs (file names), ffprobe.mjs, lock.mjs, paths.mjs
studio/app-preview/apps/<slug>/STATUS.md                   app     progress, decisions, shared change requests, open issues, review scores
studio/out/app-preview/<slug>/                             app     git-ignored masters, store final, social finals, sheets, screenshots, QA
studio/out/app-preview/public/                             SHARED  git-ignored Remotion public dir (fonts), filled by fonts.mjs
sites/src/pages/app-preview/index.astro                    SHARED  index of the six (tiles with hover loops)
sites/src/pages/app-preview/<slug>/index.astro             app     thin route rendering Page
sites/src/app-preview/shared/                              SHARED  apps.ts (registry of the six), types.ts, manifest.ts, Shell.astro, SampleLine.astro,
                                                                    LoopVideo.astro, Storyboard.astro, FileTable.astro, CurveLab island, TileStub.astro, base.ts
sites/src/app-preview/<slug>/                              app     Page.astro, Tile.astro, app.ts (meta), content.ts, styles, islands, tests
sites/public/app-preview/<slug>/                           app     everything published (names below)
```

URLs: `/wzornik/app-preview/` and `/wzornik/app-preview/<slug>/`. The registry lives in `sites/src/app-preview/shared/apps.ts`, not in `sites/src/shared/sites.ts`, so this branch and `wzornik-aso` do not both edit that file. The index finds `Tile.astro` files with `import.meta.glob` as the identity index does, and shows a stub until an app lands. The foundation adds `public/app-preview` to `sites/.prettierignore`.

Published names (one function in `lib/convention.mjs`, checked by `validate.mjs`), all in `sites/public/app-preview/<slug>/`:

| File                                            | Content                                                                                                                        | Target                        |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------- |
| `<slug>-hero.webm`, `.mp4`                      | marketing 16:9 loop at 1280x720                                                                                                | at most 3 MB each (4 MB hard) |
| `<slug>-hero-9x16.webm`, `.mp4`                 | marketing 9:16 loop at 540x960, used by the hero on narrow screens through `<source media>` and in the formats row             | at most 1.5 MB each           |
| `<slug>-social-1x1.webm`, `.mp4`                | marketing 1:1 loop at 720x720                                                                                                  | at most 1.5 MB each           |
| `<slug>-store.webm`, `.mp4`                     | store cut loop at 443x960                                                                                                      | at most 1.5 MB each           |
| `<slug>-tile.webm`, `.mp4`                      | 4 to 5 s loop at 480x600 for the index                                                                                         | at most 400 KB each           |
| `posters/<slug>-<variant>.jpg`                  | one poster per video                                                                                                           | at most 150 KB each           |
| `<slug>-storyboard.png`                         | key frame board with times                                                                                                     | at most 900 KB                |
| `screens/<slug>-screen-<n>.webp`                | 5 to 7 screens at 443x960                                                                                                      | at most 120 KB each           |
| `<slug>-icon-1024.png`, `<slug>-icon-512.png`   | icon without alpha, and the rounded preview                                                                                    |                               |
| `favicon.svg`, `apple-touch-icon.png`, `og.png` | site icons, Open Graph 1200x630                                                                                                |                               |
| `fonts/*.woff2`, OFL texts                      | page fonts                                                                                                                     |                               |
| `manifest.json`                                 | files with ffprobe data, masters list for "Co dostaje klient", palette, fonts, motion presets, storyboard shots, poster frames | written by `manifest.mjs`     |

Budget per app: 14 MB published, hard cap 18 MB; the six together near 85 MB, which leaves room for ASO inside the 300 MB extension limit. Masters (store final about 33 MB, social finals, ProRes or high quality H.264) stay in `studio/out/` and are listed on the page with their real ffprobe values; they are not published.

## How the build runs

### Parallel build

After the foundation commit (F with Kasownik), B2 to B6 are built at the same time, each in its own worktree and branch:

| App                      | Worktree                                                         | Branch                   | Port              |
| ------------------------ | ---------------------------------------------------------------- | ------------------------ | ----------------- |
| B1 Kasownik (foundation) | `portfolio-v2-wz-app-preview`                                    | `wzornik-app-preview`    | 4320, 4321 for QA |
| B2 Sztanga               | `/home/adrian/root/side_projects/portfolio-v2-wz-app-preview-b2` | `wzornik-app-preview-b2` | 4322              |
| B3 Rygiel                | `.../portfolio-v2-wz-app-preview-b3`                             | `wzornik-app-preview-b3` | 4323              |
| B4 Kiełek                | `.../portfolio-v2-wz-app-preview-b4`                             | `wzornik-app-preview-b4` | 4324              |
| B5 Poziomka              | `.../portfolio-v2-wz-app-preview-b5`                             | `wzornik-app-preview-b5` | 4325              |
| B6 Południe              | `.../portfolio-v2-wz-app-preview-b6`                             | `wzornik-app-preview-b6` | 4326              |

Create with `git -C /home/adrian/root/side_projects/portfolio-v2-wz-app-preview worktree add -b wzornik-app-preview-b<N> /home/adrian/root/side_projects/portfolio-v2-wz-app-preview-b<N> wzornik-app-preview`. Set up: `yarn --cwd sites install --frozen-lockfile --mutex file:/tmp/yarn-portfolio.lock`, `yarn --cwd studio install --frozen-lockfile --mutex file:/tmp/yarn-portfolio.lock`, `yarn --cwd studio/app-preview install --frozen-lockfile --mutex file:/tmp/yarn-portfolio.lock`, then `cp -rn /home/adrian/root/side_projects/portfolio-v2-wz-app-preview/studio/out/fonts-src/. studio/out/fonts-src/` (or set `WZ_FONTS_SRC`). Gatsby is not needed in an app worktree; the full Gatsby build runs once, at publication.

Memory: renders are serialized across every app preview worktree with `flock -w 5400 /tmp/wz-app-preview-render.lock`, Remotion runs with `--concurrency=4`, Astro builds with `NODE_OPTIONS=--max-old-space-size=1536`, and resvg or Chromium jobs that could balloon run under `ulimit -v` (see `NOTES.md`, "Hard lessons").

### Shared files (an app agent never edits them)

`studio/app-preview/NOTES.md`, `PLAN.md`, `package.json`, `yarn.lock`, `remotion.config.ts`, `src/index.ts`, `src/Root.tsx`, `src/shared/`, `scripts/`, `lib/`; `sites/src/app-preview/shared/`, `sites/src/pages/app-preview/index.astro`, `sites/src/shared/`, `sites/.prettierignore`, `sites/astro.config.mjs`, everything in `src/` and `static/` of the Gatsby site, the root `.gitignore`, `REBRAND.md`. If an app needs a change there, it works around it inside its own folder and writes the request to `STATUS.md` under "Shared change requests". If an app needs a new Remotion package, it asks there too; the foundation installs `@remotion/paths`, `@remotion/shapes` and `@remotion/transitions` up front so nobody has to.

`Root.tsx` imports every `src/apps/*/index.ts` that exists (`require.context` or an explicit list with all six slugs where missing ones resolve to an empty array), so adding an app never touches it.

### Order of steps for one app

1. `src/apps/<slug>/tokens.ts` and `content.ts` from this plan; `node app-preview/scripts/fonts-verify.mjs <slug>` (all green already, rerun after any font change); `node app-preview/scripts/fonts.mjs <slug>` fills the Remotion public dir and the page subsets.
2. Screens as components, each checked as a still: `npx remotion still <slug>-screen --props='{"screen":n}'`, looked at at 100% and 25%.
3. `storyboard.ts`, then `Store.tsx`, `Marketing.tsx` (three formats), `Tile.tsx`, `Icon.tsx`, `LaunchScreen.tsx`.
4. `node app-preview/scripts/pipeline.mjs <slug>`: render (under the lock), encode (store final, social finals, web versions with a CRF search to stay under the size targets, posters, tile), sheets (frame sheet at `fps=2` with `tile`, thumbnail test of 3 frames at 25%, key frame board), validate, manifest. Open every sheet and fix what is wrong: first frame sells, no 1 to 2 frame flashes, overlays readable, not everything moving at once, seam invisible.
5. The page: `Page.astro`, `Tile.astro`, `app.ts`, `content.ts`, styles and islands, route. `yarn --cwd sites run check`, `yarn --cwd sites test`, `yarn --cwd sites build`.
6. `node app-preview/scripts/screens.mjs <slug> --port <port>`: screenshots at 390 and 1440 (plus overflow checks at 320, 768, 1024), console errors, reduced motion once. Look, fix, repeat.
7. Guard (no comments, no en or em dashes) on the app's files, `yarn lint` at the root for any `.mjs` touched, `STATUS.md`, commit `add the app preview case study for <app>`, then from the main app preview worktree `git merge --no-ff wzornik-app-preview-b<N> -m "merge the <app> app preview into the app preview branch"`.

### Quality control and review (brief, phase 4)

Q runs after all six are merged: ffprobe table for every file (store cut exact to the pixel and second, web files at most 4 MB), frame sheets viewed, thumbnail test, loop seams, page screenshots at 390 and 1440 with no console errors, the distinctness board (3 frames from each app on one sheet; the weaker of two similar apps is rebuilt). R: an independent reviewer per app without process knowledge gets the sheets, the videos, the page screenshots and the rubric (hook in 2 s, message without sound, motion quality, style fidelity, interface quality, spec compliance, sales value of the page, distinctness); everything under 4 is fixed and scored again. P: links in `#wzornik` (PL and EN, a list block after the identity block in `src/components/wzornik.js`, same pattern), one link on `/wzornik/` in `sites/src/pages/index.astro`, `static/llms.txt`, `sites/README.md`, Gatsby build, sites build, deploy layout check under `gatsby serve`, the final report in Polish as the brief asks, saved as `studio/app-preview/REPORT.md`.

## Decisions for Adrian

1. Remotion is free for you. The license gives the Free License to individuals and to companies of up to 3 people, and the FAQ says one person companies qualify even when incorporated, commercial work included (checked 2026-10-07). We pin 4.0.534 and do not move to 5.0 in this run. Note for client work: if a client gets the Remotion project itself (not only the videos) and has 4 or more people, the headcounts add up and the client must buy a Company License. Default offer: rendered files only.
2. The store cut carries a silent stereo AAC track. App Store Connect rejects previews with no audio track; nothing is audible, so the brief's "no sound" holds.
3. The store cut is encoded at about 11.5 Mbps constant bitrate to meet Apple's 10 to 12 Mbps target (flat UI footage would otherwise come out near 0.5 Mbps). That makes each store file about 33 MB, so store and social masters stay out of git and off the site; the page shows web versions and lists the masters with their real ffprobe values.
4. Every store cut ends on the app's own launch screen with icon and name instead of a marketing end card, to stay inside Apple's rule that previews show the real app.
5. Poster frames are chosen per app (Kasownik 12 s, Sztanga 15 s, Rygiel 1 s, Kiełek 1 s, Poziomka 1 s, Południe 1.5 s) and the 5 s default frame of each is also designed to read.
6. URL `/wzornik/app-preview/` uses Apple's own term, which startups search for; slugs are ASCII (`kielek`, `poludnie`).
7. Kasownik uses real Poznań stop names, invented routes and invented prices, and names no operator or city card.
8. Poziomka's pixel grid is 4 output px per art pixel; 886 cannot be divided into chunky whole pixels (886 = 2 × 443), so a 1 px strip on each side is filled with the outline colour.
9. Poziomka's fonts are bitmap versions of Jersey 10 and Tiny5 (OFL, no Reserved Font Name), renamed "Poziomka Pixel" and "Poziomka Mini" and shipped with the OFL texts.
10. The app preview tooling has its own `studio/app-preview/package.json`, not the shared `studio/package.json`, so this branch and the ASO branch do not collide on it at merge.
11. The app registry is `sites/src/app-preview/shared/apps.ts`, not `sites/src/shared/sites.ts`, for the same reason.
12. Brand names (Kasownik, Sztanga, Rygiel, Kiełek, Poziomka, Południe) passed a web search for an app of the same name in the same category; that is not a trademark clearance.
13. Rygiel's breach story uses a made up service ("Forum Wędkarskie Mazury"); no real breach or company is named.
14. Południe's prices are labelled "przykładowe" on screen and on the page; the numbers add up but do not claim real savings.
15. No ZIP download for app previews (identity had one): the deliverables are videos whose masters are too heavy to publish; the page lists every file the client gets.
16. Step F ran in a cloud session, not on the WSL machine: Node 22 (the package now accepts `>=22`), the Playwright Chromium 1194 headless shell for Remotion and Chromium 1194 for page shots, fonts fetched from raw.githubusercontent.com because `gh` has no token there. Render times: store 705 frames in about 3 minutes, the three marketing formats about 9 minutes together.
17. The store web loop is 442x960, not 443x960: H.264 and VP9 in yuv420p need even sizes. The store master and the App Store file stay exactly 886x1920.
18. The store master and the marketing masters are rendered once with the loop bridge; the App Store file and the social files are the same masters cut to length, so the loops and the deliverables can never drift apart.
19. The social files (9:16, 1:1, 16:9) also carry a silent stereo AAC track, like the store file, for platforms that refuse video without audio. Nothing is audible.
20. Kasownik's fourth overlay reads „Przesiadka? Zostanie 27 minut” (the plan said „Zostało”): at the transfer at 8:06 the ticket validated at 7:48:10 has 27 minutes left, and the route sheet says the same.
21. Kasownik's hook overlay runs 2.3 s (frames 4 to 72) instead of 1.8 s, so its five words meet the reading time rule.
22. The app preview index uses the portfolio's own fonts and colours, like the identity index, so both Wzornik indexes look like one family; each tile carries its app's look.
23. The page lists the full quality files with real ffprobe values but publishes only the web loops (11 MB for Kasownik); the App Store file alone is 31 MB at the 11.5 Mbps Apple asks for.
