import { formatZloty, pluralPl } from './format';
import {
  type BucketId,
  type PackageId,
  documentBuckets,
  findBucket,
  findPackage,
  grossMultiplier,
  isPricedBucket,
  maxPayrollPeople,
  monthlyPrices,
  payrollPerPerson,
} from './packages';

export type BusinessType = 'ryczalt' | 'kpir' | 'spolka' | 'unknown';
export type VatStatus = 'active' | 'exempt' | 'unknown';

export interface QuoteInput {
  businessType: BusinessType;
  documents: BucketId;
  employees: number;
  vat: VatStatus;
}

export interface QuoteLine {
  label: string;
  grosze: number;
}

export type Quote =
  | { kind: 'individual'; reason: string }
  | {
      kind: 'priced';
      packageId: PackageId;
      packageName: string;
      lines: QuoteLine[];
      netGrosze: number;
      vatGrosze: number;
      grossGrosze: number;
      assumptions: string[];
    };

const packageForType: Record<BusinessType, PackageId> = {
  ryczalt: 'ryczalt',
  kpir: 'kpir',
  spolka: 'pelna',
  unknown: 'kpir',
};

const toGrosze = (zloty: number): number => zloty * 100;

export const packageFor = (businessType: BusinessType): PackageId => packageForType[businessType];

export const buildQuote = (input: QuoteInput): Quote => {
  if (!isPricedBucket(input.documents)) {
    return {
      kind: 'individual',
      reason: 'Przy ponad 150 dokumentach w miesiącu wycena jest indywidualna.',
    };
  }
  if (input.employees > maxPayrollPeople) {
    return {
      kind: 'individual',
      reason: `Przy ponad ${maxPayrollPeople} osobach w kadrach i płacach wycena jest indywidualna.`,
    };
  }

  const packageId = packageFor(input.businessType);
  const info = findPackage(packageId);
  const bucket = findBucket(input.documents);
  const lines: QuoteLine[] = [
    {
      label: `${info.name}, ${bucket.label}`,
      grosze: toGrosze(monthlyPrices[packageId][input.documents]),
    },
  ];
  const assumptions: string[] = [];

  if (input.vat !== 'exempt') {
    lines.push({ label: 'VAT i JPK_V7', grosze: toGrosze(info.vatSurcharge) });
  }
  if (input.vat === 'unknown') {
    assumptions.push('Liczymy VAT i JPK, bo zwolnienie z VAT sprawdzimy dopiero na rozmowie.');
  }
  if (input.businessType === 'unknown') {
    assumptions.push(
      'Nie wiesz, jaką formę wybrać? Liczymy KPiR, a właściwą dobierzemy na rozmowie.',
    );
  }
  if (input.employees > 0) {
    const people = pluralPl(input.employees, 'osoba', 'osoby', 'osób');
    lines.push({
      label: `Kadry i płace, ${input.employees} ${people}`,
      grosze: toGrosze(input.employees * payrollPerPerson),
    });
  }

  const netGrosze = lines.reduce((sum, line) => sum + line.grosze, 0);
  const vatGrosze = (netGrosze * (grossMultiplier - 100)) / 100;
  return {
    kind: 'priced',
    packageId,
    packageName: info.name,
    lines,
    netGrosze,
    vatGrosze,
    grossGrosze: netGrosze + vatGrosze,
    assumptions,
  };
};

export const describeQuote = (quote: Quote): string =>
  quote.kind === 'individual'
    ? quote.reason
    : `Pakiet ${quote.packageName}: ${formatZloty(quote.netGrosze)} netto miesięcznie, ${formatZloty(quote.grossGrosze)} brutto.`;

const businessTypeParams = new Map<string, BusinessType>([
  ['ryczalt', 'ryczalt'],
  ['kpir', 'kpir'],
  ['spolka', 'spolka'],
  ['nie-wiem', 'unknown'],
]);

const vatParams = new Map<string, VatStatus>([
  ['tak', 'active'],
  ['nie', 'exempt'],
  ['nie-wiem', 'unknown'],
]);

export const parseQuoteParams = (search: string): Partial<QuoteInput> => {
  const params = new URLSearchParams(search);
  const result: Partial<QuoteInput> = {};

  const businessType = businessTypeParams.get(params.get('typ') ?? '');
  if (businessType) result.businessType = businessType;

  const documents = documentBuckets.find(bucket => bucket.param === params.get('dokumenty'));
  if (documents) result.documents = documents.id;

  const vat = vatParams.get(params.get('vat') ?? '');
  if (vat) result.vat = vat;

  const employees = params.get('pracownicy') ?? '';
  if (/^\d{1,2}$/.test(employees)) result.employees = Math.min(Number(employees), maxPayrollPeople);

  return result;
};

const paramFor = <Value>(params: Map<string, Value>, value: Value): string => {
  for (const [param, candidate] of params) {
    if (candidate === value) return param;
  }
  throw new Error('Unknown quote value');
};

export const toQuoteParams = (input: QuoteInput): string =>
  new URLSearchParams({
    typ: paramFor(businessTypeParams, input.businessType),
    dokumenty: findBucket(input.documents).param,
    pracownicy: String(input.employees),
    vat: paramFor(vatParams, input.vat),
  }).toString();

export const maxEmployeesField = 50;

export const clampEmployees = (value: string): number => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return 0;
  return Math.min(Math.max(parsed, 0), maxEmployeesField);
};
