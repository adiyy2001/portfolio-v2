# Wolnobieg status

## Done

- [x] Logo SVG, PNG, PDF in six variants, favicon, apple touch icon, og image
- [x] Palette (JSON, CSS tokens), fonts, contrast table (27 pairs, all at least AA)
- [x] Pattern of truchet rings, 12 icons (sprite and files), six figures
- [x] Social avatar and three posts, five mockups (card front and back, letterhead, sign with service tag, e-mail)
- [x] Business card (91 x 61 mm with bleed) and A4 letterhead PDF, HTML e-mail signature
- [x] Logo animation MP4 and WebM, 3 s, 1080 x 1080
- [x] Brand book PDF (27 pages), ZIP, manifest
- [x] Case study page with the stripe composer island and a vitest file
- [x] Validation 64 of 64, screenshots at 390 and 1440 px (also with reduced motion) opened and checked, 0 console or request problems

## Decisions for Adrian

- Palette tuned for contrast: orange is #EC7424 so dark cocoa text on it is 4.82 to 1. Rdza #A64A0D is the orange for text on cream and Oliwka #556020 the green for text.
- The wordmark in Rammetto One stands on a slope of minus four degrees and the three stripes under it follow the same arc.
- The sign is a cog badge with concentric arc rings, read as a freewheel. The favicon and sizes below 48 px use a simplified two ring version.
- The pattern is a checkerboard of truchet rings, not stripes, so it stays calm behind text.
- The clear space unit in the figure is the cap height of the W (119 units at size 150).
- The wear texture (feTurbulence grain) is screen only. Print PDFs are flat, with no filters or blend modes, and embed CID TrueType fonts.
- The icon sprite is written without svgo, because svgo drops unused symbols and leaves an empty file.
- The CTA title uses "Twój biznes" because the shared test style forbids the phrase "twoja firma".

- Distinctness rebuild: the page and the brand book were redone because they read as the Skibka template in other colours. The page is now arched bands with stripe edges, ring numbered sections, a sticky pill navigation, coin values and leaf panels; the brand book has seven tones, an L shaped ribbon frame, ring page numbers and a full bleed pattern page. Rechecked: validate 64 of 64, guard 0 problems, screens at 390 and 1440 px (also reduced motion) with no overflow, console or request problems, 27 pages, `pdffonts` embedded CID TrueType only, check, test and build green.

## Shared change requests

- Resolved: `@types/node` is now in `sites/package.json` on `wzornik-identyfikacja` (the Skibka QA step added it); this branch merged it and `yarn --cwd sites run check` is at 0 errors.
- The shared manifest summary writes "PNG, PNG 1080 px" for groups whose files are all PNG (social media group). `summarize` in `studio/identyfikacja/lib/manifest.mjs` should list the format once.
- The Skibka icon sprite (`icons/skibka-icons.svg`) is empty because svgo drops unused symbols; the shared `optimizeSvg` could keep symbols. Wolnobieg writes its sprite without svgo.

## Open issues

- The primary and vertical logos are not legible below about 24 px height; the page and the brand book state the minimum (140 px width for the primary logo, 48 px for the full badge) and the simplified two ring sygnet is the 16 px mark and the favicon.
- Published size is 7.8 MB, ZIP 3.1 MB.

## QA (phase 4, B6)

Checked in this worktree, fixed and rechecked:

- Screenshots at 390 and 1440 px (19 and 15 slices) and a reduced motion run, every slice opened. Console errors, failed requests, broken images, horizontal overflow: none. One h1.
- Logo at 16, 24, 48 and 512 px for every variant (size sheet) and the favicon enlarged from 16, 24 and 48 px SVG renders; the sygnet reads as a gear with a ring at 16 px. The head carries the SVG, ICO and apple touch icon links (a real browser tab cannot be captured headless).
- SVG: no `<text>`, valid `viewBox` on all six logos and the favicon, logos 1.9 to 8.1 KB, favicon 1.2 KB.
- PDF: brand book 27 pages of 1920 x 1080 px (1440 x 810 pt), fonts embedded as CID TrueType, no Type 3; business card 258 x 173.04 pt = 91 x 61 mm on 2 pages; letterhead A4; all 27 brand book pages rendered to PNG and viewed on contact sheets, pages 1, 3, 25 and 26 at higher resolution, both card pages and the letterhead at full size.
- Video: MP4 H.264 and WebM VP9, 1080 x 1080, 3.03 s, 233 KB and 365 KB.
- ZIP: contents match the "Co dostaje klient" list (logo SVG, PNG and PDF, favicons, colours, fonts and licences, pattern, icons, print, social, e-mail, brand book README).
- Contrast: the 27 pairs of `brand.json` recomputed by an independent script, every text pair at least AA. A DOM scan of the rendered page at 390 and 1440 px found only the four decorative "Aa" samples in the contrast table, which the table marks as decoration or interface elements.
- `validate.mjs` 64 of 64, `guard.mjs` 0 problems, no en or em dashes, `yarn --cwd sites run check` 0 errors, `yarn --cwd sites test` 1203 passed, `yarn --cwd sites build` ok, `yarn --cwd studio test` ok. `yarn lint` at the repo root and the Gatsby build were not run here (nothing in `src/` changed).

Defects found and fixed:

- Hero: the stripes ended in a hard vertical cut 130 px before the viewport edge; they now run off the right edge.
- Value cards: "Naprawiamy, nie wymieniamy" broke into three lines with one word alone; headings are balanced, card padding is smaller and headings have a looser line height (also fixes descenders touching on a phone).
- Logo variants: logos were glued to the top of their tiles; they are centred in the free area.
- Typography: "Rammetto One" wrapped to two lines and the glyph line left four symbols alone on a second line; both are sized and balanced to fit.
- Colour and contrast tables were clipped on a phone (OKLCH, CMYK and the contrast columns cut off); below 640 px they are labelled lists.
- Animation card left half the card empty; the video now sits beside the text and a facts list (time, formats, size, use). Download groups got a chevron that shows they open. The keywords stack on a phone.
- Stripe composer: the stripes sat in the upper half of the stage; they are centred for every count and curvature.
- Brand book cover: the lead text touched the arcs and the wordmark ran into them; the arcs are smaller and the wordmark 130 px, so the old open issue is closed. Mock-up pages centre their images; the shop sign page images are larger.
- Shop sign mock-up: "Warsztat czynny" overflowed the arch; smaller and lower, now inside the yellow glass (mock-up, brand book and ZIP rebuilt).

## Review scores

Not scored yet.

## Review round 1 repairs

Scores before: craft 3, legibility and accessibility 3, sales value 3, coherence 4, fidelity 5, fit 5, distinctness 5. Fixed:

- Case study CTA: the ring no longer covers the paragraph; at 1100 px and up the text column is capped at the width left of the ring (checked at 1100, 1440 and 1920 px).
- Brand book: footer moved right of the ribbon curve (no clipped "W"); h3 line height 1.25 with balanced wrapping (also on the page); contrast table now lists all 27 pairs over two pages (28 pages in total, contents page numbers updated); half empty pages filled with larger type and bigger figures; the pattern page is one overscanned SVG so no tile seams show in the PDF; the pattern page chip and page number got their colours.
- Icon captions use real Polish labels (dętka, koło, zębatka) on the page and the brand book.
- Test czytelności: two bottom aligned rows (simplified sygnet 16, 24, 48 px and full badge 48, 96, 192 px), kerning and test panels are full width, kerning comparison larger with the changed pairs (Wo, eg) outlined.
- Rule bullets are 16 px rings with row gap so they no longer touch.
- Tone cards on sand: heading colour is brown, no rdza on piasek at small size.
- Pattern tile: internal joins overlap by 1.5 units.
- Logo animation: the badge now rolls in and shrinks into its place in the vertical lockup, the stripes of the roll are drawn off behind it and the wordmark, stripes and tagline fade in below; the sign is never cross-dissolved. Frames at 1.7 to 2.2 s checked in MP4 and WebM.
- clearspace.svg shows the X as four filled squares with an X glyph path on every side.
- Vertical logo tagline raised from 21 to 34 units; the minimum size note for the vertical logo is on the page and in the brand book.
- Business card PDF: TrimBox 85 x 55 mm, BleedBox and CropBox 91 x 61 mm (pdf-lib after printing).
- The page no longer says everything is in the ZIP: it states that animation and mockups are downloaded from the list (same wording as Nosna). The ZIP convention (no animation, no mockups) is unchanged.
- README plural forms: small fix in the shared `studio/identyfikacja/scripts/zip.mjs` (plik, pliki, plików); other brands pick it up on their next ZIP build.

Not done: thicker icons (optional, not blocking).

Checks: `validate.mjs` 64 of 64, `guard.mjs` 0 problems, no en or em dashes, `yarn --cwd sites run check` 0 errors, `yarn --cwd sites test` 1260 passed, `yarn --cwd sites build` 185 pages, `yarn --cwd studio test` ok, `screens.mjs` 0 problems at 390 and 1440 px.

## Review round 2 repairs

Scores before: craft 3, legibility and accessibility 3, fidelity 4, coherence 4, sales value 4, distinctness 4, fit 5. Fixed:

- Diacritic collisions: line height raised to 1.15 to 1.32 on every Rammetto display heading (page headings, hero, CTA, keywords, pills, brand book titles, cover, TOC, social post headlines).
- Brand book: the 10th TOC pill ends at about y 830 of 1080, clear of the frame and footer; cards on pages 8, 11 and 12 end well above the footer; page 27 mockups fit the content margins (page 26 shortened too); page 6 has a small corner ring away from the page number and larger type, so the lower third is fuller; palette page and contrast tables use 20 to 24 px type (pages 14 to 16) and the palette lead is one line.
- Icons redrawn: dętka (tube ring with a valve stem), dzwonek (side view bell with a lever on a handlebar tube and sound marks), zębatka (trapezoid teeth from the same `cogPath` as the sign).
- Page: palette grid is five columns so names do not touch; social grid has equal gaps and the third post stays inside the content edge (borders instead of outer shadows); the files card is full width; the CTA ring holds the badge, the CTA text column was widened.
- Accessibility: focus outline is cream on the dark top bar, footer, brown and olive bands and the skip link (checked with Tab); contrast table sits in a closed details element.
- Sales: "Zobacz ofertę" pill in the sticky nav (short "Oferta" on a phone); video has a poster (`figures/animation-poster.jpg`, made by `build-assets.mjs` with ffmpeg from the MP4 when it exists) and the `#t` fragment is gone; the composer preview stretches to the control panel height.
- Fidelity: a light worn print texture on every band (speckles in cream on colour, brown on cream and mustard), the composer wear filter is now soft streaks (about 10 percent loss) instead of dotted noise.
- Coherence: the layout rule now says three colours in the logo and up to five in graphics, matching the composer presets; the index tile is orange with the badge so it holds its own next to the other five.
- ZIP: README line "Jako favicon użyj pliku favicon.svg, a nie pełnego sygnetu" (small change in the shared `studio/identyfikacja/scripts/zip.mjs`, other brands pick it up on their next ZIP build).

Not done: the simplified sign on a browser tab mockup, ZIP with mockups and animation (convention says no, the page states it), regenerated index boards (shared).

Known and harmless: `screens.mjs` reports one `net::ERR_ABORTED` for the WebM, the browser cancels the first range request of the video after reading the metadata; the video loads (readyState 4).

Checks: `validate.mjs` 64 of 64, `guard.mjs` 0 problems, no en or em dashes, `yarn --cwd sites run check` 0 errors, `yarn --cwd sites test` 1260 passed, `yarn --cwd sites build` 185 pages, `yarn --cwd studio test` ok, `screens.mjs` no console errors, no overflow, one h1 at 390 and 1440 px, brand book 28 pages.
