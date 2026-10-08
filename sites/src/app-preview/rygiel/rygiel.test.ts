import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { readManifest } from '../shared/manifest';
import { content } from './content';
import { changesPerSecond, doneAt, presets, pulse, scramble, settledShare } from './scramble';

const manifest = readManifest('rygiel');
const pub = join(process.cwd(), 'public', 'app-preview', 'rygiel');
const words = (text: string) => text.split(/\s+/).filter(word => /[\p{L}\p{N}]/u.test(word)).length;
const password = 'k7#Vq2!rTz9pL$w4Hn8e';

describe('rygiel storyboard', () => {
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

  it('opens with the alert inside the first two seconds and uses it as the poster', () => {
    expect(shots[0].to).toBeLessThan(60);
    expect(manifest.storyboard.poster).toBeLessThan(60);
  });
});

describe('rygiel scramble', () => {
  it('ends on the real text and never changes its length', () => {
    for (const preset of Object.values(presets)) {
      const end = doneAt(password, preset);
      const glyphs = scramble(password, end, preset);
      expect(glyphs.map(g => g.ch).join('')).toBe(password);
      expect(glyphs.every(g => g.state === 'done')).toBe(true);
      expect(scramble(password, end / 2, preset)).toHaveLength(password.length);
    }
  });

  it('keeps the readable preset slow enough to follow and the fast one a flicker', () => {
    expect(doneAt(password, presets.readable)).toBeGreaterThanOrEqual(40);
    expect(doneAt(password, presets.fast)).toBeLessThanOrEqual(12);
    expect(changesPerSecond(presets.readable)).toBe(15);
    expect(settledShare(password, 0, presets.readable)).toBe(0);
  });

  it('pulses between 35 and 60 percent once every 36 frames', () => {
    expect(pulse(0, 36, 0.35, 0.6)).toBeCloseTo(0.35);
    expect(pulse(18, 36, 0.35, 0.6)).toBeCloseTo(0.6);
    expect(pulse(36, 36, 0.35, 0.6)).toBeCloseTo(0.35);
  });

  it('matches the scramble preset in the video tokens', () => {
    const preset = manifest.motion.find(item => item.id === 'scramble');
    expect(preset?.note).toContain('2 klatki odstępu na znak');
    expect(preset?.note).toContain('6 do 10 klatek');
  });
});

describe('rygiel files', () => {
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

  it('publishes every screen, the board and both fonts with their licences', () => {
    expect(manifest.gallery.length).toBeGreaterThanOrEqual(5);
    expect(manifest.gallery.length).toBeLessThanOrEqual(7);
    for (const item of manifest.gallery) expect(existsSync(join(pub, item.file))).toBe(true);
    expect(existsSync(join(pub, manifest.storyboard.board))).toBe(true);
    expect(manifest.fonts).toHaveLength(2);
    for (const font of manifest.fonts) {
      expect(existsSync(join(pub, font.file))).toBe(true);
      expect(existsSync(join(pub, font.license))).toBe(true);
    }
  });

  it('stays inside the publishing budget', () => {
    expect(manifest.published.totalBytes).toBeLessThanOrEqual(14 * 1024 * 1024);
  });
});

describe('rygiel content', () => {
  it('meets AA contrast for small text on the void and on panels', () => {
    for (const id of ['text', 'muted', 'cyan', 'alert', 'warn']) {
      const color = manifest.palette.find(item => item.id === id)!;
      expect(color.onSurface).toBeGreaterThanOrEqual(4.5);
      expect(color.onGrouped).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('uses only invented example domains and no ratings or download counts', () => {
    const text = JSON.stringify(content).toLowerCase();
    for (const word of ['ocena', 'gwiazd', 'pobrań', 'nagrod', 'opinie'])
      expect(text).not.toContain(word);
    for (const domain of text.match(/[a-z0-9.-]+\.(?:pl|com|net|org)\b/g) ?? [])
      expect(domain).toBe('');
  });
});
