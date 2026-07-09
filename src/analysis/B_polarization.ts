// Signatur B — Polarisation–tid-korrelation (B-rapporten).
// B-0/B-1: g²_ab-matris + Stokes C_ij/Σ (via bFeatures, delas med D/E/F).
// B-2: Cauchy–Schwarz-vittnet R_CS — klassisk gräns R_CS ≤ 1 (§4.1).

import type { AnalysisContext, SignatureResult } from './types';
import type { NullId } from '../types/signatures';
import { computeBFeatures } from './bFeatures';
import { empiricalPValue } from './stats';
import { generateNull } from '../nulls';

const STRUCTURAL_NULLS: NullId[] = ['S1', 'S2', 'S3'];
const B_NULLS: NullId[] = [...STRUCTURAL_NULLS, 'S4'];

export function analyzeB(ctx: AnalysisContext): SignatureResult {
  const { stream, config, rng, nullReplicates } = ctx;
  const features = computeBFeatures(stream);
  const rCSMax = Math.max(0, ...features.basisWitness.map((b) => b.rCSMax));

  const dgCrossNulls: number[] = [];
  for (const nullId of STRUCTURAL_NULLS) {
    for (let i = 0; i < nullReplicates; i++) {
      const surrogate = generateNull(nullId, stream, config, rng.fork());
      dgCrossNulls.push(computeBFeatures(surrogate).dgCross);
    }
  }
  const pDgCross = empiricalPValue(features.dgCross, dgCrossNulls, 'greater');

  const rCSNulls: number[] = [];
  for (let i = 0; i < nullReplicates * 2; i++) {
    const surrogate = generateNull('S4', stream, config, rng.fork());
    const f = computeBFeatures(surrogate);
    rCSNulls.push(Math.max(0, ...f.basisWitness.map((b) => b.rCSMax)));
  }
  const pRCS = empiricalPValue(rCSMax, rCSNulls, 'greater');

  let verdict: SignatureResult['verdict'] = 'none';
  let verdictLabelSv = 'B-none';
  if (pDgCross < 1e-2) {
    verdict = 'classical';
    verdictLabelSv = 'B-classical';
  }
  if (rCSMax > 1 && pRCS < 1e-2) {
    verdict = 'suspect';
    verdictLabelSv = 'B-quantum-suspect';
  }
  if (rCSMax > 1 && pRCS < 1e-3) {
    verdict = 'strong';
    verdictLabelSv = 'B-quantum-strong (approx. tröskel, v1)';
  }

  return {
    id: 'B',
    verdict,
    verdictLabelSv,
    components: [
      { key: 'dg_cross', labelSv: 'D_g^cross (korsdel)', value: features.dgCross, pValue: pDgCross },
      { key: 'dg_auto', labelSv: 'D_g^auto (autodel, diagnostik)', value: features.dgAuto },
      { key: 'r_cs_max', labelSv: 'R_CS (max över baser)', value: rCSMax, pValue: pRCS, classicalReference: 1 },
      ...features.basisWitness.map((b) => ({
        key: `rcs_${b.basis}`,
        labelSv: `R_CS, bas ${b.basis}`,
        value: b.rCSMax,
        classicalReference: 1,
      })),
    ],
    redFlags: [
      {
        code: 'B-RF-DENOM',
        labelSv: 'R_CS-nämnare ej dödtidsfri',
        triggered: true,
        detailSv:
          'v1-förenkling: nämnartermerna g²₁₁(0)/g²₂₂(0) skattas direkt, inte via detektorsplitting eller ' +
          'modellextraktion (B-rapporten §4.2). R_CS-siffran är pedagogisk, inte ett skarpt B-2-vittne.',
      },
    ],
    nullsUsed: B_NULLS,
    primaryNull: { labelSv: 'R_CS (max över baser) mot S4', observed: rCSMax, nullValues: rCSNulls },
    summarySv:
      'g²_ab-matris och Stokes-korrelationer beräknade på arm A:s tomografihändelser (HV/DA/RL). ' +
      'R_CS > 1 vore klassiskt omöjligt enligt Cauchy–Schwarz — se rödflagga om nämnarkaveat.',
    floorNoteSv: 'Depolarisation krymper all struktur mot noll; dödtid i R_CS-nämnaren kan blåsa upp kvoten.',
  };
}
