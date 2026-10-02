const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const link = (path: string) => `${base}${path}`;

export const portfolio = (path: string) => `${base.replace(/\/wzornik$/, '')}${path}`;
