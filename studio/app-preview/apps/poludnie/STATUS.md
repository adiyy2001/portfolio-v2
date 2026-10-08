# Południe (B6, A6 izometryczny dashboard danych): status

Built on 2026-10-08 in a cloud session, on the foundation from step F, without changes to shared files.

## Done

- Remotion compositions: `poludnie-store` (443x960 at scale 2, 750 frames plus a 20 frame loop bridge), `poludnie-marketing` (one composition, `format` prop 9x16, 1x1, 16x9, 795 frames plus a 20 frame bridge), `poludnie-tile` (480x600, 150 frames), stills `poludnie-screen` (7 screens), `poludnie-icon`, `poludnie-board`, `poludnie-og`.
- Data: one model of the day in `data.ts` at 5 minute steps (production bell with a 6,4 kW peak at 13:10, house load, battery plan with a 30% reserve and a full battery at 13:40). Every number on screen, on the board and on the page comes from it and adds up: 47,8 kWh from the roof = 7,5 to the house + 7,5 to the battery + 32,8 to the grid; 15,3 kWh used = 7,5 from the roof + 6,6 from the battery + 1,2 from the grid; 92% self sufficiency; 14,1 kWh × 1,08 zł + 32,8 kWh × 0,24 zł = 23,10 zł (prices labelled przykładowe). Live at 13:10: 6,4 kW = 0,5 house + 1,3 battery + 4,6 grid, battery 95%.
- Type: Archivo variable (wght 100 to 900, wdth 62 to 125), every Polish glyph and `„”’…·×→←°€−` present at 400/100, 500/100, 700/100, 600/87,5 and 800/75 (fontkit); `✓` is missing and not used.
- Design system in `tokens.ts`: 17 colours (scene faces, ink, four data hues each with a text and a tint variant, panel), type scale with condensed numbers, slab cards, motion presets `draw`, `count`, `rise`, `track`, `focus`, `flow`. The isometric world (`components/House.tsx`, `iso.ts`) is drawn in SVG from one projection: plate, house with 20 panels, hub, battery cabinet with a level gauge, grid pole, four energy paths whose dashes move 1 px per frame per kW.
