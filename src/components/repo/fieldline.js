const repo = 'https://github.com/adiyy2001/fieldline';
const adr = file => `${repo}/blob/main/docs/adr/${file}.md`;

const fieldline = {
  id: 'fieldline',
  name: 'fieldline',
  repo,
  demo: 'https://fieldline.adrianturbinski.pl/',
  results: `${repo}/tree/main/bench/results`,
  languages: ['TypeScript', 'WGSL'],
  video: { width: 1000, height: 624 },
  pl: {
    title: 'fieldline: pole wokół linii wysokiego napięcia w WebGPU, Adrian Turbiński',
    description:
      'Pole elektryczne i magnetyczne wokół linii wysokiego napięcia liczone na GPU w WebGPU: kontury ekspozycji i optymalizator faz. Demo na żywo, kod i liczby z pomiarów.',
    meta: 'Pole wokół linii wysokiego napięcia',
    lead: 'Wizualizacja 3D w czasie rzeczywistym pola elektrycznego i magnetycznego wokół napowietrznych linii wysokiego napięcia, liczona na GPU w WebGPU, z konturami ekspozycji, wykresami poprzecznymi i optymalizatorem układu faz.',
    clip: 'Linie pola w jednym cyklu 50 Hz, pole przy ziemi z konturami ekspozycji, zmiana układu faz i wykres poprzeczny.',
    note: 'Widoki 3D potrzebują WebGPU, a bez niego działa ścieżka na procesorze z grubszą siatką. Interfejs demo jest po angielsku, a nagranie zrobiono na programowym adapterze WebGPU (SwiftShader).',
    why: [
      'Pracuję nad oprogramowaniem dla stacji wysokiego napięcia, a pytanie, które wraca, brzmi: jak silne jest pole pod linią, gdy przebiega blisko domów. Chciałem policzyć to porządnie, zobaczyć jego trójwymiarowy kształt i sprawdzić liczby z rozwiązaniami analitycznymi zamiast ufać obrazkowi.',
      'To także poważny projekt WebGPU. Obliczanie pola, marching cubes i tracer linii pola to przebiegi obliczeniowe, a wersja tej samej matematyki w TypeScripcie w float64 jest referencją, z którą są testowane.',
    ],
    tryLead:
      'Na stronie demo jest sześć widoków w zakładkach, od 1 do 6, i panel parametrów linii. Interfejs jest po angielsku.',
    features: [
      [
        'Pole przy ziemi',
        'Zakładka Ground pokazuje pole E albo B na wysokości 1 lub 1,8 m z konturami poziomów ekspozycji. E i B przełączają pole, R wartość skuteczną i chwilową, Space uruchamia i zatrzymuje animację cyklu, a strzałki przesuwają sondę, gdy mapa ma fokus.',
      ],
      [
        'Wykres poprzeczny',
        'Zakładka Profile pokazuje profil poprzeczny pola z tabelą danych, a Download CSV zapisuje liczby.',
      ],
      [
        'Układ faz',
        'Zakładka Phasing porównuje 36 układów faz podwójnego obwodu w sześciu klasach symetrii. Dla linii jednoobwodowej przycisk Switch to a double circuit tower zmienia słup, Apply przenosi układ do widoku, a sekcja Why the best arrangement wins tłumaczy zwycięzcę momentami dipolowymi, które się znoszą.',
      ],
      [
        'Widoki 3D',
        'Zakładki Volume, Isosurfaces i Field lines pokazują pole w przestrzeni: przekrój objętościowy, powierzchnie stałej wartości i linie pola animowane w cyklu. Kamerę obracasz myszą. Widoki wymagają WebGPU i modelu 3D charge simulation.',
      ],
      [
        'Zmiana geometrii',
        'W panelu zmień Tower type, Number of spans, zwis, napięcia i układ faz. Pole przelicza się od razu, a zmiana napięcia, kąta czy układu faz nie powtarza rozkładu LU.',
      ],
      [
        'Poziomy ekspozycji i link',
        'Lista Emphasised standard przełącza kontury między ICNIRP 2010, ICNIRP 1998 z zaleceniem 1999/519/EC i polskimi limitami, a poziomy można też zmienić. Adres strony trzyma cały stan, a znak zapytania otwiera pomoc, w której skróty jednoklawiszowe da się wyłączyć.',
      ],
    ],
    calls: [
      {
        name: 'Pole 3D z wiszącego przewodu.',
        text: 'Przewody to krzywe łańcuchowe, więc linia nie jest zbiorem nieskończonych równoległych drutów. Każdy przewód jest cięty na proste odcinki ze stałym ładunkiem, ładunki wynikają z dopasowania potencjału w jednym punkcie kolokacji na odcinek, a pole z zamkniętych wzorów dla skończonych odcinków i ich odbić w ziemi. Macierz zależy tylko od geometrii, więc jest raz rozkładana prawdziwym LU, a każda zmiana napięcia, kąta czy układu faz używa tych samych czynników.',
        cost: 'Cena: reszta potencjału na powierzchni przewodu to 0,27 do 0,42 procent w przęsłach i do 1,8 procent tam, gdzie przewód załamuje się na słupie. Pole zbiega szybciej niż potencjał powierzchni (0,36 procent różnicy między 12 a 48 segmentami), ale krótsze segmenty przy słupach zmniejszyłyby resztę.',
        lost: 'Przegrały: zespolone LU (dwa razy więcej pamięci i około cztery razy więcej arytmetyki, a rzeczywiste czynniki obsługują obie części prawej strony), Cholesky (macierz kolokacji 3D nie jest dokładnie symetryczna), iteracyjny GMRES (dla kilkuset niewiadomych rozwiązanie bezpośrednie jest szybsze i bez pytania o zbieżność) i sformułowanie Galerkina (symetryczna macierz, ale całkowanie numeryczne po parach odcinków).',
        adr: ['ADR 0002', adr('0002-charge-simulation-with-a-real-lu-factored-once')],
      },
      {
        name: 'Float32 na GPU.',
        text: 'Współrzędna 450 m od początku układu ma odstęp float32 równy 3e-5 m, czyli 0,02 procent promienia obcięcia. Końce odcinków i punkty obliczeń są więc odejmowane od środka regionu w float64 na procesorze i do shaderów trafiają tylko różnice. Odległość do osi jest obcinana do promienia przewodu, więc pole jest skończone i ciągłe na powierzchni, a ta sama reguła działa w modelu 2D, w modelu 3D, w jądrach GPU i w trasowaniu linii pola.',
        cost: 'Cena: błąd w strefie obcięcia to 6,5e-4 wobec celu 1e-3, czyli zapas półtora raza. Poza nią błąd jest poniżej 1,2e-4. Bardzo duże siatki potrzebowałyby jednego początku układu na kafelek.',
        lost: 'Przegrały: liczenie na GPU we współrzędnych świata (błąd byłby widoczny w polu przy przewodzie), emulacja float32 na procesorze do przewidywania błędu GPU (nie obejmie różnic sterowników) i jedno jądro z układem jako przełącznikiem w czasie wykonania (każde wywołanie niosłoby gałęzie pozostałych układów).',
        adr: ['ADR 0022', adr('0022-field-backends-and-gpu-evaluation')],
      },
      {
        name: 'Skąd wiadomo, że liczby są dobre.',
        text: 'Każda warstwa jest sprawdzana względem czegoś spoza siebie: rozwiązania analitycznego przewodu nad ziemią, modelu 2D, do którego wynik 3D musi dążyć, gdy przęsło rośnie, odbitego układu faz, opublikowanego badania wysokości granicznych i kodu float64 dla GPU. Badanie to Bendík, Cenký i Eleschová, Electricity 2026, 7(2), 39 (CC BY 4.0), a model 2D odtwarza 13 z 14 jego wysokości granicznych. Pozostały przypadek, słup Portal, jest dopasowany i tak oznaczony, bo rozstawu faz nie da się wiarygodnie odczytać ze schematu.',
        cost: 'Cena: badanie dotyczy 2D (wysokości prześwitu w przekroju w środku przęsła), więc model 3D nie ma publikowanej referencji, a jego sprawdzianem jest zbieżność do 2D i przypadki analityczne. Moje wysokości graniczne wychodzą od 0,014 do 0,028 m poniżej opublikowanych we wszystkich przypadkach i nie wyizolowałem przyczyny.',
        lost: 'Przegrały: wymyślony profil referencyjny, porównanie z komercyjnym narzędziem, którego wynik nie jest otwarcie opublikowany, i odtworzenie tylko jednego słupa (czternaście układów sprawdza razem geometrię i fazowanie).',
        adr: ['ADR 0017', adr('0017-validation-against-a-published-reference')],
      },
    ],
    numbers: [
      [
        '6,5e-4',
        'Największy względny błąd E z shaderów float32 wobec kodu float64, najgorszy w strefie obcięcia, na siatkach przy ziemi, objętościach, profilach i sondzie startującej na osi przewodu, na trzech słupach. B: 1,6e-4. Ten sam wynik na trzech adapterach: RTX 3070 Ti Laptop, Iris Xe i programowym SwiftShader. Cel: 1e-3.',
      ],
      [
        '50 ms',
        'Mediana od zmiany geometrii słupa poziomego do opublikowanej klatki na RTX 3070 Ti Laptop (p95 60 ms). Najgorszy przypadek na sprzętowych GPU to podwójny obwód: 124 ms (p95 141). Cel: mediana poniżej 200 ms. Rozkład LU z podstawowymi rozwiązaniami trwa 10,0 ms przy 210 niewiadomych i 30,8 ms przy 336 w Node 24.21.0, po 12 segmentów na przęsło.',
      ],
      [
        '0,999999',
        'Stosunek szczytowego E w środku przęsła w modelu 3D do modelu 2D dla prostej linii z przęsłem 800 m (B: 0,999972). Przy domyślnych przęsłach E mieści się w 0,9936 do 0,9972, a B w 0,9873 do 0,9890 na trzech słupach.',
      ],
      [
        '13 z 14',
        'Wysokości graniczne opublikowanego badania linii 420 kV odtworzone w granicach od 0,014 do 0,028 m poniżej wartości z artykułu (średnio 0,022 m). Jeden przypadek jest dopasowany i oznaczony. Ranking układów faz: 0 naruszeń wobec artykułu.',
      ],
      [
        '8 ms',
        'Mediana odstępu między klatkami w prawie każdym widoku na obu sprzętowych GPU, p95 poniżej 9 ms, w 1920 na 1080, 300 klatek requestAnimationFrame na widok. To zegar klatek przeglądarki headless, którego nie mierzyłem osobno, więc liczba pokazuje, że widoki się w nim mieszczą, a nie ile szybciej mogłyby działać. Wyjątek to linie pola E na Iris Xe: 15,6 ms (64 klatki na sekundę).',
      ],
      [
        '902',
        'Testów jednostkowych w 104 plikach, 90 testów skryptów i 108 testów end to end. Pokrycie linii: 99,3% w rdzeniu (2410 z 2426), 100% w GPU i workerach, 82,2% w aplikacji. Lighthouse: dostępność, dobre praktyki i SEO 1 w obu rendererach, mobile i desktop, a wydajność od 0,76 do 1 na adapterze programowym.',
      ],
    ],
    machine:
      'Pomiary z 2026-10-11 na jednym laptopie: Intel Core i7-12700H (20 rdzeni logicznych), Linux 6.6.87.2 pod WSL2, Node 24.21.0. Liczby programowe (SwiftShader, backend na procesorze) pochodzą z Chromium 156.0.8078.4 na tej maszynie. Liczby z prawdziwych GPU pochodzą z Windowsa na tym samym laptopie, z headless Chrome 154.0.8037.98 i buildem produkcyjnym serwowanym z WSL: NVIDIA GeForce RTX 3070 Ti Laptop (Ampere) i Intel Iris Xe (Gen 12LP). Nie mierzyłem średniej klasy karty stacjonarnej, więc nic o niej nie twierdzę.',
    gapsLead:
      'Z listy dodatków nie zbudowałem żadnego z trzech: głębokości zespolonego obrazu Deriego dla prądów powrotnych przez ziemię, terenu z nachyleniem i dwóch równoległych linii w jednym korytarzu.',
    gaps: [
      [
        'Ziemia i przewody odgromowe',
        'Prądy powrotne przez ziemię i prądy w przewodach odgromowych są pomijane. Zrównoważone prądy nie zostawiają prądu powrotnego, a oszacowanie dla niezrównoważonej reszty to 0,2 µT przy ziemi dla pełnych 1000 A. Prądy indukowane w przewodach odgromowych nieco obniżyłyby B, więc ich pominięcie zawyża wynik.',
      ],
      [
        'Jedna linia, płaski teren',
        'Dwie równoległe linie w korytarzu i teren z nachyleniem nie są zbudowane. Pierwsza potrzebuje własnych pomiarów rozwiązania, druga łamie metodę obrazów.',
      ],
      [
        'Dyskretyzacja ładunku',
        'Reszta potencjału sięga 1,8 procent tam, gdzie przewód załamuje się na słupie. Krótsze segmenty przy słupach by ją zmniejszyły.',
      ],
      [
        'Ścieżka na procesorze',
        'Aktualizacja w pełnej jakości na backendzie procesora trwa od 263 do 429 ms w medianie. Tylko przeciąganie w jakości roboczej mieści się poniżej 200 ms.',
      ],
      [
        'Jeden laptop',
        'Dwa prawdziwe GPU (mocny laptopowy i zintegrowany) na tej samej maszynie i jeden silnik przeglądarki, Chromium. Firefoksa i Safari nie testowałem, a chciałbym mieć liczby ze średniej klasy dyskretnego GPU.',
      ],
      [
        'Przerywane kontury na GPU',
        'Kreski konturów na GPU idą wzdłuż dominującej osi gradientu, więc na bardzo stromych konturach ich długość nie jest dokładnie stała.',
      ],
    ],
    next: 'Najpierw zespolony obraz Deriego dla prądów powrotnych przez ziemię, potem krótsze segmenty przy słupach, żeby zmniejszyć resztę potencjału, a potem pomiary na średniej klasy dyskretnym GPU.',
    gapsAdr: ['ADR 0025: pominięte dodatki', adr('0025-stretch-goals-left-out')],
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
      'WCAG 2.1',
      'Obsługa klawiaturą',
    ],
  },
  en: {
    title: 'fieldline: fields around high-voltage lines in WebGPU, Adrian Turbiński',
    description:
      'Electric and magnetic fields around high-voltage lines computed on the GPU with WebGPU: exposure contours and a phasing optimizer. Live demo, code and measured numbers.',
    meta: 'Fields around high-voltage lines',
    lead: 'Real-time 3D visualization of the electric and magnetic fields around overhead high-voltage lines, computed on the GPU with WebGPU, with exposure contours, lateral profiles and a phase-arrangement optimizer.',
    clip: 'Field lines over one 50 Hz cycle, the ground field with exposure contours, a phasing change and the lateral profile.',
    note: 'The 3D views need WebGPU, and without it a CPU path with a coarser grid takes over. The demo interface is in English, and the recording was made on the software WebGPU adapter (SwiftShader).',
    why: [
      'I work on software for high-voltage substations, and a question that keeps coming back is how strong the field under a line is when the line passes near homes. I wanted to compute it properly, see its three-dimensional shape and check the numbers against analytic solutions instead of trusting a picture.',
      'It is also a serious WebGPU compute project. The field evaluation, marching cubes and the field line tracer are compute passes, and a float64 TypeScript version of the same math is the reference they are tested against.',
    ],
    tryLead:
      'The demo page has six views in tabs, numbered 1 to 6, and a panel with the line parameters.',
    features: [
      [
        'The field at ground level',
        'The Ground tab shows the E or the B field at 1 or 1.8 m above ground with contours at the exposure levels. E and B switch the field, R switches between rms and instantaneous values, Space plays and pauses the cycle animation, and the arrow keys move the probe while the map has focus.',
      ],
      [
        'A lateral profile',
        'The Profile tab shows the lateral profile of the field with a data table, and Download CSV saves the numbers.',
      ],
      [
        'Phase arrangement',
        'The Phasing tab compares the 36 phase arrangements of a double circuit in six symmetry classes. For a single circuit the button Switch to a double circuit tower changes the tower, Apply moves an arrangement to the view, and the section Why the best arrangement wins explains the winner through the dipole moments that cancel.',
      ],
      [
        'The 3D views',
        'The tabs Volume, Isosurfaces and Field lines show the field in space: a volume rendering, surfaces of constant value and field lines animated over the cycle. Orbit the camera with the mouse. The views need WebGPU and the 3D charge simulation model.',
      ],
      [
        'Changing the geometry',
        'In the panel change Tower type, Number of spans, the sag, the voltages and the phasing. The field updates at once, and a change of voltage, angle or phasing does not repeat the LU factorization.',
      ],
      [
        'Exposure levels and a link',
        'The Emphasised standard list switches the contours between ICNIRP 2010, ICNIRP 1998 with Council Recommendation 1999/519/EC and the Polish limits, and you can edit the levels too. The address holds the whole state, and the question mark opens a help dialog where single-key shortcuts can be turned off.',
      ],
    ],
    calls: [
      {
        name: 'A 3D field from a hanging conductor.',
        text: 'Conductors are catenaries, so the line is not a set of infinite parallel wires. Each conductor is cut into straight segments with uniform charge, the charges follow from matching the potential at one collocation point per segment, and the field comes from closed-form expressions for finite segments and their ground images. The matrix depends on the geometry only, so it is factored once with a real LU and every change of voltage, angle or phasing reuses the factors.',
        cost: 'The cost: the potential residual on the conductor surface is 0.27 to 0.42 percent inside the spans and up to 1.8 percent where the conductor kinks at a tower. The field converges faster than the surface potential (0.36 percent between 12 and 48 segments), but shorter segments next to the towers would reduce the residual.',
        lost: 'What lost: a complex LU (twice the memory and about four times the arithmetic, while the real factors serve both parts of a complex right-hand side), Cholesky (the 3D collocation matrix is not exactly symmetric), an iterative GMRES (for a few hundred unknowns a direct solve is faster and has no convergence question) and a Galerkin formulation (a symmetric matrix, but numerical integration over pairs of segments).',
        adr: ['ADR 0002', adr('0002-charge-simulation-with-a-real-lu-factored-once')],
      },
      {
        name: 'Float32 on the GPU.',
        text: 'A coordinate 450 m from the origin has a float32 spacing of 3e-5 m, which is 0.02 percent of the clamp radius. So segment ends and evaluation points are subtracted from the centre of the region in float64 on the CPU, and only the differences go to the shaders. The distance to the axis is clamped to the conductor radius, so the field is finite and continuous on the surface, and the same rule runs in the 2D model, the 3D model, the GPU kernels and the field line tracer.',
        cost: 'The cost: the error in the clamp zone is 6.5e-4 against a target of 1e-3, a factor of 1.5. Outside the clamp zone it is below 1.2e-4. Very large grids would need one origin per tile.',
        lost: 'What lost: evaluating on the GPU in world coordinates (the error would show in the field next to a conductor), float32 emulation on the CPU to predict the GPU error (it would not include driver differences) and one kernel with the layout as a runtime switch (every invocation would carry the branches of the other layouts).',
        adr: ['ADR 0022', adr('0022-field-backends-and-gpu-evaluation')],
      },
      {
        name: 'Knowing the numbers are right.',
        text: 'Every layer is checked against something outside itself: the analytic solution of a conductor above ground, the 2D model that the 3D result must approach as the span grows, mirrored phasing, a published study of limit heights and the float64 code for the GPU. The study is Bendík, Cenký and Eleschová, Electricity 2026, 7(2), 39 (CC BY 4.0), and the 2D model reproduces 13 of its 14 limit heights. The remaining case, the Portal tower, is fitted and marked as such, because its phase spacing cannot be read reliably from the schematic.',
        cost: 'The cost: the study covers 2D (clearance heights in a mid-span cross-section), so the 3D model has no published reference, and its checks are the convergence to 2D and the analytic cases. My limit heights come out 0.014 to 0.028 m below the published ones in every case, and I did not isolate the cause.',
        lost: 'What lost: an invented reference profile, a comparison with a commercial tool whose result is not openly published and reproducing only one tower (fourteen arrangements test geometry handling and phasing together).',
        adr: ['ADR 0017', adr('0017-validation-against-a-published-reference')],
      },
    ],
    numbers: [
      [
        '6.5e-4',
        'Largest relative error of E from the float32 shaders against the float64 code, worst in the clamp zone, over ground grids, volumes, profiles and a probe that starts on a conductor axis, on three towers. B: 1.6e-4. The same result on three adapters: the RTX 3070 Ti Laptop, the Iris Xe and the SwiftShader software adapter. Target: 1e-3.',
      ],
      [
        '50 ms',
        'Median from a geometry change on the horizontal tower to the published frame on an RTX 3070 Ti Laptop (p95 60 ms). The worst case on the real GPUs is the double circuit at 124 ms (p95 141). Target: a median under 200 ms. The LU factorization with the basis solves takes 10.0 ms at 210 unknowns and 30.8 ms at 336 in Node 24.21.0, with 12 segments per span.',
      ],
      [
        '0.999999',
        'Ratio of the peak E at mid-span in the 3D model to the 2D model for a straight line with an 800 m span (B: 0.999972). With the default spans E is 0.9936 to 0.9972 and B is 0.9873 to 0.9890 across the three towers.',
      ],
      [
        '13 of 14',
        'Limit heights of a published 420 kV study reproduced within 0.014 to 0.028 m below the value in the paper (mean 0.022 m). One case is fitted and marked. The ranking of phase arrangements: 0 violations against the paper.',
      ],
      [
        '8 ms',
        'Median frame interval in almost every view on both real GPUs, p95 below 9 ms, at 1920 by 1080, 300 requestAnimationFrame callbacks per view. That is the frame clock of the headless browser, which I did not measure separately, so the number shows that the views fit inside it and says nothing about how much faster they could run. The exception is the E field lines on the Iris Xe: 15.6 ms (64 frames per second).',
      ],
      [
        '902',
        'Unit tests in 104 files, 90 script tests and 108 end-to-end tests. Line coverage: 99.3% in the core (2,410 of 2,426), 100% in the GPU code and the workers, 82.2% in the app. Lighthouse: accessibility, best practices and SEO at 1 in both renderers, on mobile and desktop, and performance between 0.76 and 1 on the software adapter.',
      ],
    ],
    machine:
      'Measured on 2026-10-11 on one laptop: an Intel Core i7-12700H (20 logical cores), Linux 6.6.87.2 under WSL2, Node 24.21.0. The software numbers (SwiftShader, the CPU backend) come from Chromium 156.0.8078.4 on that machine. The real GPU numbers come from the Windows host of the same laptop, through headless Chrome 154.0.8037.98 with the production build served from WSL: an NVIDIA GeForce RTX 3070 Ti Laptop (Ampere) and an Intel Iris Xe (Gen 12LP). I did not measure a mid-range desktop GPU, so I make no claim about one.',
    gapsLead:
      'From the stretch list I built none of the three: Deri’s complex image depth for earth return currents, terrain with a slope and two parallel lines in a corridor.',
    gaps: [
      [
        'Earth return and shield wires',
        'Earth return and shield wire currents are ignored. Balanced currents leave no net return, and the estimate for an unbalanced remainder is 0.2 µT at the ground for a full 1000 A. Currents induced in the shield wires would lower B a little, so leaving them out errs high.',
      ],
      [
        'One line, flat ground',
        'Two parallel lines in a corridor and sloped terrain are not built. The first needs its own solve measurements, the second breaks the image method.',
      ],
      [
        'Charge discretization',
        'The potential residual is up to 1.8 percent where a conductor kinks at a tower. Shorter segments next to the towers would reduce it.',
      ],
      [
        'The CPU path',
        'Full quality updates take 263 to 429 ms on the CPU backend (median). Only the draft quality drag is under 200 ms.',
      ],
      [
        'One laptop',
        'Two real GPUs (a high-end laptop part and an integrated one) on the same machine, and one browser engine, Chromium. Firefox and Safari were not tested, and I would like numbers from a mid-range discrete GPU.',
      ],
      [
        'Dashed contours on the GPU',
        'The GPU contour dashes follow the dominant axis of the gradient, so on very steep contours the dash length is not exactly constant.',
      ],
    ],
    next: 'First Deri’s complex image for earth return, then shorter segments next to the towers to reduce the potential residual, then measurements on a mid-range discrete GPU.',
    gapsAdr: ['ADR 0025: the extras left out', adr('0025-stretch-goals-left-out')],
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
      'WCAG 2.1',
      'Keyboard support',
    ],
  },
};

export default fieldline;
