import { C, walkHeights } from '../tokens';
import { level } from '../content';
import { T, blinkOn, walkPose } from '../timeline';
import { FB, text } from '../pixel/fb';
import * as S from '../pixel/sprites';
import { H, W, coinPop, groundShadow, homeIndicator, statusBar, xpBar } from '../pixel/ui';

export const berryPose = (f: number) => {
  const pose = walkPose(f);
  const tickN = Math.floor(f / 4);
  const blink = ((tickN % 16) + 16) % 16 === 13;
  if (pose === 0) return { art: S.berrySquash, rise: 0 };
  return { art: blink ? S.berryBlink : S.berry, rise: walkHeights[pose] };
};

export const rays = (fb: FB, cx: number, cy: number, f: number, a: number, b: number, y0 = 0, y1 = fb.h) => {
  const turn = Math.floor((f + 4) / 8);
  for (let y = y0; y < y1; y += 1)
    for (let x = 0; x < fb.w; x += 1) {
      const angle = Math.atan2(y - cy, x - cx);
      const bucket = Math.floor(((angle + Math.PI) / (2 * Math.PI)) * 24 + turn / 3);
      fb.set(x, y, ((bucket % 2) + 2) % 2 === 0 ? a : b);
    }
};

export const sparkles = (fb: FB, f: number, spots: [number, number][]) => {
  const tickN = Math.floor(f / 4);
  spots.forEach(([x, y], i) => {
    const phase = (((tickN + i * 3) % 8) + 8) % 8;
    if (phase < 2) fb.sprite(x - 2, y - 2, S.sparkle, S.ink);
    else if (phase < 4) fb.sprite(x - 1, y - 1, S.sparkleSmall, S.ink);
  });
};

export const drawLevelUp = (fb: FB, f: number, opts: { coins?: boolean } = {}) => {
  const cx = Math.floor(W / 2);
  rays(fb, cx, 190, f, C.plum, C.dusk);
  fb.rect(0, 0, W, 18, C.plum);
  statusBar(fb, '7:42', true);
  text(fb, cx, 40, 'NOWY POZIOM', { color: C.gold, align: 'center' });
  text(fb, cx + 1, 56, 'POZIOM 8!', { font: 'pixel', scale: 2, color: C.gold, outline: C.ink, align: 'center' });
  sparkles(fb, f, [
    [28, 60],
    [196, 52],
    [38, 120],
    [186, 132],
    [24, 206],
    [200, 216],
  ]);
  const { art, rise } = berryPose(f);
  const scale = 5;
  const bw = 16 * scale;
  const ground = 250;
  groundShadow(fb, cx, ground - 1, rise >= 5 ? 46 : rise >= 3 ? 58 : 72, C.ink);
  fb.sprite(cx - bw / 2, ground - 18 * scale - rise * scale, art, S.ink, { scale });
  if (opts.coins !== false) {
    const [a, b] = T.hookCoins;
    const cycle = (t: number) => ((t % 40) + 40) % 40;
    coinPop(fb, 30, 176, cycle(f - a), '+30 XP');
    coinPop(fb, 160, 148, cycle(f - b), '+10 XP');
  }
  fb.panel(16, 266, W - 32, 46, C.cream, C.ink, C.gold);
  text(fb, 26, 274, 'POZIOM 8', { color: C.ink });
  text(fb, W - 26, 274, `${level.to} / ${level.to} XP`, { color: C.dusk, align: 'right' });
  xpBar(fb, 26, 288, 169, 169, blinkOn((((f + 6) % 48) + 48) % 48, 0, 4));
  text(fb, 26, 300, 'Do poziomu 9: 200 XP', { color: C.dusk });
  fb.panel(16, 318, W - 32, 40, C.plum, C.ink);
  fb.sprite(26, 328, S.plantStages.sadzonka.slice(2, 14), S.ink);
  text(fb, 48, 326, 'NAGRODA ZA POZIOM 8', { color: C.gold });
  text(fb, 48, 340, 'Nowa grządka w ogródku', { color: C.cream });
  fb.panel(56, 414, W - 112, 22, C.gold, C.ink, C.berryDeep);
  text(fb, cx, 420, 'DALEJ', { font: 'pixel', color: C.ink, align: 'center' });
  homeIndicator(fb, C.cream);
  return { w: W, h: H };
};
