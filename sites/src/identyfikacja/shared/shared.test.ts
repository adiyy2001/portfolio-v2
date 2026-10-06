import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { identityBrands } from '../../shared/sites';
import { filesLabel, formatBytes, pluralPl } from './format';
import { assetUrl, dimensionsOf, fileName, filesOf, pageUrl, readManifest } from './manifest';
import type { Manifest, ManifestFile } from './types';

const nbsp = '\u00a0';

describe('formatBytes', () => {
  it('uses bytes, kilobytes and megabytes with a decimal comma', () => {
    expect(formatBytes(512)).toBe(`512${nbsp}B`);
    expect(formatBytes(2048)).toBe(`2,0${nbsp}KB`);
    expect(formatBytes(150 * 1024)).toBe(`150${nbsp}KB`);
    expect(formatBytes(3.25 * 1024 * 1024)).toBe(`3,3${nbsp}MB`);
  });
});

describe('Polish plurals', () => {
  it('picks one, few and many forms', () => {
    expect(pluralPl(1, 'plik', 'pliki', 'plików')).toBe('plik');
    expect(pluralPl(3, 'plik', 'pliki', 'plików')).toBe('pliki');
    expect(pluralPl(12, 'plik', 'pliki', 'plików')).toBe('plików');
    expect(pluralPl(22, 'plik', 'pliki', 'plików')).toBe('pliki');
    expect(filesLabel(30)).toBe(`30${nbsp}plików`);
  });
});

describe('identity brands', () => {
  it('registers six brands with unique slugs and styles', () => {
    expect(identityBrands).toHaveLength(6);
    expect(new Set(identityBrands.map(brand => brand.slug)).size).toBe(6);
    expect(new Set(identityBrands.map(brand => brand.styleId)).size).toBe(6);
  });
});

describe('manifest helpers', () => {
  const roots: string[] = [];
  afterEach(() => {
    roots.splice(0).forEach(root => rmSync(root, { recursive: true, force: true }));
  });

  it('builds urls under the identity base', () => {
    expect(assetUrl('skibka', 'logo/a.svg')).toMatch(/\/identyfikacja\/skibka\/logo\/a\.svg$/);
    expect(pageUrl('skibka')).toMatch(/\/identyfikacja\/skibka\/$/);
    expect(fileName('logo/png/a-512.png')).toBe('a-512.png');
  });

  it('reads a manifest from the public folder of a brand', () => {
    const root = mkdtempSync(join(tmpdir(), 'manifest-'));
    roots.push(root);
    const dir = join(root, 'public', 'identyfikacja', 'demo');
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'manifest.json'), JSON.stringify({ brand: { slug: 'demo' } }));
    expect(readManifest('demo', root).brand.slug).toBe('demo');
  });

  it('resolves group files and describes dimensions', () => {
    const files: ManifestFile[] = [
      { path: 'a.png', bytes: 1, type: 'png', group: 'g', width: 10, height: 20 },
      { path: 'b.pdf', bytes: 1, type: 'pdf', group: 'g', pages: 3 },
      { path: 'c.ico', bytes: 1, type: 'ico', group: 'g', sizes: [16, 32] },
      { path: 'd.svg', bytes: 1, type: 'svg', group: 'g', width: 5, height: 5 },
    ];
    const manifest = { files } as Manifest;
    const group = {
      id: 'g',
      title: 'G',
      count: 4,
      bytes: 4,
      formats: '',
      files: ['a.png', 'x', 'b.pdf'],
    };
    expect(filesOf(manifest, group).map(file => file.path)).toEqual(['a.png', 'b.pdf']);
    expect(dimensionsOf(files[0])).toBe('10×20 px');
    expect(dimensionsOf(files[1])).toBe('3 str.');
    expect(dimensionsOf(files[2])).toBe('16, 32 px');
    expect(dimensionsOf(files[3])).toBe('');
  });
});
