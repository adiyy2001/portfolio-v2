import type { Lang } from '../i18n/lang';
import type { VoucherProblem } from '../lib/voucher';
import { maxNameLength, voucherValidityMonths } from '../lib/voucher';
import { tieDeep } from '../lib/typography';
import { hotel } from './facts';

export interface VoucherText {
  title: string;
  description: string;
  heading: string;
  lead: string;
  form: {
    heading: string;
    kindLegend: string;
    kinds: { amount: string; package: string };
    packageText: (price: string) => string;
    amountLegend: string;
    customAmount: string;
    customHint: string;
    recipient: string;
    recipientHint: string;
    sender: string;
    message: string;
    messageHint: string;
    messageCount: (used: number, max: number) => string;
    submit: string;
    errorSummary: string;
    errors: Record<VoucherProblem, string>;
    tooLongName: string;
  };
  preview: {
    heading: string;
    brand: string;
    kind: { amount: string; package: string };
    packageTitle: string;
    packageDetail: string;
    forLabel: string;
    fromLabel: string;
    placeholderRecipient: string;
    placeholderSender: string;
    placeholderMessage: string;
    codeLabel: string;
    codePending: string;
    validLabel: string;
    validPending: string;
    sample: string;
    validUntil: (date: string) => string;
  };
  done: {
    heading: string;
    nothing: string;
    print: string;
    again: string;
    printHint: string;
  };
  stepsHeading: string;
  steps: { title: string; text: string }[];
  termsHeading: string;
  terms: string[];
}

const pl: VoucherText = {
  title: 'Bon podarunkowy: kwota albo weekend nad Odrą | Przęsło',
  description:
    'Bon podarunkowy do Przęsła: wybierz kwotę albo Weekend nad Odrą, wpisz dla kogo i zobacz bon na żywo. Gotowy do wydruku. Strona przykładowa.',
  heading: 'Bon podarunkowy',
  lead: 'Podarujesz kilka nocy nad Odrą bez zgadywania terminu. Ułóż bon, zobacz go od razu i wydrukuj, żeby wręczyć na papierze.',
  form: {
    heading: 'Ułóż bon',
    kindLegend: 'Rodzaj bonu',
    kinds: { amount: 'Dowolna kwota', package: 'Weekend nad Odrą' },
    packageText: price =>
      `Dwie noce od piątku w pokoju Klasycznym dla dwojga, ze śniadaniami, późnym wymeldowaniem i zestawem powitalnym. Wartość ${price}.`,
    amountLegend: 'Kwota bonu',
    customAmount: 'Inna kwota w złotych',
    customHint: 'Od 100 do 3000 zł, co 50 zł.',
    recipient: 'Dla kogo',
    recipientHint: 'Imię albo imię i nazwisko obdarowanej osoby.',
    sender: 'Od kogo',
    message: 'Życzenia',
    messageHint: 'Kilka słów na bonie. Nieobowiązkowe.',
    messageCount: (used, max) => `${used} z ${max} znaków`,
    submit: 'Pokaż gotowy bon',
    errorSummary: 'Popraw te pola, żeby zobaczyć bon:',
    errors: {
      required: 'To pole jest wymagane.',
      tooLong: 'Tekst jest za długi.',
      invalidAmount: 'Wpisz kwotę od 100 do 3000 zł, podzielną przez 50.',
    },
    tooLongName: `Wpisz najwyżej ${maxNameLength} znaków.`,
  },
  preview: {
    heading: 'Podgląd na żywo',
    brand: hotel.name,
    kind: { amount: 'Bon na pobyt', package: 'Bon na weekend' },
    packageTitle: 'Weekend nad Odrą',
    packageDetail: 'Dwie noce, pokój Klasyczny, dla dwojga',
    forLabel: 'Dla',
    fromLabel: 'Od',
    placeholderRecipient: 'imię obdarowanej osoby',
    placeholderSender: 'Twoje imię',
    placeholderMessage: 'Tu pojawią się Twoje życzenia.',
    codeLabel: 'Kod bonu',
    codePending: 'powstanie po złożeniu zamówienia',
    validLabel: 'Ważny',
    validPending: `${voucherValidityMonths} miesięcy od zakupu`,
    sample: 'Bon przykładowy: strona jest przykładowa, nic nie zostało kupione.',
    validUntil: date => `do ${date}`,
  },
  done: {
    heading: 'Bon gotowy',
    nothing: 'To strona przykładowa, więc nic nie zostało wysłane ani kupione.',
    print: 'Drukuj bon',
    again: 'Ułóż inny bon',
    printHint: 'Wydruk zawiera tylko bon, bez menu i stopki strony.',
  },
  stepsHeading: 'Jak to działa',
  steps: [
    {
      title: 'Układasz bon',
      text: 'Wybierasz kwotę albo weekend i wpisujesz dla kogo. Podgląd zmienia się na bieżąco.',
    },
    {
      title: 'Płacisz w recepcji',
      text: `W prawdziwej wersji bon opłacasz przelewem albo w recepcji (${hotel.phone}) i dostajesz go e-mailem. Tutaj nic nie jest wysyłane.`,
    },
    {
      title: 'Obdarowany rezerwuje',
      text: 'Kod bonu podaje w recepcji przy rezerwacji. Recepcja odlicza wartość od rachunku.',
    },
  ],
  termsHeading: 'Warunki bonu',
  terms: [
    `Bon jest ważny ${voucherValidityMonths} miesięcy od dnia zakupu.`,
    'Bonu nie wymieniamy na gotówkę.',
    'Wartość bonu odliczamy od rachunku za nocleg i dodatki. Jeśli rachunek jest niższy, resztę można wykorzystać przy kolejnym pobycie w okresie ważności.',
    'Bon na Weekend nad Odrą obejmuje dwie noce od piątku w pokoju Klasycznym. Dopłata za inny rodzaj pokoju jest możliwa w recepcji.',
    'Terminy podlegają dostępności pokoi.',
  ],
};

const en: VoucherText = {
  title: 'Gift voucher: an amount or a weekend by the Oder | Przęsło',
  description:
    'A gift voucher for Przęsło: pick an amount or the Weekend by the Oder, enter who it is for and see the voucher live. Ready to print. Sample website.',
  heading: 'Gift voucher',
  lead: 'Give a few nights by the Oder without guessing the date. Put the voucher together, see it at once and print it to hand over on paper.',
  form: {
    heading: 'Put the voucher together',
    kindLegend: 'Kind of voucher',
    kinds: { amount: 'Any amount', package: 'Weekend by the Oder' },
    packageText: price =>
      `Two nights from Friday in a Classic room for two, with breakfasts, late check-out and a welcome set. Value ${price}.`,
    amountLegend: 'Voucher amount',
    customAmount: 'Another amount in zloty',
    customHint: 'From 100 to 3000 zł, in steps of 50.',
    recipient: 'For',
    recipientHint: 'First name, or first and last name, of the person receiving it.',
    sender: 'From',
    message: 'Message',
    messageHint: 'A few words on the voucher. Optional.',
    messageCount: (used, max) => `${used} of ${max} characters`,
    submit: 'Show the finished voucher',
    errorSummary: 'Fix these fields to see the voucher:',
    errors: {
      required: 'This field is required.',
      tooLong: 'The text is too long.',
      invalidAmount: 'Enter an amount from 100 to 3000 zł that divides by 50.',
    },
    tooLongName: `Enter at most ${maxNameLength} characters.`,
  },
  preview: {
    heading: 'Live preview',
    brand: hotel.name,
    kind: { amount: 'Stay voucher', package: 'Weekend voucher' },
    packageTitle: 'Weekend by the Oder',
    packageDetail: 'Two nights, Classic room, for two',
    forLabel: 'For',
    fromLabel: 'From',
    placeholderRecipient: 'name of the person receiving it',
    placeholderSender: 'your name',
    placeholderMessage: 'Your message will appear here.',
    codeLabel: 'Voucher code',
    codePending: 'created when you place the order',
    validLabel: 'Valid',
    validPending: `${voucherValidityMonths} months from purchase`,
    sample: 'Sample voucher: this is a sample website, nothing was bought.',
    validUntil: date => `until ${date}`,
  },
  done: {
    heading: 'Voucher ready',
    nothing: 'This is a sample website, so nothing was sent or bought.',
    print: 'Print voucher',
    again: 'Make another voucher',
    printHint: 'The printout holds only the voucher, without the menu and footer.',
  },
  stepsHeading: 'How it works',
  steps: [
    {
      title: 'You make the voucher',
      text: 'You pick an amount or the weekend and enter who it is for. The preview changes as you type.',
    },
    {
      title: 'You pay at reception',
      text: `In the real version you pay by transfer or at reception (${hotel.phone}) and get the voucher by e-mail. Here nothing is sent.`,
    },
    {
      title: 'The receiver books',
      text: 'They give the voucher code at reception when booking. Reception deducts its value from the bill.',
    },
  ],
  termsHeading: 'Voucher terms',
  terms: [
    `The voucher is valid for ${voucherValidityMonths} months from the day of purchase.`,
    'The voucher cannot be exchanged for cash.',
    'Its value is deducted from the bill for the room and extras. If the bill is lower, the rest can be used on another stay within the validity period.',
    'The Weekend by the Oder voucher covers two nights from Friday in a Classic room. A surcharge for another room type is possible at reception.',
    'Dates depend on room availability.',
  ],
};

export const voucherText: Record<Lang, VoucherText> = { pl: tieDeep(pl), en: tieDeep(en) };
