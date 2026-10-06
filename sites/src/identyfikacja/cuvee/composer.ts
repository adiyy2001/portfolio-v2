import { grapes } from './content';

export type Grape = (typeof grapes)[number];

export const minPicks = 2;
export const maxPicks = 3;
export const defaultPicks: string[] = ['solaris', 'johanniter'];
export const defaultVintage = 2024;

export interface BlendPart {
  id: string;
  name: string;
  note: string;
  tone: string;
  share: number;
}

export const sharesFor = (count: number): number[] => {
  if (count >= 3) return [50, 30, 20];
  if (count === 2) return [60, 40];
  if (count === 1) return [100];
  return [];
};

export const canAdd = (picks: string[]) => picks.length < maxPicks;

export const canRemove = (picks: string[]) => picks.length > minPicks;

export const toggle = (picks: string[], id: string) => {
  if (!grapes.some(grape => grape.id === id)) return picks;
  if (picks.includes(id)) return canRemove(picks) ? picks.filter(item => item !== id) : picks;
  return canAdd(picks) ? [...picks, id] : picks;
};

export const promote = (picks: string[], id: string) =>
  picks.includes(id) ? [id, ...picks.filter(item => item !== id)] : picks;

export const blend = (picks: string[]): BlendPart[] => {
  const shares = sharesFor(picks.length);
  return picks.flatMap((id, index) => {
    const grape = grapes.find(item => item.id === id);
    return grape
      ? [{ id, name: grape.name, note: grape.note, tone: grape.tone, share: shares[index] }]
      : [];
  });
};

export const blendKind = (parts: BlendPart[]) => {
  const tones = new Set(parts.map(part => part.tone));
  if (tones.size === 1) return tones.has('biała') ? 'białe' : 'czerwone';
  return 'z odmian białych i czerwonych';
};

export const summary = (picks: string[], vintage: number) => {
  const parts = blend(picks);
  const list = parts.map(part => `${part.name} ${part.share}`).join(', ');
  return `Cuvée ${vintage}, wino ${blendKind(parts)}: ${list}.`;
};
