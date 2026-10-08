export const months = 61;

export const shownFrom = 24;

const bump = (i, c, w) => Math.exp(-(((i - c) / w) ** 2));

const raw = i => 0.47 + 0.53 * (i / 60) ** 1.08 - 0.04 * bump(i, 11, 4.5) - 0.022 * bump(i, 41, 2.6) - 0.012 * bump(i, 52, 1.8) + 0.006 * Math.sin(i * 1.7) + 0.004 * Math.sin(i * 0.63 + 1);

export const shape = Array.from({ length: months }, (_, i) => raw(i) / raw(months - 1));

export const seriesFor = total => shape.map(v => Math.round(v * total));
