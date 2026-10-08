# App preview: recon notes (phase 0)

Brief: `/home/adrian/root/side_projects/briefs/wzornik-app-preview.md`. Run rules: `/home/adrian/root/side_projects/briefs/agent-runs/wzornik-common.md`, overridden by `wzornik-run2.md` in the same folder (base branch `main`, yarn mutex, root `yarn.lock` frozen). All three are binding. The plan is `PLAN.md` next to this file. Written on 2026-10-07 by the setup and planning agent. Mode: autonomous, no checkpoint.

## State of the worktree

- Worktree `/home/adrian/root/side_projects/portfolio-v2-wz-app-preview`, branch `wzornik-app-preview`, created from `main` at `f9ceb55`. `main` has moved on since (`3c41e4f`, the cleanup session); the merge agent pulls and merges at the end, nobody rebases this branch.
- The main checkout `/home/adrian/root/side_projects/portfolio-v2` is never touched. The ASO brief runs at the same time in `/home/adrian/root/side_projects/portfolio-v2-wz-aso` (branch `wzornik-aso`).
- Node 24.13.0 through nvm: `export PATH=~/.nvm/versions/node/v24.13.0/bin:$PATH`. Yarn 1.22.22.
- Every `yarn install` runs with `--mutex file:/tmp/yarn-portfolio.lock` and `--frozen-lockfile` (all sessions share `~/.cache/yarn`). The root `yarn.lock` is never changed or committed on this branch. Studio dependencies get their own lock file in `studio/app-preview/`.
- Baseline before any change, all green on 2026-10-07: `yarn install --frozen-lockfile` (25 s), `yarn --cwd sites install --frozen-lockfile` (4 s), `yarn gatsby clean && yarn build` (43 s, exit 0; the known `postcss-calc` parse warning on one stylesheet and the outdated `caniuse-lite` warning are not errors), `yarn --cwd sites build` (8 s, 185 pages, 60 MB in `sites/dist`), `yarn --cwd studio install --frozen-lockfile` for the shared identity studio.
- Commit style: one lowercase line in plain English, no prefix, no trailers.

## How the existing work is built (what to copy)

- The portfolio is Gatsby at `https://adrianturbinski.pl/` with no path prefix. The sample websites are one Astro 7 project in `sites/` (own `yarn.lock`, `base: '/wzornik'`, `trailingSlash: 'always'`, Preact islands). `.github/workflows/pages.yml` builds Gatsby, builds `sites/`, copies `sites/dist` to `public/wzornik`. Where the brief says `/portfolio-v2/`, read `/wzornik/` on the root domain.
- Trzask (the quality bar) is split in four places: thin routes in `sites/src/pages/trzask/`, everything else in `sites/src/sites/trzask/` (`Layout.astro` with every head tag, `fonts.ts`, `styles.ts` inlining CSS through `?inline`, `components/`, `data/`, `islands/`, `lib/` with tests), published files in `sites/public/trzask/` (`favicon.svg`, `og.png` 1200x630, `fonts/*.woff2` plus OFL texts). What makes it good: real trade content (origins, roast dates, grinds, prices), complete data, a cart that works, details such as `size-adjust` fallback faces and preloads, and an honest footer.
- The identity brief (done, live) is the closest pattern and is followed here so the merge stays easy: route `sites/src/pages/identyfikacja/<slug>/index.astro` renders `sites/src/identyfikacja/<slug>/Page.astro`, shared parts in `sites/src/identyfikacja/shared/` (`Shell.astro` head, `SampleLine.astro` footer, `manifest.ts` reading `public/identyfikacja/<slug>/manifest.json` at build time, `Downloads.astro`, types), published files in `sites/public/identyfikacja/<slug>/`, the index `sites/src/pages/identyfikacja/index.astro` collects `Tile.astro` files with `import.meta.glob`, the registry `identityBrands` sits in `sites/src/shared/sites.ts`. Studio tooling in `studio/identyfikacja/` (`scripts/`, `lib/`, `brands/<slug>/STATUS.md`). Its `NOTES.md` and `PLAN.md` are worth a read for the lessons.
- `#wzornik` on `/dla-klienta/` (and `#swatch-book` on `/en/for-clients/`) is `src/components/wzornik.js` in Gatsby: nine accordion swatches for the websites, then a `wz-id` block with a list of the six identity case studies and a link to `/wzornik/identyfikacja/`, copy in `copy.pl.identity` and `copy.en.identity`, styles in `src/styles/wzornik.css`. The `/wzornik/` index (`sites/src/pages/index.astro`) has one link per category (line 47 links the identity index). `static/llms.txt` and `sites/README.md` list the sample work. Only the publication step edits these files.
- Every sample page carries `noindex`, canonical, Open Graph 1200x630, `theme-color`, a skip link and `lang="pl"`.
- Checks that must stay green: `yarn lint` (root ESLint; it ignores `sites/` but lints every `.js` and `.mjs` under `studio/`, so studio scripts must pass it; `.ts` and `.tsx` are not linted), `yarn gatsby clean && yarn build`, `yarn --cwd sites run check` (astro check plus Prettier over every file Prettier understands in `sites/`, including JSON and CSS in `public/`), `yarn --cwd sites test`, `yarn --cwd sites build`.

## Remotion license (checked 2026-10-07)

Sources: `LICENSE.md` in `remotion-dev/remotion` on `main` and the license FAQ (`packages/docs/docs/license/faq.mdx`, served at remotion.dev/docs/license/faq; remotion.pro/faq redirects there). Latest npm release today: `remotion@4.0.534`.

- Free License: "an individual", "a for-profit organization with up to 3 employees", non-profits, and evaluation. The FAQ: "Can single-person companies use the Free License? Yes. Even if you are incorporated, you can operate under the Free License, as long as your total headcount is 3 or less." Commercial use is allowed; the only restriction is selling Remotion itself or letting others render arbitrary Remotion projects on your server.
- Agency work: if the client receives only finished video files, only the agency's headcount counts. If the client owns or operates the Remotion project (gets the source, keeps developing it), both headcounts are added for the 4 person threshold and the owner of the project buys the license.
- Remotion 5.0 (open PR #3750, not released) will count contractors towards team size and bind the Company License to new terms. Still free for a one person business.
- Server side rendering has no automatic telemetry for Free License users.
- Verdict: Adrian, a sole proprietor with no employees, uses Remotion for free, including for paid client work. No payment, no stop. Pin `4.0.534` exactly. See "Decisions for Adrian" in `PLAN.md` for the client source case.

## Remotion works here (probe on 2026-10-07)

A throwaway project with `remotion`, `@remotion/cli`, `@remotion/renderer`, `@remotion/bundler` 4.0.534 and React 19 rendered a 60 frame 886x1920 composition with a spring and a local variable font (Onest loaded through `FontFace` with `delayRender`/`continueRender`) in 9 s with `--concurrency=4`, using Playwright's headless shell as the browser: `--browser-executable=/home/adrian/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell` (no Chrome download needed; `/usr/bin/google-chrome` 148 also exists). Polish glyphs rendered correctly.

Findings that matter:

- Remotion's H.264 output is tagged full range (`ffprobe` says `pix_fmt=yuvj420p`). The store file must be re-encoded with ffmpeg to `yuv420p`, limited range, BT.709. Tested command (passes: High profile, level 4.0, `yuv420p`, `color_range=tv`, 30/1, AAC stereo 48 kHz):
  `ffmpeg -i master.mp4 -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=48000 -map 0:v -map 1:a -shortest -c:v libx264 -preset slow -profile:v high -level:v 4.0 -pix_fmt yuv420p -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 -b:v 11.5M -minrate 11.5M -maxrate 11.5M -bufsize 23M -x264-params nal-hrd=cbr:force-cfr=1 -r 30 -c:a aac -b:a 256k -ar 48000 -ac 2 -movflags +faststart store.mp4`
- Plain `-b:v 11M` without CBR undershoots badly on flat UI footage (0.5 Mbps on a white screen); CBR with filler lands near Apple's 10 to 12 Mbps target. 886x1920 at 30 fps is 6720 macroblocks per frame, inside High@4.0 limits.
- Masters: render from Remotion as H.264 `--crf=12` (or ProRes 4444 if a brand needs it) into `studio/out/app-preview/<slug>/masters/`, then derive store, social and web files with ffmpeg.

## Apple App Preview specifications (checked 2026-10-07)

Source: App Store Connect Help, "App preview specifications" (developer.apple.com/help/app-store-connect/reference/app-preview-specifications), read on 2026-10-07.

- Length 15 to 30 s, up to 500 MB, up to 30 fps, default poster frame at 5 s (selectable in App Store Connect).
- H.264: `.mov`, `.m4v` or `.mp4`, progressive, up to High Profile Level 4.0, target 10 to 12 Mbps. ProRes 422 (HQ only) in `.mov`, about 220 Mbps VBR.
- Audio: stereo, AAC 256 kbps at 44.1 or 48 kHz, all tracks enabled. App Store Connect rejects a preview without an audio track (known upload error, sarunw.com "app preview contains unsupported or corrupted audio" and Apple forum threads), so every store file carries a silent stereo AAC track. The brief's "no sound" still holds: nothing audible.
- iPhone accepted resolution for every current class (iPhone Duo, Dynamic Island large and medium, Face ID large and medium): 886x1920 portrait, 1920x886 landscape. Older home button classes use 1080x1920 and 750x1334 and are scaled from the newer ones when missing. We deliver 886x1920 portrait only.
- App previews appear before screenshots; a preview with an aspect ratio different from the screenshots moves to "A Closer Look". Not available for iMessage apps. Processing up to 24 hours.
- Apple requires footage of the app itself, which is why the store cut shows only the interface; every store cut ends on the app's own launch screen (icon and name are real UI there).
- Google Play: the preview video is a YouTube URL (public or unlisted, embeddable, not age restricted, monetization off, no playlist or channel URL); portrait or landscape; only the first 30 s autoplay. Our 1920x1080 marketing cut fills this role. Feature graphic 1024x500 is the ASO brief's job.

## Tools on this machine

- ffmpeg and ffprobe 6.1.1 with `libx264`, `libvpx-vp9`, `aac`, `prores_ks`. Docker 29. Sudo blocked.
- Browsers: `/usr/bin/google-chrome` 148; Playwright browsers in `~/.cache/ms-playwright` (chromium 1194, 1208, 1243 and the matching headless shells). `studio/package.json` pins `playwright` 1.63.0 (revision 1243).
- `studio/node_modules` (shared identity studio, installed with the mutex): `fontkit`, `subset-font`, `@resvg/resvg-js`, `culori`, `svgo`, `playwright`. App preview scripts can import them because Node resolves upwards from `studio/app-preview/`.
- Fonts: `studio/identyfikacja/scripts/fonts-check.mjs` downloads Google Fonts families through `gh api` into `studio/out/fonts-src/<dir>/` (git-ignored). `studio/app-preview/scripts/fonts-verify.mjs [group]` (new, this commit) checks every planned instance at the outline level, measures the pixel grid of pixel fonts and writes a specimen PNG per instance to `studio/out/app-preview/fonts/`. Results are in `PLAN.md`.
- No Python fonttools; not needed (fontkit and subset-font cover it).
- Machine: 20 cores, 15 GB RAM shared with the ASO session and the rest of WSL.

## Hard lessons from today

- A resvg render of a specimen sized from a font with a 1 unit "pixel grid" asked for a 4000 px glyph run and pushed the process to 14.7 GB resident before the kernel killed it. On WSL one OOM kill can take down every session. Clamp every rasterized size, and run any resvg, Chromium or ffmpeg job that could balloon under `ulimit -v 4000000` (or `systemd-run --user --scope -p MemoryMax=4G`) and `timeout`.
- The session scratchpad under `/tmp/claude-1000/...` was wiped while this agent was paused. Keep anything worth keeping under `studio/out/app-preview/` (git-ignored).

## Rules that apply to every agent of this brief

- No comments in code (not JSDoc, not tests). No em dash (U+2014) or en dash (U+2013) in code or copy: `grep -rnP '[\x{2013}\x{2014}]' <changed files>` before every commit. No hyphen used as a pause.
- Copy in Polish, concrete, no lorem ipsum. Data invented but plausible for the trade. No ratings, awards, user reviews, download counts. No real brands, no Apple or Google logos, no official device renders, no photos. Phone frames are drawn by us. No SF Pro or any Apple system font; OFL fonts only, self hosted, OFL text published next to each.
- Footer of every page: „Projekt przykładowy. [Aplikacja] to zmyślona aplikacja. Projekt i wykonanie: Adrian Turbiński.” with the name linked to `/dla-klienta/#wzornik`. Nothing else about Adrian; never his e-mail or phone.
- The 12 styles of the other two briefs are off limits (Swiss modernism, neobrutalism, organic craft, luxury editorial, retro 1970s, generative identity, illustrated panorama, strong gradients with tilted devices, doodle annotations, memphis and pop art, dark premium glass, Y2K holographic chrome), and so is the Trzask look (near black green with lime).
- Do not use account MCP servers (Figma, Google Workspace, Asana, Command Center, Claude Docs).
- Servers bind to `127.0.0.1` only, ports 4320 to 4329 (table in `PLAN.md`). Stop everything you start with `pgrep -af <name>` and `kill <PID>`, never `pkill -f`. Do not run Remotion Studio as a server; review with `remotion still` and frame sheets instead.
- One heavy job at a time per worktree. Renders across all app preview worktrees are serialized with `flock -w 5400 /tmp/wz-app-preview-render.lock <command>`; Remotion runs with `--concurrency=4`.
- If a tool call is stopped by a hook message that starts with "Straż subskrypcji": stop at once, return status `interrupted`.
- Published files stay under 50 MB each; budget per app 14 MB published, hard cap 18 MB (details in `PLAN.md`). Masters never enter git.

## Foundation tooling (step F, 2026-10-07, cloud session)

Built and proven end to end on Kasownik. Every later app uses the same commands; heavy ones run under the shared lock (`flock /tmp/wz-heavy.lock ...`) with `NODE_OPTIONS=--max-old-space-size=4096`.

- Cloud facts: Node 22.22 at `/opt/node22/bin` (the package `engines` field now says `>=22`), Playwright Chromium 1194 at `/opt/pw-browsers` (the identity studio pins Playwright 1.63, so scripts pass `executablePath` `/opt/pw-browsers/chromium`; Remotion uses the headless shell `/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`, override with `WZ_HEADLESS` and `WZ_CHROMIUM`). `gh` has no valid token here, so `scripts/fonts.mjs` downloads Google Fonts files straight from `raw.githubusercontent.com/google/fonts/main/ofl/<dir>/<file>`; the older `fonts-verify.mjs` still needs `gh`.
- Install: `yarn --cwd studio/app-preview install --frozen-lockfile --mutex file:/tmp/yarn-portfolio.lock` (own `yarn.lock`, Remotion 4.0.534 exact), plus `studio` and `sites` installs for Playwright, subset-font and the site.
- One app = `src/apps/<slug>/` with `index.ts` (compositions `<slug>-store`, `<slug>-marketing`, `<slug>-tile`, stills `<slug>-screen`, `<slug>-icon`, `<slug>-board`, `<slug>-og`) and `meta.ts` (the only module scripts read: app, gallery, palette, type, motion presets, storyboard, marketing beats, tile, icon SVG, font files). `Root.tsx` finds every app through `require.context`, so adding an app touches no shared file.
- Animation is a pure function of the frame: `Scene.tsx` takes `frame` and returns the interface state, so the store cut, the phone in the marketing cut, the tile, the storyboard board and the stills all reuse it.
- `node scripts/pipeline.mjs <slug>` runs fonts, render, encode, sheets, validate and manifest (`--only render,encode` and so on). Single steps: `fonts.mjs`, `render.mjs <slug> --only stills,store,marketing,tile --concurrency 3`, `encode.mjs <slug> --only final,web,posters,images`, `sheets.mjs`, `validate.mjs`, `manifest.mjs`, `screens.mjs <slug> --port 432x` (page shots at 390 and 1440, overflow at 320, 768, 1024, reduced motion).
- Loops: the store and marketing masters are rendered once with the loop bridge appended; the store final and the social finals are the same masters cut to the storyboard length, the web loops keep the bridge. Store web loop is 442x960 (H.264 needs even sizes; 443 is odd).
- Render times on 4 cores, concurrency 3: store 705 frames at 886x1920 in about 200 s; each marketing format about 6 minutes (the headless shell rasterizes through SwiftShader); stills about 20 s.
- Masters from Remotion are full range (`yuvj420p`); every encode converts to limited range BT.709 through `scale=...:out_range=tv`.

## Quality control (step Q, 2026-10-08, cloud session)

Checked:

- `validate.mjs` for all six: spec of every store file (886x1920, 30/1, exact frame count, 20 to 25 s, H.264 High@4.0, yuv420p limited range BT.709, 11.4 Mbps CBR, silent stereo AAC 48 kHz), social finals, web loops under 4 MB with seam SSIM, posters, screens, storyboard board, icons, og, budget (largest Rygiel 13.58 MB of 14) and every file under 50 MB.
- Frame sheets of every store and 9:16 marketing cut, the first 2 s of all twelve cuts frame by frame, every overlay frame, the 25% thumbnail sheets and a distinctness board of three store and three marketing frames per app (`studio/out/app-preview/qa/distinct.png`).
- Pages and index in the sites build and in the deploy layout (Gatsby build plus `sites/dist` in `public/wzornik`, `gatsby serve` on 4320): full page shots at 320, 390, 768, 1024 and 1440, horizontal overflow, console errors, failed requests, fonts, links and video sources (HEAD), reduced motion (no video request), a word level check for one word last lines and words broken across lines, clipped boxes.
- Content: no e-mail or phone, no real brands, Adrian only in the footer line, no en or em dashes.

Fixed:

- Kasownik: the purchase overlay sat on the edge of the suggested ticket card; moved to top 320.
- Sztanga: the 9:16 support line slammed in at 140% and ran past the frame edge for four frames; its slam is now 8%. The long store caption is set at width 62.
- Poziomka: the streak and garden overlays covered the hopping strawberry and the plant; each overlay now has its own height.
- Południe: the amber wire to the phone crossed the 95% and balance tags in all three marketing formats; tags now draw above it. One letter words in the last headline are bound.
- Pages: file tables clipped at 768 to 1024 px (they now stack below 960 px); one word last lines in headings, captions, swatch notes and top bars (balanced wrapping, rewording, bound one letter words); Rygiel's alert title broke "e-mail" at 320 px; a full size link under every storyboard board.

Final results: `validate.mjs` all checks passed for all six; `yarn --cwd sites run check` 0 errors, 0 warnings, Prettier clean; `yarn --cwd sites test` 127 files, 1358 tests passed; `yarn --cwd sites build` 192 pages; `yarn gatsby clean && yarn build` exit 0; deploy layout: every page 200, fonts, favicon and all videos load, no console errors, no horizontal scroll from 320 to 1440 px, reduced motion loads no video, index shows six real tiles. Published app preview files 58.7 MB, the whole `/wzornik/` 117 MB, largest file far under 50 MB. Left as is: at 320 px a few long gallery captions in two column galleries end on one word (body text, five or more lines), and file names in the file tables break at their hyphens.
