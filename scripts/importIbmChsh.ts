// Importerar sanerad IBM-hårdvarudata och kör Signatur C:s estimator på den.
//
// FÖRSTA KRAVET (bindande): bryggan måste reproducera direktberäkningen
//   S = 2.5317383,  σ_S = 0.0241785
// exakt. Gör den inte det är bryggan fel, inte datan.
//
// Körs:  npx tsx scripts/importIbmChsh.ts [sökväg till sanerad result.json]
//
// Standardfil: fixtures/ibm/sanitized_job-d9ndf7gqs0bc73e3adu0-result.json
// (CHSH-batteriet från ibm_marrakesh, 4 PUB:ar × 4096 shots, 2026-08-02).

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Rng } from '../src/sim/rng';
import { computeS } from '../src/analysis/C_chsh';
import { readIbmResult } from './lib/ibmBitArray';
import {
  correlations,
  labelShuffleWithinSettings,
  stratifiedBootstrap,
  toChshPairs,
  toShotRecords,
} from './lib/ibmChshBridge';

// Referensvärden från oberoende direktberäkning ur IBM:s BitArray (Python).
const REF_S = 2.5317383;
const REF_SIGMA = 0.0241785;
const TOL = 1e-6;

const DEFAULT_FIXTURE = join(
  process.cwd(),
  'fixtures/ibm/sanitized_job-d9ndf7gqs0bc73e3adu0-result.json',
);

function main(): number {
  const path = process.argv[2] ?? DEFAULT_FIXTURE;
  console.log('IBM → Signatur C: pardirekt brygga');
  console.log('='.repeat(64));
  console.log(`Fil: ${path}\n`);

  const json = JSON.parse(readFileSync(path, 'utf-8'));
  const pubs = readIbmResult(json);
  console.log(`PUB:ar: ${pubs.length}`);
  for (const p of pubs) {
    console.log(`  PUB${p.index}: ${p.bitstrings.length} shots, ${p.numBits} bitar`);
  }

  const records = toShotRecords('d9ndf7gqs0bc73e3adu0', pubs);
  const pairs = toChshPairs(records);
  console.log(`\nShotRecords: ${records.length}   ChshPairs: ${pairs.length}`);

  // Estimatorn: C_chsh.ts:s egen computeS, matad pardirekt.
  const S = computeS(pairs);
  const { E, counts, sigmaS } = correlations(pairs);

  console.log('\nKorrelationer:');
  for (const key of ['0,0', '0,1', '1,0', '1,1']) {
    console.log(`  E(${key}) = ${E[key].toFixed(6).padStart(9)}   n = ${counts[key]}`);
  }
  console.log(`\n  S       = ${S.toFixed(7)}`);
  console.log(`  sigma_S = ${sigmaS.toFixed(7)}`);
  console.log(`  (S-2)/s = ${((S - 2) / sigmaS).toFixed(2)}`);

  console.log('\nReproduktionskrav mot oberoende direktberäkning:');
  const dS = Math.abs(S - REF_S);
  const dSig = Math.abs(sigmaS - REF_SIGMA);
  console.log(`  S:       ${S.toFixed(7)} mot ${REF_S}   diff ${dS.toExponential(2)}`);
  console.log(`  sigma_S: ${sigmaS.toFixed(7)} mot ${REF_SIGMA}   diff ${dSig.toExponential(2)}`);
  const ok = dS < TOL && dSig < TOL;
  console.log(ok ? '  PASS — bryggan reproducerar direktberäkningen.'
                 : `  FAIL — avviker mer än ${TOL}. Bryggan är fel, inte datan.`);

  // --- Giltiga nullar för shot-data (BRYGGSPEC §6) -------------------------
  const rng = new Rng(20260802);
  const rand = () => rng.next();
  const REPS = 400;

  const shuffled: number[] = [];
  for (let i = 0; i < REPS; i++) shuffled.push(computeS(labelShuffleWithinSettings(pairs, rand)));
  const boot: number[] = [];
  for (let i = 0; i < REPS; i++) boot.push(computeS(stratifiedBootstrap(pairs, rand)));

  const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const sd = (xs: number[]) => {
    const m = mean(xs);
    return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1));
  };
  const exceed = shuffled.filter((v) => v >= S).length;

  console.log(`\nGiltiga nullar för shot-data (${REPS} replikat):`);
  console.log(`  label-shuffle inom settingpar : S = ${mean(shuffled).toFixed(4)} +/- ${sd(shuffled).toFixed(4)}`);
  console.log(`     (bryter A<->B-korrelation, bevarar marginaler)`);
  console.log(`     surrogat >= observerat: ${exceed}/${REPS}  ->  p = ${((exceed + 1) / (REPS + 1)).toExponential(2)}`);
  console.log(`  stratifierad bootstrap        : S = ${mean(boot).toFixed(4)} +/- ${sd(boot).toFixed(4)}`);
  console.log(`     (bootstrap-sigma ${sd(boot).toFixed(4)} mot analytisk ${sigmaS.toFixed(4)})`);
  console.log('\n  OGILTIGA för denna datatyp: time-slide, accidentals,');
  console.log('  koincidensfönster-variation, dödtidsnullar — de kräver');
  console.log('  tidsstämplar som gate-model-data inte har.');

  console.log('\nKlassning: C-hardware-consistent (ej C-strong).');
  console.log('Locality-, freedom-of-choice- och detection-loopholes är öppna.');
  return ok ? 0 : 1;
}

process.exit(main());
