import type { BrewMethod, CountryId, GrindId, ProcessId, RoastLevel, WeightGrams } from './types';

export const roastOrder: RoastLevel[] = ['jasne', 'srednie', 'ciemne'];

export const roastLabels: Record<RoastLevel, string> = {
  jasne: 'Jasne',
  srednie: 'Średnie',
  ciemne: 'Ciemne',
};

export const processOrder: ProcessId[] = [
  'myta',
  'naturalna',
  'honey',
  'anaerobowa',
  'mokro-luskana',
  'mieszana',
];

export const processLabels: Record<ProcessId, string> = {
  myta: 'Myta',
  naturalna: 'Naturalna',
  honey: 'Honey',
  anaerobowa: 'Anaerobowa',
  'mokro-luskana': 'Mokro łuskana',
  mieszana: 'Mieszana',
};

export const brewOrder: BrewMethod[] = ['espresso', 'przelew', 'aeropress', 'zaparzacz', 'moka'];

export const brewLabels: Record<BrewMethod, string> = {
  espresso: 'Espresso',
  przelew: 'Przelew',
  aeropress: 'AeroPress',
  zaparzacz: 'French press',
  moka: 'Kawiarka',
};

export const countryOrder: CountryId[] = [
  'brazylia',
  'etiopia',
  'gwatemala',
  'indonezja',
  'kenia',
  'kolumbia',
  'kostaryka',
  'rwanda',
  'mieszanka',
];

export const countryLabels: Record<CountryId, string> = {
  brazylia: 'Brazylia',
  etiopia: 'Etiopia',
  gwatemala: 'Gwatemala',
  indonezja: 'Indonezja',
  kenia: 'Kenia',
  kolumbia: 'Kolumbia',
  kostaryka: 'Kostaryka',
  rwanda: 'Rwanda',
  mieszanka: 'Mieszanka',
};

export const grindOrder: GrindId[] = ['ziarna', 'espresso', 'moka', 'przelew', 'zaparzacz'];

export const grindLabels: Record<GrindId, string> = {
  ziarna: 'Całe ziarna',
  espresso: 'Espresso',
  moka: 'Kawiarka',
  przelew: 'Przelew (dripper, Chemex)',
  zaparzacz: 'French press',
};

export const weights: WeightGrams[] = [250, 500, 1000];

export const processNotes: Record<ProcessId, string> = {
  myta: 'Miąższ zdjęty po zbiorze, ziarna fermentują i są myte. Czysty, wyraźny smak.',
  naturalna: 'Cała wiśnia schnie na słońcu. Słodko, owocowo, z dużym ciałem.',
  honey: 'Część miąższu zostaje na ziarnie w czasie suszenia. Słodycz bez ciężaru.',
  anaerobowa: 'Fermentacja bez dostępu tlenu w zamkniętych zbiornikach. Głębia, jak w winie.',
  'mokro-luskana':
    'Pergamin zdejmowany z wilgotnych ziaren (giling basah). Ciężkie ciało, niska kwasowość.',
  mieszana: 'Mieszanka kaw z różnych krajów i obróbek, złożona pod jeden smak.',
};
