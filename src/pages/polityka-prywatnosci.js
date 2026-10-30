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
          Adrian Turbiński, jednoosobowa działalność gospodarcza pod firmą Adrian Turbiński, ul.
          Przejazdowa 21C lok. 19, 51-167 Wrocław, NIP 8952236530, REGON 520691289. Kontakt:
          contact@adrianturbinski.pl.
        </p>
        <h2>Ta strona</h2>
        <p>
          Hosting, GitHub Pages, prowadzi standardowe logi serwera z adresami IP według własnej
          polityki prywatności. Wejścia i kliknięcia w przyciski kontaktu liczę GoatCounterem,
          licznikiem bez ciasteczek, który nie zapisuje danych osobowych.
        </p>
        <h2>Formularz wyceny</h2>
        <p>
          Formularz przesyła to, co w nim wpiszesz (usługę, budżet, opis projektu i e-mail lub
          telefon), przez Cloudflare Workers do mojego prywatnego czatu w Telegramie. W bazie
          Cloudflare D1 zapisuję tylko datę, język, wybraną usługę, budżet, stronę, z której wysłano
          formularz, źródło wejścia i kod promocyjny, żeby liczyć zapytania. Twojego kontaktu ani
          opisu projektu nie zapisuję w żadnej bazie. Cloudflare i Telegram przetwarzają dane jako
          dostawcy według własnych polityk prywatności, także poza Europejskim Obszarem
          Gospodarczym.
        </p>
        <p>
          Używam tych danych tylko do odpowiedzi na zapytanie i przygotowania oferty. Podstawą są
          działania na Twoje żądanie przed zawarciem umowy (art. 6 ust. 1 lit. b RODO). Podanie
          kontaktu jest dobrowolne, ale bez niego nie odpowiem.
        </p>
        <h2 id="skaner">Skaner dostępności</h2>
        <p>
          Bezpłatny skaner dostępności pod adresem /skaner/ to usługa świadczona drogą elektroniczną
          na zasadach opisanych w <a href="/regulamin-skanera/">regulaminie skanera</a>.
          Administratorem danych jestem ja, Adrian Turbiński (ul. Przejazdowa 21C lok. 19, 51-167
          Wrocław, contact@adrianturbinski.pl).
        </p>
        <h3>Jakie dane zbieram</h3>
        <ul>
          <li>adres strony do skanu i Twój adres e-mail;</li>
          <li>
            adres IP, identyfikator przeglądarki (user agent), czas wysłania formularza oraz czas
            kliknięcia przycisku potwierdzenia na stronie otwartej z linku w mailu;
          </li>
          <li>
            treść i wersję (sumę SHA-256) regulaminu i klauzul, które widziałeś w formularzu, stan
            obu pól wyboru i ewentualne wycofanie zgody;
          </li>
          <li>
            raport ze skanu: wyniki testów, zrzuty ekranu i fragmenty kodu HTML skanowanej strony,
            które mogą zawierać dane widoczne publicznie na tej stronie.
          </li>
        </ul>
        <h3>Po co i na jakiej podstawie</h3>
        <ul>
          <li>
            potwierdzenie adresu e-mail, wykonanie skanu, zapisanie raportu i wysłanie linku do
            niego: wykonanie umowy o bezpłatną usługę (art. 6 ust. 1 lit. b RODO);
          </li>
          <li>
            zapisanie dowodu, że zaakceptowałeś regulamin i jakie zgody wyraziłeś lub wycofałeś:
            obowiązek wykazania zgody (art. 7 ust. 1 RODO w związku z art. 6 ust. 1 lit. c RODO) i
            mój uzasadniony interes w obronie przed roszczeniami (art. 6 ust. 1 lit. f RODO);
          </li>
          <li>
            wysyłka informacji handlowych e-mailem, jeśli zaznaczysz osobną zgodę: Twoja zgoda (art.
            6 ust. 1 lit. a RODO i art. 398 ustawy Prawo komunikacji elektronicznej). To maksymalnie
            4 wiadomości w ciągu 14 dni o audytach dostępności, wdrażaniu poprawek WCAG i wymagań
            EAA oraz zaproszenie na rozmowę;
          </li>
          <li>
            bezpieczeństwo skanera, limity (jedna domena rejestrowalna raz na 24 godziny, do 3
            skanów na dobę z jednego adresu IP lub sieci IPv6 /64 i na jeden ujednolicony adres
            e-mail), ochrona przed spamem przez Cloudflare Turnstile i krótkie powiadomienie dla
            mnie o nowym skanie: mój uzasadniony interes w ochronie usługi i sprawnej obsłudze (art.
            6 ust. 1 lit. f RODO).
          </li>
        </ul>
        <h3>Kto dostaje dane</h3>
        <p>
          Formularz, baza i raport działają na Cloudflare Workers, D1 i Workers KV od Cloudflare,
          Inc. (USA). Maile wysyła Resend, usługa Plus Five Five, Inc. (USA). Sam skan wykonuje mój
          serwer w Polsce. Powiadomienie o nowym skanie trafia do mojego czatu w Telegramie i
          zawiera tylko domenę skanowanej strony, liczbę wykrytych błędów i informację, czy
          wyraziłeś zgodę marketingową; nie zawiera Twojego e-maila ani IP.
        </p>
        <p>
          Cloudflare, Inc. i Plus Five Five, Inc. mogą przetwarzać dane w Stanach Zjednoczonych.
          Obie firmy są certyfikowane w EU-US Data Privacy Framework, więc przekazanie odbywa się na
          podstawie decyzji Komisji Europejskiej o odpowiednim stopniu ochrony (art. 45 RODO).
          Telegram może przetwarzać treść powiadomienia poza Europejskim Obszarem Gospodarczym
          według własnej polityki prywatności.
        </p>
        <h3>Jak długo trzymam dane</h3>
        <ul>
          <li>raport: 30 dni od skanu, potem jest usuwany automatycznie;</li>
          <li>
            zlecenie niepotwierdzone przyciskiem w ciągu 24 godzin: usuwam je najpóźniej po 48
            godzinach od wysłania formularza;
          </li>
          <li>
            dane zlecenia i dowód Twoich wyborów (adres strony, e-mail, IP, user agent, czasy, treść
            i wersja klauzul, stan pól wyboru): do 31 grudnia trzeciego roku kalendarzowego po roku,
            w którym potwierdzono zlecenie, czyli do upływu przedawnienia roszczeń związanych z
            działalnością gospodarczą (art. 118 Kodeksu cywilnego);
          </li>
          <li>
            dane do wysyłki marketingowej: do wycofania zgody albo do wysłania ostatniej wiadomości
            sekwencji; dowód zgody i jej wycofania do 31 grudnia trzeciego roku kalendarzowego po
            roku, w którym zgodę wycofano albo sekwencja się skończyła.
          </li>
        </ul>
        <p>
          Usuwanie po tych terminach wykonuje automat raz na dobę, więc dane znikają najpóźniej w
          ciągu doby po upływie okresu. Na Twoją prośbę usuwam wcześniej to, czego nie muszę
          zachować jako dowodu.
        </p>
        <h3>Twoje prawa</h3>
        <p>
          Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania i
          przeniesienia. Masz prawo wnieść sprzeciw wobec przetwarzania opartego na moim
          uzasadnionym interesie (art. 21 RODO), a wobec marketingu w każdej chwili i bez podawania
          przyczyny. Zgodę marketingową możesz wycofać w każdej chwili linkiem w każdej wiadomości
          albo mailem na contact@adrianturbinski.pl; wycofanie nie wpływa na zgodność z prawem
          wysyłki sprzed wycofania. Masz też prawo złożyć skargę do Prezesa Urzędu Ochrony Danych
          Osobowych. Z praw korzystasz, pisząc na contact@adrianturbinski.pl.
        </p>
        <h3>Dobrowolność i automatyzacja</h3>
        <p>
          Podanie adresu strony i e-maila jest dobrowolne, ale bez nich nie wykonam skanu ani nie
          wyślę raportu. Zgoda marketingowa jest dobrowolna i nie wpływa na raport. Skaner działa
          automatycznie, ale nie profiluje Cię i nie podejmuje wobec Ciebie decyzji w rozumieniu
          art. 22 RODO; ocenia wyłącznie kod strony.
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
        <h2>Microsoft Clarity</h2>
        <p>
          Jeśli zgodzisz się w banerze, ładuję też Microsoft Clarity od Microsoft Corporation.
          Clarity zapisuje, jak przewijasz stronę i gdzie klikasz, a ja oglądam z tego mapy kliknięć
          i nagrania sesji, żeby zobaczyć, które miejsca strony są niejasne. Pola formularzy, w tym
          cały formularz wyceny, są maskowane, więc to, co wpisujesz, do Clarity nie trafia. Clarity
          zapisuje ciasteczka _clck (na rok) i _clsk (na dobę), a Microsoft także własne, na
          przykład MUID (na rok). Podstawą jest Twoja zgoda (art. 6 ust. 1 lit. a RODO). Microsoft
          może przetwarzać dane w Stanach Zjednoczonych w ramach EU-US Data Privacy Framework.
        </p>
        <p>
          Bez zgody Clarity w ogóle się nie ładuje. Wycofanie zgody przyciskiem Ustawienia statystyk
          w stopce wyłącza nagrywanie i usuwa ciasteczka _clck i _clsk.
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
        <p>Ostatnia aktualizacja: 30 października 2026.</p>
      </section>
    </>
  );
}

export const Head = () => (
  <Seo
    lang="pl"
    path="/polityka-prywatnosci/"
    title="Polityka prywatności, Adrian Turbiński"
    description="Co strona i narzędzia Adriana Turbińskiego robią z danymi: formularz wyceny, skaner dostępności, GoatCounter, Google Analytics i Microsoft Clarity za zgodą oraz prawa osób."
  />
);
