export const POND_WIDTH = 1000;
export const POND_HEIGHT = 625;
export const POND_SEED = 16;
export const STILL_TIME = 6;

export interface Drop {
  startedAt: number;
  x: number;
  y: number;
  strength: number;
}

export interface Ripple {
  x: number;
  y: number;
  rx: number;
  ry: number;
  alpha: number;
}

const DROP_INTERVAL = 3.4;
const DROP_JITTER = 1.1;
const RING_DELAY = 1;
const RING_LIFE = 13;
const RING_SPEED = 44;
const RING_FADE_IN = 0.8;
const RING_WEIGHTS = [1, 0.86, 0.7, 0.55, 0.4, 0.28];
const FIRST_INDEX = -6;
const CANDIDATES = 5;
const NEIGHBOURS = 3;
const DEPTH_STRETCH = 1.6;
const FIELD = { left: 150, right: 90, top: 100, bottom: 70 };
const USER_DROP_STRENGTH = 0.95;

export const DROP_LIFE = RING_DELAY * (RING_WEIGHTS.length - 1) + RING_LIFE;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const randomGenerator = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let mixed = Math.imul(state ^ (state >>> 15), state | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
};

const distance = (a: Drop, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, (a.y - b.y) * DEPTH_STRETCH);

const nearestNeighbour = (candidate: { x: number; y: number }, neighbours: readonly Drop[]) =>
  neighbours.reduce((nearest, drop) => Math.min(nearest, distance(drop, candidate)), Infinity);

const makeDrop = (seed: number, index: number, neighbours: readonly Drop[]): Drop => {
  const random = randomGenerator(seed * 2654435761 + (index + 1000) * 40503);
  const startedAt = index * DROP_INTERVAL + (random() * 2 - 1) * DROP_JITTER;
  const strength = 0.72 + random() * 0.28;
  const candidates = Array.from({ length: CANDIDATES }, () => ({
    x: FIELD.left + random() * (POND_WIDTH - FIELD.left - FIELD.right),
    y: FIELD.top + random() * (POND_HEIGHT - FIELD.top - FIELD.bottom),
  }));
  const position = candidates.reduce((best, candidate) =>
    nearestNeighbour(candidate, neighbours) > nearestNeighbour(best, neighbours) ? candidate : best,
  );
  return { startedAt, strength, ...position };
};

export const createUserDrop = (startedAt: number, x: number, y: number): Drop => ({
  startedAt,
  x: clamp(x, 0, POND_WIDTH),
  y: clamp(y, 0, POND_HEIGHT),
  strength: USER_DROP_STRENGTH,
});

export const isAlive = (drop: Drop, time: number) => time - drop.startedAt < DROP_LIFE;

const ringsOf = (drop: Drop, time: number): Ripple[] => {
  const depth = drop.y / POND_HEIGHT;
  const scale = 0.62 + 0.5 * depth;
  const ratio = 0.3 + 0.18 * depth;
  return RING_WEIGHTS.flatMap((weight, ring) => {
    const age = time - drop.startedAt - ring * RING_DELAY;
    if (age <= 0 || age >= RING_LIFE) return [];
    const fadeIn = Math.min(1, age / RING_FADE_IN);
    const fadeOut = (1 - age / RING_LIFE) ** 0.9;
    const rx = RING_SPEED * age * scale;
    return [
      {
        x: drop.x,
        y: drop.y,
        rx,
        ry: rx * ratio,
        alpha: drop.strength * weight * fadeIn * fadeOut,
      },
    ];
  });
};

export const createPond = (seed: number) => {
  const scheduled = new Map<number, Drop>();
  const recent: Drop[] = [];
  let next = FIRST_INDEX;

  const dropAt = (index: number): Drop => {
    while (next <= index) {
      const drop = makeDrop(seed, next, recent);
      scheduled.set(next, drop);
      recent.push(drop);
      if (recent.length > NEIGHBOURS) recent.shift();
      next += 1;
    }
    return scheduled.get(index) ?? makeDrop(seed, index, []);
  };

  const ripplesAt = (time: number, extraDrops: readonly Drop[] = []): Ripple[] => {
    const first = Math.max(FIRST_INDEX, Math.floor((time - DROP_LIFE) / DROP_INTERVAL) - 1);
    const last = Math.ceil(time / DROP_INTERVAL) + 1;
    const indexes = Array.from({ length: last - first + 1 }, (_, offset) => first + offset);
    const drops = [...indexes.map(index => dropAt(index)), ...extraDrops];
    return drops.flatMap(drop => ringsOf(drop, time));
  };

  return { dropAt, ripplesAt };
};
