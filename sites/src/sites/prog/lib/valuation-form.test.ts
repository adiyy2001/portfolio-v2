import { describe, expect, it } from 'vitest';
import {
  emptyValuation,
  firstInvalidField,
  toEstimateInput,
  validateStep,
  type ValuationValues,
} from './valuation-form';

const flat: ValuationValues = {
  ...emptyValuation,
  district: 'nadodrze',
  area: '54',
  floor: '3',
  floorsTotal: '5',
  condition: 'dobry',
  timing: 'teraz',
  name: 'Anna Kowal',
  phone: '600 100 200',
  consent: true,
};

describe('validateStep, property', () => {
  it('accepts a complete flat', () => {
    expect(validateStep(0, flat)).toEqual({});
  });

  it('requires every field on an empty form', () => {
    const errors = validateStep(0, emptyValuation);
    expect(Object.keys(errors).sort()).toEqual([
      'area',
      'condition',
      'district',
      'floor',
      'floorsTotal',
    ]);
  });

  it('does not ask a house for floors', () => {
    const errors = validateStep(0, {
      ...flat,
      type: 'dom',
      floor: '',
      floorsTotal: '',
      area: '140',
    });
    expect(errors).toEqual({});
  });

  it('uses a higher minimum area for houses', () => {
    expect(validateStep(0, { ...flat, type: 'dom', area: '30' }).area).toContain('od 40 do 600');
  });

  it('rejects a floor above the building height', () => {
    expect(validateStep(0, { ...flat, floor: '7' }).floor).toContain('nie może być wyżej');
  });

  it('rejects a decimal floor', () => {
    expect(validateStep(0, { ...flat, floor: '2,5' }).floor).toBeDefined();
  });

  it('rejects an unknown district', () => {
    expect(validateStep(0, { ...flat, district: '' }).district).toBeDefined();
  });
});

describe('validateStep, timing and contact', () => {
  it('requires a timing', () => {
    expect(validateStep(1, { ...flat, timing: '' }).timing).toBeDefined();
    expect(validateStep(1, flat)).toEqual({});
  });

  it('requires name, phone and consent', () => {
    const errors = validateStep(2, { ...flat, name: '', phone: '', consent: false });
    expect(Object.keys(errors).sort()).toEqual(['consent', 'name', 'phone']);
  });
});

describe('toEstimateInput', () => {
  it('builds the estimate input for a flat', () => {
    const input = toEstimateInput(flat);
    expect(input?.floor).toBe(3);
    expect(input?.floorsTotal).toBe(5);
    expect(input?.area).toBe(54);
    expect(input?.district.id).toBe('nadodrze');
  });

  it('drops floors for a house', () => {
    const input = toEstimateInput({ ...flat, type: 'dom', area: '140' });
    expect(input?.floor).toBeNull();
  });

  it('returns null while required fields are missing', () => {
    expect(toEstimateInput(emptyValuation)).toBeNull();
  });
});

describe('firstInvalidField', () => {
  it('follows the order of the step', () => {
    const errors = validateStep(0, emptyValuation);
    expect(firstInvalidField(errors, 0)).toBe('district');
  });

  it('returns null without errors', () => {
    expect(firstInvalidField({}, 0)).toBeNull();
  });
});
