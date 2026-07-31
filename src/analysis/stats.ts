// Delade statistikverktyg: deskriptiv statistik, empiriska p-värden mot
// surrogatensembler, bootstrap-CI, och en liten symmetrisk 3×3-egenvärdeslösare
// (Jacobi) för D:s Stokes-kovariansinvariant.

import type { Rng } from '../sim/rng';

export function mean(xs: number[]): number {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

export function median(xs: number[]): number {
  if (xs.length === 0) return NaN;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/** Ensidig normal-överlevnadsfunktion P(Z > z), Abramowitz–Stegun 7.1.26-approximation av erf. */
export function normalSurvival(z: number): number {
  if (!Number.isFinite(z)) return z > 0 ? 0 : 1;
  const sign = z < 0 ? -1 : 1;
  const x = Math.abs(z) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * x);
  const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  const erf = 1 - poly * Math.exp(-x * x);
  const erfSigned = sign * erf;
  return 0.5 * (1 - erfSigned);
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

/**
 * p⁽²⁾-regeln (syntesrapporten §7, punkt 1 — back-portad till alla A–H/M):
 * beslutet bärs av det NÄST minsta p-värdet över surrogatfamiljerna, inte det
 * minsta. En enda "lyckträff"-familj (en null som råkar ge ett litet p) räcker
 * aldrig — minst två oberoende surrogatfamiljer måste peka åt samma håll för
 * att ett litet p⁽²⁾ ska uppstå. Degenererar till det enda värdet vid en enda
 * familj (då finns ingen andra att kräva) och till 1 vid noll familjer.
 *
 * OBS: detta är AVSIKTLIGT konservativt. Vid två familjer blir p⁽²⁾ = det
 * större av de två p-värdena (andra minsta av två = det största), vilket är
 * exakt "vittnet måste slå BÅDA" — samma logik som tvålagers-S4 kräver.
 *
 * UPPLÖSNINGSGOLV (viktigt för tröskelläsning): varje familjs empiriska p har
 * ett hårt golv på 1/(replikat+1). Eftersom p⁽²⁾ väger PER familj (inte poolat)
 * kan p⁽²⁾ aldrig understiga 1/(replikat+1). En struktur-/kvantklass vid tröskel
 * 1e-2 kräver därför ≥~100 surrogat PER familj. Vi byter MEDVETET INTE till en
 * parametrisk (gaussisk) svans för att komma under golvet — det vore att hitta
 * på signifikans surrogaten inte stöder, tvärtemot plattformens surrogat-först-
 * princip (CLAUDE.md §4.3). Hellre ärligt 'none' än överdriven klass.
 */
export function pSquared(perFamilyP: number[]): number {
  const ps = perFamilyP.filter((p) => Number.isFinite(p)).sort((a, b) => a - b);
  if (ps.length === 0) return 1;
  if (ps.length === 1) return ps[0];
  return ps[1];
}

/**
 * Empirisk svans MED räknedetaljer (för per-familj-redovisning, se
 * NullFamilyResult). Samma matematik som empiricalPValue men returnerar även
 * exceedances, replikatantal och den finaste upplösbara p-nivån 1/(N+1).
 */
export function empiricalTail(
  observed: number,
  nullValues: number[],
  direction: 'greater' | 'less',
): { pEmpirical: number; exceedances: number; replicates: number; pResolution: number } {
  const n = nullValues.length;
  const exceedances =
    direction === 'greater'
      ? nullValues.filter((v) => v >= observed).length
      : nullValues.filter((v) => v <= observed).length;
  return {
    pEmpirical: (exceedances + 1) / (n + 1),
    exceedances,
    replicates: n,
    pResolution: 1 / (n + 1),
  };
}

/** Den svagaste positiva verdict-tröskeln i A–F (structural/suspect vid 1e-2). */
export const SIGNIFICANCE_FLOOR = 1e-2;

/**
 * Sant om p⁽²⁾-upplösningen (näst minsta familjs 1/(N+1)) inte når `floor` — då
 * kan ingen positiv klass sättas oavsett signal, och ett 'none' är i själva
 * verket "kunde inte upplösas". Den korrekta fixen på "default 15 surrogat".
 *
 * GRÄNSFALLET (funnet i pre-P3-baslinjen, N=99): verdict-trösklarna är STRIKTA
 * (p < 1e-2), så en upplösning som är exakt LIKA MED golvet räcker inte —
 * minsta uppnåeliga p⁽²⁾ blir då precis 1e-2, vilket aldrig understiger
 * tröskeln. Jämförelsen måste därför vara >=, inte >. Med > rapporterades
 * "tillräcklig upplösning" vid N=99 trots att A omöjligt kunde fyra; hela
 * A-spåret föll till 0 % i screening av den anledningen, inte av fysik.
 */
export function resolutionInsufficient(
  perFamilyResolutions: number[],
  floor = SIGNIFICANCE_FLOOR,
): boolean {
  return pSquared(perFamilyResolutions) >= floor;
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
