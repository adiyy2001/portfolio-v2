import React from 'react';
import { Link, withPrefix } from 'gatsby';
import Reveal from './reveal';
import { tie } from '../i18n';

export const cases = [
  {
    id: 'work-also-h',
    to: '/archive/rewektor/',
    view: 'tall',
    phone: {
      src: '/media/rewektor/telefon.webp',
      width: 390,
      height: 844,
      alt: 'Strona ReWektor na telefonie: nagłówek Meble na wymiar, stare odnawiamy, i przycisk zapytania o mebel',
    },
    name: 'ReWektor',
    image: '/media/rewektor/strona.webp',
    alt: 'Strona rewektor.com.pl z wpisem Stolik z maszyny',
    tag: 'Strona i panel',
    meta: 'Rodzinna firma stolarska z Wrocławia',
    desc: 'Strona z wystawą odnowionych mebli i panel, w którym właściciel sam dodaje kolejne. Te same pola w panelu i na stronie.',
    tech: 'PHP, MySQL, JavaScript, GSAP',
  },
  {
    id: 'work-psipawer-h',
    to: '/archive/psi-pawer/',
    view: 'tall',
    phone: {
      src: '/media/psipawer/tel-home-po.webp',
      width: 390,
      height: 1500,
      alt: 'Nowa strona główna na telefonie: nagłówek Pracuję z wariatami, dla których często jestem ostatnią szansą, przycisk Umów konsultację i numer telefonu',
    },
    name: 'Psi Pawer',
    image: '/media/psipawer/strona.webp',
    alt: 'Nowa strona główna Psi Pawer z nagłówkiem Pracuję z wariatami',
    tag: 'Przeróbka strony',
    meta: 'Behawiorystka psów z Wrocławia',
    desc: 'Stara strona na Wixie wzięta do przeróbki: nowy krój, czytelna oferta i pomiary przed i po, także te gorsze.',
    tech: 'Wix Harmony, Lighthouse, schema.org',
  },
  {
    id: 'work-ollabag-h',
    to: '/archive/olla-bag/',
    name: 'Olla Bag',
    image: '/media/ollabag/strona.webp',
    alt: 'Strona główna sklepu ollabag.com z hasłem A handbag when you want it, a trolley when you need it i przyciskiem Shop Olla',
    tag: 'Sklep na Shopify',
    meta: 'Torebka zamieniająca się w wózek, Wielka Brytania',
    desc: 'Cały sklep zbudowany od początku do końca: ścieżka zakupu krok po kroku, struktura karty produktu i wybór koloru.',
    tech: 'Shopify',
  },
  {
    id: 'work-budujzdrowo-h',
    to: '/archive/budujzdrowo/',
    name: 'Buduj Zdrowo',
    image: '/media/budujzdrowo/strona.webp',
    alt: 'Strona główna budujzdrowo.pl: zdjęcie szkieletu domu z logo Zdrowa Budowa, menu i przycisk Formularz wyceny',
    tag: 'Strona wykonawcy domów szkieletowych',
    meta: 'Zdrowa Budowa, firma budująca domy szkieletowe i murowane, Mazowsze',
    desc: 'Strona wykonawcy domów szkieletowych z kalkulatorem kosztów, 18 realizacjami w galeriach zdjęć i formularzem kontaktowym. Zbudowałem ją na WordPressie i Elementorze.',
    tech: 'WordPress, Elementor',
  },
  {
    id: 'work-enterauto-h',
    to: '/archive/enterauto/',
    view: 'tall',
    phone: {
      src: '/media/enterauto/telefon.webp',
      width: 780,
      height: 1688,
      alt: 'Strona enterauto.pl na telefonie: logo, niebieski Fiat 500, nagłówek, przycisk z numerem telefonu i przycisk Wycena online',
    },
    name: 'Enter Auto',
    image: '/media/enterauto/strona.webp',
    alt: 'Strona główna enterauto.pl: niebieski Fiat 500, nagłówek Zaoferowali zbyt mało i przyciski z telefonem oraz wyceną online',
    tag: 'Strona skupu aut z formularzem wyceny',
    meta: 'Enter Auto, skup i złomowanie aut, Wrocław i Dolny Śląsk',
    desc: 'Strona skupu aut z formularzem wyceny ze zdjęciami, osobną ścieżką dla kasacji, mapą obszaru i blogiem z 12 artykułami. Zbudowałem ją na WordPressie i Elementorze.',
    tech: 'WordPress, Elementor',
  },
];

const arrow = (
  <svg viewBox="0 0 40 18" aria-hidden="true">
    <path className="stroke" strokeWidth="1.8" d="M1 9H38M30 1L38 9L30 17" />
  </svg>
);

export default function Also({ go, as: Name = 'h2' }) {
  return cases.map(item => (
    <div className="work__row work__row--also" key={item.to}>
      <img
        className="work__also"
        src={withPrefix(item.image)}
        width="1200"
        height="595"
        loading="lazy"
        decoding="async"
        alt={item.alt}
      />
      <Reveal className="work__text">
        <p className="work__tag">{tie(item.tag)}</p>
        <Name className="work__name" id={item.id}>
          <Link className="work__link" to={item.to}>
            {item.name}
          </Link>
        </Name>
        <p className="work__meta">{tie(item.meta)}</p>
        <p className="work__desc">{tie(item.desc)}</p>
        <p className="work__tech">{item.tech}</p>
        <p className="work__go" aria-hidden="true">
          <span>{go}</span>
          {arrow}
        </p>
      </Reveal>
      <Link className="work__cover" to={item.to} aria-hidden="true" tabIndex={-1} />
    </div>
  ));
}
