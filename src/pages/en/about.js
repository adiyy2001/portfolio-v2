import React from 'react';
import About from '../../components/about';
import Seo from '../../components/seo';

export default function AboutEn() {
  return <About lang="en" />;
}

export const Head = () => (
  <Seo
    lang="en"
    view="about"
    title="About Adrian Turbiński, freelance web developer in Wrocław"
    description="Web applications and websites for companies since 2019. Who I am, how I work, where I have worked, the projects I built and my company details."
  />
);
