// Bryggan IBM → Mermin N=3 och den flersessionsdata Signatur D behöver.
//
// Samma bindande regel som CHSH-bryggan: ingen konvertering till PhotonEvent,
// inga syntetiska tidsstämplar. Mermin-värdet är en paritetssumma över fyra
// mätbaser, inte en koincidensanalys — det finns ingenting i estimatorn som
// behöver en tidsaxel.
//
//   M = ⟨XXX⟩ − ⟨XYY⟩ − ⟨YXY⟩ − ⟨YYX⟩
//   Lokal realism: |M| ≤ 2.   Kvantmaximum: M = 4.
//
// PUB-ordningen är circuits.py:s `mermin_battery()`, INTERFOLIERAD parvis:
//   0 ghz_xxx, 1 prod_xxx, 2 ghz_xyy, 3 prod_xyy,
//   4 ghz_yxy, 5 prod_yxy, 6 ghz_yyx, 7 prod_yyx
// Interfolieringen finns för att exekveringsordning inte ska konfoundera
// tillståndstyp; bryggan måste därför plocka udda/jämna index, inte block.

import type { IbmPub } from './ibmBitArray';

/** Term och tecken i Mermin-summan, i batteriets basordning. */
export const MERMIN_TERMS: Array<{ bases: string; sign: 1 | -1 }> = [
  { bases: 'XXX', sign: +1 },
  { bases: 'XYY', sign: -1 },
  { bases: 'YXY', sign: -1 },
  { bases: 'YYX', sign: -1 },
];

export type MerminArm = 'ghz' | 'control';

/**
 * Paritetsegenvärde för ett shot: (−1)^(antal ettor).
 * Bitordningen saknar betydelse här — pariteten är invariant under permutation
 * av bitarna, vilket är exakt varför bitordningsproben inte behövdes för M.
 */
export function parityOf(bits: string): 1 | -1 {
  let ones = 0;
  for (const c of bits) {
    if (c === '1') ones++;
    else if (c !== '0') throw new Error(`Ogiltig bitsträng: "${bits}"`);
  }
  return ones % 2 === 0 ? 1 : -1;
}

export interface MerminTermResult {
  bases: string;
  sign: 1 | -1;
  expectation: number;
  shots: number;
}

export interface MerminResult {
  arm: MerminArm;
  terms: MerminTermResult[];
  M: number;
  sigmaM: number;
}

/**
 * Mermin-värde för en arm ur ett interfolierat batteri.
 * `arm='ghz'` läser PUB 0,2,4,6; `arm='control'` läser 1,3,5,7.
 */
export function merminValue(pubs: IbmPub[], arm: MerminArm): MerminResult {
  if (pubs.length !== 8) {
    throw new Error(`Mermin-batteriet kräver 8 PUB:ar, fick ${pubs.length}`);
  }
  const offset = arm === 'ghz' ? 0 : 1;
  const terms: MerminTermResult[] = [];
  let M = 0;
  let varSum = 0;
  MERMIN_TERMS.forEach((term, i) => {
    const pub = pubs[2 * i + offset];
    if (pub.numBits !== 3) {
      throw new Error(`PUB ${pub.index}: förväntade 3 bitar, fick ${pub.numBits}`);
    }
    let sum = 0;
    for (const bits of pub.bitstrings) sum += parityOf(bits);
    const n = pub.bitstrings.length;
    const e = sum / n;
    terms.push({ bases: term.bases, sign: term.sign, expectation: e, shots: n });
    M += term.sign * e;
    varSum += (1 - e * e) / n; // tecknet försvinner i kvadraten
  });
  return { arm, terms, M, sigmaM: Math.sqrt(varSum) };
}

/** ⟨X^⊗N⟩ ur en GHZ-X-PUB (koherensindikatorn, en enda paritetspunkt). */
export function xParityExpectation(pub: IbmPub): { value: number; sigma: number; shots: number } {
  let sum = 0;
  for (const bits of pub.bitstrings) sum += parityOf(bits);
  const n = pub.bitstrings.length;
  const value = sum / n;
  return { value, sigma: Math.sqrt((1 - value * value) / n), shots: n };
}
