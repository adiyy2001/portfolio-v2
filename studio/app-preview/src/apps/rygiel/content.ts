export const app = {
  slug: 'rygiel',
  name: 'Rygiel',
  category: 'Menedżer haseł z alertami wycieków',
  city: 'cała Polska',
  zone: 'sejf 214 wpisów',
  tagline: 'Alert o wycieku w kilka godzin, nowe hasło w trzy sekundy i sejf, który pokazuje, co poprawić.',
};

export const user = {
  email: 'a.kowalczyk@skrzynka.example',
  nick: 'szczupak_77',
};

export const breach = {
  service: 'Forum Wędkarskie Mazury',
  domain: 'forum.wedkarze-mazury.example',
  leaked: '2.10.2026',
  detected: '6.10.2026, 07:12',
  accounts: '38 412 kont',
  items: ['e-mail', 'nick', 'skrót hasła'],
  safe: ['telefon', 'adres', 'karta'],
};

export const alert = {
  time: '7:14',
  label: 'ALERT WYCIEKU',
  kicker: 'WYCIEK DANYCH',
  title: 'Twój adres e-mail pojawił się w wycieku',
  rows: [
    ['Serwis', breach.service],
    ['Wyciek', breach.leaked],
    ['Wykryty', breach.detected],
    ['Wyciekło', 'e-mail, nick, skrót hasła'],
  ] as [string, string][],
  primary: 'Zmień hasło teraz',
  secondary: 'Szczegóły wycieku',
};

export const details = {
  time: '7:14',
  title: 'Szczegóły wycieku',
  timeline: [
    { when: '2.10.2026', what: 'Wyciek z serwisu', note: `Baza ${breach.accounts} trafiła do sieci` },
    { when: '6.10.2026, 07:12', what: 'Rygiel wykrył Twój adres', note: 'Po 4 dniach od wycieku' },
    { when: 'teraz', what: 'Twoja kolej', note: 'Zmień hasło do forum' },
  ],
  leakedTitle: 'Co wyciekło',
  safeTitle: 'Nie wyciekło',
  entry: {
    title: 'Wpis w sejfie',
    name: breach.service,
    login: user.nick,
    warning: 'to samo hasło w 2 innych serwisach',
  },
  primary: 'Zmień hasło teraz',
};

export const generator = {
  time: '7:15',
  title: 'Nowe hasło',
  for: breach.service,
  password: 'k7#Vq2!rTz9pL$w4Hn8e',
  length: 20,
  classes: ['abc', 'ABC', '123', '#$!'],
  strength: 'bardzo mocne',
  bits: 'ok. 131 bitów',
  formula: '20 znaków, każdy z 94 możliwych',
  primary: 'Użyj tego hasła',
  done: 'Hasło zmienione',
};

export const lock = {
  time: '7:16',
  title: 'Sejf zablokowany',
  open: 'Sejf otwarty',
  hint: 'Przyłóż palec, aby otworzyć',
  entries: '214 wpisów',
};

export const vault = {
  time: '7:16',
  title: 'Sejf',
  search: 'Szukaj w 214 wpisach',
  filters: [
    { label: 'Wszystkie', count: '214', tone: 'text' },
    { label: 'Słabe', count: '9', tone: 'warn' },
    { label: 'Powtórzone', count: '4', tone: 'warn' },
    { label: 'Z wycieku', count: '2', tone: 'alert' },
  ],
  rows: [
    { mono: 'FW', name: breach.service, login: user.nick, tag: 'zmienione dziś', tone: 'cyan' },
    { mono: 'SK', name: 'Skrzynka', login: user.email, tag: 'mocne', tone: 'muted' },
    { mono: 'BO', name: 'Bank osobisty', login: 'klient 4417 0921', tag: 'mocne', tone: 'muted' },
    { mono: 'BK', name: 'Bilety kolejowe', login: 'a.kowalczyk', tag: 'hasło z wycieku', tone: 'alert' },
    { mono: 'PO', name: 'Przychodnia online', login: 'a.kowalczyk', tag: 'słabe', tone: 'warn' },
    { mono: 'ZC', name: 'Zdjęcia w chmurze', login: user.email, tag: 'mocne', tone: 'muted' },
    { mono: 'SR', name: 'Sklep rowerowy', login: user.nick, tag: 'hasło z wycieku', tone: 'alert' },
    { mono: 'BM', name: 'Biblioteka miejska', login: 'karta 0048 1127', tag: 'powtórzone', tone: 'warn' },
  ],
};

export const health = {
  time: '21:38',
  title: 'Zdrowie sejfu',
  from: 68,
  to: 96,
  label: 'na 100',
  healthy: 'Sejf zdrowy',
  counts: [
    { label: 'Słabe', from: 9, to: 1, tone: 'warn' },
    { label: 'Powtórzone', from: 4, to: 0, tone: 'warn' },
    { label: 'Z wycieku', from: 2, to: 0, tone: 'alert' },
  ],
  listTitle: 'Do poprawy dziś wieczorem',
  issues: [
    { name: 'Bilety kolejowe', issue: 'hasło z wycieku', tone: 'alert' },
    { name: 'Sklep rowerowy', issue: 'hasło z wycieku', tone: 'alert' },
    { name: 'Przychodnia online', issue: 'słabe', tone: 'warn' },
    { name: 'Biblioteka miejska', issue: 'powtórzone', tone: 'warn' },
    { name: 'i 10 kolejnych', issue: 'słabe i powtórzone', tone: 'warn' },
  ],
  left: 'Zostało 1 słabe: stary router, zmienisz na miejscu',
};

export const entry = {
  time: '7:17',
  name: breach.service,
  domain: breach.domain,
  login: user.nick,
  email: user.email,
  password: generator.password,
  changed: '6.10.2026, 07:16',
  bits: '131 bitów',
  copy: 'Kopiuj hasło',
  copyNote: 'schowek wyczyści się po 30 s',
};

export const launch = { tagline: 'MENEDŻER HASEŁ' };

export const log = [
  { at: 0, time: '07:12:04', text: 'skan wycieków: 214 wpisów', tone: 'muted' },
  { at: 20, time: '07:12:09', text: 'ALERT forum.wedkarze-mazury', tone: 'alert' },
  { at: 200, time: '07:15:31', text: 'nowe hasło: 20 znaków, 131 bitów', tone: 'text' },
  { at: 300, time: '07:16:02', text: 'hasło zmienione', tone: 'cyan' },
  { at: 380, time: '07:16:40', text: 'sejf otwarty: 214 wpisów', tone: 'text' },
  { at: 500, time: '21:38:12', text: 'naprawiono 14 haseł', tone: 'text' },
  { at: 560, time: '21:38:40', text: 'zdrowie sejfu: 96 na 100', tone: 'cyan' },
] as const;

export const gallery = [
  { n: 1, title: 'Alert wycieku', caption: 'Karta w kolorze alarmu: serwis, data wycieku, godzina wykrycia i co wyciekło. Jeden przycisk prowadzi do zmiany hasła.' },
  { n: 2, title: 'Wyciek z bliska', caption: 'Oś czasu od wycieku do wykrycia, lista tego, co wyciekło i co nie, oraz wpis z sejfu, którego to dotyczy.' },
  { n: 3, title: 'Generator', caption: '20 znaków z czterech klas, około 131 bitów. Każdy znak w osobnym polu, więc hasło da się przepisać z ekranu.' },
  { n: 4, title: 'Sejf', caption: 'Lista wpisów z filtrami słabych i powtórzonych haseł. Wpis forum ma już znacznik „zmienione dziś”.' },
  { n: 5, title: 'Zdrowie sejfu', caption: 'Wynik 96 na 100 po jednym wieczorze: żadnego hasła z wycieku, żadnego powtórzonego, jedno słabe do zmiany.' },
  { n: 6, title: 'Wpis', caption: 'Login, e-mail i hasło odsłonięte przez odszyfrowanie. Data zmiany i siła hasła pod spodem.' },
] as const;
