import { useCurrentFrame } from 'remotion';
import { C } from './tokens';
import { tile } from './storyboard';
import { FB, text } from './pixel/fb';
import * as S from './pixel/sprites';
import { Pixels } from './pixel/Pixels';
import { coinPop, groundShadow, xpBar } from './pixel/ui';
import { blinkOn } from './timeline';
import { berryPose, sparkles } from './screens/levelup';
import { skyBands } from './screens/extra';
import { PixelRoot } from './Store';

export const TILE = { w: 120, h: 90, scale: 4 } as const;

export const tileFb = (frame: number) => {
  const f = ((frame % tile.duration) + tile.duration) % tile.duration;
  const fb = new FB(TILE.w, TILE.h, C.sky);
  skyBands(fb, 0, 0, TILE.w, 48);
  const bob = [0, 1, 1, 0][Math.floor(f / 32)];
  fb.sprite(6, 30 + bob, S.cloudSmall, S.ink);
  fb.sprite(92, 24 - bob, S.cloudSmall, S.ink);
  const ground = 76;
  fb.rect(0, ground, TILE.w, TILE.h - ground, C.leaf);
  fb.dither(0, ground, TILE.w, 3, C.sprout, C.leaf, 8);
  fb.dither(0, ground + 8, TILE.w, TILE.h - ground - 8, C.leaf, C.forest, 6);
  for (const x of [4, 22, 86, 104]) fb.sprite(x, ground - 6, S.mini, S.ink);
  text(fb, TILE.w / 2 + 1, 5, 'POZIOM 8!', { font: 'pixel', color: C.gold, outline: C.ink, align: 'center' });
  xpBar(fb, 30, 22, 60, 60, blinkOn(f % 64, 0, 4));
  sparkles(fb, f, [
    [16, 12],
    [104, 14],
    [26, 46],
    [96, 50],
  ]);
  const { art, rise } = berryPose(f);
  groundShadow(fb, TILE.w / 2, ground - 1, rise >= 5 ? 18 : rise >= 3 ? 22 : 28, C.forest);
  fb.sprite(TILE.w / 2 - 16, ground - 36 - rise * 2, art, S.ink, { scale: 2 });
  coinPop(fb, 26, 64, (f + 40) % 64, '+10', 'right');
  coinPop(fb, 94, 58, (f + 8) % 64, '+30', 'left');
  return fb;
};

export const Tile = () => {
  const frame = useCurrentFrame();
  return (
    <PixelRoot background="#9ED8FF">
      <Pixels fb={tileFb(frame)} scale={TILE.scale} />
    </PixelRoot>
  );
};
