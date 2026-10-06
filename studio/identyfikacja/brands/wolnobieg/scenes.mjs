import { arcsSvg, bikeSvg } from './art.mjs';
import { c, contact, extras, baseCss, logoIn, wear } from './theme.mjs';

const ink = { '#5b2f14': c.kakao };
export const onOrange = { '#5b2f14': c.kakao, '#ec7424': c['krem-jasny'] };
export const onDark = { '#5b2f14': c['krem-jasny'] };
export const onBrown = { '#5b2f14': c['krem-jasny'] };

export const scene = (body, { width, height, css = '' }) =>
  `<!doctype html><html lang="pl"><meta charset="utf-8"><style>${baseCss()}html,body{width:${width}px;height:${height}px;overflow:hidden}${css}</style><body>${body}</body></html>`;

export const tableCss = `
.table{position:relative;overflow:hidden;background:${c.len}}
.table::before{content:'';position:absolute;inset:0;background:${wear({ alpha: 0.35, seed: 9 })};opacity:.35}
.shadow{filter:drop-shadow(0 22px 26px rgba(63,36,17,.32)) drop-shadow(0 3px 5px rgba(63,36,17,.3))}
.worn{position:relative}
.worn::after{content:'';position:absolute;inset:0;background:${wear({ alpha: 0.4, seed: 3 })};opacity:.3;pointer-events:none;border-radius:inherit}
`;

const mm = n => `calc(${n} * var(--mm))`;
const cardArcs = (corner, style) => {
  const w = 91;
  const h = 61;
  return arcsSvg({ w, h, corner, width: 4.2, gap: 1.8, start: corner === 'bl' ? 20 : 24, style: `position:absolute;inset:0;width:100%;height:100%;${style ?? ''}`, colors: corner === 'bl' ? [c['krem-jasny'], c.musztarda, c.kakao] : undefined });
};

export const cardFront = mode => `<div class="card front" style="--mm:${mode === 'print' ? '1mm' : '15px'}">${cardArcs('bl')}<div class="f-badge">${logoIn('symbol', { '#5b2f14': c.kakao, '#ec7424': c['krem-jasny'] }, 'width:100%;height:100%')}</div><div class="f-logo">${logoIn('primary', onOrange, 'width:100%;height:auto')}</div></div>`;

export const cardBack = mode => `<div class="card back" style="--mm:${mode === 'print' ? '1mm' : '15px'}">${cardArcs('br')}<div class="b-logo">${logoIn('horizontal', ink, 'width:100%;height:auto')}</div><div class="b-person"><p class="b-name">${contact.person}</p><p class="b-role">${contact.role}</p></div><ul class="b-lines"><li>${contact.street}, ${contact.city}</li><li>${contact.phone}</li><li>${contact.email}</li></ul></div>`;

export const cardCss = `
.card{position:relative;width:${mm(91)};height:${mm(61)};overflow:hidden;flex:none}
.card.front{background:${c.pomarancz}}
.f-badge{position:absolute;left:${mm(54)};top:${mm(7)};width:${mm(47)};height:${mm(47)}}
.f-logo{position:absolute;left:${mm(9)};top:${mm(12)};width:${mm(46)}}
.card.back{background:${c['krem-jasny']};color:${c.kakao}}
.b-logo{position:absolute;left:${mm(9)};top:${mm(8.5)};width:${mm(40)}}
.b-person{position:absolute;left:${mm(9)};top:${mm(24)}}
.b-name{font:400 ${mm(5)}/1.1 'Wolnobieg Display',serif;color:${c.brazowy}}
.b-role{font:600 ${mm(2.8)}/1.4 'Wolnobieg Text',sans-serif;color:${c.kawa};margin-top:${mm(1)}}
.b-lines{position:absolute;left:${mm(9)};bottom:${mm(9)};margin:0;padding:0;list-style:none;font:400 ${mm(2.9)}/1.5 'Wolnobieg Text',sans-serif}
`;

export const cardScene = side => {
  const body = side === 'front' ? cardFront('screen') : cardBack('screen');
  return scene(`<div class="table" style="width:1800px;height:1260px"><div class="worn shadow" style="position:absolute;left:217px;top:170px;transform:rotate(${side === 'front' ? -2.4 : 1.8}deg);border-radius:14px;overflow:hidden">${body}</div></div>`, { width: 1800, height: 1260, css: tableCss + cardCss });
};

export const cardPrintHtml = () => `<!doctype html><html lang="pl"><meta charset="utf-8"><style>${baseCss()}@page{size:91mm 61mm;margin:0}html,body{margin:0}.pg{width:91mm;height:61mm;page-break-after:always;overflow:hidden}${cardCss}</style><body><div class="pg">${cardFront('print')}</div><div class="pg">${cardBack('print')}</div></body></html>`;

const letter = `
<p class="l-date">Gdańsk, 6 października</p>
<p class="l-to">Pan Marek Wolski<br>ul. Grunwaldzka 140<br>80-264 Gdańsk</p>
<p class="l-subj">Rower jest gotowy</p>
<p>Dzień dobry,</p>
<p>wymieniliśmy tylną dętkę i wyregulowaliśmy oba hamulce. Przy okazji wyprostowaliśmy kółko w tylnym kole, bo bił na boki. Za to nie doliczyliśmy nic.</p>
<p>Rower czeka w warsztacie do soboty do 15:00. Jeśli ten termin nie pasuje, proszę dać znać, a zostawimy go w bramie na zapleczu.</p>
<p>Pozdrawiam</p>
<p class="l-sign">${contact.person}</p>
`;

const lines = `<div class="l-lines"><i style="background:${c.pomarancz}"></i><i style="background:${c.musztarda}"></i><i style="background:${c.brazowy}"></i></div>`;

export const letterheadBody = mode => `<div class="sheet" style="--mm:${mode === 'print' ? '1mm' : '5.2px'}">${arcsSvg({ w: 210, h: 297, corner: 'tr', width: 6, gap: 2.4, start: 28, style: 'position:absolute;inset:0;width:100%;height:100%' })}<div class="l-logo">${logoIn('horizontal', ink, 'width:100%;height:auto')}</div><div class="l-addr"><p>${contact.street}<br>${contact.city}</p><p>${contact.phone}<br>${contact.email}</p></div><div class="l-body">${letter}</div>${lines}<div class="l-foot"><span>Wolnobieg, serwis i sklep rowerowy</span><span>${contact.street}, ${contact.city}</span></div></div>`;

export const letterheadCss = `
.sheet{position:relative;width:${mm(210)};height:${mm(297)};background:${c['krem-jasny']};color:${c.kakao};overflow:hidden;flex:none}
.l-logo{position:absolute;left:${mm(22)};top:${mm(20)};width:${mm(62)}}
.l-addr{position:absolute;left:${mm(22)};top:${mm(52)};font:400 ${mm(3.1)}/1.5 'Wolnobieg Text',sans-serif;color:${c.kawa}}
.l-addr p+p{margin-top:${mm(2.4)}}
.l-body{position:absolute;left:${mm(66)};top:${mm(82)};width:${mm(112)};font:400 ${mm(3.6)}/1.5 'Wolnobieg Text',sans-serif}
.l-body p{margin:0 0 ${mm(3.2)}}
.l-date{color:${c.kawa}}
.l-to{margin-bottom:${mm(8)}!important}
.l-subj{font:400 ${mm(5.6)}/1.2 'Wolnobieg Display',serif;color:${c.brazowy};margin-bottom:${mm(5)}!important}
.l-sign{font:400 ${mm(4.6)}/1.2 'Wolnobieg Display',serif;color:${c.brazowy};margin-top:${mm(8)}}
.l-lines{position:absolute;left:${mm(22)};right:${mm(22)};bottom:${mm(21)};display:grid;gap:${mm(0.9)}}
.l-lines i{display:block;height:${mm(1.2)};border-radius:${mm(1)}}
.l-foot{position:absolute;left:${mm(22)};right:${mm(22)};bottom:${mm(10)};display:flex;justify-content:space-between;font:600 ${mm(2.7)}/1.4 'Wolnobieg Text',sans-serif;color:${c.kawa}}
`;

export const letterheadScene = () => scene(`<div class="table" style="width:1500px;height:1860px"><div class="worn shadow" style="position:absolute;left:204px;top:150px;transform:rotate(-1.2deg)">${letterheadBody('screen')}</div></div>`, { width: 1500, height: 1860, css: tableCss + letterheadCss.replace(/--mm:[^;]*/g, '') });

export const letterheadPrintHtml = () => `<!doctype html><html lang="pl"><meta charset="utf-8"><style>${baseCss()}@page{size:210mm 297mm;margin:0}html,body{margin:0}${letterheadCss}</style><body>${letterheadBody('print')}</body></html>`;

export const tagBody = () => `<div class="tag"><div class="tag-hole"></div><div class="tag-top">${logoIn('symbol', { '#5b2f14': c.kakao, '#ec7424': c['krem-jasny'] }, 'width:96px;height:96px')}<div><p class="tag-small">${extras.tag.title}</p><p class="tag-no">${extras.tag.number}</p></div></div><dl>${extras.tag.rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl><p class="tag-foot">${contact.phone}</p></div>`;

export const applicationScene = () => {
  const css = `
.wall{position:absolute;left:0;right:0;top:0;height:900px;background:${c.piasek}}
.street{position:absolute;left:0;right:0;top:900px;bottom:0;background:${c.len}}
.board{position:absolute;left:110px;top:90px;width:1040px;height:300px;background:${c.brazowy};border-radius:44px;border:12px solid ${c.kakao};display:flex;align-items:center;justify-content:center;padding:0 60px}
.board p{position:absolute;left:0;right:0;bottom:-70px;text-align:center;font:800 30px/1 'Wolnobieg Text',sans-serif;letter-spacing:.2em;color:${c.kakao}}
.bar{position:absolute;left:160px;top:384px;width:20px;height:90px;background:${c.kakao}}
.bar.r{left:1070px}
.door{position:absolute;left:150px;top:540px;width:560px;height:360px;background:${c.kakao};border-radius:260px 260px 0 0;overflow:hidden}
.door .glass{position:absolute;left:46px;right:46px;top:46px;bottom:0;background:${c.musztarda};border-radius:214px 214px 0 0}
.door .hours{position:absolute;left:46px;right:46px;top:176px;text-align:center;font:600 28px/1.35 'Wolnobieg Text',sans-serif;color:${c.kakao}}
.door .hours b{display:block;font:400 34px/1.2 'Wolnobieg Display',serif;color:${c.brazowy};margin-bottom:8px}
.bike{position:absolute;left:770px;top:626px;width:480px}
.tag{position:relative;width:540px;padding:60px 44px 40px;background:${c['krem-jasny']};border-radius:34px;color:${c.kakao}}
.tag-hole{position:absolute;left:50%;top:22px;width:34px;height:34px;margin-left:-17px;border-radius:50%;background:${c.len};box-shadow:inset 0 0 0 4px ${c.brazowy}}
.tag-top{display:flex;gap:22px;align-items:center;background:${c.pomarancz};border-radius:24px;padding:20px;margin-top:18px}
.tag-small{font:800 20px/1.2 'Wolnobieg Text',sans-serif;letter-spacing:.1em;text-transform:uppercase}
.tag-no{white-space:nowrap;font:400 27px/1.2 'Wolnobieg Display',serif;margin-top:6px}
.tag dl{margin:26px 0 0}
.tag dl div{border-top:3px dashed ${c.tyton};padding:12px 0}
.tag dt{font:800 17px/1 'Wolnobieg Text',sans-serif;letter-spacing:.12em;text-transform:uppercase;color:${c.kawa}}
.tag dd{margin:6px 0 0;font:600 28px/1.25 'Wolnobieg Text',sans-serif}
.tag-foot{margin-top:18px;font:800 26px/1 'Wolnobieg Text',sans-serif;color:${c.rdza}}
`;
  const body = `<div class="table" style="width:1900px;height:1200px;background:${c.piasek}"><div class="wall"></div><div class="street"></div>
<div class="shadow"><div class="board worn">${logoIn('horizontal', onDark, 'height:190px;width:auto')}<p>serwis i sklep rowerowy</p></div></div><div class="bar"></div><div class="bar r"></div>
<div class="door"><div class="glass"></div><div class="hours"><b>Warsztat czynny</b>${contact.hours.map(([d, h]) => `${d}: ${h}`).join('<br>')}</div></div>
<div class="bike">${bikeSvg({ style: 'width:100%;height:auto;display:block' })}</div>
<div class="shadow" style="position:absolute;left:1330px;top:420px;transform:rotate(3deg);transform-origin:50% 0"><div style="position:absolute;left:50%;bottom:100%;margin:0 0 -30px -3px;width:6px;height:420px;background:${c.kakao}"></div><div class="worn" style="border-radius:34px">${tagBody()}</div></div></div>`;
  return scene(body, { width: 1900, height: 1200, css: tableCss + css });
};

export const emailSignature = logoSrc => `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:${c.kakao}">
<tr><td style="padding:0 0 10px 0"><img src="${logoSrc}" width="210" alt="Wolnobieg, serwis i sklep rowerowy" style="display:block;border:0;width:210px;height:auto"></td></tr>
<tr><td style="font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.3;color:${c.brazowy};font-weight:bold">${contact.person}</td></tr>
<tr><td style="color:${c.kawa};padding-bottom:8px">${contact.role}</td></tr>
<tr><td style="border-top:3px solid ${c.pomarancz};padding-top:8px">${contact.phone}<br><a href="mailto:${contact.email}" style="color:${c.rdza};text-decoration:underline">${contact.email}</a><br>${contact.street}, ${contact.city}</td></tr>
<tr><td style="padding-top:8px;color:${c.kawa};font-size:13px">Naprawiamy, nie wymieniamy. Jedź wolno.</td></tr>
</table>`;

export const emailHtmlFile = () => `<!doctype html>
<html lang="pl">
<head><meta charset="utf-8"><title>Podpis e-mail Wolnobieg</title></head>
<body style="margin:0;padding:16px;background:#ffffff">
${emailSignature('https://adrianturbinski.pl/wzornik/identyfikacja/wolnobieg/logo/png/wolnobieg-horizontal-512.png')}
</body>
</html>
`;

export const emailScene = logoDataUri => scene(`<div class="table" style="width:1600px;height:900px"><div class="shadow" style="position:absolute;left:150px;top:90px;width:1300px;background:#fff;padding:0 0 60px;border-radius:26px;overflow:hidden"><div style="background:${c.piasek};padding:22px 36px;font:600 20px/1.6 'Wolnobieg Text',sans-serif;color:${c.kakao}"><b>Od:</b> ${contact.person} &lt;${contact.email}&gt;<br><b>Do:</b> Marek Wolski<br><b>Temat:</b> Rower jest gotowy</div><div style="padding:36px;font:400 24px/1.5 'Wolnobieg Text',sans-serif;color:${c.kakao}"><p>Dzień dobry,</p><p style="margin-top:14px">rower jest gotowy. Wymieniliśmy dętkę i wyregulowaliśmy hamulce. Odbiór do soboty do 15:00.</p><p style="margin:14px 0 36px">Pozdrawiam</p>${emailSignature(logoDataUri).replaceAll('font-size:14px', 'font-size:20px').replace('width="210"', 'width="300"').replace('width:210px', 'width:300px')}</div></div></div>`, { width: 1600, height: 900, css: tableCss });

const soft = { '#5b2f14': c.kakao, '#ec7424': c['krem-jasny'] };

export const avatarScene = () => scene(`<div class="worn" style="width:1080px;height:1080px;background:${c.pomarancz};display:grid;place-items:center"><div style="width:800px">${logoIn('symbol', soft, 'width:100%;height:auto')}</div></div>`, { width: 1080, height: 1080, css: tableCss });

const postCss = `
.post{position:relative;width:1080px;height:1350px;overflow:hidden}
.post h2{font:400 128px/1.32 'Wolnobieg Display',serif}
.post .body{font:800 58px/1.25 'Wolnobieg Text',sans-serif}
.post .foot{position:absolute;left:80px;bottom:76px;font:800 38px/1.3 'Wolnobieg Text',sans-serif}
`;

export const postScene = n => {
  const p = extras.social[n - 1];
  if (n === 1) {
    return scene(`<div class="post worn" style="background:${c.pomarancz};color:${c.kakao}">${arcsSvg({ w: 1080, h: 1350, corner: 'br', width: 70, gap: 26, start: 330, colors: [c.kakao, c.musztarda, c['krem-jasny']], style: 'position:absolute;inset:0' })}<div style="position:absolute;left:80px;top:80px;width:160px">${logoIn('symbol', soft, 'width:100%;height:auto')}</div><div style="position:absolute;left:80px;right:80px;top:340px"><h2>${p.headline}</h2><p class="body" style="margin-top:44px;max-width:640px">${p.body}</p></div><p class="foot">${p.foot}</p></div>`, { width: 1080, height: 1350, css: tableCss + postCss });
  }
  if (n === 2) {
    return scene(`<div class="post worn" style="background:${c.brazowy};color:${c['krem-jasny']}"><div style="position:absolute;right:-220px;bottom:-220px;width:900px;transform:rotate(14deg)">${logoIn('symbol', { '#5b2f14': c['krem-jasny'] }, 'width:100%;height:auto')}</div><div style="position:absolute;left:80px;right:80px;top:100px"><h2 style="font-size:100px">${p.headline}</h2><p class="body" style="margin-top:44px;max-width:680px;color:${c.musztarda}">${p.body}</p></div><p class="foot">${p.foot}</p></div>`, { width: 1080, height: 1350, css: tableCss + postCss });
  }
  const rows = [
    ['pn do pt', '9:00 do 18:00'],
    ['sobota', '10:00 do 15:00'],
  ];
  return scene(`<div class="post worn" style="background:${c.musztarda};color:${c.kakao}">${arcsSvg({ w: 1080, h: 1350, corner: 'tl', width: 56, gap: 22, start: 280, colors: [c.pomarancz, c['krem-jasny'], c.brazowy], style: 'position:absolute;inset:0' })}<div style="position:absolute;left:80px;right:80px;top:470px"><h2 style="font-size:132px">${p.headline}</h2></div><div style="position:absolute;left:80px;right:80px;top:800px;display:grid;gap:22px">${rows.map(r => `<div style="display:flex;justify-content:space-between;background:${c['krem-jasny']};border-radius:34px;padding:30px 40px;font:800 50px/1.2 'Wolnobieg Text',sans-serif"><span>${r[0]}</span><span>${r[1]}</span></div>`).join('')}</div><p class="foot">${p.foot}</p></div>`, { width: 1080, height: 1350, css: tableCss + postCss });
};

export const ogScene = () => scene(`<div class="worn" style="width:1200px;height:630px;background:${c.krem};position:relative;overflow:hidden">${arcsSvg({ w: 1200, h: 630, corner: 'br', width: 44, gap: 18, start: 250, style: 'position:absolute;inset:0' })}<div style="position:absolute;left:72px;top:120px;width:700px">${logoIn('primary', {}, 'width:100%;height:auto')}</div><div style="position:absolute;left:76px;bottom:70px;font:800 32px/1.3 'Wolnobieg Text',sans-serif;color:${c.kawa}">Identyfikacja wizualna serwisu rowerowego</div></div>`, { width: 1200, height: 630, css: tableCss });
