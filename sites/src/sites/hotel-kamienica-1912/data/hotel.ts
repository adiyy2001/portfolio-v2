export const hotel = {
  name: 'Hotel Kamienica',
  shortName: 'Kamienica',
  fullName: 'Hotel Kamienica 1912',
  builtYear: 1912,
  street: 'ul. Kazimierza Wielkiego 51',
  streetEn: 'Kazimierza Wielkiego Street 51',
  postalCode: '50-077',
  city: 'Wrocław',
  phone: '+48 71 555 01 88',
  phoneHref: 'tel:+48715550188',
  email: 'recepcja@kamienica1912.example',
  emailHref: 'mailto:recepcja@kamienica1912.example',
  checkIn: '15:00',
  checkOut: '12:00',
  salonHour: '19:00',
  breakfastFrom: '8:00',
  breakfastTo: '10:30',
  breakfastPrice: 55,
  minutesToSquare: 8,
  minNights: 1,
  maxNights: 7,
  skippedNumber: 13,
  voucherMonths: 12,
  voucherAmounts: [300, 500, 800, 1200],
} as const;

export type RoomId = 'cichy' | 'dziedziniec' | 'poddasze' | 'apartament';

export interface RoomType {
  id: RoomId;
  slug: { pl: string; en: string };
  numbers: readonly number[];
  showcase: number;
  area: number;
  rate: number;
  guests: number;
  bedWidth: number;
}

export const roomTypes: readonly RoomType[] = [
  {
    id: 'cichy',
    slug: { pl: 'cichy', en: 'quiet' },
    numbers: [1, 2, 3, 4],
    showcase: 4,
    area: 18,
    rate: 410,
    guests: 2,
    bedWidth: 160,
  },
  {
    id: 'dziedziniec',
    slug: { pl: 'dziedziniec', en: 'courtyard' },
    numbers: [5, 6, 7, 8, 9],
    showcase: 7,
    area: 24,
    rate: 430,
    guests: 2,
    bedWidth: 90,
  },
  {
    id: 'poddasze',
    slug: { pl: 'poddasze', en: 'attic' },
    numbers: [10, 11, 12, 14],
    showcase: 12,
    area: 28,
    rate: 520,
    guests: 3,
    bedWidth: 160,
  },
  {
    id: 'apartament',
    slug: { pl: 'apartament', en: 'apartment' },
    numbers: [15],
    showcase: 15,
    area: 75,
    rate: 740,
    guests: 4,
    bedWidth: 180,
  },
];

export const roomCount = roomTypes.reduce((sum, type) => sum + type.numbers.length, 0);

export const highestRoomNumber = Math.max(...roomTypes.flatMap(type => type.numbers));

export const roomTypeById = (id: RoomId): RoomType => {
  const found = roomTypes.find(type => type.id === id);
  if (!found) throw new Error(`Unknown room type ${id}`);
  return found;
};

export const isRoomId = (value: unknown): value is RoomId =>
  roomTypes.some(type => type.id === value);

export const padNumber = (value: number): string => String(value).padStart(2, '0');

export type PackageId = 'weekend' | 'evening' | 'week';

export interface StayPackage {
  id: PackageId;
  price: number;
  minNights: number;
  maxNights: number;
  maxGuests: number;
  includesBreakfast: boolean;
}

export const packages: readonly StayPackage[] = [
  {
    id: 'weekend',
    price: 220,
    minNights: 2,
    maxNights: 2,
    maxGuests: 2,
    includesBreakfast: true,
  },
  {
    id: 'evening',
    price: 160,
    minNights: 1,
    maxNights: 7,
    maxGuests: 4,
    includesBreakfast: false,
  },
  {
    id: 'week',
    price: 450,
    minNights: 5,
    maxNights: 7,
    maxGuests: 2,
    includesBreakfast: true,
  },
];

export const packageById = (id: PackageId): StayPackage => {
  const found = packages.find(item => item.id === id);
  if (!found) throw new Error(`Unknown package ${id}`);
  return found;
};

export const isPackageId = (value: unknown): value is PackageId =>
  packages.some(item => item.id === value);

export type PlaceId =
  'square' | 'salt' | 'opera' | 'hall' | 'university' | 'panorama' | 'cathedral' | 'forum';

export interface Place {
  id: PlaceId;
  minutes: number;
}

export const places: readonly Place[] = [
  { id: 'opera', minutes: 5 },
  { id: 'salt', minutes: 7 },
  { id: 'square', minutes: 8 },
  { id: 'hall', minutes: 10 },
  { id: 'university', minutes: 14 },
  { id: 'forum', minutes: 15 },
  { id: 'panorama', minutes: 17 },
  { id: 'cathedral', minutes: 22 },
];

export const roomNumberLabel = (type: RoomType): string => padNumber(type.showcase);
