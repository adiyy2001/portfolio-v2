const repo = 'https://github.com/adiyy2001/signal-timeline';
const adr = file => `${repo}/blob/main/docs/adr/${file}.md`;

const signalTimeline = {
  id: 'signal-timeline',
  name: 'signal-timeline',
  repo,
  demo: 'https://signal-timeline.adrianturbinski.pl/',
  results: `${repo}/tree/main/bench/results`,
  packages: [{ name: 'signal-timeline', href: 'https://www.npmjs.com/package/signal-timeline' }],
  languages: ['TypeScript'],
  video: { width: 960, height: 540 },
  pl: {
    title: 'signal-timeline: cofanie i gałęzie historii dla NgRx SignalStore, Adrian Turbiński',
    description:
      'Biblioteka dla Angulara: cofanie, transakcje, drzewo gałęzi historii i podróż w czasie dla NgRx SignalStore. Demo na żywo, kod, npm i liczby z pomiarów.',
    meta: 'Cofanie i historia dla SignalStore',
    lead: 'Cofanie i ponawianie, transakcje, drzewo gałęzi historii, wspólna historia kilku store’ów i panel podróży w czasie dla NgRx SignalStore. Historia jest zapisana jako łatki, więc pamięć zostaje mała także przy dużym stanie.',
    clip: 'Rysowanie kształtów w edytorze demo, cofanie, rozgałęzianie historii, skoki między gałęziami i przesuwanie osi czasu.',
    note: 'Interfejs demo jest po angielsku.',
    why: [
      'Na co dzień pracuję z Angularem opartym na sygnałach, a edytory diagramów, które buduję w pracy, potrzebują cofania, które nie gubi żadnego kroku. SignalStore ma już liniowe cofanie (withUndoRedo w @ngrx-toolkit/core) i w wielu aplikacjach to wystarcza. Edytor chce więcej. Zmiana po cofnięciu nie powinna niszczyć historii ponawiania, gest dotykający dwóch store’ów powinien cofać się jako jeden krok, a poruszanie się po historii nie powinno znowu zapisywać dokumentu na serwerze.',
      'Ta biblioteka zaczyna więc tam, gdzie liniowe cofanie się kończy: drzewo gałęzi, transakcje, historia obejmująca kilka store’ów i podróż w czasie, która zostawia efekty uboczne w spokoju. Wszystko jest napisane od zera, a demo to mały edytor SVG zrobiony na potrzeby tego projektu.',
    ],
    tryLead:
      'Demo to edytor wektorowy z panelem historii obok: drzewem wpisów, osią czasu i tabelą różnic.',
    features: [
      [
        'Cofanie i ponawianie',
        'Narysuj kilka kształtów i użyj Ctrl+Z oraz Ctrl+Shift+Z albo przycisków Undo i Redo. Przeciągnięcie kształtu to jeden krok.',
      ],
      [
        'Gałąź zamiast utraty historii',
        'Cofnij kilka kroków i narysuj coś nowego. Stara przyszłość nie znika: w drzewie historii pojawia się obok niej nowa gałąź.',
      ],
      [
        'Skok i oś czasu',
        'W panelu historii kliknij dowolny wpis w drzewie albo przesuń suwak osi czasu, żeby przeskoczyć do tego stanu.',
      ],
      [
        'Jedno cofnięcie na usunięcie',
        'Połącz dwa kształty łącznikiem i usuń jeden z nich. Znika razem z łącznikami, a jedno cofnięcie przywraca wszystko.',
      ],
      [
        'Autozapis, który milczy',
        'Licznik pod historią pokazuje, ile razy zadziałał autozapis. Rośnie przy rysowaniu, ale cofanie, ponawianie i skoki go nie ruszają.',
      ],
      [
        'Przeładowanie i klawiatura',
        'Odśwież stronę: rysunek i całe drzewo wracają z session storage. Edytor obsłużysz samą klawiaturą: Add rectangle, potem Tab do kształtu i strzałki.',
      ],
    ],
    calls: [
      {
        name: 'Efekty mają milczeć przy cofaniu.',
        text: 'Effect, który zapisuje dokument, działa po patchState, w następnym przebiegu wykrywania zmian. Flaga prawdziwa tylko wtedy, gdy oś czasu zapisuje stan, jest wtedy już fałszywa. Oś czasu trzyma więc okno odtwarzania, które zamyka się po następnym renderze, a skipReplay i ignoreReplays czytają je dla effect, signalMethod i rxMethod. Testy puszczają cztery rodzaje nasłuchiwaczy przez cofnięcie, ponowienie, skok i zwykłą zmianę, z zone.js i bez niego, a pnpm negative-controls celowo psuje helpery, żeby sprawdzić, czy testy to wychwycą.',
        cost: 'Cena: cofanie należy do obsługi zdarzeń i metod. Odtwarzanie uruchomione z wnętrza effectu zamyka okno o jeden render za późno, więc wywołane przez nie efekty nie są pomijane.',
        lost: 'Przegrały: flaga ustawiana wokół patchState, która dla effectów jest już fałszywa, i wymaganie, żeby każdy effect sam porównywał stan z poprzednim.',
        adr: ['ADR 0007', adr('0007-replay-marker-and-side-effects')],
      },
      {
        name: 'Zapis ma być tani przy dużym stanie.',
        text: 'patchState jest wolną funkcją, więc biblioteka nie może jej opakować i zapisuje zmiany przez watchState. Diff mapy z 10 000 encji w tym callbacku skanowałby ją przy każdym zapisie. Nowy wpis trzyma więc tylko referencje do stanu przed i po, a łatki liczą się w mikrozadaniu albo na żądanie.',
        cost: 'Cena: praca nie znika, tylko przesuwa się za wywołanie. Łatka dla jednej encji w mapie 10 000 encji liczy się około 1,2 ms w Node, bo diff musi obejrzeć każdy klucz. Cel 0,1 ms dla tej pracy nie jest spełniony.',
        lost: 'Przegrały: diff liczony od razu w watcherze (100 do 1000 razy powyżej celu na 10 000 encji), metoda store.patch zamiast patchState i zapis samych snapshotów, w którym pamięć rośnie ze stanem przy każdej zmianie.',
        adr: ['ADR 0006', adr('0006-recording-through-watchstate-with-deferred-patches')],
      },
      {
        name: 'Skok po długiej historii.',
        text: 'Nakładanie łatek od początku jest wolne, a snapshot na każdy wpis jest duży. Co 250 wpisów powstaje punkt kontrolny, czyli referencja do stanu ze strukturalnym współdzieleniem, a nie kopia.',
        cost: 'Cena: maxEntries musi usuwać historię, nie psując drzewa. Biblioteka usuwa najstarszy liść spoza ścieżki do bieżącego wpisu, więc czasem znikają całe gałęzie.',
        lost: 'Przegrały: płaska tablica wpisów (liniowe cofanie, bez gałęzi), pełny snapshot na każdy węzeł (dokładnie ten koszt pamięci, którego projekt ma uniknąć) i liczenie od korzenia przy każdym skoku (poprawne, ale wolne).',
        adr: ['ADR 0005', adr('0005-history-tree-checkpoints-and-jumping')],
      },
    ],
    numbers: [
      [
        '0,005 ms',
        'Mediana dodatkowego czasu na wywołaniu patchState (updateEntity) przy 10 000 encji, w Node, z różnic parami między zwykłym store a store z biblioteką. Cel: poniżej 0,1 ms na wywołanie.',
      ],
      [
        '1,2 ms',
        'Czas liczenia łatek po zmianie jednej encji w mapie 10 000 encji, w Node (7,9 ms przy 50 000). To praca po wywołaniu i cel 0,1 ms jej nie obejmuje.',
      ],
      [
        '98,7 razy',
        'Tyle razy mniejsza sterta niż przy snapshotach po 10 000 drobnych edycjach stanu z 10 000 encji (26,62 MB wobec 2626,62 MB). Przy 100 encjach historia zajmuje więcej pamięci niż snapshoty.',
      ],
      [
        '0,6 ms',
        'Mediana skoku do losowego wpisu: historia 10 000 wpisów przy 1000 encji w store, checkpointEvery 250, Node. Cofnięcie o jeden krok kosztuje 0,021 ms.',
      ],
      [
        '662',
        'Testów Vitest: 548 w bibliotece i 114 w demo, do tego 25 testów Cypress na buildzie produkcyjnym i 32 kontrole na spakowanym tarballu. Pokrycie linii: 98,4% biblioteki i 97,0% dema.',
      ],
      [
        '100',
        'Dostępność w Lighthouse na produkcyjnym buildzie dema, mobile i desktop. Lighthouse widzi tylko pusty edytor, więc stany z kształtami sprawdza dodatkowo axe w testach Cypress.',
      ],
    ],
    machine:
      'Pomiary z 2026-10-04 na laptopie obciążonym innymi zadaniami, więc małe różnice to szum: Intel Core i7-12700H, 15 GB RAM, Linux 6.6 pod WSL2, Node 24.21.0 i Chromium 153 (headless). Liczby z Node są dokładniejsze, bo timer Chromium ma rozdzielczość 0,1 ms.',
    gapsLead:
      'Wycięto z listy dodatków: typowaną migrację zapisanej historii, most do Redux DevTools i scalanie zdalnych zmian.',
    gaps: [
      [
        'Stan musi być zwykłymi danymi',
        'Date, Map i instancje klas są traktowane jako wartości atomowe, a zapisany stan musi nadawać się do JSON.',
      ],
      [
        'Brak wykrywania przeniesień',
        'Zmiana kolejności długiej tablicy daje łatkę wielkości zmienionego środka.',
      ],
      [
        'Zapis historii',
        'Każdy zapis zapisuje całą historię. Zapisana historia jest walidowana przez odtworzenie łatek w przód, ale nie sprawdzam, czy łatka odwrotna naprawdę odwraca łatkę w przód, więc ręcznie zmieniony plik może sprawić, że cofnięcie wyląduje w złym stanie.',
      ],
      [
        'Czytnik ekranu i wąski ekran',
        'Drzewo ARIA sprawdziłem axe i testami klawiatury, ale nie czytnikiem ekranu, a role tree na SVG jest wspierane mniej jednolicie niż na HTML. Demo jest zrobione pod laptopa, a nazwy kształtów są małe na ekranie 360 px.',
      ],
      [
        'Porównania z innymi bibliotekami',
        'Przeczytałem źródła najbliższych projektów, ale nie porównywałem ich szybkości ani rozmiaru. W withUndoRedo 22.0.1 opcja maxStackSize w moim teście niczego nie ograniczała.',
      ],
    ],
    next: 'Najpierw przetestowałbym drzewo z czytnikiem ekranu, potem zrobiłbym entries() przyrostowym i dodał typowaną migrację zapisanej historii.',
    gapsAdr: [
      'ADR 0011: plan awaryjny dla drzewa ARIA',
      adr('0011-devtools-scrubber-and-aria-tree-in-svg'),
    ],
    stack: [
      'Angular',
      'TypeScript',
      'NgRx',
      'SignalStore',
      'Signals',
      'RxJS',
      'Cypress',
      'GitHub Actions',
      'npm',
      'Obsługa klawiaturą',
    ],
  },
  en: {
    title: 'signal-timeline: undo and branching history for NgRx SignalStore, Adrian Turbiński',
    description:
      'An Angular library with undo, transactions, a branching history tree and time travel for NgRx SignalStore. Live demo, code, npm and measured numbers.',
    meta: 'Undo and history for SignalStore',
    lead: 'Undo, redo, transactions, a branching undo tree, history shared across stores and a time-travel panel for NgRx SignalStore. History is stored as patches, so memory stays small on large states.',
    clip: 'Drawing shapes in the demo editor, undoing, branching the history, jumping between branches and scrubbing the timeline.',
    note: 'The demo interface is in English.',
    why: [
      'I work with signals based Angular every day, and the diagram editors I build at work need undo that never loses a step. SignalStore already has linear undo (withUndoRedo in @ngrx-toolkit/core), and for many apps that is enough. An editor wants more. A change after an undo should not destroy the redo history, a gesture touching two stores should undo as one step, and moving through history should not save the document to a server again.',
      'So this library starts where linear undo stops: a branching tree, transactions, history across several stores, and time travel that leaves side effects alone. Everything is written from scratch, and the demo is a small SVG editor made for this project.',
    ],
    tryLead:
      'The demo is a vector editor with a history panel: the entry tree, a timeline scrubber and a diff table.',
    features: [
      [
        'Undo and redo',
        'Draw a few shapes and use Ctrl+Z and Ctrl+Shift+Z, or the Undo and Redo buttons.',
      ],
      [
        'A branch instead of lost history',
        'Undo a few steps and draw something new. The old future stays: a new branch appears next to it in the history tree.',
      ],
      [
        'Jump and scrub',
        'In the history panel click any entry in the tree or drag the timeline slider to jump to that state.',
      ],
      [
        'One undo for a delete',
        'Connect two shapes with a connector and delete one of them. It goes together with its connectors, and a single undo brings everything back.',
      ],
      [
        'An autosave that stays quiet',
        'The counter under the history shows how often autosave ran. It grows while you draw, and undo, redo and jumps do not move it.',
      ],
      [
        'Reload and keyboard',
        'Reload the page: the drawing and the whole tree come back from session storage. The editor works with the keyboard alone: Add rectangle, then Tab to the shape and the arrow keys.',
      ],
    ],
    calls: [
      {
        name: 'Effects must stay quiet during undo.',
        text: 'An effect that saves the document runs after patchState, in the next change detection pass. A flag that is true only while the timeline writes the state is already false by then. So the timeline keeps a replay window that closes after the next render, which skipReplay and ignoreReplays read. The tests run four kinds of listener through undo, redo, jump and a live change, with and without zone.js, and pnpm negative-controls breaks the helpers on purpose to check that the tests notice.',
        cost: 'The cost: undo belongs in event handlers and methods. A replay started from inside an effect closes its window one render too late, so the effects it triggers are not skipped.',
        lost: 'What lost: a boolean set around patchState, which is already false for effects, and asking every effect to compare the state with the previous one.',
        adr: ['ADR 0007', adr('0007-replay-marker-and-side-effects')],
      },
      {
        name: 'Recording has to stay cheap on large state.',
        text: 'patchState is a free function, so the library cannot wrap it and records through watchState. Diffing a 10,000 entity map in that callback would scan it on every write. A new entry keeps only the before and after references, and the patches are computed in a microtask or on demand.',
        cost: 'The cost: the work moves behind the call. The patch of one entity update in a 10,000 entity map takes about 1.2 ms in Node, because a diff has to look at every key. The 0.1 ms target does not hold for that work.',
        lost: 'What lost: an eager diff in the watcher (100 to 1,000 times over the target), a store.patch method in place of patchState, and storing snapshots only, where memory grows with the state on every change.',
        adr: ['ADR 0006', adr('0006-recording-through-watchstate-with-deferred-patches')],
      },
      {
        name: 'Jumping on a long history.',
        text: 'Applying patches from the start is slow, and a snapshot per entry is large. A checkpoint every 250 entries, a reference to a structurally shared state and not a copy, bounds the walk.',
        cost: 'The cost: maxEntries has to remove history without breaking the tree. The library drops the oldest leaf that is not on the path to the current entry, so whole branches can disappear.',
        lost: 'What lost: a flat array of entries (no branches), a full snapshot per node (the memory cost the project exists to avoid) and recomputing from the root on every jump (correct, but slow).',
        adr: ['ADR 0005', adr('0005-history-tree-checkpoints-and-jumping')],
      },
    ],
    numbers: [
      [
        '0.005 ms',
        'Median extra time on a patchState call (updateEntity) with 10,000 entities, in Node, against a plain store. Target: under 0.1 ms per call.',
      ],
      [
        '1.2 ms',
        'Time to compute the patches after changing one entity in a 10,000 entity map, in Node (7.9 ms at 50,000). This is work after the call, and the 0.1 ms target does not cover it.',
      ],
      [
        '98.7x',
        'How much smaller the heap is than with snapshots after 10,000 small edits on a state of 10,000 entities (26.62 MB against 2,626.62 MB). At 100 entities the history takes more memory than snapshots.',
      ],
      [
        '0.6 ms',
        'Median of a jump to a random entry: a history of 10,000 entries over 1,000 entities, checkpointEvery 250, Node. Undoing one step takes 0.021 ms.',
      ],
      [
        '662',
        'Vitest tests: 548 in the library and 114 in the demo, plus 25 Cypress tests on the production build and 32 checks against the packed tarball. Line coverage: 98.4% for the library and 97.0% for the demo.',
      ],
      [
        '100',
        'Lighthouse accessibility on the production build of the demo, mobile and desktop. It only sees the empty editor, so Cypress also runs axe with shapes on the canvas.',
      ],
    ],
    machine:
      'Measured on 2026-10-04 on a laptop shared with other jobs, so small differences are noise: Intel Core i7-12700H, 15 GB RAM, WSL2, Node 24.21.0 and Chromium 153 (headless). The Node figures are more precise, because Chromium’s timer resolution is 0.1 ms.',
    gapsLead:
      'Typed migration of persisted history, a Redux DevTools bridge and merging of remote changes were cut.',
    gaps: [
      [
        'State must be plain data',
        'Dates, Maps and class instances are treated as atomic values, and persisted state must be JSON safe.',
      ],
      [
        'No move detection',
        'Reordering a long array produces a patch the size of the changed middle.',
      ],
      [
        'Persistence',
        'Every save writes the whole history. Persisted history is validated by replaying its forward patches, but I do not check that an inverse patch really inverts its forward patch, so a hand edited payload can make an undo land on the wrong state.',
      ],
      [
        'A screen reader and a narrow screen',
        'I tested the ARIA tree with axe and keyboard tests, not with a screen reader, and role tree on SVG is less uniformly supported than on HTML. The demo is built for a laptop, and shape names are small on a 360 px screen.',
      ],
      [
        'Comparisons with other libraries',
        'I read the source of the closest projects but did not benchmark them. In withUndoRedo 22.0.1 the maxStackSize option limited nothing in my test.',
      ],
    ],
    next: 'First I would test the tree with a screen reader, then make entries() incremental and add a typed migration.',
    gapsAdr: [
      'ADR 0011: the ARIA tree and its fallback',
      adr('0011-devtools-scrubber-and-aria-tree-in-svg'),
    ],
    stack: [
      'Angular',
      'TypeScript',
      'NgRx',
      'SignalStore',
      'Signals',
      'RxJS',
      'Cypress',
      'GitHub Actions',
      'npm',
      'Keyboard support',
    ],
  },
};

export default signalTimeline;
