import { describe, expect, it } from 'vitest';
import { ellipsesOf, hashSeed, rosetteLayers } from './rosette';

describe('hashSeed', () => {
  it('is deterministic', () => {
    expect(hashSeed('Aneta Wojtyńska')).toBe(hashSeed('Aneta Wojtyńska'));
  });

  it('differs between names', () => {
    expect(hashSeed('Aneta Wojtyńska')).not.toBe(hashSeed('Rafał Dzierżanowski'));
  });

  it('returns an unsigned 32-bit integer', () => {
    const hash = hashSeed('Weronika Chmielecka');
    expect(Number.isInteger(hash)).toBe(true);
    expect(hash).toBeGreaterThanOrEqual(0);
    expect(hash).toBeLessThan(2 ** 32);
  });
});

describe('rosetteLayers', () => {
  const names = ['Aneta Wojtyńska', 'Rafał Dzierżanowski', 'Weronika Chmielecka'];

  it('returns an ink layer and a seal layer', () => {
    expect(rosetteLayers(names[0] ?? '').map(layer => layer.tone)).toEqual(['ink', 'seal']);
  });

  it('keeps every parameter inside the drawing area', () => {
    for (const name of names) {
      for (const layer of rosetteLayers(name)) {
        expect(layer.count).toBeGreaterThanOrEqual(24);
        expect(layer.count).toBeLessThanOrEqual(48);
        expect(layer.offset + layer.rx).toBeLessThanOrEqual(90);
        expect(layer.ry).toBeGreaterThanOrEqual(10);
        expect(layer.ry).toBeLessThanOrEqual(27);
      }
    }
  });

  it('gives each person a different rosette', () => {
    const serialised = names.map(name => JSON.stringify(rosetteLayers(name)));
    expect(new Set(serialised).size).toBe(names.length);
  });

  it('is stable for the same seed', () => {
    expect(rosetteLayers('RD')).toEqual(rosetteLayers('RD'));
  });
});

describe('ellipsesOf', () => {
  const [layer] = rosetteLayers('Aneta Wojtyńska');

  it('creates one ellipse per count', () => {
    expect(ellipsesOf(layer!)).toHaveLength(layer!.count);
  });

  it('spreads the rotations evenly around the circle', () => {
    const rotations = ellipsesOf(layer!).map(ellipse => ellipse.rotate);
    expect(rotations[0]).toBe(0);
    expect(Math.max(...rotations)).toBeLessThan(360);
    const step = 360 / layer!.count;
    expect(rotations[1]).toBeCloseTo(step, 1);
  });

  it('copies the shape of the layer to every ellipse', () => {
    for (const ellipse of ellipsesOf(layer!)) {
      expect(ellipse).toMatchObject({ cx: layer!.offset, rx: layer!.rx, ry: layer!.ry });
    }
  });
});
