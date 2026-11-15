import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  footerItems,
  individual,
  lateFee,
  mainHelplines,
  meetingLine,
  navItems,
  otherHelplines,
  serviceById,
  services,
  site,
  therapistById,
  therapists,
} from './data';

const siteDirectory = fileURLToPath(new URL('.', import.meta.url));
const pagesDirectory = fileURLToPath(new URL('../../pages/otoczak/', import.meta.url));

const collect = (directory: string): string[] =>
  readdirSync(directory).flatMap(entry => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? collect(path) : [path];
  });

const markupFiles = [...collect(siteDirectory), ...collect(pagesDirectory)].filter(path =>
  path.endsWith('.astro'),
);

describe('services', () => {
  it('has a positive price and duration for every service', () => {
    for (const service of services) {
      expect(service.price).toBeGreaterThan(0);
      expect(service.minutes).toBeGreaterThan(0);
    }
  });

  it('has unique ids', () => {
    expect(new Set(services.map(service => service.id)).size).toBe(services.length);
  });

  it('keeps the numbers the landing page promised', () => {
    expect(individual.minutes).toBe(50);
    expect(individual.price).toBe(230);
    expect(serviceById('pary').price).toBe(320);
    expect(serviceById('pary').minutes).toBe(80);
    expect(serviceById('mlodziez').price).toBe(200);
  });

  it('charges half the price for a late cancellation without fractions', () => {
    for (const service of services) {
      expect(Number.isInteger(lateFee(service))).toBe(true);
      expect(lateFee(service)).toBe(service.price / 2);
    }
  });

  it('states the first meeting as the regular session of the same form', () => {
    expect(meetingLine(serviceById('pary'))).toBe('osiemdziesiąt minut, 320 zł');
    expect(meetingLine(serviceById('mlodziez'))).toBe('pięćdziesiąt minut, 200 zł');
  });

  it('only lists therapists who exist and offer the service back', () => {
    for (const service of services) {
      for (const id of service.therapists) {
        expect(therapistById(id).services).toContain(service.id);
      }
    }
    for (const therapist of therapists) {
      for (const id of therapist.services) {
        expect(serviceById(id).therapists).toContain(therapist.id);
      }
    }
  });
});

describe('helplines', () => {
  it('uses digits only for the dialled number', () => {
    for (const line of [...mainHelplines, ...otherHelplines]) {
      expect(line.dial).toMatch(/^\d{3,9}$/);
      expect(line.number.replace(/\s/g, '')).toBe(line.dial);
    }
  });

  it('lists the emergency numbers first', () => {
    expect(mainHelplines.map(line => line.dial).slice(0, 2)).toEqual(['112', '800702222']);
  });
});

describe('navigation', () => {
  it('stays inside the site and ends with a slash', () => {
    for (const item of [...navItems, ...footerItems]) {
      expect(item.path.startsWith('/otoczak/')).toBe(true);
      expect(item.path.endsWith('/')).toBe(true);
    }
  });

  it('has no duplicate paths in the footer', () => {
    const paths = footerItems.map(item => item.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('uses one phone number for the link and the label', () => {
    expect(site.phoneHref.replace('tel:', '')).toBe(site.phone.replace(/\s/g, ''));
  });
});

describe('single source of numbers', () => {
  it.each(markupFiles.map(path => [path.replace(/^.*\/sites\/src\//, ''), path]))(
    'keeps prices and phone numbers out of %s',
    (_name, path) => {
      const source = readFileSync(path, 'utf8');
      expect(source).not.toMatch(/\d+( |\s)zł/);
      expect(source).not.toMatch(/\+48 ?\d/);
      expect(source).not.toMatch(/Mickiewicza/);
    },
  );
});
