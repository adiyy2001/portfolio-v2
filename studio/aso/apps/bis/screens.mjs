import { esc, text } from '../../kit/kit.mjs';
import { avatar, colors, cover } from './art.mjs';

const c = colors;
const nb = ' ';

export const t = (value, lang) =>
  text(value, lang)
    .replace(/(\d) (km|min|utw|koncert|wykonaw|tracks|gigs)/g, `$1${nb}$2`)
    .replace(/(\d) (pm|am|sec|s)\b/g, `$1${nb}$2`);

const line = (d, w = 2) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

export const icons = {
  discover: line('<path d="M12 3.5 14 10l6.5 2-6.5 2-2 6.5-2-6.5-6.5-2 6.5-2Z"/>'),
  near: line('<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.4"/>'),
  calendar: line('<rect x="3.5" y="5" width="17" height="15.5" rx="4"/><path d="M8 3v4M16 3v4M3.5 10h17"/>'),
  sticker: line('<path d="M5 4.5h10.5l4 4V15a4.5 4.5 0 0 1-4.5 4.5H9A4.5 4.5 0 0 1 4.5 15V5Z"/><path d="M15 4.5V9h4.5"/><path d="M9 14c1 1 4 1 5 0"/>'),
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5Z" fill="currentColor"/></svg>',
  pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1.5" fill="currentColor"/><rect x="13.5" y="5" width="4" height="14" rx="1.5" fill="currentColor"/></svg>',
  bell: line('<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15Z"/><path d="M10 20.5h4"/>'),
  heart: line('<path d="M12 19.5C6 15.5 4 12.5 4 9.5a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 3-2 6-8 10Z"/>'),
  close: line('<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>'),
  pin: line('<path d="M12 21s-6-5.6-6-10.3a6 6 0 0 1 12 0C18 15.4 12 21 12 21Z"/><circle cx="12" cy="10.5" r="2"/>'),
  clock: line('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  back: line('<path d="m14.5 5.5-6 6.5 6 6.5"/>'),
  down: line('<path d="m6 9.5 6 6 6-6"/>'),
  share: line('<path d="M12 15V4M7.5 8.5 12 4l4.5 4.5"/><path d="M5 13v6.5h14V13"/>'),
  chat: line('<path d="M5 18.5V7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H8.5Z"/>'),
  plus: line('<path d="M12 5v14M5 12h14"/>'),
  ticket: line('<path d="M4 8V6.5h16V8a2.5 2.5 0 0 0 0 5v4.5H4V13a2.5 2.5 0 0 0 0-5Z"/><path d="M14 6.5v11" stroke-dasharray="2 2.4"/>'),
  next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6v12l9-6Z" fill="currentColor"/><rect x="16" y="6" width="2.6" height="12" rx="1" fill="currentColor"/></svg>',
  prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6v12l-9-6Z" fill="currentColor"/><rect x="5.4" y="6" width="2.6" height="12" rx="1" fill="currentColor"/></svg>',
};

export const sized = (icon, size) => icon.replace('<svg ', `<svg width="${size}" height="${size}" `);

export const logo = (size = 40) => `<span class="b-logo" style="width:${size}px;height:${size}px"><svg width="${size * 0.55}" height="${size * 0.55}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5C12.9 9 15 11.1 22.5 12 15 12.9 12.9 15 12 22.5 11.1 15 9 12.9 1.5 12 9 11.1 11.1 9 12 1.5Z" fill="${c.atrament}"/></svg></span>`;

const tabIcons = [icons.discover, icons.near, icons.calendar, icons.sticker];

const tabs = (ui, active, lang) =>
  `<nav class="b-tabs">${ui.tabs.map((label, i) => `<span class="b-tab${i === active ? ' b-tab--on' : ''}"><span class="b-tab__ico">${tabIcons[i]}</span><span>${t(label, lang)}</span></span>`).join('')}</nav>`;

const artist = (ui, id) => ui.artists[id];
const venue = (ui, id) => ui.venues[id];

export const coverBox = (id, size, radius = 14, mark = '') => `<span class="b-coverbox"${mark ? ` data-mark="${mark}"` : ''} style="width:${size}px;height:${size}px;border-radius:${radius}px">${cover(id, { size })}</span>`;

export const waveBars = (count, seed = 3) =>
  Array.from({ length: count }, (_, i) => {
    const v = 0.28 + 0.72 * Math.abs(Math.sin(i * 0.61 + seed) * Math.cos(i * 0.23 + seed * 0.5));
    return Math.round(v * 100) / 100;
  });

const odkrywaj = (ui, { lang }) => {
  const o = ui.odkrywaj;
  const a = artist(ui, o.card.artist);
  const v = venue(ui, o.card.venue);
  const bars = waveBars(20, 2)
    .map(h => `<i style="height:${Math.round(h * 18)}px;width:3px;background:${c.biel}"></i>`)
    .join('');
  const back = (i, item) => {
    const b = artist(ui, item.artist);
    return `<div class="b-card" style="position:absolute;left:${20 + (i + 1) * 12}px;right:${20 + (i + 1) * 12}px;top:${10 - (i + 1) * 10}px;height:440px;overflow:hidden;opacity:${1 - (i + 1) * 0.12}"><div style="position:absolute;left:0;right:0;top:0;height:28px;background:var(--holo)"></div><div class="b-li__sub" style="position:absolute;left:16px;top:6px;color:${c.atrament}">${esc(b.name)}</div></div>`;
  };
  return `<div class="b-scr"><div class="b-body">
<div class="b-head"><h1 class="b-h1">${t(o.title, lang)}</h1>${logo()}</div>
<div class="b-pad b-muted" style="margin-top:4px">${t(o.sub, lang)}</div>
<div class="b-pad b-chips" style="margin-top:14px">${o.chips.map((chip, i) => `<span class="b-chip${i === 0 ? ' b-chip--on' : ''}">${t(chip, lang)}</span>`).join('')}</div>
<div style="position:absolute;left:0;right:0;top:150px">${o.deck.map((item, i) => back(o.deck.length - 1 - i, item)).join('')}
<div class="b-holoedge" style="position:absolute;left:20px;right:20px;top:14px" data-mark="card"><div class="b-card" style="padding:12px;border-radius:22px">
<div style="position:relative;height:226px;overflow:hidden;border-radius:16px"><span style="position:absolute;left:0;top:-48px">${coverBox(o.card.artist, 322, 16)}</span><span class="b-tag b-tag--holo" style="position:absolute;left:10px;top:10px">${esc(a.genre)}</span></div>
<div class="b-between" style="margin-top:12px;align-items:flex-start"><div style="min-width:0"><div class="b-h1" style="font-size:26px">${esc(a.name)}</div><div class="b-muted" style="margin-top:2px">${t(o.card.match, lang)}</div></div></div>
<div class="b-row" style="margin-top:10px;gap:8px">${sized(icons.calendar, 17)}<span style="font-weight:700;font-size:14px">${t(o.card.when, lang)}</span><span class="b-muted">· ${esc(v.name)}, ${t(v.dist, lang)}</span></div>
<div class="b-btn" style="margin-top:12px;height:46px;justify-content:flex-start;padding:0 8px 0 8px"><span style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:var(--limonka);color:${c.atrament}">${sized(icons.play, 16)}</span><span>${t(o.preview, lang)}</span><span class="b-wave" style="height:30px;margin-left:auto;gap:2px;padding-right:8px">${bars}</span></div>
</div></div></div>
<div class="b-pad" style="position:absolute;left:0;right:0;bottom:104px;display:grid;grid-template-columns:1fr 1.4fr;gap:10px"><span class="b-btn b-btn--ghost">${icons.close}${t(o.skip, lang)}</span><span class="b-btn b-btn--lime">${icons.heart}${t(o.follow, lang)}</span></div>
${tabs(ui, 0, lang)}</div></div>`;
};

const gigRow = (ui, item, lang, { big = false } = {}) => {
  const a = artist(ui, item.artist);
  const v = venue(ui, item.venue);
  return `<div class="b-li" style="min-height:${big ? 76 : 70}px"><span class="b-date"><span>${t(item.day, lang)}</span><b>${esc(item.date)}</b></span>${coverBox(item.artist, big ? 56 : 50, 12)}<div class="b-li__main"><div class="b-li__name">${esc(a.name)}</div><div class="b-li__sub">${esc(v.name)} · ${t(v.dist, lang)}</div><div class="b-li__sub" style="color:${c.atrament};font-weight:700;font-size:12.5px">${t(item.note, lang)}</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px"><span class="b-li__end">${t(item.time, lang)}</span>${item.tag ? `<span class="b-tag ${item.tag === 'idziesz' || item.tag === 'going' ? 'b-tag--lime' : 'b-tag--holo'}">${t(item.tag, lang)}</span>` : ''}</div></div>`;
};

const wokolicy = (ui, { lang }) => {
  const w = ui.wokolicy;
  const first = w.list[0];
  const a = artist(ui, first.artist);
  const v = venue(ui, first.venue);
  return `<div class="b-scr"><div class="b-body">
<div class="b-head"><h1 class="b-h1">${t(w.title, lang)}</h1>${logo()}</div>
<div class="b-pad b-row" style="margin-top:4px;gap:6px;color:${c.grafit}">${sized(icons.pin, 16)}<span class="b-muted">${t(w.sub, lang)}</span></div>
<div class="b-pad b-chips" style="margin-top:14px">${w.filters.map((f, i) => `<span class="b-chip${i === 0 ? ' b-chip--on' : ''}">${t(f, lang)}</span>`).join('')}</div>
<div class="b-pad" style="margin-top:16px"><div class="b-holoedge" data-mark="hero"><div class="b-card" style="padding:12px;border-radius:22px;display:flex;gap:14px;align-items:center">${coverBox(first.artist, 104, 16)}<div style="min-width:0;flex:1"><span class="b-tag b-tag--holo">${t(first.tag, lang)} · ${t(first.time, lang)}</span><div class="b-h2" style="font-size:21px;margin-top:8px">${esc(a.name)}</div><div class="b-muted" style="margin-top:2px">${esc(v.name)} · ${t(v.dist, lang)}</div><div class="b-li__sub" style="color:${c.atrament};font-weight:700;margin-top:4px">${t(first.note, lang)}</div></div></div></div></div>
<div class="b-pad" style="margin-top:14px"><div class="b-card" style="padding:2px 0">${w.list
    .slice(1)
    .map(item => gigRow(ui, item, lang))
    .join('')}</div></div>
<div class="b-pad b-muted" style="margin-top:10px;text-align:center">${t(w.more, lang)}</div>
<div class="b-pad" style="margin-top:12px"><div class="b-kicker" style="padding:0 4px 8px">${t(w.soon.label, lang)}</div><div class="b-card" style="padding:10px 12px;display:flex;align-items:center;gap:12px">${coverBox(w.soon.artist, 48, 12)}<div class="b-li__main"><div class="b-li__name" style="font-size:15px">${esc(artist(ui, w.soon.artist).name)}</div><div class="b-li__sub">${t(w.soon.when, lang)} · ${esc(venue(ui, w.soon.venue).name)}</div></div><span class="b-tag b-tag--holo">${sized(icons.bell, 13)}&nbsp;${t(w.soon.sales, lang)}</span></div></div>
${tabs(ui, 1, lang)}</div></div>`;
};

const koncert = (ui, { lang }) => {
  const k = ui.koncert;
  const a = artist(ui, k.artist);
  const v = venue(ui, k.venue);
  const friends = ui.znajomi.people.slice(0, 3);
  return `<div class="b-scr"><div style="position:absolute;left:0;top:0;width:390px;height:300px;overflow:hidden">${cover(k.artist, { size: 390 }).replace('class="b-cover"', 'class="b-cover" style="position:absolute;left:0;top:-45px"')}<div style="position:absolute;left:0;right:0;bottom:0;height:120px;background:linear-gradient(180deg,rgba(238,241,246,0),#EEF1F6)"></div></div><div class="b-body">
<div class="b-between" style="padding:6px 20px 0"><span class="b-ico">${icons.back}</span><span class="b-ico">${icons.share}</span></div>
<div class="b-pad" style="position:absolute;left:0;right:0;top:190px">
<span class="b-tag b-tag--ink">${esc(a.genre)}</span>
<div class="b-h1" style="margin-top:8px;font-size:32px">${esc(a.name)}</div>
<div class="b-muted" style="margin-top:6px">${t(k.about, lang)}</div>
<div class="b-card" style="margin-top:14px;padding:2px 0">
<div class="b-li" style="min-height:58px"><span class="b-ico">${icons.calendar}</span><div class="b-li__main"><div class="b-li__name" style="font-size:15px">${t(k.date, lang)}</div><div class="b-li__sub">${t(k.time, lang)}, ${t(k.doors, lang)}</div></div></div>
<div class="b-li" style="min-height:58px"><span class="b-ico">${icons.pin}</span><div class="b-li__main"><div class="b-li__name" style="font-size:15px">${esc(v.name)}</div><div class="b-li__sub">${t(v.area, lang)} · ${t(v.dist, lang)}</div></div></div>
</div>
<div class="b-holoedge" style="margin-top:12px" data-mark="sales"><div class="b-card" style="padding:14px 16px;border-radius:22px">
<div class="b-kicker">${t(k.salesLabel, lang)}</div><div class="b-h2" style="margin-top:4px">${t(k.salesWhen, lang)}</div>
<div class="b-between" style="margin-top:12px;padding-top:12px;border-top:1px solid #E3E7EE"><div class="b-row" style="gap:10px"><span class="b-ico" style="background:var(--limonka);border-color:transparent">${icons.bell}</span><div><div style="font-weight:700;font-size:15px">${t(k.remind, lang)}</div><div class="b-li__sub">${t(k.remindSub, lang)}</div></div></div><span class="b-switch"><i></i></span></div>
</div></div>
<div class="b-row" style="margin-top:14px;gap:10px"><span class="b-avstack">${friends.map(p => avatar(p.shape, p.tone, 32)).join('')}</span><span class="b-muted" style="color:${c.atrament};font-weight:700">${t(k.watching, lang)}</span></div>
<div class="b-muted" style="margin-top:8px">${t(k.support, lang)}</div>
</div>
<div class="b-pad" style="position:absolute;left:0;right:0;bottom:30px;display:grid;grid-template-columns:1fr 1fr;gap:10px"><span class="b-btn b-btn--ghost">${icons.heart}${t(k.follow, lang)}</span><span class="b-btn">${icons.calendar}${t(k.addCal, lang)}</span></div></div></div>`;
};

const personRow = (p, z, lang) => `<div class="b-li" style="min-height:58px">${avatar(p.shape, p.tone, 42)}<div class="b-li__main"><div class="b-li__name">${esc(p.name)}</div></div><span class="b-tag ${p.state === 'going' ? 'b-tag--lime' : ''}">${t(z.stateLabels[p.state], lang)}</span></div>`;

const znajomi = (ui, { lang }) => {
  const z = ui.znajomi;
  const a = artist(ui, z.artist);
  const v = venue(ui, z.venue);
  const going = z.people.filter(p => p.state === 'going');
  const maybe = z.people.filter(p => p.state === 'maybe');
  return `<div class="b-scr"><div class="b-body">
<div class="b-head"><span class="b-ico">${icons.back}</span><h1 class="b-h1" style="font-size:22px">${t(z.title, lang)}</h1><span class="b-ico">${icons.plus}</span></div>
<div class="b-pad" style="margin-top:14px"><div class="b-holoedge"><div class="b-card" style="padding:10px;border-radius:22px;display:flex;align-items:center;gap:12px">${coverBox(z.artist, 60, 12)}<div class="b-li__main"><div class="b-li__name" style="font-size:18px">${esc(a.name)}</div><div class="b-li__sub">${t(z.when, lang)} · ${esc(v.name)}</div></div><span class="b-tag b-tag--lime">${t(z.youState, lang)}</span></div></div></div>
<div class="b-pad b-between" style="margin-top:16px"><span class="b-kicker">${t(z.goingLabel, lang)} · ${going.length}</span><span class="b-avstack">${going.map(p => avatar(p.shape, p.tone, 26)).join('')}</span></div>
<div class="b-pad" style="margin-top:8px" data-mark="going"><div class="b-card" style="padding:2px 0">${going.map(p => personRow(p, z, lang)).join('')}</div></div>
<div class="b-pad" style="margin-top:14px"><span class="b-kicker">${t(z.maybeLabel, lang)} · ${maybe.length}</span></div>
<div class="b-pad" style="margin-top:8px"><div class="b-card" style="padding:2px 0">${maybe.map(p => personRow(p, z, lang)).join('')}</div></div>
<div class="b-pad" style="margin-top:12px"><div class="b-row" style="gap:10px;padding:12px 14px;border-radius:18px;background:var(--limonka)"><span style="display:flex">${sized(icons.chat, 20)}</span><span style="font-weight:700;font-size:14px">${t(z.meet, lang)}</span></div></div>
<div class="b-pad" style="position:absolute;left:0;right:0;bottom:30px"><span class="b-btn">${icons.plus}${t(z.invite, lang)}</span></div>
</div></div>`;
};

const kalendarz = (ui, { lang }) => {
  const k = ui.kalendarz;
  const marks = new Map(k.marks.map(m => [m.day, m]));
  const cells = [];
  for (let i = 0; i < k.offset; i += 1) cells.push('<span></span>');
  for (let d = 1; d <= k.days; d += 1) {
    const m = marks.get(d);
    const cls = ['b-cal__d'];
    if (d === k.selected) cls.push('b-cal__d--sel');
    else if (m?.going) cls.push('b-cal__d--going');
    else if (m) cls.push('b-cal__d--watch');
    else if (d === k.today) cls.push('b-cal__d--today');
    else if (d < k.today) cls.push('b-cal__d--past');
    cells.push(`<span class="${cls.join(' ')}"${m ? ` data-day="${d}"` : ''}>${d}</span>`);
  }
  const upcoming = k.marks.filter(m => m.day >= k.selected).slice(0, 3);
  return `<div class="b-scr"><div class="b-body">
<div class="b-head"><h1 class="b-h1" style="font-size:26px">${t(k.title, lang)}</h1><span class="b-row" style="gap:8px"><span class="b-ico">${icons.back}</span><span class="b-ico" style="transform:scaleX(-1)">${icons.back}</span></span></div>
<div class="b-pad b-muted" style="margin-top:4px">${t(k.summary, lang)}</div>
<div class="b-pad" style="margin-top:14px"><div class="b-card" style="padding:14px 10px 12px" data-mark="grid"><div class="b-cal">${k.weekdays.map(w => `<span class="b-cal__wd">${esc(w)}</span>`).join('')}${cells.join('')}</div>
<div class="b-row" style="justify-content:center;gap:16px;margin-top:10px"><span class="b-row" style="gap:6px"><i style="display:block;width:14px;height:14px;border-radius:50%;background:var(--limonka);box-shadow:inset 0 0 0 2px var(--atrament)"></i><span class="b-muted">${t(k.legend.going, lang)}</span></span><span class="b-row" style="gap:6px"><i style="display:block;width:14px;height:14px;border-radius:50%;background:var(--holo)"></i><span class="b-muted">${t(k.legend.watch, lang)}</span></span></div></div></div>
<div class="b-pad" style="margin-top:12px"><div class="b-card" style="padding:2px 0">${upcoming
    .map(m => {
      const a = artist(ui, m.artist);
      const v = venue(ui, m.venue);
      return `<div class="b-li" style="min-height:62px"><span class="b-date"><b style="margin:0">${m.day}</b></span>${coverBox(m.artist, 44, 10)}<div class="b-li__main"><div class="b-li__name" style="font-size:15px">${esc(a.name)}</div><div class="b-li__sub">${esc(v.name)} · ${t(m.time, lang)}</div></div>${m.going ? `<span class="b-tag b-tag--lime">${t(k.legend.going, lang)}</span>` : ''}</div>`;
    })
    .join('')}</div></div>
${tabs(ui, 2, lang)}</div></div>`;
};

export const stubFoils = [
  'linear-gradient(135deg,#FF8AD0,#FFC7A0 55%,#D7FF63)',
  'linear-gradient(135deg,#72EFFF,#D7FF63 60%,#FFC7A0)',
  'linear-gradient(135deg,#FFC7A0,#FF8AD0 50%,#72EFFF)',
  'linear-gradient(135deg,#D7FF63,#72EFFF 55%,#FF8AD0)',
  'linear-gradient(135deg,#DDE2EA,#FFFFFF 40%,#AAB2C0)',
  'linear-gradient(135deg,#72EFFF,#FF8AD0)',
];

export const stub = (ui, item, i, lang, { width = 160, size = 52 } = {}) => {
  const a = artist(ui, item.artist);
  const v = venue(ui, item.venue);
  return `<div class="b-stub" style="width:${width}px;background:${stubFoils[i % stubFoils.length]}">${coverBox(item.artist, size, 10)}<div class="b-stub__name">${esc(a.name)}</div><div class="b-stub__meta">${t(item.date, lang)} · ${esc(v.name)}</div></div>`;
};

const kolekcja = (ui, { lang }) => {
  const k = ui.kolekcja;
  const tilts = [-3, 2.5, 2, -2.5, -2, 3];
  return `<div class="b-scr"><div class="b-body">
<div class="b-head"><h1 class="b-h1">${t(k.title, lang)}</h1>${logo()}</div>
<div class="b-pad b-muted" style="margin-top:4px">${t(k.sub, lang)}</div>
<div class="b-pad b-chips" style="margin-top:14px">${k.chips.map((chip, i) => `<span class="b-chip${i === 0 ? ' b-chip--on' : ''}">${esc(chip)}</span>`).join('')}</div>
<div class="b-pad" style="margin-top:14px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px">${k.stats.map(s => `<div class="b-card" style="padding:10px 12px;border-radius:18px"><div style="font-weight:700;font-size:26px;line-height:1.05">${esc(s.value)}</div><div class="b-li__sub">${t(s.label, lang)}</div></div>`).join('')}</div>
<div style="position:absolute;left:24px;right:24px;top:236px;display:grid;grid-template-columns:1fr 1fr;gap:16px 22px" data-mark="stickers">${k.tickets.map((item, i) => `<div style="transform:rotate(${tilts[i]}deg)">${stub(ui, item, i, lang, { width: 160, size: 48 })}</div>`).join('')}</div>
${tabs(ui, 3, lang)}</div></div>`;
};

const podglad = (ui, { lang }) => {
  const p = ui.podglad;
  const a = artist(ui, p.artist);
  const v = venue(ui, p.venue);
  const bars = waveBars(38, 5);
  const on = Math.round(bars.length * p.progress);
  return `<div class="b-scr"><div class="b-body">
<div class="b-between" style="padding:6px 20px 0"><span class="b-ico">${icons.down}</span><span class="b-kicker">${t(p.label, lang)}</span><span class="b-ico">${icons.share}</span></div>
<div style="display:flex;justify-content:center;margin-top:18px"><span style="display:block;border-radius:28px;box-shadow:0 22px 40px -22px rgba(17,18,23,.6)" data-mark="cover">${coverBox(p.artist, 300, 28)}</span></div>
<div class="b-pad" style="margin-top:18px"><div class="b-h1" style="font-size:26px">${esc(a.track)}</div><div class="b-muted" style="margin-top:2px;font-size:15px">${esc(a.name)} · ${esc(a.genre)}</div></div>
<div class="b-pad" style="margin-top:12px"><div class="b-wave" data-mark="wave">${bars.map((h, i) => `<i class="${i < on ? 'on' : ''}" style="height:${Math.round(h * 40)}px"></i>`).join('')}</div><div class="b-between b-muted" style="margin-top:4px;font-size:12.5px"><span>${esc(p.elapsed)}</span><span>${esc(p.total)}</span></div></div>
<div class="b-row" style="justify-content:center;gap:34px;margin-top:6px"><span style="display:flex;color:${c.grafit}">${sized(icons.prev, 28)}</span><span style="display:flex;align-items:center;justify-content:center;width:66px;height:66px;border-radius:50%;background:${c.atrament};color:${c.biel}">${sized(icons.pause, 28)}</span><span style="display:flex;color:${c.grafit}">${sized(icons.next, 28)}</span></div>
<div class="b-pad" style="margin-top:14px"><div class="b-holoedge" data-mark="gig"><div class="b-card" style="padding:12px 14px;border-radius:22px"><div class="b-kicker">${t(p.gigLabel, lang)}</div><div class="b-between" style="margin-top:4px"><div style="min-width:0"><div class="b-h2">${t(p.gigWhen, lang)}</div><div class="b-li__sub">${esc(v.name)} · ${t(v.dist, lang)}</div></div><span class="b-ico" style="background:var(--limonka);border-color:transparent">${icons.bell}</span></div></div></div></div>
<div class="b-pad b-muted" style="margin-top:10px">${t(p.similar, lang)}</div>
</div></div>`;
};

const screens = { odkrywaj, wokolicy, koncert, znajomi, kalendarz, kolekcja, podglad };

export const screenOrder = ['wokolicy', 'odkrywaj', 'koncert', 'znajomi', 'kalendarz', 'kolekcja', 'podglad'];

export const renderScreen = (id, ui, ctx) => {
  const fn = screens[id];
  if (!fn) throw new Error(`bis: unknown screen ${id}`);
  return fn(ui, ctx);
};
