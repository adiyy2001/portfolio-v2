import { describe, expect, it } from 'vitest';
import { canAdvance, initialState, parseServiceQuery, serviceNames, wizardReducer } from './wizard';
import type { WizardState } from './wizard';

describe('wizard', () => {
  it('starts on services and ignores unknown preselected slugs', () => {
    const state = initialState(['hamulce', 'nie-ma']);
    expect(state.step).toBe('services');
    expect(state.services).toEqual(['hamulce']);
  });

  it('parses the query list and drops unknown values', () => {
    expect(parseServiceQuery('opony,przeglad,xyz')).toEqual(['opony', 'przeglad']);
    expect(parseServiceQuery('')).toEqual([]);
  });

  it('keeps selected services in catalogue order', () => {
    let state = initialState();
    state = wizardReducer(state, { type: 'toggle', slug: 'opony' });
    state = wizardReducer(state, { type: 'toggle', slug: 'przeglad' });
    expect(state.services).toEqual(['przeglad', 'opony']);
    state = wizardReducer(state, { type: 'toggle', slug: 'opony' });
    expect(state.services).toEqual(['przeglad']);
  });

  it('does not advance without a service or a slot', () => {
    let state = initialState();
    expect(canAdvance(state)).toBe(false);
    expect(wizardReducer(state, { type: 'next' }).step).toBe('services');
    state = wizardReducer(state, { type: 'toggle', slug: 'przeglad' });
    state = wizardReducer(state, { type: 'next' });
    expect(state.step).toBe('slot');
    expect(wizardReducer(state, { type: 'next' }).step).toBe('slot');
    state = wizardReducer(state, { type: 'day', date: '2026-11-16' });
    state = wizardReducer(state, { type: 'hour', hour: 10 });
    expect(wizardReducer(state, { type: 'next' }).step).toBe('details');
  });

  it('clears the hour when the day changes and ignores an hour without a day', () => {
    let state = wizardReducer(initialState(), { type: 'hour', hour: 9 });
    expect(state.hour).toBeNull();
    state = wizardReducer(state, { type: 'day', date: '2026-11-16' });
    state = wizardReducer(state, { type: 'hour', hour: 9 });
    state = wizardReducer(state, { type: 'day', date: '2026-11-17' });
    expect(state.hour).toBeNull();
  });

  it('goes back and finishes only from details', () => {
    let state: WizardState = {
      ...initialState(['przeglad']),
      step: 'details',
      date: '2026-11-16',
      hour: 9,
    };
    expect(wizardReducer(state, { type: 'back' }).step).toBe('slot');
    state = wizardReducer(state, { type: 'finish' });
    expect(state.step).toBe('done');
    expect(wizardReducer(state, { type: 'reset' }).step).toBe('services');
    expect(wizardReducer(initialState(), { type: 'finish' }).step).toBe('services');
  });

  it('joins service names', () => {
    expect(serviceNames(['przeglad', 'inna-naprawa'])).toBe('Przegląd, Inna naprawa');
  });
});
