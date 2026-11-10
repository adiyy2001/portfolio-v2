import React from 'react';
import Contact from '../../components/contact';
import Seo from '../../components/seo';

export default function ContactEn() {
  return <Contact lang="en" />;
}

export const Head = () => (
  <Seo
    lang="en"
    view="contact"
    title="Contact a freelance web developer, Wrocław, Adrian Turbiński"
    description="Phone, email, working hours, company details and a quote form. Wrocław, Lower Silesia and remote across Poland and the EU. Written quote in two working days."
  />
);
