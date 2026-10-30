const A = 'A';
const AA = 'AA';

const official = [
  ['1.1.1', A, 'Treść nietekstowa'],
  ['1.2.1', A, 'Tylko audio lub tylko wideo (nagranie)'],
  ['1.2.2', A, 'Napisy rozszerzone (nagranie)'],
  ['1.2.3', A, 'Audiodeskrypcja lub alternatywa tekstowa dla mediów (nagranie)'],
  ['1.2.4', AA, 'Napisy rozszerzone (na żywo)'],
  ['1.2.5', AA, 'Audiodeskrypcja (nagranie)'],
  ['1.3.1', A, 'Informacje i relacje'],
  ['1.3.2', A, 'Zrozumiała kolejność'],
  ['1.3.3', A, 'Właściwości zmysłowe'],
  ['1.3.4', AA, 'Orientacja'],
  ['1.3.5', AA, 'Określenie pożądanej wartości'],
  ['1.4.1', A, 'Użycie koloru'],
  ['1.4.2', A, 'Kontrola odtwarzania dźwięku'],
  ['1.4.3', AA, 'Kontrast (minimum)'],
  ['1.4.4', AA, 'Zmiana rozmiaru tekstu'],
  ['1.4.5', AA, 'Obrazy tekstu'],
  ['1.4.10', AA, 'Dopasowanie do ekranu'],
  ['1.4.11', AA, 'Kontrast elementów nietekstowych'],
  ['1.4.12', AA, 'Odstępy w tekście'],
  ['1.4.13', AA, 'Treść spod kursora lub fokusu'],
  ['2.1.1', A, 'Klawiatura'],
  ['2.1.2', A, 'Bez pułapki na klawiaturę'],
  ['2.1.4', A, 'Jednoznakowe skróty klawiaturowe'],
  ['2.2.1', A, 'Dostosowanie czasu'],
  ['2.2.2', A, 'Pauza, zatrzymanie, ukrycie'],
  ['2.3.1', A, 'Trzy błyski lub wartości poniżej progu'],
  ['2.4.1', A, 'Możliwość pominięcia bloków'],
  ['2.4.2', A, 'Tytuł strony'],
  ['2.4.3', A, 'Kolejność fokusu'],
  ['2.4.4', A, 'Cel łącza (w kontekście)'],
  ['2.4.5', AA, 'Wiele dróg'],
  ['2.4.6', AA, 'Nagłówki i etykiety'],
  ['2.4.7', AA, 'Widoczny fokus'],
  ['2.5.1', A, 'Gesty dotykowe'],
  ['2.5.2', A, 'Rezygnacja ze wskazania'],
  ['2.5.3', A, 'Etykieta w nazwie'],
  ['2.5.4', A, 'Aktywowanie ruchem'],
  ['3.1.1', A, 'Język strony'],
  ['3.1.2', AA, 'Język części'],
  ['3.2.1', A, 'Po otrzymaniu fokusu'],
  ['3.2.2', A, 'Podczas wprowadzania danych'],
  ['3.2.3', AA, 'Spójna nawigacja'],
  ['3.2.4', AA, 'Spójna identyfikacja'],
  ['3.3.1', A, 'Identyfikacja błędu'],
  ['3.3.2', A, 'Etykiety lub instrukcje'],
  ['3.3.3', AA, 'Sugestie korekty błędów'],
  ['3.3.4', AA, 'Zapobieganie błędom (prawnym, finansowym, w danych)'],
  ['4.1.1', A, 'Poprawność kodu'],
  ['4.1.2', A, 'Nazwa, rola, wartość'],
  ['4.1.3', AA, 'Komunikaty o stanie'],
];

const addedInWcag22 = [
  ['2.4.11', AA, 'Fokus nie jest zasłonięty (minimum)'],
  ['2.5.7', AA, 'Ruchy przeciągania'],
  ['2.5.8', AA, 'Rozmiar celu (minimum)'],
  ['3.2.6', A, 'Spójna pomoc'],
  ['3.3.7', A, 'Redundantne wprowadzanie danych'],
  ['3.3.8', AA, 'Uwierzytelnianie dostępne (minimum)'],
];

export const WCAG_22_LABEL = 'WCAG 2.2, EN 301 549 V4.1.1';
export const WCAG_21_LABEL = 'WCAG 2.1, EN 301 549 V3.2.1';

export const WCAG_PL = Object.fromEntries([
  ...official.map(([id, level, name]) => [id, { id, level, name, since: '2.0/2.1' }]),
  ...addedInWcag22.map(([id, level, name]) => [id, { id, level, name, since: '2.2' }]),
]);

export function criterionSort(a, b) {
  const left = a.split('.').map(Number);
  const right = b.split('.').map(Number);
  for (let i = 0; i < 3; i += 1) if (left[i] !== right[i]) return left[i] - right[i];
  return 0;
}
