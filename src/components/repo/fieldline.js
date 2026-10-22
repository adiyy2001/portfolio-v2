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
    note: 'Widoki 3D wymagają WebGPU, a bez niego działa ścieżka na procesorze z grubszą siatką. Interfejs demo jest po angielsku.',
    why: [
      'Pracuję nad oprogramowaniem dla stacji wysokiego napięcia, a pytanie, które wraca, brzmi: jak silne jest pole pod linią, gdy przebiega blisko domów. Chciałem policzyć to porządnie, zobaczyć jego trójwymiarowy kształt i sprawdzić liczby z rozwiązaniami analitycznymi zamiast ufać obrazkowi.',
      'To także poważny projekt obliczeniowy w WebGPU. Liczenie pola, marching cubes i śledzenie linii pola to shadery obliczeniowe, a wersja tej samej matematyki w TypeScripcie w float64 jest referencją, z którą są testowane.',
    ],
    tryLead: 'Demo ma sześć widoków w zakładkach i panel parametrów linii.',
    features: [
      [
        'Pole przy ziemi',
        'Zakładka Ground pokazuje pole E albo B na wysokości 1 lub 1,8 m z konturami poziomów ekspozycji. Klawisze E i B przełączają pole, a Space animuje cykl.',
      ],
      [
        'Wykres poprzeczny',
        'Zakładka Profile pokazuje profil poprzeczny pola z tabelą danych i zapisem do CSV.',
      ],
      [
        'Układ faz',
        'Zakładka Phasing porównuje 36 układów faz podwójnego obwodu w sześciu klasach symetrii i tłumaczy zwycięzcę momentami dipolowymi, które się znoszą.',
      ],
      [
        'Widoki 3D',
        'Zakładki Volume, Isosurfaces i Field lines pokazują pole w przestrzeni: przekrój objętościowy, powierzchnie stałej wartości i animowane linie pola.',
      ],
      [
        'Zmiana geometrii',
        'W panelu zmień Tower type, Number of spans, zwis, napięcia i układ faz. Pole przelicza się od razu.',
      ],
      [
        'Poziomy ekspozycji',
        'Lista Emphasised standard przełącza kontury między ICNIRP 2010, ICNIRP 1998 i polskimi limitami, a adres strony trzyma cały stan widoku.',
      ],
    ],
    calls: [
      {
        name: 'Pole 3D z wiszącego przewodu.',
        text: 'Przewody to krzywe łańcuchowe, a nie nieskończone równoległe druty. Każdy przewód jest cięty na proste odcinki ze stałym ładunkiem, ładunki wynikają z dopasowania potencjału w jednym punkcie kolokacji na odcinek, a pole z zamkniętych wzorów. Macierz zależy tylko od geometrii, więc jest raz rozkładana na czynniki LU w liczbach rzeczywistych, a każda zmiana napięcia, kąta czy układu faz używa tych samych czynników.',
        cost: 'Cena: odchyłka potencjału na powierzchni przewodu to 0,27 do 0,42 procent w przęsłach i do 1,8 procent tam, gdzie przewód załamuje się na słupie.',
        lost: 'Przegrały: zespolone LU (dwa razy więcej pamięci), Cholesky (macierz kolokacji 3D nie jest dokładnie symetryczna), iteracyjny GMRES i sformułowanie Galerkina.',
        adr: ['ADR 0002', adr('0002-charge-simulation-with-a-real-lu-factored-once')],
      },
      {
        name: 'Float32 na GPU.',
        text: 'Współrzędna 450 m od początku układu ma odstęp float32 równy 3e-5 m, czyli 0,02 procent promienia obcięcia. Dlatego końce odcinków i punkty obliczeń są odejmowane od środka regionu w float64 na procesorze i do shaderów trafiają tylko różnice.',
        cost: 'Cena: błąd w strefie obcięcia to 6,5e-4 wobec celu 1e-3, czyli zapas półtora raza. Poza nią błąd jest poniżej 1,2e-4.',
        lost: 'Przegrały: liczenie na GPU we współrzędnych świata (błąd byłby widoczny przy przewodzie) i emulacja float32 na procesorze (nie obejmie różnic sterowników).',
        adr: ['ADR 0022', adr('0022-field-backends-and-gpu-evaluation')],
      },
      {
        name: 'Skąd wiadomo, że liczby są dobre.',
        text: 'Każda warstwa jest sprawdzana względem czegoś spoza siebie: rozwiązania analitycznego, modelu 2D, do którego musi dążyć wynik 3D, opublikowanego badania wysokości granicznych i kodu float64, z którym porównuję GPU. Badanie to Bendík, Cenký i Eleschová, Electricity 2026, 7(2), 39 (CC BY 4.0), a model 2D odtwarza 13 z jego 14 przypadków. Czternasty, słup Portal, jest dopasowany i tak oznaczony.',
        cost: 'Cena: badanie dotyczy 2D, więc model 3D nie ma publikowanej referencji, a sprawdzam go zbieżnością do 2D. Moje wysokości graniczne wychodzą od 0,014 do 0,028 m poniżej opublikowanych i nie ustaliłem przyczyny.',
        lost: 'Przegrały: wymyślony profil referencyjny i porównanie z komercyjnym narzędziem.',
        adr: ['ADR 0017', adr('0017-validation-against-a-published-reference')],
      },
    ],
    numbers: [
      [
        '6,5e-4',
        'Największy względny błąd E w shaderach float32 wobec kodu float64, w strefie obcięcia. Ten sam na RTX 3070 Ti Laptop, Iris Xe i SwiftShader, a dla B od 1,5e-4 do 1,6e-4. Cel: 1e-3.',
      ],
      [
        '50 ms',
        'Mediana od zmiany geometrii słupa poziomego do pokazania klatki na RTX 3070 Ti Laptop. Najgorzej wypada podwójny obwód: 124 ms. Cel: mediana poniżej 200 ms.',
      ],
      [
        '0,999999',
        'Stosunek szczytowego E w środku przęsła w modelu 3D do modelu 2D dla prostej linii z przęsłem 800 m. Przy domyślnych przęsłach od 0,9936 do 0,9972 na trzech słupach.',
      ],
      [
        '13 z 14',
        'Przypadków z opublikowanego badania linii 420 kV odtworzonych w modelu 2D (26 z 28 wysokości granicznych), od 0,014 do 0,028 m poniżej wartości z artykułu. Jeden przypadek jest dopasowany i oznaczony.',
      ],
      [
        '8 ms',
        'Mediana odstępu między klatkami w prawie każdym widoku na obu sprzętowych GPU w 1920 na 1080. To zegar klatek przeglądarki headless, więc liczba mówi tylko, że widoki się w nim mieszczą. Wyjątek: linie pola E na Iris Xe, 15,6 ms.',
      ],
      [
        '902',
        'Testów jednostkowych, 90 testów skryptów i 108 testów end to end. Pokrycie linii: 99,3% w rdzeniu i 82,2% w aplikacji. Lighthouse: dostępność, dobre praktyki i SEO po 100. Wydajność od 76 do 89 na adapterze programowym i od 93 do 100 na ścieżce procesora.',
      ],
    ],
    machine:
      'Pomiary z 2026-10-11 na jednym laptopie: Intel Core i7-12700H pod WSL2. Liczby programowe (SwiftShader, backend na procesorze) pochodzą z Chromium 156, liczby z GPU z headless Chrome 154 na Windowsie: NVIDIA GeForce RTX 3070 Ti Laptop i Intel Iris Xe. Nie mierzyłem średniej klasy karty stacjonarnej.',
    gapsLead:
      'Z listy dodatków nie zbudowałem żadnego z trzech: obrazu zespolonego Deriego dla prądów powrotnych przez ziemię, terenu z nachyleniem i dwóch równoległych linii w jednym korytarzu.',
    gaps: [
      [
        'Ziemia i przewody odgromowe',
        'Prądy powrotne przez ziemię i prądy w przewodach odgromowych są pominięte. Dla niezrównoważonej reszty równej pełnym 1000 A oszacowanie daje 0,2 µT przy ziemi, a pominięcie przewodów odgromowych zawyża B.',
      ],
      [
        'Jedna linia, płaski teren',
        'Dwie równoległe linie wymagałyby nowych pomiarów, a teren z nachyleniem łamie metodę obrazów.',
      ],
      [
        'Ścieżka na procesorze',
        'Pełna aktualizacja na backendzie procesora trwa od 241 do 429 ms w medianie. Poniżej 200 ms mieści się tylko przeciąganie w jakości roboczej.',
      ],
      [
        'Jeden laptop',
        'Dwa sprzętowe GPU na jednej maszynie i jeden silnik przeglądarki, Chromium. Nie testowałem Firefoksa ani Safari.',
      ],
      [
        'Przerywane kontury na GPU',
        'Kreski konturów na GPU idą wzdłuż dominującej osi gradientu, więc na bardzo stromych konturach ich długość nie jest dokładnie stała.',
      ],
    ],
    next: 'Trzy rzeczy: obraz zespolony Deriego dla prądów powrotnych przez ziemię, krótsze segmenty przy słupach i pomiary na średniej klasy dyskretnym GPU.',
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
    lead: 'Real-time 3D visualization of the electric and magnetic fields around overhead high-voltage lines, computed on the GPU with WebGPU. It includes exposure contours, lateral profiles and a phase-arrangement optimizer.',
    clip: 'Field lines over one 50 Hz cycle, the ground field with exposure contours, a phasing change and the lateral profile.',
    note: 'The 3D views need WebGPU, and without it a CPU path with a coarser grid takes over. The demo interface is in English.',
    why: [
      'I work on software for high-voltage substations. A recurring question is how strong the field under a line is when it passes near homes. I wanted to calculate it properly, see the 3D shape of the field and check the numbers against analytic solutions instead of trusting a picture.',
      'This is also a serious WebGPU compute project. Field evaluation, marching cubes and the field line tracer are compute passes, and a float64 TypeScript implementation of the same math is the reference they are tested against.',
    ],
    tryLead: 'The demo has six views in tabs and a panel with the line parameters.',
    features: [
      [
        'The field at ground level',
        'The Ground tab shows the E or the B field at 1 or 1.8 m above ground with exposure contours. The keys E and B switch the field, and Space animates the cycle.',
      ],
      [
        'A lateral profile',
        'The Profile tab shows the lateral profile with a data table and a CSV download.',
      ],
      [
        'Phase arrangement',
        'The Phasing tab compares the 36 phase arrangements of a double circuit in six symmetry classes and explains the winner by the dipole moments that cancel.',
      ],
      [
        'The 3D views',
        'The tabs Volume, Isosurfaces and Field lines show the field in space: a volume slice, surfaces of constant value and animated field lines.',
      ],
      [
        'Changing the geometry',
        'In the panel change Tower type, Number of spans, the sag, the voltages and the phasing.',
      ],
      [
        'Exposure levels',
        'The Emphasised standard list switches the contours between ICNIRP 2010, ICNIRP 1998 and the Polish limits, and the address holds the whole state of the view.',
      ],
    ],
    calls: [
      {
        name: 'A 3D field from a hanging conductor.',
        text: 'Conductors are modeled as catenaries, not infinite parallel wires. Each conductor is segmented into straight pieces with uniform charge, and the charges come from matching the potential at one collocation point per segment. The field is computed from closed-form expressions. The matrix depends on geometry only, so it is factored once with a real LU decomposition, and every voltage or phasing change reuses the factors.',
        cost: 'The cost: the potential residual on the conductor surface is 0.27 to 0.42 percent within the spans and up to 1.8 percent where the conductor kinks at a tower.',
        lost: 'What lost: a complex LU (twice the memory), Cholesky (the 3D collocation matrix is not exactly symmetric), an iterative GMRES and a Galerkin formulation.',
        adr: ['ADR 0002', adr('0002-charge-simulation-with-a-real-lu-factored-once')],
      },
      {
        name: 'Float32 on the GPU.',
        text: 'A coordinate 450 m away from the origin has a float32 spacing of 3e-5 m, which is 0.02 percent of the clamp radius. So segment ends and evaluation points get subtracted from the centre of the region in float64 on the CPU, and only the differences are passed to the shaders.',
        cost: 'The cost: the error in the clamp zone is 6.5e-4 against a target of 1e-3, a factor of 1.5. Away from the clamp zone, the error is below 1.2e-4.',
        lost: 'Lost: GPU-side evaluation in world coordinates (the error would appear next to a conductor) and float32 emulation on the CPU (it would not account for driver differences).',
        adr: ['ADR 0022', adr('0022-field-backends-and-gpu-evaluation')],
      },
      {
        name: 'Knowing the numbers are right.',
        text: 'Every layer is validated against something external to itself: an analytic solution, the 2D model that the 3D result must approach, a published paper on limit heights and the float64 code the GPU is compared with. The paper is Bendík, Cenký and Eleschová, Electricity 2026, 7(2), 39 (CC BY 4.0), and the 2D model reproduces 13 of its 14 cases. The fourteenth, the Portal tower, is fitted and labeled.',
        cost: 'The limitation: the study is only in 2D, so the 3D model has no published reference, and I validate it through its convergence to 2D. My limit heights are 0.014 to 0.028 m lower than the published ones, and I have not isolated why.',
        lost: 'What lost: an invented reference profile and a comparison with a commercial tool.',
        adr: ['ADR 0017', adr('0017-validation-against-a-published-reference')],
      },
    ],
    numbers: [
      [
        '6.5e-4',
        'Largest relative error of E from the float32 shaders against the float64 code, in the clamp zone. The same on the RTX 3070 Ti Laptop, the Iris Xe and SwiftShader, and 1.5e-4 to 1.6e-4 for B. Target: 1e-3.',
      ],
      [
        '50 ms',
        'Median from a geometry change on the horizontal tower to the frame shown on an RTX 3070 Ti Laptop. The worst case is the double circuit at 124 ms. Target: a median under 200 ms.',
      ],
      [
        '0.999999',
        'Ratio of the peak E at mid-span in the 3D model to the 2D model for a straight line with an 800 m span. With the default spans it is 0.9936 to 0.9972 across the three towers.',
      ],
      [
        '13 of 14',
        'Cases of a published 420 kV study reproduced by the 2D model (26 of 28 limit heights), 0.014 to 0.028 m below the paper. One case is fitted and marked.',
      ],
      [
        '8 ms',
        'Median frame interval in almost every view on both real GPUs at 1920 by 1080. It is the frame clock of the headless browser, so it only shows that the views fit inside it. The exception: the E field lines on the Iris Xe, 15.6 ms.',
      ],
      [
        '902',
        'Unit tests, 90 script tests and 108 end-to-end tests, with line coverage of 99.3% in the core and 82.2% in the app. Lighthouse accessibility, best practices and SEO are 100. Performance is 76 to 89 on the software adapter and 93 to 100 on the CPU path.',
      ],
    ],
    machine:
      'Measured on 2026-10-11 on one laptop: an Intel Core i7-12700H under WSL2. The software numbers (SwiftShader, the CPU backend) come from Chromium 156, the GPU numbers from headless Chrome 154 on Windows: an NVIDIA GeForce RTX 3070 Ti Laptop and an Intel Iris Xe. I did not measure a mid-range desktop GPU.',
    gapsLead:
      'From the stretch list I built none of the three: Deri’s complex image for earth return, sloped terrain and two parallel lines in a corridor.',
    gaps: [
      [
        'Earth return and shield wires',
        'Earth return and shield wire currents are neglected. The estimate for an unbalanced remainder of a full 1000 A gives 0.2 µT at the ground, and neglecting the shield wires overestimates B.',
      ],
      [
        'One line, flat ground',
        'Two parallel lines would need new timings, and sloped terrain breaks the image method.',
      ],
      [
        'The CPU path',
        'A full quality update on the CPU backend takes 241 to 429 ms at the median. The draft quality drag is the only one below 200 ms.',
      ],
      [
        'One laptop',
        'Two real GPUs on one machine and one browser engine, Chromium. Firefox and Safari were not tested.',
      ],
      [
        'Dashed contours on the GPU',
        'On the GPU the contour dashes follow the dominant axis of the gradient, so on very steep contours their length is not exactly constant.',
      ],
    ],
    next: 'Three things: Deri’s complex image for earth return, shorter segments next to the towers and measurements on a mid-range discrete GPU.',
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
