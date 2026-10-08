import { esc, text } from '../../kit/kit.mjs';

export const colors = {
  butelka: '#0B4A3D',
  limonka: '#D5F25C',
  grejpfrut: '#FF5A36',
  mleko: '#F7F4EA',
  smola: '#0E1E1A',
  szron: '#DCE3DF',
  lupek: '#5E6B66',
  karta: '#FFFFFF',
};

const c = colors;

export const glyph = {
  piekarnia:
    '<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15c0-5 4-8 9-8s9 3 9 8v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><path d="M9 11.5l1.5 3M13 10.5v3.5M17 11.5l-1.5 3"/></svg>',
  warzywniak:
    '<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13" cy="15" r="7.5"/><path d="M13 7.5c0-2.5 1.5-4 4-4.5M13 7.5c-2-1.8-4.5-1.8-6-.5 1.5 1.6 4 2 6 .5Z"/></svg>',
  kwiaciarnia:
    '<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 23V13"/><path d="M8 5l2.5 2.5L13 4l2.5 3.5L18 5v4.5a5 5 0 0 1-10 0Z"/><path d="M13 19c-1.5-2.5-4-3.5-6.5-3.5.5 2.8 3 4.5 6.5 3.5Z"/></svg>',
  srubka:
    '<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h10l2.5 4.5L18 12H8L5.5 7.5Z"/><path d="M10 12v11M16 12v9l-3 2-3-2M10 15.5l6-1.5M10 19l6-1.5"/></svg>',
  ksiegarnia:
    '<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M4 5.5c3-1.3 6-1.3 9 .8 3-2.1 6-2.1 9-.8V21c-3-1.3-6-1.3-9 .8-3-2.1-6-2.1-9-.8Z"/><path d="M13 6.3v15.5"/></svg>',
};

const ui = {
  pin: '<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 23s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z"/><circle cx="13" cy="11" r="2.6"/></svg>',
  bag: '<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M5 9h16l-1.2 13H6.2Z"/><path d="M9.5 11V7.5a3.5 3.5 0 0 1 7 0V11" stroke-linecap="round"/></svg>',
  clock: '<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="13" cy="13" r="9"/><path d="M13 8v5.5l3.5 2"/></svg>',
  repeat: '<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12V10a4 4 0 0 1 4-4h12M17.5 2.5 21 6l-3.5 3.5M21 14v2a4 4 0 0 1-4 4H5M8.5 23.5 5 20l3.5-3.5"/></svg>',
  search: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="8.5" cy="8.5" r="6"/><path d="m13 13 5 5"/></svg>',
  back: '<svg width="12" height="20" viewBox="0 0 12 20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2 2 10l8 8"/></svg>',
  check: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m3 8.5 3.2 3L13 4.5"/></svg>',
  walk: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="2.6" r="1.6"/><path d="M5 15l2-5 2.5 2V15M7 10l1-4 3 2.5 2 .5M8 6 5.5 7 4.5 9.5"/></svg>',
  bell: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M5 16V10a6 6 0 0 1 12 0v6l1.5 2h-15Z"/><path d="M9 20.5h4" stroke-linecap="round"/></svg>',
  hold: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10h14v9H4Z"/><path d="M7 10V7a4 4 0 0 1 8 0v3"/><circle cx="11" cy="14.5" r="1.3" fill="currentColor"/></svg>',
};

const tabIcons = [ui.pin, ui.bag, ui.clock, ui.repeat];

const tabs = (data, active, lang) =>
  `<nav class="s-tabs">${data.tabs.map((label, i) => `<span class="s-tab${i === active ? ' s-tab--on' : ''}"><i>${tabIcons[i]}</i>${text(label, lang)}</span>`).join('')}</nav>`;

export const shopIcon = (kind, small = false) => `<span class="s-ico${small ? ' s-ico--sm' : ''}">${glyph[kind]}</span>`;

const shop = (data, id) => data.shops[id];

export const mapPins = {
  you: [196, 520],
  piekarnia: [128, 372],
  warzywniak: [246, 300],
  kwiaciarnia: [300, 444],
  srubka: [72, 250],
  ksiegarnia: [326, 214],
};

const mapSvg = (data, lang, { lift = false } = {}) => {
  const o = data.okolica;
  const streets = [
    { d: 'M-20 470 L420 330', w: 26, label: o.streets[0], at: [44, 444], rot: -17.6 },
    { d: 'M-20 300 L420 170', w: 18, label: o.streets[1], at: [250, 222], rot: -16.5 },
    { d: 'M60 -20 L210 900', w: 18, label: o.streets[2], at: [154, 572], rot: 80.7 },
    { d: 'M250 -20 L380 900', w: 16, label: o.streets[3], at: [341, 640], rot: 81.9 },
    { d: 'M-20 640 L420 520', w: 14, label: '', at: [0, 0], rot: 0 },
  ];
  const blocks = [
    'M18 330 L120 300 L140 410 L34 440Z',
    'M150 292 L236 266 L258 380 L168 404Z',
    'M262 258 L360 228 L380 340 L284 370Z',
    'M30 110 L100 90 L118 228 L44 250Z',
    'M118 84 L230 52 L250 196 L136 222Z',
    'M30 520 L150 486 L170 600 L44 640Z',
    'M180 478 L300 446 L318 560 L198 590Z',
    'M300 640 L380 616 L400 760 L316 790Z',
    'M40 690 L160 656 L176 790 L58 820Z',
  ];
  const pin = id => {
    const [x, y] = mapPins[id];
    if (lift) return `<rect data-pin="${id}" x="${x - 1}" y="${y - 1}" width="2" height="2" fill="none"/><ellipse cx="${x}" cy="${y + 2}" rx="13" ry="5" fill="${c.smola}" opacity=".22"/><circle cx="${x}" cy="${y}" r="6" fill="${c.butelka}" stroke="${c.karta}" stroke-width="2.5"/>`;
    return `<g transform="translate(${x} ${y})"><path d="M0 0 C-4 -6 -17 -13 -17 -27 A17 17 0 0 1 17 -27 C17 -13 4 -6 0 0Z" fill="${c.butelka}"/><g transform="translate(-11 -38) scale(.85)" color="${c.limonka}">${glyph[id].replace('<svg ', '<svg width="26" height="26" ')}</g></g>`;
  };
  return `<svg width="390" height="844" viewBox="0 0 390 844" aria-hidden="true" style="position:absolute;left:0;top:0">
<rect width="390" height="844" fill="#ECE9DF"/>
${blocks.map(d => `<path d="${d}" fill="#E1DDD0"/>`).join('')}
<path d="M196 600 L300 572 L318 690 L214 716Z" fill="#CFE1B5"/>
<path d="M210 610 C240 640 260 650 300 640" stroke="#B9D29A" stroke-width="5" fill="none" stroke-linecap="round"/>
${streets.map(s => `<path d="${s.d}" stroke="${c.karta}" stroke-width="${s.w}" stroke-linecap="square"/>`).join('')}
${streets.filter(s => s.label).map(s => `<text x="${s.at[0]}" y="${s.at[1]}" transform="rotate(${s.rot} ${s.at[0]} ${s.at[1]})" font-size="11" font-weight="600" fill="${c.lupek}" letter-spacing=".02em">${esc(s.label)}</text>`).join('')}
<path d="M196 520 L176 470 L140 410 L128 372 L230 340 L246 300 M246 300 L262 352 L300 444" fill="none" stroke="${c.butelka}" stroke-width="4" stroke-dasharray="2 7" stroke-linecap="round"/>
<circle cx="${mapPins.you[0]}" cy="${mapPins.you[1]}" r="22" fill="${c.grejpfrut}" opacity=".2"/><circle cx="${mapPins.you[0]}" cy="${mapPins.you[1]}" r="8" fill="${c.grejpfrut}" stroke="${c.karta}" stroke-width="3"/>
${['srubka', 'ksiegarnia', 'piekarnia', 'warzywniak', 'kwiaciarnia'].map(pin).join('')}
</svg>`;
};

const okolica = (data, ctx) => {
  const o = data.okolica;
  const lang = ctx.lang;
  return `<div class="s-scr">${mapSvg(data, lang, { lift: ctx.lift })}
<div style="position:absolute;left:14px;right:14px;top:${ctx.top + 8}px;display:flex;gap:8px">
<div class="s-card" style="flex:1;display:flex;align-items:center;gap:8px;height:48px;padding:0 14px;color:${c.lupek};font-weight:400;border-radius:16px">${ui.search}<span>${text(o.search, lang)}</span></div></div>
<div style="position:absolute;left:14px;top:${ctx.top + 66}px;display:flex;gap:6px">${o.filters.slice(0, 3).map((f, i) => `<span class="s-chip${i === 0 ? ' s-chip--dark' : ''}" style="${i ? 'background:#fff;box-shadow:0 0 0 1px #DCE3DF' : ''}">${text(f, lang)}</span>`).join('')}</div>
<div class="s-card" style="position:absolute;left:8px;right:8px;bottom:92px;padding:0 16px 10px;border-radius:26px">
<div class="s-handle"></div>
<div class="s-x" style="font-size:17px;margin-bottom:6px">${text(o.sheetTitle, lang)}</div>
${o.list
  .map((item, i) => {
    const s = shop(data, item.shop);
    return `<div class="s-row" style="padding:9px 0;${i ? 'border-top:1px solid #DCE3DF' : ''}">${shopIcon(item.shop, true)}<div style="flex:1;min-width:0"><b style="display:block;font-weight:700;font-size:15px">${text(s.name, lang)}</b><span class="s-muted" style="font-size:13px">${text(item.note, lang)}</span></div><div style="text-align:right"><b style="display:block;font-weight:700">${esc(item.distance)}</b><span style="font-size:12px;font-weight:600;color:${c.butelka}">${text(o.open, lang)}</span></div></div>`;
  })
  .join('')}
</div>${tabs(data, 0, lang)}</div>`;
};

const sklep = (data, ctx) => {
  const k = data.sklep;
  const lang = ctx.lang;
  const s = shop(data, 'piekarnia');
  return `<div class="s-scr"><div style="position:absolute;left:0;right:0;top:0;height:${ctx.top + 176}px;background:${c.butelka};color:${c.mleko}"></div><div class="s-body" style="top:${ctx.top}px">
<div class="s-back" style="color:${c.limonka}">${ui.back}${text(k.back, lang)}</div>
<div class="s-pad" style="color:${c.mleko}"><div class="s-row" style="align-items:flex-start"><span class="s-ico" style="background:${c.limonka};color:${c.butelka};width:52px;height:52px">${glyph.piekarnia}</span><div><h1 class="s-title" style="font-size:24px">${text(s.name, lang)}</h1><div style="margin-top:6px;font-size:14px;opacity:.86">${text(s.street, lang)} · ${text(s.kind, lang)}</div></div></div>
<div style="margin-top:14px"><span class="s-chip s-chip--lime">${text(s.hours, lang)}</span></div></div>
${ctx.hideHold ? `<div style="margin:22px 14px 0;height:84px;border-radius:20px;background:rgba(213,242,92,.18);box-shadow:inset 0 0 0 2px rgba(213,242,92,.7)"></div>` : `<div class="s-card" style="margin:22px 14px 0;padding:14px 16px;background:${c.limonka};box-shadow:none;display:flex;gap:12px;align-items:flex-start">${ui.hold}<div><b style="display:block;font-weight:700;font-size:17px">${text(k.hold, lang)}</b><span style="font-size:14px">${text(k.holdNote, lang)}</span></div></div>`}
<div class="s-pad" style="display:flex;justify-content:space-between;align-items:baseline;margin:20px 0 8px"><span class="s-x" style="font-size:18px">${text(k.today, lang)}</span><span class="s-muted" style="font-size:13px">${text(k.updated, lang)}</span></div>
<div class="s-card" style="margin:0 14px">${k.items
    .map(
      (item, i) => `<div class="s-row" style="padding:12px 14px;${i ? 'border-top:1px solid #DCE3DF' : ''}"><div style="flex:1;min-width:0"><b style="display:block;font-weight:600;font-size:15px">${text(item.name, lang)}</b><span class="s-muted" style="font-size:13px">${text(item.unit, lang)} · <span class="s-price" style="color:${c.smola}">${text(item.price, lang)}</span></span></div><span class="s-chip${item.low ? ' s-chip--hot' : ''}" style="height:28px;font-size:12.5px">${lang === 'pl' ? `${text(k.left, lang)} ${text(item.left, lang)}` : `${text(item.left, lang)} ${text(k.left, lang)}`}</span><span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:12px;background:${c.limonka};font-weight:700;font-size:20px">+</span></div>`,
    )
    .join('')}</div>
<div style="position:absolute;left:14px;right:14px;bottom:30px"><div class="s-btn">${text(k.button, lang)}</div></div></div></div>`;
};

const routeMini = (w, h) => {
  const pts = [
    [24, h - 26],
    [w * 0.36, h * 0.42],
    [w * 0.62, h * 0.66],
    [w - 30, h * 0.3],
  ];
  const d = `M${pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' L')}`;
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true" style="display:block">
<rect width="${w}" height="${h}" rx="14" fill="#ECE9DF"/>
<path d="M-10 ${h * 0.78} L${w + 10} ${h * 0.18}" stroke="#fff" stroke-width="14"/><path d="M${w * 0.2} -10 L${w * 0.5} ${h + 10}" stroke="#fff" stroke-width="12"/><path d="M${w * 0.7} -10 L${w * 0.82} ${h + 10}" stroke="#fff" stroke-width="10"/>
<path d="${d}" fill="none" stroke="${c.butelka}" stroke-width="4" stroke-dasharray="2 7" stroke-linecap="round"/>
<circle cx="${pts[0][0]}" cy="${pts[0][1]}" r="7" fill="${c.grejpfrut}" stroke="#fff" stroke-width="2.5"/>
${pts
  .slice(1)
  .map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="12" fill="${c.smola}"/><text x="${x}" y="${y + 4.5}" text-anchor="middle" font-size="13" font-weight="700" fill="${c.limonka}">${i + 1}</text>`)
  .join('')}
</svg>`;
};

const koszyk = (data, ctx) => {
  const k = data.koszyk;
  const lang = ctx.lang;
  return `<div class="s-scr"><div class="s-body" style="top:${ctx.top}px">
<div class="s-pad" style="display:flex;justify-content:space-between;align-items:flex-end;padding-top:6px"><h1 class="s-title">${text(k.title, lang)}</h1><span class="s-muted" style="font-size:14px;font-weight:600">${text(k.summary, lang)}</span></div>
<div class="s-card" style="margin:12px 14px 0;padding:10px">${routeMini(342, 96)}<div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin:10px 4px 2px"><b style="font-weight:700;font-size:15px">${text(k.route, lang)}</b><span class="s-muted" style="font-size:13px">${text(k.routeMeta, lang)}</span></div></div>
${k.groups
  .map((g, i) => {
    const s = shop(data, g.shop);
    return `<div class="s-card" style="margin:10px 14px 0;padding:10px 14px 8px"><div class="s-row" style="gap:10px"><span class="s-num">${i + 1}</span><b style="flex:1;min-width:0;font-weight:700;font-size:15px">${text(s.name, lang)}</b><span class="s-chip s-chip--lime" style="height:26px;padding:0 10px">${esc(g.time)}</span></div>${g.items
      .map(([name, qty, price]) => `<div style="display:flex;gap:8px;padding:5px 0 0 38px;font-size:14px"><span style="flex:1;min-width:0">${text(name, lang)}</span><span class="s-muted">${text(qty, lang)}</span><span class="s-price" style="width:74px;text-align:right">${text(price, lang)}</span></div>`)
      .join('')}</div>`;
  })
  .join('')}
<div style="position:absolute;left:14px;right:14px;bottom:28px"><div style="display:flex;justify-content:space-between;align-items:baseline;margin:0 4px 12px"><span class="s-muted" style="font-size:14px">${text(k.totalLabel, lang)}</span><b class="s-x" style="font-size:22px">${text(k.total, lang)}</b></div><div class="s-btn">${text(k.button, lang)}</div></div></div></div>`;
};

const godzina = (data, ctx) => {
  const g = data.godzina;
  const lang = ctx.lang;
  return `<div class="s-scr"><div class="s-body" style="top:${ctx.top}px">
<div class="s-back">${ui.back}${text(data.koszyk.title, lang)}</div>
<div class="s-pad"><h1 class="s-title">${text(g.title, lang)}</h1><p class="s-lead">${text(g.lead, lang)}</p><div style="margin-top:14px"><span class="s-chip s-chip--dark">${text(g.day, lang)}</span></div></div>
${g.rows
  .map((row, i) => {
    const s = shop(data, row.shop);
    return `<div class="s-card" style="margin:${i ? 10 : 18}px 14px 0;padding:14px"><div class="s-row" style="gap:10px">${shopIcon(row.shop, true)}<div style="flex:1;min-width:0"><b style="display:block;font-weight:700;font-size:15px">${text(s.name, lang)}</b><span class="s-muted" style="font-size:13px">${text(s.hours, lang)}</span></div></div><div style="display:flex;gap:6px;margin-top:12px">${row.slots
      .map((slot, j) => `<span style="flex:1;display:flex;align-items:center;justify-content:center;height:42px;border-radius:13px;font-weight:700;font-size:15px;${j === row.active ? `background:${c.butelka};color:${c.limonka}` : `background:${c.mleko};box-shadow:inset 0 0 0 1.5px ${c.szron}`}">${esc(slot)}</span>`)
      .join('')}</div></div>`;
  })
  .join('')}
<p class="s-pad s-muted" style="margin:14px 0 0;font-size:14px">${text(g.note, lang)}</p>
<div style="position:absolute;left:14px;right:14px;bottom:30px"><div class="s-btn">${text(g.button, lang)}</div></div></div></div>`;
};

const rand = seed => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

export const codePattern = (size, { fg = c.smola, bg = c.karta } = {}) => {
  const n = 15;
  const cell = size / n;
  const r = rand(4827);
  const dots = [];
  const cx = (n - 1) / 2;
  for (let y = 0; y < n; y += 1) {
    for (let x = 0; x < n; x += 1) {
      const d = Math.hypot(x - cx, y - cx);
      if (d > cx + 0.4) continue;
      if (Math.abs(x - cx) <= 2 && Math.abs(y - cx) <= 2) continue;
      const v = r();
      if (v < 0.42) continue;
      const rad = cell * (v > 0.82 ? 0.46 : 0.32);
      dots.push(`<circle cx="${((x + 0.5) * cell).toFixed(2)}" cy="${((y + 0.5) * cell).toFixed(2)}" r="${rad.toFixed(2)}" fill="${fg}"/>`);
    }
  }
  const m = (cx - 1.9) * cell;
  const w = 4.8 * cell;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true" style="display:block"><rect width="${size}" height="${size}" fill="${bg}"/>${dots.join('')}<rect x="${m}" y="${m}" width="${w}" height="${w}" rx="${cell * 1.2}" fill="${c.limonka}"/><g transform="translate(${m + w * 0.17} ${m + w * 0.17}) scale(${(w * 0.66) / 26})" fill="none" stroke="${c.butelka}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"><path d="M5 9h16l-1.2 13H6.2Z"/><path d="M9.5 11V7.5a3.5 3.5 0 0 1 7 0V11"/></g></svg>`;
};

export const codeCard = (data, lang, { width = 330 } = {}) => {
  const k = data.kod;
  const s = shop(data, k.shop);
  const pattern = Math.round(width * 0.56);
  return `<div class="s-codecard" style="width:${width}px;padding:${width * 0.06}px;border-radius:${width * 0.085}px;background:${c.karta};color:${c.smola};text-align:center">
<div class="s-row" style="justify-content:center;gap:8px;font-weight:700;font-size:${width * 0.045}px">${shopIcon('piekarnia', true)}<span>${text(s.name, lang)}</span></div>
<div style="display:flex;justify-content:center;margin:${width * 0.05}px 0">${codePattern(pattern)}</div>
<div class="s-x" style="font-weight:900;font-size:${width * 0.13}px;line-height:1;letter-spacing:.02em">${esc(k.code)}</div>
<div class="s-muted" style="margin-top:${width * 0.025}px;font-size:${width * 0.042}px;font-weight:600">${text(k.label, lang)}</div>
</div>`;
};

const kod = (data, ctx) => {
  const k = data.kod;
  const lang = ctx.lang;
  return `<div class="s-scr s-scr--dark"><div class="s-body" style="top:${ctx.top}px">
<div class="s-back" style="color:${c.limonka}">${ui.back}${text(data.tabs[2], lang)}</div>
<div class="s-pad" style="display:flex;justify-content:space-between;align-items:center"><h1 class="s-title" style="color:${c.mleko}">${text(k.title, lang)}</h1><span class="s-chip s-chip--lime">${ui.check}${text(data.gotowe.readyLabel, lang)}</span></div>
<div style="display:flex;justify-content:center;margin-top:16px">${ctx.hideCode ? `<div style="width:330px;height:${Math.round(330 * 1.03)}px;border-radius:28px;background:rgba(247,244,234,.1);box-shadow:inset 0 0 0 2px rgba(213,242,92,.5)"></div>` : codeCard(data, lang)}</div>
<div class="s-pad" style="margin-top:14px;display:flex;justify-content:space-between;font-size:14px;color:${c.mleko}"><span>${text(k.name, lang)}</span><b style="font-weight:700">${text(k.items, lang)}</b></div>
<div style="margin:12px 14px 0;padding:12px 14px;border-radius:18px;background:rgba(247,244,234,.1);color:${c.mleko}"><div class="s-kicker" style="color:${c.limonka}">${text(k.counterTitle, lang)}</div><div style="margin-top:4px;font-size:15px">${text(k.counter, lang)}</div></div>
<div style="position:absolute;left:14px;right:14px;bottom:30px;display:flex;gap:10px;align-items:center;padding:12px 14px;border-radius:18px;background:${c.limonka};color:${c.smola};font-weight:600;font-size:14px">${ui.walk}<span>${text(k.next, lang)}</span></div></div></div>`;
};

const stale = (data, ctx) => {
  const s = data.stale;
  const lang = ctx.lang;
  const p = shop(data, 'piekarnia');
  return `<div class="s-scr"><div class="s-body" style="top:${ctx.top}px">
<div class="s-pad" style="padding-top:6px"><h1 class="s-title">${text(s.title, lang)}</h1></div>
<div style="margin:14px 14px 0;padding:16px;border-radius:24px;background:${c.butelka};color:${c.mleko}">
<div class="s-row" style="align-items:flex-start;gap:12px"><span class="s-ico" style="background:${c.limonka};color:${c.butelka}">${glyph.piekarnia}</span><div style="flex:1;min-width:0"><div class="s-x" style="font-size:22px;line-height:1.1">${text(s.name, lang)}</div><div style="margin-top:4px;font-size:14px;opacity:.88">${text(p.name, lang)}</div></div></div>
<div style="display:inline-flex;margin-top:14px;gap:8px;align-items:center;height:32px;padding:0 12px;border-radius:999px;background:${c.limonka};color:${c.smola};font-weight:700;font-size:14px">${ui.repeat.replace('<svg ', '<svg width="18" height="18" ')}${text(s.every, lang)}</div>
<div style="margin-top:12px;border-top:1px solid rgba(247,244,234,.22)">${s.items.map(([name, qty, price]) => `<div style="display:flex;gap:8px;padding:9px 0 0;font-size:15px"><span style="flex:1">${text(name, lang)}</span><span style="opacity:.75">${text(qty, lang)}</span><b style="font-weight:700;width:76px;text-align:right">${text(price, lang)}</b></div>`).join('')}</div>
<div style="display:flex;justify-content:flex-end;margin-top:8px"><b class="s-x" style="font-size:20px;color:${c.limonka}">${text(s.total, lang)}</b></div></div>
<div class="s-pad s-x" style="font-size:17px;margin:20px 0 10px">${text(s.upcomingTitle, lang)}</div>
<div style="display:flex;gap:8px;margin:0 14px">${s.upcoming
  .map((u, i) => {
    const off = i === s.skipped;
    return `<div style="flex:1;padding:12px 6px;border-radius:18px;text-align:center;${off ? `background:transparent;box-shadow:inset 0 0 0 2px ${c.szron};color:${c.lupek}` : i === 0 ? `background:${c.limonka}` : `background:${c.karta};box-shadow:0 0 0 1px ${c.szron}`}"><div class="s-x" style="font-size:20px;line-height:1.05;${off ? 'text-decoration:line-through' : ''}">${esc(u.date.split(' ')[0])}</div><div style="font-size:13px;font-weight:600">${esc(u.date.split(' ')[1])}</div><div style="margin-top:6px;font-size:11.5px;font-weight:600">${text(u.state, lang)}</div></div>`;
  })
  .join('')}</div>
<div class="s-card s-row" style="margin:14px 14px 0;padding:12px 14px">${ui.bell}<span style="flex:1;font-weight:600;font-size:14px">${text(s.remind, lang)}</span><span class="s-toggle"></span></div>
<div style="display:flex;gap:10px;margin:14px 14px 0"><div class="s-btn s-btn--ghost" style="flex:1">${text(s.pause, lang)}</div><div class="s-btn s-btn--dark" style="flex:1.3">${text(s.skip, lang)}</div></div>
</div>${tabs(data, 3, lang)}</div>`;
};

const gotowe = (data, ctx) => {
  const g = data.gotowe;
  const lang = ctx.lang;
  return `<div class="s-scr"><div class="s-body" style="top:${ctx.top}px">
<div class="s-pad" style="padding-top:6px"><h1 class="s-title">${text(g.title, lang)}</h1><p class="s-lead">${text(g.lead, lang)}</p></div>
<div style="position:relative;margin:16px 14px 0">
<div style="position:absolute;left:27px;top:40px;bottom:40px;border-left:3px dashed ${c.butelka};opacity:.5"></div>
${g.stops
  .map((stop, i) => {
    const s = shop(data, stop.shop);
    return `<div class="s-card" style="position:relative;display:flex;gap:12px;align-items:center;margin-top:${i ? 12 : 0}px;padding:14px;${stop.ready ? `background:${c.butelka};color:${c.mleko};box-shadow:none` : ''}">${stop.ready ? `<span class="s-ico" style="background:${c.limonka};color:${c.butelka}">${glyph[stop.shop]}</span>` : shopIcon(stop.shop)}<div style="flex:1;min-width:0"><b style="display:block;font-weight:700;font-size:15.5px;line-height:1.25">${text(s.name, lang)}</b><span style="display:inline-flex;align-items:center;gap:5px;margin-top:6px;font-size:13px;font-weight:600;${stop.ready ? `color:${c.limonka}` : `color:${c.lupek}`}">${stop.ready ? ui.check : ''}${text(stop.state, lang)}</span></div><b class="s-x" style="font-size:19px">${esc(stop.time)}</b></div>`;
  })
  .join('')}
</div>
<div class="s-card" style="margin:14px 14px 0;padding:10px">${routeMini(342, 118)}</div>
<div style="margin:12px 14px 0;display:flex;justify-content:space-between;align-items:center"><span class="s-chip s-chip--line" style="font-weight:700">${text(g.codeHint, lang)}</span><span class="s-muted" style="display:inline-flex;gap:4px;align-items:center;font-size:13px;font-weight:600">${ui.walk}15 min</span></div>
<div style="position:absolute;left:14px;right:14px;bottom:100px"><div class="s-btn">${text(g.button, lang)}</div></div></div>${tabs(data, 2, lang)}</div>`;
};

export const screens = { okolica, sklep, koszyk, godzina, kod, stale, gotowe };

export const screenOrder = ['gotowe', 'okolica', 'koszyk', 'godzina', 'kod', 'stale', 'sklep'];

export const renderScreen = (id, data, ctx) => {
  const fn = screens[id];
  if (!fn) throw new Error(`szyld: unknown screen ${id}`);
  return fn(data, { top: ctx.store === 'play' ? 36 : 50, ...ctx });
};
