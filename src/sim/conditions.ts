// "Förhållanden"/krafter-lager: kopplar de yttre villkoren (temperatur, fält/
// spänning, strålning, aktiveringsenergi) till konkreta simuleringsparametrar.
//
// VIKTIGT (se CLAUDE.md §2 "Hitta inte på"): ingen av dessa kopplingar är
// specificerad i någon signaturrapport — katalogen tar inte ställning till
// "voltage"/"radiation"/"decay" som fysikaliska drivrutiner för A–F. Varje
// koppling nedan är en medvetet enkel, namngiven approximation för en
// pedagogisk, interaktiv simulator, inte ett kalibrerat instrumentsvar.
// TODO(rapport): ersätt med riktig modell om/när Signaturtyp J (se
// rapporter/Signaturtypning.txt) konsolideras och en verklig E_a/T/fält-modell
// specificeras.

import type { Conditions } from '../types/config';

const KB_EV_PER_K = 8.617333262e-5; // Boltzmanns konstant, eV/K
const T_REF_K = 300;

export interface ConditionEffects {
  /** Källans effektiva händelsetakt efter temperatur-/strålningsskalning (Hz). */
  effectiveRateHz: number;
  /** Bakgrunds-/mörkerräknetakt efter strålningsskalning (Hz). */
  backgroundRateHz: number;
  /**
   * Extra defasning/dekorrelation ∈ [0, 1) från fält/spänning. Tillämpas som
   * sannolikhet att slumpa om ett annars korrelerat utfall (Stark-liknande
   * defasningsproxy — inte en Lindblad-kanal).
   */
  decoherence: number;
  /** Relativ Arrhenius-faktor exp(-Ea/kB · (1/T − 1/T_ref)) — dimensionslös. */
  arrheniusFactor: number;
  /** Termisk koherenstid (s), krymper med temperatur. */
  thermalCoherenceTimeS: number;
}

export function computeConditionEffects(
  baseRateHz: number,
  baseBackgroundHz: number,
  conditions: Conditions,
): ConditionEffects {
  const { temperatureK, fieldVoltage, radiationDose, activationEnergyEV } = conditions;

  const tempFactor = Math.max(temperatureK, 1) / T_REF_K;
  const effectiveRateHz = baseRateHz * radiationDose;
  const backgroundRateHz = baseBackgroundHz * radiationDose * (0.5 + 0.5 * tempFactor);

  const decoherence = Math.min(0.95, Math.max(0, fieldVoltage / 10));

  const arrheniusFactor = Math.exp(
    (-activationEnergyEV / KB_EV_PER_K) * (1 / Math.max(temperatureK, 1) - 1 / T_REF_K),
  );

  // Högre temperatur -> snabbare defasning -> kortare koherenstid.
  const thermalCoherenceTimeS = 0.02 / tempFactor;

  return {
    effectiveRateHz,
    backgroundRateHz,
    decoherence,
    arrheniusFactor,
    thermalCoherenceTimeS,
  };
}
