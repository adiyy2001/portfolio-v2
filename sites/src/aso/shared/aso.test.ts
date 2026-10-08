import { describe, expect, it } from 'vitest';
import { asoApps } from '../apps';
import { copyExcerpt } from './excerpt';
import { dimensionsOf, fileName, readManifest, shotsOf, webPath } from './manifest';
import type { AsoCopy } from './types';
import pl from '../gran/copy/pl.json';

describe('aso registry', () => {
  it('registers six apps with unique slugs and style ids', () => {
    expect(asoApps).toHaveLength(6);
    expect(new Set(asoApps.map(app => app.slug)).size).toBe(6);
    expect(asoApps.map(app => app.styleId)).toEqual(['S1', 'S2', 'S3', 'S4', 'S5', 'S6']);
  });
});

describe('manifest helpers', () => {
  it('builds web preview paths the studio writes', () => {
    expect(webPath('appstore', 'pl', '01')).toBe('web/appstore-pl-01.webp');
    expect(webPath('play', 'en', '01', 'b')).toBe('web/play-en-01b.webp');
    expect(webPath('feature', 'en')).toBe('web/feature-en.webp');
  });

  it('formats names and dimensions', () => {
    expect(fileName('app-store/pl/gran-appstore-pl-01.png')).toBe('gran-appstore-pl-01.png');
    expect(
      dimensionsOf({
        path: 'a.png',
        bytes: 1,
        type: 'png',
        group: 'appstore',
        width: 1320,
        height: 2868,
      }),
    ).toBe('1320×2868 px');
    expect(dimensionsOf({ path: 'a.csv', bytes: 1, type: 'csv', group: 'texts' })).toBe('');
  });

  it('reads the published manifest and finds every preview', () => {
    const manifest = readManifest('gran');
    const shots = shotsOf(manifest, pl as AsoCopy, 'appstore');
    expect(shots).toHaveLength(6);
    expect(shots[0].src).toContain('/aso/gran/web/appstore-pl-01.webp');
    expect(shotsOf(manifest, pl as AsoCopy, 'play', { variant: 'b' })[0].slot).toBe('01b');
  });

  it('shows a short excerpt of a language file', () => {
    const text = copyExcerpt(pl as AsoCopy);
    expect(text).toContain('"lang": "pl"');
    expect(text.split('"headline"').length - 1).toBe(4);
  });
});
