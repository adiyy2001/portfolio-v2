# ASO: recon notes (phase 0)

Brief: `/home/adrian/root/side_projects/briefs/wzornik-aso.md`. Run rules: `/home/adrian/root/side_projects/briefs/agent-runs/wzornik-common.md` and `wzornik-run2.md` (run 2 overrides the common file: the base branch is `main`). All three are binding. The plan is `PLAN.md` next to this file. Written on 2026-10-07 by the setup and planning agent.

## State of the worktree

- Worktree `/home/adrian/root/side_projects/portfolio-v2-wz-aso`, branch `wzornik-aso`, created from `main` at `f9ceb55` with `git -C /home/adrian/root/side_projects/portfolio-v2 worktree add -b wzornik-aso /home/adrian/root/side_projects/portfolio-v2-wz-aso main`. The main checkout is never touched.
- Node 24.13.0 through nvm: `export PATH=~/.nvm/versions/node/v24.13.0/bin:$PATH`. Yarn 1.
- Every `yarn install` runs with `--mutex file:/tmp/yarn-portfolio.lock` and `--frozen-lockfile` where a lock file exists (all sessions share `~/.cache/yarn`). The root `yarn.lock` never changes in this branch: another session refreshes it on `main` for the Dependabot alerts. If a step seems to need a root dependency change, stop that step and report it.
- Baseline before any change, all green on 2026-10-07: `yarn install --frozen-lockfile` (23 s), `yarn --cwd sites install --frozen-lockfile` (4 s), `yarn --cwd studio install --frozen-lockfile` (1 s), `yarn gatsby clean && yarn build` (46 s, exit 0), `yarn --cwd sites build` (7 s, exit 0, 185 pages, 60 MB in `sites/dist`). `git status` stayed clean after the installs.
- Commit style: one lowercase line in plain English, no prefix, no trailers (`add the aso case study for <app>`).
- At the end the branch is merged into `main` by the merge agent, never into `rebrand-2026` (frozen at `f9ceb55`). Nothing is pushed by a Wzornik agent: a push to `main` deploys the public site.

## How the existing sample websites are built

`studio/identyfikacja/NOTES.md` ("How the existing sample websites are built") describes Trzask, the Astro project in `sites/`, the shared helpers and the checks in detail; it is still accurate. The short version:

- The Gatsby site in `src/` is served at `https://adrianturbinski.pl/` with no path prefix. The sample websites are one Astro 7 project in `sites/` (`base: '/wzornik'`, `trailingSlash: 'always'`, Preact islands only where needed), built by `.github/workflows/pages.yml`, copied to `public/wzornik` and deployed on every push to `main`.
- Trzask, the quality reference: thin routes in `sites/src/pages/trzask/`, everything else in `sites/src/sites/trzask/` (`Layout.astro`, `fonts.ts`, `styles.ts`, `components/`, `data/` with realistic catalogue data, `islands/` for the cart, filters and checkout, `lib/` with unit tests), published files in `sites/public/trzask/` (favicon, og image 1200x630, woff2 fonts with their OFL texts). What sets it apart: complete trade data (origins, roast profiles, grind, recipes, delivery rules), details that work (cart, discount codes, subscription), one interactive element with a purpose (the roast explorer) and the honest footer.
- The identity case studies (run 1) live under `/wzornik/identyfikacja/`: route `sites/src/pages/identyfikacja/<slug>/index.astro`, code in `sites/src/identyfikacja/<slug>/`, shared parts in `sites/src/identyfikacja/shared/`, files in `sites/public/identyfikacja/<slug>/` with a `manifest.json` read at build time, the six brands registered in `identityBrands` in `sites/src/shared/sites.ts`, the index tiles found with `import.meta.glob('../../identyfikacja/*/Tile.astro')`.
- Shared helpers: `sites/src/shared/link.ts` (`link(path)` adds `/wzornik`, `portfolio(path)` points at the Gatsby site), `SampleNote.astro` (the website footer), `sites/src/identyfikacja/shared/SampleLine.astro` (identity footer, says "zmyślona firma"; the ASO pages need their own line that says "zmyślona aplikacja").
- Checks that must stay green: `yarn --cwd sites run check` (Astro check plus Prettier over every file Prettier understands in `sites/`, including JSON in `public/`), `yarn --cwd sites test` (vitest), `yarn --cwd sites build`, `yarn lint` at the root.

## How identyfikacja registered its case studies (the pattern to follow)

- `#wzornik` on `/dla-klienta/` and `#swatch-book` on `/en/for-clients/`: `src/components/wzornik.js` has an `identity` array (`slug`, `name`, `trade`, `style`) and a block `<div className="wz-id">` after the nine site swatches, with the copy in `copy.pl.identity` and `copy.en.identity` (title, lead, `all` link text; the English lead says the pages are in Polish). Styles in `src/styles/wzornik.css` (`.wz-id`).
- `/wzornik/` index: one paragraph link in `sites/src/pages/index.astro` (`Identyfikacja wizualna: sześć realizacji`).
- Also touched at publication: `static/llms.txt`, `sites/README.md`, `REBRAND.md` (status line).
- ASO does the same in phase P only: an `aso` array and a block after the identity block (title "Screenshoty do sklepów" / "App store screenshots"), one more link on the `/wzornik/` index, the same three text files. The app-preview branch adds its own block next to it, so keep the ASO edit to one array, one copy object per language and one block, which keeps the merge to a trivial conflict at most.

## Store specifications (verified 2026-10-07)

Sources, read on 2026-10-07: App Store Connect Help, "Screenshot specifications" (`https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications`); Human Interface Guidelines, "App icons"; App Review Guidelines 2.3; Play Console Help, "Add preview assets to showcase your app" (`https://support.google.com/googleplay/android-developer/answer/9866151`); "Google Play icon design specifications" (`https://developer.android.com/distribute/google-play/resources/icon-design-specifications`); Play Console Help "Run A/B tests on your store listing"; Apple "Product Page Optimization".

### App Store

- **iPhone, our export: 1320 x 2868 portrait**, `.png`, `.jpg` or `.jpeg`, 1 to 10 per device size, "Images can't include alpha channels or transparencies." Apple has renamed the size groups: 1320 x 2868 (also 1290 x 2796 and 1260 x 2736) is accepted under "iPhone with Dynamic Island (large display)" (iPhone Air, 18 Pro Max, 17 Pro Max, 16 Pro Max, 16 Plus, 15 Pro Max, 15 Plus, 14 Pro Max).
- **What is required now:** "At least one screenshot for iPhone with Dynamic Island (medium display)" (1206 x 2622 or 1179 x 2556). It is filled by scaling: the medium group falls back to "iPhone with Face ID (large display)", which falls back to "iPhone with Dynamic Island (large display)", and "if your app's user interface is consistent across multiple device sizes and localizations, you only need to provide screenshots for the highest required resolution". One 1320 x 2868 set therefore covers every iPhone. 1320/2868 and 1206/2622 differ by less than 0.1 percent, so the scaled image is not distorted.
- New on the page: "iPhone Duo" (a foldable) with 1398 x 2034 (outer) and 2007 x 2853 (inner). Not in scope.
- **iPad 13": 2064 x 2752 portrait** (or 2048 x 2732), "Required if app runs on iPad". One app (Kruszec) gets this set as a showcase.
- **Search results:** the first three portrait screenshots appear next to the app in search, so screenshots 1 to 3 must tell the story alone.
- **App icon:** HIG lists for iOS, iPadOS and macOS a square 1024 x 1024 px layout, "Layered" style, appearances "Default, dark, clear light, clear dark, tinted light, tinted dark"; "the system applies masking to produce rounded corners". Icons are made in Icon Composer or an Xcode asset catalog and uploaded with the build (App Store Connect "Add an app icon"). Deliverable here: a flat 1024 x 1024 PNG, RGB, no alpha, square corners, plus the background and foreground layers as separate files for Icon Composer.
- **Review rules that shape the images (App Review Guidelines 2.3):** 2.3.3 screenshots show the app in use, not only title art, login or splash, and may carry text and image overlays; 2.3.7 metadata including screenshots should not include prices (of the app) or terms unrelated to the metadata type, no other apps' names; 2.3.8 everything 4+; 2.3.9 fictional account information, never data of a real person; 2.3.10 no names, icons or imagery of other mobile platforms (so App Store images show no Android status or navigation bar).
- **A/B test:** Product Page Optimization runs up to three treatments against the original page, one test at a time, up to 90 days. Our variant B is one such treatment.

### Google Play

- **Phone screenshots:** "JPEG or 24-bit PNG (no alpha)", minimum dimension 320 px, maximum 3840 px, "the maximum dimension of your screenshot can't be more than twice as long as the minimum dimension", up to 8 per device type, at least 2 across device types to publish. For recommendation formats: "at least four screenshots with minimum 1080px resolution", 9:16 portrait at least 1080 x 1920. **Our export: 1080 x 1920, 6 per language.** The page no longer states a file size limit for phone screenshots (8 MB is stated only for Android XR); the validator keeps 8 MB as the cap.
- **Highly recommended (affects eligibility for promotion, not publishing):** prioritise UI in the first three; "Taglines should not take up more than 20% of the image"; no ranking, awards, testimonials, price or promotion words ("Best", "#1", "Top", "New", "Discount", "Sale", "Million Downloads"); no call to action ("Download now", "Install now", "Play now", "Try now"); no small text over busy backgrounds; no people's fingers on devices; full battery, Wi-Fi and signal, no carrier or notifications in the status bar; avoid "device imagery (as this can become obsolete quickly or alienate some users)"; no store badges; localise taglines; alt text for every image, up to 140 characters. "Stylized screenshots that break UI across multiple uploaded images are allowed."
- **Feature graphic:** 1024 x 500, "JPEG or 24-bit PNG (no alpha)", required to publish. Keep the focal point and key elements (logo, app name, slogan, main UI) toward the centre and out of the cutoff zones; restrict background elements to the edges; avoid pure white, black or dark grey (they blend with the Play background); no device imagery; no ranking or price words. A play button is overlaid on the feature graphic when a preview video exists and does not autoplay. The page no longer gives the "central 80 percent" figure; we keep it as our safe zone and keep the centre circle free of text.
- **App icon:** 512 x 512, 32-bit PNG with alpha, sRGB, up to 1024 KB, full square; Google Play applies the mask (corner radius 30 percent of the icon size) and the drop shadow itself, so the asset has neither. No badges or text that suggest ranking, price, Play programmes or deals.
- **Tablets** (not in scope): at least 4 screenshots, 1080 to 7680 px, 16:9 or 9:16.
- **A/B test:** store listing experiments test icon, feature graphic and screenshots, up to two variants against the current listing (default graphics, or localised experiments in up to five languages), stopped automatically after six months.

### What this means for the six sets

- One 1320 x 2868 iPhone set per language covers every iPhone; the 1206 x 2622 medium size is not exported (decision in `PLAN.md`).
- Play images are separate compositions at 9:16, never resized Apple files.
- Play tagline blocks stay within 20 percent of the image area (the composition declares its headline box and the validator checks the area); App Store headlines may be larger but stay readable at 200 px wide.
- Play compositions show the app screen as a frameless card (no camera, no buttons); App Store compositions use the generic drawn phone. The feature graphic shows no device.
- Status bars: generic time `9:30`, full signal, Wi-Fi and battery, no carrier, no logos. App Store images use an iPhone like status bar without any Apple mark; Play images use a neutral status bar with no Google mark.
- Every image gets an alt text (PL and EN, up to 140 characters), shipped in the texts file in the ZIP.

## Rendering pipeline (to build in phase 2)

Canvas and scale, from the brief: App Store 440 x 956 CSS px at scale 3 (1320 x 2868), Google Play 360 x 640 at scale 3 (1080 x 1920), feature graphic 512 x 250 at scale 2 (1024 x 500). iPad 13": 1032 x 1376 at scale 2 (2064 x 2752; at scale 3 the height would be 917.33 CSS px). Icons: 1024 x 1024 and 512 x 512 at scale 1 from the SVG source.

Tooling checked on 2026-10-07:

| Tool                         | State                                                                                                                                                             |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Playwright 1.63.0            | in `studio/node_modules` (identyfikacja); Chromium revision 1243 is cached in `~/.cache/ms-playwright`, no download needed. `/usr/bin/google-chrome` also exists. |
| sharp                        | not installed anywhere in the repo; goes into the new `studio/aso/package.json` (prebuilt `@img/sharp-linux-x64`, no sudo needed)                                 |
| fontkit, subset-font, fflate | in `studio/node_modules`; the ASO package lists them again so it stands alone                                                                                     |
| ffmpeg 6.1                   | `/usr/bin/ffmpeg`, used here only to crop review images                                                                                                           |
| `gh`                         | logged in; fonts come from the `google/fonts` repo through `gh api`                                                                                               |

Notes for the foundation:

- `studio/aso/` gets its own `package.json` and `yarn.lock` (install with `yarn --cwd studio/aso install --mutex file:/tmp/yarn-portfolio.lock`, later with `--frozen-lockfile`). The app-preview branch changes `studio/package.json` at the same time, so a separate package keeps the two lock files from conflicting at the merge. Node resolves `studio/aso/node_modules` first and then `studio/node_modules`, so the phase 1 script `scripts/fonts-check.mjs` already runs with the identyfikacja install.
- Launch Chromium with `--force-color-profile=srgb --font-render-hinting=none`. Before a screenshot: `await document.fonts.ready` and `document.fonts.check()` for every family of the app, fail if one is missing.
- Grań's panorama is rendered as one strip (6 x 440 = 2640 CSS px wide, 7920 x 2868 px) and cut with sharp `extract` at multiples of 1320 px, so the seams match by construction. Chromium screenshots of that size work (91 MB of RGBA in memory).
- sharp: `flatten({ background })` then `removeAlpha()`, sRGB, no ICC profile other than sRGB. PNG output must be truecolour 8 bit (colour type 2, which is "24-bit PNG"); never palette PNG for store files. JPEG with mozjpeg and 4:4:4 chroma so text edges stay clean.
- Grain (Szyld) from SVG `feTurbulence` with a fixed seed renders deterministically in screenshots; it is the heaviest content for compression, so Szyld exports JPEG.

## Rules that apply to every agent

- No comments in code (also not JSDoc, also not in tests). No em dash (U+2014) and no en dash (U+2013) anywhere: `grep -rnP '[\x{2013}\x{2014}]' <changed files>` before every commit. Do not use a hyphen as a pause either.
- Copy: Polish first (Polish words are longer), English written anew, natural, never word for word. Headline: one benefit, at most 6 words, matching the screen below it. No "Nr 1", "najlepsza", "darmowa", rankings, ratings, stars, awards, press quotes, media logos, user reviews, download counts or promotional prices; no call to action. Finance: no promise of gain or rate of return, every number marked as sample data.
- One letter words (`z`, `w`, `i`, `a`, `o`, `u`) never end a line: join them to the next word with a no-break space. No one word last lines in headlines; no word broken in the middle (`hyphens: none`, `text-wrap: balance` for headlines).
- No real brands, no Apple or Google logos, no official device renders, no photographs, no real artists or album covers, no real businesses. Real geography (Sudety peaks and towns) is allowed. The phone frame is drawn in code.
- Fonts: OFL only, self-hosted, never SF Pro or any Apple system face, never Inter. Every family is checked on `ąćęłńóśźż ĄĆĘŁŃÓŚŹŻ` in every weight used (`node aso/scripts/fonts-check.mjs <slug> --sheet` from `studio/`, then look at `studio/out/aso/fonts/sheet.png`).
- Footer of every page: "Projekt przykładowy. [Aplikacja] to zmyślona aplikacja. Projekt i wykonanie: Adrian Turbiński." with the name linked to `/dla-klienta/` (`portfolio('/dla-klienta/#wzornik')`). Nothing else about Adrian, never his e-mail or phone.
- Do not use MCP servers tied to accounts (Figma, Google Workspace, Asana, Command Center, Claude Docs).
- Servers bind to `127.0.0.1` on the ASO ports 4330 to 4339 only. One browser per agent, one heavy render or build at a time per worktree, memory is 15 GB shared with other WSL work. Stop everything you start: `pgrep -af <name>`, then `kill <PID>`, never `pkill -f`. Limit Node with `NODE_OPTIONS=--max-old-space-size=1536` for dev and build.
- Lessons from the identyfikacja reviews (run 2 file): no horizontal scroll at 320, 390, 768, 1024 and 1440 px; nothing overlaps (footer, badges, captions, phone frames, store headlines); a regeneration step never drops content that was on the page before (compare before and after); colours in animations match the palette exactly.
- If a tool call is stopped by a hook message that starts with "Straż subskrypcji": stop, no retry, return status `interrupted`. After any interruption start from `git status`, `git log --oneline`, the checklist in `PLAN.md` and the files on disk.

## Parallel build

After the foundation commit (B1 Grań end to end), B2 to B6 can be built at the same time, each in its own worktree created from `wzornik-aso`. If the orchestrator runs them one by one instead, they run in the main ASO worktree and the merge steps fall away.

| App                  | Slug       | Worktree                                                 | Branch           | Port                      |
| -------------------- | ---------- | -------------------------------------------------------- | ---------------- | ------------------------- |
| B1 Grań (foundation) | `gran`     | `portfolio-v2-wz-aso`                                    | `wzornik-aso`    | 4330, and 4331 for its QA |
| B2 Szyld             | `szyld`    | `/home/adrian/root/side_projects/portfolio-v2-wz-aso-b2` | `wzornik-aso-b2` | 4332                      |
| B3 Margines          | `margines` | `.../portfolio-v2-wz-aso-b3`                             | `wzornik-aso-b3` | 4333                      |
| B4 Chochla           | `chochla`  | `.../portfolio-v2-wz-aso-b4`                             | `wzornik-aso-b4` | 4334                      |
| B5 Kruszec           | `kruszec`  | `.../portfolio-v2-wz-aso-b5`                             | `wzornik-aso-b5` | 4335                      |
| B6 Bis               | `bis`      | `.../portfolio-v2-wz-aso-b6`                             | `wzornik-aso-b6` | 4336                      |

Ports 4337 to 4339: distinctness board, publication, final verification. Create a brand worktree with `git -C /home/adrian/root/side_projects/portfolio-v2-wz-aso worktree add -b wzornik-aso-b<N> /home/adrian/root/side_projects/portfolio-v2-wz-aso-b<N> wzornik-aso`, then `yarn --cwd sites install --frozen-lockfile --mutex file:/tmp/yarn-portfolio.lock`, `yarn --cwd studio/aso install --frozen-lockfile --mutex file:/tmp/yarn-portfolio.lock`, and copy the font cache: `cp -rn /home/adrian/root/side_projects/portfolio-v2-wz-aso/studio/out/fonts-src/. studio/out/fonts-src/` (or set `WZ_FONTS_SRC` to that folder). Gatsby is not needed in a brand worktree.

Merging: commit in the brand worktree (`add the aso case study for <app>`), then in the main ASO worktree `git merge --no-ff wzornik-aso-b<N> -m "merge the <app> aso set into the aso branch"`. Folders are disjoint, so there is no conflict; if git reports one, a brand touched a shared file and the shared version wins. A brand worktree that needs newer shared files runs `git merge wzornik-aso` inside itself.

### Folder layout (everything an app owns is under its slug)

```
sites/src/pages/aso/index.astro                 SHARED  index of the six (tiles with the first 3 screenshots)
sites/src/pages/aso/<slug>/index.astro          app     thin route that renders Page.astro
sites/src/aso/apps.ts                           SHARED  registry of the six apps (slug, name, styleId, style, category), all registered up front
sites/src/aso/shared/                           SHARED  Shell (head, noindex, canonical, og, icons, skip link), SampleLine, StoreStrip,
                                                        SearchMock, LangSwitch island, AbPair, Downloads, manifest.ts, types.ts, TileStub
sites/src/aso/<slug>/                           app     Page.astro, Tile.astro, app.ts (meta), content.ts (case study copy), styles, islands, tests
sites/src/aso/<slug>/copy/pl.json, en.json      app     THE text definition: headlines, subtitles, alt texts and all UI data per language
sites/public/aso/<slug>/                        app     favicon.svg, og.png, fonts/, web/ (WebP previews), icons/, feature/,
                                                        <slug>-aso.zip, manifest.json
studio/aso/NOTES.md, PLAN.md                    SHARED
studio/aso/package.json, yarn.lock              SHARED  playwright 1.63.0, sharp, fflate, fontkit, subset-font, roughjs
studio/aso/lib/, studio/aso/scripts/            SHARED  render, export, validate, board, thumbs, seams, web, zip, manifest, screens, distinct, guard
studio/aso/kit/                                 SHARED  generic phone frame, screen card, status bars, composition harness, base CSS
studio/aso/apps/<slug>/                         app     STATUS.md, app.json (palette, fonts, export format, budget), theme.css (mini design
                                                        system), screens/ (UI screens), compositions for appstore, play, feature (and ipad),
                                                        icon sources, art (SVG)
studio/out/aso/<slug>/                          app     git-ignored masters, boards, thumbnails, seam crops, page shots
```

The registry lives in `sites/src/aso/apps.ts`, not in `sites/src/shared/sites.ts`, because the app-preview branch will register its apps in the shared file too. The case study pages import `copy/pl.json` and `copy/en.json` directly, so the headlines on the page and in the images come from the same file. Generated JSON in `sites/public/aso/` is written through Prettier (`sites` has it as a dev dependency) by the manifest step, so `sites/.prettierignore` stays untouched.

### Shared files (an app agent never edits them)

`sites/src/pages/aso/index.astro`, `sites/src/aso/apps.ts`, `sites/src/aso/shared/`, `sites/src/shared/`, `sites/astro.config.mjs`, `sites/.prettierignore`, `sites/package.json`, the Gatsby site (`src/`, `static/`), `studio/aso/lib/`, `scripts/`, `kit/`, `package.json`, `yarn.lock`, `PLAN.md`, `NOTES.md`, the root `.gitignore`, `REBRAND.md`, everything under `studio/identyfikacja/`. A needed change goes to the app's `STATUS.md` under "Shared change requests"; the app works around it in its own folder until the merge step decides.

### STATUS.md of an app

`studio/aso/apps/<slug>/STATUS.md` with the sections "Done" (the deliverables below as a checklist), "Decisions" (for Adrian, with the reason), "Shared change requests", "Open issues", "Review scores". The merge step ticks the line in the checklist at the top of `PLAN.md` and copies the decisions into "Decisions for Adrian".

### Deliverables and file names per app

Names come from one function in `studio/aso/lib/convention.mjs` and `validate.mjs` checks them. `<ext>` is the app's export format (`png` or `jpg`).

| Group                   | Files (inside the ZIP, and in `studio/out/aso/<slug>/export/`)                                                                                                                                                                                        | Size        |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| App Store iPhone        | `app-store/pl/<slug>-appstore-pl-01.<ext>` to `-06`, same for `en`                                                                                                                                                                                    | 1320 x 2868 |
| Google Play phone       | `google-play/pl/<slug>-play-pl-01.<ext>` to `-06`, same for `en`                                                                                                                                                                                      | 1080 x 1920 |
| Variant B               | `variant-b/<slug>-appstore-pl-01b.<ext>`, `<slug>-play-pl-01b.<ext>`, same for `en`                                                                                                                                                                   | as above    |
| Feature graphic         | `feature-graphic/<slug>-feature-pl.<ext>`, `-en`                                                                                                                                                                                                      | 1024 x 500  |
| Icons                   | `icons/<slug>-icon-appstore-1024.png` (RGB, no alpha), `icons/<slug>-icon-play-512.png` (RGBA, opaque, up to 1024 KB), `icons/<slug>-icon.svg`, `icons/layers/<slug>-icon-background.png`, `<slug>-icon-foreground.png` (1024, foreground with alpha) |             |
| iPad 13" (Kruszec only) | `ipad/pl/<slug>-ipad-pl-01.<ext>` to `-06`, same for `en`                                                                                                                                                                                             | 2064 x 2752 |
| Texts                   | `<slug>-teksty.csv` (slot, store, headline and subtitle PL and EN, alt text PL and EN), `teksty/pl.json`, `teksty/en.json` (copies of the language files)                                                                                             |             |

Published next to the page (`sites/public/aso/<slug>/`): `web/` WebP previews of every screenshot at 480 px wide (App Store) and 400 px wide (Play), feature graphics at 1024 px WebP, icons at 256 px PNG, `og.png` 1200 x 630, `favicon.svg`, `fonts/` (woff2 subsets and OFL texts), `<slug>-aso.zip`, `manifest.json` (file list with dimensions, formats and byte sizes, read by the page).

### Validator (`validate.mjs`, any error stops the build)

- Exact dimensions per group; PNG truecolour 8 bit with 3 channels and no alpha, or baseline or progressive JPEG with 3 channels; sRGB; the Play icon is RGBA, fully opaque, at most 1024 KB.
- Play: sides 320 to 3840 px, long side at most twice the short side, each file at most 8 MB. Every store file at most 8 MB.
- Counts: 6 per store and language, 4 variant B files, 2 feature graphics, the icons, 12 iPad files for Kruszec, nothing extra.
- The ZIP contains exactly the files listed in the manifest, and the texts file has a row for every image.
- Copy checks on `copy/*.json`: every headline at most 6 words in both languages, no em or en dash, a banned word list (`najlepsz`, `nr 1`, `#1`, `numer jeden`, `darmow`, `za darmo`, `best`, `top`, `free`, `nowość`, `new`, `promocja`, `sale`, `rabat`, `discount`, `pobierz teraz`, `download now`, `install now`, `gwarant`, `guarantee`), plus for Kruszec `zysk`, `zarob`, `stopa zwrotu`, `zwrot`, `return`, `profit`, `earn`. Matches are whole words, case insensitive.
- Play compositions declare their headline box; its area must be at most 20 percent of the canvas. Grań declares the foreground boxes of each frame; none may cross a seam (24 CSS px margin).
- Budget: published folder of an app at most 20 MB (hard cap 25 MB), ZIP at most 15 MB, the whole ASO extension at most 130 MB.

### Review outputs (`studio/out/aso/<slug>/`)

- `boards/<store>-<lang>.png`: all screenshots of a set side by side in store order (`board.mjs`).
- `thumbs/<store>-<lang>.png`: the first three at 200 px wide (`thumbs.mjs`), for the thumbnail test.
- `seams/` (Grań only): every seam at 400 percent, 64 px either side (`seams.mjs`).
- `shots/`: page screenshots at 390 and 1440 px in slices plus a scroll width probe at 320, 360, 390, 768, 1024, 1280 and 1440 px and the console errors (`screens.mjs <slug> --port <port>`).
- `studio/out/aso/distinct.png`: the first three of all six apps on one board (`distinct.mjs`).

## Fonts (phase 1 check, all green)

`studio/aso/scripts/fonts-check.mjs` downloads each family from `google/fonts` (via the identyfikacja helper) into `studio/out/fonts-src/`, checks every instance used by each app at the outline level (glyph present and not empty after `getVariation`), prints one line per instance and renders `studio/out/aso/fonts/sheet.png` with the Polish set and a sample sentence per instance. Result on 2026-10-07: 29 of 29 instances pass, and the sheet was looked at.

| App      | Families and instances                                          | Missing typographic glyphs |
| -------- | --------------------------------------------------------------- | -------------------------- |
| Grań     | Overpass 400, 600, 800, 900                                     | none                       |
| Szyld    | Mona Sans 400, 600, 700 at width 100; 800, 900 at width 125     | none                       |
| Margines | Caveat 500, 600, 700; Lexend 400, 500, 700                      | `→` in both                |
| Chochla  | Bangers 400; Figtree 500, 700, 800                              | `→` in Bangers             |
| Kruszec  | Instrument Serif 400 and italic 400; Manrope 400, 500, 600, 700 | `→` in Instrument Serif    |
| Bis      | Modak 400; Quicksand 500, 600, 700                              | `→` in both                |

Arrows are always drawn as SVG. Rejected after the check: Lilita One, Bowlby One, Bagel Fat One, Chango, Fredoka, Sniglet and Mochiy Pop One (missing Polish letters); Rubik Bubbles (passes, but its foam outline turns to noise at headline size and under a chrome fill); DynaPuff and Gluten (pass, but `Ł` has overlapping contours that show as a crossing line under an outline); Titan One (passes, too close to Modak's puffy shape). None of the chosen families is used by the nine sample websites, the six identity brands, the Gatsby site or the app-preview candidates seen in its worktree on 2026-10-07 (Anybody, Archivo, Azeret Mono, Bytesized, Jersey 10, Micro 5, M PLUS Rounded 1c, Onest, Oxanium, Pixelify Sans, Press Start 2P, Tiny5, VT323).

Bangers and Modak need care: Bangers' acute accents on capitals (`Ś`, `Ź`, `Ć`, `Ń`, `Ó`) rise well above the cap height, so headline line height is at least 1.2 and a speech bubble has top padding for them; Modak has very tall vertical metrics, so set `line-height` explicitly and measure the box. Caveat has a small x height: headlines in Caveat are set at least 1.3 times the size a sans would need.

## Name checks

Real web searches on 2026-10-07 (WebSearch, US based, thin for small Polish firms), each name with its category in Polish and English, plus one query limited to `apps.apple.com` and `play.google.com`. Results are in `PLAN.md` per app. This is evidence of absence, not a legal clearance.

## How to build an app (written after Grań, the foundation)

### Environment (cloud session, 2026-10-07)

- Node 22 at `/opt/node22/bin` works (the scripts use `import.meta.main`, present since Node 22.18; `studio/aso/package.json` now says `>=22`). Install with `yarn --cwd studio/aso install --frozen-lockfile --ignore-engines --mutex file:/tmp/yarn-portfolio.lock` and the same for `sites`; set `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`.
- Chromium: `lib/browser.mjs` uses Playwright's own browser if it exists, otherwise `/opt/pw-browsers/chromium`, or `WZ_CHROMIUM` if set.
- `capped.sh` caps the Node heap (`NODE_OPTIONS=--max-old-space-size=4096`) and turns on the proxy for Node `fetch` (`NODE_USE_ENV_PROXY=1` and the proxy CA). `systemd-run` does not work in the cloud and `prlimit --as` breaks Node (WebAssembly reserves address space) and Chromium, so the cap is the heap limit only. Wrap every heavy step in `flock /tmp/wz-heavy.lock`.
- Fonts come from `raw.githubusercontent.com/google/fonts` through `lib/fontsrc.mjs` (no `gh` login needed) into `studio/out/fonts-src/`.

### Files an app owns

- `studio/aso/apps/<slug>/app.json`: name, style, format (`png` or `jpg`), `background` (flatten colour), `themeColor`, palette, fonts (`dir`, `file`, `instances`), `strip: true` only for a panorama, `ipad: true` only for Kruszec.
- `studio/aso/apps/<slug>/theme.css`: the mini design system used by the screens.
- `studio/aso/apps/<slug>/screens.mjs`: the UI screens as functions `(ui, { lang, store, landscape }) => html`, drawn at 390 x 844 CSS px (844 x 390 in landscape). The kit adds the status bar (50 px for App Store, 36 px neutral for Play), so screens start their content below it.
- `studio/aso/apps/<slug>/compose.mjs` exports:
  - `jobs(app)`: render jobs `{ id, store, lang, variant?, width, height, scale, frames?, frameWidth?, css, body, outputs: [{ slot, variant?, frame }] }`. One job per store and language, one per variant B (its body differs only in frame 1), one per feature graphic. A non panorama app uses `frames: 1` and one job per screenshot, or a strip of six frames placed side by side; both work.
  - `iconSvg(layer, size)`: `full`, `background` and `foreground` SVG at 1024.
  - `sheets(app)` (optional): review sheets, rendered to `studio/out/aso/<slug>/sheets/`.
  - `ogSource()` (optional): which screenshots make `og.png`.
- `sites/src/aso/<slug>/copy/pl.json`, `en.json`: headlines, alt texts, variant B, feature line and every UI string. Same shape as Grań's. Run Prettier on them.
- `sites/src/aso/<slug>/`: `Page.astro`, `Tile.astro`, `app.ts`, `content.ts` (wrap in `glueDeep`), `styles.ts`, a test; the route `sites/src/pages/aso/<slug>/index.astro`.

### Kit (`studio/aso/kit/kit.mjs`)

`phone({ screen, width, x, y, rotate, landscape })` draws the generic phone (graphite body, pill camera, side buttons, no brand); `card({ ... })` the frameless Play screen card; `statusBar('ios' | 'neutral')`; `headline({ value, lang, x, y, width, size, align, className })` marks the box with `data-box="headline"` and glues one letter words; anything else that must stay inside its frame gets `data-box="fg"`. `glue()` and `esc()` for text. Headlines get `text-wrap: balance`.

### Order of steps

`node scripts/pipeline.mjs <slug> [--from step] [--only a,b] [--skip a,b]` runs `fonts, render, export, web, zip, manifest, validate, board, thumbs, seams`. Then `node scripts/distinct.mjs`, Prettier over `sites/src/aso`, `sites/src/pages/aso` and `sites/public/aso`, `yarn --cwd sites run check`, `yarn --cwd sites test`, `yarn --cwd sites build`, `node scripts/screens.mjs <slug> --port <port>` (page slices plus the scroll probe at 320 to 1440 px; `--index` shoots `/aso/`), `node scripts/guard.mjs --app <slug>` and `node --test "lib/*.test.mjs"`.

Look at: `sheets/ui-<lang>.png` (all screens), `boards/*.png`, `thumbs/*.png` (first three at 200 px), `seams/*.png` (Grań only), `shots/page-*.png`.

### Lessons from Grań

- The validator found real problems every time: seam margins after rotation (a rotated phone's box grows by about 25 px), one word last lines, a Play ledge that crossed a seam and was cut by the front layer (the seam column check caught it at 22 times the baseline). Run it before looking at anything.
- One word last lines: with 5 or 6 word headlines, aim for two lines at a size the longest headline of both languages fits; Overpass 900 needs about 23 px per character at 41 px. Rephrase rather than shrink one headline alone.
- A headline box's vertical overflow is ignored (accents above capitals overflow a tight line height on purpose); horizontal overflow is an error. Give `data-fixed` to a box whose height must hold.
- Things that sit in front of phones (meadow strips, rocks, clouds) live in a second SVG layer above the devices; whole terrain bands go into that layer clipped to whole frames, so the clip edge always falls on a seam and stays invisible.
- Prettier resolves `prettier-plugin-astro` from the working directory; the manifest step formats JSON with `plugins: []`.
- The page needs `scroll-padding-inline` on the strips, `glue()` on every headline shown outside the images, and the kicker text wrapped in its own span inside flex rows.

### Lessons from Szyld (B2)

- 3D perspective: put each device in its own perspective stage (`perspective` on a full frame wrapper, `transform` on the device through `kit.phone({ transform })`). Do not use `transform-style: preserve-3d` with things standing on a tilted screen: Chromium then rasterises the tilted screen at low resolution and may sort a child behind the screen plane. Draw such overlays in 2D and place them with a small inline script on points projected from markers inside the screen (`getBoundingClientRect` of an SVG `rect` in the screen gives the projected position).
- A device that bleeds off the frame takes `box: 'device'`, so the canvas check ignores it; everything that must stay whole (tags, badges, cards) keeps `data-box="fg"`.
- A headline rotated by -90 degrees gets `data-vertical`, so the one word last line check groups words by column.
- A nested `<svg>` icon inside an SVG `<g>` needs explicit `width` and `height`, or it fills the parent SVG.
- Grain from `feTurbulence` (base frequency 0.8 to 0.85 per CSS px, overlay at about 0.38) costs about 0.5 MB per App Store JPEG at quality 90; the whole set with 30 images stays at 13 MB.
- The texts files in the ZIP are copies of `copy/*.json`: run Prettier on the copy files before the export step, or the validator reports the ZIP as stale after formatting.


### Lessons from Margines (B3)

- Annotations that point at UI must be measured, not guessed: `apps/margines/ink.mjs` inlines rough.js into the page, waits for the fonts, reads `getBoundingClientRect` of the `data-mark` element and its untransformed size (`offsetWidth` times the device scale), draws in a rotated frame and resolves `window.wzReady`; `settle` waits for it. Stickers are placed the same way (`places`).
- A circle around a text block needs the ellipse about 1.1 to 1.2 times the block, or it cuts the first and last letters of a multi line sentence. Leave more than 6 CSS px under a word for a double underline (the paragraph line height went to 2.05).
- Rotated pieces (deck cards, scraps) grow their bounding box; the canvas check catches a corner leaving the frame.
- Caveat at 58 CSS px holds about 15 characters per line in a 360 px box; three line headlines are fine, but check the one word last line in both languages before drawing anything around the headline.
- The heavy lock is shared with the app preview session; a Remotion render can hold it for many minutes, so batch Playwright work into one pipeline run.

### Lessons from Chochla (B4)

- `styleOf` turns every number into px: pass unitless values (`line-height`, `font-weight`) as strings, or they are silently dropped.
- Shapes that depend on text (speech bubbles) are drawn in the page after the fonts load, around `Range.getBoundingClientRect()` of the headline, as one closed path with the tail, so a longer language gets a bigger bubble. A superellipse with exponent 4 to 6 encloses the text box when scaled by `2^(1/n)`; account for that growth in the frame width.
- Let the page fail the render: a short check after layout that writes `console.error` when decoration touches a device margin turns a layout rule into a validator. A soft mode (`CHOCHLA_SOFT=1`) that records the problems on `body` instead makes iterating possible.
- Bangers needs `text-transform: uppercase`, line height 1.2 and a little top padding for the accents; its width is about 0.46 em per letter, so check two line breaks against the box width before drawing.
- On the page, a light title over a starburst disappears where the letters leave the burst body; give the title an outline (`-webkit-text-stroke` with `paint-order: stroke fill`) and keep its padding inside the inner radius. `text-wrap: pretty` on paragraphs removes most one word last lines.

### Lessons from Kruszec (B5)

- Blur, glow and the iPad set make PNG heavy (42 MB ZIP); JPEG at 90 with 4:4:4 took it to 8.2 MB. Measure the PNG ZIP first, then switch `format` in `app.json`.
- A line that continues a chart out of the device is drawn in the page from two invisible markers in the screen chart (`data-chart`, `data-i`, `data-v`): their `getBoundingClientRect` gives the x per month and y per value after scaling, so any device size or language lines up. Let the page `console.error` when the line does not reach the frame edge.
- `backdrop-filter` and `filter: blur()` render in headless Chromium; a blurred device (`--blur`) behind a sharp glass card gives depth of field without extra art.
- The iPad set needs its own device frame (in the app folder) and a smaller logical screen (900 x 1200 points) scaled into it, or the dashboard text is too small and half the screen stays empty.
- Floating pills around a ring: `translateX(-50%)` pills near the frame edge fail the canvas check; nudge them inward per store.


### Lessons from Bis (B6)

- Chrome lettering: keep the headline as HTML text with the key words in transparent spans, then draw SVG `<text>` on top of each word from `Range.getClientRects()`. The baseline is `top + ratio * height`, with the ratio measured once in the page from a zero size inline block. Draw the dark edge as a separate stroked copy under the gradient fill, so overlapping contours never show and the edge stays outside the letter.
- Modak is wide (about 0.55 em per character, "Przypomnimy," is 6.65 em): measure candidate lines with `fontkit` `layout().advanceWidth` before picking the size, then glue the last two words so balance cannot leave one word alone. Do not glue across a word that already holds a no-break space, or the last line gets too long.
- A multi word accent must be split into one span per word, or `white-space:nowrap` on the span blocks the line break and the headline overflows.
- `\S` in JavaScript treats a no-break space as whitespace, so glued words still count as two words in the line check.
- Avatars on an orbit: give the ellipse enough height (ry about 0.55 of rx) or the bubbles on one side stack and hide each other's names.
