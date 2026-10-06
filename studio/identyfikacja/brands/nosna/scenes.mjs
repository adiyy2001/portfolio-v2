import { dayOf, markBody, markBox, primaryLockup } from '../../../../sites/src/identyfikacja/nosna/lib/field.ts';
import { c, contact, dataUri, extras, file, readPub, scene } from './theme.mjs';
import { primaryWord } from './logo-parts.mjs';

const word = primaryWord();

export const markSvg = (variant, colors, style = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${markBox.join(' ')}" style="display:block;${style}">${markBody(variant, colors)}</svg>`;

export const lockSvg = (variant, colors, style = '') => {
  const lock = primaryLockup(variant, colors, word);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${lock.viewBox.join(' ')}" style="display:block;${style}">${lock.body}</svg>`;
};

export const horizontalSvg = (ink, style = '') => {
  const svg = readPub(file.logoSvg('horizontal'));
  return svg.replace('<svg ', `<svg style="display:block;${style}" `).replaceAll(c.atrament.toLowerCase(), ink).replaceAll(c.atrament, ink);
};

const piatek = { day: 'piatek', stage: 'przedzalnia', bpm: 100 };
const tkalnia = { day: 'sobota', stage: 'tkalnia', bpm: 128 };
const farb = { day: 'niedziela', stage: 'farbiarnia', bpm: 92 };
const wyk = { day: 'sobota', stage: 'wykonczalnia', bpm: 146 };
const dayColor = id => dayOf(id).color;

const mm = n => `calc(${n} * var(--mm))`;

export const cardFront = mode => `<div class="card front" style="--mm:${mode === 'print' ? '1mm' : '15px'}">
<div class="ext"></div>
<div class="lock">${lockSvg(piatek, { thread: c.piatek, ink: c.kosc }, 'width:100%;height:auto')}</div>
</div>`;

export const cardBack = mode => `<div class="card back" style="--mm:${mode === 'print' ? '1mm' : '15px'}">
<div class="b-mark">${markSvg(piatek, { thread: c.piatek, ink: c.atrament }, 'width:100%;height:auto')}</div>
<div class="b-person"><p class="b-name">${contact.person}</p><p class="b-role">${contact.role}</p></div>
<ul class="b-lines"><li>${contact.phone}</li><li>${contact.email}</li><li>${contact.street}, ${contact.city}</li></ul>
<div class="b-rule"></div>
<div class="b-ring"></div>
</div>`;

export const cardCss = `
.card{position:relative;width:${mm(91)};height:${mm(61)};overflow:hidden;flex:none}
.card.front{background:${c.atrament}}
.card .ext{position:absolute;left:0;top:${mm(22.8)};width:${mm(9)};height:${mm(1)};background:${c.kosc}}
.card .lock{position:absolute;left:${mm(9)};top:${mm(9)};width:${mm(66)}}
.card.back{background:${c.papier};color:${c.atrament}}
.b-mark{position:absolute;left:${mm(9)};top:${mm(8)};width:${mm(26)}}
.b-person{position:absolute;left:${mm(9)};top:${mm(21)}}
.b-name{font:800 ${mm(5.2)}/1.1 'Nosna Display',sans-serif}
.b-role{font:500 ${mm(2.2)}/1.4 'Nosna Mono',monospace;color:${c.grafit};margin-top:${mm(1)}}
.b-lines{position:absolute;left:${mm(9)};bottom:${mm(13)};margin:0;padding:0;list-style:none;font:500 ${mm(2.1)}/1.7 'Nosna Mono',monospace}
.b-rule{position:absolute;left:0;bottom:${mm(8)};width:${mm(80)};height:${mm(1)};background:${c.atrament}}
.b-ring{position:absolute;left:${mm(80)};bottom:${mm(6.3)};width:${mm(4.4)};height:${mm(4.4)};border:${mm(0.9)} solid ${c.atrament};border-radius:50%}
`;

const tableCss = `.table{position:relative;overflow:hidden;background:${c.mgla}}.shadow{box-shadow:0 18px 30px -12px rgba(14,14,18,.35),0 2px 4px rgba(14,14,18,.2)}`;

export const cardScene = side =>
  scene(`<div class="table" style="width:1800px;height:1260px"><div class="shadow" style="position:absolute;left:217px;top:170px">${side === 'front' ? cardFront('screen') : cardBack('screen')}</div></div>`, {
    width: 1800,
    height: 1260,
    css: tableCss + cardCss,
  });

export const cardPrintHtml = () => scene(`<div class="pg">${cardFront('print')}</div><div class="pg">${cardBack('print')}</div>`, {
  width: 344,
  height: 231,
  css: `@page{size:91mm 61mm;margin:0}html,body{width:auto;height:auto;overflow:visible}.pg{width:91mm;height:61mm;page-break-after:always;overflow:hidden}${cardCss}`,
});

const letter = `
<p class="l-date mono">Łódź, 6 października</p>
<p class="l-to">Studio Kablówka<br>ul. Piotrkowska 120<br>90-006 Łódź</p>
<p class="l-subj">Zaproszenie do programu Tkalni</p>
<p>Dzień dobry,</p>
<p>zapraszamy Państwa do udziału w sobotnim programie Tkalni. Zaplanowaliśmy koncert na osiem syntezatorów modularnych i szukamy zespołu, który otworzy wieczór o 22:00.</p>
<p>Scena ma tempo wyjściowe 128 BPM, ale program możecie Państwo ustawić po swojemu. Potrzebne jest tylko ziarno: trzy słowa, z których zrobimy Waszą wersję znaku.</p>
<p>Prosimy o odpowiedź do końca miesiąca.</p>
<p>Z pozdrowieniami</p>
<p class="l-sign">${contact.person}</p>
`;

export const letterheadBody = mode => `<div class="sheet" style="--mm:${mode === 'print' ? '1mm' : '5.2px'}">
<div class="l-logo">${horizontalSvg(c.atrament, 'width:100%;height:auto')}</div>
<div class="l-addr mono"><p>${contact.street}<br>${contact.city}</p><p>${contact.phone}<br>${contact.email}</p></div>
<div class="l-carrier"></div>
<div class="l-ring"></div>
<div class="l-body">${letter}</div>
<div class="l-foot mono"><span>Nośna, festiwal sztuki nowych mediów i muzyki elektronicznej</span><span>${contact.web}</span></div>
</div>`;

export const letterheadCss = `
.sheet{position:relative;width:${mm(210)};height:${mm(297)};background:${c.papier};color:${c.atrament};overflow:hidden;flex:none}
.l-logo{position:absolute;left:${mm(20)};top:${mm(14)};width:${mm(58)}}
.l-addr{position:absolute;right:${mm(20)};top:${mm(14)};text-align:right;font:500 ${mm(2.4)}/1.6 'Nosna Mono',monospace;color:${c.grafit}}
.l-addr p+p{margin-top:${mm(2)}}
.l-carrier{position:absolute;left:0;top:${mm(37)};width:${mm(196)};height:${mm(1)};background:${c.atrament}}
.l-ring{position:absolute;left:${mm(196)};top:${mm(34.7)};width:${mm(5.6)};height:${mm(5.6)};border:${mm(1)} solid ${c.atrament};border-radius:50%}
.l-body{position:absolute;left:${mm(20)};top:${mm(60)};width:${mm(118)};font:500 ${mm(3.4)}/1.6 'Nosna Display',sans-serif}
.l-body p{margin:0 0 ${mm(3.2)}}
.l-date{color:${c.grafit};font-size:${mm(2.6)}}
.l-to{margin-bottom:${mm(9)}!important}
.l-subj{font:800 ${mm(5.4)}/1.15 'Nosna Display',sans-serif!important;margin-bottom:${mm(5)}!important}
.l-sign{font:700 ${mm(4)}/1.2 'Nosna Display',sans-serif!important;margin-top:${mm(7)}}
.l-foot{position:absolute;left:${mm(20)};right:${mm(20)};bottom:${mm(11)};display:flex;justify-content:space-between;gap:${mm(6)};border-top:${mm(0.3)} solid ${c.atrament};padding-top:${mm(2.4)};font:500 ${mm(2.1)}/1.4 'Nosna Mono',monospace;color:${c.grafit}}
`;

export const letterheadScene = () =>
  scene(`<div class="table" style="width:1500px;height:1860px"><div class="shadow" style="position:absolute;left:204px;top:150px">${letterheadBody('screen')}</div></div>`, {
    width: 1500,
    height: 1860,
    css: tableCss + letterheadCss.replace(/--mm:[^;]*/g, ''),
  });

export const letterheadPrintHtml = () => scene(letterheadBody('print'), {
  width: 794,
  height: 1123,
  css: `@page{size:210mm 297mm;margin:0}html,body{width:auto;height:auto;overflow:visible}${letterheadCss}`,
});

const posterData = [
  { variant: piatek, day: 'Piątek', stage: 'Przędzalnia', ground: c.piatek, ink: c.atrament, thread: c.atrament, text: c.atrament, lines: ['18:00 instalacja na 32 szpule', '20:00 warsztat nitek', '21:30 pokaz Szpulomat'] },
  { variant: tkalnia, day: 'Sobota', stage: 'Tkalnia', ground: c.atrament, ink: c.kosc, thread: c.sobota, text: c.kosc, lines: ['20:00 otwarcie sceny', '22:00 koncert na 8 syntezatorów', '00:30 set 128 BPM'] },
  { variant: farb, day: 'Niedziela', stage: 'Farbiarnia', ground: c.kosc, ink: c.atrament, thread: c.niedziela, text: c.atrament, lines: ['16:00 projekcje wideo', '18:30 spotkanie z artystami', '21:00 finał w trzech halach'] },
];

const poster = (item, width) => `<div class="poster shadow" style="width:${width}px;height:${Math.round(width * 1.414)}px;background:${item.ground};color:${item.text}">
<p class="p-day">${item.day}</p>
<p class="p-stage mono">${item.stage}</p>
<div class="p-field">${markSvg(item.variant, { thread: item.thread, ink: item.ink }, 'width:100%;height:auto')}</div>
<ul class="p-lines mono">${item.lines.map(line => `<li>${line}</li>`).join('')}</ul>
<p class="p-name">Nośna</p>
</div>`;

const bars = Array.from({ length: 48 }, (_, i) => `<i style="width:${[2, 4, 3, 6, 2, 5][i % 6]}px;margin-right:${[3, 2, 4][i % 3]}px"></i>`).join('');

export const applicationScene = () => {
  const css = `
.poster{position:absolute;overflow:hidden}
.poster .p-day{position:absolute;left:34px;top:30px;font:800 50px/1 'Nosna Display',sans-serif;white-space:nowrap}
.poster .p-stage{position:absolute;left:36px;top:96px;font-size:20px}
.poster .p-field{position:absolute;left:12px;right:-34px;top:224px}
.poster .p-lines{position:absolute;left:36px;bottom:96px;margin:0;padding:0;list-style:none;font-size:16px;line-height:1.7}
.poster .p-name{position:absolute;left:34px;bottom:30px;font:800 44px/1 'Nosna Display',sans-serif}
.pass{position:absolute;left:1680px;top:330px;width:360px;height:600px;background:${c.papier};color:${c.atrament};transform:rotate(-2deg)}
.pass .hole{position:absolute;left:140px;top:26px;width:80px;height:16px;background:${c.mgla};border:3px solid ${c.atrament}}
.pass .lock{position:absolute;left:34px;top:84px;width:292px}
.pass .kind{position:absolute;left:34px;top:312px;font:800 27px/1 'Nosna Display',sans-serif;white-space:nowrap}
.pass .days{position:absolute;left:34px;right:34px;top:376px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.pass .days span{height:46px;display:grid;place-items:center;font:700 18px/1 'Nosna Mono',monospace;color:${c.atrament}}
.pass .code{position:absolute;left:34px;right:34px;bottom:104px;display:flex;align-items:stretch;height:56px;overflow:hidden}
.pass .code i{display:block;background:${c.atrament}}
.pass .meta{position:absolute;left:34px;bottom:28px;font:500 16px/1.6 'Nosna Mono',monospace;color:${c.grafit}}
.strap{position:absolute;left:1832px;top:-40px;width:56px;height:380px;background:${c.atrament};transform:rotate(-2deg);overflow:hidden}
.strap p{margin:14px 0 0;writing-mode:vertical-rl;color:${c.kosc};font:800 30px/56px 'Nosna Display',sans-serif;letter-spacing:.1em;white-space:nowrap}
.cap{position:absolute;left:70px;top:1010px;font:500 22px/1.5 'Nosna Mono',monospace;color:${c.grafit}}
`;
  const width = 500;
  const posters = posterData.map((item, i) => `<div style="position:absolute;left:${70 + i * 520}px;top:${i === 1 ? 210 : 150}px;width:${width}px;height:${Math.round(width * 1.414)}px">${poster(item, width)}</div>`).join('');
  const body = `<div class="table" style="width:2100px;height:1100px">${posters}
<div class="strap"><p>NOŚNA NOŚNA NOŚNA NOŚNA NOŚNA</p></div>
<div class="pass shadow"><div class="hole"></div><div class="lock">${lockSvg(piatek, { thread: c.piatek, ink: c.atrament }, 'width:100%;height:auto')}</div><p class="kind">Karnet 3 dni</p>
<div class="days"><span style="background:${c.piatek}">PT</span><span style="background:${c.sobota}">SB</span><span style="background:${c.niedziela}">ND</span></div>
<div class="code">${bars}</div><p class="meta">Wstęp na cztery hale<br>${contact.street}, Łódź</p></div>
<p class="cap">Plakaty dni i identyfikator na smyczy.</p></div>`;
  return scene(body, { width: 2100, height: 1100, css: tableCss + css });
};

const emailSignature = logoSrc => `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:${c.atrament}">
<tr><td style="padding:0 0 10px 0;border-bottom:3px solid ${c.atrament}"><img src="${logoSrc}" alt="Nośna" width="200" style="display:block;border:0;width:200px;height:auto"></td></tr>
<tr><td style="padding:10px 0 0 0"><strong style="font-size:15px">${contact.person}</strong><br>${contact.role}<br>${contact.phone}<br><a href="mailto:${contact.email}" style="color:${c['piatek-tekst']}">${contact.email}</a><br>${contact.street}, ${contact.city}</td></tr>
</table>`;

export const emailLogoUrl = 'https://adrianturbinski.pl/wzornik/identyfikacja/nosna/logo/png/nosna-horizontal-512.png';

export const emailHtmlFile = () => `<!doctype html>
<html lang="pl"><head><meta charset="utf-8"><title>Podpis e-mail Nośnej</title></head>
<body style="margin:0;padding:24px;background:#ffffff">
${emailSignature(emailLogoUrl)}
</body></html>
`;

export const emailScene = logoDataUri =>
  scene(`<div class="table" style="width:1600px;height:1100px"><div class="shadow" style="position:absolute;left:150px;top:110px;width:1300px;background:#fff;padding:0 0 60px"><div style="background:${c.mgla};padding:22px 36px;font:500 20px/1.6 'Nosna Mono',monospace;color:${c.atrament}"><b>Od:</b> ${contact.person} &lt;${contact.email}&gt;<br><b>Do:</b> Studio Kablówka<br><b>Temat:</b> Zaproszenie do programu Tkalni</div><div style="padding:40px 56px;font:500 22px/1.6 'Nosna Display',sans-serif"><p style="margin-bottom:18px">Dzień dobry,</p><p style="margin-bottom:18px">w załączniku zaproszenie na sobotni wieczór w Tkalni. Prosimy o odpowiedź do końca miesiąca.</p><p style="margin-bottom:34px">Z pozdrowieniami</p><div style="zoom:1.7">${emailSignature(logoDataUri)}</div></div></div></div>`, {
    width: 1600,
    height: 1100,
    css: tableCss,
  });

export const avatarScene = () =>
  scene(`<div style="width:1080px;height:1080px;background:${c.atrament};display:grid;place-items:center">${markSvg(piatek, { thread: c.piatek, ink: c.kosc }, 'width:840px;height:auto')}</div>`, {
    width: 1080,
    height: 1080,
  });

const postCss = `
.post{position:relative;width:1080px;height:1350px;overflow:hidden}
.post h2{font:800 128px/1 'Nosna Display',sans-serif;letter-spacing:-.02em;white-space:nowrap}
.post .stage{font:700 34px/1.2 'Nosna Mono',monospace}
.post .body{font:700 50px/1.25 'Nosna Display',sans-serif}
.post .foot{position:absolute;left:80px;bottom:70px;font:500 30px/1.3 'Nosna Mono',monospace}
.post .name{position:absolute;right:80px;bottom:62px;width:260px}
`;

export const postScene = n => {
  const p = extras.social[n - 1];
  const grounds = [
    { ground: c.piatek, text: c.atrament, thread: c.atrament, ink: c.atrament, variant: piatek, label: 'Przędzalnia, 100 BPM' },
    { ground: c.atrament, text: c.kosc, thread: c.sobota, ink: c.kosc, variant: tkalnia, label: 'Tkalnia, 128 BPM' },
    { ground: c.kosc, text: c.atrament, thread: c.niedziela, ink: c.atrament, variant: { day: 'niedziela', stage: 'wykonczalnia', bpm: 146 }, label: 'Wykończalnia, 146 BPM' },
  ];
  const g = grounds[n - 1];
  const name = lockSvg(piatek, { thread: g.thread, ink: g.ink }, 'width:100%;height:auto');
  return scene(
    `<div class="post" style="background:${g.ground};color:${g.text}"><div style="position:absolute;left:80px;top:90px"><h2>${p.headline}</h2><p class="stage" style="margin-top:22px">${g.label}</p></div><div style="position:absolute;left:-40px;right:-110px;top:340px">${markSvg(g.variant, { thread: g.thread, ink: g.ink }, 'width:100%;height:auto')}</div><div style="position:absolute;left:80px;right:80px;top:900px"><p class="body" style="max-width:780px">${p.body}</p></div><p class="foot">${p.foot}</p><div class="name">${name}</div></div>`,
    { width: 1080, height: 1350, css: postCss, background: g.ground },
  );
};

export const ogScene = () =>
  scene(`<div style="position:relative;width:1200px;height:630px;background:${c.atrament}"><div style="position:absolute;left:70px;top:70px;width:660px">${lockSvg(piatek, { thread: c.piatek, ink: c.kosc }, 'width:100%;height:auto')}</div><div style="position:absolute;right:-420px;top:48px;width:760px">${markSvg(tkalnia, { thread: c.sobota, ink: c.kosc }, 'width:100%;height:auto')}</div><p style="position:absolute;left:70px;bottom:56px;font:500 24px/1.45 'Nosna Mono',monospace;color:${c.kosc}">Identyfikacja wizualna festiwalu sztuki nowych mediów</p></div>`, {
    width: 1200,
    height: 630,
    background: c.atrament,
  });

export { dataUri, dayColor };
