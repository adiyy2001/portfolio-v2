import 'lenis/dist/lenis.css';
import './src/styles/global.css';
import { keepScroll } from './src/components/layout';

export { wrapRootElement, wrapPageElement } from './src/wrap';

export const onInitialClientRender = () => {
  const idle = window.requestIdleCallback || window.setTimeout;
  const hand = () => document.documentElement.classList.add('hand');
  idle(() => document.fonts.load('400 1em Mynerve').then(hand, hand));
};

export const shouldUpdateScroll = ({ routerProps, prevRouterProps, getSavedScrollPosition }) => {
  const { location } = routerProps;
  if (prevRouterProps && prevRouterProps.location.pathname === location.pathname) return true;
  keepScroll(location.action === 'POP' ? getSavedScrollPosition(location) : null);
  return false;
};
