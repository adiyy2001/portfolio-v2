const pl = {
  title: 'Źródła zdjęć i fontów',
  description:
    'Autorzy i licencje zdjęć oraz fontów użytych na przykładowej stronie bistra Szczypta.',
  h1: 'Źródła zdjęć i fontów',
  intro:
    'Zdjęcia pochodzą z serwisu Pexels (licencja Pexels, wolna do użytku komercyjnego). Zostały zamienione na WebP i zmniejszone, bez innych zmian.',
  photos: {
    caption: 'Zdjęcia',
    head: ['Zdjęcie', 'Autor', 'Źródło', 'Licencja'],
    rows: [
      ['Zrumieniony kawałek mięsa z mikroliśćmi na ciemnym talerzu', 'Valeriya', '1639561'],
      ['Zupa w glinianych miskach', 'Boryslav Shoot', '13790510'],
      ['Buraki', 'Eva Bronzini', '5758605'],
      ['Sala restauracji z nakrytymi stołami', 'Vidal Balielo Jr.', '12688961'],
      ['Pierogi z cebulką na ceramicznym talerzu', 'Veronika Benz', '37225178'],
      ['Butelka wina, kieliszki, ser i winogrona', 'Burst', '374010'],
      ['Stół śniadaniowy z jajkami, bułkami i serem', 'Emrah Tolu', '2662875'],
    ],
    licence: 'Pexels',
  },
  fonts: {
    caption: 'Fonty',
    head: ['Krój', 'Autorzy', 'Licencja'],
    rows: [
      ['Cormorant Garamond', 'The Cormorant Project Authors'],
      ['Jost', 'The Jost Project Authors'],
    ],
    licence: 'SIL Open Font License 1.1',
  },
  og: 'Obraz podglądu strony w mediach społecznościowych powstał ze zdjęcia mięsa z mikroliśćmi (Valeriya, Pexels) i krojów Cormorant Garamond oraz Jost.',
  back: 'Wróć do karty',
};

const en: typeof pl = {
  title: 'Photo and font credits',
  description:
    'Authors and licences of the photos and fonts used on the Szczypta bistro sample website.',
  h1: 'Photo and font credits',
  intro:
    'The photos come from Pexels (the Pexels licence, free for commercial use). They were converted to WebP and resized, with no other changes.',
  photos: {
    caption: 'Photos',
    head: ['Photo', 'Author', 'Source', 'Licence'],
    rows: [
      ['Browned piece of meat with microgreens on a dark plate', 'Valeriya', '1639561'],
      ['Soup in clay bowls', 'Boryslav Shoot', '13790510'],
      ['Beetroot', 'Eva Bronzini', '5758605'],
      ['Restaurant dining room with laid tables', 'Vidal Balielo Jr.', '12688961'],
      ['Dumplings with fried onion on a ceramic plate', 'Veronika Benz', '37225178'],
      ['A bottle of wine, glasses, cheese and grapes', 'Burst', '374010'],
      ['Breakfast table with eggs, rolls and cheese', 'Emrah Tolu', '2662875'],
    ],
    licence: 'Pexels',
  },
  fonts: {
    caption: 'Fonts',
    head: ['Typeface', 'Authors', 'Licence'],
    rows: [
      ['Cormorant Garamond', 'The Cormorant Project Authors'],
      ['Jost', 'The Jost Project Authors'],
    ],
    licence: 'SIL Open Font License 1.1',
  },
  og: 'The social preview image was made from the photo of the meat with microgreens (Valeriya, Pexels) and the Cormorant Garamond and Jost typefaces.',
  back: 'Back to the menu',
};

export const creditsCopy = { pl, en };
