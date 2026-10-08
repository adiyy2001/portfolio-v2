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
  webTargets: { hero: 2.2 * 1024 * 1024 },
  fontFiles: [
    {
      family: 'Azeret Mono',
      source: { dir: 'azeretmono', file: 'AzeretMono[wght].ttf' },
      remotion: fonts[0].file,
      web: 'azeret-mono-variable.woff2',
      weight: '400 700',
      used: [400, 500, 700],
      role: 'cały interfejs, napisy w wideo, tekst strony; krój o stałej szerokości, więc odszyfrowanie nie przesuwa liter',
    },
    {
      family: 'Oxanium',
      source: { dir: 'oxanium', file: 'Oxanium[wght].ttf' },
      remotion: fonts[1].file,
      web: 'oxanium-variable.woff2',
      weight: '600 800',
      used: [600, 800],
      role: 'znak RYGIEL, duże liczby i nagłówki strony',
    },
  ],
};
