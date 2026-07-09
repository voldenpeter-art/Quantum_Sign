// S2 — tidsförskjutning. Oberoende slumpoffset PER DETEKTORKANAL (B-rapporten
// §8.1: gemensam offset för alla kanaler är en känd bugg som gör surrogatet
// verkningslöst eftersom parvisa tidsskillnader bevaras). Offset ≫ τ_max,
// cirkulär wrap inom run — bevarar varje kanals internstatistik men förstör
// äkta koincidenser mellan kanaler.

import type { EventStream } from '../types/events';
import type { Rng } from '../sim/rng';
import { detectorKeyOf } from '../sim/detector';

export function timeSlideS2(stream: EventStream, rng: Rng): EventStream {
  const { duration } = stream;
  const offsets = new Map<string, number>();

  const events = stream.events.map((e) => {
    const key = detectorKeyOf(e);
    let offset = offsets.get(key);
    if (offset === undefined) {
      offset = rng.next() * duration;
      offsets.set(key, offset);
    }
    const t = (e.detectedT + offset) % duration;
    return { ...e, detectedT: t };
  });

  return { ...stream, events: events.sort((a, b) => a.detectedT - b.detectedT) };
}
