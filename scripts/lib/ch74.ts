// Clauser–Horne (1974)-olikheten — läroboksformen, INTE NIST:s egen
// sofistikerade "exact p-value" martingal-/cutpoint-metod (Bierhorst m.fl.,
// beskriven i file_folder_descriptions.pdf under "Peter's Data Calculations").
// Den senare återges inte här; den kräver algoritmiska detaljer som inte är
// verifierade i det här projektet.
//
// Form (verifierad mot litteratur, ej NIST-specifik källa):
//   J = P(a,b) + P(a,b') + P(a',b) − P(a',b') − P(a) − P(b),  −1 ≤ J ≤ 0 (klassisk gräns)
// där a/a' är alices två inställningar (0/1), b/b' bobs. P(a,b) etc är
// SAMKLICK-frekvenser; P(a)/P(b) är ENKELklick-frekvenser (den part
// detekterar, oavsett motparten), för inställningen som INTE ingår i den
// negativa samklicktermen (a', b'). Alla sex termer normaliserade mot SAMMA
// nämnare (totalt antal parade trials) — inte betingade sannolikheter per
// inställning — vilket är den vanliga "rate"-konventionen för denna typ av
// detektionslucke-fri Bell-test-analys.
//
// VIKTIGT: detta är en FRISTÅENDE, textbook-baserad kontroll — inte en
// reproduktion av det ursprungliga NIST-resultatet. Alla råa räknetal
// rapporteras separat så att den som vill använda en annan konvention kan
// räkna om direkt ur dem.
//
// KONTEXT från K. Shalm (e-postkorrespondens, juli 2026), som förklarar
// varför denna naiva form inte kränkte på 2015-datan (J ≈ −0.031):
// (1) "One has to be careful to use the correct form which depends on both
//     the measurement settings and prepared state" — vår symmetriska
//     läroboksform är inte anpassad till det asymmetriska Eberhard-tillstånd
//     och de optimerade vinklar NIST faktiskt använde. Han bedömde det som
//     möjligt att en KORREKT anpassad CH74 kan kränka på denna data.
// (2) Deras publicerade analys använde en "coin-flipping variant" av CH74,
//     och deras bästa resultat kommer från en "test factor"-metod som hittar
//     det optimala vittnet ur träningsdata innan det testas mot skarp data.
// Slutsatsen från vår ROC-studie står sig alltså även här, bekräftad av
// försöket självt: valet/kalibreringen av vittnesFORMEN — inte bara datan —
// avgör känsligheten. TODO: härled/implementera Eberhard-formen med
// tillståndets asymmetri (r-parametern) och NIST:s faktiska vinklar om en
// kränkning ska eftersökas på allvar i denna data.

import type { PairedTrialCounts } from './nistBellRaw';

export interface CH74Result {
  J: number;
  T: number; // totalt antal parade trials som ingår i beräkningen
  terms: {
    P_ab: number;
    P_abPrime: number;
    P_aPrimeB: number;
    P_aPrimeBPrime: number;
    P_a: number;
    P_b: number;
  };
  rawCounts: PairedTrialCounts;
}

export function computeCH74(counts: PairedTrialCounts): CH74Result {
  const T = counts.matchedTrials;
  if (T === 0) throw new Error('Inga parade trials — kan inte beräkna CH74');

  const N = (table: Record<string, number>, key: string) => table[key] ?? 0;

  // Samklick (bägge detekterar) per inställningspar.
  const N_ab = N(counts.joint, '0,0');
  const N_abPrime = N(counts.joint, '0,1');
  const N_aPrimeB = N(counts.joint, '1,0');
  const N_aPrimeBPrime = N(counts.joint, '1,1');

  // Enkelklick hos alice vid setting=0 (oavsett bob) — summa av joint + aliceOnly för '0,*'.
  const N_a =
    N(counts.joint, '0,0') + N(counts.joint, '0,1') + N(counts.aliceOnly, '0,0') + N(counts.aliceOnly, '0,1');
  // Enkelklick hos bob vid setting=0 (oavsett alice).
  const N_b =
    N(counts.joint, '0,0') + N(counts.joint, '1,0') + N(counts.bobOnly, '0,0') + N(counts.bobOnly, '1,0');

  const P_ab = N_ab / T;
  const P_abPrime = N_abPrime / T;
  const P_aPrimeB = N_aPrimeB / T;
  const P_aPrimeBPrime = N_aPrimeBPrime / T;
  const P_a = N_a / T;
  const P_b = N_b / T;

  const J = P_ab + P_abPrime + P_aPrimeB - P_aPrimeBPrime - P_a - P_b;

  return {
    J,
    T,
    terms: { P_ab, P_abPrime, P_aPrimeB, P_aPrimeBPrime, P_a, P_b },
    rawCounts: counts,
  };
}
