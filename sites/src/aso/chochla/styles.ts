const dots = (color: string, size = 10, dot = 1.6) =>
  `radial-gradient(circle at center,${color} 0,${color} ${dot}px,transparent ${dot + 0.6}px) 0 0/${size}px ${size}px`;

export const css = `
.chochla{
  --krem:#FFF3DD;--pomidor:#EE4B2B;--musztarda:#F6B400;--kobalt:#2547C8;--turkus:#19B3A3;--roz:#F7A8C9;--kontur:#1A1714;--szary:#5C534A;--pomidor-ui:#C8321A;
  --gut:clamp(16px,4vw,48px);--line:4px solid var(--kontur);--skip-bg:#1A1714;--skip-fg:#F6B400;
  color-scheme:light;
  background:var(--krem);
  color:var(--kontur);
  font:500 17px/1.6 'Figtree',system-ui,'Segoe UI',Arial,sans-serif;
}
.chochla a{color:var(--kontur);text-decoration-color:var(--pomidor);text-decoration-thickness:3px;text-underline-offset:4px}
.chochla a:focus-visible,.chochla button:focus-visible,.chochla [tabindex]:focus-visible,.chochla summary:focus-visible{outline:4px solid var(--kobalt);outline-offset:3px}
.chochla h1,.chochla h2,.chochla h3,.chochla .bang{font-family:'Bangers',cursive;font-weight:400;letter-spacing:.02em;text-transform:uppercase;line-height:1.15;text-wrap:balance;hyphens:none;margin:0}
.chochla .top{display:flex;justify-content:space-between;gap:12px 16px;flex-wrap:wrap;max-width:1320px;margin:0 auto;padding:16px var(--gut);font-weight:700;font-size:15px}
.chochla p,.chochla dd,.chochla li{text-wrap:pretty}
.chochla .cc{display:block;max-width:1320px;margin:0 auto;padding:0 var(--gut)}

.chochla .hero{position:relative;display:grid;gap:28px;padding:clamp(12px,3vw,32px) 0 clamp(28px,4vw,48px)}
@media (min-width:1000px){.chochla .hero{grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);align-items:center;gap:48px}}
.chochla .hero__title{position:relative;display:inline-block;max-width:100%;margin:8px 0 0;padding:.3em .78em .14em}
.chochla .hero__burst{position:absolute;left:0;top:-10%;width:100%;height:122%;z-index:0}
.chochla .hero__name{position:relative;z-index:1;display:block;font-size:clamp(52px,10vw,140px);line-height:1;color:var(--krem);padding-top:.12em;white-space:nowrap;-webkit-text-stroke:.035em var(--kontur);paint-order:stroke fill}
.chochla .hero__tags{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 18px}
.chochla .hero__style.hero__style--sun{background:var(--musztarda)}
.chochla .hero__style{display:inline-block;margin:0;padding:6px 14px;border:var(--line);background:var(--turkus);font-weight:800;font-size:13px;letter-spacing:.1em;text-transform:uppercase}
.chochla .say{position:relative;margin:28px 0 0;max-width:34em;padding:20px 26px;border:var(--line);border-radius:40px;background:#fff;font-size:clamp(17px,1.7vw,20px);line-height:1.55;font-weight:600}
.chochla .say::before{content:'';position:absolute;left:46px;top:-34px;border-left:20px solid transparent;border-right:8px solid transparent;border-bottom:34px solid var(--kontur)}
.chochla .say::after{content:'';position:absolute;left:52px;top:-24px;border-left:12px solid transparent;border-right:4px solid transparent;border-bottom:26px solid #fff}
.chochla .facts{margin:0;display:grid;gap:12px}
.chochla .facts div{position:relative;padding:12px 16px 12px 16px;border:var(--line);background:#fff}
.chochla .facts div:nth-child(1){background:var(--musztarda)}
.chochla .facts div:nth-child(3){background:var(--roz)}
.chochla .facts dt{font-weight:800;font-size:12px;letter-spacing:.1em;text-transform:uppercase}
.chochla .facts dd{margin:2px 0 0;font-weight:700;font-size:16px;line-height:1.4}

.chochla .band{margin:0 calc(var(--gut) * -1);padding:22px 0 10px;border-block:var(--line);background:${dots('rgba(255,255,255,.22)', 12, 2.2)},var(--kobalt)}
.chochla .band__cap{display:flex;flex-wrap:wrap;gap:8px 12px;align-items:center;margin:0 0 16px;padding-inline:var(--gut)}
.chochla .band__cap span{padding:4px 12px;border:3px solid var(--kontur);background:var(--musztarda);font-weight:800;font-size:13px;letter-spacing:.08em;text-transform:uppercase}
.chochla .band__cap span+span{background:#fff;letter-spacing:.02em;text-transform:none;font-weight:700}
.chochla .strip{display:flex;gap:18px;margin:0;padding:6px var(--gut) 22px;list-style:none;overflow-x:auto;scroll-padding-inline:var(--gut);scroll-snap-type:x proximity;scrollbar-width:thin;scrollbar-color:var(--kontur) transparent}
.chochla .strip__item{flex:none;scroll-snap-align:start}
.chochla .strip__img{display:block;height:clamp(360px,56vw,560px);width:auto;border:var(--line);border-radius:14px;background:#fff}

.chochla .toc{display:flex;flex-wrap:wrap;gap:10px;margin:28px 0 0;padding:0;list-style:none}
.chochla .toc a{display:inline-flex;align-items:center;gap:8px;padding:4px 14px 4px 6px;border:3px solid var(--kontur);border-radius:999px;background:#fff;font-weight:800;font-size:15px;text-decoration:none}
.chochla .toc a:hover{background:var(--musztarda)}
.chochla .toc b{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:var(--pomidor);color:#fff;font-family:'Bangers',cursive;font-weight:400;font-size:18px;padding-top:2px}

.chochla .panel{position:relative;margin-top:clamp(36px,5vw,64px);padding:64px clamp(18px,3vw,40px) clamp(22px,3vw,36px);border:var(--line);background:#fff}
.chochla .panel--sun{background:var(--musztarda)}
.chochla .panel--pink{background:var(--roz)}
.chochla .panel--dots{background:${dots('rgba(26,23,20,.13)', 11, 1.8)},#fff}
.chochla .cap{position:absolute;left:-4px;top:-4px;max-width:calc(100% + 8px);padding:6px 14px;border:var(--line);background:var(--musztarda);font-weight:800;font-size:13px;letter-spacing:.08em;text-transform:uppercase;line-height:1.3}
.chochla .panel--sun .cap{background:#fff}
.chochla h2{font-size:clamp(38px,5.4vw,68px);margin-bottom:18px;max-width:16em}
.chochla .body{margin:0 0 16px;max-width:40em;font-size:clamp(16px,1.3vw,18px)}
.chochla .body--wide{max-width:48em}
.chochla .note{margin:12px 0 0;color:var(--szary);font-size:15px;font-weight:600}

.chochla .split{display:grid;gap:24px;align-items:start}
@media (min-width:1000px){.chochla .split{grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:40px}}
.chochla .brief{margin:0;display:grid;gap:10px}
.chochla .brief div{padding:12px 16px;border:3px solid var(--kontur);background:var(--roz)}
.chochla .brief div:nth-child(2){background:var(--turkus)}
.chochla .brief div:nth-child(3){background:var(--musztarda)}
.chochla .brief dt{font-family:'Bangers',cursive;font-weight:400;font-size:24px;letter-spacing:.03em;text-transform:uppercase;line-height:1.2;padding-top:2px}
.chochla .brief dd{margin:0;font-weight:600;font-size:16px;line-height:1.45}

.chochla .cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:0 32px}
.chochla .legend{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:12px;margin:22px 0 0;padding:0;list-style:none}
.chochla .legend li{display:grid;grid-template-columns:84px minmax(0,1fr);column-gap:12px;align-items:center;padding:10px 14px;border:3px solid var(--kontur);background:var(--krem)}
.chochla .legend__mark{grid-row:1/3;display:block}
.chochla .legend__mark svg{display:block;width:84px;height:auto}
.chochla .legend__name{font-family:'Bangers',cursive;font-size:24px;letter-spacing:.03em;text-transform:uppercase;line-height:1.2;padding-top:2px}
.chochla .legend__what{font-size:14px;line-height:1.4;color:var(--szary);font-weight:600}
.chochla .kit{display:grid;gap:18px;margin-top:24px}
@media (min-width:1000px){.chochla .kit{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);align-items:start}}
.chochla .swatches{display:grid;grid-template-columns:repeat(auto-fill,minmax(108px,1fr));gap:14px 12px;margin:0;padding:0;list-style:none}
.chochla .swatches li{display:flex;flex-direction:column;align-items:flex-start}
.chochla .swatches__chip{width:72px;height:72px;margin-bottom:8px;border:var(--line);border-radius:50%;background:var(--c)}
.chochla .swatches__name{font-weight:800;font-size:15px;line-height:1.2}
.chochla .swatches__hex{font-size:13px;color:var(--szary);font-variant-numeric:tabular-nums}
.chochla .type{padding:18px 20px;border:var(--line);background:var(--krem)}
.chochla .type__bang{margin:0;font-family:'Bangers',cursive;font-size:clamp(38px,4.2vw,52px);line-height:1.2;text-transform:uppercase;letter-spacing:.02em;padding-top:.1em}
.chochla .type__sans{margin:4px 0 0;font-weight:800;font-size:clamp(22px,2.3vw,28px);line-height:1.2}
.chochla .type__meta{margin:12px 0 0;font-size:15px;line-height:1.5;color:var(--szary);font-weight:600}
.chochla .chips{display:flex;flex-wrap:wrap;gap:10px;margin:22px 0 0;padding:0;list-style:none}
.chochla .chips li{padding:4px 14px;border:3px solid var(--kontur);border-radius:999px;background:#fff;font-weight:800;font-size:15px}
.chochla .chips li:nth-child(3n+1){background:var(--roz)}
.chochla .chips li:nth-child(3n+2){background:var(--turkus)}

.chochla .comic{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,340px),1fr));gap:16px;margin:26px 0 0;padding:0;list-style:none}
.chochla .comic__item{position:relative;display:grid;grid-template-columns:clamp(84px,24vw,118px) minmax(0,1fr);gap:16px;align-items:start;padding:18px;border:var(--line);background:var(--krem)}
.chochla .comic__item--first{background:#fff}
.chochla .comic__n{position:absolute;left:-14px;top:-16px;width:58px;height:58px}
.chochla .comic__n svg{position:absolute;inset:0;width:100%;height:100%}
.chochla .comic__n span{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'Bangers',cursive;font-size:26px;padding-top:4px}
.chochla .comic__img{display:block;width:100%;height:auto;border:3px solid var(--kontur);border-radius:8px}
.chochla .comic__head{margin:0;font-family:'Bangers',cursive;font-size:clamp(24px,2.4vw,29px);letter-spacing:.02em;text-transform:uppercase;line-height:1.2;text-wrap:balance;padding-top:.08em}
.chochla .comic__flag{display:inline-block;max-width:100%;margin:8px 0 0;padding:2px 10px;border:3px solid var(--kontur);background:var(--musztarda);font-weight:800;font-size:12px;letter-spacing:.06em;text-transform:uppercase}
.chochla .comic__role{margin:10px 0 0;font-size:15px;line-height:1.55}
@media (max-width:379px){.chochla .comic__item{grid-template-columns:minmax(0,1fr)}.chochla .comic__img{max-width:150px}.chochla .comic__flag{white-space:normal}}
.chochla .shout{position:relative;margin:30px 0 0;max-width:40em;padding:20px 24px;border:var(--line);border-radius:36px;background:var(--musztarda);font-weight:700;font-size:clamp(17px,1.6vw,19px);line-height:1.5}

.chochla .searches{display:grid;gap:24px;margin-top:22px}
@media (min-width:1000px){.chochla .searches{grid-template-columns:1fr 1fr}}
.chochla .search{margin:0;min-width:0}
.chochla .search__screen{max-width:430px;padding:18px 16px 20px;border:var(--line);border-radius:28px;background:#fff;font-family:system-ui,'Segoe UI',Arial,sans-serif;color:#1d1d1f}
.chochla .search--android .search__screen{background:#F7F7F4;border-radius:18px}
.chochla .search__field{display:flex;align-items:center;gap:8px;height:38px;padding:0 12px;border-radius:12px;background:#EFEFF0;color:#5b5b60;font-size:15px}
.chochla .search--android .search__field{border-radius:999px;background:#E9EAE6}
.chochla .search__result{display:flex;align-items:center;gap:12px;margin:16px 0 12px}
.chochla .search__icon{width:60px;height:60px;border-radius:14px}
.chochla .search--android .search__icon{border-radius:18px}
.chochla .search__meta{display:flex;flex-direction:column;flex:1;min-width:0}
.chochla .search__name{font-weight:700;font-size:17px}
.chochla .search__sub{font-size:13px;color:#6b6b70}
.chochla .search__btn{padding:6px 16px;border-radius:999px;background:#EFEFF0;font-weight:700;font-size:14px;color:var(--kobalt)}
.chochla .search--android .search__btn{background:var(--kobalt);color:#fff}
.chochla .search__shots{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.chochla .search__shots img{width:100%;height:auto;border-radius:10px;display:block}
.chochla .search--android .search__shots img{border-radius:6px}
.chochla .search__ghost{display:flex;gap:12px;align-items:center;margin-top:18px;opacity:.55}
.chochla .search__ghost-icon{width:60px;height:60px;border-radius:14px;background:#E3E3E6}
.chochla .search__ghost-lines{display:flex;flex-direction:column;gap:8px;flex:1}
.chochla .search__ghost-lines span{display:block;height:10px;border-radius:5px;background:#E3E3E6;width:60%}
.chochla .search__ghost-lines span+span{width:40%}
.chochla .search__caption{display:inline-block;margin-top:12px;padding:4px 12px;border:3px solid var(--kontur);background:var(--krem);font-weight:700;font-size:14px;line-height:1.35}

.chochla .switch-wrap{margin-top:clamp(36px,5vw,64px)}
.chochla .switch-wrap .panel{margin-top:0;border-bottom:0}
.chochla .switch{margin:0 calc(var(--gut) * -1);padding:20px 0 6px;border-block:var(--line);background:${dots('rgba(26,23,20,.16)', 11, 1.8)},var(--turkus)}
.chochla .switch__bar{display:flex;flex-wrap:wrap;gap:12px 18px;align-items:center;margin:0 0 18px;padding-inline:var(--gut)}
.chochla .switch__group{display:inline-flex;flex-wrap:wrap;gap:6px}
.chochla .switch__btn{appearance:none;margin:0;padding:8px 18px;border:3px solid var(--kontur);border-radius:999px;background:#fff;color:var(--kontur);font:800 16px/1.2 'Figtree',system-ui,sans-serif;cursor:pointer}
.chochla .switch__btn[aria-pressed='true']{background:var(--musztarda)}

.chochla .abs{display:grid;gap:28px;margin-top:22px}
@media (min-width:1080px){.chochla .abs{grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);align-items:start}}
.chochla .ab{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.chochla .ab__item{margin:0;min-width:0}
.chochla .ab__item img{display:block;width:100%;height:auto;border:var(--line);border-radius:10px}
.chochla .ab__item figcaption{display:flex;gap:10px;align-items:flex-start;margin-top:12px;font-weight:800;font-size:15px;line-height:1.3;text-wrap:balance}
.chochla .ab__tag{display:inline-flex;align-items:center;justify-content:center;flex:none;width:36px;height:36px;border:3px solid var(--kontur);border-radius:50%;background:var(--musztarda);font-family:'Bangers',cursive;font-weight:400;font-size:22px;padding-top:2px}
.chochla .ab__item+.ab__item .ab__tag{background:var(--roz)}
@media (max-width:379px){.chochla .ab{grid-template-columns:minmax(0,1fr)}.chochla .ab__item img{max-width:220px}}
.chochla .ab__hypothesis{grid-column:1/-1;margin:8px 0 0;padding:18px 22px;border:var(--line);border-radius:30px;background:var(--krem);font-size:16px;line-height:1.6}
.chochla .ab__hypothesis strong{font-family:'Bangers',cursive;font-weight:400;font-size:24px;letter-spacing:.03em;text-transform:uppercase;color:var(--pomidor-ui)}

.chochla .features{display:grid;gap:20px;margin:6px 0 22px}
@media (min-width:900px){.chochla .features{grid-template-columns:1fr 1fr}}
.chochla .feature{margin:0;min-width:0}
.chochla .feature img{display:block;width:100%;height:auto;border:var(--line)}
.chochla .feature figcaption{margin-top:8px;font-size:14px;font-weight:600;color:var(--szary)}
.chochla .icons{display:flex;flex-wrap:wrap;gap:24px 36px;margin:26px 0 22px}
.chochla .icon{margin:0;width:136px}
.chochla .icon__img{display:block;width:128px;height:128px;border:3px solid var(--kontur)}
.chochla .icon__img--ios{border-radius:22.5%;border:0}
.chochla .icon__img--play{border-radius:30%;border:0}
.chochla .icon figcaption{margin-top:8px;font-weight:800;font-size:14px}

.chochla .deliver{display:grid;gap:28px;align-items:start}
@media (min-width:1080px){.chochla .deliver{grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:48px}}
.chochla .dl{min-width:0;padding:16px 18px;border:var(--line);background:var(--krem)}
.chochla .dl__zip{display:flex;flex-wrap:wrap;justify-content:space-between;gap:6px 16px;align-items:center;padding:12px 16px;border:var(--line);border-radius:999px;background:var(--pomidor);color:#fff;text-decoration:none}
.chochla .dl__zip:hover{background:var(--kobalt)}
.chochla .dl__zip-name{font-family:'Bangers',cursive;font-size:clamp(24px,2.6vw,30px);letter-spacing:.03em;line-height:1.1;padding-top:2px;overflow-wrap:anywhere}
.chochla .dl__zip-size{font-weight:800;font-size:15px}
.chochla .dl__list{margin:10px 0 0;padding:0;list-style:none}
.chochla .dl__row{border-bottom:3px solid var(--kontur)}
.chochla .dl__row:last-child{border-bottom:0}
.chochla .dl__row summary{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 16px;padding:12px 0;cursor:pointer;list-style:none}
.chochla .dl__row summary::-webkit-details-marker{display:none}
.chochla .dl__title{font-weight:800}
.chochla .dl__formats{grid-row:2;color:var(--szary);font-size:14px}
.chochla .dl__count{text-align:right;font-weight:800}
.chochla .dl__size{grid-row:2;text-align:right;color:var(--szary);font-size:14px}
.chochla .dl__files{margin:0 0 12px;padding:0;list-style:none;font-size:14px}
.chochla .dl__files li{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:0 12px;padding:4px 0}
.chochla .dl__file{overflow-wrap:anywhere;font-weight:700}
.chochla .dl__dim{grid-row:2;color:var(--szary)}
.chochla .dl__bytes{text-align:right;color:var(--szary)}

.chochla .files{display:grid;gap:18px;margin-top:20px}
@media (min-width:1000px){.chochla .files{grid-template-columns:1fr 1fr}}
.chochla .files__item{margin:0;min-width:0;border:var(--line);background:var(--krem)}
.chochla .files__name{display:block;padding:8px 14px;border-bottom:var(--line);background:var(--musztarda);font-weight:800;font-size:15px}
.chochla .files__item+.files__item .files__name{background:var(--roz)}
.chochla .files__code{margin:0;padding:14px;color:var(--kontur);font:500 13px/1.7 ui-monospace,'SFMono-Regular',Menlo,Consolas,monospace;overflow-x:auto;white-space:pre-wrap;overflow-wrap:break-word}

.chochla .cta{position:relative;margin:clamp(40px,6vw,80px) 0 0;padding:clamp(36px,6vw,72px) clamp(20px,4vw,56px);border:var(--line);background:${dots('rgba(26,23,20,.18)', 12, 2)},var(--pomidor);overflow:hidden}
.chochla .cta__inner{position:relative;max-width:44em;padding:clamp(20px,3vw,32px);border:var(--line);border-radius:40px;background:#fff}
.chochla .cta h2{font-size:clamp(36px,5vw,64px)}
.chochla .cta__link{display:inline-block;margin-top:6px;padding:12px 24px;border:var(--line);border-radius:999px;background:var(--musztarda);font-weight:800;font-size:18px;text-decoration:none}
.chochla .cta__link:hover{background:var(--turkus)}
.chochla .foot{max-width:1320px;margin:0 auto;padding:24px var(--gut) 40px;font-size:14px;font-weight:600}
.chochla .sample-note{margin:0}
@media (prefers-reduced-motion:reduce){.chochla *{scroll-behavior:auto}}
`;
