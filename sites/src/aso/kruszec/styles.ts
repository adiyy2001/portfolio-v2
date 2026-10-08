const glass =
  'background:linear-gradient(160deg,rgba(255,255,255,.075),rgba(255,255,255,.03) 60%,rgba(255,255,255,.05));border:1px solid rgba(255,255,255,.13);box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 40px 80px -50px rgba(0,0,0,.9)';

export const css = `
.kruszec{
  --glebia:#0A1020;--granat:#131D33;--tekst:#EDF1F7;--tekst2:#9AA7BB;--szalwia:#8FD4B6;--lod:#B8CBE6;--platyna:#DCE1E8;--koral:#E8998B;
  --edge:rgba(255,255,255,.13);--gut:clamp(16px,4vw,48px);--skip-bg:#DCE1E8;--skip-fg:#0A1020;
  color-scheme:dark;
  background:radial-gradient(1200px 700px at 78% -120px,rgba(143,212,182,.1),transparent 70%),radial-gradient(900px 600px at 0% 30%,rgba(184,203,230,.05),transparent 70%),linear-gradient(180deg,#0D1528 0,var(--glebia) 900px);
  background-color:var(--glebia);
  color:var(--tekst);
  font:400 17px/1.65 'Manrope',system-ui,'Segoe UI',Arial,sans-serif;
  font-variant-numeric:lining-nums;
}
.kruszec a{color:var(--tekst);text-decoration-color:var(--szalwia);text-decoration-thickness:1px;text-underline-offset:4px}
.kruszec a:hover{color:var(--szalwia)}
.kruszec a:focus-visible,.kruszec button:focus-visible,.kruszec [tabindex]:focus-visible,.kruszec summary:focus-visible{outline:2px solid var(--szalwia);outline-offset:3px;border-radius:6px}
.kruszec h1,.kruszec h2,.kruszec h3{font-family:'Instrument Serif',Georgia,serif;font-weight:400;line-height:1.04;letter-spacing:-.01em;color:var(--platyna);text-wrap:balance;hyphens:none;margin:0}
.kruszec em{font-style:italic;color:var(--szalwia)}
.kruszec p,.kruszec dd,.kruszec li{text-wrap:pretty}
.kruszec .top{display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px 16px;max-width:1320px;margin:0 auto;padding:18px var(--gut);font-size:15px;font-weight:500}
.kruszec .top a{color:var(--tekst2);text-decoration:none}
.kruszec .top a:hover{color:var(--tekst)}
.kruszec .kz{display:block;max-width:1320px;margin:0 auto;padding:0 var(--gut)}

.kruszec .hero{position:relative;display:grid;gap:32px;padding:clamp(24px,5vw,72px) 0 clamp(120px,15vw,210px);isolation:isolate}
@media (min-width:1000px){.kruszec .hero{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);align-items:end;gap:56px}}
.kruszec .hero__line{position:absolute;left:calc(var(--gut) * -1);right:calc(var(--gut) * -1);bottom:6px;width:calc(100% + var(--gut) * 2);height:clamp(100px,14vw,200px);z-index:-1;overflow:visible}
.kruszec .hero__glow{filter:blur(6px);opacity:.55}
.kruszec .hero__tags{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 22px}
.kruszec .hero__tags span{display:inline-block;padding:5px 12px;border:1px solid var(--edge);border-radius:999px;background:rgba(255,255,255,.05);color:var(--tekst2);font-weight:600;font-size:13px;letter-spacing:.06em;text-transform:uppercase}
.kruszec .hero__title{font-size:clamp(72px,15vw,200px);line-height:.9;letter-spacing:-.02em;color:var(--tekst)}
.kruszec .hero__lead{margin:28px 0 0;max-width:36em;font-size:clamp(17px,1.6vw,20px);line-height:1.6;color:var(--tekst)}
.kruszec .statement{margin:0;padding:8px 22px;border-radius:24px;${glass};backdrop-filter:blur(14px)}
.kruszec .statement div{display:grid;grid-template-columns:minmax(0,7.5em) minmax(0,1fr);gap:4px 16px;padding:14px 0;border-top:1px solid rgba(255,255,255,.08)}
.kruszec .statement div:first-child{border-top:0}
.kruszec .statement dt{color:var(--tekst2);font-size:13px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding-top:3px}
.kruszec .statement dd{margin:0;font-size:15.5px;line-height:1.5;font-weight:500}
@media (max-width:520px){.kruszec .statement div{grid-template-columns:1fr}}

.kruszec .band{margin:0 calc(var(--gut) * -1);padding:22px 0 8px;border-block:1px solid rgba(255,255,255,.08);background:linear-gradient(180deg,rgba(255,255,255,.035),rgba(255,255,255,.01))}
.kruszec .band__cap{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:baseline;margin:0 0 16px;padding-inline:var(--gut);font-size:14px}
.kruszec .band__cap span:first-child{font-family:'Instrument Serif',Georgia,serif;font-size:22px;color:var(--platyna)}
.kruszec .band__cap span+span{color:var(--tekst2)}
.kruszec .strip{display:flex;gap:18px;margin:0;padding:6px var(--gut) 24px;list-style:none;overflow-x:auto;scroll-padding-inline:var(--gut);scroll-snap-type:x proximity;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.25) transparent}
.kruszec .strip__item{flex:none;scroll-snap-align:start}
.kruszec .strip__img{display:block;height:clamp(360px,56vw,560px);width:auto;border-radius:18px;box-shadow:0 0 0 1px rgba(255,255,255,.12),0 30px 60px -30px rgba(0,0,0,.9)}
.kruszec .strip--ipad .strip__img{height:clamp(300px,46vw,520px);border-radius:16px}

.kruszec .seg{margin:30px 0 0}
.kruszec .seg ol{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:6px;list-style:none;border:1px solid var(--edge);border-radius:20px;background:rgba(255,255,255,.04)}
.kruszec .seg a{display:inline-flex;align-items:baseline;gap:8px;padding:7px 14px;border-radius:14px;color:var(--tekst);font-weight:600;font-size:14.5px;text-decoration:none}
.kruszec .seg a:hover{background:rgba(255,255,255,.08);color:var(--tekst)}
.kruszec .seg__n{color:var(--szalwia);font-size:12px;font-variant-numeric:tabular-nums}

.kruszec .glass{position:relative;margin-top:clamp(32px,5vw,56px);padding:clamp(22px,3.4vw,44px);border-radius:28px;${glass}}
.kruszec .cap{display:flex;align-items:baseline;gap:12px;margin:0 0 14px;color:var(--tekst2);font-weight:600;font-size:13px;letter-spacing:.08em;text-transform:uppercase}
.kruszec .cap span{color:var(--szalwia);font-variant-numeric:tabular-nums}
.kruszec h2{font-size:clamp(36px,5vw,64px);margin-bottom:20px;max-width:15em}
.kruszec .body{margin:0 0 16px;max-width:40em;font-size:clamp(16px,1.3vw,17.5px);color:var(--tekst)}
.kruszec .body--wide{max-width:48em}
.kruszec .note{margin:12px 0 0;color:var(--tekst2);font-size:15px}
.kruszec .sub{margin:22px 0 10px;font-family:'Instrument Serif',Georgia,serif;font-size:24px;color:var(--platyna)}
.kruszec .glass--wide .strip{margin:0 calc(clamp(22px,3.4vw,44px) * -1);padding-inline:clamp(22px,3.4vw,44px);scroll-padding-inline:clamp(22px,3.4vw,44px)}

.kruszec .split{display:grid;gap:24px;align-items:start}
@media (min-width:1000px){.kruszec .split{grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:48px}}
.kruszec .brief{margin:0;display:grid;gap:0;border-top:1px solid rgba(255,255,255,.1)}
.kruszec .brief div{padding:14px 0;border-bottom:1px solid rgba(255,255,255,.1)}
.kruszec .brief dt{font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-size:24px;line-height:1.2;color:var(--szalwia)}
.kruszec .brief dd{margin:4px 0 0;font-size:15.5px;line-height:1.5}

.kruszec .cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:0 32px}
.kruszec .tools{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:12px;margin:22px 0 0;padding:0;list-style:none}
.kruszec .tools li{display:flex;flex-direction:column;gap:4px;padding:16px 18px;border:1px solid rgba(255,255,255,.1);border-radius:18px;background:rgba(255,255,255,.035)}
.kruszec .tools__name{font-family:'Instrument Serif',Georgia,serif;font-size:26px;line-height:1.1;color:var(--platyna)}
.kruszec .tools__what{font-size:14.5px;line-height:1.45;color:var(--tekst2)}
.kruszec .kit{display:grid;gap:18px;margin-top:24px}
@media (min-width:1000px){.kruszec .kit{grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);align-items:start}}
.kruszec .swatches{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:16px 12px;margin:0;padding:0;list-style:none}
.kruszec .swatches li{display:flex;flex-direction:column;align-items:flex-start}
.kruszec .swatches__chip{width:100%;max-width:120px;height:56px;margin-bottom:8px;border-radius:14px;background:var(--c);box-shadow:0 0 0 1px rgba(255,255,255,.16)}
.kruszec .swatches__name{font-weight:600;font-size:15px;line-height:1.25}
.kruszec .swatches__hex{font-size:13px;color:var(--tekst2);font-variant-numeric:tabular-nums}
.kruszec .type{padding:20px 22px;border:1px solid rgba(255,255,255,.1);border-radius:20px;background:rgba(255,255,255,.035)}
.kruszec .type__serif{margin:0;font-family:'Instrument Serif',Georgia,serif;font-size:clamp(40px,4.4vw,58px);line-height:1.05;color:var(--platyna)}
.kruszec .type__sans{margin:10px 0 0;font-weight:700;font-size:clamp(20px,2vw,24px);line-height:1.2;font-variant-numeric:tabular-nums}
.kruszec .type__meta{margin:12px 0 0;font-size:14.5px;line-height:1.5;color:var(--tekst2)}
.kruszec .chips{display:flex;flex-wrap:wrap;gap:8px;margin:22px 0 0;padding:0;list-style:none}
.kruszec .chips li{padding:5px 14px;border:1px solid var(--edge);border-radius:999px;color:var(--tekst2);font-weight:600;font-size:14px}

.kruszec .ledger{display:grid;gap:0;margin:28px 0 0;padding:0;list-style:none;border-top:1px solid rgba(255,255,255,.1)}
.kruszec .ledger__item{display:grid;grid-template-columns:auto clamp(84px,20vw,128px) minmax(0,1fr);gap:clamp(14px,2.4vw,32px);align-items:start;padding:22px 0;border-bottom:1px solid rgba(255,255,255,.1)}
.kruszec .ledger__n{font-family:'Instrument Serif',Georgia,serif;font-size:clamp(28px,3.4vw,44px);line-height:1;color:var(--tekst2);font-variant-numeric:tabular-nums}
.kruszec .ledger__item--first .ledger__n{color:var(--szalwia)}
.kruszec .ledger__img{display:block;width:100%;height:auto;border-radius:12px;box-shadow:0 0 0 1px rgba(255,255,255,.12)}
.kruszec .ledger__head{margin:0;font-family:'Instrument Serif',Georgia,serif;font-size:clamp(26px,2.8vw,36px);line-height:1.08;color:var(--platyna);text-wrap:balance}
.kruszec .ledger__flag{display:inline-block;margin:10px 0 0;padding:3px 10px;border:1px solid rgba(143,212,182,.4);border-radius:10px;color:var(--szalwia);font-weight:600;font-size:12px;letter-spacing:.05em;text-transform:uppercase}
.kruszec .ledger__role{margin:10px 0 0;max-width:36em;font-size:15.5px;line-height:1.6;color:var(--tekst2)}
@media (max-width:560px){.kruszec .ledger__item{grid-template-columns:minmax(0,96px) minmax(0,1fr)}.kruszec .ledger__n{grid-column:1/-1}}
@media (max-width:399px){.kruszec .ledger__img{grid-column:1;grid-row:1}.kruszec .ledger__n{grid-column:2;grid-row:1}.kruszec .ledger__text{grid-column:1/-1;grid-row:2}}
.kruszec .quiet{margin:28px 0 0;max-width:40em;padding-left:18px;border-left:2px solid var(--szalwia);font-family:'Instrument Serif',Georgia,serif;font-size:clamp(22px,2.2vw,28px);line-height:1.3;color:var(--platyna)}

.kruszec .searches{display:grid;gap:24px;margin-top:22px}
@media (min-width:1000px){.kruszec .searches{grid-template-columns:1fr 1fr}}
.kruszec .search{margin:0;min-width:0}
.kruszec .search__screen{max-width:430px;padding:18px 16px 20px;border-radius:28px;background:#F4F5F7;font-family:system-ui,'Segoe UI',Arial,sans-serif;color:#1d1d1f;box-shadow:0 30px 60px -30px rgba(0,0,0,.9)}
.kruszec .search--android .search__screen{background:#F1F3F1;border-radius:18px}
.kruszec .search__field{display:flex;align-items:center;gap:8px;height:38px;padding:0 12px;border-radius:12px;background:#E4E5E9;color:#55565c;font-size:15px}
.kruszec .search--android .search__field{border-radius:999px;background:#E2E5E2}
.kruszec .search__result{display:flex;align-items:center;gap:12px;margin:16px 0 12px}
.kruszec .search__icon{width:60px;height:60px;border-radius:14px}
.kruszec .search--android .search__icon{border-radius:18px}
.kruszec .search__meta{display:flex;flex-direction:column;flex:1;min-width:0}
.kruszec .search__name{font-weight:700;font-size:17px}
.kruszec .search__sub{font-size:13px;color:#5f6066}
.kruszec .search__btn{padding:6px 16px;border-radius:999px;background:#E4E5E9;font-weight:700;font-size:14px;color:#14213F}
.kruszec .search--android .search__btn{background:#14213F;color:#fff}
.kruszec .search__shots{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.kruszec .search__shots img{width:100%;height:auto;border-radius:10px;display:block}
.kruszec .search--android .search__shots img{border-radius:6px}
.kruszec .search__ghost{display:flex;gap:12px;align-items:center;margin-top:18px;opacity:.55}
.kruszec .search__ghost-icon{width:60px;height:60px;border-radius:14px;background:#DADBE0}
.kruszec .search__ghost-lines{display:flex;flex-direction:column;gap:8px;flex:1}
.kruszec .search__ghost-lines span{display:block;height:10px;border-radius:5px;background:#DADBE0;width:60%}
.kruszec .search__ghost-lines span+span{width:40%}
.kruszec .search__caption{display:block;margin-top:12px;color:var(--tekst2);font-size:14px;line-height:1.4}

.kruszec .switch-wrap{margin-top:clamp(40px,6vw,72px)}
.kruszec .switch-head{padding:0 0 4px}
.kruszec .switch{margin:0 calc(var(--gut) * -1);padding:20px 0 6px;border-block:1px solid rgba(255,255,255,.08);background:radial-gradient(800px 300px at 60% 0,rgba(143,212,182,.07),transparent 70%),rgba(255,255,255,.02)}
.kruszec .switch__bar{display:flex;flex-wrap:wrap;gap:12px 18px;align-items:center;margin:0 0 18px;padding-inline:var(--gut)}
.kruszec .switch__group{display:inline-flex;flex-wrap:wrap;gap:4px;padding:4px;border:1px solid var(--edge);border-radius:16px;background:rgba(255,255,255,.04)}
.kruszec .switch__btn{appearance:none;margin:0;padding:8px 18px;border:0;border-radius:12px;background:transparent;color:var(--tekst2);font:600 15px/1.2 'Manrope',system-ui,sans-serif;cursor:pointer}
.kruszec .switch__btn[aria-pressed='true']{background:rgba(255,255,255,.12);color:var(--tekst);box-shadow:inset 0 0 0 1px rgba(255,255,255,.14)}

.kruszec .abs{display:grid;gap:28px;margin-top:22px}
@media (min-width:1080px){.kruszec .abs{grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);align-items:start}}
.kruszec .ab{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.kruszec .ab__item{margin:0;min-width:0}
.kruszec .ab__item img{display:block;width:100%;height:auto;border-radius:14px;box-shadow:0 0 0 1px rgba(255,255,255,.12)}
.kruszec .ab__item figcaption{display:flex;gap:10px;align-items:flex-start;margin-top:12px;font-weight:600;font-size:15px;line-height:1.35;text-wrap:balance}
.kruszec .ab__tag{display:inline-flex;align-items:center;justify-content:center;flex:none;width:30px;height:30px;border:1px solid var(--edge);border-radius:50%;font-family:'Instrument Serif',Georgia,serif;font-size:19px;color:var(--szalwia)}
.kruszec .ab__item figcaption{hyphens:none}
@media (max-width:560px){.kruszec .ab__item figcaption{font-size:13px;gap:8px}.kruszec .ab__tag{width:26px;height:26px;font-size:17px}}
.kruszec .ab__hypothesis{grid-column:1/-1;margin:8px 0 0;padding:18px 22px;border:1px solid rgba(255,255,255,.1);border-radius:20px;background:rgba(255,255,255,.035);font-size:16px;line-height:1.6}
.kruszec .ab__hypothesis strong{font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-weight:400;font-size:22px;color:var(--szalwia)}

.kruszec .features{display:grid;gap:20px;margin:6px 0 22px}
@media (min-width:900px){.kruszec .features{grid-template-columns:1fr 1fr}}
.kruszec .feature{margin:0;min-width:0}
.kruszec .feature img{display:block;width:100%;height:auto;border-radius:12px;box-shadow:0 0 0 1px rgba(255,255,255,.12)}
.kruszec .feature figcaption{margin-top:8px;font-size:14px;color:var(--tekst2)}
.kruszec .icons{display:flex;flex-wrap:wrap;gap:24px 36px;margin:26px 0 22px}
.kruszec .icon{margin:0;width:136px}
.kruszec .icon__img{display:block;width:128px;height:128px;box-shadow:0 0 0 1px rgba(255,255,255,.12)}
.kruszec .icon__img--ios{border-radius:22.5%}
.kruszec .icon__img--play{border-radius:30%}
.kruszec .icon figcaption{margin-top:8px;font-weight:600;font-size:14px;color:var(--tekst2)}

.kruszec .deliver{display:grid;gap:28px;align-items:start}
@media (min-width:1080px){.kruszec .deliver{grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:48px}}
.kruszec .dl{min-width:0;padding:8px 18px 12px;border:1px solid rgba(255,255,255,.1);border-radius:20px;background:rgba(255,255,255,.035)}
.kruszec .dl__zip{display:flex;flex-wrap:wrap;justify-content:space-between;gap:6px 16px;align-items:center;margin-top:10px;padding:14px 18px;border-radius:16px;background:var(--platyna);color:var(--glebia);text-decoration:none}
.kruszec .dl__zip:hover{background:var(--szalwia);color:var(--glebia)}
.kruszec .dl__zip-name{font-family:'Instrument Serif',Georgia,serif;font-size:clamp(22px,2.4vw,28px);line-height:1.1;overflow-wrap:anywhere}
.kruszec .dl__zip-size{font-weight:700;font-size:15px;font-variant-numeric:tabular-nums}
.kruszec .dl__list{margin:10px 0 0;padding:0;list-style:none}
.kruszec .dl__row{border-bottom:1px solid rgba(255,255,255,.1)}
.kruszec .dl__row:last-child{border-bottom:0}
.kruszec .dl__row summary{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 16px;padding:12px 0;cursor:pointer;list-style:none}
.kruszec .dl__row summary::-webkit-details-marker{display:none}
.kruszec .dl__title{font-weight:600}
.kruszec .dl__formats{grid-row:2;color:var(--tekst2);font-size:14px}
.kruszec .dl__count{text-align:right;font-weight:600}
.kruszec .dl__size{grid-row:2;text-align:right;color:var(--tekst2);font-size:14px;font-variant-numeric:tabular-nums}
.kruszec .dl__files{margin:0 0 12px;padding:0;list-style:none;font-size:14px}
.kruszec .dl__files li{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:0 12px;padding:4px 0}
.kruszec .dl__file{overflow-wrap:anywhere;font-weight:600}
.kruszec .dl__dim{grid-row:2;color:var(--tekst2)}
.kruszec .dl__bytes{text-align:right;color:var(--tekst2);font-variant-numeric:tabular-nums}

.kruszec .files{display:grid;gap:18px;margin-top:20px}
@media (min-width:1000px){.kruszec .files{grid-template-columns:1fr 1fr}}
.kruszec .files__item{margin:0;min-width:0;border:1px solid rgba(255,255,255,.1);border-radius:18px;background:rgba(5,8,16,.5);overflow:hidden}
.kruszec .files__name{display:block;padding:10px 16px;border-bottom:1px solid rgba(255,255,255,.1);color:var(--szalwia);font-weight:600;font-size:14px}
.kruszec .files__code{margin:0;padding:16px;color:var(--tekst);font:500 13px/1.7 ui-monospace,'SFMono-Regular',Menlo,Consolas,monospace;overflow-x:auto;white-space:pre-wrap;overflow-wrap:break-word}

.kruszec .cta{position:relative;margin:clamp(40px,6vw,80px) 0 0;padding:clamp(28px,5vw,64px);border-radius:32px;${glass};background:radial-gradient(700px 300px at 85% 110%,rgba(143,212,182,.16),transparent 70%),linear-gradient(160deg,rgba(255,255,255,.08),rgba(255,255,255,.03))}
.kruszec .cta h2{font-size:clamp(36px,5vw,64px);max-width:14em}
.kruszec .cta .body{max-width:40em}
.kruszec .cta__link{display:inline-block;margin-top:8px;padding:13px 24px;border-radius:14px;background:var(--platyna);color:var(--glebia);font-weight:700;font-size:16px;text-decoration:none}
.kruszec .cta__link:hover{background:var(--szalwia);color:var(--glebia)}
.kruszec .foot{max-width:1320px;margin:0 auto;padding:28px var(--gut) 44px;color:var(--tekst2);font-size:14px}
.kruszec .sample-note{margin:0}
@media (prefers-reduced-motion:reduce){.kruszec *{scroll-behavior:auto}}
`;
