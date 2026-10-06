# Cuvée status

## Done

- [x] Logo SVG, PNG, PDF in six variants, favicon, apple touch icon, og image
- [x] Palette (JSON, CSS tokens), fonts, contrast table (19 pairs)
- [x] Pattern (trellis), 12 wayfinding icons (sprite and files), figures
- [x] Social avatar and three posts, five mockups
- [x] Business card and letterhead PDF, e-mail signature
- [x] Logo animation MP4 and WebM (3 s, fade only)
- [x] Brand book PDF (29 pages), ZIP, manifest
- [x] Case study page with the label composer island
- [x] Validation 64 of 64, screenshots at 390 and 1440 px checked, reduced motion run

## Decisions

- Dark first page: black cover with the negative logo, ivory sheet below, one dark band for the label composer, dark closing band.
- Section titles sit in a left column with oldstyle numerals on desktop and stack on phones; text stays in one narrow column.
- Brass is only used for hairlines, dots and small caps on black; on ivory text uses dark brass (5.4:1).
- Simplified symbol (one heavy ring, heavy C, larger dot) is the favicon and the sub 48 px mark.
- Label composer: two to three grapes, shares 60/40 or 50/30/20 by order, "Na pierwsze miejsce" reorders, vintage 2020 to 2025, live text summary for assistive tech.
- Motion: only opacity, 2.4 s slow fade of the cover and 0.6 s colour transitions, all off under reduced motion.

## Shared change requests

- `yarn --cwd sites run check` fails in a fresh brand worktree with 6 errors (`Cannot find name 'process'`, `node:fs`, `node:path`, `node:os`) in `src/identyfikacja/shared/manifest.ts` and `shared.test.ts`, because `@types/node` is only installed at the repository root. It passes with the root `node_modules` of the foundation worktree linked in (done temporarily, link removed). Suggested fix: add `@types/node` to `sites/package.json`.

## Open issues

- The primary and vertical logos stop being legible below about 24 px height; minimum sizes are stated on the page and in the brand book.
- The Tile on the index page uses Georgia because the brand fonts are not loaded there.

## QA

- Screenshots at 390 and 1440 px, every slice opened; console errors none, horizontal overflow none (an overflow of 440 px at 390 from the plate images was found and fixed).
- Composer driven in the browser: adding a third grape, fourth refused, reorder, vintage change, summary and label aria text updated.
- Logo sizes sheet at 16, 24, 48 and 512 px reviewed; brand book pages 1 to 29 viewed and six layout fixes made.
- `validate.mjs` 64 of 64, `guard.mjs` 0 problems, no en or em dashes, `yarn --cwd sites run check` 0 errors, `yarn --cwd sites test` 1209 passed, `yarn --cwd sites build` ok, `yarn --cwd studio test` 8 passed.

## QA pass (quality control agent)

- Full page screenshots at 390 and 1440 px, every slice opened; widths 320, 768, 900, 1024 and 1920 checked for horizontal overflow and console errors (none after the fixes). Reduced motion run: no problems.
- Fixed: composer two column layout broke between 900 and 1100 px and overflowed the page by up to 57 px (now two columns from 1280 px, year chips in a 3 by 2 grid there); letterhead mockup left a 270 px gap in the gallery (now fills two rows); three notes sat in two columns with a hole (now three columns, aligned); colour and contrast tables were clipped at 390 px (now stacked rows with labels, nothing hidden); cover logo and top bar were 30 and 88 px off the text column (aligned); orphans in body copy (text-wrap pretty and balance, non breaking space in "0,22 em", the scale rows use a colon instead of a full stop); the index tile loads the brand fonts instead of Georgia.
- Fixed: favicon was transparent black and vanished on dark browser tabs; it now has an ivory disc (favicon.svg, favicon.ico, apple-touch-icon rebuilt). Checked as a light and dark tab and at 16, 32 and 64 px.
- Fixed: the first animation frames spread the letters past the 1080 px frame; spread reduced from 46 to 30, MP4 and WebM re-encoded (3.03 s, 1080 x 1080, 46 KB and 67 KB). Brand book rebuilt with text-wrap pretty (29 pages), ZIP and manifest rebuilt.
- Logo at 16, 24, 48 and 512 px (`logo-sizes.png`) reviewed: the simplified symbol reads at 16 px, the full symbol from 48 px, the wordmark lockups from about 24 px height as stated on the page.
- SVG: no `<text>` in any logo, favicon, icon or pattern file; every file has a viewBox; largest logo 4264 bytes. PDFs: pdffonts shows embedded subsets and no Type 3 in the brand book, the business card and the letterhead; business card 258 x 173.04 pt (91 x 61 mm, 2 pages); brand book 29 pages at 1440 x 810 pt (1920 x 1080 px); pages 6, 8, 18, 23 rendered and viewed. Videos by ffprobe: h264 and vp9, 1080 x 1080.
- Contrast: 19 pairs in brand.json recomputed by a separate script (all text pairs at least 5.37:1, the three decorative pairs 2.63, 1.55 and 3.16 are marked decoration). A second script walked every text node of the rendered page at 390 and 1440 px against its composited background: no text under 4.5:1 (3:1 for large text); the only hits are the "Aa" swatches of the decorative rows and the top bar links, which sit on the black cover.
- ZIP holds logo (SVG, PNG, PDF), favicon, apple touch icon, colour files, fonts with OFL texts, pattern, icons, print PDFs, social PNGs, e-mail signature, brand book and a README; animation, mockups and figures are on the page only, as the convention says.
- Checks: `validate.mjs` 64 of 64, `guard.mjs` 0 problems, no en or em dashes, `yarn --cwd sites run check` 0 errors, `yarn --cwd sites test` 1209 passed, `yarn --cwd studio test` 8 passed, `yarn --cwd sites build` ok.

## Shared change requests (QA)

- `Downloads.astro` and `lib/manifest.mjs` print the logo format summary as "SVG, PDF, PNG, PNG 459, 512, 917, 1024, 1834, 2048 px" and "PNG, PNG 1080 px": the format list repeats PNG and the vertical logo is sized by its long side (459 x 512). Suggested: print widths only once and say "long side" for tall variants.
- `/identyfikacja/` index requests `/fonts/schibsted-grotesk.woff2` and `/fonts/bespoke-serif-700.woff2` from the Gatsby site, which 404 in a standalone `sites/dist` preview (fine on the deployed site where Gatsby serves them).
- `yarn --cwd sites run check` needs `@types/node` in a fresh worktree (see above); QA ran with the foundation worktree `node_modules` linked at the repository root and removed the link afterwards.

## Review round 1 (scores 5, 3, 4, 5, 4, 3, 4) and repairs

Scores: style 5, craft 3, system 4, audience fit 5, readability 4, sales value 3, distinctness 4.

Craft (3), all fixed:

- The symbol read as a copyright sign (C in a double circle with a dot). It is now a C inside an arch of two thin lines (a window in the farmstead wall) with a brass sill line under the letter, not a dot, so it cannot read as a cedilla either. The simplified symbol (favicon, 16 px) is one heavy arch, a heavier C and a wide brass bar on an ivory rounded square. Every logo, PNG, PDF, favicon, ICO, apple touch icon, mockup, social post, og image, animation and brand book page was rebuilt from the new parts.
- Logo files now keep the same margin: 10 px around the primary, horizontal and vertical lockups (measured from renders), 12.5 px around the symbol. The logo variants grid pins captions to the bottom of the tile and centres the logo in the free area.
- Non breaking spaces: one filter, `sites/src/identyfikacja/cuvee/typography.ts` (single letter words a, i, o, u, w, z, abbreviations, numbers before units). The page wraps its body in `Typeset.astro`, which runs the filter over text nodes only (not tags, styles, scripts); the brand book HTML, the mockup scenes, the print HTML and the e-mail signature file run through the same function. The built page has no loose single letter word in a text node. Unit tests added.
- The label composer with three varieties stacks them one per line (no separator dot at the start of a line); with two they stay on one line. A hint "Najwyżej trzy odmiany" appears under the chips when the limit is reached.
- Brand book page 25 shows whole mockups (contain on the linen panel, the card back address is complete). Page 28 posts end on the right margin with equal gaps and no extra frame.
- Sketch 1 text now says the dot comes after the last letter, as drawn. The sizes list no longer repeats its own label in brackets.
- The business card PDF has a TrimBox of 85 x 55 mm and a BleedBox of 91 x 61 mm (set with pdf-lib after the Chromium render, fonts still CID TrueType).

Sales value (3), all fixed:

- The hero is two columns from 1000 px: the logo and the lead on the left, the label, door hanger and breakfast card mockup on the right, so the first screen at 1440 x 900 shows the system. The duplicate brass rule is gone and the slow cover fade is 1.4 s instead of 3.5 s.
- Order of sections: Zastosowania (05) and the label composer (06) now come before Kolor, Typografia, Ikony, Ton, Animacja and Pliki. The contrast table is inside a `details` with the summary "19 par, wszystkie teksty co najmniej AA".
- Mockups, the avatar and the posts are links to the full image (new tab, aria-label); posts are two columns instead of four.
- The ZIP sentence says what the ZIP holds and that the animation and mockups are separate (convention: they are not in the ZIP). Second call to action ("Zobacz ofertę dla klientów") after Zastosowania.
- The video has a poster (`figures/animation-poster.jpg`, the 2.9 s frame) and no `#t=` fragment.

Other findings: the soft shadows under mockups are now a 1 px outline (also the composer label); the brand book table of contents is a single narrow column on the right with the title on the left and page 8 carries the kerned wordmark beside the three refinement steps (distinctness from Skibka). Not changed: icon stroke 1.25 px (deliberate way finding weight), caps weights under 13 px stay at 400.

Checks after the repairs: `validate.mjs` 64 of 64, `guard.mjs` 0 problems, no en or em dashes, `yarn --cwd sites run check` 0 errors, `yarn --cwd sites test` 1265 passed, `yarn --cwd studio test` ok, `yarn --cwd sites build` ok. Screenshots at 390 and 1440 px (also reduced motion): no horizontal overflow, one h1, no broken images; the only reported request is the webm preload aborted by the browser after reading metadata. Composer driven with three varieties at 390 and 1440 px.

Shared change requests (new): `zip.mjs` or `manifest.mjs` name the ZIP group "Wszystko w jednym pliku", which is misleading because animation and mockups are not in it; the page hides that group and explains the contents itself.
