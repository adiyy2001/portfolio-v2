export const totalFrames = (duration: number, bridge: number, loop: boolean) =>
  loop ? duration + bridge : duration;

export const bridgeT = (frame: number, duration: number, bridge: number) =>
  frame < duration ? -1 : (frame - duration + 1) / (bridge + 1);
