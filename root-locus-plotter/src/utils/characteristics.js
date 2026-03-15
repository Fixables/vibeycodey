import { polyRoots } from './rootFinder';
import { polyAdd, polyScale, polyEvalComplex } from './polymath';

/**
 * Evaluate polynomial at s=0 (product of all coefficients * ... actually just eval at 0 = last coeff)
 */
function evalAt0(coeffs) {
  return coeffs[coeffs.length - 1];
}

/**
 * Find dominant closed-loop poles given characteristic polynomial roots.
 * Dominant poles: closest to imaginary axis (most negative real part closest to 0),
 * with preference for complex conjugate pairs.
 */
export function findDominantPoles(roots) {
  const realPoles = roots.filter((r) => Math.abs(r.im) < 1e-6);
  const complexPoles = roots.filter((r) => Math.abs(r.im) >= 1e-6 && r.im > 0);

  // Combine: use complex pair if it exists and is closer to axis than real
  const allCandidates = [
    ...complexPoles.map((p) => ({ type: 'complex', pole: p, dist: Math.abs(p.re) })),
    ...realPoles.map((p) => ({ type: 'real', pole: p, dist: Math.abs(p.re) })),
  ];

  // Only left-half plane poles are stable
  const stable = allCandidates.filter((c) => c.pole.re < 0);
  if (stable.length === 0) return null;

  stable.sort((a, b) => a.dist - b.dist);
  return stable[0];
}

/**
 * Compute closed-loop characteristics for a given gain K.
 * num, den: open-loop TF polynomials
 */
export function computeCharacteristics(num, den, K) {
  // Closed-loop characteristic polynomial: D(s) + K*N(s)
  const charPoly = polyAdd(den, polyScale(num, K));
  const clPoles = polyRoots(charPoly);

  // Closed-loop numerator is K*N(s) (for unity feedback)
  const clNum = polyScale(num, K);

  // Stability: all poles in left half plane
  const unstablePoles = clPoles.filter((p) => p.re > 1e-6);
  const isStable = unstablePoles.length === 0;

  // Dominant pole analysis
  const dominant = findDominantPoles(clPoles);

  let zeta = null, omegaN = null, omegaD = null;
  let settlingTime = null, peakTime = null, riseTime = null, overshoot = null;

  if (dominant) {
    const p = dominant.pole;
    omegaN = Math.hypot(p.re, p.im);
    zeta = omegaN > 1e-10 ? -p.re / omegaN : 0;
    omegaD = Math.abs(p.im);

    if (omegaN > 1e-10) {
      // 2% settling time
      settlingTime = zeta > 1e-10 ? 4 / (zeta * omegaN) : null;
      // Peak time (only for underdamped)
      if (zeta < 1 && omegaD > 1e-10) {
        peakTime = Math.PI / omegaD;
        // % Overshoot
        overshoot = 100 * Math.exp((-Math.PI * zeta) / Math.sqrt(1 - zeta * zeta));
        // Rise time (10-90%) approximation
        riseTime = (1.8) / omegaN;
      } else {
        overshoot = 0;
        riseTime = zeta > 1e-10 ? 2.16 * zeta + 0.60 : null;
      }
    }
  }

  // Steady-state value for unit step input (Final Value Theorem)
  // C(s)/R(s) = K*N(s) / (D(s) + K*N(s))
  // lim s->0: K*N(0) / (D(0) + K*N(0))
  const N0 = evalAt0(num);
  const D0 = evalAt0(den);
  const denom0 = D0 + K * N0;
  const steadyState = Math.abs(denom0) > 1e-12 ? (K * N0) / denom0 : null;

  // System type (number of open-loop poles at origin)
  let systemType = 0;
  for (const p of polyRoots(den)) {
    if (Math.hypot(p.re, p.im) < 1e-4) systemType++;
  }

  return {
    isStable,
    clPoles,
    dominant: dominant ? dominant.pole : null,
    dominantType: dominant ? dominant.type : null,
    zeta,
    omegaN,
    omegaD,
    settlingTime,
    peakTime,
    riseTime,
    overshoot,
    steadyState,
    systemType,
    K,
  };
}

/**
 * Find the gain K at a point s on the root locus.
 * K = |D(s)| / |N(s)|
 */
export function gainAtPoint(num, den, s) {
  const Ns = polyEvalComplex(num, s);
  const Ds = polyEvalComplex(den, s);
  const Nmod = Math.hypot(Ns.re, Ns.im);
  if (Nmod < 1e-12) return null;
  return Math.hypot(Ds.re, Ds.im) / Nmod;
}
