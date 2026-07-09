// Körningskonfiguration (CLAUDE.md §9): seed, källval, "förhållanden" (villkor/krafter),
// detektorparametrar, vald analys, valda nulls.

export type SourceType =
  | 'thermal'
  | 'coherent'
  | 'singleEmitter'
  | 'entangled'
  | 'memoryEcho';

/**
 * "Förhållanden" — de yttre krafter/villkor uppgiften efterfrågar (spänning,
 * strålning/energitillförsel, temperatur, sönderfall). Ingen av dessa är
 * definierad i någon signaturrapport ännu; kopplingarna nedan är medvetet
 * enkla, namngivna approximationer (se sim/conditions.ts för fysikmotivering
 * och TODO(rapport)-markeringar där katalogen inte tar ställning).
 */
export interface Conditions {
  /** Temperatur (K). Driver termiskt medelfotontal (~Bose–Einstein-liknande) och Arrhenius-hastigheter. */
  temperatureK: number;
  /** Externt fält/spänning (godtycklig enhet, 0–10). Ökad defasning → sänkt synlighet/kontrast. */
  fieldVoltage: number;
  /** Strålnings-/pumpintensitet relativt baslinje (1.0 = nominell). Skalar bakgrunds- och pumptakt. */
  radiationDose: number;
  /** Aktiveringsenergi E_a (eV) för Arrhenius-sönderfall/relaxation (Signaturtyp J-idé, se rapporter/). */
  activationEnergyEV: number;
}

export interface DetectorParams {
  lossPct: number;
  jitterPs: number;
  deadTimeNs: number;
  afterpulseProb: number;
  afterpulseTauNs: number;
  darkCountRateHz: number;
  crosstalkProb: number;
}

export interface CHSHSettings {
  /** Analysatorvinklar (grader) för respektive arm, två inställningar (x=0/1, y=0/1). */
  A: [number, number];
  B: [number, number];
}

export interface RunConfig {
  seed: number;
  duration: number;
  source: SourceType;
  sourceRateHz: number;
  conditions: Conditions;
  detector: DetectorParams;
  chsh: CHSHSettings;
}

export const DEFAULT_CONDITIONS: Conditions = {
  temperatureK: 300,
  fieldVoltage: 0,
  radiationDose: 1,
  activationEnergyEV: 0.5,
};

export const DEFAULT_DETECTOR: DetectorParams = {
  lossPct: 30,
  jitterPs: 50_000,
  deadTimeNs: 50,
  afterpulseProb: 0.02,
  afterpulseTauNs: 40,
  darkCountRateHz: 100,
  crosstalkProb: 0.01,
};

export const DEFAULT_CHSH: CHSHSettings = {
  A: [0, 45],
  B: [22.5, 67.5],
};

export const DEFAULT_CONFIG: RunConfig = {
  seed: 1,
  duration: 20,
  source: 'singleEmitter',
  sourceRateHz: 200,
  conditions: DEFAULT_CONDITIONS,
  detector: DEFAULT_DETECTOR,
  chsh: DEFAULT_CHSH,
};
