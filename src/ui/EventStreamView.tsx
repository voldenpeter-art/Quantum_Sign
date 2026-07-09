import { useMemo } from 'react';
import type { EventStream } from '../types/events';

const WIDTH = 900;
const ROW_HEIGHT = 28;
const MAX_RENDER = 6000;

const LANE_COLOR: Record<string, string> = {
  D1: '#22d3ee',
  D2: '#a78bfa',
  A: '#f472b6',
  B: '#34d399',
};

export function EventStreamView({ stream }: { stream: EventStream }) {
  const hasArms = useMemo(() => stream.events.some((e) => e.arm), [stream]);
  const lanes: string[] = hasArms ? ['A', 'B'] : ['D1', 'D2'];

  const events = stream.events.length > MAX_RENDER ? sampleEvery(stream.events, MAX_RENDER) : stream.events;

  const height = lanes.length * ROW_HEIGHT + 24;

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <div className="mb-2 flex items-center justify-between text-xs text-neutral-400">
        <span>
          {stream.events.length.toLocaleString('sv-SE')} händelser över {stream.duration}s
          {stream.events.length > MAX_RENDER ? ` (visar ${MAX_RENDER.toLocaleString('sv-SE')})` : ''}
        </span>
        <span className="flex gap-3">
          {lanes.map((l) => (
            <span key={l} className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: LANE_COLOR[l] }} />
              {l}
            </span>
          ))}
        </span>
      </div>
      <svg width="100%" viewBox={`0 0 ${WIDTH} ${height}`} className="block">
        {lanes.map((lane, i) => (
          <line
            key={lane}
            x1={0}
            x2={WIDTH}
            y1={i * ROW_HEIGHT + ROW_HEIGHT / 2}
            y2={i * ROW_HEIGHT + ROW_HEIGHT / 2}
            stroke="#27272a"
          />
        ))}
        {events.map((e) => {
          const laneValue = hasArms ? e.arm : e.channel;
          const laneIdx = laneValue ? lanes.indexOf(laneValue) : -1;
          if (laneIdx < 0) return null;
          const x = (e.detectedT / stream.duration) * WIDTH;
          const y = laneIdx * ROW_HEIGHT + ROW_HEIGHT / 2;
          const flagged = e.flags.length > 0;
          return (
            <circle
              key={e.id}
              cx={x}
              cy={y}
              r={e.isBackground ? 1.3 : 1.8}
              fill={e.isBackground ? '#52525b' : flagged ? '#f59e0b' : LANE_COLOR[laneValue as string]}
              opacity={e.isBackground ? 0.5 : 0.85}
            />
          );
        })}
      </svg>
    </div>
  );
}

function sampleEvery<T>(arr: T[], target: number): T[] {
  const step = Math.ceil(arr.length / target);
  return arr.filter((_, i) => i % step === 0);
}
