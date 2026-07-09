import type { SourceType } from '../../types/config';
import type { SourceGenerator } from './types';
import { generateThermal } from './thermal';
import { generateCoherent } from './coherent';
import { generateSingleEmitter } from './singleEmitter';
import { generateEntangled } from './entangled';
import { generateMemoryEcho } from './memoryEcho';

export const SOURCE_REGISTRY: Record<SourceType, SourceGenerator> = {
  thermal: generateThermal,
  coherent: generateCoherent,
  singleEmitter: generateSingleEmitter,
  entangled: generateEntangled,
  memoryEcho: generateMemoryEcho,
};

/** Källor som producerar två fysiska armar (A/B) snarare än en HBT-delad ström. */
export const TWO_ARM_SOURCES: SourceType[] = ['entangled'];

export * from './types';
