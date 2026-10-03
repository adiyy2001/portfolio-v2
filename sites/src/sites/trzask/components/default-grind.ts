import type { BrewMethod, GrindId } from '../data/types';

const grindByMethod: Record<BrewMethod, GrindId> = {
  espresso: 'espresso',
  przelew: 'przelew',
  aeropress: 'przelew',
  zaparzacz: 'zaparzacz',
  moka: 'moka',
};

export const defaultGrind = (method: BrewMethod): GrindId => grindByMethod[method];
