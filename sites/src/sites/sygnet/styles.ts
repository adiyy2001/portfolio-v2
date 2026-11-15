import { fontFaceCss } from './fonts';
import baseCss from './styles/base.css?inline';
import homeCss from './styles/home.css?inline';
import innerCss from './styles/inner.css?inline';

export const styleBundles = {
  core: `${fontFaceCss}${baseCss}`,
  home: homeCss,
  inner: innerCss,
} as const;

export type StyleBundle = keyof typeof styleBundles;
