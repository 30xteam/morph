import type { JevProvider } from '@/core/jev/jev.types';

import type { Profile, Signals } from './profile.schema';

export type { Profile, Signals };

export type SegmentKey =
  | 'founder'
  | 'executive'
  | 'sales_leader'
  | 'manager'
  | 'technical'
  | 'unknown';

export type ProgramKey =
  | 'ai_sales'
  | 'inmersion_ejecutiva'
  | 'sales_machine'
  | 'hardcore_ai'
  | 'achievers'
  | 'none';

export type AffinityBand = 'low' | 'medium' | 'high' | 'very_high';

export type TrafficLight = 'green' | 'yellow' | 'red';

export type DecisionAction = 'auto' | 'review' | 'escalate';

export type ActionQuestion = 'segment' | 'program' | 'affinity' | 'salesReady' | 'wantsLearning';

export type Trigger =
  | 'sign_up'
  | 'manual_edit'
  | 'attended_event'
  | 'role_change'
  | 'funding_round'
  | 're_run';

export type RecommendationKind = 'sales_conversation' | 'nurture' | 'event' | 'human_review';

export type ReviewReason = 'low_confidence' | 'low_info';

export type SignalKey =
  | 'relation'
  | 'crmStage'
  | 'role'
  | 'pain'
  | 'goal'
  | 'topics'
  | 'country'
  | 'currentProgram';

export type ReasonCode =
  | 'no_program'
  | 'low_affinity'
  | 'program_unsure'
  | 'medium_affinity'
  | 'not_ready'
  | 'may_not_decide'
  | 'program_check'
  | 'strong_fit';

export interface Reason {
  code: ReasonCode;
  probability?: number;
}

export interface Decision<T> {
  value: T;
  probability: number;
  alternatives: { value: T; probability: number }[];
}

export interface Recommendation {
  kind: RecommendationKind;
  program: ProgramKey;
}

export interface DecisionMeta {
  provider: JevProvider;
  model: string;
  calibrated: boolean;
  latencyMs: number;
  inputTokens: number;
  costUsd: number;
  decidedAt: string;
}

export interface SegmentationOutcome {
  profileId: string;
  trigger: Trigger;
  segment: Decision<SegmentKey>;
  program: Decision<ProgramKey>;
  affinity: Decision<AffinityBand>;
  salesReady: number;
  decisionPower: number;
  wantsLearning: number;
  light: TrafficLight;
  action: DecisionAction;
  questionActions: Record<ActionQuestion, DecisionAction>;
  needsReview: boolean;
  reviewReason: ReviewReason | null;
  missingSignals: SignalKey[];
  reasons: Reason[];
  recommendation: Recommendation;
  meta: DecisionMeta;
}

export type ReviewVerdict = { verdict: 'approved' } | { verdict: 'corrected'; program: ProgramKey };

export interface RecalculateResult {
  previous: SegmentationOutcome;
  current: SegmentationOutcome;
  changed: {
    segment: boolean;
    program: boolean;
    affinity: boolean;
    light: boolean;
    action: boolean;
  };
}

export type BatchItem = { outcome: SegmentationOutcome } | { profileId: string; error: string };
