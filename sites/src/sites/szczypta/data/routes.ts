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
    home: '/szczypta/',
    menu: '/szczypta/karta/',
    booking: '/szczypta/rezerwacja/',
    events: '/szczypta/wydarzenia/',
    about: '/szczypta/o-nas/',
    contact: '/szczypta/kontakt/',
    credits: '/szczypta/credits/',
  },
  en: {
    home: '/szczypta/en/',
    menu: '/szczypta/en/menu/',
    booking: '/szczypta/en/booking/',
    events: '/szczypta/en/events/',
    about: '/szczypta/en/about/',
    contact: '/szczypta/en/contact/',
    credits: '/szczypta/en/credits/',
  },
};

export const eventPath = (lang: Lang, slug: string) =>
  lang === 'pl' ? `/szczypta/wydarzenia/${slug}/` : `/szczypta/en/events/${slug}/`;

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
