// Signatur A — Icke-klassisk fotonstatistik (A-rapporten).
// Bindande: EVIDENS HÄMTAS ENDAST UR KORSKORRELATION mellan D1/D2 (§4.1).
// Matchat filter över förregistrerat fiducialfönster ger teckendiskriminatorn
// ε; Fano/Mandel Q som sekundärt vittne. S_A-familjen reduceras i v1 till
// [ε, Δ_anti, Q] — de faktoriella kumulanterna κ₃ᶠ/κ₄ᶠ är TODO(rapport):
// kräver högre ordningens klickstatistik, utanför v1-scope.

import type { AnalysisContext, SignatureResult } from './types';
import type { NullId } from '../types/signatures';
import { computeG2Curve } from './coincidence';
import { mean, variance, binCounts, rangeSymmetric, empiricalPValue } from './stats';
import { generateNull } from '../nulls';

function channelTimestamps(events: { channel: string; detectedT: number }[], ch: 'D1' | 'D2') {
  return events.filter((e) => e.channel === ch).map((e) => e.detectedT).sort((a, b) => a - b);
}

function matchedFilterEpsilon(
  d1: number[],
  d2: number[],
  duration: number,
  tauGrid: number[],
  binWidth: number,
  tauChar: number,
): number {
  const curve = computeG2Curve(d1, d2, duration, tauGrid, binWidth, false);
  const weights = curve.map((p) => Math.exp(-Math.abs(p.tau) / tauChar));
  const wsum = weights.reduce((a, b) => a + b, 0) || 1;
  return curve.reduce((acc, p, i) => acc + weights[i] * (p.g2 - 1), 0) / wsum;
}

const A_NULLS: NullId[] = ['S1', 'S2', 'S3', 'S4'];

export function analyzeA(ctx: AnalysisContext): SignatureResult {
  const { stream, config, rng, nullReplicates } = ctx;
  const d1 = channelTimestamps(stream.events, 'D1');
  const d2 = channelTimestamps(stream.events, 'D2');

  const tauChar = 1 / Math.max(config.sourceRateHz, 1);
  const binWidth = tauChar / 2;
  const tauGrid = rangeSymmetric(-5 * tauChar, 5 * tauChar, binWidth);

  const curve = computeG2Curve(d1, d2, stream.duration, tauGrid, binWidth, false);
  const zeroIdx = curve.reduce(
    (best, p, i) => (Math.abs(p.tau) < Math.abs(curve[best].tau) ? i : best),
    0,
  );
  const g2Zero = curve[zeroIdx]?.g2 ?? 1;
  const epsilonHat = matchedFilterEpsilon(d1, d2, stream.duration, tauGrid, binWidth, tauChar);
  const deltaAnti = Math.max(
    ...curve.filter((_, i) => i !== zeroIdx).map((p) => p.g2 - g2Zero),
    0,
  );

  const combined = [...d1, ...d2].sort((a, b) => a - b);
  const counts = binCounts(combined, stream.duration, tauChar);
  const meanN = mean(counts);
  const varN = variance(counts);
  const fano = meanN > 0 ? varN / meanN : 1;
  const mandelQ = fano - 1;

  const nullEpsilons: number[] = [];
  for (const nullId of A_NULLS) {
    for (let i = 0; i < nullReplicates; i++) {
      const surrogate = generateNull(nullId, stream, config, rng.fork());
      const sd1 = channelTimestamps(surrogate.events, 'D1');
      const sd2 = channelTimestamps(surrogate.events, 'D2');
      nullEpsilons.push(matchedFilterEpsilon(sd1, sd2, surrogate.duration, tauGrid, binWidth, tauChar));
    }
  }
  const pEpsilon = empiricalPValue(epsilonHat, nullEpsilons, 'less');

  let verdict: SignatureResult['verdict'] = 'none';
  let verdictLabelSv = 'A-none';
  if (epsilonHat < 0) {
    if (pEpsilon < 1e-3 && mandelQ < 0) {
      verdict = 'strong';
      verdictLabelSv = 'A-strong (approx. tröskel, v1)';
    } else if (pEpsilon < 1e-2) {
      verdict = 'suspect';
      verdictLabelSv = 'A-suspect';
    }
  }

  const lowCounts = d1.length < 20 || d2.length < 20;

  return {
    id: 'A',
    verdict,
    verdictLabelSv,
    components: [
      { key: 'g2_0', labelSv: 'g²(0), korskorrelation', value: g2Zero, classicalReference: 1 },
      { key: 'epsilon', labelSv: 'ε (matchat filter, teckendiskriminator)', value: epsilonHat, pValue: pEpsilon, classicalReference: 0 },
      { key: 'delta_anti', labelSv: 'Δ_anti (formvittne)', value: deltaAnti },
      { key: 'mandel_q', labelSv: 'Mandel Q', value: mandelQ, classicalReference: 0 },
      { key: 'fano', labelSv: 'Fano-faktor F', value: fano, classicalReference: 1 },
    ],
    redFlags: [
      {
        code: 'A-RF-LOWCOUNTS',
        labelSv: 'Låg räknestatistik',
        triggered: lowCounts,
        detailSv: 'D1/D2 < 20 händelser — g²-skattningen är opålitlig vid denna körningslängd/förlust.',
      },
    ],
    nullsUsed: A_NULLS,
    primaryNull: { labelSv: 'ε (matchat filter) mot S1–S4', observed: epsilonHat, nullValues: nullEpsilons },
    summarySv:
      'g²(0) skattat via korskorrelation mellan två oberoende HBT-kanaler (aldrig enkeldetektor-autokorrelation). ' +
      'ε < 0 är den enda kvantindikatorn; tecknet bevaras under utspädning.',
    floorNoteSv: 'Kontrastgolv: ε krymper med faktorn 1/M vid modutspädning, byter aldrig tecken (A-rapporten §8).',
  };
}
