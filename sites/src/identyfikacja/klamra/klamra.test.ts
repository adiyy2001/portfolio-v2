import { describe, expect, it } from 'vitest';
import { content, contact, extras } from './content';
import { clamp, hashSeed, mulberry32, nudge, scatter, tidy } from './lib/scatter';
import { stickerBox, stickerSet, stickerSvg } from './lib/stickers';
import { laptopArea, laptopStickers, logoVariants } from './view';

const items = laptopStickers.map(piece => ({
  id: piece.id,
  width: piece.width,
  height: piece.height,
}));

const overlaps = (a: { x: number; y: number; width: number; height: number }, b: typeof a) =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

describe('seeded scatter', () => {
  it('gives the same random sequence for the same seed', () => {
    const first = mulberry32(hashSeed('mix-1'));
    const second = mulberry32(hashSeed('mix-1'));
    expect([first(), first(), first()]).toEqual([second(), second(), second()]);
  });

  it('gives the same layout for the same round and a different one for another', () => {
    expect(scatter(items, laptopArea, 3)).toEqual(scatter(items, laptopArea, 3));
    expect(scatter(items, laptopArea, 3)).not.toEqual(scatter(items, laptopArea, 4));
  });

  it('keeps every scattered sticker inside the lid with a small tilt', () => {
    for (let round = 0; round < 30; round += 1) {
      scatter(items, laptopArea, round).forEach((place, index) => {
        expect(place.x).toBeGreaterThanOrEqual(0);
        expect(place.y).toBeGreaterThanOrEqual(0);
        expect(place.x + items[index].width).toBeLessThanOrEqual(laptopArea.width);
        expect(place.y + items[index].height).toBeLessThanOrEqual(laptopArea.height);
        expect(Math.abs(place.rotation)).toBeLessThanOrEqual(18);
      });
    }
  });

  it('tidies the stickers into rows without overlaps and without rotation', () => {
    const placed = tidy(items, laptopArea).map((place, index) => ({ ...place, ...items[index] }));
    placed.forEach(place => {
      expect(place.rotation).toBe(0);
      expect(place.x + place.width).toBeLessThanOrEqual(laptopArea.width);
      expect(place.y + place.height).toBeLessThanOrEqual(laptopArea.height);
    });
    for (let i = 0; i < placed.length; i += 1) {
      for (let j = i + 1; j < placed.length; j += 1) {
        expect(overlaps(placed[i], placed[j])).toBe(false);
      }
    }
  });

  it('clamps a nudge to the lid', () => {
    const start = { id: items[0].id, x: 2, y: 2, rotation: 0 };
    const moved = nudge(start, -50, -50, items[0], laptopArea);
    expect([moved.x, moved.y]).toEqual([0, 0]);
    const far = nudge(start, 5000, 5000, items[0], laptopArea);
    expect(far.x).toBe(laptopArea.width - items[0].width);
    expect(far.y).toBe(laptopArea.height - items[0].height);
    expect(clamp(5, 0, 3)).toBe(3);
  });
});

describe('stickers', () => {
  it('builds ten stickers with unique ids and numeric svg', () => {
    expect(stickerSet).toHaveLength(10);
    expect(new Set(stickerSet.map(sticker => sticker.id)).size).toBe(10);
    stickerSet.forEach(sticker => {
      const svg = stickerSvg(sticker);
      expect(svg).not.toMatch(/NaN|undefined/);
      expect(svg).toContain('<text');
      expect(stickerBox(sticker).width).toBeGreaterThan(sticker.w);
    });
  });

  it('escapes the angle brackets of the tag sticker', () => {
    const tag = stickerSet.find(sticker => sticker.id === 'tag')!;
    expect(stickerSvg(tag)).toContain('&lt;/&gt;');
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

  it('gives four tone rules with a yes and a no', () => {
    expect(content.tone).toHaveLength(4);
    content.tone.forEach(rule => {
      expect(rule.yes.length).toBeGreaterThan(10);
      expect(rule.no.length).toBeGreaterThan(10);
    });
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
