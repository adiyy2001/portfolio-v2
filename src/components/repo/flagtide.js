const repo = 'https://github.com/adiyy2001/flagtide';
const adr = file => `${repo}/blob/main/docs/adr/${file}.md`;

const flagtide = {
  id: 'flagtide',
  name: 'flagtide',
  repo,
  demo: 'https://flagtide.adrianturbinski.pl/',
  results: `${repo}/tree/main/bench/results`,
  packages: [
    { name: '@flagtide/core', href: 'https://www.npmjs.com/package/@flagtide/core' },
    { name: '@flagtide/angular', href: 'https://www.npmjs.com/package/@flagtide/angular' },
  ],
  languages: ['Java', 'TypeScript'],
  video: { width: 960, height: 540 },
  pl: {
    title: 'flagtide: feature flagi w Angularze i Quarkusie, Adrian Turbiński',
    description:
      'Samodzielnie hostowane feature flagi: Quarkus wypycha zmiany przez WebSockety, a SDK w Angularze liczy je lokalnie. Demo na żywo, kod i liczby z pomiarów.',
    meta: 'Feature flagi w czasie rzeczywistym',
    lead: 'Samodzielnie hostowany serwis feature flag: Quarkus wypycha zmiany do każdej otwartej przeglądarki przez WebSockety, a SDK w Angularze liczy flagi lokalnie z tym samym wynikiem co serwer.',
    clip: 'Po lewej admin, po prawej sklep demo. Flaga zostaje wyłączona i włączona, rollout idzie z 20 na 60 i z powrotem na 30 procent, a na końcu monitor propagacji pokazuje p50, p95 i p99.',
    note: 'Demo na żywo to admin i sklep obok siebie, na tych samych obrazach produkcyjnych. Każdy może edytować flagi, a dane wracają do stanu startowego co godzinę.',
    why: [
      'Feature flagi są w moim codziennym stacku. Nie dawały mi spokoju dwa pytania. Jak dostarczyć zmianę flagi do tysięcy otwartych przeglądarek w dużo mniej niż sekundę? I skąd wiadomo, że Java na serwerze i TypeScript w przeglądarce dają tę samą odpowiedź dla tej samej flagi?',
      'Pracuję głównie w Angularze, a back-endy buduję też w Javie i Quarkusie, więc ten projekt stoi po obu stronach tej granicy. Chciałem jednego zwartego projektu, który pokazuje architekturę heksagonalną i DDD na prawdziwej domenie z prawdziwymi regułami, a nie na zabawkowym CRUD-zie.',
    ],
    tryLead:
      'Admin pisze do jednej instancji serwera, a sklep słucha drugiej, więc każda zmiana przechodzi przez PostgreSQL.',
    features: [
      [
        'Przełącznik flagi',
        'Wyłącz „promo-banner” w adminie po lewej. Baner znika ze sklepu po prawej, chociaż sklep słucha innej instancji serwera.',
      ],
      [
        'Rollout procentowy',
        'Otwórz „beta-recommendations” i zmień procent w regule domyślnej. Link „Recommended” w sklepie pojawia się albo znika, a pole „Browsing as” w stopce sklepu zmienia gościa.',
      ],
      [
        'Test kontekstu',
        'W edytorze flagi wpisz klucz i atrybuty w „Try a context”. Szkic, także niezapisany, liczy ten sam ewaluator, którego używa SDK w przeglądarce.',
      ],
      [
        'Monitor propagacji',
        'Zakładka „Propagation” w adminie pokazuje czas od commitu do potwierdzenia od klienta: p50, p95 i p99.',
      ],
      [
        'Nadpisania i status',
        'Panel „Flags” w rogu sklepu nadpisuje flagę tylko w twojej przeglądarce. Odznaka w nagłówku mówi, czy flagi są na żywo, z pamięci czy offline.',
      ],
    ],
    calls: [
      {
        name: 'Dwa języki, jedna odpowiedź.',
        text: 'Rollout haszuje klucz kontekstu, a każda różnica w arytmetyce ze znakiem, w UTF-8 albo w porządku semver wysyła użytkownika do innego wariantu na serwerze niż w przeglądarce. Algorytm jest spisany jako specyfikacja, oba silniki to mój kod, a 616 wspólnych wektorów leci w obu językach w CI. Oczekiwane hasze liczy niezależna wyrocznia w Pythonie, więc błąd wspólny dla obu silników nie przejdzie.',
        cost: 'Cena: dwie własne implementacje MurmurHash3 zamiast biblioteki i specyfikacja z numerem wersji.',
        lost: 'Przegrały procenty zmiennoprzecinkowe (różne zaokrąglenia w różnych językach), gotowe hasze z Guavy albo npm (ukryłyby decyzje o Unicode i znaku) i oczekiwane wartości liczone silnikiem w Javie (wspólny błąd przeszedłby niezauważony).',
        adr: ['ADR 0009', adr('0009-evaluation-bucketing-conformance')],
      },
      {
        name: 'Kilka instancji bez brokera.',
        text: 'PostgreSQL NOTIFY zachowuje kolejność, ale nie jest trwały i mieści najwyżej 8000 bajtów. Powiadomienie niesie więc tylko wskaźnik, każda instancja czyta dziennik zmian od wersji, którą zna, a każde ponowne połączenie słuchacza uruchamia resynchronizację. Test zabija backend słuchacza i sprawdza, że następna zmiana i tak dochodzi.',
        cost: 'Cena: instancja, która zapisała zmianę, robi jedną dodatkową rundę przez bazę, zanim zobaczą ją jej klienci. W compose to kilka milisekund.',
        lost: 'Przegrały zewnętrzny broker (Redis, NATS, Kafka), bo to kolejny ruchomy element, a prawdę i tak trzyma PostgreSQL, cała zmiana w powiadomieniu, bo nie mieści się w 8000 bajtów, i odpytywanie, bo dokłada opóźnienie i stałe obciążenie bazy.',
        adr: ['ADR 0008', adr('0008-change-log-versions-and-notify')],
      },
      {
        name: '5000 gniazd i jedno wolne.',
        text: 'Zmiana jest serializowana raz na instancję i ten sam tekst idzie do każdego gniazda. Połączenie, w którym czeka ponad 256 ramek, jest zamykane, więc jeden zablokowany klient nie wstrzymuje reszty.',
        cost: 'Cena: każda instancja rozsyła z jednego wątku, a klient, który nie nadąża, traci połączenie.',
        lost: 'Przegrały osobna ramka dla każdego klienta (przy 5000 klientów kilka razy więcej alokacji) i wątek na każde środowisko (praca na jedno powiadomienie to jedno zapytanie i jeden tekst, a rozsyłanie i tak zależy od zapisów do gniazd).',
        adr: ['ADR 0017', adr('0017-stream-fan-out-and-load-test')],
      },
    ],
    numbers: [
      [
        '77 ms',
        'p95 od commitu do odbioru w przeglądarce. 5000 WebSocketów na dwóch instancjach, 30 zmian, 150 000 ramek, p50 38 ms, p99 90 ms. Cel: poniżej 300 ms. Sześć przebiegów na tej maszynie dało p95 od 77 do 169 ms.',
      ],
      [
        '412 ns',
        'Średni czas oceny flagi z rolloutem procentowym w @flagtide/core, w Node. W headless Chromium 315 ns. Cel: poniżej 5 µs.',
      ],
      [
        '616',
        'Wspólnych wektorów zgodności, w tym 419 przypadków oceny. Lecą w Javie i w TypeScripcie, a każda różnica zatrzymuje CI.',
      ],
      [
        '30 do 80 ms',
        'Od kliknięcia w adminie do zmienionego DOM w sklepie, w teście Cypress na całym stosie. Budżet: jedna sekunda.',
      ],
      [
        '1327',
        'Testów w modułach serwera. Do tego 199 w @flagtide/core, 39 w @flagtide/angular, 200 w adminie i 64 w sklepie. Pokrycie linii: 98,7% w @flagtide/core i 99,1% w domenie serwera.',
      ],
      [
        '100',
        'Dostępność w Lighthouse na sześciu stronach admina i dwóch stronach sklepu, na obrazach produkcyjnych.',
      ],
    ],
    machine:
      'Zmierzone na jednym laptopie: Intel Core i7-12700H, 20 rdzeni logicznych, 15,5 GiB RAM, Linux pod WSL2, Docker 29.1.3, Node 24.21. Klienci, serwery i PostgreSQL działały na tej samej maszynie, więc to liczby dla niej, nie dla sieci między serwerownią a telefonem.',
    gapsLead: 'Cele dodatkowe wypadały pierwsze. Testy i poprawność nie wypadły nigdy.',
    gaps: [
      [
        'Flagi zależne od innych flag',
        'Wymagają zmiany specyfikacji, wykrywania cykli i nowych wektorów w obu językach. To jeszcze jedno miejsce, w którym Java i TypeScript mogłyby się rozjechać.',
      ],
      [
        'Zmiany zaplanowane w czasie',
        'Potrzebują harmonogramu, który na dwóch instancjach odpali zmianę dokładnie raz. To osobny projekt.',
      ],
      [
        'Adapter Oracle',
        'Porty mają już testy kontraktowe, więc cel jest jasny. Kontener Oracle w CI jest jednak ciężki dla współdzielonego laptopa.',
      ],
      [
        'Zapasowe SSE',
        'Drugi transport obok WebSocketów podwoiłby testy ponownego łączenia i statusu, a potwierdzenia dla monitora propagacji wracają tym samym gniazdem.',
      ],
      [
        'Logowanie do admina',
        'Klucze admina trafiają do przeglądarki w pliku config.json. Na demo to wystarcza, prawdziwe wdrożenie potrzebuje logowania przed adminem.',
      ],
      [
        'Inne przeglądarki',
        'Testy end to end i wszystkie liczby z przeglądarki pochodzą z Chrome. Firefox, Safari i czytniki ekranu nie są przetestowane.',
      ],
    ],
    next: 'Najpierw adapter Oracle, bo testy kontraktowe już mówią, co ma robić. Potem flagi zależne z kontrolą cykli, czyli zmiana specyfikacji i nowe wektory w obu językach. Potem zmiany zaplanowane, z jednym wykonawcą na wszystkie instancje.',
    gapsAdr: ['ADR 0021: czego nie zbudowałem', adr('0021-what-is-not-built')],
    stack: [
      'Angular',
      'TypeScript',
      'RxJS',
      'Signals',
      'Angular Material',
      'Java',
      'Quarkus',
      'WebSockets',
      'REST API',
      'Docker',
      'Cypress',
      'Monorepo Nx',
      'Architektura heksagonalna',
      'DDD',
    ],
  },
  en: {
    title: 'flagtide: feature flags in Angular and Quarkus, Adrian Turbiński',
    description:
      'Self-hosted feature flags: Quarkus pushes changes over WebSockets and an Angular SDK evaluates them locally. Live demo, code and measured numbers.',
    meta: 'Real-time feature flags',
    lead: 'Self-hosted feature flag service. Uses Quarkus as a backend which pushes flag updates to every open browser via WebSockets and has an Angular SDK which evaluates the flags locally with the same result as the server.',
    clip: 'Left is the admin and right is the demo shop. Then there is a flag turned off and back on. A rollout changes from 20 to 60 and back to 30 percent. Then there is the propagation monitor showing p50, p95 and p99.',
    note: 'Live demo shows admin next to the shop using the same production images. Flags can be edited by anyone and the data is reset hourly back to the seed.',
    why: [
      'I use feature flags on a daily basis. I had been wondering about two things. How can a flag update be propagated to thousands of open browsers in well under a second? How do you ensure that the same flag produces the same result in both the TypeScript client and the Java server?',
      'I primarily develop in Angular but also develop Quarkus and Java back ends. This project straddles this divide. I also wanted one compact project that shows domain-driven design and hexagonal architecture on a real domain with real rules rather than a CRUD toy.',
    ],
    tryLead:
      'The admin writes to one server instance and the shop listens to the other, so every change crosses PostgreSQL.',
    features: [
      [
        'Flag toggle',
        'Switch promo-banner off in the admin on the left. The banner leaves the shop on the right, although the shop listens to another server instance.',
      ],
      [
        'Percentage rollout',
        'Open beta-recommendations and change the percentage in the default rule. The Browsing as field in the shop footer switches the visitor and the Recommended link appears or disappears in the shop.',
      ],
      [
        'Try a context',
        'In the flag editor, enter a key and attributes under Try a context. The draft, including unsaved edits, is evaluated by the same evaluator used by the browser SDK.',
      ],
      [
        'Propagation monitor',
        "The Propagation tab in the admin shows the time from commit to the client's acknowledgement: p50, p95 and p99.",
      ],
      [
        'Overrides and status',
        'The Flags corner panel only overrides browser flags. The status of the flags (live, cached or offline) is indicated by the badge in the header.',
      ],
    ],
    calls: [
      {
        name: 'Two languages, one answer.',
        text: 'Rollouts uses hashing on the context key. If there is a difference in signed arithmetic, semver ordering, UTF-8 processing between the browser and server a user will be routed to a different rollouts variant. The algorithm is a written spec and both implementations are written by me. 616 common test vectors are run in both implementations as part of the CI process. An independent Python oracle provides the expected hash values. This means that a fault present in both implementations would be caught.',
        cost: 'The cost: two MurmurHash3 implementations of my own instead of a library, and a spec with a version number.',
        lost: 'What was lost: floating point percentages (rounding differs across languages), library hashes from Guava or npm (which would have masked the Unicode and signedness decisions), and expected values generated by the Java engine (enabling an undetected common flaw).',
        adr: ['ADR 0009', adr('0009-evaluation-bucketing-conformance')],
      },
      {
        name: 'Several instances, no broker.',
        text: 'PostgreSQL NOTIFY is ordered but not durable and is limited to 8,000 bytes. This means the payload is only a pointer and every instance reads the change log after the version it has already seen. Listeners will also need to resync on reconnect. A test will kill the listener backend and verify the next change still arrives.',
        cost: 'The cost is that the instance that wrote a change must make one extra round trip through the database before its own clients can view the change. This is a few milliseconds in compose.',
        lost: 'So, what is lost? An external broker (Kafka, NATS, Redis), an additional moving piece while PostgreSQL already has the data, the full change in the payload, which breaks at the 8,000 byte limit, and polling which causes constant database load and latency.',
        adr: ['ADR 0008', adr('0008-change-log-versions-and-notify')],
      },
      {
        name: '5,000 sockets and a slow one.',
        text: 'Changes are serialized once per instance and are delivered to all sockets as the same string. If a connection has more than 256 frames pending, the connection is closed to avoid one stuck client from impacting the others.',
        cost: 'The cost: each instance fans out from one thread, and a client that cannot keep up loses its connection.',
        lost: 'What lost: a frame serialized per client (several times more allocation at 5,000 clients) and a thread per environment (the work per notification is one query and one string, and the fan-out is dominated by socket writes anyway).',
        adr: ['ADR 0017', adr('0017-stream-fan-out-and-load-test')],
      },
    ],
    numbers: [
      [
        '77 ms',
        'p95 from commit to receipt in client. 30 changes, 150,000 frames, 5,000 WebSockets on two instances. p50 38 ms, p99 90 ms. Goal: <300 ms. 6 runs here on this machine with p95 ranging from 77 to 169 ms.',
      ],
      [
        '412 ns',
        'Mean time to evaluate a percentage rollout flag in @flagtide/core, in Node. 315 ns in headless Chromium. Target: under 5 µs.',
      ],
      [
        '616',
        'Shared conformance vectors, 419 of them evaluation cases. They run in Java and in TypeScript, and any mismatch stops CI.',
      ],
      [
        '30 to 80 ms',
        'From a click in the admin to the changed DOM in the shop, in a Cypress test on the full stack. Budget: one second.',
      ],
      [
        '1,327',
        'Testing in the server modules. 199 tests in @flagtide/core, 39 in @flagtide/angular, 200 in admin and 64 in shop. Line coverage: 98.7% in @flagtide/core and 99.1% in the server domain.',
      ],
      [
        '100',
        'Lighthouse accessibility on six admin pages and two shop pages, against the production images.',
      ],
    ],
    machine:
      'On one laptop using: Docker 29.1.3, Node 24.21, Linux under WSL2, Intel Core i7-12700H with 20 logical cores and 15.5 GiB of RAM. The clients, the servers and PostgreSQL were all on the same machine. These results are for that machine and do not represent communication between a phone and a data center.',
    gapsLead: 'Stretch goals went first. Tests and correctness never did.',
    gaps: [
      [
        'Flags that depend on flags',
        'They need a spec change, cycle detection and new vectors in both languages. One more place where Java and TypeScript could disagree.',
      ],
      [
        'Scheduled changes',
        'They need a scheduler that fires exactly once across two instances. That is a design of its own.',
      ],
      [
        'An Oracle adapter',
        'The ports already have contract tests, so the target is clear. The Oracle container in CI is heavy for a shared laptop.',
      ],
      [
        'An SSE fallback',
        'With a second transport next to WebSockets, reconnect and status testing would double as well. The acknowledgement messages for the propagation monitor travel back on the same socket.',
      ],
      [
        'A login for the admin',
        'Admin keys are passed to the browser via a config.json file. This works fine for this demo but is not suitable for a production system which should require login in front of the admin.',
      ],
      [
        'Other browsers',
        'The end-to-end suite and every browser number come from Chrome. Firefox, Safari and screen readers are untested.',
      ],
    ],
    next: 'Start with the Oracle adapter. We already have contract tests that specify its requirements. Next, prerequisites with a cycle check. This will generate a spec change and new vectors in both languages. Finally, scheduled changes with a single runner across instances.',
    gapsAdr: ['ADR 0021: what I did not build', adr('0021-what-is-not-built')],
    stack: [
      'Angular',
      'TypeScript',
      'RxJS',
      'Signals',
      'Angular Material',
      'Java',
      'Quarkus',
      'WebSockets',
      'REST API',
      'Docker',
      'Cypress',
      'Nx monorepo',
      'Hexagonal architecture',
      'DDD',
    ],
  },
};

export default flagtide;
