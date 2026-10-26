import React from 'react';
import Hero from '../components/hero';
import Seo from '../components/seo';
import { tie } from '../i18n';

export default function Privacy() {
  return (
    <>
      <Hero id="privacy-h" sr="Polityka prywatności, " title="Polityka | prywatności." size="work">
        <p className="lead" data-rise style={{ '--r': 0 }}>
          {tie('Co ta strona i moje narzędzia robią z danymi, prostymi słowami.')}
        </p>
      </Hero>
      <section className="prose" aria-label="Polityka prywatności">
        <h2>Kto odpowiada</h2>
        <p>
          Adrian Turbiński, jednoosobowa działalność gospodarcza Adrian Turbiński Software, Wrocław.
          Kontakt: contact@adrianturbinski.pl.
        </p>
        <h2>Ta strona</h2>
        <p>
          Strona nie ma formularzy. Hosting, GitHub Pages, prowadzi standardowe logi serwera z
          adresami IP według własnej polityki prywatności. Wejścia liczę GoatCounterem, licznikiem
          bez ciasteczek, który nie zapisuje danych osobowych.
        </p>
        <h2>Google Analytics</h2>
        <p>
          Jeśli zgodzisz się w banerze, Google Analytics 4 od Google Ireland Limited zapisze
          ciasteczka _ga i _ga_YPZS4964X7 na maksymalnie dwa lata, żebym widział, które strony są
          czytane i skąd przychodzą odwiedzający. Podstawą jest Twoja zgoda (art. 6 ust. 1 lit. a
          RODO). Google może przetwarzać dane w Stanach Zjednoczonych w ramach EU-US Data Privacy
          Framework. Raporty trzymam 14 miesięcy, funkcje reklamowe są wyłączone.
        </p>
        <p>
          Dopóki się nie zgodzisz, Google Analytics dostaje tylko sygnały bez ciasteczek i bez
          identyfikatorów. Wybór zmienisz w każdej chwili przyciskiem Ustawienia statystyk w stopce;
          wycofanie zgody usuwa ciasteczka.
        </p>
        <h2>Moje narzędzia do publikacji</h2>
        <p>
          Używam prywatnego narzędzia do własnej pracy. Publikuje moje posty na moim profilu
          LinkedIn, a artykuły na tej stronie i w DEV Community, i czyta statystyki moich postów
          (wyświetlenia, reakcje, komentarze, udostępnienia) przez oficjalne API LinkedIn i DEV,
          żeby planować kolejne teksty.
        </p>
        <ul>
          <li>Narzędzie działa tylko na moim koncie i z moim upoważnieniem.</li>
          <li>Nie zbiera, nie przechowuje i nie przetwarza danych innych użytkowników LinkedIn.</li>
          <li>
            Dane zostają na moim komputerze. Nie sprzedaję ich, nie udostępniam i nie używam do
            reklam.
          </li>
          <li>Dostęp mogę cofnąć w każdej chwili w ustawieniach kont LinkedIn i DEV.</li>
        </ul>
        <h2>Twoje prawa</h2>
        <p>
          Jeśli do mnie napiszesz, trzymam wiadomość tylko tak długo, jak wymaga tego rozmowa.
          Możesz poprosić o jej usunięcie albo o wgląd w to, co o Tobie mam, pisząc na
          contact@adrianturbinski.pl. Możesz też złożyć skargę do Prezesa UODO.
        </p>
        <p>Ostatnia aktualizacja: 26 października 2026.</p>
      </section>
    </>
  );
}

export const Head = () => (
  <Seo
    lang="pl"
    path="/polityka-prywatnosci/"
    title="Polityka prywatności, Adrian Turbiński"
    description="Co strona i narzędzia do publikacji Adriana Turbińskiego robią z danymi: GoatCounter, Google Analytics za zgodą i prawa osób."
  />
);
