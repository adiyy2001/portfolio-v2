export const checkTimeoutMs = 25000;

export const initialCheck = hasSiteKey => (hasSiteKey ? 'waiting' : 'ready');

export function checkAfter(check, event) {
  if (event === 'token') return 'ready';
  if (event === 'expired') return 'waiting';
  if (event === 'failed') return 'failed';
  if (event === 'timeout') return check === 'waiting' ? 'failed' : check;
  return check;
}

export function submitAction({ check, queued, sending }) {
  if (sending) return 'ignore';
  if (check === 'ready') return 'send';
  if (check === 'failed') return 'blocked';
  return queued ? 'ignore' : 'queue';
}

export function shouldSendQueued({ check, queued, sending }) {
  return queued && check === 'ready' && !sending;
}

export function buttonLabel({ check, queued, sending }, copy) {
  if (sending) return copy.sending;
  if (check === 'waiting') return queued ? copy.queued : copy.verifying;
  return copy.send;
}
