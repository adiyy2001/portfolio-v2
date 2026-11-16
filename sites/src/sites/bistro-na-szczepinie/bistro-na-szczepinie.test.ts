import { describe, expect, it } from 'vitest';
import { aboutCopy } from './copy/about';
import { bookingCopy } from './copy/booking';
import { contactCopy } from './copy/contact';
import { creditsCopy } from './copy/credits';
import { eventsCopy } from './copy/events';
import { homeCopy } from './copy/home';
import { menuCopy } from './copy/menu';
import { shellCopy } from './copy/shell';
import { ticketCopy } from './copy/ticket';
import { allergenIds } from './data/allergens';
import { events } from './data/events';
import { bilingualPages, eventPath, pageIds, paths, switchTarget } from './data/routes';
import { kitchenBreak, openingRows, seatingWindow } from './data/hours';
import { dishes, chapterOrder } from './data/menu';
import { place } from './data/place';
import { week } from './data/week';
import { dayInMonth, isoDate, nextOccurrence } from './logic/events';
import { bookableTimes, makeRef, validateBooking, type BookingInput } from './logic/booking';
import { tie } from './logic/typography';

const dashes = new RegExp(`[${String.fromCharCode(8211, 8212)}]`);

const everyCopy = [
  aboutCopy,
  bookingCopy,
  contactCopy.pl,
  contactCopy.en,
  creditsCopy,
  eventsCopy,
  homeCopy,
  menuCopy,
  shellCopy,
  ticketCopy,
];

const serialise = (value: unknown) =>
  JSON.stringify(value, (_key, item) => (typeof item === 'function' ? String(item) : item));

describe('copy and data', () => {
  it('has no en or em dash', () => {
    for (const source of [...everyCopy, events, dishes, week, place]) {
      expect(serialise(source)).not.toMatch(dashes);
    }
  });

  it('uses one postcode everywhere', () => {
    expect(place.postcode).toBe('53-655');
    const text = serialise([...everyCopy, events, dishes, week]);
    expect(text).not.toContain('50-353');
  });

  it('keeps contact data on an example domain', () => {
    expect(place.email.endsWith('.example')).toBe(true);
    expect(place.phone.display).toBe('+48 71 555 01 81');
    expect(place.phone.href).toBe('+48715550181');
  });
});

describe('routes', () => {
  it('has a path for every page in Polish and every bilingual page in English', () => {
    for (const id of pageIds) expect(paths.pl[id]).toBeDefined();
    for (const id of bilingualPages) expect(paths.en[id]).toBeDefined();
    expect(paths.en.contact).toBe('/bistro-na-szczepinie/en/contact/');
  });

  it('builds event paths for every event and both languages', () => {
    for (const event of events) {
      expect(eventPath('pl', event.slug)).toBe(`/bistro-na-szczepinie/wydarzenia/${event.slug}/`);
      expect(eventPath('en', event.slug)).toBe(`/bistro-na-szczepinie/en/events/${event.slug}/`);
    }
  });

  it('switches language to the matching page', () => {
    expect(switchTarget('pl', 'menu')).toBe(paths.en.menu);
    expect(switchTarget('en', 'booking')).toBe(paths.pl.booking);
  });

  it('switches between the contact pages both ways', () => {
    expect(switchTarget('pl', 'contact')).toBe('/bistro-na-szczepinie/en/contact/');
    expect(switchTarget('en', 'contact')).toBe('/bistro-na-szczepinie/kontakt/');
  });

  it('switches every page pair both ways without falling back to home', () => {
    for (const id of bilingualPages) {
      if (id === 'home') continue;
      expect(switchTarget('pl', id)).toBe(paths.en[id]);
      expect(switchTarget('en', id)).toBe(paths.pl[id]);
    }
  });
});

describe('menu and week', () => {
  const hero = dishes.find(dish => dish.home && dish.chapter === 'dinner' && dish.price === 42);

  it('keeps the hero dish price at 42 zł', () => {
    expect(hero).toBeDefined();
  });

  it('keeps week prices between 30 and 35 zł', () => {
    for (const day of week) {
      expect(day.price).toBeGreaterThanOrEqual(30);
      expect(day.price).toBeLessThanOrEqual(35);
    }
    expect(week.map(day => day.day)).toEqual([1, 2, 3, 4, 5]);
  });

  it('uses only known allergens and has both languages for every dish', () => {
    for (const dish of dishes) {
      for (const id of dish.allergens) expect(allergenIds).toContain(id);
      expect(dish.name.pl.length).toBeGreaterThan(0);
      expect(dish.name.en.length).toBeGreaterThan(0);
      expect(chapterOrder).toContain(dish.chapter);
    }
  });

  it('does not tag the soup of the day as vegetarian', () => {
    const soup = dishes.find(dish => dish.id === 'zupa-dnia');
    expect(soup?.diet).toBe('meat');
  });

  it('counts sixteen of twenty-one dishes for the vegetarian filter', () => {
    const shown = dishes.filter(dish => dish.diet === 'vegan' || dish.diet === 'vegetarian');
    expect(dishes).toHaveLength(21);
    expect(dishes.filter(dish => dish.diet === 'vegan')).toHaveLength(7);
    expect(shown).toHaveLength(16);
  });

  it('says weekly menu and never weekly card', () => {
    const text = serialise([shellCopy, menuCopy, week, dishes]);
    expect(text).toContain('Weekly menu');
    expect(text).not.toMatch(/weekly card/i);
  });

  it('has no seasonal cold cheesecake in November', () => {
    expect(serialise(dishes)).not.toMatch(/na zimno|cold cheesecake/i);
  });
});

describe('events', () => {
  it('gives every event its own photo', () => {
    const ids = events.map(event => event.image);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('keeps the agreed wording', () => {
    const text = serialise([events, eventsCopy, aboutCopy, homeCopy, shellCopy]);
    expect(text).not.toContain('z Szczepina');
    expect(text).not.toContain('fold dumplings');
    expect(text).not.toMatch(/\bat \d{1,2}:\d{2} to /i);
  });

  it('has unique slugs and prices with a positive number of seats', () => {
    expect(new Set(events.map(event => event.slug)).size).toBe(events.length);
    for (const event of events) {
      expect(event.price).toBeGreaterThan(0);
      expect(event.seats).toBeGreaterThan(0);
    }
  });

  it('finds the last Thursday and the next occurrence', () => {
    const last = dayInMonth({ weekday: 4, nth: -1 }, 2026, 10);
    expect(isoDate(last)).toBe('2026-11-26');
    expect(isoDate(nextOccurrence({ weekday: 4, nth: -1 }, new Date(2026, 10, 15)))).toBe(
      '2026-11-26',
    );
    expect(isoDate(nextOccurrence({ weekday: 4, nth: -1 }, new Date(2026, 10, 27)))).toBe(
      '2026-12-31',
    );
  });

  it('finds the first Saturday of a month', () => {
    expect(isoDate(dayInMonth({ weekday: 6, nth: 1 }, 2026, 11))).toBe('2026-12-05');
  });
});

describe('opening hours', () => {
  it('lists three rows and a kitchen break from 16:00 to 17:00', () => {
    expect(openingRows('pl')).toHaveLength(3);
    expect(kitchenBreak).toEqual([16, 17]);
  });

  it('stops seating one hour before closing', () => {
    expect(seatingWindow(1)).toEqual([8, 20]);
    expect(seatingWindow(6)).toEqual([9, 21]);
    expect(seatingWindow(0)).toEqual([10, 19]);
  });
});

describe('booking', () => {
  const now = new Date(2026, 10, 15, 12, 0);
  const valid: BookingInput = {
    date: '2026-11-18',
    time: '19:00',
    people: '4',
    name: 'Ola Nowak',
    phone: '+48 600 100 200',
  };

  it('accepts a valid booking', () => {
    expect(validateBooking(valid, now)).toBeNull();
  });

  it('rejects a missing and a past date', () => {
    expect(validateBooking({ ...valid, date: '' }, now)?.code).toBe('dateMissing');
    expect(validateBooking({ ...valid, date: '2026-11-14' }, now)?.code).toBe('datePast');
  });

  it('rejects hours outside opening', () => {
    expect(validateBooking({ ...valid, time: '07:30' }, now)?.code).toBe('timeOutside');
    expect(validateBooking({ ...valid, time: '21:00' }, now)?.code).toBe('timeOutside');
    expect(validateBooking({ ...valid, date: '2026-11-22', time: '19:30' }, now)?.code).toBe(
      'timeOutside',
    );
  });

  it('rejects the whole kitchen break from 16:00 to 16:59', () => {
    for (const time of ['16:00', '16:30', '16:59']) {
      expect(validateBooking({ ...valid, time }, now)?.code).toBe('timeBreak');
    }
    expect(validateBooking({ ...valid, time: '17:00' }, now)).toBeNull();
    expect(validateBooking({ ...valid, time: '15:59' }, now)).toBeNull();
  });

  it('rejects a time that has already passed today', () => {
    expect(validateBooking({ ...valid, date: '2026-11-15', time: '11:00' }, now)?.code).toBe(
      'timePassed',
    );
  });

  it('rejects wrong group size, short name and bad phone', () => {
    expect(validateBooking({ ...valid, people: '0' }, now)?.code).toBe('peopleRange');
    expect(validateBooking({ ...valid, people: '13' }, now)?.code).toBe('peopleRange');
    expect(validateBooking({ ...valid, name: 'A' }, now)?.code).toBe('nameShort');
    expect(validateBooking({ ...valid, phone: '12ab' }, now)?.code).toBe('phoneInvalid');
  });

  it('offers no slot inside the kitchen break', () => {
    const times = bookableTimes(3);
    expect(times).not.toContain('16:00');
    expect(times).not.toContain('16:30');
    expect(times).toContain('17:00');
    expect(times[0]).toBe('08:00');
    expect(times[times.length - 1]).toBe('20:00');
  });

  it('makes references in the BS format', () => {
    expect(makeRef(() => 0)).toBe('BS-100000');
    expect(makeRef()).toMatch(/^BS-\d{6}$/);
  });
});

describe('typography', () => {
  it('ties short words to the next word with a no-break space', () => {
    expect(tie('w domu i na ulicy')).toContain(' ');
  });
});
