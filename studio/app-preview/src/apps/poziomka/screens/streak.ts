import { C } from '../tokens';
import { streak } from '../content';
import { T, blinkOn, walkPose } from '../timeline';
import { FB, text } from '../pixel/fb';
import * as S from '../pixel/sprites';
import { header, shade, groundShadow, statusBar, tabBar, W } from '../pixel/ui';
import { berryPose } from './levelup';

const tileX = (col: number) => 11 + col * 29;
const tileY = (row: number) => 128 + row * 29;

export const flipped = (f: number, still: boolean) => (still ? 21 : Math.max(0, Math.min(21, Math.floor((f - T.tilesFrom) / T.tileStep) + 1)));

export const drawStreak = (fb: FB, f: number, opts: { still?: boolean } = {}) => {
  const still = Boolean(opts.still);
  fb.rect(0, 0, W, fb.h, C.sky);
  statusBar(fb, streak.time);
  header(fb, streak.title, 'Od 18 września bez przerwy');
  const count = flipped(f, still);
  shade(fb, 10, 54, 201, 50);
  fb.panel(10, 54, 201, 50, C.plum, C.ink);
  fb.sprite(18, 62, S.tabIcons.streak, { ...S.ink }, { scale: 3 });
  text(fb, 82, 64, String(count), { font: 'pixel', scale: 2, color: C.gold, outline: C.ink, align: 'right' });
  text(fb, 90, 66, count === 1 ? 'DZIEŃ' : 'DNI', { color: C.gold });
  text(fb, 90, 78, 'Z RZĘDU', { color: C.cream });
  text(fb, 204, 66, 'REKORD', { color: C.berryLight, align: 'right' });
  text(fb, 204, 78, '21 DNI', { color: C.cream, align: 'right' });
  fb.panel(6, 110, 209, 116, C.cream, C.ink, C.gold);
  streak.weekdays.forEach((day, col) => text(fb, tileX(col) + 13, 117, day, { color: C.dusk, align: 'center' }));
  streak.dates.forEach((day, i) => {
    const col = i % 7;
    const row = Math.floor(i / 7);
    const x = tileX(col);
    const y = tileY(row);
    const at = T.tilesFrom + i * T.tileStep;
    const isToday = i === 20;
    const turning = !still && f >= at && f < at + 2;
    const done = still || f >= at + 2;
    if (turning) {
      fb.rect(x + 8, y, 10, 26, C.ink);
      fb.rect(x + 9, y + 1, 8, 24, isToday ? C.gold : C.berryLight);
      return;
    }
    if (!done) {
      fb.panel(x, y, 26, 26, C.sky, C.stone);
      text(fb, x + 13, y + 10, String(day), { color: C.dusk, align: 'center' });
      return;
    }
    const lit = isToday && !still && !blinkOn(f, at + 2, 3);
    fb.panel(x, y, 26, 26, isToday ? (lit ? C.cream : C.gold) : C.cream, C.ink, isToday ? C.berryDeep : C.berryLight);
    fb.sprite(x + 9, y + 3, S.mini, S.ink);
    text(fb, x + 13, y + 15, String(day), { color: C.ink, align: 'center' });
  });
  text(fb, 12, 234, streak.rule, { color: C.dusk });
  fb.panel(10, 248, 201, 36, C.cream, C.ink, C.gold);
  fb.sprite(20, 258, S.lock, S.ink, { scale: 2 });
  text(fb, 42, 256, 'NASTĘPNA NAGRODA', { color: C.dusk });
  text(fb, 42, 268, streak.next, { color: C.ink });
  const banner = still || f >= T.streakBanner;
  const ground = 430;
  const pose = berryPose(f);
  const art = banner ? (walkPose(f) % 2 === 0 ? S.berryCheer : S.berry) : pose.art;
  const rise = banner ? (walkPose(f) % 2 === 0 ? 0 : 3) : pose.rise;
  groundShadow(fb, W / 2, ground - 1, rise >= 5 ? 28 : rise >= 3 ? 34 : 42, C.skyMid);
  fb.sprite(W / 2 - 24, ground - 54 - rise * 3, art, S.ink, { scale: 3 });
  if (banner && (still || blinkOn(f, T.streakBanner, 2))) {
    shade(fb, 14, 298, 193, 30);
    fb.panel(14, 298, 193, 30, C.gold, C.ink, C.berryDeep);
    text(fb, W / 2, 306, 'PASSA: 21 DNI', { font: 'pixel', color: C.ink, align: 'center' });
  }
  tabBar(fb, 'streak');
};
