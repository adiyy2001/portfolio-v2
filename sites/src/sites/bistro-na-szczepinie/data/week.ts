import type { AllergenId } from './allergens';
import type { Lang, Localized } from './lang';

export interface Meal {
  name: Localized;
  allergens: AllergenId[];
}

export interface WeekDay {
  day: 1 | 2 | 3 | 4 | 5;
  price: number;
  soup: Meal;
  second: Meal;
  dessert: Meal;
}

export const week: WeekDay[] = [
  {
    day: 1,
    price: 32,
    soup: {
      name: { pl: 'Żurek z białą kiełbasą', en: 'Sour rye soup with white sausage' },
      allergens: ['gluten', 'eggs', 'celery'],
    },
    second: {
      name: { pl: 'Pierogi ruskie, sześć sztuk', en: 'Potato and cheese dumplings, six pieces' },
      allergens: ['gluten', 'eggs', 'milk'],
    },
    dessert: {
      name: { pl: 'Sernik wiedeński', en: 'Vienna cheesecake' },
      allergens: ['gluten', 'eggs', 'milk'],
    },
  },
  {
    day: 2,
    price: 33,
    soup: {
      name: { pl: 'Krem z pieczonej dyni', en: 'Roasted pumpkin cream soup' },
      allergens: ['milk', 'celery'],
    },
    second: {
      name: { pl: 'Kasza gryczana z borowikami', en: 'Buckwheat with porcini' },
      allergens: ['celery'],
    },
    dessert: {
      name: { pl: 'Szarlotka z lodami', en: 'Apple pie with ice cream' },
      allergens: ['gluten', 'eggs', 'milk'],
    },
  },
  {
    day: 3,
    price: 31,
    soup: {
      name: { pl: 'Rosół z makaronem', en: 'Chicken broth with noodles' },
      allergens: ['gluten', 'eggs', 'celery'],
    },
    second: {
      name: { pl: 'Gołąbki w sosie pomidorowym', en: 'Cabbage rolls in tomato sauce' },
      allergens: ['celery'],
    },
    dessert: {
      name: { pl: 'Kisiel żurawinowy', en: 'Cranberry kissel' },
      allergens: [],
    },
  },
  {
    day: 4,
    price: 30,
    soup: {
      name: { pl: 'Barszcz czerwony z uszkami', en: 'Red borscht with small dumplings' },
      allergens: ['gluten', 'eggs', 'celery'],
    },
    second: {
      name: { pl: 'Naleśniki ze szpinakiem', en: 'Spinach pancakes' },
      allergens: ['gluten', 'eggs', 'milk'],
    },
    dessert: {
      name: { pl: 'Makowiec z kruszonką', en: 'Poppy seed cake with crumble' },
      allergens: ['gluten', 'eggs', 'milk', 'nuts'],
    },
  },
  {
    day: 5,
    price: 35,
    soup: {
      name: { pl: 'Zupa rybna z koperkiem', en: 'Fish soup with dill' },
      allergens: ['fish', 'celery'],
    },
    second: {
      name: { pl: 'Dorsz z pieca, puree z selera', en: 'Oven-baked cod, celeriac purée' },
      allergens: ['fish', 'milk', 'celery'],
    },
    dessert: {
      name: { pl: 'Panna cotta z gruszką', en: 'Panna cotta with pear' },
      allergens: ['milk'],
    },
  },
];

export const dayNames: Record<Lang, string[]> = {
  pl: ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
};

export const weekPrices = week.map(entry => entry.price);
