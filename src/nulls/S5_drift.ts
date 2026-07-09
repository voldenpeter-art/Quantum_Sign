// S5 — driftsurrogat. En klassisk baslinje (samma källsubstitution som S4,
// men UTAN den extra artefakt-trimningen) vars underliggande parameter
// (visibility för entangled, takt annars) tillåts driva långsamt som en
// Ornstein–Uhlenbeck-process över observationsfönstret. Testar om E:s/D:s
// "stabila struktur" bara är otillräckligt modellerad långsam drift
// (E-rapporten §9, D-rapporten §9.4/§12) snarare än äkta invarians/kod.

import type { EventStream, PhotonEvent } from '../types/events';
import type { RunConfig } from '../types/config';
import type { Rng } from '../sim/rng';
import { generateEventStream } from '../sim';

const CLASSICAL_CHSH_BOUND_DECOHERENCE = 1 - 1 / Math.SQRT2;

function ouTrajectory(rng: Rng, n: number, meanReversion = 0.35, noiseStd = 0.12): number[] {
  const theta: number[] = [];
  let x = 0;
  for (let k = 0; k < n; k++) {
    x = x + meanReversion * (0 - x) + rng.gaussian(0, noiseStd);
    theta.push(x);
  }
  return theta;
}

export function generateS5(config: RunConfig, rng: Rng, numSegments = 10): EventStream {
  const segDuration = config.duration / numSegments;
  const theta = ouTrajectory(rng, numSegments);

  const baseSource = config.source === 'memoryEcho' ? 'coherent' : config.source;
  const segments: PhotonEvent[] = [];
  let idOffset = 0;

  for (let k = 0; k < numSegments; k++) {
    const segConfig: RunConfig = { ...config, source: baseSource, duration: segDuration };
    const segRng = rng.fork();

    const stream =
      baseSource === 'entangled'
        ? generateEventStream(segConfig, segRng, {
            decoherence: Math.min(0.95, Math.max(0, CLASSICAL_CHSH_BOUND_DECOHERENCE + theta[k] * 0.1)),
          })
        : generateEventStream(segConfig, segRng);

    for (const e of stream.events) {
      const t = e.detectedT + k * segDuration;
      segments.push({ ...e, id: idOffset + e.id, t, detectedT: t });
    }
    idOffset += stream.events.length + 1;
  }

  return {
    events: segments.sort((a, b) => a.detectedT - b.detectedT),
    duration: config.duration,
    seed: config.seed,
    sourceRate: config.sourceRateHz,
  };
}
