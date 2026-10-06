import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { colorTable, contrastTable } from '../../lib/brand.mjs';
import { htmlToPdf, withBrowser } from '../../lib/browser.mjs';
import { dayOf, grid, variantName } from '../../../../sites/src/identyfikacja/nosna/lib/field.ts';
import { brand, c, content, contact, dataUri, extras, file, baseCss, readPub } from './theme.mjs';
import { iconSvg } from './icons.mjs';
import { markSvg } from './scenes.mjs';

const pub = path => join(brand.paths.pub, path);
const jpeg = path => `data:image/jpeg;base64,${readFileSync(pub(path)).toString('base64')}`;
const svgUri = path => dataUri(readPub(path));
const palette = colorTable(brand);
const contrast = contrastTable(brand);
const colorName = id => palette.find(entry => entry.id === id)?.name ?? id;
const total = 28;

const dayPlan = {
  piatek: { name: 'Piątek', first: 3, last: 8, start: 18 * 60, step: 20, ground: c.piatek },
  sobota: { name: 'Sobota', first: 9, last: 21, start: 20 * 60, step: 20, ground: c.sobota },
  niedziela: { name: 'Niedziela', first: 22, last: 28, start: 16 * 60, step: 15, ground: c.niedziela },
};
const dayIdOf = n => Object.keys(dayPlan).find(id => n >= dayPlan[id].first && n <= dayPlan[id].last);
const timeOf = n => {
  const plan = dayPlan[dayIdOf(n)];
  const minutes = (plan.start + (n - plan.first) * plan.step) % (24 * 60);
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
};

const sheets = [];
const sheet = (title, body, { ground = 'kosc', bleed = false, low = false } = {}) => {
  const number = sheets.length + 1;
  const id = dayIdOf(number);
  const when = id ? `${dayPlan[id].name} ${timeOf(number)}` : 'Program';
  const dark = ground === 'atrament';
  const x = ((number - 1) / (total - 1)) * 100;
  const frame = bleed
    ? `<div class="chip-no ${low ? 'low' : ''}">${String(number).padStart(2, '0')} / ${total}</div>`
    : `<header><span>${when}</span><span class="what">${title}</span><span>${String(number).padStart(2, '0')} / ${total}</span></header><i class="rail"></i><i class="rail rail--rest" style="left:${x}%"></i><i class="ring" style="left:${x}%"></i><footer>Nośna, księga identyfikacji. Projekt przykładowy.</footer>`;
  sheets.push(`<section class="page g-${ground} ${dark ? 'dark' : ''} ${bleed ? 'bleed' : ''}">${frame}${body}</section>`);
};

const logoImg = (variant, style = '') => `<img src="${svgUri(file.logoSvg(variant))}" alt="" style="${style}">`;
const head = (title, lead = '') => `<div class="head"><h2>${title}</h2>${lead ? `<p class="lead">${lead}</p>` : ''}</div>`;
const list = items => items.map(text => `<li>${text}</li>`).join('');
const mock = (path, style = '') => `<img class="mock" style="${style}" src="${jpeg(path)}" alt="">`;

sheets.push(`<section class="page cover"><div class="cover-mark">${logoImg('negative', 'width:100%')}</div><div class="cover-text"><p class="kicker">Księga identyfikacji wizualnej</p><p class="lead">${content.lead}</p><p class="small">Festiwal sztuki nowych mediów i muzyki elektronicznej, Łódź. Projekt przykładowy: Nośna to zmyślony festiwal.</p></div></section>`);

const tocDays = [
  ['piatek', [['Klient i zadanie', 3], ['Kierunek', 4], ['Strategia', 5], ['Osobowość', 6], ['Proces', 7], ['Wybrany kierunek', 8]]],
  ['sobota', [['Znak główny', 9], ['Stałe i zmienne', 10], ['Warianty', 11], ['Dwanaście pól', 12], ['Reguły generatora', 13], ['Kerning', 14], ['Pole ochronne', 15], ['Czego nie robić', 16], ['Paleta', 17], ['Kontrast', 18], ['Kroje', 20], ['Skala i znaki', 21]]],
  ['niedziela', [['Ikony', 22], ['Wzór', 23], ['Zdjęcia', 24], ['Ton głosu', 25], ['Wizytówka i papier', 26], ['Plakaty i identyfikator', 27], ['Animacja i kontakt', 28]]],
];
sheet('Spis treści', `<div class="toc">${tocDays.map(([id, rows]) => `<div class="toc-day" style="--g:${dayPlan[id].ground}"><h3>${dayPlan[id].name}</h3><ol>${rows.map(([name, page]) => `<li><span class="t">${timeOf(page)}</span><span class="n">${name}</span><span class="p">${String(page).padStart(2, '0')}</span></li>`).join('')}</ol></div>`).join('')}</div>`);

sheet('Klient i zadanie', `<div class="split"><div>${head('Festiwal, który zmienia się co dzień')}<div class="prose big">${content.client.paragraphs.map(text => `<p>${text}</p>`).join('')}</div></div><dl class="facts panel">${content.client.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></div>`, { ground: 'piatek' });

sheet('Kierunek', `<div class="split dir"><div class="words">${content.direction.keywords.map(word => `<span>${word}</span>`).join('')}</div><div>${head(content.direction.title)}<div class="prose">${content.direction.paragraphs.map(text => `<p>${text}</p>`).join('')}</div></div></div>`, { ground: 'atrament' });

sheet('Strategia', `${head('Dla kogo i o czym', content.strategy.audience)}<ol class="steps">${content.strategy.values.map((value, i) => `<li><span class="num">0${i + 1}</span><h3>${value.title}</h3><p>${value.text}</p></li>`).join('')}</ol>`, { ground: 'piatek' });

sheet('Osobowość', `<div class="split wide"><div class="persona"><p class="kicker">Marka jest</p>${content.strategy.personality.map(word => `<span>${word}</span>`).join('')}</div><div class="panel quote"><blockquote>${content.strategy.positioning}</blockquote><p class="avoid"><b>Unikamy</b> ${content.strategy.avoids}.</p></div></div>`);

sheet('Proces', `${head('Trzy kierunki, jeden wybrany', content.process.intro)}<div class="dirs">${[...content.process.rejected, { title: content.process.chosen.title, text: '', reason: content.process.chosen.reason, thumb: 'figures/direction-nosna.svg', chosen: true }].map(item => `<article class="${item.chosen ? 'chosen' : ''}"><img src="${svgUri(item.thumb)}" alt=""><div><h3>${item.title}</h3>${item.text ? `<p class="what-it-is">${item.text}</p>` : ''}<p>${item.reason}</p></div></article>`).join('')}</div>`);

sheet('Wybrany kierunek', `${head(content.process.chosen.title, 'Trzy poprawki dopracowały znak, zanim zamieniliśmy go w system.')}<div class="line3">${content.process.refinement.map((step, i) => `<div class="stop"><i class="ring"></i><span class="num">0${i + 1}</span><h3>${step.title}</h3><p>${step.text}</p></div>`).join('')}</div>`, { ground: 'piatek' });

sheet('Znak główny', `<div class="hero-mark">${logoImg('negative', 'width:1150px')}</div><p class="bleed-cap">Napis Nośna w Syne 800 z ręcznym kerningiem, linia nośna, pierścień odbiornika i pole piątku w Przędzalni przy 100 BPM. Jeden z dwunastu wariantów, wybrany na znak główny.</p>`, { ground: 'atrament', bleed: true });

sheet('Stałe i zmienne', `<div class="split">${`<div>${head('Co stałe, co generowane')}<ul class="rules">${list(extras.constants)}</ul></div>`}<div class="panel center"><img src="${svgUri('figures/days-envelope.svg')}" alt="" style="width:100%;height:auto"></div></div>`, { ground: 'sobota' });

const variantTiles = [
  ['primary', 'Główne', c.papier, c.atrament],
  ['horizontal', 'Poziome', c.kosc, c.atrament],
  ['vertical', 'Pionowe', c.papier, c.atrament],
  ['symbol', 'Sygnet', c.kosc, c.atrament],
  ['mono-black', 'Jednokolorowe', '#ffffff', c.atrament],
  ['negative', 'Negatyw', c.atrament, c.kosc],
];
sheet('Warianty logo', `${head('Warianty i ikona strony')}<div class="tiles">${variantTiles.map(([variant, name, bg, fg]) => `<figure style="background:${bg};color:${fg}">${logoImg(variant, 'max-height:56%;max-width:76%')}<figcaption>${name}</figcaption></figure>`).join('')}<figure style="background:${c.atrament};color:${c.kosc}"><img src="${svgUri('favicon.svg')}" alt="" style="height:140px"><figcaption>Ikona strony</figcaption></figure><figure class="note-tile" style="background:${c.piatek}"><p>Do 24 px używamy wyłącznie ikony strony: soczewki z nośną i pierścieniem. Od 48 px pełnego sygnetu.</p></figure></div>`);

sheet('Dwanaście pól', `<div class="grid12">${grid.map(variant => `<figure style="background:${dayOf(variant.day).color}">${markSvg(variant, { thread: c.atrament, ink: c.atrament }, 'width:86%;height:auto')}<figcaption>${variantName(variant)}</figcaption></figure>`).join('')}</div>`, { ground: 'kosc', bleed: true });

sheet('Reguły generatora', `${head('Cztery parametry')}<ol class="params">${extras.rules.map(rule => `<li><b>${rule.parameter}</b><em>${rule.sets}</em><p>${rule.text}</p></li>`).join('')}</ol>`, { ground: 'sobota' });

sheet('Kerning', `${head('Ręczny kerning napisu', content.process.refinement[0].text)}<div class="pair"><figure><img src="${svgUri('figures/wordmark-default.svg')}" alt=""><figcaption>Bez korekty</figcaption></figure><figure><img src="${svgUri('figures/wordmark-kerned.svg')}" alt=""><figcaption>Po korekcie</figcaption></figure></div>`);

const m = extras.minimum;
const minRow = (key, src, bg) => `<div class="min-row"><div class="min-art" style="background:${bg}"><img src="${src}" alt="" style="width:${m[key].px}px"><i class="dim" style="width:${m[key].px}px"></i></div><p><b>${m[key].label}</b><span>${m[key].px} px${m[key].mm ? `, ${m[key].mm} mm w druku` : ' na ekranie'}</span></p></div>`;
sheet('Pole ochronne', `<div class="split narrow"><div><h2 class="h2s">Pole ochronne</h2><div class="panel center"><img src="${svgUri('figures/clearspace.svg')}" alt="" style="max-height:560px;width:auto;max-width:100%"></div><p class="lead tight">${extras.clearSpace}</p></div><div><h2 class="h2s">Minimalne rozmiary</h2><div class="mins">${minRow('primary', svgUri(file.logoSvg('primary')), c.papier)}${minRow('horizontal', svgUri(file.logoSvg('horizontal')), c.papier)}${minRow('symbol', svgUri(file.logoSvg('symbol')), c.papier)}${minRow('favicon', svgUri('favicon.svg'), c.papier)}</div></div></div>`);

const misuse = [
  ['Nie rozciągamy', 'transform:scaleX(1.4)'],
  ['Nie obracamy', 'transform:rotate(24deg)'],
  ['Nie zmieniamy barw', 'filter:hue-rotate(150deg) saturate(2)'],
  ['Nie dodajemy cienia', 'filter:drop-shadow(10px 14px 6px rgba(0,0,0,.45))'],
];
sheet('Czego nie robić', `${head('Czego nie robimy')}<div class="four">${misuse.map(([text, style]) => `<figure class="misuse"><div>${logoImg('primary', `width:60%;${style}`)}</div><figcaption>${text}</figcaption></figure>`).join('')}</div>`, { ground: 'sobota' });

sheet('Paleta', `${head('Paleta', 'Dwanaście kolorów: atrament, trzy barwy dni z ciemnymi odpowiednikami do tekstu i neutralne kości. CMYK jest przybliżony, do druku zamów próbę.')}<div class="swatches">${palette.map(entry => `<figure><div class="chip" style="background:${entry.hex}"></div><figcaption><b>${entry.name}</b><span>${entry.hex}</span><span>${entry.rgbCss}</span><span>${entry.oklchCss}</span><span>${entry.cmykApproxText}</span></figcaption></figure>`).join('')}</div>`);

const contrastRows = rows => `<table class="contrast"><thead><tr><th>Użycie</th><th>Tekst</th><th>Tło</th><th>Stosunek</th><th>Poziom</th></tr></thead><tbody>${rows.map(row => `<tr><td>${row.use}</td><td><i style="background:${row.fgHex}"></i>${colorName(row.fg)}</td><td><i style="background:${row.bgHex}"></i>${colorName(row.bg)}</td><td>${row.ratio.toFixed(1)}:1</td><td>${row.kind === 'decorative' ? 'dekoracja' : row.level}</td></tr>`).join('')}</tbody></table>`;
const half = Math.ceil(contrast.length / 2);
sheet('Kontrast, część pierwsza', `<h2 class="h2s">Kontrast, część pierwsza</h2><div class="panel tablebox">${contrastRows(contrast.slice(0, half))}</div>`);
sheet('Kontrast, część druga', `<h2 class="h2s">Kontrast, część druga</h2><p class="lead tight">Barwy dni na kości mają kontrast poniżej 3:1, więc służą tylko jako dekoracja. Tekst w kolorze dnia na kości używa ciemnych odpowiedników.</p><div class="panel tablebox">${contrastRows(contrast.slice(half))}</div>`);

sheet('Kroje', `<div class="faces"><div class="panel"><p class="mega display">Syne</p><p class="specimen display">${extras.specimen}</p><p class="small">Nagłówki i napis. Grubości 500, 700 i 800.</p></div><div class="panel"><p class="mega mono">Martian Mono</p><p class="specimen mono">${extras.specimen}</p><p class="small">Parametry, godziny i ziarna. Grubości 400, 500 i 700.</p></div></div>`, { ground: 'sobota' });

sheet('Skala i znaki', `${head('Skala pisma i polskie znaki')}<div class="scale">${extras.typeScale.map(row => `<div><span class="${row.font}" style="font-size:${Math.min(row.size * 1.3, 72)}px;font-weight:${row.weight};line-height:1.1">${row.name}</span><span class="small">${row.size} px, interlinia ${row.line}. ${row.use}</span></div>`).join('')}</div><p class="glyphs display">${extras.glyphs}</p>`);

sheet('Ikony', `${head('Dwanaście ikon', 'Rysowane kreską na siatce 24 px, z okrągłymi końcami i jednym pierścieniem jako akcentem.')}<div class="icons">${brand.iconNames.map(name => `<figure><img src="${dataUri(iconSvg(name, c.atrament))}" alt=""><figcaption>${name}</figcaption></figure>`).join('')}</div>`, { ground: 'niedziela' });

sheet('Wzór i układ', `<div class="pattern-full" style="background-image:url('${svgUri(file.pattern)}')"></div><div class="over panel"><h2 class="h2s">Wzór z interferencji</h2><p class="lead tight">${extras.graphics[0].text}</p><ul class="rules rules--small">${list(extras.layoutRules)}</ul></div>`, { bleed: true });

sheet('Zdjęcia', `<div class="split"><div>${head('Styl zdjęć')}<div class="prose big"><p>${extras.photoStyle}</p></div></div><dl class="facts">${[['Światło', 'zastane, bez lamp błyskowych'], ['Kadr', 'szeroki, z ludźmi przy urządzeniach, kablami i projektorami'], ['Ostrość', 'na dłoniach i interfejsach, tło może się rozmywać'], ['Kolor', 'neutralny, przyciemniony kontrast, kolor dnia tylko w podpisie']].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></div>`, { ground: 'atrament' });

sheet('Ton głosu', `${head('Cztery zasady')}<ol class="tone">${content.tone.map(rule => `<li><h3>${rule.title}</h3><p>${rule.text}</p><p class="yes"><b>Tak</b> ${rule.yes}</p><p class="no"><b>Nie</b> ${rule.no}</p></li>`).join('')}</ol>`, { ground: 'niedziela' });

sheet('Wizytówka i papier', `<div class="paper-grid"><div class="cards">${mock(file.cardFront)}${mock(file.cardBack)}</div><div class="letter">${mock(file.letterhead)}</div><div class="panel side"><h3>Wizytówka i papier firmowy</h3><p>Wizytówka 85 na 55 mm ze spadem 3 mm, dwie strony. Papier A4 z nośną biegnącą przez całą szerokość kartki i pierścieniem przy prawej krawędzi.</p><p>Dolna połowa papieru zostaje pusta, żeby nośna była jedyną grafiką.</p></div></div>`);

sheet('Plakaty i identyfikator', `<img class="full" src="${jpeg(file.application)}" alt=""><p class="bleed-cap bleed-cap--light">Plakaty dni na kolorze dnia z polem w atramencie. Pierścień jest zawsze widoczny. Identyfikator na smyczy z kodem kreskowym.</p>`, { bleed: true, low: true });

sheet('Animacja i kontakt', `<div class="split"><div>${head('Trzy dni w trzy sekundy')}<p class="lead tight" style="margin:-6px 0 24px">${extras.animation}</p><dl class="facts panel">${[['Adres', `${contact.street}, ${contact.city}`], ['Telefon', contact.phone], ['E-mail', contact.email]].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></div><div class="panel center">${mock(file.emailMock)}</div></div>`, { ground: 'niedziela' });

if (sheets.length !== total) throw new Error(`expected ${total} pages, built ${sheets.length}`);

const css = `
${baseCss()}
@page{size:1920px 1080px;margin:0}
html,body{margin:0}
.page{--ink:${c.atrament};position:relative;width:1920px;height:1080px;overflow:hidden;page-break-after:always;break-after:page;padding:150px 140px 110px;background:var(--g,${c.kosc});color:var(--ink)}
.g-kosc{--g:${c.kosc}}.g-piatek{--g:${c.piatek}}.g-sobota{--g:${c.sobota}}.g-niedziela{--g:${c.niedziela}}.g-atrament{--g:${c.atrament}}
.page.dark{--ink:${c.kosc}}
.page:not(.cover){display:flex;flex-direction:column}
.page.bleed{padding:0}
.cover{background:${c.atrament};color:${c.kosc};padding:0 160px;display:flex;align-items:center;gap:110px}
.cover-mark{width:900px;flex:none}
.cover-text{max-width:620px}
.cover .kicker,.cover .small{color:${c.mgla}}
.cover .small{margin-top:30px}
.kicker{font:700 22px/1 'Nosna Mono';letter-spacing:.12em;text-transform:uppercase;margin-bottom:24px}
.page header{position:absolute;left:140px;right:140px;top:50px;display:flex;justify-content:space-between;font:700 22px/1 'Nosna Mono'}
.page header .what{opacity:.7}
.rail{position:absolute;left:0;right:0;top:96px;height:6px;background:var(--ink)}
.rail--rest{right:0;background:var(--g);opacity:1}
.page .rail--rest{background:var(--g);box-shadow:none;border-top:6px dotted var(--ink);height:0;opacity:.45}
.ring{position:absolute;top:81px;width:28px;height:28px;margin-left:-14px;border:7px solid var(--ink);border-radius:50%;background:var(--g);box-sizing:border-box}
.page footer{position:absolute;left:140px;bottom:44px;font:500 20px/1 'Nosna Mono';opacity:.7}
.chip-no.low{top:auto;bottom:32px}
.chip-no{position:absolute;right:36px;top:32px;z-index:3;background:${c.atrament};color:${c.kosc};font:700 22px/1 'Nosna Mono';padding:12px 18px}
h2{font-size:76px;line-height:1.02;margin-bottom:26px;letter-spacing:-.01em}
.h2s{font-size:58px;margin-bottom:22px;white-space:nowrap}
h3{font-size:40px;line-height:1.1;margin-bottom:14px;font-weight:800}
.head{margin-bottom:34px;flex:none}
.lead{font:500 30px/1.45 'Nosna Display';max-width:1300px}
.lead.tight{font-size:26px;margin-top:20px}
.small{font:500 22px/1.5 'Nosna Mono'}
.panel{background:${c.papier};color:${c.atrament};padding:46px 54px}
.panel.center .mock{width:100%;height:auto}
.panel.center{display:grid;grid-template-columns:minmax(0,1fr);place-items:center;align-self:stretch;min-height:420px}
.split{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:70px;flex:1;min-height:0;align-items:start}
.split.wide{grid-template-columns:minmax(0,1.3fr) minmax(0,1fr)}
.split.dir{grid-template-columns:minmax(0,1.2fr) minmax(0,1fr)}
.split.narrow{grid-template-columns:1fr 1fr;gap:70px}
.prose p{font:500 25px/1.5 'Nosna Display';margin-bottom:18px;max-width:960px}
.prose.big p{font-size:28px}
.facts dd{font-size:34px}
.facts{margin:0}
.facts div{border-top:5px solid var(--ink);padding:22px 0 26px}
.facts.panel{padding:14px 40px}
.facts.panel dd{font-size:28px}
.facts.panel div{padding:16px 0 18px}
.facts.panel div{border-top-color:${c.atrament}}
.facts.panel div:first-child{border-top:0}
.facts dt{font:700 22px/1 'Nosna Mono';letter-spacing:.1em;text-transform:uppercase;margin-bottom:12px}
.facts dd{margin:0;font:500 32px/1.35 'Nosna Display'}
.dir .words{display:flex;flex-direction:column;justify-content:center;height:100%}
.words span{font:800 104px/1.05 'Nosna Display';letter-spacing:-.02em}
.words span:nth-child(1){color:${c.piatek}}.words span:nth-child(2){color:${c.sobota}}.words span:nth-child(3){color:${c.niedziela}}
.steps{list-style:none;margin:0;padding:0;display:grid;gap:0;flex:1;align-content:stretch}
.steps li{display:grid;grid-template-columns:240px 440px minmax(0,1fr);gap:40px;align-items:center;border-top:6px solid var(--ink)}
.steps .num,.stop .num{font:800 100px/1 'Nosna Display'}
.steps h3{font-size:36px;margin:0}
.steps p{font:500 28px/1.45 'Nosna Display'}
.persona{display:flex;flex-direction:column;justify-content:center;height:100%;gap:6px}
.persona span{font:800 60px/1.05 'Nosna Display';letter-spacing:-.02em}
.persona span::after{content:'';display:inline-block;width:34px;height:34px;border:9px solid var(--ink);border-radius:50%;margin-left:30px;box-sizing:border-box}
.quote{padding:40px 46px;align-self:stretch;display:flex;flex-direction:column;justify-content:center;gap:40px}
blockquote{margin:0;font:800 38px/1.25 'Nosna Display'}
.avoid{font:500 26px/1.5 'Nosna Display'}
.avoid b{display:block;font:700 20px/1 'Nosna Mono';letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px}
.dirs{display:grid;gap:22px;flex:1}
.dirs article{display:grid;grid-template-columns:200px 1fr;gap:36px;align-items:center;background:${c.papier};color:${c.atrament};padding:12px 36px 12px 12px;min-height:0}
.dirs article.chosen{background:${c.atrament};color:${c.kosc}}
.dirs img{width:100%;height:135px;object-fit:contain;background:${c.kosc}}
.dirs h3{font-size:38px;margin-bottom:6px}
.dirs p{font:500 21px/1.36 'Nosna Display'}
.dirs .what-it-is{font-weight:700;margin-bottom:6px}
.line3{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:70px;flex:1;padding-top:90px}
.line3::before{content:'';position:absolute;left:-140px;right:-140px;top:34px;height:8px;background:var(--ink)}
.line3 .stop{position:relative}
.line3 .ring{top:-68px;left:0;margin-left:0;width:44px;height:44px;border-width:10px;background:var(--g)}
.line3 .num{display:block;font-size:110px;margin-bottom:14px}
.line3 p{font:500 28px/1.5 'Nosna Display'}
.line3 h3{font-size:50px}
.hero-mark{position:absolute;left:0;right:0;top:0;bottom:0;display:grid;place-items:center;padding:20px 0 130px}
.bleed-cap{position:absolute;left:100px;bottom:50px;max-width:1500px;font:500 26px/1.5 'Nosna Display';color:${c.kosc};z-index:3}
.bleed-cap--light{background:${c.papier};color:${c.atrament};padding:22px 30px;left:60px;bottom:50px}
.rules{margin:0;padding:0;list-style:none;display:grid;gap:22px}
.rules li{font:500 32px/1.4 'Nosna Display';border-top:5px solid var(--ink);padding-top:16px}
.rules--small{gap:10px}
.rules--small li{font-size:24px;border-top-width:3px;padding-top:8px}
.tiles{display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(2,minmax(0,1fr));gap:24px;flex:1;min-height:0}
.tiles figure{margin:0;padding-bottom:40px;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative}
.tiles figcaption{position:absolute;left:22px;bottom:18px;font:700 22px/1 'Nosna Mono'}
.note-tile{padding:36px;align-items:flex-start!important;justify-content:flex-end!important}
.note-tile p{font:700 30px/1.3 'Nosna Display';color:${c.atrament}}
.grid12{display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(3,1fr);width:100%;height:100%}
.grid12 figure{margin:0;display:grid;place-items:center;position:relative;color:${c.atrament}}
.grid12 figcaption{position:absolute;left:24px;bottom:18px;font:700 20px/1 'Nosna Mono'}
.params{list-style:none;margin:0;padding:0;display:grid;gap:0;flex:1;align-content:stretch}
.params li{display:grid;grid-template-columns:520px 380px minmax(0,1fr);gap:40px;align-items:center;border-top:6px solid var(--ink)}
.params b{font:800 84px/1 'Nosna Display'}
.params em{font:700 24px/1.3 'Nosna Mono';font-style:normal;text-transform:uppercase;letter-spacing:.06em}
.params p{font:500 28px/1.45 'Nosna Display'}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:34px;flex:1}
.pair figure{margin:0;background:${c.papier};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px}
.pair img{width:80%}
.pair figcaption{font:700 26px/1 'Nosna Mono'}
.mins{display:grid;gap:22px}
.min-row{display:grid;grid-template-columns:1fr 330px;gap:26px;align-items:center}
.min-art{height:150px;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;gap:10px;padding:0 36px;background:${c.papier}}
.min-art img{display:block;height:auto}
.min-art .dim{display:block;height:10px;border:solid ${c.piatek};border-width:0 3px;background:linear-gradient(${c.piatek},${c.piatek}) center/100% 3px no-repeat}
.min-row p{display:grid;gap:6px}
.min-row b{font:800 30px/1.1 'Nosna Display'}
.min-row span{font:500 22px/1.3 'Nosna Mono'}
.four{display:grid;grid-template-columns:repeat(4,1fr);gap:28px;flex:1}
.misuse{margin:0;display:flex;flex-direction:column}
.misuse div{flex:1;background:${c.papier};display:grid;place-items:center}
.misuse figcaption{font:800 28px/1.3 'Nosna Display';margin-top:18px}
.swatches{display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:repeat(2,1fr);gap:26px 22px;flex:1}
.swatches figure{margin:0;display:flex;flex-direction:column}
.chip{flex:1;min-height:90px;box-shadow:inset 0 0 0 2px ${c.mgla}}
.swatches figcaption{display:grid;gap:3px;padding-top:12px;font:500 18px/1.25 'Nosna Mono'}
.swatches b{font:800 26px/1.1 'Nosna Display'}
.tablebox{padding:26px 40px}
.contrast{width:100%;border-collapse:collapse;font:500 24px/1.2 'Nosna Display'}
.contrast th{text-align:left;font:700 18px/1 'Nosna Mono';letter-spacing:.08em;text-transform:uppercase;padding:0 10px 12px}
.contrast td{padding:10px 10px;border-top:2px solid ${c.mgla}}
.contrast i{display:inline-block;width:20px;height:20px;border-radius:50%;margin-right:10px;vertical-align:-3px;border:2px solid ${c.atrament}}
.faces{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:36px;flex:1}
.faces .panel{display:flex;flex-direction:column;justify-content:center}
.mega{font-size:110px;line-height:1;margin-bottom:36px;white-space:nowrap}
.specimen{font-size:52px;line-height:1.25;margin-bottom:34px}
.mega.mono{font-size:84px}
.display{font-family:'Nosna Display',sans-serif;font-weight:800}
.mono{font-family:'Nosna Mono',monospace;font-weight:500}
.scale{display:grid;gap:14px;align-content:start}
.scale div{display:grid;grid-template-columns:560px 1fr;align-items:baseline;gap:40px;border-top:3px solid ${c.mgla};padding-top:10px}
.glyphs{font-size:66px;line-height:1.2;margin:auto 0 0}
.icons{display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:repeat(2,1fr);gap:26px;flex:1}
.icons figure{margin:0;background:${c.papier};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px}
.icons img{width:150px}
.icons figcaption{font:500 24px/1 'Nosna Mono'}
.pattern-full{position:absolute;inset:0;background-size:560px;background-color:${c.kosc}}
.over{position:absolute;right:90px;bottom:90px;width:900px;z-index:2}
.tone{list-style:none;margin:0;padding:0;display:grid;gap:0;flex:1;align-content:stretch}
.tone li{display:grid;grid-template-columns:580px 1fr 1fr;gap:4px 40px;align-items:center;border-top:6px solid var(--ink)}
.tone h3{font-size:38px;margin:0;grid-row:span 2}
.tone p{font:500 26px/1.35 'Nosna Display'}
.tone .yes,.tone .no{grid-column:auto;font-size:24px}
.tone b{font:700 20px/1 'Nosna Mono';letter-spacing:.1em;text-transform:uppercase;margin-right:14px}
.tone .no{text-decoration:line-through;text-decoration-thickness:2px}
.tone li > p:nth-of-type(1){grid-column:2 / span 2}
.paper-grid{display:grid;grid-template-columns:580px 640px 1fr;gap:40px;flex:1;align-items:start;margin-top:-20px}
.cards{display:grid;gap:20px}
.cards .mock,.letter .mock{width:100%;height:auto;display:block}
.paper-grid .side{align-self:stretch;display:flex;flex-direction:column;justify-content:center}
.side h3{font-size:40px;margin-bottom:24px}
.side p{font:500 26px/1.5 'Nosna Display';margin-bottom:18px}
.full{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.mock{display:block}
.toc{display:grid;grid-template-columns:repeat(3,1fr);gap:36px;flex:1;min-height:0}
.toc-day h3{background:var(--g);color:${c.atrament};font-size:62px;padding:16px 28px;margin:0 0 6px}
.toc-day ol{list-style:none;margin:0;padding:0}
.toc-day li{display:grid;grid-template-columns:100px 1fr 50px;gap:12px;align-items:baseline;padding:13px 0;border-bottom:3px solid ${c.atrament}}
.toc-day .t{font:500 22px/1 'Nosna Mono'}
.toc-day .n{font:700 27px/1.1 'Nosna Display'}
.toc-day .p{font:700 22px/1 'Nosna Mono';text-align:right}
`;

const html = `<!doctype html><html lang="pl"><meta charset="utf-8"><title>Nośna, księga identyfikacji</title><style>${css}</style><body>${sheets.join('')}</body></html>`;

await withBrowser(browser => htmlToPdf(browser, { outDir: brand.paths.out, name: 'brandbook', html, out: pub(file.brandbook), width: 1920, height: 1080 }));
console.log(`  ${file.brandbook} (${sheets.length} pages)`);
