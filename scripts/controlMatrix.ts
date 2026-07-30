// Förregistrerad kontrollmatris (feedback 2026-07-29). Ersätter det slumpade
// parametersvepet (scripts/sweep.ts) med en MATRIS AV NAMNGIVNA SCENARIER med
// KÄND grundsanning: positiva kontroller (signaturen SKA fyra), negativa
// kontroller (signaturen får INTE fyra → falskpositivfrekvens), och
// tröskelscenarier (V nära CHSH-gränsen). Varje scenario kör bara sina
// DESIGNERADE signaturer; negativa kontroller som körs utanför requiredSources
// märks 'forced'. Deterministisk (metaSeed + scenario-ID + seed-index).
//
// Körs:  npx tsx scripts/controlMatrix.ts [seedsPerScenario] [outDir] [metaSeed]
//        npx tsx scripts/controlMatrix.ts smoke        # 1 seed/scenario + timing
//
// V-mappning (sim/conditions.ts): V = 1 − clamp(fieldVoltage/10, 0, 0.95).

import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { generateEventStream } from '../src/sim';
import { Rng } from '../src/sim/rng';
import { ANALYSIS_REGISTRY } from '../src/analysis/registry';
import type { AnalysisContext, SignatureResult } from '../src/analysis/types';
import { isSignatureCompatible } from '../src/analysis/compatibility';
import { DEFAULT_CONFIG } from '../src/types/config';
import type { RunConfig } from '../src/types/config';
import type { SignatureId } from '../src/types/signatures';

type Role = 'positive' | 'negative' | 'threshold' | 'secondary';
interface SigSpec {
  id: SignatureId;
  role: Role;
  replicates: number;
  /** Kör även om requiredSources inte matchar (uttrycklig negativ kontroll). */
  forced?: boolean;
}
interface Scenario {
  id: string;
  descSv: string;
  config: (base: RunConfig) => RunConfig;
  signatures: SigSpec[];
}

// Replikatantal per roll: A/F-vittnen är surrogatbundna och behöver ≥~120/familj
// för att p⁽²⁾ ska kunna nå 1e-2 (upplösningsgolv 1/(N+1)); C:s primärtest är
// bootstrap-baserat och behöver inte höga replikat; B/D/E är sekundära.
const REP_WITNESS = 150; // A, F
const REP_C = 24; // C (primärtest = bootstrap-k, ej replikatbundet)
const REP_SECONDARY = 48; // B, D, E

const withDetector = (base: RunConfig, d: Partial<RunConfig['detector']>): RunConfig => ({
  ...base,
  detector: { ...base.detector, ...d },
});
const withCond = (base: RunConfig, c: Partial<RunConfig['conditions']>): RunConfig => ({
  ...base,
  conditions: { ...base.conditions, ...c },
});

const FAVORABLE = { lossPct: 5, jitterPs: 500, deadTimeNs: 10, afterpulseProb: 0.005, afterpulseTauNs: 30, darkCountRateHz: 5, crosstalkProb: 0.005 };
const cleanCond = { temperatureK: 100, fieldVoltage: 0, radiationDose: 1, activationEnergyEV: 1 };

const A = (): SigSpec => ({ id: 'A', role: 'positive', replicates: REP_WITNESS });
const scenarios: Scenario[] = [
  // ---- A-spåret: enkelemitter + klassiska nollor + artefaktmotstånd ----
  { id: 'A1', descSv: 'Single emitter, gynnsam detektor (positiv A-kontroll)',
    config: (b) => withCond(withDetector({ ...b, source: 'singleEmitter', sourceRateHz: 300 }, FAVORABLE), cleanCond),
    signatures: [{ id: 'A', role: 'positive', replicates: REP_WITNESS }] },
  { id: 'A2', descSv: 'Single emitter, låg signal–bakgrund (känslighet)',
    config: (b) => withCond(withDetector({ ...b, source: 'singleEmitter', sourceRateHz: 300 }, { ...FAVORABLE, lossPct: 45, darkCountRateHz: 300 }), cleanCond),
    signatures: [{ id: 'A', role: 'positive', replicates: REP_WITNESS }] },
  { id: 'A3', descSv: 'Coherent source (klassisk noll för A)',
    config: (b) => withCond(withDetector({ ...b, source: 'coherent', sourceRateHz: 300 }, FAVORABLE), cleanCond),
    signatures: [{ id: 'A', role: 'negative', replicates: REP_WITNESS }] },
  { id: 'A4', descSv: 'Thermal source (klassisk/bunching-noll för A)',
    config: (b) => withCond(withDetector({ ...b, source: 'thermal', sourceRateHz: 300 }, FAVORABLE), cleanCond),
    signatures: [{ id: 'A', role: 'negative', replicates: REP_WITNESS }] },
  { id: 'A5', descSv: 'Thermal + kraftig dödtid/afterpulse (artefaktmotstånd)',
    config: (b) => withCond(withDetector({ ...b, source: 'thermal', sourceRateHz: 300 }, { ...FAVORABLE, deadTimeNs: 200, afterpulseProb: 0.12, darkCountRateHz: 100 }), cleanCond),
    signatures: [{ id: 'A', role: 'negative', replicates: REP_WITNESS }] },

  // ---- E-spåret: entanglad synlighet runt CHSH-gränsen (V = 1 − fält/10) ----
  { id: 'E1', descSv: 'Entangled V=1 (positiv B/C/D/E-kontroll)',
    config: (b) => withCond(withDetector({ ...b, source: 'entangled', sourceRateHz: 350 }, FAVORABLE), { ...cleanCond, fieldVoltage: 0 }),
    signatures: [{ id: 'C', role: 'positive', replicates: REP_C }, { id: 'B', role: 'secondary', replicates: REP_SECONDARY }, { id: 'D', role: 'secondary', replicates: REP_SECONDARY }, { id: 'E', role: 'secondary', replicates: REP_SECONDARY }, A()] },
  { id: 'E2', descSv: 'Entangled V=0.8 (måttlig dekoherens)',
    config: (b) => withCond(withDetector({ ...b, source: 'entangled', sourceRateHz: 350 }, FAVORABLE), { ...cleanCond, fieldVoltage: 2 }),
    signatures: [{ id: 'C', role: 'threshold', replicates: REP_C }] },
  { id: 'E3', descSv: 'Entangled V=0.72 (nära CHSH-tröskeln)',
    config: (b) => withCond(withDetector({ ...b, source: 'entangled', sourceRateHz: 350 }, FAVORABLE), { ...cleanCond, fieldVoltage: 2.8 }),
    signatures: [{ id: 'C', role: 'threshold', replicates: REP_C }] },
  { id: 'E4', descSv: 'Entangled V=1/√2 (klassisk CHSH-gräns, S≈2)',
    config: (b) => withCond(withDetector({ ...b, source: 'entangled', sourceRateHz: 350 }, FAVORABLE), { ...cleanCond, fieldVoltage: 2.9289 }),
    signatures: [{ id: 'C', role: 'negative', replicates: REP_C }] },
  { id: 'E5', descSv: 'Entangled V=0.5 (negativ kontroll)',
    config: (b) => withCond(withDetector({ ...b, source: 'entangled', sourceRateHz: 350 }, FAVORABLE), { ...cleanCond, fieldVoltage: 5 }),
    signatures: [{ id: 'C', role: 'negative', replicates: REP_C }] },
  { id: 'E6', descSv: 'Entangled V=1 + hög förlust (detektionsstress)',
    config: (b) => withCond(withDetector({ ...b, source: 'entangled', sourceRateHz: 350 }, { ...FAVORABLE, lossPct: 60 }), { ...cleanCond, fieldVoltage: 0 }),
    signatures: [{ id: 'C', role: 'positive', replicates: REP_C }] },
  { id: 'E7', descSv: 'Entangled V=1 + jitter/mörkerräkningar (timingstress)',
    config: (b) => withCond(withDetector({ ...b, source: 'entangled', sourceRateHz: 350 }, { ...FAVORABLE, jitterPs: 5000, darkCountRateHz: 300 }), { ...cleanCond, fieldVoltage: 0 }),
    signatures: [{ id: 'C', role: 'positive', replicates: REP_C }] },

  // ---- F-spåret: minnes-eko + falskpositivkontroll ----
  { id: 'F1', descSv: 'Memory echo, gynnsam detektor (positiv F-kontroll)',
    config: (b) => withCond(withDetector({ ...b, source: 'memoryEcho', sourceRateHz: 300 }, FAVORABLE), cleanCond),
    signatures: [{ id: 'F', role: 'positive', replicates: REP_WITNESS }, A()] },
  { id: 'F2', descSv: 'Memory echo + hög bakgrund (minneskänslighet)',
    config: (b) => withCond(withDetector({ ...b, source: 'memoryEcho', sourceRateHz: 300 }, { ...FAVORABLE, darkCountRateHz: 300 }), cleanCond),
    signatures: [{ id: 'F', role: 'positive', replicates: REP_WITNESS }] },
  { id: 'F3', descSv: 'Coherent utan eko (falskpositiv kontroll för F, forced)',
    config: (b) => withCond(withDetector({ ...b, source: 'coherent', sourceRateHz: 300 }, FAVORABLE), cleanCond),
    signatures: [{ id: 'F', role: 'negative', replicates: REP_WITNESS, forced: true }] },
];

const DURATION = 20;
const argSmoke = process.argv[2] === 'smoke';
// Tvåstegsdesign (feedback P2): screening (grov replikatnivå) → confirmation
// (fin replikatnivå) för KANDIDATER + ett slumpat audit-urval av negativa
// kontroller (för att mäta falskpositivfrekvens vid confirmation-upplösning).
const SEEDS = argSmoke ? 1 : Number(process.argv[2] ?? 100); // spec: 15 × 100
const OUT_DIR = process.argv[3] ?? join(process.cwd(), 'scratchpad-matrix');
const META_SEED = Number(process.argv[4] ?? 20260729);
const SCREEN_REP = argSmoke ? 12 : Number(process.argv[5] ?? 199); // golv 1/200 = 0.005
const CONFIRM_REP = argSmoke ? 40 : Number(process.argv[6] ?? 1999); // golv 1/2000 = 5e-4
const CANDIDATE_P = 0.05; // förregistrerad kandidatgräns (headline-p under detta)
const AUDIT_N = argSmoke ? 3 : 100; // slumpade negativa kontroller som också confirmas
mkdirSync(OUT_DIR, { recursive: true });

interface Row {
  stage: 'screen' | 'confirm'; scenario: string; seedIndex: number; seed: number; source: string;
  signature: SignatureId; role: Role; forced: boolean; applicable: boolean; replicates: number;
  verdict: string; headlineKey: string; headlineValue: number | ''; pValue: number | '';
  redFlags: string; ms: number;
}

function headline(result: SignatureResult): { key: string; value: number | ''; p: number | '' } {
  const primary = result.components.find((c) => c.primary && c.pValue !== undefined) ?? result.components.find((c) => c.pValue !== undefined);
  return { key: primary?.key ?? '', value: primary?.value ?? '', p: primary?.pValue ?? '' };
}

const POSITIVE_TIERS = new Set(['structural', 'suspect', 'strong']);
function isCandidate(r: Row): boolean {
  return POSITIVE_TIERS.has(r.verdict) || (typeof r.pValue === 'number' && r.pValue < CANDIDATE_P);
}

// En körning identifieras unikt av (scenario, seedIndex, signatur). En körnings
// rng och ström beror bara på (scenario, seed) + signatur → reproducerbart.
function runOne(
  sc: Scenario, spec: SigSpec, seed: number, si: number, replicates: number, stage: 'screen' | 'confirm',
): Row {
  const config = sc.config({ ...DEFAULT_CONFIG, seed, duration: DURATION });
  const stream = generateEventStream(config);
  const applicable = isSignatureCompatible(spec.id, stream, config).compatible;
  const base: Omit<Row, 'verdict' | 'headlineKey' | 'headlineValue' | 'pValue' | 'redFlags' | 'ms'> = {
    stage, scenario: sc.id, seedIndex: si, seed, source: config.source, signature: spec.id,
    role: spec.role, forced: !!spec.forced, applicable, replicates,
  };
  if (!applicable && !spec.forced) {
    return { ...base, verdict: 'notApplicable', headlineKey: '', headlineValue: '', pValue: '', redFlags: '', ms: 0 };
  }
  const analyzer = ANALYSIS_REGISTRY[spec.id]!;
  const arng = new Rng(seed + 1 + spec.id.charCodeAt(0)); // deterministiskt per (seed, signatur)
  const ts = Date.now();
  const res = analyzer({ stream, config, rng: arng.fork(), nullReplicates: replicates } as AnalysisContext);
  const h = headline(res);
  return { ...base, verdict: res.verdict, headlineKey: h.key, headlineValue: h.value, pValue: h.p,
    redFlags: res.redFlags.filter((f) => f.triggered).map((f) => f.code).join(';'), ms: Date.now() - ts };
}

const metaRng = new Rng(META_SEED);
const seedList = Array.from({ length: SEEDS }, () => Math.floor(metaRng.next() * 1e9));

const t0 = Date.now();
// ---- STEG 1: screening ----
const screenRows: Row[] = [];
let done = 0;
const total = scenarios.reduce((a, s) => a + s.signatures.length, 0) * SEEDS;
for (const sc of scenarios) {
  for (let si = 0; si < SEEDS; si++) {
    for (const spec of sc.signatures) {
      if (!ANALYSIS_REGISTRY[spec.id]) continue;
      const r = runOne(sc, spec, seedList[si], si, SCREEN_REP, 'screen');
      screenRows.push(r);
      if (++done % 100 === 0 || argSmoke) console.log(`[screen ${((Date.now() - t0) / 1000).toFixed(1)}s] ${done}/${total} ${r.scenario}/${r.signature} → ${r.verdict}`);
    }
  }
}

// ---- UNIKHETSKONTROLL: exakt (scenario, seed) och (scenario, seed, signatur) ----
const runKeys = new Set(screenRows.map((r) => `${r.scenario}|${r.seedIndex}|${r.signature}`));
if (runKeys.size !== screenRows.length) throw new Error(`Duplicerade (scenario,seed,signatur)-nycklar: ${screenRows.length - runKeys.size}`);
const scenSeedPairs = new Set(screenRows.map((r) => `${r.scenario}|${r.seedIndex}`));
if (scenSeedPairs.size !== scenarios.length * SEEDS) throw new Error(`Förväntade ${scenarios.length * SEEDS} unika (scenario,seed)-par, fick ${scenSeedPairs.size}`);
console.log(`Unikhet OK: ${scenSeedPairs.size} unika (scenario,seed)-par, ${screenRows.length} körningar.`);

// ---- STEG 2: confirmation av kandidater + slumpat audit-urval av negativa ----
const candidateRows = screenRows.filter(isCandidate);
const negativeRows = screenRows.filter((r) => r.role === 'negative' && !isCandidate(r));
// Deterministiskt audit-urval (Fisher–Yates med metaRng-fork).
const auditRng = new Rng(META_SEED + 7);
const shuffledNeg = [...negativeRows];
for (let i = shuffledNeg.length - 1; i > 0; i--) { const j = auditRng.uniformInt(i + 1); [shuffledNeg[i], shuffledNeg[j]] = [shuffledNeg[j], shuffledNeg[i]]; }
const auditRows = shuffledNeg.slice(0, Math.min(AUDIT_N, shuffledNeg.length));
const toConfirm = [...candidateRows, ...auditRows];
console.log(`Steg 2: ${candidateRows.length} kandidater + ${auditRows.length} audit-negativa = ${toConfirm.length} confirmations.`);

const confirmRows: Row[] = [];
let cdone = 0;
for (const cr of toConfirm) {
  const sc = scenarios.find((s) => s.id === cr.scenario)!;
  const spec = sc.signatures.find((sp) => sp.id === cr.signature)!;
  const r = runOne(sc, spec, cr.seed, cr.seedIndex, CONFIRM_REP, 'confirm');
  confirmRows.push(r);
  if (++cdone % 25 === 0 || argSmoke) console.log(`[confirm ${((Date.now() - t0) / 1000).toFixed(1)}s] ${cdone}/${toConfirm.length} ${r.scenario}/${r.signature} → ${r.verdict}`);
}

const rows = [...screenRows, ...confirmRows];

// ---- aggregering: Wilson-95%-intervall för "fyrar"-frekvens per (scenario, signatur) ----
function wilson(k: number, n: number): [number, number] {
  if (n === 0) return [0, 0];
  const z = 1.96, p = k / n, d = 1 + (z * z) / n;
  const c = p + (z * z) / (2 * n), h = z * Math.sqrt((p * (1 - p) + (z * z) / (4 * n)) / n);
  return [Math.max(0, (c - h) / d), Math.min(1, (c + h) / d)];
}
const QUANTUM = new Set(['suspect', 'strong']);
const STRUCT_OK = new Set(['structural', 'suspect', 'strong']);
type Agg = { n: number; quantum: number; structural: number; role: Role; source: string };
// Huvudtabellen aggregeras på SCREENING-steget (alla körningar); confirmation
// redovisas separat (bara kandidater/audit).
function aggregate(rowset: Row[]): Map<string, Agg> {
  const m = new Map<string, Agg>();
  for (const r of rowset) {
    const key = `${r.scenario}|${r.signature}`;
    const a = m.get(key) ?? { n: 0, quantum: 0, structural: 0, role: r.role, source: r.source };
    a.n++;
    if (QUANTUM.has(r.verdict)) a.quantum++;
    if (STRUCT_OK.has(r.verdict)) a.structural++;
    m.set(key, a);
  }
  return m;
}
const agg = aggregate(screenRows);

const header = Object.keys(rows[0]) as (keyof Row)[];
writeFileSync(join(OUT_DIR, 'matrix_runs.csv'), [header.join(','), ...rows.map((r) => header.map((k) => String(r[k])).join(','))].join('\n'));

const summaryLines = [`# STEG 1 screening (rep=${SCREEN_REP}), Wilson-95%`, 'scenario|signature|role|source|n|quantum_rate|quantum_wilson95|structural_rate|structural_wilson95'];
for (const [key, a] of [...agg.entries()].sort()) {
  const [ql, qh] = wilson(a.quantum, a.n);
  const [sl, sh] = wilson(a.structural, a.n);
  summaryLines.push(`${key}|${a.role}|${a.source}|${a.n}|${(a.quantum / a.n).toFixed(3)}|[${ql.toFixed(3)},${qh.toFixed(3)}]|${(a.structural / a.n).toFixed(3)}|[${sl.toFixed(3)},${sh.toFixed(3)}]`);
}
// Confirmation-utfall: hur många kandidater/audit som höll vid fin upplösning.
const confQuantum = confirmRows.filter((r) => QUANTUM.has(r.verdict)).length;
const confStruct = confirmRows.filter((r) => STRUCT_OK.has(r.verdict)).length;
const auditConfirmedPositive = confirmRows.filter((r) => r.role === 'negative' && STRUCT_OK.has(r.verdict)).length;
summaryLines.push('', `# STEG 2 confirmation (rep=${CONFIRM_REP}): ${confirmRows.length} körningar`);
summaryLines.push(`kandidater_bekräftade_quantum=${confQuantum} · struktur=${confStruct} · audit_negativa_som_blev_positiva=${auditConfirmedPositive}/${auditRows.length}`);
writeFileSync(join(OUT_DIR, 'matrix_summary.txt'), summaryLines.join('\n'));

writeFileSync(join(OUT_DIR, 'matrix_manifest.json'), JSON.stringify({
  metaSeed: META_SEED, seedsPerScenario: SEEDS, duration: DURATION,
  screeningReplicates: SCREEN_REP, confirmReplicates: CONFIRM_REP, candidateP: CANDIDATE_P, auditN: AUDIT_N,
  uniqueScenarioSeedPairs: scenSeedPairs.size, screeningRuns: screenRows.length,
  candidates: candidateRows.length, auditRuns: auditRows.length, confirmations: confirmRows.length,
  scenarios: scenarios.map((s) => ({ id: s.id, descSv: s.descSv, signatures: s.signatures })),
  seedList, totalRows: rows.length, wallSeconds: (Date.now() - t0) / 1000,
}, null, 2));

console.log(`\nKLART: ${rows.length} rader (${screenRows.length} screen + ${confirmRows.length} confirm), ${SEEDS} seeds/scenario, ${((Date.now() - t0) / 1000).toFixed(1)}s.`);
console.log(summaryLines.join('\n'));
