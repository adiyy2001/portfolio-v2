const grain = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><filter id="n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="6" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.25 0 0 0 0 0.14 0 0 0 0 0.07 0 0 0 0.9 -0.4"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`,
);

export const css = `
:root{color-scheme:light;--brazowy:#5b2f14;--pomarancz:#ec7424;--musztarda:#e9a81d;--awokado:#7c8a2b;--oliwka:#556020;--rdza:#a64a0d;--krem-jasny:#fbf3df;--krem:#f6e8c8;--piasek:#ead7ae;--len:#cdb27f;--tyton:#9a7447;--kawa:#6b4528;--kakao:#3f2411;--skip-bg:#3f2411;--skip-fg:#fbf3df;--gut:clamp(16px,4vw,48px);--display:'Wolnobieg Display',Georgia,'Times New Roman',serif;--text:'Wolnobieg Text',system-ui,'Segoe UI',Arial,sans-serif;--radius:clamp(22px,3vw,34px)}
body.wolnobieg{margin:0;background:var(--krem);color:var(--kakao);font:400 18px/1.55 var(--text)}
:where(.wolnobieg) a{color:var(--rdza);text-underline-offset:3px}
.wolnobieg a:focus-visible,.wolnobieg button:focus-visible,.wolnobieg summary:focus-visible,.wolnobieg input:focus-visible,.wolnobieg select:focus-visible{outline:3px solid var(--kakao);outline-offset:3px}
:where(.wolnobieg) :is(h1,h2,h3,h4){margin:0;font-family:var(--display);font-weight:400;line-height:1.1}
:where(.wolnobieg) p{margin:0}
:where(.wolnobieg) img{display:block;height:auto}
.wolnobieg .muted{color:var(--kawa);font-size:16px}
.top{display:flex;justify-content:space-between;gap:16px;padding:18px var(--gut);font-size:16px;font-weight:600;background:var(--kakao)}
.top a{color:var(--krem-jasny)}
main{display:block}
.wrap{max-width:1160px;margin:0 auto;padding:0 var(--gut)}
.kicker{font:800 13px/1.4 var(--text);letter-spacing:.14em;text-transform:uppercase;color:var(--rdza);margin-bottom:16px}
.hero{position:relative;overflow:hidden;background:var(--pomarancz);color:var(--kakao);isolation:isolate}
.hero::after{content:'';position:absolute;inset:0;z-index:-1;background-image:url("data:image/svg+xml;charset=utf-8,${grain}");opacity:.3;pointer-events:none}
.hero__in{display:grid;gap:24px;align-items:center;padding:clamp(28px,5vw,72px) var(--gut) clamp(40px,7vw,96px);max-width:1160px;margin:0 auto}
.hero__in>*{min-width:0}
.hero .kicker{color:var(--kakao)}
.hero__head{grid-column:1/-1;padding-bottom:clamp(8px,2vw,24px)}
.hero h1{font-size:clamp(40px,12vw,140px);line-height:1.05;transform:rotate(-4deg);transform-origin:0 100%;margin:clamp(20px,4vw,56px) 0 0;white-space:nowrap}
.hero__lead{font:600 clamp(20px,2.6vw,28px)/1.35 var(--text);max-width:24em;margin-bottom:26px}
.hero__facts{display:grid;gap:12px;margin:0 0 26px;max-width:34em}
.hero__facts div{border-top:3px solid var(--kakao);padding-top:8px}
.hero__facts dt{font:800 12px/1 var(--text);letter-spacing:.12em;text-transform:uppercase;margin-bottom:5px}
.hero__facts dd{margin:0;font-weight:600}
.hero__nav ul{display:flex;flex-wrap:wrap;gap:8px 12px;margin:0;padding:0;list-style:none}
.hero__nav a{display:inline-block;padding:8px 16px;border-radius:999px;background:var(--krem-jasny);color:var(--kakao);font-weight:800;text-decoration:none}
.hero__nav a:hover{background:var(--musztarda)}
.hero__art{position:relative;margin:0;aspect-ratio:1;max-width:520px;width:100%;justify-self:center}
.hero__art svg{position:absolute;right:-12%;bottom:-12%;width:112%;height:112%}
.hero__badge{position:absolute;left:12%;top:12%;width:70%;aspect-ratio:1;border-radius:50%;background:var(--krem-jasny);box-shadow:0 16px 24px -12px rgba(63,36,17,.55);display:grid;place-items:center;animation:roll-in 1.1s cubic-bezier(.25,.6,.25,1) both}
.hero__badge img{width:88%}
@keyframes roll-in{from{transform:translateX(-60%) rotate(-360deg);opacity:0}to{transform:none;opacity:1}}
@media (min-width:900px){.hero__in{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr)}}
.band{padding:clamp(28px,5vw,64px) 0;display:grid;gap:clamp(20px,3vw,36px)}
.band__head{display:grid;gap:12px}
.band__title{font-size:clamp(36px,6vw,64px);color:var(--brazowy);transform:rotate(-1.5deg);transform-origin:0 100%}
.band__lead{font:600 clamp(19px,2.2vw,24px)/1.45 var(--text);max-width:34em}
.band__sub{font-size:clamp(26px,3.6vw,36px);color:var(--brazowy)}
.swoosh{width:min(280px,60vw);height:auto}
.card{position:relative;isolation:isolate;display:grid;gap:14px;align-content:start;padding:clamp(22px,3.4vw,44px);margin:0;background:var(--krem-jasny);border-radius:var(--radius);box-shadow:0 10px 22px -16px rgba(63,36,17,.6);overflow:hidden}
.card::after{content:'';position:absolute;inset:0;z-index:-1;background-image:url("data:image/svg+xml;charset=utf-8,${grain}");opacity:.16;pointer-events:none}
.card--orange{background:var(--pomarancz);color:var(--kakao)}
.card--mustard{background:var(--musztarda);color:var(--kakao)}
.card--brown{background:var(--brazowy);color:var(--krem-jasny)}
.card--brown h3,.card--brown h4{color:var(--krem-jasny)}
.card--sand{background:var(--piasek)}
.card--brown a{color:var(--musztarda)}
.card h3{font-size:clamp(26px,3.4vw,38px);color:var(--brazowy)}
.card--orange h3,.card--mustard h3{color:var(--kakao)}
.cards .card h3{font-size:clamp(20px,2.3vw,28px);overflow-wrap:anywhere}
.card h4{font:800 15px/1.3 var(--text);letter-spacing:.06em;text-transform:uppercase;color:var(--rdza);margin:6px 0 4px}
.card--orange h4,.card--mustard h4,.card--sand h4{color:var(--kakao)}
.card--orange .muted,.card--mustard .muted,.card--sand .muted{color:var(--kakao)}
.card--brown .muted{color:var(--len)}
.prose{display:grid;gap:14px;max-width:38em}
.prose p,.prose-p{font-size:18px}
.prose-p{max-width:44em}
.two{display:grid;gap:28px;align-items:start}
@media (min-width:860px){.two{grid-template-columns:1.3fr 1fr;gap:56px}.two--even{grid-template-columns:1fr 1fr}}
.facts{margin:0;display:grid;gap:0}
.facts div{border-top:3px solid var(--brazowy);padding:12px 0 14px}
.facts dt{font:800 12px/1 var(--text);letter-spacing:.12em;text-transform:uppercase;color:var(--rdza);margin-bottom:6px}
.facts dd{margin:0}
.facts--row{gap:0 32px}
@media (min-width:860px){.facts--row{grid-template-columns:repeat(3,1fr)}}
.card--brown .facts div{border-color:var(--musztarda)}
.card--brown .facts dt{color:var(--musztarda)}
.keywords{display:flex;flex-wrap:wrap;gap:4px 28px;font:400 clamp(36px,7vw,84px)/1.05 var(--display);margin-top:8px;color:var(--brazowy)}
.card blockquote{margin:8px 0 0;padding:0 0 0 24px;border-left:8px solid var(--pomarancz);font:400 clamp(22px,2.6vw,30px)/1.35 var(--display);max-width:30em}
.cards{display:grid;gap:clamp(20px,3vw,32px)}
@media (min-width:760px){.cards.three{grid-template-columns:repeat(3,1fr)}}
.card--reject img,.card--chosen img{width:100%;max-width:180px;aspect-ratio:1;background:var(--krem);padding:8px;margin-bottom:14px;border-radius:18px}
.card--chosen{outline:6px solid var(--pomarancz);outline-offset:-6px}
.cards .card p{margin-top:6px}
.cards--inner{gap:20px 32px}
.cards--inner div{border-top:3px solid var(--brazowy);padding-top:10px}
.kern{display:grid;gap:20px}
@media (min-width:640px){.kern{grid-template-columns:1fr 1fr}}
.kern figure{margin:0;background:var(--krem);padding:20px;border-radius:22px}
.kern img{width:100%;max-width:360px;margin:0 auto}
.kern figcaption{margin-top:10px;font:800 14px/1 var(--text);text-align:center}
.sizes{display:flex;flex-wrap:wrap;align-items:flex-end;gap:20px 32px;margin:8px 0;padding:0;list-style:none}
.sizes li{display:grid;gap:8px;justify-items:start}
.sizes span{font-size:13px;color:var(--kawa);max-width:9em}
.variants{display:grid;gap:16px;margin:0;padding:0;list-style:none}
@media (min-width:640px){.variants{grid-template-columns:repeat(2,1fr)}}
@media (min-width:960px){.variants{grid-template-columns:repeat(3,1fr)}}
.variants li{padding:20px;display:grid;gap:14px;align-content:space-between;min-height:220px;border-radius:24px}
.variants img{max-height:120px;width:auto;max-width:100%;margin:0 auto}
.variants p{display:grid;gap:2px;font-size:14px}
.variants strong{font-size:16px}
.ground--krem{background:var(--krem)}
.ground--krem-jasny{background:var(--krem-jasny);border:2px solid var(--piasek)}
.ground--piasek{background:var(--piasek)}
.ground--pomarancz{background:var(--pomarancz)}
.ground--white{background:#fff;border:2px solid var(--piasek)}
.ground--kakao{background:var(--kakao);color:var(--krem-jasny)}
.clear{margin:0;background:var(--krem);padding:16px;border-radius:22px}
.clear img{width:100%}
.plain{display:grid;gap:8px;margin:0;padding:0;list-style:none}
.plain--rules li{border-top:3px solid var(--brazowy);padding-top:10px}
.swatches{display:grid;grid-template-columns:repeat(2,1fr);gap:18px 14px;margin:0;padding:0;list-style:none}
@media (min-width:640px){.swatches{grid-template-columns:repeat(4,1fr)}}
@media (min-width:960px){.swatches{grid-template-columns:repeat(5,1fr)}}
.swatches li{display:grid;gap:3px;font-size:14px;align-content:start}
.swatches__chip{display:block;height:64px;margin-bottom:6px;border-radius:16px;box-shadow:inset 0 0 0 2px rgba(63,36,17,.6)}
.swatches strong{font:400 20px/1.1 var(--display)}
.swatches em{font-style:normal;color:var(--kawa);font-size:13px}
.tbl-wrap{overflow-x:auto;max-width:100%}
.tbl{border-collapse:collapse;width:100%;min-width:560px;font-size:14px}
.tbl th,.tbl td{text-align:left;padding:9px 10px;border-top:2px solid var(--piasek);vertical-align:middle}
.tbl thead th{font:800 12px/1.2 var(--text);letter-spacing:.1em;text-transform:uppercase;color:var(--rdza);border-top:0}
.tbl tbody th{font-weight:600}
.tbl__chip{display:inline-block;width:18px;height:18px;margin-right:8px;border-radius:50%;vertical-align:-3px;box-shadow:inset 0 0 0 2px rgba(63,36,17,.6)}
.tbl__pair{display:inline-block;padding:2px 8px;margin-right:8px;border-radius:8px;font:400 15px/1.3 var(--display);box-shadow:inset 0 0 0 1px rgba(63,36,17,.3)}
.face__name{font-size:clamp(32px,5vw,60px);line-height:1.1;color:var(--brazowy)}
.face__name--display,.face__sample--display{font-family:var(--display)}
.face__name--text,.face__sample--text{font-family:var(--text)}
.face__sample{font-size:clamp(20px,2.4vw,28px);line-height:1.3;margin:12px 0}
.scale{display:grid;gap:0;margin:12px 0 0;padding:0;list-style:none}
.scale li{display:grid;gap:4px;border-top:3px solid var(--piasek);padding:12px 0}
@media (min-width:760px){.scale li{grid-template-columns:260px 1fr;align-items:baseline;gap:24px}}
.scale__sample--display{font-family:var(--display)}
.scale__sample--text{font-family:var(--text)}
.glyphs{font:400 clamp(24px,4vw,42px)/1.4 var(--display);overflow-wrap:anywhere}
.icons{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:0;padding:0;list-style:none}
@media (min-width:640px){.icons{grid-template-columns:repeat(6,1fr)}}
.icons li{display:grid;justify-items:center;gap:8px;padding:16px 4px;background:var(--krem);border-radius:20px;font-size:13px;font-weight:600}
.icons img{width:40px;height:40px}
.pattern{height:clamp(140px,26vw,260px);background-size:300px;background-color:var(--krem);border-radius:24px}
.tone{display:grid;gap:20px}
@media (min-width:760px){.tone{grid-template-columns:1fr 1fr;gap:24px 40px}}
.tone article{border-top:3px solid var(--brazowy);padding-top:12px;display:grid;gap:8px;align-content:start}
.tone h4{margin:0}
.tone .yes,.tone .no{font-size:16px}
.tone .yes{color:var(--oliwka);font-weight:800}
.tone .no{color:var(--kawa);text-decoration:line-through;text-decoration-color:var(--pomarancz)}
.card--mustard .tone .yes,.card--mustard .tone .no{color:var(--kakao)}
.tag{display:inline-block;min-width:2.8em;margin-right:8px;font:800 12px/1 var(--text);letter-spacing:.1em;text-transform:uppercase}
.film{width:100%;max-width:520px;height:auto;aspect-ratio:1;background:var(--krem);border-radius:22px}
.composer{display:grid;gap:24px;align-items:start}
@media (min-width:860px){.composer{grid-template-columns:1.2fr 1fr;gap:40px}}
.composer__stage{background:var(--krem-jasny);border-radius:24px;padding:16px;box-shadow:inset 0 0 0 3px var(--piasek)}
.composer__stage svg{width:100%;height:auto}
.composer__controls{display:grid;gap:14px}
.composer__presets{display:flex;flex-wrap:wrap;gap:8px}
.composer__presets button,.composer__save{padding:10px 18px;border:3px solid var(--kakao);border-radius:999px;background:transparent;color:var(--kakao);font:800 15px/1 var(--text);cursor:pointer}
.composer__presets button:hover{background:var(--musztarda)}
.composer__save{background:var(--kakao);color:var(--krem-jasny);justify-self:start}
.composer__field{display:grid;gap:4px;font-weight:600}
.composer__field input[type=range]{width:100%;accent-color:var(--kakao)}
.composer__field select{padding:8px 10px;border:2px solid var(--kakao);border-radius:12px;background:var(--krem-jasny);color:var(--kakao);font:600 16px/1.2 var(--text)}
.composer__colors{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px}
.composer__check{display:flex;gap:10px;align-items:center;font-weight:600}
.composer__check input{width:20px;height:20px;accent-color:var(--kakao)}
.composer__note{font-size:15px}
.gallery{display:grid;gap:clamp(20px,3vw,36px)}
@media (min-width:760px){.gallery{grid-template-columns:repeat(2,1fr);align-items:start;grid-auto-flow:dense}.gallery__item--papier{grid-row:span 2}}
.gallery__item{display:grid;gap:12px;align-content:start;padding:16px;background:var(--krem-jasny)}
.gallery__item img{width:100%;border-radius:20px}
.gallery__item figcaption{display:grid;gap:2px;font-size:15px}
.gallery__item strong{font:400 22px/1.2 var(--display);color:var(--brazowy)}
.posts{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin:0;padding:0;list-style:none}
@media (min-width:760px){.posts{grid-template-columns:repeat(4,1fr)}}
.posts li{display:grid;gap:8px;align-content:start;font-size:14px;font-weight:600}
.posts img{width:100%;border-radius:20px;box-shadow:0 10px 18px -12px rgba(63,36,17,.6)}
.dl{display:grid;gap:18px}
.dl__zip{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px 24px;padding:20px 24px;border-radius:24px;background:var(--kakao);color:var(--krem-jasny);text-decoration:none;font:400 clamp(20px,3vw,28px)/1.2 var(--display)}
.dl__zip:hover{background:var(--brazowy)}
.dl__zip-size{font:800 16px/1 var(--text);color:var(--musztarda)}
.dl__list{margin:0;padding:0;list-style:none}
.dl__row{border-top:3px solid var(--piasek)}
.dl__row summary{display:grid;grid-template-columns:1fr auto;gap:2px 16px;padding:14px 0;cursor:pointer;list-style:none}
.dl__row summary::-webkit-details-marker{display:none}
.dl__title{font:400 20px/1.2 var(--display);color:var(--brazowy)}
.dl__formats{grid-column:1;color:var(--kawa);font-size:14px}
.dl__count{grid-column:2;grid-row:1;font-size:14px;text-align:right}
.dl__size{grid-column:2;grid-row:2;font-size:14px;color:var(--kawa);text-align:right}
.dl__files{margin:0 0 14px;padding:0;list-style:none;display:grid;gap:4px}
.dl__files li{display:grid;grid-template-columns:1fr auto auto;gap:4px 16px;font-size:14px;padding:6px 0}
.dl__files a{overflow-wrap:anywhere}
.dl__dim,.dl__bytes{color:var(--kawa);white-space:nowrap}
.cta{padding:clamp(24px,5vw,56px) 0 clamp(40px,7vw,88px)}
.cta .card{justify-items:start;max-width:46em}
.cta h2{font-size:clamp(30px,5vw,50px)}
.cta__link{display:inline-block;padding:14px 24px;border-radius:999px;background:var(--kakao);color:var(--krem-jasny)!important;text-decoration:none;font-weight:800}
.foot{padding:24px 0 40px;background:var(--kakao);color:var(--len);font-size:14px}
.foot p{max-width:1160px;margin:0 auto 4px;padding:0 var(--gut)}
.foot a{color:var(--musztarda)}
@media (prefers-reduced-motion:reduce){.hero__badge{animation:none}}
`;
