# Independent review: ASO screenshot sets (6 brands)

Reviewer date: 2026-10-08. Judged only on the brief (BRIEF.md), the exported files, boards, thumbnails, the validator output and the built pages in `public/wzornik/aso/` served locally and viewed in Chromium at 320, 390, 768, 1024 and 1440 px, with the PL/EN and App Store/Google Play switches exercised.

Scale: 5 excellent, 4 good with minor issues, 3 acceptable with a visible defect, 2 weak, 1 failing.

## Scores

| Criterion | Grań (S1) | Szyld (S2) | Margines (S3) | Chochla (S4) | Kruszec (S5) | Bis (S6) |
|---|---|---|---|---|---|---|
| 1. Thumbnail legibility | 5 | 4 | 4 | 4 | 4 | 3 |
| 2. Benefit clarity in first 3 | 5 | 4 | 4 | 5 | 5 | 4 |
| 3. Story of the whole sequence | 5 | 5 | 5 | 5 | 5 | 5 |
| 4. Fidelity to the assigned style | 5 | 5 | 5 | 5 | 5 | 5 |
| 5. UI quality | 4 | 4 | 5 | 5 | 4 | 5 |
| 6. Spec compliance | 5 | 5 | 5 | 5 | 5 | 4 |
| 7. EN version quality | 5 | 4 | 5 | 5 | 4 | 4 |
| 8. Sales value of the page | 4 | 5 | 5 | 4 | 5 | 4 |
| 9. Distinctness from the other five | 5 | 4 | 4 | 5 | 4 | 4 |
| Average | 4.8 | 4.4 | 4.7 | 4.8 | 4.6 | 4.2 |

One score is below 4: Bis, thumbnail legibility (3).

## What was verified numerically

- Validator: `node scripts/validate.mjs <brand>` reports 0 errors for all six brands (38 files each, 50 for Kruszec with the iPad set).
- Independent check with PIL over every export:
  - App Store: 12 files per brand (6 PL, 6 EN), 1320×2868, RGB, no alpha.
  - Google Play phone: 12 files per brand, 1080×1920, RGB, no alpha, largest file well under 8 MB.
  - Feature graphic: PL and EN at 1024×500, RGB.
  - App Store icon: 1024×1024 RGB with no alpha and a full square (corner pixel is opaque brand colour).
  - Play icon: 512×512 RGBA with alpha fully opaque (min 255), 19 to 104 KB.
  - Variant B: 4 files per brand. Kruszec iPad: 12 files at 2064×2752.
  - Szyld, Kruszec and Bis ship JPEG (allowed); the others ship PNG.
- ZIPs: one per brand, folders by store and language (`app-store/pl`, `app-store/en`, `google-play/pl`, `google-play/en`, `variant-b`, `feature-graphic`, `icons`, `teksty`) plus the headline CSV. Kruszec adds `ipad/pl` and `ipad/en`.
- Headline length: every PL and EN headline is 6 words or fewer.
- No U+2014 or U+2013 in any text JSON, CSV or manifest.
- No ratings, stars, awards, download counts, press quotes, real brands or real artists found. Finance figures are labelled "Dane przykładowe" / "Sample data".
- Grań panorama seams: the edge columns of neighbouring frames were compared. The mean colour difference across each cut (0.3 to 3.3) matches the difference between two adjacent columns inside one frame (0.1 to 2.5), so the cuts are pixel continuous in both stores and both languages. The page's "Połącz kadry w panoramę" view confirms it visually.
- Pages: no horizontal scroll at any width (scrollWidth equals clientWidth everywhere), no console errors, no failed requests, no broken images, every ZIP link resolves. The PL/EN switch swaps every frame to the `-en-` files, and the store switch swaps to the `play-` files.

## Grań (S1, panorama, Sudety trails)

Strongest set. The panorama is real, the trail runs frame to frame, and the first three tell the whole product: trail times, offline map, back before dark.

- **UI quality 4**
  - App Store frame 05 (PL and EN): the cloud bank covers the bottom half of the "Na grani" phone, including the forecast card. Fix: move the cloud below the phone's lower edge or behind the device.
  - Google Play frame 05: the phone is cut by the hill at roughly 40 percent of its height, so the screen has no bottom. Fix: raise the phone or lower the hill line in the Play composition.
  - Google Play frame 02: the forest covers the tab bar of the offline maps screen, and only "Map" is partly visible. Fix: lift the screen by about 60 px.
  - Frame 04: the landscape phone on a grey plinth reads as a stand, not as landscape. Fix: seat it on a rock ledge drawn in the same flat style as the rest.
- **Page sales value 4**
  - Hero meta row: "Kategoria: Nawigacja, Mapy i nawigacja" repeats a word. Fix: "Nawigacja" or "Mapy i nawigacja".
  - Icon section: the icon's cream sky is the page background colour, so the top edge of the "Po masce na iPhonie" preview disappears. Fix: give the icon previews an outline or a darker plate.

## Szyld (S2, bold gradients, local shops pickup)

Very energetic, with a non-obvious bottle-green/grapefruit/lime palette, visible grain and type bigger than the phones. The page is excellent.

- **Thumbnail legibility 4**
  - Frame 03 is one of the three visible in search, and its headline is set vertically. At about 120 px it needs a head tilt and is read last.
  - The negative tracking in Mona Sans Wide nearly closes the word spaces in thumbnails ("odbioru,jaka", "zakupy w ręku").
  - Fix: keep frame 03 horizontal, or swap it with frame 04 so the vertical one sits outside the first three, and loosen word spacing by about 0.1em.
- **Benefit clarity 4**: the same vertical frame 03 slows the third benefit. Fix as above.
- **UI quality 4**
  - Frame 04: the screen title is cropped to "dzina odbioru" / "kup time" by the frame edge, so the hero screen reads as broken.
  - Frame 01: the pickup times are cut to "17:3".
  - Frame 05: the code card hides the shop note, which reads "Please slice the loaf, r...".
  - Fix: shift these phones about 40 px inward so titles and key numbers stay inside the frame. Let only decorative parts of the device leave it.
- **EN quality 4**
  - Variant B headline "They set it aside for you" has an unclear subject. Fix: "Shops hold it for you", or "Held at the counter till 7 pm".
  - "Order local, collect on your way" is good.
- **Distinctness 4**: see cross-cutting note on the shared frame 01/02/03 rhythm.

## Margines (S3, doodle annotations, flashcards)

Every annotation points at a real UI element. The EN set is rebuilt for an English speaker learning Polish, which is excellent localisation.

- **Thumbnail legibility 4**: Caveat at 120 px has thin strokes, and PL frames 01 and 03 run to three lines. Fix: use Caveat 700 for headlines and shorten frame 01, for example "Słówka razem ze zdaniem".
- **Benefit clarity 4**: frame 01 "Słówka zapamiętane razem ze zdaniem" / "Words that keep their sentence" never says flashcards or language learning. A searcher learns the category only at frame 02. Fix: make frame 01 name the category, for example "Fiszki, które pamiętają zdanie" / "Flashcards that keep the sentence".
- Minor, not scored down:
  - Frame 05: the pencil bar chart beside the phone is the only doodle that does not point at anything.
  - Play EN frame 01: the red circle crosses the first letter of the sentence.
- **Distinctness 4**: shared rhythm, see cross-cutting.

## Chochla (S4, Memphis pop-art, meal planning)

Most distinct set: comic panels, speech-bubble headlines and characters built from shapes. The interface stays uncovered.

- **Thumbnail legibility 4**
  - Speech-bubble headlines use only about 60 percent of the frame width, so at thumbnail size they are smaller than in the other sets.
  - Play PL frame 02 "LISTA ZAKUPÓW PISZE SIĘ SAMA" is the smallest of all.
  - App Store PL frame 02 stacks one word per line in four lines.
  - Fix: widen the bubbles to about 85 percent of the frame and raise the cap size by about 15 percent.
- PL copy note under criterion 2, not scored down: "Obiady na cały tydzień zaplanowane" has unnatural word order. Fix: "Obiady zaplanowane na cały tydzień" or "Cały tydzień obiadów z głowy".
- **Page sales value 4**: at 320 px in section 03 (Sekwencja):
  - The flag "WIDAĆ W WYNIKACH WYSZUKIWANIA" overflows its box by 21 px and is clipped.
  - The headlines "ZAPLANOWANE" and "Z MINUTNIKIEM" touch or cross the card border.
  - Body text runs one or two words per line.
  - Fix: below 360 px stack the thumbnail above the text in the sequence cards, and let the flag wrap or shorten it to "W WYNIKACH".

## Kruszec (S5, dark glass premium, budget and investing)

Restrained and credible. The chart is the hero, there are no return promises, and every figure is labelled as sample data. The EN rewrite (ISA, gilts, pounds) is native.

- **Thumbnail legibility 4**: light condensed serif on navy, with the dark device screens nearly merging into the background at 120 px. Frame 02's headline sits at the bottom. Fix: one weight heavier for the roman part of the headline, and a slightly lighter glass edge on devices.
- **UI quality 4**
  - Frame 05, PL and EN, both stores: the glass "Wkład własny 60 000 zł" / "House deposit £20,000" card sits on top of the tab bar, and the Budget/Goals icons ghost through it.
  - Frame 05: a stray slider knob floats outside the phone on the right.
  - Frame 05: the bottom third of the frame is empty.
  - Fix: lift the card above the tab bar, remove the slider, and move the composition down.
  - iPad frame 06 puts an iPhone in front of the iPad. For an iPad screenshot set this is off-spec in spirit. Fix: show the iPad only.
- **EN quality 4**
  - "Keep your portfolio on plan" is not idiomatic. Fix: "Keep your portfolio on track".
  - Variant B "Budget and investments in one place" is the generic "in one place" claim the brief warns against. Fix: a concrete promise, for example "See spending and savings side by side".
- **Distinctness 4**: shared rhythm, see cross-cutting.

## Bis (S6, Y2K holographic chrome, music and gigs)

Style fidelity is high: chrome letters, sparkles, stickers, invented artists and shape covers. The problem is that the chrome effect lands on the most important word of each headline.

- **Thumbnail legibility 3** (only score below 4)
  - At 120 to 200 px the chrome words become a pale, low-contrast blur. In the first three these are "Koncerty" (frame 01, the category word), "Przypomnimy" (frame 03), "tuż obok" (frame 02), and in EN "Gigs", "Heads-up" and "Fresh sounds".
  - The page itself admits that chrome loses legibility in small sizes.
  - Fix: in frames 01 to 03 chrome only a secondary word and keep the noun or verb in solid ink, or give the chrome fill a much darker lower band with a 2 px inner dark stroke so it holds at 120 px.
- **Benefit clarity 4**
  - The frame 01 key word is the hardest to read (see above).
  - Frame 02 "Świeże brzmienia grają tuż obok" / "Fresh sounds playing near you" is vague about what the app does.
  - Fix: "Nowi wykonawcy grają w twojej okolicy" / "New acts playing near you this week".
- **Spec compliance 4**
  - Feature graphic, PL and EN: the "Bis" logotype starts at x=67 of 512 (scaled), outside the central 80 percent safe area (x 102 to 922 at full size). It can be cropped.
  - Feature graphic: the tagline is small, and its chrome first word is unreadable at 1024×500.
  - Fix: move the logo right by about 40 px and set the tagline in ink only.
- **EN quality 4**
  - "Fresh sounds playing near you" is marketing filler.
  - PL frame 04 ends a line on "ze" ("Zobacz, kto ze / znajomych idzie"). Fix: rebreak as "Zobacz, kto / ze znajomych idzie".
- **Page sales value 4**: at 768 px in section 03 (Setlista), card 5's heading "Cały miesiąc grania w kalendarzu" overflows the card by 18 px, and "kalendarzu" is clipped. Fix: allow wrapping with `min-width: 0` on the text column, or reduce the heading size at that breakpoint.
- **Distinctness 4**: shared rhythm, see cross-cutting.

## Cross-cutting issues

1. **Shared composition skeleton across five sets (distinctness).**
   - Seen side by side (`distinct.png`), Grań, Szyld, Margines, Kruszec and Bis all use the same first-three rhythm:
     - frame 01: headline top-left, phone lower centre
     - frame 02: phone high, headline at the bottom-left
     - frame 03: headline top, tilted phone plus one floating element
   - Only Chochla breaks it.
   - The styles themselves are clearly different, so no set looks like a recolour. The repeated rhythm is still exactly what "Czego unikać: tego samego szkieletu kompozycji w 6 realizacjach" warns about.
   - Fix: change the frame 02 layout in two or three sets, for example:
     - Kruszec frame 02 as a full-bleed glass card with no phone
     - Margines frame 02 with the headline written as a margin note beside the phone
     - Bis frame 02 with the headline in the middle and stickers above and below
2. **Hydration of the PL/EN switch.**
   - The switch island hydrates on visibility (`client:visible`).
   - When a click itself scrolls the switch into view, the first click is lost (reproduced on all six pages). It works on the second click and after normal scrolling.
   - Fix: hydrate on load or idle.
3. **Index page (`/wzornik/aso/`).**
   - Clean at all five widths: six tiles, each with the first three screenshots in its own style, a "Co dostaje klient" summary, a CTA and a footer.
   - Grań's tile shows the three frames joined, which sells the panorama well.
   - Minor: the index footer uses a plural wording instead of the per-app footer pattern. That is acceptable for a multi-app page.
4. **Search-result mock-ups.** The Google Play mock-up shows three portrait screenshots under the listing, which Play rarely shows in phone search results. Consider showing the feature graphic or one screenshot strip so the mock-up is credible to a client who knows Play.
5. **Templates and requirements met everywhere.**
   - All ten case-study sections are present on every page: hero strip, brief, direction, sequence story, neutral search mock-up, PL/EN switch, A/B with hypothesis, feature graphic and icons, file list with dimensions and ZIP, CTA and footer.
   - The footer reads "Projekt przykładowy. [App] to zmyślona aplikacja. Projekt i wykonanie: Adrian Turbiński." with a link.
   - The "new language is one new file" argument is shown with both JSON files.

## Fixes ranked by score impact

1. Bis: take the chrome off the key word in frames 01 to 03, or make the chrome hold at 120 px. Raises Bis thumbnail legibility from 3 and benefit clarity from 4.
2. Break the shared frame 01/02/03 rhythm in at least two of Szyld, Margines, Kruszec and Bis. Raises distinctness for four brands.
3. Fix the responsive clipping: Chochla sequence cards at 320 px and Bis card 5 at 768 px. Raises both page scores to 5.
4. Szyld: move the vertical headline out of the first three and keep phone titles inside the frame. Raises legibility, clarity and UI.
5. Kruszec frame 05 and Grań frame 05 overlaps (glass card on the tab bar, cloud over the UI), plus the Bis feature graphic safe area and the EN copy tweaks ("on track", Szyld variant B, Bis frame 02). Raises UI, spec and EN scores.
