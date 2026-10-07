export const asoApps = [
  {
    slug: 'gran',
    name: 'Grań',
    styleId: 'S1',
    style: 'Panorama ilustracyjna',
    category: 'szlaki górskie w Sudetach',
    themeColor: '#2E5446',
  },
  {
    slug: 'szyld',
    name: 'Szyld',
    styleId: 'S2',
    style: 'Mocne gradienty z przechylonymi urządzeniami',
    category: 'zakupy w lokalnych sklepach z odbiorem osobistym',
    themeColor: '#0B4A3D',
  },
  {
    slug: 'margines',
    name: 'Margines',
    styleId: 'S3',
    style: 'Odręczne adnotacje',
    category: 'fiszki do nauki języków',
    themeColor: '#1E2A5E',
  },
  {
    slug: 'chochla',
    name: 'Chochla',
    styleId: 'S4',
    style: 'Memphis i pop-art',
    category: 'przepisy i planowanie posiłków',
    themeColor: '#EE4B2B',
  },
  {
    slug: 'kruszec',
    name: 'Kruszec',
    styleId: 'S5',
    style: 'Ciemne szkło premium',
    category: 'budżet osobisty i inwestowanie',
    themeColor: '#0A1020',
  },
  {
    slug: 'bis',
    name: 'Bis',
    styleId: 'S6',
    style: 'Y2K holograficzny chrom',
    category: 'odkrywanie muzyki i koncertów',
    themeColor: '#EEF1F6',
  },
] as const;

export type AsoSlug = (typeof asoApps)[number]['slug'];

export const asoApp = (slug: AsoSlug) => asoApps.find(app => app.slug === slug)!;
