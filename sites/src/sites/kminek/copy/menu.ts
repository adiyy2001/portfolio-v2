import type { Lang } from '../data/lang';

const pl = {
  meta: {
    title: 'Karta na ten tydzień | Kminek',
    description:
      'Karta bistra Kminek z cenami i alergenami według unijnej listy czternastu, z oznaczeniem dań wegetariańskich i wegańskich. Zmienia się co wtorek.',
  },
  head: {
    title: 'Karta na ten tydzień',
    lead: 'Czternaście dań, które zmieniamy co tydzień, i napoje, które są zawsze w karcie. Ceny w złotych, brutto, serwisu nie doliczamy. Karta zmienia się we wtorek i obowiązuje do niedzieli.',
  },
  card: {
    weekPrefix: 'Karta na tydzień:',
    title: 'Karta',
    legendLink: 'Co znaczą kody i znaczki',
    foot: [
      'Wszystko gotujemy w jednej kuchni, więc w daniu mogą być śladowe ilości innych alergenów. Powiedz o alergii przy zamówieniu.',
      'Ceny brutto. Serwisu nie doliczamy.',
    ],
  },
  spoken: {
    vegetarian: 'Danie wegetariańskie.',
    vegan: 'Danie wegańskie.',
    allergens: 'Alergeny',
    none: 'Bez alergenów z listy.',
  },
  filter: {
    title: 'Co możesz zjeść?',
    intro: 'Wybierz dietę i zaznacz alergeny, których unikasz. Karta pokaże tylko to, co pasuje.',
    dietLegend: 'Dieta',
    diets: { any: 'Wszystko', vegetarian: 'Wegetariańskie', vegan: 'Wegańskie' },
    withoutLegend: 'Bez alergenów',
    withoutHint: 'Zaznacz, czego unikasz',
    dishesIn: 'dań',
    countTemplate: 'Pokazuję {shown} z {total} pozycji.',
    emptyText: 'Nic nie pasuje do tych filtrów. Odznacz któryś alergen albo zmień dietę.',
    reset: 'Pokaż wszystko',
    absent: 'nie w karcie',
  },
  legend: {
    title: 'Jak czytać kartę',
    diets: [
      { code: 'V', text: 'wegetariańskie, bez mięsa i ryb' },
      { code: 'VG', text: 'wegańskie, bez produktów zwierzęcych' },
    ],
    allergensTitle: 'Alergeny według unijnej listy',
    allergensNote:
      'Dania bez kodu nie zawierają żadnego z czternastu alergenów z listy. Kody podajemy po polsku, w angielskiej wersji strony po angielsku.',
  },
  end: {
    title: 'Wybrane? Zarezerwuj stolik.',
    text: 'Karta stoi do niedzieli, ale najlepiej dopasować wizytę do dania, na które czekasz.',
    button: 'Jak zarezerwować',
  },
};

const en: typeof pl = {
  meta: {
    title: "This week's menu | Kminek",
    description:
      'The Kminek bistro menu with prices and allergens from the EU list of fourteen, with vegetarian and vegan dishes marked. It changes every Tuesday.',
  },
  head: {
    title: "This week's menu",
    lead: 'Fourteen dishes that change every week, and the drinks that are always on the list. Prices in złoty, VAT included, no service charge. The menu changes on Tuesday and runs until Sunday.',
  },
  card: {
    weekPrefix: 'Menu for the week:',
    title: 'Menu',
    legendLink: 'What the codes and marks mean',
    foot: [
      'Everything is cooked in one kitchen, so a dish may contain traces of other allergens. Tell us about an allergy when you order.',
      'Prices include VAT. No service charge.',
    ],
  },
  spoken: {
    vegetarian: 'Vegetarian dish.',
    vegan: 'Vegan dish.',
    allergens: 'Allergens',
    none: 'No listed allergens.',
  },
  filter: {
    title: 'What can you eat?',
    intro: 'Pick a diet and tick the allergens you avoid. The menu shows only what fits.',
    dietLegend: 'Diet',
    diets: { any: 'Everything', vegetarian: 'Vegetarian', vegan: 'Vegan' },
    withoutLegend: 'Without allergens',
    withoutHint: 'Tick what you avoid',
    dishesIn: 'dishes',
    countTemplate: 'Showing {shown} of {total} items.',
    emptyText: 'Nothing matches these filters. Untick an allergen or change the diet.',
    reset: 'Show everything',
    absent: 'not on the menu',
  },
  legend: {
    title: 'How to read the menu',
    diets: [
      { code: 'V', text: 'vegetarian, no meat or fish' },
      { code: 'VG', text: 'vegan, no animal products' },
    ],
    allergensTitle: 'Allergens from the EU list',
    allergensNote:
      'A dish without a code contains none of the fourteen listed allergens. On the English pages the codes are English, on the Polish pages they are Polish.',
  },
  end: {
    title: 'Chosen? Book a table.',
    text: 'The menu stands until Sunday, but it is best to time your visit to the dish you are waiting for.',
    button: 'How to book',
  },
};

export const menuCopy: Record<Lang, typeof pl> = { pl, en };
