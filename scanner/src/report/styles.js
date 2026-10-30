const dataSvg = svg => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

const HAND_STITCH_ACROSS = dataSvg(
  "<svg xmlns='http://www.w3.org/2000/svg' width='120' height='10' viewBox='0 0 120 10'><path d='M3 6.3h15M26 3.7h10M44 5.9h17M69 3.4h9M86 6.5h14M107 4.2h10' fill='none' stroke='#5a1424' stroke-width='2' stroke-linecap='round'/></svg>",
);

const HAND_STITCH_DOWN = dataSvg(
  "<svg xmlns='http://www.w3.org/2000/svg' width='10' height='120' viewBox='0 0 10 120'><path d='M6.3 3v15M3.7 26v10M5.9 44v17M3.4 69v9M6.5 86v14M4.2 107v10' fill='none' stroke='#5a1424' stroke-width='2' stroke-linecap='round'/></svg>",
);

const GRAIN = dataSvg(
  "<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 .3'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
);

const CROSS_STITCH = dataSvg(
  "<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><path d='M2 2l8 8M10 2l-8 8' fill='none' stroke='#5a1424' stroke-width='2' stroke-linecap='round'/></svg>",
);

export const REPORT_CSS = `
:root {
  --wool: #5a1424;
  --wool-deep: #3b0d18;
  --chalk: #e9eff6;
  --chalk-dim: #c3cedd;
  --chalk-blue: #9dbbe0;
  --paper: #cbd3da;
  --ink: #14181f;
  --ink-soft: #2f3743;
  --thread: #8e1226;
  --stock: #f5f8fb;
  --print-stock: #f6f3ee;
  --patch: #d1e0f2;
  --twill-light: repeating-linear-gradient(45deg, rgba(233, 239, 246, 0.05) 0 1px, transparent 1px 4px);
  --serif: Georgia, "Iowan Old Style", Charter, "Bitstream Charter", Cambria, "Times New Roman", serif;
  --sans: "Segoe UI", "Helvetica Neue", Roboto, Arial, "Liberation Sans", system-ui, sans-serif;
  --hand: "Mynerve", "Segoe Script", "Bradley Hand", "Lucida Handwriting", cursive;
  --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  --twill: repeating-linear-gradient(45deg, rgba(90, 20, 36, 0.06) 0 2px, transparent 2px 6px);
  --wool-cloth: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.035) 0 1px, transparent 1px 4px),
    repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.09) 0 1px, transparent 1px 4px);
  --tooth-up: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='8'%3E%3Cpath d='M0 8 8 0 16 8z' fill='%23cbd3da'/%3E%3C/svg%3E");
  --pink-top: conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg);
  --pink-bottom: conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg);
  color-scheme: light;
}
* { box-sizing: border-box; }
html { background: var(--chalk); color: var(--ink); -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  font-family: var(--sans);
  font-size: 1rem;
  line-height: 1.6;
  background: var(--chalk);
  color: var(--ink);
  overflow-wrap: anywhere;
}
.skip {
  position: absolute;
  left: 0.5rem;
  top: -4rem;
  padding: 0.6rem 1rem;
  background: var(--chalk);
  color: var(--wool-deep);
  font-weight: 600;
  z-index: 2;
}
.skip:focus { top: 0.5rem; }
.wrap { max-width: 62rem; margin: 0 auto; padding: 0 1.25rem; }
a { color: var(--wool); text-decoration: underline; text-underline-offset: 0.15em; }
a:focus-visible, .skip:focus-visible { outline: 3px solid var(--ink); outline-offset: 2px; }
.masthead a:focus-visible, .site-footer a:focus-visible { outline-color: var(--chalk); }

h1, h2, h3, h4 { font-family: var(--serif); line-height: 1.15; font-weight: 700; }
h1 { margin: 0.2rem 0 0.9rem; font-size: clamp(1.9rem, 8.5vw, 2.8rem); letter-spacing: -0.015em; color: var(--ink); }
h1.host-mid { font-size: clamp(1.5rem, 6.4vw, 2rem); }
h1.host-long { font-size: clamp(1.2rem, 5vw, 1.5rem); }
h2 { margin: 0 0 1.1rem; font-size: clamp(1.7rem, 4.6vw, 2.5rem); letter-spacing: -0.012em; color: var(--wool); }
h3 { margin: 1.75rem 0 0.6rem; font-size: 1.3rem; }
h4, .entry h3 { margin: 0 0 0.4rem; font-size: 1.12rem; }

.masthead {
  position: relative;
  background: var(--wool-cloth), var(--wool);
  color: var(--chalk);
  padding: 1.1rem 0 0.5rem;
}
.bar { display: flex; justify-content: space-between; align-items: baseline; }
.wordmark { font-family: var(--serif); font-size: 1.5rem; font-weight: 700; letter-spacing: -0.01em; text-decoration: none; }
.masthead a { color: var(--chalk); }
.fitting { display: grid; grid-template-columns: minmax(0, 1fr); gap: 2.25rem; padding-top: 3.2rem; padding-bottom: 2rem; }

.tag {
  --stub: 7.5rem;
  position: relative;
  align-self: start;
  width: min(calc(100% - 22px), 26rem);
  justify-self: start;
  color: var(--ink);
  transform: rotate(-0.8deg);
  transform-origin: 50% -2.7rem;
  filter: drop-shadow(0 1px 0 rgba(0, 0, 0, 0.35)) drop-shadow(0 22px 20px rgba(0, 0, 0, 0.4));
}
.tag-string { position: absolute; top: -2.7rem; left: 50%; width: 4.5rem; height: 4.5rem; margin-left: -2.25rem; z-index: 1; }
.tag-body {
  position: relative;
  padding: 2.4rem 1.6rem 1.9rem;
  background-color: var(--paper);
  background-image: ${GRAIN};
  background-size: 220px 220px;
  -webkit-mask: var(--pink-bottom) 50% / 18px 100%;
  mask: var(--pink-bottom) 50% / 18px 100%;
}
.tag-body::after {
  content: "";
  position: absolute;
  inset: 7px 7px 11px;
  border: 1px dashed rgba(142, 18, 38, 0.8);
  pointer-events: none;
}
.eyebrow {
  margin: 0 0 0.3rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--wool-deep);
}
.card-no { margin: 0; font-family: var(--serif); font-size: 1.05rem; font-style: italic; color: var(--ink-soft); }
.card-no strong {
  font-family: var(--mono);
  font-style: normal;
  font-size: 0.9rem;
  letter-spacing: 0.04em;
  color: var(--ink);
}
.meta { margin: 0; }
.meta > div { display: grid; gap: 0.05rem; padding: 0.5rem 0 0.35rem; border-bottom: 1px dotted rgba(47, 55, 67, 0.55); }
.meta dt {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-soft);
}
.meta dd { margin: 0; font-size: 0.95rem; line-height: 1.4; }
@media (min-width: 24rem) {
  .meta > div { grid-template-columns: 7.9rem minmax(0, 1fr); column-gap: 0.6rem; align-items: baseline; }
}
.stub {
  position: relative;
  height: var(--stub);
  margin: 0.15rem 0.3rem 0 0.2rem;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  grid-template-rows: 1fr auto;
  align-items: center;
  column-gap: 1rem;
  padding: 1.25rem 1.5rem 1rem;
  background: var(--twill-light), var(--ink-soft);
  color: var(--chalk);
  transform: translate(5px, 6px) rotate(0.9deg);
  transform-origin: 0 0;
  -webkit-mask: var(--pink-top) 50% / 18px 100%;
  mask: var(--pink-top) 50% / 18px 100%;
}
.stub::after {
  content: "";
  position: absolute;
  inset: 12px 6px 6px;
  border: 1px dashed rgba(233, 239, 246, 0.5);
  pointer-events: none;
}
.stub-count {
  grid-row: 1 / 3;
  font-family: var(--serif);
  font-size: 5.6rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.03em;
  text-shadow: 0 0 1px rgba(233, 239, 246, 0.9), 2px 1px 0 rgba(233, 239, 246, 0.2);
}
.stub-cap { align-self: end; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; line-height: 1.3; }
.stub-hand { align-self: start; margin-top: 0.3rem; font-family: var(--hand); font-size: 1.15rem; line-height: 1.2; color: var(--chalk-blue); transform: rotate(-2deg); transform-origin: left center; }
.stub-count, .stub-cap, .stub-hand { min-width: 0; }
@media (max-width: 30rem) {
  .tag { --stub: 6.6rem; }
  .tag-body { padding: 2.2rem 1.1rem 1.6rem; }
  .stub { padding: 1.1rem 1.1rem 0.8rem; }
  .stub-count { font-size: 4.6rem; }
  .fitting { padding-top: 2.7rem; gap: 1.75rem; }
}

.found { color: var(--chalk); align-self: start; padding-top: 0.4rem; }
.found .lead { color: var(--chalk); font-size: clamp(1.45rem, 3.8vw, 2.4rem); margin: 0 0 1.5rem; }
.found .measure { margin-bottom: 2.25rem; }
.scope { color: var(--chalk); padding: 1.1rem 0 0.25rem; border-top: 1px dashed rgba(233, 239, 246, 0.45); }
.masthead h2 { color: var(--chalk); font-size: clamp(1.2rem, 3vw, 1.45rem); margin: 0 0 0.6rem; }
.scope-list { margin: 0 0 1rem; padding: 0; list-style: none; }
.scope-list li { padding: 0.3rem 0; border-bottom: 1px dashed rgba(233, 239, 246, 0.3); font-size: 0.875rem; }
.scope .note { margin: 0.5rem 0; font-size: 0.9375rem; color: var(--chalk); }
@media (min-width: 52rem) {
  .fitting { grid-template-columns: minmax(0, 26rem) minmax(0, 1fr); gap: 4rem; }
  .tag { justify-self: start; }
  .found { padding: 0.4rem 0 0.3rem; }
  .found .lead { max-width: 40rem; }
}

.hand-note {
  display: inline-block;
  margin: 0 0 0.75rem;
  font-family: var(--hand);
  font-size: 1.3rem;
  line-height: 1.25;
  color: var(--wool);
  font-weight: 400;
  transform: rotate(-2.5deg);
  transform-origin: left center;
}

.toc {
  position: relative;
  background: var(--paper);
  padding: 0.55rem 0 0.4rem;
  box-shadow: 0 12px 18px -16px rgba(20, 24, 31, 0.6);
}
.toc::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 100%;
  height: 8px;
  background: var(--tooth-up) repeat-x 0 0 / 16px 8px;
}
.toc ol { margin: 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; gap: 0 1.5rem; counter-reset: toc; }
.toc li { counter-increment: toc; }
.toc a { display: inline-block; padding: 0.45rem 0; }
.toc a::before {
  content: counter(toc, decimal-leading-zero);
  content: counter(toc, decimal-leading-zero) / "";
  margin-right: 0.4rem;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  color: var(--ink-soft);
  text-decoration: none;
  display: inline-block;
}

main { padding: 0.5rem 0 3.5rem; }
main section { position: relative; padding: 3.75rem 0 1rem; }
main section::before {
  content: "";
  position: absolute;
  top: 1.4rem;
  left: 0;
  right: 0;
  height: 2px;
  background:
    repeating-linear-gradient(90deg, var(--wool) 0 7px, transparent 7px 12px) left top / 100% 2px no-repeat;
}
main section:first-of-type { padding-top: 2.25rem; }
main section:first-of-type::before { display: none; }
p { margin: 0.6rem 0; max-width: 46rem; }
.lead, h2 { text-wrap: balance; }
.lead { font-family: var(--serif); font-size: clamp(1.3rem, 3.4vw, 1.8rem); line-height: 1.3; margin: 0 0 1rem; max-width: 40rem; }
.small { font-size: 0.9375rem; color: var(--ink-soft); }
.measured { font-weight: 700; color: var(--ink); }

.measure { margin: 0 0 2rem; }
.tape-key { display: flex; flex-wrap: wrap; gap: 0.3rem 1.25rem; margin: 0.6rem 0 0; padding: 0; list-style: none; font-size: 0.8125rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
.tape-key li { display: flex; align-items: center; gap: 0.45rem; }
.tape-key li::before { content: ""; width: 1.1rem; height: 0.7rem; background: var(--chalk); border: 1px solid var(--chalk); }
.tape-key .key-critical::before { background: var(--thread); }
.tape-key .key-serious::before { background: var(--ink-soft); }
.tape-key .key-moderate::before { background: var(--twill), var(--chalk); }
.tape-key .key-minor::before { background: var(--stock); border-style: dashed; }
.tape {
  position: relative;
  margin: 0;
  padding: 16px 0 16px 1.4rem;
  background:
    repeating-linear-gradient(90deg, rgba(20, 24, 31, 0.65) 0 1px, transparent 1px 8px) left top / 100% 6px no-repeat,
    repeating-linear-gradient(90deg, rgba(20, 24, 31, 0.85) 0 1px, transparent 1px 40px) left top / 100% 12px no-repeat,
    var(--paper);
  box-shadow: inset 0 0 0 1px rgba(47, 55, 67, 0.35), 0 10px 18px -14px rgba(20, 24, 31, 0.6);
}
.tape::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 1.1rem;
  background: var(--ink);
}
.tape-body { display: flex; gap: 3px; height: 2.7rem; }
.seg {
  flex: 1 1 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  font-weight: 800;
  font-size: 1.05rem;
}
.seg-critical { background: var(--thread); color: var(--chalk); }
.seg-serious { background: var(--ink-soft); color: var(--chalk); }
.seg-moderate { background: var(--twill), var(--chalk); color: var(--ink); border: 1px solid var(--ink); }
.seg-minor { background: var(--stock); color: var(--ink); border: 1px dashed var(--ink); }

table { width: 100%; border-collapse: collapse; table-layout: fixed; margin: 0.75rem 0 1.25rem; }
caption {
  text-align: left;
  font-family: var(--serif);
  font-size: 1.05rem;
  font-weight: 700;
  padding: 0.25rem 0 0.4rem;
}
th, td { text-align: left; vertical-align: top; padding: 0.5rem 0.6rem; border-bottom: 1px dotted var(--ink-soft); }
thead th {
  background: var(--chalk-dim);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-top: 2px solid var(--wool);
  border-bottom: 1px solid var(--wool);
}
.num { text-align: right; width: 6.5rem; font-variant-numeric: tabular-nums; font-weight: 700; }
.table-scroll { overflow-x: auto; }
.table-scroll:focus-visible { outline: 3px solid var(--ink); outline-offset: 2px; }
@media (max-width: 36rem) {
  .table-scroll table { min-width: 20rem; }
  .entry { padding-left: 1.1rem; }
}
th { overflow-wrap: normal; word-break: normal; hyphens: none; }
@media (max-width: 30rem) {
  .num { width: 5.4rem; }
  thead th { letter-spacing: 0.04em; padding-left: 0.4rem; padding-right: 0.4rem; }
}

.weights { border-collapse: separate; border-spacing: 0; margin-top: 0.5rem; background: var(--stock); box-shadow: 0 14px 24px -20px rgba(20, 24, 31, 0.6); }
.weights caption { color: var(--ink); }
.weights th, .weights td { border-bottom: 1px dotted var(--ink-soft); padding: 0.7rem 1rem; vertical-align: middle; }
.weights tbody tr:last-child th, .weights tbody tr:last-child td { border-bottom: 0; }
.weights th[scope="row"] { font-size: 1.05rem; color: var(--ink); }
.weights td.num { font-family: var(--serif); font-size: 2rem; font-weight: 700; line-height: 1; color: var(--wool); }
.row-label { display: block; font-family: var(--serif); }
.chalk { display: block; margin-top: 0.3rem; color: var(--wool); }
.chalk svg { display: block; max-width: 100%; height: auto; transform-origin: left top; }

.badge {
  display: inline-block;
  padding: 0.05rem 0.6rem;
  border: 1px solid var(--ink);
  font-family: var(--sans);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  line-height: 1.6;
  vertical-align: 0.15em;
  background: var(--paper);
  color: var(--ink);
}
.badge-critical { background: var(--wool); color: var(--chalk); border-color: var(--wool); }
.badge-serious { background: var(--ink); color: var(--chalk); border-color: var(--ink); }
.badge-moderate { background: var(--chalk); border-style: dashed; }

.card {
  position: relative;
  background: var(--stock);
  margin: 2.5rem 0;
  padding: 2.25rem 1.5rem 1.25rem;
  box-shadow: 0 1px 0 rgba(20, 24, 31, 0.1), 0 18px 30px -20px rgba(20, 24, 31, 0.55);
}
.card::before {
  content: "";
  position: absolute;
  inset: 0.45rem;
  border: 1.5px dashed rgba(90, 20, 36, 0.75);
  pointer-events: none;
}
.card h3 { margin-top: 0; font-size: clamp(1.3rem, 3vw, 1.65rem); }
.card-kicker {
  position: absolute;
  top: -0.8rem;
  left: 1.5rem;
  margin: 0;
  padding: 0.15rem 0.85rem;
  background: var(--wool);
  color: var(--chalk);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.facts { margin: 0.5rem 0 1rem; padding: 0; list-style: none; }
.facts li { margin: 0.25rem 0; }
.facts strong { color: var(--wool); font-size: 0.8125rem; letter-spacing: 0.06em; text-transform: uppercase; }

.swatch { position: relative; margin: 1.25rem 0 1.5rem; display: flow-root; filter: drop-shadow(0 5px 6px rgba(20, 24, 31, 0.3)); }
.swatch-cloth {
  position: relative;
  display: inline-block;
  max-width: 100%;
  padding: 1.35rem 1.1rem;
  background: var(--twill), var(--paper);
  -webkit-mask: var(--pink-top) 50% / 18px 100%, var(--pink-bottom) 50% / 18px 100%;
  -webkit-mask-composite: source-in;
  mask: var(--pink-top) 50% / 18px 100%, var(--pink-bottom) 50% / 18px 100%;
  mask-composite: intersect;
}
.swatch img { display: block; max-width: 100%; height: auto; border: 1px solid var(--ink); background: #fff; position: relative; }
figcaption {
  position: relative;
  margin-top: 0.6rem;
  font-size: 0.875rem;
  color: var(--ink-soft);
  padding-left: 1.5rem;
}
figcaption::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.5em;
  width: 1rem;
  height: 0;
  border-top: 2px dashed var(--wool);
}

pre {
  margin: 0.4rem 0 1rem;
  padding: 0.75rem 1rem;
  background: var(--stock);
  color: var(--ink);
  border: 1px solid var(--ink-soft);
  white-space: pre-wrap;
  overflow-wrap: break-word;
  font-family: var(--mono);
  font-size: 0.875rem;
  line-height: 1.5;
}
code { font-family: var(--mono); font-size: 0.9em; }
.fix { display: grid; gap: 1.5rem; grid-template-columns: minmax(0, 1fr); margin: 1.25rem 0; filter: drop-shadow(0 5px 6px rgba(20, 24, 31, 0.25)); }
.piece {
  position: relative;
  padding: 1.35rem 1rem 1.1rem;
  -webkit-mask: var(--pink-top) 50% / 18px 100%, var(--pink-bottom) 50% / 18px 100%;
  -webkit-mask-composite: source-in;
  mask: var(--pink-top) 50% / 18px 100%, var(--pink-bottom) 50% / 18px 100%;
  mask-composite: intersect;
}
.piece-before { background: var(--twill), var(--paper); }
.piece-after { background: var(--twill), var(--patch); }
.piece p { position: relative; margin: 0 0 0.2rem; font-family: var(--serif); font-size: 1.05rem; font-weight: 700; color: var(--wool-deep); }
.piece pre { position: relative; margin-bottom: 0.25rem; }
@media (min-width: 48rem) { .fix { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); } }

.entry { position: relative; margin: 1.5rem 0 2.25rem; padding-left: 1.4rem; }
.sub { margin: 1.1rem 0 0.2rem; font-family: var(--serif); font-size: 1.05rem; font-weight: 700; }
.entry-split .table-scroll { margin-top: 0; }
@media (min-width: 62rem) {
  .entry-split { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 0 2.25rem; padding-left: 0; }
  .entry.entry-split::before { display: none; }
  .entry-head { position: sticky; top: 1rem; align-self: start; padding-left: 1.4rem; }
  .entry-split .entry-head::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.2rem;
    bottom: 0.2rem;
    width: 3px;
    background: repeating-linear-gradient(180deg, var(--thread) 0 8px, transparent 8px 13px);
  }
}
.entry::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.2rem;
  bottom: 0.2rem;
  width: 3px;
  background: repeating-linear-gradient(180deg, var(--thread) 0 8px, transparent 8px 13px);
}
.group-title {
  margin: 2.5rem 0 1rem;
  padding: 0.6rem 1rem;
  background: var(--chalk-dim);
  font-size: 1.2rem;
}
.group-title .small { display: block; font-family: var(--sans); font-weight: 400; }
@media (min-width: 40rem) {
  .group-title {
    padding-right: 2.25rem;
    clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%);
  }
}
ul.plain { margin: 0.5rem 0 1rem; padding-left: 1.25rem; max-width: 46rem; }
ul.examples { max-width: none; }
.examples { list-style: none; padding-left: 0; }
.examples li { margin-bottom: 0.9rem; padding-top: 0.6rem; border-top: 1px dotted var(--ink-soft); }

.sewn {
  margin: 2.75rem 0 0.5rem;
  padding: 3.25rem 1.25rem 1.5rem;
  background:
    ${HAND_STITCH_ACROSS} repeat-x 0 0 / auto 10px,
    ${HAND_STITCH_ACROSS} repeat-x 0 100% / auto 10px,
    ${HAND_STITCH_DOWN} repeat-y 0 0 / 10px auto,
    ${HAND_STITCH_DOWN} repeat-y 100% 0 / 10px auto,
    var(--stock);
}
main section.sewn::before { display: none; }
.sewn > .hand-note { position: absolute; top: 1.5rem; right: 1.5rem; margin: 0; max-width: 11rem; text-align: right; transform-origin: right center; }
.sewn h2 { max-width: calc(100% - 9rem); }
.sewn ul.plain { list-style: none; padding-left: 0; }
.sewn ul.plain li { position: relative; padding-left: 1.75rem; margin: 0.45rem 0; }
.sewn ul.plain li.neutral::before { background: none; height: 0; border-bottom: 2px solid var(--ink-soft); top: 0.8em; width: 0.6rem; }
.sewn ul.plain li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.45em;
  width: 0.85rem;
  height: 0.85rem;
  background: ${CROSS_STITCH} no-repeat center / contain;
}
@media (min-width: 40rem) {
  .sewn { padding: 3.5rem 2rem 1.75rem; }
}
@media (max-width: 39.99rem) {
  .sewn > .hand-note { position: static; max-width: none; text-align: left; margin-bottom: 0.4rem; transform-origin: left center; }
  .sewn h2 { max-width: none; }
}

.disclaimer { position: relative; background: var(--stock); padding: 1.25rem 1.5rem; margin-top: 1.5rem; border-left: 4px solid var(--wool); box-shadow: 0 14px 26px -20px rgba(20, 24, 31, 0.5); }
.disclaimer h3 { margin-top: 0; }
.disclaimer p { position: relative; }

.site-footer { position: relative; background: var(--wool-cloth), var(--wool); color: var(--chalk); padding: 2.5rem 0 2rem; }
.site-footer::before {
  content: "";
  position: absolute;
  top: 0.9rem;
  left: 0;
  right: 0;
  height: 2px;
  background: repeating-linear-gradient(90deg, var(--chalk) 0 8px, transparent 8px 14px);
  opacity: 0.8;
}
.site-footer a { color: var(--chalk); }
.site-footer p { margin: 0.35rem 0; }
.site-footer strong { font-family: var(--serif); font-size: 1.2rem; }

@media (prefers-reduced-motion: no-preference) {
  .tag { animation: settle 1.3s var(--ease) both; }
  .seg { animation: lay 0.55s var(--ease) both; }
  .seg:nth-child(2) { animation-delay: 0.05s; }
  .seg:nth-child(3) { animation-delay: 0.1s; }
  .seg:nth-child(4) { animation-delay: 0.15s; }
}
@keyframes settle {
  from { transform: rotate(-3.6deg); }
  to { transform: rotate(-0.8deg); }
}
@keyframes lay {
  from { opacity: 0; transform: translateX(-14px); }
  to { opacity: 1; transform: none; }
}

@media (prefers-contrast: more) {
  .tag-body::after, .card::before { border-width: 2px; border-color: var(--ink); }
  .meta dd, .scope-list li, .examples li, th, td { border-bottom-color: currentColor; }
}
@media (forced-colors: active) {
  .tag-body, .card, .disclaimer, .sewn, .piece, .seg, .badge { border: 1px solid CanvasText; }
  .tag-body::after, .card::before { border-color: CanvasText; }
  .seg-critical { border: 4px double CanvasText; }
  .seg-serious { border: 2px solid CanvasText; }
  .seg-moderate { border: 2px dashed CanvasText; }
  .seg-minor { border: 2px dotted CanvasText; }
  .tape-key li::before { forced-color-adjust: none; background: Canvas; border-color: CanvasText; }
  .tag-body, .stub, .piece, .swatch-cloth { -webkit-mask: none; mask: none; }
  .stub { border: 1px solid CanvasText; }
}

@media print {
  @page { margin: 16mm; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; animation: none !important; }
  html, body { background: #fff; }
  body { font-size: 10.5pt; }
  .skip, .toc, .tag-string { display: none; }
  .masthead { background: #fff; color: var(--ink); border-bottom: 3px double var(--wool); padding-top: 0; }
  .masthead a, .masthead h2, .scope, .scope .note, .found, .found .lead { color: var(--ink); }
  .wordmark { display: none; }
  .fitting { padding-top: 0.5rem; }
  .scope-list li { border-bottom-color: var(--ink); }
  .tag { transform: none; filter: none; margin-top: 0.5rem; }
  .tag-body { background: var(--print-stock); -webkit-mask: none; mask: none; border: 2px solid var(--thread); border-bottom: 0; }
  .stub { background: #fff; color: var(--ink); transform: none; -webkit-mask: none; mask: none; border: 2px solid var(--thread); margin: 0; }
  .stub::after { border-color: var(--ink-soft); }
  .stub-count { text-shadow: none; }
  .stub-hand { color: var(--ink); }
  .entry-head { position: static; }
  .fitting { gap: 1.5rem; grid-template-columns: minmax(0, 26rem) minmax(0, 1fr); }
  .scope { border-top-color: var(--ink); }
  .tape { background: #fff; box-shadow: none; border: 1px solid var(--ink); }
  .tape-key { color: var(--ink); }
  .tape-key li::before { border-color: var(--ink); }
  .tape::before { background: var(--ink); }
  .seg-critical { background: #e8d3d7; color: var(--ink); border: 3px solid var(--wool); }
  .seg-serious { background: #d9d6d6; color: var(--ink); border: 2px solid var(--ink); }
  .weights { background: #fff; border: 1px solid var(--ink); box-shadow: none; }
  .weights td.num, .chalk { color: var(--ink); }
  .weights th, .weights td { border-bottom-color: var(--ink); }
  .badge-critical { background: #e8d3d7; color: var(--ink); border-color: var(--wool); }
  .badge-serious { background: #d9d6d6; color: var(--ink); border-color: var(--ink); }
  .card, .disclaimer { background: var(--print-stock); box-shadow: none; border: 1px solid var(--ink-soft); }
  .sewn { background: var(--print-stock); border: 1px dashed var(--wool); }
  .swatch, .fix { filter: none; }
  .swatch-cloth, .piece { -webkit-mask: none; mask: none; border: 1px solid var(--ink); }
  .piece-before { background: #fff; }
  .piece-after { background: var(--print-stock); }
  .site-footer { background: #fff; color: var(--ink); border-top: 3px double var(--wool); padding: 1.25rem 0 0; }
  .site-footer::before { display: none; }
  .site-footer a { color: var(--ink); }
  .group-title { clip-path: none; }
  .swatch, figure, tr, pre, .piece, .disclaimer, .tape, .weights, .tag { break-inside: avoid; }
  h2, h3, h4, caption { break-after: avoid; }
  main section { padding-top: 3rem; }
  a { text-decoration: underline; }
}
`;
