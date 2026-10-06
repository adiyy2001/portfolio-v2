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
