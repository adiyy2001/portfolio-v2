import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { articleBySlug, articles } from './articles';
import { articleWords } from './articles/stats';
import { areaBySlug, areas, processSteps } from './areas';
import {
  advanceSharePercent,
  billingStepMinutes,
  feesForArea,
  fixedFees,
  grossOf,
  hourlyGrossPln,
  hourlyNetPln,
} from './fees';
import { people, personBySlug } from './people';
import { firm, navItems } from './site';
import { matterOptions } from './form';
import { warsawWallClock } from '../lib/hours';

const collectStrings = (value: unknown): string[] => {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(collectStrings);
  return [];
};

const everyText = collectStrings([firm, areas, fixedFees, people, articles, processSteps]);

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? sourceFiles(path) : [path];
  });

const siteRoot = join(import.meta.dirname, '..');
const pagesRoot = join(siteRoot, '..', '..', 'pages', 'sygnet');
const ownSources = [...sourceFiles(siteRoot), ...sourceFiles(pagesRoot)].filter(
  path => !path.endsWith('.woff2') && !path.endsWith('.test.ts'),
);

describe('typography and tone', () => {
  it('has no en or em dashes in any source file', () => {
    const offenders = ownSources.filter(path => /[\u2013\u2014]/.test(readFileSync(path, 'utf8')));
    expect(offenders).toEqual([]);
  });

  it('has no dashes in the copy data', () => {
    expect(everyText.filter(text => /[\u2013\u2014]/.test(text))).toEqual([]);
  });

  it('does not mention AI or reviews', () => {
    const banned =
      /\b(AI|sztuczn\w+ inteligencj\w+|opini[ae] klient\w+|referencje|rekomendacje)\b/i;
    expect(everyText.filter(text => banned.test(text))).toEqual([]);
  });

  it('has no code comments in source files', () => {
    const offenders = ownSources
      .filter(path => /\.(ts|tsx|astro|css)$/.test(path))
      .filter(path =>
        /(^|\s)\/\/\s|\/\*|<!--/.test(readFileSync(path, 'utf8').replace(/https?:\/\/\S+/g, '')),
      );
    expect(offenders).toEqual([]);
  });
});

describe('contact data', () => {
  it('uses one phone book on the example domain', () => {
    const phones = new Set(everyText.flatMap(text => text.match(/\+48 71 555 01 \d\d/g) ?? []));
    expect([...phones].sort()).toEqual([
      '+48 71 555 01 58',
      '+48 71 555 01 59',
      '+48 71 555 01 60',
    ]);
    const emails = everyText.flatMap(text => text.match(/[\w.]+@[\w.]+/g) ?? []);
    expect(emails.filter(email => !email.endsWith('.example'))).toEqual([]);
  });

  it('keeps one address in every page source', () => {
    const streets = new Set<string>();
    for (const path of ownSources) {
      for (const match of readFileSync(path, 'utf8').matchAll(/ul\. [ŚS]widnicka \d+/g)) {
        streets.add(match[0]);
      }
    }
    expect([...streets]).toEqual([firm.address.street]);
    expect(
      everyText.filter(text => /Świdnicka/.test(text) && text !== firm.address.street),
    ).toEqual([]);
  });

  it('gives every person a number that matches the data file', () => {
    for (const person of people) {
      expect(person.phone.href).toBe(`tel:${person.phone.display.replace(/\s/g, '')}`);
      expect(person.email.endsWith('@sygnet.example')).toBe(true);
    }
    expect(firm.phone.href).toBe(`tel:${firm.phone.display.replace(/\s/g, '')}`);
  });

  it('opens on weekdays only', () => {
    expect(firm.hours.openMinute).toBeLessThan(firm.hours.closeMinute);
    expect(warsawWallClock(new Date('2026-11-14T10:00:00Z')).weekday).toBe(6);
  });
});

describe('fees', () => {
  it('derives every gross price from the net price', () => {
    expect(hourlyGrossPln).toBe(Math.round(hourlyNetPln * 1.23));
    for (const fee of fixedFees) {
      expect(grossOf(fee.netPln)).toBe(Math.round(fee.netPln * 1.23));
    }
  });

  it('has positive prices in known areas', () => {
    expect(billingStepMinutes).toBeGreaterThan(0);
    expect(advanceSharePercent).toBeGreaterThan(0);
    for (const fee of fixedFees) {
      expect(fee.netPln).toBeGreaterThan(0);
      expect(areaBySlug(fee.areaSlug)).toBeDefined();
    }
    for (const area of areas) expect(feesForArea(area.slug).length).toBeGreaterThan(0);
    expect(new Set(fixedFees.map(fee => fee.id)).size).toBe(fixedFees.length);
  });
});

describe('areas and people', () => {
  it('numbers areas in order with unique slugs', () => {
    expect(areas.map(area => area.no)).toEqual(areas.map((_, index) => index + 1));
    expect(new Set(areas.map(area => area.slug)).size).toBe(areas.length);
  });

  it('points every area at a real leader and real articles', () => {
    for (const area of areas) {
      expect(personBySlug(area.leaderSlug)).toBeDefined();
      for (const slug of area.articleSlugs) expect(articleBySlug(slug)).toBeDefined();
    }
  });

  it('lists the areas of every person', () => {
    for (const person of people) {
      for (const slug of person.areaSlugs) expect(areaBySlug(slug)).toBeDefined();
    }
  });

  it('offers a matter option for every area', () => {
    expect(matterOptions.length).toBeGreaterThanOrEqual(areas.length);
  });

  it('links the navigation to existing page folders', () => {
    for (const item of navItems) {
      const folder = item.path.replace(/^\/sygnet\//, '').replace(/\/$/, '');
      expect(() => statSync(join(pagesRoot, folder, 'index.astro'))).not.toThrow();
    }
  });
});

describe('articles', () => {
  it('has at least four articles with unique slugs', () => {
    expect(articles.length).toBeGreaterThanOrEqual(4);
    expect(new Set(articles.map(article => article.slug)).size).toBe(articles.length);
  });

  it('has a known author and area, and a valid date', () => {
    for (const article of articles) {
      expect(personBySlug(article.authorSlug)).toBeDefined();
      expect(areaBySlug(article.areaSlug)).toBeDefined();
      expect(article.published).toMatch(/^2026-\d\d-\d\d$/);
      expect(article.description.length).toBeLessThanOrEqual(170);
    }
  });

  it('has enough substance and structure', () => {
    for (const article of articles) {
      expect(articleWords(article)).toBeGreaterThanOrEqual(350);
      expect(article.blocks.filter(block => block.type === 'h2').length).toBeGreaterThanOrEqual(3);
    }
  });

  it('opens with the state of law note', () => {
    for (const article of articles) {
      const note = article.blocks.find(block => block.type === 'note');
      expect(note?.type === 'note' && note.title).toContain(firm.stateOfLaw);
    }
  });

  it('keeps table rows as wide as their heads', () => {
    for (const article of articles) {
      for (const block of article.blocks) {
        if (block.type !== 'table') continue;
        for (const row of block.rows) expect(row.length).toBe(block.head.length);
      }
    }
  });
});
