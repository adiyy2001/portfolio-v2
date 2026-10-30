# Verify: scan-mails

Branch: feature/wcag-scanner (dirty tree on purpose, nothing committed). Files: workers/scan/views.js (new), workers/scan/index.js, workers/scan/index.test.mjs. Local preview: render.mjs writes site/pages and site/mails, served on 9300, check.mjs makes shots and axe runs.

## Gates
| Check | Result |
| node --test workers/scan/index.test.mjs | 37 pass, 0 fail (31 original untouched, 6 new) |
| npx eslint . | clean |
| npx prettier --check workers/scan | clean |
| Comments and dashes in code | none (grep for the two dash characters is empty) |
| axe, WCAG 2.0/2.1/2.2 A and AA tags | 0 violations on 6 pages and 4 mails, light and dark (shots/verify/axe.json) |
| axe, all rules including best practice | 0 (mails wrapped in role=main) |
| External requests while rendering | 0 |
| Horizontal scroll at 1440 and 390 | none (shots/build/shots.json) |
| Lighthouse (pages confirmed, confirmInvalid) | perf 100, a11y 100, bp 96-100, seo 50 (noindex by design), CLS 0 (shots/verify/lh) |
| Host route /skaner/ | untouched, axe 0 (shots/read/axe.json) |

## Jury (independent, from screenshots)
| Round | Design | Usability | Creativity | Content | Total | D5 | World fit | Verdict |
| build | 7.2 | 7.8 | 7.6 | 7.3 | 7.47 | 8 | 8.2 | FIX (partly stale shots, 8 fixes applied) |
| final | 7.7 | 8.4 | 7.8 | 8.0 | 7.96 | 8.5 | 8.4 | PASS |
Content check: zero problems (no commercial content in confirm and report mails, disclaimer verbatim, 24 h and 30 days, gender neutral, all states have text). After the final round: shipped the four small fixes (footer under the card at all widths, mailto link in page footer, stub caption spacing at 390, dotted loose seam in forced colors).

## Shots
shots/read (host, before), shots/build (pages light 1440 and 390, mails light and dark 1440 and 390, motion frames), shots/craft (forced colors, focus), shots/verify (axe, lh).
