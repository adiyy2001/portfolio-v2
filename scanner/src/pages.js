import crypto from 'node:crypto';

const BINARY_EXTENSIONS = new Set(
  (
    'pdf zip rar 7z gz tar tgz jpg jpeg png gif webp avif svg ico bmp tif tiff mp3 mp4 m4a wav ogg ' +
    'webm mov avi mkv doc docx xls xlsx ppt pptx odt ods csv xml json txt rss atom css js map woff ' +
    'woff2 ttf otf eot exe dmg apk iso'
  ).split(' '),
);

const PRIORITY_GROUPS = [
  /kontakt|contact/,
  /regulamin/,
  /deklaracj|dostepnosc|accessibility/,
  /koszyk|cart|checkout/,
];

export function stripDiacritics(text) {
  return text.toLowerCase().replace(/ł/g, 'l').normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function normalizeHost(host) {
  return host.toLowerCase().replace(/^www\./, '');
}

export function isSameSite(candidate, home) {
  try {
    const a = new URL(candidate);
    const b = new URL(home);
    return normalizeHost(a.hostname) === normalizeHost(b.hostname);
  } catch {
    return false;
  }
}

export function isBinaryPath(pathname) {
  const last = pathname.split('/').pop() || '';
  const dot = last.lastIndexOf('.');
  return dot > 0 && BINARY_EXTENSIONS.has(last.slice(dot + 1).toLowerCase());
}

export function canonicalPage(candidate, home) {
  let url;
  try {
    url = new URL(candidate, home);
  } catch {
    return null;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
  if (!isSameSite(url.href, home)) return null;
  if (isBinaryPath(url.pathname)) return null;
  url.hash = '';
  url.search = '';
  if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/+$/, '') || '/';
  return url.href;
}

export function pathTemplate(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return '/';
  return `/${segments.map(segment => (/\d/.test(segment) ? '*' : segment.toLowerCase())).join('/')}`;
}

export function priorityRank(url, text = '') {
  let path = url;
  try {
    path = decodeURIComponent(new URL(url).pathname);
  } catch {
    path = url;
  }
  const haystack = stripDiacritics(`${path} ${text}`);
  const rank = PRIORITY_GROUPS.findIndex(pattern => pattern.test(haystack));
  return rank < 0 ? null : rank;
}

export function seededRandom(seedText) {
  const digest = crypto.createHash('sha256').update(String(seedText)).digest();
  let state = digest.readUInt32LE(0);
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled(items, random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function selectPages({
  home,
  navLinks = [],
  sitemapUrls = [],
  seed,
  maxPages = 10,
  isAllowed = () => true,
}) {
  const homeUrl = canonicalPage(home, home) ?? home;
  const byTemplate = new Map();
  const consider = (candidate, text, fromNav, order) => {
    const url = canonicalPage(candidate, home);
    if (!url || url === homeUrl || !isAllowed(url)) return;
    const template = pathTemplate(new URL(url).pathname);
    if (template === '/') return;
    const existing = byTemplate.get(template);
    if (existing && !(fromNav && !existing.fromNav)) return;
    byTemplate.set(template, { url, template, text, fromNav, order });
  };
  navLinks.forEach((link, index) => consider(link.url, link.text, true, index));
  [...sitemapUrls].sort().forEach((url, index) => consider(url, '', false, index));

  const entries = [...byTemplate.values()];
  const prioritized = entries
    .map(entry => ({ entry, rank: priorityRank(entry.url, entry.text) }))
    .filter(item => item.rank !== null)
    .sort(
      (a, b) =>
        a.rank - b.rank || a.entry.order - b.entry.order || a.entry.url.localeCompare(b.entry.url),
    )
    .map(item => item.entry);
  const prioritizedTemplates = new Set(prioritized.map(entry => entry.template));
  const navigation = entries
    .filter(entry => entry.fromNav && !prioritizedTemplates.has(entry.template))
    .sort((a, b) => a.order - b.order);
  const taken = new Set([...prioritizedTemplates, ...navigation.map(entry => entry.template)]);
  const rest = entries
    .filter(entry => !taken.has(entry.template))
    .sort((a, b) => a.url.localeCompare(b.url));

  const slots = Math.max(maxPages - 1, 0);
  const minRandom = rest.length ? Math.min(Math.max(1, Math.ceil(maxPages * 0.1)), slots) : 0;
  const structured = [...prioritized, ...navigation].slice(0, slots - minRandom);
  const randomCount = Math.min(rest.length, Math.max(minRandom, slots - structured.length));
  const random = shuffled(rest, seededRandom(seed)).slice(0, randomCount);
  const extra = [...structured, ...random].slice(0, slots);
  return [homeUrl, ...extra.map(entry => entry.url)].slice(0, Math.max(maxPages, 1));
}
