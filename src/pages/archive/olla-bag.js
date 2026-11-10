import React from 'react';
import Olla from '../../components/olla';
import Close from '../../components/close';
import Seo from '../../components/seo';

export default function OllaBag() {
  return (
    <>
      <Olla />
      <Close lang="pl" edition="cli" />
    </>
  );
}

export const Head = () => (
  <Seo
    lang="pl"
    path="/archive/olla-bag/"
    title="Olla Bag: sklep na Shopify dla torebki, która zamienia się w wózek, Adrian Turbiński"
    description="Sklep na Shopify zbudowany od A do Z: ścieżka zakupu krok po kroku ze zrzutami, struktura karty produktu i wybór koloru."
    client={{ name: 'Olla Bag', site: 'https://www.ollabag.com/' }}
  />
);
