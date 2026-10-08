export const styles = `
:root{color-scheme:light;--ground:#eef2f6;--card:#fff;--left:#dce3eb;--right:#c3ceda;--ink:#15202b;--soft:#4e5d6c;--sun:#f2a100;--sun-t:#965e00;--sun-tint:#fceac7;--bat:#2e9f5b;--bat-t:#1f7a43;--bat-tint:#d5ecde;--home:#3a6fd8;--home-tint:#d8e2f7;--grid:#6b7c8f;--grid-t:#5f6f82;--panel:#2a3f5a;--slab:0 4px 0 var(--right),0 14px 28px rgba(21,32,43,.06);--skip-bg:#15202b;--skip-fg:#fff;--gut:clamp(16px,4vw,48px);--sans:'Archivo','Arial Narrow',Arial,system-ui,sans-serif}
body.pd{background:var(--ground);color:var(--ink);font:400 17px/1.6 var(--sans)}
.pd :where(h1,h2,h3,p,figure,dl,dd,ul,ol,table){margin:0}
.pd :where(ul,ol){padding:0;list-style:none}
.pd a{color:var(--ink);text-underline-offset:4px;text-decoration-thickness:2px}
.pd a:focus-visible,.pd button:focus-visible,.pd input:focus-visible{outline:3px solid var(--home);outline-offset:3px;border-radius:4px}
.pd img{display:block;height:auto}
.num{font-weight:800;font-stretch:75%;font-variant-numeric:tabular-nums lining-nums}
.top{display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px 16px;max-width:1240px;margin:0 auto;padding:18px var(--gut);font-size:15px;font-weight:600;font-stretch:87.5%}
.top a{text-decoration:none}
.top a:hover{text-decoration:underline}
.pd main{display:block;max-width:1240px;margin:0 auto;padding:0 var(--gut)}
.hero{padding:clamp(20px,4vw,48px) 0 clamp(40px,6vw,72px)}
.hero__grid{display:grid;gap:clamp(28px,4vw,48px);align-items:center}
@media (min-width:960px){.hero__grid{grid-template-columns:minmax(0,5fr) minmax(0,7fr)}}
.kicker{font-size:14px;font-weight:600;font-stretch:87.5%;color:var(--soft);margin-bottom:16px;text-wrap:balance}
.brand{display:flex;align-items:center;gap:clamp(14px,2vw,22px);margin-bottom:clamp(16px,2vw,24px)}
.brand img{width:clamp(72px,9vw,104px);border-radius:23%;box-shadow:var(--slab)}
.pd h1{font:800 clamp(52px,9vw,112px)/1 var(--sans);font-stretch:75%;letter-spacing:-.01em}
.lead{font-size:clamp(17px,1.5vw,19px);max-width:34em;margin-bottom:22px;text-wrap:pretty}
.rows>div{display:flex;justify-content:space-between;gap:16px;padding:11px 0;border-top:1px solid var(--right)}
.rows dt{color:var(--soft);font-size:14px}
.rows dd{font-weight:600;font-stretch:87.5%;text-align:right}
.rows--stack>div{display:grid;gap:2px}
.rows--stack dd{text-align:left;font-weight:400;font-stretch:100%}
@media (max-width:560px){.rows>div{display:grid;gap:2px}.rows dd{text-align:left}}
.toc{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
.toc a{display:inline-block;padding:8px 14px;background:var(--card);border-radius:8px;box-shadow:0 3px 0 var(--right);font-size:14px;font-weight:600;font-stretch:87.5%;text-decoration:none}
.toc a:hover{background:var(--sun-tint)}
.stage{position:relative;background:var(--ground);border-radius:14px;overflow:hidden;box-shadow:var(--slab)}
.stage video{display:block;width:100%;height:auto;background:var(--ground)}
.stage--hero .hero__tall{display:none}
@media (max-width:700px){.stage--hero .hero__wide{display:none}.stage--hero .hero__tall{display:block}.hero__media{max-width:420px;margin:0 auto;width:100%}}
.hero__media figcaption{padding:12px 4px 0;font-size:14px;color:var(--soft)}
.sec{padding:clamp(44px,7vw,88px) 0;scroll-margin-top:12px}
.sec__head{display:grid;gap:14px;margin-bottom:clamp(24px,3vw,36px);max-width:62rem}
.sec__num{justify-self:start;display:inline-flex;align-items:center;gap:8px;padding:5px 12px;border-radius:8px;background:var(--card);box-shadow:0 3px 0 var(--right);font-size:13px;font-weight:600;font-stretch:87.5%}
.sec__num::before{content:'';width:9px;height:9px;border-radius:50%;background:var(--dot,var(--sun))}
.sec h2,.cta h2{font:800 clamp(34px,5vw,64px)/1.02 var(--sans);font-stretch:75%;letter-spacing:-.005em;text-wrap:balance}
.sec h3{font-size:18px;line-height:1.3;font-weight:700;margin-bottom:16px;text-wrap:balance}
.intro{font-size:clamp(16px,1.4vw,18px);max-width:44em;text-wrap:pretty}
.cols{display:grid;gap:24px}
@media (min-width:900px){.cols{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:40px;align-items:start}}
.prose{display:grid;gap:14px;max-width:40em}
.prose p{text-wrap:pretty}
.card{background:var(--card);border-radius:14px;box-shadow:var(--slab);padding:clamp(18px,2.4vw,30px)}
.ledger__label{font-size:14px;color:var(--soft)}
.ledger__title{font:800 clamp(28px,3vw,38px)/1.05 var(--sans);font-stretch:75%;margin:4px 0 18px!important;text-wrap:balance}
.ledger__chart{width:100%;height:auto;margin-bottom:18px}
.ledger__chart .axis{stroke:var(--left);stroke-width:1}
.ledger__chart .fill{fill:var(--sun-tint)}
.ledger__chart .line{fill:none;stroke:var(--sun);stroke-width:3;stroke-linejoin:round}
.ledger__chart text{font:500 11px var(--sans);fill:var(--soft)}
.ledger__chart .peak{fill:var(--card);stroke:var(--sun);stroke-width:3}
.ledger__chart .peak-label{font-weight:700;fill:var(--ink)}
.split{display:grid;gap:6px;margin-top:14px}
.split__head{display:flex;justify-content:space-between;gap:12px;font-weight:600;font-stretch:87.5%;font-size:15px}
.split__head .num{font-size:20px}
.bar{display:flex;gap:2px;height:14px}
.bar span{display:block;height:100%;border-radius:3px;background:var(--c)}
.split__legend{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:14px;color:var(--soft)}
.split__legend b{color:var(--ink)}
.split__legend i{display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--c);margin-right:6px}
.sum{margin-top:16px!important;padding-top:14px;border-top:1px solid var(--left);font-size:15px;color:var(--soft)}
.sum b{color:var(--ink);font-weight:600}
.pd-js [data-draw] .line{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 1.333s cubic-bezier(.65,0,.35,1)}
.pd-js [data-draw] .fill,.pd-js [data-draw] .peak{opacity:0;transition:opacity .4s cubic-bezier(.33,1,.68,1) 1.3s}
.pd-js [data-draw] .bar span{transform:scaleX(0);transform-origin:0 50%;transition:transform 1s cubic-bezier(.22,1,.36,1)}
.pd-js [data-draw].is-in .line{stroke-dashoffset:0}
.pd-js [data-draw].is-in .fill,.pd-js [data-draw].is-in .peak{opacity:1}
.pd-js [data-draw].is-in .bar span{transform:none}
.chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
.chips li{padding:6px 12px;border-radius:8px;background:var(--card);box-shadow:0 3px 0 var(--right);font-size:14px;font-weight:600;font-stretch:87.5%}
.swatches{display:grid;grid-template-columns:repeat(auto-fill,minmax(132px,1fr));gap:16px}
.swatch{display:grid;gap:2px;font-size:14px;align-content:start}
.swatch__chip{display:block;height:52px;border-radius:8px;box-shadow:0 3px 0 var(--right),inset 0 0 0 1px rgba(21,32,43,.06);margin-bottom:8px}
.swatch b{font-size:15px;font-weight:600;font-stretch:87.5%}
.swatch span:not(.swatch__chip){color:var(--soft);overflow-wrap:anywhere}
.type{display:grid;gap:14px}
.type__row{display:grid;gap:2px;padding-top:12px;border-top:1px solid var(--left)}
.type__row p{line-height:1.2;overflow-wrap:anywhere}
.type__row small{font-size:13px;color:var(--soft)}
.contrast{margin-top:18px;font-size:15px;color:var(--soft);max-width:52em}
.list{display:grid;gap:10px;margin-top:4px;max-width:58em}
.list li{position:relative;padding-left:24px}
.list li::before{content:'';position:absolute;left:0;top:.5em;width:10px;height:10px;border-radius:2px;background:var(--sun);transform:rotate(45deg) scaleY(.7)}
.board{margin:28px 0}
.board img{width:100%;border-radius:14px;box-shadow:var(--slab)}
.shots,.files{background:var(--card);margin-top:20px;overflow:hidden;border-radius:14px;box-shadow:var(--slab)}
.shots table,.files table{width:100%;border-collapse:collapse;font-size:15px;line-height:1.5}
@media (max-width:760px){.shots thead,.files thead{display:none}.shots table,.shots tbody,.shots tr,.shots th,.shots td,.files table,.files tbody,.files tr,.files th,.files td{display:block}.shots tr,.files tr{padding:12px 4px;border-top:1px solid var(--left)}.shots tr:first-child,.files tr:first-child{border-top:0}.pd .shots th,.pd .shots td,.pd .files th,.pd .files td{border-top:0;padding:4px 18px}.shots td[data-label]::before,.files td[data-label]::before{content:attr(data-label);display:block;margin-top:4px;font-size:12px;font-weight:600;color:var(--soft)}.num-cell{white-space:normal}}
.files caption{text-align:left;padding:18px 18px 6px;font-weight:700;font-size:18px}
@media (max-width:760px){.files caption{display:block;width:auto}}
.pd th,.pd td{text-align:left;vertical-align:top;padding:12px 16px;border-top:1px solid var(--left)}
.pd thead th{border-top:0;font-size:13px;color:var(--soft);font-weight:600}
.pd tbody th{font-weight:600}
.pd td.num{font-weight:400;font-stretch:100%;white-space:nowrap}
@media (min-width:761px){.pd .shots tbody th{white-space:nowrap}}
@media (max-width:760px){.pd td.num{white-space:normal}}
.dim{color:var(--soft);font-weight:400}
.file-name{display:block;font-weight:700;overflow-wrap:anywhere}
.files th .dim{display:block;font-size:14px;overflow-wrap:anywhere}
.presets>div{display:grid;gap:2px;padding:13px 0;border-top:1px solid var(--right)}
.presets dt{font-weight:700}
.presets dt span{font-weight:400;color:var(--soft)}
.presets dd{font-size:15px;color:var(--soft)}
.presets code{font:600 14px/1.55 var(--sans);font-stretch:87.5%;color:var(--ink);overflow-wrap:anywhere}
.lab{background:var(--card);border-radius:14px;box-shadow:var(--slab);padding:clamp(16px,2.4vw,30px);display:grid;gap:24px}
.lab__lanes{display:grid;gap:20px}
@media (min-width:760px){.lab__lanes{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}}
.lab__lane{display:grid;gap:10px;align-content:start;background:var(--ground);border-radius:12px;padding:16px}
.lab__count{font-size:18px;font-weight:600;font-stretch:87.5%;color:var(--sun-t)}
.lab__count span{font-size:56px;line-height:1;font-weight:800;font-stretch:75%;font-variant-numeric:tabular-nums;color:var(--ink)}
.lab__plot{width:100%;height:auto}
.lab__axis{stroke:var(--right);stroke-width:1.5}
.lab__ghost{fill:none;stroke:var(--left);stroke-width:3}
.lab__line{fill:none;stroke:var(--sun);stroke-width:3.5;stroke-linejoin:round;stroke-linecap:round}
.lab__lane--linear .lab__line{stroke:var(--grid)}
.lab__lane figcaption{display:grid;gap:2px;font-size:14px;color:var(--soft)}
.lab__lane figcaption b{font-size:17px;font-weight:700;color:var(--ink)}
.lab__controls{display:grid;gap:16px}
@media (min-width:760px){.lab__controls{grid-template-columns:minmax(0,1fr) auto;align-items:end}}
.lab__slider{display:grid;gap:8px;font-size:15px;font-weight:600;font-stretch:87.5%}
.lab__slider input{width:100%;accent-color:#3a6fd8}
.lab__play{font:700 16px/1 var(--sans);color:var(--card);background:var(--ink);border:0;border-radius:10px;padding:15px 22px;cursor:pointer;box-shadow:0 4px 0 var(--soft)}
.lab__play:hover{background:var(--panel)}
.lab__play:active{transform:translateY(2px);box-shadow:0 2px 0 var(--soft)}
.lab__caption{font-size:15px;max-width:56em;color:var(--soft)}
.gallery{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
@media (min-width:760px){.gallery{grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}}
@media (min-width:1100px){.gallery{grid-template-columns:repeat(4,minmax(0,1fr))}}
.gallery figure{display:grid;gap:10px;align-content:start}
.gallery img{width:100%;border-radius:14px;box-shadow:var(--slab)}
.gallery b{display:block;font-size:15px;font-weight:700}
.gallery span{display:block;font-size:14px;color:var(--soft);line-height:1.5}
.formats{display:grid;gap:22px;grid-template-columns:repeat(2,minmax(0,1fr))}
@media (min-width:900px){.formats{grid-template-columns:minmax(0,.9fr) minmax(0,.9fr) minmax(0,1.3fr);align-items:start}}
.formats figure{display:grid;gap:10px;align-content:start}
.formats figcaption{font-size:14px;color:var(--soft)}
.formats figcaption b{display:block;color:var(--ink);font-size:15px;font-weight:700}
.fmt--wide{grid-column:1/-1;display:grid;gap:22px}
@media (min-width:900px){.fmt--wide{grid-column:auto}}
.cta{margin:clamp(16px,4vw,40px) 0 0;padding:clamp(26px,4vw,52px);background:var(--ink);color:var(--card);border-radius:16px;box-shadow:0 6px 0 var(--panel);display:grid;gap:18px}
.cta p{max-width:40em;color:var(--left)}
.cta a{justify-self:start;display:inline-block;padding:15px 22px;border-radius:10px;background:var(--sun);color:var(--ink);font-weight:700;text-decoration:none;box-shadow:0 4px 0 var(--sun-t)}
.cta a:hover{background:var(--sun-tint)}
.foot{max-width:1240px;margin:clamp(40px,6vw,64px) auto 0;padding:24px var(--gut) 40px;font-size:14px;color:var(--soft)}
.foot a{color:var(--ink);font-weight:600}
@media (prefers-reduced-motion:reduce){.pd *{scroll-behavior:auto!important;transition:none!important}}
`;
