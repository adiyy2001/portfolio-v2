# Independent review: app preview, six apps

Reviewer inputs: BRIEF.md, final videos in studio/out/app-preview/<app>/final, published web files in sites/public/app-preview/<app>, frame sheets, my own ffmpeg frame extractions (first 2 s every 5th frame, transitions frame by frame, loop seams), ffprobe, validate.mjs output, and the deploy build in /public served locally and inspected with Playwright at 320, 390, 768, 1024 and 1440 px, with and without reduced motion. Date: 2026-10-08.

Scale: 1 to 5, 4 means good with only minor issues, 5 excellent.

## Scores

| Criterion | Kasownik (A1) | Sztanga (A2) | Rygiel (A3) | Kiełek (A4) | Poziomka (A5) | Południe (A6) |
|---|---|---|---|---|---|---|
| Hook strength, first 2 s | 4 | 5 | 5 | 3 | 5 | 3 |
| Message readable without sound | 4 | 4 | 4 | 4 | 5 | 4 |
| Motion quality (curves, rhythm, staging) | 3 | 5 | 4 | 4 | 5 | 4 |
| Style fidelity | 5 | 5 | 5 | 5 | 5 | 5 |
| Interface quality | 5 | 4 | 5 | 4 | 4 | 4 |
| Spec compliance | 5 | 5 | 5 | 5 | 5 | 4 |
| Sales value of the page | 4 | 4 | 4 | 4 | 4 | 4 |
| Distinctness from the other five | 4 | 5 | 5 | 4 | 5 | 4 |

Scores below 4: Kasownik motion (3), Kiełek hook (3), Południe hook (3).

Blocking item outside the 48 scores: the six case studies and the index are not linked from `/dla-klienta/#wzornik` or from `/wzornik/` in the deploy build (see Cross-cutting issues). The Definition of Done requires that link.

## Technical verification (all six)

ffprobe on every final and web file:

| App | Store cut | Length | Marketing cuts | Largest web file |
|---|---|---|---|---|
| Kasownik | 886x1920, 30/1, H.264 High L4.0, yuv420p, 11.40 Mb/s, 32.8 MB | 23.0 s, 690 fr | 1080x1920, 1080x1080, 1920x1080, 21.0 s | 1.59 MB |
| Sztanga | same profile, 11.40 Mb/s, 31.4 MB | 22.0 s, 660 fr | three formats, 20.0 s | 1.08 MB |
| Rygiel | same profile, 11.44 Mb/s, 34.4 MB | 24.0 s, 720 fr | three formats, 23.0 s | 2.11 MB |
| Kiełek | same profile, 11.39 Mb/s, 29.9 MB | 21.0 s, 630 fr | three formats, 21.0 s | 1.09 MB |
| Poziomka | same profile, 11.39 Mb/s, 28.5 MB | 20.0 s, 600 fr | three formats, 20.0 s | 1.37 MB |
| Południe | same profile, 11.41 Mb/s, 35.7 MB | 25.0 s, 750 fr | three formats, 26.5 s | 1.62 MB |

- Every store cut is exactly 886x1920, 30 fps constant, H.264 High, yuv420p, tv range, bt709, within 15 to 30 s and the 20 to 25 s target, far below 500 MB, moov atom before mdat (fast start). Each has a silent stereo AAC 48 kHz track, which App Store Connect accepts and which does not break "no sound by default".
- Every web loop is VP9 WebM plus H.264 MP4, no audio, all under 2.2 MB (limit 4 MB), with a JPG poster.
- `node scripts/validate.mjs <app>` reports "all checks passed" for all six (store, social, web sizes, loop seam SSIM 0.947 to 0.999, posters, screens, storyboard, icon 1024 without alpha, OG image, budgets). Poziomka additionally passes a lossless pixel grid check (100% flat 4x4 cells, 100% palette).
- Pages: no horizontal scroll at any of the five widths on any page, no console errors or warnings, no failed requests, no broken images, no em dashes in rendered text, correct footer sentence with link on every page. Videos carry `autoplay muted loop playsinline` and a poster; off-screen videos stay paused; under `prefers-reduced-motion: reduce` no video source is loaded on any page and only posters show. Index tiles play on hover at 1440 and start when scrolled into view on a 390 touch viewport.

## Kasownik (A1, native iOS, city transport tickets)

Strong, honest iOS work: large titles, cards, bottom sheet, hold-to-validate ring, shared element from card to full ticket, one green. Data is believable (Poznań, zone A, tram 16 and 5, 4,60 zł, transfer at Rondo Kaponiera).

Defects and fixes:

1. Motion, store cut 10.93 s to 11.33 s (frames 327 to 339): the tab bar disappears for 13 frames and then pops back in a single frame at frame 340, exactly while the "Kasujesz przy wejściu" overlay fades in. This is the kind of blink the brief forbids. Fix: keep the tab bar mounted for the whole shot, or, better for iOS fidelity, hide it for the whole full-screen ticket (a full-screen modal on iOS does not show the tab bar) and animate it out with the same `hero` spring when the card expands.
2. Motion, frame 300 (10.0 s): the button label cross-fades "Przytrzymaj, aby skasować" into "Bilet skasowany" with a visible ghost ("Bilet skasowany | skasować"). Fix: fade the old label out fully (or slide it) before the new one enters, 80 to 120 ms offset.
3. Hook, 0.0 to 2.0 s: the first frame is a static ticket; the "ticket comes alive" idea only shows as a faint green ripple over the QR at about 1.3 s. Fix: start the green validity wave and the QR ripple on frame 0, and let the clock tick a visible second within the first 15 frames so the first frame already reads as alive.
4. Readability, 2.0 to 2.4 s: the first overlay "Skasowany bilet. Widać, że ważny." is still on screen over the "Bilety" price list, where it contradicts the picture. Fix: end the overlay at frame 58, before shot 2 starts.
5. Marketing 9:16: the phone runs into the bottom edge, so its lower third sits under the Reels/TikTok caption and button zone; headline is set at roughly 4% of frame height, small for a feed. Fix: scale the phone down about 10% and lift it so its bottom stays above 80% of the frame height; enlarge the headline about 1.3x.
6. Page: the hero video is a 16:9 card where the phone fills about a quarter of the card, so the hero sells weakly at 1440; at 390 the hero video starts below the first viewport (see Cross-cutting). Fix: use a tighter crop or the 1:1 cut in the hero card on desktop.

## Sztanga (A2, kinetic typography, strength training)

The best rhythm of the set: cuts and type slams land on the 120 BPM grid (every 15 frames), giant 140 / 3:00 / 5/5 / 185 x 2 as heroes, black plus one orange, inverted record screen. Plates per side (25, 25, 10 = 60 kg with a 20 kg bar = 140 kg) and 1RM about 197 kg are correct.

Defects and fixes:

1. Readability, marketing 1:1 and 9:16: the subline under each giant word ("Plan dnia i talerze policzone na stronę.", "Seria zaliczona jednym stuknięciem.") is set at about 1.5% of frame height, unreadable in a feed thumbnail; the phone UI in 1:1 is cut at the bottom edge (the ZALICZONA button is cropped). Fix: set sublines at least 3% of frame height or drop them, and keep the phone fully inside the frame in 1:1.
2. Interface: secondary labels in the store cut ("TYDZIEŃ TEMU", "85% 1RM", "BÓJ 1/3") render at about 10 px on the 443 canvas, which is below what the brief's "readable from the bench" promise implies; the series screen also has a large empty band between the weight and the progress bar. Fix: raise secondary labels to at least 13 px canvas and use the empty band for the set counter.
3. Page: body copy in Anybody at 16 px shows the Polish accents so small that "każde", "uderzeń", "średnio" read as "kazde", "uderzen", "srednio" at normal viewing distance. Fix: use a wider/heavier axis for body text or a companion text face with clearer diacritics for paragraphs; keep Anybody for headings.
4. Store cut 1.83 s: "3/5" slides in clipped at the left edge for two frames. Acceptable as motion, but it is a cut glyph on a poster-candidate moment; start the slide 4 frames later or from the scale-in used elsewhere.

## Rygiel (A3, dark neon and cyber, password manager)

Very strong first frame (red leak card on a dark grid, from frame 0), scramble that resolves into readable text, scan line between screens, health score 68 to 96 that changes ring color, and a monospace system that stays legible. Thumbnail test at 25% is fully readable.

Defects and fixes:

1. Readability: each overlay spends its first 0.4 to 0.6 s as scrambled characters, so "Wiesz o wycieku pierwszy" (4 words) is fully readable for about 1.6 s and "Nowe hasło w trzy sekundy" (5 words) for about 2.0 s, at the low edge of the 0.3 s per word plus 0.5 s rule. Fix: shorten the scramble to 8 frames or extend each overlay by 15 frames.
2. Marketing: headlines pass through garbage states long enough to be captured on a feed pause ("Fbkwe wykryty.", "Fakw vzmienione.", and the end title "RYGIPA" on the brand card). Fix: hold the resolved brand name for at least 1.5 s at the end, and limit the scramble to the changing letters only.
3. Marketing 9:16: the bottom third of the frame is empty dark grid; the phone is small. Fix: scale the phone up or move the terminal log lines (which exist in 16:9) into that area.
4. Store cut: the status-bar clock jumps from 7:16 to 21:38 between shots 4 and 5 without any marker. Fix: add a short time card or keep the screen clock consistent.

## Kiełek (A4, pastel claymorphism, plant care)

Faithful claymorphism: inflated cards, layered soft shadows, warm pastels, rounded type, a mascot built from simple solids that blinks, squashes and reacts in the diagnosis. Plant data is plausible (monstera 400 ml, kalatea 250 ml, sansewieria 150 ml, winter interval 12 days).

Defects and fixes:

1. Hook, 0.0 to 2.0 s: frame 0 is the greeting and the mascot with about 60% of the screen empty peach; the "3 rośliny" card only pops at about 0.6 s and nothing on frame 0 says what the app does. The store poster would show a cute pot and an empty screen. Fix: have the "Dziś podlej 3 rośliny" card already on screen on frame 0 (mascot can still bounce in), or open on the diagnosis answer "Za dużo wody" which states the value immediately.
2. Motion, tab changes at 7.0 s, 11.0 s, 16.0 s and 19.0 s: screens cross-dissolve with a double exposure (for example "Kalendarz" ghosted over "Dzień dobry, Ola!" at frames 216 to 220). In a style built on springs this reads as a generic fade. Fix: replace the dissolve with a squash and slide of the new card stack on the `bounce` spring, outgoing screen fully gone before the new heading arrives.
3. Interface: plant cards use 8 to 9 px secondary text on the 443 canvas ("Monstera · Salon", ml chips), which is mushy in the 25% thumbnail. Fix: 11 px minimum for secondary text, 12 px for chips.
4. Distinctness: the bottom overlay pill sits in the same place and shape as in Kasownik and Południe. Fix: use the mascot speech bubble for overlays, which would be unique to Kiełek.
5. Page at 320 and 390: the motion section heading breaks as "Odbicie zamiast / zatrzymania" with one word on the last line. Fix: non-breaking space or `text-wrap: balance`.

## Poziomka (A5, 8-bit pixel art, habit tracker)

The most complete style execution: 16-color palette, integer scaling verified pixel exact, stepped animation at 7.5 fps poses, dithered wipes, XP, levels, streak and a garden that grows. First frame "POZIOM 8!" with the strawberry and sunburst sells instantly.

Defects and fixes:

1. Interface, data: the hook screen says "POZIOM 8, 1200 / 1200 XP" with "Do poziomu 9: 200 XP", while the task screen after leveling shows "POZIOM 8, 1200 / 1400 XP". Fix: show 1200 / 1400 on the level-up screen too (or 0 / 200 within level).
2. Interface: task rows use the smallest pixel face at what reads as about 5 px cap height on the 443 canvas ("rano, codziennie", "+10 XP" chips); at 25% thumbnail size they are not readable. Fix: use the larger pixel face for row subtitles or remove them in the video.
3. Page: all body paragraphs are set in the pixel font at about 12 px; the long "Klient i zadanie" and "Kierunek" texts are tiring to read and lower the page's sales value. Fix: keep pixel type for headings, labels and data, and set paragraphs in a plain OFL text face (the page can still frame them in pixel boxes).
4. Web store loop is published at 884x1920 while the other apps publish 442x960. Not a spec violation, but inconsistent and four times the pixels. Fix: export at 442x960 with nearest-neighbor scaling, or document the choice on the page.

## Południe (A6, isometric data dashboard, home solar and storage)

Numbers are carefully modeled and consistent: 8.2 kWp, 6.4 kW peak at 13:10, 47.8 kWh produced split 7.5 / 7.5 / 32.8, home 15.3 kWh split 7.5 / 6.6 / 1.2, 92% self-sufficiency, 23.10 zł = 14.1 kWh x 1.08 zł plus 32.8 kWh x 0.24 zł. Charts draw in time, one information per shot.

Defects and fixes:

1. Hook, 0.0 to 2.0 s: almost nothing moves except the dashed flow lines; the house occupies about a fifth of the screen and the three flow values (0,5 / 1,3 / 4,6 kW) are dimmed to roughly 2:1 contrast on white, so the first frame reads as a quiet dashboard. Fix: start with the house large and the power flowing visibly from roof to battery to grid, count 6,4 kW up from 0 within the first 20 frames, and keep the three values at full contrast in the hook.
2. Interface: the 40% "waiting" dim used for secondary values drops them to about 2:1 contrast throughout the store cut (Teraz list, Bilans legend). Fix: dim to a color that keeps at least 4.5:1, and use weight or size for hierarchy instead of opacity.
3. Motion and continuity, store cut 7.5 s (frame 226): the status-bar clock jumps from 13:10 to 21:40 while the Magazyn screen is still fully visible, then the tab change is a cross-dissolve with ghosted headings ("Dzień" over "Magazyn" at frame 232). Fix: change the clock on the first frame of the new screen and use a push or a fast fade-through-background instead of a dissolve.
4. Spec: the marketing cuts are 26.5 s (795 frames), above the brief's 20 to 25 s target; the store cut sits exactly on 25.0 s. Fix: trim the end card and the Bilans hold by about 1.5 s.
5. Marketing 9:16: the isometric house is cropped by the left or right frame edge in most shots and overlaps the phone, which crowds the frame. Fix: scale the scene to about 85% and center it above the phone, or alternate house and phone instead of stacking.
6. Distinctness: light gray background, white cards, dark bottom pill overlay and centered end card are close to Kasownik. Fix: use the isometric grid or the amber sun color as the overlay carrier so the overlays belong to this app.
7. Page at 320: "Twoje dane też mogą opowiadać historię" ends with one word on the last line. Fix: `text-wrap: balance` or a non-breaking space.

## Cross-cutting issues

1. Linking (blocking, Definition of Done): in the deploy build, `/dla-klienta/#wzornik` links to the nine older samples and the identity samples but not to `/wzornik/app-preview/` or any of the six case studies, and `/wzornik/` has no link either. The only way in is typing the URL. Fix: add an "App preview" entry (or the six tiles) to the `#wzornik` section and to `/wzornik/`, rebuild, and confirm with a grep of `public/dla-klienta/index.html` for `app-preview`.
2. Path prefix: all links in the build are root-relative (`/wzornik/...`) and the canonical is `https://adrianturbinski.pl/wzornik/app-preview/`, not `/portfolio-v2/`. If the site is still deployed to GitHub Pages under `/portfolio-v2/`, every asset and link on these pages will 404. Confirm the deploy target; if it is `/portfolio-v2/`, build with the prefix.
3. Mobile hero (all six case studies): at 390 px the first viewport shows the name, intro, spec table and section chips; the looping marketing video starts below the fold (for example at about 820 px on Poziomka). The brief puts the looping marketing cut first. Fix: on narrow screens move the hero video directly after the title (or before the spec table) and collapse the spec table into one line.
4. Shared video skeleton: all six store cuts use the same structure: three overlays starting at frame 4 (ending at frame 66 to 75), around frame 190 to 240 and around frame 330 to 450, then a centered icon plus name end card on a flat background. Rhythm inside the shots differs well (beat cuts, steps, springs, scramble), but the outer skeleton is the one the brief warns against. Fix: vary at least the end cards (for example Sztanga ends on a slammed number, Poziomka on a level-up jingle frame, Rygiel on the vault locking) and let the overlay count and placement follow each style.
5. Index page: strong headline, clear "Co dostaje klient" list, six distinct tiles that play on hover or scroll. Minor: on mouse leave the tile pauses mid-frame instead of returning to its poster; the Kiełek tile crop cuts the greeting line at the top and the Kasownik tile crops the QR code. Fix: reset `currentTime` to 0 on leave and adjust the tile crops.
6. Distinctness across the set: Sztanga, Rygiel and Poziomka are unmistakable at thumbnail size. Kasownik, Kiełek and Południe share a light background, white rounded cards and a bottom pill overlay; color and type separate them, but the overlay pattern and layout should differ more (see per-app fixes).
7. What works across all six: every page has the full brief structure (hero, client and task, direction, storyboard with frame table and full PNG, live motion lab with two presets, screen gallery, store and social side by side, file table with ffprobe values, CTA, honest footer), no real brands or device renders, no invented ratings or downloads, and reduced-motion handling is correct.

## Top fixes by score impact

1. Add the app preview links to `/dla-klienta/#wzornik` and `/wzornik/` (blocking).
2. Kasownik: remove the 13-frame tab bar disappearance at 10.9 s and the label ghost at 10.0 s (motion 3 to 4 or 5).
3. Południe: rebuild the first 2 s with visible flow, a counting 6,4 kW and full-contrast values; drop the 40% dim for text (hook 3 to 4, interface 4 to 5).
4. Kiełek: put the "3 rośliny" card (or the diagnosis answer) on frame 0 and replace tab dissolves with a spring push (hook 3 to 4, motion 4 to 5).
5. All pages: bring the hero video into the first mobile viewport (sales value 4 to 5 for the strongest pages, Rygiel and Sztanga first).
