import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { colorTable, contrastTable } from '../../lib/brand.mjs';
import { htmlToPdf, withBrowser } from '../../lib/browser.mjs';
import { brand, c, content, contact, dataUri, extras, file, baseCss, logoMarkup, readPub } from './theme.mjs';
import { iconSvg } from './icons.mjs';
import { faviconMarkup } from './logo-parts.mjs';

const pub = path => join(brand.paths.pub, path);
const jpeg = path => `data:image/jpeg;base64,${readFileSync(pub(path)).toString('base64')}`;
const png = path => `data:image/png;base64,${readFileSync(pub(path)).toString('base64')}`;
const svgUri = path => dataUri(readPub(path));
const palette = colorTable(brand);
const contrast = contrastTable(brand);
const colorName = id => palette.find(entry => entry.id === id)?.name ?? id;
const total = 29;
const simpleSymbol = (style = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" style="display:block;${style}">${faviconMarkup({ ink: c.czern, accent: c.mosiadz })}</svg>`;
const logo = (variant, scheme, style = '') => logoMarkup(variant, scheme, style);

const sheets = [];
const sheet = (body, { tone = 'light', section = '' } = {}) => {
  const number = sheets.length + 1;
  sheets.push(`<section class="page ${tone}"><header><span class="caps">Cuvée${section ? `, ${section}` : ''}</span><span class="folio">${String(number).padStart(2, '0')} / ${total}</span></header>${body}<footer class="caps">Księga identyfikacji, projekt przykładowy</footer></section>`);
};

const heading = (kicker, title, lead = '') => `<div class="head"><p class="kicker caps">${kicker}</p><h2>${title}</h2>${lead ? `<p class="lead">${lead}</p>` : ''}</div>`;

sheets.push(`<section class="page cover"><div class="cover-logo">${logo('primary', 'negative', 'width:100%;height:auto')}</div><div class="cover-foot"><p class="cover-title">Księga identyfikacji wizualnej</p><p class="caps cover-sub">Butikowy hotel z winnicą, Dolny Śląsk</p></div><p class="caps cover-note">Projekt przykładowy. Cuvée to zmyślona firma.</p></section>`);

const toc = [
  ['Klient i zadanie', 3], ['Kierunek i strategia', 4], ['Proces logo', 7], ['Logo', 9], ['Kolor', 15], ['Typografia', 18],
  ['Ikony, wzór i grafika', 21], ['Zdjęcia i ton głosu', 23], ['Zastosowania', 25], ['Animacja i kontakt', 29],
];
sheet(`${heading('Spis treści', 'W tym numerze')}<ol class="toc">${toc.map(([name, page], i) => `<li><span class="num">${String(i + 1).padStart(2, '0')}</span><span class="name">${name}</span><span class="pg">${String(page).padStart(2, '0')}</span></li>`).join('')}</ol>`);

sheet(`${heading('Klient i zadanie', 'Dwanaście pokoi i cztery hektary')}<div class="cols"><div class="prose">${content.client.paragraphs.map(text => `<p>${text}</p>`).join('')}</div><dl class="facts">${content.client.facts.map(([k, v]) => `<div><dt class="caps">${k}</dt><dd>${v}</dd></div>`).join('')}</dl></div>`, { section: 'klient' });

sheet(`${heading('Kierunek', content.direction.title)}<div class="cols wide-gap"><div class="prose">${content.direction.paragraphs.map(text => `<p>${text}</p>`).join('')}</div><div class="words">${content.direction.keywords.map(word => `<span>${word}</span>`).join('')}</div></div>`, { section: 'kierunek' });

sheet(`${heading('Strategia', 'Dla kogo i o czym', content.strategy.audience)}<div class="three">${content.strategy.values.map((value, i) => `<article><p class="num">${String(i + 1).padStart(2, '0')}</p><h3>${value.title}</h3><p>${value.text}</p></article>`).join('')}</div>`, { section: 'strategia' });

sheet(`<div class="quote-wrap"><p class="kicker caps">Osobowość i pozycjonowanie</p><p class="traits">${content.strategy.personality.join(', ')}.</p><p class="avoid">Unikamy: ${content.strategy.avoids}.</p><blockquote>${content.strategy.positioning}</blockquote></div>`, { tone: 'dark', section: 'strategia' });

const directions = [...content.process.rejected.map((item, i) => ({ ...item, label: `Odrzucony ${i + 1}` })), { title: content.process.chosen.title, reason: content.process.chosen.reason, thumb: 'figures/direction-wersalik.svg', label: 'Wybrany', chosen: true }];
sheet(`${heading('Proces', 'Trzy kierunki, jeden wybrany', content.process.intro)}<div class="three plates">${directions.map(item => `<article class="${item.chosen ? 'chosen' : ''}"><div class="plate"><img src="${svgUri(item.thumb)}" alt=""></div><p class="caps lab">${item.label}</p><h3>${item.title}</h3><p>${item.reason}</p></article>`).join('')}</div>`, { section: 'proces' });

sheet(`${heading('Proces', 'Dopracowanie wybranego znaku')}<div class="three">${content.process.refinement.map((step, i) => `<article><p class="num">${String(i + 1).padStart(2, '0')}</p><h3>${step.title}</h3><p>${step.text}</p></article>`).join('')}</div>`, { section: 'proces' });

sheet(`${heading('Logo', 'Znak główny')}<div class="stage">${logo('primary', 'color', 'height:300px;width:auto')}</div><p class="caption">Kapitaliki w rozstawie 0,2 em, mosiężna linia i napis Hotel, Winnica o tej samej szerokości co nazwa. Ten znak stosujemy zawsze, gdy jest miejsce.</p>`, { section: 'logo' });

sheet(`${heading('Logo', 'Sygnet', 'Litera C w podwójnym cienkim kole i jedna mosiężna kropka. Poniżej 48 pikseli używamy sygnetu uproszczonego.')}<div class="pair"><figure><div class="stage small">${logo('symbol', 'color', 'height:300px;width:auto')}</div><figcaption class="caps">Sygnet pełny, od 48 px</figcaption></figure><figure><div class="stage small">${simpleSymbol('height:300px;width:auto')}</div><figcaption class="caps">Sygnet uproszczony, od 16 px</figcaption></figure></div>`, { section: 'logo' });

const variants = [
  ['primary', 'Główne', 'color', c.papier], ['horizontal', 'Poziome', 'color', c.kosc], ['vertical', 'Pionowe', 'color', c.papier],
  ['symbol', 'Sygnet', 'color', c.kosc], ['mono-black', 'Jednokolorowe', 'mono', '#ffffff'], ['negative', 'Negatyw', 'negative', c.czern],
];
sheet(`${heading('Logo', 'Sześć wariantów')}<div class="tiles">${variants.map(([variant, nameText, scheme, bg]) => `<figure style="background:${bg}">${logo(['mono-black', 'negative'].includes(variant) ? 'primary' : variant, scheme, 'max-height:200px;max-width:78%;width:auto;height:auto')}<figcaption class="caps" style="color:${bg === c.czern ? c.kamien : c.wegiel}">${nameText}</figcaption></figure>`).join('')}</div>`, { section: 'logo' });

sheet(`${heading('Logo', 'Ręczny kerning', content.process.refinement[0].text)}<div class="pair"><figure><div class="stage small plain"><img src="${svgUri('figures/wordmark-default.svg')}" alt="" style="width:86%"></div><figcaption class="caps">Bez korekty</figcaption></figure><figure><div class="stage small plain"><img src="${svgUri('figures/wordmark-kerned.svg')}" alt="" style="width:86%"></div><figcaption class="caps">Po korekcie</figcaption></figure></div>`, { section: 'logo' });

sheet(`${heading('Logo', 'Pole ochronne i rozmiar minimalny', extras.clearSpace)}<div class="cols"><div class="stage small plain"><img src="${svgUri('figures/clearspace.svg')}" alt="" style="width:94%;height:auto"></div><dl class="facts"><div><dt class="caps">Sygnet uproszczony</dt><dd>${extras.minimum.symbol}</dd></div><div><dt class="caps">Pełny sygnet</dt><dd>${extras.minimum.fullStamp}</dd></div><div><dt class="caps">Logo główne</dt><dd>${extras.minimum.primary}</dd></div></dl></div>`, { section: 'logo' });

const misuse = [
  ['Nie rozciągamy', 'transform:scaleX(1.45)'],
  ['Nie obracamy', 'transform:rotate(14deg)'],
  ['Nie zmieniamy koloru', 'filter:hue-rotate(160deg) saturate(2.4)'],
  ['Nie dodajemy cienia ani złota', 'filter:drop-shadow(8px 12px 5px rgba(0,0,0,.5))'],
];
sheet(`${heading('Logo', 'Czego nie robimy')}<div class="four">${misuse.map(([text, style]) => `<figure class="misuse"><div>${logo('symbol', 'color', `height:230px;width:auto;${style}`)}</div><figcaption>${text}</figcaption></figure>`).join('')}</div>`, { section: 'logo' });

sheet(`${heading('Kolor', 'Paleta', 'Dziesięć kolorów: ciepła czerń, kość słoniowa i jeden mosiądz. Wartości CMYK są przybliżone, do druku zamów próbę.')}<div class="swatches">${palette.map(entry => `<figure><div class="chip" style="background:${entry.hex}"></div><figcaption><b>${entry.name}</b><span>${entry.hex}</span><span>${entry.rgbCss}</span><span>${entry.oklchCss}</span><span>${entry.cmykApproxText}</span></figcaption></figure>`).join('')}</div>`, { section: 'kolor' });

sheet(`${heading('Kolor', 'Kontrast')}<table class="contrast"><thead><tr><th>Użycie</th><th>Tekst</th><th>Tło</th><th>Stosunek</th><th>Poziom</th></tr></thead><tbody>${contrast.map(row => `<tr><td>${row.use}</td><td><i style="background:${row.fgHex}"></i>${colorName(row.fg)}</td><td><i style="background:${row.bgHex}"></i>${colorName(row.bg)}</td><td>${row.ratio.toFixed(1).replace('.', ',')}:1</td><td>${row.kind === 'decorative' ? 'dekoracja' : row.level}</td></tr>`).join('')}</tbody></table>`, { section: 'kolor' });

const shares = [['kosc', 55], ['czern', 28], ['len', 8], ['mosiadz', 3], ['papier', 6]];
sheet(`${heading('Kolor', 'Proporcje użycia', 'Kość niesie stronę, czerń daje okładkę i tekst. Mosiądz pojawia się rzadko, jako jedna cienka linia albo kropka, nigdy jako tło.')}<div class="bar">${shares.map(([id, w]) => `<div style="flex:${w};background:${c[id]};color:${['czern'].includes(id) ? c.kosc : c.czern}"><span class="caps">${colorName(id)} ${w} %</span></div>`).join('')}</div>`, { section: 'kolor' });

sheet(`${heading('Typografia', 'Dwa kroje')}<div class="cols"><div class="face"><p class="mega display">Noto Serif Display</p><p class="specimen display">${extras.specimen}</p><p class="small">Nagłówki i znak. Grubości 200, 300, 400, 500 i kursywa 300, 400. Kapitaliki ze światłem.</p></div><div class="face"><p class="mega text">Source Serif 4</p><p class="specimen text">${extras.specimen}</p><p class="small">Tekst. Grubości 400 i 600, kursywa 400. Licencja OFL.</p></div></div>`, { section: 'typografia' });

sheet(`${heading('Typografia', 'Skala pisma')}<div class="scale">${extras.typeScale.map(row => `<div><span class="s-${row.font}" style="font-size:${Math.min(row.size * 1.6, 96)}px;font-weight:${row.weight}">${row.name}</span><span class="small">${row.size} px, interlinia ${String(row.line).replace('.', ',')}. ${row.use}</span></div>`).join('')}</div>`, { section: 'typografia' });

sheet(`${heading('Typografia', 'Polskie znaki i kapitaliki', 'Oba kroje mają komplet polskich liter, kapitaliki z ogonkami, cudzysłowy drukarskie i kropkę środkową.')}<p class="glyphs display">${extras.glyphs}</p><p class="glyphs caps">Hotel · Winnica, Ślęża, Sobótka</p><p class="glyphs text">${extras.glyphs}</p>`, { section: 'typografia' });

sheet(`${heading('Ikony', 'Dwanaście piktogramów', 'Cienka kreska 1,25 px na siatce 24 px, proste zakończenia, ostre narożniki. Do wskazywania drogi, nigdy do ozdoby.')}<div class="icons">${brand.iconNames.map(nameText => `<figure><img src="${dataUri(iconSvg(nameText, c.czern))}" alt=""><figcaption class="caps">${nameText}</figcaption></figure>`).join('')}</div>`, { section: 'ikony' });

sheet(`${heading('Wzór i grafika', 'Wzór szpaleru', extras.graphics[0].text)}<div class="pattern" style="background-image:url('${svgUri(file.pattern)}')"></div><div class="three two">${extras.graphics.slice(1).map(item => `<article><h3>${item.title}</h3><p>${item.text}</p></article>`).join('')}</div>`, { section: 'wzór' });

sheet(`${heading('Zdjęcia i układ', 'Styl zdjęć i zasady układu')}<div class="cols"><div class="prose"><p>${extras.photoStyle}</p></div><ul class="rules one">${extras.layoutRules.map(rule => `<li>${rule}</li>`).join('')}</ul></div>`, { section: 'zdjęcia' });

sheet(`${heading('Ton głosu', 'Cztery zasady')}<div class="tone">${content.tone.map(rule => `<article><h3>${rule.title}</h3><p>${rule.text}</p><p class="yes"><span class="caps">Tak</span>${rule.yes}</p><p class="no"><span class="caps">Nie</span>${rule.no}</p></article>`).join('')}</div>`, { section: 'ton głosu' });

const mock = (path, extra = '') => `<img class="mock" style="${extra}" src="${jpeg(path)}" alt="">`;
sheet(`${heading('Zastosowania', 'Wizytówka i papier firmowy')}<div class="mocks">${mock(file.cardFront)}${mock(file.cardBack)}${mock(file.letterhead)}</div>`, { section: 'zastosowania' });
sheet(`${heading('Zastosowania', 'Etykieta, zawieszka i karta')}<div class="mocks one">${mock(file.application)}</div>`, { section: 'zastosowania' });
sheet(`${heading('Zastosowania', 'Podpis e-mail')}<div class="mocks one"><img class="mock" src="${jpeg(file.emailMock)}" alt=""></div>`, { section: 'zastosowania' });
sheet(`${heading('Zastosowania', 'Media społecznościowe')}<div class="posts">${[1, 2, 3].map(n => `<img src="${png(file.post(n))}" alt="">`).join('')}</div>`, { section: 'zastosowania' });

sheet(`<div class="end"><div class="end-logo">${logo('vertical', 'negative', 'height:520px;width:auto')}</div><div><p class="kicker caps">Animacja i kontakt</p><p class="end-text">${extras.animation}</p><dl class="facts"><div><dt class="caps">Adres</dt><dd>${contact.street}, ${contact.city}</dd></div><div><dt class="caps">Telefon</dt><dd>${contact.phone}</dd></div><div><dt class="caps">E-mail</dt><dd>${contact.email}</dd></div></dl></div></div>`, { tone: 'dark', section: 'kontakt' });

if (sheets.length !== total) throw new Error(`expected ${total} pages, built ${sheets.length}`);

const css = `
${baseCss()}
@page{size:1920px 1080px;margin:0}
html,body{margin:0}
.page{position:relative;width:1920px;height:1080px;overflow:hidden;page-break-after:always;break-after:page;padding:170px 240px 130px;background:${c.kosc};color:${c.czern}}
.page.dark{background:${c.czern};color:${c.kosc}}
.page header{position:absolute;left:240px;right:240px;top:64px;display:flex;justify-content:space-between;align-items:baseline;font-size:18px;color:${c.wegiel};padding-bottom:18px;border-bottom:1px solid ${c.mosiadz}}
.page.dark header,.page.dark footer{color:${c.kamien}}
.folio{font:400 20px/1 'Cuvee Display',serif;letter-spacing:.12em;font-variant-numeric:oldstyle-nums}
.page footer{position:absolute;left:240px;bottom:52px;font-size:15px;color:${c.wegiel}}
.page.cover{background:${c.czern};padding:0}
.cover-logo{position:absolute;left:240px;top:190px;width:1000px}
.cover-foot{position:absolute;left:240px;bottom:150px}
.cover-title{font:200 italic 64px/1.1 'Cuvee Display',serif;color:${c.kosc}}
.cover-sub{font-size:22px;color:${c.mosiadz};margin-top:20px}
.cover-note{position:absolute;left:240px;bottom:60px;font-size:16px;color:${c.kamien}}
.page.cover::before{content:'';position:absolute;left:96px;top:96px;right:96px;bottom:96px;border:1px solid ${c.mosiadz}}
.kicker{font-size:19px;color:${c['mosiadz-ciemny']};margin-bottom:22px}
.page.dark .kicker{color:${c.mosiadz}}
h2{font:200 88px/1.04 'Cuvee Display',serif;margin-bottom:24px;letter-spacing:-.005em}
h3{font:300 40px/1.12 'Cuvee Display',serif;margin-bottom:14px}
.lead{font:italic 400 31px/1.5 'Cuvee Text',serif;max-width:1180px;color:${c.wegiel}}
.page.dark .lead{color:${c.kamien}}
.head{margin-bottom:46px}
.small{font:400 21px/1.5 'Cuvee Text',serif;color:${c.wegiel}}
.cols{display:grid;grid-template-columns:1.25fr 1fr;gap:110px;align-items:start}
.cols.wide-gap{gap:140px}
.prose p{font:400 26px/1.6 'Cuvee Text',serif;margin-bottom:22px;max-width:820px}
.prose.wide p{max-width:1250px;font-size:30px}
.facts{margin:0}
.facts div{border-top:1px solid ${c.mosiadz};padding:20px 0 24px}
.facts dt{font-size:17px;color:${c['mosiadz-ciemny']};margin-bottom:8px}
.facts dd{margin:0;font:400 27px/1.4 'Cuvee Text',serif}
.words{display:flex;flex-direction:column}
.words span{font:200 italic 128px/1.04 'Cuvee Display',serif}
.three{display:grid;grid-template-columns:repeat(3,1fr);gap:70px}
.three.two{grid-template-columns:repeat(2,1fr)}
.three.two h3{font-size:34px}
.three article{border-top:1px solid ${c.mosiadz};padding-top:24px}
.three p:not(.num):not(.lab){font:400 23px/1.55 'Cuvee Text',serif}
.num{font:300 italic 34px/1 'Cuvee Display',serif;color:${c['mosiadz-ciemny']};margin-bottom:18px;font-variant-numeric:oldstyle-nums}
.plates .plate{height:170px;background:${c.papier};display:grid;place-items:center;margin-bottom:22px;border:1px solid ${c.kamien}}
.plates .plate img{height:130px}
.plates .lab{font-size:16px;color:${c['mosiadz-ciemny']};margin-bottom:8px}
.plates .chosen .plate{border-color:${c.mosiadz}}
.plates h3{font-size:34px}
.plates p:last-child{font-size:19px!important;line-height:1.5!important}
.quote-wrap{position:absolute;left:240px;right:240px;top:190px}
.traits{font:200 italic 110px/1.05 'Cuvee Display',serif;margin-bottom:22px}
.avoid{font:400 24px/1.5 'Cuvee Text',serif;color:${c.kamien};margin-bottom:60px}
blockquote{margin:0;border-top:1px solid ${c.mosiadz};padding-top:36px;font:300 italic 44px/1.35 'Cuvee Display',serif;max-width:1300px}
.stage{height:470px;display:grid;place-items:center;background:${c.papier};border:1px solid ${c.kamien}}
.stage.small{height:400px}
.stage.plain{background:${c.papier}}
.caption{font:italic 400 26px/1.5 'Cuvee Text',serif;margin-top:28px;max-width:1200px;color:${c.wegiel}}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:50px}
.pair figure{margin:0}
.pair figcaption{font-size:17px;color:${c.wegiel};margin-top:16px}
.tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:30px}
.tiles figure{margin:0;height:290px;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;border:1px solid ${c.kamien}}
.tiles figcaption{position:absolute;left:24px;bottom:16px;font-size:16px}
.misuse{margin:0}
.misuse div{height:340px;background:${c.papier};display:grid;place-items:center;overflow:hidden;border:1px solid ${c.kamien}}
.misuse figcaption{font:italic 400 23px/1.3 'Cuvee Text',serif;margin-top:16px}
.four{display:grid;grid-template-columns:repeat(4,1fr);gap:34px}
.swatches{display:grid;grid-template-columns:repeat(5,1fr);gap:30px 26px}
.swatches figure{margin:0}
.chip{height:96px;border:1px solid ${c.kamien}}
.swatches figcaption{display:grid;gap:3px;padding-top:12px;font:400 17px/1.3 'Cuvee Text',serif}
.swatches b{font:300 27px/1.15 'Cuvee Display',serif}
.contrast{width:100%;border-collapse:collapse;font:400 17px/1.15 'Cuvee Text',serif}
.contrast th{text-align:left;font:400 14px/1 'Cuvee Display',serif;font-variant-caps:all-small-caps;letter-spacing:.2em;padding:0 10px 12px 0;color:${c['mosiadz-ciemny']}}
.contrast td{padding:5px 10px 5px 0;border-top:1px solid ${c.kamien}}
.contrast i{display:inline-block;width:15px;height:15px;border-radius:50%;margin-right:9px;vertical-align:-2px;border:1px solid ${c.czern}}
.bar{display:flex;height:420px;border:1px solid ${c.czern}}
.bar div{min-width:150px;white-space:nowrap;display:flex;align-items:flex-end;padding:20px;font-size:18px;border-right:1px solid ${c.kamien}}
.bar div:last-child{border-right:0}
.face .mega{font-size:78px;line-height:1.05;margin-bottom:36px}
.face .specimen{font-size:40px;line-height:1.35;margin-bottom:28px}
.display{font-family:'Cuvee Display',serif;font-weight:300}
.text{font-family:'Cuvee Text',serif}
.scale{display:grid;gap:14px}
.scale div{display:grid;grid-template-columns:600px 1fr;align-items:baseline;gap:40px;border-top:1px solid ${c.kamien};padding-top:14px}
.s-display{font-family:'Cuvee Display',serif}
.s-text{font-family:'Cuvee Text',serif}
.s-caps{font-family:'Cuvee Display',serif;font-variant-caps:all-small-caps;letter-spacing:.22em}
.glyphs{font-size:76px;line-height:1.35;margin:10px 0}
.glyphs.caps{font-size:62px}
.icons{display:grid;grid-template-columns:repeat(6,1fr);gap:26px}
.icons figure{margin:0;background:${c.papier};height:210px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;border:1px solid ${c.kamien}}
.icons img{width:88px}
.icons figcaption{font-size:15px;color:${c.wegiel}}
.pattern{height:230px;background-size:150px;background-color:${c.papier};border:1px solid ${c.kamien};margin-bottom:40px}
.rules{margin:0;padding:0;list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:20px 70px}
.rules.one{grid-template-columns:1fr;gap:18px}
.rules li{font:400 22px/1.45 'Cuvee Text',serif;border-top:1px solid ${c.mosiadz};padding-top:12px}
.tone{display:grid;grid-template-columns:1fr 1fr;gap:40px 80px}
.tone article{border-top:1px solid ${c.mosiadz};padding-top:22px}
.tone h3{font-size:34px;margin-bottom:8px}
.tone p{font:400 22px/1.45 'Cuvee Text',serif}
.tone .yes{margin-top:12px}
.tone .no{color:${c.wegiel};text-decoration:line-through;text-decoration-color:${c.mosiadz}}
.tone p span{display:inline-block;width:70px;font-size:15px;color:${c['mosiadz-ciemny']};text-decoration:none}
.mocks{display:grid;grid-template-columns:1fr 1fr 1fr;gap:30px;align-items:start}
.mocks .mock{width:100%;height:560px;object-fit:cover;object-position:top center}
.mocks.one{grid-template-columns:1fr}
.mocks.one .mock{height:600px;object-fit:contain;object-position:center}
.posts{display:flex;gap:36px;justify-content:flex-start}
.posts img{height:560px;width:auto;border:1px solid ${c.kamien}}
.toc{list-style:none;margin:0;padding:0;columns:2;column-gap:120px}
.toc li{display:grid;grid-template-columns:70px 1fr auto;border-top:1px solid ${c.mosiadz};padding:20px 0 24px;break-inside:avoid;align-items:baseline}
.toc .name{font:300 40px/1 'Cuvee Display',serif}
.toc .num,.toc .pg{font:300 italic 24px/1 'Cuvee Display',serif;color:${c['mosiadz-ciemny']};font-variant-numeric:oldstyle-nums;margin:0}
.end{display:grid;grid-template-columns:1fr 1fr;gap:120px;align-items:center;margin-top:20px}
.end-text{font:italic 400 28px/1.55 'Cuvee Text',serif;color:${c.kamien};margin-bottom:46px}
.page.dark .facts div{border-color:${c.mosiadz}}
.page.dark .facts dt{color:${c.mosiadz}}
`;

const html = `<!doctype html><html lang="pl"><meta charset="utf-8"><title>Cuvée, księga identyfikacji</title><style>${css}</style><body>${sheets.join('')}</body></html>`;

await withBrowser(browser => htmlToPdf(browser, { outDir: brand.paths.out, name: 'brandbook', html, out: pub(file.brandbook), width: 1920, height: 1080 }));
console.log(`  ${file.brandbook} (${sheets.length} pages)`);
