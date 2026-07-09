import { useMemo } from 'react';
import type { SignatureId } from '../types/signatures';
import type { SignatureResult } from '../analysis/types';
import { fmtNum } from './format';

const WIDTH = 640;
const HEIGHT = 220;
const MARGIN = 32;

function histogram(values: number[], bins: number): { x0: number; x1: number; count: number }[] {
  if (values.length === 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const width = span / bins;
  const counts = new Array(bins).fill(0);
  for (const v of values) {
    const idx = Math.min(bins - 1, Math.floor((v - min) / width));
    counts[idx]++;
  }
  return counts.map((count, i) => ({ x0: min + i * width, x1: min + (i + 1) * width, count }));
}

export function NullDistributionPanel({
  selected,
  results,
}: {
  selected: SignatureId | null;
  results: Partial<Record<SignatureId, SignatureResult>>;
}) {
  const result = selected ? results[selected] : undefined;
  const primaryNull = result?.primaryNull;

  const bins = useMemo(() => (primaryNull ? histogram(primaryNull.nullValues, 24) : []), [primaryNull]);

  if (!result || !primaryNull) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-sm text-neutral-500">
        Välj en implementerad signatur för att se dess surrogat-/nollfördelning.
      </div>
    );
  }

  const allValues = [...primaryNull.nullValues, primaryNull.observed];
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const span = max - min || 1;
  const maxCount = Math.max(...bins.map((b) => b.count), 1);

  const xScale = (v: number) => MARGIN + ((v - min) / span) * (WIDTH - 2 * MARGIN);
  const barW = bins.length ? (WIDTH - 2 * MARGIN) / bins.length : 0;

  return (
    <div className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-neutral-200">
          {result.id} — {primaryNull.labelSv}
        </h3>
        <span className="font-mono text-xs text-neutral-400">
          observerat = {fmtNum(primaryNull.observed)} · n_null = {primaryNull.nullValues.length}
        </span>
      </div>
      <svg width="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        <line x1={MARGIN} x2={WIDTH - MARGIN} y1={HEIGHT - MARGIN} y2={HEIGHT - MARGIN} stroke="#3f3f46" />
        {bins.map((b, i) => {
          const h = (b.count / maxCount) * (HEIGHT - 2 * MARGIN);
          return (
            <rect
              key={i}
              x={xScale(b.x0)}
              y={HEIGHT - MARGIN - h}
              width={Math.max(1, barW - 1)}
              height={h}
              fill="#52525b"
            />
          );
        })}
        <line
          x1={xScale(primaryNull.observed)}
          x2={xScale(primaryNull.observed)}
          y1={MARGIN / 2}
          y2={HEIGHT - MARGIN}
          stroke="#e879f9"
          strokeWidth={2}
        />
        <text x={xScale(primaryNull.observed)} y={MARGIN / 2 - 4} fill="#e879f9" fontSize={11} textAnchor="middle">
          observerat
        </text>
      </svg>
      <p className="text-xs text-neutral-500">
        Grå staplar = surrogatfördelningen (S1–S4/S5, blandad enligt signaturens giltiga nulls). Rosa linje = det
        observerade värdet i den riktiga (degraderade) strömmen.
      </p>
    </div>
  );
}
