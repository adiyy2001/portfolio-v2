import { app, gallery } from './content';
import { color, fonts, motion, palette, type } from './tokens';
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
  fontFiles: [
    {
      family: 'Onest',
      source: { dir: 'onest', file: 'Onest[wght].ttf' },
      remotion: fonts[0].file,
      web: 'onest-variable.woff2',
      weight: '400 800',
      used: [400, 500, 600, 700, 800],
      role: 'cały interfejs, nagłówki wideo i strona',
    },
  ],
};
