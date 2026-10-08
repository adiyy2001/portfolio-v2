import { esc, text } from '../../kit/kit.mjs';
import { inkShapes } from './ink.mjs';

export const colors = {
  papier: '#FBF8F0',
  kratka: '#CFE0EE',
  atrament: '#1E2A5E',
  flamaster: '#E2433B',
  flamasterUi: '#C2302A',
  zakreslacz: '#FFE45E',
  zielen: '#2E9E5B',
  zielenUi: '#1F7A45',
  olowek: '#6B7080',
  mieta: '#B8EBD0',
  karta: '#FFFFFF',
};

const c = colors;

const line = (d, w = 2) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

export const icons = {
  ksiazka: line('<path d="M4 4.5h6a2.5 2.5 0 0 1 2 1 2.5 2.5 0 0 1 2-1h6v14h-6a2 2 0 0 0-2 1.5 2 2 0 0 0-2-1.5H4Z"/><path d="M12 5.5v14"/>'),
  serial: line('<rect x="3" y="5" width="18" height="12" rx="2.5"/><path d="M8 21h8M10 9.2l4 1.8-4 1.8Z"/>'),
  wyjazd: line('<path d="M21 13.5 14 10V4.8a1.8 1.8 0 0 0-3.6 0V10l-7 3.5v2l7-2v4.3l-2 1.7v1.5l3.8-1 3.8 1v-1.5l-2-1.7v-4.3l7 2Z"/>', 1.8),
  today: line('<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M8 3v4M16 3v4M4 10h16"/><path d="m9 15 2 2 4-4"/>'),
  decks: line('<rect x="7" y="3.5" width="12" height="15" rx="2" transform="rotate(8 13 11)"/><rect x="4" y="6" width="12" height="15" rx="2"/>'),
  plus: line('<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>'),
  chart: line('<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>'),
  close: line('<path d="M6 6l12 12M18 6 6 18"/>', 2.4),
  speaker: line('<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4Z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>'),
  camera: line('<path d="M4 8h3l1.8-2.5h6.4L17 8h3v11H4Z"/><circle cx="12" cy="13.2" r="3.4"/>'),
  check: line('<path d="m5 12.5 4.2 4L19 7"/>', 2.8),
  clock: line('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  flip: line('<path d="M4 12a8 8 0 0 1 13.7-5.6M20 12a8 8 0 0 1-13.7 5.6"/><path d="M18 3v4h-4M6 21v-4h4"/>'),
  pencil: line('<path d="M15 4.5 19.5 9 9 19.5H4.5V15Z"/><path d="m13 6.5 4.5 4.5"/>'),
  chevron: line('<path d="m9 5 7 7-7 7"/>', 2.4),
};

const tabIcons = [icons.today, icons.decks, icons.plus, icons.chart];

const tabs = (data, active, lang) =>
  `<nav class="m-tabs">${data.tabs.map((label, i) => `<span class="m-tab${i === active ? ' m-tab--on' : ''}">${tabIcons[i]}<span>${text(label, lang)}</span></span>`).join('')}</nav>`;

const deckIcon = id => `<span class="m-ico">${icons[id]}</span>`;

const lighthouse = seed =>
  inkShapes(
    [
      { t: 'polygon', pts: [[96, 150], [124, 150], [118, 62], [102, 62]], stroke: c.atrament, width: 2.6, seed },
      { t: 'line', x1: 99, y1: 120, x2: 121, y2: 119, stroke: c.atrament, width: 2.2, seed: seed + 1, single: true },
      { t: 'line', x1: 101, y1: 92, x2: 119, y2: 91, stroke: c.atrament, width: 2.2, seed: seed + 2, single: true },
      { t: 'rect', x: 98, y: 44, w: 24, h: 18, stroke: c.atrament, width: 2.6, seed: seed + 3 },
      { t: 'polygon', pts: [[96, 44], [110, 30], [124, 44]], stroke: c.atrament, width: 2.6, seed: seed + 4 },
      { t: 'line', x1: 126, y1: 50, x2: 176, y2: 34, stroke: c.zakreslacz, width: 5, seed: seed + 5, single: true },
      { t: 'line', x1: 126, y1: 56, x2: 178, y2: 62, stroke: c.zakreslacz, width: 5, seed: seed + 6, single: true },
      { t: 'rect', x: 106, y: 132, w: 9, h: 18, stroke: c.atrament, width: 2.2, seed: seed + 7 },
      { t: 'ellipse', cx: 150, cy: 132, w: 14, h: 14, stroke: c.atrament, width: 2.4, seed: seed + 8 },
      { t: 'line', x1: 150, y1: 139, x2: 150, y2: 152, stroke: c.atrament, width: 2.4, seed: seed + 9, single: true },
      { t: 'line', x1: 150, y1: 144, x2: 136, y2: 136, stroke: c.atrament, width: 2.4, seed: seed + 10, single: true },
      { t: 'line', x1: 150, y1: 144, x2: 162, y2: 148, stroke: c.atrament, width: 2.4, seed: seed + 11, single: true },
      { t: 'line', x1: 166, y1: 140, x2: 182, y2: 140, stroke: c.flamaster, width: 2.4, seed: seed + 12, single: true },
      { t: 'line', x1: 166, y1: 148, x2: 178, y2: 148, stroke: c.flamaster, width: 2.4, seed: seed + 13, single: true },
      { t: 'arc', cx: 46, cy: 50, w: 30, h: 30, from: 1.2, to: 5.2, stroke: c.atrament, width: 2.2, seed: seed + 14 },
      { t: 'line', x1: 20, y1: 156, x2: 200, y2: 152, stroke: c.atrament, width: 2.2, seed: seed + 15, single: true },
    ],
  );

const tram = seed =>
  inkShapes([
    { t: 'rect', x: 92, y: 74, w: 92, h: 52, stroke: c.atrament, width: 2.6, seed },
    { t: 'line', x1: 92, y1: 96, x2: 184, y2: 96, stroke: c.atrament, width: 2.2, seed: seed + 1, single: true },
    { t: 'rect', x: 102, y: 80, w: 18, h: 12, stroke: c.atrament, width: 2, seed: seed + 2 },
    { t: 'rect', x: 128, y: 80, w: 18, h: 12, stroke: c.atrament, width: 2, seed: seed + 3 },
    { t: 'rect', x: 154, y: 80, w: 18, h: 12, stroke: c.atrament, width: 2, seed: seed + 4 },
    { t: 'ellipse', cx: 110, cy: 130, w: 13, h: 13, stroke: c.atrament, width: 2.4, seed: seed + 5 },
    { t: 'ellipse', cx: 166, cy: 130, w: 13, h: 13, stroke: c.atrament, width: 2.4, seed: seed + 6 },
    { t: 'line', x1: 138, y1: 74, x2: 150, y2: 50, stroke: c.atrament, width: 2.2, seed: seed + 7, single: true },
    { t: 'line', x1: 130, y1: 50, x2: 200, y2: 50, stroke: c.atrament, width: 2, seed: seed + 8, single: true },
    { t: 'line', x1: 194, y1: 86, x2: 214, y2: 86, stroke: c.flamaster, width: 2.4, seed: seed + 9, single: true },
    { t: 'line', x1: 194, y1: 100, x2: 220, y2: 100, stroke: c.flamaster, width: 2.4, seed: seed + 10, single: true },
    { t: 'line', x1: 194, y1: 114, x2: 210, y2: 114, stroke: c.flamaster, width: 2.4, seed: seed + 11, single: true },
    { t: 'ellipse', cx: 40, cy: 110, w: 14, h: 14, stroke: c.atrament, width: 2.4, seed: seed + 12 },
    { t: 'line', x1: 40, y1: 117, x2: 44, y2: 132, stroke: c.atrament, width: 2.4, seed: seed + 13, single: true },
    { t: 'line', x1: 42, y1: 122, x2: 58, y2: 116, stroke: c.atrament, width: 2.4, seed: seed + 14, single: true },
    { t: 'line', x1: 44, y1: 132, x2: 34, y2: 146, stroke: c.atrament, width: 2.4, seed: seed + 15, single: true },
    { t: 'line', x1: 44, y1: 132, x2: 56, y2: 144, stroke: c.atrament, width: 2.4, seed: seed + 16, single: true },
    { t: 'ellipse', cx: 46, cy: 58, w: 30, h: 30, stroke: c.atrament, width: 2.2, seed: seed + 17 },
    { t: 'line', x1: 46, y1: 58, x2: 46, y2: 48, stroke: c.atrament, width: 2.2, seed: seed + 18, single: true },
    { t: 'line', x1: 46, y1: 58, x2: 54, y2: 62, stroke: c.atrament, width: 2.2, seed: seed + 19, single: true },
    { t: 'line', x1: 14, y1: 146, x2: 226, y2: 142, stroke: c.atrament, width: 2.2, seed: seed + 20, single: true },
  ]);

export const doodle = (kind, { seed = 11, width = 240, height = 170 } = {}) =>
  `<svg width="${width}" height="${height}" viewBox="0 0 240 170" aria-hidden="true" style="display:block">${kind === 'tram' ? tram(seed) : lighthouse(seed)}</svg>`;

const cardTop = (data, lang, { side }) => {
  const k = data.card;
  const deck = data.decks[k.deck];
  return `<div class="m-top"><span class="m-x">${icons.close.replace('<svg ', '<svg width="18" height="18" ')}</span><div style="flex:1"><div style="display:flex;justify-content:space-between;font-size:13px;font-weight:500;margin-bottom:6px"><span>${text(deck.name, lang)}</span><span class="m-small">${text(k.progress, lang)}</span></div><div class="m-bar"><i style="width:28%"></i></div></div></div>
<div class="m-pad" style="display:flex;gap:8px;margin-top:10px"><span class="m-chip${side === 'front' ? ' m-chip--ink' : ''}">${text(k.front, lang)}</span><span class="m-chip${side === 'back' ? ' m-chip--ink' : ''}">${text(k.back, lang)}</span><span class="m-lang" style="margin-left:auto;align-self:center">${esc(deck.lang)}</span></div>`;
};

const przod = (data, ctx) => {
  const { lang } = ctx;
  const k = data.card;
  const deck = data.decks[k.deck];
  return `<div class="m-scr"><div class="m-body">${cardTop(data, lang, { side: 'front' })}
<div class="m-card m-card--rule m-ruled" data-mark="card-front" style="margin:16px 20px 0;height:500px;padding-top:28px;padding-right:22px">
<div class="m-kicker">${text(deck.kind, lang)}</div>
<div style="display:flex;align-items:center;justify-content:space-between;margin-top:14px"><div data-mark="word" style="font-weight:700;font-size:44px;line-height:1.1;letter-spacing:-.015em">${text(k.word, lang)}</div><span class="m-ico" style="border-radius:50%">${icons.speaker}</span></div>
<div class="m-small" style="margin-top:4px">${text(k.pos, lang)}</div>
<div style="margin-top:64px" class="m-kicker">${lang === 'pl' ? 'Zdanie' : 'Sentence'}</div>
<p data-mark="sentence" style="margin:10px 0 0;font-size:22px;line-height:1.55">${esc(k.before)}<span class="m-mark">${esc(k.mark)}</span>${text(k.after, lang)}</p>
<div class="m-small" style="margin-top:14px">${text(k.source, lang)}</div>
<div class="m-small" style="position:absolute;left:34px;bottom:22px;display:flex;align-items:center;gap:8px">${icons.flip.replace('<svg ', '<svg width="18" height="18" ')}${lang === 'pl' ? 'Stuknij, aby odwrócić' : 'Tap to flip'}</div>
</div>
<div class="m-btn" data-mark="show" style="position:absolute;left:20px;right:20px;bottom:36px">${text(k.show, lang)}</div>
</div></div>`;
};

export const hintCard = (data, lang, { seed = 11, mark = 'hint' } = {}) => {
  const k = data.card;
  return `<div class="m-hint" data-mark="${mark}" style="position:relative;padding:14px 16px 12px;border-radius:12px;background:#FFFBEA;box-shadow:inset 0 0 0 1.5px #EFE3B4"><div class="m-kicker" style="display:flex;align-items:center;gap:6px">${icons.pencil.replace('<svg ', '<svg width="15" height="15" ')}${text(k.hintLabel, lang)}</div><div style="display:flex;justify-content:center;margin-top:4px">${doodle(k.doodle, { seed, width: 240, height: 158 })}</div><div class="m-hand" style="margin-top:2px;font-size:23px;line-height:1.1;text-align:center">${text(k.hintNote, lang)}</div></div>`;
};

const grade = (label, when, cls) => `<div class="m-btn ${cls}" style="flex:1;flex-direction:column;gap:0;height:60px;font-size:15px"><span>${esc(label)}</span><span style="font-size:12px;font-weight:400;opacity:.85">${esc(when)}</span></div>`;

const tyl = (data, ctx) => {
  const { lang } = ctx;
  const k = data.card;
  return `<div class="m-scr"><div class="m-body">${cardTop(data, lang, { side: 'back' })}
<div class="m-card m-card--rule" data-mark="card-back" style="margin:16px 20px 0;height:548px;padding-top:24px;padding-right:20px">
<div style="font-weight:500;font-size:17px;color:${c.olowek}">${text(k.word, lang)}</div>
<div data-mark="meaning" style="margin-top:4px;font-weight:700;font-size:27px;line-height:1.15;letter-spacing:-.01em">${text(k.meaning, lang)}</div>
<p style="margin:14px 0 0;font-size:16px;line-height:1.45">${esc(k.before)}<b>${esc(k.mark)}</b>${text(k.after, lang)}</p>
<p style="margin:6px 0 0;font-size:15px;line-height:1.45;color:${c.olowek}">${text(k.translation, lang)}</p>
<div style="margin-top:18px">${ctx.hideHint ? `<div data-mark="hint" style="height:262px;border-radius:12px;border:2px dashed #E3D9B5;background:#FFFDF4"></div>` : hintCard(data, lang)}</div>
</div>
<div style="position:absolute;left:20px;right:20px;bottom:30px;display:flex;gap:10px">${grade(k.again[0], k.again[1], 'm-btn--again')}${grade(k.hard[0], k.hard[1], 'm-btn--soft')}${grade(k.good[0], k.good[1], 'm-btn--good')}</div>
</div></div>`;
};

const dzis = (data, ctx) => {
  const { lang } = ctx;
  const d = data.dzis;
  return `<div class="m-scr"><div class="m-body">
<div class="m-pad" style="padding-top:14px"><div class="m-small">${text(d.date, lang)}</div><h1 class="m-h1" style="margin-top:4px">${text(d.hello, lang)}</h1></div>
<div class="m-card m-card--rule" style="margin:18px 20px 0;padding:20px 20px 20px 38px">
<div class="m-kicker">${text(d.setLabel, lang)}</div>
<div style="margin-top:10px"><span data-mark="set" style="display:inline-block;font-weight:700;font-size:34px;line-height:1.1;letter-spacing:-.01em">${text(d.count, lang)}<span style="font-weight:500;font-size:20px;color:${c.atrament}">&nbsp;&nbsp;${text(d.time, lang)}</span></span></div>
<div style="display:flex;gap:8px;margin-top:14px">${d.split.map(([n, label], i) => `<span class="m-chip${i ? '' : ' m-chip--mint'}"><b style="font-weight:700">${esc(n)}</b>${text(label, lang)}</span>`).join('')}</div>
<div class="m-btn" style="margin-top:18px">${text(d.start, lang)}</div>
</div>
<div class="m-pad" style="margin-top:22px"><div class="m-h2">${text(d.dueTitle, lang)}</div></div>
<div style="margin:10px 20px 0;display:flex;flex-direction:column;gap:8px">${d.due
    .map(([id, count]) => {
      const deck = data.decks[id];
      return `<div class="m-card m-row" style="padding:10px 14px 10px 10px">${deckIcon(id)}<div style="flex:1;min-width:0"><div style="font-weight:500;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${text(deck.name, lang)}</div><div class="m-small">${text(deck.kind, lang)}</div></div><span class="m-lang">${esc(deck.lang)}</span><b style="font-weight:700;font-size:14px;min-width:54px;text-align:right">${text(count, lang)}</b></div>`;
    })
    .join('')}</div>
<div class="m-card m-row" data-mark="next" style="margin:14px 20px 0;padding:12px 14px 12px 10px;background:#F3F7FB;box-shadow:0 0 0 1px #DCE6F0"><span class="m-ico" style="background:#fff">${icons.clock}</span><div style="flex:1"><div class="m-small">${text(d.nextLabel, lang)}</div><div style="font-weight:700;font-size:16px">${text(d.nextValue, lang)}</div><div class="m-small" style="font-size:12px">${text(d.nextNote, lang)}</div></div></div>
${tabs(data, 0, lang)}</div></div>`;
};

const dodaj = (data, ctx) => {
  const { lang } = ctx;
  const a = data.add;
  const deck = data.decks.ksiazka;
  return `<div class="m-scr"><div class="m-body">
<div class="m-pad" style="padding-top:14px;display:flex;align-items:center;justify-content:space-between"><h1 class="m-h1">${text(a.title, lang)}</h1><span class="m-x">${icons.close.replace('<svg ', '<svg width="18" height="18" ')}</span></div>
<div class="m-pad m-small" style="margin-top:6px">${text(a.source, lang)}</div>
<div class="m-card m-card--rule" style="margin:16px 20px 0;padding:18px 20px 22px 38px"><p style="margin:0;font-size:18px;line-height:2.05">${text(a.before, lang)}<span class="m-sel" data-mark="word">${esc(a.mark)}<b style="left:-5px;top:-9px"></b><b style="right:-5px;bottom:-9px"></b></span>${text(a.after, lang)}</p></div>
<div class="m-sheet" data-mark="sheet" style="bottom:82px">
<div class="m-handle"></div>
<div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px"><div><div style="font-weight:700;font-size:24px">${esc(a.word)}</div><div style="font-size:16px;color:${c.olowek}">${text(a.meaning, lang)}</div></div><span class="m-lang">${esc(deck.lang)}</span></div>
<div class="m-row" style="margin-top:14px;gap:8px"><span class="m-small">${text(a.deckLabel, lang)}</span><span class="m-chip m-chip--mint">${icons.ksiazka.replace('<svg ', '<svg width="15" height="15" ')}${text(deck.name, lang)}</span></div>
<div class="m-row" style="margin-top:12px;gap:10px;font-size:14px"><span class="m-check">${icons.check.replace('<svg ', '<svg width="14" height="14" ')}</span>${text(a.keep, lang)}</div>
<div class="m-btn" data-mark="addbtn" style="margin-top:16px">${icons.plus.replace('<svg ', '<svg width="20" height="20" ')}${text(a.button, lang)}</div>
<div class="m-small" style="margin-top:10px;text-align:center">${text(a.added, lang)}</div>
</div>
${tabs(data, 2, lang)}</div></div>`;
};

const notatki = (data, ctx) => {
  const { lang } = ctx;
  const n = data.notatki;
  const deck = data.decks[lang === 'pl' ? 'wyjazd' : 'wyjazd'];
  return `<div class="m-scr"><div class="m-body">
<div class="m-pad" style="padding-top:14px;display:flex;align-items:center;justify-content:space-between"><h1 class="m-h1">${text(n.title, lang)}</h1><span class="m-x">${icons.close.replace('<svg ', '<svg width="18" height="18" ')}</span></div>
<div class="m-card m-row" data-mark="photo" style="margin:16px 20px 0;padding:10px 14px 10px 10px"><span class="m-ico">${icons.camera}</span><div style="flex:1"><div style="font-weight:500">${text(n.source, lang)}</div><div class="m-small">${text(n.found, lang)}</div></div><span class="m-check">${icons.check.replace('<svg ', '<svg width="14" height="14" ')}</span></div>
<div class="m-card m-card--rule" data-mark="list" style="margin:14px 20px 0;padding:6px 16px 6px 38px">${n.items
    .map(([word, meaning], i) => `<div class="m-row" style="padding:11px 0;${i ? 'border-top:1px solid #EEF0F4' : ''}"><div style="flex:1;min-width:0"><div style="font-weight:700;font-size:16px">${esc(word)}</div><div class="m-small" style="font-size:14px">${text(meaning, lang)}</div></div><span class="m-check">${icons.check.replace('<svg ', '<svg width="14" height="14" ')}</span></div>`)
    .join('')}<div class="m-small" style="padding:8px 0 6px">${text(n.more, lang)}</div></div>
<div style="position:absolute;left:20px;right:20px;bottom:118px" class="m-row"><span class="m-small">${text(n.deckLabel, lang)}</span><span class="m-chip m-chip--mint">${icons.wyjazd.replace('<svg ', '<svg width="15" height="15" ')}${text(deck.name, lang)}</span></div>
<div class="m-btn" data-mark="create" style="position:absolute;left:20px;right:20px;bottom:44px">${text(n.button, lang)}</div>
</div></div>`;
};

const postep = (data, ctx) => {
  const { lang } = ctx;
  const p = data.postep;
  const max = Math.max(...p.minutes);
  return `<div class="m-scr"><div class="m-body">
<div class="m-pad" style="padding-top:14px"><h1 class="m-h1">${text(p.title, lang)}</h1></div>
<div class="m-card m-card--rule" style="margin:16px 20px 0;padding:16px 18px 16px 38px;display:flex;align-items:flex-end;justify-content:space-between;gap:12px"><div><div style="font-weight:700;font-size:44px;line-height:1">${esc(p.known)}</div><div style="font-size:15px;margin-top:4px">${text(p.knownLabel, lang)}</div></div><span class="m-chip m-chip--mint">${text(p.streak, lang)}</span></div>
<div class="m-card" style="margin:14px 20px 0;padding:16px 18px 18px">
<div class="m-kicker">${text(p.weekTitle, lang)}</div><div style="margin-top:12px"><span data-mark="avg" style="display:inline-block"><b style="font-weight:700;font-size:24px">${esc(p.avg)}</b> <span class="m-small">${text(p.avgLabel, lang)}</span></span></div>
<div data-mark="chart" style="position:relative;display:flex;align-items:flex-end;gap:12px;height:138px;margin-top:30px;padding-bottom:22px;border-bottom:1px solid #E4E9F1">${p.minutes
    .map((m, i) => `<div style="flex:1;position:relative;height:${Math.round((m / max) * 104)}px;border-radius:7px 7px 3px 3px;background:${i === p.today ? c.atrament : '#C9D6EA'}"><span style="position:absolute;left:0;right:0;top:-19px;text-align:center;font-size:12px;font-weight:500;color:${c.olowek}">${m}</span><span style="position:absolute;left:-4px;right:-4px;bottom:-22px;text-align:center;font-size:12px;color:${i === p.today ? c.atrament : c.olowek};font-weight:${i === p.today ? 700 : 400}">${esc(p.days[i])}</span></div>`)
    .join('')}<span style="position:absolute;left:0;right:0;bottom:${22 + Math.round((6 / max) * 104)}px;border-top:1.5px dashed ${c.zielenUi}"></span></div>
</div>
<div class="m-pad" style="margin-top:20px"><div class="m-h2" style="font-size:16px">${text(p.calendarTitle, lang)}</div></div>
<div style="display:flex;gap:8px;margin:10px 20px 0">${p.calendar
    .map(([day, date, count], i) => `<div class="m-card" style="flex:1;padding:8px 0 10px;text-align:center;${i === 0 ? `background:${c.atrament};color:#fff;box-shadow:none` : ''}"><div style="font-size:12px;opacity:.8">${esc(day)}</div><div style="font-weight:700;font-size:20px;line-height:1.2">${esc(date)}</div><div style="font-size:12px;opacity:.85">${text(`${count} ${p.unit}`, lang)}</div></div>`)
    .join('')}</div>
${tabs(data, 3, lang)}</div></div>`;
};

const talie = (data, ctx) => {
  const { lang } = ctx;
  const t = data.talie;
  return `<div class="m-scr"><div class="m-body">
<div class="m-pad" style="padding-top:14px"><h1 class="m-h1">${text(t.title, lang)}</h1></div>
<div class="m-pad" style="display:flex;gap:8px;margin-top:14px">${t.filters.map((f, i) => `<span class="m-chip${i === 0 ? ' m-chip--ink' : ''}">${text(f, lang)}</span>`).join('')}</div>
<div style="display:flex;flex-direction:column;gap:12px;margin:16px 20px 0">${['ksiazka', 'serial', 'wyjazd']
    .map(id => {
      const deck = data.decks[id];
      const share = Math.round((deck.known / deck.count) * 100);
      return `<div class="m-card m-card--rule" data-mark="deck-${id}" style="padding:16px 16px 16px 38px"><div class="m-row" style="align-items:flex-start">${deckIcon(id)}<div style="flex:1;min-width:0"><div class="m-kicker">${text(deck.kind, lang)}</div><div style="font-weight:700;font-size:17px;line-height:1.25;margin-top:2px">${text(deck.name, lang)}</div></div><span class="m-lang">${esc(deck.lang)}</span></div><div class="m-bar" style="margin-top:14px"><i style="width:${share}%"></i></div><div style="display:flex;justify-content:space-between;margin-top:8px;font-size:13px"><span class="m-small">${deck.known} ${text(t.knownLabel, lang)} / ${text(deck.total, lang)}</span><span class="m-chip m-chip--sun" style="height:22px;font-size:12px">${text(deck.due, lang)}</span></div></div>`;
    })
    .join('')}</div>
<div class="m-btn m-btn--dash" style="margin:14px 20px 0">${icons.plus.replace('<svg ', '<svg width="20" height="20" ')}${text(t.newDeck, lang)}</div>
${tabs(data, 1, lang)}</div></div>`;
};

const screens = { dzis, przod, tyl, dodaj, notatki, postep, talie };

export const screenOrder = ['dzis', 'przod', 'tyl', 'dodaj', 'notatki', 'postep', 'talie'];

export const renderScreen = (id, data, ctx) => {
  const fn = screens[id];
  if (!fn) throw new Error(`margines: unknown screen ${id}`);
  return fn(data, ctx);
};
