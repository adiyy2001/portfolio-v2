# Kasownik (B1, A1 natywny iOS): status

Built in step F together with the foundation, 2026-10-07, cloud session.

## Done

- Remotion compositions: `kasownik-store` (443x960 rendered at scale 2, 690 frames plus a 15 frame loop bridge), `kasownik-marketing` (one composition, `format` prop 9x16, 1x1, 16x9 through `calculateMetadata`, 630 frames plus bridge), `kasownik-tile` (480x600, 150 frames), stills `kasownik-screen` (7 screens), `kasownik-icon`, `kasownik-board`, `kasownik-og`.
- Store cut: 886x1920, 30 fps, 690 frames (23 s), H.264 High@4.0, yuv420p limited range BT.709, about 11.4 Mbps CBR, silent stereo AAC 256 kbps 48 kHz. Poster frame 360 (12 s, live ticket with the full code); the 5 s default frame shows the payment sheet. Four overlays, all within 6 words and at least 54 frames.
- Social finals 1080x1920, 1080x1080, 1920x1080 (21 s each). Web loops, posters, screens, storyboard board, icons, favicon, og image and manifest in `sites/public/app-preview/kasownik/` (about 11 MB of the 14 MB budget).
- Page `/wzornik/app-preview/kasownik/` with the brief's nine sections, the curve lab (sheet spring against cubic-bezier, damping slider) and the file table from real ffprobe values; index tile with a hover loop.
- Checks: `validate.mjs` all green (spec, sizes, loop seams by SSIM, budgets), `yarn --cwd sites run check`, `yarn --cwd sites test`, page shots at 390 and 1440, no horizontal scroll at 320, 390, 768, 1024, 1440, reduced motion loads no video.

## Decisions

- The hook is the already validated ticket at 7:52 (41:10 left) before the story rewinds to the purchase at 7:47; the clock in shots 5 to 7 starts at 45:00 on validation at 7:48:10, valid until 8:33:10. The route (16 then 5, transfer at Rondo Kaponiera at 8:06) leaves 27 min, which the fourth overlay states as „Przesiadka? Zostanie 27 minut” (the plan had „Zostało”, changed to match the pill).
- The plan's hook overlay ran 6 to 59; it runs 4 to 72 so a five word line gets the 2.2 s reading time.
- Store web loop is 442x960 instead of 443x960 (H.264 and VP9 in yuv420p need even sizes).
- Marketing signature: the live ticket leaves the phone at frame 335 and returns from 395 (spring `hero`).

## Shared change requests

None.

## Open issues

- None blocking. Independent review (step R) still to come.

## Review round 1 (2026-10-08)

- Motion: the tab bar of Moje bilety slides out on the `hero` spring while the card grows to the full screen ticket (an iOS full screen modal has no tab bar) and stays hidden; it used to vanish for 13 frames at 10,9 s and pop back.
- The button label and the band label no longer cross-fade: the old label leaves in 4 frames, the new one enters after a short gap (11 frames in total), so no "Bilet skasowany | skasować" ghost.
- The hook overlay runs 0 to 63 and is gone before the price list slides in.
- Marketing 9:16: phone at scale 0.95 with its bottom at about 80% of the frame, headline 130 px.
