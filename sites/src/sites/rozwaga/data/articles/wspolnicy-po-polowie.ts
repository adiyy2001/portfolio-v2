import type { Article } from './types';

export const wspolnicyPoPolowie: Article = {
  slug: 'wspolnicy-po-polowie',
  title: 'Wspólnicy po połowie: co zrobić, gdy w spółce z o.o. nikt nie ma większości',
  metaTitle: 'Wspólnicy po 50 procent: impas w głosowaniach',
  description:
    'Dwóch wspólników po połowie udziałów i żadna uchwała nie przechodzi. Co mówi kodeks spółek handlowych i jak wyjść z impasu. Stan na październik 2026.',
  lead: 'Dwóch wspólników, po połowie udziałów, i jeden spór o to, dokąd iść. Spółka działa, ale żadna uchwała nie przechodzi. Oto, co mówi kodeks spółek handlowych i jakie masz wyjścia.',
  published: '2026-10-02',
  authorSlug: 'aneta-wojtynska',
  areaSlug: 'prawo-spolek',
  blocks: [
    {
      type: 'p',
      text: 'Założyliście spółkę we dwóch, każdy wniósł tyle samo i każdy dostał połowę udziałów. To naturalny podział, dopóki jesteście zgodni. Gdy przestajecie być, okazuje się, że kodeks spółek handlowych nie przewiduje, kto ma rozstrzygnąć.',
    },
    {
      type: 'note',
      title: 'W skrócie',
      text: 'Przy podziale 50 na 50 żadna uchwała nie przechodzi, a sąd nie wyłączy żadnego ze wspólników. Wyjściem jest zapis w umowie spółki, negocjacje z mediatorem albo sprzedaż udziałów jednego wspólnika drugiemu. Rozwiązanie spółki przez sąd to ostateczność.',
    },
    { type: 'h2', text: 'Dlaczego podział po połowie blokuje spółkę' },
    {
      type: 'p',
      text: 'Każdy udział daje jeden głos, chyba że umowa spółki stanowi inaczej (art. 242 KSH). Uchwała zapada bezwzględną większością głosów, czyli potrzebuje więcej niż połowy oddanych głosów (art. 245 KSH). Przy dwóch wspólnikach po 50 procent każda uchwała, której jeden z nich nie poprze, po prostu nie zapada.',
    },
    {
      type: 'p',
      text: 'W codziennej pracy spółki zwykle nie ma to znaczenia, bo bieżącymi sprawami zajmuje się zarząd. Impas wychodzi, gdy trzeba podjąć decyzję zastrzeżoną dla wspólników:',
    },
    {
      type: 'ul',
      items: [
        'zatwierdzić sprawozdanie finansowe i podzielić zysk albo go zatrzymać,',
        'powołać nowego członka zarządu albo odwołać obecnego,',
        'podwyższyć kapitał, kiedy spółce brakuje pieniędzy,',
        'zmienić umowę spółki albo sprzedać przedsiębiorstwo, co wymaga większości dwóch trzecich głosów (art. 246 KSH).',
      ],
    },
    {
      type: 'p',
      text: 'Gdy żadna z tych uchwał nie zapada przez kilka miesięcy, firma staje w miejscu: nie ma nowych inwestycji, nie ma wypłat dla wspólników, a zarząd działa na starych upoważnieniach i coraz ostrożniej.',
    },
    { type: 'h2', text: 'Czego nie załatwisz w sądzie' },
    {
      type: 'p',
      text: 'Wspólnicy często pytają, czy sąd może ich rozsądzić. W praktyce niewiele da się w ten sposób zrobić.',
    },
    {
      type: 'p',
      text: 'Sąd może wyłączyć wspólnika z ważnych przyczyn, ale tylko na żądanie wspólników, których udziały stanowią więcej niż połowę kapitału zakładowego (art. 266 KSH). Przy podziale po połowie nikt nie spełnia tego warunku, bo drugi wspólnik ma dokładnie połowę, a nie więcej. Umowa spółki może wprawdzie dać prawo pozwu mniejszej liczbie wspólników, ale też tylko tym, którzy łącznie mają ponad połowę.',
    },
    {
      type: 'p',
      text: 'Pozostaje rozwiązanie spółki przez sąd na żądanie wspólnika, gdy osiągnięcie celu spółki stało się niemożliwe albo zachodzą inne ważne przyczyny wynikające ze stosunków w spółce (art. 271 KSH). To środek ostateczny: kończy działalność firmy, a nie rozwiązuje konfliktu. Proces trwa długo i jego wynik trudno przewidzieć.',
    },
    {
      type: 'p',
      text: 'Zaskarżenie uchwały też nie pomoże, bo uchwały, która nie zapadła, nie ma czego zaskarżać.',
    },
    { type: 'h2', text: 'Co warto zapisać w umowie spółki, zanim będzie impas' },
    {
      type: 'p',
      text: 'Najtaniej jest rozwiązać ten problem na początku. Umowa spółki może przewidzieć kilka mechanizmów i nie musisz stosować wszystkich.',
    },
    {
      type: 'h3',
      text: 'Procedura sporu',
    },
    {
      type: 'p',
      text: 'Prosty zapis: jeśli uchwała nie zapadnie dwa razy z rzędu, wspólnicy mają trzydzieści dni na negocjacje, potem idą do mediatora, a jeśli to nie pomoże, spór rozstrzyga sąd polubowny albo wskazany z góry arbiter. Daje to terminy i koniec bezczynności.',
    },
    { type: 'h3', text: 'Uprzywilejowanie głosu' },
    {
      type: 'p',
      text: 'Umowa może przyznać wybranym udziałom więcej głosów, ale nie więcej niż trzy na jeden udział, i tylko dla udziałów o równej wartości nominalnej (art. 174 § 3 i 4 KSH). To przerywa symetrię, więc nadaje się raczej wtedy, gdy wspólnicy wnieśli różny wkład albo pełnią różne role.',
    },
    { type: 'h3', text: 'Sprzedaż jednego wspólnika drugiemu' },
    {
      type: 'p',
      text: 'W praktyce stosuje się klauzule typu „kup albo sprzedaj”: jeden wspólnik wskazuje cenę za wszystkie udziały, a drugi albo kupuje po tej cenie, albo sprzedaje po niej. Cena jest uczciwa, bo wskazujący nie wie, po której stronie się znajdzie. Taka klauzula wymaga dopracowania: terminów, sposobu zapłaty i tego, co ze wspólnikiem, który nie ma pieniędzy. Bez tego może zaszkodzić słabszemu finansowo.',
    },
    { type: 'h3', text: 'Ograniczenia w zbywaniu udziałów' },
    {
      type: 'p',
      text: 'Umowa może uzależnić zbycie udziałów od zgody spółki albo ograniczyć je w inny sposób (art. 182 KSH). Jeśli zgody odmówiono, sąd rejestrowy może zezwolić na sprzedaż z ważnych powodów, a spółka może wskazać innego nabywcę. Takie zapisy zabezpieczają przed obcym wspólnikiem, ale trzeba też napisać, na jakich zasadach można wyjść.',
    },
    { type: 'h2', text: 'Gdy umowa milczy: jak wyjść z impasu' },
    {
      type: 'p',
      text: 'Jeśli umowa spółki nic o tym nie mówi, zostają negocjacje. Wspólnicy rozstają się albo porozumiewają i zwykle jedno z nich wykupuje udziały drugiego. Przydatna kolejność kroków wygląda tak:',
    },
    {
      type: 'ol',
      items: [
        'Przeczytaj umowę spółki jeszcze raz, razem z uchwałami o zmianach. Sprawdź, czy nie ma w niej klauzuli o sporach, o zbywaniu udziałów albo o umorzeniu.',
        'Spisz, które decyzje są zablokowane i do kiedy trzeba je podjąć. Terminy wyznaczają, jak pilna jest sprawa.',
        'Ustal, kto i na jakiej podstawie reprezentuje spółkę. Dopóki zarząd ma mandat, spółka działa.',
        'Zaproponuj drugiemu wspólnikowi mediatora albo spotkanie z udziałem prawnika. Neutralna osoba często robi więcej niż kolejne maile.',
        'Zamów niezależną wycenę spółki, zanim zaczniecie rozmawiać o cenie. Dwie wyceny od dwóch rzeczoznawców to dwa różne punkty wyjścia.',
      ],
    },
    {
      type: 'p',
      text: 'Wykup udziałów jest zwykle tańszy niż rozwiązanie spółki, ale wymaga uzgodnienia ceny, terminów zapłaty i tego, co z zakazem konkurencji, zobowiązaniami wspólnika wobec spółki i jego poręczeniami. Sprzedaż udziałów wymaga formy pisemnej z poświadczonymi notarialnie podpisami albo, w spółce założonej przez S24, wzoru umowy w systemie (art. 180 KSH).',
    },
    {
      type: 'p',
      text: 'Czasem lepiej spółkę podzielić: jeden wspólnik zabiera część działalności i klientów do nowej firmy, drugi zostaje ze starą. To skomplikowane księgowo i podatkowo, więc wymaga doradcy podatkowego od pierwszego dnia rozmów.',
    },
    { type: 'h2', text: 'Na co uważać w trakcie sporu' },
    {
      type: 'ul',
      items: [
        'Członkowie zarządu odpowiadają wobec spółki za szkodę, którą jej wyrządzą. Nie warto podejmować kroków „na złość” drugiemu wspólnikowi.',
        'Nie podpisuj niczego pod presją terminu, także ugody ani aneksów. Poproś o dzień na przeczytanie.',
        'Zachowuj korespondencję, uchwały, protokoły i sprawozdania. Przydadzą się do wyceny i ewentualnie w sądzie.',
        'Zmień hasła i uprawnienia w systemach spółki tylko wtedy, gdy masz do tego podstawę. Odcięcie wspólnika od danych bywa uznane za naruszenie jego praw.',
      ],
    },
    {
      type: 'p',
      text: 'Wspólnicy, którzy rozstali się szybko i z rozsądnym podziałem, zwykle wspominają to lepiej niż ci, którzy przez rok walczyli o każdy podpis. Dobrze jest mieć obok kogoś, kto pomoże rozmawiać o pieniądzach, zanim wszystko zrobi się osobiste.',
    },
    {
      type: 'note',
      title: 'Uwaga',
      text: 'Ten tekst jest ogólnym omówieniem przepisów, według stanu na październik 2026. Nie zastępuje porady w konkretnej sprawie, bo umowa waszej spółki może przewidywać coś innego.',
    },
  ],
};
