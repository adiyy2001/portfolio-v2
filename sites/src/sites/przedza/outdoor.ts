import { formatArea } from './flats';
import type { Flat, OutdoorKind } from './types';

export const outdoorName: Record<OutdoorKind, string> = {
  garden: 'ogródek',
  balcony: 'balkon',
  terrace: 'taras',
};

export const outdoorText = (flat: Pick<Flat, 'outdoor'>) =>
  flat.outdoor ? `${outdoorName[flat.outdoor.kind]} ${formatArea(flat.outdoor.area)}` : 'brak';
