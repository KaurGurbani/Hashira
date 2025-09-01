// Polynomial interpolation with Gaussian elimination (exact BigInt fractions)

// Usage:
//   node hashira_solver.js                  → runs the 2 provided testcases
//   node hashira_solver.js input1.json   → runs on given JSON files

const fs = require('fs');

/* ---------- Fraction with BigInt ---------- */
function bgcd(a, b) {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b !== 0n) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a;
}

class Fraction {
  constructor(n, d = 1n) {
    if (d === 0n) throw new Error("Zero denominator");
    if (d < 0n) { n = -n; d = -d; }
    const g = bgcd(n < 0n ? -n : n, d);
    this.n = n / g;
    this.d = d / g;
  }
  static fromBig(n) { return new Fraction(n, 1n); }
  add(o) { return new Fraction(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o) { return new Fraction(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o) { return new Fraction(this.n * o.n, this.d * o.d); }
  div(o) {
    if (o.n === 0n) throw new Error("Divide by zero");
    return new Fraction(this.n * o.d, this.d * o.n);
  }
  isZero() { return this.n === 0n; }
  isInteger() { return this.d === 1n; }
  toString() {
    return this.d === 1n ? this.n.toString() : `${this.n.toString()}/${this.d.toString()}`;
  }
}

/* ---------- Parse BigInt from base (<=36) ---------- */
function parseBigIntFromBase(str, base) {
  str = String(str).trim().toLowerCase();
  base = Number(base);
  const digits = '0123456789abcdefghijklmnopqrstuvwxyz';
  let res = 0n;
  for (let ch of str) {
    const val = digits.indexOf(ch);
    if (val === -1 || val >= base) throw new Error(`Invalid digit '${ch}' for base ${base}`);
    res = res * BigInt(base) + BigInt(val);
  }
  return res;
}

/* ---------- Build Vandermonde system ---------- */
function buildSystem(points, k) {
  const m = k - 1;
  const A = [], B = [];
  for (let i = 0; i < k; i++) {
    const xi = BigInt(points[i].x);
    const row = [];
    const powers = [1n];
    for (let p = 1; p <= m; p++) powers.push(powers[p - 1] * xi);
    for (let p = m; p >= 0; p--) row.push(Fraction.fromBig(powers[p]));
    A.push(row);
    B.push(Fraction.fromBig(points[i].y));
  }
  return { A, B };
}

/* ---------- Gaussian elimination ---------- */
function gaussianSolve(A, B) {
  const n = A.length;
  for (let col = 0; col < n; col++) {
    let piv = -1;
    for (let r = col; r < n; r++) if (!A[r][col].isZero()) { piv = r; break; }
    if (piv === -1) throw new Error("Singular matrix");
    if (piv !== col) {
      [A[col], A[piv]] = [A[piv], A[col]];
      [B[col], B[piv]] = [B[piv], B[col]];
    }
    const pivotVal = A[col][col];
    for (let r = col + 1; r < n; r++) {
      if (A[r][col].isZero()) continue;
      const factor = A[r][col].div(pivotVal);
      for (let c = col; c < n; c++) {
        A[r][c] = A[r][c].sub(factor.mul(A[col][c]));
      }
      B[r] = B[r].sub(factor.mul(B[col]));
    }
  }
  const X = new Array(n);
  for (let i = n - 1; i >= 0; i--) {
    let rhs = B[i];
    for (let j = i + 1; j < n; j++) rhs = rhs.sub(A[i][j].mul(X[j]));
    X[i] = rhs.div(A[i][i]);
  }
  return X;
}

/* ---------- Core solver ---------- */
function solveCase(data) {
  const k = Number(data.keys.k);
  const pts = [];
  for (const key of Object.keys(data)) {
    if (key === 'keys') continue;
    const obj = data[key];
    if (!obj) continue;
    pts.push({ x: Number(key), y: parseBigIntFromBase(obj.value, obj.base) });
  }
  pts.sort((a, b) => a.x - b.x);

  // generate all combinations of k points
  const results = [];
  const comb = (start, chosen) => {
    if (chosen.length === k) {
      try {
        const { A, B } = buildSystem(chosen, k);
        const sol = gaussianSolve(A, B);
        results.push(sol[k - 1]); // constant term
      } catch {}
      return;
    }
    for (let i = start; i <= pts.length - (k - chosen.length); i++) {
      comb(i + 1, chosen.concat([pts[i]]));
    }
  };
  comb(0, []);

  const intResult = results.find(fr => fr.isInteger());
  return intResult ? intResult.toString() : results[0]?.toString() ?? "No solution";
}

/* ---------- Provided testcases ---------- */
const sampleCase = {
  "keys": { "n": 4, "k": 3 },
  "1": { "base": "10", "value": "4" },
  "2": { "base": "2", "value": "111" },
  "3": { "base": "10", "value": "12" },
  "6": { "base": "4", "value": "213" }
};

const secondCase = {
  "keys": { "n": 10, "k": 7 },
  "1": { "base": "6", "value": "13444211440455345511" },
  "2": { "base": "15", "value": "aed7015a346d635" },
  "3": { "base": "15", "value": "6aeeb69631c227c" },
  "4": { "base": "16", "value": "e1b5e05623d881f" },
  "5": { "base": "8", "value": "316034514573652620673" },
  "6": { "base": "3", "value": "2122212201122002221120200210011020220200" },
  "7": { "base": "3", "value": "20120221122211000100210021102001201112121" },
  "8": { "base": "6", "value": "20220554335330240002224253" },
  "9": { "base": "12", "value": "45153788322a1255483" },
  "10": { "base": "7", "value": "1101613130313526312514143" }
};

/* ---------- Main ---------- */
function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log("Sample Test Case: c =", solveCase(sampleCase));
    console.log("Second Test Case: c =", solveCase(secondCase));
  } else {
    for (const file of args) {
      const raw = fs.readFileSync(file, 'utf8');
      const data = JSON.parse(raw);
      console.log(`${file}: c = ${solveCase(data)}`);
    }
  }
}

main();
