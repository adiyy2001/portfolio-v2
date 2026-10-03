import type { Lang } from '../data/lang';

const pl = {
  meta: {
    title: 'O nas | Kminek',
    description:
      'Basia gotuje, Tomek prowadzi salę i bar, Ola piecze chleb. Poznaj trzy osoby z bistra Kminek na wrocławskim Nadodrzu, ich zasady kuchni i dostawców.',
  },
  head: {
    title: 'Trzy osoby, jedna kuchnia na Nadodrzu.',
    lead: 'Kminek otworzyliśmy, bo chcieliśmy jeść w miejscu, gdzie polskie jedzenie nie jest ani muzeum, ani żartem. Gotujemy to, co jedliśmy w domach, tylko lżej i z tym, co akurat jest na targu.',
  },
  name: {
    title: 'Dlaczego Kminek?',
    text: [
      'Bo ma go odrobinę prawie wszystko, co w polskiej kuchni dobre: chleb, kapusta, ser, kminkówka po ciężkim obiedzie. Mało go widać, ale jak go zabraknie, od razu wiadomo.',
      'Tak chcemy gotować: bez krzyku, z jednym dobrym składnikiem więcej niż trzeba.',
    ],
  },
  people: {
    title: 'Kto tu gotuje i podaje',
    note: 'Imiona, bo tak do siebie mówimy. Nazwiska nie są nikomu potrzebne do pierogów.',
  },
  rules: {
    title: 'Zasady kuchni',
    items: [
      'Karta ma czternaście dań. Więcej nie zrobimy dobrze.',
      'Kupujemy od ludzi, których znamy po imieniu, i zmieniamy kartę, gdy kończy się ich towar.',
      'Zakwas, smalec, kiszonki i wszystkie sosy robimy sami.',
      'Danie wegańskie nie jest dodatkiem do mięsnego. Ma własną głowę i własne przyprawy.',
      'Alergeny są w karcie przy każdym daniu. Pytania o skład to nie kłopot, tylko część pracy.',
      'Nie wyrzucamy jedzenia. To, co zostaje z targu, idzie w poniedziałek na obiad dla nas.',
    ],
  },
  suppliers: {
    title: 'Skąd bierzemy',
    text: 'Nie podajemy nazw gospodarstw na stronie, bo zmieniają się z sezonem. Tomek opowie o każdym, kiedy zapytasz przy stoliku.',
    rows: [
      { label: 'Warzywa i jabłka', value: 'sad i gospodarstwo pod Trzebnicą' },
      { label: 'Mąka żytnia', value: 'młyn z Opolszczyzny' },
      { label: 'Sery', value: 'mała serowarnia z Sudetów i twaróg ze wsi pod Oławą' },
      { label: 'Mięso', value: 'jeden rzeźnik, zwierzęta z dolnośląskich gospodarstw' },
      { label: 'Śledzie', value: 'z Bałtyku, solone i marynowane u nas' },
      { label: 'Piwo i wino', value: 'małe browary i winnice z Dolnego Śląska' },
    ],
  },
  place: {
    title: 'Nadodrze, parter, bez schodów',
    text: 'Sala ma trzydzieści cztery miejsca, długi stół wspólny pod oknem i bar na sześć krzeseł. Przy barze nie rezerwujemy, zajmujesz miejsce, które jest wolne. Od ulicy jedno wejście na poziomie chodnika.',
  },
  end: {
    title: 'Przyjdź i zobacz, co jest w karcie.',
    text: 'Wtorek, środa, czwartek, piątek, sobota i niedziela, od 12:00 do 22:00.',
    book: 'Zarezerwuj stolik',
    menu: 'Zobacz kartę',
  },
};

const en: typeof pl = {
  meta: {
    title: 'About us | Kminek',
    description:
      'Basia cooks, Tomek runs the floor and the bar, Ola bakes the bread. Meet the three people behind the Kminek bistro in Nadodrze, Wrocław, with their kitchen rules and suppliers.',
  },
  head: {
    title: 'Three people, one kitchen in Nadodrze.',
    lead: 'We opened Kminek because we wanted to eat somewhere that treats Polish food as neither a museum nor a joke. We cook what we ate at home, only lighter, and with whatever the market has that week.',
  },
  name: {
    title: 'Why Kminek?',
    text: [
      'Kminek is caraway. Almost everything good in Polish cooking has a little of it: bread, cabbage, cheese, the liqueur after a heavy lunch. You hardly see it, but you notice at once when it is missing.',
      'That is how we want to cook: quietly, with one good ingredient more than strictly needed.',
    ],
  },
  people: {
    title: 'Who cooks and serves',
    note: 'First names, because that is what we call each other. Nobody needs a surname to get pierogi.',
  },
  rules: {
    title: 'Kitchen rules',
    items: [
      'The menu has fourteen dishes. We cannot do more of them well.',
      'We buy from people we know by first name, and change the menu when their stock runs out.',
      'Sourdough, smalec, pickles and every sauce are made here.',
      'A vegan dish is not an add-on to a meat one. It has its own head and its own spices.',
      'Allergens are on the menu next to every dish. Questions about ingredients are not a bother, they are part of the job.',
      'We do not throw food away. What is left from the market goes into our own Monday lunch.',
    ],
  },
  suppliers: {
    title: 'Where it comes from',
    text: 'We do not name the farms on the website because they change with the season. Tomek will tell you about each one if you ask at the table.',
    rows: [
      { label: 'Vegetables and apples', value: 'an orchard and farm near Trzebnica' },
      { label: 'Rye flour', value: 'a mill in Opole Voivodeship' },
      {
        label: 'Cheese',
        value: 'a small cheese dairy in the Sudetes and curd cheese from a village near Oława',
      },
      { label: 'Meat', value: 'one butcher, animals from Lower Silesian farms' },
      { label: 'Herring', value: 'from the Baltic, salted and pickled here' },
      { label: 'Beer and wine', value: 'small breweries and vineyards from Lower Silesia' },
    ],
  },
  place: {
    title: 'Nadodrze, ground floor, no steps',
    text: 'The room seats thirty-four, with a long shared table under the window and a bar with six stools. We do not reserve the bar, you take a seat that is free. One entrance from the street, at pavement level.',
  },
  end: {
    title: 'Come and see what is on the menu.',
    text: 'Tuesday, Wednesday, Thursday, Friday, Saturday and Sunday, from 12:00 to 22:00.',
    book: 'Book a table',
    menu: 'See the menu',
  },
};

export const aboutCopy: Record<Lang, typeof pl> = { pl, en };
