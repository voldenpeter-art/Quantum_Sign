// Bryggan IBM → Signatur C. BRYGGSPEC_IBM_CHSH.md §0, §3–§6.
//
// BINDANDE: ingen konvertering till PhotonEvent, inga syntetiska tidsstämplar.
// IBM:s gate-model-data mäter båda qubitarna i samma shot — paret existerar per
// konstruktion. Bryggan bildar därför ChshPair[] direkt och matar dem in i
// C_chsh.ts:s pardirekta kärna `computeS`, som inte vet något om hur paren kom
// till. Fotonvägens `extractChshPairs` (tidsstämplar + koincidensfönster) rörs
// aldrig.
//
// Att syntetisera tidsstämplar för att återanvända fotonvägen orörd vore ett
// metodfel av samma klass som B-rapportens S2-bugg: nollhypoteserna
// (accidentals, time-slide) skulle testa en fysik som inte finns i datan.

import type { ChshPair } from '../../src/analysis/C_chsh';

/** Settingpar per CHSH-krets, i circuits.py:s bindande indexordning. */
export const IBM_CHSH_SETTINGS: Array<{ x: 0 | 1; y: 0 | 1 }> = [
  { x: 0, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
];

/**
 * Bitsträng → två ±1-utfall (BRYGGSPEC §3).
 * Qiskit little-endian: bits[0] = q1, bits[1] = q0.
 * Konvention: mätutfall '0' → +1, '1' → −1.
 */
export function bitsToOutcomes(bits: string): { a: 1 | -1; b: 1 | -1 } {
  if (!/^[01]{2}$/.test(bits)) {
    throw new Error(`Ogiltig bitsträng: "${bits}" (förväntade två bitar)`);
  }
  const q0 = bits[1];
  const q1 = bits[0];
  return { a: q0 === '0' ? 1 : -1, b: q1 === '0' ? 1 : -1 };
}

/** Ett shot i IBM-materialet. Egen typ — konverteras aldrig till PhotonEvent. */
export interface IBMShotRecord {
  jobId: string;
  pubIndex: number;
  shotIndex: number;
  measuredBits: string;
  chshSetting: { x: 0 | 1; y: 0 | 1 } | null;
}

/** Bygger ShotRecords ur avkodade PUB:ar. PUB-index i ⇒ settingpar i. */
export function toShotRecords(
  jobId: string,
  pubs: Array<{ index: number; bitstrings: string[] }>,
): IBMShotRecord[] {
  const out: IBMShotRecord[] = [];
  for (const pub of pubs) {
    const setting = IBM_CHSH_SETTINGS[pub.index] ?? null;
    pub.bitstrings.forEach((bits, shotIndex) => {
      out.push({
        jobId,
        pubIndex: pub.index,
        shotIndex,
        measuredBits: bits,
        chshSetting: setting,
      });
    });
  }
  return out;
}

/** ShotRecords → ChshPair[]. Stoppar om något shot saknar setting (§4-stoppregel). */
export function toChshPairs(records: IBMShotRecord[]): ChshPair[] {
  return records.map((r) => {
    if (!r.chshSetting) {
      throw new Error(
        `Shot ${r.pubIndex}#${r.shotIndex} saknar chshSetting — stoppregel utlöst (manifest §4)`,
      );
    }
    const { a, b } = bitsToOutcomes(r.measuredBits);
    return {
      settingA: r.chshSetting.x,
      settingB: r.chshSetting.y,
      outcomeA: a,
      outcomeB: b,
    };
  });
}

/** Korrelationer och σ_S per settingpar (BRYGGSPEC §4–§5). */
export function correlations(pairs: ChshPair[]): {
  E: Record<string, number>;
  counts: Record<string, number>;
  sigmaS: number;
} {
  const buckets: Record<string, { sum: number; n: number }> = {
    '0,0': { sum: 0, n: 0 },
    '0,1': { sum: 0, n: 0 },
    '1,0': { sum: 0, n: 0 },
    '1,1': { sum: 0, n: 0 },
  };
  for (const p of pairs) {
    const b = buckets[`${p.settingA},${p.settingB}`];
    b.sum += p.outcomeA * p.outcomeB;
    b.n += 1;
  }
  const E: Record<string, number> = {};
  const counts: Record<string, number> = {};
  let varSum = 0;
  for (const key of ['0,0', '0,1', '1,0', '1,1']) {
    const b = buckets[key];
    if (b.n === 0) throw new Error(`Settingpar ${key} saknar shots — stoppregel utlöst`);
    E[key] = b.sum / b.n;
    counts[key] = b.n;
    varSum += (1 - E[key] ** 2) / b.n;
  }
  return { E, counts, sigmaS: Math.sqrt(varSum) };
}

// --- Giltiga nullar för shot-data (BRYGGSPEC §6) ---------------------------
//
// OGILTIGA (kräver tidsstämplar som inte finns): S2 time-slide, accidentals,
// koincidensfönster-variation, dödtidsnullar.
// GILTIGA: label-shuffle inom settingpar, stratifierad bootstrap, permutation
// av settingetiketter mellan par.

/**
 * Label-shuffle INOM settingpar: permuterar B-utfallen inom varje bucket.
 * Bevarar marginalerna men bryter A↔B-korrelationen — nollhypotesen "ingen
 * korrelation, samma marginaler".
 */
export function labelShuffleWithinSettings(
  pairs: ChshPair[],
  rand: () => number,
): ChshPair[] {
  const byKey = new Map<string, ChshPair[]>();
  for (const p of pairs) {
    const k = `${p.settingA},${p.settingB}`;
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k)!.push(p);
  }
  const out: ChshPair[] = [];
  for (const group of byKey.values()) {
    const bs = group.map((p) => p.outcomeB);
    for (let i = bs.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [bs[i], bs[j]] = [bs[j], bs[i]];
    }
    group.forEach((p, i) => out.push({ ...p, outcomeB: bs[i] }));
  }
  return out;
}

/** Stratifierad bootstrap: omsamplar inom varje settingpar, bevarar bucketantal. */
export function stratifiedBootstrap(pairs: ChshPair[], rand: () => number): ChshPair[] {
  const byKey = new Map<string, ChshPair[]>();
  for (const p of pairs) {
    const k = `${p.settingA},${p.settingB}`;
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k)!.push(p);
  }
  const out: ChshPair[] = [];
  for (const group of byKey.values()) {
    for (let i = 0; i < group.length; i++) {
      out.push(group[Math.floor(rand() * group.length)]);
    }
  }
  return out;
}
