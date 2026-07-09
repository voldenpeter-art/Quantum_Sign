// S1 — permutation. Två varianter beroende på signaturtyp (se B-rapporten §8
// resp. A-rapporten §7): för polarisationsdata blandas UTFALLET inom
// (arm, bas, setting) — tider/rates orörda. För enkanalsdata (A) finns inget
// utfall att blanda; där permuteras istället ORDNINGEN på mellanhändelsetider,
// vilket bevarar hela den marginella takt-/gap-fördelningen men bryter varje
// specifik temporal korrelation (bunching/antibunching).

import type { EventStream, PhotonEvent } from '../types/events';
import type { Rng } from '../sim/rng';

function shuffle<T>(arr: T[], rng: Rng): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rng.uniformInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Blandar `pol` inom (arm, basis, setting)-grupper. Används av B/C/D/E/F. */
export function shufflePolS1(stream: EventStream, rng: Rng): EventStream {
  const groups = new Map<string, PhotonEvent[]>();
  for (const e of stream.events) {
    const key = `${e.arm ?? ''}|${e.basis ?? ''}|${e.setting ?? ''}`;
    const g = groups.get(key) ?? [];
    g.push(e);
    groups.set(key, g);
  }

  const shuffledPolByGroup = new Map<string, PhotonEvent['pol'][]>();
  for (const [key, g] of groups) {
    shuffledPolByGroup.set(
      key,
      shuffle(g.map((e) => e.pol), rng),
    );
  }

  const cursor = new Map<string, number>();
  const events = stream.events.map((e) => {
    const key = `${e.arm ?? ''}|${e.basis ?? ''}|${e.setting ?? ''}`;
    const i = cursor.get(key) ?? 0;
    cursor.set(key, i + 1);
    return { ...e, pol: shuffledPolByGroup.get(key)![i] };
  });

  return { ...stream, events };
}

/** Permuterar ordningen på mellanhändelsetider per HBT-kanal. Används av A. */
export function shuffleGapsS1(stream: EventStream, rng: Rng): EventStream {
  const byChannel = new Map<string, PhotonEvent[]>();
  for (const e of stream.events) {
    const key = e.channel;
    const g = byChannel.get(key) ?? [];
    g.push(e);
    byChannel.set(key, g);
  }

  const result: PhotonEvent[] = [];
  for (const [, g] of byChannel) {
    const sorted = [...g].sort((a, b) => a.detectedT - b.detectedT);
    const gaps: number[] = [];
    let prev = 0;
    for (const e of sorted) {
      gaps.push(e.detectedT - prev);
      prev = e.detectedT;
    }
    const shuffledGaps = shuffle(gaps, rng);
    let t = 0;
    for (let i = 0; i < sorted.length; i++) {
      t += shuffledGaps[i];
      result.push({ ...sorted[i], detectedT: t, t });
    }
  }

  return { ...stream, events: result.sort((a, b) => a.detectedT - b.detectedT) };
}
