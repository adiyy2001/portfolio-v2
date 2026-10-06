# Nosna status

## Done

- [x] Strategy, three logo directions with rejected sketches, kerning and size test
- [x] Generative field (day, stage, tempo to colour, shape, thread count and cycles), 12 grid fields, standalone SVG under 10 KB without text
- [x] Logo SVG, PNG, PDF in six variants, favicon, apple touch icon, og image
- [x] Palette (JSON, CSS tokens), fonts, contrast table (WCAG)
- [x] Pattern, 12 icons (sprite and files), figures, layout rules, photo style, tone rules
- [x] Social avatar and three posts, five mockups (card front and back, letterhead, festival pass with day posters, e-mail signature)
- [x] Business card and letterhead PDF, e-mail signature HTML
- [x] Logo animation MP4 and WebM
- [x] Brand book PDF (28 pages), ZIP (3.9 MB), manifest
- [x] Case study page in a festival programme layout (three day sections) with the Preact generator island, tile on the index
- [x] Studio validation 64 of 64
- [x] Screenshots at 390 and 1440 px, with and without reduced motion, every slice opened and checked
- [x] Dash and comment guard: 0 problems

## Checks

- `yarn --cwd sites test`: 116 files, 1203 tests pass
- `yarn --cwd sites build`: 181 pages
- Prettier over `sites/`: clean
- `yarn --cwd sites run check`: 6 errors, all in shared files that are not part of this brand (see the shared change request); unchanged after QA
- Generator exercised in the browser: day, stage and tempo controls, random button, SVG download (no text element), no console errors

## Decisions for Adrian

- Nosna is style I6 (generative dynamic identity). The constant part is the wordmark (Syne 800), the carrier line and the receiver ring. Everything else is generated from day, stage and tempo.
- Day colours: red-orange for Friday, teal for Saturday, magenta for Sunday. On the bone background they are decoration only (2.84, 2.11 and 2.78 to 1). Text uses the dark variants, which pass AA.
- The page is organised as a festival programme (three day bands), not as B1's layout.
- Contact data is made up: Marta Kolasa, program@nosna.example, +48 42 000 00 07.
- The business card is 85 x 55 mm trim, PDF 91 x 61 mm with 3 mm bleed.
- The letterhead keeps its lower half empty on purpose, so the text starts high and the carrier line stays the only graphic.
- Reduced motion: the generator drift button is disabled, the video does not autoplay and starts at its last frame.

## Shared change requests

- `sites/package.json`: add `@types/node` to `devDependencies` (and let the lockfile follow). `astro check` reports 6 errors (`process`, `node:fs`, `node:path`, `node:os` not found) in `sites/src/identyfikacja/shared/manifest.ts` and `shared.test.ts`. They exist on every branch, none comes from this brand.
- `studio/identyfikacja/scripts/logo-test.mjs` (shared): the logo test sheet layout is messy for a brand whose logo is wide; it passes but is hard to read.

## Open issues

- The akcent direction figure (`figures/direction-akcent.svg`) is a small tilde over the word and reads weakly at thumbnail size. Worth a second look in review.
- `word-data.json` formatting differs from the build-logos output (prettier reflows it); the data is identical.
- In the 390 px view the contrast and colour tables scroll horizontally inside their wrapper by design.
- The index page, served at the root by the screenshot server, requests its own fonts from `/fonts/` and gets 404. That is the shared index page, not this brand.

## Quality control (phase 4)

Checked and fixed on branch wzornik-identyfikacja-b2.

- Page screenshots at 390 and 1440 px, every slice opened. Fixed: the three coloured keywords sat on the bone background at 2.1 to 2.8 to 1 and now sit on an ink block (5.5 to 7.3 to 1); the size ladder (16 to 192 px) is baseline aligned with one line labels; no more "BPM", "mm" and "px" widows (non breaking spaces); the gallery fills its grid without a ragged bottom edge; the social avatar is top aligned; at 390 px the colour and contrast tables become stacked cards instead of scrolling sideways; the intro of the download list no longer claims the ZIP holds mockups and videos (it does not).
- Brand book: pages were top heavy with large empty lower halves. Body sizes raised, cards and tiles fill the page, numerals on the strategy cards, photo style page got a facts column, mockups keep their ratio. Still 28 pages, 1920 x 1080 px, 1.8 MB.
- Contrast: 25 declared pairs recomputed with an independent WCAG script, all pass (decorative pairs listed as such). A computed style audit of every text node on the page at 390 and 1440 px found only the four "Aa" samples of the decoration rows, which are decoration by definition. Brand book numerals on the strategy cards are decoration (bone grey).
- Logo at 16, 24, 48 and 512 px viewed (logo-sizes.png), the lens symbol favicon is legible at 16 px; favicon links (svg, ico, apple touch) are present and answer 200. A real browser tab was not rendered (headless).
- SVG: no text elements, logo files 1.7 to 4.3 KB, favicon 387 B. PDFs: pdffonts shows embedded CID TrueType, no Type 3; business card 258 x 173 pt (91 x 61 mm, 2 pages), letterhead A4, brand book 28 pages, pages rendered and viewed (all 28 as a contact sheet plus three at full size). Videos: MP4 h264 and WebM vp9, 1080 x 1080, 3.03 s, 0.5 and 0.6 MB; frames viewed. ZIP lists 78 files and matches the manifest, 3.9 MB.
- Page console: no errors, no failed requests, one h1, no horizontal overflow, with and without reduced motion.
- Commands: studio validate 64 of 64, `yarn --cwd sites test` 116 files and 1203 tests pass, `yarn --cwd sites build` 181 pages, `yarn --cwd studio test` pass, guard 0 problems. `yarn --cwd sites run check` still reports the 6 shared `@types/node` errors (see the shared change request), none from this brand.

Shared change requests found in QA (not touched here):

- `studio/identyfikacja/scripts/zip.mjs`: the README in the ZIP says "2 plików", "3 plików", "4 plików" and "1 plików". Use the same Polish plural as `filesLabel` in `sites/src/identyfikacja/shared/format.ts`.
- `studio/identyfikacja/lib/manifest.mjs` (`summarize`): formats read "PNG, PNG 335, 512 px" and "PNG, PNG 1080 px" with PNG twice. Drop `png` from the plain format list when the widths part is added.
- `studio/identyfikacja/scripts/logo-test.mjs`: the test sheet is hard to read for wide logos (already noted above).

## Review scores

Not scored yet.

## Review round 1 repairs

Scores before: distinctness 3, craft 4, system 4, accessibility 4, sales 4, style 5, fit 5. All findings were worked on the branch wzornik-identyfikacja-b2.

- Distinctness. The brand book is rebuilt as a three day programme: the contents page is three columns (Piątek, Sobota, Niedziela with times in Martian Mono), page grounds follow the day (cinnabar, teal, magenta, bone and ink), the carrier line in every header carries a ring that moves with the page number, the three card rows are gone (numbered rows, a three stop carrier timeline and parameter rows instead) and four pages are full bleed (main mark, twelve fields, interference pattern, posters). The case study hero is rebuilt around the live field: the hero band takes the colour of the selected day, the field sits in a stage on it with the controls beside, the wordmark sits under the field and the three days are the navigation. The index tile is on bone with the Friday mark and a three day strip.
- Craft. One set of minimum sizes (main logo 120 px and 32 mm, horizontal 96 px and 30 mm, symbol 48 px and 12 mm, site icon 16 px) drawn at 1:1 with dimension bars on the page and on brand book page 15. Brand book text is 22 px and up and the pages are filled. The stretch example shows a real stretched mark. The size ladder is a uniform tile grid, grid captions are 13 px.
- System. Posters and social posts keep the receiver ring visible, and posters and posts now use day colour grounds with an ink field (or day thread on ink), written as layout rules. The site icon lens is shown as an official variant on the page and in the brand book. Friday no longer breaks the rule that colour carries the day.
- Accessibility. Tempo slider 28 px, download links and grid links at least 24 px, collapsed colour and contrast tables (details, closed by default), the nosna download list has its own formats label without the doubled PNG.
- Sales. Hero shows a live coloured mark and controls in the first 1440 x 900 screen, a "Co dostaniesz" line with counts from the manifest, the posters and badge mockup moved to row 03 right after the direction.
- Checks: studio validate 64 of 64, `yarn --cwd sites run check` 0 errors, `yarn --cwd sites test` 120 files and 1260 tests pass, `yarn --cwd sites build` 185 pages, guard 0 problems, screens at 390 and 1440 px with and without reduced motion without problems, 28 brand book pages viewed.

Not done, because the files are shared (change requests for the merging agent):

- `studio/identyfikacja/scripts/zip.mjs`: README says "1 plików", "2 plików"; use the Polish plural of `filesLabel`.
- `studio/identyfikacja/lib/manifest.mjs` (`summarize`): formats read "PNG, PNG 335 px"; the Nośna page works around it with its own `Downloads.astro`, other brands still show it.
- `convention.mjs` `zipExcludes`: the ZIP holds no MP4, WebM or mockups (the page says so). A second "Pokaz" ZIP would need a shared change.
- The index page requests `/fonts/schibsted-grotesk.woff2`, `/fonts/bespoke-serif-700.woff2` and `/favicon.svg` and gets 404 under the `/wzornik` base (shared index).
- A day colour on bone (Saturday teal at 2.1:1) stays decoration; the layout rules now say so instead of adding a darker thread colour.

## Review round 2 repairs

Scores before: style 3, sales 3, craft 4, system 4, accessibility 4, distinctness 5, fit 5.

- Generator hydration (the cause of both 3s). The round 1 rule `astro-island,.gen{display:contents}` gave the island no box, so `client:visible` never fired. The generator is now `client:load`, and `nosna.test.ts` guards that. Checked in a real Chromium run against the built site: the `ssr` attribute is gone, Sobota plus Tkalnia plus 150 BPM changes the `role=status` caption to "Sobota, Tkalnia, 150 BPM, ziarno 0xA167275D", Pobierz SVG downloads `nosna-sobota-tkalnia-150bpm.svg`, Losuj changes the seed, Poruszaj fazą toggles to "Zatrzymaj ruch", and with `prefers-reduced-motion` the motion buttons are disabled. No console errors.
- Animation on the page. Next to the MP4 and WebM, the generator has a "Trzy dni, 3 s" button that plays piątek, sobota, niedziela over three seconds on the live SVG field and the hero ground; disabled under reduced motion.
- Brand book. Page 6: each ring is bound to its word (no orphan ring). Page 7: the chosen direction thumbnail has padding and no longer cuts the wordmark. Page 14: the corrected wordmark is drawn over an outline of the old spacing and the pair values are printed (No -6, oś +4, śn -2, na -4 thousandths of an em). Page 22 and the page icon captions: głośnik, słuchawki, wejście. Page 27: the mockup is contained instead of cropped, so the baked caption and the left poster are whole. Page 28: shows the last frame of the animation (taken from the MP4 with ffmpeg at build time) instead of the e-mail mockup.
- Page. Download group formats read "PNG 512, 1024, 2048 px, dłuższy bok" (own `Downloads.astro`), download summaries have a +/- marker, top navigation links are 28 px tall, the "Co dostaniesz" rule spans the grid, the layout rule on shadows now says shadows exist only under objects in mockups (the rule and the mockups agree), the action buttons sit in a two column grid so the first screen keeps the three day navigation visible at 1440 x 900.
- Checks: studio validate 64 of 64, guard 0 problems, `yarn --cwd sites run check` 0 errors, `yarn --cwd sites test` 1262 tests pass, `yarn --cwd sites build` 185 pages, screens at 390 and 1440 px 0 problems, brand book pages 6, 7, 14, 22, 27, 28 viewed.

Still open and shared (change requests for the merging agent, unchanged): the ZIP README plural in `scripts/zip.mjs`, the doubled PNG in `lib/manifest.mjs` `summarize`, no MP4, WebM and mockups in the ZIP (`convention.mjs` `zipExcludes`), the 404 for `/fonts/schibsted-grotesk.woff2`, `/fonts/bespoke-serif-700.woff2` and `/favicon.svg` on the index page under `/wzornik`. Not done on purpose: moving the cinnabar hero away from the Wolnobieg orange (they are not shown side by side).
