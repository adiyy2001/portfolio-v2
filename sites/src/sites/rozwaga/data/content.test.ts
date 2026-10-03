import { describe, expect, it } from 'vitest';
import { areas } from './areas';
import { articles } from './articles';
import { articleMinutes, articleWords } from './content';
import { team } from './team';

const dashes = /[\u2013\u2014]/;

describe('articles', () => {
  it('are between 900 and 1500 words each', () => {
    for (const article of articles) {
      const words = articleWords(article);
      expect(words, article.slug).toBeGreaterThanOrEqual(900);
      expect(words, article.slug).toBeLessThanOrEqual(1500);
    }
  });

  it('have unique slugs and a known author and area', () => {
    const slugs = articles.map(article => article.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const article of articles) {
      expect(team.some(member => member.slug === article.authorSlug)).toBe(true);
      expect(areas.some(area => area.slug === article.areaSlug)).toBe(true);
    }
  });

  it('have at least three sections for the table of contents', () => {
    for (const article of articles) {
      const sections = article.blocks.filter(block => block.type === 'h2');
      expect(sections.length, article.slug).toBeGreaterThanOrEqual(3);
    }
  });

  it('report a reading time of at least four minutes', () => {
    for (const article of articles) expect(articleMinutes(article)).toBeGreaterThanOrEqual(4);
  });

  it('mark the state of the law', () => {
    for (const article of articles) {
      expect(JSON.stringify(article.blocks)).toContain('październik 2026');
    }
  });
});

describe('areas and team', () => {
  it('link only to existing articles and people', () => {
    for (const area of areas) {
      for (const slug of area.articleSlugs) {
        expect(
          articles.some(article => article.slug === slug),
          slug,
        ).toBe(true);
      }
    }
    for (const member of team) {
      for (const slug of member.focus) {
        expect(
          areas.some(area => area.slug === slug),
          slug,
        ).toBe(true);
      }
    }
  });

  it('give every area four situations, four steps and fee rows', () => {
    for (const area of areas) {
      expect(area.situations).toHaveLength(4);
      expect(area.steps).toHaveLength(4);
      expect(area.feeRows.length).toBeGreaterThanOrEqual(4);
    }
  });
});

describe('copy', () => {
  it('contains no em or en dashes', () => {
    expect(dashes.test(JSON.stringify([areas, articles, team]))).toBe(false);
  });
});
