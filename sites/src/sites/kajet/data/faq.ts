import { grossFrom, plans } from './plans';
import { facts } from './site';
import { formatPrice } from '../lib/format';

export interface FaqItem {
  q: string;
  a: string;
}

export const homeFaq: readonly FaqItem[] = [
  {
    q: 'Czy prowadzicie firmy na ryczałcie?',
    a: 'Tak. Dla osób fizycznych prowadzimy ryczałt, skalę podatkową i podatek liniowy. Dla spółek z o.o. rozliczamy CIT.',
  },
  {
    q: 'Jak przekazuję dokumenty?',
    a: `Faktury wysyłasz zdjęciem lub plikiem na skrzynkę biura. Dokumenty papierowe odbieramy ${facts.paperPickupEvery} z firm w Gajowicach. Klienci z innych dzielnic wysyłają skany albo przywożą papier do biura.`,
  },
  {
    q: 'Ile trwa przejęcie ksiąg od innego biura?',
    a: 'Zwykle dwa tygodnie. Zaczynamy od spisu dokumentów i rozmowy z poprzednim biurem, potem przejmujemy bieżący miesiąc.',
  },
  {
    q: 'Kto rozmawia z urzędem skarbowym?',
    a: 'W planie Duży my, na podstawie pełnomocnictwa. W planach Mały i Średni przygotowujemy dokumenty i pisma, a do urzędu wysyłasz je sam.',
  },
];

export const planFaq: readonly FaqItem[] = [
  {
    q: 'Czy ceny zawierają VAT?',
    a: `Nie, ceny są netto. VAT 23% dolicza się do faktury, więc plan Mały dla osoby fizycznej kosztuje ${formatPrice(grossFrom(plans[0]!.price.osoba))} zł brutto miesięcznie.`,
  },
  {
    q: 'Co się dzieje, gdy mam więcej faktur niż limit planu?',
    a: 'Nie dopłacasz za sztukę. Od następnego miesiąca przechodzisz na wyższy plan. Powyżej 200 faktur w miesiącu wyceniamy firmę osobno.',
  },
  {
    q: 'Czy mogę zmienić plan w trakcie umowy?',
    a: 'Tak, zmiana obowiązuje od pierwszego dnia następnego miesiąca. Niższy plan wybierzesz, jeśli przez trzy miesiące mieścisz się w jego limicie.',
  },
  {
    q: 'Jak długo trwa umowa i jak ją wypowiedzieć?',
    a: 'Umowa jest na czas nieokreślony. Wypowiadasz ją na piśmie z miesięcznym wyprzedzeniem, ze skutkiem na koniec miesiąca.',
  },
  {
    q: 'Dlaczego spółka płaci więcej niż osoba fizyczna?',
    a: 'W spółce prowadzimy księgi handlowe, składamy sprawozdanie finansowe i częściej mamy pracowników. To więcej pracy przy tej samej liczbie faktur.',
  },
];

export const serviceFaq: readonly FaqItem[] = [
  homeFaq[0]!,
  homeFaq[1]!,
  {
    q: 'Czy obsługujecie firmy bez VAT?',
    a: 'Tak. Podatnikom zwolnionym z VAT prowadzimy ewidencję, ZUS i zaliczki. Pliku JPK_V7 wtedy nie składamy.',
  },
  {
    q: 'Czy pomagacie przy zmianie formy opodatkowania?',
    a: 'Tak. Na rozmowie porównujemy skalę, podatek liniowy i ryczałt dla Twoich liczb. Oświadczenie o zmianie składamy w terminie do 20 lutego.',
  },
  homeFaq[3]!,
];

export const ksefFaq: readonly FaqItem[] = [
  {
    q: 'Czy muszę sam wystawiać faktury w KSeF?',
    a: 'Wystawiasz je w programie do faktur połączonym z KSeF albo w aplikacji Ministerstwa Finansów. Biuro ma wtedy dostęp do faktur i pobiera je do ksiąg.',
  },
  {
    q: 'Czy biuro pobiera faktury kosztowe z KSeF?',
    a: 'Tak, po nadaniu uprawnień do Twoich faktur. Nie musisz niczego przesyłać na skrzynkę biura.',
  },
  {
    q: 'Co robię, gdy KSeF nie działa?',
    a: 'Wystawiasz fakturę w trybie offline24 albo zgodnie z komunikatem Ministerstwa Finansów. Przy awarii (art. 106nf) wystawiasz fakturę elektroniczną z kodami QR i wysyłasz ją do KSeF w ciągu 7 dni roboczych od końca awarii. Przy awarii całkowitej (art. 106ng) wystawiasz ją papierowo albo elektronicznie i nie wysyłasz do KSeF.',
  },
  {
    q: 'Czy muszę wpisywać numer KSeF w przelewie?',
    a: 'Od 1 stycznia 2027 roku tak, gdy jesteś czynnym podatnikiem VAT i płacisz za fakturę innemu czynnemu podatnikowi VAT. Numer ma 35 znaków.',
  },
];
