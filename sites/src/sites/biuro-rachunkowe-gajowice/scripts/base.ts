import { setupClock } from './clock';
import { setupKeys, type KeysOptions } from './keys';

export const setupBase = (options: KeysOptions = {}): void => {
  setupClock();
  setupKeys(options);
};
