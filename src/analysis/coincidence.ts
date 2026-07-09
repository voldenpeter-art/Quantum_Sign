// Delad koincidens-/g²-motor. Används av A (kanal D1/D2), B (armar/utfall)
// och F (revival-svansar). O(N log M) per τ via binärsökning — tillräckligt
// för interaktiva datamängder (accepteras som känd begränsning, se
// C-rapporten §9 fynd 5 om O(N²)-varningen i den ursprungliga mallen).

function lowerBound(sorted: number[], target: number): number {
  let lo = 0;
  let hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (sorted[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/** Antal par (a∈A, b∈B) med (b − a) ∈ [τ − halfWindow, τ + halfWindow). */
export function countCoincidences(
  tsA: number[],
  tsB: number[],
  tau: number,
  halfWindow: number,
  sameArray = false,
): number {
  let count = 0;
  for (const a of tsA) {
    const lo = lowerBound(tsB, a + tau - halfWindow);
    const hi = lowerBound(tsB, a + tau + halfWindow);
    count += hi - lo;
  }
  if (sameArray && tau - halfWindow <= 0 && 0 < tau + halfWindow) {
    count -= tsA.length; // trivial självpar vid Δ=0
  }
  return count;
}

export interface G2Point {
  tau: number;
  g2: number;
  n: number;
}

/**
 * g²(τ) via normaliserad koincidenshistogram. rateA/rateB (Hz) och duration
 * (s) ger den slumpmässiga (accidental) normaliseringen N_acc = r_a·r_b·T·2Δτ.
 */
export function computeG2Curve(
  tsA: number[],
  tsB: number[],
  duration: number,
  tauGrid: number[],
  binWidth: number,
  sameArray = false,
): G2Point[] {
  const rateA = tsA.length / duration;
  const rateB = tsB.length / duration;
  return tauGrid.map((tau) => {
    const n = countCoincidences(tsA, tsB, tau, binWidth / 2, sameArray);
    const expected = rateA * rateB * duration * binWidth;
    const g2 = expected > 0 ? n / expected : 0;
    return { tau, g2, n };
  });
}
