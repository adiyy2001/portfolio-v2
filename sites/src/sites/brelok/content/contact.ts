import { hotel, places } from '../data/hotel';
import { minutesLabel } from '../lib/format';
import type { Lang } from '../i18n/lang';

const saltMinutes = places.find(item => item.id === 'salt')?.minutes ?? 0;

const pl = {
  metaTitle: 'Kontakt i dojazd. Brelok 1912, hotel butikowy we Wrocławiu',
  metaDescription: `Adres, telefon i godziny recepcji hotelu Brelok przy ${hotel.street} we Wrocławiu. Dojazd z Rynku zajmuje ${minutesLabel(hotel.minutesToSquare, 'pl')} pieszo. Formularz jest przykładowy.`,
  heading: 'Kontakt i dojazd',
  lead: 'Recepcja odbiera telefon o każdej porze. Na wiadomość odpowiadamy w ciągu jednego dnia roboczego.',
  detailsHeading: 'Jak nas znaleźć',
  rows: {
    address: 'Adres',
    phone: 'Telefon',
    email: 'E-mail',
    reception: 'Recepcja',
    checkIn: 'Zameldowanie',
    checkOut: 'Wymeldowanie',
  },
  receptionValue: 'czynna całą dobę',
  checkInValue: (time: string) => `od ${time}`,
  checkOutValue: (time: string) => `do ${time}`,
  arrival: [
    `Pieszo z Rynku idzie się do nas ${minutesLabel(hotel.minutesToSquare, 'pl')}. Tramwaj zatrzymuje się pod bramą kamienicy.`,
    `Samochód można zostawić w garażu przy placu Solnym, ${minutesLabel(saltMinutes, 'pl')} od hotelu. Miejsce w garażu wlicza pakiet Weekend we dwoje, w innych pobytach można je zamówić w recepcji.`,
  ],
  mapLabel: `Schemat trasy z hotelu Brelok na Rynek, ${minutesLabel(hotel.minutesToSquare, 'pl')} pieszo`,
  mapCaption: `Trasa pieszo, ${minutesLabel(hotel.minutesToSquare, 'pl')}`,
  market: 'Rynek',
  formHeading: 'Napisz do recepcji',
  formLead: 'Wiadomość trafi tylko do tej przeglądarki, bo to strona przykładowa.',
  noScript: `Formularz działa po włączeniu JavaScriptu. Bez niego prosimy o telefon: ${hotel.phone}.`,
  topicLegend: 'Czego dotyczy wiadomość',
  topics: {
    stay: 'Pobyt',
    voucher: 'Bon podarunkowy',
    group: 'Grupa albo uroczystość',
    other: 'Coś innego',
  },
  send: 'Wyślij wiadomość',
  doneHeading: 'Dziękujemy za wiadomość',
  doneLead: (name: string) =>
    `${name}, odpowiedź przygotowalibyśmy w ciągu jednego dnia roboczego, gdyby to nie była strona przykładowa.`,
  another: 'Napisz kolejną',
  ctaBooking: 'Zarezerwuj pobyt',
  ctaNeighbourhood: 'Okolica',
};

const en: typeof pl = {
  metaTitle: 'Contact and directions. Brelok 1912, boutique hotel in Wrocław',
  metaDescription: `Address, phone and reception hours of the Brelok hotel at ${hotel.streetEn} in Wrocław. It is ${minutesLabel(hotel.minutesToSquare, 'en')} on foot from the Market Square. The form is a sample.`,
  heading: 'Contact and directions',
  lead: 'Reception answers the phone at any hour. We reply to messages within one working day.',
  detailsHeading: 'How to find us',
  rows: {
    address: 'Address',
    phone: 'Phone',
    email: 'Email',
    reception: 'Reception',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
  },
  receptionValue: 'open around the clock',
  checkInValue: (time: string) => `from ${time}`,
  checkOutValue: (time: string) => `until ${time}`,
  arrival: [
    `From the Market Square it is ${minutesLabel(hotel.minutesToSquare, 'en')} on foot. The tram stops at the gate of the townhouse.`,
    `You can leave a car in the garage by Plac Solny, ${minutesLabel(saltMinutes, 'en')} from the hotel. The Weekend for two package includes a place in the garage, and for other stays you can book one at reception.`,
  ],
  mapLabel: `Route map from the Brelok hotel to the Market Square, ${minutesLabel(hotel.minutesToSquare, 'en')} on foot`,
  mapCaption: `Walking route, ${minutesLabel(hotel.minutesToSquare, 'en')}`,
  market: 'Market',
  formHeading: 'Write to reception',
  formLead: 'The message stays in this browser only, because this is a sample site.',
  noScript: `The form needs JavaScript. Without it, please call us: ${hotel.phone}.`,
  topicLegend: 'What the message is about',
  topics: {
    stay: 'A stay',
    voucher: 'Gift voucher',
    group: 'A group or an event',
    other: 'Something else',
  },
  send: 'Send the message',
  doneHeading: 'Thank you for your message',
  doneLead: (name: string) =>
    `${name}, we would reply within one working day, if this were not a sample site.`,
  another: 'Write another',
  ctaBooking: 'Book a stay',
  ctaNeighbourhood: 'Neighbourhood',
};

export type TopicId = keyof typeof pl.topics;

export const topicIds: readonly TopicId[] = ['stay', 'voucher', 'group', 'other'];

export const contactText: Record<Lang, typeof pl> = { pl, en };
