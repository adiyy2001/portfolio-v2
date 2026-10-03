export const clinic = {
  name: 'Szkliwo',
  trade: 'klinika stomatologiczna',
  tagline: 'Uśmiech bez pośpiechu.',
  street: 'ul. Pułaskiego 28/3',
  postalCode: '50-446',
  city: 'Wrocław',
  phoneDisplay: '+48 71 000 00 03',
  phoneHref: 'tel:+48710000003',
  email: 'biuro@szkliwo.example',
} as const;

export const navigation = [
  { path: '/zabiegi/', label: 'Zabiegi' },
  { path: '/cennik/', label: 'Cennik' },
  { path: '/zespol/', label: 'Zespół' },
  { path: '/przed-i-po/', label: 'Przed i po' },
  { path: '/kontakt/', label: 'Kontakt' },
] as const;

export const bookingPath = '/kontakt/#umow-wizyte';

export const hoursSummary = [
  { days: 'Pon-pt', hours: '8:00-20:00' },
  { days: 'Sob', hours: '9:00-14:00' },
  { days: 'Niedz. i święta', hours: 'nieczynne' },
] as const;
