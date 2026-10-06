import { braceGeometry } from './logo-parts.mjs';
import { c, contact, extras, file, baseCss, dataUri, logoImg, readPub } from './theme.mjs';
import { stickerSet, stickerSvg, stickerBox } from '../../../../sites/src/identyfikacja/klamra/lib/stickers.ts';

export const patternUri = () => dataUri(readPub(file.pattern));

export const scene = (body, { width, height, css = '' }) =>
  `<!doctype html><html lang="pl"><meta charset="utf-8"><style>${baseCss()}html,body{width:${width}px;height:${height}px;overflow:hidden}${css}</style><body>${body}</body></html>`;

const mm = n => `calc(${n} * var(--mm))`;

export const cardFront = mode => `<div class="card front" style="--mm:${mode === 'print' ? '1mm' : '15px'}">
<div class="f-mark">${logoImg('symbol', 'width:100%;height:auto')}</div>
<p class="f-line">szkoła programowania online</p>
<p class="f-url">${contact.site}</p>
</div>`;

export const cardBack = mode => `<div class="card back" style="--mm:${mode === 'print' ? '1mm' : '15px'}">
<div class="b-logo">${logoImg('horizontal', 'width:100%;height:auto')}</div>
<div class="b-person"><p class="b-name">${contact.person}</p><p class="b-role">${contact.role}</p></div>
<ul class="b-lines"><li>${contact.phone}</li><li>${contact.email}</li><li>${contact.site}</li></ul>
<div class="b-strip" style="background-image:url('${patternUri()}')"></div>
</div>`;

export const cardCss = `
.card{position:relative;width:${mm(91)};height:${mm(61)};overflow:hidden;flex:none}
.card.front{background:${c.cytryna}}
.card .f-mark{position:absolute;left:${mm(9)};top:${mm(9)};width:${mm(37)}}
.card .f-line{position:absolute;left:${mm(9)};bottom:${mm(8.5)};font:800 ${mm(2.5)}/1.2 'Klamra Mono',monospace;text-transform:uppercase;letter-spacing:.06em}
.card .f-url{position:absolute;right:${mm(9)};top:${mm(9)};font:800 ${mm(2.6)}/1.2 'Klamra Mono',monospace;border:${mm(0.5)} solid ${c.atrament};padding:${mm(1)} ${mm(1.6)};background:${c.biel};box-shadow:${mm(0.9)} ${mm(0.9)} 0 ${c.atrament}}
.card.back{background:${c.biel};color:${c.atrament}}
.b-logo{position:absolute;left:${mm(10)};top:${mm(9)};width:${mm(32)}}
.b-person{position:absolute;left:${mm(10)};top:${mm(25)}}
.b-name{font:900 ${mm(5.2)}/1.05 'Klamra Display',sans-serif}
.b-role{font:700 ${mm(2.5)}/1.4 'Klamra Mono',monospace;color:${c.grafit};margin-top:${mm(1.2)}}
.b-lines{position:absolute;left:${mm(10)};bottom:${mm(12)};margin:0;padding:0;list-style:none;font:700 ${mm(2.6)}/1.6 'Klamra Mono',monospace}
.b-strip{position:absolute;left:0;right:0;bottom:0;height:${mm(7.2)};background-size:${mm(14)};background-position:0 0;border-top:${mm(0.6)} solid ${c.atrament};background-color:${c.cytryna}}
`;

export const cardScene = side => {
  const body = side === 'front' ? cardFront('screen') : cardBack('screen');
  const ground = side === 'front' ? c.niebo : c.roz;
  const width = 1800;
  const height = 1260;
  return scene(
    `<div style="width:${width}px;height:${height}px;background:${ground};position:relative"><div style="position:absolute;left:217px;top:170px;transform:rotate(${side === 'front' ? -2.4 : 1.8}deg);border:6px solid ${c.atrament};box-shadow:20px 20px 0 ${c.atrament}">${body}</div></div>`,
    { width, height, css: cardCss },
  );
};

export const cardPrintHtml = () =>
  `<!doctype html><html lang="pl"><meta charset="utf-8"><style>${baseCss()}@page{size:91mm 61mm;margin:0}html,body{margin:0}.pg{width:91mm;height:61mm;page-break-after:always;overflow:hidden}${cardCss}</style><body><div class="pg">${cardFront('print')}</div><div class="pg">${cardBack('print')}</div></body></html>`;

const letter = `
<p class="l-date">Wrocław, 6 października</p>
<p class="l-to">${contact.student}<br>kursantka grupy zimowej</p>
<p class="l-subj">Twój pierwszy tydzień w Klamrze</p>
<p>Cześć Julio,</p>
<p>w poniedziałek o 18:00 spotykamy się na pierwszych zajęciach. Wystarczą laptop, przeglądarka i godzina spokoju. Zainstalujemy edytor, napiszemy pierwszy plik i od razu go opublikujemy.</p>
<p>Jeśli coś nie zadziała, napisz wcześniej. Poprawimy to razem, zanim zacznie się kurs.</p>
<p>Do zobaczenia</p>
<p class="l-sign">${contact.person}</p>
`;

export const letterheadBody = mode => `<div class="sheet" style="--mm:${mode === 'print' ? '1mm' : '5.2px'}">
<div class="l-strip" style="background-image:url('${patternUri()}')"></div>
<div class="l-logo">${logoImg('primary', 'width:100%;height:auto')}</div>
<div class="l-addr"><p>${contact.office}</p><p>${contact.phone}<br>${contact.email}</p></div>
<div class="l-body">${letter}</div>
<div class="l-foot"><span>Klamra, szkoła programowania online</span><span>${contact.site}</span></div>
</div>`;

export const letterheadCss = `
.sheet{position:relative;width:${mm(210)};height:${mm(297)};background:${c.biel};color:${c.atrament};overflow:hidden;flex:none}
.l-strip{position:absolute;left:0;top:0;bottom:0;width:${mm(14)};background-size:${mm(28)};background-color:${c.cytryna};border-right:${mm(1)} solid ${c.atrament}}
.l-logo{position:absolute;left:${mm(28)};top:${mm(18)};width:${mm(64)}}
.l-addr{position:absolute;right:${mm(16)};top:${mm(20)};text-align:right;font:700 ${mm(2.8)}/1.55 'Klamra Mono',monospace;color:${c.grafit}}
.l-addr p+p{margin-top:${mm(2.4)}}
.l-body{position:absolute;left:${mm(28)};top:${mm(74)};width:${mm(130)};font:500 ${mm(3.6)}/1.55 'Klamra Text',sans-serif}
.l-body p{margin:0 0 ${mm(3.2)}}
.l-date{font:700 ${mm(3)}/1.4 'Klamra Mono',monospace;color:${c.grafit}}
.l-to{margin-bottom:${mm(8)}!important}
.l-subj{font:900 ${mm(6.4)}/1.1 'Klamra Display',sans-serif;margin-bottom:${mm(5)}!important}
.l-sign{font:900 ${mm(5)}/1.2 'Klamra Display',sans-serif;margin-top:${mm(8)}}
.l-foot{position:absolute;left:${mm(28)};right:${mm(16)};bottom:${mm(12)};display:flex;justify-content:space-between;border-top:${mm(0.8)} solid ${c.atrament};padding-top:${mm(2.4)};font:700 ${mm(2.6)}/1.4 'Klamra Mono',monospace;color:${c.grafit}}
`;

export const letterheadScene = () => {
  const width = 1500;
  const height = 1860;
  return scene(
    `<div style="width:${width}px;height:${height}px;background:${c.mieta};position:relative"><div style="position:absolute;left:204px;top:150px;transform:rotate(-1.4deg);border:6px solid ${c.atrament};box-shadow:20px 20px 0 ${c.atrament}">${letterheadBody('screen')}</div></div>`,
    { width, height, css: letterheadCss.replace(/--mm:[^;]*/g, '') },
  );
};

export const letterheadPrintHtml = () =>
  `<!doctype html><html lang="pl"><meta charset="utf-8"><style>${baseCss()}@page{size:210mm 297mm;margin:0}html,body{margin:0}${letterheadCss}</style><body>${letterheadBody('print')}</body></html>`;

const stickerImg = (sticker, scale = 1, style = '') => {
  const box = stickerBox(sticker);
  return `<div style="width:${box.width * scale}px;height:${box.height * scale}px;${style}">${stickerSvg(sticker).replace('<svg ', `<svg style="width:100%;height:100%;display:block" `)}</div>`;
};

export const stickerSheet = () => {
  const placements = [
    [0, 28, 30, -3], [1, 220, 20, 4], [2, 400, 40, -6],
    [3, 30, 190, 3], [4, 190, 214, -4], [5, 380, 200, 6],
    [6, 24, 340, -2], [7, 214, 330, 3], [8, 420, 360, -5],
    [9, 70, 480, 5], [0, 260, 500, -3], [2, 420, 520, 4],
  ];
  return placements.map(([i, x, y, rot]) => `<div style="position:absolute;left:${x}px;top:${y}px;transform:rotate(${rot}deg)">${stickerImg(stickerSet[i])}</div>`).join('');
};

export const certificate = () => {
  const cert = extras.certificate;
  return `<div class="cert">
<div class="cert-top"><div class="cert-logo">${logoImg('primary', 'width:100%;height:auto')}</div><p class="cert-no">nr KL/2026/014</p></div>
<div class="cert-body">
<p class="cert-kicker">${cert.title}</p>
<h3>${cert.course}</h3>
<p class="cert-lead">${cert.lead}</p>
<p class="cert-name">${contact.student}</p>
<p class="cert-text">${cert.detail}</p>
</div>
<div class="cert-foot"><div><p class="cert-sign">${contact.mentor}</p><p class="cert-role">mentorka kursu</p></div><div><p class="cert-sign">${cert.date}</p><p class="cert-role">data ukończenia</p></div></div>
<div class="cert-seal"><svg viewBox="0 0 120 120" width="120" height="120">${sealMarkup()}</svg></div>
</div>`;
};

const sealMarkup = () => {
  const pts = [];
  for (let i = 0; i < 24; i += 1) {
    const a = (Math.PI * i) / 12 - Math.PI / 2;
    const r = i % 2 === 0 ? 56 : 46;
    pts.push(`${(60 + Math.cos(a) * r).toFixed(1)},${(60 + Math.sin(a) * r).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="${c.atrament}" transform="translate(5 5)"/><polygon points="${pts.join(' ')}" fill="${c.roz}" stroke="${c.atrament}" stroke-width="4"/><text x="60" y="56" text-anchor="middle" font-family="'Klamra Display'" font-weight="900" font-size="15" fill="${c.atrament}">ZALICZONE</text><text x="60" y="76" text-anchor="middle" font-family="'Klamra Mono'" font-weight="800" font-size="13" fill="${c.atrament}">{ ok }</text>`;
};

export const bigBraces = (style = '') => {
  const left = braceGeometry({ x: 130, y: 190, h: 300, depth: 84, arm: 72, stroke: 44, side: 'left' });
  const right = braceGeometry({ x: 310, y: 190, h: 300, depth: 84, arm: 72, stroke: 44, side: 'right' });
  return `<svg viewBox="0 0 440 380" style="${style}" aria-hidden="true"><g fill="none" stroke="${c.atrament}" stroke-width="44" stroke-miterlimit="4"><path d="${left.d}"/><path d="${right.d}"/></g><rect x="190" y="140" width="60" height="100" fill="${c.roz}" stroke="${c.atrament}" stroke-width="8"/></svg>`;
};

export const applicationScene = () => {
  const width = 1900;
  const height = 1180;
  const css = `
.cert{position:absolute;left:80px;top:130px;width:1050px;height:742px;background:${c.biel};border:8px solid ${c.atrament};box-shadow:22px 22px 0 ${c.atrament};transform:rotate(-1.8deg);padding:44px 56px;display:flex;flex-direction:column}
.cert-top{display:flex;justify-content:space-between;align-items:flex-start}
.cert-logo{width:260px}
.cert-no{font:700 17px/1 'Klamra Mono',monospace;border:4px solid ${c.atrament};padding:8px 12px;background:${c.cytryna}}
.cert-body{margin-top:34px}
.cert-kicker{font:800 18px/1 'Klamra Mono',monospace;text-transform:uppercase;letter-spacing:.12em}
.cert h3{font:900 72px/1 'Klamra Display',sans-serif;margin:14px 0 24px}
.cert-lead{font:500 24px/1.4 'Klamra Text',sans-serif;color:${c.grafit}}
.cert-name{font:900 56px/1.1 'Klamra Display',sans-serif;display:inline-block;margin:10px 0 14px;background:${c.cytryna};padding:4px 16px;border:5px solid ${c.atrament};box-shadow:8px 8px 0 ${c.atrament}}
.cert-text{font:500 24px/1.4 'Klamra Text',sans-serif;max-width:700px}
.cert-foot{margin-top:auto;display:flex;gap:60px}
.cert-sign{font:900 26px/1.1 'Klamra Display',sans-serif;border-top:5px solid ${c.atrament};padding-top:10px;min-width:260px}
.cert-role{font:700 15px/1.4 'Klamra Mono',monospace;color:${c.grafit};margin-top:4px}
.cert-seal{position:absolute;right:50px;bottom:70px;transform:rotate(10deg)}
.sheet-a{position:absolute;left:1190px;top:120px;width:610px;height:790px;background:${c.biel};border:8px solid ${c.atrament};box-shadow:22px 22px 0 ${c.atrament};transform:rotate(2.2deg)}
.sheet-a .lab{position:absolute;left:24px;bottom:20px;font:800 17px/1 'Klamra Mono',monospace;text-transform:uppercase;letter-spacing:.1em}
.laptop{position:absolute;left:150px;top:960px;width:1300px;height:330px}
`;
  const body = `<div style="width:${width}px;height:${height}px;background:${c.niebo};position:relative">
<div style="position:absolute;inset:0;background-image:url('${patternUri()}');background-size:320px;opacity:.16"></div>
${certificate()}
<div class="sheet-a">${stickerSheet()}<p class="lab">arkusz naklejek, 12 sztuk</p></div>
<div style="position:absolute;left:100px;top:960px;width:1000px;display:flex;gap:26px;align-items:flex-start"><div style="width:120px;transform:rotate(-4deg)">${logoImg('symbol', 'width:100%;height:auto')}</div><p style="font:900 38px/1.1 'Klamra Display',sans-serif;background:${c.cytryna};border:6px solid ${c.atrament};box-shadow:10px 10px 0 ${c.atrament};padding:14px 18px">Naklej na laptopa. Dostajesz po ukończeniu.</p></div>
</div>`;
  return scene(body, { width, height, css });
};

export const emailSignature = logoSrc => `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:${c.atrament}">
<tr><td style="padding:0 0 10px 0"><img src="${logoSrc}" width="200" alt="Klamra, szkoła programowania online" style="display:block;border:0;width:200px;height:auto"></td></tr>
<tr><td style="font-family:Arial,Helvetica,sans-serif;font-weight:bold;font-size:18px;line-height:1.3;color:${c.atrament}">${contact.person}</td></tr>
<tr><td style="color:${c.grafit};padding-bottom:8px">${contact.role}</td></tr>
<tr><td style="border-top:4px solid ${c.atrament};padding-top:8px">${contact.phone}<br><a href="mailto:${contact.email}" style="color:${c.atrament};text-decoration:underline">${contact.email}</a><br>${contact.site}</td></tr>
<tr><td style="padding-top:8px"><span style="display:inline-block;background:${c.cytryna};color:${c.atrament};border:2px solid ${c.atrament};padding:2px 8px;font-family:'Courier New',monospace;font-weight:bold;font-size:12px">Pierwsza linijka kodu: pierwszego wieczoru.</span></td></tr>
</table>`;

export const emailHtmlFile = () => `<!doctype html>
<html lang="pl">
<head><meta charset="utf-8"><title>Podpis e-mail Klamra</title></head>
<body style="margin:0;padding:16px;background:#ffffff">
${emailSignature('https://adrianturbinski.pl/wzornik/identyfikacja/klamra/logo/png/klamra-horizontal-512.png')}
</body>
</html>
`;

export const emailScene = logoDataUri => {
  const width = 1600;
  const height = 1100;
  return scene(
    `<div style="width:${width}px;height:${height}px;background:${c.roz};position:relative"><div style="position:absolute;left:150px;top:110px;width:1300px;background:${c.biel};border:7px solid ${c.atrament};box-shadow:22px 22px 0 ${c.atrament}"><div style="background:${c.atrament};color:${c.biel};padding:14px 30px;font:700 20px/1.4 'Klamra Mono',monospace;display:flex;gap:12px;align-items:center"><i style="width:18px;height:18px;background:${c.roz};display:block"></i><i style="width:18px;height:18px;background:${c.cytryna};display:block"></i><i style="width:18px;height:18px;background:${c.mieta};display:block"></i><span style="margin-left:18px">Nowa wiadomość</span></div><div style="background:${c.mgla};padding:20px 36px;font:500 20px/1.7 'Klamra Text',sans-serif;border-bottom:5px solid ${c.atrament}"><b>Od:</b> ${contact.person} &lt;${contact.email}&gt;<br><b>Do:</b> ${contact.student}<br><b>Temat:</b> Twój pierwszy tydzień w Klamrze</div><div style="padding:40px 56px 60px;font:500 22px/1.6 'Klamra Text',sans-serif"><p style="margin-bottom:18px">Cześć Julio,</p><p style="margin-bottom:18px">w poniedziałek o 18:00 pierwsze zajęcia. Wystarczy laptop i godzina spokoju.</p><p style="margin-bottom:34px">Do zobaczenia</p><div style="zoom:1.7">${emailSignature(logoDataUri)}</div></div></div></div>`,
    { width, height },
  );
};

export const avatarScene = () =>
  scene(`<div style="width:1080px;height:1080px;background:${c.cytryna};display:grid;place-items:center"><div style="width:620px;margin:-30px 0 0 -30px">${logoImg('symbol', 'width:100%;height:auto')}</div></div>`, { width: 1080, height: 1080 });

const postCss = `
.post{position:relative;width:1080px;height:1350px;overflow:hidden}
.post h2{font:900 150px/.94 'Klamra Display',sans-serif;letter-spacing:-.02em}
.post .body{font:500 52px/1.3 'Klamra Text',sans-serif}
.post .foot{position:absolute;left:80px;bottom:76px;font:800 34px/1.3 'Klamra Mono',monospace}
.box{border:8px solid ${c.atrament};box-shadow:16px 16px 0 ${c.atrament};background:${c.biel}}
.code{font:700 40px/1.5 'Klamra Mono',monospace;padding:34px 40px;white-space:pre}
`;

export const postScene = n => {
  const p = extras.social[n - 1];
  if (n === 1) {
    return scene(
      `<div class="post" style="background:${c.roz}"><div style="position:absolute;left:80px;top:100px;right:80px"><h2>${p.headline}</h2><p class="body" style="margin-top:44px;max-width:760px">${p.body}</p></div><div class="box code" style="position:absolute;left:80px;bottom:200px;transform:rotate(-1.4deg);background:${c.biel}">{\n  linijka: 1,\n  kiedy: "dziś",\n  kursor: █\n}</div><div style="position:absolute;right:70px;top:760px;width:210px;transform:rotate(7deg)">${logoImg('symbol', 'width:100%;height:auto')}</div><p class="foot">${p.foot}</p></div>`,
      { width: 1080, height: 1350, css: postCss },
    );
  }
  if (n === 2) {
    const squares = Array.from({ length: 8 }, (_, i) => `<i style="width:88px;height:88px;border:7px solid ${c.atrament};box-shadow:9px 9px 0 ${c.atrament};background:${[c.cytryna, c.roz, c.niebo, c.biel][i % 4]};display:block"></i>`).join('');
    return scene(
      `<div class="post" style="background:${c.mieta}"><div class="box" style="position:absolute;left:80px;top:90px;width:430px;height:430px;display:grid;place-items:center;transform:rotate(-2deg);background:${c.cytryna}"><span style="font:900 330px/1 'Klamra Display',sans-serif">8</span></div><div style="position:absolute;left:80px;right:80px;top:600px"><h2 style="font-size:112px">${p.headline}</h2><p class="body" style="margin-top:34px">${p.body}</p></div><div style="position:absolute;left:80px;bottom:150px;display:flex;gap:22px">${squares}</div><p class="foot">${p.foot}</p></div>`,
      { width: 1080, height: 1350, css: postCss },
    );
  }
  return scene(
    `<div class="post" style="background:${c.cytryna}"><div style="position:absolute;left:80px;top:90px;right:80px"><h2 style="font-size:132px">${p.headline}</h2></div><div style="position:absolute;left:80px;top:420px;width:560px">${bigBraces('width:100%;height:auto;display:block')}</div><div class="box code" style="position:absolute;right:70px;bottom:190px;width:560px;white-space:normal;font-size:38px;transform:rotate(1.6deg);background:${c.biel}"><b>{</b> otwiera blok<br><b>}</b> zamyka blok<br>reszta to kod</div><p class="foot">${p.foot}</p></div>`,
    { width: 1080, height: 1350, css: postCss },
  );
};

export const ogScene = () => {
  const width = 1200;
  const height = 630;
  return scene(
    `<div style="width:${width}px;height:${height}px;background:${c.cytryna};position:relative"><div style="position:absolute;left:0;right:0;bottom:0;height:130px;background:${c.atrament};background-image:url('${patternUri()}');background-size:130px;border-top:8px solid ${c.atrament}"></div><div style="position:absolute;left:70px;top:110px;width:820px">${logoImg('primary', 'width:100%;height:auto')}</div><p style="position:absolute;left:74px;top:360px;font:800 30px/1.3 'Klamra Mono',monospace;background:${c.biel};border:5px solid ${c.atrament};box-shadow:8px 8px 0 ${c.atrament};padding:10px 16px">Identyfikacja wizualna szkoły programowania online</p><div style="position:absolute;right:60px;top:80px;width:120px;transform:rotate(8deg)">${stickerImg(stickerSet[1], 1)}</div></div>`,
    { width, height },
  );
};
