export type Lang = 'pl' | 'en';

export const languages: readonly Lang[] = ['pl', 'en'];

export const otherLanguage = (lang: Lang): Lang => (lang === 'pl' ? 'en' : 'pl');

export type PageKey =
  | 'home'
  | 'rooms'
  | 'booking'
  | 'myBooking'
  | 'packages'
  | 'breakfast'
  | 'neighbourhood'
  | 'voucher'
  | 'contact'
  | 'credits';

const segments: Record<PageKey, Record<Lang, string>> = {
  home: { pl: '', en: 'en/' },
  rooms: { pl: 'pokoje/', en: 'en/rooms/' },
  booking: { pl: 'rezerwacja/', en: 'en/booking/' },
  myBooking: { pl: 'moja-rezerwacja/', en: 'en/my-booking/' },
  packages: { pl: 'pakiety/', en: 'en/packages/' },
  breakfast: { pl: 'sniadanie/', en: 'en/breakfast/' },
  neighbourhood: { pl: 'okolica/', en: 'en/neighbourhood/' },
  voucher: { pl: 'bon-podarunkowy/', en: 'en/gift-voucher/' },
  contact: { pl: 'kontakt/', en: 'en/contact/' },
  credits: { pl: 'credits/', en: 'en/credits/' },
};

export const pagePath = (key: PageKey, lang: Lang, roomSlug?: string): string =>
  `/hotel-kamienica-1912/${segments[key][lang]}${roomSlug ? `${roomSlug}/` : ''}`;

export const pageKeys = Object.keys(segments) as PageKey[];

export const htmlLocale: Record<Lang, string> = { pl: 'pl_PL', en: 'en_GB' };
