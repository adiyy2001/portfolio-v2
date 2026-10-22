const repo = 'https://github.com/adiyy2001/eventhorizon';
const adr = file => `${repo}/blob/main/docs/adr/${file}.md`;

const eventhorizon = {
  id: 'eventhorizon',
  name: 'eventhorizon',
  repo,
  demo: 'https://eventhorizon.adrianturbinski.pl/',
  results: `${repo}/tree/main/bench/results`,
  languages: ['TypeScript', 'WGSL'],
  video: { width: 760, height: 600 },
  pl: {
    title: 'eventhorizon: czarna dziura w WebGPU i Angularze, Adrian Turbiński',
    description:
      'Ray tracer czarnej dziury Schwarzschilda w czasie rzeczywistym w WebGPU: zakrzywione światło, pierścień fotonowy i dysk akrecyjny. Demo na żywo, kod i liczby z pomiarów.',
    meta: 'Czarna dziura w czasie rzeczywistym',
    lead: 'Ray tracer czarnej dziury Schwarzschilda w czasie rzeczywistym w WebGPU: zakrzywione światło, pierścień fotonowy i dysk akrecyjny z beamingiem Dopplera i grawitacyjnym przesunięciem ku czerwieni, a do tego przełączniki, które pokazują, co wnosi każdy efekt.',
    clip: 'Orbita wokół czarnej dziury, potem beaming Dopplera i soczewkowanie wyłączane i włączane suwakiem podziału.',
    note: 'Bez WebGPU demo liczy obraz wolniej na procesorze, w Web Workerach. Interfejs demo jest po angielsku.',
    why: [
      'Moja codzienna praca to oprogramowanie generujące schematy jednokreskowe stacji elektroenergetycznych wysokiego napięcia: Angular i rysowanie diagramów na froncie, Java 21 i Quarkus na back endzie. Ten projekt to celowa zmiana skali: jedna scena, jedno równanie i wynik, który mogę sprawdzić z podręcznikiem.',
      'To także samodzielny test trzech rzeczy, które chciałem zrobić od początku do końca: całkowania numerycznego, programowania GPU i teorii barw. Każdy piksel musi zgadzać się z ogólną teorią względności, więc wynik łatwo sprawdzić i trudno sfałszować. Dlatego projekt ma referencyjny integrator w float64, z którego korzystają testy, porównania GPU z procesorem i tryb bez WebGPU.',
    ],
    tryLead: 'Demo to obraz czarnej dziury i panel z zakładkami Controls i Physics.',
    features: [
      [
        'Orbita',
        'Przeciągnij po obrazie, żeby obracać i przechylać kamerę. Kółko myszy zmienia odległość, a Home resetuje widok.',
      ],
      [
        'Co wnosi każdy efekt',
        'W grupie Physics effects wyłącz Gravitational lensing, Doppler beaming, Gravitational redshift albo Higher-order images. Bez soczewkowania promienie są proste, a dziura to ciemna kula.',
      ],
      [
        'Porównanie z pełnym modelem',
        'Włącz Compare with the full model i przesuwaj Divider position: po lewej widać wybrane przełączniki, po prawej pełny model.',
      ],
      [
        'Nakładki',
        'W grupie Overlays włącz Photon sphere, Innermost stable orbit i Shadow edge. Legenda pod obrazem nazywa każdą linię.',
      ],
      [
        'Dysk i obraz',
        'Suwaki Peak temperature, Outer radius, Exposure i Bloom zmieniają dysk i obraz. Domyślne 6500 K i -1,5 EV zachowują gradient i stronę z beamingiem.',
      ],
      [
        'Link i fizyka',
        'Adres strony trzyma cały stan widoku, więc link odtwarza ten sam obraz. Zakładka Physics pokazuje każde równanie z odnośnikiem do wyprowadzenia.',
      ],
    ],
    calls: [
      {
        name: 'Jedno równanie, jeden integrator, referencja w float64.',
        text: 'Ray tracer całkuje metodą RK4 wektorowe równanie geodezyjne, z krokiem skalowanym promieniem. Wybrany wariant trzyma krawędź cienia o ponad trzy rzędy wielkości poniżej celu 1e-4 przy około 108 krokach na promień. Shader liczy we float32 i jest porównywany z referencją w float64 oraz z własnym bliźniakiem na procesorze (Math.fround), co pokazuje, że pozostały błąd to zaokrąglenia, a nie błąd przy przenoszeniu kodu.',
        cost: 'Cena: promienie w odległości poniżej 0,02 od krytycznego parametru zderzeniowego okrążają dziurę i kończą w kierunku zależnym od ostatnich cyfr, więc float32 nie może się tam zgadzać z float64. Zestaw porównawczy je pomija i mówi o tym wprost.',
        lost: 'Przegrały: forma Bineta, forma hamiltonowska (osobliwa na horyzoncie i biegunach) i integrator symplektyczny (RK4 daje tę dokładność prostszym kodem).',
        adr: ['ADR 0002', adr('0002-geodesic-equation-form-and-integrator')],
      },
      {
        name: 'Jeden znak decyduje, która strona dysku jest jasna.',
        text: 'Promienie biegną wstecz od kamery, więc foton porusza się w kierunku przeciwnym do stycznej, którą śledzę. Zły znak momentu pędu zamienia jasną i ciemną stronę dysku, a obraz nadal wygląda wiarygodnie. Znak ma ręcznie policzone testy i test fizyczny: strona zbliżająca się do kamery musi wyjść jaśniejsza i bardziej niebieska. Jeden czynnik g obejmuje przesunięcie grawitacyjne, dopplerowskie i dylatację czasu, a dwa przełączniki mnożą go przez różne jego części.',
        cost: 'Cena: „Doppler beaming” wyłącza razem beaming i poprzeczną dylatację czasu, a tekst pomocy to zaznacza.',
        lost: 'Przegrały: jeden przełącznik „relatywistyczne przesunięcie” oraz moment pędu liczony z kierunku fotonu do przodu bez odwrócenia znaku.',
        adr: ['ADR 0007', adr('0007-disk-model-and-redshift-factor')],
      },
      {
        name: 'Gwiazdy przy silnym soczewkowaniu.',
        text: 'Gwiazdy wypieczone w cubemapie rozmywają się, gdy soczewkowanie je powiększa, więc liczę je osobno dla każdego promienia w jego końcowym kierunku. Gwiazda przy pierścieniu staje się łukiem, gdy kumuluje się losowe przesunięcie podpikselowe. Po drodze wyszedł błąd: sprzętowe filtrowanie cubemapy zwracało połowę wartości przy krawędzi ściany i rysowało ciemne linie na filmie podglądu.',
        cost: 'Cena: wyszukanie gwiazdy to dziewięć haszy komórek na każdy promień, który dotarł do nieba.',
        lost: 'Przegrały: gwiazdy wypieczone w cubemapie (przy pierścieniu byłoby rozmycie zamiast łuków) i cubemapa 1024² z mipmapami (cztery razy więcej pamięci bez zysku na gładkiej mgławicy).',
        adr: ['ADR 0012', adr('0012-background-and-hdr-chain-decisions')],
      },
    ],
    numbers: [
      [
        '12,1 ms',
        'Czas GPU na klatkę w 1920 na 1080 na RTX 3070 Ti Laptop (Chrome 154, Windows), mediana z 120 klatek orbity: 66 klatek na sekundę. Intel Iris Xe: 136,6 ms, a 17,7 ms (62 klatki na sekundę) przy dynamicznej rozdzielczości w skali 0,35. Cele: 60 na średniej klasy dyskretnym GPU, 30 na zintegrowanym.',
      ],
      [
        '4096',
        'Wszystkie 4096 promieni z zestawu porównawczego kończą się tak samo na GPU i w referencji float64, na RTX 3070 Ti, Iris Xe i programowym SwiftShader. Kierunki końcowe różnią się najwyżej o 1,6e-4 rad, przy tolerancji 1e-3.',
      ],
      [
        '3,7e-8',
        'Błąd krytycznego parametru zderzeniowego z bisekcji dla obserwatora w odległości 10, przy limicie 1e-6.',
      ],
      [
        '0,017',
        'Najgorsza średnia różnica (skala 0 do 255) między obrazem z procesora a obrazem z GPU w dziewięciu scenariuszach, na adapterze programowym. Tolerancja 0,25.',
      ],
      [
        '2,6 s',
        'Pełny obraz 512 na 512 bez WebGPU na ośmiu workerach (mediana pięciu ładowań), na jednym workerze 13,0 s. Maszyna była obciążona, więc czasy są zawyżone.',
      ],
      [
        '797',
        'Testów jednostkowych w aplikacji i 97 dla skryptów, plus 89 testów Playwright, przy pokryciu linii 98,8%. Lighthouse: dostępność, dobre praktyki i SEO po 100. Wydajność od 75 do 88 na adapterze programowym i od 90 do 96 na ścieżce procesora, na zajętej maszynie.',
      ],
    ],
    machine:
      'Pomiary z 2026-10-10 na jednym laptopie: Intel Core i7-12700H pod WSL2, z Chromium 153 dla procesora i adaptera programowego SwiftShader oraz Chrome 154 na Windowsie dla GPU: NVIDIA GeForce RTX 3070 Ti Laptop i Intel Iris Xe.',
    gapsLead: 'Z opcjonalnych dodatków zbudowałem tylko sprawdzenie ugięcia całkami eliptycznymi.',
    gaps: [
      [
        'Kerr i swobodnie spadający obserwator',
        'Oba były opcjonalne. Każdy wymaga własnych równań, porównania z referencją i ADR, a tryb bez nich osłabiłby tezę, że każdy piksel zgadza się z teorią.',
      ],
      [
        'Prosty dysk',
        'Cienki, nieprzezroczysty, świeci izotropowo, bez pociemnienia brzegowego, poprawki Page’a i Thorne’a oraz światła wracającego na dysk. Grube dyski i dżety są poza zakresem.',
      ],
      [
        'Tone mapping ACES',
        'ACES spycha bardzo gorące obszary do bieli i może przesunąć odcień. AgX poradziłby sobie lepiej, ale jego referencja nie ma licencji.',
      ],
      [
        'Obraz bez WebGPU',
        'Stałe 512 na 512, jeden promień na piksel, bez akumulacji. Nakładki sfery fotonowej i ISCO są wtedy wyłączone.',
      ],
      [
        'Jeden laptop',
        'Liczby ze sprzętu pochodzą z jednego laptopa z mocnym GPU, a cel 60 klatek dotyczy średniej klasy karty. Wzorce testów wizualnych pochodzą ze SwiftShadera. Nie próbowałem innych GPU, Firefoksa ani Safari.',
      ],
    ],
    next: 'Najpierw Kerr, jako osobny tryb, z referencją na procesorze przed shaderem. Potem testy wizualne na sprzętowym GPU w CI i nowe nagranie dema na innych adapterach.',
    gapsAdr: ['ADR 0017: pominięte dodatki', adr('0017-stretch-goals-left-out')],
    stack: [
      'Angular',
      'TypeScript',
      'WebGPU',
      'WGSL',
      'NgRx',
      'SignalStore',
      'Signals',
      'Web Workers',
      'Playwright',
      'GitHub Actions',
      'Obsługa klawiaturą',
    ],
  },
  en: {
    title: 'eventhorizon: a black hole in WebGPU and Angular, Adrian Turbiński',
    description:
      'A real-time WebGPU ray tracer for a Schwarzschild black hole: bent light, the photon ring and an accretion disk. Live demo, code and measured numbers.',
    meta: 'A black hole in real time',
    lead: 'A real-time WebGPU ray tracer of a Schwarzschild black hole: bent light, the photon ring and an accretion disk with Doppler beaming and gravitational redshift, plus toggles that show what each effect contributes.',
    clip: 'An orbit around the black hole, then Doppler beaming and lensing switched off and on with the split slider.',
    note: 'Without WebGPU the demo renders more slowly on the CPU in Web Workers. The demo interface is in English.',
    why: [
      'At my day job I work on software that generates single-line diagrams of high-voltage electrical substations: Angular and diagram rendering on the front end, Java 21 and Quarkus on the back end. This project is a deliberate change of scale from that: one scene, one equation and a result I can verify against a textbook.',
      'It is also a self-contained test of three things I wanted to do end to end: numerical integration, GPU programming and color science. Every pixel has to agree with general relativity, which makes the output easy to check and hard to fake. That is why the project has a float64 reference integrator shared by the tests, the parity runs and the fallback renderer.',
    ],
    tryLead:
      'The demo is the black hole with a panel beside it, with the tabs Controls and Physics.',
    features: [
      [
        'Orbit',
        'Drag on the picture to orbit and tilt the camera. The wheel changes the distance and Home resets the view.',
      ],
      [
        'What each effect contributes',
        'In the Physics effects group switch off Gravitational lensing, Doppler beaming, Gravitational redshift or Higher-order images.',
      ],
      [
        'Compare with the full model',
        'Switch on Compare with the full model and move the Divider position: your switches on the left, the full model on the right.',
      ],
      [
        'Overlays',
        'In the Overlays group switch on Photon sphere, Innermost stable orbit and Shadow edge. The legend names every line.',
      ],
      [
        'Disk and image',
        'The sliders Peak temperature, Outer radius, Exposure and Bloom change the disk and the picture.',
      ],
      [
        'Link and physics',
        'The address holds the whole state of the view, so a link reproduces the same picture. The Physics tab shows every equation with a link to its derivation.',
      ],
    ],
    calls: [
      {
        name: 'One equation, one integrator, a float64 reference.',
        text: 'The tracer integrates the vector geodesic equation with RK4 and a step that scales with the radius. The variant I chose keeps the shadow edge more than three orders of magnitude inside the 1e-4 target at about 108 steps per ray. The float32 shader is validated against both the float64 reference and a Math.fround twin on the CPU, so the remaining error is rounding, not a porting mistake.',
        cost: 'The price: rays within 0.02 of the critical impact parameter spiral around the hole and end in a direction set by the last digits, so float32 cannot match float64 there. The parity set leaves them out.',
        lost: 'What lost: the Binet form, a Hamiltonian form (singular at the horizon and the poles) and a symplectic integrator (RK4 reaches the accuracy with simpler code).',
        adr: ['ADR 0002', adr('0002-geodesic-equation-form-and-integrator')],
      },
      {
        name: 'One sign decides which side of the disk is bright.',
        text: 'The tracer runs backwards from the camera. An incorrect sign of the angular momentum swaps the bright and dim sides but still looks plausible. The sign has hand-derived unit tests and a physical test: the side moving towards the camera must come out brighter and bluer. One factor g covers redshift, Doppler shift and time dilation, and the two switches multiply it by different parts.',
        cost: 'The cost: “Doppler beaming” removes the beaming and the transverse time dilation together, and the help text says so.',
        lost: 'What lost: a single “relativistic shift” switch and an angular momentum from the forward photon direction with no sign flip.',
        adr: ['ADR 0007', adr('0007-disk-model-and-redshift-factor')],
      },
      {
        name: 'Stars under strong lensing.',
        text: 'Stars baked into a cubemap blur when lensing magnifies them. Instead, stars are evaluated per ray at the final direction, and a star near the ring becomes an arc. I also found a bug along the way: hardware cube filtering returned half the value next to a face edge and drew faint dark hairlines in the preview video.',
        cost: 'The cost: a star lookup is nine cell hashes for every ray that reaches the sky.',
        lost: 'Lost: stars baked into the cubemap (blur instead of arcs) and a 1024² mipmapped cubemap (quadruple the memory for no improvement on a smooth nebula).',
        adr: ['ADR 0012', adr('0012-background-and-hdr-chain-decisions')],
      },
    ],
    numbers: [
      [
        '12.1 ms',
        'GPU time per frame at 1920 by 1080 on an RTX 3070 Ti Laptop (Chrome 154, Windows), the median of 120 orbit frames: 66 frames per second. Intel Iris Xe: 136.6 ms, and 17.7 ms (62 frames per second) with dynamic resolution at scale 0.35. Targets: 60 on a mid-range discrete GPU, 30 on an integrated one.',
      ],
      [
        '4096',
        'All 4096 rays of the parity set end the same way on the GPU and in the float64 reference, on the RTX 3070 Ti, the Iris Xe and the SwiftShader software adapter.',
      ],
      [
        '3.7e-8',
        'Error of the critical impact parameter found by bisection, for an observer at distance 10, against a limit of 1e-6.',
      ],
      [
        '0.017',
        'Worst mean difference (0 to 255 scale) between the CPU picture and the GPU picture over nine scenarios, on the software adapter. The tolerance is 0.25.',
      ],
      [
        '2.6 s',
        'A full 512 by 512 picture without WebGPU on eight workers (median of five loads), and 13.0 s on one worker. The machine was busy.',
      ],
      [
        '797',
        'Unit tests in the app and 97 for the scripts, plus 89 Playwright specs, with 98.8% line coverage. Lighthouse accessibility, best practices and SEO are 100. Performance is 75 to 88 on the software adapter and 90 to 96 on the CPU path, on a busy machine.',
      ],
    ],
    machine:
      'Measured on 2026-10-10 on one laptop: an Intel Core i7-12700H under WSL2 with Chromium 153 for the CPU and SwiftShader, and Chrome 154 on Windows for the GPUs, an NVIDIA GeForce RTX 3070 Ti Laptop and an Intel Iris Xe.',
    gapsLead: 'Of the optional extras I built only the deflection check with elliptic integrals.',
    gaps: [
      [
        'Kerr and a free-falling observer',
        'Both were optional. Each one requires its own set of equations, parity run and ADR, and a half-checked mode would weaken the claim that every pixel agrees with the theory.',
      ],
      [
        'A simple disk',
        'Thin, opaque and isotropic, ignoring limb darkening. It does not include the Page and Thorne correction or any returning light. Thick disks and jets are out of scope.',
      ],
      [
        'ACES tone mapping',
        'ACES pushes very hot regions toward white. AgX would do better, but its reference has no license.',
      ],
      [
        'A picture without WebGPU',
        'Fixed at 512 by 512, one ray per pixel, no accumulation, and the photon sphere and ISCO overlays are disabled.',
      ],
      [
        'One laptop',
        'The hardware numbers are from one laptop with a powerful GPU, while the goal of 60 frames is for a mid-range card. SwiftShader provided the visual baselines. I have not tested it on other GPUs, Firefox or Safari.',
      ],
    ],
    next: 'First Kerr, as a separate mode, with a CPU reference before the shader. Then the visual baselines on a hardware GPU in CI, and a new demo recording on other adapters.',
    gapsAdr: ['ADR 0017: the extras left out', adr('0017-stretch-goals-left-out')],
    stack: [
      'Angular',
      'TypeScript',
      'WebGPU',
      'WGSL',
      'NgRx',
      'SignalStore',
      'Signals',
      'Web Workers',
      'Playwright',
      'GitHub Actions',
      'Keyboard support',
    ],
  },
};

export default eventhorizon;
