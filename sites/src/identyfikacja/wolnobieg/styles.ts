const grain = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><filter id="n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="6" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.25 0 0 0 0 0.14 0 0 0 0 0.07 0 0 0 0.9 -0.4"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`,
);

const wearTexture = (r: number, g: number, b: number) =>
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640"><filter id="w" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.018 0.2" numOctaves="3" seed="11" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} 0 0 0 -9 3.0"/></filter><rect width="100%" height="100%" filter="url(#w)"/></svg>`,
  );
const wearLight = wearTexture(0.98, 0.95, 0.87);
const wearDark = wearTexture(0.25, 0.14, 0.07);

export const css = `
:root{color-scheme:light;--brazowy:#5b2f14;--pomarancz:#ec7424;--musztarda:#e9a81d;--awokado:#7c8a2b;--oliwka:#556020;--rdza:#a64a0d;--krem-jasny:#fbf3df;--krem:#f6e8c8;--piasek:#ead7ae;--len:#cdb27f;--tyton:#9a7447;--kawa:#6b4528;--kakao:#3f2411;--skip-bg:#3f2411;--skip-fg:#fbf3df;--gut:clamp(16px,4vw,48px);--display:'Wolnobieg Display',Georgia,'Times New Roman',serif;--text:'Wolnobieg Text',system-ui,'Segoe UI',Arial,sans-serif;--radius:clamp(40px,7vw,96px);--sw:clamp(36px,6vw,92px);--stack:58px}
html{scroll-behavior:smooth}
body.wolnobieg{margin:0;background:var(--kakao);color:var(--kakao);font:400 18px/1.55 var(--text);overflow-x:clip}
:where(.wolnobieg) a{color:var(--rdza);text-underline-offset:3px}
.wolnobieg a:focus-visible,.wolnobieg button:focus-visible,.wolnobieg summary:focus-visible,.wolnobieg input:focus-visible,.wolnobieg select:focus-visible{outline:3px solid var(--focus,var(--kakao));outline-offset:3px}
.top,.foot,.band--brown,.band--olive,.panel--brown{--focus:var(--krem-jasny)}
.wolnobieg .skip:focus-visible{outline:3px solid var(--krem-jasny);outline-offset:3px}
:where(.wolnobieg) :is(h1,h2,h3,h4){margin:0;font-family:var(--display);font-weight:400;line-height:1.2}
:where(.wolnobieg) p{margin:0}
:where(.wolnobieg) img{display:block;height:auto}
:where(.wolnobieg) ul,:where(.wolnobieg) ol{margin:0;padding:0;list-style:none}
.wolnobieg .muted{color:var(--kawa);font-size:16px}
.top{display:flex;justify-content:space-between;gap:16px;padding:14px var(--gut);font-size:15px;font-weight:600;background:var(--kakao)}
.top a{color:var(--krem-jasny)}
.route{position:sticky;top:0;z-index:60;display:flex;align-items:center;gap:14px;padding:10px var(--gut);background:var(--brazowy);border-bottom:4px solid var(--musztarda)}
.route__mark{width:40px;height:40px;flex:none}
.route ul{display:flex;gap:8px;min-width:0;margin:0;padding:3px;overflow-x:auto;scrollbar-width:none}
.route ul::-webkit-scrollbar{display:none}
.route__cta{margin-left:auto;flex:none}
.route a{display:block;padding:8px 18px;border-radius:999px;background:var(--krem-jasny);color:var(--kakao);font-weight:800;font-size:15px;text-decoration:none;white-space:nowrap}
.route a:hover{background:var(--musztarda)}
.route .route__cta{background:var(--musztarda)}
.route .route__cta:hover{background:var(--pomarancz)}
.route__cta .short{display:none}
@media (max-width:560px){.route__cta .long{display:none}.route__cta .short{display:inline}.route{gap:10px}.route__mark{display:none}.route a{padding:8px 13px;font-size:14px}.route ul{padding-right:26px;-webkit-mask-image:linear-gradient(to right,#000 calc(100% - 30px),transparent);mask-image:linear-gradient(to right,#000 calc(100% - 30px),transparent)}}
.wolnobieg .route a:focus-visible{outline-color:var(--musztarda)}
main{display:block}
.wrap{position:relative;max-width:1160px;margin:0 auto;padding:0 var(--gut)}
.kicker{font:800 13px/1.4 var(--text);letter-spacing:.14em;text-transform:uppercase;color:var(--rdza);margin-bottom:16px}
.band{position:relative;z-index:var(--z,1);margin-top:calc(var(--sw)*-1);padding:calc(var(--sw) + var(--stack) + clamp(36px,5vw,72px)) 0 calc(var(--sw) + clamp(32px,4vw,56px));background:var(--bg);color:var(--ink);border-radius:0 0 50% 50%/0 0 var(--sw) var(--sw);box-shadow:0 14px 0 var(--a1),0 22px 0 var(--next),0 36px 0 var(--a2),0 44px 0 var(--next),0 58px 0 var(--a3);isolation:isolate;--r1:var(--pomarancz);--r2:var(--musztarda);--r3:var(--brazowy);--s1:var(--pomarancz);--s2:var(--musztarda);--s3:var(--brazowy);--head:var(--brazowy)}
.band::after{content:'';position:absolute;inset:0;z-index:-1;border-radius:inherit;background-image:url("data:image/svg+xml;charset=utf-8,${grain}");opacity:.13;pointer-events:none}
.band::before{content:'';position:absolute;inset:0;z-index:-1;border-radius:inherit;background-image:url("data:image/svg+xml;charset=utf-8,${wearLight}");opacity:.3;pointer-events:none}
.band--cream::before,.band--mustard::before{background-image:url("data:image/svg+xml;charset=utf-8,${wearDark}");opacity:.1}
.band--hero::before{opacity:.4}
.band--brown::after,.band--olive::after{opacity:.05}
.band--brown::before,.band--olive::before{opacity:.12}
.band[id]{scroll-margin-top:calc((var(--sw) + 24px)*-1)}
.band--hero{margin-top:0;padding:0 0 var(--sw);overflow:hidden;--bg:var(--pomarancz);--ink:var(--kakao);--next:var(--krem-jasny);--a1:var(--brazowy);--a2:var(--musztarda);--a3:var(--pomarancz)}
.band--hero::after{opacity:.3}
.band--cream{--bg:var(--krem-jasny);--ink:var(--kakao);--next:var(--musztarda);--a1:var(--pomarancz);--a2:var(--rdza);--a3:var(--brazowy)}
.band--mustard{--bg:var(--musztarda);--ink:var(--kakao);--next:var(--brazowy);--a1:var(--pomarancz);--a2:var(--krem-jasny);--a3:var(--musztarda);--r1:var(--brazowy);--r2:var(--pomarancz);--r3:var(--krem-jasny);--s1:var(--brazowy);--s2:var(--pomarancz);--s3:var(--krem-jasny)}
.band--brown{--bg:var(--brazowy);--ink:var(--krem-jasny);--head:var(--krem-jasny);--next:var(--krem-jasny);--a1:var(--musztarda);--a2:var(--pomarancz);--a3:var(--rdza);--r3:var(--krem-jasny);--s1:var(--musztarda);--s2:var(--pomarancz);--s3:var(--krem-jasny)}
.band--olive{--bg:var(--oliwka);--ink:var(--krem-jasny);--head:var(--krem-jasny);--next:var(--pomarancz);--a1:var(--musztarda);--a2:var(--krem-jasny);--a3:var(--brazowy);--r1:var(--musztarda);--r2:var(--pomarancz);--r3:var(--krem-jasny);--s1:var(--musztarda);--s2:var(--pomarancz);--s3:var(--krem-jasny)}
.band--orange{--bg:var(--pomarancz);--ink:var(--kakao);--head:var(--kakao);--next:var(--musztarda);--a1:var(--brazowy);--a2:var(--krem-jasny);--a3:var(--rdza);--r1:var(--krem-jasny);--r2:var(--musztarda);--r3:var(--brazowy);--s1:var(--brazowy);--s2:var(--musztarda);--s3:var(--krem-jasny)}
.band--cta{--bg:var(--musztarda);--ink:var(--kakao);--head:var(--kakao);--next:var(--kakao);--a1:var(--pomarancz);--a2:var(--krem-jasny);--a3:var(--musztarda)}
.band--cream .band__lead,.band__lead{font:600 clamp(19px,2.2vw,24px)/1.45 var(--text);max-width:34em;margin-bottom:clamp(24px,3vw,40px)}
.hero__in{display:grid;gap:24px;align-items:center;padding:clamp(28px,5vw,72px) var(--gut) clamp(32px,5vw,56px);max-width:1160px;margin:0 auto}
.hero__in>*{min-width:0}
.band--hero .kicker{color:var(--kakao)}
.hero__head{grid-column:1/-1;padding-bottom:clamp(8px,2vw,24px)}
.band--hero h1{font-size:clamp(40px,12vw,140px);line-height:1.15;transform:rotate(-4deg);transform-origin:0 100%;margin:clamp(20px,4vw,56px) 0 0;white-space:nowrap;color:var(--kakao)}
.hero__text{align-self:start;padding-top:clamp(0px,3vw,40px)}
.hero__lead{font:600 clamp(20px,2.6vw,28px)/1.35 var(--text);max-width:24em;margin:0}
.hero__art{position:relative;margin:0;aspect-ratio:1;max-width:520px;width:100%;justify-self:center}
.hero__art svg{position:absolute;right:-12%;bottom:-12%;width:112%;height:112%;overflow:visible}
.hero__badge{position:absolute;left:12%;top:12%;width:70%;aspect-ratio:1;border-radius:50%;background:var(--krem-jasny);box-shadow:0 16px 24px -12px rgba(63,36,17,.55);display:grid;place-items:center;animation:roll-in 1.1s cubic-bezier(.25,.6,.25,1) both}
.hero__badge img{width:88%}
@keyframes roll-in{from{transform:translateX(-60%) rotate(-360deg);opacity:0}to{transform:none;opacity:1}}
@media (min-width:900px){.hero__in{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr)}}
.sh{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:clamp(18px,2.4vw,28px) clamp(30px,4vw,56px);margin:0 0 clamp(32px,4vw,56px);padding-left:22px}
.sh__no{display:grid;place-items:center;width:clamp(60px,7vw,92px);aspect-ratio:1;border-radius:50%;background:var(--krem-jasny);color:var(--kakao);font:400 clamp(28px,3.6vw,46px)/1 var(--display);box-shadow:0 0 0 7px var(--r1),0 0 0 14px var(--r2),0 0 0 21px var(--r3)}
.sh__title{font-size:clamp(32px,5.6vw,72px);line-height:1.18;color:var(--head);transform:rotate(-2.5deg);transform-origin:0 100%;text-wrap:balance}
@media (max-width:560px){.sh{grid-template-columns:minmax(0,1fr);gap:26px}.sh__title{font-size:clamp(30px,9.4vw,40px)}}
.sh__rail{grid-column:1/-1;height:26px;margin-top:6px;border-radius:0 99px 99px 0;background:linear-gradient(var(--s1) 0 6px,transparent 6px 10px,var(--s2) 10px 16px,transparent 16px 20px,var(--s3) 20px 26px)}
.prose{display:grid;gap:14px;max-width:38em}
.prose p,.prose-p{font-size:18px}
.prose-p{max-width:44em;margin-bottom:24px}
.panel{position:relative;color:var(--kakao);display:grid;gap:14px;align-content:start;padding:clamp(24px,3.6vw,48px);background:var(--krem);border-radius:0 var(--radius) 0 var(--radius)}
.panel--flip{border-radius:var(--radius) 0 var(--radius) 0}
.panel--cream{background:var(--krem-jasny)}
.panel--white{background:#fff}
.panel--sand{background:var(--piasek)}
.panel--orange{background:var(--pomarancz)}
.panel--mustard{background:var(--musztarda)}
.panel--brown{background:var(--kakao);color:var(--krem-jasny)}
.panel__title,.panel h3{font-size:clamp(26px,3.4vw,40px);line-height:1.22;text-wrap:balance;color:var(--brazowy)}
.panel--orange h3,.panel--mustard h3,.panel--orange h4,.panel--mustard h4{color:var(--kakao)}
.panel h4,.prose h4,.sys h4{font:800 15px/1.3 var(--text);letter-spacing:.06em;text-transform:uppercase;color:var(--rdza);margin:6px 0 4px}
.panel--orange .muted,.panel--mustard .muted,.panel--sand .muted{color:var(--kakao)}
.sys{margin-top:clamp(44px,6vw,84px)}
.sys:first-of-type{margin-top:0}
.pill{display:inline-block;margin:0 0 clamp(20px,3vw,32px);padding:10px 28px 13px;border-radius:999px;background:var(--brazowy);color:var(--krem-jasny);font:400 clamp(22px,3.2vw,38px)/1.22 var(--display);transform:rotate(-2deg);transform-origin:0 100%}
.pill--light{background:var(--krem-jasny);color:var(--brazowy)}
.duo{display:grid;gap:clamp(20px,3vw,32px);align-items:start}
@media (min-width:860px){.duo{grid-template-columns:1fr 1fr}.duo .panel--wide{grid-column:1/-1}}
.task{display:grid;gap:clamp(28px,4vw,56px);align-items:start}
@media (min-width:900px){.task{grid-template-columns:minmax(0,1.35fr) minmax(0,1fr)}}
.task__lead{max-width:none}
.task__lead p{font-size:19px;max-width:36em}
.task__lead p:first-child{font:600 clamp(22px,2.6vw,30px)/1.4 var(--text)}
.tags{margin:0;display:grid;gap:16px}
.tags div{padding:16px 26px 20px;background:var(--krem);border-radius:34px 6px 34px 6px}
.tags div:nth-child(2n){background:var(--musztarda);border-radius:6px 34px 6px 34px}
.tags div:nth-child(3){background:var(--pomarancz)}
.tags dt{font:800 12px/1 var(--text);letter-spacing:.12em;text-transform:uppercase;color:var(--kakao);margin-bottom:6px}
.tags dd{margin:0;font-weight:600}
.dir{display:grid;gap:clamp(24px,4vw,56px);align-items:center;margin-bottom:clamp(32px,5vw,64px)}
@media (min-width:900px){.dir{grid-template-columns:minmax(0,1fr) minmax(0,1.15fr)}}
.keywords{display:flex;flex-direction:column;font:400 clamp(48px,7.2vw,100px)/1.15 var(--display);color:var(--brazowy)}
.keywords span{display:block;transform:rotate(-4deg);transform-origin:0 100%}
.keywords span:nth-child(2){padding-left:.45em}
.keywords span:nth-child(3){padding-left:.8em}
.lede{font-size:clamp(24px,3vw,34px);line-height:1.2;color:var(--kakao);margin-bottom:16px;text-wrap:balance}
.dir__text .prose{max-width:none}
.coins{display:grid;gap:20px;margin-bottom:clamp(32px,5vw,64px)}
@media (min-width:900px){.coins{grid-template-columns:repeat(3,1fr);gap:clamp(20px,3vw,40px)}}
.coin{display:grid;align-content:center;gap:10px;padding:26px 28px;border-radius:44px;background:var(--krem-jasny);color:var(--kakao);text-align:center}
@media (min-width:900px){.coin{aspect-ratio:1;border-radius:50%;padding:clamp(34px,4.4vw,60px)}}
.coin h3{font-size:clamp(20px,2.1vw,27px);line-height:1.25;color:inherit;text-wrap:balance}
.coin p{font-size:16px;line-height:1.45}
.coin--orange{background:var(--pomarancz)}
.coin--brown{background:var(--brazowy);color:var(--krem-jasny)}
.strat{display:grid;gap:28px;align-items:center}
@media (min-width:900px){.strat{grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:56px}}
.strat__facts{margin:0;display:grid;gap:0}
.strat__facts div{border-top:3px solid var(--musztarda);padding:12px 0 14px}
.strat__facts dt{font:800 12px/1 var(--text);letter-spacing:.12em;text-transform:uppercase;color:var(--musztarda);margin-bottom:6px}
.strat__facts dd{margin:0}
.strat blockquote{margin:0;padding:0 0 0 24px;border-left:10px solid var(--pomarancz);font:400 clamp(22px,2.6vw,32px)/1.35 var(--display)}
.picks{display:grid;gap:clamp(36px,5vw,56px) clamp(24px,3vw,44px);margin:0 0 clamp(36px,5vw,64px)}
@media (min-width:860px){.picks{grid-template-columns:repeat(3,1fr)}}
.pick{display:grid;gap:10px;align-content:start;justify-items:start}
.pick__label{padding:6px 14px;border-radius:99px;border:2px solid var(--krem-jasny);font:800 12px/1 var(--text);letter-spacing:.12em;text-transform:uppercase}
.pick--chosen .pick__label{background:var(--musztarda);border-color:var(--musztarda);color:var(--kakao)}
.pick__img{display:grid;place-items:center;width:min(230px,70%);aspect-ratio:1;margin:14px 0 14px 16px;border-radius:50%;background:var(--krem-jasny)}
.pick__img img{width:66%}
.pick--chosen .pick__img{box-shadow:0 0 0 8px var(--pomarancz),0 0 0 16px var(--musztarda)}
.pick h3{font-size:clamp(22px,2.4vw,28px);line-height:1.25;color:var(--krem-jasny);text-wrap:balance}
.pick__text{color:var(--krem)}
.kern{display:grid;gap:20px}
@media (min-width:640px){.kern{grid-template-columns:1fr 1fr}}
.kern figure{padding:clamp(16px,2.6vw,32px)}
.kern figure{margin:0;background:var(--krem);padding:20px;border-radius:0 40px 0 40px}
.kern img{width:100%;max-width:560px;margin:0 auto}
.kern figcaption{margin-top:10px;font:800 14px/1 var(--text);text-align:center}
.sizes{display:flex;flex-wrap:wrap;gap:28px 64px;margin:8px 0}
.sizes__group{display:grid;gap:12px;align-content:end}
.sizes__row{display:flex;align-items:flex-end;gap:32px;margin:0;padding:0;list-style:none;border-bottom:3px solid var(--piasek)}
.sizes__row li{display:grid;gap:8px;justify-items:center;align-content:end;padding-bottom:10px}
.sizes__row span{font-size:13px;color:var(--kawa);white-space:nowrap}
.sizes__title{margin:0;font:800 13px/1.2 var(--text);letter-spacing:.1em;text-transform:uppercase;color:var(--rdza)}
.variants{display:grid;gap:18px;margin:0 0 clamp(28px,4vw,48px)}
@media (min-width:640px){.variants{grid-template-columns:repeat(2,1fr)}}
@media (min-width:960px){.variants{grid-template-columns:repeat(3,1fr)}}
.variants li{padding:22px 22px 18px;display:grid;grid-template-rows:1fr auto;gap:14px;min-height:230px;border-radius:0 60px 0 60px}
.variants li:nth-child(2n){border-radius:60px 0 60px 0}
.variants img{max-height:120px;width:auto;max-width:100%;margin:0 auto;align-self:center}
.variants p{display:grid;gap:2px;font-size:14px}
.variants strong{font-size:16px}
.ground--krem{background:var(--krem)}
.ground--krem-jasny{background:#fff;border:3px solid var(--piasek)}
.ground--piasek{background:var(--piasek)}
.ground--pomarancz{background:var(--pomarancz)}
.ground--white{background:#fff;border:3px solid var(--piasek)}
.ground--kakao{background:var(--kakao);color:var(--krem-jasny)}
.clear{margin:0;background:var(--krem);padding:16px;border-radius:0 48px 0 48px}
.clear img{width:100%}
.plain{display:grid;gap:8px}
.plain--rules{margin-top:clamp(28px,4vw,44px);gap:20px;max-width:46em}
.plain--rules li{position:relative;padding-left:52px;line-height:1.5}
.plain--rules li::before{content:'';position:absolute;left:8px;top:.42em;width:16px;aspect-ratio:1;border-radius:50%;background:var(--krem-jasny);box-shadow:0 0 0 3px var(--pomarancz),0 0 0 6px var(--musztarda)}
.swatches{display:grid;grid-template-columns:repeat(2,1fr);gap:26px 14px;margin:0 0 clamp(28px,4vw,48px)}
@media (min-width:640px){.swatches{grid-template-columns:repeat(4,1fr)}}
@media (min-width:960px){.swatches{grid-template-columns:repeat(5,1fr);gap:30px 24px}}
.swatches li{display:grid;gap:3px;font-size:14px;align-content:start}
.swatches__chip{display:block;width:92px;aspect-ratio:1;margin-bottom:8px;border-radius:50%;box-shadow:inset 0 0 0 2px rgba(63,36,17,.6)}
.swatches strong{font:400 20px/1.25 var(--display)}
.swatches em{font-style:normal;color:var(--kawa);font-size:13px}
.tbl-wrap{overflow-x:auto;max-width:100%}
.tbl{border-collapse:collapse;width:100%;min-width:560px;font-size:14px}
.tbl th,.tbl td{text-align:left;padding:9px 10px;border-top:2px solid var(--piasek);vertical-align:middle}
.tbl thead th{font:800 12px/1.2 var(--text);letter-spacing:.1em;text-transform:uppercase;color:var(--rdza);border-top:0}
.tbl tbody th{font-weight:600}
.tbl__chip{display:inline-block;width:18px;height:18px;margin-right:8px;border-radius:50%;vertical-align:-3px;box-shadow:inset 0 0 0 2px rgba(63,36,17,.6)}
.tbl__pair{display:inline-block;padding:2px 8px;margin-right:8px;border-radius:8px;font:400 15px/1.3 var(--display);box-shadow:inset 0 0 0 1px rgba(63,36,17,.3)}
.fold{margin-top:8px;border-top:3px solid var(--piasek)}
.fold summary{display:flex;align-items:center;gap:12px;padding:14px 0;cursor:pointer;list-style:none;font:400 20px/1.25 var(--display);color:var(--brazowy)}
.fold summary::-webkit-details-marker{display:none}
.fold summary::after{content:'';width:9px;height:9px;border-right:3px solid var(--rdza);border-bottom:3px solid var(--rdza);transform:translateY(-3px) rotate(45deg);transition:transform .2s}
.fold[open] summary::after{transform:translateY(1px) rotate(-135deg)}
.face__name{font-size:clamp(30px,3.6vw,48px);line-height:1.2;color:var(--kakao);margin-top:12px}
.face__name--display,.face__sample--display{font-family:var(--display)}
.face__name--text,.face__sample--text{font-family:var(--text)}
.face__sample{font-size:clamp(20px,2.4vw,28px);line-height:1.3;margin:12px 0}
.scale{display:grid;gap:0;margin:12px 0 0}
.scale li{display:grid;gap:4px;border-top:3px solid var(--brazowy);padding:12px 0}
@media (min-width:760px){.scale li{grid-template-columns:260px 1fr;align-items:baseline;gap:24px}}
.scale__sample--display{font-family:var(--display)}
.scale__sample--text{font-family:var(--text)}
.glyphs{font:400 clamp(22px,3.2vw,36px)/1.4 var(--display);overflow-wrap:anywhere;text-wrap:balance}
.icons{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
@media (min-width:640px){.icons{grid-template-columns:repeat(6,1fr)}}
.icons li{display:grid;justify-items:center;align-content:center;gap:6px;aspect-ratio:1;padding:8px;border-radius:50%;background:var(--krem-jasny);box-shadow:inset 0 0 0 6px var(--piasek);font-size:13px;font-weight:600}
.icons li:nth-child(3n+2){box-shadow:inset 0 0 0 6px var(--musztarda)}
.icons li:nth-child(3n){box-shadow:inset 0 0 0 6px var(--pomarancz)}
.icons img{width:min(72px,50%);height:auto}
.pattern{margin:clamp(40px,6vw,84px) 0 0;height:clamp(150px,26vw,280px);background-size:300px;background-color:var(--krem);border-block:10px solid var(--pomarancz);box-shadow:0 -10px 0 var(--musztarda),0 10px 0 var(--musztarda)}
.graphics{display:grid;gap:24px;margin-top:clamp(40px,5vw,64px)}
@media (min-width:760px){.graphics{grid-template-columns:repeat(3,1fr);gap:32px}}
.graphics li{border-top:12px solid var(--pomarancz);padding-top:14px}
.graphics li:nth-child(2){border-color:var(--musztarda)}
.graphics li:nth-child(3){border-color:var(--brazowy)}
.tone{display:grid;gap:20px}
@media (min-width:760px){.tone{grid-template-columns:1fr 1fr;gap:28px}}
.tone__item{display:grid;gap:8px;align-content:start;padding:clamp(22px,3vw,34px);background:var(--krem);border-radius:0 56px 0 56px}
.tone__item--alt{background:var(--piasek);border-radius:56px 0 56px 0}
.tone__item--alt h4{color:var(--kakao)}
.tone .yes,.tone .no{font-size:16px}
.tone .yes{color:var(--oliwka);font-weight:800}
.tone .no{color:var(--kawa);text-decoration:line-through;text-decoration-color:var(--pomarancz)}
.tag{display:inline-block;min-width:2.8em;margin-right:8px;padding:4px 10px;border-radius:99px;font:800 12px/1 var(--text);letter-spacing:.1em;text-transform:uppercase;text-align:center;text-decoration:none}
.tone .yes .tag{background:var(--oliwka);color:var(--krem-jasny)}
.tone .no .tag{background:var(--kawa);color:var(--krem-jasny)}
.facts{margin:0;display:grid;gap:0}
.facts div{border-top:3px solid var(--kakao);padding:10px 0 12px}
.facts dt{font:800 12px/1 var(--text);letter-spacing:.12em;text-transform:uppercase;margin-bottom:5px}
.facts dd{margin:0}
.film{display:grid;gap:28px;align-items:center}
.film__text{display:grid;gap:16px;align-content:start}
.film__video{width:100%;max-width:520px;height:auto;aspect-ratio:1;background:var(--krem);border-radius:0 80px 0 80px;justify-self:center}
@media (min-width:860px){.film{grid-template-columns:1fr minmax(0,500px);gap:56px}}
.composer{display:grid;gap:24px;align-items:stretch}
@media (min-width:860px){.composer{grid-template-columns:1.2fr 1fr;gap:40px}}
.composer__stage{display:grid;align-content:center;background:var(--krem-jasny);border-radius:0 48px 0 48px;padding:16px;box-shadow:inset 0 0 0 3px var(--len)}
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
.gallery{display:grid;gap:clamp(20px,3vw,36px);margin-bottom:clamp(40px,6vw,72px)}
@media (min-width:760px){.gallery{grid-template-columns:repeat(2,1fr);align-items:start;grid-auto-flow:dense}.gallery__item--papier{grid-row:span 2}}
.gallery__item{display:grid;gap:12px;align-content:start;margin:0;padding:18px;background:var(--krem-jasny);color:var(--kakao);border-radius:0 64px 0 64px}
.gallery__item:nth-child(2n){border-radius:64px 0 64px 0}
.gallery__item img{width:100%;border-radius:18px}
.gallery__item figcaption{display:grid;gap:2px;font-size:15px;padding:0 6px 6px}
.gallery__item strong{font:400 22px/1.2 var(--display);color:var(--brazowy)}
.posts{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;align-items:end}
@media (min-width:760px){.posts{grid-template-columns:repeat(4,1fr)}}
.posts li{display:grid;gap:10px;align-content:start;font-size:14px;font-weight:600;color:var(--krem-jasny)}
.posts img{width:100%;box-sizing:border-box;border:5px solid var(--musztarda);border-radius:22px}
.posts__avatar img{width:calc(100% - 24px);margin:12px;border:0;border-radius:50%;box-shadow:0 0 0 6px var(--pomarancz),0 0 0 12px var(--musztarda)}
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
.cta__sign{display:none}
.cta{display:grid;justify-items:start;gap:20px;max-width:940px;padding-top:clamp(8px,2vw,24px)}
.cta h2{font-size:clamp(32px,5.6vw,68px);line-height:1.2;color:var(--kakao);transform:rotate(-2deg);transform-origin:0 100%;text-wrap:balance}
.cta p{font:600 clamp(18px,2vw,22px)/1.5 var(--text);max-width:34em}
.cta__link{display:inline-block;padding:14px 28px;border-radius:999px;background:var(--brazowy);color:var(--krem-jasny)!important;text-decoration:none;font-weight:800}
.cta__link:hover{background:var(--kakao)}
.cta__steps{list-style:none;margin:22px 0 0;padding:0;display:grid;gap:12px}
.cta__steps li{display:grid;gap:2px;padding:10px 0 0;border-top:3px solid var(--kakao)}
.cta__steps strong{font:800 13px/1.2 var(--text);letter-spacing:.12em;text-transform:uppercase}
.cta__steps span{font-weight:600}
.cta__link{margin-top:26px}
@media (min-width:1100px){.cta{max-width:1160px}.cta>*,.cta p{max-width:min(640px,calc(100% - 400px))}.band--cta .wrap::after{content:'';position:absolute;right:70px;top:50%;width:300px;aspect-ratio:1;border-radius:50%;transform:translateY(-46%);background:var(--krem-jasny);box-shadow:0 0 0 20px var(--pomarancz),0 0 0 40px var(--krem-jasny),0 0 0 60px var(--brazowy)}.cta__sign{display:block;z-index:1;position:absolute;right:98px;top:50%;width:244px;height:244px;transform:translateY(-46%)}}
.foot{margin-top:calc(var(--sw)*-1);padding:calc(var(--sw) + var(--stack) + 28px) 0 40px;background:var(--kakao);color:var(--len);font-size:14px}
.foot p{max-width:1160px;margin:0 auto 4px;padding:0 var(--gut)}
.foot a{color:var(--musztarda)}
.dl__title::after{content:'';display:inline-block;width:9px;height:9px;margin-left:14px;border-right:3px solid var(--rdza);border-bottom:3px solid var(--rdza);transform:translateY(-3px) rotate(45deg);transition:transform .2s}
.dl__row details[open] .dl__title::after{transform:translateY(1px) rotate(-135deg)}
@media (max-width:639px){
.tbl{min-width:0}
.tbl thead{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.tbl,.tbl tbody,.tbl tr,.tbl th,.tbl td{display:block}
.tbl tr{border-top:3px solid var(--piasek);padding:10px 0}
.tbl th,.tbl td{border:0;padding:2px 0}
.tbl td::before{display:inline-block;min-width:5.6em;margin-right:8px;font:800 11px/1.2 var(--text);letter-spacing:.1em;text-transform:uppercase;color:var(--rdza)}
.tbl--colors td:nth-of-type(1)::before{content:'HEX'}
.tbl--colors td:nth-of-type(2)::before{content:'RGB'}
.tbl--colors td:nth-of-type(3)::before{content:'OKLCH'}
.tbl--colors td:nth-of-type(4)::before{content:'CMYK'}
.tbl--contrast td:nth-of-type(1)::before{content:'Para'}
.tbl--contrast td:nth-of-type(2)::before{content:'Kontrast'}
.tbl--contrast td:nth-of-type(3)::before{content:'Wymóg'}
.tbl--contrast td:nth-of-type(4)::before{content:'Poziom'}
}
@media (prefers-reduced-motion:reduce){.hero__badge{animation:none}.dl__title::after{transition:none}.fold summary::after{transition:none}}

@media (max-width:560px){.band{--stack:44px;box-shadow:0 10px 0 var(--a1),0 16px 0 var(--next),0 27px 0 var(--a2),0 33px 0 var(--next),0 44px 0 var(--a3)}}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}.hero__badge{animation:none}.dl__title::after{transition:none}}
`;
