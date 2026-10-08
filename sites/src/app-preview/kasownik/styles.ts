export const styles = `
:root{color-scheme:light;--brand:#00864f;--deep:#006b3f;--tint:#e3f4ec;--ink:#101418;--sec:#5b6470;--line:#e4e7eb;--ground:#f2f4f6;--card:#fff;--skip-bg:#00864f;--skip-fg:#fff;--gut:clamp(16px,4vw,40px);--r:20px;--shadow:0 1px 2px rgba(16,20,24,.05),0 8px 28px rgba(16,20,24,.06);--font:'Onest',system-ui,'Segoe UI',Roboto,Arial,sans-serif}
body.kas{background:var(--ground);color:var(--ink);font:400 17px/1.55 var(--font);font-feature-settings:'tnum'}
.kas :where(h1,h2,h3,p,figure,dl,dd,ul,ol,table){margin:0}
.kas :where(ul,ol){padding:0;list-style:none}
.kas a{color:var(--brand);text-underline-offset:3px}
.kas a:focus-visible,.kas button:focus-visible,.kas input:focus-visible,.kas [tabindex]:focus-visible{outline:3px solid var(--brand);outline-offset:3px;border-radius:6px}
.kas img{display:block;height:auto}
.top{display:flex;justify-content:space-between;gap:16px;max-width:1160px;margin:0 auto;padding:18px var(--gut);font-weight:500;font-size:16px}
.top a{text-decoration:none}
.top a:hover{text-decoration:underline}
.kas main{display:block;max-width:1160px;margin:0 auto;padding:0 var(--gut)}
.hero{display:grid;gap:clamp(24px,4vw,48px);padding:clamp(16px,4vw,48px) 0 clamp(40px,6vw,72px);align-items:center}
@media (min-width:960px){.hero{grid-template-columns:minmax(0,5fr) minmax(0,7fr);grid-template-rows:1fr auto auto 1fr;row-gap:0}.hero__intro{grid-column:1;grid-row:2}.hero__more{grid-column:1;grid-row:3}.hero .stage--hero{grid-column:2;grid-row:1/5}}
@media (max-width:959px){.hero__intro>:last-child{margin-bottom:0}}
.kicker{font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--deep);margin-bottom:12px}
.hero__icon{width:clamp(56px,7vw,76px);height:auto;border-radius:22%;box-shadow:0 8px 20px rgba(0,134,79,.22);margin-bottom:18px}
.hero h1{font-size:clamp(46px,10vw,76px);line-height:1;font-weight:800;letter-spacing:-.035em;margin-bottom:20px}
@media (min-width:960px){.hero h1{font-size:clamp(56px,5.4vw,76px)}}
.lead{font-size:clamp(18px,1.9vw,21px);line-height:1.5;color:var(--sec);max-width:34em;margin-bottom:24px;text-wrap:pretty}
.group{background:var(--card);border-radius:var(--r);box-shadow:var(--shadow);overflow:hidden}
.rows>div{display:flex;justify-content:space-between;gap:16px;padding:13px 18px;border-top:1px solid var(--line)}
.rows>div:first-child{border-top:0}
.rows dt{color:var(--sec)}
.rows dd{font-weight:600;text-align:right}
.rows--stack>div{display:grid;gap:2px}
@media (max-width:520px){.rows>div{display:grid;gap:2px}.rows dd{text-align:left}}
.rows--stack dd{text-align:left;font-weight:500}
.stage{position:relative;border-radius:28px;background:var(--card);box-shadow:var(--shadow);overflow:hidden}
.stage video{display:block;width:100%;height:auto;background:var(--ground)}
.stage .hero__tall{display:none}
@media (max-width:700px){.stage .hero__wide{display:none}.stage .hero__tall{display:block}.stage--hero{max-width:420px;margin:0 auto;width:100%}}
.stage figcaption{padding:12px 18px;font-size:14px;color:var(--sec);border-top:1px solid var(--line)}
.toc{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px}
.toc a{display:inline-block;padding:7px 14px;border-radius:999px;background:var(--card);box-shadow:0 1px 2px rgba(16,20,24,.06);font-size:15px;font-weight:600;text-decoration:none}
.toc a:hover{background:var(--tint)}
.sec{padding:clamp(36px,6vw,72px) 0;border-top:1px solid var(--line);scroll-margin-top:12px}
.sec__head{display:grid;gap:12px;margin-bottom:clamp(20px,3vw,32px);max-width:46rem}
.sec__num{font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--deep)}
.sec h2{font-size:clamp(30px,4.4vw,48px);line-height:1.08;font-weight:800;letter-spacing:-.025em;text-wrap:balance}
.sec h3{font-size:20px;line-height:1.3;font-weight:700;letter-spacing:-.01em;margin-bottom:12px}
.intro{font-size:clamp(17px,1.6vw,19px);color:var(--sec);text-wrap:pretty}
.cols{display:grid;gap:20px}
@media (min-width:900px){.cols{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:28px;align-items:start}}
.prose{display:grid;gap:14px;max-width:38em}
.prose p{text-wrap:pretty}
.card{background:var(--card);border-radius:var(--r);box-shadow:var(--shadow);padding:clamp(18px,2.4vw,28px)}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
.chips li{padding:8px 14px;border-radius:999px;background:var(--tint);color:var(--deep);font-weight:700;font-size:15px}
.swatches{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
.swatch{display:grid;gap:2px;font-size:14px}
.swatch__chip{display:block;height:64px;border-radius:14px;box-shadow:inset 0 0 0 1px rgba(16,20,24,.08);margin-bottom:8px}
.swatch b{font-size:15px}
.swatch span:not(.swatch__chip){color:var(--sec)}
.type{display:grid;gap:10px}
.type p{line-height:1.2;overflow-wrap:anywhere}
.type small{display:block;font-size:13px;color:var(--sec);font-weight:500;margin-top:2px}
.list{display:grid;gap:10px;margin-top:16px}
.list li{position:relative;padding-left:22px}
.list li::before{content:'';position:absolute;left:2px;top:.55em;width:9px;height:9px;border-radius:50%;background:var(--brand)}
.board{margin:20px 0}
.board img{width:100%;border-radius:var(--r);box-shadow:var(--shadow);background:#fff}
.shots,.files{background:var(--card);border-radius:var(--r);box-shadow:var(--shadow);margin-top:16px;overflow:hidden}
.shots table,.files table{width:100%;border-collapse:collapse;font-size:15px;line-height:1.45}
@media (max-width:960px){.shots thead,.files thead{display:none}.shots table,.shots tbody,.shots tr,.shots th,.shots td,.files table,.files tbody,.files tr,.files th,.files td{display:block}.shots tr,.files tr{padding:12px 4px;border-top:1px solid var(--line)}.shots tr:first-child,.files tr:first-child{border-top:0}.kas .shots th,.kas .shots td,.kas .files th,.kas .files td{border-top:0;padding:4px 18px}.shots td[data-label]::before,.files td[data-label]::before{content:attr(data-label);display:block;margin-top:4px;font-size:12px;letter-spacing:.04em;text-transform:uppercase;color:var(--sec);font-weight:700}.num{white-space:normal}}
.files caption{text-align:left;padding:16px 18px 6px;font-weight:700;font-size:17px}
@media (max-width:960px){.files caption{display:block;width:auto}}
.kas th,.kas td{text-align:left;vertical-align:top;padding:11px 14px;border-top:1px solid var(--line)}
.kas thead th{border-top:0;font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:var(--sec);font-weight:700}
.kas tbody th{font-weight:700}
.num{white-space:nowrap}
.dim{color:var(--sec);font-weight:400}
.file-name{display:block;font-weight:600;overflow-wrap:anywhere}
.files th .dim{display:block;font-size:14px}
.presets{margin-top:20px}
.presets>div{display:grid;gap:2px;padding:13px 18px;border-top:1px solid var(--line)}
.presets>div:first-child{border-top:0}
.presets dt{font-weight:700}
.presets dt span{font-weight:500;color:var(--sec)}
.presets dd{font-size:15px;color:var(--sec)}
.presets code{font:600 14px/1.5 var(--font);color:var(--ink);overflow-wrap:anywhere}
.lab{background:var(--card);border-radius:var(--r);box-shadow:var(--shadow);padding:clamp(16px,2.4vw,28px)}
.lab__lanes{display:grid;gap:20px}
@media (min-width:640px){.lab__lanes{grid-template-columns:1fr 1fr}}
.lab__lane{display:grid;grid-template-columns:96px minmax(0,1fr);gap:16px;align-items:center}
.lab__phone{position:relative;width:96px;height:180px;border-radius:22px;background:var(--ground);box-shadow:inset 0 0 0 5px #0e1114;overflow:hidden}
.lab__sheet{position:absolute;left:5px;right:5px;bottom:5px;height:110px;border-radius:14px 14px 18px 18px;background:#fff;box-shadow:0 -4px 14px rgba(16,20,24,.12);display:grid;align-content:start;gap:7px;padding:8px 10px}
.lab__grab{justify-self:center;width:22px;height:4px;border-radius:2px;background:#d4d8dd}
.lab__line{height:6px;border-radius:3px;background:var(--line);width:70%}
.lab__line--title{width:50%;height:8px;background:#c9ced4}
.lab__btn{height:16px;border-radius:6px;background:var(--brand);margin-top:6px}
.lab__plot{width:100%;height:auto;grid-column:2}
.lab__curve{fill:none;stroke:var(--brand);stroke-width:3;stroke-linejoin:round}
.lab__ghost{fill:none;stroke:#c9ced4;stroke-width:2;stroke-dasharray:5 5}
.lab__target{stroke:var(--line);stroke-width:1.5;stroke-dasharray:4 4}
.lab__dot{fill:var(--ink)}
.lab__lane figcaption{grid-column:1/-1;display:grid;gap:2px;font-size:15px}
.lab__lane figcaption span{color:var(--sec)}
.lab__controls{display:flex;flex-wrap:wrap;gap:14px 24px;align-items:center;margin-top:20px;padding-top:18px;border-top:1px solid var(--line)}
.lab__slider{display:grid;gap:6px;flex:1 1 240px;font-weight:600;font-size:15px}
.lab__slider input{width:100%;accent-color:var(--brand)}
.lab__play{font:600 16px/1 var(--font);color:#fff;background:var(--brand);border:0;border-radius:14px;padding:14px 20px;cursor:pointer}
.lab__play:hover{background:var(--deep)}
.lab__caption{margin-top:14px;color:var(--sec);font-size:15px}
.gallery{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
@media (min-width:760px){.gallery{grid-template-columns:repeat(4,minmax(0,1fr));gap:20px}}
.gallery figure{display:grid;gap:10px;align-content:start}
.gallery img{width:100%;border-radius:22px;box-shadow:var(--shadow);background:#fff}
.gallery b{display:block;font-size:16px}
.gallery span{display:block;font-size:14px;color:var(--sec);line-height:1.45}
.formats{display:grid;gap:20px;grid-template-columns:repeat(2,minmax(0,1fr))}
@media (min-width:900px){.formats{grid-template-columns:minmax(0,.9fr) minmax(0,.9fr) minmax(0,1.3fr);align-items:start}}
.formats figure{display:grid;gap:10px;align-content:start}
.formats .stage{border-radius:22px}
.formats figcaption{font-size:14px;color:var(--sec)}
.formats figcaption b{display:block;color:var(--ink);font-size:16px}
.fmt--wide{grid-column:1/-1}
@media (min-width:900px){.fmt--side{display:grid;gap:20px}.fmt--wide{grid-column:auto}}
.cta{margin:clamp(24px,5vw,56px) 0 0;padding:clamp(24px,4vw,44px);border-radius:28px;background:var(--brand);color:#fff;display:grid;gap:16px;max-width:52rem}
.cta h2{font-size:clamp(28px,4vw,42px);line-height:1.1;font-weight:800;letter-spacing:-.02em;text-wrap:balance}
.cta p{max-width:36em;color:#fff}
.cta a{justify-self:start;display:inline-block;padding:14px 22px;border-radius:14px;background:#fff;color:var(--deep);font-weight:700;text-decoration:none}
.cta a:hover{background:var(--tint)}
.kas .cta a:focus-visible{outline-color:#fff}
.foot{max-width:1160px;margin:clamp(40px,6vw,64px) auto 0;padding:24px var(--gut) 40px;border-top:1px solid var(--line);font-size:14px;color:var(--sec)}
@media (prefers-reduced-motion:reduce){.kas *{scroll-behavior:auto!important}}
`;
