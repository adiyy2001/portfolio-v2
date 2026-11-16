const pl = {
  chapters: {
    breakfast: { title: 'Śniadania', note: 'Chleb z piekarni za rogiem.' },
    lunch: {
      title: 'Lunch',
      note: 'Zupa dnia, drugie danie i deser. Pięć dni, pięć różnych zup.',
    },
    dinner: { title: 'Kolacje', note: 'Mniejsza karta, dłuższy stół.' },
    drinks: {
      title: 'Desery i napoje',
      note: 'Podajemy je przez cały dzień, także w przerwie kuchni.',
    },
  },
  week: {
    title: 'Karta tygodnia',
    note: 'Zestaw obejmuje zupę, drugie danie, deser i herbatę.',
    soup: 'Zupa',
    second: 'Drugie',
    dessert: 'Deser',
    allergens: 'Alergeny',
    setPrice: 'Zestaw',
    listLabel: 'Zestawy na pięć dni tygodnia',
  },
  notes: {
    title: 'Przypisy do karty',
    intro:
      'Czterech dostawców: trzech z Wrocławia i okolic, jeden z Kerali w Indiach. Warzywa odbieramy dwa razy w tygodniu. Co nie dojedzie w ciągu dwóch dni od zbioru, nie trafia do zupy.',
    mark: 'przypis',
    beetsAlt: 'Pęk buraków z korzonkami i grudkami ziemi na jasnej powierzchni',
    beetsCaption: 'Buraki z podwrocławskiej farmy, w dniu odbioru.',
  },
  images: {
    soupAlt:
      'Dwie gliniane miski czerwonej zupy z łyżką śmietany i natką pietruszki na ciemnym stole',
    soupCaption: 'Zupa dnia, podawana z łyżką śmietany i natką.',
    roomAlt:
      'Sala restauracji wieczorem: nakryte drewniane stoły, krzesła z plecionką, ławka pod ścianą z drewnianych listew, w głębi bar i jasna zasłona',
    roomCaption: 'Sala wieczorem, stoły nakryte.',
  },
  moreMenu: 'Cała karta z alergenami',
  page: {
    title: 'Karta',
    description:
      'Pełna karta Bistra na Szczepinie: śniadania, lunch, kolacje, desery i napoje, ceny, alergeny i karta tygodnia. Strona przykładowa.',
    h1: 'Karta',
    lead: 'Śniadania, lunch i kolacje. Każda pozycja ma cenę i listę alergenów, a zestawy na pięć dni leżą na dole.',
    weekLink: 'Karta tygodnia',
    kitchenBreak: 'Od 16:00 do 17:00 kuchnia ma przerwę. Napoje i desery podajemy bez przerwy.',
  },
  filters: {
    title: 'Dopasuj kartę',
    vegetarian: 'Tylko wegetariańskie',
    vegan: 'Tylko wegańskie',
    without: 'Bez alergenów',
    withoutHint: 'Zaznacz to, czego unikasz',
    reset: 'Wyczyść filtry',
    status: (shown: number, total: number) => `Widać ${shown} z ${total} pozycji.`,
    none: 'Żadna pozycja nie spełnia wszystkich warunków. Wyczyść filtry, żeby zobaczyć całą kartę.',
  },
  tags: {
    vegan: 'wegańskie',
    vegetarian: 'wegetariańskie',
    allergens: 'Alergeny',
    noAllergens: 'bez alergenów z listy',
  },
  allergenNote:
    'Oznaczamy czternaście grup alergenów. Wszystkie dania powstają w jednej kuchni, więc ślady alergenów mogą pojawić się w każdym z nich. Jeśli jesteś uczulony, powiedz o tym na sali.',
};

const en: typeof pl = {
  chapters: {
    breakfast: { title: 'Breakfast', note: 'Bread from the bakery around the corner.' },
    lunch: {
      title: 'Lunch',
      note: 'Soup, a main course and dessert. Five days, five different soups.',
    },
    dinner: { title: 'Dinner', note: 'A smaller menu and a longer table.' },
    drinks: {
      title: 'Desserts and drinks',
      note: 'Served all day, also during the kitchen break.',
    },
  },
  week: {
    title: 'Weekly menu',
    note: 'The set covers soup, a main course, dessert and tea.',
    soup: 'Soup',
    second: 'Main',
    dessert: 'Dessert',
    allergens: 'Allergens',
    setPrice: 'Set',
    listLabel: 'Sets for five days of the week',
  },
  notes: {
    title: 'Notes to the menu',
    intro:
      'Four suppliers: three from Wrocław and the region, one from Kerala in India. We collect vegetables twice a week. Anything that does not arrive within two days of harvest does not go into the soup.',
    mark: 'footnote',
    beetsAlt: 'A bunch of beetroots with fine roots and lumps of soil on a pale surface',
    beetsCaption: 'Beetroot from a farm near Wrocław, on the day of delivery.',
  },
  images: {
    soupAlt: 'Two clay bowls of red soup with a spoon of sour cream and parsley on a dark table',
    soupCaption: 'Soup of the day, served with a spoon of sour cream and parsley.',
    roomAlt:
      'The restaurant dining room in the evening: laid wooden tables, rattan chairs, a bench against a wall of wooden slats, and a bar and a light curtain at the back',
    roomCaption: 'The dining room in the evening, tables laid.',
  },
  moreMenu: 'Full menu with allergens',
  page: {
    title: 'Menu',
    description:
      'The full menu of Bistro na Szczepinie: breakfast, lunch, dinner, desserts and drinks with prices, allergens and the weekly menu. Sample website.',
    h1: 'Menu',
    lead: 'Breakfast, lunch and dinner. Every dish has a price and its allergens, and the five daily sets are at the bottom.',
    weekLink: 'Weekly menu',
    kitchenBreak:
      'From 16:00 to 17:00 the kitchen takes a break. Drinks and desserts are served throughout.',
  },
  filters: {
    title: 'Narrow the menu',
    vegetarian: 'Vegetarian only',
    vegan: 'Vegan only',
    without: 'Without allergens',
    withoutHint: 'Tick what you avoid',
    reset: 'Clear filters',
    status: (shown: number, total: number) => `Showing ${shown} of ${total} dishes.`,
    none: 'No dish matches every condition. Clear the filters to see the whole menu.',
  },
  tags: {
    vegan: 'vegan',
    vegetarian: 'vegetarian',
    allergens: 'Allergens',
    noAllergens: 'none from the list',
  },
  allergenNote:
    'We mark fourteen allergen groups. Every dish is made in one kitchen, so traces of allergens can turn up in any of them. If you have an allergy, tell us in the dining room.',
};

export const menuCopy = { pl, en };
