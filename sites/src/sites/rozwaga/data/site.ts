import type { Shift } from '../lib/hours';

export const site = {
  name: 'Rozwaga',
  slug: 'rozwaga',
  kind: 'kancelaria radcy prawnego',
  locale: 'pl_PL',
  street: 'ul. Kuźnicza 40, lok. 4',
  postalCode: '50-138',
  city: 'Wrocław',
  phone: '+48 71 000 00 01',
  phoneHref: '+48710000001',
  email: 'biuro@rozwaga.example',
  hourlyRateNet: 380,
  vatRate: 0.23,
  freeCallMinutes: 20,
} as const;

export const shifts: Shift[] = [
  { weekdays: [1, 2, 3, 4], from: 9 * 60, to: 17 * 60 },
  { weekdays: [5], from: 9 * 60, to: 15 * 60 },
];

export const hoursRows = [
  { days: 'poniedziałek-czwartek', time: '9:00-17:00' },
  { days: 'piątek', time: '9:00-15:00' },
  { days: 'sobota, niedziela i święta', time: 'zamknięte' },
] as const;

export const navigation = [
  { href: '/specjalizacje/', label: 'Specjalizacje' },
  { href: '/zespol/', label: 'Zespół' },
  { href: '/artykuly/', label: 'Artykuły' },
  { href: '/kontakt/', label: 'Kontakt' },
] as const;

export const grossFromNet = (net: number): number =>
  Math.round(net * (1 + site.vatRate) * 100) / 100;

export const formatZloty = (amount: number): string => {
  const hasFraction = amount % 1 !== 0;
  const text = amount.toLocaleString('pl-PL', {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
    useGrouping: false,
  });
  const [whole = '', fraction] = text.split(',');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${fraction ? `${grouped},${fraction}` : grouped} zł`;
};
