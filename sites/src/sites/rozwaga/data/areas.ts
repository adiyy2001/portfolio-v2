export interface Situation {
  title: string;
  text: string;
}

export interface Step {
  title: string;
  duration: string;
  text: string;
}

export interface FeeRow {
  service: string;
  netFrom: number;
  per?: string;
}

export interface Area {
  slug: string;
  name: string;
  short: string;
  lead: string;
  metaDescription: string;
  handles: string[];
  situations: Situation[];
  steps: Step[];
  feeIntro: string[];
  feeRows: FeeRow[];
  articleSlugs: string[];
}

export const areas: Area[] = [
  {
    slug: 'prawo-spolek',
    name: 'Prawo spółek',
    short: 'Zakładanie spółek, umowy wspólników, uchwały i spory między wspólnikami.',
    lead: 'Spółka z o.o. dobrze działa wtedy, gdy wspólnicy wiedzą, kto o czym decyduje, kto może sprzedać udziały i co się dzieje, gdy się pokłócą. Zapisujemy to w umowie, zanim ktokolwiek zacznie się kłócić.',
    metaDescription:
      'Prawo spółek we Wrocławiu: umowy spółek z o.o., umowy wspólników, uchwały, zbywanie udziałów i spory między wspólnikami. Stawka 380 zł netto za godzinę.',
    handles: [
      'Zakładanie spółek z o.o. i prostych spółek akcyjnych, w tym przez S24',
      'Umowy spółek i umowy wspólników, także zmiany w już działających spółkach',
      'Uchwały zarządu i zgromadzenia wspólników, protokoły, zatwierdzanie sprawozdań',
      'Sprzedaż i zastaw udziałów, wejście i wyjście wspólnika, umorzenie udziałów',
      'Powołanie i odwołanie zarządu, umowy z członkami zarządu, prokura',
      'Podwyższanie i obniżanie kapitału zakładowego, przekształcenia i łączenia',
      'Wpisy i zmiany w KRS, zgłoszenia do rejestru beneficjentów rzeczywistych',
      'Impas między wspólnikami, wyłączenie wspólnika, rozwiązanie spółki',
    ],
    situations: [
      {
        title: 'Zakładacie spółkę we dwóch lub we trzech',
        text: 'Domyślna umowa z wzorca nie mówi, kto może sprzedać udziały obcemu, co z udziałami po śmierci wspólnika ani jak zakończyć współpracę. Piszemy umowę na waszą sytuację i osobno umowę wspólników, jeśli część ustaleń ma zostać między wami.',
      },
      {
        title: 'Wspólnik chce wyjść albo wejść nowy',
        text: 'Zbycie udziałów wymaga formy pisemnej z notarialnie poświadczonymi podpisami, a umowa spółki często dodaje zgodę spółki. Sprawdzamy, czy sprzedaż jest skuteczna, ustalamy cenę i terminy oraz przygotowujemy dokumenty.',
      },
      {
        title: 'Nikt nie ma większości',
        text: 'Przy podziale 50 na 50 żadna uchwała nie przechodzi, a sąd nie wyłączy wspólnika, bo pozostali nie mają więcej niż połowy kapitału. Szukamy wyjścia w umowie, w negocjacjach albo w ostateczności w sądzie.',
      },
      {
        title: 'Spółka działa, a dokumenty zostały w tyle',
        text: 'Brakuje uchwał o zatwierdzeniu sprawozdania, mandat zarządu wygasł, a w KRS widnieją nieaktualne dane. Porządkujemy to z listą rzeczy do podpisania i terminami.',
      },
    ],
    steps: [
      {
        title: 'Rozmowa',
        duration: 'do 20 minut, bez opłaty',
        text: 'Mówisz, kto jest wspólnikiem, ile ma udziałów i czego potrzebujesz. My mówimy, czy to sprawa dla nas i jakie dokumenty będą potrzebne.',
      },
      {
        title: 'Dokumenty',
        duration: '1 do 2 dni robocze',
        text: 'Dostajemy aktualną umowę spółki, odpis z KRS i uchwały, o których mowa. Czytamy je przed pierwszym spotkaniem, nie na nim.',
      },
      {
        title: 'Wycena',
        duration: 'w ciągu dnia od dokumentów',
        text: 'Pisemnie: zakres, termin i kwota albo przedział godzin. Zaczynamy po Twojej akceptacji.',
      },
      {
        title: 'Praca i podpisy',
        duration: 'zwykle 3 do 10 dni roboczych',
        text: 'Projekty dokumentów dostajesz do uwag. Gdy potrzebny jest notariusz, umawiamy termin i jedziemy z kompletem papierów.',
      },
    ],
    feeIntro: [
      'Stawka godzinowa to 380 zł netto. Przy zadaniach, które da się opisać z góry, podajemy cenę za całość i pilnujemy jej, nawet jeśli praca zajmie dłużej.',
      'Opłaty notarialne, sądowe i skarbowe nie są w naszej cenie. Podajemy je osobno, z kwotami z tabeli, zanim cokolwiek zostanie zapłacone.',
    ],
    feeRows: [
      { service: 'Umowa spółki z o.o. i wniosek do KRS', netFrom: 1800 },
      { service: 'Umowa wspólników', netFrom: 4500 },
      { service: 'Uchwała zgromadzenia wspólników z protokołem', netFrom: 600, per: 'za uchwałę' },
      { service: 'Sprzedaż udziałów: umowa i dokumenty towarzyszące', netFrom: 1500 },
      { service: 'Stała obsługa korporacyjna', netFrom: 1500, per: 'miesięcznie' },
    ],
    articleSlugs: ['wspolnicy-po-polowie'],
  },
  {
    slug: 'umowy',
    name: 'Umowy',
    short: 'Pisanie, czytanie i negocjowanie umów z klientami, dostawcami i wykonawcami.',
    lead: 'Dobrą umowę widać dopiero w sporze: czy jest jasne, kto co miał zrobić, do kiedy i co się dzieje, gdy tego nie zrobi. Piszemy takie umowy i czytamy cudze, zanim je podpiszesz.',
    metaDescription:
      'Umowy dla firm we Wrocławiu: przegląd i negocjowanie umów, umowy z dostawcami i klientami, kary umowne, regulaminy i OWU. Wycena na piśmie przed pracą.',
    handles: [
      'Przegląd umów przed podpisaniem, z listą zmian i uzasadnieniem każdej',
      'Umowy sprzedaży, dostaw, o dzieło, zlecenia i świadczenia usług',
      'Umowy ramowe z dostawcami i odbiorcami, umowy o współpracy',
      'Umowy o zachowaniu poufności, umowy z podwykonawcami i agentami',
      'Kary umowne, zabezpieczenia, terminy płatności i odsetki',
      'Regulaminy sklepów i usług, ogólne warunki umów',
      'Negocjacje z drugą stroną, także z jej prawnikiem',
      'Wzory umów do powtarzalnego użytku w firmie',
    ],
    situations: [
      {
        title: 'Duży klient przysłał swoją umowę',
        text: 'Taka umowa zwykle chroni tego, kto ją napisał. Zaznaczamy zapisy, których nie warto przyjmować, proponujemy własne brzmienie i podpowiadamy, o co warto się spierać, a co odpuścić.',
      },
      {
        title: 'W umowie jest kara umowna',
        text: 'Kara umowna należy się tylko za niewykonanie zobowiązania niepieniężnego, więc kara za spóźnioną płatność nie zadziała. Sprawdzamy, czy zapis wytrzyma w sądzie, i czy ma sens biznesowy.',
      },
      {
        title: 'Zlecasz coś dłuższego na pół roku',
        text: 'Opisujemy etapy, odbiory i płatności tak, żeby żaden etap nie zależał od dobrej woli drugiej strony. Do tego tryb zmian zakresu, bo zakres prawie zawsze się zmienia.',
      },
      {
        title: 'Masz ten sam rodzaj umowy dziesiąty raz',
        text: 'Robimy z niej wzór z miejscami do uzupełnienia i krótką instrukcją dla osoby, która będzie go używać. Dzięki temu nie płacisz za ten sam tekst co miesiąc.',
      },
    ],
    steps: [
      {
        title: 'Rozmowa',
        duration: 'do 20 minut, bez opłaty',
        text: 'Opowiadasz, co ma wynikać z umowy: co kupujesz albo sprzedajesz, w jakim terminie i za ile. Mówimy, czego może brakować.',
      },
      {
        title: 'Lektura i uwagi',
        duration: '1 do 3 dni robocze',
        text: 'Czytamy umowę w całości, z załącznikami i wzorami, do których odsyła. Dostajesz uwagi w dokumencie: zmiany do wprowadzenia i powody.',
      },
      {
        title: 'Rozmowa o uwagach',
        duration: '30 do 60 minut',
        text: 'Przechodzimy przez zmiany i ustalamy, które są konieczne, a które tylko pożądane. To Ty decydujesz, o co walczymy.',
      },
      {
        title: 'Negocjacje i podpis',
        duration: 'według drugiej strony',
        text: 'Jeśli trzeba, prowadzimy korespondencję z drugą stroną. Przed podpisem czytamy wersję końcową jeszcze raz.',
      },
    ],
    feeIntro: [
      'Przegląd umowy wyceniamy po obejrzeniu tekstu, nie na podstawie liczby stron z opisu. Kwota zależy od długości, od liczby załączników i od tego, ile zostaje do negocjacji.',
      'Dla firm, które podpisują umowy co tydzień, mamy abonament z limitem godzin. Niewykorzystane godziny przechodzą na następny miesiąc.',
    ],
    feeRows: [
      { service: 'Przegląd umowy do 10 stron', netFrom: 900 },
      { service: 'Napisanie umowy od początku', netFrom: 1500 },
      { service: 'Regulamin sklepu internetowego', netFrom: 1800 },
      { service: 'Wzór umowy z instrukcją', netFrom: 2200 },
      { service: 'Abonament na umowy, do 6 godzin', netFrom: 2000, per: 'miesięcznie' },
    ],
    articleSlugs: ['najem-lokalu-na-firme'],
  },
  {
    slug: 'spory-sadowe',
    name: 'Spory sądowe',
    short: 'Windykacja należności, pozwy, odpowiedzi na pozwy i reprezentacja przed sądem.',
    lead: 'Większość sporów o pieniądze da się zakończyć przed sądem albo zaraz po pierwszym piśmie. Zaczynamy od najtańszej drogi, która ma szansę zadziałać, i mówimy z góry, ile każda następna kosztuje.',
    metaDescription:
      'Spory sądowe dla firm we Wrocławiu: windykacja faktur, nakaz zapłaty, pozwy i odpowiedzi na pozew, postępowanie przed sądem. Koszty podajemy z góry.',
    handles: [
      'Wezwania do zapłaty i negocjacje ugodowe',
      'Pozwy o zapłatę, w tym w postępowaniu nakazowym i upominawczym',
      'Odpowiedzi na pozew, sprzeciwy od nakazów zapłaty i zarzuty',
      'Spory z kontrahentami o jakość, terminy i kary umowne',
      'Spory między wspólnikami i z członkami zarządu',
      'Zabezpieczenie roszczeń, wniosek o zabezpieczenie',
      'Egzekucja komornicza, postępowanie klauzulowe',
      'Reprezentacja przed sądami powszechnymi i polubownymi',
    ],
    situations: [
      {
        title: 'Klient nie płaci faktury',
        text: 'Odsetki za opóźnienie w transakcjach handlowych i rekompensata 40, 70 lub 100 euro należą się bez wezwania. Wystawiamy wezwanie, a jeśli nie pomoże, składamy pozew, najczęściej w postępowaniu nakazowym.',
      },
      {
        title: 'Dostałeś nakaz zapłaty',
        text: 'Termin na reakcję jest krótki i wskazany w samym nakazie, zwykle dwa tygodnie. Sprawdzamy, czy jest co kwestionować, i piszemy sprzeciw albo zarzuty. Bez reakcji nakaz ma moc prawomocnego wyroku.',
      },
      {
        title: 'Kontrahent twierdzi, że usługa była wadliwa',
        text: 'Zbieramy korespondencję, protokoły i zlecenia, ustalamy, co da się udowodnić, i dopiero wtedy wybieramy, czy się porozumiewać, czy iść do sądu.',
      },
      {
        title: 'Zbliża się przedawnienie',
        text: 'Roszczenia związane z prowadzeniem działalności przedawniają się po trzech latach, a termin kończy się ostatniego dnia roku kalendarzowego. Przerywa go dopiero czynność przed sądem, nie samo wezwanie.',
      },
    ],
    steps: [
      {
        title: 'Rozmowa',
        duration: 'do 20 minut, bez opłaty',
        text: 'Podajesz kwotę, dłużnika, daty faktur i to, co już zrobiłeś. My mówimy, czy sprawa nadaje się do sądu i jakie dowody będą potrzebne.',
      },
      {
        title: 'Analiza dokumentów',
        duration: '2 do 3 dni robocze',
        text: 'Umowa, zlecenia, faktury, korespondencja i dowody doręczenia. Wynik to krótka notatka: szanse, ryzyka, koszty sądowe i nasze honorarium.',
      },
      {
        title: 'Wezwanie albo pozew',
        duration: '3 do 7 dni roboczych',
        text: 'Zaczynamy od wezwania, o ile nie ma powodu go pomijać. Pozew składamy tak, by sąd mógł wydać nakaz bez rozprawy.',
      },
      {
        title: 'Postępowanie',
        duration: 'od kilku tygodni do kilku lat',
        text: 'Po każdym piśmie z sądu dostajesz krótką wiadomość: co przyszło, co oznacza i co robimy dalej. Przed rozprawą omawiamy plan.',
      },
    ],
    feeIntro: [
      'Przy sporach nie obiecujemy wyniku i nie wyceniamy wysoko spraw, które nie rokują. Przed pozwem dostajesz na piśmie ocenę szans i sumę kosztów: opłatę sądową, nasze honorarium i ryzyko zwrotu kosztów przeciwnika.',
      'Sąd może zasądzić zwrot części kosztów od strony, która przegrała, ale nigdy całości honorarium. Nie liczymy na to w wycenie.',
    ],
    feeRows: [
      { service: 'Wezwanie do zapłaty', netFrom: 350 },
      { service: 'Pozew o zapłatę w postępowaniu nakazowym', netFrom: 1800 },
      { service: 'Sprzeciw od nakazu zapłaty albo zarzuty', netFrom: 1500 },
      { service: 'Reprezentacja na rozprawie w Wrocławiu', netFrom: 900, per: 'za rozprawę' },
      { service: 'Wniosek o zabezpieczenie roszczenia', netFrom: 1200 },
    ],
    articleSlugs: ['klient-nie-placi-faktury'],
  },
  {
    slug: 'nieruchomosci',
    name: 'Nieruchomości',
    short: 'Najem lokali na firmę, zakup i sprzedaż nieruchomości, umowy przedwstępne.',
    lead: 'Dla firmy nieruchomość to zwykle lokal, który wynajmuje, i czasem budynek, który kupuje. W obu przypadkach najwięcej kosztuje to, czego nie sprawdzono przed podpisem.',
    metaDescription:
      'Nieruchomości dla firm we Wrocławiu: umowy najmu lokalu, sprawdzenie księgi wieczystej, umowy przedwstępne, spory z wynajmującymi. Stawka 380 zł netto.',
    handles: [
      'Umowy najmu lokali użytkowych: biura, sklepy, magazyny, lokale gastronomiczne',
      'Sprawdzenie stanu prawnego nieruchomości w księdze wieczystej',
      'Umowy przedwstępne kupna i sprzedaży, zadatek i zaliczka',
      'Zakup lokalu lub budynku na firmę, kontakt z notariuszem',
      'Wypowiedzenie najmu, podwyżki czynszu, zwrot lokalu i rozliczenie nakładów',
      'Podnajem i przeniesienie umowy najmu przy sprzedaży firmy',
      'Umowy z deweloperami i wykonawcami robót',
      'Spory z wynajmującymi i najemcami, w tym o kaucję',
    ],
    situations: [
      {
        title: 'Znalazłeś lokal i dostałeś projekt umowy',
        text: 'Sprawdzamy, kto podpisuje po stronie wynajmującego i czy jest właścicielem, jaki jest czas najmu, kiedy można wypowiedzieć i jak może rosnąć czynsz. Do tego protokół zdawczo-odbiorczy, który chroni Cię na koniec.',
      },
      {
        title: 'Wynajmujący chce podnieść czynsz',
        text: 'Ustawa pozwala podnieść czynsz za lokal przez wypowiedzenie jego dotychczasowej wysokości najpóźniej na miesiąc naprzód. Sprawdzamy, co mówi umowa: czy wskazuje wskaźnik, termin i limit, i czy podwyżka ma w niej podstawę.',
      },
      {
        title: 'Kupujesz biuro albo lokal usługowy',
        text: 'Czytamy księgę wieczystą: właściciel, hipoteki, służebności, roszczenia, wpisane ostrzeżenia. Do tego umowa przedwstępna z zadatkiem i terminem, który nie wygaśnie przed decyzją banku.',
      },
      {
        title: 'Wyprowadzasz się, a wynajmujący żąda pieniędzy',
        text: 'Roszczenia o uszkodzenia lokalu przedawniają się z upływem roku od zwrotu, więc ważne jest, kiedy zdałeś klucze i co spisano w protokole. Rozliczamy nakłady i kaucję.',
      },
    ],
    steps: [
      {
        title: 'Rozmowa',
        duration: 'do 20 minut, bez opłaty',
        text: 'Opowiadasz, jaki lokal i na jak długo. Dostajemy projekt umowy albo dane nieruchomości.',
      },
      {
        title: 'Sprawdzenie',
        duration: '2 do 4 dni robocze',
        text: 'Księga wieczysta, uprawnienia osoby podpisującej, umowa, załączniki i regulamin budynku, jeśli jest.',
      },
      {
        title: 'Uwagi i negocjacje',
        duration: '1 do 2 tygodni',
        text: 'Lista zmian do umowy z uzasadnieniem. Negocjacje prowadzimy z wynajmującym lub jego pełnomocnikiem.',
      },
      {
        title: 'Podpis i odbiór lokalu',
        duration: 'w dniu podpisania',
        text: 'Możemy być przy podpisaniu i odbiorze. Protokół z listą usterek i stanem liczników piszemy razem.',
      },
    ],
    feeIntro: [
      'Umowy najmu i kupna wyceniamy na podstawie projektu, który dostaniemy, a nie z góry według stron. Cena obejmuje jedną rundę negocjacji, każda następna to godziny po 380 zł netto.',
      'Opłaty za księgę wieczystą, taksa notarialna i podatek od czynności cywilnoprawnych nie są w naszej cenie, ale podajemy ich orientacyjną wysokość przed podpisem.',
    ],
    feeRows: [
      { service: 'Analiza umowy najmu lokalu', netFrom: 1200 },
      { service: 'Sprawdzenie księgi wieczystej i stanu prawnego', netFrom: 1000 },
      { service: 'Umowa przedwstępna kupna lub sprzedaży', netFrom: 1500 },
      { service: 'Wypowiedzenie najmu i rozliczenie lokalu', netFrom: 900 },
      { service: 'Obecność przy odbiorze lokalu', netFrom: 600 },
    ],
    articleSlugs: ['najem-lokalu-na-firme'],
  },
];

export const areaBySlug = (slug: string): Area | undefined =>
  areas.find(area => area.slug === slug);
