export const sites = [
  { slug: 'sygnet', name: 'Sygnet', trade: 'kancelaria prawna' },
  { slug: 'kajet', name: 'Kajet', trade: 'biuro rachunkowe' },
  { slug: 'emalia', name: 'Emalia', trade: 'gabinet stomatologiczny' },
  { slug: 'otoczak', name: 'Otoczak', trade: 'gabinet psychoterapii' },
  { slug: 'cegielnia-14', name: 'Cegielnia 14', trade: 'lofty w dawnej cegielni' },
  { slug: 'szczypta', name: 'Szczypta', trade: 'bistro' },
  { slug: 'ziarnik', name: 'Ziarnik', trade: 'palarnia kawy ze sklepem' },
  { slug: 'klamka', name: 'Klamka', trade: 'biuro nieruchomości' },
  { slug: 'brelok', name: 'Brelok 1912', trade: 'hotel butikowy' },
  { slug: 'nakretka', name: 'Nakrętka', trade: 'warsztat samochodowy' },
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
