import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { readManifest } from '../shared/manifest';
import { content, day } from './content';
import { countEase, dayKwh, drawEase, framesToMs, production } from './lab';

const manifest = readManifest('poludnie');
const pub = join(process.cwd(), 'public', 'app-preview', 'poludnie');
const words = (text: string) => text.split(/\s+/).filter(word => /[\p{L}\p{N}]/u.test(word)).length;
const sum = (parts: [string, number, string][]) =>
  Math.round(parts.reduce((total, part) => total + part[1], 0) * 10) / 10;

describe('poludnie storyboard', () => {
  const { shots, duration, fps } = manifest.storyboard;

  it('covers every frame of a 20 to 25 second store cut without gaps', () => {
    expect(duration / fps).toBeGreaterThanOrEqual(20);
    expect(duration / fps).toBeLessThanOrEqual(25);
    expect(shots[0].from).toBe(0);
    shots.forEach((shot, i) => {
      if (i > 0) expect(shot.from).toBe(shots[i - 1].to + 1);
    });
    expect(shots.at(-1)?.to).toBe(duration - 1);
  });

  it('keeps overlays short, readable and inside the safe area', () => {
    const overlays = shots.flatMap(shot => (shot.overlay ? [shot.overlay] : []));
    expect(overlays.length).toBeLessThanOrEqual(4);
    for (const overlay of overlays) {
      expect(words(overlay.text)).toBeLessThanOrEqual(6);
      expect(overlay.to - overlay.from + 1).toBeGreaterThanOrEqual(
        Math.ceil((words(overlay.text) * 0.3 + 0.7) * fps),
      );
      expect(overlay.top).toBeGreaterThanOrEqual(60);
      expect(overlay.top + 52).toBeLessThanOrEqual(880);
    }
  });

  it('opens on the house with flows and uses it as the poster', () => {
    expect(shots[0].to).toBeLessThan(90);
    expect(manifest.storyboard.poster).toBeLessThan(60);
  });
});

describe('poludnie energy data', () => {
  it('adds up: energy in equals used, stored and exported', () => {
    expect(sum(day.prodSplit)).toBeCloseTo(day.prod, 5);
    expect(sum(day.useSplit)).toBeCloseTo(day.use, 5);
    expect(day.prodSplit[0][1]).toBe(day.useSplit[0][1]);
    const [, home, battery, grid] = day.now.map(([, value]) => value);
    expect(Math.round((home + battery + grid) * 10) / 10).toBe(day.now[0][1]);
  });

  it('derives self sufficiency and the value of the day from the same numbers', () => {
    const fromGrid = day.useSplit[2][1];
    expect(Math.round(((day.use - fromGrid) / day.use) * 100)).toBe(day.selfSufficiency);
    expect(Math.round((day.use - fromGrid) * 10) / 10).toBe(day.notBought);
    expect(Math.round(day.notBought * day.buy * 100) / 100).toBe(day.savedZl);
    expect(Math.round(day.exported * day.sell * 100) / 100).toBe(day.soldZl);
    expect(Math.round((day.savedZl + day.soldZl) * 100) / 100).toBe(day.valueZl);
  });

  it('draws a plausible production curve for 8,2 kWp', () => {
    expect(production(13 + 10 / 60)).toBeCloseTo(6.4, 2);
    expect(production(3)).toBe(0);
    expect(dayKwh()).toBeCloseTo(day.prod, 0);
    expect(day.prod / 8.2).toBeGreaterThan(4);
    expect(day.prod / 8.2).toBeLessThan(7);
  });
});

describe('poludnie draw lab', () => {
  it('eases both curves and matches the video presets', () => {
    expect(drawEase(0)).toBe(0);
    expect(drawEase(1)).toBe(1);
    expect(drawEase(0.2)).toBeLessThan(0.2);
    expect(countEase(0.2)).toBeGreaterThan(0.5);
    expect(framesToMs(40)).toBe(1333);
    const draw = manifest.motion.find(item => item.id === 'draw');
    expect(draw).toMatchObject({ kind: 'bezier', points: [0.65, 0, 0.35, 1], ms: 1333 });
    const count = manifest.motion.find(item => item.id === 'count');
    expect(count).toMatchObject({ kind: 'bezier', points: [0.22, 1, 0.36, 1], ms: 1000 });
  });
});

describe('poludnie files', () => {
  it('has a store cut that matches the Apple specification', () => {
    const store = manifest.finals.find(file => file.kind === 'store')!;
    expect(store.width).toBe(886);
    expect(store.height).toBe(1920);
    expect(store.fps).toBe(30);
    expect(store.frames).toBe(manifest.storyboard.duration);
    expect(store.codec).toBe('h264');
    expect(store.pixFmt).toBe('yuv420p');
  });

  it('keeps every web loop under 4 MB and publishes it', () => {
    for (const video of Object.values(manifest.videos)) {
      for (const file of [video.webm, video.mp4]) {
        expect(file.bytes).toBeLessThanOrEqual(4 * 1024 * 1024);
        expect(existsSync(join(pub, file.path))).toBe(true);
      }
      expect(statSync(join(pub, video.poster)).size).toBeLessThanOrEqual(150 * 1024);
    }
  });

  it('publishes every screen, the board and the font with its licence', () => {
    expect(manifest.gallery.length).toBeGreaterThanOrEqual(5);
    expect(manifest.gallery.length).toBeLessThanOrEqual(7);
    for (const item of manifest.gallery) expect(existsSync(join(pub, item.file))).toBe(true);
    expect(existsSync(join(pub, manifest.storyboard.board))).toBe(true);
    for (const font of manifest.fonts) {
      expect(existsSync(join(pub, font.file))).toBe(true);
      expect(existsSync(join(pub, font.license))).toBe(true);
    }
  });

  it('stays inside the publishing budget', () => {
    expect(manifest.published.totalBytes).toBeLessThanOrEqual(14 * 1024 * 1024);
  });
});

describe('poludnie content', () => {
  it('meets AA contrast for text colours on white', () => {
    for (const id of ['ink', 'secondary', 'sunText', 'batteryText', 'home', 'gridText']) {
      const color = manifest.palette.find(item => item.id === id)!;
      expect(color.onSurface).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('labels prices as examples and carries no ratings or download counts', () => {
    const text = JSON.stringify(content).toLowerCase();
    expect(text).toContain('przykładowe');
    for (const word of ['ocena', 'gwiazd', 'pobrań', 'nagrod', 'opinie'])
      expect(text).not.toContain(word);
  });
});
