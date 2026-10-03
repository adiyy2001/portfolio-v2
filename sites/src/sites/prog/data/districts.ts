import type { District, DistrictId } from './types';

export const districts: readonly District[] = [
  {
    id: 'stare-miasto',
    name: 'Stare Miasto',
    label: 'Stare Miasto',
    shape: 'Stare Miasto',
    blurb:
      'Rynek, uniwersytet i mosty nad Odrą. Mieszkania w kamienicach, głównie niewielkie, z oknami na wąskie ulice.',
    flatM2: 17800,
    houseM2: 17000,
  },
  {
    id: 'nadodrze',
    name: 'Nadodrze',
    label: 'Nadodrze',
    shape: 'Nadodrze',
    blurb:
      'Kamienice z końca XIX wieku po północnej stronie Odry, mniej niż dwa kilometry od Rynku.',
    flatM2: 11800,
    houseM2: 12500,
  },
  {
    id: 'olbin',
    name: 'Ołbin',
    label: 'Ołbin',
    shape: 'Ołbin',
    blurb: 'Kamienice między Placem Grunwaldzkim a Nadodrzem, blisko uczelni i bulwarów nad Odrą.',
    flatM2: 12400,
    houseM2: 12500,
  },
  {
    id: 'przedmiescie-olawskie',
    name: 'Przedmieście Oławskie',
    label: 'Przedmieście Oławskie',
    shape: 'Przedmieście Oławskie',
    blurb: 'Tuż za fosą miejską, na wschód od Starego Miasta: kamienice i dawne budynki fabryczne.',
    flatM2: 14600,
    houseM2: 14500,
  },
  {
    id: 'przedmiescie-swidnickie',
    name: 'Przedmieście Świdnickie',
    label: 'Przedmieście Świdnickie',
    shape: 'Przedmieście Świdnickie',
    blurb:
      'Okolice Dworca Głównego i ulicy Świdnickiej: kamienice, urzędy i najkrótsza droga w każdą stronę.',
    flatM2: 14200,
    houseM2: 13500,
  },
  {
    id: 'plac-grunwaldzki',
    name: 'Plac Grunwaldzki',
    label: 'Plac Grunwaldzki',
    shape: 'Plac Grunwaldzki',
    blurb: 'Politechnika, uniwersytet i wysokie bloki z lat 70. nad Odrą.',
    flatM2: 13600,
    houseM2: 14000,
  },
  {
    id: 'kleczkow',
    name: 'Kleczków',
    label: 'Kleczków',
    shape: 'Kleczków',
    blurb: 'Wąski pas nad Odrą między Nadodrzem a Karłowicami, z kilkoma nowymi osiedlami.',
    flatM2: 14000,
    houseM2: 13500,
  },
  {
    id: 'szczepin',
    name: 'Szczepin',
    label: 'Szczepin',
    shape: 'Szczepin',
    blurb:
      'Na zachód od centrum, wzdłuż Legnickiej i Strzegomskiej: kamienice i przedwojenne bloki.',
    flatM2: 11700,
    houseM2: 11500,
  },
  {
    id: 'gajowice',
    name: 'Gajowice',
    label: 'Gajowice',
    shape: 'Gajowice',
    blurb: 'Spokojne ulice z zabudową z lat 30. na południowy zachód od centrum.',
    flatM2: 12900,
    houseM2: 13000,
  },
  {
    id: 'powstancow-slaskich',
    name: 'Powstańców Śląskich',
    label: 'Powstańców Śląskich',
    shape: 'Powstańców Śląskich',
    blurb:
      'Na południe od dworca, wokół ulicy Powstańców Śląskich: kamienice, biurowce i szybki dojazd do centrum.',
    flatM2: 13000,
    houseM2: 13000,
  },
  {
    id: 'huby',
    name: 'Huby',
    label: 'Huby',
    shape: 'Huby',
    blurb:
      'Między Aleją Armii Krajowej a ulicą Ślężną: bloki z lat 60. i 70. oraz kilka nowych osiedli.',
    flatM2: 13100,
    houseM2: 12800,
  },
  {
    id: 'gaj',
    name: 'Gaj',
    label: 'Gaj',
    shape: 'Gaj',
    blurb: 'Osiedle bloków z lat 70., w którym ulice noszą nazwy górskich miejscowości i szczytów.',
    flatM2: 12600,
    houseM2: 12800,
  },
  {
    id: 'borek',
    name: 'Borek',
    label: 'Borek',
    shape: 'Borek',
    blurb: 'Dzielnica alej nazwanych od drzew, z willami i niskimi blokami.',
    flatM2: 12800,
    houseM2: 13300,
  },
  {
    id: 'krzyki-partynice',
    name: 'Krzyki-Partynice',
    label: 'Partynice',
    shape: 'Krzyki-Partynice',
    blurb:
      'Na południu miasta, obok toru wyścigów konnych: domy, nowe osiedla i ulice nazwane od pór roku i owoców.',
    flatM2: 14100,
    houseM2: 13600,
  },
  {
    id: 'grabiszyn',
    name: 'Grabiszyn-Grabiszynek',
    label: 'Grabiszyn',
    shape: 'Grabiszyn-Grabiszynek',
    blurb:
      'Zachodnia część miasta z ulicami nazwanymi od zawodów: Stolarska, Rymarska, Rusznikarska.',
    flatM2: 13500,
    houseM2: 13000,
  },
  {
    id: 'muchobor-maly',
    name: 'Muchobór Mały',
    label: 'Muchobór Mały',
    shape: 'Muchobór Mały',
    blurb: 'Osiedle domów i szeregówek na zachodzie, w którym ulice noszą nazwy państw.',
    flatM2: 11300,
    houseM2: 10600,
  },
  {
    id: 'biskupin',
    name: 'Biskupin-Sępolno-Dąbie-Bartoszowice',
    label: 'Biskupin',
    shape: 'Biskupin-Sępolno-Dąbie-Bartoszowice',
    blurb:
      'Willowe osiedle z lat 20. i 30. z ulicami nazwanymi od polskich malarzy, w pobliżu Hali Stulecia.',
    flatM2: 15600,
    houseM2: 15500,
  },
  {
    id: 'zalesie',
    name: 'Zacisze-Zalesie-Szczytniki',
    label: 'Zalesie',
    shape: 'Zacisze-Zalesie-Szczytniki',
    blurb: 'Domy i wille przy Parku Szczytnickim, z ulicami nazwanymi od kompozytorów.',
    flatM2: 14800,
    houseM2: 14000,
  },
  {
    id: 'karlowice',
    name: 'Karłowice-Różanka',
    label: 'Karłowice',
    shape: 'Karłowice-Różanka',
    blurb: 'Północ miasta z ulicami nazwanymi od poetów: domy, niskie bloki i dużo zieleni.',
    flatM2: 13200,
    houseM2: 12400,
  },
  {
    id: 'ksieze',
    name: 'Księże',
    label: 'Księże',
    shape: 'Księże',
    blurb:
      'Wschodnie krańce miasta, ulice nazwane od miast Górnego Śląska: Bytomska, Gliwicka, Katowicka.',
    flatM2: 12000,
    houseM2: 11500,
  },
  {
    id: 'tarnogaj',
    name: 'Tarnogaj',
    label: 'Tarnogaj',
    shape: 'Tarnogaj',
    blurb:
      'Południe miasta, bloki i domy przy ulicach nazwanych od małych miast Dolnego Śląska i okolic.',
    flatM2: 12100,
    houseM2: 11500,
  },
  {
    id: 'jagodno',
    name: 'Jagodno',
    label: 'Jagodno',
    shape: 'Jagodno',
    blurb: 'Południowe obrzeże miasta, nowe domy i osiedla przy ulicach nazwanych od kompozytorów.',
    flatM2: 11900,
    houseM2: 10800,
  },
];

export const districtIds: readonly DistrictId[] = districts.map(district => district.id);

export const districtById = (id: DistrictId): District => {
  const found = districts.find(district => district.id === id);
  if (!found) throw new Error(`Unknown district ${id}`);
  return found;
};
