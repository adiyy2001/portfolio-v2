# WORLD: adrianturbinski.pl, case study ReWektor

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
New route `/archive/rewektor/` (+ `/en/archive/rewektor/`). Neighbours: `/archive/` (Work index, lists TailorCloth as the only real project) and `/archive/tailorcloth/` (case page: hero with shot, "Co w środku." spec, step flow, paper "Kto to szył.", close).
Entry: Work index `work__pick` row gets a second real project.

## Voice sample
"Na miarę, dosłownie." / "Zamówienie krok po kroku." / "Kto to szył." Short, dry, tailoring puns, full stop after headings, no hype.

## Facts the site claims
Freelance developer from Wrocław; tailoring language; TailorCloth as real project.

## Host state
stage.mjs /archive/tailorcloth/: 1440 PASS 4/6 (overlaps 0, stack 5, type 9), 390 PASS 5/6. Console errors 3-4 per route already (host debt, check source in gate).

## Data for the module (Psi Pawer)
- Client: ReWektor, Wiktor Belica, family carpentry firm from Wrocław (Radwanice). Makes furniture to measure, restores old ones. IG "meble z charakterem".
- Site live https://rewektor.com.pl/ (title "Meble na wymiar i odnawianie mebli, Wrocław | ReWektor", index follow). Hosting home.pl on the client's account, PHP and MySQL, SSL to 24.05.2027. Panel /panel/.
- Process: brief, three directions (Ściana, Rejestr, Plakat), client chose Rejestr on 04.11.2026. Idea "Metryczka": every piece shown with what it was before ("Było", "Jest", "Co zrobiliśmy"). Wood only procedural SVG, GSAP animations on his site, Switzer font self hosted, photos WebP in three sizes, SEO script (canonical, OG, JSON-LD @graph, sitemap with images, llms.txt).
- CMS: client adds a piece by filling the same fields as on the page (Nazwa, Było, Jest, Co zrobiliśmy, Zdjęcia, first is main), "Zdejmij ze strony", "Zapisz zmiany". First on a Cloudflare Worker (D1 + KV), then ported to PHP and MySQL on home.pl (06.11). Photo cap 500 MB in code.
- Home shows "Na wystawie: 7 mebli". First piece: "Stolik z maszyny": Było maszyna do szycia, Jest stolik, Drewniany blat na żeliwnej podstawie maszyny.
- Consent: Wiktor's site is public; no explicit consent recorded for the portfolio, but the owner ordered the case public; only public facts used.
- Screenshots: ~/root/clients/rewektor/dokumentacja/zrzuty/ (strona-glowna, strona-glowna-cala, telefon, mebel, panel-edycja, panel-lista, kierunek-*).
