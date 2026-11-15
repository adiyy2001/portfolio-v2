import { otherRepair, services } from '../data/services';
import { formatZl } from './format';

export const hoursFrom = (slugs: string[]): number =>
  services
    .filter(service => slugs.includes(service.slug))
    .reduce((total, service) => total + service.hours, 0);

export const sumFrom = (slugs: string[]): number =>
  services
    .filter(service => slugs.includes(service.slug))
    .reduce((total, service) => total + service.price, 0);

export const describeEstimate = (slugs: string[]): string => {
  const unpriced = slugs.includes(otherRepair.slug);
  const total = sumFrom(slugs);
  if (total === 0) return 'Cenę podamy po diagnozie, przed rozpoczęciem pracy.';
  if (unpriced) {
    return `Orientacyjnie od ${formatZl(total)}, a cenę innej naprawy podamy po diagnozie.`;
  }
  return `Orientacyjnie od ${formatZl(total)}.`;
};
