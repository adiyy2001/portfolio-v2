# Verify: /skaner/

Branch feature/wcag-scanner (dirty tree on purpose). Nothing committed, pushed or deployed. Static build served on port 9000.

## Gates
| Check | Result |
| Jury craft (final round, 15 curated shots) | total 7.54, Design 7.6, Usability 7.5, Creativity 7.6, Content 7.3, D5 8, no hard fail, PASS |
| World fit (round 3) | average 8.4 (9, 8, 8, 9, 8), PASS |
| Earlier rounds | build round 2: 7.44 (FIX); craft round A: 7.02 and 7.25 with partial or ambiguous shots (the juror misread the seam shot order and flagged facts that are in WORLD.md); fixed by renaming shots early/late, the seam made larger, law CTA under the text |
| axe /skaner/ | 0 violations, 0 targets under 24px, 1 h1, 4 landmarks |
| axe /uslugi/dostepnosc-wcag/ (neighbour) | 0 violations |
| axe /regulamin-skanera/ | 0 violations |
| Console errors | 0 at 1440 and 390, also with reduced motion (hydration error fixed by always rendering the needle and hiding it in CSS) |
| Horizontal scroll | none at 1440, 390 and 720x450 at 2x (200 percent zoom) |
| Keyboard | tab order: skip link, nav, hero CTA, URL, e-mail, terms, regulamin link, marketing, submit; every stop has a 2px or 3px outline |
| No JS | content and the form render |
| Forced colors | seam and rows readable in CanvasText |
| Reduced motion | final state, needle hidden, 0 console errors |
| Marketing checkbox default | unchecked at 1440 and 390; terms required; consent texts untouched |
| `npx eslint .` | exit 0 |
| `yarn clean && yarn build` | green (Done in 98.79s) |
| `node --test workers/scan/index.test.mjs` | 31 pass, 0 fail |
| scanner tests (mapping, report, robots, ssrf) | 89 pass, 0 fail |

## Lighthouse against the floor (WORLD.md)
| | Floor (quiet machine) | Now |
| Mobile | perf 95, a11y 100, bp 100, seo 100, LCP 2178, CLS 0, TBT 201 | perf 77 to 89 (several runs), a11y 100, bp 100, seo 100, LCP 2179 to 2202, CLS 0, TBT 391 to 950 |
| Desktop | perf 100, a11y 100, bp 100, seo 100, LCP 503, TBT 0 | perf 100 (95 once), a11y 100, bp 100, seo 100, LCP 503 to 523, CLS 0, TBT 0 to 178 |

The host machine had load average 15 to 27 from other runs during all of these measurements, so TBT and perf are inflated. Control in the same minute: the untouched /uslugi/dostepnosc-wcag/ scored mobile perf 86 (TBT 473), /skaner/ scored 89 (TBT 391). LCP, CLS, a11y, bp and seo equal the floor. The mobile perf floor of 95 was NOT reproduced; it needs a rerun on a quiet machine before merging.

## Motion
Quiet run earlier: about 0 percent dropped frames on scroll. Runs during this verify: 390 width 0.1 percent dropped; 1440 width 6 to 35 percent dropped, with load average 15 to 21 (not a valid reading). 36 animated elements (stitches), transform and opacity only, 0 layout transitions. Rerun on a quiet machine.

## Before and after
| | Before | After |
| 1440 | shots/read/skaner-1440-full.png | shots/craft2/skaner-1440-full.png |
| 390 | shots/read/skaner-390-full.png | shots/craft2/skaner-390-full.png |
Details: shots/craft2/s-*.png (hero, form, checks, seam early and late, manual, law), shots/craft2/st-*.png (error, filled, sent states), shots/craft2/reduced/, shots/verify/a11y-*.png.

## Files changed by this run
src/pages/skaner.js, src/styles/scan.css, src/components/scan-form.js (tape and context removed, consent logic untouched), scan-seam.js, scan-needle.js, scan-sample.js. Removed (untracked, no git history): scan-ticket.js, scan-fit.js, scan-context.js.

## Needs from owner
1. Merge or not (the whole scanner tree is still untracked).
2. The previous Przymiarka pieces (order ticket with stamp, tape under the address field, pattern board) are deleted and recoverable only from /tmp/skaner2-*.png. Want the board back as a static figure?
3. The hero card "Przykład wpisu z raportu" is an illustrative entry in the real report format (from scanner/sample-report.html). Confirm it may stay.
4. Rerun Lighthouse mobile and motion on a quiet machine before merge.
5. Jury notes for later: the right half beside the form and the law text is empty at 1440; "Co sprawdzam" and the manual list share one dashed-list grammar; at 390 the card is below the fold; the consent block is a long wall of text (wording is fixed by consent.json, so only styling could change).
6. Site-wide, not from this page: the cookie banner covers part of the first screen on a first visit; the hero reveal at load.
