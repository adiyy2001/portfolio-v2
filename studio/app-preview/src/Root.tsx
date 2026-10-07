import { Composition, Still } from 'remotion';
import type { AppModule, CompositionDef } from './shared/types';

const context = require.context('./apps', true, /^\.\/[a-z]+\/index\.ts$/);

const definitions: CompositionDef[] = context
  .keys()
  .flatMap(key => context<AppModule>(key).compositions);

export const Root = () => (
  <>
    {definitions.map(def =>
      def.still ? (
        <Still
          key={def.id}
          id={def.id}
          component={def.component}
          width={def.width}
          height={def.height}
          defaultProps={def.defaultProps}
          calculateMetadata={def.calculateMetadata}
        />
      ) : (
        <Composition
          key={def.id}
          id={def.id}
          component={def.component}
          durationInFrames={def.durationInFrames}
          fps={def.fps}
          width={def.width}
          height={def.height}
          defaultProps={def.defaultProps}
          calculateMetadata={def.calculateMetadata}
        />
      ),
    )}
  </>
);
