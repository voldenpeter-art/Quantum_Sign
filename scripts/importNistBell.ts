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
  TICK_S,
} from './lib/nistBellRaw';
import { computeCH74 } from './lib/ch74';

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
  startIdx: 0,
  endIdx: aliceParsed.windowSyncTick.length - 1,
};
const bobSlice = sliceBurst(bobParsed, bobBurst);
const paired = pairTrials(aliceSlice, bobSlice, offsetTicks);
console.log(`  matchedTrials=${paired.matchedTrials}, unmatchedAliceWindows=${paired.unmatchedAliceWindows}`);
console.log(`  joint:`, paired.joint);
console.log(`  aliceOnly:`, paired.aliceOnly);
console.log(`  bobOnly:`, paired.bobOnly);
console.log(`  neither:`, paired.neither);

console.log('\n=== CH74 ===');
const ch74 = computeCH74(paired);
console.log(`J = ${ch74.J.toFixed(6)}  (klassisk gräns: J ≤ 0)`);
console.log('Termer:', ch74.terms);
console.log(`T (totalt parade trials) = ${ch74.T}`);

console.log(`\nTotal tid: ${((Date.now()-t0)/1000).toFixed(1)}s`);
