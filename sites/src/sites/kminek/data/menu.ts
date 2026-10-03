import type { AllergenId } from './allergens';
import type { Localized } from './lang';

export type Diet = 'none' | 'vegetarian' | 'vegan';

export type SectionId = 'starters' | 'soups' | 'mains' | 'sweets' | 'drinks';

export interface Section {
  id: SectionId;
  title: Localized;
}

export interface Dish {
  id: string;
  section: SectionId;
  price: number;
  diet: Diet;
  allergens: readonly AllergenId[];
  name: Localized;
  description: Localized;
  keepsPolishName?: boolean;
}

export const sections: readonly Section[] = [
  { id: 'starters', title: { pl: 'Na początek', en: 'To start' } },
  { id: 'soups', title: { pl: 'Zupy', en: 'Soups' } },
  { id: 'mains', title: { pl: 'Na ciepło', en: 'Mains' } },
  { id: 'sweets', title: { pl: 'Na słodko', en: 'Something sweet' } },
  { id: 'drinks', title: { pl: 'Do picia, zawsze w karcie', en: 'To drink, always on the menu' } },
];

export const dishes: readonly Dish[] = [
  {
    id: 'tatar-z-buraka',
    section: 'starters',
    price: 26,
    diet: 'vegetarian',
    allergens: ['milk', 'mustard'],
    name: { pl: 'Tatar z pieczonego buraka', en: 'Roasted beetroot tartare' },
    description: {
      pl: 'Kwaśna śmietana, chrzan, musztarda z ziarnami, prażona kasza gryczana.',
      en: 'Soured cream, horseradish, wholegrain mustard, toasted buckwheat.',
    },
  },
  {
    id: 'sledz-w-oleju',
    section: 'starters',
    price: 29,
    diet: 'none',
    allergens: ['fish', 'gluten'],
    name: { pl: 'Śledź w oleju lnianym', en: 'Herring in linseed oil' },
    description: {
      pl: 'Jabłko, czerwona cebula, ogórek kiszony, chleb żytni na zakwasie.',
      en: 'Apple, red onion, pickled cucumber, sourdough rye bread.',
    },
  },
  {
    id: 'smalec',
    section: 'starters',
    price: 19,
    diet: 'none',
    allergens: ['gluten'],
    keepsPolishName: true,
    name: { pl: 'Smalec z jabłkiem i majerankiem', en: 'Smalec' },
    description: {
      pl: 'Chleb na zakwasie, ogórek kiszony.',
      en: 'Lard spread with apple and marjoram, sourdough bread, pickled cucumber.',
    },
  },
  {
    id: 'placek-ziemniaczany',
    section: 'starters',
    price: 27,
    diet: 'vegetarian',
    allergens: ['gluten', 'eggs', 'milk'],
    name: { pl: 'Placek ziemniaczany', en: 'Potato pancake' },
    description: {
      pl: 'Wędzony twaróg, szczypiorek, kwaśna śmietana.',
      en: 'Smoked curd cheese, chives, soured cream.',
    },
  },
  {
    id: 'zurek',
    section: 'soups',
    price: 22,
    diet: 'none',
    allergens: ['gluten', 'eggs', 'milk', 'celery'],
    keepsPolishName: true,
    name: { pl: 'Żurek na zakwasie', en: 'Żurek' },
    description: {
      pl: 'Jajko, biała kiełbasa, majeranek, chleb do maczania.',
      en: 'Soured rye soup with egg, white sausage and marjoram. Bread on the side.',
    },
  },
  {
    id: 'krem-z-dyni',
    section: 'soups',
    price: 21,
    diet: 'vegan',
    allergens: ['celery'],
    name: { pl: 'Krem z dyni i pieczonego jabłka', en: 'Pumpkin and roasted apple soup' },
    description: {
      pl: 'Olej z pestek dyni, prażone pestki. Bez mleka i jajek.',
      en: 'Pumpkin seed oil, toasted seeds. No dairy, no eggs.',
    },
  },
  {
    id: 'pierogi-z-kaszanka',
    section: 'mains',
    price: 34,
    diet: 'none',
    allergens: ['gluten', 'eggs', 'milk'],
    name: { pl: 'Pierogi z kaszanką i jabłkiem', en: 'Pierogi with black pudding and apple' },
    description: {
      pl: 'Osiem sztuk, smażona cebula, majeranek, masło.',
      en: 'Eight dumplings, fried onion, marjoram, butter. The filling is kaszanka, a blood sausage with buckwheat.',
    },
  },
  {
    id: 'kopytka',
    section: 'mains',
    price: 29,
    diet: 'vegetarian',
    allergens: ['gluten', 'eggs', 'milk'],
    keepsPolishName: true,
    name: { pl: 'Kopytka, masło szałwiowe', en: 'Kopytka' },
    description: {
      pl: 'Z pieczoną dynią, prażonymi pestkami i serem owczym.',
      en: "Potato dumplings with sage butter, roasted pumpkin, toasted seeds and sheep's cheese.",
    },
  },
  {
    id: 'udko-kaczki',
    section: 'mains',
    price: 56,
    diet: 'none',
    allergens: ['celery'],
    name: { pl: 'Udko kaczki z jabłkami i majerankiem', en: 'Duck leg with apples and marjoram' },
    description: {
      pl: 'Kasza gryczana, modra kapusta z kminkiem, sos z pieczeni.',
      en: 'Buckwheat, red cabbage braised with caraway, roast jus.',
    },
  },
  {
    id: 'policzki-wolowe',
    section: 'mains',
    price: 62,
    diet: 'none',
    allergens: ['gluten', 'milk', 'celery'],
    name: { pl: 'Policzki wołowe w ciemnym piwie', en: 'Beef cheeks braised in dark beer' },
    description: {
      pl: 'Puree z korzenia pietruszki, marynowany burak, chrzan.',
      en: 'Parsley root purée, pickled beetroot, horseradish.',
    },
  },
  {
    id: 'golabki',
    section: 'mains',
    price: 39,
    diet: 'vegan',
    allergens: ['celery'],
    keepsPolishName: true,
    name: { pl: 'Gołąbki z kaszą jaglaną i grzybami', en: 'Gołąbki' },
    description: {
      pl: 'Liście kapusty, grzyby leśne, sos pomidorowy z koperkiem.',
      en: 'Cabbage rolls filled with millet and wild mushrooms, tomato and dill sauce.',
    },
  },
  {
    id: 'szarlotka',
    section: 'sweets',
    price: 21,
    diet: 'vegetarian',
    allergens: ['gluten', 'eggs', 'milk', 'nuts'],
    name: { pl: 'Szarlotka z kruszonką', en: 'Apple pie with crumble' },
    description: {
      pl: 'Ciepła, z kremem waniliowym i orzechami włoskimi.',
      en: 'Served warm with vanilla custard and walnuts.',
    },
  },
  {
    id: 'sernik',
    section: 'sweets',
    price: 22,
    diet: 'vegetarian',
    allergens: ['gluten', 'eggs', 'milk'],
    name: { pl: 'Sernik z białego sera', en: 'Baked curd cheesecake' },
    description: {
      pl: 'Sos ze śliwek, kruche ciasto.',
      en: 'Plum sauce, shortcrust base.',
    },
  },
  {
    id: 'kisiel',
    section: 'sweets',
    price: 16,
    diet: 'vegan',
    allergens: ['gluten', 'nuts'],
    keepsPolishName: true,
    name: { pl: 'Kisiel z czarnej porzeczki', en: 'Kisiel' },
    description: {
      pl: 'Kruszonka owsiana, prażone migdały.',
      en: 'Blackcurrant fruit jelly with oat crumble and toasted almonds.',
    },
  },
  {
    id: 'lemoniada',
    section: 'drinks',
    price: 14,
    diet: 'vegetarian',
    allergens: [],
    name: { pl: 'Lemoniada domowa', en: 'House lemonade' },
    description: { pl: 'Cytryna, miód, mięta.', en: 'Lemon, honey, mint.' },
  },
  {
    id: 'kompot',
    section: 'drinks',
    price: 11,
    diet: 'vegan',
    allergens: [],
    name: { pl: 'Kompot z jabłek i śliwek', en: 'Apple and plum kompot' },
    description: { pl: 'Na zimno lub na ciepło.', en: 'Served cold or warm.' },
  },
  {
    id: 'espresso',
    section: 'drinks',
    price: 9,
    diet: 'vegan',
    allergens: [],
    name: { pl: 'Espresso', en: 'Espresso' },
    description: { pl: '', en: '' },
  },
  {
    id: 'flat-white',
    section: 'drinks',
    price: 15,
    diet: 'vegetarian',
    allergens: ['milk'],
    name: { pl: 'Flat white', en: 'Flat white' },
    description: { pl: '', en: '' },
  },
  {
    id: 'herbata',
    section: 'drinks',
    price: 12,
    diet: 'vegan',
    allergens: [],
    name: { pl: 'Herbata liściasta', en: 'Loose leaf tea' },
    description: { pl: 'Czajniczek dla jednej osoby.', en: 'A pot for one.' },
  },
  {
    id: 'piwo',
    section: 'drinks',
    price: 17,
    diet: 'none',
    allergens: ['gluten'],
    name: { pl: 'Piwo rzemieślnicze, 0,4 l', en: 'Craft beer, 0.4 l' },
    description: {
      pl: 'Zmienne, zapytaj, co jest na kranie.',
      en: 'It changes often, ask what is on tap.',
    },
  },
  {
    id: 'wino',
    section: 'drinks',
    price: 24,
    diet: 'none',
    allergens: ['sulphites'],
    name: { pl: 'Wino, lampka 150 ml', en: 'Wine, 150 ml glass' },
    description: {
      pl: 'Białe lub czerwone, z dolnośląskiej winnicy.',
      en: 'White or red, from a Lower Silesian vineyard.',
    },
  },
  {
    id: 'kminkowka',
    section: 'drinks',
    price: 14,
    diet: 'none',
    allergens: [],
    name: { pl: 'Kminkówka domowa, 40 ml', en: 'House caraway liqueur, 40 ml' },
    description: {
      pl: 'Nalewka na kminku i skórce cytryny.',
      en: 'Caraway and lemon peel, a Polish classic after a heavy meal.',
    },
  },
];

export const dishesIn = (section: SectionId) => dishes.filter(dish => dish.section === section);

export const dishById = (id: string): Dish => {
  const found = dishes.find(dish => dish.id === id);
  if (!found) throw new Error(`Unknown dish ${id}`);
  return found;
};

export const featuredDishIds = ['pierogi-z-kaszanka', 'zurek', 'kopytka'] as const;
