export type NavKey =
  'sklep' | 'subskrypcja' | 'o-palarni' | 'dostawa' | 'kontakt' | 'koszyk' | 'kasa';

export const navItems: Array<{ key: NavKey; label: string; path: string }> = [
  { key: 'sklep', label: 'kawy', path: '/palarnia-kawy-nadodrze/sklep/' },
  { key: 'subskrypcja', label: 'abonament', path: '/palarnia-kawy-nadodrze/subskrypcja/' },
  { key: 'o-palarni', label: 'palarnia', path: '/palarnia-kawy-nadodrze/o-palarni/' },
  { key: 'dostawa', label: 'odbiór', path: '/palarnia-kawy-nadodrze/dostawa-i-zwroty/' },
  { key: 'kontakt', label: 'kontakt', path: '/palarnia-kawy-nadodrze/kontakt/' },
];
