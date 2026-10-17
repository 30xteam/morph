import type { JevProvider } from '@/core/jev/jev.types';

import type { AffinityBand, ProgramKey, SegmentKey, TrafficLight } from './segmentation.types';

export interface GroundTruth {
  program: ProgramKey;
  affinity: number;
  affinityBand: AffinityBand;
  role: SegmentKey;
  infoLevel: 'Alta' | 'Media' | 'Baja';
}

export type EvaluationMode = 'single' | 'consensus';

export interface SegmentationEvaluation {
  provider: JevProvider;
  calibrated: boolean;
  mode: EvaluationMode;
  total: number;
  jevCalls: number;
  programAccuracy: number;
  affinityAccuracy: number;
  affinityWithinOneBand: number;
  roleAccuracyKnown: number;
  knownRoles: number;
  decidedAloneShare: number;
  programAccuracyWhenAlone: number;
  programAccuracyByInfo: Record<string, { total: number; accuracy: number }>;
  programConfusion: Record<ProgramKey, Record<ProgramKey, number>>;
  lightShare: Record<TrafficLight, number>;
  avgLatencyMs: number;
  p95LatencyMs: number;
  costPerThousandUsd: number;
  misses: { alias: string; expected: string; got: string; note: string }[];
}
