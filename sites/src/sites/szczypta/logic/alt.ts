import type { ImageId } from '../data/events';
import type { Lang } from '../data/lang';
import { homeCopy } from '../copy/home';
import { menuCopy } from '../copy/menu';

export const imageAlt = (id: ImageId, lang: Lang) =>
  ({
    poledwiczki: homeCopy[lang].hero.photoAlt,
    zupa: menuCopy[lang].images.soupAlt,
    buraki: menuCopy[lang].notes.beetsAlt,
    sala: menuCopy[lang].images.roomAlt,
  })[id];
