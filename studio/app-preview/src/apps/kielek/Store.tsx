import { useCurrentFrame } from 'remotion';
import { AppRoot, StoreFrame } from './Frame';

export const Store = () => {
  const frame = useCurrentFrame();
  return (
    <AppRoot>
      <StoreFrame frame={frame} />
    </AppRoot>
  );
};
