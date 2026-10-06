const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const mul = (a, k) => [a[0] * k, a[1] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const length = a => Math.hypot(a[0], a[1]);
const unit = a => {
  const l = length(a);
  return l === 0 ? [0, 0] : [a[0] / l, a[1] / l];
};

const bezierAt = (c, t) => {
  const u = 1 - t;
  const b0 = u * u * u;
  const b1 = 3 * u * u * t;
  const b2 = 3 * u * t * t;
  const b3 = t * t * t;
  return [b0 * c[0][0] + b1 * c[1][0] + b2 * c[2][0] + b3 * c[3][0], b0 * c[0][1] + b1 * c[1][1] + b2 * c[2][1] + b3 * c[3][1]];
};

const firstDerivative = (c, t) => {
  const u = 1 - t;
  const k0 = 3 * u * u;
  const k1 = 6 * u * t;
  const k2 = 3 * t * t;
  return [k0 * (c[1][0] - c[0][0]) + k1 * (c[2][0] - c[1][0]) + k2 * (c[3][0] - c[2][0]), k0 * (c[1][1] - c[0][1]) + k1 * (c[2][1] - c[1][1]) + k2 * (c[3][1] - c[2][1])];
};

const secondDerivative = (c, t) => {
  const u = 1 - t;
  return [
    6 * u * (c[2][0] - 2 * c[1][0] + c[0][0]) + 6 * t * (c[3][0] - 2 * c[2][0] + c[1][0]),
    6 * u * (c[2][1] - 2 * c[1][1] + c[0][1]) + 6 * t * (c[3][1] - 2 * c[2][1] + c[1][1]),
  ];
};

const chordParameters = points => {
  const u = [0];
  for (let i = 1; i < points.length; i += 1) u.push(u[i - 1] + length(sub(points[i], points[i - 1])));
  const total = u[u.length - 1] || 1;
  return u.map(value => value / total);
};

const generate = (points, u, t1, t2) => {
  const first = points[0];
  const last = points[points.length - 1];
  const c = [
    [0, 0],
    [0, 0],
  ];
  const x = [0, 0];
  for (let i = 0; i < points.length; i += 1) {
    const t = u[i];
    const s = 1 - t;
    const a0 = mul(t1, 3 * s * s * t);
    const a1 = mul(t2, 3 * s * t * t);
    c[0][0] += dot(a0, a0);
    c[0][1] += dot(a0, a1);
    c[1][1] += dot(a1, a1);
    const tmp = sub(points[i], add(mul(first, s * s * s + 3 * s * s * t), mul(last, 3 * s * t * t + t * t * t)));
    x[0] += dot(a0, tmp);
    x[1] += dot(a1, tmp);
  }
  c[1][0] = c[0][1];
  const det = c[0][0] * c[1][1] - c[1][0] * c[0][1];
  const alphaL = det === 0 ? 0 : (x[0] * c[1][1] - x[1] * c[0][1]) / det;
  const alphaR = det === 0 ? 0 : (c[0][0] * x[1] - c[1][0] * x[0]) / det;
  const segment = length(sub(last, first));
  if (alphaL < 1e-6 * segment || alphaR < 1e-6 * segment) {
    const d = segment / 3;
    return [first, add(first, mul(t1, d)), add(last, mul(t2, d)), last];
  }
  return [first, add(first, mul(t1, alphaL)), add(last, mul(t2, alphaR)), last];
};

const newton = (curve, point, t) => {
  const d = sub(bezierAt(curve, t), point);
  const d1 = firstDerivative(curve, t);
  const d2 = secondDerivative(curve, t);
  const numerator = dot(d, d1);
  const denominator = dot(d1, d1) + dot(d, d2);
  return denominator === 0 ? t : t - numerator / denominator;
};

const maxError = (points, curve, u) => {
  let max = 0;
  let split = Math.floor(points.length / 2);
  for (let i = 1; i < points.length - 1; i += 1) {
    const d = sub(bezierAt(curve, u[i]), points[i]);
    const dist = dot(d, d);
    if (dist >= max) {
      max = dist;
      split = i;
    }
  }
  return { max, split };
};

const fit = (points, t1, t2, error, out) => {
  if (points.length === 2) {
    const d = length(sub(points[1], points[0])) / 3;
    out.push([points[0], add(points[0], mul(t1, d)), add(points[1], mul(t2, d)), points[1]]);
    return;
  }
  let u = chordParameters(points);
  let curve = generate(points, u, t1, t2);
  let { max, split } = maxError(points, curve, u);
  if (max < error * error) {
    out.push(curve);
    return;
  }
  if (max < error * error * 16) {
    for (let i = 0; i < 6; i += 1) {
      u = u.map((value, index) => Math.min(1, Math.max(0, newton(curve, points[index], value))));
      curve = generate(points, u, t1, t2);
      ({ max, split } = maxError(points, curve, u));
      if (max < error * error) {
        out.push(curve);
        return;
      }
    }
  }
  const center = unit(sub(points[split - 1], points[split + 1]));
  fit(points.slice(0, split + 1), t1, center, error, out);
  fit(points.slice(split), mul(center, -1), t2, error, out);
};

export const fitCurve = (points, error, t1, t2) => {
  const out = [];
  fit(points, t1, t2, error, out);
  return out;
};

const quadAt = (p0, c, p1, t) => {
  const s = 1 - t;
  return [s * s * p0[0] + 2 * s * t * c[0] + t * t * p1[0], s * s * p0[1] + 2 * s * t * c[1] + t * t * p1[1]];
};

const segmentTangents = seg => {
  const pick = (...candidates) => unit(candidates.find(v => length(v) > 1e-9) ?? [1, 0]);
  if (seg.type === 'L') return { start: pick(sub(seg.p1, seg.p0)), end: pick(sub(seg.p1, seg.p0)) };
  if (seg.type === 'Q') return { start: pick(sub(seg.c1, seg.p0), sub(seg.p1, seg.p0)), end: pick(sub(seg.p1, seg.c1), sub(seg.p1, seg.p0)) };
  return { start: pick(sub(seg.c1, seg.p0), sub(seg.c2, seg.p0), sub(seg.p1, seg.p0)), end: pick(sub(seg.p1, seg.c2), sub(seg.p1, seg.c1), sub(seg.p1, seg.p0)) };
};

const sample = seg => {
  const approx = length(sub(seg.p1, seg.p0)) + (seg.c1 ? length(sub(seg.c1, seg.p0)) : 0);
  const n = Math.min(48, Math.max(6, Math.ceil(approx / 0.35)));
  const pts = [];
  for (let i = 1; i <= n; i += 1) {
    const t = i / n;
    if (seg.type === 'Q') pts.push(quadAt(seg.p0, seg.c1, seg.p1, t));
    else pts.push(bezierAt([seg.p0, seg.c1, seg.c2, seg.p1], t));
  }
  return pts;
};

export const fitContour = (segments, { error = 0.12, corner = 0.9 } = {}) => {
  const tangents = segments.map(segmentTangents);
  const n = segments.length;
  const isCorner = i => {
    const next = (i + 1) % n;
    return dot(tangents[i].end, tangents[next].start) < corner;
  };
  const out = [];
  let i = 0;
  while (i < n) {
    const seg = segments[i];
    if (seg.type === 'L') {
      out.push({ type: 'L', p1: seg.p1 });
      i += 1;
      continue;
    }
    const run = [i];
    while (i + 1 < n && !isCorner(i) && segments[i + 1].type !== 'L') {
      i += 1;
      run.push(i);
    }
    const points = [segments[run[0]].p0];
    for (const index of run) points.push(...sample(segments[index]));
    const t1 = tangents[run[0]].start;
    const t2 = mul(tangents[run[run.length - 1]].end, -1);
    for (const curve of fitCurve(points, error, t1, t2)) out.push({ type: 'C', c1: curve[1], c2: curve[2], p1: curve[3] });
    i += 1;
  }
  return out;
};
