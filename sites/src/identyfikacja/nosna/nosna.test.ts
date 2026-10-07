import { readFileSync } from 'node:fs';
import { join } from 'node:path';
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
import { tie, tieHtml } from './lib/tie';
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

describe('generator hydration', () => {
  const dir = join(process.cwd(), 'src', 'identyfikacja', 'nosna');
  const page = readFileSync(join(dir, 'Page.astro'), 'utf8');
  const styles = readFileSync(join(dir, 'styles.ts'), 'utf8');

  it('hydrates the generator on load because its island has no layout box', () => {
    expect(page).toMatch(/<Generator client:load/);
    expect(page).not.toMatch(/<Generator client:(visible|media|only)/);
  });

  it('keeps the island out of the layout through display contents only with an eager hydration', () => {
    expect(styles).toMatch(/astro-island,\.gen\{display:contents\}/);
    expect(page).not.toMatch(/client:visible/);
  });
});

describe('typesetting ties', () => {
  const nbsp = '\u00a0';

  it('glues one letter words to the next word, also in a row', () => {
    expect(tie('dni i identyfikator')).toBe(`dni i${nbsp}identyfikator`);
    expect(tie('w a z tempo')).toBe(`w${nbsp}a${nbsp}z${nbsp}tempo`);
  });

  it('glues numbers to their units', () => {
    expect(tie('128 BPM, 85 mm, 120 px')).toBe(`128${nbsp}BPM, 85${nbsp}mm, 120${nbsp}px`);
  });

  it('leaves tags, attributes, scripts and islands untouched', () => {
    const html =
      '<p title="a b">i tak</p><astro-island props="a b">a b</astro-island><script>a b</script>';
    expect(tieHtml(html)).toBe(
      `<p title="a b">i${nbsp}tak</p><astro-island props="a b">a b</astro-island><script>a b</script>`,
    );
  });
});

describe('published files', () => {
  const pub = join(process.cwd(), 'public', 'identyfikacja', 'nosna');

  it('keeps twelve symbols and a viewBox in the icon sprite', () => {
    const sprite = readFileSync(join(pub, 'icons', 'nosna-icons.svg'), 'utf8');
    expect(sprite.match(/<symbol /g)).toHaveLength(12);
    expect(sprite).toMatch(/viewBox="0 0 24 24"/);
  });
});
