import { storedConsent } from './consent';

const clean = value =>
  String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '')
    .slice(0, 40);

const fromCampaign = params => {
  const paid = ['gclid', 'gbraid', 'wbraid'].some(name => params.has(name));
  const parts = ['utm_source', 'utm_medium', 'utm_campaign'].map(name => clean(params.get(name)));
  if (paid) return [parts[0] || 'google', parts[1] || 'cpc', parts[2]].join('/');
  return parts.some(Boolean) ? parts.join('/') : '';
};

const fromReferrer = () => {
  try {
    const host = new URL(document.referrer).hostname;
    return host && host !== window.location.hostname ? `referrer:${clean(host)}` : '';
  } catch {
    return '';
  }
};

let found = '';

export function captureSource() {
  if (found) return;
  const params = new URLSearchParams(window.location.search);
  const ref = clean(params.get('ref'));
  found = fromCampaign(params) || (ref ? `ref:${ref}` : fromReferrer());
}

export const sourceAllowed = () => storedConsent() === 'granted';

export function readSource() {
  return sourceAllowed() ? found || 'direct' : '';
}
