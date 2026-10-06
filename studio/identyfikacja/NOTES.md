# Identyfikacja: recon notes (phase 0)

Brief: `/home/adrian/root/side_projects/briefs/wzornik-identyfikacja.md`. Run rules: `/home/adrian/root/side_projects/briefs/agent-runs/wzornik-common.md`. Both are binding. The plan is `PLAN.md` next to this file. Written on 2026-10-06 by the setup and planning agent.

## State of the worktree

- Worktree `/home/adrian/root/side_projects/portfolio-v2-wz-identyfikacja`, branch `wzornik-identyfikacja`, created from `rebrand-2026` at `86eb7bd`.
- The main checkout `/home/adrian/root/side_projects/portfolio-v2` is never touched. The merge step at the very end is the only exception, and it does not push.
- Node 24.13.0 through nvm: `export PATH=~/.nvm/versions/node/v24.13.0/bin:$PATH`. Yarn 1.
- Baseline before any change, all green: `yarn install --frozen-lockfile` (13 s), `yarn --cwd sites install --frozen-lockfile`, `yarn gatsby clean && yarn build` (about 30 s, exit 0), `yarn --cwd sites build` (5 s, exit 0, 12 MB in `sites/dist`).
- Commit style of this repo: one lowercase line in plain English, no prefix, no trailers (`add the identity case study for <brand>`).

## How the existing sample websites are built

- The portfolio is a Gatsby site in `src/` served at `https://adrianturbinski.pl/` with no path prefix. The nine sample websites are one Astro 7 project in `sites/` with its own `yarn.lock` and `base: '/wzornik'`, `trailingSlash: 'always'`, Preact islands only where a page needs them. `.github/workflows/pages.yml` builds Gatsby, builds `sites/`, copies `sites/dist` to `public/wzornik` and deploys on every push to `rebrand-2026`. Nothing in the workflow changes for this work.
- Trzask, the quality reference, is split in four places: pages in `sites/src/pages/trzask/` (thin `.astro` files), everything else in `sites/src/sites/trzask/` (`Layout.astro` with all head tags, `fonts.ts`, `styles.ts` that inlines CSS bundles through `?inline`, `components/`, `data/`, `islands/`, `lib/` with unit tests, `store/`), published files in `sites/public/trzask/` (`favicon.svg`, `og.png` 1200x630, `fonts/*.woff2` plus the OFL texts). Fonts are loaded with `@font-face` from `link('/trzask/fonts/...')` plus `size-adjust` fallback faces and `<link rel="preload">` for the two main faces.
- Shared parts of the whole Astro project: `sites/src/shared/link.ts` (`link(path)` adds the base, `portfolio(path)` points at the Gatsby site), `sites/src/shared/SampleNote.astro` (the footer sentence, links to `/dla-klienta/#wzornik`), `sites/src/shared/sites.ts` (the list on the `/wzornik/` index page `sites/src/pages/index.astro`).
- Every sample page carries `<meta name="robots" content="noindex">`, canonical, Open Graph with a 1200x630 image, `theme-color`, a skip link, `lang="pl"`.
- Checks that must stay green: `yarn --cwd sites run check` (this is `astro check && prettier --check .`; plain `yarn check` is Yarn's own command), `yarn --cwd sites test` (vitest, `--passWithNoTests`), `yarn --cwd sites build`. Prettier config: print width 100, single quotes, trailing commas, `arrowParens: avoid`, `prettier-plugin-astro`. Prettier checks every file it understands in `sites/`, including `.json`, `.html`, `.css` under `public/`. `sites/.prettierignore` lists `dist`, `.astro`, caches and `node_modules`. The foundation agent adds `public/identyfikacja` to it (generated JSON and HTML are not hand formatted), so brand agents never touch that file.
- The `#wzornik` section of the client edition lives in the Gatsby site: `src/components/wzornik.js` (a `copy` object with `sites[]` and Polish and English text, a `mocks` map of nine components in `src/components/wzornik/`, markup of an accordion "swatch book"), styles in `src/styles/wzornik.css`, used by `src/pages/dla-klienta.js` (`<Wzornik lang="pl" />`, anchor `#wzornik`) and `src/pages/en/for-clients.js` (`<Wzornik lang="en" />`, anchor `#swatch-book`). Each swatch links to `withPrefix('/wzornik/<slug>/')`. `static/llms.txt` also lists the sample websites. Only the publication step edits these files.
- The `/wzornik/` index (`sites/src/pages/index.astro`) lists the nine sites from `sites.ts` in `Bespoke Serif` and `Schibsted Grotesk` taken from the Gatsby `static/fonts/`. Publication adds one link to `/wzornik/identyfikacja/`.
- `sites/README.md` says the names were checked in Wrocław; publication adds the identity section there.

## Tooling (installed and checked)

`studio/` has its own `package.json` and `yarn.lock`, installed with `yarn --cwd studio install --frozen-lockfile`. It is not a dependency of the site and `yarn build` never touches it. `studio/node_modules` and `studio/out/` are git-ignored.

| Package | Use |
|---|---|
| `playwright` 1.63.0 | screenshots, HTML to PDF, frame capture. Chromium revision 1243 is already in `~/.cache/ms-playwright`, no download needed. `/usr/bin/google-chrome` also exists. |
| `fontkit` 2 | open TTF and variable fonts, check glyph coverage, kerning and OpenType features (`smcp`, `c2sc`, `tnum`), turn text into SVG paths (`font.layout()`, `glyph.path.toSVG()`) |
| `subset-font` | subset to woff2 for the site, keeps variation axes, and pins a variable font to one weight (`variationAxes: { wght: 800 }`) |
| `svgo` 4 | optimise logo SVG |
| `@resvg/resvg-js` | SVG to transparent PNG without a browser (no `<text>` is needed because glyphs are paths) |
| `culori` | HEX, RGB, OKLCH, WCAG contrast |
| `pdf-lib` | read PDF page sizes and page counts in the validation script |
| `fflate` | deterministic ZIP |

System tools present: `ffmpeg` 6.1 with `libx264` and `libvpx-vp9`, `pdffonts`, `pdfinfo`, `pdftoppm` (poppler), `zip`, `unzip`, `python3` without fonttools. Not present and not needed: `qpdf`, `gs`, `rsvg-convert`, `inkscape`, ImageMagick, `cwebp`. Sudo is blocked.

Findings that save time:

- Fonts come from the `google/fonts` GitHub repo through `gh api` (already logged in). `studio/identyfikacja/scripts/fonts-check.mjs <dir>...` downloads the TTFs and `OFL.txt` of each family into `studio/out/fonts-src/<dir>/` and prints the Polish glyph check (`ąćęłńóśźż ĄĆĘŁŃÓŚŹŻ` plus `„”’…·×→°€`). `fonts-verify.mjs [brand]` re-checks every weight and width actually used by a brand at the instance level (a glyph must exist and have an outline, not only a cmap entry). All eleven chosen families are already downloaded into `/home/adrian/root/side_projects/portfolio-v2-wz-identyfikacja/studio/out/fonts-src`. Another worktree copies them with `cp -rn <that folder>/. studio/out/fonts-src/` or sets `WZ_FONTS_SRC` to it.
- A variable font in a Chromium PDF is embedded as Type 3 (`pdffonts` shows `Type 3`, embedded yes). A font pinned to one weight with `subset-font` (`variationAxes`) embeds as `CID TrueType` and the PDF is smaller. Use pinned instances for the brand book, business cards and letterhead. Make one pinned file per weight and a `@font-face` per weight, passed to the page as `data:` URIs so the PDF does not depend on a server.
- `page.pdf({ preferCSSPageSize: true })` with `@page { size: 1920px 1080px; margin: 0 }` gives 1440 x 810 pt pages (1920 px at 96 dpi). The brand book check is "page size ratio 16:9 and 1920x1080 CSS px", not 1920 pt.
- The arrow `→` is missing from Young Serif, Karla, Noto Serif Display and Rammetto One (every other chosen family has it, and all eleven have `„”’…·×°€`). Draw arrows as SVG, never as a text character, so no brand depends on this.
- Web search (WebSearch through ToolSearch) is US-only and thin for Polish small businesses. The name checks in `PLAN.md` are real searches with no match found, not a legal clearance.

## Rules that apply to every agent

- No comments in code (also not JSDoc, also not in tests). No em dash (U+2014) and no en dash (U+2013) in code or copy: `grep -rnP '[\x{2013}\x{2014}]' <changed files>` before every commit. Do not use a hyphen as a pause either; use a colon, comma or full stop.
- Copy is Polish and concrete: no lorem ipsum, no "Twoja firma", no invented awards, reviews, sales numbers or media logos. Contact data is made up: e-mails in `.example`, phones like `+48 71 000 00 07`. Nothing about Adrian beyond the footer line, never his e-mail or phone.
- Footer of every page: "Projekt przykładowy. [Marka] to zmyślona firma. Projekt i wykonanie: Adrian Turbiński." with the name linked to `/dla-klienta/` (use `SampleNote` or the same link through `portfolio('/dla-klienta/#wzornik')`).
- Everything visual is made with code: SVG, CSS, canvas. No stock photos, no outside logos or illustrations, no icon libraries. Fonts only OFL, self-hosted woff2, with the OFL text published next to them.
- Do not touch the other 12 styles of the three briefs (iOS light, kinetic type, dark neon, claymorphism, pixel 8-bit, isometric data, illustrated panorama, strong gradients with tilted devices, doodle, memphis and pop-art, dark premium glass, Y2K chrome) and not the Trzask look.
- Servers bind to `127.0.0.1` only. One browser per agent. Heavy renderers (brand book PDF, MP4 and WebM) run one at a time in a worktree. Stop every server, browser and container you started: `pgrep -af <name>`, then `kill <PID>`, never `pkill -f`.
- Memory: 15 GB shared by up to 12 agents. Prefer `astro build` plus `astro preview` for review runs; use `astro dev` only while editing and stop it. Limit Node with `NODE_OPTIONS=--max-old-space-size=1536` for dev and build.
- If a tool call is stopped by a hook message that starts with "Straż subskrypcji": stop at once, no retry, return status `interrupted`.
- Published files must stay under 50 MB each. Budget per brand: about 12 MB published in total, hard cap 16 MB, so the six brands stay near 70 MB and the whole 18 project extension under 300 MB. Brand book PDF up to 6 MB, each animation up to 1.5 MB, ZIP up to 8 MB (it contains the brand book PDF and the stationery PDFs, not the videos).

## Parallel build

After the foundation commit, brands B2 to B6 are built at the same time by five agents. Each one works in its own worktree and on its own branch, and each brand lives only in its own folders, so the branches merge into `wzornik-identyfikacja` without conflicts.

| Brand | Slug | Worktree | Branch | Port |
|---|---|---|---|---|
| B1 Skibka (foundation) | `skibka` | `portfolio-v2-wz-identyfikacja` (main identity worktree) | `wzornik-identyfikacja` | 4310, and 4311 for its QA and review |
| B2 Nośna | `nosna` | `/home/adrian/root/side_projects/portfolio-v2-wz-identyfikacja-b2` | `wzornik-identyfikacja-b2` | 4312 |
| B3 Rzut | `rzut` | `.../portfolio-v2-wz-identyfikacja-b3` | `wzornik-identyfikacja-b3` | 4313 |
| B4 Klamra | `klamra` | `.../portfolio-v2-wz-identyfikacja-b4` | `wzornik-identyfikacja-b4` | 4314 |
| B5 Cuvée | `cuvee` | `.../portfolio-v2-wz-identyfikacja-b5` | `wzornik-identyfikacja-b5` | 4315 |
| B6 Wolnobieg | `wolnobieg` | `.../portfolio-v2-wz-identyfikacja-b6` | `wzornik-identyfikacja-b6` | 4316 |

Ports 4317 to 4319 are for the distinctness board, publication and the final verification. Create a brand worktree after the foundation commit with `git -C /home/adrian/root/side_projects/portfolio-v2-wz-identyfikacja worktree add -b wzornik-identyfikacja-b<N> /home/adrian/root/side_projects/portfolio-v2-wz-identyfikacja-b<N> wzornik-identyfikacja`. Set up with `yarn --cwd sites install --frozen-lockfile`, `yarn --cwd studio install --frozen-lockfile` and the fonts cache copy above. Gatsby is not needed in a brand worktree: a brand agent runs `yarn --cwd sites run check`, `yarn --cwd sites test` and `yarn --cwd sites build`. The full Gatsby build runs once, at the end, in the merging worktree.

### Folder layout (everything a brand owns is under its slug)

```
sites/src/pages/identyfikacja/index.astro                 SHARED  index of the six case studies
sites/src/pages/identyfikacja/<slug>/index.astro          brand   case study page (thin, imports the brand page)
sites/src/identyfikacja/shared/                           SHARED  types, manifest reader, head and footer parts, download list helper
sites/src/identyfikacja/<slug>/brand.ts                   brand   BrandMeta for the page head: slug, name, themeColor, ogAlt, tagline
sites/src/identyfikacja/<slug>/Tile.astro                 brand   the tile on the index, in the brand's own style
sites/src/identyfikacja/<slug>/                           brand   Page.astro, sections, styles, content.ts, islands, scripts, tests
sites/public/identyfikacja/<slug>/                        brand   everything published: favicon.svg, favicon.ico, apple-touch-icon.png, og.png,
                                                                  fonts/, logo/, social/, mockups/, print/, animation/, brandbook.pdf,
                                                                  <slug>-identyfikacja.zip, manifest.json
studio/identyfikacja/NOTES.md, PLAN.md                    SHARED
studio/identyfikacja/scripts/, studio/identyfikacja/lib/  SHARED  the toolchain written in the foundation
studio/identyfikacja/brands/<slug>/                       brand   STATUS.md, brand.json (single source of truth: name, colours, fonts, contrast pairs),
                                                                  src/ (logo, pattern and icon sources), build scripts specific to the brand
studio/out/<slug>/                                        brand   git-ignored masters, renders, screenshots, QA output
```

All six slugs are registered up front in `identityBrands` (`sites/src/shared/sites.ts`), so the index lists six cells from the start. A cell shows the brand's own tile when `sites/src/identyfikacja/<slug>/Tile.astro` exists (`import.meta.glob('../../identyfikacja/*/Tile.astro', { eager: true })`, the tile gets one prop, `href`) and a shared stub otherwise. A brand appears on the index when its folder is merged. Nobody edits the index or `sites.ts` to add a brand.

### Shared files (a brand agent never edits them)

The identity index page, the shared case study template and components (`sites/src/identyfikacja/shared/`), `sites/src/shared/` including `sites.ts`, `sites/.prettierignore`, `sites/astro.config.mjs`, the Gatsby site in `src/`, `static/`, the scripts and libs in `studio/identyfikacja/`, `studio/package.json`, `PLAN.md`, `NOTES.md`, the root `.gitignore`, `REBRAND.md`. If a brand agent needs a change in one of them, it does not edit it: it works around it inside its own folder (a local copy of a script goes to `studio/identyfikacja/brands/<slug>/`) and writes the request to `STATUS.md` under "Shared change requests". The merge step reads those requests.

### STATUS.md of a brand

Brand agents write their progress and their decisions to `studio/identyfikacja/brands/<slug>/STATUS.md`, never to `PLAN.md`. Sections: "Done" (the eleven deliverables of the brief as a checklist), "Decisions" (what Adrian should review, with the reason), "Shared change requests", "Open issues", "Review scores" (filled by the QA and review steps). The merge step ticks the brand line in the checklist at the top of `PLAN.md` and copies the "Decisions" into "Decisions for Adrian".

### Merging

When a brand agent finishes: commit in its worktree (`add the identity case study for <brand>`), then from the main identity worktree `git merge --no-ff wzornik-identyfikacja-b<N> -m "merge the <brand> identity into the identity branch"`. Folders are disjoint, so there are no conflicts; if git reports one, a brand touched a shared file, and the shared version wins. Later steps for a brand (QA, review, fixes) continue in that brand's worktree on its branch and are merged again the same way; a repeated merge only carries the brand's own files. A brand worktree that needs newer shared files runs `git merge wzornik-identyfikacja` inside itself. After the last merge, the `wzornik-identyfikacja` branch is merged into `rebrand-2026` in a separate merging worktree (not the main checkout), and nothing is pushed: a push deploys the public site.

### File conventions

Every published file lives in `sites/public/identyfikacja/<slug>/`. Names always start with the slug. Every script takes the slug as its first argument or as `--brand <slug>`, run from `studio/` with `node identyfikacja/scripts/<script>.mjs <slug>`. The names come from one function, `studio/identyfikacja/lib/convention.mjs` (`names(slug)`), and `validate.mjs` checks them; do not invent others.

| Group | Files |
|---|---|
| Logo | `logo/<slug>-<variant>.svg` for the variants `primary`, `symbol`, `horizontal`, `vertical`, `mono-black`, `negative`; `logo/png/<slug>-<variant>-<size>.png` at 512, 1024, 2048 px wide with alpha; `logo/pdf/<slug>-<variant>.pdf` |
| Site icons | `favicon.svg`, `favicon.ico` (16, 32, 48 as PNG), `apple-touch-icon.png` (180, solid background from `appIconBackground`), `og.png` (1200x630) |
| Colour | `colors/<slug>-palette.json`, `colors/<slug>-tokens.css` |
| Fonts | `fonts/*.woff2` (subsets) and the OFL texts, listed in the manifest |
| Pattern and icons | `pattern/<slug>-pattern.svg` (tileable), `icons/<slug>-icons.svg` (sprite) and `icons/svg/<slug>-icon-<name>.svg`, 12 icons on a 24 px grid, names from `iconNames` in `brand.json` |
| Social | `social/<slug>-avatar.png` (1080x1080), `social/<slug>-post-1.png` to `-post-3.png` (1080x1350) |
| Mockups | `mockups/<slug>-card-front.jpg`, `-card-back.jpg`, `-letterhead.jpg`, `-application.jpg`, `-email-signature.jpg` |
| Print | `print/<slug>-business-card.pdf` (91x61 mm, 2 pages, 3 mm bleed), `print/<slug>-letterhead.pdf` (A4); fonts embedded, no Type 3 |
| E-mail | `email/<slug>-email-signature.html` (tables and inline styles, logo as an absolute URL under `https://adrianturbinski.pl/wzornik/identyfikacja/<slug>/logo/png/<slug>-horizontal-512.png`) |
| Animation | `animation/<slug>-logo.mp4` (H.264) and `.webm` (VP9), 1080x1080, 2 to 4 s, each under 1.5 MB |
| Brand book | `<slug>-brandbook.pdf`, 20 to 30 pages of 1920x1080 px, fonts embedded, up to 6 MB |
| Package | `<slug>-identyfikacja.zip` (everything except animation, mockups, `figures/`, `og.png`, the manifest and itself) |
| Meta | `manifest.json` (written by `manifest.mjs`, read by the page) |
| Free form | `figures/*` is for pictures the case study page needs (rejected directions, kerning, clear space); it is not in the ZIP and the page may name them freely |

Limits checked by `validate.mjs`: logo SVG under 10000 bytes with no `<text>`, no `font-family`, no `<image>`, no script and a `viewBox`; published folder up to 16 MB (budget 12 MB), ZIP up to 8 MB, every file under 50 MB; contrast table from `brand.json` with every text pair at least AA; no comments and no en or em dashes in any file the guard covers. Skibka lands at 15.3 MB published, of which 6.0 MB is the ZIP.

`brand.json` is the single source of truth. Keys: `slug`, `name`, `styleId`, `style`, `trade`, `city`, `themeColor`, `appIconBackground`, `testBackground` (`{light, dark}` palette ids for the logo size sheet), `palette` (entries `id`, `name`, `group` of `primary`, `accent` or `neutral`, `hex`, `role`; at least one of each group, 5 to 9 neutrals, so 8 to 12 colours is typical), `iconNames` (exactly 12), `fonts` (entries `id`, `role`, `family`, `css`, `dir`, `file`, `instances` with `weight`, `style`, `axes`), `contrast` (pairs `id`, `use`, `fg`, `bg` as palette ids, `kind` of `text`, `large`, `ui` or `decorative`, optional `note`).

Page contract: `sites/src/identyfikacja/<slug>/Page.astro` wraps everything in `shared/Shell.astro` (head, noindex, canonical, og, icons, skip link) and ends with `shared/SampleLine.astro`; the route `sites/src/pages/identyfikacja/<slug>/index.astro` only renders `Page`. Data comes from `readManifest('<slug>')` (`shared/manifest.ts`), which reads `public/identyfikacja/<slug>/manifest.json` during the build. Use `shared/Downloads.astro`, `ColorTable.astro` and `ContrastTable.astro` for the file list and the tables; they carry no styling, so the brand page styles `.dl`, `.tbl` and `.tbl-wrap` itself. Copy and the rest of the data live in `sites/src/identyfikacja/<slug>/content.ts` (type `CaseContent` in `shared/types.ts`). A brand script can import that `.ts` file straight from Node 24 (type stripping), as `brands/skibka/theme.mjs` does, so the page and the brand book use the same words. Islands are Preact, loaded with `client:visible`.

## How to build a brand

Skibka is the worked example. Read `brands/skibka/` and `sites/src/identyfikacja/skibka/` first; copy the structure, not the look.

### Setup and ports

1. In the brand worktree: `export PATH=~/.nvm/versions/node/v24.13.0/bin:$PATH`, then `yarn --cwd sites install --frozen-lockfile`, `yarn --cwd studio install --frozen-lockfile`, and copy `studio/out/fonts-src` from the main identity worktree (`WZ_FONTS_SRC` overrides the folder).
2. Ports: your own port from the table above for the dev or preview server, bound to 127.0.0.1 only. `screens.mjs` and `distinct.mjs` serve `sites/dist` themselves on `--port` (default 4311, so pass your own). Kill servers with `pgrep` and `kill <PID>`, never `pkill -f`. One heavy renderer (Chromium, ffmpeg) at a time per worktree.

### Order of steps

1. `brands/<slug>/brand.json`: palette, fonts, 12 icon names, contrast pairs. `node identyfikacja/scripts/fonts-check.mjs <slug>` and `fonts-verify.mjs <slug>` confirm the Polish glyphs and the pinned instances.
2. `sites/src/identyfikacja/<slug>/content.ts`: the copy for the case study (typed `CaseContent`, plus anything extra the brand needs, such as `extras` and `contact` in Skibka).
3. `brands/<slug>/build-logos.mjs`: draws the six logo variants and `favicon.svg` into the published folder using `lib/text-path.mjs` (fontkit paths, tracking, manual kerning pairs, Schneider curve fitting), writes any data the page needs (`stamp-data.json` in Skibka). Keep every SVG under 10000 bytes: reuse glyph paths with `<use>` inside `<defs>`, round to one decimal, fit curves with `fit` set.
4. `node identyfikacja/scripts/pipeline.mjs <slug> --from fonts --skip assets,animate,brandbook` runs fonts, colors, logos, logo-export, favicon and logo-test; open `studio/out/<slug>/logo-sizes.png` and fix the logo at 16, 24, 48 and 512 px.
5. `brands/<slug>/build-assets.mjs`: pattern, icons, figures, mockups, print PDFs, social, og and the e-mail signature, rendered from HTML with `lib/browser.mjs` (`htmlToImage`, `htmlToPdf`). Print is flat: no filters or blend modes in the PDFs. A big grain overlay in a PDF explodes the file size, keep texture on screen files only. `lib/png.mjs` (`quantizePng`) shrinks noisy PNGs.
6. `brands/<slug>/src/animation.html`: the logo animation as a page that defines `window.__duration` (2000 to 4000 ms) and `window.__seek(ms)`; drive it with the Web Animations API (paused, `currentTime = ms`). `animate.mjs` captures frames and encodes MP4 and WebM.
7. `brands/<slug>/build-brandbook.mjs`: 20 to 30 pages of 1920x1080 px from the same content, fonts as pinned `data:` URIs (`theme.mjs` shows `pinnedFaceCss`).
8. `node identyfikacja/scripts/pipeline.mjs <slug> --from zip` builds the ZIP and the manifest and runs `validate.mjs`; it must end with all checks passed.
9. The page: `Page.astro`, `Tile.astro`, `brand.ts`, `styles.ts` or the brand's own styles, islands and the thin route. Then `yarn --cwd sites run check`, `yarn --cwd sites test`, `yarn --cwd sites build`.
10. `node identyfikacja/scripts/screens.mjs <slug> --port <port>` writes full page screenshots at 390 and 1440 px in slices to `studio/out/<slug>/shots/` plus the console errors, horizontal overflow and h1 count. Open every slice, list defects, fix, repeat. Add `--reduced` once to check reduced motion.
11. `node identyfikacja/scripts/pdf-preview.mjs <slug> --pages all --dpi 36` renders brand book pages to PNG (`--random 3` for a spot check); look at them.
12. `node identyfikacja/scripts/guard.mjs --brand <slug>` checks the brand's files for comments and dashes (no arguments checks the changed files, paths are accepted too), `yarn lint` at the repo root checks the Gatsby side. Tests: `yarn --cwd sites test` for the page logic and `yarn --cwd studio test` for the studio libs.
13. Write `STATUS.md`, commit as `add the identity case study for <brand>`, merge as described above.

`pipeline.mjs` flags: `--only a,b`, `--from step`, `--skip a,b`. Steps in order: fonts, colors, logos, logo-export, favicon, logo-test, assets, animate, brandbook, zip, manifest, validate. The three steps marked brand specific (`logos`, `assets`, `brandbook`) run `brands/<slug>/build-logos.mjs`, `build-assets.mjs` and `build-brandbook.mjs`, and are skipped with a message when the file is missing.

### Lessons from Skibka

- A glyph reused with `<use>` must be defined inside `<defs>`, or it is also drawn once at the origin and leaves a stray mark in the corner of the logo.
- svgo removes `width` and `height` from nested `<svg>` elements; use a `<g transform>` to place a logo inside a figure.
- `mix-blend-mode` and large `feTurbulence` overlays in a PDF turn every page into a raster (36 MB for 27 pages). Flat vector pages came to 3.3 MB.
- Chromium embeds a variable font as Type 3; pinned instances embed as CID TrueType. The fonts step makes them.
- Specificity: base rules such as `.brand p{margin:0}` beat component classes; write base rules with `:where(...)`.
- Text on the page is never rotated or filtered; apply texture and tilt to a background layer behind the content.
