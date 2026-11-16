const monthNames = [
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

export const formatLongDate = (iso: string): string => {
  const [year = 0, month = 1, day = 1] = iso.split('-').map(Number);
  return `${day} ${monthNames[month - 1] ?? ''} ${year}`;
};
