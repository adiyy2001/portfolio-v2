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
- `yarn --cwd sites run check`: 6 errors, all shared and pre-existing (see above).
- `yarn --cwd studio test`: 0 failures.
- `guard.mjs --brand rzut`: 0 problems; dash grep clean.
