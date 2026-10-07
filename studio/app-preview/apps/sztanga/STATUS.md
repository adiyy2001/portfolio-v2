# Sztanga (B2, A2 kinetyczna typografia): status

Built on 2026-10-07 in a cloud session, on the foundation from step F, without changes to shared files.

## Done

- Remotion compositions: `sztanga-store` (443x960 at scale 2, 660 frames, 44 beats of 15 frames, plus a 15 frame loop bridge), `sztanga-marketing` (one composition, `format` prop 9x16, 1x1, 16x9, 600 frames plus bridge), `sztanga-tile` (480x600, 120 frames, 8 beats), stills `sztanga-screen` (6 screens), `sztanga-icon`, `sztanga-board`, `sztanga-og`.
- Type: Anybody variable (wght 500 to 900, wdth 50 to 150), one font for video and page. Big numbers are fitted to the screen width from an advance width table (`advances.ts`, measured with fontkit at wght 900, `tnum`), so the width axis can change while the number keeps the screen width.
- Store cut: 886x1920, 30 fps, 660 frames (22 s), H.264 High@4.0, yuv420p limited range BT.709, 11.4 Mbps CBR, silent stereo AAC 256 kbps 48 kHz. Every shot starts on a multiple of 15. Poster frame 500 (record screen with 185 × 2 and 1RM); the 5 s default frame shows the plates per side. Three overlays, white blocks with black type, at least 63 frames each.
- Social finals 1080x1920, 1080x1080, 1920x1080 (20 s each). Web loops, posters, screens, storyboard board with a 44 beat ruler, icons, favicon, og image and manifest in `sites/public/app-preview/sztanga/` (6.4 MB of the 14 MB budget).
- Page `/wzornik/app-preview/sztanga/` with the nine sections, heading width axis stepped with the viewport (62, 75, 100, 125, 150), a 120 BPM metronome island (slam against linear) and the file table from real ffprobe values; index tile with a hover loop of "140" changing width on each beat.
- Checks: `validate.mjs` all green (spec, sizes, seams by SSIM 0.998 to 0.999, budgets), frame sheets, 25% thumbnails and seams looked at, `yarn --cwd sites run check`, `yarn --cwd sites test`, `yarn --cwd sites build`, page shots at 390 and 1440, no horizontal scroll at 320, 390, 768, 1024, 1440, reduced motion loads no video, no console errors on the page.
- Render times on 4 cores, concurrency 4: store 44 s, marketing 9x16 60 s, 1x1 50 s, 16x9 73 s, tile 5 s, stills 11 s.

## Decisions

- Squat is 5 × 3 at 140 kg (the plan said 3 × 5), so "SERIA 3/5" and "SERIA 5/5" count sets consistently.
- Day B is squat, bench press and deadlift (1 × 2 at 185 kg); rows were dropped from the day so the record comes from the same session.
- The history screen shows the deadlift estimated 1RM over eight weeks (176 to 197 kg), not the squat, so it continues the record story.
- Plan lines enter one per beat (60, 75, 90), not one per beat pair, so the plates are complete at the 5 s default poster frame.
- The time lapse jumps about 2.4 s of rest per frame (2:57 to 0:00 in 75 frames); the plan's 0.1 s per frame could not cover three minutes.
- REKORD slams letter by letter every 2 frames from frame 450; the store poster is frame 500 instead of 450 so the result and 1RM are on it.
- The hook overlay runs 4 to 72 for its reading time; all overlays sit at the same height (top 712 of 960).
- Marketing cut is 20 s: one huge word per act (CIĘŻAR, SERIE, PRZERWA, REKORD) with a supporting sentence, full frame number cards on single beats (140 KG, SERIE, 3:00, 5/5 and 185 × 2 inverted), the phone cut in and out, a 12% camera punch every fourth beat. The orange side button is drawn in the app folder over the shared phone frame.
- Loop bridges: an 8 frame orange flash (the icon plate) and a cut back to frame 0 on the half beat.

## Shared change requests

None.

## Open issues

- None blocking. Independent review (step R) still to come.
