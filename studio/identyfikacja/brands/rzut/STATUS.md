# Rzut (B3, I1) status

Branch `wzornik-identyfikacja-b3`, worktree `portfolio-v2-wz-identyfikacja-b3`, port 4313. Nothing pushed.

## Done

- 11 deliverables from `node identyfikacja/scripts/pipeline.mjs rzut`: pinned fonts, colors, logo set (6 variants, SVG, PNG, PDF), favicon and icon set, logo size test, assets (pattern, graphics, mockups, social), 3 s logo animation (MP4, WebM, motion data), brand book PDF (29 pages), zip, manifest, validation.
- Validation: 64 of 64 checks pass (contrast 20 pairs AA, zip, manifest, pdffonts without Type 3, MP4 and WebM under 1.5 MB, 3 s).
- Case study page at `/wzornik/identyfikacja/rzut/` with its own layout (Swiss 12-column page with a fixed column overlay, hanging section numbers, ten numbered sections), a grid tester island, the tile and a route.
- Page tests in `sites/src/identyfikacja/rzut/rzut.test.ts` (content, grid logic, animation timeline).

## Left

- Nothing blocking. Owner steps: none.

## Decisions for Adrian

- Accent is kobalt #1F4BFF, not red. It is used once per spread, and on czern only for large text and UI (3.31:1).
- One type family: Instrument Sans text (wdth 100) plus Condensed (wdth 75) for headings and captions.
- Logo is a kobalt square (6U) with a 2U by 3U notch, a wordmark and a caption with the coordinates of Wrocław.
- Negative logo keeps the kobalt square on czern.
- Minimum sizes: symbol 16 px (5 mm), horizontal 96 px (24 mm), primary 280 px (70 mm), vertical 200 px (50 mm).
- Board mockup uses fictional data (decision 412/2026); post 1 headline is "Dom przy parku".
- Copy writes "mkw." instead of "m2" with the superscript, because the shared font subset has no U+00B2.
- Brand book is 29 pages; the animation lasts 3 s.
- Reduced motion shows a static logo instead of the video.

## Shared change requests

- Applied (smallest fix, committed in `2bcfddf`): `studio/identyfikacja/lib/fonts.mjs` `faceFile` adds a `-w<wdth>` suffix when wdth is not 100, so width 75 and 100 instances of one family no longer overwrite each other. Please keep it for every brand that uses a width axis.
- Not applied: `yarn --cwd sites run check` reports 6 errors, all in `sites/src/identyfikacja/shared/manifest.ts` and `shared.test.ts` (no type definitions for `node:fs`, `node:path`, `node:os`, `process`; `@types/node` is missing from the sites tsconfig). They are not from this brand.
- The font subset lacks U+00B2; adding it would allow "m2" with the superscript.

## Review

Screenshots at 390 and 1440 px viewed slice by slice (`screens.mjs rzut`, normal and `--reduced`): 0 problems, 15 slices each. Brand book pages viewed through `pdf-preview.mjs`. Defects found and fixed: section numbers colliding with headings, hero text collisions, tile and table overflows in the brand book, font fallback for the superscript.

| Area | Score (1 to 5) |
| --- | --- |
| Logo and identity | 5 |
| Brand book | 4 |
| Case study page | 4 |
| Motion | 4 |
| Mockups | 4 |

## Checks

- `yarn --cwd sites test`: 1208 of 1208 pass.
- `yarn --cwd sites build`: ok, 181 pages.
- `yarn --cwd sites run check`: 0 errors after merging the node types from the identity branch; prettier clean (the QA step formatted the brand's files).
- `yarn --cwd studio test`: 0 failures.
- `guard.mjs --brand rzut`: 0 problems; dash grep clean.

## Quality control (QA agent)

Defects found and fixed:

- `icons/rzut-icons.svg` was an empty file: `optimizeSvg` (svgo) removes the unused `<symbol>` elements. `icons.mjs` now writes the sprite without svgo, with the stroke attributes on each `<symbol>` (attributes on the outer `<svg>` are not inherited by `<use>` instances). The sprite renders all 12 icons. Skibka has the same empty sprite (shared `lib/svg.mjs`, not touched here).
- Icons `elewacja` (looked like a face) and `przekroj` (duplicate of `schody`) redrawn: facade with storey lines, hatched section square.
- Brand book: the social page overflowed the page (avatar and share image stacked into one grid cell); three card pages (values, process, refinements) and the tone page were half empty and are scaled up; rejected directions larger.
- Case study page: card rows in "Trzy poprawki" and the two type faces were misaligned (stretched grid rows, now `align-content:start`); the chosen direction card is 4 px lower than its neighbours (thicker rule); the applications gallery left a 900 px hole under the letterhead (new order: card, card, board with letterhead, e-mail signature); skip link was kobalt on czern (3.31:1) and is now white on czern; spacing under "Unikamy"; row gap in the stacked cards on mobile; CTA headline no longer starts with "Twoja firma".
- `yarn --cwd sites run check` failed prettier on 7 brand files: formatted. `motion-data.json` is rewritten unformatted by `build-logos.mjs`, run prettier on it after rebuilding.

Checks run, all green after the fixes:

- Page at 390 and 1440 px: every slice opened and reviewed (normal and `--reduced`), 0 overflow, 0 console errors, one h1. A script audited the computed colour of every text node of the page against its background: the only pairs under AA are the documented swatch samples of the contrast table (kobalt on czern UI 3.31, beton 3.47, decorative szary and mgla).
- Contrast table recomputed by an independent script: 20 pairs, all at or above the level in `brand.json`.
- SVG: 6 logo files 150 to 4749 bytes, no `<text>`, no `font-family`, `viewBox` present; favicon 142 bytes. Logo at 16, 24, 48 and 512 px viewed in `logo-sizes.png`; symbol is legible at 16 px. `favicon.ico` holds 16, 32 and 48 px, the head has the SVG, ICO and apple-touch-icon links.
- PDF: brand book 29 pages, 1440 x 810 pt (1920 x 1080 px), 1.6 MB, 5 CID TrueType fonts, no Type 3; all 29 pages viewed on contact sheets; business card 258 x 173 pt (91 x 61 mm) 2 pages and the letterhead (A4) rendered and viewed; every PDF embeds its fonts.
- Video: MP4 H.264 and WebM VP9, 1080 x 1080, 3.03 s, 30 fps, 37 KB and 35 KB; frames viewed.
- ZIP: holds every file of the "Pliki do pobrania" groups except mockups, animation, figures, og and the manifest, as defined in NOTES.md; plus README.txt.
- `validate.mjs rzut`: 64 of 64. `yarn --cwd sites test` 1208 of 1208, `yarn --cwd sites build` 181 pages, `yarn --cwd studio test` 8 of 8, `guard.mjs --brand rzut` 0 problems, dash grep clean.

Left as is (shared code, for the merge step):

- The file list shows "PNG 460, 512, 919, 1024, 1838, 2048 px" for the logo group because `lib/manifest.mjs` `summarize` lists the real widths of the PNGs (the vertical variant is 460 px wide at 512 px height). Grouping by the nominal size would read better.
- `ContrastTable.astro` prints a sample "Aa" for UI and decorative pairs too.
- The brand book pages 5 and 7 keep a calm lower third (Swiss whitespace by design).
