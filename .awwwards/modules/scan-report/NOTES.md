# Notes

Working log of this module run. Every session reads this file and `state.json` first.

## Module

| Slug        | Host route                                             | Branch               | Mode |
| ----------- | ------------------------------------------------------ | -------------------- | ---- |
| scan-report | /skaner/ (report served from R2 as sample-report.html) | feature/wcag-scanner | auto |

The working tree was dirty on purpose, so the run stayed on `feature/wcag-scanner` and created no `design/` branch. Nothing is committed, pushed or deployed.

## Decisions

| Phase | Decision                                                                                    | Reason                                                                                                           | By   |
| ----- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---- |
| idea  | A. Karta przymiarki: card on a string, torn stub with the count in chalk, one severity tape | Candidate with the highest ceiling in the critic table and the closest to the site's wool, chalk and paper world | auto |
| build | Cool site tones, amber dropped                                                              | Amber is not a site token; severity is carried by thread red and ink                                             | auto |
| build | Cream `#f6f3ee` only in print                                                               | Keeps print readable without a new screen colour                                                                 | auto |
| build | Fonts are fallbacks (Georgia, Charter, system sans, system script for the hand notes)       | The report has CSP with no external fonts; this is not a new font                                                | auto |
| build | Wordmark link added, "Klient" row removed from the card                                     | The sender is named once, the client host is the h1                                                              | auto |
| craft | Scope list moved into the hero right column                                                 | Balances the card and removes the dead band                                                                      | auto |
| craft | Seam of a long list entry runs only along the head                                          | The empty left column no longer reads as a hole                                                                  | auto |
| craft | Passed keyboard checks get a neutral stitch, open ones the red cross                        | A pass looked like an error                                                                                      | auto |
| craft | Impersonal register kept, two tailoring phrases added to lead sentences                     | Untouchable sections and legal text stay as they were                                                            | auto |

## New tokens or components (why nothing existing fits)

| Added                                    | Why                                                                         | Where                 |
| ---------------------------------------- | --------------------------------------------------------------------------- | --------------------- |
| `--stock` #f5f8fb                        | Card surface cooler than paper so cards separate from the chalk page        | styles.js             |
| `--patch` #d1e0f2                        | Light cloth for the After swatch                                            | styles.js             |
| `--print-stock` #f6f3ee                  | Warm card colour for print only                                             | styles.js print block |
| `--twill-light`, `--tooth-up`, GRAIN svg | Site twill and tooth edge, reused as inline data for the card, stub and toc | styles.js             |
| Torn stub, nail string, severity tape    | The signature moment; no site component shows a counted quantity            | index.js, styles.js   |

## Overrides of the avoid list

| Item                       | Why the idea needs it                                                   | Where            |
| -------------------------- | ----------------------------------------------------------------------- | ---------------- |
| Tilted card and hand notes | The card hangs on a string and settles; hand notes are the site's voice | .tag, .hand-note |
| Cream surface              | Print only                                                              | print block      |

## Jury scores

| Phase         | Design | Usability | Creativity | Content | Total | World fit | Verdict |
| ------------- | ------ | --------- | ---------- | ------- | ----- | --------- | ------- |
| build         | n/a    | n/a       | n/a        | n/a     | 7.0   | n/a       | FIX     |
| craft round 1 | n/a    | n/a       | n/a        | n/a     | 7.04  | 7.2       | FIX     |
| craft round 2 | 7.25   | 8.0       | 7.5        | 7.33    | 7.53  | 7.9       | FIX     |
| craft round 3 | 7.67   | 8.1       | 7.5        | 7.5     | 7.75  | 7.9       | FIX     |
| craft final   | 7.67   | 8.1       | 7.5        | 7.67    | 7.76  | 8.1       | PASS    |

D5 (idea in form): 8.0 in round 2, 8.5 in round 3.

## Needs from owner

None blocking.

## Open questions (auto mode answers them here with the assumption taken)

- The count 11 / 3 / 8 appears four times on screen (stub, lead, tape, table). Assumed fine because the lead sentence is required by tests and the stub is aria-hidden. Owner may drop the table column or the lead.
- Voice: the report speaks in an impersonal register, the site speaks to "ty". Assumed impersonal because the report is forwarded and printed. Owner may switch.
- Full list on wide screens leaves the left half empty under short descriptions. Owner may want the pages table moved under the description.
- Mynerve is not available under the report CSP, so hand notes use a system script font. Owner may allow a data URI font, at about 20 KB.
