import React from 'react';
import Seo from '../../components/seo';
import Service from '../../components/service';
import { services } from '../../services';

const s = services.integ.pl;

export default function Page() {
  return <Service id="integ" lang="pl" />;
}

export const Head = () => (
  <Seo lang="pl" view="svc-integ" title={s.seoTitle} description={s.description} service={s} />
);
