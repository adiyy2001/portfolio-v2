import React from 'react';
import Seo from '../../components/seo';
import Service from '../../components/service';
import { services } from '../../services';

const s = services.apps.pl;

export default function Page() {
  return <Service id="apps" lang="pl" />;
}

export const Head = () => (
  <Seo lang="pl" view="svc-apps" title={s.seoTitle} description={s.description} service={s} />
);
