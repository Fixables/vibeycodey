import { polyAdd, polyScale, polyMultiply } from './polymath';
import { polyRoots } from './rootFinder';

// ─── Hungarian optimal-assignment ────────────────────────────────────────────
// cost[i][j]: cost of pairing new root i with previous root j.
// Returns assign[i] = j (0-indexed).  O(n³).
function hungarianAssign(cost) {
  const n = cost.length;
  const INF = 1e18;
  const u   = new Array(n + 1).fill(0);   // row potentials
  const v   = new Array(n + 1).fill(0);   // col potentials
  const p   = new Array(n + 1).fill(0);   // p[j] = row assigned to col j (1-indexed)
  const way = new Array(n + 1).fill(0);

  for (let i = 1; i <= n; i++) {
    p[0] = i;
    let j0 = 0;
    const minVal = new Array(n + 1).fill(INF);
    const used   = new Array(n + 1).fill(false);

    do {
      used[j0] = true;
      const i0 = p[j0];
      let delta = INF, j1 = -1;
      for (let j = 1; j <= n; j++) {
        if (!used[j]) {
          const cur = cost[i0 - 1][j - 1] - u[i0] - v[j];
          if (cur < minVal[j]) { minVal[j] = cur; way[j] = j0; }
          if (minVal[j] < delta) { delta = minVal[j]; j1 = j; }
        }
      }
      for (let j = 0; j <= n; j++) {
        if (used[j]) { u[p[j]] += delta; v[j] -= delta; }
        else          minVal[j] -= delta;
      }
      j0 = j1;
    } while (p[j0] !== 0);

    do { const j1 = way[j0]; p[j0] = p[j1]; j0 = j1; } while (j0 !== 0);
  }

  const result = new Array(n).fill(0);
  for (let j = 1; j <= n; j++) if (p[j] !== 0) result[p[j] - 1] = j - 1;
  return result;
}

// ─── Per-K root computation ───────────────────────────────────────────────────
function computeRootsAtK(num, den, K) {
  return polyRoots(polyAdd(den, polyScale(num, K)));
}

// ─── Adaptive K-grid refinement ───────────────────────────────────────────────
// If any root moves more than distThresh between consecutive K steps, subdivide.
function maxRootMovement(roots1, roots2) {
  if (!roots1 || !roots2 || roots1.length !== roots2.length || roots1.length === 0) return 0;
  const n = roots1.length;
  const cost = roots1.map(r1 => roots2.map(r2 => Math.hypot(r1.re - r2.re, r1.im - r2.im)));
  const assign = n === 1 ? [0] : hungarianAssign(cost);
  return Math.max(...assign.map((j, i) => cost[i][j]));
}

function adaptiveRefine(points, num, den, distThresh, maxDepth) {
  if (points.length < 2 || maxDepth <= 0) return points;
  const result = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const prev = result[result.length - 1];
    const curr = points[i];
    if ((curr.K - prev.K) > 1e-8 && maxRootMovement(prev.roots, curr.roots) > distThresh) {
      const midK = (prev.K + curr.K) / 2;
      const mid  = { K: midK, roots: computeRootsAtK(num, den, midK) };
      const refined = adaptiveRefine([prev, mid, curr], num, den, distThresh, maxDepth - 1);
      result.push(...refined.slice(1));
    } else {
      result.push(curr);
    }
  }
  return result;
}

// ─── Main root locus computation ──────────────────────────────────────────────
/**
 * Compute root locus for 1 + K·N(s)/D(s) = 0.
 * Returns branches: Array<{re[], im[], K[]}>.
 *
 * Improvements over the original:
 *  1. Optimal (Hungarian) assignment instead of greedy nearest-neighbour.
 *  2. Adaptive K-grid refinement near breakaway/high-curvature regions.
 */
export function computeRootLocus(num, den, numPoints = 700) {
  const nBranches = den.length - 1;
  if (nBranches <= 0) return [];

  // Build initial K grid: 0, then log-spaced 10^-3 → 10^4
  const Ks = [0];
  for (let i = 0; i <= numPoints; i++) {
    Ks.push(Math.pow(10, -3 + (i / numPoints) * 7));
  }

  // Compute roots at each K
  let points = Ks.map(K => ({ K, roots: computeRootsAtK(num, den, K) }));

  // Estimate inter-pole spacing as the adaptive-refinement scale
  const poles0 = points[0].roots;
  let scale = 1;
  if (poles0.length >= 2) {
    let maxDist = 0;
    for (let i = 0; i < poles0.length; i++)
      for (let j = i + 1; j < poles0.length; j++)
        maxDist = Math.max(maxDist, Math.hypot(
          poles0[i].re - poles0[j].re,
          poles0[i].im - poles0[j].im,
        ));
    scale = maxDist || 1;
  }

  // Adaptively insert K midpoints where roots jump > 15% of pole-spread
  points = adaptiveRefine(points, num, den, scale * 0.15, 4);

  // ── Build branches using Hungarian-optimal slot tracking ──────────────────
  const branches = Array.from({ length: nBranches }, () => ({ re: [], im: [], K: [] }));

  // Initialise: sort K=0 roots by real then imaginary part
  let prevRoots    = [...points[0].roots].sort((a, b) => a.re - b.re || a.im - b.im);
  let slotToBranch = prevRoots.map((_, i) => i);  // slot i → branch i initially

  // Push K=0 points
  for (let i = 0; i < prevRoots.length && i < nBranches; i++) {
    branches[i].re.push(prevRoots[i].re);
    branches[i].im.push(prevRoots[i].im);
    branches[i].K.push(0);
  }

  for (let pi = 1; pi < points.length; pi++) {
    const { K, roots } = points[pi];
    if (!roots || roots.length === 0) continue;

    const n = Math.min(roots.length, prevRoots.length, nBranches);
    if (n === 0) continue;

    // cost[i][j] = squared distance from roots[i] to prevRoots[j]
    const cost = roots.slice(0, n).map(r =>
      prevRoots.slice(0, n).map(p => (r.re - p.re) ** 2 + (r.im - p.im) ** 2)
    );

    const assign = n === 1 ? [0] : hungarianAssign(cost);

    const newSlotToBranch = new Array(n).fill(-1);
    for (let i = 0; i < n; i++) {
      const prevSlot  = assign[i];
      const branchIdx = slotToBranch[prevSlot];
      newSlotToBranch[i] = branchIdx;
      if (branchIdx >= 0 && branchIdx < nBranches) {
        branches[branchIdx].re.push(roots[i].re);
        branches[branchIdx].im.push(roots[i].im);
        branches[branchIdx].K.push(K);
      }
    }

    prevRoots    = roots.slice(0, n);
    slotToBranch = newSlotToBranch;
  }

  return branches;
}

/**
 * Build the open-loop TF with optional lead/lag controller.
 * controller: { enabled, zc, pc }
 */
export function buildOpenLoopTF(baseNum, baseDen, controller) {
  if (!controller || !controller.enabled) return { num: baseNum, den: baseDen };
  const { zc, pc } = controller;
  return {
    num: polyMultiply(baseNum, [1, zc]),
    den: polyMultiply(baseDen, [1, pc]),
  };
}
