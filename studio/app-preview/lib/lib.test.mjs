import assert from 'node:assert/strict';
import { test } from 'node:test';
import { finalName, publishedNames, screenName, webName, webTargets } from './convention.mjs';
import { contrast } from './contrast.mjs';
import { appPaths, slugs } from './paths.mjs';
import { parseArgs } from './args.mjs';

test('names follow the convention', () => {
  assert.equal(finalName('kasownik', 'store'), 'kasownik-store-886x1920.mp4');
  assert.equal(finalName('kasownik', '9x16'), 'kasownik-social-1080x1920.mp4');
  assert.equal(webName('kasownik', 'hero', 'webm'), 'kasownik-hero.webm');
  assert.equal(screenName('kasownik', 3), 'screens/kasownik-screen-3.webp');
  const names = publishedNames('kasownik', 7);
  assert.equal(new Set(names).size, names.length);
  assert.ok(names.includes('manifest.json'));
});

test('web targets have even sizes and stay under 4 MB', () => {
  for (const spec of Object.values(webTargets)) {
    assert.equal(spec.width % 2, 0);
    assert.equal(spec.height % 2, 0);
    assert.ok(spec.target <= spec.hard && spec.hard <= 4 * 1024 * 1024);
  }
});

test('contrast matches WCAG values', () => {
  assert.equal(contrast('#000000', '#ffffff'), 21);
  assert.ok(contrast('#00864F', '#FFFFFF') >= 4.5);
});

test('paths and args', () => {
  assert.equal(slugs.length, 6);
  assert.throws(() => appPaths('trzask'));
  assert.ok(appPaths('kasownik').pub.endsWith('sites/public/app-preview/kasownik'));
  assert.deepEqual(parseArgs(['kasownik', '--only', 'web', '--port=4321']), { positional: ['kasownik'], flags: { only: 'web', port: '4321' } });
});
