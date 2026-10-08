import { facts, pl } from './data';

export const app = {
  slug: 'poludnie',
  name: 'Południe',
  category: 'Domowa fotowoltaika i magazyn energii',
  city: 'dom pod Opolem',
  zone: '8,2 kWp, magazyn 10,2 kWh',
  tagline: 'Przepływ energii na żywo, dzień na jednym wykresie i porada, kiedy włączyć pralkę, żeby prąd szedł prosto z dachu.',
};

export const kw = (value: number) => `${pl(value)} kW`;
export const kwh = (value: number) => `${pl(value)} kWh`;
export const zl = (value: number) => `${value.toFixed(2).replace('.', ',')} zł`;

export const tabs = [
  { id: 'now', label: 'Teraz' },
  { id: 'day', label: 'Dzień' },
  { id: 'tips', label: 'Porady' },
  { id: 'balance', label: 'Bilans' },
] as const;

export type TabId = (typeof tabs)[number]['id'];

export const now = {
  title: 'Teraz',
  sub: `${facts.date} · słonecznie`,
  label: 'z dachu',
  rows: [
    { hue: 'home' as const, name: 'Dom', note: 'zużywa teraz', value: kw(facts.now.home) },
    { hue: 'battery' as const, name: 'Magazyn', note: `ładuje się, ${facts.now.soc}%`, value: kw(facts.now.battery) },
    { hue: 'grid' as const, name: 'Sieć', note: 'oddajesz nadwyżkę', value: kw(facts.now.grid) },
  ],
};

export const battery = {
  back: 'Teraz',
  title: 'Magazyn',
  stored: `${pl(facts.now.stored)} z ${pl(10.2)} kWh`,
  rate: `ładuje się ${kw(facts.now.battery)}`,
  chart: 'Naładowanie dziś',
  full: `Pełny o ${facts.now.fullAt}`,
  reserve: `rezerwa ${facts.now.socMin}% na wypadek awarii sieci`,
};

export const day = {
  title: 'Dzień',
  sub: `${facts.date}, do ${facts.day.time}`,
  label: 'z dachu',
  peak: `${kw(facts.day.peak)} o ${facts.day.peakAt}`,
  prodSplit: [
    { hue: 'home' as const, name: 'do domu', value: facts.day.direct },
    { hue: 'battery' as const, name: 'do magazynu', value: facts.day.charged },
    { hue: 'grid' as const, name: 'do sieci', value: facts.day.exported },
  ],
  useSplit: [
    { hue: 'sun' as const, name: 'z dachu', value: facts.day.fromRoof },
    { hue: 'battery' as const, name: 'z magazynu', value: facts.day.fromBattery },
    { hue: 'grid' as const, name: 'z sieci', value: facts.day.fromGrid },
  ],
};

export const tips = {
  title: 'Kiedy włączyć',
  sub: `${facts.tip.day} · słonecznie`,
  forecast: `Prognoza z dachu ${kwh(facts.tip.forecastKwh)}`,
  main: facts.tip.main,
  more: facts.tip.more,
};

export const balance = {
  title: 'Bilans',
  segments: ['Dziś', 'Maj'],
  ringLabel: 'samowystarczalności',
  ringSub: `dziś do ${facts.day.time}`,
  value: 'Wartość dnia',
  prices: 'ceny przykładowe',
  rows: [
    { label: `${kwh(facts.day.notBought)} nie kupione × 1,08 zł`, value: zl(facts.day.savedZl) },
    { label: `${kwh(facts.day.exported)} sprzedane × 0,24 zł`, value: zl(facts.day.soldZl) },
  ],
};

export const month = {
  title: 'Bilans',
  label: facts.month.label,
  stats: [
    { value: `${facts.month.selfSufficiency}%`, label: 'samowystarczalności' },
    { value: kwh(facts.month.use), label: 'zużycia domu' },
    { value: zl(facts.month.valueZl), label: 'wartość, ceny przykładowe' },
  ],
};

export const install = {
  title: 'Instalacja',
  sub: 'Dom pod Opolem',
  rows: [
    ['Moc', '8,2 kWp'],
    ['Panele', '20 × 410 W'],
    ['Dach', facts.install.roof],
    ['Falownik', 'hybrydowy, 8 kW'],
    ['Magazyn', '10,2 kWh, LFP, do 3 kW'],
    ['Rezerwa', '30% na wypadek awarii sieci'],
    ['Rozliczenie', 'net-billing, licznik dwukierunkowy'],
    ['Działa od', facts.install.since],
    ['Z dachu łącznie', '9,4 MWh'],
  ] as [string, string][],
};

export const launch = { tagline: 'Słońce, magazyn i dom w liczbach' };

export const gallery = [
  { n: 1, title: 'Teraz', caption: 'Izometryczny dom z czterema przepływami: 6,4 kW z dachu dzieli się na 0,5 kW do domu, 1,3 kW do magazynu i 4,6 kW do sieci.' },
  { n: 2, title: 'Magazyn', caption: 'Bateria 10,2 kWh naładowana w 95%. Krzywa pokazuje dzień od rezerwy 30% o 6:15 do teraz i plan: pełny o 13:40.' },
  { n: 3, title: 'Dzień', caption: 'Produkcja i zużycie na jednym wykresie, szczyt 6,4 kW o 13:10. Pod spodem bilans: 47,8 kWh z dachu to 7,5 do domu, 7,5 do magazynu i 32,8 do sieci.' },
  { n: 4, title: 'Kiedy włączyć', caption: 'Prognoza na jutro i okno dla pralki od 12:30 do 14:00, kiedy dach ma 4,1 kW nadwyżki. Zmywarka i bojler dostają swoje okna.' },
  { n: 5, title: 'Bilans dnia', caption: 'Samowystarczalność 92%: 7,5 kWh z dachu, 6,6 z magazynu i tylko 1,2 z sieci. Wartość dnia 23,10 zł w cenach przykładowych.' },
  { n: 6, title: 'Miesiąc', caption: 'Maj dzień po dniu: 462,4 kWh z dachu, 81% samowystarczalności i 255,36 zł wartości w cenach przykładowych.' },
  { n: 7, title: 'Instalacja', caption: 'Dane systemu w jednym miejscu: 20 paneli po 410 W, falownik hybrydowy 8 kW, magazyn 10,2 kWh z rezerwą 30%.' },
] as const;
