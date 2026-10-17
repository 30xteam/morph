import type {
  AffinityBand,
  DecisionAction,
  ProgramKey,
  Reason,
  ReasonCode,
  Recommendation,
  RecommendationKind,
  ReviewReason,
  SegmentKey,
  TrafficLight,
  Trigger,
} from '../types/segmentation.types';

export const SEGMENT_LABELS: Record<SegmentKey, string> = {
  founder: 'Founder / CEO',
  executive: 'Executive',
  sales_leader: 'Sales leader',
  manager: 'Manager',
  technical: 'Technical',
  unknown: 'Unknown role',
};

export const PROGRAM_LABELS: Record<ProgramKey, string> = {
  ai_sales: 'AI Sales',
  inmersion_ejecutiva: 'Inmersión Ejecutiva',
  sales_machine: 'Sales Machine',
  hardcore_ai: 'Hardcore AI',
  achievers: 'Achievers',
  none: 'No program yet',
};

export const AFFINITY_LABELS: Record<AffinityBand, string> = {
  low: 'Low (0-3)',
  medium: 'Medium (4-6)',
  high: 'High (7-8)',
  very_high: 'Very high (9-10)',
};

export const LIGHT_LABELS: Record<TrafficLight, string> = {
  green: 'Green · seller',
  yellow: 'Yellow · nurture',
  red: 'Red · person reviews',
};

export const ACTION_LABELS: Record<DecisionAction, string> = {
  auto: 'Jev acts',
  review: 'Needs review',
  escalate: 'Escalated to a person',
};

export const RECOMMENDATION_LABELS: Record<RecommendationKind, string> = {
  sales_conversation: 'Seller today',
  nurture: 'Nurture sequence',
  event: 'Event invite',
  human_review: 'Human review',
};

export const TRIGGER_LABELS: Record<Trigger, string> = {
  sign_up: 'signed up on Luma',
  manual_edit: 'profile edited',
  attended_event: 'checked in at an event',
  role_change: 'changed role',
  funding_round: 'company raised a round',
  re_run: 'was decided',
};

export const REVIEW_REASON_LABELS: Record<ReviewReason, string> = {
  low_confidence: 'Low confidence',
  low_info: 'Low info',
};

const REASON_LABELS: Record<ReasonCode, string> = {
  no_program: 'No 30X program fits yet',
  low_affinity: 'Affinity is low (0-3)',
  program_unsure: 'Program confidence {p} is too low to act',
  medium_affinity: 'Affinity is only medium (4-6)',
  not_ready: 'Not ready to buy yet ({p})',
  may_not_decide: 'May not decide the purchase ({p})',
  program_check: 'Program confidence {p}',
  strong_fit: 'Strong fit: program {p}, ready to buy and decides',
};

export function describeReason({ code, probability }: Reason) {
  return REASON_LABELS[code].replace('{p}', `${Math.round((probability ?? 0) * 100)}%`);
}

const RECOMMENDATION_TITLES: Record<RecommendationKind, string> = {
  sales_conversation: 'Hand to a seller today: offer {program}',
  nurture: 'Nurture toward {program}',
  event: 'Invite to a free session related to {program}',
  human_review: 'A person reviews this profile',
};

export function recommendationTitle({ kind, program }: Recommendation) {
  return RECOMMENDATION_TITLES[kind].replace('{program}', PROGRAM_LABELS[program]);
}
