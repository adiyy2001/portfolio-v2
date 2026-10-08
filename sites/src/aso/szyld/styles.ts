import { grainUrl } from './view';

export const css = `
.szyld{
  --butelka:#0B4A3D;--limonka:#D5F25C;--grejpfrut:#FF5A36;--mleko:#F7F4EA;--smola:#0E1E1A;--szron:#DCE3DF;--lupek:#5E6B66;--mid:#3F8A4E;
  --gut:clamp(16px,4vw,48px);--skip-bg:#0E1E1A;--skip-fg:#D5F25C;
  color-scheme:light;
  background:var(--mleko);
  color:var(--smola);
  font:400 17px/1.6 'Mona Sans',system-ui,'Segoe UI',Arial,sans-serif;
}
.szyld .wrap{max-width:1280px;margin-inline:auto;padding-inline:var(--gut)}
.szyld a{color:var(--butelka);text-underline-offset:3px}
.szyld a:focus-visible,.szyld button:focus-visible,.szyld [tabindex]:focus-visible,.szyld summary:focus-visible{outline:3px solid var(--grejpfrut);outline-offset:3px}
.szyld .grain{position:relative;isolation:isolate}
.szyld .grain::before{content:'';position:absolute;inset:0;z-index:-1;background-image:${grainUrl};background-size:220px 220px;mix-blend-mode:overlay;opacity:.5;pointer-events:none}
.szyld .top{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;padding:16px var(--gut);background:var(--butelka);font-weight:600;font-size:15px}
.szyld .top a{color:var(--mleko)}
.szyld h1,.szyld h2{font-family:'Mona Sans Expanded','Mona Sans',system-ui,sans-serif;font-weight:900;letter-spacing:-.03em;text-wrap:balance;hyphens:none;margin:0}
.szyld h2{font-size:clamp(30px,4.4vw,58px);line-height:1;margin-bottom:24px;max-width:17em}
.szyld .body{margin:0 0 16px;max-width:38em;font-size:clamp(17px,1.4vw,19px)}
.szyld .body--wide{max-width:48em}
.szyld .note{margin:16px 0 0;color:var(--lupek);font-size:15px}

.szyld .pill{display:inline-flex;flex-wrap:wrap;align-items:center;gap:4px 10px;margin:0;padding:8px 16px;border-radius:22px;font-weight:700;font-size:13px;letter-spacing:.05em;text-transform:uppercase}
.szyld .pill--lime{background:var(--limonka);color:var(--smola)}
.szyld .pill__sep{opacity:.5}
.szyld .tag{display:inline-flex;align-items:center;gap:10px;margin:0 0 18px;padding:6px 14px 6px 6px;border-radius:999px;background:var(--butelka);color:var(--mleko);font-weight:700;font-size:13px;letter-spacing:.06em;text-transform:uppercase;transform:rotate(-2deg)}
.szyld .tag__n{display:inline-flex;align-items:center;justify-content:center;min-width:32px;height:28px;padding:0 6px;border-radius:999px;background:var(--limonka);color:var(--smola);font-family:'Mona Sans Expanded','Mona Sans',sans-serif;font-weight:900;letter-spacing:0}
.szyld .tag--ink{background:var(--smola)}
.szyld .tag--lime{background:var(--limonka);color:var(--smola)}
.szyld .tag--lime .tag__n{background:var(--butelka);color:var(--limonka)}

.szyld .hero{padding:clamp(28px,6vw,72px) 0 clamp(32px,5vw,56px);background:linear-gradient(168deg in oklab,var(--butelka) 0%,var(--butelka) 56%,var(--mid) 80%,var(--limonka) 100%);color:var(--mleko);overflow:hidden}
.szyld .hero__grid{display:grid;gap:28px;align-items:end}
@media (min-width:980px){.szyld .hero__grid{grid-template-columns:1fr auto}}
.szyld .hero h1{margin-top:18px;padding-bottom:.06em;font-size:clamp(84px,21vw,288px);line-height:.9;letter-spacing:-.045em;color:var(--limonka)}
.szyld .hero__lead{margin:22px 0 0;max-width:30em;font-size:clamp(18px,2vw,23px);line-height:1.45;font-weight:600}
.szyld .hero__nav{display:flex;flex-wrap:wrap;gap:8px;max-width:420px}
.szyld .hero__nav a{display:inline-flex;align-items:center;gap:8px;padding:8px 14px 8px 8px;border-radius:999px;background:rgba(247,244,234,.12);box-shadow:inset 0 0 0 1.5px rgba(247,244,234,.35);color:var(--mleko);font-weight:700;font-size:15px;text-decoration:none}
.szyld .hero__nav a:hover{background:var(--limonka);color:var(--smola)}
.szyld .hero__nav-n{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:var(--limonka);color:var(--smola);font-size:12px;font-weight:700}
.szyld .hero__caption{margin-top:clamp(28px,5vw,48px);margin-bottom:14px;font-size:14px;font-weight:600;color:var(--szron)}
.szyld .facts{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px;margin-bottom:0;list-style:none}
.szyld .facts li{display:flex;flex-wrap:wrap;gap:2px 10px;align-items:baseline;padding:10px 16px;border-radius:16px;background:var(--mleko);color:var(--smola);font-size:15px;max-width:100%}
.szyld .facts__term{font-weight:700;font-size:12px;letter-spacing:.07em;text-transform:uppercase;color:var(--butelka)}
.szyld .facts__text{font-weight:600}

.szyld .strip{display:flex;gap:14px;scroll-padding-inline:var(--gut);margin:0;padding:0 var(--gut) 18px;list-style:none;overflow-x:auto;scroll-snap-type:x proximity;scrollbar-width:thin;scrollbar-color:var(--limonka) transparent}
.szyld .strip__item{flex:none;scroll-snap-align:start}
.szyld .strip__img{display:block;height:clamp(380px,58vw,580px);width:auto;border-radius:18px;background:var(--butelka)}
.szyld .strip--hero{padding-bottom:30px}
.szyld .strip--hero .strip__item:nth-child(even){padding-top:34px}
.szyld .strip--hero .strip__img{box-shadow:0 30px 50px -28px rgba(14,30,26,.8)}

.szyld .section{padding-block:clamp(56px,8vw,112px) 0}
.szyld .brief{display:grid;gap:32px;align-items:start}
@media (min-width:920px){.szyld .brief{grid-template-columns:1.3fr 1fr;gap:64px}}
.szyld .ticket{margin:0;padding:22px 24px;border-radius:26px;background:var(--smola);color:var(--mleko);transform:rotate(1.5deg)}
.szyld .ticket__row{padding:12px 0}
.szyld .ticket__row+.ticket__row{border-top:2px dashed rgba(247,244,234,.25)}
.szyld .ticket dt{font-weight:700;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--limonka)}
.szyld .ticket dd{margin:4px 0 0;font-size:18px;font-weight:600;line-height:1.4}

.szyld .section--hot{margin-top:clamp(56px,8vw,112px);padding-block:clamp(48px,7vw,96px);background:linear-gradient(150deg in oklab,var(--grejpfrut) 0%,var(--grejpfrut) 30%,#FF9A3E 64%,var(--limonka) 100%)}
.szyld .cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:0 36px}
.szyld .duos{display:grid;gap:14px;margin:24px 0 0;padding:0;list-style:none}
@media (min-width:760px){.szyld .duos{grid-template-columns:1fr 1fr}}
.szyld .duo{display:flex;flex-direction:column;justify-content:flex-end;gap:2px;min-height:150px;padding:18px 20px;border-radius:24px;background:linear-gradient(135deg in oklab,var(--from) 0%,var(--from) 30%,var(--to) 100%);box-shadow:0 0 0 2px var(--smola)}
.szyld .duo__name{font-family:'Mona Sans Expanded','Mona Sans',sans-serif;font-weight:900;font-size:clamp(20px,2.4vw,28px);line-height:1.05;color:var(--mleko)}
.szyld .duo:nth-child(2) .duo__name{color:var(--smola)}
.szyld .duo__meta{font-weight:600;font-size:14px;color:var(--smola);padding:4px 10px;border-radius:999px;background:var(--mleko);align-self:flex-start;margin-top:8px}
.szyld .kit{display:grid;gap:14px;margin-top:14px}
@media (min-width:900px){.szyld .kit{grid-template-columns:1.4fr 1fr}}
.szyld .swatches{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:10px;margin:0;padding:16px;border-radius:24px;background:var(--mleko);list-style:none}
.szyld .swatches li{display:flex;flex-direction:column;gap:1px;font-size:13px}
.szyld .swatches__chip{height:52px;border-radius:14px;background:var(--c);box-shadow:inset 0 0 0 1px rgba(14,30,26,.14);margin-bottom:6px}
.szyld .swatches__name{font-weight:700}
.szyld .swatches__hex{color:var(--lupek);font-variant-numeric:tabular-nums}
.szyld .type{padding:20px 22px;border-radius:24px;background:var(--smola);color:var(--mleko)}
.szyld .type__sample{margin:0;font-family:'Mona Sans Expanded','Mona Sans',sans-serif;font-weight:900;font-size:clamp(36px,4.6vw,56px);line-height:1;letter-spacing:-.03em;color:var(--limonka)}
.szyld .type__meta{margin:12px 0 0;font-size:15px;line-height:1.5}
.szyld .chips{display:flex;flex-wrap:wrap;gap:8px;margin:20px 0 0;padding:0;list-style:none}
.szyld .chips li{padding:7px 14px;border-radius:999px;background:var(--smola);color:var(--mleko);font-weight:700;font-size:14px}

.szyld .story{display:grid;gap:18px;margin:32px 0 0;padding:0;list-style:none;grid-template-columns:repeat(auto-fill,minmax(min(100%,360px),1fr))}
.szyld .story__item{position:relative;display:grid;grid-template-columns:118px 1fr;grid-template-areas:'img n' 'img text';grid-template-rows:auto 1fr;gap:4px 18px;align-items:start;padding:18px;border-radius:24px;background:#fff;box-shadow:0 0 0 1.5px var(--szron);overflow:hidden}
.szyld .story__item--first{background:var(--butelka);color:var(--mleko);box-shadow:none}
.szyld .story__n{grid-area:n;font-family:'Mona Sans Expanded','Mona Sans',sans-serif;font-weight:900;font-size:52px;line-height:1;color:transparent;-webkit-text-stroke:2px #B7C3BD;pointer-events:none}
.szyld .story__item--first .story__n{-webkit-text-stroke-color:rgba(213,242,92,.6)}
.szyld .story__img{grid-area:img;position:relative;width:118px;height:auto;border-radius:12px;display:block;transform:rotate(-3deg);box-shadow:0 14px 24px -14px rgba(14,30,26,.7)}
.szyld .story__text{grid-area:text;position:relative}
.szyld .story__flag{display:inline-block;margin:0 0 8px;padding:3px 10px;border-radius:999px;background:var(--grejpfrut);color:var(--smola);font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase}
.szyld .story__head{margin:0 0 8px;font-family:'Mona Sans Expanded','Mona Sans',sans-serif;font-weight:800;font-size:19px;line-height:1.15;letter-spacing:-.01em;text-wrap:balance}
.szyld .story__item--first .story__head{color:var(--limonka)}
.szyld .story__role{margin:0;font-size:15px;line-height:1.5;color:var(--lupek)}
.szyld .story__item--first .story__role{color:var(--szron)}
.szyld .callout{margin:28px 0 0;padding:20px 24px;max-width:48em;border-radius:22px;background:var(--limonka);font-weight:600;font-size:18px}

.szyld .searches{display:grid;gap:28px;margin-top:28px;padding:clamp(18px,3vw,36px);border-radius:32px;background:linear-gradient(150deg in oklab,var(--grejpfrut) 0%,#FF9A3E 55%,var(--limonka) 100%)}
@media (min-width:880px){.szyld .searches{grid-template-columns:1fr 1fr}}
.szyld .search{margin:0}
.szyld .search__screen{max-width:420px;padding:18px 16px 20px;border-radius:28px;background:#fff;box-shadow:0 24px 40px -26px rgba(14,30,26,.7);font-family:system-ui,'Segoe UI',Arial,sans-serif;color:#1d1d1f}
.szyld .search--android .search__screen{background:#F7F7F4;border-radius:18px}
.szyld .search__field{display:flex;align-items:center;gap:8px;height:38px;padding:0 12px;border-radius:12px;background:#EFEFF0;color:#5b5b60;font-size:15px}
.szyld .search--android .search__field{border-radius:999px;background:#E9EAE6}
.szyld .search__result{display:flex;align-items:center;gap:12px;margin:16px 0 12px}
.szyld .search__icon{width:60px;height:60px;border-radius:14px}
.szyld .search--android .search__icon{border-radius:18px}
.szyld .search__meta{display:flex;flex-direction:column;flex:1;min-width:0}
.szyld .search__name{font-weight:700;font-size:17px}
.szyld .search__sub{font-size:13px;color:#6b6b70}
.szyld .search__btn{padding:6px 16px;border-radius:999px;background:#EFEFF0;font-weight:700;font-size:14px;color:var(--butelka)}
.szyld .search--android .search__btn{background:var(--butelka);color:#fff}
.szyld .search__shots{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.szyld .search__shots img{width:100%;height:auto;border-radius:10px;display:block}
.szyld .search--android .search__shots img{border-radius:6px}
.szyld .search__ghost{display:flex;gap:12px;align-items:center;margin-top:18px;opacity:.55}
.szyld .search__ghost-icon{width:60px;height:60px;border-radius:14px;background:#E3E3E6}
.szyld .search__ghost-lines{display:flex;flex-direction:column;gap:8px;flex:1}
.szyld .search__ghost-lines span{display:block;height:10px;border-radius:5px;background:#E3E3E6;width:60%}
.szyld .search__ghost-lines span+span{width:40%}
.szyld .search__caption{margin-top:10px;font-size:14px;color:var(--smola);font-weight:600}

.szyld .section--band{margin-top:clamp(56px,8vw,112px);padding-block:clamp(48px,7vw,96px);background:linear-gradient(200deg in oklab,var(--butelka) 0%,var(--butelka) 55%,#14614F 100%);color:var(--mleko)}
.szyld .section--band h2{color:var(--limonka)}
.szyld .switch__bar{display:flex;flex-wrap:wrap;gap:12px 20px;align-items:center;max-width:1280px;margin:8px auto 22px;padding-inline:var(--gut)}
.szyld .switch__group{display:inline-flex;padding:4px;border-radius:16px;background:rgba(247,244,234,.12)}
.szyld .switch__btn{appearance:none;border:0;margin:0;padding:11px 18px;border-radius:12px;background:transparent;color:var(--mleko);font:700 15px/1 'Mona Sans',system-ui,sans-serif;cursor:pointer}
.szyld .switch__btn[aria-pressed='true']{background:var(--limonka);color:var(--smola)}

.szyld .abs{display:grid;gap:28px;margin-top:24px}
@media (min-width:960px){.szyld .abs{grid-template-columns:1.2fr 1fr;align-items:start}}
.szyld .ab{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.szyld .ab__item{margin:0}
.szyld .ab__item img{display:block;width:100%;height:auto;border-radius:16px}
.szyld .ab__item figcaption{display:flex;gap:10px;align-items:baseline;margin-top:10px;font-weight:700;line-height:1.3;text-wrap:balance}
.szyld .ab__tag{display:inline-flex;align-items:center;justify-content:center;flex:none;width:30px;height:30px;border-radius:50%;background:var(--grejpfrut);color:var(--smola);font-family:'Mona Sans Expanded','Mona Sans',sans-serif;font-weight:900}
.szyld .ab__item+.ab__item .ab__tag{background:var(--limonka)}
.szyld .ab__hypothesis{grid-column:1/-1;margin:8px 0 0;padding:18px 22px;border-radius:20px;background:var(--smola);color:var(--mleko)}
.szyld .ab__hypothesis strong{color:var(--limonka)}

.szyld .features{display:grid;gap:20px;margin:8px 0 20px}
@media (min-width:860px){.szyld .features{grid-template-columns:1fr 1fr}}
.szyld .feature{margin:0}
.szyld .feature img{display:block;width:100%;height:auto;border-radius:16px}
.szyld .feature figcaption{margin-top:8px;font-size:14px;font-weight:600;color:var(--lupek)}
.szyld .icons{display:flex;flex-wrap:wrap;gap:24px 40px;margin:28px 0 20px}
.szyld .icon{margin:0;width:150px}
.szyld .icon__img{display:block;width:128px;height:128px}
.szyld .icon__img--ios{border-radius:22.5%}
.szyld .icon__img--play{border-radius:30%;box-shadow:0 4px 10px rgba(14,30,26,.3)}
.szyld .icon figcaption{margin-top:10px;font-size:14px;font-weight:600;color:var(--lupek)}

.szyld .deliver{display:grid;gap:28px;align-items:start}
@media (min-width:980px){.szyld .deliver{grid-template-columns:1fr 1.1fr;gap:56px}}
.szyld .dl{min-width:0}
.szyld .dl__zip{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px 16px;align-items:center;padding:20px 24px;border-radius:22px;background:var(--limonka);color:var(--smola);text-decoration:none;font-family:'Mona Sans Expanded','Mona Sans',sans-serif;font-weight:900;font-size:clamp(17px,2vw,20px);box-shadow:inset 0 -4px 0 rgba(14,30,26,.15)}
.szyld .dl__zip:hover{background:var(--smola);color:var(--limonka)}
.szyld .dl__zip-size{font-family:'Mona Sans',sans-serif;font-weight:700;font-size:15px}
.szyld .dl__list{margin:16px 0 0;padding:0;list-style:none;border-top:1.5px solid var(--szron)}
.szyld .dl__row{border-bottom:1.5px solid var(--szron)}
.szyld .dl__row summary{display:grid;grid-template-columns:1fr auto;gap:2px 16px;padding:14px 4px;cursor:pointer;list-style:none}
.szyld .dl__row summary::-webkit-details-marker{display:none}
.szyld .dl__title{font-weight:700}
.szyld .dl__formats{grid-row:2;color:var(--lupek);font-size:14px}
.szyld .dl__count{text-align:right;font-weight:700}
.szyld .dl__size{grid-row:2;text-align:right;color:var(--lupek);font-size:14px}
.szyld .dl__files{margin:0 0 14px;padding:0;list-style:none;font-size:14px}
.szyld .dl__files li{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:0 12px;padding:5px 4px}
.szyld .dl__file{overflow-wrap:anywhere;font-weight:600}
.szyld .dl__dim{grid-row:2;color:var(--lupek)}
.szyld .dl__bytes{text-align:right;color:var(--lupek)}

.szyld .files{display:grid;gap:16px;margin-top:20px}
@media (min-width:900px){.szyld .files{grid-template-columns:1fr 1fr}}
.szyld .files__item{margin:0;min-width:0}
.szyld .files__name{display:inline-block;margin-bottom:8px;padding:4px 12px;border-radius:999px;background:var(--grejpfrut);color:var(--smola);font-weight:700;font-size:14px}
.szyld .files__item+.files__item .files__name{background:var(--limonka)}
.szyld .files__code{margin:0;padding:16px 18px;border-radius:20px;background:var(--smola);color:#E6EFD0;font:500 13px/1.6 ui-monospace,'SFMono-Regular',Menlo,Consolas,monospace;overflow-x:auto;white-space:pre-wrap;overflow-wrap:break-word}

.szyld .cta{margin-top:clamp(64px,9vw,128px);padding-block:clamp(56px,8vw,104px);background:linear-gradient(120deg in oklab,var(--limonka) 0%,var(--limonka) 40%,#FF9A3E 100%)}
.szyld .cta h2{font-size:clamp(34px,6vw,76px);max-width:14em}
.szyld .cta__link{display:inline-block;margin-top:8px;padding:16px 26px;border-radius:18px;background:var(--smola);color:var(--limonka);font-weight:700;font-size:18px;text-decoration:none}
.szyld .cta__link:hover{background:var(--butelka)}
.szyld .foot{padding:24px 0 40px;background:var(--smola);color:var(--szron);font-size:14px}
.szyld .foot a{color:var(--limonka)}
.szyld .sample-note{margin:0}
@media (prefers-reduced-motion:reduce){.szyld *{scroll-behavior:auto}}
`;
