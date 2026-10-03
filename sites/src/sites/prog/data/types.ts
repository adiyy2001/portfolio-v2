import type { FacadeSpec } from '../facade/draw';
import type { PlanFloor } from '../plan/types';

export type Transaction = 'sprzedaz' | 'wynajem';
export type PropertyType = 'mieszkanie' | 'dom';
export type Market = 'wtorny' | 'pierwotny';
export type Condition = 'do-remontu' | 'dobry' | 'po-remoncie' | 'stan-deweloperski' | 'nowy';
export type Heating = 'miejskie' | 'gazowe' | 'elektryczne' | 'pompa-ciepla';
export type Ownership = 'wlasnosc' | 'spoldzielcze';
export type Lease = 'zwykly' | 'okazjonalny';
export type Extra =
  'balkon' | 'ogrod' | 'winda' | 'parking' | 'piwnica' | 'umeblowane' | 'zwierzeta';

export type DistrictId =
  | 'stare-miasto'
  | 'nadodrze'
  | 'olbin'
  | 'przedmiescie-olawskie'
  | 'przedmiescie-swidnickie'
  | 'plac-grunwaldzki'
  | 'kleczkow'
  | 'szczepin'
  | 'gajowice'
  | 'powstancow-slaskich'
  | 'huby'
  | 'gaj'
  | 'borek'
  | 'krzyki-partynice'
  | 'grabiszyn'
  | 'muchobor-maly'
  | 'biskupin'
  | 'zalesie'
  | 'karlowice'
  | 'ksieze'
  | 'tarnogaj'
  | 'jagodno';

export type AgentId = 'zofia' | 'tymon' | 'natalia';

export interface District {
  id: DistrictId;
  name: string;
  label: string;
  shape: string;
  blurb: string;
  houseM2: number;
  flatM2: number;
}

export interface Agent {
  id: AgentId;
  name: string;
  firstName: string;
  initials: string;
  role: string;
  summary: string;
  bio: readonly string[];
  areas: readonly string[];
  languages: readonly string[];
  email: string;
  doorTone: number;
}

export interface MapPoint {
  x: number;
  y: number;
}

export interface Listing {
  slug: string;
  transaction: Transaction;
  type: PropertyType;
  district: DistrictId;
  street: string;
  price: number;
  area: number;
  rooms: number;
  floor: number | null;
  floorsTotal: number;
  plotArea?: number;
  buildYear: number;
  market?: Market;
  condition: Condition;
  heating: Heating;
  ownership?: Ownership;
  lease?: Lease;
  leaseTerm?: string;
  energyIndex: number;
  availableFrom: string;
  adminFee: number;
  utilities?: number;
  depositMonths?: number;
  extras: readonly Extra[];
  published: string;
  agent: AgentId;
  position: MapPoint;
  facade: FacadeSpec;
  plan: readonly PlanFloor[];
  headline: string;
  description: readonly string[];
  highlights: readonly string[];
  surroundings: readonly string[];
}

export interface ListingCard {
  slug: string;
  transaction: Transaction;
  type: PropertyType;
  district: DistrictId;
  street: string;
  price: number;
  area: number;
  rooms: number;
  floor: number | null;
  floorsTotal: number;
  plotArea?: number;
  market?: Market;
  extras: readonly Extra[];
  published: string;
  agent: AgentId;
  position: MapPoint;
  facade: FacadeSpec;
  headline: string;
}
