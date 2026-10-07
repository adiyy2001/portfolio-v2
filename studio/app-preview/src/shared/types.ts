import type { ComponentType } from 'react';
import type { CalculateMetadataFunction } from 'remotion';

export type Format = '9x16' | '1x1' | '16x9';

export interface CompositionDef {
  id: string;
  component: ComponentType<any>;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  defaultProps: Record<string, unknown>;
  calculateMetadata?: CalculateMetadataFunction<any>;
  still?: boolean;
}

export interface AppModule {
  compositions: CompositionDef[];
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
}

export interface Storyboard {
  fps: number;
  duration: number;
  bridge: number;
  poster: number;
  defaultPoster: number;
  shots: Shot[];
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

export interface FontFaceSpec {
  family: string;
  file: string;
  weight?: string;
  stretch?: string;
  style?: string;
}
