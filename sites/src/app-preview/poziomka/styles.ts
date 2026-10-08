const dither = (a: string, b: string) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' shape-rendering='crispEdges'%3E%3Crect width='4' height='4' fill='${encodeURIComponent(a)}'/%3E%3Crect width='2' height='2' fill='${encodeURIComponent(b)}'/%3E%3Crect x='2' y='2' width='2' height='2' fill='${encodeURIComponent(b)}'/%3E%3C/svg%3E")`;

const notch = (n: number) =>
  `polygon(${n}px 0,calc(100% - ${n}px) 0,100% ${n}px,100% calc(100% - ${n}px),calc(100% - ${n}px) 100%,${n}px 100%,0 calc(100% - ${n}px),0 ${n}px)`;

export const styles = `
:root{color-scheme:light;--ink:#140c1c;--plum:#3b2440;--dusk:#6b3e5e;--berry-deep:#a23b4e;--berry:#e0474f;--berry-light:#ff8f8f;--gold:#f7c873;--cream:#fff3c4;--forest:#2d5a3a;--leaf:#4fa34a;--sprout:#a6de5c;--blue-deep:#2b4c8c;--sky-mid:#4f8fe0;--sky:#9ed8ff;--stone:#8a7f86;--white:#fff;--skip-bg:#140c1c;--skip-fg:#fff3c4;--gut:16px;--mini:'Tiny5',ui-monospace,monospace;--pixel:'Jersey 10','Tiny5',ui-monospace,monospace;--notch:${notch(2)}}
@media (min-width:600px){:root{--gut:32px}}
@media (min-width:1100px){:root{--gut:48px}}
body.poz{background:var(--sky);color:var(--ink);font:400 16px/24px var(--mini);-webkit-font-smoothing:none;font-smooth:never}
.poz :where(h1,h2,h3,p,figure,dl,dd,ul,ol,table,fieldset){margin:0}
.poz :where(ul,ol){padding:0;list-style:none}
.poz :where(p,dd,li,figcaption,td){text-wrap:pretty}
[data-scale='down'] :is(video,img){image-rendering:auto}
.poz a{color:var(--ink);text-underline-offset:4px;text-decoration-thickness:2px}
.poz a:focus-visible,.poz button:focus-visible,.poz input:focus-visible,.poz [tabindex]:focus-visible{outline:4px solid var(--ink);outline-offset:2px}
.poz img,.poz video,.poz canvas{display:block;image-rendering:pixelated;image-rendering:crisp-edges}
.poz img{height:auto}
.px{width:100%;max-width:100%;height:auto}
.band{background:var(--blue-deep)}
.band__dither{height:8px;background:${dither('#2b4c8c', '#4f8fe0')}}
.band__mid{height:8px;background:var(--sky-mid)}
.band__dither2{height:8px;background:${dither('#4f8fe0', '#9ed8ff')}}
.top{display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px 16px;max-width:1240px;margin:0 auto;padding:14px var(--gut);color:var(--cream)}
.top a{color:var(--cream);text-decoration:none}
.top a:hover{text-decoration:underline}
.top a:focus-visible{outline-color:var(--gold)}
.poz main{display:block;max-width:1240px;margin:0 auto;padding:0 var(--gut)}
.panel{background:var(--cream);border:2px solid var(--ink);clip-path:var(--notch);box-shadow:inset -2px -2px 0 var(--gold);padding:22px}
@media (min-width:900px){.panel{padding:30px}}
.panel--plum{background:var(--plum);color:var(--cream);box-shadow:inset -2px -2px 0 var(--ink)}
.panel--gold{background:var(--gold);box-shadow:inset -2px -2px 0 var(--berry-deep)}
.hero{padding:40px 0 56px}
.hero__grid{display:grid;gap:24px 48px;align-items:end}
@media (min-width:960px){.hero__grid{grid-template-columns:minmax(0,7fr) minmax(0,5fr)}}
.kicker{color:var(--dusk);margin-bottom:16px}
.brand{display:flex;align-items:center;gap:24px;margin-bottom:20px}
.brand img{width:96px}
@media (min-width:600px){.brand img{width:128px}}
@media (max-width:399px){.brand{gap:16px}.brand img{width:64px}}
.poz h1{font:400 74.6667px/80px var(--pixel)}
@media (min-width:600px){.poz h1{font-size:112px;line-height:120px}}
@media (max-width:399px){.poz h1{font-size:56px;line-height:60px}}
.lead{max-width:36em;margin-bottom:8px}
.rows>div{display:flex;justify-content:space-between;gap:16px;padding:10px 0;border-top:2px dotted var(--dusk)}
.rows>div:first-child{border-top:0}
.rows dt{color:var(--dusk)}
.rows dd{text-align:right}
.rows--stack>div{display:grid;gap:2px}
.rows--stack dd{text-align:left}
@media (max-width:560px){.rows>div{display:grid;gap:2px}.rows dd{text-align:left}}
.toc{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px}
.toc a{display:inline-block;padding:6px 12px;background:var(--cream);border:2px solid var(--ink);clip-path:var(--notch);box-shadow:inset -2px -2px 0 var(--gold);text-decoration:none}
.toc a:hover{background:var(--gold)}
.screen{display:grid;justify-items:center;gap:12px;margin-top:32px}
.screen__frame{background:var(--ink);padding:8px;clip-path:${notch(4)};max-width:100%}
.screen__frame--plain{background:transparent;padding:0;clip-path:none}
.screen figcaption{color:var(--dusk);text-align:center;max-width:44em}
.hero__tall{display:none}
@media (max-width:700px){.hero__wide{display:none}.hero__tall{display:block}}
.sec{padding:56px 0;scroll-margin-top:12px}
@media (min-width:900px){.sec{padding:80px 0}}
.sec__head{display:grid;gap:16px;margin-bottom:32px;max-width:62rem}
.sec__num{justify-self:start;padding:4px 10px;background:var(--plum);color:var(--gold);clip-path:var(--notch)}
.sec h2,.cta h2{font:400 37.3333px/40px var(--pixel);text-wrap:balance}
@media (min-width:700px){.sec h2,.cta h2{font-size:56px;line-height:60px}}
.sec h3{font:400 37.3333px/40px var(--pixel);margin-bottom:16px;text-wrap:balance}
.intro{max-width:44em;text-wrap:pretty}
.cols{display:grid;gap:24px}
@media (min-width:900px){.cols{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:40px;align-items:start}}
.prose{display:grid;gap:16px;max-width:40em}
.prose p{text-wrap:pretty}
.quests__label{color:var(--dusk)}
.quests__title{font:400 37.3333px/40px var(--pixel);margin:4px 0 16px!important}
.quests ul{display:grid;gap:8px}
.quests li{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:8px 12px;background:var(--white);border:2px solid var(--ink);clip-path:var(--notch)}
.quests li.done{background:var(--sprout)}
.quests li span:first-child{display:grid}
.quests small{font-size:16px;color:var(--dusk)}
.xp{flex:none;padding:2px 8px;background:var(--gold);border:2px solid var(--ink);white-space:nowrap}
.quests__total{margin-top:16px!important}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:24px}
.chips li{padding:4px 12px;background:var(--cream);border:2px solid var(--ink);clip-path:var(--notch)}
.chips li:nth-child(2n){background:var(--sprout)}
.swatches{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
@media (min-width:600px){.swatches{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media (min-width:1100px){.swatches{grid-template-columns:repeat(8,minmax(0,1fr))}}
.swatch{display:grid;gap:2px;align-content:start}
.swatch__chip{display:block;height:48px;border:2px solid var(--ink);margin-bottom:6px}
.swatch span:not(.swatch__chip){color:var(--dusk);overflow-wrap:anywhere}
.type{display:grid;gap:20px}
.type__row{display:grid;gap:4px;padding-top:16px;border-top:2px dotted var(--dusk)}
.type__row:first-of-type{border-top:0;padding-top:0}
.type__big{font:400 56px/60px var(--pixel)}
.type__mini{font:400 32px/40px var(--mini)}
.type__big span,.type__mini span{display:block}
@media (max-width:499px){.type__big{font-size:37.3333px;line-height:40px}.type__mini{font-size:24px;line-height:32px}}
.type__row small{font-size:16px;color:var(--dusk)}
.contrast{margin-top:20px;color:var(--dusk);max-width:52em}
.list{display:grid;gap:10px;max-width:58em}
.list li{position:relative;padding-left:24px}
.list li::before{content:'';position:absolute;left:0;top:8px;width:10px;height:10px;background:var(--berry);border:2px solid var(--ink)}
.board{margin:32px 0}
.poz .board img{width:100%;max-width:1400px;border:2px solid var(--ink);image-rendering:auto}
@media (min-resolution:2dppx) and (min-width:700px){.poz .board img{image-rendering:pixelated}}
.shots,.files{margin-top:24px;overflow:hidden;background:var(--cream);border:2px solid var(--ink);clip-path:var(--notch)}
.shots table,.files table{width:100%;border-collapse:collapse}
@media (max-width:760px){.shots thead,.files thead{display:none}.shots table,.shots tbody,.shots tr,.shots th,.shots td,.files table,.files tbody,.files tr,.files th,.files td{display:block}.shots tr,.files tr{padding:12px 4px;border-top:2px dotted var(--dusk)}.shots tr:first-child,.files tr:first-child{border-top:0}.poz .shots th,.poz .shots td,.poz .files th,.poz .files td{border-top:0;padding:4px 16px}.shots td[data-label]::before,.files td[data-label]::before{content:attr(data-label);display:block;margin-top:4px;color:var(--dusk)}.num{white-space:normal}}
.files caption{text-align:left;padding:16px 16px 4px;font:400 37.3333px/40px var(--pixel)}
@media (max-width:760px){.files caption{display:block;width:auto}}
.poz th,.poz td{text-align:left;vertical-align:top;padding:10px 14px;border-top:2px dotted var(--dusk);font-weight:400}
.poz thead th{border-top:0;color:var(--dusk)}
.poz tbody th{color:var(--ink)}
.num{white-space:nowrap}
@media (min-width:761px){.poz .shots tbody th{white-space:nowrap}}
.dim{color:var(--dusk)}
.file-name{display:block;overflow-wrap:anywhere}
.files th .dim{display:block;overflow-wrap:anywhere}
.presets>div{display:grid;gap:2px;padding:12px 0;border-top:2px dotted var(--dusk)}
.presets>div:first-child{border-top:0}
.presets dt span{color:var(--dusk)}
.presets dd{color:var(--dusk)}
.presets code{font:400 16px/24px var(--mini);color:var(--ink);overflow-wrap:anywhere}
.lab{display:grid;gap:24px;background:var(--cream);border:2px solid var(--ink);clip-path:var(--notch);box-shadow:inset -2px -2px 0 var(--gold);padding:16px}
@media (min-width:760px){.lab{padding:28px}}
.lab__lanes{display:grid;gap:20px}
@media (min-width:760px){.lab__lanes{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}}
.lab__lane{display:grid;gap:12px;justify-items:center;align-content:start;padding:16px;background:var(--white);border:2px solid var(--ink)}
.lab__stage{position:relative;overflow:hidden;max-width:100%;background:var(--sky)}
.lab__stage::after{content:'';position:absolute;left:0;right:0;bottom:0;height:12px;background:var(--leaf);border-top:6px solid var(--sprout)}
.lab__shadow{position:absolute;left:50%;bottom:18px;height:6px;background:var(--blue-deep);transform:translateX(-50%)}
.lab__stage canvas{position:absolute;left:0;top:0;width:100%;height:100%;z-index:1}
.lab__plot{width:100%;max-width:360px;height:auto;background:var(--sky)}
.lab__curve{fill:none;stroke:var(--berry);stroke-width:3}
.lab__curve--step{stroke:var(--ink);shape-rendering:crispEdges}
.lab__marker{stroke:var(--dusk);stroke-width:2;stroke-dasharray:4 4}
.lab__lane figcaption{display:grid;gap:2px;text-align:center;color:var(--dusk)}
.lab__lane figcaption b{font:400 37.3333px/40px var(--pixel);color:var(--ink)}
.lab__controls{display:flex;flex-wrap:wrap;gap:16px;align-items:end;justify-content:space-between}
.lab__tempo{display:flex;flex-wrap:wrap;gap:8px;border:0;padding:0}
.lab__tempo legend{width:100%;margin-bottom:8px;color:var(--dusk)}
.lab__tempo label{cursor:pointer}
.lab__tempo input{position:absolute;opacity:0;width:1px;height:1px}
.lab__tempo span{display:inline-block;padding:6px 12px;background:var(--white);border:2px solid var(--ink);clip-path:var(--notch)}
.lab__tempo input:checked+span{background:var(--gold)}
.lab__tempo input:focus-visible+span{outline:4px solid var(--ink);outline-offset:2px}
.lab__play{font:400 37.3333px/40px var(--pixel);color:var(--ink);background:var(--gold);border:2px solid var(--ink);clip-path:var(--notch);box-shadow:inset -2px -2px 0 var(--berry-deep);padding:6px 20px;cursor:pointer}
.lab__play:hover{background:var(--cream)}
.lab__caption{color:var(--dusk);max-width:56em}
.gallery{display:grid;grid-auto-flow:column;grid-auto-columns:max-content;gap:24px;overflow-x:auto;scroll-snap-type:x mandatory;padding:4px 4px 20px;margin:0 -4px}
.gallery figure{display:grid;gap:12px;align-content:start;width:min-content;scroll-snap-align:start}
.gallery b{display:block;font:400 37.3333px/40px var(--pixel);font-weight:400}
.gallery span{display:block;color:var(--dusk)}
.hint{margin-top:4px;color:var(--dusk)}
.shot{background:var(--ink);padding:4px;clip-path:${notch(4)}}
.formats{display:grid;gap:32px 24px;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));align-items:start}
.formats figure{display:grid;gap:12px;align-content:start;justify-items:center}
.formats figcaption{color:var(--dusk);justify-self:stretch}
.formats figcaption b{display:block;color:var(--ink);font:400 37.3333px/40px var(--pixel)}
.fmt--wide{grid-column:1/-1}
.cta{margin:24px 0 0;display:grid;gap:20px}
.cta p{max-width:40em}
.cta a{justify-self:start;display:inline-block;padding:8px 20px;background:var(--gold);border:2px solid var(--ink);clip-path:var(--notch);box-shadow:inset -2px -2px 0 var(--berry-deep);font:400 37.3333px/40px var(--pixel);text-decoration:none}
.cta a:hover{background:var(--white)}
.ground{margin-top:64px;background:var(--leaf)}
.ground__edge{height:8px;background:${dither('#4fa34a', '#a6de5c')}}
.foot{max-width:1240px;margin:0 auto;padding:24px var(--gut) 40px;color:var(--ink)}
.foot a{color:var(--ink)}
@media (prefers-reduced-motion:reduce){.poz *{scroll-behavior:auto!important}}
`;
