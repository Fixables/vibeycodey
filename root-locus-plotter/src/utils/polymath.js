// ─── Polynomial arithmetic ────────────────────────────────────────────────────
// All polynomials are arrays of coefficients in descending-power order,
// e.g. [1, -3, 2] represents s² − 3s + 2.

/** Polynomial addition */
export function polyAdd(p1, p2) {
  const len = Math.max(p1.length, p2.length);
  const a = [...Array(len - p1.length).fill(0), ...p1];
  const b = [...Array(len - p2.length).fill(0), ...p2];
  return a.map((v, i) => v + b[i]);
}

/** Polynomial multiplication (convolution) */
export function polyMultiply(p1, p2) {
  const result = new Array(p1.length + p2.length - 1).fill(0);
  for (let i = 0; i < p1.length; i++)
    for (let j = 0; j < p2.length; j++) result[i + j] += p1[i] * p2[j];
  return result;
}

/** Scalar multiplication */
export function polyScale(p, k) { return p.map(c => c * k); }

/** Integer power (n >= 0) */
export function polyPow(p, n) {
  if (n === 0) return [1];
  let result = [1];
  for (let i = 0; i < n; i++) result = polyMultiply(result, p);
  return result;
}

/** Derivative */
export function polyDeriv(p) {
  const n = p.length - 1;
  if (n <= 0) return [0];
  return p.slice(0, n).map((c, i) => c * (n - i));
}

/** Evaluate at complex point {re, im} */
export function polyEvalComplex(coeffs, z) {
  let re = 0, im = 0;
  for (const c of coeffs) {
    const newRe = re * z.re - im * z.im + c;
    const newIm = re * z.im + im * z.re;
    re = newRe; im = newIm;
  }
  return { re, im };
}

/** Degree (index of first non-zero coefficient) */
export function polyDegree(coeffs) {
  for (let i = 0; i < coeffs.length; i++)
    if (Math.abs(coeffs[i]) > 1e-12) return coeffs.length - 1 - i;
  return 0;
}

/** Format coefficient array as human-readable string */
export function formatPolynomial(coeffs) {
  const n = coeffs.length - 1;
  const parts = [];
  for (let i = 0; i <= n; i++) {
    const c = coeffs[i], power = n - i;
    if (Math.abs(c) < 1e-10) continue;
    const sign  = c < 0 ? '-' : parts.length ? '+' : '';
    const absC  = Math.abs(c);
    const cStr  = power === 0 ? absC.toPrecision(4) : absC === 1 ? '' : absC.toPrecision(4);
    const sStr  = power === 0 ? '' : power === 1 ? 's' : `s^${power}`;
    parts.push(`${sign}${cStr}${sStr}`);
  }
  return parts.join('') || '0';
}

// ─── Expression parser ────────────────────────────────────────────────────────
/**
 * Parse a polynomial expression into coefficient array (descending powers).
 *
 * Supports:
 *   s^2 + 3s + 2     – standard form
 *   s(s+1)           – implicit multiplication
 *   s*(s+1)          – explicit multiplication
 *   (s+2)(s+3)       – adjacent parentheses
 *   (s+1)^2          – integer exponent
 *   2.5s^3 - s + 4   – decimal coefficients
 *   1 3 2            – space-separated raw coefficients (fallback)
 *
 * Throws an Error with a descriptive message on invalid input.
 */
export function parsePolynomial(input) {
  if (!input || !input.trim()) throw new Error('Empty input');
  const raw = input.trim();

  // Space-separated plain numbers (e.g. "1 3 2")?
  const parts = raw.split(/\s+/);
  if (parts.length >= 2 && parts.every(p => p !== '' && !isNaN(Number(p)))) {
    return parts.map(Number);
  }

  // Full expression parser
  return _parseExpr(raw);
}

// ─── Tokeniser ────────────────────────────────────────────────────────────────
function _tokenize(src) {
  const tokens = [];
  let i = 0;
  const s = src.toLowerCase().replace(/\s/g, '');  // strip all whitespace

  while (i < s.length) {
    const ch = s[i];

    if (/[\d.]/.test(ch)) {
      let num = '';
      while (i < s.length && /[\d.]/.test(s[i])) num += s[i++];
      const val = parseFloat(num);
      if (isNaN(val)) throw new Error(`Bad number: "${num}"`);
      tokens.push({ t: 'num', v: val });

    } else if (ch === 's') {
      tokens.push({ t: 's' }); i++;
    } else if (ch === '+') { tokens.push({ t: '+' }); i++;
    } else if (ch === '-') { tokens.push({ t: '-' }); i++;
    } else if (ch === '*') { tokens.push({ t: '*' }); i++;
    } else if (ch === '^') { tokens.push({ t: '^' }); i++;
    } else if (ch === '(') { tokens.push({ t: '(' }); i++;
    } else if (ch === ')') { tokens.push({ t: ')' }); i++;
    } else {
      throw new Error(`Unexpected character: '${ch}'`);
    }
  }
  return tokens;
}

// ─── Recursive-descent parser ─────────────────────────────────────────────────
class _Parser {
  constructor(tokens) { this.tok = tokens; this.pos = 0; }

  peek()          { return this.tok[this.pos]; }
  consume(type)   {
    const t = this.tok[this.pos];
    if (type && (!t || t.t !== type))
      throw new Error(`Expected "${type}" but got "${t ? t.t : 'end of input'}"`);
    this.pos++;
    return t;
  }

  // expr = term (('+' | '-') term)*
  parseExpr() {
    let left = this.parseTerm();
    for (;;) {
      const t = this.peek();
      if (!t || (t.t !== '+' && t.t !== '-')) break;
      const op = this.consume().t;
      const right = this.parseTerm();
      left = op === '+' ? polyAdd(left, right) : polyAdd(left, polyScale(right, -1));
    }
    return left;
  }

  // term = factor ('*'? factor)*
  // Implicit multiply: factor followed by '(' or 's' (not bare num after bare num).
  parseTerm() {
    let left = this.parseFactor();
    for (;;) {
      const t = this.peek();
      if (!t) break;
      if (t.t === '*') {
        this.consume('*');
        left = polyMultiply(left, this.parseFactor());
      } else if (t.t === '(' || t.t === 's') {
        // Implicit multiply: e.g.  s(s+1)  or  2s  (via num→factor then s here)
        left = polyMultiply(left, this.parseFactor());
      } else {
        break;
      }
    }
    return left;
  }

  // factor = ('-')? base ('^' uint)?
  parseFactor() {
    let negate = false;
    if (this.peek()?.t === '-') { this.consume('-'); negate = true; }

    let base = this.parseBase();

    if (this.peek()?.t === '^') {
      this.consume('^');
      const expTok = this.consume('num');
      const exp = expTok.v;
      if (!Number.isInteger(exp) || exp < 0 || exp > 30)
        throw new Error(`Exponent must be a non-negative integer ≤ 30, got ${exp}`);
      base = polyPow(base, exp);
    }

    return negate ? polyScale(base, -1) : base;
  }

  // base = '(' expr ')' | 's' | num
  parseBase() {
    const t = this.peek();
    if (!t) throw new Error('Unexpected end of expression');

    if (t.t === '(') {
      this.consume('(');
      const inner = this.parseExpr();
      if (!this.peek() || this.peek().t !== ')')
        throw new Error('Missing closing ")"');
      this.consume(')');
      return inner;
    }

    if (t.t === 's') { this.consume('s'); return [1, 0]; }
    if (t.t === 'num') { this.consume('num'); return [t.v]; }

    throw new Error(`Unexpected token "${t.t}"`);
  }
}

function _parseExpr(raw) {
  const tokens = _tokenize(raw);
  const parser = new _Parser(tokens);
  const poly = parser.parseExpr();
  if (parser.pos < tokens.length)
    throw new Error(`Unexpected token "${tokens[parser.pos].t}" at position ${parser.pos}`);

  // Strip leading near-zero coefficients
  let result = [...poly];
  while (result.length > 1 && Math.abs(result[0]) < 1e-12) result.shift();
  if (result.length === 0 || result.every(c => Math.abs(c) < 1e-12))
    throw new Error('Expression evaluates to zero polynomial');
  return result;
}
