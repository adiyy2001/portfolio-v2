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
      'Raytracer czarnej dziury Schwarzschilda w czasie rzeczywistym w WebGPU: zakrzywione światło, pierścień fotonowy i dysk akrecyjny. Demo na żywo, kod i liczby z pomiarów.',
    meta: 'Czarna dziura w czasie rzeczywistym',
    lead: 'Raytracer czarnej dziury Schwarzschilda w czasie rzeczywistym w WebGPU: zakrzywione światło, pierścień fotonowy i dysk akrecyjny z beamingiem Dopplera i grawitacyjnym przesunięciem ku czerwieni, a do tego przełączniki, które pokazują, ile wnosi każdy efekt.',
    clip: 'Orbita wokół czarnej dziury, potem beaming Dopplera i soczewkowanie wyłączane i włączane suwakiem podziału.',
    note: 'Demo potrzebuje przeglądarki z WebGPU, a bez niej liczy obraz wolniej na procesorze, w Web Workerach. Interfejs demo jest po angielsku.',
    why: [
      'Moja codzienna praca to oprogramowanie generujące schematy jednokreskowe stacji elektroenergetycznych wysokiego napięcia: Angular i rysowanie diagramów na froncie, Java 21 i Quarkus na back endzie. Ten projekt to celowa zmiana skali: jedna scena, jedno równanie i wynik, który mogę sprawdzić z podręcznikiem.',
      'To także samodzielny test trzech rzeczy, które chciałem zrobić od początku do końca: całkowania numerycznego, programowania GPU i teorii barw. Każdy piksel musi zgadzać się z ogólną teorią względności, więc wynik łatwo sprawdzić i trudno sfałszować. Dlatego projekt ma referencyjny integrator w float64, którego używają testy, przebiegi parytetu i fallback.',
    ],
    tryLead:
      'Na stronie demo jest obraz czarnej dziury i panel z zakładkami Controls i Physics. Panel jest po angielsku.',
    features: [
      [
        'Orbita',
        'Przeciągnij po obrazie, żeby obracać i przechylać kamerę. Kółko myszy albo plus i minus zmieniają odległość, a Home resetuje widok. Gdy kamera stoi, obraz doprecyzowuje się w pełnej rozdzielczości.',
      ],
      [
        'Co wnosi każdy efekt',
        'W grupie Physics effects wyłącz Gravitational lensing, Doppler beaming, Gravitational redshift albo Higher-order images. Bez soczewkowania promienie są proste, a dziura to ciemna kula.',
      ],
      [
        'Porównanie z pełnym modelem',
        'Włącz Compare with the full model i przesuwaj Divider position. Po lewej stronie linii widać twój wybór przełączników, po prawej pełny model.',
      ],
      [
        'Nakładki',
        'W grupie Overlays włącz Photon sphere (linia kropkowana, r = 3 M), Innermost stable orbit (przerywana, r = 6 M) i Shadow edge (ciągła, b = 3√3 M). Legenda pod obrazem nazywa każdą linię.',
      ],
      [
        'Dysk i obraz',
        'Suwaki Peak temperature, Outer radius, Exposure i Bloom zmieniają dysk i obraz. Domyślnie jest 6500 K i -1,5 EV, bo przy gorętszym dysku ACES wybiela cały dysk i chowa gradient oraz stronę z beamingiem.',
      ],
      [
        'Link, zapis i fizyka',
        'Adres strony trzyma cały stan widoku, więc link odtwarza ten sam obraz. Save image zapisuje obraz w wybranym rozmiarze, a zakładka Physics pokazuje każde równanie z odnośnikiem do wyprowadzenia.',
      ],
    ],
    calls: [
      {
        name: 'Jedno równanie, jeden integrator, referencja w float64.',
        text: 'Tracer całkuje metodą RK4 wektorowe równanie geodezyjne, w którym h = |x × x’| jest stałe wzdłuż promienia. Krok rośnie z promieniem i maleje tam, gdzie promień szybko skręca. Stałe kroku sprawdziłem przeglądem względem granicy przechwycenia i kąta ugięcia: wybrany wiersz trzyma krawędź cienia ponad trzy rzędy wielkości w granicach celu 1e-4 przy około 108 krokach na promień. Shader liczy we float32 i jest porównywany z referencją w float64 oraz z bliźniakiem shadera na procesorze z Math.fround, który pokazuje, że pozostały błąd to zaokrąglenia, a nie błąd przeniesienia kodu.',
        cost: 'Cena: promienie w odległości mniejszej niż 0,02 od krytycznego parametru zderzeniowego krążą wokół dziury i kończą w kierunku zależnym od ostatnich cyfr, więc float32 nie może się tam zgadzać z float64. Zestaw parytetu je pomija i mówi o tym, a krawędź cienia jest sprawdzana na procesorze.',
        lost: 'Przegrały: forma Bineta jako główny integrator (każdy promień potrzebuje własnej bazy płaszczyzny, a parametryzacja kątem degeneruje się w punktach zwrotnych), forma hamiltonowska we współrzędnych Schwarzschilda (osobliwa na horyzoncie i na biegunach) oraz integrator symplektyczny (RK4 z krokiem skalowanym promieniem daje wymaganą dokładność prostszym kodem).',
        adr: ['ADR 0002', adr('0002-geodesic-equation-form-and-integrator')],
      },
      {
        name: 'Jeden znak decyduje, która strona dysku jest jasna.',
        text: 'Tracer biegnie wstecz od kamery, więc foton porusza się wzdłuż minus stycznej, którą śledzę. Zły znak momentu pędu fotonu zamienia jasną i ciemną stronę dysku, a obraz nadal wygląda wiarygodnie. Znak ma ręcznie policzone testy jednostkowe i test fizyczny: przy pochylonym widoku strona zbliżająca się do kamery musi wyjść jaśniejsza i bardziej niebieska. Jeden czynnik g obejmuje przesunięcie grawitacyjne, dopplerowskie i dylatację czasu, a dwa przełączniki mnożą przez po jednej jego części.',
        cost: 'Cena: dwa przełączniki to dwa mnożenia na jednym czynniku, więc „Doppler beaming” wyłącza razem beaming i poprzeczną dylatację czasu, i tekst pomocy to mówi.',
        lost: 'Przegrały: jeden przełącznik „relatywistyczne przesunięcie” (prostszy, ale przełączniki istnieją, żeby pokazać wkład każdego efektu) i liczenie momentu pędu z kierunku fotonu do przodu bez odwrócenia znaku (poprawne tylko wtedy, gdyby tracer biegł do przodu, a on biegnie wstecz).',
        adr: ['ADR 0007', adr('0007-disk-model-and-redshift-factor')],
      },
      {
        name: 'Gwiazdy przy silnym soczewkowaniu.',
        text: 'Gwiazdy wypieczone w cubemapie rozmywają się, gdy soczewkowanie je powiększa. Dlatego gwiazdy są liczone osobno dla każdego promienia w jego końcowym kierunku i gwiazda przy pierścieniu staje się łukiem, gdy kumuluje się losowe przesunięcie podpikselowe. Po drodze wyszedł błąd: sprzętowe filtrowanie cubemapy zwracało połowę wartości w odległości tysięcznej radiana od krawędzi ściany, co rysowało blade ciemne linie na filmie podglądu. Mgławica jest teraz wypiekana z ramką jednego teksela i czytana jako warstwa tablicy 2D.',
        cost: 'Cena: wyszukanie gwiazdy to dziewięć haszy komórek na każdy promień, który dotarł do nieba.',
        lost: 'Przegrały: gwiazdy wypieczone w cubemapie (soczewkowanie powiększałoby teksele zamiast gwiazd, więc przy pierścieniu byłoby rozmycie zamiast łuków), cubemapa 1024² z mipmapami (cztery razy więcej pamięci bez widocznego zysku na gładkiej mgławicy) i skala jasności zgodna z widzialną luminancją zamiast (T/6500)^4 (bliższa temu, co widzi kamera, ale model dysku definiuje skalę jako g^4).',
        adr: ['ADR 0012', adr('0012-background-and-hdr-chain-decisions')],
      },
    ],
    numbers: [
      [
        '12,1 ms',
        'Czas GPU na klatkę w 1920 na 1080 na RTX 3070 Ti Laptop (Chrome 154 na Windowsie), mediana 120 ruchomych klatek skryptowanej orbity, z zapytań o znaczniki czasu. To 66 klatek na sekundę przy medianie odstępu. Intel Iris Xe: 136,6 ms, a z dynamiczną rozdzielczością (skala 0,35) 17,7 ms i 62 klatki na sekundę. Cele: 60 klatek na dyskretnym GPU i 30 na zintegrowanym.',
      ],
      [
        '4096',
        'Wszystkie 4096 promieni z zestawu parytetu ma ten sam wynik (przechwycony, uciekł, uderzył w dysk) na GPU i w referencji float64, na trzech adapterach: RTX 3070 Ti, Iris Xe i programowy SwiftShader. Kierunki końcowe mieszczą się w 1,6e-4 rad, przy tolerancji 1e-3. Obraz 128 na 128 ma ten sam wynik we wszystkich pikselach.',
      ],
      [
        '3,7e-8',
        'Błąd krytycznego parametru zderzeniowego znalezionego bisekcją, dla obserwatora w odległości 10 (dla 30 i 100: 5,2e-8 i 5,3e-8), przy limicie 1e-6. W tej samej walidacji ugięcie z całek eliptycznych zgadza się z kwadraturą do 6,2e-15 rad. Referencja w float64.',
      ],
      [
        '0,017',
        'Najgorsza średnia różnica bezwzględna na skali 0 do 255 między obrazem z procesora (Web Workery) a obrazem z grafiki, w dziewięciu scenariuszach, na adapterze programowym. Największa różnica pojedynczego piksela to 1, a tolerancja 0,25.',
      ],
      [
        '2,6 s',
        'Pełny obraz 512 na 512 bez WebGPU w ośmiu workerach (mediana pięciu ładowań). Pierwszy obraz po 558 ms. Z jednym workerem pełny obraz zajmuje 13,0 s. Procesor i7-12700H, a średnie obciążenie maszyny wynosiło od 9 do 18, więc czasy są pesymistyczne.',
      ],
      [
        '797',
        'Testów jednostkowych w aplikacji i 97 dla skryptów, plus 89 specyfikacji Playwright na buildzie produkcyjnym. Pokrycie linii 98,8%. Lighthouse: dostępność, dobre praktyki i SEO 1 w obu rendererach, mobile i desktop. Wydajność od 0,75 do 0,96 na adapterze programowym przy zajętej maszynie, więc mówi niewiele o prawdziwym sprzęcie.',
      ],
    ],
    machine:
      'Pomiary z 2026-10-10 na jednym laptopie: Intel Core i7-12700H (20 rdzeni logicznych) pod WSL2 z Chromium 153 dla procesora i adaptera programowego SwiftShader oraz Chrome 154 na Windowsie dla sprzętowych GPU, czyli NVIDIA GeForce RTX 3070 Ti Laptop i Intel Iris Xe. Pliki wyników zapisują adaptery jako nvidia ampere i intel gen-12lp, a maszyna była zajęta innymi zadaniami podczas pomiarów na procesorze.',
    gapsLead:
      'Z opcjonalnych dodatków zbudowałem tylko sprawdzenie ugięcia całkami eliptycznymi. Reszta to znane ograniczenia.',
    gaps: [
      [
        'Kerr i swobodnie spadający obserwator',
        'Oba były opcjonalne. Każdy potrzebuje własnych równań, przebiegu parytetu i ADR, a dodanie trybu bez nich osłabiłoby tezę, że każdy piksel zgadza się z ogólną teorią względności.',
      ],
      [
        'Prosty dysk',
        'Dysk jest cienki i nieprzezroczysty, świeci izotropowo i nie ma ściemnienia brzegowego, poprawki relatywistycznej Page’a i Thorne’a ani światła wracającego na dysk. Grube dyski, dżety i magnetohydrodynamika są poza zakresem.',
      ],
      [
        'Tone mapping ACES',
        'Dopasowanie ACES spycha bardzo gorące obszary do bieli i może przesuwać odcień. Domyślne 6500 K przy -1,5 EV zachowują gradient i stronę z beamingiem. AgX poradziłby sobie lepiej, ale jego referencja nie ma licencji.',
      ],
      [
        'Obraz bez WebGPU',
        'Obraz fallbacku ma stałe 512 na 512, jeden promień na piksel i brak akumulacji. Nakładki fotonowej sfery i ISCO potrzebują ścieżki graficznej, więc bez WebGPU ich przełączniki są wyłączone.',
      ],
      [
        'Jeden laptop',
        'Liczby ze sprzętu pochodzą z jednego laptopa. Zintegrowany GPU potrzebuje dolnej granicy kontrolera rozdzielczości (skala 0,35), żeby dojść do 60 klatek na sekundę. Nie próbowałem innych GPU, Firefoksa ani Safari.',
      ],
      [
        'Wzorce wizualne',
        'Wzorce testów wizualnych pochodzą z SwiftShadera. Sprzętowy GPU może się różnić na ostatnich bitach i nikt jeszcze ich tam nie porównał.',
      ],
    ],
    next: 'Najpierw Kerr, jako osobny tryb, z referencją na procesorze przed shaderem. Potem testy wizualne Playwrighta na sprzętowym GPU w CI oraz ponowne nagranie dema i filmu fallbacku na innych adapterach.',
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
    lead: 'A real-time WebGPU ray tracer for a Schwarzschild black hole: bent light, the photon ring and an accretion disk with Doppler beaming and gravitational redshift, plus switches that show what each effect contributes.',
    clip: 'An orbit around the black hole, then Doppler beaming and lensing switched off and on with the split slider.',
    note: 'The demo needs a browser with WebGPU, and without one it renders more slowly on the CPU in Web Workers. The demo interface is in English.',
    why: [
      'My day job is software that generates single-line diagrams of high-voltage electrical substations: Angular and diagram rendering on the front end, Java 21 and Quarkus on the back end. This project is a deliberate change of scale from that: one scene, one equation and a result I can check against a textbook.',
      'It is also a self-contained test of three things I wanted to do end to end: numerical integration, GPU programming and color science. Every pixel has to agree with general relativity, which makes the result easy to check and hard to fake. That is why the project has a float64 reference integrator that the tests, the parity runs and the fallback all share.',
    ],
    tryLead:
      'The demo page is a picture of the black hole with a panel beside it, with the tabs Controls and Physics.',
    features: [
      [
        'Orbit',
        'Drag on the picture to orbit and tilt the camera. The mouse wheel or plus and minus change the distance, and Home resets the view. When the camera stops, the picture refines at full resolution.',
      ],
      [
        'What each effect contributes',
        'In the Physics effects group switch off Gravitational lensing, Doppler beaming, Gravitational redshift or Higher-order images. Without lensing the rays are straight and the hole is a dark sphere.',
      ],
      [
        'Compare with the full model',
        'Switch on Compare with the full model and move the Divider position. Left of the line you see your selection of switches, right of it the full model.',
      ],
      [
        'Overlays',
        'In the Overlays group switch on Photon sphere (a dotted line at r = 3 M), Innermost stable orbit (dashed, r = 6 M) and Shadow edge (solid, b = 3√3 M). The legend under the picture names every line.',
      ],
      [
        'Disk and image',
        'The sliders Peak temperature, Outer radius, Exposure and Bloom change the disk and the picture. The defaults are 6500 K and -1.5 EV, because with a hotter disk ACES turns the whole disk white and hides the gradient and the beamed side.',
      ],
      [
        'Link, export and physics',
        'The address holds the whole state of the view, so a link reproduces the same picture. Save image exports the picture at the size you choose, and the Physics tab shows every equation with a link to its derivation.',
      ],
    ],
    calls: [
      {
        name: 'One equation, one integrator, a float64 reference.',
        text: 'The tracer integrates the vector form of the geodesic equation with RK4, where h = |x × x’| is constant along the ray. The step scales with the radius and shrinks where the ray turns fast. I swept the step constants against the capture boundary and the deflection angle, and the row I took keeps the shadow edge more than three orders of magnitude inside the 1e-4 target at about 108 steps per ray. The shader works in float32, and it is checked against the float64 reference and against a Math.fround twin of the shader on the CPU, which shows that the remaining error is rounding and not a porting mistake.',
        cost: 'The cost: a ray that passes within 0.02 of the critical impact parameter winds around the hole and leaves in a direction that depends on the last digits, so float32 cannot agree with float64 there. The parity set leaves those rays out and says so, and the shadow edge itself is checked on the CPU.',
        lost: 'What lost: the Binet form as the main integrator (every ray needs its own plane basis, and the parameterization by angle degenerates at turning points), a Hamiltonian form in Schwarzschild coordinates (singular at the horizon and at the poles) and a symplectic integrator (RK4 at a radius scaled step reaches the accuracy with simpler code).',
        adr: ['ADR 0002', adr('0002-geodesic-equation-form-and-integrator')],
      },
      {
        name: 'One sign decides which side of the disk is bright.',
        text: 'The tracer runs backwards from the camera, so the photon travels along minus the traced tangent. Getting the sign of the photon’s angular momentum wrong swaps the bright and dim sides and still looks plausible. The sign has hand-computed unit tests and a physical test: on a tilted view the side moving towards the camera must come out brighter and bluer. One factor g covers gravitational redshift, Doppler shift and time dilation, and two switches each multiply by one part of it.',
        cost: 'The cost: two switches are two multiplications on one factor, so “Doppler beaming” removes the beaming and the transverse time dilation together, and the help text says so.',
        lost: 'What lost: a single “relativistic shift” switch (simpler, but the switches exist to show what each effect contributes) and computing the angular momentum from the forward photon direction with no sign flip (correct only if the tracer ran forwards, which it does not).',
        adr: ['ADR 0007', adr('0007-disk-model-and-redshift-factor')],
      },
      {
        name: 'Stars under strong lensing.',
        text: 'Stars baked into a cubemap blur when lensing magnifies them. Stars are evaluated per ray at the final direction instead, so a star near the ring becomes an arc once the sub-pixel jitter accumulates. A bug turned up on the way: hardware cube filtering returned half the value within a thousandth of a radian of a face edge, which drew faint dark hairlines in the preview video. The nebula is now baked with a one texel border and read as a 2D array layer.',
        cost: 'The cost: a star lookup is nine cell hashes for every ray that reaches the sky.',
        lost: 'What lost: stars baked into the cubemap (lensing would magnify texels instead of stars, so near the ring there would be blur instead of arcs), a 1024² mipmapped cubemap (four times the memory for no visible gain on a smooth nebula) and visible-band luminance scaling instead of (T/6500)^4 (closer to what a camera records, but the disk model defines the scale as g^4).',
        adr: ['ADR 0012', adr('0012-background-and-hdr-chain-decisions')],
      },
    ],
    numbers: [
      [
        '12.1 ms',
        'GPU time per frame at 1920 by 1080 on an RTX 3070 Ti Laptop (Chrome 154 on Windows), the median of 120 moving frames of a scripted orbit, from timestamp queries. That is 66 frames per second at the median interval. Intel Iris Xe: 136.6 ms, and with dynamic resolution (scale 0.35) 17.7 ms and 62 frames per second. Targets: 60 frames per second on a discrete GPU and 30 on an integrated one.',
      ],
      [
        '4096',
        'All 4096 rays of the parity set have the same outcome (captured, escaped or hit the disk) on the GPU and in the float64 reference, on three adapters: the RTX 3070 Ti, the Iris Xe and the SwiftShader software adapter. Final directions are within 1.6e-4 rad, against a tolerance of 1e-3. A 128 by 128 image has the same outcome in every pixel.',
      ],
      [
        '3.7e-8',
        'Error of the critical impact parameter found by bisection, for an observer at distance 10 (5.2e-8 and 5.3e-8 at 30 and 100), against a limit of 1e-6. In the same validation the deflection from elliptic integrals agrees with quadrature to 6.2e-15 rad. Float64 reference.',
      ],
      [
        '0.017',
        'Worst mean absolute difference on a 0 to 255 scale between the CPU picture (Web Workers) and the graphics picture over nine scenarios, on the software adapter. The largest single pixel difference is 1, and the tolerance is 0.25.',
      ],
      [
        '2.6 s',
        'A full 512 by 512 picture without WebGPU on eight workers (median of five loads). The first picture arrives after 558 ms. With one worker the full picture takes 13.0 s. An i7-12700H with the machine load average between 9 and 18, so the times are pessimistic.',
      ],
      [
        '797',
        'Unit tests in the app and 97 for the scripts, plus 89 Playwright specs against the production build. Line coverage is 98.8%. Lighthouse: accessibility, best practices and SEO at 1 in both renderers, on mobile and desktop. Performance came out between 0.75 and 0.96 on the software adapter with a busy machine, so it says little about real hardware.',
      ],
    ],
    machine:
      'Measured on 2026-10-10 on one laptop: an Intel Core i7-12700H (20 logical cores) under WSL2 with Chromium 153 for the CPU and the SwiftShader software adapter, and Chrome 154 on Windows for the hardware GPUs, an NVIDIA GeForce RTX 3070 Ti Laptop and an Intel Iris Xe. The result files record the adapters as nvidia ampere and intel gen-12lp, and the machine was busy with other work during the CPU runs.',
    gapsLead:
      'Of the optional extras I built only the check of the deflection with elliptic integrals. The rest are known limits.',
    gaps: [
      [
        'Kerr and a free-falling observer',
        'Both were optional. Each needs its own equations, parity run and ADR, and adding a mode without them would weaken the claim that every pixel agrees with general relativity.',
      ],
      [
        'A simple disk',
        'The disk is thin and opaque, emits isotropically and has no limb darkening, no relativistic correction factor from Page and Thorne and no light that returns to the disk. Thick disks, jets and magnetohydrodynamics are out of scope.',
      ],
      [
        'ACES tone mapping',
        'The ACES fit pushes very hot regions toward white and can shift their hue. The defaults, 6500 K at -1.5 EV, keep the gradient and the beamed side visible. AgX would handle this better, but its reference carries no license.',
      ],
      [
        'A picture without WebGPU',
        'The fallback picture is fixed at 512 by 512 with one ray per pixel and no accumulation. The photon sphere and ISCO overlays need the graphics path, so their switches are disabled without WebGPU.',
      ],
      [
        'One laptop',
        'The hardware numbers come from one laptop. The integrated GPU needs the floor of the resolution controller (scale 0.35) to reach 60 frames per second. I have not run it on other GPUs, on Firefox or on Safari.',
      ],
      [
        'Visual baselines',
        'The baselines of the visual tests come from SwiftShader. A hardware GPU can differ in the last bits, and nobody has compared them there yet.',
      ],
    ],
    next: 'First Kerr, as a separate mode, with a CPU reference before the shader. Then the Playwright baselines on a hardware GPU in CI, and re-recording the demo and the fallback video on other adapters.',
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
