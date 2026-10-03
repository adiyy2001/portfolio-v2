import type { Lang } from '../i18n/lang';
import { roomTypeById } from '../data/rooms';
import { stayOf } from './booking';
import type { StoredBooking } from './booking';
import { toIsoDate } from './dates';

const lineBreak = '\r\n';
const maxLineOctets = 75;

interface IcsLabels {
  summary: string;
  location: string;
  code: string;
  room: string;
  guests: string;
  times: string;
  reception: string;
  sample: string;
  alarm: string;
  roomNames: Record<string, string>;
}

const labels: Record<Lang, IcsLabels> = {
  pl: {
    summary: 'Pobyt w hotelu Przęsło',
    location: 'Hotel Przęsło, ul. Grodzka 31, 50-137 Wrocław',
    code: 'Kod rezerwacji',
    room: 'Pokój',
    guests: 'Liczba osób',
    times: 'Zameldowanie od 15:00, wymeldowanie do 11:00',
    reception: 'Recepcja: +48 71 000 00 09, codziennie 7:00-22:00',
    sample: 'To rezerwacja przykładowa. Nic nie zostało zarezerwowane ani pobrane.',
    alarm: 'Jutro zameldowanie w hotelu Przęsło',
    roomNames: {
      podworzowy: 'podwórzowy',
      klasyczny: 'klasyczny',
      nadrzeczny: 'z widokiem na Odrę',
      rodzinny: 'rodzinny',
      poddasze: 'poddasze',
    },
  },
  en: {
    summary: 'Stay at Hotel Przęsło',
    location: 'Hotel Przęsło, ul. Grodzka 31, 50-137 Wrocław',
    code: 'Booking code',
    room: 'Room',
    guests: 'Guests',
    times: 'Check-in from 15:00, check-out until 11:00',
    reception: 'Reception: +48 71 000 00 09, daily 7:00-22:00',
    sample: 'This is a sample booking. Nothing was booked or charged.',
    alarm: 'Check-in at Hotel Przęsło is tomorrow',
    roomNames: {
      podworzowy: 'courtyard',
      klasyczny: 'classic',
      nadrzeczny: 'river view',
      rodzinny: 'family',
      poddasze: 'attic',
    },
  },
};

export const escapeIcsText = (value: string): string =>
  value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

export const foldIcsLine = (line: string): string => {
  const encoder = new TextEncoder();
  const physical: string[] = [];
  let current = '';
  let octets = 0;
  let limit = maxLineOctets;
  for (const character of line) {
    const size = encoder.encode(character).length;
    if (octets + size > limit) {
      physical.push(current);
      current = '';
      octets = 0;
      limit = maxLineOctets - 1;
    }
    current += character;
    octets += size;
  }
  physical.push(current);
  return physical.join(`${lineBreak} `);
};

const icsDate = (isoDate: string): string => isoDate.replaceAll('-', '');

const icsTimestamp = (moment: Date): string =>
  moment
    .toISOString()
    .replace(/\.\d{3}Z$/, 'Z')
    .replace(/[-:]/g, '');

export const buildIcs = (booking: StoredBooking, now: Date): string => {
  const text = labels[booking.lang];
  const { arrival, departure } = stayOf(booking);
  const roomName = text.roomNames[booking.roomType] ?? roomTypeById(booking.roomType).id;
  const description = [
    `${text.code}: ${booking.code}`,
    `${text.room}: ${booking.roomNumber} (${roomName})`,
    `${text.guests}: ${booking.guests}`,
    text.times,
    text.reception,
    text.sample,
  ].join('\n');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Przeslo//Sample hotel booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${booking.code}@przeslo.example`,
    `DTSTAMP:${icsTimestamp(now)}`,
    `DTSTART;VALUE=DATE:${icsDate(toIsoDate(arrival))}`,
    `DTEND;VALUE=DATE:${icsDate(toIsoDate(departure))}`,
    `SUMMARY:${escapeIcsText(text.summary)}`,
    `LOCATION:${escapeIcsText(text.location)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    'TRANSP:OPAQUE',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeIcsText(text.alarm)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return `${lines.map(foldIcsLine).join(lineBreak)}${lineBreak}`;
};

export const icsFileName = (booking: StoredBooking): string => `przeslo-${booking.code}.ics`;
