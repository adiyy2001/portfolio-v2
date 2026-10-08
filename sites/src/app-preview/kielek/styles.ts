export const styles = `
:root{color-scheme:light;--ground:#ffe6d6;--card:#fff5ee;--pistachio:#bfe29a;--leaf:#7dbe5a;--butter:#ffe07a;--blush:#ffc2cc;--terracotta:#e8896b;--water:#aee3d3;--ink:#4a2c2a;--soft:#7a5650;--clay:inset 5px 5px 10px rgba(255,255,255,.7),inset -5px -7px 12px rgba(74,44,42,.12),0 8px 24px rgba(74,44,42,.18);--clay-s:inset 3px 3px 6px rgba(255,255,255,.65),inset -3px -4px 8px rgba(74,44,42,.1),0 4px 12px rgba(74,44,42,.14);--pressed:inset 4px 5px 10px rgba(74,44,42,.14),inset -3px -3px 8px rgba(255,255,255,.6);--skip-bg:#4a2c2a;--skip-fg:#fff5ee;--gut:clamp(16px,4vw,48px);--round:'M PLUS Rounded 1c','Arial Rounded MT Bold',system-ui,sans-serif}
body.kie{background:var(--ground);color:var(--ink);font:500 17px/1.6 var(--round)}
.kie :where(h1,h2,h3,p,figure,dl,dd,ul,ol,table){margin:0}
.kie :where(ul,ol){padding:0;list-style:none}
.kie a{color:var(--ink);text-underline-offset:4px;text-decoration-thickness:2px}
.kie a:focus-visible,.kie button:focus-visible,.kie input:focus-visible,.kie [tabindex]:focus-visible{outline:3px solid var(--ink);outline-offset:3px;border-radius:8px}
.kie img{display:block;height:auto}
.top{display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px 16px;max-width:1240px;margin:0 auto;padding:18px var(--gut);font-size:15px;font-weight:800}
.top a{text-decoration:none}
.top a:hover{text-decoration:underline}
.kie main{display:block;max-width:1240px;margin:0 auto;padding:0 var(--gut)}
.hero{padding:clamp(20px,4vw,48px) 0 clamp(40px,6vw,72px)}
.hero__grid{display:grid;gap:clamp(28px,4vw,48px);align-items:center}
@media (min-width:960px){.hero__grid{grid-template-columns:minmax(0,5fr) minmax(0,7fr);grid-template-rows:1fr auto auto 1fr;row-gap:0}.hero__intro{grid-column:1;grid-row:2}.hero__more{grid-column:1;grid-row:3}.hero__media{grid-column:2;grid-row:1/5}}
@media (max-width:959px){.hero__intro>:last-child{margin-bottom:0}}
.kicker{font-size:14px;font-weight:800;color:var(--soft);margin-bottom:16px;text-wrap:balance}
.brand{display:flex;align-items:center;gap:clamp(14px,2vw,22px);margin-bottom:clamp(16px,2vw,24px)}
.brand img{width:clamp(72px,9vw,108px);border-radius:24%;box-shadow:var(--clay)}
.kie h1{font:900 clamp(52px,9vw,112px)/1 var(--round);letter-spacing:-.02em}
.lead{font-size:clamp(17px,1.5vw,19px);line-height:1.6;max-width:34em;margin-bottom:22px;text-wrap:pretty}
.rows>div{display:flex;justify-content:space-between;gap:16px;padding:11px 0;border-top:2px dotted rgba(74,44,42,.22)}
.rows dt{color:var(--soft);font-size:14px;font-weight:800}
.rows dd{font-weight:800;text-align:right}
.rows--stack>div{display:grid;gap:2px}
.rows--stack dd{text-align:left;font-weight:500}
@media (max-width:560px){.rows>div{display:grid;gap:2px}.rows dd{text-align:left}}
.toc{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
.toc a{display:inline-block;padding:9px 16px;background:var(--card);border-radius:999px;box-shadow:var(--clay-s);font-size:14px;font-weight:800;text-decoration:none}
.toc a:hover{background:var(--butter)}
.stage{position:relative;background:var(--ground);border-radius:28px;overflow:hidden;box-shadow:var(--clay)}
.stage video{display:block;width:100%;height:auto;background:var(--ground)}
.stage--hero .hero__tall{display:none}
.stage--hero .hero__square{display:none}
@media (min-width:960px){.stage--hero .hero__wide{display:none}.stage--hero .hero__square{display:block}}
@media (max-width:700px){.stage--hero .hero__wide{display:none}.stage--hero .hero__tall{display:block}.hero__media{max-width:420px;margin:0 auto;width:100%}}
.hero__media figcaption{padding:12px 4px 0;font-size:14px;color:var(--soft)}
.sec{padding:clamp(44px,7vw,88px) 0;scroll-margin-top:12px}
.sec__head{display:grid;gap:14px;margin-bottom:clamp(24px,3vw,36px);max-width:62rem}
.sec__num{justify-self:start;padding:6px 14px;border-radius:999px;background:var(--butter);box-shadow:var(--clay-s);font-size:13px;font-weight:800}
.sec h2,.cta h2{font:900 clamp(30px,4.4vw,54px)/1.1 var(--round);letter-spacing:-.015em;text-wrap:balance}
.sec h3{font-size:18px;line-height:1.3;font-weight:900;margin-bottom:16px;text-wrap:balance}
.intro{font-size:clamp(16px,1.4vw,18px);max-width:44em;text-wrap:pretty}
.cols{display:grid;gap:24px}
@media (min-width:900px){.cols{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:40px;align-items:start}}
.prose{display:grid;gap:14px;max-width:40em}
.prose p{text-wrap:pretty}
.card{background:var(--card);border-radius:32px;box-shadow:var(--clay);padding:clamp(20px,2.6vw,32px)}
.card--butter{background:var(--butter)}
.plan__label{font-size:14px;font-weight:800;color:var(--soft)}
.plan__title{font-size:clamp(24px,2.6vw,32px);font-weight:900;line-height:1.15;margin:4px 0 18px!important;text-wrap:balance}
.plan ul{display:grid;gap:12px}
.plan li{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 14px 12px 18px;background:var(--card);border-radius:22px;box-shadow:var(--clay-s)}
.plan li span:first-child{display:grid;line-height:1.3}
.plan li b{font-weight:900;font-size:18px}
.plan li small{font-size:14px;color:var(--soft)}
.pill{flex:none;padding:6px 12px;border-radius:999px;background:var(--water);box-shadow:var(--clay-s);font-size:14px;font-weight:800;white-space:nowrap}
.plan__total{margin-top:16px!important;font-weight:900;font-size:18px}
.chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
.chips li{padding:8px 16px;border-radius:999px;background:var(--card);box-shadow:var(--clay-s);font-size:14px;font-weight:800}
.chips li:nth-child(2n){background:var(--pistachio)}
.swatches{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:16px}
.swatch{display:grid;gap:2px;font-size:14px;align-content:start}
.swatch__chip{display:block;height:60px;border-radius:22px;box-shadow:var(--clay-s);margin-bottom:8px}
.swatch b{font-size:15px;font-weight:900}
.swatch span:not(.swatch__chip){color:var(--soft);overflow-wrap:anywhere}
.type{display:grid;gap:14px}
.type__row{display:grid;gap:2px;padding-top:12px;border-top:2px dotted rgba(74,44,42,.22)}
.type__row p{line-height:1.3;overflow-wrap:anywhere}
.type__row small{font-size:13px;color:var(--soft);font-weight:800}
.contrast{margin-top:18px;font-size:15px;color:var(--soft);max-width:52em}
.list{display:grid;gap:10px;margin-top:4px;max-width:58em}
.list li{position:relative;padding-left:28px}
.list li::before{content:'';position:absolute;left:0;top:.45em;width:14px;height:14px;border-radius:50%;background:var(--water);box-shadow:var(--clay-s)}
.board{margin:28px 0}
.board img{width:100%;border-radius:28px;box-shadow:var(--clay)}
.shots,.files{background:var(--card);margin-top:20px;overflow:hidden;border-radius:28px;box-shadow:var(--clay)}
.shots table,.files table{width:100%;border-collapse:collapse;font-size:15px;line-height:1.5}
@media (max-width:960px){.shots thead,.files thead{display:none}.shots table,.shots tbody,.shots tr,.shots th,.shots td,.files table,.files tbody,.files tr,.files th,.files td{display:block}.shots tr,.files tr{padding:12px 4px;border-top:2px dotted rgba(74,44,42,.2)}.shots tr:first-child,.files tr:first-child{border-top:0}.kie .shots th,.kie .shots td,.kie .files th,.kie .files td{border-top:0;padding:4px 18px}.shots td[data-label]::before,.files td[data-label]::before{content:attr(data-label);display:block;margin-top:4px;font-size:12px;font-weight:800;color:var(--soft)}.num{white-space:normal}}
.files caption{text-align:left;padding:18px 18px 6px;font-weight:900;font-size:18px}
@media (max-width:960px){.files caption{display:block;width:auto}}
.kie th,.kie td{text-align:left;vertical-align:top;padding:12px 16px;border-top:2px dotted rgba(74,44,42,.2)}
.kie thead th{border-top:0;font-size:13px;color:var(--soft);font-weight:800}
.kie tbody th{font-weight:900}
.num{white-space:nowrap}
@media (min-width:761px){.kie .shots tbody th{white-space:nowrap}}
.dim{color:var(--soft);font-weight:500}
.file-name{display:block;font-weight:900;overflow-wrap:anywhere}
.files th .dim{display:block;font-size:14px;overflow-wrap:anywhere}
.presets>div{display:grid;gap:2px;padding:13px 0;border-top:2px dotted rgba(74,44,42,.22)}
.presets dt{font-weight:900}
.presets dt span{font-weight:500;color:var(--soft)}
.presets dd{font-size:15px;color:var(--soft)}
.presets code{font:800 14px/1.55 var(--round);color:var(--ink);overflow-wrap:anywhere}
.lab{background:var(--card);border-radius:32px;box-shadow:var(--clay);padding:clamp(16px,2.6vw,32px);display:grid;gap:24px}
.lab__lanes{display:grid;gap:20px}
@media (min-width:760px){.lab__lanes{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}}
.lab__lane{display:grid;gap:12px;align-content:start;background:var(--ground);border-radius:26px;box-shadow:var(--pressed);padding:16px}
.lab__scene{width:100%;max-width:220px;height:auto;margin:0 auto;display:block}
.lab__leaf{fill:var(--pistachio)}
.lab__lane--stiff .lab__leaf{fill:var(--butter)}
.lab__shine{fill:rgba(255,255,255,.55)}
.lab__drop{fill:var(--water);stroke:rgba(74,44,42,.12);stroke-width:1.2}
.lab__glint{fill:rgba(255,255,255,.85)}
.lab__plot{width:100%;height:auto}
.lab__target{stroke:rgba(74,44,42,.3);stroke-width:1.5;stroke-dasharray:4 5}
.lab__curve{fill:none;stroke:var(--ink);stroke-width:3;stroke-linecap:round}
.lab__dot{fill:var(--water);stroke:var(--ink);stroke-width:2}
.lab__lane figcaption{display:grid;gap:2px;font-size:14px;color:var(--soft)}
.lab__lane figcaption b{font-size:17px;font-weight:900;color:var(--ink)}
.lab__controls{display:grid;gap:16px}
@media (min-width:760px){.lab__controls{grid-template-columns:minmax(0,1fr) minmax(0,1fr) auto;align-items:end}}
.lab__slider{display:grid;gap:8px;font-size:15px;font-weight:800}
.lab__slider input{width:100%;accent-color:#4a2c2a}
.lab__play{font:900 16px/1 var(--round);color:var(--ink);background:var(--pistachio);border:0;border-radius:999px;padding:16px 24px;cursor:pointer;box-shadow:var(--clay)}
.lab__play:hover{background:var(--butter)}
.lab__play:active{box-shadow:var(--pressed)}
.lab__caption{font-size:15px;max-width:56em;color:var(--soft)}
.gallery{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
@media (min-width:760px){.gallery{grid-template-columns:repeat(3,minmax(0,1fr));gap:26px}}
@media (min-width:1100px){.gallery{grid-template-columns:repeat(6,minmax(0,1fr));gap:18px}}
.gallery figure{display:grid;gap:10px;align-content:start}
.gallery img{width:100%;border-radius:24px;box-shadow:var(--clay)}
.gallery b{display:block;font-size:15px;font-weight:900}
.gallery span{display:block;font-size:14px;color:var(--soft);line-height:1.5}
.formats{display:grid;gap:22px;grid-template-columns:repeat(2,minmax(0,1fr))}
@media (min-width:900px){.formats{grid-template-columns:minmax(0,.9fr) minmax(0,.9fr) minmax(0,1.3fr);align-items:start}}
.formats figure{display:grid;gap:10px;align-content:start}
.formats figcaption{font-size:14px;color:var(--soft)}
.formats figcaption b{display:block;color:var(--ink);font-size:15px;font-weight:900}
.fmt--wide{grid-column:1/-1;display:grid;gap:22px}
@media (min-width:900px){.fmt--wide{grid-column:auto}}
.cta{margin:clamp(16px,4vw,40px) 0 0;padding:clamp(26px,4vw,52px);background:var(--pistachio);border-radius:36px;box-shadow:var(--clay);display:grid;gap:18px}
.cta p{max-width:40em}
.cta a{justify-self:start;display:inline-block;padding:16px 24px;border-radius:999px;background:var(--card);font-weight:900;text-decoration:none;box-shadow:var(--clay-s)}
.cta a:hover{background:var(--butter)}
.foot{max-width:1240px;margin:clamp(40px,6vw,64px) auto 0;padding:24px var(--gut) 40px;font-size:14px;color:var(--soft)}
.foot a{color:var(--ink);font-weight:800}
@media (prefers-reduced-motion:reduce){.kie *{scroll-behavior:auto!important}}
`;
