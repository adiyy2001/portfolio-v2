# Independent review: ASO screenshot sets (Wzornik)

Reviewer: independent subagent, judged only the brief, the exported files, the boards, the validator output and the built pages in `/public`. Date: 2026-10-08.

Scale 1 to 5 (4: good with minor issues, 5: excellent).

## Scores

| Criterion | Gran (S1) | Szyld (S2) | Margines (S3) | Chochla (S4) | Kruszec (S5) | Bis (S6) |
|---|---|---|---|---|---|---|
| Thumbnail legibility | 5 | 5 | 4 | 5 | 4 | 4 |
| Benefit clarity in first 3 | 5 | 5 | 4 | 5 | 5 | 5 |
| Story of the whole sequence | 5 | 5 | 5 | 5 | 4 | 5 |
| Fidelity to the assigned style | 5 | 5 | 5 | 5 | 4 | 5 |
| UI quality | 4 | 4 | 4 | 5 | 5 | 5 |
| Spec compliance | 5 | 5 | 5 | 5 | 5 | 5 |
| EN version quality | 4 | 5 | 5 | 4 | 5 | 4 |
| Sales value of the page | 4 | 4 | 5 | 5 | 4 | 5 |
| Distinctness from the other five | 5 | 4 | 5 | 5 | 5 | 5 |

No score is below 4. One cross-cutting blocker (the ASO section is not linked from `#wzornik`) is outside the per-page rubric but fails the Definition of Done; see "Cross-cutting issues".

## What was checked

- Validator: `node scripts/validate.mjs <brand>` for all six brands: 0 errors each (gran 38 files, szyld 38, margines 38, chochla 38, kruszec 50 with iPad, bis 38).
- Independent spec check with PIL on every exported file: App Store 1320x2868 RGB, Play 1080x1920 RGB, feature graphic 1024x500 RGB, iPad 2064x2752 RGB (kruszec only), App Store icon 1024x1024 RGB with square corners, Play icon 512x512 RGBA with alpha fully 255 (32-bit, opaque). Largest screenshot 688 KB, all far below 8 MB. 6 shots per store per language plus variant B in both stores and languages for every brand.
- ZIPs: each published `<brand>-aso.zip` unpacked and diffed against `studio/out/aso/<brand>/export`: identical for all six. Folders by store and language plus `teksty/pl.json`, `teksty/en.json` and a CSV of headlines.
- Headlines: every headline in PL and EN has 6 words or fewer. No banned claims (no "best", "free", "Nr 1", ratings, prices on promo, downloads). Kruszec labels figures as sample data ("Dane przykładowe", "Sample data") and makes no return promises.
- Gran panorama seams: last column of frame N compared with first column of frame N+1 for all 5 joins in both stores and languages. Mean channel difference 0.0 to 0.9; the few differing pixels are anti aliased tree edges. Zoomed 400 percent on the 01/02 seam: shapes continue exactly.
- Thumbnails: first 3 frames of every set downscaled to 160 px (App Store) and 180 px (Play) and viewed.
- Pages: served `/public` with `gatsby serve` on 127.0.0.1, Playwright Chromium at 320, 390, 768, 1024 and 1440 px for the index and all six case studies; PL/EN and App Store/Google Play toggles clicked at 390 and 1440. No horizontal scroll at any width (scrollWidth equals clientWidth everywhere), no console errors, no failed requests. Toggle swaps the full set (6 EN files after click, 6 Play EN files after store switch; kruszec 12 with iPad).

## Per brand defects and fixes

### Gran (S1, panorama, Sudety trails)

Strong set. The continuous landscape works, the red trail runs through all six frames, phones sit in the scenery, seams are pixel exact.

1. Google Play, PL and EN, frame 05: the white headline runs into the white cloud at upper right. EN "Wind and visibility" loses "lity" completely (white on white); PL "widoczność" loses "ść". Fix: move the cloud right or up by about 120 px in the Play 05 composition, or wrap the headline one word earlier, or give the cloud a slightly darker tone where it meets the text. The App Store version of frame 05 is clean, so only the Play layout needs a per store override.
2. EN copy: "Sudety trails with real walking times" uses the Polish name. A native English listing would say "Sudetes". Fix: "Sudetes trails with real walking times" (6 words), and the same in the feature graphic.
3. UI quality: in App Store frame 02 and Play frame 02 the phone is small and far away (offline maps list is barely readable even at full size), and in Play 06 the phone bottom and tab bar are cut by the hill. These are deliberate depth choices but the frame 02 screen is the proof for the "works with no signal" claim. Fix: scale the frame 02 phone up about 15 percent or bring it lower in the scene.
4. Page at 320 px: the type specimen "Śnieżka 1603 m" breaks and leaves "m" alone on the second line; the sequence cards keep a 96 px image column and squeeze the text to 2 or 3 words per line, and the "WIDAĆ W WYNIKACH" badge wraps. Fix: use a non breaking space between "1603" and "m", and stack the card image above the text under about 360 px.

### Szyld (S2, bold gradients and tilted devices, local shops)

Energetic, original palette (bottle green to lime, grapefruit to lime), real grain, 3D tilted devices bleeding out of frame, giant outlined "17:30" and "SOBOTA". Very good.

1. App Store and Play frame 05 (PL and EN): the phone screen behind the floating code card shows a large empty rounded rectangle, which reads as a missing image rather than the card having been lifted out. Fix: keep a faint ghost of the QR inside the hole, or let the card overlap the hole fully, or fill the screen area with the order summary.
2. Frame 04 rotates the headline 90 degrees ("Godzina odbioru, jaka ci pasuje"). It is a nice break in rhythm but it is the hardest headline in the set to read in a store grid. It is outside the first three so impact is limited. Optional fix: keep the rotated text but add a short horizontal kicker ("17:30") already present, as the readable element, or shorten to "Odbiór, kiedy ci pasuje".
3. Distinctness: Szyld and Gran both lead with dark green plus cream or lime; side by side in `distinct.png` rows 1 and 2 share the same dominant hue even though the styles differ. Fix: lean Szyld's first frame toward the grapefruit end of its gradient (frame 01 is currently mostly green), which would separate it clearly from Gran in an index or a portfolio grid.
4. Page at 320 px: sequence cards squeeze the text column to 1 to 3 words per line next to the image ("Godzina / odbioru, / jaka / ci pasuje"). Fix: stack image over text below about 400 px.

### Margines (S3, doodle annotations, flashcards)

Every annotation points at a specific UI element (circled sentence, underlined word, arrows to the review count and to "6 min"). The EN set is rewritten for an English speaker learning Polish, with Polish words on the cards: excellent localisation.

1. Thumbnail legibility: Caveat headlines are noticeably lighter than the other five sets and sit on a busy grid. They pass at 160 px but are the weakest of the six at a glance. Fix: use Caveat 700 for the headlines (600 looks used), increase size about 8 percent, or put a soft paper patch behind the headline area so the grid lines do not run through the letters.
2. Benefit clarity in first 3: frame 01 "Słówka zapamiętane razem ze zdaniem" is clever but does not say "flashcards" until the UI is read; the category becomes clear from frame 02. Fix: consider variant B "Fiszki z twoich własnych notatek" as a stronger default, or add "fiszki" in frame 01 ("Fiszki, które pamiętają zdanie").
3. UI quality: frame 03 (both stores, both languages) shows the drawing as a floating sticky note while the drawing pad inside the phone is an empty dashed box. The screen should show the same sketch the note shows. Fix: render the lighthouse (EN: tram) sketch inside the phone pad as well, faded, so the note reads as "lifted out of" the screen.
4. Page at 768 px: the "ODRĘCZNE ADNOTACJE" label sits inline to the left of the "Margines" logotype at its baseline, which looks like a layout accident. Fix: put the label on its own line above the logotype at tablet widths.

### Chochla (S4, Memphis pop art, recipes and meal planning)

Thick outlines, flat colours, halftone, comic bubbles carrying the headlines, food characters built from shapes, decoration kept off the UI. Bangers renders Ą, Ę, Ł, Ó, Ż correctly (checked at full size). Very good.

1. EN, App Store frame 02: the bubble breaks "THE SHOPPING / LIST / WRITES ITSELF", with "LIST" alone on the middle line. Fix: widen the bubble or set "THE SHOPPING LIST / WRITES ITSELF" in two lines (the Play version already does this).
2. EN copy: "Portions for two or five" is a literal rendering. Native recipe app copy would be "Serves two or serves five" or "Scale any recipe, two to five". Fix: rewrite frame 04 EN.
3. Feature graphic: the speech bubble outline reaches into the outer 10 percent on the left. Text is inside the safe 80 percent, so no content loss, only the outline may be cropped. Optional fix: shift the bubble 30 px right.

### Kruszec (S5, dark premium glass, budget and investing)

Calm, credible, no neon, numbers consistent across frames (48 200 + 121 900 + 16 320 = 186 420 zł; Play frame 02 drops two categories and its totals are adjusted correctly). EN is a different world, not a translation: GBP, ISA, workplace pension, gilts. iPad set is a real two column adaptation, not a stretched phone.

1. Fidelity to style, "chart as hero": in frame 01 the net worth chart is a small element inside the phone; only a thin glowing line escapes left ("od 2021"). At thumbnail size the hero is the phone, not the chart. Fix: let the line run large across the full frame behind the phone (it already does on the feature graphic), or enlarge the chart card out of the phone like the frame 03 gauge.
2. Story of the sequence: all six frames use the same navy field with the same light serif headline at top; compositions vary (glass card, gauge, ring, timeline, stacked phones) but the colour rhythm is flat, so frames 04 to 06 blur together on the board. Fix: give one later frame a distinct light accent (for example a pale mint glass panel or a larger glow behind the timeline in frame 05).
3. Thumbnail legibility: the thin light serif on navy holds at 160 px but is the most fragile headline style of the six; the app icon (thin line on a dark glass tile inside a dark square) nearly disappears at 40 px in the search mockup. Fix: use a heavier optical size or weight for the roman part of the headlines, and thicken the icon line by about 50 percent with more contrast on the tile.
4. Polish typography: frame 01 and the iPad frame 01 end line one with "na" ("Cały majątek na / jednym wykresie"). Fix: break before "na" or bind it with a non breaking space.
5. EN App Store frame 04: the floating "Bonds 9% / 20%" and "Shares 80% / 70%" callouts are partly covered by the ring and phone edge, so the plan figure is hard to read. Fix: move the callouts 20 px outward.
6. Page at 320 px: sequence section text column is squeezed next to the thumbnail (1 to 3 words per line). Fix: stack below 400 px.

### Bis (S6, Y2K holographic chrome, music and gigs)

Iridescent gradients, chrome keywords with highlights, sparkles, bubble type (Modak), stickers, fictional artists and covers built from shapes. The page states that every artist and venue name was checked. Very good.

1. Thumbnail legibility: the chrome keywords (light grey to pink gradient with a dark outline) have lower contrast than the black words around them, and sparkles sit on letters: the "i" dot in "znajomi" (frame 04), the end of "miesiąc" (frame 05) and "naklejka" (frame 06) are partly covered. In the first three the chrome words "Koncerty", "wykonawcy", "Przypomnimy" still read at 160 px. Fix: darken the lower half of the chrome gradient by about 15 percent and move sparkles off glyphs (to the end of the word or above the cap height).
2. EN copy: "Bands you've never heard, playing nearby" drops the "of" a native writer would use ("never heard of"), and adding it makes 7 words. Fix: rewrite frame 02 EN within 6 words, for example "New bands, playing near you" or "Bands you don't know, playing nearby".
3. Play frame 01: the third headline line "których słuchasz" sits almost on top of the phone status bar (about 20 px gap). Fix: move the phone down 30 px in the Play composition.

## Cross-cutting issues

1. Blocker for the Definition of Done: the ASO section is not linked from the portfolio. In the deployed build, `/dla-klienta/` (section `#wzornik`) links to the nine sample sites and to `/wzornik/identyfikacja/`, and `/wzornik/` links to the same, but neither links to `/wzornik/aso/` or to any of the six case studies. `src/components/wzornik.js` has a link for "identyfikacja" and none for "aso". The pages exist and work, but a visitor cannot reach them. Fix: add an ASO tile and link (to `/wzornik/aso/`) in `src/components/wzornik.js` the same way the identity section is linked, and a link on `/wzornik/`, then rebuild.
2. Index page `/wzornik/aso/`: good. Six tiles, each with the first three screenshots of its set, each tile styled after its app; clear "Co dostaje klient" list; CTA and footer present. No overflow at 320 to 1440 px. Minor: the hero headline is long (four lines at 1440 px, six at 320 px). Optional: shorten to "Sześć aplikacji, których nie ma" and move the rest to the lead.
3. Page template at narrow widths: Gran, Szyld and Kruszec keep a side by side thumbnail and text layout in the sequence section at 320 px, which squeezes text to a few words per line. Margines, Chochla and Bis stack and read well. Fix once in the shared template: stack below about 400 px.
4. Footers: all six pages carry "Projekt przykładowy. [Aplikacja] to zmyślona aplikacja. Projekt i wykonanie: Adrian Turbiński." with a link to `/dla-klienta/#wzornik`. No em dashes found in any page. ZIP links resolve to the published files.
5. Distinctness board (`distinct.png`): the six sets do not look like one template in six colours: panorama, tilted gradient devices, notebook doodles, comic panels, dark glass, chrome stickers. The only near overlap is the dark green lead of Gran and Szyld (see Szyld item 3). The generic phone frame and the "9:30" status bar are shared by all six, which is acceptable and expected.
6. The boards in `studio/out/aso/<brand>/boards` match the exported files (same compositions). Judgements above are based on the exported files.

## Top fixes by impact

1. Link `/wzornik/aso/` from `#wzornik` on `/dla-klienta/` and from `/wzornik/` (Definition of Done).
2. Gran Play frame 05: move the cloud off the headline in both languages.
3. Kruszec: make the chart the visible hero of frame 01 and add one tonal break later in the sequence.
4. EN copy pass: Gran "Sudetes", Chochla frame 04, Bis frame 02, Chochla App Store frame 02 line break.
5. Thumbnail contrast: heavier Margines headlines, darker Bis chrome words with sparkles off glyphs, heavier Kruszec serif and icon line; plus stack the sequence cards under 400 px in the shared page template.
