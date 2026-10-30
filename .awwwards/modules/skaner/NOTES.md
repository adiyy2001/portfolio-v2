# Notes

Working log of this module run. Every session reads this file and `state.json` first.

## Module
| Slug | Host route | Branch | Mode |
| skaner | /skaner/ | feature/wcag-scanner (dirty tree on purpose, no design/ branch, per owner) | auto |

Not committed, not pushed, not deployed. Dev port 9000 (serve.mjs on public). Ports 9100 and 9200 untouched.

## Decisions
| Phase | Decision | Reason | By |
| read | stay on feature/wcag-scanner | owner instruction, tree dirty on purpose | owner |
| idea | chose C "szew maszynowy, szew ręczny" over A (previous Przymiarka) and B (wykrój) | critic 67 vs 41 and 46, one idea one moment, stamp promised acceptance before confirmation | agent |
| idea | cut ticket, tape, pattern board, thread joining steps, hand note with arrow, five CSS scroll timelines | fail world test or compete with the moment | agent |
| content | step names Miara, Przymiarka, Oddanie borrowed from the WCAG page | same voice as neighbour, no new claim | agent |
| content | seam hand note "dalej tylko ręcznie" without "w audycie" | content checker: could suggest the free report includes manual checks | agent |
| build | step 3 says "Raport jest dostępny 30 dni od skanu." | regulamin counts 30 days from the scan | agent |
| build | hero got a real CTA to #skan | form was below the fold at 390x844 | agent |
| build | needle taken from the wordmark (src/wordmark.js) | the site's own object, not a new icon | agent |
| craft | editor cuts applied: steps no longer first on phone, code lines hidden on phone, two sec-head side leads, sew animation on the sent line | cut list | agent |
| craft | editor cut kept out: the h3 "Jak to działa." | names the step list next to the form | agent |
| craft | needle always rendered, hidden by CSS under reduced motion | conditional render caused a hydration error | agent |
| craft | hero card monospace reuses the blog code stack | no new font | agent |

## New tokens or components (why nothing existing fits)
| Added | Why | Where |
| ScanSeam rebuilt on framer-motion useScroll | replaces CSS scroll timelines (second mechanic); same engine as Skew | src/components/scan-seam.js |
| Needle component | one needle used in hero and seam, path comes from the wordmark | src/components/scan-needle.js |
| machine stitch (repeating gradient) and hand stitch (SVG mask tile) CSS | no existing stitch row; site has only 1px dashed borders | src/styles/scan.css |
No new colour, font, easing or engine. --hand font already in :root.

## Overrides of the avoid list
| Item | Why the idea needs it | Where |
| none | | |

## Jury scores
| Phase | Design | Usability | Creativity | Content | Total | World fit | Verdict |
| build r2 | 7.4 | 7.5 | 7.5 | 7.3 | 7.44 | 8.2 | FIX |
| craft r3 | 7.25 | 7.3 | 7.13 | 7.33 | 7.25 | 8.4 | FIX (seam larger, law CTA moved) |
| craft final | 7.58 | 7.5 | 7.63 | 7.33 | 7.54 | 8.4 | PASS |

## Needs from owner
See VERIFY.md.

## Open questions (auto mode answers them here with the assumption taken)
- Removed: order ticket, tape measure, pattern board. Assumption: the owner wants one idea over five. They are recoverable from the untracked history only through /tmp/skaner2-*.png and this log, since nothing was committed. (If the owner wants the pattern board back as a static figure, it is a separate decision.)
- Stale Gatsby cache made returning visitors (localStorage consent set) crash hydration in this worktree until `yarn clean`; a fresh worktree build with the same sources is clean. Not a code bug.
