export const T = {
  stretchA: 15,
  stretchB: 30,
  slamKg: 45,
  slamSet: 52,
  plan: 60,
  planRows: [60, 75, 90],
  plates: 120,
  plateSteps: [120, 127, 135],
  plateSum: 142,
  setBack: 180,
  pressSquat: 195,
  rest: 210,
  restTicks: [210, 240, 270],
  lapseFrom: 300,
  lapseTo: 374,
  set4: 375,
  set5Invert: 390,
  set5: 405,
  deadlift: 420,
  pressDeadlift: 435,
  record: 450,
  recordLetters: 2,
  recordLift: 465,
  recordResult: 480,
  recordRm: 495,
  recordPrevious: 510,
  history: 525,
  historyStep: 4,
  launch: 570,
  launchIcon: 600,
  launchTagline: 615,
  end: 660,
  bridgeFlash: 8,
} as const;

export const restAt = (f: number) => {
  if (f < T.restTicks[1]) return 180;
  if (f < T.restTicks[2]) return 179;
  if (f < T.lapseFrom) return 178;
  const span = T.lapseTo - T.lapseFrom;
  const p = Math.min(1, (f - T.lapseFrom) / span);
  return Math.round(177 * (1 - p));
};

export const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
