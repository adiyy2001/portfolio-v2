import React from 'react';
import Seo from '../../components/seo';
import { ServicesIndex } from '../../components/service';
import { servicesIndex } from '../../services';

const t = servicesIndex.pl;

export default function Page() {
  return <ServicesIndex lang="pl" />;
}

export const Head = () => (
  <Seo lang="pl" view="services" title={t.seoTitle} description={t.description} />
);
