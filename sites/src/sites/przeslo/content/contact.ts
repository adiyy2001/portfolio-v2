import type { Lang } from '../i18n/lang';
import type { ContactProblem, ContactTopic } from '../lib/contact';
import { maxContactMessageLength } from '../lib/contact';
import { tieDeep } from '../lib/typography';
import { hotel } from './facts';

export interface FaqItem {
  question: string;
  answer: string[];
}

export interface ContactText {
  title: string;
  description: string;
  heading: string;
  lead: string;
  detailsHeading: string;
  details: { label: string; value: string; href?: string }[];
  findHeading: string;
  find: string;
  form: {
    heading: string;
    lead: string;
    name: string;
    email: string;
    topic: string;
    topics: Record<ContactTopic, string>;
    message: string;
    messageHint: string;
    messageCount: (used: number, max: number) => string;
    submit: string;
    errorSummary: string;
    errors: Record<ContactProblem, string>;
    sentHeading: string;
    sentText: string;
    sentNothing: string;
    again: string;
  };
  faqHeading: string;
  faqLead: string;
  faq: FaqItem[];
}

const pl: ContactText = {
  title: 'Kontakt i pytania | Przęsło',
  description:
    'Kontakt z hotelem Przęsło przy ul. Grodzkiej 31 we Wrocławiu: telefon, e-mail, godziny recepcji i odpowiedzi na najczęstsze pytania o zameldowanie, parking i zwierzęta.',
  heading: 'Kontakt',
  lead: 'Recepcja odbiera telefon od 7:00 do 22:00. Na e-maile odpowiadamy tego samego dnia roboczego.',
  detailsHeading: 'Jak nas znaleźć',
  details: [
    { label: 'Adres', value: `${hotel.street}, ${hotel.postalCode} ${hotel.city}` },
    { label: 'Telefon', value: hotel.phone, href: hotel.phoneHref },
    { label: 'E-mail', value: hotel.email, href: hotel.emailHref },
    { label: 'Recepcja', value: `${hotel.receptionOpens}-${hotel.receptionCloses}, codziennie` },
    { label: 'Zameldowanie i wymeldowanie', value: `od ${hotel.checkIn}, do ${hotel.checkOut}` },
  ],
  findHeading: 'Wejście',
  find: 'Wejście główne jest od ulicy Grodzkiej, recepcja na parterze. Winda dojeżdża na wszystkie cztery piętra. Parking dla gości jest przy sąsiedniej ulicy, kilkadziesiąt kroków od drzwi.',
  form: {
    heading: 'Napisz do nas',
    lead: 'Formularz nie ma serwera, więc nic z niego nie wyjdzie. W prawdziwej wersji odpowiedź przyszłaby e-mailem.',
    name: 'Imię i nazwisko',
    email: 'Adres e-mail',
    topic: 'Temat',
    topics: {
      booking: 'Pytanie o rezerwację',
      change: 'Zmiana terminu',
      group: 'Grupa albo kilka pokoi',
      voucher: 'Bon podarunkowy',
      other: 'Coś innego',
    },
    message: 'Wiadomość',
    messageHint: 'Napisz, o co chodzi, i podaj daty, jeśli je znasz.',
    messageCount: (used, max) => `${used} z ${max} znaków`,
    submit: 'Wyślij wiadomość',
    errorSummary: 'Popraw te pola, żeby wysłać wiadomość:',
    errors: {
      required: 'To pole jest wymagane.',
      invalidName: 'Wpisz imię i nazwisko.',
      invalidEmail: 'Wpisz adres e-mail w formie imie@domena.pl.',
      invalidPhone: 'Wpisz numer telefonu.',
      invalidNip: 'Wpisz poprawny NIP.',
      invalidPostalCode: 'Wpisz kod pocztowy.',
      tooLong: `Wiadomość jest za długa. Zmieść się w ${maxContactMessageLength} znakach.`,
      tooShort: 'Napisz co najmniej kilka słów.',
    },
    sentHeading: 'Wiadomość gotowa',
    sentText: 'Tak wyglądałoby potwierdzenie. Odpowiedź przyszłaby na podany adres e-mail.',
    sentNothing: 'To strona przykładowa, więc nic nie zostało wysłane.',
    again: 'Napisz kolejną',
  },
  faqHeading: 'Najczęstsze pytania',
  faqLead: 'Jeśli nie ma tu odpowiedzi, zadzwoń. Odbiera osoba, która zna dom.',
  faq: [
    {
      question: 'Od której mogę się zameldować?',
      answer: [
        `Pokój jest gotowy od ${hotel.checkIn}. Jeśli przyjedziesz wcześniej, zostaw bagaż w bagażowni, bezpłatnie.`,
        'Za 80 zł możesz dokupić wcześniejsze zameldowanie od 12:00. Zaznacz je w dodatkach.',
      ],
    },
    {
      question: 'Do której trzeba się wymeldować?',
      answer: [
        `Pokój zwalniasz do ${hotel.checkOut}. Bagaż możesz zostawić w bagażowni do końca dnia.`,
        `Za 80 zł zostaniesz do ${hotel.lateCheckOut}. Jest w cenie Weekendu nad Odrą.`,
      ],
    },
    {
      question: 'Przyjadę po 22:00. Czy wejdę do hotelu?',
      answer: [
        `Recepcja jest czynna do ${hotel.receptionCloses}. Jeśli przyjedziesz później, wybierz w rezerwacji godzinę przyjazdu „Po 22:00, proszę o kontakt” i zadzwoń do nas, a umówimy się na odbiór klucza.`,
      ],
    },
    {
      question: 'Czy hotel ma parking?',
      answer: [
        `Mamy ${hotel.parkingSpaces} miejsc na zamkniętym parkingu przy sąsiedniej ulicy. Miejsce kosztuje 60 zł za dobę i rezerwujesz je razem z pokojem.`,
        'Miejsc jest mało. Gdy ich zabraknie, w pobliżu są płatne parkingi, o które chętnie doradzimy.',
      ],
    },
    {
      question: 'Czy mogę przyjechać ze zwierzęciem?',
      answer: [
        'Tak, z psem lub kotem do 15 kg, do dwóch zwierząt. Dopłata to 90 zł za zwierzę za cały pobyt. W pokoju czekają miska i posłanie.',
        'Zwierzę nie zostaje samo w pokoju w czasie śniadania i sprzątania. Zaznacz je w dodatkach przy rezerwacji.',
      ],
    },
    {
      question: 'Czy mogę odwołać rezerwację?',
      answer: [
        `W taryfie elastycznej odwołasz bez opłaty do godziny 15:00 na dwa dni przed przyjazdem (${hotel.freeCancellationHours} godzin). Później pobieramy pierwszą noc.`,
        'Taryfa bezzwrotna jest o 10 procent tańsza, ale przy odwołaniu płacisz cały pobyt. Odwołanie zrobisz na stronie Moja rezerwacja.',
      ],
    },
    {
      question: 'Jak i kiedy płacę?',
      answer: [
        'W taryfie elastycznej płacisz w hotelu przy wymeldowaniu, kartą albo gotówką. W taryfie bezzwrotnej kwotę płacisz z góry, z linku wysłanego e-mailem.',
        'Ceny są w złotych i zawierają podatek VAT. Nie pobieramy opłat za rezerwację.',
      ],
    },
    {
      question: 'Czy dostanę fakturę na firmę?',
      answer: [
        'Tak. W kroku z danymi gościa zaznacz „Chcę fakturę na firmę” i wpisz NIP. Formularz sprawdza jego sumę kontrolną, więc literówkę zobaczysz od razu.',
      ],
    },
    {
      question: 'Czy jest łóżeczko dla dziecka?',
      answer: [
        'Tak, bezpłatnie, dla dziecka do trzech lat. Zaznacz je w dodatkach, a ustawimy je w pokoju przed Twoim przyjazdem.',
      ],
    },
    {
      question: 'Czy da się zmienić termin?',
      answer: [
        'Dodatki zmienisz sam na stronie Moja rezerwacja. Termin zmieniamy w recepcji, bo zależy od wolnych pokoi. Zadzwoń albo napisz, a sprawdzimy, co da się zrobić.',
      ],
    },
  ],
};

const en: ContactText = {
  title: 'Contact and questions | Przęsło',
  description:
    'Contact Przęsło hotel at ul. Grodzka 31 in Wrocław: phone, e-mail, reception hours and answers to the most common questions about check-in, parking and pets.',
  heading: 'Contact',
  lead: 'Reception answers the phone from 7:00 to 22:00. We reply to e-mails on the same working day.',
  detailsHeading: 'How to find us',
  details: [
    { label: 'Address', value: `${hotel.street}, ${hotel.postalCode} ${hotel.city}` },
    { label: 'Phone', value: hotel.phone, href: hotel.phoneHref },
    { label: 'E-mail', value: hotel.email, href: hotel.emailHref },
    { label: 'Reception', value: `${hotel.receptionOpens}-${hotel.receptionCloses}, every day` },
    { label: 'Check-in and check-out', value: `from ${hotel.checkIn}, until ${hotel.checkOut}` },
  ],
  findHeading: 'The entrance',
  find: 'The main entrance is from Grodzka street, with reception on the ground floor. The lift reaches all four floors. The guest car park is on the next street, a few dozen steps from the door.',
  form: {
    heading: 'Write to us',
    lead: 'The form has no server, so nothing leaves it. In the real version the reply would come by e-mail.',
    name: 'Full name',
    email: 'E-mail address',
    topic: 'Topic',
    topics: {
      booking: 'A question about a booking',
      change: 'Changing dates',
      group: 'A group or several rooms',
      voucher: 'Gift voucher',
      other: 'Something else',
    },
    message: 'Message',
    messageHint: 'Say what it is about and add dates if you know them.',
    messageCount: (used, max) => `${used} of ${max} characters`,
    submit: 'Send message',
    errorSummary: 'Fix these fields to send the message:',
    errors: {
      required: 'This field is required.',
      invalidName: 'Enter your full name.',
      invalidEmail: 'Enter an e-mail address like name@domain.com.',
      invalidPhone: 'Enter a phone number.',
      invalidNip: 'Enter a valid NIP.',
      invalidPostalCode: 'Enter a postal code.',
      tooLong: `The message is too long. Keep it within ${maxContactMessageLength} characters.`,
      tooShort: 'Write at least a few words.',
    },
    sentHeading: 'Message ready',
    sentText:
      'This is what the confirmation would look like. The reply would reach the e-mail address you gave.',
    sentNothing: 'This is a sample website, so nothing was sent.',
    again: 'Write another',
  },
  faqHeading: 'Frequently asked questions',
  faqLead: 'If the answer is not here, call. The person who answers knows the house.',
  faq: [
    {
      question: 'When can I check in?',
      answer: [
        `Your room is ready from ${hotel.checkIn}. If you arrive earlier, leave your luggage in the luggage room, free of charge.`,
        'For PLN 80 you can add early check-in from 12:00. Tick it in the extras.',
      ],
    },
    {
      question: 'When do I have to check out?',
      answer: [
        `You free the room by ${hotel.checkOut}. You can leave luggage in the luggage room until the end of the day.`,
        `For PLN 80 you stay until ${hotel.lateCheckOut}. It is included in the Weekend by the Oder.`,
      ],
    },
    {
      question: 'I will arrive after 22:00. Can I get in?',
      answer: [
        `Reception is open until ${hotel.receptionCloses}. If you arrive later, choose the arrival time “After 22:00, please contact me” in the booking and call us, and we will arrange the key handover.`,
      ],
    },
    {
      question: 'Does the hotel have parking?',
      answer: [
        `We have ${hotel.parkingSpaces} places in a closed car park on the next street. A place costs PLN 60 a night and you book it with the room.`,
        'There are few places. When they run out, there are paid car parks nearby that we gladly advise on.',
      ],
    },
    {
      question: 'Can I bring a pet?',
      answer: [
        'Yes, a dog or a cat up to 15 kg, up to two animals. The surcharge is PLN 90 per animal for the whole stay. A bowl and a bed wait in the room.',
        'The animal does not stay alone in the room during breakfast and cleaning. Tick it in the extras when booking.',
      ],
    },
    {
      question: 'Can I cancel a booking?',
      answer: [
        `On the flexible rate you cancel free of charge until 15:00 two days before arrival (${hotel.freeCancellationHours} hours). After that we charge the first night.`,
        'The non-refundable rate is 10 percent cheaper, but if you cancel you pay the whole stay. You cancel on the My booking page.',
      ],
    },
    {
      question: 'How and when do I pay?',
      answer: [
        'On the flexible rate you pay at the hotel when you check out, by card or in cash. On the non-refundable rate you pay in advance, from a link sent by e-mail.',
        'Prices are in zloty and include VAT. We charge no booking fees.',
      ],
    },
    {
      question: 'Can I get an invoice for a company?',
      answer: [
        'Yes. In the guest details step tick “I want an invoice for a company” and enter the NIP. The form checks its checksum, so you see a typo at once.',
      ],
    },
    {
      question: 'Is there a cot for a child?',
      answer: [
        'Yes, free of charge, for a child up to three years. Tick it in the extras and we will set it up in the room before you arrive.',
      ],
    },
    {
      question: 'Can the dates be changed?',
      answer: [
        'You change extras yourself on the My booking page. We change dates at reception, because it depends on free rooms. Call or write and we will see what can be done.',
      ],
    },
  ],
};

export const contactText: Record<Lang, ContactText> = { pl: tieDeep(pl), en: tieDeep(en) };
