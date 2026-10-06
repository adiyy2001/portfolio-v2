import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { colorTable, contrastTable } from '../../lib/brand.mjs';
import { htmlToPdf, withBrowser } from '../../lib/browser.mjs';
import { brand, c, content, contact, dataUri, extras, file, baseCss, readPub } from './theme.mjs';
import { iconSvg } from './icons.mjs';

const pub = path => join(brand.paths.pub, path);
const jpeg = path => `data:image/jpeg;base64,${readFileSync(pub(path)).toString('base64')}`;
const svgUri = path => dataUri(readPub(path));
const palette = colorTable(brand);
const contrast = contrastTable(brand);
const colorName = id => palette.find(entry => entry.id === id)?.name ?? id;
const total = 27;

const sheets = [];
const sheet = (title, body, { tone = 'light', kicker = '' } = {}) => {
  const number = sheets.length + 1;
  sheets.push(`<section class="page ${tone}"><header><span>${kicker || title}</span><span>${String(number).padStart(2, '0')} / ${total}</span></header>${body}<footer>Skibka, księga identyfikacji. Projekt przykładowy.</footer></section>`);
};

const recolored = (variant, color, style = '') => {
  const svg = readPub(file.logoSvg(variant)).replace(/fill="#[0-9a-fA-F]{3,8}"/g, `fill="${color}"`);
  return `<img src="${dataUri(svg)}" alt="" style="${style}">`;
};

const titleBlock = (kicker, title, lead = '') => `<div class="head"><p class="kicker">${kicker}</p><h2>${title}</h2>${lead ? `<p class="lead">${lead}</p>` : ''}</div>`;

sheets.push(`<section class="page cover"><div class="cover-stamp">${recolored('symbol', c.zyto, 'width:100%')}</div><div class="cover-text"><p class="kicker">Księga identyfikacji wizualnej</p><h1>Skibka</h1><p class="lead">${content.lead}</p><p class="small">Piekarnia na zakwasie, Kraków. Projekt przykładowy: Skibka to zmyślona firma.</p></div></section>`);

sheet('Spis treści', `${titleBlock('Spis treści', 'Co jest w środku')}<ol class="toc">${[
  ['Klient i zadanie', 3], ['Kierunek i strategia', 4], ['Proces', 7], ['Logo', 9], ['Kolor', 14], ['Typografia', 17], ['Ikony, wzór i grafika', 20], ['Zdjęcia i ton głosu', 23], ['Zastosowania', 25], ['Animacja i kontakt', 27],
].map(([name, page]) => `<li><span>${name}</span><span>${String(page).padStart(2, '0')}</span></li>`).join('')}</ol>`);

sheet('Klient i zadanie', `${titleBlock('Klient i zadanie', 'Piekarnia, która piecze wolno')}<div class="cols"><div class="prose">${content.client.paragraphs.map(text => `<p>${text}</p>`).join('')}</div><dl class="facts">${content.client.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></div>`);

sheet('Kierunek', `${titleBlock('Kierunek', content.direction.title)}<div class="cols"><div class="prose">${content.direction.paragraphs.map(text => `<p>${text}</p>`).join('')}</div><div class="words">${content.direction.keywords.map(word => `<span>${word}</span>`).join('')}</div></div>`, { tone: 'kraft' });

sheet('Strategia', `${titleBlock('Strategia', 'Dla kogo i o czym', content.strategy.audience)}<div class="three">${content.strategy.values.map((value, i) => `<article class="card tilt${i}"><h3>${value.title}</h3><p>${value.text}</p></article>`).join('')}</div>`);

sheet('Osobowość', `${titleBlock('Strategia', 'Osobowość i pozycjonowanie')}<div class="cols"><div class="prose"><p class="big">Marka jest: ${content.strategy.personality.join(', ')}.</p><p>Unikamy: ${content.strategy.avoids}.</p></div><blockquote>${content.strategy.positioning}</blockquote></div>`, { tone: 'dark' });

sheet('Proces', `${titleBlock('Proces', 'Trzy kierunki, jeden wybrany', content.process.intro)}<div class="three">${[...content.process.rejected, { id: 'stamp', title: content.process.chosen.title, text: '', reason: content.process.chosen.reason, thumb: 'figures/direction-stamp.svg', chosen: true }].slice(0, 3).map(item => `<article class="card ${item.chosen ? 'chosen' : ''}"><img src="${svgUri(item.thumb)}" alt="" class="thumb"><h3>${item.title}</h3><p>${item.reason}</p></article>`).join('')}</div>`);

sheet('Wybrany kierunek', `${titleBlock('Proces', content.process.chosen.title, content.process.chosen.reason)}<div class="three">${content.process.refinement.map(step => `<article class="card"><h3>${step.title}</h3><p>${step.text}</p></article>`).join('')}</div>`);

sheet('Logo główne', `${titleBlock('Logo', 'Znak główny')}<div class="stage" style="background:${c['maka-biala']}">${recolored('primary', c.zyto, 'height:380px')}</div><p class="caption">Pieczątka z bochenkiem i napis Skibka, krój Young Serif z ręcznym kerningiem. Ten znak stosujemy zawsze, gdy jest miejsce.</p>`);

const variantTiles = [
  ['primary', 'Główne', c['maka-biala']],
  ['horizontal', 'Poziome', c.otreby],
  ['vertical', 'Pionowe', c.kraft],
  ['symbol', 'Sygnet', c['maka-biala']],
  ['mono-black', 'Jednokolorowe', '#ffffff'],
  ['negative', 'Negatyw', c.zyto],
];
sheet('Warianty logo', `${titleBlock('Logo', 'Sześć wariantów')}<div class="tiles">${variantTiles.map(([variant, name, bg]) => `<figure style="background:${bg}"><img src="${svgUri(file.logoSvg(variant))}" alt="" style="max-height:190px;max-width:80%">` + `<figcaption style="color:${variant === 'negative' ? c.maka : c.zyto}">${name}</figcaption></figure>`).join('')}</div>`);

sheet('Kerning', `${titleBlock('Logo', 'Ręczny kerning', content.process.refinement[0].text)}<div class="pair"><figure><img src="${svgUri('figures/wordmark-default.svg')}" alt=""><figcaption>Bez korekty</figcaption></figure><figure><img src="${svgUri('figures/wordmark-kerned.svg')}" alt=""><figcaption>Po korekcie</figcaption></figure></div>`);

sheet('Pole ochronne', `${titleBlock('Logo', 'Pole ochronne i rozmiar minimalny', extras.clearSpace)}<div class="cols"><div class="stage small" style="background:${c['maka-biala']}"><img src="${svgUri('figures/clearspace.svg')}" alt="" style="width:94%;height:auto"></div><dl class="facts"><div><dt>Sygnet</dt><dd>${extras.minimum.symbol}</dd></div><div><dt>Pełna pieczątka</dt><dd>${extras.minimum.fullStamp}</dd></div><div><dt>Logo główne</dt><dd>${extras.minimum.primary}</dd></div></dl></div>`);

const misuse = [
  ['Nie rozciągamy', 'transform:scaleX(1.5)'],
  ['Nie obracamy', 'transform:rotate(24deg)'],
  ['Nie zmieniamy koloru', 'filter:hue-rotate(150deg) saturate(2)'],
  ['Nie dodajemy cienia', 'filter:drop-shadow(10px 14px 6px rgba(0,0,0,.45))'],
];
sheet('Czego nie robić', `${titleBlock('Logo', 'Czego nie robimy')}<div class="four">${misuse.map(([text, style]) => `<figure class="misuse"><div>${recolored('symbol', c.skorka, `height:230px;${style}`)}</div><figcaption>${text}</figcaption></figure>`).join('')}</div>`);

sheet('Paleta', `${titleBlock('Kolor', 'Paleta', 'Dziesięć kolorów z mąki, skórki i żyta. Wartości CMYK są przybliżone, do druku zamów próbę.')}<div class="swatches">${palette.map(entry => `<figure><div class="chip" style="background:${entry.hex}"></div><figcaption><b>${entry.name}</b><span>${entry.hex}</span><span>${entry.rgbCss}</span><span>${entry.oklchCss}</span><span>${entry.cmykApproxText}</span><em>${entry.role}</em></figcaption></figure>`).join('')}</div>`);

sheet('Kontrast', `${titleBlock('Kolor', 'Kontrast')}<table class="contrast"><thead><tr><th>Użycie</th><th>Tekst</th><th>Tło</th><th>Stosunek</th><th>Poziom</th></tr></thead><tbody>${contrast.map(row => `<tr><td>${row.use}</td><td><i style="background:${row.fgHex}"></i>${colorName(row.fg)}</td><td><i style="background:${row.bgHex}"></i>${colorName(row.bg)}</td><td>${row.ratio.toFixed(1)}:1</td><td>${row.kind === 'decorative' ? 'dekoracja' : row.level}</td></tr>`).join('')}</tbody></table>`, { kicker: 'Kolor' });

const shares = [['maka', 46], ['zyto', 20], ['kraft', 14], ['skorka', 10], ['lan', 6], ['otreby', 4]];
sheet('Proporcje', `${titleBlock('Kolor', 'Proporcje użycia', 'Mąka niesie stronę, żyto niesie tekst, kraft i skórka dają ciepło. Zieleń łanu pojawia się rzadko, jak liść w koszu.')}<div class="bar">${shares.map(([id, w]) => `<div style="flex:${w};background:${c[id]};color:${['zyto', 'lan', 'skorka'].includes(id) ? c.maka : c.zyto}"><span>${colorName(id)} ${w}%</span></div>`).join('')}</div>`);

sheet('Kroje', `${titleBlock('Typografia', 'Dwa kroje')}<div class="cols"><div class="face"><p class="mega display">Young Serif</p><p class="specimen display">${extras.specimen}</p><p class="small">Nagłówki. Jedna grubość, 400.</p></div><div class="face"><p class="mega text">Karla</p><p class="specimen text">${extras.specimen}</p><p class="small">Tekst. Grubości 400, 500, 700 i kursywa 400.</p></div></div>`, { tone: 'kraft' });

sheet('Skala', `${titleBlock('Typografia', 'Skala pisma')}<div class="scale">${extras.typeScale.map(row => `<div><span class="${row.font}" style="font-size:${Math.min(row.size * 1.6, 90)}px;font-weight:${row.weight ?? 400};line-height:1.1">${row.name}</span><span class="small">${row.size} px, interlinia ${row.line}. ${row.use}</span></div>`).join('')}</div>`);

sheet('Polskie znaki', `${titleBlock('Typografia', 'Polskie znaki', 'Oba kroje mają komplet polskich liter, cudzysłowy drukarskie i kropkę środkową.')}<p class="glyphs display">${extras.glyphs}</p><p class="glyphs text">${extras.glyphs}</p>`);

sheet('Ikony', `${titleBlock('Ikony', 'Dwanaście ikon', 'Rysowane kreską 1,8 px na siatce 24 px, z okrągłymi końcami.')}<div class="icons">${brand.iconNames.map(name => `<figure><img src="${dataUri(iconSvg(name, c.zyto))}" alt=""><figcaption>${name}</figcaption></figure>`).join('')}</div>`);

sheet('Wzór', `${titleBlock('Wzór', 'Wzór z odcisków', extras.graphics[0].text)}<div class="pattern" style="background-image:url('${svgUri(file.pattern)}')"></div>`);

sheet('Grafika', `${titleBlock('Grafika', 'Faktura i układ')}<div class="cols"><div class="three-stack">${extras.graphics.slice(1).map(item => `<article class="card"><h3>${item.title}</h3><p>${item.text}</p></article>`).join('')}</div><ul class="rules">${extras.layoutRules.map(rule => `<li>${rule}</li>`).join('')}</ul></div>`, { tone: 'kraft' });

sheet('Zdjęcia', `${titleBlock('Zdjęcia', 'Styl zdjęć')}<div class="prose wide"><p>${extras.photoStyle}</p></div>`);

sheet('Ton głosu', `${titleBlock('Ton głosu', 'Cztery zasady')}<div class="tone">${content.tone.map(rule => `<article><h3>${rule.title}</h3><p>${rule.text}</p><p class="yes">Tak: ${rule.yes}</p><p class="no">Nie: ${rule.no}</p></article>`).join('')}</div>`);

const mock = path => `<img class="mock" src="${jpeg(path)}" alt="">`;
sheet('Wizytówka i papier', `${titleBlock('Zastosowania', 'Wizytówka i papier firmowy')}<div class="mocks">${mock(file.cardFront)}${mock(file.cardBack)}${mock(file.letterhead)}</div>`);
sheet('Torba i cyfra', `${titleBlock('Zastosowania', 'Torba, e-mail i media')}<div class="mocks wide">${mock(file.application)}${mock(file.emailMock)}</div>`);

sheet('Animacja i kontakt', `${titleBlock('Animacja', 'Pieczątka opada na papier', extras.animation)}<div class="end"><div>${recolored('negative', c.maka, 'height:300px')}</div><dl class="facts"><div><dt>Adres</dt><dd>${contact.street}, ${contact.city}</dd></div><div><dt>Telefon</dt><dd>${contact.phone}</dd></div><div><dt>E-mail</dt><dd>${contact.email}</dd></div></dl></div>`, { tone: 'dark' });

if (sheets.length !== total) throw new Error(`expected ${total} pages, built ${sheets.length}`);

const css = `
${baseCss()}
@page{size:1920px 1080px;margin:0}
html,body{margin:0}
.page{position:relative;width:1920px;height:1080px;overflow:hidden;page-break-after:always;break-after:page;padding:150px 140px 120px;background:${c.maka};color:${c.zyto}}
.page.kraft{background:${c.kraft}}
.page.dark{background:${c.zyto};color:${c.maka}}
.page.dark .kicker,.page.dark footer,.page.dark header{color:${c.kraft}}
.page.cover{background:${c.kraft};padding:0;display:flex;align-items:center;gap:100px;padding:0 160px}
.page header{position:absolute;left:140px;right:140px;top:60px;display:flex;justify-content:space-between;font:500 20px/1 'Skibka Text';color:${c.popiol}}
.page footer{position:absolute;left:140px;bottom:50px;font:500 18px/1 'Skibka Text';color:${c.popiol}}
.cover-stamp{width:620px;flex:none;transform:rotate(-5deg)}
.cover-text h1{font-size:260px;line-height:.95;margin:20px 0 30px}
.cover-text .lead{max-width:760px}
.kicker{font:700 20px/1 'Skibka Text';letter-spacing:.14em;text-transform:uppercase;color:${c.skorka};margin-bottom:22px}
.page.kraft .kicker{color:${c.zyto}}
h2{font-size:88px;line-height:1.02;margin-bottom:26px}
h3{font-size:40px;line-height:1.1;margin-bottom:14px}
.lead{font:500 30px/1.45 'Skibka Text';max-width:1200px}
.head{margin-bottom:44px}
.small{font:500 22px/1.5 'Skibka Text';color:${c.popiol}}
.page.dark .small{color:${c.kraft}}
.cols{display:grid;grid-template-columns:1.25fr 1fr;gap:100px;align-items:start}
.prose p{font:400 29px/1.55 'Skibka Text';margin-bottom:22px;max-width:900px}
.prose.wide p{max-width:1300px;font-size:34px}
.big{font:400 52px/1.2 'Skibka Display'!important}
.facts{margin:0}
.facts div{border-top:3px solid ${c.zyto};padding:18px 0 22px}
.page.dark .facts div{border-color:${c.kraft}}
.facts dt{font:700 18px/1 'Skibka Text';letter-spacing:.12em;text-transform:uppercase;color:${c.skorka};margin-bottom:10px}
.page.dark .facts dt{color:${c.kraft}}
.facts dd{margin:0;font:400 28px/1.35 'Skibka Text'}
.words{display:flex;flex-direction:column;gap:6px}
.words span{font:400 150px/1 'Skibka Display'}
blockquote{margin:0;font:400 54px/1.25 'Skibka Display';border-left:8px solid ${c.skorka};padding-left:50px}
.three{display:grid;grid-template-columns:repeat(3,1fr);gap:40px}
.three-stack{display:grid;gap:30px}
.four{display:grid;grid-template-columns:repeat(4,1fr);gap:36px}
.card{background:${c['maka-biala']};padding:36px;position:relative}
.card p{font:400 25px/1.5 'Skibka Text'}
.page.kraft .card{background:${c.maka}}
.tilt0{transform:rotate(-1.4deg)}.tilt1{transform:rotate(1deg)}.tilt2{transform:rotate(-0.8deg)}
.chosen{outline:6px solid ${c.skorka};outline-offset:-6px}
.thumb{height:150px;display:block;margin-bottom:22px;background:${c.maka};width:100%;object-fit:contain}
.stage{height:500px;display:grid;place-items:center}
.stage.small{height:540px}
.caption{font:500 26px/1.5 'Skibka Text';margin-top:30px;max-width:1300px}
.tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
.tiles figure{margin:0;height:290px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;position:relative}
.tiles figcaption{position:absolute;left:24px;bottom:18px;font:700 20px/1 'Skibka Text'}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:40px}
.pair figure{margin:0;background:${c['maka-biala']};height:420px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px}
.pair img{width:75%}
.pair figcaption{font:700 22px/1 'Skibka Text'}
.misuse{margin:0}
.misuse div{height:360px;background:${c['maka-biala']};display:grid;place-items:center;overflow:hidden}
.misuse figcaption{font:500 24px/1.3 'Skibka Text';margin-top:16px}
.swatches{display:grid;grid-template-columns:repeat(5,1fr);gap:26px 22px}
.swatches figure{margin:0}
.chip{height:70px}
.swatches figcaption{display:grid;gap:4px;padding-top:12px;font:400 19px/1.3 'Skibka Text'}
.swatches b{font:400 28px/1.1 'Skibka Display'}
.swatches em{font:500 17px/1.3 'Skibka Text';color:${c.popiol};font-style:normal}
.contrast{width:100%;border-collapse:collapse;font:400 20px/1.2 'Skibka Text'}
.contrast th{text-align:left;font:700 16px/1 'Skibka Text';letter-spacing:.1em;text-transform:uppercase;padding:0 10px 12px;color:${c.skorka}}
.contrast td{padding:6px 10px;border-top:2px solid ${c.otreby}}
.contrast i{display:inline-block;width:20px;height:20px;border-radius:50%;margin-right:10px;vertical-align:-3px;border:2px solid ${c.zyto}}
.bar{display:flex;height:420px;border:4px solid ${c.zyto}}
.bar div{display:flex;align-items:flex-end;padding:20px;font:700 22px/1 'Skibka Text'}
.face .mega{font-size:120px;line-height:1;margin-bottom:34px}
.face .specimen{font-size:46px;line-height:1.3;margin-bottom:30px}
.display{font-family:'Skibka Display',serif;font-weight:400}
.text{font-family:'Skibka Text',sans-serif}
.scale{display:grid;gap:20px}
.scale div{display:grid;grid-template-columns:560px 1fr;align-items:baseline;gap:40px;border-top:3px solid ${c.otreby};padding-top:14px}
.glyphs{font-size:96px;line-height:1.35;margin:18px 0}
.icons{display:grid;grid-template-columns:repeat(6,1fr);gap:30px}
.icons figure{margin:0;background:${c['maka-biala']};height:250px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px}
.icons img{width:96px}
.icons figcaption{font:500 20px/1 'Skibka Text'}
.pattern{height:520px;background-size:360px;background-color:${c.otreby}}
.rules{margin:0;padding:0;list-style:none;display:grid;gap:22px}
.rules li{font:400 29px/1.4 'Skibka Text';border-top:3px solid ${c.zyto};padding-top:16px}
.tone{display:grid;grid-template-columns:1fr 1fr;gap:34px 60px}
.tone article{background:${c['maka-biala']};padding:30px 36px}
.tone h3{font-size:36px;margin-bottom:8px}
.tone p{font:400 24px/1.4 'Skibka Text'}
.tone .yes{color:${c.lan};font-weight:700;margin-top:12px}
.tone .no{color:${c.popiol};text-decoration:line-through;text-decoration-color:${c.skorka}}
.mocks{display:grid;grid-template-columns:1fr 1fr 1fr;gap:30px;align-items:start}
.mocks .mock{width:100%;height:560px;object-fit:cover;object-position:center}
.mocks.wide{grid-template-columns:1fr 1fr}
.mocks.wide .mock{height:600px}
.end{display:grid;grid-template-columns:1fr 1fr;gap:100px;align-items:center}
.toc{list-style:none;margin:0;padding:0;columns:2;column-gap:120px;font:400 44px/1 'Skibka Display'}
.toc li{display:flex;justify-content:space-between;border-top:3px solid ${c.zyto};padding:22px 0 26px;break-inside:avoid}
.toc li span:last-child{font:500 24px/1 'Skibka Text';color:${c.skorka}}
`;

const html = `<!doctype html><html lang="pl"><meta charset="utf-8"><title>Skibka, księga identyfikacji</title><style>${css}</style><body>${sheets.join('')}</body></html>`;

await withBrowser(browser => htmlToPdf(browser, { outDir: brand.paths.out, name: 'brandbook', html, out: pub(file.brandbook), width: 1920, height: 1080 }));
console.log(`  ${file.brandbook} (${sheets.length} pages)`);
