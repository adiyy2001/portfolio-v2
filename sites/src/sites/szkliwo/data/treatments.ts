import { formatZloty } from '../lib/format';
import { findPrice } from './prices';
import type { TeamId } from './team';

export type TreatmentSlug =
  | 'przeglad-i-higienizacja'
  | 'wypelnienia'
  | 'leczenie-kanalowe'
  | 'wybielanie'
  | 'implanty'
  | 'ortodoncja-nakladkowa';

export type DiagramKind = 'cleaning' | 'filling' | 'canal' | 'whitening' | 'implant' | 'aligner';

export interface TreatmentAnswer {
  answer: string;
  detail: string;
}

export interface TreatmentStep {
  title: string;
  text: string;
  minutes?: number;
  group?: string;
}

export interface TreatmentQuestion {
  question: string;
  answer: string;
}

export interface TreatmentLimits {
  title: string;
  items: readonly string[];
}

export interface Treatment {
  slug: TreatmentSlug;
  name: string;
  summary: string;
  lead: string;
  visits: string;
  pain: TreatmentAnswer;
  duration: TreatmentAnswer;
  cost: TreatmentAnswer;
  forWhom: readonly string[];
  limits?: TreatmentLimits;
  steps: readonly TreatmentStep[];
  aftercare: readonly string[];
  questions: readonly TreatmentQuestion[];
  priceIds: readonly string[];
  doctorIds: readonly TeamId[];
  diagram: DiagramKind;
}

const priceText = (id: string) => formatZloty(findPrice(id).price);

const wholeImplantPrice = findPrice('implant').price + findPrice('korona-na-implancie').price;

const bundleSaving =
  findPrice('higienizacja').price +
  findPrice('wybielanie-gabinetowe').price -
  findPrice('higienizacja-i-wybielanie').price;

export const treatments: readonly Treatment[] = [
  {
    slug: 'przeglad-i-higienizacja',
    name: 'Przegląd i higienizacja',
    summary:
      'Oglądamy każdy ząb i dziąsło, zdejmujemy kamień i osad. Plan leczenia dostajesz na piśmie, z cenami.',
    lead: 'Przegląd co pół roku wyłapuje ubytek, zanim zaboli. Higienizacja zdejmuje kamień, którego nie usunie szczoteczka.',
    visits: '1 wizyta',
    pain: {
      answer: 'Zwykle nie',
      detail:
        'Przegląd to oglądanie, sprawdzanie sondą i zdjęcie. Przy skalingu czujesz wibrację i zimną wodę. Jeśli dziąsła są zapalne, bywa wrażliwie. Wtedy znieczulamy je żelem i robimy przerwy.',
    },
    duration: {
      answer: '40 min do 1 godz.',
      detail:
        'Przegląd trwa 40 minut, higienizacja około godziny. Można je połączyć w jedną wizytę. Rezerwujemy wtedy 1 godz. 40 min.',
    },
    cost: {
      answer: `od ${priceText('przeglad')}`,
      detail: `Przegląd z planem leczenia na piśmie kosztuje ${priceText('przeglad')}. Pełna higienizacja kosztuje ${priceText('higienizacja')} i obejmuje skaling, piaskowanie, fluoryzację, polerowanie i instruktaż.`,
    },
    forWhom: [
      'To twoja pierwsza wizyta u nas albo minął ponad rok od ostatniego przeglądu.',
      'Dziąsła krwawią przy myciu albo czujesz kamień za dolnymi zębami.',
      'Przymierzasz się do wybielania, aparatu albo implantu. Zaczynamy od zdrowych zębów i dziąseł.',
      'Zęby mają osad po kawie, herbacie albo papierosach, którego nie zmywa szczoteczka.',
    ],
    steps: [
      {
        group: 'Przegląd',
        title: 'Rozmowa',
        text: 'Pytamy o ból, leki, alergie i o to, co cię martwi. Notujemy to, zanim zajrzymy do ust.',
        minutes: 5,
      },
      {
        group: 'Przegląd',
        title: 'Badanie',
        text: 'Sprawdzamy każdy ząb, dziąsła, zgryz i błonę śluzową. Robimy zdjęcie, jeśli coś trzeba zobaczyć od środka.',
        minutes: 20,
      },
      {
        group: 'Przegląd',
        title: 'Plan na piśmie',
        text: 'Dostajesz listę rzeczy do zrobienia w kolejności, z ceną każdej. Możesz ją zabrać do domu i zastanowić się bez presji.',
        minutes: 15,
      },
      {
        group: 'Higienizacja',
        title: 'Skaling',
        text: 'Końcówka ultradźwiękowa rozbija kamień nad dziąsłem i pod nim. Woda spłukuje go na bieżąco.',
        minutes: 25,
      },
      {
        group: 'Higienizacja',
        title: 'Piaskowanie',
        text: 'Strumień wody z proszkiem zdejmuje osad po kawie, herbacie i papierosach.',
        minutes: 15,
      },
      {
        group: 'Higienizacja',
        title: 'Polerowanie i fluor',
        text: 'Polerujemy zęby, a potem malujemy je lakierem z fluorem, który wzmacnia szkliwo.',
        minutes: 10,
      },
      {
        group: 'Higienizacja',
        title: 'Instruktaż',
        text: 'Higienistka pokazuje, gdzie szczoteczka ci nie sięga, i dobiera nić albo szczoteczki międzyzębowe.',
        minutes: 10,
      },
    ],
    aftercare: [
      'Po skalingu dziąsła mogą przez dzień lub dwa lekko krwawić i być wrażliwe. To mija.',
      'Po lakierze z fluorem jedz tego dnia miękkie rzeczy i umyj zęby dopiero rano.',
      'Higienizację powtarzaj co pół roku. Przy chorobie dziąseł higienistka zaplanuje ją co trzy do czterech miesięcy.',
    ],
    questions: [
      {
        question: 'Czy skaling szkodzi szkliwu?',
        answer:
          'Nie. Końcówka ultradźwiękowa rozbija kamień i nie ściera szkliwa. Szkodzi kamień, który zostaje: dziąsło pod nim się zapala i z czasem się cofa.',
      },
      {
        question: 'Czy po higienizacji zęby będą jaśniejsze?',
        answer:
          'Trochę, bo znika osad po kawie, herbacie i papierosach. Kolor samego zęba zmienia dopiero wybielanie.',
      },
      {
        question: 'Czy mogę przyjść w ciąży?',
        answer:
          'Tak, a dziąsła w ciąży często potrzebują więcej uwagi. Powiedz nam o ciąży przy rezerwacji. Zdjęcia rentgenowskie robimy wtedy tylko wtedy, gdy bez nich nie da się ustalić, co jest nie tak.',
      },
      {
        question: 'Czy przyjmujecie dzieci?',
        answer: `Tak, od pierwszych zębów. Przegląd dziecka trwa 30 minut, z czasem na oswojenie się z fotelem, i kosztuje ${priceText('dziecko-przeglad')}. Wypełnienia i usuwanie zębów mlecznych też robimy.`,
      },
    ],
    priceIds: [
      'przeglad',
      'kontrola',
      'rtg-punktowe',
      'rtg-pantomograficzne',
      'skaling',
      'piaskowanie',
      'fluoryzacja',
      'higienizacja',
    ],
    doctorIds: ['targowska', 'czarnomska'],
    diagram: 'cleaning',
  },
  {
    slug: 'wypelnienia',
    name: 'Wypełnienia',
    summary:
      'Usuwamy próchnicę i odbudowujemy ząb kompozytem w kolorze twojego zęba, w koferdamie.',
    lead: 'Im mniejszy ubytek, tym krótsza wizyta i niższa cena. Dlatego warto przyjść, zanim ząb zacznie boleć.',
    visits: '1 wizyta',
    pain: {
      answer: 'Tylko ukłucie',
      detail:
        'Najpierw żel na dziąsło, potem znieczulenie przy zębie. Przez kilka sekund czujesz ukłucie i ciepło, potem ząb jest znieczulony. Jeśli w trakcie coś zaboli, podnosisz rękę i dokładamy znieczulenia.',
    },
    duration: {
      answer: '30 do 90 min',
      detail:
        'Mały ubytek zajmuje 30 minut, duży albo odbudowa zęba do 90 minut. Kilka zębów po jednej stronie leczymy podczas jednej wizyty.',
    },
    cost: {
      answer: `od ${priceText('wypelnienie-maly')}`,
      detail: `Mały ubytek kosztuje ${priceText('wypelnienie-maly')}, średni ${priceText('wypelnienie-sredni')}, duży albo odbudowa zęba ${priceText('wypelnienie-duzy')}. W cenie są znieczulenie, koferdam i polerowanie.`,
    },
    forWhom: [
      'Czujesz językiem dziurę albo wpada w nią jedzenie.',
      'Ząb reaguje na zimne, słodkie albo na gryzienie.',
      'Wypadła albo pękła stara plomba.',
      'Ubytek widać na zdjęciu, a ząb jeszcze nie boli. To najlepszy moment: ubytek jest mały, a nerw cały.',
    ],
    steps: [
      {
        title: 'Znieczulenie',
        text: 'Żel na dziąsło, potem zastrzyk. Czekamy kilka minut, aż ząb przestanie czuć.',
        minutes: 5,
      },
      {
        title: 'Koferdam',
        text: 'Gumowa chusteczka odgradza ząb od śliny. Kompozyt łączy się z zębem tylko na suchym polu.',
        minutes: 5,
      },
      {
        title: 'Usunięcie próchnicy',
        text: 'Wiertłem zdejmujemy tylko zniszczoną tkankę. Zdrowe szkliwo zostaje.',
        minutes: 10,
      },
      {
        title: 'Warstwy kompozytu',
        text: 'Kładziemy go cienkimi warstwami i utwardzamy lampą po każdej. W zębach przednich łączymy kilka odcieni, żeby nie było widać granicy.',
        minutes: 25,
      },
      {
        title: 'Zgryz i polerowanie',
        text: 'Zagryzasz na papierku, a my sprawdzamy, czy plomba nie jest za wysoka. Potem polerujemy ją do połysku.',
        minutes: 10,
      },
    ],
    aftercare: [
      'Znieczulenie schodzi po dwóch do trzech godzin. Do tego czasu nie jedz i nie pij gorącego, żeby nie przygryźć policzka ani języka.',
      'Wypełnienie jest twarde od razu. Zjesz normalnie, kiedy wróci ci czucie w ustach.',
      'Przez kilka dni ząb może reagować na zimne. Jeśli boli przy gryzieniu albo plomba wydaje się za wysoka, wróć. Poprawimy ją bez opłaty.',
    ],
    questions: [
      {
        question: 'Czy plomba będzie widoczna?',
        answer:
          'Dobieramy odcień do twojego zęba przy świetle dziennym, na kolorniku. W zębach przednich łączymy kilka odcieni. Dobrze położoną plombę z przodu trudno zauważyć.',
      },
      {
        question: 'Jak długo wytrzyma wypełnienie?',
        answer:
          'Dobrze położony kompozyt służy zwykle od kilku do kilkunastu lat. Zależy to od wielkości ubytku, zgryzu i diety. Duży ubytek w trzonowcu lepiej zamknąć nakładką lub koroną i powiemy ci o tym przed zabiegiem.',
      },
      {
        question: 'Czy stare plomby z amalgamatu trzeba wymieniać?',
        answer:
          'Nie dlatego, że są z amalgamatu. Wymieniamy je, gdy pod spodem jest próchnica, plomba pęka albo brzeg nie przylega. Nowych nie kładziemy: od 1 stycznia 2025 w Unii Europejskiej wolno to tylko wtedy, gdy dentysta uzna amalgamat za absolutnie konieczny ze względów medycznych.',
      },
    ],
    priceIds: [
      'wypelnienie-maly',
      'wypelnienie-sredni',
      'wypelnienie-duzy',
      'wypelnienie-przednie',
      'odbudowa-po-kanalowym',
      'nakladka-ceramiczna',
    ],
    doctorIds: ['targowska'],
    diagram: 'filling',
  },
  {
    slug: 'leczenie-kanalowe',
    name: 'Leczenie kanałowe',
    summary:
      'Ratujemy ząb z zainfekowanym nerwem zamiast go usuwać. Pracujemy w koferdamie i w powiększeniu.',
    lead: 'Ząb po leczeniu kanałowym zostaje twój. Usunięty trzeba czymś zastąpić, a to kosztuje więcej.',
    visits: '1 do 2 wizyt',
    pain: {
      answer: 'Nie powinno',
      detail:
        'Ząb jest znieczulony tak samo jak przy wypełnieniu. Gdy boli od kilku dni, znieczulenie działa wolniej, więc dokładamy je, aż czujesz tylko nacisk. Po zabiegu przez dwa do trzech dni ząb bywa wrażliwy na gryzienie.',
    },
    duration: {
      answer: '60 do 120 min',
      detail:
        'Ząb jednokanałowy zwykle zamykamy w jedną wizytę, w 60 do 90 minut. Trzonowiec zajmuje 90 do 120 minut, czasem dzielimy go na dwie wizyty z lekiem w kanałach.',
    },
    cost: {
      answer: `od ${priceText('kanalowe-1')}`,
      detail: `Ząb jednokanałowy kosztuje ${priceText('kanalowe-1')}, dwukanałowy ${priceText('kanalowe-2')}, trzy- lub czterokanałowy ${priceText('kanalowe-3')}. W cenie są zdjęcia, leki w zębie i kontrola. Odbudowa zęba po leczeniu jest osobno: ${priceText('odbudowa-po-kanalowym')}.`,
    },
    forWhom: [
      'Ząb boli samoistnie, w nocy albo długo po ciepłym lub zimnym.',
      'Na dziąśle przy zębie jest krostka, z której sączy się ropa.',
      'Ząb ściemniał po urazie albo próchnica doszła do nerwu.',
      'Na zdjęciu widać zmianę przy końcu korzenia, choć ząb nie boli.',
    ],
    limits: {
      title: 'Kiedy zamiast tego usuwamy ząb',
      items: [
        'Korzeń jest pęknięty wzdłuż.',
        'Ząb jest zniszczony poniżej dziąsła tak, że nie da się go odbudować.',
        'Kość wokół zęba zniknęła na tyle, że ząb się rusza.',
      ],
    },
    steps: [
      {
        title: 'Zdjęcie i znieczulenie',
        text: 'Oglądamy korzenie na zdjęciu i znieczulamy ząb.',
        minutes: 10,
      },
      {
        title: 'Koferdam i dostęp',
        text: 'Zakładamy izolację, otwieramy ząb i w powiększeniu szukamy ujść kanałów.',
        minutes: 10,
      },
      {
        title: 'Opracowanie kanałów',
        text: 'Cienkimi narzędziami usuwamy zainfekowaną miazgę i poszerzamy kanały. Płuczemy je środkiem odkażającym.',
        minutes: 25,
      },
      {
        title: 'Zdjęcie długości',
        text: 'Na zdjęciu sprawdzamy, że narzędzie doszło do końca korzenia.',
        minutes: 5,
      },
      {
        title: 'Wypełnienie kanałów',
        text: 'Wypełniamy je gutaperką i szczelnym cementem. O tym, czy bakterie wrócą, decyduje szczelność.',
        minutes: 20,
      },
      {
        title: 'Zamknięcie zęba',
        text: 'Zamykamy ząb plombą. Trzonowiec potrzebuje potem nakładki albo korony.',
        minutes: 10,
      },
    ],
    aftercare: [
      'Przez dwa do trzech dni ząb może być wrażliwy na nacisk. To normalne i mija.',
      'Dopóki ząb nie ma stałej odbudowy, gryź po drugiej stronie. Tymczasowa plomba kruszy się łatwiej.',
      'Trzonowiec po leczeniu jest kruchy. Zamknij go nakładką lub koroną w ciągu kilku tygodni.',
      'Po sześciu do dwunastu miesięcy robimy zdjęcie kontrolne. Sprawdzamy, czy kość wokół korzenia się odbudowuje.',
    ],
    questions: [
      {
        question: 'Czy lepiej usunąć ząb niż leczyć kanałowo?',
        answer:
          'Zwykle lepiej zostawić własny ząb, jeśli da się go uratować. Usunięty ząb trzeba czymś zastąpić, a kość w tym miejscu z czasem się cofa. Gdy korzeń jest pęknięty albo zęba nie da się odbudować, powiemy to wprost.',
      },
      {
        question: 'Czy ząb po leczeniu ściemnieje?',
        answer: `Może, zwłaszcza po urazie. Pojedynczy ciemny ząb wybielamy od środka za ${priceText('wybielanie-martwego')}.`,
      },
      {
        question: 'Czy leczenie kanałowe szkodzi zdrowiu?',
        answer:
          'Nie. Szkodzi nieleczone zakażenie przy korzeniu, a nie wyleczony ząb. Dlatego sprawdzamy go na zdjęciu po pół roku.',
      },
      {
        question: 'Dlaczego czasem potrzebne są dwie wizyty?',
        answer:
          'Gdy w zębie jest stan zapalny albo ropień, zostawiamy w kanałach lek odkażający na kilka dni. Dopiero potem wypełniamy je na stałe.',
      },
    ],
    priceIds: [
      'kanalowe-1',
      'kanalowe-2',
      'kanalowe-3',
      'kanalowe-ponowne',
      'opatrunek-w-bolu',
      'odbudowa-po-kanalowym',
      'wybielanie-martwego',
      'rtg-punktowe',
    ],
    doctorIds: ['targowska'],
    diagram: 'canal',
  },
  {
    slug: 'wybielanie',
    name: 'Wybielanie',
    summary:
      'Rozjaśniamy zęby żelem dozwolonym w Unii Europejskiej, w gabinecie albo w nakładkach w domu.',
    lead: 'Wybielanie zmienia kolor zęba, nie jego kształt. Przed zabiegiem zapisujemy twój odcień na kolorniku, żeby efekt dało się zmierzyć.',
    visits: '1 do 2 wizyt',
    pain: {
      answer: 'Bywa wrażliwie',
      detail:
        'Sam zabieg nie boli. Przez dzień lub dwa zęby mogą reagować na zimne i ciepłe, bo żel przenika przez szkliwo do zębiny. Przy wrażliwych zębach dajemy żel z fluorem i skracamy cykle.',
    },
    duration: {
      answer: '90 min albo 14 dni',
      detail:
        'Wybielanie gabinetowe to jedna wizyta, około 90 minut. Wybielanie nakładkowe robisz w domu przez 10 do 14 dni, zwykle przez godzinę dziennie albo na noc, zależnie od żelu.',
    },
    cost: {
      answer: `od ${priceText('wybielanie-nakladkowe')}`,
      detail: `Wybielanie w nakładkach kosztuje ${priceText('wybielanie-nakladkowe')}: nakładki robione na twoje zęby i żel na cały cykl. Gabinetowe kosztuje ${priceText('wybielanie-gabinetowe')}. Higienizacja przed wybielaniem jest osobno, a razem z gabinetowym kosztuje ${priceText('higienizacja-i-wybielanie')}, czyli o ${formatZloty(bundleSaving)} mniej.`,
    },
    forWhom: [
      'Zęby żółkną od kawy, herbaty albo wina i chcesz je rozjaśnić o kilka stopni.',
      'Szykujesz się do ślubu, rozmowy o pracę albo sesji i masz na to kilka tygodni.',
      'Masz jeden ciemny ząb po leczeniu kanałowym. To osobny zabieg, od środka zęba.',
      'Higienizację masz już za sobą albo zrobimy ją tydzień przed wybielaniem.',
    ],
    limits: {
      title: 'Kiedy nie wybielamy',
      items: [
        'Poniżej 18 lat. Przepisy Unii Europejskiej na to nie pozwalają.',
        'W ciąży i podczas karmienia piersią. Nie ma badań, które potwierdzałyby, że to bezpieczne, więc odkładamy zabieg.',
        'Gdy zęby mają próchnicę albo dziąsła są zapalone. Najpierw leczymy, potem wybielamy.',
        'Wypełnienia, korony i licówki się nie wybielają. Jeśli masz je z przodu, powiemy ci o tym przed zabiegiem. Czasem trzeba je potem wymienić, żeby pasowały do jaśniejszych zębów.',
      ],
    },
    steps: [
      {
        title: 'Higienizacja',
        text: 'Tydzień przed zabiegiem zdejmujemy kamień i osad. Wybielanie na brudnych zębach daje nierówny kolor.',
      },
      {
        title: 'Kolor wyjściowy',
        text: 'Dobieramy twój odcień na kolorniku i zapisujemy go. Dzięki temu po zabiegu mamy z czym porównać.',
      },
      {
        title: 'Osłona dziąseł',
        text: 'Dziąsła i wargi osłaniamy barierą. Żel ma dotykać tylko zębów.',
      },
      {
        title: 'Żel',
        text: 'W gabinecie nakładamy żel w kilku rundach po kilkanaście minut. W domu zakładasz nakładki z żelem według planu, przez 10 do 14 dni.',
      },
      {
        title: 'Kolor po zabiegu',
        text: 'Zmywamy żel i porównujemy kolor z kolornikiem. Zapisujemy, o ile stopni zęby się rozjaśniły.',
      },
      {
        title: 'Kontrola po dwóch tygodniach',
        text: 'Zęby po zabiegu są odwodnione i wyglądają jaśniej, niż będą wyglądać. Dlatego efekt oceniamy dopiero po dwóch tygodniach.',
      },
    ],
    aftercare: [
      'Przez 48 godzin unikaj kawy, herbaty, czerwonego wina, jagód, curry i papierosów. Szkliwo jest wtedy najbardziej chłonne na kolor.',
      'Zęby mogą być wrażliwe przez dzień lub dwa. Pomaga pasta z azotanem potasu albo fluorkiem i niezbyt zimne napoje.',
      `Efekt trzyma się zwykle od roku do trzech lat, zależnie od kawy i papierosów. Odświeżenie żelem do nakładek kosztuje ${priceText('zel-uzupelniajacy')}.`,
    ],
    questions: [
      {
        question: 'O ile zęby się rozjaśnią?',
        answer:
          'Zwykle o trzy do pięciu stopni na skali jasności kolornika. Najlepiej reagują zęby żółtawe i brązowawe (grupy A i B), słabiej szarawe (C). Dokładnej liczby nie obiecujemy, bo zależy od twoich zębów. Na stronie Przed i po sprawdzisz, jak to wygląda na kolorniku.',
      },
      {
        question: 'Czy wybielanie niszczy szkliwo?',
        answer:
          'Przy żelach dozwolonych w Unii Europejskiej i użytych pod kontrolą dentysty szkliwo nie ulega trwałemu uszkodzeniu. Przez kilka dni jest jednak bardziej chłonne i wrażliwe, więc oszczędzasz je od koloru i kwasów.',
      },
      {
        question: 'Czy wybielanie z drogerii to to samo?',
        answer:
          'Nie. Produkty ogólnodostępne mogą zawierać najwyżej 0,1% nadtlenku wodoru, więc działają słabo i wolno. Żele od 0,1% do 6% wolno sprzedawać tylko dentystom, a pierwsze użycie robi dentysta. Mocniejszych nie wolno stosować wcale.',
      },
    ],
    priceIds: [
      'wybielanie-gabinetowe',
      'wybielanie-nakladkowe',
      'higienizacja-i-wybielanie',
      'higienizacja',
      'zel-uzupelniajacy',
      'wybielanie-martwego',
    ],
    doctorIds: ['targowska', 'czarnomska'],
    diagram: 'whitening',
  },
  {
    slug: 'implanty',
    name: 'Implanty',
    summary:
      'Tytanowy implant zastępuje korzeń brakującego zęba. Najpierw oglądamy twoją kość w tomografii.',
    lead: 'Implant nie wymaga szlifowania zębów obok. Zanim zaczniemy, mówimy, czy kości wystarczy i ile kosztuje całość.',
    visits: '4 do 5 wizyt',
    pain: {
      answer: 'Mało, głównie po zabiegu',
      detail:
        'Zabieg robimy w znieczuleniu miejscowym, więc czujesz nacisk, ale nie ból. Przez dwa do trzech dni po zabiegu jest obrzęk i tkliwość, mniej więcej jak po usunięciu zęba. Dostajesz leki przeciwbólowe i instrukcję zimnych okładów.',
    },
    duration: {
      answer: '3 do 6 miesięcy',
      detail:
        'Sam zabieg trwa około 45 minut na jeden implant. Potem implant zrasta się z kością: trzy do czterech miesięcy w żuchwie, cztery do sześciu w szczęce. Dopiero wtedy skanujemy zęby i robimy koronę, a ta jest gotowa po około dwóch tygodniach.',
    },
    cost: {
      answer: `od ${formatZloty(wholeImplantPrice)}`,
      detail: `Implant z zabiegiem kosztuje ${priceText('implant')}, korona z cyrkonu na implancie ${priceText('korona-na-implancie')}. Razem ${formatZloty(wholeImplantPrice)} za jeden ząb. Konsultacja z oceną tomografii kosztuje ${priceText('konsultacja-implantologiczna')}, a sama tomografia ${priceText('tomografia')}. Konsultację odliczamy od leczenia, jeśli się zdecydujesz. Przeszczep kości albo podniesienie zatoki dodajemy tylko wtedy, gdy tomografia pokazuje, że są potrzebne. Całą cenę dostajesz na piśmie, zanim cokolwiek zrobimy.`,
    },
    forWhom: [
      'Brakuje ci jednego zęba i nie chcesz szlifować zębów obok, jak przy moście.',
      'Brakuje kilku zębów z rzędu, a proteza przeszkadza albo się rusza.',
      'Ząb trzeba usunąć i od razu chcesz zaplanować, czym go zastąpić.',
      'Wiesz, że kość w miejscu brakującego zęba z czasem się zmniejsza, i nie chcesz czekać.',
    ],
    limits: {
      title: 'Kiedy zaczekamy',
      items: [
        'Aktywna próchnica albo choroba dziąseł. Najpierw je leczymy, bo bakterie przenoszą się na implant.',
        'Źle wyrównana cukrzyca. Prosimy o wynik HbA1c i rozmowę z lekarzem prowadzącym, bo gojenie jest wtedy gorsze.',
        'Kość nie skończyła rosnąć, czyli zwykle do około 18 roku życia.',
        'Palenie nie wyklucza implantu, ale zwiększa ryzyko, że się nie zrośnie. Prosimy o przerwę na czas gojenia.',
      ],
    },
    steps: [
      {
        title: 'Konsultacja i tomografia',
        text: 'Oglądamy twoją kość w 3D, mierzymy odległość do nerwu i zatoki. Ustalamy, czy implant można wszczepić od razu, czy najpierw trzeba odbudować kość.',
        minutes: 60,
      },
      {
        title: 'Plan na piśmie',
        text: 'Dostajesz plan z ceną całości i kolejnością etapów. Termin zabiegu ustalamy dopiero wtedy, gdy się zdecydujesz.',
      },
      {
        title: 'Zabieg',
        text: 'Znieczulenie miejscowe, otwarcie dziąsła, przygotowanie miejsca w kości, wkręcenie implantu i szwy. Jeśli chcesz, słuchasz muzyki.',
        minutes: 45,
      },
      {
        title: 'Szwy i kontrola',
        text: 'Po 10 do 14 dniach zdejmujemy szwy i sprawdzamy, jak się goi.',
        minutes: 15,
      },
      {
        title: 'Zrastanie z kością',
        text: 'Trzy do sześciu miesięcy, w których implant zrasta się z kością. Jeśli brak widać przy uśmiechu, dostajesz tymczasowy ząb.',
      },
      {
        title: 'Skan i korona',
        text: 'Skanujemy zęby, bez mas wyciskowych. Korona z cyrkonu jest gotowa po około dwóch tygodniach. Jej kolor dobieramy na kolorniku.',
        minutes: 30,
      },
    ],
    aftercare: [
      'Przez dwa do trzech dni przykładaj zimne okłady na 15 minut co godzinę i jedz letnie, miękkie rzeczy po drugiej stronie.',
      'Przez tydzień nie pal i nie pij alkoholu. Oba spowalniają gojenie.',
      'Zęby myj od następnego dnia miękką szczoteczką, omijając ranę. Płucz usta chlorheksydyną, tak jak ci zapiszemy.',
      'Raz w roku przychodź na kontrolę ze zdjęciem i higienizację. Implant nie ma próchnicy, ale dziąsło i kość wokół niego mogą się zapalić.',
    ],
    questions: [
      {
        question: 'Ile lat wytrzymuje implant?',
        answer:
          'Większość dobrze utrzymanych implantów służy ponad dziesięć lat, wiele dłużej. Zależy to od higieny, palenia i regularnych kontroli. Konkretnej liczby lat nie obiecujemy.',
      },
      {
        question: 'Czy implant może zostać odrzucony?',
        answer:
          'Tytan jest dobrze tolerowany, więc nie chodzi o alergię. Zdarza się, że implant nie zrasta się z kością, najczęściej u palaczy, przy cukrzycy albo przy zakażeniu. Wtedy go wykręcamy i próbujemy ponownie po zagojeniu.',
      },
      {
        question: 'Czy można wszczepić implant od razu po usunięciu zęba?',
        answer:
          'Czasem tak, gdy kość i dziąsło wokół zęba są zdrowe. Jeśli ząb miał stan zapalny, czekamy dwa do trzech miesięcy na zagojenie. Decyduje tomografia.',
      },
      {
        question: 'Co, jeśli kości jest za mało?',
        answer: `Odbudowujemy ją przeszczepem, a w górnej szczęce czasem podnosimy dno zatoki. To dodatkowy etap i dodatkowe miesiące gojenia. Powiemy ci o tym po tomografii, razem z ceną: przeszczep kości od ${priceText('przeszczep-kosci')}, podniesienie zatoki od ${priceText('podniesienie-zatoki')}.`,
      },
    ],
    priceIds: [
      'konsultacja-implantologiczna',
      'tomografia',
      'implant',
      'korona-na-implancie',
      'szablon-chirurgiczny',
      'przeszczep-kosci',
      'podniesienie-zatoki',
    ],
    doctorIds: ['kordylewski'],
    diagram: 'implant',
  },
  {
    slug: 'ortodoncja-nakladkowa',
    name: 'Ortodoncja nakładkowa',
    summary:
      'Przezroczyste nakładki prostują zęby bez zamków. Plan oglądasz na ekranie, zanim zaczniesz.',
    lead: 'Nakładki zdejmujesz do jedzenia i mycia zębów. W zamian nosisz je około 22 godzin na dobę.',
    visits: 'kontrola co 8 do 10 tygodni',
    pain: {
      answer: 'Ucisk, nie ból',
      detail:
        'Każda nowa nakładka przez dzień lub dwa mocniej uciska, jak po twardym jedzeniu. To normalne. Nie ma zastrzyków ani ostrych krawędzi. Po kilku dniach zęby się przyzwyczajają, aż do następnej nakładki.',
    },
    duration: {
      answer: '6 do 18 miesięcy',
      detail:
        'Pakiet lekki to do 14 nakładek, każdą nosisz dwa tygodnie, czyli około pół roku. Pakiet pełny to do 40 nakładek, około półtora roku. Na kontrolę przychodzisz co 8 do 10 tygodni i trwa ona 20 minut.',
    },
    cost: {
      answer: `od ${priceText('nakladki-lekki')}`,
      detail: `Pakiet lekki kosztuje od ${priceText('nakladki-lekki')}, pełny ${priceText('nakladki-pelny')}, bez limitu nakładek ${priceText('nakladki-bez-limitu')}. Kontrole i poprawki są w cenie pakietu. Konsultacja ze skanem 3D kosztuje ${priceText('konsultacja-ortodontyczna')}, a odliczamy ją od leczenia, jeśli się zdecydujesz.`,
    },
    forWhom: [
      'Zęby są stłoczone, odstają albo między nimi są szpary.',
      'Zęby wróciły na dawne miejsca po aparacie z dzieciństwa.',
      'Nie chcesz metalowych zamków na zębach.',
      'Potrafisz nosić nakładki 22 godziny na dobę. Bez tego leczenie się nie uda.',
    ],
    limits: {
      title: 'Kiedy aparat stały będzie lepszy',
      items: [
        'Niektóre wady, na przykład duża różnica w ustawieniu szczęk, wymagają aparatu stałego albo leczenia z chirurgiem. Powiemy ci to na konsultacji, zanim zapłacisz za leczenie.',
        'Próchnicę i chorobę dziąseł leczymy przed ortodoncją. Nakładki przylegają do zębów przez wiele godzin dziennie, a pod nimi bakterie mają łatwiej.',
        'Jeśli wiesz, że nie będziesz pamiętać o nakładkach, aparat stały jest uczciwszym wyborem. Pracuje bez twojej dyscypliny.',
      ],
    },
    steps: [
      {
        title: 'Konsultacja i skan 3D',
        text: 'Skaner zbiera kształt twoich zębów w kilka minut, bez mas wyciskowych. Do tego zdjęcie pantomograficzne i zdjęcia zębów.',
        minutes: 40,
      },
      {
        title: 'Plan na ekranie',
        text: 'Zofia Mrozowicka pokazuje animację: gdzie zęby są dziś i gdzie będą na końcu. Omawiamy liczbę nakładek i cenę pakietu.',
      },
      {
        title: 'Pierwsze nakładki i przyciski',
        text: 'Na kilku zębach przyklejamy małe przyciski z kompozytu w kolorze zęba, żeby nakładka mogła je chwycić. Uczymy cię zakładania i czyszczenia.',
        minutes: 60,
      },
      {
        title: 'Zmiana co dwa tygodnie',
        text: 'W domu sam zmieniasz nakładkę na następną z kompletu i zapisujesz datę.',
      },
      {
        title: 'Kontrole',
        text: 'Co osiem do dziesięciu tygodni sprawdzamy, czy zęby idą zgodnie z planem. Jeśli nie, zamawiamy poprawkę bez dodatkowej opłaty.',
        minutes: 20,
      },
      {
        title: 'Retencja',
        text: 'Po leczeniu zęby próbują wrócić na stare miejsca. Dlatego zostawiamy cienki drucik od wewnątrz albo dajemy nakładki na noc.',
      },
    ],
    aftercare: [
      'Noś nakładkę 22 godziny na dobę. Zdejmuj ją do jedzenia i do picia czegokolwiek poza wodą.',
      'Przed założeniem nakładki umyj zęby, bo inaczej resztki jedzenia zostają pod nią.',
      'Czyść nakładki miękką szczoteczką i chłodną wodą. Gorąca woda je odkształca.',
      'Noś ze sobą pojemnik. Nakładka zawinięta w serwetkę kończy w koszu.',
    ],
    questions: [
      {
        question: 'Czy nakładki widać?',
        answer:
          'Są przezroczyste, ale z bliska je widać, a przyciski z kompozytu mają kolor zębów. W pracy rzadko ktoś to zauważy. Przez kilka pierwszych dni może zmienić się dykcja.',
      },
      {
        question: 'Czy mogę jeść normalnie?',
        answer:
          'Tak, bo nakładki zdejmujesz do jedzenia. To główna różnica wobec aparatu stałego: nie ma zakazu jabłek i bagietek. Po jedzeniu myjesz zęby i zakładasz nakładkę z powrotem.',
      },
      {
        question: 'Co po leczeniu?',
        answer: `Bez retencji zęby wracają. Zostawiamy cienki drucik przyklejony od wewnątrz (${priceText('retainer-staly')} za łuk) albo dajemy nakładki retencyjne na noc (${priceText('nakladki-retencyjne')} za parę).`,
      },
    ],
    priceIds: [
      'konsultacja-ortodontyczna',
      'rtg-pantomograficzne',
      'nakladki-lekki',
      'nakladki-pelny',
      'nakladki-bez-limitu',
      'retainer-staly',
      'nakladki-retencyjne',
    ],
    doctorIds: ['mrozowicka'],
    diagram: 'aligner',
  },
];

export const findTreatment = (slug: TreatmentSlug) => {
  const treatment = treatments.find(entry => entry.slug === slug);
  if (!treatment) throw new Error(`Unknown treatment: ${slug}`);
  return treatment;
};

const maxDescriptionLength = 155;

export const treatmentDescription = (treatment: Treatment) => {
  const facts = `${treatment.name} we Wrocławiu. Ból: ${treatment.pain.answer.toLowerCase()}. Czas: ${treatment.duration.answer}. Cena: ${treatment.cost.answer}.`;
  const firstSentence = treatment.summary.split('. ')[0] ?? '';
  const withSummary = `${facts} ${firstSentence}.`;
  return withSummary.length <= maxDescriptionLength ? withSummary : facts;
};
