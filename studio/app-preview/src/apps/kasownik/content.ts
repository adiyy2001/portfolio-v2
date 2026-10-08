export const app = {
  slug: 'kasownik',
  name: 'Kasownik',
  category: 'Bilety komunikacji miejskiej',
  city: 'Poznań',
  zone: 'Poznań, strefa A',
  tagline: 'Bilet na tramwaj i autobus w dwóch stuknięciach.',
};

export const tickets = [
  { id: 't15', label: '15 minut', price: '3,00 zł', note: 'jedna krótka jazda' },
  { id: 't45', label: '45 minut', price: '4,60 zł', note: 'z przesiadkami' },
  { id: 't90', label: '90 minut', price: '6,40 zł', note: 'z przesiadkami' },
  { id: 't24', label: '24 godziny', price: '15,00 zł', note: 'od skasowania' },
] as const;

export const suggested = {
  kicker: 'Proponowany na teraz',
  title: '45 minut, normalny',
  detail: 'Baraniaka → Ogrody, 1 przesiadka',
  price: '4,60 zł',
  cta: 'Kup',
};

export const purchase = {
  title: 'Bilet 45 minut',
  subtitle: 'Strefa A, ważny od skasowania',
  kinds: ['Normalny', 'Ulgowy'],
  quantityLabel: 'Liczba biletów',
  quantity: 1,
  payment: 'Karta',
  card: '•••• 4417',
  totalLabel: 'Do zapłaty',
  total: '4,60 zł',
  pay: 'Zapłać 4,60 zł',
  paid: 'Opłacono',
};

export const myTickets = {
  title: 'Moje bilety',
  ready: 'Gotowy do skasowania',
  validated: 'Skasowano',
  card: { title: '45 minut, normalny', meta: 'Strefa A · kupiony 7:47', price: '4,60 zł' },
  hold: 'Przytrzymaj, aby skasować',
  done: 'Bilet skasowany',
  usedTitle: 'Wykorzystane',
  used: [
    { title: '90 minut, normalny', meta: 'Wczoraj, 17:12 do 18:42' },
    { title: '24 godziny, normalny', meta: 'Poniedziałek, 6:58 do wtorku 6:58' },
  ],
};

export const liveTicket = {
  nav: 'Bilet',
  close: 'Zamknij',
  band: 'WAŻNY · 45 MIN · STREFA A',
  validatedAt: 7 * 3600 + 48 * 60 + 10,
  lengthSeconds: 45 * 60,
  validUntil: 'Ważny do 8:33:10',
  remainingLabel: 'pozostało',
  rows: [
    ['Bilet', '45 minut, normalny'],
    ['Strefa', 'A'],
    ['Skasowano', '7:48:10'],
  ] as [string, string][],
  number: 'Nr 2610 0748 3361',
  inspector: 'Pokaż kontrolerowi',
  route: 'Trasa',
  qr: 'KASOWNIK.EXAMPLE/B/261007483361',
};

export const route = {
  title: 'Trasa',
  from: 'Baraniaka',
  to: 'Ogrody',
  pill: 'Zdążysz: zostanie 27 min biletu',
  pillMinutes: 27,
  legs: [
    {
      line: '16',
      kind: 'Tramwaj',
      direction: 'kierunek Junikowo',
      stops: [
        ['7:49', 'Baraniaka'],
        ['7:51', 'Rondo Śródka'],
        ['7:58', 'Most Teatralny'],
        ['8:03', 'Rondo Kaponiera'],
      ],
    },
    {
      line: '5',
      kind: 'Tramwaj',
      direction: 'kierunek Ogrody',
      stops: [
        ['8:06', 'Rondo Kaponiera'],
        ['8:10', 'Rynek Jeżycki'],
        ['8:14', 'Ogrody'],
      ],
    },
  ],
  transfer: 'Przesiadka 3 min, ten sam przystanek',
  arrival: 'Na miejscu 8:14, bilet ważny jeszcze 19 min',
};

export const inspector = {
  title: 'Kontrola biletu',
  hint: 'Pokaż ten ekran kontrolerowi',
  brightness: 'Jasność ekranu zwiększona',
};

export const times = {
  hook: '7:52',
  buy: '7:47',
  validate: '7:48',
};

export const tabs = ['Bilety', 'Moje', 'Trasa', 'Konto'] as const;

export const gallery = [
  { n: 1, title: 'Bilety', caption: 'Proponowany bilet na trasę, którą jedziesz teraz, i pełny cennik strefy A.' },
  { n: 2, title: 'Zakup', caption: 'Arkusz od dołu: rodzaj, liczba, karta i jeden przycisk z kwotą.' },
  { n: 3, title: 'Moje bilety', caption: 'Nowy bilet na górze stosu, gotowy do skasowania.' },
  { n: 4, title: 'Kasowanie', caption: 'Przytrzymanie przez sekundę napełnia pierścień, więc bilet nie skasuje się przypadkiem.' },
  { n: 5, title: 'Bilet ważny', caption: 'Pasek płynie, kod faluje, zegar odlicza. Zrzut ekranu tego nie podrobi.' },
  { n: 6, title: 'Trasa', caption: 'Przesiadka na Rondzie Kaponiera i czas biletu, który zostanie na drugą linię.' },
  { n: 7, title: 'Kontrola', caption: 'Duży kod i zegar na rozjaśnionym ekranie, czytelne z odległości ramienia.' },
] as const;
