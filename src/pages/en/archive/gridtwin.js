import React from 'react';
import Repo from '../../../components/repo';
import Seo from '../../../components/seo';
import gridtwin from '../../../components/repo/gridtwin';

export default function Gridtwin() {
  return <Repo data={gridtwin} lang="en" />;
}

export const Head = () => (
  <Seo
    lang="en"
    view="gridtwin"
    title={gridtwin.en.title}
    description={gridtwin.en.description}
    code={gridtwin}
  />
);
