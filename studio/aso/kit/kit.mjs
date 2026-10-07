export const SCREEN = { width: 390, height: 844, status: 50 };

const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => entities[ch]);

const shortWords = {
  pl: ['a', 'i', 'o', 'u', 'w', 'z', 'A', 'I', 'O', 'U', 'W', 'Z'],
  en: ['a', 'A', 'I'],
};

export const glue = (text, lang = 'pl') => {
  const words = shortWords[lang] ?? shortWords.pl;
  return String(text)
    .split(' ')
    .reduce((out, word, index, all) => {
      if (index === all.length - 1) return out + word;
      return out + word + (words.includes(word) ? ' ' : ' ');
    }, '');
};

export const text = (value, lang) => esc(glue(value, lang));

const px = value => `${Math.round(value * 100) / 100}px`;

export const styleOf = props =>
  Object.entries(props)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${key}:${typeof value === 'number' ? px(value) : value}`)
    .join(';');

const signal = color =>
  `<svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true"><rect x="0" y="8" width="3" height="4" rx="1" fill="${color}"/><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="${color}"/><rect x="10" y="3" width="3" height="9" rx="1" fill="${color}"/><rect x="15" y="0" width="3" height="12" rx="1" fill="${color}"/></svg>`;

const wifi = color =>
  `<svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true"><path d="M8 11.6 5.6 9.1a3.4 3.4 0 0 1 4.8 0Z" fill="${color}"/><path d="M3.4 6.9a6.5 6.5 0 0 1 9.2 0l-1.4 1.4a4.5 4.5 0 0 0-6.4 0Z" fill="${color}"/><path d="M1.1 4.6a9.8 9.8 0 0 1 13.8 0l-1.4 1.4a7.8 7.8 0 0 0-11 0Z" fill="${color}"/></svg>`;

const battery = color =>
  `<svg width="27" height="13" viewBox="0 0 27 13" aria-hidden="true"><rect x="0.5" y="0.5" width="23" height="12" rx="3.5" fill="none" stroke="${color}" stroke-opacity="0.45"/><rect x="2" y="2" width="20" height="9" rx="2" fill="${color}"/><path d="M25 4.5v4a2 2 0 0 0 0-4Z" fill="${color}" fill-opacity="0.5"/></svg>`;

const batteryUpright = color =>
  `<svg width="9" height="15" viewBox="0 0 9 15" aria-hidden="true"><rect x="2.8" y="0" width="3.4" height="2" rx="0.6" fill="${color}"/><rect x="0" y="1.6" width="9" height="13.4" rx="1.6" fill="${color}"/></svg>`;

const signalTriangle = color =>
  `<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M14 0v14H0Z" fill="${color}"/></svg>`;

const wifiFan = color =>
  `<svg width="16" height="13" viewBox="0 0 16 13" aria-hidden="true"><path d="M8 13 0 3.4A12.3 12.3 0 0 1 16 3.4Z" fill="${color}"/></svg>`;

export const statusBar = (kind = 'ios', { color = '#111', background = 'transparent', time = '9:30' } = {}) => {
  if (kind === 'neutral') {
    return `<div class="kit-status kit-status--neutral" style="${styleOf({ color, background })}"><span class="kit-status__time">${time}</span><span class="kit-status__icons">${wifiFan(color)}${signalTriangle(color)}${batteryUpright(color)}</span></div>`;
  }
  return `<div class="kit-status kit-status--ios" style="${styleOf({ color, background })}"><span class="kit-status__time">${time}</span><span class="kit-status__icons">${signal(color)}${wifi(color)}${battery(color)}</span></div>`;
};

export const phoneGeometry = (width, landscape = false) => {
  const bezel = width * (landscape ? 0.017 : 0.036);
  const inner = width - bezel * 2;
  const scale = inner / (landscape ? SCREEN.height : SCREEN.width);
  const innerHeight = (landscape ? SCREEN.width : SCREEN.height) * scale;
  return { bezel, scale, width, height: innerHeight + bezel * 2, innerWidth: inner, innerHeight };
};

export const phone = ({
  screen,
  width,
  x,
  y,
  rotate = 0,
  landscape = false,
  name = 'phone',
  status = 'ios',
  statusColor = '#111',
  statusBackground = 'transparent',
  shadow = true,
  className = '',
  body = '#22262A',
}) => {
  const g = phoneGeometry(width, landscape);
  const radius = (landscape ? g.height : g.width) * 0.15;
  const screenW = landscape ? SCREEN.height : SCREEN.width;
  const screenH = landscape ? SCREEN.width : SCREEN.height;
  const innerRadius = radius - g.bezel;
  const island = landscape
    ? `<span class="kit-phone__cam" style="${styleOf({ left: g.bezel + 12 * g.scale, top: g.height / 2 - 38 * g.scale, width: 26 * g.scale, height: 76 * g.scale })}"></span>`
    : `<span class="kit-phone__cam" style="${styleOf({ top: g.bezel + 12 * g.scale, left: g.width / 2 - 38 * g.scale, width: 76 * g.scale, height: 24 * g.scale })}"></span>`;
  const buttons = landscape
    ? `<span class="kit-phone__btn" style="${styleOf({ top: -2.2 * g.scale * 2, left: g.width * 0.22, width: g.width * 0.07, height: 3 * g.scale * 2 })}"></span><span class="kit-phone__btn" style="${styleOf({ top: -2.2 * g.scale * 2, left: g.width * 0.32, width: g.width * 0.07, height: 3 * g.scale * 2 })}"></span><span class="kit-phone__btn" style="${styleOf({ bottom: -2.2 * g.scale * 2, left: g.width * 0.3, width: g.width * 0.11, height: 3 * g.scale * 2 })}"></span>`
    : `<span class="kit-phone__btn" style="${styleOf({ left: -2.2 * g.scale * 2, top: g.height * 0.2, width: 3 * g.scale * 2, height: g.height * 0.07 })}"></span><span class="kit-phone__btn" style="${styleOf({ left: -2.2 * g.scale * 2, top: g.height * 0.3, width: 3 * g.scale * 2, height: g.height * 0.07 })}"></span><span class="kit-phone__btn" style="${styleOf({ right: -2.2 * g.scale * 2, top: g.height * 0.26, width: 3 * g.scale * 2, height: g.height * 0.11 })}"></span>`;
  const statusHtml = status ? statusBar(status, { color: statusColor, background: statusBackground }) : '';
  return `<div class="kit-phone ${className}${shadow ? ' kit-phone--shadow' : ''}" data-box="fg" data-name="${esc(name)}" style="${styleOf({
    left: x,
    top: y,
    width: g.width,
    height: g.height,
    'border-radius': px(radius),
    transform: rotate ? `rotate(${rotate}deg)` : undefined,
    background: body,
  })}">${buttons}<div class="kit-phone__glass" style="${styleOf({
    left: g.bezel,
    top: g.bezel,
    width: g.innerWidth,
    height: g.innerHeight,
    'border-radius': px(innerRadius),
  })}"><div class="kit-screen${landscape ? ' kit-screen--landscape' : ''}" style="${styleOf({
    width: screenW,
    height: screenH,
    transform: `scale(${g.scale})`,
  })}">${landscape ? '' : statusHtml}${screen}</div></div>${island}</div>`;
};

export const card = ({ screen, width, x, y, rotate = 0, landscape = false, name = 'card', status = 'neutral', statusColor = '#111', statusBackground = 'transparent', radius = 22, className = '', shadow = true }) => {
  const screenW = landscape ? SCREEN.height : SCREEN.width;
  const screenH = landscape ? SCREEN.width : SCREEN.height;
  const scale = width / screenW;
  const height = screenH * scale;
  return `<div class="kit-card ${className}${shadow ? ' kit-card--shadow' : ''}" data-box="fg" data-name="${esc(name)}" style="${styleOf({
    left: x,
    top: y,
    width,
    height,
    'border-radius': px(radius * scale * 1.6),
    transform: rotate ? `rotate(${rotate}deg)` : undefined,
  })}"><div class="kit-screen${landscape ? ' kit-screen--landscape' : ''}" style="${styleOf({ width: screenW, height: screenH, transform: `scale(${scale})` })}">${status && !landscape ? statusBar(status, { color: statusColor, background: statusBackground }) : ''}${screen}</div></div>`;
};

export const cardHeight = width => (SCREEN.height * width) / SCREEN.width;

export const headline = ({ value, lang, x, y, width, size, className = '', name = 'headline', align = 'left', color, sub, subClass = '' }) =>
  `<div class="kit-headline ${className}" data-box="headline" data-name="${esc(name)}" style="${styleOf({
    left: x,
    top: y,
    width,
    'font-size': size,
    'text-align': align,
    color,
  })}">${text(value, lang)}</div>${sub ? `<div class="kit-sub ${subClass}" data-box="sub" style="${styleOf({ left: x, width, 'text-align': align, color, ...sub.style })}">${text(sub.value, lang)}</div>` : ''}`;

export const kitCss = `
*,*::before,*::after{box-sizing:border-box}
html,body{margin:0;padding:0}
body{position:relative;overflow:hidden;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}
.kit-layer{position:absolute;left:0;top:0;pointer-events:none}
.kit-layer svg{display:block}
.kit-phone{position:absolute;transform-origin:50% 50%}
.kit-phone--shadow{box-shadow:0 1px 0 1px rgba(255,255,255,.08) inset,0 18px 40px -18px rgba(10,20,18,.55)}
.kit-phone__glass{position:absolute;overflow:hidden;background:#fff;isolation:isolate}
.kit-phone__cam{position:absolute;background:#0b0c0d;border-radius:999px;z-index:3}
.kit-phone__btn{position:absolute;background:inherit;border-radius:3px;background:#1a1d20}
.kit-screen{position:absolute;left:0;top:0;transform-origin:0 0;overflow:hidden}
.kit-card{position:absolute;overflow:hidden;transform-origin:50% 50%;background:#fff}
.kit-card--shadow{box-shadow:0 14px 34px -16px rgba(10,20,18,.5),0 0 0 1px rgba(10,20,18,.08)}
.kit-status{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;height:50px;padding:16px 30px 0 40px;font-weight:600;font-size:16px;letter-spacing:.01em;font-variant-numeric:tabular-nums}
.kit-status__icons{display:flex;align-items:center;gap:6px}
.kit-status--neutral{height:36px;padding:8px 22px 0 24px;font-weight:600;font-size:14px}
.kit-status--neutral .kit-status__icons{gap:7px}
.kit-headline{position:absolute;hyphens:none;overflow-wrap:normal;word-break:keep-all;text-wrap:balance}
.kit-sub{position:absolute;hyphens:none;text-wrap:balance}
`;

export const documentHtml = ({ lang, width, height, fontCss, themeCss = '', css = '', body, background = '#fff' }) =>
  `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>${fontCss}\n${kitCss}\n${themeCss}\n${css}\nbody{width:${width}px;height:${height}px;background:${background}}</style></head><body>${body}</body></html>`;
