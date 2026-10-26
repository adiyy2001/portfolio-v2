import React from 'react';
import Seo from '../../components/seo';
import Service from '../../components/service';
import { services } from '../../services';

const s = services.wcag.pl;

export default function Page() {
  return <Service id="wcag" lang="pl" />;
}

export const Head = () => (
  <Seo lang="pl" view="svc-wcag" title={s.seoTitle} description={s.description} service={s} />
);
