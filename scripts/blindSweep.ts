// Blind injection-svep: till skillnad från scripts/sweep.ts (som analyserar
// "rena" slumpade konstellationer) blandar VARJE körning här en klassisk
// baslinje med en KÄND, DOLD styrka av en signatur (validation/blindInjection.ts)
// och kör hela analyspipelinen blint — pipelinen ser aldrig `trueStrength`
// under analysen, bara den blandade strömmen. Facit avslöjas först vid
// utvärdering. Detta mäter pipelinens FAKTISKA detektionsförmåga (känslighet
// + falsklarmsfrekvens), inte bara dess beteende på godtyckliga slumpdata —
// se CLAUDE.md §8 och metodbiblioteket punkt 12 (injection/ROC-krav).
//
// Körs med: npx tsx scripts/blindSweep.ts [totalTrials] [outDir] [metaSeed]

import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { Rng } from '../src/sim/rng';
import { runBlindInjection } from '../src/validation/blindInjection';
import { SIGNATURE_CATALOG, IMPLEMENTED_SIGNATURES, type SignatureId } from '../src/types/signatures';
import type { RunConfig, SourceType } from '../src/types/config';

const META_SEED = Number(process.argv[4] ?? 20260710);
const TOTAL_TRIALS = Number(process.argv[2] ?? 1500);
const OUT_DIR = process.argv[3] ?? join(process.cwd(), 'scratchpad-blindsweep');
const NULL_REPLICATES = 6;
// Andel av dragen som tvingas till styrka=0 exakt — dedikerad kalibrering av
// falsklarmsfrekvensen (den viktigaste enskilda ROC-siffran).
const NULL_CALIBRATION_FRACTION = 0.2;

mkdirSync(OUT_DIR, { recursive: true });

function uniform(rng: Rng, lo: number, hi: number): number {
  return lo + rng.next() * (hi - lo);
}

function sourceForSignature(sigId: SignatureId): SourceType {
  const meta = SIGNATURE_CATALOG.find((m) => m.id === sigId)!;
  return meta.requiredSources[0];
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

interface BlindRow {
  trial_id: string;
  signature: SignatureId;
  source: SourceType;
  seed: number;
  trueStrength: number;
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
  detectedVerdict: string;
  detected: boolean;
  headlinePValue: number | '';
}

const metaRng = new Rng(META_SEED);
const rows: BlindRow[] = [];
const t0 = Date.now();

for (let i = 0; i < TOTAL_TRIALS; i++) {
  const sigId = IMPLEMENTED_SIGNATURES[metaRng.uniformInt(IMPLEMENTED_SIGNATURES.length)];
  const source = sourceForSignature(sigId);
  const trueStrength = metaRng.next() < NULL_CALIBRATION_FRACTION ? 0 : metaRng.next();
  const runSeed = Math.floor(metaRng.next() * 1e9);
  const configRng = new Rng(runSeed);
  const config = sampleConfig(configRng, source, runSeed);
  const analysisRng = new Rng(runSeed + 1);

  const result = runBlindInjection(sigId, config, trueStrength, analysisRng, NULL_REPLICATES);

  rows.push({
    trial_id: `trial_${i + 1}`,
    signature: sigId,
    source,
    seed: runSeed,
    trueStrength,
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
    detectedVerdict: result.detectedVerdict,
    detected: result.detected,
    headlinePValue: result.headlinePValue ?? '',
  });

  if ((i + 1) % 100 === 0) {
    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
    console.log(`[${elapsed}s] ${i + 1}/${TOTAL_TRIALS} blinda drag klara`);
  }
}

const header = Object.keys(rows[0]) as (keyof BlindRow)[];
const csvLines = [header.join(',')];
for (const row of rows) csvLines.push(header.map((k) => String(row[k])).join(','));
writeFileSync(join(OUT_DIR, 'blind_sweep_results.csv'), csvLines.join('\n'));
writeFileSync(join(OUT_DIR, 'blind_sweep_results.json'), JSON.stringify(rows));

const totalTime = ((Date.now() - t0) / 1000).toFixed(1);
console.log(`Done: ${rows.length} blinda drag (META_SEED=${META_SEED}), ${totalTime}s total.`);
console.log(`Wrote ${join(OUT_DIR, 'blind_sweep_results.csv')}`);
