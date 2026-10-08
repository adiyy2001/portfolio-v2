# Rygiel (B3, A3 ciemny neon i cyber): status

Built on 2026-10-07 in a cloud session, on the foundation from step F, without changes to shared files.

## Done

- Remotion compositions: `rygiel-store` (443x960 at scale 2, 720 frames plus a 15 frame loop bridge), `rygiel-marketing` (one composition, `format` prop 9x16, 1x1, 16x9, 690 frames plus bridge), `rygiel-tile` (480x600, 150 frames), stills `rygiel-screen` (6 screens), `rygiel-icon`, `rygiel-board`, `rygiel-og`.
- Type: Azeret Mono (variable, 400, 500, 700) for the whole interface, overlays and page; Oxanium (variable, 600, 800) for the wordmark and big numbers. Both checked with fontkit for every Polish glyph; Azeret Mono lacks `₂` and `✓`, Oxanium lacks `→` and `✓`, so checks and arrows are SVG and the entropy line avoids the subscript.
- Motion: `scramble` (deterministic, per character, 2 frame offset, 6 to 10 frame cycles, glyph change every 2 frames), `scan` (every screen change is a top to bottom reveal in 20 frames, the vault unlock in 30), `pulse` (36 frame sine on glows), `draw` (18 frames), `step` (rows 3 frames apart), `drift` (the grid, the one linear motion, wrapped so it loops without a jump).
- Store cut: 886x1920, 30 fps, 720 frames (24 s), H.264 High@4.0, yuv420p limited range BT.709, about 11.4 Mbps CBR, silent stereo AAC. Poster frame 30 (the alert after the scan); the 5 s default frame shows the settled breach details. Three overlays in a neon outlined box that decrypts in about half a second.
- Social finals 1080x1920, 1080x1080, 1920x1080 (23 s each), web loops, posters, screens, storyboard board with a time axis of shots, overlays and scans, icons, favicon, og image and manifest in `sites/public/app-preview/rygiel/`.
- Page `/wzornik/app-preview/rygiel/` with the nine sections, headings that decrypt once on entering the viewport (static under reduced motion, real text kept for screen readers), the scramble lab island (readable against too fast, frames per character slider, glow pulse against a flickering pulse kept under three flashes per second) and the file table from real ffprobe values; index tile with a hover loop.

- Checks: `validate.mjs` all green (spec, sizes, seams, budget 13.58 MB of 14), frame sheets, 25% thumbnails and seams looked at, `yarn --cwd sites run check`, `yarn --cwd sites test`, `yarn --cwd sites build`, page shots at 390 and 1440, no horizontal scroll at 320, 390, 768, 1024, 1440, reduced motion loads no video, no console errors; Kasownik and Sztanga re-validated green after the encoder change.
- Render times on 4 cores, concurrency 4: store 170 s, marketing 9x16 443 s, 1x1 265 s, 16x9 420 s, tile 23 s, stills 18 s.

## Decisions

- The breach story counts two other services with the leaked password ("hasło z wycieku": Bilety kolejowe, Sklep rowerowy) instead of "1 in a breach", so the morning fix of the forum password and the evening health check stay consistent: health 68 to 96, weak 9 to 1, reused 4 to 0, from the leak 2 to 0, 14 passwords fixed, one weak left (the old router).
- Overlays run 4 to 75, 186 to 265 and 496 to 575 (the plan had 6 to 59 for the hook) so every line gets its reading time after the quick decrypt.
- Marketing cut is 23 s (690 frames): four beats with mono headlines (Wyciek wykryty., Hasło zmienione., Sejf otwarty., Sejf zdrowy.), a log column in 16:9, a continuous 5% push with two grid planes at different speeds, and an outro where the bolt draws, slides shut and RYGIEL decrypts. The plan named three headlines; the vault unlock got its own beat.
- The phone frame is the shared frame with a cyan edge, a void bezel and no body fill, plus a dim inner outline drawn in the app folder.
- Vault list rows decrypt with 0.5 frames per character (the plan's 2 frames is kept for the password and the launch name) so eight rows finish within the shot.
- The page lab's "too fast" pulse uses a 12 frame period (2.5 Hz), not anything faster, to stay under three flashes per second.

## Shared change requests

- Done in this step, backward compatible: `scripts/encode.mjs` reads an optional `webTargets` map from an app's `meta.ts` and uses it instead of the default size target for that web variant. Rygiel sets the 16:9 hero to 2.2 MB because the two drifting grid planes made the first encode land 0.7 MB over the 14 MB app budget. Apps without the field encode exactly as before.

## Open issues

- None blocking. Independent review (step R) still to come.
