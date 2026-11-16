import type { Lang } from '../i18n/lang';

const pl = {
  metaTitle: 'Źródła zdjęć i fontów. Hotel Kamienica 1912, Wrocław',
  metaDescription:
    'Autorzy, źródła i licencje zdjęć pokoi oraz fontów użytych na przykładowej stronie hotelu Kamienica 1912. Pokoje hotelu nie istnieją, zdjęcia są poglądowe.',
  heading: 'Źródła zdjęć i fontów',
  lead: 'Zdjęcia pokoi pochodzą z Wikimedia Commons i są poglądowe. Zmieniono je na dwa kolory strony, przycięto i zmniejszono. Pokoje hotelu nie istnieją.',
  caption: 'Zdjęcia pokoi: pokój, tytuł i źródło, autor, licencja',
  columns: { room: 'Pokój', source: 'Tytuł i źródło', author: 'Autor', licence: 'Licencja' },
  rest: 'Rycina fasady jest rysunkiem wykonanym na potrzeby tej strony. Fonty (Cinzel Decorative, Pinyon Script, Playfair Display, Playfair Display SC) są na licencji SIL Open Font License 1.1 i leżą na tym samym serwerze.',
  back: 'Wróć do strony głównej',
};

const en: typeof pl = {
  metaTitle: 'Photo and font credits. Hotel Kamienica 1912, Wrocław',
  metaDescription:
    'Authors, sources and licences of the room photographs and fonts used on the sample site of Hotel Kamienica 1912. The hotel rooms do not exist, the photographs are illustrative.',
  heading: 'Photo and font credits',
  lead: 'The room photographs come from Wikimedia Commons and are illustrative. They were changed to the two colours of the site, cropped and made smaller. The hotel rooms do not exist.',
  caption: 'Room photographs: room, title and source, author, licence',
  columns: { room: 'Room', source: 'Title and source', author: 'Author', licence: 'Licence' },
  rest: 'The facade engraving is a drawing made for this site. The fonts (Cinzel Decorative, Pinyon Script, Playfair Display, Playfair Display SC) are under the SIL Open Font License 1.1 and are served from the same server.',
  back: 'Back to the home page',
};

export const creditsText: Record<Lang, typeof pl> = { pl, en };

export const photoCredits = [
  {
    id: 'cichy',
    title: 'Wrocław, WenderEDU Business Center, pokój (2)',
    source:
      'https://commons.wikimedia.org/wiki/File:Wroc%C5%82aw,_WenderEDU_Business_Center,_pok%C3%B3j_(2).jpg',
    author: 'Palickap',
    licence: 'CC BY 4.0',
    licenceUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
  {
    id: 'dziedziniec',
    title: 'Kraków, Hotel Galaxy, pokój',
    source: 'https://commons.wikimedia.org/wiki/File:Krak%C3%B3w,_Hotel_Galaxy,_pok%C3%B3j.jpg',
    author: 'Palickap',
    licence: 'CC BY-SA 4.0',
    licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  {
    id: 'poddasze',
    title: 'Hotel Esperanto, Białystok, 2019',
    source:
      'https://commons.wikimedia.org/wiki/File:20190312_182324_Hotel_Esperanto_Bialystok_2019.jpg',
    author: 'Rakoon',
    licence: 'CC0 1.0',
    licenceUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  {
    id: 'apartament',
    title: 'Wrocław, WenderEDU Business Center, pokój (1)',
    source:
      'https://commons.wikimedia.org/wiki/File:Wroc%C5%82aw,_WenderEDU_Business_Center,_pok%C3%B3j_(1).jpg',
    author: 'Palickap',
    licence: 'CC BY 4.0',
    licenceUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
] as const;
