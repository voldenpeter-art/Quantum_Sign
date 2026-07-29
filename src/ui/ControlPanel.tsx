import type { Dispatch, SetStateAction } from 'react';
import type { RunConfig, SourceType } from '../types/config';
import { Slider } from './Slider';

const SOURCE_LABELS: Record<SourceType, string> = {
  thermal: 'Termisk (kaotisk)',
  coherent: 'Koherent (laser)',
  singleEmitter: 'Enfotonkälla',
  entangled: 'Entanglad parkälla',
  memoryEcho: 'Minneskälla (eko)',
};

interface ControlPanelProps {
  config: RunConfig;
  setConfig: Dispatch<SetStateAction<RunConfig>>;
  nullReplicates: number;
  setNullReplicates: Dispatch<SetStateAction<number>>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 border-t border-neutral-800 pt-4 first:border-t-0 first:pt-0">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function ControlPanel({ config, setConfig, nullReplicates, setNullReplicates }: ControlPanelProps) {
  return (
    <div className="space-y-5 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <Section title="Källa">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-neutral-300">Källtyp</span>
          <select
            className="rounded-md border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-neutral-100"
            value={config.source}
            onChange={(e) => setConfig((c) => ({ ...c, source: e.target.value as SourceType }))}
          >
            {(Object.keys(SOURCE_LABELS) as SourceType[]).map((s) => (
              <option key={s} value={s}>
                {SOURCE_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
        <Slider
          label="Källtakt"
          value={config.sourceRateHz}
          min={10}
          max={2000}
          step={10}
          unit="Hz"
          onChange={(v) => setConfig((c) => ({ ...c, sourceRateHz: v }))}
        />
        <Slider
          label="Mätfönster"
          value={config.duration}
          min={2}
          max={120}
          step={1}
          unit="s"
          onChange={(v) => setConfig((c) => ({ ...c, duration: v }))}
        />
        <Slider
          label="Seed (reproducerbarhet)"
          value={config.seed}
          min={1}
          max={9999}
          step={1}
          onChange={(v) => setConfig((c) => ({ ...c, seed: v }))}
        />
      </Section>

      <Section title="Förhållanden (krafter)">
        <Slider
          label="Temperatur"
          value={config.conditions.temperatureK}
          min={1}
          max={1000}
          step={1}
          unit="K"
          onChange={(v) => setConfig((c) => ({ ...c, conditions: { ...c.conditions, temperatureK: v } }))}
          hint="Styr termiskt medelfotontal och Arrhenius-relaxation."
        />
        <Slider
          label="Fält / spänning"
          value={config.conditions.fieldVoltage}
          min={0}
          max={10}
          step={0.1}
          onChange={(v) => setConfig((c) => ({ ...c, conditions: { ...c.conditions, fieldVoltage: v } }))}
          hint="Defasningsproxy — sänker synlighet/kontrast (entangled)."
        />
        <Slider
          label="Strålning / pumpintensitet"
          value={config.conditions.radiationDose}
          min={0}
          max={5}
          step={0.05}
          onChange={(v) => setConfig((c) => ({ ...c, conditions: { ...c.conditions, radiationDose: v } }))}
          hint="Skalar takt och bakgrund. 1.0 = nominell."
        />
        <Slider
          label="Aktiveringsenergi E_a"
          value={config.conditions.activationEnergyEV}
          min={0.05}
          max={2}
          step={0.05}
          unit="eV"
          onChange={(v) => setConfig((c) => ({ ...c, conditions: { ...c.conditions, activationEnergyEV: v } }))}
          hint="Arrhenius-barriär för sönderfall/relaxation (singleEmitter/memoryEcho)."
        />
      </Section>

      <Section title="Detektor">
        <Slider
          label="Förlust"
          value={config.detector.lossPct}
          min={0}
          max={99}
          step={1}
          unit="%"
          onChange={(v) => setConfig((c) => ({ ...c, detector: { ...c.detector, lossPct: v } }))}
        />
        <Slider
          label="Jitter"
          value={config.detector.jitterPs}
          min={0}
          max={500_000}
          step={1000}
          unit="ps"
          onChange={(v) => setConfig((c) => ({ ...c, detector: { ...c.detector, jitterPs: v } }))}
        />
        <Slider
          label="Dödtid"
          value={config.detector.deadTimeNs}
          min={0}
          max={500}
          step={1}
          unit="ns"
          onChange={(v) => setConfig((c) => ({ ...c, detector: { ...c.detector, deadTimeNs: v } }))}
        />
        <Slider
          label="Efterpuls-sannolikhet"
          value={config.detector.afterpulseProb}
          min={0}
          max={0.3}
          step={0.005}
          onChange={(v) => setConfig((c) => ({ ...c, detector: { ...c.detector, afterpulseProb: v } }))}
        />
        <Slider
          label="Mörkerräknetakt"
          value={config.detector.darkCountRateHz}
          min={0}
          max={1000}
          step={5}
          unit="Hz"
          onChange={(v) => setConfig((c) => ({ ...c, detector: { ...c.detector, darkCountRateHz: v } }))}
        />
        <Slider
          label="Crosstalk-sannolikhet"
          value={config.detector.crosstalkProb}
          min={0}
          max={0.2}
          step={0.005}
          onChange={(v) => setConfig((c) => ({ ...c, detector: { ...c.detector, crosstalkProb: v } }))}
        />
      </Section>

      <Section title="Precision">
        <Slider
          label="Surrogat per nulltyp"
          value={nullReplicates}
          min={3}
          max={200}
          step={1}
          onChange={setNullReplicates}
          hint="Empiriskt p har ett golv på 1/(N+1) PER familj (p⁽²⁾-regeln väger per familj). En strukturell/kvantklass vid tröskel 1e-2 kräver därför ≥~100 surrogat/familj — högre = skarpare men långsammare."
        />
      </Section>
    </div>
  );
}
