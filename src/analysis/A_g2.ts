// Signatur A — Icke-klassisk fotonstatistik (A-rapporten).
// Bindande: EVIDENS HÄMTAS ENDAST UR KORSKORRELATION mellan D1/D2 (§4.1).
// Matchat filter över förregistrerat fiducialfönster ger teckendiskriminatorn
// ε; Fano/Mandel Q som sekundärt vittne. S_A-familjen reduceras i v1 till
// [ε, Δ_anti, Q] — de faktoriella kumulanterna κ₃ᶠ/κ₄ᶠ är TODO(rapport):
// kräver högre ordningens klickstatistik, utanför v1-scope.

import type { AnalysisContext, SignatureResult } from './types';
import type { PhotonEvent } from '../types/events';
import type { NullId } from '../types/signatures';
import type { Rng } from '../sim/rng';
import { computeG2Curve } from './coincidence';
import { mean, variance, binCounts, rangeSymmetric, empiricalPValue, pSquared } from './stats';
import { generateNull } from '../nulls';

function channelTimestamps(events: { channel: string; detectedT: number }[], ch: 'D1' | 'D2') {
  return events.filter((e) => e.channel === ch).map((e) => e.detectedT).sort((a, b) => a - b);
}

/**
 * A kräver två fysiskt/statistiskt separata kanaler (§4.1). HBT-källor har
 * redan D1/D2 (sim/detector/channels.ts). Parkällor (entangled) har ingen
 * sådan uppdelning eftersom `arm` styr kanalen — där härleds istället en
 * virtuell 50/50-delning av EN arms (A) tidsstämplar, med samma rng-disciplin
 * som den riktiga HBT-stråldelaren. Detta gör A körbar SIMULTANT med B–F på
 * samma entanglade ström (heraldad enfotonstatistik på arm A), vilket är en
 * standardteknik i riktiga SPDC-experiment. v1-förenkling: ingen äkta
 * heraldning (koincidenskrav mot arm B), bara en antibunching-proxy.
 */
function deriveChannelPair(events: PhotonEvent[], rng: Rng): [number[], number[]] {
  const hasHbtChannels = events.some((e) => e.channel === 'D1') && events.some((e) => e.channel === 'D2');
  if (hasHbtChannels) {
    return [channelTimestamps(events, 'D1'), channelTimestamps(events, 'D2')];
  }
  const armAEvents = events.filter((e) => e.arm === 'A');
  const d1: number[] = [];
  const d2: number[] = [];
  for (const e of armAEvents) {
    (rng.bool(0.5) ? d1 : d2).push(e.detectedT);
  }
  d1.sort((a, b) => a - b);
  d2.sort((a, b) => a - b);
  return [d1, d2];
}

/**
 * A-rapporten §6.2: w_k ∝ f(τ_k)/σ_k². GRANSKNINGSFYND: detta ser ut som att
 * sakna invers-variansviktning (bara mallformen f(τ) används), men det är
 * INTE en lucka — det ÄR den korrekta viktningen här. σ_k² under H0 skattas
 * av den FÖRVÄNTADE (ackcidentella) räkningen rateA·rateB·T·Δτ, som är
 * τ-oberoende för konstant takt — invers variansviktning reducerar därmed
 * till en konstant faktor som inte påverkar det viktade medelvärdet.
 *
 * Ett granskningsförsök att vikta med det OBSERVERADE antalet n_k istället
 * (en rimlig men fel tolkning av "1/σ_k²") visade sig vara självrefererande:
 * n_k är just den storhet SIGNALEN trycker ner nära τ=0, så att vikta med n_k
 * straffar exakt de bins som bär antibunchingen — verifierat genom att det
 * fick regressionstestet (singleEmitter → ε<0) att slå om till ε>0. Se
 * commit-historiken och sim/sources/singleEmitter.ts för den relaterade,
 * verkliga bugg detta grävande avslöjade (källans artificiella periodicitet).
 */
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
  const channelRng = rng.fork();
  const [d1, d2] = deriveChannelPair(stream.events, channelRng.fork());

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

  // p⁽²⁾-regeln: ett p per surrogatfamilj (ε mer negativt = farlig riktning),
  // beslutet bärs av det NÄST minsta. Pooling bevaras för visualiseringen.
  const nullEpsilons: number[] = [];
  const pByFamily: number[] = [];
  for (const nullId of A_NULLS) {
    const familyEps: number[] = [];
    for (let i = 0; i < nullReplicates; i++) {
      const surrogate = generateNull(nullId, stream, config, rng.fork());
      const [sd1, sd2] = deriveChannelPair(surrogate.events, channelRng.fork());
      familyEps.push(matchedFilterEpsilon(sd1, sd2, surrogate.duration, tauGrid, binWidth, tauChar));
    }
    pByFamily.push(empiricalPValue(epsilonHat, familyEps, 'less'));
    nullEpsilons.push(...familyEps);
  }
  const pEpsilon = pSquared(pByFamily);

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
  const virtualSplit = !(stream.events.some((e) => e.channel === 'D1') && stream.events.some((e) => e.channel === 'D2'));

  return {
    id: 'A',
    verdict,
    verdictLabelSv,
    components: [
      { key: 'g2_0', labelSv: 'g²(0), korskorrelation', value: g2Zero, classicalReference: 1 },
      { key: 'epsilon', labelSv: 'ε (matchat filter, teckendiskriminator)', value: epsilonHat, pValue: pEpsilon, classicalReference: 0, primary: true },
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
      {
        code: 'A-RF-VIRTUALSPLIT',
        labelSv: 'Virtuell kanaldelning (ingen fysisk stråldelare)',
        triggered: virtualSplit,
        detailSv:
          'Källan har ingen egen HBT-uppdelning (entangled) — D1/D2 härleds här genom att slumpa arm A:s ' +
          'händelser 50/50. Gör A körbar tillsammans med B–F på samma ström, men delar då rådata med dem ' +
          '(räknas INTE som en oberoende session vid kombinerad evidens, se "Kombinera signaturer").',
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
