import React from 'react';
import Seo from '../../components/seo';
import Service from '../../components/service';
import { services } from '../../services';

const s = services.sites.pl;

export default function Page() {
  return <Service id="sites" lang="pl" />;
}

export const Head = () => (
  <Seo lang="pl" view="svc-sites" title={s.seoTitle} description={s.description} service={s} />
);
