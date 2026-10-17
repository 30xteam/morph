import type {
  DecisionAction,
  Level,
  RecommendationKind,
  SegmentKey,
  StageKey,
  TrafficLight,
  Trigger,
} from '../types/segmentation.types';

export const SEGMENT_LABELS: Record<SegmentKey, string> = {
  founder: 'Founder / CEO',
  team_lead: 'Team lead',
  individual_contributor: 'Specialist',
  student: 'Student / early career',
  investor: 'Investor',
  other: 'Other',
};

export const STAGE_LABELS: Record<StageKey, string> = {
  idea: 'Idea',
  early_stage: 'Early stage',
  scale_up: 'Scale-up',
  corporate: 'Corporate',
  other: 'Other',
};

export const MATURITY_LABELS: Record<Level, string> = {
  0: 'Low',
  1: 'Medium',
  2: 'High',
};

export const URGENCY_LABELS: Record<Level, string> = {
  0: 'Low',
  1: 'Medium',
  2: 'High',
};

export const LIGHT_LABELS: Record<TrafficLight, string> = {
  green: 'Talk to today',
  yellow: 'Keep warm',
  red: 'Needs a person',
};

export const LIGHT_HINTS: Record<TrafficLight, string> = {
  green:
    'Ready to buy, can approve the purchase and fits what 30X offers. A seller should reach out today.',
  yellow:
    'A good fit, but not ready yet. They get events, programs or content until something changes.',
  red: 'Jev is unsure or the person does not fit. Someone on the team decides; nobody is contacted automatically.',
};

export const ACTION_LABELS: Record<DecisionAction, string> = {
  auto: 'Jev decided',
  review: 'Check this',
  escalate: 'A person decides',
};

export const ACTION_HINTS: Record<DecisionAction, string> = {
  auto: 'Jev is very sure about the group, so it acts on its own.',
  review: 'Jev is fairly sure. Someone should confirm the group.',
  escalate: 'Jev is not sure or the group is “Other”. A person decides.',
};

export const QUESTION_LABELS = {
  segment: 'Group',
  companyStage: 'Company stage',
  aiMaturity: 'How much they use AI',
  urgency: 'How urgent their need is',
  salesReady: 'Ready to buy?',
  decisionPower: 'Can approve a purchase?',
  fitsOffer: 'Fits what 30X offers?',
  wantsLearning: 'Mainly wants to learn?',
} as const;

export const RECOMMENDATION_LABELS: Record<RecommendationKind, string> = {
  sales_conversation: 'Seller today',
  program: 'Program sequence',
  event: 'Event invite',
  content: 'Content sequence',
  human_review: 'Human review',
};

export const TRIGGER_LABELS: Record<Trigger, string> = {
  sign_up: 'signed up',
  manual_edit: 'profile edited',
  attended_event: 'attended another event',
  role_change: 'changed role',
  funding_round: 'company raised a round',
  re_run: 'was checked again',
};
