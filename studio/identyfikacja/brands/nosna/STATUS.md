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
- `yarn --cwd sites run check`: 6 errors, all in shared files that are not part of this brand (see the shared change request)
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

## Review scores

Not scored yet.
