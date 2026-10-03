import type { Lang, PageKey } from '../i18n/lang';
import { tieDeep } from '../lib/typography';
import { hotel } from './facts';

export interface Common {
  skip: string;
  menu: string;
  mainNav: string;
  tagline: string;
  book: string;
  bookLong: string;
  nav: Record<PageKey, string>;
  languageLabel: string;
  languageNames: Record<Lang, string>;
  addressLabel: string;
  footer: {
    about: string;
    hotelHeading: string;
    stayHeading: string;
    checkIn: string;
    checkOut: string;
    reception: string;
    footerLinks: PageKey[];
    stayLinks: PageKey[];
  };
  sampleSent: string;
  sampleBooking: string;
  noScriptBooking: string;
}

const pl: Common = {
  skip: 'Przejdź do treści',
  menu: 'Menu',
  mainNav: 'Menu główne',
  tagline: 'Dwadzieścia cztery pokoje w odnowionej kamienicy nad Odrą.',
  book: 'Rezerwuj',
  bookLong: 'Zarezerwuj pobyt',
  nav: {
    home: 'Start',
    rooms: 'Pokoje',
    booking: 'Rezerwacja',
    myBooking: 'Moja rezerwacja',
    packages: 'Pakiety',
    voucher: 'Bon podarunkowy',
    breakfast: 'Śniadania',
    neighbourhood: 'Okolica',
    contact: 'Kontakt',
  },
  languageLabel: 'Język',
  languageNames: { pl: 'polski', en: 'English' },
  addressLabel: 'Adres hotelu',
  footer: {
    about:
      'Hotel w odnowionej kamienicy z 1893 roku, dwadzieścia cztery pokoje i klucze wiszące w recepcji.',
    hotelHeading: 'Hotel',
    stayHeading: 'Pobyt',
    checkIn: `Zameldowanie od ${hotel.checkIn}`,
    checkOut: `Wymeldowanie do ${hotel.checkOut}`,
    reception: `Recepcja od ${hotel.receptionOpens} do ${hotel.receptionCloses}`,
    footerLinks: ['rooms', 'packages', 'breakfast', 'neighbourhood', 'contact'],
    stayLinks: ['booking', 'myBooking', 'voucher'],
  },
  sampleSent: 'To strona przykładowa, więc nic nie zostało wysłane.',
  sampleBooking: 'To strona przykładowa, więc nic nie zostało zarezerwowane ani pobrane z karty.',
  noScriptBooking: `Ta część strony wymaga włączonego JavaScriptu. Zadzwoń pod ${hotel.phone} albo napisz na ${hotel.email}.`,
};

const en: Common = {
  skip: 'Skip to content',
  menu: 'Menu',
  mainNav: 'Main menu',
  tagline: 'Twenty-four rooms in a restored tenement by the Oder.',
  book: 'Book',
  bookLong: 'Book your stay',
  nav: {
    home: 'Home',
    rooms: 'Rooms',
    booking: 'Booking',
    myBooking: 'My booking',
    packages: 'Packages',
    voucher: 'Gift voucher',
    breakfast: 'Breakfast',
    neighbourhood: 'Neighbourhood',
    contact: 'Contact',
  },
  languageLabel: 'Language',
  languageNames: { pl: 'polski', en: 'English' },
  addressLabel: 'Hotel address',
  footer: {
    about:
      'A hotel in a restored tenement from 1893: twenty-four rooms and keys that hang at reception.',
    hotelHeading: 'The hotel',
    stayHeading: 'Your stay',
    checkIn: `Check-in from ${hotel.checkIn}`,
    checkOut: `Check-out until ${hotel.checkOut}`,
    reception: `Reception ${hotel.receptionOpens} to ${hotel.receptionCloses}`,
    footerLinks: ['rooms', 'packages', 'breakfast', 'neighbourhood', 'contact'],
    stayLinks: ['booking', 'myBooking', 'voucher'],
  },
  sampleSent: 'This is a sample website, so nothing was sent.',
  sampleBooking: 'This is a sample website, so nothing was booked or charged to a card.',
  noScriptBooking: `This part of the page needs JavaScript. Call ${hotel.phone} or write to ${hotel.email}.`,
};

export const common: Record<Lang, Common> = { pl: tieDeep(pl), en: tieDeep(en) };
