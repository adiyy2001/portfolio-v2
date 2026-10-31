import React from 'react';
import Moved, { MovedHead } from '../components/moved';

// /kontakt/ nie istnialo (404, 31.10.2026); kontakt i wycena sa na stronie glownej.
export default function Contact() {
  return <Moved lang="pl" kind="contact" hash="#wycena" />;
}

export const Head = () => <MovedHead lang="pl" kind="contact" hash="#wycena" />;
