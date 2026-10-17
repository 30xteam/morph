import type { JevProvider } from '@/core/jev/jev.types';

import type { Profile, Signals } from './profile.schema';

export type { Profile, Signals };

export type SegmentKey =
  | 'founder'
  | 'team_lead'
  | 'individual_contributor'
  | 'student'
  | 'investor'
  | 'other';

export type StageKey = 'idea' | 'early_stage' | 'scale_up' | 'corporate' | 'other';

export type Level = 0 | 1 | 2;

export type TrafficLight = 'green' | 'yellow' | 'red';

export type DecisionAction = 'auto' | 'review' | 'escalate';

export type ActionQuestion =
  | 'segment'
  | 'companyStage'
  | 'aiMaturity'
  | 'salesReady'
  | 'wantsLearning';

export type Trigger =
  | 'sign_up'
  | 'manual_edit'
  | 'attended_event'
  | 'role_change'
  | 'funding_round'
  | 're_run';

export type RecommendationKind =
  | 'sales_conversation'
  | 'program'
  | 'event'
  | 'content'
  | 'human_review';

export interface Decision<T> {
  value: T;
  probability: number;
  alternatives: { value: T; probability: number }[];
}

export interface Recommendation {
  kind: RecommendationKind;
  title: string;
  detail: string;
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
  companyStage: Decision<StageKey>;
  aiMaturity: Decision<Level>;
  urgency: Decision<Level>;
  salesReady: number;
  wantsLearning: number;
  decisionPower: number;
  fitsOffer: number;
  light: TrafficLight;
  action: DecisionAction;
  questionActions: Record<ActionQuestion, DecisionAction>;
  needsReview: boolean;
  reasons: string[];
  recommendation: Recommendation;
  meta: DecisionMeta;
}

export type ReviewVerdict = { verdict: 'approved' } | { verdict: 'corrected'; segment: SegmentKey };

export interface RecalculateResult {
  previous: SegmentationOutcome;
  current: SegmentationOutcome;
  changed: { segment: boolean; light: boolean; action: boolean };
}
