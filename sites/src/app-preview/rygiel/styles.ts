export const styles = `
:root{color-scheme:dark;--void:#05070b;--panel:#0a1018;--grid:#12303a;--dim:#1d4a57;--cyan:#2cf6ff;--text:#d9fbff;--muted:#7fa6b0;--alert:#ff3d71;--warn:#ffb547;--glow:rgba(44,246,255,.38);--glow-alert:rgba(255,61,113,.4);--skip-bg:#2cf6ff;--skip-fg:#05070b;--gut:clamp(16px,4vw,48px);--mono:'Azeret Mono',ui-monospace,'Cascadia Mono','Segoe UI Mono',Menlo,monospace;--display:'Oxanium','Azeret Mono',system-ui,sans-serif}
body.ryg{background-color:var(--void);background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);background-size:24px 24px;background-position:center top;color:var(--text);font:400 16px/1.65 var(--mono);font-feature-settings:'tnum'}
.ryg :where(h1,h2,h3,p,figure,dl,dd,ul,ol,table){margin:0}
.ryg :where(ul,ol){padding:0;list-style:none}
.ryg a{color:var(--cyan);text-underline-offset:4px}
.ryg a:focus-visible,.ryg button:focus-visible,.ryg input:focus-visible,.ryg [tabindex]:focus-visible{outline:2px solid var(--cyan);outline-offset:3px;box-shadow:0 0 0 6px var(--glow)}
.ryg img{display:block;height:auto}
.top{display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px 16px;max-width:1240px;margin:0 auto;padding:18px var(--gut);font-size:13px;letter-spacing:.08em;text-transform:uppercase;background:var(--void);box-shadow:0 1px 0 var(--grid)}
.top a{text-decoration:none}
.top a:hover{text-decoration:underline}
.ryg main{display:block;max-width:1240px;margin:0 auto;padding:0 var(--gut)}
.hero{padding:clamp(28px,5vw,64px) 0 clamp(40px,6vw,72px)}
.hero__grid{display:grid;gap:clamp(28px,4vw,48px);align-items:start}
@media (min-width:960px){.hero__grid{grid-template-columns:minmax(0,5fr) minmax(0,7fr);grid-template-rows:auto auto 1fr;row-gap:0}.hero__intro{grid-column:1;grid-row:1}.hero__more{grid-column:1;grid-row:2}.hero__media{grid-column:2;grid-row:1/4}}
@media (max-width:959px){.hero__intro>:last-child{margin-bottom:0}}
.kicker{text-wrap:balance;font-size:12px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:18px}
.brand{display:flex;align-items:center;gap:clamp(14px,2vw,22px);margin-bottom:clamp(18px,2.4vw,28px)}
.brand img{width:clamp(56px,7vw,84px);border-radius:22%;box-shadow:0 0 0 1.5px var(--dim)}
.ryg h1{font:800 clamp(40px,9vw,120px)/1 var(--display);letter-spacing:.14em;margin-right:-.14em;color:var(--text);text-transform:uppercase}
.lead{font-size:clamp(16px,1.5vw,18px);line-height:1.65;max-width:36em;margin-bottom:24px;text-wrap:pretty}
.rows>div{display:flex;justify-content:space-between;gap:16px;padding:11px 0;border-top:1px solid var(--dim)}
.rows dt{color:var(--muted);font-size:12px;letter-spacing:.12em;text-transform:uppercase;padding-top:3px}
.rows dd{font-weight:700;text-align:right}
.rows--stack>div{display:grid;gap:2px}
.rows--stack dd{text-align:left;font-weight:400}
@media (max-width:560px){.rows>div{display:grid;gap:2px}.rows dd{text-align:left}}
.toc{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px}
.toc a{display:inline-block;padding:8px 12px;background:var(--panel);box-shadow:inset 0 0 0 1px var(--dim);border-radius:3px;font-size:13px;text-decoration:none;color:var(--text)}
.toc a:hover{box-shadow:inset 0 0 0 1px var(--cyan),0 0 12px var(--glow);color:var(--cyan)}
.stage{position:relative;background:var(--void);border-radius:6px;overflow:hidden;box-shadow:inset 0 0 0 1px var(--dim)}
.stage video{display:block;width:100%;height:auto;background:var(--void)}
.stage--neon{box-shadow:0 0 0 1.5px var(--cyan),0 0 22px var(--glow)}
.stage--hero .hero__tall{display:none}
@media (max-width:700px){.stage--hero .hero__wide{display:none}.stage--hero .hero__tall{display:block}.hero__media{max-width:420px;margin:0 auto;width:100%}}
.hero__media figcaption{padding:12px 2px 0;font-size:13px;color:var(--muted)}
.sec{padding:clamp(44px,7vw,92px) 0;border-top:1px solid var(--dim);scroll-margin-top:12px}
.sec__head{display:grid;gap:14px;margin-bottom:clamp(24px,3vw,36px);max-width:62rem}
.sec__num{font-size:12px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--cyan)}
.sec__num::before{content:'';display:inline-block;width:10px;height:10px;margin-right:10px;background:var(--cyan);box-shadow:0 0 8px var(--glow);vertical-align:0}
.sec h2,.cta h2{font:700 clamp(26px,3.6vw,46px)/1.15 var(--mono);letter-spacing:-.02em;text-wrap:balance}
.sec h3{text-wrap:balance;font-size:15px;line-height:1.3;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:16px}
.intro{font-size:clamp(16px,1.4vw,17px);max-width:46em;text-wrap:pretty}
.cols{display:grid;gap:24px}
@media (min-width:900px){.cols{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:40px;align-items:start}}
.prose{display:grid;gap:14px;max-width:40em}
.prose p{text-wrap:pretty}
.card{background:var(--panel);border-radius:4px;box-shadow:inset 0 0 0 1.5px var(--dim);padding:clamp(18px,2.4vw,28px)}
.card--alert{box-shadow:inset 0 0 0 1.5px var(--alert),0 0 18px var(--glow-alert)}
.alert__label{display:flex;align-items:center;gap:10px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--alert)}
.alert__label::before{content:'';width:8px;height:8px;border-radius:50%;background:var(--alert);box-shadow:0 0 8px var(--glow-alert)}
.alert__title{font-size:clamp(19px,2vw,23px);font-weight:700;line-height:1.35;margin:12px 0 14px;text-wrap:balance}
.alert dl>div{display:flex;justify-content:space-between;gap:16px;padding:10px 0;border-top:1px solid rgba(255,61,113,.3);font-size:15px}
.alert dt{color:var(--muted);font-size:12px;letter-spacing:.12em;text-transform:uppercase;padding-top:2px}
.alert dd{text-align:right;font-weight:500}
.alert dd.is-alert{color:var(--alert)}
.alert__note{margin-top:12px!important;font-size:13px;color:var(--muted)}
@media (max-width:420px){.alert dl>div{display:grid;gap:0}.alert dd{text-align:left}}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px}
.chips li{padding:7px 12px;border-radius:3px;box-shadow:inset 0 0 0 1px var(--cyan);font-size:13px;color:var(--cyan)}
.chips li:last-child{box-shadow:inset 0 0 0 1px var(--alert);color:var(--alert)}
.swatches{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
.swatch{display:grid;gap:2px;font-size:13px;align-content:start}
.swatch__chip{display:block;height:56px;border-radius:3px;box-shadow:inset 0 0 0 1px var(--dim);margin-bottom:8px}
.swatch b{font-size:14px}
.swatch span:not(.swatch__chip){color:var(--muted);overflow-wrap:anywhere}
.type{display:grid;gap:14px}
.type__wordmark{font:800 clamp(40px,6vw,64px)/1 var(--display);letter-spacing:.14em;color:var(--cyan);overflow:hidden}
.type__row{display:grid;gap:2px;padding-top:12px;border-top:1px solid var(--grid)}
.type__row p{font-size:18px;line-height:1.35;overflow-wrap:anywhere}
.type__row small{font-size:12px;color:var(--muted);letter-spacing:.06em}
.pass{display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:4px;margin-top:4px}
.pass span{display:grid;place-items:center;aspect-ratio:36/50;background:var(--void);box-shadow:inset 0 0 0 1px var(--dim);border-radius:3px;font-size:clamp(14px,2.4vw,24px);font-weight:500}
.pass .is-sym{color:var(--cyan)}
.contrast{margin-top:18px;font-size:14px;color:var(--muted);max-width:52em}
.list{display:grid;gap:10px;margin-top:4px;max-width:58em}
.list li{position:relative;padding-left:24px}
.list li::before{content:'';position:absolute;left:0;top:.6em;width:10px;height:2px;background:var(--cyan);box-shadow:0 0 6px var(--glow)}
.board{margin:24px 0}
.board img{width:100%;border-radius:6px;box-shadow:0 0 0 1px var(--dim)}
.shots,.files{background:var(--panel);margin-top:16px;overflow:hidden;border-radius:4px;box-shadow:inset 0 0 0 1px var(--dim)}
.shots table,.files table{width:100%;border-collapse:collapse;font-size:14px;line-height:1.5}
@media (max-width:960px){.shots thead,.files thead{display:none}.shots table,.shots tbody,.shots tr,.shots th,.shots td,.files table,.files tbody,.files tr,.files th,.files td{display:block}.shots tr,.files tr{padding:12px 4px;border-top:1px solid var(--dim)}.shots tr:first-child,.files tr:first-child{border-top:0}.ryg .shots th,.ryg .shots td,.ryg .files th,.ryg .files td{border-top:0;padding:4px 16px}.shots td[data-label]::before,.files td[data-label]::before{content:attr(data-label);display:block;margin-top:4px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}.num{white-space:normal}}
.files caption{text-align:left;padding:16px 16px 6px;font-weight:700;font-size:15px;letter-spacing:.1em;text-transform:uppercase;color:var(--cyan)}
@media (max-width:960px){.files caption{display:block;width:auto}}
.ryg th,.ryg td{text-align:left;vertical-align:top;padding:11px 14px;border-top:1px solid var(--dim)}
.ryg thead th{border-top:0;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);font-weight:500}
.ryg tbody th{font-weight:700}
.num{white-space:nowrap}
.dim{color:var(--muted);font-weight:400}
.file-name{display:block;font-weight:700;overflow-wrap:anywhere}
.files th .dim{display:block;font-size:13px;overflow-wrap:anywhere}
.presets>div{display:grid;gap:2px;padding:13px 0;border-top:1px solid var(--dim)}
.presets dt{font-weight:700;color:var(--cyan)}
.presets dt span{font-weight:400;color:var(--muted)}
.presets dd{font-size:14px;color:var(--muted)}
.presets code{font:500 13px/1.55 var(--mono);color:var(--text);overflow-wrap:anywhere}
.lab{background:var(--panel);border-radius:6px;box-shadow:inset 0 0 0 1.5px var(--dim);padding:clamp(16px,2.6vw,30px);display:grid;gap:24px}
.lab__lanes,.lab__pulses{display:grid;gap:18px}
@media (min-width:860px){.lab__lanes,.lab__pulses{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}}
.lab__lane,.lab__pulse{display:grid;gap:12px;align-content:start}
.lab__lane figcaption,.lab__pulse figcaption{display:grid;gap:2px;font-size:13px;color:var(--muted)}
.lab__lane figcaption b,.lab__pulse figcaption b{font-size:15px;color:var(--cyan);letter-spacing:.06em;text-transform:uppercase}
.lab__lane--za-szybki figcaption b,.lab__pulse--bad figcaption b{color:var(--warn)}
.lab__screen{display:grid;gap:10px;padding:16px;background:var(--void);border-radius:4px;box-shadow:inset 0 0 0 1px var(--grid);min-height:112px;align-content:start}
.lab__text{display:block;white-space:pre-wrap;overflow-wrap:anywhere;font-size:clamp(14px,1.6vw,17px);line-height:1.5}
.lab__text:first-child{font-size:clamp(18px,2.2vw,24px);letter-spacing:.06em}
.lab__text .is-hidden{color:transparent}
.lab__text .is-cycling{color:var(--cyan)}
.lab__plot{width:100%;height:auto}
.lab__target{stroke:var(--grid);stroke-width:1.5;stroke-dasharray:4 4}
.lab__curve{fill:none;stroke:var(--cyan);stroke-width:2.5}
.lab__lane--za-szybki .lab__curve,.lab__pulse--bad .lab__curve{stroke:var(--warn)}
.lab__dot{fill:var(--text)}
.lab__head{stroke:var(--muted);stroke-width:1.5}
.lab__box{display:grid;place-items:center;height:64px;border-radius:4px;background:var(--void);color:var(--cyan);font-weight:700;box-shadow:inset 0 0 0 1.5px var(--cyan),0 0 calc(4px + 20px * var(--glow)) rgba(44,246,255,var(--glow))}
.lab__controls{display:grid;gap:16px;padding-top:18px;border-top:1px solid var(--dim)}
@media (min-width:700px){.lab__controls{grid-template-columns:minmax(0,1fr) auto;align-items:end}}
.lab__slider{display:grid;gap:10px;font-size:14px}
.lab__slider output{color:var(--cyan);font-weight:700}
.lab__slider input{width:100%;accent-color:#2cf6ff}
.lab__play{font:700 15px/1 var(--mono);color:var(--void);background:var(--cyan);border:0;border-radius:4px;padding:15px 20px;cursor:pointer;box-shadow:0 0 14px var(--glow)}
.lab__play:hover{background:var(--text)}
.lab__caption{font-size:14px;max-width:56em}
.gallery{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
@media (min-width:760px){.gallery{grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}}
@media (min-width:1100px){.gallery{grid-template-columns:repeat(6,minmax(0,1fr));gap:16px}}
.gallery figure{display:grid;gap:10px;align-content:start}
.gallery img{width:100%;border-radius:6px;box-shadow:0 0 0 1px var(--dim);background:var(--void)}
.gallery b{display:block;font-size:14px;color:var(--cyan)}
@media (max-width:359px){.gallery b{font-size:13px}}
.gallery span{display:block;font-size:13px;color:var(--muted);line-height:1.5}
.formats{display:grid;gap:20px;grid-template-columns:repeat(2,minmax(0,1fr))}
@media (min-width:900px){.formats{grid-template-columns:minmax(0,.9fr) minmax(0,.9fr) minmax(0,1.3fr);align-items:start}}
.formats figure{display:grid;gap:10px;align-content:start}
.formats figcaption{font-size:13px;color:var(--muted)}
.formats figcaption b{display:block;color:var(--text);font-size:14px}
.fmt--wide{grid-column:1/-1;display:grid;gap:20px}
@media (min-width:900px){.fmt--wide{grid-column:auto}}
.cta{margin:clamp(24px,5vw,56px) 0 0;padding:clamp(24px,4vw,48px);background:var(--panel);border-radius:6px;box-shadow:inset 0 0 0 1.5px var(--cyan),0 0 26px var(--glow);display:grid;gap:18px}
.cta p{max-width:40em}
.cta a{justify-self:start;display:inline-block;padding:15px 20px;border-radius:4px;background:var(--cyan);color:var(--void);font-weight:700;text-decoration:none;box-shadow:0 0 14px var(--glow)}
.cta a:hover{background:var(--text)}
.foot{max-width:1240px;margin:clamp(40px,6vw,64px) auto 0;padding:24px var(--gut) 40px;border-top:1px solid var(--dim);font-size:13px;color:var(--muted);background:var(--void)}
.foot a{color:var(--text)}
@media (prefers-reduced-motion:reduce){.ryg *{scroll-behavior:auto!important}}
`;
