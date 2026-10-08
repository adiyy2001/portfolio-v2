import { describe, expect, it } from 'vitest';
import { readManifest } from '../shared/manifest';
import type { AsoCopy } from '../shared/types';
import { content } from './content';
import en from './copy/en.json';
import pl from './copy/pl.json';
import { linePoints, shape } from './view';

const copies = [pl, en];
const banned =
  /(najlepsz|darmow|za darmo|nr 1|#1|\bbest\b|\btop\b|\bfree\b|\bnew\b|promocj|\bsale\b)/i;
const finance =
  /(?<![\p{L}])(zysk|zarob|zwrot|rentown|gwarant|return|profit|earn|gain|yield|guarantee)/iu;
const sum = (items: { value: number }[]) => items.reduce((total, item) => total + item.value, 0);

describe('kruszec copy', () => {
  it('has six slots with short headlines and an accent from the headline', () => {
    for (const copy of copies) {
      expect(copy.slots.map(slot => slot.id)).toEqual(['01', '02', '03', '04', '05', '06']);
      for (const text of [...copy.slots, copy.variantB, copy.feature]) {
        expect(text.headline.split(/\s+/).length).toBeLessThanOrEqual(6);
        expect(text.alt.length).toBeLessThanOrEqual(140);
        expect(text.headline).not.toMatch(banned);
        expect(text.headline).toContain(text.accent);
      }
    }
  });

  it('never promises gains or returns anywhere in the copy', () => {
    for (const copy of copies) {
      expect(JSON.stringify(copy)).not.toMatch(finance);
    }
    expect(JSON.stringify(content)).not.toMatch(/(?<![\p{L}])(zarob|rentown|gwarant)/iu);
  });

  it('marks every set as sample data', () => {
    expect(pl.ui.sample).toBe('Dane przykładowe');
    expect(en.ui.sample).toBe('Sample data');
  });

  it('uses the same screens and keys in both languages', () => {
    expect(pl.slots.map(slot => slot.screen)).toEqual(en.slots.map(slot => slot.screen));
    expect(pl.variantB.screen).toBe(en.variantB.screen);
    expect(Object.keys(pl.notes)).toEqual(Object.keys(en.notes));
    expect(Object.keys(pl.ui)).toEqual(Object.keys(en.ui));
  });

  it('has no em or en dash anywhere', () => {
    const text = JSON.stringify([pl, en, content]);
    const dashes = new RegExp(`[${String.fromCodePoint(0x2013)}${String.fromCodePoint(0x2014)}]`);
    expect(text).not.toMatch(dashes);
  });

  it('adds up the accounts, the net worth and the allocation', () => {
    for (const copy of copies) {
      const ui = copy.ui;
      const accounts = ui.konta.groups.flatMap(group => group.items);
      expect(sum(accounts)).toBe(ui.konta.total);
      expect(ui.konta.total).toBe(ui.majatek.total);
      expect(sum(ui.majatek.groups)).toBe(ui.majatek.total);
      expect(sum(ui.alokacja.items)).toBe(ui.alokacja.total);
      expect(ui.alokacja.items.reduce((total, item) => total + item.share, 0)).toBe(100);
      expect(ui.alokacja.items.reduce((total, item) => total + item.target, 0)).toBe(100);
      for (const item of ui.alokacja.items) {
        expect(Math.round((item.value / ui.alokacja.total) * 100)).toBe(item.share);
      }
    }
  });

  it('counts the budget, the safety net and the goal the same way the screens say', () => {
    for (const copy of copies) {
      const { budzet, poduszka, cel } = copy.ui;
      const spent = budzet.categories.reduce((total, item) => total + item.spent, 0);
      const limit = budzet.categories.reduce((total, item) => total + item.limit, 0);
      expect(limit - spent).toBe(budzet.left);
      expect(Math.floor(budzet.left / budzet.days)).toBe(budzet.safe);
      expect(Math.round((poduszka.amount / poduszka.monthly) * 10) / 10).toBe(poduszka.months);
      expect(poduszka.target * poduszka.monthly - poduszka.amount).toBe(poduszka.missing);
      expect(Math.round((cel.saved / cel.target) * 100)).toBe(cel.share);
    }
  });

  it('describes one sequence role per slot', () => {
    expect(content.sequence.roles).toHaveLength(6);
  });
});

describe('kruszec chart', () => {
  it('ends the net worth line at the total and keeps it calm', () => {
    expect(shape).toHaveLength(61);
    expect(shape[60]).toBeCloseTo(1, 6);
    const drops = shape.slice(1).filter((value, i) => value < shape[i]).length;
    expect(drops).toBeGreaterThan(5);
    const points = linePoints(shape, { width: 400, height: 80 });
    expect(points[0][0]).toBe(0);
    expect(points[60][0]).toBe(400);
  });
});

describe('kruszec files', () => {
  it('ships every store file in the manifest, including the iPad set', () => {
    const manifest = readManifest('kruszec');
    const count = (group: string) => manifest.files.filter(file => file.group === group).length;
    expect(manifest.app.ipad).toBe(true);
    expect(count('appstore')).toBe(12);
    expect(count('play')).toBe(12);
    expect(count('ipad')).toBe(12);
    expect(count('variantB')).toBe(4);
    expect(count('feature')).toBe(2);
    expect(manifest.zip?.path).toBe('kruszec-aso.zip');
  });

  it('keeps the copy files typed like the shared copy', () => {
    const copy = pl as AsoCopy;
    expect(copy.lang).toBe('pl');
  });
});
