# MODULE: case study Psi Pawer, przeróbka

Goal portfolio, level standard, ambition stage. Metric: case study read to the end and clicks into the Close form (enquiry); secondary, click to the live site.
Needed entries: read-next (TailorCloth case), JSON-LD Article/CreativeWork node in the page @graph, Close form (existing). Every number comes from ~/root/clients/psiPawer/harmony/spec/case-study/ files; no dynamic block without a source.
Field trip: reused `$W/reference/creative-field-2026-11.md` (measured 04.11, 5 days old, 20 winners); no new crawl, logged in NOTES.

## Candidate ideas

### A. Przeróbka (the alteration), recommended
The site was not sewn from scratch; the old garment was taken in and recut. The page is an alteration job.
- Hero object: the seam. The old home page (screenshot) and the new one stacked in one frame; a vertical stitched seam with a needle as handle divides them. On entry the thread is drawn down the seam (motion draw), then the visitor drags the needle (pointer, arrow keys as a slider) to move the cut. Pinking teeth on both cloth edges (world material). Phone version: horizontal seam, drag up and down.
- Objects from data: "Kwit przeróbki" (alteration ticket) with chalk marks: each measured metric is a tape measure strip whose length is the value, old in chalk dashes, new in thread; "zwężone" (taken in) where it shrank: TBT 1380 to 170 ms, weight 3.34 to 2.14 MB. Items that did not improve or wait for the domain are basting stitches (fastryga, temporary, dashed thread with a pin): LCP mobile, measurement on the real domain. Honest by construction.
- SEO: sewn-in labels (metki), old and new title tags on two clothing labels, the new one stitched on top.
- Pages: before and after pairs of the service pages as fabric swatches on a hanger rail you scroll sideways.
- World test: Bespoke Serif headlines, wool/chalk/paper, hand notes in Mynerve, threads and teeth already exist, Motion springs (pin, stage, tilt).

### B. Miarka (tape measure)
One long tape measure runs down the left edge of the page and is pulled out as you scroll; each metric is a mark on the tape at its value, before in chalk and after in thread; screenshots hang pinned to the tape at the section they belong to. Object: the tape. Risk: a scroll-tied tape is one gimmick for the whole page, before/after is not touchable.

### C. Przymierzalnia (fitting room)
A three-panel fitting room mirror: desktop, phone and the PSI score as three angled mirror panes; old site in a dull, tarnished mirror, new in clean glass; the panes rotate in 3D perspective on hover. Object: the mirror. Risk: perspective mirrors around screenshots read as a device mockup; little room for honest mixed numbers.

## Idea critic (sonnet, 09.11)
| Idea | Total /90 | Verdict |
|---|---|---|
| A Przeróbka | 72 | recommended after fixes |
| B Miarka | 67 | reserve |
| C Przymierzalnia | 42 | rejected (device mockup, hover only, new material) |

Fixes for A: one mechanism, the seam runs down the whole page as a spine dividing old and new; ticket, tape strips and labels are one "Kwit przeróbki" cut by that seam; hanger rail optional on native scroll-snap. The cut follows the pinking teeth, not a straight line; needle is role=slider with arrows and aria-valuetext; reduced motion and no JS show both shots side by side. First frame a static AVIF poster, drag loads lazily; LCP 5.63 s and the domain go in as basting.
