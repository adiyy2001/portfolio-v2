import { services } from '../data/services';

export const sumFrom = (slugs: string[]): number =>
  services
    .filter(service => slugs.includes(service.slug))
    .reduce((total, service) => total + service.price, 0);
