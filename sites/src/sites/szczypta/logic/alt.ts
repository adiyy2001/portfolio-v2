import type { ImageId } from '../data/events';
import type { Lang } from '../data/lang';
import { homeCopy } from '../copy/home';
import { menuCopy } from '../copy/menu';

const eventPhotoAlt: Record<'pierogi' | 'wino' | 'sniadanie', Record<Lang, string>> = {
  pierogi: {
    pl: 'Pierogi z cebulką smażoną na maśle, jeden przekrojony z nadzieniem, na ceramicznym talerzu',
    en: 'Dumplings with fried onion, one cut open to show the filling, on a speckled ceramic plate',
  },
  wino: {
    pl: 'Butelka czerwonego wina, dwa kieliszki, ser, winogrona i chleb na jasnym blacie',
    en: 'A bottle of red wine, two glasses, cheese, grapes and bread on a pale counter',
  },
  sniadanie: {
    pl: 'Stół śniadaniowy z bułkami w koszyku, jajkami sadzonymi, serem i świeżymi warzywami',
    en: 'A breakfast table with rolls in a basket, fried eggs, cheese and fresh vegetables',
  },
};

export const imageAlt = (id: ImageId, lang: Lang) =>
  ({
    pierogi: eventPhotoAlt.pierogi[lang],
    wino: eventPhotoAlt.wino[lang],
    sniadanie: eventPhotoAlt.sniadanie[lang],
    poledwiczki: homeCopy[lang].hero.photoAlt,
    zupa: menuCopy[lang].images.soupAlt,
    buraki: menuCopy[lang].notes.beetsAlt,
    sala: menuCopy[lang].images.roomAlt,
  })[id];
