# Skibka status

## Done

- [x] Logo SVG, PNG, PDF in six variants, favicon, apple touch icon, og image
- [x] Palette (JSON, CSS tokens), fonts, contrast table
- [x] Pattern, 12 icons (sprite and files), figures
- [x] Social avatar and three posts, five mockups
- [x] Business card and letterhead PDF, e-mail signature
- [x] Logo animation MP4 and WebM
- [x] Brand book PDF (27 pages), ZIP, manifest
- [x] Case study page with the stamp press island
- [x] Validation 64 of 64, screenshots at 390 and 1440 px checked

## Decisions

See "Decisions for Adrian" 14 to 19 in `PLAN.md`.

## Shared change requests

- `sites/package.json` and `sites/yarn.lock`: `yarn --cwd sites run check` failed with 6 errors (`Cannot find name 'process'` and `node:fs`, `node:path`, `node:os`) in the shared `src/identyfikacja/shared/manifest.ts` and `shared.test.ts`, because `@types/node` was missing. The QA step added `@types/node@^24` as a dev dependency (the smallest fix, 13 lines). Other QA branches that add the same dependency merge cleanly; if git reports a conflict in `sites/yarn.lock`, keep one `@types/node@^24` entry.

## Open issues

- Published size is 13.0 MB (ZIP 5.1 MB, brand book 2.6 MB): over the 12 MB budget, inside the 16 MB hard cap. The hand-cut icon paths and the 29 page brand book added about 0.7 MB.
- The primary and vertical logos are not legible below about 24 px height (the wordmark turns to a smudge); the page and the brand book state the minimum sizes (120 px width for the primary logo), the simplified sygnet is the 16 px mark.
- Loaf cuts in the ink filtered stamps look faint on the page press; left as the intended worn look.

## QA (phase 4, B1)

Checked in this worktree, then fixed and rechecked:

- Screenshots at 390 and 1440 px, every slice opened (14 and 17 slices), plus reduced motion run. Console errors: none. Horizontal overflow: none.
- Logo at 16, 24, 48 and 512 px for all six variants and the favicon, enlarged and reviewed. The favicon mark reads at 16 px. Head has the SVG, ICO and apple-touch links.
- SVG: no `<text>`, valid `viewBox`, logos 4.5 to 9.8 KB (under 10 KB), favicon 1.8 KB, logo PDFs carry no fonts.
- PDF: brand book 27 pages of 1920 x 1080 px (1440 x 810 pt), fonts embedded as CID TrueType, no Type 3; business card 258 x 173.04 pt = 91 x 61 mm on 2 pages; letterhead A4; pages 1, 7, 12, 13, 18, 22, 25, 26, 27 rendered to PNG and viewed.
- Video: MP4 H.264 and WebM VP9, 1080 x 1080, 3.03 s, 602 KB and 548 KB.
- ZIP: contents match the "Co dostaje klient" list (logo SVG, PNG and PDF, favicons, colours, fonts and licences, pattern, icons, print, social, e-mail, brand book).
- Contrast: 16 pairs of `brand.json` recomputed by an independent script, all text pairs at least AA (decorative samples 3.99:1 and 2.81:1 are marked as decoration). A DOM scan of the page at 390 and 1440 px, of the brand book HTML and of every mockup and social HTML found only the decorative samples and the brand book failures below.
- `validate.mjs` 64 of 64, `guard.mjs` 0 problems, no en or em dashes, `yarn --cwd sites run check` 0 errors, `yarn --cwd sites test` 1192 passed, `yarn --cwd sites build` ok, `yarn --cwd studio test` 8 passed.

Defects found and fixed:

- Figures (`direction-stamp.svg`, `clearspace.svg`) were optimised with precision 1, which broke the ring text of the stamp ("SKIB KA"); now the default precision, the gap is gone (this closes the old open issue). The brand book was rebuilt.
- Brand book: kraft pages and the cover used the ash grey and the skin brown on kraft (2.8 to 3.0:1); now rye brown (5.9:1). Decimal dots in the type scale and contrast table became commas. Page 7 cards overflowed into the footer, page 25 mockups were cropped and left a blank band; now complete images with captions.
- Page: icon labels `maka` and `noz` are now `mąka` and `nóż`; the animation block sits beside a facts list instead of leaving half the card empty; the letterhead mockup card spans the full width with a facts list, so the gallery no longer leaves a hole; the three value cards fit on one heading line; the keywords stack on a phone instead of leaving "mąka" alone; the press pad hint is "Kliknij w papier" (contrast 3:1 or better, no duplicate of the heading) and disappears after the first stamp; the colour and contrast tables become labelled lists on a phone instead of a clipped scroll; the download groups have a chevron that shows they open; the tilted paper layers can no longer widen the page.

## Review scores

Round 1 (independent review, `identyfikacja-b1-r1.json`): style fidelity 4, craft 3, system consistency 4, fit to trade 5, readability 4, sales value 4, distinctness 3.

## Repair after review round 1

Craft (3):

- Business card and letterhead: the pattern strips are now inline vector `<use>` tiles, so the PDFs contain no raster pattern (`pdfimages` lists no images). `skibka-business-card.pdf` carries BleedBox 91 x 61 mm and TrimBox 85 x 55 mm (set with pdf-lib in `build-assets.mjs`).
- `figures/clearspace.svg` redrawn: the letter S is drawn as a block in all four margins and the dimension lines touch the dashed box. New `figures/minimum-sizes.svg` shows the 16 px, 48 px and 120 px sizes at 1:1 with px and mm marks; it is on the page (System) and in the brand book. Labels are glyph paths, not text.
- `figures/direction-kromka.svg` redrawn as a toast slice (domed crust, crumb, dotted inner crust, letter S).
- Icon `noz` redrawn as a bread knife (handle with rivets, serrated blade). The whole icon set got the hand-cut treatment: each path is resampled in a browser, shifted by a smooth seeded wobble (about 0.1 unit) and given its own stroke width between 1.65 and 2.05. The result is `icons-handcut.json`, regenerated with `node identyfikacja/brands/skibka/bake-icons.mjs`; `icons.mjs` reads it, so the SVG files, the sprite, the page and the brand book all use the same drawing.
- Kerning: `bk` from -8 to 6, `ki` from 6 to 14, `ib` from 4 to 6 so the serif feet of b, k and i no longer read as one rail. All logo files, PNG, PDF, favicon, animation and figures were regenerated; the primary logo is 9762 bytes, still under 10000.
- The five mockup images have width and height (`mockupSize` in `view.ts`), so the page no longer grows while scrolling.
- The logo animation autoplays muted and looped without controls; with reduced motion it stays paused on the last frame with controls (small inline script in `Page.astro`).

Distinctness (3), brand book rebuilt (29 pages, 2.6 MB):

- Paper grain as a tiled PNG background (one resource, not a full page raster), torn edge cards (`clip-path` polygons, vector), a stamped page number with a wobbly double ring on every page, a stamped numbered contents page on torn kraft tabs, pattern field as vector `<use>` tiles on the cover and on the pattern page.
- Two divider pages (Logo on rye with a giant stamp, Zastosowania on kraft with the bag mockup), tonal pages in rye and kraft, giant glyph page, a three frame animation page. Pages 4, 8, 19, 22, 23 and 24 no longer use the title, paragraph and three cards skeleton. Body copy is 25 to 35 px on the 1920 x 1080 pages.
- No `mix-blend-mode`, no CSS opacity and no filters except the four deliberate misuse examples on page 14.

Other findings:

- ZIP statement: the page and `content.ts` now say that the ZIP holds logo, colours, fonts, pattern, icons, print, social, e-mail and brand book, that mockups and animation are separate files, and give both sizes.
- Letterhead caption (page and brand book) now matches the mockup: logo in the header, pattern strip on the left, address in the footer. Kerning text in `content.ts` matches the new pairs.
- Hero: the bag is about 30 percent larger (cropped viewBox, art column 120 percent wide from 1200 px). The duplicated Branża, Miejsce, Zakres list in "Klient i zadanie" is replaced by Odbiorcy, Zadanie and Wynik.
- Left as is: the "Poziome" lockup (sign and name on one baseline is already the difference; the review marked it optional).

Shared change request: `studio/identyfikacja/scripts/zip.mjs` writes `1 plików` and `3 plików` in README.txt (plural forms). It does not block anything, so it was not edited here.
