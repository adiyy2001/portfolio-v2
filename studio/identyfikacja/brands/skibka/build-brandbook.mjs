import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { colorTable, contrastTable } from '../../lib/brand.mjs';
import { htmlToPdf, withBrowser } from '../../lib/browser.mjs';
import { brand, c, content, contact, dataUri, extras, file, baseCss, readPub } from './theme.mjs';
import { iconSvg } from './icons.mjs';
import { patternStrip } from './pattern.mjs';
import { grainDataUri, numStamp, tornClip } from './book-kit.mjs';

const pub = path => join(brand.paths.pub, path);
const jpeg = path => `data:image/jpeg;base64,${readFileSync(pub(path)).toString('base64')}`;
const svgUri = path => dataUri(readPub(path));
const palette = colorTable(brand);
const contrast = contrastTable(brand);
const colorName = id => palette.find(entry => entry.id === id)?.name ?? id;
const pad = n => String(n).padStart(2, '0');

const tones = {
  light: { bg: c.maka, ink: c.zyto, soft: c.popiol, accent: c.skorka, card: c['maka-biala'], stamp: c.skorka, ghost: c.otreby, grain: [0.23, 0.19, 0.16] },
  kraft: { bg: c.kraft, ink: c.zyto, soft: c.zyto, accent: c.zyto, card: c.maka, stamp: c.zyto, ghost: '#bd9f72', grain: [0.23, 0.19, 0.16] },
  dark: { bg: c.zyto, ink: c.maka, soft: c.kraft, accent: c.kraft, card: '#4b4136', stamp: c.kraft, ghost: '#4b4136', grain: [0.98, 0.95, 0.9] },
};
const grains = Object.fromEntries(Object.entries(tones).map(([name, tone]) => [name, grainDataUri({ rgb: tone.grain, alpha: name === 'dark' ? 0.16 : 0.34, seed: name === 'kraft' ? 7 : 4 })]));

const recolored = (variant, color, style = '') => {
  const svg = readPub(file.logoSvg(variant)).replace(/fill="#[0-9a-fA-F]{3,8}"/g, `fill="${color}"`);
  return `<img src="${dataUri(svg)}" alt="" style="${style}">`;
};

const pages = [];
const sections = [];
let seedCounter = 10;
const nextSeed = () => {
  seedCounter += 7;
  return seedCounter;
};
const torn = (amp = 5, nx = 44, ny = 26) => tornClip(nextSeed(), { amp, nx, ny });
const card = (inner, { cls = '', tilt = 0, style = '', amp = 5, nx, ny } = {}) => `<div class="card ${cls}" style="${torn(amp, nx, ny)};transform:rotate(${tilt}deg);${style}">${inner}</div>`;

const page = (kicker, body, { tone = 'light', cls = '', section = null, chrome = true } = {}) => {
  const number = pages.length + 1;
  if (section) sections.push([section, number]);
  const t = tones[tone];
  const stamp = numStamp(pad(number), { size: 112, color: t.stamp, seed: number * 3 + 1, tilt: (number % 5) * 3 - 6 });
  pages.push(
    `<section class="page ${tone} ${cls}" style="--bg:${t.bg};--ink:${t.ink};--soft:${t.soft};--accent:${t.accent};--card:${t.card};background-image:url('${grains[tone]}')">${body}${
      chrome ? `<div class="pstamp">${stamp}</div><footer>Skibka, księga identyfikacji. Projekt przykładowy.</footer>` : ''
    }</section>`,
  );
};

const head = (kicker, title, lead = '') => `<div class="head"><p class="kicker">${kicker}</p><h2>${title}</h2>${lead ? `<p class="lead">${lead}</p>` : ''}</div>`;

const ghost = (tone, style) => `<div class="ghost" style="${style}">${recolored('symbol', tones[tone].ghost, 'width:100%')}</div>`;

page(
  'Okładka',
  `<div class="cover-stamp">${recolored('symbol', c.zyto, 'width:100%')}</div><div class="cover-text"><p class="kicker">Księga identyfikacji wizualnej</p><h1>Skibka</h1><p class="lead">${content.lead}</p><p class="small">Piekarnia na zakwasie, Kraków. Projekt przykładowy: Skibka to zmyślona firma.</p></div><div class="cover-band" style="background:${c.otreby}">${patternStrip({ widthMm: 1920, heightMm: 110, tileMm: 320, id: 'cover-strip' })}</div>`,
  { tone: 'kraft', cls: 'cover', chrome: false },
);

page('Spis treści', '%%TOC%%', { cls: 'toc-page' });

page(
  'Klient i zadanie',
  `${head('Klient i zadanie', 'Piekarnia, która piecze wolno')}<div class="cols"><div class="prose">${content.client.paragraphs.map(text => `<p>${text}</p>`).join('')}</div>${card(`<dl class="facts">${content.client.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`, { cls: 'kraftcard', tilt: 1.2, style: 'padding:44px 48px' })}</div>`,
  { section: 'Klient i zadanie' },
);

page(
  'Kierunek',
  `${ghost('kraft', 'right:-230px;top:40px;width:1050px;transform:rotate(9deg)')}${head('Kierunek', content.direction.title)}<div class="prose wide">${content.direction.paragraphs.map(text => `<p>${text}</p>`).join('')}</div><div class="words">${content.direction.keywords.map((word, i) => card(`<span>${word}</span>`, { cls: 'word', tilt: [-2, 1.4, -0.8][i], amp: 6 })).join('')}</div>`,
  { tone: 'kraft', section: 'Kierunek i strategia' },
);

const valueTones = [c.otreby, c.kraft, c['maka-biala']];
page(
  'Strategia',
  `${head('Strategia', 'Dla kogo i o czym', content.strategy.audience)}<div class="three">${content.strategy.values.map((value, i) => card(`<div class="num">${numStamp(i + 1, { size: 96, color: c.skorka, seed: 40 + i, tilt: i * 5 - 5, fontSize: 46 })}</div><h3>${value.title}</h3><p>${value.text}</p>`, { cls: 'value', tilt: [-1.4, 1, -0.8][i], style: `background:${valueTones[i]}`, amp: 6 })).join('')}</div>`,
);

page(
  'Osobowość',
  `${ghost('dark', 'left:-260px;bottom:-330px;width:1100px;transform:rotate(-8deg)')}${head('Strategia', 'Osobowość i pozycjonowanie')}<div class="cols personality"><div class="prose"><p class="big">Marka jest: ${content.strategy.personality.join(', ')}.</p><p>Unikamy: ${content.strategy.avoids}.</p></div>${card(`<blockquote>${content.strategy.positioning}</blockquote>`, { cls: 'kraftcard', tilt: -1.4, style: 'padding:54px 58px', amp: 6 })}</div>`,
  { tone: 'dark' },
);

const processItems = [...content.process.rejected, { id: 'stamp', title: content.process.chosen.title, text: '', reason: content.process.chosen.reason, thumb: 'figures/direction-stamp.svg', chosen: true }].slice(0, 3);
page(
  'Proces',
  `${head('Proces', 'Trzy kierunki, jeden wybrany', content.process.intro)}<div class="three sheets">${processItems
    .map((item, i) => card(`<img src="${svgUri(item.thumb)}" alt="" class="thumb">${item.chosen ? `<span class="badge">wybrany</span>` : ''}<h3>${item.title}</h3><p>${item.reason}</p>`, { cls: item.chosen ? 'chosen' : '', tilt: [-1.8, 0.9, -0.6][i], style: item.chosen ? `background:${c.kraft}` : '', amp: 6 }))
    .join('')}</div>`,
  { section: 'Proces' },
);

page(
  'Wybrany kierunek',
  `${head('Proces', content.process.chosen.title)}<div class="chosen-grid">${card(`<div class="big-stamp">${recolored('symbol', c.zyto, 'width:100%')}</div>`, { cls: 'whitecard', tilt: -2.4, style: 'padding:30px', amp: 6 })}<ol class="steps">${content.process.refinement.map((step, i) => `<li>${numStamp(i + 1, { size: 100, color: c.zyto, seed: 70 + i, tilt: i * 4 - 4, fontSize: 48 })}<div><h3>${step.title}</h3><p>${step.text}</p></div></li>`).join('')}</ol></div>`,
  { tone: 'kraft' },
);

page(
  'Logo',
  `${ghost('dark', 'right:-260px;top:-40px;width:1180px;transform:rotate(8deg)')}<div class="divider"><p class="kicker">Rozdział</p><h2>Logo</h2><p class="lead">Pieczątka, napis i sześć wariantów. Znak, który ma przetrwać dużą torbę i małą kartę przeglądarki.</p></div>`,
  { tone: 'dark', cls: 'divide', section: 'Logo' },
);

page(
  'Logo główne',
  `${head('Logo', 'Znak główny')}${card(`<div class="stage">${recolored('primary', c.zyto, 'height:380px')}</div>`, { cls: 'whitecard', tilt: -0.6, amp: 6 })}<p class="caption">Pieczątka z bochenkiem i napis Skibka, krój Young Serif z ręcznym kerningiem. Ten znak stosujemy zawsze, gdy jest miejsce.</p>`,
);

const variantTiles = [
  ['primary', 'Główne', c['maka-biala']],
  ['horizontal', 'Poziome', c.otreby],
  ['vertical', 'Pionowe', c.kraft],
  ['symbol', 'Sygnet', c['maka-biala']],
  ['mono-black', 'Jednokolorowe', '#ffffff'],
  ['negative', 'Negatyw', c.zyto],
];
page(
  'Warianty logo',
  `${head('Logo', 'Sześć wariantów')}<div class="tiles">${variantTiles
    .map(([variant, name, bg], i) => card(`<img src="${svgUri(file.logoSvg(variant))}" alt="" style="max-height:180px;max-width:80%"><span class="tag" style="color:${variant === 'negative' ? c.maka : c.zyto}">${name}</span>`, { cls: 'tile', tilt: [-0.8, 0.6, -0.4, 0.7, -0.6, 0.5][i], style: `background:${bg}`, amp: 5 }))
    .join('')}</div>`,
);

page(
  'Kerning',
  `${head('Logo', 'Ręczny kerning', content.process.refinement[0].text)}<div class="pair">${[['Bez korekty', 'figures/wordmark-default.svg', -1], ['Po korekcie', 'figures/wordmark-kerned.svg', 1]].map(([name, path, tilt]) => card(`<img src="${svgUri(path)}" alt=""><span class="tag">${name}</span>`, { cls: 'whitecard figcard', tilt, amp: 6 })).join('')}</div>`,
);

page(
  'Pole ochronne',
  `${head('Logo', 'Pole ochronne i rozmiar minimalny', extras.clearSpace)}<div class="cols clear">${card(`<img src="${svgUri('figures/clearspace.svg')}" alt="" style="width:100%">`, { cls: 'whitecard', tilt: -0.5, style: 'padding:22px' })}<div class="stack"><dl class="facts"><div><dt>Sygnet</dt><dd>${extras.minimum.symbol}</dd></div><div><dt>Pełna pieczątka</dt><dd>${extras.minimum.fullStamp}</dd></div><div><dt>Logo główne</dt><dd>${extras.minimum.primary}</dd></div></dl>${card(`<img src="${svgUri('figures/minimum-sizes.svg')}" alt="" style="width:100%">`, { cls: 'whitecard', tilt: 0.6, style: 'padding:18px 20px' })}</div></div>`,
);

const misuse = [
  ['Nie rozciągamy', 'transform:scaleX(1.5)'],
  ['Nie obracamy', 'transform:rotate(24deg)'],
  ['Nie zmieniamy koloru', 'filter:hue-rotate(150deg) saturate(2)'],
  ['Nie dodajemy cienia', 'filter:drop-shadow(10px 14px 6px rgba(0,0,0,.45))'],
];
page(
  'Czego nie robić',
  `${head('Logo', 'Czego nie robimy')}<div class="four">${misuse.map(([text, style], i) => `<figure class="misuse">${card(`<div>${recolored('symbol', c.skorka, `height:250px;${style}`)}</div>`, { cls: 'whitecard', tilt: [-1, 0.8, -0.6, 1][i], amp: 5 })}<figcaption>${text}</figcaption></figure>`).join('')}</div>`,
);

page(
  'Paleta',
  `${head('Kolor', 'Paleta', 'Dziesięć kolorów z mąki, skórki i żyta. CMYK jest przybliżony, do druku zamów próbę.')}<div class="swatches">${palette.map(entry => `<figure><div class="chip" style="background:${entry.hex};${torn(4, 22, 8)}"></div><figcaption><b>${entry.name}</b><span>${entry.hex}</span><span>${entry.rgbCss}</span><span>${entry.oklchCss}</span><span>${entry.cmykApproxText}</span><em>${entry.role}</em></figcaption></figure>`).join('')}</div>`,
  { section: 'Kolor' },
);

page(
  'Kolor',
  `${head('Kolor', 'Kontrast')}${card(`<table class="contrast"><thead><tr><th>Użycie</th><th>Tekst</th><th>Tło</th><th>Stosunek</th><th>Poziom</th></tr></thead><tbody>${contrast.map(row => `<tr><td>${row.use}</td><td><i style="background:${row.fgHex}"></i>${colorName(row.fg)}</td><td><i style="background:${row.bgHex}"></i>${colorName(row.bg)}</td><td>${row.ratio.toFixed(1).replace('.', ',')}:1</td><td>${row.kind === 'decorative' ? 'dekoracja' : row.level}</td></tr>`).join('')}</tbody></table>`, { cls: 'whitecard', style: 'padding:22px 36px', amp: 5, tilt: 0 })}`,
);

const shares = [['maka', 46], ['zyto', 20], ['kraft', 14], ['skorka', 10], ['lan', 6], ['otreby', 4]];
page(
  'Kolor',
  `${head('Kolor', 'Proporcje użycia', 'Mąka niesie stronę, żyto niesie tekst, kraft i skórka dają ciepło. Zieleń łanu pojawia się rzadko, jak liść w koszu.')}<div class="bar">${shares.map(([id, w]) => `<div style="flex:${w};background:${c[id]};color:${['zyto', 'lan', 'skorka'].includes(id) ? c.maka : c.zyto};${torn(7, 10, 20)}"><span>${colorName(id)} ${w}%</span></div>`).join('')}</div>`,
);

page(
  'Typografia',
  `${head('Typografia', 'Dwa kroje')}<div class="cols faces">${card(`<p class="mega display">Young Serif</p><p class="specimen display">${extras.specimen}</p><p class="small">Nagłówki. Jedna grubość, 400.</p>`, { cls: 'whitecard', tilt: -0.8, style: 'padding:44px 50px' })}${card(`<p class="mega text">Karla</p><p class="specimen text">${extras.specimen}</p><p class="small">Tekst. Grubości 400, 500, 700 i kursywa 400.</p>`, { cls: 'whitecard', tilt: 0.7, style: 'padding:44px 50px' })}</div>`,
  { tone: 'kraft', section: 'Typografia' },
);

page(
  'Typografia',
  `${head('Typografia', 'Skala pisma')}<div class="scale">${extras.typeScale.map(row => `<div><span class="${row.font}" style="font-size:${Math.min(row.size * 2, 112)}px;font-weight:${row.weight ?? 400};line-height:1.1">${row.name}</span><span class="small">${row.size} px, interlinia ${String(row.line).replace('.', ',')}. ${row.use}</span></div>`).join('')}</div>`,
);

page(
  'Typografia',
  `${ghost('dark', 'right:-220px;bottom:-300px;width:900px;transform:rotate(10deg)')}${head('Typografia', 'Polskie znaki', 'Oba kroje mają komplet polskich liter, cudzysłowy drukarskie i kropkę środkową.')}<p class="glyphs display">ĄĆĘŁŃÓŚŹŻ</p><p class="glyphs display low">ąćęłńóśźż</p><p class="glyphs text">0123456789 „”·×</p>`,
  { tone: 'dark' },
);

page(
  'Ikony',
  `${head('Ikony', 'Dwanaście ikon', 'Rysowane kreską 1,6 do 2 px na siatce 24 px, z okrągłymi końcami i lekko falującą linią, jak cięte ręką.')}<div class="icons">${brand.iconNames.map((name, i) => card(`<img src="${dataUri(iconSvg(name, c.zyto))}" alt=""><span class="tag">${name}</span>`, { cls: 'whitecard icon', tilt: [-1, 0.8, -0.5, 1, -0.8, 0.6][i % 6], amp: 4, nx: 20, ny: 14 })).join('')}</div>`,
  { section: 'Ikony, wzór i grafika' },
);

page(
  'Wzór',
  `<div class="field" style="background:${c.otreby}">${patternStrip({ widthMm: 1920, heightMm: 1080, tileMm: 360, id: 'field' })}</div>${card(`${head('Wzór', 'Wzór z odcisków', extras.graphics[0].text)}`, { cls: 'whitecard over', tilt: -1.2, style: 'position:absolute;left:140px;top:150px;width:800px;padding:50px 56px 30px', amp: 6 })}`,
  { cls: 'over-page' },
);

page(
  'Grafika',
  `${head('Grafika', 'Faktura i układ')}<div class="cols graphics"><div class="stack">${extras.graphics.slice(1).map((item, i) => card(`<h3>${item.title}</h3><p>${item.text}</p>`, { cls: 'whitecard', tilt: [-1.4, 1][i], style: 'padding:34px 40px', amp: 6 })).join('')}</div><ol class="rules">${extras.layoutRules.map((rule, i) => `<li>${numStamp(i + 1, { size: 64, color: c.zyto, seed: 90 + i, tilt: i * 4 - 5, fontSize: 30 })}<span>${rule}</span></li>`).join('')}</ol></div>`,
  { tone: 'kraft' },
);

const photoSentences = extras.photoStyle.split('. ').map(s => (s.endsWith('.') ? s : `${s}.`));
page(
  'Zdjęcia',
  `${head('Zdjęcia', 'Styl zdjęć')}<div class="cols photos">${card(`<p class="lead-sentence">${photoSentences[0]}</p><p>${photoSentences.slice(1).join(' ')}</p>`, { cls: 'whitecard prose', tilt: -0.8, style: 'padding:46px 56px', amp: 6 })}<div class="iconfour">${['chleb', 'maka', 'piec', 'zakwas'].map((name, i) => card(`<img src="${dataUri(iconSvg(name, c.zyto))}" alt="">`, { cls: 'kraftcard', tilt: [-2, 1.4, 1, -1.4][i], amp: 5, nx: 20, ny: 14 })).join('')}</div></div>`,
  { section: 'Zdjęcia i ton głosu' },
);

page(
  'Ton głosu',
  `${head('Ton głosu', 'Cztery zasady')}<div class="tone">${content.tone.map((rule, i) => card(`<h3>${rule.title}</h3><p>${rule.text}</p><p class="yes">Tak: ${rule.yes}</p><p class="no">Nie: ${rule.no}</p>`, { cls: 'whitecard', tilt: [-0.6, 0.5, 0.4, -0.5][i], style: 'padding:38px 44px', amp: 5 })).join('')}</div>`,
);

const mock = (path, caption = '', tilt = 0) => card(`<img class="mock" src="${jpeg(path)}" alt="">${caption ? `<p class="small mcap">${caption}</p>` : ''}`, { cls: 'whitecard mockcard', tilt, style: 'padding:14px', amp: 5 });

page(
  'Zastosowania',
  `<div class="divider narrow"><p class="kicker">Rozdział</p><h2>Zastosowania</h2><p class="lead">Wizytówka, papier, torba, e-mail i media. Pieczątka na rzeczach, które piekarnia naprawdę drukuje.</p></div><div class="bagshot">${mock(file.application, '', 2)}</div>`,
  { tone: 'kraft', cls: 'divide', section: 'Zastosowania' },
);

page(
  'Wizytówka i papier',
  `${head('Zastosowania', 'Wizytówka i papier firmowy')}<div class="mocks">${mock(file.cardFront, 'Awers wizytówki: kraft i pieczątka, spad 3 mm', -0.8)}${mock(file.cardBack, 'Rewers: dane na mące, pasek ze wzorem', 0.6)}${mock(file.letterhead, 'Papier firmowy A4: logo główne w nagłówku, pasek ze wzorem z lewej, adres w stopce', -0.5)}</div>`,
);

page(
  'Torba i cyfra',
  `${head('Zastosowania', 'E-mail i etykieta w oknie')}<div class="mocks wide">${mock(file.emailMock, 'Podpis e-mail z poziomym logo', -0.6)}${mock(file.application, 'Torba kraft i karta z dzisiejszymi bochenkami', 0.6)}</div>`,
);

const frames = [
  ['0,1 s', recolored('symbol', c.zyto, 'width:92%;transform:scale(1.25) rotate(-8deg)'), 'Pieczątka zbliża się do papieru'],
  ['1,0 s', recolored('symbol', c.zyto, 'width:92%;transform:rotate(-3deg)'), 'Odcisk, tusz się rozlewa'],
  ['3,0 s', recolored('vertical', c.zyto, 'width:78%'), 'Pionowe logo na papierze'],
];
page(
  'Animacja i kontakt',
  `${head('Animacja', 'Pieczątka opada na papier', extras.animation)}<div class="end"><div class="frames">${frames.map(([time, art, text], i) => `<figure>${card(`<div class="frame">${art}</div>`, { cls: 'whitecard', tilt: [-1.2, 0.8, -0.6][i], amp: 5 })}<figcaption><b>${time}</b> ${text}</figcaption></figure>`).join('')}</div>${card(`<dl class="facts"><div><dt>Adres</dt><dd>${contact.street}, ${contact.city}</dd></div><div><dt>Telefon</dt><dd>${contact.phone}</dd></div><div><dt>E-mail</dt><dd>${contact.email}</dd></div></dl>`, { cls: 'kraftcard', tilt: 1, style: 'padding:36px 44px', amp: 6 })}</div>`,
  { tone: 'dark', section: 'Animacja i kontakt' },
);

const toc = `${head('Spis treści', 'Co jest w środku')}<ol class="toc">${sections
  .map(([name, number], i) => `<li style="${torn(4, 30, 10)};transform:rotate(${[-0.6, 0.5, -0.4, 0.6][i % 4]}deg);background:${i % 2 ? c.otreby : c.kraft}">${numStamp(pad(number), { size: 84, color: c.zyto, seed: 120 + i, tilt: (i % 3) * 3 - 3, fontSize: 32 })}<span>${name}</span></li>`)
  .join('')}</ol>`;
pages[1] = pages[1].replace('%%TOC%%', toc);
const total = pages.length;
if (total < 20 || total > 30) throw new Error(`expected 20 to 30 pages, built ${total}`);

const css = `
${baseCss()}
@page{size:1920px 1080px;margin:0}
html,body{margin:0}
.page{position:relative;width:1920px;height:1080px;overflow:hidden;page-break-after:always;break-after:page;padding:100px 140px 130px;z-index:0;background-color:var(--bg);color:var(--ink);background-size:360px}
.page footer{position:absolute;left:140px;bottom:46px;font:500 22px/1 'Skibka Text';color:var(--soft)}
.pstamp{position:absolute;right:52px;bottom:26px}
.nstamp{position:relative;display:inline-grid;place-items:center;flex:none}
.nstamp svg{position:absolute;inset:0}
.nstamp b{position:relative;font:400 40px/1 'Skibka Display'}
.ghost{position:absolute;z-index:-1}
.kicker{font:700 24px/1 'Skibka Text';letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:22px}
h2{font-size:88px;line-height:1.02;margin-bottom:26px}
h3{font-size:42px;line-height:1.1;margin-bottom:14px}
.lead{font:500 32px/1.45 'Skibka Text';max-width:1300px}
.head{margin-bottom:36px;position:relative}
.small{font:500 24px/1.5 'Skibka Text';color:var(--soft)}
.card{background:var(--card);color:var(--ink);position:relative}
.card.whitecard{background:${c['maka-biala']};color:${c.zyto}}
.card.kraftcard{background:${c.kraft};color:${c.zyto}}
.page.dark .card.whitecard{background:${c.maka}}
.cols{display:grid;grid-template-columns:1.2fr 1fr;gap:90px;align-items:start;position:relative}
.prose p{font:400 33px/1.55 'Skibka Text';margin-bottom:22px;max-width:900px}
.prose.wide p{max-width:1100px;font-size:31px}
.big{font:400 58px/1.2 'Skibka Display'!important}
.facts{margin:0}
.facts div{border-top:3px solid currentColor;padding:18px 0 22px}
.facts dt{font:700 22px/1 'Skibka Text';letter-spacing:.12em;text-transform:uppercase;color:${c.skorka};margin-bottom:10px}
.page.dark .facts dt{color:${c.kraft}}
.card.kraftcard .facts dt{color:${c.zyto}}
.facts dd{margin:0;font:400 31px/1.35 'Skibka Text'}
blockquote{margin:0;font:400 54px/1.28 'Skibka Display'}
.three{display:grid;grid-template-columns:repeat(3,1fr);gap:44px;position:relative}
.value{padding:44px 46px 48px;min-height:560px}
.value .num{margin:0 0 26px;display:block}
.value h3{font-size:52px}
.value p{font:400 35px/1.5 'Skibka Text'}
.four{display:grid;grid-template-columns:repeat(4,1fr);gap:36px}
.sheets .card{padding:36px 38px 40px}
.sheets p{font:400 25px/1.45 'Skibka Text'}
.thumb{height:170px;display:block;margin-bottom:22px;background:${c.maka};width:100%;object-fit:contain;padding:10px}
.badge{position:absolute;right:30px;top:30px;background:${c.zyto};color:${c.maka};font:700 22px/1 'Skibka Text';letter-spacing:.1em;text-transform:uppercase;padding:10px 16px;transform:rotate(4deg)}
.words{display:flex;gap:34px;margin-top:40px;position:relative}
.word{padding:6px 40px 18px;background:${c.zyto}!important;color:${c.kraft}!important}
.word span{font:400 130px/1.1 'Skibka Display'}
.personality .prose p{max-width:760px}
.chosen-grid{display:grid;grid-template-columns:520px 1fr;gap:90px;align-items:center}
.big-stamp{width:100%}
.steps{list-style:none;margin:0;padding:0;display:grid;gap:40px}
.steps li{display:grid;grid-template-columns:100px 1fr;gap:34px;align-items:start}
.steps h3{margin-bottom:8px}
.steps p{font:400 30px/1.45 'Skibka Text'}
.divide .divider{position:relative;max-width:900px;padding-top:150px}
.divide .divider.narrow{max-width:none;padding-top:0}
.divide .divider.narrow .lead{max-width:760px}
.divide .divider h2{font-size:260px;line-height:.9;margin-bottom:34px}
.divide .divider.narrow h2{font-size:140px;white-space:nowrap}
.bagshot{position:absolute;right:56px;top:310px;width:840px}
.bagshot .mock{height:auto!important;width:100%!important;object-fit:contain}
.stage{height:520px;display:grid;place-items:center}
.caption{font:500 30px/1.5 'Skibka Text';margin-top:34px;max-width:1300px}
.tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:34px}
.tile{height:300px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px}
.tag{font:700 22px/1 'Skibka Text';letter-spacing:.04em}
.tile .tag{position:absolute;left:28px;bottom:20px}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:44px}
.figcard{height:440px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px}
.figcard img{width:78%}
.clear{grid-template-columns:1.45fr 1fr;gap:70px}
.clear .stack{display:grid;gap:30px}
.misuse{margin:0}
.misuse .card div{height:460px;display:grid;place-items:center;overflow:hidden}
.misuse figcaption{font:500 28px/1.3 'Skibka Text';margin-top:18px}
.swatches{display:grid;grid-template-columns:repeat(5,1fr);gap:20px 26px}
.swatches figure{margin:0}
.chip{height:64px}
.swatches figcaption{display:grid;gap:2px;padding-top:10px;font:400 20px/1.25 'Skibka Text'}
.swatches b{font:400 31px/1.1 'Skibka Display'}
.swatches em{font:500 20px/1.25 'Skibka Text';color:${c.popiol};font-style:normal}
.contrast{width:100%;border-collapse:collapse;font:400 22px/1.15 'Skibka Text'}
.contrast th{text-align:left;font:700 18px/1 'Skibka Text';letter-spacing:.1em;text-transform:uppercase;padding:0 10px 10px;color:${c.skorka}}
.contrast td{padding:4px 10px;border-top:2px solid ${c.otreby}}
.contrast i{display:inline-block;width:20px;height:20px;border-radius:50%;margin-right:10px;vertical-align:-3px;border:2px solid ${c.zyto}}
.bar{display:flex;height:520px}
.bar div{display:flex;align-items:flex-end;padding:26px;font:700 26px/1 'Skibka Text'}
.faces .card{min-height:620px}
.mega{font-size:130px;line-height:1;margin-bottom:36px}
.specimen{font-size:50px;line-height:1.3;margin-bottom:30px}
.display{font-family:'Skibka Display',serif;font-weight:400}
.text{font-family:'Skibka Text',sans-serif}
.scale{display:grid;gap:30px}
.scale div{display:grid;grid-template-columns:620px 1fr;align-items:baseline;gap:40px;border-top:3px solid ${c.mioz};padding-top:22px}
.scale .small{font-size:28px}
.glyphs{font-size:170px;line-height:1.1;margin:0;position:relative}
.glyphs.low{margin-bottom:10px}
.glyphs.text{font-size:110px;font-weight:500;color:${c.kraft}}
.icons{display:grid;grid-template-columns:repeat(6,1fr);gap:30px}
.icon{height:260px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px}
.icon img{width:116px}
.icon .tag{font-size:22px}
.over-page .field{position:absolute;inset:0}
.over-page footer{background:${c['maka-biala']};padding:8px 14px;left:126px;bottom:34px}
.over h2{font-size:80px}
.stack{display:grid;gap:30px}
.graphics .stack .card h3{font-size:46px}
.graphics .stack .card p{font:400 32px/1.5 'Skibka Text'}
.rules{margin:0;padding:0;list-style:none;display:grid;gap:40px}
.rules li{display:grid;grid-template-columns:64px 1fr;gap:26px;align-items:center;border-top:3px solid ${c.zyto};padding-top:20px}
.rules span{font:400 34px/1.4 'Skibka Text'}
.photos{grid-template-columns:1.35fr 1fr}
.photos .card p{font:400 31px/1.55 'Skibka Text'}
.photos .card .lead-sentence{font:400 46px/1.2 'Skibka Display';margin-bottom:24px}
.iconfour{display:grid;grid-template-columns:1fr 1fr;gap:34px}
.iconfour .card{display:grid;place-items:center;height:250px}
.iconfour img{width:130px}
.tone{display:grid;grid-template-columns:1fr 1fr;gap:40px 54px}
.tone h3{font-size:40px;margin-bottom:8px}
.tone p{font:400 30px/1.4 'Skibka Text'}
.tone .yes{color:${c.lan};font-weight:700;margin-top:12px}
.tone .no{color:${c.popiol};text-decoration:line-through;text-decoration-color:${c.skorka}}
.mocks{display:flex;justify-content:space-between;gap:30px;align-items:flex-start}
.mockcard{flex:1;min-width:0}
.mocks .mock{display:block;width:100%;height:470px;object-fit:contain;background:${c.otreby}}
.mocks .mcap{margin-top:14px;padding:0 6px 6px;color:${c.popiol}}
.mocks.wide .mock{height:560px}
.mocks.wide{align-items:stretch}
.end{display:grid;grid-template-columns:1.6fr 1fr;gap:70px;align-items:center}
.frames{display:grid;grid-template-columns:repeat(3,1fr);gap:30px}
.frames figure{margin:0}
.frame{height:470px;display:grid;place-items:center;overflow:hidden}
.frames figcaption{font:500 24px/1.35 'Skibka Text';margin-top:16px;color:${c.kraft}}
.frames b{color:${c.maka}}
.toc{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:20px 56px}
.toc li{display:flex;align-items:center;gap:26px;padding:10px 30px 10px 22px;height:104px;font:400 44px/1 'Skibka Display'}
.cover{padding:0}
.cover-stamp{position:absolute;left:140px;top:100px;width:700px;transform:rotate(-5deg)}
.cover-text{position:absolute;left:940px;top:200px;width:880px}
.cover-text h1{font-size:240px;line-height:.95;margin:20px 0 30px}
.cover-text .lead{max-width:800px}
.cover-text .small{margin-top:30px}
.cover-band{position:absolute;left:0;right:0;bottom:0;height:110px}
`;

const html = `<!doctype html><html lang="pl"><meta charset="utf-8"><title>Skibka, księga identyfikacji</title><style>${css}</style><body>${pages.join('')}</body></html>`;

await withBrowser(browser => htmlToPdf(browser, { outDir: brand.paths.out, name: 'brandbook', html, out: pub(file.brandbook), width: 1920, height: 1080 }));
console.log(`  ${file.brandbook} (${pages.length} pages)`);
