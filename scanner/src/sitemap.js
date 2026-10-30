const MAX_URLS = 2000;
const MAX_DEPTH = 3;

function decodeEntities(text) {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .trim();
}

export function parseSitemap(xml) {
  const isIndex = /<sitemapindex[\s>]/i.test(xml);
  const locs = [];
  for (const match of xml.matchAll(/<loc>\s*(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?\s*<\/loc>/gi)) {
    const value = decodeEntities(match[1]);
    if (value) locs.push(value);
  }
  return { isIndex, locs };
}

export async function collectSitemapUrls(roots, { fetchText, isSameSite, timeoutMs = 10_000 }) {
  const deadline = Date.now() + timeoutMs;
  const seen = new Set();
  const urls = new Set();
  const queue = roots.map(url => ({ url, depth: 0 }));
  while (queue.length && urls.size < MAX_URLS && Date.now() < deadline) {
    const { url, depth } = queue.shift();
    if (seen.has(url)) continue;
    seen.add(url);
    const response = await fetchText(url, { deadline });
    if (!response || response.status < 200 || response.status >= 300) continue;
    const { isIndex, locs } = parseSitemap(response.text);
    for (const loc of locs) {
      if (isIndex) {
        if (depth + 1 < MAX_DEPTH) queue.push({ url: loc, depth: depth + 1 });
      } else if (urls.size < MAX_URLS && isSameSite(loc)) {
        urls.add(loc);
      }
    }
  }
  return [...urls];
}
