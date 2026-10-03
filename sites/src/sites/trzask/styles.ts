import { fontFaceCss } from './fonts';
import baseCss from './styles/base.css?inline';
import chromeCss from './styles/chrome.css?inline';
import labelCss from './styles/label.css?inline';
import productCss from './styles/product.css?inline';
import cartCss from './styles/cart.css?inline';
import homeCss from './styles/home.css?inline';
import infoCss from './styles/info.css?inline';
import shopCss from './styles/shop.css?inline';

export const styleBundles = {
  core: `${fontFaceCss}${baseCss}${chromeCss}${labelCss}`,
  shop: shopCss,
  product: productCss,
  cart: cartCss,
  info: infoCss,
  home: homeCss,
} as const;

export type StyleBundle = keyof typeof styleBundles;
