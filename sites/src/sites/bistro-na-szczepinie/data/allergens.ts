import type { Localized } from './lang';

export const allergenIds = [
  'gluten',
  'crustaceans',
  'eggs',
  'fish',
  'peanuts',
  'soy',
  'milk',
  'nuts',
  'celery',
  'mustard',
  'sesame',
  'sulphites',
  'lupin',
  'molluscs',
] as const;

export type AllergenId = (typeof allergenIds)[number];

export const allergenNames: Record<AllergenId, Localized> = {
  gluten: { pl: 'gluten', en: 'gluten' },
  crustaceans: { pl: 'skorupiaki', en: 'crustaceans' },
  eggs: { pl: 'jaja', en: 'eggs' },
  fish: { pl: 'ryby', en: 'fish' },
  peanuts: { pl: 'orzeszki ziemne', en: 'peanuts' },
  soy: { pl: 'soja', en: 'soy' },
  milk: { pl: 'mleko', en: 'milk' },
  nuts: { pl: 'orzechy', en: 'tree nuts' },
  celery: { pl: 'seler', en: 'celery' },
  mustard: { pl: 'gorczyca', en: 'mustard' },
  sesame: { pl: 'sezam', en: 'sesame' },
  sulphites: { pl: 'siarczyny', en: 'sulphites' },
  lupin: { pl: 'łubin', en: 'lupin' },
  molluscs: { pl: 'mięczaki', en: 'molluscs' },
};
