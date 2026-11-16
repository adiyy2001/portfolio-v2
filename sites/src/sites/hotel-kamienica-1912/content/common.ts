import type { Lang, PageKey } from '../i18n/lang';

const pl = {
  skip: 'Przejdź do treści',
  mainNav: 'Główna nawigacja',
  footerNav: 'Mapa strony',
  menu: 'Menu',
  reserve: 'Rezerwacja',
  languageLabel: 'Język strony',
  languageNames: { pl: 'polski', en: 'angielski' },
  homeLabel: 'Hotel Kamienica 1912, strona główna',
  nav: {
    home: 'Strona główna',
    rooms: 'Pokoje',
    booking: 'Rezerwacja',
    myBooking: 'Moja rezerwacja',
    packages: 'Pakiety',
    breakfast: 'Śniadanie',
    neighbourhood: 'Okolica',
    voucher: 'Bon podarunkowy',
    contact: 'Kontakt',
    credits: 'Źródła zdjęć i fontów',
  } satisfies Record<PageKey, string>,
  footer: {
    reception: 'Recepcja czynna całą dobę',
    credits: 'Źródła zdjęć i fontów',
    addressLabel: 'Adres i kontakt',
  },
  ogAlt:
    'Hotel Kamienica 1912 we Wrocławiu: mosiężny brelok z literą K i napis Czternaście pokoi i jeden klucz do miasta',
  sampleName: 'Hotel Kamienica 1912',
  photoNote: 'Zdjęcie poglądowe',
};

const en: typeof pl = {
  skip: 'Skip to content',
  mainNav: 'Main navigation',
  footerNav: 'Site map',
  menu: 'Menu',
  reserve: 'Reserve',
  languageLabel: 'Page language',
  languageNames: { pl: 'Polish', en: 'English' },
  homeLabel: 'Hotel Kamienica 1912, home page',
  nav: {
    home: 'Home',
    rooms: 'Rooms',
    booking: 'Booking',
    myBooking: 'My booking',
    packages: 'Packages',
    breakfast: 'Breakfast',
    neighbourhood: 'Neighbourhood',
    voucher: 'Gift voucher',
    contact: 'Contact',
    credits: 'Photo and font credits',
  },
  footer: {
    reception: 'Reception open around the clock',
    credits: 'Photo and font credits',
    addressLabel: 'Address and contact',
  },
  ogAlt:
    'Hotel Kamienica 1912 in Wrocław: a brass key fob with the letter K and the words Fourteen rooms and one key to the city',
  sampleName: 'Hotel Kamienica 1912',
  photoNote: 'Illustrative photo',
};

export const common: Record<Lang, typeof pl> = { pl, en };

export const menuKeys: readonly PageKey[] = [
  'rooms',
  'packages',
  'breakfast',
  'neighbourhood',
  'voucher',
  'contact',
];

export const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI'] as const;

export const footerKeys: readonly PageKey[] = [
  'rooms',
  'booking',
  'myBooking',
  'packages',
  'breakfast',
  'neighbourhood',
  'voucher',
  'contact',
];
