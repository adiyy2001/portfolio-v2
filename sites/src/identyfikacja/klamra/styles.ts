export const css = `
:root{color-scheme:light;--atrament:#111111;--cytryna:#FFE14A;--roz:#FF5FA8;--mieta:#3DDC97;--niebo:#5CC8FF;--biel:#FFFFFF;--mgla:#F2F2F2;--beton:#D9D9D9;--kamien:#8F8F8F;--grafit:#4A4A4A;--skip-bg:#111111;--skip-fg:#FFFFFF;--gut:clamp(16px,4vw,48px);--display:'Klamra Display',system-ui,'Segoe UI',Arial,sans-serif;--text:'Klamra Text',system-ui,'Segoe UI',Arial,sans-serif;--mono:'Klamra Mono',ui-monospace,Consolas,monospace;--line:4px;--lift:8px}
body.klamra{margin:0;background:var(--biel);color:var(--atrament);font:500 17px/1.6 var(--text);font-variant-ligatures:none}
:where(.klamra) a{color:var(--atrament);text-decoration-thickness:3px;text-underline-offset:4px}
.klamra a:focus-visible,.klamra button:focus-visible,.klamra summary:focus-visible,.klamra [role=button]:focus-visible{outline:4px solid var(--atrament);outline-offset:3px;box-shadow:0 0 0 8px var(--roz)}
:where(.klamra) :is(h1,h2,h3,h4){margin:0;text-wrap:balance;font-family:var(--display);font-weight:900;line-height:1.05;letter-spacing:-.01em}
:where(.klamra) p{margin:0;text-wrap:pretty}
:where(.klamra) img{display:block;height:auto}
:where(.klamra) :is(ul,ol){margin:0;padding:0;list-style:none}
.klamra .muted{color:var(--grafit);font-size:15px}
.klamra .mono{font-family:var(--mono);font-weight:700}
.klamra .top{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;padding:16px var(--gut);border-bottom:var(--line) solid var(--atrament);background:var(--cytryna)}
.klamra .top a{padding:8px 14px;background:var(--biel);border:3px solid var(--atrament);box-shadow:4px 4px 0 var(--atrament);font:800 14px/1 var(--mono);text-decoration:none;text-transform:uppercase}
.klamra .top a:hover{transform:translate(2px,2px);box-shadow:2px 2px 0 var(--atrament)}
.klamra main{display:block;max-width:1240px;margin:0 auto;padding:0 var(--gut)}
.tag{display:inline-block;align-self:start;justify-self:start;padding:5px 10px;background:var(--atrament);color:var(--biel);border:3px solid var(--atrament);font:800 13px/1.2 var(--mono);letter-spacing:.06em;text-transform:uppercase}
.tag--light{background:var(--biel);color:var(--atrament)}
.blk{position:relative;display:grid;grid-template-columns:minmax(0,1fr);gap:16px;align-content:start;padding:clamp(20px,3vw,40px);margin:0;background:var(--biel);border:var(--line) solid var(--atrament);box-shadow:var(--lift) var(--lift) 0 var(--atrament);min-width:0}
.blk--cytryna{background:var(--cytryna)}
.blk--roz{background:var(--roz)}
.blk--mieta{background:var(--mieta)}
.blk--niebo{background:var(--niebo)}
.blk--mgla{background:var(--mgla)}
.blk--atrament{background:var(--atrament);color:var(--biel);box-shadow:var(--lift) var(--lift) 0 var(--roz)}
.blk h3{font-size:clamp(26px,3.4vw,40px)}
.blk h4{font:800 14px/1.3 var(--mono);letter-spacing:.06em;text-transform:uppercase;margin:6px 0 2px}
.hero{display:grid;gap:clamp(20px,3vw,32px);padding:clamp(24px,5vw,56px) 0}
.hero>*{min-width:0}
.hero__main{padding:clamp(24px,4vw,56px)}
.hero h1{font-size:clamp(64px,17vw,128px);line-height:.88;letter-spacing:-.035em;margin:10px 0 6px}
.hero__lead{font:700 clamp(20px,2.6vw,30px)/1.3 var(--text);max-width:24em}
.hero__facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:12px 0 0}
.hero__facts div{background:var(--biel);border:3px solid var(--atrament);padding:8px 12px}
.hero__facts dt{font:800 12px/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px}
.hero__facts dd{margin:0}
.hero__side{display:grid;gap:clamp(20px,3vw,32px);align-content:start}
.hero__logo img{width:100%}
.hero__proof{display:flex;flex-wrap:wrap;gap:14px;align-items:flex-end;justify-content:center}
.hero__proof li{display:block}
.hero__proof img{height:clamp(64px,16vw,92px);width:auto;border:3px solid var(--atrament);box-shadow:5px 5px 0 var(--atrament)}
.hero__stickers{display:flex;flex-wrap:wrap;gap:12px 18px;align-items:center;justify-content:center;padding:6px 0}
.hero__stickers div{flex:none}
.hero__stickers svg{display:block;width:100%;height:auto}
.hero__nav ul{display:grid;gap:8px;grid-template-columns:repeat(2,1fr)}
.hero__nav a{display:flex;gap:10px;align-items:baseline;padding:10px 12px;background:var(--atrament);color:var(--biel);border:3px solid var(--biel);text-decoration:none;font:800 15px/1.2 var(--mono);text-transform:uppercase}
.hero__nav a span{color:var(--cytryna)}
.hero__nav a:hover{background:var(--roz);color:var(--atrament)}
.hero__nav a:hover span{color:var(--atrament)}
@media (min-width:980px){.hero__nav li:last-child:nth-child(odd){grid-column:1/-1}.hero{grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);align-items:start}.hero h1{font-size:clamp(100px,9.4vw,136px)}}
.band{padding:clamp(28px,5vw,64px) 0;display:grid;gap:clamp(20px,3vw,36px)}
.band__head{display:flex;flex-wrap:wrap;align-items:center;gap:12px 18px}
.band__num{display:grid;place-items:center;min-width:56px;height:56px;padding:0 10px;background:var(--atrament);color:var(--cytryna);font:900 26px/1 var(--mono)}
.band__cmd{margin-left:auto;padding:8px 12px;background:var(--mgla);border:3px solid var(--atrament);font:700 14px/1.2 var(--mono)}
.band__title{font-size:clamp(34px,6vw,72px);text-transform:uppercase;letter-spacing:-.02em}
.band__lead{font:700 clamp(18px,2.2vw,24px)/1.45 var(--text);max-width:36em}
.band__sub{font-size:clamp(26px,3.6vw,38px);text-transform:uppercase}
.prose{display:grid;gap:14px;max-width:38em}
.prose p{font-size:18px}
.two{display:grid;gap:clamp(20px,3vw,32px);align-items:start}
@media (min-width:900px){.two{grid-template-columns:1.3fr 1fr}.two--even{grid-template-columns:1fr 1fr}.two--mid{align-items:center}}
.facts{display:grid;gap:14px;margin:0}
.facts div{background:var(--biel);color:var(--atrament);border:3px solid var(--atrament);padding:10px 14px}
.facts div:nth-child(4n+1){background:var(--cytryna)}
.facts div:nth-child(4n+2){background:var(--mieta)}
.facts div:nth-child(4n+3){background:var(--niebo)}
.facts div:nth-child(4n+4){background:var(--roz)}
.facts dt{font:800 12px/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px}
.facts dd{margin:0;font-weight:700}
.facts--plain div{background:var(--mgla)!important}
.keywords{display:grid;gap:12px;justify-items:start}
.keywords span{display:inline-block;padding:2px 20px 10px;background:var(--biel);border:var(--line) solid var(--atrament);box-shadow:var(--lift) var(--lift) 0 var(--atrament);font:900 clamp(40px,8vw,104px)/1 var(--display);letter-spacing:-.03em}
.keywords span:nth-child(2){background:var(--cytryna);margin-left:clamp(0px,6vw,80px)}
.keywords span:nth-child(3){background:var(--mieta)}
.cards{display:grid;gap:clamp(20px,3vw,32px)}
@media (min-width:760px){.cards.three{grid-template-columns:repeat(3,1fr)}}
.values .blk:nth-child(1){background:var(--cytryna)}
.values .blk:nth-child(2){background:var(--mieta)}
.values .blk:nth-child(3){background:var(--niebo)}
.values .num{font:900 56px/1 var(--mono)}
.klamra blockquote{margin:12px 0 0;font:800 clamp(22px,2.6vw,32px)/1.3 var(--display);max-width:30em}
.thumb{width:100%;max-width:240px;aspect-ratio:1;object-fit:contain;background:var(--mgla);border:3px solid var(--atrament);padding:8px}
.blk--reject{background:var(--mgla)}
.blk--chosen{background:var(--cytryna)}
.blk--chosen .tag{background:var(--roz);color:var(--atrament)}
.kern{display:grid;gap:14px;padding:20px;background:var(--biel);border:3px solid var(--atrament)}
.kern img{width:100%;max-width:900px;margin:0 auto}
.kern figcaption{font:700 14px/1.4 var(--mono)}
.sizes{display:flex;flex-wrap:wrap;align-items:flex-end;gap:20px 32px;padding:20px;background:var(--biel);border:3px solid var(--atrament)}
.sizes li{display:grid;gap:8px;justify-items:start}
.sizes span{font:700 12px/1.3 var(--mono);white-space:nowrap}
.variants{display:grid;gap:20px}
@media (min-width:640px){.variants{grid-template-columns:repeat(2,1fr)}}
@media (min-width:980px){.variants{grid-template-columns:repeat(3,1fr)}}
.variants li{display:grid;gap:14px;align-content:space-between;min-height:240px;padding:20px;border:var(--line) solid var(--atrament);box-shadow:6px 6px 0 var(--atrament)}
.variants img{max-height:120px;width:auto;max-width:100%;margin:0 auto}
.variants p{display:grid;gap:2px;font-size:14px}
.variants strong{font:800 14px/1.2 var(--mono);text-transform:uppercase}
.ground--biel{background:var(--biel)}
.ground--mgla{background:var(--mgla)}
.ground--mieta{background:var(--mieta)}
.ground--niebo{background:var(--niebo)}
.ground--atrament{background:var(--atrament);color:var(--biel)}
.clear{margin:0;background:var(--biel);border:3px solid var(--atrament);padding:12px}
.clear img{width:100%}
.minimum{display:grid;gap:10px}
.minimum li{display:grid;grid-template-columns:140px minmax(0,1fr);gap:14px;align-items:center;border-top:3px solid var(--atrament);padding-top:10px}
.minimum__sample{display:grid;place-items:center;height:48px;background:var(--mgla);border:3px solid var(--atrament)}
.minimum__sample img{max-width:100%}
.swatches{display:grid;grid-template-columns:repeat(2,1fr);gap:18px 16px}
@media (min-width:640px){.swatches{grid-template-columns:repeat(5,1fr)}}
.swatches li{display:grid;gap:4px;align-content:start;font-size:14px}
.swatches__chip{display:block;height:84px;margin-bottom:6px;border:var(--line) solid var(--atrament);box-shadow:5px 5px 0 var(--atrament)}
.swatches strong{font:900 22px/1.1 var(--display)}
.swatches span:not(.swatches__chip){font:700 13px/1.2 var(--mono)}
.swatches em{font-style:normal;color:var(--grafit);font-size:13px}
.fold{border:3px solid var(--atrament);background:var(--biel)}
.fold>summary{display:block;padding:12px 14px;min-height:44px;font:800 14px/1.3 var(--mono);text-transform:uppercase;cursor:pointer;background:var(--cytryna)}
.fold[open]>summary{border-bottom:3px solid var(--atrament)}
.fold .tbl-wrap{border:0}
.tbl-wrap{overflow-x:auto;max-width:100%;border:3px solid var(--atrament);background:var(--biel)}
.tbl{border-collapse:collapse;width:100%;min-width:560px;font-size:14px}
.tbl th,.tbl td{text-align:left;padding:9px 10px;border-top:2px solid var(--beton);vertical-align:middle}
.tbl thead th{font:800 12px/1.2 var(--mono);letter-spacing:.08em;text-transform:uppercase;border-top:0;background:var(--atrament);color:var(--biel)}
.tbl tbody th{font-weight:700}
.tbl td{font-family:var(--mono);font-weight:700;font-size:13px}
.tbl__chip{display:inline-block;width:18px;height:18px;margin-right:8px;vertical-align:-3px;border:3px solid var(--atrament)}
.tbl__pair{display:inline-block;padding:2px 8px;margin-right:8px;font:900 15px/1.3 var(--display);border:2px solid var(--atrament)}
@media (max-width:639px){.tbl-wrap{overflow:visible}.tbl{min-width:0;display:block}.tbl thead{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}.tbl tbody,.tbl tr,.tbl th,.tbl td{display:block}.tbl tbody tr{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2px 12px;padding:10px 12px;border-top:3px solid var(--atrament)}.tbl tbody tr:first-child{border-top:0}.tbl th,.tbl td{border:0;padding:3px 0}.tbl tbody th{grid-column:1/-1}.tbl td{display:grid;gap:2px;align-content:start;overflow-wrap:anywhere}.tbl td::before{font:800 12px/1.3 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--grafit)}.tbl--colors td:nth-of-type(1)::before{content:'HEX'}.tbl--colors td:nth-of-type(2)::before{content:'RGB'}.tbl--colors td:nth-of-type(3)::before{content:'OKLCH'}.tbl--colors td:nth-of-type(4)::before{content:'CMYK'}.tbl--contrast td:nth-of-type(1){grid-column:1/-1}.tbl--contrast td:nth-of-type(1)::before{content:'Para'}.tbl--contrast td:nth-of-type(2)::before{content:'Kontrast'}.tbl--contrast td:nth-of-type(3)::before{content:'Wymóg'}.tbl--contrast td:nth-of-type(4)::before{content:'Poziom'}}
.face__name{font-size:clamp(36px,6vw,72px);line-height:1}
.face__name--display,.face__sample--display{font-family:var(--display);font-weight:900}
.face__name--mono,.face__sample--mono{font-family:var(--mono);font-weight:800}
.face__sample{font-size:clamp(20px,2.4vw,28px);line-height:1.3;margin:12px 0}
.scale{display:grid;gap:0}
.scale li{display:grid;gap:4px;border-top:3px solid var(--atrament);padding:12px 0}
@media (min-width:760px){.scale li{grid-template-columns:260px 1fr;align-items:baseline;gap:24px}}
.scale__sample--display{font-family:var(--display)}
.scale__sample--text{font-family:var(--text)}
.scale__sample--mono{font-family:var(--mono)}
.glyphs{font:800 clamp(26px,4vw,44px)/1.4 var(--display);overflow-wrap:anywhere}
.icons{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
@media (min-width:640px){.icons{grid-template-columns:repeat(6,1fr)}}
.icons li{display:grid;justify-items:center;gap:8px;padding:16px 4px;border:3px solid var(--atrament);box-shadow:4px 4px 0 var(--atrament);font:700 12px/1 var(--mono)}
.icons li:nth-child(4n+1){background:var(--cytryna)}
.icons li:nth-child(4n+2){background:var(--roz)}
.icons li:nth-child(4n+3){background:var(--mieta)}
.icons li:nth-child(4n+4){background:var(--niebo)}
.icons img{width:44px;height:44px}
.pattern{height:clamp(160px,28vw,300px);background-size:240px;background-color:var(--biel);border:var(--line) solid var(--atrament)}
.rules li{border-top:3px solid var(--atrament);padding-top:10px}
.rules{display:grid;gap:12px}
.inner{display:grid;gap:20px}
@media (min-width:760px){.inner{grid-template-columns:repeat(3,1fr)}}
.inner div{border-top:3px solid var(--atrament);padding-top:10px}
.tone{display:grid;gap:20px}
@media (min-width:760px){.tone{grid-template-columns:1fr 1fr}}
.tone article{display:grid;gap:8px;align-content:start;padding:16px 18px;background:var(--biel);border:3px solid var(--atrament);box-shadow:5px 5px 0 var(--atrament)}
.tone h4{margin:0;font:900 22px/1.15 var(--display);text-transform:none;letter-spacing:-.01em}
.tone .yes,.tone .no{font-size:16px}
.tone .yes{font-weight:700}
.tone .yes .tag{background:var(--mieta);color:var(--atrament)}
.tone .no{color:var(--grafit);text-decoration:line-through;text-decoration-thickness:2px}
.tone .no .tag{text-decoration:none;display:inline-block}
.tone .tag{margin-right:8px;font-size:12px}
.film{width:100%;max-width:520px;height:auto;aspect-ratio:1;background:var(--mgla);border:var(--line) solid var(--atrament)}
.anim__copy{display:grid;gap:16px}
@media (min-width:900px){.anim{grid-template-columns:minmax(0,1fr) minmax(0,480px);align-items:center;column-gap:clamp(24px,4vw,56px)}.anim .film{justify-self:end}}
.palette-demo{display:flex;height:64px;border:var(--line) solid var(--atrament)}
.palette-demo i{display:block}
.laptop{display:grid;gap:0;max-width:960px}
.laptop__lid{position:relative;overflow:hidden;background:var(--beton);border:var(--line) solid var(--atrament);box-shadow:var(--lift) var(--lift) 0 var(--atrament);touch-action:manipulation;user-select:none}
.laptop__brand{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font:900 clamp(60px,14vw,160px)/1 var(--display);color:var(--kamien);opacity:.5;pointer-events:none}
.laptop__sticker{position:absolute;cursor:grab;touch-action:none;transition:left .3s cubic-bezier(.3,.8,.3,1),top .3s cubic-bezier(.3,.8,.3,1),transform .3s ease}
.laptop__sticker:active{cursor:grabbing;transition:none}
.laptop__sticker svg{display:block;width:100%;height:auto;pointer-events:none}
.laptop__base{height:22px;margin:0 -3%;background:var(--grafit);border:var(--line) solid var(--atrament);border-top:0;box-shadow:var(--lift) var(--lift) 0 var(--atrament)}
.laptop__bar{display:flex;flex-wrap:wrap;align-items:center;gap:12px 16px;margin-top:28px}
.laptop__button{padding:12px 20px;background:var(--cytryna);color:var(--atrament);border:3px solid var(--atrament);box-shadow:5px 5px 0 var(--atrament);font:800 15px/1 var(--mono);text-transform:uppercase;cursor:pointer}
.laptop__button--alt{background:var(--mieta)}
.laptop__button:active{transform:translate(3px,3px);box-shadow:2px 2px 0 var(--atrament)}
.laptop__hint{flex:1 1 280px;color:var(--grafit);font-size:15px}
.gallery{display:grid;gap:clamp(20px,3vw,36px)}
@media (min-width:900px){.gallery{grid-template-columns:repeat(12,minmax(0,1fr))}.gallery__item--papier{grid-column:1/8;grid-row:1/3}.gallery__item--karta-awers{grid-column:8/13;grid-row:1}.gallery__item--karta-rewers{grid-column:8/13;grid-row:2}.gallery__item--podpis{grid-column:1/7;grid-row:3;align-self:start}.gallery__item--naklejki{grid-column:7/13;grid-row:3;align-self:start}}
.gallery__item{gap:12px;grid-template-rows:minmax(0,1fr) auto}
.gallery__item img{width:100%;border:3px solid var(--atrament)}
@media (min-width:900px){.gallery__item--papier img,.gallery__item--karta-awers img,.gallery__item--karta-rewers img{height:100%;object-fit:cover}}
.gallery__item figcaption{display:grid;gap:2px;font-size:15px}
.gallery__item strong{font:900 22px/1.2 var(--display)}
.posts{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
@media (min-width:760px){.posts{grid-template-columns:repeat(4,1fr)}}
.posts li{display:grid;gap:8px;align-content:start;font:700 13px/1.3 var(--mono)}
.posts img{width:100%;border:3px solid var(--atrament);box-shadow:5px 5px 0 var(--atrament)}
.dl{display:grid;gap:18px}
.dl__zip{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px 24px;padding:20px 24px;background:var(--atrament);color:var(--biel);text-decoration:none;font:900 clamp(22px,3vw,30px)/1.2 var(--display);border:var(--line) solid var(--atrament);box-shadow:6px 6px 0 var(--roz)}
.dl__zip:hover{background:var(--grafit)}
.dl__zip-size{font:800 15px/1 var(--mono);color:var(--cytryna)}
.book{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
@media (min-width:760px){.book{grid-template-columns:repeat(3,minmax(0,1fr))}}
.book a{display:grid;gap:6px;text-decoration:none;font:700 13px/1.3 var(--mono)}
.book img{width:100%;border:3px solid var(--atrament);box-shadow:5px 5px 0 var(--atrament)}
.dl__row{border-top:3px solid var(--atrament)}
.dl__row summary{display:grid;grid-template-columns:1fr auto;gap:2px 16px;padding:14px 0;cursor:pointer;list-style:none}
.dl__row summary::-webkit-details-marker{display:none}
.dl__title{font:900 22px/1.2 var(--display)}
.dl__formats{grid-column:1;color:var(--grafit);font-size:14px}
.dl__count{grid-column:2;grid-row:1;font:700 13px/1 var(--mono);text-align:right}
.dl__size{grid-column:2;grid-row:2;font:700 13px/1 var(--mono);color:var(--grafit);text-align:right}
.dl__files{margin:0 0 14px;display:grid;gap:4px}
.dl__files li{display:grid;grid-template-columns:1fr auto auto;gap:4px 16px;font-size:14px;padding:6px 0}
.dl__files a{display:inline-block;min-height:24px;padding:3px 0;overflow-wrap:anywhere;font-family:var(--mono);font-weight:700}
.dl__dim,.dl__bytes{color:var(--grafit);white-space:nowrap}
.cta{padding:clamp(28px,5vw,64px) 0 clamp(40px,7vw,96px)}
.cta__box{max-width:none}
@media (min-width:900px){.cta__box{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);grid-template-areas:'title text' 'link text';align-items:start;column-gap:clamp(24px,4vw,56px)}.cta__box h2{grid-area:title}.cta__box p{grid-area:text}.cta__box .cta__link{grid-area:link}}
.cta h2{font-size:clamp(32px,5vw,56px)}
.cta__link{display:inline-block;justify-self:start;padding:14px 22px;background:var(--atrament);color:var(--biel)!important;text-decoration:none;font:800 15px/1 var(--mono);text-transform:uppercase;box-shadow:5px 5px 0 var(--biel)}
.foot{padding:24px 0 40px;border-top:var(--line) solid var(--atrament);background:var(--cytryna);font-size:14px}
.foot p{max-width:1240px;margin:0 auto 4px;padding:0 var(--gut)}
@media (prefers-reduced-motion:reduce){.laptop__sticker,.klamra .top a,.laptop__button{transition:none}}
`;
