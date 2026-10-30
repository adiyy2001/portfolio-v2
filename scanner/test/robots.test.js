import assert from 'node:assert/strict';
import test from 'node:test';
import { ALLOW_ALL, createPolicy, parseRobots, policyFromResponse } from '../src/robots.js';

const policyFor = text => createPolicy(parseRobots(text));

test('disallow for star group applies to our agent', () => {
  const policy = policyFor('User-agent: *\nDisallow: /private\n');
  assert.equal(policy.isAllowed('/private'), false);
  assert.equal(policy.isAllowed('/private/page'), false);
  assert.equal(policy.isAllowed('/public'), true);
});

test('group for our agent overrides the star group', () => {
  const text =
    'User-agent: *\nDisallow: /\n\nUser-agent: AdrianTurbinskiA11yScanner\nDisallow: /admin\n';
  const policy = policyFor(text);
  assert.equal(policy.isAllowed('/'), true);
  assert.equal(policy.isAllowed('/admin/x'), false);
});

test('agent matching is case insensitive', () => {
  const policy = policyFor('user-agent: adrianturbinskia11yscanner\ndisallow: /x\n');
  assert.equal(policy.isAllowed('/x'), false);
});

test('our agent group can disallow everything', () => {
  const policy = policyFor('User-agent: AdrianTurbinskiA11yScanner\nDisallow: /\n');
  assert.equal(policy.isAllowed('/'), false);
  assert.equal(policy.isAllowed('/a'), false);
});

test('other agents groups are ignored', () => {
  const policy = policyFor('User-agent: Googlebot\nDisallow: /\n');
  assert.equal(policy.isAllowed('/'), true);
});

test('empty disallow allows everything', () => {
  assert.equal(policyFor('User-agent: *\nDisallow:\n').isAllowed('/anything'), true);
});

test('longest match wins and allow wins ties', () => {
  const policy = policyFor(
    'User-agent: *\nDisallow: /shop\nAllow: /shop/public\nDisallow: /same\nAllow: /same\n',
  );
  assert.equal(policy.isAllowed('/shop/cart'), false);
  assert.equal(policy.isAllowed('/shop/public/item'), true);
  assert.equal(policy.isAllowed('/same'), true);
});

test('wildcards and end anchors', () => {
  const policy = policyFor('User-agent: *\nDisallow: /*.pdf$\nDisallow: /tmp/*/secret\n');
  assert.equal(policy.isAllowed('/a/b.pdf'), false);
  assert.equal(policy.isAllowed('/a/b.pdf?x=1'), true);
  assert.equal(policy.isAllowed('/tmp/1/secret'), false);
  assert.equal(policy.isAllowed('/tmp/1/open'), true);
});

test('multiple user agent lines share one group', () => {
  const policy = policyFor('User-agent: Bot1\nUser-agent: *\nDisallow: /hidden\n');
  assert.equal(policy.isAllowed('/hidden'), false);
});

test('comments, blank lines and sitemap directives are handled', () => {
  const parsed = parseRobots(
    '# comment\nUser-agent: * # everyone\nDisallow: /a # note\n\nSitemap: https://example.com/s.xml\n',
  );
  assert.deepEqual(parsed.sitemaps, ['https://example.com/s.xml']);
  assert.equal(createPolicy(parsed).isAllowed('/a'), false);
});

test('rules before any user agent are ignored', () => {
  assert.equal(policyFor('Disallow: /\n').isAllowed('/'), true);
});

test('status handling follows RFC 9309', () => {
  assert.equal(policyFromResponse({ status: 404, text: '' }).isAllowed('/x'), true);
  assert.equal(policyFromResponse({ status: 403, text: 'x' }).isAllowed('/x'), true);
  assert.equal(policyFromResponse({ status: 500, text: '' }).isAllowed('/x'), false);
  assert.equal(policyFromResponse({ status: 503, text: '' }).isAllowed('/x'), false);
  assert.equal(policyFromResponse(null).isAllowed('/x'), false);
  assert.equal(
    policyFromResponse({ status: 200, text: 'User-agent: *\nDisallow: /z' }).isAllowed('/z'),
    false,
  );
  assert.equal(ALLOW_ALL.isAllowed('/'), true);
});
