export interface RosetteLayer {
  count: number;
  rx: number;
  ry: number;
  offset: number;
  tone: 'ink' | 'seal';
}

export interface RosetteEllipse {
  cx: number;
  rx: number;
  ry: number;
  rotate: number;
}

export const hashSeed = (text: string): number => {
  let hash = 2166136261;
  for (const character of text) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const pick = (hash: number, shift: number, size: number, base: number): number =>
  base + ((hash >>> shift) % size);

export const rosetteLayers = (seed: string): RosetteLayer[] => {
  const hash = hashSeed(seed);
  return [
    {
      count: pick(hash, 0, 13, 36),
      rx: pick(hash, 4, 10, 46),
      ry: pick(hash, 8, 14, 14),
      offset: pick(hash, 12, 16, 14),
      tone: 'ink',
    },
    {
      count: pick(hash, 16, 13, 24),
      rx: pick(hash, 20, 10, 38),
      ry: pick(hash, 24, 12, 10),
      offset: pick(hash, 26, 12, 8),
      tone: 'seal',
    },
  ];
};

export const ellipsesOf = (layer: RosetteLayer): RosetteEllipse[] =>
  Array.from({ length: layer.count }, (_, index) => ({
    cx: layer.offset,
    rx: layer.rx,
    ry: layer.ry,
    rotate: Math.round((index * 360 * 100) / layer.count) / 100,
  }));
