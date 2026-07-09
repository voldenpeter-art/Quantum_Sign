import { useMemo, useState } from 'react';
import type { SavedSession } from '../types/session';
import type { SignatureId } from '../types/signatures';
import { getSignatureMeta } from '../types/signatures';
import { evaluateCombinedEvidence, getHeadlinePValue, type CombinedPick } from '../analysis/combine';
import { fmtNum, fmtP, VERDICT_COLOR } from './format';

const COMBINED_LABEL: Record<string, string> = {
  insufficient: 'Otillräckligt val',
  none: 'Inget kombinerat bevis',
  'combined-suspect': 'Kombinerat: suspect',
  'combined-strong': 'Kombinerat: strong',
};

const COMBINED_COLOR: Record<string, string> = {
  insufficient: 'bg-neutral-800 text-neutral-400 border-neutral-700',
  none: 'bg-neutral-800 text-neutral-400 border-neutral-700',
  'combined-suspect': 'bg-amber-950 text-amber-300 border-amber-700',
  'combined-strong': 'bg-fuchsia-950 text-fuchsia-300 border-fuchsia-700',
};

export function CombineSignaturesPanel({ sessions }: { sessions: SavedSession[] }) {
  // sessionId -> vald signatur i den sessionen (högst en, se arvsregeln)
  const [selection, setSelection] = useState<Record<string, SignatureId | undefined>>({});

  const toggle = (sessionId: string, signatureId: SignatureId) => {
    setSelection((prev) => ({
      ...prev,
      [sessionId]: prev[sessionId] === signatureId ? undefined : signatureId,
    }));
  };

  const picks: CombinedPick[] = useMemo(() => {
    const out: CombinedPick[] = [];
    for (const session of sessions) {
      const sigId = selection[session.id];
      if (!sigId) continue;
      const result = session.results[sigId];
      if (!result) continue;
      out.push({ sessionId: session.id, sessionLabel: session.label, signatureId: sigId, result });
    }
    return out;
  }, [sessions, selection]);

  const evidence = useMemo(() => evaluateCombinedEvidence(picks), [picks]);

  if (sessions.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-sm text-neutral-500">
        Inga sparade sessioner än. Gå till fliken "Körning", ställ in en konfiguration och klicka{' '}
        <span className="text-neutral-300">"Spara som session"</span> — spara sedan minst en till session (gärna med
        en annan källa/seed) för att kunna testa om signaturerna kompletterar varandra.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 text-sm text-neutral-400">
        <p>
          Arvsregeln (CLAUDE.md §4.1, B-rapporten §12): signaturer som delar rådata räknas aldrig som oberoende
          bekräftelse av varandra. Här kan du därför välja <strong className="text-neutral-200">högst en signatur per session</strong> —
          kombinationen blir bara meningsfull över{' '}
          <strong className="text-neutral-200">genuint separata mätkampanjer</strong> (olika sessioner, gärna olika
          källa/seed/förhållanden). p-värdena kombineras med Fisher's metod, precis som H-mönstrets
          "metakombination" (syntesrapporten §7, punkt 10).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {sessions.map((session) => (
          <div key={session.id} className="space-y-2 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <div className="text-sm font-medium text-neutral-200">{session.label}</div>
            <div className="text-xs text-neutral-500">
              källa: {session.config.source} · seed {session.config.seed} · {session.config.duration}s
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {Object.entries(session.results).map(([id, result]) => {
                if (!result) return null;
                const sigId = id as SignatureId;
                const active = selection[session.id] === sigId;
                const p = getHeadlinePValue(result);
                return (
                  <button
                    key={id}
                    onClick={() => toggle(session.id, sigId)}
                    className={`rounded-md border px-2 py-1 text-xs font-mono transition ${
                      active
                        ? 'border-fuchsia-600 bg-fuchsia-950 text-fuchsia-200'
                        : `${VERDICT_COLOR[result.verdict]} hover:opacity-80`
                    }`}
                    title={getSignatureMeta(sigId).nameSv}
                  >
                    {id} · {fmtP(p)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-200">Kombinerad evidens</h3>
          <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${COMBINED_COLOR[evidence.verdict]}`}>
            {COMBINED_LABEL[evidence.verdict]}
          </span>
        </div>

        {picks.length > 0 && (
          <table className="w-full text-xs">
            <thead>
              <tr className="text-neutral-500">
                <th className="pb-1 text-left">Session</th>
                <th className="pb-1 text-left">Signatur</th>
                <th className="pb-1 text-left">Verdict</th>
                <th className="pb-1 text-right">p</th>
              </tr>
            </thead>
            <tbody>
              {picks.map((p) => (
                <tr key={p.sessionId} className="border-t border-neutral-800/60">
                  <td className="py-1">{p.sessionLabel}</td>
                  <td className="py-1 font-mono">{p.signatureId}</td>
                  <td className="py-1">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] ${VERDICT_COLOR[p.result.verdict]}`}>
                      {p.result.verdict}
                    </span>
                  </td>
                  <td className="py-1 text-right font-mono text-neutral-400">{fmtP(getHeadlinePValue(p.result))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {evidence.fisherP !== null && (
          <div className="flex gap-6 font-mono text-xs text-neutral-300">
            <span>Fisher-p = {fmtNum(evidence.fisherP, 4)}</span>
            <span>min p = {fmtNum(evidence.minP ?? NaN, 4)}</span>
          </div>
        )}

        <p className="text-xs text-neutral-500">{evidence.reasonSv}</p>
      </div>
    </div>
  );
}
