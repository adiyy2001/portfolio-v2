import React from 'react';
import Hero from '../components/hero';
import Seo from '../components/seo';
import { tie } from '../i18n';

export default function ScannerTerms() {
  return (
    <>
      <Hero
        id="terms-h"
        sr="Regulamin skanera dostępności, "
        title="Regulamin | skanera."
        size="work">
        <p className="lead" data-rise style={{ '--r': 0 }}>
          {tie('Zasady bezpłatnego skanera dostępności na tej stronie, prostymi słowami.')}
        </p>
      </Hero>
      <section className="prose" aria-label="Regulamin skanera dostępności">
        <h2>1. Kto świadczy usługę</h2>
        <p>
          Usługodawcą jest Adrian Turbiński, prowadzący jednoosobową działalność gospodarczą pod
          firmą Adrian Turbiński, ul. Przejazdowa 21C lok. 19, 51-167 Wrocław, NIP 8952236530, REGON
          520691289, wpisany do CEIDG. Kontakt: contact@adrianturbinski.pl. Ten regulamin jest
          regulaminem świadczenia usług drogą elektroniczną w rozumieniu art. 8 ustawy z dnia 18
          lipca 2002 r. o świadczeniu usług drogą elektroniczną.
        </p>
        <h2>2. Słowniczek</h2>
        <ul>
          <li>Skaner: bezpłatna usługa dostępna pod adresem adrianturbinski.pl/skaner/.</li>
          <li>
            Użytkownik: osoba, która wysyła formularz skanera. Może być konsumentem, przedsiębiorcą
            albo osobą fizyczną prowadzącą działalność, dla której umowa nie ma charakteru
            zawodowego.
          </li>
          <li>
            Strona skanowana: publicznie dostępna strona internetowa pod adresem podanym w
            formularzu.
          </li>
          <li>
            Raport: dokument HTML z wynikami automatycznych testów dostępności, dostępny pod
            indywidualnym linkiem.
          </li>
        </ul>
        <h2>3. Co robi skaner</h2>
        <p>
          Po potwierdzeniu zlecenia skaner otwiera stronę skanowaną w odizolowanej przeglądarce na
          moim serwerze w Polsce, sprawdza do 10 publicznie dostępnych podstron w widoku komputera i
          telefonu silnikiem axe-core, zapisuje raport i wysyła link do niego na podany adres
          e-mail. Raport zawiera listę wykrytych barier, zrzuty ekranu i fragmenty kodu HTML strony
          skanowanej.
        </p>
        <p>
          Skaner nie loguje się na strony, nie wypełnia formularzy kontaktowych ani zakupowych i nie
          omija zabezpieczeń. Jedyny wyjątek to baner zgody na cookies: skaner najpierw sprawdza
          stronę główną z widocznym banerem, a potem automatycznie akceptuje albo zamyka baner, żeby
          ocenić treść pod nim. Strona skanowana może wtedy zapisać swoje cookies w przeglądarce
          skanera; przeglądarka jest czyszczona po każdym zadaniu. Skaner respektuje plik robots.txt
          strony skanowanej, także po przekierowaniu, i pomija zakazane w nim podstrony. Jeśli
          strona główna przekierowuje na inną domenę, skan się nie odbywa, a Ty dostajesz mail z tą
          informacją.
        </p>
        <p>
          Usługa jest bezpłatna. Nie ma obowiązku kupowania czegokolwiek ani wyrażania zgody
          marketingowej, żeby otrzymać raport.
        </p>
        <h2>4. Wymagania techniczne</h2>
        <p>
          Potrzebujesz urządzenia z aktualną przeglądarką internetową z włączoną obsługą JavaScript,
          dostępu do internetu i działającej skrzynki e-mail, na którą dotrą dwa maile: z linkiem do
          strony potwierdzenia i z linkiem do raportu. Formularz chroni Cloudflare Turnstile, który
          musi się załadować, żeby wysyłka zadziałała.
        </p>
        <h2>5. Zawarcie i rozwiązanie umowy</h2>
        <p>
          Umowa o bezpłatne wykonanie skanu zostaje zawarta w chwili, gdy wyślesz formularz z
          zaakceptowanym regulaminem, otworzysz link z maila i klikniesz na stronie potwierdzenia
          przycisk „Potwierdzam i zlecam skan”. Samo otwarcie linku, na przykład przez program
          pocztowy, nie potwierdza zlecenia. Bez kliknięcia przycisku w ciągu 24 godzin zlecenie
          wygasa, a dane z formularza usuwam najpóźniej w ciągu kolejnej doby. Umowa kończy się z
          chwilą dostarczenia linku do raportu, a raport pozostaje dostępny przez 30 dni od skanu.
        </p>
        <p>
          Możesz w każdej chwili i bez podawania przyczyny zrezygnować ze skanu albo poprosić o
          wcześniejsze usunięcie raportu i swoich danych, pisząc na contact@adrianturbinski.pl.
          Konsument i osoba fizyczna prowadząca działalność, dla której umowa nie ma charakteru
          zawodowego, mogą ponadto odstąpić od umowy w terminie 14 dni od jej zawarcia bez podawania
          przyczyny i bez kosztów, tą samą drogą. Ponieważ usługa jest bezpłatna i wykonywana od
          razu po potwierdzeniu, odstąpienie oznacza w praktyce usunięcie raportu i danych zlecenia.
        </p>
        <h2>6. Zasady korzystania</h2>
        <ul>
          <li>
            Skanuj tylko strony własne, strony, do których masz prawo w imieniu ich właściciela,
            albo strony publicznie dostępne bez logowania.
          </li>
          <li>
            Jedna domena może być skanowana raz na 24 godziny. Domenę liczę jako domenę
            rejestrowalną, więc firma.pl i sklep.firma.pl to jedna domena; na platformach
            hostingowych, gdzie każdy klient ma własną subdomenę (na przykład github.io), każda
            subdomena liczy się osobno.
          </li>
          <li>
            Z jednego adresu IP (dla IPv6: z jednej sieci /64) i na jeden adres e-mail można zamówić
            do 3 skanów na dobę. Adres e-mail porównuję po ujednoliceniu: bez części po znaku plus,
            a dla Gmaila także bez kropek w nazwie.
          </li>
          <li>
            Nie używaj skanera do przeciążania, testowania obciążenia ani zakłócania pracy cudzych
            serwisów, do obchodzenia zabezpieczeń ani do pozyskiwania danych osobowych innych osób.
          </li>
          <li>
            Nie podawaj adresów stron z treściami bezprawnymi ani nie wpisuj w formularzu treści
            bezprawnych. Zakaz dostarczania treści o charakterze bezprawnym wynika z art. 8 ust. 3
            pkt 2 lit. b ustawy o świadczeniu usług drogą elektroniczną.
          </li>
          <li>
            Mogę odmówić wykonania skanu lub przerwać go, gdy strona skanowana blokuje automatyczne
            wejścia, gdy zlecenie narusza te zasady albo gdy wygląda na nadużycie. O odmowie
            informuję mailem, jeśli adres został potwierdzony.
          </li>
          <li>
            Gdy skaner osiągnie dzienny limit zasobów, z których korzysta, chwilowo nie przyjmuje
            nowych zleceń i pokazuje o tym komunikat. Zlecenie możesz wtedy ponowić następnego dnia.
          </li>
        </ul>
        <h2>7. Czym jest raport, a czym nie jest</h2>
        <p>
          Raport powstaje automatycznie i pokazuje tylko te bariery, które da się wykryć maszynowo.
          Zwykle jest to część problemów z dostępnością strony. Raport nie stwierdza zgodności ani
          niezgodności strony z WCAG, normą EN 301 549 ani z ustawą z dnia 26 kwietnia 2024 r. o
          zapewnianiu spełniania wymagań dostępności niektórych produktów i usług. Nie jest audytem
          dostępności, opinią prawną ani gwarancją wyniku kontroli. Opisuje stan z dnia skanu i
          dotyczy wyłącznie sprawdzonych podstron wymienionych w raporcie.
        </p>
        <p>
          Zrzuty ekranu i fragmenty kodu w raporcie pochodzą ze strony skanowanej i służą tylko do
          pokazania miejsca problemu. Link do raportu jest prywatny: nie udostępniam go nikomu poza
          Tobą i nie publikuję raportów. To Ty decydujesz, komu przekazać link.
        </p>
        <h2>8. Odpowiedzialność</h2>
        <p>
          Dokładam starań, żeby skaner działał poprawnie, ale nie obiecuję, że będzie dostępny bez
          przerw ani że wykryje wszystkie bariery. Odpowiadam za szkody na zasadach ogólnych prawa
          cywilnego. Wobec użytkowników, którzy nie są konsumentami ani osobami fizycznymi
          korzystającymi z ochrony konsumenckiej, odpowiedzialność za nienależyte wykonanie
          bezpłatnej usługi jest ograniczona do szkód wyrządzonych umyślnie lub przez rażące
          niedbalstwo. Żadne postanowienie regulaminu nie wyłącza ani nie ogranicza praw, których
          nie można wyłączyć ani ograniczyć na podstawie przepisów prawa.
        </p>
        <p>
          Za zgodność strony skanowanej z prawem i za to, co zrobisz z raportem, odpowiadasz Ty.
          Zamawiając skan cudzej strony, potwierdzasz, że masz do tego prawo.
        </p>
        <h2>9. Reklamacje</h2>
        <p>
          Reklamację możesz złożyć mailem na contact@adrianturbinski.pl. Napisz, czego dotyczy, i
          podaj adres e-mail użyty w formularzu. Odpowiadam w ciągu 14 dni od otrzymania reklamacji,
          mailem na adres, z którego przyszła. Jeśli nie odpowiem w tym terminie, reklamację uważa
          się za uznaną.
        </p>
        <h2>10. Przechowywanie raportu</h2>
        <p>
          Raport jest przechowywany przez 30 dni od dnia skanu w Cloudflare Workers KV, a potem
          usuwany automatycznie. Jeśli chcesz go zachować, zapisz go wcześniej. Na Twoją prośbę
          usunę raport wcześniej.
        </p>
        <h2>11. Dane osobowe</h2>
        <p>
          Administratorem danych podanych w formularzu i zbieranych podczas skanu jestem ja. Pełna
          informacja o celach, podstawach, odbiorcach, okresach przechowywania i Twoich prawach
          znajduje się w{' '}
          <a href="/polityka-prywatnosci/#skaner">
            polityce prywatności, sekcja Skaner dostępności
          </a>
          .
        </p>
        <h2>12. Zmiany regulaminu</h2>
        <p>
          Mogę zmienić regulamin, gdy zmieni się zakres skanera, przepisy prawa albo dostawcy, z
          których korzystam. Nową wersję publikuję na tej stronie z datą wejścia w życie. Do skanów
          zamówionych przed zmianą stosuje się wersję, którą zaakceptowano w formularzu; jej treść i
          sumę kontrolną zapisuję razem ze zleceniem.
        </p>
        <h2>13. Prawo właściwe i spory</h2>
        <p>
          Regulamin podlega prawu polskiemu. Jeśli jesteś konsumentem, ten wybór nie pozbawia Cię
          ochrony, którą dają Ci bezwzględnie obowiązujące przepisy kraju Twojego zwykłego pobytu.
          Spory staram się rozwiązywać polubownie. Konsument może skorzystać z pomocy miejskiego lub
          powiatowego rzecznika konsumentów albo z pozasądowych sposobów rozpatrywania reklamacji,
          na przykład przed Inspekcją Handlową. Nie zobowiązuję się z góry do udziału w postępowaniu
          pozasądowym, chyba że przepis prawa tego wymaga; każdą propozycję rozważę indywidualnie.
          Sądem właściwym jest sąd według przepisów ogólnych.
        </p>
        <p>Regulamin obowiązuje od 30 października 2026.</p>
      </section>
    </>
  );
}

export const Head = () => (
  <Seo
    lang="pl"
    path="/regulamin-skanera/"
    title="Regulamin skanera dostępności, Adrian Turbiński"
    description="Zasady bezpłatnego skanera dostępności na adrianturbinski.pl: zakres usługi, limity, charakter raportu, reklamacje, odpowiedzialność i dane osobowe."
  />
);
