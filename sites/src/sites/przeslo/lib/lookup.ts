import type { StoredBooking } from './booking';

export const normalizeCode = (value: string): string => {
  const compact = value.replace(/\s+/g, '').toUpperCase();
  if (/^PRZ[A-Z0-9]{6}$/.test(compact)) return `PRZ-${compact.slice(3)}`;
  return compact;
};

const normalizeEmail = (value: string): string => value.trim().toLowerCase();

export type LookupProblem = 'codeRequired' | 'emailRequired' | 'notFound';

export const lookupProblem = (
  stored: StoredBooking | null,
  code: string,
  email: string,
): LookupProblem | null => {
  if (code.trim() === '') return 'codeRequired';
  if (email.trim() === '') return 'emailRequired';
  if (!stored) return 'notFound';
  const sameCode = normalizeCode(code) === stored.code;
  const sameEmail = normalizeEmail(email) === normalizeEmail(stored.guest.email);
  return sameCode && sameEmail ? null : 'notFound';
};
