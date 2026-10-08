import { C } from './tokens';
import { storyboard } from './storyboard';
import { T, wipeFrames } from './timeline';
import { FB } from './pixel/fb';
import { H, W, drawOverlay, wipeMask, wipeStep } from './pixel/ui';
import { drawLevelUp } from './screens/levelup';
import { drawQuests } from './screens/quests';
import { drawStreak } from './screens/streak';
import { drawGarden } from './screens/garden';
import { drawWeek } from './screens/week';
import { drawLaunch } from './screens/extra';

type Draw = (fb: FB, f: number) => void;

const screens: { from: number; draw: Draw }[] = [
  { from: 0, draw: (fb, f) => drawLevelUp(fb, f) },
  { from: T.quests, draw: drawQuests },
  { from: T.streak, draw: drawStreak },
  { from: T.garden, draw: drawGarden },
  { from: T.week, draw: drawWeek },
  { from: T.launch, draw: drawLaunch },
];

const loopLength = storyboard.duration + storyboard.bridge;

const render = (draw: Draw, f: number) => {
  const fb = new FB(W, H, C.sky);
  draw(fb, f);
  return fb;
};

export const sceneFb = (frame: number, opts: { overlays?: boolean } = {}) => {
  const f = frame;
  let fb: FB;
  if (f >= storyboard.duration) {
    const old = render(drawLaunch, f);
    const next = render(screens[0].draw, f - loopLength);
    old.blit(next, 0, 0, wipeMask(wipeStep(f, storyboard.duration)));
    fb = old;
  } else {
    const index = screens.reduce((found, item, i) => (f >= item.from ? i : found), 0);
    const current = screens[index];
    fb = render(current.draw, f);
    if (index > 0 && f < current.from + wipeFrames) {
      const old = render(screens[index - 1].draw, f);
      old.blit(fb, 0, 0, wipeMask(wipeStep(f, current.from)));
      fb = old;
    }
  }
  if (opts.overlays !== false)
    for (const shot of storyboard.shots) if (shot.overlay) drawOverlay(fb, shot.overlay, f);
  return fb;
};
