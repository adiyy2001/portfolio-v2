export const app = {
  slug: 'kielek',
  name: 'Kiełek',
  category: 'Pielęgnacja roślin domowych',
  city: 'cała Polska',
  zone: '7 roślin w 3 pokojach',
  tagline: 'Plan podlewania, który zmienia się z porą roku, diagnoza po liściach i pokoje, w których każda roślina stoi na swoim miejscu.',
};

export type Species = 'monstera' | 'calathea' | 'sansevieria' | 'epipremnum' | 'zamioculcas' | 'spathiphyllum' | 'basil';

export interface Plant {
  id: string;
  name: string;
  species: string;
  latin: string;
  glyph: Species;
  room: string;
  ml: number;
  every: string;
  tone: 'pistachio' | 'water' | 'butter' | 'blush';
}

export const plants: Record<string, Plant> = {
  zdzisia: { id: 'zdzisia', name: 'Zdzisia', species: 'Monstera dziurawa', latin: 'Monstera deliciosa', glyph: 'monstera', room: 'Salon', ml: 400, every: 'co 7 dni', tone: 'pistachio' },
  kalina: { id: 'kalina', name: 'Kalina', species: 'Kalatea', latin: 'Calathea orbifolia', glyph: 'calathea', room: 'Sypialnia', ml: 250, every: 'co 5 dni', tone: 'water' },
  szabla: { id: 'szabla', name: 'Szabla', species: 'Sansewieria', latin: 'Dracaena trifasciata', glyph: 'sansevieria', room: 'Salon', ml: 150, every: 'co 3 tygodnie', tone: 'butter' },
  lolek: { id: 'lolek', name: 'Lolek', species: 'Epipremnum złociste', latin: 'Epipremnum aureum', glyph: 'epipremnum', room: 'Kuchnia', ml: 300, every: 'co 7 dni', tone: 'pistachio' },
  zenek: { id: 'zenek', name: 'Zenek', species: 'Zamiokulkas', latin: 'Zamioculcas zamiifolia', glyph: 'zamioculcas', room: 'Salon', ml: 200, every: 'co 2 do 3 tygodni', tone: 'butter' },
  grzes: { id: 'grzes', name: 'Grześ', species: 'Skrzydłokwiat', latin: 'Spathiphyllum wallisii', glyph: 'spathiphyllum', room: 'Sypialnia', ml: 300, every: 'co 6 dni', tone: 'water' },
  bazylia: { id: 'bazylia', name: 'Bazylia', species: 'Bazylia pospolita', latin: 'Ocimum basilicum', glyph: 'basil', room: 'Kuchnia', ml: 100, every: 'co 2 dni', tone: 'pistachio' },
};

export const user = { name: 'Ola' };

export const today = {
  time: '7:52',
  date: 'Czwartek, 8 października',
  hello: 'Dzień dobry, Ola!',
  kicker: 'Dziś podlej',
  countFrom: 3,
  countTo: 2,
  mlFrom: 800,
  mlTo: 400,
  hookLine: 'Salon i sypialnia, razem 800 ml',
  section: 'Do podlania',
  list: [plants.zdzisia, plants.kalina, plants.szabla],
  button: 'Podlane',
  done: 'Podlane o 7:52',
};

export const plural = (n: number) => (n === 1 ? 'roślina' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'rośliny' : 'roślin');

export const tabs = [
  { id: 'today', label: 'Dziś' },
  { id: 'calendar', label: 'Kalendarz' },
  { id: 'diagnosis', label: 'Diagnoza' },
  { id: 'rooms', label: 'Pokoje' },
] as const;

export type TabId = (typeof tabs)[number]['id'];

export const calendar = {
  time: '7:53',
  title: 'Kalendarz',
  plant: plants.zdzisia,
  month: 'Październik 2026',
  weekdays: ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'],
  firstDay: 5,
  rows: 4,
  today: 8,
  summer: { label: 'Lato', every: 'co 7 dni', days: [8, 15, 22, 29] },
  winter: { label: 'Jesień i zima', every: 'co 12 dni', days: [8, 20, 32] },
  noteTitle: 'Zimą: co 12 dni',
  note: 'Dni są krótsze, więc Zdzisia pije rzadziej. Następne podlewanie we wtorek, 20 października.',
};

export const dayLabel = (day: number) => (day > 31 ? String(day - 31) : String(day));

export const diagnosis = {
  time: '7:55',
  title: 'Diagnoza',
  subtitle: 'Co dolega roślinie?',
  plant: plants.lolek,
  question: 'Co widzisz na liściach?',
  symptoms: ['Żółte dolne liście', 'Brązowe końcówki', 'Opadające liście', 'Plamy na liściach'],
  soilQuestion: 'Jaka jest ziemia?',
  soil: ['Mokra', 'Sucha'],
  answerTitle: 'Za dużo wody',
  answer: 'Żółte dolne liście i mokra ziemia to znak przelania. Odstaw konewkę na 10 dni i sprawdź otwory w doniczce.',
  next: 'Następne podlewanie: 18 października',
};

export const rooms = {
  time: '7:56',
  title: 'Pokoje',
  subtitle: '7 roślin w 3 pokojach',
  list: [
    { id: 'salon', name: 'Salon', window: 'okno zachodnie', light: 'jasno po południu', humidity: 52, plants: [plants.zdzisia, plants.szabla, plants.zenek] },
    { id: 'sypialnia', name: 'Sypialnia', window: 'okno północne', light: 'półcień', humidity: 41, plants: [plants.kalina, plants.grzes] },
    { id: 'kuchnia', name: 'Kuchnia', window: 'okno wschodnie', light: 'słońce rano', humidity: 58, plants: [plants.lolek, plants.bazylia] },
  ],
  focus: 'sypialnia',
  wants: 60,
  flag: 'Kalina lubi 60%',
  tip: 'Przestaw Kalinę do kuchni: 58% wilgotności i poranne słońce.',
};

export const plantScreen = {
  time: '8:01',
  plant: plants.zdzisia,
  ringDays: 12,
  ringLeft: 12,
  next: 'wtorek, 20 października',
  facts: [
    { label: 'Woda', value: '400 ml', note: 'latem co 7 dni, zimą co 12' },
    { label: 'Światło', value: 'jasne, rozproszone', note: 'metr od okna zachodniego' },
    { label: 'Wilgotność', value: '50 do 60%', note: 'w salonie jest 52%' },
    { label: 'Nawóz', value: 'co 2 tygodnie', note: 'od marca do września' },
  ],
  history: ['8.10', '1.10', '24.09', '17.09'],
};

export const addPlant = {
  time: '8:04',
  title: 'Dodaj roślinę',
  query: 'monst',
  results: [
    { name: 'Monstera dziurawa', latin: 'Monstera deliciosa', care: 'latem co 7 dni, jasne światło rozproszone', glyph: 'monstera' as Species, tone: 'pistachio' as const },
    { name: 'Monstera Adansona', latin: 'Monstera adansonii', care: 'latem co 6 dni, lubi 60% wilgotności', glyph: 'monstera' as Species, tone: 'water' as const },
    { name: 'Monstera wąskolistna', latin: 'Monstera obliqua', care: 'latem co 5 dni, tylko półcień', glyph: 'monstera' as Species, tone: 'butter' as const },
  ],
  roomsTitle: 'Gdzie postawisz?',
  rooms: ['Salon', 'Sypialnia', 'Kuchnia'],
  cta: 'Dodaj do salonu',
};

export const launch = { tagline: 'Pielęgnacja roślin' };

export const gallery = [
  { n: 1, title: 'Dziś', caption: 'Kiełek wita i mówi, co podlać: trzy rośliny, razem 800 ml. Po stuknięciu Podlane karta robi się pistacjowa, a licznik spada.' },
  { n: 2, title: 'Roślina', caption: 'Monstera Zdzisia: pierścień do następnego podlewania, 400 ml co 7 dni latem i co 12 zimą, światło, wilgotność i historia.' },
  { n: 3, title: 'Kalendarz', caption: 'Miesiąc w kroplach. Od połowy października plan sam przechodzi z 7 na 12 dni i przesuwa krople.' },
  { n: 4, title: 'Diagnoza', caption: 'Objaw i stan ziemi wystarczą do odpowiedzi: żółte dolne liście i mokra ziemia to przelanie, więc konewka odpoczywa 10 dni.' },
  { n: 5, title: 'Pokoje', caption: 'Każdy pokój ma okno, światło i wilgotność. W sypialni jest 41%, a Kalina lubi 60%, więc Kiełek podpowiada kuchnię.' },
  { n: 6, title: 'Dodaj roślinę', caption: 'Wyszukiwarka gatunków z krótką instrukcją przy każdym wyniku i wyborem pokoju, do którego trafi roślina.' },
] as const;
