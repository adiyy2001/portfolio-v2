export const navItems = [
  { key: 'mieszkania', label: 'Lofty', path: 'mieszkania/' },
  { key: 'galeria', label: 'Galeria', path: 'galeria/' },
  { key: 'lokalizacja', label: 'Lokalizacja', path: 'lokalizacja/' },
  { key: 'biuro', label: 'Biuro sprzedaży', path: 'biuro-sprzedazy/' },
] as const;

export type NavKey = (typeof navItems)[number]['key'];
