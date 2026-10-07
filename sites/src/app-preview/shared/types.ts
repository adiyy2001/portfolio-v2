import type { PreviewSlug } from './apps';

export interface AppMeta {
  slug: PreviewSlug;
  name: string;
  themeColor: string;
  ogAlt: string;
}

export interface MediaInfo {
  path: string;
  bytes: number;
  width: number;
  height: number;
  fps: number;
  frames: number;
  duration: number;
  codec: string;
  profile: string | null;
  pixFmt: string;
  bitrate: number;
  audio: string | null;
}

export interface FinalFile extends MediaInfo {
  kind: string;
  title: string;
  note: string;
  name: string;
}

export interface WebVideo {
  webm: MediaInfo;
  mp4: MediaInfo;
  poster: string;
}

export interface Overlay {
  text: string;
  from: number;
  to: number;
  top: number;
}

export interface Shot {
  id: string;
  name: string;
  from: number;
  to: number;
  key: number;
  action: string;
  overlay?: Overlay;
  seconds: [number, number];
}

export interface SpringPreset {
  id: string;
  use: string;
  kind: 'spring';
  mass: number;
  stiffness: number;
  damping: number;
  note: string;
}

export interface BezierPreset {
  id: string;
  use: string;
  kind: 'bezier';
  points: [number, number, number, number];
  ms: number;
  note: string;
}

export interface StepsPreset {
  id: string;
  use: string;
  kind: 'steps';
  steps: number;
  ms: number;
  note: string;
}

export type MotionPreset = SpringPreset | BezierPreset | StepsPreset;

export interface Manifest {
  app: {
    slug: PreviewSlug;
    name: string;
    category: string;
    city: string;
    zone: string;
    tagline: string;
  };
  generatedAt: string;
  storyboard: {
    fps: number;
    duration: number;
    bridge: number;
    poster: number;
    defaultPoster: number;
    shots: Shot[];
    board: string;
  };
  marketing: { duration: number; bridge: number; outro: number; poster: number };
  palette: {
    id: string;
    name: string;
    role: string;
    hex: string;
    onSurface: number;
    onGrouped: number;
  }[];
  fonts: {
    family: string;
    file: string;
    license: string;
    weight: string;
    used: number[];
    role: string;
    bytes: number;
  }[];
  motion: MotionPreset[];
  gallery: { n: number; title: string; caption: string; file: string }[];
  videos: Record<'hero' | 'hero-9x16' | 'social-1x1' | 'store' | 'tile', WebVideo>;
  finals: FinalFile[];
  icons: { full: string; rounded: string };
  renderSeconds: Record<string, number>;
  validation: boolean | null;
  published: { totalBytes: number; count: number };
}
