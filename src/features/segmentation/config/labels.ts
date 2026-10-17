import type {
  AffinityBand,
  DecisionAction,
  ProgramKey,
  RecommendationKind,
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
