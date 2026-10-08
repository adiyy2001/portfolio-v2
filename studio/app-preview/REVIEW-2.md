# Independent review: app preview, six apps

Reviewer inputs: BRIEF.md, final masters in `studio/out/app-preview/<app>/final/`, published web files, frame sheets, my own ffmpeg frame extractions (first 2 s every 5th frame, 1 fps mosaics of the 1:1 cuts, crops around overlays and transitions, loop seam strips), `scripts/validate.mjs` for all six apps, and the deploy build in `/public` served locally and captured with Playwright at 320, 390, 768, 1024 and 1440 px, plus reduced motion at 390 and 1440 px.

Out of scope by instruction: the `/portfolio-v2/` prefix and the links from the client edition's `#wzornik` section.

## Scores (1 to 5)

| Criterion | kasownik (A1) | sztanga (A2) | rygiel (A3) | kielek (A4) | poziomka (A5) | poludnie (A6) |
|---|---|---|---|---|---|---|
| Hook strength in the first 2 s | 4 | 5 | 4 | 4 | 5 | 4 |
| Message clarity without sound | 4 | 5 | 4 | 4 | 5 | 5 |
| Motion quality (curves, rhythm, staging) | 4 | 5 | 4 | 4 | 4 | 4 |
| Style fidelity | 5 | 4 | 5 | 5 | 5 | 5 |
| Interface quality | 4 | 4 | 4 | 4 | 5 | 4 |
| Spec compliance | 5 | 5 | 5 | 5 | 5 | 5 |
| Sales value of the page | 4 | 5 | 5 | 4 | 4 | 5 |
| Distinctness from the other five | 4 | 5 | 4 | 4 | 5 | 4 |

No score is below 4. The set meets the brief's bar of 4 or more on every criterion. The defects below are what stands between the 4s and a 5.

## Technical verification (all apps)

My own ffprobe on every master:

| App | Store | Store duration | Social cuts | Notes |
|---|---|---|---|---|
| kasownik | 886x1920, 30/1, H.264 High, yuv420p, mp4 | 23.0 s, 690 frames | 1080x1920, 1080x1080, 1920x1080, 21.0 s | silent stereo AAC |
| sztanga | same | 22.0 s, 660 frames | 20.0 s | silent stereo AAC |
| rygiel | same | 24.0 s, 720 frames | 23.0 s | silent stereo AAC |
| kielek | same | 21.0 s, 630 frames | 21.0 s | silent stereo AAC |
| poziomka | same | 20.0 s, 600 frames | 20.0 s | SAR reported N/A (harmless) |
| poludnie | same | 25.0 s, 750 frames | 25.0 s | silent stereo AAC |

- Every store cut is inside 15 to 30 s, every one is inside the 20 to 25 s target, all are 30 fps, H.264, yuv420p, far under 500 MB.
- Every web file (WebM VP9 and MP4) is under 4 MB. The largest is rygiel-hero.mp4 at 2.1 MB.
- `validate.mjs` passes all checks for all six apps, including loop seam SSIM, icon without alpha, OG size and the pixel grid test for poziomka.
- The published files in `sites/public/app-preview/<app>/` are byte identical to the ones in the deploy build `public/wzornik/app-preview/<app>/`.
- Pages: no console errors, no failed requests, no broken images, no horizontal page scroll at any of the five widths, no en or em dashes in page text, no heading whose last line is a single word. The only clipped elements found are `.sr-only` captions, which is intended.
- Video markup: every page video has `autoplay muted loop playsinline` and a poster. Under reduced motion every video loses autoplay, stays paused at readyState 0 and shows only the poster, as the brief requires. Index tiles play on hover at 1440 px and on scroll into view at 390 px (tested with touch emulation).

## Per app defects and fixes

### kasownik (A1, native iOS, transit tickets)

1. Hook 4: the store cut opens on a strong, honest frame (live ticket, QR, 41:10 countdown), but frames 0 to 4 have no overlay and the motion in the first 2 s is limited to a slow QR colour wave and the striped validity band. In a 25% thumbnail it reads as a static QR code. Fix: start the QR "fala" on frame 0 and let the overlay sit on the first frame already, or open on the moment the ticket card lands (a spring scale from 0.96) so the first second shows something happening.
2. Marketing 9:16 (`kasownik-social-1080x1920.mp4`): the phone occupies about 40% of the frame width and the lower third of the frame is empty mint or grey for most of the 21 s (visible in every row of `marketing-9x16-frames.png`). At frame 0 the headline "Bilet, który żyje." touches the top of the phone. In a Reels feed the UI is unreadable. Fix: scale the phone to about 60 to 65% of the frame width, move it down so it fills the lower two thirds, and keep a clear gap of at least 40 px under the headline.
3. Store transition at 20.5 s (frame 615): one half second sheet cell shows an almost empty white screen with only the status bar before the icon appears. Fix: cross the Kontrola screen directly into the end card (scale the QR down into the icon) instead of fading through white.
4. Interface 4: the ticket screen leaves its lower third empty under "Trasa", and Moje bilety is half empty. On a real device this is fine, but in a 23 s demo it wastes the frame. Fix: add the next departure row or a "Następny przystanek" card under the buttons on the ticket screen, and one more used ticket on Moje bilety.
5. Page sales value 4: at 1440 px the hero is a 16:9 box in the right column in which the phone is about 150 px tall, so the hero barely shows the product. Fix: on desktop give the hero video the full content width, or use the 1:1 cut in the hero column, where the phone is three times larger.
6. Distinctness 4: the marketing cut follows the same scheme as rygiel, kielek and poludnie (small label plus two line headline at the top, centred phone, icon and name end card). See cross-cutting issue 1.

### sztanga (A2, kinetic typography, strength training)

1. Style fidelity 4, the only real defect here: in the wide setting of Anybody (width 150) the dot of "Ż" in "CIĘŻAR" renders as a distorted teardrop leaning right, visibly detached from the letter. It is in the first headline of every marketing cut from about 1.5 s (`sztanga-social-1920x1080.mp4` at 1.8 s, also 9:16 and 1:1), so it sits in the hook. Fix: at widths above about 125 either clamp the "wdth" axis for glyphs with dot accents, or substitute a manually placed dot (a square span) for the Ż dot, and re-check every wide word with Polish diacritics ("CIĘŻAR", "SZEŚĆ", "POKAZAĆ").
2. Interface 4: at 1.0 s (frame 30) of the store cut the "140" is in its wide state and the KG, serie and repetitions block has not arrived yet, leaving the middle third of the screen black; at 1.5 s "3/5" enters cut off at the left edge. Both are momentary and in style, but the hook frame looks empty for half a second. Fix: let the series block land on the second beat (frame 15) rather than later, and keep entering numbers inside the 24 px side margin.
3. Store at 15.5 s (frame 465): "MARTWY CIĄG" runs off the right edge during its stretch. One beat, acceptable, but it reads as a layout bug in a sheet. Fix: cap the stretch so the word stays within the safe margin.
4. Overlays ("Liczby, które widać z ławki", "Nowy rekord? Sztanga zauważy.") are white labels with about 36 px caps: readable at full size, small in the 25% thumbnail. Optional: 20% larger.

### rygiel (A3, dark neon and cyber, password manager)

1. Hook 4: the red alert card is a good first frame, but the overlay "Wiesz o wycieku pierwszy" scrambles in from about frame 15 and is only legible at about 0.9 s. In a 25% thumbnail the mono labels inside the alert card are unreadable; only "Twój adres e-mail pojawił się w wycieku" survives. Fix: show the overlay already resolved on frame 0 (scramble it out, not in, if needed) and enlarge the alert headline by about 20%.
2. Clarity 4: in the marketing cuts every scene change scrambles the kicker, the headline and the subline at once (`rygiel-social-1080x1920.mp4` frames 165 to 210: "Mhlzf miykryty.", "Hasyp kluglyty.", "20 tnaknx, by. 709 dkxw"). For roughly 0.6 s per scene nothing on screen is readable, and the scrambled subline still shows the previous scene's text. Fix: scramble only the headline, change the subline with a plain cut or fade, and stagger the kicker after the headline so one line is always stable.
3. Motion 4: the scramble, the scan line and the glow pulse often run at the same time (frame 15 of the store cut: overlay scramble plus scan plus ring pulse), against the brief's "not everything moves at once". Fix: hold the glow pulse while a scan or scramble is running.
4. Interface 4: many labels in the store screens are tiny mono caps (KONTO, SERWIS, the vault list metadata, about 18 to 20 px in the 886 px frame), and the strikethrough rows in "Zdrowie sejfu" are low contrast grey on black. Fix: raise the smallest label size to 22 px at 886 px width and use the cyan "naprawione" state rather than grey strikethrough for repaired rows.
5. Distinctness 4: the marketing composition (kicker, headline, centred small phone, end card) is the same skeleton as kasownik, kielek and poludnie, only dark. The 9:16 cut also leaves the bottom fifth of the frame as empty grid.

### kielek (A4, pastel claymorphism, plant care)

1. Hook 4: frame 0 of the store cut has the mascot and the "3 rośliny" card, which is charming, but contrast is low (peach, cream, yellow) and the overlay "Rośliny podlane na czas" is a small cream pill near the bottom. In the 25% thumbnail the frame reads as a pale pink rectangle. Fix: darken the card text or the card itself one step (Masło to a deeper yellow), and make the overlay pill brown on cream.
2. Motion 4: several screen changes pass through a nearly empty frame where only a fading ghost title is visible: store 7.0 s (Kalendarz), 15.0 s (Diagnoza), 18.0 s (Pokoje) and 20.0 s (empty screen with only the tab bar before the icon). These read as blank flashes in the sheet and against the "każde ląduje z odbiciem" idea. Fix: overlap the outgoing and incoming screens (start the incoming spring when the outgoing one is at 60%) instead of emptying the screen first.
3. Interface 4: on "Dziś" after the card collapses (from 2.5 s), the lower 40% of the screen is empty peach; the same happens on Kalendarz under the month grid. Fix: add the "Jutro" preview or a room card at the bottom of Dziś, and a short care note under the calendar.
4. Marketing 1:1 (`kielek-social-1080x1080.mp4`): the phone sits inside the large plate at about 35% of the frame height; its UI is unreadable at feed size and the headline is one small line at the top. Fix: scale the phone up about 1.5 times and let the plate crop at the frame edges.
5. Page sales value 4: same hero problem as kasownik, the 16:9 hero at 1440 px shows a small phone in a small box. Fix as for kasownik.

### poziomka (A5, 8-bit pixel art, habit tracker)

1. Motion 4: the story runs backwards (the store opens on "POZIOM 8!" and then cuts to "Poziom 7, 1160/1200 XP" and the tasks that lead to it); that works as a flash forward, but nothing in the frame signals it, and the XP bar on the hook screen is visually empty (1200/1400 means 0 of 200 XP), so the most visible bar in the hook barely moves. Fix: on the hook screen show the bar filling to the top and rolling over to level 8 in the first second, then cut to the tasks.
2. Motion: during dither wipes two screens overlap for a few frames (store 18.0 s: Tydzień on top, Ogródek panels at the bottom). It is in style and short, but in the sheet it looks like a layout fault. Optional: shorten the wipe to the stated 16 frames and avoid landing a sheet sample on it.
3. Page sales value 4: all body copy, tables and storyboard text on the page use Tiny5 at 16 px. It is legible, but long paragraphs in a pixel font are slow to read, and the client and direction sections are almost 9600 characters of it. Fix: keep the pixel fonts for headings, labels and UI samples and set running text (paragraphs, tables) in a plain OFL sans, or raise Tiny5 to 20 px for paragraphs.
4. Web store loop is 884x1920 rather than 886x1920 (documented on the page as integer scaling). Fine for the web; just note the App Store master is the correct 886x1920.

### poludnie (A6, isometric data dashboard, home PV)

1. Hook 4: frame 0 starts the counter at 5,6 kW and the overlay "Prąd z dachu na żywo" is still a grey, half transparent pill, so the poster-like first frame is not the finished state. Fix: hold 6,4 kW and the resolved overlay on frame 0, and start the count-up in the second beat.
2. Motion 4: on "Kiedy włączyć" (store 12.5 s to 14.5 s) an empty white card placeholder is on screen for about 2 s before "12:30 do 14:00" fades in, and the screen between Dzień and Kiedy włączyć passes through an empty grey frame (9.5 s). Fix: draw the forecast curve and the card content together, or start the card's content 20 frames after the card instead of 60.
3. Interface 4: on the Teraz and Magazyn store screens the isometric scene is cropped at the left edge (power pole cut, house at the frame edge), while the static screens in the gallery show it whole. In the 1:1 cut the house is also cut at the left in most scenes ("92% prądu z własnego dachu" at 23.5 s). Fix: pull the camera back about 10% or shift the scene right so the pole and the house corner stay inside the 24 px margin.
4. Distinctness 4: light grey background, white cards and a neutral grotesk make it the closest pair with kasownik in thumbnails. The isometric house separates it in motion, but the end card (icon plus name on light grey) is almost the same. Fix: end on the isometric house at dusk with the name, not on a flat icon card.

## Cross-cutting issues

1. Shared marketing skeleton. Five of six marketing cuts (kasownik, rygiel, kielek, poziomka, poludnie) use one layout: a small kicker and a two line headline at the top, a phone centred below it at 35 to 45% of the frame width, a word by word headline swap per scene and an end card with icon and name. Only sztanga breaks it. The brief explicitly asks to avoid "the same video skeleton in 6 projects". Fix, per style: kasownik with the ticket leaving the phone as the main actor; rygiel as a full frame terminal with the phone as a secondary panel; kielek with the mascot leading and the phone tilting in and out; poludnie with the isometric house full frame and the phone as an inset.
2. Phone scale in social cuts. In 9:16 and 1:1 the phone UI is too small to read on a phone feed for kasownik, rygiel, kielek and poludnie; the bottom 20 to 35% of the 9:16 frame is often empty. Scaling the phone to 60 to 65% of the width would fix most of it.
3. Transitions through empty frames. Kasownik (20.5 s), kielek (7.0, 15.0, 18.0, 20.0 s) and poludnie (9.5, 12.5 s) fade the old screen out before the new one arrives, which leaves half second frames with almost nothing on them. Overlapping the transitions would raise motion scores for all three.
4. First frame of the store cut. In kasownik, rygiel, poziomka and poludnie the overlay or the key number is not in its final state on frame 0. The store autoplays muted from frame 0 and the first frame is what a scroller sees; hold the resolved state on frame 0.
5. Desktop hero on light pages. For kasownik and kielek the 1440 px hero is a half width 16:9 video in which the phone is tiny. The dark pages (sztanga, rygiel) and poziomka handle it better because their 16:9 cut uses the full frame. Use the full content width or the 1:1 cut on desktop.
6. Things that are clearly good and should not be changed: technical compliance is exact on every file; reduced motion is handled correctly everywhere; every page has a live motion lab that actually explains the motion system (sztanga's metronome and rygiel's readable vs too fast scramble are the strongest); the six styles are unmistakable from one another and match their assigned rows; footers and fictional data follow the content rules.
