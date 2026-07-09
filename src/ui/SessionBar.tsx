import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { RunConfig } from '../types/config';
import type { SignatureId } from '../types/signatures';
import type { SignatureResult } from '../analysis/types';
import type { SavedSession } from '../types/session';

interface SessionBarProps {
  config: RunConfig;
  results: Partial<Record<SignatureId, SignatureResult>>;
  loading: boolean;
  sessions: SavedSession[];
  setSessions: Dispatch<SetStateAction<SavedSession[]>>;
}

export function SessionBar({ config, results, loading, sessions, setSessions }: SessionBarProps) {
  const [label, setLabel] = useState('');

  const save = () => {
    const defaultLabel = `Session ${sessions.length + 1} · ${config.source} · seed ${config.seed}`;
    const session: SavedSession = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      label: label.trim() || defaultLabel,
      createdAt: new Date().toISOString(),
      config,
      results,
    };
    setSessions((prev) => [...prev, session]);
    setLabel('');
  };

  const remove = (id: string) => setSessions((prev) => prev.filter((s) => s.id !== id));

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder={`Session ${sessions.length + 1} · ${config.source} · seed ${config.seed}`}
          className="min-w-[220px] flex-1 rounded-md border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-sm text-neutral-100 placeholder:text-neutral-600"
        />
        <button
          onClick={save}
          disabled={loading}
          className="rounded-md border border-emerald-700 bg-emerald-950/50 px-3 py-1.5 text-sm font-medium text-emerald-200 hover:bg-emerald-900/50 disabled:opacity-50"
        >
          Spara som session
        </button>
        <span className="text-xs text-neutral-500">
          Sparade sessioner kan kombineras under fliken "Kombinera signaturer" — varje session räknas som en
          oberoende mätkampanj.
        </span>
      </div>

      {sessions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {sessions.map((s) => (
            <span
              key={s.id}
              className="flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1 text-xs text-neutral-300"
            >
              {s.label}
              <button onClick={() => remove(s.id)} className="text-neutral-500 hover:text-red-400" aria-label="Ta bort session">
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
