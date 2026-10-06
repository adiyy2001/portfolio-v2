import { describe, expect, it } from 'vitest';
import { content, contact, extras } from './content';
import {
  clampParams,
  composerStripes,
  composerSvg,
  defaultParams,
  describeParams,
  presets,
} from './lib/stripes';
import { heroArcs, logoVariants, swoosh } from './view';

describe('stripe composer', () => {
  it('clamps the stripe count, colors and curvature', () => {
    const params = clampParams({
      count: 9,
      colors: ['a', 'b', 'c', 'd', 'e', 'f'],
      curvature: 4,
      wear: 1 as never,
    });
    expect(params.count).toBe(5);
    expect(params.colors).toHaveLength(5);
    expect(params.curvature).toBe(1);
    expect(params.wear).toBe(true);
    expect(clampParams({ ...defaultParams, count: 0, curvature: -1 }).count).toBe(2);
  });

  it('draws one stripe per count in the chosen colors', () => {
    const stripes = composerStripes(defaultParams);
    expect(stripes.map(stripe => stripe.id)).toEqual(['pomarancz', 'musztarda', 'brazowy']);
    stripes.forEach(stripe => expect(stripe.d).not.toMatch(/NaN|undefined/));
  });

  it('keeps every preset valid and draws a standalone svg', () => {
    presets.forEach(preset => {
      const svg = composerSvg(preset.params);
      expect(svg).toMatch(/^<svg /);
      expect(svg).not.toMatch(/NaN/);
      expect(composerStripes(preset.params)).toHaveLength(clampParams(preset.params).count);
    });
  });

  it('adds the wear filter only when asked', () => {
    expect(composerSvg(defaultParams)).not.toContain('feTurbulence');
    expect(composerSvg({ ...defaultParams, wear: true })).toContain('feTurbulence');
  });

  it('describes the stripes in Polish with the right plural', () => {
    expect(describeParams(defaultParams)).toMatch(/^3 pasy: Pomarańcz, Musztarda, Brąz/);
    expect(describeParams({ ...defaultParams, count: 5 })).toMatch(/^5 pasów/);
  });
});

describe('page art', () => {
  it('builds three hero arcs and three swoosh lines', () => {
    expect(heroArcs).toHaveLength(3);
    heroArcs.forEach(arc => expect(arc.d).not.toMatch(/NaN/));
    expect(swoosh).toHaveLength(3);
  });
});

describe('case study content', () => {
  const texts = JSON.stringify({ content, contact, extras });

  it('has no dashes and no placeholder copy', () => {
    expect(texts).not.toMatch(/[\u2013\u2014]/);
    expect(texts.toLowerCase()).not.toMatch(/lorem|twoja firma/);
  });

  it('uses a made up e-mail and phone', () => {
    expect(contact.email).toMatch(/\.example$/);
    expect(contact.phone).toMatch(/000 00/);
  });

  it('describes two rejected directions and refers to existing figure names', () => {
    expect(content.process.rejected).toHaveLength(2);
    content.process.rejected.forEach(item => expect(item.thumb).toMatch(/^figures\/.+\.svg$/));
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
