export const firm = {
  name: 'Sygnet',
  trade: 'Kancelaria prawna',
  foundedYear: 2009,
  casesHandled: 1200,
  firstTalkMinutes: 20,
  firstTalkPricePln: 0,
  replyWorkingDays: 1,
  documentReviewWorkingDays: 3,
  vatPercent: 23,
  stateOfLaw: 'listopad 2026',
  address: {
    street: 'ul. Świdnicka 27',
    postcode: '50-066',
    city: 'Wrocław',
    district: 'Śródmieście',
  },
  phone: { display: '+48 71 555 01 58', href: 'tel:+48715550158' },
  email: 'kontakt@sygnet.example',
  hours: {
    weekdaysLabel: 'Pon. do pt.',
    weekdaysRange: '9:00 do 17:00',
    openMinute: 9 * 60,
    closeMinute: 17 * 60,
    saturday: 'po umówieniu',
  },
} as const;

export const sampleNotice = 'To strona przykładowa, więc nic nie zostało wysłane.';

export const navItems = [
  { key: 'specjalizacje', label: 'Specjalizacje', path: '/sygnet/specjalizacje/' },
  { key: 'zespol', label: 'Zespół', path: '/sygnet/zespol/' },
  { key: 'honorarium', label: 'Honorarium', path: '/sygnet/honorarium/' },
  { key: 'artykuly', label: 'Artykuły', path: '/sygnet/artykuly/' },
  { key: 'kontakt', label: 'Kontakt', path: '/sygnet/kontakt/' },
] as const;

export type NavKey = (typeof navItems)[number]['key'];
