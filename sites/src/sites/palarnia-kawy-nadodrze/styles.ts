import { fontFaceCss, textureCss } from './fonts';
import baseCss from './styles/base.css?inline';
import chromeCss from './styles/chrome.css?inline';
import formsCss from './styles/forms.css?inline';
import homeCss from './styles/home.css?inline';
import shopCss from './styles/shop.css?inline';
import productCss from './styles/product.css?inline';
import cartCss from './styles/cart.css?inline';
import mapCss from './styles/map.css?inline';
import infoCss from './styles/info.css?inline';

export const styleBundles = {
  core: `${fontFaceCss}${textureCss}${baseCss}${chromeCss}${formsCss}`,
  home: homeCss,
  shop: shopCss,
  product: productCss,
  cart: cartCss,
  info: infoCss,
  map: mapCss,
} as const;

export type StyleBundle = keyof typeof styleBundles;
