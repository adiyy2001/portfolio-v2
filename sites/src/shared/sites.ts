export const sites = [
  { slug: 'rozwaga', name: 'Rozwaga', trade: 'kancelaria radcy prawnego' },
  { slug: 'rubryka', name: 'Rubryka', trade: 'biuro rachunkowe' },
  { slug: 'szkliwo', name: 'Szkliwo', trade: 'klinika stomatologiczna' },
  { slug: 'tafla', name: 'Tafla', trade: 'gabinet psychoterapii' },
  { slug: 'przedza', name: 'Przędza', trade: 'mieszkania w dawnej przędzalni' },
  { slug: 'kminek', name: 'Kminek', trade: 'bistro' },
  { slug: 'trzask', name: 'Trzask', trade: 'palarnia kawy ze sklepem' },
  { slug: 'prog', name: 'Próg', trade: 'biuro nieruchomości' },
  { slug: 'przeslo', name: 'Przęsło', trade: 'hotel z rezerwacją online' },
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
