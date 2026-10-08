import { esc, text } from '../../kit/kit.mjs';
import { colors, food } from './art.mjs';

const c = colors;

const line = (d, w = 2.4) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

export const icons = {
  week: line('<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17M8 14h3M13 14h3M8 17h3"/>'),
  cart: line('<path d="M3 4h2.5l2.2 10.5h10.6L20.5 7H7"/><circle cx="9.5" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/>'),
  book: line('<path d="M5 4.5h11a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3Z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>'),
  heart: line('<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z"/>'),
  check: line('<path d="m5 12.5 4.3 4.2L19 7"/>', 3.2),
  plus: line('<path d="M12 5v14M5 12h14"/>', 3),
  minus: line('<path d="M5 12h14"/>', 3),
  search: line('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4.5 4.5"/>', 2.6),
  back: line('<path d="m14.5 5-7 7 7 7"/>', 2.8),
  share: line('<path d="M12 15V4M7.5 8.5 12 4l4.5 4.5M5 13v6h14v-6"/>'),
  clock: line('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  people: line('<circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19c.6-3.4 2.8-5.2 5.5-5.2s4.9 1.8 5.5 5.2"/><circle cx="16.8" cy="9.5" r="2.6"/><path d="M15.6 13.9c2.4.1 4.2 1.7 4.9 4.6"/>'),
  grip: line('<path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01"/>', 3.6),
  pause: line('<path d="M9 5.5v13M15 5.5v13"/>', 3.4),
  pencil: line('<path d="M15 4.5 19.5 9 9 19.5H4.5V15Z"/><path d="m13 6.5 4.5 4.5"/>'),
  close: line('<path d="M6 6l12 12M18 6 6 18"/>', 2.8),
  camera: line('<path d="M4 8h3l1.8-2.5h6.4L17 8h3v11H4Z"/><circle cx="12" cy="13.2" r="3.4"/>'),
};

const small = (icon, size = 18) => icon.replace('<svg ', `<svg width="${size}" height="${size}" `);

const tabIcons = [icons.week, icons.cart, icons.book, icons.heart];

const tabs = (data, active, lang) =>
  `<nav class="c-tabs">${data.tabs.map((label, i) => `<span class="c-tab${i === active ? ' c-tab--on' : ''}"><span class="c-tab__i">${tabIcons[i]}</span><span>${text(label, lang)}</span></span>`).join('')}</nav>`;

const fill = name => ({ pomidor: c.pomidor, musztarda: c.musztarda, turkus: c.turkus, roz: c.roz, kobalt: c.kobalt })[name] ?? c.biel;

const tydzien = (data, ctx) => {
  const { lang } = ctx;
  const t = data.tydzien;
  const rows = t.days
    .map(day => {
      const label = `<div style="width:44px;flex:none;text-align:center"><div style="font-weight:800;font-size:13px;text-transform:uppercase;letter-spacing:.04em">${esc(day.d)}</div><div style="font-weight:800;font-size:20px;line-height:1.1">${esc(day.n)}</div></div>`;
      if (day.empty)
        return `<div class="c-row" data-mark="slot-empty" style="height:66px;gap:10px">${label}<div style="flex:1;height:58px;display:flex;align-items:center;justify-content:center;gap:8px;border:2.5px dashed ${c.kontur};border-radius:16px;background:rgba(246,180,0,.18);font-weight:700;font-size:14px;color:${c.szary}">${small(icons.plus, 16)}${text(day.empty, lang)}</div></div>`;
      return `<div class="c-row" style="height:66px;gap:10px">${label}<div class="c-card c-row" style="flex:1;height:58px;padding:0 10px 0 6px;gap:10px;${day.today ? `background:${c.musztarda}` : ''}">${food(day.food, 42, day.today ? c.biel : c.krem)}<div style="flex:1;min-width:0"><div style="font-weight:700;font-size:15px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${text(day.dish, lang)}</div><div class="c-muted" style="${day.today ? `color:${c.kontur}` : ''}">${esc(day.time)}</div></div>${day.today ? `<span class="c-tag" style="background:${c.biel}">${esc(t.today)}</span>` : ''}</div></div>`;
    })
    .join('');
  const drag = t.dragging;
  return `<div class="c-scr"><div class="c-body">
<div class="c-pad" style="padding-top:12px;display:flex;align-items:flex-end;justify-content:space-between;gap:10px"><div><div class="c-muted" style="font-weight:700">${text(t.range, lang)}</div><h1 class="c-h1" style="margin-top:2px">${text(t.title, lang)}</h1></div><span class="c-chip c-chip--small c-chip--pink">${small(icons.people, 15)}${text(t.people, lang)}</span></div>
<div class="c-pad" style="margin-top:12px;display:flex;align-items:center;gap:10px"><div class="c-bar" style="flex:1"><i style="width:86%"></i></div><span style="font-weight:800;font-size:13px;white-space:nowrap">${text(t.planned, lang)}</span></div>
<div data-mark="week" style="position:relative;margin:10px 20px 0;display:flex;flex-direction:column;gap:2px">${rows}
<div class="c-card c-row" data-mark="drag" style="position:absolute;left:90px;right:-24px;top:${4 * 68 - 8}px;height:58px;padding:0 10px 0 6px;gap:10px;background:${c.roz};transform:rotate(-3deg);z-index:2">${food(drag.food, 42, c.biel)}<div style="flex:1;min-width:0"><div style="font-weight:700;font-size:15px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${text(drag.dish, lang)}</div><div class="c-muted" style="color:${c.kontur}">${esc(drag.time)}</div></div><span style="display:flex;color:${c.kontur}">${small(icons.grip, 20)}</span></div>
</div>
<div class="c-btn c-btn--sun" style="position:absolute;left:20px;right:20px;bottom:98px">${small(icons.cart, 20)}${text(t.list, lang)}</div>
${tabs(data, 0, lang)}</div></div>`;
};

const zakupy = (data, ctx) => {
  const { lang } = ctx;
  const z = data.zakupy;
  const aisles = z.aisles
    .map(
      aisle => `<div style="margin-top:12px"><div class="c-kicker" style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span class="c-dot" style="background:${c.pomidor}"></span>${text(aisle.name, lang)}</div><div class="c-card" style="padding:2px 14px">${aisle.items
        .map(
          ([name, qty, done, from], i) =>
            `<div class="c-row" style="height:44px;${i ? `border-top:2px solid ${c.kontur}` : ''}"><span class="c-check${done ? ' c-check--on' : ''}">${done ? small(icons.check, 16) : ''}</span><div style="flex:1;min-width:0;line-height:1.15"><div style="font-weight:700;font-size:15px;${done ? 'text-decoration:line-through;text-decoration-thickness:2px' : ''}">${text(name, lang)}</div><div class="c-muted" style="font-size:12px">${text(from, lang)}</div></div><b style="font-weight:800;font-size:15px">${esc(qty)}</b></div>`,
        )
        .join('')}</div></div>`,
    )
    .join('');
  return `<div class="c-scr"><div class="c-body">
<div class="c-pad" style="padding-top:12px;display:flex;align-items:flex-start;justify-content:space-between;gap:10px"><div><h1 class="c-h1">${text(z.title, lang)}</h1><div class="c-muted" style="margin-top:3px;font-weight:700">${text(z.sub, lang)}</div></div><span class="c-round">${icons.share}</span></div>
<div class="c-pad" style="margin-top:10px;display:flex;align-items:center;gap:10px"><div class="c-bar" style="flex:1"><i style="width:${z.share}%"></i></div><span style="font-weight:800;font-size:13px;white-space:nowrap">${text(z.done, lang)}</span></div>
<div class="c-pad" data-mark="list">${aisles}</div>
<div class="c-pad" style="margin-top:10px"><div class="c-row" style="height:40px;padding:0 14px;border:2.5px dashed ${c.kontur};border-radius:14px;font-weight:700;font-size:14px;color:${c.szary}">${text(z.more, lang)}</div></div>
${tabs(data, 1, lang)}</div></div>`;
};

const lodowka = (data, ctx) => {
  const { lang } = ctx;
  const l = data.lodowka;
  const results = l.results
    .map(
      r => `<div class="c-card c-row" style="padding:10px 12px 10px 10px;gap:12px">${food(r.food, 52, c.krem)}<div style="flex:1;min-width:0"><div style="font-weight:800;font-size:16px;line-height:1.2">${text(r.name, lang)}</div><div class="c-row" style="gap:8px;margin-top:5px"><span class="c-muted" style="display:inline-flex;align-items:center;gap:4px">${small(icons.clock, 14)}${esc(r.time)}</span><span style="font-weight:700;font-size:13px;color:${r.match === r.of ? '#0E6E63' : c.pomidor}">${text(r.have, lang)}</span></div><div class="c-row" style="gap:4px;margin-top:7px">${Array.from({ length: r.of }, (_, i) => `<span style="flex:1;height:8px;border:2px solid ${c.kontur};border-radius:3px;background:${i < r.match ? c.turkus : c.biel}"></span>`).join('')}</div></div></div>`,
    )
    .join('');
  return `<div class="c-scr"><div class="c-body">
<div class="c-pad" style="padding-top:12px"><h1 class="c-h1">${text(l.title, lang)}</h1><div class="c-muted" style="margin-top:3px;font-weight:700">${text(l.sub, lang)}</div></div>
<div class="c-pad" style="margin-top:12px"><div class="c-row" style="height:46px;padding:0 14px;border:2.5px solid ${c.kontur};border-radius:14px;background:${c.biel};gap:10px;color:${c.szary};font-weight:700">${small(icons.search, 18)}${text(l.search, lang)}</div></div>
<div class="c-pad" data-mark="picked" style="margin-top:12px;display:flex;flex-wrap:wrap;gap:8px">${l.picked.map(item => `<span class="c-chip c-chip--on">${small(icons.check, 14)}${text(item, lang)}</span>`).join('')}${l.other.map(item => `<span class="c-chip">${text(item, lang)}</span>`).join('')}</div>
<div class="c-pad" style="margin-top:16px;display:flex;align-items:center;justify-content:space-between"><div class="c-h2">${text(l.resultsTitle, lang)}</div><span class="c-tag" style="background:${c.turkus}">${l.results.length}</span></div>
<div data-mark="results" style="margin:10px 20px 0;display:flex;flex-direction:column;gap:10px">${results}</div>
${tabs(data, 2, lang)}</div></div>`;
};

const przepis = (data, ctx) => {
  const { lang } = ctx;
  const p = data.przepis;
  const groups = p.groups
    .map(
      g => `<div style="margin-top:12px"><div class="c-kicker" style="margin-bottom:6px">${text(g.name, lang)}</div><div class="c-card" style="padding:2px 14px">${g.items.map(([name, qty], i) => `<div class="c-row" style="height:40px;justify-content:space-between;${i ? `border-top:2px solid ${c.kontur}` : ''}"><span style="font-weight:600;font-size:15px">${text(name, lang)}</span><b data-mark="qty-${i}" style="font-weight:800;font-size:15px">${esc(qty)}</b></div>`).join('')}</div></div>`,
    )
    .join('');
  return `<div class="c-scr"><div class="c-body">
<div class="c-top"><span class="c-round">${icons.back}</span><span class="c-round">${icons.heart}</span></div>
<div class="c-pad" style="margin-top:10px;display:flex;gap:14px;align-items:center">${food('pierogi', 72, c.musztarda)}<div style="min-width:0"><div class="c-tag" style="background:${c.roz}">${text(p.from, lang)}</div><h1 class="c-h1" style="margin-top:6px;font-size:27px">${text(p.title, lang)}</h1></div></div>
<div class="c-pad" style="margin-top:10px;display:flex;gap:6px">${p.meta.map(m => `<span class="c-chip c-chip--small">${text(m, lang)}</span>`).join('')}</div>
<div class="c-pad" style="margin-top:14px"><div class="c-card c-row" data-mark="stepper" style="justify-content:space-between;padding:8px 8px 8px 16px;background:${c.musztarda}"><div><div class="c-kicker">${text(p.portionsLabel, lang)}</div><div style="font-weight:800;font-size:24px;line-height:1.1">${text(p.portions, lang)}</div></div><div class="c-row" style="gap:8px"><span class="c-round">${icons.minus}</span><span class="c-round" style="background:${c.kobalt};color:${c.krem}">${icons.plus}</span></div></div></div>
<div class="c-pad" data-mark="ingredients">${groups}</div>
<div style="position:absolute;left:20px;right:20px;bottom:30px;display:flex;gap:10px"><div class="c-btn c-btn--light" style="flex:1.3">${small(icons.cart, 19)}${text(p.add, lang)}</div><div class="c-btn" style="flex:1">${text(p.cook, lang)}</div></div>
</div></div>`;
};

const gotowanie = (data, ctx) => {
  const { lang } = ctx;
  const g = data.gotowanie;
  const ring = 2 * Math.PI * 86;
  return `<div class="c-scr"><div class="c-body">
<div class="c-top"><span class="c-round">${icons.close}</span><div style="flex:1;text-align:center;font-weight:800;font-size:15px">${text(g.title, lang)}</div><span class="c-round">${icons.book}</span></div>
<div class="c-pad" style="margin-top:14px;display:flex;gap:6px">${Array.from({ length: g.steps }, (_, i) => `<span style="flex:1;height:10px;border:2px solid ${c.kontur};border-radius:5px;background:${i < g.current ? c.pomidor : c.biel}"></span>`).join('')}</div>
<div class="c-pad" style="margin-top:14px"><span class="c-tag">${text(g.step, lang)}</span><p style="margin:10px 0 0;font-weight:700;font-size:22px;line-height:1.3;text-wrap:balance">${text(g.text, lang)}</p><div style="display:flex;gap:8px;margin-top:12px">${g.uses.map(u => `<span class="c-chip c-chip--small">${text(u, lang)}</span>`).join('')}</div></div>
<div data-mark="timer" style="position:relative;width:212px;height:212px;margin:20px auto 0"><svg width="212" height="212" viewBox="0 0 212 212" aria-hidden="true"><circle cx="106" cy="106" r="102" fill="${c.biel}" stroke="${c.kontur}" stroke-width="3"/><circle cx="106" cy="106" r="86" fill="none" stroke="${c.krem}" stroke-width="18"/><circle cx="106" cy="106" r="86" fill="none" stroke="${c.turkus}" stroke-width="18" stroke-dasharray="${(ring * g.share) / 100} ${ring}" transform="rotate(-90 106 106)"/><circle cx="106" cy="106" r="95" fill="none" stroke="${c.kontur}" stroke-width="2.5"/><circle cx="106" cy="106" r="77" fill="none" stroke="${c.kontur}" stroke-width="2.5"/></svg><div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center"><div class="c-kicker">${text(g.timerLabel, lang)}</div><div style="font-weight:800;font-size:46px;line-height:1;letter-spacing:-.02em">${esc(g.timer)}</div><div class="c-muted" style="font-weight:700">${text(g.timerOf, lang)}</div></div></div>
<div class="c-pad" style="margin-top:16px;display:flex;gap:10px;justify-content:center"><span class="c-chip" style="height:42px;padding:0 18px">${small(icons.pause, 16)}${text(g.pause, lang)}</span><span class="c-chip c-chip--on" style="height:42px;padding:0 18px">${esc(g.plus)}</span></div>
<div class="c-card c-row" style="position:absolute;left:20px;right:20px;bottom:30px;padding:12px 14px;gap:12px;background:${c.roz}"><div style="flex:1;font-weight:700;font-size:14px;line-height:1.3">${text(g.next, lang)}</div><span class="c-round" style="background:${c.kobalt};color:${c.krem}">${icons.back.replace('m14.5 5-7 7 7 7', 'm9.5 5 7 7-7 7')}</span></div>
</div></div>`;
};

const kolekcje = (data, ctx) => {
  const { lang } = ctx;
  const k = data.kolekcje;
  const tiles = k.items
    .map(
      item => `<div class="c-card" style="padding:12px;background:${fill(item.color)};height:128px;display:flex;flex-direction:column;justify-content:space-between">${food(item.food, 48, c.biel)}<div><div style="font-weight:800;font-size:16px;line-height:1.15">${text(item.name, lang)}</div><div style="font-weight:600;font-size:13px">${text(item.count, lang)}</div></div></div>`,
    )
    .join('');
  const recent = k.recent
    .map((r, i) => `<div class="c-row" style="height:60px;${i ? `border-top:2px solid ${c.kontur}` : ''}">${food(r.food, 42, c.krem)}<div style="flex:1;min-width:0"><div style="font-weight:800;font-size:15px">${text(r.name, lang)}</div><div class="c-muted">${text(r.who, lang)}</div></div></div>`)
    .join('');
  return `<div class="c-scr"><div class="c-body">
<div class="c-pad" style="padding-top:12px;display:flex;align-items:flex-end;justify-content:space-between;gap:10px"><h1 class="c-h1">${text(k.title, lang)}</h1><span class="c-round" style="background:${c.kobalt};color:${c.krem}">${icons.plus}</span></div>
<div class="c-pad" style="margin-top:8px"><span class="c-chip c-chip--small c-chip--sea">${small(icons.people, 14)}${text(k.family, lang)}</span></div>
<div data-mark="collections" style="margin:14px 20px 0;display:grid;grid-template-columns:1fr 1fr;gap:10px">${tiles}</div>
<div class="c-pad" style="margin-top:16px"><div class="c-h2">${text(k.recentTitle, lang)}</div><div class="c-card" style="margin-top:8px;padding:0 12px">${recent}</div></div>
<div class="c-pad" style="margin-top:12px"><div class="c-row" style="height:44px;justify-content:center;gap:8px;border:2.5px dashed ${c.kontur};border-radius:14px;font-weight:700;font-size:14px">${small(icons.camera, 18)}${text(k.add, lang)}</div></div>
${tabs(data, 3, lang)}</div></div>`;
};

const dzis = (data, ctx) => {
  const { lang } = ctx;
  const d = data.dzis;
  const next = d.next
    .map((n, i) => `<div class="c-row" style="padding:12px 0;align-items:flex-start;${i ? `border-top:2px solid ${c.kontur}` : ''}">${food(n.food, 44, c.krem)}<div style="flex:1;min-width:0"><div class="c-kicker" style="color:${c.szary}">${text(n.when, lang)}</div><div style="font-weight:800;font-size:15px;line-height:1.2;margin-top:1px">${text(n.dish, lang)}</div><div class="c-muted" style="margin-top:2px">${text(n.note, lang)}</div></div></div>`)
    .join('');
  return `<div class="c-scr"><div class="c-body">
<div class="c-pad" style="padding-top:12px"><div class="c-muted" style="font-weight:700">${text(d.date, lang)}</div><h1 class="c-h1" style="margin-top:2px">${text(d.hello, lang)}</h1></div>
<div class="c-card" data-mark="today" style="margin:14px 20px 0;padding:16px;background:${c.musztarda}"><div class="c-kicker">${text(d.label, lang)}</div><div style="display:flex;justify-content:center;margin:8px 0 6px">${food('leczo', 128, c.biel)}</div><div style="font-weight:800;font-size:25px;line-height:1.15;text-align:center">${text(d.dish, lang)}</div><div style="text-align:center;font-weight:700;font-size:14px;margin-top:4px">${text(d.meta, lang)}</div><div class="c-row" style="justify-content:center;gap:8px;margin-top:12px"><span class="c-check c-check--on">${small(icons.check, 16)}</span><span style="font-weight:800;font-size:15px">${text(d.ready, lang)}</span></div><div class="c-btn" style="margin-top:14px">${text(d.start, lang)}</div></div>
<div class="c-card" style="margin:12px 20px 0;padding:0 14px">${next}</div>
${tabs(data, 0, lang)}</div></div>`;
};

const screens = { tydzien, zakupy, lodowka, przepis, gotowanie, kolekcje, dzis };

export const screenOrder = ['tydzien', 'zakupy', 'lodowka', 'przepis', 'gotowanie', 'kolekcje', 'dzis'];

export const renderScreen = (id, data, ctx) => {
  const fn = screens[id];
  if (!fn) throw new Error(`chochla: unknown screen ${id}`);
  return fn(data, ctx);
};
