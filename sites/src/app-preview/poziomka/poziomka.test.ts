import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { readManifest } from '../shared/manifest';
import { content } from './content';
import { berry, peak, posesPerJump, smoothHeight, steppedHeight } from './jump';
import { fitWidth } from './pixelfit';

const manifest = readManifest('poziomka');
const pub = join(process.cwd(), 'public', 'app-preview', 'poziomka');
const words = (text: string) => text.split(/\s+/).filter(word => /[\p{L}\p{N}]/u.test(word)).length;

describe('poziomka storyboard', () => {
  const { shots, duration, fps } = manifest.storyboard;

  it('covers every frame of a 20 second store cut without gaps', () => {
    expect(duration / fps).toBe(20);
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
      expect(overlay.top + 80).toBeLessThanOrEqual(880);
    }
  });

  it('opens on the level up and uses it as the poster', () => {
    expect(shots[0].to).toBeLessThan(60);
    expect(manifest.storyboard.poster).toBeLessThan(60);
  });
});

describe('poziomka step lab', () => {
  it('samples the jump into the poses of the video at 7.5 fps', () => {
    const heights = [0, 1, 2, 3].map(k => steppedHeight(k * (1000 / 7.5), 7.5));
    expect(heights).toEqual([0, 3, 5, 3]);
    expect(posesPerJump(7.5)).toBe(4);
  });

  it('keeps the smooth jump continuous and the stepped one in whole pixels', () => {
    expect(smoothHeight(0)).toBe(0);
    expect(smoothHeight(533 / 2)).toBeCloseTo(peak, 1);
    for (let ms = 0; ms < 533; ms += 17) expect(Number.isInteger(steppedHeight(ms, 15))).toBe(true);
    for (const row of berry) expect(row).toHaveLength(16);
  });

  it('matches the walk preset of the video tokens', () => {
    const walk = manifest.motion.find(item => item.id === 'walk');
    expect(walk).toMatchObject({ kind: 'steps', steps: 4 });
    expect(walk?.note).toContain('0, 3, 5 i 3');
  });

  it('fits pixel media to whole device pixels when it can', () => {
    expect(fitWidth(646, 120, 480, 1)).toBe(600);
    expect(fitWidth(1240, 960, 960, 1)).toBe(960);
    expect(fitWidth(358, 540, 540, 3)).toBe(358);
    expect(fitWidth(295, 221, 442, 1)).toBe(221);
    expect(fitWidth(295, 221, 442, 2)).toBe(221);
  });
});

describe('poziomka files', () => {
  it('has a store cut that matches the Apple specification', () => {
    const store = manifest.finals.find(file => file.kind === 'store')!;
    expect(store.width).toBe(886);
    expect(store.height).toBe(1920);
    expect(store.fps).toBe(30);
    expect(store.frames).toBe(manifest.storyboard.duration);
    expect(store.codec).toBe('h264');
    expect(store.pixFmt).toBe('yuv420p');
  });

  it('keeps every web loop under 4 MB at a whole fraction of the master', () => {
    for (const video of Object.values(manifest.videos)) {
      for (const file of [video.webm, video.mp4]) {
        expect(file.bytes).toBeLessThanOrEqual(4 * 1024 * 1024);
        expect(existsSync(join(pub, file.path))).toBe(true);
      }
      expect(statSync(join(pub, video.poster)).size).toBeLessThanOrEqual(150 * 1024);
    }
    expect(manifest.videos.store.mp4.width).toBe(884);
    expect(1920 % manifest.videos.hero.mp4.width).toBe(0);
  });

  it('publishes every screen, the board and both pixel fonts with the licence', () => {
    expect(manifest.gallery.length).toBeGreaterThanOrEqual(5);
    expect(manifest.gallery.length).toBeLessThanOrEqual(7);
    for (const item of manifest.gallery) expect(existsSync(join(pub, item.file))).toBe(true);
    expect(existsSync(join(pub, manifest.storyboard.board))).toBe(true);
    expect(manifest.fonts.map(font => font.family)).toEqual(['Jersey 10', 'Tiny5']);
    for (const font of manifest.fonts) {
      expect(existsSync(join(pub, font.file))).toBe(true);
      expect(existsSync(join(pub, font.license))).toBe(true);
    }
  });

  it('stays inside the publishing budget', () => {
    expect(manifest.published.totalBytes).toBeLessThanOrEqual(14 * 1024 * 1024);
  });
});

describe('poziomka content', () => {
  it('uses a fixed palette of 16 colours with AA text pairs', () => {
    expect(manifest.palette).toHaveLength(16);
    expect(new Set(manifest.palette.map(item => item.hex)).size).toBe(16);
    for (const id of ['ink', 'dusk']) {
      const color = manifest.palette.find(item => item.id === id)!;
      expect(color.onSurface).toBeGreaterThanOrEqual(4.5);
      expect(color.onGrouped).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('adds up the morning XP and carries no ratings or download counts', () => {
    const done = content.client.quests.rows
      .filter(row => row[3])
      .reduce((sum, row) => sum + row[2], 0);
    expect(1160 + done).toBe(1200);
    const all = content.client.quests.rows.reduce((sum, row) => sum + row[2], 0);
    expect(all).toBe(100);
    const text = JSON.stringify(content).toLowerCase();
    for (const word of ['ocena', 'gwiazdk', 'pobrań', 'opinie', 'recenzj'])
      expect(text).not.toContain(word);
  });
});
