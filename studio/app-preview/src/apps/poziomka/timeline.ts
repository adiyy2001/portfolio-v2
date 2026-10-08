export const T = {
  hookCoins: [6, 26],
  quests: 60,
  tapWater: 86,
  tapWalk: 136,
  fullBlink: 160,
  levelUp: 196,
  streak: 210,
  tilesFrom: 228,
  tileStep: 4,
  streakBanner: 314,
  garden: 330,
  grow: [358, 370, 382],
  chestOpen: 404,
  canRise: 416,
  newItem: 432,
  week: 480,
  bars: 496,
  barSpeed: 3,
  launch: 540,
  letters: 558,
  tagline: 594,
  end: 600,
} as const;

export const wipeFrames = 16;

export const timeAt = (f: number) => (f < T.streak ? '7:42' : f < T.garden ? '7:43' : f < T.week ? '7:44' : '7:45');

export const walkPose = (f: number) => (((Math.floor((f + 6) / 4) % 4) + 4) % 4);

export const blinkOn = (f: number, start: number, times = 3) => {
  const t = f - start;
  if (t < 0 || t >= times * 12) return true;
  return t % 12 < 6;
};

export const ticks = (f: number, start: number) => Math.max(0, Math.floor((f - start) / 4));
