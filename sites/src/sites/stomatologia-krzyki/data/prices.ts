export interface PriceItem {
  id: string;
  group: string;
  name: string;
  includes: string;
  price: number;
  exact?: boolean;
  unit: string;
}

export interface PriceGroup {
  id: string;
  name: string;
  treatment: string;
}

export const priceGroups: readonly PriceGroup[] = [
  { id: 'przeglad', name: 'Przegląd', treatment: 'przeglad' },
  { id: 'higienizacja', name: 'Higienizacja', treatment: 'higienizacja' },
  { id: 'wybielanie', name: 'Wybielanie', treatment: 'wybielanie' },
  { id: 'wypelnienia', name: 'Wypełnienia', treatment: 'wypelnienia' },
  { id: 'leczenie-kanalowe', name: 'Leczenie kanałowe', treatment: 'leczenie-kanalowe' },
  { id: 'bol-zeba', name: 'Ból zęba', treatment: 'bol-zeba' },
];

export const priceItems: readonly PriceItem[] = [
  {
    id: 'przeglad',
    group: 'przeglad',
    name: 'Przegląd z planem leczenia',
    includes: 'Badanie, zdjęcie pantomograficzne, plan i kosztorys na kartce.',
    price: 150,
    unit: 'za wizytę',
  },
  {
    id: 'zdjecie-punktowe',
    group: 'przeglad',
    name: 'Zdjęcie punktowe',
    includes: 'Dodatkowe zdjęcie jednego zęba, gdy lekarz potrzebuje obejrzeć go dokładniej.',
    price: 55,
    exact: true,
    unit: 'za zdjęcie',
  },
  {
    id: 'higienizacja',
    group: 'higienizacja',
    name: 'Higienizacja',
    includes: 'Skaling, piaskowanie, polerowanie, fluoryzacja i instruktaż szczotkowania.',
    price: 280,
    unit: 'za wizytę',
  },
  {
    id: 'wybielanie',
    group: 'wybielanie',
    name: 'Wybielanie nakładkowe',
    includes: 'Nakładki indywidualne, żel i zestaw do domu, kontrola odcienia po tygodniu.',
    price: 900,
    unit: 'za komplet, 2 wizyty',
  },
  {
    id: 'zel-uzupelniajacy',
    group: 'wybielanie',
    name: 'Żel uzupełniający',
    includes: 'Zestaw żelu do istniejących nakładek, gdy efekt wymaga odświeżenia.',
    price: 170,
    unit: 'za zestaw',
  },
  {
    id: 'wypelnienie',
    group: 'wypelnienia',
    name: 'Wypełnienie kompozytowe',
    includes: 'Znieczulenie, usunięcie próchnicy i odbudowa jednej powierzchni zęba.',
    price: 260,
    unit: 'za ząb',
  },
  {
    id: 'odbudowa',
    group: 'wypelnienia',
    name: 'Odbudowa większego ubytku',
    includes: 'Odbudowa kilku powierzchni lub zęba po leczeniu kanałowym.',
    price: 380,
    unit: 'za ząb',
  },
  {
    id: 'kanal-jeden',
    group: 'leczenie-kanalowe',
    name: 'Ząb z jednym kanałem',
    includes: 'Praca pod mikroskopem, zdjęcie przed i po, wypełnienie kanału.',
    price: 650,
    unit: 'za ząb, 1 do 2 wizyt',
  },
  {
    id: 'kanal-dwa',
    group: 'leczenie-kanalowe',
    name: 'Ząb z dwoma kanałami',
    includes: 'Praca pod mikroskopem, zdjęcie przed i po, wypełnienie kanałów.',
    price: 780,
    unit: 'za ząb, 1 do 2 wizyt',
  },
  {
    id: 'kanal-wiele',
    group: 'leczenie-kanalowe',
    name: 'Ząb z trzema lub czterema kanałami',
    includes: 'Praca pod mikroskopem, zdjęcie przed i po, wypełnienie kanałów.',
    price: 920,
    unit: 'za ząb, 1 do 2 wizyt',
  },
  {
    id: 'wizyta-bolowa',
    group: 'bol-zeba',
    name: 'Wizyta z bólem zęba',
    includes: 'Badanie, jedno zdjęcie punktowe, znieczulenie i zabezpieczenie zęba.',
    price: 180,
    unit: 'za wizytę',
  },
];

export const findPrice = (id: string) => {
  const item = priceItems.find(entry => entry.id === id);
  if (!item) throw new Error(`Unknown price: ${id}`);
  return item;
};

export const pricesOfGroup = (group: string) => priceItems.filter(item => item.group === group);

export const formatPln = (value: number) => `${value} zł`;

export const formatPrice = (item: PriceItem) =>
  item.exact ? formatPln(item.price) : `od ${formatPln(item.price)}`;
