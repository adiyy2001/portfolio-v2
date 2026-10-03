export type DeliveryId = 'paczkomat' | 'kurier' | 'odbior';

export type PaymentId = 'blik' | 'karta' | 'przelew' | 'gotowka';

export interface DeliveryMethod {
  id: DeliveryId;
  name: string;
  priceGr: number;
  time: string;
  needs: 'locker' | 'address' | 'none';
  note: string;
}

export interface PaymentMethod {
  id: PaymentId;
  name: string;
  note: string;
  pickupOnly: boolean;
}

export const business = {
  name: 'Trzask',
  trade: 'Palarnia kawy, Wrocław',
  email: 'biuro@trzask.example',
  phone: '+48 71 000 00 07',
  phoneHref: 'tel:+48710000007',
  street: 'ul. Drukarska 17',
  city: 'Wrocław',
  pickupHours: [
    ['Wtorek do piątku', '11:00 do 17:00'],
    ['Sobota', '10:00 do 14:00'],
    ['Poniedziałek i\u00a0niedziela', 'zamknięte'],
  ],
} as const;

export const vatRatePercent = 23;

export const freeDeliveryFromGr = 15000;

export const maxLineQuantity = 20;

export const sampleNotice = 'To strona przykładowa, więc nic nie zostało wysłane.';

export const discount = {
  code: 'TRZASK10',
  percent: 10,
} as const;

export const deliveryMethods: DeliveryMethod[] = [
  {
    id: 'paczkomat',
    name: 'Paczkomat',
    priceGr: 1299,
    time: '1 do 2 dni roboczych od wysyłki',
    needs: 'locker',
    note: 'Podasz kod wybranego paczkomatu.',
  },
  {
    id: 'kurier',
    name: 'Kurier',
    priceGr: 1799,
    time: '1 dzień roboczy od wysyłki',
    needs: 'address',
    note: 'Paczka dojedzie pod wskazany adres.',
  },
  {
    id: 'odbior',
    name: 'Odbiór w\u00a0palarni',
    priceGr: 0,
    time: 'od dnia po paleniu, wtorek do piątku 11:00 do 17:00',
    needs: 'none',
    note: 'ul. Drukarska 17, Wrocław. Zadzwonimy, gdy paczka będzie gotowa.',
  },
];

export const paymentMethods: PaymentMethod[] = [
  { id: 'blik', name: 'BLIK', note: 'Kod z\u00a0aplikacji banku.', pickupOnly: false },
  { id: 'karta', name: 'Karta płatnicza', note: 'Visa, Mastercard.', pickupOnly: false },
  { id: 'przelew', name: 'Przelew online', note: 'Wybierasz swój bank.', pickupOnly: false },
  {
    id: 'gotowka',
    name: 'Płatność w\u00a0palarni',
    note: 'Gotówką lub kartą przy odbiorze.',
    pickupOnly: true,
  },
];

export const roastSchedule = {
  roastWeekdays: [2, 4],
  cutoffHour: 12,
} as const;

export interface SubscriptionProfile {
  id: 'filtr' | 'uniwersalna' | 'espresso';
  name: string;
  roast: string;
  blurb: string;
  base250: number;
  examples: string;
}

export interface SubscriptionFrequency {
  id: '2' | '3' | '4';
  weeks: 2 | 3 | 4;
  name: string;
}

export const subscriptionProfiles: SubscriptionProfile[] = [
  {
    id: 'filtr',
    name: 'Filtr',
    roast: 'Jasne palenie',
    blurb:
      'Kwiatowe i\u00a0owocowe kawy z\u00a0Etiopii, Kenii, Rwandy i\u00a0Kolumbii. Do dripperu, AeroPressa i\u00a0chemexa.',
    base250: 52,
    examples: 'Etiopia Gedeb, Kenia Nyeri, Rwanda Nyamasheke',
  },
  {
    id: 'uniwersalna',
    name: 'Uniwersalna',
    roast: 'Średnie palenie',
    blurb:
      'Słodkie kawy z\u00a0Ameryki Środkowej i\u00a0Południowej. Wyjdą i\u00a0z\u00a0dripperu, i\u00a0z\u00a0kawiarki.',
    base250: 44,
    examples: 'Kolumbia Huila, Gwatemala Huehuetenango, Pierwszy Trzask',
  },
  {
    id: 'espresso',
    name: 'Espresso',
    roast: 'Średnie i\u00a0ciemne palenie',
    blurb: 'Gęste, czekoladowe kawy do ekspresu i\u00a0do kawiarki. Dobrze znoszą mleko.',
    base250: 41,
    examples: 'Drugi Trzask, Indonezja Sumatra, Brazylia Mantiqueira',
  },
];

export const subscriptionFrequencies: SubscriptionFrequency[] = [
  { id: '2', weeks: 2, name: 'Co 2 tygodnie' },
  { id: '3', weeks: 3, name: 'Co 3 tygodnie' },
  { id: '4', weeks: 4, name: 'Co 4 tygodnie' },
];
