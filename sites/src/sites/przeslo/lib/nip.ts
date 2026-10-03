const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];

export const normaliseNip = (input: string): string =>
  input.trim().replace(/^PL/i, '').replace(/[\s-]/g, '');

export const isValidNip = (input: string): boolean => {
  const digits = normaliseNip(input);
  if (!/^\d{10}$/.test(digits) || digits.startsWith('000')) return false;
  const sum = weights.reduce((total, weight, index) => total + weight * Number(digits[index]), 0);
  const control = sum % 11;
  return control !== 10 && control === Number(digits[9]);
};

export const formatNip = (input: string): string => {
  const digits = normaliseNip(input);
  if (!/^\d{10}$/.test(digits)) return input.trim();
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8)}`;
};
