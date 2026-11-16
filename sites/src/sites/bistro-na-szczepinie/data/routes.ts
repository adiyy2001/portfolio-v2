import type { Lang } from './lang';

export const pageIds = [
  'home',
  'menu',
  'booking',
  'events',
  'about',
  'contact',
  'credits',
] as const;

export type PageId = (typeof pageIds)[number];

export const bilingualPages = [
  'home',
  'menu',
  'booking',
  'events',
  'about',
  'contact',
  'credits',
] as const;

export const paths: Record<Lang, Partial<Record<PageId, string>>> = {
  pl: {
    home: '/bistro-na-szczepinie/',
    menu: '/bistro-na-szczepinie/karta/',
    booking: '/bistro-na-szczepinie/rezerwacja/',
    events: '/bistro-na-szczepinie/wydarzenia/',
    about: '/bistro-na-szczepinie/o-nas/',
    contact: '/bistro-na-szczepinie/kontakt/',
    credits: '/bistro-na-szczepinie/credits/',
  },
  en: {
    home: '/bistro-na-szczepinie/en/',
    menu: '/bistro-na-szczepinie/en/menu/',
    booking: '/bistro-na-szczepinie/en/booking/',
    events: '/bistro-na-szczepinie/en/events/',
    about: '/bistro-na-szczepinie/en/about/',
    contact: '/bistro-na-szczepinie/en/contact/',
    credits: '/bistro-na-szczepinie/en/credits/',
  },
};

export const eventPath = (lang: Lang, slug: string) =>
  lang === 'pl'
    ? `/bistro-na-szczepinie/wydarzenia/${slug}/`
    : `/bistro-na-szczepinie/en/events/${slug}/`;

export const otherLang = (lang: Lang): Lang => (lang === 'pl' ? 'en' : 'pl');

export const pathOf = (lang: Lang, page: PageId) => paths[lang][page]!;

export const hasTranslation = (page: PageId) =>
  (bilingualPages as readonly string[]).includes(page);

export interface PagePair {
  pl: string;
  en: string;
}

export const switchTarget = (lang: Lang, page: PageId, pair?: PagePair) => {
  const target = otherLang(lang);
  return pair?.[target] ?? paths[target][page] ?? paths[target].home!;
};
