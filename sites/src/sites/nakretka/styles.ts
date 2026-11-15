import { assetCss, fontFaceCss } from './fonts';
import baseCss from './styles/base.css?inline';
import chromeCss from './styles/chrome.css?inline';
import homeCss from './styles/home.css?inline';
import sheetCss from './styles/sheet.css?inline';
import pagesCss from './styles/pages.css?inline';
import bookingCss from './styles/booking.css?inline';

export const styleBundles = {
  core: `${assetCss}${fontFaceCss}${baseCss}${chromeCss}`,
  home: homeCss,
  sheet: sheetCss,
  pages: pagesCss,
  booking: bookingCss,
} as const;

export type StyleBundle = keyof typeof styleBundles;
