import { esc, text } from '../../kit/kit.mjs';
import { profilePoints, profileRange, steep } from './profile.mjs';

const icon = {
  map: '<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M3 6.5 9 4l8 3 6-2.5v15L17 22l-8-3-6 2.5Z"/><path d="M9 4v15M17 7v15"/></svg>',
  route: '<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="6" cy="20" r="2.6"/><circle cx="20" cy="6" r="2.6"/><path d="M8.5 20H16a4 4 0 0 0 0-8h-6a4 4 0 0 1 0-8h7.5"/></svg>',
  offline: '<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 4v12M8 11.5l5 5 5-5M5 21h16"/></svg>',
  book: '<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M5 4h12a3 3 0 0 1 3 3v15H8a3 3 0 0 1-3-3Z"/><path d="M5 19a3 3 0 0 1 3-3h12M10 9l2.5-2.5L15 9"/></svg>',
  search: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="8.5" cy="8.5" r="6"/><path d="m13 13 5 5"/></svg>',
  layers: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="m10 2 8 4.5-8 4.5-8-4.5Z"/><path d="m2 10.5 8 4.5 8-4.5"/></svg>',
  check: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m3 8.5 3.2 3L13 4.5"/></svg>',
  down: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2.5v8M4.5 7.5 8 11l3.5-3.5M3 14h10"/></svg>',
  back: '<svg width="12" height="20" viewBox="0 0 12 20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2 2 10l8 8"/></svg>',
  nosignal: '<svg width="16" height="14" viewBox="0 0 16 14" fill="currentColor"><rect x="0" y="9" width="3" height="5" rx="1" opacity=".35"/><rect x="4.3" y="6" width="3" height="8" rx="1" opacity=".35"/><rect x="8.6" y="3" width="3" height="11" rx="1" opacity=".35"/><rect x="12.9" y="0" width="3" height="14" rx="1" opacity=".35"/><path d="M1 1l14 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  gps: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="8" r="5"/><circle cx="8" cy="8" r="1.8" fill="currentColor"/><path d="M8 0v3M8 13v3M0 8h3M13 8h3"/></svg>',
  sun: '<svg width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="6" fill="#F2A93B"/><g stroke="#F2A93B" stroke-width="2.2" stroke-linecap="round"><path d="M14 2v3M14 23v3M2 14h3M23 14h3M5.5 5.5l2 2M20.5 20.5l2 2M5.5 22.5l2-2M20.5 7.5l2-2"/></g></svg>',
  bell: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M5 16V10a6 6 0 0 1 12 0v6l1.5 2h-15Z"/><path d="M9 20.5h4" stroke-linecap="round"/></svg>',
  lamp: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 11c0-3 3.5-5 8-5s8 2 8 5"/><rect x="8" y="9" width="6" height="5" rx="1.5"/><path d="M3 11v2M19 11v2M11 16v3M7 15.5l-2 2M15 15.5l2 2" stroke-linecap="round"/></svg>',
  wind: '<svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 9h12a3 3 0 1 0-3-3M3 14h17a3 3 0 1 1-3 3M3 19h8"/></svg>',
  eye: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2"><path d="M1.5 11S5 4.5 11 4.5 20.5 11 20.5 11 17 17.5 11 17.5 1.5 11 1.5 11Z"/><circle cx="11" cy="11" r="3"/></svg>',
  cloud: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 17h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.3 1.8A3.2 3.2 0 0 0 6 17Z"/></svg>',
  temp: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3.5a2 2 0 0 1 4 0v9.3a4 4 0 1 1-4 0Z"/><circle cx="11" cy="16" r="1.6" fill="currentColor"/></svg>',
  warn: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#C8352B" stroke-width="2.2" stroke-linejoin="round"><path d="M11 2.5 20.5 19h-19Z"/><path d="M11 8.5v5M11 16.2v.3" stroke-linecap="round"/></svg>',
  peak: '<svg width="30" height="30" viewBox="0 0 30 30"><path d="M2 26 12 9l5 8 3-4 8 13Z" fill="#6E8F9B"/><path d="M12 9l-3.2 5.4 2.2-1 1.8 1.6 1.6-1.4Z" fill="#FFFDF8"/><path d="M12 9V2" stroke="#17302A" stroke-width="1.6"/><path d="M12 2h6l-1.6 2 1.6 2h-6Z" fill="#C8352B"/></svg>',
};

const tabs = (ui, active, lang) =>
  `<nav class="g-tabs">${['map', 'route', 'offline', 'book']
    .map((key, i) => `<span class="g-tab${i === active ? ' g-tab--on' : ''}">${icon[key]}${text(ui.tabs[i], lang)}</span>`)
    .join('')}</nav>`;

const mark = trail => `<span class="g-mark g-mark--${trail}"></span>`;

export const mapPoints = {
  entry: [0, 470],
  start: [62, 452],
  kociol: [146, 372],
  przelecz: [222, 262],
  szczyt: [318, 182],
  kopa: [132, 214],
};

const mapSvg = (ui, lang) => {
  const p = mapPoints;
  const pts = Object.fromEntries(ui.mapa.points.map(item => [item.id, item]));
  const contour = (cx, cy, rings, rx, ry, wobble) =>
    Array.from({ length: rings }, (_, i) => {
      const k = i + 1;
      const steps = 28;
      const d = Array.from({ length: steps }, (_, s) => {
        const a = (s / steps) * Math.PI * 2;
        const r = 1 + Math.sin(a * 3 + k) * wobble + Math.cos(a * 5 + k * 2) * wobble * 0.6;
        return `${s === 0 ? 'M' : 'L'}${(cx + Math.cos(a) * rx * k * r).toFixed(1)},${(cy + Math.sin(a) * ry * k * r).toFixed(1)}`;
      }).join('');
      return `<path d="${d}Z" fill="none" stroke="#DCCDB6" stroke-width="1.2"/>`;
    }).join('');
  const seg = (a, b, color, casing = true) =>
    `${casing ? `<path d="M${a} L${b}" stroke="#FFFDF8" stroke-width="9" stroke-linecap="round"/>` : ''}<path d="M${a} L${b}" stroke="${color}" stroke-width="5" stroke-linecap="round"/>`;
  const line = (points, color, width = 5) =>
    `<polyline points="${points.map(q => q.join(',')).join(' ')}" fill="none" stroke="#FFFDF8" stroke-width="${width + 4}" stroke-linecap="round" stroke-linejoin="round"/><polyline points="${points.map(q => q.join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const chip = (x, y, value) =>
    `<g transform="translate(${x} ${y})"><rect x="-22" y="-12" width="44" height="24" rx="12" fill="#FFFDF8" stroke="#17302A" stroke-width="1.4"/><text x="0" y="5" text-anchor="middle" font-size="13" font-weight="800" fill="#17302A">${esc(value)}</text></g>`;
  const label = (x, y, item, anchor = 'start') =>
    `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="12.5" font-weight="800" fill="#17302A" stroke="#F5EBDD" stroke-width="4" paint-order="stroke" stroke-linejoin="round">${esc(item.name)}${item.height ? `<tspan font-weight="600" fill="#4F625B"> ${esc(item.height)}</tspan>` : ''}</text>`;
  const dot = ([x, y], big = false) =>
    `<circle cx="${x}" cy="${y}" r="${big ? 7 : 5.5}" fill="#FFFDF8" stroke="#17302A" stroke-width="2.4"/>`;
  return `<svg class="g-map" width="390" height="844" viewBox="0 0 390 844" aria-hidden="true">
<rect width="390" height="844" fill="#F3E8D7"/>
<path d="M-10 520 C60 500 90 430 120 400 S200 330 260 300 S360 250 400 240 V-10 H-10Z" fill="#E7E0C6"/>
<path d="M-10 640 C80 610 130 560 190 520 S320 470 400 455 V844 H-10Z" fill="#DCE3C3"/>
<path d="M240 600 C270 560 330 540 400 530 V844 H220Z" fill="#D2DDB6"/>
${contour(318, 182, 6, 16, 12, 0.08)}${contour(132, 214, 4, 18, 13, 0.1)}${contour(260, 520, 3, 30, 18, 0.07)}
<path d="M-10 300 C40 296 80 290 120 300" stroke="#C9D7DC" stroke-width="3" fill="none"/>
<path d="M300 420 C330 440 360 470 400 480" stroke="#AFC3CB" stroke-width="2" fill="none" stroke-dasharray="1 0"/>
${line([[0, 268], [60, 262], [132, 214], [222, 262]], '#C8352B')}
${line([[222, 262], [270, 222], [318, 182], [360, 150], [400, 132]], '#C8352B')}
${line([[132, 214], [90, 180], [40, 150], [-10, 140]], '#2F67B1')}
${line([[62, 452], [120, 520], [180, 600], [230, 700]], '#2E8B4E')}
${line([[318, 182], [352, 246], [378, 300], [400, 330]], '#E8B820')}
<polyline points="${[p.entry, p.start, p.kociol, p.przelecz, p.szczyt].map(q => q.join(',')).join(' ')}" fill="none" stroke="#2E5446" stroke-opacity=".28" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
${line([p.start, [100, 420], p.kociol, [190, 320], p.przelecz], '#1D1F1E', 5)}${line([p.entry, p.start], '#C8352B', 5)}
${seg(p.przelecz.join(','), p.szczyt.join(','), '#C8352B', false)}
${chip(108, 400, ui.mapa.times[0])}${chip(196, 304, ui.mapa.times[1])}${chip(268, 236, ui.mapa.times[2])}${chip(170, 250, ui.mapa.times[3])}
${dot(p.start, true)}${dot(p.kociol)}${dot(p.przelecz)}${dot(p.kopa)}
<g transform="translate(${p.szczyt[0]} ${p.szczyt[1]})"><path d="M-9 6 0 -10 9 6Z" fill="#17302A"/><path d="M0 -10 -3 -5 0 -6.5 3 -5Z" fill="#FFFDF8"/></g>
${label(76, 470, pts.start)}${label(160, 386, pts.kociol)}${label(234, 282, { ...pts.przelecz, height: '' })}${label(306, 160, pts.szczyt, 'end')}${label(142, 204, pts.kopa)}
<circle cx="146" cy="372" r="15" fill="#2F67B1" fill-opacity=".18"/><circle cx="146" cy="372" r="6.5" fill="#2F67B1" stroke="#FFFDF8" stroke-width="2.5"/>
</svg>`;
};

const mapa = (ui, ctx) => {
  const m = ui.mapa;
  const lang = ctx.lang;
  return `<div class="g-scr g-scr--map">${mapSvg(ui, lang)}
<div class="g-mapbar" style="position:absolute;left:14px;right:14px;top:${ctx.top + 8}px;display:flex;gap:8px">
<div class="g-card" style="flex:1;display:flex;align-items:center;gap:8px;height:44px;padding:0 14px;color:#4F625B;font-weight:600">${icon.search}<span>${text(m.search, lang)}</span></div>
<div class="g-card" style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;color:#17302A">${icon.layers}</div></div>
<div style="position:absolute;left:14px;top:${ctx.top + 62}px;display:flex;gap:6px"><span class="g-chip">${text(m.range, lang)}</span><span class="g-chip">${mark('red')}${mark('blue')}${mark('black')}</span></div>
<div class="g-card" style="position:absolute;left:10px;right:10px;bottom:92px;padding:0 18px 16px;border-radius:22px">
<div class="g-handle"></div>
<div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px"><b style="font-size:20px;font-weight:900">${text(m.route, lang)}</b><span style="font-size:13px;color:#4F625B;font-weight:700">${text(m.routeNote, lang)}</span></div>
<div style="display:flex;gap:22px;margin:12px 0 14px">${m.stats.map(([v, l]) => `<div class="g-stat"><b>${text(v, lang)}</b><span>${text(l, lang)}</span></div>`).join('')}</div>
<div class="g-btn">${text(m.button, lang)}</div></div>
${tabs(ui, 0, lang)}</div>`;
};

const offline = (ui, ctx) => {
  const o = ui.offline;
  const lang = ctx.lang;
  const ridge = state =>
    `<svg width="46" height="46" viewBox="0 0 46 46"><rect width="46" height="46" rx="10" fill="${state === 'get' ? '#EFE4D3' : '#DDE6E2'}"/><path d="M0 34 12 20l7 7 9-12 18 19v12H0Z" fill="${state === 'get' ? '#AFC3CB' : '#6E8F9B'}"/><path d="M0 40 14 31l10 5 9-6 13 8v8H0Z" fill="${state === 'get' ? '#C9D3C0' : '#2E5446'}"/></svg>`;
  const right = item => {
    if (item.state === 'done') return `<span style="display:inline-flex;align-items:center;gap:4px;color:#2E5446;font-weight:800;font-size:13px">${icon.check}${text(o.doneLabel, lang)}</span>`;
    if (item.state === 'progress')
      return `<svg width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="14" fill="none" stroke="#E4D8C6" stroke-width="4"/><circle cx="17" cy="17" r="14" fill="none" stroke="#2E5446" stroke-width="4" stroke-linecap="round" stroke-dasharray="${(2 * Math.PI * 14 * item.progress) / 100} 200" transform="rotate(-90 17 17)"/></svg>`;
    return `<span style="display:inline-flex;align-items:center;gap:4px;height:32px;padding:0 12px;border-radius:999px;box-shadow:inset 0 0 0 2px #2E5446;color:#2E5446;font-weight:800;font-size:13px">${icon.down}${text(o.getLabel, lang)}</span>`;
  };
  return `<div class="g-scr"><div class="g-body">
<div class="g-head"><h1 class="g-title">${text(o.title, lang)}</h1><p class="g-lead">${text(o.lead, lang)}</p>
<div style="display:flex;gap:6px;margin-top:12px"><span class="g-chip" style="color:#C8352B">${icon.nosignal}${text(o.noSignal, lang)}</span><span class="g-chip" style="color:#2E5446">${icon.gps}${text(o.gps, lang)}</span></div></div>
<div style="margin:14px 20px 10px"><div style="height:8px;border-radius:4px;background:#E4D8C6;overflow:hidden;display:flex"><span style="width:6%;background:#2E5446"></span><span style="width:3%;background:#6E8F9B"></span></div><p style="margin:6px 0 0;font-size:12.5px;color:#4F625B;font-weight:600">${text(o.storage, lang)}</p></div>
<div class="g-card" style="margin:0 14px">${o.ranges
    .map(
      (item, i) => `<div class="g-row" style="padding:10px 12px;${i ? 'border-top:1px solid #E4D8C6' : ''}">${ridge(item.state)}<div style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:800">${text(item.name, lang)}</b><span style="font-size:12.5px;color:#4F625B;font-weight:600">${text(item.size, lang)} · ${text(item.note, lang)}</span></div>${right(item)}</div>`,
    )
    .join('')}</div></div>${tabs(ui, 2, lang)}</div>`;
};

const zmrok = (ui, ctx) => {
  const z = ui.zmrok;
  const lang = ctx.lang;
  const marks = [0, 0.43, 0.68, 1];
  return `<div class="g-scr"><div class="g-body">
<div class="g-head"><h1 class="g-title">${text(z.title, lang)}</h1><p class="g-lead">${text(z.where, lang)}</p></div>
<div style="margin:16px 14px 0;padding:18px 18px 16px;border-radius:20px;background:#2E5446;color:#FFFDF8">
<div style="font-weight:700;font-size:16px;opacity:.9">${text(z.turnLabel, lang)}</div>
<div style="font-weight:900;font-size:78px;line-height:.95;letter-spacing:-.02em;margin:6px 0 4px">${esc(z.turn)}</div>
<div style="font-weight:600;font-size:15px;opacity:.9">${text(z.turnNote, lang)}</div>
<div style="position:relative;height:66px;margin-top:16px">
<div style="position:absolute;left:0;right:0;top:14px;height:8px;border-radius:4px;background:linear-gradient(90deg,#A7BF73 0 43%,#FFFDF8 43% 68%,#F2A93B 68% 100%);opacity:.95"></div>
${marks.map((m, i) => `<span style="position:absolute;top:8px;left:${m * 100}%;width:4px;height:20px;margin-left:${i === 3 ? -4 : i === 0 ? 0 : -2}px;border-radius:2px;background:${i === 2 ? '#C8352B' : '#FFFDF8'}"></span><span style="position:absolute;top:32px;left:${m * 100}%;transform:translateX(${i === 0 ? 0 : i === 3 ? -100 : -50}%);text-align:${i === 0 ? 'left' : i === 3 ? 'right' : 'center'};font-size:12px;line-height:1.2;font-weight:600;white-space:nowrap;opacity:${i === 2 ? 1 : 0.85}"><b style="display:block;font-size:14px;font-weight:900">${esc(z.timeline[i])}</b>${text(z.timelineLabels[i], lang)}</span>`).join('')}
</div></div>
<div style="display:flex;gap:8px;margin:12px 14px 0">${[z.down, z.sunset, z.dusk]
    .map((pair, i) => `<div class="g-card" style="flex:1;padding:10px 12px">${i === 1 ? `<div style="height:22px;margin:-2px 0 2px">${icon.sun.replace('width="28" height="28"', 'width="22" height="22"')}</div>` : `<div style="height:22px;margin:-2px 0 2px;color:#4F625B">${i === 0 ? icon.peak.replace('width="30" height="30"', 'width="22" height="22"') : icon.cloud}</div>`}<div style="font-weight:900;font-size:20px">${esc(pair[1])}</div><div style="font-size:12px;color:#4F625B;font-weight:600">${text(pair[0], lang)}</div></div>`)
    .join('')}</div>
<div class="g-card" style="margin:12px 14px 0">
<div class="g-row" style="padding:14px 16px"><span style="color:#2E5446">${icon.bell}</span><div style="flex:1"><b style="display:block;font-weight:800;font-size:16px">${text(z.alarm, lang)}</b><span style="font-size:12.5px;color:#4F625B;font-weight:600">${text(z.alarmNote, lang)}</span></div><span class="g-toggle g-toggle--on"></span></div>
<div class="g-row" style="padding:14px 16px;border-top:1px solid #E4D8C6"><span style="color:#2E5446">${icon.lamp}</span><div style="flex:1"><b style="display:block;font-weight:800;font-size:16px">${text(z.headlamp, lang)}</b><span style="font-size:12.5px;color:#4F625B;font-weight:600">${text(z.headlampNote, lang)}</span></div><span class="g-toggle g-toggle--on"></span></div>
</div></div>${tabs(ui, 1, lang)}</div>`;
};

export const landscapeChart = { offset: 64, width: 754, padLeft: 56, padRight: 8 };

export const profileChart = ({ width, height, labels = true, ui, lang }) => {
  const pad = { l: labels ? 56 : 0, r: 8, t: 10, b: labels ? 24 : 0 };
  const w = width - pad.l - pad.r;
  const h = height - pad.t - pad.b;
  const pts = profilePoints({ x: pad.l, y: pad.t, width: w, height: h });
  const poly = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const xOf = km => pad.l + (km / profileRange.km[1]) * w;
  const steepRects = steep
    .map(([a, b]) => `<rect x="${xOf(a).toFixed(1)}" y="${pad.t}" width="${(xOf(b) - xOf(a)).toFixed(1)}" height="${h}" fill="url(#g-hatch)"/>`)
    .join('');
  const yOf = m => pad.t + h - ((m - profileRange.height[0]) / (profileRange.height[1] - profileRange.height[0])) * h;
  const grid = labels
    ? [800, 1200, 1600]
        .map((m, i) => `<line x1="${pad.l}" x2="${width - pad.r}" y1="${yOf(m).toFixed(1)}" y2="${yOf(m).toFixed(1)}" stroke="#E4D8C6" stroke-width="1"/><text x="${pad.l - 8}" y="${(yOf(m) + 4).toFixed(1)}" text-anchor="end" font-size="11.5" font-weight="700" fill="#4F625B">${esc(ui.profil.heights[i])}</text>`)
        .join('') +
      [0, 2, 4, 6.8].map((km, i) => `<text x="${xOf(km).toFixed(1)}" y="${height - 6}" text-anchor="${i === 0 ? 'start' : i === 3 ? 'end' : 'middle'}" font-size="11.5" font-weight="700" fill="#4F625B">${esc(ui.profil.axis[i])}</text>`).join('')
    : '';
  const steepLine = steep
    .map(([a, b]) => {
      const sub = pts.filter((_, i) => {
        const km = (pts[i][0] - pad.l) / w * profileRange.km[1];
        return km >= a - 0.01 && km <= b + 0.01;
      });
      return `<polyline points="${sub.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')}" fill="none" stroke="#C8352B" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
    })
    .join('');
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" aria-hidden="true"><defs><pattern id="g-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#C8352B" fill-opacity=".06"/><line x1="0" y1="0" x2="0" y2="8" stroke="#C8352B" stroke-opacity=".22" stroke-width="3"/></pattern></defs>${grid}${steepRects}<polygon points="${pad.l},${pad.t + h} ${poly} ${width - pad.r},${pad.t + h}" fill="#A7BF73" fill-opacity=".55"/><polyline points="${poly}" fill="none" stroke="#2E5446" stroke-width="3.5" stroke-linejoin="round"/>${steepLine}</svg>`;
};

const profil = (ui, ctx) => {
  const p = ui.profil;
  const lang = ctx.lang;
  if (ctx.landscape) {
    return `<div class="g-scr" style="padding:22px 26px 0 ${landscapeChart.offset}px">
<div style="display:flex;justify-content:space-between;align-items:flex-end;gap:12px"><div><div class="g-kicker">${text(p.title, lang)}</div><b style="display:block;font-size:24px;font-weight:900;line-height:1.1;margin-top:2px">${text(p.route, lang)}</b></div>
<div style="display:flex;gap:20px">${p.summary.map(([v, l], i) => `<div class="g-stat"><b style="${i === 2 ? 'color:#C8352B' : ''}">${text(v, lang)}</b><span>${text(l, lang)}</span></div>`).join('')}</div></div>
<div style="margin-top:14px">${profileChart({ width: landscapeChart.width, height: 236, ui, lang })}</div>
<div style="display:flex;gap:10px;margin-top:4px">${p.steepNotes.map(n => `<span class="g-chip" style="height:26px"><span style="width:10px;height:10px;border-radius:2px;background:#C8352B"></span>${text(n.label, lang)} <span style="color:#C8352B">${text(n.value, lang)}</span></span>`).join('')}</div>
</div>`;
  }
  return `<div class="g-scr"><div class="g-body">
<div class="g-head"><div class="g-kicker">${text(p.title, lang)}</div><h1 class="g-title" style="font-size:26px;margin-top:4px">${text(p.route, lang)}</h1></div>
<div style="display:flex;gap:22px;margin:14px 20px">${p.summary.map(([v, l], i) => `<div class="g-stat"><b style="${i === 2 ? 'color:#C8352B' : ''}">${text(v, lang)}</b><span>${text(l, lang)}</span></div>`).join('')}</div>
<div class="g-card" style="margin:0 14px;padding:10px 6px 6px">${profileChart({ width: 350, height: 250, ui, lang })}</div>
<div class="g-card" style="margin:12px 14px 0">${p.steepNotes
    .map((n, i) => `<div class="g-row" style="padding:13px 16px;${i ? 'border-top:1px solid #E4D8C6' : ''}"><span style="width:12px;height:12px;border-radius:3px;background:#C8352B"></span><b style="flex:1;font-weight:800">${text(n.label, lang)}</b><span style="font-weight:800;color:#C8352B">${text(n.value, lang)}</span></div>`)
    .join('')}</div></div>${tabs(ui, 1, lang)}</div>`;
};

const grani = (ui, ctx) => {
  const g = ui.grani;
  const lang = ctx.lang;
  const max = 50;
  const tile = (ic, pair, extra = '') =>
    `<div class="g-card" style="flex:1;padding:12px 14px"><div style="display:flex;align-items:center;gap:6px;color:#4F625B;font-size:12.5px;font-weight:700">${ic}${text(pair[0], lang)}</div><div style="margin-top:6px"><b style="font-size:28px;font-weight:900">${esc(pair[1])}</b> <span style="font-weight:700;color:#4F625B">${text(pair[2], lang)}</span></div>${extra}</div>`;
  return `<div class="g-scr"><div class="g-body">
<div class="g-head"><h1 class="g-title">${text(g.title, lang)}</h1><p class="g-lead">${text(g.place, lang)} · ${text(g.time, lang)}</p></div>
<div style="margin:14px 14px 0;padding:16px 18px;border-radius:20px;background:#17302A;color:#FFFDF8;display:flex;align-items:center;gap:16px">
<svg width="74" height="74" viewBox="0 0 74 74"><circle cx="37" cy="37" r="34" fill="none" stroke="#FFFDF8" stroke-opacity=".25" stroke-width="2"/><path d="M37 37 64 37" stroke="#F4CDA5" stroke-width="0"/><g transform="rotate(90 37 37)"><path d="M37 10 46 40 37 34 28 40Z" fill="#F4CDA5"/></g><text x="37" y="10" text-anchor="middle" font-size="9" font-weight="800" fill="#FFFDF8" opacity=".7">N</text></svg>
<div style="flex:1"><div style="font-weight:700;font-size:13px;opacity:.85">${text(g.wind[0], lang)}, ${text(g.wind[3], lang)}</div><div><b style="font-size:46px;font-weight:900;line-height:1">${esc(g.wind[1])}</b> <span style="font-weight:700">${esc(g.wind[2])}</span></div><div style="font-weight:700;font-size:15px;color:#F4CDA5">${text(g.gust[0], lang)} ${esc(g.gust[1])} ${esc(g.gust[2])}</div></div></div>
<div style="display:flex;gap:8px;margin:8px 14px 0">${tile(icon.eye, g.visibility)}${tile(icon.cloud, g.cloud)}</div>
<div class="g-card" style="margin:8px 14px 0;padding:12px 14px 10px"><div style="font-size:12.5px;font-weight:700;color:#4F625B">${text(g.hoursLabel, lang)}</div>
<div style="display:flex;align-items:flex-end;gap:10px;height:86px;margin-top:8px">${g.hourWind
    .map((v, i) => `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px"><span style="font-size:12px;font-weight:800">${v}</span><span style="width:100%;height:${(v / max) * 54}px;border-radius:6px 6px 2px 2px;background:${i === 2 ? '#2E5446' : v >= 40 ? '#C8352B' : '#AFC3CB'}"></span><span style="font-size:11.5px;color:#4F625B;font-weight:700">${esc(g.hours[i])}:00</span></div>`)
    .join('')}</div></div>
<div class="g-card" style="margin:8px 14px 0;padding:12px 14px;display:flex;gap:10px;align-items:flex-start;box-shadow:0 0 0 1.5px #C8352B">${icon.warn}<span style="font-weight:700;font-size:14px">${text(g.advice, lang)}</span></div>
</div>${tabs(ui, 0, lang)}</div>`;
};

const dziennik = (ui, ctx) => {
  const d = ui.dziennik;
  const lang = ctx.lang;
  return `<div class="g-scr"><div class="g-body">
<div class="g-head" style="display:flex;justify-content:space-between;align-items:baseline"><h1 class="g-title">${text(d.title, lang)}</h1><span class="g-chip">${esc(d.year)}</span></div>
<div style="display:flex;gap:8px;margin:14px 14px 12px">${d.summary.map(([v, l]) => `<div class="g-card" style="flex:1;padding:10px 12px"><div style="font-weight:900;font-size:21px">${text(v, lang)}</div><div style="font-size:12px;color:#4F625B;font-weight:600">${text(l, lang)}</div></div>`).join('')}</div>
<div style="display:flex;flex-direction:column;gap:8px;margin:0 14px">${d.entries
    .map(
      e => `<div class="g-card g-row" style="padding:10px 12px;align-items:flex-start">${icon.peak}<div style="flex:1;min-width:0"><div style="display:flex;justify-content:space-between;gap:8px"><b style="font-size:16px;font-weight:900">${text(e.peak, lang)}</b><span style="font-weight:800;font-size:14px">${esc(e.height)}</span></div><div style="font-size:12.5px;color:#4F625B;font-weight:600">${text(e.date, lang)} · ${text(e.range, lang)}</div><div style="font-size:13px;font-weight:700;margin-top:2px">${text(e.route, lang)}</div></div></div>`,
    )
    .join('')}</div></div>${tabs(ui, 3, lang)}</div>`;
};

const trasa = (ui, ctx) => {
  const t = ui.trasa;
  const lang = ctx.lang;
  return `<div class="g-scr"><div class="g-body">
<div style="display:flex;align-items:center;gap:8px;padding:4px 20px;color:#2E5446;font-weight:800">${icon.back}${text(t.back, lang)}</div>
<div class="g-head" style="padding-top:8px"><h1 class="g-title" style="font-size:26px">${text(t.title, lang)}</h1><p class="g-lead">${text(t.date, lang)}</p></div>
<div style="margin:12px 14px 0;padding:14px 16px;border-radius:18px;background:#2E5446;color:#FFFDF8"><b style="font-size:40px;font-weight:900;line-height:1">${text(t.total, lang)}</b><div style="font-weight:600;font-size:14px;opacity:.88;margin-top:4px">${text(t.totalNote, lang)}</div>
<div style="display:flex;gap:22px;margin-top:10px">${t.stats.map(([v, l]) => `<div class="g-stat"><b style="font-size:18px">${text(v, lang)}</b><span style="color:#FFFDF8;opacity:.8">${text(l, lang)}</span></div>`).join('')}</div></div>
<div class="g-card" style="margin:12px 14px 0">${t.legs
    .map((leg, i) => `<div class="g-row" style="padding:10px 14px;${i ? 'border-top:1px solid #E4D8C6' : ''}">${mark(leg.trail)}<div style="flex:1;min-width:0"><b style="display:block;font-weight:800;font-size:15px">${text(leg.from, lang)}</b><span style="font-size:12px;color:#4F625B;font-weight:600">${esc(leg.height)}${leg.sign ? ` · ${text(leg.sign, lang)}` : ''}</span></div><span style="font-weight:800;font-size:14px">${text(leg.you, lang)}</span></div>`)
    .join('')}</div></div>
<div style="position:absolute;inset:0;background:rgba(23,48,42,.38)"></div>
<div style="position:absolute;left:0;right:0;bottom:0;padding:0 20px 30px;border-radius:26px 26px 0 0;background:#FFFDF8">
<div class="g-handle"></div>
<div class="g-kicker">${text(t.paceTitle, lang)}</div>
<b style="display:block;font-size:26px;font-weight:900;margin-top:4px">${text(t.paceValue, lang)}</b>
<p style="margin:6px 0 14px;color:#4F625B;font-weight:600;font-size:14px">${text(t.paceNote, lang)}</p>
<div style="display:flex;padding:4px;border-radius:14px;background:#EFE4D3">${t.paceOptions.map((o, i) => `<span style="flex:1;display:flex;align-items:center;justify-content:center;height:40px;border-radius:10px;font-weight:800;font-size:14px;${i === t.paceActive ? 'background:#2E5446;color:#FFFDF8' : 'color:#17302A'}">${text(o, lang)}</span>`).join('')}</div>
<div style="margin-top:8px">${[t.uphill, t.downhill, t.breaks].map((pair, i) => `<div class="g-row" style="justify-content:space-between;padding:11px 2px;${i ? 'border-top:1px solid #E4D8C6' : ''}"><span style="font-weight:700">${text(pair[0], lang)}</span><b style="font-weight:900">${text(pair[1], lang)}</b></div>`).join('')}</div>
<div class="g-btn" style="margin-top:10px">${text(t.save, lang)}</div>
</div></div>`;
};

export const screens = { mapa, offline, zmrok, profil, grani, dziennik, trasa };

export const renderScreen = (id, ui, ctx) => {
  const fn = screens[id];
  if (!fn) throw new Error(`gran: unknown screen ${id}`);
  return fn(ui, { top: ctx.store === 'play' ? 36 : 50, ...ctx });
};
