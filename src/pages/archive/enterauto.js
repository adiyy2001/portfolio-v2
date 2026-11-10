import React from 'react';
import EnterAuto from '../../components/enterauto';
import Close from '../../components/close';
import Seo from '../../components/seo';

export default function EnterAutoCase() {
  return (
    <>
      <EnterAuto />
      <Close lang="pl" edition="cli" />
    </>
  );
}

export const Head = () => (
  <Seo
    lang="pl"
    path="/archive/enterauto/"
    title="Strona skupu aut we Wrocławiu, Adrian Turbiński"
    description="Strona skupu aut z Wrocławia: telefon i wycena online na pierwszym ekranie, formularz ze zdjęciami, osobna ścieżka kasacji. Zobacz, co zbudowałem."
    client={{ name: 'Enter Auto', site: 'https://enterauto.pl/' }}
  />
);
