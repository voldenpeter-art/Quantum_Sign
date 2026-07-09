import type { Rng } from '../rng';
import type { Conditions, CHSHSettings } from '../../types/config';
import type { PhotonEvent } from '../../types/events';
import type { ConditionEffects } from '../conditions';

export interface SourceContext {
  rng: Rng;
  duration: number;
  rateHz: number;
  conditions: Conditions;
  effects: ConditionEffects;
  chsh: CHSHSettings;
}

export type SourceGenerator = (ctx: SourceContext) => PhotonEvent[];
