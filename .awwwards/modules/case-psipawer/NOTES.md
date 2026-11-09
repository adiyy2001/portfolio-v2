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

## Stan 09.11.2026, przerwa na prośbę właściciela
- Zrobione: read (WORLD.md, shots/read, stage report), goal (portfolio, standard, ambition stage, MODULES.md, gates-before), idea (3 kandydaci w MODULE.md, krytyk: A Przeróbka 72, B 67, C 42). Zrzuty nowej strony z adresu roboczego w shots/after.
- Zablokowane na: wybór pomysłu przez właściciela (rekomendacja A z poprawkami krytyka).
- Decyzje: Motion zamiast GSAP (REBRAND.md zakazuje GSAP); field trip z creative-field-2026-11.md bez nowego crawla; trasa /archive/psi-pawer/ i /en/archive/psi-pawer/.
- Otwarte: zgoda Asi na nazwę i zrzuty; pomiar po przepięciu domeny (psipawer.pl 09.11 nadal stara strona, siteRevision 1007); LCP mobile po gorszy (5,63 s vs 2,48 s) idzie jako fastryga.
- Wznowienie: cd ~/root/side_projects/pf-case-psipawer && /design-module --resume --slug=case-psipawer. Serwer: npx gatsby build, potem npx gatsby serve -H 127.0.0.1 -p 9311 (yarn brak w PATH, node z nvm 24).
- Drugi moduł (ReWektor) jeszcze nie zaczęty: slug case-rewektor.

## Decyzja właściciela 09.11 (wznowienie 23:10)
- Pomysł A „Przeróbka” z poprawkami krytyka, tryb auto do końca, bez pytań.
- Po PASS: kod, bramki, recenzent, merge do main, push, sprawdzenie produkcji, gsa push.
- Brak zgody Asi: strona idzie z noindex, poza sitemapą, bez linków z nawigacji i archiwum. Nazwa firmy i imię zostają w treści? Decyzja: treść mówi „behawiorystka psów z Wrocławia”, nazwa Psi Pawer i zrzuty są na stronie, ale strona jest niewidoczna dla wyszukiwarek i nielinkowana, dokładnie jak w poleceniu.

## 09.11 23:xx resume
- Owner decision 9.11: idea A "Przeróbka" with critic fixes, Motion instead of GSAP (REBRAND.md bans GSAP).
- No consent from Asia for her name and screenshots: page ships with noindex, out of the sitemap, no links from nav or the archive. Do not gsa push it. Lift all three once she agrees.
- Mobile LCP after is worse (2,48 to 5,63 s), shown as basting, cause unknown.
- Rail scroll region removed (axe scrollable-region-focusable), now wraps. Verify done, see VERIFY.md.
