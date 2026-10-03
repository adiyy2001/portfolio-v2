export type ExtraId =
  | 'breakfast'
  | 'parking'
  | 'earlyCheckIn'
  | 'lateCheckOut'
  | 'bike'
  | 'transfer'
  | 'welcomeSet'
  | 'pet'
  | 'cot';

export type ExtraUnit = 'night' | 'stay';

export interface ExtraDefinition {
  id: ExtraId;
  price: number;
  unit: ExtraUnit;
  maxCount: (guests: number) => number;
}

export const extraDefinitions: readonly ExtraDefinition[] = [
  { id: 'breakfast', price: 55, unit: 'night', maxCount: guests => guests },
  { id: 'parking', price: 60, unit: 'night', maxCount: () => 1 },
  { id: 'earlyCheckIn', price: 80, unit: 'stay', maxCount: () => 1 },
  { id: 'lateCheckOut', price: 80, unit: 'stay', maxCount: () => 1 },
  { id: 'bike', price: 45, unit: 'night', maxCount: guests => guests },
  { id: 'transfer', price: 140, unit: 'stay', maxCount: () => 2 },
  { id: 'welcomeSet', price: 90, unit: 'stay', maxCount: () => 1 },
  { id: 'pet', price: 90, unit: 'stay', maxCount: () => 2 },
  { id: 'cot', price: 0, unit: 'stay', maxCount: () => 1 },
];

export type ExtraSelection = Partial<Record<ExtraId, number>>;

export const extraById = (id: ExtraId): ExtraDefinition => {
  const found = extraDefinitions.find(extra => extra.id === id);
  if (!found) throw new Error(`Unknown extra ${id}`);
  return found;
};

export const isExtraId = (value: string): value is ExtraId =>
  extraDefinitions.some(extra => extra.id === value);
