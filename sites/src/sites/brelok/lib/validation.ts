import { farthestArrival, parseIso, todayIso } from './dates';

export type FieldProblem = 'required' | 'invalid' | 'past' | 'far';

export const validateName = (value: string): FieldProblem | null => {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'required';
  return trimmed.length < 3 || !/\p{L}/u.test(trimmed) ? 'invalid' : null;
};

export const validatePhone = (value: string): FieldProblem | null => {
  if (value.trim().length === 0) return 'required';
  if (!/^[+\d\s()-]+$/.test(value.trim())) return 'invalid';
  return value.replace(/\D/g, '').length < 9 ? 'invalid' : null;
};

export const validateEmail = (value: string): FieldProblem | null => {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'required';
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed) ? null : 'invalid';
};

export const validateArrival = (value: string, today: string = todayIso()): FieldProblem | null => {
  if (value.trim().length === 0) return 'required';
  const date = parseIso(value);
  if (!date) return 'invalid';
  if (value < today) return 'past';
  return value > farthestArrival(today) ? 'far' : null;
};

export const validateText = (value: string, minLength: number): FieldProblem | null => {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'required';
  return trimmed.length < minLength ? 'invalid' : null;
};
