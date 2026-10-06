import { describe, expect, it } from 'vitest';
import { exportName } from './Generator';
import { content, contact, extras } from './content';
import {
  compose,
  grid,
  paramsOf,
  primaryVariant,
  seedHex,
  seedOf,
  standaloneSvg,
  tempoRange,
  threadCount,
} from './lib/field';
import type { Variant } from './lib/field';
import { gridCells, logoVariants } from './view';
import wordData from './word-data.json';

const colors = { thread: '#FF3D1F', ink: '#0E0E12' };

describe('generative field', () => {
  it('gives the same composition for the same variant and a different one for another tempo', () => {
    expect(compose(primaryVariant)).toEqual(compose(primaryVariant));
    expect(compose({ ...primaryVariant, bpm: 140 })).not.toEqual(compose(primaryVariant));
  });

  it('keeps the seed stable and formats it as hex', () => {
    expect(seedOf(primaryVariant)).toBe(seedOf({ ...primaryVariant }));
    expect(seedHex(seedOf(primaryVariant))).toMatch(/^0x[0-9A-F]{8}$/);
  });

  it('adds threads as the tempo rises', () => {
    expect(threadCount('tkalnia', 1)).toBeGreaterThan(threadCount('tkalnia', 0));
  });

  it('builds twelve distinct grid fields', () => {
    expect(grid).toHaveLength(12);
    expect(new Set(grid.map(seedOf)).size).toBe(12);
    expect(gridCells).toHaveLength(12);
  });

  it('draws numbers only', () => {
    grid.forEach(variant => {
      const params = paramsOf(variant);
      expect(JSON.stringify(params)).not.toMatch(/NaN|null/);
    });
  });
});

describe('standalone svg', () => {
  const extremes: Variant[] = grid.flatMap(variant =>
    [tempoRange.min, tempoRange.max].map(bpm => ({ ...variant, bpm })),
  );

  it('stays under 10 KB without text for every field at the tempo extremes', () => {
    [...grid, ...extremes].forEach(variant => {
      const svg = standaloneSvg(variant, colors, wordData, 'Nośna');
      expect(new TextEncoder().encode(svg).length).toBeLessThan(10 * 1024);
      expect(svg).not.toContain('<text');
      expect(svg).not.toMatch(/NaN|undefined/);
    });
  });

  it('names the exported file after day, stage and tempo', () => {
    expect(exportName(primaryVariant)).toBe('nosna-piatek-przedzalnia-100bpm.svg');
  });
});

describe('case study content', () => {
  const texts = JSON.stringify({ content, contact, extras });

  it('has no dashes and no placeholder copy', () => {
    expect(texts).not.toMatch(new RegExp(`[${String.fromCharCode(0x2013, 0x2014)}]`));
    expect(texts.toLowerCase()).not.toMatch(/lorem|twoja firma/);
  });

  it('uses a made up e-mail and phone', () => {
    expect(contact.email).toMatch(/\.example$/);
    expect(contact.phone).toMatch(/000 00/);
  });

  it('gives alt text for every application and three social posts', () => {
    content.applications.forEach(item => expect(item.alt.length).toBeGreaterThan(20));
    expect(extras.social).toHaveLength(3);
  });

  it('lists the six logo variants', () => {
    expect(logoVariants.map(variant => variant.id)).toEqual([
      'primary',
      'horizontal',
      'vertical',
      'symbol',
      'mono-black',
      'negative',
    ]);
  });
});
