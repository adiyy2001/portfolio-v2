import React from 'react';
import Seo from '../../../components/seo';
import Service from '../../../components/service';
import { services } from '../../../services';

const s = services.bot.en;

export default function Page() {
  return <Service id="bot" lang="en" />;
}

export const Head = () => (
  <Seo lang="en" view="svc-bot" title={s.seoTitle} description={s.description} service={s} />
);
