import type { Condition, District, PropertyType } from '../data/types';

export interface EstimateInput {
  district: District;
  type: PropertyType;
  area: number;
  floor: number | null;
  floorsTotal: number;
  condition: Condition;
  elevator: boolean;
  outdoor: boolean;
}

export interface EstimateRange {
  low: number;
  high: number;
  perSquareMeter: number;
}

const conditionFactor: Record<Condition, number> = {
  'do-remontu': 0.82,
  dobry: 1,
  'po-remoncie': 1.07,
  'stan-deweloperski': 0.96,
  nowy: 1.05,
};

export const roundToStep = (value: number, step: number): number => Math.round(value / step) * step;

export const floorFactor = (
  floor: number | null,
  floorsTotal: number,
  elevator: boolean,
): number => {
  if (floor === null) return 1;
  if (floor === 0) return 0.96;
  const top = floor >= floorsTotal - 1 && floorsTotal > 1;
  if (top && !elevator && floor >= 4) return 0.95;
  if (floor >= 4 && !elevator) return 0.97;
  return 1;
};

export const estimateValue = (input: EstimateInput): EstimateRange => {
  const base = input.type === 'dom' ? input.district.houseM2 : input.district.flatM2;
  const outdoorFactor = input.outdoor ? 1.03 : 1;
  const perSquareMeter =
    base *
    conditionFactor[input.condition] *
    floorFactor(input.floor, input.floorsTotal, input.elevator) *
    outdoorFactor;
  const middle = perSquareMeter * input.area;
  return {
    low: roundToStep(middle * 0.94, 5000),
    high: roundToStep(middle * 1.06, 5000),
    perSquareMeter: Math.round(perSquareMeter),
  };
};
