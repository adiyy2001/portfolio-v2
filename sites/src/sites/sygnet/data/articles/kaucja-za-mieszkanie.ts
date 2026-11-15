import type { Article } from './types';

export const kaucjaZaMieszkanie: Article = {
  slug: 'kaucja-za-mieszkanie',
  title: 'Kaucja za wynajmowane mieszkanie: ile, kiedy zwrot i co można potrącić',
  metaTitle: 'Kaucja za mieszkanie: zwrot i potrącenia',
  description:
    'Ile może wynosić kaucja przy najmie mieszkania, kiedy wynajmujący musi ją zwrócić i na jakie należności może ją zaliczyć. Zasady dla najemców i właścicieli.',
  lead: 'Kaucja jest zabezpieczeniem dla wynajmującego, ale należy do najemcy, dopóki nie pokryje długu. Opisujemy, ile może wynosić, kiedy trzeba ją oddać i co zrobić, gdy wynajmujący jej nie zwraca.',
  published: '2026-11-11',
  authorSlug: 'marek-zawada',
  areaSlug: 'umowy',
  blocks: [
    {
      type: 'note',
      title: 'Stan prawny: listopad 2026',
      text: 'Tekst jest ogólną informacją o najmie lokali mieszkalnych i nie zastępuje porady w konkretnej sprawie. Wiele zależy od treści umowy, którą podpisaliście.',
    },
    { type: 'h2', text: 'Po co jest kaucja i ile może wynosić' },
    {
      type: 'p',
      text: 'Kaucja zabezpiecza roszczenia wynajmującego związane z najmem: zaległy czynsz, opłaty za media i szkody w lokalu. Ustawa o ochronie praw lokatorów ogranicza jej wysokość do dwunastokrotności miesięcznego czynszu. Jeśli umowa przewiduje więcej, najemca może domagać się zwrotu nadwyżki.',
    },
    {
      type: 'p',
      text: 'Kaucja nie jest czynszem ani opłatą za wynajem. To pieniądze najemcy, które wynajmujący trzyma na wypadek długu. Jeśli strony chcą zaliczyć ją na ostatni miesiąc najmu, powinny to ustalić wprost w umowie.',
    },
    { type: 'h2', text: 'Kiedy trzeba ją zwrócić' },
    {
      type: 'p',
      text: 'Wynajmujący zwraca kaucję w ciągu miesiąca od dnia opróżnienia lokalu. Zwraca się ją w kwocie zwaloryzowanej, więc po długim najmie suma może być wyższa niż wpłacona.',
    },
    {
      type: 'p',
      text: 'Miesiąc liczy się od chwili, gdy najemca wydał mieszkanie i oddał klucze. Dlatego warto sporządzić protokół zdawczo-odbiorczy z datą i stanem liczników, a najlepiej zrobić też zdjęcia lokalu.',
    },
    { type: 'h2', text: 'Co wynajmujący może potrącić' },
    {
      type: 'p',
      text: 'Wynajmujący może zaliczyć na poczet kaucji należności, które wynikają z najmu i które potrafi wykazać. Zazwyczaj chodzi o:',
    },
    {
      type: 'ul',
      items: [
        'zaległy czynsz i opłaty, w tym rozliczenie mediów według liczników,',
        'szkody, które wykraczają poza normalne zużycie lokalu, na przykład zniszczone drzwi czy rozbite okno,',
        'koszt usunięcia rzeczy, które najemca zostawił w mieszkaniu.',
      ],
    },
    {
      type: 'p',
      text: 'Za normalne zużycie najemca nie płaci. Wytarta podłoga po kilku latach mieszkania, lekko pożółkłe ściany albo drobne ślady po meblach zwykle do niego należą. Spory dotyczą najczęściej tego, czy konkretna szkoda jest normalnym zużyciem, czy uszkodzeniem.',
    },
    {
      type: 'table',
      caption: 'Przykłady szkód i ich zwykła ocena',
      head: ['Stan lokalu', 'Zwykle ocena'],
      rows: [
        ['Wytarta farba przy drzwiach po kilku latach', 'Normalne zużycie'],
        ['Zarysowana podłoga pod meblami', 'Normalne zużycie'],
        ['Wypalona dziura w blacie', 'Szkoda'],
        ['Rozbita szyba w oknie', 'Szkoda'],
        ['Plama po zalaniu wodą z winy najemcy', 'Szkoda'],
      ],
    },
    {
      type: 'p',
      text: 'To tylko ogólny podział, a ocena w konkretnej sprawie zależy od zdjęć, protokołu i opisu w umowie.',
    },
    { type: 'h2', text: 'Gdy wynajmujący nie oddaje kaucji' },
    {
      type: 'p',
      text: 'Pierwszym krokiem jest pisemne wezwanie do zapłaty, w którym najemca podaje kwotę i termin, na przykład siedem dni. Wezwanie wysyła się tak, żeby dało się udowodnić jego odbiór: listem poleconym albo e-mailem na adres z umowy. Jeśli to nie pomaga, najemca może wnieść pozew do sądu.',
    },
    {
      type: 'p',
      text: 'Zwlekać nie warto. Zgodnie z art. 677 Kodeksu cywilnego roszczenia wynajmującego o naprawienie szkody z powodu uszkodzenia lub pogorszenia lokalu przedawniają się z upływem roku od dnia zwrotu lokalu. Ten sam termin dotyczy roszczeń najemcy o zwrot nakładów na lokal i o zwrot nadpłaconego czynszu. Roszczenie o samą kaucję podlega ogólnym terminom przedawnienia, więc daty oddania kluczy i wysłania wezwania warto mieć udokumentowane, a spór o stan mieszkania zamknąć w ciągu roku od zwrotu.',
    },
    { type: 'h2', text: 'Co zrobić przy podpisywaniu umowy' },
    {
      type: 'ol',
      items: [
        'Sprawdź, ile wynosi kaucja i czy mieści się w limicie dwunastu czynszów.',
        'Zapisz w umowie, kiedy i jak kaucja zostanie zwrócona.',
        'Zrób zdjęcia lokalu przed wprowadzeniem się i dołącz je do protokołu.',
        'Spisz stan liczników z datą, zanim klucze zmienią właściciela.',
        'Zachowaj potwierdzenie wpłaty kaucji.',
      ],
    },
    {
      type: 'p',
      text: 'Jak przygotowujemy i sprawdzamy umowy najmu, opisujemy w dziale [Umowy](/sygnet/specjalizacje/umowy/), a o cenach piszemy w [honorarium](/sygnet/honorarium/). Jeśli masz konkretny spór o kaucję, napisz przez [formularz](/sygnet/kontakt/).',
    },
  ],
};
