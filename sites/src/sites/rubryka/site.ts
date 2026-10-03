export const site = {
  name: 'Rubryka',
  tagline: 'Biuro rachunkowe dla małych firm',
  themeColor: '#0f1f3d',
  locale: 'pl_PL',
  stateOn: 'październik 2026',
  phone: '+48 71 000 00 02',
  phoneHref: 'tel:+48710000002',
  email: 'biuro@rubryka.example',
  street: 'ul. Kazimierza Wielkiego 45/3',
  postalCity: '50-077 Wrocław',
  hours: 'pn-pt 8:00-16:00',
} as const;

export const nav = [
  { path: '/rubryka/uslugi/', label: 'Usługi' },
  { path: '/rubryka/pakiety/', label: 'Pakiety' },
  { path: '/rubryka/przewodnik-po-ksef/', label: 'Przewodnik po KSeF' },
  { path: '/rubryka/kontakt/', label: 'Kontakt' },
] as const;

export const quotePath = '/rubryka/kontakt/#wycena';
