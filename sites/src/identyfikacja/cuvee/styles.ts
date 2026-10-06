export const css = `
:root{color-scheme:light;--czern:#15110e;--kosc:#f3ecdd;--mosiadz:#b08d57;--mosiadz-ciemny:#7a5a2a;--szampan:#d7be8d;--papier:#faf6ec;--len:#e5dcc8;--kamien:#c9bfa8;--mgla:#8c8472;--wegiel:#4a443a;--skip-bg:#15110e;--skip-fg:#f3ecdd;--gut:clamp(20px,6vw,72px);--display:'Cuvee Display',Georgia,'Times New Roman',serif;--text:'Cuvee Text',Georgia,'Times New Roman',serif}
body.cuvee{margin:0;background:var(--kosc);color:var(--czern);font:400 18px/1.65 var(--text);font-feature-settings:'kern','liga','onum'}
:where(.cuvee) a{color:var(--mosiadz-ciemny);text-underline-offset:4px;text-decoration-thickness:1px}
.cuvee a:focus-visible,.cuvee button:focus-visible,.cuvee summary:focus-visible{outline:2px solid var(--mosiadz-ciemny);outline-offset:4px}
.cuvee .dark a:focus-visible,.cuvee .dark button:focus-visible,.cuvee .cover a:focus-visible{outline-color:var(--szampan)}
:where(.cuvee) :is(h1,h2,h3,h4){margin:0;font-family:var(--display);font-weight:300;line-height:1.1}
:where(.cuvee) p{margin:0}
:where(.cuvee) img{display:block;height:auto}
.cuvee .caps{font-family:var(--display);font-weight:400;font-variant-caps:all-small-caps;letter-spacing:.22em;font-feature-settings:'smcp','c2sc','kern'}
.cuvee .muted{color:var(--wegiel);font-size:16px}
.top{position:absolute;left:0;right:0;top:0;z-index:2;display:flex;justify-content:space-between;gap:16px;padding:28px var(--gut);font-size:14px}
.top a{color:var(--kosc);text-decoration:none;font-family:var(--display);font-variant-caps:all-small-caps;letter-spacing:.2em;font-size:16px}
.top a:hover{color:var(--szampan)}
.cover{position:relative;background:var(--czern);color:var(--kosc);padding:clamp(120px,18vw,200px) var(--gut) clamp(48px,8vw,96px)}
.cover__in{max-width:1120px;margin:0 auto;display:grid;gap:clamp(40px,7vw,88px)}
.cover__logo{width:min(100%,760px);animation:slow-in 2.4s ease both}
.cover__rule{height:1px;background:var(--mosiadz);animation:slow-in 2.4s ease .6s both}
.cover__body{display:grid;gap:clamp(28px,4vw,48px);animation:slow-in 2.4s ease 1.1s both}
.cover__kicker{font-size:17px;color:var(--szampan)}
.cover__lead{font:italic 300 clamp(28px,4.4vw,52px)/1.2 var(--display);max-width:20em}
.cover__facts{display:grid;gap:0 40px;margin:0}
.cover__facts div{border-top:1px solid var(--mosiadz);padding:14px 0 18px}
.cover__facts dt{font-size:15px;color:var(--szampan);margin-bottom:6px}
.cover__facts dd{margin:0;font-size:17px;color:var(--kosc)}
.cover__nav ul{display:flex;flex-wrap:wrap;gap:10px 28px;margin:0;padding:0;list-style:none}
.cover__nav a{color:var(--kosc);text-decoration:none;font-family:var(--display);font-variant-caps:all-small-caps;letter-spacing:.2em;font-size:16px;border-bottom:1px solid var(--mosiadz);padding-bottom:3px}
.cover__nav a:hover{color:var(--szampan)}
@media (min-width:820px){.cover__facts{grid-template-columns:repeat(3,1fr)}}
@keyframes slow-in{from{opacity:0}to{opacity:1}}
.sheet{padding:0 var(--gut)}
.sec{max-width:1120px;margin:0 auto;padding:clamp(56px,9vw,120px) 0;border-top:1px solid var(--kamien);display:grid;gap:clamp(24px,4vw,56px)}
.sheet .sec:first-child{border-top:0}
.sec__head{display:grid;gap:10px;align-content:start}
.sec__num{font:italic 300 22px/1 var(--display);color:var(--mosiadz-ciemny);font-variant-numeric:oldstyle-nums}
.sec__title{font-size:clamp(34px,4.4vw,52px)}
.sec__body{display:grid;gap:clamp(24px,3.4vw,44px);min-width:0}
@media (min-width:900px){.sec{grid-template-columns:minmax(0,260px) minmax(0,1fr);gap:clamp(40px,6vw,96px)}.sec__head{position:sticky;top:32px}}
.col{max-width:36em;display:grid;gap:18px;font-size:19px}
.lead{font:italic 400 clamp(20px,2.3vw,25px)/1.5 var(--text);color:var(--wegiel);max-width:34em}
.facts{margin:0;display:grid}
.facts div{border-top:1px solid var(--mosiadz);padding:14px 0 18px}
.facts dt{font-size:15px;color:var(--mosiadz-ciemny);margin-bottom:5px}
.facts dd{margin:0}
@media (min-width:700px){.facts--row{grid-template-columns:repeat(3,1fr);gap:0 32px}}
.sub{font-size:clamp(26px,3.2vw,34px)}
.keywords{display:grid;gap:0;font:italic 200 clamp(56px,9vw,112px)/1.05 var(--display)}
.pillars{display:grid;grid-template-columns:minmax(0,1fr);gap:28px}
.pillars article{border-top:1px solid var(--mosiadz);padding-top:16px;display:grid;gap:8px;align-content:start}
.pillars h3{font-size:30px}
.pillars .n{font:italic 300 20px/1 var(--display);color:var(--mosiadz-ciemny);font-variant-numeric:oldstyle-nums}
@media (min-width:700px){.pillars{grid-template-columns:repeat(3,1fr);gap:32px}}
.cuvee blockquote{margin:0;border-top:1px solid var(--mosiadz);padding-top:22px;font:italic 300 clamp(24px,3vw,34px)/1.35 var(--display);max-width:26em}
.cuvee :is(.plates,.pair,.variants,.pillars,.tone,.notes,.faces,.gallery,.composer,.facts,.cover__facts)>*{min-width:0}
.plates{display:grid;grid-template-columns:minmax(0,1fr);gap:28px}
.plate{border-top:1px solid var(--mosiadz);padding-top:16px;display:grid;grid-template-columns:minmax(0,1fr);gap:10px;align-content:start}
.plate__art{background:var(--papier);border:1px solid var(--kamien);padding:18px;display:grid;grid-template-columns:minmax(0,1fr);justify-items:center;align-items:center;aspect-ratio:3/2;min-width:0}
.plate__art img{width:100%;max-width:240px;height:auto}
.plate--chosen .plate__art{border-color:var(--mosiadz)}
.plate__tag{font-size:15px;color:var(--mosiadz-ciemny)}
.plate h3{font-size:28px}
@media (min-width:760px){.plates{grid-template-columns:repeat(3,1fr);gap:28px}}
.pair{display:grid;grid-template-columns:minmax(0,1fr);gap:16px}
.pair figure{margin:0;background:var(--papier);border:1px solid var(--kamien);padding:20px 16px 14px}
.pair img{width:100%;max-width:420px;margin:0 auto}
.pair figcaption{margin-top:10px;font-size:14px;color:var(--wegiel);text-align:center}
@media (min-width:640px){.pair{grid-template-columns:1fr 1fr}}
.sizes{display:flex;flex-wrap:wrap;align-items:flex-end;gap:20px 32px;margin:0;padding:0;list-style:none}
.sizes li{display:grid;gap:8px;justify-items:start}
.sizes span{font-size:13px;color:var(--wegiel);max-width:9em}
.variants{display:grid;gap:14px;margin:0;padding:0;list-style:none}
@media (min-width:560px){.variants{grid-template-columns:repeat(2,1fr)}}
@media (min-width:1000px){.variants{grid-template-columns:repeat(3,1fr)}}
.variants li{padding:20px;display:grid;gap:14px;align-content:space-between;min-height:220px;border:1px solid var(--kamien)}
.variants img{max-height:120px;width:auto;max-width:100%;margin:0 auto}
.variants p{display:grid;gap:2px;font-size:14px}
.variants strong{font:400 15px/1.2 var(--display);font-variant-caps:all-small-caps;letter-spacing:.2em}
.ground--papier{background:var(--papier)}
.ground--len{background:var(--len)}
.ground--white{background:#fff}
.ground--czern{background:var(--czern);color:var(--kosc);border-color:var(--czern)!important}
.clear{margin:0;background:var(--papier);border:1px solid var(--kamien);padding:16px}
.clear img{width:100%}
.plain{display:grid;gap:10px;margin:0;padding:0;list-style:none}
.plain li{border-top:1px solid var(--mosiadz);padding-top:10px}
.swatches{display:grid;grid-template-columns:repeat(2,1fr);gap:20px 16px;margin:0;padding:0;list-style:none}
@media (min-width:640px){.swatches{grid-template-columns:repeat(5,1fr)}}
.swatches li{display:grid;gap:3px;font-size:14px;align-content:start}
.swatches__chip{display:block;height:72px;margin-bottom:8px;border:1px solid var(--kamien)}
.swatches strong{font:300 21px/1.15 var(--display)}
.swatches em{font-style:normal;color:var(--wegiel);font-size:13px;line-height:1.4}
.tbl-wrap{overflow-x:auto;max-width:100%}
.tbl{border-collapse:collapse;width:100%;min-width:560px;font-size:14px}
.tbl th,.tbl td{text-align:left;padding:9px 10px 9px 0;border-top:1px solid var(--kamien);vertical-align:middle}
.tbl thead th{font:400 14px/1.2 var(--display);font-variant-caps:all-small-caps;letter-spacing:.2em;color:var(--mosiadz-ciemny);border-top:0}
.tbl tbody th{font-weight:400}
.tbl__chip{display:inline-block;width:16px;height:16px;margin-right:8px;border-radius:50%;vertical-align:-3px;border:1px solid var(--czern)}
.tbl__pair{display:inline-block;padding:2px 8px;margin-right:8px;font:400 15px/1.3 var(--display);border:1px solid var(--kamien)}
.faces{display:grid;grid-template-columns:minmax(0,1fr);gap:28px}
@media (min-width:700px){.faces{grid-template-columns:1fr 1fr;gap:40px}}
.face__name{font-size:clamp(34px,4.4vw,54px);line-height:1.05}
.face__name--display{font-family:var(--display);font-weight:300}
.face__name--text{font-family:var(--text);font-weight:400}
.face__sample{font-size:clamp(20px,2.2vw,26px);line-height:1.35;margin:12px 0}
.face__sample--display{font-family:var(--display);font-weight:300}
.scale{display:grid;margin:0;padding:0;list-style:none}
.scale li{display:grid;gap:4px;border-top:1px solid var(--kamien);padding:14px 0}
.scale__sample--display{font-family:var(--display)}
.scale__sample--text{font-family:var(--text)}
.scale__sample--caps{font-family:var(--display);font-variant-caps:all-small-caps;letter-spacing:.22em}
@media (min-width:760px){.scale li{grid-template-columns:240px 1fr;align-items:baseline;gap:24px}}
.glyphs{font:300 clamp(26px,3.6vw,40px)/1.4 var(--display);overflow-wrap:anywhere}
.icons{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:0;padding:0;list-style:none}
@media (min-width:640px){.icons{grid-template-columns:repeat(6,1fr)}}
.icons li{display:grid;justify-items:center;gap:10px;padding:18px 4px;background:var(--papier);border:1px solid var(--kamien);font-size:12px;color:var(--wegiel)}
.icons img{width:40px;height:40px}
.pattern{height:clamp(140px,24vw,240px);background-size:150px;background-color:var(--papier);border:1px solid var(--kamien)}
.notes{display:grid;grid-template-columns:minmax(0,1fr);gap:22px}
.notes div{border-top:1px solid var(--mosiadz);padding-top:10px;display:grid;gap:6px}
.notes h4{font-size:24px}
@media (min-width:700px){.notes{grid-template-columns:1fr 1fr;gap:22px 32px}}
.tone{display:grid;grid-template-columns:minmax(0,1fr);gap:26px}
.tone article{border-top:1px solid var(--mosiadz);padding-top:14px;display:grid;gap:8px;align-content:start}
.tone h4{font-size:26px}
.tone .yes,.tone .no{font-size:16px}
.tone .no{color:var(--wegiel);text-decoration:line-through;text-decoration-color:var(--mosiadz-ciemny)}
.tag{display:inline-block;min-width:3em;margin-right:8px;font:400 14px/1 var(--display);font-variant-caps:all-small-caps;letter-spacing:.2em;color:var(--mosiadz-ciemny);text-decoration:none}
@media (min-width:760px){.tone{grid-template-columns:1fr 1fr;gap:28px 40px}}
.film{width:100%;max-width:520px;height:auto;aspect-ratio:1;background:var(--czern)}
.dark{background:var(--czern);color:var(--kosc);padding:0 var(--gut)}
.dark .sec{border-top:0}
.dark .sec__num{color:var(--mosiadz)}
.dark .lead{color:var(--kamien)}
.dark a{color:var(--szampan)}
.composer{display:grid;grid-template-columns:minmax(0,1fr);gap:clamp(32px,5vw,64px);align-items:start}
@media (min-width:900px){.composer{grid-template-columns:minmax(0,380px) minmax(0,1fr)}}
.composer__stage{display:grid;place-items:center;padding:clamp(20px,4vw,40px);background:var(--len)}
.lab-wrap{container-type:inline-size;width:min(100%,380px)}
.lab{position:relative;display:flex;flex-direction:column;aspect-ratio:560/860;background:var(--papier);color:var(--czern);padding:9.6cqw 10.4cqw;border:1px solid var(--mosiadz);outline:1px solid var(--mosiadz);outline-offset:-2.5cqw;box-shadow:0 22px 40px -26px rgba(21,17,14,.6)}
.lab__logo{width:100%;padding:0 2.5cqw}
.lab__year{font:200 26.8cqw/1 var(--display);text-align:center;margin-top:16cqw;font-variant-numeric:lining-nums}
.lab__grapes{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:1cqw 2.5cqw;margin-top:4.6cqw;font-size:3.7cqw;min-height:5cqw}
.lab__grapes span{display:inline-flex;align-items:center;gap:2.5cqw}
.lab__grapes i{width:.9cqw;height:.9cqw;background:var(--mosiadz);border-radius:50%}
.lab__prop{display:flex;gap:.7cqw;margin:4.6cqw 12.5cqw 0}
.lab__prop b{height:1px;background:var(--czern)}
.lab__app{text-align:center;margin-top:auto;font-size:3.7cqw;color:var(--mosiadz-ciemny)}
.lab__note{text-align:center;font:italic 400 3.4cqw/1.5 var(--text);color:var(--wegiel);margin-top:1.8cqw}
.lab__foot{display:flex;justify-content:space-between;margin-top:5cqw;font-size:3cqw;color:var(--wegiel)}
.composer__controls{display:grid;gap:30px}
.composer fieldset{border:0;margin:0;padding:0;min-width:0;display:grid;gap:12px}
.composer legend{padding:0;margin-bottom:12px;font:400 16px/1 var(--display);font-variant-caps:all-small-caps;letter-spacing:.22em;color:var(--szampan)}
.chips,.years{display:grid;gap:8px;margin:0;padding:0;list-style:none}
@media (min-width:560px){.chips{grid-template-columns:repeat(2,1fr)}}
.chip{width:100%;display:grid;gap:2px;text-align:left;padding:12px 16px;background:transparent;color:var(--kosc);border:1px solid var(--mgla);font:inherit;cursor:pointer;transition:border-color .6s ease,background-color .6s ease}
.chip__name{font:300 22px/1.2 var(--display)}
.chip__note{font-size:14px;color:var(--kamien)}
.chip[aria-pressed=true]{border-color:var(--mosiadz);background:rgba(176,141,87,.14)}
.chip[aria-pressed=true] .chip__name::before{content:'';display:inline-block;width:7px;height:7px;margin-right:10px;border-radius:50%;background:var(--mosiadz);vertical-align:2px}
.chip:disabled{cursor:default}
.chip:disabled:not([aria-pressed=true]){opacity:.5}
.years{grid-template-columns:repeat(3,1fr)}
@media (min-width:560px){.years{grid-template-columns:repeat(6,1fr)}}
.year{width:100%;padding:12px 4px;background:transparent;color:var(--kosc);border:1px solid var(--mgla);font:300 20px/1 var(--display);cursor:pointer;transition:border-color .6s ease,background-color .6s ease}
.year[aria-pressed=true]{border-color:var(--mosiadz);background:rgba(176,141,87,.14)}
.composer__label{font-size:16px;color:var(--szampan);margin-bottom:8px}
.blend{display:grid;margin:0;padding:0;list-style:none}
.blend li{display:grid;grid-template-columns:3em 1fr auto;gap:12px;align-items:baseline;border-top:1px solid var(--mosiadz);padding:10px 0}
.blend__share{font:300 24px/1 var(--display);font-variant-numeric:lining-nums}
.blend__name{font-size:18px}
.blend__lead{font-size:14px;color:var(--kamien);font-style:italic}
.blend__up{background:transparent;border:0;border-bottom:1px solid var(--mosiadz);padding:0 0 2px;color:var(--szampan);font:400 14px/1.4 var(--text);cursor:pointer}
.composer__summary{font:italic 300 clamp(20px,2.4vw,26px)/1.4 var(--display);color:var(--kosc);border-top:1px solid var(--mosiadz);padding-top:18px}
.gallery{display:grid;grid-template-columns:minmax(0,1fr);gap:clamp(28px,4vw,48px)}
@media (min-width:900px){.gallery{grid-template-columns:repeat(2,minmax(0,1fr));align-items:start}.gallery figure:nth-child(3){grid-row:span 2}}
.gallery figure{margin:0;display:grid;gap:12px;align-content:start}
.gallery img{width:100%;border:1px solid var(--kamien)}
.gallery figcaption{display:grid;gap:3px;font-size:15px;color:var(--wegiel)}
.gallery strong{font:300 24px/1.2 var(--display);color:var(--czern)}
.posts{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin:0;padding:0;list-style:none}
@media (min-width:760px){.posts{grid-template-columns:repeat(4,1fr)}}
.posts li{display:grid;gap:8px;align-content:start;font-size:14px;color:var(--wegiel)}
.posts img{width:100%;border:1px solid var(--kamien)}
.dl{display:grid;gap:18px}
.dl__zip{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px 24px;padding:20px 24px;background:var(--czern);color:var(--kosc);text-decoration:none;font:300 clamp(22px,3vw,28px)/1.2 var(--display);border:1px solid var(--czern)}
.dl__zip:hover{background:var(--wegiel)}
.dl__zip-size{font:400 16px/1 var(--text);color:var(--szampan)}
.dl__list{margin:0;padding:0;list-style:none}
.dl__row{border-top:1px solid var(--kamien)}
.dl__row summary{display:grid;grid-template-columns:1fr auto;gap:2px 16px;padding:14px 0;cursor:pointer;list-style:none}
.dl__row summary::-webkit-details-marker{display:none}
.dl__title{font:300 22px/1.2 var(--display)}
.dl__formats{grid-column:1;color:var(--wegiel);font-size:14px}
.dl__count{grid-column:2;grid-row:1;font-size:14px;text-align:right}
.dl__size{grid-column:2;grid-row:2;font-size:14px;color:var(--wegiel);text-align:right}
.dl__files{margin:0 0 14px;padding:0;list-style:none;display:grid;gap:4px}
.dl__files li{display:grid;grid-template-columns:1fr auto auto;gap:4px 16px;font-size:14px;padding:6px 0}
.dl__files a{overflow-wrap:anywhere}
.dl__dim,.dl__bytes{color:var(--wegiel);white-space:nowrap}
.cta .sec{padding-bottom:clamp(56px,9vw,120px)}
.cta__in{display:grid;gap:20px;justify-items:start;max-width:36em}
.cta h2{font-size:clamp(32px,5vw,56px);font-weight:200}
.cta__link{display:inline-block;padding:14px 24px;border:1px solid var(--mosiadz);color:var(--kosc)!important;text-decoration:none;font:400 16px/1 var(--display);font-variant-caps:all-small-caps;letter-spacing:.2em;transition:background-color .6s ease}
.cta__link:hover{background:rgba(176,141,87,.2)}
.foot{background:var(--czern);color:var(--kamien);padding:0 var(--gut) 40px;font-size:14px}
.foot__in{max-width:1120px;margin:0 auto;border-top:1px solid var(--mgla);padding-top:22px;display:grid;gap:4px}
.foot a{color:var(--szampan)}
@media (prefers-reduced-motion:reduce){.cover__logo,.cover__rule,.cover__body{animation:none}.chip,.year,.cta__link{transition:none}}
`;
