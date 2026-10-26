import React from 'react';
import Seo from '../../../components/seo';
import Service from '../../../components/service';
import { services } from '../../../services';

const s = services.sites.en;

export default function Page() {
  return <Service id="sites" lang="en" />;
}

export const Head = () => (
  <Seo lang="en" view="svc-sites" title={s.seoTitle} description={s.description} service={s} />
);
