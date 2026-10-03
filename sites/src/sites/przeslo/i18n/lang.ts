export type Lang = 'pl' | 'en';

export const languages: readonly Lang[] = ['pl', 'en'];

export const otherLanguage = (lang: Lang): Lang => (lang === 'pl' ? 'en' : 'pl');

export type PageKey =
  | 'home'
  | 'rooms'
  | 'booking'
  | 'myBooking'
  | 'packages'
  | 'voucher'
  | 'breakfast'
  | 'neighbourhood'
  | 'contact';

const segments: Record<PageKey, Record<Lang, string>> = {
  home: { pl: '', en: 'en/' },
  rooms: { pl: 'pokoje/', en: 'en/rooms/' },
  booking: { pl: 'rezerwacja/', en: 'en/booking/' },
  myBooking: { pl: 'moja-rezerwacja/', en: 'en/my-booking/' },
  packages: { pl: 'pakiety/', en: 'en/packages/' },
  voucher: { pl: 'bon-podarunkowy/', en: 'en/gift-voucher/' },
  breakfast: { pl: 'sniadania/', en: 'en/breakfast/' },
  neighbourhood: { pl: 'okolica/', en: 'en/neighbourhood/' },
  contact: { pl: 'kontakt/', en: 'en/contact/' },
};

export const pagePath = (key: PageKey, lang: Lang, roomSlug?: string): string =>
  `/przeslo/${segments[key][lang]}${roomSlug ? `${roomSlug}/` : ''}`;

export const pageKeys = Object.keys(segments) as PageKey[];

export const htmlLocale: Record<Lang, string> = { pl: 'pl_PL', en: 'en_GB' };
