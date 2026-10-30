import dns from 'node:dns/promises';
import net from 'node:net';

const BLOCKED_V4 = [
  ['0.0.0.0', 8],
  ['10.0.0.0', 8],
  ['100.64.0.0', 10],
  ['127.0.0.0', 8],
  ['169.254.0.0', 16],
  ['172.16.0.0', 12],
  ['192.0.0.0', 24],
  ['192.0.2.0', 24],
  ['192.88.99.0', 24],
  ['192.168.0.0', 16],
  ['198.18.0.0', 15],
  ['198.51.100.0', 24],
  ['203.0.113.0', 24],
  ['224.0.0.0', 4],
  ['240.0.0.0', 4],
];

const BLOCKED_V6 = [
  ['::', 128],
  ['::1', 128],
  ['64:ff9b::', 96],
  ['64:ff9b:1::', 48],
  ['100::', 64],
  ['2001::', 32],
  ['2001:db8::', 32],
  ['2002::', 16],
  ['fc00::', 7],
  ['fe80::', 10],
  ['fec0::', 10],
  ['ff00::', 8],
];

const blockList = new net.BlockList();
for (const [address, prefix] of BLOCKED_V4) blockList.addSubnet(address, prefix, 'ipv4');
for (const [address, prefix] of BLOCKED_V6) blockList.addSubnet(address, prefix, 'ipv6');

function ipv6Groups(address) {
  let text = address.split('%')[0].toLowerCase();
  const tail = text.match(/(\d+\.\d+\.\d+\.\d+)$/);
  if (tail) {
    const octets = tail[1].split('.').map(Number);
    const hi = ((octets[0] << 8) | octets[1]).toString(16);
    const lo = ((octets[2] << 8) | octets[3]).toString(16);
    text = text.slice(0, -tail[1].length) + hi + ':' + lo;
  }
  const halves = text.split('::');
  if (halves.length > 2) return null;
  const head = halves[0] ? halves[0].split(':') : [];
  const rest = halves.length === 2 && halves[1] ? halves[1].split(':') : [];
  const missing = 8 - head.length - rest.length;
  if (halves.length === 1 ? head.length !== 8 : missing < 0) return null;
  const all = halves.length === 1 ? head : [...head, ...Array(missing).fill('0'), ...rest];
  const groups = all.map(part => parseInt(part || '0', 16));
  return groups.some(g => Number.isNaN(g) || g < 0 || g > 0xffff) ? null : groups;
}

function embeddedV4(groups) {
  return [groups[6] >> 8, groups[6] & 255, groups[7] >> 8, groups[7] & 255].join('.');
}

export function isPublicAddress(address) {
  const bare = address.replace(/^\[|\]$/g, '');
  const family = net.isIP(bare.split('%')[0]);
  if (family === 4) return !blockList.check(bare, 'ipv4');
  if (family !== 6) return false;
  const groups = ipv6Groups(bare);
  if (!groups) return false;
  const leadingZeros = groups.slice(0, 5).every(g => g === 0);
  if (leadingZeros && groups[5] === 0xffff) return isPublicAddress(embeddedV4(groups));
  if (leadingZeros && groups[5] === 0 && !groups.slice(6).every(g => g === 0)) return false;
  const canonical = groups.map(g => g.toString(16)).join(':');
  return !blockList.check(canonical, 'ipv6');
}

const ALLOWED_PORTS = new Set(['', '80', '443']);

export function createUrlValidator({
  lookup = host => dns.lookup(host, { all: true, verbatim: true }),
  allowPrivate = false,
  ttlMs = 5 * 60 * 1000,
  now = Date.now,
} = {}) {
  const cache = new Map();

  async function check(urlText) {
    let url;
    try {
      url = new URL(urlText);
    } catch {
      return { ok: false, reason: 'invalid-url' };
    }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return { ok: false, reason: 'protocol' };
    }
    if (url.username || url.password) return { ok: false, reason: 'credentials' };
    if (!allowPrivate && !ALLOWED_PORTS.has(url.port)) return { ok: false, reason: 'port' };
    const host = url.hostname.replace(/^\[|\]$/g, '');
    if (!host) return { ok: false, reason: 'invalid-url' };
    if (allowPrivate) return { ok: true, url, addresses: [] };
    if (net.isIP(host)) {
      return isPublicAddress(host)
        ? { ok: true, url, addresses: [host] }
        : { ok: false, reason: 'private-address' };
    }
    const cached = cache.get(host);
    if (cached && cached.expires > now())
      return cached.value.ok ? { ...cached.value, url } : cached.value;
    let value;
    try {
      const records = await lookup(host);
      const addresses = records.map(record => record.address);
      if (addresses.length === 0) value = { ok: false, reason: 'dns' };
      else if (addresses.some(address => !isPublicAddress(address))) {
        value = { ok: false, reason: 'private-address' };
      } else value = { ok: true, addresses };
    } catch {
      value = { ok: false, reason: 'dns' };
    }
    cache.set(host, { value, expires: now() + ttlMs });
    return value.ok ? { ...value, url } : value;
  }

  return { check, isAllowed: async urlText => (await check(urlText)).ok };
}
