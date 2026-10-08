const grid =
  'linear-gradient(to right,rgba(207,224,238,.75) 0,rgba(207,224,238,.75) 1px,transparent 1px),linear-gradient(to bottom,rgba(207,224,238,.75) 0,rgba(207,224,238,.75) 1px,transparent 1px)';

const ruled =
  'repeating-linear-gradient(to bottom,transparent 0,transparent 31px,#DCE8F2 31px,#DCE8F2 32px)';

export const css = `
.margines{
  --papier:#FBF8F0;--kratka:#CFE0EE;--atrament:#1E2A5E;--flamaster:#E2433B;--flamaster-ui:#C2302A;--zakreslacz:#FFE45E;--zielen:#2E9E5B;--zielen-ui:#1F7A45;--olowek:#6B7080;--mieta:#B8EBD0;
  --gut:clamp(16px,4vw,48px);--mw:190px;--skip-bg:#1E2A5E;--skip-fg:#FFE45E;
  color-scheme:light;
  background-color:var(--papier);
  background-image:${grid};
  background-size:24px 24px;
  color:var(--atrament);
  font:400 17px/1.65 'Lexend',system-ui,'Segoe UI',Arial,sans-serif;
}
.margines a{color:var(--atrament);text-decoration-color:var(--flamaster);text-decoration-thickness:2px;text-underline-offset:4px}
.margines a:focus-visible,.margines button:focus-visible,.margines [tabindex]:focus-visible,.margines summary:focus-visible{outline:3px solid var(--flamaster);outline-offset:3px}
.margines .hand{font-family:'Caveat',cursive;font-weight:600}
.margines .top{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;max-width:1320px;margin:0 auto;padding:18px var(--gut);font-size:15px}
.margines h1,.margines h2,.margines h3{font-family:'Caveat',cursive;font-weight:700;letter-spacing:-.005em;text-wrap:balance;hyphens:none;margin:0}
.margines h2{font-size:clamp(40px,5.4vw,66px);line-height:1;margin-bottom:22px;max-width:15em}
.margines .body{margin:0 0 16px;max-width:38em;font-size:clamp(16px,1.3vw,18px)}
.margines .body--wide{max-width:46em}
.margines .note{margin:12px 0 0;color:var(--olowek);font-size:15px}

.margines .nb{display:block;max-width:1320px;margin:0 auto;padding-inline:var(--gut)}
.margines .row{display:grid;grid-template-columns:minmax(0,1fr)}
.margines .margin{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 14px;padding:0 0 4px 18px;border-left:5px double rgba(226,67,59,.6)}
.margines .page{min-width:0;padding:0 0 0 18px;border-left:5px double rgba(226,67,59,.6)}
.margines .margin__n{margin:0;font-family:'Caveat',cursive;font-weight:700;font-size:40px;line-height:1;color:var(--flamaster-ui)}
.margines .margin__note{margin:0;font-family:'Caveat',cursive;font-weight:600;font-size:24px;line-height:1.1;color:var(--atrament);transform:rotate(-2deg);transform-origin:0 50%;text-wrap:balance}
.margines .margin__note--red{color:var(--flamaster-ui)}
@media (min-width:900px){
  .margines .row{grid-template-columns:var(--mw) minmax(0,1fr)}
  .margines .margin{display:block;padding:6px 26px 0 0;border-left:0;border-right:5px double rgba(226,67,59,.6);text-align:right}
  .margines .margin__note{margin-top:10px;transform:rotate(-4deg);transform-origin:100% 50%}
  .margines .page{padding-left:clamp(28px,3vw,48px);border-left:0}
}
.margines .section .page,.margines .section .margin{padding-top:clamp(40px,6vw,80px)}
.margines .section .page{padding-bottom:8px}

.margines .hero .margin,.margines .hero .page{padding-top:clamp(20px,4vw,48px);padding-bottom:clamp(20px,3vw,36px)}
.margines .hero__page{display:grid;gap:28px;align-items:start}
@media (min-width:1080px){.margines .hero__page{grid-template-columns:minmax(0,1fr) 340px;gap:40px}}
.margines .hero__style{display:inline-block;margin:0;padding:2px 10px;background:linear-gradient(to top,var(--zakreslacz) 0,var(--zakreslacz) 55%,transparent 55%);font-weight:500;font-size:14px;letter-spacing:.06em;text-transform:uppercase}
.margines h1{display:inline-block;position:relative;margin-top:6px}
.margines .hero__name{display:block;font-size:clamp(76px,14vw,156px);line-height:.95;padding:0 .06em .04em 0}
.margines .hero__line{display:block;width:100%;height:16px;margin-top:-4px}
.margines .hero__lead{margin:22px 0 0;max-width:30em;font-size:clamp(18px,1.9vw,22px);line-height:1.55}
.margines .index{position:relative;margin:0;padding:22px 22px 18px 44px;border-radius:6px;background-color:#fff;background-image:${ruled};background-position:0 14px;box-shadow:0 16px 28px -20px rgba(30,42,94,.55),0 0 0 1px #E7E2D4}
.margines .index::before{content:'';position:absolute;left:28px;top:0;bottom:0;width:1.5px;background:var(--flamaster);opacity:.55}
.margines .hero__card{margin-top:12px}
@media (min-width:900px){.margines .hero__card{transform:rotate(1.5deg)}}
.margines .index__row{padding:4px 0 8px}
.margines .index dt{font-family:'Caveat',cursive;font-weight:700;font-size:24px;line-height:1.1;color:var(--flamaster-ui)}
.margines .index dd{margin:2px 0 0;font-size:16px;line-height:1.5}
.margines .tape{position:absolute;top:-12px;left:50%;width:110px;height:26px;margin-left:-55px;background:rgba(184,235,208,.85);transform:rotate(-4deg);clip-path:polygon(0 10%,5% 0,10% 12%,15% 0,85% 6%,90% 0,95% 12%,100% 6%,100% 92%,95% 100%,90% 88%,85% 100%,15% 94%,10% 100%,5% 88%,0 96%)}
.margines .tape--sun{background:rgba(255,228,94,.85)}

.margines .hero__strip{margin:8px calc(var(--gut) * -1) 0;padding:18px 0 8px;background:rgba(251,248,240,.86);border-block:1px solid #E1DACB}
.margines .strip-caption{display:flex;flex-wrap:wrap;gap:4px 14px;align-items:baseline;margin:0 0 14px;padding-inline:var(--gut);font-size:14px;color:var(--olowek)}
.margines .strip-caption .hand{font-size:23px;color:var(--flamaster-ui)}
.margines .strip{display:flex;gap:18px;scroll-padding-inline:var(--gut);margin:0;padding:6px var(--gut) 22px;list-style:none;overflow-x:auto;scroll-snap-type:x proximity;scrollbar-width:thin;scrollbar-color:var(--atrament) transparent}
.margines .strip__item{flex:none;scroll-snap-align:start}
.margines .strip__img{display:block;height:clamp(380px,58vw,560px);width:auto;border-radius:14px;background:#fff;box-shadow:0 18px 30px -22px rgba(30,42,94,.7),0 0 0 1px #E1DACB}
.margines .strip--hero .strip__item:nth-child(odd){transform:rotate(-.8deg)}
.margines .strip--hero .strip__item:nth-child(even){transform:rotate(.8deg) translateY(10px)}

.margines .toc .margin,.margines .toc .page{padding-top:28px}
.margines .toc__list{display:flex;flex-wrap:wrap;gap:6px 22px;margin:0;list-style:none}
.margines .toc__list a{display:inline-flex;align-items:baseline;gap:8px;font-family:'Caveat',cursive;font-weight:600;font-size:26px;line-height:1.3;text-decoration:none}
.margines .toc__list a:hover span:last-child{background:linear-gradient(to top,var(--zakreslacz) 0,var(--zakreslacz) 45%,transparent 45%)}
.margines .toc__n{font-size:20px;color:var(--flamaster-ui)}

.margines .split{display:grid;gap:28px;align-items:start}
@media (min-width:1080px){.margines .split{grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:48px}}
.margines .brief{transform:rotate(-1deg)}
.margines .cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:0 32px}
.margines .hand-title{margin:22px 0 12px;font-size:34px;line-height:1.1}
.margines .legend{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr));gap:12px;margin:0;padding:0;list-style:none}
.margines .legend li{display:grid;grid-template-columns:96px minmax(0,1fr);grid-template-rows:auto auto;column-gap:12px;align-items:center;padding:12px 14px;border-radius:8px;background:#fff;box-shadow:0 0 0 1px #E7E2D4}
.margines .legend__mark{grid-row:1/3;display:block}
.margines .legend__mark svg{display:block;width:96px;height:auto}
.margines .legend__name{font-family:'Caveat',cursive;font-weight:700;font-size:25px;line-height:1}
.margines .legend__what{font-size:14px;line-height:1.4;color:var(--olowek)}
.margines .kit{display:grid;gap:18px;margin-top:28px}
@media (min-width:1000px){.margines .kit{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);align-items:start}}
.margines .swatches{display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:16px 12px;margin:0;padding:0;list-style:none}
.margines .swatches li{display:flex;flex-direction:column;padding:8px 8px 10px;background:#fff;box-shadow:0 10px 16px -14px rgba(30,42,94,.6),0 0 0 1px #E7E2D4;transform:rotate(var(--r))}
.margines .swatches__chip{height:58px;background:var(--c);box-shadow:inset 0 0 0 1px rgba(30,42,94,.12);margin-bottom:6px}
.margines .swatches__name{font-family:'Caveat',cursive;font-weight:700;font-size:23px;line-height:1.1}
.margines .swatches__hex{font-size:13px;color:var(--olowek);font-variant-numeric:tabular-nums}
.margines .type__hand{margin:0;font-family:'Caveat',cursive;font-weight:700;font-size:clamp(40px,4.4vw,52px);line-height:1.05}
.margines .type__sans{margin:6px 0 0;font-weight:700;font-size:clamp(24px,2.4vw,30px);line-height:1.2}
.margines .type__meta{margin:12px 0 0;font-size:15px;line-height:1.5;color:var(--olowek)}
.margines .chips{display:flex;flex-wrap:wrap;gap:10px;margin:24px 0 0;padding:0;list-style:none}
.margines .chips li{padding:2px 12px;border:2px solid var(--atrament);border-radius:999px 860px 920px 700px;font-family:'Caveat',cursive;font-weight:600;font-size:22px;line-height:1.3}

.margines .lesson{margin:28px 0 0;padding:0;list-style:none;background-color:rgba(255,255,255,.75);background-image:${ruled};border-radius:6px;box-shadow:0 0 0 1px #E7E2D4}
.margines .lesson__item{display:grid;grid-template-columns:46px minmax(0,1fr);gap:12px;align-items:start;padding:18px 14px 18px 8px}
.margines .lesson__item+.lesson__item{border-top:1px dashed #C9D5E4}
.margines .lesson__n{grid-row:1 / span 4}
.margines .lesson__img{grid-column:2;max-width:120px}
.margines .lesson__text{display:contents}
.margines .lesson__head{grid-column:2}
.margines .lesson__flag,.margines .lesson__role{grid-column:2}
@media (min-width:560px){.margines .lesson__item{grid-template-columns:52px 120px minmax(0,1fr);gap:20px;padding:22px 22px 22px 12px}.margines .lesson__n{grid-row:auto}.margines .lesson__img{grid-column:auto;max-width:none}.margines .lesson__text{display:block}}
@media (min-width:1180px){.margines .lesson{display:grid;grid-template-columns:1fr 1fr}.margines .lesson__item:nth-child(2){border-top:0}.margines .lesson__item:nth-child(odd){border-right:1px dashed #C9D5E4}}
.margines .lesson__n{position:relative;display:flex;flex:none;align-items:center;justify-content:center;width:46px;height:42px;font-family:'Caveat',cursive;font-weight:700;font-size:30px}
.margines .lesson__n svg{position:absolute;inset:0;width:100%;height:100%}
.margines .lesson__img{display:block;width:100%;height:auto;border-radius:8px;box-shadow:0 10px 18px -12px rgba(30,42,94,.7),0 0 0 1px #E1DACB;transform:rotate(-1.5deg)}
.margines .lesson__head{margin:0;font-family:'Caveat',cursive;font-weight:700;font-size:clamp(26px,2.6vw,34px);line-height:1.1;text-wrap:balance}
.margines .lesson__item--first .lesson__mark{background:linear-gradient(to top,rgba(255,228,94,.9) 0,rgba(255,228,94,.9) 42%,transparent 42%);box-decoration-break:clone;-webkit-box-decoration-break:clone}
.margines .lesson__flag{display:inline-block;margin:8px 0 0;font-family:'Caveat',cursive;font-weight:600;font-size:21px;line-height:1.1;color:var(--flamaster-ui)}
.margines .lesson__role{margin:8px 0 0;font-size:15px;line-height:1.6;color:#3A4466}
.margines .sticky{position:relative;margin:30px 0 0;padding:20px 22px;max-width:34em;background:#FFF2A0;box-shadow:0 18px 26px -20px rgba(30,42,94,.6);transform:rotate(-1deg);font-family:'Caveat',cursive;font-weight:600;font-size:clamp(22px,2vw,25px);line-height:1.25}

.margines .searches{display:grid;gap:28px;margin-top:24px}
@media (min-width:1000px){.margines .searches{grid-template-columns:1fr 1fr}}
.margines .search{margin:0}
.margines .search__screen{max-width:420px;padding:18px 16px 20px;border-radius:28px;background:#fff;box-shadow:0 22px 36px -26px rgba(30,42,94,.75),0 0 0 1px #E1DACB;font-family:system-ui,'Segoe UI',Arial,sans-serif;color:#1d1d1f}
.margines .search--android .search__screen{background:#F7F7F4;border-radius:18px}
.margines .search__field{display:flex;align-items:center;gap:8px;height:38px;padding:0 12px;border-radius:12px;background:#EFEFF0;color:#5b5b60;font-size:15px}
.margines .search--android .search__field{border-radius:999px;background:#E9EAE6}
.margines .search__result{display:flex;align-items:center;gap:12px;margin:16px 0 12px}
.margines .search__icon{width:60px;height:60px;border-radius:14px}
.margines .search--android .search__icon{border-radius:18px}
.margines .search__meta{display:flex;flex-direction:column;flex:1;min-width:0}
.margines .search__name{font-weight:700;font-size:17px}
.margines .search__sub{font-size:13px;color:#6b6b70}
.margines .search__btn{padding:6px 16px;border-radius:999px;background:#EFEFF0;font-weight:700;font-size:14px;color:var(--atrament)}
.margines .search--android .search__btn{background:var(--atrament);color:#fff}
.margines .search__shots{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.margines .search__shots img{width:100%;height:auto;border-radius:10px;display:block}
.margines .search--android .search__shots img{border-radius:6px}
.margines .search__ghost{display:flex;gap:12px;align-items:center;margin-top:18px;opacity:.55}
.margines .search__ghost-icon{width:60px;height:60px;border-radius:14px;background:#E3E3E6}
.margines .search__ghost-lines{display:flex;flex-direction:column;gap:8px;flex:1}
.margines .search__ghost-lines span{display:block;height:10px;border-radius:5px;background:#E3E3E6;width:60%}
.margines .search__ghost-lines span+span{width:40%}
.margines .search__caption{margin-top:10px;font-family:'Caveat',cursive;font-weight:600;font-size:22px;line-height:1.2}

.margines .section--full{padding-bottom:8px}
.margines .switch{margin:18px calc(var(--gut) * -1) 0;padding:20px 0 6px;background:rgba(255,255,255,.7);border-block:1px solid #E1DACB}
.margines .switch__bar{display:flex;flex-wrap:wrap;gap:12px 18px;align-items:center;margin:0 0 18px;padding-inline:var(--gut)}
.margines .switch__group{display:inline-flex;flex-wrap:wrap;gap:6px}
.margines .switch__btn{appearance:none;margin:0;padding:6px 16px;border:2px solid var(--atrament);border-radius:999px 860px 920px 700px;background:transparent;color:var(--atrament);font:600 22px/1.2 'Caveat',cursive;cursor:pointer}
.margines .switch__btn[aria-pressed='true']{background:linear-gradient(to top,var(--zakreslacz) 0,var(--zakreslacz) 60%,transparent 60%);border-color:var(--flamaster)}

.margines .abs{display:grid;gap:32px;margin-top:24px}
@media (min-width:1080px){.margines .abs{grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);align-items:start}}
.margines .ab{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.margines .ab__item{margin:0}
.margines .ab__item img{display:block;width:100%;height:auto;border-radius:12px;box-shadow:0 14px 24px -18px rgba(30,42,94,.7),0 0 0 1px #E1DACB}
.margines .ab__item figcaption{display:flex;gap:10px;align-items:center;margin-top:12px;font-family:'Caveat',cursive;font-weight:600;font-size:22px;line-height:1.15;text-wrap:balance}
.margines .ab__tag{display:inline-flex;align-items:center;justify-content:center;flex:none;width:38px;height:36px;border:2.5px solid var(--flamaster);border-radius:52% 48% 55% 45%;font-family:'Caveat',cursive;font-weight:700;font-size:26px;color:var(--flamaster-ui)}
.margines .ab__item+.ab__item .ab__tag{border-color:var(--zielen);color:var(--zielen-ui)}
.margines .ab__hypothesis{grid-column:1/-1;margin:8px 0 0;padding:18px 22px;background:#FFF2A0;box-shadow:0 18px 26px -20px rgba(30,42,94,.6);transform:rotate(.8deg);font-size:16px;line-height:1.6}
.margines .ab__hypothesis strong{font-family:'Caveat',cursive;font-weight:700;font-size:24px;color:var(--flamaster-ui)}

.margines .features{display:grid;gap:22px;margin:8px 0 22px}
@media (min-width:900px){.margines .features{grid-template-columns:1fr 1fr}}
.margines .feature{margin:0}
.margines .feature img{display:block;width:100%;height:auto;border-radius:8px;box-shadow:0 14px 24px -18px rgba(30,42,94,.7),0 0 0 1px #E1DACB}
.margines .feature figcaption{margin-top:8px;font-size:14px;color:var(--olowek)}
.margines .icons{display:flex;flex-wrap:wrap;gap:24px 40px;margin:28px 0 22px}
.margines .icon{margin:0;width:140px}
.margines .icon__img{display:block;width:128px;height:128px;box-shadow:0 0 0 1px #E1DACB}
.margines .icon__img--ios{border-radius:22.5%;box-shadow:none}
.margines .icon__img--play{border-radius:30%;box-shadow:0 4px 10px rgba(30,42,94,.3)}
.margines .icon figcaption{margin-top:8px;font-family:'Caveat',cursive;font-weight:600;font-size:22px;line-height:1.1}

.margines .deliver{display:grid;gap:28px;align-items:start}
@media (min-width:1080px){.margines .deliver{grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:48px}}
.margines .dl{min-width:0}
.margines .dl__zip{display:flex;flex-wrap:wrap;justify-content:space-between;gap:6px 16px;align-items:baseline;padding:10px 0 14px;color:var(--atrament);text-decoration:none;border-bottom:2px solid var(--atrament)}
.margines .dl__zip-name{font-family:'Caveat',cursive;font-weight:700;font-size:clamp(28px,3vw,34px);line-height:1.1;background:linear-gradient(to top,var(--zakreslacz) 0,var(--zakreslacz) 45%,transparent 45%)}
.margines .dl__zip:hover .dl__zip-name{background:linear-gradient(to top,var(--mieta) 0,var(--mieta) 45%,transparent 45%)}
.margines .dl__zip-size{font-weight:500;font-size:15px}
.margines .dl__list{margin:6px 0 0;padding:0;list-style:none}
.margines .dl__row{border-bottom:1px dashed #C9D5E4}
.margines .dl__row summary{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 16px;padding:12px 0;cursor:pointer;list-style:none}
.margines .dl__row summary::-webkit-details-marker{display:none}
.margines .dl__title{font-weight:500}
.margines .dl__formats{grid-row:2;color:var(--olowek);font-size:14px}
.margines .dl__count{text-align:right;font-weight:500}
.margines .dl__size{grid-row:2;text-align:right;color:var(--olowek);font-size:14px}
.margines .dl__files{margin:0 0 12px;padding:0;list-style:none;font-size:14px}
.margines .dl__files li{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:0 12px;padding:4px 0}
.margines .dl__file{overflow-wrap:anywhere;font-weight:500}
.margines .dl__dim{grid-row:2;color:var(--olowek)}
.margines .dl__bytes{text-align:right;color:var(--olowek)}

.margines .files{display:grid;gap:22px;margin-top:22px}
@media (min-width:1000px){.margines .files{grid-template-columns:1fr 1fr}}
.margines .files__item{position:relative;margin:0;min-width:0;padding:18px 18px 16px 44px;border-radius:6px;background:#fff;box-shadow:0 16px 28px -22px rgba(30,42,94,.6),0 0 0 1px #E7E2D4}
.margines .files__item::before{content:'';position:absolute;left:28px;top:0;bottom:0;width:1.5px;background:var(--flamaster);opacity:.55}
.margines .files__item:nth-child(odd){transform:rotate(-.6deg)}
.margines .files__item:nth-child(even){transform:rotate(.6deg)}
.margines .files__name{display:block;margin-bottom:8px;font-family:'Caveat',cursive;font-weight:700;font-size:26px;line-height:1.1;color:var(--flamaster-ui)}
.margines .files__code{margin:0;color:var(--atrament);font:400 13px/1.7 ui-monospace,'SFMono-Regular',Menlo,Consolas,monospace;overflow-x:auto;white-space:pre-wrap;overflow-wrap:break-word}

.margines .cta .margin,.margines .cta .page{padding-top:clamp(56px,8vw,104px);padding-bottom:clamp(48px,7vw,88px)}
.margines .cta__arrow{display:none}
@media (min-width:900px){.margines .cta__arrow{display:block;width:120px;margin:40px 0 0 auto}}
.margines .cta h2{font-size:clamp(42px,6vw,76px);max-width:13em}
.margines .cta__link{position:relative;display:inline-block;margin-top:10px;padding:12px 26px;border:3px solid var(--flamaster);border-radius:52% 48% 50% 46% / 60% 55% 45% 50%;font-family:'Caveat',cursive;font-weight:700;font-size:30px;line-height:1.1;text-decoration:none;transform:rotate(-1.5deg)}
.margines .cta__link:hover{background:var(--zakreslacz)}
.margines .foot{max-width:1320px;margin:0 auto;padding:22px var(--gut) 40px;border-top:2px solid var(--atrament);font-size:14px;color:#3A4466}
.margines .sample-note{margin:0}
@media (prefers-reduced-motion:reduce){.margines *{scroll-behavior:auto}}
`;
