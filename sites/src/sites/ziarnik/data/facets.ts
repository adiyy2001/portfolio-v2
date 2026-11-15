import type { BrewMethod, CountryId, Degree, GrindId, ProcessId } from './types';

export const degreeOrder: Degree[] = [3, 6, 9];

export const degreeLabels: Record<Degree, string> = {
  3: 'Stopień 3, jasne',
  6: 'Stopień 6, średnie',
  9: 'Stopień 9, ciemniejsze',
};

export const degreeShortLabels: Record<Degree, string> = {
  3: 'jasne palenie',
  6: 'średnie palenie',
  9: 'ciemniejsze palenie',
};

export const brewOrder: BrewMethod[] = ['espresso', 'przelew', 'prasa', 'kawiarka'];

export const brewLabels: Record<BrewMethod, string> = {
  espresso: 'Espresso',
  przelew: 'Przelew',
  prasa: 'Prasa francuska',
  kawiarka: 'Kawiarka',
};

export const countryOrder: CountryId[] = ['etiopia', 'kenia', 'kolumbia', 'brazylia', 'gwatemala'];

export const countryLabels: Record<CountryId, string> = {
  etiopia: 'Etiopia',
  kenia: 'Kenia',
  kolumbia: 'Kolumbia',
  brazylia: 'Brazylia',
  gwatemala: 'Gwatemala',
};

export const processLabels: Record<ProcessId, string> = {
  myta: 'Myta',
  naturalna: 'Naturalna',
  honey: 'Honey',
};

export const processNotes: Record<ProcessId, string> = {
  myta: 'Miąższ schodzi zaraz po zbiorze, a ziarno jest myte. Smak jest czysty i wyraźny.',
  naturalna: 'Cała wiśnia schnie na słońcu. Kawa wychodzi słodka, owocowa i pełna.',
  honey: 'Część miąższu zostaje na ziarnie podczas suszenia. Słodycz bez ciężaru.',
};

export const grindOrder: GrindId[] = ['ziarna', 'espresso', 'kawiarka', 'przelew', 'prasa'];

export const grindLabels: Record<GrindId, string> = {
  ziarna: 'Całe ziarna',
  espresso: 'Espresso, jak cukier puder',
  kawiarka: 'Kawiarka, jak drobna sól',
  przelew: 'Przelew, jak sól morska',
  prasa: 'Prasa francuska, jak gruba sól',
};

export const grindShortLabels: Record<GrindId, string> = {
  ziarna: 'całe ziarna',
  espresso: 'mielenie na espresso',
  kawiarka: 'mielenie do kawiarki',
  przelew: 'mielenie na przelew',
  prasa: 'mielenie do prasy',
};

export const defaultGrindForBrew: Record<BrewMethod, GrindId> = {
  espresso: 'espresso',
  kawiarka: 'kawiarka',
  przelew: 'przelew',
  prasa: 'prasa',
};
