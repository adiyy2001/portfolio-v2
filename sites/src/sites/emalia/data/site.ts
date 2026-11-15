export const clinic = {
  name: 'Emalia',
  trade: 'gabinet stomatologiczny',
  district: 'Krzyki',
  street: 'ul. Borowska 120',
  postalCode: '50-552',
  city: 'Wrocław',
  phoneDisplay: '+48 71 555 01 19',
  phoneHref: 'tel:+48715550119',
  email: 'kontakt@emalia.example',
  emailHref: 'mailto:kontakt@emalia.example',
} as const;

export const facts = {
  yearsOfPractice: 12,
  surgeries: 'trzech',
  patientsOnFile: '4 200',
  painPromise: 'tego samego albo następnego dnia roboczego',
} as const;

export const openingHours = [
  { days: 'Poniedziałek do piątku', hours: '8:00 do 19:00' },
  { days: 'Sobota', hours: '9:00 do 13:00' },
  { days: 'Niedziela', hours: 'zamknięte' },
] as const;

export const bookingPath = '/emalia/kontakt/#umow-wizyte';

export const visitSegments = [
  {
    id: 'rozmowa',
    name: 'Rozmowa',
    minutes: 15,
    text: 'Pytamy o dolegliwości, leki i dotychczasowe leczenie. Ty pytasz o wszystko, co cię niepokoi.',
  },
  {
    id: 'badanie',
    name: 'Badanie',
    minutes: 35,
    text: 'Lekarz ogląda zęby, dziąsła i zgryz, robimy zdjęcie pantomograficzne i opisujemy je razem z tobą.',
  },
  {
    id: 'plan',
    name: 'Plan',
    minutes: 10,
    text: 'Zapisujemy na kartce kolejność zabiegów i cenę każdego z nich. Kartkę zabierasz do domu.',
  },
] as const;

export const visitMinutes = visitSegments.reduce((sum, segment) => sum + segment.minutes, 0);

export const priceLead =
  'Każda pozycja ma cenę od. Przegląd podnoszą tylko dodatkowe zdjęcia punktowe, resztę ustalamy po przeglądzie i wpisujemy na kartkę przed zabiegiem.';

export const shades = [
  { id: 'A1', color: '#E9EBF3' },
  { id: 'A2', color: '#E6DECF' },
  { id: 'B1', color: '#DFD2AE' },
  { id: 'B2', color: '#D6BE8C' },
  { id: 'C1', color: '#CBA66B' },
] as const;

export const formTopics = [
  'Przegląd',
  'Higienizacja',
  'Wybielanie',
  'Leczenie kanałowe',
  'Ból zęba',
  'Inna sprawa',
] as const;

export const sampleStatus =
  'Dane są poprawne. To strona przykładowa, więc zgłoszenie nigdzie nie zostało wysłane.';
