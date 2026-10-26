import React from 'react';
import Seo from '../../../components/seo';
import Service from '../../../components/service';
import { services } from '../../../services';

const s = services.care.en;

export default function Page() {
  return <Service id="care" lang="en" />;
}

export const Head = () => (
  <Seo lang="en" view="svc-care" title={s.seoTitle} description={s.description} service={s} />
);
