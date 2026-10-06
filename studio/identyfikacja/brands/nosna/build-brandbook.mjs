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
const total = 28;

const sheets = [];
const sheet = (title, body, { tone = 'light', kicker = '' } = {}) => {
  const number = sheets.length + 1;
  sheets.push(`<section class="page ${tone}"><header><span>${kicker || title}</span><span>${String(number).padStart(2, '0')} / ${total}</span><i class="rail"></i></header>${body}<footer>Nośna, księga identyfikacji. Projekt przykładowy.</footer></section>`);
};

const logoImg = (variant, style = '') => `<img src="${svgUri(file.logoSvg(variant))}" alt="" style="${style}">`;
const titleBlock = (kicker, title, lead = '') => `<div class="head"><p class="kicker">${kicker}</p><h2>${title}</h2>${lead ? `<p class="lead">${lead}</p>` : ''}</div>`;
const list = items => items.map(text => `<li>${text}</li>`).join('');

sheets.push(`<section class="page cover"><div class="cover-mark">${logoImg('negative', 'width:100%')}</div><div class="cover-text"><p class="kicker">Księga identyfikacji wizualnej</p><p class="lead">${content.lead}</p><p class="small">Festiwal sztuki nowych mediów i muzyki elektronicznej, Łódź. Projekt przykładowy: Nośna to zmyślony festiwal.</p></div></section>`);

sheet('Spis treści', `${titleBlock('Spis treści', 'Co jest w środku')}<ol class="toc">${[
  ['Klient i zadanie', 3], ['Kierunek i strategia', 4], ['Proces', 7], ['Logo jako system', 9], ['Generator', 12], ['Pole ochronne i błędy', 15], ['Kolor', 17], ['Typografia', 20], ['Ikony, wzór i układ', 22], ['Zdjęcia i ton głosu', 24], ['Zastosowania', 26], ['Animacja i kontakt', 28],
].map(([name, page]) => `<li><span>${name}</span><span>${String(page).padStart(2, '0')}</span></li>`).join('')}</ol>`);

sheet('Klient i zadanie', `${titleBlock('Klient i zadanie', 'Festiwal, który zmienia się co dzień')}<div class="cols"><div class="prose">${content.client.paragraphs.map(text => `<p>${text}</p>`).join('')}</div><dl class="facts">${content.client.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></div>`);

sheet('Kierunek', `${titleBlock('Kierunek', content.direction.title)}<div class="cols"><div class="prose">${content.direction.paragraphs.map(text => `<p>${text}</p>`).join('')}</div><div class="words">${content.direction.keywords.map(word => `<span>${word}</span>`).join('')}</div></div>`, { tone: 'dark' });

sheet('Strategia', `${titleBlock('Strategia', 'Dla kogo i o czym', content.strategy.audience)}<div class="three numbered">${content.strategy.values.map(value => `<article class="card"><h3>${value.title}</h3><p>${value.text}</p></article>`).join('')}</div>`);

sheet('Osobowość', `${titleBlock('Strategia', 'Osobowość i pozycjonowanie')}<div class="cols"><div class="prose"><p class="big">Marka jest: ${content.strategy.personality.join(', ')}.</p><p>Unikamy: ${content.strategy.avoids}.</p></div><blockquote>${content.strategy.positioning}</blockquote></div>`);

sheet('Proces', `${titleBlock('Proces', 'Trzy kierunki, jeden wybrany', content.process.intro)}<div class="three compact">${[...content.process.rejected, { title: content.process.chosen.title, reason: content.process.chosen.reason, thumb: 'figures/direction-nosna.svg', chosen: true }].map(item => `<article class="card ${item.chosen ? 'chosen' : ''}"><img src="${svgUri(item.thumb)}" alt="" class="thumb"><h3>${item.title}</h3><p>${item.reason}</p></article>`).join('')}</div>`);

sheet('Wybrany kierunek', `${titleBlock('Proces', content.process.chosen.title, content.process.chosen.reason)}<div class="three">${content.process.refinement.map(step => `<article class="card"><h3>${step.title}</h3><p>${step.text}</p></article>`).join('')}</div>`);

sheet('Logo główne', `${titleBlock('Logo jako system', 'Znak główny')}<div class="stage" style="background:${c.papier}">${logoImg('primary', 'height:400px')}</div><p class="caption">Napis Nośna w kroju Syne 800 z ręcznym kerningiem, linia nośna, pierścień odbiornika i pole piątku w Przędzalni przy 100 BPM. To jest jeden z dwunastu wariantów, wybrany na znak główny.</p>`);

sheet('Stałe i zmienne', `${titleBlock('Logo jako system', 'Co stałe, co generowane')}<div class="cols"><div><h3>Stałe</h3><ul class="rules">${list(extras.constants)}</ul></div><div class="stage small" style="background:${c.papier}"><img src="${svgUri('figures/days-envelope.svg')}" alt="" style="width:92%;height:auto"></div></div>`);

const variantTiles = [
  ['primary', 'Główne', c.papier, c.atrament],
  ['horizontal', 'Poziome', c.kosc, c.atrament],
  ['vertical', 'Pionowe', c.papier, c.atrament],
  ['symbol', 'Sygnet', c.kosc, c.atrament],
  ['mono-black', 'Jednokolorowe', '#ffffff', c.atrament],
  ['negative', 'Negatyw', c.atrament, c.kosc],
];
sheet('Warianty logo', `${titleBlock('Logo jako system', 'Sześć wariantów')}<div class="tiles">${variantTiles.map(([variant, name, bg, fg]) => `<figure style="background:${bg}">${logoImg(variant, 'max-height:200px;max-width:80%')}<figcaption style="color:${fg}">${name}</figcaption></figure>`).join('')}</div>`);

sheet('Dwanaście pól', `${titleBlock('Generator', 'Trzy dni razy cztery sceny', 'Dwanaście kombinacji czyta się jako jedną markę, bo zawsze mają tę samą nośną, ten sam pierścień i tę samą grubość nitki.')}<div class="stage grid" style="background:${c.papier}"><img src="${svgUri('figures/grid-12.svg')}" alt="" style="width:84%;height:auto"></div>`);

sheet('Reguły generatora', `${titleBlock('Generator', 'Cztery parametry')}<div class="rulegrid">${extras.rules.map(rule => `<article class="card"><p class="param">${rule.parameter}</p><h3>${rule.sets}</h3><p>${rule.text}</p></article>`).join('')}</div>`);

sheet('Kerning', `${titleBlock('Generator', 'Ręczny kerning napisu', content.process.refinement[0].text)}<div class="pair"><figure><img src="${svgUri('figures/wordmark-default.svg')}" alt=""><figcaption>Bez korekty</figcaption></figure><figure><img src="${svgUri('figures/wordmark-kerned.svg')}" alt=""><figcaption>Po korekcie</figcaption></figure></div>`);

sheet('Pole ochronne', `${titleBlock('Pole ochronne i błędy', 'Pole ochronne i minimum', extras.clearSpace)}<div class="cols"><div class="stage small" style="background:${c.papier}"><img src="${svgUri('figures/clearspace.svg')}" alt="" style="max-height:470px;width:auto;max-width:94%"></div><dl class="facts"><div><dt>Sygnet</dt><dd>${extras.minimum.symbol}</dd></div><div><dt>Logo z napisem</dt><dd>${extras.minimum.fullStamp}</dd></div><div><dt>Logo główne</dt><dd>${extras.minimum.primary}</dd></div></dl></div>`);

const misuse = [
  ['Nie rozciągamy', 'transform:scaleX(1.5)'],
  ['Nie obracamy', 'transform:rotate(24deg)'],
  ['Nie zmieniamy barw', 'filter:hue-rotate(150deg) saturate(2)'],
  ['Nie dodajemy cienia', 'filter:drop-shadow(10px 14px 6px rgba(0,0,0,.45))'],
];
sheet('Czego nie robić', `${titleBlock('Pole ochronne i błędy', 'Czego nie robimy')}<div class="four">${misuse.map(([text, style]) => `<figure class="misuse"><div>${logoImg('symbol', `width:84%;${style}`)}</div><figcaption>${text}</figcaption></figure>`).join('')}</div>`);

sheet('Paleta', `${titleBlock('Kolor', 'Paleta', 'Dwanaście kolorów: atrament, trzy barwy dni z ciemnymi odpowiednikami do tekstu i neutralne kości. Wartości CMYK są przybliżone, do druku zamów próbę.')}<div class="swatches">${palette.map(entry => `<figure><div class="chip" style="background:${entry.hex}"></div><figcaption><b>${entry.name}</b><span>${entry.hex}</span><span>${entry.rgbCss}</span><span>${entry.oklchCss}</span><span>${entry.cmykApproxText}</span></figcaption></figure>`).join('')}</div>`);

const contrastRows = rows => `<table class="contrast"><thead><tr><th>Użycie</th><th>Tekst</th><th>Tło</th><th>Stosunek</th><th>Poziom</th></tr></thead><tbody>${rows.map(row => `<tr><td>${row.use}</td><td><i style="background:${row.fgHex}"></i>${colorName(row.fg)}</td><td><i style="background:${row.bgHex}"></i>${colorName(row.bg)}</td><td>${row.ratio.toFixed(1)}:1</td><td>${row.kind === 'decorative' ? 'dekoracja' : row.level}</td></tr>`).join('')}</tbody></table>`;
const half = Math.ceil(contrast.length / 2);
sheet('Kontrast', `${titleBlock('Kolor', 'Kontrast, część pierwsza')}${contrastRows(contrast.slice(0, half))}`, { kicker: 'Kolor' });
sheet('Kontrast dalej', `${titleBlock('Kolor', 'Kontrast, część druga', 'Barwy dni na kości mają kontrast poniżej 3:1, więc służą wyłącznie jako dekoracja. Tekst w kolorze dnia na kości zawsze używa ciemnych odpowiedników.')}${contrastRows(contrast.slice(half))}`, { kicker: 'Kolor' });

sheet('Kroje', `${titleBlock('Typografia', 'Dwa kroje')}<div class="cols"><div class="face"><p class="mega display">Syne</p><p class="specimen display">${extras.specimen}</p><p class="small">Nagłówki i napis. Grubości 500, 700 i 800.</p></div><div class="face"><p class="mega mono">Martian Mono</p><p class="specimen mono">${extras.specimen}</p><p class="small">Parametry, godziny i ziarna. Grubości 400, 500 i 700.</p></div></div>`);

sheet('Skala i znaki', `${titleBlock('Typografia', 'Skala pisma i polskie znaki')}<div class="scale">${extras.typeScale.map(row => `<div><span class="${row.font}" style="font-size:${Math.min(row.size * 1.3, 72)}px;font-weight:${row.weight};line-height:1.1">${row.name}</span><span class="small">${row.size} px, interlinia ${row.line}. ${row.use}</span></div>`).join('')}</div><p class="glyphs display">${extras.glyphs}</p>`);

sheet('Ikony', `${titleBlock('Ikony, wzór i układ', 'Dwanaście ikon', 'Rysowane kreską na siatce 24 px, z okrągłymi końcami i jednym pierścieniem jako akcentem.')}<div class="icons">${brand.iconNames.map(name => `<figure><img src="${dataUri(iconSvg(name, c.atrament))}" alt=""><figcaption>${name}</figcaption></figure>`).join('')}</div>`);

sheet('Wzór i układ', `${titleBlock('Ikony, wzór i układ', 'Wzór z interferencji', extras.graphics[0].text)}<div class="cols"><div class="pattern" style="background-image:url('${svgUri(file.pattern)}')"></div><ul class="rules">${list(extras.layoutRules)}</ul></div>`);

sheet('Zdjęcia', `${titleBlock('Zdjęcia i ton głosu', 'Styl zdjęć')}<div class="cols"><div class="prose"><p>${extras.photoStyle}</p></div><dl class="facts">${[['Światło', 'zastane, bez lamp błyskowych'], ['Kadr', 'szeroki, z ludźmi przy urządzeniach, kablami i projektorami'], ['Ostrość', 'na dłoniach i interfejsach, tło może się rozmywać'], ['Kolor', 'neutralny, przyciemniony kontrast, kolor dnia tylko w podpisie']].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></div>`, { tone: 'dark' });

sheet('Ton głosu', `${titleBlock('Zdjęcia i ton głosu', 'Cztery zasady')}<div class="tone">${content.tone.map(rule => `<article><h3>${rule.title}</h3><p>${rule.text}</p><p class="yes">Tak: ${rule.yes}</p><p class="no">Nie: ${rule.no}</p></article>`).join('')}</div>`);

const mock = path => `<img class="mock" src="${jpeg(path)}" alt="">`;
sheet('Wizytówka i papier', `${titleBlock('Zastosowania', 'Wizytówka i papier firmowy')}<div class="mocks">${mock(file.cardFront)}${mock(file.cardBack)}${mock(file.letterhead)}</div>`);
sheet('Identyfikator i e-mail', `${titleBlock('Zastosowania', 'Plakaty dni, identyfikator i e-mail')}<div class="mocks wide">${mock(file.application)}${mock(file.emailMock)}</div>`);

sheet('Animacja i kontakt', `${titleBlock('Animacja i kontakt', 'Trzy dni w trzy sekundy', extras.animation)}<div class="end"><div>${logoImg('negative', 'height:320px')}</div><dl class="facts"><div><dt>Adres</dt><dd>${contact.street}, ${contact.city}</dd></div><div><dt>Telefon</dt><dd>${contact.phone}</dd></div><div><dt>E-mail</dt><dd>${contact.email}</dd></div></dl></div>`, { tone: 'dark' });

if (sheets.length !== total) throw new Error(`expected ${total} pages, built ${sheets.length}`);

const css = `
${baseCss()}
@page{size:1920px 1080px;margin:0}
html,body{margin:0}
.page{position:relative;width:1920px;height:1080px;overflow:hidden;page-break-after:always;break-after:page;padding:150px 140px 120px;background:${c.kosc};color:${c.atrament}}
.page:not(.cover){display:flex;flex-direction:column}
.page>.head{flex:none}
.page>*:not(.head):not(header):not(footer){flex:1 1 auto}
.page>.caption,.page>.glyphs,.page>.toc{flex:none}
.page.dark{background:${c.atrament};color:${c.kosc}}
.page.dark .kicker,.page.dark footer,.page.dark header{color:${c.mgla}}
.page.cover{background:${c.atrament};color:${c.kosc};padding:0 160px;display:flex;align-items:center;gap:110px}
.page header{position:absolute;left:140px;right:140px;top:60px;display:flex;justify-content:space-between;font:500 18px/1 'Nosna Mono';color:${c.grafit}}
.rail{position:absolute;left:-140px;right:-4px;top:38px;height:4px;background:currentColor}
.rail::after{content:'';position:absolute;right:0;top:-8px;width:14px;height:14px;border:4px solid currentColor;border-radius:50%;box-sizing:content-box;margin-right:-12px}
.page footer{position:absolute;left:140px;bottom:50px;font:500 16px/1 'Nosna Mono';color:${c.grafit}}
.cover-mark{width:900px;flex:none}
.cover-text{max-width:620px}
.cover .kicker{color:${c.mgla}}
.cover .small{color:${c.mgla};margin-top:30px}
.kicker{font:700 18px/1 'Nosna Mono';letter-spacing:.12em;text-transform:uppercase;color:${c['piatek-tekst']};margin-bottom:24px}
h2{font-size:78px;line-height:1.02;margin-bottom:26px;letter-spacing:-.01em}
h3{font-size:34px;line-height:1.1;margin-bottom:14px;font-weight:700}
.lead{font:500 28px/1.45 'Nosna Display';max-width:1200px}
.head{margin-bottom:40px}
.small{font:500 17px/1.5 'Nosna Mono';color:${c.grafit}}
.page.dark .small{color:${c.mgla}}
.cols{display:grid;grid-template-columns:1.2fr 1fr;gap:90px;align-items:start}
.prose p{font:500 27px/1.5 'Nosna Display';margin-bottom:22px;max-width:900px}
.prose.wide p{max-width:1300px;font-size:32px}
.big{font:800 54px/1.15 'Nosna Display'!important}
.facts{margin:0}
.facts div{border-top:4px solid currentColor;padding:18px 0 22px}
.facts dt{font:700 16px/1 'Nosna Mono';letter-spacing:.12em;text-transform:uppercase;color:${c['sobota-tekst']};margin-bottom:10px}
.page.dark .facts dt{color:${c.sobota}}
.facts dd{margin:0;font:500 30px/1.35 'Nosna Display'}
.words{display:flex;flex-direction:column;gap:0}
.words span{font:800 112px/1.05 'Nosna Display'}
.words span:nth-child(1){color:${c.piatek}}.words span:nth-child(2){color:${c.sobota}}.words span:nth-child(3){color:${c.niedziela}}
blockquote{margin:0;font:700 44px/1.25 'Nosna Display';border-left:10px solid ${c.piatek};padding-left:44px}
.three{display:grid;grid-template-columns:repeat(3,1fr);gap:36px}
.four{display:grid;grid-template-columns:repeat(4,1fr);gap:32px}
.card{background:${c.papier};padding:34px;position:relative;border-top:10px solid ${c.atrament}}
.three.numbered{counter-reset:n}
.three.numbered .card{counter-increment:n}
.three.numbered .card::before{content:'0' counter(n);display:block;font:800 150px/1 'Nosna Display';color:${c.mgla};margin-bottom:30px}
.card:nth-child(1){border-color:${c.piatek}}.card:nth-child(2){border-color:${c.sobota}}.card:nth-child(3){border-color:${c.niedziela}}.card:nth-child(4){border-color:${c.atrament}}
.card p{font:500 29px/1.5 'Nosna Display'}
.card h3{font-size:44px}
.card{padding:44px}
.compact p{font-size:20px}
.compact h3{font-size:36px}
.compact .thumb{height:150px;margin-bottom:22px;padding:8px}
.compact{align-items:stretch}
.param{font:700 16px/1 'Nosna Mono'!important;letter-spacing:.12em;text-transform:uppercase;margin-bottom:14px}
.chosen{outline:6px solid ${c.atrament};outline-offset:-6px}
.thumb{height:150px;display:block;margin-bottom:22px;background:${c.kosc};width:100%;object-fit:contain}
.stage{display:grid;place-items:center;min-height:480px}
.stage.small{height:520px;flex:none}
.stage.grid{overflow:hidden}
.caption{font:500 24px/1.5 'Nosna Display';margin-top:28px;max-width:1300px}
.tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:26px}
.tiles figure{margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative}
.tiles figcaption{position:absolute;left:22px;bottom:16px;font:700 17px/1 'Nosna Mono'}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:40px}
.pair figure{margin:0;background:${c.papier};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px}
.pair img{width:75%}
.pair figcaption{font:700 20px/1 'Nosna Mono'}
.misuse{margin:0;display:flex;flex-direction:column}
.misuse div{flex:1;background:${c.papier};display:grid;place-items:center;overflow:hidden}
.misuse figcaption{font:500 28px/1.3 'Nosna Display';margin-top:16px}
.rulegrid{display:grid;grid-template-columns:1fr 1fr;gap:30px}
.rulegrid .card h3{font-size:40px}
.swatches{display:grid;grid-template-columns:repeat(6,1fr);gap:26px 20px}
.swatches figure{margin:0;display:flex;flex-direction:column}
.chip{flex:1;min-height:92px;box-shadow:inset 0 0 0 2px ${c.mgla}}
.swatches figcaption{display:grid;gap:4px;padding-top:12px;font:500 15px/1.3 'Nosna Mono'}
.swatches b{font:800 22px/1.1 'Nosna Display'}
.contrast{width:100%;border-collapse:collapse;font:500 20px/1.2 'Nosna Display'}
.contrast th{text-align:left;font:700 14px/1 'Nosna Mono';letter-spacing:.1em;text-transform:uppercase;padding:0 10px 12px}
.contrast td{padding:5px 10px;border-top:2px solid ${c.mgla}}
.contrast i{display:inline-block;width:18px;height:18px;border-radius:50%;margin-right:10px;vertical-align:-3px;border:2px solid ${c.atrament}}
.face .mega{font-size:104px;line-height:1;margin-bottom:34px;white-space:nowrap}
.face .specimen{font-size:44px;line-height:1.3;margin-bottom:30px}
.display{font-family:'Nosna Display',sans-serif;font-weight:800}
.mono{font-family:'Nosna Mono',monospace;font-weight:500}
.scale{display:grid;gap:18px;align-content:start}
.scale div{display:grid;grid-template-columns:520px 1fr;align-items:baseline;gap:40px;border-top:3px solid ${c.mgla};padding-top:10px}
.glyphs{font-size:72px;line-height:1.3;margin:28px 0 0}
.icons{display:grid;grid-template-columns:repeat(6,1fr);gap:28px}
.icons figure{margin:0;background:${c.papier};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px}
.icons img{width:104px}
.icons figcaption{font:500 17px/1 'Nosna Mono'}
.pattern{align-self:stretch;min-height:470px;background-size:420px;background-color:${c.papier}}
.rules{margin:0;padding:0;list-style:none;display:grid;gap:20px}
.rules li{font:500 30px/1.4 'Nosna Display';border-top:4px solid ${c.atrament};padding-top:14px}
.tone{display:grid;grid-template-columns:1fr 1fr;gap:30px 50px}
.tone article{background:${c.papier};padding:34px 40px}
.tone h3{font-size:36px;margin-bottom:10px}
.tone p{font:500 25px/1.4 'Nosna Display'}
.tone .yes{color:${c['sobota-tekst']};font-weight:700;margin-top:12px}
.tone .no{color:${c.grafit};text-decoration:line-through;text-decoration-color:${c.piatek}}
.mocks{display:grid;grid-template-columns:1fr 1fr 1fr;gap:28px;align-items:start}
.mocks .mock{width:100%;height:auto}
.mocks.wide{grid-template-columns:1.25fr 1fr}
.end{display:grid;grid-template-columns:1fr 1fr;gap:100px;align-items:center}
.toc{list-style:none;margin:0;padding:0;columns:2;column-gap:120px;font:800 44px/1 'Nosna Display'}
.toc li{display:flex;justify-content:space-between;align-items:center;border-top:4px solid ${c.atrament};padding:22px 0 24px;break-inside:avoid}
.toc li span:last-child{font:500 26px/1 'Nosna Mono';color:${c['piatek-tekst']}}
`;

const html = `<!doctype html><html lang="pl"><meta charset="utf-8"><title>Nośna, księga identyfikacji</title><style>${css}</style><body>${sheets.join('')}</body></html>`;

await withBrowser(browser => htmlToPdf(browser, { outDir: brand.paths.out, name: 'brandbook', html, out: pub(file.brandbook), width: 1920, height: 1080 }));
console.log(`  ${file.brandbook} (${sheets.length} pages)`);
