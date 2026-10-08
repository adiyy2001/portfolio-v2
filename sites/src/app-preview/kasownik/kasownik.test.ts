import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { readManifest } from '../shared/manifest';
import { content } from './content';

const manifest = readManifest('kasownik');
const pub = join(process.cwd(), 'public', 'app-preview', 'kasownik');
const words = (text: string) => text.split(/\s+/).filter(word => /[\p{L}\p{N}]/u.test(word)).length;

describe('kasownik storyboard', () => {
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
      expect(overlay.to - overlay.from + 1).toBeGreaterThanOrEqual(45);
      expect(overlay.top).toBeGreaterThanOrEqual(60);
      expect(overlay.top + 52).toBeLessThanOrEqual(880);
    }
  });

  it('opens with a hook inside the first two seconds', () => {
    expect(shots[0].to).toBeLessThan(60);
  });
});

describe('kasownik files', () => {
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

  it('publishes every screen, the board and the fonts', () => {
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

describe('kasownik content', () => {
  it('meets contrast for small text on white', () => {
    for (const id of ['ink', 'secondary', 'brand', 'brandDeep']) {
      const color = manifest.palette.find(item => item.id === id)!;
      expect(color.onSurface).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('has no ratings, downloads or awards in the copy', () => {
    const text = JSON.stringify(content).toLowerCase();
    for (const word of ['ocena', 'gwiazd', 'pobrań', 'nagrod', 'opinie'])
      expect(text).not.toContain(word);
  });
});
