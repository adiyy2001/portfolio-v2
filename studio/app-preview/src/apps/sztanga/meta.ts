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
      family: 'Anybody',
      source: { dir: 'anybody', file: 'Anybody[wdth,wght].ttf' },
      remotion: fonts[0].file,
      web: 'anybody-variable.woff2',
      weight: '500 900',
      used: [500, 600, 700, 800, 900],
      role: 'cały interfejs, liczby, słowa w wideo i strona; oś szerokości od 50 do 150',
    },
  ],
};
