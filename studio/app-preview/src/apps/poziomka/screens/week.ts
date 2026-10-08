import { C } from '../tokens';
import { habits, week, weekAverage, weekTotal } from '../content';
import { T } from '../timeline';
import { FB, text } from '../pixel/fb';
import { header, shade, statusBar, tabBar, W } from '../pixel/ui';

const base = 214;
const maxH = 120;
const barW = 18;
const gap = 7;
const left = 34;

const habitShort = { water: 'Woda', walk: 'Spacer', book: 'Książka', phone: 'Telefon' } as const;

export const barHeight = (xp: number) => Math.round((xp / 100) * maxH);

export const drawWeek = (fb: FB, f: number, opts: { still?: boolean } = {}) => {
  const still = Boolean(opts.still);
  fb.rect(0, 0, W, fb.h, C.sky);
  statusBar(fb, week.time);
  header(fb, week.title, week.range);
  shade(fb, 8, 56, 203, 184);
  fb.panel(8, 56, 203, 184, C.cream, C.ink, C.gold);
  text(fb, 16, 64, 'XP DZIENNIE', { color: C.dusk });
  for (const xp of [25, 50, 75, 100]) {
    const y = base - barHeight(xp);
    for (let x = 32; x < 206; x += 3) fb.set(x, y, C.stone);
    text(fb, 28, y - 2, String(xp), { color: C.dusk, align: 'right' });
  }
  fb.rect(30, base, 176, 1, C.ink);
  const grown = still ? 999 : Math.max(0, f - T.bars) * T.barSpeed;
  week.days.forEach((day, i) => {
    const x = left + i * (barW + gap);
    const full = barHeight(day.xp);
    const h = Math.min(full, grown);
    const isToday = i === week.days.length - 1;
    if (h > 0) {
      fb.rect(x, base - h, barW, h, C.ink);
      fb.rect(x + 1, base - h + 1, barW - 2, h - 1, isToday ? C.gold : C.berry);
      fb.rect(x + 1, base - h + 1, 2, h - 1, isToday ? C.cream : C.berryLight);
      fb.rect(x + barW - 3, base - h + 1, 2, h - 1, isToday ? C.berryDeep : C.berryDeep);
    }
    if (h === full) text(fb, x + barW / 2, base - h - 9, String(day.xp), { color: C.ink, align: 'center' });
    text(fb, x + barW / 2, base + 5, day.label, { color: isToday ? C.ink : C.dusk, align: 'center' });
  });
  const stats: [string, string][] = [
    ['RAZEM', `${weekTotal} XP`],
    ['ŚREDNIO', `${weekAverage} XP`],
    ['PASSA', '21 DNI'],
    ['NAJCZĘŚCIEJ', 'WODA 7/7'],
  ];
  stats.forEach(([label, value], i) => {
    const x = 8 + (i % 2) * 104;
    const y = 250 + Math.floor(i / 2) * 46;
    fb.panel(x, y, 101, 40, i === 0 ? C.plum : C.cream, C.ink, i === 0 ? C.ink : C.gold);
    text(fb, x + 8, y + 7, label, { color: i === 0 ? C.gold : C.dusk });
    text(fb, x + 8, y + 19, value, { font: 'pixel', color: i === 0 ? C.cream : C.ink });
  });
  fb.panel(8, 344, 205, 86, C.cream, C.ink, C.gold);
  text(fb, 16, 351, 'KTÓRE ZADANIA I KIEDY', { color: C.dusk });
  habits.forEach((habit, r) => {
    const y = 364 + r * 16;
    text(fb, 16, y + 3, habitShort[habit.id], { color: C.ink });
    week.days.forEach((_, i) => {
      const x = 92 + i * 16;
      const done = week.matrix[habit.id][i] === 1;
      fb.panel(x, y, 12, 12, done ? C.leaf : C.sky, done ? C.ink : C.stone);
      if (done) fb.sprite(x + 1, y + 3, ['.....s', 's...s.', '.s.s..', '..s...'], { s: C.sprout });
    });
  });
  tabBar(fb, 'week');
};
