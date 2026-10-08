import type { Overlay } from '../../../shared/types';
import { C } from '../tokens';
import { tabs, type TabId } from '../content';
import { FB, balance, dithered, measure, text } from './fb';
import * as S from './sprites';

export const W = 221;
export const H = 480;
export const TAB_Y = 438;

export const statusBar = (fb: FB, time: string, light = false) => {
  const c = light ? C.cream : C.ink;
  text(fb, 14, 7, time, { color: c });
  const x = 165;
  [2, 3, 4, 5].forEach((h, i) => fb.rect(x + i * 3, 12 - h, 2, h, c));
  const map = { k: c, g: c };
  fb.sprite(x + 14, 7, S.statusWifi, map);
  fb.rect(x + 25, 7, 13, 6, c);
  fb.rect(x + 26, 8, 11, 4, light ? C.plum : C.sky);
  fb.rect(x + 27, 9, 7, 2, c);
  fb.rect(x + 38, 9, 1, 2, c);
};

export const homeIndicator = (fb: FB, c: number = C.cream) => fb.rect(W / 2 - 24, 474, 48, 2, c);

export const tabBar = (fb: FB, active: TabId) => {
  fb.rect(0, TAB_Y, W, H - TAB_Y, C.plum);
  fb.rect(0, TAB_Y, W, 1, C.ink);
  const cell = Math.floor(W / tabs.length);
  tabs.forEach((tab, i) => {
    const x0 = i * cell + (i > 1 ? 1 : 0);
    const cx = x0 + Math.floor(cell / 2);
    const on = tab.id === active;
    if (on) fb.panel(x0 + 4, TAB_Y + 4, cell - 8, 28, C.dusk, C.ink);
    fb.sprite(cx - 5, TAB_Y + 8, S.tabIcons[tab.id], { ...S.ink, k: C.ink, c: C.cream });
    text(fb, cx, TAB_Y + 21, tab.label, { color: on ? C.gold : C.cream, align: 'center' });
  });
  homeIndicator(fb);
};

export const header = (fb: FB, title: string, kicker?: string) => {
  if (kicker) text(fb, 12, 22, kicker, { color: C.dusk });
  text(fb, 12, kicker ? 33 : 26, title, { font: 'pixel', color: C.ink });
};

export const xpBar = (fb: FB, x: number, y: number, px: number, width = 140, on = true) => {
  fb.rect(x - 1, y - 1, width + 2, 8, C.ink);
  fb.rect(x, y, width, 6, C.ink);
  if (px <= 0) return;
  fb.rect(x, y, px, 6, on ? C.gold : C.cream);
  fb.rect(x, y, px, 1, on ? C.cream : C.white);
  fb.rect(x, y + 5, px, 1, on ? C.berryDeep : C.gold);
};

export const levelStrip = (fb: FB, y: number, lvl: number, xpText: string, px: number, on = true, flash = false) => {
  fb.panel(10, y, 201, 34, C.plum, C.ink);
  fb.panel(16, y + 5, 26, 24, flash ? C.cream : C.gold, C.ink, C.berryDeep);
  text(fb, 29, y + 12, String(lvl), { font: 'pixel', color: C.ink, align: 'center' });
  text(fb, 50, y + 7, `POZIOM ${lvl}`, { color: C.cream });
  text(fb, 204, y + 7, xpText, { color: C.gold, align: 'right' });
  xpBar(fb, 50, y + 20, px, 140, on);
  fb.sprite(197, y + 19, S.coin[0], S.ink);
};

export const chip = (fb: FB, xRight: number, y: number, label: string, fill: number = C.gold, ink: number = C.ink) => {
  const w = measure(label) + 8;
  fb.panel(xRight - w, y, w, 11, fill, C.ink);
  text(fb, xRight - w + 4, y + 3, label, { color: ink });
  return w;
};

export const coinPop = (fb: FB, x: number, y: number, t: number, label: string, side: 'left' | 'right' = 'right', scale = 1) => {
  if (t < 0 || t >= 22) return;
  const s = scale;
  const rise = Math.min(8, Math.floor(t / 2)) * s;
  const layer = new FB(fb.w, fb.h);
  const pose = [0, 1, 2, 1][Math.floor(t / 2) % 4];
  layer.sprite(x - 4 * s, y - 10 * s - rise, S.coin[pose], S.ink, { scale: s });
  const ty = y - 9 * s - rise;
  if (side === 'right') text(layer, x + 7 * s, ty, label, { color: C.gold, outline: C.ink, scale: s });
  else text(layer, x - 7 * s, ty, label, { color: C.gold, outline: C.ink, align: 'right', scale: s });
  if (t < 2) layer.sprite(x - 2 * s, y - 2 * s, S.sparkleSmall, S.ink, { scale: s });
  const level = t >= 20 ? 6 : t >= 18 ? 11 : 16;
  fb.blit(layer, 0, 0, (sx, sy) => dithered(Math.floor(sx / s), Math.floor(sy / s), level));
};

export const fadeLevel = (t: number, from: number, to: number) => {
  if (t < from || t > to) return 0;
  const a = t - from;
  const b = to - t;
  if (a < 2 || b < 2) return 6;
  if (a < 4 || b < 4) return 11;
  return 16;
};

export const overlayLines = (overlay: Overlay) => balance(overlay.text, 186, 'pixel');

export const drawOverlay = (fb: FB, overlay: Overlay, frame: number) => {
  const level = fadeLevel(frame, overlay.from, overlay.to);
  if (!level) return;
  const lines = overlayLines(overlay);
  const top = Math.round(overlay.top / 2);
  const h = 12 + lines.length * 10 + (lines.length - 1) * 7;
  const w = Math.max(...lines.map(line => measure(line, 'pixel'))) + 20;
  const x = Math.floor((W - w) / 2);
  const layer = new FB(fb.w, fb.h);
  shade(layer, x, top, w, h);
  layer.panel(x, top, w, h, C.cream, C.ink);
  layer.rect(x + 1, top + h - 2, w - 2, 1, C.gold);
  lines.forEach((line, i) => text(layer, W / 2, top + 6 + i * 17, line, { font: 'pixel', color: C.ink, align: 'center' }));
  fb.blit(layer, 0, 0, (sx, sy) => dithered(sx, sy, level));
};

export const wipeMask = (step: number, height = H) => (x: number, y: number) => {
  if (step <= 0) return false;
  if (step >= 8) return true;
  const front = step * Math.ceil((height + 16) / 64) * 8 - 16;
  const cx = Math.floor(x / 8);
  const cy = Math.floor(y / 8);
  const top = cy * 8;
  if (top + 8 <= front) return true;
  if (top >= front + 16) return false;
  return (cx + cy) % 2 === 0;
};

export const wipeStep = (f: number, start: number) => (f < start ? 0 : Math.min(8, Math.floor((f - start) / 2) + 1));

export const shade = (fb: FB, x: number, y: number, w: number, h: number, c: number = C.ink) => {
  for (let yy = y + 2; yy < y + h + 2; yy += 1)
    for (let xx = x + 2; xx < x + w + 2; xx += 1) {
      const inside = xx < x + w && yy < y + h;
      if (!inside && (xx + yy) % 2 === 0) fb.set(xx, yy, c);
    }
};

export const groundShadow = (fb: FB, cx: number, y: number, width: number, c: number = C.dusk) => {
  const half = Math.floor(width / 2);
  fb.rect(cx - half + 2, y, width - 4, 1, c);
  fb.rect(cx - half, y + 1, width, 1, c);
  fb.rect(cx - half + 2, y + 2, width - 4, 1, c);
};
