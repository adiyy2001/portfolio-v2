import { link } from '../../shared/link';

export const site = {
  name: 'Cegielnia 14',
  slug: 'cegielnia-14',
  seller: 'Cegielnia Ołbin sp. z o.o.',
  street: 'ul. Cegielniana 14',
  postcode: '50-307',
  city: 'Wrocław',
  district: 'Ołbin',
  phone: '71 555 01 33',
  phoneHref: 'tel:+48715550133',
  email: 'biuro@cegielnia-14.example',
  hoursFrom: '12:00',
  hoursTo: '18:00',
  nip: '899-000-00-00',
  krs: '0009990014',
  refPrefix: 'CG-',
  builtYear: 1894,
  openYear: 2026,
  ceiling: '3,4',
} as const;

export const hoursText = `codziennie od ${site.hoursFrom} do ${site.hoursTo}`;
export const addressLine = `${site.street}, ${site.postcode} ${site.city}`;
export const path = (rest = '') => `/${site.slug}/${rest}`;
export const url = (rest = '') => link(path(rest));
export const asset = (rest: string) => link(`/${site.slug}/${rest}`);
export const yearsOfChimney = site.openYear - site.builtYear;
