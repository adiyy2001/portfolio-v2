import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { springStats } from '../shared/curves';
import { readManifest } from '../shared/manifest';
import { content } from './content';
import { dropPose, fallMs, peakStretch, returnCurve, squashMs, totalMs } from './drop';

const manifest = readManifest('kielek');
const pub = join(process.cwd(), 'public', 'app-preview', 'kielek');
const words = (text: string) => text.split(/\s+/).filter(word => /[\p{L}\p{N}]/u.test(word)).length;
const bounce = { mass: 1, stiffness: 180, damping: 12 };
const stiff = { mass: 1, stiffness: 260, damping: 34 };

describe('kielek storyboard', () => {
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
      expect(overlay.top + 54).toBeLessThanOrEqual(880);
    }
  });

  it('opens on the mascot inside the first two seconds and uses it as the poster', () => {
    expect(shots[0].to).toBeLessThan(60);
    expect(manifest.storyboard.poster).toBeLessThan(60);
  });
});

describe('kielek drop lab', () => {
  it('falls, squashes and returns to its own shape', () => {
    const curve = returnCurve(bounce);
    expect(dropPose(0, curve).y).toBe(0);
    expect(dropPose(fallMs - 1, curve).y).toBeGreaterThan(0.9);
    const squash = dropPose(fallMs + squashMs - 1, curve);
    expect(squash.sy).toBeLessThan(0.9);
    expect(squash.sx).toBeGreaterThan(1.08);
    const end = dropPose(totalMs, curve);
    expect(end.sy).toBeCloseTo(1, 2);
    expect(end.sx).toBeCloseTo(1, 2);
  });

  it('overshoots on bounce and never on the stiff spring', () => {
    expect(springStats(bounce).overshoot).toBeGreaterThan(0.15);
    expect(springStats(stiff).overshoot).toBeLessThan(0.005);
    expect(peakStretch(returnCurve(bounce))).toBeGreaterThan(1.01);
    expect(peakStretch(returnCurve(stiff))).toBeLessThanOrEqual(1.0001);
  });

  it('matches the bounce preset in the video tokens', () => {
    const preset = manifest.motion.find(item => item.id === 'bounce');
    expect(preset).toMatchObject({ kind: 'spring', ...bounce });
    const drop = manifest.motion.find(item => item.id === 'drop');
    expect(drop).toMatchObject({ kind: 'bezier', points: [0.55, 0, 1, 0.45], ms: fallMs });
  });
});

describe('kielek files', () => {
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

  it('publishes every screen, the board and three font weights with the licence', () => {
    expect(manifest.gallery.length).toBeGreaterThanOrEqual(5);
    expect(manifest.gallery.length).toBeLessThanOrEqual(7);
    for (const item of manifest.gallery) expect(existsSync(join(pub, item.file))).toBe(true);
    expect(existsSync(join(pub, manifest.storyboard.board))).toBe(true);
    expect(manifest.fonts.map(font => font.weight)).toEqual(['500', '800', '900']);
    for (const font of manifest.fonts) {
      expect(existsSync(join(pub, font.file))).toBe(true);
      expect(existsSync(join(pub, font.license))).toBe(true);
    }
  });

  it('stays inside the publishing budget', () => {
    expect(manifest.published.totalBytes).toBeLessThanOrEqual(14 * 1024 * 1024);
  });
});

describe('kielek content', () => {
  it('meets AA contrast for text colours on peach and on cards', () => {
    for (const id of ['ink', 'inkSoft']) {
      const color = manifest.palette.find(item => item.id === id)!;
      expect(color.onSurface).toBeGreaterThanOrEqual(4.5);
      expect(color.onGrouped).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('adds up the watering plan and carries no ratings or download counts', () => {
    const total = content.client.plan.rows.reduce(
      (sum, row) => sum + Number.parseInt(row[2], 10),
      0,
    );
    expect(content.client.plan.total).toContain(String(total));
    const text = JSON.stringify(content).toLowerCase();
    for (const word of ['ocena', 'gwiazd', 'pobrań', 'nagrod', 'opinie'])
      expect(text).not.toContain(word);
  });
});
