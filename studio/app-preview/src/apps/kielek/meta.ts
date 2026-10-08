import { app, gallery } from './content';
import { color, fonts, motion, palette, type } from './tokens';
import { marketing, marketingBeats, storyboard, tile } from './storyboard';
import { iconSvg } from './icon';

const ofl = 'https://raw.githubusercontent.com/coz-m/MPLUS_FONTS/master/OFL.txt';

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
      family: 'M PLUS Rounded 1c',
      source: { dir: 'mplusrounded1c', file: 'MPLUSRounded1c-Medium.ttf', ofl },
      remotion: fonts[0].file,
      web: 'mplus-rounded-1c-500.woff2',
      weight: '500',
      used: [500],
      role: 'tekst, objaśnienia i zdania pod nagłówkami',
    },
    {
      family: 'M PLUS Rounded 1c',
      source: { dir: 'mplusrounded1c', file: 'MPLUSRounded1c-ExtraBold.ttf', ofl },
      remotion: fonts[1].file,
      web: 'mplus-rounded-1c-800.woff2',
      weight: '800',
      used: [800],
      role: 'etykiety, chipy, przyciski i pigułki',
    },
    {
      family: 'M PLUS Rounded 1c',
      source: { dir: 'mplusrounded1c', file: 'MPLUSRounded1c-Black.ttf', ofl },
      remotion: fonts[2].file,
      web: 'mplus-rounded-1c-900.woff2',
      weight: '900',
      used: [900],
      role: 'tytuły, liczby, nazwa Kiełek i nagłówki strony',
    },
  ],
};
