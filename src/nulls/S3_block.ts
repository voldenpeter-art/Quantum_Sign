// S3 — blockpermutation. Tidsaxeln delas i block av bredd blockWidthS per
// detektorkanal; blockens INBÖRDES ORDNING permuteras men innehållet inom
// varje block (och därmed korttidsstruktur/klustring) bevaras. Bryter global
// struktur (t.ex. långsam drift eller minneseffekter över block-skalan).

import type { EventStream, PhotonEvent } from '../types/events';
import type { Rng } from '../sim/rng';
import { detectorKeyOf } from '../sim/detector';

function shuffle<T>(arr: T[], rng: Rng): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rng.uniformInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function blockBootstrapS3(
  stream: EventStream,
  rng: Rng,
  blockWidthS = 1,
): EventStream {
  const { duration } = stream;
  const numBlocks = Math.max(1, Math.ceil(duration / blockWidthS));

  const byKey = new Map<string, PhotonEvent[]>();
  for (const e of stream.events) {
    const key = detectorKeyOf(e);
    const g = byKey.get(key) ?? [];
    g.push(e);
    byKey.set(key, g);
  }

  const result: PhotonEvent[] = [];
  for (const [, g] of byKey) {
    const blockOrder = shuffle(
      Array.from({ length: numBlocks }, (_, i) => i),
      rng,
    );
    for (const e of g) {
      const originalBlock = Math.min(numBlocks - 1, Math.floor(e.detectedT / blockWidthS));
      const withinBlockOffset = e.detectedT - originalBlock * blockWidthS;
      const newBlock = blockOrder[originalBlock];
      const newT = newBlock * blockWidthS + withinBlockOffset;
      if (newT < duration) {
        result.push({ ...e, detectedT: newT });
      }
    }
  }

  return { ...stream, events: result.sort((a, b) => a.detectedT - b.detectedT) };
}
