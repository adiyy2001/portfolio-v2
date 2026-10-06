import { describe, expect, it } from 'vitest';
import {
  blend,
  blendKind,
  canAdd,
  canRemove,
  defaultPicks,
  maxPicks,
  minPicks,
  promote,
  sharesFor,
  summary,
  toggle,
} from './composer';
import { content, contact, extras, grapes, vintages } from './content';
import type { Manifest } from '../shared/types';
import { iconNames, logoVariants } from './view';

describe('label composer', () => {
  it('splits the blend into shares that always add up to 100', () => {
    [1, 2, 3].forEach(count => {
      expect(sharesFor(count).reduce((sum, share) => sum + share, 0)).toBe(100);
    });
    expect(sharesFor(0)).toEqual([]);
  });

  it('starts with two varieties inside the allowed range', () => {
    expect(defaultPicks.length).toBeGreaterThanOrEqual(minPicks);
    expect(defaultPicks.length).toBeLessThanOrEqual(maxPicks);
  });

  it('adds a variety up to the limit and refuses a fourth', () => {
    let picks = toggle(defaultPicks, 'regent');
    expect(picks).toHaveLength(3);
    expect(canAdd(picks)).toBe(false);
    picks = toggle(picks, 'riesling');
    expect(picks).toEqual(['solaris', 'johanniter', 'regent']);
  });

  it('removes a variety down to the minimum and refuses the last two', () => {
    const three = ['solaris', 'johanniter', 'regent'];
    expect(toggle(three, 'regent')).toEqual(['solaris', 'johanniter']);
    expect(canRemove(['solaris', 'johanniter'])).toBe(false);
    expect(toggle(['solaris', 'johanniter'], 'solaris')).toEqual(['solaris', 'johanniter']);
  });

  it('ignores an unknown variety', () => {
    expect(toggle(defaultPicks, 'merlot')).toEqual(defaultPicks);
  });

  it('moves a picked variety to the front and leaves the others in order', () => {
    expect(promote(['solaris', 'johanniter', 'regent'], 'regent')).toEqual([
      'regent',
      'solaris',
      'johanniter',
    ]);
    expect(promote(['solaris', 'johanniter'], 'riesling')).toEqual(['solaris', 'johanniter']);
  });

  it('gives the first variety the biggest share', () => {
    const parts = blend(['regent', 'solaris', 'riesling']);
    expect(parts.map(part => part.share)).toEqual([50, 30, 20]);
    expect(parts[0].name).toBe('Regent');
  });

  it('names the kind of wine from the tone of the varieties', () => {
    expect(blendKind(blend(['solaris', 'riesling']))).toBe('białe');
    expect(blendKind(blend(['regent', 'pinot-noir']))).toBe('czerwone');
    expect(blendKind(blend(['solaris', 'regent']))).toBe('z odmian białych i czerwonych');
  });

  it('writes the summary with the vintage and the shares', () => {
    expect(summary(['solaris', 'johanniter'], 2024)).toBe(
      'Cuvée 2024, wino białe: Solaris 60, Johanniter 40.',
    );
  });

  it('offers vintages in rising order and ids that do not repeat', () => {
    expect([...vintages]).toEqual([...vintages].sort((a, b) => a - b));
    expect(new Set(grapes.map(grape => grape.id)).size).toBe(grapes.length);
  });
});

describe('case study content', () => {
  const dashes = new RegExp(`[${String.fromCharCode(0x2013, 0x2014)}]`);
  const texts = JSON.stringify({ content, contact, extras, grapes });

  it('has no dashes and no placeholder copy', () => {
    expect(texts).not.toMatch(dashes);
    expect(texts.toLowerCase()).not.toMatch(/\blorem\b|twoja firma/);
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

  it('gives four tone rules with a yes and a no example', () => {
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

  it('reads the icon names from the manifest paths', () => {
    const manifest = {
      files: [
        { path: 'icons/svg/cuvee-icon-klucz.svg' },
        { path: 'icons/svg/cuvee-icon-lozko.svg' },
        { path: 'icons/cuvee-icons.svg' },
      ],
    } as unknown as Manifest;
    expect(iconNames(manifest)).toEqual(['klucz', 'lozko']);
  });
});
