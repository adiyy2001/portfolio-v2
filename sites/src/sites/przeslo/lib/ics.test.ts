import { describe, expect, it } from 'vitest';
import { buildSampleBooking, createBooking } from './booking';
import type { StoredBooking } from './booking';
import { dayFromParts } from './dates';
import { buildIcs, escapeIcsText, foldIcsLine, icsFileName } from './ics';

const now = new Date('2026-10-03T08:15:30.000Z');

const booking = (lang: 'pl' | 'en' = 'pl'): StoredBooking => {
  const friday = dayFromParts(2026, 10, 9);
  const created = createBooking(
    {
      lang,
      arrival: friday,
      departure: friday + 2,
      guests: 2,
      roomType: 'nadrzeczny',
      rate: 'flexible',
      extras: {},
      weekendPackage: false,
      guest: {
        name: 'Anna Wiśniewska',
        email: 'anna@example.com',
        phone: '+48 600 100 200',
        arrivalWindow: '',
        notes: '',
      },
      invoice: null,
    },
    now,
    () => 0,
    () => false,
  );
  if (!created) throw new Error('no booking');
  return created;
};

const octets = (line: string): number => new TextEncoder().encode(line).length;

describe('ICS text', () => {
  it('escapes backslashes, semicolons, commas and new lines', () => {
    expect(escapeIcsText('a, b; c\\d\ne')).toBe('a\\, b\\; c\\\\d\\ne');
  });

  it('folds long lines at 75 octets with a leading space on continuation lines', () => {
    const line = `DESCRIPTION:${'x'.repeat(200)}`;
    const folded = foldIcsLine(line).split('\r\n');
    expect(folded.length).toBeGreaterThan(2);
    for (const part of folded) expect(octets(part)).toBeLessThanOrEqual(75);
    for (const part of folded.slice(1)) expect(part.startsWith(' ')).toBe(true);
    expect(folded.map((part, index) => (index === 0 ? part : part.slice(1))).join('')).toBe(line);
  });

  it('never splits a multi-byte character', () => {
    const line = `SUMMARY:${'ę'.repeat(100)}`;
    const folded = foldIcsLine(line).split('\r\n');
    for (const part of folded) expect(octets(part)).toBeLessThanOrEqual(75);
    expect(folded.map((part, index) => (index === 0 ? part : part.slice(1))).join('')).toBe(line);
  });

  it('leaves short lines alone', () => {
    expect(foldIcsLine('BEGIN:VEVENT')).toBe('BEGIN:VEVENT');
  });
});

describe('ICS calendar', () => {
  const output = buildIcs(booking(), now);
  const unfolded = output.replace(/\r\n /g, '');
  const lines = unfolded.split('\r\n');

  it('uses CRLF line endings only and ends with a line break', () => {
    expect(output.endsWith('END:VCALENDAR\r\n')).toBe(true);
    expect(output.replace(/\r\n/g, '')).not.toMatch(/[\r\n]/);
  });

  it('keeps every physical line within 75 octets', () => {
    for (const line of output.split('\r\n')) expect(octets(line)).toBeLessThanOrEqual(75);
  });

  it('wraps one all-day event in a calendar', () => {
    expect(lines[0]).toBe('BEGIN:VCALENDAR');
    expect(lines).toContain('VERSION:2.0');
    expect(lines.filter(line => line === 'BEGIN:VEVENT')).toHaveLength(1);
    expect(lines.filter(line => line === 'END:VEVENT')).toHaveLength(1);
    expect(lines[lines.length - 2]).toBe('END:VCALENDAR');
  });

  it('ends the all-day event on the departure date', () => {
    expect(lines).toContain('DTSTART;VALUE=DATE:20261009');
    expect(lines).toContain('DTEND;VALUE=DATE:20261011');
  });

  it('identifies the event by the booking code and stamps it in UTC', () => {
    expect(lines).toContain('UID:PRZ-AAAAAA@przeslo.example');
    expect(lines).toContain('DTSTAMP:20261003T081530Z');
  });

  it('describes the stay and says the booking is a sample', () => {
    const description = lines.find(line => line.startsWith('DESCRIPTION:Kod')) ?? '';
    expect(description).toContain('Kod rezerwacji: PRZ-AAAAAA');
    expect(description).toContain('Pokój: 101 (z widokiem na Odrę)');
    expect(description).toContain('Nic nie zostało zarezerwowane ani pobrane');
    expect(description).toContain('\\n');
    expect(lines).toContain('SUMMARY:Pobyt w hotelu Przęsło');
    expect(lines).toContain('LOCATION:Hotel Przęsło\\, ul. Grodzka 31\\, 50-137 Wrocław');
  });

  it('is written in the language of the booking', () => {
    const english = buildIcs(booking('en'), now).replace(/\r\n /g, '');
    expect(english).toContain('SUMMARY:Stay at Hotel Przęsło');
    expect(english).toContain('Booking code: PRZ-AAAAAA');
    expect(english).toContain('Nothing was booked or charged.');
  });

  it('reminds the guest one day before', () => {
    expect(lines).toContain('BEGIN:VALARM');
    expect(lines).toContain('TRIGGER:-P1D');
    expect(lines).toContain('END:VALARM');
  });

  it('names the file after the booking code', () => {
    expect(icsFileName(booking())).toBe('przeslo-PRZ-AAAAAA.ics');
  });

  it('works for the sample booking too', () => {
    const sample = buildSampleBooking(dayFromParts(2026, 10, 3), 'pl', now);
    expect(sample).not.toBeNull();
    if (sample) expect(buildIcs(sample, now)).toContain('BEGIN:VEVENT');
  });
});
