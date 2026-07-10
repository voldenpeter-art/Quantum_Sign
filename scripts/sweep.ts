// Parametersvep: kör N simuleringar per källtyp över slumpade "konstellationer"
// av förhållanden/detektorparametrar, analyserar alla tillämpliga signaturer
// per körning, och skriver rådata till CSV + en sammanfattning till JSON.
//
// Körs med: npx tsx scripts/sweep.ts [runsPerSource] [outDir] [metaSeed]
// Deterministisk: styrs helt av metaSeed (samma svep vid samma seed).

import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { generateEventStream } from '../src/sim';
import { Rng } from '../src/sim/rng';
import { ANALYSIS_REGISTRY } from '../src/analysis/registry';
import type { AnalysisContext, SignatureResult } from '../src/analysis/types';
import { SIGNATURE_CATALOG, IMPLEMENTED_SIGNATURES, type SignatureId } from '../src/types/signatures';
import type { RunConfig, SourceType } from '../src/types/config';

const META_SEED = Number(process.argv[4] ?? 20260710);
const RUNS_PER_SOURCE = Number(process.argv[2] ?? 300);
const OUT_DIR = process.argv[3] ?? join(process.cwd(), 'scratchpad-sweep');
const NULL_REPLICATES = 6; // reducerad för svepets skala; UI:t använder högre värden interaktivt
const SOURCE_TYPES: SourceType[] = ['thermal', 'coherent', 'singleEmitter', 'entangled', 'memoryEcho'];

mkdirSync(OUT_DIR, { recursive: true });

function uniform(rng: Rng, lo: number, hi: number): number {
  return lo + rng.next() * (hi - lo);
}

interface RunRow {
  run_id: string;
  source: SourceType;
  seed: number;
  duration: number;
  sourceRateHz: number;
  temperatureK: number;
  fieldVoltage: number;
  radiationDose: number;
  activationEnergyEV: number;
  lossPct: number;
  jitterPs: number;
  deadTimeNs: number;
  afterpulseProb: number;
  darkCountRateHz: number;
  crosstalkProb: number;
  eventCount: number;
  signature: SignatureId;
  verdict: string;
  headlineKey: string;
  headlineValue: number;
  pValue: number | '';
  redFlags: string;
}

function sampleConfig(rng: Rng, source: SourceType, seed: number): RunConfig {
  return {
    seed,
    duration: uniform(rng, 6, 15),
    source,
    sourceRateHz: uniform(rng, 50, 400),
    conditions: {
      temperatureK: uniform(rng, 1, 1000),
      fieldVoltage: uniform(rng, 0, 10),
      radiationDose: uniform(rng, 0.2, 3),
      activationEnergyEV: uniform(rng, 0.05, 2),
    },
    detector: {
      lossPct: uniform(rng, 0, 80),
      jitterPs: uniform(rng, 0, 300_000),
      deadTimeNs: uniform(rng, 0, 300),
      afterpulseProb: uniform(rng, 0, 0.15),
      afterpulseTauNs: uniform(rng, 10, 100),
      darkCountRateHz: uniform(rng, 0, 500),
      crosstalkProb: uniform(rng, 0, 0.1),
    },
    chsh: { A: [0, 45], B: [22.5, 67.5] },
  };
}

function applicableSignatures(source: SourceType): SignatureId[] {
  return IMPLEMENTED_SIGNATURES.filter((id) => {
    const meta = SIGNATURE_CATALOG.find((m) => m.id === id)!;
    return meta.requiredSources.includes(source);
  });
}

function headline(result: SignatureResult): { key: string; value: number; pValue: number | '' } {
  // Se analysis/combine.ts getHeadlinePValue för samma disciplin: föredra den
  // uttryckligt markerade primary-komponenten framför "första med pValue".
  const primaryMarked = result.components.find((c) => c.primary && c.pValue !== undefined);
  const withP = primaryMarked ?? result.components.find((c) => c.pValue !== undefined);
  const primary = withP ?? result.components[0];
  return { key: primary?.key ?? '', value: primary?.value ?? NaN, pValue: withP?.pValue ?? '' };
}

const metaRng = new Rng(META_SEED);
const rows: RunRow[] = [];
let runCounter = 0;
const t0 = Date.now();

for (const source of SOURCE_TYPES) {
  const sigIds = applicableSignatures(source);
  for (let i = 0; i < RUNS_PER_SOURCE; i++) {
    runCounter++;
    const runSeed = Math.floor(metaRng.next() * 1e9);
    const configRng = new Rng(runSeed);
    const config = sampleConfig(configRng, source, runSeed);

    const stream = generateEventStream(config);
    const analysisRng = new Rng(runSeed + 1);

    for (const sigId of sigIds) {
      const analyzer = ANALYSIS_REGISTRY[sigId];
      if (!analyzer) continue;
      const ctx: AnalysisContext = { stream, config, rng: analysisRng.fork(), nullReplicates: NULL_REPLICATES };
      const result = analyzer(ctx);
      const h = headline(result);
      rows.push({
        run_id: `run_${runCounter}`,
        source,
        seed: runSeed,
        duration: config.duration,
        sourceRateHz: config.sourceRateHz,
        temperatureK: config.conditions.temperatureK,
        fieldVoltage: config.conditions.fieldVoltage,
        radiationDose: config.conditions.radiationDose,
        activationEnergyEV: config.conditions.activationEnergyEV,
        lossPct: config.detector.lossPct,
        jitterPs: config.detector.jitterPs,
        deadTimeNs: config.detector.deadTimeNs,
        afterpulseProb: config.detector.afterpulseProb,
        darkCountRateHz: config.detector.darkCountRateHz,
        crosstalkProb: config.detector.crosstalkProb,
        eventCount: stream.events.length,
        signature: sigId,
        verdict: result.verdict,
        headlineKey: h.key,
        headlineValue: h.value,
        pValue: h.pValue,
        redFlags: result.redFlags.filter((f) => f.triggered).map((f) => f.code).join(';'),
      });
    }

    if (runCounter % 100 === 0) {
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      console.log(`[${elapsed}s] ${runCounter}/${SOURCE_TYPES.length * RUNS_PER_SOURCE} runs done (source=${source})`);
    }
  }
}

const header = Object.keys(rows[0]) as (keyof RunRow)[];
const csvLines = [header.join(',')];
for (const row of rows) {
  csvLines.push(header.map((k) => String(row[k])).join(','));
}
writeFileSync(join(OUT_DIR, 'sweep_results.csv'), csvLines.join('\n'));

writeFileSync(join(OUT_DIR, 'sweep_results.json'), JSON.stringify(rows));

const totalTime = ((Date.now() - t0) / 1000).toFixed(1);
console.log(`Done: ${runCounter} runs (META_SEED=${META_SEED}), ${rows.length} signature rows, ${totalTime}s total.`);
console.log(`Wrote ${join(OUT_DIR, 'sweep_results.csv')}`);
