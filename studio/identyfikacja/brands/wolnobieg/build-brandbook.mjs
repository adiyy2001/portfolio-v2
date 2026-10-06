import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { colorTable, contrastTable } from '../../lib/brand.mjs';
import { htmlToPdf, withBrowser } from '../../lib/browser.mjs';
import { arcsSvg, bikeSvg } from './art.mjs';
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
const ribbonColors = {
  cream: [c.pomarancz, c.musztarda, c.brazowy],
  sand: [c.pomarancz, c.musztarda, c.brazowy],
  orange: [c.kakao, c['krem-jasny'], c.musztarda],
  mustard: [c.brazowy, c.pomarancz, c['krem-jasny']],
  brown: [c.musztarda, c.pomarancz, c['krem-jasny']],
  olive: [c.musztarda, c.pomarancz, c['krem-jasny']],
  dark: [c.musztarda, c.pomarancz, c['krem-jasny']],
};
const ribbon = tone => {
  const colors = ribbonColors[tone];
  const paths = colors.map((color, i) => {
    const r = 176 - i * 24;
    return `<path d="M${200 - r} -10V880A${r} ${r} 0 0 0 200 ${880 + r}H1930" fill="none" stroke="${color}" stroke-width="16"/>`;
  });
  return `<svg class="ribbon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080" aria-hidden="true">${paths.join('')}</svg>`;
};
const sheet = (title, body, { tone = 'cream', kicker = '', bare = false } = {}) => {
  const number = sheets.length + 1;
  sheets.push(`<section class="page ${tone}${bare ? ' bare' : ''}">${bare ? '' : ribbon(tone)}<header><span class="chip">${kicker || title}</span></header><span class="pageno">${number}</span>${body}<footer>Wolnobieg, księga identyfikacji. Projekt przykładowy.</footer></section>`);
};

const titleBlock = (kicker, title, lead = '') => `<div class="head"><p class="kicker">${kicker}</p><h2>${title}</h2>${lead ? `<p class="lead">${lead}</p>` : ''}</div>`;
const arcs = (corner, options = {}) => arcsSvg({ w: 1920, h: 1080, corner, width: 60, gap: 22, start: 220, style: 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none', ...options });

sheets.push(`<section class="page cover">${arcs('br', { width: 70, gap: 26, start: 420, colors: [c.kakao, c.musztarda, c['krem-jasny']] })}<div class="cover-badge">${logoIn('symbol', onOrange, 'width:100%;height:auto')}</div><div class="cover-text"><p class="kicker">Księga identyfikacji wizualnej</p><h1>Wolnobieg</h1><p class="lead">${content.lead}</p><p class="small">Serwis i sklep rowerowy, Gdańsk. Projekt przykładowy: Wolnobieg to zmyślona firma.</p></div></section>`);

const tocRows = [
  ['Klient i zadanie', 3], ['Kierunek i strategia', 4], ['Proces', 7], ['Logo', 9], ['Kolor', 14], ['Typografia', 17], ['Ikony, wzór i grafika', 20], ['Zdjęcia i ton głosu', 23], ['Zastosowania', 25], ['Animacja i kontakt', 27],
];
sheet('Spis treści', `<div class="toc-left"><h2>Co jest w środku</h2><div class="toc-bike">${bikeSvg({ frame: c.musztarda, tire: c['krem-jasny'], accent: c.pomarancz, style: 'width:100%;height:auto;display:block' })}</div></div><ol class="toc">${tocRows.map(([name, page], i) => `<li class="t${i % 3}"><b>${i + 1}</b><span>${name}</span><i>${String(page).padStart(2, '0')}</i></li>`).join('')}</ol>`, { tone: 'brown' });

sheet('Klient i zadanie', `${titleBlock('Klient i zadanie', 'Warsztat z tablicą ze sprayu')}<div class="cols"><div class="prose">${content.client.paragraphs.map(text => `<p>${text}</p>`).join('')}</div><dl class="tags">${content.client.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></div>`, { tone: 'orange' });

sheet('Kierunek', `${titleBlock('Kierunek', content.direction.title)}<div class="cols"><div class="prose">${content.direction.paragraphs.map(text => `<p>${text}</p>`).join('')}</div><div class="words">${content.direction.keywords.map(word => `<span>${word}</span>`).join('')}</div></div>`, { tone: 'mustard' });

sheet('Strategia', `${titleBlock('Strategia', 'Dla kogo i o czym', content.strategy.audience)}<div class="coins">${content.strategy.values.map((value, i) => `<article class="coin c${i}"><h3>${value.title}</h3><p>${value.text}</p></article>`).join('')}</div>`);

sheet('Osobowość', `${arcs('tr', { width: 50, gap: 20, start: 150, colors: [c.musztarda, c.pomarancz, c.krem] })}${titleBlock('Strategia', 'Osobowość i pozycjonowanie')}<div class="cols"><div class="prose"><p class="big">Marka jest: ${content.strategy.personality.join(', ')}.</p><p>Unikamy: ${content.strategy.avoids}.</p></div><blockquote>${content.strategy.positioning}</blockquote></div>`, { tone: 'dark' });

sheet('Proces', `${titleBlock('Proces', 'Trzy kierunki, jeden wybrany', content.process.intro)}<div class="three picks">${[...content.process.rejected, { title: content.process.chosen.title, reason: content.process.chosen.reason, thumb: 'figures/direction-kolo.svg', chosen: true }].slice(0, 3).map(item => `<article class="pick ${item.chosen ? 'chosen' : ''}"><div class="disc"><img src="${svgUri(item.thumb)}" alt=""></div><h3>${item.title}</h3><p>${item.reason}</p></article>`).join('')}</div>`);

sheet('Wybrany kierunek', `${titleBlock('Proces', content.process.chosen.title, content.process.chosen.reason)}<div class="three">${content.process.refinement.map((step, i) => `<article class="card leaf${i % 2}"><h3>${step.title}</h3><p>${step.text}</p></article>`).join('')}</div>`, { tone: 'orange' });

sheet('Logo główne', `${titleBlock('Logo', 'Znak główny')}<div class="stage" style="background:${c.krem}">${logoIn('primary', {}, 'height:380px;width:auto')}</div><p class="caption">Napis Wolnobieg w kroju Rammetto One na zboczu minus cztery stopnie i trzy pasy pod nim. Gdy jest miejsce, dodajemy odznakę z zębatką.</p>`);

const variantTiles = [
  ['primary', 'Główne', c.krem, {}],
  ['horizontal', 'Poziome', c['krem-jasny'], {}],
  ['vertical', 'Pionowe', c.piasek, {}],
  ['symbol', 'Sygnet', c.pomarancz, onOrange],
  ['mono-black', 'Jednokolorowe', '#ffffff', {}],
  ['negative', 'Negatyw', c.kakao, {}],
];
sheet('Warianty logo', `${titleBlock('Logo', 'Sześć wariantów')}<div class="tiles">${variantTiles.map(([variant, name, bg, map]) => `<figure style="background:${bg}">${logoIn(variant, map, 'max-height:190px;max-width:80%;width:auto')}<figcaption style="color:${variant === 'negative' ? c['krem-jasny'] : c.kakao}">${name}</figcaption></figure>`).join('')}</div>`, { tone: 'sand' });

sheet('Kerning', `${titleBlock('Logo', 'Ręczny kerning', content.process.refinement[0].text)}<div class="pair"><figure><img src="${svgUri('figures/wordmark-default.svg')}" alt=""><figcaption>Bez korekty</figcaption></figure><figure><img src="${svgUri('figures/wordmark-kerned.svg')}" alt=""><figcaption>Po korekcie</figcaption></figure></div>`, { tone: 'mustard' });

sheet('Pole ochronne', `${titleBlock('Logo', 'Pole ochronne i rozmiar', extras.clearSpace)}<div class="cols"><div class="stage small" style="background:${c.krem}"><img src="${svgUri('figures/clearspace.svg')}" alt="" style="width:80%;height:auto"></div><dl class="facts"><div><dt>Sygnet</dt><dd>${extras.minimum.symbol}</dd></div><div><dt>Pełna odznaka</dt><dd>${extras.minimum.fullBadge}</dd></div><div><dt>Logo główne</dt><dd>${extras.minimum.primary}</dd></div></dl></div>`);

const misuse = [
  ['Nie rozciągamy', 'transform:scaleX(1.5)'],
  ['Nie obracamy', 'transform:rotate(24deg)'],
  ['Nie zmieniamy koloru', 'filter:hue-rotate(150deg) saturate(2)'],
  ['Nie dodajemy cienia', 'filter:drop-shadow(10px 14px 6px rgba(0,0,0,.45))'],
];
sheet('Czego nie robić', `${titleBlock('Logo', 'Czego nie robimy')}<div class="four">${misuse.map(([text, style]) => `<figure class="misuse"><div>${logoIn('symbol', {}, `height:230px;width:auto;${style}`)}</div><figcaption>${text}</figcaption></figure>`).join('')}</div>`, { tone: 'brown' });

sheet('Paleta', `${titleBlock('Kolor', 'Paleta', 'Trzynaście kolorów z lat siedemdziesiątych: pomarańcz, musztarda, brąz i awokado na kremie. Wartości CMYK są przybliżone, do druku zamów próbę.')}<div class="swatches">${palette.map(entry => `<figure><div class="chip-c" style="background:${entry.hex}"></div><figcaption><b>${entry.name}</b><span>${entry.hex}</span><span>${entry.rgbCss}</span><span>${entry.cmykApproxText}</span><em>${entry.role}</em></figcaption></figure>`).join('')}</div>`);

sheet('Kontrast', `${titleBlock('Kolor', 'Kontrast')}<table class="contrast"><thead><tr><th>Użycie</th><th>Tekst</th><th>Tło</th><th>Stosunek</th><th>Poziom</th></tr></thead><tbody>${contrast.slice(0, 16).map(row => `<tr><td>${row.use}</td><td><i style="background:${row.fgHex}"></i>${colorName(row.fg)}</td><td><i style="background:${row.bgHex}"></i>${colorName(row.bg)}</td><td>${row.ratio.toFixed(1)}:1</td><td>${row.kind === 'decorative' ? 'dekoracja' : row.level}</td></tr>`).join('')}</tbody></table>`, { tone: 'sand' });

const shares = [['krem-jasny', 36], ['brazowy', 20], ['pomarancz', 18], ['musztarda', 12], ['awokado', 8], ['kakao', 6]];
sheet('Proporcje', `${titleBlock('Kolor', 'Proporcje użycia', 'Krem niesie stronę, brąz niesie tekst, pomarańcz i musztarda dają ciepło pasów. Awokado pojawia się rzadko, jak detal na ramie.')}<div class="bar">${shares.map(([id, w]) => `<div style="flex:${w};background:${c[id]}"></div>`).join('')}</div><ul class="legend">${shares.map(([id, w]) => `<li><i style="background:${c[id]}"></i>${colorName(id)} ${w}%</li>`).join('')}</ul>`, { tone: 'orange' });

sheet('Kroje', `${titleBlock('Typografia', 'Dwa kroje')}<div class="cols"><div class="face"><p class="mega display">Rammetto One</p><p class="specimen display">${extras.specimen}</p><p class="small">Nagłówki i napis logo. Jedna grubość, 400.</p></div><div class="face"><p class="mega text">Baloo 2</p><p class="specimen text">${extras.specimen}</p><p class="small">Tekst. Grubości 400, 600 i 800.</p></div></div>`, { tone: 'brown' });

sheet('Skala', `${titleBlock('Typografia', 'Skala pisma')}<div class="scale">${extras.typeScale.map(row => `<div><span class="${row.font}" style="font-size:${Math.min(row.size * 1.6, 90)}px;font-weight:${row.weight ?? 400};line-height:1.1">${row.name}</span><span class="small">${row.size} px, interlinia ${row.line}. ${row.use}</span></div>`).join('')}</div>`);

sheet('Polskie znaki', `${titleBlock('Typografia', 'Polskie znaki', 'Oba kroje mają komplet polskich liter, cudzysłowy drukarskie i kropkę środkową.')}<p class="glyphs display">${extras.glyphs}</p><p class="glyphs text">${extras.glyphs}</p>`, { tone: 'mustard' });

sheet('Ikony', `${titleBlock('Ikony', 'Dwanaście ikon', 'Rysowane kreską 2,1 px na siatce 24 px, z okrągłymi końcami.')}<div class="icons">${brand.iconNames.map(name => `<figure><img src="${dataUri(iconSvg(name, c.kakao))}" alt=""><figcaption>${name}</figcaption></figure>`).join('')}</div>`);

sheets.push(`<section class="page bare patternpage" style="background-color:${c.krem};background-image:url('${svgUri(file.pattern)}')"><header><span class="chip">Wzór</span></header><span class="pageno">${sheets.length + 1}</span><div class="plate"><p class="kicker">Wzór</p><h2>Wzór z łuków</h2><p class="lead">${extras.graphics[0].text}</p></div><footer>Wolnobieg, księga identyfikacji. Projekt przykładowy.</footer></section>`);

sheet('Grafika', `${titleBlock('Grafika', 'Faktura i układ')}<div class="cols"><div class="three-stack">${extras.graphics.slice(1).map((item, i) => `<article class="card leaf${i % 2}"><h3>${item.title}</h3><p>${item.text}</p></article>`).join('')}</div><ul class="rules">${extras.layoutRules.map(rule => `<li>${rule}</li>`).join('')}</ul></div>`, { tone: 'sand' });

sheet('Zdjęcia', `${arcs('br', { width: 60, gap: 22, start: 300, colors: [c.musztarda, c.pomarancz, c['krem-jasny']] })}${titleBlock('Zdjęcia', 'Styl zdjęć')}<div class="prose wide"><p>${extras.photoStyle}</p></div>`, { tone: 'olive', bare: true });

sheet('Ton głosu', `${titleBlock('Ton głosu', 'Cztery zasady')}<div class="tone">${content.tone.map((rule, i) => `<article class="leaf${i % 2}"><h3>${rule.title}</h3><p>${rule.text}</p><p class="yes"><b>Tak</b>${rule.yes}</p><p class="no"><b>Nie</b>${rule.no}</p></article>`).join('')}</div>`);

const mock = path => `<img class="mock" src="${jpeg(path)}" alt="">`;
sheet('Wizytówka i papier', `${titleBlock('Zastosowania', 'Wizytówka i papier firmowy')}<div class="mocks">${mock(file.cardFront)}${mock(file.cardBack)}${mock(file.letterhead)}</div>`, { tone: 'brown' });
sheet('Szyld i cyfra', `${titleBlock('Zastosowania', 'Szyld, przywieszka i e-mail')}<div class="mocks wide">${mock(file.application)}${mock(file.emailMock)}</div>`, { tone: 'mustard' });

sheet('Animacja i kontakt', `${arcs('br', { width: 60, gap: 22, start: 330 })}${titleBlock('Animacja', 'Odznaka toczy się na miejsce', extras.animation)}<div class="end"><div>${logoIn('negative', {}, 'height:300px;width:auto')}</div><dl class="facts"><div><dt>Adres</dt><dd>${contact.street}, ${contact.city}</dd></div><div><dt>Telefon</dt><dd>${contact.phone}</dd></div><div><dt>E-mail</dt><dd>${contact.email}</dd></div></dl></div>`, { tone: 'dark', bare: true });

if (sheets.length !== total) throw new Error(`expected ${total} pages, built ${sheets.length}`);

const tones = {
  cream: { bg: c['krem-jasny'], ink: c.kakao, head: c.brazowy, card: c.krem, pill: c.brazowy, pillInk: c.krem, r1: c.pomarancz, r2: c.musztarda, r3: c.brazowy, rule: c.brazowy, kick: c.rdza },
  sand: { bg: c.piasek, ink: c.kakao, head: c.brazowy, card: c['krem-jasny'], pill: c.brazowy, pillInk: c.krem, r1: c.pomarancz, r2: c.musztarda, r3: c.brazowy, rule: c.brazowy, kick: c.kakao },
  orange: { bg: c.pomarancz, ink: c.kakao, head: c.kakao, card: c['krem-jasny'], pill: c.kakao, pillInk: c.krem, r1: c['krem-jasny'], r2: c.musztarda, r3: c.brazowy, rule: c.kakao, kick: c.kakao },
  mustard: { bg: c.musztarda, ink: c.kakao, head: c.brazowy, card: c['krem-jasny'], pill: c.brazowy, pillInk: c.krem, r1: c.pomarancz, r2: c.brazowy, r3: c['krem-jasny'], rule: c.brazowy, kick: c.kakao },
  brown: { bg: c.brazowy, ink: c.krem, head: c.krem, card: c['krem-jasny'], pill: c.krem, pillInk: c.brazowy, r1: c.musztarda, r2: c.pomarancz, r3: c.krem, rule: c.musztarda, kick: c.musztarda },
  olive: { bg: c.oliwka, ink: c['krem-jasny'], head: c['krem-jasny'], card: c['krem-jasny'], pill: c['krem-jasny'], pillInk: c.oliwka, r1: c.musztarda, r2: c.pomarancz, r3: c['krem-jasny'], rule: c.musztarda, kick: c.musztarda },
  dark: { bg: c.kakao, ink: c.krem, head: c.krem, card: c['krem-jasny'], pill: c.krem, pillInk: c.kakao, r1: c.musztarda, r2: c.pomarancz, r3: c.krem, rule: c.musztarda, kick: c.musztarda },
};
const toneCss = Object.entries(tones)
  .map(([name, t]) => `.page.${name}{--bg:${t.bg};--ink:${t.ink};--head:${t.head};--card:${t.card};--pill:${t.pill};--pill-ink:${t.pillInk};--r1:${t.r1};--r2:${t.r2};--r3:${t.r3};--rule:${t.rule};--kick:${t.kick}}`)
  .join('\n');

const css = `
${baseCss()}
@page{size:1920px 1080px;margin:0}
html,body{margin:0}
${toneCss}
.page{position:relative;width:1920px;height:1080px;overflow:hidden;page-break-after:always;break-after:page;padding:140px 130px 150px 140px;background:var(--bg);color:var(--ink)}
.page>*{position:relative;z-index:1}
.page .ribbon{position:absolute;z-index:0;left:0;top:0;width:1920px;height:1080px}
.page.bare{padding:140px 130px 120px}
.page header{position:absolute;left:140px;top:52px;z-index:2}
.chip{display:inline-block;padding:9px 24px 11px;border-radius:99px;background:var(--pill);color:var(--pill-ink);font:800 18px/1 'Wolnobieg Text';letter-spacing:.14em;text-transform:uppercase}
.pageno{position:absolute!important;right:150px;top:48px;z-index:2;display:grid;place-items:center;width:70px;height:70px;border-radius:50%;background:${c['krem-jasny']};color:${c.kakao};font:400 30px/1 'Wolnobieg Display';box-shadow:0 0 0 6px var(--r1),0 0 0 12px var(--r2),0 0 0 18px var(--r3)}
.page footer{position:absolute;left:140px;bottom:78px;font:600 17px/1 'Wolnobieg Text';color:var(--ink)}
.page.cover{background:${c.pomarancz};padding:0;display:flex;align-items:center;gap:90px;padding:0 150px}
.cover-badge{width:500px;flex:none;position:relative}
.cover-text{position:relative}
.cover-text h1{font-size:130px;line-height:1.1;margin:20px 0 34px;white-space:nowrap;transform:rotate(-4deg);transform-origin:0 100%}
.cover-text .lead{max-width:620px;margin-bottom:18px}
.cover-text .small{max-width:560px}
.cover .kicker,.cover .small{color:${c.kakao}}
.kicker{display:none;font:800 20px/1 'Wolnobieg Text';letter-spacing:.14em;text-transform:uppercase;color:var(--kick);margin-bottom:22px}
.cover .kicker,.plate .kicker{display:block}
h2{font-size:80px;line-height:1.08;margin-bottom:26px;color:var(--head);transform:rotate(-2deg);transform-origin:0 100%}
h3{font-size:34px;line-height:1.15;margin-bottom:14px;color:${c.brazowy}}
.lead{font:600 30px/1.45 'Wolnobieg Text';max-width:1200px}
.head{margin-bottom:44px;max-width:1480px}
.small{font:600 22px/1.5 'Wolnobieg Text'}
.cols{display:grid;grid-template-columns:1.25fr 1fr;gap:100px;align-items:start}
.prose p{font:400 27px/1.5 'Wolnobieg Text';margin-bottom:18px;max-width:900px}
.prose.wide p{max-width:1300px;font:600 40px/1.5 'Wolnobieg Text'}
.big{font:400 48px/1.2 'Wolnobieg Display'!important;color:${c.musztarda}}
.facts{margin:0}
.facts div{border-top:3px solid var(--rule);padding:18px 0 22px}
.facts dt{font:800 18px/1 'Wolnobieg Text';letter-spacing:.12em;text-transform:uppercase;color:var(--kick);margin-bottom:10px}
.facts dd{margin:0;font:400 28px/1.35 'Wolnobieg Text'}
.tags{margin:0;display:grid;gap:18px}
.tags div{padding:20px 32px 24px;border-radius:44px 8px 44px 8px;background:${c['krem-jasny']};color:${c.kakao}}
.tags div:nth-child(2n){background:${c.musztarda};border-radius:8px 44px 8px 44px}
.tags div:nth-child(3){background:${c.brazowy};color:${c.krem}}
.tags dt{font:800 17px/1 'Wolnobieg Text';letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px}
.tags dd{margin:0;font:600 26px/1.35 'Wolnobieg Text'}
.words{display:flex;flex-direction:column;gap:0}
.words span{font:400 130px/1.05 'Wolnobieg Display';color:${c.brazowy};transform:rotate(-4deg);transform-origin:0 100%}
.words span:nth-child(2){padding-left:70px}
.words span:nth-child(3){padding-left:140px}
blockquote{margin:0;font:400 46px/1.3 'Wolnobieg Display';border-left:10px solid ${c.pomarancz};padding-left:50px}
.three{display:grid;grid-template-columns:repeat(3,1fr);gap:40px}
.three-stack{display:grid;gap:30px}
.four{display:grid;grid-template-columns:repeat(4,1fr);gap:36px}
.card{background:var(--card);color:${c.kakao};padding:36px 40px;position:relative;border-radius:0 80px 0 80px}
.card.leaf1{border-radius:80px 0 80px 0}
.card p{font:400 25px/1.5 'Wolnobieg Text'}
.coins{display:grid;grid-template-columns:repeat(3,1fr);gap:46px;margin-top:10px}
.coin{aspect-ratio:1;border-radius:50%;display:grid;align-content:center;gap:14px;text-align:center;padding:70px 66px;background:${c.pomarancz};color:${c.kakao}}
.coin.c1{background:${c.musztarda}}
.coin.c2{background:${c.brazowy};color:${c.krem}}
.coin h3{font-size:36px;color:inherit}
.coin p{font:400 25px/1.4 'Wolnobieg Text'}
.picks{gap:50px}
.pick .disc{width:260px;aspect-ratio:1;border-radius:50%;background:${c.krem};display:grid;place-items:center;margin-bottom:26px}
.pick .disc img{width:66%}
.pick.chosen .disc{box-shadow:0 0 0 10px ${c.pomarancz},0 0 0 20px ${c.musztarda}}
.pick p{font:400 25px/1.5 'Wolnobieg Text'}
.stage{height:500px;display:grid;place-items:center;border-radius:0 120px 0 120px}
.stage.small{height:440px}
.caption{font:600 26px/1.5 'Wolnobieg Text';margin-top:30px;max-width:1300px}
.tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
.tiles figure{margin:0;height:290px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;position:relative;border-radius:0 80px 0 80px;overflow:hidden}
.tiles figure:nth-child(2n){border-radius:80px 0 80px 0}
.tiles figcaption{position:absolute;left:28px;bottom:20px;font:800 20px/1 'Wolnobieg Text'}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:40px}
.pair figure{margin:0;background:${c['krem-jasny']};color:${c.kakao};height:420px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px;border-radius:0 100px 0 100px}
.pair figure:last-child{border-radius:100px 0 100px 0}
.pair img{width:75%}
.pair figcaption{font:800 22px/1 'Wolnobieg Text'}
.misuse{margin:0}
.misuse div{height:360px;background:${c.krem};display:grid;place-items:center;overflow:hidden;border-radius:50%}
.misuse figcaption{font:600 24px/1.3 'Wolnobieg Text';margin-top:16px;text-align:center}
.swatches{display:grid;grid-template-columns:repeat(7,1fr);gap:30px 20px}
.swatches figure{margin:0}
.chip-c{width:96px;aspect-ratio:1;border-radius:50%;box-shadow:inset 0 0 0 3px ${c.kakao}}
.swatches figcaption{display:grid;gap:3px;padding-top:12px;font:400 17px/1.25 'Wolnobieg Text'}
.swatches b{font:400 24px/1.1 'Wolnobieg Display'}
.swatches em{font:600 16px/1.25 'Wolnobieg Text';color:${c.kawa};font-style:normal}
.contrast{width:100%;border-collapse:collapse;font:400 20px/1.15 'Wolnobieg Text'}
.contrast th{text-align:left;font:800 16px/1 'Wolnobieg Text';letter-spacing:.1em;text-transform:uppercase;padding:0 10px 10px;color:${c.kakao}}
.contrast td{padding:5px 10px;border-top:2px solid ${c.tyton}}
.contrast i{display:inline-block;width:20px;height:20px;border-radius:50%;margin-right:10px;vertical-align:-3px;border:2px solid ${c.kakao}}
.bar{display:flex;height:330px;border:6px solid ${c.kakao};border-radius:165px;overflow:hidden}
.legend{list-style:none;margin:36px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:16px 44px;font:800 26px/1 'Wolnobieg Text'}
.legend li{display:flex;align-items:center;gap:14px}
.legend i{width:34px;height:34px;border-radius:50%;box-shadow:inset 0 0 0 3px ${c.kakao}}
.face .mega{font-size:76px;line-height:1.1;margin-bottom:34px;white-space:nowrap}
.face .specimen{font-size:44px;line-height:1.3;margin-bottom:30px}
.display{font-family:'Wolnobieg Display',serif;font-weight:400}
.text{font-family:'Wolnobieg Text',sans-serif}
.scale{display:grid;gap:20px}
.scale div{display:grid;grid-template-columns:560px 1fr;align-items:baseline;gap:40px;border-top:3px solid ${c.len};padding-top:14px}
.glyphs{font-size:92px;line-height:1.35;margin:18px 0}
.icons{display:grid;grid-template-columns:repeat(6,1fr);gap:26px 30px}
.icons figure{margin:0;aspect-ratio:1;max-height:250px;margin-inline:auto;width:250px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;border-radius:50%;background:${c.piasek}}
.icons figure:nth-child(3n+2){background:${c.musztarda}}
.icons figure:nth-child(3n){background:${c.pomarancz}}
.icons img{width:92px}
.icons figcaption{font:600 20px/1 'Wolnobieg Text';color:${c.kakao}}
.patternpage{background-size:420px;padding:0}
.plate{position:absolute;left:140px;top:170px;width:1060px;padding:60px 70px 56px;background:${c['krem-jasny']};color:${c.kakao};border-radius:0 140px 0 140px}
.plate h2{color:${c.brazowy}}
.plate .kicker{color:${c.rdza}}
.patternpage footer{left:140px;color:${c.kakao};background:${c['krem-jasny']};padding:10px 20px;border-radius:99px;bottom:60px}
.rules{margin:0;padding:0;list-style:none;display:grid;gap:22px}
.rules li{font:400 29px/1.4 'Wolnobieg Text';border-top:3px solid ${c.brazowy};padding-top:16px}
.tone{display:grid;grid-template-columns:1fr 1fr;gap:34px 60px}
.tone article{background:${c.krem};color:${c.kakao};padding:30px 40px;border-radius:0 70px 0 70px}
.tone article.leaf1{border-radius:70px 0 70px 0}
.tone h3{font-size:32px;margin-bottom:8px}
.tone p{font:400 24px/1.4 'Wolnobieg Text'}
.tone .yes,.tone .no{margin-top:12px}
.tone .yes{color:${c.oliwka};font-weight:800}
.tone .no{color:${c.kawa};text-decoration:line-through;text-decoration-color:${c.pomarancz}}
.tone b{display:inline-block;margin-right:12px;padding:5px 12px;border-radius:99px;font:800 15px/1 'Wolnobieg Text';letter-spacing:.1em;text-transform:uppercase;color:${c['krem-jasny']};background:${c.kawa};text-decoration:none}
.tone .yes b{background:${c.oliwka}}
.mocks{display:flex;justify-content:space-between;align-items:center;gap:24px;min-height:600px}
.mocks .mock{height:430px;width:auto;border-radius:0 40px 0 40px;display:block}
.mocks.wide .mock{height:520px}
.end{display:grid;grid-template-columns:1fr 1fr;gap:100px;align-items:center}
.toc-left{position:absolute!important;left:140px;top:150px;width:700px}
.toc-left h2{font-size:104px;line-height:1.05;color:${c.krem}}
.toc-bike{width:560px;margin-top:70px}
.toc{position:absolute!important;right:150px;top:150px;width:900px;margin:0;padding:0;list-style:none;display:grid;gap:12px}
.toc li{display:grid;grid-template-columns:70px 1fr auto;align-items:center;gap:26px;padding:8px 36px 8px 8px;border-radius:99px;background:${c['krem-jasny']};color:${c.kakao}}
.toc li.t1{background:${c.musztarda}}
.toc li.t2{background:${c.pomarancz}}
.toc li b{display:grid;place-items:center;width:62px;height:62px;border-radius:50%;background:${c.brazowy};color:${c.krem};font:400 28px/1 'Wolnobieg Display'}
.toc li span{font:400 38px/1 'Wolnobieg Display'}
.toc li i{font:800 24px/1 'Wolnobieg Text';font-style:normal}
`;

const html = `<!doctype html><html lang="pl"><meta charset="utf-8"><title>Wolnobieg, księga identyfikacji</title><style>${css}</style><body>${sheets.join('')}</body></html>`;

await withBrowser(browser => htmlToPdf(browser, { outDir: brand.paths.out, name: 'brandbook', html, out: pub(file.brandbook), width: 1920, height: 1080 }));
console.log(`  ${file.brandbook} (${sheets.length} pages)`);
