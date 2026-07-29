// Signatur D — Stabil invariant (D-rapporten). ÄRVER B:s rådata (bFeatures) —
// se arvsregeln. v1-FÖRENKLING: plattformen kör en körning i taget (ingen
// flersessions-UI ännu), så "sessioner" simuleras genom att dela upp EN
// körnings tidsfönster i `numSegments` sekventiella pseudosessioner. Detta är
// en medveten avvikelse från D-rapportens S ≥ 2 OBEROENDE observationstillfällen
// (§2.1) — TODO(rapport): riktig flersessionsstöd krävs för skarp D-klassning.
// Invariant-vektorn är korrigerad till d = 2 ([λ̃₁, λ̃₂]) per §4.3.

import type { AnalysisContext, SignatureResult } from './types';
import type { EventStream, PhotonEvent } from '../types/events';
import type { NullId } from '../types/signatures';
import { computeBFeatures } from './bFeatures';
import { eigenvaluesSym3, mean, variance, empiricalPValue, pSquared } from './stats';
import { generateNull } from '../nulls';

const NUM_SEGMENTS = 4;
const D_NULLS: NullId[] = ['S1', 'S3', 'S4'];

// RF_stokes_bound (omöjlighetsdetektor, syntesrapporten §7 punkt 5): en äkta
// Stokes-kovariansmatris är positivt semidefinit — alla egenvärden ≥ 0. Ett
// MENINGSFULLT negativt egenvärde (mer negativt än numeriskt brus relativt
// spåret) är en FYSIKALISK omöjlighet: det kan inte komma från en riktig
// kovarians utan signalerar ett trasigt/normaliseringsfel i estimatorn. Vi
// tillåter en liten tolerans för Jacobi-avrundning.
const STOKES_PSD_TOL = 0.05; // andel av spåret

function stokesPsdMargin(stream: EventStream): number {
  const sigma = computeBFeatures(stream).sigma;
  const eig = eigenvaluesSym3(sigma);
  const traceAbs = eig.reduce((a, b) => a + Math.abs(b), 0) || 1;
  return Math.min(...eig) / traceAbs; // < 0 ⇒ PSD-brott
}

function segmentStream(stream: EventStream, numSegments: number): EventStream[] {
  const segLen = stream.duration / numSegments;
  const segments: PhotonEvent[][] = Array.from({ length: numSegments }, () => []);
  for (const e of stream.events) {
    const idx = Math.min(numSegments - 1, Math.floor(e.detectedT / segLen));
    const segStart = idx * segLen;
    segments[idx].push({ ...e, detectedT: e.detectedT - segStart, t: e.t - segStart });
  }
  return segments.map((events) => ({
    events,
    duration: segLen,
    seed: stream.seed,
    sourceRate: stream.sourceRate,
  }));
}

function invariantOf(stream: EventStream): [number, number] {
  const sigma = computeBFeatures(stream).sigma;
  const eig = eigenvaluesSym3(sigma).map((v) => Math.max(v, 0));
  const sum = eig.reduce((a, b) => a + b, 0) || 1;
  return [eig[0] / sum, eig[1] / sum];
}

function chi2ConstVec(points: [number, number][], varScale: number): number {
  const bar0 = mean(points.map((p) => p[0]));
  const bar1 = mean(points.map((p) => p[1]));
  const guard = Math.max(varScale, 1e-9);
  return points.reduce((acc, p) => acc + ((p[0] - bar0) ** 2 + (p[1] - bar1) ** 2) / guard, 0);
}

export function analyzeD(ctx: AnalysisContext): SignatureResult {
  const { stream, config, rng, nullReplicates } = ctx;
  const segments = segmentStream(stream, NUM_SEGMENTS);
  const invariants = segments.map(invariantOf);
  const Ibar: [number, number] = [mean(invariants.map((i) => i[0])), mean(invariants.map((i) => i[1]))];

  const rates = segments.map((s) => s.events.filter((e) => e.arm === 'A').length / s.duration);
  const rateVar = variance(rates);
  const rateBar = mean(rates);
  const kdFluxChi2 = rateVar > 0 ? rates.reduce((a, r) => a + (r - rateBar) ** 2 / rateVar, 0) : 0;

  // Referensspridning för invariant-skattningen: variansen hos segmenterade S1-surrogat.
  const s1Points: [number, number][] = [];
  for (let i = 0; i < Math.max(nullReplicates, 4); i++) {
    const surrogate = generateNull('S1', stream, config, rng.fork());
    s1Points.push(...segmentStream(surrogate, NUM_SEGMENTS).map(invariantOf));
  }
  const varScale = mean(s1Points.map((p) => (p[0] - mean(s1Points.map((q) => q[0]))) ** 2 + (p[1] - mean(s1Points.map((q) => q[1]))) ** 2)) || 1e-6;

  const chi2Const = chi2ConstVec(invariants, varScale);
  const kD = chi2Const > 1e-9 ? kdFluxChi2 / chi2Const : 0;

  // p⁽²⁾-regeln: ett p PER surrogatfamilj för stabilitetstestet (chi2_const),
  // beslutet bärs av det NÄST minsta. Pooling bevaras enbart för visualiseringen.
  const nullChi2s: number[] = [];
  const stabPByFamily: number[] = [];
  for (const nullId of D_NULLS) {
    const familyChi2s: number[] = [];
    for (let i = 0; i < nullReplicates; i++) {
      const surrogate = generateNull(nullId, stream, config, rng.fork());
      const segInv = segmentStream(surrogate, NUM_SEGMENTS).map(invariantOf);
      familyChi2s.push(chi2ConstVec(segInv, varScale));
    }
    stabPByFamily.push(empiricalPValue(chi2Const, familyChi2s, 'less'));
    nullChi2s.push(...familyChi2s);
  }
  const pStab = pSquared(stabPByFamily);

  // Separationstestet — samma p⁽²⁾-disciplin: avstånd till VARJE familjs
  // invariant-moln, andra minsta p bär. Tidigare mättes bara mot S4-molnet.
  const sepPByFamily: number[] = [];
  const nullDists: number[] = [];
  const observedDistByFamily: number[] = [];
  for (const nullId of D_NULLS) {
    const familyInv: [number, number][] = [];
    for (let i = 0; i < nullReplicates; i++) {
      const surrogate = generateNull(nullId, stream, config, rng.fork());
      familyInv.push(invariantOf(surrogate));
    }
    const fMean: [number, number] = [
      mean(familyInv.map((p) => p[0])),
      mean(familyInv.map((p) => p[1])),
    ];
    const dist = (p: [number, number]) => Math.hypot(p[0] - fMean[0], p[1] - fMean[1]);
    const familyDists = familyInv.map(dist);
    nullDists.push(...familyDists);
    observedDistByFamily.push(dist(Ibar));
    sepPByFamily.push(empiricalPValue(dist(Ibar), familyDists, 'greater'));
  }
  const pSep = pSquared(sepPByFamily);
  // Representativt observerat separationsavstånd för UI (medel över familjerna).
  const observedDist = mean(observedDistByFamily);

  // Omöjlighetsdetektor: PSD-brott i den skattade Stokes-kovariansen.
  const psdMargin = stokesPsdMargin(stream);
  const stokesBoundViolated = psdMargin < -STOKES_PSD_TOL;

  // FÖRTJÄNAD NOMENKLATUR (types.ts): D-pol är KVANTNEUTRAL — den mäter en
  // instrumentinvariant, inte ett icke-klassicitetsvittne (D-rapporten §5.1/5.3:
  // "ingen intern statistik kan skilja källans invariant från instrumentets").
  // Taket är därför 'structural' (fingerprint), aldrig 'suspect'/'strong'. En
  // äkta D-Q kräver ett korrigerat externt vittne som denna plattform saknar.
  const K_D_THRESHOLD = 10;
  let verdict: SignatureResult['verdict'] = 'none';
  let verdictLabelSv = 'D-none';
  if (stokesBoundViolated) {
    // Fysikalisk omöjlighet ⇒ ingen struktur-utsaga; estimatorn är trasig.
    verdict = 'none';
    verdictLabelSv = 'D-ogiltig (RF_stokes_bound: PSD-brott)';
  } else if (pStab < 1e-2 && pSep < 1e-2 && kD > K_D_THRESHOLD) {
    verdict = 'structural';
    verdictLabelSv =
      pStab < 1e-3 && pSep < 1e-3 && kD > K_D_THRESHOLD * 1.5
        ? 'D-fingerprint (strukturell, kvantneutral)'
        : 'D-fingerprint-svag (strukturell, kvantneutral)';
  }

  return {
    id: 'D',
    verdict,
    verdictLabelSv,
    components: [
      { key: 'lambda1', labelSv: 'λ̃₁', value: Ibar[0] },
      { key: 'lambda2', labelSv: 'λ̃₂', value: Ibar[1] },
      { key: 'chi2_const', labelSv: 'χ²_const (stabilitet)', value: chi2Const, pValue: pStab },
      // D-rapporten §5.1: D:s evidensinnehåll bärs nästan helt av D-sep (separation);
      // D-stab (chi2_const) är ett konsistenskrav, inte evidens i sig — separation
      // markeras därför primary för kombinerad evidens (analysis/combine.ts).
      { key: 'separation', labelSv: 'Separation mot null', value: observedDist, pValue: pSep, primary: true },
      { key: 'k_d', labelSv: 'K_D (kontrastkvot)', value: kD, classicalReference: K_D_THRESHOLD },
    ],
    redFlags: [
      {
        code: 'D-RF-PSEUDOSESSION',
        labelSv: 'Pseudosessioner, ej oberoende observationstillfällen',
        triggered: true,
        detailSv: `v1 delar en körning i ${NUM_SEGMENTS} tidssegment istället för S ≥ 2 riktiga sessioner (D-rapporten §2.1).`,
      },
      {
        code: 'D-RF-CONTRAST',
        labelSv: 'Kontrastkrav ej uppfyllt',
        triggered: kD <= K_D_THRESHOLD,
        detailSv: 'K_D under tröskel — omgivningen (flödet) varierade inte bevisligen mer än invarianten.',
      },
      {
        code: 'RF_stokes_bound',
        labelSv: 'Omöjlighetsdetektor: PSD-brott i Stokes-kovariansen',
        triggered: stokesBoundViolated,
        detailSv:
          `Minsta egenvärde / spår = ${psdMargin.toFixed(3)} (tröskel −${STOKES_PSD_TOL}). En äkta ` +
          'kovariansmatris är positivt semidefinit; ett meningsfullt negativt egenvärde är fysikaliskt ' +
          'omöjligt och ogiltigförklarar D-utsagan (estimatorn/normaliseringen är trasig).',
      },
    ],
    nullsUsed: D_NULLS,
    primaryNull: { labelSv: 'χ²_const (stabilitet) mot S1/S3/S4', observed: chi2Const, nullValues: nullChi2s },
    summarySv: 'Basoberoende egenvärdesinvariant ur B:s Stokes-kovarians, testad för separation + stabilitet + kontrast.',
    floorNoteSv: 'Ingen intern statistik kan skilja källans invariant från instrumentets (D-rapporten §5.3).',
  };
}
