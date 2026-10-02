# Sample work briefs

Design only. Adrian, 2026-10-02: "tylko zaprojektuj, do tego nie pisz kodu na razie". Nothing here gets built until he says so. The main site comes first. Status and decisions live in `REBRAND.md`; this file holds the briefs.

Shared rules:

- Facts rule: the businesses are made up and every README and page says so. No invented clients, users, testimonials or metrics about Adrian. Mock data inside a demo (prices, invoice counts) is fine, because it is shown as a demo.
- Recruiter repos: exactly two commits, `initial commit` and the final one. Built locally in `~/root/side_projects/<repo>`, pushed only after Adrian's OK per repo. No code comments, no em or en dashes (his global rules).
- Before anything is published, check that the made-up names do not belong to a real business in the same trade in Wrocław.

## Recruiter projects

Replaced on 2026-10-02: Adrian sent full briefs for six GitHub repos (`flagwire`, `signal-timeline`, `gridtwin`, `fieldline`, `coschema`, `eventhorizon`). They are kept outside this repo, in `~/root/side_projects/briefs/`, and come after the client sample websites. The six concepts below stay only as a record.

Every README follows the same outline: Why this exists (a scenario, written as one), What it does, Run it (`docker compose up`, seed data, demo login), Architecture (one diagram, the module map), Decisions (ADRs), Testing (what each layer covers and why), What is next. Badges for CI, coverage and the demo. Every repo has a GitHub Actions pipeline (lint, typecheck, unit, integration, e2e where there is UI, build, Docker image), Renovate or Dependabot, CODEOWNERS and a pull request template.

### 1. `poczekalnia`: a waiting room that tells you when you are next

- Why: in a small clinic, patients sit without knowing how long they will wait, and reception answers "how much longer?" all day. One screen in the waiting room, one panel at reception, one page on the patient's phone.
- What it does: reception calls the next patient, moves people between rooms, marks no-shows; the TV screen shows who goes where and announces it; patients follow their place in the queue from a QR code, without an account.
- Architecture: Angular 20 zoneless with Signals and SignalStore, one store per bounded context (queue, rooms, display). Node.js with Fastify and `ws`, PostgreSQL, an outbox table so every queue event reaches every screen once. On reconnect a client sends its last event id and gets only what it missed.
- Libraries: `@ngrx/signals`, `ws`, `drizzle-orm`, `zod` for message schemas shared by both sides, `qrcode`.
- Senior signals: event ordering and replay, idempotent handlers, offline banner and resync, a display mode that survives a sleeping TV, aria-live announcements tested with axe and a screen reader script, WCAG AA.
- Tests: Jest for the store and the event reducer, integration tests against PostgreSQL in Testcontainers, Cypress for the three roles in one run.
- Demo: the front-end on Vercel with a mock socket server in the browser, the full stack with `docker compose up`.

### 2. `grafik`: staff rotas that respect the labour code

- Why: a bakery with three shops plans shifts in a spreadsheet. Every month someone ends up with less than 11 hours of rest between shifts, or one shop opens with nobody who can run the till.
- What it does: managers enter staff, skills, availability and leave; the system builds the next month's rota in a batch job, explains every broken rule, and lets the manager lock shifts by hand and rebuild the rest.
- Architecture: Java 21 and Quarkus in hexagonal architecture (domain, application, adapters), DDD aggregates for Rota, Employee and Location. Timefold Solver for the constraints (rest time, weekly hours, skills, fairness). Oracle Database Free in Docker, Flyway migrations, a Quarkus Scheduler batch job with progress over Server-Sent Events. OpenAPI spec first, the Angular client generated from it.
- Front-end: Angular with NgRx (store, effects, entity) and RxJS for the long-running solve, a drag and drop rota grid, Karma and Jasmine tests.
- Senior signals: a domain that is not CRUD, constraint explanations in plain Polish, the solver behind a port so it could be swapped, ArchUnit tests that keep the hexagon honest.
- Tests: JUnit 5 and ArchUnit, Testcontainers with Oracle, REST Assured, Karma and Jasmine on the front-end.
- Demo: the front-end with a recorded API (no free Oracle hosting), the full stack with `docker compose up`.

### 3. `szafa-na-wymiar`: a wardrobe configurator for a carpentry workshop

- Why: a workshop quotes built-in wardrobes over the phone, then redraws every change by hand and counts boards on paper.
- What it does: the customer sets width, height, depth, sections, doors and finish and sees the wardrobe in 3D; the workshop gets a cut list optimized for standard 2800 x 2070 mm boards, the edge banding length and a quote as PDF.
- Architecture: Angular with OnPush components and lazy routes, Three.js with instanced meshes and a parametric model built from the same data as the cut list. The cut list optimizer (guillotine bin packing) runs in a Web Worker. Node.js quote API that renders the PDF.
- Libraries: `three`, `comlink` for the worker, `pdfkit`, `zod`.
- Senior signals: one source of truth for the 3D model and the cut list, a performance budget checked in CI (bundle size through repo 6, Lighthouse CI scores), frame time measured on a slow device profile, a fallback 2D view when WebGL is off.
- Tests: Jest for the geometry and the optimizer (property-based with `fast-check`), visual regression of the 3D scene from fixed cameras.
- Demo: the front-end on Vercel, the quote API on a free tier or mocked.

### 4. `obieg-faktur`: invoice approval after KSeF

- Why: since KSeF became mandatory, a small company gets every purchase invoice in one place, but still approves them by forwarding emails, and nobody knows who is holding which one.
- What it does: the finance person draws the approval path once (amount thresholds, cost centres, deputies during leave); every new invoice from KSeF follows that path; everyone sees what waits for them; the accountant gets an export.
- Architecture: Angular with NgRx, undo and redo through a meta-reducer, a diagram editor for the approval path. Node.js workflow engine that turns the drawn graph into a state machine, domain events, idempotent invoice intake. The KSeF test environment, or a recorded mock when the test environment is down.
- Diagram library: a GoJS licence or a free library (see Needs in `REBRAND.md`). GoJS without a licence shows an evaluation watermark.
- Senior signals: validation of the drawn graph (no dead ends, every path ends in approve or reject), versioned workflows so running invoices finish on the old version, an audit log.
- Tests: Jest for the engine and the graph validator, contract tests against the KSeF mock, Cypress for drawing a path and approving an invoice.

### 5. `rezerwacje`: bookings for many small salons on one platform

- Why: a hair salon, a physio and a beauty studio each lose clients to phone booking and no-shows, and none of them wants to run its own software.
- What it does: every business gets its own booking page, calendar, services and reminders; the platform runs them all from one deployment.
- Architecture: Nx monorepo with enforced module boundaries (apps: booking page, back office, API; libs per domain). Angular with SignalStore. Node.js REST API, PostgreSQL with row-level security per tenant. Feature flags with gradual rollout per tenant and a kill switch, built on OpenFeature.
- Senior signals: tenant isolation proved by tests, not by convention; flags that can be switched off without a deploy; affected-only CI builds.
- Tests: Jest, integration tests that try to read another tenant's data and must fail, Cypress for booking and cancelling.

### 6. `bundle-budget`: a Webpack plugin and GitHub Action

- Why: a web app gets a little slower with every release and nobody notices until a client complains.
- What it does: a Webpack plugin records the size of every route chunk; the GitHub Action compares it with the main branch and comments on the pull request with the change per route; the build fails when a budget is broken.
- Architecture: Node.js, JavaScript with TypeScript declaration files, the Webpack plugin API, the GitHub Actions toolkit. Published to npm with semver and a changelog. Repo 3 uses it.
- Tests: Jest with fixture projects built by real Webpack, snapshot tests of the comment.

### CV coverage

| Technology | Repos |
| --- | --- |
| Angular | 1, 2, 3, 4, 5 |
| TypeScript | all |
| JavaScript | 6 |
| NgRx | 2, 4 |
| SignalStore, Signals | 1, 5 (Signals also 3) |
| RxJS | 1, 2, 4 |
| REST API | 2, 3, 5 |
| Webpack | 6 |
| Git | all |
| Docker | 1, 2, 4, 5 |
| Jest | 1, 3, 4, 5, 6 |
| Karma | 2 |
| Cypress | 1, 4, 5 |
| GitHub Actions | all, and 6 is an Action |
| Node.js | 1, 3, 4, 5, 6 |
| Java, Quarkus, Oracle DB | 2 |
| Hexagonal architecture, DDD | 2, 4, 5 |
| Performance optimization | 3, 6 |
| Unit, integration and e2e tests | all |
| From past roles: WebSockets, Three.js and WebGL, diagrams, multi-tenant SaaS, Nx, feature flags, WCAG | 1, 3, 4, 5, all |

None of the domains touches power grids, so nothing overlaps with PSE Innowacje.

## Client sample websites

All six: high UI and UX, no business logic (no accounts, no payments, no back-end; forms are front-end only or go to an email service). Static sites, fast (Lighthouse Performance 90 and up on mobile), WCAG AA, Polish first. Each one gets its own typeface, palette and one signature element, so the six look like six different studios made them. The swatches in the prototype (`rebrand-explorations/b-na-miare/index.html`, section "Wzornik.") show the hero of each.

### Rozwaga, kancelaria radcy prawnego

- Who: a legal adviser working with companies, who wants a new client to trust them before the first call.
- Pages: home, practice areas (one page each: company law, contracts, litigation, real estate), people, articles, contact with map.
- Look: Bodoni Moda, black, white and seal red. Signature: a round seal that stamps in once on load; practice areas as a ruled list.
- UX: articles with reading time and a table of contents; a consultation form that asks only what a lawyer needs to call back.

### Rubryka, biuro rachunkowe

- Who: an accounting office that wants to win small businesses through its website, not only by referral.
- Pages: home, services, price packages, a KSeF guide, contact and quote form.
- Look: Bricolage Grotesque, squared paper, navy and orange. Signature: the "your month" card that ticks off KSeF invoices, VAT, social security and JPK.
- UX: packages compared in one table that stays readable on a phone; the quote form asks for the business type and invoice count and shows the matching package.

### Szkliwo, klinika stomatologiczna

- Who: a clinic whose patients compare prices and dentists before they call.
- Pages: home, treatments, price list, team, before and after, contact; booking through an external calendar link.
- Look: Outfit, white, coral, and a tooth shade guide from A1 to D2. Signature: the shade guide; a before and after slider that works with the keyboard.
- UX: the price list is searchable; every treatment page answers "does it hurt, how long, how much".

### Tafla, gabinet psychoterapii (was Przystań)

- Who: a therapist who works alone and needs one calm page.
- Page: one page with about, how I work, prices, first visit, contact.
- Look: Newsreader, sage and deep green, ripples on water. Signature: slow ripples that stop under reduced motion.
- UX: no stock photos, short paragraphs, the price and the length of a session visible without scrolling far; contact by a short message, not a phone call.

### Przędza, inwestycja mieszkaniowa

- Who: a developer selling one estate in a converted spinning mill, who wants buyers to find their flat on their own.
- Pages: home with the flat finder, flat page (plan, area, floor, status), location, gallery, sales office contact.
- Look: Unbounded, concrete, brick, and the sawtooth roof of the old mill. Signature: the building elevation where every window is a flat; filter by rooms and floor on static data.
- UX: the finder works as a list for keyboards and screen readers; every flat has its own address to share.

### Kminek, bistro (was Kluska)

- Who: a restaurant that also gets tourists and changes its menu every week.
- Pages: home, menu, events, about, booking through an external system, an English version.
- Look: Gloock, mustard, tomato and a white menu card. Signature: the menu card that tilts like paper on the table.
- UX: the menu is text, never an image or a PDF; opening hours and the address are on every page.

Alternatives if Adrian wants to swap one: fizjoterapia, medycyna estetyczna, pracownia architektury wnętrz, firma remontowa, pensjonat, warsztat samochodowy, szkoła językowa.

### Names checked on 2026-10-02

Before building, every name was searched together with its trade and Wrocław. Two collided with real businesses and were renamed: Przystań (Ośrodek Psychoterapii Przystań runs three offices in Wrocław) became Tafla, and Kluska (Bistro Kluska, Racławicka 3/5) became Kminek. Rozwaga, Rubryka, Szkliwo and Przędza showed no business of the same trade in Wrocław (a dental practice called Szkliwo exists in Zbąszyń, outside the rule). The three new names, Trzask, Próg and Przęsło, are clear as well.

### The three that follow the first six

Adrian asked for a partial shop, a real estate agency and a hotel with booking and extras, and on 2026-10-02 left the scope to me. These three get front-end state (a cart, favourites, a booking) on top of the rules above; there is still no back end, no account and no payment.

- Trzask, palarnia kawy ze sklepem. A small roastery that sells beans online: catalogue with filters, product pages, cart, a checkout that ends with "no order was placed", a subscription page. Signature: packaging labels generated from each coffee's data and the roast curve with the first crack marked.
- Próg, biuro nieruchomości. Three agents, sale and rent: listings with filters kept in the URL, a drawn district map, offer pages with a floor plan, a mortgage calculator and a viewing slot picker, favourites, a valuation request. Signature: a facade drawn for each listing from its data, shown like listing sheets in the agency window.
- Przęsło, hotel. A 24-room boutique hotel by the Oder, Polish and English: availability and nightly prices on a calendar, two rates, extras, guest details with a NIP check for invoices, a summary, a confirmation with an `.ics` file, managing the stored booking, packages and a gift voucher. Signature: the reception key board, where a free room hangs its key on a hook.

### How they are built and where they live

One Astro project in `sites/` builds all nine, each in its own folders, with no JavaScript unless a page needs it (Preact islands only in the last three). They are served from the portfolio at `/portfolio-v2/wzornik/<slug>/`, deployed by the same Pages workflow, so no new repositories or accounts are needed. There is no photography: every picture is drawn in SVG or CSS, and no stock or generated photos are used. Every page carries a footer note that the business is made up; e-mail addresses use the reserved `.example` domain and phone numbers an unassignable `+48 71 000 00 0N` pattern; there are no reviews or testimonials anywhere.
