import { describe, expect, it } from 'vitest';
import { fallbackFaceCss, fontFacesCss, toPercent } from './font-faces';

describe('toPercent', () => {
  it('rounds to two decimals', () => {
    expect(toPercent(1.125 / 1.13)).toBe('99.56%');
    expect(toPercent(1.13)).toBe('113%');
    expect(toPercent(0)).toBe('0%');
  });
});

describe('fallbackFaceCss', () => {
  it('divides the vertical metrics by the size adjustment', () => {
    const css = fallbackFaceCss({ weight: '400', sizeAdjust: 113, sources: ['Times New Roman'] });
    expect(css).toContain('size-adjust:113%');
    expect(css).toContain('ascent-override:99.56%');
    expect(css).toContain('descent-override:35.4%');
    expect(css).toContain('line-gap-override:0%');
    expect(css).toContain("src:local('Times New Roman')");
  });

  it('lists every local source in order', () => {
    const css = fallbackFaceCss({ weight: '400', sizeAdjust: 100, sources: ['A', 'B'] });
    expect(css).toContain("src:local('A'),local('B')");
  });
});

describe('fontFacesCss', () => {
  const css = fontFacesCss('/portfolio-v2/wzornik/rozwaga/fonts/BodoniModa.woff2');

  it('declares the variable face with swap', () => {
    expect(css).toContain('url(/portfolio-v2/wzornik/rozwaga/fonts/BodoniModa.woff2) format');
    expect(css).toContain('font-weight:400 700');
    expect(css).toContain('font-display:swap');
  });

  it('adds one metric matched fallback per weight range', () => {
    expect(css.match(/font-family:'Bodoni Moda Fallback'/g)).toHaveLength(3);
    expect(css).toContain('size-adjust:113%');
    expect(css).toContain('size-adjust:114.4%');
    expect(css).toContain('size-adjust:110.5%');
    expect(css).toContain("local('Liberation Serif Bold')");
  });

  it('contains no line breaks or dashes other than css syntax', () => {
    expect(css).not.toMatch(/[\n\u2013\u2014]/);
  });
});
