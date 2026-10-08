# Poziomka (B5, A5 pixel art 8-bit): status

Built on 2026-10-08 in a cloud session, on the foundation from step F. Backward compatible shared changes listed below; Kasownik, Sztanga, Rygiel and Kiełek re-validated green and their published files are unchanged.

## Done

- Remotion compositions: `poziomka-store` (443x960 at scale 2, 600 frames plus a 16 frame loop bridge), `poziomka-marketing` (one composition, `format` prop 9x16, 1x1, 16x9, 600 frames plus a 16 frame bridge), `poziomka-tile` (480x360, 128 frames), stills `poziomka-screen` (6 screens), `poziomka-icon`, `poziomka-board`, `poziomka-og`.
- Everything is drawn into a palette indexed framebuffer at art resolution (`pixel/fb.ts`) and shown on a canvas scaled by an integer with `image-rendering: pixelated`, so no pixel can fall off the grid or leave the 16 colours. Store: 221x480 art pixels at 4 output pixels each (884x1920) plus a 2 px ink strip on the right. Marketing: 2 output pixels per art pixel, world sprites doubled to 4.
- Type: Jersey 10 and Tiny5 (OFL) converted by `tools/atlas.mjs` into bitmap atlases by sampling the outlines on their own pixel grids (75 and 128 units), shipped as "Poziomka Pixel" and "Poziomka Mini". Every Polish glyph checked in both; Jersey 10 lacks `→←`, which the atlas falls back to Tiny5 for (not used on screen). The page uses the original fonts as woff2 subsets with the OFL texts.
- Motion: `tick` (new pose every 4 frames), `walk` (0, 3, 5, 3 art px), `pop`, `fill` (1 px per frame, 10 XP = 7 px), `blink` (6 on, 6 off), `wipe` (16 px checker band in 8 steps of 2 frames). No easing anywhere; overlays fade in and out in two dither steps.
- Store cut: 886x1920, 30 fps, 600 frames (20 s), H.264 High@4.0, yuv420p limited range BT.709, 11.4 Mbps CBR, silent stereo AAC. Poster frame 30 (POZIOM 8 banner, strawberry in the air); the 5 s default frame shows the +30 XP coin over the walk. Three overlays in Poziomka Pixel.
- Validation adds a pixel grid check for this app: lossless screen stills are 100% flat 4x4 cells in the palette, and frames 30, 150 and 596 of the App Store file are 100% flat within the codec tolerance (worst spread 10 of 255).
- Social finals 1080x1920, 1080x1080, 1920x1080 (20 s each), web loops at full resolution, posters, lossless screens (442x960), storyboard board, icons, favicon, og image and manifest in `sites/public/app-preview/poziomka/`. Published 7.4 MB of the 14 MB budget.
- Page `/wzornik/app-preview/poziomka/`: the nine sections in a sky blue pixel page, headings in Jersey 10 at whole multiples of its grid, text in Tiny5 at 16 px, notched panels with inner bevels, the step lab island (smooth ease-in-out at 60 fps against steps at 4, 7.5 or 15 fps, with both curves), a horizontally scrolling screen gallery at 1:1 and the file table from real ffprobe values; index tile with a hover loop.
- Pixel media on the page are sized by a small script (`pixelfit.ts`) to whole device-pixel multiples of their art grid and use `image-rendering: pixelated`; when only a downscale is possible they switch to smooth scaling instead of dropping pixels.
- Checks: `validate.mjs` all green (spec, sizes, seams SSIM 0.982 to 0.993, pixel grid, budget), frame sheets, 25% thumbnails and seams looked at, `yarn --cwd sites run check`, `yarn --cwd sites test`, `yarn --cwd sites build`, page shots at 390 and 1440, no horizontal scroll at 320, 390, 768, 1024, 1440 (page and index), reduced motion loads no video, no console errors on the page.
- Render times on 4 cores, concurrency 4, PNG frames: store 47 s, marketing 9x16 62 s, 1x1 47 s, 16x9 65 s, tile 4 s, stills 12 s.

## Decisions

- The art grid starts at x 0 with a 2 px ink strip on the right, not 1 px on each side as the plan said, so the 4 px art pixels line up with the 2x2 chroma blocks of yuv420p and the 4x4 transforms of H.264.
- Frames are rendered as PNG, not JPEG, for this app only; JPEG would smear chroma along pixel edges before the encoder.
- Web loops keep the full resolution (hero 1920x1080, 9:16 1080x1920, 1:1 1080x1080, store 884x1920 without the strip): any downscale except an exact half blurs, and a half would put the 2 px UI pixels on 1 px with chroma bleed. Pixel art compresses so well that the app stays at 7.4 MB. Marketing posters are exact halves to stay under 150 KB at high JPEG quality.
- The tile loop is 480x360 (120x90 art pixels at 4), 128 frames, framed as a game screen on the index.
- The hook is a flash forward: POZIOM 8 after the walk, then the quests rewind to 1160 XP and play up to 1200. Week data adds up per habit (water 7 of 7, walk 6, book 5, phone 5; 550 XP, 79 a day).
- Week bars grow 3 art px per frame (the plan said 1) so a 120 px chart fills inside the 2 s shot.
- Overlays run 4 to 72, 220 to 290 and 345 to 412 for their reading time; the hook overlay was 6 to 59 in the plan.
- Panels use inner bevels and dithered shades, never hard offset shadows, to stay away from the neobrutalist look.
- Marketing: a pixel world with dithered sky bands, drifting clouds, a garden strip with all five plant stages, the strawberry hopping in the grass, coins that jump out of the phone at each tick, an XP counter in the 16:9 cut, and a checker wipe into the outro with the icon and POZIOMKA typing in.

## Shared change requests

- Done in this step, backward compatible (apps without the new fields render, encode and validate exactly as before):
  - `lib/remotion.mjs` and `scripts/render.mjs`: optional `pixel.imageFormat` in an app's `meta.ts` (PNG frames).
  - `lib/convention.mjs` `webSpec`, used by `encode.mjs` and `validate.mjs`: optional `pixel.web` per variant (size, crop, poster size) and `pixel.scaleFlags` (nearest neighbour); `pixel.screen` crops gallery screens and writes them lossless.
  - `lib/ffmpeg.mjs` `toTv` takes optional flags and crop; `lib/pixelcheck.mjs` and an optional `pixel.grid` check in `validate.mjs`.

## Open issues

- None blocking. Independent review (step R) still to come.

## Review round 1 (2026-10-08)

- The level up screen shows POZIOM 8 with 1200 / 1400 XP and an empty bar whose first pixels blink, consistent with "Do poziomu 9: 200 XP" and the task screen after levelling.
