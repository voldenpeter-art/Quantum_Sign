// Kör hela import-/analyspipelinen mot riktiga NIST-rådatafiler (Shalm et al.
// 2015, "Strong Loophole-Free Test of Local Realism"). Se
// src/import/nistBellRaw.ts och src/import/ch74.ts för metodbeskrivning.
//
// Körs med: npx tsx scripts/importNistBell.ts <aliceFile.dat> <bobFile.dat>

import {
  parseRawFile,
  selectGpsBracketedBurst,
  computeGpsOffsetTicks,
  sliceBurst,
  pairTrials,
  delayHistogramAndGate,
  singlesHistogramBySetting,
  detectContaminatedRanges,
  TICK_S,
} from './lib/nistBellRaw';
import { computeCH74 } from './lib/ch74';
import { computeEberhard } from './lib/eberhard';

const aliceFile = process.argv[2];
const bobFile = process.argv[3];
if (!aliceFile || !bobFile) {
  console.error('Usage: npx tsx scripts/importNistBell.ts <aliceFile.dat> <bobFile.dat>');
  process.exit(1);
}

const t0 = Date.now();
console.log('Läser alice...');
const aliceParsed = await parseRawFile(aliceFile);
console.log(`  ${aliceParsed.windowSyncTick.length} fönster, ${aliceParsed.bursts.length} bursts, ${aliceParsed.gpsTicks.length} GPS-pulser (${((Date.now()-t0)/1000).toFixed(1)}s)`);

console.log('Läser bob...');
const bobParsed = await parseRawFile(bobFile);
console.log(`  ${bobParsed.windowSyncTick.length} fönster, ${bobParsed.bursts.length} bursts, ${bobParsed.gpsTicks.length} GPS-pulser (${((Date.now()-t0)/1000).toFixed(1)}s)`);

console.log('\nBursts (alice):');
for (const b of aliceParsed.bursts) {
  console.log(`  [${b.startWindowIdx}-${b.endWindowIdx}] syncCount=${b.syncCount} duration=${((b.endTick-b.startTick)*TICK_S).toFixed(2)}s`);
}
console.log('Bursts (bob):');
for (const b of bobParsed.bursts) {
  console.log(`  [${b.startWindowIdx}-${b.endWindowIdx}] syncCount=${b.syncCount} duration=${((b.endTick-b.startTick)*TICK_S).toFixed(2)}s`);
}

// Bob väljs via GPS-bracketed burst (pålitlig, sammanhängande täckning).
// Alice PAR-AS MOT HELA HENNES FIL, inte bara hennes egen GPS-bracketed
// burst: hennes GPS-kanal visade sig ha egna, oberoende glapp (985 pulser
// utspridda över 6 bursts, där bara EN — den sista, 52.7 s — råkade
// GPS-täckas) som INTE nödvändigtvis speglar glapp i själva sync-/
// detektorströmmen. Klockoffseten är redan validerad (matchade GPS-pulser
// nedan) och driftar inte (samma delade 10 MHz-referens) — att bara pröva
// mot bobs betrodda fönster och låta toleransen naturligt förkasta det som
// inte överlappar är säkrare än att i förväg utesluta alices andra,
// GPS-lösa men annars giltiga bursts.
const bobBurst = selectGpsBracketedBurst(bobParsed);
console.log(`\nVald burst (bob): syncCount=${bobBurst.syncCount}, duration=${((bobBurst.endTick-bobBurst.startTick)*TICK_S).toFixed(2)}s`);

console.log('\nBeräknar GPS-baserad klockoffset...');
const { offsetTicks, matchedPulses } = computeGpsOffsetTicks(aliceParsed.gpsTicks, bobParsed.gpsTicks);
console.log(`  offset=${offsetTicks.toFixed(1)} tick (${(offsetTicks*TICK_S*1e9).toFixed(2)} ns), matchade GPS-pulser=${matchedPulses}/${aliceParsed.gpsTicks.length}`);

console.log('\nParar trials (alice: hela filen, bob: vald burst)...');
const aliceSlice = {
  syncTick: aliceParsed.windowSyncTick,
  setting: aliceParsed.windowSetting,
  clicked: aliceParsed.windowClicked,
  clickDelayTicks: aliceParsed.windowClickDelayTicks,
  startIdx: 0,
  endIdx: aliceParsed.windowSyncTick.length - 1,
};
const bobSlice = sliceBurst(bobParsed, bobBurst);
const paired = pairTrials(aliceSlice, bobSlice, offsetTicks);

// GRANSKNINGSFYND: en okontrollerad toppsökning fastnar i elektrisk
// kontamination (se singlesHistogramBySetting-dokumentationen) — verifierat
// att alices automatiska grind (510-550 ns) föll MITT I en region där
// setting=1 nästan dubblerar hennes egen klickfrekvens helt okonditionerat
// på bob. Kontaminerade intervall upptäcks separat per part (egna klick,
// egen inställning, INGET koincidenskrav) och utesluts explicit innan
// grindens toppsökning körs.
console.log('\nKontaminationskontroll (egna klick vs egen inställning, okonditionerat på motparten)...');
const aliceSinglesHist = singlesHistogramBySetting(aliceSlice);
const bobSinglesHist = singlesHistogramBySetting(bobSlice);
const aliceContaminated = detectContaminatedRanges(aliceSinglesHist);
const bobContaminated = detectContaminatedRanges(bobSinglesHist);
const fmtRanges = (ranges: typeof aliceContaminated) =>
  ranges.length === 0 ? '(inga)' : ranges.map((r) => `[${(r.loTicks*TICK_S*1e9).toFixed(0)}-${(r.hiTicks*TICK_S*1e9).toFixed(0)}ns]`).join(', ');
console.log(`  alice kontaminerade intervall: ${fmtRanges(aliceContaminated)}`);
console.log(`  bob   kontaminerade intervall: ${fmtRanges(bobContaminated)}`);

console.log('\nFördröjningshistogram + automatiskt grindval (kontamination utesluten)...');
const aliceHist = delayHistogramAndGate(aliceSlice, 128, aliceContaminated);
const bobHist = delayHistogramAndGate(bobSlice, 128, bobContaminated);
const fmtGate = (h: typeof aliceHist) =>
  `[${h.gate.loTicks}-${h.gate.hiTicks}] tick = [${(h.gate.loTicks * TICK_S * 1e9).toFixed(1)}-${(h.gate.hiTicks * TICK_S * 1e9).toFixed(1)}] ns, ` +
  `topp-bin ${h.peakBin} (${(h.peakBin * h.binTicks * TICK_S * 1e9).toFixed(1)} ns), bakgrund/bin ${h.backgroundPerBin}, ` +
  `andel klick i grind ${(100 * h.inGateFraction).toFixed(1)}%`;
console.log(`  alice: ${fmtGate(aliceHist)}`);
console.log(`  bob:   ${fmtGate(bobHist)}`);

// Fönsterskift-skanning: GPS-offseten justerar VÄGGKLOCKAN, men fotonparets
// två ben når alice respektive bob via olika fiber-/kabelvägar, och sync-
// distributionens fördröjning skiljer sig mellan parterna — den SANNA
// trial-korrespondensen kan därför ligga ett eller flera hela sync-perioder
// från väggklocks-parningen. Symptomet är exakt det observerade: skarpa,
// inställningsberoende grindade singles men joint ≈ 0 (under accidental-
// nivå). Skanna k ∈ [-3, +3] hela perioder och låt joint-summan peka ut den
// fysiskt riktiga parningen.
const periodTicks = (bobBurst.endTick - bobBurst.startTick) / (bobBurst.syncCount - 1);
console.log(`\nFönsterskift-skanning (period=${periodTicks.toFixed(1)} tick = ${(periodTicks * TICK_S * 1e6).toFixed(3)} µs):`);
let bestShift = 0;
let bestJoint = -1;
let pairedGated = pairTrials(aliceSlice, bobSlice, offsetTicks, 5000, aliceHist.gate, bobHist.gate);
for (let k = -3; k <= 3; k++) {
  const p = pairTrials(aliceSlice, bobSlice, offsetTicks + k * periodTicks, 5000, aliceHist.gate, bobHist.gate);
  const jointSum = Object.values(p.joint).reduce((s, v) => s + v, 0);
  console.log(`  skift ${k >= 0 ? '+' : ''}${k} fönster: joint=${jointSum} (matched=${p.matchedTrials})`);
  if (jointSum > bestJoint) {
    bestJoint = jointSum;
    bestShift = k;
    pairedGated = p;
  }
}
console.log(`  → bästa skift: ${bestShift} fönster (joint=${bestJoint})`);

console.log(`\nGrindade trials (skift ${bestShift}): matched=${pairedGated.matchedTrials}`);
console.log(`  joint:`, pairedGated.joint);
console.log(`  aliceOnly:`, pairedGated.aliceOnly);
console.log(`  bobOnly:`, pairedGated.bobOnly);
console.log(`  matchedTrials=${paired.matchedTrials}, unmatchedAliceWindows=${paired.unmatchedAliceWindows}`);
console.log(`  joint:`, paired.joint);
console.log(`  aliceOnly:`, paired.aliceOnly);
console.log(`  bobOnly:`, paired.bobOnly);
console.log(`  neither:`, paired.neither);

console.log('\n=== CH74 (symmetrisk läroboksform) ===');
const ch74 = computeCH74(paired);
console.log(`J = ${ch74.J.toFixed(6)}  (klassisk gräns: J ≤ 0)`);
console.log('Termer:', ch74.terms);
console.log(`T (totalt parade trials) = ${ch74.T}`);

function printEberhard(title: string, counts: Parameters<typeof computeEberhard>[0]) {
  console.log(`\n=== CH-Eberhard: ${title} (alla 4 märkningar, look-elsewhere ×4) ===`);
  const eb = computeEberhard(counts);
  for (const l of eb.labelings) {
    const label = `a1=${l.aliceSwap ? 's1' : 's0'}, b1=${l.bobSwap ? 's1' : 's0'}`;
    console.log(
      `  [${label}] J = ${l.J} counts (${l.JperTrial.toExponential(3)}/trial), ` +
      `naiv Poisson-z = ${l.z.toFixed(2)}  ${l.J > 0 ? '<-- J > 0' : ''}`,
    );
    console.log(
      `      N++(a1b1)=${l.terms.nPP_a1b1}  N+o(a1b2)=${l.terms.nPo_a1b2}  ` +
      `No+(a2b1)=${l.terms.noP_a2b1}  N++(a2b2)=${l.terms.nPP_a2b2}`,
    );
  }
  console.log('  (Klassisk gräns J ≤ 0 per märkning; z är naiv Poisson-diagnostik, inte trial-nivå-analys.)');
}

printEberhard('OGRINDAD (hela sync-fönstret)', paired);
printEberhard('FÖRDRÖJNINGSGRINDAD (Pockels-toppen)', pairedGated);

// 2D-koincidensdiagnostik: för matchade fönster där BÅDA parterna klickade,
// histogram över (fördröjning_alice, fördröjning_bob). Äkta fotonpar bildar
// en skarp 2D-topp vid det sanna fördröjningsparet — 1D-topparna per part
// kan vara elektronik/svetsartefakter som inte är parfysiken.
{
  console.log('\n=== 2D-koincidenshistogram (båda klickade, oskiftad parning) ===');
  const binT = 128; // 10 ns
  const nb = Math.ceil(140_000 / binT);
  const grid = new Int32Array(nb * nb);
  let bothCount = 0;
  for (let i = aliceSlice.startIdx; i <= aliceSlice.endIdx; i++) {
    if (aliceSlice.clicked[i] !== 1) continue;
    const settingA = aliceSlice.setting[i];
    if (settingA !== 0 && settingA !== 1) continue;
    const target = aliceSlice.syncTick[i] + offsetTicks;
    // återanvänd binärsökningen via pairTrials-ekvivalent inline-sökning
    let lo = bobSlice.startIdx;
    let hi = bobSlice.endIdx;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (bobSlice.syncTick[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    let j = lo;
    if (j > bobSlice.startIdx && Math.abs(bobSlice.syncTick[j - 1] - target) <= Math.abs(bobSlice.syncTick[j] - target)) j = j - 1;
    if (Math.abs(bobSlice.syncTick[j] - target) > 5000) continue;
    if (bobSlice.clicked[j] !== 1) continue;
    const dA = aliceSlice.clickDelayTicks[i];
    const dB = bobSlice.clickDelayTicks[j];
    if (dA < 0 || dA >= 140_000 || dB < 0 || dB >= 140_000) continue;
    grid[Math.floor(dA / binT) * nb + Math.floor(dB / binT)]++;
    bothCount++;
  }
  console.log(`  fönster där båda klickade (med giltiga fördröjningar): ${bothCount}`);
  const top: { a: number; b: number; c: number }[] = [];
  for (let a = 0; a < nb; a++) {
    for (let b = 0; b < nb; b++) {
      const c = grid[a * nb + b];
      if (c > 0) {
        top.push({ a, b, c });
      }
    }
  }
  top.sort((x, y) => y.c - x.c);
  console.log('  topp-10 celler (binA, binB → ns_A, ns_B, count):');
  for (const t of top.slice(0, 10)) {
    console.log(`    bin(${t.a},${t.b}) = (${(t.a * binT * TICK_S * 1e9).toFixed(0)} ns, ${(t.b * binT * TICK_S * 1e9).toFixed(0)} ns): ${t.c}`);
  }
  const totalInTop10 = top.slice(0, 10).reduce((s, t) => s + t.c, 0);
  console.log(`  (summa topp-10: ${totalInTop10} av ${bothCount})`);

  // Ås-marginal: par på 120ns-diagonalen (dB−dA ∈ [110,130] ns), histogram
  // längs dA uppdelat på de fyra inställningskombinationerna. Där kurvorna
  // skiljer sig åt är Pockels-cellen aktiv — det är analys-sloten.
  console.log('\n  Ås-marginal (ridge-par, 100 ns-binnar längs dA, fyrvägs per inställning):');
  const RIDGE_LO = 110e-9 / TICK_S; // 1408 tick
  const RIDGE_HI = 130e-9 / TICK_S; // 1664 tick
  const MARG_BIN = 1280; // 100 ns
  const nMarg = Math.ceil(140_000 / MARG_BIN);
  const marg: Record<string, Int32Array> = {
    '0,0': new Int32Array(nMarg),
    '0,1': new Int32Array(nMarg),
    '1,0': new Int32Array(nMarg),
    '1,1': new Int32Array(nMarg),
  };
  for (let i = aliceSlice.startIdx; i <= aliceSlice.endIdx; i++) {
    if (aliceSlice.clicked[i] !== 1) continue;
    const settingA = aliceSlice.setting[i];
    if (settingA !== 0 && settingA !== 1) continue;
    const target = aliceSlice.syncTick[i] + offsetTicks;
    let lo2 = bobSlice.startIdx;
    let hi2 = bobSlice.endIdx;
    while (lo2 < hi2) {
      const mid = (lo2 + hi2) >>> 1;
      if (bobSlice.syncTick[mid] < target) lo2 = mid + 1;
      else hi2 = mid;
    }
    let j = lo2;
    if (j > bobSlice.startIdx && Math.abs(bobSlice.syncTick[j - 1] - target) <= Math.abs(bobSlice.syncTick[j] - target)) j = j - 1;
    if (Math.abs(bobSlice.syncTick[j] - target) > 5000) continue;
    if (bobSlice.clicked[j] !== 1) continue;
    const settingB = bobSlice.setting[j];
    if (settingB !== 0 && settingB !== 1) continue;
    const dA = aliceSlice.clickDelayTicks[i];
    const dB = bobSlice.clickDelayTicks[j];
    if (dA < 0 || dB < 0) continue;
    const diff = dB - dA;
    if (diff < RIDGE_LO || diff > RIDGE_HI) continue;
    const bin = Math.floor(dA / MARG_BIN);
    if (bin >= 0 && bin < nMarg) marg[`${settingA},${settingB}`][bin]++;
  }
  const totals = new Int32Array(nMarg);
  for (const key of ['0,0', '0,1', '1,0', '1,1']) {
    for (let b = 0; b < nMarg; b++) totals[b] += marg[key][b];
  }
  // skriv ut binnar med väsentligt innehåll + modulationsmått
  for (let b = 0; b < nMarg; b++) {
    if (totals[b] < 50) continue;
    const c00 = marg['0,0'][b];
    const c01 = marg['0,1'][b];
    const c10 = marg['1,0'][b];
    const c11 = marg['1,1'][b];
    const mx = Math.max(c00, c01, c10, c11);
    const mn = Math.min(c00, c01, c10, c11);
    const mod = mx > 0 ? ((mx - mn) / mx) : 0;
    console.log(
      `    dA=${(b * MARG_BIN * TICK_S * 1e9).toFixed(0)}-${((b + 1) * MARG_BIN * TICK_S * 1e9).toFixed(0)} ns: ` +
      `00=${c00} 01=${c01} 10=${c10} 11=${c11}  (modulation ${(100 * mod).toFixed(0)}%)`,
    );
  }
}


console.log(`\nTotal tid: ${((Date.now()-t0)/1000).toFixed(1)}s`);
