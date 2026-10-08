import type { AppModule, Format } from '../../shared/types';
import { canvas, formats } from '../../shared/formats';
import { totalFrames } from '../../shared/loop';
import { marketing, storyboard, tile } from './storyboard';
import { Store } from './Store';
import { Marketing } from './Marketing';
import { Tile, TILE } from './Tile';
import { Board, IconStill, Og, ScreenStill } from './Stills';

const fps = storyboard.fps;

export const compositions: AppModule['compositions'] = [
  {
    id: 'poziomka-store',
    component: Store,
    width: canvas.width,
    height: canvas.height,
    fps,
    durationInFrames: storyboard.duration,
    defaultProps: { loop: false },
    calculateMetadata: async ({ props }: { props: { loop: boolean } }) => ({
      durationInFrames: totalFrames(storyboard.duration, storyboard.bridge, props.loop),
    }),
  },
  {
    id: 'poziomka-marketing',
    component: Marketing,
    width: formats['16x9'].width,
    height: formats['16x9'].height,
    fps,
    durationInFrames: marketing.duration,
    defaultProps: { format: '16x9', loop: false },
    calculateMetadata: async ({ props }: { props: { format: Format; loop: boolean } }) => ({
      width: formats[props.format].width,
      height: formats[props.format].height,
      durationInFrames: totalFrames(marketing.duration, marketing.bridge, props.loop),
    }),
  },
  { id: 'poziomka-tile', component: Tile, width: TILE.w * TILE.scale, height: TILE.h * TILE.scale, fps, durationInFrames: tile.duration, defaultProps: {} },
  { id: 'poziomka-screen', component: ScreenStill, width: canvas.width, height: canvas.height, fps, durationInFrames: 1, defaultProps: { screen: 1 }, still: true },
  { id: 'poziomka-icon', component: IconStill, width: 1024, height: 1024, fps, durationInFrames: 1, defaultProps: { rounded: false }, still: true },
  { id: 'poziomka-board', component: Board, width: 1400, height: 1580, fps, durationInFrames: 1, defaultProps: {}, still: true },
  { id: 'poziomka-og', component: Og, width: 1200, height: 630, fps, durationInFrames: 1, defaultProps: {}, still: true },
];
