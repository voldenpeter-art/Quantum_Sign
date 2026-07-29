// CH-Eberhard-olikheten — den form NIST-/Wien-experimenten 2015 FAKTISKT
// byggdes för (Eberhard 1993; Giustina et al. 2015, PRL 115:250401), till
// skillnad från den symmetriska läroboks-CH74 i ch74.ts. Rätt vittnesform beror
// på både mätinställningarna och det preparerade tillståndet: Eberhard-formen är
// skräddarsydd för asymmetriska (icke-maximalt entanglade) tillstånd och
// enkel-detektor-per-part (klick/inget klick).
//
//   J = N++(a1,b1) − N+o(a1,b2) − No+(a2,b1) − N++(a2,b2)
//
// där ++ = klick hos båda, +o = klick endast hos alice, o+ = klick endast
// hos bob. Klassisk (LHV) gräns: J ≤ 0; kvantmekanik med rätt tillstånd och
// vinklar kan ge J > 0. Verifierad mot Giustina et al. 2015 (deras J-värde
// 7.27e-6 på 3.5 miljarder trials illustrerar skalan: en ÄKTA kränkning i
// denna form är liten — några få counts per miljon).
//
// Vilken fysisk inställning (0/1 i rådatan) som motsvarar a1/a2 respektive
// b1/b2 är en MÄRKNINGSFRÅGA som beror på experimentets vinkelkonvention —
// dokumentationen specificerar den inte. Därför beräknas ALLA FYRA
// märkningarna (byt a1↔a2 och/eller b1↔b2); varje märkning är en giltig
// LHV-olikhet i egen rätt, men att välja den bästa av fyra i efterhand är
// en look-elsewhere-selektion (×4) som redovisas explicit i utskriften.
//
// Signifikans: naiv Poisson-approx — Var(J) ≈ summan av de fyra ingående
// räknetalen; z = J/√Var. Detta är en DIAGNOSTIK, inte NIST:s trial-nivå-
// martingalanalys: den ignorerar korrelation via inställningsfrekvenser och
// förutsätter oberoende counts. Bra nog för att skilja "tydligt noll" från
// "värt en riktig analys", inte för p-värdesanspråk.

import type { PairedTrialCounts } from './nistBellRaw';

export interface EberhardLabeling {
  aliceSwap: boolean; // false: a1=setting0. true: a1=setting1.
  bobSwap: boolean;
  J: number; // i counts
  JperTrial: number;
  terms: { nPP_a1b1: number; nPo_a1b2: number; noP_a2b1: number; nPP_a2b2: number };
  poissonSigma: number;
  z: number;
}

export interface EberhardResult {
  T: number;
  labelings: EberhardLabeling[]; // alla fyra, sorterade fallande efter J
}

export function computeEberhard(counts: PairedTrialCounts): EberhardResult {
  const T = counts.matchedTrials;
  if (T === 0) throw new Error('Inga parade trials — kan inte beräkna Eberhard-J');

  const N = (table: Record<string, number>, a: number, b: number) => table[`${a},${b}`] ?? 0;

  const labelings: EberhardLabeling[] = [];
  for (const aliceSwap of [false, true]) {
    for (const bobSwap of [false, true]) {
      const a1 = aliceSwap ? 1 : 0;
      const a2 = aliceSwap ? 0 : 1;
      const b1 = bobSwap ? 1 : 0;
      const b2 = bobSwap ? 0 : 1;

      const nPP_a1b1 = N(counts.joint, a1, b1);
      const nPo_a1b2 = N(counts.aliceOnly, a1, b2);
      const noP_a2b1 = N(counts.bobOnly, a2, b1);
      const nPP_a2b2 = N(counts.joint, a2, b2);

      const J = nPP_a1b1 - nPo_a1b2 - noP_a2b1 - nPP_a2b2;
      const poissonSigma = Math.sqrt(nPP_a1b1 + nPo_a1b2 + noP_a2b1 + nPP_a2b2);
      labelings.push({
        aliceSwap,
        bobSwap,
        J,
        JperTrial: J / T,
        terms: { nPP_a1b1, nPo_a1b2, noP_a2b1, nPP_a2b2 },
        poissonSigma,
        z: poissonSigma > 0 ? J / poissonSigma : 0,
      });
    }
  }
  labelings.sort((x, y) => y.J - x.J);
  return { T, labelings };
}
