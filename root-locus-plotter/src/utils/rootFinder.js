import { polyEvalComplex } from './polymath';

/**
 * Find all roots of a polynomial using the Durand-Kerner (Weierstrass) method.
 * coeffs: [a_n, a_{n-1}, ..., a_0] (descending powers)
 * Returns: Array of {re, im}
 */
export function polyRoots(coeffs) {
  // Strip leading zeros
  let c = [...coeffs];
  while (c.length > 1 && Math.abs(c[0]) < 1e-14) c.shift();

  const n = c.length - 1;
  if (n <= 0) return [];
  if (n === 1) return [{ re: -c[1] / c[0], im: 0 }];

  // Normalise to monic
  const a = c.map((v) => v / c[0]);

  if (n === 2) {
    const disc = a[1] * a[1] - 4 * a[2];
    if (disc >= 0) {
      return [
        { re: (-a[1] + Math.sqrt(disc)) / 2, im: 0 },
        { re: (-a[1] - Math.sqrt(disc)) / 2, im: 0 },
      ];
    }
    const sqrtNeg = Math.sqrt(-disc);
    return [
      { re: -a[1] / 2, im: sqrtNeg / 2 },
      { re: -a[1] / 2, im: -sqrtNeg / 2 },
    ];
  }

  // Initial guesses on a circle of radius r
  const r = 1 + Math.max(...a.slice(1).map(Math.abs));
  let z = Array.from({ length: n }, (_, k) => ({
    re: r * Math.cos((2 * Math.PI * k) / n + 0.1),
    im: r * Math.sin((2 * Math.PI * k) / n + 0.1),
  }));

  const ITERS = 200;
  for (let iter = 0; iter < ITERS; iter++) {
    const newZ = z.map((zk, k) => {
      const pzk = polyEvalComplex(a, zk);
      if (Math.abs(pzk.re) < 1e-15 && Math.abs(pzk.im) < 1e-15) return zk;

      // Product of (zk - zj) for j != k
      let prodRe = 1, prodIm = 0;
      for (let j = 0; j < n; j++) {
        if (j === k) continue;
        const dRe = zk.re - z[j].re;
        const dIm = zk.im - z[j].im;
        const pRe = prodRe * dRe - prodIm * dIm;
        const pIm = prodRe * dIm + prodIm * dRe;
        prodRe = pRe;
        prodIm = pIm;
      }
      const denom = prodRe * prodRe + prodIm * prodIm;
      if (denom < 1e-30) return zk;
      const qRe = (pzk.re * prodRe + pzk.im * prodIm) / denom;
      const qIm = (pzk.im * prodRe - pzk.re * prodIm) / denom;
      return { re: zk.re - qRe, im: zk.im - qIm };
    });
    z = newZ;
  }

  // Snap near-zero imaginary parts
  return z.map((r) => ({
    re: Math.abs(r.re) < 1e-9 ? 0 : r.re,
    im: Math.abs(r.im) < 1e-9 ? 0 : r.im,
  }));
}
