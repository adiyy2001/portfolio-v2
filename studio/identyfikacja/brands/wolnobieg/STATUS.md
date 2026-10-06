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

## Shared change requests

- `yarn --cwd sites run check` reports 6 errors in shared files (`sites/src/identyfikacja/shared/manifest.ts` and `shared.test.ts`): `@types/node` is not installed in `sites/`. Not caused by this brand. Adding `@types/node` to `sites/package.json` devDependencies fixes it.
- The Skibka icon sprite (`icons/skibka-icons.svg`) is empty for the same svgo reason and the shared `optimizeSvg` could keep symbols.

## Open issues

- The brand book cover lead text sits close to the large arcs.
- The composer preview sits in the upper half of its stage at the default curvature.

## Review scores

Not scored yet.
