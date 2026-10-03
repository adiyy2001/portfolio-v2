import { link } from '../../../shared/link';

export const siteHref = (path: string): string => link(`/rozwaga${path}`);

export const resolveHref = (target: string): string =>
  target.startsWith('/') ? siteHref(target) : target;
