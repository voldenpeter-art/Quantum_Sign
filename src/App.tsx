import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_CONFIG } from './types/config';
import type { SignatureId } from './types/signatures';
import { IMPLEMENTED_SIGNATURES } from './types/signatures';
import { generateEventStream } from './sim';
import { Rng } from './sim/rng';
import { ANALYSIS_REGISTRY, type AnalysisContext, type SignatureResult } from './analysis/registry';
import { ControlPanel } from './ui/ControlPanel';
import { EventStreamView } from './ui/EventStreamView';
import { SignatureDashboard } from './ui/SignatureDashboard';
import { NullDistributionPanel } from './ui/NullDistributionPanel';
import { InjectionStudyPanel } from './ui/InjectionStudyPanel';
import { ExportPanel } from './ui/ExportPanel';
import type { ExportBundle } from './export';

type Tab = 'run' | 'nulls' | 'injection';

export default function App() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [nullReplicates, setNullReplicates] = useState(15);
  const [tab, setTab] = useState<Tab>('run');
  const [selectedSignature, setSelectedSignature] = useState<SignatureId>('A');
  const [results, setResults] = useState<Partial<Record<SignatureId, SignatureResult>>>({});
  const [loading, setLoading] = useState(false);

  const stream = useMemo(() => generateEventStream(config), [config]);

  useEffect(() => {
    setLoading(true);
    const handle = setTimeout(() => {
      const rng = new Rng(config.seed + 1);
      const next: Partial<Record<SignatureId, SignatureResult>> = {};
      for (const id of IMPLEMENTED_SIGNATURES) {
        const analyzer = ANALYSIS_REGISTRY[id];
        if (!analyzer) continue;
        const ctx: AnalysisContext = { stream, config, rng: rng.fork(), nullReplicates };
        next[id] = analyzer(ctx);
      }
      setResults(next);
      setLoading(false);
    }, 30);
    return () => clearTimeout(handle);
  }, [stream, config, nullReplicates]);

  const bundle: ExportBundle = {
    generatedAt: new Date().toISOString(),
    config,
    nullReplicates,
    results,
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <header className="flex flex-col gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">Kvantsignaturplattform</h1>
            <p className="mt-1 text-sm text-neutral-400">
              Interaktiv simulering och signaturanalys — källa → detektor → analys → surrogat → verdict.
            </p>
          </div>
          <ExportPanel bundle={bundle} />
        </header>

        <nav className="flex gap-2">
          {(
            [
              ['run', 'Körning'],
              ['nulls', 'Nollfördelningar'],
              ['injection', 'Blind injection'],
            ] as [Tab, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                tab === id
                  ? 'border border-fuchsia-700 bg-fuchsia-950 text-fuchsia-200'
                  : 'text-neutral-400 hover:bg-neutral-900'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {tab === 'run' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
            <ControlPanel
              config={config}
              setConfig={setConfig}
              nullReplicates={nullReplicates}
              setNullReplicates={setNullReplicates}
            />
            <div className="space-y-4">
              <EventStreamView stream={stream} />
              <SignatureDashboard results={results} loading={loading} />
            </div>
          </div>
        )}

        {tab === 'nulls' && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {IMPLEMENTED_SIGNATURES.map((id) => (
                <button
                  key={id}
                  onClick={() => setSelectedSignature(id)}
                  className={`rounded-md px-3 py-1.5 text-sm font-mono ${
                    selectedSignature === id
                      ? 'border border-fuchsia-700 bg-fuchsia-950 text-fuchsia-200'
                      : 'border border-neutral-800 text-neutral-400 hover:bg-neutral-900'
                  }`}
                >
                  {id}
                </button>
              ))}
            </div>
            <NullDistributionPanel selected={selectedSignature} results={results} />
          </div>
        )}

        {tab === 'injection' && <InjectionStudyPanel config={config} nullReplicates={nullReplicates} />}

        <footer className="pb-6 text-center text-xs text-neutral-600">
          Pedagogisk Monte Carlo-prototyp och pipeline-validerare — inte ett färdigt vetenskapligt instrument.
        </footer>
      </div>
    </div>
  );
}
