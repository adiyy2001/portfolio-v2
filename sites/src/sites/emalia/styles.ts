import { fontFaceCss } from './fonts';
import baseCss from './styles/base.css?inline';
import chromeCss from './styles/chrome.css?inline';
import contactCss from './styles/contact.css?inline';
import homeCss from './styles/home.css?inline';
import innerCss from './styles/inner.css?inline';
import visitCss from './styles/visit.css?inline';

export const styleBundles = {
  core: `${fontFaceCss}${baseCss}${chromeCss}`,
  home: homeCss,
  visit: visitCss,
  contact: contactCss,
  inner: innerCss,
} as const;

export type StyleBundle = keyof typeof styleBundles;
