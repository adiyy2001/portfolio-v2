export const site = {
  name: 'Docisk',
  trade: 'serwis samochodowy',
  home: '/docisk/',
  street: 'ul. Przykładowa 12',
  postalCity: '52-200 Wrocław (Krzyki)',
  phone: '71 000 00 00',
} as const;

export const navItems = [
  { id: 'uslugi', label: 'Usługi' },
  { id: 'cennik', label: 'Cennik' },
  { id: 'godziny', label: 'Godziny' },
  { id: 'kontakt', label: 'Kontakt' },
] as const;

export type ServiceId =
  'tires' | 'storage' | 'oil' | 'inspection' | 'diagnostics' | 'ac' | 'brakes';

export interface Service {
  id: ServiceId;
  name: string;
  amount: number;
  from: boolean;
  unit?: string;
}

export const services: readonly Service[] = [
  { id: 'tires', name: 'Wymiana opon', amount: 120, from: false },
  { id: 'storage', name: 'Przechowanie opon', amount: 150, from: false, unit: 'za sezon' },
  { id: 'oil', name: 'Wymiana oleju z filtrem', amount: 220, from: true },
  { id: 'inspection', name: 'Przegląd przed badaniem', amount: 150, from: false },
  { id: 'diagnostics', name: 'Diagnostyka komputerowa', amount: 120, from: false },
  { id: 'ac', name: 'Serwis klimatyzacji', amount: 180, from: false },
  { id: 'brakes', name: 'Klocki hamulcowe', amount: 250, from: true },
];

export const priceLabel = (service: Service): string =>
  `${service.from ? 'od ' : ''}${service.amount} zł${service.unit ? ` ${service.unit}` : ''}`;

export const serviceById = (id: ServiceId): Service => {
  const found = services.find(service => service.id === id);
  if (!found) throw new Error(`Unknown service ${id}`);
  return found;
};

export const bookingServices = [
  { id: 'tires', label: 'Wymiana opon' },
  { id: 'oil', label: 'Wymiana oleju' },
  { id: 'inspection', label: 'Przegląd' },
  { id: 'diagnostics', label: 'Diagnostyka' },
] as const;

export type BookingServiceId = (typeof bookingServices)[number]['id'];

export const hours = [
  { days: 'pon. do pt.', time: '8:00 do 18:00' },
  { days: 'sobota', time: '8:00 do 14:00' },
  { days: 'niedziela', time: 'nieczynne' },
] as const;

export const pageText = {
  title: 'Docisk, serwis samochodowy we Wrocławiu z asystentem AI',
  description:
    'Serwis samochodowy na Krzykach we Wrocławiu. Cennik na stronie, wymiana opon od 120 zł. Asystent AI odpowiada na pytania i zapisuje terminy, także po godzinach. To pokaz.',
  imageAlt:
    'Docisk, serwis samochodowy: napis "Opony, olej, przegląd" i żółto-czarny pas ostrzegawczy',
} as const;
