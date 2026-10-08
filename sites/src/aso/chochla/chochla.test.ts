import { describe, expect, it } from 'vitest';
import { readManifest } from '../shared/manifest';
import type { AsoCopy } from '../shared/types';
import { content } from './content';
import en from './copy/en.json';
import pl from './copy/pl.json';
import { burstPoints, zigzagPoints } from './view';

const copies = [pl, en] as AsoCopy[];
const banned =
  /(najlepsz|darmow|za darmo|nr 1|#1|\bbest\b|\btop\b|\bfree\b|\bnew\b|promocj|\bsale\b|zł|\$|£)/i;

describe('chochla copy', () => {
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
    expect(Object.keys(pl.ui)).toEqual(Object.keys(en.ui));
  });

  it('shows no prices anywhere', () => {
    expect(JSON.stringify([pl, en])).not.toMatch(/\d\s?(zł|pln)|[$£€]\s?\d/i);
  });

  it('has no em or en dash anywhere', () => {
    const text = JSON.stringify([pl, en, content]);
    const dashes = new RegExp(`[${String.fromCodePoint(0x2013)}${String.fromCodePoint(0x2014)}]`);
    expect(text).not.toMatch(dashes);
  });

  it('describes one sequence role per slot', () => {
    expect(content.sequence.roles).toHaveLength(6);
  });

  it('keeps the week plan and the shopping list consistent', () => {
    for (const copy of [pl, en]) {
      const week = copy.ui.tydzien;
      expect(week.days).toHaveLength(7);
      const planned = week.days.filter(day => 'dish' in day).length;
      expect(week.planned.startsWith(`${planned} `)).toBe(true);
      expect(week.days.filter(day => 'today' in day)).toHaveLength(1);
      const total = Number.parseInt(week.list.replace(/\D+/g, ' ').trim(), 10);
      const list = copy.ui.zakupy;
      const shown = list.aisles.reduce((sum, aisle) => sum + aisle.items.length, 0);
      const more = Number.parseInt(list.more.replace(/\D+/g, ' ').trim(), 10);
      expect(shown + more).toBe(total);
      const ticked = list.aisles.flatMap(aisle => aisle.items).filter(item => item[2] === true);
      const done = Number.parseInt(list.done, 10);
      expect(ticked.length).toBeLessThanOrEqual(done);
      expect(Math.round((done / total) * 100)).toBe(list.share);
    }
  });

  it('keeps the fridge matches and the cooking steps consistent', () => {
    for (const copy of [pl, en]) {
      for (const result of copy.ui.lodowka.results) {
        expect(result.match).toBeLessThanOrEqual(result.of);
      }
      expect(copy.ui.lodowka.results).toHaveLength(
        Number.parseInt(copy.ui.lodowka.resultsTitle.replace(/\D+/g, ''), 10),
      );
      const cooking = copy.ui.gotowanie;
      expect(cooking.current).toBeLessThanOrEqual(cooking.steps);
      expect(cooking.step).toContain(`${cooking.current}`);
      expect(cooking.step).toContain(`${cooking.steps}`);
    }
  });

  it('draws deterministic shapes', () => {
    expect(burstPoints(12, 48, 34, 3)).toBe(burstPoints(12, 48, 34, 3));
    expect(burstPoints(12, 48, 34, 3).split(' ')).toHaveLength(24);
    expect(zigzagPoints(4).split(' ')).toHaveLength(9);
  });

  it('ships every store file in the manifest', () => {
    const manifest = readManifest('chochla');
    const count = (group: string) => manifest.files.filter(file => file.group === group).length;
    expect(count('appstore')).toBe(12);
    expect(count('play')).toBe(12);
    expect(count('variantB')).toBe(4);
    expect(count('feature')).toBe(2);
    expect(manifest.zip?.path).toBe('chochla-aso.zip');
  });
});
