import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { baseCss, brand, c, contact, dataUri, extras, file, logoColors, sized } from './theme.mjs';

const white = c.biel;
const mark = (variant, colors, style = '') => sized(logoColors(variant, colors), `display:block;${style}`);

const page = (body, { width, height, css = '' }) =>
  `<!doctype html><html lang="pl"><meta charset="utf-8"><style>${baseCss()}html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden}${css}</style><body>${body}</body></html>`;

const gridSvg = (w, h, { margin, cols = 12, gutter = 16, color = c.mgla, opacity = 1 }) => {
  const inner = w - margin * 2;
  const col = (inner - gutter * (cols - 1)) / cols;
  let d = '';
  for (let i = 0; i < cols; i += 1) {
    const x = margin + i * (col + gutter);
    d += `M${x.toFixed(2)} 0V${h}M${(x + col).toFixed(2)} 0V${h}`;
  }
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="position:absolute;left:0;top:0" aria-hidden="true"><path fill="none" stroke="${color}" stroke-opacity="${opacity}" stroke-width="1" d="${d}"/></svg>`;
};

const cardCss = `
.card{position:relative;width:calc(var(--mm)*85);height:calc(var(--mm)*55);overflow:hidden;flex:none}
.front{background:${c.kobalt};color:${white}}
.back{background:${white};color:${c.czern}}
.front .t{position:absolute;left:calc(var(--mm)*6);top:calc(var(--mm)*6);font:700 calc(var(--mm)*1.9)/1.3 'Rzut Condensed';letter-spacing:.07em;text-transform:uppercase}
.front .p{position:absolute;right:calc(var(--mm)*6);top:calc(var(--mm)*6);font:700 calc(var(--mm)*1.9)/1.3 'Rzut Condensed';letter-spacing:.07em;text-transform:uppercase}
.front .logo{position:absolute;left:calc(var(--mm)*6);bottom:calc(var(--mm)*6);width:calc(var(--mm)*46)}
.back .name{position:absolute;left:calc(var(--mm)*6);top:calc(var(--mm)*6);font:700 calc(var(--mm)*3.5)/1.1 'Rzut Sans';letter-spacing:-.01em}
.back .role{position:absolute;left:calc(var(--mm)*6);top:calc(var(--mm)*11.6);font:400 calc(var(--mm)*2.3)/1.3 'Rzut Sans';color:${c.grafit}}
.back .sq{position:absolute;right:calc(var(--mm)*6);top:calc(var(--mm)*6);width:calc(var(--mm)*7)}
.back .rows{position:absolute;left:calc(var(--mm)*6);right:calc(var(--mm)*6);bottom:calc(var(--mm)*6)}
.back .row{display:grid;align-items:baseline;grid-template-columns:calc(var(--mm)*19) 1fr;border-top:calc(var(--mm)*.15) solid ${c.czern};padding:calc(var(--mm)*1.3) 0 calc(var(--mm)*1.4)}
.back .row b{font:700 calc(var(--mm)*1.7)/1.3 'Rzut Condensed';letter-spacing:.07em;text-transform:uppercase;color:${c.grafit}}
.back .row span{font:500 calc(var(--mm)*2.4)/1.3 'Rzut Sans'}
`;

const cardFront = () =>
  `<div class="card front"><span class="t">Pracownia architektoniczna</span><span class="p">Wrocław</span><div class="logo">${mark('horizontal', { square: white, word: white }, 'width:100%;height:auto')}</div></div>`;
const cardBack = () =>
  `<div class="card back"><span class="name">${contact.person}</span><span class="role">${contact.role}</span><div class="sq">${mark('symbol', {}, 'width:100%;height:auto')}</div><div class="rows"><div class="row"><b>Adres</b><span>${contact.street}, ${contact.city}</span></div><div class="row"><b>Telefon</b><span>${contact.phone}</span></div><div class="row"><b>E-mail</b><span>${contact.email}</span></div></div></div>`;

export const cardPrintHtml = () =>
  page(
    `<div class="pg" style="background:${c.kobalt}"><div style="position:absolute;left:3mm;top:3mm">${cardFront()}</div></div><div class="pg" style="background:${white}"><div style="position:absolute;left:3mm;top:3mm">${cardBack()}</div></div>`,
    {
      width: 344,
      height: 231,
      css: `@page{size:91mm 61mm;margin:0}:root{--mm:1mm}html,body{width:auto;height:auto;overflow:visible}.pg{position:relative;width:91mm;height:61mm;overflow:hidden;page-break-after:always}${cardCss}`,
    },
  );

const dimension = (x1, y1, x2, y2, text) => {
  const horizontal = y1 === y2;
  const mid = horizontal ? `left:${(x1 + x2) / 2}px;top:${y1 + 12}px;transform:translateX(-50%)` : `left:${x1 + 14}px;top:${(y1 + y2) / 2}px;transform:translateY(-50%)`;
  const line = horizontal
    ? `<path d="M${x1} ${y1}H${x2}M${x1} ${y1 - 8}v16M${x2} ${y1 - 8}v16" fill="none" stroke="${c.czern}" stroke-width="2"/>`
    : `<path d="M${x1} ${y1}V${y2}M${x1 - 8} ${y1}h16M${x1 - 8} ${y2}h16" fill="none" stroke="${c.czern}" stroke-width="2"/>`;
  return `<svg width="1800" height="1260" style="position:absolute;left:0;top:0" aria-hidden="true">${line}</svg><span class="lbl" style="position:absolute;${mid};font-size:22px;color:${c.czern}">${text}</span>`;
};

export const cardScene = side =>
  page(
    `<div style="position:relative;width:1800px;height:1260px;background:${c.mgla}"><div style="position:absolute;left:177px;top:162px;${side === 'back' ? `outline:2px solid ${c.szary}` : ''}">${side === 'front' ? cardFront() : cardBack()}</div>${dimension(177, 1150, 1622, 1150, '85 mm')}${dimension(1700, 162, 1700, 1097, '55 mm')}</div>`,
    { width: 1800, height: 1260, css: `:root{--mm:17px}${cardCss}` },
  );

const letter = `
<p class="to">Anna i Piotr Wojda<br>ul. Jesionowa 18<br>50-501 Wrocław</p>
<p class="subj">Dom przy parku, projekt budowlany: harmonogram</p>
<p>Szanowni Państwo,</p>
<p>projekt budowlany domu Rzut 07 będzie gotowy dziewięć tygodni po zatwierdzeniu koncepcji. Siatka konstrukcji ma 1,2 m, więc okna i schody zostają w tych samych osiach na wszystkich rysunkach.</p>
<p>W załączniku tabela etapów z terminami. Proszę o akceptację do piątku, wtedy zamawiamy badania gruntu.</p>
<p>Z poważaniem</p>
<p class="sign">${contact.person}</p>
`;

const letterheadCss = `
.sheet{position:relative;width:calc(var(--mm)*210);height:calc(var(--mm)*297);background:${white};color:${c.czern};overflow:hidden;flex:none}
.sheet .logo{position:absolute;left:calc(var(--mm)*15);top:calc(var(--mm)*15);width:calc(var(--mm)*50)}
.sheet .addr{position:absolute;left:calc(var(--mm)*136.5);top:calc(var(--mm)*15.5);width:calc(var(--mm)*58.5);font:500 calc(var(--mm)*2.5)/1.5 'Rzut Sans'}
.sheet .addr b{display:block;font:700 calc(var(--mm)*2)/1.6 'Rzut Condensed';letter-spacing:.07em;text-transform:uppercase;color:${c.grafit};margin-bottom:calc(var(--mm)*1)}
.sheet .rule{position:absolute;left:calc(var(--mm)*15);right:calc(var(--mm)*15);top:calc(var(--mm)*46);height:calc(var(--mm)*.35);background:${c.czern}}
.sheet .meta{position:absolute;left:calc(var(--mm)*15);top:calc(var(--mm)*66);width:calc(var(--mm)*40.5)}
.sheet .meta div{border-top:calc(var(--mm)*.15) solid ${c.czern};padding:calc(var(--mm)*1.2) 0 calc(var(--mm)*2.2)}
.sheet .meta b{display:block;font:700 calc(var(--mm)*1.9)/1.4 'Rzut Condensed';letter-spacing:.07em;text-transform:uppercase;color:${c.grafit}}
.sheet .meta span{font:500 calc(var(--mm)*2.5)/1.4 'Rzut Sans'}
.sheet .body{position:absolute;left:calc(var(--mm)*60);top:calc(var(--mm)*66);width:calc(var(--mm)*81);font:400 calc(var(--mm)*3.1)/1.5 'Rzut Sans'}
.sheet .body p{margin:0 0 calc(var(--mm)*4)}
.sheet .body .to{margin-bottom:calc(var(--mm)*12)}
.sheet .body .subj{font-weight:700;font-size:calc(var(--mm)*4);line-height:1.2;letter-spacing:-.01em;margin-bottom:calc(var(--mm)*6)}
.sheet .body .sign{margin-top:calc(var(--mm)*10);font-weight:700}
.sheet .foot{position:absolute;left:calc(var(--mm)*15);right:calc(var(--mm)*15);bottom:calc(var(--mm)*12);display:flex;justify-content:space-between;border-top:calc(var(--mm)*.15) solid ${c.czern};padding-top:calc(var(--mm)*1.6);font:700 calc(var(--mm)*1.9)/1 'Rzut Condensed';letter-spacing:.07em;text-transform:uppercase;color:${c.grafit}}
`;

const letterhead = () =>
  `<div class="sheet"><div class="logo">${mark('horizontal', {}, 'width:100%;height:auto')}</div><div class="addr"><b>Pracownia architektoniczna</b>${contact.street}<br>${contact.city}<br>${contact.phone}<br>${contact.email}</div><div class="rule"></div><div class="meta"><div><b>Sprawa</b><span>Rzut 07 / 26</span></div><div><b>Data</b><span>6 października 2026</span></div><div><b>Od</b><span>${contact.person}</span></div></div><div class="body">${letter}</div><div class="foot"><span>Rzut, Wrocław</span><span>51.1° N 17.0° E</span><span>1 / 1</span></div></div>`;

export const letterheadPrintHtml = () =>
  page(letterhead(), { width: 794, height: 1123, css: `@page{size:210mm 297mm;margin:0}:root{--mm:1mm}html,body{width:auto;height:auto;overflow:visible}${letterheadCss}` });

export const letterheadScene = () =>
  page(`<div style="position:relative;width:1500px;height:1860px;background:${c.mgla}"><div style="position:absolute;left:120px;top:39px;outline:2px solid ${c.szary}">${letterhead()}</div></div>`, {
    width: 1500,
    height: 1860,
    css: `:root{--mm:6px}${letterheadCss}`,
  });

export const boardScene = () => {
  const b = extras.board;
  const rows = b.rows.map(([k, v]) => `<div class="r"><b>${k}</b><span>${v}</span></div>`).join('');
  const css = `
.scene{position:relative;width:1900px;height:1400px;background:${white};overflow:hidden}
.ground{position:absolute;left:0;right:0;top:1250px;bottom:0;background:${c.papier};border-top:4px solid ${c.czern}}
.post{position:absolute;top:1030px;width:24px;height:220px;background:${c.czern}}
.board{position:absolute;left:290px;top:170px;width:1320px;height:880px;background:${white};border:6px solid ${c.czern};overflow:hidden}
.head{position:relative;height:216px;background:${c.kobalt};color:${white};padding:0 48px}
.head .num{position:absolute;left:44px;top:6px;font:700 230px/1 'Rzut Condensed';letter-spacing:-.02em}
.head .tag{position:absolute;left:372px;top:34px;font:700 22px/1 'Rzut Condensed';letter-spacing:.07em;text-transform:uppercase}
.head h2{position:absolute;left:372px;top:80px;width:860px;font:700 44px/1.1 'Rzut Sans';letter-spacing:-.015em}
.tbl{padding:28px 48px 0 48px}
.r{display:grid;align-items:baseline;grid-template-columns:324px 1fr;padding:18px 0 16px;border-top:2px solid ${c.czern}}
.r b{font:700 21px/1.3 'Rzut Condensed';letter-spacing:.07em;text-transform:uppercase;color:${c.grafit}}
.r span{font:700 30px/1.25 'Rzut Sans'}
.foot{position:absolute;left:48px;right:48px;bottom:36px;display:flex;justify-content:space-between;align-items:flex-end;border-top:2px solid ${c.czern};padding-top:22px}
.foot .lg{width:300px}
.foot .e{font:700 21px/1.3 'Rzut Condensed';letter-spacing:.07em;text-transform:uppercase;color:${c.grafit};text-align:right}
`;
  const dims = `
<svg width="1900" height="1400" style="position:absolute;left:0;top:0" aria-hidden="true"><path d="M290 108H1610M290 96v24M1610 96v24M1700 170V1050M1688 170h24M1688 1050h24" fill="none" stroke="${c.czern}" stroke-width="2"/></svg>
<span class="lbl" style="position:absolute;left:950px;top:112px;transform:translateX(-50%);font-size:24px">1200 mm</span>
<span class="lbl" style="position:absolute;left:1726px;top:610px;font-size:24px">800 mm</span>`;
  return page(
    `<div class="scene"><div class="ground"></div><div class="post" style="left:420px"></div><div class="post" style="left:1456px"></div><div class="board"><div class="head"><span class="num">${b.number}</span><span class="tag">Tablica informacyjna budowy</span><h2>${b.title}</h2></div><div class="tbl">${rows}</div><div class="foot"><div class="lg">${mark('horizontal', {}, 'width:100%;height:auto')}</div><div class="e">Projekt Rzut 07 / 26<br>Telefon alarmowy 112</div></div></div>${dims}</div>`,
    { width: 1900, height: 1400, css },
  );
};

export const emailSignature = logoUrl => `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.45;color:#0a0a0a;border-collapse:collapse">
<tr><td style="padding:0 0 14px 0"><img src="${logoUrl}" width="220" alt="Rzut, pracownia architektoniczna" style="display:block;border:0;height:auto"></td></tr>
<tr><td style="padding:12px 0 0 0;border-top:3px solid #1f4bff"><strong style="font-size:15px">${contact.person}</strong><br><span style="color:#5a5a57">${contact.role}</span></td></tr>
<tr><td style="padding:10px 0 0 0">${contact.phone}<br><a href="mailto:${contact.email}" style="color:#1f4bff;text-decoration:underline">${contact.email}</a><br>${contact.street}, ${contact.city}</td></tr>
</table>`;

export const emailHtmlFile = () => `<!doctype html>
<html lang="pl">
<head><meta charset="utf-8"><title>Podpis e-mail Rzut</title></head>
<body style="margin:0;padding:16px;background:#ffffff">
${emailSignature('https://adrianturbinski.pl/wzornik/identyfikacja/rzut/logo/png/rzut-horizontal-512.png')}
</body>
</html>
`;

export const emailScene = logoDataUri => {
  const css = `
.scene{position:relative;width:1600px;height:1100px;background:${c.mgla}}
.mail{position:absolute;left:150px;top:100px;width:1300px;background:${white};border:2px solid ${c.czern}}
.bar{display:flex;justify-content:space-between;background:${c.czern};color:${white};padding:18px 40px;font:700 20px/1 'Rzut Condensed';letter-spacing:.07em;text-transform:uppercase}
.hdr{display:grid;grid-template-columns:160px 1fr;padding:12px 40px;border-bottom:2px solid ${c.czern};font:500 22px/1.5 'Rzut Sans'}
.hdr b{font:700 18px/2.2 'Rzut Condensed';letter-spacing:.07em;text-transform:uppercase;color:${c.grafit}}
.body{padding:40px 40px 60px;font:400 24px/1.5 'Rzut Sans'}
.body p{margin:0 0 20px;width:760px}
.sig{margin-top:44px;font-family:Arial,Helvetica,sans-serif;zoom:1.35}
`;
  const sig = emailSignature(logoDataUri);
  return page(
    `<div class="scene"><div class="mail"><div class="bar"><span>Nowa wiadomość</span><span>Rzut 07 / 26</span></div><div class="hdr"><b>Od</b><span>${contact.person}</span><b>Do</b><span>Anna i Piotr Wojda</span><b>Temat</b><span>Dom przy parku: harmonogram projektu</span></div><div class="body"><p>Szanowni Państwo, w załączniku tabela etapów z terminami. Koncepcja po trzech tygodniach, projekt budowlany po dziewięciu.</p><p>Pozdrawiam</p><div class="sig">${sig}</div></div></div></div>`,
    { width: 1600, height: 1100, css },
  );
};

export const avatarScene = () =>
  page(`<div style="width:1080px;height:1080px;background:${c.kobalt};display:grid;place-items:center">${mark('symbol', { square: white }, 'width:540px;height:540px')}</div>`, { width: 1080, height: 1080 });

const postCss = `
.post{position:relative;width:1080px;height:1350px;overflow:hidden}
.post .top{position:absolute;left:72px;right:72px;top:56px;display:flex;justify-content:space-between;font:700 28px/1 'Rzut Condensed';letter-spacing:.07em;text-transform:uppercase}
.post .foot{position:absolute;left:72px;right:72px;bottom:64px;font:700 28px/1.2 'Rzut Condensed';letter-spacing:.07em;text-transform:uppercase}
.post .logo{position:absolute;right:72px;bottom:60px;width:280px}
`;

export const postScene = n => {
  const p = extras.social[n - 1];
  if (n === 1) {
    return page(
      `<div class="post" style="background:${white};color:${c.czern}">${gridSvg(1080, 1350, { margin: 72, color: c.mgla })}<div class="top"><span>Rzut 07 / 26</span><span style="color:${c.kobalt}">Wrocław</span></div><div style="position:absolute;left:56px;top:96px;font:700 860px/1 'Rzut Condensed';letter-spacing:-.04em;color:${c.czern}">07</div><div style="position:absolute;left:72px;top:900px;width:936px"><h2 style="font:700 96px/1 'Rzut Sans';letter-spacing:-.02em;word-spacing:.06em">${p.headline}</h2><p style="font:500 40px/1.25 'Rzut Sans';margin-top:28px">${p.body}</p></div><div class="foot" style="color:${c.grafit}">${p.foot}</div><div style="position:absolute;right:72px;bottom:56px;width:56px">${mark('symbol', {}, 'width:100%;height:auto')}</div></div>`,
      { width: 1080, height: 1350, css: postCss },
    );
  }
  if (n === 2) {
    const m = 156;
    const x0 = 72;
    const y0 = 136;
    let g = '';
    for (let i = 0; i <= 6; i += 1) g += `M${x0 + i * m} ${y0}V${y0 + 4 * m}`;
    for (let j = 0; j <= 4; j += 1) g += `M${x0} ${y0 + j * m}H${x0 + 6 * m}`;
    const room = `M${x0 + m} ${y0 + m}H${x0 + 5 * m}V${y0 + 3 * m}H${x0 + 4 * m + 0.5 * m}M${x0 + 3.5 * m} ${y0 + 3 * m}H${x0 + m}Z`;
    const plan = `<svg width="1080" height="1350" style="position:absolute;left:0;top:0" aria-hidden="true"><rect x="${x0 + 2 * m}" y="${y0 + m}" width="${m}" height="${m}" fill="${c.kobalt}"/><path fill="none" stroke="${c.beton}" stroke-opacity=".6" stroke-width="1" d="${g}"/><path fill="none" stroke="${white}" stroke-width="8" stroke-linejoin="miter" d="${room}"/><path fill="none" stroke="${white}" stroke-width="3" d="M${x0 + 2 * m} ${y0 + 4 * m + 34}H${x0 + 3 * m}M${x0 + 2 * m} ${y0 + 4 * m + 22}v24M${x0 + 3 * m} ${y0 + 4 * m + 22}v24"/></svg><span style="position:absolute;left:${x0 + 3 * m + 20}px;top:${y0 + 4 * m + 18}px;font:700 30px/1 'Rzut Condensed';letter-spacing:.07em">1,2 M</span>`;
    return page(
      `<div class="post" style="background:${c.czern};color:${white}">${plan}<div class="top"><span>Siatka konstrukcji</span><span style="color:${c.szary}">Rzut 07 / 26</span></div><h2 style="position:absolute;left:72px;top:850px;width:936px;font:700 140px/0.98 'Rzut Sans';letter-spacing:-.025em;word-spacing:.05em">${p.headline}</h2><p style="position:absolute;left:72px;top:1030px;width:760px;font:500 42px/1.25 'Rzut Sans'">${p.body}</p><div class="foot" style="color:${c.szary}">${p.foot}</div></div>`,
      { width: 1080, height: 1350, css: postCss },
    );
  }
  return page(
    `<div class="post" style="background:${c.kobalt};color:${white}">${gridSvg(1080, 1350, { margin: 72, color: white, opacity: 0.28 })}<div class="top"><span>Rzut 07 / 26</span><span>Wrocław</span></div><h2 style="position:absolute;left:72px;top:300px;width:900px;font:700 190px/0.94 'Rzut Sans';letter-spacing:-.035em">${p.headline}</h2><div style="position:absolute;left:72px;top:860px;width:700px;font:700 120px/1 'Rzut Condensed';letter-spacing:-.01em">16:00 do 19:00</div><p style="position:absolute;left:72px;top:1010px;width:760px;font:500 44px/1.25 'Rzut Sans'">Ostatni piątek miesiąca. Makiety, rysunki i kawa.</p><div class="foot">${p.foot}</div></div>`,
    { width: 1080, height: 1350, css: postCss },
  );
};

export const ogScene = () =>
  page(
    `<div style="position:relative;width:1200px;height:630px;background:${white};overflow:hidden">${gridSvg(1200, 630, { margin: 60, color: c.mgla })}<div style="position:absolute;left:60px;top:48px;right:60px;display:flex;justify-content:space-between;font:700 22px/1 'Rzut Condensed';letter-spacing:.07em;text-transform:uppercase"><span>Wzornik, identyfikacja</span><span style="color:${c.kobalt}">I1</span></div><div style="position:absolute;left:60px;top:150px;width:880px">${mark('primary', {}, 'width:100%;height:auto')}</div><div style="position:absolute;left:60px;bottom:48px;font:700 22px/1 'Rzut Condensed';letter-spacing:.07em;text-transform:uppercase;color:${c.grafit}">Szwajcarski modernizm, pracownia architektoniczna, Wrocław</div></div>`,
    { width: 1200, height: 630 },
  );

export const readBrandPng = path => readFileSync(join(brand.paths.pub, path));
export { dataUri, file };
