import type { SignatureMeta } from '../types/signatures';
import type { SignatureResult } from '../analysis/types';
import { evaluateMetagate } from '../validation/metagate';
import { fmtNum, fmtP, VERDICT_COLOR, VERDICT_DOT } from './format';

export function SignatureCard({
  meta,
  result,
  loading,
}: {
  meta: SignatureMeta;
  result?: SignatureResult;
  loading?: boolean;
}) {
  if (!meta.implemented) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-dashed border-neutral-800 bg-neutral-950 p-4 opacity-60">
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm font-semibold text-neutral-400">{meta.id} · {meta.nameSv}</span>
          <span className="rounded border border-neutral-700 px-2 py-0.5 text-[10px] uppercase tracking-wide text-neutral-500">
            Ej implementerad
          </span>
        </div>
        <p className="text-xs text-neutral-500">{meta.summarySv}</p>
      </div>
    );
  }

  const metagate = result ? evaluateMetagate(result) : undefined;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm font-semibold text-neutral-100">
          {meta.id} · {meta.nameSv}
        </span>
        {result && (
          <span
            className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${VERDICT_COLOR[result.verdict]}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${VERDICT_DOT[result.verdict]}`} />
            {result.verdictLabelSv}
          </span>
        )}
      </div>

      {loading && <div className="text-xs text-neutral-500">Beräknar surrogat…</div>}

      {result && !loading && (
        <>
          <p className="text-xs text-neutral-400">{result.summarySv}</p>
          <table className="w-full text-xs">
            <tbody>
              {result.components.map((c) => (
                <tr key={c.key} className="border-t border-neutral-800/60">
                  <td className="py-1 pr-2 text-neutral-400">{c.labelSv}</td>
                  <td className="py-1 pr-2 text-right font-mono text-neutral-100">
                    {fmtNum(c.value)}
                    {c.unit ?? ''}
                  </td>
                  <td className="py-1 text-right font-mono text-neutral-500">{fmtP(c.pValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {result.redFlags.some((f) => f.triggered) && (
            <div className="space-y-1 rounded-md border border-amber-900/50 bg-amber-950/30 p-2 text-[11px] text-amber-300">
              {result.redFlags
                .filter((f) => f.triggered)
                .map((f) => (
                  <div key={f.code}>
                    <span className="font-semibold">{f.labelSv}.</span> {f.detailSv}
                  </div>
                ))}
            </div>
          )}

          <div className="text-[11px] text-neutral-500">Golv: {result.floorNoteSv}</div>

          {metagate && (
            <div
              className={`rounded-md border px-2 py-1 text-[11px] ${
                metagate.passes ? 'border-emerald-800 bg-emerald-950/40 text-emerald-300' : 'border-neutral-700 bg-neutral-950 text-neutral-400'
              }`}
            >
              Metagate (lätt, v1): {metagate.passes ? 'passerar' : 'passerar ej'} — {metagate.reasonSv}
            </div>
          )}
        </>
      )}
    </div>
  );
}
