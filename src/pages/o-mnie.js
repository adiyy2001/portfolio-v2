import React from 'react';
import About from '../components/about';
import Seo from '../components/seo';

export default function AboutPl() {
  return <About lang="pl" />;
}

export const Head = () => (
  <Seo
    lang="pl"
    view="about"
    title="O mnie, programista i freelancer z Wrocławia, Adrian Turbiński"
    description="Aplikacje webowe i strony dla firm od 2019 roku. Kim jestem, jak pracuję, gdzie pracowałem, jakie projekty zrobiłem i dane mojej firmy."
  />
);
