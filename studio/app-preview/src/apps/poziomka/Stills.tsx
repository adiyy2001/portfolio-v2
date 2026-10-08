import { C, palette } from './tokens';
import { app } from './content';
import { storyboard } from './storyboard';
import { T } from './timeline';
import { FB, measure, text } from './pixel/fb';
import { Pixels } from './pixel/Pixels';
import { H, W, shade } from './pixel/ui';
import { sceneFb } from './Scene';
import { drawLevelUp } from './screens/levelup';
import { drawQuests } from './screens/quests';
import { drawStreak } from './screens/streak';
import { drawGarden } from './screens/garden';
import { drawWeek } from './screens/week';
import { drawNewHabit, skyBands } from './screens/extra';
import { iconFb } from './icon';
import { cloudsLayer, gardenStrip, phoneFb } from './Marketing';
import { PixelRoot } from './Store';

const stills: Record<number, (fb: FB) => void> = {
  1: fb => drawLevelUp(fb, 30),
  2: fb => drawQuests(fb, 0, { still: true }),
  3: fb => drawStreak(fb, 0, { still: true }),
  4: fb => drawGarden(fb, 0, { still: true }),
  5: fb => drawWeek(fb, 0, { still: true }),
  6: fb => drawNewHabit(fb),
};

export const screenFb = (n: number) => {
  const fb = new FB(W, H, C.sky);
  (stills[n] ?? stills[1])(fb);
  return fb;
};

export const ScreenStill = ({ screen }: { screen: number }) => (
  <PixelRoot>
    <Pixels fb={screenFb(screen)} scale={2} />
  </PixelRoot>
);

export const IconStill = ({ rounded }: { rounded: boolean }) => (
  <PixelRoot background="transparent">
    <Pixels fb={iconFb(rounded)} scale={32} />
  </PixelRoot>
);

const seconds = (frame: number) => (frame / storyboard.fps).toFixed(1).replace('.', ',');

export const boardFb = () => {
  const fb = new FB(1400, 1580, C.sky);
  text(fb, 60, 46, app.name, { font: 'pixel', scale: 4, color: C.ink });
  text(fb, 60 + measure(app.name, 'pixel', 4) + 28, 70, 'storyboard', { color: C.dusk, scale: 3 });
  text(fb, 62, 110, `886×1920, 30 kl./s, ${storyboard.duration / storyboard.fps} s, ${storyboard.duration} klatek, sześć ujęć`, { color: C.dusk, scale: 2 });
  const colX = (i: number) => 60 + i * 353;
  storyboard.shots.forEach((shot, i) => {
    const x = colX(i % 4);
    const y = 160 + Math.floor(i / 4) * 610;
    fb.rect(x - 2, y - 2, W + 4, H + 4, C.ink);
    shade(fb, x - 2, y - 2, W + 4, H + 4);
    fb.blit(sceneFb(shot.key), x, y);
    fb.panel(x, y + H + 14, 30, 26, i === 0 ? C.gold : C.cream, C.ink, i === 0 ? C.berryDeep : C.gold);
    text(fb, x + 15, y + H + 22, String(i + 1), { color: C.ink, scale: 2, align: 'center' });
    text(fb, x + 40, y + H + 18, shot.name, { font: 'pixel', scale: 2, color: C.ink });
    text(fb, x, y + H + 52, `${seconds(shot.from)} do ${seconds(shot.to + 1)} s`, { color: C.dusk, scale: 2 });
    text(fb, x, y + H + 74, `klatki ${shot.from} do ${shot.to}`, { color: C.dusk, scale: 2 });
  });
  const tx = colX(2);
  const tw = colX(3) + W - tx;
  const ty = 800;
  text(fb, tx, ty, 'Oś czasu', { font: 'pixel', scale: 2, color: C.ink });
  const k = tw / storyboard.duration;
  text(fb, tx, ty + 44, '0 s', { color: C.dusk, scale: 2 });
  text(fb, tx + tw, ty + 44, `${storyboard.duration / storyboard.fps} s`, { color: C.dusk, scale: 2, align: 'right' });
  storyboard.shots.forEach((shot, i) => {
    const x = Math.round(tx + shot.from * k);
    const w = Math.round((shot.to - shot.from + 1) * k) - 4;
    fb.panel(x, ty + 70, w, 36, i === 0 ? C.gold : C.cream, C.ink, i === 0 ? C.berryDeep : C.gold);
    text(fb, x + 8, ty + 81, String(i + 1), { color: C.ink, scale: 2 });
    if (shot.overlay) fb.rect(Math.round(tx + shot.overlay.from * k), ty + 116, Math.round((shot.overlay.to - shot.overlay.from + 1) * k), 10, C.ink);
  });
  const wipes = [T.quests, T.streak, T.garden, T.week, T.launch];
  wipes.forEach(at => fb.checker(Math.round(tx + at * k) - 6, ty + 136, 12, 12, C.ink, C.cream));
  const pops = [T.tapWater, T.tapWalk, T.levelUp, ...Array.from({ length: 21 }, (_, i) => T.tilesFrom + i * T.tileStep), T.chestOpen, T.canRise];
  pops.forEach(at => fb.rect(Math.round(tx + at * k) - 1, ty + 156, 3, 12, C.berry));
  const legend: [number, string][] = [
    [C.gold, 'paski: ujęcia 1 do 6, złoty to hak'],
    [C.ink, 'czarne: napisy, każdy co najmniej 2 s'],
    [C.cream, 'szachownica: zmiana ekranu w 16 klatek'],
    [C.berry, 'czerwone: monety, kafle i skrzynia'],
  ];
  legend.forEach(([c, label], i) => {
    fb.panel(tx, ty + 196 + i * 30, 14, 14, c, C.ink);
    text(fb, tx + 24, ty + 199 + i * 30, label, { color: C.ink, scale: 2 });
  });
  text(fb, 60, 1430, 'Paleta: 16 kolorów, bez gradientów', { font: 'pixel', scale: 2, color: C.ink });
  palette.forEach((item, i) => {
    const x = 60 + i * 80;
    fb.panel(x, 1480, 68, 52, C[item.id as keyof typeof C], C.ink);
    text(fb, x, 1544, item.hex.slice(1), { color: C.dusk, scale: 2 });
  });
  return fb;
};

export const Board = () => (
  <PixelRoot>
    <Pixels fb={boardFb()} scale={1} />
  </PixelRoot>
);

export const ogFb = () => {
  const fb = new FB(600, 315, C.sky);
  skyBands(fb, 0, 0, 600, 200);
  cloudsLayer(fb, 0, 600, 315);
  gardenStrip(fb, 0, 600, 262);
  const icon = iconFb(true);
  shade(fb, 36, 34, 96, 96);
  fb.scaled(icon, 36, 34, 3);
  text(fb, 34, 146, app.name, { font: 'pixel', scale: 4, color: C.ink, outline: C.cream });
  text(fb, 38, 204, 'App preview trackera nawyków', { color: C.ink, scale: 2 });
  text(fb, 38, 226, 'Pixel art, 16 kolorów, 7,5 kl./s', { color: C.ink, scale: 2 });
  return fb;
};

export const Og = () => (
  <PixelRoot>
    <Pixels fb={ogFb()} scale={2} />
    <Pixels fb={phoneFb(sceneFb(storyboard.poster, { overlays: false }))} scale={1} style={{ left: 880, top: 70 }} />
  </PixelRoot>
);
