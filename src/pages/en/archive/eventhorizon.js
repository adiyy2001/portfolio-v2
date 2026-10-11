import React from 'react';
import Repo from '../../../components/repo';
import Seo from '../../../components/seo';
import eventhorizon from '../../../components/repo/eventhorizon';

export default function Eventhorizon() {
  return <Repo data={eventhorizon} lang="en" />;
}

export const Head = () => (
  <Seo
    lang="en"
    view="eventhorizon"
    title={eventhorizon.en.title}
    description={eventhorizon.en.description}
    code={eventhorizon}
  />
);
