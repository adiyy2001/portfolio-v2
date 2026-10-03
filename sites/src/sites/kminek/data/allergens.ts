import type { Lang, Localized } from './lang';

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

export interface Allergen {
  id: AllergenId;
  code: Localized;
  name: Localized;
  detail: Localized;
}

export const allergens: readonly Allergen[] = [
  {
    id: 'gluten',
    code: { pl: 'GL', en: 'GL' },
    name: { pl: 'Gluten', en: 'Gluten' },
    detail: {
      pl: 'pszenica, żyto, jęczmień, owies, orkisz',
      en: 'wheat, rye, barley, oats, spelt',
    },
  },
  {
    id: 'crustaceans',
    code: { pl: 'SK', en: 'CR' },
    name: { pl: 'Skorupiaki', en: 'Crustaceans' },
    detail: { pl: 'krewetki, raki, kraby', en: 'shrimp, crayfish, crab' },
  },
  {
    id: 'eggs',
    code: { pl: 'JA', en: 'EG' },
    name: { pl: 'Jaja', en: 'Eggs' },
    detail: { pl: 'i produkty z jaj', en: 'and egg products' },
  },
  {
    id: 'fish',
    code: { pl: 'RY', en: 'FI' },
    name: { pl: 'Ryby', en: 'Fish' },
    detail: { pl: 'i produkty rybne', en: 'and fish products' },
  },
  {
    id: 'peanuts',
    code: { pl: 'OZ', en: 'PE' },
    name: { pl: 'Orzeszki ziemne', en: 'Peanuts' },
    detail: { pl: 'orzeszki arachidowe', en: 'groundnuts' },
  },
  {
    id: 'soy',
    code: { pl: 'SO', en: 'SO' },
    name: { pl: 'Soja', en: 'Soy' },
    detail: { pl: 'i produkty sojowe', en: 'and soy products' },
  },
  {
    id: 'milk',
    code: { pl: 'ML', en: 'MK' },
    name: { pl: 'Mleko', en: 'Milk' },
    detail: { pl: 'łącznie z laktozą', en: 'including lactose' },
  },
  {
    id: 'nuts',
    code: { pl: 'OR', en: 'TN' },
    name: { pl: 'Orzechy', en: 'Tree nuts' },
    detail: {
      pl: 'migdały, laskowe, włoskie, nerkowca, pekan, brazylijskie, pistacje, makadamia',
      en: 'almonds, hazelnuts, walnuts, cashews, pecans, Brazil nuts, pistachios, macadamia',
    },
  },
  {
    id: 'celery',
    code: { pl: 'SE', en: 'CE' },
    name: { pl: 'Seler', en: 'Celery' },
    detail: { pl: 'korzeń, łodyga i liście', en: 'root, stalk and leaves' },
  },
  {
    id: 'mustard',
    code: { pl: 'GO', en: 'MU' },
    name: { pl: 'Gorczyca', en: 'Mustard' },
    detail: { pl: 'także musztarda', en: 'including prepared mustard' },
  },
  {
    id: 'sesame',
    code: { pl: 'SZ', en: 'SS' },
    name: { pl: 'Sezam', en: 'Sesame' },
    detail: { pl: 'nasiona sezamu', en: 'sesame seeds' },
  },
  {
    id: 'sulphites',
    code: { pl: 'SI', en: 'SU' },
    name: { pl: 'Siarczyny', en: 'Sulphites' },
    detail: {
      pl: 'dwutlenek siarki powyżej 10 mg/kg lub 10 mg/l, np. w winie',
      en: 'sulphur dioxide above 10 mg/kg or 10 mg/l, for example in wine',
    },
  },
  {
    id: 'lupin',
    code: { pl: 'LU', en: 'LU' },
    name: { pl: 'Łubin', en: 'Lupin' },
    detail: { pl: 'np. mąka łubinowa', en: 'for example lupin flour' },
  },
  {
    id: 'molluscs',
    code: { pl: 'MI', en: 'MO' },
    name: { pl: 'Mięczaki', en: 'Molluscs' },
    detail: { pl: 'małże, ostrygi, ślimaki, kałamarnice', en: 'mussels, oysters, snails, squid' },
  },
];

export const allergenById = (id: AllergenId): Allergen => {
  const found = allergens.find(allergen => allergen.id === id);
  if (!found) throw new Error(`Unknown allergen ${id}`);
  return found;
};

export const allergenName = (id: AllergenId, lang: Lang) => allergenById(id).name[lang];
