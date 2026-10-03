# Sample work briefs

Status on 2026-10-03: the nine client sample websites are built and live under `/portfolio-v2/wzornik/`. The GitHub repos follow Adrian's own briefs, kept outside this repo, and are being built (see "GitHub repos"). On 2026-10-02 everything here was design only ("tylko zaprojektuj, do tego nie pisz kodu na razie") and the main site came first. Status and decisions live in `REBRAND.md`; this file holds the briefs of the sample websites.

Shared rules:

- Facts rule: the businesses are made up and every README and page says so. No invented clients, users, testimonials or metrics about Adrian. Mock data inside a demo (prices, invoice counts) is fine, because it is shown as a demo.
- GitHub repos: built from Adrian's briefs in `~/root/side_projects/briefs/`, which set their own rules, each in `~/root/side_projects/<repo>` with local git only; Adrian creates the GitHub repos and pushes them. No code comments, no em or en dashes (his global rules).
- Before anything is published, check that the made-up names do not belong to a real business in the same trade in Wrocław.

## GitHub repos

On 2026-10-02 Adrian replaced the six recruiter concepts that stood here with full briefs for six repos: `flagwire`, `signal-timeline`, `gridtwin`, `fieldline`, `coschema` and `eventhorizon`. The briefs are the spec and stay outside this repo, in `~/root/side_projects/briefs/`. The build started on 2026-10-03, after the sample websites went live. The old concepts are in this file's git history.

## Client sample websites

All six: high UI and UX, no business logic (no accounts, no payments, no back-end; forms are front-end only or go to an email service). Static sites, fast (Lighthouse Performance 90 and up on mobile), WCAG AA, Polish first. Each one gets its own typeface, palette and one signature element, so the six look like six different studios made them. The Wzornik on the client edition shows each one as a swatch and links the live site.

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

One Astro project in `sites/` builds all nine, each in its own folders, with no JavaScript unless a page needs it (Preact islands only in the last three). They are served from the portfolio at `/portfolio-v2/wzornik/<slug>/`, deployed by the same Pages workflow, so no new repositories or accounts are needed. There is no photography: every picture is drawn in SVG or CSS, and no stock or generated photos are used. Every page carries a footer note that the business is made up; e-mail addresses use the reserved `.example` domain and phone numbers an unassignable `+48 71 000 00 0N` pattern; there are no reviews or testimonials anywhere. All nine are built and live since 2026-10-03; their pages are `noindex`, so the made-up businesses stay out of search results, and the Wzornik index at `/portfolio-v2/wzornik/` links them.
