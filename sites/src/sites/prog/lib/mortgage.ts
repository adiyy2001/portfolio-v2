export type InstalmentKind = 'rowne' | 'malejace';

export interface LoanInput {
  price: number;
  downPaymentPercent: number;
  years: number;
  annualRatePercent: number;
  kind: InstalmentKind;
}

export interface LoanSummary {
  downPayment: number;
  loan: number;
  months: number;
  firstInstalment: number;
  lastInstalment: number;
  totalInterest: number;
  totalPaid: number;
}

export const monthlyRate = (annualRatePercent: number): number => annualRatePercent / 100 / 12;

export const annuityInstalment = (
  principal: number,
  annualRatePercent: number,
  years: number,
): number => {
  const months = Math.round(years * 12);
  if (principal <= 0 || months <= 0) return 0;
  const rate = monthlyRate(annualRatePercent);
  if (rate === 0) return principal / months;
  const growth = Math.pow(1 + rate, months);
  return (principal * rate * growth) / (growth - 1);
};

export const decreasingInstalment = (
  principal: number,
  annualRatePercent: number,
  years: number,
  index: number,
): number => {
  const months = Math.round(years * 12);
  if (principal <= 0 || months <= 0 || index < 0 || index >= months) return 0;
  const capitalPart = principal / months;
  const remaining = principal - capitalPart * index;
  return capitalPart + remaining * monthlyRate(annualRatePercent);
};

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const summarizeLoan = (input: LoanInput): LoanSummary => {
  const price = Math.max(input.price, 0);
  const downPayment = Math.round((price * clamp(input.downPaymentPercent, 0, 100)) / 100);
  const loan = price - downPayment;
  const months = Math.round(clamp(input.years, 1, 35) * 12);
  const years = months / 12;
  if (loan <= 0) {
    return {
      downPayment,
      loan: 0,
      months,
      firstInstalment: 0,
      lastInstalment: 0,
      totalInterest: 0,
      totalPaid: downPayment,
    };
  }
  if (input.kind === 'rowne') {
    const instalment = annuityInstalment(loan, input.annualRatePercent, years);
    const totalPaidOnLoan = instalment * months;
    return {
      downPayment,
      loan,
      months,
      firstInstalment: instalment,
      lastInstalment: instalment,
      totalInterest: totalPaidOnLoan - loan,
      totalPaid: totalPaidOnLoan + downPayment,
    };
  }
  const rate = monthlyRate(input.annualRatePercent);
  const interest = (rate * loan * (months + 1)) / 2;
  return {
    downPayment,
    loan,
    months,
    firstInstalment: decreasingInstalment(loan, input.annualRatePercent, years, 0),
    lastInstalment: decreasingInstalment(loan, input.annualRatePercent, years, months - 1),
    totalInterest: interest,
    totalPaid: loan + interest + downPayment,
  };
};
