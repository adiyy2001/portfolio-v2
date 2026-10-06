import { c, contact, extras, file, baseCss, dataUri, grain, logo, readPub } from './theme.mjs';

export const ink = (svg, color) => svg.replace(/fill="#[0-9a-fA-F]{3,8}"/g, `fill="${color}"`);
export const sized = (svg, style) => svg.replace('<svg ', `<svg style="${style}" `);
export const stampInk = (color, style = '') => sized(ink(logo('symbol'), color), `display:block;${style}`);
export const wordInk = (variant, color, style = '') => sized(ink(logo(variant), color), `display:block;${style}`);

export const filters = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<filter id="ink" x="-6%" y="-6%" width="112%" height="112%">
<feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="8" result="warp"/>
<feDisplacementMap in="SourceGraphic" in2="warp" scale="5" result="moved"/>
<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="2" result="speck"/>
<feColorMatrix in="speck" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 7 0 0 0 -2.3" result="mask"/>
<feComposite in="moved" in2="mask" operator="in"/>
</filter>
<filter id="edge" x="-3%" y="-3%" width="106%" height="106%">
<feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="12" result="w"/>
<feDisplacementMap in="SourceGraphic" in2="w" scale="9"/>
</filter>
</defs></svg>`;

export const tableCss = `
.table{position:relative;overflow:hidden;background:${c.otreby}}
.table::before{content:'';position:absolute;inset:0;background:${grain({ alpha: 0.42, frequency: 0.7, seed: 9 })};mix-blend-mode:multiply;opacity:.4}
.shadow{filter:drop-shadow(0 18px 22px rgba(58,49,40,.28)) drop-shadow(0 3px 4px rgba(58,49,40,.25))}
.paper{position:relative}
.paper::after{content:'';position:absolute;inset:0;background:${grain({ alpha: 0.5, frequency: 0.95, seed: 3 })};mix-blend-mode:multiply;opacity:.22;pointer-events:none}
`;

export const scene = (body, { width, height, css = '' }) =>
  `<!doctype html><html lang="pl"><meta charset="utf-8"><style>${baseCss()}${tableCss}html,body{width:${width}px;height:${height}px;overflow:hidden}${css}</style><body>${filters}${body}</body></html>`;

const mm = n => `calc(${n} * var(--mm))`;

export const cardFront = mode => `<div class="card front" style="--mm:${mode === 'print' ? '1mm' : '15px'}"><div class="stampwrap">${stampInk(c.zyto, mode === 'print' ? 'width:100%;height:100%' : 'width:100%;height:100%;filter:url(#ink)')}</div></div>`;

export const cardBack = mode => `<div class="card back" style="--mm:${mode === 'print' ? '1mm' : '15px'}">
<div class="b-logo">${wordInk('horizontal', c.zyto, 'width:100%;height:auto')}</div>
<div class="b-person"><p class="b-name">${contact.person}</p><p class="b-role">${contact.role}</p></div>
<ul class="b-lines"><li>${contact.street}, ${contact.city}</li><li>${contact.phone}</li><li>${contact.email}</li></ul>
<div class="b-stamp">${stampInk(c.skorka, 'width:100%;height:100%')}</div>
<div class="b-strip" style="background-image:url('${dataUri(readPub(file.pattern))}')"></div>
</div>`;

export const cardCss = `
.card{position:relative;width:${mm(91)};height:${mm(61)};overflow:hidden;flex:none}
.card.front{background:${c.kraft}}
.card .stampwrap{position:absolute;left:${mm(26.5)};top:${mm(11.5)};width:${mm(38)};height:${mm(38)};transform:rotate(-6deg)}
.card.back{background:${c['maka-biala']};color:${c.zyto}}
.b-logo{position:absolute;left:${mm(9)};top:${mm(8.5)};width:${mm(34)}}
.b-person{position:absolute;left:${mm(9)};top:${mm(24)}}
.b-name{font:400 ${mm(5.4)}/1.1 'Skibka Display',serif}
.b-role{font:500 ${mm(2.6)}/1.4 'Skibka Text',sans-serif;color:${c.popiol};margin-top:${mm(1)}}
.b-lines{position:absolute;left:${mm(9)};bottom:${mm(11.5)};margin:0;padding:0;list-style:none;font:400 ${mm(2.6)}/1.55 'Skibka Text',sans-serif}
.b-stamp{position:absolute;right:${mm(8)};top:${mm(9)};width:${mm(22)};height:${mm(22)};transform:rotate(7deg)}
.b-strip{position:absolute;left:0;right:0;bottom:0;height:${mm(5.5)};background-size:${mm(24)};background-color:${c.otreby};opacity:1}
`;

export const cardScene = side => {
  const body = side === 'front' ? cardFront('screen') : cardBack('screen');
  return scene(`<div class="table" style="width:1800px;height:1260px"><div class="paper shadow" style="position:absolute;left:217px;top:170px;transform:rotate(${side === 'front' ? -2.2 : 1.6}deg)">${body}</div></div>`, { width: 1800, height: 1260, css: cardCss });
};

export const cardPrintHtml = () => `<!doctype html><html lang="pl"><meta charset="utf-8"><style>${baseCss()}@page{size:91mm 61mm;margin:0}html,body{margin:0}.pg{width:91mm;height:61mm;page-break-after:always;overflow:hidden}${cardCss}</style><body>${filters}<div class="pg">${cardFront('print')}</div><div class="pg">${cardBack('print')}</div></body></html>`;

const letter = `
<p class="l-date">Kraków, 6 października</p>
<p class="l-to">Kawiarnia Pod Zegarem<br>ul. Dietla 12<br>31-070 Kraków</p>
<p class="l-subj">Nowe godziny dostaw chleba</p>
<p>Dzień dobry,</p>
<p>od poniedziałku wozimy chleb wcześniej. Będzie u Państwa o 6:30, a nie o 7:15. Zakwas i tak dojrzewa od środy, więc piec możemy o godzinę wcześniej bez żadnego skracania.</p>
<p>Jeśli ten termin nie pasuje, proszę dać znać do piątku. Przestawimy trasę tak, żeby wszystkie kawiarnie miały chleb przed otwarciem.</p>
<p>Z pozdrowieniami</p>
<p class="l-sign">${contact.person}</p>
`;

export const letterheadBody = mode => `<div class="sheet" style="--mm:${mode === 'print' ? '1mm' : '5.2px'}">
<div class="l-strip" style="background-image:url('${dataUri(readPub(file.pattern))}')"></div>
<div class="l-logo">${wordInk('primary', c.zyto, 'width:100%;height:auto')}</div>
<div class="l-addr"><p>${contact.street}<br>${contact.city}</p><p>${contact.phone}<br>${contact.email}</p></div>
<div class="l-body">${letter}</div>
<div class="l-foot"><span>Skibka, piekarnia na zakwasie</span><span>${contact.street}, ${contact.city}</span></div>
</div>`;

export const letterheadCss = `
.sheet{position:relative;width:${mm(210)};height:${mm(297)};background:${c['maka-biala']};color:${c.zyto};overflow:hidden;flex:none}
.l-strip{position:absolute;left:0;top:0;bottom:0;width:${mm(9)};background-size:${mm(30)};background-color:${c.otreby}}
.l-logo{position:absolute;left:${mm(24)};top:${mm(18)};width:${mm(58)}}
.l-addr{position:absolute;right:${mm(18)};top:${mm(20)};text-align:right;font:400 ${mm(3.1)}/1.5 'Skibka Text',sans-serif;color:${c.popiol}}
.l-addr p+p{margin-top:${mm(2.4)}}
.l-body{position:absolute;left:${mm(24)};top:${mm(70)};width:${mm(120)};font:400 ${mm(3.6)}/1.55 'Skibka Text',sans-serif}
.l-body p{margin:0 0 ${mm(3.2)}}
.l-date{color:${c.popiol}}
.l-to{margin-bottom:${mm(8)}!important}
.l-subj{font:400 ${mm(5.6)}/1.2 'Skibka Display',serif;margin-bottom:${mm(5)}!important}
.l-sign{font:400 ${mm(5)}/1.2 'Skibka Display',serif;margin-top:${mm(8)}}
.l-foot{position:absolute;left:${mm(24)};right:${mm(18)};bottom:${mm(12)};display:flex;justify-content:space-between;border-top:${mm(0.35)} solid ${c.zyto};padding-top:${mm(2.4)};font:500 ${mm(2.7)}/1.4 'Skibka Text',sans-serif;color:${c.popiol}}
`;

export const letterheadScene = () => scene(`<div class="table" style="width:1500px;height:1860px"><div class="paper shadow" style="position:absolute;left:204px;top:150px;transform:rotate(-1.2deg)">${letterheadBody('screen')}</div></div>`, { width: 1500, height: 1860, css: letterheadCss.replace(/--mm:[^;]*/g, '') });

export const letterheadPrintHtml = () => `<!doctype html><html lang="pl"><meta charset="utf-8"><style>${baseCss()}@page{size:210mm 297mm;margin:0}html,body{margin:0}${letterheadCss}</style><body>${letterheadBody('print')}</body></html>`;

const loaf = (w, color, cuts) => `<svg viewBox="0 0 200 120" style="width:${w}px;display:block"><path fill="${color}" d="M12 78C12 40 52 12 100 12s88 28 88 66c0 18-12 30-30 30H42c-18 0-30-12-30-30Z"/><path fill="${cuts}" d="M64 40q10 12 24 34-14-8-24-34Zm38-6q10 12 24 36-14-10-24-36Zm38 6q8 10 16 28-12-6-16-28Z"/></svg>`;

export const bagScene = () => {
  const items = [
    ['Żytni na zakwasie', '700 g', '16 zł'],
    ['Pszenny', '800 g', '15 zł'],
    ['Bułki', 'sztuka', '3 zł'],
  ];
  const specks = Array.from({ length: 40 }, (_, i) => `<i style="left:${(i * 137) % 1900}px;top:${(i * 241) % 1400}px;width:${3 + (i % 4)}px;height:${3 + (i % 3)}px"></i>`).join('');
  const css = `
.bag{position:absolute;left:210px;top:170px;width:700px;height:1000px;background:${c.kraft};transform:rotate(-2deg);filter:url(#edge)}
.bagwrap{position:absolute;left:210px;top:170px;width:700px;height:1000px;transform:rotate(-2deg)}
.bagwrap .flap{position:absolute;left:0;right:0;top:0;height:110px;background:${c.mioz};opacity:.35}
.bagwrap .fold{position:absolute;left:50%;top:110px;bottom:0;width:2px;background:${c.zyto};opacity:.12}
.bagwrap .stamp{position:absolute;left:150px;top:240px;width:400px;transform:rotate(-7deg)}
.bagwrap .t1{position:absolute;left:0;right:0;top:700px;text-align:center;font:400 62px/1 'Skibka Display',serif}
.bagwrap .t2{position:absolute;left:0;right:0;top:790px;text-align:center;font:500 26px/1.4 'Skibka Text',sans-serif;color:${c.zyto}}
.label{position:absolute;left:1080px;top:230px;width:640px;padding:56px 54px;background:${c['maka-biala']};transform:rotate(2.6deg)}
.label h3{font:400 58px/1 'Skibka Display',serif}
.label p.s{font:500 22px/1.4 'Skibka Text',sans-serif;color:${c.popiol};margin:10px 0 28px}
.label ul{list-style:none;margin:0;padding:0}
.label li{display:flex;justify-content:space-between;gap:20px;border-bottom:2px dashed ${c.mioz};padding:15px 0;font:500 30px/1.2 'Skibka Text',sans-serif}
.label li span:nth-child(2){color:${c.popiol};font-weight:400;font-size:24px}
.label li span:last-child{font-weight:700}
.label p.f{margin-top:26px;font:400 24px/1.4 'Skibka Text',sans-serif}
.loaf1{position:absolute;left:1120px;top:1010px;transform:rotate(-8deg)}
.loaf2{position:absolute;left:1480px;top:1090px;transform:rotate(6deg)}
.dust i{position:absolute;background:${c['maka-biala']};border-radius:50%;opacity:.7}
`;
  const body = `<div class="table" style="width:1900px;height:1400px"><div class="dust">${specks}</div>
<div class="shadow"><div class="bag"></div></div>
<div class="bagwrap paper"><div class="flap"></div><div class="fold"></div><div class="stamp">${stampInk(c.zyto, 'filter:url(#ink);width:100%')}</div><p class="t1">Chleb na zakwasie</p><p class="t2">36 godzin, mąka, woda, sól</p></div>
<div class="label paper shadow"><h3>Dziś w oknie</h3><p class="s">Pieczemy od piątej. Do 14:00 albo do wyczerpania.</p><ul>${items.map(i => `<li><span>${i[0]}</span><span>${i[1]}</span><span>${i[2]}</span></li>`).join('')}</ul><p class="f">Skibka, ${contact.street}</p></div>
<div class="loaf1 shadow">${loaf(340, c.skorka, c.kraft)}</div><div class="loaf2 shadow">${loaf(260, c['lan-jasny'], c['maka-biala'])}</div></div>`;
  return scene(body, { width: 1900, height: 1400, css });
};

export const emailSignature = logoSrc => `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:${c.zyto}">
<tr><td style="padding:0 0 10px 0"><img src="${logoSrc}" width="180" alt="Skibka, piekarnia na zakwasie" style="display:block;border:0;width:180px;height:auto"></td></tr>
<tr><td style="font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.3;color:${c.zyto}">${contact.person}</td></tr>
<tr><td style="color:${c.popiol};padding-bottom:8px">${contact.role}</td></tr>
<tr><td style="border-top:2px solid ${c.skorka};padding-top:8px">${contact.phone}<br><a href="mailto:${contact.email}" style="color:${c.skorka};text-decoration:underline">${contact.email}</a><br>${contact.street}, ${contact.city}</td></tr>
<tr><td style="padding-top:8px;color:${c.popiol};font-size:13px">Chleb na zakwasie. Trzydzieści sześć godzin.</td></tr>
</table>`;

export const emailHtmlFile = () => `<!doctype html>
<html lang="pl">
<head><meta charset="utf-8"><title>Podpis e-mail Skibka</title></head>
<body style="margin:0;padding:16px;background:#ffffff">
${emailSignature('https://adrianturbinski.pl/wzornik/identyfikacja/skibka/logo/png/skibka-horizontal-512.png')}
</body>
</html>
`;

export const emailScene = logoDataUri => scene(`<div class="table" style="width:1600px;height:1100px"><div class="shadow" style="position:absolute;left:150px;top:110px;width:1300px;background:#fff;padding:0 0 60px;transform:rotate(0deg)"><div style="background:${c.otreby};padding:22px 36px;font:500 20px/1.6 'Skibka Text',sans-serif;color:${c.zyto}"><b>Od:</b> ${contact.person} &lt;${contact.email}&gt;<br><b>Do:</b> Kawiarnia Pod Zegarem<br><b>Temat:</b> Nowe godziny dostaw</div><div style="padding:40px 56px;font:400 22px/1.6 'Skibka Text',sans-serif"><p style="margin-bottom:18px">Dzień dobry,</p><p style="margin-bottom:18px">od poniedziałku chleb będzie u Państwa o 6:30. Gdyby ten termin nie pasował, proszę dać znać do piątku.</p><p style="margin-bottom:34px">Z pozdrowieniami</p><div style="zoom:1.7">${emailSignature(logoDataUri)}</div></div></div></div>`, { width: 1600, height: 1100 });

export const avatarScene = () => scene(`<div class="paper" style="width:1080px;height:1080px;background:${c.maka};display:grid;place-items:center"><div style="width:880px">${stampInk(c.skorka, 'filter:url(#ink);width:100%')}</div></div>`, { width: 1080, height: 1080 });

const postCss = `
.post{position:relative;width:1080px;height:1350px;overflow:hidden}
.post h2{font:400 150px/0.98 'Skibka Display',serif;letter-spacing:-.01em}
.post .body{font:500 52px/1.3 'Skibka Text',sans-serif}
.post .foot{position:absolute;left:80px;bottom:76px;font:500 34px/1.3 'Skibka Text',sans-serif}
`;

export const postScene = n => {
  const p = extras.social[n - 1];
  if (n === 1) {
    return scene(`<div class="post paper" style="background:${c.kraft};color:${c.zyto}"><div style="position:absolute;right:-170px;bottom:-130px;width:760px;transform:rotate(-12deg)">${stampInk(c.zyto, 'filter:url(#ink);width:100%;opacity:.9')}</div><div style="position:absolute;left:80px;top:110px;right:80px"><h2>${p.headline}</h2><p class="body" style="margin-top:44px;max-width:700px">${p.body}</p></div><p class="foot">${p.foot}</p></div>`, { width: 1080, height: 1350, css: postCss });
  }
  if (n === 2) {
    return scene(`<div class="post paper" style="background:${c.zyto};color:${c.maka}"><div style="position:absolute;left:80px;top:100px;width:200px">${stampInk(c.kraft, 'filter:url(#ink);width:100%')}</div><div style="position:absolute;left:80px;right:80px;top:470px"><h2 style="font-size:176px">${p.headline}</h2><p class="body" style="margin-top:50px;font-size:64px;font-family:'Skibka Display',serif;font-weight:400">${p.body}</p></div><p class="foot" style="color:${c.kraft}">${p.foot}</p></div>`, { width: 1080, height: 1350, css: postCss });
  }
  const rows = [
    ['wt do pt', '7:00 do 17:00'],
    ['sobota', '7:00 do 14:00'],
  ];
  return scene(`<div class="post paper" style="background:${c.maka};color:${c.zyto}"><div style="position:absolute;right:80px;top:80px;width:240px">${stampInk(c.skorka, 'filter:url(#ink);width:100%')}</div><div style="position:absolute;left:80px;top:150px"><h2 style="font-size:132px">${p.headline}</h2></div><div style="position:absolute;left:80px;right:80px;top:560px">${rows.map(r => `<div style="display:flex;justify-content:space-between;align-items:baseline;border-top:4px solid ${c.zyto};padding:34px 0"><span style="font:500 44px/1.2 'Skibka Text',sans-serif">${r[0]}</span><span style="font:400 76px/1 'Skibka Display',serif">${r[1]}</span></div>`).join('')}<div style="border-top:4px solid ${c.zyto};padding-top:34px;font:500 40px/1.35 'Skibka Text',sans-serif;color:${c.popiol}">${p.foot}</div></div></div>`, { width: 1080, height: 1350, css: postCss });
};

export const ogScene = () => scene(`<div class="paper" style="width:1200px;height:630px;background:${c.maka};position:relative"><div style="position:absolute;left:70px;top:150px;width:640px">${wordInk('primary', c.zyto, 'width:100%;height:auto')}</div><div style="position:absolute;left:72px;bottom:70px;font:500 30px/1.3 'Skibka Text',sans-serif;color:${c.popiol}">Identyfikacja wizualna piekarni na zakwasie</div><div style="position:absolute;right:-70px;top:-40px;width:560px;transform:rotate(9deg)">${stampInk(c.skorka, 'filter:url(#ink);width:100%;opacity:.92')}</div></div>`, { width: 1200, height: 630 });
