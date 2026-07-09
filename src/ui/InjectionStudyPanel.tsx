import { useState } from 'react';
import type { RunConfig } from '../types/config';
import type { SignatureId } from '../types/signatures';
import { IMPLEMENTED_SIGNATURES, getSignatureMeta } from '../types/signatures';
import { runInjectionSweep, type InjectionRunResult } from '../validation';
import { Rng } from '../sim/rng';
import { fmtP, VERDICT_COLOR } from './format';

const STRENGTHS = [0, 0.25, 0.5, 0.75, 1];

export function InjectionStudyPanel({
  config,
  nullReplicates,
}: {
  config: RunConfig;
  nullReplicates: number;
}) {
  const [signatureId, setSignatureId] = useState<SignatureId>('A');
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<InjectionRunResult[] | null>(null);

  const run = () => {
    setRunning(true);
    setResults(null);
    setTimeout(() => {
      const rng = new Rng(Math.floor(Math.random() * 1e9) + 1);
      // Signaturen kräver en viss källtyp (t.ex. A ⇒ singleEmitter, C ⇒ entangled) —
      // körningens aktuella källval på "Körning"-fliken kan vara en annan, så vi
      // tvingar rätt källa för just den signatur som testas blint.
      const requiredSource = getSignatureMeta(signatureId).requiredSources[0] ?? config.source;
      const effectiveConfig = { ...config, source: requiredSource };
      const sweep = runInjectionSweep(signatureId, effectiveConfig, STRENGTHS, rng, nullReplicates);
      setResults(sweep);
      setRunning(false);
    }, 20);
  };

  return (
    <div className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <div>
        <h3 className="text-sm font-semibold text-neutral-200">Blind injection-studie</h3>
        <p className="mt-1 text-xs text-neutral-500">
          Blandar en klassisk baslinje med känd styrka av signalen (0 → ren klassisk, 1 → fullt konfigurerad källa)
          och kör hela analyspipelinen blint. Facit (sann styrka) visas efter körning — pipelinen ser den aldrig
          innan.
        </p>
      </div>

      <div className="flex items-end gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-neutral-300">Signatur att testa</span>
          <select
            className="rounded-md border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-neutral-100"
            value={signatureId}
            onChange={(e) => setSignatureId(e.target.value as SignatureId)}
          >
            {IMPLEMENTED_SIGNATURES.map((id) => (
              <option key={id} value={id}>
                {id} · {getSignatureMeta(id).nameSv}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={run}
          disabled={running}
          className="rounded-md border border-fuchsia-700 bg-fuchsia-950/50 px-4 py-1.5 text-sm font-medium text-fuchsia-200 hover:bg-fuchsia-900/50 disabled:opacity-50"
        >
          {running ? 'Kör…' : 'Kör blindstudie'}
        </button>
      </div>

      {results && (
        <table className="w-full text-xs">
          <thead>
            <tr className="text-neutral-500">
              <th className="pb-1 text-left">Sann styrka</th>
              <th className="pb-1 text-left">Detekterad verdict</th>
              <th className="pb-1 text-left">Träff?</th>
              <th className="pb-1 text-right">p (huvudstatistika)</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.trueStrength} className="border-t border-neutral-800/60">
                <td className="py-1 font-mono">{r.trueStrength.toFixed(2)}</td>
                <td className="py-1">
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] ${VERDICT_COLOR[r.detectedVerdict]}`}>
                    {r.detectedVerdict}
                  </span>
                </td>
                <td className="py-1">{r.detected ? '✓' : '—'}</td>
                <td className="py-1 text-right font-mono text-neutral-400">{fmtP(r.headlinePValue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
