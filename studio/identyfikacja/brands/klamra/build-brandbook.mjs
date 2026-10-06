import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { colorTable, contrastTable } from '../../lib/brand.mjs';
import { htmlToPdf, withBrowser } from '../../lib/browser.mjs';
import { brand, c, content, contact, dataUri, extras, file, baseCss, readPub } from './theme.mjs';
import { iconSvg } from './icons.mjs';
import { stickerSet, stickerSvg, stickerBox } from '../../../../sites/src/identyfikacja/klamra/lib/stickers.ts';

const pub = path => join(brand.paths.pub, path);
const raster = (path, type) => `data:${type};base64,${readFileSync(pub(path)).toString('base64')}`;
const jpeg = path => raster(path, 'image/jpeg');
const png = path => raster(path, 'image/png');
const svgUri = path => dataUri(readPub(path));
const palette = colorTable(brand);
const contrast = contrastTable(brand);
const colorName = id => palette.find(entry => entry.id === id)?.name ?? id;
const total = 28;

const sheets = [];
const sheet = (title, body, { tone = 'light', kicker = '' } = {}) => {
  const number = sheets.length + 1;
  sheets.push(
    `<section class="page ${tone}"><header><span class="tag">${kicker || title}</span><span class="tag num">${String(number).padStart(2, '0')} / ${total}</span></header>${body}<footer>Klamra, księga identyfikacji. Projekt przykładowy.</footer></section>`,
  );
};

const titleBlock = (kicker, title, lead = '') =>
  `<div class="head"><p class="kicker">${kicker}</p><h2>${title}</h2>${lead ? `<p class="lead">${lead}</p>` : ''}</div>`;

const stickerImg = (index, width) => {
  const sticker = stickerSet[index];
  const box = stickerBox(sticker);
  return `<div style="width:${width}px;height:${(width * box.height) / box.width}px">${stickerSvg(sticker).replace('<svg ', '<svg style="width:100%;height:100%;display:block" ')}</div>`;
};

sheets.push(
  `<section class="page cover"><div class="cover-logo"><img src="${svgUri(file.logoSvg('primary'))}" alt=""></div><div class="cover-text"><p class="kicker">Księga identyfikacji wizualnej</p><h1>Klamra</h1><p class="lead">${content.lead}</p><p class="small">Szkoła programowania online. Projekt przykładowy: Klamra to zmyślona firma.</p></div><div class="cover-sticker a">${stickerImg(1, 230)}</div><div class="cover-sticker b">${stickerImg(5, 150)}</div><div class="cover-sticker c">${stickerImg(8, 300)}</div></section>`,
);

sheet(
  'Spis treści',
  `${titleBlock('Spis treści', 'Co jest w środku')}<ol class="toc">${[
    ['Klient i zadanie', 3],
    ['Kierunek i strategia', 4],
    ['Proces', 7],
    ['Logo', 9],
    ['Kolor', 14],
    ['Typografia', 17],
    ['Ikony, wzór i grafika', 20],
    ['Zdjęcia i ton głosu', 23],
    ['Zastosowania', 25],
    ['Animacja i kontakt', 28],
  ]
    .map(([name, page]) => `<li><span>${name}</span><span class="mono">${String(page).padStart(2, '0')}</span></li>`)
    .join('')}</ol>`,
  { tone: 'yellow' },
);

sheet(
  'Klient i zadanie',
  `${titleBlock('Klient i zadanie', 'Szkoła, która pokazuje, że kod się pisze')}<div class="cols"><div class="prose">${content.client.paragraphs.map(text => `<p>${text}</p>`).join('')}</div><dl class="facts">${content.client.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></div>`,
);

sheet(
  'Kierunek',
  `${titleBlock('Kierunek', content.direction.title)}<div class="cols"><div class="prose">${content.direction.paragraphs.map(text => `<p>${text}</p>`).join('')}</div><div class="words">${content.direction.keywords.map((word, i) => `<span class="w${i}">${word}</span>`).join('')}</div></div>`,
  { tone: 'pink' },
);

sheet(
  'Strategia',
  `${titleBlock('Strategia', 'Dla kogo i o czym', content.strategy.audience)}<div class="three">${content.strategy.values.map((value, i) => `<article class="card f${i}"><h3>${value.title}</h3><p>${value.text}</p></article>`).join('')}</div>`,
);

sheet(
  'Osobowość',
  `${titleBlock('Strategia', 'Osobowość i pozycjonowanie')}<div class="cols"><div class="prose"><p class="big">Marka jest: ${content.strategy.personality.join(', ')}.</p><p>Unikamy: ${content.strategy.avoids}.</p></div><blockquote>${content.strategy.positioning}</blockquote></div>`,
  { tone: 'dark' },
);

sheet(
  'Proces',
  `${titleBlock('Proces', 'Trzy kierunki, jeden wybrany', content.process.intro)}<div class="three">${[
    ...content.process.rejected,
    { title: content.process.chosen.title, reason: content.process.chosen.reason, thumb: 'figures/direction-klamry.svg', chosen: true },
  ]
    .map(
      item =>
        `<article class="card ${item.chosen ? 'chosen' : ''}"><img src="${svgUri(item.thumb)}" alt="" class="thumb"><h3>${item.title}</h3><p>${item.reason}</p></article>`,
    )
    .join('')}</div>`,
);

sheet(
  'Wybrany kierunek',
  `${titleBlock('Proces', content.process.chosen.title, content.process.chosen.reason)}<div class="three">${content.process.refinement.map(step => `<article class="card"><h3>${step.title}</h3><p>${step.text}</p></article>`).join('')}</div>`,
  { tone: 'mint' },
);

sheet(
  'Logo główne',
  `${titleBlock('Logo', 'Znak główny')}<div class="stage" style="background:${c.cytryna}"><img src="${svgUri(file.logoSvg('primary'))}" alt="" style="height:300px"></div><p class="caption">Klamry z kursorem w żółtej ramce z twardym cieniem, napis Klamra w kroju Epilogue 900 z ręcznym kerningiem. Ten znak stosujemy zawsze, gdy jest miejsce.</p>`,
);

const variantTiles = [
  ['primary', 'Główne', c.biel],
  ['horizontal', 'Poziome', c.mgla],
  ['vertical', 'Pionowe', c.biel],
  ['symbol', 'Sygnet', c.niebo],
  ['mono-black', 'Jednokolorowe', c.biel],
  ['negative', 'Negatyw', c.atrament],
];
sheet(
  'Warianty logo',
  `${titleBlock('Logo', 'Sześć wariantów')}<div class="tiles">${variantTiles
    .map(
      ([variant, name, bg]) =>
        `<figure style="background:${bg}"><img src="${svgUri(file.logoSvg(variant))}" alt="" style="max-height:170px;max-width:78%"><figcaption class="tag" style="${variant === 'negative' ? `background:${c.biel}` : ''}">${name}</figcaption></figure>`,
    )
    .join('')}</div>`,
);

sheet(
  'Kerning',
  `${titleBlock('Logo', 'Ręczny kerning', content.process.refinement[0].text)}<div class="pair"><figure><img src="${svgUri('figures/wordmark-default.svg')}" alt=""><figcaption class="tag">Bez korekty</figcaption></figure><figure><img src="${svgUri('figures/wordmark-kerned.svg')}" alt=""><figcaption class="tag">Po korekcie</figcaption></figure></div>`,
  { tone: 'yellow' },
);

sheet(
  'Pole ochronne',
  `${titleBlock('Logo', 'Pole ochronne i rozmiar minimalny', extras.clearSpace)}<div class="cols"><div class="stage small" style="background:${c.biel}"><img src="${svgUri('figures/clearspace.svg')}" alt="" style="width:94%;height:auto"></div><dl class="facts"><div><dt>Sygnet</dt><dd>${extras.minimum.symbol}</dd></div><div><dt>Pełny znak</dt><dd>${extras.minimum.fullStamp}</dd></div><div><dt>Logo główne</dt><dd>${extras.minimum.primary}</dd></div></dl></div>`,
);

const misuse = [
  ['Nie rozciągamy', 'transform:scaleX(1.5)'],
  ['Nie obracamy', 'transform:rotate(24deg)'],
  ['Nie zmieniamy koloru', 'filter:hue-rotate(150deg) saturate(2)'],
  ['Nie rozmywamy cienia', 'filter:drop-shadow(10px 14px 6px rgba(0,0,0,.45))'],
];
sheet(
  'Czego nie robić',
  `${titleBlock('Logo', 'Czego nie robimy')}<div class="four">${misuse
    .map(
      ([text, style]) =>
        `<figure class="misuse"><div><img src="${svgUri(file.logoSvg('symbol'))}" alt="" style="height:250px;${style}"></div><figcaption>${text}</figcaption></figure>`,
    )
    .join('')}</div>`,
  { tone: 'pink' },
);

sheet(
  'Paleta',
  `${titleBlock('Kolor', 'Paleta', 'Dziesięć kolorów: cztery głośne, pięć neutralnych i atrament. Wartości CMYK są przybliżone, do druku zamów próbę.')}<div class="swatches">${palette
    .map(
      entry =>
        `<figure><div class="chip" style="background:${entry.hex}"></div><figcaption><b>${entry.name}</b><span class="mono">${entry.hex}</span><span class="mono">${entry.rgbCss}</span><span class="mono">${entry.oklchCss}</span><span class="mono">${entry.cmykApproxText}</span></figcaption></figure>`,
    )
    .join('')}</div>`,
);

sheet(
  'Kontrast',
  `${titleBlock('Kolor', 'Kontrast')}<table class="contrast"><thead><tr><th>Użycie</th><th>Tekst</th><th>Tło</th><th>Stosunek</th><th>Poziom</th></tr></thead><tbody>${contrast
    .map(
      row =>
        `<tr><td>${row.use}</td><td><i style="background:${row.fgHex}"></i>${colorName(row.fg)}</td><td><i style="background:${row.bgHex}"></i>${colorName(row.bg)}</td><td class="mono">${row.ratio.toFixed(1)}:1</td><td>${row.kind === 'decorative' ? 'dekoracja' : row.level}</td></tr>`,
    )
    .join('')}</tbody></table>`,
  { kicker: 'Kolor' },
);

const shares = [
  ['biel', 34],
  ['cytryna', 28],
  ['atrament', 20],
  ['roz', 8],
  ['mieta', 5],
  ['niebo', 5],
];
sheet(
  'Proporcje',
  `${titleBlock('Kolor', 'Proporcje użycia', 'Biel niesie stronę, cytryna niesie markę, atrament niesie tekst i obrysy. Róż, mięta i niebo to akcenty, nigdy tło długiego tekstu.')}<div class="bar">${shares
    .map(
      ([id, w]) =>
        `<div style="flex:${w};background:${c[id]};color:${id === 'atrament' ? c.biel : c.atrament}"><span>${colorName(id)} ${w}%</span></div>`,
    )
    .join('')}</div>`,
  { tone: 'mint' },
);

sheet(
  'Kroje',
  `${titleBlock('Typografia', 'Dwa kroje i mono')}<div class="cols"><div class="face"><p class="mega display">Epilogue</p><p class="specimen display">${extras.specimen}</p><p class="small">Nagłówki i tekst. Grubości 900 i 800 do nagłówków, 700 i 500 do tekstu.</p></div><div class="face"><p class="mega mono">JetBrains Mono</p><p class="specimen mono">${extras.specimen}</p><p class="small">Etykiety, naklejki, numery i kod. Grubości 400, 700 i 800.</p></div></div>`,
  { tone: 'yellow' },
);

sheet(
  'Skala',
  `${titleBlock('Typografia', 'Skala pisma')}<div class="scale">${extras.typeScale
    .map(
      row =>
        `<div><span class="${row.font === 'mono' ? 'mono' : row.font === 'display' ? 'display' : 'text'}" style="font-size:${Math.min(row.size * 1.5, 96)}px;font-weight:${row.weight};line-height:1.1">${row.name}</span><span class="small">${row.size} px, interlinia ${row.line}. ${row.use}</span></div>`,
    )
    .join('')}</div>`,
);

sheet(
  'Polskie znaki',
  `${titleBlock('Typografia', 'Polskie znaki', 'Oba kroje mają komplet polskich liter, cudzysłowy drukarskie, cyfry i nawiasy potrzebne w kodzie.')}<p class="glyphs display">${extras.glyphs}</p><p class="glyphs mono">${extras.glyphs}</p>`,
  { tone: 'sky' },
);

sheet(
  'Ikony',
  `${titleBlock('Ikony', 'Dwanaście ikon', 'Rysowane kreską 2,5 px na siatce 24 px, z prostymi końcami i ostrymi narożnikami.')}<div class="icons">${brand.iconNames
    .map(
      (name, i) =>
        `<figure style="background:${[c.cytryna, c.roz, c.mieta, c.niebo][i % 4]}"><img src="${dataUri(iconSvg(name, c.atrament))}" alt=""><figcaption class="mono">${name}</figcaption></figure>`,
    )
    .join('')}</div>`,
);

sheet(
  'Wzór',
  `${titleBlock('Wzór', 'Wzór z klocków', extras.graphics[0].text)}<div class="pattern" style="background-image:url('${svgUri(file.pattern)}')"></div>`,
);

sheet(
  'Grafika',
  `${titleBlock('Grafika', 'Cień, naklejki i układ')}<div class="cols"><div class="three-stack">${extras.graphics
    .slice(1)
    .map(item => `<article class="card"><h3>${item.title}</h3><p>${item.text}</p></article>`)
    .join('')}</div><ul class="rules">${extras.layoutRules.map(rule => `<li>${rule}</li>`).join('')}</ul></div>`,
  { tone: 'yellow' },
);

sheet(
  'Zdjęcia',
  `${titleBlock('Zdjęcia', 'Styl zdjęć')}<div class="photo"><div class="prose wide"><p>${extras.photoStyle}</p></div><div class="swatch-stack">${[c.cytryna, c.roz, c.mieta, c.niebo].map(color => `<div style="background:${color}"></div>`).join('')}</div></div>`,
);

sheet(
  'Ton głosu',
  `${titleBlock('Ton głosu', 'Cztery zasady')}<div class="tone">${content.tone
    .map(
      rule =>
        `<article><h3>${rule.title}</h3><p>${rule.text}</p><p class="yes">Tak: ${rule.yes}</p><p class="no">Nie: ${rule.no}</p></article>`,
    )
    .join('')}</div>`,
  { tone: 'pink' },
);

const mock = path => `<img class="mock" src="${jpeg(path)}" alt="">`;
const caption = id => {
  const item = content.applications.find(entry => entry.id === id);
  return `<p class="mockcap"><b>${item.title}.</b> ${item.caption}</p>`;
};
sheet(
  'Wizytówka i papier',
  `${titleBlock('Zastosowania', 'Wizytówka i papier firmowy')}<div class="mocks"><div class="cardcol">${mock(file.cardFront)}${caption('karta-awers')}</div><div class="cardcol">${mock(file.cardBack)}${caption('karta-rewers')}</div><div class="papercol">${mock(file.letterhead)}</div></div>`,
);
sheet(
  'Naklejki i certyfikat',
  `${titleBlock('Zastosowania', 'Naklejki, certyfikat i podpis e-mail')}<div class="mocks wide"><div>${mock(file.application)}${caption('naklejki')}</div><div>${mock(file.emailMock)}${caption('podpis')}</div></div>`,
  { tone: 'yellow' },
);

sheet(
  'Media społecznościowe',
  `${titleBlock('Zastosowania', 'Trzy posty i awatar')}<div class="posts">${[1, 2, 3].map(n => `<img src="${png(file.post(n))}" alt="">`).join('')}<img class="avatar" src="${png(file.avatar)}" alt=""></div>`,
);

sheet(
  'Animacja i kontakt',
  `${titleBlock('Animacja', 'Znak spada na kartę i zapisuje nazwę', extras.animation)}<div class="end"><div class="endlogo"><img src="${svgUri(file.logoSvg('primary'))}" alt=""></div><dl class="facts"><div><dt>Adres</dt><dd>${contact.office}</dd></div><div><dt>Telefon</dt><dd>${contact.phone}</dd></div><div><dt>E-mail</dt><dd>${contact.email}</dd></div></dl></div>`,
  { tone: 'dark' },
);

if (sheets.length !== total) throw new Error(`expected ${total} pages, built ${sheets.length}`);

const shadow = (n = 8) => `box-shadow:${n}px ${n}px 0 ${c.atrament}`;
const css = `
${baseCss()}
@page{size:1920px 1080px;margin:0}
html,body{margin:0}
*{font-variant-ligatures:none}
.page{position:relative;width:1920px;height:1080px;overflow:hidden;page-break-after:always;break-after:page;padding:150px 130px 120px;background:${c.biel};color:${c.atrament}}
.page.yellow{background:${c.cytryna}}
.page.pink{background:${c.roz}}
.page.mint{background:${c.mieta}}
.page.sky{background:${c.niebo}}
.page.dark{background:${c.atrament};color:${c.biel}}
.page.cover{background:${c.cytryna};padding:0}
.tag{font:800 18px/1 'Klamra Mono',monospace;text-transform:uppercase;background:${c.biel};color:${c.atrament};border:4px solid ${c.atrament};padding:8px 12px;display:inline-block}
.page header{position:absolute;left:130px;right:130px;top:50px;display:flex;justify-content:space-between}
.page.dark header .tag{border-color:${c.biel}}
.page footer{position:absolute;left:130px;bottom:44px;font:700 17px/1 'Klamra Mono',monospace;color:${c.grafit}}
.page.pink footer,.page.mint footer,.page.sky footer,.page.yellow footer{color:${c.atrament}}
.page.dark footer{color:${c.beton}}
.cover-logo{position:absolute;left:150px;top:110px;width:640px}
.cover-logo img{width:100%;display:block}
.cover-text{position:absolute;left:150px;bottom:110px;width:1200px}
.cover-text h1{font-size:230px;line-height:.9;margin:16px 0 26px}
.cover-text .lead{max-width:900px}
.cover-sticker{position:absolute}
.cover-sticker.a{right:230px;top:120px;transform:rotate(8deg)}
.cover-sticker.b{right:120px;top:480px;transform:rotate(-10deg)}
.cover-sticker.c{right:180px;bottom:150px;transform:rotate(-4deg)}
.kicker{font:800 22px/1 'Klamra Mono',monospace;text-transform:uppercase;margin-bottom:20px;display:inline-block;background:${c.atrament};color:${c.biel};padding:10px 14px}
.page.dark .kicker{background:${c.cytryna};color:${c.atrament}}
h2{font-size:90px;line-height:1;margin-bottom:24px}
h3{font-size:40px;line-height:1.08;margin-bottom:14px}
.lead{font:500 29px/1.45 'Klamra Text',sans-serif;max-width:1250px}
.head{margin-bottom:42px}
.small{font:500 22px/1.5 'Klamra Text',sans-serif;color:${c.grafit}}
.page.yellow .small,.page.pink .small,.page.mint .small,.page.sky .small{color:${c.atrament}}
.page.dark .small{color:${c.beton}}
.cols{display:grid;grid-template-columns:1.25fr 1fr;gap:90px;align-items:start}
.prose p{font:500 26px/1.5 'Klamra Text',sans-serif;margin-bottom:22px;max-width:900px}
.prose.wide p{max-width:1200px;font-size:36px;line-height:1.6}
.big{font:900 54px/1.15 'Klamra Display',sans-serif!important}
.facts div{border:4px solid ${c.atrament};background:${c.biel};color:${c.atrament};padding:16px 22px 20px;margin-bottom:20px;${shadow(8)}}
.facts dt{font:800 17px/1 'Klamra Mono',monospace;text-transform:uppercase;margin-bottom:10px;color:${c.grafit}}
.facts dd{margin:0;font:700 26px/1.3 'Klamra Text',sans-serif}
.words{display:flex;flex-direction:column;gap:12px}
.words span{font:900 140px/1 'Klamra Display',sans-serif;border:5px solid ${c.atrament};background:${c.biel};padding:6px 30px 14px;${shadow(10)};align-self:flex-start}
.words .w1{background:${c.cytryna};margin-left:70px}
.words .w2{background:${c.mieta}}
blockquote{margin:0;font:800 46px/1.25 'Klamra Display',sans-serif;border:5px solid ${c.biel};padding:34px 40px;background:${c.atrament};box-shadow:10px 10px 0 ${c.roz}}
.three{display:grid;grid-template-columns:repeat(3,1fr);gap:44px}
.three-stack{display:grid;gap:30px}
.four{display:grid;grid-template-columns:repeat(4,1fr);gap:36px}
.card{background:${c.biel};border:5px solid ${c.atrament};padding:28px 30px;${shadow(10)};color:${c.atrament}}
.card p{font:500 24px/1.45 'Klamra Text',sans-serif}
.three .card{min-height:300px}
.card.f0{background:${c.cytryna}}.card.f1{background:${c.mieta}}.card.f2{background:${c.niebo}}
.chosen{background:${c.cytryna}}
.thumb{height:100px;display:block;margin-bottom:22px;background:${c.mgla};border:4px solid ${c.atrament};width:100%;object-fit:contain}
.stage{height:480px;display:grid;place-items:center;border:5px solid ${c.atrament};${shadow(12)}}
.stage.small{height:470px}
.caption{font:500 26px/1.5 'Klamra Text',sans-serif;margin-top:36px;max-width:1300px}
.tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:34px}
.tiles figure{height:290px;display:flex;align-items:center;justify-content:center;position:relative;border:5px solid ${c.atrament};${shadow(8)}}
.tiles figcaption{position:absolute;left:16px;top:16px}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:44px}
.pair figure{background:${c.biel};height:420px;display:flex;align-items:center;justify-content:center;position:relative;border:5px solid ${c.atrament};${shadow(10)}}
.pair figcaption{position:absolute;left:16px;top:16px}
.pair img{width:78%}
.misuse div{height:430px;background:${c.biel};display:grid;place-items:center;overflow:hidden;border:5px solid ${c.atrament};${shadow(8)}}
.misuse figcaption{font:800 22px/1.3 'Klamra Text',sans-serif;margin-top:22px}
.swatches{display:grid;grid-template-columns:repeat(5,1fr);gap:34px 28px}
.chip{height:104px;border:4px solid ${c.atrament};${shadow(6)}}
.swatches figcaption{display:grid;gap:4px;padding-top:14px;font:500 20px/1.3 'Klamra Text',sans-serif}
.swatches figcaption .mono{font-size:16px;font-weight:700}
.swatches b{font:900 28px/1.1 'Klamra Display',sans-serif}
.contrast{width:100%;border-collapse:collapse;font:500 19px/1.2 'Klamra Text',sans-serif}
.contrast th{text-align:left;font:800 15px/1 'Klamra Mono',monospace;text-transform:uppercase;padding:0 10px 12px;border-bottom:4px solid ${c.atrament}}
.contrast td{padding:5px 10px;border-bottom:2px solid ${c.beton}}
.contrast i{display:inline-block;width:20px;height:20px;margin-right:10px;vertical-align:-4px;border:3px solid ${c.atrament}}
.bar{display:flex;height:420px;border:5px solid ${c.atrament};${shadow(12)}}
.bar div{display:flex;align-items:flex-end;padding:20px;font:800 22px/1 'Klamra Mono',monospace;border-right:5px solid ${c.atrament}}
.bar div:last-child{border-right:0}
.face .mega{font-size:110px;line-height:1;margin-bottom:34px}
.face .specimen{font-size:44px;line-height:1.3;margin-bottom:30px}
.display{font-family:'Klamra Display',sans-serif;font-weight:900}
.text{font-family:'Klamra Text',sans-serif}
.scale{display:grid;gap:18px}
.scale div{display:grid;grid-template-columns:560px 1fr;align-items:baseline;gap:40px;border-top:4px solid ${c.atrament};padding-top:14px}
.glyphs{font-size:92px;line-height:1.35;margin:18px 0}
.icons{display:grid;grid-template-columns:repeat(6,1fr);gap:30px}
.icons figure{height:240px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;border:5px solid ${c.atrament};${shadow(8)}}
.icons img{width:96px}
.icons figcaption{font-size:19px}
.pattern{height:530px;background-size:260px;background-color:${c.biel};border:5px solid ${c.atrament};${shadow(12)}}
.rules{display:grid;gap:20px}
.rules li{font:500 27px/1.4 'Klamra Text',sans-serif;border-top:4px solid ${c.atrament};padding-top:14px}
.photo{display:grid;grid-template-columns:1.5fr 1fr;gap:70px}
.swatch-stack{display:grid;grid-template-columns:1fr 1fr;gap:26px}
.swatch-stack div{height:300px;border:5px solid ${c.atrament};${shadow(8)}}
.tone{display:grid;grid-template-columns:1fr 1fr;gap:34px 54px}
.tone article{background:${c.biel};padding:28px 34px;border:5px solid ${c.atrament};${shadow(10)}}
.tone h3{font-size:34px;margin-bottom:8px}
.tone p{font:500 23px/1.4 'Klamra Text',sans-serif}
.tone .yes{font-weight:700;margin-top:12px;background:${c.mieta};padding:4px 10px;display:inline-block}
.tone .no{color:${c.grafit};margin-top:8px;text-decoration:line-through;text-decoration-color:${c.roz};text-decoration-thickness:3px}
.mocks{display:grid;grid-template-columns:560px 560px 1fr;gap:34px;align-items:start}
.mocks .mock{width:100%;display:block;border:5px solid ${c.atrament};${shadow(10)}}
.mocks .papercol .mock{width:auto;height:620px;margin-left:auto}
.mockcap{font:500 22px/1.45 'Klamra Text',sans-serif;margin-top:26px}
.mocks.wide{grid-template-columns:860px 1fr}
.mocks.wide .mock{width:100%;height:auto}
.posts{display:grid;grid-template-columns:repeat(3,1fr) 0.7fr;gap:34px;align-items:start}
.posts img{width:100%;border:5px solid ${c.atrament};${shadow(10)}}
.posts .avatar{align-self:end}
.end{display:grid;grid-template-columns:1fr 1fr;gap:90px;align-items:center}
.endlogo{background:${c.cytryna};padding:50px;border:5px solid ${c.biel}}
.endlogo img{width:100%;display:block}
.toc{columns:2;column-gap:100px;font:900 44px/1 'Klamra Display',sans-serif}
.toc li{display:flex;justify-content:space-between;align-items:center;border:5px solid ${c.atrament};background:${c.biel};padding:20px 26px;margin-bottom:26px;break-inside:avoid;${shadow(8)}}
.toc li .mono{font-size:24px}
`;

const html = `<!doctype html><html lang="pl"><meta charset="utf-8"><title>Klamra, księga identyfikacji</title><style>${css}</style><body>${sheets.join('')}</body></html>`;

await withBrowser(browser => htmlToPdf(browser, { outDir: brand.paths.out, name: 'brandbook', html, out: pub(file.brandbook), width: 1920, height: 1080 }));
console.log(`  ${file.brandbook} (${sheets.length} pages)`);
