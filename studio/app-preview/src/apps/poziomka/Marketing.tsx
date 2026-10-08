import { useCurrentFrame } from 'remotion';
import type { Format } from '../../shared/types';
import { formats } from '../../shared/formats';
import { C } from './tokens';
import { launch } from './content';
import { marketing, marketingBeats } from './storyboard';
import { CLEAR, FB, balance, measure, text } from './pixel/fb';
import * as S from './pixel/sprites';
import { Pixels } from './pixel/Pixels';
import { coinPop, groundShadow, shade, wipeMask, wipeStep } from './pixel/ui';
import { T } from './timeline';
import { questState, rowY } from './screens/quests';
import { sceneFb } from './Scene';
import { berryPose, sparkles } from './screens/levelup';
import { skyBands } from './screens/extra';
import { iconFb } from './icon';
import { PixelRoot } from './Store';

export const PHONE_W = 237;
export const PHONE_H = 496;

const cornerSteps = [6, 4, 3, 2, 1, 1];

export const phoneFb = (screen: FB) => {
  const fb = new FB(PHONE_W, PHONE_H);
  fb.rect(0, 0, PHONE_W, PHONE_H, C.ink);
  fb.rect(2, 2, PHONE_W - 4, PHONE_H - 4, C.plum);
  fb.rect(3, 3, PHONE_W - 6, 1, C.dusk);
  fb.rect(3, 3, 1, PHONE_H - 6, C.dusk);
  fb.rect(6, 6, PHONE_W - 12, PHONE_H - 12, C.ink);
  fb.blit(screen, 8, 8);
  const cam = PHONE_W / 2 - 2;
  fb.rect(cam, 13, 4, 4, C.ink);
  fb.set(cam + 1, 14, C.dusk);
  cornerSteps.forEach((n, y) => {
    for (let x = 0; x < n; x += 1) {
      fb.set(x, y, CLEAR);
      fb.set(PHONE_W - 1 - x, y, CLEAR);
      fb.set(x, PHONE_H - 1 - y, CLEAR);
      fb.set(PHONE_W - 1 - x, PHONE_H - 1 - y, CLEAR);
    }
    if (n > 0) {
      fb.set(n, y, C.ink);
      fb.set(PHONE_W - 1 - n, y, C.ink);
      fb.set(n, PHONE_H - 1 - y, C.ink);
      fb.set(PHONE_W - 1 - n, PHONE_H - 1 - y, C.ink);
    }
  });
  return fb;
};

const drawButtons = (fb: FB, x: number, y: number) => {
  fb.rect(x + PHONE_W, y + 96, 2, 44, C.ink);
  fb.rect(x - 2, y + 80, 2, 22, C.ink);
  fb.rect(x - 2, y + 110, 2, 22, C.ink);
};

interface Layout {
  w: number;
  h: number;
  phone: [number, number];
  panel: { x: number; y: number; w: number; title: number };
  hud: boolean;
  ground: number;
  berry: [number, number, number];
  outro: { icon: number; y: number; name: number };
}

const layouts: Record<Format, Layout> = {
  '9x16': { w: 540, h: 960, phone: [152, 344], panel: { x: 40, y: 120, w: 420, title: 3 }, hud: false, ground: 818, berry: [76, 818, 3], outro: { icon: 6, y: 250, name: 4 } },
  '1x1': { w: 540, h: 540, phone: [284, 22], panel: { x: 18, y: 40, w: 248, title: 2 }, hud: false, ground: 456, berry: [108, 456, 3], outro: { icon: 4, y: 70, name: 3 } },
  '16x9': { w: 960, h: 540, phone: [628, 22], panel: { x: 60, y: 92, w: 480, title: 4 }, hud: true, ground: 456, berry: [176, 456, 5], outro: { icon: 5, y: 60, name: 4 } },
};

const chunk = 2;

export const cloudsLayer = (fb: FB, f: number, w: number, h: number) => {
  const drift = Math.floor(f / 8) * chunk;
  const span = w + 120;
  const at = (x0: number) => ((((x0 + drift) % span) + span) % span) - 60;
  fb.sprite(at(40), Math.round(h * 0.08), S.cloud, S.ink, { scale: chunk });
  fb.sprite(at(Math.round(w * 0.55)), Math.round(h * 0.16), S.cloudSmall, S.ink, { scale: chunk });
  fb.sprite(at(Math.round(w * 0.9)), Math.round(h * 0.05), S.cloudSmall, S.ink, { scale: chunk });
};

export const gardenStrip = (fb: FB, f: number, w: number, ground: number) => {
  fb.rect(0, ground, w, fb.h - ground, C.leaf);
  fb.dither(0, ground, w, 6, C.sprout, C.leaf, 8);
  fb.dither(0, ground + 30, w, fb.h - ground - 30, C.leaf, C.forest, 6);
  fb.rect(0, ground + 14, w, 12, C.dusk);
  fb.dither(0, ground + 20, w, 6, C.dusk, C.plum, 8);
  fb.rect(0, ground + 14, w, 2, C.ink);
  fb.rect(0, ground + 26, w, 2, C.ink);
  const stages = ['nasionko', 'listek', 'sadzonka', 'kwiat', 'owoc'];
  const sway = Math.floor(f / 16) * chunk;
  for (let i = 0, x = -((sway % 80) + 80) % 80; x < w; i += 1, x += 80) {
    const id = stages[((i % 5) + 5) % 5];
    fb.sprite(x + 8, ground - 28 + 4, S.plantStages[id], S.ink, { scale: chunk });
  }
  for (let x = 4; x < w; x += 22) {
    fb.set(x, ground - 1, C.sprout);
    fb.set(x + 1, ground - 2, C.sprout);
    fb.set(x + 2, ground - 1, C.sprout);
  }
};

const headline = (fb: FB, f: number, layout: Layout) => {
  const beat = f < 0 ? marketingBeats[0] : marketingBeats.find(b => f >= b.from && f <= b.to);
  if (!beat) return;
  const { x, y, w, title: scale } = layout.panel;
  const step = 17 * scale;
  const typed = beat.from === 0 ? 99 : Math.max(0, f - beat.from - 4);
  const titleLines = balance(beat.title, w - 32, 'pixel', scale);
  const lineLines = balance(beat.line, w - 32, 'mini', 2);
  const h = 18 + 22 + titleLines.length * step + 8 + lineLines.length * 20 + 12;
  shade(fb, x, y, w, h);
  fb.panel(x, y, w, h, C.cream, C.ink, C.gold);
  const kw = measure(beat.kicker, 'mini', 2) + 16;
  fb.panel(x + 14, y + 12, kw, 22, C.plum, C.ink);
  text(fb, x + 22, y + 18, beat.kicker, { color: C.gold, scale: 2 });
  let left = typed;
  titleLines.forEach((line, i) => {
    text(fb, x + 16, y + 46 + i * step, line, { font: 'pixel', scale, color: C.ink, reveal: Math.max(0, left) });
    left -= [...line].length + 1;
  });
  const done = typed >= [...beat.title].length + 2;
  if (done)
    lineLines.forEach((line, i) => text(fb, x + 16, y + 46 + titleLines.length * step + i * 20, line, { color: C.dusk, scale: 2 }));
};

const worldFb = (format: Format, f: number) => {
  const layout = layouts[format];
  const fb = new FB(layout.w, layout.h, C.sky);
  skyBands(fb, 0, 0, layout.w, Math.round(layout.ground * 0.7));
  fb.sprite(layout.w - 70, 26, S.sun, S.ink, { scale: chunk });
  cloudsLayer(fb, f, layout.w, layout.h);
  gardenStrip(fb, f, layout.w, layout.ground);
  return fb;
};

const mascot = (fb: FB, f: number, layout: Layout) => {
  const [bx, ground, scale] = layout.berry;
  const { art, rise } = berryPose(f);
  groundShadow(fb, bx, ground + 1, (rise >= 5 ? 30 : rise >= 3 ? 38 : 46) * (scale / 3), C.forest);
  fb.sprite(bx - 8 * scale, ground - 18 * scale - rise * scale + 2, art, S.ink, { scale });
};

const mainFb = (format: Format, f: number) => {
  const layout = layouts[format];
  const fb = worldFb(format, f);
  const [px, py] = layout.phone;
  fb.blit(phoneFb(sceneFb(f, { overlays: false })), px, py);
  drawButtons(fb, px, py);
  headline(fb, f, layout);
  mascot(fb, f, layout);
  if (layout.hud) hud(fb, f);
  coinPop(fb, px + PHONE_W + 4, py + 8 + rowY(0) + 14, f - T.tapWater, '+10 XP', 'right', 2);
  coinPop(fb, px + PHONE_W + 4, py + 8 + rowY(1) + 14, f - T.tapWalk, '+30 XP', 'right', 2);
  return fb;
};

const hud = (fb: FB, f: number) => {
  const state = questState(Math.max(0, Math.min(f, T.levelUp + 20)));
  const lvl = f < T.quests || f >= T.levelUp ? 8 : 7;
  const xp = f < T.quests ? 1200 : state.xp;
  fb.panel(60, 22, 240, 40, C.plum, C.ink);
  fb.sprite(70, 30, S.coin[0], S.ink, { scale: 3 });
  text(fb, 104, 32, `${xp} XP`, { font: 'pixel', scale: 2, color: C.gold });
  text(fb, 290, 36, `POZIOM ${lvl}`, { color: C.cream, scale: 2, align: 'right' });
};

const outroFb = (format: Format, f: number) => {
  const layout = layouts[format];
  const fb = worldFb(format, f);
  const { icon: k, y, name } = layout.outro;
  const icon = iconFb(true);
  const size = 32 * k;
  const ix = Math.floor((layout.w - size) / 2);
  shade(fb, ix, y, size, size);
  fb.scaled(icon, ix, y, k);
  const letters = Math.min(8, Math.max(0, Math.floor((f - marketing.outro - 8) / 2) + 1));
  const ny = y + size + 20;
  text(fb, layout.w / 2 + 1, ny, 'POZIOMKA', { font: 'pixel', scale: name, color: C.ink, align: 'center', reveal: letters });
  if (f >= marketing.outro + 30) text(fb, layout.w / 2, ny + 10 * name + 18, launch.tagline, { color: C.ink, scale: 2, align: 'center' });
  sparkles(fb, f, [
    [ix - 16, y + 20],
    [ix + size + 14, y + size / 2],
    [ix + 20, y + size + 4],
  ]);
  mascot(fb, f, layout);
  return fb;
};

export const marketingFb = (format: Format, frame: number) => {
  const end = marketing.duration;
  if (frame >= end) {
    const old = outroFb(format, frame);
    old.blit(mainFb(format, frame - end - marketing.bridge), 0, 0, wipeMask(wipeStep(frame, end), old.h));
    return old;
  }
  if (frame >= marketing.outro) {
    const fb = frame < marketing.outro + 16 ? mainFb(format, frame) : outroFb(format, frame);
    if (frame < marketing.outro + 16) fb.blit(outroFb(format, frame), 0, 0, wipeMask(wipeStep(frame, marketing.outro), fb.h));
    return fb;
  }
  return mainFb(format, frame);
};

export const Marketing = ({ format }: { format: Format; loop?: boolean }) => {
  const frame = useCurrentFrame();
  const size = formats[format];
  const fb = marketingFb(format, frame);
  return (
    <PixelRoot>
      <Pixels fb={fb} scale={size.width / fb.w} />
    </PixelRoot>
  );
};
