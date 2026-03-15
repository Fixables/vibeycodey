import { polyEvalComplex, polyMultiply, polyScale, polyAdd, polyDeriv } from './polymath';
import { polyRoots } from './rootFinder';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isReal(p, tol = 1e-5) { return Math.abs(p.im) < tol; }

// ─── 1. Real-axis segments ────────────────────────────────────────────────────
/**
 * Returns [{x0, x1}] segments of the real axis that lie on the root locus.
 * Rule: a point σ on the real axis is on the locus iff the total number of
 * open-loop poles + zeros to its right is odd.
 */
export function realAxisLocus(poles, zeros) {
  const sings = [];
  for (const p of poles) if (isReal(p)) sings.push(p.re);
  for (const z of zeros) if (isReal(z)) sings.push(z.re);
  if (sings.length === 0) return [];

  sings.sort((a, b) => a - b);
  // Deduplicate
  const unique = [sings[0]];
  for (let i = 1; i < sings.length; i++)
    if (Math.abs(sings[i] - unique[unique.length - 1]) > 1e-6) unique.push(sings[i]);

  const countRight = testPt => {
    let c = 0;
    for (const p of poles) if (isReal(p) && p.re > testPt + 1e-10) c++;
    for (const z of zeros) if (isReal(z) && z.re > testPt + 1e-10) c++;
    return c;
  };

  const segs = [];
  for (let i = 0; i < unique.length - 1; i++) {
    const mid = (unique[i] + unique[i + 1]) / 2;
    if (countRight(mid) % 2 === 1) segs.push({ x0: unique[i], x1: unique[i + 1] });
  }
  // Semi-infinite to −∞
  if (countRight(unique[0] - 1) % 2 === 1) segs.push({ x0: -Infinity, x1: unique[0] });
  // Semi-infinite to +∞ (rare for proper systems)
  if (countRight(unique[unique.length - 1] + 1) % 2 === 1)
    segs.push({ x0: unique[unique.length - 1], x1: Infinity });

  return segs;
}

// ─── 2. Asymptotes ────────────────────────────────────────────────────────────
/**
 * Returns { centroid, angles[] } where angles are in radians.
 * n−m asymptotes with angles (2k+1)π/(n−m), centroid σ_a = (Σpoles − Σzeros)/(n−m).
 */
export function computeAsymptotes(poles, zeros) {
  const n = poles.length, m = zeros.length;
  const q = n - m;
  if (q <= 0) return null;

  const centroid =
    (poles.reduce((s, p) => s + p.re, 0) - zeros.reduce((s, z) => s + z.re, 0)) / q;

  const angles = Array.from({ length: q }, (_, k) => ((2 * k + 1) * Math.PI) / q);
  return { centroid, angles, q };
}

// ─── 3. Breakaway / break-in points ──────────────────────────────────────────
/**
 * Break points satisfy N(s)D'(s) − D(s)N'(s) = 0.
 * We find real roots of this equation that lie on the real-axis locus
 * and correspond to K ≥ 0.
 */
export function computeBreakPoints(num, den, poles, zeros) {
  const Dp = polyDeriv(den);
  const Np = polyDeriv(num);
  // N·D' − D·N' = 0
  const bp = polyAdd(polyMultiply(num, Dp), polyScale(polyMultiply(den, Np), -1));
  const roots = polyRoots(bp);

  const segs = realAxisLocus(poles, zeros);

  return roots
    .filter(r => isReal(r, 1e-3))
    .map(r => r.re)
    .filter(x => {
      // Must lie in a real-axis locus segment
      return segs.some(({ x0, x1 }) => {
        const lo = isFinite(x0) ? x0 : x - 1e6;
        const hi = isFinite(x1) ? x1 : x + 1e6;
        return x >= lo - 1e-4 && x <= hi + 1e-4;
      });
    })
    .filter(x => {
      // Must correspond to K ≥ 0
      const s  = { re: x, im: 0 };
      const Ns = polyEvalComplex(num, s);
      const Ds = polyEvalComplex(den, s);
      if (Math.abs(Ns.re) < 1e-12) return false;
      return (-Ds.re / Ns.re) >= -1e-6;
    })
    .map(x => {
      // Compute K at this break point
      const s  = { re: x, im: 0 };
      const Ns = polyEvalComplex(num, s);
      const Ds = polyEvalComplex(den, s);
      const K  = Math.abs(Ns.re) > 1e-12 ? -Ds.re / Ns.re : 0;
      return { x, K };
    });
}

// ─── 4. Angle of departure ────────────────────────────────────────────────────
/**
 * Departure angle (degrees) from a complex pole pk.
 * φ_dep = 180° + Σ∠(pk − zi) − Σ∠(pk − pj,  j≠k)
 */
export function angleOfDeparture(pk, poles, zeros) {
  let sum = 0;
  for (const p of poles)
    if (Math.hypot(p.re - pk.re, p.im - pk.im) > 1e-6)
      sum -= Math.atan2(pk.im - p.im, pk.re - p.re);
  for (const z of zeros)
    sum += Math.atan2(pk.im - z.im, pk.re - z.re);

  let deg = (Math.PI + sum) * (180 / Math.PI);
  // Normalise to (−180, 180]
  deg = ((deg + 180) % 360 + 360) % 360 - 180;
  return deg;
}

// ─── 5. Angle of arrival ──────────────────────────────────────────────────────
/**
 * Arrival angle (degrees) at a complex zero zk.
 * φ_arr = 180° + Σ∠(zk − pj) − Σ∠(zk − zi,  i≠k)
 */
export function angleOfArrival(zk, poles, zeros) {
  let sum = 0;
  for (const p of poles)
    sum += Math.atan2(zk.im - p.im, zk.re - p.re);
  for (const z of zeros)
    if (Math.hypot(z.re - zk.re, z.im - zk.im) > 1e-6)
      sum -= Math.atan2(zk.im - z.im, zk.re - z.re);

  let deg = (Math.PI + sum) * (180 / Math.PI);
  deg = ((deg + 180) % 360 + 360) % 360 - 180;
  return deg;
}

// ─── 6. Imaginary-axis crossings ─────────────────────────────────────────────
/**
 * Find ω > 0 where D(jω) + K·N(jω) = 0 has a real, positive K.
 * Equivalently: Im(D(jω)/N(jω)) = 0  AND  Re(D(jω)/N(jω)) < 0.
 * Returns [{omega, K}].
 */
export function imagAxisCrossings(num, den) {
  const n        = den.length - 1;
  const omegaMax = Math.max(30, n * 15);
  const steps    = 3000;

  // Compute f(ω) = D(jω)/N(jω) (complex ratio)
  const ratio = omega => {
    const s  = { re: 0, im: omega };
    const Ds = polyEvalComplex(den, s);
    const Ns = polyEvalComplex(num, s);
    const d2 = Ns.re ** 2 + Ns.im ** 2;
    if (d2 < 1e-20) return null;
    return {
      re: (Ds.re * Ns.re + Ds.im * Ns.im) / d2,
      im: (Ds.im * Ns.re - Ds.re * Ns.im) / d2,
    };
  };

  const crossings = [];
  let prev = ratio(1e-4);  // skip ω=0 (real axis, not imaginary axis crossing)

  for (let i = 1; i <= steps; i++) {
    const omega = (i / steps) * omegaMax;
    const curr  = ratio(omega);
    if (!prev || !curr) { prev = curr; continue; }

    // Sign change in imaginary part with Re(D/N) < 0 on both sides?
    if (prev.im * curr.im < 0 && prev.re < 0 && curr.re < 0) {
      // Bisect to locate crossing
      let lo = ((i - 1) / steps) * omegaMax;
      let hi = omega;
      for (let it = 0; it < 50; it++) {
        const mid  = (lo + hi) / 2;
        const fmid = ratio(mid);
        if (!fmid) break;
        (fmid.im * prev.im < 0 ? (hi = mid) : (lo = mid));
      }
      const oc = (lo + hi) / 2;
      const rc = ratio(oc);
      if (rc && rc.re < 0) crossings.push({ omega: oc, K: -rc.re });
    }
    prev = curr;
  }
  return crossings;
}

// ─── Master overlay computation ───────────────────────────────────────────────
export function computeOverlays(num, den, poles, zeros) {
  const complexPoles = poles.filter(p => p.im > 1e-5);
  const complexZeros = zeros.filter(z => z.im > 1e-5);

  return {
    realAxisSegments: realAxisLocus(poles, zeros),
    asymptotes:       computeAsymptotes(poles, zeros),
    breakPoints:      computeBreakPoints(num, den, poles, zeros),
    departures:       complexPoles.map(pk => ({
                        pole:  pk,
                        angle: angleOfDeparture(pk, poles, zeros),
                      })),
    arrivals:         complexZeros.map(zk => ({
                        zero:  zk,
                        angle: angleOfArrival(zk, poles, zeros),
                      })),
    imagCrossings:    imagAxisCrossings(num, den),
  };
}
