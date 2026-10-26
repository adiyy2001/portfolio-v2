import React from 'react';
import Seo from '../../../components/seo';
import { ServicesIndex } from '../../../components/service';
import { servicesIndex } from '../../../services';

const t = servicesIndex.en;

export default function Page() {
  return <ServicesIndex lang="en" />;
}

export const Head = () => (
  <Seo lang="en" view="services" title={t.seoTitle} description={t.description} />
);
