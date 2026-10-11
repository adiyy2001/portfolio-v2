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
      'Digital twin for a small transmission network. Single-line diagram. 3D view of the substation. AC power flow. N-1 study. Cascade study. Live demonstration with code and measured numbers.',
    meta: 'A digital twin of a transmission network',
    lead: 'Interactive 3D substation in the browser with small transmission network digital twin. Open a circuit breaker on the single-line diagram or 3D substation and see an AC power flow redistribute the load, overload a line and, if you keep going, cascade into an outage.',
    model:
      'Implementation of an educational model for the public IEEE 14-bus and IEEE 30-bus test cases which models a substation (replacing bus 4) as made up. Nothing here describes a real grid.',
    clip: 'Opening the bus coupler, the overloaded line, the N-1 table and a cascade replay.',
    note: 'My home server currently has the demo running in a single container. It uses in-memory sessions and restarts once an hour. Whatever you switched will be lost upon restart.',
    why: [
      'I work on software that renders single-line diagrams for high-voltage substations in the browser using Angular and diagram rendering. The underpinning technology is Quarkus on Java 21. I have developed the other half of this to model the electrical behaviour of these diagrams. Given an open breaker the solver can indicate which lines overload, how an outage spreads and where power goes.',
      "I've also combined my domain knowledge, numerical methods (a sparse Newton-Raphson solver checked against MATPOWER), a Java back end and a 3D front end into a single project.",
    ],
    tryLead: 'Every visitor gets a twin of their own, so nobody opens a breaker under your hands.',
    features: [
      [
        'Bus coupler',
        'Open the bus coupler in the single-line diagram. Arrow keys move between equipment, and Enter or Space asks to operate a switch.',
      ],
      [
        'Overloaded line',
        'Click on the line that turns red. The line state (loading, active power, reactive power, current and losses) is displayed by the inspector and also in the 3D substation.',
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
        text: 'The solver has to agree with MATPOWER to 1e-6 pu in voltage and 1e-4 degrees in angle. However, small modelling differences already break that. For example, where the tap sits on a transformer, whether reactive limits convert all violating generators at once, whether the slack generator is limited. I documented each of these conventions in an ADR and adopted MATPOWER’s. I created 4 N-1 reference files and 16 base case reference solutions using MATPOWER under GNU Octave in Docker.',
        cost: 'The cost: reactive limits do not release again. A generator that hit its limit at 150% load stays a PQ bus for that solve.',
        lost: 'Lost were a rectangular formulation (due to the solver being specified in polar form) and a distributed slack placed closer to operational practice and away from the reference data.',
        adr: ['ADR 0004', adr('0004-newton-raphson-modelling-choices')],
      },
      {
        name: 'N-1 on a fork-join pool.',
        text: 'N-1 on IEEE 30 involves about 47 independent solves with no I/O, pure CPU computation. These are executed on a dedicated ForkJoinPool with one worker per core. Each task has its own solver with no data shared across other tasks except for read-only access. A property test verifies that the parallel execution produces the same result as sequential execution.',
        cost: 'The cost: the application layer owns the pool’s lifecycle, from startup to shutdown.',
        lost: 'Lost: virtual threads. A computing thread keeps its carrier busy like a platform thread and provides no additional throughput. Also parallelStream on the common pool, because a long N-1 run can starve the rest of the Quarkus process.',
        adr: ['ADR 0009', adr('0009-contingencies-on-a-fork-join-pool')],
      },
      {
        name: 'One twin per session.',
        text: 'Every visitor gets a session of their own. A REST command is issued, the interlocks are run first, the network is solved once and the version incremented. The full state is sent over a WebSocket. Clients will ignore messages where the version is the same as or less than the current version they already have.',
        cost: 'The cost: the server holds the state of every open session, up to a cap, and a restart drops them all.',
        lost: "What was lost: one shared twin (one visitor would open a breaker under another's hands and parallel end-to-end tests would interfere), and pushing diffs, since the state of these networks is a few kilobytes and a full snapshot allows reconnecting clients to avoid replay logic entirely.",
        adr: ['ADR 0010', adr('0010-one-twin-per-session-and-full-state-push')],
      },
    ],
    numbers: [
      [
        '8.23e-9 pu',
        'Among all scenarios tested, the worst deviation in voltage magnitude compared to MATPOWER 8.1 results from IEEE 14 and IEEE 30 systems at load factors 0.5, 1.0, 1.2 and 1.5 with and without reactive limits and all N-1 outages solved by MATPOWER. For the experiments the limit is 1e-6 pu.',
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
        'Median time from the confirm click to the rendered frame (including 3D scene and server round trip) on the integrated Iris Xe GPU running on Windows. Goal: below 100 ms.',
      ],
      [
        '165 fps',
        'The 3D scene under Windows on Iris Xe at 1080p with none of the 4,951 frames dropped at the panel refresh rate. The same GPU via WSL2 Direct3D 12 renders 46-52 fps so the 60 fps target is not achieved here.',
      ],
      [
        '99.0%',
        'Line coverage of the domain module, 97.5% overall. Plus 21 Cypress tests against the production jar and axe on six scenarios.',
      ],
    ],
    machine:
      'On laptop: Intel Core i7-12700H, 20 logical cores, 15 GB of memory. Linux 6.6 with WSL2. OpenJDK 21.0.12. Headless Chromium 148. GPU runs were repeated natively on Windows 11 using Chrome 154 on Iris Xe in the same laptop. There were other builds running concurrently which leads to some noise in the tails of the timing data.',
    gapsLead: 'When the scope grew, stretch goals were cut. Tests and correctness never were.',
    gaps: [
      [
        'IEEE 30 in the app',
        'IEEE 30 is solved, validated and benchmarked but lacks a substation and no UI entry. Therefore only IEEE 14 is offered in the demo.',
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
        'A branch is tripped as soon as it exceeds 120% of its rating with no protection timing. A cascade will indicate the possible sequence of overload propagations but will predict nothing about a real grid.',
      ],
      [
        'Keyboard in the 3D scene',
        'Equipment cannot be operated by keyboard inside the 3D canvas. Everything works in the diagram and the inspector.',
      ],
    ],
    next: 'First, a second substation for IEEE 30 with a network selector. Then the fast decoupled solver will be demonstrated with a comparison of speed and accuracy. Finally state estimation using noisy measurements will be shown.',
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
