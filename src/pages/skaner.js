import React from 'react';
import { Link } from 'gatsby';
import Hero from '../components/hero';
import Reveal from '../components/reveal';
import ScanForm from '../components/scan-form';
import ScanSample from '../components/scan-sample';
import ScanSeam from '../components/scan-seam';
import Seo from '../components/seo';
import Split from '../components/split';
import { routes, tie } from '../i18n';

const copy = {
  title: 'Darmowy | skan dostępności.',
  lead: 'Wpisz adres strony, a po kilkunastu minutach dostaniesz mailem raport z barierami dostępności.',
  lead2:
    'W raporcie jest do 10 podstron w wersji na komputer i na telefon: błędy WCAG 2.1 i 2.2 z przykładami poprawek, po polsku. Uczciwie: automat znajduje tylko część barier, reszta wymaga sprawdzenia ręcznego.',
  cta: 'Zleć skan',
  formTitle: 'Zleć skan.',
  flowTitle: 'Jak to działa.',
  flow: [
    ['Miara.', 'Podajesz adres strony i e-mail oraz akceptujesz regulamin.'],
    ['Przymiarka.', 'Klikasz link potwierdzający z maila. Bez tego skan nie rusza.'],
    [
      'Oddanie.',
      'Po kilkunastu minutach dostajesz link do raportu. Raport jest dostępny 30 dni od skanu.',
    ],
  ],
  checkTitle: 'Co sprawdzam.',
  checkLead: 'Automat przechodzi po stronie i zgłasza to, co da się zmierzyć.',
  checks: [
    'język strony i tytuły podstron',
    'poprawność atrybutów ARIA',
    'nagłówki, strukturę strony i punkty orientacyjne',
    'kontrast tekstu i elementów interfejsu',
    'obecność tekstów alternatywnych obrazków',
    'etykiety pól formularzy i komunikaty błędów',
    'nazwy linków i przycisków',
    'wielkość celów dotyku (WCAG 2.2)',
    'zawijanie i skalowanie treści na telefonie',
  ],
  seamMachine: 'tu szyje automat',
  seamHand: 'dalej tylko ręcznie',
  manualTitle: 'Czego automat nie sprawdzi.',
  manual: [
    'Jak stronę czyta czytnik ekranu i czy kolejność oraz komunikaty mają sens.',
    'Czy cały proces, na przykład zamówienie, da się przejść samą klawiaturą.',
    'Czy teksty alternatywne opisują to, co faktycznie jest na obrazku.',
    'Czy wideo ma napisy i opis dla osób niewidomych.',
    'Czy pliki PDF są dostępne.',
    'Czy treści są zrozumiałe i jasno napisane.',
  ],
  lawTitle: 'Kogo dotyczy ustawa.',
  law: [
    'Ustawa z 26 kwietnia 2024 r. o zapewnianiu spełniania wymagań dostępności niektórych produktów i usług przez podmioty gospodarcze (Dz.U. 2024 poz. 731) wdraża Europejski akt o dostępności.',
    'Od 28 czerwca 2025 r. obejmuje wybrane usługi dla konsumentów, między innymi sklepy internetowe. Nie dotyczy usług świadczonych przez mikroprzedsiębiorców (art. 4 pkt 1).',
    'To ogólna informacja, nie porada prawna. Skan pokazuje stan samej strony, a o tym, czy ustawa dotyczy twojej firmy, decyduje rodzaj usługi i wielkość firmy.',
  ],
  more: 'Pełny audyt i wdrożenie poprawek',
};

export default function Scanner() {
  return (
    <>
      <Hero
        id="scan-h"
        sr="Skaner dostępności, "
        title={copy.title}
        size="work"
        aside={<ScanSample />}>
        <p className="lead" data-rise style={{ '--r': 0 }}>
          {tie(copy.lead)}
        </p>
        <p className="scan-cta" data-rise style={{ '--r': 1 }}>
          <a className="btn" href="#skan" data-cta="scan-hero">
            {copy.cta}
          </a>
        </p>
        <p className="lead2" data-rise style={{ '--r': 2 }}>
          {tie(copy.lead2)}
        </p>
      </Hero>
      <section className="scan-sec" aria-labelledby="scan-form-h">
        <div className="sec-head">
          <h2 className="h2" id="scan-form-h">
            <Split text={copy.formTitle} onView />
          </h2>
        </div>
        <div className="scan-grid">
          <ScanForm />
          <div className="scan-flow">
            <h3 className="scan-flow__h">
              <Split text={copy.flowTitle} onView />
            </h3>
            <ol className="scan-flow__list">
              {copy.flow.map(([name, text]) => (
                <Reveal as="li" key={name}>
                  <span className="scan-flow__name">{name}</span>
                  <span className="scan-flow__text">{tie(text)}</span>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>
      <section className="paper scan-paper" aria-labelledby="scan-check-h">
        <div className="sec-head">
          <h2 className="h2" id="scan-check-h">
            <Split text={copy.checkTitle} onView />
          </h2>
          <p className="sec-head__side">{tie(copy.checkLead)}</p>
        </div>
        <ul className="scan-checks">
          {copy.checks.map((item, i) => (
            <Reveal as="li" key={item} style={{ '--i': i }}>
              {tie(item)}
            </Reveal>
          ))}
        </ul>
      </section>
      <section className="who scan-who" aria-labelledby="scan-manual-h">
        <ScanSeam machine={copy.seamMachine} hand={copy.seamHand} />
        <div className="sec-head">
          <h2 className="h2" id="scan-manual-h">
            <Split text={copy.manualTitle} onView />
          </h2>
        </div>
        <ol className="who__list">
          {copy.manual.map((item, i) => (
            <Reveal as="li" className="who__item" key={item} style={{ '--i': i }}>
              {tie(item)}
            </Reveal>
          ))}
        </ol>
      </section>
      <section className="paper scan-paper" aria-labelledby="scan-law-h">
        <div className="sec-head">
          <h2 className="h2" id="scan-law-h">
            <Split text={copy.lawTitle} onView />
          </h2>
        </div>
        <div className="scan-law">
          {copy.law.map(paragraph => (
            <p key={paragraph}>{tie(paragraph)}</p>
          ))}
          <p className="scan-law__more">
            <Link className="btn btn--wool" to={routes['svc-wcag'].pl} data-cta="scan-to-audit">
              {tie(copy.more)}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

export const Head = () => (
  <Seo
    lang="pl"
    path="/skaner/"
    title="Darmowy skan dostępności strony WCAG i EAA, raport mailem, Adrian Turbiński"
    description="Darmowy skan dostępności strony pod WCAG 2.1 i 2.2 oraz EAA: do 10 podstron, desktop i mobile, raport po polsku z przykładami poprawek."
  />
);
