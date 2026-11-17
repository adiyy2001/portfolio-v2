import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buttonLabel,
  checkAfter,
  initialCheck,
  shouldSendQueued,
  submitAction,
} from './scan-check.js';

const copy = {
  send: 'Zleć skan',
  sending: 'Wysyłam…',
  verifying: 'Weryfikuję zabezpieczenie…',
  queued: 'Wyślę zaraz po weryfikacji…',
};

test('without a site key the form is ready at once', () => {
  assert.equal(initialCheck(false), 'ready');
  assert.equal(initialCheck(true), 'waiting');
});

test('the check moves from waiting to ready on a token and back on expiry', () => {
  assert.equal(checkAfter('waiting', 'token'), 'ready');
  assert.equal(checkAfter('ready', 'expired'), 'waiting');
});

test('a widget error or a load failure marks the check as failed, and a late token recovers it', () => {
  assert.equal(checkAfter('waiting', 'failed'), 'failed');
  assert.equal(checkAfter('failed', 'token'), 'ready');
});

test('the timeout fails only a check that is still waiting', () => {
  assert.equal(checkAfter('waiting', 'timeout'), 'failed');
  assert.equal(checkAfter('ready', 'timeout'), 'ready');
});

test('a click before the token is queued once instead of showing an error', () => {
  assert.equal(submitAction({ check: 'waiting', queued: false, sending: false }), 'queue');
  assert.equal(submitAction({ check: 'waiting', queued: true, sending: false }), 'ignore');
});

test('a click with a token sends, a click after a failure shows the mail and phone fallback', () => {
  assert.equal(submitAction({ check: 'ready', queued: false, sending: false }), 'send');
  assert.equal(submitAction({ check: 'failed', queued: false, sending: false }), 'blocked');
  assert.equal(submitAction({ check: 'ready', queued: false, sending: true }), 'ignore');
});

test('a queued click is sent automatically when the token arrives and never after a failure', () => {
  assert.equal(shouldSendQueued({ check: 'waiting', queued: true, sending: false }), false);
  assert.equal(shouldSendQueued({ check: 'ready', queued: true, sending: false }), true);
  assert.equal(shouldSendQueued({ check: 'ready', queued: false, sending: false }), false);
  assert.equal(shouldSendQueued({ check: 'ready', queued: true, sending: true }), false);
  assert.equal(shouldSendQueued({ check: 'failed', queued: true, sending: false }), false);
});

test('the button shows a waiting label until the token is ready', () => {
  assert.equal(
    buttonLabel({ check: 'waiting', queued: false, sending: false }, copy),
    copy.verifying,
  );
  assert.equal(buttonLabel({ check: 'waiting', queued: true, sending: false }, copy), copy.queued);
  assert.equal(buttonLabel({ check: 'ready', queued: false, sending: false }, copy), copy.send);
  assert.equal(buttonLabel({ check: 'failed', queued: false, sending: false }, copy), copy.send);
  assert.equal(buttonLabel({ check: 'ready', queued: true, sending: true }, copy), copy.sending);
});
