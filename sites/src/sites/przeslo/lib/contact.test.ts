import { describe, expect, it } from 'vitest';
import { emptyContact, isContactTopic, validateContact } from './contact';
import type { ContactDraft } from './contact';

const valid: ContactDraft = {
  name: 'Jan Przykładowy',
  email: 'jan@example.com',
  topic: 'group',
  message: 'Czy macie sześć pokoi na jedną noc?',
};

describe('validateContact', () => {
  it('accepts a complete message', () => {
    expect(validateContact(valid)).toEqual({});
  });

  it('requires every field on an empty draft', () => {
    expect(validateContact(emptyContact)).toEqual({
      name: 'required',
      email: 'required',
      message: 'required',
    });
  });

  it('rejects a name without letters', () => {
    expect(validateContact({ ...valid, name: '12' }).name).toBe('invalidName');
  });

  it('rejects a malformed e-mail address', () => {
    expect(validateContact({ ...valid, email: 'jan@' }).email).toBe('invalidEmail');
  });

  it('rejects a very short message', () => {
    expect(validateContact({ ...valid, message: 'Cześć' }).message).toBe('tooShort');
  });

  it('rejects a message over the limit', () => {
    expect(validateContact({ ...valid, message: 'a'.repeat(1001) }).message).toBe('tooLong');
  });

  it('counts only trimmed text as a message', () => {
    expect(validateContact({ ...valid, message: '          ' }).message).toBe('required');
  });
});

describe('isContactTopic', () => {
  it('recognises known topics only', () => {
    expect(isContactTopic('voucher')).toBe(true);
    expect(isContactTopic('refund')).toBe(false);
  });
});
