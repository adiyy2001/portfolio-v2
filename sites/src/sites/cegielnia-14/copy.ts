import { totalUnits, types } from './data';
import { plural } from './format';
import { addressLine, hoursText, site } from './site';

const lowestArea = Math.min(...types.map(type => type.area));
const highestArea = Math.max(...types.map(type => type.area));

export const areaRange = `od ${lowestArea} do ${highestArea} m²`;

export const meta = {
  home: {
    title: 'Cegielnia 14. Lofty na Ołbinie we Wrocławiu',
    description:
      'Lofty w dawnej cegielni na Ołbinie we Wrocławiu. W 1894 roku wypalono tu pierwszą cegłę.',
  },
  units: {
    title: 'Lofty na sprzedaż. Cegielnia 14',
    description: `${totalUnits} loftów ${areaRange} w dawnej cegielni na Ołbinie. Lista z filtrem po liczbie pokoi, piętrze i statusie, ceny i rzuty.`,
  },
  gallery: {
    title: 'Galeria. Cegielnia 14',
    description:
      'Ceglane mury, łuki okien i rysunki wnętrz Cegielni 14. Kadry są ilustracyjne, rysunki wnętrz poglądowe.',
  },
  location: {
    title: 'Lokalizacja. Cegielnia 14',
    description: `Cegielnia 14 stoi przy ${site.street} na wrocławskim Ołbinie. Tramwaj jest 3 minuty pieszo, Ogród Botaniczny 10 minut.`,
  },
  office: {
    title: 'Biuro sprzedaży. Cegielnia 14',
    description: `Umów pokaz w biurze sprzedaży Cegielni 14, ${addressLine}. Pokazy ${hoursText}.`,
  },
  credits: {
    title: 'Źródła zdjęć. Cegielnia 14',
    description:
      'Autor fotografii, licencja i lista zmian w kadrach użytych na stronie Cegielni 14.',
  },
};

export const hero = {
  headline: 'W 1894 roku wypalono tu pierwszą cegłę.',
  caption: `${totalUnits} loftów ${areaRange} przy ul. Cegielnianej. Łukowe okna i ${site.ceiling} m pod stropem.`,
  link: 'Umów pokaz',
};

export const history = {
  mark: 'Historia',
  headline: 'Od 1894 roku mur nie widział tynku.',
  first: `Cegielnię na Ołbinie uruchomiono w ${site.builtYear} roku. Wypalano tu cegłę na kamienice pół Wrocławia, a łuki okien murowano ręcznie, jeden po drugim.`,
  second:
    'Zostawiamy cegłę, ślady po wózkach i oryginalne łuki. Do środka wchodzi światło i cisza grubych murów.',
  reel: [
    { year: String(site.builtYear), label: 'Piec i komin' },
    { year: '1946', label: 'Suszarnia i hala' },
    { year: String(site.openYear), label: `${totalUnits} loftów` },
  ],
};

export const planNote = {
  base: 'Północ u góry, okna od południa na dole. Powierzchnie w świetle ścian. Wejście od północy. Łuk przy drzwiach pokazuje, w którą stronę się otwierają.',
  extra: {
    '37': 'Piec oznaczono na rzucie.',
    '52': 'Kreskowany kwadrat to murowany trzon komina.',
    '64': '',
    '112': 'Taras nie wchodzi do sumy.',
  },
} as const;

export const interiorCaption =
  'Rysunek poglądowy salonu od strony przedpokoju, nie zdjęcie. Meble są przykładowe.';

export const sun = {
  mark: 'Światło dnia',
  headline: 'Okna wychodzą na południe.',
  intro: 'Wybierz loft, dzień roku i godzinę. Pokazujemy, ile słońca wpada do salonu.',
  tableCaption: 'Godziny bezpośredniego słońca w salonie między 8:00 a 18:00',
  rangeLabel: 'Godzina dnia, od 8:00 do 18:00',
  play: 'Odtwórz dzień',
  pause: 'Zatrzymaj',
  next: 'Następna godzina',
  note: 'Model uwzględnia szerokość geograficzną Wrocławia, wysokość okien i głębokość salonu. To obliczenie poglądowe, bez zacienienia przez sąsiednie budynki.',
};

export const where = {
  mark: 'Adres i pokazy',
  headline: `Pokazy ${hoursText}.`,
  formHeading: 'Umów pokaz',
  formLead: 'Zostaw imię i telefon. Oddzwonimy i ustalimy godzinę pokazu.',
  nearLabel: 'Odległości pieszo',
  near: [
    { minutes: 3, place: 'Tramwaj i rowery miejskie' },
    { minutes: 5, place: 'Park Stanisława Tołpy' },
    { minutes: 8, place: 'Kościół św. Michała Archanioła' },
    { minutes: 10, place: 'Ogród Botaniczny' },
  ],
};

export const unitsPage = {
  mark: 'Oferta',
  headline: 'Lofty na sprzedaż',
  lead: `${totalUnits} loftów w czterech układach, ${areaRange}. Zawęź listę po liczbie pokoi, piętrze i statusie.`,
  summaryLabel: 'Układy loftów',
  filterLabel: 'Filtry listy loftów',
  tableLabel: 'Lista loftów',
  empty: 'Żaden loft nie spełnia wybranych filtrów.',
  reset: 'Wyczyść filtry',
  noScript:
    'Bez JavaScriptu lista pokazuje wszystkie lofty. Filtry włączają się po załadowaniu strony.',
  legend: { rooms: 'Pokoje', floor: 'Piętro', status: 'Status' },
  cols: {
    loft: 'Loft',
    floor: 'Piętro',
    rooms: 'Pokoje',
    area: 'Powierzchnia',
    price: 'Cena',
    status: 'Stan',
  },
  count: (shown: number, total: number) => `Pokazano ${shown} z ${total} loftów`,
  typeLink: 'Pokaż ten układ',
  typeFree: (free: number, all: number) => `Wolne: ${free} z ${all}`,
};

export const detail = {
  formIntro: 'Zostaw imię i telefon. Oddzwonimy i ustalimy godzinę pokazu tego lofta.',
  soldNote:
    'Ten loft jest sprzedany. Zostaw numer, a doradca wskaże wolny loft o podobnym układzie.',
  reservedNote:
    'Ten loft jest zarezerwowany. Jeśli rezerwacja wygaśnie, wróci do sprzedaży. Zostaw numer, a damy znać.',
  paramsLabel: 'Skrót parametrów',
  formHeading: 'Umów pokaz tego lofta',
  sunHeading: 'Słońce w salonie',
  sunDay: 'Dzień',
  sunHours: 'Godziny słońca',
  sunOwn: 'Sprawdź własną godzinę',
  sunLead:
    'Godziny bezpośredniego słońca w salonie w tym układzie, między 8:00 a 18:00. Własne godziny sprawdzisz w narzędziu na stronie głównej.',
  similarHeading: 'Wolne lofty o tym układzie',
  similarEmpty: 'Wszystkie lofty o tym układzie są już zajęte.',
};

export const gallery = {
  mark: 'Zdjęcia i rysunki',
  headline: 'Cegła, łuki i wnętrza',
  lead: 'Osiem kadrów ceglanej elewacji i cztery rysunki wnętrz.',
  note: 'Fotografia przedstawia inny, prawdziwy budynek z cegły. Ma pokazać fakturę muru i kształt okien, a Cegielnia 14 jest zmyślona. Autora i licencję podajemy na stronie źródeł.',
  drawingsHeading: 'Rysunki wnętrz',
  drawingsLead: 'Rysunki poglądowe, nie zdjęcia. Meble są przykładowe.',
  photosHeading: 'Elewacja',
};

export const location = {
  mark: 'Dzielnica',
  headline: 'Ołbin, pięć minut od parku',
  lead: `Cegielnia 14 stoi przy ${site.street}, ${site.postcode} ${site.city}, na Ołbinie. Tramwaj i rowery miejskie są trzy minuty od bramy.`,
  diagramHeading: 'Co jest w zasięgu spaceru',
  diagramNote: 'Schemat odległości w minutach marszu, nie mapa. Kierunki są umowne.',
  officeHeading: 'Biuro sprzedaży',
  officeText: `Biuro mieści się w dawnej bramie cegielni pod adresem ${addressLine}. Pokazy ${hoursText}, bez wcześniejszego zapisu.`,
};

export const office = {
  mark: 'Sprzedaż',
  headline: 'Umów pokaz',
  lead: 'W biurze przejrzysz rzuty i ceny, a potem zobaczysz wybrany loft na miejscu. Pokaz trwa godzinę.',
  factsLabel: 'Dane biura',
  formHeading: 'Zostaw dane',
  formLead: 'Oddzwonimy i ustalimy godzinę pokazu.',
  storedHeading: 'Zgłoszenia z tej przeglądarki',
  storedLead: 'Zapisujemy je tylko w tej przeglądarce, na tym urządzeniu. Nigdzie nie wychodzą.',
  storedEmpty: 'Nie ma jeszcze żadnego zgłoszenia.',
  storedClear: 'Wyczyść listę',
};

export const form = {
  name: 'Imię',
  phone: 'Telefon',
  email: 'Adres e-mail',
  emailHint: 'Nieobowiązkowo.',
  loft: 'Który loft cię interesuje',
  loftAny: 'Jeszcze nie wiem',
  message: 'Wiadomość',
  messageHint: 'Nieobowiązkowo.',
  consent:
    'Zgadzam się, żeby biuro oddzwoniło w sprawie pokazu. To strona przykładowa, więc moje dane nigdzie nie trafią.',
  submit: 'Wyślij',
  submitFull: 'Umów pokaz',
  summary: (count: number) => `Do poprawy: ${count} ${plural(count, 'pole', 'pola', 'pól')}.`,
  doneTitle: (ref: string) => `Zgłoszenie ${ref}: to tylko próba, nic nie wysłano.`,
  doneText: `To strona przykładowa, więc nic nie zostało wysłane. Prawdziwe biuro oddzwoniłoby i umówiło pokaz. Pokazy odbywają się ${hoursText}.`,
  again: 'Wypełnij ponownie',
  noScriptLead: 'Formularz działa z JavaScriptem. Zadzwoń pod numer',
  noScriptOr: 'albo napisz na',
  quickNote: 'To strona przykładowa, więc nic nie zostanie wysłane.',
  unitFor: (code: string) => `Dotyczy lofta ${code}.`,
};

export const credits = {
  mark: 'Autorzy i licencje',
  headline: 'Źródła zdjęć',
  intro:
    'Zdjęcia elewacji na stronie są wycinkami jednej fotografii. Rysunki wnętrz i rzuty loftów są własnymi rysunkami wykonanymi na potrzeby tej strony i nie zawierają cudzych materiałów.',
  photoHeading: 'Fotografia elewacji',
  photoNote:
    'Fotografia przedstawia inny budynek, dawną stację sprężarek przędzalni Dietla z lat 1912 do 1914. Na tej stronie jest tłem ilustracyjnym. Cegielnia 14 jest zmyślona i takiego budynku nie ma.',
  photoRows: [
    ['Autor', 'Krzysztof Popławski'],
    [
      'Tytuł',
      'Dawny budynek turbiny i stacji sprężarek przędzalni Dietla 1912-1914, PL.1.9.ZIPOZ.NID_E_24_BK.283370, czerwiec 2024, 033.jpg',
    ],
  ],
  sourceLabel: 'Wikimedia Commons',
  sourceHref:
    'https://commons.wikimedia.org/wiki/File:Dawny_budynek_turbiny_i_stacji_spr%C4%99%C5%BCarek_prz%C4%99dzalni_Dietla_1912-1914,_PL.1.9.ZIPOZ.NID_E_24_BK.283370,_czerwiec_2024_,_033.jpg',
  licenceLabel: 'CC BY 4.0',
  licenceHref: 'https://creativecommons.org/licenses/by/4.0/',
  changes:
    'Zmiany: usunięto słup i kable sprzed elewacji, fotografię pocięto na kadry poziome i pionowe, odbarwiono, przyciemniono, nałożono sepię i jednolite ziarno filmowe, zapisano jako WebP. Warstwa podświetlona w narzędziu słońca to ten sam kadr co warstwa ciemna, rozjaśniony.',
  framesHeading: 'Kadry',
  frames: [
    ['hero', 'środkowe okna z łukami i okrągłe okno'],
    ['historia', 'lewy komin i szczyt'],
    ['loft 37 m²', 'prawe okno z łukiem'],
    ['loft 52 m²', 'okno środkowe z gzymsem'],
    ['loft 64 m²', 'ściana szczytowa'],
    ['loft 112 m²', 'cała elewacja o zmierzchu'],
    ['słońce', 'okno z łukiem i arkady ściany bocznej'],
    ['adres', 'prawy komin z brzozami'],
  ],
  typeHeading: 'Rysunki i krój pisma',
  typeText:
    'Rzuty i rysunki perspektywiczne wnętrz są własnością autora strony. Krój Archivo, licencja SIL Open Font License 1.1, dystrybucja Fontsource. Autor kroju:',
  typeHref: 'https://github.com/Omnibus-Type/Archivo',
  typeLabel: 'Omnibus-Type',
  back: 'Wróć do strony głównej',
};

export const footer = {
  seller: `Sprzedaje ${site.seller}, biuro sprzedaży ${addressLine}. NIP ${site.nip}, KRS ${site.krs}. Krój Archivo, licencja OFL.`,
  stopOn: 'Zatrzymaj ruch tła',
  stopOff: 'Włącz ruch tła',
  credits: 'Źródła zdjęć',
};
