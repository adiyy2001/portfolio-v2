export const consentKey = 'consent';

const changeEvent = 'consent:change';

let reopened = false;
let chosen = null;

export function storedConsent() {
  try {
    return window.localStorage.getItem(consentKey) ?? chosen;
  } catch {
    return chosen;
  }
}

export function saveConsent(choice) {
  reopened = false;
  try {
    window.localStorage.setItem(consentKey, choice);
  } catch {
    chosen = choice;
  }
  window.dispatchEvent(new Event(changeEvent));
  window.gtag?.('consent', 'update', { analytics_storage: choice });
  if (choice === 'denied') dropAnalyticsCookies();
}

function dropAnalyticsCookies() {
  const domain = window.location.hostname.replace(/^www\./, '');
  document.cookie
    .split('; ')
    .map(entry => entry.split('=')[0])
    .filter(name => name === '_ga' || name.startsWith('_ga_'))
    .forEach(name => {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${domain}`;
      document.cookie = `${name}=; Max-Age=0; path=/`;
    });
}

export function openConsent() {
  reopened = true;
  window.dispatchEvent(new Event(changeEvent));
}

export function subscribeConsent(notify) {
  window.addEventListener(changeEvent, notify);
  return () => window.removeEventListener(changeEvent, notify);
}

export const consentPending = () => reopened || !storedConsent();
