import { C } from '../tokens';
import { garden } from '../content';
import { T, blinkOn } from '../timeline';
import { FB, text } from '../pixel/fb';
import * as S from '../pixel/sprites';
import { W, header, statusBar, tabBar } from '../pixel/ui';
import { sparkles } from './levelup';

const plantPose = (f: number, still: boolean) => {
  if (still) return 2;
  if (f >= T.grow[2]) return 2;
  if (f >= T.grow[1]) return 1;
  return 0;
};

export const gardenScene = (fb: FB, x: number, y: number, w: number, h: number, f: number, pose: number) => {
  fb.rect(x, y, w, h, C.sky);
  fb.dither(x, y, w, 18, C.skyMid, C.sky, 6);
  fb.rect(x, y, w, 6, C.skyMid);
  fb.sprite(x + w - 30, y + 10, S.sun, S.ink);
  const drift = Math.floor(f / 8);
  const cloudX = x + ((((20 + drift) % (w + 20)) + (w + 20)) % (w + 20)) - 20;
  const layer = new FB(fb.w, fb.h);
  layer.sprite(cloudX, y + 24, S.cloud, S.ink);
  fb.blit(layer, 0, 0, (sx, sy) => sx >= x && sx < x + w && sy >= y && sy < y + h);
  const ground = y + h - 40;
  fb.rect(x, ground, w, 40, C.leaf);
  fb.dither(x, ground, w, 4, C.sprout, C.leaf, 8);
  fb.dither(x, ground + 28, w, 12, C.leaf, C.forest, 8);
  for (let gx = x + 3; gx < x + w - 2; gx += 9) {
    fb.set(gx, ground - 1, C.sprout);
    fb.set(gx + 1, ground - 2, C.sprout);
  }
  const bedW = 96;
  const bx = x + Math.floor((w - bedW) / 2);
  fb.rect(bx, ground + 10, bedW, 14, C.ink);
  fb.rect(bx + 1, ground + 11, bedW - 2, 12, C.dusk);
  fb.dither(bx + 1, ground + 18, bedW - 2, 5, C.dusk, C.plum, 8);
  fb.sprite(x + 8, ground - 4, S.fence, S.ink);
  fb.sprite(x + 20, ground - 4, S.fence, S.ink);
  fb.sprite(x + w - 22, ground + 2, S.rake, S.ink);
  const art = S.growPoses[pose];
  fb.sprite(bx + 16, ground + 12 - 64, art, S.ink, { scale: 4 });
  return ground;
};

const chest = (fb: FB, f: number, still: boolean) => {
  const openT = still ? 99 : f - T.chestOpen;
  const cx = 44;
  const base = 318;
  fb.panel(8, 274, 205, 66, C.plum, C.ink);
  if (openT < 0) fb.sprite(cx - 16, base - 24, S.chestShut, S.ink, { scale: 2 });
  else {
    const lid = Math.min(3, Math.floor(openT / 4) + 1);
    const rise = still ? 9 : Math.max(0, Math.min(9, Math.floor((f - T.canRise) / 2)));
    if (lid < 3) fb.sprite(cx - 16, base - 18 - 10 - lid * 3, S.chestLid, S.ink, { scale: 2 });
    else fb.sprite(cx - 16, base - 24, S.chestOpenLid, S.ink, { scale: 2 });
    if (still || f >= T.canRise) fb.sprite(cx - 9, base - 16 - rise * 2, S.can, S.ink);
    fb.sprite(cx - 16, base - 18, S.chestBase, S.ink, { scale: 2 });
  }
  if (still || f >= T.canRise) {
    if (still || f < T.newItem || blinkOn(f, T.newItem, 2)) text(fb, 80, 284, 'NOWY PRZEDMIOT', { color: C.gold });
    text(fb, 80, 298, 'Miedziana', { font: 'pixel', color: C.cream });
    text(fb, 80, 314, 'konewka', { font: 'pixel', color: C.cream });
    text(fb, 80, 330, garden.unlockNote, { color: C.berryLight });
  } else {
    text(fb, 80, 290, 'SKRZYNIA ZA PASSĘ', { color: C.gold });
    text(fb, 80, 304, '21 DNI', { font: 'pixel', color: C.cream });
  }
};

export const drawGarden = (fb: FB, f: number, opts: { still?: boolean } = {}) => {
  const still = Boolean(opts.still);
  fb.rect(0, 0, W, fb.h, C.sky);
  statusBar(fb, garden.time);
  header(fb, garden.title, 'Passa 21 dni: poziomka owocuje');
  const pose = plantPose(f, still);
  fb.rect(8, 54, 205, 156, C.ink);
  gardenScene(fb, 9, 55, 203, 154, f, pose);
  if (!still && f >= T.grow[0] && f < T.grow[2] + 16) sparkles(fb, f, [[70, 120], [150, 112], [88, 168], [140, 160]]);
  const stage = pose === 2 ? 4 : 3;
  fb.panel(8, 214, 205, 54, C.cream, C.ink, C.gold);
  garden.stages.forEach((item, i) => {
    const sx = 13 + i * 40;
    const on = i === stage;
    if (on) fb.panel(sx - 2, 218, 38, 46, C.gold, C.ink);
    fb.sprite(sx + 9, 222, S.plantStages[item.id], S.ink);
    text(fb, sx + 17, 252, item.label, { color: on ? C.ink : C.dusk, align: 'center' });
  });
  chest(fb, f, still);
  fb.panel(8, 346, 205, 84, C.cream, C.ink, C.gold);
  text(fb, 16, 353, 'PRZEDMIOTY W OGRÓDKU', { color: C.dusk });
  const icons = [S.rake, S.fence, S.can];
  garden.items.forEach((item, i) => {
    const y = 366 + i * 21;
    const fresh = item.id === 'can';
    const owned = !fresh || still || f >= T.canRise;
    fb.panel(14, y, 22, 18, owned ? C.sky : C.cream, owned ? C.ink : C.stone);
    if (owned) fb.sprite(25 - Math.floor(icons[i][0].length / 2), y + 9 - Math.floor(icons[i].length / 2), icons[i], S.ink);
    else fb.sprite(22, y + 5, S.lock, S.ink);
    text(fb, 42, y + 6, item.name, { color: owned ? C.ink : C.dusk });
    text(fb, 205, y + 6, `${item.days} dni`, { color: C.dusk, align: 'right' });
  });
  tabBar(fb, 'garden');
};
