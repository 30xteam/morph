import type { JevProvider } from '@/core/jev/jev.types';

import type { SegmentKey, StageKey, TrafficLight } from './segmentation.types';

export type LevelLabel = 'low' | 'medium' | 'high';

export interface GroundTruth {
  archetype: string;
  segment: SegmentKey;
  companyStage: StageKey;
  aiMaturity: LevelLabel;
  urgency: LevelLabel;
  salesReady: boolean;
  decisionPower: boolean;
  fitsOffer: boolean;
  wantsLearning: boolean;
  light: TrafficLight;
  note: string;
}

export type EvaluatedField =
  | 'segment'
  | 'companyStage'
  | 'aiMaturity'
  | 'urgency'
  | 'salesReady'
  | 'decisionPower'
  | 'fitsOffer'
  | 'wantsLearning'
  | 'light';

export type EvaluationMode = 'single' | 'consensus';

export interface SegmentationEvaluation {
  provider: JevProvider;
  calibrated: boolean;
  mode: EvaluationMode;
  total: number;
  jevCalls: number;
  segmentAccuracy: number;
  lightAccuracy: number;
  fieldAccuracy: Record<EvaluatedField, number>;
  lightConfusion: Record<TrafficLight, Record<TrafficLight, number>>;
  decidedAloneShare: number;
  accuracyWhenAlone: number;
  lightShare: Record<TrafficLight, number>;
  avgLatencyMs: number;
  p95LatencyMs: number;
  costPerThousandUsd: number;
  misses: {
    alias: string;
    expected: string;
    got: string;
    note: string;
    fields: EvaluatedField[];
  }[];
}
