import { describe, expect, it } from 'vitest';
import { content, contact, extras } from './content';
import {
  clearSpace,
  columnLeft,
  columnWidth,
  gutterFor,
  logoHeight,
  place,
  spanWidth,
  toMm,
  variants,
  verdict,
} from './lib/grid';
import motionData from './motion-data.json';
import { animationSvg, duration, initialCss, play, stage, timeline } from './lib/motion';
import { nbsp, typo } from './lib/typo';
import { groupFormats, logoVariants, proportions } from './view';

describe('case study content', () => {
  const texts = JSON.stringify({ content, contact, extras });

  it('has no dashes and no placeholder copy', () => {
    expect(texts).not.toMatch(/[\u2013\u2014]/);
    const withoutCta = JSON.stringify({ content: { ...content, cta: null }, contact, extras });
    expect(withoutCta.toLowerCase()).not.toMatch(/\blorem\b|twoja firma/);
  });

  it('uses a made up e-mail and phone', () => {
    expect(contact.email).toMatch(/\.example$/);
    expect(contact.phone).toMatch(/000 00/);
  });

  it('describes two rejected directions and refers to existing figure names', () => {
    expect(content.process.rejected).toHaveLength(2);
    content.process.rejected.forEach(item =>
      expect(item.thumb).toMatch(/^figures\/direction-.+\.svg$/),
    );
  });

  it('gives alt text for every application and three social posts', () => {
    content.applications.forEach(item => expect(item.alt.length).toBeGreaterThan(20));
    expect(extras.social).toHaveLength(3);
  });

  it('lists the six logo variants and shares that add up to 100', () => {
    expect(logoVariants.map(variant => variant.id)).toEqual([
      'primary',
      'horizontal',
      'vertical',
      'symbol',
      'mono-black',
      'negative',
    ]);
    expect(proportions.reduce((sum, item) => sum + item.share, 0)).toBe(100);
  });

  it('keeps characters outside the font subset out of the copy', () => {
    expect(texts).not.toMatch(/²/);
  });
});

describe('typography filter', () => {
  it('ties single letter words to the next word', () => {
    expect(nbsp('Dom z garażem i basenem w parku')).toBe(
      'Dom z\u00a0garażem i\u00a0basenem w\u00a0parku',
    );
    expect(nbsp('w z a')).toBe('w\u00a0z\u00a0a');
    expect(nbsp('Rzut 07 i 08')).toBe('Rzut 07 i\u00a008');
  });

  it('walks nested content and leaves other values alone', () => {
    expect(typo({ list: ['a b', 3], text: 'o domu' })).toEqual({
      list: ['a\u00a0b', 3],
      text: 'o\u00a0domu',
    });
  });

  it('leaves no single letter word at the end of a line in the copy', () => {
    const texts = JSON.stringify({ content, extras });
    expect(texts).not.toMatch(/[ \u201e(]['aiouwzAIOUWZ] [^\s]/);
  });

  it('labels every icon with Polish letters', () => {
    expect(extras.iconLabels.dzialka).toBe('Działka');
    expect(extras.iconLabels.przekroj).toBe('Przekrój');
    expect(Object.keys(extras.iconLabels)).toHaveLength(12);
  });
});

describe('download groups', () => {
  const manifest = { files: [{ group: 'brandbook', pages: 28, width: 0, height: 0 }] } as never;
  it('names the dimensions of the brand book and the mockups', () => {
    expect(groupFormats(manifest, { id: 'brandbook', formats: '' } as never)).toBe(
      'PDF, 28 stron 1920×1080 px',
    );
    expect(groupFormats(manifest, { id: 'mockups', formats: '' } as never)).toBe(
      'JPG, szerokość 1500 do 1900 px',
    );
  });
});

describe('grid tester logic', () => {
  it('splits the stage into equal columns', () => {
    expect(columnWidth(1000, 12, 16)).toBeCloseTo(68.67, 1);
    expect(spanWidth(12, 1000, 12, 16)).toBeCloseTo(1000, 5);
    expect(columnLeft(0, 1000, 12, 16)).toBe(0);
    expect(columnLeft(1, 1000, 12, 16)).toBeCloseTo(84.67, 1);
  });

  it('snaps to whole columns and stays inside the stage', () => {
    const snapped = place({ width: 1000, cols: 12, gutter: 16, start: 2.4, span: 4.6, snap: true });
    expect(snapped.start).toBe(2);
    expect(snapped.span).toBe(5);
    const clamped = place({ width: 1000, cols: 12, gutter: 16, start: 11, span: 8, snap: true });
    expect(clamped.start + clamped.span).toBeLessThanOrEqual(12);
    expect(clamped.left + clamped.width).toBeLessThanOrEqual(1000.001);
  });

  it('keeps fractional positions when snapping is off', () => {
    const free = place({ width: 800, cols: 8, gutter: 16, start: 1.5, span: 2.5, snap: false });
    expect(free.start).toBe(1.5);
    expect(free.span).toBe(2.5);
  });

  it('measures clear space as half of the square and applies the minimum sizes', () => {
    expect(clearSpace('symbol', 120)).toBe(60);
    expect(clearSpace('horizontal', 511)).toBeCloseTo(60, 5);
    expect(logoHeight('primary', 511)).toBeCloseTo(211, 5);
    expect(verdict('horizontal', 95)).toBe('small');
    expect(verdict('horizontal', 96)).toBe('ok');
    expect(verdict('primary', 279)).toBe('small');
    expect(variants.symbol.minimum).toBe(16);
  });

  it('converts pixels to millimetres at 96 ppi and picks a gutter by width', () => {
    expect(toMm(96)).toBe(25.4);
    expect(gutterFor(390)).toBe(4);
    expect(gutterFor(1000)).toBe(16);
  });
});

describe('logo animation', () => {
  const steps = timeline();
  const svg = animationSvg(motionData);

  it('finishes inside the declared duration', () => {
    expect(duration).toBeGreaterThanOrEqual(2000);
    expect(duration).toBeLessThanOrEqual(4000);
    steps.forEach(step =>
      expect(step.options.delay + step.options.duration).toBeLessThanOrEqual(duration),
    );
  });

  it('animates only elements that exist in the svg', () => {
    steps.forEach(step => expect(svg).toContain(`id="${step.id}"`));
    expect(steps).toHaveLength(stage.cols + 1 + 13 + 1 + 4 + 2);
  });

  it('draws the grid before the square and the square before the letters', () => {
    const start = (id: string) => steps.find(step => step.id === id)!.options.delay;
    expect(start('v0')).toBeLessThan(start('sq'));
    expect(start('sq')).toBeLessThan(start('L0'));
    expect(start('L3')).toBeLessThan(start('c0'));
  });

  it('is an svg without live text and with hidden initial states', () => {
    expect(svg).not.toContain('<text');
    expect(initialCss).toContain('#sq{opacity:0');
  });

  it('plays every step on a root and can start paused', () => {
    const calls: { id: string; paused: boolean }[] = [];
    const root = {
      querySelector: (selector: string) => ({
        animate: () => {
          const entry = { id: selector.slice(1), paused: false };
          calls.push(entry);
          return {
            pause: () => {
              entry.paused = true;
            },
          };
        },
      }),
    } as unknown as ParentNode;
    expect(play(root, true)).toHaveLength(steps.length);
    expect(calls.every(call => call.paused)).toBe(true);
  });
});
