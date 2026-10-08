export const system = {
  kwp: 8.2,
  panels: 20,
  panelW: 410,
  inverterKw: 8,
  batteryKwh: 10.2,
  batteryKw: 3,
  reserve: 0.3,
  efficiency: 0.95,
  buy: 1.08,
  sell: 0.24,
} as const;

export const stepH = 5 / 60;
export const steps = 288;

const noon = 13 + 10 / 60;
const halfDay = 7.5;
const shapeK = 2.0217;
const fullAt = 13 + 40 / 60;

const shape = (t: number) => {
  const x = (t - noon) / halfDay;
  return Math.abs(x) >= 1 ? 0 : Math.cos((Math.PI / 2) * x) ** shapeK;
};

const bell = (t: number, c: number, w: number, a: number) => a * Math.exp(-0.5 * ((t - c) / w) ** 2);
const box = (t: number, a: number, b: number, v: number) => (t >= a && t < b ? v : 0);

export const load = (t: number) =>
  0.27 +
  bell(t, 6.75, 0.3, 1.1) +
  bell(t, 7.3, 0.2, 0.7) +
  bell(t, 12.3, 0.5, 0.5) +
  box(t, 8, 17, 0.1) +
  box(t, 17.9, 18.75, 3.9) +
  bell(t, 18.3, 0.9, 0.5) +
  bell(t, 19.8, 0.8, 0.7) +
  bell(t, 21, 0.6, 0.45) +
  bell(t, 15.5, 0.8, 0.2) +
  box(t, 22, 23, 0.1);

export interface Sample {
  t: number;
  prod: number;
  use: number;
  direct: number;
  charge: number;
  discharge: number;
  export: number;
  import: number;
  soc: number;
}

export const simulate = (peak: number, startSoc: number) => {
  const { batteryKwh: cap, efficiency: eff, reserve, batteryKw } = system;
  let soc = startSoc;
  const out: Sample[] = [];
  for (let i = 0; i < steps; i += 1) {
    const t = i * stepH + stepH / 2;
    const prod = peak * shape(t);
    const use = load(t);
    const direct = Math.min(prod, use);
    const surplus = prod - direct;
    const deficit = use - direct;
    let charge = 0;
    let discharge = 0;
    if (surplus > 0 && soc < 1) {
      const room = ((1 - soc) * cap) / eff;
      const plan = t < fullAt ? room / Math.max(stepH, fullAt - t) : room / stepH;
      charge = Math.min(surplus, batteryKw, plan, room / stepH);
      soc += (charge * stepH * eff) / cap;
    }
    if (deficit > 0 && soc > reserve) {
      discharge = Math.min(deficit, batteryKw, ((soc - reserve) * cap * eff) / stepH);
      soc -= (discharge * stepH) / eff / cap;
    }
    out.push({ t, prod, use, direct, charge, discharge, export: surplus - charge, import: deficit - discharge, soc });
  }
  return out;
};

export const today = simulate(6.4, 0.48);
export const tomorrow = simulate(5.6, today[steps - 1].soc);

export const hourIndex = (h: number) => Math.min(steps - 1, Math.max(0, Math.round(h / stepH - 0.5)));

export const socAt = (h: number) => (h <= 0 ? 0.48 : today[hourIndex(h - stepH / 2)].soc);

export const windowAvg = (rows: Sample[], from: number, to: number, key: keyof Sample) => {
  const picked = rows.filter(row => row.t >= from && row.t < to);
  return picked.reduce((sum, row) => sum + row[key], 0) / picked.length;
};

export const pl = (value: number, digits = 1) => value.toFixed(digits).replace('.', ',');

export const facts = {
  date: 'Czwartek, 14 maja',
  dateShort: '14 maja 2026',
  now: { time: '13:10', prod: 6.4, home: 0.5, battery: 1.3, grid: 4.6, soc: 95, stored: 9.7, fullAt: '13:40', socMin: 30, socMinAt: '6:15' },
  day: {
    time: '21:40',
    prod: 47.8,
    peak: 6.4,
    peakAt: '13:10',
    direct: 7.5,
    charged: 7.5,
    exported: 32.8,
    use: 15.3,
    fromRoof: 7.5,
    fromBattery: 6.6,
    fromGrid: 1.2,
    selfSufficiency: 92,
    notBought: 14.1,
    savedZl: 15.23,
    soldZl: 7.87,
    valueZl: 23.1,
    socEvening: 50,
  },
  tip: {
    time: '21:41',
    day: 'Jutro, piątek 15 maja',
    weather: 'słonecznie, prognoza 41,8 kWh',
    forecastPeak: 5.6,
    forecastKwh: 41.8,
    main: { name: 'Pralka', from: '12:30', to: '14:00', fromH: 12.5, toH: 14, surplus: 4.1, kwh: 1.1, savedZl: 0.92 },
    more: [
      { name: 'Zmywarka', from: '14:00', to: '15:30', surplus: 4.5 },
      { name: 'Grzałka w bojlerze', from: '10:30', to: '12:30', surplus: 3.0 },
    ],
  },
  month: {
    time: '21:42',
    label: 'Maj, 1 do 14',
    prod: 462.4,
    use: 214.6,
    fromRoof: 98,
    fromBattery: 75.8,
    fromGrid: 40.8,
    selfSufficiency: 81,
    notBought: 173.8,
    exported: 281.9,
    charged: 82.5,
    savedZl: 187.7,
    soldZl: 67.66,
    valueZl: 255.36,
    days: [31.2, 38.4, 41.9, 22.6, 14.3, 27.8, 36.5, 44.2, 45.1, 19.7, 9.8, 33.4, 49.7, 47.8],
  },
  install: {
    time: '21:43',
    since: '12 marca 2025',
    total: 9.4,
    roof: 'południe, 15° na zachód, nachylenie 35°',
    place: 'dom pod Opolem',
  },
} as const;
