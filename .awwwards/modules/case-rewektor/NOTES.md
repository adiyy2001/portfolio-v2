# Notes

Working log of this module run. Every session reads this file and `state.json` first.

## Module
| Slug | Host route | Branch | Mode | Goal | Level |

## Decisions
| Phase | Decision | Reason | By |

## New tokens or components (why nothing existing fits)
| Added | Why | Where |

## Passes
| Pass (structure, objects, stage) | What changed | Shots | Stage signals | Owner reaction |

## World extensions (materials, planes, light the next module may reuse)
| Added | Built from which tokens | Where |

## Overrides of the avoid list
| Item | Why the idea needs it | Where |

## Jury scores
| Phase | Design | Usability | Creativity | Content | Total | World fit | Verdict |

## Needs from owner

## Open questions (auto mode answers them here with the assumption taken)

## 09.11 run (auto, owner order of 9.11)
| Phase | Decision | Reason | By |
| idea | A Wykrój: pattern sheet tablist, chalk frames on panel and page shots, thread between | critic table in MODULE.md, owner order to pick the recommended idea | auto |
| content | copy from client README facts only; no prices, no reviews | README "Nie wolno zgadywać" | auto |
| build | Motion only, no GSAP (REBRAND.md); GSAP is named only as part of his site's stack | world rule | auto |
| entry | PL Work index gets a ReWektor row; archive lead says two real deployments; EN untouched (no EN page) | page is public, no consent restriction | auto |
New tokens/components: pattern.css (pat-*), no new global tokens; reused Reveal, Split, Seo, Close, proj__* classes.
Baseline: gates-before = psipawer gates-before (/archive/, /archive/tailorcloth/ rewritten to /archive/rewektor/). sitemap-covers-routes fails locally in both (sitemap carries the production host), detail order aligned.
Gates 09.11: PASS. Lighthouse /archive/rewektor/ mobile 100/100/96/100, desktop 100/100/96/100; axe clean; stage 5/6. Lint ok; repo has no tests or typecheck.

## Passes 09-10.11
| Pass | What changed | Jury |
| build 1 | full page, sheet in its own row | 7.48 FIX (hero empty right half, grey shots, caption crossed, team section thin, small tag) |
| build 2 | shots into first viewport beside text and sheet, lighter dimming, bigger tag, team merged into Co w środku; reviewer fixes (tokens, facts) | 7.47 FIX (phone: frame change off screen, thread start, flat shots) |
| build 3 | phone scrolls shots into view on tab change, thread from the active field, paper frame on shots, red thread with chalk halo | 7.9 PASS, world fit 8.6 |
Gotcha: incremental gatsby build kept HTML pointing at the old CSS bundle; use `gatsby clean` before a build that only changes CSS.
Owner-level leftovers from jury (optional): tablist under the fold at 1440, panel shot small on phone.
