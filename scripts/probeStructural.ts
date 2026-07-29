// Diagnostik: kör A–F på en ren, nästan ideal entanglad ström och skriv ut
// observerad huvudstatistik + null-medel/std → z, för att avgöra om D/E/F
// har NÅGON separerbar struktur i denna (statistik-nivå-)simulering. Om z≈0
// är 'none' KORREKT; om |z| är stort men verdict ändå none är tröskeln död.
// Körs: npx tsx scripts/probeStructural.ts
import { generateEventStream } from '../src/sim';
import { Rng } from '../src/sim/rng';
import { ANALYSIS_REGISTRY } from '../src/analysis/registry';
import type { AnalysisContext, SignatureResult } from '../src/analysis/types';
import type { RunConfig } from '../src/types/config';

const cleanConfig = (seed: number): RunConfig => ({
  seed,
  duration: 30,
  source: 'entangled',
  sourceRateHz: 300,
  conditions: { temperatureK: 4, fieldVoltage: 0, radiationDose: 0.2, activationEnergyEV: 1 },
  detector: {
    lossPct: 3, jitterPs: 200, deadTimeNs: 1, afterpulseProb: 0.002,
    afterpulseTauNs: 30, darkCountRateHz: 2, crosstalkProb: 0.002,
  },
  chsh: { A: [0, 45], B: [22.5, 67.5] },
});

function primaryZ(res: SignatureResult): { key: string; z: number; obs: number } {
  const pn = res.primaryNull;
  if (!pn || pn.nullValues.length < 2) return { key: '?', z: NaN, obs: NaN };
  const n = pn.nullValues.length;
  const m = pn.nullValues.reduce((a, b) => a + b, 0) / n;
  const v = pn.nullValues.reduce((a, b) => a + (b - m) ** 2, 0) / (n - 1);
  const s = Math.sqrt(v);
  return { key: pn.labelSv, z: s > 0 ? (pn.observed - m) / s : 0, obs: pn.observed };
}

const SIGS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
const zAcc: Record<string, number[]> = {};
const verdicts: Record<string, Record<string, number>> = {};
for (const s of SIGS) { zAcc[s] = []; verdicts[s] = {}; }

const N = 30;
const meta = new Rng(777);
for (let i = 0; i < N; i++) {
  const seed = Math.floor(meta.next() * 1e9);
  const config = cleanConfig(seed);
  const stream = generateEventStream(config);
  const arng = new Rng(seed + 1);
  for (const sig of SIGS) {
    const res = ANALYSIS_REGISTRY[sig]({ stream, config, rng: arng.fork(), nullReplicates: 30 } as AnalysisContext);
    const { z } = primaryZ(res);
    if (Number.isFinite(z)) zAcc[sig].push(z);
    verdicts[sig][res.verdict] = (verdicts[sig][res.verdict] ?? 0) + 1;
  }
}
console.log(`Clean entangled diagnostic, N=${N}, nullReplicates=30 (per-family floor 1/31=0.032):`);
for (const sig of SIGS) {
  const zs = zAcc[sig].sort((a, b) => a - b);
  const med = zs.length ? zs[Math.floor(zs.length / 2)] : NaN;
  const mn = zs[0], mx = zs[zs.length - 1];
  console.log(`  ${sig}: verdicts=${JSON.stringify(verdicts[sig])}  primary-z median=${med?.toFixed(2)} range=[${mn?.toFixed(2)}, ${mx?.toFixed(2)}]`);
}
