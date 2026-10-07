import React from 'react';
import Repo from '../../../components/repo';
import Seo from '../../../components/seo';
import flagtide from '../../../components/repo/flagtide';

export default function Flagtide() {
  return <Repo data={flagtide} lang="en" />;
}

export const Head = () => (
  <Seo
    lang="en"
    view="flagtide"
    title={flagtide.en.title}
    description={flagtide.en.description}
    code={flagtide}
  />
);
