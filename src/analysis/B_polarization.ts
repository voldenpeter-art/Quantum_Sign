// Signatur B — Polarisation–tid-korrelation (B-rapporten).
// B-0/B-1: g²_ab-matris + Stokes C_ij/Σ (via bFeatures, delas med D/E/F).
// B-2: Cauchy–Schwarz-vittnet R_CS — klassisk gräns R_CS ≤ 1 (§4.1).

import type { AnalysisContext, SignatureResult, NullFamilyResult } from './types';
import type { NullId } from '../types/signatures';
import { computeBFeatures } from './bFeatures';
import { empiricalPValue, empiricalTail, pSquared, resolutionInsufficient } from './stats';
import { generateNull, generateS4Adversary, S4_CHSH_ADVERSARIES } from '../nulls';

const STRUCTURAL_NULLS: NullId[] = ['S1', 'S2', 'S3'];
const B_NULLS: NullId[] = [...STRUCTURAL_NULLS, 'S4'];

export function analyzeB(ctx: AnalysisContext): SignatureResult {
  const { stream, config, rng, nullReplicates } = ctx;
  const features = computeBFeatures(stream);
  const rCSMax = Math.max(0, ...features.basisWitness.map((b) => b.rCSMax));

  // p⁽²⁾-regeln på strukturdelen: ett p per surrogatfamilj, näst minsta bär.
  const dgCrossNulls: number[] = [];
  const dgPByFamily: number[] = [];
  for (const nullId of STRUCTURAL_NULLS) {
    const familyDg: number[] = [];
    for (let i = 0; i < nullReplicates; i++) {
      const surrogate = generateNull(nullId, stream, config, rng.fork());
      familyDg.push(computeBFeatures(surrogate).dgCross);
    }
    dgPByFamily.push(empiricalPValue(features.dgCross, familyDg, 'greater'));
    dgCrossNulls.push(...familyDg);
  }
  const pDgCross = pSquared(dgPByFamily);

  // NAMNGIVEN S4-MOTSTÅNDARFAMILJ på R_CS-vittnet: R_CS > 1 måste slå VAR OCH EN
  // av de klassiska motståndarna {lhvCapped, uncorrelated, detectorTrimmed,
  // selectionStress}. Till skillnad från de STRUKTURELLA surrogaten (S1–S3, där
  // p⁽²⁾/näst minsta gäller) är S4-familjen obligatoriska fysiska motståndare →
  // "slå ALLA" = det STÖRSTA per-motståndar-p:t bär (max, inte p⁽²⁾).
  const rcsOf = (s: ReturnType<typeof computeBFeatures>) =>
    Math.max(0, ...s.basisWitness.map((b) => b.rCSMax));
  const rCSNulls: number[] = [];
  const rcsFamilyResults: NullFamilyResult[] = S4_CHSH_ADVERSARIES.map((name) => {
    const nullVals: number[] = [];
    for (let i = 0; i < nullReplicates * 2; i++) {
      nullVals.push(rcsOf(computeBFeatures(generateS4Adversary(name, config, rng.fork()))));
    }
    rCSNulls.push(...nullVals);
    return { nullId: name, observed: rCSMax, ...empiricalTail(rCSMax, nullVals, 'greater') };
  });
  const pRCS = Math.max(...rcsFamilyResults.map((f) => f.pEmpirical)); // slå ALLA
  const insufficient = resolutionInsufficient(rcsFamilyResults.map((f) => f.pResolution));

  // FÖRTJÄNAD NOMENKLATUR (types.ts): R_CS > 1 ÄR ett äkta Cauchy–Schwarz-brott
  // (klassiskt omöjligt) ⇒ suspect/strong är förtjänade kvantklasser. Enbart
  // signifikant korsstruktur (dgCross) som överlevt surrogaten men UTAN R_CS > 1
  // är kvantneutral ⇒ taket är 'structural' (B-struct-unresolved).
  let verdict: SignatureResult['verdict'] = 'none';
  let verdictLabelSv = 'B-none';
  if (pDgCross < 1e-2) {
    verdict = 'structural';
    verdictLabelSv = 'B-struct-unresolved (korsstruktur, kvantneutral)';
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
      { key: 'r_cs_max', labelSv: 'R_CS (max över baser)', value: rCSMax, pValue: pRCS, classicalReference: 1, primary: true },
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
      {
        code: 'B-RF-LOWCOUNTS',
        labelSv: 'Låg räknestatistik i minst en bas',
        triggered: features.basisWitness.some((b) => b.lowCount),
        detailSv:
          'Färre än 5 händelser i +/− för en bas — R_CS uteslöts för den basen (satt till 0) istället för att ' +
          'riskera en division nära noll i nämnaren, som annars kan blåsa upp kvoten mot orimliga värden.',
      },
    ],
    nullsUsed: B_NULLS,
    nullFamilyResults: rcsFamilyResults,
    insufficientResolution: insufficient,
    primaryNull: { labelSv: 'R_CS (max över baser) mot S4-motståndarfamiljen (slå alla)', observed: rCSMax, nullValues: rCSNulls },
    summarySv:
      'g²_ab-matris och Stokes-korrelationer beräknade på arm A:s tomografihändelser (HV/DA/RL). ' +
      'R_CS > 1 vore klassiskt omöjligt enligt Cauchy–Schwarz — se rödflagga om nämnarkaveat.',
    floorNoteSv: 'Depolarisation krymper all struktur mot noll; dödtid i R_CS-nämnaren kan blåsa upp kvoten.',
  };
}
