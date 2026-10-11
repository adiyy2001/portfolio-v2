const repo = 'https://github.com/adiyy2001/coschema';
const adr = file => `${repo}/blob/main/docs/adr/${file}.md`;

const coschema = {
  id: 'coschema',
  name: 'coschema',
  repo,
  demo: 'https://coschema.adrianturbinski.pl/',
  results: `${repo}/tree/main/bench/results`,
  languages: ['TypeScript'],
  video: { width: 820, height: 564 },
  blog: {
    slug: 'how-i-test-that-collaborative-edits-converge',
    title: 'How I test that collaborative edits converge',
  },
  pl: {
    title: 'coschema: wspólny edytor diagramów w Angularze, Adrian Turbiński',
    description:
      'Edytor diagramów do pracy w kilka osób naraz: kursory na żywo, praca offline, cofanie tylko własnych zmian i symulator zbieżności. Demo, kod i liczby z pomiarów.',
    meta: 'Wspólna edycja diagramów',
    lead: 'Edytor diagramów do pracy w kilka osób naraz, z kursorami na żywo, edycją offline, cofaniem tylko własnych zmian i symulatorem sieci, który sprawdza, że każdy klient kończy z tym samym, poprawnym diagramem.',
    clip: 'Dwa edytory obok siebie. Ada przechodzi offline, oboje edytują, łącze wraca i kopie się scalają. Potem kursory na żywo i tryb śledzenia.',
    note: 'Demo otwiera stronę /demo. Pokój działa w twojej przeglądarce, więc nic nie trafia na serwer.',
    why: [
      'Diagramy to moja codzienna praca. Pracuję nad oprogramowaniem, które generuje schematy jednokreskowe stacji elektroenergetycznych wysokiego napięcia: Angular i rysowanie diagramów na froncie, Java i Quarkus za nim. W prawdziwych zespołach kilka osób edytuje ten sam diagram w tym samym czasie.',
      'Chciałem zmierzyć się z trudnymi częściami współpracy: utrzymać poprawny graf, gdy dwie osoby zmieniają go naraz, cofać tylko własne edycje i czysto scalać pracę offline. Edytor da się też obsłużyć klawiaturą i ogłasza czytnikom ekranu zmiany innych osób, bo wspólne płótna rzadko to potrafią.',
    ],
    tryLead:
      'Na stronie demo są dwa edytory, Ada i Bruno, każdy za własnym symulowanym łączem z opóźnieniem, jitterem, utratą pakietów i przełącznikiem offline.',
    features: [
      [
        'Praca offline',
        'Zaznacz „Network offline” u Ady, edytuj po obu stronach i odznacz. Kopie się scalą i skończą identyczne.',
      ],
      [
        'Zła sieć',
        'Podnieś suwakami opóźnienie, jitter albo utratę pakietów jednego edytora albo wybierz Slow, Lossy lub Chaotic dla obu. „Make a mess” odcina łącza, edytuje te same węzły po obu stronach i po chwili przywraca łącza, więc konflikt jest prawdziwy.',
      ],
      [
        'Cofanie tylko swojego',
        'Przesuń węzeł u Ady, zmień jego etykietę u Bruna i cofnij u Ady. Wraca pozycja, etykieta zostaje.',
      ],
      [
        'Kursory i śledzenie',
        'Kliknij odznakę drugiej osoby nad płótnem, żeby śledzić jej widok. Własne przesunięcie widoku kończy śledzenie.',
      ],
      [
        'Klawiatura',
        'Kliknij węzeł, a potem: N i P chodzą po węzłach, strzałki je przesuwają, Enter edytuje etykietę, a znak zapytania pokazuje wszystkie skróty.',
      ],
      ['Eksport', 'Przyciski SVG i PNG na pasku narzędzi zapisują cały diagram.'],
    ],
    calls: [
      {
        name: 'Poprawny graf przy odczycie.',
        text: 'Jedna osoba łączy krawędź z węzłem, a druga w tym samym czasie ten węzeł usuwa. Wspólny dokument może trzymać taki niepoprawny stan, a widok pochodny, który nigdy nic nie zapisuje, go ukrywa. Żaden klient niczego nie naprawia, więc nie ma burzy poprawek.',
        cost: 'Cena: ukryte krawędzie zostają w dokumencie, dopóki węzeł nie wróci albo ktoś ich nie usunie.',
        lost: 'Przegrały naprawy na każdym kliencie (N klientów usuwa tę samą krawędź, a każda naprawa może walczyć z cofaniem) i naprawy tylko na serwerze (serwer staje się drugim autorem dokumentu, a przywrócony węzeł zastałby swoje krawędzie już usunięte).',
        adr: ['ADR 0007', adr('0007-graph-validity-at-read-time')],
      },
      {
        name: 'Cofam tylko swoje.',
        text: 'Każdy klient ma własny menedżer cofania, który śledzi tylko lokalne zmiany, a przeciągnięcie to jeden krok, niezależnie od liczby ruchów wskaźnika. Pozycja i etykieta to osobne klucze, więc cofnięcie mojego przesunięcia nie cofa późniejszej zmiany etykiety kogoś innego.',
        cost: 'Cena: jeśli ktoś przesunął ten sam węzeł po mnie, moje cofnięcie nic nie robi, bo moja zmiana została już nadpisana. Test przypina to zachowanie.',
        lost: 'Przegrały wspólny stos cofania, który cofa cudzą pracę, i ręcznie pisane operacje odwrotne: więcej kodu i błędy przy współbieżności dokładnie w tych przypadkach, które mają testy.',
        adr: ['ADR 0008', adr('0008-per-user-undo')],
      },
      {
        name: 'SVG zamiast canvasa.',
        text: '5000 węzłów w SVG przy 60 klatkach na sekundę: jedna transformacja świata, indeks siatki, który daje stabilne okno widoczności, trzy poziomy szczegółów i przegląd całej sceny poniżej powiększenia 0,25. Benchmark powstał pierwszy, a pierwszy renderer go nie przeszedł przy powiększeniu pokazującym całą scenę, więc renderer się zmienił.',
        cost: 'Cena: elementów poza oknem nie ma w DOM, więc wyszukiwanie na stronie i tryb przeglądania czytnika ekranu ich nie widzą. Model klawiatury działa na danych, nie na DOM, i przewija do węzła z fokusem.',
        lost: 'Przegrały canvas i WebGL, szybsze w dużej skali, ale SVG jest dostępne z natury, z elementami, które przyjmują fokus i ARIA. Przegrało też samo content-visibility, które pomaga w układzie strony, ale nie zmniejsza liczby widoków Angulara.',
        adr: ['ADR 0014', adr('0014-svg-rendering-and-culling')],
      },
    ],
    numbers: [
      [
        '5000',
        'Przebiegów symulatora zbieżności z różnymi ziarnami, 0 nieudanych, w 90,9 s. Symulowana sieć przeniosła 1 756 564 wiadomości, zgubiła 12 715 i zdublowała 6418. Po uzdrowieniu sieci każdy dokument jest porównywany bajt po bajcie.',
      ],
      [
        '18 ms',
        'p95 od puszczenia przycisku u piszącego do zmienionych pikseli u czytającego. Dwa konteksty przeglądarki w jednym pokoju, 200 edycji, magazyn w pamięci. Z PostgreSQL 15 ms. Cel: poniżej 200 ms.',
      ],
      [
        '60 fps',
        'Przesuwanie sceny z 5000 węzłów: mediana i najgorszy z trzech przebiegów na każdym z ośmiu poziomów powiększenia, od 1 do 0,05.',
      ],
      [
        '3987',
        'Operacji na sekundę, które utrzymał jeden proces Node z PostgreSQL, przy p95 dostarczenia 15,77 ms. Przy 8000 oferowanych p95 przekroczyło 200 ms. To liczby dla jednego procesu.',
      ],
      [
        '1012',
        'Testów jednostkowych: 661 w pakietach, serwerze i skryptach i 351 w edytorze. Do tego 40 testów integracyjnych z PostgreSQL i 41 testów Playwright. Pokrycie linii: 98,75% w pakietach i serwerze, 96,85% w edytorze.',
      ],
      [
        '100',
        'Dostępność w Lighthouse na /, /r/test i /demo, w ustawieniach desktop i mobile, bez żadnego nieudanego audytu.',
      ],
    ],
    machine:
      'Zmierzone na laptopie: Intel Core i7-12700H, 20 rdzeni logicznych, 15,5 GiB RAM, Linux pod WSL2, Node 24.21, headless Chromium 153, PostgreSQL 18.6. Przeglądarka działała na localhoście, więc to liczby dla tej maszyny.',
    gapsLead: 'Z listy dodatków zbudowałem tylko eksport SVG i PNG. Testy nigdy nie wypadały.',
    gaps: [
      [
        'Wersje z przywracaniem',
        'Dokument Yjs nie ma powrotu do stanu dla wszystkich, więc przywrócenie byłoby różnicą zastosowaną jako nowe edycje. To najtrudniejsza część.',
      ],
      [
        'Komentarze do węzłów',
        'Druga wspólna struktura, z własnymi regułami poprawności po usunięciu węzła i własnym modelem dostępności.',
      ],
      [
        'Serwis autoryzacji w Quarkusie',
        'Serwer synchronizacji sprawdza JWT kluczem deweloperskim. Osobny serwis w Javie to praca na całe repozytorium i nie mówi nic nowego o współpracy.',
      ],
      [
        'Uchwyty rozmiaru i punktów krawędzi',
        'Model danych i symulator już je obsługują. Edytor nie ma uchwytów, którymi można by je przesunąć.',
      ],
      [
        'Kilka serwerów na pokój',
        'Pokój należy do jednego procesu serwera. Kilka instancji potrzebowałoby kierowania ruchu po pokoju albo warstwy pub/sub.',
      ],
      [
        'Firefox, WebKit i czytnik ekranu',
        'Testy end to end i liczby z przeglądarki pochodzą z Chromium. Nikt jeszcze nie słuchał edytora z NVDA ani VoiceOver.',
      ],
    ],
    next: 'Najpierw warstwa pub/sub, żeby kilka serwerów dzieliło pokoje, potem wersje, potem brakujące uchwyty edycji, a potem testy z NVDA i VoiceOver. W samym edytorze najpierw dodałbym przeciąganie widoczne na żywo: dziś inni widzą skok węzła dopiero, gdy puścisz przycisk.',
    gapsAdr: ['ADR 0025: czego nie zbudowałem', adr('0025-scope-cuts-and-what-is-not-built')],
    stack: [
      'Angular',
      'TypeScript',
      'Signals',
      'Node.js',
      'WebSockets',
      'Docker',
      'GitHub Actions',
      'Obsługa klawiaturą',
      'Zarządzanie fokusem',
    ],
  },
  en: {
    title: 'coschema: a collaborative diagram editor in Angular, Adrian Turbiński',
    description:
      'A real-time collaborative diagram editor: live cursors, offline editing, per-user undo and a convergence simulator. Live demo, code and measured numbers.',
    meta: 'Collaborative diagram editing',
    lead: 'A real-time collaborative diagram editor with offline editing support, per-user undo, live cursors and a network simulator that checks all clients end up with the same, valid diagram.',
    clip: 'Two editors side by side. Ada goes offline, both edit, the link comes back and the copies merge. Then live cursors and follow mode.',
    note: 'The demo opens the /demo page. The room runs inside your browser, so nothing is sent to a server.',
    why: [
      'I work on a diagram editor as part of my day job. My tool creates single-line diagrams for high-voltage electrical substations. The user interface uses Angular and diagram rendering, while the backend is built on Quarkus and Java. In real teams diagrams are often edited simultaneously by multiple users.',
      'I wanted the hard parts of collaboration: keeping a graph valid when two people change it at once, undoing only your own edits, and merging offline work cleanly. The editor is also keyboard operable and announces remote changes to screen readers since collaborative canvases rarely are.',
    ],
    tryLead:
      'The demo page has two editors, Ada and Bruno, each behind its own simulated link with latency, jitter, packet loss and an offline switch.',
    features: [
      [
        'Offline work',
        'Tick Network offline for Ada, edit on both sides and untick it. The copies merge and end up identical.',
      ],
      [
        'A bad network',
        'Use the sliders to raise latency, jitter or packet loss for one editor, or select Slow, Lossy or Chaotic for both. When Make a mess is triggered the links are disabled, the same nodes on both ends are edited then the links are re-enabled, giving actual conflict.',
      ],
      [
        'Undo only your own',
        'Move a node as Ada, change its label as Bruno, then undo as Ada. The position goes back and the label stays.',
      ],
      [
        'Cursors and follow mode',
        'Click the other person’s badge above the canvas to follow their view. Moving your own view stops following.',
      ],
      [
        'Keyboard',
        'Click a node. Using N and P, traverse the nodes. Use the arrow keys to move them. Press Enter to edit the label. Press question mark for a list of all shortcuts.',
      ],
      ['Export', 'The SVG and PNG buttons in the toolbar save the whole diagram.'],
    ],
    calls: [
      {
        name: 'Validity at read time.',
        text: 'One user adds an edge to a node and a second user deletes the node. The shared document is allowed to hold this invalid state and a derived view that never writes hides this. No clients attempt to fix the issue and therefore there is no storming.',
        cost: 'The cost: hidden edges stay in the document until the node comes back or someone deletes them.',
        lost: 'Two potential problems with repair writes: 1) Repair writes on every client - each repair can fight with an undo and N clients all delete the same dangling edge 2) Repair writes only on the server - the server acts as a second author. Restored nodes will find their edges deleted.',
        adr: ['ADR 0007', adr('0007-graph-validity-at-read-time')],
      },
      {
        name: 'Undo means my undo.',
        text: 'Each client has its own undo manager that tracks only local changes. A drag consists of one step but may generate many pointer moves. The label and position keys are stored separately, so undoing my move will not undo a subsequent label change by another user.',
        cost: 'The problem is that if someone moves the same node after me, then my undo of that move will do nothing, since my change will have been superseded. There is a test for that behavior.',
        lost: 'We lost the shared undo stack (undoing other people’s work) and hand-written inverse operations: more code, and wrong under concurrency in exactly the cases the tests cover.',
        adr: ['ADR 0008', adr('0008-per-user-undo')],
      },
      {
        name: 'SVG over canvas.',
        text: '60 fps with 5,000 SVG nodes: one world transform, a grid index providing a stable visible window, three levels of detail and an overview of the entire scene at zoom levels under 0.25. A benchmark was created initially and the first renderer failed on the whole-scene view at the corresponding zoom level, so the renderer was modified.',
        cost: 'The trade-off here is that elements outside of the window are not in the DOM and therefore are not visible during browse mode in screen readers or find-in-page. The keyboard model works from the store, rather than the DOM, and brings the focused node into view.',
        lost: 'What lost? SVG is accessible by construction with focusable elements and ARIA and only content-visibility (layout is assisted, but not a reduction in the number of Angular views). Canvas or WebGL, faster at scale.',
        adr: ['ADR 0014', adr('0014-svg-rendering-and-culling')],
      },
    ],
    numbers: [
      [
        '5,000',
        'Convergence simulator seeds: 0 failed, 90.9 s. 1,756,564 messages carried by the simulated network, 12,715 lost, 6,418 duplicated. Once the network recovers, all documents are byte-exact compared.',
      ],
      [
        '18 ms',
        "p95 from the writer's pointer release to pixel change in reader. Two browser contexts in the same room. 200 edits. Memory store. 15 ms using PostgreSQL. Aim < 200 ms.",
      ],
      [
        '60 fps',
        'Panning a scene of 5,000 nodes: worst and median of three runs at 8 levels of zoom, from 1 to 0.05.',
      ],
      [
        '3,987',
        'Sustained Node operations per second using PostgreSQL in a single process with a 15.77 ms p95 delivery. At 8,000 offered the p95 passed 200 ms. This is for one process.',
      ],
      [
        '1,012',
        'Unit tests: 661 in packages, server and scripts, 351 in the editor. 40 integration tests against PostgreSQL, and 41 Playwright tests. Line coverage: 98.75% in packages and server, 96.85% in the editor.',
      ],
      [
        '100',
        'Lighthouse accessibility on /, /r/test and /demo, on the desktop and the mobile setting, with no failed audit.',
      ],
    ],
    machine:
      'On my laptop: Intel Core i7-12700H, 20 logical cores, 15.5 GiB of RAM, PostgreSQL 18.6, Node 24.21, headless Chromium 153, running Linux under WSL2. Test was run with browser running on localhost, so these are numbers for this machine.',
    gapsLead:
      'From the stretch list I built only SVG and PNG export. Tests were never what got cut.',
    gaps: [
      [
        'Versions with restore',
        'There is no ‘go back to this state’ for all in a Yjs document. So a restore would be a diff that would be applied as new edits. This is the difficult part.',
      ],
      [
        'Comments on nodes',
        'A second shared structure, with its own validity rules when the node is deleted and its own accessibility story.',
      ],
      [
        'A Quarkus auth service',
        "The sync server uses a dev key to validate the JWT. A Java service that would issue the tokens would be a separate repository's worth of work. It does not add anything new to collaboration.",
      ],
      [
        'Resize and waypoint handles',
        'The data model and the simulator already cover both. The editor has no handles to drive them.',
      ],
      [
        'Several servers per room',
        'One server process owns a room. Several instances would need sticky routing by room or a pub/sub layer between them.',
      ],
      [
        'Firefox, WebKit and a screen reader',
        'The end-to-end suite and every browser number come from Chromium. Nobody has listened to the editor with NVDA or VoiceOver yet.',
      ],
    ],
    next: 'Pub/sub for multiple servers to share rooms, version snapshots, missing editing handles, and then tests with NVDA and VoiceOver. Within the editor proper, live dragging would be my first feature addition - currently other people see a node jump when you let go, but not while you drag.',
    gapsAdr: ['ADR 0025: what I did not build', adr('0025-scope-cuts-and-what-is-not-built')],
    stack: [
      'Angular',
      'TypeScript',
      'Signals',
      'Node.js',
      'WebSockets',
      'Docker',
      'GitHub Actions',
      'Keyboard support',
      'Focus management',
    ],
  },
};

export default coschema;
