import React from 'react';
import Repo from '../../components/repo';
import Seo from '../../components/seo';
import fieldline from '../../components/repo/fieldline';

export default function Fieldline() {
  return <Repo data={fieldline} lang="pl" />;
}

export const Head = () => (
  <Seo
    lang="pl"
    view="fieldline"
    title={fieldline.pl.title}
    description={fieldline.pl.description}
    code={fieldline}
  />
);
