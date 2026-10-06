# Klamra status

## Done

- [x] Strategy, three directions (K from braces, terminal, braces with cursor), kerning and a 16, 24, 48 px legibility test
- [x] Logo SVG (no text, under 10 KB), PNG 512, 1024 and 2048 with alpha, vector PDF, in six variants
- [x] Favicon SVG, ICO, apple touch icon, og image
- [x] Palette of ten colours (HEX, RGB, OKLCH, approximate CMYK, no Pantone), JSON and CSS tokens, 18 contrast pairs, all AA or better
- [x] Epilogue and JetBrains Mono as subset WOFF2 with OFL texts
- [x] Pattern, 12 icons on a 24 px grid (sprite and files), clear space, kerning and direction figures
- [x] Business card PDF with bleed and letterhead PDF (vector, no Type 3), four mockups plus the e-mail signature mockup
- [x] Social avatar and three 1080 by 1350 posts, e-mail signature HTML
- [x] Trade application: certificate and sticker sheet
- [x] Logo animation MP4 and WebM, 3 s, 1080 by 1080, static under reduced motion
- [x] Brand book PDF, 28 pages at 1920 by 1080, 1.2 MB, no Type 3
- [x] ZIP (1.8 MB), manifest, validation 64 of 64
- [x] Case study page with a block layout (numbered bands, thick outlines, hard shadows) and the sticker laptop island (drag, keyboard, "Wymieszaj", "Posprzątaj")
- [x] Screenshots at 390 and 1440 px, every slice opened, also with reduced motion
- [x] `yarn --cwd sites test` 1205 passed, `yarn --cwd sites build` ok, prettier clean, guard 0 problems

## Decisions

- Name, trade and style from the plan: Klamra, online programming school, neobrutalism. The mentor and office are made up (Marta Wrona, Wrocław, ul. Zecerska 3). Contact data is fictional and uses `.example`.
- The mark is two braces with a solid pink cursor block in a yellow frame with a hard L shaped shadow. An outlined cursor read as the letter l or as a missing glyph, so the cursor is a wide solid block.
- The cursor width is the clear space unit.
- Epilogue weight 500 was added to the pinned set because 700 on body text looked too heavy in long paragraphs.
- Fonts: Epilogue 900 and 800 for display, 500 and 700 for text, JetBrains Mono 400, 700 and 800 for labels. Ligatures are off everywhere because the mono "<>" turned into a diamond.
- The sticker set is shadowed shapes with an outline instead of die cut shapes with a white margin, because a hard shadow is the system's own signature. The sticker sheet repeats two stickers (git push, 404) to reach 12 pieces.
- The certificate "ZALICZONE" seal is small on purpose, the text must stay inside the burst.
- Logo SVGs keep text as paths. Sticker SVGs in the page and the brand book use text with the page fonts, they are not deliverable files.
- The brand book uses colour page backgrounds (yellow, pink, mint, sky, ink) as section breaks.
- Published size is 5.0 MB, well under the 12 MB budget.
- The page layout is a grid of rectangular blocks with 4 px outlines and 8 px hard shadows, numbered section bands and a sticker laptop. It does not reuse the tilted paper layout of Skibka. Body text is never rotated, only stickers tilt.

## Shared change requests

- `sites/src/identyfikacja/shared`: none needed.
- Hub page `sites/src/pages/identyfikacja/index.astro` picks up `klamra/Tile.astro` automatically, no edit needed. The tile uses 'Schibsted Grotesk' 600 because the hub only loads that weight.
- `sites` TypeScript check reports 6 errors about missing Node types in `src/identyfikacja/shared/manifest.ts` and `shared.test.ts`. They exist without any brand code. Fix: add `@types/node` to the sites dev dependencies or `types: ["node"]`.
- The `PLAN.md` checklist line B4 is not ticked here to avoid merge conflicts with the other brand branches.

## Open issues

- Root `yarn lint` could not run in this worktree (no root `node_modules`), `eslint` is not installed there.
- The table markup is shared, so the phone layout of the colour and contrast tables is done only from the brand CSS (rows stacked with labels). The page is about 29900 px tall at 390 px because of that.
- Phone page height is 24864 px after round 1 (was 29902), the colour and contrast tables are folded on phones.

## QA (phase 4)

Checked and fixed in this pass:

- Full page screenshots at 390 and 1440 px, all slices viewed, also with reduced motion: 0 problems reported, console clean, favicon SVG, ICO and apple touch icon links resolve (200).
- Fixed: widows (balanced headings, `text-wrap: pretty`, non breaking space after one letter words such as "K"), odd last item of the hero navigation, clipped terminal sketch, cropped e-mail signature in the gallery, the animation block (video beside the copy), the CTA block layout, icon names with Polish letters ("błąd", "gałąź"), tight scale and specimen spacing in the brand book, sheet titles in the brand book.
- Fixed: the pattern strip on the business card and letterhead was rasterised by Chromium (blurry in the PDF), now inline vector SVG tiles. Card and letterhead PDFs and mockups regenerated.
- Fixed: on phones the laptop lid uses a compact area, so the stickers are bigger and the right side is no longer empty.
- Logo at 16, 24, 48 and 512 px legible, SVG rules met (no text elements, clean viewBox, logo under 10 KB).
- PDFs: pdffonts has no Type 3, page sizes as specified, business card 91 by 61 mm with bleed, random pages rendered and opened.
- Video: ffprobe 1080 by 1080, 3 s, MP4 and WebM.
- Contrast recomputed by script, every pair matches the table.
- ZIP contents match the "Co dostaje klient" list, validation 64 of 64.
- `yarn --cwd sites run check` 0 errors, `yarn --cwd sites test` 1205 passed, `yarn --cwd sites build` ok, prettier clean, guard 0 problems.

## Review scores

Round 1 (independent review): style fidelity 5, craft 3, system coherence 5, fit to trade 5, readability and accessibility 4, sales value 4, distinctness 4. Only craft was below 4.

## Review round 1 fixes

Craft (was 3):

- One letter Polish words and numbers with units are glued with a no break space everywhere: the page (`Typography.astro` post filters the rendered HTML through `lib/typography.ts`), the brand book, the mockups, the posts, the OG image, the e-mail signature and the print PDFs. A Range line end check at 390 and 1440 px finds 0 hits (was 18 and 36). Unit test added.
- Kerning figure rebuilt as one overlay (pink trace of the uncorrected word under the black corrected word) with the correction of each pair in thousandths of an em (Kl -8, la 0, am +2, mr +4, ra -6), on the page and on brand book page 11. `figures/wordmark-default.svg` and `wordmark-kerned.svg` were replaced by `figures/wordmark-overlay.svg`.
- `klamra-business-card.pdf`: BleedBox is the MediaBox (91 by 61 mm) and TrimBox is 85 by 55 mm inset 3 mm on both pages (`pdfinfo -box`).
- Brand book page 25: the paper mockup is smaller, the third frame ends on the grid. Page 7: four process cards with 150 px thumbnails on one row, nothing touches the footer.
- Favicon redrawn on a 16 pixel grid with whole pixel braces and a 2 by 4 px cursor, `favicon.svg` and the 16, 32 and 48 px ICO entries are exact multiples. The apple touch icon keeps the smooth mark from `src/app-icon.svg`.
- The WYBRANY tag has the same border as the ODRZUCONY tags, so all three align.
- Alt texts say "wersja główna, pozioma, pionowa, jednokolorowa".
- Minimum sizes are drawn at real size (16, 24 and 120 px) on the page and on brand book page 12.

Sales value:

- The ZIP sentence now lists what the ZIP holds and says animation and mockups are listed separately.
- The animation on the page plays muted and looped when it is visible (paused under reduced motion, controls stay).
- Six brand book page previews above the download list, a card, a post and the avatar in the hero.

Accessibility:

- Download links are at least 24 px high, the 11 px labels are 12 px, the strikethrough on the "Nie" examples uses the text colour, the colour and contrast tables are folded on phones.

Distinctness:

- Section titles are shorter and carry a terminal command (`$ git log --oneline`). The brand book contents page is a coloured staircase and page 8 is three tilted stickers on a laptop lid instead of the shared three card row.

## Shared change requests (round 1)

- `sites/src/pages/identyfikacja/index.astro` line 41 says "a wszystko w jednej paczce ZIP". The Klamra ZIP does not hold the animation and the mockups (the shared convention excludes them), so the hub sentence should say "wszystko poza animacją i makietami w jednej paczce ZIP" or drop the claim.
