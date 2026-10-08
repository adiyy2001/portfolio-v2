import { describe, expect, it } from 'vitest';
import { readManifest } from '../shared/manifest';
import type { AsoCopy } from '../shared/types';
import { content } from './content';
import en from './copy/en.json';
import pl from './copy/pl.json';

const copies = [pl, en] as AsoCopy[];
const banned =
  /(najlepsz|darmow|za darmo|nr 1|#1|\bbest\b|\btop\b|\bfree\b|\bnew\b|promocj|\bsale\b)/i;

describe('szyld copy', () => {
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

  it('uses the same screens in both languages', () => {
    expect(pl.slots.map(slot => slot.screen)).toEqual(en.slots.map(slot => slot.screen));
    expect(pl.variantB.screen).toBe(en.variantB.screen);
  });

  it('has no em or en dash anywhere', () => {
    const text = JSON.stringify([pl, en, content]);
    const dashes = new RegExp(`[${String.fromCodePoint(0x2013)}${String.fromCodePoint(0x2014)}]`);
    expect(text).not.toMatch(dashes);
  });

  it('describes one sequence role per slot', () => {
    expect(content.sequence.roles).toHaveLength(6);
  });

  it('ships every store file in the manifest', () => {
    const manifest = readManifest('szyld');
    const count = (group: string) => manifest.files.filter(file => file.group === group).length;
    expect(count('appstore')).toBe(12);
    expect(count('play')).toBe(12);
    expect(count('variantB')).toBe(4);
    expect(count('feature')).toBe(2);
    expect(manifest.zip?.path).toBe('szyld-aso.zip');
  });

  it('adds up the basket and the standing order in both languages', () => {
    const amount = (value: string) => Number(value.replace(' zł', '').replace(',', '.'));
    for (const copy of [pl, en]) {
      const basket = copy.ui.koszyk.groups.flatMap(group =>
        group.items.map(item => amount(item[2])),
      );
      const sum = basket.reduce((total, value) => total + value, 0);
      expect(sum.toFixed(2)).toBe(amount(copy.ui.koszyk.total).toFixed(2));
      const order = copy.ui.stale.items.reduce((total, item) => total + amount(item[2]), 0);
      expect(order.toFixed(2)).toBe(amount(copy.ui.stale.total).toFixed(2));
    }
  });
});
