export const contactPl = {
  title: 'Kontakt',
  description:
    'Kontakt z Bistrem na Szczepinie: adres, telefon, e-mail i godziny otwarcia. Strona przykładowa.',
  h1: 'Kontakt',
  lead: 'Najszybciej odbieramy telefon. Na wiadomość odpowiadamy następnego dnia roboczego.',
  address: 'Adres',
  phone: 'Telefon',
  email: 'E-mail',
  hours: 'Godziny otwarcia',
  kitchenBreak: 'Od 16:00 do 17:00 kuchnia ma przerwę i nie przyjmujemy stolików.',
  form: {
    title: 'Napisz do nas',
    name: 'Imię',
    email: 'Adres e-mail',
    message: 'Wiadomość',
    send: 'Wyślij wiadomość',
    summaryTitle: 'Popraw te pola, żeby wysłać wiadomość',
    errors: {
      name: 'Proszę podać imię.',
      email: 'Proszę podać adres e-mail w formacie nazwa@domena.pl.',
      message: 'Proszę napisać wiadomość, choćby jedno zdanie.',
    },
    done: {
      title: 'Wiadomość przyjęta',
      text: 'To strona przykładowa, więc nic nie zostało wysłane. Gdyby bistro było prawdziwe, odpisalibyśmy następnego dnia roboczego.',
      again: 'Napisz kolejną wiadomość',
    },
  },
  mapNote: 'Do lokalu wchodzi się bez schodów.',
  noscript: 'Formularz działa z włączonym JavaScriptem. Napisz do nas na adres',
};

export const contactEn = {
  title: 'Contact',
  description:
    'Contact Bistro na Szczepinie: the address, phone, e-mail and opening hours. Sample page.',
  h1: 'Contact',
  lead: 'The phone is the quickest way to reach us. We answer messages the next working day.',
  address: 'Address',
  phone: 'Phone',
  email: 'E-mail',
  hours: 'Opening hours',
  kitchenBreak: 'The kitchen takes a break from 16:00 to 17:00 and we do not take tables then.',
  form: {
    title: 'Write to us',
    name: 'Name',
    email: 'E-mail address',
    message: 'Message',
    send: 'Send message',
    summaryTitle: 'Fix these fields to send your message',
    errors: {
      name: 'Please enter your name.',
      email: 'Please enter an e-mail address like name@domain.com.',
      message: 'Please write a message, even one sentence.',
    },
    done: {
      title: 'Message received',
      text: 'This is a sample site, so nothing was sent. If the bistro were real, we would reply the next working day.',
      again: 'Write another message',
    },
  },
  mapNote: 'The entrance has no steps.',
  noscript: 'The form needs JavaScript. Write to us at',
};

export const contactCopy = { pl: contactPl, en: contactEn };
