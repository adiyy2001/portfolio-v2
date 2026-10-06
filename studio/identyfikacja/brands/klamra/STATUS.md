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
- On phones the stickers on the laptop lid are small because the lid scales down with the viewport.
- The contrast table scrolls sideways inside its frame at 390 px (shared component).
- Tidy layout leaves the right side of the lid empty, rows break early because of sticker widths.
- No independent review done yet.

## Review scores

Not scored yet.
