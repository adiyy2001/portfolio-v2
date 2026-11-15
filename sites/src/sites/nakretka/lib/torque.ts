import { fasteners, torqueRange } from '../data/site';
import type { Fastener } from '../data/site';

export interface TorqueVerdict {
  kind: 'hit' | 'low' | 'high';
  verdict: string;
  detail: string;
  spoken: string;
}

export const clampNm = (value: number): number => {
  if (!Number.isFinite(value)) return torqueRange.start;
  return Math.min(torqueRange.max, Math.max(torqueRange.min, Math.round(value)));
};

export const nearestFastener = (value: number): Fastener =>
  fasteners.reduce((best, item) =>
    Math.abs(item.nm - value) < Math.abs(best.nm - value) ? item : best,
  );

export const hitFor = (value: number): Fastener | undefined =>
  fasteners.find(item => Math.abs(item.nm - value) <= 1);

export const describeTorque = (value: number): TorqueVerdict => {
  const hit = hitFor(value);
  if (hit) {
    return {
      kind: 'hit',
      verdict: hit.head,
      detail: hit.tail,
      spoken: `${hit.head} ${hit.tail}`,
    };
  }
  const near = nearestFastener(value);
  const gap = Math.abs(near.nm - value);
  const low = value < near.nm;
  const verdict = low ? 'Za luźno.' : 'Za mocno.';
  const detail = `Najbliżej: ${near.label.toLowerCase()}, ${near.nm} Nm. ${
    low ? `Brakuje ${gap} Nm.` : `O ${gap} Nm za dużo.`
  }`;
  return {
    kind: low ? 'low' : 'high',
    verdict,
    detail,
    spoken: `${value} Nm. ${verdict} ${detail}`,
  };
};
