export const styles = `
:root{color-scheme:light;--czern:#0a0a0a;--biel:#fff;--kobalt:#1f4bff;--papier:#f4f4f2;--mgla:#e6e6e3;--szary:#bdbdb9;--beton:#8a8a86;--grafit:#5a5a57;--asfalt:#2b2b2a;--skip-bg:#0a0a0a;--skip-fg:#fff;--m:clamp(16px,3.5vw,48px);--g:clamp(8px,1.4vw,24px);--text:'Rzut Sans','Helvetica Neue',Arial,sans-serif;--cond:'Rzut Condensed','Arial Narrow',Arial,sans-serif}
body.rzut{margin:0;background:var(--biel);color:var(--czern);font:400 17px/1.55 var(--text);font-feature-settings:'kern'}
.rzut a{color:var(--kobalt);text-underline-offset:3px}
.rzut .skip{color:var(--skip-fg)}
.rzut a:focus-visible,.rzut button:focus-visible,.rzut summary:focus-visible,.rzut input:focus-visible{outline:3px solid var(--kobalt);outline-offset:3px}
.rzut :where(h1,h2,h3,h4,p,figure,dl,dd,ul,ol){margin:0}
.rzut :where(ul,ol){padding:0;list-style:none}
.rzut img{display:block;height:auto}
.cn{font-family:var(--cond);font-variant-numeric:tabular-nums}
.lbl{font:700 14px/1.3 var(--cond);letter-spacing:.07em;text-transform:uppercase}
.lines{position:fixed;inset:0;z-index:0;pointer-events:none;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));column-gap:var(--g);max-width:1440px;margin:0 auto;padding:0 var(--m)}
.lines span{border-left:1px solid var(--mgla);border-right:1px solid var(--mgla)}
.lines span:nth-child(n+5){display:none}
@media (min-width:900px){.lines{grid-template-columns:repeat(12,minmax(0,1fr))}.lines span:nth-child(n+5){display:block}}
.top,.rzut main,.foot,.cta{position:relative;z-index:1}
.top{display:flex;justify-content:space-between;gap:16px;max-width:1440px;margin:0 auto;padding:20px var(--m)}
.top a{color:var(--czern);font:700 14px/1.3 var(--cond);letter-spacing:.07em;text-transform:uppercase;text-decoration:none;border-bottom:2px solid var(--czern)}
.rzut main{display:block;max-width:1440px;margin:0 auto;padding:0 var(--m)}
.x{grid-column:1/-1;min-width:0}
@media (min-width:900px){.x{grid-column:var(--col,1/-1)}}
.kicker{font:700 14px/1.4 var(--cond);letter-spacing:.07em;text-transform:uppercase;color:var(--grafit);margin-bottom:20px}
.hero,.sec{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));column-gap:var(--g);row-gap:clamp(20px,3vw,40px)}
@media (min-width:900px){.hero,.sec{grid-template-columns:repeat(12,minmax(0,1fr))}}
.hero{padding:clamp(24px,5vw,72px) 0 clamp(40px,7vw,96px);align-items:start}
.hero__mark{width:56px;height:56px;margin-bottom:28px}
.hero h1{font:700 clamp(100px,30vw,300px)/.82 var(--text);letter-spacing:-.045em;margin:0 0 28px -.04em}
@media (min-width:900px){.hero h1{font-size:clamp(140px,16.6vw,240px)}}
.hero__lead{font:500 clamp(22px,2.6vw,32px)/1.25 var(--text);max-width:19em;margin-bottom:32px}
.hero__lead{margin-bottom:28px}
.hero__cta{display:flex;flex-wrap:wrap;gap:12px}
.btn{display:inline-block;border:2px solid var(--czern);color:var(--czern)!important;background:var(--biel);padding:14px 20px;font:700 14px/1.2 var(--cond);letter-spacing:.07em;text-transform:uppercase;text-decoration:none}
.btn:hover{background:var(--czern);color:var(--biel)!important}
.btn--solid{background:var(--kobalt);border-color:var(--kobalt);color:#fff!important}
.btn--solid:hover{background:var(--czern);border-color:var(--czern)}
.hero__plate img{width:100%;aspect-ratio:1900/1290;object-fit:cover;object-position:top;border:2px solid var(--czern)}
.hero__plate figcaption{margin-top:12px;color:var(--grafit);font-size:15px}
.hero__facts{display:grid;gap:0 var(--g);grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}
.hero__facts div{border-top:2px solid var(--czern);padding:10px 0 12px}
.hero__facts dt{color:var(--grafit);margin-bottom:4px}
.jump{position:sticky;top:0;z-index:5;background:var(--biel);border-top:2px solid var(--czern);border-bottom:2px solid var(--czern);margin:0 calc(-1*var(--m));padding:0 var(--m)}
.jump ul{display:flex;gap:6px 24px;overflow-x:auto;white-space:nowrap;padding:12px 0}
.jump a{color:var(--czern);font:700 14px/1.3 var(--cond);letter-spacing:.07em;text-transform:uppercase;text-decoration:none;border-bottom:2px solid transparent}
.jump a:hover{border-color:var(--kobalt)}
.jump__zip{margin-left:auto}
.jump__zip a{color:var(--kobalt);border-bottom-color:var(--kobalt)}
.sec{scroll-margin-top:56px}
.scroll-hint{margin-bottom:8px}
@media (min-width:760px){.scroll-hint{display:none}}
.plate{border:2px solid var(--czern);background:var(--biel);padding:clamp(12px,2vw,28px)}
.plate img{width:100%}
.plate figcaption{margin-top:14px;border-top:2px solid var(--czern);padding-top:10px;color:var(--grafit);font-size:15px}
.sec{border-top:2px solid var(--czern);padding:clamp(28px,5vw,64px) 0 clamp(36px,6vw,80px);align-items:start}
.sec__num{grid-column:1/-1;font:700 clamp(56px,9vw,120px)/.8 var(--cond);letter-spacing:-.01em;color:var(--czern)}
.sec__head{grid-column:1/-1}
@media (min-width:900px){.sec__num{grid-column:1/span 2}.sec__head{grid-column:3/span 10}}
.sec h2{font:700 clamp(34px,5.2vw,68px)/1.04 var(--text);letter-spacing:-.02em;max-width:16em}
.sec h3{font:700 clamp(22px,2.4vw,30px)/1.15 var(--text);letter-spacing:-.01em}
.sec .lead{font:500 clamp(19px,2vw,25px)/1.4 var(--text);max-width:34em;margin-top:18px;color:var(--asfalt)}
.prose{display:grid;gap:16px;max-width:36em}
.prose p{font-size:clamp(17px,1.6vw,20px);line-height:1.55}
.facts{display:grid;gap:0}
.facts div{border-top:2px solid var(--czern);padding:10px 0 14px}
.facts dt{color:var(--grafit);margin-bottom:4px}
.facts dd{font-size:18px}
.keywords{display:grid;gap:0}
.keywords span{font:700 clamp(44px,7vw,104px)/1 var(--cond);text-transform:uppercase;letter-spacing:-.01em;border-top:2px solid var(--czern);padding-top:6px}
.values{display:grid;gap:var(--g)}
.values li{border-top:2px solid var(--czern);padding-top:12px}
.values .idx{display:block;color:var(--kobalt);font:700 18px/1 var(--cond);margin-bottom:10px}
.values p{margin-top:8px}
.quote{font:500 clamp(22px,2.6vw,34px)/1.28 var(--text);border-top:2px solid var(--czern);padding-top:14px;max-width:24em}
.words{display:flex;flex-wrap:wrap;gap:0 .5em;font:700 clamp(40px,6vw,88px)/1.05 var(--text);letter-spacing:-.03em}
.dirs{display:grid;gap:var(--g)}
.dir{display:grid;gap:12px;align-content:start;border-top:2px solid var(--czern);padding-top:12px}
.dir__tag{color:var(--grafit)}
.dir--chosen{border-top-color:var(--kobalt);border-top-width:6px;padding-top:8px}
.dir--chosen .dir__tag{color:var(--kobalt)}
.dir__thumb{background:var(--papier)}
.dir__thumb img{width:100%}
.dir h3{display:flex;gap:10px;align-items:baseline}
.dir__what{color:var(--grafit)}
.steps{display:grid;gap:var(--g);counter-reset:step}
.steps li{border-top:2px solid var(--czern);padding-top:12px;display:grid;gap:6px;align-content:start}
.steps .idx{color:var(--kobalt);font:700 18px/1 var(--cond)}
.pair{display:grid;gap:var(--g)}
.pair figure{display:grid;gap:8px}
.pair img{width:100%;border:2px solid var(--mgla);background:var(--biel)}
.pair figcaption,.cap{color:var(--grafit);font-size:15px}
@media (min-width:760px){.values,.dirs,.steps{grid-template-columns:repeat(3,minmax(0,1fr))}.pair,.faces{grid-template-columns:repeat(2,minmax(0,1fr))}}
.facts--row{grid-template-columns:repeat(auto-fit,minmax(200px,1fr));column-gap:var(--g)}
.tiles{display:grid;grid-template-columns:1fr;gap:var(--g)}
@media (min-width:640px){.tiles{grid-template-columns:repeat(2,1fr)}}
@media (min-width:900px){.tiles{grid-template-columns:repeat(3,1fr)}}
.vt{margin:0;border:2px solid var(--mgla);display:grid;grid-template-rows:200px auto}
.vt__stage{display:flex;align-items:center;justify-content:center;padding:20px}
.vt__stage img{max-width:100%;max-height:150px;width:auto}
.vt figcaption{display:grid;gap:2px;padding:12px 14px 14px;background:var(--biel);color:var(--grafit);font-size:15px}
.vt figcaption b{color:var(--czern)}
.ground-papier{background:var(--papier)}
.ground-biel{background:var(--biel)}
.ground-czern{background:var(--czern)}
.fig{border:2px solid var(--mgla);background:var(--biel);padding:clamp(8px,2vw,24px)}
.fig img{width:100%}
.sizes{display:flex;flex-wrap:wrap;align-items:flex-end;gap:20px 32px;border:2px solid var(--mgla);padding:20px}
.sizes figure{display:grid;gap:8px;justify-items:start}
.bar{display:flex;height:clamp(120px,22vw,280px);border:2px solid var(--czern)}
.bar div{display:flex;align-items:flex-end;padding:10px 12px}
.bar .lbl{font-size:13px}
.bar-biel{background:var(--biel);color:var(--czern)}
.bar-czern{background:var(--czern);color:var(--biel)}
.bar-kobalt{background:var(--kobalt);color:var(--biel)}
.tbl-wrap{overflow-x:auto;border:2px solid var(--czern)}
.tbl{border-collapse:collapse;width:100%;min-width:640px;font-size:15px;line-height:1.35}
.tbl th,.tbl td{text-align:left;padding:8px 12px;border-top:1px solid var(--mgla);vertical-align:middle;font-weight:400}
.tbl thead th{font:700 13px/1.3 var(--cond);letter-spacing:.07em;text-transform:uppercase;color:var(--grafit);border-top:0;background:var(--papier)}
.tbl tbody th{font-weight:700;white-space:nowrap}
.tbl__chip{display:inline-block;width:20px;height:20px;margin-right:10px;vertical-align:-5px;border:2px solid var(--czern)}
.tbl__pair{display:inline-block;padding:2px 8px;margin-right:8px;font-weight:700;border:1px solid var(--szary)}
details.more{border-top:2px solid var(--czern);margin-top:var(--g)}
details.more summary{cursor:pointer;padding:14px 0;font:700 14px/1.3 var(--cond);letter-spacing:.07em;text-transform:uppercase}
details.more[open] summary{margin-bottom:12px}
.faces{display:grid;gap:var(--g)}
.face{border-top:2px solid var(--czern);padding-top:12px;display:grid;gap:12px;align-content:start}
.face__mega{font-size:clamp(110px,16vw,220px);line-height:.85;font-weight:700;letter-spacing:-.03em}
.face__specimen{font-size:clamp(22px,2.6vw,32px);line-height:1.25}
.weights{display:grid;gap:2px;font-size:clamp(24px,3vw,36px);line-height:1.2}
.scale{display:grid;gap:0}
.scale li{display:grid;gap:4px 32px;border-top:1px solid var(--szary);padding:12px 0;align-items:baseline}
@media (min-width:760px){.scale li{grid-template-columns:minmax(0,1fr) 20em}}
.scale .meta{color:var(--grafit);font-size:15px}
.glyphs{font:700 clamp(26px,4vw,52px)/1.25 var(--text);overflow-wrap:anywhere}
.gt{display:grid;gap:16px}
.gt__controls{display:grid;gap:16px 28px;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));align-items:start}
.gt fieldset{margin:0;padding:10px 0 0;border:0;border-top:2px solid var(--czern);display:flex;flex-wrap:wrap;gap:6px 18px;min-width:0}
.gt legend{padding:0;font:700 13px/1.3 var(--cond);letter-spacing:.07em;text-transform:uppercase;color:var(--grafit);margin-bottom:6px;float:left;width:100%}
.gt label{display:flex;align-items:center;gap:8px;font-size:16px;min-height:32px}
.gt input[type=radio],.gt input[type=checkbox]{accent-color:var(--kobalt);width:18px;height:18px;margin:0}
.gt__range{display:grid!important;gap:4px;align-items:start!important;border-top:2px solid var(--czern);padding-top:10px}
.gt__range input{width:100%;accent-color:var(--kobalt)}
.gt__stage{position:relative;border:2px solid var(--czern);background:var(--biel);overflow:hidden}
.gt__cols{position:absolute;inset:0;display:grid}
.gt__cols span{background:var(--papier);border-left:1px solid var(--szary);border-right:1px solid var(--szary);font:700 12px/1 var(--cond);color:var(--grafit);padding:4px 0 0 4px;overflow:hidden}
.gt__logo{position:absolute}
.gt__logo img{width:100%;height:100%;position:relative}
.gt__clear{position:absolute;border:1px dashed var(--kobalt);background:rgba(31,75,255,.06)}
.gt__readout{font-size:17px}
.gt__readout .is-ok{color:var(--czern)}
.gt__readout .is-small{color:var(--czern);text-decoration:underline;text-decoration-color:var(--kobalt);text-decoration-thickness:3px}
.rules{display:grid;gap:0}
.rules li{display:grid;grid-template-columns:3em 1fr;border-top:2px solid var(--czern);padding:10px 0 12px;font-size:18px}
.rules .idx{color:var(--kobalt);font:700 18px/1.4 var(--cond)}
.icons{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--g)}
@media (min-width:640px){.icons{grid-template-columns:repeat(4,1fr)}}
@media (min-width:900px){.icons{grid-template-columns:repeat(6,1fr)}}
.icons li{display:grid;gap:8px;justify-items:center}
.icons .cell{width:100%;aspect-ratio:1;display:flex;align-items:center;justify-content:center;border:2px solid var(--mgla);background-color:var(--biel);background-image:linear-gradient(var(--mgla) 1px,transparent 1px),linear-gradient(90deg,var(--mgla) 1px,transparent 1px);background-size:24px 24px}
.icons li{min-width:0}
.icons img{width:min(96px,100%);height:auto;aspect-ratio:1}
.icons .lbl{color:var(--grafit);font-size:13px;justify-self:start}
.pattern{aspect-ratio:3/2;border:2px solid var(--mgla);background-color:var(--biel);background-size:240px}
.gfx{display:grid;gap:0}
.gfx li{border-top:2px solid var(--czern);padding:12px 0 18px;display:grid;gap:6px}
.tone{display:grid;gap:var(--g)}
@media (min-width:760px){.tone{grid-template-columns:repeat(2,1fr)}}
.tone article{border-top:2px solid var(--czern);padding-top:12px;display:grid;gap:8px;align-content:start}
.tone .yes .tag{color:var(--kobalt)}
.tone .no{color:var(--grafit);text-decoration:line-through}
.tone .tag{display:inline-block;margin-right:8px;text-decoration:none}
.gallery{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--g)}
@media (min-width:900px){.gallery{grid-template-columns:repeat(12,minmax(0,1fr))}}
.shot{grid-column:1/-1;display:grid;gap:10px;align-content:start;min-width:0}
.shot-row{display:contents}
.shot img{width:100%;border:2px solid var(--mgla)}
.shot__zoom{display:block}
.shot figcaption{display:grid;gap:2px;font-size:15px;color:var(--grafit)}
.shot figcaption strong{color:var(--czern);font-size:17px}
.printbox{grid-column:1/-1;border-top:6px solid var(--czern);background:var(--papier);padding:18px 20px 22px;display:grid;gap:14px;align-content:start}
.printbox ul{display:grid;gap:0}
.printbox li{display:grid;gap:2px;border-top:1px solid var(--szary);padding:12px 0;font-size:16px;color:var(--grafit)}
.printbox a{font:700 18px/1.25 var(--text)}
@media (min-width:900px){
.shot--karta-awers,.shot--karta-rewers{grid-column:span 6}
.shot-row{grid-column:1/-1;display:flex;gap:var(--g);align-items:flex-start}
.shot-row .shot{flex:var(--ar) 1 0}
.shot--podpis{grid-column:span 8}
.printbox{grid-column:span 4;align-self:stretch}
}
.posts{display:grid;grid-template-columns:repeat(2,1fr);gap:var(--g)}
@media (min-width:900px){.posts{grid-template-columns:repeat(4,1fr)}}
.posts li{display:grid;gap:8px;align-content:start}
.posts img{width:100%;border:2px solid var(--mgla)}
.posts span{color:var(--grafit);font-size:15px}
.film-box{max-width:640px}
.motion__stage{border:2px solid var(--czern);background:var(--biel)}
.motion__stage svg{display:block;width:100%;height:auto}
.motion__replay{margin-top:12px;border:2px solid var(--czern);background:var(--biel);color:var(--czern);padding:12px 18px;font:700 14px/1.2 var(--cond);letter-spacing:.07em;text-transform:uppercase;cursor:pointer}
.motion__replay:hover{background:var(--czern);color:var(--biel)}
.film-links{margin-top:12px}
.muted{color:var(--grafit);font-size:15px}
.avoids{margin-top:20px}
.values,.dirs,.steps{row-gap:28px}
.dl{display:grid;gap:16px}
.dl__zip{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px 20px;align-items:baseline;background:var(--kobalt);color:#fff!important;text-decoration:none;padding:18px 22px;font:700 clamp(20px,2.4vw,28px)/1.2 var(--text)}
.dl__zip:hover{background:var(--czern)}
.dl__zip-size{font:700 18px/1 var(--cond);letter-spacing:.07em;text-transform:uppercase}
.dl__list{display:grid;gap:0;border-top:2px solid var(--czern)}
.dl__row{border-bottom:1px solid var(--szary)}
.dl__row summary{display:grid;grid-template-columns:1fr auto;gap:2px 16px;padding:14px 0;cursor:pointer;list-style:none}
.dl__row summary::-webkit-details-marker{display:none}
.dl__title{font:700 20px/1.2 var(--text)}
.dl__formats{grid-column:1;color:var(--grafit);font-size:15px}
.dl__count{grid-column:2;grid-row:1;font:700 14px/1.3 var(--cond);letter-spacing:.07em;text-transform:uppercase;color:var(--grafit);text-align:right}
.dl__size{grid-column:2;grid-row:2;color:var(--grafit);font-size:15px;text-align:right}
.dl__row details[open] summary .dl__title{color:var(--kobalt)}
.dl__files{display:grid;gap:0;padding:0 0 12px}
.dl__files li{display:grid;grid-template-columns:1fr auto auto;gap:4px 16px;padding:6px 0;border-top:1px solid var(--mgla);font-size:15px;align-items:baseline}
.dl__files a{overflow-wrap:anywhere}
.dl__dim,.dl__bytes{color:var(--grafit);white-space:nowrap}
@media (max-width:640px){.dl__files li{grid-template-columns:1fr auto}.dl__dim{display:none}}
.cta{background:var(--czern);color:var(--biel);padding:clamp(40px,7vw,96px) 0}
.cta__in{max-width:1440px;margin:0 auto;padding:0 var(--m);display:grid;grid-template-columns:repeat(4,minmax(0,1fr));column-gap:var(--g);row-gap:24px}
@media (min-width:900px){.cta__in{grid-template-columns:repeat(12,minmax(0,1fr))}}
.cta h2{font:700 clamp(34px,5.4vw,76px)/1.02 var(--text);letter-spacing:-.025em}
.cta p{font-size:clamp(18px,1.8vw,22px);max-width:30em;color:var(--mgla)}
.cta__link{display:inline-block;background:var(--kobalt);color:#fff!important;padding:16px 26px;font:700 15px/1.2 var(--cond);letter-spacing:.07em;text-transform:uppercase;text-decoration:none;margin-top:10px}
.cta__link:hover{background:var(--biel);color:var(--czern)!important}
.rzut .cta :focus-visible{outline-color:var(--biel)}
.foot{max-width:1440px;margin:0 auto;padding:28px var(--m) 40px;display:grid;gap:6px;color:var(--grafit);font-size:15px;background:var(--biel)}
.foot a{color:var(--czern)}
@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}
`;
