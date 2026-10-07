import React from 'react';
import Repo from '../../components/repo';
import Seo from '../../components/seo';
import coschema from '../../components/repo/coschema';

export default function Coschema() {
  return <Repo data={coschema} lang="pl" />;
}

export const Head = () => (
  <Seo
    lang="pl"
    view="coschema"
    title={coschema.pl.title}
    description={coschema.pl.description}
    code={coschema}
  />
);
