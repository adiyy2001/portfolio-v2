import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { colorTable, contrastTable } from '../../lib/brand.mjs';
import { htmlToPdf, withBrowser } from '../../lib/browser.mjs';
import { arcsSvg } from './art.mjs';
import { brand, c, content, contact, dataUri, extras, file, baseCss, logoIn, readPub } from './theme.mjs';
import { iconSvg } from './icons.mjs';

const pub = path => join(brand.paths.pub, path);
const jpeg = path => `data:image/jpeg;base64,${readFileSync(pub(path)).toString('base64')}`;
const svgUri = path => dataUri(readPub(path));
const palette = colorTable(brand);
const contrast = contrastTable(brand);
const colorName = id => palette.find(entry => entry.id === id)?.name ?? id;
const total = 27;
const light = { '#5b2f14': c['krem-jasny'] };
const onOrange = { '#5b2f14': c.kakao, '#ec7424': c['krem-jasny'] };

const sheets = [];
const sheet = (title, body, { tone = 'light', kicker = '' } = {}) => {
  const number = sheets.length + 1;
  sheets.push(`<section class="page ${tone}"><header><span>${kicker || title}</span><span>${String(number).padStart(2, '0')} / ${total}</span></header>${body}<footer>Wolnobieg, księga identyfikacji. Projekt przykładowy.</footer></section>`);
};

const titleBlock = (kicker, title, lead = '') => `<div class="head"><p class="kicker">${kicker}</p><h2>${title}</h2>${lead ? `<p class="lead">${lead}</p>` : ''}</div>`;
const arcs = (corner, options = {}) => arcsSvg({ w: 1920, h: 1080, corner, width: 60, gap: 22, start: 220, style: 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none', ...options });

sheets.push(`<section class="page cover">${arcs('br', { width: 70, gap: 26, start: 560, colors: [c.kakao, c.musztarda, c['krem-jasny']] })}<div class="cover-badge">${logoIn('symbol', onOrange, 'width:100%;height:auto')}</div><div class="cover-text"><p class="kicker">Księga identyfikacji wizualnej</p><h1>Wolnobieg</h1><p class="lead">${content.lead}</p><p class="small">Serwis i sklep rowerowy, Gdańsk. Projekt przykładowy: Wolnobieg to zmyślona firma.</p></div></section>`);

sheet('Spis treści', `${titleBlock('Spis treści', 'Co jest w środku')}<ol class="toc">${[
  ['Klient i zadanie', 3], ['Kierunek i strategia', 4], ['Proces', 7], ['Logo', 9], ['Kolor', 14], ['Typografia', 17], ['Ikony, wzór i grafika', 20], ['Zdjęcia i ton głosu', 23], ['Zastosowania', 25], ['Animacja i kontakt', 27],
].map(([name, page]) => `<li><span>${name}</span><span>${String(page).padStart(2, '0')}</span></li>`).join('')}</ol>`);

sheet('Klient i zadanie', `${titleBlock('Klient i zadanie', 'Warsztat z tablicą ze sprayu')}<div class="cols"><div class="prose">${content.client.paragraphs.map(text => `<p>${text}</p>`).join('')}</div><dl class="facts">${content.client.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></div>`);

sheet('Kierunek', `${titleBlock('Kierunek', content.direction.title)}<div class="cols"><div class="prose">${content.direction.paragraphs.map(text => `<p>${text}</p>`).join('')}</div><div class="words">${content.direction.keywords.map(word => `<span>${word}</span>`).join('')}</div></div>`, { tone: 'sand' });

sheet('Strategia', `${titleBlock('Strategia', 'Dla kogo i o czym', content.strategy.audience)}<div class="three">${content.strategy.values.map((value, i) => `<article class="card tilt${i}"><h3>${value.title}</h3><p>${value.text}</p></article>`).join('')}</div>`);

sheet('Osobowość', `${titleBlock('Strategia', 'Osobowość i pozycjonowanie')}<div class="cols"><div class="prose"><p class="big">Marka jest: ${content.strategy.personality.join(', ')}.</p><p>Unikamy: ${content.strategy.avoids}.</p></div><blockquote>${content.strategy.positioning}</blockquote></div>`, { tone: 'dark' });

sheet('Proces', `${titleBlock('Proces', 'Trzy kierunki, jeden wybrany', content.process.intro)}<div class="three">${[...content.process.rejected, { title: content.process.chosen.title, reason: content.process.chosen.reason, thumb: 'figures/direction-kolo.svg', chosen: true }].slice(0, 3).map(item => `<article class="card ${item.chosen ? 'chosen' : ''}"><img src="${svgUri(item.thumb)}" alt="" class="thumb"><h3>${item.title}</h3><p>${item.reason}</p></article>`).join('')}</div>`);

sheet('Wybrany kierunek', `${titleBlock('Proces', content.process.chosen.title, content.process.chosen.reason)}<div class="three">${content.process.refinement.map(step => `<article class="card"><h3>${step.title}</h3><p>${step.text}</p></article>`).join('')}</div>`);

sheet('Logo główne', `${titleBlock('Logo', 'Znak główny')}<div class="stage" style="background:${c.krem}">${logoIn('primary', {}, 'height:380px;width:auto')}</div><p class="caption">Napis Wolnobieg w kroju Rammetto One na zboczu minus cztery stopnie i trzy pasy pod nim. Gdy jest miejsce, dodajemy odznakę z zębatką.</p>`);

const variantTiles = [
  ['primary', 'Główne', c.krem, {}],
  ['horizontal', 'Poziome', c['krem-jasny'], {}],
  ['vertical', 'Pionowe', c.piasek, {}],
  ['symbol', 'Sygnet', c.pomarancz, onOrange],
  ['mono-black', 'Jednokolorowe', '#ffffff', {}],
  ['negative', 'Negatyw', c.kakao, {}],
];
sheet('Warianty logo', `${titleBlock('Logo', 'Sześć wariantów')}<div class="tiles">${variantTiles.map(([variant, name, bg, map]) => `<figure style="background:${bg}">${logoIn(variant, map, 'max-height:190px;max-width:80%;width:auto')}<figcaption style="color:${variant === 'negative' ? c['krem-jasny'] : c.kakao}">${name}</figcaption></figure>`).join('')}</div>`);

sheet('Kerning', `${titleBlock('Logo', 'Ręczny kerning', content.process.refinement[0].text)}<div class="pair"><figure><img src="${svgUri('figures/wordmark-default.svg')}" alt=""><figcaption>Bez korekty</figcaption></figure><figure><img src="${svgUri('figures/wordmark-kerned.svg')}" alt=""><figcaption>Po korekcie</figcaption></figure></div>`);

sheet('Pole ochronne', `${titleBlock('Logo', 'Pole ochronne i rozmiar', extras.clearSpace)}<div class="cols"><div class="stage small" style="background:${c.krem}"><img src="${svgUri('figures/clearspace.svg')}" alt="" style="width:80%;height:auto"></div><dl class="facts"><div><dt>Sygnet</dt><dd>${extras.minimum.symbol}</dd></div><div><dt>Pełna odznaka</dt><dd>${extras.minimum.fullBadge}</dd></div><div><dt>Logo główne</dt><dd>${extras.minimum.primary}</dd></div></dl></div>`);

const misuse = [
  ['Nie rozciągamy', 'transform:scaleX(1.5)'],
  ['Nie obracamy', 'transform:rotate(24deg)'],
  ['Nie zmieniamy koloru', 'filter:hue-rotate(150deg) saturate(2)'],
  ['Nie dodajemy cienia', 'filter:drop-shadow(10px 14px 6px rgba(0,0,0,.45))'],
];
sheet('Czego nie robić', `${titleBlock('Logo', 'Czego nie robimy')}<div class="four">${misuse.map(([text, style]) => `<figure class="misuse"><div>${logoIn('symbol', {}, `height:230px;width:auto;${style}`)}</div><figcaption>${text}</figcaption></figure>`).join('')}</div>`);

sheet('Paleta', `${titleBlock('Kolor', 'Paleta', 'Trzynaście kolorów z lat siedemdziesiątych: pomarańcz, musztarda, brąz i awokado na kremie. Wartości CMYK są przybliżone, do druku zamów próbę.')}<div class="swatches">${palette.map(entry => `<figure><div class="chip" style="background:${entry.hex}"></div><figcaption><b>${entry.name}</b><span>${entry.hex}</span><span>${entry.rgbCss}</span><span>${entry.cmykApproxText}</span><em>${entry.role}</em></figcaption></figure>`).join('')}</div>`);

sheet('Kontrast', `${titleBlock('Kolor', 'Kontrast')}<table class="contrast"><thead><tr><th>Użycie</th><th>Tekst</th><th>Tło</th><th>Stosunek</th><th>Poziom</th></tr></thead><tbody>${contrast.slice(0, 16).map(row => `<tr><td>${row.use}</td><td><i style="background:${row.fgHex}"></i>${colorName(row.fg)}</td><td><i style="background:${row.bgHex}"></i>${colorName(row.bg)}</td><td>${row.ratio.toFixed(1)}:1</td><td>${row.kind === 'decorative' ? 'dekoracja' : row.level}</td></tr>`).join('')}</tbody></table>`);

const shares = [['krem-jasny', 36], ['brazowy', 20], ['pomarancz', 18], ['musztarda', 12], ['awokado', 8], ['kakao', 6]];
sheet('Proporcje', `${titleBlock('Kolor', 'Proporcje użycia', 'Krem niesie stronę, brąz niesie tekst, pomarańcz i musztarda dają ciepło pasów. Awokado pojawia się rzadko, jak detal na ramie.')}<div class="bar">${shares.map(([id, w]) => `<div style="flex:${w};background:${c[id]};color:${['brazowy', 'kakao', 'awokado', 'pomarancz'].includes(id) ? (id === 'pomarancz' ? c.kakao : c['krem-jasny']) : c.kakao}"><span>${colorName(id)} ${w}%</span></div>`).join('')}</div>`);

sheet('Kroje', `${titleBlock('Typografia', 'Dwa kroje')}<div class="cols"><div class="face"><p class="mega display">Rammetto One</p><p class="specimen display">${extras.specimen}</p><p class="small">Nagłówki i napis logo. Jedna grubość, 400.</p></div><div class="face"><p class="mega text">Baloo 2</p><p class="specimen text">${extras.specimen}</p><p class="small">Tekst. Grubości 400, 600 i 800.</p></div></div>`, { tone: 'sand' });

sheet('Skala', `${titleBlock('Typografia', 'Skala pisma')}<div class="scale">${extras.typeScale.map(row => `<div><span class="${row.font}" style="font-size:${Math.min(row.size * 1.6, 90)}px;font-weight:${row.weight ?? 400};line-height:1.1">${row.name}</span><span class="small">${row.size} px, interlinia ${row.line}. ${row.use}</span></div>`).join('')}</div>`);

sheet('Polskie znaki', `${titleBlock('Typografia', 'Polskie znaki', 'Oba kroje mają komplet polskich liter, cudzysłowy drukarskie i kropkę środkową.')}<p class="glyphs display">${extras.glyphs}</p><p class="glyphs text">${extras.glyphs}</p>`);

sheet('Ikony', `${titleBlock('Ikony', 'Dwanaście ikon', 'Rysowane kreską 2,1 px na siatce 24 px, z okrągłymi końcami.')}<div class="icons">${brand.iconNames.map(name => `<figure><img src="${dataUri(iconSvg(name, c.kakao))}" alt=""><figcaption>${name}</figcaption></figure>`).join('')}</div>`);

sheet('Wzór', `${titleBlock('Wzór', 'Wzór z łuków', extras.graphics[0].text)}<div class="pattern" style="background-image:url('${svgUri(file.pattern)}')"></div>`);

sheet('Grafika', `${titleBlock('Grafika', 'Faktura i układ')}<div class="cols"><div class="three-stack">${extras.graphics.slice(1).map(item => `<article class="card"><h3>${item.title}</h3><p>${item.text}</p></article>`).join('')}</div><ul class="rules">${extras.layoutRules.map(rule => `<li>${rule}</li>`).join('')}</ul></div>`, { tone: 'sand' });

sheet('Zdjęcia', `${arcs('br', { width: 60, gap: 22, start: 300 })}${titleBlock('Zdjęcia', 'Styl zdjęć')}<div class="prose wide"><p>${extras.photoStyle}</p></div>`);

sheet('Ton głosu', `${titleBlock('Ton głosu', 'Cztery zasady')}<div class="tone">${content.tone.map(rule => `<article><h3>${rule.title}</h3><p>${rule.text}</p><p class="yes">Tak: ${rule.yes}</p><p class="no">Nie: ${rule.no}</p></article>`).join('')}</div>`);

const mock = path => `<img class="mock" src="${jpeg(path)}" alt="">`;
sheet('Wizytówka i papier', `${titleBlock('Zastosowania', 'Wizytówka i papier firmowy')}<div class="mocks">${mock(file.cardFront)}${mock(file.cardBack)}${mock(file.letterhead)}</div>`);
sheet('Szyld i cyfra', `${titleBlock('Zastosowania', 'Szyld, przywieszka i e-mail')}<div class="mocks wide">${mock(file.application)}${mock(file.emailMock)}</div>`);

sheet('Animacja i kontakt', `${titleBlock('Animacja', 'Odznaka toczy się na miejsce', extras.animation)}<div class="end"><div>${logoIn('negative', {}, 'height:300px;width:auto')}</div><dl class="facts"><div><dt>Adres</dt><dd>${contact.street}, ${contact.city}</dd></div><div><dt>Telefon</dt><dd>${contact.phone}</dd></div><div><dt>E-mail</dt><dd>${contact.email}</dd></div></dl></div>`, { tone: 'dark' });

if (sheets.length !== total) throw new Error(`expected ${total} pages, built ${sheets.length}`);

const css = `
${baseCss()}
@page{size:1920px 1080px;margin:0}
html,body{margin:0}
.page{position:relative;width:1920px;height:1080px;overflow:hidden;page-break-after:always;break-after:page;padding:150px 140px 120px;background:${c['krem-jasny']};color:${c.kakao}}
.page.sand{background:${c.piasek}}
.page.dark{background:${c.kakao};color:${c['krem-jasny']}}
.page.dark .kicker{color:${c.musztarda}}
.page.dark footer,.page.dark header{color:${c.len}}
.page.cover{background:${c.pomarancz};padding:0;display:flex;align-items:center;gap:90px;padding:0 150px}
.page header{position:absolute;left:140px;right:140px;top:60px;display:flex;justify-content:space-between;font:600 20px/1 'Wolnobieg Text';color:${c.kawa}}
.page footer{position:absolute;left:140px;bottom:50px;font:600 18px/1 'Wolnobieg Text';color:${c.kawa}}
.cover-badge{width:500px;flex:none;position:relative}
.cover-text{position:relative}
.cover-text h1{font-size:150px;line-height:1.1;margin:20px 0 34px;white-space:nowrap;transform:rotate(-4deg);transform-origin:0 100%}
.cover-text .lead{max-width:620px;margin-bottom:18px}
.cover-text .small{max-width:560px}
.cover .kicker,.cover .small{color:${c.kakao}}
.kicker{font:800 20px/1 'Wolnobieg Text';letter-spacing:.14em;text-transform:uppercase;color:${c.rdza};margin-bottom:22px}
.page.sand .kicker{color:${c.kakao}}
h2{font-size:80px;line-height:1.08;margin-bottom:26px;color:${c.brazowy}}
.page.dark h2{color:${c['krem-jasny']}}
h3{font-size:34px;line-height:1.15;margin-bottom:14px;color:${c.brazowy}}
.page.dark h3{color:${c['krem-jasny']}}
.lead{font:600 30px/1.45 'Wolnobieg Text';max-width:1200px}
.head{margin-bottom:44px}
.small{font:600 22px/1.5 'Wolnobieg Text';color:${c.kawa}}
.page.dark .small{color:${c.len}}
.cols{display:grid;grid-template-columns:1.25fr 1fr;gap:100px;align-items:start}
.prose p{font:400 27px/1.5 'Wolnobieg Text';margin-bottom:18px;max-width:900px}
.prose.wide p{max-width:1300px;font-size:34px}
.big{font:400 48px/1.2 'Wolnobieg Display'!important;color:${c.musztarda}}
.facts{margin:0}
.facts div{border-top:3px solid ${c.brazowy};padding:18px 0 22px}
.page.dark .facts div{border-color:${c.musztarda}}
.facts dt{font:800 18px/1 'Wolnobieg Text';letter-spacing:.12em;text-transform:uppercase;color:${c.rdza};margin-bottom:10px}
.page.dark .facts dt{color:${c.musztarda}}
.facts dd{margin:0;font:400 28px/1.35 'Wolnobieg Text'}
.words{display:flex;flex-direction:column;gap:6px}
.words span{font:400 130px/1.05 'Wolnobieg Display';color:${c.brazowy}}
blockquote{margin:0;font:400 46px/1.3 'Wolnobieg Display';border-left:10px solid ${c.pomarancz};padding-left:50px}
.three{display:grid;grid-template-columns:repeat(3,1fr);gap:40px}
.three-stack{display:grid;gap:30px}
.four{display:grid;grid-template-columns:repeat(4,1fr);gap:36px}
.card{background:${c.krem};padding:36px;position:relative;border-radius:28px}
.card p{font:400 25px/1.5 'Wolnobieg Text'}
.page.sand .card{background:${c['krem-jasny']}}
.tilt0{transform:rotate(-1.4deg)}.tilt1{transform:rotate(1deg)}.tilt2{transform:rotate(-0.8deg)}
.chosen{outline:6px solid ${c.pomarancz};outline-offset:-6px}
.thumb{height:150px;display:block;margin-bottom:22px;background:${c['krem-jasny']};width:100%;object-fit:contain;border-radius:16px}
.stage{height:500px;display:grid;place-items:center;border-radius:32px}
.stage.small{height:440px}
.caption{font:600 26px/1.5 'Wolnobieg Text';margin-top:30px;max-width:1300px}
.tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
.tiles figure{margin:0;height:290px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;position:relative;border-radius:28px;overflow:hidden}
.tiles figcaption{position:absolute;left:24px;bottom:18px;font:800 20px/1 'Wolnobieg Text'}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:40px}
.pair figure{margin:0;background:${c.krem};height:420px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px;border-radius:28px}
.pair img{width:75%}
.pair figcaption{font:800 22px/1 'Wolnobieg Text'}
.misuse{margin:0}
.misuse div{height:360px;background:${c.krem};display:grid;place-items:center;overflow:hidden;border-radius:28px}
.misuse figcaption{font:600 24px/1.3 'Wolnobieg Text';margin-top:16px}
.swatches{display:grid;grid-template-columns:repeat(7,1fr);gap:30px 20px}
.swatches figure{margin:0}
.chip{height:90px;border-radius:14px;border:2px solid ${c.kakao}}
.swatches figcaption{display:grid;gap:3px;padding-top:10px;font:400 17px/1.25 'Wolnobieg Text'}
.swatches b{font:400 24px/1.1 'Wolnobieg Display'}
.swatches em{font:600 16px/1.25 'Wolnobieg Text';color:${c.kawa};font-style:normal}
.contrast{width:100%;border-collapse:collapse;font:400 20px/1.15 'Wolnobieg Text'}
.contrast th{text-align:left;font:800 16px/1 'Wolnobieg Text';letter-spacing:.1em;text-transform:uppercase;padding:0 10px 10px;color:${c.rdza}}
.contrast td{padding:5px 10px;border-top:2px solid ${c.len}}
.contrast i{display:inline-block;width:20px;height:20px;border-radius:50%;margin-right:10px;vertical-align:-3px;border:2px solid ${c.kakao}}
.bar{display:flex;height:420px;border:4px solid ${c.kakao};border-radius:24px;overflow:hidden}
.bar div{display:flex;align-items:flex-end;padding:20px;font:800 22px/1 'Wolnobieg Text'}
.face .mega{font-size:76px;line-height:1.1;margin-bottom:34px;white-space:nowrap}
.face .specimen{font-size:44px;line-height:1.3;margin-bottom:30px}
.display{font-family:'Wolnobieg Display',serif;font-weight:400}
.text{font-family:'Wolnobieg Text',sans-serif}
.scale{display:grid;gap:20px}
.scale div{display:grid;grid-template-columns:560px 1fr;align-items:baseline;gap:40px;border-top:3px solid ${c.len};padding-top:14px}
.glyphs{font-size:92px;line-height:1.35;margin:18px 0}
.icons{display:grid;grid-template-columns:repeat(6,1fr);gap:30px}
.icons figure{margin:0;background:${c.krem};height:250px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;border-radius:28px}
.icons img{width:96px}
.icons figcaption{font:600 20px/1 'Wolnobieg Text'}
.pattern{height:520px;background-size:360px;background-color:${c.krem};border-radius:32px}
.rules{margin:0;padding:0;list-style:none;display:grid;gap:22px}
.rules li{font:400 29px/1.4 'Wolnobieg Text';border-top:3px solid ${c.brazowy};padding-top:16px}
.tone{display:grid;grid-template-columns:1fr 1fr;gap:34px 60px}
.tone article{background:${c.krem};padding:30px 36px;border-radius:28px}
.tone h3{font-size:32px;margin-bottom:8px}
.tone p{font:400 24px/1.4 'Wolnobieg Text'}
.tone .yes{color:${c.oliwka};font-weight:800;margin-top:12px}
.tone .no{color:${c.kawa};text-decoration:line-through;text-decoration-color:${c.pomarancz}}
.mocks{display:flex;justify-content:space-between;align-items:flex-start;gap:24px}
.mocks .mock{height:430px;width:auto;border-radius:24px;display:block}
.mocks.wide .mock{height:470px}
.end{display:grid;grid-template-columns:1fr 1fr;gap:100px;align-items:center}
.toc{list-style:none;margin:0;padding:0;columns:2;column-gap:120px;font:400 42px/1 'Wolnobieg Display'}
.toc li{display:flex;justify-content:space-between;border-top:3px solid ${c.brazowy};padding:22px 0 26px;break-inside:avoid}
.toc li span:last-child{font:600 24px/1 'Wolnobieg Text';color:${c.rdza}}
`;

const html = `<!doctype html><html lang="pl"><meta charset="utf-8"><title>Wolnobieg, księga identyfikacji</title><style>${css}</style><body>${sheets.join('')}</body></html>`;

await withBrowser(browser => htmlToPdf(browser, { outDir: brand.paths.out, name: 'brandbook', html, out: pub(file.brandbook), width: 1920, height: 1080 }));
console.log(`  ${file.brandbook} (${sheets.length} pages)`);
