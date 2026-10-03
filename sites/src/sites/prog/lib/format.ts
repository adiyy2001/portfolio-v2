const nonBreakingSpace = ' ';

export const groupThousands = (value: number): string => {
  const digits = String(Math.round(Math.abs(value)));
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, nonBreakingSpace);
  return value < 0 ? `-${grouped}` : grouped;
};

export const formatPrice = (value: number): string =>
  `${groupThousands(value)}${nonBreakingSpace}zł`;

export const formatMonthlyPrice = (value: number): string =>
  `${groupThousands(value)}${nonBreakingSpace}zł/mies.`;

export const formatDecimal = (value: number, digits = 1): string => {
  const fixed = value.toFixed(digits);
  const [whole = '0', fraction = ''] = fixed.split('.');
  const sign = whole.startsWith('-') ? '-' : '';
  const grouped = groupThousands(Number(whole.replace('-', '')));
  const trimmed = fraction.replace(/0+$/, '');
  return `${sign}${grouped}${trimmed ? `,${trimmed}` : ''}`;
};

export const formatArea = (value: number): string =>
  `${formatDecimal(value, 1)}${nonBreakingSpace}m²`;

export const formatPercent = (value: number): string =>
  `${formatDecimal(value, 1)}${nonBreakingSpace}%`;

export const pluralize = (count: number, one: string, few: string, many: string): string => {
  if (count === 1) return one;
  const lastTwo = count % 100;
  const last = count % 10;
  if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return few;
  return many;
};

export const roomsLabel = (count: number): string =>
  `${count}${nonBreakingSpace}${pluralize(count, 'pokój', 'pokoje', 'pokoi')}`;

export const offersLabel = (count: number): string =>
  `${count}${nonBreakingSpace}${pluralize(count, 'oferta', 'oferty', 'ofert')}`;

export const floorLabel = (floor: number | null): string => {
  if (floor === null) return 'dom';
  return floor === 0 ? 'parter' : `${floor}. piętro`;
};

const months = [
  'stycznia',
  'lutego',
  'marca',
  'kwietnia',
  'maja',
  'czerwca',
  'lipca',
  'sierpnia',
  'września',
  'października',
  'listopada',
  'grudnia',
];

export const formatDate = (iso: string): string => {
  const [year, month, day] = iso.split('-').map(Number);
  const name = months[(month ?? 1) - 1];
  return `${day}${nonBreakingSpace}${name}${nonBreakingSpace}${year}`;
};

export const spacedPhone = '+48 71 000 00 08';
export const telephoneHref = 'tel:+48710000008';
