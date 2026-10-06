import { describe, expect, it } from 'vitest';
import { content, contact, extras } from './content';
import { hashSeed, imprint, loafParts, mulberry32, stampArt } from './lib/stamp';
import { heroArt, logoVariants } from './view';

describe('seeded stamp', () => {
  it('gives the same random sequence for the same seed', () => {
    const first = mulberry32(hashSeed('rim-1'));
    const second = mulberry32(hashSeed('rim-1'));
    expect([first(), first(), first()]).toEqual([second(), second(), second()]);
  });

  it('gives the same imprint for the same number and a different one for another', () => {
    expect(imprint(7)).toEqual(imprint(7));
    expect(imprint(7).art.band).not.toBe(imprint(8).art.band);
  });

  it('keeps imprint rotation, offset and opacity in range', () => {
    for (let n = 1; n <= 40; n += 1) {
      const print = imprint(n);
      expect(Math.abs(print.rotation)).toBeLessThanOrEqual(11);
      expect(Math.abs(print.offsetX)).toBeLessThanOrEqual(3);
      expect(print.opacity).toBeGreaterThanOrEqual(0.78);
      expect(print.opacity).toBeLessThanOrEqual(0.96);
    }
  });

  it('draws closed paths with numbers only', () => {
    const art = stampArt(hashSeed('x'));
    [art.band, art.thin, art.specks].forEach(path => {
      expect(path).toMatch(/^M/);
      expect(path).not.toMatch(/NaN|undefined/);
    });
    const loaf = loafParts(hashSeed('loaf'));
    expect(loaf.body).not.toMatch(/NaN/);
  });

  it('builds the hero composition from fixed seeds', () => {
    expect(heroArt.specks).toHaveLength(46);
    expect(heroArt.ring.length).toBeGreaterThan(1000);
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
