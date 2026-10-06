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
