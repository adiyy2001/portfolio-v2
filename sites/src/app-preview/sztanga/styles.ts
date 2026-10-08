export const styles = `
:root{color-scheme:dark;--ground:#000;--raised:#141414;--line:#2a2a2a;--sec:#8c8c8c;--ink:#fff;--signal:#ff5a00;--skip-bg:#ff5a00;--skip-fg:#000;--gut:clamp(16px,4vw,48px);--font:'Anybody',system-ui,'Segoe UI',Roboto,Arial,sans-serif;--wd:62%;--k:3.27}
@media (min-width:420px){:root{--wd:75%;--k:3.96}}
@media (min-width:700px){:root{--wd:100%;--k:5.33}}
@media (min-width:1000px){:root{--wd:125%;--k:6.68}}
@media (min-width:1300px){:root{--wd:150%;--k:8.04}}
body.szt{background:var(--ground);color:var(--ink);font:500 17px/1.55 var(--font);font-feature-settings:'tnum'}
.szt :where(h1,h2,h3,p,figure,dl,dd,ul,ol,table){margin:0}
.szt :where(ul,ol){padding:0;list-style:none}
.szt a{color:var(--ink);text-underline-offset:3px}
.szt a:focus-visible,.szt button:focus-visible,.szt [tabindex]:focus-visible{outline:3px solid var(--signal);outline-offset:3px}
.szt img{display:block;height:auto}
.wide{font-weight:900;font-stretch:var(--wd);text-transform:uppercase;line-height:.86;letter-spacing:0}
.top{display:flex;justify-content:space-between;gap:16px;max-width:1240px;margin:0 auto;padding:18px var(--gut);font-weight:700;font-size:15px;font-stretch:75%;letter-spacing:.06em;text-transform:uppercase}
.top a{text-decoration:none}
.top a:hover{text-decoration:underline}
.szt main{display:block;max-width:1240px;margin:0 auto;padding:0 var(--gut)}
.hero{padding:clamp(16px,4vw,40px) 0 clamp(40px,6vw,72px)}
.kicker{font-size:13px;font-weight:700;font-stretch:75%;letter-spacing:.1em;text-transform:uppercase;color:var(--sec);margin-bottom:14px}
.hero__icon{width:clamp(56px,8vw,96px);border-radius:22%;box-shadow:0 0 0 2px var(--line);margin-bottom:clamp(16px,2.4vw,28px)}
.hero h1{font-size:calc((min(100vw,1240px) - 2 * var(--gut)) / var(--k));white-space:nowrap;margin-bottom:clamp(20px,3vw,36px)}
.hero__grid{display:grid;gap:clamp(24px,4vw,40px);align-items:start}
@media (min-width:960px){.hero__grid{grid-template-columns:minmax(0,4fr) minmax(0,7fr);grid-template-rows:auto auto 1fr;row-gap:0}.hero__intro{grid-column:1;grid-row:1}.hero__more{grid-column:1;grid-row:2}.hero__grid .stage--hero{grid-column:2;grid-row:1/4}}
@media (max-width:959px){.hero__intro>:last-child{margin-bottom:0}}
.lead{font-size:clamp(18px,1.9vw,21px);line-height:1.5;max-width:34em;margin-bottom:24px;text-wrap:pretty}
.rows>div{display:flex;justify-content:space-between;gap:16px;padding:12px 0;border-top:2px solid var(--line)}
.rows dt{color:var(--sec);font-weight:700;font-stretch:75%;text-transform:uppercase;letter-spacing:.06em;font-size:14px;padding-top:2px}
.rows dd{font-weight:700;text-align:right}
.rows--stack>div{display:grid;gap:2px}
.rows--stack dd{text-align:left;font-weight:500}
@media (max-width:520px){.rows>div{display:grid;gap:2px}.rows dd{text-align:left}}
.stage{position:relative;background:var(--raised);overflow:hidden}
.stage video{display:block;width:100%;height:auto;background:var(--ground)}
.stage .hero__tall{display:none}
@media (max-width:700px){.stage .hero__wide{display:none}.stage .hero__tall{display:block}.stage--hero{max-width:420px;margin:0 auto;width:100%}}
.stage--hero figcaption{padding:12px 16px;font-size:14px;color:var(--sec);border-top:2px solid var(--line)}
.toc{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px}
.toc a{display:inline-block;padding:8px 14px;background:var(--raised);font-size:14px;font-weight:800;font-stretch:75%;letter-spacing:.06em;text-transform:uppercase;text-decoration:none}
.toc a:hover{background:var(--ink);color:var(--ground)}
.sec{padding:clamp(40px,7vw,88px) 0;border-top:2px solid var(--line);scroll-margin-top:12px}
.sec__head{display:grid;gap:14px;margin-bottom:clamp(24px,3vw,36px)}
.sec__num{font-size:13px;font-weight:800;font-stretch:75%;letter-spacing:.1em;text-transform:uppercase;color:var(--sec)}
.sec h2{font-size:clamp(32px,5.4vw,72px);line-height:1.02;text-wrap:balance}
.sec h3{font-size:20px;line-height:1.2;font-weight:900;font-stretch:100%;text-transform:uppercase;margin-bottom:14px}
.intro{font-size:clamp(17px,1.6vw,19px);max-width:44em;color:var(--ink);text-wrap:pretty}
.cols{display:grid;gap:24px}
@media (min-width:900px){.cols{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:40px;align-items:start}}
.prose{display:grid;gap:14px;max-width:38em}
.prose p{text-wrap:pretty}
.card{background:var(--raised);padding:clamp(18px,2.4vw,28px)}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px}
.chips li{padding:8px 14px;border:2px solid var(--ink);font-weight:800;font-stretch:75%;text-transform:uppercase;letter-spacing:.06em;font-size:14px}
.swatches{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
.swatch{display:grid;gap:2px;font-size:14px}
.swatch__chip{display:block;height:64px;box-shadow:inset 0 0 0 2px var(--line);margin-bottom:8px}
.swatch b{font-size:15px}
.swatch span:not(.swatch__chip){color:var(--sec)}
.axis{display:grid;gap:6px}
.axis p{font-weight:900;font-size:clamp(28px,7vw,64px);line-height:.95;white-space:nowrap;overflow:hidden}
.axis small{display:block;font:700 13px/1.4 var(--font);font-stretch:75%;letter-spacing:.06em;color:var(--sec);margin-bottom:8px;white-space:normal}
.weights{display:grid;gap:4px;margin-top:18px;padding-top:16px;border-top:2px solid var(--line)}
.weights p{font-size:19px;line-height:1.3}
.weights small{color:var(--sec);font-size:13px;font-weight:600;margin-left:8px}
.list{display:grid;gap:10px;margin-top:4px}
.list li{position:relative;padding-left:24px}
.list li::before{content:'';position:absolute;left:0;top:.5em;width:12px;height:12px;background:var(--ink)}
.board{margin:24px 0}
.board img{width:100%;background:#000;box-shadow:0 0 0 2px var(--line)}
.shots,.files{background:var(--raised);margin-top:16px;overflow:hidden}
.shots table,.files table{width:100%;border-collapse:collapse;font-size:15px;line-height:1.45}
@media (max-width:960px){.shots thead,.files thead{display:none}.shots table,.shots tbody,.shots tr,.shots th,.shots td,.files table,.files tbody,.files tr,.files th,.files td{display:block}.shots tr,.files tr{padding:12px 4px;border-top:2px solid var(--line)}.shots tr:first-child,.files tr:first-child{border-top:0}.szt .shots th,.szt .shots td,.szt .files th,.szt .files td{border-top:0;padding:4px 16px}.shots td[data-label]::before,.files td[data-label]::before{content:attr(data-label);display:block;margin-top:4px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--sec);font-weight:800;font-stretch:75%}.num{white-space:normal}}
.files caption{text-align:left;padding:16px 16px 6px;font-weight:900;font-size:18px;text-transform:uppercase}
@media (max-width:960px){.files caption{display:block;width:auto}}
.szt th,.szt td{text-align:left;vertical-align:top;padding:11px 14px;border-top:2px solid var(--line)}
.szt thead th{border-top:0;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--sec);font-weight:800;font-stretch:75%}
.szt tbody th{font-weight:800}
.num{white-space:nowrap}
.dim{color:var(--sec);font-weight:500}
.file-name{display:block;font-weight:700;overflow-wrap:anywhere}
.files th .dim{display:block;font-size:14px}
.presets>div{display:grid;gap:2px;padding:13px 0;border-top:2px solid var(--line)}
.presets dt{font-weight:900;text-transform:uppercase}
.presets dt span{font-weight:600;color:var(--sec);text-transform:none}
.presets dd{font-size:15px;color:var(--sec)}
.presets code{font:700 14px/1.5 var(--font);color:var(--ink);overflow-wrap:anywhere}
.metro{background:var(--raised);padding:clamp(16px,2.6vw,32px);display:grid;gap:22px}
@media (min-width:900px){.metro{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);align-items:center}.metro__beats,.metro__controls{grid-column:1/-1}}
.metro__beats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.metro__beats span{display:grid;place-items:center;height:56px;border:2px solid var(--line);font-weight:900;font-size:24px;font-stretch:75%;color:var(--sec)}
.metro__beats .is-on{background:var(--ink);border-color:var(--ink);color:var(--ground)}
.metro__lanes{display:grid;gap:18px}
.metro__label{font-size:15px;margin-bottom:8px;overflow-wrap:anywhere}
.metro__label b{font-weight:900;text-transform:uppercase;margin-right:6px}
.metro__track{height:44px;background:var(--ground);box-shadow:inset 0 0 0 2px var(--line);overflow:hidden}
.metro__bar{display:block;height:100%;background:var(--ink);transform-origin:0 50%}
.metro__bar--slam{background:var(--signal)}
.metro__plot{width:100%;height:auto}
.metro__grid{stroke:var(--line);stroke-width:2}
.metro__grid--dash{stroke-dasharray:5 5}
.metro__lin{fill:none;stroke:var(--ink);stroke-width:3}
.metro__slam{fill:none;stroke:var(--signal);stroke-width:4}
.metro__head{stroke:var(--sec);stroke-width:2}
.metro__controls{display:grid;gap:14px;padding-top:18px;border-top:2px solid var(--line)}
.metro__play{justify-self:start;font:900 16px/1 var(--font);font-stretch:100%;text-transform:uppercase;color:var(--ground);background:var(--ink);border:0;padding:16px 22px;cursor:pointer}
.metro__play:hover{background:var(--sec)}
.metro__caption{color:var(--ink);font-size:15px;max-width:52em}
.gallery{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
@media (min-width:760px){.gallery{grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}}
@media (min-width:1100px){.gallery{grid-template-columns:repeat(6,minmax(0,1fr));gap:16px}}
.gallery figure{display:grid;gap:10px;align-content:start}
.gallery img{width:100%;box-shadow:0 0 0 2px var(--line);background:#000}
.gallery b{display:block;font-size:16px;font-weight:900;text-transform:uppercase}
.gallery span{display:block;font-size:14px;color:var(--sec);line-height:1.45}
.formats{display:grid;gap:20px;grid-template-columns:repeat(2,minmax(0,1fr))}
@media (min-width:900px){.formats{grid-template-columns:minmax(0,.9fr) minmax(0,.9fr) minmax(0,1.3fr);align-items:start}}
.formats figure{display:grid;gap:10px;align-content:start}
.formats figcaption{font-size:14px;color:var(--sec)}
.formats figcaption b{display:block;color:var(--ink);font-size:16px;font-weight:900;text-transform:uppercase;font-stretch:75%}
.fmt--wide{grid-column:1/-1;display:grid;gap:20px}
@media (min-width:900px){.fmt--wide{grid-column:auto}}
.cta{margin:clamp(24px,5vw,56px) 0 0;padding:clamp(24px,4vw,48px);background:var(--signal);color:var(--ground);display:grid;gap:18px}
.cta h2{font-size:clamp(30px,4.6vw,60px);line-height:1.02;text-wrap:balance}
.cta p{max-width:36em;font-weight:600}
.cta a{justify-self:start;display:inline-block;padding:16px 22px;background:var(--ground);color:var(--ink);font-weight:900;text-transform:uppercase;text-decoration:none}
.cta a:hover{background:var(--raised)}
.szt .cta a:focus-visible{outline-color:var(--ground)}
.foot{max-width:1240px;margin:clamp(40px,6vw,64px) auto 0;padding:24px var(--gut) 40px;border-top:2px solid var(--line);font-size:14px;color:var(--sec)}
.foot a{color:var(--ink)}
@media (prefers-reduced-motion:reduce){.szt *{scroll-behavior:auto!important}}
`;
