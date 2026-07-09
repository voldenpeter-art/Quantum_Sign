// Delade statistikverktyg: deskriptiv statistik, empiriska p-värden mot
// surrogatensembler, bootstrap-CI, och en liten symmetrisk 3×3-egenvärdeslösare
// (Jacobi) för D:s Stokes-kovariansinvariant.

import type { Rng } from '../sim/rng';

export function mean(xs: number[]): number {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

export function variance(xs: number[]): number {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  return xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1);
}

export function std(xs: number[]): number {
  return Math.sqrt(variance(xs));
}

export function covariance(xs: number[], ys: number[]): number {
  const n = Math.min(xs.length, ys.length);
  if (n < 2) return 0;
  const mx = mean(xs.slice(0, n));
  const my = mean(ys.slice(0, n));
  let acc = 0;
  for (let i = 0; i < n; i++) acc += (xs[i] - mx) * (ys[i] - my);
  return acc / (n - 1);
}

/**
 * Empiriskt p-värde: andel nullreplikat som är minst lika "extrema" som det
 * observerade värdet, i den riktning som räknas som farlig för nollhypotesen.
 */
export function empiricalPValue(
  observed: number,
  nullValues: number[],
  direction: 'greater' | 'less',
): number {
  if (nullValues.length === 0) return 1;
  const asExtreme =
    direction === 'greater'
      ? nullValues.filter((v) => v >= observed).length
      : nullValues.filter((v) => v <= observed).length;
  return (asExtreme + 1) / (nullValues.length + 1); // +1: konservativ (Q99-stil) korrigering
}

/** i.i.d. resampling-bootstrap (förenklad — ej blockbootstrap) för konfidensintervall. */
export function bootstrapCI(
  xs: number[],
  statistic: (sample: number[]) => number,
  rng: Rng,
  reps = 500,
  loPct = 0.05,
  hiPct = 0.95,
): { lo: number; hi: number; point: number } {
  const point = statistic(xs);
  if (xs.length === 0) return { lo: point, hi: point, point };
  const samples: number[] = [];
  for (let r = 0; r < reps; r++) {
    const resample = Array.from({ length: xs.length }, () => xs[rng.uniformInt(xs.length)]);
    samples.push(statistic(resample));
  }
  samples.sort((a, b) => a - b);
  const lo = samples[Math.floor(loPct * samples.length)];
  const hi = samples[Math.min(samples.length - 1, Math.floor(hiPct * samples.length))];
  return { lo, hi, point };
}

/** Räknar händelser per tidsbin av bredd binWidth över [0, duration). */
export function binCounts(timestamps: number[], duration: number, binWidth: number): number[] {
  const numBins = Math.max(1, Math.ceil(duration / binWidth));
  const counts = new Array(numBins).fill(0);
  for (const t of timestamps) {
    const idx = Math.min(numBins - 1, Math.floor(t / binWidth));
    if (idx >= 0) counts[idx]++;
  }
  return counts;
}

export function rangeSymmetric(minVal: number, maxVal: number, step: number): number[] {
  const out: number[] = [];
  for (let v = minVal; v <= maxVal + step / 2; v += step) out.push(v);
  return out;
}

export function covMatrix(feats: number[][]): number[][] {
  const dim = feats[0]?.length ?? 0;
  const means = Array.from({ length: dim }, (_, j) => mean(feats.map((f) => f[j])));
  const cov = Array.from({ length: dim }, () => new Array(dim).fill(0));
  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      let acc = 0;
      for (const f of feats) acc += (f[i] - means[i]) * (f[j] - means[j]);
      cov[i][j] = feats.length > 1 ? acc / (feats.length - 1) : 0;
    }
  }
  return cov;
}

/**
 * Deltagarkvot (participation ratio) = (Σλᵢ)² / Σλᵢ² = trace(Σ)² / trace(Σ²).
 * Kräver ingen egenvärdesuppdelning — spårformen gäller för alla symmetriska
 * matrisstorlekar. Ger E:s "effektiva dimension".
 */
export function participationRatio(cov: number[][]): number {
  const n = cov.length;
  let trace = 0;
  let traceSq = 0;
  for (let i = 0; i < n; i++) trace += cov[i][i];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) traceSq += cov[i][j] * cov[j][i];
  return traceSq > 0 ? (trace * trace) / traceSq : 0;
}

/** Jacobi-egenvärdeslösare för symmetriska 3×3-matriser. Returnerar sorterade egenvärden (fallande). */
export function eigenvaluesSym3(m: number[][]): number[] {
  const a = m.map((row) => [...row]);
  const n = 3;
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) off += a[p][q] * a[p][q];
    if (off < 1e-18) break;

    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(a[p][q]) < 1e-15) continue;
        const theta = (a[q][q] - a[p][p]) / (2 * a[p][q]);
        const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        const app = a[p][p];
        const aqq = a[q][q];
        const apq = a[p][q];
        a[p][p] = c * c * app - 2 * s * c * apq + s * s * aqq;
        a[q][q] = s * s * app + 2 * s * c * apq + c * c * aqq;
        a[p][q] = 0;
        a[q][p] = 0;
        for (let i = 0; i < n; i++) {
          if (i === p || i === q) continue;
          const aip = a[i][p];
          const aiq = a[i][q];
          a[i][p] = c * aip - s * aiq;
          a[p][i] = a[i][p];
          a[i][q] = s * aip + c * aiq;
          a[q][i] = a[i][q];
        }
      }
    }
  }
  return [a[0][0], a[1][1], a[2][2]].sort((x, y) => y - x);
}
