export const sites = [
  { slug: 'kancelaria-swidnicka', name: 'Kancelaria Świdnicka', trade: 'kancelaria prawna' },
  {
    slug: 'biuro-rachunkowe-gajowice',
    name: 'Biuro Rachunkowe Gajowice',
    trade: 'biuro rachunkowe',
  },
  { slug: 'stomatologia-krzyki', name: 'Stomatologia Krzyki', trade: 'gabinet stomatologiczny' },
  {
    slug: 'psychoterapia-biskupin',
    name: 'Psychoterapia Biskupin',
    trade: 'gabinet psychoterapii',
  },
  { slug: 'lofty-cegielniane', name: 'Lofty Cegielniane', trade: 'lofty w dawnej cegielni' },
  { slug: 'bistro-na-szczepinie', name: 'Bistro na Szczepinie', trade: 'bistro' },
  {
    slug: 'palarnia-kawy-nadodrze',
    name: 'Palarnia Kawy Nadodrze',
    trade: 'palarnia kawy ze sklepem',
  },
  {
    slug: 'nieruchomosci-psie-pole',
    name: 'Nieruchomości Psie Pole',
    trade: 'biuro nieruchomości',
  },
  { slug: 'hotel-kamienica-1912', name: 'Hotel Kamienica 1912', trade: 'hotel butikowy' },
  { slug: 'warsztat-szybowcowa', name: 'Warsztat Szybowcowa', trade: 'warsztat samochodowy' },
] as const;

export const identityBrands = [
  {
    slug: 'skibka',
    name: 'Skibka',
    styleId: 'I3',
    style: 'Organiczny rzemieślniczy',
    trade: 'piekarnia na zakwasie',
    city: 'Kraków',
  },
  {
    slug: 'nosna',
    name: 'Nośna',
    styleId: 'I6',
    style: 'Generatywna identyfikacja dynamiczna',
    trade: 'festiwal sztuki nowych mediów i muzyki elektronicznej',
    city: 'Łódź',
  },
  {
    slug: 'rzut',
    name: 'Rzut',
    styleId: 'I1',
    style: 'Szwajcarski modernizm',
    trade: 'pracownia architektoniczna',
    city: 'Wrocław',
  },
  {
    slug: 'klamra',
    name: 'Klamra',
    styleId: 'I2',
    style: 'Neobrutalizm',
    trade: 'szkoła programowania online',
    city: 'cała Polska',
  },
  {
    slug: 'cuvee',
    name: 'Cuvée',
    styleId: 'I4',
    style: 'Luksusowy edytorial',
    trade: 'butikowy hotel z winnicą',
    city: 'Dolny Śląsk',
  },
  {
    slug: 'wolnobieg',
    name: 'Wolnobieg',
    styleId: 'I5',
    style: 'Retro lata 70.',
    trade: 'serwis i sklep rowerowy',
    city: 'Gdańsk',
  },
] as const;

export type IdentitySlug = (typeof identityBrands)[number]['slug'];
