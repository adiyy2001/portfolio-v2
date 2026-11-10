# home-conversion

Brief: raise CTA clicks and finished quote forms on the home pages (PL and EN). Mode auto, goal lead, level standard, ambition bold. Starts from 55757fa (site-funnel-r7: H1 names the service, scan button in the hero, Steps removed), which was never merged.

## World

Same world as `.awwwards/modules/skaner/WORLD.md` and `home-scan-cta/NOTES.md`: tokens in `src/styles/global.css :root`, framer-motion, reused `Hero`, `Magnet`, `.btn`, `.cta`, `.link`, `Quote`.

## Baseline, GA4 28 days to 2026-11-10

| Metric | Value |
| --- | --- |
| sessions | 55, mobile 39 (71%) |
| landing on `/` | 31 |
| `cta_click` | 2 |
| `form_start` | 7 |
| `form_error` | 2 |
| `generate_lead` | 1 |
| home height at 390 | 14 495 px, form starts near 12 900 px |

The sample is too small to compare variants. Decisions below rest on the page itself and on the practices in `design-website/reference/cookbook/conversion.md` (CNV-07 lean form, CNV-08 code behind a link, CNV-19 sticky CTA) and `persuasion.md` (GRY-14 small first step).

## Decisions

| Decision | Reason |
| --- | --- |
| Order: hero, prices, TailorCloth, Ask, Scene, Fit, Wzornik, guides, form | a visitor sees what it costs and one real project in the first screens; the scroll scene and the sample gallery come after |
| New `Ask` section after the case (`data-cta="mid-quote"`, phone link) | the only quote button between the hero and the form was the phone dock, hidden until the consent choice |
| Form order: service, contact, then optional message and budget | the one required field comes second, optional fields are marked |
| Code field behind "Mam kod" | CNV-08, a visible code field sends people looking for a code |
| Consent banner tighter under 900 px | it covered the second hero button on a first visit |

## Open questions

- Reviews: still waiting for clients; the first places are next to the TailorCloth case and in the closing section.
- NIP 8952236530 is confirmed in the MF VAT register; showing it in the footer is the owner's call.
