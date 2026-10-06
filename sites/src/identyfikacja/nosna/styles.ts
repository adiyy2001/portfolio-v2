export const css = `
:root{color-scheme:light;--atrament:#0e0e12;--piatek:#ff3d1f;--sobota:#00b3a4;--niedziela:#ff2d95;--piatek-tekst:#b02a0b;--sobota-tekst:#00695f;--niedziela-tekst:#a8005c;--papier:#f6f4ef;--kosc:#e9e6de;--mgla:#cfcbc0;--dym:#8f8b82;--grafit:#4b4b50;--skip-bg:#0e0e12;--skip-fg:#e9e6de;--gut:clamp(16px,4vw,48px);--display:'Nosna Display',system-ui,'Segoe UI',Arial,sans-serif;--mono:'Nosna Mono',ui-monospace,'SFMono-Regular',Menlo,Consolas,monospace}
body.nosna{margin:0;background:var(--kosc);color:var(--atrament);font:500 17px/1.6 var(--display)}
:where(.nosna) a{color:var(--atrament);text-underline-offset:3px;text-decoration-thickness:2px}
.nosna a:focus-visible,.nosna button:focus-visible,.nosna summary:focus-visible,.nosna input:focus-visible+span{outline:3px solid var(--atrament);outline-offset:3px}
:where(.nosna) :is(h1,h2,h3,h4){margin:0;font-family:var(--display);font-weight:800;line-height:1.05;letter-spacing:-.01em}
:where(.nosna) p{margin:0}
:where(.nosna) img{display:block;height:auto}
.nosna .mono,.mono{font-family:var(--mono);font-weight:500}
.muted{color:var(--grafit);font-size:15px}
.rail{position:relative;display:flex;justify-content:space-between;align-items:center;gap:16px;margin:0 0 0;padding:18px var(--gut) 20px;font:500 13px/1.3 var(--mono)}
.rail a{color:var(--atrament);text-decoration:none;border-bottom:2px solid var(--atrament)}
.rail::after{content:'';position:absolute;left:0;right:calc(var(--gut) + 8px);bottom:0;height:4px;background:var(--atrament)}
.rail::before{content:'';position:absolute;right:calc(var(--gut) - 8px);bottom:-8px;width:14px;height:14px;border:4px solid var(--atrament);border-radius:50%;box-sizing:content-box;background:var(--kosc);z-index:1}
main{display:block}
.wrap{max-width:1180px;margin:0 auto;padding:0 var(--gut)}
.kicker{font:700 12px/1.4 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--piatek-tekst);margin-bottom:16px}
.hero{padding:clamp(24px,5vw,56px) 0 clamp(24px,4vw,48px)}
.hero h1{font-size:clamp(58px,17vw,230px);line-height:.88;letter-spacing:-.03em;margin:0 0 18px}
.hero__lead{font:500 clamp(20px,2.6vw,30px)/1.3 var(--display);max-width:26em}
.hero__nav{display:flex;flex-wrap:wrap;gap:10px 14px;margin:26px 0 0;padding:0;list-style:none}
.hero__nav a{display:inline-flex;gap:8px;align-items:center;padding:8px 14px;color:var(--atrament);text-decoration:none;font:700 14px/1 var(--mono);border:3px solid var(--atrament)}
.hero__nav a:hover{background:var(--atrament);color:var(--kosc)}
.hero__nav i{width:12px;height:12px;border-radius:50%}
.gen{display:grid;gap:clamp(16px,3vw,32px);margin:0 0 clamp(24px,5vw,56px)}
@media (min-width:980px){.gen{grid-template-columns:minmax(0,1.6fr) minmax(300px,1fr);align-items:stretch}}
.gen__stage{margin:0;background:var(--papier);padding:clamp(16px,3vw,32px);display:grid;gap:18px;align-content:center}
.gen__svg{width:100%;height:auto;display:block}
.gen__readout{display:flex;flex-wrap:wrap;gap:6px 22px;font:500 13px/1.4 var(--mono);border-top:4px solid var(--atrament);padding-top:12px}
.gen__readout b{font:800 16px/1.2 var(--display);margin-right:8px}
.gen__readout i{font-style:normal}
.gen__panel{display:grid;gap:20px;align-content:start;background:var(--papier);padding:clamp(16px,3vw,28px)}
.gen__group{border:0;margin:0;padding:0;min-width:0}
.gen__group legend,.gen__tempo span{font:700 12px/1 var(--mono);letter-spacing:.12em;text-transform:uppercase;padding:0;margin-bottom:10px;color:var(--grafit)}
.gen__tempo{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px}
.gen__tempo output{font:700 18px/1 var(--mono)}
.gen__days,.gen__stages{display:grid;gap:8px}
.gen__days{grid-template-columns:repeat(3,1fr)}
.gen__stages{grid-template-columns:repeat(2,1fr)}
.gen__day,.gen__stage-choice{position:relative;display:block}
.gen input[type=radio]{position:absolute;opacity:0;inset:0;margin:0;cursor:pointer}
.gen__day span,.gen__stage-choice span{display:block;padding:12px 10px;text-align:center;font:700 15px/1.1 var(--display);border:3px solid var(--atrament);background:var(--papier);pointer-events:none}
.gen__day--piatek input:checked+span{background:var(--piatek)}
.gen__day--sobota input:checked+span{background:var(--sobota)}
.gen__day--niedziela input:checked+span{background:var(--niedziela)}
.gen__stage-choice input:checked+span{background:var(--atrament);color:var(--kosc)}
.gen input[type=range]{width:100%;accent-color:var(--atrament);margin:4px 0}
.gen__ticks{display:flex;justify-content:space-between;font:500 12px/1 var(--mono);color:var(--grafit)}
.gen__rule{font-size:15px;color:var(--grafit)}
.gen__actions{display:flex;flex-wrap:wrap;gap:10px}
.gen__btn{padding:12px 16px;border:3px solid var(--atrament);background:var(--papier);color:var(--atrament);font:700 14px/1 var(--mono);cursor:pointer}
.gen__btn--solid{background:var(--atrament);color:var(--kosc)}
.gen__btn:disabled{opacity:.55;cursor:default}
.gen__btn[aria-pressed=true]{background:var(--atrament);color:var(--kosc)}
.gen__status{font:500 12px/1.5 var(--mono);color:var(--grafit);overflow-wrap:anywhere}
.day{margin:0}
.day__head{display:grid;gap:4px;padding:clamp(18px,3vw,32px) 0;background:var(--day);color:var(--atrament)}
.day__head .wrap{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:6px 24px;width:100%}
.day__head h2{font-size:clamp(44px,9vw,120px);line-height:.92;letter-spacing:-.025em}
.day__head p{font:700 14px/1.4 var(--mono);max-width:22em}
.row{display:grid;gap:14px;padding:clamp(20px,3.4vw,40px) 0;border-top:4px solid var(--atrament)}
.row:first-child{border-top:0}
@media (min-width:860px){.row{grid-template-columns:220px minmax(0,1fr);gap:40px}}
.row__label{display:grid;gap:6px;align-content:start}
.row__no{font:700 13px/1 var(--mono);color:var(--day-text)}
.row__label h3{font-size:clamp(21px,1.6vw,23px);overflow-wrap:break-word}
.row__body{display:grid;gap:clamp(16px,2.4vw,28px);min-width:0}
.prose{display:grid;gap:14px;max-width:40em}
.prose p{font-size:18px}
.two{display:grid;gap:24px;align-items:start}
@media (min-width:860px){.two{grid-template-columns:1.3fr 1fr;gap:48px}.two--even{grid-template-columns:1fr 1fr}}
.facts{margin:0;display:grid;gap:0}
.facts div{border-top:3px solid var(--atrament);padding:12px 0 14px}
.facts dt{font:700 12px/1 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--day-text);margin-bottom:6px}
.facts dd{margin:0}
.keywords{display:flex;flex-wrap:wrap;gap:0 28px;font:800 clamp(34px,5.4vw,76px)/1 var(--display);letter-spacing:-.02em}
.keywords span:nth-child(1){color:var(--piatek)}
.keywords span:nth-child(2){color:var(--sobota)}
.keywords span:nth-child(3){color:var(--niedziela)}
blockquote{margin:0;padding:0 0 0 22px;border-left:10px solid var(--atrament);font:700 clamp(20px,2.6vw,30px)/1.3 var(--display);max-width:30em}
.cols{display:grid;gap:clamp(16px,3vw,28px)}
@media (min-width:760px){.cols.three{grid-template-columns:repeat(3,1fr)}.cols.four{grid-template-columns:repeat(4,1fr)}.cols.two-up{grid-template-columns:repeat(2,1fr)}}
.col{background:var(--papier);padding:20px 22px 24px;border-top:10px solid var(--day);display:grid;gap:8px;align-content:start}
.col h4{font-size:22px}
.col p{font-size:16px}
.col--chosen{outline:4px solid var(--atrament);outline-offset:-4px}
.col img{width:100%;max-width:200px;background:var(--kosc);padding:8px;margin-bottom:10px}
.kern{display:grid;gap:16px}
@media (min-width:640px){.kern{grid-template-columns:1fr 1fr}}
.kern figure,.clear{margin:0;background:var(--papier);padding:20px}
.kern img,.clear img{width:100%;max-width:380px;margin:0 auto}
.kern figcaption{margin-top:10px;font:700 13px/1 var(--mono);text-align:center}
.sizes{display:flex;flex-wrap:wrap;align-items:flex-end;gap:20px 32px;margin:0;padding:0;list-style:none}
.sizes li{display:grid;gap:8px;justify-items:start}
.sizes span{font:500 12px/1.3 var(--mono);color:var(--grafit);max-width:10em}
.sizes img{background:var(--papier)}
.constants{display:grid;gap:0;margin:0;padding:0;list-style:none}
.constants li{border-top:3px solid var(--atrament);padding:12px 0}
.grid12{display:grid;grid-template-columns:repeat(2,1fr);gap:2px;margin:0;padding:0;list-style:none;background:var(--atrament);border:2px solid var(--atrament)}
@media (min-width:640px){.grid12{grid-template-columns:repeat(4,1fr)}}
.grid12 li{background:var(--papier);padding:14px 12px 10px;display:grid;gap:8px;align-content:space-between}
.grid12 svg{width:100%;height:auto;display:block}
.grid12 span{font:500 11px/1.6 var(--mono);color:var(--grafit)}
.grid12 a{color:var(--atrament);text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px;border-bottom:0}
.params{display:grid;gap:0;margin:0;padding:0;list-style:none}
.params li{display:grid;gap:4px;border-top:3px solid var(--atrament);padding:14px 0}
@media (min-width:860px){.params li{grid-template-columns:150px 200px 1fr;gap:24px;align-items:baseline}}
.params b{font:800 22px/1.1 var(--display)}
.params em{font:700 12px/1.3 var(--mono);font-style:normal;letter-spacing:.06em;text-transform:uppercase;color:var(--grafit)}
.variants{display:grid;gap:14px;margin:0;padding:0;list-style:none}
@media (min-width:640px){.variants{grid-template-columns:repeat(2,1fr)}}
@media (min-width:960px){.variants{grid-template-columns:repeat(3,1fr)}}
.variants li{padding:20px;display:grid;gap:14px;align-content:space-between;min-height:220px}
.variants img{height:120px;width:100%;object-fit:contain}
.variants p{display:grid;gap:2px;font-size:14px}
.variants strong{font-size:16px}
.ground--papier{background:var(--papier)}
.ground--kosc{background:var(--kosc);box-shadow:inset 0 0 0 3px var(--mgla)}
.ground--white{background:#fff;box-shadow:inset 0 0 0 3px var(--mgla)}
.ground--atrament{background:var(--atrament);color:var(--kosc)}
.plain{display:grid;gap:8px;margin:0;padding:0;list-style:none}
.plain--rules li{border-top:3px solid var(--atrament);padding-top:10px}
.swatches{display:grid;grid-template-columns:repeat(2,1fr);gap:18px 14px;margin:0;padding:0;list-style:none}
@media (min-width:640px){.swatches{grid-template-columns:repeat(4,1fr)}}
@media (min-width:960px){.swatches{grid-template-columns:repeat(6,1fr)}}
.swatches li{display:grid;gap:3px;font-size:13px;align-content:start;font-family:var(--mono)}
.swatches__chip{display:block;height:64px;margin-bottom:6px;box-shadow:inset 0 0 0 2px var(--mgla)}
.swatches strong{font:800 18px/1.1 var(--display)}
.swatches em{font-style:normal;color:var(--grafit);font-size:12px;font-family:var(--mono)}
.tbl-wrap{overflow-x:auto;max-width:100%}
.tbl{border-collapse:collapse;width:100%;min-width:560px;font-size:14px}
.tbl th,.tbl td{text-align:left;padding:9px 10px;border-top:2px solid var(--mgla);vertical-align:middle;font-weight:500}
.tbl thead th{font:700 12px/1.2 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--grafit);border-top:0}
.tbl tbody th{font-weight:700}
.tbl td{font-family:var(--mono);font-size:13px}
.tbl__chip{display:inline-block;width:18px;height:18px;margin-right:8px;border-radius:50%;vertical-align:-3px;box-shadow:inset 0 0 0 2px var(--atrament)}
.tbl__pair{display:inline-block;padding:2px 8px;margin-right:8px;font:800 15px/1.3 var(--display);box-shadow:inset 0 0 0 1px var(--mgla)}
.face__name{font-size:clamp(36px,4.4vw,62px);line-height:1;white-space:normal;overflow-wrap:anywhere}
.face__name--display,.face__sample--display{font-family:var(--display);font-weight:800}
.face__name--mono,.face__sample--mono{font-family:var(--mono);font-weight:500}
.face__sample{font-size:clamp(18px,2.2vw,26px);line-height:1.3;margin:12px 0}
.scale{display:grid;gap:0;margin:0;padding:0;list-style:none}
.scale li{display:grid;gap:4px;border-top:3px solid var(--mgla);padding:12px 0}
@media (min-width:760px){.scale li{grid-template-columns:260px 1fr;align-items:baseline;gap:24px}}
.scale__sample--display{font-family:var(--display)}
.scale__sample--mono{font-family:var(--mono)}
.glyphs{font:800 clamp(24px,4vw,44px)/1.4 var(--display);overflow-wrap:anywhere}
.icons{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:0;padding:0;list-style:none}
@media (min-width:640px){.icons{grid-template-columns:repeat(6,1fr)}}
.icons li{display:grid;justify-items:center;gap:8px;padding:16px 4px;background:var(--papier);font:500 12px/1.2 var(--mono)}
.icons img{width:40px;height:40px}
.pattern{height:clamp(140px,26vw,260px);background-size:300px;background-color:var(--papier)}
.tone{display:grid;gap:20px}
@media (min-width:760px){.tone{grid-template-columns:1fr 1fr;gap:24px 40px}}
.tone article{border-top:4px solid var(--atrament);padding-top:12px;display:grid;gap:8px;align-content:start}
.tone h4{font-size:20px}
.tone .yes,.tone .no{font-size:16px}
.tone .yes{color:var(--sobota-tekst);font-weight:700}
.tone .no{color:var(--grafit);text-decoration:line-through;text-decoration-color:var(--piatek)}
.tag{display:inline-block;min-width:2.8em;margin-right:8px;font:700 12px/1 var(--mono);letter-spacing:.1em;text-transform:uppercase}
.film{width:100%;max-width:560px;height:auto;aspect-ratio:1;background:var(--atrament)}
.film-fallback{max-width:560px;background:var(--atrament);padding:24px}
.gallery{display:grid;gap:clamp(16px,3vw,28px)}
@media (min-width:760px){.gallery{grid-template-columns:repeat(2,1fr);align-items:start}.gallery__item--papier{grid-row:span 2}}
.gallery__item{margin:0;display:grid;gap:10px;align-content:start;background:var(--papier);padding:12px 12px 16px}
.gallery__item img{width:100%}
.gallery__item figcaption{display:grid;gap:2px;font-size:14px}
.gallery__item strong{font:800 18px/1.2 var(--display)}
.posts{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin:0;padding:0;list-style:none}
@media (min-width:760px){.posts{grid-template-columns:repeat(4,1fr)}}
.posts li{display:grid;gap:8px;align-content:end;font:500 12px/1.3 var(--mono)}
.posts img{width:100%;height:auto}
.dl{display:grid;gap:18px}
.dl__zip{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px 24px;padding:20px 24px;background:var(--atrament);color:var(--kosc)!important;text-decoration:none;font:800 clamp(20px,3vw,28px)/1.2 var(--display)}
.dl__zip:hover{background:var(--niedziela-tekst)}
.dl__zip-size{font:700 14px/1 var(--mono);color:var(--mgla)}
.dl__list{margin:0;padding:0;list-style:none}
.dl__row{border-top:3px solid var(--atrament)}
.dl__row summary{display:grid;grid-template-columns:1fr auto;gap:2px 16px;padding:14px 0;cursor:pointer;list-style:none}
.dl__row summary::-webkit-details-marker{display:none}
.dl__title{font:800 20px/1.2 var(--display)}
.dl__formats{grid-column:1;color:var(--grafit);font:500 12px/1.4 var(--mono)}
.dl__count{grid-column:2;grid-row:1;font:500 12px/1.4 var(--mono);text-align:right}
.dl__size{grid-column:2;grid-row:2;font:500 12px/1.4 var(--mono);color:var(--grafit);text-align:right}
.dl__files{margin:0 0 14px;padding:0;list-style:none;display:grid;gap:4px}
.dl__files li{display:grid;grid-template-columns:1fr auto auto;gap:4px 16px;font:500 12px/1.4 var(--mono);padding:6px 0}
.dl__files a{overflow-wrap:anywhere}
.dl__dim,.dl__bytes{color:var(--grafit);white-space:nowrap}
.cta{padding:clamp(32px,6vw,72px) 0}
.cta .wrap{display:grid;gap:16px;justify-items:start}
.cta h2{font-size:clamp(34px,6vw,76px);max-width:14em}
.cta p{max-width:40em;font-size:18px}
.cta__link{display:inline-block;padding:16px 24px;background:var(--atrament);color:var(--kosc)!important;text-decoration:none;font:700 15px/1 var(--mono)}
.foot{padding:24px 0 40px;border-top:4px solid var(--atrament);font:500 13px/1.5 var(--mono);color:var(--grafit)}
.foot p{max-width:1180px;margin:0 auto 4px;padding:0 var(--gut)}
.foot a{color:var(--atrament)}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
`;
