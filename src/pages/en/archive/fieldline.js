import React from 'react';
import Repo from '../../../components/repo';
import Seo from '../../../components/seo';
import fieldline from '../../../components/repo/fieldline';

export default function Fieldline() {
  return <Repo data={fieldline} lang="en" />;
}

export const Head = () => (
  <Seo
    lang="en"
    view="fieldline"
    title={fieldline.en.title}
    description={fieldline.en.description}
    code={fieldline}
  />
);
