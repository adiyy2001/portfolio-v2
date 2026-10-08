# Wzornik app-preview: run rules

This file and `BRIEF.md` next to it are everything a session needs to finish the app-preview brief. They were moved into the repo on 2026-10-07 so the work can continue in Claude Code on the web. Read `BRIEF.md` first, then this file, then `PLAN.md` and `NOTES.md` in this folder.

## Where things are in a cloud session

- The repository root is the worktree. Every path below of the form `/home/adrian/root/side_projects/portfolio-v2-wz-app-preview` means the repository root; `/home/adrian/root/side_projects/briefs/wzornik-app-preview.md` means `studio/app-preview/BRIEF.md`; `wzornik-common.md` and `wzornik-run2.md` mean this file.
- Work on the branch `wzornik-app-preview` and push it after each finished step. The other brief (`wzornik-app-preview` or `wzornik-aso`) runs on its own branch; do not touch it.
- Local machine facts (nvm path, 15 GB shared memory, ports, `/usr/bin/google-chrome`, systemd-run) may not apply in the cloud. Use what the environment has: Node 24, a Playwright Chromium, ffmpeg. Install missing tools in user space.
- State on 2026-10-07 at 23:10: phases 0 and 1 are done and committed (`PLAN.md`, `NOTES.md`); the foundation agent had only started the studio package. Next step: F (foundation with the first brand end to end), then B2 to B6 one after another, Q, R (independent review by a separate agent that did not see the process, every rubric score at least 4), P (publication), then the merge into `main`.
- Commit messages: one lowercase line in plain English, no prefix, no trailers. No code comments, no em or en dashes anywhere.

## Shared rules (from wzornik-common.md)

Adrian wrote three briefs for 18 more Wzornik case studies, in `/home/adrian/root/side_projects/briefs/`: `wzornik-identyfikacja.md` (visual identity), `wzornik-app-preview.md` (animated app previews) and `wzornik-aso.md` (App Store and Google Play screenshots). Each brief is the spec: follow it exactly, including the content rules, the quality control, the rubric, the definition of done and the final report. This file only adds how the work is split between agents and the facts that changed after the briefs were written.

## Decisions already made

- Adrian, 2026-10-03: "nie czekaj na nic z moją akceptacją [...] podejmuj wg własnego uznania". The mode line of each brief says "autonomicznie": no checkpoint after phase 1. Decide everything yourself and write the decisions worth his review into the brief's `PLAN.md` under "Decisions for Adrian"; the final report lists them.
- Remotion: if its license would require payment in Adrian's case (a sole proprietor), use the brief's fallback (Playwright frames plus ffmpeg) without stopping, and note it in "Decisions for Adrian".
- Brand name checks: use web search as the brief asks (load the WebSearch tool through ToolSearch).

## Where to work

- Each brief has its own git worktree of portfolio-v2, `/home/adrian/root/side_projects/portfolio-v2-wz-<key>` on the branch `wzornik-<key>` (keys: `identyfikacja`, `app-preview`, `aso`), created from `rebrand-2026`. Work only there. Never edit, commit or change git state in the main checkout `/home/adrian/root/side_projects/portfolio-v2`: Adrian's other sessions and Command Center commit there. The merge agent at the end is the only exception.
- The three worktrees run at the same time. Shared files (the `#wzornik` section on `/dla-klienta/` and `/en/for-clients/`, the Wzornik index, shared components) change only in the publication phase, as little as possible, so the merge stays easy.
- Ports: `identyfikacja` 4310 to 4319, `app-preview` 4320 to 4329, `aso` 4330 to 4339, the merge agent 4340. Bind to 127.0.0.1 only.

## Facts that changed after the briefs were written

- The site lives at https://adrianturbinski.pl/ with no path prefix. Where a brief says `/portfolio-v2/`, use the current layout: the Gatsby site at the root and the sample websites under `/wzornik/`.
- The existing sample websites, Trzask included, are one Astro 7 project in `sites/` with its own `yarn.lock` (`sites/src/pages/<slug>/`, shared parts in `sites/src/shared/`), built with the base `/wzornik` and copied to `public/wzornik` by `.github/workflows/pages.yml`. The brief's line "Gatsby (JS), framer-motion" describes the main site; the new case studies are built the way Trzask is, as the brief asks.
- The `#wzornik` section of the client edition is in the Gatsby site (`src/`), in Polish and English.
- Blog: `plugins/gatsby-remark-safe-blog` stays first in the `gatsby-transformer-remark` plugin list in `gatsby-config.js` (it strips raw HTML and unsafe links from model-written posts). Command Center commits posts to `content/blog/` through the GitHub API, so the merge agent pulls before merging.
- Commands (`REBRAND.md`, "Resume here", items 3 and 4): `yarn install`, `yarn gatsby clean && yarn build` (always clean first), `yarn lint`; `yarn --cwd sites install`, `yarn --cwd sites run check` (not `yarn check`), `yarn --cwd sites test`, `yarn --cwd sites build`. For the deploy layout, copy `sites/dist` to `public/wzornik` after the Gatsby build and serve with `yarn gatsby serve -H 127.0.0.1 -p <your port>`.
- Commit messages follow this repo: one lowercase line in plain English, no prefix, no trailers (for example `add the identity case study for <brand>`).
- Published files (PDF, ZIP, MP4, WebM, PNG) are served by GitHub Pages: keep each file under 50 MB and the whole extension under 300 MB. Masters stay in `studio/out/` (gitignored).

## Checklist in PLAN.md

The planning agent puts this checklist at the top of the brief's `PLAN.md`, with the real brand names, and every later agent ticks its line when it is done:

```
- [ ] F foundation, with the first brand end to end
- [ ] B2 <brand>
- [ ] B3 <brand>
- [ ] B4 <brand>
- [ ] B5 <brand>
- [ ] B6 <brand>
- [ ] Q quality control
- [ ] R independent review, every rubric score at least 4
- [ ] P publication and final report
```

## Machine and rules

- Linux (WSL2), 20 cores, 15 GB RAM shared with other agents. Node through nvm (`export PATH=~/.nvm/versions/node/v24.13.0/bin:$PATH`), yarn 1, Google Chrome at `/usr/bin/google-chrome`, ffmpeg 6, Docker 29. Sudo is blocked: find a user-space or Docker alternative.
- One heavy build at a time per worktree. Stop every server and container you start (kill by PID, never `pkill -f`).
- No comments in code. No em or en dashes anywhere in code or copy (check with `grep -rnP '[\x{2013}\x{2014}]'` before every commit).
- Nothing about Adrian beyond the footer line the briefs give. Never his e-mail address or phone number.
- Do not use MCP servers tied to accounts (Figma, Google Workspace, Asana, Command Center, Claude Docs).
- If time runs short, cut extras, never the quality control.

## Interruptions

- The subscription guard can stop any tool call with a hook error that starts with "Straż subskrypcji". When that happens, stop at once: do not retry, do not try another tool, and return the structured output right away with status `interrupted` (or `interrupted: true`) and the guard message in the notes. Use `interrupted` for nothing else.
- A step can be started again after an interruption. Before doing anything, look at what is already there: `git status`, `git log --oneline`, the checklist in `PLAN.md` and the files on disk. Continue from that state. Never redo committed work; finish or discard uncommitted half-done changes deliberately.
- Leave the worktree in a state the next agent can pick up: commit finished work in small steps and stop anything you started before you return.

## Run 2 overrides (from wzornik-run2.md, these win)

Started 2026-10-07 on Adrian's word ("start, do dzieła"). This file overrides `wzornik-common.md` where they differ. Read it right after `wzornik-common.md`.

## Changes since wzornik-common.md was written

- The portfolio's working branch is now `main`, not `rebrand-2026`. `rebrand-2026` was fast forwarded into `main` on 2026-10-07 and is no longer used. Pages deploys on every push to `main`. Wherever the common file or a brief says `rebrand-2026`, read `main`.
- Worktrees: `/home/adrian/root/side_projects/portfolio-v2-wz-app-preview` (branch `wzornik-app-preview`) and `/home/adrian/root/side_projects/portfolio-v2-wz-aso` (branch `wzornik-aso`), both created from `main`.
- The identyfikacja brief is done and live (six brands under `sites/src/pages/`, its notes in `studio/identyfikacja/`). Look at how it registered its case studies in the `#wzornik` section and the Wzornik index, and follow the same pattern so the merge stays easy.
- There is no Workflow tool in this run. The orchestrating session starts one agent per step (plan, foundation, brand, QA, review, fix, publish) and passes state through the checklist in PLAN.md and git. Return a short plain text summary (at most 300 words): status (done, partial, blocked), commits, what is built, what is left, checks run and their results, notes.
- The subscription guard hook was removed; the "Interruptions" rules still apply to any agent that starts after another one stopped.

## Lessons from the identyfikacja run (check these yourself, the reviewers did)

- No horizontal scroll on any page at 320, 390, 768, 1024 and 1440 px.
- No one letter or one word last lines in headings and short copy; no heading broken in the middle of a word.
- Nothing may overlap: footer, badges, captions, phone frames, store headlines.
- A rebuild or regeneration step must never drop content that was already on the page (palette, tables, credits). Compare the page before and after.
- Colours used in animations must match the brand palette exactly.
- Memory is shared with other WSL work (15 GB). One heavy render or build at a time per worktree, close every browser and server you start.

## Shared with the portfolio cleanup session (2026-10-07, evening)

- Every `yarn install` (root and `sites`) runs with `--mutex file:/tmp/yarn-portfolio.lock`, because all sessions share `~/.cache/yarn`.
- Never change the root `yarn.lock` in a Wzornik branch: another session refreshes it on `main` for the Dependabot alerts. If a change seems needed, stop that step and report it in your summary. Studio dependencies go into `studio/` with its own lock file; `sites/yarn.lock` may change only when a site needs it.
- At the end the branches are merged into `main`, never into `rebrand-2026` (frozen at f9ceb55).

## Memory guard (2026-10-07, 22:55)

- The first font check of the app-preview plan grew to 14.7 GB and was killed; that most likely took the whole session down at 18:08. Run every heavy job (font scans, Remotion renders, Playwright batches, builds) under a memory cap, for example `systemd-run --user --scope -p MemoryMax=5G <command>` or `ulimit -v`, and Remotion with `--concurrency 4` at most.
- Brands are built one after another in each brief (not in parallel worktrees), because both briefs run at the same time on 15 GB.
