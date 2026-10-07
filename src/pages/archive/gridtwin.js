import React from 'react';
import Repo from '../../components/repo';
import Seo from '../../components/seo';
import gridtwin from '../../components/repo/gridtwin';

export default function Gridtwin() {
  return <Repo data={gridtwin} lang="pl" />;
}

export const Head = () => (
  <Seo
    lang="pl"
    view="gridtwin"
    title={gridtwin.pl.title}
    description={gridtwin.pl.description}
    code={gridtwin}
  />
);
