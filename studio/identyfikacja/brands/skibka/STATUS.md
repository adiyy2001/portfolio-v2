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

- Published size is now 11.8 MB, inside the 12 MB budget (the old note of 15.3 MB no longer applies; the rebuilt brand book is 1.8 MB).
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

Not scored yet.
