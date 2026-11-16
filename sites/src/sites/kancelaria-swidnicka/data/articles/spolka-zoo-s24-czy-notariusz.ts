import type { Article } from './types';

export const spolkaZooS24CzyNotariusz: Article = {
  slug: 'spolka-zoo-s24-czy-notariusz',
  title: 'Spółka z o.o.: założyć ją przez internet czy u notariusza',
  metaTitle: 'Spółka z o.o.: S24 czy notariusz',
  description:
    'Dwa sposoby założenia spółki z ograniczoną odpowiedzialnością: system S24 i umowa u notariusza. Co je różni, ile kosztują opłaty sądowe i kiedy warto wybrać notariusza.',
  lead: 'Spółkę z ograniczoną odpowiedzialnością można założyć z domu, w kilka dni, albo u notariusza z umową napisaną od zera. Opisujemy, czym się różnią te drogi i od czego zależy wybór.',
  published: '2026-11-09',
  authorSlug: 'marek-zawada',
  areaSlug: 'spolki',
  blocks: [
    {
      type: 'note',
      title: 'Stan prawny: listopad 2026',
      text: 'Tekst jest ogólną informacją o Kodeksie spółek handlowych i rejestracji spółek. Opłaty podajemy według stanu z listopada 2026 roku. Sprawdź aktualną kwotę przed zapłatą.',
    },
    { type: 'h2', text: 'Dwie drogi do tej samej spółki' },
    {
      type: 'p',
      text: 'Efekt jest taki sam: spółka z ograniczoną odpowiedzialnością wpisana do rejestru przedsiębiorców w Krajowym Rejestrze Sądowym (KRS). Różni się droga. Pierwsza prowadzi przez internetowy system S24 Ministerstwa Sprawiedliwości. Wspólnicy wypełniają formularz, system tworzy umowę spółki z gotowego wzorca, a wspólnicy podpisują ją elektronicznie. Druga prowadzi do notariusza: umowa ma formę aktu notarialnego, a wniosek o wpis składa się osobno.',
    },
    {
      type: 'p',
      text: 'Wspólne dla obu dróg jest to, co ustawa wymaga od każdej takiej spółki. Kapitał zakładowy nie może być niższy niż 5 000 zł, a wartość nominalna jednego udziału niższa niż 50 zł. Spółka powstaje dopiero z dniem wpisu do rejestru.',
    },
    { type: 'h2', text: 'Co różni S24 od notariusza' },
    {
      type: 'table',
      caption: 'S24 i umowa u notariusza obok siebie',
      head: ['Cecha', 'S24', 'Notariusz'],
      rows: [
        ['Treść umowy', 'Gotowy wzorzec', 'Dowolna, pisana pod wspólników'],
        ['Wkłady do spółki', 'Tylko pieniężne', 'Pieniężne i rzeczowe'],
        ['Opłata sądowa za wpis', '250 zł', '500 zł'],
        ['Koszt notariusza', 'Brak', 'Taksa notarialna'],
        ['Podpis', 'Elektroniczny, z domu', 'U notariusza, osobiście'],
      ],
    },
    {
      type: 'p',
      text: 'Opłatę sądową przy S24 uiszcza się w systemie. Przy umowie u notariusza opłata za wpis jest wyższa, a do niej dochodzi taksa notarialna, której wysokość zależy od kapitału. W obu drogach płaci się też podatek od czynności cywilnoprawnych od kapitału zakładowego.',
    },
    { type: 'h2', text: 'Kiedy wystarczy S24' },
    {
      type: 'p',
      text: 'S24 dobrze sprawdza się, gdy spółkę zakłada jedna osoba albo kilku wspólników, którzy wnoszą pieniądze i nie mają żadnych szczególnych ustaleń. Wzorzec zawiera standardowe zapisy o zarządzie, zgromadzeniu wspólników i podziale zysku. Wpis trwa zwykle kilka dni roboczych, więc to najszybsza droga, jeśli spółka ma ruszyć od razu.',
    },
    { type: 'h2', text: 'Kiedy lepszy jest notariusz' },
    {
      type: 'p',
      text: 'Umowa u notariusza jest potrzebna, gdy wzorzec nie mieści tego, co ustalili wspólnicy. Najczęstsze przykłady:',
    },
    {
      type: 'ul',
      items: [
        'Jeden ze wspólników wnosi do spółki komputer, samochód, maszynę albo prawa do programu zamiast pieniędzy.',
        'Wspólnicy chcą zapisać, co dzieje się z udziałami, gdy ktoś chce wyjść: prawo pierwszeństwa, wycenę, zakaz sprzedaży obcym.',
        'Udziały mają dawać nierówne prawa, na przykład inną liczbę głosów niż wynika z wkładu.',
        'Zarząd ma działać według szczegółowych zasad: kto podpisuje umowy powyżej jakiej kwoty, kiedy potrzebna jest zgoda wspólników.',
      ],
    },
    {
      type: 'p',
      text: 'Przy dwóch wspólnikach z podobnymi udziałami brak takich zapisów często wychodzi dopiero w sporze, kiedy zmiana umowy wymaga zgody drugiej strony. Dlatego lepiej ustalić je na początku.',
    },
    { type: 'h2', text: 'Umowa wspólników obok umowy spółki' },
    {
      type: 'p',
      text: 'Umowa spółki jest jawna i wpisana w rejestr. Nie wszystko, co wspólnicy chcą ustalić, powinno tam trafić. Zasady wyjścia ze spółki, wynagrodzenie wspólnika pracującego w firmie albo plan na wypadek impasu zwykle spisuje się w osobnej umowie wspólników, której nikt z zewnątrz nie widzi. Tę umowę można podpisać także wtedy, gdy spółkę założyliście przez S24.',
    },
    { type: 'h2', text: 'Co zrobić przed wpisem' },
    {
      type: 'p',
      text: 'Do dnia wpisu spółka działa jako spółka w organizacji. Osoby, które w jej imieniu zawierają umowy przed wpisem, mogą odpowiadać za nie osobiście. Dlatego duże zobowiązania, takie jak podpisanie umowy najmu lokalu czy zamówienie towaru, lepiej odłożyć do chwili, gdy spółka ma wpis.',
    },
    {
      type: 'ol',
      items: [
        'Ustalcie wspólników i to, kto ile wnosi do spółki.',
        'Zdecydujcie o siedzibie, nazwie i głównym rodzaju działalności.',
        'Wybierzcie zarząd i sposób reprezentowania spółki: jedna osoba czy dwie.',
        'Zdecydujcie, czy wystarczą wam wkłady pieniężne i standardowe zapisy.',
        'Na tej podstawie wybierzcie S24 albo notariusza.',
      ],
    },
    {
      type: 'p',
      text: 'Jeśli któraś z tych decyzji nie jest jasna, rozwiązanie jej przed rejestracją jest tańsze niż po niej. O tym, jak pracujemy przy spółkach, piszemy w dziale [Spółki](/kancelaria-swidnicka/specjalizacje/spolki/), a o cenach w [honorarium](/kancelaria-swidnicka/honorarium/). Jeśli chcesz omówić konkretną spółkę, napisz przez [formularz](/kancelaria-swidnicka/kontakt/).',
    },
  ],
};
