export const previewApps = [
  {
    slug: 'kasownik',
    name: 'Kasownik',
    styleId: 'A1',
    style: 'Natywny iOS, jasny i czysty',
    trade: 'bilety komunikacji miejskiej',
    city: 'Poznań',
  },
  {
    slug: 'sztanga',
    name: 'Sztanga',
    styleId: 'A2',
    style: 'Kinetyczna typografia',
    trade: 'dziennik treningu siłowego',
    city: 'cała Polska',
  },
  {
    slug: 'rygiel',
    name: 'Rygiel',
    styleId: 'A3',
    style: 'Ciemny neon i cyber',
    trade: 'menedżer haseł z alertami wycieków',
    city: 'cała Polska',
  },
  {
    slug: 'kielek',
    name: 'Kiełek',
    styleId: 'A4',
    style: 'Claymorphism pastelowy',
    trade: 'pielęgnacja roślin domowych',
    city: 'cała Polska',
  },
  {
    slug: 'poziomka',
    name: 'Poziomka',
    styleId: 'A5',
    style: 'Pixel art 8-bit',
    trade: 'tracker nawyków z grywalizacją',
    city: 'cała Polska',
  },
  {
    slug: 'poludnie',
    name: 'Południe',
    styleId: 'A6',
    style: 'Izometryczny dashboard danych',
    trade: 'domowa fotowoltaika i magazyn energii',
    city: 'cała Polska',
  },
] as const;

export type PreviewSlug = (typeof previewApps)[number]['slug'];

export const previewApp = (slug: PreviewSlug) => previewApps.find(app => app.slug === slug)!;
