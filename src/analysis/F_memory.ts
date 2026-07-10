// Signatur F — Non-Markovianitet / minne (F-rapporten). Letar efter en
// revival-topp i g²(τ)-svansen som avviker från en monotont avklingande
// referenskurva ("semigrupp"-liknande Markov-baslinje). F-aktiv (kvantstark
// nivå) kräver preparerbara probtillstånd i C/G-labbet — utanför denna
// plattform, så precis som E är F:s verdict hårdkodat max 'suspect'.
//
// Källberoende: för `entangled` används arm A:s (+, −)-par inom HV-basen
// (ärver B, arvsregeln). För `memoryEcho` (och övriga enkanalskällor) finns
// ingen polarisation — F arbetar då direkt på HBT-kanalernas g²(τ), en
// v1-avvikelse från strikt B-arv (dokumenterad, se CLAUDE.md §4.1).

import type { AnalysisContext, SignatureResult } from './types';
import type { EventStream } from '../types/events';
import type { NullId } from '../types/signatures';
import { computeG2Curve } from './coincidence';
import { rangeSymmetric, empiricalPValue } from './stats';
import { generateNull } from '../nulls';

const F_NULLS: NullId[] = ['S1', 'S3', 'S5'];
const TAU_MAX_S = 0.3;

function extractPairTimestamps(stream: EventStream): [number[], number[]] {
  const hasArms = stream.events.some((e) => e.arm);
  if (hasArms) {
    const armA = stream.events.filter((e) => e.arm === 'A' && e.basis === 'HV');
    const pos = armA.filter((e) => e.pol === '+').map((e) => e.detectedT).sort((a, b) => a - b);
    const neg = armA.filter((e) => e.pol === '-').map((e) => e.detectedT).sort((a, b) => a - b);
    return [pos, neg];
  }
  const d1 = stream.events.filter((e) => e.channel === 'D1').map((e) => e.detectedT).sort((a, b) => a - b);
  const d2 = stream.events.filter((e) => e.channel === 'D2').map((e) => e.detectedT).sort((a, b) => a - b);
  return [d1, d2];
}

function revivalScore(tsX: number[], tsY: number[], duration: number): { score: number; tauAt: number } {
  const binWidth = TAU_MAX_S / 30;
  const tauGrid = rangeSymmetric(0, TAU_MAX_S, binWidth);
  const curve = computeG2Curve(tsX, tsY, duration, tauGrid, binWidth, false);
  if (curve.length === 0) return { score: 0, tauAt: 0 };
  const g2AtZero = curve[0].g2;
  const tauChar = TAU_MAX_S / 5;
  let bestScore = -Infinity;
  let bestTau = 0;
  for (const p of curve) {
    const envelope = 1 + (g2AtZero - 1) * Math.exp(-p.tau / tauChar);
    const s = p.g2 - envelope;
    if (s > bestScore) {
      bestScore = s;
      bestTau = p.tau;
    }
  }
  return { score: bestScore, tauAt: bestTau };
}

export function analyzeF(ctx: AnalysisContext): SignatureResult {
  const { stream, config, rng, nullReplicates } = ctx;
  const [tsX, tsY] = extractPairTimestamps(stream);
  const { score, tauAt } = revivalScore(tsX, tsY, stream.duration);

  const nullScores: number[] = [];
  for (const nullId of F_NULLS) {
    for (let i = 0; i < nullReplicates; i++) {
      const surrogate = generateNull(nullId, stream, config, rng.fork());
      const [sx, sy] = extractPairTimestamps(surrogate);
      nullScores.push(revivalScore(sx, sy, surrogate.duration).score);
    }
  }
  const pValue = empiricalPValue(score, nullScores, 'greater');

  let verdict: SignatureResult['verdict'] = 'none';
  let verdictLabelSv = 'F-none';
  if (score > 0 && pValue < 1e-2) {
    verdict = 'suspect'; // hård cap: F-aktiv (C/G-labbet) krävs för starkare nivå
    verdictLabelSv = 'F-suspect (max — F-aktiv-protokoll saknas)';
  }

  return {
    id: 'F',
    verdict,
    verdictLabelSv,
    components: [
      { key: 'revival_score', labelSv: 'Revival-poäng (max avvikelse från Markov-baslinje)', value: score, pValue, primary: true },
      { key: 'tau_at', labelSv: 'τ vid maximal avvikelse (s)', value: tauAt, unit: 's' },
    ],
    redFlags: [
      {
        code: 'F-RF-PASSIVE',
        labelSv: 'Passiv F — aktiv nivå ej tillgänglig',
        triggered: true,
        detailSv: 'F-aktiv kräver preparerbara probtillstånd (C/G-labbet). Denna plattform mäter endast F-passiv.',
      },
    ],
    nullsUsed: F_NULLS,
    primaryNull: { labelSv: 'Revival-poäng mot S1/S3/S5', observed: score, nullValues: nullScores },
    summarySv: 'Sökning efter en revival-topp i g²(τ)-svansen ovanpå en monoton Markov-referenskurva.',
    floorNoteSv: 'Flicker (klassiskt långminne i varje detektor) är den huvudsakliga golv-/bedragarrisken.',
  };
}
