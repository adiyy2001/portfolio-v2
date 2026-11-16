export const business = {
  name: 'Biuro Rachunkowe Gajowice',
  legalName: 'Biuro Rachunkowe Gajowice',
  tagline: 'Biuro rachunkowe, Wrocław, Gajowice',
  themeColor: '#f4f4f4',
  locale: 'pl_PL',
  phone: '+48 71 555 01 65',
  phoneHref: 'tel:+48715550165',
  email: 'kontakt@biuro-rachunkowe-gajowice.example',
  street: 'ul. Gajowicka 87',
  postalCity: '53-421 Wrocław',
  district: 'Gajowice',
  nip: '897 000 10 01',
  owner: 'Magdalena Sowińska',
  ownerRole: 'główna księgowa, certyfikat księgowy Ministra Finansów',
  insurance: 'ubezpieczenie odpowiedzialności cywilnej',
  insuranceNote: 'polisę pokazujemy na życzenie',
  stateOn: '15 listopada 2026',
} as const;

export const facts = {
  firms: 240,
  firmsFromGajowice: 85,
  replyHours: 4,
  paperPickupEvery: 'raz w tygodniu',
  onboardingWeeks: 2,
  takeoverFee: 300,
} as const;

export const openHours = {
  fromMinutes: 8 * 60,
  toMinutes: 16 * 60,
  label: 'od poniedziałku do piątku, 8:00 do 16:00',
  short: 'pn do pt, 8:00 do 16:00',
} as const;

export const navItems = [
  { key: 'uslugi', path: '/biuro-rachunkowe-gajowice/uslugi/', label: 'usługi' },
  { key: 'pakiety', path: '/biuro-rachunkowe-gajowice/pakiety/', label: 'pakiety' },
  { key: 'ksef', path: '/biuro-rachunkowe-gajowice/przewodnik-po-ksef/', label: 'ksef' },
  { key: 'terminy', path: '/biuro-rachunkowe-gajowice/terminy/', label: 'terminy' },
  { key: 'kontakt', path: '/biuro-rachunkowe-gajowice/kontakt/', label: 'kontakt' },
] as const;

export type NavKey = (typeof navItems)[number]['key'];

export const homePath = '/biuro-rachunkowe-gajowice/';
export const quotePath = '/biuro-rachunkowe-gajowice/kontakt/#wycena';
export const creditsPath = '/biuro-rachunkowe-gajowice/credits/';
