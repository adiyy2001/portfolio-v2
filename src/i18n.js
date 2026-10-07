export const routes = {
  home: { pl: '/', en: '/en/' },
  rec: { pl: '/dla-rekrutera/', en: '/en/for-recruiters/' },
  cli: { pl: '/dla-klienta/', en: '/en/for-clients/' },
  work: { pl: '/archive/', en: '/en/archive/' },
  case: { pl: '/archive/tailorcloth/', en: '/en/archive/tailorcloth/' },
  flagtide: { pl: '/archive/flagtide/', en: '/en/archive/flagtide/' },
  gridtwin: { pl: '/archive/gridtwin/', en: '/en/archive/gridtwin/' },
};

export const ui = {
  pl: {
    skip: 'Przejdź do treści',
    markAria: 'Adrian Turbiński, strona główna',
    edAria: 'Wersje strony',
    edFor: 'Szyte dla:',
    edRec: 'rekrutera',
    edCli: 'klienta',
    langAria: 'Język',
    footerName: 'Adrian Turbiński, Wrocław',
    footerMail: 'E-mail',
    footerWork: 'Projekty',
    words: {
      home: 'Na miarę',
      rec: 'dla rekrutera',
      cli: 'dla klienta',
      work: 'projekty',
      case: 'TailorCloth',
      flagtide: 'flagtide',
      gridtwin: 'gridtwin',
      blog: 'blog',
    },
  },
  en: {
    skip: 'Skip to content',
    markAria: 'Adrian Turbiński, home',
    edAria: 'Site editions',
    edFor: 'Cut for:',
    edRec: 'recruiters',
    edCli: 'clients',
    langAria: 'Language',
    footerName: 'Adrian Turbiński, Wrocław',
    footerMail: 'Email',
    footerWork: 'Projects',
    words: {
      home: 'Made to measure',
      rec: 'for recruiters',
      cli: 'for clients',
      work: 'projects',
      case: 'TailorCloth',
      flagtide: 'flagtide',
      gridtwin: 'gridtwin',
      blog: 'blog',
    },
  },
};

export const blogPath = '/blog/';

export function locate(path) {
  for (const view of Object.keys(routes)) {
    for (const lang of ['pl', 'en']) {
      if (routes[view][lang] === path) return { lang, view };
    }
  }
  if (path.startsWith(blogPath)) return { lang: 'en', view: 'blog' };
  return { lang: path.startsWith('/en/') ? 'en' : 'pl', view: null };
}

const orphan = /(^|\s)([A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż])\s/g;

export function tie(text) {
  return text.replace(orphan, '$1$2 ').replace(orphan, '$1$2 ');
}
