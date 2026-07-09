// Signatur E — Kod-lik lågdimensionalitet (E-rapporten). ÄRVER B:s rådata.
// Effektiv dimension = deltagarkvot (participation ratio) på ett 6-kanalers
// binnat räknefeature (n_H,n_V,n_D,n_A,n_R,n_L per tidsbin) — konceptuellt
// samma objekt som B:s g²/Stokes-block, bara i räkneform istället för g²-form.
// E-strong KRÄVER per definition ett oberoende A/B/C/D-vittne från disjunkt
// kedja (§5.2/§61 i syntesrapporten) — den här kodbasen har ingen sådan andra
// kedja, så E:s verdict är hårdkodat begränsat till max 'suspect' (arvsregeln
// går inte att köpa sig ur med fler nulls).

import type { AnalysisContext, SignatureResult } from './types';
import type { PhotonEvent } from '../types/events';
import type { NullId } from '../types/signatures';
import { covMatrix, participationRatio, empiricalPValue } from './stats';
import { generateNull } from '../nulls';

const BIN_WIDTH_S = 0.5;
const E_NULLS: NullId[] = ['S1', 'S3', 'S5'];

const COLUMN_INDEX: Record<string, number> = {
  'HV+': 0,
  'HV-': 1,
  'DA+': 2,
  'DA-': 3,
  'RL+': 4,
  'RL-': 5,
};

function binFeatureVectors(events: PhotonEvent[], duration: number, binWidth: number): number[][] {
  const numBins = Math.max(1, Math.ceil(duration / binWidth));
  const feats: number[][] = Array.from({ length: numBins }, () => [0, 0, 0, 0, 0, 0]);
  for (const e of events) {
    if (!e.basis || !e.pol) continue;
    const idx = Math.min(numBins - 1, Math.floor(e.detectedT / binWidth));
    const col = COLUMN_INDEX[`${e.basis}${e.pol}`];
    if (col !== undefined) feats[idx][col]++;
  }
  return feats;
}

function effectiveDimension(events: PhotonEvent[], duration: number): number {
  const feats = binFeatureVectors(events, duration, BIN_WIDTH_S);
  return participationRatio(covMatrix(feats));
}

export function analyzeE(ctx: AnalysisContext): SignatureResult {
  const { stream, config, rng, nullReplicates } = ctx;
  const tomographyEvents = stream.events.filter((e) => e.arm === 'A' && e.basis !== undefined);
  const dEff = effectiveDimension(tomographyEvents, stream.duration);

  const nullDs: number[] = [];
  for (const nullId of E_NULLS) {
    for (let i = 0; i < nullReplicates; i++) {
      const surrogate = generateNull(nullId, stream, config, rng.fork());
      const surrogateTomography = surrogate.events.filter((e) => e.arm === 'A' && e.basis !== undefined);
      nullDs.push(effectiveDimension(surrogateTomography, surrogate.duration));
    }
  }
  const pValue = empiricalPValue(dEff, nullDs, 'less');

  let verdict: SignatureResult['verdict'] = 'none';
  let verdictLabelSv = 'E-none';
  if (pValue < 1e-2) {
    verdict = 'suspect'; // hård cap: strong kräver externt vittne, se filhuvud
    verdictLabelSv = 'E-suspect (max — externt vittne saknas för strong)';
  }

  return {
    id: 'E',
    verdict,
    verdictLabelSv,
    components: [
      { key: 'd_eff', labelSv: 'Effektiv dimension (deltagarkvot)', value: dEff, pValue, classicalReference: 6 },
    ],
    redFlags: [
      {
        code: 'E-RF-NOWITNESS',
        labelSv: 'Inget externt vittne — strong ej möjlig',
        triggered: true,
        detailSv: 'E-strong kräver ett oberoende A/B/C/D-vittne från disjunkt detektorkedja (arvsregeln). Ej tillgängligt i denna plattform.',
      },
    ],
    nullsUsed: E_NULLS,
    primaryNull: { labelSv: 'Effektiv dimension mot S1/S3/S5', observed: dEff, nullValues: nullDs },
    summarySv: 'Effektiv dimension hos B:s binnade räknefeature, jämförd mot S1/S3/S5 (inkl. drift-null).',
    floorNoteSv: 'Kompression/lågdim är klassisk vardag — E:s utsagokraft är strukturell, inte i sig kvantmässig.',
  };
}
