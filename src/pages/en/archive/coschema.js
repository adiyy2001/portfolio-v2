import React from 'react';
import Repo from '../../../components/repo';
import Seo from '../../../components/seo';
import coschema from '../../../components/repo/coschema';

export default function Coschema() {
  return <Repo data={coschema} lang="en" />;
}

export const Head = () => (
  <Seo
    lang="en"
    view="coschema"
    title={coschema.en.title}
    description={coschema.en.description}
    code={coschema}
  />
);
