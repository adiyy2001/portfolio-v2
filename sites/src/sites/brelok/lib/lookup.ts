import type { StoredBooking } from './booking';

const normalise = (value: string): string =>
  value.trim().toLocaleLowerCase('pl').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l');

export const normaliseReference = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  return digits.length === 6 ? `BR-${digits}` : value.trim().toUpperCase();
};

export const findBooking = (
  bookings: readonly StoredBooking[],
  reference: string,
  surname: string,
): StoredBooking | null => {
  const wanted = normaliseReference(reference);
  const last = normalise(surname);
  if (last.length === 0) return null;
  return (
    bookings.find(
      item => item.reference === wanted && normalise(item.name).split(/\s+/).includes(last),
    ) ?? null
  );
};
