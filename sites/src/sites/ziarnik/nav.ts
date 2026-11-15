export type NavKey =
  'sklep' | 'subskrypcja' | 'o-palarni' | 'dostawa' | 'kontakt' | 'koszyk' | 'kasa';

export const navItems: Array<{ key: NavKey; label: string; path: string }> = [
  { key: 'sklep', label: 'kawy', path: '/ziarnik/sklep/' },
  { key: 'subskrypcja', label: 'abonament', path: '/ziarnik/subskrypcja/' },
  { key: 'o-palarni', label: 'palarnia', path: '/ziarnik/o-palarni/' },
  { key: 'dostawa', label: 'odbiór', path: '/ziarnik/dostawa-i-zwroty/' },
  { key: 'kontakt', label: 'kontakt', path: '/ziarnik/kontakt/' },
];
