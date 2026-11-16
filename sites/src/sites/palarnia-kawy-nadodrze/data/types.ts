export type Degree = 3 | 6 | 9;

export type CountryId = 'etiopia' | 'kenia' | 'kolumbia' | 'brazylia' | 'gwatemala';

export type ProcessId = 'myta' | 'naturalna' | 'honey';

export type BrewMethod = 'espresso' | 'przelew' | 'prasa' | 'kawiarka';

export type GrindId = 'ziarna' | 'espresso' | 'kawiarka' | 'przelew' | 'prasa';

export interface Coffee {
  id: string;
  name: string;
  degree: Degree;
  country: CountryId;
  region: string;
  producer: string;
  altitude: string;
  variety: string;
  harvest: string;
  process: ProcessId;
  notes: [string, string, string];
  brew: BrewMethod[];
  batch: number;
  summary: string;
  story: string[];
  tip: string;
}
