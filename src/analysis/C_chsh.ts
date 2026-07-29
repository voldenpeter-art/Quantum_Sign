// Signatur C — Bell/CHSH (C-rapporten). Primärtest mot den klassiska gränsen
// (§4.3): S_global − 2 > k·σ_S via bootstrap, INTE ett surrogat-p mot en
// nollkorrelerad null (den mäter fel fråga, se §4.3). Surrogaten S1–S4 används
// som sekundär selektions-/artefaktkontroll (del 2), med S4 hårt begränsad att
// aldrig bryta S ≤ 2 (§6.1 — motståndaren måste förbli klassisk).

import type { AnalysisContext, SignatureResult } from './types';
import type { NullId } from '../types/signatures';
import type { PhotonEvent } from '../types/events';
import type { RunConfig } from '../types/config';
import { std, normalSurvival, median } from './stats';
import { generateNull, generateS4Layer2 } from '../nulls';
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
  // STRATIFIERAD bootstrap (feedback 2026-07-29): omsampla INOM varje
  // inställningspar-bucket och bevara varje buckets antal. En vanlig bootstrap
  // över alla par blandar om proportionerna mellan (0,0)/(0,1)/(1,0)/(1,1) och
  // ger en missvisande σ_S — CHSH-statistikan är en funktion av fyra separata
  // korrelationer E(a,b), var och en skattad vid fast antal i sin bucket.
  const buckets: Record<string, ChshPair[]> = { '0,0': [], '0,1': [], '1,0': [], '1,1': [] };
  for (const p of pairs) buckets[`${p.settingA},${p.settingB}`].push(p);
  // Alla fyra kombinationer måste ha minst ett par — annars är S ändå odefinierad.
  const groups = Object.values(buckets);
  if (groups.some((b) => b.length === 0)) return Infinity;
  const samples: number[] = [];
  for (let r = 0; r < reps; r++) {
    const resample: ChshPair[] = [];
    for (const bucket of groups) {
      for (let i = 0; i < bucket.length; i++) resample.push(bucket[rng.uniformInt(bucket.length)]);
    }
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
  // p härledd ur primärtestet (S − 2 > k·σ_S), INTE ur surrogat-p mot en
  // nollkorrelerad null (C-rapporten §4.3 varnar uttryckligen för det senare).
  // Används som huvudstatistika för kombinerad evidens (analysis/combine.ts).
  const pFromK = normalSurvival(k);

  // Grov synlighetsskattning under antagande om optimala CHSH-vinklar (S = 2√2·V).
  const visibilityHat = S / (2 * Math.SQRT2);

  // S4 (den klassiska motståndaren) är AVSIKTLIGT konstruerad att sitta vid
  // Bell-gränsen (visibility 1/√2, E[S]=2 exakt) — C-rapporten §6.1 kräver att
  // den "aktivt trimmas" så nära gränsen som möjligt. Vid E[S]=2 exakt kommer
  // ~hälften av enskilda surrogatdrag ändå överskrida 2 av ren stickprovsbrus.
  // ETT svep över 1500 körningar visade att max() över en handfull sådana drag
  // (en extrem ordningsstatistika) gav en rödflaggsfrekvens som mest speglade
  // fältstyrkans inverkan på Math.max(konfigurerad, gräns)-formeln i S4, inte
  // instrumentartefakter — se scripts/sweep.ts-analysen. Motståndarkontrollen
  // använder därför MEDIANEN av enbart S4-replikaten (robust mot enstaka
  // extremdrag) för verdikt-grinden, men rapporterar även max som diagnostik.
  // TVÅLAGERS-S4 (syntesrapporten §7 punkt 4): lager 1 = värsta-fall
  // detektorartefakt (S4, sitter avsiktligt vid Bell-gränsen), lager 2 = S4 +
  // analys-/urvalsstress (generateS4Layer2). Motståndaren måste hålla linjen
  // (median S ≤ 2) i BÅDA lagren — annars är vittnet inte försvarbart. Detta är
  // p⁽²⁾-logiken (kräv att båda lagren håller) applicerad på C:s motståndargrind.
  const S4_REPLICATES = nullReplicates * 3;
  const s4NullSs: number[] = [];
  const s4NullSsL2: number[] = [];
  for (let i = 0; i < S4_REPLICATES; i++) {
    s4NullSs.push(computeSForConfig(generateNull('S4', stream, config, rng.fork()).events, config));
    s4NullSsL2.push(computeSForConfig(generateS4Layer2(config, rng.fork()).events, config));
  }
  const structuralNullSs: number[] = [];
  for (const nullId of ['S1', 'S2', 'S3'] as const) {
    for (let i = 0; i < nullReplicates; i++) {
      const surrogate = generateNull(nullId, stream, config, rng.fork());
      structuralNullSs.push(computeSForConfig(surrogate.events, config));
    }
  }
  const nullSs = [...structuralNullSs, ...s4NullSs, ...s4NullSsL2];
  const medianS4 = median(s4NullSs);
  const medianS4L2 = median(s4NullSsL2);
  const maxS4 = s4NullSs.length ? Math.max(...s4NullSs) : 2;
  // Kräv att BÅDA lagren håller linjen (max av de två medianerna ≤ 2).
  const adversaryHoldsLine = medianS4 <= 2 + 1e-6 && medianS4L2 <= 2 + 1e-6;

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
      { key: 's_global', labelSv: 'S (CHSH)', value: S, pValue: pFromK, classicalReference: 2, primary: true },
      { key: 'k_sigma', labelSv: '(S − 2) / σ_S', value: k },
      { key: 'visibility', labelSv: 'Synlighet V (skattad)', value: visibilityHat, classicalReference: 1 / Math.SQRT2 },
      { key: 'coincidences', labelSv: 'Antal A/B-koincidenser', value: pairs.length },
      { key: 's4_median', labelSv: 'S4-motståndare L1 (detektor), median', value: medianS4, classicalReference: 2 },
      { key: 's4_median_l2', labelSv: 'S4-motståndare L2 (+urvalsstress), median', value: medianS4L2, classicalReference: 2 },
      { key: 's4_max', labelSv: 'S4-motståndare, värsta drag (diagnostik)', value: maxS4, classicalReference: 2 },
    ],
    redFlags: [
      {
        code: 'C-RF-ADVERSARY',
        labelSv: 'Klassisk motståndare bröt gränsen (median, något lager)',
        triggered: !adversaryHoldsLine,
        detailSv:
          'Medianen av S4-motståndarens repliker gav S > 2 i minst ETT av de två lagren (L1 detektor / L2 ' +
          '+urvalsstress) — vittnet är inte försvarbart (kategorifel, se C-rapporten §6.1). Ett enstaka ' +
          'extremdrag räknas inte som brott (motståndaren sitter avsiktligt vid gränsen och enstaka drag ' +
          'överskrider den av ren brus även när kontrollen är korrekt kalibrerad).',
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
