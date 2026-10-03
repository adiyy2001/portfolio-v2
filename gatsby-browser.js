import 'lenis/dist/lenis.css';
import './src/styles/global.css';
import './src/styles/client.css';
import './src/styles/case.css';
import './src/styles/wzornik.css';
import './src/styles/work.css';
import './src/styles/notfound.css';
import './src/styles/blog.css';
import { keepScroll } from './src/components/layout';

export { wrapRootElement, wrapPageElement } from './src/wrap';

let popped = false;

export const onClientEntry = () => {
  window.history.scrollRestoration = 'manual';
  window.addEventListener('popstate', () => {
    popped = true;
  });
  document.addEventListener(
    'click',
    event => {
      if (event.target.closest?.('a[href^="#"]')) {
        window.history.replaceState({ ...window.history.state, y: window.scrollY }, '');
      }
    },
    true,
  );
  return new Promise(resolve => {
    new PerformanceObserver(resolve).observe({ type: 'paint', buffered: true });
    setTimeout(resolve, 300);
  });
};

export const onInitialClientRender = () => {
  const announcer = document.getElementById('gatsby-announcer');
  announcer?.setAttribute('aria-live', 'off');
  announcer?.setAttribute('aria-hidden', 'true');
  const idle = window.requestIdleCallback || window.setTimeout;
  const hand = () => document.documentElement.classList.add('hand');
  idle(() => document.fonts.load('400 1em Mynerve').then(hand, hand));
};

export const onRouteUpdate = ({ location, prevLocation }) => {
  if (prevLocation) window.goatcounter?.count?.({ path: location.pathname });
};

export const shouldUpdateScroll = ({ routerProps, prevRouterProps, getSavedScrollPosition }) => {
  const { location } = routerProps;
  const back = popped;
  popped = false;
  if (!prevRouterProps) {
    if (location.hash) return true;
    window.scrollTo({ top: getSavedScrollPosition(location)[1], behavior: 'instant' });
    return false;
  }
  if (prevRouterProps.location.pathname === location.pathname) {
    if (location.hash || !back) return true;
    window.scrollTo({ top: window.history.state?.y ?? 0, behavior: 'instant' });
    return false;
  }
  keepScroll(back ? getSavedScrollPosition(location) : null);
  return false;
};
