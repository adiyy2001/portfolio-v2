import React from 'react';
import Rewektor from '../../components/pattern';
import Close from '../../components/close';
import Seo from '../../components/seo';

export default function RewektorCase() {
  return (
    <>
      <Rewektor />
      <Close lang="pl" edition="cli" />
    </>
  );
}

export const Head = () => (
  <Seo
    lang="pl"
    path="/archive/rewektor/"
    title="ReWektor: strona i panel dla stolarza z Wrocławia, Adrian Turbiński"
    description="Strona i panel dla rodzinnej firmy stolarskiej: te same pola w panelu i na stronie, PHP i MySQL na hostingu klienta, trzy kierunki projektu."
  />
);
