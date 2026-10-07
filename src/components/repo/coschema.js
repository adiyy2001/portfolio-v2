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
    lead: 'A real-time collaborative diagram editor with live cursors, offline editing, per-user undo and a network simulator that checks every client ends up with the same, valid diagram.',
    clip: 'Two editors side by side. Ada goes offline, both edit, the link comes back and the copies merge. Then live cursors and follow mode.',
    note: 'The demo opens the /demo page. The room runs inside your browser, so nothing is sent to a server.',
    why: [
      'Diagram editors are my day job. I work on software that generates single-line diagrams of high-voltage electrical substations, with Angular and diagram rendering on the front end and Java and Quarkus behind it. In real teams several people edit the same diagram at the same time.',
      'I wanted the hard parts of collaboration: keeping a graph valid when two people change it at once, undoing only your own edits, and merging offline work cleanly. The editor is also keyboard operable and announces remote changes to screen readers, because collaborative canvases rarely are.',
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
        'Raise one editor’s latency, jitter or packet loss with the sliders, or pick Slow, Lossy or Chaotic for both. Make a mess takes the links down, edits the same nodes on both sides and brings the links back, so the conflict is real.',
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
        'Click a node, then N and P walk through the nodes, the arrow keys move them, Enter edits the label and the question mark lists every shortcut.',
      ],
      ['Export', 'The SVG and PNG buttons in the toolbar save the whole diagram.'],
    ],
    calls: [
      {
        name: 'Validity at read time.',
        text: 'One person connects an edge to a node while another deletes that node. The shared document is allowed to hold that invalid state, and a derived view that never writes hides it. No client repairs anything, so nothing storms.',
        cost: 'The cost: hidden edges stay in the document until the node comes back or someone deletes them.',
        lost: 'What lost: repair writes on every client (N clients delete the same dangling edge, and each repair can fight with an undo) and repair writes on the server only (the server becomes a second author, and a restored node would find its edges already gone).',
        adr: ['ADR 0007', adr('0007-graph-validity-at-read-time')],
      },
      {
        name: 'Undo means my undo.',
        text: 'Each client has its own undo manager that tracks only local changes, and a drag is one step however many pointer moves it produced. Position and label are separate keys, so undoing my move does not revert someone’s later label edit.',
        cost: 'The cost: if someone moved the same node after me, my undo of the move does nothing, because my change was already superseded. A test pins that behaviour.',
        lost: 'What lost: a shared undo stack, which undoes other people’s work, and hand-written inverse operations: more code, and wrong under concurrency in exactly the cases the tests cover.',
        adr: ['ADR 0008', adr('0008-per-user-undo')],
      },
      {
        name: 'SVG over canvas.',
        text: '5,000 nodes in SVG at 60 fps: one world transform, a grid index that gives a stable visible window, three levels of detail and a whole-scene overview below zoom 0.25. The benchmark was written first, and the first renderer failed it at the zoom that shows the whole scene, so the renderer changed.',
        cost: 'The cost: elements outside the window are not in the DOM, so find-in-page and screen reader browse mode do not see them. The keyboard model works from the store, not the DOM, and brings the focused node into view.',
        lost: 'What lost: canvas or WebGL, faster at scale, while SVG is accessible by construction with focusable elements and ARIA, and content-visibility alone, which helps layout but does not cut the number of Angular views.',
        adr: ['ADR 0014', adr('0014-svg-rendering-and-culling')],
      },
    ],
    numbers: [
      [
        '5,000',
        'Seeds of the convergence simulator, 0 failed, in 90.9 s. The simulated network carried 1,756,564 messages, lost 12,715 and duplicated 6,418. After the network heals, every document is compared byte for byte.',
      ],
      [
        '18 ms',
        'p95 from the writer’s pointer release to the changed pixels in the reader. Two browser contexts in one room, 200 edits, memory store. 15 ms with PostgreSQL. Target: under 200 ms.',
      ],
      [
        '60 fps',
        'Panning a scene of 5,000 nodes: the median and the worst of three runs at each of eight zoom levels, from 1 down to 0.05.',
      ],
      [
        '3,987',
        'Operations per second that one Node process with PostgreSQL sustained, with a delivery p95 of 15.77 ms. At 8,000 offered, the p95 passed 200 ms. These numbers describe one process.',
      ],
      [
        '1,012',
        'Unit tests: 661 in the packages, the server and the scripts, and 351 in the editor. Plus 40 integration tests against PostgreSQL and 41 Playwright tests. Line coverage: 98.75% in the packages and the server, 96.85% in the editor.',
      ],
      [
        '100',
        'Lighthouse accessibility on /, /r/test and /demo, on the desktop and the mobile setting, with no failed audit.',
      ],
    ],
    machine:
      'Measured on a laptop: Intel Core i7-12700H, 20 logical cores, 15.5 GiB RAM, Linux under WSL2, Node 24.21, headless Chromium 153, PostgreSQL 18.6. The browser ran on localhost, so these are numbers for this machine.',
    gapsLead:
      'From the stretch list I built only SVG and PNG export. Tests were never what got cut.',
    gaps: [
      [
        'Versions with restore',
        'A Yjs document has no “go back to this state” for everyone, so a restore would be a diff applied as new edits. That is the hard part.',
      ],
      [
        'Comments on nodes',
        'A second shared structure, with its own validity rules when the node is deleted and its own accessibility story.',
      ],
      [
        'A Quarkus auth service',
        'The sync server checks the JWT with a dev key. A Java service issuing tokens would be a separate repository’s worth of work and says nothing new about collaboration.',
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
    next: 'First a pub/sub layer so several servers can share rooms, then version snapshots, then the missing editing handles, then tests with NVDA and VoiceOver. In the editor itself, the first thing I would add is live dragging: today other people see a node jump when you let go, not while you drag.',
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
