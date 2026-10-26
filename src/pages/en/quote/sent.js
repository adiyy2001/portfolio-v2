import React from 'react';
import Seo from '../../../components/seo';
import Sent from '../../../components/sent';

export default function QuoteSent() {
  return <Sent lang="en" />;
}

export const Head = () => (
  <Seo
    lang="en"
    path="/en/quote/sent/"
    title="Request sent, Adrian Turbiński"
    description="Confirmation that your quote request was sent."
    noindex
  />
);
