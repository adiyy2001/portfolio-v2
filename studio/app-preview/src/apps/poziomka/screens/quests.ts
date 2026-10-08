import { C } from '../tokens';
import { barPixels, habits, level, today, type Habit } from '../content';
import { T, blinkOn } from '../timeline';
import { FB, text } from '../pixel/fb';
import * as S from '../pixel/sprites';
import { chip, header, shade, coinPop, levelStrip, statusBar, tabBar, W } from '../pixel/ui';

export const rowY = (i: number) => 100 + i * 48;

const fillPx = (f: number) => {
  const start = barPixels(level.start);
  const afterWater = barPixels(level.start + 10);
  const afterWalk = barPixels(level.start + 40);
  let px = start;
  if (f >= T.tapWater + 2) px = Math.min(afterWater, start + (f - T.tapWater - 2) + 1);
  if (f >= T.tapWalk + 2) px = Math.min(afterWalk, afterWater + (f - T.tapWalk - 2) + 1);
  return px;
};

export const questState = (f: number) => {
  const done: Habit['id'][] = [];
  if (f >= T.tapWater) done.push('water');
  if (f >= T.tapWalk) done.push('walk');
  const levelled = f >= T.levelUp;
  const px = levelled ? barPixels(1200, 1200, level.nextTo) : fillPx(f);
  const xp = levelled ? 1200 : Math.round(level.from + (px / level.barWidth) * (level.to - level.from));
  return { done, levelled, px, xp };
};

const questRow = (fb: FB, habit: Habit, i: number, done: boolean, pressed: boolean) => {
  const y = rowY(i);
  const fill = done ? C.sprout : C.cream;
  shade(fb, 10, y, 201, 42);
  fb.panel(10, y, 201, 42, fill, C.ink, done ? C.leaf : C.gold);
  fb.panel(16, y + 9, 22, 22, done ? C.cream : C.sky, C.ink);
  fb.sprite(21, y + 14, S.habitIcons[habit.id], S.ink);
  text(fb, 44, y + 9, habit.title, { color: C.ink });
  text(fb, 44, y + 21, habit.when, { color: C.dusk });
  fb.sprite(194, y + 7 + (pressed ? 1 : 0), done ? S.checkOn : S.check, S.ink);
  chip(fb, 204, y + 24, `+${habit.xp} XP`, done ? C.cream : C.gold);
};

export const drawQuests = (fb: FB, f: number, opts: { still?: boolean } = {}) => {
  fb.rect(0, 0, W, fb.h, C.sky);
  statusBar(fb, today.time);
  header(fb, today.title, today.date);
  const state = opts.still ? { done: today.done, levelled: true, px: barPixels(1200, 1200, level.nextTo), xp: 1200 } : questState(f);
  const blinking = !opts.still && f >= T.fullBlink && f < T.levelUp;
  const flash = !opts.still && f >= T.levelUp && f < T.levelUp + 12 && blinkOn(f, T.levelUp, 1) === false;
  if (state.levelled)
    levelStrip(fb, 54, level.next, `${state.xp} / ${level.nextTo} XP`, state.px, true, flash);
  else levelStrip(fb, 54, level.current, `${state.xp} / ${level.to} XP`, state.px, !blinking || blinkOn(f, T.fullBlink));
  habits.forEach((habit, i) => {
    const tap = habit.id === 'water' ? T.tapWater : habit.id === 'walk' ? T.tapWalk : -999;
    const pressed = !opts.still && f >= tap - 4 && f < tap;
    questRow(fb, habit, i, state.done.includes(habit.id), pressed);
  });
  const doneXp = habits.filter(h => state.done.includes(h.id)).reduce((s, h) => s + h.xp, 0);
  fb.panel(10, 296, 201, 60, C.plum, C.ink);
  text(fb, 20, 304, 'DZIŚ', { color: C.gold });
  text(fb, 20, 316, `Odhaczone: ${state.done.length} z ${habits.length}`, { color: C.cream });
  text(fb, 20, 328, `Zdobyte: +${doneXp} XP z 100`, { color: C.cream });
  for (let i = 0; i < habits.length; i += 1) {
    const on = i < state.done.length;
    fb.panel(142 + i * 16, 314, 12, 12, on ? C.gold : C.dusk, C.ink);
    if (on) fb.rect(145 + i * 16, 317, 2, 2, C.cream);
  }
  text(fb, 20, 340, 'Wieczorem: książka i telefon', { color: C.berryLight });
  const left = state.levelled ? level.nextTo - state.xp : level.to - state.xp;
  fb.panel(10, 366, 201, 50, C.cream, C.ink, C.gold);
  fb.sprite(20, 376, S.plantStages.sadzonka.slice(2, 14), S.ink);
  text(fb, 42, 376, state.levelled ? 'POZIOM 9 ZA' : left > 0 ? 'POZIOM 8 ZA' : 'MASZ 1200 XP', { color: C.dusk });
  text(fb, 42, 388, left > 0 ? `${left} XP` : 'POZIOM 8!', { font: 'pixel', color: C.ink });
  text(fb, 204, 394, state.levelled ? 'nowe nasiona' : 'nowa grządka', { color: C.dusk, align: 'right' });
  if (!opts.still) {
    coinPop(fb, 198, rowY(0) + 8, f - T.tapWater, '+10 XP', 'left');
    coinPop(fb, 198, rowY(1) + 8, f - T.tapWalk, '+30 XP', 'left');
  }
  if (state.levelled && !opts.still && f < T.levelUp + 14) {
    const y = 268;
    shade(fb, 40, y, 140, 22);
    fb.panel(40, y, 140, 22, C.gold, C.ink, C.berryDeep);
    text(fb, 110, y + 6, '+1 POZIOM', { font: 'pixel', color: C.ink, align: 'center' });
  }
  tabBar(fb, 'quests');
};
