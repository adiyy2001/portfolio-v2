import { fontFaceCss } from './fonts';
import coreCss from './styles/core.css?inline';
import homeCss from './styles/home.css?inline';
import catalogCss from './styles/catalog.css?inline';
import offerCss from './styles/offer.css?inline';
import infoCss from './styles/info.css?inline';

export const styleBundles = {
  core: `${fontFaceCss}${coreCss}`,
  home: homeCss,
  catalog: catalogCss,
  offer: offerCss,
  info: infoCss,
} as const;

export type StyleBundle = keyof typeof styleBundles;
