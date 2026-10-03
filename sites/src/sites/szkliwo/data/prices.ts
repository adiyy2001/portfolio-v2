import type { TreatmentSlug } from './treatments';

export type PriceCategoryId =
  | 'diagnostyka'
  | 'profilaktyka'
  | 'wypelnienia'
  | 'endodoncja'
  | 'chirurgia'
  | 'protetyka'
  | 'implanty'
  | 'ortodoncja'
  | 'wybielanie'
  | 'dzieci';

export interface PriceCategory {
  id: PriceCategoryId;
  name: string;
  lead: string;
  treatment?: TreatmentSlug;
}

export interface PriceItem {
  id: string;
  category: PriceCategoryId;
  name: string;
  price: number;
  from?: boolean;
  unit?: string;
  note?: string;
  keywords?: readonly string[];
}

export const priceCategories: readonly PriceCategory[] = [
  {
    id: 'diagnostyka',
    name: 'Diagnostyka',
    lead: 'Badanie, zdjęcia i plan leczenia.',
    treatment: 'przeglad-i-higienizacja',
  },
  {
    id: 'profilaktyka',
    name: 'Profilaktyka i higiena',
    lead: 'To, co chroni zęby przed leczeniem.',
    treatment: 'przeglad-i-higienizacja',
  },
  {
    id: 'wypelnienia',
    name: 'Wypełnienia',
    lead: 'Znieczulenie, koferdam i polerowanie są w cenie.',
    treatment: 'wypelnienia',
  },
  {
    id: 'endodoncja',
    name: 'Leczenie kanałowe',
    lead: 'Zdjęcia, leki w zębie i kontrola są w cenie.',
    treatment: 'leczenie-kanalowe',
  },
  {
    id: 'chirurgia',
    name: 'Chirurgia',
    lead: 'Znieczulenie i zdjęcie szwów są w cenie.',
  },
  {
    id: 'protetyka',
    name: 'Protetyka',
    lead: 'Korony, nakładki i licówki ceramiczne.',
  },
  {
    id: 'implanty',
    name: 'Implanty',
    lead: 'Cenę całego leczenia wpisujemy do planu po tomografii.',
    treatment: 'implanty',
  },
  {
    id: 'ortodoncja',
    name: 'Ortodoncja nakładkowa',
    lead: 'Wizyty kontrolne i poprawki są w cenie pakietu.',
    treatment: 'ortodoncja-nakladkowa',
  },
  {
    id: 'wybielanie',
    name: 'Wybielanie',
    lead: 'Żel, nakładki i kontrola po dwóch tygodniach są w cenie.',
    treatment: 'wybielanie',
  },
  {
    id: 'dzieci',
    name: 'Dzieci do 12 lat',
    lead: 'Dłuższa wizyta zapoznawcza, bez pośpiechu.',
  },
];

export const priceItems: readonly PriceItem[] = [
  {
    id: 'przeglad',
    category: 'diagnostyka',
    name: 'Przegląd z planem leczenia na piśmie',
    price: 190,
    note: '40 minut. Plan z cenami i kolejnością zabiera się do domu.',
    keywords: ['konsultacja', 'pierwsza wizyta', 'badanie', 'kontrola'],
  },
  {
    id: 'kontrola',
    category: 'diagnostyka',
    name: 'Kontrola bez nowego planu',
    price: 120,
    note: 'Dla pacjentów, którzy mają już plan.',
    keywords: ['wizyta kontrolna', 'sprawdzenie'],
  },
  {
    id: 'wizyta-w-bolu',
    category: 'diagnostyka',
    name: 'Wizyta w bólu, tego samego dnia',
    price: 250,
    note: 'Gdy jest wolne okno. Znieczulenie i opatrunek w cenie.',
    keywords: ['ból', 'boli', 'pilna', 'nagła', 'doraźna', 'ostry'],
  },
  {
    id: 'rtg-punktowe',
    category: 'diagnostyka',
    name: 'Zdjęcie punktowe RTG',
    price: 40,
    unit: 'za zdjęcie',
    keywords: ['rentgen', 'rtg'],
  },
  {
    id: 'rtg-pantomograficzne',
    category: 'diagnostyka',
    name: 'Zdjęcie pantomograficzne',
    price: 110,
    note: 'Cały łuk zębowy na jednym zdjęciu.',
    keywords: ['rentgen', 'rtg', 'pantomogram', 'pano'],
  },
  {
    id: 'tomografia',
    category: 'diagnostyka',
    name: 'Tomografia CBCT',
    price: 320,
    unit: 'za badanie',
    note: 'Obraz 3D kości i zębów.',
    keywords: ['cbct', '3d', 'tomograf'],
  },
  {
    id: 'skaling',
    category: 'profilaktyka',
    name: 'Skaling, usunięcie kamienia nazębnego',
    price: 220,
    keywords: ['kamień', 'osad', 'ultradźwięki', 'czyszczenie'],
  },
  {
    id: 'piaskowanie',
    category: 'profilaktyka',
    name: 'Piaskowanie',
    price: 200,
    note: 'Zdejmuje osad po kawie, herbacie i papierosach.',
    keywords: ['osad', 'przebarwienia', 'czyszczenie', 'kawa'],
  },
  {
    id: 'fluoryzacja',
    category: 'profilaktyka',
    name: 'Fluoryzacja lakierem',
    price: 90,
    keywords: ['fluor', 'szkliwo', 'remineralizacja'],
  },
  {
    id: 'higienizacja',
    category: 'profilaktyka',
    name: 'Higienizacja pełna',
    price: 460,
    note: 'Skaling, piaskowanie, fluoryzacja, polerowanie i instruktaż. Około godziny.',
    keywords: ['czyszczenie', 'kamień', 'osad', 'profilaktyka'],
  },
  {
    id: 'lakowanie',
    category: 'profilaktyka',
    name: 'Lakowanie bruzd',
    price: 120,
    unit: 'za ząb',
    keywords: ['lak', 'bruzdy', 'próchnica'],
  },
  {
    id: 'szyna-relaksacyjna',
    category: 'profilaktyka',
    name: 'Szyna relaksacyjna na zgrzytanie',
    price: 1100,
    note: 'Nocna nakładka robiona na twoje zęby.',
    keywords: ['bruksizm', 'zgrzytanie', 'nakładka', 'szyna', 'zaciskanie'],
  },
  {
    id: 'wypelnienie-maly',
    category: 'wypelnienia',
    name: 'Wypełnienie kompozytowe, mały ubytek',
    price: 380,
    unit: 'za ząb',
    keywords: ['plomba', 'ubytek', 'próchnica', 'dziura'],
  },
  {
    id: 'wypelnienie-sredni',
    category: 'wypelnienia',
    name: 'Wypełnienie kompozytowe, średni ubytek',
    price: 450,
    unit: 'za ząb',
    keywords: ['plomba', 'ubytek', 'próchnica', 'dziura'],
  },
  {
    id: 'wypelnienie-duzy',
    category: 'wypelnienia',
    name: 'Wypełnienie kompozytowe, duży ubytek lub odbudowa zęba',
    price: 580,
    unit: 'za ząb',
    keywords: ['plomba', 'ubytek', 'odbudowa', 'złamany'],
  },
  {
    id: 'wypelnienie-przednie',
    category: 'wypelnienia',
    name: 'Wypełnienie zęba przedniego, estetyczne',
    price: 520,
    unit: 'za ząb',
    note: 'Kilka odcieni kompozytu kładzionych warstwami.',
    keywords: ['plomba', 'ubytek', 'jedynka', 'dwójka', 'przedni'],
  },
  {
    id: 'odbudowa-po-kanalowym',
    category: 'wypelnienia',
    name: 'Odbudowa zęba po leczeniu kanałowym',
    price: 650,
    unit: 'za ząb',
    note: 'Wkład z kompozytu. Trzonowce zalecamy zamknąć nakładką lub koroną.',
    keywords: ['wkład', 'odbudowa', 'plomba'],
  },
  {
    id: 'kanalowe-1',
    category: 'endodoncja',
    name: 'Leczenie kanałowe, ząb jednokanałowy',
    price: 790,
    keywords: ['kanałowe', 'nerw', 'endodoncja', 'martwy ząb'],
  },
  {
    id: 'kanalowe-2',
    category: 'endodoncja',
    name: 'Leczenie kanałowe, ząb dwukanałowy',
    price: 990,
    keywords: ['kanałowe', 'nerw', 'endodoncja'],
  },
  {
    id: 'kanalowe-3',
    category: 'endodoncja',
    name: 'Leczenie kanałowe, ząb trzy- lub czterokanałowy',
    price: 1290,
    note: 'Zwykle trzonowce.',
    keywords: ['kanałowe', 'nerw', 'endodoncja', 'trzonowiec'],
  },
  {
    id: 'kanalowe-ponowne',
    category: 'endodoncja',
    name: 'Ponowne leczenie kanałowe',
    price: 1090,
    from: true,
    note: 'Cenę ustalamy po zdjęciu, zależy od liczby kanałów.',
    keywords: ['kanałowe', 'powtórne', 'reendo', 'poprawka'],
  },
  {
    id: 'opatrunek-w-bolu',
    category: 'endodoncja',
    name: 'Opatrunek leczniczy przy ostrym bólu zęba',
    price: 250,
    note: 'Pierwsza wizyta, gdy ząb boli samoistnie. Odliczamy od leczenia kanałowego.',
    keywords: ['ból', 'ostry', 'pilna', 'nerw', 'ropień'],
  },
  {
    id: 'usuniecie-proste',
    category: 'chirurgia',
    name: 'Usunięcie zęba, proste',
    price: 280,
    unit: 'za ząb',
    keywords: ['ekstrakcja', 'wyrwanie', 'zęba', 'usuwanie'],
  },
  {
    id: 'usuniecie-chirurgiczne',
    category: 'chirurgia',
    name: 'Usunięcie zęba, chirurgiczne',
    price: 650,
    unit: 'za ząb',
    note: 'Ząb złamany lub z długimi korzeniami.',
    keywords: ['ekstrakcja', 'wyrwanie', 'zęba', 'złamany', 'usuwanie'],
  },
  {
    id: 'usuniecie-osemki',
    category: 'chirurgia',
    name: 'Usunięcie zęba mądrości',
    price: 750,
    from: true,
    unit: 'za ząb',
    note: 'Cena zależy od ułożenia zęba na zdjęciu.',
    keywords: ['ósemka', 'ósemki', 'trzeci trzonowiec', 'ekstrakcja', 'zęba'],
  },
  {
    id: 'resekcja',
    category: 'chirurgia',
    name: 'Resekcja wierzchołka korzenia',
    price: 1200,
    note: 'Zabieg, gdy leczenie kanałowe nie wystarcza.',
    keywords: ['operacja', 'ropień', 'torbiel', 'wierzchołek'],
  },
  {
    id: 'wedzidelko',
    category: 'chirurgia',
    name: 'Plastyka wędzidełka',
    price: 600,
    keywords: ['wędzidełko', 'szpara', 'dziąsło'],
  },
  {
    id: 'korona-cyrkonowa',
    category: 'protetyka',
    name: 'Korona cyrkonowa',
    price: 2200,
    unit: 'za ząb',
    note: 'Ze skanu, bez mas wyciskowych.',
    keywords: ['korona', 'ceramika', 'cyrkon', 'protetyka'],
  },
  {
    id: 'nakladka-ceramiczna',
    category: 'protetyka',
    name: 'Nakładka ceramiczna (onlay)',
    price: 1900,
    unit: 'za ząb',
    keywords: ['onlay', 'inlay', 'wkład', 'ceramika'],
  },
  {
    id: 'licowka',
    category: 'protetyka',
    name: 'Licówka ceramiczna',
    price: 2400,
    unit: 'za ząb',
    keywords: ['licówki', 'estetyka', 'ceramika'],
  },
  {
    id: 'wklad-koronowo-korzeniowy',
    category: 'protetyka',
    name: 'Wkład koronowo-korzeniowy',
    price: 650,
    unit: 'za ząb',
    keywords: ['wkład', 'korzeń', 'odbudowa'],
  },
  {
    id: 'proteza-calkowita',
    category: 'protetyka',
    name: 'Proteza całkowita',
    price: 3400,
    unit: 'za łuk',
    keywords: ['proteza', 'sztuczna szczęka', 'zęby'],
  },
  {
    id: 'naprawa-protezy',
    category: 'protetyka',
    name: 'Naprawa protezy',
    price: 280,
    keywords: ['proteza', 'pęknięta', 'zęby'],
  },
  {
    id: 'konsultacja-implantologiczna',
    category: 'implanty',
    name: 'Konsultacja implantologiczna z oceną tomografii',
    price: 250,
    note: 'Zaliczamy na poczet leczenia, jeśli się zdecydujesz.',
    keywords: ['implant', 'brakujący ząb', 'cbct'],
  },
  {
    id: 'implant',
    category: 'implanty',
    name: 'Implant z wszczepieniem',
    price: 4500,
    unit: 'za implant',
    note: 'Implant, zabieg, znieczulenie, zdjęcie szwów i kontrola.',
    keywords: ['implant', 'tytan', 'brakujący ząb', 'wszczepienie'],
  },
  {
    id: 'korona-na-implancie',
    category: 'implanty',
    name: 'Korona cyrkonowa na implancie',
    price: 3600,
    unit: 'za koronę',
    note: 'Łącznik, skan, korona i dobór koloru.',
    keywords: ['implant', 'korona', 'cyrkon'],
  },
  {
    id: 'szablon-chirurgiczny',
    category: 'implanty',
    name: 'Szablon chirurgiczny',
    price: 600,
    note: 'Gdy zęby sąsiadują z nerwem lub zatoką i trzeba zaplanować każdy milimetr.',
    keywords: ['implant', 'prowadnica', 'planowanie'],
  },
  {
    id: 'podniesienie-zatoki',
    category: 'implanty',
    name: 'Podniesienie dna zatoki',
    price: 2500,
    from: true,
    note: 'Gdy w szczęce jest za mało kości na implant.',
    keywords: ['sinus lift', 'zatoka', 'kość', 'implant'],
  },
  {
    id: 'przeszczep-kosci',
    category: 'implanty',
    name: 'Przeszczep kości',
    price: 1500,
    from: true,
    note: 'Cena zależy od rozmiaru ubytku kości.',
    keywords: ['augmentacja', 'kość', 'odbudowa kości', 'implant'],
  },
  {
    id: 'konsultacja-ortodontyczna',
    category: 'ortodoncja',
    name: 'Konsultacja ortodontyczna ze skanem 3D',
    price: 250,
    note: 'Zaliczamy na poczet leczenia, jeśli się zdecydujesz.',
    keywords: ['aparat', 'skan', 'zgryz', 'stłoczone zęby'],
  },
  {
    id: 'nakladki-lekki',
    category: 'ortodoncja',
    name: 'Nakładki, pakiet lekki',
    price: 6900,
    from: true,
    note: 'Korekta niewielkiej wady, do 14 nakładek na łuk.',
    keywords: ['aparat', 'przezroczyste', 'niewidoczny', 'prostowanie zębów'],
  },
  {
    id: 'nakladki-pelny',
    category: 'ortodoncja',
    name: 'Nakładki, pakiet pełny',
    price: 11900,
    note: 'Do 40 nakładek na łuk.',
    keywords: ['aparat', 'przezroczyste', 'niewidoczny', 'prostowanie zębów'],
  },
  {
    id: 'nakladki-bez-limitu',
    category: 'ortodoncja',
    name: 'Nakładki, pakiet bez limitu nakładek',
    price: 15900,
    note: 'Dla trudniejszych wad. Poprawki w cenie.',
    keywords: ['aparat', 'przezroczyste', 'niewidoczny', 'prostowanie zębów'],
  },
  {
    id: 'retainer-staly',
    category: 'ortodoncja',
    name: 'Retainer stały',
    price: 450,
    unit: 'za łuk',
    note: 'Cienki drucik przyklejony od środka zębów.',
    keywords: ['retencja', 'drucik', 'po aparacie'],
  },
  {
    id: 'nakladki-retencyjne',
    category: 'ortodoncja',
    name: 'Nakładki retencyjne',
    price: 600,
    unit: 'za parę',
    keywords: ['retencja', 'po aparacie', 'nakładka'],
  },
  {
    id: 'wybielanie-gabinetowe',
    category: 'wybielanie',
    name: 'Wybielanie gabinetowe',
    price: 990,
    note: 'Jedna wizyta, około 90 minut. Higienizację robimy osobno.',
    keywords: ['wybielanie', 'jasne zęby', 'kolor', 'żółte zęby'],
  },
  {
    id: 'wybielanie-nakladkowe',
    category: 'wybielanie',
    name: 'Wybielanie nakładkowe w domu',
    price: 790,
    note: 'Nakładki na twoje zęby i żel na cały cykl, 10 do 14 dni.',
    keywords: ['wybielanie', 'jasne zęby', 'kolor', 'żółte zęby'],
  },
  {
    id: 'higienizacja-i-wybielanie',
    category: 'wybielanie',
    name: 'Higienizacja i wybielanie gabinetowe razem',
    price: 1290,
    note: 'O 160 zł taniej niż osobno. Higienizacja tydzień przed wybielaniem.',
    keywords: ['wybielanie', 'higienizacja', 'pakiet'],
  },
  {
    id: 'zel-uzupelniajacy',
    category: 'wybielanie',
    name: 'Żel uzupełniający do nakładek',
    price: 140,
    keywords: ['wybielanie', 'żel', 'powtórka'],
  },
  {
    id: 'wybielanie-martwego',
    category: 'wybielanie',
    name: 'Wybielanie zęba martwego od środka',
    price: 380,
    unit: 'za ząb',
    note: 'Dla jednego ciemnego zęba po leczeniu kanałowym.',
    keywords: ['wybielanie', 'ciemny ząb', 'po kanałowym', 'wewnętrzne'],
  },
  {
    id: 'dziecko-przeglad',
    category: 'dzieci',
    name: 'Przegląd dziecka',
    price: 150,
    note: '30 minut, w tym czas na oswojenie się z fotelem.',
    keywords: ['dziecko', 'mały pacjent', 'pierwsza wizyta'],
  },
  {
    id: 'dziecko-fluoryzacja',
    category: 'dzieci',
    name: 'Fluoryzacja dziecka',
    price: 70,
    keywords: ['dziecko', 'fluor', 'szkliwo'],
  },
  {
    id: 'dziecko-wypelnienie',
    category: 'dzieci',
    name: 'Wypełnienie zęba mlecznego',
    price: 280,
    unit: 'za ząb',
    keywords: ['dziecko', 'plomba', 'mleczak', 'ubytek'],
  },
  {
    id: 'dziecko-usuniecie',
    category: 'dzieci',
    name: 'Usunięcie zęba mlecznego',
    price: 180,
    unit: 'za ząb',
    keywords: ['dziecko', 'mleczak', 'ekstrakcja', 'wyrwanie'],
  },
];

export const findPrice = (id: string) => {
  const item = priceItems.find(entry => entry.id === id);
  if (!item) throw new Error(`Unknown price: ${id}`);
  return item;
};
