import { describe, expect, it } from 'vitest';
import { accessories, coffees } from '../data/catalog';
import {
  buildAccessoryLabel,
  buildCoffeeLabel,
  fieldColors,
  fitSize,
  labelSize,
  measureEm,
  measureWidth,
  regionOf,
  weightLabel,
} from './label';

describe('text measuring', () => {
  it('sums glyph advances in em', () => {
    expect(measureEm('ETIOPIA', 900)).toBeCloseTo(2.731, 3);
    expect(measureEm('', 900)).toBe(0);
  });

  it('adds letter spacing between glyphs only', () => {
    const plain = measureWidth('KENIA', 700, 20);
    expect(measureWidth('KENIA', 700, 20, 2)).toBeCloseTo(plain + 8, 6);
  });

  it('fits a word into a box without exceeding the maximum size', () => {
    const size = fitSize('GWATEMALA', 900, 272, 120);
    expect(size).toBeLessThan(60);
    expect(measureWidth('GWATEMALA', 900, size)).toBeLessThanOrEqual(272);
    expect(fitSize('KENIA', 900, 272, 100)).toBe(100);
  });
});

describe('weightLabel', () => {
  it('writes grams and kilograms in capitals', () => {
    expect(weightLabel(250)).toBe('250 G');
    expect(weightLabel(500)).toBe('500 G');
    expect(weightLabel(1000)).toBe('1 KG');
  });
});

describe('coffee labels', () => {
  it('keeps every line inside the label width', () => {
    for (const coffee of coffees) {
      const model = buildCoffeeLabel(coffee);
      const lines = [...model.title, model.region, ...model.notes];
      for (const entry of lines) {
        expect(entry.width, `${coffee.id}: ${entry.text}`).toBeLessThanOrEqual(
          labelSize.inner + 0.5,
        );
      }
      expect(model.footLeft.width + model.footRight.width + 12).toBeLessThanOrEqual(
        labelSize.inner,
      );
    }
  });

  it('keeps the title below the strip and above the region line', () => {
    for (const coffee of coffees) {
      const model = buildCoffeeLabel(coffee);
      const first = model.title[0];
      const last = model.title[model.title.length - 1];
      expect(first.y - first.size * 0.8).toBeGreaterThanOrEqual(44);
      expect(last.y).toBeLessThan(model.region.y - 14);
    }
  });

  it('uses two lines of one size for blends', () => {
    const blend = coffees.find(coffee => coffee.id === 'pierwszy-trzask');
    expect(blend).toBeDefined();
    const model = buildCoffeeLabel(blend ?? coffees[0]);
    expect(model.title.map(entry => entry.text)).toEqual(['PIERWSZY', 'TRZASK']);
    expect(model.title[0].size).toBe(model.title[1].size);
    expect(model.title[1].y).toBeGreaterThan(model.title[0].y);
  });

  it('colours the field by roast level', () => {
    const fields = coffees.map(coffee => buildCoffeeLabel(coffee).field);
    expect(new Set(fields)).toEqual(new Set(['lime', 'amber', 'brown']));
    expect(fieldColors.brown.ink).toBe('#d3f33a');
  });

  it('marks the first crack on the curve and the second only for dark roasts', () => {
    const light = buildCoffeeLabel(coffees[0]);
    const dark = buildCoffeeLabel(
      coffees.find(coffee => coffee.id === 'indonezja-sumatra') ?? coffees[0],
    );
    expect(light.curve.second).toBeNull();
    expect(dark.curve.second).not.toBeNull();
    expect(light.curve.crack.x).toBeGreaterThan(labelSize.margin);
    expect(light.curve.crack.x).toBeLessThan(labelSize.width - labelSize.margin);
    expect(light.curve.caption.text).toBe('PIERWSZY TRZASK 8:32');
  });

  it('fills the roast scale up to the roast level', () => {
    const filled = (id: string) =>
      buildCoffeeLabel(coffees.find(coffee => coffee.id === id) ?? coffees[0]).scale.filter(
        cell => cell.filled,
      ).length;
    expect(filled('etiopia-gedeb')).toBe(1);
    expect(filled('kolumbia-huila')).toBe(2);
    expect(filled('indonezja-sumatra')).toBe(3);
  });

  it('puts the chosen weight in the footer', () => {
    expect(buildCoffeeLabel(coffees[0], 1000).footRight.text).toBe('MYTA · 1 KG');
    expect(buildCoffeeLabel(coffees[0]).footRight.text).toBe('MYTA · 250 G');
  });

  it('takes the first part of the region for the label', () => {
    expect(regionOf(coffees[0])).toBe('GEDEB');
    const blend = coffees.find(coffee => coffee.country === 'mieszanka');
    expect(blend && regionOf(blend)).toBe(blend?.region.toUpperCase());
  });

  it('describes the label for assistive technology', () => {
    expect(buildCoffeeLabel(coffees[0]).aria).toContain('Etiopia Gedeb');
  });
});

describe('accessory labels', () => {
  it('fits titles and footers', () => {
    for (const accessory of accessories) {
      const model = buildAccessoryLabel(accessory);
      expect(model.field).toBe('paper');
      for (const entry of [...model.title, model.region]) {
        expect(entry.width).toBeLessThanOrEqual(labelSize.inner + 0.5);
      }
      expect(model.footLeft.width + model.footRight.width + 12).toBeLessThanOrEqual(
        labelSize.inner,
      );
    }
  });
});
