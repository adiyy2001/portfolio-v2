# Notes

## Module
| Slug | Host route | Branch | Mode |
| scan-mails | /skaner/ (worker pages and mails of the scanner) | feature/wcag-scanner (dirty tree on purpose, no new branch) | auto |

## Decisions
| Phase | Decision | Reason | By |
| idea | A: Szew zamknięty, szew przerwany | one detail that fits the site thread language, B needs new facts and backend, C is a second mechanic and overclaims | auto |
| build | templates moved to workers/scan/views.js | index.js stays logic only, tests keep importing the worker | auto |
| build | wool #5a1424 page background, wool-deep only for button and text | match the host and the report, test expects #3b0d18 and #e9eff6 in the page | auto |
| build | added styled 410 and 404 for /r/<key> and a distinct unsubscribe error page | these are pages the visitor really sees, previously plain text or wrong copy for unsubscribe | auto |
| build | unsubscribe link in the mail html reads "Wycofaj zgodę na wiadomości marketingowe"; text part unchanged | descriptive link text | auto |

## New tokens or components (why nothing existing fits)
| Added | Why | Where |
| none new tokens; tag, stitch frame, string and pinked edge are the report's own, seam is the site's stitch | pages are standalone strings without the site's CSS, so the motifs are restated inline | workers/scan/views.js |
| HTML mail layout (tables, inline, dark media query) | mail clients, no equivalent in the site | workers/scan/views.js |

## Overrides of the avoid list
| none |

## Jury scores
| Phase | Design | Usability | Creativity | Content | Total | World fit | Verdict |
| build | 7.2 | 7.8 | 7.6 | 7.3 | 7.47 | 8.2 | FIX |
| final | 7.7 | 8.4 | 7.8 | 8.0 | 7.96 | 8.4 | PASS |

## Needs from owner
Nothing blocking. For the owner: send the three mails to a real Gmail, Apple Mail and Outlook inbox once before the first live scan (browser previews only so far).

## Open questions (auto mode answers them here with the assumption taken)
- Display fonts: pages and mails use Georgia and system sans because site fonts are unreachable (documented fallback, same as the report).
- Unsubscribe GET still withdraws consent immediately (existing behaviour kept, test covers it).
- The workers/quote failPage was read as part of the world but not changed (outside the allowed files).
