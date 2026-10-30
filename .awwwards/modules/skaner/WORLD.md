# World

## Stack and engine
Gatsby 5, React 18, plain CSS files in src/styles (global.css plus one file per area, scan.css for the scanner). One animation engine: framer-motion (m, useReducedMotion) through Split (word reveal on view), Reveal (opacity and y 24 on view), Skew (spring skew on scroll velocity). Hero entrance and small things are CSS keyframes (rise, hang, stamp) with --ease. Lenis for smooth scroll. scan.css already holds the only scroll driven CSS timelines on the site (@supports animation-timeline, 5 uses), a mechanic no other page uses.

## Tokens
Source: src/styles/global.css :root and src/motion.js.
Colour (hex): --wool #5a1424 (page), --wool-deep #3b0d18, --chalk #e9eff6 (text, form sheet), --chalk-dim #c3cedd, --chalk-blue #9dbbe0 (rulers, labels), --paper #cbd3da (paper sections and tickets), --ink #14181f, --ink-soft #2f3743, --thread #8e1226 (the one accent, red thread).
Type: --display Bespoke Serif (700 titles, 500 leads and labels), --text Schibsted Grotesk, --hand Bradley Hand or Mynerve (handwritten notes only). Title sizes in vw with line-height 0.86 and tracking -0.025em.
Spacing: --pad clamp(16px, 4.4vw, 72px), 12 columns (4 under 900px), section padding clamp(72px, 9vw, 140px).
Radius: near zero (2 to 4px), cut paper edges with tooth-up and tooth-down zigzag, dashed stitch borders, grain overlay.
Shadows: 0 1px 0 rgba(0,0,0,.35) plus a long soft drop (0 22px 30px -18px).
Motion: --ease cubic-bezier(.2,.8,.2,1), --spring linear() overshoot, motion.js ease.out/swap/draw, durations reveal .85, words .9, thread 1.5, stitch .4, springs skew/magnet/tilt/pin.

## Reusable components
| Component | Path | Use in this module |
| Hero (title Split + Skew, ruler, lead) | src/components/hero.js | scanner hero as is |
| Split, Reveal | src/components/split.js, reveal.js | section titles and list items |
| .btn--wool with stitched ::after | global.css, scan.css | send button |
| .paper section with teeth, .who block, .sec-head | global.css | check, manual, law sections |
| .card hanging tag (hang keyframes) | global.css | kind of object the ticket already is |
| Footer, header | src/components | untouched |
| ScanTicket, ScanForm, ScanFit, ScanSeam, ScanProvider | src/components/scan-*.js | module parts, may be cut |

## Host route and neighbours
Route /skaner/ (src/pages/skaner.js), no header entry (header carries rekrutera/klienta, Poradnik, PL/EN), footer link "Skaner dostępności" plus "Regulamin skanera". Neighbours: /uslugi/dostepnosc-wcag/ (its CTA "Zrób darmowy skan" leads here, services.js) and /regulamin-skanera/. Page is PL only (no EN twin).

## Voice sample
From the host page and its neighbour:
- "Wpisz adres strony, a po kilkunastu minutach dostaniesz mailem raport z barierami dostępności."
- "Uczciwie: automat znajduje tylko część barier, reszta wymaga sprawdzenia ręcznego."
- (WCAG page) "Dostępność na każdą figurę." and "Robiłem to w interfejsach pełnych diagramów i tabel."
Register: second person, short sentences, plain, sometimes dry humour from tailor words (Miara, Przymiarki, Oddanie, Poprawki, "Szyte dla"), titles end with a full stop.

## Facts the site already claims
Only these: free scan, up to 10 subpages, desktop and phone view, WCAG 2.1 and 2.2, report in Polish with fix examples, report by email, confirmation link needed before the scan starts, report in a dozen or so minutes (kilkanaście), report link valid 30 days, automat finds only a part of barriers, tests by axe-core, 9 check categories as listed in skaner.js, 6 manual-only areas, the act of 26 April 2024 (Dz.U. 2024 poz. 731) with art. 4 pkt 1 and the date 28 June 2025, full audit from the /uslugi/dostepnosc-wcag/ page, admin Adrian Turbiński Software, Wrocław, contact@adrianturbinski.pl. Consent and legal texts come only from src/scanner/consent.json.

## Floors (measured on /skaner/ before the change, build of the starting state, port 9000)
| Lighthouse mobile | Lighthouse desktop | LCP | CLS | TBT | axe violations |
| perf 95, a11y 100, bp 100, seo 100 | perf 100, a11y 100, bp 100, seo 100 | mobile 2178 ms, desktop 503 ms | 0 | mobile 201 ms, desktop 0 | 0 (under24px 0, 4 landmarks) |
Transfer 740 KB. Shots: shots/read (skaner and the WCAG neighbour at 1440 and 390). Previous designer shots: /tmp/skaner2-*.png.

## Site idea and system
No design-website run, no DESIGN.md. Site idea (from the code and copy): the whole site is a tailor's atelier: wool cloth page, chalk, red thread, paper patterns with cut teeth, rulers, hanging tags, stitched buttons, "Szyte dla", wordmark with needle. Mechanic family: paper objects that hang and settle (spring, hang keyframes), thread and stitch drawing, ruler ticks, word reveal up from a mask.
