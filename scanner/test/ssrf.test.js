import assert from 'node:assert/strict';
import test from 'node:test';
import { createUrlValidator, isPublicAddress } from '../src/ssrf.js';

const blockedAddresses = [
  '127.0.0.1',
  '127.1.2.3',
  '10.0.0.1',
  '10.255.255.255',
  '172.16.0.1',
  '172.31.255.255',
  '192.168.1.1',
  '169.254.169.254',
  '169.254.0.1',
  '100.64.0.1',
  '100.127.255.255',
  '0.0.0.0',
  '0.1.2.3',
  '224.0.0.1',
  '239.255.255.255',
  '255.255.255.255',
  '192.0.2.1',
  '198.18.0.1',
  '::',
  '::1',
  '0:0:0:0:0:0:0:1',
  'fc00::1',
  'fd12:3456:789a::1',
  'fe80::1',
  'fe80::1%eth0',
  'febf::1',
  'ff02::1',
  '::ffff:127.0.0.1',
  '::ffff:7f00:1',
  '::ffff:10.0.0.1',
  '::ffff:a00:1',
  '::ffff:169.254.169.254',
  '::ffff:192.168.0.1',
  '64:ff9b::7f00:1',
  '2002:7f00:1::1',
  '2001:db8::1',
  '::127.0.0.1',
  'not-an-ip',
];

const publicAddresses = [
  '1.1.1.1',
  '8.8.8.8',
  '93.184.216.34',
  '172.15.255.255',
  '172.32.0.1',
  '100.63.255.255',
  '100.128.0.1',
  '169.253.1.1',
  '2606:4700:4700::1111',
  '2a00:1450:4001:81b::200e',
  '::ffff:8.8.8.8',
  '::ffff:808:808',
];

for (const address of blockedAddresses) {
  test(`blocks address ${address}`, () => {
    assert.equal(isPublicAddress(address), false);
  });
}

for (const address of publicAddresses) {
  test(`allows address ${address}`, () => {
    assert.equal(isPublicAddress(address), true);
  });
}

const resolver = table => async host => {
  if (!(host in table)) throw new Error('ENOTFOUND');
  return table[host].map(address => ({ address, family: address.includes(':') ? 6 : 4 }));
};

test('validator accepts public http and https urls on default ports', async () => {
  const validator = createUrlValidator({ lookup: resolver({ 'example.com': ['93.184.216.34'] }) });
  assert.equal((await validator.check('https://example.com/')).ok, true);
  assert.equal((await validator.check('http://example.com/a?b=1')).ok, true);
  assert.equal((await validator.check('https://example.com:443/')).ok, true);
  assert.equal((await validator.check('http://example.com:80/')).ok, true);
});

test('validator rejects other protocols', async () => {
  const validator = createUrlValidator({ lookup: resolver({ 'example.com': ['93.184.216.34'] }) });
  for (const url of [
    'file:///etc/passwd',
    'ftp://example.com/',
    'gopher://example.com/',
    'javascript:alert(1)',
    'data:text/html,hi',
    'ws://example.com/',
  ]) {
    const verdict = await validator.check(url);
    assert.equal(verdict.ok, false, url);
  }
});

test('validator rejects non standard ports and credentials', async () => {
  const validator = createUrlValidator({ lookup: resolver({ 'example.com': ['93.184.216.34'] }) });
  for (const url of [
    'http://example.com:8080/',
    'https://example.com:8443/',
    'http://example.com:22/',
    'https://user:pass@example.com/',
  ]) {
    assert.equal((await validator.check(url)).ok, false, url);
  }
});

test('validator rejects ip literals in every notation', async () => {
  const validator = createUrlValidator({ lookup: resolver({}) });
  for (const url of [
    'http://127.0.0.1/',
    'http://2130706433/',
    'http://0x7f000001/',
    'http://0177.0.0.1/',
    'http://127.1/',
    'http://[::1]/',
    'http://[::ffff:127.0.0.1]/',
    'http://[fe80::1]/',
    'http://169.254.169.254/latest/meta-data/',
    'http://100.64.0.1/',
    'http://0.0.0.0/',
    'http://10.1.2.3/',
  ]) {
    assert.equal((await validator.check(url)).ok, false, url);
  }
});

test('validator rejects hostnames resolving to private addresses', async () => {
  const validator = createUrlValidator({
    lookup: resolver({
      'internal.example': ['10.0.0.5'],
      'rebind.example': ['93.184.216.34', '127.0.0.1'],
      'v6.example': ['fd00::1'],
      'mapped.example': ['::ffff:10.0.0.1'],
      'metadata.example': ['169.254.169.254'],
    }),
  });
  for (const host of ['internal', 'rebind', 'v6', 'mapped', 'metadata']) {
    const verdict = await validator.check(`https://${host}.example/`);
    assert.equal(verdict.ok, false, host);
    assert.equal(verdict.reason, 'private-address');
  }
});

test('validator rejects unresolved hosts', async () => {
  const validator = createUrlValidator({ lookup: resolver({}) });
  const verdict = await validator.check('https://nope.example/');
  assert.deepEqual([verdict.ok, verdict.reason], [false, 'dns']);
});

test('validator caches dns answers until ttl passes', async () => {
  let calls = 0;
  let clock = 0;
  const validator = createUrlValidator({
    lookup: async () => {
      calls += 1;
      return [{ address: '93.184.216.34', family: 4 }];
    },
    ttlMs: 1000,
    now: () => clock,
  });
  await validator.check('https://example.com/a');
  await validator.check('https://example.com/b');
  assert.equal(calls, 1);
  clock = 2000;
  await validator.check('https://example.com/c');
  assert.equal(calls, 2);
});

test('allowPrivate flag lets loopback through and relaxes ports', async () => {
  const validator = createUrlValidator({ allowPrivate: true });
  assert.equal((await validator.check('http://127.0.0.1:34567/')).ok, true);
  assert.equal((await validator.check('file:///etc/passwd')).ok, false);
});

test('invalid urls are rejected', async () => {
  const validator = createUrlValidator({ lookup: resolver({}) });
  assert.equal((await validator.check('not a url')).ok, false);
  assert.equal((await validator.check('')).ok, false);
});
