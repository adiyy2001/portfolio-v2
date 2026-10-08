import { describe, expect, it } from 'vitest';
import { readManifest } from '../shared/manifest';
import type { AsoCopy } from '../shared/types';
import { content } from './content';
import en from './copy/en.json';
import pl from './copy/pl.json';
import { starPath } from './view';

const copies = [pl, en];
const banned =
  /(najlepsz|darmow|za darmo|nr 1|#1|\bbest\b|\btop\b|\bfree\b|\bnew\b|promocj|\bsale\b|zł|£|\$|€)/i;

describe('bis copy', () => {
  it('has six slots with short headlines and a chrome word from the headline', () => {
    for (const copy of copies) {
      expect(copy.slots.map(slot => slot.id)).toEqual(['01', '02', '03', '04', '05', '06']);
      for (const text of [...copy.slots, copy.variantB, copy.feature]) {
        expect(text.headline.split(/\s+/).length).toBeLessThanOrEqual(6);
        expect(text.alt.length).toBeLessThanOrEqual(140);
        expect(text.headline).not.toMatch(banned);
        expect(text.alt).not.toMatch(banned);
        expect(text.headline).toContain(text.accent);
      }
    }
  });

  it('shows no ticket prices anywhere', () => {
    for (const copy of copies) {
      expect(JSON.stringify(copy.ui)).not.toMatch(
        /(?<![\p{L}])(zł|pln|cena|cen|price)(?![\p{L}])|[£$€]/iu,
      );
    }
  });

  it('uses the same screens, artists and keys in both languages', () => {
    expect(pl.slots.map(slot => slot.screen)).toEqual(en.slots.map(slot => slot.screen));
    expect(pl.variantB.screen).toBe(en.variantB.screen);
    expect(Object.keys(pl.ui)).toEqual(Object.keys(en.ui));
    expect(Object.keys(pl.notes)).toEqual(Object.keys(en.notes));
    expect(Object.keys(pl.ui.artists)).toEqual(Object.keys(en.ui.artists));
    for (const id of Object.keys(pl.ui.artists) as (keyof typeof pl.ui.artists)[]) {
      expect(pl.ui.artists[id].name).toBe(en.ui.artists[id].name);
    }
  });

  it('has no em or en dash anywhere', () => {
    const text = JSON.stringify([pl, en, content]);
    const dashes = new RegExp(`[${String.fromCodePoint(0x2013)}${String.fromCodePoint(0x2014)}]`);
    expect(text).not.toMatch(dashes);
  });

  it('keeps every artist and venue reference pointing at the roster', () => {
    for (const copy of copies) {
      const ui = copy.ui;
      const refs = [
        ...ui.wokolicy.list,
        ui.wokolicy.soon,
        ui.odkrywaj.card,
        ...ui.odkrywaj.deck,
        ui.koncert,
        ui.znajomi,
        ...ui.kalendarz.marks,
        ...ui.kolekcja.tickets,
        ui.podglad,
      ];
      for (const ref of refs) {
        expect(Object.keys(ui.artists)).toContain(ref.artist);
        expect(Object.keys(ui.venues)).toContain(ref.venue);
      }
    }
  });

  it('agrees between the week list, the calendar and the friends screen', () => {
    for (const copy of copies) {
      const ui = copy.ui;
      const marks = new Map(ui.kalendarz.marks.map(mark => [mark.day, mark]));
      for (const gig of ui.wokolicy.list) {
        const mark = marks.get(Number(gig.date));
        expect(mark?.artist).toBe(gig.artist);
        expect(mark?.venue).toBe(gig.venue);
        expect(mark?.time).toBe(gig.time);
      }
      const going = ui.kalendarz.marks.filter(mark => 'going' in mark && mark.going);
      expect(going.map(mark => mark.artist)).toContain(ui.znajomi.artist);
      expect(ui.kalendarz.summary).toContain(String(ui.kalendarz.marks.length));
      expect(ui.kalendarz.summary).toContain(String(going.length));
      const people = ui.znajomi.people;
      expect(copy.notes.goingCount).toContain(
        String(people.filter(p => p.state === 'going').length),
      );
      expect(copy.notes.maybeCount).toContain(
        String(people.filter(p => p.state === 'maybe').length),
      );
      expect(ui.kalendarz.offset).toBe(3);
      expect(new Date(Date.UTC(2026, 9, 1)).getUTCDay()).toBe(4);
    }
  });

  it('describes one sequence role per slot', () => {
    expect(content.sequence.roles).toHaveLength(6);
  });
});

describe('bis art', () => {
  it('draws a closed four point sparkle', () => {
    const path = starPath(50, 50, 40);
    expect(path.startsWith('M50 10')).toBe(true);
    expect(path.endsWith('Z')).toBe(true);
    expect(path.split('C')).toHaveLength(5);
  });
});

describe('bis files', () => {
  it('ships every store file in the manifest', () => {
    const manifest = readManifest('bis');
    const count = (group: string) => manifest.files.filter(file => file.group === group).length;
    expect(manifest.app.format).toBe('jpg');
    expect(count('appstore')).toBe(12);
    expect(count('play')).toBe(12);
    expect(count('variantB')).toBe(4);
    expect(count('feature')).toBe(2);
    expect(manifest.zip?.path).toBe('bis-aso.zip');
  });

  it('keeps the copy files typed like the shared copy', () => {
    const copy = pl as AsoCopy;
    expect(copy.lang).toBe('pl');
  });
});
