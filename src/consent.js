export const consentKey = 'consent';

export const clarityId = 'z3yqyzew1g';

export const clarityLoader = `(function(c,l,a,r,i,t,y){if(c[a])return;c[a]=function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);c[a]('consentv2',{ad_Storage:'denied',analytics_Storage:'granted'})})(window,document,"clarity","script","${clarityId}");`;

export function loadClarity() {
  if (window.clarity) return;
  const script = document.createElement('script');
  script.text = clarityLoader;
  document.head.appendChild(script);
}

function stopClarity() {
  window.clarity?.('consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' });
  window.clarity?.('consent', false);
}

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
  if (choice === 'granted') loadClarity();
  if (choice === 'denied') {
    stopClarity();
    dropAnalyticsCookies();
  }
}

function dropAnalyticsCookies() {
  const domain = window.location.hostname.replace(/^www\./, '');
  document.cookie
    .split('; ')
    .map(entry => entry.split('=')[0])
    .filter(name => ['_ga', '_clck', '_clsk'].includes(name) || name.startsWith('_ga_'))
    .forEach(name => {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${domain}`;
      document.cookie = `${name}=; Max-Age=0; path=/`;
    });
}

export function openConsent() {
  reopened = true;
  document.documentElement.classList.remove('consent-known');
  window.dispatchEvent(new Event(changeEvent));
}

export function subscribeConsent(notify) {
  window.addEventListener(changeEvent, notify);
  return () => window.removeEventListener(changeEvent, notify);
}

export const consentPending = () => reopened || !storedConsent();
