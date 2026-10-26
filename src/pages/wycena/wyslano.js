import React from 'react';
import Seo from '../../components/seo';
import Sent from '../../components/sent';

export default function QuoteSent() {
  return <Sent lang="pl" />;
}

export const Head = () => (
  <Seo
    lang="pl"
    path="/wycena/wyslano/"
    title="Zapytanie wysłane, Adrian Turbiński"
    description="Potwierdzenie wysłania zapytania o wycenę."
    noindex
  />
);
