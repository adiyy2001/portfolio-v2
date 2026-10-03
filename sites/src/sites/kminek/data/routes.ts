import type { Lang } from './lang';

export const pageIds = ['home', 'menu', 'events', 'about', 'booking'] as const;

export type PageId = (typeof pageIds)[number];

export const paths: Record<Lang, Record<PageId, string>> = {
  pl: {
    home: '/kminek/',
    menu: '/kminek/karta/',
    events: '/kminek/wydarzenia/',
    about: '/kminek/o-nas/',
    booking: '/kminek/rezerwacja/',
  },
  en: {
    home: '/kminek/en/',
    menu: '/kminek/en/menu/',
    events: '/kminek/en/events/',
    about: '/kminek/en/about/',
    booking: '/kminek/en/booking/',
  },
};

export const otherLang = (lang: Lang): Lang => (lang === 'pl' ? 'en' : 'pl');
