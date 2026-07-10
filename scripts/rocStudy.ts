// Riktad ROC-studie: till skillnad från scripts/blindSweep.ts (som slumpar BÅDE
// styrka OCH hela instrument-/miljökonstellationen, vilket späder ut varje
// enskild cell till ett brett, svårtolkat rum) håller den här studien
// instrument-/miljö-"hårdheten" FAST vid ett fåtal namngivna nivåer och sveper
// ENDAST den dolda styrkan finmaskigt inom varje nivå, upprepat många gånger
// per cell. Ger en faktisk detektionsfrekvens-vs-styrka-kurva (ROC-liknande)
// per signatur och hårdhetsnivå, i stället för ett enda aggregerat tal över
// ett slumpat rum (jfr rapport_blindsvep_1500drag.md, "Nästa steg").
//
// Fältstyrka (fieldVoltage) är en del av hårdhetsnivån, inte bara detektorn:
// conditions.ts kopplar fieldVoltage direkt till decoherence ∈ [0,0.95] för
// polarisationskällor (entangled) — en genuin instrument-/miljö-degraderande
// faktor, inte en godtycklig extra axel. Övriga villkor (temperatur,
// strålningsdos, aktiveringsenergi) hålls vid en neutral referenspunkt i alla
// celler för att inte introducera en fjärde okontrollerad axel.
//
// Körs med: npx tsx scripts/rocStudy.ts [repeatsPerCell] [outDir] [metaSeed]

import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { Rng } from '../src/sim/rng';
import { runBlindInjection } from '../src/validation/blindInjection';
import { SIGNATURE_CATALOG, IMPLEMENTED_SIGNATURES, type SignatureId } from '../src/types/signatures';
import type { RunConfig, SourceType, DetectorParams } from '../src/types/config';

const REPEATS_PER_CELL = Number(process.argv[2] ?? 20);
const OUT_DIR = process.argv[3] ?? join(process.cwd(), 'scratchpad-rocstudy');
const META_SEED = Number(process.argv[4] ?? 20260710);
const NULL_REPLICATES = 6;

mkdirSync(OUT_DIR, { recursive: true });

const FIXED_DURATION = 12;
const FIXED_SOURCE_RATE_HZ = 200;
// Neutral referenspunkt — hålls konstant i alla celler (se filhuvud).
const BASE_CONDITIONS = { temperatureK: 300, radiationDose: 1, activationEnergyEV: 0.5 };

interface Tier {
  name: string;
  detector: DetectorParams;
  fieldVoltage: number;
}

const TIERS: Tier[] = [
  {
    name: 'benign',
    detector: { lossPct: 5, jitterPs: 2000, deadTimeNs: 10, afterpulseProb: 0.005, afterpulseTauNs: 20, darkCountRateHz: 10, crosstalkProb: 0.005 },
    fieldVoltage: 0.2,
  },
  {
    name: 'typical',
    detector: { lossPct: 35, jitterPs: 50_000, deadTimeNs: 100, afterpulseProb: 0.05, afterpulseTauNs: 40, darkCountRateHz: 150, crosstalkProb: 0.03 },
    fieldVoltage: 2,
  },
  {
    name: 'harsh',
    detector: { lossPct: 65, jitterPs: 200_000, deadTimeNs: 220, afterpulseProb: 0.12, afterpulseTauNs: 60, darkCountRateHz: 350, crosstalkProb: 0.07 },
    fieldVoltage: 5,
  },
];

const STRENGTHS = Array.from({ length: 11 }, (_, i) => i / 10); // 0.0, 0.1, ..., 1.0

function sourceForSignature(sigId: SignatureId): SourceType {
  const meta = SIGNATURE_CATALOG.find((m) => m.id === sigId)!;
  return meta.requiredSources[0];
}

function buildConfig(source: SourceType, tier: Tier, seed: number): RunConfig {
  return {
    seed,
    duration: FIXED_DURATION,
    source,
    sourceRateHz: FIXED_SOURCE_RATE_HZ,
    conditions: { ...BASE_CONDITIONS, fieldVoltage: tier.fieldVoltage },
    detector: { ...tier.detector },
    chsh: { A: [0, 45], B: [22.5, 67.5] },
  };
}

interface RocRow {
  signature: SignatureId;
  source: SourceType;
  tier: string;
  strength: number;
  rep: number;
  seed: number;
  detectedVerdict: string;
  detected: boolean;
  headlinePValue: number | '';
}

const rows: RocRow[] = [];
const t0 = Date.now();
const signatures = IMPLEMENTED_SIGNATURES.filter((s) => sourceForSignature(s) !== undefined);
const totalCells = signatures.length * TIERS.length * STRENGTHS.length;
let cellsDone = 0;

// Deterministisk men väl utspridd per-cell-seedbas — samma metaseed ger
// samma studie reproducerbart (RNG-disciplin, CLAUDE.md §6).
const metaRng = new Rng(META_SEED);
const cellSeedBase: Record<string, number> = {};
for (const sigId of signatures) {
  for (const tier of TIERS) {
    for (const strength of STRENGTHS) {
      cellSeedBase[`${sigId}|${tier.name}|${strength}`] = Math.floor(metaRng.next() * 1e9);
    }
  }
}

for (const sigId of signatures) {
  const source = sourceForSignature(sigId);
  for (const tier of TIERS) {
    for (const strength of STRENGTHS) {
      const base = cellSeedBase[`${sigId}|${tier.name}|${strength}`];
      for (let rep = 0; rep < REPEATS_PER_CELL; rep++) {
        const runSeed = base + rep;
        const config = buildConfig(source, tier, runSeed);
        const analysisRng = new Rng(runSeed + 1);
        const result = runBlindInjection(sigId, config, strength, analysisRng, NULL_REPLICATES);
        rows.push({
          signature: sigId,
          source,
          tier: tier.name,
          strength,
          rep,
          seed: runSeed,
          detectedVerdict: result.detectedVerdict,
          detected: result.detected,
          headlinePValue: result.headlinePValue ?? '',
        });
      }
      cellsDone++;
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      console.log(`[${elapsed}s] cell ${cellsDone}/${totalCells} klar (${sigId}/${tier.name}/strength=${strength}) — ${rows.length} drag hittills`);
    }
  }
}

const header = Object.keys(rows[0]) as (keyof RocRow)[];
const csvLines = [header.join(',')];
for (const row of rows) csvLines.push(header.map((k) => String(row[k])).join(','));
writeFileSync(join(OUT_DIR, 'roc_study_results.csv'), csvLines.join('\n'));
writeFileSync(join(OUT_DIR, 'roc_study_results.json'), JSON.stringify(rows));

const totalTime = ((Date.now() - t0) / 1000).toFixed(1);
console.log(`Done: ${rows.length} drag över ${totalCells} celler (REPEATS_PER_CELL=${REPEATS_PER_CELL}, META_SEED=${META_SEED}), ${totalTime}s total.`);
console.log(`Wrote ${join(OUT_DIR, 'roc_study_results.csv')}`);
