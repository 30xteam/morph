import type { SegmentationOutcome, TrafficLight } from '../types/segmentation.types';

export type PriorityLevel = 'high' | 'medium' | 'low' | 'pending';

export interface ProfilePriority {
  level: PriorityLevel;
  label: string;
  short: string;
  rank: number;
  reason: string;
  needsReview: boolean;
}

const PRIORITIES: Record<PriorityLevel, Omit<ProfilePriority, 'needsReview'>> = {
  high: {
    level: 'high',
    label: 'P1 · High',
    short: 'P1',
    rank: 1,
    reason: 'Contact today: strong program fit, buying intent and purchase authority.',
  },
  medium: {
    level: 'medium',
    label: 'P2 · Medium',
    short: 'P2',
    rank: 2,
    reason: 'Follow up and nurture: a program fits, but commercial readiness is incomplete.',
  },
  low: {
    level: 'low',
    label: 'P3 · Low',
    short: 'P3',
    rank: 3,
    reason: 'Not qualified for outreach yet: check fit and information before contacting.',
  },
  pending: {
    level: 'pending',
    label: 'Not evaluated',
    short: '—',
    rank: 4,
    reason: 'Run Jev to assess commercial priority. Missing decisions are not low priority.',
  },
};

const LIGHT_PRIORITY: Record<TrafficLight, PriorityLevel> = {
  green: 'high',
  yellow: 'medium',
  red: 'low',
};

export function profilePriority(outcome?: SegmentationOutcome): ProfilePriority {
  const level = outcome ? LIGHT_PRIORITY[outcome.light] : 'pending';
  return { ...PRIORITIES[level], needsReview: outcome?.needsReview ?? false };
}
