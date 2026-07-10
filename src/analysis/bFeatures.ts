// Delad B-rådatakedja. D, E och F ÄRVER denna — de anropar samma
// featureextraktion som B, aldrig en egen kopia (arvsregeln, CLAUDE.md §4.1 /
// B-rapporten §12). Ändras schemat här måste D/E/F:s tolkning verifieras.
//
// v1-FÖRENKLING (dokumenterad, ej dold): B mäts här på ARM A:s
// tomografihändelser som ETT enarmssystem (polarisationsutgångar +/− inom en
// bas som två "detektorkanaler"), i linje med B-rapportens §2.1-definition.
// R_CS-nämnaren är INTE dödtidsfri (B §4.2 kräver detektorsplitting eller
// modellextraktion) — TODO(rapport): denna prototyp redovisar R_CS som en
// pedagogisk approximation, inte ett skarpt B-2-vittne.

import type { Basis, EventStream } from '../types/events';
import { computeG2Curve, type G2Point } from './coincidence';
import { rangeSymmetric, mean, covariance } from './stats';

const BASES: Basis[] = ['HV', 'DA', 'RL'];
const STOKES_BIN_S = 1.0;

export interface BasisWitness {
  basis: Basis;
  g2CrossCurve: G2Point[];
  g2AutoPos0: number;
  g2AutoNeg0: number;
  rCS: number[];
  rCSMax: number;
}

export interface StokesSeries {
  S1: number[];
  S2: number[];
  S3: number[];
  binWidth: number;
}

export interface BFeatures {
  tomographyEvents: EventStream['events'];
  basisWitness: BasisWitness[];
  stokes: StokesSeries;
  sigma: number[][];
  dgCross: number;
  dgAuto: number;
}

function tsFor(events: EventStream['events'], basis: Basis, pol: '+' | '-'): number[] {
  return events
    .filter((e) => e.basis === basis && e.pol === pol)
    .map((e) => e.detectedT)
    .sort((a, b) => a - b);
}

export function stokesSeries(
  events: EventStream['events'],
  duration: number,
  binWidth = STOKES_BIN_S,
): StokesSeries {
  const numBins = Math.max(1, Math.ceil(duration / binWidth));
  const S1 = new Array(numBins).fill(0);
  const S2 = new Array(numBins).fill(0);
  const S3 = new Array(numBins).fill(0);
  for (const e of events) {
    if (!e.basis || !e.pol) continue;
    const idx = Math.min(numBins - 1, Math.floor(e.detectedT / binWidth));
    const sign = e.pol === '+' ? 1 : -1;
    if (e.basis === 'HV') S1[idx] += sign;
    else if (e.basis === 'DA') S2[idx] += sign;
    else if (e.basis === 'RL') S3[idx] += sign;
  }
  return { S1, S2, S3, binWidth };
}

export function sigmaFromStokes(stokes: StokesSeries): number[][] {
  const cols = [stokes.S1, stokes.S2, stokes.S3];
  const sigma = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      sigma[i][j] = covariance(cols[i], cols[j]);
    }
  }
  return sigma;
}

export function computeBFeatures(stream: EventStream): BFeatures {
  const tomographyEvents = stream.events.filter((e) => e.arm === 'A' && e.basis !== undefined);
  const tauChar = 0.2; // grov skala för entangled-parens ankomsttakt (par delar detectedT ≈ 0)
  const binWidth = tauChar / 4;
  const tauGrid = rangeSymmetric(-tauChar, tauChar, binWidth);

  const basisWitness: BasisWitness[] = BASES.map((basis) => {
    const pos = tsFor(tomographyEvents, basis, '+');
    const neg = tsFor(tomographyEvents, basis, '-');
    const g2CrossCurve = computeG2Curve(pos, neg, stream.duration, tauGrid, binWidth, false);
    const g2AutoPos0 = computeG2Curve(pos, pos, stream.duration, [0], binWidth, true)[0]?.g2 ?? 1;
    const g2AutoNeg0 = computeG2Curve(neg, neg, stream.duration, [0], binWidth, true)[0]?.g2 ?? 1;
    const denom = Math.max(g2AutoPos0 * g2AutoNeg0, 1e-9);
    const rCS = g2CrossCurve.map((p) => (p.g2 * p.g2) / denom);
    return { basis, g2CrossCurve, g2AutoPos0, g2AutoNeg0, rCS, rCSMax: Math.max(...rCS, 0) };
  });

  const stokes = stokesSeries(tomographyEvents, stream.duration);
  const sigma = sigmaFromStokes(stokes);

  // OBS (fixad bugg): tauGrid byggs via flyttalsackumulering (rangeSymmetric),
  // så "tau === 0" träffar nästan aldrig exakt (t.ex. -1.39e-17 ≠ 0). Måste
  // hitta punkten NÄRMAST noll, annars faller dgCross alltid tillbaka på
  // (1 ?? 1) - 1 = 0 oavsett verklig data — upptäckt via 1500-körningssvepet
  // (scripts/sweep.ts): entangled/B fastnade på "none" i 100 % av 300 körningar.
  const dgCross = mean(
    basisWitness.map((b) => {
      const zeroPoint = b.g2CrossCurve.reduce(
        (best, p) => (Math.abs(p.tau) < Math.abs(best.tau) ? p : best),
        b.g2CrossCurve[0],
      );
      return Math.abs((zeroPoint?.g2 ?? 1) - 1);
    }),
  );
  const dgAuto = mean(
    basisWitness.flatMap((b) => [Math.abs(b.g2AutoPos0 - 1), Math.abs(b.g2AutoNeg0 - 1)]),
  );

  return { tomographyEvents, basisWitness, stokes, sigma, dgCross, dgAuto };
}
