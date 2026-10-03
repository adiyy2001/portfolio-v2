import { describe, expect, it } from 'vitest';
import { buildSampleBooking } from './booking';
import { lookupProblem, normalizeCode } from './lookup';

const stored = buildSampleBooking(20000, 'pl', new Date('2026-10-03T10:00:00Z'));

describe('normalizeCode', () => {
  it('uppercases and removes spaces', () => {
    expect(normalizeCode(' prz-abc234 ')).toBe('PRZ-ABC234');
  });

  it('adds the missing dash', () => {
    expect(normalizeCode('prz abc234')).toBe('PRZ-ABC234');
  });

  it('leaves other input uppercased', () => {
    expect(normalizeCode('xyz')).toBe('XYZ');
  });
});

describe('lookupProblem', () => {
  it('requires a code', () => {
    expect(lookupProblem(stored, ' ', 'a@b.pl')).toBe('codeRequired');
  });

  it('requires an e-mail address', () => {
    expect(lookupProblem(stored, 'PRZ-ABC234', '')).toBe('emailRequired');
  });

  it('reports a missing booking when nothing is stored', () => {
    expect(lookupProblem(null, 'PRZ-ABC234', 'a@b.pl')).toBe('notFound');
  });

  it('accepts the stored code and e-mail in any letter case', () => {
    expect(stored).not.toBeNull();
    if (!stored) return;
    expect(
      lookupProblem(stored, stored.code.toLowerCase(), ` ${stored.guest.email.toUpperCase()} `),
    ).toBeNull();
  });

  it('rejects a wrong e-mail', () => {
    if (!stored) return;
    expect(lookupProblem(stored, stored.code, 'other@example.com')).toBe('notFound');
  });

  it('rejects a wrong code', () => {
    if (!stored) return;
    expect(lookupProblem(stored, 'PRZ-AAAAAA', stored.guest.email)).toBe('notFound');
  });
});
