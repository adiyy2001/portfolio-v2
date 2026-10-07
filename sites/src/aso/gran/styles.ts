export const css = `
.gran{
  --mgla:#F5EBDD;--swit:#F4CDA5;--dal:#AFC3CB;--grzbiet:#6E8F9B;--las:#2E5446;--glab:#17302A;--laka:#A7BF73;--znak:#C8352B;--slonce:#F2A93B;--biel:#FFFDF8;
  --muted:#46584F;--line:#D9CBB4;--gut:clamp(16px,4vw,48px);--skip-bg:#2E5446;
  color-scheme:light;
  background:var(--mgla);
  color:var(--glab);
  font:400 17px/1.6 'Overpass',system-ui,'Segoe UI',Arial,sans-serif;
  font-variant-numeric:tabular-nums;
}
.gran .wrap{max-width:1240px;margin-inline:auto;padding-inline:var(--gut)}
.gran a{color:var(--las);text-underline-offset:3px}
.gran a:focus-visible,.gran button:focus-visible,.gran input:focus-visible+span,.gran [tabindex]:focus-visible,.gran summary:focus-visible{outline:3px solid var(--znak);outline-offset:3px}
.gran .top{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;padding:18px var(--gut);font-weight:600;font-size:15px}
.gran .top a{color:var(--glab)}
.gran .trail{display:inline-block;flex:none;width:30px;height:20px;border-radius:2px;background:linear-gradient(var(--biel) 0 33%,var(--znak) 33% 67%,var(--biel) 67%);box-shadow:0 0 0 1px rgba(23,48,42,.22)}
.gran .mark{display:flex;align-items:center;gap:12px;margin:0 0 14px;font-weight:800;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.gran .mark .dot{margin:0 .6em 0 .35em}
.gran .mark--light{color:var(--dal)}
.gran h1,.gran h2{font-weight:900;letter-spacing:-.02em;text-wrap:balance;hyphens:none;margin:0}
.gran h1{font-size:clamp(76px,16vw,184px);line-height:.9;color:var(--las)}
.gran h2{font-size:clamp(32px,4.6vw,56px);line-height:1.02;margin-bottom:24px;max-width:18em}
.gran .body{margin:0 0 16px;max-width:38em;font-size:clamp(17px,1.4vw,19px)}
.gran .body--wide{max-width:46em}
.gran .note{margin:16px 0 0;color:var(--muted);font-size:15px}

.gran .hero{position:relative;padding-top:clamp(24px,6vw,72px)}
.gran .hero__text{position:relative;z-index:1}
.gran .hero__lead{margin:18px 0 0;max-width:34em;font-size:clamp(18px,2vw,23px);line-height:1.45;font-weight:600}
.gran .hero__nav{display:flex;flex-wrap:wrap;gap:8px 18px;margin:26px 0 0;font-weight:700;font-size:15px}
.gran .hero__ridges{display:block;width:100%;height:clamp(70px,11vw,160px);margin-top:clamp(8px,3vw,32px)}
.gran .hero__band{background:var(--las);color:var(--biel);padding:6px 0 clamp(28px,4vw,48px);margin-top:-1px}
.gran .hero__caption{margin:0 0 14px;font-size:14px;font-weight:600;color:var(--dal)}

.gran .strip{display:flex;gap:12px;scroll-padding-inline:var(--gut);margin:0;padding:0 var(--gut) 14px;list-style:none;overflow-x:auto;scroll-snap-type:x proximity;scrollbar-width:thin;scrollbar-color:var(--grzbiet) transparent}
.gran .strip__item{flex:none;scroll-snap-align:start}
.gran .strip__img{display:block;height:clamp(380px,58vw,560px);width:auto;border-radius:14px;background:var(--dal)}
.gran .strip--joined{gap:0}
.gran .strip--joined .strip__img{border-radius:0}
.gran .strip--joined .strip__item:first-child .strip__img{border-radius:14px 0 0 14px}
.gran .strip--joined .strip__item:last-child .strip__img{border-radius:0 14px 14px 0}
.gran .facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:18px 32px;margin:28px auto 0}
.gran .facts dt{font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--dal)}
.gran .facts dd{margin:4px 0 0;font-weight:600}

.gran .section{padding-block:clamp(56px,8vw,104px) 0}
.gran .cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:0 40px}

.gran .direction{display:grid;gap:32px}
@media (min-width:900px){.gran .direction{grid-template-columns:1.25fr 1fr;gap:56px}}
.gran .chips{display:flex;flex-wrap:wrap;gap:8px;margin:20px 0 0;padding:0;list-style:none}
.gran .chips li{padding:6px 12px;border-radius:999px;background:var(--biel);box-shadow:0 0 0 1px var(--line);font-weight:700;font-size:14px}
.gran .swatches{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:12px;margin:0;padding:0;list-style:none}
.gran .swatches li{display:flex;flex-direction:column;gap:2px;font-size:13px}
.gran .swatches__chip{height:56px;border-radius:10px;background:var(--c);box-shadow:inset 0 0 0 1px rgba(23,48,42,.12);margin-bottom:6px}
.gran .swatches__name{font-weight:800}
.gran .swatches__hex{color:var(--muted);font-variant-numeric:tabular-nums}
.gran .type{margin-top:24px;padding:20px 22px;border-radius:16px;background:var(--biel);box-shadow:0 0 0 1px var(--line)}
.gran .type__sample{margin:0;font-weight:900;font-size:clamp(34px,4vw,48px);line-height:1.05;color:var(--las)}
.gran .type__meta{margin:8px 0 0;color:var(--muted);font-size:14px;font-weight:600}

.gran .story{display:grid;gap:16px;margin:28px 0 0;padding:0;list-style:none;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr))}
.gran .story__item{display:grid;grid-template-columns:96px 1fr;gap:16px;align-items:start;padding:14px;border-radius:16px;background:var(--biel);box-shadow:0 0 0 1px var(--line)}
.gran .story__item img{width:96px;height:auto;border-radius:8px;display:block}
.gran .story__item--first{box-shadow:0 0 0 2px var(--las)}
.gran .story__num{display:flex;align-items:center;gap:10px;margin:0;font-weight:900;font-size:22px;color:var(--las)}
.gran .story__flag{padding:2px 8px;border-radius:999px;background:var(--las);color:var(--biel);font-size:11px;font-weight:800;letter-spacing:.04em;text-transform:uppercase}
.gran .story__head{margin:4px 0 6px;font-weight:900;font-size:18px;line-height:1.2;text-wrap:balance}
.gran .story__role{margin:0;font-size:15px;line-height:1.5;color:var(--muted)}
.gran .callout{margin:24px 0 0;padding:18px 22px;max-width:46em;border-left:6px solid var(--znak);background:var(--biel);font-weight:600}

.gran .searches{display:grid;gap:28px;margin-top:28px}
@media (min-width:860px){.gran .searches{grid-template-columns:1fr 1fr}}
.gran .search{margin:0}
.gran .search__screen{max-width:420px;padding:18px 16px 20px;border-radius:28px;background:#FFFFFF;box-shadow:0 0 0 1px var(--line),0 20px 40px -24px rgba(23,48,42,.45);font-family:system-ui,'Segoe UI',Arial,sans-serif;color:#1d1d1f}
.gran .search--android .search__screen{background:#F7F7F4;border-radius:18px}
.gran .search__field{display:flex;align-items:center;gap:8px;height:38px;padding:0 12px;border-radius:12px;background:#EFEFF0;color:#5b5b60;font-size:15px}
.gran .search--android .search__field{border-radius:999px;background:#E9EAE6}
.gran .search__result{display:flex;align-items:center;gap:12px;margin:16px 0 12px}
.gran .search__icon{width:60px;height:60px;border-radius:14px}
.gran .search--android .search__icon{border-radius:18px}
.gran .search__meta{display:flex;flex-direction:column;flex:1;min-width:0}
.gran .search__name{font-weight:700;font-size:17px}
.gran .search__sub{font-size:13px;color:#6b6b70}
.gran .search__btn{padding:6px 16px;border-radius:999px;background:#EFEFF0;font-weight:700;font-size:14px;color:#2E5446}
.gran .search--android .search__btn{background:#2E5446;color:#fff}
.gran .search__shots{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.gran .search__shots img{width:100%;height:auto;border-radius:10px;display:block}
.gran .search--android .search__shots img{border-radius:6px}
.gran .search__ghost{display:flex;gap:12px;align-items:center;margin-top:18px;opacity:.55}
.gran .search__ghost-icon{width:60px;height:60px;border-radius:14px;background:#E3E3E6}
.gran .search__ghost-lines{display:flex;flex-direction:column;gap:8px;flex:1}
.gran .search__ghost-lines span{display:block;height:10px;border-radius:5px;background:#E3E3E6;width:60%}
.gran .search__ghost-lines span+span{width:40%}
.gran .search__caption{margin-top:10px;font-size:14px;color:var(--muted);font-weight:600}

.gran .section--band{margin-top:clamp(56px,8vw,104px);padding-block:clamp(48px,7vw,88px);background:var(--las);color:var(--biel)}
.gran .section--band h2{color:var(--biel)}
.gran .switch__bar{display:flex;flex-wrap:wrap;gap:12px 20px;align-items:center;max-width:1240px;margin:8px auto 22px;padding-inline:var(--gut)}
.gran .switch__group{display:inline-flex;padding:4px;border-radius:14px;background:rgba(255,253,248,.12)}
.gran .switch__btn{appearance:none;border:0;margin:0;padding:10px 16px;border-radius:10px;background:transparent;color:var(--biel);font:800 15px/1 'Overpass',system-ui,sans-serif;cursor:pointer}
.gran .switch__btn[aria-pressed='true']{background:var(--biel);color:var(--las)}
.gran .switch__check{display:inline-flex;align-items:center;gap:10px;font-weight:700;cursor:pointer}
.gran .switch__check input{width:22px;height:22px;accent-color:var(--znak)}

.gran .abs{display:grid;gap:28px;margin-top:24px}
@media (min-width:960px){.gran .abs{grid-template-columns:1.2fr 1fr;align-items:start}}
.gran .ab{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.gran .ab__item{margin:0}
.gran .ab__item img{display:block;width:100%;height:auto;border-radius:14px}
.gran .ab__item figcaption{display:flex;gap:10px;align-items:baseline;margin-top:10px;font-weight:800;line-height:1.3}
.gran .ab__tag{display:inline-flex;align-items:center;justify-content:center;flex:none;width:28px;height:28px;border-radius:8px;background:var(--las);color:var(--biel);font-weight:900}
.gran .ab__hypothesis{grid-column:1/-1;margin:8px 0 0;padding:16px 20px;border-radius:14px;background:var(--biel);box-shadow:0 0 0 1px var(--line)}

.gran .features{display:grid;gap:20px;margin:8px 0 20px}
@media (min-width:860px){.gran .features{grid-template-columns:1fr 1fr}}
.gran .feature{margin:0}
.gran .feature img{display:block;width:100%;height:auto;border-radius:12px}
.gran .feature figcaption{margin-top:8px;font-size:14px;font-weight:600;color:var(--muted)}
.gran .icons{display:flex;flex-wrap:wrap;gap:24px 40px;margin:28px 0 20px}
.gran .icon{margin:0;width:150px}
.gran .icon__img{display:block;width:128px;height:128px}
.gran .icon__img--ios{border-radius:22.5%}
.gran .icon__img--play{border-radius:30%;box-shadow:0 4px 10px rgba(23,48,42,.25)}
.gran .icon figcaption{margin-top:10px;font-size:14px;font-weight:600;color:var(--muted)}

.gran .dl{margin-top:24px}
.gran .dl__zip{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px 16px;align-items:center;max-width:720px;padding:18px 22px;border-radius:16px;background:var(--las);color:var(--biel);text-decoration:none;font-weight:900;font-size:19px}
.gran .dl__zip:hover{background:var(--glab)}
.gran .dl__zip-size{font-weight:700;font-size:15px;opacity:.9}
.gran .dl__list{max-width:720px;margin:16px 0 0;padding:0;list-style:none;border-top:1px solid var(--line)}
.gran .dl__row{border-bottom:1px solid var(--line)}
.gran .dl__row summary{display:grid;grid-template-columns:1fr auto;gap:2px 16px;padding:14px 4px;cursor:pointer;list-style:none}
.gran .dl__row summary::-webkit-details-marker{display:none}
.gran .dl__title{font-weight:800}
.gran .dl__formats{grid-row:2;color:var(--muted);font-size:14px}
.gran .dl__count{text-align:right;font-weight:700}
.gran .dl__size{grid-row:2;text-align:right;color:var(--muted);font-size:14px}
.gran .dl__files{margin:0 0 14px;padding:0;list-style:none;font-size:14px}
.gran .dl__files li{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:0 12px;padding:5px 4px}
.gran .dl__file{overflow-wrap:anywhere;font-weight:600}
.gran .dl__dim{grid-row:2;color:var(--muted)}
.gran .dl__bytes{text-align:right;color:var(--muted)}

.gran .files{display:grid;gap:16px;margin-top:20px}
@media (min-width:900px){.gran .files{grid-template-columns:1fr 1fr}}
.gran .files__item{margin:0;min-width:0}
.gran .files__name{display:inline-block;margin-bottom:8px;padding:4px 10px;border-radius:8px;background:var(--las);color:var(--biel);font-weight:800;font-size:14px}
.gran .files__code{margin:0;padding:16px 18px;border-radius:14px;background:var(--glab);color:#E9F0EC;font:500 13px/1.6 ui-monospace,'SFMono-Regular',Menlo,Consolas,monospace;overflow-x:auto;white-space:pre}

.gran .cta{margin-top:clamp(64px,9vw,120px);padding-block:clamp(48px,7vw,88px);background:var(--swit)}
.gran .cta h2{color:var(--las)}
.gran .cta__link{display:inline-block;margin-top:8px;padding:15px 24px;border-radius:12px;background:var(--las);color:var(--biel);font-weight:900;text-decoration:none}
.gran .cta__link:hover{background:var(--glab)}
.gran .foot{padding:24px 0 40px;background:var(--glab);color:var(--dal);font-size:14px}
.gran .foot a{color:var(--biel)}
.gran .sample-note{margin:0}
@media (prefers-reduced-motion:reduce){.gran *{scroll-behavior:auto}}
`;
