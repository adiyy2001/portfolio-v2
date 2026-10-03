import { districtById, districtIds } from '../data/districts';
import type { Condition, DistrictId, PropertyType } from '../data/types';
import { validateBooking, type BookingField } from './booking';
import type { EstimateInput } from './estimate';
import { collectErrors, parseDecimal, type ErrorMap } from './validation';

export type Timing = 'teraz' | 'trzy-miesiace' | 'rozgladam-sie';

export interface ValuationValues {
  type: PropertyType;
  district: DistrictId | '';
  area: string;
  floor: string;
  floorsTotal: string;
  condition: Condition | '';
  elevator: boolean;
  outdoor: boolean;
  timing: Timing | '';
  name: string;
  phone: string;
  email: string;
  consent: boolean;
}

export type ValuationField =
  'district' | 'area' | 'floor' | 'floorsTotal' | 'condition' | 'timing' | BookingField;

export const stepFields: readonly (readonly ValuationField[])[] = [
  ['district', 'area', 'floor', 'floorsTotal', 'condition'],
  ['timing'],
  ['name', 'phone', 'email', 'consent'],
];

export const emptyValuation: ValuationValues = {
  type: 'mieszkanie',
  district: '',
  area: '',
  floor: '',
  floorsTotal: '',
  condition: '',
  elevator: false,
  outdoor: false,
  timing: '',
  name: '',
  phone: '',
  email: '',
  consent: false,
};

const parseWhole = (value: string): number | null => {
  const number = parseDecimal(value);
  return number !== null && Number.isInteger(number) ? number : null;
};

const validateArea = (value: string, type: PropertyType): string | null => {
  const minimum = type === 'dom' ? 40 : 12;
  const maximum = type === 'dom' ? 600 : 300;
  if (value.trim().length === 0) return 'Podaj powierzchnię w metrach kwadratowych.';
  const area = parseDecimal(value);
  if (area === null) return 'Powierzchnia: wpisz liczbę, na przykład 54,5.';
  if (area < minimum || area > maximum) {
    return `Powierzchnia: wpisz wartość od ${minimum} do ${maximum} m².`;
  }
  return null;
};

const validateFloors = (values: ValuationValues): ErrorMap<'floor' | 'floorsTotal'> => {
  if (values.type === 'dom') return {};
  const errors: ErrorMap<'floor' | 'floorsTotal'> = {};
  const floor = parseWhole(values.floor);
  const total = parseWhole(values.floorsTotal);
  if (values.floor.trim().length === 0) errors.floor = 'Podaj piętro, parter to 0.';
  else if (floor === null || floor < 0 || floor > 30) {
    errors.floor = 'Piętro: wpisz liczbę całkowitą od 0 do 30.';
  }
  if (values.floorsTotal.trim().length === 0) errors.floorsTotal = 'Podaj liczbę pięter w budynku.';
  else if (total === null || total < 1 || total > 30) {
    errors.floorsTotal = 'Liczba pięter: wpisz liczbę całkowitą od 1 do 30.';
  }
  if (!errors.floor && !errors.floorsTotal && floor !== null && total !== null && floor > total) {
    errors.floor = 'Piętro nie może być wyżej niż liczba pięter w budynku.';
  }
  return errors;
};

export const validateStep = (step: number, values: ValuationValues): ErrorMap<ValuationField> => {
  if (step === 0) {
    return {
      ...collectErrors<ValuationField>([
        [
          'district',
          districtIds.includes(values.district as DistrictId) ? null : 'Wybierz dzielnicę.',
        ],
        ['area', validateArea(values.area, values.type)],
        ['condition', values.condition === '' ? 'Wybierz stan nieruchomości.' : null],
      ]),
      ...validateFloors(values),
    };
  }
  if (step === 1) {
    return collectErrors<ValuationField>([
      ['timing', values.timing === '' ? 'Wybierz, kiedy chcesz sprzedawać.' : null],
    ]);
  }
  return validateBooking(values);
};

export const toEstimateInput = (values: ValuationValues): EstimateInput | null => {
  if (values.district === '' || values.condition === '') return null;
  const area = parseDecimal(values.area);
  if (area === null) return null;
  const isHouse = values.type === 'dom';
  return {
    district: districtById(values.district),
    type: values.type,
    area,
    floor: isHouse ? null : parseWhole(values.floor),
    floorsTotal: isHouse ? 1 : (parseWhole(values.floorsTotal) ?? 1),
    condition: values.condition,
    elevator: values.elevator,
    outdoor: values.outdoor,
  };
};

export const firstInvalidField = (
  errors: ErrorMap<ValuationField>,
  step: number,
): ValuationField | null => stepFields[step]?.find(field => errors[field] !== undefined) ?? null;
