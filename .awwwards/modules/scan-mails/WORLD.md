# World

Module: transactional surfaces of the scanner worker (workers/scan/index.js): HTML pages GET /scan/confirm (confirmed, link invalid or expired), GET and POST /scan/unsubscribe (withdrawn, bad token), expired or unknown report (/r/<key> 410 and 404) and three mails (double opt-in, report ready, scan failed) with HTML and text parts. Host route of the site: /skaner/. Neighbours: /uslugi/dostepnosc-wcag/ and /regulamin-skanera/. Earlier runs of this world: .awwwards/modules/skaner (page) and .awwwards/modules/scan-report (report). No design-website run, no DESIGN.md.

## Stack and engine

Site: Gatsby, CSS in src/styles, framer-motion 13 for reveal and scroll, CSS transitions for details. The worker pages are served from a Cloudflare Worker as one HTML string: no JS, no engine, no external resources (fonts of the site are not reachable, so Georgia for display and system-ui for text, documented fallback of Bespoke Serif and Schibsted Grotesk, same as the report). Motion on these pages, if any, is CSS transform and opacity with the site ease cubic-bezier(0.2, 0.8, 0.2, 1) behind prefers-reduced-motion: no-preference. Mails have no motion.

## Tokens

Source: src/styles/global.css :root. wool #5a1424, wool-deep #3b0d18, chalk #e9eff6, chalk-dim #c3cedd, chalk-blue #9dbbe0, paper #cbd3da, ink #14181f, ink-soft #2f3743, thread #8e1226. Radius none (2px), edges cut or pinked, grain on wool. Type: display serif heavy (headline), text grotesk, hand script only decorative and aria-hidden. Ease [0.2,0.8,0.2,1], reveal 0.85 s.

## Reusable components (motifs, not code)

| Component | Source | Use here |
| tag / ticket: paper card, dashed thread-red stitch frame inset 7 px, pinked bottom edge, string with eyelet | scan.css .tag, report styles.js .tag, TAG_STRING svg | the card that holds each page and each mail |
| stub: ink-soft block with chalk count and dashed inner stitch | report .stub | count in the report mail, state block |
| seam: dashed stitch line | scan-seam.js | the one detail: the seam that closes or breaks |
| tape (ruler ticks) | scan.css .tape | not used (not needed in a transactional page) |

## Current state of the module (before)

Pages: infoPage() with one inline style on body: wool-deep background, chalk text, system-ui 18 px, h1 default size, one link. Mails: white page, system-ui, unstyled paragraphs, hr footer. Failure page of workers/quote (failPage): same plain dark page with mail and phone. Nothing of the tailor's shop reaches the visitor at the moment he clicks the confirmation link or opens the mail.

## Voice sample (host page and report)

"Wpisz adres strony, a po kilkunastu minutach dostaniesz mailem raport z barierami dostępności." / "Uczciwie: automat znajduje tylko część barier, reszta wymaga sprawdzenia ręcznego." / report: "Zmierzone, nie oszacowane." Register: second person singular, short sentences, honest limits, tailoring words used sparingly (miara, przymiarka, szew). Gender neutral wording for the reader (no past tense forms in masculine or feminine).

## Facts the surfaces may claim (only these)

From the worker and consent texts: confirmation link valid 24 hours, report link valid 30 days, report arrives within kilkunastu minut, scan of the given address, failure reasons (site unavailable, blocks automatic visits, too slow), try later, controller Adrian Turbiński Software Wrocław contact@adrianturbinski.pl, privacy policy URL, marketing consent can be withdrawn by link, the disclaimer from src/scanner/consent.json pl.disclaimer. No price, no offer, no commercial call to action, no score.

## Floors

Host route /skaner/ (served on 9000): axe 0 violations (shots/read/axe.json), Lighthouse floors from the skaner module: mobile perf 88 / a11y 100 / bp 100 / seo 100, desktop 100/100/100/100. This module does not touch the host route, so the floor is unchanged by construction. Worker pages are new surfaces: floor is axe 0 and Lighthouse a11y 100, bp 100, seo n/a (noindex).
Tests: node --test workers/scan/index.test.mjs (31 tests), eslint, prettier.
