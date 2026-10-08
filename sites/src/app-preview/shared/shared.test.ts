import { describe, expect, it } from 'vitest';
import { bezier, curvePath, springSamples, springStats } from './curves';
import { previewApps } from './apps';
import { formatBytes, formatSeconds, presetValue } from './manifest';

describe('curves', () => {
  it('spring settles at 1', () => {
    const samples = springSamples({ mass: 1, stiffness: 260, damping: 28 });
    expect(samples[0]).toBe(0);
    expect(Math.abs((samples.at(-1) ?? 0) - 1)).toBeLessThan(0.001);
  });

  it('reports overshoot of a soft spring and none of a damped one', () => {
    expect(springStats({ mass: 1, stiffness: 180, damping: 12 }).overshoot).toBeGreaterThan(0.05);
    expect(springStats({ mass: 1, stiffness: 300, damping: 32 }).overshoot).toBeLessThan(0.01);
  });

  it('bezier keeps its end points and stays monotonic for ease curves', () => {
    const ease = bezier(0.25, 0.1, 0.25, 1);
    expect(ease(0)).toBe(0);
    expect(ease(1)).toBe(1);
    let last = 0;
    for (let i = 1; i <= 20; i += 1) {
      const value = ease(i / 20);
      expect(value).toBeGreaterThanOrEqual(last);
      last = value;
    }
  });

  it('draws a path with one point per value', () => {
    expect(curvePath([0, 0.5, 1], 100, 50).split(/[ML]/).filter(Boolean)).toHaveLength(3);
  });
});

describe('registry and formatting', () => {
  it('lists six apps with unique ascii slugs', () => {
    expect(previewApps).toHaveLength(6);
    expect(new Set(previewApps.map(app => app.slug)).size).toBe(6);
    for (const app of previewApps) expect(app.slug).toMatch(/^[a-z]+$/);
  });

  it('formats sizes, seconds and presets in Polish', () => {
    expect(formatBytes(2.5 * 1024 * 1024)).toBe('2,5 MB');
    expect(formatSeconds(23)).toBe('23,0 s');
    expect(
      presetValue({
        id: 'a',
        use: '',
        kind: 'spring',
        mass: 1,
        stiffness: 300,
        damping: 32,
        note: '',
      }),
    ).toBe('sprężyna: masa 1, sztywność 300, tłumienie 32');
  });
});

describe('non breaking spaces', () => {
  it('glues numbers to their units', async () => {
    const { nb } = await import('./manifest');
    expect(nb('około 380 ms, cykl 2,4 s')).toBe('około 380 ms, cykl 2,4 s');
    expect(nb('każda do 4 MB')).toBe('każda do 4 MB');
  });
});
