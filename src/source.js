const key = 'lead-source';

const clean = value =>
  String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '')
    .slice(0, 40);

const fromCampaign = params =>
  ['utm_source', 'utm_medium', 'utm_campaign'].map(name => clean(params.get(name))).filter(Boolean);

const fromReferrer = () => {
  try {
    const host = new URL(document.referrer).hostname;
    return host && host !== window.location.hostname ? [`referrer:${clean(host)}`] : [];
  } catch {
    return [];
  }
};

export function captureSource() {
  try {
    if (window.sessionStorage.getItem(key)) return;
    const campaign = fromCampaign(new URLSearchParams(window.location.search));
    const found = campaign.length ? campaign.join('/') : fromReferrer()[0];
    if (found) window.sessionStorage.setItem(key, found);
  } catch {
    return;
  }
}

export function readSource() {
  try {
    return window.sessionStorage.getItem(key) || 'direct';
  } catch {
    return 'direct';
  }
}
