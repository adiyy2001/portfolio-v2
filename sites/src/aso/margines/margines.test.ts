import { describe, expect, it } from 'vitest';
import { readManifest } from '../shared/manifest';
import type { AsoCopy } from '../shared/types';
import { content } from './content';
import en from './copy/en.json';
import pl from './copy/pl.json';
import { circlePath, underlinePath } from './view';

const copies = [pl, en] as AsoCopy[];
const banned =
  /(najlepsz|darmow|za darmo|nr 1|#1|\bbest\b|\btop\b|\bfree\b|\bnew\b|promocj|\bsale\b)/i;

describe('margines copy', () => {
  it('has six slots with headlines of at most six words in both languages', () => {
    for (const copy of copies) {
      expect(copy.slots.map(slot => slot.id)).toEqual(['01', '02', '03', '04', '05', '06']);
      for (const text of [...copy.slots, copy.variantB, copy.feature]) {
        expect(text.headline.split(/\s+/).length).toBeLessThanOrEqual(6);
        expect(text.alt.length).toBeLessThanOrEqual(140);
        expect(text.headline).not.toMatch(banned);
      }
    }
  });

  it('uses the same screens and the same note keys in both languages', () => {
    expect(pl.slots.map(slot => slot.screen)).toEqual(en.slots.map(slot => slot.screen));
    expect(pl.variantB.screen).toBe(en.variantB.screen);
    expect(Object.keys(pl.notes)).toEqual(Object.keys(en.notes));
  });

  it('has no em or en dash anywhere', () => {
    const text = JSON.stringify([pl, en, content]);
    const dashes = new RegExp(`[${String.fromCodePoint(0x2013)}${String.fromCodePoint(0x2014)}]`);
    expect(text).not.toMatch(dashes);
  });

  it('describes one sequence role per slot', () => {
    expect(content.sequence.roles).toHaveLength(6);
  });

  it('keeps the progress numbers consistent', () => {
    for (const copy of [pl, en]) {
      const minutes = copy.ui.postep.minutes;
      expect(minutes).toHaveLength(7);
      const average = minutes.reduce((sum, value) => sum + value, 0) / minutes.length;
      expect(Math.round(average)).toBe(Number.parseInt(copy.ui.postep.avg, 10));
      const due = copy.ui.dzis.due.reduce((sum, row) => sum + Number.parseInt(row[1], 10), 0);
      expect(due).toBe(Number.parseInt(copy.ui.dzis.count, 10));
      const split = copy.ui.dzis.split.reduce((sum, row) => sum + Number(row[0]), 0);
      expect(split).toBe(due);
      for (const deck of Object.values(copy.ui.decks)) {
        expect(deck.known).toBeLessThanOrEqual(deck.count);
      }
    }
  });

  it('draws deterministic marker paths', () => {
    expect(underlinePath(200, 3)).toBe(underlinePath(200, 3));
    expect(circlePath(80, 40, 2)).toMatch(/^M[\d. L-]+$/);
  });

  it('ships every store file in the manifest', () => {
    const manifest = readManifest('margines');
    const count = (group: string) => manifest.files.filter(file => file.group === group).length;
    expect(count('appstore')).toBe(12);
    expect(count('play')).toBe(12);
    expect(count('variantB')).toBe(4);
    expect(count('feature')).toBe(2);
    expect(manifest.zip?.path).toBe('margines-aso.zip');
  });
});
