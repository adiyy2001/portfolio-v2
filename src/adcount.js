import { storedConsent, subscribeConsent } from './consent';

const endpoint = 'https://api.adrianturbinski.pl/v/hit';
const flushGap = 4000;
const heartbeat = 15000;
const maxCount = 50;

const clean = value =>
  String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '')
    .slice(0, 40);

const safePath = pathname => {
  const path = pathname.replace(/[^A-Za-z0-9/_.%-]/g, '').slice(0, 120);
  return path.startsWith('/') ? path : `/${path}`;
};

const deviceOf = () => {
  const width = window.innerWidth;
  if (width < 768) return 'm';
  return width < 1100 ? 't' : 'd';
};

const randomId = () =>
  [...window.crypto.getRandomValues(new Uint8Array(8))]
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');

function adFromLocation() {
  const params = new URLSearchParams(window.location.search);
  const clickKind = ['gclid', 'gbraid', 'wbraid'].find(name => params.has(name));
  const paid = clean(params.get('utm_medium')) === 'cpc';
  if (!clickKind && !paid) return null;
  return {
    kind: clickKind ?? 'utm',
    src: clean(params.get('utm_source')) || (clickKind ? 'google' : ''),
    med: 'cpc',
    cmp: clean(params.get('utm_campaign')),
    term: clean(params.get('utm_term')),
    landing: safePath(window.location.pathname),
  };
}

let ad = null;
let visit = null;
let watching = false;
let lastSent = 0;

export function captureAd() {
  ad = adFromLocation();
}

const counts = () => ({ pages: 1, ms: 0, scroll: 0, tel: 0, mail: 0, form: 0, cta: 0 });

const consented = () => storedConsent() === 'granted';

function visibleMs() {
  const running = visit.since ? performance.now() - visit.since : 0;
  return Math.round(visit.shown + running);
}

function flush(force = false) {
  if (!visit || !consented()) return;
  const now = performance.now();
  if (!force && now - lastSent < flushGap) return;
  lastSent = now;
  const payload = {
    v: visit.id,
    landing: ad.landing,
    path: safePath(window.location.pathname),
    kind: ad.kind,
    src: ad.src,
    med: ad.med,
    cmp: ad.cmp,
    term: ad.term,
    dev: visit.dev,
    ...visit.counts,
    ms: visibleMs(),
  };
  navigator.sendBeacon?.(endpoint, new Blob([JSON.stringify(payload)], { type: 'text/plain' }));
}

function measureScroll() {
  const doc = document.documentElement;
  const depth = ((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100;
  visit.counts.scroll = Math.max(visit.counts.scroll, Math.min(100, Math.round(depth)));
}

function onVisibility() {
  if (!visit) return;
  if (document.visibilityState === 'hidden') {
    visit.shown = visibleMs();
    visit.since = 0;
    measureScroll();
    flush(true);
    return;
  }
  visit.since = performance.now();
}

function begin() {
  if (visit || !ad || !consented()) return;
  visit = {
    id: randomId(),
    dev: deviceOf(),
    counts: counts(),
    shown: 0,
    since: document.visibilityState === 'hidden' ? 0 : performance.now(),
  };
  if (!watching) {
    watching = true;
    window.addEventListener('scroll', () => visit && measureScroll(), { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', () => visit && flush(true));
    window.setInterval(() => {
      if (document.visibilityState === 'visible') flush();
    }, heartbeat);
  }
  measureScroll();
  flush(true);
}

function end() {
  visit = null;
}

export function startAdCount() {
  captureAd();
  if (!ad) return;
  begin();
  subscribeConsent(() => (consented() ? begin() : end()));
}

export function notePage() {
  if (!visit) return;
  visit.counts.pages = Math.min(maxCount, visit.counts.pages + 1);
  measureScroll();
  flush();
}

const eventField = {
  generate_lead: () => 'form',
  cta_click: () => 'cta',
  contact_click: params => (params.method === 'phone' ? 'tel' : 'mail'),
};

export function noteEvent(name, params) {
  const field = eventField[name]?.(params);
  if (!field || !visit) return;
  visit.counts[field] = Math.min(maxCount, visit.counts[field] + 1);
  flush(true);
}
