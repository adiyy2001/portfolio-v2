import React from 'react';
import Repo from '../../components/repo';
import Seo from '../../components/seo';
import eventhorizon from '../../components/repo/eventhorizon';

export default function Eventhorizon() {
  return <Repo data={eventhorizon} lang="pl" />;
}

export const Head = () => (
  <Seo
    lang="pl"
    view="eventhorizon"
    title={eventhorizon.pl.title}
    description={eventhorizon.pl.description}
    code={eventhorizon}
  />
);
