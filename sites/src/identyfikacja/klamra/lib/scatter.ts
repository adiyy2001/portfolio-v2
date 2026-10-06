export type Rng = () => number;

export const hashSeed = (input: string | number): number => {
  const text = String(input);
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

export const mulberry32 = (seed: number): Rng => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export interface Placement {
  id: string;
  x: number;
  y: number;
  rotation: number;
}

export interface Item {
  id: string;
  width: number;
  height: number;
}

export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));

export const scatter = (items: Item[], area: { width: number; height: number }, round: number): Placement[] => {
  const rng = mulberry32(hashSeed(`mix-${round}`));
  return items.map(item => ({
    id: item.id,
    x: Math.round(clamp(rng() * (area.width - item.width), 0, area.width - item.width)),
    y: Math.round(clamp(rng() * (area.height - item.height), 0, area.height - item.height)),
    rotation: Math.round((rng() - 0.5) * 36),
  }));
};

export const tidy = (items: Item[], area: { width: number; height: number }, gap = 14): Placement[] => {
  const placements: Placement[] = [];
  let x = gap;
  let y = gap;
  let rowHeight = 0;
  for (const item of items) {
    if (x + item.width + gap > area.width) {
      x = gap;
      y += rowHeight + gap;
      rowHeight = 0;
    }
    placements.push({ id: item.id, x, y: clamp(y, 0, area.height - item.height), rotation: 0 });
    x += item.width + gap;
    rowHeight = Math.max(rowHeight, item.height);
  }
  return placements;
};

export const nudge = (placement: Placement, dx: number, dy: number, item: Item, area: { width: number; height: number }): Placement => ({
  ...placement,
  x: clamp(placement.x + dx, 0, area.width - item.width),
  y: clamp(placement.y + dy, 0, area.height - item.height),
});
