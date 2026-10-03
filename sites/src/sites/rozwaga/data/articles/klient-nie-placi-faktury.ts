import type { Article } from './types';

export const klientNiePlaciFaktury: Article = {
  slug: 'klient-nie-placi-faktury',
  title: 'Klient nie płaci faktury: odsetki, rekompensata i nakaz zapłaty krok po kroku',
  metaTitle: 'Klient nie płaci faktury: odsetki i nakaz zapłaty',
  description:
    'Co należy się wierzycielowi bez wezwania, ile kosztuje pozew w postępowaniu nakazowym i kiedy przedawniają się roszczenia firmy. Stan na październik 2026.',
  lead: 'Termin płatności minął, a pieniędzy nie ma. Co należy ci się bez żadnego pisma, jak napisać wezwanie, ile kosztuje sąd i kiedy jest już za późno.',
  published: '2026-09-25',
  authorSlug: 'aneta-wojtynska',
  areaSlug: 'spory-sadowe',
  blocks: [
    {
      type: 'p',
      text: 'Faktura została wystawiona, usługa wykonana, a klient milczy. Większość właścicieli firm czeka wtedy dłużej, niż powinna, bo nie chce psuć relacji. Tymczasem prawo daje wierzycielowi w sporach między firmami więcej, niż się wydaje, i część tych uprawnień działa bez żadnego pisma.',
    },
    {
      type: 'note',
      title: 'W skrócie',
      text: 'Od dnia wymagalności należą ci odsetki za opóźnienie w transakcjach handlowych i rekompensata 40, 70 albo 100 euro, bez wezwania. Gdy dłużnik nie płaci, możesz złożyć pozew w postępowaniu nakazowym i zapłacić jedną czwartą opłaty sądowej. Roszczenia związane z działalnością przedawniają się po trzech latach.',
    },
    { type: 'h2', text: 'Co należy się bez żadnego wezwania' },
    {
      type: 'p',
      text: 'Ustawa o przeciwdziałaniu nadmiernym opóźnieniom w transakcjach handlowych dotyczy umów, w których jedna firma odpłatnie dostarcza towar albo świadczy usługę drugiej w związku z prowadzoną działalnością. Nie obejmuje konsumentów. Jeśli wykonałeś swoje świadczenie i nie dostałeś zapłaty w terminie z umowy, przysługują ci dwie rzeczy (art. 7 i 10 ustawy).',
    },
    {
      type: 'p',
      text: 'Pierwsza to odsetki ustawowe za opóźnienie w transakcjach handlowych: stopa referencyjna NBP plus dziesięć punktów procentowych. Naliczają się od dnia wymagalności do dnia zapłaty. Aktualną stopę znajdziesz na stronie Narodowego Banku Polskiego.',
    },
    {
      type: 'p',
      text: 'Druga to rekompensata za koszty odzyskiwania należności, w złotych według średniego kursu euro z ostatniego dnia roboczego miesiąca poprzedzającego miesiąc, w którym płatność stała się wymagalna:',
    },
    {
      type: 'table',
      caption: 'Rekompensata za koszty odzyskiwania należności',
      head: ['Wartość świadczenia', 'Rekompensata'],
      rows: [
        ['do 5 000 zł', '40 euro'],
        ['powyżej 5 000 zł, poniżej 50 000 zł', '70 euro'],
        ['50 000 zł i więcej', '100 euro'],
      ],
    },
    {
      type: 'p',
      text: 'Rekompensata przysługuje od transakcji handlowej, a nie od każdego pisma, które wyślesz. Jeśli koszty odzyskiwania były wyższe, na przykład zapłaciłeś za opinię prawną, możesz żądać dodatkowo ich zwrotu w uzasadnionej wysokości. Nie możesz natomiast przenieść prawa do samej rekompensaty na inną osobę.',
    },
    { type: 'h2', text: 'Ile może wynosić termin płatności' },
    {
      type: 'p',
      text: 'Termin zapłaty w umowie nie może przekraczać 60 dni od doręczenia faktury, chyba że strony wyraźnie ustaliły inaczej i nie jest to rażąco nieuczciwe wobec wierzyciela. Gdy dłużnikiem jest duża firma, a wierzycielem mikro-, mała albo średnia, limit 60 dni obowiązuje bez wyjątku (art. 7 ust. 2 i 2a). Przy podmiotach publicznych terminy są krótsze: zwykle 30 dni.',
    },
    {
      type: 'p',
      text: 'Strony nie mogą też umówić się, kiedy faktura „została doręczona”. Dlatego warto wysyłać fakturę tak, by dało się udowodnić dzień, w którym dłużnik ją dostał: system, w którym faktura jest widoczna dla odbiorcy, wiadomość z potwierdzeniem odbioru albo list polecony.',
    },
    { type: 'h2', text: 'Wezwanie do zapłaty: po co je pisać' },
    {
      type: 'p',
      text: 'Do naliczenia odsetek i rekompensaty wezwanie nie jest potrzebne. Mimo to warto je wysłać, z trzech powodów. Czasem to wystarcza i sprawa się kończy. Daje też dłużnikowi ostatnią szansę na zapłatę przed kosztami. Od 1 marca 2026 pozew musi zawierać informację, czy strony próbowały mediacji lub innego pozasądowego sposobu rozwiązania sporu, a jeśli nie, dlaczego (art. 187 KPC). Wezwanie jest najprostszym dowodem takiej próby.',
    },
    { type: 'p', text: 'Dobre wezwanie mieści się na jednej stronie i zawiera:' },
    {
      type: 'ul',
      items: [
        'numery i daty faktur, kwoty i terminy płatności,',
        'wyliczenie odsetek i rekompensaty z podanym dniem, do którego je policzono,',
        'siedmiodniowy termin zapłaty i numer rachunku,',
        'informację, że po upływie terminu sprawa trafi do sądu.',
      ],
    },
    {
      type: 'p',
      text: 'Wysyłaj je tak, żeby mieć dowód odbioru: listem poleconym albo e-mailem z potwierdzeniem, jeśli umowa dopuszcza taką formę korespondencji.',
    },
    { type: 'h2', text: 'Nakaz zapłaty: najkrótsza droga przez sąd' },
    {
      type: 'p',
      text: 'Gdy wezwanie nie pomogło, składasz pozew. Dla należności między firmami jest szybka ścieżka. Sąd wydaje nakaz zapłaty w postępowaniu nakazowym na podstawie dołączonych do pozwu: umowy, dowodu, że wykonałeś swoje świadczenie, i dowodu doręczenia faktury dłużnikowi (art. 485 § 2¹ KPC, w brzmieniu obowiązującym od marca 2026). Nakaz wydaje się na posiedzeniu niejawnym, bez rozprawy.',
    },
    {
      type: 'p',
      text: 'Opłata od pozwu w tym trybie wynosi jedną czwartą zwykłej opłaty (art. 19 ust. 2 ustawy o kosztach sądowych w sprawach cywilnych). Zwykła opłata zależy od wartości sporu: do 20 000 zł stała, powyżej pięć procent wartości.',
    },
    {
      type: 'table',
      caption: 'Opłata od pozwu o zapłatę',
      head: ['Wartość roszczenia', 'Zwykła opłata', 'W postępowaniu nakazowym'],
      rows: [
        ['5 000 zł', '400 zł', '100 zł'],
        ['15 000 zł', '750 zł', '187,50 zł'],
        ['30 000 zł', '1 500 zł', '375 zł'],
        ['100 000 zł', '5 000 zł', '1 250 zł'],
      ],
    },
    {
      type: 'p',
      text: 'Po doręczeniu nakazu dłużnik ma wskazany w nim termin, w kraju zwykle dwa tygodnie, żeby zapłacić albo wnieść zarzuty od nakazu. Jeśli nic nie zrobi, nakaz zyskuje moc prawomocnego wyroku i możesz kierować go do komornika. Jeśli wniesie zarzuty, sprawa idzie zwykłym torem i potrzebujesz mocnych dowodów.',
    },
    {
      type: 'p',
      text: 'Jest też postępowanie upominawcze w e-sądzie. Dotyczy tylko roszczeń pieniężnych wymagalnych w ciągu trzech lat przed złożeniem pozwu, a dowody wskazuje się, ale nie dołącza. Gdy dłużnik wniesie sprzeciw, postępowanie zostaje umorzone, więc jest to droga dla spraw, w których spodziewasz się zapłaty albo braku reakcji.',
    },
    { type: 'h2', text: 'Przedawnienie: kiedy tracisz prawo do pozwu' },
    {
      type: 'p',
      text: 'Roszczenia związane z prowadzeniem działalności gospodarczej przedawniają się po trzech latach (art. 118 KC). Bieg zaczyna się w dniu, w którym roszczenie stało się wymagalne, ale koniec terminu przypada zawsze na ostatni dzień roku kalendarzowego. Faktura, którą dłużnik miał zapłacić 15 marca 2024 roku, przedawnia się więc 31 grudnia 2027 roku.',
    },
    {
      type: 'p',
      text: 'Po upływie terminu dłużnik może odmówić zapłaty, ale musi się na przedawnienie powołać (art. 117 KC). Bieg terminu przerywa każda czynność przed sądem wprost zmierzająca do dochodzenia roszczenia i uznanie długu przez dłużnika (art. 123 KC). Samo wezwanie do zapłaty go nie przerywa, o czym zapomina wielu wierzycieli.',
    },
    { type: 'h2', text: 'Kiedy warto zaangażować prawnika' },
    {
      type: 'ul',
      items: [
        'Dłużnik kwestionuje usługę albo jej jakość i spór zrobi się szerszy niż sama faktura.',
        'Nie masz dowodu doręczenia faktury albo umowa nie istnieje na piśmie.',
        'Kwota jest wysoka, a firma dłużnika może nie mieć majątku. Przed pozwem sprawdź ją w KRS lub CEIDG, w Krajowym Rejestrze Zadłużonych i na białej liście podatników VAT.',
        'Zbliża się koniec roku, w którym przedawnia się roszczenie.',
      ],
    },
    {
      type: 'p',
      text: 'Pierwsza rozmowa z nami trwa do dwudziestu minut i jest bezpłatna. Dokumenty możesz przysłać wcześniej, żeby odpowiedzieć konkretnie.',
    },
    {
      type: 'note',
      title: 'Uwaga',
      text: 'Tekst jest ogólnym omówieniem przepisów, według stanu na październik 2026. Stopy odsetek, kursy euro i opłaty sprawdzaj w dniu składania pisma.',
    },
  ],
};
