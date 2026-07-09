// Signatur C — Bell/CHSH (C-rapporten). Primärtest mot den klassiska gränsen
// (§4.3): S_global − 2 > k·σ_S via bootstrap, INTE ett surrogat-p mot en
// nollkorrelerad null (den mäter fel fråga, se §4.3). Surrogaten S1–S4 används
// som sekundär selektions-/artefaktkontroll (del 2), med S4 hårt begränsad att
// aldrig bryta S ≤ 2 (§6.1 — motståndaren måste förbli klassisk).

import type { AnalysisContext, SignatureResult } from './types';
import type { NullId } from '../types/signatures';
import type { PhotonEvent } from '../types/events';
import type { RunConfig } from '../types/config';
import { std } from './stats';
import { generateNull } from '../nulls';
import type { Rng } from '../sim/rng';

interface ChshPair {
  settingA: 0 | 1;
  settingB: 0 | 1;
  outcomeA: 1 | -1;
  outcomeB: 1 | -1;
}

function lowerBoundBy(arr: PhotonEvent[], target: number): number {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (arr[mid].detectedT < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function extractChshPairs(events: PhotonEvent[], coincWindowS: number): ChshPair[] {
  const armA = events
    .filter((e) => e.arm === 'A' && e.setting !== undefined)
    .sort((a, b) => a.detectedT - b.detectedT);
  const armB = events
    .filter((e) => e.arm === 'B' && e.setting !== undefined)
    .sort((a, b) => a.detectedT - b.detectedT);

  const used = new Array(armB.length).fill(false);
  const pairs: ChshPair[] = [];

  for (const a of armA) {
    const start = lowerBoundBy(armB, a.detectedT - coincWindowS);
    let bestIdx = -1;
    let bestDt = Infinity;
    for (let j = start; j < armB.length && armB[j].detectedT <= a.detectedT + coincWindowS; j++) {
      if (used[j]) continue;
      const dt = Math.abs(armB[j].detectedT - a.detectedT);
      if (dt < bestDt) {
        bestDt = dt;
        bestIdx = j;
      }
    }
    if (bestIdx >= 0) {
      used[bestIdx] = true;
      const b = armB[bestIdx];
      pairs.push({
        settingA: a.setting as 0 | 1,
        settingB: b.setting as 0 | 1,
        outcomeA: a.pol === '+' ? 1 : -1,
        outcomeB: b.pol === '+' ? 1 : -1,
      });
    }
  }
  return pairs;
}

function computeS(pairs: ChshPair[]): number {
  const buckets: Record<string, { sum: number; n: number }> = {
    '0,0': { sum: 0, n: 0 },
    '0,1': { sum: 0, n: 0 },
    '1,0': { sum: 0, n: 0 },
    '1,1': { sum: 0, n: 0 },
  };
  for (const p of pairs) {
    const key = `${p.settingA},${p.settingB}`;
    buckets[key].sum += p.outcomeA * p.outcomeB;
    buckets[key].n += 1;
  }
  const E = (key: string) => (buckets[key].n > 0 ? buckets[key].sum / buckets[key].n : 0);
  // Standard CHSH-kombination: S = E(a,b) − E(a,b') + E(a',b) + E(a',b').
  // |S| ≤ 2 klassiskt (Bell/CHSH); |S| rapporteras (tecknet beror på godtycklig
  // vinkelkonvention, se C-rapporten §4.1).
  return Math.abs(E('0,0') - E('0,1') + E('1,0') + E('1,1'));
}

const C_NULLS: NullId[] = ['S1', 'S2', 'S3', 'S4'];

function computeSForConfig(events: PhotonEvent[], config: RunConfig): number {
  const coincWindowS = Math.max(5 * config.detector.jitterPs * 1e-12, 1e-9);
  return computeS(extractChshPairs(events, coincWindowS));
}

function bootstrapSigmaS(pairs: ChshPair[], rng: Rng, reps: number): number {
  if (pairs.length < 4) return Infinity;
  const samples: number[] = [];
  for (let r = 0; r < reps; r++) {
    const resample = Array.from({ length: pairs.length }, () => pairs[rng.uniformInt(pairs.length)]);
    samples.push(computeS(resample));
  }
  return std(samples);
}

export function analyzeC(ctx: AnalysisContext): SignatureResult {
  const { stream, config, rng, nullReplicates } = ctx;
  const coincWindowS = Math.max(5 * config.detector.jitterPs * 1e-12, 1e-9);
  const pairs = extractChshPairs(stream.events, coincWindowS);
  const S = computeS(pairs);
  const sigmaS = bootstrapSigmaS(pairs, rng.fork(), 300);
  const k = Number.isFinite(sigmaS) && sigmaS > 0 ? (S - 2) / sigmaS : 0;

  // Grov synlighetsskattning under antagande om optimala CHSH-vinklar (S = 2√2·V).
  const visibilityHat = S / (2 * Math.SQRT2);

  const nullSs: number[] = [];
  for (const nullId of C_NULLS) {
    for (let i = 0; i < nullReplicates; i++) {
      const surrogate = generateNull(nullId, stream, config, rng.fork());
      nullSs.push(computeSForConfig(surrogate.events, config));
    }
  }
  const maxNullS = nullSs.length ? Math.max(...nullSs) : 2;
  const adversaryHoldsLine = maxNullS <= 2 + 1e-6;

  let verdict: SignatureResult['verdict'] = 'none';
  let verdictLabelSv = 'C-none';
  if (S > 2) {
    if (k > 3) {
      verdict = 'suspect';
      verdictLabelSv = 'C-suspect';
    }
    if (k > 5 && visibilityHat > 1 / Math.SQRT2 && adversaryHoldsLine) {
      verdict = 'strong';
      verdictLabelSv = 'C-strong (approx. tröskel, v1)';
    }
  }

  return {
    id: 'C',
    verdict,
    verdictLabelSv,
    components: [
      { key: 's_global', labelSv: 'S (CHSH)', value: S, classicalReference: 2 },
      { key: 'k_sigma', labelSv: '(S − 2) / σ_S', value: k },
      { key: 'visibility', labelSv: 'Synlighet V (skattad)', value: visibilityHat, classicalReference: 1 / Math.SQRT2 },
      { key: 'coincidences', labelSv: 'Antal A/B-koincidenser', value: pairs.length },
    ],
    redFlags: [
      {
        code: 'C-RF-ADVERSARY',
        labelSv: 'Klassisk motståndare bröt gränsen',
        triggered: !adversaryHoldsLine,
        detailSv: 'S4-motståndaren gav S > 2 — vittnet är inte försvarbart (kategorifel, se C-rapporten §6.1).',
      },
      {
        code: 'C-RF-LOWPAIRS',
        labelSv: 'Få koincidenser',
        triggered: pairs.length < 30,
        detailSv: 'Bootstrap-σ_S och S är opålitliga vid < 30 A/B-koincidenser.',
      },
    ],
    nullsUsed: C_NULLS,
    primaryNull: { labelSv: 'S (CHSH) mot S1–S4', observed: S, nullValues: nullSs },
    summarySv:
      'CHSH beräknad från faktiska A/B-koincidenser vid konfigurerade analysatorvinklar. ' +
      'Primärtest: S − 2 i enheter av bootstrap-σ_S — inte bara jämförelse mot en nollkorrelerad surrogat-p.',
    floorNoteSv: 'Par-golvet: signaturen kräver äkta koincidenser mellan armarna — utspädd parbudget dödar den, inte statistik.',
  };
}
