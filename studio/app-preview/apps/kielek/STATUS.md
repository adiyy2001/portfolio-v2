# Kiełek (B4, A4 claymorphism pastelowy): status

Built on 2026-10-08 in a cloud session, on the foundation from step F. One backward compatible shared change (below).

## Done

- Remotion compositions: `kielek-store` (443x960 at scale 2, 630 frames plus a 20 frame loop bridge), `kielek-marketing` (one composition, `format` prop 9x16, 1x1, 16x9, 630 frames plus a 20 frame bridge), `kielek-tile` (480x600, 150 frames), stills `kielek-screen` (6 screens), `kielek-icon`, `kielek-board`, `kielek-og`.
- Type: M PLUS Rounded 1c, static Medium 500, ExtraBold 800 and Black 900, every Polish glyph and `„”’…·×→←°€✓‹` checked with fontkit in all three weights. The OFL text comes from the upstream project (`coz-m/MPLUS_FONTS`), because the google/fonts folder has none.
- Design system in `tokens.ts`: ten warm colours, a three level clay shadow (inner highlight, inner shade, soft outer shadow), radii from 18 px up, type scale, motion presets `bounce`, `squash`, `puff`, `drop`, `wiggle`, `stagger`. Mascot, plant glyphs (seven species), drops and icon drawn as SVG in `components/art.ts`, shaded only with white and ink alpha over palette colours.
- Store cut: 886x1920, 30 fps, 630 frames (21 s), H.264 High@4.0, yuv420p limited range BT.709, about 11.4 Mbps CBR, silent stereo AAC. Poster frame 30 (Kiełek after the hop, today card below); the 5 s default frame shows the pistachio Zdzisia card and the cheering mascot. Three overlays in a clay pill that puffs in.
- Social finals 1080x1920, 1080x1080, 1920x1080 (21 s each), web loops, posters, screens, storyboard board, icons, favicon, og image and manifest in `sites/public/app-preview/kielek/`.
- Published size 8.1 MB of the 14 MB budget (store web loop 0.8 MB, 16:9 hero 1.0 MB, tile 0.16 MB).
- Page `/wzornik/app-preview/kielek/` with the nine sections, a clay page in the app palette, the drop lab island (bounce against a stiff spring, stiffness and damping sliders, squash and overshoot shown) and the file table from real ffprobe values; index tile with a hover loop.
- Checks: `validate.mjs` all green (spec, sizes, loop seams by SSIM 0.987 to 0.995, budgets), frame sheets, 25% thumbnails and seams looked at, `yarn --cwd sites run check`, `yarn --cwd sites test`, `yarn --cwd sites build`, page shots at 390 and 1440, no horizontal scroll at 320, 390, 768, 1024, 1440, reduced motion loads no video, no console errors on the page; Kasownik, Sztanga and Rygiel re-validated green after the `fonts.mjs` change.
- Render times on 4 cores, concurrency 4: store 602 s, marketing 9x16 718 s, 1x1 379 s, 16x9 582 s, tile 159 s, stills 41 s. The first marketing attempt ran near an hour per format; moving the floating props with composited transforms instead of left and top, and dropping CSS drop shadow filters, brought it down about four times.

## Decisions

- Story date is Thursday 8 October 2026. The calendar shot shows the season switch itself: drops land on 8, 15, 22 and 29 October, then the plan moves to every 12 days and the drops hop to 20 October and 1 November. Lolek's diagnosis moves his next watering to 18 October (10 days).
- Today list: Zdzisia 400 ml, Kalina 250 ml, Szabla 150 ml, together 800 ml; after watering 2 plants and 400 ml remain. Seven plants in three rooms, Sypialnia 41% against Kalina's 60%.
- `bounce` (mass 1, stiffness 180, damping 12) overshoots about 20%, not 12% as the plan said; the values were kept and the note states the real number.
- Overlays run 4 to 66, 220 to 292 and 344 to 412 so each meets the reading time rule (the plan's hook 6 to 59 was 3 frames short).
- Both loop bridges are 20 frames, so a loop is 650 frames, 13 periods of the 50 frame leaf wiggle, and the wiggle never jumps at the seam.
- The hero card travels to the top on an ease and lands with a half strength squash; a spring travel overshot over the greeting.
- Marketing: four beats with headlines whose words puff in 3 frames apart, a chunky blush clay phone, floating pots, drops and leaves on parallax planes with a slow orbit, and Kiełek hopping out of the screen onto the phone edge at the watering moment (frames 142 to 200). The 1:1 cut drops the support line to keep room for the mascot.
- Plant detail and Dodaj roślinę are gallery screens only; the store cut keeps to the plan's six shots.

## Shared change requests

- Done in this step, backward compatible: `scripts/fonts.mjs` accepts an optional `source.ofl` URL in an app's `fontFiles`, used when the google/fonts family folder has no `OFL.txt`. Apps without it download exactly as before.

## Open issues

- None blocking. Independent review (step R) still to come.
