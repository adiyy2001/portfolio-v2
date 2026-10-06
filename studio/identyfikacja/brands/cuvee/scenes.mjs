import { typesetHtml } from '../../../../sites/src/identyfikacja/cuvee/typography.ts';
import { c, contact, extras, baseCss, dataUri, logoMarkup, readPub, file, grapes } from './theme.mjs';

export const L = (variant, scheme, style = '') => logoMarkup(variant, scheme, style);

export const scene = (body, { width, height, css = '' }) =>
  typesetHtml(`<!doctype html><html lang="pl"><meta charset="utf-8"><style>${baseCss()}html,body{width:${width}px;height:${height}px;overflow:hidden}${css}</style><body>${body}</body></html>`);

const mm = n => `calc(${n} * var(--mm))`;
const patternUri = () => dataUri(readPub(file.pattern));
const shadow = 'box-shadow:0 0 0 1px rgba(21,17,14,.22)';

export const cardFront = mode => `<div class="card front" style="--mm:${mode === 'print' ? '1mm' : '13.2px'}"><div class="f-mark">${L('symbol', 'negative', 'width:100%;height:100%')}</div></div>`;

export const cardBack = mode => `<div class="card back" style="--mm:${mode === 'print' ? '1mm' : '13.2px'}">
<div class="b-logo">${L('primary', 'color', 'width:100%;height:auto')}</div>
<div class="b-person"><p class="b-name">${contact.person}</p><p class="b-role caps">${contact.role}</p></div>
<div class="b-rule"></div>
<ul class="b-lines"><li>${contact.street}</li><li>${contact.city}</li><li>${contact.phone}</li><li>${contact.email}</li></ul>
</div>`;

export const cardCss = `
.card{position:relative;width:${mm(91)};height:${mm(61)};overflow:hidden;flex:none}
.card.front{background:${c.czern}}
.card .f-mark{position:absolute;left:${mm(31.5)};top:${mm(15.5)};width:${mm(28)};height:${mm(28)}}
.card.back{background:${c.kosc};color:${c.czern}}
.b-logo{position:absolute;left:${mm(9)};top:${mm(9)};width:${mm(31)}}
.b-person{position:absolute;left:${mm(9)};bottom:${mm(10)}}
.b-name{font:300 ${mm(5.2)}/1.1 'Cuvee Display',serif}
.b-role{font-size:${mm(2.4)};color:${c.wegiel};margin-top:${mm(1.2)}}
.b-rule{position:absolute;left:${mm(52)};top:${mm(9)};bottom:${mm(10)};width:${mm(0.2)};background:${c.mosiadz}}
.b-lines{position:absolute;left:${mm(56)};bottom:${mm(10)};margin:0;padding:0;list-style:none;font:400 ${mm(2.5)}/1.7 'Cuvee Text',serif}
`;

const surface = (inner, width, height) => `<div style="position:relative;width:${width}px;height:${height}px;background:${c.len}">${inner}</div>`;

export const cardScene = side => {
  const body = side === 'front' ? cardFront('screen') : cardBack('screen');
  return scene(surface(`<div style="position:absolute;left:300px;top:227px;${shadow}">${body}</div>`, 1800, 1260), { width: 1800, height: 1260, css: cardCss });
};

export const cardPrintHtml = () => `<!doctype html><html lang="pl"><meta charset="utf-8"><style>${baseCss()}@page{size:91mm 61mm;margin:0}html,body{margin:0}.pg{width:91mm;height:61mm;page-break-after:always;overflow:hidden}${cardCss}</style><body><div class="pg">${cardFront('print')}</div><div class="pg">${cardBack('print')}</div></body></html>`;

const letter = `
<p class="l-date">Sobótka, 6 października</p>
<p class="l-to">Państwo Anna i Tomasz Brzezińscy<br>ul. Nadodrze 4<br>50-001 Wrocław</p>
<p class="l-subj">Potwierdzenie rezerwacji</p>
<p>Szanowni Państwo,</p>
<p>dziękujemy za rezerwację pokoju numer 7 na weekend od piątku do niedzieli. Pokój będzie gotowy od godziny 15:00, a w piątek o 17:00 zapraszamy do piwnicy na degustację rocznika 2024.</p>
<p>Jeśli plany się zmienią, wystarczy jedno zdanie do recepcji. Odpowiedź nie musi być pilna.</p>
<p>Z wyrazami szacunku</p>
<p class="l-sign">${contact.person}</p>
`;

export const letterheadBody = mode => `<div class="sheet" style="--mm:${mode === 'print' ? '1mm' : '5.2px'}">
<div class="l-mark">${L('symbol', 'color', 'width:100%;height:100%')}</div>
<div class="l-addr caps"><p>${contact.street}</p><p>${contact.city}</p><p>${contact.phone}</p></div>
<div class="l-rule"></div>
<div class="l-body">${letter}</div>
<div class="l-foot caps">Cuvée, hotel i winnica, ${contact.street}, ${contact.city}</div>
</div>`;

export const letterheadCss = `
.sheet{position:relative;width:${mm(210)};height:${mm(297)};background:${c.papier};color:${c.czern};overflow:hidden;flex:none}
.l-mark{position:absolute;left:${mm(52)};top:${mm(24)};width:${mm(16)};height:${mm(16)}}
.l-addr{position:absolute;right:${mm(20)};top:${mm(24)};text-align:right;font-size:${mm(2.5)};line-height:1.7;color:${c.wegiel}}
.l-rule{position:absolute;left:${mm(52)};right:${mm(20)};top:${mm(48)};height:${mm(0.2)};background:${c.mosiadz}}
.l-body{position:absolute;left:${mm(52)};top:${mm(62)};width:${mm(110)};font:400 ${mm(3.4)}/1.65 'Cuvee Text',serif}
.l-body p{margin:0 0 ${mm(3.4)}}
.l-date{color:${c.wegiel}}
.l-to{margin-bottom:${mm(9)}!important}
.l-subj{font:300 ${mm(5.6)}/1.2 'Cuvee Display',serif;margin-bottom:${mm(6)}!important}
.l-sign{font:300 italic ${mm(5)}/1.2 'Cuvee Display',serif;margin-top:${mm(7)}}
.l-foot{position:absolute;left:${mm(52)};right:${mm(20)};bottom:${mm(14)};font-size:${mm(2.3)};text-align:center;color:${c.wegiel}}
`;

export const letterheadScene = () => scene(surface(`<div style="position:absolute;left:230px;top:150px;${shadow}">${letterheadBody('screen')}</div>`, 1500, 1860), { width: 1500, height: 1860, css: letterheadCss.replace(/--mm:[^;]*/g, '') });

export const letterheadPrintHtml = () => `<!doctype html><html lang="pl"><meta charset="utf-8"><style>${baseCss()}@page{size:210mm 297mm;margin:0}html,body{margin:0}${letterheadCss}</style><body>${letterheadBody('print')}</body></html>`;

export const labelHtml = ({ vintage = 2024, picks = [['Solaris', 60], ['Johanniter', 40]], scale = 1 } = {}) => {
  const lines = picks.map(([nameText, share]) => `<span>${nameText} ${share}</span>`).join('<i></i>');
  const ticks = picks.map(([, share]) => `<b style="flex:${share}"></b>`).join('');
  return `<div class="label" style="--s:${scale}">
<div class="lb-top">${L('primary', 'color', 'width:100%;height:auto')}</div>
<div class="lb-year">${vintage}</div>
<div class="lb-grapes caps">${lines}</div>
<div class="lb-prop">${ticks}</div>
<p class="lb-app caps">${extras.label.appellation}</p>
<p class="lb-note">${extras.label.note}</p>
<p class="lb-foot caps"><span>${extras.label.volume}</span><span>${extras.label.strength}</span></p>
</div>`;
};

export const labelCss = `
.label{position:relative;width:calc(560px * var(--s,1));height:calc(860px * var(--s,1));background:${c.papier};color:${c.czern};padding:calc(54px * var(--s,1)) calc(58px * var(--s,1));display:flex;flex-direction:column;border:calc(1px * var(--s,1)) solid ${c.mosiadz};outline:calc(1px * var(--s,1)) solid ${c.mosiadz};outline-offset:calc(-14px * var(--s,1))}
.lb-top{width:100%;padding:0 calc(14px * var(--s,1))}
.lb-year{font:200 calc(150px * var(--s,1))/1 'Cuvee Display',serif;text-align:center;margin-top:calc(110px * var(--s,1))}
.lb-grapes{display:flex;justify-content:center;align-items:center;gap:calc(14px * var(--s,1));margin-top:calc(26px * var(--s,1));font-size:calc(21px * var(--s,1))}
.lb-grapes i{width:calc(5px * var(--s,1));height:calc(5px * var(--s,1));background:${c.mosiadz};border-radius:50%}
.lb-prop{display:flex;gap:calc(4px * var(--s,1));margin:calc(26px * var(--s,1)) calc(70px * var(--s,1)) 0}
.lb-prop b{height:calc(1px * var(--s,1));background:${c.czern}}
.lb-app{text-align:center;margin-top:auto;font-size:calc(21px * var(--s,1));color:${c['mosiadz-ciemny']}}
.lb-note{text-align:center;font:italic 400 calc(19px * var(--s,1))/1.5 'Cuvee Text',serif;color:${c.wegiel};margin-top:calc(10px * var(--s,1))}
.lb-foot{display:flex;justify-content:space-between;margin-top:calc(28px * var(--s,1));font-size:calc(17px * var(--s,1));color:${c.wegiel}}
`;

const hangerCss = `
.hanger{position:absolute;left:760px;top:130px;width:360px;height:1020px;background:${c.papier};${shadow}}
.hanger .hole{position:absolute;left:110px;top:60px;width:140px;height:140px;border-radius:50%;background:${c.czern};box-shadow:inset 0 0 0 1px ${c.mosiadz}}
.hanger .slit{position:absolute;left:180px;top:200px;width:1px;height:110px;background:${c.mosiadz}}
.hanger .mark{position:absolute;left:150px;top:350px;width:60px;height:60px}
.hanger h3{position:absolute;left:0;right:0;top:470px;text-align:center;font:300 italic 46px/1.1 'Cuvee Display',serif;padding:0 24px}
.hanger .line{position:absolute;left:130px;right:130px;top:620px;height:1px;background:${c.mosiadz}}
.hanger p.sub{position:absolute;left:0;right:0;top:650px;text-align:center;font:italic 400 24px/1.5 'Cuvee Text',serif;color:${c.wegiel};padding:0 50px}
.hanger p.back{position:absolute;left:0;right:0;bottom:70px;text-align:center;font-size:22px;color:${c.wegiel}}
.menu{position:absolute;left:1270px;top:260px;width:540px;height:760px;background:${c.kosc};${shadow};padding:64px 60px}
.menu h3{font:200 76px/1 'Cuvee Display',serif}
.menu .rule{height:1px;background:${c.mosiadz};margin:30px 0 14px}
.menu li{list-style:none;display:grid;grid-template-columns:90px 1fr;gap:12px;border-bottom:1px solid ${c.kamien};padding:22px 0;font:400 23px/1.45 'Cuvee Text',serif}
.menu li span:first-child{font:400 22px/1.45 'Cuvee Display',serif;font-variant-numeric:oldstyle-nums;color:${c['mosiadz-ciemny']}}
.menu ul{margin:0;padding:0}
.menu .foot{position:absolute;left:60px;right:60px;bottom:48px;font-size:19px;color:${c.wegiel}}
`;

export const applicationScene = () => {
  const css = `${labelCss}${hangerCss}
.wlabel{position:absolute;left:130px;top:270px;${shadow}}
.ground{position:relative;width:1900px;height:1400px;background:${c.czern}}
.ground::before{content:'';position:absolute;left:0;right:0;top:100px;height:1px;background:rgba(176,141,87,.5)}
.cap{position:absolute;left:130px;bottom:90px;font-size:22px;color:${c.kamien}}
`;
  const menu = `<div class="menu"><h3>Śniadanie</h3><div class="rule"></div><ul>${extras.doorHanger.breakfast.map(([t, text]) => `<li><span>${t}</span><span>${text}</span></li>`).join('')}</ul><p class="foot caps">${contact.street}, Sobótka</p></div>`;
  const hanger = `<div class="hanger"><div class="hole"></div><div class="slit"></div><div class="mark">${L('symbol', 'color', 'width:100%;height:100%')}</div><h3>${extras.doorHanger.title}</h3><div class="line"></div><p class="sub">${extras.doorHanger.sub}</p><p class="back caps">${extras.doorHanger.back}</p></div>`;
  return scene(`<div class="ground"><div class="wlabel">${labelHtml()}</div>${hanger}${menu}<p class="cap caps">Etykieta cuvée, zawieszka i karta śniadaniowa</p></div>`, { width: 1900, height: 1400, css });
};

export const emailSignature = logoSrc => `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="font-family:Georgia,'Times New Roman',serif;font-size:14px;line-height:1.5;color:${c.czern}">
<tr><td style="padding:0 0 12px 0"><img src="${logoSrc}" width="200" alt="Cuvée, hotel i winnica" style="display:block;border:0;width:200px;height:auto"></td></tr>
<tr><td style="font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.3;color:${c.czern}">${contact.person}</td></tr>
<tr><td style="color:${c.wegiel};padding-bottom:10px">${contact.role}</td></tr>
<tr><td style="border-top:1px solid ${c.mosiadz};padding-top:10px">${contact.phone}<br><a href="mailto:${contact.email}" style="color:${c['mosiadz-ciemny']};text-decoration:underline">${contact.email}</a><br>${contact.street}, ${contact.city}</td></tr>
<tr><td style="padding-top:10px;color:${c.wegiel};font-size:13px;font-style:italic">Cisza ma rocznik.</td></tr>
</table>`;

export const emailHtmlFile = () => `<!doctype html>
<html lang="pl">
<head><meta charset="utf-8"><title>Podpis e-mail Cuvée</title></head>
<body style="margin:0;padding:16px;background:#ffffff">
${emailSignature('https://adrianturbinski.pl/wzornik/identyfikacja/cuvee/logo/png/cuvee-horizontal-512.png')}
</body>
</html>
`;

export const emailScene = logoDataUri =>
  scene(
    surface(
      `<div style="position:absolute;left:150px;top:110px;width:1300px;background:#fff;padding:0 0 60px;${shadow}"><div style="background:${c.kosc};padding:24px 40px;font:400 20px/1.7 'Cuvee Text',serif;color:${c.czern};border-bottom:1px solid ${c.mosiadz}"><b>Od:</b> ${contact.person} &lt;${contact.email}&gt;<br><b>Do:</b> Anna Brzezińska<br><b>Temat:</b> Pokój numer 7, piątek o 17:00</div><div style="padding:44px 60px;font:400 22px/1.65 'Cuvee Text',serif"><p style="margin-bottom:18px">Dzień dobry,</p><p style="margin-bottom:18px">pokój numer 7 będzie gotowy od 15:00. W piątek o 17:00 otwieramy rocznik 2024 w piwnicy. Odpowiedź może poczekać do rana.</p><p style="margin-bottom:34px">Z wyrazami szacunku</p><div style="zoom:1.7">${emailSignature(logoDataUri)}</div></div></div>`,
      1600,
      1100,
    ),
    { width: 1600, height: 1100 },
  );

export const avatarScene = () => scene(`<div style="width:1080px;height:1080px;background:${c.czern};display:grid;place-items:center"><div style="width:700px;height:700px">${L('symbol', 'negative', 'width:100%;height:100%')}</div></div>`, { width: 1080, height: 1080 });

const postCss = `
.post{position:relative;width:1080px;height:1350px;overflow:hidden}
.post .frame{position:absolute;inset:48px;border:1px solid ${c.mosiadz}}
.post h2{font:200 190px/.98 'Cuvee Display',serif;letter-spacing:-.01em}
.post .body{font:italic 400 48px/1.4 'Cuvee Text',serif}
.post .kick{font-size:28px}
.post .foot{position:absolute;left:112px;bottom:104px;font-size:26px}
.post .mark{position:absolute;right:112px;bottom:92px;width:120px;height:120px}
`;

export const postScene = n => {
  const p = extras.social[n - 1];
  if (n === 1) {
    return scene(`<div class="post" style="background:${c.czern};color:${c.kosc}"><div class="frame"></div><div style="position:absolute;left:112px;top:140px;right:112px"><p class="kick caps" style="color:${c.mosiadz}">Cuvée, winnica</p><h2 style="margin-top:300px;font-size:152px">${p.headline}</h2><p class="body" style="margin-top:60px;max-width:700px;color:${c.kamien}">${p.body}</p></div><p class="foot caps" style="color:${c.kamien}">${p.foot}</p><div class="mark">${L('symbol', 'negative', 'width:100%;height:100%')}</div></div>`, { width: 1080, height: 1350, css: postCss });
  }
  if (n === 2) {
    return scene(`<div class="post" style="background:${c.kosc};color:${c.czern}"><div class="frame"></div><div style="position:absolute;left:49px;right:49px;top:49px;height:360px;background-image:url('${patternUri()}');background-size:120px"></div><div style="position:absolute;left:112px;right:112px;top:520px"><h2 style="font-weight:300;font-style:italic;font-size:176px">${p.headline}</h2><div style="height:1px;background:${c.mosiadz};margin:60px 0 40px;width:260px"></div><p class="body" style="color:${c.wegiel}">${p.body}</p></div><p class="foot caps" style="color:${c.wegiel}">${p.foot}</p><div class="mark">${L('symbol', 'color', 'width:100%;height:100%')}</div></div>`, { width: 1080, height: 1350, css: postCss });
  }
  const rows = extrasRows();
  return scene(`<div class="post" style="background:${c.czern};color:${c.kosc}"><div class="frame"></div><div style="position:absolute;left:112px;top:140px;right:112px"><p class="kick caps" style="color:${c.mosiadz}">Pod Ślężą</p><h2 style="margin-top:80px;font-size:170px">${p.headline}</h2><p class="body" style="margin-top:46px;color:${c.kamien}">${p.body}</p></div><div style="position:absolute;left:112px;right:112px;top:790px">${rows.map(([k, v]) => `<div style="display:flex;justify-content:space-between;align-items:baseline;border-top:1px solid ${c.mosiadz};padding:30px 0"><span class="caps" style="font-size:28px;color:${c.kamien}">${k}</span><span style="font:300 52px/1 'Cuvee Display',serif;font-variant-numeric:oldstyle-nums">${v}</span></div>`).join('')}</div><p class="foot caps" style="color:${c.kamien}">${p.foot}</p><div class="mark">${L('symbol', 'negative', 'width:100%;height:100%')}</div></div>`, { width: 1080, height: 1350, css: postCss });
};

const extrasRows = () => contact.hours.slice(0, 2).map(([k, v]) => [k, v]);

export const ogScene = () => scene(`<div style="position:relative;width:1200px;height:630px;background:${c.czern}"><div style="position:absolute;left:48px;right:48px;top:48px;bottom:48px;border:1px solid ${c.mosiadz}"></div><div style="position:absolute;left:92px;top:150px;width:700px">${L('primary', 'negative', 'width:100%;height:auto')}</div><p class="caps" style="position:absolute;left:112px;bottom:100px;font-size:22px;color:${c.kamien}">Identyfikacja wizualna butikowego hotelu z winnicą</p><div style="position:absolute;right:112px;top:200px;width:200px;height:200px">${L('symbol', 'negative', 'width:100%;height:100%')}</div></div>`, { width: 1200, height: 630 });

export { grapes };
