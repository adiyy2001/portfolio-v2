import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { agentList, agents } from './agents';
import { business, figures, figuresSentence, hoursSentence, openingDays } from './business';
import { districts, offerBySlug, offers } from './offers';
import { factsLine, formatPricePerM2, offerPath, pricePerM2 } from '../lib/format';

describe('offers data', () => {
  it('has six offers numbered 01 to 06 with unique slugs', () => {
    expect(offers.map(offer => offer.number)).toEqual(['01', '02', '03', '04', '05', '06']);
    expect(new Set(offers.map(offer => offer.slug)).size).toBe(offers.length);
  });

  it('keeps the per square metre prices printed on the landing', () => {
    const expected: Record<string, number> = {
      '01': 12663,
      '02': 11256,
      '03': 13140,
      '04': 10463,
      '05': 9328,
      '06': 12379,
    };
    for (const offer of offers) expect(pricePerM2(offer)).toBe(expected[offer.number]);
  });

  it('describes facts the way the landing does', () => {
    expect(factsLine(offers[0]!)).toBe('86 m², 4 pokoje, 5 piętro, balkon');
    expect(factsLine(offers[1]!)).toBe('Nowy blok, 39 m², 2 pokoje, 3 piętro');
    expect(factsLine(offers[2]!)).toBe('Kamienica, 57 m², 2 pokoje, parter');
    expect(factsLine(offers[4]!)).toBe('Szeregówka, 61 m², 3 pokoje, ogródek');
    expect(factsLine(offers[5]!)).toBe('Kawalerka, 29 m², 1 pokój, 1 piętro');
    expect(formatPricePerM2(offers[0]!)).toBe('12 663 zł/m²');
  });

  it('points every offer at an existing agent and existing images', () => {
    const publicDir = resolve(import.meta.dirname, '../../../../public/klamka/img');
    for (const offer of offers) {
      expect(agents[offer.agent]).toBeDefined();
      for (const width of offer.image.widths) {
        expect(existsSync(`${publicDir}/${offer.image.key}-${width}.webp`)).toBe(true);
      }
      expect(offer.image.widths).toContain(offer.image.width);
      expect(offer.image.alt.length).toBeGreaterThan(20);
    }
  });

  it('assigns each agent only offers from their own districts', () => {
    for (const offer of offers) {
      expect(agents[offer.agent].districts).toContain(offer.district);
    }
    expect(agentList.map(agent => agent.id)).toEqual(['karolina', 'adam']);
  });

  it('builds detail paths and finds offers by slug', () => {
    expect(offerPath(offers[3]!)).toBe('/klamka/oferty/sredzka/');
    expect(offerBySlug('gorlicka')?.number).toBe('05');
    expect(offerBySlug('brak')).toBeUndefined();
  });

  it('covers every district used by offers', () => {
    const names = districts.map(item => item.name);
    for (const offer of offers) expect(names).toContain(offer.district);
  });
});

describe('business data', () => {
  it('keeps the office address and figures stable', () => {
    expect(business.street).toBe('ul. Bolesława Krzywoustego 313');
    expect(business.postcode).toBe('51-310');
    expect(figures.sold).toBe(480);
    expect(figures.daysToPreliminary).toBe(66);
    expect(figures.valuationHours).toBe(48);
    expect(figuresSentence).toContain('480 mieszkań');
    expect(figuresSentence).toContain('66 dni');
  });

  it('matches the opening hours sentence', () => {
    expect(openingDays[0]).toMatchObject({ opens: 9, closes: 18 });
    expect(openingDays[1]).toMatchObject({ opens: 10, closes: 14 });
    expect(openingDays[2]).toMatchObject({ opens: null, closes: null });
    expect(hoursSentence).toBe(
      'Poniedziałek do piątku 9:00 do 18:00, sobota 10:00 do 14:00, niedziela zamknięte.',
    );
  });
});
