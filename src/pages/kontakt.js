import React from 'react';
import Contact from '../components/contact';
import Seo from '../components/seo';

export default function ContactPl() {
  return <Contact lang="pl" />;
}

export const Head = () => (
  <Seo
    lang="pl"
    view="contact"
    title="Kontakt z programistą, Wrocław, Adrian Turbiński"
    description="Telefon, e-mail, godziny pracy, dane firmy i formularz wyceny. Wrocław, Dolny Śląsk i zdalnie. Wycena na piśmie w dwa dni robocze."
  />
);
