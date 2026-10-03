import { describe, expect, it } from 'vitest';
import { checkKsef } from './ksef';

const october = { year: 2026, month: 10, day: 3 };

describe('checkKsef', () => {
  it('tells consumer-only sellers that KSeF is optional for their invoices', () => {
    const answer = checkKsef({ buyers: 'consumers', sales: 'upTo10k' }, october);
    expect(answer.verdict).toBe('optional');
    expect(answer.daysToDeadline).toBeNull();
  });

  it('gives small business sellers a relief until the end of 2026', () => {
    const answer = checkKsef({ buyers: 'business', sales: 'upTo10k' }, october);
    expect(answer.verdict).toBe('relief');
    expect(answer.daysToDeadline).toBe(90);
    expect(answer.points.join(' ')).toContain('10');
  });

  it('counts the days to 1 January 2027 from any date in the year', () => {
    expect(
      checkKsef({ buyers: 'business', sales: 'upTo10k' }, { year: 2026, month: 12, day: 31 }),
    ).toMatchObject({
      verdict: 'relief',
      daysToDeadline: 1,
    });
  });

  it('makes KSeF mandatory above the limit or after it was exceeded', () => {
    expect(checkKsef({ buyers: 'business', sales: 'over10k' }, october).verdict).toBe('mandatory');
    const exceeded = checkKsef({ buyers: 'both', sales: 'exceeded' }, october);
    expect(exceeded.verdict).toBe('mandatory');
    expect(exceeded.points.join(' ')).toContain('każdej kolejnej');
  });

  it('makes KSeF mandatory for everyone selling to businesses from 2027', () => {
    const answer = checkKsef(
      { buyers: 'business', sales: 'upTo10k' },
      { year: 2027, month: 1, day: 5 },
    );
    expect(answer.verdict).toBe('mandatory');
    expect(answer.headline).toContain('1 stycznia 2027');
  });

  it('explains that consumer invoices stay outside the limit', () => {
    const answer = checkKsef({ buyers: 'both', sales: 'upTo10k' }, october);
    expect(answer.points.join(' ')).toContain('konsumentów');
  });

  it('always reminds about receiving invoices', () => {
    for (const buyers of ['business', 'consumers', 'both'] as const) {
      expect(checkKsef({ buyers, sales: 'upTo10k' }, october).points.join(' ')).toContain(
        '1 lutego 2026',
      );
    }
  });
});
