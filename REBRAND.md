# REBRAND 2026

Working state of the portfolio rebrand. Every session and every agent starts here: read this file and `git log` before doing anything else.

## Status

- Phase 0 (recon): done.
- Phase 1 (brand discovery): language decided (PL + EN with a switch). Three directions delivered and verified (workflow runs `wf_f0c88ef2-ed7`, `wf_5035fd06-003`, `wf_370d91e8-90a`). Adrian chose B "Na miarę" on 2026-10-02 and changed the concept: two editions of one site, one for a recruiter coming from LinkedIn, one for a B2B client; he is a freelance developer, Media Hunters is no longer a brand. B is rebuilt on that (`rebrand-explorations/b-na-miare/index.html`, three views) and has a logo sheet (`rebrand-explorations/b-na-miare/logo.html`, three candidates, "Igła nad ń" recommended). Adrian picked the logo "Igła nad ń", full version with the thread, confirmed the client copy with maintenance added, gave permission to use tailorcloth.com screenshots, pasted a new CV and asked for a portfolio split: TailorCloth as the real product, 6 sample websites for clients, 6 public repos for recruiters that cover every CV technology (see "Sample work"). Then he set the order: the 12 projects are designed only (briefs in `PROJECTS.md`, no code), and the main site is finished first with the split between the real TailorCloth case and the sample websites. The prototype now has that split ("Prawdziwe wdrożenie" tag, "Wzornik." with six designed sample sites). Adrian approved the split and the Wzornik and gave the OK for Phase 2 ("wzornik super, do dzieła"). Phase 1 is done.
- Phase 2 (system in Gatsby): built and verified on 2026-10-02, approved by Adrian ("wszystko wygląda okej, do dzieła"). Tokens, fonts, global styles, motion tokens, Lenis, layout shell, header with the edition and language switch, footer with the threaded logo and page transitions are ported from the prototype. Pages are stubs with the prototype hero copy; their content is Phase 3. Results are under "Tokens" and "Phase 2 verification".
- Phase 3 (pages): Home and the recruiter edition (About, PL and EN) are ported, verified and committed. Then Adrian switched to a parallel build: the scaffold commit `0dffa15` fixed the shared files (routes `work` and `case`, the client page composition, one CSS file per section owner), five agents in git worktrees built the client edition top (hero, pinned scene, accessibility), the TailorCloth teaser with the steps and the client close, the Wzornik with its six fonts, the Work index with the TailorCloth page and the morph, and the 404 (workflow `wf_71f9eab7-faa`); the branches were cherry-picked onto `rebrand-2026` without conflicts. One final verification round ran over the merged site (workflow `wf_77c553e6-44f`; the subscription guard stopped four of its five verifiers on 2026-10-02 and they were resumed on 2026-10-03 against the Phase 4 build). Its findings were fixed on 2026-10-03 and Phase 3 is done. Results are under "Phase 3 verification".
- Phase 4 (audits and launch): done on 2026-10-03. Adrian, 2026-10-02: decide everything alone and ask nothing until the portfolio, the sample websites and the GitHub repos are all finished ("sam podejmij możliwie najlepsze decyzje, nie pytaj mnie o nic [...] lecisz do końca"). Done: Open Graph images and JSON-LD, the `gatsby-node.js` cleanup, entry scripts after the first paint, layout features only for the TailorCloth screenshot, the new `resume.pdf`, the verification fixes, `lodash` removed, Pages on the Gatsby build, the nine sample websites live under `/wzornik/` (built by workflows `wf_14b3ce6e-33c` and `wf_987807a9-5d5`, one squashed commit per site), the Wzornik and the Work strips linking to them, `llms.txt`, the final Lighthouse round (see "Phase 4 verification") and `/rebrand-explorations` deleted.
- GitHub repos: started on 2026-10-03, paused by Adrian the same evening ("na razie koniec"). The six repos from Adrian's briefs are built outside this repo, each in its own folder next to it, by workflow agents, three at a time (plan, milestones, finish, audit, repair). Committed so far: `flagwire` plan and M1 to M3, `gridtwin` plan and M1 to M5, `coschema` plan and M1 to M4; `signal-timeline`, `eventhorizon` and `fieldline` are not started. Git stays local: Adrian creates the GitHub repos and pushes them himself. When all six are done, Adrian gets the final report. Resumed on 2026-10-03 at 23:20 and paused by Adrian on 2026-10-04 at about 09:25 ("wznowisz na kolejnej sesji, dam znać kiedy"), after the account hit its weekly limit. State: flagwire (published as flagtide), gridtwin and coschema have final reports and are public since 2026-10-04 at about 11:45 (github.com/adiyy2001/flagtide, gridtwin, coschema; history cleaned, every commit `Adrian Turbiński <adrian.turbinski@gmail.com>`); signal-timeline is finished and waits for its audit; eventhorizon has M1 to M6 (M7 half done, uncommitted); fieldline is not started. Nothing runs (no workflow, no cron); the next session starts the run only on Adrian's word, as `briefs/agent-runs/repos-status.md` says (the args for the next run are there).
- Hosting: GitHub Pages at https://adiyy2001.github.io/portfolio-v2/ (Adrian: "po najprostszej linii oporu", decide the rest yourself). Pages is enabled with the "GitHub Actions" source; `.github/workflows/pages.yml` deploys on every push to `rebrand-2026` (the `github-pages` environment allows `main` and `rebrand-2026`). It runs `yarn build --prefix-paths`, builds the sample websites with `yarn --cwd sites build`, copies `sites/dist` to `public/wzornik` and publishes `public/`. Until 2026-10-03 it published the prototype `rebrand-explorations/b-na-miare`.
- Blog (2026-10-03): articles published automatically by Command Center, canonical on this site, cross-posted to dev.to, with LinkedIn redistribution. The site side is built and stays invisible until the first article lands in `content/blog/`. How it works and what Command Center writes: `BLOG.md`; the shared plan is `~/root/side_projects/command-center/docs/content-engine.md`.
- Domain (2026-10-03): the site is live at `https://adrianturbinski.pl/` (commit `d04bb1e`, HTTPS enforced, `www` redirects, the old `adiyy2001.github.io/portfolio-v2/` address redirects to the new one). DNS is at Hostinger (A records to GitHub Pages, `www` CNAME, mail records untouched; mailbox `contact@adrianturbinski.pl`). Also owned: `adrianturbinski.org`, `adrianturbinski.online`, both forwarded with a 301 to `https://adrianturbinski.pl/` by Hostinger domain forwarding (2026-10-06, http and https checked). No `pathPrefix` any more, Astro `base` is `/wzornik`, privacy policy at `/en/privacy/`. Older sections of this file still show the old address.
- Roadmap run (2026-10-03, late evening): Adrian said to do everything without waiting for his approval, decide alone, and put what only he can provide into Command Center tasks for 2026-10-04 (seven tasks: GoatCounter account, Search Console, the `.org` and `.online` redirects, the GitHub cleanup writes, the commit e-mail, photo and TailorCloth material, a review of the decisions taken for him). Order: the six repos, then the Wzornik extension (`briefs/agent-runs/wzornik-status.md`), then the Dependabot alerts. The weekly limit stood at 75% (renews 6.10 at 16:00), so the work runs in waves. The auto mode classifier blocked rewriting the commit identity and every write on GitHub (visibility, archive, profile): those are Adrian's tasks, do not retry them. Adrian, 2026-10-04 at 09:00: finish the six repos, record the work and update this roadmap, then stop. The Wzornik extension and the Dependabot alerts wait for his go.
- Repos live (2026-10-06): flagtide, gridtwin and coschema are at v1.0.0 with live demos on `https://flagtide.adrianturbinski.pl/`, `https://gridtwin.adrianturbinski.pl/` (home server through Cloudflare Tunnel) and `https://coschema.adrianturbinski.pl/` (GitHub Pages of the coschema repo). `@flagtide/core` and `@flagtide/angular` 1.0.0 are on npm. DNS for the domain moved from Hostinger to Cloudflare the same day; the apex and `www` still point to this site's Pages and the mail records were copied unchanged. Command Center has three "Why I built ..." articles queued for the blog and dev.to (13.10 flagtide, 20.10 gridtwin, 27.10 coschema) and one LinkedIn post per project. Next for this site: the recruiter case studies, see "Recruiter case studies".
- Branch: `rebrand-2026`. Pushed to the public repo `adiyy2001/portfolio-v2` with Adrian's OK ("wypychamy"), notes included. Push after each commit on this branch is fine from now on.
- Wzornik identyfikacja (2026-10-07): the six identity case studies (cuvee, klamra, nosna, rzut, skibka, wolnobieg) and the identity index under `/wzornik/identyfikacja/` are built, reviewed and merged locally on `wzornik-merge` (base `rebrand-2026` at 86eb7bd, no conflicts), waiting for Adrian's fast forward and push. Checks on the merge: lint, Gatsby build, sites check, 120 test files and 1275 tests, sites build, and 194 pages answer 200 under `gatsby serve`; rerun on 2026-10-07 after the review round 4 merges and the Nośna repairs (1281 tests, no horizontal scroll on the six pages from 320 to 1440 px). The review point R is still open: Nośna scored 3 in craft in round 4 and its brand book and scroll defects were fixed afterwards without a fifth review (`studio/identyfikacja/PLAN.md`, decision 34). The email signature pages point at `adrianturbinski.pl` for the logo PNG, so they load it only after the deploy. App preview and ASO are still to merge.

## Resume here

For a fresh session (Adrian resets the chat to keep the context small):

1. `git checkout rebrand-2026`, then read this file, `PROJECTS.md` and `git log`.
2. Servers bind to 127.0.0.1 only (0.0.0.0 is not allowed). Background tasks stop at the 2 hour limit and must not be restarted then; for long verification runs, start a short-lived server inside each command and kill it by PID. To serve the `--prefix-paths` build without Gatsby, make a folder with a `portfolio-v2` symlink to `public` and run `python3 -m http.server PORT --bind 127.0.0.1 -d <that folder>` (its 404 is plain, open `/portfolio-v2/404/` directly).
3. Local check of the Gatsby site: `yarn gatsby clean && yarn build` (always clean first: an incremental build once inlined a stale stylesheet into the HTML), then `yarn gatsby serve -H 127.0.0.1 -p 9000` in the background (add `--prefix-paths` to both for the Pages layout). `yarn lint` is `eslint .`. Lighthouse runs against `gatsby serve`, never `python3 -m http.server` (HTTP/1.0 without keep-alive inflates the simulated LCP): `CHROME_PATH=/usr/bin/google-chrome npx -y lighthouse@12 <url> --chrome-flags="--headless=new --no-sandbox"`, add `--preset=desktop` for desktop.
4. Sample websites: one Astro 7 project in `sites/` with its own `yarn.lock`. `yarn --cwd sites install`, then `yarn --cwd sites run check` (astro check and Prettier; plain `yarn check` runs Yarn's built-in check instead), `yarn --cwd sites test` and `yarn --cwd sites build`. For the deploy layout, copy `sites/dist` to `public/wzornik` after the Gatsby build, as `pages.yml` does.
5. The Phase 1 prototypes, the logo sheet and the Playwright verification scripts were in `rebrand-explorations/`, deleted in `715807d`. Read them from history, for example `git show d126616:rebrand-explorations/b-na-miare/index.html`. The prototype screenshots were never committed. The Python venv with fonttools, brotli, uharfbuzz and Pillow lived in the session scratchpad; recreate it when fonts need subsetting.
6. Next: the GitHub repos (see Status). The restart notes (state of each repo, how to start a new run, what went wrong on 2026-10-03) are kept with the briefs in `~/root/side_projects/briefs/`, outside this repo. Each repo folder also has `PLAN.md` with the ticked milestones and its own `git log`, so a new run continues from there. Paused on 2026-10-04: start the next run only when Adrian says so, with the args in `repos-status.md` ("How to continue"), and stop after the six repos.
7. After the repos: the Wzornik extension, 18 more sample projects in three briefs (visual identity, app preview, ASO), saved on 2026-10-03 in `~/root/side_projects/briefs/` as `wzornik-identyfikacja.md`, `wzornik-app-preview.md` and `wzornik-aso.md`, with a summary in that folder's `README.md`. Their mode line says „autonomicznie” since 2026-10-03, so they run without the plan checkpoint, through `briefs/agent-runs/wzornik-workflow.js` in three worktrees (see `wzornik-status.md`). The identyfikacja brief is done and merged on `wzornik-merge` (2026-10-07), waiting for Adrian's `git merge --ff-only wzornik-merge` on `rebrand-2026` and a push; app-preview and aso are the remaining two briefs, then the Dependabot alerts.
8. Recruiter case studies (Adrian, 2026-10-06): one page per public repo on the recruiter edition, each a five minute read. Spec in "Recruiter case studies". Start with flagtide, gridtwin and coschema; the other three repos get a page when they are published.

## Goal

A complete rebrand of the developer business-card site, not a reskin.

1. Brand identity: positioning line, voice, wordmark or logotype (can be animated or "alive"), color system, type system.
2. Design system in code: tokens, motion primitives, components.
3. Rebuilt pages: Home, Work index, Single project (MDX template), About, Contact, 404.

Bar: Awwwards Site of the Day. Distinctive, rich in motion, clean and fast. One signature motion moment per page, everything else is precise micro-interaction.

## Constraints

- Stay on Gatsby. No framework migration.
- Keep the content schema, routes, slugs and frontmatter working. Existing content and links must survive the rebrand.
- Touch `gatsby-node.js` only if strictly required, and explain why to Adrian before doing it.
- Stack additions: `motion` (import from `motion/react`) as the single animation engine, `lenis` (with `lenis/react`) for smooth scroll. Nothing else without a one-line justification. No GSAP, no Three.js.
- Remove dependencies that only served the old template once nothing uses them.
- `/rebrand-explorations` stayed out of the Gatsby build (repo root, never under `static/` or `src/pages/`) and was deleted at the end of Phase 4 (`715807d`).

## Avoid list (verbatim)

You tend to converge on a few default styles, and a general "avoid the AI look" only swaps one default for another, so here are the specific patterns that are off the table:
- cream, beige or off-white backgrounds; warm dark "editorial" with gold accent
- italic accent words inside headlines
- numbered section labels like 01 / 02 / 03
- monospace labels and metadata as a decorative device
- pill-shaped buttons
- Inter, Space Grotesk, Instrument Serif, Geist, Fraunces
- navy background with mint/teal accent (the current template look)
- purple or blue gradients, glassmorphism, glowing blobs
- three-card feature grids, default bento grids
- typewriter hero text, particle backgrounds, cursor trails, "Hello, I'm X" hero opener
- scroll-jacking that breaks native scroll, keyboard or find-in-page
If you notice yourself reaching for something that feels like a portfolio template, stop and pick something more specific to me.

## Rules (verbatim)

- Output full files, not diffs.
- No inline comments in code.
- UI strings (nav, buttons, footer, 404, form labels) in Polish.
- Use yarn. Work on a new branch "rebrand-2026", commit after each completed page with a clear message. Do not push.
- Keep solutions minimal: no abstractions or config for hypothetical future needs.
- Read a file before making claims about it.

## Rules for the material about Adrian (verbatim)

- Facts stay exact. Do not invent clients, metrics, numbers, awards or testimonials. If something would strengthen the story but is missing, add it to a short "Needs from Adrian" list instead of making it up.
- The current site is built on a well-known open-source portfolio template (Brittany Chiang v4 style). Drop everything that comes from it: section names like "Where I've Worked", "Some Things I've Built", "What's Next?", the tabbed jobs list, the alternating featured-project layout, the "Designed & Built by" footer and the GitHub star counters. Nothing structural from the template should survive.
- Rewrite all copy in a voice that sounds like a person, not a LinkedIn summary. Cut phrases like "passionate about", "cutting-edge", "human-centered digital solutions", "robust", "leverage". Short sentences, concrete claims, what I actually built and for whom.
- Positioning: I am a software engineer who also runs his own studio (Media Hunters) and ships complete products for clients end to end. The brand should make that double role clear in one glance.

Superseded by Adrian on 2026-10-02: the positioning bullet. He is a freelance developer with no studio brand, and the site has two editions, one for recruiters and one for B2B clients (see Direction).

## Motion system (verbatim)

- One motion tokens file: durations, easings, spring presets, stagger values. Every component uses these.
- MotionConfig reducedMotion="user" at the root, and LazyMotion with the m component to keep the bundle small.
- Variants with staggerChildren for text and list reveals; split headings into words or lines with mask reveals.
- layoutId shared-element transitions: a project thumbnail in the Work list morphs into the project page header.
- Page transitions with AnimatePresence (mode="wait"), short and confident.
- useScroll + useTransform + useSpring for scroll-linked scenes: one pinned (position: sticky) signature scene on Home, parallax used sparingly.
- useVelocity for subtle scroll-velocity response (e.g. slight skew or letter-spacing) on large type.
- Physical hover: springs, magnetic pull on primary CTAs only, max 4deg tilt.
- whileInView with once: true for reveals; never animate layout-shifting properties on load.
- Reduced motion fallback: instant states, no fades, no pinning.
- Mobile: no pinning or horizontal tracks; keep text reveals and micro-interactions.

## Quality bar (verbatim)

- Lighthouse desktop: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95. Mobile Performance ≥ 80.
- CLS < 0.05, LCP < 2.0s on desktop. Fonts self-hosted, subset, preloaded, font-display swap with metric-matched fallback.
- Keyboard navigable, visible focus states, WCAG AA contrast, semantic landmarks, skip link kept.
- No console errors or hydration warnings.
- Raised by Adrian on 2026-10-02: SEO 100 ("full seo 100% i optymalizacja"), analytics must work.

## Verification (verbatim)

After each page, the verifier agent runs yarn build, serves the site, takes screenshots at 375, 768 and 1440 px (Playwright MCP if available), repeats them with prefers-reduced-motion, runs Lighthouse, and checks the result against the plan in REBRAND.md and the avoid list. It returns a findings list. You fix what is real, then report to me.

## Process checkpoints

- Phase 0: recon report. Then the language question.
- Phase 1: three independent directions with prototypes in `/rebrand-explorations/<name>/index.html` and screenshots at 1440 and 375 px. Critique, recommend, wait for Adrian's choice.
- Phase 2: tokens, fonts, global styles, motion tokens, Lenis, layout shell, nav, footer, page transitions. Verify, show, wait.
- Phase 3: pages one at a time (Home, Work index, Single project, About, Contact, 404). After each: verify, commit, report, wait.
- Phase 4: parallel audits (performance, accessibility, SEO and machine-readable layer), fixes, JSON-LD, llms.txt, OG images, final Lighthouse, delete `/rebrand-explorations`.

## Facts (single source of truth)

Sources: Adrian's LinkedIn profile (pasted by Adrian on 2026-10-02), `content/jobs`, `content/featured`, `src/config.js`, `src/components/sections/*.js`, `static/resume.pdf` (1 page, English, Canva, last changed 2024-10-24). Adrian: "kieruj się linkedinem", so LinkedIn wins for roles, dates and scope. Content was last edited 2024-10-15. Use these, nothing else.

### Identity

- Name: Adrian Turbiński (hero.js:63, about.js:138, resume). `gatsby-config.js` misspells it "Turbński" in title, description and manifest.
- LinkedIn headline: "Senior Frontend and Fullstack Engineer, Tech Lead | Angular, TypeScript, RxJS, Node.js for teams shipping complex web apps with safer, more frequent releases".
- Old one-liner (hero.js:64): "Software Engineer and Founder at Media Hunters".
- Email: adrian.turbinski@gmail.com (`src/config.js:2`, resume).
- GitHub: https://github.com/adiyy2001
- LinkedIn: https://www.linkedin.com/in/adrian-turbi%C5%84ski-b266b21a6
- Resume: `/resume.pdf`. It links the portfolio as https://portfolio-v2-c19j.vercel.app/
- Photo: new one confirmed by Adrian on 2026-10-02: `C:\Users\Adrian\Downloads\1772802747790.jpg` (also saved as "(1)"), 400x400, 18 KB, his LinkedIn photo: dark background, glasses, black shirt, low key light. Copy it into `src/images/` in Phase 2. Old `src/images/me.jpg` (200x200, formal, blazer) is retired.
- Own mark: `src/images/logo.png` ("A" in a brush ring, mint on navy) is dropped. Adrian: "nie miałem pomysłu wtedy".
- Hobbies listed in the resume: biking, traveling, hiking, photography, sports, coding.
- Languages (new CV): English C1, Polish native.
- Phone: in the new CV, never published on the site or copied into repo files.
- Positioning (Adrian, 2026-10-02): freelance front-end and full-stack developer. Open to "Oferty i zlecenia" (job offers and contracts). Services for B2B clients: whole web apps and WCAG accessibility.

### Roles (LinkedIn, newest first)

| Company | Title | Range | Type, location | What LinkedIn says |
| --- | --- | --- | --- | --- |
| PSE Innowacje sp. z o.o. | Senior Software Engineer | Jan 2025 - Present | Full-time, Wrocław | Leads an early-stage proof of concept of a highly interactive web app to model and visualize high-voltage power line infrastructure; complex diagram-based UI in Angular and GoJS; works with domain analysts on evolving requirements; owned frontend architecture decisions in the initial phase; onboards new engineers, code reviews; continues on the production system |
| Media Hunters | Tech Lead (Adrian, 2026-10-02; LinkedIn says "Senior Software Engineer / Technical Lead") | Sep 2023 - Dec 2024 | Self-employed, Wrocław | Independent contractor leading multiple long-lived web apps with end-to-end responsibility for code quality, architecture and technical decisions; designed and evolved a multi-tenant SaaS platform; introduced CI pipelines and automated tests (Jest, Cypress); accessible WCAG interfaces with designers and stakeholders; mentored and reviewed code for a small team of engineers, a team he managed (Adrian, 2026-10-02); skills include business development and project management |
| Transition Technologies MS | Software Engineer | Sep 2022 - Aug 2023 | Self-employed, Wrocław, remote | Enterprise sandbox for electricians to design and validate complex electrical workflows; NgRx state for dynamic graph-based UI; tests in Jest, Karma, Cypress; WCAG 2.1 in a diagram-heavy interface (keyboard navigation, screen readers, focus management); worked with backend engineers, UX designers and domain experts |
| Cobiro | Frontend Engineer | Feb 2022 - Aug 2022 | Self-employed, Warsaw area | Moved a legacy frontend toward clearer separation of concerns; architecture discussions on domain boundaries (hexagonal architecture); helped introduce automated CI pipelines; feature-flag experiments and gradual rollouts |
| Roche | Frontend Engineer | Jan 2021 - Jan 2022 | Contract, Wrocław, remote | Internal medical research apps in Angular and TypeScript used to analyze and validate clinical data in a regulated environment; route-based lazy loading and API usage optimization; tests in Jest and Karma |
| BRAINODE sp. z o.o. | Junior Frontend Developer | Aug 2019 - Dec 2020 | Contract, Wrocław, hybrid | High-end e-commerce platform with real-time 3D product visualization in Angular and Three.js; a custom WebGL rendering layer with senior engineers; real-time currency exchange over WebSockets; small Agile team |

Superseded by LinkedIn: the content/jobs dates (BRAINODE from Aug 2020, Roche Jan to Sep 2021, Cobiro to Dec 2022, TTMS Dec 2022 to Dec 2023, Media Hunters "Founder / Main Engineer" Jan 2023 to Present) and the resume variants. Overlaps (Roche with Cobiro, TTMS with Media Hunters) are real parallel work as LinkedIn shows them.

Resolved on 2026-10-02: Media Hunters is not a brand any more. Adrian: "już nie mediahunters tylko jako zwykły deweloper freelancer". It appears only as a past role (Tech Lead, a team he managed) and as the team behind TailorCloth.

### LinkedIn experience (verbatim, pasted by Adrian on 2026-10-02)

The table above is a summary. This is the full text and wins over the summary when wording is checked (one en dash replaced by a hyphen).

```text
PSE Innowacje sp. z o.o.
Senior Software Engineer
PSE Innowacje sp. z o.o. · Full-time
Jan 2025 - Present · 1 yr 10 mos
Wrocław, Dolnośląskie, Poland
- Leading the development of an early-stage proof of concept for a highly interactive web application used to model and visualize high-voltage power line infrastructure
- Designed and implemented complex, diagram-based UI solutions using Angular and GoJS, focusing on correctness, clarity of domain representation, and long-term extensibility
- Worked closely with domain analysts to translate ambiguous, evolving requirements into concrete technical solutions and iteratively validate assumptions
- Took ownership of frontend architecture decisions during the initial project phase, balancing rapid exploration with maintainability and future scalability
- Actively onboarded and supported new engineers joining the project, providing technical guidance, architectural context, and code reviews to establish shared standards early on
- Contributed to the ongoing development of the production system, refining the initial POC based on real project constraints and feedback
Enhance with AI
Media hunters
Senior Software Engineer / Technical Lead
Media hunters · Self-employed
Sep 2023 - Dec 2024 · 1 yr 4 mos
Wrocław, Dolnośląskie, Poland
- Worked as an independent contractor leading and contributing to multiple long-lived web applications, taking end-to-end responsibility for code quality, architecture, and technical decision-making
- Designed and evolved a multi-tenant SaaS platform with a focus on clear domain boundaries, testability, and safe iteration under changing requirements
- Balanced architectural improvements with delivery constraints, making incremental refactors while keeping production systems stable and maintainable
- Introduced CI pipelines and automated testing (Jest, Cypress) to reduce manual risk, enable safer deployments, and support continuous development
- Built accessible, standards-compliant user interfaces (WCAG) in collaboration with designers and stakeholders, treating accessibility as a core engineering requirement rather than a visual concern
- Mentored and reviewed code for a small team of engineers, maintaining a high bar for readability, reliability, and long-term maintainability
 Rozwój biznesu, Zarządzanie projektami and +5 skills
Transition Technologies MS
Software Engineer
Transition Technologies MS · Self-employed
Sep 2022 - Aug 2023 · 1 yr
Wrocław, Dolnośląskie, Poland · Remote
- Worked on an enterprise-grade sandbox application used by electricians to design and validate complex electrical workflows, with a strong focus on correctness, predictability, and error prevention
- Designed and evolved state management solutions using NgRx to handle highly dynamic, graph-based UI state, prioritizing debuggability, traceability, and long-term maintainability
- Built confidence in ongoing development by contributing to a robust testing setup (Jest, Karma, Cypress), focusing on regression prevention and safe refactoring in a growing codebase
- Implemented WCAG 2.1 accessibility requirements in a highly interactive, diagram-heavy interface, addressing keyboard navigation, screen reader support, and non-trivial focus management
- Worked closely with backend engineers, UX designers, and domain experts to balance domain complexity, usability constraints, and technical limitations in an enterprise environment
 Rozwój aplikacji, GoJs and +3 skills
Cobiro
Frontend Engineer
Cobiro · Self-employed
Feb 2022 - Aug 2022 · 7 mos
Warsaw Metropolitan Area
- Worked on evolving a legacy frontend codebase towards clearer separation of concerns, improving testability and long-term maintainability while keeping the system stable during incremental refactors
- Participated in architectural discussions around introducing domain boundaries and decoupling UI logic from infrastructure concerns in an existing production system
- Improved release reliability by helping introduce automated CI pipelines, reducing manual deployment steps and enabling smaller, safer production changes
- Implemented feature flag-based experimentation and gradual rollout mechanisms, focusing on safe exposure of changes, fast rollback, and minimizing user-facing risk
- Collaborated closely with product and backend teams to balance experimentation needs with system stability and technical constraints
 Hexagonal Architecture, Feature Flags and +5 skills
Roche
Frontend Engineer 
Roche · Contract
Jan 2021 - Jan 2022 · 1 yr 1 mo
Wrocław, Dolnośląskie, Poland · Remote
- Worked on internal medical research applications built with Angular and TypeScript, used by researchers to analyze and validate clinical data in a regulated environment
- Focused on application reliability, data correctness, and predictable behavior under strict compliance and privacy requirements
- Improved runtime performance through incremental changes such as route-based lazy loading and API usage optimization, validated via production monitoring and user feedback
- Contributed to a strong testing culture using Jest and Karma, with emphasis on regression prevention and safe refactoring rather than raw coverage metrics
- Collaborated closely with backend engineers and product stakeholders to deliver changes safely in a domain with low tolerance for errors
 RxJS, angular and +3 skills
BRAINODE sp. z o.o.
Junior Frontend Developer
BRAINODE sp. z o.o. · Contract
Aug 2019 - Dec 2020 · 1 yr 5 mos
Wrocław, Dolnośląskie, Poland · Hybrid
- Worked on a high-end e-commerce platform with real-time 3D product visualization built in Angular and Three.js, focusing on performance, rendering stability, and cross-browser compatibility
- Contributed to the development of a custom WebGL-based rendering layer, collaborating closely with senior engineers on rendering pipelines, scene optimization, and animation handling
- Implemented real-time currency exchange functionality using WebSockets, ensuring data consistency and graceful fallback handling under unstable network conditions
- Gained early experience in writing maintainable TypeScript code, debugging performance bottlenecks, and collaborating within a small, fast-moving Agile team
 angular, TypeScript and +4 skills
```

### New CV (verbatim, pasted by Adrian on 2026-10-02, phone removed)

```
Adrian Turbiński
Senior Frontend
Engineer (Angular)
“ People ignore design that
ignore people. ”
Frank Kimero
Email
adrian.turbinski@gmail.com
Phone
[removed, not for publication]
Address
Wrocław, Poland
Socials
Linkedin
adrian-turbinski
Languages
English
C1
Polish
Native
Technologies & Frameworks
Frontend Tools and testing
• Angular
• TypeScript
• JavaScript
• NgRx
• SignalStore
• RxJS
• Signals
• REST API
• Webpack
• Git
• Docker
• Jest
• Karma
• Cypress
• GitHub Actions
• Node.js
Architecture & Development Practices
Agile Code review
Unit, integration and
e2e tests
Performance
optimization
Hexagonal
architecture
Domain-driven
design
Experience
Jan 2025 - current Wrocław
Senior Software Engineer
PSE Innowacje
Led fullstack architecture and development of a diagram-driven web app
for high-voltage power grid infrastructure: Angular 19, TypeScript, RxJS
and GoJS 3.x on the frontend, Java/Quarkus with Oracle DB on the
backend
•
Drove GoJS 3.x migration and introduced modern Angular patterns
(standalone components, signals, #private fields) to improve long-term
maintainability
•
Onboarded and mentored new engineers in a 5-person team, setting
shared architectural standards, code review practices and a testing
strategy (Jest, Karma)
•
Designed a Quarkus (Java) backend layer with batch processing, Oracle
DB performance tuning and REST API design within a hexagonal
architecture
•
Translated ambiguous, evolving requirements from domain analysts into
technical solutions in Scrum, taking part in sprint planning and backlog
refinement
•
Sep 2023 - Dec 2024 Remote
Senior Software Engineer /
Technical Lead
Media Hunters
Led a cross-functional team and contributed to multiple long-lived
fullstack web applications (Angular/TypeScript frontend, Node.js
backend), owning end-to-end code quality, architecture, and technical
decision-making
•
Designed and evolved a multi-tenant SaaS platform with clear domain
boundaries using NgRx for state management, RxJS for reactive data
flows, and Node.js-based API services with strong testability at every
layer
•
Mar 2023 - Nov 2023 Remote
Frontend Developer
Transition Technologies MS
Designed NgRx-based state management for highly dynamic, graphbased UI state with RxJS operators, prioritizing debuggability and
maintainability
•
Developed an enterprise sandbox app for electricians to design and
validate electrical workflows using Angular/TypeScript and Node.js,
focused on correctness and error prevention
•
Contributed to a testing setup (Jest, Karma, Cypress) enabling safe
refactoring across a growing codebase, focused on regression prevention
•
Worked within Agile/Scrum ceremonies: sprint reviews, retrospectives
and cross-team architectural discussions
•
Feb 2022 - Aug 2022 Remote
Frontend Engineer
Cobiro
Drove incremental refactoring of a legacy Angular/TypeScript frontend
codebase in an e-commerce platform toward clearer domain separation,
improving testability while keeping production systems stable
•
Implemented feature flag-based experimentation and gradual rollout
mechanisms using RxJS reactive patterns, enabling fast rollback and
minimal user-facing risk
•
Jan 2021 - Jan 2022 Remote
Frontend Engineer
Roche
Improved runtime performance through lazy loading, RxJS-driven API
optimizations and OnPush change detection, validated against
production monitoring and user feedback
•
Worked on internal medical research apps in Angular and TypeScript
used by researchers to analyze clinical data in a regulated, complianceheavy environment
•
Contributed to a testing culture (Jest, Karma) focused on regression
prevention, working within strict quality gates required by healthcare
compliance
•
Aug 2019 - Dec 2020 Wrocław
Junior Frontend Developer
Brainode sp z oo
Built a high-end currency exchange platform with real-time 3D product
visualization using Angular, TypeScript, and Three.js on the frontend,
supported by Java and Node.js backend services, focusing on rendering
stability and cross-browser performance
•
Contributed to backend API development (Java, Node.js) and a custom
WebGL rendering layer, collaborating with senior engineers on scene
optimization and animation pipelines
•
Skills
```

CV and LinkedIn disagree here. LinkedIn wins for dates, titles and scope (Adrian: "kieruj się linkedinem"); the CV adds technical detail where it does not conflict (PSE: Angular 19, GoJS 3.x migration, standalone components, signals, Java/Quarkus backend layer with batch processing, Oracle tuning, REST, hexagonal architecture, 5-person team, Scrum; Roche: OnPush; BRAINODE: Java and Node.js backends).

- Transition Technologies MS: CV "Mar 2023 - Nov 2023, Frontend Developer", LinkedIn "Sep 2022 - Oct 2023, Software Engineer".
- BRAINODE: CV "a high-end currency exchange platform with real-time 3D product visualization", LinkedIn "high-end e-commerce platform with real-time 3D product visualization" plus a currency exchange feature.
- Media Hunters: CV "Remote", LinkedIn "Wrocław".
- The CV quote is credited to "Frank Kimero"; the author is Frank Chimero. Fix it if the quote is ever used.

### Featured projects (content/featured)

Adrian, 2026-10-02: TailorCloth stays; HouseBarber and ZnajdzDotacje.com are out; new projects come later. The two rows below stay only as a record.

TailorCloth is a real product Adrian delivered ("tailor cloth to prawdziwy produkt który realizowałem") and he has the client's permission to use screenshots of tailorcloth.com. Checked on 2026-10-02: tailorcloth.com runs on WordPress and its footer says "IMPLEMENTED BY: EPIC AGENCY"; the site shows the "TAILORCLOTH CREATORS" order platform in its "How we make the process easier?" section (`wp-content/uploads/2023/08/platform3-1.png`). The prototype uses a crop of that order form (`rebrand-explorations/b-na-miare/assets/tailorcloth-order.webp`, 880x595, 24 KB). What exactly his team built is in Needs.


| Folder | Title | Date field | Link | Tech | What the file says |
| --- | --- | --- | --- | --- | --- |
| wear_store | TailorCloth Digital Transformation | 2024-01-01 | https://tailorcloth.com/ | Odoo, Python, JavaScript, PostgreSQL | Tailoring company from Krakow, "partnered with Media Hunters"; responsive website on Odoo, customized product management modules, secure platform for trusted users, local and international invoicing, automated warehouse processes, a no-price ordering system for tailored business offers |
| house_barber | HouseBarber App | '4' | '#' (none) | Ionic, Angular, Node.js, PostgreSQL, PWA | PWA to book a barber to your home in the UK; geolocation real-time tracking, personalized booking, offers for students and budget-conscious clients; scheduling and route optimization |
| donations | ZnajdzDotacje.com - Grant Search Engine | '5' | https://znajdzdotacje.com/ | Angular, Node.js, AI Integration, Google Search API, Stripe | EU grant search engine for entrepreneurs and organizations; AI-driven matching; filters by entity type, region and sector; real-time updates; Stripe payments; expert support |

Covers are `demo.png`, 689x934 and 689x936 portrait mockups cropped for the old alternating layout. They show "Ready To Wear" (not TailorCloth), "houseBarbers" with lorem ipsum bullets, and "GrantsFinder.eu" (not ZnajdzDotacje.com). Only TailorCloth's text says who built it.

### Tech

- New CV: Angular, TypeScript, JavaScript, NgRx, SignalStore, RxJS, Signals, REST API, Webpack, Git, Docker, Jest, Karma, Cypress, GitHub Actions, Node.js; Java and Quarkus, Oracle DB, GoJS 3.x (PSE); practices: Agile, code review, unit, integration and e2e tests, performance optimization, hexagonal architecture, domain-driven design.
- LinkedIn (primary): Angular, TypeScript, RxJS, Node.js, NgRx, GoJS, Three.js, WebGL, WebSockets, Jest, Karma, Cypress, CI pipelines, feature flags, hexagonal architecture, WCAG 2.1, multi-tenant SaaS.
- Also evidenced in content and resume: JavaScript, React (resume), Jasmine (content/jobs Roche and Starry), PostgreSQL, Ionic, PWA, NX, CircleCI, Angular Material, SCSS, Bootstrap, Figma, DataDog Synthetics, Odoo, Python, Stripe, Google Search API.
- `about.js:128` is the template default list (Eleventy, WordPress and the rest); not used.
- Resume achievements, allowed by Adrian on 2026-10-02 ("yes"), quoted as the resume states them: "BOOSTED PROJECT EFFICIENCY BY 30%...", "IMPROVED ELECTRICIAN WORKFLOWS BY 25%...", "REDUCED CODE DUPLICATION BY 40%...". No baseline exists, so they are shown as his claims, never as audited metrics.

## Content model and routes

- Sourcing: `gatsby-source-filesystem` on `content/` and `src/images`, `gatsby-transformer-remark` with remark-images, external-links, code-titles, prismjs. Plain `.md`, no MDX installed.
- Jobs: `content/jobs/<Folder>/index.md`, frontmatter `date` (ISO, sort DESC), `title`, `company`, `location` (queried, never rendered), `range` (free text), `url`; body is bullets plus a `**Skills:**` line. Folders `Upstatement` (Media Hunters) and `Starry` (BRAINODE) are template names.
- Featured: `content/featured/<folder>/index.md`, frontmatter `date` (sort ASC; '4' and '5' are ordering hacks), `title`, `cover` (`./demo.png`), `external`, `tech[]`; body is one paragraph.
- `gatsby-node.js` declares `slug`, `tags`, `showInProjects`, `draft`, `date @dateformat`, `description`, `ios`, `android`, `company`; creates post pages at `frontmatter.slug` (post.js) and `/pensieve/tags/<tag>/` (tag.js); none exist because no file has `slug` or `tags`. It also nulls scrollreveal, animejs and miniraf for SSR and defines `@components`, `@config`, `@fonts`, `@hooks`, `@images`, `@pages`, `@styles`, `@utils` aliases. Queries filter by `fileAbsolutePath` regex.
- Routes today: `/` (anchors `#about`, `#jobs`, `#projects`, `#contact`), `/archive/` (table of every md file, linked from nowhere), `/404/`, static `/resume.pdf` (linked from nav and menu), `/og.png`, `/og@2x.png`, `/slides/intro-to-webdev-workshop.pdf`, plus sitemap, robots.txt, manifest, `sw.js`. No per-project page exists.
- Routes that must survive: `/`, `/archive/` (as Work or an alias of it), `/404/`, `/resume.pdf`. Old anchors fall back to Home.
- The SSR HTML of `/` contains only the loader: zero hits for the name, Cobiro or TailorCloth in `public/index.html`. Crawlers see an empty page today.

## Baseline build and tooling

- `yarn install --frozen-lockfile` works on Node 24.13.0. `yarn build` fails: `RangeError: "length" is outside of buffer bounds` from `ordered-binary` 1.5.2 (`utf8Write` with length `0xffffffff`) and `msgpackr` 1.11.0 under `lmdb` 2.5.x.
- Fix verified in a scratch copy: refresh only the yarn.lock entries of `msgpackr` (1.11.0 to 1.12.1) and `ordered-binary` (1.5.2 to 1.6.2). Both are transitive and inside their declared ranges, `package.json` does not change. Build then passes in 54 s with 5 HTML pages. Apply as the first step of Phase 2.
- Baseline JS (uncompressed): framework 140 KB, shared chunk 136 KB, app 104 KB, chunk 108 72 KB.
- Build warnings: tracedSVG option removed, react-helmet superseded by the Gatsby Head API, deprecated sort syntax (6), "Skipping post creation due to missing slug" (8), manifest icon not square.
- Latest versions: motion 13.5.0 (peer react ^18 || ^19), lenis 1.3.26 (peer react >=17), gatsby 5.16.1 (engines node >=18 <26).
- Tooling: Playwright 1.63 via npx with cached Chromium, `/usr/bin/google-chrome`, Lighthouse 13.5 via npx, pdftotext. No ImageMagick and no PIL (use sharp from node_modules). ESLint does not run (ESLint 9 with legacy `.eslintrc` and `@upstatement/eslint-config` that needs ESLint 8). No typecheck (plain JS). `.husky/pre-commit` is empty.

## Template leftovers to remove

- Sections: "Where I've Worked" tabbed jobs, "Some Things I've Built" alternating featured, "Other Noteworthy Projects" grid (exported, not rendered), "What's Next?" contact, numbered headings (`0N.` counters in headings, nav and menu), side email and social rails, hamburger slide-in menu, archive table.
- Hex logo and animejs Loader (home renders only the Loader in SSR), GitHub stars and forks fetch from `bchiang7/v4`, "Designed & Built by" footer.
- Pensieve post and tag templates and their `gatsby-node.js` page creation.
- scrollreveal, react-transition-group, animejs, prismjs with remark-prismjs and remark-code-titles, react-helmet, lodash (only gatsby-node, post, tag), babel-plugin-styled-components (unused), gatsby-plugin-netlify (installed, not registered), gatsby-plugin-google-analytics (`UA-45666519-2`, Universal Analytics stopped in 2023), gatsby-plugin-offline.
- `static/og.png` and `static/og@2x.png` show Brittany Chiang's name and hero: every share of the site shows her card. `static/slides/intro-to-webdev-workshop.pdf` is her 19 MB workshop deck (all three removed in Phase 3 with the recruiter edition; a new share card comes with the OG work in Phase 4). Favicons are her hex "B". Calibre (Klim, commercial) and SF Mono (Apple, proprietary) have no license in the repo.
- `package.json` name "v4", description "Personal Website V4"; `html lang="en"` hardcoded in head.js.

## Body copy language

PL + EN with a switch (Adrian, Phase 1).

- Polish is the default at `/`, English lives under `/en/`, a visible PL/EN switch in the nav, `hreflang` alternates, `html lang` per version.
- UI strings are Polish in the PL version and English in the EN version.
- Both languages get a full copy set. How content files carry two languages is decided in Phase 2 (the current `index.md` files are English).
- Polish copy is first person with masculine past forms (Adrian's brief refers to himself as "his").

## Direction

Chosen: B "Na miarę", reworked into two editions (Adrian, 2026-10-02). A and C stay below as a record. All prototypes live in `rebrand-explorations/` and are deleted in Phase 4.

### B reworked: two editions (chosen)

- Concept: one site cut twice. `/` asks "Kto patrzy?" and hangs two tailor's labels on a rail, "Szyte dla rekrutera" and "Szyte dla klienta". A paper label in the header ("Szyte dla: rekrutera / klienta") switches editions, and the end of each edition links to the other.
- Recruiter edition: h1 "Senior frontend. Tech lead.", a "Karta miar" card with the photo and key fields, a tape timeline of the six employers since 2019 (segment widths are the LinkedIn date ranges), the job list with the resume percentages as handwritten notes, a stack list, and a print stylesheet that turns the page into a two-page A4 CV.
- Client edition: h1 "Od pierwszej rozmowy do produkcji.", the pinned scene "Przód i tył szyję sam." (front-end and back-end as the two pattern pieces of one garment), "Pasuje na każdego." (WCAG 2.1 AA, the European Accessibility Act since 28 June 2025), the TailorCloth case "Na miarę, dosłownie.", the process "Jak to szyjemy." and contact.
- Edition switch: a wool panel with pinked edges covers the page, the edition name is written in Mynerve, a thread line draws, the panel leaves; focus moves to the new h1. Instant under reduced motion.
- Logo (`logo.html`): "Igła nad ń" (recommended; the acute of ń is a needle, a thread in large sizes, the favicon is the ń), "Metka" (woven label), "Cyrkiel i przykładnica" (AT monogram from dividers and a T-square). The letters are Bespoke Serif 700 outlines made with fonttools. The ITF Free Font License 2.0 (17 Aug 2026, `License/FFL.txt` in the Fontshare package) allows this: "You may use the Font Software to create logos, wordmarks, graphic elements, images, vector files" and "Logos and wordmarks created using the Font Software may be registered as trademarks."
- Prototype routing uses hashes (`#/dla-rekrutera`, `#/dla-klienta`) only because it is one file.
- Verified by a fresh agent (run `wf_5f328dc2-890`). Fixed after it: phone overflow on the recruiter edition (the card's entrance swing left a stale scroll width; `main{overflow-x:clip}`), hero text alignment at 768, the "dziś" label, timeline labels under 375, EN client h1 widow, EN pinned scene at 1366x768, the print name line, the slow-CDN replay, "Pracuję na swoim" (conflicts with the PSE job; now "Zlecenia biorę jako freelancer"), recruiter lead rewritten from the LinkedIn headline into what he builds at PSE, TailorCloth wording back to the source ("zrobiliśmy", "bezpieczna platforma", "procesy magazynowe"), "Zapytaj o dostępność" instead of an audit, a note that the percentages are his own estimates from the resume, Cobiro tech line. Its "invented fact" flags on BRAINODE, Roche and Cobiro were checked against the verbatim LinkedIn text and are sourced there.

### A "Cała siatka" (`a-cala-siatka`)

- Concept: one cell versus the whole grid. In other companies' teams he wrote the front-end of their products (one pine cell); in Media Hunters he takes the whole product (the pink field takes the whole grid). A 12-column grid drawn with 1px rules; motion rearranges the layout itself.
- Positioning: "Piszę kod i prowadzę własne studio." / "I write code and run my own studio." "Piszę kod" sits in a pine cell, the rest on the pink field.
- Palette: pink #FF8FC7 (studio field), pine #0F5C3F (engineer cell, footer), tomato #F2452D (contact), white #FFFFFF (ground), ink #0C1411 (text, rules). Ink on pink 8.9, white on pine 8.0, ink on tomato 5.04, ink on white 18.7.
- Type: Funnel Display and Funnel Sans (Google Fonts, OFL, variable 300 to 800), one family for everything.
- Wordmark: "Adrian Turbiński" in Funnel Display 600 beside a 2x2 grid mark; its filled cell moves between quadrants per section and turns tomato at contact.
- Signature motion: pinned scene "Droga" (#zakres), four states driven by a scroll spring: one cell, four company cells whose widths are the time spent at each company (3/2/4/3 of 12), three stack cells "Od 2023 cały stos.", then the pink field takes the grid "Teraz biorę cały produkt.". Pin only at min-width 900 and min-height 760, otherwise a static stack.
- Projects: three full-height columns, one open, closed ones with rotated titles; buttons in h3 with aria-expanded, inert closed bodies, arrow keys, instant under reduced motion; below 900px a plain list. In production the same layoutId grammar carries a column into the project header.
- Round two fixes by the orchestrator: copy limited to sourced facts ("W czterech firmach pisałem front-end cudzych produktów", "Od 2023 cały stos" instead of "kawałek" and "Potem"), unequal company widths instead of four equal tiles, duplicate line removed, ArrowUp and ArrowDown left to the page, scroll spy on rAF, larger tile text.
- Open: no in-page nav below 560px (the hero CTAs cover it; production nav is Phase 2).

### B "Na miarę" (`b-na-miare`)

- Concept: the site as a tailor's table; engineer and studio are two pattern pieces sewn into one product.
- Positioning: "Inżynier z własnym studiem. Robię całe produkty dla klientów, na miarę."
- Palette: wool #5A1424, wool deep #3B0D18, chalk #E9EFF6, chalk dim #C3CEDD, chalk blue #9DBBE0, paper #CBD3DA, ink #14181F, thread #8E1226.
- Type: Bespoke Serif (Fontshare) display, Schibsted Grotesk text, Mynerve hand notes.
- Signature motion: pinned "Zszywam to w jedno." (#dwa-fachy), pieces drawn by scroll and pulled together by a ladder stitch. Pin at min-width 900 and min-height 760.
- Round two fixes: static seam note no longer hits the captions at 1280x600, "W tej ostatniej zbudowałem" (TTMS only), "ta sama osoba" instead of "jedna osoba" (not a headcount claim), Media Hunters link in the footer.
- Open: closest of the three to the "warm dark editorial" bullet (dark burgundy with a large serif, no gold); the metaphor comes from a client (TailorCloth); the double role is not in the h1; three families plus a soft-light grain layer.

### C "Wirnik" (`c-wirnik`)

- Concept: one kinetic system with two states, line is the engineer, fill is the studio; the rotor mark comes from the surname (turbine).
- Positioning: "Kod piszę jak inżynier. Produkty oddaję jak studio."
- Palette: concrete #D5D9DC, ink #0E1114, signal #FFD200, ink 2 #343B41, footer grey #A9B0B5.
- Type: Anybody (variable wdth and wght) display, Public Sans text.
- Signature motion: pinned scene (#o-mnie, 440vh): the TTMS high-voltage tower draws by scroll, a yellow seam wipes with the rotor rolling on it, "PISZĘ KOD." becomes "ODDAJĘ CAŁOŚĆ.". Pin at (1200x600) or (1024x700) and up.
- Round two fixes: nav order matches the page, Anybody on display=swap, Polish copy in the project lines, alt text on placeholder thumbnails.
- Open: footer is ink with a yellow e-mail (cool, not the avoid bullet, but its shape); grain overlay and halftone portrait; hero copy hidden until the motion module loads (5s failsafe), fit-to-width hero is a CLS risk with a font swap.

### Critique and recommendation

- Divergence (verifier, round two): A differs from B and C on every axis. B and C still share a skeleton (hero, pinned two-state scene, project rows, big contact footer), a scene mechanic (line drawn by scroll, then a seam) and a device kit (skewX on velocity, grain overlay, treated portrait, tilt). They differ in color, type and metaphor.
- Avoid list: all three pass. Nearest calls: B to "warm dark editorial", C's footer to "dark with one warm accent".
- Recommendation: A. The double role reads in the h1 itself, in words a person says. Its motion grammar (cells that grow, split and hand over) is the production motion system (layout and layoutId from Work to the project header, page transitions as a cell hand-over), so one idea carries all six pages instead of one Home set piece. It is the cheapest to make fast and accessible: one font family, flat color, no texture or blend layers, no SVG drawing. Weakest point: the least human of the three (small photo, no hand-made detail) and a modest mark; Phase 2 should give the moving cell more presence and use a real photo when Adrian sends one.
- After the LinkedIn facts (2026-10-02): the prototypes still carry the old dates, four employers and three projects; production uses the new facts whichever direction wins. The new facts strengthen C: high-voltage power infrastructure is now his domain at two employers (TTMS and his current role at PSE Innowacje), not a one-off motif. In A, "Teraz biorę cały produkt" and the company widths depend on the Media Hunters status and the new dates.
- If Adrian wants the boldest first impression and the most ownable mark, C is the alternative, with grain, halftone and the CDN-gated hero dropped in production. B is the riskiest (avoid-list proximity, borrowed metaphor, heaviest page).

## Sample work (2026-10-02)

The portfolio splits in three. TailorCloth is the real product. Clients get 6 sample websites, recruiters get 6 public repos that cover every CV technology. Adrian, later the same day: the 12 projects are designed only, no code for now ("tylko zaprojektuj, do tego nie pisz kodu na razie"); the main site is finished first, with the split between the real TailorCloth case and the sample websites.

- Briefs for all 12: `PROJECTS.md` at the repo root, committed with this file.
- Adrian approved the Wzornik, its six industries and names included ("wzornik super").
- Recruiter repos: `poczekalnia`, `grafik`, `szafa-na-wymiar`, `obieg-faktur`, `rezerwacje`, `bundle-budget`. Two commits each, README with a made-up scenario as the reason, pushed only after Adrian's OK per repo. They go on the recruiter edition only when they exist. Replaced later on 2026-10-02, see below.
- Adrian, later on 2026-10-02: full briefs for six GitHub repos (`flagwire`, `signal-timeline`, `gridtwin`, `fieldline`, `coschema`, `eventhorizon`) replace the six recruiter concepts. They are saved for later sessions in `~/root/side_projects/briefs/` (outside this repo on purpose). They are built after the sample websites, from 2026-10-03 (see Status). After the first six sample websites come three more: a partial shop, a real-estate agency and a hotel with a booking system (notes in `PROJECTS.md`). Order: the main site, then the client sample websites, then the GitHub repos ("narazie skończymy temat stron przykładowych dla klientów i dopiero potem do tego przejdźmy").
- Sample websites (concepts for made-up businesses): Rozwaga (kancelaria radcy prawnego), Rubryka (biuro rachunkowe), Szkliwo (klinika stomatologiczna), Przystań (gabinet psychoterapii), Przędza (inwestycja mieszkaniowa), Kluska (bistro).
- In the prototype: the client edition shows TailorCloth with a "Prawdziwe wdrożenie" tag, then "Wzornik.", a swatch book of the six sample websites. Each swatch is a strip in the site's own colours and typeface; it opens into a designed hero of that site, who it is for, what is inside, the cut, and "Projekt koncepcyjny. Wersja na żywo w przygotowaniu." The swatches are buttons with `aria-expanded`, closed panels are `inert`, the hero images are `role="img"` with a description in PL and EN. Fonts for the six (Bodoni Moda, Bricolage Grotesque, Outfit, Newsreader, Unbounded, Gloock, all OFL) load from Google Fonts in the prototype and get subset and self-hosted in production.

## Tokens

All in `src/styles/global.css` (`:root`) and `src/motion.js`, ported from the prototype without changes unless noted.

- Colour: wool `#5a1424` (page), wool-deep `#3b0d18` (transition panel), chalk `#e9eff6` (text), chalk-dim `#c3cedd`, chalk-blue `#9dbbe0`, paper `#cbd3da` (edition tag, paper sections), ink `#14181f`, ink-soft `#2f3743`, thread `#8e1226`. Texture: `.cloth` grid and a fixed `.grain` overlay (feTurbulence SVG, soft-light, 0.16).
- Type: display Bespoke Serif 500 and 700 (FFL, files unmodified), text Schibsted Grotesk variable 400 to 600 (OFL, instanced and subset to Basic Latin, Latin-1, Polish letters, punctuation, arrows, euro; features calt, liga, locl, kern, mark; 34 KB), hand Mynerve (OFL, subset, 66 KB). Self-hosted in `static/fonts` with licences, `@font-face` and preloads (Bespoke 700, Schibsted) from `gatsby-ssr.js` through `withPrefix`. Metric-matched fallback faces (`Bespoke Serif fallback` on Times New Roman or Liberation Serif, `Schibsted Grotesk fallback` on Arial or Liberation Sans) with size-adjust and ascent, descent and line-gap overrides computed with fonttools.
- Layout: `--pad` clamp(16px, 4.4vw, 72px), 12 columns, 4 under 900px.
- Motion: easings out `[.2,.8,.2,1]`, swap `[.76,0,.24,1]`, draw `[.4,0,.2,1]`; durations reveal .85, words .9, cover .48, word .35, stitch .4, uncover .58, thread 1.5, knot .35; word stagger .07; skew spring stiffness 400, damping 40; hero entrance delay `--enter` 0s on first load, 0.2s after a transition.

## Phase 2 verification

Run on 2026-10-02 against the production build on 127.0.0.1, with and without `--prefix-paths`.

- Lint (`eslint .`, flat config with js, react, react-hooks 7, jsx-a11y, prettier) and Prettier: clean. No typecheck (plain JS).
- Routes `/`, `/en/`, both editions in PL and EN, `/archive/` and 404 at 1440, 768 and 375: no console errors, no hydration errors, no horizontal scroll. The only 404 responses come from the deliberately missing test route.
- Transitions: home to recruiter, PL to EN, recruiter to client, logo to home, browser back. Each one covers, swaps, uncovers, sets `lang` and title, scrolls to the top and focuses the page h1. Skip link is the first Tab stop and moves focus to `main`. Reduced motion: no panel, instant swap, focus still moves.
- Lighthouse 12.8: desktop Perf 100 (archive 99), Accessibility, Best Practices and SEO 100 on every route, LCP about 0.5 s, CLS 0. Mobile Perf 98 to 99, the rest 100, CLS 0, TBT under 125 ms, FCP 0.9 s, LCP 2.01 to 2.06 s. Observed LCP is the first paint (about 50 ms); the simulated value comes from Lantern averaging a fonts-only graph with a fonts plus all-JS graph on slow 4G and a 4x CPU. Locally `gatsby serve` sends uncompressed files; on the live Pages site (compressed) mobile is Perf 99 to 100 with LCP 1.90 to 1.94 s and desktop Perf 100 with LCP 0.42 s, so the target holds there. Recheck in the Phase 4 audit.
- JS: app chunk 44 KB gzip (78.8 KB before the import fix), framework 45.6 KB, motion features 12 KB and Lenis 5.5 KB load after hydration.

## Phase 3 verification

Local `--prefix-paths` build after `yarn gatsby clean`, served on 127.0.0.1:9000.

- Home, PL and EN: screenshots at 1440, 768 and 375 match the prototype home; the only intended difference is the card without grain. No horizontal scroll. No console errors or hydration warnings on any route (the 404 responses come from the `/nie-ma/` check).
- Labels: hover sway works, keyboard focus ring is visible on the tilted label, Enter and click open the edition with focus on its `h1`. Reduced motion shows the labels at rest with the notes.
- Lighthouse mobile, two runs each: PL 99/100/100/100, LCP 2.0 s; EN 99/100/100/100, LCP 2.0 s; CLS 0. Desktop: 100/100/100/100, LCP 0.5 s. The LCP element is still the title word. Mynerve is requested after hydration (about 110 to 160 ms into the trace).

Recruiter edition (About), PL and EN, two verification rounds of three agents each plus the fix checks:

- Reveals: SSR emits the hidden states of all 10 reveal groups and they open on scroll (direct load, hash, client navigation, language switch). Reduced motion and `scripting: none` show the final states from the first frame. With all JS blocked or the motion chunk blocked everything settles after 6 s, with no reload loop; normal loads never trigger the fallback.
- Print: two A4 pages, contact line right after the h1, text identical to the prototype print, zero phone-pattern hits.
- Navigation: scroll matrix 300 of 300 (normal and reduced, PL and EN, 1440, 375 and mobile), reload lands exactly on the saved position with no animation, hash entry lands on its target, focus moves to the new h1, axe 0 violations after hard loads and transitions.
- Visual: matches the prototype at 375, 768, 1024 and 1440, normal and reduced; no horizontal scroll from 320 to 1920 px; card tilt peaks at 3.69 degrees; CLS 0 on load and full scroll.
- Lighthouse 12 on `gatsby serve` (HTTP/1.1, uncompressed): desktop 100/100/100/100 on Home and both editions, LCP 0.4 to 0.5 s. Mobile before the paint-gated loader: Home 99 with LCP 2.0 s, recruiter 98 with LCP 2.3 s in three runs each; the final round re-measures it. `python3 -m http.server` speaks HTTP/1.0 without keep-alive and inflates simulated LCP to 3.1 to 3.4 s, so Lighthouse always runs on `gatsby serve`.
- Accepted: Back or Forward to an entry with a hash other than `#main` lands on the hash target; reveals wait for the motion chunk that loads at hydration (about 0.3 s on slow 4G); late Bespoke Serif 500 or Mynerve shifts below budget (0.008 and 0.025 with artificial delays); the Roche label keeps 0.73 px at 320 px.
- Baselines for later rounds: recruiter heights at 375 are 6870 (PL) and 6772 (EN); compare rects within 0.5 px and blurred diffs, the card grain matches the prototype statistically, not pixel for pixel.

Final round over the merged site, 2026-10-03, on the Phase 4 build (V1 and V4 in `wf_77c553e6-44f`, V2, V3 and V5 in `wf_155ddfb5-19d`):

- V1, parity with the prototype: the Wzornik and the Work strips both used `.sw` class names, and Gatsby inlines every stylesheet into one tag, so the Wzornik lost its layout and the Work strips lost hover. The Work strips are now `.ws`. The scene captions now move with their pieces. The other differences are explained (the Mynerve subset makes the signature narrower) and need no change.
- V2, accessibility and navigation: axe 0 violations everywhere, keyboard 104 of 104, scroll restore 16 of 16, focus on the new h1 after every navigation, the morph works. Fixed: a ResizeObserver TypeError when the client edition is left at 900 px or wider (0 in 4 runs after the fix), Back after the in-page TailorCloth link now returns to where the visitor was (300, 4534, Back 300, Forward 4534), text links are 24 px tall at 375.
- V3, robustness and content: no JS, a blocked motion or Lenis chunk and a failed page chunk all end with every text visible; print, SEO tags, hreflang, sitemap, links, privacy and dash greps pass. Fixed: the pinned scene releases after 6 s when the motion chunk never loads (2970 px to 813 px, static), Mynerve loads without JS, print breaks on the client edition and the case page, the EN client title is 60 characters, both TailorCloth links open in a new tab.
- V4, Lighthouse before the paint gate: mobile LCP above 2.0 s on every route, `domMax` on every route, the screenshot without priority; all three fixed (see Decisions). Accepted: CLS 0.0022 on the EN client edition when Mynerve arrives, SEO 50 on `/404/` (noindex by design).
- V5, design: fixed the Back morph (the Work text stays hidden until the screenshot lands), the Work strips sit on the 12 column grid and every name uses its own Wzornik face (loaded lazily, like the Wzornik), the arrow at 320 px, air between the note and the first strip, a faster caption fade on mobile, a tighter focus ring on the TailorCloth name, balanced and pretty wrapping for leads and links, a larger 404 note. Done with the sample websites merge: one link per strip, one vocabulary, the lede without the market claim.
- After the fixes: clean `--prefix-paths` build, 13 routes at 1440 and 375 with no console or hydration errors and no horizontal scroll, lint clean.

## Phase 4 verification

Final round, 2026-10-03, on the deploy layout: the Gatsby `--prefix-paths` build with `sites/dist` copied to `public/wzornik`.

- Sample websites: `astro check` 0 errors, 1176 tests pass, 178 pages build in about 3.5 s. A crawl from `/portfolio-v2/`, `/en/` and `/wzornik/` reached 186 pages and 113 assets with 0 broken links. axe, console errors and horizontal overflow: 0 issues on 176 pages at 1440 and 375 px.
- Lighthouse 12.8.2 on `gatsby serve --prefix-paths` (127.0.0.1, HTTP/1.1, uncompressed), headless Chrome, one run per page; mobile is the default throttled profile, desktop the desktop preset.
  - Portfolio, ten routes (Home, both editions, Work and the case, PL and EN): mobile 100/100/100/100 on every route, LCP 1.58 to 1.80 s, CLS 0 except 0.0022 on the EN client edition, TBT at most 23 ms. Desktop 100/100/100/100, LCP 0.36 to 0.41 s, CLS 0.
  - Sample websites, mobile, 15 pages (the Wzornik index, the nine home pages, Kminek and Przęsło in English, the Trzask shop, the Próg listings, the Przęsło booking): 100/100/100/100 except Performance 99 on the Próg listings; LCP 0.90 to 1.80 s, CLS at most 0.0063.
- Live, after the deploy: all 20 checked URLs return 200, the Open Graph images resolve, JSON-LD parses, every portfolio page has a canonical link and three hreflang links, and the HTML has no NUL bytes.
- Fixed in this round: the type check across the merged sites, the Przęsło weekend package note that a review fix had dropped, the NUL bytes in the Gatsby HTML (see Decisions).
- Accepted: the sample note links return 404 only in the Astro preview and resolve in the merged build; the smallest text in the Rubryka drawing is about 10.4 px at 320 px; the lit window of the Próg hero sits below the fold at 1366x768; the Przędza elevation windows are under 44 px, with a keyboard alternative; Tafla keeps its "nazwa@poczta.pl" hint.

## Decisions

| Decision | Reason |
| --- | --- |
| Work on branch `rebrand-2026` | Required by the brief, keeps `main` untouched |
| Keep React 18.3.1, page transitions through AnimatePresence in `wrapPageElement` | React is below 19.3, so no AnimateView; Gatsby 5 is stable on 18 |
| Motion through `framer-motion` 13.5.0 (the React package of Motion) instead of `motion`, and lenis 1.3.26 | `motion/react` reads `fm.motion` at module level, which pulls the full `motion` component with drag and layout projection into the app chunk. Importing `framer-motion`, `framer-motion/mini` and async `domAnimation` cut the app chunk from 78.8 KB to 49 KB gzip. Same code and version |
| Layout path from `location.pathname` minus the path prefix | In SSR Gatsby passes `props.path` as `/*`, which broke hydration of the edition-aware shell |
| Reveal after the new page mounts, not on `onExitComplete` | `onExitComplete` fires before the next page is in the DOM, so focus fell to `body` |
| Transition panel is `display: none` outside a transition, Mynerve is loaded on idle after hydration | A hidden but laid out panel made every page fetch Mynerve (67 KB) before the first paint |
| Lenis loads with a dynamic import after hydration | Smooth scroll is not needed for the first paint |
| Edition tag in the header has no fade and no own texture | Its delayed fade and its SVG noise background made it the late LCP element on edition pages; it still gets the grain from the global overlay |
| ESLint flat config (`eslint.config.js`) and an inline Prettier config | The Upstatement configs were removed with the template; lint now runs |
| Pages keeps the prototype until the Gatsby pages have its content | Switching to the Phase 2 shell hid the sections and projects at the main address; Adrian asked why they disappeared (2026-10-02) |
| Fix Node 24 by refreshing two transitive lock entries | Smallest change that makes the build pass, verified in a scratch copy |
| Update `.nvmrc` from 20.9.0 to 24 | The stack is Node 24 and Node 20 is not installed |
| Remove the home Loader | It is the only thing in the SSR HTML of `/` |
| Delete the template author's assets and fonts | Her name on the share card, her slides, licensing of Calibre and SF Mono |
| Spell the name "Adrian Turbiński" everywhere | Every source agrees except the typo in `gatsby-config.js` |
| Write "BRAINODE sp. z o.o." (replaced in Phase 3, see below) | Correct Polish legal form, as already in about.js |
| PL at `/`, EN at `/en/` | UI strings are Polish by the brief, so Polish is the primary version and existing `/` links keep working |
| Prototypes load fonts from Google Fonts or Fontshare and motion from jsDelivr | Single-file explorations only; production self-hosts fonts and bundles motion |
| Replace direction A after round one | The verifier found A and C were one idea; a fresh designer got a "taken territory" list instead of the other files, so it never saw B or C |
| Pinned scenes need a height guard (about 760px, C at 600 or 700 by width), else a static stack | Common laptop viewports (1366x657, 1280x600) clipped the pinned content |
| Copy claims only what Facts support | "kawałek produktu", "Potem", "Tam zbudowałem", "jedna osoba" read as facts that are not in the sources |
| The round-one A prototype is gone | It lived in a scratch folder that was wiped on restart; it was superseded and is not needed |
| LinkedIn is the source for roles, dates and scope | Adrian: "kieruj się linkedinem" |
| Only TailorCloth stays in Work until new projects arrive | Adrian, 2026-10-02 |
| Host on Vercel, `siteUrl` = the Vercel deployment, remove the unused gatsby-plugin-netlify | Adrian left hosting to the orchestrator; the resume already links the Vercel deployment and netlify is unused |
| Keep the Search Console meta, replace dead UA with GA4 or Vercel Web Analytics, load analytics after interaction or idle | Analytics must work without costing Performance; SEO target is 100 |
| Direction B "Na miarę", reworked into two editions (recruiter and B2B client) | Adrian, 2026-10-02 |
| `/` is a chooser that asks who is looking | Adrian picked "/ pyta, kto patrzy" |
| Freelance developer, no studio brand; Media Hunters only as a past role and as the TailorCloth team | Adrian, 2026-10-02 |
| Availability "Oferty i zlecenia"; B2B services: whole web apps and WCAG accessibility | Adrian, 2026-10-02 |
| Mynerve stays for handwritten notes | Adrian, 2026-10-02 |
| The recruiter edition prints as the CV | One CV source that never goes stale; the PDF was outdated (Needs 5) |
| Wordmark as SVG outlines, not live text | No shift on font load, and the needle sits exactly over the n |
| Logo "Igła nad ń", the full version with the thread | Adrian, 2026-10-02: "wełna, pełna wersja z nitką ten będzie git". At 25 px in the header the thread would be under 1 px, so the header keeps the outline without it; the footer (thread draws on scroll, then the knot) and the OG image use the version with the thread |
| Client edition promises maintenance: "Od wyceny przez wdrożenie po utrzymanie rozmawiasz ze mną." and a fourth step "Poprawki." | Adrian confirmed "Od wyceny do produkcji rozmawiasz ze mną" and added "maintaing klienta również" |
| TailorCloth screenshots come from tailorcloth.com | Adrian has the client's permission |
| Portfolio split: TailorCloth as the real product, 6 sample websites for clients, 6 repos for recruiters | Adrian, 2026-10-02 |
| The 12 sample projects are designed only for now; the main site is finished first | Adrian: "tylko zaprojektuj, do tego nie pisz kodu na razie, kończymy stronę główną" |
| Client edition order: TailorCloth as "Prawdziwe wdrożenie", then "Wzornik." with the six sample websites marked as concepts | Adrian asked for the split between the sample sites and the real case; the real one comes first |
| Websites join web apps and accessibility in the client offer (page title "aplikacje, strony i dostępność") | Adrian wants six sample websites for clients |
| Recruiter repos have exactly two commits each | Adrian: "będą tylko dwa commity initial i commit końca" |
| LinkedIn wins over the new CV for dates and titles; the CV adds technical detail | Adrian's earlier rule "kieruj się linkedinem"; the conflicts are listed under the new CV |
| Recruiter edition updated from the CV: PSE description and tech, stack list (Signals, SignalStore, Java and Quarkus, REST, Oracle, Docker, GitHub Actions, Webpack, Git, DDD), "Sposób pracy", "Języki" | The CV is newer than the site copy and does not conflict there |
| Bespoke Serif self-hosted from the official Fontshare WOFF2 files, unmodified (Medium 24.6 KB, Bold 24.8 KB); only the OFL fonts (Schibsted Grotesk, Mynerve) get subset | The FFL forbids "subsetting, format conversion" without ITF's consent but allows self-hosting through `@font-face` |
| TailorCloth: his Media Hunters team built it on Odoo (website, custom modules, ordering platform); another agency took over maintenance later, which is why tailorcloth.com now runs on WordPress with "Implemented by: Epic Agency" | Adrian, 2026-10-02: "tailor cloth potem przejęła inna agencja na maintaining ale odoo się zgadza" |
| CV and LinkedIn conflicts: the timeline comes from LinkedIn | Adrian: "timeline weź z LinkedIna" |
| Wzornik approved as designed | Adrian: "wzornik super" |
| Phase 2 approved | Adrian: "do dzieła" |
| Hosting on GitHub Pages; everything goes into git | Adrian: "wszystko na gita i potem GitHub Pages hostujemy" |
| TailorCloth case gets "Dziś stronę utrzymuje inna agencja." / "Another agency maintains the site today." after the team line | Adrian: "4. tak, dodaj" |
| Address: `adiyy2001.github.io/portfolio-v2/`, `siteUrl` https://adiyy2001.github.io with `pathPrefix` `/portfolio-v2` | Adrian: "po najprostszej linii oporu" |
| Prototype screenshots stay local (ignored, 184 MB); prototypes, notes and verification scripts are committed | Keeps the public repo small; the folder is deleted in Phase 4 anyway |
| Home labels keep the prototype look but rest visible from the first frame: the entrance is rotation only (CSS keyframes on the spring `linear()` curve), no fade, no grain on the card | Large on mobile; a fade from 0 or a late data URI background made them a late LCP candidate in Phase 2 tests |
| Label sway on hover runs through WAAPI, mouse only, skipped with reduced motion | Same keyframes as the prototype, no Motion code on the home page |
| Mynerve is not in `--hand` until `html.hand` is set; `onInitialClientRender` loads it on idle and then adds the class; the label notes fade in at that moment | With the notes above the fold, Mynerve loaded with the critical fonts and moved mobile LCP from 2.0 s to 2.2 to 2.3 s |
| Mynerve subset again without `calt` (33.2 KB) | `calt` turned "LinkedIna" into "LinkedIma" |
| Section components (`card`, `experience`, `kit`, `close`) own their copy as `copy = { shared facts, pl, en }` and take `lang`; page files keep the hero copy and `Head` | One file per section; facts shared by both languages are written once |
| The measurement card values (`.card dd`) wait for `html.hand`, like the home label notes | They sit above the fold in Mynerve; same LCP reason |
| The card photo is a plain `<picture>` built from `gatsbyImageData` (fixed 76 px, quality 90, no placeholder), not `StaticImage` | `StaticImage` pulled about 34 KB of gzipped gatsby-plugin-image code into the page before LCP for a 76 px photo |
| The new LinkedIn photo replaces `src/images/me.jpg` | Adrian: new photo; the old 200x200 one is retired |
| `--spring` holds the CSS `linear()` spring (stiffness 90, damping 8) for the hanging label and card entrance | One curve for both hanging elements |
| The recruiter edition prints as the CV: the button calls `window.print()`, `@media print` resets everything under `main` and hides the screen-only parts | The prototype prints the same way; two A4 pages, no phone number |
| Magnet only on the primary CTA ("Napisz do mnie"), through `Magnet` (spring 240/18, mouse only, off with reduced motion); card tilt 3.5 degrees per axis at the edge, spring 180/20 | Motion brief: magnet on primary CTAs only, tilt up to 4 degrees; damping 16 overshot to 4.2 degrees on a fast pass, 20 keeps the peak under 4 |
| Section ids `doswiadczenie` and `experience` | Readable anchors in each language |
| Company names on the site stay short (BRAINODE, PSE Innowacje), as in the prototype; legal forms stay in Facts | Replaces the Phase 0 decision to write "BRAINODE sp. z o.o.", made for the old about.js |
| Media Hunters tech line: Angular, TypeScript, NgRx, RxJS, Node.js, Jest, Cypress | The CV entry names Angular, TypeScript, NgRx, RxJS and Node.js, LinkedIn adds Jest and Cypress; React had no source for this job and is gone from the line (the prototype too) |
| Find-in-page matches single words in split headings, not phrases across words | Each word is an inline-block mask for the reveal; body text is unaffected; same as the prototype |
| Scroll reveals start hidden in the SSR HTML (`AnimatePresence` without `initial={false}`); `@media (prefers-reduced-motion: reduce), (scripting: none)` forces the final state of every reveal target (`[data-reveal]`, timeline parts, footer thread and knot) and print already did | `initial={false}` turned off every `whileInView` reveal on a direct load, the main way a recruiter arrives; the CSS keeps everything visible with motion off or without JS, as in the prototype |
| Reveals, the timeline and the footer thread use instant transitions under reduced motion | No running animations with reduced motion, also after a client-side navigation |
| The card paper grain is an inline SVG (`svg.card__grain`, the `--grain-lite` filter) behind the card content, not a CSS background | As a background, also on a pseudo-element, the grain became the mobile LCP element on the EN page; an SVG rect with a filter is not an LCP candidate |
| Gatsby's route announcer is silenced (`aria-live="off"`); moving focus to the new page's `h1` announces the page | With the cover transition the announcer read the old page's `h1`, in English, about a second before the new page existed |
| Back and Forward restore the scroll position: a `popstate` flag, `history.scrollRestoration = 'manual'`, `lenis.resize()` before the scroll | `location.action` is undefined in `shouldUpdateScroll`, so Back always went to the top, and the browser scrolled the outgoing page under the panel |
| Below 900 px the timeline segments keep only the top and bottom dashes | The side dashes crossed the first letter of every label |
| Split headings keep a space before each line break | `textContent` and copied text read "frontend. Tech", not "frontend.Tech" |
| Hidden reveal states settle through CSS animations after 6 s unless `html.motion` is set (it is set when the motion features load) | SSR now carries the hidden states, so a failed or blocked bundle left everything below the first screen blank |
| Failed lazy chunks (motion features, Lenis) are caught | Gatsby reloads on "Loading chunk failed" without a guard; a permanently blocked chunk reloaded the page about every 100 ms |
| Reload restores the saved position with `behavior: 'instant'` | `scrollRestoration = 'manual'` with `html { scroll-behavior: smooth }` animated every reload from the top |
| `.job__win` is a block with `width: fit-content` | As an inline-block its line box grew 2 px until Mynerve arrived, so reload landed 6 px off |
| The route announcer also gets `aria-hidden` | It kept the previous page's text and failed the axe region rule after every transition |
| Label notes are split in two around the thread | The thread crossed a letter of the note at most widths under 540 px and at 900 to 1280 px |
| Gatsby loads page data and page chunks after the first paint (`onClientEntry` waits for the paint entry, 300 ms cap) | Lighthouse's simulation counted the page chunks into LCP whenever they finished before the first frame: recruiter mobile LCP 2.3 s against 2.0 s on Home |
| Remaining pages built in parallel from a scaffold commit, tested once after the merge | Adrian: speed first with the same quality; the scaffold gave every agent its own files, so the five branches merged without conflicts |
| The pinned scene pins through one media query (min-width 900 px, min-height 760 px, no reduced motion, scripting enabled) that CSS and JS share; SSR and no-JS render the final state | One source of truth: reduced motion, short windows, print and no-JS never pin, and the content is complete without animation |
| The scene arms only after the motion features chunk mounts (callback ref plus `html.motion`) and computes its leaves straight from the root motion values | LazyMotion with async features resets styles to the hydration snapshot, and the frame batcher ran children before parents, which left stale stitches |
| `Close` takes `edition` ('rec' by default, byte-identical output; 'cli' adds the `kontakt`/`contact` id, the mail subject and the signature, no print button) | One close component for both editions, as in the prototype |
| Client mail subjects: hero and close "Projekt"/"Project", the accessibility CTA "Dostępność"/"Accessibility" | Easier sorting of incoming mail; the prototype had no subject on the accessibility CTA |
| The case teaser image is a CONSTRAINED 560 px AVIF/WebP `<picture>`, lazy, with a mouse-only tilt of at most 3.46 degrees | Nothing competes with the hero h1; the tilt stays under the 4 degree brief |
| The six Wzornik faces load through the FontFace API with `withPrefix` URLs when the section is within 150 % of the viewport (IntersectionObserver); 6 files, 131 KB, axes trimmed to the used ranges | Gatsby inlines CSS, so a `url()` would resolve against each page URL; no request and no preload on load |
| Closed Wzornik panels get `inert` only after hydration, `scripting: none` opens all panels, mock-ups carry `lang="pl"` on the EN page too | Without JS the whole book is readable; the sample sites are Polish businesses |
| Work and TailorCloth morph with `layoutId` through a fixed incoming page (`AnimatePresence` mode `sync` only for that pair in one language, with the motion chunk loaded and the shared frame at least half visible); every other navigation keeps the cover | `mode="wait"` unmounts the old page before the new one measures, which drops the layout snapshot |
| Every page sits in a `.page` wrapper inside `main`; the global motion features are `domAnimation`, and `domMax` loads only inside the TailorCloth screenshot (a nested `LazyMotion`; after the first load the bundle is passed synchronously, so the morph has its projection node on mount) | The wrapper is the stage of the morph. Layout projection is used only by the screenshot; a global `domMax` cost 13.4 KB gzip on 9 of 11 routes. The morph was rechecked at 1440 and 375 in both directions |
| Work index: h1 "Z warsztatu." / "From the workshop." with an sr prefix, the TailorCloth pick and the six concept strips linking to the Wzornik; the footer links it on every page | `/archive/` survives as Work and is reachable; no table, grid or numbering |
| The 404 is one bilingual page; `wrap.js` takes the layout path from `pageResources.page.path` on the client, so the 404 chrome stays Polish on `/en/` paths | GitHub Pages serves one `404.html`; the missing URL as the layout path hydrated English chrome over Polish HTML |
| Under 900 px every `.sec-head__side` gets `margin-top: 16px` in `global.css` | The prototype has the rule globally; four agents had added scoped copies |
| The therapy practice is Tafla (was Przystań) and the bistro is Kminek (was Kluska) | A check on 2026-10-02 found real Wrocław businesses in the same trade under the old names; the other names were clear (`PROJECTS.md`, "Names checked") |
| The sample websites are live: one Astro 7 project in `sites/`, served at `/portfolio-v2/wzornik/<slug>/` from the same Pages deploy; Preact islands only for the shop (Trzask), the agency (Próg) and the hotel (Przęsło) | Adrian left it open (Needs 2) and later said to decide alone; live sites prove more than screenshots and need no new repos or hosting |
| Nine sample websites instead of six: Trzask (coffee roastery with a shop), Próg (estate agency) and Przęsło (hotel with booking) follow the first six | Adrian, 2026-10-02: a partial shop, an estate agency and a hotel with a booking system |
| The nine sample websites are `noindex`, the Wzornik index stays indexable; every page footer says the business is made up and links back to the portfolio; no photos, no reviews or testimonials, e-mails on `.example`, phones on the unassignable `+48 71 000 00 0N` | Honest samples that still read like real businesses, kept out of search results next to real ones (indexable until 2026-10-03); the Figma work account is not used for personal projects, so no generated imagery |
| `gatsby-node.js`: the pensieve post and tag page creation, the lodash import, the null loaders and the unused aliases are gone; only the content schema stays | `src/templates` no longer exists, so any Markdown file with a slug would have crashed the build |
| `gatsby-node.js` `onPostBuild` moves the three entry scripts (webpack-runtime, framework, app) behind the first contentful paint, with a 1.5 s fallback | Gatsby 5 emits them in the `_gatsby-scripts` slice, which no SSR API can reach. On localhost they and the fonts finished before the first frame, so Lighthouse's simulation counted about 176 KB as paint-blocking: mobile LCP 2.03 to 2.44 s against the 2.0 s bar, 1.50 to 1.80 s with the gate in the verifier's runs |
| The TailorCloth screenshot has `fetchpriority="high"` (lowercase, React 18 warns on the camelCase prop; ESLint allows it by name) and 440, 660 and 880 px widths | It is the LCP element of Work and the case page |
| Open Graph: ten 1200x630 JPEG cards (Home, both editions, Work and the case, PL and EN) in the brand fonts, made by a script from the logo, colours and page titles; JSON-LD `@graph` with Person, WebSite and the page (ProfilePage for the recruiter edition, CollectionPage for Work), plus a CreativeWork for TailorCloth | Share cards and structured data for every indexable route; the template's share card showed its author |
| `/resume.pdf` is the English recruiter edition printed by Playwright (A4, the print stylesheet, two pages); checked by pattern counts only: no phone number | One CV source that never goes stale; English for the legacy English URL |
| No analytics for now | There is no GA4 measurement ID, and Universal Analytics is dead (Needs 1) |
| No service worker cleanup | `main` never deployed to Pages and `adiyy2001.github.io/sw.js` returns 404, so no visitor has the old worker |
| ESLint ignores `.claude/` | Agent worktrees live there and contain full copies of the repo |
| The client copy keeps "Interfejsy w Angularze i Reakcie, także te trudne: diagramy, edytory, widoki 3D" | Adrian approved the prototype copy with this line; LinkedIn has the interactive app that models power line infrastructure with a diagram-based UI in Angular and GoJS, and 3D product views in Three.js; React comes from the old resume |
| Back and Forward pressed many times within 0.7 s keep the cover panel up for about 4.5 s | Each step queues its own cover and reveal; nothing gets stuck and the right page settles; merging the queue would change the transition system for a rare case |
| The case hero on mobile keeps the text above the screenshot | The image first would become the mobile LCP element; the morph runs only when the frame is at least half visible |
| The six Wzornik faces load only with JS | Loading them without JS needs six `@font-face` rules in the head of every page; the fallback stacks are readable |
| No web manifest | The site has an SVG favicon and an Apple touch icon; nothing to install or run offline |
| Trzask sets its text in Chivo (wght 400 to 700, Polish subset, 25.7 KB) instead of Schibsted Grotesk | Schibsted Grotesk is the portfolio's text face; a sample shop in the same face reads as part of the portfolio, not as a business of its own |
| The Wzornik index (`/wzornik/`) uses the portfolio's Bespoke Serif 700, Schibsted Grotesk 400 to 600 and favicon | It is a portfolio page that introduces the samples, not a sample itself |
| `sites/tsconfig.json` sets `moduleDetection: "force"` | After the merge, plain scripts of different sites declared the same top-level names (`button`, `toggle`) and the type check read them as one global scope; renames kept colliding |
| `gatsby-node.js` `onPostBuild` also strips NUL bytes from the HTML | React 18.3.1 pads its stream with 0x00 bytes before a multibyte character that does not fit its 2048 byte view; browsers drop them, but tools treat the file as binary (a hreflang check counted 0 links on a page with 3). Strictly required; the hook already rewrites every HTML file |
| Per-site branches and worktrees removed after the merge, one squashed commit per site on `rebrand-2026` | The squashed commits carry each site; the old tips (`site-rozwaga` fa6c1ab, `site-rubryka` b5ba706, `site-szkliwo` a2fbaf6, `site-tafla` 81a6222, `site-przedza` 58ad6b3, `site-kminek` 12155aa, `site-trzask` bd8022d, `site-prog` 7f6e74d, `site-przeslo` 11985cd) can be restored locally with `git branch <name> <sha>` until git prunes them |
| `/rebrand-explorations` deleted in `715807d`; ESLint ignores `sites/`, which has its own type check and Prettier | The deploy and every page had moved off the prototype; it stays in git history up to `d126616` |
| The GitHub repos are built by agents outside this repo, with local git only | The briefs' own rule: no remote, no push, no publishing, no deploy; Adrian creates the repos and pushes |

Proposed, to confirm at the relevant phase:

- `gatsby-node.js` will need one edit in Phase 3 (Single project): remove the pensieve page creation (template, creates nothing, its templates and lodash go away) and add project pages. Explained to Adrian before the edit.
- Project pages on `gatsby-transformer-remark`, not MDX, unless case studies need React components. Content is plain Markdown and MDX would be a new dependency.
- Drop `gatsby-plugin-offline` and ship a one-time service worker cleanup so returning visitors do not stay on the old site.
- Edition routes: `/dla-rekrutera/` and `/dla-klienta/`, EN `/en/for-recruiters/` and `/en/for-clients/`.
- `/resume.pdf` must survive: either a PDF printed from the recruiter edition at build time, or the new CV as a PDF. GitHub Pages has no server redirects, so a redirect to `/dla-rekrutera/` is out.
- GitHub Pages: deploy from a GitHub Actions workflow (`actions/deploy-pages`) on Node 24, with Pages set to "GitHub Actions" in the repo settings. At `adiyy2001.github.io/portfolio-v2/` Gatsby needs `pathPrefix: '/portfolio-v2'` and `gatsby build --prefix-paths`; with a custom domain, `static/CNAME` and no prefix. Pages sets its own cache headers and allows no custom headers or redirects. The old Vercel deployment keeps serving the old site until Adrian removes it.
- TailorCloth case: the line that another agency maintains the site today is in the prototype (Adrian OK); carry it into the case page in Phase 3.
- Page mapping, to agree with Adrian before Phase 3: Home becomes the chooser; About becomes the recruiter edition; the client edition takes services, process and contact; Work (`/archive/`) lists projects (TailorCloth for now); Single project is TailorCloth at its own slug, linked from the client edition; Contact is the end of each edition, so no separate page unless Adrian wants one; 404 in both languages.
- Decided alone on 2026-10-03 (Adrian: „nie czekaj na nic z moją akceptacją [...] podejmuj wg własnego uznania”), all listed in his review task:
  - Analytics: GoatCounter (no cookies, no consent banner, readable by Command Center) instead of GA4. The code `adrianturbinski` goes into `siteMetadata.goatcounter` once Adrian has created the account, and the privacy page sentence about a counter then becomes a fact.
  - Search Console: a Domain property verified with a DNS TXT record at Hostinger, so no token in the code.
  - Copy kept as is: „Kod i dostępy zostają u ciebie”, the EAA sentence (accurate: the Act applies from 28 June 2025 to, among others, online shops and banking) and „Biorę zlecenia” (the privacy page already names his sole proprietorship). No remote-work claim for clients outside Wrocław: it is not confirmed and the rules forbid adding facts.
  - The old `resume.pdf` stays in the public history: removing it needs a history rewrite, a force push and a GitHub Support request that only Adrian can file.
  - Commit e-mail: only `adrian.turbinski@gmail.com`, name Adrian Turbiński (Adrian, 2026-10-04, overruling my noreply choice), for the six repos before their first push and for new commits in side projects. The classifier blocks rewriting history and changing the identity for me, so Adrian runs the scripts in `~/root/side_projects/repo-backups/`. The pushed history of this repo stays.
  - GitHub cleanup: the `.env` in `vue-handling-api` holds only `VUE_APP_BASE_URL`, nothing to rotate. The make-private and archive lists, the profile website, the profile README and the user site redirect are Adrian's task (classifier).
  - `main`: an earlier session already fast-forwarded it to `e977b12`. It moves to `rebrand-2026` again with the Dependabot fix; Pages and the blog publisher stay on `rebrand-2026`.
  - Wzornik extension: autonomous, no plan checkpoint, three worktrees and branches merged into `rebrand-2026` at the end.

## Needs from Adrian

Answered on 2026-10-02: hosting ("zrób, żeby było dobrze", so the orchestrator decides), Media Hunters title (Tech Lead), what changed after 2024 (LinkedIn), studio facts (LinkedIn), HouseBarber and ZnajdzDotacje (removed), project screenshots (later, with new projects), photo (new one), tech list (LinkedIn), resume percentages (allowed), overlaps (LinkedIn), analytics and Search Console (keep, must work, SEO 100), wording "front-end w firmach" and "od pierwszej rozmowy do produkcji" (fine, orchestrator words it), team (a team he managed), old logo (dropped), B handwriting and metaphor ("idk").

Answered later on 2026-10-02: direction (B, reworked into two editions), Media Hunters (no longer a brand; he is a freelance developer), `/` (asks who is looking), availability ("Oferty i zlecenia"), B2B services (whole web apps, WCAG accessibility), handwriting (keep Mynerve), logo (to be designed).

Answered later still on 2026-10-02: logo ("Igła nad ń", full version with the thread), "Od wyceny do produkcji rozmawiasz ze mną" (yes, plus maintenance), TailorCloth screenshots (permission from the client), languages (new CV), new projects (replaced by the 6 plus 6 plan in "Sample work").

Answered last on 2026-10-02: push (yes, notes included), address (the simplest one, `adiyy2001.github.io/portfolio-v2/`), TailorCloth order form (yes, his team's Odoo platform; the line "Dziś stronę utrzymuje inna agencja." is added).

Answered at the end of 2026-10-02: Phase 2 (OK), sample websites (approved), TailorCloth (Odoo is right; another agency took over maintenance later), CV and LinkedIn conflicts (LinkedIn), hosting (GitHub Pages, everything in git).

Update 2026-10-03 (late evening): items 1, 5, 11, 12 and 13 are Command Center tasks for 2026-10-04; items 3, 4, 6 and 7 are decided (see Decisions); item 14: the 154 alerts sit in the root `yarn.lock` of the current site (`main` equals it), fixed after the Wzornik; item 15: `main` is already at `e977b12`.

Open:

1. Analytics: a GA4 measurement ID (UA-45666519-2 is dead since 2023; Vercel Web Analytics is out with GitHub Pages).
2. Sample websites, later: live sites at their own addresses, or screenshots only. Decided on 2026-10-03: live, under `/portfolio-v2/wzornik/<slug>/`.
3. Decided on 2026-10-06 (Adrian): the handover line is softened to "Na koniec przekazuję ci kod i dostępy." (EN: "At the end I hand over the code and the access to you."), because not every engagement ends with the client owning everything. Working remotely is not worth stating (Adrian: everyone does).
4. Decided on 2026-10-03: the print of the English recruiter edition replaced the file. Still open: the old file is in the public git history. `/resume.pdf` is outdated. The new CV is newer: the PDF file of it, or the print of the recruiter edition, or drop the link. Blocker before Pages switches to the Gatsby build: `static/resume.pdf` holds a phone-like number (found by a pattern count, the number itself was not read), and the build copies it to `/portfolio-v2/resume.pdf`.
5. The photo is 400x400. A larger original of the same shot, if it exists, for any frame above about 300 px.
6. Decided on 2026-10-06 (Adrian): "Oferty i zlecenia" stays public while he is employed at PSE Innowacje. He invoices B2B (own business); the client edition lead says so.
7. Decided on 2026-10-06 (Adrian): the EAA sentence in "Pasuje na każdego." stays.
8. The Work index lists the six Wzornik concept sites next to TailorCloth, each marked as a concept and linking to the Wzornik. Keep, or show only TailorCloth there. Kept (2026-10-03); the strips link to the live sample websites once they are up.
9. 404 copy: "Nie ma takiej strony.", "Tu nic nie uszyłem.", "Literówka w adresie albo coś przeniosłem.", the note "tu skończyła się nitka" (EN: "No such page.", "I haven't sewn anything here. A typo in the address, or I moved something.", "the thread ran out here"). Kept as written (2026-10-03).
10. The footer now links "Projekty" on every page, Home included. Kept (2026-10-03).
11. TailorCloth: more material from his own archive (screenshots of the modules he built, the order flow), so the case page says more. Another agency maintains the site now, so today's screenshots may show their work.
12. Done on 2026-10-06: Search Console has a Domain property for `adrianturbinski.pl`, verified by a TXT record on `@` in the Hostinger zone (next to the SPF record), so nothing goes into `seo.js`. Sitemap to submit: `sitemap-index.xml`.
13. Git identity: the commits here and in the six repos use the e-mail from the global git config, a company address. If he prefers GitHub's noreply address, the six local repos can be rewritten before their first push; the commits already pushed here would need a history rewrite.
14. Dependabot lists 154 alerts for `main`, which still has the old template's dependencies. They are rechecked once `rebrand-2026` is merged.
15. Merging `rebrand-2026` into `main` waits for his OK; Pages deploys from `rebrand-2026` until then.

The recruiter repos question (whether the six concepts are right, GoJS for repo 4) is closed: Adrian's six briefs replace them and allow only permissive dependencies, so no GoJS.

## Local SEO (2026-10-06)

- Adrian asked to rank first in Wrocław. Titles and descriptions of the six main routes now lead with the service and the city ("Programista front-end i Angular Wrocław", "Programista freelancer Wrocław: aplikacje, strony, WCAG", the recruiter pages with "Senior Angular developer Wrocław"). The visible h1 lines are unchanged.
- JSON-LD has a `ProfessionalService` node ("Adrian Turbiński Software", area served Wrocław, Dolnośląskie, Poland) on the home and client routes, and the `Person` node lists NgRx, WCAG and accessibility. `llms.txt` says he is available in Wrocław and remotely.
- Keyword choice came from search results, not from a volume tool: there is no Ahrefs, Semrush or Search Console API access. Check the volumes in Keyword Planner and the queries in Search Console after two to four weeks, then adjust the copy.
- Not done, needs Adrian: Google Business Profile (the main lever for the local pack, saved as a Command Center task for later) and local backlinks (Clutch, GoWork, WroclawIT, LinkedIn headline with Wrocław).
- Commits in this repo use `adrian.turbinski@gmail.com` only. The last commit was force-pushed once to fix that; the older commit `0225870` keeps the company address and stays as it is (Adrian, 2026-10-06).

## Recruiter case studies (planned 2026-10-06)

Adrian, 2026-10-06: every portfolio repo gets its own case study on the recruiter edition, so a recruiter or a hiring engineer gets the project's "five minutes": what it does, why it exists, the features, the decisions and what was left out.

- Projects: flagtide, gridtwin, coschema now; signal-timeline, eventhorizon and fieldline when they are public.
- Routes: same pattern as TailorCloth, `/archive/<repo>/` and `/en/archive/<repo>/`, listed on the Work index and linked from the recruiter edition (`/dla-rekrutera/`, `/en/for-recruiters/`). Body copy PL and EN like the rest of the site.
- Each page, in this order, readable in about five minutes:
  1. One sentence on what it is, the demo GIF from the repo (`docs/media/demo.gif`), buttons to the live demo and the repository (npm too for flagtide).
  2. Why it exists: the problem and the goal, from the README's "Why I built this", in Adrian's words.
  3. What it does: four to six features a visitor can try in the demo, each with one line on how to see it.
  4. Three hard parts or decisions with the trade-off and the alternative that lost, linked to the ADRs.
  5. Numbers: only measured ones from the README and `bench/results` (tests, coverage, benchmarks, propagation or frame times), with what they were measured on.
  6. What is not built and why (the README limits and the "not built" ADR), and what would come next.
  7. Stack chips that map to the CV technologies, and the related blog article once Command Center publishes it.
- Facts come only from the repos (README, ADRs, results files) and `NOTES_FOR_ADRIAN.md`; nothing invented. Copy follows "Rules for the material about Adrian" and the avoid list.
- Open Graph card and JSON-LD `SoftwareSourceCode` (or `CreativeWork`) per page, sitemap entries, and Lighthouse 100 on mobile and desktop like the other routes.
- Media: the repo GIFs are large, so convert them to a short muted looping video or a poster plus video, lazy loaded below the hero.

## Pages

- [x] Phase 2 system (tokens, fonts, global styles, motion, Lenis, shell, nav, footer, transitions), approved
- [x] Home (chooser with the two labels)
- [x] Work index (`/archive/`, PL and EN)
- [x] Single project (TailorCloth at `/archive/tailorcloth/`, PL and EN)
- [x] About (the recruiter edition, PL and EN)
- [x] Client edition (`/dla-klienta/`, PL and EN)
- [x] Contact (the close of each edition, no separate page)
- [x] 404 (one bilingual page)
- [x] Phase 4: OG images, JSON-LD, `resume.pdf`, `gatsby-node.js` cleanup
- [x] Phase 4: verification fixes, `lodash` removed, Pages on the Gatsby build
- [x] Phase 4: sample websites under `/wzornik/`, `llms.txt`, final Lighthouse, delete `/rebrand-explorations`
- [x] Wzornik identyfikacja: six case studies and the index, merged on `wzornik-merge`, push pending
- [ ] Wzornik app preview and ASO case studies
- [ ] Recruiter case studies: flagtide (`/archive/flagtide/`, PL and EN)
- [ ] Recruiter case studies: gridtwin (`/archive/gridtwin/`, PL and EN)
- [ ] Recruiter case studies: coschema (`/archive/coschema/`, PL and EN)
- [ ] Recruiter case studies: signal-timeline, eventhorizon, fieldline (when published)
- [ ] GitHub repos: the six from Adrian's briefs, outside this repo (see Status)
