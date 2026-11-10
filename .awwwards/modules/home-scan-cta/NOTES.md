# home-scan-cta

Brief: R7 from the site analytics report of 31.10.2026. The free accessibility scan as the second button in the home first screen (PL and EN), an H1 that names the service, a shorter home page. Mode auto (night run, owner away).

## World
Same world as `.awwwards/modules/skaner/WORLD.md` (tokens in src/styles/global.css :root, framer-motion, Hero, Magnet, .btn, .btn--line, hand notes in --hand). Floors on the host route before the change: axe 0 violations, 14 targets under 24 px on /, 16 on /en/ (footer and tags), first screen at 390 x 844 did not show the quote button.

## Decisions
| Decision | Reason |
|---|---|
| H1 "Strony i aplikacje dla firm." / "Websites and apps for businesses." | names the service, two lines at 1440; the old tagline moves nowhere, the kicker becomes "Freelancer, Wrocław i zdalnie" |
| Buttons: Magnet .btn "Wyceń projekt" plus .btn--line "Sprawdź dostępność za darmo" (data-cta hero-scan) | reuses the two existing button styles; the line button is secondary to the quote |
| Hand note under the scan button ("raport w kilkanaście minut" / "the report is in Polish") | the one detail of the module, from the site's hand note family ("to ja"); EN note is the honest caveat because /skaner/ is Polish only |
| CTA row moved above the second lead paragraph, link "Zobacz projekt dla krawca" dropped | gets both buttons into the 390 first screen; the TailorCloth case is two sections below |
| Steps ("Jak to szyjemy.") removed from both home pages | repeats lead2 (quote, launch, maintenance) and the per service steps on every /uslugi/ page |
| Scene kept | the front and back scroll scene is the home page's motion piece; its overlap with the lead is one sentence. Owner decision whether to cut it too (it is the tallest section) |

## Open questions
- With the consent banner open on a first visit at 390 x 844 the banner covers the scan button (button bottom 646 px, banner from about 574 px). Both buttons are visible once the choice is made.
