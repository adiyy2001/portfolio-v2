import { C } from '../tokens';
import { launch, newHabit } from '../content';
import { T, ticks } from '../timeline';
import { FB, text } from '../pixel/fb';
import * as S from '../pixel/sprites';
import { chip, header, shade, H, homeIndicator, statusBar, tabBar, W } from '../pixel/ui';
import { iconFb } from '../icon';
import { sparkles } from './levelup';

export const skyBands = (fb: FB, x: number, y: number, w: number, h: number) => {
  fb.rect(x, y, w, h, C.sky);
  const band = Math.floor(h / 6);
  fb.rect(x, y, w, band, C.blueDeep);
  fb.dither(x, y + band, w, band, C.blueDeep, C.skyMid, 8);
  fb.rect(x, y + 2 * band, w, band, C.skyMid);
  fb.dither(x, y + 3 * band, w, band, C.skyMid, C.sky, 8);
};

export const drawNewHabit = (fb: FB) => {
  fb.rect(0, 0, W, fb.h, C.sky);
  statusBar(fb, newHabit.time);
  header(fb, newHabit.title, 'Zadanie na każdy dzień albo wybrane dni');
  text(fb, 12, 58, 'NAZWA', { color: C.dusk });
  fb.panel(10, 68, 201, 24, C.white, C.ink, C.stone);
  const w = text(fb, 18, 77, newHabit.name, { color: C.ink });
  fb.rect(20 + w, 75, 1, 9, C.berry);
  text(fb, 12, 102, 'IKONKA', { color: C.dusk });
  newHabit.icons.forEach((id, i) => {
    const x = 10 + (i % 4) * 51;
    const y = 112 + Math.floor(i / 4) * 34;
    const on = i === newHabit.selected;
    fb.panel(x, y, 48, 30, on ? C.gold : C.cream, C.ink, on ? C.berryDeep : C.gold);
    fb.sprite(x + 18, y + 9, S.habitIcons[id], S.ink);
  });
  text(fb, 12, 190, 'ILE XP?', { color: C.dusk });
  chip(fb, 211, 186, `+${newHabit.xp} XP`);
  fb.rect(20, 214, 181, 4, C.ink);
  fb.rect(20, 214, 45, 4, C.gold);
  newHabit.xpSteps.forEach((xp, i) => {
    const x = 20 + i * 45;
    fb.rect(x - 1, 210, 2, 12, C.ink);
    text(fb, x, 226, String(xp), { color: C.dusk, align: 'center' });
  });
  fb.panel(57, 206, 16, 20, C.gold, C.ink, C.berryDeep);
  text(fb, 12, 246, 'KIEDY?', { color: C.dusk });
  newHabit.days.forEach((day, i) => {
    const on = newHabit.on.includes(i);
    const x = 10 + i * 29;
    fb.panel(x, 256, 26, 20, on ? C.plum : C.cream, C.ink);
    text(fb, x + 13, 263, day, { color: on ? C.gold : C.dusk, align: 'center' });
  });
  text(fb, 12, 284, '4 razy w tygodniu, około 80 XP tygodniowo.', { color: C.dusk });
  fb.panel(10, 300, 201, 48, C.cream, C.ink, C.gold);
  fb.sprite(18, 314, S.habitIcons.stretch, S.ink, { scale: 2 });
  text(fb, 48, 310, 'PODGLĄD', { color: C.dusk });
  text(fb, 48, 322, newHabit.name, { color: C.ink });
  text(fb, 48, 334, 'Pn, Śr, Pt, Nd', { color: C.dusk });
  chip(fb, 204, 330, `+${newHabit.xp} XP`);
  shade(fb, 12, 360, 197, 28);
  fb.panel(12, 360, 197, 28, C.gold, C.ink, C.berryDeep);
  text(fb, W / 2, 368, newHabit.cta, { font: 'pixel', color: C.ink, align: 'center' });
  tabBar(fb, 'quests');
};

export const drawLaunch = (fb: FB, f: number, opts: { still?: boolean } = {}) => {
  const still = Boolean(opts.still);
  skyBands(fb, 0, 0, W, 300);
  fb.rect(0, 300, W, H - 300, C.sky);
  fb.rect(0, 392, W, H - 392, C.leaf);
  fb.dither(0, 392, W, 4, C.sprout, C.leaf, 8);
  fb.dither(0, 440, W, H - 440, C.leaf, C.forest, 8);
  for (let x = 4; x < W; x += 31) {
    fb.sprite(x, 383, S.mini, S.ink);
    fb.sprite(x + 9, 386, ['.kk.', 'kssk', '.kek', '..k.'], S.ink);
  }
  statusBar(fb, '7:45', true);
  const drift = Math.floor(f / 8);
  fb.sprite(((20 + drift) % 260) - 30, 52, S.cloud, S.ink);
  fb.sprite(((150 + drift) % 260) - 30, 96, S.cloudSmall, S.ink);
  const icon = iconFb(false);
  const size = 32 * 3;
  const ix = Math.floor((W - size) / 2);
  shade(fb, ix - 1, 149, size + 2, size + 2);
  fb.rect(ix - 1, 149, size + 2, size + 2, C.ink);
  fb.scaled(icon, ix, 150, 3);
  const n = still ? 8 : Math.min(8, ticks(f, T.letters) + (f >= T.letters ? 1 : 0));
  text(fb, W / 2 + 1, 264, 'POZIOMKA', { font: 'pixel', scale: 2, color: C.ink, align: 'center', reveal: n });
  if (still || f >= T.tagline) text(fb, W / 2, 298, launch.tagline, { color: C.ink, align: 'center' });
  sparkles(fb, f, [[ix - 8, 160], [ix + size + 6, 186], [ix + 12, 254]]);
  homeIndicator(fb, C.ink);
};
