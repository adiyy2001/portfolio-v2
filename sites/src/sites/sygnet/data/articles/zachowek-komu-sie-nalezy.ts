import type { Article } from './types';

export const zachowekKomuSieNalezy: Article = {
  slug: 'zachowek-komu-sie-nalezy',
  title: 'Zachowek: komu się należy, ile wynosi i do kiedy można go żądać',
  metaTitle: 'Zachowek: komu się należy i ile wynosi',
  description:
    'Zachowek to pieniądze należne najbliższym zmarłego mimo testamentu. Wyjaśniamy, kto może go żądać, jak liczy się kwotę, co z darowiznami i jaki jest termin.',
  lead: 'Zachowek to pieniądze, które należą się najbliższym zmarłego, nawet gdy testament zostawił im mniej albo nic. Wyjaśniamy, kto może o nie wystąpić, jak liczy się kwotę i w jakim terminie.',
  published: '2026-11-05',
  authorSlug: 'anna-wierzbicka',
  areaSlug: 'spadki',
  blocks: [
    {
      type: 'note',
      title: 'Stan prawny: listopad 2026',
      text: 'Tekst jest ogólną informacją o przepisach Kodeksu cywilnego i nie zastępuje porady w konkretnej sprawie. O wyniku decydują dokumenty i daty, których tu nie znamy.',
    },
    { type: 'h2', text: 'Czym jest zachowek' },
    {
      type: 'p',
      text: 'Zachowek to roszczenie o pieniądze. Uprawniony nie dostaje części domu ani działki, tylko może żądać zapłaty od osoby, która odziedziczyła majątek. Ustawa chroni w ten sposób najbliższych: zmarły może rozporządzić majątkiem w testamencie, ale nie zawsze dowolnie.',
    },
    {
      type: 'p',
      text: 'O zachowek mogą się ubiegać dzieci zmarłego, jego małżonek i rodzice, ale tylko ci z nich, którzy dziedziczyliby po nim z ustawy, gdyby nie było testamentu. Rodzice zmarłego dziedziczą z ustawy tylko wtedy, gdy nie zostawił dzieci, więc tylko wtedy mogą żądać zachowku. Rodzeństwu zachowek nie przysługuje.',
    },
    { type: 'h2', text: 'Ile wynosi zachowek' },
    {
      type: 'p',
      text: 'Punktem wyjścia jest udział, jaki dana osoba dostałaby, gdyby dziedziczyła z ustawy. Zachowek to połowa tego udziału. Gdy uprawniony jest małoletni albo trwale niezdolny do pracy, ustawa zwiększa go do dwóch trzecich.',
    },
    {
      type: 'p',
      text: 'Weźmy wdowca z dwojgiem dzieci. W testamencie zapisał całe mieszkanie o wartości 600 000 zł jednemu z nich. Przy dziedziczeniu z ustawy każde dziecko miałoby połowę, czyli 300 000 zł. Drugie dziecko może więc żądać zachowku od brata albo siostry w wysokości:',
    },
    {
      type: 'table',
      caption: 'Przykład liczenia zachowku dla drugiego dziecka',
      head: ['Sytuacja uprawnionego', 'Ułamek udziału', 'Zachowek'],
      rows: [
        ['Dorosłe dziecko, zdolne do pracy', '1/2', '150 000 zł'],
        ['Dziecko małoletnie albo trwale niezdolne do pracy', '2/3', '200 000 zł'],
      ],
    },
    {
      type: 'p',
      text: 'Przykład jest uproszczony. Od wartości majątku odejmuje się długi zmarłego, a do niej dolicza się niektóre darowizny. Dopiero z tak ustalonej kwoty liczy się udział.',
    },
    { type: 'h2', text: 'Darowizny też się liczą' },
    {
      type: 'p',
      text: 'Ustawa nie pozwala ominąć zachowku przez rozdanie majątku za życia. Do wartości, od której liczy się zachowek, dolicza się darowizny, które zmarły zrobił przed śmiercią. Są od tego wyjątki: drobne darowizny, jakie zwyczajowo się robi, nie są doliczane. Nie dolicza się też darowizn dla osób, które nie dziedziczą i nie mają prawa do zachowku, jeśli od darowizny do otwarcia spadku minęło ponad dziesięć lat.',
    },
    {
      type: 'p',
      text: 'Darowizny dla spadkobierców i dla osób uprawnionych do zachowku dolicza się niezależnie od tego, ile lat temu je zrobiono. Wartość liczy się według stanu z dnia darowizny, ale według cen z chwili ustalania zachowku. Dom podarowany dwadzieścia lat temu liczy się więc po dzisiejszej cenie, a nie po tej z dnia aktu.',
    },
    { type: 'h2', text: 'Kto płaci zachowek' },
    {
      type: 'p',
      text: 'Płaci spadkobierca, czyli osoba, która odziedziczyła majątek. Gdy nie może zapłacić albo jego część spadku nie wystarcza, uprawniony może żądać brakującej kwoty od osoby, która dostała od zmarłego darowiznę doliczoną do spadku. Jeśli taki obdarowany sam ma prawo do zachowku, odpowiada tylko do wysokości nadwyżki ponad własny zachowek.',
    },
    {
      type: 'p',
      text: 'Wiele spraw kończy się na rozmowie i pisemnym wezwaniu do zapłaty. Jeśli to nie wystarczy, uprawniony składa pozew do sądu. Gdy zasądzona kwota przekracza możliwości zobowiązanego, sąd może w szczególnie uzasadnionych wypadkach rozłożyć ją na raty.',
    },
    { type: 'h2', text: 'Termin na wystąpienie z żądaniem' },
    {
      type: 'p',
      text: 'Roszczenie o zachowek przedawnia się z upływem pięciu lat od ogłoszenia testamentu. Upływ terminu nie wymazuje roszczenia, ale zobowiązany może odmówić zapłaty, jeśli się na niego powoła, i sąd wtedy powództwa nie uwzględni. W innych sytuacjach termin liczy się od innego dnia, dlatego datę zawsze sprawdzamy w konkretnej sprawie, na podstawie dokumentów.',
    },
    { type: 'h2', text: 'Wydziedziczenie' },
    {
      type: 'p',
      text: 'Zmarły może pozbawić zachowku dziecko, małżonka albo rodzica, ale tylko w testamencie i tylko z powodów, które wymienia ustawa. Jednym z nich jest uporczywe niedopełnianie obowiązków rodzinnych wobec zmarłego. Samo to, że relacje były chłodne albo że dziecko wyprowadziło się za granicę, nie wystarcza.',
    },
    {
      type: 'p',
      text: 'Gdy testament wydziedzicza, a uprawniony uważa, że powód nie istniał, spór rozstrzyga sąd. To zwykle najtrudniejsze sprawy o zachowek, bo dowody dotyczą wielu lat życia rodziny.',
    },
    { type: 'h2', text: 'Co zrobić na początku' },
    {
      type: 'ol',
      items: [
        'Ustal datę ogłoszenia testamentu i policz pięć lat.',
        'Zbierz akt zgonu, testament i wszystko, co wiesz o darowiznach zmarłego: akty notarialne, przelewy, informacje od rodziny.',
        'Ustal, co zmarły zostawił, i oszacuj wartość majątku. Przy nieruchomościach zwykle potrzebna jest wycena rzeczoznawcy.',
        'Nie podpisuj zrzeczenia się zachowku ani ugody, dopóki nie znasz wartości spadku i darowizn.',
        'Przed pozwem wyślij pisemne wezwanie do zapłaty z terminem na odpowiedź.',
      ],
    },
    {
      type: 'p',
      text: 'Sprawy o zachowek prowadzimy w ramach [spraw spadkowych](/sygnet/specjalizacje/spadki/). Jak rozliczamy ich koszt, opisaliśmy na stronie [honorarium](/sygnet/honorarium/). Jeśli nie masz pewności, czy termin już minął, zadzwoń pod numer kancelarii albo napisz przez [formularz](/sygnet/kontakt/).',
    },
  ],
};
