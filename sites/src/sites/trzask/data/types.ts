export type RoastLevel = 'jasne' | 'srednie' | 'ciemne';

export type ProcessId =
  'myta' | 'naturalna' | 'honey' | 'anaerobowa' | 'mokro-luskana' | 'mieszana';

export type BrewMethod = 'espresso' | 'przelew' | 'aeropress' | 'zaparzacz' | 'moka';

export type GrindId = 'ziarna' | 'espresso' | 'moka' | 'przelew' | 'zaparzacz';

export type WeightGrams = 250 | 500 | 1000;

export type CountryId =
  | 'brazylia'
  | 'etiopia'
  | 'gwatemala'
  | 'indonezja'
  | 'kenia'
  | 'kolumbia'
  | 'kostaryka'
  | 'rwanda'
  | 'mieszanka';

export interface RoastPoint {
  at: number;
  temp: number;
}

export interface RoastProfile {
  charge: number;
  turningPoint: RoastPoint;
  dryEnd: RoastPoint;
  firstCrack: RoastPoint;
  secondCrack?: RoastPoint;
  drop: RoastPoint;
}

export interface CoffeeRecipe {
  method: BrewMethod;
  temp: number;
}

export interface CoffeeCopy {
  summary: string;
  story: string[];
  tip: string;
}

export interface Coffee {
  kind: 'coffee';
  id: string;
  name: string;
  labelLines: string[];
  country: CountryId;
  region: string;
  producer: string;
  altitude: string;
  variety: string;
  harvest: string;
  process: ProcessId;
  roast: RoastLevel;
  notes: [string, string, string];
  brew: BrewMethod[];
  recipe: CoffeeRecipe;
  profile: RoastProfile;
  base250: number;
  lot: string;
  sackMark: string[];
}

export type AccessoryArt = 'dripper' | 'filters' | 'grinder' | 'mug';

export interface Accessory {
  kind: 'accessory';
  id: string;
  name: string;
  labelLines: string[];
  labelRegion: string;
  labelFoot: string;
  blurb: string;
  art: AccessoryArt;
  price: number;
  tags: string[];
}

export interface AccessoryCopy {
  summary: string;
  description: string[];
  specs: Array<[string, string]>;
}

export type Product = Coffee | Accessory;
