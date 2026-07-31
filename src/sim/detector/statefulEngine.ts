// TILLSTÅNDSBASERAD DETEKTORMOTOR (P3, granskningens P0-fynd).
//
// Den äldre pipelinen är en kedja av oberoende array-transformationer där
// dödtiden appliceras FÖRE afterpulse/mörkerräkning/crosstalk. Följden är att
// varje lavin som genereras EFTER dödtidssteget slipper förbi återhämtnings-
// logiken: en mörkerräkning kan landa mitt i en pågående dödtid, och en
// afterpuls kan ligga godtyckligt nära sitt moderklick. Det ger felaktiga
// g²-kurvor och konstgjorda koincidenser (regressionsvakten i detector.test.ts
// dokumenterar beteendet).
//
// Den här motorn ersätter kedjan med EN händelsedriven tillståndsmaskin per
// detektor. ALLA laviner — signalfotoner, mörkerräkningar, afterpulser och
// crosstalk — är kandidater i samma tidsordnade kö och passerar SAMMA
// återhämtningsgrind. Accepterade laviner kan i sin tur föda nya kandidater
// (afterpuls på samma detektor, crosstalk på granndetektorn), som också måste
// passera grinden.
//
// BINDANDE INVARIANT: två ACCEPTERADE laviner på samma detektor ligger aldrig
// närmare varandra än den konfigurerade återhämtningstiden. Verifierat i
// statefulEngine.test.ts.
//
// Dödtidsmodell (flagga `deadTimeParalyzable`):
//   icke-paralyserbar (default) — en kandidat under dödtid förloras utan att
//     förlänga dödtiden.
//   paralyserbar — en kandidat under dödtid förloras MEN retriggar detektorn,
//     så dödtiden förlängs från kandidatens tidpunkt (SPAD-beteende vid hög
//     belastning).

import type { PhotonEvent, QualityFlag } from '../../types/events';
import type { DetectorParams } from '../../types/config';
import type { Rng } from '../rng';
import { detectorKeyOf, pairedDetectorKey } from './keys';

interface Candidate {
  t: number;
  detectorKey: string;
  seq: number;
  /** Mall för det event som ska emitteras om kandidaten accepteras. */
  template: PhotonEvent;
}

/** Binär min-heap på (t, seq). seq gör ordningen total ⇒ deterministisk. */
class CandidateQueue {
  private heap: Candidate[] = [];

  get size(): number {
    return this.heap.length;
  }

  private static before(a: Candidate, b: Candidate): boolean {
    return a.t !== b.t ? a.t < b.t : a.seq < b.seq;
  }

  push(c: Candidate): void {
    const h = this.heap;
    h.push(c);
    let i = h.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (!CandidateQueue.before(h[i], h[parent])) break;
      [h[i], h[parent]] = [h[parent], h[i]];
      i = parent;
    }
  }

  pop(): Candidate | undefined {
    const h = this.heap;
    if (h.length === 0) return undefined;
    const top = h[0];
    const last = h.pop()!;
    if (h.length > 0) {
      h[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let best = i;
        if (l < h.length && CandidateQueue.before(h[l], h[best])) best = l;
        if (r < h.length && CandidateQueue.before(h[r], h[best])) best = r;
        if (best === i) break;
        [h[i], h[best]] = [h[best], h[i]];
        i = best;
      }
    }
    return top;
  }
}

function channelFor(key: string, fallback: PhotonEvent['channel']): PhotonEvent['channel'] {
  return key === 'D1' || key === 'D2' ? key : fallback;
}
function armFor(key: string, fallback: PhotonEvent['arm']): PhotonEvent['arm'] {
  return key === 'A' || key === 'B' ? key : fallback;
}

/**
 * Kör den tillståndsbaserade motorn. `events` ska redan ha passerat loss,
 * kanaltilldelning och jitter (fysiskt före lavinen); motorn äger dödtid,
 * mörkerräkningar, afterpulsing och crosstalk.
 */
export function runStatefulDetector(
  events: PhotonEvent[],
  detectorKeys: string[],
  duration: number,
  params: DetectorParams,
  backgroundRateHz: number,
  rng: Rng,
): PhotonEvent[] {
  const deadTimeS = Math.max(0, params.deadTimeNs) * 1e-9;
  const afterpulseTauS = Math.max(params.afterpulseTauNs, 1e-6) * 1e-9;
  const paralyzable = params.deadTimeParalyzable === true;

  const queue = new CandidateQueue();
  let seq = 0;
  let nextId = events.reduce((m, e) => Math.max(m, e.id), 0) + 1;

  const enqueue = (t: number, detectorKey: string, template: PhotonEvent) => {
    queue.push({ t, detectorKey, seq: seq++, template });
  };

  // 1. Signalfotoner (redan loss/kanal/jitter-behandlade).
  for (const e of events) enqueue(e.detectedT, detectorKeyOf(e), e);

  // 2. Mörkerräkningar: en Poissonprocess per detektor, som KANDIDATER — de
  //    måste passera samma dödtidsgrind som allt annat (till skillnad från den
  //    äldre kedjan, där de lades på efteråt).
  if (backgroundRateHz > 0) {
    for (const key of detectorKeys) {
      let t = 0;
      for (;;) {
        t += rng.exponential(backgroundRateHz);
        if (t >= duration) break;
        enqueue(t, key, {
          id: -1, // tilldelas vid acceptans
          t,
          detectedT: t,
          channel: channelFor(key, 'D1'),
          arm: armFor(key, undefined),
          isBackground: true,
          flags: ['background'],
        });
      }
    }
  }

  const readyAt = new Map<string, number>();
  const accepted: PhotonEvent[] = [];

  while (queue.size > 0) {
    const cand = queue.pop()!;
    if (cand.t < 0 || cand.t >= duration) continue;

    const ready = readyAt.get(cand.detectorKey) ?? -Infinity;
    if (deadTimeS > 0 && cand.t < ready) {
      // Vetoad av pågående dödtid. Paralyserbar detektor retriggas ändå.
      if (paralyzable) readyAt.set(cand.detectorKey, cand.t + deadTimeS);
      continue;
    }

    // Accepterad lavin.
    readyAt.set(cand.detectorKey, cand.t + deadTimeS);
    const event: PhotonEvent = {
      ...cand.template,
      id: nextId++,
      detectedT: cand.t,
      channel: channelFor(cand.detectorKey, cand.template.channel),
      arm: armFor(cand.detectorKey, cand.template.arm),
    };
    accepted.push(event);

    // Sekundära laviner från DENNA accepterade lavin — själva kandidater.
    if (params.afterpulseProb > 0 && rng.bool(params.afterpulseProb)) {
      const t = cand.t + rng.exponential(1 / afterpulseTauS);
      if (t < duration) {
        enqueue(t, cand.detectorKey, {
          ...event,
          isBackground: false,
          flags: [...event.flags, 'afterpulse' as QualityFlag],
        });
      }
    }
    if (params.crosstalkProb > 0 && !event.isBackground && rng.bool(params.crosstalkProb)) {
      const pairedKey = pairedDetectorKey(cand.detectorKey);
      const t = cand.t + rng.gaussian(0, 200e-12);
      if (t >= 0 && t < duration) {
        enqueue(t, pairedKey, {
          ...event,
          isBackground: false,
          flags: [...event.flags, 'crosstalk' as QualityFlag],
        });
      }
    }
  }

  return accepted.sort((a, b) => a.detectedT - b.detectedT);
}
