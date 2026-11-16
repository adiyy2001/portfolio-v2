export type BreathState = 'idle' | 'running' | 'paused' | 'done';
export type BreathEvent = 'visible' | 'toggle' | 'ended' | 'restart';

export const nextBreathState = (state: BreathState, event: BreathEvent): BreathState => {
  if (event === 'visible') return state === 'idle' ? 'running' : state;
  if (event === 'toggle') {
    if (state === 'running') return 'paused';
    if (state === 'paused') return 'running';
    return state;
  }
  if (event === 'ended') return state === 'running' ? 'done' : state;
  return state === 'done' ? 'running' : state;
};

export const controlLabel = (state: BreathState) => {
  if (state === 'paused') return 'Wznów animację';
  if (state === 'done') return 'Powtórz';
  return 'Zatrzymaj animację';
};

export const controlEvent = (state: BreathState): BreathEvent =>
  state === 'done' ? 'restart' : 'toggle';
