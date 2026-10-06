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
sites/src/identyfikacja/<slug>/brand.ts                   brand   metadata the index reads (slug, name, style, trade, city, order)
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

The index finds the brands by itself: `import.meta.glob('../../identyfikacja/*/brand.ts', { eager: true })` for the metadata and `import.meta.glob('../../identyfikacja/*/Tile.astro', { eager: true })` for the tiles. A brand appears on the index when its folder is merged. Nobody edits the index to add a brand.

### Shared files (a brand agent never edits them)

The identity index page, the shared case study template and components (`sites/src/identyfikacja/shared/`), `sites/src/shared/` including `sites.ts`, `sites/.prettierignore`, `sites/astro.config.mjs`, the Gatsby site in `src/`, `static/`, the scripts and libs in `studio/identyfikacja/`, `studio/package.json`, `PLAN.md`, `NOTES.md`, the root `.gitignore`, `REBRAND.md`. If a brand agent needs a change in one of them, it does not edit it: it works around it inside its own folder (a local copy of a script goes to `studio/identyfikacja/brands/<slug>/`) and writes the request to `STATUS.md` under "Shared change requests". The merge step reads those requests.

### STATUS.md of a brand

Brand agents write their progress and their decisions to `studio/identyfikacja/brands/<slug>/STATUS.md`, never to `PLAN.md`. Sections: "Done" (the eleven deliverables of the brief as a checklist), "Decisions" (what Adrian should review, with the reason), "Shared change requests", "Open issues", "Review scores" (filled by the QA and review steps). The merge step ticks the brand line in the checklist at the top of `PLAN.md` and copies the "Decisions" into "Decisions for Adrian".

### Merging

When a brand agent finishes: commit in its worktree (`add the identity case study for <brand>`), then from the main identity worktree `git merge --no-ff wzornik-identyfikacja-b<N> -m "merge the <brand> identity into the identity branch"`. Folders are disjoint, so there are no conflicts; if git reports one, a brand touched a shared file, and the shared version wins. Later steps for a brand (QA, review, fixes) continue in that brand's worktree on its branch and are merged again the same way; a repeated merge only carries the brand's own files. A brand worktree that needs newer shared files runs `git merge wzornik-identyfikacja` inside itself. After the last merge, the `wzornik-identyfikacja` branch is merged into `rebrand-2026` in a separate merging worktree (not the main checkout), and nothing is pushed: a push deploys the public site.

### File conventions

The foundation agent fills this section in with the final names of the published files (logo variants, PNG sizes, print files, social posts, animation, brand book, ZIP, manifest) after it has built Skibka end to end. Every later agent follows it without changes.
