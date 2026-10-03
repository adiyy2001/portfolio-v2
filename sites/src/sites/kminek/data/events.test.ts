import { describe, expect, it } from 'vitest';
import { eventById, events, homeEventIds } from './events';
import { langs } from './lang';
import { nextOccurrence } from '../logic/schedule';

describe('events', () => {
  it('has unique ids and complete copy in both languages', () => {
    expect(new Set(events.map(event => event.id)).size).toBe(events.length);
    for (const event of events) {
      for (const lang of langs) {
        expect(event.title[lang].length).toBeGreaterThan(3);
        expect(event.summary[lang].length).toBeGreaterThan(40);
        expect(event.time[lang].length).toBeGreaterThan(3);
        expect(event.price[lang].length).toBeGreaterThan(3);
        expect(event.facts.length).toBeGreaterThan(2);
      }
    }
  });

  it('shows events that exist on the home page', () => {
    for (const id of homeEventIds) {
      expect(eventById(id).id).toBe(id);
    }
    expect(() => eventById('nope')).toThrow();
  });

  it('never schedules two events on the same weekday and week rule', () => {
    const keys = events.map(event => JSON.stringify(event.rule));
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('finds a next date for every event', () => {
    for (const event of events) {
      const next = nextOccurrence(event.rule, { year: 2026, month: 10, day: 3 });
      expect(next.year).toBeGreaterThanOrEqual(2026);
    }
  });
});
