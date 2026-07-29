// Import av NIST:s riktiga, publicerade rådata från "Strong Loophole-Free Test of
// Local Realism" (Shalm et al. 2015) — https://www.nist.gov/pml/applied-physics-division/
// bell-test-research-software-and-data. Formatet är dokumenterat i
// file_folder_descriptions.pdf (NIST, senast uppdaterad 2015-12-23).
//
// VIKTIGT — detta är INTE en symmetrisk tvådetektor-CHSH-uppställning som
// analysis/C_chsh.ts antar. Varje part har EN klickkanal; utfallet är
// "klick inom det tilldelade Pockelscell-fönstret" kontra "inget klick" —
// en Eberhard/Clauser–Horne(1974)-uppställning, avsiktligt vald av NIST för
// att undvika "fair sampling"-antagandet (den s.k. detektionsluckan). Vi
// återanvänder därför INTE C_chsh.ts:s parningslogik — den skulle mäta fel
// sak. Se ch74.ts för själva olikheten.
//
// Rådataformat (en post = 24 byte, tre 8-byte unsigned integers):
//   [0]  kanal (filnumrering, 0-indexerad — SKILJER SIG från frontpanelens
//        1-indexerade märkning enligt PDF:en)
//   [1]  timetag, 78.125 ps/tick (12.8 GHz klocka)
//   [2]  "transfer number" — hur många gånger datorn tömde
//        timetaggerbufferten till disk (≈ förflutna sekunder)
//
// Kanaler (filnumrering):
//   0 = detektorklick
//   2 = RNG-utfall "setting 0"
//   4 = RNG-utfall "setting 1"
//   5 = GPS PPS (1 Hz, extern absolut tidsreferens, oberoende av Pockelscellen)
//   6 = sync (Pockelscellen slås på — definierar en ny "trial"-fönster)
//   64 = odokumenterad — verifierat empiriskt mot riktiga filer: ett
//        datum/klockstämpel-liknande värde (t.ex. 20150918093142) som ökar
//        med exakt 1 per post och sammanfaller ungefär var 200 000:e post.
//        Försumbar andel av strömmen (~0.0005 %). Behandlas som brus/heartbeat
//        och kasseras — INTE del av den dokumenterade fysiken.
//        BEKRÄFTAT av K. Shalm (e-postkorrespondens, juli 2026): en tillagd
//        "heartbeat" (dator- eller GPS-klocka, han mindes inte vilken), ingick
//        inte i NIST:s egen analys — säkert att kassera.

import { open } from 'node:fs/promises';

export const TICK_S = 78.125e-12;
export const TICKS_PER_SECOND = 12_800_000_000; // = 1 / 78.125e-12, exakt

const RECORD_SIZE = 24;
const CH_DETECTOR = 0;
const CH_RNG_SETTING_0 = 2;
const CH_RNG_SETTING_1 = 4;
const CH_GPS_PPS = 5;
const CH_SYNC = 6;

// Två sync-poster mer än 10 ms isär betraktas som en paus mellan separata
// insamlingsomgångar ("bursts"), inte brus — normal sync-kadens ligger
// empiriskt kring 10.09 µs (98.4 % av alla mellanrum i de nedladdade
// filerna föll i fönstret 10.0–10.1 µs; se granskningen i konversationen).
const BURST_GAP_THRESHOLD_S = 0.01;

export interface Burst {
  startWindowIdx: number;
  endWindowIdx: number; // inklusive
  startTick: number;
  endTick: number;
  syncCount: number;
}

export interface ParsedFile {
  bursts: Burst[];
  gpsTicks: number[]; // sorterad
  windowSyncTick: Float64Array; // tick för varje trial-fönsters STARTsync
  windowSetting: Int8Array; // 0 | 1 | -1 (ingen/båda RNG-kanalerna sågs i fönstret)
  windowClicked: Uint8Array; // 0 | 1
  /**
   * FÖRSTA klickets fördröjning efter fönstrets sync, i tick; -1 om inget
   * klick. Float32 räcker: max-fördröjningen (~129 k tick) ligger långt under
   * float32:s exakta heltalsgräns (2^24). Behövs för fördröjningsgrindning:
   * Pockelscell-fönstret är bara ~16 laser-cykler (~200 ns) av sync-periodens
   * ~10.09 µs — klick utanför den smala fördröjningstoppen är bakgrund/mörker
   * och bär ingen inställningsberoende fysik (jfr NIST:s "cw45"-metadata:
   * "the relative delay from the sync used to define a click ... and its
   * radius").
   */
  windowClickDelayTicks: Float32Array;
}

/**
 * En enda strömmande genomläsning av en rå .dat-fil. Bygger trial-fönster
 * ([sync_i, sync_{i+1})) och en lista GPS PPS-tickar. Håller INTE hela filen
 * i minnet som poster — bara de härledda fönstren (~20-30 M st för dessa
 * filer, hanterbart som numeriska arrayer).
 */
export async function parseRawFile(path: string): Promise<ParsedFile> {
  const fh = await open(path, 'r');
  const stat = await fh.stat();
  const chunkRecords = 1_000_000;
  const buf = Buffer.alloc(chunkRecords * RECORD_SIZE);

  const gpsTicks: number[] = [];
  const syncTicks: number[] = [];
  const settings: number[] = [];
  const clickedFlags: number[] = [];
  const clickDelays: number[] = [];

  let position = 0;
  let curSyncTick: number | null = null;
  let curClicked = 0;
  let curClickDelay = -1;
  let sawRng0 = false;
  let sawRng1 = false;

  function closeWindow() {
    if (curSyncTick === null) return;
    syncTicks.push(curSyncTick);
    settings.push(sawRng0 && !sawRng1 ? 0 : sawRng1 && !sawRng0 ? 1 : -1);
    clickedFlags.push(curClicked);
    clickDelays.push(curClickDelay);
  }

  while (position < stat.size) {
    const { bytesRead } = await fh.read(buf, 0, buf.length, position);
    if (bytesRead === 0) break;
    const n = Math.floor(bytesRead / RECORD_SIZE);
    for (let i = 0; i < n; i++) {
      const off = i * RECORD_SIZE;
      const ch = Number(buf.readBigUInt64LE(off));
      if (ch === 64) continue; // odokumenterad heartbeat, se filhuvud
      // Tick-värden i dessa filer håller sig < 2^53 (verifierat: max ~2.2e15,
      // säkerhetsgränsen är ~9.007e15) — Number() tappar ingen precision här.
      const tick = Number(buf.readBigUInt64LE(off + 8));

      switch (ch) {
        case CH_SYNC:
          closeWindow();
          curSyncTick = tick;
          curClicked = 0;
          curClickDelay = -1;
          sawRng0 = false;
          sawRng1 = false;
          break;
        case CH_RNG_SETTING_0:
          sawRng0 = true;
          break;
        case CH_RNG_SETTING_1:
          sawRng1 = true;
          break;
        case CH_DETECTOR:
          if (curClicked === 0 && curSyncTick !== null) {
            curClickDelay = tick - curSyncTick;
          }
          curClicked = 1;
          break;
        case CH_GPS_PPS:
          gpsTicks.push(tick);
          break;
        default:
          break; // odokumenterade/oanvända kanaler
      }
    }
    position += bytesRead;
  }
  closeWindow(); // sista, ev. trunkerade fönstret
  await fh.close();

  const windowSyncTick = Float64Array.from(syncTicks);
  const windowSetting = Int8Array.from(settings);
  const windowClicked = Uint8Array.from(clickedFlags);
  const windowClickDelayTicks = Float32Array.from(clickDelays);

  const bursts: Burst[] = [];
  let burstStart = 0;
  for (let i = 1; i < windowSyncTick.length; i++) {
    const gapS = (windowSyncTick[i] - windowSyncTick[i - 1]) * TICK_S;
    // GRANSKNINGSFYND (bindande, bevarat som varning): en tidigare version
    // splittade bara på FRAMÅT-hopp (gapS > tröskel). Verifierat empiriskt mot
    // den riktiga "afterfixingModeLocking"-filen: exakt 5 framåthopp OCH 5
    // BAKÅThopp av EXAKT samma magnitud (112987.214 s) förekommer, tydligt
    // alternerande mellan två tick-"epoker" (~0.77e15 respektive ~2.2e15).
    // Att bara fånga framåthoppen delade filen i 6 "bursts" där flera av dem
    // i praktiken innehöll ett dolt bakåthopp mitt inuti — vilket bryter
    // antagandet om sorterad ordning som binärsökningen i pairTrials() vilar
    // på. Fixad genom att splitta på |gapS| > tröskel (båda riktningarna).
    // BEKRÄFTAT av K. Shalm (e-postkorrespondens, juli 2026): hoppen är en
    // känd firmware-bugg i timetaggarna. NIST:s egen analys förlitade sig
    // inte på absoluta timetags utan på sync-pulsernas positioner RELATIVT
    // varandra ("we find and align the sync pulses, then define trial
    // windows relative to the syncs") — vilket är exakt den egenskap som
    // gör per-burst-hanteringen här giltig: inom en burst är den relativa
    // ordningen intakt, och absoluta tick används bara för burst-avgränsning
    // och GPS-förankring, aldrig som fysikaliskt mätvärde.
    if (Math.abs(gapS) > BURST_GAP_THRESHOLD_S) {
      bursts.push(makeBurst(windowSyncTick, burstStart, i - 1));
      burstStart = i;
    }
  }
  if (windowSyncTick.length > 0) {
    bursts.push(makeBurst(windowSyncTick, burstStart, windowSyncTick.length - 1));
  }

  gpsTicks.sort((a, b) => a - b);

  return { bursts, gpsTicks, windowSyncTick, windowSetting, windowClicked, windowClickDelayTicks };
}

function makeBurst(syncTick: Float64Array, startIdx: number, endIdx: number): Burst {
  return {
    startWindowIdx: startIdx,
    endWindowIdx: endIdx,
    startTick: syncTick[startIdx],
    endTick: syncTick[endIdx],
    syncCount: endIdx - startIdx + 1,
  };
}

/**
 * Väljer den burst som mest överlappar GPS PPS-täckningen (den externa,
 * Pockelscell-oberoende 1 Hz-referensen). I de granskade filerna föll GPS-
 * fönstret nästan exakt ihop med EN specifik burst (start ~56 s före dess
 * första sync, slut ~0.4 s före dess sista) — den andra bursten (skild med
 * ett 9–31 timmar långt hopp) saknade GPS-täckning helt och är sannolikt en
 * kvarbliven rest från en tidigare, orelaterad session i samma fil.
 */
export function selectGpsBracketedBurst(parsed: ParsedFile): Burst {
  if (parsed.bursts.length === 0) throw new Error('Inga bursts hittades i filen');
  if (parsed.gpsTicks.length === 0) {
    // Fallback: största bursten (flest sync-pulser).
    return parsed.bursts.reduce((a, b) => (b.syncCount > a.syncCount ? b : a));
  }
  const gpsMin = parsed.gpsTicks[0];
  const gpsMax = parsed.gpsTicks[parsed.gpsTicks.length - 1];
  let best = parsed.bursts[0];
  let bestOverlap = -Infinity;
  for (const b of parsed.bursts) {
    const overlap = Math.min(b.endTick, gpsMax) - Math.max(b.startTick, gpsMin);
    if (overlap > bestOverlap) {
      bestOverlap = overlap;
      best = b;
    }
  }
  return best;
}

/**
 * Beräknar den konstanta tick-offset som gör att alices och bobs oberoende
 * tickräknare (samma klockfrekvens — låsta mot samma delade 10 MHz-referens
 * — men GODTYCKLIGT olika startpunkt) kan jämföras direkt: bobTick ≈
 * aliceTick + offset för samma verkliga händelse.
 *
 * Metod: GPS PPS-pulser markerar samma verkliga UTC-sekundgränser hos båda
 * parter. En "gissad" offset (baserad på de förvalda bursternas första
 * GPS-tick) prövas tillsammans med ±3 heltalssekunder (för att inte fastna
 * på fel sekund om någon av parterna missat den allra första pulsen), och
 * den kandidat som ger flest självkonsistenta parningar mellan ALLA GPS-
 * pulser (inte bara den första) vinner. Den slutliga offseten är medelvärdet
 * av de matchade parens exakta differenser (sub-tick-precision, ~10 ns brus
 * enligt PDF:en).
 */
export function computeGpsOffsetTicks(
  aliceGpsTicks: number[],
  bobGpsTicks: number[],
  toleranceTicks = 100_000, // ~7.8 µs — generöst mot ~10 ns brus, men << 1 s
): { offsetTicks: number; matchedPulses: number } {
  if (aliceGpsTicks.length === 0 || bobGpsTicks.length === 0) {
    throw new Error('GPS-kanalen är tom hos minst en part — kan inte klockjustera');
  }
  const baseline = bobGpsTicks[0] - aliceGpsTicks[0];
  const candidates = [-3, -2, -1, 0, 1, 2, 3].map((k) => baseline + k * TICKS_PER_SECOND);

  let bestCount = -1;
  let bestDeltas: number[] = [];

  for (const candidate of candidates) {
    const deltas: number[] = [];
    for (const a of aliceGpsTicks) {
      const target = a + candidate;
      // närmsta bob-tick (GPS-listorna är korta, ~100-300 element — linjär sökning räcker)
      let nearest = Infinity;
      let nearestB = NaN;
      for (const b of bobGpsTicks) {
        const d = Math.abs(b - target);
        if (d < nearest) {
          nearest = d;
          nearestB = b;
        }
      }
      if (nearest < toleranceTicks) deltas.push(nearestB - a);
    }
    if (deltas.length > bestCount) {
      bestCount = deltas.length;
      bestDeltas = deltas;
    }
  }

  const meanOffset = bestDeltas.reduce((s, d) => s + d, 0) / bestDeltas.length;
  return { offsetTicks: meanOffset, matchedPulses: bestCount };
}

export interface WindowSlice {
  syncTick: Float64Array;
  setting: Int8Array;
  clicked: Uint8Array;
  clickDelayTicks: Float32Array;
  startIdx: number;
  endIdx: number; // inklusive
}

/**
 * Fördröjningsgrind i tick relativt fönstrets sync. Ett fönster räknas som
 * "klick" endast om första klicket föll inom [loTicks, hiTicks]. Utan grind
 * räknas varje klick var som helst i hela sync-perioden (~10.09 µs) — vilket
 * dränker den inställningsberoende fysiken (Pockels-fönstret ~200 ns) i
 * inställningsOberoende bakgrund. Verifierat empiriskt: ogrindat är
 * koincidenserna nära identiska över alla fyra inställningspar.
 */
export interface DelayGate {
  loTicks: number;
  hiTicks: number;
}

export function sliceBurst(parsed: ParsedFile, burst: Burst): WindowSlice {
  return {
    syncTick: parsed.windowSyncTick,
    setting: parsed.windowSetting,
    clicked: parsed.windowClicked,
    clickDelayTicks: parsed.windowClickDelayTicks,
    startIdx: burst.startWindowIdx,
    endIdx: burst.endWindowIdx,
  };
}

export interface PairedTrialCounts {
  matchedTrials: number;
  unmatchedAliceWindows: number;
  // nyckel "settingA,settingB" (endast 0/1, -1-fönster utesluts som odefinierade)
  joint: Record<string, number>; // klick hos BÅDA
  aliceOnly: Record<string, number>; // klick hos alice, inte bob
  bobOnly: Record<string, number>; // klick hos bob, inte alice
  neither: Record<string, number>; // inget klick alls
}

/**
 * Parar alices och bobs trial-fönster via den GPS-härledda klockoffseten och
 * en närmaste-granne-sökning (binärsökning, eftersom bägges fönster redan är
 * tidsordnade). Toleransen (standard ±5000 tick ≈ 390 ns) är medvetet en
 * bråkdel av sync-kadensen (~10.09 µs) för att aldrig råka matcha mot
 * GRANNFÖNSTRET.
 */
export function pairTrials(
  alice: WindowSlice,
  bob: WindowSlice,
  offsetTicks: number,
  toleranceTicks = 5000,
  gateA?: DelayGate,
  gateB?: DelayGate,
): PairedTrialCounts {
  const inGate = (slice: WindowSlice, idx: number, gate?: DelayGate): boolean => {
    if (slice.clicked[idx] !== 1) return false;
    if (!gate) return true;
    const d = slice.clickDelayTicks[idx];
    return d >= gate.loTicks && d <= gate.hiTicks;
  };
  const joint: Record<string, number> = { '0,0': 0, '0,1': 0, '1,0': 0, '1,1': 0 };
  const aliceOnly: Record<string, number> = { '0,0': 0, '0,1': 0, '1,0': 0, '1,1': 0 };
  const bobOnly: Record<string, number> = { '0,0': 0, '0,1': 0, '1,0': 0, '1,1': 0 };
  const neither: Record<string, number> = { '0,0': 0, '0,1': 0, '1,0': 0, '1,1': 0 };

  let matchedTrials = 0;
  let unmatchedAliceWindows = 0;

  for (let i = alice.startIdx; i <= alice.endIdx; i++) {
    const settingA = alice.setting[i];
    if (settingA !== 0 && settingA !== 1) continue; // odefinierat RNG-utfall, kasseras
    const target = alice.syncTick[i] + offsetTicks;

    const j = nearestIndex(bob.syncTick, bob.startIdx, bob.endIdx, target);
    if (j < 0 || Math.abs(bob.syncTick[j] - target) > toleranceTicks) {
      unmatchedAliceWindows++;
      continue;
    }
    const settingB = bob.setting[j];
    if (settingB !== 0 && settingB !== 1) continue; // odefinierat hos bob, kasseras

    matchedTrials++;
    const key = `${settingA},${settingB}`;
    const clickedA = inGate(alice, i, gateA);
    const clickedB = inGate(bob, j, gateB);
    if (clickedA && clickedB) joint[key]++;
    else if (clickedA) aliceOnly[key]++;
    else if (clickedB) bobOnly[key]++;
    else neither[key]++;
  }

  return { matchedTrials, unmatchedAliceWindows, joint, aliceOnly, bobOnly, neither };
}

/**
 * Fördröjningshistogram över klickade fönster i en slice, plus automatiskt
 * grindval: hitta toppbinen och expandera åt båda håll så länge bininnehållet
 * ligger över `floorFraction` av toppen (sammanhängande). Ger den smala
 * Pockels-fönster-toppen utan att handväja gränser. Binbredd 128 tick = 10 ns.
 */
/**
 * Fördröjningshistogram uppdelat på EGEN inställning, okonditionerat på
 * motparten. GRANSKNINGSFYND (bindande): används för att skilja äkta
 * tvåfoton-koincidensstruktur från elektroniska artefakter i en enskild
 * parts detektorkedja. Verifierat mot "afterfixingModeLocking"-filen: en
 * ~44-61 % modulation i alices klick vid 300-600 ns EFTER sync kvarstår
 * HELT okonditionerat på om bob klickade (setting1 nästan dubblerar
 * alices klickfrekvens där) — detta kan alltså INTE vara en parkorrelation
 * (den skulle kräva att bob också klickade), utan är sannolikt elektrisk
 * inkoppling från Pockelscellens drivspänning in i tidmätningselektroniken,
 * exakt i det dokumenterade Pockels-på-fönstret. Motsvarar RF_pump_leak i
 * plattformens egen rödflaggsfamilj (jfr Signaturkandidat_J §5).
 */
export function singlesHistogramBySetting(
  slice: WindowSlice,
  binTicks = 128,
): { bins0: Int32Array; bins1: Int32Array; numBins: number; binTicks: number } {
  const maxDelay = 140_000;
  const numBins = Math.ceil(maxDelay / binTicks);
  const bins0 = new Int32Array(numBins);
  const bins1 = new Int32Array(numBins);
  for (let i = slice.startIdx; i <= slice.endIdx; i++) {
    if (slice.clicked[i] !== 1) continue;
    const setting = slice.setting[i];
    if (setting !== 0 && setting !== 1) continue;
    const d = slice.clickDelayTicks[i];
    if (d < 0 || d >= maxDelay) continue;
    (setting === 0 ? bins0 : bins1)[Math.floor(d / binTicks)]++;
  }
  return { bins0, bins1, numBins, binTicks };
}

/**
 * Hittar sammanhängande fördröjningsintervall där singlesfrekvensen
 * beror på EGEN inställning (relativ skillnad > `relThreshold`, båda
 * binnarna över `minCount` för att undvika brustriggring) — kandidater
 * för elektrisk kontamination (se singlesHistogramBySetting). Dessa
 * intervall bör UTESLUTAS från grindval, inte användas som "toppen".
 */
export function detectContaminatedRanges(
  hist: ReturnType<typeof singlesHistogramBySetting>,
  relThreshold = 0.15,
  minCount = 100,
): DelayGate[] {
  const flagged: boolean[] = new Array(hist.numBins).fill(false);
  for (let b = 0; b < hist.numBins; b++) {
    const c0 = hist.bins0[b];
    const c1 = hist.bins1[b];
    const mx = Math.max(c0, c1);
    const mn = Math.min(c0, c1);
    if (mx < minCount) continue;
    if ((mx - mn) / mx > relThreshold) flagged[b] = true;
  }
  const ranges: DelayGate[] = [];
  let start = -1;
  for (let b = 0; b <= hist.numBins; b++) {
    if (b < hist.numBins && flagged[b]) {
      if (start < 0) start = b;
    } else if (start >= 0) {
      ranges.push({ loTicks: start * hist.binTicks, hiTicks: b * hist.binTicks - 1 });
      start = -1;
    }
  }
  return ranges;
}

export function delayHistogramAndGate(
  slice: WindowSlice,
  binTicks = 128,
  excludeRanges: DelayGate[] = [],
): {
  bins: number[];
  binTicks: number;
  gate: DelayGate;
  peakBin: number;
  inGateFraction: number;
  backgroundPerBin: number;
} {
  const maxDelay = 140_000; // > sync-perioden ~129 k tick
  const numBins = Math.ceil(maxDelay / binTicks);
  const bins = new Array<number>(numBins).fill(0);
  let clickedCount = 0;
  for (let i = slice.startIdx; i <= slice.endIdx; i++) {
    if (slice.clicked[i] !== 1) continue;
    const d = slice.clickDelayTicks[i];
    if (d < 0 || d >= maxDelay) continue;
    bins[Math.floor(d / binTicks)]++;
    clickedCount++;
  }

  const excluded = new Array<boolean>(numBins).fill(false);
  for (const r of excludeRanges) {
    const loBin = Math.max(0, Math.floor(r.loTicks / binTicks));
    const hiBin = Math.min(numBins - 1, Math.floor(r.hiTicks / binTicks));
    for (let b = loBin; b <= hiBin; b++) excluded[b] = true;
  }

  let peakBin = 0;
  for (let b = 1; b < numBins; b++) if (!excluded[b] && bins[b] > bins[peakBin]) peakBin = b;

  // Grindval via SIGNIFIKANS ÖVER BAKGRUND, inte andel-av-topp: en part med
  // hög platt bakgrund (t.ex. mörkerräkning utspridd över hela sync-perioden)
  // har bakgrundsbinnar långt över någon fast %-av-toppen-golvnivå, och en
  // andel-baserad expansion sväljer då hela fönstret (verifierat: alices
  // första grindförsök behöll ~100 % av hennes klick). Bakgrunden skattas som
  // medianbininnehåll; grinden är de sammanhängande binnar kring toppen som
  // ligger > bakgrund + 5·√bakgrund (Poisson-5σ). Uteslutna binnar (känd
  // kontamination) stoppar expansionen precis som bakgrundsgolvet gör.
  const sorted = [...bins].sort((a, b) => a - b);
  const backgroundPerBin = sorted[Math.floor(sorted.length / 2)];
  const threshold = backgroundPerBin + 5 * Math.sqrt(backgroundPerBin + 1);
  let lo = peakBin;
  let hi = peakBin;
  while (lo > 0 && !excluded[lo - 1] && bins[lo - 1] > threshold) lo--;
  while (hi < numBins - 1 && !excluded[hi + 1] && bins[hi + 1] > threshold) hi++;
  const gate: DelayGate = { loTicks: lo * binTicks, hiTicks: (hi + 1) * binTicks - 1 };
  let inGate = 0;
  for (let b = lo; b <= hi; b++) inGate += bins[b];
  return {
    bins,
    binTicks,
    gate,
    peakBin,
    inGateFraction: clickedCount > 0 ? inGate / clickedCount : 0,
    backgroundPerBin,
  };
}

function nearestIndex(arr: Float64Array, lo: number, hi: number, target: number): number {
  if (lo > hi) return -1;
  let l = lo;
  let h = hi;
  while (l < h) {
    const mid = (l + h) >>> 1;
    if (arr[mid] < target) l = mid + 1;
    else h = mid;
  }
  // l är första index >= target inom [lo,hi]; jämför med föregångaren
  if (l > lo && Math.abs(arr[l - 1] - target) <= Math.abs(arr[l] - target)) return l - 1;
  return l;
}
