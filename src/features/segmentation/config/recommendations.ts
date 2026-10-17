import type {
  AffinityBand,
  Profile,
  ProgramKey,
  Recommendation,
  SegmentKey,
  TrafficLight,
} from '../types/segmentation.types';
import { AFFINITY_LABELS, PROGRAM_LABELS, SEGMENT_LABELS } from './labels';
import { THRESHOLDS } from './thresholds';

interface RecommendationInput {
  light: TrafficLight;
  segment: SegmentKey;
  program: ProgramKey;
  affinity: AffinityBand;
  wantsLearning: number;
  profile: Profile;
}

function context(profile: Profile) {
  const parts = [`goal: ${profile.goal}`];
  if (profile.pain !== 'No declaró ningún dolor') parts.push(`pain: ${profile.pain}`);
  if (profile.topics.length) parts.push(`topics: ${profile.topics.join(', ')}`);
  return parts.join(' · ');
}

export function recommend(input: RecommendationInput): Recommendation {
  const { light, segment, program, affinity, wantsLearning, profile } = input;
  const name = PROGRAM_LABELS[program];

  if (light === 'red') {
    return {
      kind: 'human_review',
      title: 'A person reviews this profile',
      detail: `No confident program match yet. ${context(profile)}.`,
    };
  }

  if (light === 'green') {
    return {
      kind: 'sales_conversation',
      title: `Hand to a seller today: offer ${name}`,
      detail: `${SEGMENT_LABELS[segment]} · ${AFFINITY_LABELS[affinity].toLowerCase()} affinity with ${name}. ${context(profile)}.`,
    };
  }

  if (wantsLearning >= THRESHOLDS.wantsLearning) {
    return {
      kind: 'event',
      title: `Invite to a free session related to ${name}`,
      detail: `Learning intent first: free session and content, then re-decide when activity changes. ${context(profile)}.`,
    };
  }

  return {
    kind: 'nurture',
    title: `Nurture toward ${name}`,
    detail: `Send ${name} content and case studies until intent grows. ${context(profile)}.`,
  };
}
