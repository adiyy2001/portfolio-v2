export const site = {
  name: 'Przędza',
  street: 'ul. Wrzecionowa 2',
  postcode: '50-241',
  city: 'Wrocław',
  district: 'Nadodrze',
  phone: '+48 71 000 00 05',
  phoneHref: 'tel:+48710000005',
  email: 'biuro@przedza.example',
  hours: [
    { days: 'poniedziałek-piątek', time: '9:00-17:00' },
    { days: 'sobota', time: '10:00-14:00' },
    { days: 'niedziela', time: 'zamknięte' },
  ],
  handover: 'III kwartał 2027',
  asOf: 'stan na październik 2026',
} as const;
