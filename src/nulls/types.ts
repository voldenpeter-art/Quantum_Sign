import type { NullId } from '../types/signatures';

export type { NullId };

export const NULL_DESCRIPTIONS: Record<NullId, string> = {
  S1: 'Permutation — bevarar marginaler, förstör korrelation',
  S2: 'Tidsförskjutning — bevarar rater, förstör äkta koincidenser',
  S3: 'Block-permutation — bevarar lokal temporal struktur',
  S4: 'Klassisk motståndare — värsta-fall detektorartefakt',
  S5: 'Driftsurrogat — testar långsam drift som konfundering',
};
