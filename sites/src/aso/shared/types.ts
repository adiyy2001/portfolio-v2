import type { AsoSlug } from '../apps';

export type Lang = 'pl' | 'en';

export type Store = 'appstore' | 'play' | 'ipad';

export interface CopySlot {
  id: string;
  screen: string;
  headline: string;
  subtitle?: string;
  alt: string;
}

export interface CopyText {
  screen?: string;
  headline: string;
  subtitle?: string;
  alt: string;
}

export interface AsoCopy {
  lang: Lang;
  label: string;
  app: { name: string; tagline: string };
  slots: CopySlot[];
  variantB: CopyText;
  feature: CopyText;
  ui: Record<string, unknown>;
}

export interface ManifestFile {
  path: string;
  bytes: number;
  type: string;
  group: string;
  store?: string;
  lang?: Lang;
  slot?: string;
  variant?: string;
  width?: number;
  height?: number;
}

export interface ManifestGroup {
  id: string;
  title: string;
  count: number;
  bytes: number;
  formats: string;
  files: string[];
}

export interface WebFile {
  path: string;
  bytes: number;
  width: number;
  height: number;
}

export interface ManifestFont {
  id: string;
  role: string;
  family: string;
  css: string;
  weight: number;
  style: 'normal' | 'italic';
  file: string;
  bytes: number;
}

export interface Manifest {
  app: {
    slug: AsoSlug;
    name: string;
    style: string;
    styleId: string;
    category: string;
    format: 'png' | 'jpg';
    ipad: boolean;
  };
  base: string;
  totalBytes: number;
  totalHuman: string;
  zip: { path: string; bytes: number } | null;
  groups: ManifestGroup[];
  files: ManifestFile[];
  web: WebFile[];
  fonts: ManifestFont[];
  palette: { id: string; name: string; hex: string; role: string }[];
}

export interface Shot {
  src: string;
  alt: string;
  width: number;
  height: number;
  headline: string;
  slot: string;
}

export interface AppMeta {
  slug: AsoSlug;
  name: string;
  themeColor: string;
  ogAlt: string;
}
