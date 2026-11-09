# MODULE: case study ReWektor, wykrój

Goal portfolio, level standard, ambition stage. Metric: case read to the end, click into Close (enquiry); secondary, click to rewektor.com.pl.
Entry: second real project on the PL Work index (/archive/), plain link row under TailorCloth. Read next: TailorCloth case. Every fact from ~/root/clients/.claude/clients/rewektor/README.md and dokumentacja/zrzuty.
Field trip: reused $W/reference/creative-field-2026-11.md (as case-psipawer), no new crawl.

## Candidate ideas

### A. Wykrój (one pattern, two garments), recommended
A tailor cuts two pieces from one paper pattern. The client panel and the public page are cut from the same pattern: the same four fields.
- Hero object: the pattern sheet. A paper pattern piece (SVG, dashed seam allowance, notches, grain line arrow) with four notched fields Nazwa, Było, Jest, Co zrobiliśmy. Below it two cut pieces: the page screenshot and the panel screenshot. Choosing a field (tablist, keys) moves a chalk frame on both shots to the same field and draws a thread between them (pathLength). Answers "what did you build" in one gesture.
- Trzy kroje: the three directions (Ściana, Rejestr, Plakat) as pattern pieces pinned on paper; Rejestr cut out with pinking teeth and stamp "wybrany 4.11", the other two stay dashed, set aside.
- Metryczka: the Stolik z maszyny as a garment care label: Było maszyna do szycia, Jest stolik. The tailor's machine ended up as a carpenter's table; dry pun in the heading.
- Co w środku: spec as a measurement list (hosting, panel, photos, SEO, wood in SVG).
- Telefon, Kto to szył, read next, Close.

### B. Kalka (tracing paper)
Panel screenshot on translucent tracing paper slides over the page on scroll until fields align. Strong but one-trick; scroll-jacked, weak on phone, and it hides both shots half the time.

### C. Rejestr szwalni (work order book)
Page as the workshop's order book, a ledger of what was delivered each day. Faithful to the Rejestr direction, but it copies the client's look instead of the host world; weak world fit.

## Critic
| Idea | World fit | Hero object | Depth from data | Phone | Risk |
| A | 8 tailoring pattern, notches, chalk, thread | field switcher with thread, real interaction | 4 fields, 3 directions, label, spec | tabs wrap, shots stack | thread geometry across two shots; compute from rects |
| B | 6 | scroll overlay | low | poor | scroll-jacking, a11y |
| C | 5 | ledger | medium | ok | copies client look |
Fixes for A: thread from measured DOM rects, not hardcoded; shots cropped so all four fields are visible in both; keyboard tablist with arrows; reduced motion shows frames without drawing; no GSAP (world bans it), Motion only; keep the client's wood out of the host palette except inside the label.
Pick: A (owner order 9.11: full auto, pick the recommended idea).
