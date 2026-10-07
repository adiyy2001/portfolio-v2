const repo = 'https://github.com/adiyy2001/gridtwin';
const adr = file => `${repo}/blob/main/docs/adr/${file}.md`;

const gridtwin = {
  id: 'gridtwin',
  name: 'gridtwin',
  repo,
  demo: 'https://gridtwin.adrianturbinski.pl/',
  results: `${repo}/tree/main/bench/results`,
  languages: ['Java', 'TypeScript'],
  video: { width: 900, height: 563 },
  pl: {
    title: 'gridtwin: cyfrowy bliźniak sieci w Angularze i Javie, Adrian Turbiński',
    description:
      'Cyfrowy bliźniak małej sieci przesyłowej: schemat jednokreskowy, stacja 3D, rozpływ mocy AC, N-1 i kaskada. Demo na żywo, kod i liczby z pomiarów.',
    meta: 'Cyfrowy bliźniak sieci przesyłowej',
    lead: 'Cyfrowy bliźniak małej sieci przesyłowej w przeglądarce: otwierasz wyłącznik w stacji 3D albo na schemacie jednokreskowym i patrzysz, jak rozpływ mocy AC rozkłada obciążenie na nowo, przeciąża linię, a jeśli pójdziesz dalej, kończy się kaskadową awarią.',
    model:
      'To model edukacyjny na publicznych sieciach testowych IEEE 14 i IEEE 30. Stacja w miejscu szyny 4 jest zmyślona i nic tu nie opisuje prawdziwej sieci.',
    clip: 'Otwarcie sprzęgła szyn, przeciążona linia, tabela N-1 i odtworzenie kaskady.',
    note: 'Demo działa w jednym kontenerze na moim domowym serwerze. Sesje żyją w pamięci, a kontener restartuje się co godzinę, więc twoje przełączenia potem znikają.',
    why: [
      'W pracy tworzę oprogramowanie, które rysuje schematy jednokreskowe stacji wysokiego napięcia: Angular i rysowanie diagramów w przeglądarce, a za nimi Java 21 i Quarkus. Chciałem zamodelować, co te rysunki znaczą elektrycznie, więc zbudowałem drugą połowę. Otwierasz wyłącznik, a solver mówi, dokąd płynie moc, która linia się przeciąża i jak rozchodzi się awaria.',
      'Projekt łączy w jednym miejscu wiedzę domenową, metody numeryczne (rzadki solver Newtona-Raphsona sprawdzony z MATPOWER), back-end w Javie i front-end 3D.',
    ],
    tryLead:
      'Każdy odwiedzający dostaje własnego bliźniaka, więc nikt nie przełącza ci wyłączników pod ręką.',
    features: [
      [
        'Sprzęgło szyn',
        'Na schemacie jednokreskowym otwórz sprzęgło szyn. Strzałki przechodzą między aparatami, a Enter albo spacja pyta o przełączenie.',
      ],
      [
        'Przeciążona linia',
        'Zaznacz linię, która zrobi się czerwona. Inspektor pokaże obciążenie, moc czynną i bierną, prąd i straty, a stacja 3D ten sam stan.',
      ],
      [
        'Obciążenie systemu',
        'Przesuń suwak od 50 do 150 procent. Wszystkie odbiory skalują się razem, a zmianę bierze na siebie węzeł bilansujący.',
      ],
      [
        'N-1',
        'Uruchom N-1 i kliknij wiersz tabeli. Zobaczysz podgląd tej awarii bez ponownego liczenia sieci.',
      ],
      [
        'Kaskada',
        'Uruchom kaskadę od wyłączenia linii L2-\u20604 i przeciągnij suwak, żeby przejść ją krok po kroku.',
      ],
      [
        'Blokady',
        'Spróbuj zamknąć uziemnik na odcinku pod napięciem. Blokada odmówi i powie dlaczego.',
      ],
    ],
    calls: [
      {
        name: 'Zgodność z MATPOWER.',
        text: 'Solver ma się zgadzać z MATPOWER do 1e-6 pu w napięciu i 1e-4 stopnia w kącie, a drobne różnice w modelu już to psują: gdzie siedzi zaczep transformatora, czy limity mocy biernej przełączają wszystkie generatory naraz, czy generator bilansujący ma limity. Każdą konwencję spisałem w ADR i przyjąłem tę z MATPOWER, a 16 rozwiązań referencyjnych i 4 pliki N-1 wygenerowałem w MATPOWER pod GNU Octave w Dockerze.',
        cost: 'Cena: limity mocy biernej nie zwalniają się z powrotem. Generator, który trafił w limit przy 150 procentach obciążenia, zostaje w tym rozwiązaniu węzłem PQ.',
        lost: 'Przegrały rozproszony węzeł bilansujący, bliższy praktyce ruchowej, ale dalszy od danych referencyjnych, i postać prostokątna, bo solver jest opisany w postaci biegunowej.',
        adr: ['ADR 0004', adr('0004-newton-raphson-modelling-choices')],
      },
      {
        name: 'N-1 na puli fork-join.',
        text: 'N-1 dla IEEE 30 to około 47 niezależnych rozwiązań, sama praca procesora bez I/O. Liczą się na osobnej puli ForkJoinPool z równoległością równą liczbie rdzeni. Każde zadanie ma własny solver i dzieli z innymi tylko dane do odczytu, a test własności sprawdza, że wynik równoległy jest równy sekwencyjnemu.',
        cost: 'Cena: warstwa aplikacji zarządza cyklem życia puli, od startu do zamknięcia.',
        lost: 'Przegrały wątki wirtualne, bo wątek, który liczy, zajmuje swój wątek nośny tak samo jak zwykły i nie daje więcej przepustowości, oraz parallelStream na wspólnej puli, bo długie N-1 mogłoby zagłodzić resztę procesu Quarkusa.',
        adr: ['ADR 0009', adr('0009-contingencies-on-a-fork-join-pool')],
      },
      {
        name: 'Jeden bliźniak na sesję.',
        text: 'Każdy odwiedzający dostaje własną sesję. Polecenie przychodzi przez REST, najpierw przechodzi przez blokady, potem sieć liczy się raz, wersja rośnie, a WebSocket wysyła pełny stan. Klient ignoruje wiadomość z wersją, którą już pokazuje albo starszą.',
        cost: 'Cena: serwer trzyma stan każdej otwartej sesji, z limitem ich liczby, a restart kasuje wszystkie.',
        lost: 'Przegrały jeden wspólny bliźniak, bo jeden gość otwierałby wyłącznik pod ręką drugiego, a równoległe testy end to end by sobie przeszkadzały, i wysyłanie różnic, bo stan tych sieci to kilka kilobajtów, a pełna migawka oznacza, że klient po ponownym połączeniu nie musi niczego odtwarzać.',
        adr: ['ADR 0010', adr('0010-one-twin-per-session-and-full-state-push')],
      },
    ],
    numbers: [
      [
        '8,23e-9 pu',
        'Największe odchylenie modułu napięcia od MATPOWER 8.1 we wszystkich porównaniach: IEEE 14 i IEEE 30 przy obciążeniu 0,5, 1,0, 1,2 i 1,5, z limitami mocy biernej i bez nich, plus każde wyłączenie N-1, które MATPOWER rozwiązuje. Limit w testach: 1e-6 pu.',
      ],
      [
        '0,67 ms',
        'Mediana rozwiązania IEEE 30 od płaskiego startu, po 300 iteracjach rozgrzewki i z 300 pomiarów. Cel: poniżej 10 ms.',
      ],
      [
        '8,22 ms',
        'Mediana pełnego N-1 dla IEEE 30, 47 wyłączeń na 20 wątkach. Sekwencyjnie 41,3 ms. Cel: poniżej 500 ms.',
      ],
      [
        '25,5 ms',
        'Mediana od kliknięcia potwierdzenia do wyrenderowanej klatki, z rundą do serwera i sceną 3D, na zintegrowanym GPU Iris Xe pod Windows. Cel: poniżej 100 ms.',
      ],
      [
        '165 fps',
        'Scena 3D w 1080p na Iris Xe pod Windows, czyli odświeżanie panelu, bez żadnej opuszczonej z 4951 klatek. Przez warstwę Direct3D 12 w WSL2 ten sam GPU daje 46 do 52 fps, więc tam cel 60 fps nie jest spełniony.',
      ],
      [
        '99,0%',
        'Pokrycie linii w module domeny, 97,5% w całości. Do tego 21 testów Cypress na produkcyjnym jarze i axe na sześciu scenariuszach.',
      ],
    ],
    machine:
      'Zmierzone na laptopie: Intel Core i7-12700H, 20 rdzeni logicznych, 15 GB pamięci, Linux 6.6 pod WSL2, OpenJDK 21.0.12, headless Chromium 148. Pomiary GPU powtórzyłem natywnie na Windows 11 na tym samym laptopie, z Chrome 154 na Iris Xe. Na maszynie szły w tym czasie inne buildy, więc końcówki rozkładów czasów są zaszumione.',
    gapsLead: 'Gdy zakres rósł, wypadały cele dodatkowe. Testy i poprawność nie wypadły nigdy.',
    gaps: [
      [
        'IEEE 30 w aplikacji',
        'IEEE 30 jest rozwiązany, sprawdzony i zmierzony, ale nie ma stacji ani pozycji w interfejsie, więc demo pokazuje tylko IEEE 14.',
      ],
      [
        'Szybki rozpływ rozprzężony',
        'Byłby drugim solverem do walidacji, a obecny jest dla IEEE 30 wystarczająco szybki.',
      ],
      [
        'Estymacja stanu',
        'Ważone najmniejsze kwadraty nie powstały. Czas poszedł na walidację z MATPOWER, blokady, wyspy i obsługę schematu klawiaturą.',
      ],
      [
        'Dynamika',
        'To model ustalony i symetryczny: bez dynamiki, bez obliczeń zwarciowych i bez kontroli synchronizmu przy łączeniu dwóch żywych wysp.',
      ],
      [
        'Prawdziwa kaskada',
        'Gałąź wyłącza się w chwili przekroczenia 120 procent obciążalności, bez czasów zabezpieczeń. Kaskada pokazuje kolejność, w jakiej mogą rozchodzić się przeciążenia, i niczego nie przewiduje dla prawdziwej sieci.',
      ],
      [
        'Klawiatura w scenie 3D',
        'W płótnie 3D aparatów nie przełączysz klawiaturą. Wszystko działa na schemacie i w inspektorze.',
      ],
    ],
    next: 'Najpierw druga stacja dla IEEE 30 z wyborem sieci, potem szybki solver rozprzężony z porównaniem dokładności i szybkości, a na końcu estymacja stanu z zaszumionych pomiarów.',
    gapsAdr: ['ADR 0027: cele, których nie zbudowałem', adr('0027-stretch-goals-not-built')],
    stack: [
      'Angular',
      'TypeScript',
      'RxJS',
      'SignalStore',
      'Three.js',
      'WebGL',
      'Java',
      'Quarkus',
      'REST API',
      'WebSockets',
      'Docker',
      'Cypress',
      'GitHub Actions',
      'Architektura heksagonalna',
    ],
  },
  en: {
    title: 'gridtwin: a grid digital twin in Angular and Java, Adrian Turbiński',
    description:
      'A digital twin of a small transmission network: a single-line diagram, a 3D substation, an AC power flow, N-1 and a cascade. Live demo, code and measured numbers.',
    meta: 'A digital twin of a transmission network',
    lead: 'A digital twin of a small transmission network in the browser: open a breaker in a 3D substation or its single-line diagram and watch an AC power flow redistribute the load, overload a line and, if you keep going, cascade into an outage.',
    model:
      'It is an educational model on the public IEEE 14-bus and IEEE 30-bus test cases. The substation that replaces bus 4 is made up, and nothing here describes a real grid.',
    clip: 'Opening the bus coupler, the overloaded line, the N-1 table and a cascade replay.',
    note: 'The demo runs in one container on my home server. Sessions live in memory and the container restarts every hour, so whatever you switched is gone after that.',
    why: [
      'My day job is software that draws single-line diagrams of high-voltage substations: Angular and diagram rendering in the browser, Java 21 and Quarkus behind it. I wanted to model what those drawings mean electrically, so I built the other half. Open a breaker and the solver tells you where the power goes, which line overloads and how an outage spreads.',
      'The project also puts my domain knowledge, numerical methods (a sparse Newton-Raphson solver checked against MATPOWER), a Java back end and a 3D front end in one place.',
    ],
    tryLead: 'Every visitor gets a twin of their own, so nobody opens a breaker under your hands.',
    features: [
      [
        'Bus coupler',
        'Open the bus coupler in the single-line diagram. Arrow keys move between equipment, and Enter or Space asks to operate a switch.',
      ],
      [
        'Overloaded line',
        'Select the line that turns red. The inspector shows its loading, active and reactive power, current and losses, and the 3D substation shows the same state.',
      ],
      [
        'System load',
        'Drag the slider from 50 to 150 percent. All loads scale together and the slack absorbs the change.',
      ],
      [
        'N-1',
        'Run N-1 and click a row of the table to preview that outage, without solving the network again.',
      ],
      [
        'Cascade',
        'Run the cascade from the outage of line L2-\u20604 and drag the scrubber to step through it.',
      ],
      [
        'Interlocks',
        'Try to close an earthing switch on a live section. The interlock refuses and says why.',
      ],
    ],
    calls: [
      {
        name: 'Agreeing with MATPOWER.',
        text: 'The solver has to agree with MATPOWER to 1e-6 pu in voltage and 1e-4 degrees in angle, and small modelling differences already break that: where the tap sits on a transformer, whether reactive limits convert all violating generators at once, whether the slack generator is limited. I wrote down each convention in an ADR and took MATPOWER’s, and I generated 16 base case reference solutions and 4 N-1 reference files with MATPOWER under GNU Octave in Docker.',
        cost: 'The cost: reactive limits do not release again. A generator that hit its limit at 150% load stays a PQ bus for that solve.',
        lost: 'What lost: a distributed slack, closer to operation practice and further from the reference data, and a rectangular formulation, because the solver is specified in polar form.',
        adr: ['ADR 0004', adr('0004-newton-raphson-modelling-choices')],
      },
      {
        name: 'N-1 on a fork-join pool.',
        text: 'N-1 on IEEE 30 is about 47 independent solves, pure CPU work with no I/O. They run on a dedicated ForkJoinPool with one worker per core. Each task has its own solver and shares nothing but read-only data, and a property test checks that the parallel result equals the sequential one.',
        cost: 'The cost: the application layer owns the pool’s lifecycle, from startup to shutdown.',
        lost: 'What lost: virtual threads, because a thread that computes keeps its carrier as busy as a platform thread and adds no throughput, and parallelStream on the common pool, because a long N-1 run could starve the rest of the Quarkus process.',
        adr: ['ADR 0009', adr('0009-contingencies-on-a-fork-join-pool')],
      },
      {
        name: 'One twin per session.',
        text: 'Every visitor gets a session of their own. A command arrives over REST, the interlocks run first, the network is solved once, the version goes up and a WebSocket pushes the full state. A client ignores a message with a version at or below the one it already shows.',
        cost: 'The cost: the server holds the state of every open session, up to a cap, and a restart drops them all.',
        lost: 'What lost: one shared twin, because one visitor would open a breaker under another’s hands and parallel end-to-end tests would interfere, and pushing diffs, because the state of these networks is a few kilobytes and a full snapshot means a reconnecting client needs no replay logic.',
        adr: ['ADR 0010', adr('0010-one-twin-per-session-and-full-state-push')],
      },
    ],
    numbers: [
      [
        '8.23e-9 pu',
        'The worst voltage magnitude deviation from MATPOWER 8.1 over everything compared: IEEE 14 and IEEE 30 at load factors 0.5, 1.0, 1.2 and 1.5, with and without reactive limits, plus every N-1 outage that MATPOWER solves. The limit in the tests: 1e-6 pu.',
      ],
      [
        '0.67 ms',
        'Median IEEE 30 solve from a flat start, after 300 warm-up iterations and over 300 measured ones. Target: under 10 ms.',
      ],
      [
        '8.22 ms',
        'Median full N-1 on IEEE 30, 47 outages on 20 threads. 41.3 ms sequentially. Target: under 500 ms.',
      ],
      [
        '25.5 ms',
        'Median from the confirm click to the rendered frame, server round trip and 3D scene included, on the integrated Iris Xe GPU under Windows. Target: under 100 ms.',
      ],
      [
        '165 fps',
        'The 3D scene at 1080p on the Iris Xe under Windows, which is the refresh rate of the panel, with none of the 4,951 frames dropped. Through the WSL2 Direct3D 12 layer the same GPU gives 46 to 52 fps, so the 60 fps target is not met there.',
      ],
      [
        '99.0%',
        'Line coverage of the domain module, 97.5% overall. Plus 21 Cypress tests against the production jar and axe on six scenarios.',
      ],
    ],
    machine:
      'Measured on a laptop: Intel Core i7-12700H, 20 logical cores, 15 GB of memory, Linux 6.6 under WSL2, OpenJDK 21.0.12, headless Chromium 148. I repeated the GPU runs natively on Windows 11 on the same laptop, with Chrome 154 on the Iris Xe. Other builds were running at the same time, so the tails of the timings are noisy.',
    gapsLead: 'When the scope grew, stretch goals were cut. Tests and correctness never were.',
    gaps: [
      [
        'IEEE 30 in the app',
        'IEEE 30 is solved, validated and benchmarked, but it has no substation and no entry in the UI, so the demo offers IEEE 14 only.',
      ],
      [
        'A fast decoupled power flow',
        'It would be a second solver to validate, and the current one is already fast enough for IEEE 30.',
      ],
      [
        'State estimation',
        'Weighted least squares is not built. The time went to the validation against MATPOWER, the interlocks, the islands and keyboard operation of the diagram.',
      ],
      [
        'Dynamics',
        'It is a steady-state, balanced model: no dynamics, no short-circuit calculations and no synchronism check when two live islands are joined.',
      ],
      [
        'A real cascade',
        'A branch trips the instant it passes 120% of its rating, with no protection timing. The cascade shows an order in which overloads could spread and predicts nothing about a real grid.',
      ],
      [
        'Keyboard in the 3D scene',
        'Equipment cannot be operated by keyboard inside the 3D canvas. Everything works in the diagram and the inspector.',
      ],
    ],
    next: 'First a second substation for IEEE 30 with a network selector, then the fast decoupled solver with an accuracy and speed comparison, and then state estimation from noisy measurements.',
    gapsAdr: ['ADR 0027: the stretch goals I did not build', adr('0027-stretch-goals-not-built')],
    stack: [
      'Angular',
      'TypeScript',
      'RxJS',
      'SignalStore',
      'Three.js',
      'WebGL',
      'Java',
      'Quarkus',
      'REST API',
      'WebSockets',
      'Docker',
      'Cypress',
      'GitHub Actions',
      'Hexagonal architecture',
    ],
  },
};

export default gridtwin;
