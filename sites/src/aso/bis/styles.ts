const chrome =
  'linear-gradient(135deg,#FFFFFF 0%,#C5CCD8 16%,#7E8798 34%,#F4F6FA 50%,#A3ABBB 66%,#EEF1F5 82%,#7F889A 100%)';
const holo = 'linear-gradient(115deg,#FF8AD0 0%,#FFC7A0 34%,#D7FF63 64%,#72EFFF 100%)';
const rim = `background:linear-gradient(#FFFFFFF2,#F7F9FCF2) padding-box,${chrome} border-box;border:3px solid transparent`;

export const css = `
.bis{
  --jasny:#EEF1F6;--chrom:#AAB2C0;--grafit:#3B4250;--atrament:#111217;--roz:#FF8AD0;--cyjan:#72EFFF;--limonka:#D7FF63;--brzoskwinia:#FFC7A0;
  --holo:${holo};--chrome:${chrome};--gut:clamp(16px,4vw,48px);--skip-bg:#111217;--skip-fg:#D7FF63;
  color-scheme:light;
  background:radial-gradient(700px 520px at 100% 0,rgba(114,239,255,.38),transparent 70%),radial-gradient(640px 520px at 0 340px,rgba(255,138,208,.32),transparent 70%),radial-gradient(800px 600px at 90% 1400px,rgba(215,255,99,.26),transparent 70%),radial-gradient(800px 600px at 0 2600px,rgba(255,199,160,.32),transparent 70%),linear-gradient(180deg,#F6F8FB 0,#E7EBF1 1200px,#DDE2EA 100%);
  background-color:var(--jasny);
  color:var(--atrament);
  font:500 17px/1.6 'Quicksand',system-ui,'Segoe UI',Arial,sans-serif;
}
.bis a{color:var(--atrament);text-decoration-color:var(--roz);text-decoration-thickness:2px;text-underline-offset:4px}
.bis a:hover{text-decoration-color:var(--atrament)}
.bis a:focus-visible,.bis button:focus-visible,.bis [tabindex]:focus-visible,.bis summary:focus-visible{outline:3px solid var(--atrament);outline-offset:3px;border-radius:8px}
.bis h1,.bis h2,.bis h3{margin:0;font-family:'Modak',system-ui,sans-serif;font-weight:400;line-height:.98;letter-spacing:.005em;color:var(--atrament);text-wrap:balance;hyphens:none;text-shadow:0 3px 0 #fff}
.bis p,.bis dd,.bis li{text-wrap:pretty}
.bis .top{display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px 16px;max-width:1320px;margin:0 auto;padding:18px var(--gut);font-size:15px;font-weight:700}
.bis .top a{text-decoration:none;padding:6px 14px;border-radius:999px;background:#fff;box-shadow:0 0 0 1px rgba(17,18,23,.12)}
.bis .top a:hover{background:var(--limonka)}
.bis .bz{display:block;max-width:1320px;margin:0 auto;padding:0 var(--gut)}

.bis .hero{position:relative;padding:clamp(28px,6vw,80px) 0 clamp(28px,4vw,48px);text-align:center;isolation:isolate}
.bis .hero__sparks{position:absolute;inset:0;z-index:-1;pointer-events:none;overflow:hidden}
.bis .hero__sparks svg{position:absolute;filter:drop-shadow(0 0 6px #fff)}
.bis .hero__tags{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:0 0 10px;padding:0;list-style:none}
.bis .hero__tags li{padding:5px 14px;border-radius:999px;background:#fff;box-shadow:0 0 0 1px rgba(17,18,23,.14);font-weight:700;font-size:13px;letter-spacing:.06em;text-transform:uppercase}
.bis .hero__tags li:last-child{background:var(--holo)}
.bis .hero__title{margin:0 auto;width:min(100%,560px)}
.bis .hero__title svg{display:block;width:100%;height:auto;overflow:visible}
.bis .hero__lead{margin:6px auto 0;max-width:38em;font-size:clamp(17px,1.7vw,20px);font-weight:600;line-height:1.6}
.bis .stickers{display:flex;flex-wrap:wrap;justify-content:center;gap:14px 18px;margin:30px 0 0;padding:0;list-style:none}
.bis .stickers li{display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:140px;padding:12px 20px 14px;border-radius:26px;background:var(--holo);box-shadow:0 0 0 4px #fff,0 0 0 5px rgba(17,18,23,.14),0 16px 26px -16px rgba(17,18,23,.5);transform:rotate(var(--r,0deg))}
.bis .stickers li:nth-child(even){background:#fff}
.bis .stickers b{font-weight:700;font-size:18px;line-height:1.2}
.bis .stickers span{font-weight:700;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--grafit)}

.bis .stage{position:relative;margin:clamp(24px,4vw,40px) calc(var(--gut) * -1) 0;padding:22px 0 6px;background:linear-gradient(180deg,rgba(255,255,255,.55),rgba(255,255,255,.15));border-block:3px solid transparent;border-image:${chrome} 1}
.bis .stage__cap{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:baseline;margin:0 0 14px;padding-inline:var(--gut);font-weight:700;font-size:14px}
.bis .stage__cap b{font-family:'Modak',system-ui,sans-serif;font-weight:400;font-size:26px;line-height:1}
.bis .stage__cap span{color:var(--grafit)}
.bis .strip{display:flex;gap:18px;margin:0;padding:6px var(--gut) 26px;list-style:none;overflow-x:auto;scroll-padding-inline:var(--gut);scroll-snap-type:x proximity;scrollbar-width:thin;scrollbar-color:var(--chrom) transparent}
.bis .strip__item{flex:none;scroll-snap-align:start}
.bis .strip__img{display:block;height:clamp(360px,56vw,560px);width:auto;border-radius:20px;box-shadow:0 0 0 3px #fff,0 0 0 4px rgba(17,18,23,.16),0 26px 44px -26px rgba(17,18,23,.55)}

.bis .setnav{position:relative;margin:28px 0 0}
.bis .setnav ol{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:0;padding:0;list-style:none}
.bis .setnav a{display:inline-flex;align-items:center;gap:8px;padding:7px 15px 7px 8px;border-radius:999px;background:#fff;box-shadow:0 0 0 1px rgba(17,18,23,.14);font-weight:700;font-size:14.5px;text-decoration:none}
.bis .setnav a:hover{background:var(--limonka)}
.bis .setnav__n{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;background:var(--atrament);color:var(--limonka);font-size:12px}

.bis .panel{position:relative;margin-top:clamp(36px,5vw,64px);padding:clamp(22px,3.6vw,48px);border-radius:34px;${rim};box-shadow:0 30px 60px -40px rgba(17,18,23,.45)}
.bis .panel--bare{padding:0;border:0;background:none;box-shadow:none}
.bis .cap{display:inline-flex;align-items:center;gap:10px;margin:0 0 14px;padding:4px 14px 4px 4px;border-radius:999px;background:var(--atrament);color:#fff;font-weight:700;font-size:13px;letter-spacing:.08em;text-transform:uppercase}
.bis .cap span{display:inline-flex;align-items:center;justify-content:center;min-width:26px;height:26px;padding:0 6px;border-radius:999px;background:var(--holo);color:var(--atrament);letter-spacing:0}
.bis h2{font-size:clamp(40px,5.6vw,72px);margin-bottom:22px;max-width:14em}
.bis .body{margin:0 0 16px;max-width:40em;font-size:clamp(16px,1.3vw,17.5px);font-weight:500}
.bis .body--wide{max-width:50em}
.bis .note{margin:12px 0 0;color:var(--grafit);font-size:15px;font-weight:600}

.bis .split{display:grid;gap:26px;align-items:start}
@media (min-width:1000px){.bis .split{grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:48px}}
.bis .brief{display:grid;gap:14px;margin:0}
.bis .brief div{padding:14px 18px 16px;border-radius:22px;background:var(--jasny);box-shadow:inset 0 0 0 1px rgba(17,18,23,.1)}
.bis .brief div:nth-child(2){background:var(--holo)}
.bis .brief dt{font-family:'Modak',system-ui,sans-serif;font-size:26px;line-height:1.1}
.bis .brief dd{margin:4px 0 0;font-weight:600;font-size:15.5px;line-height:1.5}

.bis .cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:0 32px}
.bis .tools{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:16px;margin:24px 0 0;padding:0;list-style:none}
.bis .tools li{display:flex;flex-direction:column;gap:4px;padding:18px 20px;border-radius:24px;background:#fff;box-shadow:0 0 0 3px #fff,0 0 0 4px rgba(17,18,23,.12),0 14px 24px -18px rgba(17,18,23,.5);transform:rotate(var(--r,0deg))}
.bis .tools__name{font-family:'Modak',system-ui,sans-serif;font-size:30px;line-height:1.05}
.bis .tools__what{font-size:15px;line-height:1.45;font-weight:600;color:var(--grafit)}
.bis .kit{display:grid;gap:20px;margin-top:28px}
@media (min-width:1000px){.bis .kit{grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);align-items:start}}
.bis .swatches{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:18px 12px;margin:0;padding:0;list-style:none}
.bis .swatches li{display:flex;flex-direction:column;align-items:center;text-align:center}
.bis .swatches__chip{width:64px;height:64px;margin-bottom:8px;border-radius:50%;background:radial-gradient(circle at 34% 28%,rgba(255,255,255,.8),rgba(255,255,255,0) 45%),var(--c);box-shadow:0 0 0 4px #fff,0 0 0 5px rgba(17,18,23,.16),0 10px 18px -10px rgba(17,18,23,.5)}
.bis .swatches__name{font-weight:700;font-size:14.5px;line-height:1.25}
.bis .swatches__hex{font-size:13px;font-weight:600;color:var(--grafit);font-variant-numeric:tabular-nums}
.bis .type{padding:20px 22px;border-radius:26px;background:var(--jasny);box-shadow:inset 0 0 0 1px rgba(17,18,23,.1)}
.bis .type svg{display:block;width:100%;max-width:420px;height:auto;overflow:visible}
.bis .type__sans{margin:12px 0 0;font-weight:700;font-size:clamp(19px,2vw,23px);line-height:1.25}
.bis .type__meta{margin:10px 0 0;font-size:14.5px;line-height:1.5;font-weight:600;color:var(--grafit)}
.bis .chips{display:flex;flex-wrap:wrap;gap:8px;margin:22px 0 0;padding:0;list-style:none}
.bis .chips li{padding:6px 14px;border-radius:999px;background:var(--atrament);color:#fff;font-weight:700;font-size:14px}
.bis .roster{margin-top:28px;padding:20px 22px;border-radius:26px;background:var(--atrament);color:#fff}
.bis .roster h3{font-size:clamp(28px,3vw,38px);color:#fff;text-shadow:none}
.bis .roster p{margin:8px 0 14px;max-width:46em;font-weight:500;color:#D6DBE4}
.bis .roster ul{display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:0;list-style:none}
.bis .roster li{padding:6px 14px;border-radius:999px;background:var(--holo);color:var(--atrament);font-weight:700;font-size:14.5px}
.bis .roster li.venue{background:#fff}

.bis .tracks{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr));gap:22px;margin:28px 0 0;padding:0;list-style:none}
.bis .track{position:relative;display:grid;grid-template-columns:minmax(0,120px) minmax(0,1fr);grid-template-rows:auto 1fr;gap:4px 16px;align-items:start;padding:16px;border-radius:26px;background:#fff;box-shadow:0 0 0 1px rgba(17,18,23,.1),0 18px 30px -24px rgba(17,18,23,.5)}
.bis .track--first{background:linear-gradient(#fff,#fff) padding-box,${holo} border-box;border:3px solid transparent}
.bis .track__img{grid-row:1/3;display:block;width:100%;height:auto;border-radius:12px;box-shadow:0 0 0 1px rgba(17,18,23,.12)}
.bis .track__n{display:block;font-family:'Modak',system-ui,sans-serif;font-size:40px;line-height:.9}
.bis .track__head{margin:6px 0 0;font-weight:700;font-size:18px;line-height:1.25;text-wrap:balance}
.bis .track__flag{display:inline-block;margin:8px 0 0;padding:2px 10px;border-radius:999px;background:var(--limonka);font-weight:700;font-size:12px;letter-spacing:.04em}
.bis .track__role{grid-column:2;margin:8px 0 0;font-size:14.5px;line-height:1.55;font-weight:500;color:var(--grafit)}
@media (max-width:520px){.bis .track{grid-template-columns:minmax(0,96px) minmax(0,1fr);grid-template-rows:auto auto}.bis .track__img{grid-row:1}.bis .track__head{font-size:16px}.bis .track__role{grid-column:1/-1}}
@media (max-width:400px){.bis .track{grid-template-columns:minmax(0,1fr)}.bis .track__img{max-width:150px}}
.bis .quiet{margin:28px 0 0;max-width:44em;padding:16px 20px;border-radius:22px;background:var(--atrament);color:#fff;font-weight:600;font-size:clamp(17px,1.6vw,19px);line-height:1.5}

.bis .searches{display:grid;gap:24px;margin-top:22px}
@media (min-width:1000px){.bis .searches{grid-template-columns:1fr 1fr}}
.bis .search{margin:0;min-width:0}
.bis .search__screen{max-width:430px;padding:18px 16px 20px;border-radius:28px;background:#FAFAFB;font-family:system-ui,'Segoe UI',Arial,sans-serif;color:#1d1d1f;box-shadow:0 0 0 1px rgba(17,18,23,.12),0 24px 44px -26px rgba(17,18,23,.5)}
.bis .search--android .search__screen{background:#F5F6F5;border-radius:18px}
.bis .search__field{display:flex;align-items:center;gap:8px;height:38px;padding:0 12px;border-radius:12px;background:#E9EAEE;color:#55565c;font-size:15px}
.bis .search--android .search__field{border-radius:999px;background:#E4E7E4}
.bis .search__result{display:flex;align-items:center;gap:12px;margin:16px 0 12px}
.bis .search__icon{width:60px;height:60px;border-radius:14px}
.bis .search--android .search__icon{border-radius:18px}
.bis .search__meta{display:flex;flex-direction:column;flex:1;min-width:0}
.bis .search__name{font-weight:700;font-size:17px}
.bis .search__sub{font-size:13px;color:#5f6066}
.bis .search__btn{padding:6px 16px;border-radius:999px;background:#E9EAEE;font-weight:700;font-size:14px;color:#1d3a8a}
.bis .search--android .search__btn{background:#1d3a8a;color:#fff}
.bis .search__shots{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.bis .search__shots img{width:100%;height:auto;border-radius:10px;display:block}
.bis .search--android .search__shots img{border-radius:6px}
.bis .search__ghost{display:flex;gap:12px;align-items:center;margin-top:18px;opacity:.55}
.bis .search__ghost-icon{width:60px;height:60px;border-radius:14px;background:#DADBE0}
.bis .search__ghost-lines{display:flex;flex-direction:column;gap:8px;flex:1}
.bis .search__ghost-lines span{display:block;height:10px;border-radius:5px;background:#DADBE0;width:60%}
.bis .search__ghost-lines span+span{width:40%}
.bis .search__caption{display:block;margin-top:12px;color:var(--grafit);font-size:14px;font-weight:600;line-height:1.4}

.bis .switch-wrap{margin-top:clamp(40px,6vw,72px)}
.bis .switch{margin:0 calc(var(--gut) * -1);padding:20px 0 6px;background:linear-gradient(180deg,rgba(255,255,255,.6),rgba(255,255,255,.2));border-block:3px solid transparent;border-image:${chrome} 1}
.bis .switch__bar{display:flex;flex-wrap:wrap;gap:12px 18px;align-items:center;margin:0 0 18px;padding-inline:var(--gut)}
.bis .switch__group{display:inline-flex;flex-wrap:wrap;gap:4px;padding:4px;border-radius:999px;background:#fff;box-shadow:0 0 0 1px rgba(17,18,23,.14)}
.bis .switch__btn{appearance:none;margin:0;padding:9px 20px;border:0;border-radius:999px;background:transparent;color:var(--atrament);font:700 15px/1.2 'Quicksand',system-ui,sans-serif;cursor:pointer}
.bis .switch__btn[aria-pressed='true']{background:var(--atrament);color:var(--limonka)}

.bis .abs{display:grid;gap:28px;margin-top:22px}
@media (min-width:1080px){.bis .abs{grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);align-items:start}}
.bis .ab{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.bis .ab__item{margin:0;min-width:0}
.bis .ab__item img{display:block;width:100%;height:auto;border-radius:16px;box-shadow:0 0 0 3px #fff,0 0 0 4px rgba(17,18,23,.14)}
.bis .ab__item figcaption{display:flex;gap:10px;align-items:flex-start;margin-top:12px;font-weight:700;font-size:15px;line-height:1.35;text-wrap:balance;hyphens:none}
.bis .ab__tag{display:inline-flex;align-items:center;justify-content:center;flex:none;width:32px;height:32px;border-radius:50%;background:var(--chrome);box-shadow:0 0 0 1.5px var(--atrament);font-family:'Modak',system-ui,sans-serif;font-weight:400;font-size:20px;line-height:1}
@media (max-width:560px){.bis .ab__item figcaption{font-size:13px;gap:8px}.bis .ab__tag{width:28px;height:28px;font-size:17px}}
.bis .ab__hypothesis{grid-column:1/-1;margin:8px 0 0;padding:18px 22px;border-radius:24px;background:var(--holo);font-size:16px;font-weight:600;line-height:1.6}
.bis .ab__hypothesis strong{font-family:'Modak',system-ui,sans-serif;font-weight:400;font-size:24px;line-height:1}

.bis .features{display:grid;gap:20px;margin:6px 0 22px}
@media (min-width:900px){.bis .features{grid-template-columns:1fr 1fr}}
.bis .feature{margin:0;min-width:0}
.bis .feature img{display:block;width:100%;height:auto;border-radius:14px;box-shadow:0 0 0 3px #fff,0 0 0 4px rgba(17,18,23,.14)}
.bis .feature figcaption{margin-top:8px;font-size:14px;font-weight:600;color:var(--grafit)}
.bis .icons{display:flex;flex-wrap:wrap;gap:24px 36px;margin:26px 0 22px}
.bis .icon{margin:0;width:136px}
.bis .icon__img{display:block;width:128px;height:128px;box-shadow:0 0 0 1px rgba(17,18,23,.14)}
.bis .icon__img--ios{border-radius:22.5%}
.bis .icon__img--play{border-radius:30%}
.bis .icon figcaption{margin-top:8px;font-weight:700;font-size:14px;color:var(--grafit)}

.bis .deliver{display:grid;gap:28px;align-items:start}
@media (min-width:1080px){.bis .deliver{grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:48px}}
.bis .dl{position:relative;min-width:0;padding:10px 20px 14px;border-radius:26px;background:var(--jasny);box-shadow:inset 0 0 0 1px rgba(17,18,23,.1)}
.bis .dl__zip{position:relative;display:flex;flex-wrap:wrap;justify-content:space-between;gap:6px 16px;align-items:center;margin-top:10px;padding:16px 22px;border-radius:18px;background:var(--holo);color:var(--atrament);text-decoration:none;box-shadow:0 0 0 1.5px var(--atrament)}
.bis .dl__zip::before,.bis .dl__zip::after{content:'';position:absolute;top:50%;width:18px;height:18px;margin-top:-9px;border-radius:50%;background:var(--jasny);box-shadow:inset 0 0 0 1.5px var(--atrament)}
.bis .dl__zip::before{left:-10px;clip-path:inset(0 0 0 50%)}
.bis .dl__zip::after{right:-10px;clip-path:inset(0 50% 0 0)}
.bis .dl__zip:hover{background:var(--limonka)}
.bis .dl__zip-name{font-family:'Modak',system-ui,sans-serif;font-size:clamp(24px,2.6vw,32px);line-height:1;overflow-wrap:anywhere}
.bis .dl__zip-size{font-weight:700;font-size:15px;font-variant-numeric:tabular-nums}
.bis .dl__list{margin:10px 0 0;padding:0;list-style:none}
.bis .dl__row{border-bottom:2px dashed rgba(17,18,23,.14)}
.bis .dl__row:last-child{border-bottom:0}
.bis .dl__row summary{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 16px;padding:12px 0;cursor:pointer;list-style:none}
.bis .dl__row summary::-webkit-details-marker{display:none}
.bis .dl__title{font-weight:700}
.bis .dl__formats{grid-row:2;color:var(--grafit);font-size:14px;font-weight:600}
.bis .dl__count{text-align:right;font-weight:700}
.bis .dl__size{grid-row:2;text-align:right;color:var(--grafit);font-size:14px;font-weight:600;font-variant-numeric:tabular-nums}
.bis .dl__files{margin:0 0 12px;padding:0;list-style:none;font-size:14px}
.bis .dl__files li{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:0 12px;padding:4px 0}
.bis .dl__file{overflow-wrap:anywhere;font-weight:700}
.bis .dl__dim{grid-row:2;color:var(--grafit);font-weight:600}
.bis .dl__bytes{text-align:right;color:var(--grafit);font-weight:600;font-variant-numeric:tabular-nums}

.bis .files{display:grid;gap:18px;margin-top:20px}
@media (min-width:1000px){.bis .files{grid-template-columns:1fr 1fr}}
.bis .files__item{margin:0;min-width:0;border-radius:22px;background:var(--atrament);overflow:hidden}
.bis .files__name{display:block;padding:10px 18px;background:var(--holo);color:var(--atrament);font-weight:700;font-size:14px}
.bis .files__code{margin:0;padding:16px 18px;color:#F2F4F8;font:500 13px/1.7 ui-monospace,'SFMono-Regular',Menlo,Consolas,monospace;overflow-x:auto;white-space:pre-wrap;overflow-wrap:break-word}

.bis .cta{position:relative;margin:clamp(40px,6vw,80px) 0 0;padding:clamp(28px,5vw,64px);border-radius:36px;background:radial-gradient(500px 300px at 100% 0,rgba(114,239,255,.6),transparent 70%),radial-gradient(500px 300px at 0 100%,rgba(255,138,208,.55),transparent 70%),#fff;box-shadow:0 0 0 4px #fff,0 0 0 5px rgba(17,18,23,.14),0 30px 60px -40px rgba(17,18,23,.5);overflow:hidden}
.bis .cta h2{max-width:13em}
.bis .cta__link{display:inline-block;margin-top:8px;padding:14px 26px;border-radius:999px;background:var(--atrament);color:var(--limonka);font-weight:700;font-size:16px;text-decoration:none}
.bis .cta__link:hover{background:var(--grafit)}
.bis .foot{max-width:1320px;margin:0 auto;padding:28px var(--gut) 44px;font-size:14px;font-weight:600;color:var(--grafit)}
.bis .sample-note{margin:0}
@media (prefers-reduced-motion:reduce){.bis *{scroll-behavior:auto}}
`;
