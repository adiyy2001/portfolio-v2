import React from 'react';
import Hero from '../../../components/hero';
import Seo from '../../../components/seo';

export default function Project() {
  return <Hero id="case-h" title="TailorCloth." size="rec" />;
}

export const Head = () => <Seo lang="en" view="case" title="TailorCloth, Adrian Turbiński" />;
