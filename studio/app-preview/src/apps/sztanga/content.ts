export const app = {
  slug: 'sztanga',
  name: 'Sztanga',
  category: 'Dziennik treningu siłowego',
  city: 'cała Polska',
  zone: 'tydzień 3 z 4, dzień B',
  tagline: 'Plan, talerze, przerwa i rekordy w liczbach widocznych z ławki.',
};

export const session = {
  week: 'TYDZIEŃ 3 Z 4',
  day: 'DZIEŃ B',
  time: '18:24',
  bar: 20,
};

export type LiftId = 'squat' | 'bench' | 'deadlift';

export const lifts: Record<LiftId, { name: string; short: string; sets: number; reps: number; load: string; loadKg: number; percent: string; last: string; plates: number[] }> = {
  squat: { name: 'PRZYSIAD', short: 'PRZYSIAD', sets: 5, reps: 3, load: '140', loadKg: 140, percent: '85%', last: '137,5 KG × 3', plates: [25, 25, 10] },
  bench: { name: 'WYCISKANIE LEŻĄC', short: 'WYCISKANIE', sets: 5, reps: 5, load: '92,5', loadKg: 92.5, percent: '75%', last: '90 KG × 5', plates: [25, 10, 1.25] },
  deadlift: { name: 'MARTWY CIĄG', short: 'MARTWY CIĄG', sets: 1, reps: 2, load: '185', loadKg: 185, percent: '96%', last: '180 KG × 2', plates: [25, 25, 25, 7.5] },
};

export const plan: LiftId[] = ['squat', 'bench', 'deadlift'];

export const setScreen = {
  set: 'SERIA',
  reps: 'POWT.',
  lastWeek: 'TYDZIEŃ TEMU',
  done: 'ZALICZONA',
  last: 'OSTATNIA SERIA',
};

export const plates = {
  title: 'TALERZE',
  subtitle: 'NA STRONĘ',
  perSide: '60',
  formula: 'SZTANGA 20 KG + 2 × 60 KG = 140 KG',
};

export const rest = {
  title: 'PRZERWA',
  seconds: 180,
  next: 'DALEJ',
  nextSet: 'SERIA 4/5',
  nextLoad: '140 KG × 3 POWT.',
  add: '+30 S',
  skip: 'POMIŃ',
};

export const record = {
  title: 'REKORD',
  lift: 'MARTWY CIĄG',
  result: '185 × 2',
  oneRm: '1RM ≈ 197 KG',
  formula: 'EPLEY: 185 × (1 + 2/30) = 197,3',
  previous: 'POPRZEDNI: 180 × 2, 1RM 192 KG',
  gain: '+5 KG DO SZACOWANEGO 1RM',
};

export const history = {
  title: 'HISTORIA',
  lift: 'MARTWY CIĄG',
  subtitle: 'SZACOWANE 1RM, 8 TYGODNI',
  weeks: [
    { date: '18.08', value: 176 },
    { date: '25.08', value: 178 },
    { date: '1.09', value: 181 },
    { date: '8.09', value: 183 },
    { date: '15.09', value: 186 },
    { date: '22.09', value: 189 },
    { date: '29.09', value: 192 },
    { date: '6.10', value: 197 },
  ],
  gain: '+21 KG OD SIERPNIA',
};

export const launch = { tagline: 'DZIENNIK TRENINGU SIŁOWEGO' };

export const gallery = [
  { n: 1, title: 'Seria', caption: 'Ciężar na całą szerokość ekranu, numer serii i powtórzenia. Jeden duży przycisk po serii.' },
  { n: 2, title: 'Plan dnia', caption: 'Trzy boje dnia B jako trzy linie, każda dopasowana osią szerokości do ekranu.' },
  { n: 3, title: 'Talerze', caption: 'Ile i jakich talerzy założyć na stronę, policzone za ciebie: 25, 25 i 10 kg.' },
  { n: 4, title: 'Przerwa', caption: 'Minutnik 3:00 czytelny z ławki i podgląd następnej serii.' },
  { n: 5, title: 'Rekord', caption: 'Ekran odwraca się na pomarańcz: 185 × 2 w martwym ciągu, szacowane 1RM 197 kg.' },
  { n: 6, title: 'Historia', caption: 'Osiem tygodni szacowanego 1RM w martwym ciągu, od 176 do 197 kg.' },
] as const;
