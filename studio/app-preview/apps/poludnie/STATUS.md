# Południe (B6, A6 izometryczny dashboard danych): status

Built on 2026-10-08 in a cloud session, on the foundation from step F, without changes to shared files.

## Done

- Remotion compositions: `poludnie-store` (443x960 at scale 2, 750 frames plus a 20 frame loop bridge), `poludnie-marketing` (one composition, `format` prop 9x16, 1x1, 16x9, 795 frames plus a 20 frame bridge), `poludnie-tile` (480x600, 150 frames), stills `poludnie-screen` (7 screens), `poludnie-icon`, `poludnie-board`, `poludnie-og`.
- Data: one model of the day in `data.ts` at 5 minute steps (production bell with a 6,4 kW peak at 13:10, house load, battery plan with a 30% reserve and a full battery at 13:40). Every number on screen, on the board and on the page comes from it and adds up: 47,8 kWh from the roof = 7,5 to the house + 7,5 to the battery + 32,8 to the grid; 15,3 kWh used = 7,5 from the roof + 6,6 from the battery + 1,2 from the grid; 92% self sufficiency; 14,1 kWh × 1,08 zł + 32,8 kWh × 0,24 zł = 23,10 zł (prices labelled przykładowe). Live at 13:10: 6,4 kW = 0,5 house + 1,3 battery + 4,6 grid, battery 95%.
- Type: Archivo variable (wght 100 to 900, wdth 62 to 125), every Polish glyph and `„”’…·×→←°€−` present at 400/100, 500/100, 700/100, 600/87,5 and 800/75 (fontkit); `✓` is missing and not used.
- Design system in `tokens.ts`: 17 colours (scene faces, ink, four data hues each with a text and a tint variant, panel), type scale with condensed numbers, slab cards, motion presets `draw`, `count`, `rise`, `track`, `focus`, `flow`. The isometric world (`components/House.tsx`, `iso.ts`) is drawn in SVG from one projection: plate, house with 20 panels, hub, battery cabinet with a level gauge, grid pole, four energy paths whose dashes move 1 px per frame per kW.
- Store cut: 886x1920, 30 fps, 750 frames (25 s), H.264 High@4.0, yuv420p limited range BT.709, 11,4 Mbps CBR, silent stereo AAC. Poster frame 45 (the house with flows and 6,4 kW); the 5 s default frame shows the charge curve drawing. Three overlays on a dark pill (4 to 72, 240 to 312, 390 to 456). The status bar clock follows the story: 13:10 for the house and the battery, 21:40 to 21:42 for the day, the tip and the balance.
- Marketing cut: 795 frames (26,5 s), five beats, each with its own part of the isometric world: roof (6,4 kW), battery (fills with the phone's curve), a billboard with the day chart drawing in, the washing machine with its own flow, three balance columns; an amber wire carries the flow from the hub into the phone. Camera tracks along the isometric axes. 16:9 copy, world and phone in three columns; 9:16 copy, world, phone stacked; 1:1 copy top left, phone bottom right. Headlines on white slab tiles.
- Social finals 1080x1920, 1080x1080, 1920x1080, web loops, posters, seven screens, storyboard board, icons, favicon, og image and manifest in `sites/public/app-preview/poludnie/`. Published 9,4 MB of the 14 MB budget.
- Page `/wzornik/app-preview/poludnie/` with the nine sections: cool grey page, white slab cards, a day ledger whose curve and split bars draw in on view, the draw lab island (draw and count against linear on the same production curve, length slider), the palette with contrast values and the file table from real ffprobe values; index tile with a hover loop (the index now shows all six).
- Checks: `validate.mjs` all green (spec, sizes, seams SSIM 0.947 to 0.993, budget), frame sheets, 25% thumbnails, board and seams looked at, `tsc`, `yarn --cwd sites run check`, `yarn --cwd sites test` (1358 passed), `yarn --cwd sites build`, page shots at 390 and 1440, no horizontal scroll at 320, 390, 768, 1024, 1440 (page and index), reduced motion loads no video, no console errors on the page.
- Render times on 4 cores, concurrency 4: store 198 s, marketing 9x16 577 s, 1x1 442 s, 16x9 631 s, tile 21 s, stills 29 s.

## Decisions

- The numbers follow the day model, not the plan where the plan did not close (see PLAN.md decisions 47 to 49): use 15,3 kWh, from battery 6,6, value 23,10 zł; battery 95% at 13:10 on a plan to be full at 13:40.
- Overlays run 4 to 72, 240 to 312 and 390 to 456 for their reading time.
- The tip is for tomorrow (forecast 41,8 kWh, peak 5,6 kW); 4,1 kW is the forecast average surplus to the grid between 12:30 and 14:00, 4,5 kW for the dishwasher and 3,0 kW for the boiler heater come from the same forecast.
- The tile loop quantises dash speeds to whole dash periods over 150 frames so it has no seam.
- Marketing is 26,5 s with five beats; the billboard fades out after its beat so the later beats stay readable.

## Shared change requests

None.

## Open issues

- None blocking. Independent review (step R) still to come.

## Review round 1 (2026-10-08)

- Hook rebuilt: the camera opens at scale 1.62 on the house and settles to 1.3 (was 1.04) by frame 54, 6,4 kW counts up from 0 in 20 frames with the three row values, the flow dashes speed up with the count, and two energy pulses run from the roof through the hub to the battery, the house and the grid. All flows and rows are at full strength in the hook.
- No 40% opacity on text: rows out of focus turn to palette colours (name Łupek #4E5D6C, 6,8:1; value Sieć tekst #5F6F82, 5,1:1 on white) and drop to 24 px and a lighter weight.
- Tab changes: the old screen fades out in 4 frames before the new heading rises; the status bar clock changes with the new screen.
- Marketing cut is 25,0 s (750 frames): the Bilans beat holds 120 frames instead of 150 and the outro 60 instead of 75.
