import { describe, expect, it } from 'vitest';
import { treatmentDescription, treatments } from './treatments';

describe('treatmentDescription', () => {
  it('stays within the search snippet length', () => {
    treatments.forEach(treatment => {
      expect(treatmentDescription(treatment).length).toBeLessThanOrEqual(155);
    });
  });

  it('is different for every treatment and names the three answers', () => {
    const descriptions = treatments.map(treatmentDescription);
    expect(new Set(descriptions).size).toBe(treatments.length);
    treatments.forEach(treatment => {
      const description = treatmentDescription(treatment);
      expect(description).toContain(treatment.duration.answer);
      expect(description).toContain(treatment.cost.answer);
    });
  });
});
