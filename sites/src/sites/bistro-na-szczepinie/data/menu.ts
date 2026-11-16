import type { AllergenId } from './allergens';
import type { FootnoteId } from './suppliers';
import type { Localized } from './lang';
import { week } from './week';

export type ChapterId = 'breakfast' | 'lunch' | 'dinner' | 'drinks';

export type Diet = 'vegan' | 'vegetarian' | 'meat' | 'fish';

export interface Dish {
  id: string;
  chapter: ChapterId;
  home: boolean;
  name: Localized;
  desc?: Localized;
  price: number;
  from?: boolean;
  notes: FootnoteId[];
  allergens: AllergenId[];
  diet: Diet;
}

export const chapterOrder: ChapterId[] = ['breakfast', 'lunch', 'dinner', 'drinks'];

export const dishes: Dish[] = [
  {
    id: 'owsianka',
    chapter: 'breakfast',
    home: true,
    name: { pl: 'Owsianka z prażonymi jabłkami', en: 'Porridge with roasted apples' },
    desc: { pl: 'Na mleku, z cynamonem.', en: 'Made with milk, with cinnamon.' },
    price: 14,
    notes: ['dairy'],
    allergens: ['gluten', 'milk'],
    diet: 'vegetarian',
  },
  {
    id: 'jajka',
    chapter: 'breakfast',
    home: true,
    name: { pl: 'Jajka w koszulkach na chlebie', en: 'Poached eggs on bread' },
    desc: { pl: 'Na maśle, ze szczypiorkiem.', en: 'Buttered, with chives.' },
    price: 19,
    notes: ['bread'],
    allergens: ['gluten', 'eggs', 'milk'],
    diet: 'vegetarian',
  },
  {
    id: 'twarozek',
    chapter: 'breakfast',
    home: true,
    name: { pl: 'Twarożek z rzodkiewką', en: 'Fresh cheese with radish' },
    desc: { pl: 'Z koperkiem.', en: 'With dill.' },
    price: 16,
    notes: ['dairy'],
    allergens: ['milk'],
    diet: 'vegetarian',
  },
  {
    id: 'chleb-konfitura',
    chapter: 'breakfast',
    home: false,
    name: { pl: 'Chleb z masłem i konfiturą z pigwy', en: 'Bread with butter and quince jam' },
    desc: {
      pl: 'Dwie kromki, konfitura z jesiennej pigwy.',
      en: 'Two slices, jam from autumn quince.',
    },
    price: 12,
    notes: ['bread', 'dairy'],
    allergens: ['gluten', 'milk'],
    diet: 'vegetarian',
  },
  {
    id: 'jajecznica',
    chapter: 'breakfast',
    home: false,
    name: { pl: 'Jajecznica ze szczypiorkiem', en: 'Scrambled eggs with chives' },
    desc: { pl: 'Na maśle, z kromką chleba.', en: 'Cooked in butter, with a slice of bread.' },
    price: 17,
    notes: ['bread'],
    allergens: ['gluten', 'eggs', 'milk'],
    diet: 'vegetarian',
  },
  {
    id: 'kawa-owsiana',
    chapter: 'breakfast',
    home: true,
    name: { pl: 'Kawa z mlekiem owsianym', en: 'Coffee with oat milk' },
    price: 9,
    notes: [],
    allergens: ['gluten'],
    diet: 'vegan',
  },
  {
    id: 'zupa-dnia',
    chapter: 'lunch',
    home: true,
    name: { pl: 'Zupa dnia, miska 400 ml', en: 'Soup of the day, 400 ml bowl' },
    desc: {
      pl: 'Gęsta, gotowana rano, podawana z chlebem.',
      en: 'Thick, cooked in the morning, served with bread.',
    },
    price: 12,
    notes: ['vegetables', 'bread'],
    allergens: ['gluten', 'celery'],
    diet: 'meat',
  },
  {
    id: 'drugie-dnia',
    chapter: 'lunch',
    home: true,
    name: { pl: 'Drugie danie dnia', en: 'Main course of the day' },
    desc: { pl: 'Według karty tygodnia.', en: 'As on the weekly menu.' },
    price: 21,
    notes: [],
    allergens: [],
    diet: 'meat',
  },
  {
    id: 'deser-dnia',
    chapter: 'lunch',
    home: true,
    name: { pl: 'Deser dnia', en: 'Dessert of the day' },
    price: 9,
    notes: [],
    allergens: [],
    diet: 'vegetarian',
  },
  {
    id: 'zestaw-dnia',
    chapter: 'lunch',
    home: true,
    name: { pl: 'Zestaw dnia z herbatą', en: 'Set of the day with tea' },
    desc: {
      pl: 'Zupa, drugie danie i deser. Cena według karty tygodnia, od 30 do 35 zł.',
      en: 'Soup, main course and dessert. The price follows the weekly menu, from 30 to 35 zł.',
    },
    price: 30,
    from: true,
    notes: [],
    allergens: [],
    diet: 'meat',
  },
  {
    id: 'tatar-buraka',
    chapter: 'dinner',
    home: true,
    name: { pl: 'Tatar z buraka i kozi ser', en: 'Beetroot tartare with goat cheese' },
    desc: { pl: 'Z prażonymi orzechami laskowymi.', en: 'With toasted hazelnuts.' },
    price: 26,
    notes: ['vegetables', 'dairy'],
    allergens: ['milk', 'nuts', 'sulphites'],
    diet: 'vegetarian',
  },
  {
    id: 'poledwiczki',
    chapter: 'dinner',
    home: true,
    name: { pl: 'Polędwiczki w sosie pieprzowym', en: 'Pork tenderloin in pepper sauce' },
    desc: { pl: 'Pieprz mielony przy stole.', en: 'Pepper ground at the table.' },
    price: 42,
    notes: ['pepper'],
    allergens: ['milk', 'celery'],
    diet: 'meat',
  },
  {
    id: 'pierogi-ges',
    chapter: 'dinner',
    home: true,
    name: { pl: 'Pierogi z gęsiną, osiem sztuk', en: 'Goose dumplings, eight pieces' },
    desc: { pl: 'Z cebulą smażoną na maśle.', en: 'With onion fried in butter.' },
    price: 34,
    notes: [],
    allergens: ['gluten', 'eggs', 'milk'],
    diet: 'meat',
  },
  {
    id: 'kasza-borowiki',
    chapter: 'dinner',
    home: false,
    name: { pl: 'Kasza gryczana z borowikami', en: 'Buckwheat with porcini' },
    desc: {
      pl: 'Z suszonymi grzybami i natką pietruszki.',
      en: 'With dried mushrooms and parsley.',
    },
    price: 26,
    notes: ['vegetables'],
    allergens: ['celery'],
    diet: 'vegan',
  },
  {
    id: 'wino-morawy',
    chapter: 'dinner',
    home: true,
    name: { pl: 'Lampka wina z Moraw', en: 'Glass of Moravian wine' },
    price: 16,
    notes: [],
    allergens: ['sulphites'],
    diet: 'vegan',
  },
  {
    id: 'gruszka',
    chapter: 'drinks',
    home: false,
    name: { pl: 'Pieczona gruszka z miodem i orzechami', en: 'Baked pear with honey and nuts' },
    desc: { pl: 'Podawana ciepła.', en: 'Served warm.' },
    price: 16,
    notes: [],
    allergens: ['nuts'],
    diet: 'vegetarian',
  },
  {
    id: 'lody',
    chapter: 'drinks',
    home: false,
    name: { pl: 'Lody waniliowe z sosem malinowym', en: 'Vanilla ice cream with raspberry sauce' },
    price: 12,
    notes: ['dairy'],
    allergens: ['milk', 'eggs'],
    diet: 'vegetarian',
  },
  {
    id: 'espresso',
    chapter: 'drinks',
    home: false,
    name: { pl: 'Espresso', en: 'Espresso' },
    price: 8,
    notes: [],
    allergens: [],
    diet: 'vegan',
  },
  {
    id: 'herbata',
    chapter: 'drinks',
    home: false,
    name: { pl: 'Herbata w dzbanku', en: 'Tea by the pot' },
    price: 10,
    notes: [],
    allergens: [],
    diet: 'vegan',
  },
  {
    id: 'lemoniada',
    chapter: 'drinks',
    home: false,
    name: { pl: 'Lemoniada domowa', en: 'House lemonade' },
    price: 12,
    notes: [],
    allergens: [],
    diet: 'vegan',
  },
  {
    id: 'piwo',
    chapter: 'drinks',
    home: false,
    name: { pl: 'Piwo rzemieślnicze, 0,33 l', en: 'Craft beer, 0.33 l' },
    price: 14,
    notes: [],
    allergens: ['gluten'],
    diet: 'vegan',
  },
];

export const priceLabel = (dish: Dish, lang: 'pl' | 'en') =>
  `${dish.from ? (lang === 'pl' ? 'od ' : 'from ') : ''}${dish.price} zł`;

export const dishesOf = (chapter: ChapterId, onlyHome = false) =>
  dishes.filter(dish => dish.chapter === chapter && (!onlyHome || dish.home));

export const dishById = (id: string) => dishes.find(dish => dish.id === id)!;

const union = (lists: AllergenId[][]) => [...new Set(lists.flat())];

const weekAllergens = {
  soup: union(week.map(day => day.soup.allergens)),
  second: union(week.map(day => day.second.allergens)),
  dessert: union(week.map(day => day.dessert.allergens)),
};

const dynamicAllergens: Record<string, AllergenId[]> = {
  'zupa-dnia': weekAllergens.soup,
  'drugie-dnia': weekAllergens.second,
  'deser-dnia': weekAllergens.dessert,
  'zestaw-dnia': union([weekAllergens.soup, weekAllergens.second, weekAllergens.dessert]),
};

export const allergensOf = (dish: Dish) => dynamicAllergens[dish.id] ?? dish.allergens;
