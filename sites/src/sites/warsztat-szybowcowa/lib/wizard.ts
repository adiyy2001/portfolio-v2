import { otherRepair, services } from '../data/services';

export type Step = 'services' | 'slot' | 'details' | 'done';

export interface WizardState {
  step: Step;
  services: string[];
  date: string | null;
  hour: number | null;
}

export type WizardAction =
  | { type: 'toggle'; slug: string }
  | { type: 'day'; date: string }
  | { type: 'hour'; hour: number }
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'finish' }
  | { type: 'reset' };

export const stepOrder: Step[] = ['services', 'slot', 'details', 'done'];

export const validSlugs: string[] = [...services.map(item => item.slug), otherRepair.slug];

export const initialState = (preselected: string[] = []): WizardState => ({
  step: 'services',
  services: validSlugs.filter(slug => preselected.includes(slug)),
  date: null,
  hour: null,
});

export const parseServiceQuery = (query: string): string[] =>
  query
    .split(',')
    .map(part => part.trim())
    .filter(part => validSlugs.includes(part));

export const canAdvance = (state: WizardState): boolean => {
  if (state.step === 'services') return state.services.length > 0;
  if (state.step === 'slot') return state.date !== null && state.hour !== null;
  return false;
};

export const wizardReducer = (state: WizardState, action: WizardAction): WizardState => {
  switch (action.type) {
    case 'toggle': {
      if (!validSlugs.includes(action.slug)) return state;
      const next = state.services.includes(action.slug)
        ? state.services.filter(slug => slug !== action.slug)
        : validSlugs.filter(slug => slug === action.slug || state.services.includes(slug));
      return { ...state, services: next };
    }
    case 'day':
      return state.date === action.date ? state : { ...state, date: action.date, hour: null };
    case 'hour':
      return state.date ? { ...state, hour: action.hour } : state;
    case 'next':
      if (!canAdvance(state)) return state;
      return { ...state, step: state.step === 'services' ? 'slot' : 'details' };
    case 'back':
      if (state.step === 'slot') return { ...state, step: 'services' };
      if (state.step === 'details') return { ...state, step: 'slot' };
      return state;
    case 'finish':
      return state.step === 'details' ? { ...state, step: 'done' } : state;
    case 'reset':
      return initialState();
  }
};

export const serviceNames = (slugs: string[]): string =>
  slugs
    .map(slug =>
      slug === otherRepair.slug
        ? otherRepair.name
        : services.find(item => item.slug === slug)?.name,
    )
    .filter((name): name is string => Boolean(name))
    .join(', ');
