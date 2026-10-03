import type { Lang } from '../i18n/lang';
import { tieDeep } from '../lib/typography';
import { hotel } from './facts';

export interface BreakfastItem {
  name: string;
  detail: string;
  allergens: string[];
}

export interface BreakfastText {
  title: string;
  description: string;
  heading: string;
  lead: string;
  hoursHeading: string;
  hours: { label: string; value: string }[];
  priceLine: string;
  priceNote: string;
  tableHeading: string;
  tableLead: string;
  caption: string;
  columns: { item: string; contains: string; allergens: string };
  noAllergens: string;
  items: BreakfastItem[];
  allergenNote: string;
  dietHeading: string;
  diet: { title: string; text: string }[];
  listHeading: string;
  listLead: string;
  allergenList: string[];
  book: string;
  call: string;
}

const pl: BreakfastText = {
  title: 'Śniadania: godziny, cena i alergeny | Przęsło',
  description:
    'Śniadanie w Przęśle: godziny, cena 55 zł od osoby za dobę, pełna tabela alergenów i lista czternastu alergenów z unijnych przepisów.',
  heading: 'Śniadania',
  lead: 'Jeden długi stół w sali na parterze, jedzenie na półmiskach i kawa z ekspresu ciśnieniowego. Siadasz tam, gdzie jest miejsce, i bierzesz tyle, ile zjesz.',
  hoursHeading: 'Godziny i cena',
  hours: [
    {
      label: 'Poniedziałek-piątek',
      value: `${hotel.breakfastWeekdayFrom}-${hotel.breakfastWeekdayTo}`,
    },
    {
      label: 'Sobota i niedziela',
      value: `${hotel.breakfastWeekendFrom}-${hotel.breakfastWeekendTo}`,
    },
  ],
  priceLine: '55 zł od osoby za dobę',
  priceNote:
    'Śniadanie dokupujesz przy rezerwacji albo później na stronie Moja rezerwacja. Dzieci do sześciu lat jedzą bez opłaty. W Weekendzie nad Odrą śniadania są już w cenie pakietu.',
  tableHeading: 'Co jest na stole',
  tableLead:
    'Skład zmienia się z porami roku, ale baza zostaje ta sama. Poniżej to, co podajemy codziennie, razem z alergenami.',
  caption: 'Śniadanie w Przęśle i alergeny w potrawach',
  columns: { item: 'Pozycja', contains: 'Co to jest', allergens: 'Alergeny' },
  noAllergens: 'brak',
  items: [
    {
      name: 'Pieczywo',
      detail: 'Chleb pszenno-żytni, bułki i rogaliki z piekarni przy sąsiedniej ulicy.',
      allergens: ['gluten (pszenica, żyto)', 'mleko', 'jaja', 'sezam'],
    },
    {
      name: 'Jajka',
      detail: 'Na ciepło i jajecznica na maśle, robiona na bieżąco.',
      allergens: ['jaja', 'mleko'],
    },
    {
      name: 'Sery i twaróg',
      detail: 'Dwa sery żółte, biały ser i twaróg ze szczypiorkiem.',
      allergens: ['mleko'],
    },
    {
      name: 'Wędliny i pasztet',
      detail: 'Szynka, polędwica, kiełbasa i pasztet domowy.',
      allergens: ['seler', 'gorczyca'],
    },
    {
      name: 'Ryby',
      detail: 'Łosoś wędzony na zimno i śledź w oleju z cebulą.',
      allergens: ['ryby'],
    },
    {
      name: 'Owsianka',
      detail: 'Na mleku, z owocami i prażonymi orzechami do wyboru.',
      allergens: ['gluten (owies)', 'mleko', 'orzechy (laskowe, włoskie)'],
    },
    {
      name: 'Jogurt z granolą',
      detail: 'Jogurt naturalny, granola owsiana z sezamem.',
      allergens: ['mleko', 'gluten (owies)', 'sezam', 'orzechy (laskowe)'],
    },
    {
      name: 'Hummus',
      detail: 'Z ciecierzycy, na pastę sezamową.',
      allergens: ['sezam'],
    },
    {
      name: 'Naleśniki (sobota i niedziela)',
      detail: 'Z dżemem albo twarogiem, smażone po zamówieniu.',
      allergens: ['gluten (pszenica)', 'jaja', 'mleko'],
    },
    {
      name: 'Owoce i warzywa',
      detail: 'Świeże owoce sezonowe, pomidory, ogórki, rzodkiewka, kiszone ogórki.',
      allergens: [],
    },
    {
      name: 'Napoje',
      detail: 'Kawa, herbata, sok pomarańczowy wyciskany, mleko krowie i napój sojowy.',
      allergens: ['mleko', 'soja'],
    },
  ],
  allergenNote:
    'Alergeny podajemy dla potraw w takiej postaci, w jakiej trafiają na stół. Kuchnia pracuje na wspólnych powierzchniach, więc ślady innych alergenów są możliwe. Pełną kartę składników ma obsługa sali: pytaj bez skrępowania.',
  dietHeading: 'Dieta i alergie',
  diet: [
    {
      title: 'Bez glutenu',
      text: 'Pieczywo bezglutenowe przygotujemy, jeśli napiszesz do recepcji dzień wcześniej. Płatki owsiane i granola zawierają gluten.',
    },
    {
      title: 'Bez laktozy i roślinnie',
      text: 'Do kawy jest napój sojowy. Hummus, owoce, warzywa i pieczywo bez dodatku mleka są codziennie, ale skład pieczywa sprawdzaj z obsługą.',
    },
    {
      title: 'Śniadanie do pokoju',
      text: 'Wcześniej niż o 7:30 nie wydamy śniadania, ale zapakujemy je na wynos, jeśli zamówisz je dzień wcześniej w recepcji.',
    },
  ],
  listHeading: 'Czternaście alergenów',
  listLead:
    'Tyle ich wymienia rozporządzenie UE nr 1169/2011. O każdym z nich masz prawo zapytać w sali śniadaniowej.',
  allergenList: [
    'zboża zawierające gluten (pszenica, żyto, jęczmień, owies, orkisz, kamut)',
    'skorupiaki',
    'jaja',
    'ryby',
    'orzeszki ziemne (arachidowe)',
    'soja',
    'mleko (z laktozą)',
    'orzechy (migdały, orzechy laskowe, włoskie, nerkowca, pekan, brazylijskie, pistacje, makadamia)',
    'seler',
    'gorczyca',
    'nasiona sezamu',
    'dwutlenek siarki i siarczyny (powyżej 10 mg na kilogram lub litr)',
    'łubin',
    'mięczaki',
  ],
  book: 'Zarezerwuj pobyt ze śniadaniem',
  call: `Pytania o dietę: ${hotel.phone}`,
};

const en: BreakfastText = {
  title: 'Breakfast: hours, price and allergens | Przęsło',
  description:
    'Breakfast at Przęsło: hours, a price of PLN 55 per person per night, a full allergen table and the list of fourteen allergens from EU rules.',
  heading: 'Breakfast',
  lead: 'One long table in the ground floor room, food on platters and coffee from a pressure machine. You sit where there is room and take as much as you will eat.',
  hoursHeading: 'Hours and price',
  hours: [
    {
      label: 'Monday to Friday',
      value: `${hotel.breakfastWeekdayFrom}-${hotel.breakfastWeekdayTo}`,
    },
    {
      label: 'Saturday and Sunday',
      value: `${hotel.breakfastWeekendFrom}-${hotel.breakfastWeekendTo}`,
    },
  ],
  priceLine: 'PLN 55 per person per night',
  priceNote:
    'You add breakfast when booking, or later on the My booking page. Children under six eat free. In the Weekend by the Oder package breakfasts are already in the price.',
  tableHeading: 'What is on the table',
  tableLead:
    'The offer changes with the seasons, but the base stays the same. Below is what we serve every day, with the allergens.',
  caption: 'Breakfast at Przęsło and the allergens in each dish',
  columns: { item: 'Item', contains: 'What it is', allergens: 'Allergens' },
  noAllergens: 'none',
  items: [
    {
      name: 'Bread',
      detail: 'Wheat and rye bread, rolls and croissants from the bakery on the next street.',
      allergens: ['gluten (wheat, rye)', 'milk', 'eggs', 'sesame'],
    },
    {
      name: 'Eggs',
      detail: 'Soft-boiled, and scrambled in butter, made as you go.',
      allergens: ['eggs', 'milk'],
    },
    {
      name: 'Cheese and curd',
      detail: 'Two hard cheeses, white cheese and curd with chives.',
      allergens: ['milk'],
    },
    {
      name: 'Cold cuts and pâté',
      detail: 'Ham, loin, sausage and house pâté.',
      allergens: ['celery', 'mustard'],
    },
    {
      name: 'Fish',
      detail: 'Cold-smoked salmon and herring in oil with onion.',
      allergens: ['fish'],
    },
    {
      name: 'Porridge',
      detail: 'Made with milk, with fruit and toasted nuts to choose from.',
      allergens: ['gluten (oats)', 'milk', 'nuts (hazelnuts, walnuts)'],
    },
    {
      name: 'Yoghurt with granola',
      detail: 'Plain yoghurt, oat granola with sesame.',
      allergens: ['milk', 'gluten (oats)', 'sesame', 'nuts (hazelnuts)'],
    },
    {
      name: 'Hummus',
      detail: 'Chickpeas with sesame paste.',
      allergens: ['sesame'],
    },
    {
      name: 'Pancakes (Saturday and Sunday)',
      detail: 'With jam or curd, fried to order.',
      allergens: ['gluten (wheat)', 'eggs', 'milk'],
    },
    {
      name: 'Fruit and vegetables',
      detail: 'Fresh seasonal fruit, tomatoes, cucumbers, radishes, pickled cucumbers.',
      allergens: [],
    },
    {
      name: 'Drinks',
      detail: 'Coffee, tea, freshly squeezed orange juice, cow milk and soy drink.',
      allergens: ['milk', 'soy'],
    },
  ],
  allergenNote:
    'We list allergens for dishes as they reach the table. The kitchen shares work surfaces, so traces of other allergens are possible. The dining room staff hold the full ingredient file: ask freely.',
  dietHeading: 'Diet and allergies',
  diet: [
    {
      title: 'Gluten free',
      text: 'We prepare gluten-free bread if you write to reception the day before. Oats and granola contain gluten.',
    },
    {
      title: 'Lactose free and plant-based',
      text: 'There is a soy drink for coffee. Hummus, fruit, vegetables and bread without added milk are there every day, but check the bread with the staff.',
    },
    {
      title: 'Breakfast to go',
      text: 'We do not serve before 7:30, but we pack breakfast to take away if you order it at reception the day before.',
    },
  ],
  listHeading: 'Fourteen allergens',
  listLead:
    'That is how many EU regulation no. 1169/2011 names. You have the right to ask about each of them in the breakfast room.',
  allergenList: [
    'cereals containing gluten (wheat, rye, barley, oats, spelt, kamut)',
    'crustaceans',
    'eggs',
    'fish',
    'peanuts',
    'soybeans',
    'milk (including lactose)',
    'nuts (almonds, hazelnuts, walnuts, cashews, pecans, Brazil nuts, pistachios, macadamia)',
    'celery',
    'mustard',
    'sesame seeds',
    'sulphur dioxide and sulphites (above 10 mg per kilogram or litre)',
    'lupin',
    'molluscs',
  ],
  book: 'Book a stay with breakfast',
  call: `Diet questions: ${hotel.phone}`,
};

export const breakfastText: Record<Lang, BreakfastText> = { pl: tieDeep(pl), en: tieDeep(en) };
