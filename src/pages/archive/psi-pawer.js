import React from 'react';
import Alteration from '../../components/alteration';
import Close from '../../components/close';
import Seo from '../../components/seo';

export default function PsiPawer() {
  return (
    <>
      <Alteration />
      <Close lang="pl" edition="cli" />
    </>
  );
}

export const Head = () => (
  <Seo
    lang="pl"
    path="/archive/psi-pawer/"
    title="Psi Pawer: przeróbka strony behawiorystki psów, Adrian Turbiński"
    description="Przed i po: nowy krój strony na Wixie, krótsze metki w Google i pomiary Lighthouse, także te, które wyszły gorzej."
  />
);
