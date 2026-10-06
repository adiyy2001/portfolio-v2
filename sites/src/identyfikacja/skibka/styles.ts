const grain = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320"><filter id="n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="4" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.23 0 0 0 0 0.19 0 0 0 0 0.16 0 0 0 0.9 -0.34"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`,
);

export const css = `
:root{color-scheme:light;--zyto:#3a3128;--skorka:#8f5530;--lan:#4f5b33;--lan-jasny:#6b7a4a;--kraft:#c9ad83;--maka-biala:#faf7f0;--maka:#f2ede2;--otreby:#e4d7bc;--mioz:#a08b6d;--popiol:#6a5d4d;--skip-bg:#3a3128;--skip-fg:#faf7f0;--gut:clamp(16px,4vw,48px);--display:'Skibka Display',Georgia,'Times New Roman',serif;--text:'Skibka Text',system-ui,'Segoe UI',Arial,sans-serif}
body.skibka{margin:0;background-color:var(--maka);background-image:url("data:image/svg+xml;charset=utf-8,${grain}");color:var(--zyto);font:400 17px/1.6 var(--text)}
:where(.skibka) a{color:var(--skorka);text-underline-offset:3px}
.skibka a:focus-visible,.skibka button:focus-visible,.skibka summary:focus-visible{outline:3px solid var(--skorka);outline-offset:3px}
:where(.skibka) :is(h1,h2,h3,h4){margin:0;font-family:var(--display);font-weight:400;line-height:1.1}
:where(.skibka) p{margin:0}
:where(.skibka) img{display:block;height:auto}
.skibka .filters{position:absolute;width:0;height:0}
.skibka .muted{color:var(--popiol);font-size:15px}
.top{display:flex;justify-content:space-between;gap:16px;padding:20px var(--gut);font-size:15px}
.top a{color:var(--zyto)}
main{display:block;max-width:1120px;margin:0 auto;padding:0 var(--gut)}
.kicker{font:700 13px/1.4 var(--text);letter-spacing:.14em;text-transform:uppercase;color:var(--skorka);margin-bottom:18px}
.hero{display:grid;gap:32px;align-items:center;padding:clamp(16px,4vw,48px) 0 clamp(32px,6vw,72px)}
.hero>*{min-width:0}
.hero h1{font-size:clamp(76px,13vw,168px);line-height:.92;letter-spacing:-.015em;margin-bottom:20px}
.hero__lead{font:400 clamp(22px,3vw,32px)/1.3 var(--display);max-width:22em;margin-bottom:28px}
.hero__facts{display:grid;gap:14px;margin:0 0 28px;max-width:34em}
.hero__facts div{border-top:2px solid var(--zyto);padding-top:8px}
.hero__facts dt{font:700 12px/1 var(--text);letter-spacing:.12em;text-transform:uppercase;color:var(--skorka);margin-bottom:5px}
.hero__facts dd{margin:0}
.hero__nav ul{display:flex;flex-wrap:wrap;gap:8px 18px;margin:0;padding:0;list-style:none}
.hero__nav a{color:var(--zyto);font-weight:500}
.hero__art{margin:0}
.hero__art svg{width:100%;height:auto;overflow:visible}
.hero__shadow{filter:drop-shadow(0 14px 14px rgba(58,49,40,.28))}
@media (min-width:900px){.hero{grid-template-columns:minmax(0,1.05fr) minmax(0,1fr)}}
.band{padding:clamp(24px,5vw,56px) 0;display:grid;gap:clamp(20px,3vw,36px)}
.band__title{font-size:clamp(36px,6vw,64px)}
.band__sub{font-size:clamp(26px,3.6vw,36px)}
.band__lead{font:400 clamp(19px,2.2vw,24px)/1.45 var(--display);max-width:34em}
.paper{position:relative;isolation:isolate;display:grid;gap:14px;align-content:start;padding:clamp(22px,3.4vw,44px);margin:0}
.paper::before{content:'';position:absolute;inset:0;z-index:-1;background:var(--maka-biala);transform:rotate(var(--tilt,0deg));box-shadow:0 12px 24px -14px rgba(58,49,40,.5),0 2px 4px rgba(58,49,40,.18);filter:url(#paper-edge)}
.paper--kraft::before{background:var(--kraft)}
.paper--chosen::before{outline:4px solid var(--skorka);outline-offset:-10px}
.paper--wide{gap:20px}
.paper h3{font-size:clamp(28px,3.6vw,40px)}
.paper h4{font:700 15px/1.3 var(--text);letter-spacing:.06em;text-transform:uppercase;color:var(--skorka);margin:6px 0 4px}
.paper--kraft h4{color:var(--zyto)}
.paper--kraft .muted{color:var(--zyto)}
.prose{display:grid;gap:14px;max-width:38em}
.prose p,.prose-p{font-size:18px}
.prose-p{max-width:44em}
.two{display:grid;gap:28px;align-items:start}
@media (min-width:860px){.two{grid-template-columns:1.3fr 1fr;gap:56px}.two--even{grid-template-columns:1fr 1fr}}
.facts{margin:0;display:grid;gap:0}
.facts div{border-top:2px solid var(--zyto);padding:12px 0 14px}
.facts dt{font:700 12px/1 var(--text);letter-spacing:.12em;text-transform:uppercase;color:var(--skorka);margin-bottom:6px}
.facts dd{margin:0}
.facts--row{gap:0 32px}
@media (min-width:860px){.facts--row{grid-template-columns:repeat(3,1fr)}}
.keywords{display:flex;flex-wrap:wrap;gap:4px 28px;font:400 clamp(40px,7vw,88px)/1 var(--display);margin-top:8px}
.paper blockquote{margin:8px 0 0;padding:0 0 0 24px;border-left:6px solid var(--skorka);font:400 clamp(22px,2.6vw,30px)/1.35 var(--display);max-width:30em}
.cards{display:grid;gap:clamp(20px,3vw,32px)}
@media (min-width:760px){.cards.three{grid-template-columns:repeat(3,1fr)}}
.paper--reject img,.paper--chosen img{width:100%;max-width:180px;aspect-ratio:1;background:var(--maka);padding:8px;margin-bottom:14px}
.paper--reject p,.paper--chosen p,.cards .paper p{margin-top:8px}
.cards--inner{gap:20px 32px}
.cards--inner div{border-top:2px solid var(--zyto);padding-top:10px}
.kern{display:grid;gap:20px}
@media (min-width:640px){.kern{grid-template-columns:1fr 1fr}}
.kern figure{margin:0;background:var(--maka);padding:20px}
.kern img{width:100%;max-width:360px;margin:0 auto}
.kern figcaption{margin-top:10px;font:700 14px/1 var(--text);text-align:center}
.sizes{display:flex;flex-wrap:wrap;align-items:flex-end;gap:20px 32px;margin:8px 0;padding:0;list-style:none}
.sizes li{display:grid;gap:8px;justify-items:start}
.sizes span{font-size:13px;color:var(--popiol);max-width:9em}
.variants{display:grid;gap:16px;margin:0;padding:0;list-style:none}
@media (min-width:640px){.variants{grid-template-columns:repeat(2,1fr)}}
@media (min-width:960px){.variants{grid-template-columns:repeat(3,1fr)}}
.variants li{padding:20px;display:grid;gap:14px;align-content:space-between;min-height:220px}
.variants img{max-height:120px;width:auto;max-width:100%;margin:0 auto}
.variants p{display:grid;gap:2px;font-size:14px}
.variants strong{font-size:16px}
.ground--maka-biala{background:var(--maka-biala);border:2px solid var(--otreby)}
.ground--otreby{background:var(--otreby)}
.ground--kraft{background:var(--kraft)}
.ground--white{background:#fff;border:2px solid var(--otreby)}
.ground--zyto{background:var(--zyto);color:var(--maka)}
.clear{margin:0;background:var(--maka);padding:16px}
.clear img{width:100%}
.plain{display:grid;gap:8px;margin:0;padding:0;list-style:none}
.plain--rules li{border-top:2px solid var(--zyto);padding-top:10px}
.swatches{display:grid;grid-template-columns:repeat(2,1fr);gap:18px 14px;margin:0;padding:0;list-style:none}
@media (min-width:640px){.swatches{grid-template-columns:repeat(5,1fr)}}
.swatches li{display:grid;gap:3px;font-size:14px;align-content:start}
.swatches__chip{display:block;height:64px;margin-bottom:6px;box-shadow:inset 0 0 0 1px rgba(58,49,40,.25)}
.swatches strong{font:400 22px/1.1 var(--display)}
.swatches em{font-style:normal;color:var(--popiol);font-size:13px}
.tbl-wrap{overflow-x:auto;max-width:100%}
.tbl{border-collapse:collapse;width:100%;min-width:560px;font-size:14px}
.tbl th,.tbl td{text-align:left;padding:9px 10px;border-top:2px solid var(--otreby);vertical-align:middle}
.tbl thead th{font:700 12px/1.2 var(--text);letter-spacing:.1em;text-transform:uppercase;color:var(--skorka);border-top:0}
.tbl tbody th{font-weight:500}
.tbl__chip{display:inline-block;width:18px;height:18px;margin-right:8px;border-radius:50%;vertical-align:-3px;box-shadow:inset 0 0 0 2px rgba(58,49,40,.5)}
.tbl__pair{display:inline-block;padding:2px 8px;margin-right:8px;font:400 15px/1.3 var(--display);box-shadow:inset 0 0 0 1px rgba(58,49,40,.25)}
.face__name{font-size:clamp(40px,6vw,72px);line-height:1}
.face__name--display,.face__sample--display{font-family:var(--display)}
.face__name--text,.face__sample--text{font-family:var(--text)}
.face__sample{font-size:clamp(20px,2.4vw,28px);line-height:1.3;margin:12px 0}
.scale{display:grid;gap:0;margin:12px 0 0;padding:0;list-style:none}
.scale li{display:grid;gap:4px;border-top:2px solid var(--otreby);padding:12px 0}
@media (min-width:760px){.scale li{grid-template-columns:260px 1fr;align-items:baseline;gap:24px}}
.scale__sample--display{font-family:var(--display)}
.scale__sample--text{font-family:var(--text)}
.glyphs{font:400 clamp(26px,4vw,44px)/1.4 var(--display);overflow-wrap:anywhere}
.icons{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:0;padding:0;list-style:none}
@media (min-width:640px){.icons{grid-template-columns:repeat(6,1fr)}}
.icons li{display:grid;justify-items:center;gap:8px;padding:16px 4px;background:var(--maka);font-size:13px}
.icons img{width:40px;height:40px}
.pattern{height:clamp(140px,26vw,260px);background-size:300px;background-color:var(--otreby)}
.tone{display:grid;gap:20px}
@media (min-width:760px){.tone{grid-template-columns:1fr 1fr;gap:24px 40px}}
.tone article{border-top:2px solid var(--zyto);padding-top:12px;display:grid;gap:8px;align-content:start}
.tone h4{margin:0}
.tone .yes,.tone .no{font-size:16px}
.tone .yes{color:var(--lan);font-weight:700}
.tone .no{color:var(--popiol);text-decoration:line-through;text-decoration-color:var(--skorka)}
.tag{display:inline-block;min-width:2.8em;margin-right:8px;font:700 12px/1 var(--text);letter-spacing:.1em;text-transform:uppercase}
.film{width:100%;max-width:520px;height:auto;aspect-ratio:1;background:var(--maka)}
.press-wrap{display:grid;gap:14px;padding:clamp(24px,5vw,56px) 0}
.press-wrap h3{font-size:clamp(30px,4.4vw,48px)}
.press{display:grid;gap:12px}
.press__pad{position:relative;display:block;width:100%;height:clamp(260px,46vw,420px);overflow:hidden;border:0;padding:0;cursor:crosshair;background-color:var(--kraft);background-image:url("data:image/svg+xml;charset=utf-8,${grain}");color:var(--zyto);font:inherit;box-shadow:0 12px 24px -14px rgba(58,49,40,.5)}
.press__label{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font:400 clamp(26px,5vw,44px)/1 var(--display);opacity:.5;pointer-events:none;white-space:nowrap}
.press__mark{position:absolute;pointer-events:none;filter:url(#stamp-ink);animation:press-in .22s cubic-bezier(.2,.7,.2,1)}
.press__bar{display:flex;flex-wrap:wrap;align-items:center;gap:8px 24px}
.press__hint{flex:1 1 280px;color:var(--popiol);font-size:15px}
.press__count{font-weight:700}
.press__clear{padding:10px 18px;border:2px solid var(--zyto);background:transparent;color:var(--zyto);font:600 15px/1 var(--text);cursor:pointer}
.press__clear:disabled{opacity:.4;cursor:default}
@keyframes press-in{from{transform:scale(1.35);opacity:0}}
.gallery{display:grid;gap:clamp(20px,3vw,36px)}
@media (min-width:760px){.gallery{grid-template-columns:repeat(2,1fr);align-items:start}.gallery{grid-auto-flow:dense}.gallery__item--papier{grid-row:span 2}}
.gallery__item{display:grid;gap:12px;align-content:start}
.gallery__item img{width:100%}
.gallery__item figcaption{display:grid;gap:2px;font-size:15px}
.gallery__item strong{font:400 22px/1.2 var(--display)}
.posts{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin:0;padding:0;list-style:none}
@media (min-width:760px){.posts{grid-template-columns:repeat(4,1fr)}}
.posts li{display:grid;gap:8px;align-content:start;font-size:14px}
.posts img{width:100%;box-shadow:0 10px 18px -12px rgba(58,49,40,.5)}
.dl{display:grid;gap:18px}
.dl__zip{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px 24px;padding:20px 24px;background:var(--zyto);color:var(--maka-biala);text-decoration:none;font:400 clamp(22px,3vw,30px)/1.2 var(--display)}
.dl__zip:hover{background:var(--lan)}
.dl__zip-size{font:600 16px/1 var(--text);color:var(--kraft)}
.dl__list{margin:0;padding:0;list-style:none}
.dl__row{border-top:2px solid var(--otreby)}
.dl__row summary{display:grid;grid-template-columns:1fr auto;gap:2px 16px;padding:14px 0;cursor:pointer;list-style:none}
.dl__row summary::-webkit-details-marker{display:none}
.dl__title{font:400 22px/1.2 var(--display)}
.dl__formats{grid-column:1;color:var(--popiol);font-size:14px}
.dl__count{grid-column:2;grid-row:1;font-size:14px;text-align:right}
.dl__size{grid-column:2;grid-row:2;font-size:14px;color:var(--popiol);text-align:right}
.dl__files{margin:0 0 14px;padding:0;list-style:none;display:grid;gap:4px}
.dl__files li{display:grid;grid-template-columns:1fr auto auto;gap:4px 16px;font-size:14px;padding:6px 0}
.dl__files a{overflow-wrap:anywhere}
.dl__dim,.dl__bytes{color:var(--popiol);white-space:nowrap}
.cta{padding:clamp(24px,5vw,56px) 0 clamp(40px,7vw,88px)}
.cta .paper{display:grid;gap:16px;justify-items:start;max-width:46em}
.cta h2{font-size:clamp(32px,5vw,52px)}
.cta__link{display:inline-block;padding:14px 22px;background:var(--zyto);color:var(--maka-biala);text-decoration:none;font-weight:600}
.foot{padding:24px 0 40px;border-top:2px solid var(--zyto);font-size:14px;color:var(--popiol)}
.foot p{max-width:1120px;margin:0 auto 4px;padding:0 var(--gut)}
.foot a{color:var(--zyto)}
@media (prefers-reduced-motion:reduce){.press__mark{animation:none}}
`;
