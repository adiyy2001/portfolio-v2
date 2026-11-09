# WORLD: adrianturbinski.pl, case study Psi Pawer

## Stack and engine
Gatsby 5, React 18. Engine: `framer-motion` (imported as `m`, LazyMotion) plus `lenis` smooth scroll. REBRAND.md Constraints: "motion as the single animation engine ... No GSAP, no Three.js". The owner asked for GSAP in the brief; the world wins, Motion is used.

## Tokens (source `src/styles/global.css`, motion `src/motion.js`)
- Colour: --wool #5a1424 (page), --wool-deep #3b0d18, --chalk #e9eff6 (text), --chalk-dim, --chalk-blue #9dbbe0 (focus), --paper #cbd3da (light sections), --ink #14181f, --thread #8e1226.
- Type: --display Bespoke Serif 500/700, --text Schibsted Grotesk, --hand Mynerve (hand notes).
- Layout: --pad clamp(16px, 4.4vw, 72px), 12 cols (4 under 900 px), `.cloth` chalk grid lines.
- Motion: --ease cubic-bezier(.2,.8,.2,1), --spring linear(); motion.js ease.out/swap/draw, duration.reveal .85, thread 1.5, stitch .4; spring tilt/fan/stage/pin.
- Materials: grain noise, pinking shear teeth (--tooth-up/down, conic mask on `.case__swatch`), threaded logo, ruler under hero titles.

## Reusable components
Hero (size, aside), Close (contact form close), Split (word reveal), Reveal, Shot, Seo, `.sec-head` + `.h2`, `.paper` section, `.tag`, `.link`, `.hand-note`, `.spec` dl, `.cross--back`, `tie()` from i18n, `routes` map.

## Host route and neighbours
New route `/archive/psi-pawer/` (+ `/en/archive/psi-pawer/`). Neighbours: `/archive/` (Work index, lists TailorCloth as the only real project) and `/archive/tailorcloth/` (case page: hero with shot, "Co w środku." spec, step flow, paper "Kto to szył.", close).
Entry: Work index `work__pick` row gets a second real project.

## Voice sample
"Na miarę, dosłownie." / "Zamówienie krok po kroku." / "Kto to szył." Short, dry, tailoring puns, full stop after headings, no hype.

## Facts the site claims
Freelance developer from Wrocław; tailoring language; TailorCloth as real project.

## Host state
stage.mjs /archive/tailorcloth/: 1440 PASS 4/6 (overlaps 0, stack 5, type 9), 390 PASS 5/6. Console errors 3-4 per route already (host debt, check source in gate).

## Data for the module (Psi Pawer)
- Client: Joanna Kostrzanowska, behaviourist, Wrocław. Naming needs Asia's OK (memory, not yet given).
- Before: www.psipawer.pl, Lighthouse 13.6 local, 04.11, median of 3: Home mobile Perf 66, TBT 1380 ms, LCP 2.48 s, 3 336 935 B, 270 requests; SEO 100, A11y 97.
- After: working address psipawer.wixsite.com/psi-pawer (domain not switched as of 09.11, live psipawer.pl still old, siteRevision 1007): Home mobile Perf 70, TBT 170 ms, LCP 5.63 s, 2140 KB, 282 req; SEO 100, A11y 96. PSI mobile rev 198: Home 83 vs old 62-79; TBT 125 vs 432-1017 ms.
- Screenshots before: ~/root/clients/psiPawer/case-study/przed-2026-11-02/ (22 pages desktop+telefon). After: to take from the working address.
