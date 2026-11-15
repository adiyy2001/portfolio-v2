export const business = {
  name: 'Nakrętka',
  street: 'ul. Szybowcowa 91',
  postcode: '54-130',
  city: 'Wrocław',
  district: 'Fabryczna',
  phone: '71 555 01 96',
  phoneHref: 'tel:+48715550196',
  email: 'kontakt@nakretka.example',
  stations: 6,
  torqueModels: 84,
  inspectionPoints: 40,
  maxRepairHours: 72,
} as const;

export const addressLines = [business.street, `${business.postcode} ${business.city}`] as const;

export interface DayHours {
  from: number;
  to: number;
}

export const weekHours: Record<number, DayHours | null> = {
  0: null,
  1: { from: 8, to: 17 },
  2: { from: 8, to: 17 },
  3: { from: 8, to: 17 },
  4: { from: 8, to: 17 },
  5: { from: 8, to: 17 },
  6: { from: 8, to: 12 },
};

export const hoursRows = [
  ['Poniedziałek do piątku', '8:00 do 17:00'],
  ['Sobota', '8:00 do 12:00'],
  ['Niedziela', 'bez przyjęć'],
] as const;

export const hoursShort = ['pn do pt 8:00 do 17:00', 'sob 8:00 do 12:00'] as const;

export const hoursFallback = 'Pn do pt 8:00 do 17:00, sob 8:00 do 12:00';

export interface Fastener {
  nm: number;
  label: string;
  head: string;
  tail: string;
}

export const torqueRange = { min: 10, max: 210, start: 110 } as const;

export const fasteners: Fastener[] = [
  {
    nm: 25,
    label: 'Świeca',
    head: 'Świeca zapłonowa, 25 Nm.',
    tail: 'Aluminium nie wybacza więcej.',
  },
  {
    nm: 35,
    label: 'Odpływ oleju',
    head: 'Korek odpływu oleju, 35 Nm.',
    tail: 'Uszczelka siada równo.',
  },
  {
    nm: 90,
    label: 'Głowica',
    head: 'Głowica silnika, 90 Nm.',
    tail: 'To pierwszy stopień dociągania.',
  },
  {
    nm: 110,
    label: 'Koło',
    head: 'Koło, 110 Nm.',
    tail: 'Tak jak w karcie producenta.',
  },
];

export const processSteps = [
  {
    title: 'Przyjęcie',
    text: 'Spisujemy usterki i oglądamy auto razem z tobą na podnośniku.',
    image: 'shed',
    alt: 'Mechanik w kombinezonie przy aucie stojącym na podnośniku',
    width: 700,
    height: 839,
  },
  {
    title: 'Diagnoza',
    text: 'Mierzymy luzy i zużycie, sprawdzamy układ i spisujemy zakres prac.',
    image: 'shop',
    alt: 'Mechanik klęczy przy aucie w hali, w głębi regał z płynami',
    width: 1700,
    height: 1020,
  },
  {
    title: 'Naprawa',
    text: 'Dokręcamy kluczem dynamometrycznym do wartości z karty producenta.',
    image: 'hands',
    alt: 'Ręce mechanika przy silniku auta',
    width: 800,
    height: 480,
  },
  {
    title: 'Odbiór',
    text: 'Oddajemy auto z protokołem momentów i starymi częściami do wglądu.',
    image: 'rust',
    alt: 'Stare części i klucz płaski leżące na podłodze warsztatu',
    width: 900,
    height: 1348,
  },
] as const;

export const sampleNotice =
  'To strona przykładowa, więc nic nie wysłaliśmy. Zapis jest tylko w tej przeglądarce.';

export const contactNotice =
  'To strona przykładowa, więc wiadomość nigdzie nie poszła. Niczego nie zapisaliśmy.';
