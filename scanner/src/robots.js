import { AGENT_TOKEN } from './config.js';

const MAX_BYTES = 500 * 1024;

export function parseRobots(text) {
  const groups = [];
  const sitemaps = [];
  let current = null;
  let collectingAgents = false;
  const lines = text
    .slice(0, MAX_BYTES)
    .replace(/^\uFEFF/, '')
    .split(/\r\n|\r|\n/);
  for (const raw of lines) {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) continue;
    const separator = line.indexOf(':');
    if (separator < 0) continue;
    const field = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();
    if (field === 'user-agent') {
      if (!current || !collectingAgents) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      collectingAgents = true;
    } else if (field === 'allow' || field === 'disallow') {
      collectingAgents = false;
      if (current) current.rules.push({ allow: field === 'allow', path: value });
    } else if (field === 'sitemap') {
      if (value) sitemaps.push(value);
    } else {
      collectingAgents = false;
    }
  }
  return { groups, sitemaps };
}

function patternToRegExp(pattern) {
  const anchored = pattern.endsWith('$');
  const body = anchored ? pattern.slice(0, -1) : pattern;
  const source = body
    .split('*')
    .map(part => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');
  return new RegExp(`^${source}${anchored ? '$' : ''}`);
}

function normalizePath(path) {
  try {
    return decodeURIComponent(path).replace(/%/g, '%25');
  } catch {
    return path;
  }
}

export function createPolicy(parsed, agent = AGENT_TOKEN) {
  const token = agent.toLowerCase();
  const specific = parsed.groups.filter(group => group.agents.includes(token));
  const matching = specific.length ? specific : parsed.groups.filter(g => g.agents.includes('*'));
  const rules = matching
    .flatMap(group => group.rules)
    .filter(rule => rule.path !== '')
    .map(rule => ({
      allow: rule.allow,
      length: normalizePath(rule.path).length,
      test: patternToRegExp(normalizePath(rule.path)),
    }));
  return {
    sitemaps: parsed.sitemaps,
    isAllowed(pathWithQuery) {
      const target = normalizePath(pathWithQuery || '/');
      let best = null;
      for (const rule of rules) {
        if (!rule.test.test(target)) continue;
        if (!best || rule.length > best.length || (rule.length === best.length && rule.allow)) {
          best = rule;
        }
      }
      return best ? best.allow : true;
    },
  };
}

export const ALLOW_ALL = { sitemaps: [], isAllowed: () => true };
export const DENY_ALL = { sitemaps: [], isAllowed: () => false };

export function policyFromResponse(response, agent = AGENT_TOKEN) {
  if (!response) return { ...DENY_ALL, unreachable: true };
  const { status, text } = response;
  if (status >= 500) return { ...DENY_ALL, unreachable: true };
  if (status >= 400) return ALLOW_ALL;
  if (status >= 200 && status < 300) return createPolicy(parseRobots(text), agent);
  return ALLOW_ALL;
}

export function pathWithQuery(url) {
  const parsed = typeof url === 'string' ? new URL(url) : url;
  return `${parsed.pathname}${parsed.search}`;
}
