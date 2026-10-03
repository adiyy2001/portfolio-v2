import { link } from '../../../shared/link';

export const page = (path = '/') => link(`/szkliwo${path}`);

export const asset = (path: string) => link(`/szkliwo/${path}`);
