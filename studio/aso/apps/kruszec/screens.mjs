import { esc, text } from '../../kit/kit.mjs';
import { seriesFor, shownFrom } from './series.mjs';

export const colors = {
  glebia: '#0A1020',
  granat: '#131D33',
  szklo: '#1F283C',
  tekst: '#EDF1F7',
  tekst2: '#9AA7BB',
  szalwia: '#8FD4B6',
  lod: '#B8CBE6',
  platyna: '#DCE1E8',
  koral: '#E8998B',
};

const c = colors;
const nb = ' ';

export const grouped = (n, sep) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, sep);

export const money = (n, lang) => (lang === 'pl' ? `${grouped(n, nb)}${nb}zł` : `£${grouped(n, ',')}`);

export const decimal = (n, lang) => (lang === 'pl' ? String(n).replace('.', ',') : String(n));

export const t = (value, lang) =>
  text(value, lang)
    .replace(/(\d) (?=\d{3}(?!\d))/g, `$1${nb}`)
    .replace(/(\d) (zł|mies\.|pkt|tys\.)/g, `$1${nb}$2`)
    .replace(/(\d) (months?|mo)\b/g, `$1${nb}$2`);

const rich = (value, lang) => t(value, lang).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

const line = (d, w = 1.7) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

export const icons = {
  worth: line('<path d="M3.5 17.5c3-1.2 4.4-5.4 7.3-5.4 2.6 0 3.2 2.6 5.6 2.6 2 0 3.2-3.4 4.1-6.2"/><path d="M3.5 20.5h17"/>'),
  budget: line('<rect x="3.5" y="6" width="17" height="13" rx="3"/><path d="M3.5 10h17M15.5 14.5h2"/>'),
  goals: line('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".6" fill="currentColor"/>'),
  report: line('<path d="M6.5 3.5h8l3.5 3.5v13.5h-11.5Z"/><path d="M9.5 11h5M9.5 14.5h5M9.5 18h3"/>'),
  wallet: line('<path d="M4 7.5h14.5a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5.5a1.5 1.5 0 0 1-1.5-1.5Z"/><path d="M4 7.5 15 4.5v3"/><circle cx="16.5" cy="13.5" r="1" fill="currentColor"/>'),
  safe: line('<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><circle cx="12" cy="12" r="3.4"/><path d="M12 8.6v1.2M12 14.2v1.2"/>'),
  chart: line('<path d="M4 19.5h16"/><path d="M5.5 15.5 10 11l3 3 5.5-6"/>'),
  bond: line('<path d="M5 5.5h14v13H5Z"/><path d="M8.5 9.5h7M8.5 12.5h7M8.5 15.5h4"/>'),
  upload: line('<path d="M12 15.5V4.5M7.5 9 12 4.5 16.5 9"/><path d="M4.5 15v4.5h15V15"/>'),
  plus: line('<path d="M12 5v14M5 12h14"/>'),
  calendar: line('<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/>'),
  bell: line('<path d="M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14Z"/><path d="M10 20.5h4"/>'),
  chevron: line('<path d="m9.5 6 6 6-6 6"/>'),
  sliders: line('<path d="M5 7h9M18 7h1M5 17h3M12 17h7"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>'),
};

const sized = (icon, size) => icon.replace('<svg ', `<svg width="${size}" height="${size}" `);

const tone = name => ({ szalwia: c.szalwia, lod: c.lod, platyna: c.platyna, koral: c.koral })[name] ?? c.lod;

export const sample = (ui, lang) => `<span class="k-sample"><i></i>${t(ui.sample, lang)}</span>`;

const tabIcons = [icons.worth, icons.budget, icons.goals, icons.report];

const tabs = (ui, active, lang) =>
  `<nav class="k-tabs">${ui.tabs.map((label, i) => `<span class="k-tab${i === active ? ' k-tab--on' : ''}">${tabIcons[i]}<span>${t(label, lang)}</span></span>`).join('')}</nav>`;

const niceStep = span => {
  const raw = span / 3;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const n = raw / pow;
  const m = n < 1.5 ? 1 : n < 2.25 ? 2 : n < 3.5 ? 2.5 : n < 7.5 ? 5 : 10;
  return m * pow;
};

export const tickLabel = (v, lang) => (lang === 'pl' ? `${grouped(v / 1000, nb)}${nb}tys.` : `£${grouped(v / 1000, ',')}k`);

export const chartSvg = ({ total, lang, w, h, padL = 0, padR = 52, padT = 14, padB = 26, axis, from = shownFrom, id = 'nw', marks = true, fill = true, labels = true }) => {
  const all = seriesFor(total);
  const values = all.slice(from);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const lo = min - (max - min) * 0.06;
  const hi = max + (max - min) * 0.1;
  const x0 = padL;
  const x1 = w - padR;
  const y0 = padT;
  const y1 = h - padB;
  const X = i => x0 + ((x1 - x0) * i) / (values.length - 1);
  const Y = v => y1 - ((y1 - y0) * (v - lo)) / (hi - lo);
  const pts = values.map((v, i) => [X(i), Y(v)]);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`).join(' ');
  const step = niceStep(hi - lo);
  const ticks = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) ticks.push(v);
  const grid = ticks.map(v => `<line x1="${x0}" x2="${x1}" y1="${Y(v).toFixed(2)}" y2="${Y(v).toFixed(2)}" stroke="rgba(255,255,255,.07)" stroke-width="1"/>${labels ? `<text x="${w - 2}" y="${(Y(v) + 4).toFixed(2)}" text-anchor="end" font-size="11" fill="${c.tekst2}">${esc(tickLabel(v, lang))}</text>` : ''}`).join('');
  const years = (axis ?? []).map((label, k) => {
    const i = 27 + 12 * k - from;
    if (i < 0 || i >= values.length) return '';
    return `<line x1="${X(i).toFixed(2)}" x2="${X(i).toFixed(2)}" y1="${y0}" y2="${y1}" stroke="rgba(255,255,255,.05)"/>${labels ? `<text x="${X(i).toFixed(2)}" y="${h - 6}" text-anchor="middle" font-size="11" fill="${c.tekst2}">${esc(label)}</text>` : ''}`;
  }).join('');
  const last = pts[pts.length - 1];
  const area = `${d} L${x1} ${y1} L${x0} ${y1} Z`;
  return `<svg class="k-chart" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true" style="display:block;overflow:visible"><defs><linearGradient id="${id}-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.szalwia}" stop-opacity=".2"/><stop offset="1" stop-color="${c.szalwia}" stop-opacity="0"/></linearGradient><filter id="${id}-glow" x="-10%" y="-40%" width="120%" height="180%"><feGaussianBlur stdDeviation="4"/></filter></defs>${grid}${years}${fill ? `<path d="${area}" fill="url(#${id}-fill)"/>` : ''}<path d="${d}" fill="none" stroke="${c.szalwia}" stroke-width="4" stroke-opacity=".45" filter="url(#${id}-glow)"/><path d="${d}" fill="none" stroke="${c.szalwia}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${last[0].toFixed(2)}" cy="${last[1].toFixed(2)}" r="9" fill="${c.szalwia}" fill-opacity=".18"/><circle cx="${last[0].toFixed(2)}" cy="${last[1].toFixed(2)}" r="4" fill="${c.szalwia}"/>${marks ? `<circle data-chart="a" data-i="${from}" data-v="${values[0]}" cx="${pts[0][0].toFixed(2)}" cy="${pts[0][1].toFixed(2)}" r="0.5" fill="none"/><circle data-chart="b" data-i="${all.length - 1}" data-v="${values[values.length - 1]}" cx="${last[0].toFixed(2)}" cy="${last[1].toFixed(2)}" r="0.5" fill="none"/>` : ''}</svg>`;
};

const head = (title, ui, lang, kicker) =>
  `<div class="k-head"><div style="min-width:0">${kicker ? `<div class="k-kicker">${t(kicker, lang)}</div>` : ''}<h1 class="k-h1"${kicker ? ' style="margin-top:2px"' : ''}>${t(title, lang)}</h1></div>${sample(ui, lang)}</div>`;

export const groupsCard = (ui, lang, { compact = false } = {}) => {
  const m = ui.majatek;
  return `<div class="k-glass"><div class="k-list">${m.groups
    .map(g => `<div class="k-li" style="${compact ? 'min-height:46px' : ''}"><span class="k-dot" style="background:${tone(g.tone)}"></span><div class="k-li__main"><div class="k-li__name">${t(g.name, lang)}</div><div class="k-bar" style="margin-top:7px;height:4px"><i style="width:${((g.value / m.total) * 100).toFixed(1)}%;background:${tone(g.tone)}"></i></div></div><span class="k-li__val">${money(g.value, lang)}</span></div>`)
    .join('')}</div></div>`;
};

export const chartCard = (ui, lang, { w, h, id = 'nw', marks = true, title = true }) => {
  const m = ui.majatek;
  return `<div class="k-glass" style="padding:18px 18px 12px">${title ? `<div class="k-between"><div><div class="k-kicker">${t(m.title, lang)}</div><div class="k-big" style="margin-top:6px;font-size:34px">${money(m.total, lang)}</div></div><div class="k-chips">${m.ranges.map((r, i) => `<span class="k-chip${i === m.active ? ' k-chip--on' : ''}" style="height:28px;padding:0 11px;font-size:12px">${t(r, lang)}</span>`).join('')}</div></div>` : ''}<div style="margin-top:${title ? 14 : 0}px">${chartSvg({ total: m.total, lang, w, h, axis: m.axis, id, marks })}</div></div>`;
};

export const budgetSafe = (ui, lang, { big = 44 } = {}) => {
  const b = ui.budzet;
  return `<div class="k-glass k-glass--strong" style="padding:18px 18px 16px" data-mark="safe"><div class="k-kicker">${t(b.safeLabel, lang)}</div><div class="k-big" style="margin-top:8px;font-size:${big}px;color:${c.platyna}">${money(b.safe, lang)}</div><div class="k-muted" style="margin-top:8px;font-size:13.5px;color:${c.tekst}">${t(b.leftLabel, lang)}</div><div class="k-muted" style="margin-top:2px">${t(b.note, lang)}</div></div>`;
};

export const budgetList = (ui, lang, { rows } = {}) => {
  const b = ui.budzet;
  const list = rows ? b.categories.slice(0, rows) : b.categories;
  return `<div class="k-glass" style="padding:6px 0"><div class="k-list">${list
    .map(cat => {
      const full = cat.spent >= cat.limit;
      return `<div class="k-li" style="min-height:54px;flex-direction:column;align-items:stretch;justify-content:center;gap:7px"><div class="k-between"><span class="k-li__name">${t(cat.name, lang)}</span><span style="font-size:13px;color:${c.tekst2};white-space:nowrap"><b style="color:${c.tekst};font-weight:700">${money(cat.spent, lang)}</b> / ${money(cat.limit, lang)}</span></div><div class="k-bar${full ? ' k-bar--full' : ''}" style="height:4px"><i style="width:${Math.min(100, (cat.spent / cat.limit) * 100).toFixed(1)}%"></i></div></div>`;
    })
    .join('')}</div></div>`;
};

export const gaugeSvg = ({ months, target, size = 240, stroke = 14, id = 'g' }) => {
  const r = (size - stroke) / 2 - 6;
  const cx = size / 2;
  const cy = size / 2;
  const start = Math.PI * 0.8;
  const sweep = Math.PI * 1.4;
  const max = target + 2;
  const pt = f => [cx + r * Math.cos(start + sweep * f), cy + r * Math.sin(start + sweep * f)];
  const arc = (f0, f1) => {
    const [ax, ay] = pt(f0);
    const [bx, by] = pt(f1);
    return `M${ax.toFixed(2)} ${ay.toFixed(2)} A${r} ${r} 0 ${sweep * (f1 - f0) > Math.PI ? 1 : 0} 1 ${bx.toFixed(2)} ${by.toFixed(2)}`;
  };
  const ticks = Array.from({ length: max + 1 }, (_, k) => {
    const a = start + (sweep * k) / max;
    const r1 = r + stroke / 2 + 5;
    const r2 = r1 + (k === target ? 10 : 5);
    return `<line x1="${(cx + r1 * Math.cos(a)).toFixed(2)}" y1="${(cy + r1 * Math.sin(a)).toFixed(2)}" x2="${(cx + r2 * Math.cos(a)).toFixed(2)}" y2="${(cy + r2 * Math.sin(a)).toFixed(2)}" stroke="${k === target ? c.platyna : 'rgba(255,255,255,.25)'}" stroke-width="${k === target ? 2 : 1.2}" stroke-linecap="round"/>`;
  }).join('');
  const f = months / max;
  const [ex, ey] = pt(f);
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true" style="display:block;overflow:visible"><defs><filter id="${id}-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter></defs><path d="${arc(0, 1)}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="${stroke}" stroke-linecap="round"/><path d="${arc(0, f)}" fill="none" stroke="${c.szalwia}" stroke-opacity=".4" stroke-width="${stroke + 4}" stroke-linecap="round" filter="url(#${id}-glow)"/><path d="${arc(0, f)}" fill="none" stroke="${c.szalwia}" stroke-width="${stroke}" stroke-linecap="round"/>${ticks}<circle cx="${ex.toFixed(2)}" cy="${ey.toFixed(2)}" r="${stroke * 0.32}" fill="${c.glebia}"/></svg>`;
};

export const cushionGauge = (ui, lang, { size = 230 } = {}) => {
  const p = ui.poduszka;
  return `<div style="position:relative;width:${size}px;height:${size * 0.86}px;margin:0 auto">${gaugeSvg({ months: p.months, target: p.target, size, stroke: size * 0.06 })}<div style="position:absolute;left:0;right:0;top:${size * 0.3}px;text-align:center"><div class="k-big" style="font-size:${size * 0.24}px;color:${c.platyna}">${decimal(p.months, lang)}</div><div class="k-muted" style="margin-top:4px;font-size:13px">${t(p.monthsLabel, lang)}</div><div style="margin-top:10px;font-weight:600;font-size:12.5px;color:${c.tekst}">${t(p.targetLabel, lang)}</div></div></div>`;
};

export const cushionRows = (ui, lang) => {
  const p = ui.poduszka;
  const rows = [
    [p.amountLabel, money(p.amount, lang)],
    [p.monthlyLabel, money(p.monthly, lang)],
    [p.missingLabel, money(p.missing, lang)],
    [p.depositLabel, money(p.deposit, lang)],
  ];
  return `<div class="k-glass" style="padding:4px 0"><div class="k-list">${rows.map(([label, value]) => `<div class="k-li" style="min-height:48px"><span class="k-li__main" style="color:${c.tekst2};font-size:13.5px;white-space:normal">${t(label, lang)}</span><span class="k-li__val">${value}</span></div>`).join('')}</div></div>`;
};

export const ringSvg = ({ items, size = 220, stroke = 22, id = 'r', gap = 0.035 }) => {
  const r = (size - stroke) / 2;
  const cx = size / 2;
  let acc = -Math.PI / 2;
  const segs = items.map(item => {
    const sweep = (item.share / 100) * Math.PI * 2;
    const a0 = acc + gap / 2;
    const a1 = acc + sweep - gap / 2;
    acc += sweep;
    const p = a => [cx + r * Math.cos(a), cx + r * Math.sin(a)];
    const [ax, ay] = p(a0);
    const [bx, by] = p(a1);
    return `<path d="M${ax.toFixed(2)} ${ay.toFixed(2)} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${bx.toFixed(2)} ${by.toFixed(2)}" fill="none" stroke="${tone(item.tone)}" stroke-width="${stroke}" stroke-linecap="butt"/>`;
  });
  let tacc = -Math.PI / 2;
  const targets = items.map(item => {
    tacc += (item.target / 100) * Math.PI * 2;
    const r1 = r + stroke / 2 + 4;
    const r2 = r - stroke / 2 - 4;
    return `<line x1="${(cx + r1 * Math.cos(tacc)).toFixed(2)}" y1="${(cx + r1 * Math.sin(tacc)).toFixed(2)}" x2="${(cx + r2 * Math.cos(tacc)).toFixed(2)}" y2="${(cx + r2 * Math.sin(tacc)).toFixed(2)}" stroke="${c.tekst}" stroke-width="1.6" stroke-dasharray="2 2.5" stroke-linecap="round"/>`;
  });
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true" style="display:block;overflow:visible"><circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="${stroke}"/>${segs.join('')}${targets.join('')}</svg>`;
};

export const allocationRows = (ui, lang, { compact = false } = {}) => {
  const a = ui.alokacja;
  return `<div class="k-glass" style="padding:4px 0"><div class="k-list">${a.items
    .map(item => `<div class="k-li" style="min-height:${compact ? 56 : 64}px;flex-direction:column;align-items:stretch;justify-content:center;gap:8px"><div class="k-row" style="gap:10px"><span class="k-dot" style="background:${tone(item.tone)}"></span><div class="k-li__main"><div class="k-li__name">${t(item.name, lang)}</div>${compact ? '' : `<div class="k-li__sub">${t(item.sub, lang)}</div>`}</div><div style="text-align:right"><div class="k-li__val">${item.share}%</div><div class="k-li__sub">${t(a.planLabel, lang)} ${item.target}%</div></div></div><div class="k-bar" style="height:4px;overflow:visible"><i style="width:${item.share}%;background:${tone(item.tone)}"></i><span style="position:absolute;left:${item.target}%;top:-4px;width:2px;height:12px;margin-left:-1px;border-radius:1px;background:${c.tekst}"></span></div></div>`)
    .join('')}</div></div>`;
};

export const goalCard = (ui, lang, { compact = false, titled = false } = {}) => {
  const g = ui.cel;
  return `<div class="k-glass" style="padding:18px"><div class="k-between"><div class="k-kicker">${t(titled ? g.title : g.savedLabel, lang)}</div><span class="k-tag">${g.share}%</span></div><div class="k-big" style="margin-top:14px;font-size:${compact ? 28 : 34}px">${money(g.saved, lang)}</div><div class="k-muted" style="margin-top:4px">/ ${money(g.target, lang)}</div><div class="k-bar" style="margin-top:12px;height:6px"><i style="width:${g.share}%"></i></div></div>`;
};

export const goalPlan = (ui, lang) => {
  const g = ui.cel;
  return `<div class="k-glass" style="padding:4px 0"><div class="k-list"><div class="k-li" style="min-height:50px"><span class="k-ico">${icons.calendar}</span><div class="k-li__main"><div class="k-li__name">${money(g.monthly, lang)} ${t(g.monthlyLabel, lang)}</div></div></div><div class="k-li" style="min-height:62px"><span class="k-ico">${icons.goals}</span><div class="k-li__main"><div class="k-li__sub" style="font-size:12px">${t(g.etaLabel, lang)}</div><div class="k-li__name">${t(g.eta, lang)}</div><div class="k-li__sub" style="font-size:12px">${t(g.etaNote, lang)}</div></div></div></div></div>`;
};

export const goalHistory = (ui, lang, { w = 350 } = {}) => {
  const g = ui.cel;
  const max = Math.max(...g.deposits.map(d => d.v));
  const n = g.deposits.length;
  const step = (w - 36) / (n - 1);
  const dots = g.deposits
    .map((d, i) => {
      const x = 18 + i * step;
      const r = 5 + (d.v / max) * 4;
      return `<circle cx="${x.toFixed(1)}" cy="34" r="${(r + 6).toFixed(1)}" fill="${c.szalwia}" fill-opacity=".12"/><circle cx="${x.toFixed(1)}" cy="34" r="${r.toFixed(1)}" fill="${c.szalwia}"/><text x="${x.toFixed(1)}" y="12" text-anchor="middle" font-size="11" font-weight="600" fill="${c.tekst}">${esc(lang === 'pl' ? grouped(d.v, nb) : `£${d.v}`)}</text><text x="${x.toFixed(1)}" y="66" text-anchor="middle" font-size="11" fill="${c.tekst2}">${esc(d.m)}</text>`;
    })
    .join('');
  return `<div class="k-glass" style="padding:14px 0 10px"><div class="k-kicker" style="padding:0 16px 8px">${t(g.historyLabel, lang)}</div><svg class="k-chart" width="${w}" height="72" viewBox="0 0 ${w} 72" aria-hidden="true" style="display:block"><line x1="18" x2="${w - 18}" y1="34" y2="34" stroke="rgba(255,255,255,.12)" stroke-width="2"/>${dots}</svg></div>`;
};

export const reportNumbers = (ui, lang) =>
  `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">${ui.raport.numbers.map(n => `<div class="k-glass" style="padding:12px 12px 13px;border-radius:16px"><div class="k-muted" style="font-size:12px">${t(n.label, lang)}</div><div class="k-num" style="margin-top:4px;font-size:17px;white-space:nowrap">${t(n.value, lang)}</div></div>`).join('')}</div>`;

export const reportSentences = (ui, lang, { gap = 14 } = {}) =>
  `<div class="k-glass" style="padding:18px 18px 20px;display:flex;flex-direction:column;gap:${gap}px">${ui.raport.sentences.map((s, i) => `<div class="k-row" style="align-items:flex-start;gap:12px"><span style="flex:none;width:22px;height:22px;margin-top:2px;border-radius:50%;border:1px solid var(--krawedz);display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;color:${c.lod}">${i + 1}</span><p class="k-sentence">${rich(s, lang)}</p></div>`).join('')}</div>`;

export const accountsList = (ui, lang, { rows } = {}) => {
  const k = ui.konta;
  let shown = 0;
  return k.groups
    .map(g => {
      const items = rows ? g.items.filter(() => (shown += 1) <= rows) : g.items;
      if (items.length === 0) return '';
      return `<div class="k-kicker" style="margin:14px 4px 8px">${t(g.name, lang)}</div><div class="k-glass" style="padding:2px 0"><div class="k-list">${items.map(item => `<div class="k-li" style="min-height:58px"><span class="k-ico">${icons[item.icon]}</span><div class="k-li__main"><div class="k-li__name">${t(item.name, lang)}</div><div class="k-li__sub">${t(item.sub, lang)}</div></div><span class="k-li__val">${money(item.value, lang)}</span></div>`).join('')}</div></div>`;
    })
    .join('');
};

const majatek = (ui, { lang }) => {
  const m = ui.majatek;
  return `<div class="k-scr"><div class="k-body">
${head(m.title, ui, lang)}
<div class="k-pad" style="margin-top:6px"><div class="k-big" style="font-size:40px">${money(m.total, lang)}</div><div class="k-muted" style="margin-top:6px">${t(m.updated, lang)}</div></div>
<div class="k-pad" style="margin-top:14px"><div class="k-chips">${m.ranges.map((r, i) => `<span class="k-chip${i === m.active ? ' k-chip--on' : ''}">${t(r, lang)}</span>`).join('')}</div></div>
<div data-mark="chart" style="position:absolute;left:20px;top:172px">${chartSvg({ total: m.total, lang, w: 350, h: 196, axis: m.axis, id: 'scr' })}</div>
<div class="k-pad" style="position:absolute;left:0;right:0;top:392px">${groupsCard(ui, lang)}<div class="k-between" style="margin-top:14px;padding:0 4px"><span class="k-muted">${t(m.deposits.label, lang)}</span><span class="k-num" style="font-size:15px">${money(m.deposits.value, lang)}</span></div></div>
${tabs(ui, 0, lang)}</div></div>`;
};

const budzet = (ui, { lang }) => {
  const b = ui.budzet;
  return `<div class="k-scr"><div class="k-body">
${head(b.title, ui, lang, b.date)}
<div class="k-pad" style="margin-top:16px">${budgetSafe(ui, lang)}</div>
<div class="k-pad" style="margin-top:18px"><div class="k-between" style="padding:0 4px 8px"><span class="k-kicker">${t(b.spentLabel, lang)}</span><span class="k-muted">${money(b.categories.reduce((s, x) => s + x.spent, 0), lang)} / ${money(b.categories.reduce((s, x) => s + x.limit, 0), lang)}</span></div>${budgetList(ui, lang)}</div>
${tabs(ui, 1, lang)}</div></div>`;
};

const poduszka = (ui, { lang }) => {
  const p = ui.poduszka;
  return `<div class="k-scr"><div class="k-body">
${head(p.title, ui, lang)}
<div style="margin-top:18px" data-mark="gauge">${cushionGauge(ui, lang)}</div>
<div class="k-pad" style="margin-top:2px">${cushionRows(ui, lang)}</div>
<div class="k-pad" style="margin-top:14px"><div class="k-muted" style="padding:0 4px;font-size:13.5px;line-height:1.45">${t(p.eta, lang)}</div></div>
${tabs(ui, 2, lang)}</div></div>`;
};

const alokacja = (ui, { lang }) => {
  const a = ui.alokacja;
  return `<div class="k-scr"><div class="k-body">
${head(a.title, ui, lang)}
<div class="k-pad"><div class="k-muted" style="margin-top:2px">${t(a.sub, lang)}</div></div>
<div style="position:relative;width:200px;height:200px;margin:18px auto 0" data-mark="ring">${ringSvg({ items: a.items, size: 200, stroke: 18 })}<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center"><div class="k-muted" style="font-size:12px">${t(a.nowLabel, lang)}</div><div class="k-num" style="font-size:22px;margin-top:2px">${money(a.total, lang)}</div></div></div>
<div class="k-pad" style="margin-top:18px">${allocationRows(ui, lang)}</div>
<div class="k-pad" style="margin-top:12px"><div class="k-row" style="padding:0 4px;gap:10px"><span style="display:flex;color:${c.lod}">${sized(icons.sliders, 18)}</span><span class="k-muted" style="font-size:13.5px;color:${c.tekst}">${t(a.note, lang)}</span></div></div>
${tabs(ui, 0, lang)}</div></div>`;
};

const cel = (ui, { lang }) => `<div class="k-scr"><div class="k-body">
${head(ui.cel.title, ui, lang, ui.cel.sub)}
<div class="k-pad" style="margin-top:16px">${goalCard(ui, lang)}</div>
<div class="k-pad" style="margin-top:14px">${goalHistory(ui, lang)}</div>
<div class="k-pad" style="margin-top:14px">${goalPlan(ui, lang)}</div>
${tabs(ui, 2, lang)}</div></div>`;

const raport = (ui, { lang }) => {
  const r = ui.raport;
  return `<div class="k-scr"><div class="k-body">
${head(r.title, ui, lang, r.sub)}
<div class="k-pad" style="margin-top:18px">${reportNumbers(ui, lang)}</div>
<div class="k-pad" style="margin-top:14px">${reportSentences(ui, lang)}</div>
<div class="k-pad" style="margin-top:16px"><div class="k-row" style="padding:0 4px;gap:10px;color:${c.tekst2}"><span style="display:flex">${sized(icons.bell, 18)}</span><span class="k-muted" style="font-size:13.5px">${t(r.next, lang)}</span></div></div>
${tabs(ui, 3, lang)}</div></div>`;
};

const konta = (ui, { lang }) => {
  const k = ui.konta;
  return `<div class="k-scr"><div class="k-body">
${head(k.title, ui, lang)}
<div class="k-pad" style="margin-top:6px"><div class="k-between"><span class="k-muted">${t(k.totalLabel, lang)}</span><span class="k-num" style="font-size:20px">${money(k.total, lang)}</span></div></div>
<div class="k-pad">${accountsList(ui, lang)}</div>
<div class="k-pad" style="position:absolute;left:0;right:0;bottom:100px;display:grid;grid-template-columns:1.3fr 1fr;gap:10px"><span class="k-btn">${icons.upload}${t(k.import, lang)}</span><span class="k-btn k-btn--ghost">${icons.plus}${t(k.add, lang)}</span></div>
${tabs(ui, 0, lang)}</div></div>`;
};

const screens = { majatek, budzet, poduszka, alokacja, cel, raport, konta };

export const screenOrder = ['majatek', 'budzet', 'poduszka', 'alokacja', 'cel', 'raport', 'konta'];

export const renderScreen = (id, ui, ctx) => {
  const fn = screens[id];
  if (!fn) throw new Error(`kruszec: unknown screen ${id}`);
  return fn(ui, ctx);
};

export const TABLET = { width: 900, height: 1200 };

const sideItems = (ui, active, lang) => [icons.worth, icons.budget, icons.goals, icons.report].map((icon, i) => `<div class="k-side__item${i === active ? ' k-side__item--on' : ''}">${icon}<span>${t(ui.tabs[i], lang)}</span></div>`).join('');

const tabletStatus = () => `<div style="position:absolute;left:0;right:0;top:0;height:40px;display:flex;align-items:center;justify-content:space-between;padding:0 30px;font-weight:600;font-size:15px;color:${c.tekst};z-index:3"><span>9:30</span><span style="display:flex;gap:7px;align-items:center"><svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true"><path d="M8 11.6 5.6 9.1a3.4 3.4 0 0 1 4.8 0Z" fill="${c.tekst}"/><path d="M3.4 6.9a6.5 6.5 0 0 1 9.2 0l-1.4 1.4a4.5 4.5 0 0 0-6.4 0Z" fill="${c.tekst}"/><path d="M1.1 4.6a9.8 9.8 0 0 1 13.8 0l-1.4 1.4a7.8 7.8 0 0 0-11 0Z" fill="${c.tekst}"/></svg><svg width="27" height="13" viewBox="0 0 27 13" aria-hidden="true"><rect x="0.5" y="0.5" width="23" height="12" rx="3.5" fill="none" stroke="${c.tekst}" stroke-opacity="0.45"/><rect x="2" y="2" width="20" height="9" rx="2" fill="${c.tekst}"/><path d="M25 4.5v4a2 2 0 0 0 0-4Z" fill="${c.tekst}" fill-opacity="0.5"/></svg></span></div>`;

const tabletLayouts = {
  majatek: { active: 0, title: ui => ui.majatek.title, left: (ui, lang) => [chartCard(ui, lang, { w: 326, h: 260, id: 'tab' }), groupsCard(ui, lang)], right: (ui, lang) => [`<div class="k-kicker" style="margin:2px 4px -12px">${t(ui.konta.title, lang)}</div>${accountsList(ui, lang).replace('margin:14px 4px 8px', 'margin:0 4px 8px')}`] },
  budzet: { active: 1, title: ui => ui.budzet.title, left: (ui, lang) => [budgetSafe(ui, lang, { big: 54 }), budgetList(ui, lang), reportNumbers(ui, lang)], right: (ui, lang) => [chartCard(ui, lang, { w: 222, h: 140, id: 'tab', marks: false, title: false }), goalCard(ui, lang, { compact: true, titled: true }), cushionRows(ui, lang)] },
  poduszka: { active: 2, title: ui => ui.poduszka.title, left: (ui, lang) => [`<div class="k-glass" style="padding:26px 0 18px">${cushionGauge(ui, lang, { size: 270 })}</div>`, cushionRows(ui, lang)], right: (ui, lang) => [budgetSafe(ui, lang, { big: 36 }), goalCard(ui, lang, { compact: true, titled: true }), `<div class="k-muted" style="padding:0 4px;font-size:14px;line-height:1.5">${t(ui.poduszka.eta, lang)}</div>`] },
  alokacja: { active: 0, title: ui => ui.alokacja.title, left: (ui, lang) => [`<div class="k-glass" style="padding:28px 0"><div style="position:relative;width:250px;height:250px;margin:0 auto">${ringSvg({ items: ui.alokacja.items, size: 250, stroke: 22, id: 'tr' })}<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center"><div class="k-muted">${t(ui.alokacja.nowLabel, lang)}</div><div class="k-num" style="font-size:28px;margin-top:4px">${money(ui.alokacja.total, lang)}</div></div></div></div>`, allocationRows(ui, lang)], right: (ui, lang) => [chartCard(ui, lang, { w: 222, h: 140, id: 'tab', marks: false, title: false }), `<div class="k-glass" style="padding:16px 18px"><div class="k-row" style="align-items:flex-start;gap:12px"><span class="k-ico">${icons.sliders}</span><span style="font-size:14.5px;line-height:1.45">${t(ui.alokacja.note, lang)}</span></div></div>`, groupsCard(ui, lang, { compact: true })] },
  cel: { active: 2, title: ui => ui.cel.title, left: (ui, lang) => [goalCard(ui, lang), goalHistory(ui, lang, { w: 362 }), goalPlan(ui, lang)], right: (ui, lang) => [`<div class="k-glass" style="padding:18px 0 8px">${cushionGauge(ui, lang, { size: 190 })}</div>`, allocationRows(ui, lang, { compact: true }), budgetSafe(ui, lang, { big: 34 })] },
  raport: { active: 3, title: ui => ui.raport.title, left: (ui, lang) => [reportNumbers(ui, lang), reportSentences(ui, lang, { gap: 18 }), groupsCard(ui, lang), `<div class="k-row" style="padding:0 4px;gap:10px;color:${c.tekst2}"><span style="display:flex">${sized(icons.bell, 18)}</span><span class="k-muted" style="font-size:14px">${t(ui.raport.next, lang)}</span></div>`], right: (ui, lang) => [chartCard(ui, lang, { w: 222, h: 140, id: 'tab', marks: false, title: false }), budgetList(ui, lang, { rows: 4 })] },
};

export const renderTablet = (id, ui, { lang }) => {
  const layout = tabletLayouts[id];
  if (!layout) throw new Error(`kruszec: no tablet layout for ${id}`);
  const subtitle = id === 'majatek' ? ui.majatek.updated : id === 'budzet' ? ui.budzet.date : id === 'cel' ? ui.cel.sub : id === 'raport' ? ui.raport.sub : id === 'alokacja' ? ui.alokacja.sub : ui.poduszka.targetLabel;
  return `<div class="k-tablet" style="width:${TABLET.width}px;height:${TABLET.height}px">${tabletStatus()}<aside class="k-side"><div class="k-side__brand"><svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true"><rect x="1" y="1" width="28" height="28" rx="8" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.18)"/><path d="M6 19c3.2-1 4.6-6 8-6 3 0 3.6 3 6.4 3 1.8 0 2.8-2.4 3.6-5" fill="none" stroke="${c.szalwia}" stroke-width="2" stroke-linecap="round"/></svg>Kruszec</div>${sideItems(ui, layout.active, lang)}</aside><main class="k-main"><div class="k-between" style="align-items:flex-end"><div><div class="k-kicker">${t(subtitle, lang)}</div><h1 class="k-h1" style="margin-top:4px;font-size:34px">${t(layout.title(ui), lang)}</h1></div>${sample(ui, lang)}</div><div class="k-grid"><div class="k-col">${layout.left(ui, lang).join('')}</div><div class="k-col">${layout.right(ui, lang).join('')}</div></div></main></div>`;
};
