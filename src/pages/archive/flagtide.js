import React from 'react';
import Repo from '../../components/repo';
import Seo from '../../components/seo';
import flagtide from '../../components/repo/flagtide';

export default function Flagtide() {
  return <Repo data={flagtide} lang="pl" />;
}

export const Head = () => (
  <Seo
    lang="pl"
    view="flagtide"
    title={flagtide.pl.title}
    description={flagtide.pl.description}
    code={flagtide}
  />
);
