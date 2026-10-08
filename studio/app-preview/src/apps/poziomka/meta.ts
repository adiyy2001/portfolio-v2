import { app, gallery } from './content';
import { color, fonts, hex, motion, palette, type } from './tokens';
import { marketing, marketingBeats, storyboard, tile } from './storyboard';
import { iconSvg } from './icon';

export const meta = {
  app,
  gallery,
  color,
  palette,
  type,
  motion,
  storyboard,
  marketing,
  marketingBeats,
  tile,
  iconSvg,
  fonts,
  pixel: {
    imageFormat: 'png',
    scaleFlags: 'neighbor',
    palette: [...hex],
    grid: { store: { cell: 4, width: 884 } },
    screen: { crop: '884:1920:0:0', width: 442 },
    web: {
      store: { width: 884, height: 1920, crop: '884:1920:0:0' },
      hero: { width: 1920, height: 1080, poster: [960, 540] },
      'hero-9x16': { width: 1080, height: 1920, poster: [540, 960] },
      'social-1x1': { width: 1080, height: 1080, poster: [540, 540] },
      tile: { width: 480, height: 360 },
    },
  },
  fontFiles: [
    {
      family: 'Jersey 10',
      source: { dir: 'jersey10', file: 'Jersey10-Regular.ttf' },
      remotion: 'fonts/jersey10-regular.ttf',
      web: 'jersey-10.woff2',
      weight: '400',
      used: [400],
      role: 'nagłówki, liczby i napisy w wideo; w wideo jako bitmapa Poziomka Pixel, piksel kroju to 75 jednostek',
    },
    {
      family: 'Tiny5',
      source: { dir: 'tiny5', file: 'Tiny5-Regular.ttf' },
      remotion: 'fonts/tiny5-regular.ttf',
      web: 'tiny5.woff2',
      weight: '400',
      used: [400],
      role: 'etykiety, opisy i tekst strony; w wideo jako bitmapa Poziomka Mini, 5 pikseli wysokości wersalika',
    },
  ],
};
