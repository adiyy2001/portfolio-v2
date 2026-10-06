import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { colorTable, contrastTable } from '../../lib/brand.mjs';
import { htmlToPdf, withBrowser } from '../../lib/browser.mjs';
import { ensureDir } from '../../lib/files.mjs';
import { brand, c, content, contact, dataUri, extras, file, baseCss, logoColors, readPub } from './theme.mjs';
import { iconSvg } from './icons.mjs';
import { symbolPath } from './logo-parts.mjs';
import { nbsp } from '../../../../sites/src/identyfikacja/rzut/lib/typo.ts';

const pub = path => join(brand.paths.pub, path);
const jpeg = path => `data:image/jpeg;base64,${readFileSync(pub(path)).toString('base64')}`;
const png = path => `data:image/png;base64,${readFileSync(pub(path)).toString('base64')}`;
const svgUri = path => dataUri(readPub(path));
const palette = colorTable(brand);
const contrast = contrastTable(brand);
const colorName = id => palette.find(entry => entry.id === id)?.name ?? id;

const pad = n => String(n).padStart(2, '0');
const col = (from, span) => `grid-column:${from}/span ${span}`;
const colLeft = n => 96 + (n - 1) * 146;
const colWidth = span => span * 122 + (span - 1) * 24;
const paragraphs = list => list.map(text => `<p>${text}</p>`).join('');

const logoImg = (variant, style = '', colors) => `<img src="${dataUri(colors ? logoColors(variant, colors) : readPub(file.logoSvg(variant)))}" alt="" style="${style}">`;
const onDark = { square: c.kobalt, word: c.biel, label: c.szary };

const gridSvg = stroke => {
  let d = '';
  for (let k = 0; k < 12; k += 1) {
    const x = 96 + k * 146;
    d += `M${x + 0.5} 0V1080M${x + 122.5} 0V1080`;
  }
  return `<svg class="grid-bg" viewBox="0 0 1920 1080" width="1920" height="1080"><path d="${d}" fill="none" stroke="${stroke}" stroke-width="1"/></svg>`;
};

const pages = [];
const add = page => pages.push(page);

const std = ({ section, title, lead = '', body, tone = 'light', compact = false, bodyClass = '', top }) =>
  add({ section, title, lead, body, tone, compact, bodyClass, top });

add({
  raw: true,
  tone: 'dark',
  html: () => `<section class="page dark cover">${gridSvg(c.asfalt)}
<div class="top"><span class="lbl">Księga identyfikacji wizualnej</span><span class="lbl">Wzornik I1 / 2026</span></div>
<div class="cover-logo" style="left:${colLeft(1)}px;width:${colWidth(8)}px">${logoImg('negative', 'width:100%;height:auto;display:block', onDark)}</div>
<p class="cover-lead" style="left:${colLeft(1)}px;width:${colWidth(6)}px">${content.lead}</p>
<p class="cover-meta lbl" style="left:${colLeft(9)}px;width:${colWidth(4)}px">Pracownia architektoniczna<br>Wrocław<br>Projekt przykładowy: Rzut to zmyślona firma</p>
</section>`,
});

add({ raw: true, toc: true });

std({
  section: 'Klient i zadanie',
  title: 'Pięć osób, jeden rysunek',
  body: `<div class="prose" style="${col(3, 5)}">${paragraphs(content.client.paragraphs)}</div>
<dl class="facts" style="${col(9, 4)}">${content.client.facts.map(([k, v]) => `<div><dt class="lbl">${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`,
});

std({
  section: 'Kierunek i strategia',
  title: content.direction.title,
  body: `<div class="prose" style="${col(3, 5)}">${paragraphs(content.direction.paragraphs)}</div>
<div class="words" style="${col(9, 4)}">${content.direction.keywords.map(word => `<span>${word}</span>`).join('')}</div>`,
});

std({
  section: 'Kierunek i strategia',
  title: 'Dla kogo i o czym',
  lead: content.strategy.audience,
  body: content.strategy.values.map((value, i) => `<article class="value big" style="${col(1 + i * 4, 4)}"><span class="cn idx">${pad(i + 1)}</span><h3>${value.title}</h3><p>${value.text}</p></article>`).join(''),
});

std({
  section: 'Kierunek i strategia',
  title: 'Osobowość i pozycjonowanie',
  tone: 'dark',
  body: `<div class="personality" style="${col(3, 5)}">${content.strategy.personality.map(word => `<span>${word}</span>`).join('')}<p class="small">Unikamy: ${content.strategy.avoids}.</p></div>
<blockquote style="${col(9, 4)}">${content.strategy.positioning}</blockquote>`,
});

std({
  section: 'Proces',
  title: 'Dwa kierunki, które odpadły',
  lead: content.process.intro,
  body: content.process.rejected.map((item, i) => `<article class="dir" style="${col(1 + i * 6, 6)}"><div class="thumb"><img src="${svgUri(item.thumb)}" alt=""></div><div class="dir-text"><h3>${item.title}</h3><p class="what">${item.text}</p><p>${item.reason}</p></div></article>`).join(''),
});

std({
  section: 'Proces',
  title: `Wybrany kierunek: ${content.process.chosen.title}`,
  body: `<div class="thumb big" style="${col(1, 6)}"><img src="${svgUri('figures/direction-modul.svg')}" alt=""></div>
<div class="prose" style="${col(8, 5)}"><p style="font-size:40px;line-height:1.35">${content.process.chosen.reason}</p></div>`,
});

std({
  section: 'Logo',
  title: 'Znak główny',
  lead: 'Kwadrat z wejściem i nazwa Rzut. Pod nazwą podpis i współrzędne pracowni.',
  body: `<div class="stage" style="${col(1, 12)}">${logoImg('primary', 'height:420px;width:auto')}</div>`,
});

std({
  section: 'Logo',
  title: 'Konstrukcja znaku',
  body: `<div class="stage fig" style="${col(1, 7)}"><img src="${svgUri('figures/construction.svg')}" alt="" style="height:560px;width:auto"></div>
<div class="prose" style="${col(9, 4)}">${paragraphs(extras.construction)}</div>`,
});

const variantTiles = [
  ['primary', 'Główne', 'Wszędzie, gdzie jest miejsce', c.biel],
  ['horizontal', 'Poziome', 'Nagłówki, stopki i paski', c.papier],
  ['vertical', 'Pionowe', 'Pola kwadratowe i pionowe', c.biel],
  ['symbol', 'Sygnet', 'Ikona, awatar, mały rozmiar', c.papier],
  ['mono-black', 'Jednokolorowe', 'Druk w jednym kolorze, pieczątki', c.biel],
  ['negative', 'Negatyw', 'Na czerni i ciemnych polach', c.czern],
];
std({
  section: 'Logo',
  title: 'Sześć wariantów',
  compact: true,
  body: variantTiles.map(([variant, name, use, bg], i) => {
    const dark = variant === 'negative';
    return `<figure class="tile" style="${col(1 + (i % 3) * 4, 4)}"><div class="tile-stage" style="background:${bg}">${logoImg(variant, 'max-width:78%;max-height:150px;width:auto;height:auto', dark ? onDark : undefined)}</div><figcaption><b class="lbl">${name}</b><span>${use}</span></figcaption></figure>`;
  }).join(''),
});

std({
  section: 'Logo',
  title: 'Ręczny kerning',
  lead: content.process.refinement[0].text,
  body: `<figure class="pair" style="${col(1, 6)}"><div class="stage fig"><img src="${svgUri('figures/wordmark-default.svg')}" alt="" style="height:360px;width:auto"></div><figcaption class="lbl">Bez korekty</figcaption></figure>
<figure class="pair" style="${col(7, 6)}"><div class="stage fig"><img src="${svgUri('figures/wordmark-kerned.svg')}" alt="" style="height:360px;width:auto"></div><figcaption class="lbl">Po korekcie</figcaption></figure>`,
});

std({
  section: 'Logo',
  title: 'Pole ochronne i rozmiar minimalny',
  lead: extras.clearSpace,
  body: `<div class="stage fig" style="${col(1, 7)}"><img src="${svgUri('figures/clearspace.svg')}" alt="" style="width:92%;height:auto"></div>
<dl class="facts" style="${col(9, 4)}">${[['Sygnet', extras.minimum.symbol], ['Logo poziome', extras.minimum.horizontal], ['Logo główne', extras.minimum.primary], ['Logo pionowe', extras.minimum.vertical]].map(([k, v]) => `<div><dt class="lbl">${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`,
});

const symbolOutline = `<svg viewBox="0 0 120 120" style="height:150px;width:auto"><path d="${symbolPath(120, 0, 0)}" fill="none" stroke="${c.kobalt}" stroke-width="6"/></svg>`;
const misuse = [
  ['Nie rozciągamy', logoImg('symbol', 'height:150px;width:auto;transform:scaleX(1.6)')],
  ['Nie obracamy', logoImg('symbol', 'height:150px;width:auto;transform:rotate(18deg)')],
  ['Nie zmieniamy koloru', `<img src="${dataUri(readPub(file.logoSvg('symbol')).replaceAll('#1f4bff', '#e0301e'))}" alt="" style="height:150px;width:auto">`],
  ['Nie dodajemy cienia', `<span class="shadow">${logoImg('symbol', 'height:150px;width:auto;position:relative')}<img class="shade" src="${dataUri(readPub(file.logoSvg('symbol')).replaceAll('#1f4bff', c.szary))}" alt=""></span>`],
  ['Nie rysujemy samego obrysu', symbolOutline],
  ['Nie zmieniamy kroju', `<span class="wrongface">${logoImg('symbol', 'height:120px;width:auto')}<b>Rzut</b></span>`],
];
std({
  section: 'Logo',
  title: 'Czego nie robimy',
  compact: true,
  body: misuse.map(([text, inner], i) => `<figure class="misuse" style="${col(1 + (i % 3) * 4, 4)}"><div>${inner}</div><figcaption class="lbl">${text}</figcaption></figure>`).join(''),
});

const shares = [['biel', 62], ['czern', 28], ['kobalt', 10]];
std({
  section: 'Kolor',
  title: 'Czerń, biel i jeden kobalt',
  lead: extras.colorLead,
  body: `<div class="bar" style="${col(1, 12)}">${shares.map(([id, w]) => `<div style="flex:${w};background:${c[id]};color:${id === 'biel' ? c.czern : c.biel}"><span class="lbl">${colorName(id)} ${w}%</span></div>`).join('')}</div>
${['czern', 'biel', 'kobalt'].map((id, i) => {
  const entry = palette.find(item => item.id === id);
  return `<div class="swatch" style="${col(1 + i * 4, 4)}"><b>${entry.name}</b><span>${entry.hex}, ${entry.rgbCss}</span><span>${entry.role}</span></div>`;
}).join('')}`,
});

std({
  section: 'Kolor',
  title: 'Paleta i wartości',
  compact: true,
  body: `<table class="values" style="${col(1, 12)}"><thead><tr><th></th><th class="lbl">Nazwa</th><th class="lbl">HEX</th><th class="lbl">RGB</th><th class="lbl">OKLCH</th><th class="lbl">CMYK, przybliżone</th><th class="lbl">Rola</th></tr></thead><tbody>${palette.map(entry => `<tr><td><i style="background:${entry.hex}"></i></td><td><b>${entry.name}</b></td><td class="cn">${entry.hex}</td><td class="cn">${entry.rgbCss}</td><td class="cn">${entry.oklchCss}</td><td class="cn">${entry.cmykApproxText}</td><td>${entry.role}</td></tr>`).join('')}</tbody></table>`,
});

std({
  section: 'Kolor',
  title: 'Kontrast',
  compact: true,
  top: 215,
  bodyClass: 'tight',
  body: `<table class="contrast" style="${col(1, 12)}"><thead><tr><th class="lbl">Użycie</th><th class="lbl">Kolor</th><th class="lbl">Tło</th><th class="lbl">Stosunek</th><th class="lbl">Poziom</th></tr></thead><tbody>${contrast.map(row => `<tr><td>${row.use}</td><td><i style="background:${row.fgHex}"></i>${colorName(row.fg)}</td><td><i style="background:${row.bgHex}"></i>${colorName(row.bg)}</td><td class="cn">${row.ratio.toFixed(2)}:1</td><td>${row.kind === 'decorative' ? 'dekoracja' : row.level}</td></tr>`).join('')}</tbody></table>`,
});

std({
  section: 'Typografia',
  title: 'Jedna rodzina, dwie szerokości',
  compact: true,
  body: `<div class="face" style="${col(1, 6)}"><p class="mega text">Aa</p><h3>Instrument Sans</h3><p class="specimen text">${extras.specimen}</p><p class="weights text"><span style="font-weight:400">400 Regular</span><span style="font-weight:500">500 Medium</span><span style="font-weight:700">700 Bold</span></p><p class="small">Nagłówki i tekst. Grubości 400, 500 i 700.</p></div>
<div class="face" style="${col(7, 6)}"><p class="mega cn">Aa</p><h3>Instrument Sans Condensed</h3><p class="specimen cn">${extras.specimen}</p><p class="weights cn"><span style="font-weight:400">400 Regular</span><span style="font-weight:700">700 Bold</span></p><p class="small">Liczby, indeksy i podpisy. Grubości 400 i 700, cyfry tabelaryczne.</p></div>`,
});

std({
  section: 'Typografia',
  title: 'Skala pisma i polskie znaki',
  compact: true,
  body: `<div class="scale" style="${col(1, 12)}">${extras.typeScale.map(row => `<div><span class="${row.font === 'condensed' ? 'cn' : 'text'}" style="font-size:${Math.max(Math.min(row.size * 1.4, 130), 30)}px;font-weight:${row.weight};line-height:1.05">${row.name}</span><span class="small">${row.size} px, interlinia ${row.line}. ${row.use}</span></div>`).join('')}</div>
<p class="glyphs text" style="${col(1, 7)}">${extras.glyphs}</p><p class="glyphs cn" style="${col(8, 5)}">${extras.glyphs}</p>`,
});

const modulesDiagram = `<div class="modules" style="${col(1, 12)}">${Array.from({ length: 12 }, (_, i) => `<span class="cn">${pad(i + 1)}</span>`).join('')}</div>`;
std({
  section: 'Układ i grafika',
  title: 'Siatka dwunastu kolumn',
  compact: true,
  body: `${modulesDiagram}
<dl class="facts" style="${col(1, 4)}"><div><dt class="lbl">Kolumny</dt><dd>${extras.grid.columns}</dd></div><div><dt class="lbl">Odstęp</dt><dd>${extras.grid.gutter}</dd></div><div><dt class="lbl">Margines</dt><dd>${extras.grid.margin}</dd></div><div><dt class="lbl">Linia bazowa</dt><dd>${extras.grid.baseline}</dd></div></dl>
<ol class="rules" style="${col(6, 7)}">${extras.layoutRules.map((rule, i) => `<li><span class="cn idx">${pad(i + 1)}</span><span>${rule}</span></li>`).join('')}</ol>`,
});

std({
  section: 'Układ i grafika',
  title: 'Dwanaście ikon na siatce 24 px',
  lead: 'Kreska 2 px, proste końce, ostre narożniki. Ikona zawsze leży na pełnych pikselach siatki.',
  body: brand.iconNames.map((name, i) => `<figure class="icon" style="${col(1 + (i % 6) * 2, 2)}"><div><img src="${dataUri(iconSvg(name, c.czern))}" alt=""></div><figcaption class="lbl">${extras.iconLabels[name] ?? name}</figcaption></figure>`).join(''),
});

std({
  section: 'Układ i grafika',
  title: 'Wzór i elementy graficzne',
  compact: true,
  body: `<div class="pattern" style="${col(1, 7)};background-image:url('${svgUri(file.pattern)}')"></div>
<div class="gfx" style="${col(9, 4)}">${extras.graphics.map(item => `<article><h3>${item.title}</h3><p>${item.text}</p></article>`).join('')}</div>`,
});

std({
  section: 'Układ i grafika',
  title: 'Styl zdjęć',
  body: `<div class="prose" style="${col(3, 6)}"><p style="font-size:42px;line-height:1.4">${extras.photoStyle}</p></div>
<div class="crops" style="${col(10, 3)}"><span class="crop whole"><b class="lbl">całość</b></span><span class="crop half"><b class="lbl">połowa</b></span><span class="crop quarter"><b class="lbl">ćwierć</b></span></div>`,
});

std({
  section: 'Ton głosu',
  title: 'Cztery zasady',
  compact: true,
  body: content.tone.map((rule, i) => `<article class="rule" style="${col(1 + (i % 2) * 6, 6)}"><h3>${rule.title}</h3><p>${rule.text}</p><p class="yes"><b class="lbl">Tak</b> ${rule.yes}</p><p class="no"><b class="lbl">Nie</b> ${rule.no}</p></article>`).join(''),
});

const [front, back, paper, board, signature] = content.applications;
std({
  section: 'Zastosowania',
  title: 'Wizytówka i papier firmowy',
  compact: true,
  body: `<figure class="shot" style="${col(1, 4)}"><img src="${jpeg(file.cardFront)}" alt=""><figcaption>${front.caption}</figcaption></figure>
<figure class="shot" style="${col(5, 4)}"><img src="${jpeg(file.cardBack)}" alt=""><figcaption>${back.caption}</figcaption></figure>
<figure class="shot" style="${col(9, 4)};grid-row:1/span 2"><img src="${jpeg(file.letterhead)}" alt=""><figcaption>${paper.caption}</figcaption></figure>`,
});

std({
  section: 'Zastosowania',
  title: 'Tablica budowy i podpis e-mail',
  compact: true,
  body: `<figure class="shot" style="${col(1, 6)}"><img src="${jpeg(file.application)}" alt=""><figcaption>${board.caption}</figcaption></figure>
<figure class="shot" style="${col(7, 6)}"><img src="${jpeg(file.emailMock)}" alt=""><figcaption>${signature.caption}</figcaption></figure>`,
});

std({
  section: 'Zastosowania',
  title: 'Media społecznościowe',
  compact: true,
  body: `${[1, 2, 3].map(n => `<figure class="shot post" style="${col(1 + (n - 1) * 3, 3)}"><img src="${png(file.post(n))}" alt=""><figcaption>${extras.social[n - 1].headline}</figcaption></figure>`).join('')}
<div class="stack" style="${col(10, 3)}"><figure class="shot"><img src="${png(file.avatar)}" alt=""><figcaption>Awatar</figcaption></figure>
<figure class="shot"><img src="${png(file.og)}" alt=""><figcaption>Obraz do udostępniania</figcaption></figure></div>`,
});

const frameDir = ensureDir(join(brand.paths.out, 'bb-frames'));
const frameSteps = [
  [0.7, '0,7 s', 'Siatka rysuje się'],
  [1.5, '1,5 s', 'Kwadrat wskakuje na moduł'],
  [2.2, '2,2 s', 'Nazwa i podpis wyrównują się'],
  [2.97, '3,0 s', 'Gotowy znak'],
];
const frameCells = frameSteps.map(([time, stamp, text]) => {
  const out = join(frameDir, `f${time}.jpg`);
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-ss', String(time), '-i', pub(file.mp4), '-frames:v', '1', '-vf', 'scale=600:600', '-q:v', '3', out]);
  const uri = `data:image/jpeg;base64,${readFileSync(out).toString('base64')}`;
  return `<figure class="frame"><img src="${uri}" alt=""><figcaption><b class="cn">${stamp}</b><span>${text}</span></figcaption></figure>`;
});

add({
  section: 'Animacja i kontakt',
  title: 'Siatka, kwadrat, nazwa',
  top: 380,
  lead: extras.animation,
  tone: 'light',
  compact: false,
  bodyClass: 'tight',
  body: `<div class="frames" style="${col(1, 12)}">${frameCells.join('')}</div>`,
});

add({
  raw: true,
  tone: 'dark',
  html: number => `<section class="page dark cover closing">${gridSvg(c.asfalt)}
<div class="top"><span class="lbl">Animacja i kontakt</span><span class="lbl">${pad(number)} / ${pad(total)}</span></div>
<div class="cover-logo" style="left:${colLeft(1)}px;width:${colWidth(5)}px;top:150px">${logoImg('negative', 'width:100%;height:auto;display:block', onDark)}</div>
<dl class="facts contact-card" style="left:${colLeft(7)}px;width:${colWidth(6)}px"><div><dt class="lbl">Kontakt</dt><dd>${contact.person}, ${contact.role}</dd></div><div><dt class="lbl">Adres</dt><dd>${contact.street}, ${contact.city}</dd></div><div><dt class="lbl">Telefon</dt><dd>${contact.phone}</dd></div><div><dt class="lbl">E-mail</dt><dd>${contact.email}</dd></div><div><dt class="lbl">Godziny</dt><dd>${contact.hours.map(([k, v]) => `${k}: ${v}`).join('<br>')}</dd></div></dl>
<p class="cover-meta lbl" style="left:${colLeft(1)}px;width:${colWidth(6)}px;top:900px">Projekt przykładowy: Rzut to zmyślona firma</p>
</section>`,
});

const total = pages.length;
const sectionStart = [];
pages.forEach((page, i) => {
  if (page.section && !sectionStart.some(entry => entry.name === page.section)) sectionStart.push({ name: page.section, page: i + 1 });
});

const sectionIndex = name => sectionStart.findIndex(entry => entry.name === name) + 1;

const render = (page, i) => {
  const number = i + 1;
  if (page.html) return page.html(number);
  if (page.toc) {
    return `<section class="page">${gridSvg(c.mgla)}<div class="top"><span class="lbl">Spis treści</span><span class="lbl">${pad(number)} / ${pad(total)}</span></div>
<h2 class="h" style="left:${colLeft(3)}px;width:${colWidth(8)}px">Spis treści</h2>
<ol class="toc" style="left:${colLeft(3)}px;width:${colWidth(10)}px">${sectionStart.map((entry, k) => `<li><span class="cn idx">${pad(k + 1)}</span><span class="name">${entry.name}</span><span class="cn">${pad(entry.page)}</span></li>`).join('')}</ol>
<div class="bot"><span class="lbl">Rzut, księga identyfikacji. Projekt przykładowy.</span></div></section>`;
  }
  const dark = page.tone === 'dark';
  const top = page.top ?? (page.lead ? 330 : page.compact ? 250 : 260);
  return `<section class="page ${dark ? 'dark' : ''}">${gridSvg(dark ? c.asfalt : c.mgla)}
<div class="top"><span class="lbl">${page.section}</span><span class="lbl">${pad(number)} / ${pad(total)}</span></div>
<div class="num cn" style="left:${colLeft(1)}px">${pad(sectionIndex(page.section))}</div>
<h2 class="h" style="left:${colLeft(3)}px;width:${colWidth(9)}px">${page.title}</h2>
${page.lead ? `<p class="lead" style="left:${colLeft(3)}px;width:${colWidth(10)}px">${page.lead}</p>` : ''}
<div class="body ${page.bodyClass}" style="top:${top}px">${page.body}</div>
<div class="bot"><span class="lbl">Rzut, księga identyfikacji. Projekt przykładowy.</span></div></section>`;
};

if (total < 20 || total > 30) throw new Error(`brand book has ${total} pages, expected 20 to 30`);

const css = `
${baseCss()}
@page{size:1920px 1080px;margin:0}
html,body{margin:0}
.page{position:relative;width:1920px;height:1080px;overflow:hidden;break-after:page;page-break-after:always;background:${c.biel};color:${c.czern}}
.page.dark{background:${c.czern};color:${c.biel}}
.grid-bg{position:absolute;left:0;top:0}
.top,.bot{position:absolute;left:96px;right:96px;display:flex;justify-content:space-between;font-size:16px;color:${c.grafit}}
.top{top:44px}
.bot{bottom:40px}
.dark .top,.dark .bot{color:${c.szary}}
.num{position:absolute;top:96px;font-weight:700;font-size:150px;line-height:.8;color:${c.kobalt}}
.h{position:absolute;top:104px;font-weight:700;font-size:68px;line-height:1.04;letter-spacing:-.02em}
.lead{position:absolute;top:214px;font-size:30px;line-height:1.4;font-weight:500;color:${c.asfalt}}
.dark .lead{color:${c.mgla}}
.body{position:absolute;left:96px;right:96px;bottom:96px;display:grid;grid-template-columns:repeat(12,122px);column-gap:24px;align-content:start;row-gap:24px}
.prose p{font-size:31px;line-height:1.45;margin-bottom:26px}
.small{font-size:23px;line-height:1.4;color:${c.grafit}}
.dark .small{color:${c.szary}}
.facts{margin:0;display:grid;gap:0}
.facts div{border-top:2px solid ${c.czern};padding:14px 0 18px}
.dark .facts div{border-color:${c.biel}}
.facts dt{font-size:18px;color:${c.grafit};margin-bottom:6px}
.facts dd{margin:0;font-size:29px;line-height:1.3}
.facts.contact{grid-template-columns:repeat(4,1fr);column-gap:24px;margin-top:20px}
.words{display:grid;gap:0}
.words span{font:700 120px/1 'Rzut Condensed',sans-serif;text-transform:uppercase;letter-spacing:-.01em;border-top:2px solid ${c.czern};padding-top:10px}
.value{border-top:2px solid ${c.czern};padding-top:14px}
.value h3{font-size:40px;line-height:1.1;margin:12px 0 16px}
.value p{font-size:28px;line-height:1.45}
.value.big .idx{font-size:120px;line-height:1}
.value.big h3{font-size:72px;margin:24px 0 28px}
.value.big p{font-size:44px;line-height:1.4}
.idx{font-weight:700;font-size:26px;color:${c.kobalt};display:inline-block}
.personality{display:grid;gap:0}
.personality span{font:700 130px/1 'Rzut Sans',sans-serif;letter-spacing:-.03em}
.personality .small{margin-top:30px}
blockquote{margin:0;font-size:34px;line-height:1.25;font-weight:500;border-top:2px solid ${c.biel};padding-top:18px}
.dir{display:grid;grid-template-columns:400px 1fr;gap:28px;align-items:start}
.thumb{background:${c.papier};display:flex;align-items:center;justify-content:center}
.thumb img{width:100%;height:auto;display:block}
.thumb.big{height:640px}
.thumb.big img{height:100%;width:100%;object-fit:contain}
.dir h3{font-size:56px;line-height:1.05;margin-bottom:14px}
.dir p{font-size:28px;line-height:1.4;margin-bottom:14px}
.dir .what{color:${c.grafit}}
.stage{background:${c.papier};display:flex;align-items:center;justify-content:center;height:640px}
.stage.fig{background:${c.biel};border:2px solid ${c.mgla}}
.tile{margin:0;display:grid;grid-template-rows:250px auto;border:2px solid ${c.mgla}}
.tile-stage{display:flex;align-items:center;justify-content:center}
.tile figcaption{display:grid;gap:4px;padding:14px 18px 16px;font-size:20px;color:${c.grafit}}
.tile figcaption b{font-size:16px;color:${c.czern}}
.pair{margin:0;display:grid;gap:12px}
.pair .stage{height:520px}
.pair figcaption,.misuse figcaption{font-size:16px;color:${c.grafit}}
.icon figcaption{font-size:22px;color:${c.czern}}
.misuse{margin:0;display:grid;grid-template-rows:310px auto;gap:12px}
.misuse>div{background:${c.papier};display:flex;align-items:center;justify-content:center;overflow:hidden}
.shadow{position:relative;display:inline-block}
.shadow .shade{position:absolute;left:14px;top:14px;height:150px;width:auto;z-index:0}
.shadow img:first-child{z-index:1}
.wrongface{display:flex;align-items:center;gap:20px}
.wrongface b{font:700 130px/1 'Rzut Condensed',sans-serif;color:${c.czern}}
.bar{display:flex;height:360px;border:2px solid ${c.czern}}
.bar div{display:flex;align-items:flex-end;padding:16px 20px;font-size:20px}
.swatch{display:grid;gap:8px;border-top:2px solid ${c.czern};padding-top:14px;font-size:24px;color:${c.grafit}}
.swatch b{font-size:42px;color:${c.czern}}
table{border-collapse:collapse;width:100%}
th{text-align:left;font-size:15px;color:${c.grafit};padding:0 10px 10px}
td{padding:10px;border-top:2px solid ${c.mgla};font-size:20px}
.values i{display:block;width:64px;height:40px;border:2px solid ${c.czern}}
.contrast td{padding:3px 10px;font-size:17px}
.contrast i{display:inline-block;width:20px;height:20px;margin-right:10px;vertical-align:-4px;border:2px solid ${c.czern}}
.face .mega{font-size:280px;line-height:.9;font-weight:700;margin-bottom:20px}
.face h3{font-size:40px;margin-bottom:12px}
.face .specimen{font-size:42px;line-height:1.25;margin-bottom:16px}
.text{font-family:'Rzut Sans',sans-serif}
.weights{display:grid;gap:4px;font-size:40px;line-height:1.2;margin:10px 0 18px}
.scale{display:grid}
.scale div{display:grid;grid-template-columns:520px 1fr;align-items:baseline;gap:30px;border-top:2px solid ${c.mgla};padding:10px 0}
.glyphs{font-size:44px;line-height:1.2;margin-top:6px;font-weight:700}
.modules{display:grid;grid-template-columns:repeat(12,1fr);column-gap:24px;height:230px}
.modules span{background:${c.papier};border-top:4px solid ${c.czern};padding:10px;font-size:20px;font-weight:700;color:${c.grafit}}
.rules{margin:0;padding:0;list-style:none;display:grid;gap:0}
.rules li{display:grid;grid-template-columns:64px 1fr;font-size:28px;line-height:1.4;border-top:2px solid ${c.czern};padding:12px 0}
.icon{margin:0;display:grid;gap:10px}
.icon div{background-color:${c.biel};border:2px solid ${c.mgla};height:216px;display:flex;align-items:center;justify-content:center;background-image:linear-gradient(${c.mgla} 1px,transparent 1px),linear-gradient(90deg,${c.mgla} 1px,transparent 1px);background-size:24px 24px}
.icon img{width:96px}
.pattern{height:730px;background-size:360px;background-color:${c.biel};border:2px solid ${c.mgla}}
.gfx{display:grid;gap:0;align-content:start}
.gfx article{border-top:2px solid ${c.czern};padding:14px 0 22px}
.gfx h3{font-size:34px;margin-bottom:8px}
.gfx p{font-size:25px;line-height:1.45}
.crops{display:grid;gap:24px;align-content:start}
.crop{display:block;background:${c.mgla};position:relative;border:2px solid ${c.czern}}
.crop b{position:absolute;left:10px;bottom:8px;font-size:15px;color:${c.grafit}}
.crop.whole{height:210px}
.crop.half{height:210px;width:50%}
.crop.quarter{height:105px;width:50%}
.rule{border-top:2px solid ${c.czern};padding-top:14px}
.rule h3{font-size:46px;line-height:1.1;margin-bottom:14px}
.rule p{font-size:30px;line-height:1.4;margin-bottom:14px}
.rule .yes b{color:${c.kobalt};margin-right:8px}
.rule .no{color:${c.grafit};text-decoration:line-through}
.rule .no b{text-decoration:none;display:inline-block;margin-right:8px}
.shot{margin:0;display:grid;gap:10px;align-content:start}
.shot img{width:100%;height:auto;display:block;border:2px solid ${c.mgla}}
.shot figcaption{font-size:21px;line-height:1.35;color:${c.grafit}}
.shot.post figcaption{font-size:22px}
.stack{display:grid;gap:24px;align-content:start}
.frames{display:grid;grid-template-columns:repeat(4,1fr);column-gap:24px}
.frame{margin:0;display:grid;gap:12px}
.frame img{width:100%;height:auto;display:block;border:2px solid ${c.czern}}
.frame figcaption{display:grid;gap:2px;border-top:2px solid ${c.czern};padding-top:10px;font-size:26px;line-height:1.3}
.frame figcaption b{font-size:44px;line-height:1;color:${c.kobalt}}
.contact-card{position:absolute;top:150px;margin:0}
.contact-card div{border-top-color:${c.biel}}
.toc{position:absolute;top:215px;margin:0;padding:0;list-style:none;display:grid;gap:0}
.toc li{display:grid;grid-template-columns:90px 1fr 80px;align-items:baseline;border-top:2px solid ${c.czern};padding:10px 0 12px;font-size:34px;font-weight:700}
.toc li .cn{font-size:26px}
.cover-logo{position:absolute;top:200px}
.cover-lead{position:absolute;top:760px;font-size:34px;line-height:1.3;font-weight:500;color:${c.mgla}}
.cover-meta{position:absolute;top:760px;font-size:18px;line-height:1.6;color:${c.szary}}
`;

const textNodes = markup => markup.replace(/>([^<>]+)</g, (match, text) => `>${nbsp(text)}<`);
const bodyHtml = textNodes(pages.map(render).join(''));
const html = `<!doctype html><html lang="pl"><meta charset="utf-8"><title>Rzut, księga identyfikacji</title><style>${css}</style><body>${bodyHtml}</body></html>`;

await withBrowser(browser => htmlToPdf(browser, { outDir: brand.paths.out, name: 'brandbook', html, out: pub(file.brandbook), width: 1920, height: 1080 }));
console.log(`  ${file.brandbook} (${total} pages)`);
