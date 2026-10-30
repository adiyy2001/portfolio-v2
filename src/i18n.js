export const routes = {
  home: { pl: '/', en: '/en/' },
  rec: { pl: '/dla-rekrutera/', en: '/en/for-recruiters/' },
  cli: { pl: '/dla-klienta/', en: '/en/for-clients/' },
  work: { pl: '/archive/', en: '/en/archive/' },
  case: { pl: '/archive/tailorcloth/', en: '/en/archive/tailorcloth/' },
  flagtide: { pl: '/archive/flagtide/', en: '/en/archive/flagtide/' },
  gridtwin: { pl: '/archive/gridtwin/', en: '/en/archive/gridtwin/' },
  coschema: { pl: '/archive/coschema/', en: '/en/archive/coschema/' },
  'signal-timeline': { pl: '/archive/signal-timeline/', en: '/en/archive/signal-timeline/' },
  eventhorizon: { pl: '/archive/eventhorizon/', en: '/en/archive/eventhorizon/' },
  fieldline: { pl: '/archive/fieldline/', en: '/en/archive/fieldline/' },
  services: { pl: '/uslugi/', en: '/en/services/' },
  'svc-apps': { pl: '/uslugi/aplikacje-webowe/', en: '/en/services/web-applications/' },
  'svc-sites': { pl: '/uslugi/strony-internetowe/', en: '/en/services/websites/' },
  'svc-flow': { pl: '/uslugi/automatyzacja-procesow/', en: '/en/services/process-automation/' },
  'svc-integ': { pl: '/uslugi/integracje-ksef/', en: '/en/services/integrations-ksef/' },
  'svc-bot': { pl: '/uslugi/asystent-ai/', en: '/en/services/ai-assistant/' },
  'svc-wcag': { pl: '/uslugi/dostepnosc-wcag/', en: '/en/services/wcag-accessibility/' },
  'svc-care': { pl: '/uslugi/utrzymanie/', en: '/en/services/maintenance/' },
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
    footerServices: 'Usługi',
    footerPrivacy: 'Prywatność',
    footerScan: 'Skaner dostępności',
    footerScanTerms: 'Regulamin skanera',
    footerConsent: 'Ustawienia statystyk',
    words: {
      home: 'Na miarę',
      rec: 'dla rekrutera',
      cli: 'dla klienta',
      work: 'projekty',
      case: 'TailorCloth',
      flagtide: 'flagtide',
      gridtwin: 'gridtwin',
      coschema: 'coschema',
      'signal-timeline': 'signal-timeline',
      eventhorizon: 'eventhorizon',
      fieldline: 'fieldline',
      blog: 'blog',
      brief: 'brief',
      guide: 'poradnik',
      services: 'usługi',
      'svc-apps': 'aplikacje',
      'svc-sites': 'strony',
      'svc-flow': 'automatyzacje',
      'svc-integ': 'integracje i KSeF',
      'svc-bot': 'asystent AI',
      'svc-wcag': 'dostępność',
      'svc-care': 'utrzymanie',
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
    footerServices: 'Services',
    footerPrivacy: 'Privacy',
    footerConsent: 'Statistics settings',
    words: {
      home: 'Made to measure',
      rec: 'for recruiters',
      cli: 'for clients',
      work: 'projects',
      case: 'TailorCloth',
      flagtide: 'flagtide',
      gridtwin: 'gridtwin',
      coschema: 'coschema',
      'signal-timeline': 'signal-timeline',
      eventhorizon: 'eventhorizon',
      fieldline: 'fieldline',
      blog: 'blog',
      brief: 'website brief',
      guide: 'guide',
      services: 'services',
      'svc-apps': 'web apps',
      'svc-sites': 'websites',
      'svc-flow': 'automation',
      'svc-integ': 'integrations and KSeF',
      'svc-bot': 'AI assistant',
      'svc-wcag': 'accessibility',
      'svc-care': 'upkeep',
    },
  },
};

export const blogPath = '/blog/';

export const guidePath = '/poradnik/';

export const briefPath = '/en/website-brief/';

export const privacyPath = { pl: '/polityka-prywatnosci/', en: '/en/privacy/' };
export const termsPath = { en: '/en/terms/' };

export const scanPath = '/skaner/';
export const scanTermsPath = '/regulamin-skanera/';
export const scanPrivacyPath = '/polityka-prywatnosci/#skaner';

export function locate(path) {
  for (const view of Object.keys(routes)) {
    for (const lang of ['pl', 'en']) {
      if (routes[view][lang] === path) return { lang, view };
    }
  }
  if (path === briefPath) return { lang: 'en', view: 'brief' };
  if (path.startsWith(blogPath)) return { lang: 'en', view: 'blog' };
  if (path.startsWith(guidePath)) return { lang: 'pl', view: 'guide' };
  return { lang: path.startsWith('/en/') ? 'en' : 'pl', view: null };
}

const orphan = /(^|\s)([A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż])\s/g;

export function tie(text) {
  return text.replace(orphan, '$1$2 ').replace(orphan, '$1$2 ');
}
