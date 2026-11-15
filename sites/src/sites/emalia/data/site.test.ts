import { describe, expect, it } from 'vitest';
import { clinic, formTopics, visitMinutes, visitSegments } from './site';

describe('site data', () => {
  it('splits the first visit into 60 minutes', () => {
    expect(visitMinutes).toBe(60);
    expect(visitSegments.map(segment => segment.minutes)).toEqual([15, 35, 10]);
  });

  it('keeps the contact data on an example domain', () => {
    expect(clinic.email.endsWith('.example')).toBe(true);
    expect(clinic.phoneHref).toBe(`tel:${clinic.phoneDisplay.replace(/\s/g, '')}`);
  });

  it('has unique form topics', () => {
    expect(new Set(formTopics).size).toBe(formTopics.length);
  });
});
