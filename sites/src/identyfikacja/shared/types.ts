import type { IdentitySlug } from '../../shared/sites';

export interface BrandMeta {
  slug: IdentitySlug;
  name: string;
  themeColor: string;
  ogAlt: string;
  tagline: string;
}

export interface ManifestFile {
  path: string;
  bytes: number;
  type: string;
  group: string;
  width?: number;
  height?: number;
  pages?: number;
  duration?: number;
  sizes?: number[];
}

export interface ManifestGroup {
  id: string;
  title: string;
  count: number;
  bytes: number;
  formats: string;
  files: string[];
}

export interface ManifestColor {
  id: string;
  name: string;
  group: 'primary' | 'accent' | 'neutral';
  role: string;
  hex: string;
  rgb: string;
  oklch: string;
  cmykApprox: string;
}

export interface ManifestContrast {
  id: string;
  use: string;
  foreground: string;
  background: string;
  kind: 'text' | 'large' | 'ui' | 'decorative';
  ratio: number;
  required: number;
  level: string;
  pass: boolean;
  note: string | null;
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
  brand: {
    slug: string;
    name: string;
    style: string;
    styleId: string;
    trade: string;
    city: string;
  };
  base: string;
  totalBytes: number;
  totalHuman: string;
  zip: { path: string; bytes: number } | null;
  groups: ManifestGroup[];
  files: ManifestFile[];
  palette: ManifestColor[];
  contrast: ManifestContrast[];
  fonts: ManifestFont[];
}

export interface RejectedDirection {
  id: string;
  title: string;
  text: string;
  reason: string;
  thumb: string;
}

export interface ToneRule {
  title: string;
  text: string;
  yes: string;
  no: string;
}

export interface Application {
  id: string;
  title: string;
  caption: string;
  image: string;
  alt: string;
}

export interface CaseContent {
  lead: string;
  client: { paragraphs: string[]; facts: [string, string][] };
  direction: { title: string; paragraphs: string[]; keywords: string[] };
  strategy: {
    audience: string;
    values: { title: string; text: string }[];
    personality: string[];
    avoids: string;
    positioning: string;
  };
  process: {
    intro: string;
    rejected: RejectedDirection[];
    chosen: { title: string; reason: string };
    refinement: { title: string; text: string }[];
  };
  tone: ToneRule[];
  applications: Application[];
  deliverables: { intro: string; note: string };
  cta: { title: string; text: string };
}
